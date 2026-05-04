#!/usr/bin/env node
// Daily backup — Layer 1 of the data resilience plan (v2).
//
// Flow (per plan v2):
//   1. wrangler d1 export --remote → temp .sql file
//   2. Build manifest (schema sha256, per-table counts, worker SHA, wrangler version)
//   3. gzip the dump
//   4. age-encrypt (asymmetric, public key only — private key never enters CI)
//   5. Determine target paths: always daily/, conditionally monthly/, yearly/
//   6. Upload encrypted file + manifest to B2 with Object Lock retention
//   7. Write a summary artefact at process-gate-artefacts/daily-backup-<date>.json
//
// On any failure: send a Resend alert email, write a failure artefact, exit non-zero.
//
// Required env vars:
//   CLOUDFLARE_API_TOKEN     wrangler auth (already used by existing workflows)
//   CLOUDFLARE_ACCOUNT_ID    wrangler auth
//   B2_KEY_ID                Backblaze B2 application key id (write-scoped)
//   B2_APPLICATION_KEY       Backblaze B2 application key
//   RESEND_API_KEY           Resend API key (sending access)
//   RESEND_TO_EMAIL          recipient (Ben's verified email)
//
// Public age recipient key is embedded as a constant — not a secret, audit trail in git.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as age from 'age-encryption';

import { d1Export, WORKER_DIRECTORY } from './lib/wrangler.mjs';
import { uploadOnce, retainUntil } from './lib/b2.mjs';
import { alertFailure } from './lib/resend.mjs';
import { buildManifest } from './lib/manifest.mjs';

// Public age recipient key — backups are encrypted to this key.
// Private key lives in: Ben's password manager + paper in home safe + paper with family.
// Generated 4 May 2026.
const BACKUP_RECIPIENT_PUBLIC_KEY =
  'age1elquppalxlqlew5nzcjl9rhad904mqd7jk5zltpr33hq6p6rt4tqka38cl';

// Object Lock retention durations (days). Aligned with B2 lifecycle rules
// so the lock expires just before lifecycle deletion fires.
const RETENTION_DAYS = {
  daily: 30,    // lifecycle hides at 30, deletes at 31
  monthly: 365, // lifecycle hides at 365, deletes at 366
  yearly: 1825, // 5y; no lifecycle rule, so kept forever
};

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const ARTEFACT_DIR = resolve(REPO_ROOT, 'process-gate-artefacts');
const DB_NAME = '11plus-user-data';

function envOrThrow(name) {
  const v = process.env[name];
  if (!v) throw new Error(`required env var ${name} is not set`);
  return v;
}

function ensureArtefactDir() {
  if (!existsSync(ARTEFACT_DIR)) mkdirSync(ARTEFACT_DIR, { recursive: true });
}

// Decide which lifecycle paths to write to today, based on the date.
function targetPathsForDate(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const dayKey = `${yyyy}-${mm}-${dd}`;

  const targets = [
    { kind: 'daily', dateKey: dayKey, retentionDays: RETENTION_DAYS.daily },
  ];
  if (date.getUTCDate() === 1) {
    targets.push({ kind: 'monthly', dateKey: `${yyyy}-${mm}-01`, retentionDays: RETENTION_DAYS.monthly });
  }
  if (date.getUTCMonth() === 0 && date.getUTCDate() === 1) {
    targets.push({ kind: 'yearly', dateKey: `${yyyy}-01-01`, retentionDays: RETENTION_DAYS.yearly });
  }
  return targets;
}

async function encryptToBytes(plaintextBytes, recipientKey) {
  const encrypter = new age.Encrypter();
  encrypter.addRecipient(recipientKey);
  return await encrypter.encrypt(plaintextBytes);
}

async function main() {
  ensureArtefactDir();
  const startedAt = new Date();
  const dateKey = startedAt.toISOString().slice(0, 10);
  const summaryPath = resolve(ARTEFACT_DIR, `daily-backup-${dateKey}.json`);
  const summary = {
    started_at: startedAt.toISOString(),
    date_key: dateKey,
    targets: [],
    uploads: [],
    status: 'in_progress',
  };

  try {
    // 1. Export production D1
    const dumpPath = resolve(tmpdir(), `d1-prod-dump-${Date.now()}.sql`);
    console.log(`[daily-backup] exporting production D1 → ${dumpPath}`);
    d1Export({ output: dumpPath, target: 'remote' });

    // 2. Build manifest
    const dumpBytes = readFileSync(dumpPath);
    const gzipped = gzipSync(dumpBytes);
    const encrypted = await encryptToBytes(gzipped, BACKUP_RECIPIENT_PUBLIC_KEY);
    const encryptedFileName = `${DB_NAME}-${dateKey}.sql.gz.age`;

    // Write encrypted to a temp file just for manifest hashing convenience
    const encryptedTmpPath = resolve(tmpdir(), `${encryptedFileName}.${Date.now()}`);
    writeFileSync(encryptedTmpPath, encrypted);

    const manifest = buildManifest({
      dumpSqlPath: dumpPath,
      encryptedFilePath: encryptedTmpPath,
      encryptedFileName,
      workerCwd: WORKER_DIRECTORY,
    });
    const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2));
    summary.manifest = manifest;
    console.log(`[daily-backup] manifest built — ${manifest.row_count_total} rows across ${Object.keys(manifest.per_table_counts).length} tables`);

    // 3. Determine target paths
    const targets = targetPathsForDate(startedAt);
    summary.targets = targets.map(t => `${t.kind}/${t.dateKey}/`);
    console.log(`[daily-backup] targets: ${summary.targets.join(', ')}`);

    // 4. Upload to each target
    const keyId = envOrThrow('B2_KEY_ID');
    const applicationKey = envOrThrow('B2_APPLICATION_KEY');

    for (const target of targets) {
      const prefix = `${target.kind}/${target.dateKey}`;
      const retainMs = retainUntil(target.retentionDays);

      console.log(`[daily-backup] uploading to ${prefix}/${encryptedFileName} (retention ${target.retentionDays}d)`);
      const encUploadResult = await uploadOnce({
        keyId,
        applicationKey,
        fileName: `${prefix}/${encryptedFileName}`,
        body: encrypted,
        retainUntilMs: retainMs,
      });

      console.log(`[daily-backup] uploading manifest to ${prefix}/manifest.json`);
      const manUploadResult = await uploadOnce({
        keyId,
        applicationKey,
        fileName: `${prefix}/manifest.json`,
        body: manifestBytes,
        retainUntilMs: retainMs,
        contentType: 'application/json',
      });

      summary.uploads.push({
        prefix,
        retention_days: target.retentionDays,
        encrypted: { fileId: encUploadResult.fileId, sha1: encUploadResult.contentSha1 },
        manifest: { fileId: manUploadResult.fileId, sha1: manUploadResult.contentSha1 },
      });
    }

    summary.status = 'ok';
    summary.finished_at = new Date().toISOString();
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`[daily-backup] OK — summary written to ${summaryPath}`);
    process.exit(0);
  } catch (err) {
    summary.status = 'failed';
    summary.finished_at = new Date().toISOString();
    summary.error = { message: err.message, stack: err.stack };
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.error('[daily-backup] FAILED:', err.message);

    // Best-effort alert
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.RESEND_TO_EMAIL;
      if (apiKey && to) {
        await alertFailure({
          apiKey,
          to,
          subject: `Daily backup FAILED on ${dateKey}`,
          body:
`Daily backup failed at ${summary.finished_at}.

Error:
  ${err.message}

Targets attempted:
${summary.targets.length ? summary.targets.map(t => `  - ${t}`).join('\n') : '  (none reached upload stage)'}

Uploads completed before failure:
${summary.uploads.length ? summary.uploads.map(u => `  - ${u.prefix}/`).join('\n') : '  (none)'}

Investigate the GitHub Actions run for full logs and stack trace.

Stack:
${err.stack}`,
        });
        console.error('[daily-backup] failure alert email sent');
      } else {
        console.error('[daily-backup] cannot send failure email — RESEND_API_KEY or RESEND_TO_EMAIL not set');
      }
    } catch (alertErr) {
      console.error('[daily-backup] also failed to send failure email:', alertErr.message);
    }

    process.exit(1);
  }
}

main();

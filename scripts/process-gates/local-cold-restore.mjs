#!/usr/bin/env node
// Local cold-restore drill — Layer 1.
//
// Ben runs this on his Windows machine. The private age key NEVER enters
// CI; this script reads it from a local file (env BACKUP_KEY_FILE,
// default ~/.config/11plus-backup-key.txt).
//
// Two modes (--source flag):
//   latest-daily   (default) — fetches the freshest object under daily/.
//                              Run weekly. Validates "today's data is recoverable".
//   oldest-monthly         — fetches the OLDEST object under monthly/.
//                              Run quarterly (after the GH cron pings via Resend).
//                              Validates long-tail bit-rot resistance.
//
// The drill:
//
//   1. Authorize with B2 + list daily/ → find newest object pair (encrypted + manifest)
//   2. Download both files
//   3. Decrypt with the local private key
//   4. Decompress (gunzip)
//   5. Import to a throwaway SQLite DB at ~/.cache/11plus-cold-restore/<date>.db
//   6. Run PRAGMA integrity_check (must return "ok")
//   7. Compute schema sha256 from the imported DB; must match manifest
//   8. Per-table COUNT(*) in imported DB; must equal manifest exactly
//   9. Write summary artefact at process-gate-artefacts/last-manual-cold-restore-<date>.json
//   10. Print PASS/FAIL summary
//
// Required env vars:
//   B2_KEY_ID, B2_APPLICATION_KEY  — same as daily-backup
//   BACKUP_KEY_FILE                — path to file containing AGE-SECRET-KEY-... line
//                                    (default: ~/.config/11plus-backup-key.txt)

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import * as age from 'age-encryption';

import { authorize, listFileNames, downloadFile } from './lib/b2.mjs';
import { schemaSha256FromDump } from './lib/manifest.mjs';
import { reorderDump } from './lib/dump-preprocess.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const ARTEFACT_DIR = resolve(REPO_ROOT, 'process-gate-artefacts');

const SOURCES = {
  'latest-daily': { prefix: 'daily/', pick: 'newest', summaryPrefix: 'last-manual-cold-restore' },
  'oldest-monthly': { prefix: 'monthly/', pick: 'oldest', summaryPrefix: 'last-quarterly-cold-restore' },
};

function parseArgs(argv) {
  const out = { source: 'latest-daily' };
  for (const a of argv) {
    if (a.startsWith('--source=')) {
      const v = a.slice(9);
      if (!SOURCES[v]) {
        throw new Error(`unknown --source=${v}, valid: ${Object.keys(SOURCES).join(', ')}`);
      }
      out.source = v;
    }
  }
  return out;
}

function envOrThrow(name) {
  const v = process.env[name];
  if (!v) throw new Error(`required env var ${name} is not set`);
  return v;
}

function defaultKeyPath() {
  return resolve(homedir(), '.config', '11plus-backup-key.txt');
}

function readPrivateKey() {
  const p = process.env.BACKUP_KEY_FILE || defaultKeyPath();
  if (!existsSync(p)) {
    throw new Error(
      `Private key file not found at ${p}.\n\n` +
      `Set up:\n` +
      `  mkdir -p $(dirname '${p}')\n` +
      `  echo 'AGE-SECRET-KEY-...your-key...' > '${p}'\n` +
      `  chmod 600 '${p}'  # only effective on Unix; on Windows rely on user folder ACL\n\n` +
      `Or set BACKUP_KEY_FILE env var to point at a different location.`
    );
  }
  const contents = readFileSync(p, 'utf8');
  const m = contents.match(/AGE-SECRET-KEY-[A-Z0-9]+/);
  if (!m) {
    throw new Error(`No AGE-SECRET-KEY-... line found in ${p}. File is malformed.`);
  }
  return m[0];
}

function ensureArtefactDir() {
  if (!existsSync(ARTEFACT_DIR)) mkdirSync(ARTEFACT_DIR, { recursive: true });
}

async function decryptToBytes(ciphertext, identity) {
  const decrypter = new age.Decrypter();
  decrypter.addIdentity(identity);
  return await decrypter.decrypt(ciphertext);
}

// Compute schema sha256 by reading CREATE statements from a live SQLite DB.
// Mirrors what manifest.mjs does on the dump file but for an opened DB.
function schemaFromDb(db) {
  const rows = db.prepare(
    `SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND type IN ('table','index','trigger','view') ORDER BY name`
  ).all();
  const canonical = rows
    .map(r => r.sql.replace(/\s+/g, ' ').trim())
    .sort()
    .join('\n');
  return createHash('sha256').update(canonical).digest('hex');
}

function perTableCountsFromDb(db, tableNames) {
  const counts = {};
  for (const t of tableNames) {
    const row = db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get();
    counts[t] = row.n;
  }
  return counts;
}

async function main() {
  ensureArtefactDir();
  const args = parseArgs(process.argv.slice(2));
  const sourceCfg = SOURCES[args.source];
  const startedAt = new Date();
  const dateKey = startedAt.toISOString().slice(0, 10);
  const summary = {
    started_at: startedAt.toISOString(),
    date_key: dateKey,
    source: args.source,
    status: 'in_progress',
    checks: {},
  };

  console.log(`[cold-restore] starting drill for ${dateKey} (source: ${args.source})`);

  try {
    const privateKey = readPrivateKey();
    console.log('[cold-restore] private key loaded from local file');

    // 1. List the configured prefix and pick the appropriate object
    const keyId = envOrThrow('B2_KEY_ID');
    const applicationKey = envOrThrow('B2_APPLICATION_KEY');
    const auth = await authorize({ keyId, applicationKey });
    const list = await listFileNames({
      apiUrl: auth.apiUrl,
      authorizationToken: auth.authorizationToken,
      bucketId: auth.bucketId,
      prefix: sourceCfg.prefix,
      maxFileCount: 1000,
    });
    if (!list.files || list.files.length === 0) {
      throw new Error(`no objects found under ${sourceCfg.prefix} — nothing to restore`);
    }
    const encryptedFiles = list.files.filter(f => f.fileName.endsWith('.sql.gz.age'));
    if (encryptedFiles.length === 0) {
      throw new Error(`no .sql.gz.age objects found under ${sourceCfg.prefix}`);
    }
    const target = encryptedFiles.reduce((acc, f) => {
      if (!acc) return f;
      if (sourceCfg.pick === 'newest') return f.uploadTimestamp > acc.uploadTimestamp ? f : acc;
      // oldest
      return f.uploadTimestamp < acc.uploadTimestamp ? f : acc;
    }, null);
    summary.target = {
      file_name: target.fileName,
      uploaded_at: new Date(target.uploadTimestamp).toISOString(),
      file_id: target.fileId,
    };
    console.log(`[cold-restore] target: ${target.fileName} (uploaded ${summary.target.uploaded_at})`);

    // The manifest sits alongside in the same prefix folder
    const newest = target; // alias; rest of the script uses 'newest' as the variable
    const manifestName = newest.fileName.replace(/[^/]*\.sql\.gz\.age$/, 'manifest.json');

    // 2. Download both
    console.log('[cold-restore] downloading encrypted dump + manifest');
    const ciphertext = await downloadFile({
      downloadUrl: auth.downloadUrl,
      authorizationToken: auth.authorizationToken,
      bucketName: auth.bucketName,
      fileName: newest.fileName,
    });
    const manifestBytes = await downloadFile({
      downloadUrl: auth.downloadUrl,
      authorizationToken: auth.authorizationToken,
      bucketName: auth.bucketName,
      fileName: manifestName,
    });
    const manifest = JSON.parse(new TextDecoder().decode(manifestBytes));
    summary.manifest = manifest;

    // 2a. Verify encrypted_sha256 matches what's actually on disk
    const actualEncryptedSha = createHash('sha256').update(ciphertext).digest('hex');
    summary.checks.encrypted_sha256_match = actualEncryptedSha === manifest.encrypted_sha256;
    if (!summary.checks.encrypted_sha256_match) {
      throw new Error(
        `encrypted_sha256 mismatch: manifest says ${manifest.encrypted_sha256}, ` +
        `file is ${actualEncryptedSha} — backup corrupted in transit or at rest`
      );
    }

    // 3. Decrypt
    console.log('[cold-restore] decrypting');
    const gzipped = await decryptToBytes(ciphertext, privateKey);

    // 4. Decompress
    console.log('[cold-restore] decompressing');
    const dumpBytes = gunzipSync(gzipped);
    const dumpSql = dumpBytes.toString('utf8');

    // Reorder for FK-safe import (D1 export isn't topologically sorted)
    const reorderedSql = reorderDump(dumpSql);

    // 5. Import to throwaway SQLite
    const cacheDir = resolve(homedir(), '.cache', '11plus-cold-restore');
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
    const dbPath = resolve(cacheDir, `${dateKey}.db`);
    if (existsSync(dbPath)) unlinkSync(dbPath);
    console.log(`[cold-restore] importing to ${dbPath}`);
    const db = new DatabaseSync(dbPath);
    try {
      // exec() runs multi-statement SQL
      db.exec(reorderedSql);

      // 6. PRAGMA integrity_check
      const integrityRows = db.prepare('PRAGMA integrity_check').all();
      const integrityResult = integrityRows.map(r => r.integrity_check).join(', ');
      summary.checks.integrity_check = integrityResult;
      summary.checks.integrity_ok = integrityResult === 'ok';
      console.log(`[cold-restore] PRAGMA integrity_check: ${integrityResult}`);

      // 7. Schema sha256 — compare against what we recompute from the dump,
      //    AND against the manifest's recorded value.
      const dumpSchemaSha = schemaSha256FromDump(dumpSql);
      summary.checks.dump_schema_matches_manifest = dumpSchemaSha === manifest.schema_sha256;
      console.log(`[cold-restore] dump schema sha256 vs manifest: ${summary.checks.dump_schema_matches_manifest ? 'match' : 'MISMATCH'}`);

      // 8. Per-table counts from imported DB vs manifest
      const expectedCounts = manifest.per_table_counts || {};
      const actualCounts = perTableCountsFromDb(db, Object.keys(expectedCounts));
      summary.checks.per_table_counts = { expected: expectedCounts, actual: actualCounts };
      const mismatches = [];
      for (const [t, expected] of Object.entries(expectedCounts)) {
        const actual = actualCounts[t];
        if (actual !== expected) mismatches.push({ table: t, expected, actual });
      }
      summary.checks.per_table_counts_match = mismatches.length === 0;
      summary.checks.per_table_count_mismatches = mismatches;
      if (mismatches.length === 0) {
        console.log(`[cold-restore] per-table counts: all ${Object.keys(expectedCounts).length} tables match`);
      } else {
        console.log(`[cold-restore] per-table counts: ${mismatches.length} mismatch(es)`);
        for (const m of mismatches.slice(0, 10)) {
          console.log(`  ${m.table}: expected ${m.expected}, got ${m.actual}`);
        }
      }
    } finally {
      db.close();
    }

    // Aggregate verdict
    const allChecksPass =
      summary.checks.encrypted_sha256_match &&
      summary.checks.integrity_ok &&
      summary.checks.dump_schema_matches_manifest &&
      summary.checks.per_table_counts_match;

    summary.status = allChecksPass ? 'pass' : 'fail';
    summary.finished_at = new Date().toISOString();
    const summaryPath = resolve(ARTEFACT_DIR, `${sourceCfg.summaryPrefix}-${dateKey}.json`);
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log('');
    console.log('───────────────────────────────────────────');
    console.log(`  Cold-restore drill: ${allChecksPass ? 'PASS ✓' : 'FAIL ✗'}`);
    console.log(`  Source: ${newest.fileName}`);
    console.log(`  Local DB: ${dbPath}`);
    console.log(`  Summary: ${summaryPath}`);
    console.log('───────────────────────────────────────────');

    process.exit(allChecksPass ? 0 : 1);
  } catch (err) {
    summary.status = 'error';
    summary.finished_at = new Date().toISOString();
    summary.error = { message: err.message, stack: err.stack };
    const summaryPath = resolve(ARTEFACT_DIR, `${sourceCfg.summaryPrefix}-${dateKey}.json`);
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.error('');
    console.error('───────────────────────────────────────────');
    console.error(`  Cold-restore drill: ERROR`);
    console.error(`  ${err.message}`);
    console.error(`  Summary: ${summaryPath}`);
    console.error('───────────────────────────────────────────');
    process.exit(2);
  }
}

main();

#!/usr/bin/env node
// Gate 3 — Migration rehearsal.
//
// Triggers on production schema-mutating wrangler invocations:
//   - wrangler d1 migrations apply --remote
//   - wrangler d1 execute --remote --file=<any>
//   - wrangler d1 execute --remote --command='<schema-mutating SQL>'
//
// Block condition: no migrations-rehearsed-<hash>.json artefact for the
// migration input, OR artefact's recorded script-hash doesn't match the
// current rehearsal script.
//
// Override: NONE for production schema mutations. Data-only commands and
// read-only commands pass through (Gate 3 doesn't fire on them).

import { resolve } from 'node:path';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  readHookInput,
  block,
  allow,
  classifyWranglerInvocation,
  isSchemaMutatingSql,
  REPO_ROOT,
  ARTEFACT_DIR,
} from './lib/hook-base.mjs';
import { verifyArtefact, sha256OfFile, sha256OfString } from '../lib/integrity.mjs';

const REHEARSE_SCRIPT = 'scripts/process-gates/rehearse-migration.mjs';
const MIGRATIONS_DIR = resolve(REPO_ROOT, 'workers/ai-tutor/migrations');
const FRESHNESS_SECONDS = 24 * 60 * 60;

// Compute the migration_input_hash for the incoming command. Mirror what
// rehearse-migration.mjs does at production time so artefact's stored hash
// matches what we re-derive here.
function computeInputHash(cls) {
  if (cls.kind === 'd1-execute' && cls.file) {
    const abs = resolve(REPO_ROOT, cls.file);
    if (!existsSync(abs)) return null;
    return { hash: sha256OfFile(abs), kind: 'file', path: cls.file };
  }
  if (cls.kind === 'd1-execute' && cls.sql) {
    return { hash: sha256OfString(cls.sql), kind: 'command' };
  }
  if (cls.kind === 'migrations-apply') {
    if (!existsSync(MIGRATIONS_DIR)) return null;
    const files = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
    const concat = files.map(f => `${f}\0${readFileSync(resolve(MIGRATIONS_DIR, f), 'utf8')}`).join('\n---\n');
    return { hash: sha256OfString(concat), kind: 'migrations-apply', files };
  }
  return null;
}

function gateApplies(cls) {
  // Migrations apply is always schema-mutating.
  if (cls.kind === 'migrations-apply' && cls.target === 'remote') return true;
  // d1 execute --remote with --file= is treated as a migration (file form).
  if (cls.kind === 'd1-execute' && cls.target === 'remote' && cls.file) return true;
  // d1 execute --remote --command= only if SQL is schema-mutating.
  if (cls.kind === 'd1-execute' && cls.target === 'remote' && cls.sql && isSchemaMutatingSql(cls.sql)) return true;
  return false;
}

async function main() {
  const input = readHookInput();
  const cmd = input?.tool_input?.command;
  if (input?.tool_name !== 'Bash' || !cmd) allow('not Bash');

  const cls = classifyWranglerInvocation(cmd);
  if (!gateApplies(cls)) allow(`Gate 3 does not apply (kind: ${cls.kind})`);

  const inputHash = computeInputHash(cls);
  if (!inputHash) {
    block(
      'cannot compute migration_input_hash',
      'Either the migration file is missing or the SQL is empty. Run the rehearsal first.'
    );
  }
  const shortHash = inputHash.hash.slice(0, 12);
  const artefactPath = resolve(ARTEFACT_DIR, `migrations-rehearsed-${shortHash}.json`);

  if (!existsSync(artefactPath)) {
    block(
      `no rehearsal artefact for migration input ${shortHash}`,
      buildBlockDetail(inputHash, shortHash, `expected ${artefactPath} (file missing)`)
    );
  }

  let artefact;
  try {
    artefact = JSON.parse(readFileSync(artefactPath, 'utf8'));
  } catch (e) {
    block(
      `rehearsal artefact unparseable for ${shortHash}`,
      buildBlockDetail(inputHash, shortHash, `JSON parse error: ${e.message}`)
    );
  }

  const verdict = verifyArtefact(artefact, {
    scriptPath: REHEARSE_SCRIPT,
    inputFingerprint: { migration_input_hash: inputHash.hash },
    maxAgeSeconds: FRESHNESS_SECONDS,
  });
  if (!verdict.ok) {
    block(
      `rehearsal artefact failed integrity check`,
      buildBlockDetail(inputHash, shortHash, verdict.reason)
    );
  }

  process.stderr.write(`[gate-3] rehearsal artefact OK (hash ${shortHash})\n`);
  process.exit(0);
}

function buildBlockDetail(inputHash, shortHash, reason) {
  let invocation = '';
  if (inputHash.kind === 'file') {
    invocation = `node scripts/process-gates/rehearse-migration.mjs --file=${inputHash.path}`;
  } else if (inputHash.kind === 'command') {
    invocation = `node scripts/process-gates/rehearse-migration.mjs --command='<your SQL here>'`;
  } else if (inputHash.kind === 'migrations-apply') {
    invocation = `node scripts/process-gates/rehearse-migration.mjs --migrations-apply`;
  }

  return `Reason: ${reason}

Run the rehearsal script first:

    ${invocation}

It will:
  - Export production D1 to a fresh local staging database
  - Apply the migration to staging
  - Capture row counts pre/post on every user table
  - REFUSE to produce an artefact if any unexpected row drops occur

Re-run your wrangler command after the rehearsal passes.

There is NO override for this gate. Production schema mutations must be
rehearsed against a real prod snapshot — that is the 27 April lesson:
the migration that wiped six accounts' data passed local-fresh-schema
testing. Only a real-snapshot rehearsal would have caught it.
`;
}

main().catch(err => {
  process.stderr.write(`[gate-3 hook error] ${err.message}\n`);
  process.exit(2);
});

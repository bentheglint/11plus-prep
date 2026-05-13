#!/usr/bin/env node
// Script 2 — Migration rehearsal (Gate 3 dependency)
//
// Exports production D1, imports into a fresh local staging D1, applies the
// candidate migration, and captures row counts on every user table pre and
// post. Surfaces unexpected drops (the 27 April class) before the migration
// touches production.
//
// Usage:
//   node scripts/process-gates/rehearse-migration.mjs --file=<path>
//   node scripts/process-gates/rehearse-migration.mjs --command='<sql>'
//   node scripts/process-gates/rehearse-migration.mjs --migrations-apply
//
// Output: process-gate-artefacts/migrations-rehearsed-<hash>.json

import { readFileSync, readdirSync, existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { tmpdir } from 'node:os';
import {
  buildArtefact,
  writeArtefact,
  workerSha,
  schemaFingerprint,
  sha256OfFile,
  sha256OfString,
  repoRoot,
} from './lib/integrity.mjs';
import {
  d1Execute,
  d1ExecuteFile,
  d1Export,
  d1MigrationsApply,
  listUserTables,
  pragmaTableInfo,
  rowCount,
} from './lib/wrangler.mjs';
import { preprocessDump } from './lib/dump-preprocess.mjs';

const SCRIPT_PATH = 'scripts/process-gates/rehearse-migration.mjs';
const MIGRATIONS_DIR = 'workers/ai-tutor/migrations';

// ── 1. Parse CLI args ──

function parseArgs(argv) {
  const out = { file: null, command: null, migrationsApply: false };
  for (const a of argv) {
    if (a.startsWith('--file=')) out.file = a.slice(7);
    else if (a.startsWith('--command=')) out.command = a.slice(10);
    else if (a === '--migrations-apply') out.migrationsApply = true;
  }
  const set = [out.file, out.command, out.migrationsApply].filter(Boolean).length;
  if (set !== 1) {
    console.error('Specify exactly one of: --file=<path>, --command=<sql>, --migrations-apply');
    process.exit(2);
  }
  return out;
}

// ── 2. Compute migration input hash ──

function computeInputHash(args) {
  if (args.file) {
    const abs = resolve(repoRoot(), args.file);
    return { hash: sha256OfFile(abs), input_kind: 'file', input_path: args.file };
  }
  if (args.command) {
    return { hash: sha256OfString(args.command), input_kind: 'command', input_sql: args.command };
  }
  // --migrations-apply: hash all migration files in order
  const dir = resolve(repoRoot(), MIGRATIONS_DIR);
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  const concat = files.map(f => `${f}\0${readFileSync(resolve(dir, f), 'utf8')}`).join('\n---\n');
  return {
    hash: sha256OfString(concat),
    input_kind: 'migrations-apply',
    migration_files: files,
  };
}

// ── 3. Reset local D1 to a clean slate ──

function resetLocalD1() {
  const stateDir = resolve(repoRoot(), 'workers/ai-tutor/.wrangler/state/v3/d1');
  if (existsSync(stateDir)) {
    console.log('[rehearse] clearing local D1 state at', stateDir);
    rmSync(stateDir, { recursive: true, force: true });
  }
  mkdirSync(stateDir, { recursive: true });
}

// ── 4. Row-count snapshot ──

function snapshotRowCounts(target) {
  const tables = listUserTables(target);
  const counts = {};
  for (const t of tables) {
    try {
      counts[t] = rowCount({ table: t, target });
    } catch (e) {
      counts[t] = `ERROR: ${e.message.slice(0, 80)}`;
    }
  }
  return counts;
}

// ── 5. Main ──

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputDescriptor = computeInputHash(args);
  console.log(`[rehearse] input: ${inputDescriptor.input_kind}, hash: ${inputDescriptor.hash.slice(0, 12)}...`);

  // Fingerprint of the migration directory at run time, to embed in the
  // artefact (separate from the input hash — gives auditors the full picture).
  const migrationDir = resolve(repoRoot(), MIGRATIONS_DIR);
  const allMigrations = readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();
  const migrationsFingerprint = sha256OfString(
    allMigrations.map(f => `${f}\0${readFileSync(resolve(migrationDir, f), 'utf8')}`).join('\n---\n')
  );

  // 1. Export prod
  const dumpPath = resolve(tmpdir(), `d1-prod-dump-${Date.now()}.sql`);
  console.log('[rehearse] exporting production D1 ->', dumpPath);
  d1Export({ output: dumpPath, target: 'remote' });

  // Preprocess dump: wrangler's export does not topologically sort tables.
  // Reorder so all CREATE TABLEs come before any INSERT. By the time any
  // INSERT runs, every FK target table exists. (On D1 prod, PRAGMA
  // foreign_keys is silently ignored — that's the 27 April lesson — so we
  // use structural reordering instead of relying on a PRAGMA.)
  const preprocessed = resolve(tmpdir(), `d1-prod-dump-reordered-${Date.now()}.sql`);
  preprocessDump(dumpPath, preprocessed);

  // 2. Reset local D1, import dump
  resetLocalD1();
  console.log('[rehearse] importing dump into local D1...');
  d1ExecuteFile({ file: preprocessed, target: 'local' });

  // 3. Pre-migration snapshot
  console.log('[rehearse] taking pre-migration row counts...');
  const preCounts = snapshotRowCounts('local');
  const preSchema = {};
  for (const t of Object.keys(preCounts)) preSchema[t] = pragmaTableInfo({ table: t, target: 'local' });
  const preFingerprint = schemaFingerprint(preSchema);
  console.log(`[rehearse] ${Object.keys(preCounts).length} tables pre-migration`);

  // 4. Apply candidate migration
  console.log('[rehearse] applying migration to local staging D1...');
  if (args.file) {
    d1ExecuteFile({ file: resolve(repoRoot(), args.file), target: 'local' });
  } else if (args.command) {
    d1Execute({ command: args.command, target: 'local', json: false });
  } else {
    d1MigrationsApply({ target: 'local' });
  }

  // 5. Post-migration snapshot
  console.log('[rehearse] taking post-migration row counts...');
  const postCounts = snapshotRowCounts('local');
  const postSchema = {};
  for (const t of Object.keys(postCounts)) postSchema[t] = pragmaTableInfo({ table: t, target: 'local' });
  const postFingerprint = schemaFingerprint(postSchema);

  // 6. Diff
  const allTables = new Set([...Object.keys(preCounts), ...Object.keys(postCounts)]);
  const diffs = [];
  let unexpectedDrop = false;
  for (const t of [...allTables].sort()) {
    const before = preCounts[t];
    const after = postCounts[t];
    const beforeN = typeof before === 'number' ? before : null;
    const afterN = typeof after === 'number' ? after : null;
    let delta = null;
    if (beforeN !== null && afterN !== null) delta = afterN - beforeN;
    let flag = 'ok';
    if (before === undefined) flag = 'table-created';
    else if (after === undefined) flag = 'table-dropped';
    else if (beforeN !== null && afterN !== null && afterN < beforeN) {
      flag = 'unexpected-drop';
      unexpectedDrop = true;
    }
    diffs.push({ table: t, before, after, delta, flag });
  }

  console.log('\n[rehearse] row-count diff:');
  console.log('  table'.padEnd(30) + 'before'.padStart(10) + 'after'.padStart(10) + 'delta'.padStart(10) + '  flag');
  for (const d of diffs) {
    console.log(
      `  ${d.table.padEnd(28)}${String(d.before).padStart(10)}${String(d.after).padStart(10)}${String(d.delta ?? '-').padStart(10)}  ${d.flag}`
    );
  }

  if (unexpectedDrop) {
    console.log('\n[rehearse] FAIL — unexpected drops detected. Migration would lose data. NOT producing artefact.');
    process.exit(1);
  }
  if (diffs.some(d => d.flag === 'table-dropped')) {
    console.log('\n[rehearse] FAIL — table dropped. NOT producing artefact (intentional drop must use --command= with explicit hash).');
    process.exit(1);
  }

  // 7. Build artefact
  const artefact = buildArtefact({
    scriptPath: SCRIPT_PATH,
    inputFingerprint: {
      worker_sha: workerSha(),
      migration_input_hash: inputDescriptor.hash,
      migrations_dir_fingerprint: migrationsFingerprint,
      d1_pre_schema_fingerprint: preFingerprint,
    },
    output: {
      input_kind: inputDescriptor.input_kind,
      input_path: inputDescriptor.input_path ?? null,
      input_sql: inputDescriptor.input_sql ?? null,
      migration_files: inputDescriptor.migration_files ?? null,
      pre_migration_counts: preCounts,
      post_migration_counts: postCounts,
      diffs,
      pre_schema_fingerprint: preFingerprint,
      post_schema_fingerprint: postFingerprint,
    },
  });

  const filename = `migrations-rehearsed-${inputDescriptor.hash.slice(0, 12)}.json`;
  const path = writeArtefact(filename, artefact);
  console.log(`\n[rehearse] OK — artefact written: ${path}`);
}

main().catch(err => {
  console.error('[rehearse] error:', err.message);
  if (err.stderr) console.error(err.stderr);
  process.exit(2);
});

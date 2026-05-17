#!/usr/bin/env node
// Script 3 — Post-mutation row-count verification (Gate 4 dependency)
//
// Reads SELECT COUNT(*) for every user table in production D1 and compares
// to the most recent prior verification artefact.
//
// Two modes (per plan v2.1):
//   baseline   — no prior snapshot found; record current counts only.
//   compared   — prior snapshot exists; diff and exit non-zero if any
//                unexpected drops detected (no artefact produced in that case
//                so the gate stays in "not verified" state).
//
// Output: process-gate-artefacts/verification-<timestamp>.json

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildArtefact,
  writeArtefact,
  workerSha,
  schemaFingerprint,
  artefactDir,
} from './lib/integrity.mjs';
import { listUserTables, pragmaTableInfo, rowCount } from './lib/wrangler.mjs';

const SCRIPT_PATH = 'scripts/process-gates/verify-row-counts.mjs';

// ── Find the most recent prior verification artefact (excluding the file we
// are about to write). Returns the parsed object, or null. ──

function findPriorVerification() {
  const dir = artefactDir();
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter(f => f.startsWith('verification-') && f.endsWith('.json'))
    .sort()
    .reverse();
  for (const f of files) {
    try {
      const obj = JSON.parse(readFileSync(resolve(dir, f), 'utf8'));
      if (obj?.script_output?.mode) return { ...obj, _filename: f };
    } catch {}
  }
  return null;
}

// Tables whose row counts fluctuate in normal operation and should not
// trigger the unexpected-drop guard. processed_operations is a replay-
// protection queue that is regularly purged by the scheduled worker.
const DROP_EXEMPT_TABLES = new Set(['processed_operations']);

// ── Compare current vs prior counts. Returns { diffs, unexpectedDrop }. ──

function diffCounts(current, prior) {
  if (!prior) return { diffs: [], unexpectedDrop: false };
  const allTables = new Set([...Object.keys(current), ...Object.keys(prior)]);
  const diffs = [];
  let unexpectedDrop = false;
  for (const t of [...allTables].sort()) {
    const before = prior[t];
    const after = current[t];
    let flag = 'ok';
    let delta = null;
    if (before === undefined) flag = 'table-created';
    else if (after === undefined) {
      flag = 'table-dropped';
      unexpectedDrop = true;
    } else if (typeof before === 'number' && typeof after === 'number') {
      delta = after - before;
      if (after < before) {
        flag = DROP_EXEMPT_TABLES.has(t) ? 'exempt-drop' : 'unexpected-drop';
        if (!DROP_EXEMPT_TABLES.has(t)) unexpectedDrop = true;
      }
    }
    diffs.push({ table: t, before, after, delta, flag });
  }
  return { diffs, unexpectedDrop };
}

async function main() {
  console.log('[verify] taking row-count snapshot of production D1...');
  const tables = listUserTables('remote');
  const counts = {};
  const schema = {};
  for (const t of tables) {
    counts[t] = rowCount({ table: t, target: 'remote' });
    schema[t] = pragmaTableInfo({ table: t, target: 'remote' });
  }
  console.log(`[verify] ${tables.length} tables snapshotted`);

  const prior = findPriorVerification();
  let mode, diffs, unexpectedDrop;
  if (prior) {
    mode = 'compared';
    console.log(`[verify] prior snapshot found: ${prior._filename}`);
    const priorCounts = prior.script_output.counts;
    ({ diffs, unexpectedDrop } = diffCounts(counts, priorCounts));
    console.log('\n[verify] row-count diff:');
    console.log('  table'.padEnd(30) + 'before'.padStart(10) + 'after'.padStart(10) + 'delta'.padStart(10) + '  flag');
    for (const d of diffs) {
      console.log(
        `  ${d.table.padEnd(28)}${String(d.before).padStart(10)}${String(d.after).padStart(10)}${String(d.delta ?? '-').padStart(10)}  ${d.flag}`
      );
    }
  } else {
    mode = 'baseline';
    diffs = [];
    unexpectedDrop = false;
    console.log('[verify] no prior snapshot — baseline mode');
  }

  if (unexpectedDrop) {
    console.log('\n[verify] FAIL — unexpected drops detected. NOT producing artefact.');
    console.log('[verify] If this drop is intentional (e.g. GDPR account deletion), use Gate 4 typed-phrase override.');
    process.exit(1);
  }

  const artefact = buildArtefact({
    scriptPath: SCRIPT_PATH,
    inputFingerprint: {
      worker_sha: workerSha(),
      d1_schema_fingerprint: schemaFingerprint(schema),
    },
    output: {
      mode,
      counts,
      diffs,
      tables_in_production: tables.sort(),
      prior_artefact: prior?._filename ?? null,
    },
  });

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `verification-${ts}.json`;
  const path = writeArtefact(filename, artefact);
  console.log(`\n[verify] OK (mode: ${mode}) — artefact written: ${path}`);

  // Drop a marker for hooks: clear the most-recent last-prod-mutation flag if any.
  // Gate 4's hook scans for the .flag file; verification-*.json supersedes it.
}

main().catch(err => {
  console.error('[verify] error:', err.message);
  if (err.stderr) console.error(err.stderr);
  process.exit(2);
});

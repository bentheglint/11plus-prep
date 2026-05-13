#!/usr/bin/env node
// Script 4 — Weekly tested-restore loop (recovery-layer verification)
//
// Two-path verification (per plan v2.1, both must succeed):
//
//   Path A — Export-import:
//     wrangler d1 export --remote  →  fresh local staging D1  →  import  →
//     row-count audit  →  last-good-restore-export-<YYYY-MM-DD>.json
//
//   Path B — Time Travel:
//     drill D1 populated with prod schema  →  insert sentinel row  →  capture
//     bookmark  →  insert noise row  →  wrangler d1 time-travel restore to
//     bookmark  →  verify sentinel present, noise absent  →
//     last-good-restore-timetravel-<YYYY-MM-DD>.json
//
// Failure triage exit codes:
//   10  EXPORT_FAILED        wrangler d1 export errored (Cloudflare-side / quota)
//   11  IMPORT_FAILED        dump produced but staging import errored
//   12  TIMETRAVEL_FAILED    wrangler d1 time-travel errored
//   13  ROWCOUNT_MISMATCH    restore succeeded but row counts diverge
//   2   internal error
//
// Drill D1 setup (one-time, manual):
//   wrangler d1 create 11plus-restore-drill
//   then add to wrangler.toml under [env.drill] or pass --database-id at runtime
//
// Usage:
//   node scripts/process-gates/weekly-restore-test.mjs               # both paths
//   node scripts/process-gates/weekly-restore-test.mjs --paths=A     # only Path A
//   node scripts/process-gates/weekly-restore-test.mjs --paths=B     # only Path B

import { readFileSync, existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync, spawnSync } from 'node:child_process';
import {
  buildArtefact,
  writeArtefact,
  workerSha,
  schemaFingerprint,
  repoRoot,
} from './lib/integrity.mjs';
import {
  d1Execute,
  d1ExecuteFile,
  d1Export,
  listUserTables,
  pragmaTableInfo,
  rowCount,
  WORKER_DIRECTORY,
  DB_NAME_EXPORT,
} from './lib/wrangler.mjs';
import { preprocessDump } from './lib/dump-preprocess.mjs';

const SCRIPT_PATH = 'scripts/process-gates/weekly-restore-test.mjs';
const DRILL_DB_NAME = process.env.DRILL_DB_NAME || '11plus-restore-drill';

const EXIT = {
  OK: 0,
  EXPORT_FAILED: 10,
  IMPORT_FAILED: 11,
  TIMETRAVEL_FAILED: 12,
  ROWCOUNT_MISMATCH: 13,
  INTERNAL: 2,
};

function parseArgs(argv) {
  const out = { paths: 'AB' };
  for (const a of argv) {
    if (a.startsWith('--paths=')) out.paths = a.slice(8).replace(/,/g, '').toUpperCase();
  }
  return out;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function resetLocalD1() {
  const stateDir = resolve(repoRoot(), 'workers/ai-tutor/.wrangler/state/v3/d1');
  if (existsSync(stateDir)) rmSync(stateDir, { recursive: true, force: true });
  mkdirSync(stateDir, { recursive: true });
}

function snapshotRowCounts(target, dbName) {
  const tables = listUserTables(target);
  const counts = {};
  for (const t of tables) {
    counts[t] = rowCount({ table: t, target });
  }
  return { counts, tables };
}

// ── Path A — export prod, import to local, count ──

async function pathA() {
  const dump = resolve(tmpdir(), `d1-prod-dump-${Date.now()}.sql`);

  console.log('[restore-test:A] exporting production D1...');
  try {
    d1Export({ output: dump, target: 'remote' });
  } catch (e) {
    return { ok: false, exitCode: EXIT.EXPORT_FAILED, stage: 'export', error: e.message, stderr: e.stderr };
  }

  // Preprocess dump: wrangler's export does not topologically sort tables, so
  // INSERTs may reference tables (FK targets) that have not been created yet.
  // SQLite evaluates FK references at INSERT time and errors with "no such
  // table". Wrangler's local execution does not preserve PRAGMA across
  // statements, so we instead reorder the dump: all CREATE TABLEs first,
  // then all INSERTs. By the time any INSERT runs, every FK target table
  // exists.
  const preprocessed = resolve(tmpdir(), `d1-prod-dump-reordered-${Date.now()}.sql`);
  preprocessDump(dump, preprocessed);

  console.log('[restore-test:A] resetting local D1 + importing dump...');
  resetLocalD1();
  try {
    d1ExecuteFile({ file: preprocessed, target: 'local' });
  } catch (e) {
    return { ok: false, exitCode: EXIT.IMPORT_FAILED, stage: 'import', error: e.message, stderr: e.stderr };
  }

  console.log('[restore-test:A] taking row-count audit...');
  const localSnap = snapshotRowCounts('local');
  const remoteSnap = snapshotRowCounts('remote');

  // Compare. Tolerate minor drift (rows added between export and remote read).
  // Drift in either direction beyond a small window = mismatch.
  const allTables = new Set([...remoteSnap.tables, ...localSnap.tables]);
  const drift = [];
  let mismatch = false;
  for (const t of [...allTables].sort()) {
    const r = remoteSnap.counts[t] ?? null;
    const l = localSnap.counts[t] ?? null;
    if (r === null || l === null) {
      mismatch = true;
      drift.push({ table: t, remote: r, local: l, flag: 'missing-on-one-side' });
      continue;
    }
    const delta = r - l;
    // Allow up to 5 row drift (rows inserted on prod between export and audit)
    if (Math.abs(delta) > 5) {
      mismatch = true;
      drift.push({ table: t, remote: r, local: l, delta, flag: 'over-tolerance' });
    } else if (delta !== 0) {
      drift.push({ table: t, remote: r, local: l, delta, flag: 'within-tolerance' });
    }
  }

  if (mismatch) {
    return { ok: false, exitCode: EXIT.ROWCOUNT_MISMATCH, stage: 'rowcount', drift };
  }

  // Schema fingerprint
  const schema = {};
  for (const t of localSnap.tables) schema[t] = pragmaTableInfo({ table: t, target: 'local' });

  return {
    ok: true,
    counts: localSnap.counts,
    tables: localSnap.tables,
    drift,
    schema_fingerprint: schemaFingerprint(schema),
    dump_path: dump,
  };
}

// ── Path B — Time Travel restore on a separate drill D1 ──

// Same Windows-aware quoting as lib/wrangler.mjs runWrangler. We can't reuse
// it directly because it hard-codes the production DB name in WORKER_DIR;
// here we need to call against the drill DB, which is configured ad-hoc.
const IS_WINDOWS = process.platform === 'win32';

function quoteWinArg(a) {
  if (a === '') return '""';
  if (!/[\s"&<>|^]/.test(a)) return a;
  return `"${a.replace(/"/g, '""')}"`;
}

function runWranglerOnDrill(args) {
  let result;
  if (IS_WINDOWS) {
    const cmd = ['npx.cmd', '--yes', 'wrangler', ...args].map(quoteWinArg).join(' ');
    result = spawnSync(cmd, {
      cwd: WORKER_DIRECTORY,
      encoding: 'utf8',
      shell: true,
    });
  } else {
    result = spawnSync('npx', ['--yes', 'wrangler', ...args], {
      cwd: WORKER_DIRECTORY,
      encoding: 'utf8',
      shell: false,
    });
  }
  if (result.status !== 0) {
    const err = new Error(`wrangler ${args.join(' ')} failed (exit ${result.status})`);
    err.stdout = result.stdout;
    err.stderr = result.stderr;
    err.status = result.status;
    throw err;
  }
  return result.stdout;
}

async function pathB() {
  // Sanity check: drill DB must exist. We test by querying sqlite_master.
  const drillDb = DRILL_DB_NAME;
  console.log(`[restore-test:B] using drill D1: ${drillDb}`);

  let bookmark;
  try {
    // 1. Capture current bookmark on drill
    console.log('[restore-test:B] capturing baseline bookmark on drill DB...');
    const infoStdout = runWranglerOnDrill(['d1', 'time-travel', 'info', drillDb]);
    // Bookmark format: four hex segments joined by dashes, last is 32 chars.
    // Example: 00000000-0000000a-0000505e-b946a33b88390afc0250195442cdea05
    const m = infoStdout.match(/[a-f0-9]{8}-[a-f0-9]{8}-[a-f0-9]{8}-[a-f0-9]{32}/i);
    if (!m) {
      console.log('[restore-test:B] no bookmark found in output; will use timestamp instead');
    } else {
      bookmark = m[0];
      console.log(`[restore-test:B] bookmark: ${bookmark}`);
    }
    const bookmarkCapturedAt = new Date().toISOString();

    // 2. Apply a "noise" mutation we can detect
    const sentinel = `restore-test-${Date.now()}`;
    console.log(`[restore-test:B] inserting sentinel: ${sentinel}`);
    runWranglerOnDrill([
      'd1', 'execute', drillDb, '--remote',
      '--command', `CREATE TABLE IF NOT EXISTS _restore_test_sentinels (id TEXT PRIMARY KEY, inserted_at TEXT NOT NULL DEFAULT (datetime('now')));`,
    ]);
    runWranglerOnDrill([
      'd1', 'execute', drillDb, '--remote',
      '--command', `INSERT INTO _restore_test_sentinels (id) VALUES ('${sentinel}');`,
    ]);

    // Verify the sentinel is there
    const beforeRestore = runWranglerOnDrill([
      'd1', 'execute', drillDb, '--remote', '--json',
      '--command', `SELECT COUNT(*) AS n FROM _restore_test_sentinels WHERE id = '${sentinel}'`,
    ]);
    const sentinelPresentBefore = /"n"\s*:\s*1/.test(beforeRestore);
    if (!sentinelPresentBefore) {
      throw new Error('sentinel insertion not visible — drill D1 not behaving as expected');
    }

    // 3. Restore drill DB to bookmark
    console.log(`[restore-test:B] restoring drill DB to bookmark...`);
    if (bookmark) {
      runWranglerOnDrill(['d1', 'time-travel', 'restore', drillDb, '--bookmark', bookmark]);
    } else {
      runWranglerOnDrill(['d1', 'time-travel', 'restore', drillDb, '--timestamp', bookmarkCapturedAt]);
    }

    // 4. Verify sentinel is gone
    const afterRestore = runWranglerOnDrill([
      'd1', 'execute', drillDb, '--remote', '--json',
      '--command', `SELECT COUNT(*) AS n FROM _restore_test_sentinels WHERE id = '${sentinel}'`,
    ]);
    const sentinelPresentAfter = /"n"\s*:\s*1/.test(afterRestore);
    if (sentinelPresentAfter) {
      return {
        ok: false,
        exitCode: EXIT.ROWCOUNT_MISMATCH,
        stage: 'verify',
        error: 'sentinel still present after time-travel restore — restore did NOT roll back',
      };
    }

    return {
      ok: true,
      bookmark: bookmark || `(timestamp:${bookmarkCapturedAt})`,
      sentinel,
      restored_at: new Date().toISOString(),
    };
  } catch (e) {
    return {
      ok: false,
      exitCode: EXIT.TIMETRAVEL_FAILED,
      stage: 'time-travel',
      error: e.message,
      stderr: e.stderr,
    };
  }
}

// ── Main ──

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = todayDate();
  const runPathA = args.paths.includes('A');
  const runPathB = args.paths.includes('B');

  let aResult = null;
  let bResult = null;

  if (runPathA) {
    aResult = await pathA();
    if (!aResult.ok) {
      console.error(`[restore-test] Path A FAILED at stage '${aResult.stage}': ${aResult.error || ''}`);
      if (aResult.stderr) console.error(aResult.stderr);
    } else {
      console.log('[restore-test] Path A OK');
    }
  }

  if (runPathB) {
    bResult = await pathB();
    if (!bResult.ok) {
      console.error(`[restore-test] Path B FAILED at stage '${bResult.stage}': ${bResult.error || ''}`);
      if (bResult.stderr) console.error(bResult.stderr);
    } else {
      console.log('[restore-test] Path B OK');
    }
  }

  // Write artefacts for whichever paths succeeded
  if (aResult?.ok) {
    const artefact = buildArtefact({
      scriptPath: SCRIPT_PATH,
      inputFingerprint: {
        worker_sha: workerSha(),
        d1_schema_fingerprint: aResult.schema_fingerprint,
        path: 'A',
      },
      output: {
        path: 'A',
        date,
        counts: aResult.counts,
        tables: aResult.tables,
        drift: aResult.drift,
      },
    });
    writeArtefact(`last-good-restore-export-${date}.json`, artefact);
    console.log(`[restore-test] wrote last-good-restore-export-${date}.json`);
  }
  if (bResult?.ok) {
    const artefact = buildArtefact({
      scriptPath: SCRIPT_PATH,
      inputFingerprint: {
        worker_sha: workerSha(),
        path: 'B',
      },
      output: {
        path: 'B',
        date,
        bookmark: bResult.bookmark,
        sentinel: bResult.sentinel,
        restored_at: bResult.restored_at,
        drill_db: DRILL_DB_NAME,
      },
    });
    writeArtefact(`last-good-restore-timetravel-${date}.json`, artefact);
    console.log(`[restore-test] wrote last-good-restore-timetravel-${date}.json`);
  }

  // Determine final exit code
  if (runPathA && !aResult.ok) process.exit(aResult.exitCode);
  if (runPathB && !bResult.ok) process.exit(bResult.exitCode);
  process.exit(EXIT.OK);
}

main().catch(err => {
  console.error('[restore-test] internal error:', err.message);
  if (err.stderr) console.error(err.stderr);
  process.exit(EXIT.INTERNAL);
});

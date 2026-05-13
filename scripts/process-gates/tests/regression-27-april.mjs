#!/usr/bin/env node
// Regression test — 27 April 2026 mistake sequence.
//
// This is the most important test of the Plan A v2.1 gates. It walks through
// the chain of mistakes that produced the cascade-wipe and asserts that each
// Gate catches the corresponding mistake.
//
// The eight mistakes (from the post-mortem) and the gate that should catch
// each one:
//
//   #0 Two wrong-branch commits before the incident even began    → Gate 1
//   #1 Worker deployed referencing columns missing from prod      → Gate 2
//   #2 Same drift, second deploy                                  → Gate 2
//   #3 (intra-mutation step — rehearsal would have caught the drop)
//   #4 Migration applied that DROP TABLE-d a FK parent on prod    → Gate 3
//   #5 Same migration's cascade reached child tables              → Gate 3
//   #6 Continued operating on damaged state without verification  → Gate 4
//   #7 Subsequent batch operation amplified the damage            → Gate 4
//   #8 Recovery-direction commands issued before snapshot         → Gate 4
//
// Run: `node scripts/process-gates/tests/regression-27-april.mjs`

import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, unlinkSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..');
const ARTEFACT_DIR = resolve(REPO_ROOT, 'process-gate-artefacts');
const CONFIRMATION_DIR = resolve(ARTEFACT_DIR, '.confirmations');
const HOOK_DIR = resolve(REPO_ROOT, 'scripts/process-gates/hooks');

let passes = 0;
let fails = 0;
const failed = [];

function runHook(hookFile, stdinJson) {
  const result = spawnSync('node', [resolve(HOOK_DIR, hookFile)], {
    input: JSON.stringify(stdinJson),
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return { exitCode: result.status, stderr: result.stderr, stdout: result.stdout };
}

function assert(label, condition, detail = '') {
  if (condition) {
    process.stdout.write(`  PASS  ${label}\n`);
    passes++;
  } else {
    process.stdout.write(`  FAIL  ${label}\n`);
    if (detail) process.stdout.write(`        ${detail}\n`);
    fails++;
    failed.push(label);
  }
}

function section(title) {
  process.stdout.write(`\n=== ${title} ===\n`);
}

function backupAndClearArtefacts() {
  // In-memory snapshot/restore (artefacts are small JSON files).
  const files = existsSync(ARTEFACT_DIR)
    ? readdirSync(ARTEFACT_DIR).filter(f => !f.startsWith('.'))
    : [];
  const snapshot = {};
  for (const f of files) {
    const p = resolve(ARTEFACT_DIR, f);
    if (statSync(p).isFile()) {
      snapshot[f] = readFileSync(p);
      unlinkSync(p);
    }
  }
  return snapshot;
}

function restoreArtefacts(snapshot) {
  if (!existsSync(ARTEFACT_DIR)) mkdirSync(ARTEFACT_DIR, { recursive: true });
  for (const [f, body] of Object.entries(snapshot)) {
    writeFileSync(resolve(ARTEFACT_DIR, f), body);
  }
}

function clearConfirmations() {
  if (!existsSync(CONFIRMATION_DIR)) return;
  for (const f of readdirSync(CONFIRMATION_DIR)) {
    try { unlinkSync(resolve(CONFIRMATION_DIR, f)); } catch {}
  }
}

function clearMutationFlag() {
  const p = resolve(ARTEFACT_DIR, '.last-prod-mutation.flag');
  if (existsSync(p)) unlinkSync(p);
}

// ── Tests ─────────────────────────────────────────────────────────────────

async function run() {
  process.stdout.write('Plan A v2.1 — 27 April 2026 regression test\n');
  process.stdout.write('============================================\n');

  // Step out of the user's real artefacts dir so tests don't pollute / use
  // pre-existing artefacts. Restore at end.
  const realArtefacts = backupAndClearArtefacts();
  clearConfirmations();
  clearMutationFlag();

  try {
    section('Mistake #0 — Wrong-branch commit (Gate 1 should block)');
    {
      const r = runHook('gate-1-branch-commit.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'git commit -m "wip"' },
      });
      assert('git commit on master is blocked by Gate 1',
        r.exitCode === 2 && /production-reachable branch/.test(r.stderr),
        `exit=${r.exitCode}, stderr=${r.stderr.slice(0, 120)}`);
    }
    {
      const r = runHook('gate-1-branch-commit.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'git push --force origin master' },
      });
      assert('git push --force to master is blocked by Gate 1',
        r.exitCode === 2 && /production-reachable branch/.test(r.stderr),
        `exit=${r.exitCode}`);
    }

    section('Mistakes #1, #2 — Schema-drifted Worker deployed (Gate 2 should block)');
    {
      // No precheck artefact present → block.
      const r = runHook('gate-2-precheck.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler deploy' },
      });
      assert('wrangler deploy without precheck artefact is blocked by Gate 2',
        r.exitCode === 2 && /no precheck artefact/.test(r.stderr),
        `exit=${r.exitCode}`);
    }
    {
      // Stale artefact (worker_sha doesn't match) → block.
      const stale = {
        produced_by_script: 'scripts/process-gates/precheck-worker-schema.mjs',
        script_sha256: 'deadbeef'.repeat(8), // fake
        input_fingerprint: { worker_sha: 'abcdef1234567890abcdef1234567890abcdef12' },
        produced_at: new Date().toISOString(),
        script_output: { compatible: true },
      };
      // Need filename matching the CURRENT worker SHA so the gate finds it.
      const sha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).stdout.trim();
      const fn = `wrangler-deploy-precheck-${sha.slice(0, 12)}.json`;
      writeFileSync(resolve(ARTEFACT_DIR, fn), JSON.stringify(stale, null, 2));

      const r = runHook('gate-2-precheck.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler deploy' },
      });
      assert('Gate 2 blocks on stale artefact (script_sha256 mismatch)',
        r.exitCode === 2 && /failed integrity check/.test(r.stderr),
        `exit=${r.exitCode}`);
      unlinkSync(resolve(ARTEFACT_DIR, fn));
    }

    section('Mistakes #4, #5 — Migration that DROP TABLEs FK parent (Gate 3 should block)');
    {
      // No rehearsal artefact for the inline DROP TABLE → block.
      const r = runHook('gate-3-rehearsal.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 execute db --remote --command="DROP TABLE accounts; CREATE TABLE accounts (id TEXT PRIMARY KEY)"' },
      });
      assert('Gate 3 blocks DROP TABLE accounts on prod without rehearsal',
        r.exitCode === 2 && /no rehearsal artefact/.test(r.stderr),
        `exit=${r.exitCode}`);
    }
    {
      // migrations apply --remote without artefact → block.
      const r = runHook('gate-3-rehearsal.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 migrations apply 11plus-user-data --remote' },
      });
      assert('Gate 3 blocks migrations apply --remote without rehearsal',
        r.exitCode === 2 && /no rehearsal artefact/.test(r.stderr),
        `exit=${r.exitCode}`);
    }

    section('Mistakes #6, #7, #8 — Continued operating without verification (Gate 4 should block)');
    {
      // Arm the mutation flag (as PostToolUse would after a successful mutation).
      writeFileSync(
        resolve(ARTEFACT_DIR, '.last-prod-mutation.flag'),
        JSON.stringify({ at: new Date().toISOString(), kind: 'd1-execute', target: 'remote' })
      );
      const r = runHook('gate-4-pre-mutation.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 execute db --remote --command="DELETE FROM seen_questions"' },
      });
      assert('Gate 4 blocks subsequent prod mutation when previous is unverified',
        r.exitCode === 2 && /not been verified/.test(r.stderr),
        `exit=${r.exitCode}`);
      clearMutationFlag();
    }
    {
      // After verification artefact, mutation should pass.
      writeFileSync(
        resolve(ARTEFACT_DIR, '.last-prod-mutation.flag'),
        JSON.stringify({ at: '2026-05-01T00:00:00.000Z', kind: 'd1-execute', target: 'remote' })
      );
      const verification = {
        produced_by_script: 'scripts/process-gates/verify-row-counts.mjs',
        script_sha256: 'x',
        input_fingerprint: {},
        produced_at: '2026-05-01T01:00:00.000Z',
        script_output: { mode: 'compared' },
      };
      writeFileSync(
        resolve(ARTEFACT_DIR, 'verification-2026-05-01T01-00-00-000Z.json'),
        JSON.stringify(verification)
      );
      const r = runHook('gate-4-pre-mutation.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 execute db --remote --command="DELETE FROM seen_questions"' },
      });
      assert('Gate 4 allows subsequent prod mutation when verification is fresher than flag',
        r.exitCode === 0,
        `exit=${r.exitCode}, stderr=${r.stderr.slice(0, 200)}`);
      clearMutationFlag();
      unlinkSync(resolve(ARTEFACT_DIR, 'verification-2026-05-01T01-00-00-000Z.json'));
    }

    section('Allow-paths — verify gates do NOT block legitimate work');
    {
      const r = runHook('gate-1-branch-commit.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'git status' },
      });
      assert('Gate 1 allows git status', r.exitCode === 0);
    }
    {
      const r = runHook('gate-2-precheck.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler deploy --env preview' },
      });
      assert('Gate 2 allows preview deploy', r.exitCode === 0);
    }
    {
      const r = runHook('gate-3-rehearsal.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 execute db --remote --command="SELECT 1"' },
      });
      assert('Gate 3 allows SELECT (read-only)', r.exitCode === 0);
    }
    {
      const r = runHook('gate-4-pre-mutation.mjs', {
        tool_name: 'Bash',
        tool_input: { command: 'npx wrangler d1 export 11plus-user-data --remote --output=foo.sql' },
      });
      assert('Gate 4 allows wrangler d1 export (read-only)', r.exitCode === 0);
    }
  } finally {
    // Restore the user's real artefacts and confirmations.
    clearConfirmations();
    clearMutationFlag();
    // Wipe everything that may have been created during tests
    if (existsSync(ARTEFACT_DIR)) {
      for (const f of readdirSync(ARTEFACT_DIR)) {
        if (!f.startsWith('.')) {
          try { unlinkSync(resolve(ARTEFACT_DIR, f)); } catch {}
        }
      }
    }
    restoreArtefacts(realArtefacts);
  }

  process.stdout.write('\n============================================\n');
  process.stdout.write(`Total: ${passes + fails}  Pass: ${passes}  Fail: ${fails}\n`);
  if (fails > 0) {
    process.stdout.write('Failed tests:\n');
    for (const l of failed) process.stdout.write(`  - ${l}\n`);
    process.exit(1);
  }
  process.stdout.write('All scenarios from the 27 April incident are caught by the gates.\n');
}

run().catch(err => {
  console.error(err);
  process.exit(2);
});

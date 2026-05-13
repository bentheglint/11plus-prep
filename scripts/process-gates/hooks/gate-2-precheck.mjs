#!/usr/bin/env node
// Gate 2 — Worker/schema compatibility precheck.
//
// Trigger: `wrangler deploy` without `--env preview` and without `--dry-run`.
// Block until a fresh, valid wrangler-deploy-precheck-<sha>.json artefact
// exists for the current Worker SHA AND reports compatible: true.
//
// Override: drop a token file at
//   process-gate-artefacts/.confirmations/gate-2-skip-<short-sha>.token
// whose body matches the phrase
//   skip precheck for <full-sha> because <reason>
// (the SHA forces the override to be specific to the deploy you're trying
// to make, and the reason is preserved for after-the-fact review).

import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import {
  readHookInput,
  block,
  allow,
  classifyWranglerInvocation,
  consumeToken,
  ensureConfirmationDir,
  REPO_ROOT,
  ARTEFACT_DIR,
} from './lib/hook-base.mjs';
import { verifyArtefact } from '../lib/integrity.mjs';

const FRESHNESS_SECONDS = 5 * 60;
const PRECHECK_SCRIPT = 'scripts/process-gates/precheck-worker-schema.mjs';

function workerSha() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

async function main() {
  const input = readHookInput();
  const cmd = input?.tool_input?.command;
  if (input?.tool_name !== 'Bash' || !cmd) allow('not Bash');

  const cls = classifyWranglerInvocation(cmd);
  if (cls.kind !== 'deploy') allow(`not wrangler deploy (kind: ${cls.kind})`);
  if (cls.preview) allow('preview deploy — Gate 2 does not apply');
  if (cls.dryRun) allow('dry-run deploy — Gate 2 does not apply');

  const sha = workerSha();
  if (!sha) block('cannot determine Worker SHA', 'git rev-parse HEAD failed');
  const shortSha = sha.slice(0, 12);

  // Override path
  ensureConfirmationDir();
  const tokenName = `gate-2-skip-${shortSha}`;
  const tokenBody = consumeToken(tokenName);
  if (tokenBody) {
    const expected = `skip precheck for ${sha}`;
    if (!tokenBody.includes(expected)) {
      block(
        'gate-2 override token did not include the required phrase',
        `Token body must include exactly: "${expected} because <reason>"\nGot:\n${tokenBody.slice(0, 200)}`
      );
    }
    if (!/because\s+\S/i.test(tokenBody)) {
      block(
        'gate-2 override missing reason',
        'Token body must include "because <one-line reason>" so the skip is auditable.'
      );
    }
    process.stderr.write(`[gate-2] override consumed: ${tokenBody.split('\n')[0].slice(0, 120)}\n`);
    process.exit(0);
  }

  // Artefact path
  const artefactPath = resolve(ARTEFACT_DIR, `wrangler-deploy-precheck-${shortSha}.json`);
  if (!existsSync(artefactPath)) {
    block(
      `no precheck artefact for Worker SHA ${shortSha}`,
      buildBlockDetail(sha, shortSha, `expected ${artefactPath} but file is missing`)
    );
  }

  let artefact;
  try {
    artefact = JSON.parse(readFileSync(artefactPath, 'utf8'));
  } catch (e) {
    block(
      `precheck artefact unparseable for Worker SHA ${shortSha}`,
      buildBlockDetail(sha, shortSha, `JSON parse error: ${e.message}`)
    );
  }

  // Verify integrity (script hash + worker_sha must match current state).
  const verdict = verifyArtefact(artefact, {
    scriptPath: PRECHECK_SCRIPT,
    inputFingerprint: { worker_sha: sha },
    maxAgeSeconds: FRESHNESS_SECONDS,
  });
  if (!verdict.ok) {
    block(
      `precheck artefact failed integrity check`,
      buildBlockDetail(sha, shortSha, verdict.reason)
    );
  }

  if (artefact.script_output?.compatible !== true) {
    const mismatches = artefact.script_output?.mismatches || [];
    const summary = mismatches.slice(0, 5).map(m => `  - ${m.file ?? ''}:${m.line ?? ''} ${m.reason}`).join('\n');
    block(
      `precheck artefact reports incompatibility (${mismatches.length} issue(s))`,
      `${summary}\n\nFix the mismatches and re-run:\n    node ${PRECHECK_SCRIPT}\n`
    );
  }

  process.stderr.write(`[gate-2] precheck OK (sha ${shortSha}, compatible: true)\n`);
  process.exit(0);
}

function buildBlockDetail(sha, shortSha, reason) {
  return `Reason: ${reason}

Run the precheck script first:

    node scripts/process-gates/precheck-worker-schema.mjs

It will:
  - Parse every db.prepare() / DB.exec() in workers/ai-tutor/
  - Diff column references against current production D1 schema
  - Produce process-gate-artefacts/wrangler-deploy-precheck-${shortSha}.json

Re-run \`wrangler deploy\` after the precheck passes.

If you really must skip the precheck, drop a one-shot override:

    echo "skip precheck for ${sha} because <one-line reason>" \\
      > process-gate-artefacts/.confirmations/gate-2-skip-${shortSha}.token

This gate exists because mistakes 1 and 2 of the 27 April incident
(Worker deployed referencing columns that didn't exist in production)
would have been caught by exactly this check.
`;
}

main().catch(err => {
  process.stderr.write(`[gate-2 hook error] ${err.message}\n`);
  process.exit(2);
});

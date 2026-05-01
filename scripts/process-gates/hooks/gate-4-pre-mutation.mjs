#!/usr/bin/env node
// Gate 4 — Pre-mutation half: blocks production mutations when the previous
// mutation has not been verified.
//
// Trigger condition: incoming command is a prod-mutating wrangler invocation
// (schema/data mutation on remote D1, or a real Worker deploy) AND a
// `last-prod-mutation.flag` exists AND there is NO verification-*.json
// produced AFTER the flag.
//
// One-shot override: if `process-gate-artefacts/.confirmations/gate-4-skip.token`
// exists, consume it and allow once. Next mutation re-arms.

import { existsSync } from 'node:fs';
import {
  readHookInput,
  block,
  allow,
  classifyWranglerInvocation,
  isProdMutation,
  findLatestVerification,
  readMutationFlag,
  consumeToken,
  ensureConfirmationDir,
  LAST_MUTATION_FLAG,
} from './lib/hook-base.mjs';

async function main() {
  const input = readHookInput();
  const cmd = input?.tool_input?.command;
  if (input?.tool_name !== 'Bash' || !cmd) allow('not Bash or no command');

  const cls = classifyWranglerInvocation(cmd);
  if (!isProdMutation(cls)) allow(`not a prod mutation (kind: ${cls.kind})`);

  const flag = readMutationFlag();
  if (!flag) allow('no pending unverified mutation');

  // A verification artefact written after the flag's timestamp clears the gate.
  const verification = findLatestVerification();
  const flagAt = new Date(flag.at).getTime();
  const verifiedAt = verification ? new Date(verification.produced_at).getTime() : 0;
  if (verification && verifiedAt > flagAt) {
    allow(`verification ${verification._filename} is fresher than flag (${flag.at})`);
  }

  // Override token (one-shot)
  ensureConfirmationDir();
  const overrideBody = consumeToken('gate-4-skip');
  if (overrideBody) {
    allow('gate-4-skip token consumed (one-shot override)');
  }

  const detail =
`The previous production mutation at ${flag.at} has not been verified.
Run the verification script first:

    node scripts/process-gates/verify-row-counts.mjs

It will produce a fresh verification-*.json artefact and clear this gate.

If a row drop is intentional (e.g. GDPR account deletion), drop a one-shot
override:

    echo "reason: <intentional drop>" > process-gate-artefacts/.confirmations/gate-4-skip.token

The next attempt will succeed; subsequent mutations will re-arm this gate.

This gate exists because mistakes 6, 7, and 8 of the 27 April incident
occurred AFTER the cascade-wipe — operating on damaged state without
verification compounded the loss.
`;
  block(`previous prod mutation (${flag.at}) not verified`, detail);
}

main().catch(err => {
  process.stderr.write(`[gate-4-pre hook error] ${err.message}\n`);
  process.exit(2);
});

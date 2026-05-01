#!/usr/bin/env node
// Gate 4 — Post-mutation half: writes the `last-prod-mutation.flag` after a
// successful prod-mutating Bash command. The Pre half (gate-4-pre-mutation.mjs)
// reads this flag on the NEXT prod mutation to decide whether to block.
//
// PostToolUse runs only on successful tool calls, so the flag is only written
// if the wrangler command actually succeeded.

import {
  readHookInput,
  classifyWranglerInvocation,
  isProdMutation,
  writeMutationFlag,
} from './lib/hook-base.mjs';

async function main() {
  const input = readHookInput();
  const cmd = input?.tool_input?.command;
  if (input?.tool_name !== 'Bash' || !cmd) {
    process.exit(0);
  }

  const cls = classifyWranglerInvocation(cmd);
  if (!isProdMutation(cls)) {
    process.exit(0);
  }

  // Successful prod mutation → arm Gate 4 for next attempt.
  writeMutationFlag({
    kind: cls.kind,
    target: cls.target ?? null,
    sql: cls.sql ?? null,
    file: cls.file ?? null,
    raw: cls.raw,
  });
  process.stderr.write(`[gate-4-post] flag armed for ${cls.kind} mutation\n`);
  process.exit(0);
}

main().catch(err => {
  // PostToolUse hook errors should not block. The user already ran the
  // command successfully; we just failed to mark it.
  process.stderr.write(`[gate-4-post hook error] ${err.message}\n`);
  process.exit(0);
});

#!/usr/bin/env node
// Gate 1 — Branch confirmation before commit (production-reachable branches)
//
// Triggers on:
//   - git commit            (current branch in protected list)
//   - git merge             (current branch in protected list)
//   - git cherry-pick       (current branch in protected list)
//   - git rebase            (current branch in protected list)
//   - git push --force                  → destination branch in protected list
//   - git push --force-with-lease       → destination branch in protected list
//
// Block condition: always when triggered, unless a one-shot confirmation
// token exists for the matching branch. Tokens are consumed (deleted) on
// successful match.
//
// Override path: Claude reads the block message, asks the user to reply
// "commit to {branch}", and on confirmation writes a token at
//   process-gate-artefacts/.confirmations/branch-{branch}.token
// then re-runs the original tool call. Hook sees the token, consumes it,
// allows the call. Next protected-branch op re-arms.

import {
  readHookInput,
  block,
  allow,
  consumeToken,
  ensureConfirmationDir,
  gitCurrentBranch,
} from './lib/hook-base.mjs';

const PROTECTED_BRANCHES_DEFAULT = ['master', 'main'];

async function loadProtectedBranches() {
  try {
    const mod = await import('../config.mjs');
    return mod.PROTECTED_BRANCHES || PROTECTED_BRANCHES_DEFAULT;
  } catch {
    return PROTECTED_BRANCHES_DEFAULT;
  }
}

// Detect which git operation the command performs and what branch it targets.
// Returns null if not a Gate-1-relevant command.
function detectGitOp(cmd, currentBranch) {
  if (!cmd || typeof cmd !== 'string') return null;
  // Strip leading `cd ... &&` and tolerate noise. Single-pass per && segment.
  // We check each segment because a chain like
  //   git stash && git commit && git stash pop
  // contains a triggering subcommand.
  const segments = cmd.split('&&').map(s => s.trim()).filter(Boolean);
  for (const seg of segments) {
    const op = matchGitOp(seg, currentBranch);
    if (op) return op;
  }
  return null;
}

function matchGitOp(seg, currentBranch) {
  // git commit
  if (/^git\s+commit\b/.test(seg)) {
    return { op: 'commit', branch: currentBranch };
  }
  // git merge <branch>
  if (/^git\s+merge\b/.test(seg)) {
    return { op: 'merge', branch: currentBranch };
  }
  // git cherry-pick
  if (/^git\s+cherry-pick\b/.test(seg)) {
    return { op: 'cherry-pick', branch: currentBranch };
  }
  // git rebase
  if (/^git\s+rebase\b/.test(seg)) {
    return { op: 'rebase', branch: currentBranch };
  }
  // git push --force / --force-with-lease  [<remote> <branch>]
  const pushMatch = seg.match(/^git\s+push\b([\s\S]*)$/);
  if (pushMatch) {
    const rest = pushMatch[1];
    if (/--force\b|--force-with-lease\b|\s-f\b/.test(rest)) {
      // Try to extract destination: "<remote> <branch>" or "<remote> HEAD:<branch>" etc.
      // If no destination given, push goes to upstream of current branch.
      const tokens = rest.trim().split(/\s+/).filter(t => !t.startsWith('-'));
      let dest = currentBranch;
      if (tokens.length >= 2) {
        const refspec = tokens[1];
        // Handle refspecs like "HEAD:master" or "feature:main"
        const colonIdx = refspec.indexOf(':');
        dest = colonIdx >= 0 ? refspec.slice(colonIdx + 1) : refspec;
      } else if (tokens.length === 1 && tokens[0].includes(':')) {
        const refspec = tokens[0];
        const colonIdx = refspec.indexOf(':');
        dest = refspec.slice(colonIdx + 1);
      }
      return { op: 'push --force', branch: dest };
    }
  }
  return null;
}

async function main() {
  const input = readHookInput();
  const cmd = input?.tool_input?.command;
  const toolName = input?.tool_name;
  if (toolName !== 'Bash' || !cmd) {
    allow('not Bash or no command');
  }

  const currentBranch = gitCurrentBranch();
  const op = detectGitOp(cmd, currentBranch);
  if (!op) allow('no protected git op detected');

  const protectedBranches = await loadProtectedBranches();
  if (!protectedBranches.includes(op.branch)) {
    allow(`branch '${op.branch}' not in protected list`);
  }

  // Check for one-shot confirmation token
  ensureConfirmationDir();
  const tokenName = `branch-${op.branch}`;
  const tokenBody = consumeToken(tokenName);
  if (tokenBody) {
    allow(`branch-confirmation token consumed for '${op.branch}' (op: ${op.op})`);
  }

  // No token → block. Tell Claude what phrase to wait for.
  const headline = `git ${op.op} would write to a production-reachable branch ('${op.branch}').`;
  const detail =
`Confirm with the user before proceeding. Ask them to reply exactly:

    commit to ${op.branch}

When they confirm, write a one-shot token to:

    process-gate-artefacts/.confirmations/branch-${op.branch}.token

(any non-empty content; the file is deleted after one use), then retry
the same command. The next attempt will succeed; subsequent commits to
'${op.branch}' will re-trigger this gate.

This gate exists because two wrong-branch commits occurred during the
27 April incident before the cascade-wipe happened. It cannot be bypassed.
`;
  block(headline, detail);
}

main().catch(err => {
  process.stderr.write(`[gate-1 hook error] ${err.message}\n`);
  // Block by default on hook error (per plan v2.1 §"Hook error semantics").
  process.exit(2);
});

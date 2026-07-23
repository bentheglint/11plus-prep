/**
 * Repo portability guard.
 *
 * WHY THIS EXISTS
 * ---------------
 * `.gitignore` denies everything under `.claude/` and then re-includes an
 * allow-list of directories that are meant to travel with the repo. That shape
 * is correct — most of `.claude/` really is machine-local — but it fails
 * silently: create a new skill, forget the allow-line, and git simply never
 * mentions the files again. You only find out on the OTHER machine, when
 * something Claude relies on "doesn't exist".
 *
 * That happened twice in the week of 21 Jul 2026. The worst case was
 * `diagram-design`, whose design tokens govern every SVG component in the app:
 * it lived on the desktop for weeks, invisible to git, and made the benchmark
 * #9b/#9c diagram work look blocked on a missing file that was never missing.
 *
 * So: every skill directory and agent file present on disk must either be
 * tracked by git, or be named below with a reason. Adding a new skill now
 * forces a conscious portable-or-not decision instead of a silent default.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CLAUDE_DIR = path.join(REPO_ROOT, '.claude');

/**
 * Deliberately NOT tracked here, with the reason. Anything on disk that is not
 * tracked and not in this map fails the test.
 */
const INTENTIONALLY_LOCAL = {
  'skills/skill-creator':
    'Duplicate of the global skill, already synced across machines via the claude-config repo. Tracking a third copy would just invite drift.',
  'agents/11plus-oracle.md':
    'Already synced across machines via claude-config (verified byte-identical 23 Jul 2026). Tracking a second copy would invite drift.',
};

/** True when git ignores the path. */
function isIgnoredByGit(relPath) {
  try {
    execFileSync('git', ['check-ignore', '--quiet', '--', relPath], {
      cwd: REPO_ROOT,
      stdio: 'ignore',
    });
    return true; // exit 0 => ignored
  } catch (err) {
    if (err.status === 1) return false; // exit 1 => not ignored
    throw err; // anything else is a real failure
  }
}

/** Skills are directories; agents are single .md files. */
function listCandidates() {
  const candidates = [];

  const skillsDir = path.join(CLAUDE_DIR, 'skills');
  if (fs.existsSync(skillsDir)) {
    for (const name of fs.readdirSync(skillsDir)) {
      if (fs.statSync(path.join(skillsDir, name)).isDirectory()) {
        candidates.push(`skills/${name}`);
      }
    }
  }

  const agentsDir = path.join(CLAUDE_DIR, 'agents');
  if (fs.existsSync(agentsDir)) {
    for (const name of fs.readdirSync(agentsDir)) {
      if (name.endsWith('.md')) candidates.push(`agents/${name}`);
    }
  }

  return candidates;
}

describe('repo portability — .claude content that must reach both machines', () => {
  // A fresh clone has no untracked local skills, so there is nothing to check.
  // The guard's job is to fire on the machine where the file was authored.
  const candidates = listCandidates();

  it('finds the .claude directory to check', () => {
    expect(fs.existsSync(CLAUDE_DIR)).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);
  });

  it.each(candidates)('%s is either tracked by git or knowingly local', (rel) => {
    const ignored = isIgnoredByGit(path.join('.claude', rel));

    if (!ignored) return; // tracked (or at least visible to git) — fine

    // Thrown rather than asserted: Jest's expect() takes no message argument,
    // so the guidance below would be swallowed by a bare matcher failure.
    if (!INTENTIONALLY_LOCAL[rel]) {
      throw new Error(
        `.claude/${rel} exists on disk but git ignores it, so the other ` +
          `machine will never see it.\n\n` +
          `If it should travel with the repo, add this line to .gitignore ` +
          `alongside the other re-includes:\n` +
          `    !/.claude/${rel}${rel.startsWith('skills/') ? '/' : ''}\n\n` +
          `If it is genuinely machine-local, add it to INTENTIONALLY_LOCAL in ` +
          `src/__tests__/repoPortability.test.js with the reason why.`
      );
    }
  });

  it('has no stale entries in INTENTIONALLY_LOCAL', () => {
    // A named exception that no longer exists on disk means the map is drifting
    // out of date and its reasons can no longer be trusted.
    const stale = Object.keys(INTENTIONALLY_LOCAL).filter(
      (rel) => !candidates.includes(rel)
    );
    expect(stale).toEqual([]);
  });
});

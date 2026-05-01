// Shared helpers for Plan A v2.1 PreToolUse hook scripts.
//
// Hook protocol (Claude Code):
//   - stdin receives JSON: { tool_name, tool_input, ... }
//   - exit 0 → tool call allowed
//   - exit 2 → tool call BLOCKED, stderr text shown to Claude
//   - any other non-zero exit → also blocks (per plan §"Hook error semantics:
//     block by default")
//   - stdout is generally ignored

import { readFileSync, existsSync, unlinkSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '..', '..', '..', '..');
export const ARTEFACT_DIR = resolve(REPO_ROOT, 'process-gate-artefacts');
export const CONFIRMATION_DIR = resolve(ARTEFACT_DIR, '.confirmations');

export function readHookInput() {
  // Read all of stdin. Hook payloads are small.
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    return {};
  }
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { _parseError: e.message, _raw: raw };
  }
}

// Block helper — print a clear instruction to stderr (Claude reads it) and
// exit non-zero. The first line is the "headline"; subsequent lines hold
// the detail and the override phrase.
export function block(headline, detail = '') {
  process.stderr.write(`[GATE BLOCKED] ${headline}\n`);
  if (detail) process.stderr.write(detail.endsWith('\n') ? detail : detail + '\n');
  process.exit(2);
}

export function allow(reason = '') {
  if (reason) process.stderr.write(`[gate ok] ${reason}\n`);
  process.exit(0);
}

// Branch confirmation tokens — written by Claude after the user replies the
// confirmation phrase. One-shot: consumed (deleted) by the next protected-
// branch tool call. Filename encodes the branch name.
export function ensureConfirmationDir() {
  if (!existsSync(CONFIRMATION_DIR)) mkdirSync(CONFIRMATION_DIR, { recursive: true });
}

export function tokenPath(name) {
  return resolve(CONFIRMATION_DIR, `${name}.token`);
}

export function consumeToken(name) {
  const p = tokenPath(name);
  if (!existsSync(p)) return null;
  let body = '';
  try { body = readFileSync(p, 'utf8'); } catch {}
  try { unlinkSync(p); } catch {}
  return body;
}

export function gitCurrentBranch() {
  try {
    return execSync('git branch --show-current', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
}

// Last-prod-mutation flag — written when a production-affecting wrangler
// command is about to run; consumed when verification passes.
export const LAST_MUTATION_FLAG = resolve(ARTEFACT_DIR, '.last-prod-mutation.flag');

export function writeMutationFlag(payload = {}) {
  if (!existsSync(ARTEFACT_DIR)) mkdirSync(ARTEFACT_DIR, { recursive: true });
  writeFileSync(LAST_MUTATION_FLAG, JSON.stringify({ ...payload, at: new Date().toISOString() }, null, 2));
}

export function readMutationFlag() {
  if (!existsSync(LAST_MUTATION_FLAG)) return null;
  try { return JSON.parse(readFileSync(LAST_MUTATION_FLAG, 'utf8')); } catch { return null; }
}

export function clearMutationFlag() {
  if (existsSync(LAST_MUTATION_FLAG)) unlinkSync(LAST_MUTATION_FLAG);
}

// Parse a tool_input.command string for a wrangler subcommand pattern.
// Returns { matched: true, args, raw } or { matched: false }.
export function parseWranglerCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return { matched: false };
  // Strip leading `cd <something> &&` if present
  const stripped = cmd.replace(/^\s*cd\s+("[^"]*"|\S+)\s*&&\s*/i, '');
  const m = stripped.match(/^\s*(?:npx(?:\.cmd)?(?:\s+--yes)?\s+)?wrangler\s+([\s\S]+)$/i);
  if (!m) return { matched: false };
  return { matched: true, raw: stripped, after: m[1] };
}

// Pull the value of `--command="..."` or `--command='...'` or `--command "..."`
// from a wrangler argv tail. Returns null if not present.
export function extractCommandFlag(after) {
  if (!after) return null;
  // --command="..."
  let m = after.match(/--command\s*=\s*("([^"]*)"|'([^']*)'|(\S+))/);
  if (m) return m[2] ?? m[3] ?? m[4];
  // --command "..."  (space-separated)
  m = after.match(/--command\s+("([^"]*)"|'([^']*)'|(\S+))/);
  if (m) return m[2] ?? m[3] ?? m[4];
  return null;
}

// Pull --file=<path> or --file <path> from argv tail.
export function extractFileFlag(after) {
  if (!after) return null;
  let m = after.match(/--file\s*=\s*("([^"]*)"|'([^']*)'|(\S+))/);
  if (m) return m[2] ?? m[3] ?? m[4];
  m = after.match(/--file\s+("([^"]*)"|'([^']*)'|(\S+))/);
  if (m) return m[2] ?? m[3] ?? m[4];
  return null;
}

// Heuristic: is this SQL schema-mutating? Triggers Gate 3 (migration
// rehearsal). Detects CREATE/ALTER/DROP/TRUNCATE/RENAME for any object.
export function isSchemaMutatingSql(sql) {
  if (!sql || typeof sql !== 'string') return false;
  const stripped = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ')
    .trim();
  return /^\s*(?:CREATE|ALTER|DROP|TRUNCATE|RENAME)\s+/i.test(stripped);
}

// Heuristic: is this SQL mutating? Default conservatively to TRUE (treat as
// mutating) unless we can confidently classify it as read-only. Comments and
// leading whitespace are stripped before classification.
export function isMutatingSql(sql) {
  if (!sql || typeof sql !== 'string') return true;
  const stripped = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ')
    .trim();
  if (!stripped) return false;
  // Read-only patterns we trust to NOT mutate
  if (/^SELECT\b/i.test(stripped)) return false;
  if (/^PRAGMA\s+(table_info|index_list|index_info|foreign_key_list|database_list|function_list|module_list|page_count|page_size|user_version|application_id)\b/i.test(stripped)) return false;
  if (/^EXPLAIN\b/i.test(stripped)) return false;
  if (/^WITH\s+\w+\s+AS\s*\([^)]*\)\s*SELECT\b/i.test(stripped)) return false;
  if (/^VALUES\b/i.test(stripped)) return false;
  // Anything else: assume mutating
  return true;
}

// Classify a wrangler command as one of:
//   { kind: 'deploy', preview: boolean, dryRun: boolean }
//   { kind: 'migrations-apply', target: 'remote'|'local' }
//   { kind: 'd1-execute', target, sql, file, mutating }
//   { kind: 'd1-export', target }
//   { kind: 'd1-time-travel-restore', dbName }
//   { kind: 'd1-time-travel-info', dbName }
//   { kind: 'other' }
export function classifyWranglerInvocation(cmd) {
  const parsed = parseWranglerCommand(cmd);
  if (!parsed.matched) return { kind: 'not-wrangler' };
  const after = parsed.after;
  // wrangler deploy
  if (/^\s*deploy\b/.test(after)) {
    return {
      kind: 'deploy',
      preview: /--env\s+preview\b|--env=preview\b/.test(after),
      dryRun: /--dry-run\b/.test(after),
      raw: parsed.raw,
    };
  }
  // wrangler d1 migrations apply <db> --remote
  if (/^\s*d1\s+migrations\s+apply\b/.test(after)) {
    return {
      kind: 'migrations-apply',
      target: /--remote\b/.test(after) ? 'remote' : 'local',
      raw: parsed.raw,
    };
  }
  // wrangler d1 execute <db> --remote --command/--file
  if (/^\s*d1\s+execute\b/.test(after)) {
    const target = /--remote\b/.test(after) ? 'remote' : 'local';
    const sql = extractCommandFlag(after);
    const file = extractFileFlag(after);
    return {
      kind: 'd1-execute',
      target,
      sql,
      file,
      mutating: file ? true : isMutatingSql(sql),
      raw: parsed.raw,
    };
  }
  // wrangler d1 export <db> --remote
  if (/^\s*d1\s+export\b/.test(after)) {
    return {
      kind: 'd1-export',
      target: /--remote\b/.test(after) ? 'remote' : 'local',
      raw: parsed.raw,
    };
  }
  // wrangler d1 time-travel info|restore
  if (/^\s*d1\s+time-travel\s+restore\b/.test(after)) {
    return { kind: 'd1-time-travel-restore', raw: parsed.raw };
  }
  if (/^\s*d1\s+time-travel\s+info\b/.test(after)) {
    return { kind: 'd1-time-travel-info', raw: parsed.raw };
  }
  return { kind: 'other', raw: parsed.raw };
}

// Predicate: does this wrangler invocation count as a "prod mutation" for
// Gate 4 purposes? (Schema/data mutation on production D1, or a real Worker
// deploy.) Read-only operations and local-only operations return false.
export function isProdMutation(classification) {
  if (!classification) return false;
  switch (classification.kind) {
    case 'deploy':
      return !classification.preview && !classification.dryRun;
    case 'migrations-apply':
      return classification.target === 'remote';
    case 'd1-execute':
      return classification.target === 'remote' && classification.mutating;
    default:
      return false;
  }
}

// Read the most recent verification-*.json artefact (used by Gate 4 to test
// "is the last mutation verified yet?").
export function findLatestVerification() {
  if (!existsSync(ARTEFACT_DIR)) return null;
  const files = readdirSync(ARTEFACT_DIR)
    .filter(f => f.startsWith('verification-') && f.endsWith('.json'))
    .sort()
    .reverse();
  for (const f of files) {
    try {
      const p = resolve(ARTEFACT_DIR, f);
      const obj = JSON.parse(readFileSync(p, 'utf8'));
      if (obj?.script_output?.mode) return { ...obj, _filename: f, _path: p };
    } catch {}
  }
  return null;
}

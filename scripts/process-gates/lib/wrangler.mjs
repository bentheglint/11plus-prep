// Thin wrapper around `npx wrangler d1` for the process-gate scripts.
// Exits non-zero on wrangler errors so callers can let them propagate.

import { execSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { repoRoot } from './integrity.mjs';

const DB_NAME = '11plus-user-data';
const WORKER_DIR = resolve(repoRoot(), 'workers/ai-tutor');

// Windows: .cmd files require shell:true to spawn, but shell:true joins args
// with spaces and we lose boundaries. Workaround: build the full command
// string ourselves with proper cmd.exe quoting and pass it as the command.
// Linux/macOS: pass args array directly with shell:false.

const IS_WINDOWS = process.platform === 'win32';

function quoteWinArg(a) {
  // cmd.exe quoting: wrap in double quotes; escape internal " as "" .
  // Backslashes don't need escaping in this style.
  if (a === '') return '""';
  if (!/[\s"&<>|^]/.test(a)) return a;
  return `"${a.replace(/"/g, '""')}"`;
}

function runWrangler(args, opts = {}) {
  let result;
  if (IS_WINDOWS) {
    const cmd = ['npx.cmd', '--yes', 'wrangler', ...args].map(quoteWinArg).join(' ');
    result = spawnSync(cmd, {
      cwd: WORKER_DIR,
      encoding: 'utf8',
      shell: true,
      ...opts,
    });
  } else {
    result = spawnSync('npx', ['--yes', 'wrangler', ...args], {
      cwd: WORKER_DIR,
      encoding: 'utf8',
      shell: false,
      ...opts,
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

// Execute a SQL command against D1 and return parsed result rows.
// `target` is 'remote' or 'local'.
export function d1Execute({ command, target = 'remote', json = true }) {
  const args = ['d1', 'execute', DB_NAME, `--${target}`, '--command', command];
  if (json) args.push('--json');
  const stdout = runWrangler(args);
  if (!json) return stdout;
  // Wrangler --json output starts with the JSON array. Find first '[' or '{'.
  const start = stdout.search(/[\[{]/);
  if (start === -1) {
    throw new Error(`Could not find JSON in wrangler output:\n${stdout.slice(0, 500)}`);
  }
  const parsed = JSON.parse(stdout.slice(start));
  // Wrangler returns an array per --json: [{ results, success, meta }]
  // We unwrap the first element's `results`.
  if (Array.isArray(parsed) && parsed[0]?.results) return parsed[0].results;
  return parsed;
}

export function d1ExecuteFile({ file, target = 'remote' }) {
  const args = ['d1', 'execute', DB_NAME, `--${target}`, '--file', file];
  return runWrangler(args);
}

export function d1Export({ output, target = 'remote' }) {
  const args = ['d1', 'export', DB_NAME, `--${target}`, '--output', output];
  return runWrangler(args);
}

export function d1MigrationsApply({ target = 'local' }) {
  const args = ['d1', 'migrations', 'apply', DB_NAME, `--${target}`];
  return runWrangler(args);
}

// List all user tables (excludes sqlite_* and Wrangler's _cf_KV/d1_migrations).
export function listUserTables(target = 'remote') {
  const rows = d1Execute({
    command: `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name != 'd1_migrations' ORDER BY name`,
    target,
  });
  return rows.map(r => r.name);
}

export function pragmaTableInfo({ table, target = 'remote' }) {
  return d1Execute({ command: `PRAGMA table_info('${table}')`, target });
}

export function rowCount({ table, target = 'remote' }) {
  const rows = d1Execute({ command: `SELECT COUNT(*) as n FROM "${table}"`, target });
  return rows[0]?.n ?? 0;
}

export const WORKER_DIRECTORY = WORKER_DIR;
export const DB_NAME_EXPORT = DB_NAME;

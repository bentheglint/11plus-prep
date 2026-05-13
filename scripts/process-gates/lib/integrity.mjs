// Universal artefact integrity pattern for Plan A v2.1 process gates.
//
// Every artefact produced by a process-gate script carries:
//   produced_by_script  — relative path from repo root
//   script_sha256       — sha256 of the script's contents at production time
//   input_fingerprint   — hashed inputs that should pin the artefact to a context
//   produced_at         — ISO 8601 timestamp
//   script_output       — the script's actual data
//
// Gates re-derive the script_sha256 and input_fingerprint at fire time and
// compare. Forging an artefact requires re-hashing the script and inputs,
// at which point running the script is the easier path.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, relative, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..');
const ARTEFACT_DIR = resolve(REPO_ROOT, 'process-gate-artefacts');

export function repoRoot() {
  return REPO_ROOT;
}

export function artefactDir() {
  if (!existsSync(ARTEFACT_DIR)) mkdirSync(ARTEFACT_DIR, { recursive: true });
  return ARTEFACT_DIR;
}

export function sha256OfFile(absPath) {
  return createHash('sha256').update(readFileSync(absPath)).digest('hex');
}

export function sha256OfString(s) {
  return createHash('sha256').update(s).digest('hex');
}

export function workerSha() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

// Hash of every file under workers/ai-tutor/ that ships in the bundle.
// Captures Worker source, helpers, routes, wrangler.toml. Excludes node_modules
// and the docs/ subdir.
export function workerSourceFingerprint() {
  const cwd = resolve(REPO_ROOT, 'workers/ai-tutor');
  // Use git ls-files so we don't pick up untracked junk; falls back to a
  // shallow walk if not tracked yet.
  let files;
  try {
    // Include tracked + untracked-but-not-gitignored, matching what
    // precheck-worker-schema.mjs scans. Keeps fingerprint and scan in sync.
    files = execSync(
      'git ls-files --cached --others --exclude-standard workers/ai-tutor',
      { cwd: REPO_ROOT, encoding: 'utf8' }
    ).trim().split('\n').filter(f => f && !f.startsWith('workers/ai-tutor/docs/'));
  } catch {
    files = [];
  }
  const hasher = createHash('sha256');
  for (const rel of files.sort()) {
    const abs = resolve(REPO_ROOT, rel);
    if (!existsSync(abs)) continue;
    hasher.update(rel);
    hasher.update('\0');
    hasher.update(readFileSync(abs));
    hasher.update('\0');
  }
  return hasher.digest('hex');
}

// Schema fingerprint: sha256 of the sorted PRAGMA table_info dump for every
// table in the production D1. Captures the live schema at the moment the
// fingerprint is taken.
export function schemaFingerprint(pragmaRowsByTable) {
  const tables = Object.keys(pragmaRowsByTable).sort();
  const hasher = createHash('sha256');
  for (const t of tables) {
    hasher.update(t);
    hasher.update('\0');
    const rows = pragmaRowsByTable[t]
      .map(r => `${r.cid}|${r.name}|${r.type}|${r.notnull}|${r.dflt_value ?? ''}|${r.pk}`)
      .sort();
    hasher.update(rows.join('\n'));
    hasher.update('\0');
  }
  return hasher.digest('hex');
}

export function buildArtefact({ scriptPath, inputFingerprint, output }) {
  const absScript = resolve(REPO_ROOT, scriptPath);
  return {
    produced_by_script: scriptPath.replace(/\\/g, '/'),
    script_sha256: sha256OfFile(absScript),
    input_fingerprint: inputFingerprint,
    produced_at: new Date().toISOString(),
    script_output: output,
  };
}

export function writeArtefact(filename, artefact) {
  const dir = artefactDir();
  const path = resolve(dir, filename);
  writeFileSync(path, JSON.stringify(artefact, null, 2) + '\n');
  return relative(REPO_ROOT, path).replace(/\\/g, '/');
}

// Verifier — used by hook scripts. Returns { ok, reason }.
// expected.scriptPath: relative path the artefact should claim
// expected.inputFingerprint: subset of fields that must match (re-derived now)
// expected.maxAgeSeconds: optional freshness window
export function verifyArtefact(artefact, expected) {
  if (!artefact || typeof artefact !== 'object') {
    return { ok: false, reason: 'artefact missing or not an object' };
  }
  const claimedScript = artefact.produced_by_script;
  const expectedScript = expected.scriptPath.replace(/\\/g, '/');
  if (claimedScript !== expectedScript) {
    return { ok: false, reason: `produced_by_script mismatch: ${claimedScript} vs ${expectedScript}` };
  }
  const absScript = resolve(REPO_ROOT, expectedScript);
  if (!existsSync(absScript)) {
    return { ok: false, reason: `script not found at ${expectedScript}` };
  }
  const actualHash = sha256OfFile(absScript);
  if (artefact.script_sha256 !== actualHash) {
    return { ok: false, reason: `script_sha256 mismatch (artefact stale or forged)` };
  }
  for (const [k, v] of Object.entries(expected.inputFingerprint || {})) {
    if (artefact.input_fingerprint?.[k] !== v) {
      return { ok: false, reason: `input_fingerprint.${k} mismatch (expected ${v}, got ${artefact.input_fingerprint?.[k]})` };
    }
  }
  if (expected.maxAgeSeconds) {
    const ageMs = Date.now() - new Date(artefact.produced_at).getTime();
    if (ageMs > expected.maxAgeSeconds * 1000) {
      return { ok: false, reason: `artefact too old (${Math.round(ageMs / 1000)}s, max ${expected.maxAgeSeconds}s)` };
    }
  }
  return { ok: true };
}

export function readArtefactIfExists(filename) {
  const path = resolve(artefactDir(), filename);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    return null;
  }
}

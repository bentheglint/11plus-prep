// Build a backup manifest captured at backup time.
//
// Per Layer 1 plan v2 (codex finding #3): row-count parity alone is too
// shallow a verification. The manifest pins:
//   - schema_sha256 (CREATE TABLE statements only — survives schema migrations)
//   - per_table_counts (counts at the moment of export, source-of-truth)
//   - worker_sha (the git rev that owns this data shape)
//   - wrangler_version (the tool that produced the dump)
//   - encrypted_sha256 (hash of the .sql.gz.age artefact)
//
// Restore drills check imports against THIS manifest, not against current
// production. That catches: corrupted backups (wrong rows with right counts),
// missing indexes/triggers (PRAGMA integrity_check), and schema-vs-code
// drift across years.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Extract just the CREATE TABLE / CREATE INDEX / CREATE TRIGGER statements
// from a D1 dump and hash them. Ignores INSERTs, PRAGMAs, and comments.
// Restore-time recomputes the same hash and compares.
export function schemaSha256FromDump(dumpSql) {
  const ddlPattern = /^\s*CREATE\s+(TABLE|UNIQUE\s+INDEX|INDEX|TRIGGER|VIEW|VIRTUAL\s+TABLE)\b[\s\S]*?;/gim;
  const matches = dumpSql.match(ddlPattern) || [];
  // Sort + canonicalise (collapse whitespace) so cosmetic reformats don't
  // change the hash.
  const canonical = matches
    .map(s => s.replace(/\s+/g, ' ').trim())
    .sort()
    .join('\n');
  return createHash('sha256').update(canonical).digest('hex');
}

// Parse INSERT statements out of a dump and count rows per table.
// Per-table count = number of `INSERT INTO "<table>"` statements. This is
// reliable for D1 exports (one INSERT per row in the standard format).
export function perTableCountsFromDump(dumpSql) {
  const counts = {};
  const re = /^\s*INSERT\s+(?:OR\s+\w+\s+)?INTO\s+["`]?(\w+)["`]?/gim;
  let m;
  while ((m = re.exec(dumpSql)) !== null) {
    counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  }
  return counts;
}

// Read a wrangler version. Tolerant of missing wrangler / non-zero exit.
export function wranglerVersion(cwd) {
  try {
    const out = execSync('npx --yes wrangler --version', { cwd, encoding: 'utf8' });
    const m = out.match(/(\d+\.\d+\.\d+)/);
    return m ? m[1] : out.trim();
  } catch {
    return 'unknown';
  }
}

export function workerSha(cwd) {
  try {
    return execSync('git rev-parse HEAD', { cwd, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

// Build the full manifest object given a dump file + encryption artefact.
export function buildManifest({
  dumpSqlPath,
  encryptedFilePath,
  encryptedFileName,
  workerCwd,
}) {
  const dumpSql = readFileSync(dumpSqlPath, 'utf8');
  const encryptedBytes = readFileSync(encryptedFilePath);
  const counts = perTableCountsFromDump(dumpSql);
  const totalRows = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    backup_at: new Date().toISOString(),
    schema_sha256: schemaSha256FromDump(dumpSql),
    per_table_counts: counts,
    row_count_total: totalRows,
    worker_sha: workerSha(workerCwd),
    wrangler_version: wranglerVersion(workerCwd),
    encrypted_file_name: encryptedFileName,
    backup_size_bytes: dumpSql.length,
    encrypted_size_bytes: encryptedBytes.length,
    encrypted_sha256: createHash('sha256').update(encryptedBytes).digest('hex'),
  };
}

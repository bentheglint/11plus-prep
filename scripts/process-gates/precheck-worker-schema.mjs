#!/usr/bin/env node
// Script 1 — Worker/schema compatibility precheck (Gate 2 dependency)
//
// Parses every db.prepare() / DB.exec() SQL string in workers/ai-tutor/, then
// runs PRAGMA table_info against production D1 to confirm every (table,
// column) pair the Worker references exists in the live schema.
//
// Catches the 27 April class of incident: Worker deployed referencing columns
// that no longer exist in production schema after a migration.
//
// Output: process-gate-artefacts/wrangler-deploy-precheck-<sha>.json

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import {
  buildArtefact,
  writeArtefact,
  workerSha,
  workerSourceFingerprint,
  schemaFingerprint,
  repoRoot,
} from './lib/integrity.mjs';
import { listUserTables, pragmaTableInfo } from './lib/wrangler.mjs';

const SCRIPT_PATH = 'scripts/process-gates/precheck-worker-schema.mjs';

// ── 1. Walk worker source files via git ls-files ──

function workerSourceFiles() {
  const out = execSync('git ls-files workers/ai-tutor', {
    cwd: repoRoot(),
    encoding: 'utf8',
  });
  return out
    .trim()
    .split('\n')
    .filter(f => f.endsWith('.js') && !f.startsWith('workers/ai-tutor/docs/'));
}

// ── 2. Extract SQL strings from db.prepare() / DB.exec() calls ──
//
// We scan for the call sites and pull the first string-literal argument.
// Backtick template literals are supported. ${...} interpolation inside an
// SQL string aborts that capture (we'd rather skip than misparse).

const CALL_RE = /\b(?:db|DB|env\.DB|c\.env\.DB)\.(?:prepare|exec)\s*\(\s*([`'"])/g;

function extractSqlFromFile(absPath, relPath) {
  const src = readFileSync(absPath, 'utf8');
  const sqls = [];
  let m;
  while ((m = CALL_RE.exec(src)) !== null) {
    const open = m[1];
    const start = m.index + m[0].length;
    let i = start;
    let interpolated = false;
    while (i < src.length) {
      const ch = src[i];
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (open === '`' && ch === '$' && src[i + 1] === '{') {
        interpolated = true;
        // Skip to the matching '}' (naive — assumes no nested braces in strings)
        let depth = 1;
        i += 2;
        while (i < src.length && depth > 0) {
          if (src[i] === '{') depth++;
          else if (src[i] === '}') depth--;
          i++;
        }
        continue;
      }
      if (ch === open) break;
      i++;
    }
    const sql = src.slice(start, i);
    const line = src.slice(0, start).split('\n').length;
    sqls.push({ file: relPath, line, sql, interpolated });
  }
  return sqls;
}

// ── 3. Parse SQL for (table, column) references ──
//
// We extract three high-fidelity classes of reference. Each catches a
// different segment of the 27 April class of bug.

function parseSqlReferences(sql) {
  const refs = []; // { table, column, kind }
  const tables = new Set();

  // Strip multi-line comments and SQL line-comments to reduce false hits
  const clean = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ');

  // INSERT INTO <table> (col, col, col)
  const insertRe = /INSERT\s+(?:OR\s+(?:IGNORE|REPLACE|ABORT|FAIL|ROLLBACK)\s+)?INTO\s+["`]?(\w+)["`]?\s*\(([^)]+)\)/gi;
  let m;
  while ((m = insertRe.exec(clean)) !== null) {
    const table = m[1];
    tables.add(table);
    const cols = m[2].split(',').map(s => s.trim().replace(/^["`]|["`]$/g, '')).filter(Boolean);
    for (const c of cols) {
      refs.push({ table, column: c, kind: 'insert-col' });
    }
  }

  // UPDATE <table> SET col = ..., col = ...
  const updateRe = /UPDATE\s+["`]?(\w+)["`]?\s+SET\s+([\s\S]+?)(?:\s+WHERE\s|$)/gi;
  while ((m = updateRe.exec(clean)) !== null) {
    const table = m[1];
    tables.add(table);
    const setClause = m[2];
    // Split by commas but ignore commas inside parens (functions)
    const assignments = splitTopLevel(setClause, ',');
    for (const a of assignments) {
      const colMatch = a.trim().match(/^["`]?(\w+)["`]?\s*=/);
      if (colMatch) refs.push({ table, column: colMatch[1], kind: 'update-col' });
    }
  }

  // FROM <table> / JOIN <table> — table references only
  const fromRe = /\b(?:FROM|JOIN)\s+["`]?(\w+)["`]?/gi;
  while ((m = fromRe.exec(clean)) !== null) {
    if (!isSqlKeyword(m[1])) tables.add(m[1]);
  }

  // DELETE FROM <table>
  const deleteRe = /DELETE\s+FROM\s+["`]?(\w+)["`]?/gi;
  while ((m = deleteRe.exec(clean)) !== null) {
    tables.add(m[1]);
  }

  return { refs, tables: [...tables] };
}

function splitTopLevel(s, sep) {
  const parts = [];
  let depth = 0, last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === sep && depth === 0) {
      parts.push(s.slice(last, i));
      last = i + 1;
    }
  }
  parts.push(s.slice(last));
  return parts;
}

function isSqlKeyword(w) {
  return /^(WHERE|ORDER|GROUP|HAVING|LIMIT|OFFSET|ON|AS|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|UNION|SELECT)$/i.test(w);
}

// ── 4. Compare against live schema ──

async function liveSchema() {
  const tables = listUserTables('remote');
  const byTable = {};
  for (const t of tables) {
    const cols = pragmaTableInfo({ table: t, target: 'remote' });
    byTable[t] = cols;
  }
  return byTable;
}

function findMismatches(workerRefs, schema) {
  const mismatches = [];
  for (const r of workerRefs) {
    const cols = schema[r.table];
    if (!cols) {
      mismatches.push({ ...r, reason: `table '${r.table}' missing in production` });
      continue;
    }
    const present = cols.some(c => c.name === r.column);
    if (!present) {
      mismatches.push({ ...r, reason: `column '${r.column}' missing in '${r.table}'` });
    }
  }
  return mismatches;
}

// ── 5. Main ──

async function main() {
  console.log('[precheck] reading Worker source files...');
  const files = workerSourceFiles();
  const allSqls = [];
  for (const f of files) {
    const abs = resolve(repoRoot(), f);
    allSqls.push(...extractSqlFromFile(abs, f));
  }
  console.log(`[precheck] found ${allSqls.length} SQL string(s) across ${files.length} file(s)`);

  const workerRefs = [];
  const allTables = new Set();
  for (const s of allSqls) {
    const parsed = parseSqlReferences(s.sql);
    for (const r of parsed.refs) {
      workerRefs.push({ ...r, file: s.file, line: s.line });
    }
    for (const t of parsed.tables) allTables.add(t);
  }
  console.log(`[precheck] extracted ${workerRefs.length} column reference(s), ${allTables.size} table(s)`);

  console.log('[precheck] fetching production schema via wrangler...');
  const schema = await liveSchema();
  console.log(`[precheck] production schema has ${Object.keys(schema).length} table(s)`);

  // Tables referenced by Worker but missing from production
  const missingTables = [...allTables].filter(t => !schema[t]);
  for (const t of missingTables) {
    workerRefs.push({ table: t, column: null, kind: 'table-ref', reason: `table '${t}' missing in production` });
  }

  const mismatches = findMismatches(workerRefs.filter(r => r.column), schema);
  const tableMismatches = workerRefs
    .filter(r => r.kind === 'table-ref' && missingTables.includes(r.table))
    .map(r => ({ ...r }));

  const allMismatches = [...mismatches, ...tableMismatches];
  const compatible = allMismatches.length === 0;

  console.log(
    compatible
      ? '[precheck] OK — all Worker references match production schema'
      : `[precheck] FAIL — ${allMismatches.length} mismatch(es)`
  );

  for (const m of allMismatches.slice(0, 20)) {
    console.log(`  - ${m.file}:${m.line ?? '?'}  ${m.reason}`);
  }
  if (allMismatches.length > 20) {
    console.log(`  ... and ${allMismatches.length - 20} more`);
  }

  // Build artefact
  const artefact = buildArtefact({
    scriptPath: SCRIPT_PATH,
    inputFingerprint: {
      worker_sha: workerSha(),
      worker_source_fingerprint: workerSourceFingerprint(),
      d1_schema_fingerprint: schemaFingerprint(schema),
    },
    output: {
      compatible,
      worker_files_scanned: files.length,
      sql_strings_extracted: allSqls.length,
      column_references: workerRefs.filter(r => r.column).length,
      tables_referenced: [...allTables].sort(),
      tables_in_production: Object.keys(schema).sort(),
      mismatches: allMismatches,
      interpolated_sqls_skipped: allSqls.filter(s => s.interpolated).length,
    },
  });

  const sha = workerSha().slice(0, 12);
  const filename = `wrangler-deploy-precheck-${sha}.json`;
  const path = writeArtefact(filename, artefact);
  console.log(`[precheck] artefact written: ${path}`);

  if (!compatible) process.exit(1);
}

main().catch(err => {
  console.error('[precheck] error:', err.message);
  if (err.stderr) console.error(err.stderr);
  process.exit(2);
});

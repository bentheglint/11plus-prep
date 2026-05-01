// Preprocess wrangler d1 export dumps for safe local re-import.
//
// Wrangler's exporter does not topologically sort tables by foreign-key
// dependencies, so the dump may contain `INSERT INTO quiz_results ...`
// before `CREATE TABLE children` — the FK target — exists. SQLite errors
// at INSERT time with "no such table: children" because it's evaluating
// the FK reference. PRAGMA foreign_keys=OFF doesn't survive wrangler's
// per-statement execution model.
//
// Fix: split the dump into CREATE statements (tables, indexes, triggers,
// views) and INSERTs, then concatenate CREATE-first, INSERT-after. All
// FK target tables exist by the time any INSERT runs.

import { readFileSync, writeFileSync } from 'node:fs';

// SQLite dump statements are typically newline-separated and end at the
// first semicolon at column 0 of a new line. We use a simple state machine
// that respects single-quoted string literals (with '' as escape) so we
// don't split on semicolons inside data.

export function splitStatements(sql) {
  const out = [];
  let buf = '';
  let inString = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    buf += c;
    if (c === "'") {
      // Handle '' (escaped single quote) only when already inside a string.
      if (inString && sql[i + 1] === "'") {
        buf += sql[++i];
      } else {
        inString = !inString;
      }
      continue;
    }
    if (c === ';' && !inString) {
      out.push(buf);
      buf = '';
    }
  }
  if (buf.trim()) out.push(buf);
  return out;
}

export function classify(stmt) {
  const trimmed = stmt.trimStart();
  if (/^PRAGMA\b/i.test(trimmed)) return 'pragma';
  if (/^CREATE\s+(TABLE|INDEX|UNIQUE\s+INDEX|TRIGGER|VIEW|VIRTUAL\s+TABLE)/i.test(trimmed)) return 'create';
  if (/^INSERT\s+(OR\s+\w+\s+)?INTO\b/i.test(trimmed)) return 'insert';
  if (/^DROP\b/i.test(trimmed)) return 'drop';
  if (/^DELETE\s+FROM\b/i.test(trimmed)) return 'delete';
  if (/^UPDATE\b/i.test(trimmed)) return 'update';
  return 'other';
}

// Reorder a dump so all CREATE statements run before any INSERTs. Other
// statement kinds (DROP/UPDATE/DELETE/PRAGMA/other) are kept in original
// position relative to each other but bucketed before INSERTs.
export function reorderDump(sql) {
  const stmts = splitStatements(sql);
  const pragmas = [];
  const creates = [];
  const inserts = [];
  const others = [];
  for (const s of stmts) {
    const k = classify(s);
    if (k === 'pragma') pragmas.push(s);
    else if (k === 'create') creates.push(s);
    else if (k === 'insert') inserts.push(s);
    else others.push(s);
  }
  return [
    'PRAGMA foreign_keys=OFF;',
    ...pragmas,
    ...creates,
    ...others,
    ...inserts,
  ].join('\n') + '\n';
}

export function preprocessDump(srcPath, dstPath) {
  const sql = readFileSync(srcPath, 'utf8');
  const out = reorderDump(sql);
  writeFileSync(dstPath, out);
  return dstPath;
}

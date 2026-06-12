// Migration rehearsal per the D1 migration playbook, using Node's built-in
// sqlite (no sqlite3 CLI needed on Windows).
//
//   node scripts/recovery/rehearse-migration.mjs <prod-snapshot.sql> <migration.sql>
//
// Builds an in-memory database from a real production snapshot, captures
// per-table row counts, applies the migration, and fails loudly if any
// pre-existing table's count changed. Prints new tables/indexes so the
// reviewer can confirm the migration created exactly what it claims.

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const [snapshotPath, migrationPath] = process.argv.slice(2);
if (!snapshotPath || !migrationPath) {
  console.error('Usage: node rehearse-migration.mjs <prod-snapshot.sql> <migration.sql>');
  process.exit(2);
}

// FK enforcement off for the import, matching sqlite3 CLI restore behaviour —
// D1 exports aren't ordered for FK-safe sequential insert.
const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: false });
db.exec(readFileSync(snapshotPath, 'utf8'));

const listTables = () =>
  db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '\\_cf%' ESCAPE '\\' ORDER BY name"
  ).all().map(r => r.name);

const countRows = (tables) => {
  const out = {};
  for (const t of tables) out[t] = db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
  return out;
};

const tablesBefore = listTables();
const before = countRows(tablesBefore);

db.exec(readFileSync(migrationPath, 'utf8'));

const tablesAfter = listTables();
const after = countRows(tablesAfter);

let failed = false;
console.log(`${'table'.padEnd(28)}${'before'.padStart(10)}${'after'.padStart(10)}`);
for (const t of tablesBefore) {
  const ok = before[t] === after[t];
  if (!ok) failed = true;
  console.log(`${t.padEnd(28)}${String(before[t]).padStart(10)}${String(after[t]).padStart(10)}${ok ? '' : '  << CHANGED'}`);
}

const newTables = tablesAfter.filter(t => !tablesBefore.includes(t));
console.log(`\nNew tables: ${newTables.join(', ') || '(none)'}`);
for (const t of newTables) {
  const cols = db.prepare(`PRAGMA table_info("${t}")`).all().map(c => `${c.name} ${c.type}${c.notnull ? ' NOT NULL' : ''}${c.pk ? ' PK' : ''}`);
  console.log(`  ${t}: ${cols.join(', ')}`);
  const idx = db.prepare(`PRAGMA index_list("${t}")`).all().map(i => `${i.name}${i.partial ? ' (partial)' : ''}${i.unique ? ' UNIQUE' : ''}`);
  console.log(`  indexes: ${idx.join(', ') || '(none)'}`);
}

if (failed) {
  console.error('\nFAIL: a pre-existing table changed row count. Do NOT apply this migration.');
  process.exit(1);
}
console.log('\nPASS: no pre-existing table changed. Migration is additive as claimed.');

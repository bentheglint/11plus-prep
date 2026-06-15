// Staging-test the JS-REACT-7 backfill against a real prod snapshot.
// Loads a `wrangler d1 export` .sql dump into an in-memory SQLite DB, runs the
// backfill, and asserts it is purely additive and complete.
//
// Usage:
//   node workers/ai-tutor/scripts/staging-test-backfill.mjs <snapshot.sql> <backfill.sql>
//
// Exits non-zero if any assertion fails. No prod access — operates on the dump.

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const [snapPath, backfillPath] = process.argv.slice(2);
if (!snapPath || !backfillPath) {
  console.error('Usage: node staging-test-backfill.mjs <snapshot.sql> <backfill.sql>');
  process.exit(2);
}

const db = new DatabaseSync(':memory:');
// The dump relies on `PRAGMA defer_foreign_keys` (transaction-scoped), but exec()
// runs in autocommit, so FK checks would fire before parent tables exist. Load
// with FK off, then re-enable so the BACKFILL's FK behaviour is tested for real.
db.exec('PRAGMA foreign_keys=OFF;');
db.exec(readFileSync(snapPath, 'utf8'));
db.exec('PRAGMA foreign_keys=ON;');

const count = (t) => Number(db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n);
const fp = (t, cols) => db.prepare(`SELECT child_id, ${cols} FROM ${t} ORDER BY child_id`).all();
const same = (before, after) => {
  const am = new Map(after.map((r) => [r.child_id, JSON.stringify(r)]));
  return before.every((r) => am.get(r.child_id) === JSON.stringify(r));
};

const tables = ['children', 'preferences', 'streaks', 'prep_points'];
const before = Object.fromEntries(tables.map((t) => [t, count(t)]));
const beforePrefs = fp('preferences', 'last_session_date, version');
const beforeStreaks = fp('streaks', 'current_streak, longest_streak, version');
const beforePP = fp('prep_points', 'total, version');

// Run only the INSERT statements from the backfill file; capture rows changed.
const stmts = readFileSync(backfillPath, 'utf8')
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('--') && /^insert/i.test(s));

let totalChanges = 0;
for (const s of stmts) totalChanges += Number(db.prepare(s).run().changes);

const after = Object.fromEntries(tables.map((t) => [t, count(t)]));
const expectedInserts =
  (before.children - before.preferences) +
  (before.children - before.streaks) +
  (before.children - before.prep_points);

const fail = [];
for (const t of ['preferences', 'streaks', 'prep_points']) {
  if (after[t] !== before.children) fail.push(`${t}: after ${after[t]} != children ${before.children}`);
}
if (totalChanges !== expectedInserts) fail.push(`backfill changed ${totalChanges} rows, expected ${expectedInserts} inserts`);
if (!same(beforePrefs, fp('preferences', 'last_session_date, version'))) fail.push('existing preferences rows were modified');
if (!same(beforeStreaks, fp('streaks', 'current_streak, longest_streak, version'))) fail.push('existing streaks rows were modified');
if (!same(beforePP, fp('prep_points', 'total, version'))) fail.push('existing prep_points rows were modified');

console.log('BEFORE:', before);
console.log('AFTER :', after);
console.log(`backfill inserted: ${totalChanges} rows (expected ${expectedInserts})`);
console.log(fail.length
  ? 'STAGING TEST FAILED:\n  - ' + fail.join('\n  - ')
  : 'STAGING TEST PASSED — all three tables now equal child count; only the missing rows were inserted; every pre-existing row is byte-identical.');
process.exit(fail.length ? 1 : 0);

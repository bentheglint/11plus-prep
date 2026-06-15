# JS-REACT-7 fix — design for adversarial review (scope A)

Reviewers: confirm soundness, find failure modes, challenge assumptions. This
touches the live D1 sync core and has caused outages before. Be adversarial.

## The bug (verified against prod, 15 Jun 2026)

Three per-child scalar tables — `preferences` (holds `last_session_date`),
`streaks`, `prep_points` — are written in the batch-sync endpoint via an
**UPDATE-only compare-and-swap (CAS)**:

```
// workers/ai-tutor/routes/batch.js ~393 (preferences), ~381 (streaks)
UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
WHERE child_id = ? AND version = ?
```

If a child has **no row** in that table, the UPDATE matches nothing
(`meta.changes === 0`) and the server returns `conflict`. The server then
fetches "fresh" state (`batch.js` ~621), finds no row, so `currentVersion`
stays `null`. The client conflict handler (`src/hooks/useD1Data.js` ~1134
streaks, ~1153 preferences) re-enqueues the op with `version: opResult.currentVersion`
=== **null**. Next batch, the server hits `if (clientVersion == null) → status:'error'`
(`batch.js` ~306). The client dead-letters the op and drops the data. The row
can never self-heal. Sentry JS-REACT-7 = this, warning level.

There is also a SECOND half to the trap: the server pre-check
(`batch.js` ~272-275, ~349-361) defaults `currentVersion` to **1** when no row
exists (`prefsRow?.version ?? 1`). So a missing-row child whose client version
is anything other than 1 fails the pre-check immediately → same null-refetch →
dead-letter, without even reaching the UPDATE.

### Real prod impact (8 children total)
- missing `preferences` row: **3**
- missing `streaks` row: **3**
- missing `prep_points` row: **2**

So 3/8 children silently cannot sync streaks. Creation paths
(`account.js` 220-224 / 277-281, `bulk.js` ~366) DO seed all three rows, yet
rows are missing in prod — i.e. seeding fails partially in practice, so a
self-healing write path is required, not just a one-off backfill.

## Prod schema (verified via PRAGMA + sqlite_master, NOT migrations)

```
CREATE TABLE preferences (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  last_session_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)
CREATE TABLE streaks (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_quiz_date TEXT,
  streak_history TEXT NOT NULL DEFAULT '[]',
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)
```
`child_id` is PRIMARY KEY on both → `ON CONFLICT(child_id)` is valid.
All NOT NULL columns have defaults. `topic_performance` already uses the
identical INSERT…ON CONFLICT upsert pattern in prod (`batch.js` ~321-329) and
works — it is the template.

## The fix (SCOPE A — chosen by product owner)

Fix `preferences` + `streaks` code paths. For `prep_points`, only backfill the
missing rows (its additive `prep-points-delta` path is already a true upsert,
so its plain-CAS path is insulated). Do NOT change prep_points code this round.

### 1. Server (`batch.js`) — preferences + streaks
Replace the UPDATE-only CAS with a version-gated upsert (mirror topic_performance):

```sql
-- preferences
INSERT INTO preferences (child_id, last_session_date, version)
VALUES (?, ?, 1)
ON CONFLICT(child_id) DO UPDATE SET
  last_session_date = excluded.last_session_date,
  version = preferences.version + 1,
  updated_at = datetime('now')
WHERE preferences.version = ?
```
```sql
-- streaks
INSERT INTO streaks (child_id, current_streak, longest_streak, last_quiz_date, streak_history, version)
VALUES (?, ?, ?, ?, ?, 1)
ON CONFLICT(child_id) DO UPDATE SET
  current_streak = excluded.current_streak,
  longest_streak = excluded.longest_streak,
  last_quiz_date  = excluded.last_quiz_date,
  streak_history  = excluded.streak_history,
  version = streaks.version + 1,
  updated_at = datetime('now')
WHERE streaks.version = ?
```
Behaviour: no row → INSERT at version 1 (any client version), `changes===1` → ok.
Existing row, version matches → UPDATE, `changes===1` → ok. Existing row, version
mismatch → ON CONFLICT fires but WHERE fails → `changes===0` → conflict (with
fresh currentData, as today). Optimistic-lock preserved for real conflicts.

### 2. Server pre-check fix (`batch.js` ~349-361)
Only short-circuit to `conflict` when a row ACTUALLY EXISTS and versions
mismatch. If no row exists (`prefsRow`/`streaksRow` is null), fall through to
the upsert so the INSERT can fire regardless of client version. (This closes
the second half of the trap.) prep_points keeps its existing pre-check.

### 3. Client guard (`useD1Data.js` ~1134, ~1153)
If a conflict response carries `currentVersion == null`, re-enqueue at version 1
(not null). Defence-in-depth so a future regression can't reopen the loop.

### 4. Backfill (one-off, staging-tested, insert-only)
```sql
INSERT OR IGNORE INTO preferences (child_id) SELECT id FROM children;
INSERT OR IGNORE INTO streaks      (child_id) SELECT id FROM children;
INSERT OR IGNORE INTO prep_points  (child_id) SELECT id FROM children;
```
Defaults fill all other columns. Heals the 3+3+2 affected children immediately.

## Safety protocol (mandatory)
- Worker test reproducing the bug (fails on current code, passes after).
- schemaParity test covers preferences+streaks columns.
- Staging-test backfill against a `wrangler d1 export` snapshot; row-count
  assertions (only inserts, no deletes/updates of existing rows).
- Fresh prod snapshot immediately before deploy (rollback point).
- Worker deploys via `npx wrangler deploy` from workers/ai-tutor/ (separate
  from frontend deploy.sh).

## Questions for reviewers
1. Is the upsert + pre-check-skip-when-no-row correct and complete, or is there
   a path that still dead-letters?
2. Any concurrency/race issue introduced by INSERT…ON CONFLICT vs the old UPDATE
   within the existing sequential opPlans execution?
3. Is the client "re-enqueue at version 1 on null" guard safe, or could it cause
   a write to clobber a newer server row?
4. Any risk in the backfill (FK, triggers, version semantics) given the real
   schema above?
5. Is scope A defensible, or does leaving prep_points's CAS path unfixed create
   a real (not theoretical) hazard now that all rows are backfilled?

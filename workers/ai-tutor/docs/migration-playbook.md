# D1 Migration Playbook

**Status:** Mandatory checklist for all D1 schema changes
**Created:** 29 April 2026 (post the 27 April cascade-wipe incident)
**Applies to:** `workers/ai-tutor/migrations/*.sql`

This document exists because we lost six children's worth of D1 data on
27 April when a routine migration `DROP TABLE`d a foreign-key parent and
the cascade deleted everything downstream. **Every migration from now on
must pass this checklist before being applied to production.**

---

## The 27 April incident — one-paragraph version

A migration was written that recreated several tables (the intent was a
schema refactor). The migration started with `DROP TABLE accounts` and
relied on `PRAGMA foreign_keys = OFF` to suppress the cascade. **Cloudflare
D1 silently ignores `PRAGMA foreign_keys`**, so the cascade fired anyway
and all child rows were deleted — quizzes, streaks, prep points,
achievements, the lot. Six accounts. Recovery took 48 hours and required
device-by-device localStorage exports plus a custom merge tool.

---

## Hard rules

### 1. Never `DROP TABLE` on a foreign-key PARENT

The `accounts` and `children` tables are FK parents for nearly everything
else (`quiz_results`, `question_results`, `streaks`, `prep_points`, etc).
**Never `DROP TABLE` either of them, even with the intent to recreate.**
D1 will cascade-delete everything downstream regardless of `PRAGMA
foreign_keys` settings.

If you genuinely need to alter `accounts` or `children`, use:
- `ALTER TABLE ... ADD COLUMN ...`
- `ALTER TABLE ... RENAME COLUMN ...`
- `CREATE TABLE new ... INSERT INTO new SELECT FROM old ... DROP TABLE old; ALTER TABLE new RENAME TO old` — but **only** for tables that are NOT FK parents.

### 2. `PRAGMA foreign_keys = OFF` is a lie on D1

D1 ignores it. Do not rely on it to make a destructive operation safe.
The only true way to suspend cascade behaviour is to drop the FK
constraint itself with `ALTER TABLE ... DROP FOREIGN KEY` (which D1
also doesn't support directly — you'd need to recreate the child table
without the constraint).

### 3. Every migration is staging-tested first

Before applying a migration to production D1:

1. Build a local SQLite database from the latest production snapshot:
   ```bash
   wrangler d1 export 11plus-user-data --remote --output=backups/d1-snapshot-pre-$(date +%Y-%m-%d).sql
   sqlite3 staging.db < backups/d1-snapshot-pre-*.sql
   ```
2. Apply the migration:
   ```bash
   sqlite3 staging.db < workers/ai-tutor/migrations/NNNN_*.sql
   ```
3. Run row-count verification (see template below). Compare each table's
   pre/post counts and assert they match expectations.
4. If anything is unexpected, **stop**. Never paper over a row-count
   surprise — that's how 27 April happened.

### 4. Take a fresh production snapshot immediately before applying

Even if you have an older snapshot. Take a new one. Cost is 30 seconds
and ~500 KB on disk:

```bash
wrangler d1 export 11plus-user-data --remote --output=backups/d1-snapshot-pre-NNNN.sql
```

This snapshot is your rollback point. Keep it indefinitely; we have
zero benefit from deleting these.

### 5. Apply with verification, in this order

```bash
# 1. Snapshot (rollback point)
wrangler d1 export 11plus-user-data --remote --output=backups/d1-snapshot-pre-NNNN.sql

# 2. Apply migration
wrangler d1 execute 11plus-user-data --remote --file=workers/ai-tutor/migrations/NNNN_*.sql

# 3. Verify with same row-count queries you ran in staging
wrangler d1 execute 11plus-user-data --remote --command="SELECT 'accounts' AS t, COUNT(*) FROM accounts UNION ALL SELECT 'children', COUNT(*) FROM children UNION ALL SELECT 'quiz_results', COUNT(*) FROM quiz_results"
```

If any count is unexpected, immediately re-import the pre-snapshot:

```bash
wrangler d1 execute 11plus-user-data --remote --file=backups/d1-snapshot-pre-NNNN.sql
```

(D1 imports do `CREATE TABLE IF NOT EXISTS` + `INSERT`, so it's not a
clean rollback for arbitrary state — but it's better than nothing for
catastrophic recovery.)

---

## Pre-migration checklist (paste this into the migration PR description)

```
- [ ] Migration does NOT `DROP TABLE accounts` or `DROP TABLE children`
- [ ] Migration does NOT rely on `PRAGMA foreign_keys = OFF`
- [ ] Local SQLite staging test passes (row counts before/after as expected)
- [ ] Fresh production snapshot taken: backups/d1-snapshot-pre-NNNN.sql
- [ ] Verification SQL queries written and tested against staging
- [ ] Worker code changes (if any) tested separately via test-worker-fixes.py
- [ ] Plan for rollback documented in this PR description
```

---

## Row-count verification template

Use this script to compare row counts before and after a migration. Adjust
the table list as needed.

```python
# scripts/recovery/verify-migration-counts.py
import sqlite3
import sys

TABLES = [
    "accounts", "children", "quiz_results", "question_results",
    "mock_test_results", "topic_performance", "leitner_queue",
    "lesson_history", "practice_sessions", "seen_questions",
    "achievements", "seen_tips", "streaks", "prep_points", "preferences",
]

def counts(db_path):
    conn = sqlite3.connect(db_path)
    out = {}
    for t in TABLES:
        try:
            out[t] = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        except sqlite3.OperationalError:
            out[t] = "MISSING"
    conn.close()
    return out

if __name__ == "__main__":
    before, after = sys.argv[1], sys.argv[2]
    b, a = counts(before), counts(after)
    print(f"{'table':<24}{'before':>10}{'after':>10}{'delta':>10}")
    for t in TABLES:
        delta = (a[t] - b[t]) if isinstance(a[t], int) and isinstance(b[t], int) else "?"
        print(f"{t:<24}{b[t]:>10}{a[t]:>10}{str(delta):>10}")
```

Run it:
```bash
python scripts/recovery/verify-migration-counts.py staging-pre.db staging-post.db
```

Any unexpected `delta` should block the migration from going to production.

---

## What to do if a migration goes wrong in production

1. **Don't panic. Don't try to fix it forward.** That made 27 April worse.
2. **Take a snapshot of the broken state immediately** — it'll help with
   diagnosis later, even if the data is gone.
3. **Stop all writes** with an emergency freeze in `index.js` (we have
   commit `a39e74d` as a template):
   ```js
   if (path.startsWith('/api/data/') && request.method !== 'GET') {
     return json({ error: 'Service temporarily in read-only mode' }, 503);
   }
   ```
4. **Deploy the freeze** before doing anything else: `wrangler deploy`.
5. **Then diagnose** — compare the pre-snapshot to the broken state.
6. **Recovery options, in order of preference:**
   a. Restore from pre-snapshot (clean rollback)
   b. Hand-build a merge SQL from device localStorage exports + the pre-snapshot
   c. Accept the data loss and start fresh

The recovery toolkit in `scripts/recovery/` has the full template from
the 27 April incident.

---

## What we learned

- **Test against a real SQLite copy of production, not a fresh schema.**
  We caught the duplicate-row data quality issues only because we ran
  the merge against a real snapshot. A fresh-schema test would have
  passed and we'd have shipped duplicates.
- **The migration handler clobbers timestamps.** When re-migrating from
  legacy localStorage to D1 post-wipe, the worker writes
  `attempted_at = migration_time` instead of the original `date` field.
  Same for `unlocked_at`, `first_seen_at`, etc. Fix is in the backlog —
  preserve original timestamps in the migration POST handler.
- **`session_id` matters more than we thought.** It's the only practical
  natural key for `quiz_results` and `question_results`. Old client
  versions didn't always set it, leaving NULL rows that can't be
  protected by UNIQUE indexes against replay. New code always sets it.
- **Empty SyncQueues are a good signal but not proof.** All known
  devices' SyncQueues were empty when we exported them, but that didn't
  tell us about devices we hadn't exported.

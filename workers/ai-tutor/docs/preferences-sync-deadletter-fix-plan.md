# Fix plan — preferences sync dead-letter (Sentry JAVASCRIPT-REACT-7)

**Status:** diagnosed, not yet implemented. Written 13 Jun 2026.
**Severity:** low (preferences holds only `last_session_date`, a cross-device
convenience). But the underlying *UPDATE-only CAS* shape also applies to
`streaks`, where a missing row would be more user-visible — so fix the class,
not just the symptom.

---

## Symptom

Sentry `JAVASCRIPT-REACT-7` — `[SyncQueue] Dead-lettered operation`, warning
level, 2 occurrences (11 Jun 17:29, 12 Jun 06:46), 1 user
(child `618ecc1d-8c9e-467a-9873-dc7da1c1039b`). Extra data:
`type: "preferences"`, `reason: "server-rejected: per-op status was error"`.

## Root cause

The preferences write in the batch-sync endpoint is a compare-and-swap
**UPDATE**, not an upsert:

```
// workers/ai-tutor/routes/batch.js  (~line 393)
UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
WHERE child_id = ? AND version = ?
```

For a child that has **no `preferences` row**, this can never succeed, and the
failure escalates into a permanent dead-letter via this loop:

1. `currentVersions.preferences` defaults to `1` when no row exists
   (`batch.js` ~line 275: `prefsRow?.version ?? 1`).
2. Client sends a preferences op at version 1. Server pre-check
   `clientVersion === currentVersion` (1 === 1) passes, so it builds the CAS
   UPDATE.
3. The UPDATE matches no row → `meta.changes === 0` → server returns
   `status: 'conflict'`, and the fresh-state fetch (`batch.js` ~line 624,
   `if (fresh)`) finds no row, so `currentVersion` stays `null`.
4. Client conflict handler re-enqueues preferences with
   `version: opResult.currentVersion` === **`null`**
   (`src/hooks/useD1Data.js` ~line 1153-1156).
5. Next batch: server hits `if (clientVersion == null)` → returns
   `status: 'error'` ("Missing version") (`batch.js` ~line 306).
6. Client `deadLetterErrors()` moves the op to the dead-letter store and
   reports to Sentry. The op is dropped; preferences never sync for that child.

Both normal child-creation paths DO seed all three scalar rows
(`account.js` lines 220-224 and 277-281: streaks + prep_points + preferences),
and bulk onboarding seeds preferences explicitly (`bulk.js` ~line 366). So the
affected child is a **legacy child created before scalar-row seeding existed**,
or one whose seed batch failed. Low frequency, but the row can never self-heal.

## Why it matters beyond this one issue

`streaks` uses the identical UPDATE-only CAS shape. If a streaks row is ever
missing (same legacy/partial-seed scenario), streak data would silently fail to
sync the same way — and streaks are more user-visible than `last_session_date`.
`prep_points` is partly insulated because the additive `prep-points-delta` path
is a true upsert (`INSERT ... ON CONFLICT DO UPDATE`), but its plain CAS path
has the same latent gap.

---

## Proposed fix (make the class extinct)

**1. Convert the preferences CAS to a version-gated upsert** (mirror the
`topic-performance` pattern already in `batch.js` ~line 321):

```sql
INSERT INTO preferences (child_id, last_session_date, version)
VALUES (?, ?, 1)
ON CONFLICT(child_id) DO UPDATE SET
  last_session_date = excluded.last_session_date,
  version = preferences.version + 1,
  updated_at = datetime('now')
WHERE preferences.version = ?
```

A missing row is created at version 1; an existing row still honours the
optimistic-lock (`meta.changes === 0` on version mismatch → `conflict`, as
today). This removes the perpetual-conflict trap.

**2. Apply the same upsert shape to the `streaks` CAS** for parity (it has the
identical latent bug).

**3. Client guard against null-version re-enqueue**
(`useD1Data.js` ~line 1153): if a conflict response carries
`currentVersion == null`, do not re-enqueue with `version: null`. Either drop
the op (the upsert will have created the row on the next fresh write) or
re-enqueue at version 1. Defence-in-depth so a future server regression can't
reopen the same dead-letter loop.

**4. One-off backfill** of missing scalar rows for existing children:
`INSERT OR IGNORE INTO {streaks,prep_points,preferences} (child_id) SELECT id FROM children ...`
so already-affected children (incl. `618ecc1d…`) self-heal immediately rather
than waiting for the next write.

---

## Safety protocol (MANDATORY — this touches the sync core + prod D1)

Per `CLAUDE.md` Duplicated-Truth rules and `migration-playbook.md`:

- [ ] **Check prod schema first**, do not trust migrations == prod:
      `npx wrangler d1 execute 11plus-user-data --remote --command "PRAGMA table_info(preferences)"`
      (and `streaks`). Confirm columns `version`, `last_session_date`,
      `updated_at` exist exactly as the SQL assumes.
- [ ] Update / verify `workers/ai-tutor/tests/schemaParity.test.js` covers
      preferences + streaks columns.
- [ ] Add a worker test that reproduces the bug: a child with no preferences
      row → preferences op → expect the row is created and status `ok`, NOT
      `error`/dead-letter. This test must FAIL on current code and pass after.
- [ ] Staging-test the backfill SQL against a `wrangler d1 export` snapshot with
      row-count assertions (no row deletions, only inserts).
- [ ] **Fresh prod snapshot immediately before deploy** (rollback point).
- [ ] `/codex:adversarial-review` + `/senior-dev` on the diff before deploy —
      this is payment-adjacent sync logic that has caused outages before.
- [ ] Worker deploys via `npx wrangler deploy` from `workers/ai-tutor/`
      (separate from the frontend `deploy.sh`).

## Acceptance criteria

- [ ] A child with no preferences row can sync a `saveLastSessionDate` write:
      the row is created and the op returns `ok` (verified by new worker test).
- [ ] Existing version-mismatch behaviour still returns `conflict` (not error),
      and a genuine conflict still refetches + retries correctly.
- [ ] Streaks given the same upsert treatment; its CAS-conflict path unchanged.
- [ ] Client never re-enqueues a sync op with `version: null`.
- [ ] Backfill leaves every child with one row each in streaks/prep_points/
      preferences; no other rows touched (row-count assertions).
- [ ] JAVASCRIPT-REACT-7 produces no new events after deploy; resolve in Sentry
      once confirmed clean.

## Files in scope

- `workers/ai-tutor/routes/batch.js` — preferences + streaks CAS → upsert
- `src/hooks/useD1Data.js` — null-version re-enqueue guard (~line 1153)
- `workers/ai-tutor/tests/` — reproduction test + schemaParity coverage
- backfill: one-off SQL (staging-tested), not a tracked migration unless wanted

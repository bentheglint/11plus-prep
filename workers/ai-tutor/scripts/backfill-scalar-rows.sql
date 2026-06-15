-- JS-REACT-7 backfill — ensure every child has one row in each scalar table.
--
-- WHY: some legacy/partial-seed children are missing their preferences/streaks/
-- prep_points rows. The sync code now self-heals a missing row on first write
-- (version-gated upsert), but this backfill heals already-affected children
-- immediately rather than waiting for their next write.
--
-- SAFETY: insert-only. INSERT OR IGNORE never updates or deletes an existing
-- row; column defaults (version=1, updated_at=now, counters=0) fill the rest.
-- Touches only the child side of the FK — no parent table, no cascade.
--
-- RUNBOOK:
--   1. Take a fresh prod snapshot first:  wrangler d1 export 11plus-user-data --remote --output backup-pre-backfill.sql
--   2. Staging-test against that snapshot (row-count assertions, inserts only).
--   3. Apply:  wrangler d1 execute 11plus-user-data --remote --file scripts/backfill-scalar-rows.sql
--   4. Verify (must each equal COUNT(*) FROM children):
--        SELECT (SELECT COUNT(*) FROM children) AS children,
--               (SELECT COUNT(*) FROM preferences) AS preferences,
--               (SELECT COUNT(*) FROM streaks)      AS streaks,
--               (SELECT COUNT(*) FROM prep_points)  AS prep_points;

INSERT OR IGNORE INTO preferences (child_id) SELECT id FROM children;
INSERT OR IGNORE INTO streaks      (child_id) SELECT id FROM children;
INSERT OR IGNORE INTO prep_points  (child_id) SELECT id FROM children;

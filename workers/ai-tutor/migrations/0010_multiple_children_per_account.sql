-- Allow year_group and target_school on child profiles (used by Tutor Mode).
-- Safe for D1: ALTER TABLE ADD COLUMN only — no DROP, no rebuild, no cascade risk.
--
-- NOTE: The original migration also intended to remove the UNIQUE(account_id)
-- constraint from children (to allow multiple children per account). That requires
-- a table rebuild (create-copy-drop-rename) which is NOT safe in D1 because D1
-- silently ignores PRAGMA foreign_keys=OFF, meaning DROP TABLE children would
-- cascade-wipe question_results, quiz_results, topic_performance, etc.
-- That constraint removal is deferred to a future migration window using a full
-- D1 export/import procedure. Most users have one child; the app works correctly
-- under that constraint.

ALTER TABLE children ADD COLUMN year_group INTEGER;
ALTER TABLE children ADD COLUMN target_school TEXT;

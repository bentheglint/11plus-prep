-- Fix d1_migrations tracking drift.
-- 0012, 0013, 0014 were applied directly via wrangler d1 execute --file
-- and were never recorded in the tracking table.
-- Verified applied before inserting:
--   0012: assignment_items.subject column confirmed present
--   0013: data-only UPDATE, sandwiched between verified 0012 + 0014
--   0014: tutor_allowlist table + 2 seed rows confirmed present
INSERT OR IGNORE INTO d1_migrations (name, applied_at) VALUES
  ('0012_assignment_subject_and_results.sql', '2026-06-07 00:00:00'),
  ('0013_email_opt_in_default_on.sql',        '2026-06-07 00:00:00'),
  ('0014_admin_panel.sql',                    '2026-06-08 00:00:00');

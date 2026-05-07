-- 0008_email_opt_in.sql
-- Add email opt-in preference to accounts.
--
-- Default 0 (opted out) — requires explicit opt-in at signup.
-- Existing accounts remain opted-out until they toggle the preference
-- in the Parent Dashboard.
--
-- Safe migration: ALTER TABLE ADD COLUMN with DEFAULT is non-destructive.
-- No DROP TABLE, no FK parents touched, no cascade risk.

ALTER TABLE accounts ADD COLUMN email_opt_in INTEGER NOT NULL DEFAULT 0;

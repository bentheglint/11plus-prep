-- Migration 0013: Opt all existing accounts into email by default.
--
-- Background: Email opt_in was originally added (0008) as opt-in default 0,
-- which meant trial milestone emails and weekly progress emails went only to
-- users who had explicitly opted in at signup. In practice almost no one ticked
-- the box, so the activation channel was effectively switched off.
--
-- Decision (19 May 2026): switch to opt-out semantics. New accounts default to
-- opted-in (handled in account.js). Existing accounts get opted-in here. Users
-- can still toggle off via the ParentDashboard email preference switch.
--
-- Safety: this is a pure value update on a non-FK column. No table changes.
-- No DROP TABLE. PRAGMA foreign_keys irrelevant. Reversible by setting
-- email_opt_in = 0 for any account that toggles off via the UI.

UPDATE accounts SET email_opt_in = 1 WHERE email_opt_in = 0;

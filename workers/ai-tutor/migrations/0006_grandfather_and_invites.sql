-- Grandfather existing accounts + support invite codes.
-- Created: 18 April 2026
--
-- Context: we're shipping a paid tier (£15/month, Option B trial). Everyone
-- who has an account at migration time keeps free access forever (Ben, family,
-- soft-launch friends). Future signups either use an invite code (free
-- forever) or go through the 7-day trial → paywall.
--
-- Columns:
--   is_comped       — 1 = free-forever access, bypasses trial + subscription
--   comp_source     — audit trail, e.g. 'grandfather-2026-04-18' or 'invite:EVIE-FRIENDS'

PRAGMA foreign_keys = ON;

ALTER TABLE accounts ADD COLUMN is_comped INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN comp_source TEXT;

-- Grandfather every account that exists at migration time. No WHERE clause —
-- anyone signing up AFTER the migration applies goes through the normal
-- trial/subscribe/invite flow. Anyone who already had an account stays free.
UPDATE accounts SET is_comped = 1, comp_source = 'grandfather-2026-04-18'
WHERE is_comped = 0;

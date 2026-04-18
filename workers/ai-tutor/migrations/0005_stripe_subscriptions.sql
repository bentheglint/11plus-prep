-- Stripe subscriptions — add subscription state to accounts.
-- Created: 17 April 2026
--
-- Adds three columns to the accounts table so we can gate access on
-- subscription status without round-tripping to Stripe on every request.
-- The Worker keeps D1 in sync via Stripe webhooks.
--
-- SQLite's ALTER TABLE ADD COLUMN doesn't support IF NOT EXISTS, but
-- wrangler's d1_migrations tracker prevents re-running a migration
-- that has already been applied. Safe as long as migrations run in
-- order.

PRAGMA foreign_keys = ON;

ALTER TABLE accounts ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE accounts ADD COLUMN subscription_status TEXT;
ALTER TABLE accounts ADD COLUMN subscription_current_period_end INTEGER;

-- Lookup by Stripe customer ID (needed on webhook events)
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_customer
  ON accounts(stripe_customer_id);

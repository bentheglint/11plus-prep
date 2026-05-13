-- Stripe webhook idempotency log.
-- Created: 10 May 2026
--
-- Stripe delivers webhooks at-least-once. Without dedup, a retried event
-- could be processed twice — usually harmless for status updates, but
-- not principle-correct. This table is the dedup log.
--
-- Pattern: webhook handler INSERT OR IGNOREs event.id BEFORE doing any
-- work. If 0 rows changed, the event is a replay → return 200 immediately
-- without further processing.
--
-- Standalone table with no FK relationships, so applying this migration
-- is risk-free per the post-27-April playbook (no DROP TABLE, no parent
-- table touched).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Lookup by type for the reconciliation cron + ad-hoc forensics.
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type
  ON stripe_webhook_events(type);

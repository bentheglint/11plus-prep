-- 0018: app_settings — app-wide runtime settings (data-plane flags).
--
-- Purely additive: one new table, no ALTER, no DROP, no rebuild, no FK
-- (playbook-safe class — see docs/migration-playbook.md). Currently used
-- for exactly one key: 'free_tier_enforcement', the freemium kill-switch
-- (see lib/killSwitch.js).
--
-- DELIBERATELY no default row is inserted here. An ABSENT
-- 'free_tier_enforcement' row MEANS "enforcement is ON" — the fail-safe
-- default. Enforcement is disengaged ONLY by an explicit row with an
-- off-ish value ('off'/'false'/'0'/'disabled'). This lets ops flip the
-- switch with a single UPSERT during an incident without a code rebuild,
-- and guarantees a missing/misconfigured table can never silently give
-- the product away — see lib/killSwitch.js for the read-side contract.
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

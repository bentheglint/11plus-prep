-- 0017: daily_claims — per-child daily-entitlement claim primitive.
--
-- Purely additive: one new table, no ALTER, no DROP, no rebuild. The only
-- FK points OUT to children(id) ON DELETE CASCADE, so this adds no new
-- cascade path INTO existing data (playbook-safe class — see
-- docs/migration-playbook.md).
--
-- GDPR erasure is automatic: accounts -> children -> daily_claims all
-- cascade on delete, so no manual DELETE is needed in routes/account.js,
-- consistent with every other per-child table.
--
-- The cap (currently 1 claim per child/entitlement/day) is enforced by the
-- UNIQUE constraint via an atomic INSERT OR IGNORE — never read-then-write,
-- because D1 is eventually consistent and a read-then-write has a race
-- window between two edge requests.
--
-- owner_session_id records which session won the day's claim, so a resume
-- of the SAME session (e.g. a reload mid-quiz) is idempotent rather than
-- being told the day is used up.
--
-- local_day is always server-computed (Europe/London calendar day) and
-- never client-supplied — a client-supplied day would let a device with a
-- wrong clock (or a malicious client) claim extra days.
--
-- entitlement_type is server-supplied from a fixed vocabulary (currently
-- only 'daily_set'). It is left as free TEXT with no CHECK constraint so
-- that future capped entitlement types can be added without a table
-- rebuild (SQLite CHECK constraints can't be altered in place).

CREATE TABLE daily_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  entitlement_type TEXT NOT NULL,
  local_day TEXT NOT NULL,
  owner_session_id TEXT,
  claimed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (child_id, entitlement_type, local_day)
);

-- No extra indexes: the UNIQUE constraint's implicit index covers both the
-- exact claim lookup (child_id, entitlement_type, local_day) and any
-- child_id-prefix lookup.

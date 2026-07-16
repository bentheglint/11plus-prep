-- 0019: join_intents — server-side trace of a tutor-referral join, from the
-- moment a parent's authed session first holds a pending code, through to
-- Connect (or an explicit decline). See plans/tutor-attribution-durability.md
-- layer 2 (the "durability" doc — read that first for the full incident
-- history this table exists to fix).
--
-- Purely additive: one new table + indexes. No ALTER, no DROP, no rebuild
-- (playbook-safe class — see docs/migration-playbook.md). Both FKs point
-- OUT to accounts(id) and tutors(id) ON DELETE CASCADE, so this adds no new
-- cascade path INTO existing data — deleting an account or a tutor removes
-- their join_intents rows as a side effect, which is also the GDPR erasure
-- behaviour we want (no manual DELETE needed in routes/account.js).
--
-- Before this table, tutor attribution lived ONLY in a client-side carrier
-- (URL /join/<code> -> localStorage) until the parent tapped Connect. Every
-- failure mode (browser hop, back-arrow misclick, silent abandon) left ZERO
-- server trace, so a failed referral was indistinguishable from an organic
-- signup. This table makes every stage of that journey visible and durable:
--   'pending'  — a parent's authed session holds the code but has not
--                decided yet (written as soon as the code is seen, so a
--                decline or an abandon is still traced, not just a join).
--   'joined'   — the parent tapped Connect (or /api/tutor/join otherwise
--                succeeded). Set by /api/tutor/join itself, so a join is
--                ALWAYS traced even if the client never posted an intent
--                first (e.g. an older client build).
--   'declined' — the parent explicitly tapped "Not now" on JoinScreen.
--
-- UNIQUE(account_id, tutor_id) makes the create endpoint idempotent: a
-- repeat POST from the same session/device just bumps updated_at via
-- INSERT ... ON CONFLICT DO UPDATE (never read-then-write — D1 is
-- eventually consistent, and a read-then-write has a race window). Status
-- transitions on conflict are asymmetric by design:
--   * 'declined' -> 'pending' IS allowed on a fresh join-intent POST — a
--     returning parent re-using the link is re-considering, and the whole
--     point of layer 3 (JoinScreen) is that a decline must not be a dead
--     end.
--   * 'joined' is NEVER downgraded by a join-intent POST or a decline —
--     once real consent (the Connect tap) has fired, that is the durable
--     record and nothing overwrites it.
--
-- tutor_code is stored alongside tutor_id (denormalised) so the admin
-- "unlinked signups" view and the /api/account bootstrap payload can read
-- the code straight off this row without an extra join back through
-- tutors for the common case — tutors.tutor_code is still the source of
-- truth if the two ever need reconciling (tutor codes are immutable once
-- issued, so drift is not a live concern).

CREATE TABLE join_intents (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  tutor_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'joined', 'declined')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (account_id, tutor_id)
);

-- Bootstrap lookup (routes/account.js GET /api/account): the single
-- most-recent 'pending' intent for this account. account_id-leading so it
-- also covers a plain per-account lookup with no status filter.
CREATE INDEX idx_join_intents_account ON join_intents (account_id, status, created_at);

-- Admin "is this signup a tutor referral?" listing (layer 4): filter/sort
-- by status across all accounts. Mirrors idx_tutor_invites_status in
-- 0016_tutor_invites.sql.
CREATE INDEX idx_join_intents_status ON join_intents (status, created_at);

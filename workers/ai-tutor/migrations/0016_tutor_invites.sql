-- 0016: tutor_invites — bulk pupil onboarding (per-pupil email invites).
--
-- Purely additive: one new table + indexes. No ALTER, no DROP, no rebuild.
-- FKs point OUT to tutors/children only, so this adds no cascade path into
-- existing data (playbook-safe class).
--
-- Design notes (from the 12 Jun adversarial review):
-- * Raw invite tokens are bearer secrets. token_plain holds the raw token
--   ONLY until the email is delivered (the send path needs it to compose
--   the link), then it is wiped; token_hash (SHA-256 hex) remains for
--   claim lookups. Claims are only honoured for delivered invites
--   ('sent'/'send_failed'), so an undelivered token at rest is inert.
--   The id column is the safe, loggable identifier for audit rows and
--   admin actions.
-- * Status transitions are enforced in the Worker via conditional UPDATEs
--   (WHERE status IN ...); the CHECK constraint stops invalid values at
--   the door.
-- * The partial UNIQUE index blocks duplicate LIVE invites only: a revoked
--   or expired invite never bricks a legitimate re-invite, while pending/
--   sent/joined rows can't be double-created (so nobody is emailed twice).
-- * Unclaimed invites are purged after expiry by the scheduled sweeper
--   (GDPR: child names must not sit here indefinitely). Account erasure
--   also deletes matching invite rows.

CREATE TABLE tutor_invites (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  token_plain TEXT,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  batch_id TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  child_name TEXT NOT NULL,
  year_group INTEGER,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('needs_review','pending','sent','send_failed','joined','revoked','expired')),
  claimed_by_email TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  sent_at TEXT,
  joined_at TEXT,
  joined_child_id TEXT REFERENCES children(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_tutor_invites_live_dedupe
  ON tutor_invites (tutor_id, parent_email, child_name)
  WHERE status IN ('needs_review','pending','sent','send_failed','joined');

CREATE INDEX idx_tutor_invites_tutor ON tutor_invites (tutor_id, created_at);
CREATE INDEX idx_tutor_invites_status ON tutor_invites (status, created_at);

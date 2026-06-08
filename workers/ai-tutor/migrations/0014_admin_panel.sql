-- Admin panel foundations: tutor-eligibility allowlist + admin action audit log.
-- ADDITIVE ONLY: two brand-new tables, no drops, no FK into accounts/children,
-- so none of the cascade machinery from the 27 April incident is in play.
--
-- Emails are stored canonicalised (trim + lowercase). The Worker applies the
-- identical normalisation (canonicalEmail in helpers.js) before every compare
-- or insert, so grant/revoke/eligibility never drift on case or whitespace.

CREATE TABLE tutor_allowlist (
  email     TEXT PRIMARY KEY,                  -- canonical: trim(lower(email))
  note      TEXT,                              -- e.g. "Collette — ~50 pupils"
  added_by  TEXT NOT NULL,                     -- admin Clerk userId (or migration:NNNN for seeds)
  added_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Append-only log of every admin mutation. target/detail carry OPAQUE IDs and
-- action metadata only — never child names or free-text parent emails (the
-- allowlist email is the one deliberate exception, as it IS the key being acted on).
CREATE TABLE admin_audit (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id    TEXT NOT NULL,                   -- who performed the action
  action      TEXT NOT NULL,                   -- grant_tutor | revoke_tutor | comp | uncomp | remove_pupil
  target      TEXT,                            -- opaque: accountId / tutorId / "childId:tutorId" / email (allowlist only)
  detail      TEXT,                            -- JSON: before/after values, rows-affected
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_admin_audit_created ON admin_audit(created_at);

-- Seed eligibility from the current code allowlist (canonicalised).
INSERT OR IGNORE INTO tutor_allowlist (email, note, added_by) VALUES
  ('ben@venortech.com', 'Owner', 'migration:0014'),
  ('suemedley65@gmail.com', 'Founding tutor', 'migration:0014');

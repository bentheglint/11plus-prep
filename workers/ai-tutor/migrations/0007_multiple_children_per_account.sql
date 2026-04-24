-- Allow parent accounts to hold more than one child profile.
-- SQLite doesn't support DROP CONSTRAINT, so we rebuild the table.
-- Also adds year_group and target_school for Tutor Mode.

PRAGMA foreign_keys = OFF;

CREATE TABLE children_new (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  year_group INTEGER,
  target_school TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
  -- UNIQUE(account_id) removed — one account can now have many children
);

INSERT INTO children_new (id, account_id, display_name, created_at)
SELECT id, account_id, display_name, created_at FROM children;

DROP TABLE children;
ALTER TABLE children_new RENAME TO children;

CREATE INDEX idx_children_account ON children(account_id);

PRAGMA foreign_keys = ON;

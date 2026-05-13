-- Tutor Mode schema: all tutor-related tables created in one migration.
-- Worker code for each table is phased (Phase 2–6) but schema is created
-- up-front so later phases only add endpoint code, not new migrations.

-- ── Tutor accounts ────────────────────────────────────────────────────────
-- Open signup: any Clerk user can become a tutor.
-- A tutor may also be a parent (has their own child on the platform).
CREATE TABLE tutors (
  id TEXT PRIMARY KEY,                   -- Clerk user id
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,                              -- 2-line public description
  tutor_code TEXT NOT NULL UNIQUE,       -- used in invite links: /join/<tutor_code>
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  payout_earned_cents INTEGER NOT NULL DEFAULT 0,
  payout_approved INTEGER NOT NULL DEFAULT 0,      -- 0/1 bool; set 1 at manual review
  bulk_invite_approved INTEGER NOT NULL DEFAULT 0  -- 0/1 bool; set 1 after >20 review
);

CREATE INDEX idx_tutors_code ON tutors(tutor_code);

-- ── Pupil ↔ tutor many-to-many ────────────────────────────────────────────
-- Represents "this child is on this tutor's roster".
-- Composite FK in downstream tables (tutor_notes, conversations,
-- assignment_recipients) references this PK.
CREATE TABLE pupil_tutors (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, tutor_id)
);

CREATE INDEX idx_pupil_tutors_tutor ON pupil_tutors(tutor_id);

-- ── Named classes (optional — 1:1 tutors may never use these) ────────────
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_classes_tutor ON classes(tutor_id);

-- ── Pupil ↔ class many-to-many within a tutor's scope ───────────────────
CREATE TABLE class_enrolments (
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (class_id, child_id)
);

-- ── Tutor private notes (per pupil, deleted with relationship) ───────────
CREATE TABLE tutor_notes (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- Composite FK: note can only exist if the tutor-pupil relationship exists.
  FOREIGN KEY (child_id, tutor_id) REFERENCES pupil_tutors(child_id, tutor_id) ON DELETE CASCADE
);

-- ── Assignments (weekly plans) ───────────────────────────────────────────
-- Target is either a class OR an individual pupil (not both).
CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  target_class_id TEXT,   -- nullable; FK to classes(id)
  target_child_id TEXT,   -- nullable; FK to pupil_tutors via tutor_id
  title TEXT,
  due_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK ((target_class_id IS NULL) != (target_child_id IS NULL)),
  FOREIGN KEY (target_class_id) REFERENCES classes(id) ON DELETE CASCADE,
  -- Child target: the child must be on this tutor's roster.
  FOREIGN KEY (target_child_id, tutor_id) REFERENCES pupil_tutors(child_id, tutor_id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_tutor ON assignments(tutor_id);

-- ── Assignment items (individual tasks within a plan) ───────────────────
CREATE TABLE assignment_items (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('topic', 'custom_quiz', 'mock', 'lesson')),
  item_ref TEXT NOT NULL,   -- topic key, quiz id, mock id, or lesson id
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Per-child recipient state (one row per child × item, created at send) ─
CREATE TABLE assignment_recipients (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  assignment_item_id TEXT NOT NULL REFERENCES assignment_items(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL,
  tutor_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned'
    CHECK (status IN ('assigned','in_progress','completed','late','cleared','cancelled')),
  assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  completed_at TEXT,
  score INTEGER,
  cleared_at TEXT,
  -- Child must be on this tutor's roster (prevents cross-tenant assignment).
  FOREIGN KEY (child_id, tutor_id) REFERENCES pupil_tutors(child_id, tutor_id) ON DELETE CASCADE,
  UNIQUE (assignment_item_id, child_id)
);

CREATE INDEX idx_recipients_child ON assignment_recipients(child_id, tutor_id);

-- ── Tutor ↔ parent messaging (v1: polled) ────────────────────────────────
-- One conversation per (tutor × child). Parent identity derived via children table.
-- Composite FK ensures no conversation can exist outside a valid relationship.
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (child_id, tutor_id) REFERENCES pupil_tutors(child_id, tutor_id) ON DELETE CASCADE,
  UNIQUE (tutor_id, child_id)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('tutor', 'parent')),
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);

CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at);

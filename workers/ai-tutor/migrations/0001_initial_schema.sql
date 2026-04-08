-- 11+ App — Initial Database Schema
-- Created: 8 April 2026
-- All tables use ON DELETE CASCADE from children for GDPR right-to-erasure

PRAGMA foreign_keys = ON;

-- ── ACCOUNT TABLES ──

-- Parent account (maps to Clerk user)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  consent_given_at TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  last_login_at TEXT
);

-- One child per account
CREATE TABLE children (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(account_id)
);

-- ── APPEND-ONLY EVENT TABLES ──

-- Quiz completions
CREATE TABLE quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time_seconds INTEGER,
  quiz_mode TEXT,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Mock test results (separate — different data shape)
CREATE TABLE mock_test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  total_correct INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  time_limit INTEGER NOT NULL,
  section_results TEXT NOT NULL,
  question_times TEXT,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Individual question attempts
CREATE TABLE question_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  time_ms INTEGER,
  difficulty INTEGER,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Lesson completions
CREATE TABLE lesson_history (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, lesson_id)
);

-- Practice sessions (one row per day)
CREATE TABLE practice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  session_date TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_id, session_date)
);

-- Seen questions
CREATE TABLE seen_questions (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, question_id, topic_key)
);

-- Achievements unlocked
CREATE TABLE achievements (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, achievement_id)
);

-- Seen tips
CREATE TABLE seen_tips (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  tip_id TEXT NOT NULL,
  last_seen_date TEXT NOT NULL,
  PRIMARY KEY (child_id, tip_id)
);

-- ── MUTABLE STATE TABLES (versioned for optimistic concurrency) ──

-- Topic performance aggregates
CREATE TABLE topic_performance (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  data TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, topic_key, subject)
);

-- Spaced repetition queue
CREATE TABLE leitner_queue (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  last_reviewed TEXT,
  next_review TEXT,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  PRIMARY KEY (child_id, question_id, topic_key)
);

-- Streaks
CREATE TABLE streaks (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_quiz_date TEXT,
  streak_history TEXT NOT NULL DEFAULT '[]',
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Prep points
CREATE TABLE prep_points (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  total INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  today_pp INTEGER NOT NULL DEFAULT 0,
  today_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Child preferences
CREATE TABLE preferences (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  last_session_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Server-side migration tracking
CREATE TABLE migrations (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  migrated_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL,
  items_imported INTEGER NOT NULL DEFAULT 0
);

-- ── INDEXES ──

CREATE INDEX idx_quiz_results_child ON quiz_results(child_id, completed_at);
CREATE INDEX idx_mock_results_child ON mock_test_results(child_id, completed_at);
CREATE INDEX idx_question_results_child ON question_results(child_id, attempted_at);
CREATE INDEX idx_leitner_child_review ON leitner_queue(child_id, next_review);
CREATE INDEX idx_practice_child_date ON practice_sessions(child_id, session_date);

// Shared child-data schema + helpers for worker tests that exercise the
// /api/data/* routes. helpers.js owns the auth/tutor schema; this file owns
// the per-child data tables (quiz results, prep points, lesson history, etc.).

export const DATA_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS prep_points (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  total INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  today_pp INTEGER NOT NULL DEFAULT 0,
  today_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS streaks (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_quiz_date TEXT,
  streak_history TEXT NOT NULL DEFAULT '[]',
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS preferences (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  last_session_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS processed_operations (
  operation_uuid TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'maths',
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time_seconds INTEGER,
  quiz_mode TEXT,
  session_id TEXT,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS question_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  time_ms INTEGER,
  difficulty INTEGER,
  session_id TEXT,
  selected_answer TEXT,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mock_test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  total_correct INTEGER NOT NULL,
  percentage REAL NOT NULL DEFAULT 0,
  time_taken INTEGER NOT NULL DEFAULT 0,
  time_limit INTEGER NOT NULL DEFAULT 0,
  section_results TEXT NOT NULL DEFAULT '{}',
  question_times TEXT,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS practice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  session_date TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_id, session_date)
);

CREATE TABLE IF NOT EXISTS lesson_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS seen_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_id, question_id, topic_key)
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(child_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS seen_tips (
  child_id TEXT NOT NULL,
  tip_id TEXT NOT NULL,
  last_seen_date TEXT NOT NULL,
  PRIMARY KEY (child_id, tip_id)
);

CREATE TABLE IF NOT EXISTS leitner_queue (
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

CREATE TABLE IF NOT EXISTS topic_performance (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  data TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, topic_key, subject)
);

CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  migrated_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL DEFAULT 'localStorage',
  items_imported INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS social_preferences (
  child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
  social_enabled INTEGER NOT NULL DEFAULT 0,
  display_name_visible INTEGER NOT NULL DEFAULT 1,
  pp_visible INTEGER NOT NULL DEFAULT 1,
  avatar_visible INTEGER NOT NULL DEFAULT 1,
  tier_visible INTEGER NOT NULL DEFAULT 1,
  parent_approved_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export async function createDataSchema(db) {
  const stmts = DATA_SCHEMA_SQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
  await db.batch(stmts.map(sql => db.prepare(sql)));
}

export async function cleanDataDb(db) {
  // Clean data tables (auth tables cleaned by helpers.js cleanDb)
  try {
    await db.batch([
      db.prepare('DELETE FROM processed_operations'),
      db.prepare('DELETE FROM prep_points'),
      db.prepare('DELETE FROM streaks'),
      db.prepare('DELETE FROM preferences'),
      db.prepare('DELETE FROM quiz_results'),
      db.prepare('DELETE FROM question_results'),
      db.prepare('DELETE FROM mock_test_results'),
      db.prepare('DELETE FROM practice_sessions'),
      db.prepare('DELETE FROM lesson_history'),
      db.prepare('DELETE FROM seen_questions'),
      db.prepare('DELETE FROM achievements'),
      db.prepare('DELETE FROM seen_tips'),
      db.prepare('DELETE FROM leitner_queue'),
      db.prepare('DELETE FROM topic_performance'),
      db.prepare('DELETE FROM migrations'),
    ]);
  } catch { /* tables may not all exist in every test env */ }
}

export async function seedAccount(db, userId, email) {
  await db.prepare(
    `INSERT INTO accounts (id, email, name, consent_given_at, consent_version, email_opt_in)
     VALUES (?, ?, 'Test User', datetime('now'), '1.0', 1)`
  ).bind(userId, email).run();
  const childId = `child-${userId}`;
  await db.prepare(
    `INSERT INTO children (id, account_id, display_name) VALUES (?, ?, 'Test Child')`
  ).bind(childId, userId).run();
  return childId;
}

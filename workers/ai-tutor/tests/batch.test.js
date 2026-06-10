/**
 * Worker tests for /api/data/batch endpoint.
 * Specifically covers:
 * - 'prep-points-delta' op: basic add, no-row INSERT, todayDate same/different day,
 *   delta validation bounds, UUID dedup replay no-ops
 * - Legacy absolute 'prep-points' op still works
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import {
  makeAuthToken,
  makeRequest,
  createSchema,   // creates tutors, accounts, children, assignments, etc.
  cleanDb,
} from './helpers.js';

// ── Extra data tables needed by the batch endpoint ──
// helpers.js creates the auth/tutor schema. These are the child-data tables
// that the batch endpoint reads and writes.
const DATA_SCHEMA_SQL = `
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

async function createDataSchema(db) {
  const stmts = DATA_SCHEMA_SQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
  await db.batch(stmts.map(sql => db.prepare(sql)));
}

async function cleanDataDb(db) {
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

async function seedAccount(db, userId, email) {
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

beforeAll(async () => {
  await createSchema(env.DB);    // auth/tutor tables
  await createDataSchema(env.DB); // child data tables
});

afterEach(async () => {
  await cleanDataDb(env.DB);
  await cleanDb(env.DB);
});

// ── Helper to post a batch operation ──
async function postBatch(token, childId, operations) {
  const res = await worker.fetch(
    makeRequest('POST', '/api/data/batch', {
      auth: token,
      body: { child_id: childId, operations },
    }),
    env
  );
  return res;
}

function makeUUID() {
  return crypto.randomUUID();
}

// ─────────────────────────────────────────────
// prep-points-delta tests
// ─────────────────────────────────────────────

describe('prep-points-delta op', () => {
  it('basic add — inserts new row if none exists (no-row INSERT case)', async () => {
    const userId = 'user-pp-delta-insert';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 100, todayDelta: 100, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await env.DB.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row).not.toBeNull();
    expect(row.total).toBe(100);
    expect(row.today_pp).toBe(100);
    expect(row.today_date).toBe('2026-06-10');
  });

  it('adds to existing row total', async () => {
    const userId = 'user-pp-delta-add';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    // Seed an existing row
    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 500, 3, 50, '2026-06-10', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 200, todayDelta: 200, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await env.DB.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.total).toBe(700); // 500 + 200
    expect(row.today_pp).toBe(250); // 50 + 200 (same day)
  });

  it('todayDate same-day branch — accumulates today_pp', async () => {
    const userId = 'user-pp-same-day';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 1000, 4, 300, '2026-06-10', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 50, todayDelta: 50, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const row = await env.DB.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.today_pp).toBe(350); // 300 + 50
    expect(row.today_date).toBe('2026-06-10');
  });

  it('todayDate different-day branch — resets today_pp to todayDelta', async () => {
    const userId = 'user-pp-new-day';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 1000, 4, 300, '2026-06-09', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 75, todayDelta: 75, todayDate: '2026-06-10' }, // new day
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const row = await env.DB.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.today_pp).toBe(75); // reset to todayDelta (new day)
    expect(row.today_date).toBe('2026-06-10');
    expect(row.total).toBe(1075); // 1000 + 75
  });

  it('stale todayDate (older than stored) — total adds but today_pp/today_date do not regress', async () => {
    // A device that was offline yesterday flushing AFTER another device already
    // wrote today's date must not drag today_pp/today_date backwards.
    const userId = 'user-pp-stale-day';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 1000, 4, 300, '2026-06-10', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 75, todayDelta: 75, todayDate: '2026-06-09' }, // stale day
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const row = await env.DB.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.total).toBe(1075);          // the points still count
    expect(row.today_pp).toBe(300);        // unchanged — not reset by the stale op
    expect(row.today_date).toBe('2026-06-10'); // unchanged — never moves backwards
  });

  it('delta = 0 is rejected (must be >= 1)', async () => {
    const userId = 'user-pp-zero';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 0, todayDelta: 0, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/delta must be integer 1/);
  });

  it('delta > 2500 is rejected', async () => {
    const userId = 'user-pp-toolarge';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 2501, todayDelta: 2501, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/2500/);
  });

  it('delta = 2500 is accepted (boundary)', async () => {
    const userId = 'user-pp-boundary';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 2500, todayDelta: 2500, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');
  });

  it('non-integer delta is rejected', async () => {
    const userId = 'user-pp-float';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 100.5, todayDelta: 100, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('error');
  });

  it('UUID dedup — replaying the same UUID is a no-op (duplicate)', async () => {
    const userId = 'user-pp-dedup';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const uuid = makeUUID();
    const op = {
      uuid,
      type: 'prep-points-delta',
      payload: { delta: 100, todayDelta: 100, todayDate: '2026-06-10' },
      childId,
    };

    // First POST — applies
    const res1 = await postBatch(token, childId, [op]);
    expect(res1.status).toBe(200);
    const body1 = await res1.json();
    expect(body1.results[0].status).toBe('ok');

    const rowAfterFirst = await env.DB.prepare('SELECT total FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(rowAfterFirst.total).toBe(100);

    // Replay with same UUID — must be no-op
    const res2 = await postBatch(token, childId, [op]);
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.results[0].status).toBe('duplicate');

    // Total must still be 100 — no double-apply
    const rowAfterReplay = await env.DB.prepare('SELECT total FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(rowAfterReplay.total).toBe(100);
  });

  it('multiple delta ops in one batch accumulate correctly', async () => {
    const userId = 'user-pp-multi';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 100, todayDelta: 100, todayDate: '2026-06-10' },
        childId,
      },
      {
        uuid: makeUUID(),
        type: 'prep-points-delta',
        payload: { delta: 200, todayDelta: 200, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results.every(r => r.status === 'ok')).toBe(true);

    const row = await env.DB.prepare('SELECT total FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.total).toBe(300); // 100 + 200
  });
});

// ─────────────────────────────────────────────
// Legacy absolute 'prep-points' op still works
// ─────────────────────────────────────────────

describe('Legacy prep-points op (absolute) still works', () => {
  it('absolute prep-points op updates row with version CAS', async () => {
    const userId = 'user-pp-legacy';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    // Seed existing row at version 1
    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 100, 1, 50, '2026-06-09', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points',
        payload: { version: 1, total: 200, level: 2, todayPP: 100, todayDate: '2026-06-10' },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await env.DB.prepare('SELECT total, level, today_pp, today_date FROM prep_points WHERE child_id = ?').bind(childId).first();
    expect(row.total).toBe(200);
    expect(row.level).toBe(2);
  });

  it('legacy prep-points op returns conflict when version mismatches', async () => {
    const userId = 'user-pp-legacy-conflict';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    // Seed existing row at version 5
    await env.DB.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, 1000, 4, 50, '2026-06-09', 5)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'prep-points',
        payload: { version: 1, total: 200, level: 2, todayPP: 100, todayDate: '2026-06-10' }, // wrong version
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('conflict');
    expect(body.results[0].currentVersion).toBe(5);
  });
});

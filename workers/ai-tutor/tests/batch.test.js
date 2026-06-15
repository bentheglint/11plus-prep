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
import { createDataSchema, cleanDataDb, seedAccount } from './data-helpers.js';


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

// ─────────────────────────────────────────────
// preferences / streaks no-row upsert (JS-REACT-7 dead-letter fix)
// These FAIL on the pre-fix UPDATE-only CAS code (no-row → 'conflict' → null
// re-enqueue → dead-letter) and pass after the version-gated upsert.
// ─────────────────────────────────────────────

describe('preferences/streaks no-row upsert (JS-REACT-7)', () => {
  it('preferences op for a child with NO row creates the row and returns ok', async () => {
    const userId = 'user-prefs-norow';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      { uuid: makeUUID(), type: 'preferences', payload: { version: 1, lastSessionDate: '2026-06-15' }, childId },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok'); // was 'conflict' on the buggy code

    const row = await env.DB.prepare('SELECT * FROM preferences WHERE child_id = ?').bind(childId).first();
    expect(row).not.toBeNull();
    expect(row.last_session_date).toBe('2026-06-15');
    expect(row.version).toBe(1);
  });

  it('streaks op for a child with NO row creates the row and returns ok', async () => {
    const userId = 'user-streaks-norow';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'streaks',
        payload: { version: 1, currentStreak: 3, longestStreak: 5, lastQuizDate: '2026-06-15', streakHistory: ['2026-06-13', '2026-06-14', '2026-06-15'] },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await env.DB.prepare('SELECT * FROM streaks WHERE child_id = ?').bind(childId).first();
    expect(row).not.toBeNull();
    expect(row.current_streak).toBe(3);
    expect(row.longest_streak).toBe(5);
    expect(row.version).toBe(1);
  });

  it('no version disagreement: insert reports true version 1, follow-up write at v1 succeeds (not dead-letter)', async () => {
    // Guards the Codex-found blocker: an insert must report newVersion 1, NOT
    // clientVersion+1 (2), or the next client write conflicts forever.
    const userId = 'user-prefs-seq';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res1 = await postBatch(token, childId, [
      { uuid: makeUUID(), type: 'preferences', payload: { version: 1, lastSessionDate: '2026-06-15' }, childId },
    ]);
    const body1 = await res1.json();
    expect(body1.results[0].status).toBe('ok');
    expect(body1.results[0].newVersion).toBe(1);   // true row version, not 2
    expect(body1.versions.preferences).toBe(1);

    // Client now holds version 1; a subsequent write at version 1 must succeed.
    const res2 = await postBatch(token, childId, [
      { uuid: makeUUID(), type: 'preferences', payload: { version: 1, lastSessionDate: '2026-06-16' }, childId },
    ]);
    const body2 = await res2.json();
    expect(body2.results[0].status).toBe('ok');
    expect(body2.results[0].newVersion).toBe(2);

    const row = await env.DB.prepare('SELECT version, last_session_date FROM preferences WHERE child_id = ?').bind(childId).first();
    expect(row.version).toBe(2);
    expect(row.last_session_date).toBe('2026-06-16');
  });

  it('existing preferences row with mismatched version still returns conflict (optimistic lock preserved)', async () => {
    const userId = 'user-prefs-conflict';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO preferences (child_id, last_session_date, version) VALUES (?, '2026-06-10', 5)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      { uuid: makeUUID(), type: 'preferences', payload: { version: 1, lastSessionDate: '2026-06-15' }, childId },
    ]);
    const body = await res.json();
    expect(body.results[0].status).toBe('conflict');
    expect(body.results[0].currentVersion).toBe(5);

    // Row must be untouched by the rejected write.
    const row = await env.DB.prepare('SELECT version, last_session_date FROM preferences WHERE child_id = ?').bind(childId).first();
    expect(row.version).toBe(5);
    expect(row.last_session_date).toBe('2026-06-10');
  });

  it('existing streaks row with matching version updates and advances version', async () => {
    const userId = 'user-streaks-update';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO streaks (child_id, current_streak, longest_streak, last_quiz_date, streak_history, version)
       VALUES (?, 2, 2, '2026-06-14', '["2026-06-13","2026-06-14"]', 1)`
    ).bind(childId).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'streaks',
        payload: { version: 1, currentStreak: 3, longestStreak: 3, lastQuizDate: '2026-06-15', streakHistory: ['2026-06-13', '2026-06-14', '2026-06-15'] },
        childId,
      },
    ]);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');
    expect(body.results[0].newVersion).toBe(2);

    const row = await env.DB.prepare('SELECT current_streak, version FROM streaks WHERE child_id = ?').bind(childId).first();
    expect(row.current_streak).toBe(3);
    expect(row.version).toBe(2);
  });
});

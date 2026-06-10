/**
 * Worker tests for the 'topic-performance-delta' batch op.
 * Covers: INSERT (no-row), accumulate, subject isolation, validation,
 * UUID dedup, NULL data guard, malformed data guard, topicKey normalisation,
 * and legacy extra field preservation.
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import {
  makeAuthToken,
  makeRequest,
  createSchema,
  cleanDb,
} from './helpers.js';
import { createDataSchema, cleanDataDb, seedAccount } from './data-helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
  await createDataSchema(env.DB);
});

afterEach(async () => {
  await cleanDataDb(env.DB);
  await cleanDb(env.DB);
});

// ── Helper: post a batch of ops ──
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

// ── Helper: fetch a topic_performance row ──
async function getRow(childId, topicKey, subject) {
  return env.DB.prepare(
    'SELECT * FROM topic_performance WHERE child_id = ? AND topic_key = ? AND subject = ?'
  ).bind(childId, topicKey, subject).first();
}

// ─────────────────────────────────────────────
// topic-performance-delta tests
// ─────────────────────────────────────────────

describe('topic-performance-delta op', () => {

  // 1. INSERT case: no row → op creates row
  it('INSERT — no row creates row with correct/total and version 1', async () => {
    const userId = 'user-tpd-insert';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 3, totalDelta: 5 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await getRow(childId, 'percentages', 'maths');
    expect(row).not.toBeNull();
    expect(JSON.parse(row.data)).toEqual({ correct: 3, total: 5 });
    expect(row.version).toBe(1);
  });

  // 2. Accumulate: existing row {correct:5,total:10} v3 → delta {2,5} → {correct:7,total:15}, version 4
  it('accumulate — adds deltas to existing row and increments version', async () => {
    const userId = 'user-tpd-accum';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(childId, 'percentages', 'maths', JSON.stringify({ correct: 5, total: 10 }), 3).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 2, totalDelta: 5 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await getRow(childId, 'percentages', 'maths');
    expect(JSON.parse(row.data)).toEqual({ correct: 7, total: 15 });
    expect(row.version).toBe(4);
  });

  // 3. Subject isolation: same topic_key under 'maths' and 'english' → two rows
  it('subject isolation — same topicKey under different subjects writes two separate rows', async () => {
    const userId = 'user-tpd-isolation';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'vocabulary', subject: 'maths', correctDelta: 1, totalDelta: 2 },
        childId,
      },
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'vocabulary', subject: 'english', correctDelta: 4, totalDelta: 8 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);

    const mathsRow = await getRow(childId, 'vocabulary', 'maths');
    const englishRow = await getRow(childId, 'vocabulary', 'english');

    expect(JSON.parse(mathsRow.data)).toEqual({ correct: 1, total: 2 });
    expect(JSON.parse(englishRow.data)).toEqual({ correct: 4, total: 8 });
  });

  // 4. Validation errors
  it('validation — totalDelta 0 is rejected', async () => {
    const userId = 'user-tpd-val-zero';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 0, totalDelta: 0 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/totalDelta/);
  });

  it('validation — totalDelta 101 is rejected', async () => {
    const userId = 'user-tpd-val-101';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 0, totalDelta: 101 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/totalDelta/);
  });

  it('validation — correctDelta > totalDelta is rejected', async () => {
    const userId = 'user-tpd-val-correct';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 6, totalDelta: 5 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/correctDelta/);
  });

  it('validation — correctDelta -1 is rejected', async () => {
    const userId = 'user-tpd-val-neg';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: -1, totalDelta: 5 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/correctDelta/);
  });

  it('validation — non-integer totalDelta is rejected', async () => {
    const userId = 'user-tpd-val-float';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 2, totalDelta: 4.5 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/totalDelta/);
  });

  it('validation — missing subject is rejected', async () => {
    const userId = 'user-tpd-val-subj';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'percentages', correctDelta: 2, totalDelta: 5 },
        childId,
      },
    ]);

    const body = await res.json();
    expect(body.results[0].status).toBe('error');
    expect(body.results[0].error).toMatch(/subject/);
  });

  // 5. UUID dedup: replay same uuid → 'duplicate', counters unchanged
  it('UUID dedup — replaying the same UUID is a no-op', async () => {
    const userId = 'user-tpd-dedup';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const uuid = makeUUID();
    const op = {
      uuid,
      type: 'topic-performance-delta',
      payload: { topicKey: 'percentages', subject: 'maths', correctDelta: 3, totalDelta: 5 },
      childId,
    };

    // First POST — applies
    const res1 = await postBatch(token, childId, [op]);
    expect((await res1.json()).results[0].status).toBe('ok');

    const rowAfterFirst = await getRow(childId, 'percentages', 'maths');
    expect(JSON.parse(rowAfterFirst.data)).toEqual({ correct: 3, total: 5 });

    // Replay with same UUID — must be no-op
    const res2 = await postBatch(token, childId, [op]);
    expect((await res2.json()).results[0].status).toBe('duplicate');

    const rowAfterReplay = await getRow(childId, 'percentages', 'maths');
    expect(JSON.parse(rowAfterReplay.data)).toEqual({ correct: 3, total: 5 }); // unchanged
  });

  // 6. Corrupted (empty string) data row: json_valid CASE fallback — op succeeds.
  // The schema enforces NOT NULL on topic_performance.data, so a true SQL NULL
  // cannot be produced via DML. An empty string is the closest reachable
  // analogue: json_valid('') = 0, which exercises the identical ELSE branch.
  it('corrupted data guard — existing row with data="" succeeds via json_valid fallback', async () => {
    const userId = 'user-tpd-null';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    // Insert with empty-string data — json_valid('') = 0, same fallback branch as NULL.
    await env.DB.prepare(
      `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
       VALUES (?, ?, ?, '', 1)`
    ).bind(childId, 'algebra', 'maths').run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'algebra', subject: 'maths', correctDelta: 2, totalDelta: 4 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await getRow(childId, 'algebra', 'maths');
    expect(JSON.parse(row.data)).toEqual({ correct: 2, total: 4 });
  });

  // 7. Malformed data row: data='not-json' → json_valid returns 0, falls back to {correct:0,total:0}
  it('malformed data guard — existing row with data=\'not-json\' succeeds via json_valid fallback', async () => {
    const userId = 'user-tpd-malformed';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
       VALUES (?, ?, ?, 'not-json', 1)`
    ).bind(childId, 'fractions', 'maths').run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'fractions', subject: 'maths', correctDelta: 1, totalDelta: 3 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await getRow(childId, 'fractions', 'maths');
    expect(JSON.parse(row.data)).toEqual({ correct: 1, total: 3 });
  });

  // 8. topicKey normalisation: 'Ratio & Proportion' → stored as 'ratio'
  it('topicKey normalisation — display name is stored as slug', async () => {
    const userId = 'user-tpd-norm';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'Ratio & Proportion', subject: 'maths', correctDelta: 2, totalDelta: 5 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    // Must be stored under the normalised slug, not the display name
    const slugRow = await getRow(childId, 'ratio', 'maths');
    expect(slugRow).not.toBeNull();

    const displayRow = await getRow(childId, 'Ratio & Proportion', 'maths');
    expect(displayRow).toBeNull();
  });

  // 9. Legacy extra fields preserved after delta
  it('legacy extra fields preserved — delta does not strip unknown keys from existing data', async () => {
    const userId = 'user-tpd-legacy';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    await env.DB.prepare(
      `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
       VALUES (?, ?, ?, ?, 1)`
    ).bind(childId, 'algebra', 'maths', JSON.stringify({ correct: 1, total: 2, legacyField: 'x' })).run();

    const res = await postBatch(token, childId, [
      {
        uuid: makeUUID(),
        type: 'topic-performance-delta',
        payload: { topicKey: 'algebra', subject: 'maths', correctDelta: 1, totalDelta: 1 },
        childId,
      },
    ]);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results[0].status).toBe('ok');

    const row = await getRow(childId, 'algebra', 'maths');
    const data = JSON.parse(row.data);
    expect(data.correct).toBe(2);
    expect(data.total).toBe(3);
    expect(data.legacyField).toBe('x');
  });
});

/**
 * Worker tests for GET /api/data/all (bulk load).
 * Covers the response contract the client transform depends on —
 * specifically that lesson_history rows include `id`, which
 * transformServerData uses as the same-second sort tiebreaker
 * (useD1Data.js sorts by completed_at then id).
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
  await createSchema(env.DB);     // auth/tutor tables
  await createDataSchema(env.DB); // child data tables
});

afterEach(async () => {
  await cleanDataDb(env.DB);
  await cleanDb(env.DB);
});

async function getAllData(token) {
  return worker.fetch(makeRequest('GET', '/api/data/all', { auth: token }), env);
}

describe('GET /api/data/all', () => {
  it('returns lesson_history rows with id for same-second tiebreak ordering', async () => {
    const userId = 'user-bulk-lesson-id';
    const email = `${userId}@test.com`;
    const childId = await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    // Two completions in the same second — only id can order them.
    const sameSecond = '2026-06-10T10:00:00Z';
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO lesson_history (child_id, lesson_id, completed_at) VALUES (?, ?, ?)`
      ).bind(childId, 'percentages::concept-a::worked-example', sameSecond),
      env.DB.prepare(
        `INSERT INTO lesson_history (child_id, lesson_id, completed_at) VALUES (?, ?, ?)`
      ).bind(childId, 'percentages::concept-b::practice', sameSecond),
    ]);

    const res = await getAllData(token);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.lessonHistory).toHaveLength(2);
    for (const row of body.lessonHistory) {
      expect(typeof row.id).toBe('number');
      expect(typeof row.lesson_id).toBe('string');
      expect(row.completed_at).toBe(sameSecond);
    }
    // Insert order must be recoverable from id (AUTOINCREMENT is monotonic)
    const byId = [...body.lessonHistory].sort((a, b) => a.id - b.id);
    expect(byId[0].lesson_id).toBe('percentages::concept-a::worked-example');
    expect(byId[1].lesson_id).toBe('percentages::concept-b::practice');
  });

  it('returns empty collections for a fresh child', async () => {
    const userId = 'user-bulk-empty';
    const email = `${userId}@test.com`;
    await seedAccount(env.DB, userId, email);
    const token = await makeAuthToken({ userId, email });

    const res = await getAllData(token);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lessonHistory).toEqual([]);
    expect(body.quizResults).toEqual([]);
    expect(body.prepPoints).toBeNull();
  });
});

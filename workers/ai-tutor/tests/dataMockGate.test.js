/**
 * Legacy (non-batch) POST /api/data/mock-result — Phase 0 Step 4.
 *
 * This route (routes/data.js) predates the batch endpoint and is still
 * reachable, so it needs the same paid-tier gate as the batch mock-result
 * op (see the "mock-result op gate" describe block in tests/batch.test.js).
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import { makeAuthToken, makeRequest, createSchema, cleanDb, seed } from './helpers.js';
import { createDataSchema, cleanDataDb } from './data-helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
  await createDataSchema(env.DB);
});

afterEach(async () => {
  await cleanDataDb(env.DB);
  await cleanDb(env.DB);
});

const MOCK_PAYLOAD = { subject: 'maths', totalQuestions: 50, totalCorrect: 40, percentage: 80 };

describe('POST /api/data/mock-result gate', () => {
  it('free tier → 403 upgrade_required, nothing recorded', async () => {
    const userId = 'user-legacy-mock-free';
    const email = `${userId}@test.com`;
    const childId = 'child-legacy-mock-free';
    await seed.freeAccount(env.DB, userId, email);
    await seed.child(env.DB, childId, userId);
    const token = await makeAuthToken({ userId, email });

    const res = await worker.fetch(
      makeRequest('POST', '/api/data/mock-result', { auth: token, body: MOCK_PAYLOAD }),
      env
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe('upgrade_required');

    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM mock_test_results WHERE child_id = ?').bind(childId).first();
    expect(count.n).toBe(0);
  });

  it('comped tier → records the result', async () => {
    const userId = 'user-legacy-mock-comped';
    const email = `${userId}@test.com`;
    const childId = 'child-legacy-mock-comped';
    await seed.compedAccount(env.DB, userId, email);
    await seed.child(env.DB, childId, userId);
    const token = await makeAuthToken({ userId, email });

    const res = await worker.fetch(
      makeRequest('POST', '/api/data/mock-result', { auth: token, body: MOCK_PAYLOAD }),
      env
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);

    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM mock_test_results WHERE child_id = ?').bind(childId).first();
    expect(count.n).toBe(1);
  });
});

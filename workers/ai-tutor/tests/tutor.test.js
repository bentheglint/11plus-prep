import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import {
  makeAuthToken,
  createSchema,
  cleanDb,
  seed,
  makeRequest,
} from './helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

describe('Tutor open signup', () => {
  it('POST /api/tutor without auth → 401', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor', { body: { displayName: 'Test' } }),
      env
    );
    expect(res.status).toBe(401);
  });

  it('POST /api/tutor with valid auth → 201 (no allowlist required)', async () => {
    const userId = 'user-new-tutor';
    await seed.account(env.DB, userId, 'new-tutor@test.com');
    const token = await makeAuthToken({ userId, email: 'new-tutor@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor', {
        auth: token,
        body: { displayName: 'Alice Tutor', bio: 'Experienced 11+ tutor' },
      }),
      env
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.tutor.display_name).toBe('Alice Tutor');
  });

  it('POST /api/tutor twice → 409 (duplicate profile)', async () => {
    const userId = 'user-dupe-tutor';
    await seed.account(env.DB, userId, 'dupe-tutor@test.com');
    const token = await makeAuthToken({ userId, email: 'dupe-tutor@test.com' });

    await worker.fetch(
      makeRequest('POST', '/api/tutor', { auth: token, body: { displayName: 'Alice' } }),
      env
    );
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor', { auth: token, body: { displayName: 'Alice' } }),
      env
    );
    expect(res.status).toBe(409);
  });
});

describe('requireTutorProfile gate', () => {
  it('GET /api/tutor with no tutors row → 403', async () => {
    const userId = 'user-no-tutor-row';
    await seed.account(env.DB, userId, 'no-tutor@test.com');
    const token = await makeAuthToken({ userId, email: 'no-tutor@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/tutor', { auth: token }), env);
    expect(res.status).toBe(403);
  });

  it('GET /api/tutor with tutors row → 200', async () => {
    const userId = 'user-has-tutor-row';
    await seed.account(env.DB, userId, 'has-tutor@test.com');
    await seed.tutor(env.DB, userId, 'has-tutor@test.com');
    const token = await makeAuthToken({ userId, email: 'has-tutor@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/tutor', { auth: token }), env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.tutor.id).toBe(userId);
  });
});

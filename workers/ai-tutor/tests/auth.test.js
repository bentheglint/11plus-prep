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

describe('Auth gates', () => {
  it('GET /api/account without auth → 401', async () => {
    const res = await worker.fetch(makeRequest('GET', '/api/account'), env);
    expect(res.status).toBe(401);
  });

  it('GET /api/account with malformed token → 401', async () => {
    const res = await worker.fetch(
      makeRequest('GET', '/api/account', { auth: 'not.a.real.token' }),
      env
    );
    expect(res.status).toBe(401);
  });

  it('GET /api/account with valid auth but no account row → 404', async () => {
    const token = await makeAuthToken({ userId: 'user-no-account' });
    const res = await worker.fetch(
      makeRequest('GET', '/api/account', { auth: token }),
      env
    );
    expect(res.status).toBe(404);
  });

  it('GET /api/account with valid auth and seeded account → 200', async () => {
    const userId = 'user-auth-ok';
    await seed.account(env.DB, userId, 'auth-ok@test.com');
    const token = await makeAuthToken({ userId, email: 'auth-ok@test.com' });
    const res = await worker.fetch(
      makeRequest('GET', '/api/account', { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.account.id).toBe(userId);
  });
});

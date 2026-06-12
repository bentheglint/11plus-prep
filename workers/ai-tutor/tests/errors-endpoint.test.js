// The /errors dashboard endpoint served client error reports (including the
// full page URL at error time) with no auth. Once invite links carry bearer
// tokens, a JS error on /invite/<token> would have published a live token.
// These tests pin the fix: admin-only reads, secrets redacted at ingest.

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker, { redactSecretUrls } from '../index.js';
import { makeAuthToken, createSchema, cleanDb, seed, makeRequest } from './helpers.js';

const ADMIN_ID = 'admin-user-errors-test';
const adminEnv = () => ({ ...env, ADMIN_USER_IDS: ADMIN_ID });

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
  await env.TESTING_FLAGS.put('recent-errors', '[]');
});

describe('GET /errors auth', () => {
  it('rejects unauthenticated reads', async () => {
    const res = await worker.fetch(makeRequest('GET', '/errors'), adminEnv());
    expect(res.status).toBe(401);
  });

  it('rejects authenticated non-admin reads', async () => {
    const userId = 'plain-user-errors-test';
    await seed.account(env.DB, userId, 'plain-errors@test.com');
    const token = await makeAuthToken({ userId, email: 'plain-errors@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/errors', { auth: token }), adminEnv());
    expect(res.status).toBe(403);
  });

  it('allows admin reads', async () => {
    await seed.account(env.DB, ADMIN_ID, 'admin-errors@test.com');
    const token = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-errors@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/errors', { auth: token }), adminEnv());
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });
});

describe('error-report ingest redaction', () => {
  it('stores reports with invite/join secrets redacted', async () => {
    const report = makeRequest('POST', '/api/error-report', {
      body: {
        message: 'Boom at https://prepstep.co.uk/invite/abc123token',
        stack: 'Error: boom\n  at https://prepstep.co.uk/join/QQQQ-1234?x=1',
        url: 'https://prepstep.co.uk/invite/abc123token?invite=EVIE-FRIENDS',
        user: 'test', source: 'window.onerror', timestamp: '2026-06-12T15:00:00Z',
      },
    });
    expect((await worker.fetch(report, adminEnv())).status).toBe(200);

    await seed.account(env.DB, ADMIN_ID, 'admin-errors@test.com');
    const token = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-errors@test.com' });
    const res = await worker.fetch(makeRequest('GET', '/errors', { auth: token }), adminEnv());
    const stored = JSON.stringify(await res.json());

    expect(stored).not.toContain('abc123token');
    expect(stored).not.toContain('QQQQ-1234');
    expect(stored).not.toContain('EVIE-FRIENDS');
    expect(stored).toContain('/invite/[redacted]');
    expect(stored).toContain('/join/[redacted]');
    expect(stored).toContain('invite=[redacted]');
  });
});

describe('redactSecretUrls', () => {
  it('redacts invite and join path segments and invite query params', () => {
    expect(redactSecretUrls('https://x.com/invite/tok-123?a=1')).toBe('https://x.com/invite/[redacted]?a=1');
    expect(redactSecretUrls('https://x.com/join/ABCD-2345')).toBe('https://x.com/join/[redacted]');
    expect(redactSecretUrls('https://x.com/?invite=CODE&b=2')).toBe('https://x.com/?invite=[redacted]&b=2');
  });

  it('leaves ordinary values alone', () => {
    expect(redactSecretUrls('https://x.com/progress?view=errors')).toBe('https://x.com/progress?view=errors');
    expect(redactSecretUrls(undefined)).toBe(undefined);
    expect(redactSecretUrls(42)).toBe(42);
  });
});

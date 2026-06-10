/**
 * Tests for the authenticated AI tutor endpoint (POST /<non-api-path>).
 *
 * Coverage:
 *   (a) No token → 401
 *   (b) Input caps: 21 messages → 400; oversize system → 400
 *   (c) Quota: TUTOR_DAILY_LIMIT=2, third request → 429
 *
 * Gap note: Tests that require a real Anthropic response (200 success path) are
 * not covered here. @cloudflare/vitest-pool-workers runs inside the Workers
 * isolate; vi.fn() cannot intercept the runtime's native fetch(), and adding
 * an outbound service handler would require a second worker wired via
 * wrangler.test.toml [services]. The 401, 400, and 429 paths all short-circuit
 * before the Anthropic fetch, so they are fully testable without stubbing.
 */

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
  // Clear quota KV between tests so quota counts don't bleed across.
  // Miniflare's in-memory KV supports list() — we wipe by known key pattern.
  if (env.TUTOR_QUOTA) {
    const listed = await env.TUTOR_QUOTA.list();
    await Promise.all(listed.keys.map(k => env.TUTOR_QUOTA.delete(k.name)));
  }
});

// ── (a) Auth gate ──────────────────────────────────────────────────────────

describe('AI tutor auth gate', () => {
  it('POST / without Authorization header → 401', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/', {
        body: {
          system: 'You are a tutor.',
          messages: [{ role: 'user', content: 'Hello' }],
        },
      }),
      env
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it('POST / with malformed token → 401', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/', {
        auth: 'not.a.real.token',
        body: {
          system: 'You are a tutor.',
          messages: [{ role: 'user', content: 'Hello' }],
        },
      }),
      env
    );
    expect(res.status).toBe(401);
  });
});

// ── (b) Input caps ─────────────────────────────────────────────────────────

describe('AI tutor input caps', () => {
  it('21 messages → 400', async () => {
    const userId = 'tutor-cap-messages';
    await seed.account(env.DB, userId, `${userId}@test.com`);
    const token = await makeAuthToken({ userId, email: `${userId}@test.com` });

    const messages = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));

    const res = await worker.fetch(
      makeRequest('POST', '/', {
        auth: token,
        body: { system: 'You are a tutor.', messages },
      }),
      env
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/messages.*≤.*20/i);
  });

  it('system string > 8000 chars → 400', async () => {
    const userId = 'tutor-cap-system';
    await seed.account(env.DB, userId, `${userId}@test.com`);
    const token = await makeAuthToken({ userId, email: `${userId}@test.com` });

    const longSystem = 'x'.repeat(8001);

    const res = await worker.fetch(
      makeRequest('POST', '/', {
        auth: token,
        body: {
          system: longSystem,
          messages: [{ role: 'user', content: 'Hi' }],
        },
      }),
      env
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/system.*≤.*8000/i);
  });

  it('20 messages exactly → passes input caps (may fail at Anthropic fetch)', async () => {
    // This test verifies the boundary: exactly 20 messages must not trigger
    // the 400 cap. The request will likely fail at the Anthropic upstream
    // (502 or connection error in test env) — that is acceptable; we only
    // assert it is NOT a 400.
    const userId = 'tutor-cap-boundary';
    await seed.account(env.DB, userId, `${userId}@test.com`);
    const token = await makeAuthToken({ userId, email: `${userId}@test.com` });

    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));

    const res = await worker.fetch(
      makeRequest('POST', '/', {
        auth: token,
        body: { system: 'You are a tutor.', messages },
      }),
      env
    );
    expect(res.status).not.toBe(400);
  });
});

// ── (c) Per-account daily quota ────────────────────────────────────────────

describe('AI tutor daily quota', () => {
  it('third request with TUTOR_DAILY_LIMIT=2 → 429', async () => {
    // vitest.config.mjs injects env bindings via miniflare.bindings.
    // TUTOR_DAILY_LIMIT is a plain string var; we override it on the env object
    // directly for this test since miniflare bindings are shallow-merged.
    const quotaEnv = { ...env, TUTOR_DAILY_LIMIT: '2' };

    const userId = 'tutor-quota-user';
    await seed.account(env.DB, userId, `${userId}@test.com`);
    const token = await makeAuthToken({ userId, email: `${userId}@test.com` });

    const body = {
      system: 'You are a tutor.',
      messages: [{ role: 'user', content: 'Hello' }],
    };

    // First two requests: quota gate passes (requests may fail upstream — 502 OK)
    const res1 = await worker.fetch(
      makeRequest('POST', '/', { auth: token, body }),
      quotaEnv
    );
    expect(res1.status).not.toBe(429);

    const res2 = await worker.fetch(
      makeRequest('POST', '/', { auth: token, body }),
      quotaEnv
    );
    expect(res2.status).not.toBe(429);

    // Third request: must be 429
    const res3 = await worker.fetch(
      makeRequest('POST', '/', { auth: token, body }),
      quotaEnv
    );
    expect(res3.status).toBe(429);
    const res3Body = await res3.json();
    expect(res3Body.error).toMatch(/daily tutor limit/i);
    expect(res3Body.friendly).toBe(true);
  });
});

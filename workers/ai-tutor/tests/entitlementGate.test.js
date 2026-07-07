/**
 * Server-side entitlement ENFORCEMENT — Phase 0 Step 4.
 *
 * Covers:
 *   - lib/entitlementGate.js: loadEntitlement() DB wrapper around the pure
 *     resolveEntitlements() (see tests/entitlements.test.js for the ladder
 *     itself) — comped, free, and missing-account rows.
 *   - POST /api/entitlements/claim-daily-set (routes/entitlements.js):
 *     free-tier cap of 1/day, session resume, paid/comped bypass (no DB
 *     write), and ownership (no first-child fallback).
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import { loadEntitlement } from '../lib/entitlementGate.js';
import { _resetEnforcementCache } from '../lib/killSwitch.js';
import {
  makeAuthToken,
  makeRequest,
  createSchema,
  cleanDb,
  seed,
} from './helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
  _resetEnforcementCache();
});

// ── loadEntitlement ──────────────────────────────────────────────────────

describe('loadEntitlement', () => {
  it('returns null for a missing account', async () => {
    const result = await loadEntitlement(env.DB, 'no-such-user');
    expect(result).toBeNull();
  });

  it('comped account → tier comped, aiTutor true, dailySetCap null', async () => {
    await seed.compedAccount(env.DB, 'user-comped');
    const result = await loadEntitlement(env.DB, 'user-comped');
    expect(result.tier).toBe('comped');
    expect(result.entitlements.aiTutor).toBe(true);
    expect(result.dailySetCap).toBeNull();
  });

  it('post-trial free account → tier free, aiTutor false, dailySetCap 1', async () => {
    await seed.freeAccount(env.DB, 'user-free');
    const result = await loadEntitlement(env.DB, 'user-free');
    expect(result.tier).toBe('free');
    expect(result.entitlements.aiTutor).toBe(false);
    expect(result.dailySetCap).toBe(1);
  });
});

// ── loadEntitlement × kill-switch integration ──────────────────────────
//
// Confirms the loader reads app_settings on the SAME db handle and threads
// the flag through — this is what makes every one of loadEntitlement's ~9
// route call sites revert automatically with no per-route change.
describe('loadEntitlement — freemium kill-switch integration', () => {
  it("app_settings 'free_tier_enforcement' = off → a would-be-free account comes back fully entitled", async () => {
    await seed.freeAccount(env.DB, 'user-free-killswitch');
    await env.DB.prepare(
      `INSERT INTO app_settings (key, value) VALUES ('free_tier_enforcement', 'off')`
    ).run();

    const result = await loadEntitlement(env.DB, 'user-free-killswitch');
    expect(result.tier).toBe('unrestricted');
    expect(result.fullAccess).toBe(true);
    expect(result.dailySetCap).toBeNull();
    expect(result.entitlements.aiTutor).toBe(true);
    expect(result.entitlements.deepProgress).toBe(true);
    expect(result.enforcementActive).toBe(false);
  });

  it('no app_settings row at all → still enforces (free account stays free)', async () => {
    await seed.freeAccount(env.DB, 'user-free-noflag');
    const result = await loadEntitlement(env.DB, 'user-free-noflag');
    expect(result.tier).toBe('free');
    expect(result.enforcementActive).toBe(true);
  });
});

// ── POST /api/entitlements/claim-daily-set ───────────────────────────────

describe('POST /api/entitlements/claim-daily-set', () => {
  async function claim(token, body) {
    const res = await worker.fetch(
      makeRequest('POST', '/api/entitlements/claim-daily-set', { auth: token, body }),
      env
    );
    return res;
  }

  it('free account: first claim allowed, second claim (different session) denied, resume (same session) allowed', async () => {
    const userId = 'user-claim-free';
    await seed.freeAccount(env.DB, userId);
    await seed.child(env.DB, 'child-claim-free', userId);
    const token = await makeAuthToken({ userId });

    const res1 = await claim(token, { childId: 'child-claim-free', sessionId: 's1' });
    expect(res1.status).toBe(200);
    const body1 = await res1.json();
    expect(body1.allowed).toBe(true);
    expect(body1.tier).toBe('free');

    const res2 = await claim(token, { childId: 'child-claim-free', sessionId: 's2' });
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.allowed).toBe(false);
    expect(body2.code).toBe('daily_cap_reached');

    const res3 = await claim(token, { childId: 'child-claim-free', sessionId: 's1' });
    expect(res3.status).toBe(200);
    const body3 = await res3.json();
    expect(body3.allowed).toBe(true);
    expect(body3.ownedByThisSession).toBe(true);
  });

  it('paid/comped account: allowed true, unlimited true, no daily_claims row written', async () => {
    const userId = 'user-claim-comped';
    await seed.compedAccount(env.DB, userId);
    await seed.child(env.DB, 'child-claim-comped', userId);
    const token = await makeAuthToken({ userId });

    const res = await claim(token, { childId: 'child-claim-comped', sessionId: 's1' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.allowed).toBe(true);
    expect(body.unlimited).toBe(true);

    const rows = await env.DB.prepare('SELECT * FROM daily_claims WHERE child_id = ?')
      .bind('child-claim-comped').all();
    expect(rows.results).toHaveLength(0);
  });

  it('childId not owned by the account → 404, no first-child fallback', async () => {
    const userId = 'user-claim-notowner';
    const otherUserId = 'user-claim-owner';
    await seed.freeAccount(env.DB, userId);
    await seed.freeAccount(env.DB, otherUserId, 'other@test.com');
    await seed.child(env.DB, 'child-owned-by-other', otherUserId);
    const token = await makeAuthToken({ userId });

    const res = await claim(token, { childId: 'child-owned-by-other', sessionId: 's1' });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/Child not found/i);
  });

  it('missing account → 404', async () => {
    const token = await makeAuthToken({ userId: 'user-claim-noaccount' });
    const res = await claim(token, { childId: 'whatever', sessionId: 's1' });
    expect(res.status).toBe(404);
  });
});

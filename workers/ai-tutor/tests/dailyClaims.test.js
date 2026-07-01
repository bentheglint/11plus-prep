/**
 * Daily claim primitive — lib/dailyClaims.js (Phase 0, Step 3).
 *
 * claimDailySet() is the atomic INSERT-OR-IGNORE claim helper that
 * enforces the free tier's daily-set cap of 1. It is only ever called by
 * a route once lib/entitlements.js has already resolved dailySetCap === 1
 * for the account — this suite tests the claim primitive in isolation,
 * not the entitlement resolution ladder (see tests/entitlements.test.js).
 *
 * londonDay() is tested separately: it must be DST-correct across the
 * GMT/BST boundary using the real IANA time zone database, not manual
 * offset arithmetic.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { env } from 'cloudflare:test';
import { createSchema, cleanDb, seed } from './helpers.js';
import { londonDay, claimDailySet } from '../lib/dailyClaims.js';

beforeAll(async () => {
  await createSchema(env.DB);
});

beforeEach(async () => {
  await cleanDb(env.DB);
});

describe('londonDay', () => {
  it('winter/GMT: London == UTC', () => {
    expect(londonDay(new Date('2026-01-15T23:30:00Z'))).toBe('2026-01-15');
  });

  it('summer/BST rolls the day forward just before UTC midnight', () => {
    // 23:30 UTC in June is 00:30 BST (London is UTC+1) — next calendar day.
    expect(londonDay(new Date('2026-06-15T23:30:00Z'))).toBe('2026-06-16');
  });

  it('summer/BST just after London midnight stays on the same day', () => {
    // 00:30 UTC in June is 01:30 BST — still the 15th in London.
    expect(londonDay(new Date('2026-06-15T00:30:00Z'))).toBe('2026-06-15');
  });

  it('a plain daytime UTC value maps to the same calendar day', () => {
    expect(londonDay(new Date('2026-06-15T12:00:00Z'))).toBe('2026-06-15');
  });

  it('default arg returns a 10-char YYYY-MM-DD string', () => {
    expect(londonDay()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('claimDailySet', () => {
  beforeEach(async () => {
    await seed.account(env.DB, 'acct-1');
    await seed.child(env.DB, 'child-1', 'acct-1');
  });

  async function countRows(childId) {
    const { results } = await env.DB.prepare(
      'SELECT * FROM daily_claims WHERE child_id = ?'
    ).bind(childId).all();
    return results;
  }

  it('first claim wins the day', async () => {
    const result = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    expect(result).toEqual({ allowed: true, alreadyClaimed: false, ownedByThisSession: true });

    const rows = await countRows('child-1');
    expect(rows).toHaveLength(1);
  });

  it('a different session on the same day is denied', async () => {
    await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    const result = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's2' });
    expect(result).toEqual({ allowed: false, alreadyClaimed: true, ownedByThisSession: false });

    const rows = await countRows('child-1');
    expect(rows).toHaveLength(1);
  });

  it('resuming the SAME session on the same day is idempotent', async () => {
    await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    const result = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    expect(result).toEqual({ allowed: true, alreadyClaimed: true, ownedByThisSession: true });

    const rows = await countRows('child-1');
    expect(rows).toHaveLength(1);
  });

  it('a different local day for the same child/session gets a new claim', async () => {
    await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    const result = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-02', sessionId: 's1' });
    expect(result.allowed).toBe(true);

    const rows = await countRows('child-1');
    expect(rows).toHaveLength(2);
  });

  it('a different child claiming the same day is independent', async () => {
    await seed.child(env.DB, 'child-2', 'acct-1');

    await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    const result = await claimDailySet(env.DB, { childId: 'child-2', localDay: '2026-07-01', sessionId: 's1' });
    expect(result).toEqual({ allowed: true, alreadyClaimed: false, ownedByThisSession: true });
  });

  it('a different entitlement_type on the same child/day is independent', async () => {
    await claimDailySet(env.DB, { childId: 'child-1', entitlementType: 'daily_set', localDay: '2026-07-01', sessionId: 's1' });
    const result = await claimDailySet(env.DB, { childId: 'child-1', entitlementType: 'free_mock', localDay: '2026-07-01', sessionId: 's1' });
    expect(result).toEqual({ allowed: true, alreadyClaimed: false, ownedByThisSession: true });
  });

  it('null sessionId can win the first claim, but never matches on a second attempt', async () => {
    const first = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: null });
    expect(first).toEqual({ allowed: true, alreadyClaimed: false, ownedByThisSession: true });

    const second = await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: null });
    expect(second).toEqual({ allowed: false, alreadyClaimed: true, ownedByThisSession: false });
  });

  it('missing childId throws', async () => {
    await expect(claimDailySet(env.DB, { localDay: '2026-07-01' })).rejects.toThrow(/childId required/);
  });

  it('missing localDay throws', async () => {
    await expect(claimDailySet(env.DB, { childId: 'child-1' })).rejects.toThrow(/localDay required/);
  });

  it('deleting the child cascades to remove its daily_claims rows (GDPR erasure)', async () => {
    await claimDailySet(env.DB, { childId: 'child-1', localDay: '2026-07-01', sessionId: 's1' });
    expect(await countRows('child-1')).toHaveLength(1);

    await env.DB.prepare('DELETE FROM children WHERE id = ?').bind('child-1').run();

    expect(await countRows('child-1')).toHaveLength(0);
  });

  it('column pin — daily_claims exposes exactly the expected columns', async () => {
    const { results } = await env.DB.prepare(
      `SELECT name FROM pragma_table_info('daily_claims') ORDER BY cid`
    ).all();
    const cols = results.map(r => r.name).sort();
    expect(cols).toEqual(
      ['child_id', 'claimed_at', 'entitlement_type', 'id', 'local_day', 'owner_session_id'].sort()
    );
  });
});

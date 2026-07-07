/**
 * Entitlement resolution — Phase 0 Step 1 (additive, no enforcement).
 *
 * resolveEntitlements() is a pure function (lib/entitlements.js): no DB, no
 * fetch, no Date.now() inside — every test injects a fixed `now` so results
 * are deterministic. This suite exercises the full resolution ladder
 * (first-match-wins) plus the reason-code/entitlement-key parity pin
 * described in the project's duplicated-truth rule (see
 * tests/schemaParity.test.js for the pattern this mirrors).
 */

import { describe, it, expect } from 'vitest';
import {
  resolveEntitlements,
  isFutureEpoch,
  ENTITLEMENT_REASONS,
  ENTITLEMENT_KEYS,
} from '../lib/entitlements.js';

// Fixed clock: 2026-07-01T00:00:00Z (matches "today" per project context).
const NOW = new Date('2026-07-01T00:00:00Z');

function daysAgoISO(days) {
  const ms = NOW.getTime() - days * 24 * 60 * 60 * 1000;
  // Match the DB's stored format: "YYYY-MM-DD HH:MM:SS" (no trailing Z —
  // routes/account.js appends 'Z' itself before parsing).
  return new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
}

function secondsFromNow(days) {
  return Math.floor(NOW.getTime() / 1000) + days * 24 * 60 * 60;
}

function baseAccount(overrides = {}) {
  return {
    is_comped: 0,
    comp_source: null,
    subscription_status: null,
    subscription_current_period_end: null,
    created_at: daysAgoISO(5),
    ...overrides,
  };
}

const FULL_ENTITLEMENTS = {
  unlimitedPractice: true,
  focusedLearning: true,
  mockTests: true,
  deepProgress: true,
  aiTutor: true,
  challenge: true,
};

const FREE_ENTITLEMENTS = {
  unlimitedPractice: false,
  focusedLearning: false,
  mockTests: false,
  deepProgress: false,
  aiTutor: false,
  challenge: false,
};

describe('isFutureEpoch', () => {
  it('returns false for null/undefined/NaN', () => {
    expect(isFutureEpoch(null, NOW)).toBe(false);
    expect(isFutureEpoch(undefined, NOW)).toBe(false);
    expect(isFutureEpoch('not-a-number', NOW)).toBe(false);
  });

  it('treats the stored value as unix SECONDS', () => {
    const futureSeconds = secondsFromNow(5);
    const pastSeconds = secondsFromNow(-5);
    expect(isFutureEpoch(futureSeconds, NOW)).toBe(true);
    expect(isFutureEpoch(pastSeconds, NOW)).toBe(false);
  });
});

describe('resolveEntitlements — comp always wins', () => {
  it.each([
    ['status null', { subscription_status: null, subscription_current_period_end: null }],
    ['status active', { subscription_status: 'active', subscription_current_period_end: null }],
    ['status canceled + period_end future', { subscription_status: 'canceled', subscription_current_period_end: secondsFromNow(10) }],
    ['status canceled + period_end past', { subscription_status: 'canceled', subscription_current_period_end: secondsFromNow(-10) }],
  ])('is_comped=1 with %s → tier comped, reason comped, full access', (_label, overrides) => {
    const account = baseAccount({ is_comped: 1, comp_source: 'invite:FOO', ...overrides });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('comped');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.COMPED);
    expect(result.billingNote).toBe('invite:FOO');
    expect(result.fullAccess).toBe(true);
    expect(result.dailySetCap).toBeNull();
    expect(result.entitlements).toEqual(FULL_ENTITLEMENTS);
  });
});

describe('resolveEntitlements — subscription status branches', () => {
  it('active → paid / sub_active', () => {
    const account = baseAccount({ subscription_status: 'active' });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('paid');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.SUB_ACTIVE);
    expect(result.fullAccess).toBe(true);
    expect(result.entitlements).toEqual(FULL_ENTITLEMENTS);
  });

  it('trialing → paid / sub_trialing', () => {
    const account = baseAccount({ subscription_status: 'trialing' });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('paid');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.SUB_TRIALING);
    expect(result.fullAccess).toBe(true);
  });

  it('past_due WITHIN the 14-day grace window (period_end 2 days ago) → grace / sub_past_due, billingNote past_due', () => {
    const account = baseAccount({ subscription_status: 'past_due', subscription_current_period_end: secondsFromNow(-2) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('grace');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.SUB_PAST_DUE);
    expect(result.billingNote).toBe('past_due');
    expect(result.fullAccess).toBe(true);
  });

  it('past_due BEYOND the 14-day grace window (period_end 20 days ago) → grace NOT granted, falls through (free once trial also expired)', () => {
    const account = baseAccount({
      subscription_status: 'past_due',
      subscription_current_period_end: secondsFromNow(-20),
      created_at: daysAgoISO(60), // outside trial window too, so the fall-through resolves to free
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).not.toBe('grace');
    expect(result.reason).not.toBe(ENTITLEMENT_REASONS.SUB_PAST_DUE);
    expect(result.tier).toBe('free');
    expect(result.fullAccess).toBe(false);
  });

  it('past_due with NULL period_end → grace NOT granted (no date to prove it is within grace)', () => {
    const account = baseAccount({
      subscription_status: 'past_due',
      subscription_current_period_end: null,
      created_at: daysAgoISO(60),
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).not.toBe('grace');
    expect(result.tier).toBe('free');
    expect(result.fullAccess).toBe(false);
  });
});

describe('resolveEntitlements — paid-through backstop', () => {
  it('canceled + period_end FUTURE → paid / sub_canceled_paid_through', () => {
    const account = baseAccount({
      subscription_status: 'canceled',
      subscription_current_period_end: secondsFromNow(10),
      created_at: daysAgoISO(60), // outside trial window — proves backstop, not trial
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('paid');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.SUB_CANCELED_PAID_THROUGH);
    expect(result.billingNote).toBe('canceled');
    expect(result.fullAccess).toBe(true);
  });

  it('canceled + period_end NULL, created 60 days ago → free (real current prod account shape)', () => {
    const account = baseAccount({
      subscription_status: 'canceled',
      subscription_current_period_end: null,
      created_at: daysAgoISO(60),
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
    expect(result.billingNote).toBe('canceled');
    expect(result.fullAccess).toBe(false);
    expect(result.dailySetCap).toBe(1);
    expect(result.entitlements).toEqual(FREE_ENTITLEMENTS);
  });

  it('canceled + period_end PAST → free', () => {
    const account = baseAccount({
      subscription_status: 'canceled',
      subscription_current_period_end: secondsFromNow(-10),
      created_at: daysAgoISO(60),
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
  });

  it('status null + period_end FUTURE (partial webhook write) → paid / paid_through_backstop', () => {
    const account = baseAccount({
      subscription_status: null,
      subscription_current_period_end: secondsFromNow(10),
      created_at: daysAgoISO(60),
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('paid');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.PAID_THROUGH_BACKSTOP);
    expect(result.billingNote).toBeNull();
    expect(result.fullAccess).toBe(true);
  });

  it.each(['unpaid', 'incomplete', 'incomplete_expired', 'paused'])(
    'status %s + period_end FUTURE → backstop does NOT grant access (payment was never actually collected for that period)',
    (status) => {
      const account = baseAccount({
        subscription_status: status,
        subscription_current_period_end: secondsFromNow(10),
        created_at: daysAgoISO(60), // outside trial window — isolates the backstop, not the trial
      });
      const result = resolveEntitlements(account, { now: NOW });
      expect(result.tier).not.toBe('paid');
      expect(result.reason).not.toBe(ENTITLEMENT_REASONS.PAID_THROUGH_BACKSTOP);
      expect(result.fullAccess).toBe(false);
      expect(result.tier).toBe('free');
    }
  );

  it('status canceled + period_end FUTURE → still full access (paid-through preserved, canceled not excluded)', () => {
    const account = baseAccount({
      subscription_status: 'canceled',
      subscription_current_period_end: secondsFromNow(10),
      created_at: daysAgoISO(60),
    });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('paid');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.SUB_CANCELED_PAID_THROUGH);
    expect(result.fullAccess).toBe(true);
  });
});

describe('resolveEntitlements — app trial window', () => {
  it('status null + created 5 days ago → trial, ~25 days remaining', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(5) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('trial');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.APP_TRIAL);
    expect(result.trialDaysRemaining).toBe(25);
    expect(result.fullAccess).toBe(true);
    expect(result.entitlements).toEqual(FULL_ENTITLEMENTS);
  });

  it('status null + created 60 days ago → free, trialDaysRemaining 0', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(60) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
    expect(result.trialDaysRemaining).toBe(0);
    expect(result.billingNote).toBeNull();
  });

  it.each(['unpaid', 'incomplete', 'incomplete_expired', 'paused'])(
    'status %s within trial window → trial, billingNote carries raw status',
    (status) => {
      const account = baseAccount({ subscription_status: status, created_at: daysAgoISO(5) });
      const result = resolveEntitlements(account, { now: NOW });
      expect(result.tier).toBe('trial');
      expect(result.reason).toBe(ENTITLEMENT_REASONS.APP_TRIAL);
      expect(result.billingNote).toBe(status);
      expect(result.fullAccess).toBe(true);
    }
  );

  it('status unpaid + past trial → free, billingNote unpaid', () => {
    const account = baseAccount({ subscription_status: 'unpaid', created_at: daysAgoISO(60) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
    expect(result.billingNote).toBe('unpaid');
    expect(result.fullAccess).toBe(false);
  });

  it('created_at exactly 30 days ago (boundary) → trialDaysRemaining resolves to 0 → free', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(30) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.trialDaysRemaining).toBe(0);
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
  });

  it('created_at 31 days ago → free (just past the boundary)', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(31) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.FREE_POST_TRIAL);
    expect(result.fullAccess).toBe(false);
  });

  it('created_at 29 days ago → trial, 1 day remaining (just inside the boundary)', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(29) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('trial');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.APP_TRIAL);
    expect(result.trialDaysRemaining).toBe(1);
    expect(result.fullAccess).toBe(true);
  });
});

describe('resolveEntitlements — unparseable created_at fails OPEN (N-A-4)', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['garbage string', 'not-a-date'],
    ['empty string', ''],
  ])('created_at=%s → tier trial, reason created_at_unparseable, fullAccess true (never free)', (_label, badCreatedAt) => {
    const account = baseAccount({ subscription_status: null, created_at: badCreatedAt });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('trial');
    expect(result.reason).toBe(ENTITLEMENT_REASONS.CREATED_AT_UNPARSEABLE);
    expect(result.fullAccess).toBe(true);
    expect(result.entitlements).toEqual(FULL_ENTITLEMENTS);
    expect(result.dailySetCap).toBeNull();
  });

  it('is a PURE function even with a bad date — no reliance on a real clock', () => {
    const account = baseAccount({ subscription_status: null, created_at: 'garbage' });
    const resultA = resolveEntitlements(account, { now: NOW });
    const resultB = resolveEntitlements(account, { now: NOW });
    expect(resultA).toEqual(resultB);
  });
});

describe('resolveEntitlements — tutorProductAccess is independent of practice tier', () => {
  it('tutorProfile provided → tutorProductAccess true, practice tier unaffected', () => {
    const freeAccount = baseAccount({ subscription_status: null, created_at: daysAgoISO(60) });
    const result = resolveEntitlements(freeAccount, { now: NOW, tutorProfile: { id: 'tutor-1' } });
    expect(result.tutorProductAccess).toBe(true);
    expect(result.tier).toBe('free'); // unchanged — tutor mode is free/independent
  });

  it('tutorProfile null → tutorProductAccess false', () => {
    const account = baseAccount({ subscription_status: 'active' });
    const result = resolveEntitlements(account, { now: NOW, tutorProfile: null });
    expect(result.tutorProductAccess).toBe(false);
  });

  it('tutorProfile omitted entirely → defaults to falsy', () => {
    const account = baseAccount({ subscription_status: 'active' });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tutorProductAccess).toBe(false);
  });
});

describe('resolveEntitlements — subscriptionStatus passthrough', () => {
  it('passes through the raw status, or null when absent', () => {
    expect(resolveEntitlements(baseAccount({ subscription_status: 'active' }), { now: NOW }).subscriptionStatus).toBe('active');
    expect(resolveEntitlements(baseAccount({ subscription_status: null }), { now: NOW }).subscriptionStatus).toBeNull();
  });
});

// ── Parity pin ──
// Mirrors the schemaParity.test.js pattern: pin the exported reason-code
// set and entitlement-key set to a hard-coded expected list. Adding a new
// Stripe status branch or a new gated feature must be a deliberate,
// test-breaking change — not a silent addition nobody notices.
describe('parity pin — reason codes and entitlement keys', () => {
  const EXPECTED_REASONS = [
    'comped',
    'sub_active',
    'sub_trialing',
    'sub_past_due',
    'sub_canceled_paid_through',
    'paid_through_backstop',
    'app_trial',
    'free_post_trial',
    'created_at_unparseable',
  ];

  const EXPECTED_ENTITLEMENT_KEYS = [
    'unlimitedPractice',
    'focusedLearning',
    'mockTests',
    'deepProgress',
    'aiTutor',
    'challenge',
  ];

  it('ENTITLEMENT_REASONS values match the expected reason-code set exactly', () => {
    const actual = Object.values(ENTITLEMENT_REASONS).sort();
    expect(actual).toEqual([...EXPECTED_REASONS].sort());
  });

  it('ENTITLEMENT_KEYS matches the expected entitlement-key set exactly', () => {
    expect([...ENTITLEMENT_KEYS].sort()).toEqual([...EXPECTED_ENTITLEMENT_KEYS].sort());
  });

  it('every FULL and FREE entitlements payload exposes exactly the pinned keys', () => {
    const full = resolveEntitlements(baseAccount({ is_comped: 1 }), { now: NOW }).entitlements;
    const free = resolveEntitlements(
      baseAccount({ subscription_status: null, created_at: daysAgoISO(60) }),
      { now: NOW }
    ).entitlements;
    expect(Object.keys(full).sort()).toEqual([...EXPECTED_ENTITLEMENT_KEYS].sort());
    expect(Object.keys(free).sort()).toEqual([...EXPECTED_ENTITLEMENT_KEYS].sort());
  });
});

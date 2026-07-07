/**
 * Entitlement-key parity pin (Phase 0 freemium drift risk).
 *
 * The entitlement key list is hand-copied across SIX private/exported maps
 * (three in this Worker, three in the client's src/utils/entitlementGating.js)
 * that must stay identical but were pinned to nothing until now — one copy
 * even carried a load-bearing "should stay in step" comment, exactly the
 * anti-pattern the project's duplicated-truth rule forbids (see
 * schemaParity.test.js for the pattern this file mirrors).
 *
 * entitlements.test.js already exercises the resolution ladder branch by
 * branch and pins ENTITLEMENT_REASONS/ENTITLEMENT_KEYS against a hard-coded
 * expected list. This file is deliberately different: instead of comparing
 * the exports to a second hard-coded literal, it derives the key set from
 * resolveEntitlements()'s REAL RETURNED PAYLOAD for each of the three
 * private maps (FULL_ENTITLEMENTS, FREE_ENTITLEMENTS, and the kill-switch's
 * inline full map) and compares that to the exported ENTITLEMENT_KEYS. That
 * is the thing actually at risk of drifting: the private maps, not the
 * published list.
 */

import { describe, it, expect } from 'vitest';
import {
  ENTITLEMENT_KEYS,
  ENTITLEMENT_REASONS,
  resolveEntitlements,
} from '../lib/entitlements.js';

// Fixed clock — matches the other entitlement tests' convention of an
// injected `now` so every case here is deterministic.
const NOW = new Date('2026-07-07T00:00:00Z');

function daysAgoISO(days) {
  const ms = NOW.getTime() - days * 24 * 60 * 60 * 1000;
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

describe('entitlement key parity — private maps derive from ENTITLEMENT_KEYS', () => {
  it('COMPED account (FULL_ENTITLEMENTS) → keys match ENTITLEMENT_KEYS, every value true', () => {
    const result = resolveEntitlements(baseAccount({ is_comped: 1, comp_source: 'invite:FOO' }), { now: NOW });
    expect(result.tier).toBe('comped');
    expect(Object.keys(result.entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(result.entitlements).every((v) => v === true)).toBe(true);
  });

  it('post-trial FREE account (FREE_ENTITLEMENTS) → keys match ENTITLEMENT_KEYS, every value false', () => {
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(40) });
    const result = resolveEntitlements(account, { now: NOW });
    expect(result.tier).toBe('free');
    expect(Object.keys(result.entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(result.entitlements).every((v) => v === false)).toBe(true);
  });

  it('kill-switch (enforcementActive: false) → tier unrestricted, keys match ENTITLEMENT_KEYS, every value true', () => {
    // Use an account that would otherwise resolve to free, to prove the
    // kill-switch's inline full map — not some other branch — is what fired.
    const account = baseAccount({ subscription_status: null, created_at: daysAgoISO(40) });
    const result = resolveEntitlements(account, { now: NOW, enforcementActive: false });
    expect(result.tier).toBe('unrestricted');
    expect(Object.keys(result.entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(result.entitlements).every((v) => v === true)).toBe(true);
  });
});

describe('ENTITLEMENT_KEYS — shape sanity', () => {
  it('is non-empty and has no duplicate keys', () => {
    expect(ENTITLEMENT_KEYS.length).toBeGreaterThan(0);
    expect(new Set(ENTITLEMENT_KEYS).size).toBe(ENTITLEMENT_KEYS.length);
  });
});

describe('ENTITLEMENT_REASONS — every ladder branch emits a pinned reason', () => {
  const validReasons = new Set(Object.values(ENTITLEMENT_REASONS));

  it.each([
    ['comped', baseAccount({ is_comped: 1 }), {}],
    ['sub_active', baseAccount({ subscription_status: 'active' }), {}],
    ['sub_trialing', baseAccount({ subscription_status: 'trialing' }), {}],
    [
      'sub_past_due (in grace)',
      baseAccount({ subscription_status: 'past_due', subscription_current_period_end: secondsFromNow(-2) }),
      {},
    ],
    [
      'paid_through_backstop',
      baseAccount({
        subscription_status: null,
        subscription_current_period_end: secondsFromNow(10),
        created_at: daysAgoISO(60),
      }),
      {},
    ],
    [
      'sub_canceled_paid_through',
      baseAccount({
        subscription_status: 'canceled',
        subscription_current_period_end: secondsFromNow(10),
        created_at: daysAgoISO(60),
      }),
      {},
    ],
    ['app_trial', baseAccount({ subscription_status: null, created_at: daysAgoISO(5) }), {}],
    ['created_at_unparseable', baseAccount({ subscription_status: null, created_at: 'not-a-date' }), {}],
    ['free_post_trial', baseAccount({ subscription_status: null, created_at: daysAgoISO(60) }), {}],
    [
      'enforcement_disabled',
      baseAccount({ subscription_status: null, created_at: daysAgoISO(60) }),
      { enforcementActive: false },
    ],
  ])('%s → reason is one of the pinned ENTITLEMENT_REASONS values', (_label, account, opts) => {
    const result = resolveEntitlements(account, { now: NOW, ...opts });
    expect(validReasons.has(result.reason)).toBe(true);
  });

  it('every ladder branch above collectively exercises every pinned reason at least once', () => {
    const accounts = [
      [baseAccount({ is_comped: 1 }), {}],
      [baseAccount({ subscription_status: 'active' }), {}],
      [baseAccount({ subscription_status: 'trialing' }), {}],
      [baseAccount({ subscription_status: 'past_due', subscription_current_period_end: secondsFromNow(-2) }), {}],
      [
        baseAccount({
          subscription_status: null,
          subscription_current_period_end: secondsFromNow(10),
          created_at: daysAgoISO(60),
        }),
        {},
      ],
      [
        baseAccount({
          subscription_status: 'canceled',
          subscription_current_period_end: secondsFromNow(10),
          created_at: daysAgoISO(60),
        }),
        {},
      ],
      [baseAccount({ subscription_status: null, created_at: daysAgoISO(5) }), {}],
      [baseAccount({ subscription_status: null, created_at: 'not-a-date' }), {}],
      [baseAccount({ subscription_status: null, created_at: daysAgoISO(60) }), {}],
      [baseAccount({ subscription_status: null, created_at: daysAgoISO(60) }), { enforcementActive: false }],
    ];
    const seenReasons = new Set(accounts.map(([account, opts]) => resolveEntitlements(account, { now: NOW, ...opts }).reason));
    expect(seenReasons).toEqual(validReasons);
  });
});

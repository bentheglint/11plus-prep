import {
  normaliseEntitlement,
  canUseFeature,
  isFreeFloorActive,
  trialBanner,
  resolveQaTierOverride,
  interpretDailyClaimResponse,
  resolveAccessAdmission,
  isPaymentConfirmed,
  FREE_TIER_FLAG,
} from './entitlementGating';

const FREE_ENTITLEMENT = {
  tier: 'free',
  dailySetCap: 1,
  trialDaysRemaining: 0,
  entitlements: {
    unlimitedPractice: false,
    focusedLearning: false,
    mockTests: false,
    deepProgress: false,
    aiTutor: false,
    challenge: false,
  },
};

const FULL_ENTITLEMENT = {
  tier: 'paid',
  dailySetCap: null,
  trialDaysRemaining: 0,
  entitlements: {
    unlimitedPractice: true,
    focusedLearning: true,
    mockTests: true,
    deepProgress: true,
    aiTutor: true,
    challenge: true,
  },
};

const TRIAL_ENTITLEMENT = {
  ...FULL_ENTITLEMENT,
  tier: 'trial',
  trialDaysRemaining: 12,
};

describe('FREE_TIER_FLAG', () => {
  it('is the string used to look up the feature flag', () => {
    expect(FREE_TIER_FLAG).toBe('freeTier');
  });
});

describe('normaliseEntitlement — fail open', () => {
  it('null → grants everything', () => {
    const n = normaliseEntitlement(null);
    expect(n.tier).toBeNull();
    expect(n.dailySetCap).toBeNull();
    expect(n.trialDaysRemaining).toBeNull();
    expect(Object.values(n.entitlements).every((v) => v === true)).toBe(true);
  });

  it('undefined → grants everything', () => {
    const n = normaliseEntitlement(undefined);
    expect(Object.values(n.entitlements).every((v) => v === true)).toBe(true);
  });

  it('malformed (missing entitlements object) → grants everything', () => {
    const n = normaliseEntitlement({ tier: 'free' });
    expect(Object.values(n.entitlements).every((v) => v === true)).toBe(true);
  });

  it('entitlements is not an object → grants everything', () => {
    const n = normaliseEntitlement({ tier: 'free', entitlements: 'nope' });
    expect(Object.values(n.entitlements).every((v) => v === true)).toBe(true);
  });

  it('never throws on a hostile input', () => {
    expect(() => normaliseEntitlement(42)).not.toThrow();
    expect(() => normaliseEntitlement('string')).not.toThrow();
    expect(() => normaliseEntitlement([])).not.toThrow();
  });

  it('a real free entitlement passes through correctly, not fail-open', () => {
    const n = normaliseEntitlement(FREE_ENTITLEMENT);
    expect(n.tier).toBe('free');
    expect(n.dailySetCap).toBe(1);
    expect(n.entitlements.mockTests).toBe(false);
    expect(n.entitlements.challenge).toBe(false);
  });

  it('a real full entitlement passes through correctly, all true', () => {
    const n = normaliseEntitlement(FULL_ENTITLEMENT);
    expect(Object.values(n.entitlements).every((v) => v === true)).toBe(true);
  });
});

describe('canUseFeature', () => {
  it('free entitlement — per-feature false for gated features', () => {
    expect(canUseFeature(FREE_ENTITLEMENT, 'focusedLearning')).toBe(false);
    expect(canUseFeature(FREE_ENTITLEMENT, 'mockTests')).toBe(false);
    expect(canUseFeature(FREE_ENTITLEMENT, 'challenge')).toBe(false);
    expect(canUseFeature(FREE_ENTITLEMENT, 'aiTutor')).toBe(false);
  });

  it('full entitlement — every feature true', () => {
    expect(canUseFeature(FULL_ENTITLEMENT, 'focusedLearning')).toBe(true);
    expect(canUseFeature(FULL_ENTITLEMENT, 'mockTests')).toBe(true);
    expect(canUseFeature(FULL_ENTITLEMENT, 'challenge')).toBe(true);
  });

  it('gates on the per-feature boolean, never on tier — a trial tier with an explicit false still reads false', () => {
    const oddShape = { tier: 'trial', entitlements: { challenge: false } };
    expect(canUseFeature(oddShape, 'challenge')).toBe(false);
    // other, unspecified features on the same object still fail open to true
    expect(canUseFeature(oddShape, 'mockTests')).toBe(true);
  });

  it('unknown feature name → true (fail open)', () => {
    expect(canUseFeature(FREE_ENTITLEMENT, 'somethingThatDoesNotExist')).toBe(true);
  });

  it('null/undefined entitlement → true for any feature (fail open)', () => {
    expect(canUseFeature(null, 'mockTests')).toBe(true);
    expect(canUseFeature(undefined, 'challenge')).toBe(true);
  });
});

describe('isFreeFloorActive', () => {
  it('passes through the flag value', () => {
    expect(isFreeFloorActive(true)).toBe(true);
    expect(isFreeFloorActive(false)).toBe(false);
    expect(isFreeFloorActive(undefined)).toBe(false);
  });
});

describe('trialBanner', () => {
  it('shows for a trial tier with positive days remaining', () => {
    const b = trialBanner(TRIAL_ENTITLEMENT);
    expect(b.show).toBe(true);
    expect(b.daysRemaining).toBe(12);
  });

  it('never shows for paid', () => {
    expect(trialBanner(FULL_ENTITLEMENT).show).toBe(false);
  });

  it('never shows for comped', () => {
    expect(trialBanner({ ...FULL_ENTITLEMENT, tier: 'comped', trialDaysRemaining: 5 }).show).toBe(false);
  });

  it('never shows for free', () => {
    expect(trialBanner(FREE_ENTITLEMENT).show).toBe(false);
  });

  it('never shows "0 days left" — trial tier with 0 days remaining is hidden', () => {
    const b = trialBanner({ ...TRIAL_ENTITLEMENT, trialDaysRemaining: 0 });
    expect(b.show).toBe(false);
    expect(b.daysRemaining).toBeNull();
  });

  it('trial tier with a non-finite/negative days value is hidden, never throws', () => {
    expect(trialBanner({ ...TRIAL_ENTITLEMENT, trialDaysRemaining: -1 }).show).toBe(false);
    expect(trialBanner({ ...TRIAL_ENTITLEMENT, trialDaysRemaining: null }).show).toBe(false);
    expect(trialBanner({ ...TRIAL_ENTITLEMENT, trialDaysRemaining: NaN }).show).toBe(false);
  });

  it('malformed/missing entitlement → fail open (all true) but tier is null so banner never shows', () => {
    const b = trialBanner(null);
    expect(b.show).toBe(false);
  });
});

describe('resolveQaTierOverride — dev-only, fail closed', () => {
  it('production build → always null, no matter what the URL says', () => {
    expect(resolveQaTierOverride('?qa-tier=paid', 'production')).toBeNull();
    expect(resolveQaTierOverride('?qa-tier=paid&dev-auth=true', 'production')).toBeNull();
  });

  it('development env + ?qa-tier=free → synthesised free entitlement', () => {
    const result = resolveQaTierOverride('?qa-tier=free', 'development');
    expect(result.tier).toBe('free');
    expect(result.dailySetCap).toBe(1);
    expect(result.entitlements.mockTests).toBe(false);
    expect(result.entitlements.challenge).toBe(false);
  });

  it('development env + ?qa-tier=trial → synthesised trial entitlement with positive days', () => {
    const result = resolveQaTierOverride('?qa-tier=trial', 'development');
    expect(result.tier).toBe('trial');
    expect(result.trialDaysRemaining).toBeGreaterThan(0);
    expect(result.entitlements.mockTests).toBe(true);
  });

  it('development env + ?qa-tier=paid → synthesised full entitlement', () => {
    const result = resolveQaTierOverride('?qa-tier=paid', 'development');
    expect(result.tier).toBe('paid');
    expect(Object.values(result.entitlements).every((v) => v === true)).toBe(true);
  });

  it('development env + no qa-tier param → null (no override)', () => {
    expect(resolveQaTierOverride('', 'development')).toBeNull();
  });

  it('development env + invalid qa-tier value → null', () => {
    expect(resolveQaTierOverride('?qa-tier=bogus', 'development')).toBeNull();
  });

  it('test env (CI/jest, non-production) also honours the override — dev context is any non-production build', () => {
    const result = resolveQaTierOverride('?qa-tier=paid', 'test');
    expect(result.tier).toBe('paid');
  });

  it('never throws on a hostile search string', () => {
    expect(() => resolveQaTierOverride(null, 'development')).not.toThrow();
    expect(() => resolveQaTierOverride(undefined, 'development')).not.toThrow();
  });
});

describe('interpretDailyClaimResponse — enforce ONLY on explicit daily_cap_reached', () => {
  it('ok + allowed true → allowed', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: true, tier: 'free' } })).toBe('allowed');
  });

  it('ok + allowed false + code daily_cap_reached → cap_reached', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: false, code: 'daily_cap_reached' } })).toBe('cap_reached');
  });

  it('ok + unlimited (paid/comped/trial) → allowed', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: true, unlimited: true, tier: 'paid' } })).toBe('allowed');
  });

  it('ok + allowed true + alreadyClaimed false → allowed — a genuine fresh claim, not a resume', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: true, alreadyClaimed: false, ownedByThisSession: true, tier: 'free' } })).toBe('allowed');
  });

  it('ok + allowed true + alreadyClaimed true + ownedByThisSession true → resume — the same device re-sent its own token', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: true, alreadyClaimed: true, ownedByThisSession: true, tier: 'free' } })).toBe('resume');
  });

  it('ok + allowed true + alreadyClaimed true but ownedByThisSession false → allowed, NOT resume — a different session owns today\'s row, this call never claimed anything', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: true, alreadyClaimed: true, ownedByThisSession: false, tier: 'free' } })).toBe('allowed');
  });

  it('ok + allowed false but WITHOUT the specific code → fails open to allowed (not decisive enough to block)', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: { allowed: false } })).toBe('allowed');
  });

  it('non-ok response (4xx/5xx) → fail open, allowed', () => {
    expect(interpretDailyClaimResponse({ ok: false, data: { allowed: false, code: 'daily_cap_reached' } })).toBe('allowed');
    expect(interpretDailyClaimResponse({ ok: false, data: null })).toBe('allowed');
  });

  it('network error / no data at all → fail open, allowed', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: null })).toBe('allowed');
    expect(interpretDailyClaimResponse({ ok: true, data: undefined })).toBe('allowed');
    expect(interpretDailyClaimResponse({})).toBe('allowed');
    expect(interpretDailyClaimResponse()).toBe('allowed');
  });

  it('malformed data shape (not an object, or missing fields) → fail open, allowed', () => {
    expect(interpretDailyClaimResponse({ ok: true, data: 'nonsense' })).toBe('allowed');
    expect(interpretDailyClaimResponse({ ok: true, data: {} })).toBe('allowed');
  });
});

describe('resolveAccessAdmission — flag on/off x hasAccess matrix', () => {
  it('hasAccess true, flag off → ready (unchanged)', () => {
    expect(resolveAccessAdmission({ hasAccess: true, freeTierOn: false })).toBe('ready');
  });

  it('hasAccess true, flag on → ready (unchanged — comped/paid/trial/grace never walled)', () => {
    expect(resolveAccessAdmission({ hasAccess: true, freeTierOn: true })).toBe('ready');
  });

  it('hasAccess false, flag off → subscribe (today\'s behaviour, walled)', () => {
    expect(resolveAccessAdmission({ hasAccess: false, freeTierOn: false })).toBe('subscribe');
  });

  it('hasAccess false, flag on → ready (admitted to the free floor)', () => {
    expect(resolveAccessAdmission({ hasAccess: false, freeTierOn: true })).toBe('ready');
  });
});

describe('isPaymentConfirmed — the Stripe-return poll predicate', () => {
  it('tier "paid" → confirmed', () => {
    expect(isPaymentConfirmed({ entitlement: { tier: 'paid' } })).toBe(true);
  });

  it('tier "trial" (app trial, not the subscription) → not yet confirmed', () => {
    expect(isPaymentConfirmed({ entitlement: { tier: 'trial' } })).toBe(false);
  });

  it('tier "free" → not yet confirmed', () => {
    expect(isPaymentConfirmed({ entitlement: { tier: 'free' } })).toBe(false);
  });

  it('tier "grace" (past_due) → not yet confirmed — a genuinely lapsed card must keep polling, not be waved through', () => {
    expect(isPaymentConfirmed({ entitlement: { tier: 'grace' } })).toBe(false);
  });

  it('tier "comped" → not "paid" so the predicate reads false, but comped accounts never hit this path (resolveAccessAdmission already admits hasAccess=true unconditionally)', () => {
    expect(isPaymentConfirmed({ entitlement: { tier: 'comped' } })).toBe(false);
  });

  it('missing/malformed access → false, never throws (poll just keeps going, never fails open here — this predicate only decides when to STOP waiting)', () => {
    expect(isPaymentConfirmed(null)).toBe(false);
    expect(isPaymentConfirmed(undefined)).toBe(false);
    expect(isPaymentConfirmed({})).toBe(false);
    expect(isPaymentConfirmed({ entitlement: null })).toBe(false);
    expect(() => isPaymentConfirmed(42)).not.toThrow();
  });
});

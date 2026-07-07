// ── Entitlement Resolution (Phase 0, Step 1) ──
//
// resolveEntitlements() is the single source of truth for "what does this
// account get". It is a PURE function: no DB, no fetch, no Date.now() reads
// inside — the caller injects `now`. This is deliberate so it can be unit
// tested exhaustively and reused anywhere (routes, future cron, etc.)
// without carrying I/O concerns.
//
// STEP 1 IS ADDITIVE ONLY. Nothing in the app enforces on these fields yet —
// routes/account.js attaches the result as `access.entitlement` alongside
// the existing (untouched) `access.*` fields. No gating logic changes.
//
// Resolution ladder — FIRST MATCH WINS:
//   1. is_comped                                          → comped   (FULL)
//   2. subscription_status === 'active'                   → paid     (FULL)
//   3. subscription_status === 'trialing'                 → paid     (FULL)
//   4. subscription_status === 'past_due'                 → grace    (FULL)
//   5. subscription_current_period_end in the future       → paid     (FULL)
//      (paid-through backstop — grants access even if status failed to
//      populate or is 'canceled' but the period hasn't ended; never removes)
//   6. within the 30-day app trial window since created_at → trial    (FULL)
//   6a. created_at missing/unparseable (NaN)                → trial    (FULL, fail-open)
//      (a malformed date must never lock a real account out — we can't
//      compute days remaining, so we grant full access and surface it via
//      a distinct reason code for observability rather than silently
//      pretending it's a normal trial)
//   7. otherwise                                            → free     (capped)

// subscription_current_period_end stores Stripe's raw `current_period_end`
// unconverted (see routes/stripe.js ~L281/290: `sub.current_period_end`
// bound straight from the webhook payload's subscription object). Per
// Stripe's API, Subscription.current_period_end is a Unix timestamp in
// SECONDS — so we multiply by 1000 before comparing to a JS Date's ms.
export function isFutureEpoch(value, now) {
  if (value === null || value === undefined) return false;
  const n = Number(value);
  if (!Number.isFinite(n)) return false;
  return n * 1000 > now.getTime();
}

export const ENTITLEMENT_REASONS = Object.freeze({
  COMPED: 'comped',
  SUB_ACTIVE: 'sub_active',
  SUB_TRIALING: 'sub_trialing',
  SUB_PAST_DUE: 'sub_past_due',
  SUB_CANCELED_PAID_THROUGH: 'sub_canceled_paid_through',
  PAID_THROUGH_BACKSTOP: 'paid_through_backstop',
  APP_TRIAL: 'app_trial',
  FREE_POST_TRIAL: 'free_post_trial',
  CREATED_AT_UNPARSEABLE: 'created_at_unparseable',
});

export const ENTITLEMENT_KEYS = Object.freeze([
  'unlimitedPractice',
  'focusedLearning',
  'mockTests',
  'deepProgress',
  'aiTutor',
  'challenge',
]);

const TRIAL_DAYS = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const FULL_ENTITLEMENTS = Object.freeze({
  unlimitedPractice: true,
  focusedLearning: true,
  mockTests: true,
  deepProgress: true,
  aiTutor: true,
  challenge: true,
});

const FREE_ENTITLEMENTS = Object.freeze({
  unlimitedPractice: false,
  focusedLearning: false,
  mockTests: false,
  deepProgress: false,
  aiTutor: false,
  challenge: false,
});

function fullPayload() {
  return { dailySetCap: null, entitlements: { ...FULL_ENTITLEMENTS } };
}

function freePayload() {
  return { dailySetCap: 1, entitlements: { ...FREE_ENTITLEMENTS } };
}

/**
 * Resolve what an account is entitled to. Pure function — takes a plain
 * account row (as returned by `SELECT ... FROM accounts`) plus options.
 *
 * @param {object} account - account row. Expected fields: is_comped,
 *   comp_source, subscription_status, subscription_current_period_end,
 *   created_at (string like "2026-05-01 00:00:00", treated as UTC).
 * @param {object} [options]
 * @param {object|null} [options.tutorProfile] - truthy if the account has a
 *   tutor profile row. Tutor Mode is free/independent of the practice tier.
 * @param {Date} [options.now] - injected clock, defaults to `new Date()`.
 * @returns {object} entitlement resolution — see module doc for shape.
 */
export function resolveEntitlements(account, { tutorProfile = null, now = new Date() } = {}) {
  const isComped = !!(account && account.is_comped);
  const subStatus = (account && account.subscription_status) || null;
  const periodEnd = account ? account.subscription_current_period_end : null;
  const tutorProductAccess = !!tutorProfile;

  let tier;
  let reason;
  let billingNote = null;
  let payload;
  let trialDaysRemaining = 0;

  if (isComped) {
    tier = 'comped';
    reason = ENTITLEMENT_REASONS.COMPED;
    billingNote = (account && account.comp_source) || null;
    payload = fullPayload();
  } else if (subStatus === 'active') {
    tier = 'paid';
    reason = ENTITLEMENT_REASONS.SUB_ACTIVE;
    payload = fullPayload();
  } else if (subStatus === 'trialing') {
    tier = 'paid';
    reason = ENTITLEMENT_REASONS.SUB_TRIALING;
    payload = fullPayload();
  } else if (subStatus === 'past_due') {
    tier = 'grace';
    reason = ENTITLEMENT_REASONS.SUB_PAST_DUE;
    billingNote = 'past_due';
    payload = fullPayload();
  } else if (isFutureEpoch(periodEnd, now)) {
    tier = 'paid';
    reason = subStatus === 'canceled'
      ? ENTITLEMENT_REASONS.SUB_CANCELED_PAID_THROUGH
      : ENTITLEMENT_REASONS.PAID_THROUGH_BACKSTOP;
    billingNote = subStatus;
    payload = fullPayload();
  } else {
    const createdAtMs = new Date(String(account && account.created_at) + 'Z').getTime();

    if (Number.isNaN(createdAtMs)) {
      // created_at is missing/garbage — we cannot compute a trial window at
      // all. Fail OPEN to full access rather than defaulting to `free`: a
      // real user must never be locked out by a data-quality problem. The
      // distinct reason code makes this show up in logs as its own case
      // instead of masquerading as a normal trial.
      tier = 'trial';
      reason = ENTITLEMENT_REASONS.CREATED_AT_UNPARSEABLE;
      billingNote = subStatus || null;
      payload = fullPayload();
      trialDaysRemaining = 0;
    } else {
      const daysSinceCreate = (now.getTime() - createdAtMs) / MS_PER_DAY;
      const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - daysSinceCreate));

      if (daysLeft > 0) {
        tier = 'trial';
        reason = ENTITLEMENT_REASONS.APP_TRIAL;
        billingNote = subStatus || null;
        payload = fullPayload();
        trialDaysRemaining = daysLeft;
      } else {
        tier = 'free';
        reason = ENTITLEMENT_REASONS.FREE_POST_TRIAL;
        billingNote = subStatus || null;
        payload = freePayload();
      }
    }
  }

  return {
    tier,
    reason,
    billingNote,
    fullAccess: ['comped', 'paid', 'grace', 'trial'].includes(tier),
    dailySetCap: payload.dailySetCap,
    entitlements: payload.entitlements,
    tutorProductAccess,
    trialDaysRemaining,
    subscriptionStatus: subStatus,
  };
}

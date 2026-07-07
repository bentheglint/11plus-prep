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
//   0. enforcementActive === false (kill-switch)          → unrestricted (FULL)
//      Short-circuits ABOVE every other step — see lib/killSwitch.js. This
//      is the emergency escape hatch: when ops has flipped the D1 flag off,
//      NOTHING below matters, not even is_comped/subscription/trial state.
//   1. is_comped                                          → comped   (FULL)
//   2. subscription_status === 'active'                   → paid     (FULL)
//   3. subscription_status === 'trialing'                 → paid     (FULL)
//   4. subscription_status === 'past_due'                  → grace    (FULL)
//      AND within PAST_DUE_GRACE_DAYS of periodEnd (see isWithinPastDueGrace)
//      — a past_due sub whose grace has expired falls through to the rest
//      of the ladder instead of granting indefinite access.
//   5. subscription_current_period_end in the future        → paid     (FULL)
//      AND subStatus is NOT in BACKSTOP_EXCLUDED_STATUSES
//      (paid-through backstop — grants access even if status failed to
//      populate or is 'canceled' but the period hasn't ended; never removes.
//      Excludes 'unpaid'/'incomplete'/'incomplete_expired'/'paused' — these
//      mean Stripe never successfully collected payment for that period, so
//      a future period_end on those statuses doesn't mean "paid through";
//      'canceled' and null/unknown statuses remain covered.)
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

// past_due means Stripe is actively retrying the charge — it resolves on
// its own (flips to 'active' on eventual success, or 'unpaid'/'canceled'
// once Stripe exhausts retries per the dashboard's retry schedule). So this
// bound isn't really "how long do we tolerate a failed payment" — it's a
// safety net for a MISSED terminal webhook (the retry-exhaustion event
// never arrived). 14 days past period end is payer-friendly but finite;
// tunable if Stripe's retry schedule changes.
const PAST_DUE_GRACE_DAYS = 14;

// Returns true when `periodEnd` (raw Stripe unix seconds) is still within
// PAST_DUE_GRACE_DAYS of "now". A null/missing/unparseable periodEnd
// returns false — with no date to check we cannot prove the account is
// within grace, so we conservatively decline rather than grant indefinite
// access.
export function isWithinPastDueGrace(periodEnd, now) {
  const n = Number(periodEnd);
  if (!Number.isFinite(n)) return false;
  return n * 1000 + PAST_DUE_GRACE_DAYS * MS_PER_DAY > now.getTime();
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
  ENFORCEMENT_DISABLED: 'enforcement_disabled',
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

// Statuses on which a future subscription_current_period_end must NOT be
// read as "paid through" by the backstop (ladder step 5). Each of these
// means Stripe never successfully collected payment for the current
// period — 'unpaid' (retries exhausted, still unpaid), 'incomplete'/
// 'incomplete_expired' (initial payment never completed), 'paused'
// (collection deliberately paused). 'canceled' and null/unknown statuses
// are deliberately NOT in this set — the backstop's whole purpose is
// covering the paid-through-after-cancellation case.
const BACKSTOP_EXCLUDED_STATUSES = new Set(['unpaid', 'incomplete', 'incomplete_expired', 'paused']);

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
 * @param {boolean} [options.enforcementActive] - the freemium kill-switch
 *   flag (lib/killSwitch.js), PASSED IN — this function stays pure and never
 *   reads the flag itself. Defaults to true (enforce) so any caller that
 *   forgets to pass it gets today's behaviour, never an accidental giveaway.
 *   false short-circuits the entire ladder below and grants full access.
 * @returns {object} entitlement resolution — see module doc for shape.
 */
export function resolveEntitlements(account, { tutorProfile = null, now = new Date(), enforcementActive = true } = {}) {
  // Ladder step 0 — kill-switch. Sits ABOVE everything else, including
  // is_comped: when ops has disengaged enforcement, every account is fully
  // entitled regardless of billing state. Tier 'unrestricted' is deliberate
  // (not 'free', so the client's daily-claim gate — which keys off
  // tier === 'free' — treats this as uncapped; not 'trial', so no trial
  // banner shows).
  if (enforcementActive === false) {
    return {
      tier: 'unrestricted',
      reason: ENTITLEMENT_REASONS.ENFORCEMENT_DISABLED,
      billingNote: null,
      fullAccess: true,
      dailySetCap: null,
      entitlements: { ...FULL_ENTITLEMENTS },
      tutorProductAccess: !!tutorProfile,
      trialDaysRemaining: 0,
      subscriptionStatus: (account && account.subscription_status) || null,
      enforcementActive: false,
    };
  }

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
  } else if (subStatus === 'past_due' && isWithinPastDueGrace(periodEnd, now)) {
    tier = 'grace';
    reason = ENTITLEMENT_REASONS.SUB_PAST_DUE;
    billingNote = 'past_due';
    payload = fullPayload();
  } else if (isFutureEpoch(periodEnd, now) && !BACKSTOP_EXCLUDED_STATUSES.has(subStatus)) {
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
    enforcementActive: true,
  };
}

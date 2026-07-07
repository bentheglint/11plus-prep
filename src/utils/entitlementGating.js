// ── Client-side entitlement gating (Phase 0, Step 5) ──
//
// Pure helper functions the UI uses to decide what a user can do. The
// server (workers/ai-tutor/lib/entitlements.js) is the real source of
// truth and enforces every gate for real; this module only decides what
// to SHOW so the app doesn't waste a round trip on something it already
// knows is blocked.
//
// FAIL OPEN, always. If the entitlement payload is missing, malformed, or
// this code has a bug, the safe failure is "let the user in", never "lock
// a real, possibly paying, user out". A plumbing bug must never become a
// paywall.

export const FREE_TIER_FLAG = 'freeTier';

// Matches ENTITLEMENT_KEYS in workers/ai-tutor/lib/entitlements.js. Not
// imported directly (client and worker are separate bundles), but every
// key here should stay in step with that list.
const ALL_TRUE_ENTITLEMENTS = Object.freeze({
  unlimitedPractice: true,
  focusedLearning: true,
  mockTests: true,
  deepProgress: true,
  aiTutor: true,
  challenge: true,
});

// Normalise whatever access.entitlement the server sent (or didn't) into a
// safe shape the rest of this module can read without guarding every call
// site. Never throws.
export function normaliseEntitlement(entitlement) {
  try {
    if (!entitlement || typeof entitlement !== 'object') {
      return failOpenEntitlement();
    }
    const ents = entitlement.entitlements;
    if (!ents || typeof ents !== 'object') {
      return failOpenEntitlement();
    }
    return {
      tier: entitlement.tier ?? null,
      dailySetCap: entitlement.dailySetCap ?? null,
      trialDaysRemaining: typeof entitlement.trialDaysRemaining === 'number'
        ? entitlement.trialDaysRemaining
        : null,
      entitlements: { ...ents },
    };
  } catch {
    return failOpenEntitlement();
  }
}

function failOpenEntitlement() {
  return {
    tier: null,
    dailySetCap: null,
    trialDaysRemaining: null,
    entitlements: { ...ALL_TRUE_ENTITLEMENTS },
  };
}

// Gate on the per-feature boolean only, never on tier. Unknown feature or
// a missing value on the (already normalised) entitlements object also
// fails open to true.
export function canUseFeature(entitlement, feature) {
  const normalised = normaliseEntitlement(entitlement);
  const value = normalised.entitlements[feature];
  return value !== false; // true, undefined, or any non-false value → allowed
}

// Trivial passthrough, kept as a named function purely so call sites read
// clearly ("is the free floor active right now") rather than re-deriving
// the same isFeatureEnabled('freeTier') check in several places.
export function isFreeFloorActive(flagOn) {
  return !!flagOn;
}

// Trial banner should only ever show for a genuine, currently-running
// trial with days actually left. Never for comped/paid/free, and never
// "0 days left".
export function trialBanner(entitlement) {
  const normalised = normaliseEntitlement(entitlement);
  const show = normalised.tier === 'trial'
    && Number.isFinite(normalised.trialDaysRemaining)
    && normalised.trialDaysRemaining > 0;
  return {
    show,
    daysRemaining: show ? normalised.trialDaysRemaining : null,
  };
}

// ── Dev-only QA tier override (?qa-tier=free|trial|paid) ──
//
// Lets a tester force what the CLIENT displays/gates on, without owning a
// real account in each tier. This never touches the server: the claim-daily-
// set call and every other request the client makes carry no client-chosen
// tier, so a QA override here can never unlock a real server-enforced
// feature — it can only change what this build SHOWS.
//
// Fail closed: process.env.NODE_ENV is baked in at CRA build time and is
// literally the string 'production' for any real production build,
// regardless of what a URL parameter says — so in production this whole
// path is unreachable no matter who edits the query string.
const FULL_QA_ENTITLEMENTS = Object.freeze({
  unlimitedPractice: true,
  focusedLearning: true,
  mockTests: true,
  deepProgress: true,
  aiTutor: true,
  challenge: true,
});

const FREE_QA_ENTITLEMENTS = Object.freeze({
  unlimitedPractice: false,
  focusedLearning: false,
  mockTests: false,
  deepProgress: false,
  aiTutor: false,
  challenge: false,
});

function synthesiseQaEntitlement(tier) {
  if (tier === 'free') {
    return { tier: 'free', dailySetCap: 1, trialDaysRemaining: 0, entitlements: { ...FREE_QA_ENTITLEMENTS } };
  }
  if (tier === 'trial') {
    return { tier: 'trial', dailySetCap: null, trialDaysRemaining: 15, entitlements: { ...FULL_QA_ENTITLEMENTS } };
  }
  if (tier === 'paid') {
    return { tier: 'paid', dailySetCap: null, trialDaysRemaining: 0, entitlements: { ...FULL_QA_ENTITLEMENTS } };
  }
  return null;
}

// ── AuthGate admission decision ──
//
// Decides which onboarding step a signed-in user with a child lands on:
// 'ready' (into the app) or 'subscribe' (the paywall). Extracted as a pure
// function so the flag-on/flag-off × hasAccess matrix is unit tested
// directly, rather than only indirectly via rendering AuthGate.
//
// hasAccess === true (comped/paid/grace/trial) is UNCHANGED in both cases —
// always 'ready'. Only the !hasAccess (walled, free-tier) branch depends on
// the flag: flag off keeps today's behaviour (walled → subscribe); flag on
// admits the user to the free floor instead.
export function resolveAccessAdmission({ hasAccess, freeTierOn }) {
  if (hasAccess) return 'ready';
  return freeTierOn ? 'ready' : 'subscribe';
}

// ── Daily-set claim response interpretation ──
//
// Pure decision function for POST /api/entitlements/claim-daily-set
// (workers/ai-tutor/routes/entitlements.js). Three outcomes:
//   'cap_reached' — the explicit, decisive daily_cap_reached signal: today's
//     row belongs to someone/something else, no fresh set may start.
//   'resume'      — the row already belongs to THIS device's session (the
//     resend was idempotent). The caller must restore the saved in-progress
//     daily quiz, never generate a new one — if there's nothing saved to
//     restore, that means today's set is already used up.
//   'allowed'     — a genuine fresh claim, or anything not decisive enough
//     to act on (network error, 5xx, malformed body, unexpected shape).
//     Fails open so a plumbing wobble never stops a child practising.
export function interpretDailyClaimResponse({ ok, data } = {}) {
  if (ok && data && data.allowed === false && data.code === 'daily_cap_reached') {
    return 'cap_reached';
  }
  if (ok && data && data.allowed === true && data.alreadyClaimed === true && data.ownedByThisSession === true) {
    return 'resume';
  }
  return 'allowed';
}

// ── Stripe-return payment confirmation ──
//
// Pure predicate AuthGate polls against after a Stripe checkout return
// (?subscribed=1). Stripe's webhook that flips subscription_status to
// 'active' can land a few seconds after the redirect, so the client must
// not trust the FIRST /api/account response after landing back — it may
// still carry the OLD (free) status. This is the single "is it now safe to
// stop waiting and show the app" signal.
//
// tier === 'paid' is the correct high-level check: resolveEntitlements
// (workers/ai-tutor/lib/entitlements.js) maps subscription_status 'active'
// AND 'trialing' AND the future-period-end backstop all to tier 'paid' —
// so this one comparison covers every "the subscription is now recognised"
// case without re-deriving that branching here. Anything else (missing
// access, still 'free'/'trial'/'grace') → not yet confirmed, keep polling.
export function isPaymentConfirmed(access) {
  return access?.entitlement?.tier === 'paid';
}

// Pure by design (takes the query string + NODE_ENV as plain args, never
// reads window itself) so it can be exhaustively unit tested.
export function resolveQaTierOverride(search, nodeEnv) {
  try {
    const params = new URLSearchParams(search || '');
    const devContext = nodeEnv !== 'production'
      // Mirrors AuthGate's existing ?dev-auth=true bypass pattern for parity.
      // Redundant once nodeEnv !== 'production' already passed, but kept so
      // this reads the same way the rest of the app's dev gates do.
      || (nodeEnv === 'development' && params.get('dev-auth') === 'true');
    if (!devContext) return null;

    const tier = params.get('qa-tier');
    return synthesiseQaEntitlement(tier);
  } catch {
    return null;
  }
}

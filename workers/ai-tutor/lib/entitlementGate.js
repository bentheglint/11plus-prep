// ── Entitlement Gate (Phase 0, Step 4) ──
//
// Thin route-facing wrapper around lib/entitlements.js. This module is the
// ONLY place a route should go to (a) load an account's resolved entitlement
// from the DB, and (b) build the standard "upgrade required" 403. Routes
// must not hand-roll either of these — see index.js/handleTutor,
// routes/batch.js, routes/data.js for the call sites this step wires up.

import { resolveEntitlements } from './entitlements.js';
import { json } from '../helpers.js';

// Loads the account row and resolves its entitlement. Returns null if no
// account row (caller returns 404, consistent with GET /api/account).
export async function loadEntitlement(db, userId, now = new Date()) {
  const account = await db.prepare(
    `SELECT id, created_at, is_comped, comp_source, subscription_status, subscription_current_period_end
       FROM accounts WHERE id = ?`
  ).bind(userId).first();
  if (!account) return null;
  return resolveEntitlements(account, { now });
}

// Loads + resolves the entitlement for an ARBITRARY account (a pupil a tutor
// is viewing), not the caller's own. accounts.id IS the account_id a child's
// row references (children.account_id → accounts.id), so this is the same
// query as loadEntitlement, named to document that the id is a pupil's
// account, resolved on the tutor's behalf. Underpins all tutor-side gating.
export async function loadEntitlementForAccount(db, accountId, now = new Date()) {
  return loadEntitlement(db, accountId, now);
}

// Tutor-side gating marker for one pupil, derived from their resolved
// entitlement. FAIL OPEN: a genuine resolution failure (null entitlement —
// broken/missing account row, never a real free pupil, who always resolves
// cleanly to tier 'free') locks NOTHING, so a transient fault can never tell
// a tutor that a PAYING pupil is on the free plan. A real free pupil resolves
// deterministically to deepProgress:false / focusedLearning:false and IS
// withheld — the leak stays closed. Attach this to tutor route payloads.
export function pupilPlanMarker(entitlement) {
  if (!entitlement) {
    return { pupilPlan: 'unknown', deepProgressLocked: false, focusedLearningLocked: false };
  }
  const ent = entitlement.entitlements || {};
  return {
    pupilPlan: entitlement.tier,
    deepProgressLocked: ent.deepProgress === false,
    focusedLearningLocked: ent.focusedLearning === false,
  };
}

// Standard 403 for an entitlement wall (AI Tutor, Mock). code is the stable
// machine field the client branches on — never the human string.
export function upgradeRequiredResponse(entitlement) {
  return json({
    error: 'Upgrade required',
    code: 'upgrade_required',
    upgradeRequired: true,
    entitlement: { tier: entitlement.tier, reason: entitlement.reason, entitlements: entitlement.entitlements },
  }, 403);
}

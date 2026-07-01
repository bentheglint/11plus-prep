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

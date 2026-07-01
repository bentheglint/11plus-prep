// ── Entitlement Routes (Phase 0, Step 4) ──
// POST /api/entitlements/claim-daily-set — atomically claim the free tier's
// one-set-per-day cap. Paid/trial/comped/grace accounts (dailySetCap===null)
// always get allowed:true with no DB write — the daily_claims table only
// ever holds rows for free-tier claims.

import { json, resolveChildId } from '../helpers.js';
import { loadEntitlement } from '../lib/entitlementGate.js';
import { londonDay, claimDailySet } from '../lib/dailyClaims.js';

export async function handleEntitlementRoutes(request, env, userId, path) {
  if (path === '/api/entitlements/claim-daily-set' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { childId: requestedChildId, sessionId = null } = body;

    // No first-child fallback here: an entitlement claim must be pinned to
    // an explicit child the caller named, never silently guessed.
    if (!requestedChildId) return json({ error: 'Child not found' }, 404);
    const childId = await resolveChildId(env.DB, userId, requestedChildId);
    if (!childId) return json({ error: 'Child not found' }, 404);

    const ent = await loadEntitlement(env.DB, userId);
    if (!ent) return json({ error: 'Account not found' }, 404);

    if (ent.dailySetCap === null) {
      // Full-access tier — unlimited, no daily_claims row written.
      console.log(JSON.stringify({ evt: 'daily_set_claim', tier: ent.tier, childId, allowed: true }));
      return json({ allowed: true, unlimited: true, tier: ent.tier });
    }

    // Free tier — cap of 1 per Europe/London calendar day, enforced by the
    // atomic INSERT OR IGNORE in claimDailySet (never read-then-write).
    const localDay = londonDay();
    const r = await claimDailySet(env.DB, { childId, localDay, sessionId });
    console.log(JSON.stringify({ evt: 'daily_set_claim', tier: ent.tier, childId, allowed: r.allowed }));
    return json({
      allowed: r.allowed,
      alreadyClaimed: r.alreadyClaimed,
      ownedByThisSession: r.ownedByThisSession,
      tier: 'free',
      localDay,
      code: r.allowed ? undefined : 'daily_cap_reached',
    });
  }

  return null; // Route not matched
}

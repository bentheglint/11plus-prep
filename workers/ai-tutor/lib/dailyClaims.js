// ── Daily Claim Primitive (Phase 0, Step 3) ──
//
// This module owns the daily_claims ROW only. It does not decide who gets
// a cap — that is lib/entitlements.js's job. Callers must resolve
// entitlements FIRST via resolveEntitlements() and only call claimDailySet
// when the result's dailySetCap === 1 (i.e. the free tier). Paid/trial/
// comped/grace accounts have dailySetCap === null and should never reach
// this module at all.
//
// The daily_claims table models a boolean daily claim — a cap of exactly
// 1 per (child, entitlement_type, local_day). A higher cap (e.g. "3 sets a
// day") would need a count column and different semantics; that is out of
// scope for v1 and is not what this module does.

/**
 * Return the 'YYYY-MM-DD' Europe/London calendar day for the given Date.
 *
 * Uses Intl.DateTimeFormat with locale 'en-CA' (which formats as
 * YYYY-MM-DD) and the Europe/London time zone, so the GMT/BST transition
 * is handled correctly by the ICU time zone database rather than by any
 * manual offset arithmetic here. Cloudflare Workers ship with full-ICU
 * Intl support, including IANA time zones.
 *
 * @param {Date} [date] - defaults to now.
 * @returns {string} 'YYYY-MM-DD'
 */
export function londonDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Atomically claim a child's daily entitlement slot.
 *
 * Never reads before writing: D1 is eventually consistent, so a
 * read-then-write has a race window between concurrent requests. Instead
 * this always attempts an INSERT OR IGNORE first — the UNIQUE constraint
 * on (child_id, entitlement_type, local_day) is the single source of
 * truth for who won the day. Only if that insert changes nothing do we
 * look up who already owns the row, to decide whether this is an
 * idempotent resume (same session) or a genuine denial (different/no
 * session).
 *
 * @param {object} db - D1 database handle (env.DB).
 * @param {object} params
 * @param {string} params.childId - required.
 * @param {string} [params.entitlementType] - defaults to 'daily_set'.
 * @param {string} params.localDay - required; server-computed via londonDay().
 * @param {string|null} [params.sessionId] - the calling session/device id,
 *   used only to make a resume of the SAME session idempotent.
 * @returns {Promise<{allowed: boolean, alreadyClaimed: boolean, ownedByThisSession: boolean}>}
 */
export async function claimDailySet(db, { childId, entitlementType = 'daily_set', localDay, sessionId = null }) {
  // Guard inputs FIRST. Without this, a missing childId/localDay would hit
  // a NOT NULL constraint inside the INSERT, which INSERT OR IGNORE would
  // silently swallow — mislabelling a bad call as "already claimed".
  if (!childId) throw new Error('claimDailySet: childId required');
  if (!localDay) throw new Error('claimDailySet: localDay required');

  const ins = await db.prepare(
    `INSERT OR IGNORE INTO daily_claims (child_id, entitlement_type, local_day, owner_session_id)
     VALUES (?, ?, ?, ?)`
  ).bind(childId, entitlementType, localDay, sessionId).run();

  if (ins.meta.changes === 1) {
    // We won the day.
    return { allowed: true, alreadyClaimed: false, ownedByThisSession: true };
  }

  // The row already existed — find out who owns it.
  const existing = await db.prepare(
    `SELECT owner_session_id FROM daily_claims
     WHERE child_id = ? AND entitlement_type = ? AND local_day = ?`
  ).bind(childId, entitlementType, localDay).first();

  // A resume of the SAME session is idempotent (allowed); anything else
  // (a different session, or no session at all) is denied. null never
  // equals an existing owner_session_id, by design.
  const owned = sessionId != null && existing && existing.owner_session_id === sessionId;
  return { allowed: !!owned, alreadyClaimed: true, ownedByThisSession: !!owned };
}

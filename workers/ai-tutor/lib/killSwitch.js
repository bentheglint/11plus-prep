// ── Freemium Kill-Switch ──
//
// An emergency, data-plane escape hatch that disengages ALL free-tier
// enforcement instantly (grants everyone full access, reverting to
// pre-freemium behaviour) WITHOUT a code rebuild — flippable even if the
// deploy path itself is unhealthy mid-incident. See docs/kill-switch-runbook.md
// for how to actually flip it.
//
// FAIL-SAFE CONTRACT (never relax this): the default is ENFORCE-ON. A
// missing app_settings row, a missing app_settings table, a malformed
// value, or ANY thrown error while reading the flag all mean "keep
// enforcing" — never "give the product away". Enforcement is disengaged
// ONLY by an explicit, recognised off value. This function must NEVER
// throw; every caller treats its return value as gospel with no further
// try/catch of their own.
//
// CACHE: a short (10s) module-level cache keyed on nothing — there is only
// one global flag, not one per account — so a hot route doesn't hit D1 on
// every request. The TTL is deliberately short: during a live incident the
// whole point of the switch is that it propagates fast, so 10s is the
// ceiling on "how stale can the server-side view of the flag be", not a
// tuned-for-load number.

const CACHE_TTL_MS = 10_000;

let cachedValue = null; // boolean | null (null = no cache yet)
let cachedAt = 0;

const INACTIVE_VALUES = new Set(['off', 'false', '0', 'disabled']);

/**
 * Resolve whether free-tier enforcement is currently active.
 *
 * @param {object} db - D1 database binding (has .prepare()).
 * @param {number} [now] - injected clock (ms since epoch) for cache testing.
 * @returns {Promise<boolean>} true = enforce (default/fail-safe), false =
 *   the switch has been explicitly flipped off.
 */
export async function isEnforcementActive(db, now = Date.now()) {
  if (cachedValue !== null && now - cachedAt < CACHE_TTL_MS) {
    return cachedValue;
  }

  let result = true; // fail-safe default — flipped only on an explicit off value below
  try {
    const row = await db.prepare(
      `SELECT value FROM app_settings WHERE key = ?`
    ).bind('free_tier_enforcement').first();

    if (row && typeof row.value === 'string') {
      const normalised = row.value.trim().toLowerCase();
      if (INACTIVE_VALUES.has(normalised)) {
        result = false;
      }
      // Anything else (missing row, 'on', garbage) leaves result = true.
    }
  } catch {
    // Missing table, D1 error, whatever — fail SAFE to enforcing. Never throw.
    result = true;
  }

  cachedValue = result;
  cachedAt = now;
  return result;
}

// Test helper — clears the module-level cache so each test starts from a
// clean slate rather than leaking state across cases/files.
export function _resetEnforcementCache() {
  cachedValue = null;
  cachedAt = 0;
}

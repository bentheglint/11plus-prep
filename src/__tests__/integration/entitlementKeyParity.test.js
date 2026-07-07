/**
 * Client-side entitlement-key parity pin (Phase 0 freemium drift risk).
 *
 * src/utils/entitlementGating.js hand-copies the same six entitlement keys
 * into three private maps (ALL_TRUE_ENTITLEMENTS, FULL_QA_ENTITLEMENTS,
 * FREE_QA_ENTITLEMENTS). One of those copies carries a comment saying it
 * "should stay in step" with workers/ai-tutor/lib/entitlements.js's
 * ENTITLEMENT_KEYS — a load-bearing comment with nothing enforcing it,
 * exactly the anti-pattern the project's duplicated-truth rule forbids.
 *
 * This test cross-imports the Worker's real ENTITLEMENT_KEYS export directly
 * (entitlements.js is dependency-free plain ESM, not inside node_modules, so
 * babel-jest transforms and resolves it like any other relative import) and
 * pins the client's public helpers against it. If either side adds, removes,
 * or renames a key without updating the other, this test fails.
 */

import { ENTITLEMENT_KEYS } from '../../../workers/ai-tutor/lib/entitlements.js';
import { normaliseEntitlement, resolveQaTierOverride } from '../../utils/entitlementGating.js';

describe('entitlement key parity — client maps derive from the Worker\'s ENTITLEMENT_KEYS', () => {
  it('normaliseEntitlement(null) fail-open (ALL_TRUE_ENTITLEMENTS) → keys match ENTITLEMENT_KEYS, every value true', () => {
    const { entitlements } = normaliseEntitlement(null);
    expect(Object.keys(entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(entitlements).every((v) => v === true)).toBe(true);
  });

  it('resolveQaTierOverride qa-tier=paid (FULL_QA_ENTITLEMENTS) → keys match ENTITLEMENT_KEYS, every value true', () => {
    const { entitlements } = resolveQaTierOverride('qa-tier=paid', 'development');
    expect(Object.keys(entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(entitlements).every((v) => v === true)).toBe(true);
  });

  it('resolveQaTierOverride qa-tier=free (FREE_QA_ENTITLEMENTS) → keys match ENTITLEMENT_KEYS, every value false', () => {
    const { entitlements } = resolveQaTierOverride('qa-tier=free', 'development');
    expect(Object.keys(entitlements).sort()).toEqual([...ENTITLEMENT_KEYS].sort());
    expect(Object.values(entitlements).every((v) => v === false)).toBe(true);
  });

  it('all three client key sets are identical to each other and to ENTITLEMENT_KEYS', () => {
    const allTrueKeys = Object.keys(normaliseEntitlement(null).entitlements).sort();
    const fullQaKeys = Object.keys(resolveQaTierOverride('qa-tier=paid', 'development').entitlements).sort();
    const freeQaKeys = Object.keys(resolveQaTierOverride('qa-tier=free', 'development').entitlements).sort();
    const canonical = [...ENTITLEMENT_KEYS].sort();

    expect(allTrueKeys).toEqual(canonical);
    expect(fullQaKeys).toEqual(canonical);
    expect(freeQaKeys).toEqual(canonical);
  });
});

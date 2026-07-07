/**
 * Freemium kill-switch — lib/killSwitch.js.
 *
 * isEnforcementActive() reads a single D1 row and must NEVER throw. Every
 * case exercised here maps onto the invariant matrix from the design:
 * missing row / missing table / malformed value / any error → enforce
 * (true); only a recognised off value → disengaged (false). A fake db is
 * used (rather than the real Miniflare D1 used elsewhere in this suite) so
 * the cache tests can count `.first()` calls precisely and simulate a
 * throwing prepare()/first() without needing a real broken table.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { isEnforcementActive, _resetEnforcementCache } from '../lib/killSwitch.js';

function makeFakeDb({ row = null, throwOnFirst = false, throwOnPrepare = false } = {}) {
  let calls = 0;
  return {
    prepare(_sql) {
      if (throwOnPrepare) throw new Error('boom: prepare');
      return {
        bind(..._args) {
          return {
            async first() {
              calls++;
              if (throwOnFirst) throw new Error('boom: first');
              return row;
            },
          };
        },
      };
    },
    get calls() {
      return calls;
    },
  };
}

beforeEach(() => {
  _resetEnforcementCache();
});

describe('isEnforcementActive — value interpretation', () => {
  it('no row (null) → true (fail-safe default)', async () => {
    const db = makeFakeDb({ row: null });
    expect(await isEnforcementActive(db, 1000)).toBe(true);
  });

  it.each(['off', 'false', '0', 'disabled', ' OFF ', 'Off', 'DISABLED', '  disabled  '])(
    'value %j → false (enforcement disengaged)',
    async (value) => {
      const db = makeFakeDb({ row: { value } });
      expect(await isEnforcementActive(db, 1000)).toBe(false);
    }
  );

  it.each(['on', 'yes', 'garbage', '1', 'true', 'ON', ''])(
    'value %j → true (still enforcing — only recognised off values disengage)',
    async (value) => {
      const db = makeFakeDb({ row: { value } });
      expect(await isEnforcementActive(db, 1000)).toBe(true);
    }
  );

  it('db.prepare() throws → true (fail-safe)', async () => {
    const db = makeFakeDb({ throwOnPrepare: true });
    expect(await isEnforcementActive(db, 1000)).toBe(true);
  });

  it('db...first() throws (e.g. missing app_settings table) → true (fail-safe)', async () => {
    const db = makeFakeDb({ throwOnFirst: true });
    expect(await isEnforcementActive(db, 1000)).toBe(true);
  });
});

describe('isEnforcementActive — 10s cache', () => {
  it('a second call within the TTL does NOT re-query', async () => {
    const db = makeFakeDb({ row: { value: 'off' } });
    const first = await isEnforcementActive(db, 1000);
    const second = await isEnforcementActive(db, 5000); // +4s, within 10s TTL
    expect(first).toBe(false);
    expect(second).toBe(false);
    expect(db.calls).toBe(1);
  });

  it('a call after the TTL expires re-queries', async () => {
    const db = makeFakeDb({ row: { value: 'off' } });
    await isEnforcementActive(db, 1000);
    await isEnforcementActive(db, 11001); // +10.001s, past the 10s TTL
    expect(db.calls).toBe(2);
  });

  it('_resetEnforcementCache() forces a fresh query even at the same `now`', async () => {
    const db = makeFakeDb({ row: { value: 'off' } });
    await isEnforcementActive(db, 1000);
    _resetEnforcementCache();
    await isEnforcementActive(db, 1000);
    expect(db.calls).toBe(2);
  });

  it('cache is shared across callers regardless of DB instance passed in (single global flag)', async () => {
    const dbA = makeFakeDb({ row: { value: 'off' } });
    const dbB = makeFakeDb({ row: { value: 'on' } }); // would resolve true if actually queried
    const first = await isEnforcementActive(dbA, 1000);
    const second = await isEnforcementActive(dbB, 2000); // within TTL — cache wins, dbB never queried
    expect(first).toBe(false);
    expect(second).toBe(false);
    expect(dbB.calls).toBe(0);
  });
});

/**
 * Flush mutex state machine — regression test for the UUID-race bug.
 *
 * The live bug (fixed in commit 1daf33c): rapid enqueue() calls during
 * quiz completion triggered N concurrent flushQueue() calls, each pulling
 * the same ops and POSTing duplicate UUIDs. `processed_operations` has a
 * PRIMARY KEY on operation_uuid, so the second POST failed — and because
 * D1 batches are atomic, the whole batch (including pp_transactions etc.)
 * rolled back.
 *
 * The mutex lives in a module-level Map keyed by userName so it survives
 * StrictMode remounts. This test exercises the state machine directly,
 * modeling the contract the real flushQueue uses:
 *
 *   if (state.flushing) { state.pending = true; return; }
 *   state.flushing = true;
 *   try { ...work... } finally { state.flushing = false; }
 *   if (state.pending || workRemaining) re-drain;
 *
 * If anyone refactors flushState away (inline it back into the hook, swap
 * to useRef, etc.), these tests fail — which is the point.
 */

import {
  flushState,
  getFlushState,
  _resetFlushStateForTests,
} from '../../hooks/useD1Data';

beforeEach(() => {
  _resetFlushStateForTests();
});

describe('flushState module-level mutex', () => {
  it('returns the same state object for repeated calls with the same userName', () => {
    const a = getFlushState('Alice');
    const b = getFlushState('Alice');
    expect(a).toBe(b); // same reference — required for mutex semantics
  });

  it('keeps state separate per userName', () => {
    const alice = getFlushState('Alice');
    const bob = getFlushState('Bob');
    expect(alice).not.toBe(bob);

    alice.flushing = true;
    expect(bob.flushing).toBe(false); // independent children never block each other
  });

  it('starts with flushing=false and pending=false', () => {
    const state = getFlushState('NewUser');
    expect(state.flushing).toBe(false);
    expect(state.pending).toBe(false);
  });

  it('survives simulated unmount/remount (module-level persistence)', () => {
    // Caller 1 (first hook mount) acquires lock
    const firstMount = getFlushState('Ben');
    firstMount.flushing = true;

    // Caller 2 (StrictMode double-mount, or user navigation remount)
    // sees THE SAME state — it doesn't get a fresh flushing=false.
    const secondMount = getFlushState('Ben');
    expect(secondMount.flushing).toBe(true);
    expect(secondMount).toBe(firstMount);
  });

  it('contract: second caller marks pending and bails while first is in flight', async () => {
    // Simulate the exact sequence inside flushQueue
    const runFlush = async (userName, work) => {
      const state = getFlushState(userName);
      if (state.flushing) {
        state.pending = true;
        return 'deferred';
      }
      state.flushing = true;
      try {
        await work();
      } finally {
        state.flushing = false;
      }
      if (state.pending) {
        state.pending = false;
        return 'should-redrain';
      }
      return 'done';
    };

    let inFlight = 0;
    let maxInFlight = 0;
    const work = () => new Promise(resolve => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      setTimeout(() => { inFlight--; resolve(); }, 10);
    });

    // Fire 10 concurrent flushes for the same user
    const results = await Promise.all(
      Array.from({ length: 10 }, () => runFlush('ConcurrentUser', work))
    );

    // Critical invariant: only ONE flush is ever in flight at a time.
    // If the mutex is broken, maxInFlight would be 10.
    expect(maxInFlight).toBe(1);

    // Exactly one caller gets to actually run the work first time.
    const completed = results.filter(r => r === 'done' || r === 'should-redrain').length;
    const deferred = results.filter(r => r === 'deferred').length;
    expect(completed).toBe(1);
    expect(deferred).toBe(9);

    // The first caller sees pending=true on exit (others signaled).
    // Our return tells us so: the completed caller returns 'should-redrain'.
    expect(results[0]).toBe('should-redrain');

    // After first flush exits, pending is cleared so the re-drain cycle can
    // pick up the remaining queued work without accumulating stale signals.
    const state = getFlushState('ConcurrentUser');
    expect(state.pending).toBe(false);
  });

  it('_resetFlushStateForTests clears specific user or all users', () => {
    getFlushState('User1').flushing = true;
    getFlushState('User2').pending = true;

    _resetFlushStateForTests('User1');
    expect(flushState.has('User1')).toBe(false);
    expect(flushState.has('User2')).toBe(true);
    expect(getFlushState('User2').pending).toBe(true); // untouched

    _resetFlushStateForTests(); // clear all
    expect(flushState.size).toBe(0);
  });
});

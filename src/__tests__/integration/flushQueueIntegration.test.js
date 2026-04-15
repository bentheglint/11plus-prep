/**
 * Integration test — exercises the REAL useD1Data flushQueue with mocked
 * fetch. Complements the state-machine unit test (flushMutex.test.js) by
 * catching refactors that would keep `getFlushState` intact while breaking
 * the actual flush loop.
 *
 * REACT_APP_TUTOR_API_URL is set to 'http://test-worker.local' in
 * setupTests.js so useD1Data's API_URL const has a value. This test mocks
 * global fetch to serve the two endpoints the hook hits during flush.
 *
 * Two assertions:
 *   1. Mutex — given N rapid enqueue() calls, at most one POST /api/data/batch
 *      is in flight at any moment.
 *   2. Child-switch — changing userName synchronously clears prior state
 *      so no render frame can ever leak a previous child's data
 *      (Codex adversarial review BLOCKER — child-safety).
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import useD1Data, { _resetFlushStateForTests } from '../../hooks/useD1Data';

describe('flushQueue — real hook integration', () => {
  const USER = 'MutexIntegrationUser';

  let tracker;
  let originalFetch;

  beforeEach(() => {
    localStorage.clear();
    _resetFlushStateForTests(USER);
    _resetFlushStateForTests('BenChild');
    _resetFlushStateForTests('EvieChild');

    tracker = { inFlight: 0, maxInFlight: 0, batchCalls: 0 };

    originalFetch = global.fetch;
    global.fetch = jest.fn(async (url, opts) => {
      if (url.endsWith('/api/data/all')) {
        return {
          ok: true,
          json: async () => ({
            quizResults: [], mockTestResults: [], questionResults: [],
            topicPerformance: [], leitnerQueue: [], lessonHistory: [],
            seenQuestions: [], practiceSessions: [], achievements: [],
            seenTips: [], streaks: null, prepPoints: null, preferences: null,
            migration: null,
          }),
        };
      }
      if (url.endsWith('/api/data/batch')) {
        tracker.inFlight++;
        tracker.maxInFlight = Math.max(tracker.maxInFlight, tracker.inFlight);
        tracker.batchCalls++;
        await new Promise(resolve => setTimeout(resolve, 20));
        tracker.inFlight--;

        const body = JSON.parse(opts.body);
        const results = body.operations.map(op => ({ uuid: op.uuid, status: 'ok' }));
        return {
          ok: true,
          json: async () => ({
            ok: true, processed: results.length, skipped: 0,
            conflicts: [], versions: {}, results,
          }),
        };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('serialises concurrent enqueue() calls — at most one batch POST in flight', async () => {
    const getToken = async () => 'test-token';
    const { result } = renderHook(() => useD1Data(USER, getToken));

    await waitFor(() => expect(result.current.loaded).toBe(true), { timeout: 3000 });

    // Rapid-fire enqueue — models quiz-completion behavior that caused the
    // UUID-race bug before the mutex was added.
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.enqueue('seen-question', {
          questionId: 1000 + i, topicKey: 'percentages', subject: 'maths',
        });
      }
    });

    await waitFor(() => expect(tracker.inFlight).toBe(0), { timeout: 3000 });

    // The assertion that fails if the mutex is gone
    expect(tracker.maxInFlight).toBe(1);
    expect(tracker.batchCalls).toBeGreaterThan(0);
  });

  it('child switch clears previous user\'s state synchronously (no stale-data flash)', async () => {
    // Codex BLOCKER: useD1Data resets its own hook state on userName change;
    // anything leaking into the first render frame of the new child is a
    // child-safety failure. This test locks that contract.

    const getToken = async () => 'test-token';

    let currentChild = 'BenChild';
    global.fetch = jest.fn(async (url) => {
      if (url.endsWith('/api/data/all')) {
        return {
          ok: true,
          json: async () => ({
            quizResults: [{
              completed_at: '2026-04-14 10:00:00',
              topic_key: currentChild + '-topic',
              subject: 'maths', score: 5, total: 10,
            }],
            mockTestResults: [], questionResults: [], topicPerformance: [],
            leitnerQueue: [], lessonHistory: [], seenQuestions: [],
            practiceSessions: [], achievements: [], seenTips: [],
            streaks: null, prepPoints: null, preferences: null,
            migration: null,
          }),
        };
      }
      return { ok: true, json: async () => ({ ok: true, results: [] }) };
    });

    const { result, rerender } = renderHook(
      ({ user }) => useD1Data(user, getToken),
      { initialProps: { user: 'BenChild' } }
    );
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.quizHistory[0]?.topic).toBe('BenChild-topic');

    // Switch child — server will now return Evie's row on refetch
    currentChild = 'EvieChild';
    rerender({ user: 'EvieChild' });

    // By the time React commits the rerender, Ben's data MUST be cleared.
    // No stale rows, no stale loaded=true flag.
    expect(result.current.quizHistory).toEqual([]);
    expect(result.current.loaded).toBe(false);

    // Evie's async load settles
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.quizHistory[0]?.topic).toBe('EvieChild-topic');
  });

  it('logout (userName → empty) clears previous user\'s state', async () => {
    // Codex BLOCKER #2: logout must reset hook state, not bail out with
    // prior child data still resident. The previous `if (!userName) return;`
    // early-bail left Ben's data sitting in memory after logout.
    const getToken = async () => 'test-token';

    const { result, rerender } = renderHook(
      ({ user }) => useD1Data(user, getToken),
      { initialProps: { user: 'LoggedInUser' } }
    );
    await waitFor(() => expect(result.current.loaded).toBe(true));

    // Logout — userName becomes empty string (as App.js sets it)
    rerender({ user: '' });

    // Hook state must be reset synchronously, not retained from the prior user.
    expect(result.current.quizHistory).toEqual([]);
    expect(result.current.questionResults).toEqual([]);
    expect(result.current.streakData.currentStreak).toBe(0);
    // `loaded` flips back to true after the logout path (nothing to load).
    await waitFor(() => expect(result.current.loaded).toBe(true));
  });
});

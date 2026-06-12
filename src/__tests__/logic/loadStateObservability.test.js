/**
 * Offline-fallback observability tests.
 *
 * Covers the load-state and error-reporting behaviours introduced for the
 * offline-fallback observability feature:
 *
 * 1. 5xx response + cache present  → loadState 'cache'; data from cache.
 * 2. 5xx + NO cache                → loadState 'failed-no-cache'.
 * 3. 200 response                  → loadState 'server'; banner flags clear.
 * 4. Failure then retryLoad()      → loadState 'server' with fresh data.
 * 5. 4xx (e.g. 403)               → loadState is NOT 'cache'/'failed-no-cache'.
 * 6. reportError fired exactly once on first 5xx; not on 200; sessionStorage
 *    dedup prevents a second call in the same session.
 * 7. OfflineDataBanner: correct copy per state, nothing on 'server', Try
 *    again calls onRetry.
 */

// ── Sentry mock (useD1Data → syncQueue imports Sentry) ──
jest.mock('@sentry/react', () => ({
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));

import { renderHook, act, waitFor } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import useD1Data, { _resetFlushStateForTests } from '../../hooks/useD1Data';
import * as ErrorBoundary from '../../components/ErrorBoundary';
import OfflineDataBanner from '../../components/OfflineDataBanner';

// ── Constants ──
const TEST_API_URL = 'https://api.test';
const MOCK_TOKEN = 'mock-token';
const getToken = async () => MOCK_TOKEN;

// Minimal valid server payload that transformServerData can process without error
const VALID_SERVER_DATA = {
  quizResults: [{ topic_key: 'percentages', subject: 'maths', score: 7, total: 10, completed_at: '2026-06-01T10:00:00Z', session_id: null }],
  mockTestResults: [],
  questionResults: [],
  topicPerformance: [],
  leitnerQueue: [],
  seenQuestions: [],
  practiceSessions: [],
  achievements: [],
  seenTips: [],
  streaks: { current_streak: 3, longest_streak: 5, last_quiz_date: '2026-06-01', streak_history: [] },
  prepPoints: { total: 100, level: 2, today_pp: 10, today_date: '2026-06-01' },
  preferences: { last_session_date: '2026-06-01' },
  lessonHistory: [],
};

// A different payload for the retry test (so we can tell old from fresh)
const FRESH_SERVER_DATA = {
  ...VALID_SERVER_DATA,
  quizResults: [{ topic_key: 'algebra', subject: 'maths', score: 9, total: 10, completed_at: '2026-06-02T10:00:00Z', session_id: null }],
};

// ── Helpers ──

/** Write VALID_SERVER_DATA into the d1 cache localStorage key */
function writeCacheFor(userName) {
  localStorage.setItem(`d1-cache:${userName}`, JSON.stringify(VALID_SERVER_DATA));
}

/** Create a fetch mock that responds with a given status code once, then never again */
function fetchReturning(status, body = null) {
  return jest.fn(async () => {
    if (status >= 200 && status < 300) {
      return { ok: true, status, json: async () => body };
    }
    return {
      ok: false,
      status,
      json: async () => ({}),
    };
  });
}

/** Flush all pending microtasks and tick timers */
async function flush(n = 10) {
  for (let i = 0; i < n; i++) await Promise.resolve();
}

// ── Setup / teardown ──

const realFetch = global.fetch;

beforeEach(() => {
  // Reset module-level state in ErrorBoundary that accumulates across tests.
  // We do this by resetting the module so reportCount and seenErrors start fresh.
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
  process.env.REACT_APP_TUTOR_API_URL = TEST_API_URL;
  _resetFlushStateForTests(null);
});

afterEach(() => {
  global.fetch = realFetch;
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────
// 1. 5xx response + cache present → loadState 'cache'
// ─────────────────────────────────────────────

describe('5xx with cache present', () => {
  it('sets loadState to "cache" and populates state from cache', async () => {
    writeCacheFor('Alice');
    global.fetch = fetchReturning(503);

    const { result } = renderHook(() =>
      useD1Data('Alice', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).toBe('cache');
    // Cache has a quiz result for percentages
    expect(result.current.quizHistory.length).toBeGreaterThan(0);
    expect(result.current.quizHistory[0].topic).toBe('percentages');
  });
});

// ─────────────────────────────────────────────
// 2. 5xx + NO cache → loadState 'failed-no-cache'
// ─────────────────────────────────────────────

describe('5xx with no cache', () => {
  it('sets loadState to "failed-no-cache" when no cache or legacy data exists', async () => {
    // Ensure no cache and no legacy data
    global.fetch = fetchReturning(500);

    const { result } = renderHook(() =>
      useD1Data('NewUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).toBe('failed-no-cache');
  });
});

// ─────────────────────────────────────────────
// 3. 200 response → loadState 'server'
// ─────────────────────────────────────────────

describe('200 response', () => {
  it('sets loadState to "server" on a successful fetch', async () => {
    global.fetch = fetchReturning(200, VALID_SERVER_DATA);

    const { result } = renderHook(() =>
      useD1Data('Alice', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).toBe('server');
  });

  it('loadState is "server" — not "cache" or "failed-no-cache"', async () => {
    global.fetch = fetchReturning(200, VALID_SERVER_DATA);
    const { result } = renderHook(() => useD1Data('Alice', getToken, null));
    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).not.toBe('cache');
    expect(result.current.loadState).not.toBe('failed-no-cache');
  });
});

// ─────────────────────────────────────────────
// 4. Failure then successful retryLoad() → 'server' with fresh data
// ─────────────────────────────────────────────

describe('retryLoad() after failure', () => {
  it('transitions loadState from "failed-no-cache" to "server" on successful retry', async () => {
    // First call: 5xx (no cache — no legacy data)
    let callCount = 0;
    global.fetch = jest.fn(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: false, status: 503, json: async () => ({}) };
      }
      // Subsequent calls: success
      return { ok: true, status: 200, json: async () => FRESH_SERVER_DATA };
    });

    const { result } = renderHook(() =>
      useD1Data('RetryUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.loadState).toBe('failed-no-cache');

    act(() => {
      result.current.retryLoad();
    });

    await waitFor(() => expect(result.current.loadState).toBe('server'));

    // State should reflect the fresh data from the retry
    expect(result.current.quizHistory.length).toBeGreaterThan(0);
    expect(result.current.quizHistory[0].topic).toBe('algebra');
  });
});

// ─────────────────────────────────────────────
// 5. 4xx → loadState is NOT 'cache' / 'failed-no-cache'
// ─────────────────────────────────────────────

describe('4xx response', () => {
  it('does not set loadState to "cache" or "failed-no-cache" on 403', async () => {
    // Even if there is cached data, a 4xx should not trigger fallback banner states
    writeCacheFor('Alice');
    global.fetch = fetchReturning(403);

    const { result } = renderHook(() =>
      useD1Data('Alice', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).not.toBe('cache');
    expect(result.current.loadState).not.toBe('failed-no-cache');
  });

  it('does not set loadState to "cache" or "failed-no-cache" on 401', async () => {
    global.fetch = fetchReturning(401);

    const { result } = renderHook(() =>
      useD1Data('Alice', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.loadState).not.toBe('cache');
    expect(result.current.loadState).not.toBe('failed-no-cache');
  });
});

// ─────────────────────────────────────────────
// 6. reportError: fire-once-per-session semantics
// ─────────────────────────────────────────────

describe('reportError observability', () => {
  let reportErrorSpy;

  beforeEach(() => {
    // Spy on the exported reportError from ErrorBoundary.
    // We do NOT mock the whole module — we want the real dedup logic to run.
    // However, we prevent actual fetch calls inside reportError by ensuring
    // API_URL is set and the fetch mock captures them.
    reportErrorSpy = jest.spyOn(ErrorBoundary, 'reportError');
    sessionStorage.clear();
  });

  afterEach(() => {
    reportErrorSpy.mockRestore();
  });

  it('fires reportError with failureClass on first 5xx fallback (no cache)', async () => {
    global.fetch = fetchReturning(503);

    const { result } = renderHook(() =>
      useD1Data('ObsUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.loadState).toBe('failed-no-cache');

    expect(reportErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Load-path fallback') }),
      expect.objectContaining({
        source: 'load-path-fallback',
        failureClass: 'http-5xx',
      })
    );
  });

  it('fires reportError with failureClass "http-5xx" on 5xx with cache', async () => {
    writeCacheFor('ObsUserCached');
    global.fetch = fetchReturning(503);

    const { result } = renderHook(() =>
      useD1Data('ObsUserCached', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.loadState).toBe('cache');

    expect(reportErrorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        source: 'load-path-fallback',
        failureClass: 'http-5xx',
      })
    );
  });

  it('does NOT fire reportError on a successful 200', async () => {
    global.fetch = fetchReturning(200, VALID_SERVER_DATA);

    const { result } = renderHook(() =>
      useD1Data('OkUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.loadState).toBe('server');

    // reportError must not have been called with 'load-path-fallback'
    const fallbackCalls = reportErrorSpy.mock.calls.filter(
      ([, ctx]) => ctx?.source === 'load-path-fallback'
    );
    expect(fallbackCalls).toHaveLength(0);
  });

  it('does NOT fire reportError on 4xx (not a fallback situation)', async () => {
    global.fetch = fetchReturning(403);

    const { result } = renderHook(() =>
      useD1Data('AuthUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    const fallbackCalls = reportErrorSpy.mock.calls.filter(
      ([, ctx]) => ctx?.source === 'load-path-fallback'
    );
    expect(fallbackCalls).toHaveLength(0);
  });

  it('deduplicates: second 5xx in same session does NOT fire reportError again', async () => {
    // Seed the sessionStorage key that the dedup uses
    sessionStorage.setItem('load-fallback-reported:http-5xx', '1');

    global.fetch = fetchReturning(503);

    const { result } = renderHook(() =>
      useD1Data('DedupUser', getToken, null)
    );

    await waitFor(() => expect(result.current.loaded).toBe(true));

    // reportError should NOT have been called — sessionStorage key was already set
    const fallbackCalls = reportErrorSpy.mock.calls.filter(
      ([, ctx]) => ctx?.source === 'load-path-fallback'
    );
    expect(fallbackCalls).toHaveLength(0);
  });

  it('first call fires; clearing sessionStorage and re-loading fires again (new session)', async () => {
    global.fetch = fetchReturning(503);

    const { result: result1 } = renderHook(() =>
      useD1Data('SessionUser1', getToken, null)
    );
    await waitFor(() => expect(result1.current.loaded).toBe(true));

    const firstCallCount = reportErrorSpy.mock.calls.filter(
      ([, ctx]) => ctx?.source === 'load-path-fallback'
    ).length;
    expect(firstCallCount).toBeGreaterThanOrEqual(1);

    // Simulate a new session: clear sessionStorage
    sessionStorage.clear();
    reportErrorSpy.mockClear();

    global.fetch = fetchReturning(503);

    const { result: result2 } = renderHook(() =>
      useD1Data('SessionUser2', getToken, null)
    );
    await waitFor(() => expect(result2.current.loaded).toBe(true));

    const secondCallCount = reportErrorSpy.mock.calls.filter(
      ([, ctx]) => ctx?.source === 'load-path-fallback'
    ).length;
    expect(secondCallCount).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────
// 7. OfflineDataBanner component
// ─────────────────────────────────────────────

describe('OfflineDataBanner', () => {
  it('renders "Showing saved progress" heading for loadState "cache"', () => {
    render(<OfflineDataBanner loadState="cache" onRetry={() => {}} />);
    expect(screen.getByText('Showing saved progress')).toBeInTheDocument();
  });

  it('renders "We couldn\'t load your progress" heading for loadState "failed-no-cache"', () => {
    render(<OfflineDataBanner loadState="failed-no-cache" onRetry={() => {}} />);
    expect(screen.getByText("We couldn't load your progress")).toBeInTheDocument();
  });

  it('renders nothing for loadState "server"', () => {
    const { container } = render(<OfflineDataBanner loadState="server" onRetry={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when loadState is null', () => {
    const { container } = render(<OfflineDataBanner loadState={null} onRetry={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onRetry when "Try again" button is clicked', () => {
    const onRetry = jest.fn();
    render(<OfflineDataBanner loadState="cache" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows "Trying…" label on the button immediately after click', () => {
    // Use a never-resolving onRetry to keep the retrying state active
    render(<OfflineDataBanner loadState="failed-no-cache" onRetry={() => new Promise(() => {})} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByRole('button')).toHaveTextContent('Trying…');
  });

  it('disables the button while retrying', () => {
    render(<OfflineDataBanner loadState="cache" onRetry={() => new Promise(() => {})} />);
    const btn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  it('renders the "cache" body copy about internet connection', () => {
    render(<OfflineDataBanner loadState="cache" onRetry={() => {}} />);
    expect(screen.getByText(/everything you do still counts/i)).toBeInTheDocument();
  });

  it('renders the "failed-no-cache" body copy about checking connection', () => {
    render(<OfflineDataBanner loadState="failed-no-cache" onRetry={() => {}} />);
    expect(screen.getByText(/check the internet connection/i)).toBeInTheDocument();
  });
});

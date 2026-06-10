/**
 * Load-path fetch timeout tests.
 *
 * A HANGING fetch (e.g. iOS radio recovery after airplane mode) used to leave
 * loadData stuck forever — apiFetch only returned null on *failure*, so the
 * cache fallback never ran and the user saw a blank screen. apiFetch now
 * aborts via a manual AbortController (NOT AbortSignal.timeout — browser
 * floor is Safari 15.6) and returns null, which sends loadData down the
 * cache-fallback path.
 */

// Sentry mock (useD1Data → syncQueue imports Sentry)
jest.mock('@sentry/react', () => ({
  captureMessage: jest.fn(),
}));

describe('apiFetch timeout', () => {
  const realFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    process.env.REACT_APP_TUTOR_API_URL = 'https://api.test';
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = realFetch;
  });

  function loadApiFetch() {
    // resetModules + require so the module-level API_URL picks up the env var
    return require('../../hooks/useD1Data').apiFetch;
  }

  // A fetch that never resolves on its own — only rejects when aborted,
  // mirroring real fetch behaviour with an AbortSignal.
  function hangingFetch() {
    return jest.fn((url, { signal } = {}) =>
      new Promise((resolve, reject) => {
        if (signal) {
          signal.addEventListener('abort', () =>
            reject(new DOMException('The operation was aborted.', 'AbortError'))
          );
        }
      })
    );
  }

  async function flushMicrotasks(n = 5) {
    for (let i = 0; i < n; i++) await Promise.resolve();
  }

  it('aborts a hanging fetch after the timeout and returns null', async () => {
    const apiFetch = loadApiFetch();
    global.fetch = hangingFetch();

    const promise = apiFetch('/api/data/all', async () => 'token');
    await flushMicrotasks(); // let the getToken await settle so fetch is called
    expect(global.fetch).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(10000); // default API_FETCH_TIMEOUT_MS
    await expect(promise).resolves.toBeNull();
  });

  it('passes an AbortSignal to fetch', async () => {
    const apiFetch = loadApiFetch();
    global.fetch = hangingFetch();

    const promise = apiFetch('/api/data/all', async () => 'token');
    await flushMicrotasks();

    const [, options] = global.fetch.mock.calls[0];
    expect(options.signal).toBeInstanceOf(AbortSignal);

    jest.advanceTimersByTime(10000);
    await promise;
  });

  it('respects a custom timeout', async () => {
    const apiFetch = loadApiFetch();
    global.fetch = hangingFetch();

    const promise = apiFetch('/api/data/all', async () => 'token', 2000);
    await flushMicrotasks();

    jest.advanceTimersByTime(1999);
    await flushMicrotasks();
    // Not yet aborted — fetch mock still pending, promise unresolved
    let settled = false;
    promise.then(() => { settled = true; });
    await flushMicrotasks();
    expect(settled).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(promise).resolves.toBeNull();
  });

  it('returns parsed JSON when fetch resolves before the timeout', async () => {
    const apiFetch = loadApiFetch();
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ hello: 'world' }),
    }));

    const promise = apiFetch('/api/data/all', async () => 'token');
    await flushMicrotasks();
    await expect(promise).resolves.toEqual({ hello: 'world' });
  });

  it('still returns null on a non-OK response', async () => {
    const apiFetch = loadApiFetch();
    global.fetch = jest.fn(async () => ({ ok: false, status: 500 }));

    const promise = apiFetch('/api/data/all', async () => 'token');
    await flushMicrotasks();
    await expect(promise).resolves.toBeNull();
  });
});

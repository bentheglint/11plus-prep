/**
 * Tests for the coverage sync queue — the fix for "KV PUT failed: 429".
 * Marks made in quick succession (or the multi-topic delta upload on mount)
 * must coalesce into ONE batched request, because every request costs a
 * write to the same KV key (limit ~1/second).
 */
import { createCoverageSyncQueue } from '../../utils/coverageSyncQueue';

function okResponse() {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
}

// Jest 27 (react-scripts 5) has no advanceTimersByTimeAsync — advance the
// mocked clock, then drain the microtask queue so the async flush settles.
async function advance(ms) {
  jest.advanceTimersByTime(ms);
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe('coverageSyncQueue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('coalesces rapid marks across types and topics into one request', async () => {
    const fetchFn = jest.fn(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('questions', 'fractions', [1]);
    q.add('questions', 'fractions', [2]);
    q.add('questions', 'algebra', [7]);
    q.add('lessons', 'fractions', ['equiv-1']);

    expect(fetchFn).not.toHaveBeenCalled();
    await advance(3000);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchFn.mock.calls[0][1].body);
    expect(body.marks).toEqual(expect.arrayContaining([
      { type: 'questions', topicKey: 'fractions', ids: [1, 2] },
      { type: 'questions', topicKey: 'algebra', ids: [7] },
      { type: 'lessons', topicKey: 'fractions', ids: ['equiv-1'] },
    ]));
    expect(body.marks).toHaveLength(3);
  });

  it('deduplicates ids queued twice before the flush', async () => {
    const fetchFn = jest.fn(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('questions', 'fractions', [1, 2]);
    q.add('questions', 'fractions', [2, 3]);
    await advance(3000);

    const body = JSON.parse(fetchFn.mock.calls[0][1].body);
    expect(body.marks[0].ids).toEqual([1, 2, 3]);
  });

  it('restarts the debounce window on each add', async () => {
    const fetchFn = jest.fn(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('questions', 'fractions', [1]);
    await advance(2000);
    q.add('questions', 'fractions', [2]);
    await advance(2000);
    expect(fetchFn).not.toHaveBeenCalled();

    await advance(1000);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('requeues marks when the request fails, and retries on the next flush', async () => {
    const fetchFn = jest.fn()
      .mockImplementationOnce(() => Promise.reject(new Error('network')))
      .mockImplementation(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('questions', 'fractions', [1]);
    await advance(3000);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Failure kept the ids — a later mark triggers a flush containing both
    q.add('questions', 'algebra', [9]);
    await advance(3000);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    const body = JSON.parse(fetchFn.mock.calls[1][1].body);
    expect(body.marks).toEqual(expect.arrayContaining([
      { type: 'questions', topicKey: 'fractions', ids: [1] },
      { type: 'questions', topicKey: 'algebra', ids: [9] },
    ]));
  });

  it('requeues marks on a 429 response (rate-limited server)', async () => {
    const fetchFn = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ ok: false, status: 429, json: () => Promise.resolve({}) }))
      .mockImplementation(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('lessons', 'volume', ['v1']);
    await advance(3000);

    q.add('lessons', 'volume', ['v2']);
    await advance(3000);
    const body = JSON.parse(fetchFn.mock.calls[1][1].body);
    expect(body.marks[0].ids).toEqual(['v1', 'v2']);
  });

  it('flushNow sends immediately and clears the timer', async () => {
    const fetchFn = jest.fn(okResponse);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });

    q.add('questions', 'ratio', [4]);
    q.flushNow();
    // microtask drain without advancing the clock
    await advance(0);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    await advance(5000);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('does nothing without an apiUrl or with empty ids', async () => {
    const fetchFn = jest.fn(okResponse);
    const noUrl = createCoverageSyncQueue({ apiUrl: '', fetchFn, flushDelayMs: 3000 });
    noUrl.add('questions', 'fractions', [1]);
    const q = createCoverageSyncQueue({ apiUrl: 'https://w', fetchFn, flushDelayMs: 3000 });
    q.add('questions', 'fractions', []);
    await advance(4000);
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

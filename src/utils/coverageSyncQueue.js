// Batched sync queue for testing-coverage marks.
//
// Every /testing-coverage/mark request costs one write to a single shared KV
// key, and Cloudflare KV allows roughly one write per second per key. Firing
// a request per mark (or per topic on the mount delta-upload) caused
// "KV PUT failed: 429" and a last-writer-wins race between concurrent
// requests. This queue coalesces all pending marks into ONE request,
// debounced, with failed batches retained for the next flush.

export function createCoverageSyncQueue({ apiUrl, fetchFn = fetch, flushDelayMs = 3000 }) {
  // 'type|topicKey' → Set of ids
  const pending = new Map();
  let timer = null;
  let getTokenFn = null;

  function keyFor(type, topicKey) {
    return `${type}|${topicKey}`;
  }

  function buildMarks() {
    return [...pending.entries()].map(([key, ids]) => {
      const [type, topicKey] = key.split('|');
      return { type, topicKey, ids: [...ids] };
    });
  }

  function requeue(marks) {
    for (const { type, topicKey, ids } of marks) {
      const key = keyFor(type, topicKey);
      const set = pending.get(key) || new Set();
      ids.forEach(id => set.add(id));
      pending.set(key, set);
    }
  }

  async function flush() {
    timer = null;
    if (!apiUrl || pending.size === 0) return;
    const marks = buildMarks();
    pending.clear();
    try {
      const token = getTokenFn ? await getTokenFn() : null;
      const res = await fetchFn(`${apiUrl}/testing-coverage/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // keepalive lets a flush triggered by tab-hide complete in flight
        keepalive: true,
        body: JSON.stringify({ marks }),
      });
      if (!res.ok) requeue(marks);
    } catch {
      requeue(marks);
    }
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, flushDelayMs);
  }

  return {
    setGetToken(fn) { getTokenFn = fn; },
    add(type, topicKey, ids) {
      if (!apiUrl || !ids || ids.length === 0) return;
      const key = keyFor(type, topicKey);
      const set = pending.get(key) || new Set();
      ids.forEach(id => set.add(id));
      pending.set(key, set);
      schedule();
    },
    flushNow() {
      if (timer) clearTimeout(timer);
      return flush();
    },
  };
}

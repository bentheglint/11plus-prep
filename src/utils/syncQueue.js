// SyncQueue — offline write queue for D1-first architecture
// Stores pending operations in localStorage, replays when online.
// Namespaced per child to prevent cross-user contamination.

import * as Sentry from '@sentry/react';

const MAX_QUEUE_SIZE = 500;
const QUEUE_PREFIX = 'sync-queue:';
const DEAD_LETTER_PREFIX = 'sync-dead-letter:';
const MAX_DEAD_LETTER = 100;
const AGE_OUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// UUID generation — use crypto.randomUUID() in browsers, fallback for test environments
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122 v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getKey(childId) {
  return `${QUEUE_PREFIX}${childId}`;
}

function getDeadLetterKey(childId) {
  return `${DEAD_LETTER_PREFIX}${childId}`;
}

function readQueue(childId) {
  try {
    const raw = localStorage.getItem(getKey(childId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Find the d1-cache key pattern so writeQueue can evict it on QuotaExceededError
function findCacheKey() {
  // Cache keys follow pattern d1-cache:${userName} — find any matching key
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('d1-cache:')) return k;
  }
  return null;
}

function writeQueue(childId, queue) {
  const key = getKey(childId);
  const serialised = JSON.stringify(queue);
  try {
    localStorage.setItem(key, serialised);
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      // Evict the d1-cache entry (offline fallback, can be re-fetched) and retry once
      const cacheKey = findCacheKey();
      if (cacheKey) {
        try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }
        try {
          localStorage.setItem(key, serialised);
          return; // retry succeeded
        } catch { /* fall through to error report */ }
      }
      // Still failing — report and bail without throwing (quiz completion must not crash)
      console.error('[SyncQueue] QuotaExceededError: could not write queue after cache eviction');
      try {
        Sentry.captureMessage('[SyncQueue] QuotaExceededError persisted after cache eviction', {
          level: 'error',
          extra: { childId, queueLength: queue.length },
        });
      } catch { /* never throw from error reporting */ }
    } else {
      throw err; // unexpected error, let it propagate
    }
  }
}

function readDeadLetter(childId) {
  try {
    const raw = localStorage.getItem(getDeadLetterKey(childId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Move an op to the dead-letter store and report to Sentry.
 * Caps the dead-letter store at MAX_DEAD_LETTER entries (evicts oldest first).
 * Reports to Sentry BEFORE eviction so a dropped op always has an off-device record.
 */
function deadLetter(childId, op, reason) {
  const entry = { ...op, deadLetteredAt: new Date().toISOString(), reason };

  // Report to Sentry first — before any potential eviction
  try {
    Sentry.captureMessage('[SyncQueue] Dead-lettered operation', {
      level: 'warning',
      extra: {
        uuid: op.uuid,
        type: op.type,
        childId: op.childId,
        createdAt: op.createdAt,
        ageMs: op.createdAt ? Date.now() - new Date(op.createdAt).getTime() : null,
        reason,
      },
    });
  } catch { /* never throw from error reporting */ }

  const store = readDeadLetter(childId);
  store.push(entry);

  // Evict oldest if over cap
  const trimmed = store.length > MAX_DEAD_LETTER ? store.slice(store.length - MAX_DEAD_LETTER) : store;
  try {
    localStorage.setItem(getDeadLetterKey(childId), JSON.stringify(trimmed));
  } catch {
    // Best-effort — the Sentry report above is the true safety net
  }
}

/**
 * Create a SyncQueue instance bound to a specific child.
 * All operations are tagged with the childId for safety.
 */
export function createSyncQueue(childId) {
  if (!childId) throw new Error('SyncQueue requires a childId');

  return {
    /**
     * Add an operation to the queue.
     * @param {string} type — operation type (e.g. 'question-result', 'streaks')
     * @param {object} payload — the data to send to the server
     * @returns {string} the generated UUID for this operation
     */
    enqueue(type, payload) {
      const uuid = generateUUID();
      const operation = {
        uuid,
        type,
        payload,
        childId,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };

      const queue = readQueue(childId);
      queue.push(operation);

      // Cap at MAX_QUEUE_SIZE — drop oldest if exceeded
      if (queue.length > MAX_QUEUE_SIZE) {
        const dropped = queue.length - MAX_QUEUE_SIZE;
        queue.splice(0, dropped);
        console.warn(`[SyncQueue] Dropped ${dropped} oldest operations (cap: ${MAX_QUEUE_SIZE})`);
      }

      writeQueue(childId, queue);
      return uuid;
    },

    /**
     * Return the oldest operations (up to limit), after age-outing stale ops.
     * Ops older than 7 days are moved to the dead-letter store.
     * Does NOT remove remaining ops — call remove() after server confirms.
     */
    peek(limit = 50) {
      const now = Date.now();
      const queue = readQueue(childId);

      // Separate stale ops from live ops
      const live = [];
      const stale = [];
      for (const op of queue) {
        const age = op.createdAt ? now - new Date(op.createdAt).getTime() : 0;
        if (age > AGE_OUT_MS) {
          stale.push(op);
        } else {
          live.push(op);
        }
      }

      // Age-out stale ops to dead-letter before returning live batch
      if (stale.length > 0) {
        for (const op of stale) {
          deadLetter(childId, op, 'age-out: op older than 7 days');
        }
        writeQueue(childId, live);
      }

      return live.slice(0, limit);
    },

    /**
     * Remove operations by UUID after successful server confirmation.
     */
    remove(uuids) {
      const uuidSet = new Set(uuids);
      const queue = readQueue(childId);
      const filtered = queue.filter(op => !uuidSet.has(op.uuid));
      writeQueue(childId, filtered);
    },

    /**
     * Increment retry count for specific operations (on transient failure).
     * retryCount is telemetry only — does NOT delete ops.
     */
    incrementRetries(uuids) {
      const uuidSet = new Set(uuids);
      const queue = readQueue(childId);
      const updated = queue.map(op =>
        uuidSet.has(op.uuid) ? { ...op, retryCount: op.retryCount + 1 } : op
      );
      writeQueue(childId, updated);
    },

    /**
     * Move ops with per-op server status 'error' to dead-letter store.
     * These are server-rejected (bad payload, invalid op) — retrying won't help.
     */
    deadLetterErrors(errorUuids, reason = 'server-rejected: per-op status was error') {
      const uuidSet = new Set(errorUuids);
      const queue = readQueue(childId);
      const live = [];
      for (const op of queue) {
        if (uuidSet.has(op.uuid)) {
          deadLetter(childId, op, reason);
        } else {
          live.push(op);
        }
      }
      writeQueue(childId, live);
    },

    /**
     * Check if the queue has any pending operations.
     */
    isEmpty() {
      return readQueue(childId).length === 0;
    },

    /**
     * Get all operations (for debugging).
     */
    getAll() {
      return readQueue(childId);
    },

    /**
     * Get the number of pending operations.
     */
    size() {
      return readQueue(childId).length;
    },

    /**
     * Clear all operations (for testing or emergency reset).
     */
    clear() {
      writeQueue(childId, []);
    },

    /**
     * Verify operations belong to this child before flushing.
     * Returns { valid, quarantined } arrays.
     */
    validateOwnership() {
      const queue = readQueue(childId);
      const valid = [];
      const quarantined = [];

      for (const op of queue) {
        if (op.childId === childId) {
          valid.push(op);
        } else {
          console.warn(`[SyncQueue] Quarantined operation ${op.uuid} — childId mismatch (expected ${childId}, got ${op.childId})`);
          quarantined.push(op);
        }
      }

      return { valid, quarantined };
    },

    /**
     * Read the dead-letter store (for debugging / admin UI).
     */
    getDeadLetters() {
      return readDeadLetter(childId);
    },
  };
}

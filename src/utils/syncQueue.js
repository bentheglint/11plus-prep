// SyncQueue — offline write queue for D1-first architecture
// Stores pending operations in localStorage, replays when online.
// Namespaced per child to prevent cross-user contamination.

const MAX_QUEUE_SIZE = 500;
const QUEUE_PREFIX = 'sync-queue:';

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

function readQueue(childId) {
  try {
    const raw = localStorage.getItem(getKey(childId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(childId, queue) {
  localStorage.setItem(getKey(childId), JSON.stringify(queue));
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
     * Return the oldest operations (up to limit).
     * Does NOT remove them — call remove() after server confirms.
     */
    peek(limit = 50) {
      const queue = readQueue(childId);
      return queue.slice(0, limit);
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
     * Drops operations that exceed maxRetries.
     */
    incrementRetries(uuids, maxRetries = 10) {
      const uuidSet = new Set(uuids);
      const queue = readQueue(childId);
      const updated = queue
        .map(op => uuidSet.has(op.uuid) ? { ...op, retryCount: op.retryCount + 1 } : op)
        .filter(op => op.retryCount <= maxRetries);
      writeQueue(childId, updated);
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
  };
}

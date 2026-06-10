import { createSyncQueue } from '../../utils/syncQueue';

describe('SyncQueue', () => {
  const CHILD_ID = 'child-abc-123';

  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a queue bound to a childId', () => {
    const queue = createSyncQueue(CHILD_ID);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('throws if no childId provided', () => {
    expect(() => createSyncQueue('')).toThrow('SyncQueue requires a childId');
    expect(() => createSyncQueue(null)).toThrow('SyncQueue requires a childId');
  });

  it('enqueues operations with UUID and childId', () => {
    const queue = createSyncQueue(CHILD_ID);
    const uuid = queue.enqueue('question-result', { questionId: 42, isCorrect: true });

    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^[0-9a-f-]{36}$/); // UUID format

    const ops = queue.getAll();
    expect(ops).toHaveLength(1);
    expect(ops[0]).toMatchObject({
      uuid,
      type: 'question-result',
      payload: { questionId: 42, isCorrect: true },
      childId: CHILD_ID,
      retryCount: 0,
    });
    expect(ops[0].createdAt).toBeDefined();
  });

  it('generates unique UUIDs for each operation', () => {
    const queue = createSyncQueue(CHILD_ID);
    const uuid1 = queue.enqueue('quiz-result', { score: 8 });
    const uuid2 = queue.enqueue('quiz-result', { score: 9 });
    expect(uuid1).not.toBe(uuid2);
  });

  it('peek returns oldest operations without removing them', () => {
    const queue = createSyncQueue(CHILD_ID);
    queue.enqueue('a', { n: 1 });
    queue.enqueue('b', { n: 2 });
    queue.enqueue('c', { n: 3 });

    const peeked = queue.peek(2);
    expect(peeked).toHaveLength(2);
    expect(peeked[0].type).toBe('a');
    expect(peeked[1].type).toBe('b');

    // Queue still has all 3
    expect(queue.size()).toBe(3);
  });

  it('remove deletes operations by UUID', () => {
    const queue = createSyncQueue(CHILD_ID);
    const uuid1 = queue.enqueue('a', {});
    const uuid2 = queue.enqueue('b', {});
    const uuid3 = queue.enqueue('c', {});

    queue.remove([uuid1, uuid3]);

    const remaining = queue.getAll();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].uuid).toBe(uuid2);
  });

  it('incrementRetries bumps retry count', () => {
    const queue = createSyncQueue(CHILD_ID);
    const uuid = queue.enqueue('streaks', { currentStreak: 5 });

    queue.incrementRetries([uuid]);
    expect(queue.getAll()[0].retryCount).toBe(1);

    queue.incrementRetries([uuid]);
    expect(queue.getAll()[0].retryCount).toBe(2);
  });

  it('incrementRetries keeps ops indefinitely — retryCount is telemetry only, never deletes', () => {
    // Spec change: ops are NEVER deleted on transient failure (section 1c).
    // retryCount is telemetry only. Age-out to dead-letter happens via peek()
    // after 7 days, not via retry count.
    const queue = createSyncQueue(CHILD_ID);
    const uuid = queue.enqueue('streaks', {});

    // Increment 100 times — op must still be in the queue
    for (let i = 0; i < 100; i++) {
      queue.incrementRetries([uuid]);
    }
    expect(queue.size()).toBe(1); // still in queue
    expect(queue.getAll()[0].retryCount).toBe(100); // telemetry count correct
  });

  it('caps at 500 operations, dropping oldest', () => {
    const queue = createSyncQueue(CHILD_ID);
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    for (let i = 0; i < 510; i++) {
      queue.enqueue('test', { i });
    }

    expect(queue.size()).toBe(500);
    // Oldest 10 were dropped (1 at a time, 10 warnings)
    expect(queue.getAll()[0].payload.i).toBe(10);
    expect(consoleSpy).toHaveBeenCalledTimes(10);

    consoleSpy.mockRestore();
  });

  it('persists across queue instances (simulates page reload)', () => {
    const queue1 = createSyncQueue(CHILD_ID);
    queue1.enqueue('quiz-result', { score: 10 });

    // Create new instance (simulates remount)
    const queue2 = createSyncQueue(CHILD_ID);
    expect(queue2.size()).toBe(1);
    expect(queue2.getAll()[0].type).toBe('quiz-result');
  });

  it('isolates queues between different children', () => {
    const queueA = createSyncQueue('child-A');
    const queueB = createSyncQueue('child-B');

    queueA.enqueue('a-op', { for: 'A' });
    queueB.enqueue('b-op', { for: 'B' });

    expect(queueA.size()).toBe(1);
    expect(queueB.size()).toBe(1);
    expect(queueA.getAll()[0].type).toBe('a-op');
    expect(queueB.getAll()[0].type).toBe('b-op');
  });

  it('validateOwnership identifies mismatched operations', () => {
    const queue = createSyncQueue(CHILD_ID);
    queue.enqueue('good-op', {});

    // Manually inject an operation with wrong childId (simulates corruption)
    const raw = JSON.parse(localStorage.getItem(`sync-queue:${CHILD_ID}`));
    raw.push({
      uuid: 'bad-uuid',
      type: 'bad-op',
      payload: {},
      childId: 'wrong-child',
      createdAt: new Date().toISOString(),
      retryCount: 0,
    });
    localStorage.setItem(`sync-queue:${CHILD_ID}`, JSON.stringify(raw));

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { valid, quarantined } = queue.validateOwnership();

    expect(valid).toHaveLength(1);
    expect(quarantined).toHaveLength(1);
    expect(quarantined[0].uuid).toBe('bad-uuid');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Quarantined'));

    consoleSpy.mockRestore();
  });

  it('clear removes all operations', () => {
    const queue = createSyncQueue(CHILD_ID);
    queue.enqueue('a', {});
    queue.enqueue('b', {});
    expect(queue.size()).toBe(2);

    queue.clear();
    expect(queue.isEmpty()).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(`sync-queue:${CHILD_ID}`, 'not-json');
    const queue = createSyncQueue(CHILD_ID);
    expect(queue.isEmpty()).toBe(true);
    // Should not throw — returns empty
  });
});

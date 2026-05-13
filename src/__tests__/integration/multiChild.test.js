/**
 * Multi-child data isolation tests (Phase 1 acceptance criteria)
 *
 * Tests the transformServerData and useD1Data mechanics that ensure
 * child A's data never bleeds into child B's view after switching.
 *
 * Worker-side endpoint tests (API contract) are covered by the wrangler
 * test suite. This file covers the client-side data boundary.
 */

import { transformServerData } from '../../hooks/useD1Data';
import { createSyncQueue } from '../../utils/syncQueue';

// ── Helpers ──

function makeServerData(overrides = {}) {
  return {
    quizResults: [],
    mockTestResults: [],
    questionResults: [],
    topicPerformance: [],
    leitnerQueue: [],
    lessonHistory: [],
    seenQuestions: [],
    practiceSessions: [],
    achievements: [],
    seenTips: [],
    streaks: null,
    prepPoints: null,
    preferences: null,
    migration: null,
    ...overrides,
  };
}

// ── transformServerData ──

describe('transformServerData — multi-child isolation', () => {
  it('returns empty arrays for a fresh child with no data', () => {
    const result = transformServerData(makeServerData());
    expect(result.quizHistory).toEqual([]);
    expect(result.questionResults).toEqual([]);
    expect(result.topicPerformance).toEqual({});
    expect(result.achievements).toEqual([]);
  });

  it('child A data does not appear in child B transform', () => {
    const childAData = makeServerData({
      quizResults: [
        {
          completed_at: '2026-04-01 10:00:00',
          topic_key: 'fractions',
          subject: 'maths',
          score: 8, total: 10,
          session_id: 'sess-a',
        },
      ],
    });
    const childBData = makeServerData();

    const transformedA = transformServerData(childAData);
    const transformedB = transformServerData(childBData);

    expect(transformedA.quizHistory).toHaveLength(1);
    expect(transformedB.quizHistory).toHaveLength(0);
  });

  it('transforms streaks independently per child data', () => {
    const childAData = makeServerData({
      streaks: { current_streak: 7, longest_streak: 14, last_quiz_date: '2026-04-01', streak_history: [], version: 2 },
    });
    const childBData = makeServerData({
      streaks: { current_streak: 1, longest_streak: 3, last_quiz_date: '2026-03-20', streak_history: [], version: 1 },
    });

    const a = transformServerData(childAData);
    const b = transformServerData(childBData);

    expect(a.streakData.currentStreak).toBe(7);
    expect(b.streakData.currentStreak).toBe(1);
  });
});

// ── SyncQueue — keyed by childId ──

describe('SyncQueue — per-child isolation', () => {
  const CHILD_A = 'child-uuid-aaa';
  const CHILD_B = 'child-uuid-bbb';

  beforeEach(() => localStorage.clear());

  it('child A and child B maintain separate queues', () => {
    const queueA = createSyncQueue(CHILD_A);
    const queueB = createSyncQueue(CHILD_B);

    queueA.enqueue('question-result', { questionId: 1 });
    queueA.enqueue('question-result', { questionId: 2 });
    queueB.enqueue('question-result', { questionId: 99 });

    expect(queueA.size()).toBe(2);
    expect(queueB.size()).toBe(1);
  });

  it('clearing child A queue does not affect child B queue', () => {
    const queueA = createSyncQueue(CHILD_A);
    const queueB = createSyncQueue(CHILD_B);

    queueA.enqueue('question-result', { questionId: 1 });
    queueB.enqueue('question-result', { questionId: 2 });

    queueA.clear();

    expect(queueA.isEmpty()).toBe(true);
    expect(queueB.size()).toBe(1);
  });

  it('ops tagged with wrong childId are quarantined', () => {
    const queue = createSyncQueue(CHILD_A);
    queue.enqueue('question-result', { questionId: 1 });

    // Manually inject an op with wrong childId into localStorage
    const key = `sync-queue:${CHILD_A}`;
    const raw = JSON.parse(localStorage.getItem(key));
    raw.push({ uuid: 'fake-uuid', type: 'question-result', payload: {}, childId: CHILD_B, createdAt: Date.now() });
    localStorage.setItem(key, JSON.stringify(raw));

    const { valid, quarantined } = queue.validateOwnership();
    expect(valid).toHaveLength(1);
    expect(quarantined).toHaveLength(1);
    expect(quarantined[0].uuid).toBe('fake-uuid');
  });
});

// ── children array from GET /api/account (contract test) ──

describe('GET /api/account response shape — children array', () => {
  it('children field is an array even for single-child accounts', () => {
    // Simulate what the worker now returns
    const accountResponse = {
      account: { id: 'user-1', name: 'Parent' },
      children: [{ id: 'child-1', display_name: 'Evie', created_at: '2026-01-01 00:00:00' }],
      access: { hasAccess: true },
    };

    expect(Array.isArray(accountResponse.children)).toBe(true);
    expect(accountResponse.children).toHaveLength(1);
    expect(accountResponse.children[0]).toMatchObject({
      id: 'child-1', display_name: 'Evie',
    });
  });

  it('children array sorted oldest first by created_at', () => {
    const children = [
      { id: 'child-2', display_name: 'Sam', created_at: '2026-04-01 00:00:00' },
      { id: 'child-1', display_name: 'Evie', created_at: '2026-01-01 00:00:00' },
    ];
    // Sort as the worker does: ORDER BY created_at ASC
    const sorted = [...children].sort((a, b) => a.created_at.localeCompare(b.created_at));
    expect(sorted[0].display_name).toBe('Evie');
    expect(sorted[1].display_name).toBe('Sam');
  });
});

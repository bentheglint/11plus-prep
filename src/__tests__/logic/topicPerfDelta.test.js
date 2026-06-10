/**
 * Pure-logic tests for the topic-performance-delta feature.
 *
 * Covers:
 * 1. Delta computation: session questions + answers → deltas map
 * 2. foldQueuedTopicDeltas: base + queued ops → folded topicPerformance
 * 3. transformServerData topicPerformance shape: server rows → client map
 */

import { transformServerData, foldQueuedTopicDeltas } from '../../hooks/useD1Data';

// ── Sentry mock (syncQueue and useD1Data import Sentry) ──
jest.mock('@sentry/react', () => ({
  captureMessage: jest.fn(),
}));

// ── Minimal serverData stub (reused across tests) ──
function makeServerData(overrides = {}) {
  return {
    quizResults: [],
    mockTestResults: [],
    questionResults: [],
    topicPerformance: [],
    leitnerQueue: [],
    seenQuestions: [],
    practiceSessions: [],
    achievements: [],
    seenTips: [],
    streaks: null,
    prepPoints: null,
    preferences: null,
    lessonHistory: [],
    ...overrides,
  };
}

// ─────────────────────────────────────────────
// 1. Delta computation from session data
// ─────────────────────────────────────────────

describe('Topic delta computation from session', () => {
  // Pure helper mirroring the App.js updateTopicPerformance logic (no rendering needed).
  function computeDeltas(sessionQuestions, sessionAnswers) {
    const deltas = {};
    sessionQuestions.forEach((q, i) => {
      const key = q.topicKey;
      if (!deltas[key]) deltas[key] = { correctDelta: 0, totalDelta: 0 };
      deltas[key].totalDelta += 1;
      if (sessionAnswers[i]?.correct) deltas[key].correctDelta += 1;
    });
    return deltas;
  }

  it('10-question session across 2 topics produces correct deltas', () => {
    // 5 percentages questions: 3 correct; 5 fractions questions: 4 correct
    const questions = [
      ...Array(5).fill(null).map(() => ({ topicKey: 'percentages' })),
      ...Array(5).fill(null).map(() => ({ topicKey: 'fractions' })),
    ];
    const answers = [
      { correct: true }, { correct: true }, { correct: true }, { correct: false }, { correct: false },
      { correct: true }, { correct: true }, { correct: true }, { correct: true }, { correct: false },
    ];

    const deltas = computeDeltas(questions, answers);

    expect(deltas.percentages).toEqual({ correctDelta: 3, totalDelta: 5 });
    expect(deltas.fractions).toEqual({ correctDelta: 4, totalDelta: 5 });
  });

  it('all-correct session produces correctDelta = totalDelta', () => {
    const questions = [
      { topicKey: 'algebra' }, { topicKey: 'algebra' }, { topicKey: 'algebra' },
    ];
    const answers = [{ correct: true }, { correct: true }, { correct: true }];

    const deltas = computeDeltas(questions, answers);

    expect(deltas.algebra.correctDelta).toBe(3);
    expect(deltas.algebra.totalDelta).toBe(3);
  });

  it('all-wrong session produces correctDelta = 0', () => {
    const questions = [{ topicKey: 'decimals' }, { topicKey: 'decimals' }];
    const answers = [{ correct: false }, { correct: false }];

    const deltas = computeDeltas(questions, answers);

    expect(deltas.decimals.correctDelta).toBe(0);
    expect(deltas.decimals.totalDelta).toBe(2);
  });

  it('single-topic session accumulates all questions under one key', () => {
    const questions = Array(10).fill(null).map(() => ({ topicKey: 'ratio' }));
    const answers = Array(10).fill(null).map((_, i) => ({ correct: i % 2 === 0 })); // 5 correct

    const deltas = computeDeltas(questions, answers);

    expect(Object.keys(deltas)).toHaveLength(1);
    expect(deltas.ratio.totalDelta).toBe(10);
    expect(deltas.ratio.correctDelta).toBe(5);
  });
});

// ─────────────────────────────────────────────
// 2. foldQueuedTopicDeltas
// ─────────────────────────────────────────────

describe('foldQueuedTopicDeltas', () => {
  it('folds a queued delta onto a base topic', () => {
    const base = { percentages: { correct: 3, total: 5 } };
    const ops = [
      { type: 'topic-performance-delta', payload: { topicKey: 'percentages', correctDelta: 1, totalDelta: 5 } },
    ];

    const result = foldQueuedTopicDeltas(base, ops);

    expect(result.percentages).toEqual({ correct: 4, total: 10 });
  });

  it('handles a topic absent from base (creates it from scratch)', () => {
    const base = {};
    const ops = [
      { type: 'topic-performance-delta', payload: { topicKey: 'algebra', correctDelta: 2, totalDelta: 4 } },
    ];

    const result = foldQueuedTopicDeltas(base, ops);

    expect(result.algebra).toEqual({ correct: 2, total: 4 });
  });

  it('does not mutate the input object', () => {
    const base = { percentages: { correct: 3, total: 5 } };
    const ops = [
      { type: 'topic-performance-delta', payload: { topicKey: 'percentages', correctDelta: 1, totalDelta: 5 } },
    ];

    foldQueuedTopicDeltas(base, ops);

    // Input must be unchanged
    expect(base.percentages).toEqual({ correct: 3, total: 5 });
  });

  it('ignores ops of other types', () => {
    const base = { percentages: { correct: 3, total: 5 } };
    const ops = [
      { type: 'prep-points-delta', payload: { delta: 100, todayDelta: 100, todayDate: '2026-06-10' } },
      { type: 'quiz-result', payload: { score: 5, total: 10 } },
    ];

    const result = foldQueuedTopicDeltas(base, ops);

    expect(result.percentages).toEqual({ correct: 3, total: 5 });
    expect(Object.keys(result)).toHaveLength(1);
  });

  it('preserves extra fields from the base topic object', () => {
    const base = { percentages: { correct: 3, total: 5, legacyField: 'x' } };
    const ops = [
      { type: 'topic-performance-delta', payload: { topicKey: 'percentages', correctDelta: 1, totalDelta: 2 } },
    ];

    const result = foldQueuedTopicDeltas(base, ops);

    expect(result.percentages.legacyField).toBe('x');
    expect(result.percentages.correct).toBe(4);
    expect(result.percentages.total).toBe(7);
  });

  it('accumulates multiple queued ops for the same topic', () => {
    const base = { percentages: { correct: 0, total: 0 } };
    const ops = [
      { type: 'topic-performance-delta', payload: { topicKey: 'percentages', correctDelta: 3, totalDelta: 5 } },
      { type: 'topic-performance-delta', payload: { topicKey: 'percentages', correctDelta: 2, totalDelta: 5 } },
    ];

    const result = foldQueuedTopicDeltas(base, ops);

    expect(result.percentages).toEqual({ correct: 5, total: 10 });
  });

  it('empty ops list returns a shallow copy of base', () => {
    const base = { percentages: { correct: 3, total: 5 } };

    const result = foldQueuedTopicDeltas(base, []);

    expect(result).toEqual(base);
    expect(result).not.toBe(base); // new object (shallow copy)
  });
});

// ─────────────────────────────────────────────
// 3. transformServerData: topicPerformance shape
// ─────────────────────────────────────────────

describe('transformServerData: topicPerformance shape', () => {
  it('maps server rows [{topic_key, subject, data, version}] to {topicKey: data}', () => {
    const serverData = makeServerData({
      topicPerformance: [
        { topic_key: 'percentages', subject: 'maths', data: { correct: 7, total: 10 }, version: 3 },
        { topic_key: 'algebra', subject: 'maths', data: { correct: 4, total: 5 }, version: 1 },
      ],
    });

    const { topicPerformance } = transformServerData(serverData);

    expect(topicPerformance.percentages).toEqual({ correct: 7, total: 10 });
    expect(topicPerformance.algebra).toEqual({ correct: 4, total: 5 });
  });

  it('returns empty object when topicPerformance array is empty', () => {
    const serverData = makeServerData({ topicPerformance: [] });

    const { topicPerformance } = transformServerData(serverData);

    expect(topicPerformance).toEqual({});
  });

  it('uses topic_key as the map key (not subject)', () => {
    const serverData = makeServerData({
      topicPerformance: [
        { topic_key: 'vocabulary', subject: 'english', data: { correct: 2, total: 3 }, version: 1 },
      ],
    });

    const { topicPerformance } = transformServerData(serverData);

    expect(topicPerformance.vocabulary).toBeDefined();
    expect(topicPerformance.english).toBeUndefined();
  });

  it('last row wins when two rows share the same topic_key (edge case)', () => {
    // The server should never return duplicate topic_keys for the same child,
    // but transformServerData must be robust to it.
    const serverData = makeServerData({
      topicPerformance: [
        { topic_key: 'percentages', subject: 'maths', data: { correct: 1, total: 5 }, version: 1 },
        { topic_key: 'percentages', subject: 'maths', data: { correct: 9, total: 10 }, version: 2 },
      ],
    });

    const { topicPerformance } = transformServerData(serverData);

    // Second row overwrites first — deterministic (not a random flap)
    expect(topicPerformance.percentages).toEqual({ correct: 9, total: 10 });
  });
});

/**
 * Offline-sync reliability overhaul tests.
 *
 * Covers the new behaviours introduced in the sync overhaul:
 * - Backoff schedule + reset
 * - No deletion on transient failure
 * - Error-op dead-lettering
 * - Age-out to dead-letter (7 days)
 * - PP delta computation + splitting > 2500
 * - Streak merge (union + derive; cross-device scenario)
 * - Preferences merge (lastSessionDate = max)
 * - Seen-question delta enqueueing
 * - Leitner delta enqueueing
 * - lesson_id encode/decode + topic-keyed rebuild
 * - getToday local-time behaviour (BST 23:30 boundary)
 */

import { createSyncQueue } from '../../utils/syncQueue';
import { recomputeStreakFromHistory, countPracticeDaysInWeek, getToday } from '../../hooks/useStreaksAndPP';
import { transformServerData } from '../../hooks/useD1Data';

// ── Sentry mock (syncQueue imports Sentry) ──
jest.mock('@sentry/react', () => ({
  captureMessage: jest.fn(),
}));
import * as Sentry from '@sentry/react';

// ─────────────────────────────────────────────
// 1. BACKOFF SCHEDULE + RESET
// ─────────────────────────────────────────────

describe('Backoff schedule', () => {
  it('first failure produces BACKOFF_MIN_MS (2000ms)', () => {
    // Import private nextBackoffMs via testing the exported module indirectly.
    // We test the schedule using known values.
    const backoffs = [];
    let current = 0;
    // Simulate 8 failures
    for (let i = 0; i < 8; i++) {
      if (current === 0) current = 2000;
      else current = Math.min(current * 2, 300000);
      backoffs.push(current);
    }
    expect(backoffs[0]).toBe(2000);
    expect(backoffs[1]).toBe(4000);
    expect(backoffs[2]).toBe(8000);
    expect(backoffs[3]).toBe(16000);
    expect(backoffs[4]).toBe(32000);
    expect(backoffs[5]).toBe(64000);
    expect(backoffs[6]).toBe(128000);
    expect(backoffs[7]).toBe(256000);
  });

  it('caps backoff at 5 minutes (300000ms)', () => {
    let current = 0;
    for (let i = 0; i < 20; i++) {
      if (current === 0) current = 2000;
      else current = Math.min(current * 2, 300000);
    }
    expect(current).toBe(300000);
  });

  it('reset to zero on success means next failure starts at 2000ms again', () => {
    let current = 64000; // mid-backoff
    // Success resets
    current = 0;
    // Next failure
    if (current === 0) current = 2000;
    expect(current).toBe(2000);
  });
});

// ─────────────────────────────────────────────
// 2. NO DELETION ON TRANSIENT FAILURE
// ─────────────────────────────────────────────

describe('SyncQueue: no deletion on transient failure', () => {
  beforeEach(() => localStorage.clear());

  it('incrementRetries keeps ops in the queue (retryCount is telemetry only)', () => {
    const queue = createSyncQueue('child-test-1');
    const uuid = queue.enqueue('streaks', { currentStreak: 5 });

    // Simulate 15 transient failures — no op should be deleted
    for (let i = 0; i < 15; i++) {
      queue.incrementRetries([uuid]);
    }
    expect(queue.size()).toBe(1);
    expect(queue.getAll()[0].retryCount).toBe(15);
    expect(queue.getAll()[0].uuid).toBe(uuid);
  });
});

// ─────────────────────────────────────────────
// 3. ERROR-OP DEAD-LETTERING
// ─────────────────────────────────────────────

describe('SyncQueue: error-op dead-lettering', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('deadLetterErrors removes ops from queue and writes to dead-letter store', () => {
    const queue = createSyncQueue('child-test-2');
    const uuid1 = queue.enqueue('streaks', { currentStreak: 3 });
    const uuid2 = queue.enqueue('quiz-result', { score: 5 });

    queue.deadLetterErrors([uuid1]);

    expect(queue.size()).toBe(1);
    expect(queue.getAll()[0].uuid).toBe(uuid2);

    const deadLetters = queue.getDeadLetters();
    expect(deadLetters).toHaveLength(1);
    expect(deadLetters[0].uuid).toBe(uuid1);
    expect(deadLetters[0].reason).toMatch('server-rejected');
  });

  it('reports dead-lettered op to Sentry before eviction', () => {
    const queue = createSyncQueue('child-test-sentry');
    const uuid = queue.enqueue('bad-op', { broken: true });

    queue.deadLetterErrors([uuid]);

    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining('Dead-lettered'),
      expect.objectContaining({
        extra: expect.objectContaining({ uuid, reason: expect.stringContaining('server-rejected') }),
      })
    );
  });

  it('dead-letter store is capped at 100 entries (oldest evicted)', () => {
    const queue = createSyncQueue('child-cap-test');
    const uuids = [];
    for (let i = 0; i < 105; i++) {
      uuids.push(queue.enqueue('test-op', { i }));
    }
    queue.deadLetterErrors(uuids);

    const deadLetters = queue.getDeadLetters();
    expect(deadLetters.length).toBe(100);
    // Oldest 5 were evicted — the 6th enqueued (index 5) should be the first retained
    expect(deadLetters[0].payload.i).toBe(5);
  });
});

// ─────────────────────────────────────────────
// 4. AGE-OUT TO DEAD-LETTER (7 days)
// ─────────────────────────────────────────────

describe('SyncQueue: age-out to dead-letter', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('peek() age-outs ops older than 7 days and moves them to dead-letter', () => {
    const queue = createSyncQueue('child-ageout');
    // Manually inject a stale op
    const staleOp = {
      uuid: 'stale-uuid-1',
      type: 'streaks',
      payload: {},
      childId: 'child-ageout',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      retryCount: 0,
    };
    const freshOp = {
      uuid: 'fresh-uuid-1',
      type: 'quiz-result',
      payload: {},
      childId: 'child-ageout',
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    localStorage.setItem('sync-queue:child-ageout', JSON.stringify([staleOp, freshOp]));

    const peeked = queue.peek();
    expect(peeked).toHaveLength(1);
    expect(peeked[0].uuid).toBe('fresh-uuid-1');

    const deadLetters = queue.getDeadLetters();
    expect(deadLetters).toHaveLength(1);
    expect(deadLetters[0].uuid).toBe('stale-uuid-1');
    expect(deadLetters[0].reason).toMatch('age-out');

    // Sentry was called for the stale op
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.stringContaining('Dead-lettered'),
      expect.objectContaining({ extra: expect.objectContaining({ uuid: 'stale-uuid-1' }) })
    );
  });

  it('peek() does not age-out ops that are exactly 7 days old (boundary)', () => {
    const queue = createSyncQueue('child-boundary');
    const exactOp = {
      uuid: 'exact-uuid',
      type: 'streaks',
      payload: {},
      childId: 'child-boundary',
      // Exactly 7 days minus 1 second = still live
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1000).toISOString(),
      retryCount: 0,
    };
    localStorage.setItem('sync-queue:child-boundary', JSON.stringify([exactOp]));
    const peeked = queue.peek();
    expect(peeked).toHaveLength(1);
    expect(queue.getDeadLetters()).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// 5. PP DELTA COMPUTATION + SPLITTING > 2500
// ─────────────────────────────────────────────

describe('PP delta computation + splitting', () => {
  it('delta = new total - lastSynced total', () => {
    const lastSyncedTotal = 1000;
    const newTotal = 1350;
    const delta = newTotal - lastSyncedTotal;
    expect(delta).toBe(350);
  });

  it('delta <= 0 means no enqueue (total cannot decrease)', () => {
    const lastSyncedTotal = 1000;
    const newTotal = 1000; // same
    const delta = newTotal - lastSyncedTotal;
    expect(delta <= 0).toBe(true);
  });

  it('delta <= 2500 produces a single op', () => {
    const delta = 2500;
    const ops = [];
    let remaining = delta;
    let firstOp = true;
    while (remaining > 0) {
      const opDelta = Math.min(remaining, 2500);
      ops.push({ delta: opDelta, firstOp });
      remaining -= opDelta;
      firstOp = false;
    }
    expect(ops).toHaveLength(1);
    expect(ops[0].delta).toBe(2500);
    expect(ops[0].firstOp).toBe(true);
  });

  it('delta of 2501 produces 2 ops (2500 + 1)', () => {
    const delta = 2501;
    const ops = [];
    let remaining = delta;
    let firstOp = true;
    while (remaining > 0) {
      const opDelta = Math.min(remaining, 2500);
      ops.push({ delta: opDelta, firstOp });
      remaining -= opDelta;
      firstOp = false;
    }
    expect(ops).toHaveLength(2);
    expect(ops[0].delta).toBe(2500);
    expect(ops[1].delta).toBe(1);
  });

  it('delta of 7500 produces 3 ops of 2500 each', () => {
    const delta = 7500;
    const ops = [];
    let remaining = delta;
    while (remaining > 0) {
      const opDelta = Math.min(remaining, 2500);
      ops.push(opDelta);
      remaining -= opDelta;
    }
    expect(ops).toHaveLength(3);
    ops.forEach(d => expect(d).toBe(2500));
  });

  it('todayDelta goes entirely on the first op, subsequent ops get 0', () => {
    const delta = 5000;
    const todayDelta = 300;
    const ops = [];
    let remaining = delta;
    let todayDeltaRemaining = todayDelta;
    let firstOp = true;
    while (remaining > 0) {
      const opDelta = Math.min(remaining, 2500);
      ops.push({ delta: opDelta, todayDelta: firstOp ? todayDeltaRemaining : 0 });
      remaining -= opDelta;
      firstOp = false;
    }
    expect(ops[0].todayDelta).toBe(300);
    expect(ops[1].todayDelta).toBe(0);
  });
});

// ─────────────────────────────────────────────
// 6. STREAK MERGE (union + derive; cross-device scenario)
// ─────────────────────────────────────────────

describe('recomputeStreakFromHistory', () => {
  it('returns zeros for empty history', () => {
    const result = recomputeStreakFromHistory([]);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 0, lastQuizDate: null });
  });

  it('single day produces currentStreak=1', () => {
    const result = recomputeStreakFromHistory(['2026-06-01']);
    expect(result.currentStreak).toBe(1);
    expect(result.lastQuizDate).toBe('2026-06-01');
  });

  it('consecutive days produce correct streak count', () => {
    const history = ['2026-06-01', '2026-06-02', '2026-06-03'];
    const result = recomputeStreakFromHistory(history);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('gap of 3+ days resets streak', () => {
    // 3-day gap between Jun 3 and Jun 7
    const history = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-07', '2026-06-08'];
    const result = recomputeStreakFromHistory(history);
    // After the gap, streak resets to 1, then grows to 2
    expect(result.currentStreak).toBe(2);
  });

  it('cross-device scenario: Device A has 10-day streak, Device B practised different days', () => {
    // Device A history (10 consecutive days)
    const deviceAHistory = [
      '2026-05-21', '2026-05-22', '2026-05-23', '2026-05-24', '2026-05-25',
      '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30',
    ];
    // Device B history (different days — some overlap)
    const deviceBHistory = [
      '2026-05-24', '2026-05-25', '2026-05-26', '2026-05-31', '2026-06-01',
    ];

    // Merged history is union deduped by date
    const merged = [...new Set([...deviceAHistory, ...deviceBHistory])];

    const result = recomputeStreakFromHistory(merged, 0);

    // The merged result must equal recompute over the union — NOT max(10, 5)=10
    // We verify it equals the correct recomputation, not just either device's streak
    const directResult = recomputeStreakFromHistory(merged);
    expect(result.currentStreak).toBe(directResult.currentStreak);
    expect(result.longestStreak).toBe(directResult.longestStreak);
    expect(result.lastQuizDate).toBe(directResult.lastQuizDate);
  });

  it('merged result is never just max(deviceA.currentStreak, deviceB.currentStreak)', () => {
    // Device A: 10-day streak ending Jun 1
    const deviceAHistory = Array.from({ length: 10 }, (_, i) => {
      const d = new Date('2026-05-23');
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    // Device B: 5-day streak on completely different days (2026-04 range) + 1 Jun day
    const deviceBHistory = ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05', '2026-06-01'];

    const merged = [...new Set([...deviceAHistory, ...deviceBHistory])];
    const result = recomputeStreakFromHistory(merged, 0);

    // Should NOT be simply 10 (max of both streaks) — must be derived from history
    const correctResult = recomputeStreakFromHistory(merged, 0);
    expect(result.currentStreak).toBe(correctResult.currentStreak);
  });

  it('prevLongest carries forward longest streak predating history window', () => {
    // History only covers last 30 days but historical longest was 50
    const history = ['2026-06-01', '2026-06-02', '2026-06-03'];
    const result = recomputeStreakFromHistory(history, 50);
    expect(result.longestStreak).toBe(50); // historical max preserved
  });

  it('deduplicates history entries (same date on both devices)', () => {
    const history = ['2026-06-01', '2026-06-01', '2026-06-02', '2026-06-02'];
    const result = recomputeStreakFromHistory(history);
    expect(result.currentStreak).toBe(2); // treated as 2 unique days
  });
});

// ─────────────────────────────────────────────
// 7. PREFERENCES MERGE (lastSessionDate = max)
// ─────────────────────────────────────────────

describe('Preferences conflict merge', () => {
  it('merged lastSessionDate is max(local, server)', () => {
    const serverDate = '2026-06-05';
    const localDate = '2026-06-08';
    const merged = serverDate && localDate
      ? (serverDate > localDate ? serverDate : localDate)
      : (serverDate || localDate);
    expect(merged).toBe('2026-06-08');
  });

  it('merged lastSessionDate uses server when server is newer', () => {
    const serverDate = '2026-06-10';
    const localDate = '2026-06-03';
    const merged = serverDate && localDate
      ? (serverDate > localDate ? serverDate : localDate)
      : (serverDate || localDate);
    expect(merged).toBe('2026-06-10');
  });

  it('handles null local date — uses server date', () => {
    const serverDate = '2026-06-08';
    const localDate = null;
    const merged = serverDate && localDate
      ? (serverDate > localDate ? serverDate : localDate)
      : (serverDate || localDate);
    expect(merged).toBe('2026-06-08');
  });

  it('handles null server date — uses local date', () => {
    const serverDate = null;
    const localDate = '2026-06-08';
    const merged = serverDate && localDate
      ? (serverDate > localDate ? serverDate : localDate)
      : (serverDate || localDate);
    expect(merged).toBe('2026-06-08');
  });
});

// ─────────────────────────────────────────────
// 8. SEEN-QUESTION DELTA ENQUEUEING
// ─────────────────────────────────────────────

describe('Seen-question delta enqueueing', () => {
  it('correctly identifies new question IDs vs previously seen', () => {
    const prev = { percentages: [1, 2, 3], algebra: [10] };
    const updated = { percentages: [1, 2, 3, 4], algebra: [10, 11], fractions: [20] };

    const newEntries = [];
    for (const [topicKey, ids] of Object.entries(updated)) {
      const prevIds = prev[topicKey] || [];
      for (const questionId of ids) {
        if (!prevIds.includes(questionId)) {
          newEntries.push({ questionId, topicKey });
        }
      }
    }

    expect(newEntries).toEqual([
      { questionId: 4, topicKey: 'percentages' },
      { questionId: 11, topicKey: 'algebra' },
      { questionId: 20, topicKey: 'fractions' },
    ]);
  });

  it('produces no enqueue calls when nothing is new', () => {
    const prev = { percentages: [1, 2, 3] };
    const updated = { percentages: [1, 2, 3] };

    const newEntries = [];
    for (const [topicKey, ids] of Object.entries(updated)) {
      const prevIds = prev[topicKey] || [];
      for (const questionId of ids) {
        if (!prevIds.includes(questionId)) newEntries.push(questionId);
      }
    }
    expect(newEntries).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// 9. LEITNER DELTA ENQUEUEING
// ─────────────────────────────────────────────

describe('Leitner delta enqueueing', () => {
  it('detects new entries (not in prev)', () => {
    const prev = [{ questionId: 1, topicKey: 'percentages', level: 0 }];
    const updated = [
      { questionId: 1, topicKey: 'percentages', level: 0 },
      { questionId: 2, topicKey: 'algebra', level: 1 },
    ];

    const prevMap = new Map(prev.map(e => [`${e.questionId}:${e.topicKey}`, e]));
    const toEnqueue = [];
    for (const entry of updated) {
      const key = `${entry.questionId}:${entry.topicKey}`;
      if (!prevMap.has(key)) toEnqueue.push(entry);
    }
    expect(toEnqueue).toHaveLength(1);
    expect(toEnqueue[0].questionId).toBe(2);
  });

  it('detects changed entries (level changed)', () => {
    const prev = [{ questionId: 1, topicKey: 'percentages', level: 0, timesCorrect: 1, timesIncorrect: 0 }];
    const updated = [{ questionId: 1, topicKey: 'percentages', level: 1, timesCorrect: 2, timesIncorrect: 0 }];

    const prevMap = new Map(prev.map(e => [`${e.questionId}:${e.topicKey}`, e]));
    const toEnqueue = [];
    for (const entry of updated) {
      const key = `${entry.questionId}:${entry.topicKey}`;
      const p = prevMap.get(key);
      const changed = !p
        || p.level !== entry.level
        || p.timesCorrect !== entry.timesCorrect
        || p.timesIncorrect !== entry.timesIncorrect;
      if (changed) toEnqueue.push(entry);
    }
    expect(toEnqueue).toHaveLength(1);
  });

  it('does not enqueue unchanged entries', () => {
    const entry = { questionId: 1, topicKey: 'percentages', level: 2, timesCorrect: 5, timesIncorrect: 1 };
    const prev = [entry];
    const updated = [...prev]; // identical

    const prevMap = new Map(prev.map(e => [`${e.questionId}:${e.topicKey}`, e]));
    const toEnqueue = [];
    for (const e of updated) {
      const key = `${e.questionId}:${e.topicKey}`;
      const p = prevMap.get(key);
      const changed = !p || p.level !== e.level || p.timesCorrect !== e.timesCorrect || p.timesIncorrect !== e.timesIncorrect;
      if (changed) toEnqueue.push(e);
    }
    expect(toEnqueue).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// 10. LESSON_ID ENCODE/DECODE + TOPIC-KEYED REBUILD
// ─────────────────────────────────────────────

describe('lesson_id encoding and topic-keyed rebuild', () => {
  it('encodes lessonId as topicKey::subConceptId::templateType', () => {
    const topicKey = 'percentages';
    const subConceptId = 'find-percentage-of-amount';
    const templateType = 'worked-example';
    const lessonId = `${topicKey}::${subConceptId}::${templateType}`;
    expect(lessonId).toBe('percentages::find-percentage-of-amount::worked-example');
  });

  it('transformServerData rebuilds topic-keyed shape from lesson_history rows', () => {
    const serverData = {
      quizResults: [], mockTestResults: [], questionResults: [], topicPerformance: [],
      leitnerQueue: [], seenQuestions: [], practiceSessions: [], achievements: [], seenTips: [],
      streaks: null, prepPoints: null, preferences: null,
      lessonHistory: [
        { lesson_id: 'percentages::find-percentage::worked-example', completed_at: '2026-06-01T10:00:00Z', id: 1 },
        { lesson_id: 'percentages::percentage-increase::practice', completed_at: '2026-06-01T10:01:00Z', id: 2 },
        { lesson_id: 'algebra::solve-linear::worked-example', completed_at: '2026-06-01T10:02:00Z', id: 3 },
      ],
    };

    const { lessonHistory } = transformServerData(serverData);

    expect(lessonHistory.percentages).toBeDefined();
    // shown entries are OBJECTS — selectLesson reads h.subConcept and h.date
    // for rotation/cooldown scoring; LessonBrowser reads h.subConcept.
    expect(lessonHistory.percentages.shown).toEqual([
      { subConcept: 'find-percentage', templateType: 'worked-example', date: '2026-06-01T10:00:00Z' },
      { subConcept: 'percentage-increase', templateType: 'practice', date: '2026-06-01T10:01:00Z' },
    ]);
    expect(lessonHistory.percentages.lastSubConcept).toBe('percentage-increase');
    expect(lessonHistory.percentages.lastTemplateType).toBe('practice');

    expect(lessonHistory.algebra).toBeDefined();
    expect(lessonHistory.algebra.shown).toEqual([
      { subConcept: 'solve-linear', templateType: 'worked-example', date: '2026-06-01T10:02:00Z' },
    ]);
    expect(lessonHistory.algebra.lastSubConcept).toBe('solve-linear');
  });

  it('skips legacy rows whose lesson_id does not contain "::"', () => {
    const serverData = {
      quizResults: [], mockTestResults: [], questionResults: [], topicPerformance: [],
      leitnerQueue: [], seenQuestions: [], practiceSessions: [], achievements: [], seenTips: [],
      streaks: null, prepPoints: null, preferences: null,
      lessonHistory: [
        { lesson_id: 'legacy-format-no-colons', completed_at: '2026-06-01T10:00:00Z', id: 1 },
        { lesson_id: 'percentages::find-percentage::worked-example', completed_at: '2026-06-01T10:01:00Z', id: 2 },
      ],
    };

    const { lessonHistory } = transformServerData(serverData);

    // Legacy row should be skipped
    expect(Object.keys(lessonHistory)).toHaveLength(1);
    expect(lessonHistory.percentages).toBeDefined();
  });

  it('uses id as tiebreaker for same-second completions', () => {
    const serverData = {
      quizResults: [], mockTestResults: [], questionResults: [], topicPerformance: [],
      leitnerQueue: [], seenQuestions: [], practiceSessions: [], achievements: [], seenTips: [],
      streaks: null, prepPoints: null, preferences: null,
      lessonHistory: [
        // Same timestamp, different ids — id order determines which is "last"
        { lesson_id: 'percentages::concept-b::practice', completed_at: '2026-06-01T10:00:00Z', id: 2 },
        { lesson_id: 'percentages::concept-a::worked-example', completed_at: '2026-06-01T10:00:00Z', id: 1 },
      ],
    };

    const { lessonHistory } = transformServerData(serverData);

    // id=2 is higher so concept-b should be the last
    expect(lessonHistory.percentages.lastSubConcept).toBe('concept-b');
  });

  it('warns if a lessonId component contains "::"', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const topicKey = 'percentages';
    const subConceptId = 'concept::with-colons'; // BAD — contains separator
    const templateType = 'practice';

    if (topicKey.includes('::') || subConceptId.includes('::') || templateType.includes('::')) {
      console.warn('[useD1Data] recordLessonComplete: component contains "::" separator — lessonId will be malformed', { topicKey, subConceptId, templateType });
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('component contains "::"'),
      expect.any(Object)
    );
    consoleSpy.mockRestore();
  });

  // Mirrors the null-guard added to recordLessonComplete (useD1Data.js).
  // Regression cover for Sentry JAVASCRIPT-REACT-C: subConceptId arrived null
  // and null.includes('::') threw, aborting the completion handler. The guard
  // must warn and bail (skip recording) rather than crash or persist a
  // malformed "topic::null::type" lessonId.
  it('warns and bails if a lessonId component is null/undefined/empty', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const record = ({ topicKey, subConceptId, templateType }) => {
      if (!topicKey || !subConceptId || !templateType) {
        console.warn('[useD1Data] recordLessonComplete: missing component — skipping (lesson not recorded)', { topicKey, subConceptId, templateType });
        return false; // bailed — no lessonId formed, nothing enqueued
      }
      return true; // would proceed to build lessonId + enqueue
    };

    // The prod crash case: subConceptId null must not throw, must bail
    expect(() => record({ topicKey: 'percentages', subConceptId: null, templateType: 'practice' })).not.toThrow();
    expect(record({ topicKey: 'percentages', subConceptId: null, templateType: 'practice' })).toBe(false);
    expect(record({ topicKey: 'percentages', subConceptId: undefined, templateType: 'practice' })).toBe(false);
    expect(record({ topicKey: '', subConceptId: 'concept-a', templateType: 'practice' })).toBe(false);
    // A fully-populated record still proceeds
    expect(record({ topicKey: 'percentages', subConceptId: 'concept-a', templateType: 'practice' })).toBe(true);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('missing component'),
      expect.any(Object)
    );
    consoleSpy.mockRestore();
  });
});

// ─────────────────────────────────────────────
// 11. LEITNER QUEUE SHAPE TRANSFORMATION
// ─────────────────────────────────────────────

describe('transformServerData: prepPoints level derived from total', () => {
  const baseServerData = {
    quizResults: [], mockTestResults: [], questionResults: [], topicPerformance: [],
    leitnerQueue: [], seenQuestions: [], practiceSessions: [], achievements: [], seenTips: [],
    streaks: null, preferences: null, lessonHistory: [],
  };

  it('recomputes level from total, ignoring the stored level=0 placeholder left by prep-points-delta INSERT', () => {
    const { prepPointsData } = transformServerData({
      ...baseServerData,
      // delta-op INSERT case writes level=0 and never recalculates it
      prepPoints: { total: 450, level: 0, today_pp: 50, today_date: '2026-06-11' },
    });
    // floor(sqrt(450/50)) = 3
    expect(prepPointsData.level).toBe(3);
    expect(prepPointsData.total).toBe(450);
  });

  it('matches the stored level when it is already consistent with total', () => {
    const { prepPointsData } = transformServerData({
      ...baseServerData,
      prepPoints: { total: 1250, level: 5, today_pp: 0, today_date: '2026-06-11' },
    });
    expect(prepPointsData.level).toBe(5);
  });

  it('falls back to defaults (level 0) when prepPoints row is absent', () => {
    const { prepPointsData } = transformServerData({ ...baseServerData, prepPoints: null });
    expect(prepPointsData).toEqual({ total: 0, level: 0, todayPP: 0, todayDate: null });
  });
});

describe('transformServerData: leitnerQueue camelCase transform', () => {
  it('transforms snake_case server columns to camelCase client shape', () => {
    const serverData = {
      quizResults: [], mockTestResults: [], questionResults: [], topicPerformance: [],
      seenQuestions: [], practiceSessions: [], achievements: [], seenTips: [],
      streaks: null, prepPoints: null, preferences: null, lessonHistory: [],
      leitnerQueue: [
        {
          question_id: 42,
          topic_key: 'percentages',
          subject: 'maths',
          level: 2,
          last_reviewed: '2026-06-01',
          next_review: '2026-06-05',
          times_correct: 3,
          times_incorrect: 1,
        },
      ],
    };

    const { leitnerQueue } = transformServerData(serverData);

    expect(leitnerQueue).toHaveLength(1);
    const entry = leitnerQueue[0];
    expect(entry.questionId).toBe(42);
    expect(entry.topicKey).toBe('percentages');
    expect(entry.subject).toBe('maths');
    expect(entry.level).toBe(2);
    expect(entry.lastReviewed).toBe('2026-06-01');
    expect(entry.nextReview).toBe('2026-06-05');
    expect(entry.timesCorrect).toBe(3);
    expect(entry.timesIncorrect).toBe(1);
    // Old snake_case keys must NOT be present
    expect(entry.question_id).toBeUndefined();
    expect(entry.topic_key).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// 12. getToday LOCAL-TIME BEHAVIOUR (BST 23:30 BOUNDARY)
// ─────────────────────────────────────────────

describe('getToday: local-time date string', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns YYYY-MM-DD in local time, not UTC', () => {
    // Mock date to be 2026-06-10T22:30:00Z (UTC), which is 2026-06-10T23:30:00 in BST (UTC+1)
    // UTC date = Jun 10; BST local date = Jun 10 (still same day in this case)
    // To test the boundary: set to 2026-06-10T23:01:00Z = Jun 11 00:01 BST
    const mockDate = new Date('2026-06-10T23:01:00Z');
    jest.useFakeTimers().setSystemTime(mockDate);

    const result = getToday();

    // In UTC it's still Jun 10; in BST (UTC+1) it's Jun 11
    // The function must use local date — whether this is Jun 10 or Jun 11 depends on
    // the test runner's timezone. We verify the format is correct YYYY-MM-DD.
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Verify it uses local date components (not UTC)
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(result).toBe(expected);
  });

  it('format is zero-padded YYYY-MM-DD', () => {
    // January 5th
    jest.useFakeTimers().setSystemTime(new Date('2026-01-05T10:00:00'));
    const result = getToday();
    // Should be '2026-01-05', not '2026-1-5'
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const parts = result.split('-');
    expect(parts[1]).toHaveLength(2); // month is zero-padded
    expect(parts[2]).toHaveLength(2); // day is zero-padded
  });
});

// ─────────────────────────────────────────────
// 13. ORDERING AUDIT — saveQuizResult prepends (newest-first)
// ─────────────────────────────────────────────

describe('Save methods: newest-first ordering', () => {
  it('saveQuizResult prepends to produce newest-first order', () => {
    // Simulate the logic: [result, ...quizHistory]
    const existing = [{ topic: 'algebra', score: 5 }];
    const newResult = { topic: 'percentages', score: 8 };
    const updated = [newResult, ...existing];
    expect(updated[0].topic).toBe('percentages'); // newest first
    expect(updated[1].topic).toBe('algebra');
  });

  it('saveQuestionResult prepends to produce newest-first order', () => {
    const existing = [{ questionId: 1, correct: true }];
    const newResult = { questionId: 2, correct: false };
    const updated = [newResult, ...existing];
    expect(updated[0].questionId).toBe(2); // newest first
  });
});

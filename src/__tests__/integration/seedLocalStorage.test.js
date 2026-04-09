/**
 * Server-to-localStorage Seeding Tests
 *
 * Tests that seedLocalStorage in AuthGate correctly converts D1 server
 * data into the format that useUserData, useMastery, and the rest of
 * the app expect. This is the integration point where format mismatches
 * cause silent data corruption.
 *
 * These tests import the seed logic and verify every field mapping.
 */

import { renderHook } from '@testing-library/react';
import useUserData from '../../hooks/useUserData';

// ── Mock server responses (what D1 returns via /api/data/all) ──

const mockServerData = {
  quizResults: [
    {
      topic_key: 'Long Division',
      subject: 'maths',
      score: 8,
      total: 10,
      time_seconds: 120,
      quiz_mode: 'focused',
      completed_at: '2026-04-08T10:30:00.000Z',
    },
    {
      topic_key: 'Daily Learning',
      subject: 'maths',
      score: 5,
      total: 10,
      time_seconds: null,
      quiz_mode: 'daily',
      completed_at: '2026-04-08T11:00:00.000Z',
    },
  ],

  questionResults: [
    {
      id: 1001,
      question_id: 42,
      topic_key: 'fractions',
      subject: 'maths',
      difficulty: 2,
      is_correct: true,
      time_ms: 8500,
      mode: 'focused',
      session_id: 9000,
      created_at: '2026-04-08T10:30:05.000Z',
    },
    {
      id: 1002,
      question_id: 43,
      topic_key: 'fractions',
      subject: 'maths',
      difficulty: 3,
      is_correct: false,
      time_ms: 12000,
      mode: 'focused',
      session_id: 9000,
      created_at: '2026-04-08T10:30:20.000Z',
    },
  ],

  seenQuestions: [
    { question_id: 42, topic_key: 'fractions', subject: 'maths' },
    { question_id: 43, topic_key: 'fractions', subject: 'maths' },
    { question_id: 10, topic_key: 'decimals', subject: 'maths' },
  ],

  topicPerformance: [
    { topic_key: 'fractions', data: { correct: 15, total: 20 } },
    { topic_key: 'decimals', data: { correct: 8, total: 10 } },
  ],

  practiceSessions: [
    {
      session_date: '2026-04-08',
      data: {
        id: 9000,
        mode: 'focused',
        subject: 'maths',
        topicKey: 'fractions',
        questionsAttempted: 10,
        questionsCorrect: 8,
      },
    },
  ],

  streaks: {
    current_streak: 5,
    longest_streak: 12,
    last_quiz_date: '2026-04-08',
    streak_history: ['2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07', '2026-04-08'],
    version: 3,
  },

  prepPoints: {
    total: 1250,
    level: 4,
    today_pp: 80,
    today_date: '2026-04-08',
    version: 5,
  },

  achievements: [
    { achievement_id: 'first-quiz', unlocked_at: '2026-03-01T09:00:00.000Z' },
    { achievement_id: 'streak-7', unlocked_at: '2026-03-15T14:00:00.000Z' },
  ],

  seenTips: [
    { tip_id: 'tip-welcome', last_seen_date: '2026-04-01' },
  ],

  mockTestResults: [
    {
      subject: 'maths',
      total_questions: 50,
      total_correct: 38,
      percentage: 76,
      time_taken: 2400,
      time_limit: 3000,
      section_results: null,
      question_times: null,
      completed_at: '2026-04-07T16:00:00.000Z',
    },
  ],

  lessonHistory: [],
  leitnerQueue: [],

  preferences: {
    last_session_date: '2026-04-08T11:00:00.000Z',
    version: 2,
  },
};

// ── Seed function extracted for testing ──
// Mirrors the seedLocalStorage logic from AuthGate.js exactly.
// If AuthGate changes, this must be updated to match.

function seedLocalStorage(childDisplayName, serverData) {
  const prefix = `user:${childDisplayName}:`;

  if (serverData.quizResults?.length > 0) {
    const quizHistory = serverData.quizResults.map(r => ({
      id: Date.parse(r.completed_at) || Date.now(),
      topic: r.topic_key,
      subject: r.subject,
      score: r.score,
      total: r.total,
      percentage: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
      date: r.completed_at,
    }));
    localStorage.setItem(prefix + 'quiz-history', JSON.stringify(quizHistory));
  }

  if (serverData.questionResults?.length > 0) {
    const qr = serverData.questionResults.map(r => ({
      id: r.id || Date.parse(r.created_at) || Date.now(),
      date: r.created_at || r.date,
      questionId: r.question_id ?? r.questionId,
      topicKey: r.topic_key ?? r.topicKey,
      subject: r.subject,
      difficulty: r.difficulty ?? 2,
      correct: r.is_correct ?? r.correct ?? false,
      timeSpentMs: r.time_ms ?? r.timeSpentMs ?? 0,
      mode: r.mode || 'focused',
      sessionId: r.session_id ?? r.sessionId,
    }));
    localStorage.setItem(prefix + 'question-results', JSON.stringify(qr));
  }

  if (serverData.seenQuestions?.length > 0) {
    const sq = {};
    serverData.seenQuestions.forEach(r => {
      const key = r.topic_key;
      if (!sq[key]) sq[key] = [];
      if (!sq[key].includes(r.question_id)) sq[key].push(r.question_id);
    });
    localStorage.setItem(prefix + 'seen-questions', JSON.stringify(sq));
  }

  if (serverData.topicPerformance?.length > 0) {
    const tp = {};
    serverData.topicPerformance.forEach(r => { tp[r.topic_key] = r.data; });
    localStorage.setItem(prefix + 'topic-performance', JSON.stringify(tp));
  }

  if (serverData.practiceSessions?.length > 0) {
    localStorage.setItem(prefix + 'practice-log', JSON.stringify(
      serverData.practiceSessions.map(r => ({ ...r.data, date: r.session_date }))
    ));
  }

  if (serverData.streaks) {
    localStorage.setItem(prefix + 'streaks', JSON.stringify({
      currentStreak: serverData.streaks.current_streak,
      longestStreak: serverData.streaks.longest_streak,
      lastQuizDate: serverData.streaks.last_quiz_date,
      streakHistory: serverData.streaks.streak_history,
    }));
  }

  if (serverData.prepPoints) {
    localStorage.setItem(prefix + 'prep-points', JSON.stringify({
      total: serverData.prepPoints.total,
      level: serverData.prepPoints.level,
      todayPP: serverData.prepPoints.today_pp,
      todayDate: serverData.prepPoints.today_date,
    }));
  }

  if (serverData.achievements?.length > 0) {
    localStorage.setItem(prefix + 'achievements', JSON.stringify(
      serverData.achievements.map(a => ({ id: a.achievement_id, unlockedAt: a.unlocked_at }))
    ));
  }

  if (serverData.seenTips?.length > 0) {
    localStorage.setItem(prefix + 'seen-tips', JSON.stringify(
      serverData.seenTips.map(t => ({ id: t.tip_id, lastSeenDate: t.last_seen_date }))
    ));
  }

  if (serverData.mockTestResults?.length > 0) {
    const mockHistory = serverData.mockTestResults.map(r => ({
      subject: r.subject, totalQuestions: r.total_questions,
      totalCorrect: r.total_correct, percentage: r.percentage,
      timeTaken: r.time_taken, timeLimit: r.time_limit,
      sectionResults: r.section_results, questionTimes: r.question_times,
      date: r.completed_at,
    }));
    localStorage.setItem(prefix + 'mock-test-history', JSON.stringify(mockHistory));
  }

  if (serverData.preferences?.last_session_date) {
    localStorage.setItem(prefix + 'last-session-date',
      JSON.stringify(serverData.preferences.last_session_date)
    );
  }
}

// ── Tests ──

beforeEach(() => {
  localStorage.clear();
});

describe('seedLocalStorage — server to localStorage format conversion', () => {

  beforeEach(() => {
    seedLocalStorage('Evie', mockServerData);
  });

  // ── Quiz History ──

  describe('quiz-history', () => {
    it('has all required fields', () => {
      const quizHistory = JSON.parse(localStorage.getItem('user:Evie:quiz-history'));
      expect(quizHistory).toHaveLength(2);

      const quiz = quizHistory[0];
      expect(quiz).toHaveProperty('id');
      expect(quiz).toHaveProperty('topic');
      expect(quiz).toHaveProperty('subject');
      expect(quiz).toHaveProperty('score');
      expect(quiz).toHaveProperty('total');
      expect(quiz).toHaveProperty('percentage');
      expect(quiz).toHaveProperty('date');
    });

    it('calculates percentage correctly', () => {
      const quizHistory = JSON.parse(localStorage.getItem('user:Evie:quiz-history'));
      expect(quizHistory[0].percentage).toBe(80); // 8/10
      expect(quizHistory[1].percentage).toBe(50); // 5/10
    });

    it('generates numeric id from completed_at', () => {
      const quizHistory = JSON.parse(localStorage.getItem('user:Evie:quiz-history'));
      expect(typeof quizHistory[0].id).toBe('number');
      expect(quizHistory[0].id).toBe(Date.parse('2026-04-08T10:30:00.000Z'));
    });

    it('is readable by useUserData', () => {
      const { result } = renderHook(() => useUserData('Evie'));
      expect(result.current.quizHistory).toHaveLength(2);
      expect(result.current.quizHistory[0].percentage).toBe(80);
      expect(result.current.quizHistory[0].score).toBe(8);
      expect(result.current.quizHistory[0].total).toBe(10);
    });

    it('handles zero total without NaN', () => {
      seedLocalStorage('Test', {
        ...mockServerData,
        quizResults: [{ ...mockServerData.quizResults[0], score: 0, total: 0 }],
      });
      const qh = JSON.parse(localStorage.getItem('user:Test:quiz-history'));
      expect(qh[0].percentage).toBe(0);
      expect(Number.isNaN(qh[0].percentage)).toBe(false);
    });
  });

  // ── Question Results ──

  describe('question-results', () => {
    it('has all required fields in camelCase', () => {
      const qr = JSON.parse(localStorage.getItem('user:Evie:question-results'));
      expect(qr).toHaveLength(2);

      const r = qr[0];
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('date');
      expect(r).toHaveProperty('questionId');
      expect(r).toHaveProperty('topicKey');
      expect(r).toHaveProperty('subject');
      expect(r).toHaveProperty('difficulty');
      expect(r).toHaveProperty('correct');
      expect(r).toHaveProperty('timeSpentMs');
      expect(r).toHaveProperty('mode');
      expect(r).toHaveProperty('sessionId');
    });

    it('converts snake_case server fields to camelCase', () => {
      const qr = JSON.parse(localStorage.getItem('user:Evie:question-results'));
      expect(qr[0].questionId).toBe(42);     // from question_id
      expect(qr[0].topicKey).toBe('fractions'); // from topic_key
      expect(qr[0].correct).toBe(true);       // from is_correct
      expect(qr[0].timeSpentMs).toBe(8500);   // from time_ms
      expect(qr[0].sessionId).toBe(9000);     // from session_id
    });

    it('second result has correct=false', () => {
      const qr = JSON.parse(localStorage.getItem('user:Evie:question-results'));
      expect(qr[1].correct).toBe(false);
      expect(qr[1].difficulty).toBe(3);
    });

    it('is readable by useUserData', () => {
      const { result } = renderHook(() => useUserData('Evie'));
      expect(result.current.questionResults).toHaveLength(2);
      expect(result.current.questionResults[0].correct).toBe(true);
      expect(result.current.questionResults[0].topicKey).toBe('fractions');
    });
  });

  // ── Seen Questions ──

  describe('seen-questions', () => {
    it('groups by topicKey with arrays of question IDs', () => {
      const sq = JSON.parse(localStorage.getItem('user:Evie:seen-questions'));
      expect(sq).toEqual({
        fractions: [42, 43],
        decimals: [10],
      });
    });

    it('does not duplicate question IDs', () => {
      seedLocalStorage('Dedup', {
        ...mockServerData,
        seenQuestions: [
          { question_id: 42, topic_key: 'fractions', subject: 'maths' },
          { question_id: 42, topic_key: 'fractions', subject: 'maths' },
        ],
      });
      const sq = JSON.parse(localStorage.getItem('user:Dedup:seen-questions'));
      expect(sq.fractions).toEqual([42]);
    });

    it('is readable by useUserData', () => {
      const { result } = renderHook(() => useUserData('Evie'));
      expect(result.current.seenQuestions).toEqual({
        fractions: [42, 43],
        decimals: [10],
      });
    });
  });

  // ── Topic Performance ──

  describe('topic-performance', () => {
    it('maps topicKey to {correct, total} objects', () => {
      const tp = JSON.parse(localStorage.getItem('user:Evie:topic-performance'));
      expect(tp.fractions).toEqual({ correct: 15, total: 20 });
      expect(tp.decimals).toEqual({ correct: 8, total: 10 });
    });

    it('is readable by useUserData', () => {
      const { result } = renderHook(() => useUserData('Evie'));
      expect(result.current.topicPerformance.fractions).toEqual({ correct: 15, total: 20 });
    });
  });

  // ── Streaks ──

  describe('streaks', () => {
    it('converts snake_case to camelCase', () => {
      const streaks = JSON.parse(localStorage.getItem('user:Evie:streaks'));
      expect(streaks.currentStreak).toBe(5);
      expect(streaks.longestStreak).toBe(12);
      expect(streaks.lastQuizDate).toBe('2026-04-08');
      expect(streaks.streakHistory).toHaveLength(5);
    });
  });

  // ── Prep Points ──

  describe('prep-points', () => {
    it('converts snake_case to camelCase', () => {
      const pp = JSON.parse(localStorage.getItem('user:Evie:prep-points'));
      expect(pp.total).toBe(1250);
      expect(pp.level).toBe(4);
      expect(pp.todayPP).toBe(80);
      expect(pp.todayDate).toBe('2026-04-08');
    });
  });

  // ── Achievements ──

  describe('achievements', () => {
    it('maps to {id, unlockedAt} format', () => {
      const achievements = JSON.parse(localStorage.getItem('user:Evie:achievements'));
      expect(achievements).toHaveLength(2);
      expect(achievements[0]).toEqual({
        id: 'first-quiz',
        unlockedAt: '2026-03-01T09:00:00.000Z',
      });
    });
  });

  // ── Practice Log ──

  describe('practice-log', () => {
    it('merges session data with session_date as date', () => {
      const log = JSON.parse(localStorage.getItem('user:Evie:practice-log'));
      expect(log).toHaveLength(1);
      expect(log[0].date).toBe('2026-04-08');
      expect(log[0].questionsAttempted).toBe(10);
      expect(log[0].questionsCorrect).toBe(8);
    });
  });

  // ── Mock Test History ──

  describe('mock-test-history', () => {
    it('converts snake_case to camelCase', () => {
      const mh = JSON.parse(localStorage.getItem('user:Evie:mock-test-history'));
      expect(mh).toHaveLength(1);
      expect(mh[0].totalQuestions).toBe(50);
      expect(mh[0].totalCorrect).toBe(38);
      expect(mh[0].percentage).toBe(76);
      expect(mh[0].timeTaken).toBe(2400);
      expect(mh[0].timeLimit).toBe(3000);
    });
  });

  // ── Empty data does not overwrite ──

  describe('empty server data', () => {
    it('does not create keys when server arrays are empty', () => {
      localStorage.clear();
      // Pre-seed with existing local data
      localStorage.setItem('user:Test:quiz-history', JSON.stringify([{ topic: 'existing' }]));

      seedLocalStorage('Test', {
        quizResults: [],
        questionResults: [],
        seenQuestions: [],
        topicPerformance: [],
        practiceSessions: [],
        achievements: [],
        seenTips: [],
        mockTestResults: [],
        lessonHistory: [],
        leitnerQueue: [],
      });

      // Existing data should NOT be overwritten
      const qh = JSON.parse(localStorage.getItem('user:Test:quiz-history'));
      expect(qh).toEqual([{ topic: 'existing' }]);
    });

    it('does not create streaks/prepPoints keys when server has none', () => {
      localStorage.clear();
      seedLocalStorage('Test', {
        quizResults: [],
        questionResults: [],
        seenQuestions: [],
        topicPerformance: [],
        practiceSessions: [],
        achievements: [],
        seenTips: [],
        mockTestResults: [],
        lessonHistory: [],
        leitnerQueue: [],
      });

      expect(localStorage.getItem('user:Test:streaks')).toBeNull();
      expect(localStorage.getItem('user:Test:prep-points')).toBeNull();
    });
  });
});

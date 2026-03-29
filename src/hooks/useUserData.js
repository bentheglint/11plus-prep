import { useState, useCallback, useEffect, useRef } from 'react';

// Per-user localStorage isolation
// All keys prefixed with user:${name}: to keep each user's data separate
// Handles migration from old shared (unprefixed) data on first load

const KEYS = [
  'quiz-history',
  'topic-performance',
  'seen-questions',
  'mock-test-history',
  'lesson-history',
  'question-results',
  'practice-log',
  'streaks',
  'prep-points',
  'achievements',
];

function userKey(userName, key) {
  return `user:${userName}:${key}`;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Migrate old shared data to user-prefixed keys on first load
function migrateIfNeeded(userName) {
  const migratedKey = userKey(userName, 'migrated');
  if (localStorage.getItem(migratedKey)) return; // already migrated

  const sharedKeys = [
    'quiz-history',
    'topic-performance',
    'seen-questions',
    'lesson-history',
  ];

  let migrated = false;
  sharedKeys.forEach(key => {
    const shared = localStorage.getItem(key);
    const userPrefixed = localStorage.getItem(userKey(userName, key));
    if (shared && !userPrefixed) {
      localStorage.setItem(userKey(userName, key), shared);
      migrated = true;
    }
  });

  // Also migrate mock-test-history
  const sharedMock = localStorage.getItem('mock-test-history');
  const userMock = localStorage.getItem(userKey(userName, 'mock-test-history'));
  if (sharedMock && !userMock) {
    localStorage.setItem(userKey(userName, 'mock-test-history'), sharedMock);
    migrated = true;
  }

  if (migrated) {
    localStorage.setItem(migratedKey, 'true');
  }
}

export default function useUserData(userName) {
  const prevUser = useRef(userName);

  // Run migration on mount or user change
  useEffect(() => {
    if (userName) migrateIfNeeded(userName);
  }, [userName]);

  // --- Quiz History ---
  const [quizHistory, setQuizHistory] = useState(() =>
    userName ? loadJSON(userKey(userName, 'quiz-history'), []) : []
  );

  // --- Topic Performance ---
  const [topicPerformance, setTopicPerformance] = useState(() =>
    userName ? loadJSON(userKey(userName, 'topic-performance'), {}) : {}
  );

  // --- Seen Questions ---
  const [seenQuestions, setSeenQuestions] = useState(() =>
    userName ? loadJSON(userKey(userName, 'seen-questions'), {}) : {}
  );

  // --- Mock Test History ---
  const [mockTestHistory, setMockTestHistory] = useState(() =>
    userName ? loadJSON(userKey(userName, 'mock-test-history'), []) : []
  );

  // --- Lesson History ---
  const [lessonHistory, setLessonHistory] = useState(() =>
    userName ? loadJSON(userKey(userName, 'lesson-history'), {}) : {}
  );

  // --- Question Results (NEW — per-question tracking) ---
  const [questionResults, setQuestionResults] = useState(() =>
    userName ? loadJSON(userKey(userName, 'question-results'), []) : []
  );

  // --- Practice Log (NEW — daily session summaries) ---
  const [practiceLog, setPracticeLog] = useState(() =>
    userName ? loadJSON(userKey(userName, 'practice-log'), []) : []
  );

  // --- Streaks ---
  const [streakData, setStreakData] = useState(() =>
    userName ? loadJSON(userKey(userName, 'streaks'), {
      currentStreak: 0, longestStreak: 0, lastQuizDate: null, streakHistory: []
    }) : { currentStreak: 0, longestStreak: 0, lastQuizDate: null, streakHistory: [] }
  );

  // --- Prep Points ---
  const [prepPointsData, setPrepPointsData] = useState(() =>
    userName ? loadJSON(userKey(userName, 'prep-points'), {
      total: 0, level: 0, todayPP: 0, todayDate: null
    }) : { total: 0, level: 0, todayPP: 0, todayDate: null }
  );

  // --- Achievements ---
  const [achievements, setAchievements] = useState(() =>
    userName ? loadJSON(userKey(userName, 'achievements'), []) : []
  );

  // --- Seen Tips ---
  const [seenTips, setSeenTips] = useState(() =>
    userName ? loadJSON(userKey(userName, 'seen-tips'), []) : []
  );

  // Reload all data when user changes
  useEffect(() => {
    if (userName && userName !== prevUser.current) {
      prevUser.current = userName;
      migrateIfNeeded(userName);
      setQuizHistory(loadJSON(userKey(userName, 'quiz-history'), []));
      setTopicPerformance(loadJSON(userKey(userName, 'topic-performance'), {}));
      setSeenQuestions(loadJSON(userKey(userName, 'seen-questions'), {}));
      setMockTestHistory(loadJSON(userKey(userName, 'mock-test-history'), []));
      setLessonHistory(loadJSON(userKey(userName, 'lesson-history'), {}));
      setQuestionResults(loadJSON(userKey(userName, 'question-results'), []));
      setPracticeLog(loadJSON(userKey(userName, 'practice-log'), []));
      setStreakData(loadJSON(userKey(userName, 'streaks'), {
        currentStreak: 0, longestStreak: 0, lastQuizDate: null, streakHistory: []
      }));
      setPrepPointsData(loadJSON(userKey(userName, 'prep-points'), {
        total: 0, level: 0, todayPP: 0, todayDate: null
      }));
      setAchievements(loadJSON(userKey(userName, 'achievements'), []));
      setSeenTips(loadJSON(userKey(userName, 'seen-tips'), []));
    }
  }, [userName]);

  // --- Save helpers (persist to localStorage and update state) ---

  const saveQuizResult = useCallback((result) => {
    if (!userName) return;
    const updated = [...quizHistory, result];
    setQuizHistory(updated);
    saveJSON(userKey(userName, 'quiz-history'), updated);
  }, [userName, quizHistory]);

  const saveTopicPerformance = useCallback((updated) => {
    if (!userName) return;
    setTopicPerformance(updated);
    saveJSON(userKey(userName, 'topic-performance'), updated);
  }, [userName]);

  const saveSeenQuestions = useCallback((updated) => {
    if (!userName) return;
    setSeenQuestions(updated);
    saveJSON(userKey(userName, 'seen-questions'), updated);
  }, [userName]);

  const saveMockTestResult = useCallback((result) => {
    if (!userName) return;
    const updated = [...mockTestHistory, result];
    setMockTestHistory(updated);
    saveJSON(userKey(userName, 'mock-test-history'), updated);
  }, [userName, mockTestHistory]);

  const saveLessonHistory = useCallback((updated) => {
    if (!userName) return;
    setLessonHistory(updated);
    saveJSON(userKey(userName, 'lesson-history'), updated);
  }, [userName]);

  const saveQuestionResult = useCallback((result) => {
    if (!userName) return;
    // Rolling window: keep last 5000 results to prevent localStorage bloat
    const updated = [...questionResults, result].slice(-5000);
    setQuestionResults(updated);
    saveJSON(userKey(userName, 'question-results'), updated);
  }, [userName, questionResults]);

  const savePracticeSession = useCallback((session) => {
    if (!userName) return;
    const updated = [...practiceLog, session];
    setPracticeLog(updated);
    saveJSON(userKey(userName, 'practice-log'), updated);
  }, [userName, practiceLog]);

  const saveStreakData = useCallback((data) => {
    if (!userName) return;
    setStreakData(data);
    saveJSON(userKey(userName, 'streaks'), data);
  }, [userName]);

  const savePrepPoints = useCallback((data) => {
    if (!userName) return;
    setPrepPointsData(data);
    saveJSON(userKey(userName, 'prep-points'), data);
  }, [userName]);

  const saveAchievements = useCallback((data) => {
    if (!userName) return;
    setAchievements(data);
    saveJSON(userKey(userName, 'achievements'), data);
  }, [userName]);

  const markTipSeen = useCallback((tipId) => {
    if (!userName) return;
    const updated = seenTips.includes(tipId) ? seenTips : [...seenTips, tipId];
    setSeenTips(updated);
    saveJSON(userKey(userName, 'seen-tips'), updated);
  }, [userName, seenTips]);

  return {
    // Data
    quizHistory,
    topicPerformance,
    seenQuestions,
    mockTestHistory,
    lessonHistory,
    questionResults,
    practiceLog,
    streakData,
    prepPointsData,
    achievements,
    // Save methods
    saveQuizResult,
    saveTopicPerformance,
    saveSeenQuestions,
    saveMockTestResult,
    saveLessonHistory,
    saveQuestionResult,
    savePracticeSession,
    saveStreakData,
    savePrepPoints,
    saveAchievements,
    seenTips,
    markTipSeen,
  };
}

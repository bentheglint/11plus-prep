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
  'last-session-date',
  'leitner-queue',
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

  // --- Seen Tips (format: [{ id, lastSeenDate }]) ---
  const [seenTips, setSeenTips] = useState(() => {
    if (!userName) return [];
    const raw = loadJSON(userKey(userName, 'seen-tips'), []);
    // Migrate from old format (flat array of strings) to new format (array of objects)
    if (raw.length > 0 && typeof raw[0] === 'string') {
      const migrated = raw.map(id => ({ id, lastSeenDate: new Date().toISOString() }));
      saveJSON(userKey(userName, 'seen-tips'), migrated);
      return migrated;
    }
    return raw;
  });

  // Derived: just the IDs for backward compat (used by StudyToolkitScreen etc.)
  const seenTipIds = seenTips.map(t => t.id);

  // --- Last Session Date ---
  const [lastSessionDate, setLastSessionDate] = useState(() =>
    userName ? loadJSON(userKey(userName, 'last-session-date'), null) : null
  );

  // --- Leitner Queue ---
  const [leitnerQueue, setLeitnerQueue] = useState(() =>
    userName ? loadJSON(userKey(userName, 'leitner-queue'), []) : []
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
      // Migrate seenTips if needed on user switch
      const rawTips = loadJSON(userKey(userName, 'seen-tips'), []);
      if (rawTips.length > 0 && typeof rawTips[0] === 'string') {
        const migrated = rawTips.map(id => ({ id, lastSeenDate: new Date().toISOString() }));
        saveJSON(userKey(userName, 'seen-tips'), migrated);
        setSeenTips(migrated);
      } else {
        setSeenTips(rawTips);
      }
      setLastSessionDate(loadJSON(userKey(userName, 'last-session-date'), null));
      setLeitnerQueue(loadJSON(userKey(userName, 'leitner-queue'), []));
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
    setMockTestHistory(prev => {
      const updated = [...prev, result];
      saveJSON(userKey(userName, 'mock-test-history'), updated);
      return updated;
    });
  }, [userName]);

  const saveLessonHistory = useCallback((updated) => {
    if (!userName) return;
    setLessonHistory(updated);
    saveJSON(userKey(userName, 'lesson-history'), updated);
  }, [userName]);

  const saveQuestionResult = useCallback((result) => {
    if (!userName) return;
    // Use functional updater to avoid stale closure when called rapidly in a loop
    setQuestionResults(prev => {
      const updated = [...prev, result].slice(-5000);
      saveJSON(userKey(userName, 'question-results'), updated);
      return updated;
    });
  }, [userName]);

  const savePracticeSession = useCallback((session) => {
    if (!userName) return;
    setPracticeLog(prev => {
      const updated = [...prev, session];
      saveJSON(userKey(userName, 'practice-log'), updated);
      return updated;
    });
  }, [userName]);

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
    const now = new Date().toISOString();
    const existing = seenTips.findIndex(t => t.id === tipId);
    let updated;
    if (existing >= 0) {
      // Update lastSeenDate for existing entry
      updated = seenTips.map((t, i) => i === existing ? { ...t, lastSeenDate: now } : t);
    } else {
      // Add new entry
      updated = [...seenTips, { id: tipId, lastSeenDate: now }];
    }
    setSeenTips(updated);
    saveJSON(userKey(userName, 'seen-tips'), updated);
  }, [userName, seenTips]);

  const saveLastSessionDate = useCallback((date) => {
    if (!userName) return;
    setLastSessionDate(date);
    saveJSON(userKey(userName, 'last-session-date'), date);
  }, [userName]);

  const saveLeitnerQueue = useCallback((queue) => {
    if (!userName) return;
    setLeitnerQueue(queue);
    saveJSON(userKey(userName, 'leitner-queue'), queue);
  }, [userName]);

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
    seenTipIds,
    markTipSeen,
    lastSessionDate,
    saveLastSessionDate,
    leitnerQueue,
    saveLeitnerQueue,
  };
}

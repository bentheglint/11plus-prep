import { useState, useCallback, useEffect, useRef } from 'react';
import { createSyncQueue } from '../utils/syncQueue';

// ── D1-First Data Hook ──
// Replaces useUserData. Same return API, different internals.
// Source of truth: D1 (via /api/data/all on mount, /api/data/batch on write).
// Offline fallback: SyncQueue in localStorage + cached state.
// Dual-write to legacy localStorage keys during rollback window (Codex Finding 2).

const API_URL = process.env.REACT_APP_TUTOR_API_URL;


// Default empty state shapes
const DEFAULTS = {
  quizHistory: [],
  topicPerformance: {},
  seenQuestions: {},
  mockTestHistory: [],
  lessonHistory: {},
  questionResults: [],
  practiceLog: [],
  streakData: { currentStreak: 0, longestStreak: 0, lastQuizDate: null, streakHistory: [] },
  prepPointsData: { total: 0, level: 0, todayPP: 0, todayDate: null },
  achievements: [],
  seenTips: [],
  lastSessionDate: null,
  leitnerQueue: [],
};

// Legacy topic key aliases
const TOPIC_KEY_ALIASES = { primenumbers: 'primenumbersfactors' };
function normaliseTopicKeys(data) {
  if (!Array.isArray(data)) return data;
  let changed = false;
  const result = data.map(item => {
    if (item.topicKey && TOPIC_KEY_ALIASES[item.topicKey]) {
      changed = true;
      return { ...item, topicKey: TOPIC_KEY_ALIASES[item.topicKey] };
    }
    return item;
  });
  return changed ? result : data;
}

// SQLite datetime ("2026-04-09 10:31:00") → JS-compatible ISO ("2026-04-09T10:31:00Z")
function normaliseDate(d) {
  if (!d) return d;
  return d.includes('T') ? d : d.replace(' ', 'T') + 'Z';
}

// ── Server → Client Format Transformations ──
// These mirror the transformations that seedLocalStorage() used to do.
//
// ORDERING CONVENTION: All arrays returned by transformServerData are
// NEWEST-FIRST (sorted DESC by timestamp in bulk.js). Do NOT call .reverse()
// on these arrays expecting them to be oldest-first. If you need chronological
// order for display, sort explicitly by date — don't rely on source order.
// See: ChildProgressView Recent Activity bug (fixed 14 Apr 2026).

function transformServerData(serverData) {
  // quizHistory — newest-first (ORDER BY completed_at DESC)
  const quizHistory = (serverData.quizResults || []).map(r => ({
    id: Date.parse(normaliseDate(r.completed_at)) || Date.now(),
    topic: r.topic_key,
    subject: r.subject,
    score: r.score,
    total: r.total,
    percentage: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
    date: normaliseDate(r.completed_at),
  }));

  // mockTestHistory — newest-first (ORDER BY completed_at DESC)
  const mockTestHistory = (serverData.mockTestResults || []).map(r => ({
    subject: r.subject,
    totalQuestions: r.total_questions,
    totalCorrect: r.total_correct,
    percentage: r.percentage,
    timeTaken: r.time_taken,
    timeLimit: r.time_limit,
    sectionResults: r.section_results,
    questionTimes: r.question_times,
    date: normaliseDate(r.completed_at),
  }));

  // questionResults — newest-first (ORDER BY attempted_at DESC)
  const questionResults = normaliseTopicKeys((serverData.questionResults || []).map(r => {
    const date = normaliseDate(r.attempted_at || r.created_at || r.date);
    return {
    id: r.id || Date.parse(date) || Date.now(),
    date,
    questionId: r.question_id ?? r.questionId,
    topicKey: r.topic_key ?? r.topicKey,
    subject: r.subject,
    difficulty: r.difficulty ?? 2,
    correct: r.is_correct ?? r.correct ?? false,
    timeSpentMs: r.time_ms ?? r.timeSpentMs ?? 0,
    mode: r.mode || 'focused',
    sessionId: r.session_id ?? r.sessionId,
  }; }));

  const topicPerformance = {};
  (serverData.topicPerformance || []).forEach(r => { topicPerformance[r.topic_key] = r.data; });

  const lessonHistory = {};
  (serverData.lessonHistory || []).forEach(r => { lessonHistory[r.lesson_id] = { completedAt: r.completed_at }; });

  const seenQuestions = {};
  (serverData.seenQuestions || []).forEach(r => {
    const key = r.topic_key;
    if (!seenQuestions[key]) seenQuestions[key] = [];
    if (!seenQuestions[key].includes(r.question_id)) seenQuestions[key].push(r.question_id);
  });

  // practiceLog — newest-first (ORDER BY session_date DESC)
  const practiceLog = (serverData.practiceSessions || []).map(r => ({
    ...r.data,
    date: r.session_date,
  }));

  const streakData = serverData.streaks ? {
    currentStreak: serverData.streaks.current_streak,
    longestStreak: serverData.streaks.longest_streak,
    lastQuizDate: serverData.streaks.last_quiz_date,
    streakHistory: serverData.streaks.streak_history || [],
  } : DEFAULTS.streakData;

  const prepPointsData = serverData.prepPoints ? {
    total: serverData.prepPoints.total,
    level: serverData.prepPoints.level,
    todayPP: serverData.prepPoints.today_pp,
    todayDate: serverData.prepPoints.today_date,
  } : DEFAULTS.prepPointsData;

  const achievements = (serverData.achievements || []).map(a => ({
    id: a.achievement_id, unlockedAt: a.unlocked_at,
  }));

  const seenTips = (serverData.seenTips || []).map(t => ({
    id: t.tip_id, lastSeenDate: t.last_seen_date,
  }));

  const lastSessionDate = serverData.preferences?.last_session_date || null;

  const leitnerQueue = serverData.leitnerQueue || [];

  // Extract versions for mutable records
  const versions = {
    streaks: serverData.streaks?.version ?? 1,
    prepPoints: serverData.prepPoints?.version ?? 1,
    preferences: serverData.preferences?.version ?? 1,
  };

  return {
    quizHistory, topicPerformance, seenQuestions, mockTestHistory,
    lessonHistory, questionResults, practiceLog, streakData,
    prepPointsData, achievements, seenTips, lastSessionDate, leitnerQueue,
    versions,
  };
}

// ── Legacy localStorage Helpers (dual-write for rollback window) ──

function userKey(userName, key) {
  return `user:${userName}:${key}`;
}

function legacyWrite(userName, key, value) {
  try {
    localStorage.setItem(userKey(userName, key), JSON.stringify(value));
  } catch { /* localStorage full — non-critical */ }
}

function legacyRead(userName, key, fallback) {
  try {
    const raw = localStorage.getItem(userKey(userName, key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Cache key for D1 data (offline fallback)
function cacheKey(userName) {
  return `d1-cache:${userName}`;
}

function writeCache(userName, serverData) {
  try {
    localStorage.setItem(cacheKey(userName), JSON.stringify(serverData));
  } catch { /* non-critical */ }
}

function readCache(userName) {
  try {
    const raw = localStorage.getItem(cacheKey(userName));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── API Helpers ──

async function apiFetch(path, getToken) {
  if (!getToken) { console.warn('[useD1Data] apiFetch: no getToken'); return null; }
  if (!API_URL) { console.warn('[useD1Data] apiFetch: no API_URL'); return null; }
  try {
    const token = await getToken();
    if (!token) { console.warn('[useD1Data] apiFetch: getToken returned null'); return null; }
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { console.warn(`[useD1Data] apiFetch ${path}: ${res.status}`); return null; }
    return res.json();
  } catch (err) {
    console.warn(`[useD1Data] apiFetch ${path} error:`, err.message);
    return null;
  }
}

async function apiPost(path, body, getToken) {
  if (!getToken || !API_URL) return null;
  try {
    const token = await getToken();
    if (!token) return null;
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn(`[useD1Data] POST ${path} failed:`, data.error || res.status);
      return null;
    }
    return res.json();
  } catch (err) {
    console.warn(`[useD1Data] POST ${path} error:`, err.message);
    return null;
  }
}

// Check if legacy localStorage has data that hasn't been migrated to D1
function hasLegacyData(userName) {
  return !!(
    localStorage.getItem(userKey(userName, 'quiz-history')) ||
    localStorage.getItem(userKey(userName, 'question-results')) ||
    localStorage.getItem(userKey(userName, 'streaks'))
  );
}

// ── The Hook ──

export default function useD1Data(userName, getToken) {
  const prevUser = useRef(userName);
  const versionsRef = useRef({ streaks: 1, prepPoints: 1, preferences: 1 });
  const batchingRef = useRef(false);
  const syncQueueRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // ── State (same shape as old useUserData) ──
  const [quizHistory, setQuizHistory] = useState(DEFAULTS.quizHistory);
  const [topicPerformance, setTopicPerformance] = useState(DEFAULTS.topicPerformance);
  const [seenQuestions, setSeenQuestions] = useState(DEFAULTS.seenQuestions);
  const [mockTestHistory, setMockTestHistory] = useState(DEFAULTS.mockTestHistory);
  const [lessonHistory, setLessonHistory] = useState(DEFAULTS.lessonHistory);
  const [questionResults, setQuestionResults] = useState(DEFAULTS.questionResults);
  const [practiceLog, setPracticeLog] = useState(DEFAULTS.practiceLog);
  const [streakData, setStreakData] = useState(DEFAULTS.streakData);
  const [prepPointsData, setPrepPointsData] = useState(DEFAULTS.prepPointsData);
  const [achievements, setAchievements] = useState(DEFAULTS.achievements);
  const [seenTips, setSeenTips] = useState(DEFAULTS.seenTips);
  const [lastSessionDate, setLastSessionDate] = useState(DEFAULTS.lastSessionDate);
  const [leitnerQueue, setLeitnerQueue] = useState(DEFAULTS.leitnerQueue);

  const seenTipIds = seenTips.map(t => t.id);

  // ── Initialize SyncQueue ──
  useEffect(() => {
    if (userName) {
      syncQueueRef.current = createSyncQueue(userName);
    }
  }, [userName]);

  // ── Populate state from a transformed data object ──
  const populateState = useCallback((data) => {
    setQuizHistory(data.quizHistory || DEFAULTS.quizHistory);
    setTopicPerformance(data.topicPerformance || DEFAULTS.topicPerformance);
    setSeenQuestions(data.seenQuestions || DEFAULTS.seenQuestions);
    setMockTestHistory(data.mockTestHistory || DEFAULTS.mockTestHistory);
    setLessonHistory(data.lessonHistory || DEFAULTS.lessonHistory);
    setQuestionResults(data.questionResults || DEFAULTS.questionResults);
    setPracticeLog(data.practiceLog || DEFAULTS.practiceLog);
    setStreakData(data.streakData || DEFAULTS.streakData);
    setPrepPointsData(data.prepPointsData || DEFAULTS.prepPointsData);
    setAchievements(data.achievements || DEFAULTS.achievements);
    setSeenTips(data.seenTips || DEFAULTS.seenTips);
    setLastSessionDate(data.lastSessionDate || DEFAULTS.lastSessionDate);
    setLeitnerQueue(data.leitnerQueue || DEFAULTS.leitnerQueue);
    if (data.versions) versionsRef.current = data.versions;
  }, []);

  // ── Load from D1 on mount / user change ──
  useEffect(() => {
    if (!userName) return;

    let cancelled = false;

    async function loadData() {
      // 1. Try fetching from D1
      const serverData = await apiFetch('/api/data/all', getToken);

      if (cancelled) return;

      if (serverData) {
        // Check if D1 is empty but localStorage has data (Codex Finding 3)
        const d1IsEmpty = !serverData.quizResults?.length &&
          !serverData.questionResults?.length &&
          !serverData.streaks;

        if (d1IsEmpty && hasLegacyData(userName)) {
          // Trigger migration: push localStorage data to D1
          console.log('[useD1Data] D1 empty, legacy data found — migrating...');
          const migrationPayload = {
            quizHistory: legacyRead(userName, 'quiz-history', []),
            mockTestHistory: legacyRead(userName, 'mock-test-history', []),
            questionResults: legacyRead(userName, 'question-results', []),
            lessonHistory: legacyRead(userName, 'lesson-history', {}),
            topicPerformance: legacyRead(userName, 'topic-performance', {}),
            leitnerQueue: legacyRead(userName, 'leitner-queue', []),
            practiceLog: legacyRead(userName, 'practice-log', []),
            seenQuestions: legacyRead(userName, 'seen-questions', {}),
            streaks: legacyRead(userName, 'streaks', null),
            prepPoints: legacyRead(userName, 'prep-points', null),
            achievements: legacyRead(userName, 'achievements', []),
            seenTips: legacyRead(userName, 'seen-tips', []),
            lastSessionDate: legacyRead(userName, 'last-session-date', null),
          };
          await apiPost('/api/data/migrate', migrationPayload, getToken);

          // Re-fetch after migration
          const freshData = await apiFetch('/api/data/all', getToken);
          if (cancelled) return;
          if (freshData) {
            const transformed = transformServerData(freshData);
            populateState(transformed);
            writeCache(userName, freshData);
            setLoaded(true);
            return;
          }
        }

        // Normal path: D1 has data
        const transformed = transformServerData(serverData);
        populateState(transformed);
        writeCache(userName, serverData);
        setLoaded(true);

        // Flush any pending SyncQueue operations
        if (syncQueueRef.current && !syncQueueRef.current.isEmpty()) {
          flushQueue();
        }
        return;
      }

      // 2. D1 fetch failed — try D1 cache
      const cached = readCache(userName);
      if (cached) {
        console.log('[useD1Data] D1 unavailable, loading from cache');
        const transformed = transformServerData(cached);
        populateState(transformed);
        setLoaded(true);
        return;
      }

      // 3. No cache either — try legacy localStorage (first-time fallback)
      if (hasLegacyData(userName)) {
        console.log('[useD1Data] No D1 or cache, falling back to legacy localStorage');
        populateState({
          quizHistory: normaliseTopicKeys(legacyRead(userName, 'quiz-history', [])),
          topicPerformance: legacyRead(userName, 'topic-performance', {}),
          seenQuestions: legacyRead(userName, 'seen-questions', {}),
          mockTestHistory: legacyRead(userName, 'mock-test-history', []),
          lessonHistory: legacyRead(userName, 'lesson-history', {}),
          questionResults: normaliseTopicKeys(legacyRead(userName, 'question-results', [])),
          practiceLog: legacyRead(userName, 'practice-log', []),
          streakData: legacyRead(userName, 'streaks', DEFAULTS.streakData),
          prepPointsData: legacyRead(userName, 'prep-points', DEFAULTS.prepPointsData),
          achievements: legacyRead(userName, 'achievements', []),
          seenTips: legacyRead(userName, 'seen-tips', []),
          lastSessionDate: legacyRead(userName, 'last-session-date', null),
          leitnerQueue: legacyRead(userName, 'leitner-queue', []),
        });
        setLoaded(true);
        return;
      }

      // 4. Truly empty — new user
      setLoaded(true);
    }

    loadData();
    prevUser.current = userName;

    return () => { cancelled = true; };
  }, [userName, getToken, populateState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Online/offline listener ──
  useEffect(() => {
    const handleOnline = () => {
      if (syncQueueRef.current && !syncQueueRef.current.isEmpty()) {
        flushQueue();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Flush SyncQueue to D1 ──
  const flushQueue = useCallback(async () => {
    const queue = syncQueueRef.current;
    if (!queue || queue.isEmpty() || !getToken || !API_URL) return;

    const { valid, quarantined } = queue.validateOwnership();
    if (quarantined.length > 0) {
      queue.remove(quarantined.map(op => op.uuid));
    }
    if (valid.length === 0) return;

    const ops = valid.slice(0, 50); // Batch up to 50 at a time
    const result = await apiPost('/api/data/batch', { operations: ops }, getToken);

    if (result) {
      // Remove successfully processed operations
      const processed = (result.results || [])
        .filter(r => r.status === 'ok' || r.status === 'duplicate')
        .map(r => r.uuid);
      queue.remove(processed);

      // Update version cache from response
      if (result.versions) {
        versionsRef.current = {
          streaks: result.versions.streaks ?? versionsRef.current.streaks,
          prepPoints: result.versions.prepPoints ?? versionsRef.current.prepPoints,
          preferences: result.versions.preferences ?? versionsRef.current.preferences,
        };
      }

      // Handle conflicts — update local state with server data
      const conflicts = (result.results || []).filter(r => r.status === 'conflict');
      for (const conflict of conflicts) {
        queue.remove([conflict.uuid]); // Don't retry conflicts
        // Could re-fetch specific data here, but for now trust the version update
      }

      // If there are more operations, flush again
      if (!queue.isEmpty()) {
        setTimeout(() => flushQueue(), 100);
      }
    } else {
      // Network failure — increment retry counts
      queue.incrementRetries(ops.map(op => op.uuid));
    }
  }, [getToken]);

  // ── Batch Mode ──
  const startBatch = useCallback(() => { batchingRef.current = true; }, []);
  const endBatch = useCallback(async () => {
    batchingRef.current = false;
    await flushQueue();
  }, [flushQueue]);

  // ── Enqueue helper (enqueues + optionally flushes) ──
  const enqueue = useCallback((type, payload) => {
    if (!syncQueueRef.current) return;
    syncQueueRef.current.enqueue(type, payload);
    if (!batchingRef.current) {
      flushQueue();
    }
  }, [flushQueue]);

  // ── Save Methods (same signatures as useUserData) ──

  const saveQuizResult = useCallback((result) => {
    if (!userName) return;
    const updated = [...quizHistory, result];
    setQuizHistory(updated);
    legacyWrite(userName, 'quiz-history', updated);
    enqueue('quiz-result', {
      topicKey: result.topic, subject: result.subject,
      score: result.score, total: result.total,
      timeSeconds: result.timeSeconds || null, quizMode: result.quizMode || null,
    });
  }, [userName, quizHistory, enqueue]);

  const saveTopicPerformance = useCallback((updated) => {
    if (!userName) return;
    setTopicPerformance(updated);
    legacyWrite(userName, 'topic-performance', updated);
    // Topic performance is synced per-key — enqueue each changed key
    // For now, just write to localStorage (same as old behavior — no individual sync)
  }, [userName]);

  const saveSeenQuestions = useCallback((updated) => {
    if (!userName) return;
    setSeenQuestions(updated);
    legacyWrite(userName, 'seen-questions', updated);
  }, [userName]);

  const saveMockTestResult = useCallback((result) => {
    if (!userName) return;
    setMockTestHistory(prev => {
      const updated = [...prev, result];
      legacyWrite(userName, 'mock-test-history', updated);
      return updated;
    });
    enqueue('mock-result', {
      subject: result.subject, totalQuestions: result.totalQuestions,
      totalCorrect: result.totalCorrect, percentage: result.percentage,
      timeTaken: result.timeTaken, timeLimit: result.timeLimit,
      sectionResults: result.sectionResults, questionTimes: result.questionTimes,
    });
  }, [userName, enqueue]);

  const saveLessonHistory = useCallback((updated) => {
    if (!userName) return;
    setLessonHistory(updated);
    legacyWrite(userName, 'lesson-history', updated);
  }, [userName]);

  const saveQuestionResult = useCallback((result) => {
    if (!userName) return;
    setQuestionResults(prev => {
      const updated = [...prev, result].slice(-5000);
      legacyWrite(userName, 'question-results', updated);
      return updated;
    });
    enqueue('question-result', {
      questionId: result.questionId, topicKey: result.topicKey,
      subject: result.subject, isCorrect: result.correct,
      timeMs: result.timeSpentMs, difficulty: result.difficulty,
    });
  }, [userName, enqueue]);

  const savePracticeSession = useCallback((session) => {
    if (!userName) return;
    setPracticeLog(prev => {
      const updated = [...prev, session];
      legacyWrite(userName, 'practice-log', updated);
      return updated;
    });
    enqueue('practice-session', {
      sessionDate: session.date || new Date().toISOString().slice(0, 10),
      data: session,
    });
  }, [userName, enqueue]);

  const saveStreakData = useCallback((data) => {
    if (!userName) return;
    setStreakData(data);
    legacyWrite(userName, 'streaks', data);
    enqueue('streaks', {
      version: versionsRef.current.streaks,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      lastQuizDate: data.lastQuizDate,
      streakHistory: data.streakHistory,
    });
  }, [userName, enqueue]);

  const savePrepPoints = useCallback((data) => {
    if (!userName) return;
    setPrepPointsData(data);
    legacyWrite(userName, 'prep-points', data);
    enqueue('prep-points', {
      version: versionsRef.current.prepPoints,
      total: data.total, level: data.level,
      todayPP: data.todayPP, todayDate: data.todayDate,
    });
  }, [userName, enqueue]);

  const saveAchievements = useCallback((data) => {
    if (!userName) return;
    if (Array.isArray(data)) {
      const currentIds = new Set(achievements.map(a => typeof a === 'string' ? a : a.id));
      data.forEach(a => {
        const id = typeof a === 'string' ? a : a.id;
        if (!currentIds.has(id)) {
          enqueue('achievement', { achievementId: id });
        }
      });
    }
    setAchievements(data);
    legacyWrite(userName, 'achievements', data);
  }, [userName, achievements, enqueue]);

  const markTipSeen = useCallback((tipId) => {
    if (!userName) return;
    const now = new Date().toISOString();
    const existing = seenTips.findIndex(t => t.id === tipId);
    let updated;
    if (existing >= 0) {
      updated = seenTips.map((t, i) => i === existing ? { ...t, lastSeenDate: now } : t);
    } else {
      updated = [...seenTips, { id: tipId, lastSeenDate: now }];
    }
    setSeenTips(updated);
    legacyWrite(userName, 'seen-tips', updated);
    enqueue('seen-tip', { tipId, lastSeenDate: now });
  }, [userName, seenTips, enqueue]);

  const saveLastSessionDate = useCallback((date) => {
    if (!userName) return;
    setLastSessionDate(date);
    legacyWrite(userName, 'last-session-date', date);
    enqueue('preferences', {
      version: versionsRef.current.preferences,
      lastSessionDate: date,
    });
  }, [userName, enqueue]);

  const saveLeitnerQueue = useCallback((queue) => {
    if (!userName) return;
    setLeitnerQueue(queue);
    legacyWrite(userName, 'leitner-queue', queue);
  }, [userName]);

  // ── Return (identical to old useUserData) ──
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
    // New methods (batch mode)
    startBatch,
    endBatch,
    // New metadata
    loaded,
  };
}

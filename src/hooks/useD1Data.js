import { useState, useCallback, useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { createSyncQueue } from '../utils/syncQueue';
import { recomputeStreakFromHistory } from './useStreaksAndPP';

// ── D1-First Data Hook ──
// Replaces useUserData. Same return API, different internals.
// Source of truth: D1 (via /api/data/all on mount, /api/data/batch on write).
// Offline fallback: SyncQueue in localStorage + cached state.
// Dual-write to legacy localStorage keys during rollback window (Codex Finding 2).

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// ── Flush Mutex (module-level, keyed by userName) ──
// Lives outside the hook so it survives StrictMode remounts and component
// unmount/remount cycles. Prevents the UUID-race where N parallel flushes
// (from rapid enqueue() calls during quiz completion) each pull the same
// ops, causing UNIQUE constraint failures on processed_operations.
// Keyed by userName so different children never block each other.
// Exported for testing — do not import from app code.
export const flushState = new Map(); // userName → { flushing: boolean, pending: boolean, backoffMs: number, lastFailedAt: number|null, permFailures: number }

export function getFlushState(userName) {
  if (!flushState.has(userName)) {
    flushState.set(userName, { flushing: false, pending: false, backoffMs: 0, lastFailedAt: null, permFailures: 0 });
  }
  return flushState.get(userName);
}

// Resets the mutex for a given user. Exported for testing — never call from
// app code.
export function _resetFlushStateForTests(userName) {
  if (userName) {
    flushState.delete(userName);
  } else {
    flushState.clear();
  }
}

// ── Cross-Tab Flush Lease ──
// Prevents two browser tabs from double-flushing the same queue.
// Uses a simple localStorage lease (no navigator.locks — not available on iOS 15.6 Safari).
// TabId is randomly generated once per tab load (module scope = stable per page lifecycle).
const TAB_ID = Math.random().toString(36).slice(2);
const LEASE_TTL_MS = 30000; // 30 seconds

function leaseKey(childId) {
  return `sync-flush-lease:${childId}`;
}

function acquireLease(childId) {
  const key = leaseKey(childId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const lease = JSON.parse(raw);
      if (lease.tabId !== TAB_ID && lease.expiresAt > Date.now()) {
        // Another tab holds a valid lease — skip flush, they'll drain it
        return false;
      }
    }
    // Either no lease, expired lease, or this tab already holds it — acquire/renew
    localStorage.setItem(key, JSON.stringify({ tabId: TAB_ID, expiresAt: Date.now() + LEASE_TTL_MS }));
    return true;
  } catch {
    // localStorage failure — proceed without lease (single-tab behaviour)
    return true;
  }
}

function renewLease(childId) {
  const key = leaseKey(childId);
  try {
    localStorage.setItem(key, JSON.stringify({ tabId: TAB_ID, expiresAt: Date.now() + LEASE_TTL_MS }));
  } catch { /* non-critical */ }
}

function releaseLease(childId) {
  const key = leaseKey(childId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const lease = JSON.parse(raw);
      if (lease.tabId === TAB_ID) {
        localStorage.removeItem(key);
      }
    }
  } catch { /* non-critical */ }
}

// ── Backoff schedule ──
// On transient failure: exponential backoff 2s → 4s → 8s … capped at 5 minutes.
// Resets to 0 on any successful flush.
const BACKOFF_MIN_MS = 2000;
const BACKOFF_MAX_MS = 5 * 60 * 1000; // 5 minutes

function nextBackoffMs(currentBackoffMs) {
  if (currentBackoffMs === 0) return BACKOFF_MIN_MS;
  return Math.min(currentBackoffMs * 2, BACKOFF_MAX_MS);
}

// ── Failure classification ──
// TRANSIENT: network error / HTTP 5xx / 429 — retry with backoff
// PERMANENT: HTTP 4xx — batch-level hard failure (rare; treat as transient ONCE,
//            dead-letter if 4xx repeats — a malformed batch must not silently delete ops)
const TRANSIENT_STATUS_THRESHOLD = 500; // >= 500 or no HTTP (network error)

/**
 * Returns { data, transient, permanent, statusCode }
 * - data: parsed JSON response or null
 * - transient: true = retry-able failure
 * - permanent: true = batch-level permanent failure (do not retry this specific batch)
 * - statusCode: HTTP status code or null if network error
 */
async function apiPostClassified(path, body, getToken) {
  if (!getToken || !API_URL) return { data: null, transient: true, permanent: false, statusCode: null };
  let token;
  try {
    token = await getToken();
    if (!token) return { data: null, transient: true, permanent: false, statusCode: null };
  } catch {
    return { data: null, transient: true, permanent: false, statusCode: null };
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  } catch (err) {
    // Network error — transient
    console.warn(`[useD1Data] POST ${path} network error:`, err.message);
    return { data: null, transient: true, permanent: false, statusCode: null };
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn(`[useD1Data] POST ${path} failed:`, data.error || res.status);

    if (res.status >= TRANSIENT_STATUS_THRESHOLD || res.status === 429) {
      // 5xx or 429 — transient, retry with backoff
      return { data: null, transient: true, permanent: false, statusCode: res.status };
    } else {
      // 4xx — permanent batch-level failure
      return { data: null, transient: false, permanent: true, statusCode: res.status };
    }
  }

  const data = await res.json().catch(() => null);
  return { data, transient: false, permanent: false, statusCode: res.status };
}

// ── Conflict retry round tracking (loop guard for section 3d) ──
// Keyed by a "logical record key" (e.g. 'streaks', 'preferences') per flush session
// not per uuid — so Device A conflict → merge → re-enqueue → re-conflict counts as round 2.
const conflictRoundsRef = new Map(); // mutexKey → Map<logicalKey, number>

function getConflictRounds(mutexKey) {
  if (!conflictRoundsRef.has(mutexKey)) conflictRoundsRef.set(mutexKey, new Map());
  return conflictRoundsRef.get(mutexKey);
}

function resetConflictRounds(mutexKey) {
  conflictRoundsRef.delete(mutexKey);
}


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

export function transformServerData(serverData) {
  // quizHistory — newest-first (ORDER BY completed_at DESC)
  const quizHistory = (serverData.quizResults || []).map(r => ({
    id: Date.parse(normaliseDate(r.completed_at)) || Date.now(),
    topic: r.topic_key,
    subject: r.subject,
    score: r.score,
    total: r.total,
    percentage: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
    date: normaliseDate(r.completed_at),
    sessionId: r.session_id || null, // null for pre-feature quizzes
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
    // selectedAnswer stored as JSON string in D1 — parse back on read
    let selectedAnswer = null;
    if (r.selected_answer) {
      try { selectedAnswer = JSON.parse(r.selected_answer); } catch { selectedAnswer = null; }
    } else if (r.selectedAnswer !== undefined) {
      selectedAnswer = r.selectedAnswer;
    }
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
    sessionId: r.session_id ?? r.sessionId ?? null,
    selectedAnswer, // null for pre-feature question_results rows
  }; }));

  const topicPerformance = {};
  (serverData.topicPerformance || []).forEach(r => { topicPerformance[r.topic_key] = r.data; });

  // lessonHistory — rebuilt from lesson_history rows into topic-keyed shape:
  // { topicKey: { shown: [subConceptId, ...], lastSubConcept, lastTemplateType } }
  // Rows are ordered by completed_at ASC with id as tiebreaker for same-second
  // completions (bulk.js SELECT needs to include id and ORDER BY completed_at ASC, id ASC).
  // Legacy rows whose lesson_id doesn't contain '::' are silently skipped.
  const lessonHistory = {};
  const lessonRows = serverData.lessonHistory || [];
  // Sort ascending by completed_at, then id (rowid tiebreaker for same-second completions)
  const sortedLessonRows = [...lessonRows].sort((a, b) => {
    const ta = a.completed_at || '';
    const tb = b.completed_at || '';
    if (ta < tb) return -1;
    if (ta > tb) return 1;
    // Same timestamp — use id (rowid) as tiebreaker
    return (a.id || 0) - (b.id || 0);
  });
  for (const r of sortedLessonRows) {
    const lessonId = r.lesson_id;
    if (!lessonId || !lessonId.includes('::')) continue; // skip legacy format
    const parts = lessonId.split('::');
    if (parts.length < 3) continue; // malformed — needs topicKey::subConceptId::templateType
    const [topicKey, subConceptId, templateType] = parts;
    if (!lessonHistory[topicKey]) {
      lessonHistory[topicKey] = { shown: [], lastSubConcept: null, lastTemplateType: null };
    }
    // shown entries are OBJECTS — selectLesson reads h.subConcept/h.date for
    // rotation and cooldown; LessonBrowser reads h.subConcept. One entry per
    // row, no dedupe (the server's INSERT OR IGNORE on lesson_id already caps
    // repeats at one per (topic, subConcept, template) — a known fidelity limit).
    lessonHistory[topicKey].shown.push({
      subConcept: subConceptId,
      templateType,
      date: r.completed_at || null,
    });
    lessonHistory[topicKey].lastSubConcept = subConceptId;
    lessonHistory[topicKey].lastTemplateType = templateType;
  }

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

  // leitnerQueue — transform snake_case server columns to camelCase client shape.
  // The bulk.js SELECT returns snake_case (question_id, topic_key, last_reviewed, etc.)
  // which was previously passed through RAW as serverData.leitnerQueue — this is a
  // latent shape mismatch fixed here. Graduated entries (level < 0 is not used;
  // the leitner system uses level 0..5) — no server-level filtering needed.
  const leitnerQueue = (serverData.leitnerQueue || []).map(r => ({
    questionId: r.question_id ?? r.questionId,
    topicKey: r.topic_key ?? r.topicKey,
    subject: r.subject || '',
    level: r.level ?? 0,
    lastReviewed: r.last_reviewed ?? r.lastReviewed ?? null,
    nextReview: r.next_review ?? r.nextReview ?? null,
    timesCorrect: r.times_correct ?? r.timesCorrect ?? 0,
    timesIncorrect: r.times_incorrect ?? r.timesIncorrect ?? 0,
  }));

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

// ── Legacy localStorage Helpers ──
//
// Dual-write was removed on 2026-04-23 (rollback window ~ 27 April). The
// `legacyRead` helper is retained because the migration and cold-fallback
// paths still consult localStorage for any user who hasn't yet moved their
// pre-D1 data. Once the migration flow is fully retired, this block can go
// too.

function userKey(userName, key) {
  return `user:${userName}:${key}`;
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

// ── lastSynced snapshot ──
// Per-child snapshot of last server-confirmed mutable values.
// Used by savePrepPoints to compute delta (PP delta op needs: delta = new total - last synced total).
// Stored in localStorage: sync-lastsynced:${childId}.
// Updated synchronously alongside queue.remove() in the flush response handler.

function lastSyncedKey(childId) {
  return `sync-lastsynced:${childId}`;
}

function readLastSynced(childId) {
  if (!childId) return null;
  try {
    const raw = localStorage.getItem(lastSyncedKey(childId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLastSynced(childId, snapshot) {
  if (!childId) return;
  try {
    localStorage.setItem(lastSyncedKey(childId), JSON.stringify(snapshot));
  } catch { /* non-critical */ }
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

// Check if legacy localStorage has data that hasn't been migrated to D1
function hasLegacyData(userName) {
  return !!(
    localStorage.getItem(userKey(userName, 'quiz-history')) ||
    localStorage.getItem(userKey(userName, 'question-results')) ||
    localStorage.getItem(userKey(userName, 'streaks'))
  );
}

// ── Topic→Subject mapping ──
// Used by saveSeenQuestions and saveLeitnerQueue to derive subject from topicKey.
// Derived from CLAUDE.md topic key lists.
const MATHS_TOPICS = new Set([
  'percentages', 'decimals', 'longdivision', 'ratio', 'fractions',
  'longmultiplication', 'algebra', 'placevalue', 'negativenumbers',
  'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes',
  'sequences', 'datahandling', 'speeddistancetime',
]);
const ENGLISH_TOPICS = new Set([
  'comprehension', 'grammar', 'vocabulary', 'spelling', 'punctuation', 'writingTechniques',
]);
const VR_TOPICS = new Set([
  'synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords',
  'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes',
  'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies',
  'numberWordCodes', 'logicAndLanguage', 'sharedLetter',
]);

function subjectFromTopicKey(topicKey) {
  if (MATHS_TOPICS.has(topicKey)) return 'maths';
  if (ENGLISH_TOPICS.has(topicKey)) return 'english';
  if (VR_TOPICS.has(topicKey)) return 'verbal-reasoning';
  return 'maths'; // fallback
}

// ── PP delta constants ──
const MAX_PP_DELTA_PER_ENQUEUE = 2500; // max delta per single 'prep-points-delta' op

// ── The Hook ──

export default function useD1Data(userName, getToken, childId, previewMode = false) {
  const prevUser = useRef(userName);
  const versionsRef = useRef({ streaks: 1, prepPoints: 1, preferences: 1 });
  const batchingRef = useRef(false);
  const syncQueueRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Refs for current state values — used to compute deltas without stale-closure risk.
  // Updated synchronously alongside setState calls.
  const seenQuestionsRef = useRef({});
  const leitnerQueueRef = useRef([]);
  const lastSyncedRef = useRef(null); // { prepPoints: {total, todayPP, todayDate}, streaks: {...}, preferences: {...} }
  // PP total already covered by lastSynced PLUS deltas sitting in the queue.
  // savePrepPoints must delta against THIS, not lastSynced alone — otherwise two
  // saves between flushes (e.g. two quizzes offline) double-count: the second
  // delta would re-include the first, still-queued delta. Initialised on load
  // as lastSynced.total + sum of queued prep-points-delta ops; advanced on every
  // enqueue. Never decremented (a dead-lettered PP op loses points conservatively
  // rather than risking double-award).
  const enqueuedPPTotalRef = useRef(0);

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
  // Keyed by childId (UUID) when available, falls back to userName for dev
  // mode and legacy paths where childId hasn't been threaded yet.
  useEffect(() => {
    const queueKey = childId || userName;
    if (queueKey) {
      syncQueueRef.current = createSyncQueue(queueKey);
      // Load lastSynced snapshot for this child
      lastSyncedRef.current = readLastSynced(queueKey);
      // Initialise the enqueued-PP baseline: synced total + deltas already queued
      const syncedTotal = lastSyncedRef.current?.prepPoints?.total ?? 0;
      const queuedPPDelta = syncQueueRef.current.getAll()
        .filter(op => op.type === 'prep-points-delta')
        .reduce((sum, op) => sum + (op.payload?.delta || 0), 0);
      enqueuedPPTotalRef.current = syncedTotal + queuedPPDelta;
    }
  }, [childId, userName]);

  // ── Populate state from a transformed data object ──
  const populateState = useCallback((data) => {
    setQuizHistory(data.quizHistory || DEFAULTS.quizHistory);
    setTopicPerformance(data.topicPerformance || DEFAULTS.topicPerformance);
    const sq = data.seenQuestions || DEFAULTS.seenQuestions;
    setSeenQuestions(sq);
    seenQuestionsRef.current = sq;
    setMockTestHistory(data.mockTestHistory || DEFAULTS.mockTestHistory);
    setLessonHistory(data.lessonHistory || DEFAULTS.lessonHistory);
    setQuestionResults(data.questionResults || DEFAULTS.questionResults);
    setPracticeLog(data.practiceLog || DEFAULTS.practiceLog);
    setStreakData(data.streakData || DEFAULTS.streakData);
    setPrepPointsData(data.prepPointsData || DEFAULTS.prepPointsData);
    setAchievements(data.achievements || DEFAULTS.achievements);
    setSeenTips(data.seenTips || DEFAULTS.seenTips);
    setLastSessionDate(data.lastSessionDate || DEFAULTS.lastSessionDate);
    const lq = data.leitnerQueue || DEFAULTS.leitnerQueue;
    setLeitnerQueue(lq);
    leitnerQueueRef.current = lq;
    if (data.versions) versionsRef.current = data.versions;
  }, []);

  // Synchronously reset to fresh-user defaults. Fires at the TOP of the load
  // effect on any userName transition (switch or logout) so no render ever
  // sees the previous child's data. Codex adversarial review BLOCKER
  // (child-safety): leaving prior hook state resident during the async /api/data/all
  // reload window could leak Child A's progress into Child B's first render.
  const resetToFreshUser = useCallback(() => {
    setQuizHistory(DEFAULTS.quizHistory);
    setTopicPerformance(DEFAULTS.topicPerformance);
    setSeenQuestions(DEFAULTS.seenQuestions);
    seenQuestionsRef.current = {};
    setMockTestHistory(DEFAULTS.mockTestHistory);
    setLessonHistory(DEFAULTS.lessonHistory);
    setQuestionResults(DEFAULTS.questionResults);
    setPracticeLog(DEFAULTS.practiceLog);
    setStreakData(DEFAULTS.streakData);
    setPrepPointsData(DEFAULTS.prepPointsData);
    setAchievements(DEFAULTS.achievements);
    setSeenTips(DEFAULTS.seenTips);
    setLastSessionDate(DEFAULTS.lastSessionDate);
    setLeitnerQueue(DEFAULTS.leitnerQueue);
    leitnerQueueRef.current = [];
    setLoaded(false);
    versionsRef.current = { streaks: 1, prepPoints: 1, preferences: 1 };
    lastSyncedRef.current = null;
    enqueuedPPTotalRef.current = 0;
  }, []);

  // ── Load from D1 on mount / user change / logout ──
  useEffect(() => {
    // On any userName transition — including becoming falsy (logout) — reset
    // state synchronously before any async work. Codex adversarial review
    // BLOCKER #2: the previous `if (!userName) return;` early-bail meant
    // logout never cleared the previous child's hook state.
    const userChanged = prevUser.current !== userName;
    if (userChanged) {
      resetToFreshUser();
      prevUser.current = userName;
    }

    if (!userName) {
      // Logged out — state is now fresh, nothing to load.
      setLoaded(true);
      return;
    }

    if (previewMode) {
      // Tutor preview — sandbox. Start from clean defaults and never touch the
      // network (no fetch, no legacy migration). Combined with the enqueue/flush
      // guards below, nothing a preview tutor does is read from or written to D1.
      resetToFreshUser();
      setLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadData() {
      // 1. Try fetching from D1
      const dataPath = childId ? `/api/data/all?child_id=${encodeURIComponent(childId)}` : '/api/data/all';
      const serverData = await apiFetch(dataPath, getToken);

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
          // Use basic apiPost for migration (not the classified one — migration failures are non-critical)
          try {
            const token = await getToken();
            if (token) {
              await fetch(`${API_URL}/api/data/migrate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(migrationPayload),
              });
            }
          } catch { /* non-critical */ }

          // Re-fetch after migration
          const freshData = await apiFetch('/api/data/all', getToken);
          if (cancelled) return;
          if (freshData) {
            const transformed = transformServerData(freshData);
            populateState(transformed);
            writeCache(userName, freshData);
            // Initialise lastSynced from server data
            const queueKey = childId || userName;
            const snapshot = {
              prepPoints: transformed.prepPointsData,
              streaks: transformed.streakData,
              preferences: { lastSessionDate: transformed.lastSessionDate },
            };
            lastSyncedRef.current = snapshot;
            writeLastSynced(queueKey, snapshot);
            enqueuedPPTotalRef.current = (snapshot.prepPoints?.total ?? 0) +
              (syncQueueRef.current?.getAll() || [])
                .filter(op => op.type === 'prep-points-delta')
                .reduce((sum, op) => sum + (op.payload?.delta || 0), 0);
            setLoaded(true);
            return;
          }
        }

        // Normal path: D1 has data
        const transformed = transformServerData(serverData);
        populateState(transformed);
        writeCache(userName, serverData);

        // Initialise lastSynced from server data
        const queueKey = childId || userName;
        const snapshot = {
          prepPoints: transformed.prepPointsData,
          streaks: transformed.streakData,
          preferences: { lastSessionDate: transformed.lastSessionDate },
        };
        lastSyncedRef.current = snapshot;
        writeLastSynced(queueKey, snapshot);
        enqueuedPPTotalRef.current = (snapshot.prepPoints?.total ?? 0) +
          (syncQueueRef.current?.getAll() || [])
            .filter(op => op.type === 'prep-points-delta')
            .reduce((sum, op) => sum + (op.payload?.delta || 0), 0);

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

    return () => { cancelled = true; };
  }, [userName, getToken, childId, previewMode, populateState, resetToFreshUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Online/offline listener ──
  useEffect(() => {
    const handleOnline = () => {
      const mutexKey = childId || userName;
      if (mutexKey) {
        // Reset backoff on reconnect — device is now online, retry promptly
        const state = getFlushState(mutexKey);
        state.backoffMs = 0;
        state.lastFailedAt = null;
      }
      if (syncQueueRef.current && !syncQueueRef.current.isEmpty()) {
        flushQueue();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Flush SyncQueue to D1 ──
  // Mutex-protected via module-level flushState (keyed by userName) so the
  // mutex survives StrictMode remounts and component unmount/remount cycles.
  // Concurrent callers set `pending` so the in-flight flush re-drains after
  // completing. Prevents the UUID-race where N parallel flushes pull the
  // same ops, causing UNIQUE constraint failures on processed_operations.
  // (Codex Fix C-Client; belt-and-braces with the per-op batching in the Worker.)
  const flushQueue = useCallback(async () => {
    if (previewMode) return; // preview sandbox never persists to D1
    const queue = syncQueueRef.current;
    if (!queue || !getToken || !API_URL || !userName) return;

    // Mutex keyed by childId when available so two children on the same
    // account never share a flush lock.
    const mutexKey = childId || userName;
    const state = getFlushState(mutexKey);

    // If a flush is already running (same user, possibly another mount),
    // mark pending and bail — the running flush will re-drain.
    if (state.flushing) {
      state.pending = true;
      return;
    }

    // Check cross-tab flush lease — skip if another tab is actively flushing
    if (!acquireLease(mutexKey)) {
      // Another tab holds the lease; they will drain the queue. Schedule a
      // check after lease TTL so we don't starve if the other tab crashes.
      setTimeout(() => flushQueue(), LEASE_TTL_MS + 1000);
      return;
    }

    state.flushing = true;

    try {
      // Check queue after mutex to avoid pointless POST
      if (queue.isEmpty()) return;

      const { valid, quarantined } = queue.validateOwnership();
      if (quarantined.length > 0) {
        queue.remove(quarantined.map(op => op.uuid));
      }

      // peek() performs age-out to dead-letter — side effect is intentional
      const ops = queue.peek(50);
      if (ops.length === 0) return;

      // Renew lease between batches (in case we have many batches)
      renewLease(mutexKey);

      const batchBody = childId ? { child_id: childId, operations: ops } : { operations: ops };
      const { data: result, transient, permanent } = await apiPostClassified('/api/data/batch', batchBody, getToken);

      if (result) {
        // ── Success path ──
        // Reset backoff on any successful flush
        state.backoffMs = 0;
        state.lastFailedAt = null;
        state.permFailures = 0;
        resetConflictRounds(mutexKey);

        const queueKey = childId || userName;
        const toRemove = [];
        let lastSyncedUpdated = false;
        const currentLastSynced = lastSyncedRef.current || {
          prepPoints: DEFAULTS.prepPointsData,
          streaks: DEFAULTS.streakData,
          preferences: { lastSessionDate: null },
        };
        const updatedLastSynced = {
          prepPoints: { ...currentLastSynced.prepPoints },
          streaks: { ...currentLastSynced.streaks },
          preferences: { ...currentLastSynced.preferences },
        };

        // Process per-op results
        const errorUuids = [];
        const conflictRounds = getConflictRounds(mutexKey);

        for (const opResult of (result.results || [])) {
          if (opResult.status === 'ok' || opResult.status === 'duplicate') {
            toRemove.push(opResult.uuid);
            // Update lastSynced for delta ops
            const op = ops.find(o => o.uuid === opResult.uuid);
            if (op && op.type === 'prep-points-delta' && opResult.status === 'ok') {
              updatedLastSynced.prepPoints = {
                ...updatedLastSynced.prepPoints,
                total: (updatedLastSynced.prepPoints.total || 0) + (op.payload.delta || 0),
              };
              lastSyncedUpdated = true;
            }
          } else if (opResult.status === 'error') {
            // Server-rejected op — dead-letter it, do NOT retry
            errorUuids.push(opResult.uuid);
          } else if (opResult.status === 'conflict') {
            // Merge conflict — remove original, compute merged state, re-enqueue
            toRemove.push(opResult.uuid);
            const op = ops.find(o => o.uuid === opResult.uuid);
            if (!op) continue;

            const logicalKey = op.type; // 'streaks' | 'preferences'
            const round = (conflictRounds.get(logicalKey) || 0) + 1;
            conflictRounds.set(logicalKey, round);

            if (round > 3) {
              // Loop guard: accept server state. Dead-letter the op (off-device
              // record of the unmerged local value via its payload) instead of
              // letting toRemove discard it silently — deadLetterErrors both
              // removes from the queue and writes the dead-letter + Sentry report.
              queue.deadLetterErrors([opResult.uuid]);
              try {
                Sentry.captureMessage('[useD1Data] Conflict loop guard triggered — accepting server state', {
                  level: 'warning',
                  extra: { type: op.type, round, uuid: opResult.uuid },
                });
              } catch { /* never throw from reporting */ }
              continue; // accept server state — don't re-enqueue
            }

            if (op.type === 'streaks') {
              // Merge streak histories
              const serverHistory = opResult.currentData?.streak_history
                ? (typeof opResult.currentData.streak_history === 'string'
                    ? JSON.parse(opResult.currentData.streak_history)
                    : opResult.currentData.streak_history)
                : [];
              const localHistory = op.payload.streakHistory || [];
              // Union deduped by date string
              const mergedHistory = [...new Set([...localHistory, ...serverHistory])];
              const serverLongest = opResult.currentData?.longest_streak || 0;
              const localLongest = op.payload.longestStreak || 0;
              const prevLongest = Math.max(serverLongest, localLongest);
              // Derive ALL fields from merged history — never take max(currentStreak) directly
              const { currentStreak, longestStreak, lastQuizDate } = recomputeStreakFromHistory(mergedHistory, prevLongest);

              const merged = {
                currentStreak,
                longestStreak,
                lastQuizDate,
                streakHistory: mergedHistory,
              };
              setStreakData(merged);

              // Re-enqueue with server version and fresh UUID
              const newVersion = opResult.currentVersion;
              versionsRef.current = { ...versionsRef.current, streaks: newVersion };
              queue.enqueue('streaks', {
                version: newVersion,
                currentStreak: merged.currentStreak,
                longestStreak: merged.longestStreak,
                lastQuizDate: merged.lastQuizDate,
                streakHistory: merged.streakHistory,
              });
            } else if (op.type === 'preferences') {
              // Merge preferences: lastSessionDate = max(local, server)
              const serverDate = opResult.currentData?.last_session_date || null;
              const localDate = op.payload.lastSessionDate || null;
              const mergedDate = serverDate && localDate
                ? (serverDate > localDate ? serverDate : localDate)
                : (serverDate || localDate);

              setLastSessionDate(mergedDate);

              const newVersion = opResult.currentVersion;
              versionsRef.current = { ...versionsRef.current, preferences: newVersion };
              queue.enqueue('preferences', {
                version: newVersion,
                lastSessionDate: mergedDate,
              });
            }
          }
        }

        // Remove processed + conflict-resolved ops synchronously with lastSynced update
        if (toRemove.length > 0) {
          queue.remove(toRemove);
        }
        if (errorUuids.length > 0) {
          queue.deadLetterErrors(errorUuids);
        }

        // Update versions from response
        if (result.versions) {
          versionsRef.current = {
            streaks: result.versions.streaks ?? versionsRef.current.streaks,
            prepPoints: result.versions.prepPoints ?? versionsRef.current.prepPoints,
            preferences: result.versions.preferences ?? versionsRef.current.preferences,
          };
        }

        // Write lastSynced transactionally with the queue remove
        if (lastSyncedUpdated) {
          lastSyncedRef.current = updatedLastSynced;
          writeLastSynced(queueKey, updatedLastSynced);
        }

      } else if (transient) {
        // ── Transient failure — ops stay queued, apply backoff ──
        queue.incrementRetries(ops.map(op => op.uuid));
        state.backoffMs = nextBackoffMs(state.backoffMs);
        state.lastFailedAt = Date.now();
        state.permFailures = 0; // a transient failure breaks any 4xx streak
      } else if (permanent) {
        // ── Permanent 4xx failure ──
        // Retry ONCE (a 400 could be a transient schema mismatch mid-deploy);
        // on the second CONSECUTIVE 4xx, dead-letter the batch. Tracked with a
        // dedicated counter — NOT backoffMs, which an unrelated 5xx also sets
        // and would wrongly dead-letter good ops after one 400.
        state.permFailures += 1;
        if (state.permFailures >= 2) {
          queue.deadLetterErrors(ops.map(op => op.uuid));
          state.permFailures = 0;
        } else {
          // First consecutive 4xx — retry once with backoff
          queue.incrementRetries(ops.map(op => op.uuid));
          state.backoffMs = nextBackoffMs(state.backoffMs);
          state.lastFailedAt = Date.now();
        }
      }
    } finally {
      releaseLease(mutexKey);
      state.flushing = false;
    }

    // Drain again if: more ops remain, OR another caller tried to flush
    // while we were in-flight (state.pending was set).
    const shouldDrain = state.pending || !queue.isEmpty();
    state.pending = false;
    if (shouldDrain) {
      let drainDelay = 100; // fast drain for remaining ops after a success
      if (state.lastFailedAt !== null) {
        // Compute remaining backoff from when the failure was recorded
        const elapsed = Date.now() - state.lastFailedAt;
        const remaining = state.backoffMs - elapsed;
        drainDelay = Math.max(100, remaining);
      }
      setTimeout(() => flushQueue(), drainDelay);
    }
  }, [getToken, userName, childId, previewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Batch Mode ──
  const startBatch = useCallback(() => { batchingRef.current = true; }, []);
  const endBatch = useCallback(async () => {
    batchingRef.current = false;
    await flushQueue();
  }, [flushQueue]);

  // ── Enqueue helper (enqueues + optionally flushes) ──
  const enqueue = useCallback((type, payload) => {
    if (previewMode) return; // preview sandbox: update local state only, never persist
    if (!syncQueueRef.current) return;
    syncQueueRef.current.enqueue(type, payload);
    if (!batchingRef.current) {
      flushQueue();
    }
  }, [flushQueue, previewMode]);

  // ── Save Methods (same signatures as useUserData) ──

  const saveQuizResult = useCallback((result) => {
    if (!userName) return;
    // Newest-first — prepend (server arrays are newest-first per convention)
    const updated = [result, ...quizHistory];
    setQuizHistory(updated);
    enqueue('quiz-result', {
      topicKey: result.topic, subject: result.subject,
      score: result.score, total: result.total,
      timeSeconds: result.timeSeconds || null, quizMode: result.quizMode || null,
      sessionId: result.sessionId || null,
    });
  }, [userName, quizHistory, enqueue]);

  const saveTopicPerformance = useCallback((updated) => {
    if (!userName) return;
    setTopicPerformance(updated);
    // topicPerformance is local-only (server-side readers exist in tutor.js and mutable.js,
    // but there is no clean per-(topicKey, subject) version tracking returned from bulk load
    // and the data can be derived from questionResults). Keeping local-only per spec branch
    // decision (see OUTPUT section). Nothing to enqueue here.
  }, [userName]);

  const saveSeenQuestions = useCallback((updated) => {
    if (!userName) return;
    // Diff against the ref to find newly seen questions
    const prev = seenQuestionsRef.current;
    setSeenQuestions(updated);
    seenQuestionsRef.current = updated;

    // Enqueue 'seen-question' for each newly seen entry
    for (const [topicKey, ids] of Object.entries(updated)) {
      const prevIds = prev[topicKey] || [];
      for (const questionId of ids) {
        if (!prevIds.includes(questionId)) {
          const subject = subjectFromTopicKey(topicKey);
          enqueue('seen-question', { questionId, topicKey, subject });
        }
      }
    }
  }, [userName, enqueue]);

  const saveMockTestResult = useCallback((result) => {
    if (!userName) return;
    // Newest-first — prepend
    setMockTestHistory(prev => [result, ...prev]);
    enqueue('mock-result', {
      subject: result.subject, totalQuestions: result.totalQuestions,
      totalCorrect: result.totalCorrect, percentage: result.percentage,
      timeTaken: result.timeTaken, timeLimit: result.timeLimit,
      sectionResults: result.sectionResults, questionTimes: result.questionTimes,
    });
  }, [userName, enqueue]);

  // recordLessonComplete — updates topic-keyed lessonHistory state AND enqueues
  // 'lesson-complete' op. Called from App.js lesson completion handler.
  // lessonId format: "${topicKey}::${subConceptId}::${templateType}"
  // Validates that no component contains '::' (these are slugs).
  const recordLessonComplete = useCallback(({ topicKey, subConceptId, templateType }) => {
    if (!userName) return;
    if (topicKey.includes('::') || subConceptId.includes('::') || templateType.includes('::')) {
      console.warn('[useD1Data] recordLessonComplete: component contains "::" separator — lessonId will be malformed', { topicKey, subConceptId, templateType });
    }
    const lessonId = `${topicKey}::${subConceptId}::${templateType}`;
    setLessonHistory(prev => {
      const updated = { ...prev };
      const topic = updated[topicKey]
        ? { ...updated[topicKey], shown: [...updated[topicKey].shown] }
        : { shown: [], lastSubConcept: null, lastTemplateType: null };
      // shown entries are OBJECTS — selectLesson reads h.subConcept and h.date
      // for rotation/cooldown scoring, and LessonBrowser reads h.subConcept.
      // Every showing is pushed (no dedupe): repeat counts feed timesShown.
      topic.shown.push({ subConcept: subConceptId, templateType, date: new Date().toISOString() });
      topic.lastSubConcept = subConceptId;
      topic.lastTemplateType = templateType;
      updated[topicKey] = topic;
      return updated;
    });
    enqueue('lesson-complete', { lessonId });
  }, [userName, enqueue]);

  const saveLessonHistory = useCallback((updated) => {
    if (!userName) return;
    setLessonHistory(updated);
    // Note: saveLessonHistory is for the legacy path (direct object update).
    // New code should use recordLessonComplete instead.
  }, [userName]);

  const saveQuestionResult = useCallback((result) => {
    if (!userName) return;
    // Newest-first — prepend
    setQuestionResults(prev => [result, ...prev].slice(0, 5000));
    enqueue('question-result', {
      questionId: result.questionId, topicKey: result.topicKey,
      subject: result.subject, isCorrect: result.correct,
      timeMs: result.timeSpentMs, difficulty: result.difficulty,
      sessionId: result.sessionId || null,
      selectedAnswer: result.selectedAnswer !== undefined ? result.selectedAnswer : null,
    });
  }, [userName, enqueue]);

  const savePracticeSession = useCallback((session) => {
    if (!userName) return;
    // Newest-first — prepend
    setPracticeLog(prev => [session, ...prev]);
    enqueue('practice-session', {
      sessionDate: session.date || new Date().toISOString().slice(0, 10),
      data: session,
    });
  }, [userName, enqueue]);

  const saveStreakData = useCallback((data) => {
    if (!userName) return;
    setStreakData(data);
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

    // Compute delta against the enqueued baseline (synced total + deltas already
    // queued), never against lastSynced alone — two saves between flushes would
    // otherwise double-count the still-queued first delta. Ref, not closed-over
    // state (stale-closure history in this file).
    const delta = (data.total || 0) - enqueuedPPTotalRef.current;

    if (delta <= 0) {
      // Total hasn't increased beyond what's already queued/synced — nothing to enqueue
      return;
    }
    enqueuedPPTotalRef.current += delta;

    // Split deltas > MAX_PP_DELTA_PER_ENQUEUE into multiple ops
    let remaining = delta;
    let todayDeltaRemaining = data.todayPP || 0;
    let firstOp = true;

    while (remaining > 0) {
      const opDelta = Math.min(remaining, MAX_PP_DELTA_PER_ENQUEUE);
      // todayDelta goes entirely on the first op
      const todayDelta = firstOp ? todayDeltaRemaining : 0;
      enqueue('prep-points-delta', {
        delta: opDelta,
        todayDelta,
        todayDate: data.todayDate,
      });
      remaining -= opDelta;
      firstOp = false;
    }
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
    enqueue('seen-tip', { tipId, lastSeenDate: now });
  }, [userName, seenTips, enqueue]);

  const saveLastSessionDate = useCallback((date) => {
    if (!userName) return;
    setLastSessionDate(date);
    enqueue('preferences', {
      version: versionsRef.current.preferences,
      lastSessionDate: date,
    });
  }, [userName, enqueue]);

  const saveLeitnerQueue = useCallback((queue) => {
    if (!userName) return;

    // Diff against the ref to find new/changed entries
    const prevMap = new Map(
      leitnerQueueRef.current.map(e => [`${e.questionId}:${e.topicKey}`, e])
    );

    setLeitnerQueue(queue);
    leitnerQueueRef.current = queue;

    for (const entry of queue) {
      const key = `${entry.questionId}:${entry.topicKey}`;
      const prev = prevMap.get(key);
      const changed = !prev
        || prev.level !== entry.level
        || prev.lastReviewed !== entry.lastReviewed
        || prev.nextReview !== entry.nextReview
        || prev.timesCorrect !== entry.timesCorrect
        || prev.timesIncorrect !== entry.timesIncorrect;

      if (changed) {
        const subject = entry.subject || subjectFromTopicKey(entry.topicKey);
        enqueue('leitner-entry', {
          questionId: entry.questionId,
          topicKey: entry.topicKey,
          subject,
          level: entry.level,
          lastReviewed: entry.lastReviewed || null,
          nextReview: entry.nextReview || null,
          timesCorrect: entry.timesCorrect ?? 0,
          timesIncorrect: entry.timesIncorrect ?? 0,
        });
      }
    }
  }, [userName, enqueue]);

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
    recordLessonComplete,
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
    enqueue,
    // New metadata
    loaded,
  };
}

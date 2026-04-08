// ── API Sync Utility ──
// Fire-and-forget API calls alongside localStorage writes.
// If the API call fails, data is still in localStorage (next login re-syncs from server).

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

let _getToken = null;

// Called once by App on mount — provides the Clerk getToken function
export function setTokenProvider(getTokenFn) {
  _getToken = getTokenFn;
}

async function apiCall(path, method = 'GET', body = null) {
  if (!_getToken || !API_URL) return null;

  try {
    const token = await _getToken();
    if (!token) return null;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${path}`, options);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn(`[apiSync] ${method} ${path} failed:`, data.error || res.status);
      return null;
    }
    return res.json();
  } catch (err) {
    console.warn(`[apiSync] ${method} ${path} error:`, err.message);
    return null;
  }
}

// ── Append-only writes (fire-and-forget) ──

export function syncQuizResult(result) {
  apiCall('/api/data/quiz-result', 'POST', {
    topicKey: result.topicKey || result.topic,
    subject: result.category || result.subject || 'maths',
    score: result.score,
    total: result.total || 10,
    timeSeconds: result.time || null,
    quizMode: result.quizMode || null,
  });
}

export function syncMockTestResult(result) {
  apiCall('/api/data/mock-result', 'POST', {
    subject: result.subject,
    totalQuestions: result.totalQuestions,
    totalCorrect: result.totalCorrect,
    percentage: result.percentage,
    timeTaken: result.timeTaken,
    timeLimit: result.timeLimit,
    sectionResults: result.sectionResults,
    questionTimes: result.questionTimes,
  });
}

export function syncQuestionResult(result) {
  apiCall('/api/data/question-result', 'POST', {
    questionId: result.questionId,
    topicKey: result.topicKey,
    subject: result.subject || 'maths',
    isCorrect: result.isCorrect,
    timeMs: result.timeMs,
    difficulty: result.difficulty,
  });
}

export function syncLessonComplete(lessonId) {
  apiCall('/api/data/lesson-complete', 'POST', { lessonId });
}

export function syncPracticeSession(session) {
  apiCall('/api/data/practice-session', 'POST', {
    sessionDate: session.date || session.sessionDate || new Date().toISOString().split('T')[0],
    data: session,
  });
}

export function syncAchievement(achievementId) {
  apiCall('/api/data/achievement', 'POST', {
    achievementId: typeof achievementId === 'string' ? achievementId : achievementId.id,
  });
}

export function syncSeenTip(tipId, lastSeenDate) {
  apiCall('/api/data/seen-tip', 'POST', { tipId, lastSeenDate });
}

// ── Mutable writes (fire-and-forget, no version check for now) ──
// At 10 users on one device each, version conflicts won't happen.
// Full optimistic concurrency added when multi-device is tested.

export function syncStreaks(data) {
  apiCall('/api/data/streaks', 'PATCH', {
    version: 1, // TODO: track actual version for multi-device
    currentStreak: data.currentStreak,
    longestStreak: data.longestStreak,
    lastQuizDate: data.lastQuizDate,
    streakHistory: data.streakHistory,
  });
}

export function syncPrepPoints(data) {
  apiCall('/api/data/prep-points', 'PATCH', {
    version: 1, // TODO: track actual version for multi-device
    total: data.total,
    level: data.level,
    todayPP: data.todayPP,
    todayDate: data.todayDate,
  });
}

export function syncPreferences(lastSessionDate) {
  apiCall('/api/data/preferences', 'PATCH', {
    version: 1, // TODO: track actual version for multi-device
    lastSessionDate,
  });
}

// ── Bulk fetch (used by AuthGate on login) ──

export async function fetchAllData(getTokenFn) {
  if (!getTokenFn || !API_URL) return null;
  try {
    const token = await getTokenFn();
    if (!token) return null;
    const res = await fetch(`${API_URL}/api/data/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

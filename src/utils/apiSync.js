// ── API Sync Utility ──
// Fire-and-forget API calls alongside localStorage writes.
// If the API call fails, data is still in localStorage (next login re-syncs from server).

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

let _getToken = null;

// Called once by App on mount — provides the Clerk getToken function
export function setTokenProvider(getTokenFn) {
  _getToken = getTokenFn;
}

// ── Server version cache for mutable records ──
const _versions = { streaks: 1, prepPoints: 1, preferences: 1 };

// Called by AuthGate after bulk load to seed versions from server
export function setVersions(serverData) {
  if (serverData?.streaks?.version) _versions.streaks = serverData.streaks.version;
  if (serverData?.prepPoints?.version) _versions.prepPoints = serverData.prepPoints.version;
  if (serverData?.preferences?.version) _versions.preferences = serverData.preferences.version;
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
    isCorrect: result.correct ?? result.isCorrect ?? false,
    timeMs: result.timeSpentMs ?? result.timeMs ?? 0,
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

// ── Mutable writes (versioned, fire-and-forget with 409 retry) ──

async function versionedPatch(path, versionKey, body) {
  if (!_getToken || !API_URL) return;

  try {
    const token = await _getToken();
    if (!token) return;

    const payload = { ...body, version: _versions[versionKey] };
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.version) _versions[versionKey] = data.version;
      return;
    }

    // On 409, update cached version and retry once
    if (res.status === 409) {
      const err = await res.json().catch(() => ({}));
      if (err.currentVersion) {
        _versions[versionKey] = err.currentVersion;
        const retryPayload = { ...body, version: err.currentVersion };
        const retry = await fetch(`${API_URL}${path}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(retryPayload),
        });
        if (retry.ok) {
          const data = await retry.json();
          if (data.version) _versions[versionKey] = data.version;
        }
      }
    }
  } catch (err) {
    console.warn(`[apiSync] PATCH ${path} error:`, err.message);
  }
}

export function syncStreaks(data) {
  versionedPatch('/api/data/streaks', 'streaks', {
    currentStreak: data.currentStreak,
    longestStreak: data.longestStreak,
    lastQuizDate: data.lastQuizDate,
    streakHistory: data.streakHistory,
  });
}

export function syncPrepPoints(data) {
  versionedPatch('/api/data/prep-points', 'prepPoints', {
    total: data.total,
    level: data.level,
    todayPP: data.todayPP,
    todayDate: data.todayDate,
  });
}

export function syncPreferences(lastSessionDate) {
  versionedPatch('/api/data/preferences', 'preferences', {
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

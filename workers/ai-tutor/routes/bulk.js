// ── Bulk Load, Migration, and Export Routes ──

import { json, getChildId, resolveChildId, BASE_HEADERS } from '../helpers.js';

// GET /api/data/all — Fetch ALL child data in one request (used on login)
// Accepts optional ?child_id= query param to load a specific child's data.
export async function handleBulkLoad(request, env, userId) {
  const db = env.DB;
  const url = new URL(request.url);
  const requestedChildId = url.searchParams.get('child_id') || null;
  const childId = await resolveChildId(db, userId, requestedChildId);
  if (!childId) return json({ error: 'No child profile' }, 404);

  // Run all queries in parallel
  const [
    quizResults,
    mockResults,
    questionResults,
    topicPerformance,
    leitnerQueue,
    lessonHistory,
    seenQuestions,
    practiceSessions,
    achievements,
    seenTips,
    streaks,
    prepPoints,
    preferences,
    migration,
  ] = await Promise.all([
    db.prepare('SELECT * FROM quiz_results WHERE child_id = ? ORDER BY completed_at DESC').bind(childId).all(),
    db.prepare('SELECT * FROM mock_test_results WHERE child_id = ? ORDER BY completed_at DESC').bind(childId).all(),
    db.prepare('SELECT id, question_id, topic_key, subject, is_correct, time_ms, difficulty, attempted_at, session_id, selected_answer FROM question_results WHERE child_id = ? ORDER BY attempted_at DESC').bind(childId).all(),
    db.prepare('SELECT topic_key, subject, data, version FROM topic_performance WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT question_id, topic_key, subject, level, last_reviewed, next_review, times_correct, times_incorrect FROM leitner_queue WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT id, lesson_id, completed_at FROM lesson_history WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT question_id, topic_key, subject, first_seen_at FROM seen_questions WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT session_date, data, created_at FROM practice_sessions WHERE child_id = ? ORDER BY session_date DESC').bind(childId).all(),
    db.prepare('SELECT achievement_id, unlocked_at FROM achievements WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT tip_id, last_seen_date FROM seen_tips WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT current_streak, longest_streak, last_quiz_date, streak_history, version FROM streaks WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT total, level, today_pp, today_date, version FROM prep_points WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT last_session_date, version FROM preferences WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT migrated_at, source, items_imported FROM migrations WHERE child_id = ?').bind(childId).first(),
  ]);

  // Parse JSON fields
  const parsedTopicPerf = topicPerformance.results.map(r => ({ ...r, data: JSON.parse(r.data) }));
  const parsedMock = mockResults.results.map(r => ({
    ...r,
    section_results: JSON.parse(r.section_results),
    question_times: r.question_times ? JSON.parse(r.question_times) : null,
  }));
  const parsedSessions = practiceSessions.results.map(r => ({ ...r, data: JSON.parse(r.data) }));

  return json({
    quizResults: quizResults.results,
    questionResults: questionResults.results,
    mockTestResults: parsedMock,
    topicPerformance: parsedTopicPerf,
    leitnerQueue: leitnerQueue.results,
    lessonHistory: lessonHistory.results,
    seenQuestions: seenQuestions.results,
    practiceSessions: parsedSessions,
    achievements: achievements.results,
    seenTips: seenTips.results,
    streaks: streaks ? { ...streaks, streak_history: JSON.parse(streaks.streak_history) } : null,
    prepPoints: prepPoints || null,
    preferences: preferences || null,
    migration: migration || null,
  });
}

// POST /api/data/migrate — Bulk import from localStorage JSON
export async function handleMigrate(request, env, userId) {
  const db = env.DB;
  const childId = await getChildId(db, userId);
  if (!childId) return json({ error: 'No child profile. Create one first.' }, 404);

  // Check if already migrated
  const existing = await db.prepare('SELECT migrated_at FROM migrations WHERE child_id = ?').bind(childId).first();
  if (existing) {
    return json({ ok: true, message: 'Already migrated', migratedAt: existing.migrated_at });
  }

  // Check if account already has data (server wins)
  const hasData = await db.prepare('SELECT id FROM quiz_results WHERE child_id = ? LIMIT 1').bind(childId).first();
  if (hasData) {
    return json({ ok: true, message: 'Account already has data, skipping migration' });
  }

  const body = await request.json();
  let totalImported = 0;

  // ── Import quiz history ──
  // Bug fixed 29 Apr 2026: previously dropped session_id entirely. Without
  // it, the partial UNIQUE index in migration 0007 can't dedupe future
  // replays. Field-name fallbacks support legacy (sessionId) and modern
  // (session_id) payloads.
  if (body.quizHistory && Array.isArray(body.quizHistory)) {
    const stmts = body.quizHistory.map(q =>
      db.prepare(
        `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, completed_at, session_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, q.topicKey || q.topic || '', q.category || q.subject || 'maths',
        q.score || 0, q.total || q.questions?.length || 10,
        q.time || q.timeSeconds || null, q.quizMode || q.mode || null,
        q.date || q.completedAt || new Date().toISOString(),
        q.sessionId || q.session_id || null
      )
    );
    if (stmts.length > 0) {
      // D1 batch limit is 100 statements
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import mock test history ──
  if (body.mockTestHistory && Array.isArray(body.mockTestHistory)) {
    const stmts = body.mockTestHistory.map(m =>
      db.prepare(
        `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, time_taken, time_limit, section_results, question_times, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, m.subject || '', m.totalQuestions || 0, m.totalCorrect || 0,
        m.percentage || 0, m.timeTaken || 0, m.timeLimit || 0,
        JSON.stringify(m.sectionResults || {}),
        JSON.stringify(m.questionTimes || {}),
        m.date || m.completedAt || new Date().toISOString()
      )
    );
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import question results ──
  // Bug fixed 29 Apr 2026: previously read q.timestamp (a field that legacy
  // localStorage doesn't have — the real field is q.date), so all migrated
  // rows got attempted_at = migration time instead of the real answer time.
  // Same code also dropped session_id and selected_answer, and used wrong
  // field names (q.isCorrect vs q.correct, q.timeMs vs q.timeSpentMs).
  // Now reads with defensive fallbacks for both legacy and modern shapes.
  if (body.questionResults && Array.isArray(body.questionResults)) {
    const stmts = body.questionResults.map(q => {
      const isCorrect = (q.isCorrect ?? q.correct) ? 1 : 0;
      const timeMs = q.timeMs ?? q.timeSpentMs ?? null;
      const attemptedAt = q.attempted_at || q.attemptedAt || q.date || q.timestamp || new Date().toISOString();
      const sessionId = q.session_id ?? q.sessionId ?? null;
      const selectedAnswer = q.selected_answer ?? q.selectedAnswer;
      const selectedAnswerJson = selectedAnswer !== undefined && selectedAnswer !== null
        ? (typeof selectedAnswer === 'string' ? selectedAnswer : JSON.stringify(selectedAnswer))
        : null;
      return db.prepare(
        `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty, attempted_at, session_id, selected_answer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, q.questionId || q.question_id || 0,
        q.topicKey || q.topic_key || '', q.subject || 'maths',
        isCorrect, timeMs, q.difficulty || null,
        attemptedAt, sessionId, selectedAnswerJson
      );
    });
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import lesson history ──
  if (body.lessonHistory && typeof body.lessonHistory === 'object') {
    const entries = Array.isArray(body.lessonHistory)
      ? body.lessonHistory.map(l => [l.lessonId || l, l.completedAt || new Date().toISOString()])
      : Object.entries(body.lessonHistory).map(([id, val]) => [id, typeof val === 'object' ? val.completedAt || new Date().toISOString() : new Date().toISOString()]);

    const stmts = entries.map(([lessonId, completedAt]) =>
      db.prepare('INSERT OR IGNORE INTO lesson_history (child_id, lesson_id, completed_at) VALUES (?, ?, ?)')
        .bind(childId, lessonId, completedAt)
    );
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import topic performance ──
  // Bug fixed 29 Apr 2026: previously hardcoded subject='maths' for every
  // entry — English and VR topic_performance was being mislabelled. Now
  // reads subject from the value (modern shape: { subject, correct, total })
  // or from a (subject, topic_key) compound key (legacy: "maths:algebra"),
  // falling back to 'maths' only as last resort.
  if (body.topicPerformance && typeof body.topicPerformance === 'object') {
    const stmts = Object.entries(body.topicPerformance).map(([key, data]) => {
      let topicKey = key;
      let subject = 'maths';
      // Compound-key form: "subject:topic"
      if (typeof key === 'string' && key.includes(':')) {
        const [s, t] = key.split(':', 2);
        if (s && t) { subject = s; topicKey = t; }
      }
      // Modern shape: data carries subject directly
      if (data && typeof data === 'object' && data.subject) {
        subject = data.subject;
      }
      return db.prepare(
        `INSERT OR REPLACE INTO topic_performance (child_id, topic_key, subject, data, version)
         VALUES (?, ?, ?, ?, 1)`
      ).bind(childId, topicKey, subject, JSON.stringify(data));
    });
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import leitner queue ──
  if (body.leitnerQueue && Array.isArray(body.leitnerQueue)) {
    const stmts = body.leitnerQueue.map(q =>
      db.prepare(
        `INSERT OR REPLACE INTO leitner_queue (child_id, question_id, topic_key, subject, level, last_reviewed, next_review, times_correct, times_incorrect)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, q.questionId || 0, q.topicKey || '', q.subject || '',
        q.level ?? 0, q.lastReviewed || null, q.nextReview || null,
        q.timesCorrect ?? 0, q.timesIncorrect ?? 0
      )
    );
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import practice log ──
  if (body.practiceLog && Array.isArray(body.practiceLog)) {
    const stmts = body.practiceLog.map(p =>
      db.prepare(
        `INSERT OR IGNORE INTO practice_sessions (child_id, session_date, data)
         VALUES (?, ?, ?)`
      ).bind(childId, p.date || p.sessionDate || '', JSON.stringify(p))
    );
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import seen questions ──
  if (body.seenQuestions && typeof body.seenQuestions === 'object') {
    const entries = Object.entries(body.seenQuestions);
    const stmts = entries.map(([key, val]) => {
      // Key format varies — could be "questionId" or "topicKey:questionId"
      const questionId = parseInt(key) || 0;
      return db.prepare(
        'INSERT OR IGNORE INTO seen_questions (child_id, question_id, topic_key, subject) VALUES (?, ?, ?, ?)'
      ).bind(childId, questionId, val?.topicKey || '', val?.subject || 'maths');
    });
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import streaks ──
  // Bug fixed 29 Apr 2026: previously used UPDATE only. Default rows are
  // normally auto-created by POST /api/account/child, but if the children
  // row was ever wiped + recreated without re-running that route (e.g.
  // catastrophic migration recovery), the UPDATE matched zero rows and
  // streaks data was silently lost. Now upserts.
  if (body.streaks && typeof body.streaks === 'object') {
    const s = body.streaks;
    await db.prepare(
      `INSERT INTO streaks (child_id, current_streak, longest_streak, last_quiz_date, streak_history, version)
       VALUES (?, ?, ?, ?, ?, 1)
       ON CONFLICT(child_id) DO UPDATE SET
         current_streak = excluded.current_streak,
         longest_streak = excluded.longest_streak,
         last_quiz_date = excluded.last_quiz_date,
         streak_history = excluded.streak_history,
         version = 1,
         updated_at = datetime('now')`
    ).bind(
      childId, s.currentStreak ?? 0, s.longestStreak ?? 0,
      s.lastQuizDate || null, JSON.stringify(s.streakHistory || [])
    ).run();
    totalImported++;
  }

  // ── Import prep points ──
  // Same bug as streaks above — UPDATE-only would silently lose data.
  if (body.prepPoints && typeof body.prepPoints === 'object') {
    const p = body.prepPoints;
    await db.prepare(
      `INSERT INTO prep_points (child_id, total, level, today_pp, today_date, version)
       VALUES (?, ?, ?, ?, ?, 1)
       ON CONFLICT(child_id) DO UPDATE SET
         total = excluded.total,
         level = excluded.level,
         today_pp = excluded.today_pp,
         today_date = excluded.today_date,
         version = 1,
         updated_at = datetime('now')`
    ).bind(childId, p.total ?? 0, p.level ?? 1, p.todayPP ?? 0, p.todayDate || null).run();
    totalImported++;
  }

  // ── Import achievements ──
  if (body.achievements && Array.isArray(body.achievements)) {
    const stmts = body.achievements.map(a => {
      const id = typeof a === 'string' ? a : a.id || a.achievementId;
      const unlockedAt = typeof a === 'object' ? a.unlockedAt || new Date().toISOString() : new Date().toISOString();
      return db.prepare('INSERT OR IGNORE INTO achievements (child_id, achievement_id, unlocked_at) VALUES (?, ?, ?)')
        .bind(childId, id, unlockedAt);
    });
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import seen tips ──
  if (body.seenTips && Array.isArray(body.seenTips)) {
    const stmts = body.seenTips.map(t => {
      const tipId = typeof t === 'string' ? t : t.id || t.tipId;
      const lastSeen = typeof t === 'object' ? t.lastSeenDate || new Date().toISOString() : new Date().toISOString();
      return db.prepare('INSERT OR IGNORE INTO seen_tips (child_id, tip_id, last_seen_date) VALUES (?, ?, ?)')
        .bind(childId, tipId, lastSeen);
    });
    if (stmts.length > 0) {
      for (let i = 0; i < stmts.length; i += 100) {
        await db.batch(stmts.slice(i, i + 100));
      }
      totalImported += stmts.length;
    }
  }

  // ── Import last session date ──
  // Same UPDATE-only bug as streaks/PP — fixed via upsert.
  if (body.lastSessionDate) {
    await db.prepare(
      `INSERT INTO preferences (child_id, last_session_date, version)
       VALUES (?, ?, 1)
       ON CONFLICT(child_id) DO UPDATE SET
         last_session_date = excluded.last_session_date,
         version = 1,
         updated_at = datetime('now')`
    ).bind(childId, body.lastSessionDate).run();
  }

  // Record migration
  const source = body._source || 'localStorage';
  await db.prepare(
    'INSERT INTO migrations (child_id, source, items_imported) VALUES (?, ?, ?)'
  ).bind(childId, source, totalImported).run();

  return json({
    ok: true,
    itemsImported: totalImported,
    source,
  }, 201);
}

// GET /api/data/export — Download all child's data as JSON (GDPR portability)
export async function handleExport(request, env, userId) {
  const db = env.DB;

  // Get account
  const account = await db.prepare(
    'SELECT id, email, name, created_at, consent_given_at, consent_version FROM accounts WHERE id = ?'
  ).bind(userId).first();
  if (!account) return json({ error: 'Account not found' }, 404);

  const childId = await getChildId(db, userId);
  if (!childId) return json({ error: 'No child profile' }, 404);

  const child = await db.prepare('SELECT display_name, created_at FROM children WHERE id = ?').bind(childId).first();

  // Fetch everything
  const [qr, mr, tp, lq, lh, sq, ps, ach, st, str, pp, pref] = await Promise.all([
    db.prepare('SELECT * FROM quiz_results WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM mock_test_results WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM topic_performance WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM leitner_queue WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM lesson_history WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM seen_questions WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM practice_sessions WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM achievements WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM seen_tips WHERE child_id = ?').bind(childId).all(),
    db.prepare('SELECT * FROM streaks WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT * FROM prep_points WHERE child_id = ?').bind(childId).first(),
    db.prepare('SELECT * FROM preferences WHERE child_id = ?').bind(childId).first(),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    account: { email: account.email, name: account.name, createdAt: account.created_at },
    child: { displayName: child.display_name, createdAt: child.created_at },
    quizResults: qr.results,
    mockTestResults: mr.results,
    topicPerformance: tp.results,
    leitnerQueue: lq.results,
    lessonHistory: lh.results,
    seenQuestions: sq.results,
    practiceSessions: ps.results,
    achievements: ach.results,
    seenTips: st.results,
    streaks: str,
    prepPoints: pp,
    preferences: pref,
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="11plus-data-export.json"',
      ...BASE_HEADERS,
    },
  });
}

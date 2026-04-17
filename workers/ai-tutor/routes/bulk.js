// ── Bulk Load, Migration, and Export Routes ──

import { json, getChildId, BASE_HEADERS } from '../helpers.js';

// GET /api/data/all — Fetch ALL child data in one request (used on login)
export async function handleBulkLoad(request, env, userId) {
  const db = env.DB;
  const childId = await getChildId(db, userId);
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
    db.prepare('SELECT lesson_id, completed_at FROM lesson_history WHERE child_id = ?').bind(childId).all(),
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
  if (body.quizHistory && Array.isArray(body.quizHistory)) {
    const stmts = body.quizHistory.map(q =>
      db.prepare(
        `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, q.topicKey || q.topic || '', q.category || q.subject || 'maths',
        q.score || 0, q.total || q.questions?.length || 10,
        q.time || null, q.quizMode || null, q.date || new Date().toISOString()
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
  if (body.questionResults && Array.isArray(body.questionResults)) {
    const stmts = body.questionResults.map(q =>
      db.prepare(
        `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty, attempted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        childId, q.questionId || 0, q.topicKey || '', q.subject || 'maths',
        q.isCorrect ? 1 : 0, q.timeMs || null, q.difficulty || null,
        q.timestamp || new Date().toISOString()
      )
    );
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
  if (body.topicPerformance && typeof body.topicPerformance === 'object') {
    const stmts = Object.entries(body.topicPerformance).map(([key, data]) =>
      db.prepare(
        `INSERT OR REPLACE INTO topic_performance (child_id, topic_key, subject, data, version)
         VALUES (?, ?, ?, ?, 1)`
      ).bind(childId, key, 'maths', JSON.stringify(data))
    );
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
  if (body.streaks && typeof body.streaks === 'object') {
    const s = body.streaks;
    await db.prepare(
      `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
       streak_history = ?, version = 1 WHERE child_id = ?`
    ).bind(
      s.currentStreak ?? 0, s.longestStreak ?? 0, s.lastQuizDate || null,
      JSON.stringify(s.streakHistory || []), childId
    ).run();
    totalImported++;
  }

  // ── Import prep points ──
  if (body.prepPoints && typeof body.prepPoints === 'object') {
    const p = body.prepPoints;
    await db.prepare(
      `UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?, version = 1 WHERE child_id = ?`
    ).bind(p.total ?? 0, p.level ?? 1, p.todayPP ?? 0, p.todayDate || null, childId).run();
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
  if (body.lastSessionDate) {
    await db.prepare('UPDATE preferences SET last_session_date = ? WHERE child_id = ?')
      .bind(body.lastSessionDate, childId).run();
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

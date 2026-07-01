// ── Learning Data Routes (append-only — no conflicts possible) ──

import { json, getChildId } from '../helpers.js';
import { loadEntitlement, upgradeRequiredResponse } from '../lib/entitlementGate.js';

export async function handleDataRoutes(request, env, userId, path) {
  const db = env.DB;
  const childId = await getChildId(db, userId);
  if (!childId) return json({ error: 'No child profile. Create one first.' }, 404);

  // ── Quiz Results ──

  // POST /api/data/quiz-result — Save quiz completion
  if (path === '/api/data/quiz-result' && request.method === 'POST') {
    const { topicKey, subject, score, total, timeSeconds, quizMode } = await request.json();
    if (!topicKey || !subject || score == null || !total) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await db.prepare(
      `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, time_seconds, quiz_mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(childId, topicKey, subject, score, total, timeSeconds || null, quizMode || null).run();
    return json({ ok: true }, 201);
  }

  // GET /api/data/quiz-history — Get all quiz results
  if (path === '/api/data/quiz-history' && request.method === 'GET') {
    const { results } = await db.prepare(
      'SELECT * FROM quiz_results WHERE child_id = ? ORDER BY completed_at DESC'
    ).bind(childId).all();
    return json({ results });
  }

  // ── Mock Test Results ──

  // POST /api/data/mock-result — Save mock test result
  if (path === '/api/data/mock-result' && request.method === 'POST') {
    // Mock tests are a paid-tier feature (Phase 0 Step 4). This legacy
    // (non-batch) route is still reachable so it needs the same gate as
    // routes/batch.js's mock-result op.
    const ent = await loadEntitlement(env.DB, userId);
    if (!ent) return json({ error: 'Account not found' }, 404);
    if (!ent.entitlements.mockTests) return upgradeRequiredResponse(ent);

    const { subject, totalQuestions, totalCorrect, percentage, timeTaken, timeLimit, sectionResults, questionTimes } = await request.json();
    if (!subject || totalQuestions == null || totalCorrect == null) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await db.prepare(
      `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, time_taken, time_limit, section_results, question_times)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      childId, subject, totalQuestions, totalCorrect, percentage || 0,
      timeTaken || 0, timeLimit || 0,
      JSON.stringify(sectionResults || {}),
      JSON.stringify(questionTimes || {})
    ).run();
    return json({ ok: true }, 201);
  }

  // GET /api/data/mock-history — Get all mock test results
  if (path === '/api/data/mock-history' && request.method === 'GET') {
    const { results } = await db.prepare(
      'SELECT * FROM mock_test_results WHERE child_id = ? ORDER BY completed_at DESC'
    ).bind(childId).all();
    // Parse JSON fields back
    const parsed = results.map(r => ({
      ...r,
      section_results: JSON.parse(r.section_results),
      question_times: r.question_times ? JSON.parse(r.question_times) : null,
    }));
    return json({ results: parsed });
  }

  // ── Question Results ──

  // POST /api/data/question-result — Save individual question attempt
  if (path === '/api/data/question-result' && request.method === 'POST') {
    const { questionId, topicKey, subject, isCorrect, timeMs, difficulty } = await request.json();
    if (questionId == null || !topicKey || !subject || isCorrect == null) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await db.prepare(
      `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, time_ms, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(childId, questionId, topicKey, subject, isCorrect ? 1 : 0, timeMs || null, difficulty || null).run();
    return json({ ok: true }, 201);
  }

  // ── Lesson History ──

  // POST /api/data/lesson-complete — Mark lesson completed (idempotent)
  if (path === '/api/data/lesson-complete' && request.method === 'POST') {
    const { lessonId } = await request.json();
    if (!lessonId) return json({ error: 'Missing lessonId' }, 400);
    await db.prepare(
      `INSERT OR IGNORE INTO lesson_history (child_id, lesson_id) VALUES (?, ?)`
    ).bind(childId, lessonId).run();
    return json({ ok: true }, 201);
  }

  // GET /api/data/lesson-history — Get lesson completions
  if (path === '/api/data/lesson-history' && request.method === 'GET') {
    const { results } = await db.prepare(
      'SELECT lesson_id, completed_at FROM lesson_history WHERE child_id = ?'
    ).bind(childId).all();
    return json({ results });
  }

  // ── Seen Questions ──

  // POST /api/data/seen-question — Mark question as seen (idempotent)
  if (path === '/api/data/seen-question' && request.method === 'POST') {
    const { questionId, topicKey, subject } = await request.json();
    if (questionId == null || !topicKey || !subject) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await db.prepare(
      `INSERT OR IGNORE INTO seen_questions (child_id, question_id, topic_key, subject) VALUES (?, ?, ?, ?)`
    ).bind(childId, questionId, topicKey, subject).run();
    return json({ ok: true }, 201);
  }

  // ── Practice Sessions ──

  // POST /api/data/practice-session — Save daily session (upsert by date)
  if (path === '/api/data/practice-session' && request.method === 'POST') {
    const { sessionDate, data } = await request.json();
    if (!sessionDate || !data) return json({ error: 'Missing sessionDate or data' }, 400);
    await db.prepare(
      `INSERT INTO practice_sessions (child_id, session_date, data)
       VALUES (?, ?, ?)
       ON CONFLICT(child_id, session_date) DO UPDATE SET data = excluded.data, created_at = datetime('now')`
    ).bind(childId, sessionDate, JSON.stringify(data)).run();
    return json({ ok: true }, 201);
  }

  // ── Achievements ──

  // POST /api/data/achievement — Unlock achievement (idempotent)
  if (path === '/api/data/achievement' && request.method === 'POST') {
    const { achievementId } = await request.json();
    if (!achievementId) return json({ error: 'Missing achievementId' }, 400);
    await db.prepare(
      `INSERT OR IGNORE INTO achievements (child_id, achievement_id) VALUES (?, ?)`
    ).bind(childId, achievementId).run();
    return json({ ok: true }, 201);
  }

  // ── Seen Tips ──

  // POST /api/data/seen-tip — Mark tip as seen (upsert)
  if (path === '/api/data/seen-tip' && request.method === 'POST') {
    const { tipId, lastSeenDate } = await request.json();
    if (!tipId || !lastSeenDate) return json({ error: 'Missing tipId or lastSeenDate' }, 400);
    await db.prepare(
      `INSERT INTO seen_tips (child_id, tip_id, last_seen_date)
       VALUES (?, ?, ?)
       ON CONFLICT(child_id, tip_id) DO UPDATE SET last_seen_date = excluded.last_seen_date`
    ).bind(childId, tipId, lastSeenDate).run();
    return json({ ok: true }, 201);
  }

  return null; // Route not matched
}

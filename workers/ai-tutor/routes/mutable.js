// ── Mutable Data Routes (versioned — optimistic concurrency) ──
// All PATCH routes require { version: N, ...updates } in the body.
// Server rejects with 409 Conflict if version != current.

import { json, getChildId } from '../helpers.js';

export async function handleMutableRoutes(request, env, userId, path) {
  const db = env.DB;
  const childId = await getChildId(db, userId);
  if (!childId) return json({ error: 'No child profile. Create one first.' }, 404);

  // ── Topic Performance ──

  // GET /api/data/topic-performance — Get all topic performance
  if (path === '/api/data/topic-performance' && request.method === 'GET') {
    const { results } = await db.prepare(
      'SELECT topic_key, subject, data, version, updated_at FROM topic_performance WHERE child_id = ?'
    ).bind(childId).all();
    const parsed = results.map(r => ({ ...r, data: JSON.parse(r.data) }));
    return json({ results: parsed });
  }

  // PATCH /api/data/topic-performance — Update one topic's performance
  if (path.startsWith('/api/data/topic-performance/') && request.method === 'PATCH') {
    const segments = path.split('/');
    // /api/data/topic-performance/:topicKey/:subject
    const topicKey = decodeURIComponent(segments[4]);
    const subject = decodeURIComponent(segments[5]);
    if (!topicKey || !subject) return json({ error: 'Missing topicKey or subject in URL' }, 400);

    const { version, data } = await request.json();
    if (version == null || !data) return json({ error: 'Missing version or data' }, 400);

    // Upsert with version check
    const existing = await db.prepare(
      'SELECT version FROM topic_performance WHERE child_id = ? AND topic_key = ? AND subject = ?'
    ).bind(childId, topicKey, subject).first();

    if (existing) {
      if (existing.version !== version) {
        return json({ error: 'Version conflict', currentVersion: existing.version }, 409);
      }
      await db.prepare(
        `UPDATE topic_performance SET data = ?, version = version + 1, updated_at = datetime('now')
         WHERE child_id = ? AND topic_key = ? AND subject = ?`
      ).bind(JSON.stringify(data), childId, topicKey, subject).run();
    } else {
      await db.prepare(
        `INSERT INTO topic_performance (child_id, topic_key, subject, data, version)
         VALUES (?, ?, ?, ?, 1)`
      ).bind(childId, topicKey, subject, JSON.stringify(data)).run();
    }

    return json({ ok: true, version: existing ? existing.version + 1 : 1 });
  }

  // ── Leitner Queue ──

  // GET /api/data/leitner-queue — Get full queue
  if (path === '/api/data/leitner-queue' && request.method === 'GET') {
    const { results } = await db.prepare(
      'SELECT question_id, topic_key, subject, level, last_reviewed, next_review, times_correct, times_incorrect FROM leitner_queue WHERE child_id = ?'
    ).bind(childId).all();
    return json({ results });
  }

  // PATCH /api/data/leitner-entry — Upsert single queue entry
  if (path === '/api/data/leitner-entry' && request.method === 'PATCH') {
    const { questionId, topicKey, subject, level, lastReviewed, nextReview, timesCorrect, timesIncorrect } = await request.json();
    if (questionId == null || !topicKey) return json({ error: 'Missing questionId or topicKey' }, 400);

    await db.prepare(
      `INSERT INTO leitner_queue (child_id, question_id, topic_key, subject, level, last_reviewed, next_review, times_correct, times_incorrect)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(child_id, question_id, topic_key) DO UPDATE SET
         level = excluded.level, last_reviewed = excluded.last_reviewed,
         next_review = excluded.next_review, times_correct = excluded.times_correct,
         times_incorrect = excluded.times_incorrect`
    ).bind(
      childId, questionId, topicKey, subject || '',
      level ?? 0, lastReviewed || null, nextReview || null,
      timesCorrect ?? 0, timesIncorrect ?? 0
    ).run();
    return json({ ok: true });
  }

  // DELETE /api/data/leitner-entry — Remove retired entry
  if (path === '/api/data/leitner-entry' && request.method === 'DELETE') {
    const { questionId, topicKey } = await request.json();
    if (questionId == null || !topicKey) return json({ error: 'Missing questionId or topicKey' }, 400);
    await db.prepare(
      'DELETE FROM leitner_queue WHERE child_id = ? AND question_id = ? AND topic_key = ?'
    ).bind(childId, questionId, topicKey).run();
    return json({ ok: true });
  }

  // ── Streaks ──

  // GET /api/data/streaks — Get streak data
  if (path === '/api/data/streaks' && request.method === 'GET') {
    const row = await db.prepare(
      'SELECT current_streak, longest_streak, last_quiz_date, streak_history, version, updated_at FROM streaks WHERE child_id = ?'
    ).bind(childId).first();
    if (!row) return json({ error: 'Streak data not found' }, 404);
    return json({ ...row, streak_history: JSON.parse(row.streak_history) });
  }

  // PATCH /api/data/streaks — Update streak (versioned)
  if (path === '/api/data/streaks' && request.method === 'PATCH') {
    const { version, currentStreak, longestStreak, lastQuizDate, streakHistory } = await request.json();
    if (version == null) return json({ error: 'Missing version' }, 400);

    const existing = await db.prepare('SELECT version FROM streaks WHERE child_id = ?').bind(childId).first();
    if (!existing) return json({ error: 'Streak data not found' }, 404);
    if (existing.version !== version) {
      return json({ error: 'Version conflict', currentVersion: existing.version }, 409);
    }

    await db.prepare(
      `UPDATE streaks SET current_streak = ?, longest_streak = ?, last_quiz_date = ?,
       streak_history = ?, version = version + 1, updated_at = datetime('now')
       WHERE child_id = ?`
    ).bind(
      currentStreak ?? 0, longestStreak ?? 0, lastQuizDate || null,
      JSON.stringify(streakHistory || []), childId
    ).run();
    return json({ ok: true, version: existing.version + 1 });
  }

  // ── Prep Points ──

  // GET /api/data/prep-points — Get prep points
  if (path === '/api/data/prep-points' && request.method === 'GET') {
    const row = await db.prepare(
      'SELECT total, level, today_pp, today_date, version, updated_at FROM prep_points WHERE child_id = ?'
    ).bind(childId).first();
    if (!row) return json({ error: 'Prep points data not found' }, 404);
    return json(row);
  }

  // PATCH /api/data/prep-points — Update prep points (versioned)
  if (path === '/api/data/prep-points' && request.method === 'PATCH') {
    const { version, total, level, todayPP, todayDate } = await request.json();
    if (version == null) return json({ error: 'Missing version' }, 400);

    const existing = await db.prepare('SELECT version FROM prep_points WHERE child_id = ?').bind(childId).first();
    if (!existing) return json({ error: 'Prep points data not found' }, 404);
    if (existing.version !== version) {
      return json({ error: 'Version conflict', currentVersion: existing.version }, 409);
    }

    await db.prepare(
      `UPDATE prep_points SET total = ?, level = ?, today_pp = ?, today_date = ?,
       version = version + 1, updated_at = datetime('now')
       WHERE child_id = ?`
    ).bind(total ?? 0, level ?? 1, todayPP ?? 0, todayDate || null, childId).run();
    return json({ ok: true, version: existing.version + 1 });
  }

  // ── Preferences ──

  // GET /api/data/preferences — Get preferences
  if (path === '/api/data/preferences' && request.method === 'GET') {
    const row = await db.prepare(
      'SELECT last_session_date, version, updated_at FROM preferences WHERE child_id = ?'
    ).bind(childId).first();
    if (!row) return json({ error: 'Preferences not found' }, 404);
    return json(row);
  }

  // PATCH /api/data/preferences — Update preferences (versioned)
  if (path === '/api/data/preferences' && request.method === 'PATCH') {
    const { version, lastSessionDate } = await request.json();
    if (version == null) return json({ error: 'Missing version' }, 400);

    const existing = await db.prepare('SELECT version FROM preferences WHERE child_id = ?').bind(childId).first();
    if (!existing) return json({ error: 'Preferences not found' }, 404);
    if (existing.version !== version) {
      return json({ error: 'Version conflict', currentVersion: existing.version }, 409);
    }

    await db.prepare(
      `UPDATE preferences SET last_session_date = ?, version = version + 1, updated_at = datetime('now')
       WHERE child_id = ?`
    ).bind(lastSessionDate || null, childId).run();
    return json({ ok: true, version: existing.version + 1 });
  }

  return null; // Route not matched
}

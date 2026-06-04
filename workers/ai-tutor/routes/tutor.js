// ── Tutor Routes (Phase 2) ──
// POST   /api/tutor              — Create tutor profile (open signup)
// GET    /api/tutor              — Get own tutor profile
// PATCH  /api/tutor              — Update profile (name, bio, photo)
// GET    /api/tutor/roster       — Get this tutor's pupil list
// DELETE /api/tutor/roster/:id   — Remove a pupil from roster
// POST   /api/tutor/join         — Parent accepts invite (auth-protected)
//
// Public (no auth):
// GET    /api/tutor/public/:code — Public tutor profile (for join page preview)

import { json } from '../helpers.js';

// ── Tutor code generation ──
// 8 uppercase chars, no confusable characters (0, O, 1, I, L).
const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateTutorCode() {
  let code = '';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (const byte of array) {
    code += SAFE_CHARS[byte % SAFE_CHARS.length];
  }
  return code.slice(0, 4) + '-' + code.slice(4);
}

export async function handleTutorRoutes(request, env, userId, path) {
  const db = env.DB;

  // ── Public route (no auth check at this layer) ──
  // Called from index.js BEFORE the auth gate — see router wiring note below.
  if (path.startsWith('/api/tutor/public/') && request.method === 'GET') {
    const tutorCode = decodeURIComponent(path.slice('/api/tutor/public/'.length));
    if (!tutorCode) return json({ error: 'Missing tutor code' }, 400);

    const tutor = await db.prepare(
      'SELECT display_name, photo_url, bio, tutor_code FROM tutors WHERE tutor_code = ?'
    ).bind(tutorCode.toUpperCase()).first();

    if (!tutor) return json({ error: 'Tutor not found' }, 404);
    return json({ tutor });
  }

  // ── Auth-protected routes ──
  // All routes below require userId (caller already verified at index.js level).

  // POST /api/tutor — Create tutor profile
  if (path === '/api/tutor' && request.method === 'POST') {
    const existing = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
    if (existing) return json({ error: 'Tutor profile already exists' }, 409);

    // Need the user's email — fetch from their account record
    const account = await db.prepare('SELECT email FROM accounts WHERE id = ?').bind(userId).first();
    if (!account) return json({ error: 'Account not found. Create a parent account first.' }, 404);

    const { displayName, bio, photoUrl } = await request.json();
    if (!displayName || displayName.trim().length === 0) {
      return json({ error: 'Missing displayName' }, 400);
    }

    // Generate a unique tutor code (retry on the rare collision)
    let tutorCode;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateTutorCode();
      const collision = await db.prepare('SELECT id FROM tutors WHERE tutor_code = ?').bind(candidate).first();
      if (!collision) { tutorCode = candidate; break; }
    }
    if (!tutorCode) return json({ error: 'Could not generate a unique tutor code. Try again.' }, 500);

    await db.prepare(
      `INSERT INTO tutors (id, email, display_name, bio, photo_url, tutor_code)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(userId, account.email, displayName.trim(), bio?.trim() || null, photoUrl?.trim() || null, tutorCode).run();

    const tutor = await db.prepare('SELECT * FROM tutors WHERE id = ?').bind(userId).first();
    return json({ ok: true, tutor }, 201);
  }

  // GET /api/tutor — Get own profile
  if (path === '/api/tutor' && request.method === 'GET') {
    const tutor = await db.prepare('SELECT * FROM tutors WHERE id = ?').bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 404);
    return json({ tutor });
  }

  // PATCH /api/tutor — Update profile
  if (path === '/api/tutor' && request.method === 'PATCH') {
    const existing = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
    if (!existing) return json({ error: 'No tutor profile found' }, 404);

    const { displayName, bio, photoUrl } = await request.json();
    const updates = [];
    const binds = [];
    if (displayName !== undefined) { updates.push('display_name = ?'); binds.push(displayName.trim()); }
    if (bio !== undefined)         { updates.push('bio = ?');          binds.push(bio?.trim() || null); }
    if (photoUrl !== undefined)    { updates.push('photo_url = ?');    binds.push(photoUrl?.trim() || null); }

    if (updates.length === 0) return json({ error: 'No fields to update' }, 400);

    binds.push(userId);
    await db.prepare(`UPDATE tutors SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run();

    const tutor = await db.prepare('SELECT * FROM tutors WHERE id = ?').bind(userId).first();
    return json({ ok: true, tutor });
  }

  // GET /api/tutor/dashboard — Aggregated dashboard data (pulse + per-pupil)
  if (path === '/api/tutor/dashboard' && request.method === 'GET') {
    const tutor = await db.prepare(
      'SELECT id, display_name AS name, bio, tutor_code FROM tutors WHERE id = ?'
    ).bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 404);

    // Roster
    const { results: roster } = await db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school,
             pt.joined_at, a.name AS parent_name
      FROM pupil_tutors pt
      JOIN children c ON c.id = pt.child_id
      JOIN accounts a ON a.id = c.account_id
      WHERE pt.tutor_id = ?
      ORDER BY pt.joined_at ASC
    `).bind(userId).all();

    if (roster.length === 0) {
      return json({ tutor, roster: [], pulse: null });
    }

    // Fetch all per-pupil data in parallel
    const [quizActiveRows, mockActiveRows, lessonActiveRows, weeklyRows, topicRows, overdueRows] = await Promise.all([
      // Last active — pulled from every activity type, not just quizzes, so a
      // pupil who did a mock test or micro-lesson (but no quiz) still counts as
      // active. The three are merged in JS below (date formats differ across
      // tables, so MAX is taken on parsed timestamps rather than in SQL).
      db.prepare(`
        SELECT child_id, MAX(completed_at) as last_active
        FROM quiz_results
        WHERE child_id IN (SELECT child_id FROM pupil_tutors WHERE tutor_id = ?)
        GROUP BY child_id
      `).bind(userId).all(),

      db.prepare(`
        SELECT child_id, MAX(completed_at) as last_active
        FROM mock_test_results
        WHERE child_id IN (SELECT child_id FROM pupil_tutors WHERE tutor_id = ?)
        GROUP BY child_id
      `).bind(userId).all(),

      db.prepare(`
        SELECT child_id, MAX(completed_at) as last_active
        FROM lesson_history
        WHERE child_id IN (SELECT child_id FROM pupil_tutors WHERE tutor_id = ?)
        GROUP BY child_id
      `).bind(userId).all(),

      // This week's quizzes per child
      db.prepare(`
        SELECT child_id,
               COUNT(*) as quiz_count,
               SUM(score) * 1.0 / SUM(total) as accuracy
        FROM quiz_results
        WHERE child_id IN (SELECT child_id FROM pupil_tutors WHERE tutor_id = ?)
          AND completed_at > datetime('now', '-7 days')
          AND total > 0
        GROUP BY child_id
      `).bind(userId).all(),

      // Weakest topic per child (last 30 days, ≥2 quizzes on topic)
      db.prepare(`
        SELECT child_id, topic_key, subject,
               SUM(score) * 1.0 / SUM(total) as accuracy,
               COUNT(*) as quiz_count
        FROM quiz_results
        WHERE child_id IN (SELECT child_id FROM pupil_tutors WHERE tutor_id = ?)
          AND completed_at > datetime('now', '-30 days')
          AND total > 0
        GROUP BY child_id, topic_key
        HAVING quiz_count >= 2
        ORDER BY child_id, accuracy ASC
      `).bind(userId).all(),

      // Overdue assignment count per child
      db.prepare(`
        SELECT ar.child_id, COUNT(*) as overdue_count
        FROM assignment_recipients ar
        JOIN assignments a ON a.id = ar.assignment_id
        WHERE a.tutor_id = ?
          AND date(a.due_date) < date('now')
          AND ar.status NOT IN ('completed', 'cleared')
        GROUP BY ar.child_id
      `).bind(userId).all(),
    ]);

    // Index by child_id for O(1) lookup
    const quizActiveMap = Object.fromEntries((quizActiveRows.results || []).map(r => [r.child_id, r.last_active]));
    const mockActiveMap = Object.fromEntries((mockActiveRows.results || []).map(r => [r.child_id, r.last_active]));
    const lessonActiveMap = Object.fromEntries((lessonActiveRows.results || []).map(r => [r.child_id, r.last_active]));
    const weeklyMap = Object.fromEntries((weeklyRows.results || []).map(r => [r.child_id, r]));
    const overdueMap = Object.fromEntries((overdueRows.results || []).map(r => [r.child_id, r.overdue_count]));

    // Most recent activity timestamp (ms) across all activity types for a child,
    // or null if they've never done anything. new Date() handles both the ISO
    // strings quizzes/lessons store and the "YYYY-MM-DD HH:MM:SS" format.
    const lastActiveTs = (childId) => {
      const ts = [quizActiveMap[childId], mockActiveMap[childId], lessonActiveMap[childId]]
        .filter(Boolean)
        .map(d => new Date(d).getTime())
        .filter(t => !Number.isNaN(t));
      return ts.length ? Math.max(...ts) : null;
    };

    // Weakest topic per child — topicRows already ordered ASC per child, take first per child
    const weakestTopicMap = {};
    for (const row of (topicRows.results || [])) {
      if (!weakestTopicMap[row.child_id]) weakestTopicMap[row.child_id] = row;
    }

    const now = Date.now();
    const enrichedRoster = roster.map(child => {
      const lastActiveMs = lastActiveTs(child.id);
      const lastActive = lastActiveMs !== null ? new Date(lastActiveMs).toISOString() : null;
      const daysInactive = lastActiveMs !== null
        ? Math.floor((now - lastActiveMs) / 86400000)
        : null;
      const weekly = weeklyMap[child.id] || null;
      const weakest = weakestTopicMap[child.id] || null;
      const overdueCount = overdueMap[child.id] || 0;

      return {
        ...child,
        last_active: lastActive,
        days_inactive: daysInactive,
        quizzes_this_week: weekly?.quiz_count || 0,
        accuracy_this_week: weekly ? Math.round(weekly.accuracy * 100) : null,
        weakest_topic: weakest?.topic_key || null,
        weakest_subject: weakest?.subject || null,
        weakest_accuracy: weakest ? Math.round(weakest.accuracy * 100) : null,
        overdue_assignments: overdueCount,
        assignment_status: overdueCount > 0 ? 'overdue' : weekly ? 'on_track' : 'none',
      };
    });

    // Sort: most at-risk first (inactive longest, then by accuracy)
    enrichedRoster.sort((a, b) => {
      const aInactive = a.days_inactive ?? 999;
      const bInactive = b.days_inactive ?? 999;
      if (aInactive !== bInactive) return bInactive - aInactive;
      return (a.accuracy_this_week ?? -1) - (b.accuracy_this_week ?? -1);
    });

    // Aggregate pulse stats
    const activeThisWeek = enrichedRoster.filter(c => c.days_inactive !== null && c.days_inactive <= 7).length;
    const totalOverdue = enrichedRoster.reduce((s, c) => s + c.overdue_assignments, 0);

    const weeklyAccuracies = enrichedRoster.filter(c => c.accuracy_this_week !== null);
    const avgAccuracy = weeklyAccuracies.length > 0
      ? Math.round(weeklyAccuracies.reduce((s, c) => s + c.accuracy_this_week, 0) / weeklyAccuracies.length)
      : null;

    // Roster-wide weakest topic (aggregate across all pupils, ≥2 pupils struggling)
    const topicAccuracies = {};
    for (const row of (topicRows.results || [])) {
      if (!topicAccuracies[row.topic_key]) {
        topicAccuracies[row.topic_key] = { subject: row.subject, total: 0, count: 0 };
      }
      topicAccuracies[row.topic_key].total += row.accuracy;
      topicAccuracies[row.topic_key].count += 1;
    }
    let weakestRosterTopic = null;
    let weakestRosterAccuracy = 1;
    for (const [key, val] of Object.entries(topicAccuracies)) {
      if (val.count < 2) continue; // skip topics only 1 pupil has attempted
      const avg = val.total / val.count;
      if (avg < weakestRosterAccuracy) {
        weakestRosterAccuracy = avg;
        weakestRosterTopic = { topic_key: key, subject: val.subject, accuracy: Math.round(avg * 100), pupil_count: val.count };
      }
    }

    return json({
      tutor,
      roster: enrichedRoster,
      pulse: {
        active_this_week: activeThisWeek,
        total_pupils: roster.length,
        overdue_assignments: totalOverdue,
        avg_accuracy_this_week: avgAccuracy,
        weakest_topic: weakestRosterTopic,
      },
    });
  }

  // GET /api/tutor/roster — Get pupil list for this tutor
  if (path === '/api/tutor/roster' && request.method === 'GET') {
    const tutor = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 404);

    const { results: pupils } = await db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school,
             pt.joined_at,
             a.name AS account_name
      FROM pupil_tutors pt
      JOIN children c ON c.id = pt.child_id
      JOIN accounts a ON a.id = c.account_id
      WHERE pt.tutor_id = ?
      ORDER BY pt.joined_at ASC
    `).bind(userId).all();

    return json({ pupils });
  }

  // DELETE /api/tutor/roster/:childId — Remove pupil from roster
  if (path.startsWith('/api/tutor/roster/') && request.method === 'DELETE') {
    const childId = path.slice('/api/tutor/roster/'.length);
    if (!childId) return json({ error: 'Missing childId' }, 400);

    const tutor = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 404);

    const result = await db.prepare(
      'DELETE FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?'
    ).bind(childId, userId).run();

    if (result.meta.changes === 0) return json({ error: 'Pupil not on roster' }, 404);
    return json({ ok: true });
  }

  // POST /api/tutor/join — Parent links a child to a tutor via tutor code
  if (path === '/api/tutor/join' && request.method === 'POST') {
    const { tutorCode, childId } = await request.json();
    if (!tutorCode || !childId) return json({ error: 'Missing tutorCode or childId' }, 400);

    // Verify child belongs to this parent account
    const child = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(childId, userId).first();
    if (!child) return json({ error: 'Child not found on this account' }, 404);

    // Resolve tutor
    const tutor = await db.prepare('SELECT id FROM tutors WHERE tutor_code = ?').bind(tutorCode.toUpperCase()).first();
    if (!tutor) return json({ error: 'Tutor not found' }, 404);

    // Idempotent — silently succeed if already linked
    const existing = await db.prepare(
      'SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?'
    ).bind(childId, tutor.id).first();
    if (existing) return json({ ok: true, alreadyLinked: true });

    await db.prepare(
      'INSERT INTO pupil_tutors (child_id, tutor_id) VALUES (?, ?)'
    ).bind(childId, tutor.id).run();

    return json({ ok: true, alreadyLinked: false }, 201);
  }

  // GET /api/tutor/pupils/:childId — Full pupil drill-down (tutor's view)
  // Returns: child profile, recent quizzes, topic mastery, assignment recipients, notes count
  const drillDownMatch = path.match(/^\/api\/tutor\/pupils\/([^/]+)$/);
  if (drillDownMatch && request.method === 'GET') {
    const childId = drillDownMatch[1];
    if (!userId) return json({ error: 'Unauthorized' }, 401);

    const tutorId = userId;
    const tutorRow = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(tutorId).first();
    if (!tutorRow) return json({ error: 'No tutor profile found' }, 403);

    // Verify relationship
    const link = await db.prepare(
      'SELECT joined_at FROM pupil_tutors WHERE tutor_id = ? AND child_id = ?'
    ).bind(tutorId, childId).first();
    if (!link) return json({ error: 'Child not on roster' }, 404);

    const [child, quizResults, topicPerf, assignRecipients, notesCount, questionResults, mockTestHistory] = await Promise.all([
      // Child profile + parent account name
      db.prepare(`
        SELECT c.id, c.display_name, c.year_group, c.target_school, c.created_at,
               a.name AS account_name, a.email AS account_email
        FROM children c
        JOIN accounts a ON a.id = c.account_id
        WHERE c.id = ?
      `).bind(childId).first(),

      // Last 50 quiz results (newest first)
      db.prepare(`
        SELECT topic_key, subject, score, total, completed_at, session_id
        FROM quiz_results
        WHERE child_id = ?
        ORDER BY completed_at DESC
        LIMIT 50
      `).bind(childId).all(),

      // Topic mastery summary
      db.prepare(`
        SELECT topic_key, subject, data
        FROM topic_performance
        WHERE child_id = ?
      `).bind(childId).all(),

      // Assignment recipients for this (tutor × child) pair
      db.prepare(`
        SELECT ar.id, ar.status, ar.assigned_at, ar.completed_at, ar.score,
               ar.question_results,
               ai.item_type, ai.item_ref, ai.subject,
               a.title AS assignment_title, a.due_date
        FROM assignment_recipients ar
        JOIN assignment_items ai ON ai.id = ar.assignment_item_id
        JOIN assignments a ON a.id = ar.assignment_id
        WHERE ar.child_id = ? AND ar.tutor_id = ?
        ORDER BY a.due_date DESC
        LIMIT 30
      `).bind(childId, tutorId).all(),

      // Note count (not the bodies — list notes via GET /api/tutor/notes/:childId)
      db.prepare(
        'SELECT COUNT(*) as n FROM tutor_notes WHERE tutor_id = ? AND child_id = ?'
      ).bind(tutorId, childId).first(),

      // Per-question results for useMastery + quiz drill-down (last 500, newest first)
      db.prepare(`
        SELECT id, question_id, topic_key, subject, is_correct, time_ms, attempted_at,
               session_id, selected_answer
        FROM question_results
        WHERE child_id = ?
        ORDER BY attempted_at DESC
        LIMIT 500
      `).bind(childId).all(),

      // Mock test history
      db.prepare(`
        SELECT subject, percentage, completed_at
        FROM mock_test_results
        WHERE child_id = ?
        ORDER BY completed_at DESC
      `).bind(childId).all(),
    ]);

    const parsedTopicPerf = topicPerf.results.map(r => ({
      topicKey: r.topic_key, subject: r.subject,
      data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data,
    }));

    // Map question_results to the shape useMastery + QuizDetailScreen expect
    const mappedQuestionResults = (questionResults.results || []).map(r => {
      let selectedAnswer = null;
      if (r.selected_answer) {
        try { selectedAnswer = JSON.parse(r.selected_answer); } catch { selectedAnswer = null; }
      }
      return {
        id: r.id,
        date: r.attempted_at ? r.attempted_at.replace(' ', 'T') : null,
        topicKey: r.topic_key,
        subject: r.subject,
        correct: !!r.is_correct,
        timeSpentMs: r.time_ms || 0,
        questionId: r.question_id,
        sessionId: r.session_id || null,
        selectedAnswer,
      };
    });

    // Map mock_test_results to the shape useMastery expects
    const mappedMockHistory = (mockTestHistory.results || []).map(r => ({
      subject: r.subject,
      percentage: r.percentage,
      date: r.completed_at,
    }));

    const mappedQuizResults = (quizResults.results || []).map(r => ({
      topicKey: r.topic_key,
      subject: r.subject,
      score: r.score,
      total: r.total,
      completedAt: r.completed_at ? r.completed_at.replace(' ', 'T') : null,
      sessionId: r.session_id || null,
    }));

    return json({
      child: { ...child, joinedAt: link.joined_at },
      quizResults: mappedQuizResults,
      topicPerformance: parsedTopicPerf,
      assignmentRecipients: assignRecipients.results,
      notesCount: notesCount?.n || 0,
      questionResults: mappedQuestionResults,
      mockTestHistory: mappedMockHistory,
    });
  }

  return null;
}

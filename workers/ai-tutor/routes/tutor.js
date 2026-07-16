// ── Tutor Routes (Phase 2) ──
// POST   /api/tutor                     — Create tutor profile (open signup)
// GET    /api/tutor                     — Get own tutor profile
// PATCH  /api/tutor                     — Update profile (name, bio, photo)
// GET    /api/tutor/roster              — Get this tutor's pupil list
// DELETE /api/tutor/roster/:id          — Remove a pupil from roster
// POST   /api/tutor/join                — Parent accepts invite (auth-protected)
// POST   /api/tutor/join-intent         — Parent's authed session holds a
//                                          pending code (auth-protected) —
//                                          see plans/tutor-attribution-durability.md
// POST   /api/tutor/join-intent/decline — Parent explicitly declines (auth-protected)
//
// Public (no auth):
// GET    /api/tutor/public/:code — Public tutor profile (for join page preview)

import { json } from '../helpers.js';
import { buildDashboardData } from '../../../src/utils/tutorPulse.js';
import { loadEntitlementForAccount, pupilPlanMarker } from '../lib/entitlementGate.js';
import { resolveEntitlements } from '../lib/entitlements.js';
import { SUBJECT_LABELS } from '../lib/topicLabels.js';

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
      `INSERT INTO tutors (id, email, display_name, bio, photo_url, tutor_code, terms_version, terms_agreed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(userId, account.email, displayName.trim(), bio?.trim() || null, photoUrl?.trim() || null, tutorCode, '1.0').run();

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

    // Roster — also project the billing columns resolveEntitlements() needs
    // so each pupil's entitlement can be resolved in-JS with ZERO extra DB
    // reads (this is a roster of many pupils; loadEntitlementForAccount's
    // one-read-per-pupil pattern would be an N+1 here).
    const { results: roster } = await db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school,
             pt.joined_at, a.name AS parent_name,
             a.id AS account_id, a.created_at AS account_created_at,
             a.is_comped, a.comp_source, a.subscription_status,
             a.subscription_current_period_end
      FROM pupil_tutors pt
      JOIN children c ON c.id = pt.child_id
      JOIN accounts a ON a.id = c.account_id
      WHERE pt.tutor_id = ?
      ORDER BY pt.joined_at ASC
    `).bind(userId).all();

    if (roster.length === 0) {
      return json({ tutor, roster: [], pulse: null });
    }

    // Batch-resolve which pupils are entitled to deep progress data. Pure
    // (no DB read) — buildDashboardData nulls out accuracy/weakest-topic
    // fields and excludes non-entitled children from cross-pupil aggregates
    // for anyone not in this set. tutorPulse.js builds the roster response
    // from an explicit field allow-list, so the billing columns above never
    // reach the client.
    const entitlementNow = new Date();
    const entitledDeepChildIds = new Set();
    for (const row of roster) {
      const acct = {
        id: row.account_id,
        created_at: row.account_created_at,
        is_comped: row.is_comped,
        comp_source: row.comp_source,
        subscription_status: row.subscription_status,
        subscription_current_period_end: row.subscription_current_period_end,
      };
      const marker = pupilPlanMarker(resolveEntitlements(acct, { now: entitlementNow }));
      if (!marker.deepProgressLocked) entitledDeepChildIds.add(row.id);
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

      // Overdue assignments — row-level so the pulse can show which
      // assignments are overdue, not just how many. Counts derive from
      // these rows in buildDashboardData (one definition of "overdue").
      db.prepare(`
        SELECT ar.child_id, a.id AS assignment_id, a.title, a.due_date
        FROM assignment_recipients ar
        JOIN assignments a ON a.id = ar.assignment_id
        WHERE a.tutor_id = ?
          AND date(a.due_date) < date('now')
          AND ar.status NOT IN ('completed', 'cleared')
        ORDER BY a.due_date ASC
      `).bind(userId).all(),
    ]);

    const { roster: enrichedRoster, pulse } = buildDashboardData({
      roster,
      quizActiveRows: quizActiveRows.results || [],
      mockActiveRows: mockActiveRows.results || [],
      lessonActiveRows: lessonActiveRows.results || [],
      weeklyRows: weeklyRows.results || [],
      topicRows: topicRows.results || [],
      overdueRows: overdueRows.results || [],
      now: Date.now(),
      entitledDeepChildIds,
    });

    return json({ tutor, roster: enrichedRoster, pulse });
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

    // A successful join must always leave a server-side trace, even if the
    // client never posted a join-intent first (older client build, or the
    // parent typing the code straight into a Connect screen). This upsert
    // is the durable answer to "is this signup a tutor referral?" — see
    // plans/tutor-attribution-durability.md layer 2. It runs BEFORE the
    // idempotent-already-linked check below so a repeat join call also
    // repairs a missing/stale intent row for an already-connected pupil.
    // 'joined' is a one-way state here: it always wins over whatever the
    // row previously held (including a prior 'declined').
    const normalisedCode = tutorCode.toUpperCase();
    await db.prepare(`
      INSERT INTO join_intents (id, account_id, tutor_id, tutor_code, status)
      VALUES (?, ?, ?, ?, 'joined')
      ON CONFLICT(account_id, tutor_id) DO UPDATE SET
        status = 'joined',
        updated_at = datetime('now')
    `).bind(crypto.randomUUID(), userId, tutor.id, normalisedCode).run();

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

  // POST /api/tutor/join-intent — record that this parent's authed session
  // is holding a pending tutor code, BEFORE they decide to Connect or not.
  // Fire-and-forget from the client; idempotent; safe to call repeatedly.
  // See plans/tutor-attribution-durability.md layer 2 — this is what makes
  // a failed/abandoned/declined referral visible instead of silently
  // indistinguishable from an organic signup.
  if (path === '/api/tutor/join-intent' && request.method === 'POST') {
    const { tutorCode } = await request.json();
    if (!tutorCode || typeof tutorCode !== 'string') return json({ error: 'Missing tutorCode' }, 400);

    // Unknown code: write NOTHING. We don't create junk rows for typos or
    // probing, and the client already treats 404 here as "not a real code".
    const tutor = await db.prepare('SELECT id FROM tutors WHERE tutor_code = ?').bind(tutorCode.toUpperCase()).first();
    if (!tutor) return json({ error: 'Tutor not found' }, 404);

    // This is a fire-and-forget call from the client and may race the
    // account-creation POST on a brand-new signup. account_id has an FK to
    // accounts(id), so without this guard a not-yet-created account would
    // surface as an unhandled 500 instead of a clean, retryable response.
    const account = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(userId).first();
    if (!account) return json({ error: 'Account not found' }, 404);

    // Atomic upsert (never read-then-write — D1 is eventually consistent).
    // A fresh row is INSERTed as 'pending'. On conflict, updated_at always
    // bumps; status only moves 'declined' -> 'pending' (a returning parent
    // re-using the link is re-considering). 'pending' stays 'pending', and
    // 'joined' is NEVER downgraded — real consent, once recorded, is final.
    const normalisedCode = tutorCode.toUpperCase();
    await db.prepare(`
      INSERT INTO join_intents (id, account_id, tutor_id, tutor_code, status)
      VALUES (?, ?, ?, ?, 'pending')
      ON CONFLICT(account_id, tutor_id) DO UPDATE SET
        updated_at = datetime('now'),
        status = CASE WHEN join_intents.status = 'declined' THEN 'pending' ELSE join_intents.status END
    `).bind(crypto.randomUUID(), userId, tutor.id, normalisedCode).run();

    return json({ ok: true });
  }

  // POST /api/tutor/join-intent/decline — parent explicitly taps "Not now"
  // on JoinScreen. Records the decline so the parent is never re-offered
  // the same tutor's JoinScreen again UNLESS they revisit the join link
  // (which flips it back to 'pending' via the create endpoint above).
  if (path === '/api/tutor/join-intent/decline' && request.method === 'POST') {
    const { tutorCode } = await request.json();
    if (!tutorCode || typeof tutorCode !== 'string') return json({ error: 'Missing tutorCode' }, 400);

    const tutor = await db.prepare('SELECT id FROM tutors WHERE tutor_code = ?').bind(tutorCode.toUpperCase()).first();
    if (!tutor) return json({ error: 'Tutor not found' }, 404);

    const existing = await db.prepare(
      'SELECT status FROM join_intents WHERE account_id = ? AND tutor_id = ?'
    ).bind(userId, tutor.id).first();
    if (!existing) return json({ error: 'No join intent found' }, 404);

    // 'joined' is never downgraded. A decline posted for an
    // already-connected pupil (e.g. a stale "Not now" tap that lands after
    // Connect already fired) is a harmless no-op, not an error.
    if (existing.status === 'joined') return json({ ok: true, alreadyJoined: true });

    await db.prepare(
      `UPDATE join_intents SET status = 'declined', updated_at = datetime('now')
       WHERE account_id = ? AND tutor_id = ?`
    ).bind(userId, tutor.id).run();

    return json({ ok: true });
  }

  // GET /api/tutor/pupils/:childId — Full pupil drill-down (tutor's view)
  // Returns: child profile, recent quizzes, topic mastery, assignment recipients, notes count,
  //          question results, mock test history, and practiceLog for exam readiness consistency bonus
  //          — full deep data for an entitled pupil, or (for a locked/free pupil) the `basic`
  //          aggregate instead: one overall accuracy %, one accuracy % per subject, and
  //          engagement counts (freemium phase-0 Change 4b).
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

    // Child profile + parent account name + the account_id needed to resolve
    // THIS pupil's own entitlement — a free pupil's deep performance data
    // must never reach their tutor. See lib/entitlementGate.js.
    const childRow = await db.prepare(`
      SELECT c.id, c.display_name, c.year_group, c.target_school, c.created_at,
             a.id AS account_id, a.name AS account_name, a.email AS account_email
      FROM children c
      JOIN accounts a ON a.id = c.account_id
      WHERE c.id = ?
    `).bind(childId).first();

    const entitlement = await loadEntitlementForAccount(db, childRow?.account_id);
    const marker = pupilPlanMarker(entitlement);
    const deepAllowed = !marker.deepProgressLocked;

    // Basic data — fetched regardless of plan. assignRecipients needs the
    // row-level status/dates even for a locked pupil; its question_results
    // column (deep) is stripped below.
    const [assignRecipients, notesCount] = await Promise.all([
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
    ]);

    // Deep data — only fetched for an entitled pupil. Skipping the queries
    // entirely for a free pupil is both the privacy fix and a small perf win
    // (never fetch what we won't return).
    let quizResults = { results: [] };
    let topicPerf = { results: [] };
    let questionResults = { results: [] };
    let mockTestHistory = { results: [] };
    let practiceSessions = { results: [] };
    // Basic aggregate — only computed for a LOCKED (free) pupil. This is the
    // tutor's equivalent of the basic-vs-deep progress line: one overall
    // accuracy %, one accuracy % per subject, and two engagement counts.
    // Deliberately a SUM/GROUP BY against quiz_results ONLY — never
    // topic_performance, question_results, mock_test_results, or
    // practice_sessions, which stay untouched for a locked pupil.
    let basic = null;

    if (deepAllowed) {
      [quizResults, topicPerf, questionResults, mockTestHistory, practiceSessions] = await Promise.all([
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

        // Per-question results for useMastery + quiz drill-down (newest first).
        // NO LIMIT: exam readiness must score over the pupil's FULL history, exactly
        // like the child's own app (bulk load is unbounded). A LIMIT here truncates
        // older topics to zero and drags every subject's readiness down a band, so
        // the tutor view disagreed with the parent/child view (fixed 29 Jun 2026).
        db.prepare(`
          SELECT id, question_id, topic_key, subject, is_correct, time_ms, attempted_at,
                 session_id, selected_answer
          FROM question_results
          WHERE child_id = ?
          ORDER BY attempted_at DESC
        `).bind(childId).all(),

        // Mock test history
        db.prepare(`
          SELECT subject, percentage, completed_at
          FROM mock_test_results
          WHERE child_id = ?
          ORDER BY completed_at DESC
        `).bind(childId).all(),

        // Practice sessions — needed for the consistency bonus in useMastery.getExamReadiness
        db.prepare(`
          SELECT session_date, data
          FROM practice_sessions
          WHERE child_id = ?
          ORDER BY session_date DESC
        `).bind(childId).all(),
      ]);
    } else {
      const [overallRow, subjectRows, weekRow] = await Promise.all([
        // All-time overall: SUM(score)/SUM(total) across every quiz.
        db.prepare(`
          SELECT SUM(score) AS score_sum, SUM(total) AS total_sum
          FROM quiz_results
          WHERE child_id = ?
        `).bind(childId).first(),

        // All-time per-subject: SUM(score)/SUM(total) GROUP BY subject.
        // Topic-level rows are never selected — subject is the finest grain returned.
        db.prepare(`
          SELECT subject, SUM(score) AS score_sum, SUM(total) AS total_sum
          FROM quiz_results
          WHERE child_id = ?
          GROUP BY subject
        `).bind(childId).all(),

        // Engagement: questions attempted in the last 7 days.
        db.prepare(`
          SELECT SUM(total) AS week_total
          FROM quiz_results
          WHERE child_id = ? AND completed_at > datetime('now', '-7 days')
        `).bind(childId).first(),
      ]);

      const overallTotal = overallRow?.total_sum || 0;
      const overallScore = overallRow?.score_sum || 0;
      const subjectRowBySubject = new Map((subjectRows.results || []).map(r => [r.subject, r]));

      basic = {
        overallAccuracy: overallTotal > 0 ? Math.round((overallScore / overallTotal) * 100) : null,
        totalQuestions: overallTotal,
        questionsThisWeek: weekRow?.week_total || 0,
        subjectAccuracy: Object.keys(SUBJECT_LABELS).map(subject => {
          const row = subjectRowBySubject.get(subject);
          const subjectTotal = row?.total_sum || 0;
          const subjectScore = row?.score_sum || 0;
          return {
            subject,
            label: SUBJECT_LABELS[subject],
            accuracy: subjectTotal > 0 ? Math.round((subjectScore / subjectTotal) * 100) : null,
          };
        }),
      };
    }

    // Assignment recipients minus question_results (deep) for a locked pupil
    const mappedAssignmentRecipients = (assignRecipients.results || []).map(r => {
      if (deepAllowed) return r;
      const { question_results, ...basicFields } = r;
      return basicFields;
    });

    const response = {
      child: childRow ? {
        id: childRow.id,
        display_name: childRow.display_name,
        year_group: childRow.year_group,
        target_school: childRow.target_school,
        created_at: childRow.created_at,
        account_name: childRow.account_name,
        account_email: childRow.account_email,
        joinedAt: link.joined_at,
      } : null,
      assignmentRecipients: mappedAssignmentRecipients,
      notesCount: notesCount?.n || 0,
      pupilPlan: marker.pupilPlan,
      deepProgressLocked: marker.deepProgressLocked,
    };

    // Basic aggregates — only present for a locked (free) pupil. An
    // explicit allow-listed object, never a spread of a DB row.
    if (!deepAllowed) {
      response.basic = {
        overallAccuracy: basic.overallAccuracy,
        totalQuestions: basic.totalQuestions,
        questionsThisWeek: basic.questionsThisWeek,
        subjectAccuracy: basic.subjectAccuracy.map(s => ({
          subject: s.subject,
          label: s.label,
          accuracy: s.accuracy,
        })),
      };
    }

    if (deepAllowed) {
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

      // Map practice_sessions to the practiceLog shape useMastery expects
      // (mirrors useD1Data: spread data JSON, override date with session_date)
      const mappedPracticeLog = (practiceSessions.results || []).map(r => {
        let parsed = {};
        if (r.data) { try { parsed = JSON.parse(r.data); } catch { parsed = {}; } }
        return { ...parsed, date: r.session_date };
      });

      const mappedQuizResults = (quizResults.results || []).map(r => ({
        topicKey: r.topic_key,
        subject: r.subject,
        score: r.score,
        total: r.total,
        completedAt: r.completed_at ? r.completed_at.replace(' ', 'T') : null,
        sessionId: r.session_id || null,
      }));

      response.quizResults = mappedQuizResults;
      response.topicPerformance = parsedTopicPerf;
      response.questionResults = mappedQuestionResults;
      response.mockTestHistory = mappedMockHistory;
      response.practiceLog = mappedPracticeLog;
    }

    return json(response);
  }

  return null;
}

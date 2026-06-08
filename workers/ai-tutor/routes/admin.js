// ── Admin Routes ──
// Private, owner-only. Mounted behind requireAdmin in index.js, so every
// handler here can assume the caller is a verified admin.
//
//   GET    /api/admin/tutors                 — aggregated tutor + pupil overview
//   POST   /api/admin/tutor-allowlist        — grant tutor eligibility (by email)
//   DELETE /api/admin/tutor-allowlist        — revoke tutor eligibility
//   POST   /api/admin/comp                   — comp / uncomp an account
//   GET    /api/admin/remove-pupil-impact    — preview what remove-pupil deletes
//   POST   /api/admin/remove-pupil           — unlink a pupil from a tutor (scoped purge)
//
// Every mutation is wrapped with its admin_audit insert in one db.batch so the
// log can never disagree with what happened. target/detail hold opaque IDs and
// metadata only — no child names.

import { json, canonicalEmail } from '../helpers.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Build the admin_audit insert statement to batch alongside a mutation.
function auditStmt(db, adminId, action, target, detail) {
  return db.prepare(
    'INSERT INTO admin_audit (admin_id, action, target, detail) VALUES (?, ?, ?, ?)'
  ).bind(adminId, action, target, detail == null ? null : JSON.stringify(detail));
}

// Most-recent activity timestamp (ms) per child across all activity types,
// matching the tutor dashboard. One grouped query per table, merged in JS so
// differing date formats parse correctly. Returns a Map<childId, ms>.
async function lastActiveByChild(db) {
  const [quiz, mock, lesson] = await Promise.all([
    db.prepare('SELECT child_id, MAX(completed_at) AS t FROM quiz_results GROUP BY child_id').all(),
    db.prepare('SELECT child_id, MAX(completed_at) AS t FROM mock_test_results GROUP BY child_id').all(),
    db.prepare('SELECT child_id, MAX(completed_at) AS t FROM lesson_history GROUP BY child_id').all(),
  ]);
  const map = new Map();
  for (const rows of [quiz.results, mock.results, lesson.results]) {
    for (const r of (rows || [])) {
      if (!r.t) continue;
      const ms = new Date(r.t).getTime();
      if (Number.isNaN(ms)) continue;
      const prev = map.get(r.child_id);
      if (prev == null || ms > prev) map.set(r.child_id, ms);
    }
  }
  return map;
}

export async function handleAdminRoutes(request, env, admin, path) {
  const db = env.DB;

  // ── GET /api/admin/tutors ──
  if (path === '/api/admin/tutors' && request.method === 'GET') {
    // LEFT JOIN accounts so a tutor who deleted their parent account still shows.
    const [tutorsRes, pupilsRes, allowRes] = await Promise.all([
      db.prepare(`
        SELECT t.id, t.email, t.display_name, t.tutor_code, t.created_at,
               a.is_comped, a.subscription_status
        FROM tutors t
        LEFT JOIN accounts a ON a.id = t.id
        ORDER BY t.created_at ASC
      `).all(),
      db.prepare(`
        SELECT pt.tutor_id, c.id AS child_id, c.display_name, c.year_group,
               a.email AS parent_email, pt.joined_at
        FROM pupil_tutors pt
        JOIN children c ON c.id = pt.child_id
        JOIN accounts a ON a.id = c.account_id
      `).all(),
      db.prepare(`
        SELECT email, note, added_at FROM tutor_allowlist
        WHERE email NOT IN (SELECT lower(trim(email)) FROM tutors)
        ORDER BY added_at DESC
      `).all(),
    ]);

    const lastActive = await lastActiveByChild(db);
    const now = Date.now();
    const daysInactive = (childId) => {
      const ms = lastActive.get(childId);
      return ms == null ? null : Math.floor((now - ms) / 86400000);
    };

    const pupilsByTutor = new Map();
    for (const p of (pupilsRes.results || [])) {
      if (!pupilsByTutor.has(p.tutor_id)) pupilsByTutor.set(p.tutor_id, []);
      pupilsByTutor.get(p.tutor_id).push({
        child_id: p.child_id,
        display_name: p.display_name,
        year_group: p.year_group,
        parent_email: p.parent_email,
        joined_at: p.joined_at,
        days_inactive: daysInactive(p.child_id),
      });
    }

    const tutors = (tutorsRes.results || []).map(t => ({
      id: t.id,
      email: t.email,
      display_name: t.display_name,
      tutor_code: t.tutor_code,
      created_at: t.created_at,
      is_comped: !!t.is_comped,
      subscription_status: t.subscription_status || null,
      has_account: t.is_comped !== null || t.subscription_status !== null,
      pupils: pupilsByTutor.get(t.id) || [],
    }));

    return json({
      tutors,
      pending_invites: allowRes.results || [],
    });
  }

  // ── POST /api/admin/tutor-allowlist — grant ──
  if (path === '/api/admin/tutor-allowlist' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const email = canonicalEmail(body.email);
    if (!EMAIL_RE.test(email)) return json({ error: 'Valid email required' }, 400);
    const note = typeof body.note === 'string' ? body.note.slice(0, 200) : null;

    await db.batch([
      db.prepare(`
        INSERT INTO tutor_allowlist (email, note, added_by) VALUES (?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET note = excluded.note
      `).bind(email, note, admin.userId),
      auditStmt(db, admin.userId, 'grant_tutor', email, { note }),
    ]);
    return json({ ok: true, email });
  }

  // ── DELETE /api/admin/tutor-allowlist — revoke ──
  // Removes eligibility only. The tutors row, pupil links and data are untouched;
  // requireTutor will deny on the next request. Fully reversible (re-grant).
  if (path === '/api/admin/tutor-allowlist' && request.method === 'DELETE') {
    const body = await request.json().catch(() => ({}));
    const email = canonicalEmail(body.email);
    if (!email) return json({ error: 'Email required' }, 400);

    const existing = await db.prepare('SELECT 1 FROM tutor_allowlist WHERE email = ?').bind(email).first();
    if (!existing) return json({ error: 'Not on allowlist' }, 404);

    await db.batch([
      db.prepare('DELETE FROM tutor_allowlist WHERE email = ?').bind(email),
      auditStmt(db, admin.userId, 'revoke_tutor', email, null),
    ]);
    return json({ ok: true, email });
  }

  // ── POST /api/admin/comp — comp / uncomp an account ──
  if (path === '/api/admin/comp' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const accountId = body.accountId;
    const comped = body.comped === true;
    if (!accountId) return json({ error: 'accountId required' }, 400);

    const acct = await db.prepare('SELECT is_comped FROM accounts WHERE id = ?').bind(accountId).first();
    if (!acct) return json({ error: 'Account not found' }, 404);

    const source = comped ? (typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'admin') : null;
    await db.batch([
      db.prepare('UPDATE accounts SET is_comped = ?, comp_source = ? WHERE id = ?')
        .bind(comped ? 1 : 0, source, accountId),
      auditStmt(db, admin.userId, comped ? 'comp' : 'uncomp', accountId, {
        was: !!acct.is_comped, now: comped, source,
      }),
    ]);
    return json({ ok: true, accountId, comped });
  }

  // ── GET /api/admin/remove-pupil-impact — preview ──
  // Shows exactly what removing this pupil↔tutor link will delete, so the
  // destructive action is never blind. Counts the cascade plus the one table
  // that does NOT cascade (class_enrolments).
  if (path === '/api/admin/remove-pupil-impact' && request.method === 'GET') {
    const url = new URL(request.url);
    const tutorId = url.searchParams.get('tutorId');
    const childId = url.searchParams.get('childId');
    if (!tutorId || !childId) return json({ error: 'tutorId and childId required' }, 400);

    const link = await db.prepare('SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?')
      .bind(childId, tutorId).first();
    if (!link) return json({ error: 'No such pupil on this tutor' }, 404);

    const count = async (sql, ...binds) => {
      const r = await db.prepare(sql).bind(...binds).first();
      return r ? r.n : 0;
    };
    const [notes, assignments, recipients, conversations, enrolments] = await Promise.all([
      count('SELECT COUNT(*) AS n FROM tutor_notes WHERE child_id = ? AND tutor_id = ?', childId, tutorId),
      count('SELECT COUNT(*) AS n FROM assignments WHERE target_child_id = ? AND tutor_id = ?', childId, tutorId),
      count('SELECT COUNT(*) AS n FROM assignment_recipients WHERE child_id = ? AND tutor_id = ?', childId, tutorId),
      count('SELECT COUNT(*) AS n FROM conversations WHERE child_id = ? AND tutor_id = ?', childId, tutorId),
      count('SELECT COUNT(*) AS n FROM class_enrolments WHERE child_id = ? AND class_id IN (SELECT id FROM classes WHERE tutor_id = ?)', childId, tutorId),
    ]);
    return json({
      tutorId, childId,
      impact: { tutor_notes: notes, individual_assignments: assignments, assignment_recipients: recipients, conversations, class_enrolments: enrolments },
    });
  }

  // ── POST /api/admin/remove-pupil — scoped purge ──
  // Deletes ONLY the pupil_tutors row (which cascades to that pairing's notes,
  // individual assignments, recipients, conversations + messages) PLUS the
  // class_enrolments that do not cascade. Never touches the child or the account.
  if (path === '/api/admin/remove-pupil' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { tutorId, childId } = body;
    if (!tutorId || !childId) return json({ error: 'tutorId and childId required' }, 400);

    const link = await db.prepare('SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?')
      .bind(childId, tutorId).first();
    if (!link) return json({ error: 'No such pupil on this tutor' }, 404);

    const results = await db.batch([
      db.prepare('DELETE FROM class_enrolments WHERE child_id = ? AND class_id IN (SELECT id FROM classes WHERE tutor_id = ?)')
        .bind(childId, tutorId),
      db.prepare('DELETE FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?')
        .bind(childId, tutorId),
      auditStmt(db, admin.userId, 'remove_pupil', `${childId}:${tutorId}`, null),
    ]);
    const enrolmentsRemoved = results[0]?.meta?.changes ?? null;
    const linkRemoved = results[1]?.meta?.changes ?? null;
    return json({ ok: true, tutorId, childId, enrolments_removed: enrolmentsRemoved, link_removed: linkRemoved });
  }

  return null; // not an admin route this handler knows
}

// ── Class Management Routes ──
// POST   /api/tutor/classes             — Create a class
// GET    /api/tutor/classes             — List tutor's classes with pupil counts
// PATCH  /api/tutor/classes/:id         — Rename / update class
// DELETE /api/tutor/classes/:id         — Delete class (cascades enrolments)
// GET    /api/tutor/classes/:id/pupils  — List pupils in a class
// POST   /api/tutor/classes/:id/pupils  — Add pupil(s) to class (from roster)
// DELETE /api/tutor/classes/:id/pupils/:childId — Remove pupil from class

import { json } from '../helpers.js';

async function requireTutor(db, userId) {
  const tutor = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
  return tutor ? tutor.id : null;
}

async function ownClass(db, classId, tutorId) {
  return db.prepare('SELECT id FROM classes WHERE id = ? AND tutor_id = ?').bind(classId, tutorId).first();
}

export async function handleClassRoutes(request, env, userId, path) {
  // Only handle class routes — fall through silently for everything else
  // so non-tutor users hitting /api/data/* etc. aren't rejected here.
  if (!path.startsWith('/api/tutor/classes')) return null;

  const db = env.DB;
  const tutorId = await requireTutor(db, userId);
  if (!tutorId) return json({ error: 'No tutor profile found' }, 403);

  // POST /api/tutor/classes — create class
  if (path === '/api/tutor/classes' && request.method === 'POST') {
    const { name, scheduleNote } = await request.json();
    if (!name?.trim()) return json({ error: 'Missing name' }, 400);

    const id = crypto.randomUUID();
    await db.prepare(
      'INSERT INTO classes (id, tutor_id, name, schedule_note) VALUES (?, ?, ?, ?)'
    ).bind(id, tutorId, name.trim(), scheduleNote?.trim() || null).run();

    const cls = await db.prepare('SELECT * FROM classes WHERE id = ?').bind(id).first();
    return json({ ok: true, class: cls }, 201);
  }

  // GET /api/tutor/classes — list with pupil counts
  if (path === '/api/tutor/classes' && request.method === 'GET') {
    const { results: classes } = await db.prepare(`
      SELECT c.*, COUNT(e.child_id) AS pupil_count
      FROM classes c
      LEFT JOIN class_enrolments e ON e.class_id = c.id
      WHERE c.tutor_id = ?
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `).bind(tutorId).all();

    return json({ classes });
  }

  // Routes with :id
  const classMatch = path.match(/^\/api\/tutor\/classes\/([^/]+)$/);
  const classEnrolMatch = path.match(/^\/api\/tutor\/classes\/([^/]+)\/pupils(?:\/([^/]+))?$/);

  if (classMatch) {
    const classId = classMatch[1];
    const cls = await ownClass(db, classId, tutorId);
    if (!cls) return json({ error: 'Class not found' }, 404);

    // PATCH — rename/update
    if (request.method === 'PATCH') {
      const { name, scheduleNote } = await request.json();
      const updates = [];
      const binds = [];
      if (name !== undefined)         { updates.push('name = ?');          binds.push(name.trim()); }
      if (scheduleNote !== undefined) { updates.push('schedule_note = ?'); binds.push(scheduleNote?.trim() || null); }
      if (updates.length === 0) return json({ error: 'No fields to update' }, 400);
      binds.push(classId);
      await db.prepare(`UPDATE classes SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run();
      const updated = await db.prepare('SELECT * FROM classes WHERE id = ?').bind(classId).first();
      return json({ ok: true, class: updated });
    }

    // DELETE
    if (request.method === 'DELETE') {
      await db.prepare('DELETE FROM classes WHERE id = ?').bind(classId).run();
      return json({ ok: true });
    }
  }

  if (classEnrolMatch) {
    const classId = classEnrolMatch[1];
    const childIdParam = classEnrolMatch[2] || null;
    const cls = await ownClass(db, classId, tutorId);
    if (!cls) return json({ error: 'Class not found' }, 404);

    // GET /api/tutor/classes/:id/pupils
    if (request.method === 'GET' && !childIdParam) {
      const { results: pupils } = await db.prepare(`
        SELECT c.id, c.display_name, c.year_group, c.target_school, e.enrolled_at
        FROM class_enrolments e
        JOIN children c ON c.id = e.child_id
        WHERE e.class_id = ?
        ORDER BY c.display_name ASC
      `).bind(classId).all();
      return json({ pupils });
    }

    // POST /api/tutor/classes/:id/pupils — add one or more pupils
    if (request.method === 'POST' && !childIdParam) {
      const { childIds } = await request.json();
      if (!Array.isArray(childIds) || childIds.length === 0) return json({ error: 'childIds must be a non-empty array' }, 400);

      // Verify each child is on this tutor's roster — silently drop any that are not.
      // This prevents a tutor from enroling children who have removed them (or were
      // never linked). Consistent with INSERT OR IGNORE semantics elsewhere.
      const { results: rosterRows } = await db.prepare(
        `SELECT child_id FROM pupil_tutors WHERE tutor_id = ? AND child_id IN (${childIds.map(() => '?').join(',')})`
      ).bind(tutorId, ...childIds).all();
      const onRoster = new Set(rosterRows.map(r => r.child_id));
      const eligible = childIds.filter(cid => onRoster.has(cid));

      if (eligible.length > 0) {
        const stmts = eligible.map(cid =>
          db.prepare('INSERT OR IGNORE INTO class_enrolments (class_id, child_id) VALUES (?, ?)')
            .bind(classId, cid)
        );
        await db.batch(stmts);
      }
      return json({ ok: true, added: eligible.length });
    }

    // DELETE /api/tutor/classes/:id/pupils/:childId
    if (request.method === 'DELETE' && childIdParam) {
      await db.prepare('DELETE FROM class_enrolments WHERE class_id = ? AND child_id = ?')
        .bind(classId, childIdParam).run();
      return json({ ok: true });
    }
  }

  return null;
}

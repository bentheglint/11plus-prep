// ── Relationship Management ──
//
// Parent relationship management:
// GET    /api/parent/tutors?child_id=   — List tutors linked to a child
// DELETE /api/parent/tutors/:tutorId?child_id= — Parent removes tutor link
//
// Bulk invite routes are now in routes/invites.js (D1-backed).

import { json } from '../helpers.js';

export async function handleRelationshipRoutes(request, env, userId, path) {
  const db = env.DB;

  // ── Parent: list linked tutors ──────────────────────────────────────────

  if (path === '/api/parent/tutors' && request.method === 'GET') {
    const url = new URL(request.url);
    const childId = url.searchParams.get('child_id');
    if (!childId) return json({ error: 'Missing child_id' }, 400);

    const child = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(childId, userId).first();
    if (!child) return json({ error: 'Child not found' }, 404);

    const { results: tutors } = await db.prepare(`
      SELECT t.id, t.display_name, t.photo_url, t.bio, t.tutor_code,
             pt.joined_at
      FROM pupil_tutors pt
      JOIN tutors t ON t.id = pt.tutor_id
      WHERE pt.child_id = ?
      ORDER BY pt.joined_at ASC
    `).bind(childId).all();

    return json({ tutors });
  }

  // ── Parent: remove tutor link ───────────────────────────────────────────

  const removeTutorMatch = path.match(/^\/api\/parent\/tutors\/([^/]+)$/);
  if (removeTutorMatch && request.method === 'DELETE') {
    const tutorId = removeTutorMatch[1];
    const url = new URL(request.url);
    const childId = url.searchParams.get('child_id');
    if (!childId) return json({ error: 'Missing child_id' }, 400);

    // Verify child belongs to this parent
    const child = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(childId, userId).first();
    if (!child) return json({ error: 'Child not found' }, 404);

    // Delete relationship — cascades to notes, conversations, assignment_recipients
    const result = await db.prepare(
      'DELETE FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?'
    ).bind(childId, tutorId).run();

    if (result.meta.changes === 0) return json({ error: 'Tutor link not found' }, 404);

    return json({ ok: true });
  }

  return null;
}

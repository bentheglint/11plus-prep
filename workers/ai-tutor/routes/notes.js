// ── Tutor Private Notes Routes ──
// Notes are per (tutor × child), scoped by composite FK in schema.
// Deleted automatically when pupil_tutors row is removed (ON DELETE CASCADE).
//
// POST   /api/tutor/notes/:childId      — Create note
// GET    /api/tutor/notes/:childId      — List notes for this child
// PATCH  /api/tutor/notes/:noteId       — Update note body
// DELETE /api/tutor/notes/:noteId       — Delete note

import { json } from '../helpers.js';

async function requireTutorOnRoster(db, tutorId, childId) {
  return db.prepare(
    'SELECT 1 FROM pupil_tutors WHERE tutor_id = ? AND child_id = ?'
  ).bind(tutorId, childId).first();
}

async function requireNoteOwner(db, tutorId, noteId) {
  return db.prepare(
    'SELECT * FROM tutor_notes WHERE id = ? AND tutor_id = ?'
  ).bind(noteId, tutorId).first();
}

export async function handleNotesRoutes(request, env, userId, path) {
  const db = env.DB;

  const tutor = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
  if (!tutor) return null; // Silently skip — not a tutor, let other routes handle

  const tutorId = tutor.id;

  // Routes by child: /api/tutor/notes/:childId
  const childMatch = path.match(/^\/api\/tutor\/notes\/([^/]+)$/);
  // Routes by note: /api/tutor/notes\/note\/([^/]+)
  const noteMatch = path.match(/^\/api\/tutor\/notes\/note\/([^/]+)$/);

  if (childMatch) {
    const childId = childMatch[1];

    // Verify relationship exists before any operation
    const link = await requireTutorOnRoster(db, tutorId, childId);
    if (!link) return json({ error: 'Child not on roster' }, 404);

    // POST — create note
    if (request.method === 'POST') {
      const { note } = await request.json();
      if (!note?.trim()) return json({ error: 'Missing note body' }, 400);

      const id = crypto.randomUUID();
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      await db.prepare(
        `INSERT INTO tutor_notes (id, tutor_id, child_id, note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(id, tutorId, childId, note.trim(), now, now).run();

      const row = await db.prepare('SELECT * FROM tutor_notes WHERE id = ?').bind(id).first();
      return json({ ok: true, note: row }, 201);
    }

    // GET — list notes for this child, newest first
    if (request.method === 'GET') {
      const { results: notes } = await db.prepare(
        'SELECT * FROM tutor_notes WHERE tutor_id = ? AND child_id = ? ORDER BY updated_at DESC'
      ).bind(tutorId, childId).all();
      return json({ notes });
    }
  }

  if (noteMatch) {
    const noteId = noteMatch[1];
    const existing = await requireNoteOwner(db, tutorId, noteId);
    if (!existing) return json({ error: 'Note not found' }, 404);

    // PATCH — update note body
    if (request.method === 'PATCH') {
      const { note } = await request.json();
      if (!note?.trim()) return json({ error: 'Missing note body' }, 400);
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      await db.prepare(
        'UPDATE tutor_notes SET note = ?, updated_at = ? WHERE id = ?'
      ).bind(note.trim(), now, noteId).run();
      const updated = await db.prepare('SELECT * FROM tutor_notes WHERE id = ?').bind(noteId).first();
      return json({ ok: true, note: updated });
    }

    // DELETE
    if (request.method === 'DELETE') {
      await db.prepare('DELETE FROM tutor_notes WHERE id = ?').bind(noteId).run();
      return json({ ok: true });
    }
  }

  return null;
}

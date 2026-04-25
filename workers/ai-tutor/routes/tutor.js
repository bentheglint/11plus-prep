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

  return null;
}

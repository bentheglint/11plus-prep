// ── Relationship Management + Bulk Invite (Phase 6) ──
//
// Parent relationship management:
// GET    /api/parent/tutors?child_id=   — List tutors linked to a child
// DELETE /api/parent/tutors/:tutorId?child_id= — Parent removes tutor link
//
// Bulk invite:
// POST   /api/tutor/bulk-invite         — Submit bulk invite list
//   Body: { pupils: [{email, childName, yearGroup}], description?, website? }
//   ≤20 pupils → returns invite links immediately
//   >20 pupils → queued for review (sets review_pending flag)
// GET    /api/tutor/bulk-invite/status  — Check review status

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

  // ── Tutor: bulk invite ──────────────────────────────────────────────────

  if (path === '/api/tutor/bulk-invite' && request.method === 'POST') {
    const tutor = await db.prepare(
      'SELECT id, display_name, tutor_code, bulk_invite_approved FROM tutors WHERE id = ?'
    ).bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 403);

    const { pupils, description, website } = await request.json();
    if (!Array.isArray(pupils) || pupils.length === 0) {
      return json({ error: 'pupils must be a non-empty array' }, 400);
    }

    const REVIEW_THRESHOLD = 20;
    const needsReview = pupils.length > REVIEW_THRESHOLD && !tutor.bulk_invite_approved;

    if (needsReview) {
      // Store the pending bulk invite for admin review
      // Using the existing TESTING_FLAGS KV as a simple queue for now
      // In production this would write to a dedicated admin queue table
      const queueKey = `bulk-invite-queue:${userId}`;
      const pending = {
        tutorId: userId,
        tutorName: tutor.display_name,
        tutorCode: tutor.tutor_code,
        pupilCount: pupils.length,
        description: description?.trim() || null,
        website: website?.trim() || null,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      await env.TESTING_FLAGS.put(queueKey, JSON.stringify(pending));

      return json({
        ok: true,
        status: 'review_required',
        message: `Your list of ${pupils.length} pupils has been submitted for review. We aim to approve within 24 hours.`,
        pupilCount: pupils.length,
      });
    }

    // Small batch or pre-approved — return invite links
    const baseUrl = env.APP_BASE_URL || 'https://prepstep.co.uk';
    const inviteLink = `${baseUrl}/join/${tutor.tutor_code}`;

    // In v1.5 we'll send actual emails via Resend; for now return links for manual dispatch
    const links = pupils.map(p => ({
      email: p.email,
      childName: p.childName,
      yearGroup: p.yearGroup || null,
      inviteLink,
    }));

    return json({
      ok: true,
      status: 'ready',
      inviteLink,
      pupils: links,
      message: `${pupils.length} invite links generated. Share your invite link with each parent.`,
    });
  }

  // GET /api/tutor/bulk-invite/status — check review status
  if (path === '/api/tutor/bulk-invite/status' && request.method === 'GET') {
    const tutor = await db.prepare(
      'SELECT bulk_invite_approved FROM tutors WHERE id = ?'
    ).bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 403);

    if (tutor.bulk_invite_approved) {
      return json({ status: 'approved', message: 'Bulk invites approved — no review required.' });
    }

    const queueKey = `bulk-invite-queue:${userId}`;
    const raw = await env.TESTING_FLAGS.get(queueKey);
    const pending = raw ? JSON.parse(raw) : null;

    return json({
      status: pending ? pending.status : 'not_submitted',
      pending,
    });
  }

  return null;
}

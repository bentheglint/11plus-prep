// ── Messaging Routes (Phase 6) ──
// Conversations are keyed on (tutor_id × child_id).
// Composite FK in schema guarantees no conversation outside a valid relationship.
//
// Tutor-facing:
// POST /api/tutor/conversations/:childId         — Open/get conversation
// GET  /api/tutor/conversations                  — List all conversations (inbox)
// GET  /api/tutor/conversations/:id/messages     — Get thread + mark tutor-side read
// POST /api/tutor/conversations/:id/messages     — Send message as tutor
//
// Parent-facing:
// GET  /api/parent/conversations?child_id=       — List conversations for a child
// GET  /api/parent/conversations/:id/messages    — Get thread + mark parent-side read
// POST /api/parent/conversations/:id/messages    — Send message as parent

import { json } from '../helpers.js';

function nowStr() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

// ── Verify conversation access ──────────────────────────────────────────────

async function getTutorConversation(db, convId, tutorId) {
  return db.prepare('SELECT * FROM conversations WHERE id = ? AND tutor_id = ?').bind(convId, tutorId).first();
}

async function getParentConversation(db, convId, parentId) {
  // Parent accesses a conversation via their child
  return db.prepare(`
    SELECT conv.* FROM conversations conv
    JOIN children c ON c.id = conv.child_id
    WHERE conv.id = ? AND c.account_id = ?
  `).bind(convId, parentId).first();
}

export async function handleMessagingRoutes(request, env, userId, path) {
  const db = env.DB;

  // ── Tutor routes ─────────────────────────────────────────────────────────

  if (path.startsWith('/api/tutor/conversations')) {
    const tutor = await db.prepare('SELECT id FROM tutors WHERE id = ?').bind(userId).first();
    if (!tutor) return null; // Not a tutor — skip

    const tutorId = tutor.id;

    // POST /api/tutor/conversations/:childId — open or get conversation
    const openMatch = path.match(/^\/api\/tutor\/conversations\/([^/]+)$/);
    if (openMatch && request.method === 'POST') {
      const childId = openMatch[1];

      // Verify child on roster
      const link = await db.prepare(
        'SELECT 1 FROM pupil_tutors WHERE tutor_id = ? AND child_id = ?'
      ).bind(tutorId, childId).first();
      if (!link) return json({ error: 'Child not on roster' }, 404);

      // Upsert conversation
      let conv = await db.prepare(
        'SELECT * FROM conversations WHERE tutor_id = ? AND child_id = ?'
      ).bind(tutorId, childId).first();

      if (!conv) {
        const id = crypto.randomUUID();
        await db.prepare(
          'INSERT INTO conversations (id, tutor_id, child_id) VALUES (?, ?, ?)'
        ).bind(id, tutorId, childId).run();
        conv = await db.prepare('SELECT * FROM conversations WHERE id = ?').bind(id).first();
      }

      return json({ conversation: conv }, conv ? 200 : 201);
    }

    // GET /api/tutor/conversations — inbox
    if (path === '/api/tutor/conversations' && request.method === 'GET') {
      const { results } = await db.prepare(`
        SELECT conv.id, conv.child_id, conv.created_at,
               c.display_name AS child_name,
               a.name AS parent_name,
               m.body AS last_message,
               m.sender_type AS last_sender,
               m.created_at AS last_message_at,
               SUM(CASE WHEN m2.sender_type = 'parent' AND m2.read_at IS NULL THEN 1 ELSE 0 END) AS unread_count
        FROM conversations conv
        JOIN children c ON c.id = conv.child_id
        JOIN accounts a ON a.id = c.account_id
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1
        )
        LEFT JOIN messages m2 ON m2.conversation_id = conv.id
        WHERE conv.tutor_id = ?
        GROUP BY conv.id
        ORDER BY COALESCE(m.created_at, conv.created_at) DESC
      `).bind(tutorId).all();

      return json({ conversations: results });
    }

    // Thread routes: GET/POST /api/tutor/conversations/:id/messages
    const threadMatch = path.match(/^\/api\/tutor\/conversations\/([^/]+)\/messages$/);
    if (threadMatch) {
      const convId = threadMatch[1];
      const conv = await getTutorConversation(db, convId, tutorId);
      if (!conv) return json({ error: 'Conversation not found' }, 404);

      if (request.method === 'GET') {
        const { results: messages } = await db.prepare(
          'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
        ).bind(convId).all();

        // Mark parent messages as read
        await db.prepare(
          `UPDATE messages SET read_at = ? WHERE conversation_id = ? AND sender_type = 'parent' AND read_at IS NULL`
        ).bind(nowStr(), convId).run();

        return json({ messages });
      }

      if (request.method === 'POST') {
        const { body } = await request.json();
        if (!body?.trim()) return json({ error: 'Missing message body' }, 400);

        const id = crypto.randomUUID();
        await db.prepare(
          `INSERT INTO messages (id, conversation_id, sender_type, sender_id, body, created_at)
           VALUES (?, ?, 'tutor', ?, ?, ?)`
        ).bind(id, convId, tutorId, body.trim(), nowStr()).run();

        const msg = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
        return json({ ok: true, message: msg }, 201);
      }
    }
  }

  // ── Parent routes ─────────────────────────────────────────────────────────

  if (path.startsWith('/api/parent/conversations')) {
    // GET /api/parent/conversations?child_id= — list for a child
    if (path === '/api/parent/conversations' && request.method === 'GET') {
      const url = new URL(request.url);
      const childId = url.searchParams.get('child_id');
      if (!childId) return json({ error: 'Missing child_id' }, 400);

      // Verify child belongs to this parent
      const child = await db.prepare(
        'SELECT id FROM children WHERE id = ? AND account_id = ?'
      ).bind(childId, userId).first();
      if (!child) return json({ error: 'Child not found' }, 404);

      const { results } = await db.prepare(`
        SELECT conv.id, conv.tutor_id, conv.created_at,
               t.display_name AS tutor_name,
               m.body AS last_message,
               m.sender_type AS last_sender,
               m.created_at AS last_message_at,
               SUM(CASE WHEN m2.sender_type = 'tutor' AND m2.read_at IS NULL THEN 1 ELSE 0 END) AS unread_count
        FROM conversations conv
        JOIN tutors t ON t.id = conv.tutor_id
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages WHERE conversation_id = conv.id ORDER BY created_at DESC LIMIT 1
        )
        LEFT JOIN messages m2 ON m2.conversation_id = conv.id
        WHERE conv.child_id = ?
        GROUP BY conv.id
        ORDER BY COALESCE(m.created_at, conv.created_at) DESC
      `).bind(childId).all();

      return json({ conversations: results });
    }

    // Thread routes
    const parentThreadMatch = path.match(/^\/api\/parent\/conversations\/([^/]+)\/messages$/);
    if (parentThreadMatch) {
      const convId = parentThreadMatch[1];
      const conv = await getParentConversation(db, convId, userId);
      if (!conv) return json({ error: 'Conversation not found' }, 404);

      if (request.method === 'GET') {
        const { results: messages } = await db.prepare(
          'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
        ).bind(convId).all();

        // Mark tutor messages as read
        await db.prepare(
          `UPDATE messages SET read_at = ? WHERE conversation_id = ? AND sender_type = 'tutor' AND read_at IS NULL`
        ).bind(nowStr(), convId).run();

        return json({ messages });
      }

      if (request.method === 'POST') {
        const { body } = await request.json();
        if (!body?.trim()) return json({ error: 'Missing message body' }, 400);

        const id = crypto.randomUUID();
        await db.prepare(
          `INSERT INTO messages (id, conversation_id, sender_type, sender_id, body, created_at)
           VALUES (?, ?, 'parent', ?, ?, ?)`
        ).bind(id, convId, userId, body.trim(), nowStr()).run();

        const msg = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
        return json({ ok: true, message: msg }, 201);
      }
    }
  }

  return null;
}

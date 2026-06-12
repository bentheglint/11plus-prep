// ── Bulk Pupil Onboarding — Invite Routes ──
//
// POST   /api/tutor/bulk-invite                — Submit bulk invite list
// GET    /api/tutor/invites                    — List own invites
// POST   /api/tutor/invites/:id/resend         — Resend / rotate token
// POST   /api/tutor/invites/:id/link           — Get manual-share link (once)
// DELETE /api/tutor/invites/:id                — Revoke invite
// GET    /api/tutor/public/invite/:token       — Validate token (no auth)
// POST   /api/tutor/claim-invite               — Parent claims invite (auth only)
// GET    /api/admin/bulk-invite-reviews        — Admin: list needs_review batches
// POST   /api/admin/bulk-invite-reviews        — Admin: approve / reject a batch
// Cron:  sweepInvites(env)                     — Expire, purge, retry

import { json, canonicalEmail } from '../helpers.js';

const APP_BASE_URL = 'https://prepstep.co.uk';

// ── Security helpers ──────────────────────────────────────────────────────────

async function hashToken(raw) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(raw)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Returns normalised email or null if invalid.
function validateEmail(raw) {
  if (typeof raw !== 'string') return null;
  const e = raw.trim().toLowerCase();
  if (e.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  return e;
}

// Strip control chars (incl CR/LF), trim, enforce max length. Returns null if
// empty after sanitisation.
function sanitiseName(raw, maxLen) {
  if (typeof raw !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const s = raw.replace(/[\x00-\x1F\x7F]/g, '').trim();
  if (s.length === 0) return null;
  return s.slice(0, maxLen);
}

function validateYearGroup(raw) {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 3 || n > 8) return null;
  return n;
}

// ── Admin audit helper ────────────────────────────────────────────────────────

function auditStmt(db, adminId, action, target, detail) {
  return db.prepare(
    'INSERT INTO admin_audit (admin_id, action, target, detail) VALUES (?, ?, ?, ?)'
  ).bind(adminId, action, target, detail == null ? null : JSON.stringify(detail));
}

// ── Send helper ───────────────────────────────────────────────────────────────

// Send pending invites. Filters: batchId, tutorId, ids, minAgeMinutes.
// Safe to call with no EMAIL_API_KEY — leaves rows pending.
export async function sendPendingInvites(env, { batchId, tutorId, ids, limit = 200, minAgeMinutes } = {}) {
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) return;

  const db = env.DB;

  let sql = `
    SELECT ti.id, ti.parent_email, ti.child_name, ti.token_plain,
           t.display_name AS tutor_name
    FROM tutor_invites ti
    JOIN tutors t ON t.id = ti.tutor_id
    WHERE ti.status = 'pending'
      AND ti.token_plain IS NOT NULL
  `;
  const binds = [];

  if (batchId) { sql += ' AND ti.batch_id = ?'; binds.push(batchId); }
  if (tutorId) { sql += ' AND ti.tutor_id = ?'; binds.push(tutorId); }
  if (ids && ids.length > 0) {
    sql += ` AND ti.id IN (${ids.map(() => '?').join(',')})`;
    binds.push(...ids);
  }
  if (minAgeMinutes != null) {
    sql += ` AND ti.created_at <= datetime('now', ? )`;
    binds.push(`-${minAgeMinutes} minutes`);
  }

  sql += ' ORDER BY ti.created_at ASC LIMIT ?';
  binds.push(limit);

  const { results: rows } = await db.prepare(sql).bind(...binds).all();

  for (const row of rows) {
    const link = `${APP_BASE_URL}/invite/${row.token_plain}`;
    const { subject, html } = buildInviteEmail({
      tutorName: row.tutor_name,
      childName: row.child_name,
      link,
    });

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: row.parent_email,
          subject,
          html,
          headers: {
            'List-Unsubscribe': '<mailto:hello@prepstep.co.uk?subject=unsubscribe>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });

      if (res.ok) {
        await db.prepare(
          `UPDATE tutor_invites
           SET status='sent', sent_at=datetime('now'), token_plain=NULL
           WHERE id=? AND status='pending'`
        ).bind(row.id).run();
      } else {
        await db.prepare(
          `UPDATE tutor_invites
           SET status='send_failed'
           WHERE id=? AND status='pending'`
        ).bind(row.id).run();
      }
    } catch {
      await db.prepare(
        `UPDATE tutor_invites
         SET status='send_failed'
         WHERE id=? AND status='pending'`
      ).bind(row.id).run();
    }
  }
}

// ── Cron sweeper ──────────────────────────────────────────────────────────────

export async function sweepInvites(env) {
  const db = env.DB;

  // 1. Expire overdue rows
  await db.prepare(`
    UPDATE tutor_invites
    SET status='expired', token_plain=NULL
    WHERE status IN ('needs_review','pending','sent','send_failed')
      AND expires_at <= datetime('now')
  `).run();

  // 2. GDPR purge: revoked/expired rows older than 90 days
  await db.prepare(`
    DELETE FROM tutor_invites
    WHERE status IN ('expired','revoked')
      AND created_at < datetime('now','-90 days')
  `).run();

  // 3. Retry pending rows stuck for > 15 minutes (send job may have crashed)
  await sendPendingInvites(env, { limit: 200, minAgeMinutes: 15 });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function handleInviteRoutes(request, env, userId, path, ctx) {
  const db = env.DB;

  // ── POST /api/tutor/bulk-invite ───────────────────────────────────────────
  if (path === '/api/tutor/bulk-invite' && request.method === 'POST') {
    const tutor = await db.prepare(
      'SELECT id, display_name, bulk_invite_approved FROM tutors WHERE id = ?'
    ).bind(userId).first();
    if (!tutor) return json({ error: 'No tutor profile found' }, 403);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

    const { pupils } = body;
    if (!Array.isArray(pupils) || pupils.length === 0) {
      return json({ error: 'pupils must be a non-empty array' }, 400);
    }
    if (pupils.length > 100) {
      return json({ error: 'Maximum 100 pupils per request' }, 400);
    }

    // Validate every row first — all-or-nothing
    const rowErrors = [];
    const validated = [];
    for (let i = 0; i < pupils.length; i++) {
      const p = pupils[i];
      const email = validateEmail(p.email);
      if (!email) { rowErrors.push({ index: i, error: 'Invalid email' }); continue; }

      const childName = sanitiseName(p.childName, 30);
      if (!childName) { rowErrors.push({ index: i, error: 'childName is required (max 30 chars)' }); continue; }

      const yearGroup = p.yearGroup !== undefined ? validateYearGroup(p.yearGroup) : null;
      if (p.yearGroup !== undefined && p.yearGroup !== null && p.yearGroup !== '' && yearGroup === null) {
        rowErrors.push({ index: i, error: 'yearGroup must be an integer 3–8 or omitted' }); continue;
      }

      validated.push({ index: i, email, childName, yearGroup });
    }

    if (rowErrors.length > 0) {
      return json({ error: 'Validation failed', rowErrors }, 400);
    }

    // In-batch dedupe on (email, childName)
    const seen = new Set();
    const deduped = [];
    for (const row of validated) {
      const key = `${row.email}::${row.childName.toLowerCase()}`;
      if (!seen.has(key)) { seen.add(key); deduped.push(row); }
    }

    // Daily cap check
    const capRow = await db.prepare(
      `SELECT COUNT(*) AS n FROM tutor_invites
       WHERE tutor_id = ? AND created_at > datetime('now','-1 day')`
    ).bind(userId).first();
    const existingToday = capRow?.n ?? 0;
    if (existingToday + deduped.length > 100) {
      return json({
        error: `Daily limit exceeded. You have ${existingToday} invites in the past 24 hours; adding ${deduped.length} would exceed 100.`,
      }, 429);
    }

    // Review gate (cumulative, not per-batch)
    const lifetimeRow = await db.prepare(
      `SELECT COUNT(*) AS n FROM tutor_invites
       WHERE tutor_id = ? AND status IN ('needs_review','pending','sent','send_failed','joined')`
    ).bind(userId).first();
    const lifetimeCount = lifetimeRow?.n ?? 0;
    const approved = !!tutor.bulk_invite_approved;
    const initialStatus = (!approved && (lifetimeCount + deduped.length) > 20)
      ? 'needs_review'
      : 'pending';

    const batchId = crypto.randomUUID();
    const alreadyInvited = [];
    let created = 0;

    // Insert in chunks of ≤50 to stay within D1 batch limits
    const CHUNK = 50;
    for (let start = 0; start < deduped.length; start += CHUNK) {
      const chunk = deduped.slice(start, start + CHUNK);
      const stmts = await Promise.all(chunk.map(async row => {
        const rawToken = crypto.randomUUID();
        const tokenHash = await hashToken(rawToken);
        return {
          row,
          rawToken,
          stmt: db.prepare(`
            INSERT OR IGNORE INTO tutor_invites
              (id, token_hash, token_plain, tutor_id, batch_id,
               parent_email, child_name, year_group, status, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now','+30 days'))
          `).bind(
            crypto.randomUUID(),
            tokenHash,
            rawToken,
            userId,
            batchId,
            row.email,
            row.childName,
            row.yearGroup,
            initialStatus
          ),
        };
      }));

      const results = await db.batch(stmts.map(s => s.stmt));
      for (let i = 0; i < results.length; i++) {
        if (results[i].meta.changes === 0) {
          alreadyInvited.push({ email: stmts[i].row.email, childName: stmts[i].row.childName });
        } else {
          created++;
        }
      }
    }

    // Fire-and-forget send for pending rows (ctx may be undefined in tests)
    if (initialStatus === 'pending' && created > 0) {
      const sendPromise = sendPendingInvites(env, { batchId });
      if (ctx?.waitUntil) ctx.waitUntil(sendPromise);
    }

    return json({ ok: true, batchId, created, alreadyInvited, status: initialStatus });
  }

  // ── GET /api/tutor/invites ────────────────────────────────────────────────
  if (path === '/api/tutor/invites' && request.method === 'GET') {
    const { results } = await db.prepare(`
      SELECT id, parent_email, child_name, year_group, status,
             created_at, sent_at, joined_at, expires_at, claimed_by_email
      FROM tutor_invites
      WHERE tutor_id = ?
      ORDER BY created_at DESC
      LIMIT 500
    `).bind(userId).all();

    return json({ invites: results });
  }

  // ── POST /api/tutor/invites/:id/resend ───────────────────────────────────
  const resendMatch = path.match(/^\/api\/tutor\/invites\/([^/]+)\/resend$/);
  if (resendMatch && request.method === 'POST') {
    const inviteId = resendMatch[1];
    const invite = await db.prepare(
      'SELECT id, status, sent_at FROM tutor_invites WHERE id = ? AND tutor_id = ?'
    ).bind(inviteId, userId).first();

    if (!invite) return json({ error: 'Invite not found' }, 404);

    if (invite.status === 'sent') {
      // Cooldown: must be ≥24h since sent_at
      if (invite.sent_at) {
        const sentMs = new Date(invite.sent_at + (invite.sent_at.includes('T') ? '' : 'Z')).getTime();
        const hoursSince = (Date.now() - sentMs) / 3600000;
        if (hoursSince < 24) {
          return json({ error: 'Must wait 24 hours before resending' }, 429);
        }
      }
    } else if (invite.status !== 'send_failed') {
      return json({ error: 'Invite cannot be resent from its current status' }, 409);
    }

    // Rotate token. The status predicate is the real gate — the pre-read
    // above only shapes error messages. Without it, a claim landing between
    // the read and this write would let us drag a joined invite back to
    // pending and re-email a family that already signed up.
    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    const rotated = await db.prepare(`
      UPDATE tutor_invites
      SET token_hash=?, token_plain=?, status='pending', sent_at=NULL
      WHERE id=? AND tutor_id=?
        AND (status='send_failed'
             OR (status='sent' AND sent_at <= datetime('now','-1 day')))
    `).bind(tokenHash, rawToken, inviteId, userId).run();

    if (rotated.meta.changes === 0) {
      return json({ error: 'Invite cannot be resent from its current status' }, 409);
    }

    // Attempt send inline
    await sendPendingInvites(env, { ids: [inviteId] });

    const updated = await db.prepare(
      'SELECT status FROM tutor_invites WHERE id = ?'
    ).bind(inviteId).first();

    return json({ ok: true, status: updated?.status ?? 'pending' });
  }

  // ── POST /api/tutor/invites/:id/link ─────────────────────────────────────
  const linkMatch = path.match(/^\/api\/tutor\/invites\/([^/]+)\/link$/);
  if (linkMatch && request.method === 'POST') {
    const inviteId = linkMatch[1];

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    const result = await db.prepare(`
      UPDATE tutor_invites
      SET token_hash=?, token_plain=NULL, status='sent', sent_at=datetime('now')
      WHERE id=? AND tutor_id=? AND status IN ('pending','sent','send_failed')
    `).bind(tokenHash, inviteId, userId).run();

    if (result.meta.changes === 0) {
      return json({ error: 'Invite not found or not in a linkable status' }, 409);
    }

    return json({ link: `${APP_BASE_URL}/invite/${rawToken}` });
  }

  // ── DELETE /api/tutor/invites/:id ────────────────────────────────────────
  const deleteMatch = path.match(/^\/api\/tutor\/invites\/([^/]+)$/);
  if (deleteMatch && request.method === 'DELETE') {
    const inviteId = deleteMatch[1];

    const result = await db.prepare(`
      UPDATE tutor_invites
      SET status='revoked', token_plain=NULL
      WHERE id=? AND tutor_id=? AND status IN ('needs_review','pending','sent','send_failed')
    `).bind(inviteId, userId).run();

    if (result.meta.changes === 0) {
      return json({ error: 'Invite not found or not revocable' }, 409);
    }

    return json({ ok: true });
  }

  return null;
}

// ── Public invite lookup (no auth) ────────────────────────────────────────────

export async function handlePublicInviteLookup(request, env, path) {
  const tokenMatch = path.match(/^\/api\/tutor\/public\/invite\/([^/]+)$/);
  if (!tokenMatch || request.method !== 'GET') return null;

  const rawToken = tokenMatch[1];
  const tokenHash = await hashToken(rawToken);

  // Validity decided entirely in SQL — expires_at is a SQLite datetime
  // string, so comparing it in JS via Date parsing is format-fragile.
  const invite = await env.DB.prepare(`
    SELECT t.display_name, t.photo_url, t.bio
    FROM tutor_invites ti
    JOIN tutors t ON t.id = ti.tutor_id
    WHERE ti.token_hash = ?
      AND ti.status IN ('sent','send_failed')
      AND ti.expires_at > datetime('now')
  `).bind(tokenHash).first();

  if (invite) {
    return json({
      valid: true,
      tutor: {
        displayName: invite.display_name,
        photoUrl: invite.photo_url,
        bio: invite.bio,
      },
    });
  }

  return json({ valid: false });
}

// ── Claim invite (auth only, no tutor gate) ───────────────────────────────────

export async function handleClaimInvite(request, env, userId) {
  if (request.method !== 'POST') return null;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { token, childId } = body;
  if (!token || !childId) return json({ error: 'Missing token or childId' }, 400);

  const db = env.DB;

  // Verify child belongs to caller
  const child = await db.prepare(
    'SELECT id FROM children WHERE id = ? AND account_id = ?'
  ).bind(childId, userId).first();
  if (!child) return json({ error: 'Child not found on this account' }, 403);

  // Get caller's email
  const account = await db.prepare('SELECT email FROM accounts WHERE id = ?').bind(userId).first();
  if (!account) return json({ error: 'Account not found' }, 404);
  const callerEmail = canonicalEmail(account.email);

  const tokenHash = await hashToken(token);

  // Atomic batch: all three statements are conditional so the whole
  // thing is a no-op if the invite is not in a claimable state.
  const results = await db.batch([
    db.prepare(`
      UPDATE tutor_invites
      SET status='joined', joined_at=datetime('now'),
          joined_child_id=?, claimed_by_email=?, token_plain=NULL
      WHERE token_hash=?
        AND status IN ('sent','send_failed')
        AND expires_at > datetime('now')
    `).bind(childId, callerEmail, tokenHash),

    db.prepare(`
      INSERT OR IGNORE INTO pupil_tutors (child_id, tutor_id)
      SELECT ?, tutor_id FROM tutor_invites
      WHERE token_hash=? AND status='joined' AND joined_child_id=?
    `).bind(childId, tokenHash, childId),

    db.prepare(`
      UPDATE children
      SET year_group = COALESCE(year_group,
        (SELECT year_group FROM tutor_invites
         WHERE token_hash=? AND joined_child_id=?))
      WHERE id=?
    `).bind(tokenHash, childId, childId),
  ]);

  if (results[0].meta.changes === 1) {
    return json({ ok: true });
  }

  // Check for idempotent re-claim
  const existing = await db.prepare(
    `SELECT status, joined_child_id FROM tutor_invites WHERE token_hash=?`
  ).bind(tokenHash).first();

  if (existing && existing.status === 'joined' && existing.joined_child_id === childId) {
    return json({ ok: true, alreadyLinked: true });
  }

  return json({ error: 'Invite not valid' }, 404);
}

// ── Admin routes ──────────────────────────────────────────────────────────────

export async function handleInviteAdminRoutes(request, env, admin, path, ctx) {
  const db = env.DB;

  // GET /api/admin/bulk-invite-reviews
  if (path === '/api/admin/bulk-invite-reviews' && request.method === 'GET') {
    const { results } = await db.prepare(`
      SELECT ti.batch_id,
             t.id AS tutor_id, t.display_name AS tutor_display_name, t.email AS tutor_email,
             COUNT(*) AS row_count,
             MIN(ti.created_at) AS earliest_created_at,
             -- rows as JSON array
             json_group_array(json_object(
               'id', ti.id,
               'parent_email', ti.parent_email,
               'child_name', ti.child_name,
               'year_group', ti.year_group
             )) AS rows_json
      FROM tutor_invites ti
      JOIN tutors t ON t.id = ti.tutor_id
      WHERE ti.status = 'needs_review'
      GROUP BY ti.batch_id
      ORDER BY earliest_created_at ASC
    `).all();

    const batches = results.map(r => ({
      batchId: r.batch_id,
      tutor: {
        id: r.tutor_id,
        displayName: r.tutor_display_name,
        email: r.tutor_email,
      },
      rowCount: r.row_count,
      createdAt: r.earliest_created_at,
      rows: typeof r.rows_json === 'string' ? JSON.parse(r.rows_json) : r.rows_json,
    }));

    return json({ batches });
  }

  // POST /api/admin/bulk-invite-reviews
  if (path === '/api/admin/bulk-invite-reviews' && request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

    const { batchId, action, approveTutor } = body;
    if (!batchId || !['approve', 'reject'].includes(action)) {
      return json({ error: 'batchId and action (approve|reject) required' }, 400);
    }

    // Look up the tutor for this batch
    const batchRow = await db.prepare(
      'SELECT tutor_id FROM tutor_invites WHERE batch_id = ? LIMIT 1'
    ).bind(batchId).first();
    if (!batchRow) return json({ error: 'Batch not found' }, 404);

    const tutorId = batchRow.tutor_id;

    if (action === 'approve') {
      const stmts = [
        db.prepare(
          `UPDATE tutor_invites SET status='pending' WHERE batch_id=? AND status='needs_review'`
        ).bind(batchId),
        auditStmt(db, admin.userId, 'approve_bulk_invites', batchId, null),
      ];
      if (approveTutor) {
        stmts.splice(1, 0,
          db.prepare(`UPDATE tutors SET bulk_invite_approved=1 WHERE id=?`).bind(tutorId)
        );
      }
      await db.batch(stmts);

      // Trigger sends
      const sendPromise = sendPendingInvites(env, { batchId });
      if (ctx?.waitUntil) ctx.waitUntil(sendPromise);
    } else {
      await db.batch([
        db.prepare(
          `UPDATE tutor_invites SET status='revoked', token_plain=NULL
           WHERE batch_id=? AND status='needs_review'`
        ).bind(batchId),
        auditStmt(db, admin.userId, 'reject_bulk_invites', batchId, null),
      ]);
    }

    return json({ ok: true });
  }

  return null;
}

// ── Email template ────────────────────────────────────────────────────────────
// Added to this file to keep invite concerns co-located; re-exported via
// email.js would require a circular dep. Consumers import directly from here.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Strip newlines and control chars from a single-line field (e.g. subject)
function singleLine(str) {
  // eslint-disable-next-line no-control-regex
  return String(str).replace(/[\r\n\x00-\x1F\x7F]/g, ' ').trim();
}

export function buildInviteEmail({ tutorName, childName, link }) {
  // Security: sanitise inputs before any interpolation
  const safeTutorName = singleLine(String(tutorName).slice(0, 50));
  const safeChildName = singleLine(String(childName).slice(0, 30));

  const subject = `${safeTutorName} has invited ${safeChildName} to PrepStep`;

  // Design tokens matching email.js
  const BODY_FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
  const HEAD_FONT = `'Fraunces', Georgia, 'Times New Roman', serif`;
  const brand = '#7C3AED';
  const bgPage = '#FAF7F2';
  const bgCard = '#FFFFFF';
  const border = '#ECE7E1';
  const textPrimary = '#1C1A1F';
  const textSecondary = '#5B5662';
  const textMuted = '#9B95A2';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:${BODY_FONT};background:${bgPage};color:${textPrimary};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bgPage};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Brand header -->
          <tr>
            <td style="padding:0 8px 24px;text-align:left;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${BODY_FONT};font-size:22px;font-weight:800;color:${textPrimary};letter-spacing:-0.5px;padding-right:8px;">PrepStep</td>
                  <td style="vertical-align:bottom;padding-bottom:5px;">
                    <span style="display:inline-block;width:5px;height:7px;background:#3B82F6;margin-right:2px;border-radius:1px;"></span><span style="display:inline-block;width:5px;height:11px;background:${brand};margin-right:2px;border-radius:1px;"></span><span style="display:inline-block;width:5px;height:15px;background:#22C55E;border-radius:1px;"></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main card -->
          <tr>
            <td style="background:${bgCard};border-radius:16px;padding:36px 32px;border:1px solid ${border};">
              <p style="margin:0 0 8px;font-family:${HEAD_FONT};font-size:24px;font-weight:600;color:${textPrimary};line-height:1.25;letter-spacing:-0.3px;">${escapeHtml(safeTutorName)} has invited ${escapeHtml(safeChildName)} to PrepStep</p>
              <p style="margin:0 0 20px;font-family:${BODY_FONT};font-size:15px;font-weight:400;color:${textSecondary};line-height:1.55;">PrepStep is an 11+ exam practice app — ${escapeHtml(safeChildName)}'s first 30 days are free, with thousands of questions, micro-lessons, and progress tracking across Maths, English, and Verbal Reasoning.</p>
              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:${brand};border-radius:10px;">
                    <a href="${escapeHtml(link)}" style="display:inline-block;padding:14px 28px;font-family:${BODY_FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">Accept the invitation →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 0;font-family:${BODY_FONT};font-size:13px;font-weight:400;color:${textMuted};line-height:1.55;">Didn't expect this email? You can safely ignore it.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 8px 0;text-align:center;color:${textMuted};font-size:11px;font-family:${BODY_FONT};line-height:1.5;">
              <p style="margin:0 0 4px;">PrepStep · Made in Bournemouth</p>
              <p style="margin:0;"><a href="mailto:hello@prepstep.co.uk?subject=unsubscribe" style="color:${textMuted};text-decoration:underline;">Unsubscribe</a> · <a href="https://prepstep.co.uk" style="color:${textMuted};text-decoration:underline;">prepstep.co.uk</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

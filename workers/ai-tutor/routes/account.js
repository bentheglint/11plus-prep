// ── Account Routes ──
// POST   /api/account        — Create account (on first Clerk login)
// GET    /api/account         — Get account details
// DELETE /api/account         — Delete account + ALL child data (GDPR)
// POST   /api/account/consent — Record consent with version
// POST   /api/account/child   — Create child profile
// GET    /api/account/child   — Get child profile
// PATCH  /api/account/child   — Update child display name

import { json } from '../helpers.js';

export async function handleAccountRoutes(request, env, userId, path) {
  const db = env.DB;

  // POST /api/account — Create account on first login
  if (path === '/api/account' && request.method === 'POST') {
    const { email, name, consentVersion } = await request.json();
    if (!email || !name || !consentVersion) {
      return json({ error: 'Missing email, name, or consentVersion' }, 400);
    }

    // Check if account already exists
    const existing = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(userId).first();
    if (existing) {
      return json({ error: 'Account already exists' }, 409);
    }

    await db.prepare(
      `INSERT INTO accounts (id, email, name, consent_given_at, consent_version, last_login_at)
       VALUES (?, ?, ?, datetime('now'), ?, datetime('now'))`
    ).bind(userId, email, name, consentVersion).run();

    return json({ ok: true, accountId: userId }, 201);
  }

  // GET /api/account — Get account details
  if (path === '/api/account' && request.method === 'GET') {
    const account = await db.prepare(
      'SELECT id, email, name, created_at, consent_given_at, consent_version, last_login_at FROM accounts WHERE id = ?'
    ).bind(userId).first();

    if (!account) {
      return json({ error: 'Account not found' }, 404);
    }

    // Also get child profile if it exists
    const child = await db.prepare(
      'SELECT id, display_name, created_at FROM children WHERE account_id = ?'
    ).bind(userId).first();

    // Update last_login_at
    await db.prepare('UPDATE accounts SET last_login_at = datetime(\'now\') WHERE id = ?').bind(userId).run();

    return json({ account, child });
  }

  // DELETE /api/account — Delete account + ALL child data (GDPR right to erasure)
  if (path === '/api/account' && request.method === 'DELETE') {
    // ON DELETE CASCADE handles all child data
    const result = await db.prepare('DELETE FROM accounts WHERE id = ?').bind(userId).run();

    if (result.meta.changes === 0) {
      return json({ error: 'Account not found' }, 404);
    }

    return json({ ok: true, message: 'Account and all associated data deleted' });
  }

  // POST /api/account/consent — Record/update consent
  if (path === '/api/account/consent' && request.method === 'POST') {
    const { consentVersion } = await request.json();
    if (!consentVersion) {
      return json({ error: 'Missing consentVersion' }, 400);
    }

    await db.prepare(
      `UPDATE accounts SET consent_given_at = datetime('now'), consent_version = ? WHERE id = ?`
    ).bind(consentVersion, userId).run();

    return json({ ok: true });
  }

  // POST /api/account/child — Create child profile
  if (path === '/api/account/child' && request.method === 'POST') {
    const { displayName } = await request.json();
    if (!displayName || displayName.trim().length === 0) {
      return json({ error: 'Missing displayName' }, 400);
    }

    // Check account exists
    const account = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(userId).first();
    if (!account) {
      return json({ error: 'Account not found. Create account first.' }, 404);
    }

    // Check if child already exists (one per account)
    const existing = await db.prepare('SELECT id FROM children WHERE account_id = ?').bind(userId).first();
    if (existing) {
      return json({ error: 'Child profile already exists for this account' }, 409);
    }

    const childId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO children (id, account_id, display_name) VALUES (?, ?, ?)`
    ).bind(childId, userId, displayName.trim()).run();

    // Also create empty rows in mutable tables so PATCH routes work immediately
    await db.batch([
      db.prepare('INSERT INTO streaks (child_id) VALUES (?)').bind(childId),
      db.prepare('INSERT INTO prep_points (child_id) VALUES (?)').bind(childId),
      db.prepare('INSERT INTO preferences (child_id) VALUES (?)').bind(childId),
    ]);

    return json({ ok: true, childId }, 201);
  }

  // GET /api/account/child — Get child profile
  if (path === '/api/account/child' && request.method === 'GET') {
    const child = await db.prepare(
      'SELECT id, display_name, created_at FROM children WHERE account_id = ?'
    ).bind(userId).first();

    if (!child) {
      return json({ error: 'No child profile found' }, 404);
    }

    return json({ child });
  }

  // PATCH /api/account/child — Update child display name
  if (path === '/api/account/child' && request.method === 'PATCH') {
    const { displayName } = await request.json();
    if (!displayName || displayName.trim().length === 0) {
      return json({ error: 'Missing displayName' }, 400);
    }

    const result = await db.prepare(
      'UPDATE children SET display_name = ? WHERE account_id = ?'
    ).bind(displayName.trim(), userId).run();

    if (result.meta.changes === 0) {
      return json({ error: 'No child profile found' }, 404);
    }

    return json({ ok: true });
  }

  return null; // Route not matched
}

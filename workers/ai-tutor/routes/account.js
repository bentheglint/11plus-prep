// ── Account Routes ──
// POST   /api/account                  — Create account (on first Clerk login)
// GET    /api/account                  — Get account details (returns children: [] array)
// DELETE /api/account                  — Delete account + ALL child data (GDPR)
// POST   /api/account/consent          — Record consent with version
// PATCH  /api/account/email-preference — Update email opt-in preference
// POST   /api/account/child            — Create first child on signup (kept for backwards compat)
// GET    /api/account/child            — Get first child profile (backwards compat)
// PATCH  /api/account/child            — Update first child display name (backwards compat)
// POST   /api/children                 — Add a child to the current account
// PATCH  /api/children/:id             — Update a child (displayName, yearGroup, targetSchool)
// DELETE /api/children/:id             — Delete a child (blocked if only one remains)

import { json, canonicalEmail } from '../helpers.js';

export async function handleAccountRoutes(request, env, userId, path) {
  const db = env.DB;

  // POST /api/account — Create account on first login
  if (path === '/api/account' && request.method === 'POST') {
    const { email, name, consentVersion, inviteCode, emailOptIn } = await request.json();
    if (!email || !name || !consentVersion) {
      return json({ error: 'Missing email, name, or consentVersion' }, 400);
    }

    // Check if account already exists
    const existing = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(userId).first();
    if (existing) {
      return json({ error: 'Account already exists' }, 409);
    }

    // Invite code validation — free-forever access without card. Case-insensitive
    // match against comma-separated allowlist in Worker secret. Unknown codes are
    // silently ignored (account created without comp); we don't advertise which
    // codes are valid so brute-force probing gains nothing.
    let isComped = 0;
    let compSource = null;
    if (inviteCode && env.INVITE_CODES) {
      const submitted = String(inviteCode).trim().toUpperCase();
      const allowed = env.INVITE_CODES.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
      if (allowed.includes(submitted)) {
        isComped = 1;
        compSource = `invite:${submitted}`;
      }
    }

    // Email opt-in defaults to true (opt-out, not opt-in). Only explicit false opts out.
    const optInValue = emailOptIn === false ? 0 : 1;
    await db.prepare(
      `INSERT INTO accounts (id, email, name, consent_given_at, consent_version, last_login_at, is_comped, comp_source, email_opt_in)
       VALUES (?, ?, ?, datetime('now'), ?, datetime('now'), ?, ?, ?)`
    ).bind(userId, email, name, consentVersion, isComped, compSource, optInValue).run();

    return json({ ok: true, accountId: userId, comped: !!isComped }, 201);
  }

  // GET /api/account — Get account details + access gate info
  if (path === '/api/account' && request.method === 'GET') {
    const account = await db.prepare(
      `SELECT id, email, name, created_at, consent_given_at, consent_version, last_login_at,
              stripe_customer_id, subscription_status, subscription_current_period_end,
              is_comped, comp_source, email_opt_in
       FROM accounts WHERE id = ?`
    ).bind(userId).first();

    if (!account) {
      return json({ error: 'Account not found' }, 404);
    }

    // Get all child profiles for this account
    const childrenResult = await db.prepare(
      'SELECT id, display_name, year_group, target_school, created_at FROM children WHERE account_id = ? ORDER BY created_at ASC'
    ).bind(userId).all();

    // Update last_login_at
    await db.prepare('UPDATE accounts SET last_login_at = datetime(\'now\') WHERE id = ?').bind(userId).run();

    // Compute access gate, in priority order:
    //   1. Comped (grandfathered or invite code) → always hasAccess, no paywall
    //   2. Active/trialing subscription → hasAccess
    //   3. past_due (grace window) → hasAccess
    //   4. Within 30-day free trial since account creation → hasAccess
    //   5. Otherwise → paywall
    const isComped = !!account.is_comped;

    const trialDays = 30;
    const createdAtMs = new Date(account.created_at + 'Z').getTime();
    const msSinceCreate = Date.now() - createdAtMs;
    const daysSinceCreate = msSinceCreate / (1000 * 60 * 60 * 24);
    const trialDaysRemaining = Math.max(0, Math.ceil(trialDays - daysSinceCreate));

    const subStatus = account.subscription_status;
    const hasPaidAccess = ['active', 'trialing'].includes(subStatus);
    // past_due: we keep access during Stripe's smart retry window. Stripe
    // will flip to 'unpaid' or 'canceled' when retries exhaust — then access
    // closes. This matches consumer expectations (card bounce ≠ instant lockout).
    const hasGraceAccess = subStatus === 'past_due';
    const inTrial = !isComped && !subStatus && trialDaysRemaining > 0;

    // Tutor signup is open — any authenticated user can create a tutor profile.
    const tutorProfileRow = await db.prepare('SELECT 1 FROM tutors WHERE id = ?')
      .bind(userId).first();

    const adminIds = (env.ADMIN_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
    const access = {
      hasAccess: isComped || hasPaidAccess || hasGraceAccess || inTrial,
      isComped,
      inTrial,
      trialDaysRemaining: inTrial ? trialDaysRemaining : 0,
      subscriptionStatus: subStatus || null,
      hasStripeCustomer: !!account.stripe_customer_id,
      tutorEligible: true,
      hasTutorProfile: !!tutorProfileRow,
      isAdmin: adminIds.length > 0 && adminIds.includes(userId),
    };

    // Don't leak internal fields — comp_source is audit-only, stripe_customer_id
    // is needed server-side for portal/subscribe routes but not client-side.
    delete account.stripe_customer_id;
    delete account.comp_source;
    delete account.is_comped;

    const children = childrenResult.results;
    // Keep legacy `child` field so existing frontend (master branch) doesn't break
    // during the transition period before tutor-mode is deployed to production.
    const child = children[0] || null;

    return json({ account, children, child, access });
  }

  // DELETE /api/account — Delete account + ALL child data (GDPR right to erasure)
  if (path === '/api/account' && request.method === 'DELETE') {
    // Fetch email before deleting so we can send a confirmation
    const acct = await db.prepare('SELECT email, name FROM accounts WHERE id = ?').bind(userId).first();

    // ON DELETE CASCADE handles all child data
    const result = await db.prepare('DELETE FROM accounts WHERE id = ?').bind(userId).run();

    if (result.meta.changes === 0) {
      return json({ error: 'Account not found' }, 404);
    }

    // Send deletion confirmation email (fire-and-forget — don't block the response)
    if (acct && env.EMAIL_API_KEY && env.EMAIL_FROM) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.EMAIL_API_KEY}` },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: acct.email,
          subject: 'Your PrepStep account has been deleted',
          html: `<p>Hi ${acct.name},</p>
<p>Your PrepStep account and all associated learning data have been permanently deleted, as you requested.</p>
<p>If you didn't request this, please contact us at <a href="mailto:hello@prepstep.co.uk">hello@prepstep.co.uk</a> immediately.</p>
<p>We're sorry to see you go. If you'd like to start again in the future, you're always welcome to create a new account.</p>
<p>— The PrepStep team</p>`,
        }),
      }).catch(() => {}); // Fire-and-forget
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

  // PATCH /api/account/email-preference — Update email opt-in
  if (path === '/api/account/email-preference' && request.method === 'PATCH') {
    const { emailOptIn } = await request.json();
    if (emailOptIn === undefined) return json({ error: 'Missing emailOptIn' }, 400);
    await db.prepare('UPDATE accounts SET email_opt_in = ? WHERE id = ?')
      .bind(emailOptIn ? 1 : 0, userId).run();
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

  // POST /api/children — Add another child to the account
  if (path === '/api/children' && request.method === 'POST') {
    const { displayName, yearGroup, targetSchool } = await request.json();
    if (!displayName || displayName.trim().length === 0) {
      return json({ error: 'Missing displayName' }, 400);
    }

    const account = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(userId).first();
    if (!account) {
      return json({ error: 'Account not found' }, 404);
    }

    const childId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO children (id, account_id, display_name, year_group, target_school) VALUES (?, ?, ?, ?, ?)`
    ).bind(childId, userId, displayName.trim(), yearGroup ?? null, targetSchool?.trim() ?? null).run();

    await db.batch([
      db.prepare('INSERT INTO streaks (child_id) VALUES (?)').bind(childId),
      db.prepare('INSERT INTO prep_points (child_id) VALUES (?)').bind(childId),
      db.prepare('INSERT INTO preferences (child_id) VALUES (?)').bind(childId),
    ]);

    const child = await db.prepare(
      'SELECT id, display_name, year_group, target_school, created_at FROM children WHERE id = ?'
    ).bind(childId).first();

    return json({ ok: true, child }, 201);
  }

  // PATCH /api/children/:id — Update a child
  if (path.startsWith('/api/children/') && request.method === 'PATCH') {
    const childId = path.slice('/api/children/'.length);
    if (!childId) return json({ error: 'Missing child id' }, 400);

    const owned = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(childId, userId).first();
    if (!owned) return json({ error: 'Child not found' }, 404);

    const { displayName, yearGroup, targetSchool } = await request.json();

    const updates = [];
    const binds = [];
    if (displayName !== undefined) { updates.push('display_name = ?'); binds.push(displayName.trim()); }
    if (yearGroup !== undefined)   { updates.push('year_group = ?');   binds.push(yearGroup ?? null); }
    if (targetSchool !== undefined){ updates.push('target_school = ?');binds.push(targetSchool?.trim() ?? null); }

    if (updates.length === 0) return json({ error: 'No fields to update' }, 400);

    binds.push(childId);
    await db.prepare(`UPDATE children SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run();

    const child = await db.prepare(
      'SELECT id, display_name, year_group, target_school, created_at FROM children WHERE id = ?'
    ).bind(childId).first();

    return json({ ok: true, child });
  }

  // DELETE /api/children/:id — Delete a child (blocked if last child on account)
  if (path.startsWith('/api/children/') && request.method === 'DELETE') {
    const childId = path.slice('/api/children/'.length);
    if (!childId) return json({ error: 'Missing child id' }, 400);

    const owned = await db.prepare(
      'SELECT id FROM children WHERE id = ? AND account_id = ?'
    ).bind(childId, userId).first();
    if (!owned) return json({ error: 'Child not found' }, 404);

    const countResult = await db.prepare(
      'SELECT COUNT(*) as n FROM children WHERE account_id = ?'
    ).bind(userId).first();
    if (countResult.n <= 1) {
      return json({ error: 'Cannot delete the only child on an account' }, 409);
    }

    // ON DELETE CASCADE handles all per-child data
    await db.prepare('DELETE FROM children WHERE id = ?').bind(childId).run();

    return json({ ok: true });
  }

  return null; // Route not matched
}

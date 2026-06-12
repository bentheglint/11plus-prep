// ── Bulk Pupil Onboarding — Invite Tests ──

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import { makeAuthToken, createSchema, cleanDb, seed, makeRequest } from './helpers.js';
import { buildInviteEmail } from '../routes/invites.js';

// ── Test helpers ──────────────────────────────────────────────────────────────

// Hash a token the same way the production code does, for test assertions.
async function hashToken(raw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const ADMIN_ID = 'admin-invites-test';
const adminEnv = () => ({ ...env, ADMIN_USER_IDS: ADMIN_ID });

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

// ── POST /api/tutor/bulk-invite ───────────────────────────────────────────────

describe('POST /api/tutor/bulk-invite', () => {
  it('≤20 invites for unapproved tutor → all rows pending', async () => {
    const tutorId = 'tutor-bulk-small';
    await seed.account(env.DB, tutorId, 'bulk-small@test.com');
    await seed.tutor(env.DB, tutorId, 'bulk-small@test.com');
    const token = await makeAuthToken({ userId: tutorId, email: 'bulk-small@test.com' });

    const pupils = Array.from({ length: 5 }, (_, i) => ({
      email: `parent${i}@example.com`,
      childName: `Child ${i}`,
    }));

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', { auth: token, body: { pupils } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
    expect(body.created).toBe(5);
    expect(body.alreadyInvited).toHaveLength(0);

    const { results } = await env.DB.prepare(
      "SELECT status FROM tutor_invites WHERE tutor_id = ?"
    ).bind(tutorId).all();
    expect(results.every(r => r.status === 'pending')).toBe(true);
  });

  it('cumulative >20 for unapproved tutor → new rows get needs_review', async () => {
    const tutorId = 'tutor-bulk-over-20';
    await seed.account(env.DB, tutorId, 'bulk-over@test.com');
    await seed.tutor(env.DB, tutorId, 'bulk-over@test.com');
    const token = await makeAuthToken({ userId: tutorId, email: 'bulk-over@test.com' });

    // First batch of 18 — all pending
    const first18 = Array.from({ length: 18 }, (_, i) => ({
      email: `first${i}@example.com`,
      childName: `Child First ${i}`,
    }));
    const r1 = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', { auth: token, body: { pupils: first18 } }),
      env
    );
    expect(r1.status).toBe(200);
    const b1 = await r1.json();
    expect(b1.status).toBe('pending');
    expect(b1.created).toBe(18);

    // Second batch of 5 — cumulative = 23 > 20 → needs_review
    const next5 = Array.from({ length: 5 }, (_, i) => ({
      email: `second${i}@example.com`,
      childName: `Child Second ${i}`,
    }));
    const r2 = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', { auth: token, body: { pupils: next5 } }),
      env
    );
    expect(r2.status).toBe(200);
    const b2 = await r2.json();
    expect(b2.status).toBe('needs_review');
    expect(b2.created).toBe(5);
  });

  it('approved tutor can submit 50 rows → all pending', async () => {
    const tutorId = 'tutor-bulk-approved';
    await seed.account(env.DB, tutorId, 'bulk-approved@test.com');
    // Seed tutor with bulk_invite_approved=1
    await env.DB.prepare(
      `INSERT INTO tutors (id, email, display_name, tutor_code, bulk_invite_approved)
       VALUES (?, ?, 'Approved Tutor', 'APPV-CODE', 1)`
    ).bind(tutorId, 'bulk-approved@test.com').run();
    const token = await makeAuthToken({ userId: tutorId, email: 'bulk-approved@test.com' });

    const pupils = Array.from({ length: 50 }, (_, i) => ({
      email: `approved${i}@example.com`,
      childName: `Child Ap ${i}`,
    }));
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', { auth: token, body: { pupils } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('pending');
    expect(body.created).toBe(50);
  });

  it('per-row validation errors → 400 with rowErrors', async () => {
    const tutorId = 'tutor-bulk-invalid';
    await seed.account(env.DB, tutorId, 'bulk-invalid@test.com');
    await seed.tutor(env.DB, tutorId, 'bulk-invalid@test.com');
    const token = await makeAuthToken({ userId: tutorId, email: 'bulk-invalid@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', {
        auth: token,
        body: {
          pupils: [
            { email: 'not-an-email', childName: 'Alice' },
            { email: 'valid@example.com', childName: '' },         // empty name
            { email: 'good@example.com', childName: 'Bob', yearGroup: 99 }, // bad year
          ],
        },
      }),
      env
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.rowErrors).toBeDefined();
    expect(body.rowErrors.length).toBeGreaterThanOrEqual(2);
  });

  it('in-batch duplicate (same email+childName) → only one row created', async () => {
    const tutorId = 'tutor-bulk-inbatch-dupe';
    await seed.account(env.DB, tutorId, 'inbatch-dupe@test.com');
    await seed.tutor(env.DB, tutorId, 'inbatch-dupe@test.com');
    const token = await makeAuthToken({ userId: tutorId, email: 'inbatch-dupe@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', {
        auth: token,
        body: {
          pupils: [
            { email: 'parent@example.com', childName: 'Alice' },
            { email: 'parent@example.com', childName: 'Alice' }, // duplicate
          ],
        },
      }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.created).toBe(1);
  });

  it('cross-batch duplicate (live invite already exists) → alreadyInvited', async () => {
    const tutorId = 'tutor-bulk-crossbatch-dupe';
    await seed.account(env.DB, tutorId, 'crossbatch@test.com');
    await seed.tutor(env.DB, tutorId, 'crossbatch@test.com');
    const token = await makeAuthToken({ userId: tutorId, email: 'crossbatch@test.com' });

    // First batch
    await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', {
        auth: token,
        body: { pupils: [{ email: 'dup@example.com', childName: 'Alice' }] },
      }),
      env
    );

    // Second batch with same row
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', {
        auth: token,
        body: { pupils: [{ email: 'dup@example.com', childName: 'Alice' }] },
      }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.created).toBe(0);
    expect(body.alreadyInvited).toHaveLength(1);
    expect(body.alreadyInvited[0].email).toBe('dup@example.com');
  });

  it('daily cap → 429 when over 100 in 24h', async () => {
    const tutorId = 'tutor-bulk-daily-cap';
    await seed.account(env.DB, tutorId, 'daily-cap@test.com');
    // Approved so we bypass the review gate
    await env.DB.prepare(
      `INSERT INTO tutors (id, email, display_name, tutor_code, bulk_invite_approved)
       VALUES (?, ?, 'Cap Tutor', 'CAPT-CODE', 1)`
    ).bind(tutorId, 'daily-cap@test.com').run();
    const token = await makeAuthToken({ userId: tutorId, email: 'daily-cap@test.com' });

    // Seed 95 existing invites in the last 24h
    const existing = Array.from({ length: 95 }, (_, i) =>
      env.DB.prepare(`
        INSERT INTO tutor_invites
          (id, token_hash, token_plain, tutor_id, batch_id, parent_email,
           child_name, status, expires_at, created_at)
        VALUES (?, ?, NULL, ?, 'old-batch', ?, ?, 'pending', datetime('now','+30 days'), datetime('now','-1 hour'))
      `).bind(`cap-inv-${i}`, `hash-cap-${i}`, tutorId, `capparent${i}@example.com`, `Child Cap ${i}`)
    );
    for (const stmt of existing) await stmt.run();

    // Try to add 10 more → 95+10=105 > 100 → 429
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', {
        auth: token,
        body: {
          pupils: Array.from({ length: 10 }, (_, i) => ({
            email: `newcap${i}@example.com`,
            childName: `New Child ${i}`,
          })),
        },
      }),
      env
    );
    expect(res.status).toBe(429);
  });

  it('requires tutor profile → 403 without one', async () => {
    const userId = 'no-tutor-bulk';
    await seed.account(env.DB, userId, 'no-tutor-bulk@test.com');
    const token = await makeAuthToken({ userId, email: 'no-tutor-bulk@test.com' });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/bulk-invite', { auth: token, body: { pupils: [] } }),
      env
    );
    expect(res.status).toBe(403);
  });
});

// ── GET /api/tutor/public/invite/:token ───────────────────────────────────────

describe('GET /api/tutor/public/invite/:token', () => {
  it("sent invite → valid:true with tutor card, NO child_name", async () => {
    const tutorId = 'tutor-pub-lookup';
    await seed.account(env.DB, tutorId, 'pub-lookup@test.com');
    await env.DB.prepare(
      `INSERT INTO tutors (id, email, display_name, photo_url, bio, tutor_code)
       VALUES (?, ?, 'Alice Tutor', 'https://photo.test/a.jpg', 'Expert tutor', 'ALCE-CODE')`
    ).bind(tutorId, 'pub-lookup@test.com').run();

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.invite(env.DB, {
      id: 'pub-inv-1',
      tokenHash,
      tokenPlain: null,
      tutorId,
      parentEmail: 'parent@example.com',
      childName: 'Secret Child',
      status: 'sent',
    });

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valid).toBe(true);
    expect(body.tutor.displayName).toBe('Alice Tutor');
    expect(body.tutor.photoUrl).toBe('https://photo.test/a.jpg');
    // Child name MUST NOT be present (privacy)
    expect(JSON.stringify(body)).not.toContain('Secret Child');
    expect(body.tutor.childName).toBeUndefined();
  });

  it('send_failed invite → valid:true (still claimable)', async () => {
    const tutorId = 'tutor-pub-sf';
    await seed.account(env.DB, tutorId, 'pub-sf@test.com');
    await seed.tutor(env.DB, tutorId, 'pub-sf@test.com');

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.invite(env.DB, {
      id: 'pub-inv-sf',
      tokenHash,
      tokenPlain: null,
      tutorId,
      parentEmail: 'parent@example.com',
      childName: 'Alice',
      status: 'send_failed',
    });

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    const body = await res.json();
    expect(body.valid).toBe(true);
  });

  it('pending invite → valid:false', async () => {
    const tutorId = 'tutor-pub-pend';
    await seed.account(env.DB, tutorId, 'pub-pend@test.com');
    await seed.tutor(env.DB, tutorId, 'pub-pend@test.com');

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.invite(env.DB, {
      id: 'pub-inv-pend',
      tokenHash,
      tokenPlain: rawToken,
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'pending',
    });

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    expect((await res.json()).valid).toBe(false);
  });

  it('revoked invite → valid:false', async () => {
    const tutorId = 'tutor-pub-rev';
    await seed.account(env.DB, tutorId, 'pub-rev@test.com');
    await seed.tutor(env.DB, tutorId, 'pub-rev@test.com');

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.invite(env.DB, {
      id: 'pub-inv-rev',
      tokenHash,
      tokenPlain: null,
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'revoked',
    });

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    expect((await res.json()).valid).toBe(false);
  });

  it('expired invite → valid:false', async () => {
    const tutorId = 'tutor-pub-exp';
    await seed.account(env.DB, tutorId, 'pub-exp@test.com');
    await seed.tutor(env.DB, tutorId, 'pub-exp@test.com');

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    // expired_at in the past
    await env.DB.prepare(`
      INSERT INTO tutor_invites
        (id, token_hash, token_plain, tutor_id, batch_id, parent_email,
         child_name, status, expires_at)
      VALUES (?, ?, NULL, ?, 'b', 'p@e.com', 'Alice', 'sent', datetime('now','-1 day'))
    `).bind('pub-inv-exp', tokenHash, tutorId).run();

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    expect((await res.json()).valid).toBe(false);
  });

  it('joined invite → valid:false', async () => {
    const tutorId = 'tutor-pub-joined';
    await seed.account(env.DB, tutorId, 'pub-joined@test.com');
    await seed.tutor(env.DB, tutorId, 'pub-joined@test.com');

    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.invite(env.DB, {
      id: 'pub-inv-joined',
      tokenHash,
      tokenPlain: null,
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'joined',
    });

    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/public/invite/${rawToken}`),
      env
    );
    expect((await res.json()).valid).toBe(false);
  });

  it('unknown token → valid:false (no error details)', async () => {
    const res = await worker.fetch(
      makeRequest('GET', '/api/tutor/public/invite/totally-garbage-token'),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valid).toBe(false);
    // No leakage of invite internals
    expect(body.status).toBeUndefined();
    expect(body.error).toBeUndefined();
  });
});

// ── POST /api/tutor/claim-invite ──────────────────────────────────────────────

describe('POST /api/tutor/claim-invite', () => {
  async function setupClaimFixture({ tokenStatus = 'sent', childYearGroup = null, inviteYearGroup = 3 } = {}) {
    const tutorId = 'tutor-claim-' + Math.random().toString(36).slice(2);
    const parentId = 'parent-claim-' + Math.random().toString(36).slice(2);
    const childId = 'child-claim-' + Math.random().toString(36).slice(2);
    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);
    const parentEmail = `claim-${Math.random().toString(36).slice(2)}@example.com`;

    await seed.account(env.DB, tutorId, `tutor-${tutorId}@test.com`);
    await seed.tutor(env.DB, tutorId, `tutor-${tutorId}@test.com`);
    await seed.account(env.DB, parentId, parentEmail);
    await env.DB.prepare(
      `INSERT INTO children (id, account_id, display_name, year_group)
       VALUES (?, ?, 'Test Child', ?)`
    ).bind(childId, parentId, childYearGroup).run();

    if (tokenStatus === 'expired') {
      await env.DB.prepare(`
        INSERT INTO tutor_invites
          (id, token_hash, token_plain, tutor_id, batch_id, parent_email,
           child_name, year_group, status, expires_at)
        VALUES (?, ?, NULL, ?, 'b', ?, 'Alice', ?, 'sent', datetime('now','-1 day'))
      `).bind('inv-' + childId, tokenHash, tutorId, parentEmail, inviteYearGroup).run();
    } else {
      await seed.invite(env.DB, {
        id: 'inv-' + childId,
        tokenHash,
        tokenPlain: null,
        tutorId,
        parentEmail,
        childName: 'Alice',
        yearGroup: inviteYearGroup,
        status: tokenStatus,
      });
    }

    const token = await makeAuthToken({ userId: parentId, email: parentEmail });
    return { tutorId, parentId, childId, rawToken, tokenHash, token, parentEmail };
  }

  it('happy path: pupil_tutors row created, status=joined, year_group filled', async () => {
    const { tutorId, childId, rawToken, token } = await setupClaimFixture({ childYearGroup: null, inviteYearGroup: 4 });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.alreadyLinked).toBeUndefined();

    // pupil_tutors row must exist
    const link = await env.DB.prepare(
      'SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?'
    ).bind(childId, tutorId).first();
    expect(link).not.toBeNull();

    // invite status should be 'joined' with joined_child_id set
    const inv = await env.DB.prepare(
      'SELECT status, joined_child_id FROM tutor_invites WHERE joined_child_id = ?'
    ).bind(childId).first();
    expect(inv.status).toBe('joined');
    expect(inv.joined_child_id).toBe(childId);

    // year_group should be filled from invite
    const child = await env.DB.prepare('SELECT year_group FROM children WHERE id = ?').bind(childId).first();
    expect(child.year_group).toBe(4);
  });

  it('existing year_group is NOT overwritten by claim', async () => {
    const { childId, rawToken, token } = await setupClaimFixture({ childYearGroup: 6, inviteYearGroup: 3 });

    await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );

    const child = await env.DB.prepare('SELECT year_group FROM children WHERE id = ?').bind(childId).first();
    expect(child.year_group).toBe(6); // unchanged
  });

  it('re-claim same child → alreadyLinked:true (idempotent)', async () => {
    const { childId, rawToken, token } = await setupClaimFixture();

    // First claim
    await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );

    // Second claim
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.alreadyLinked).toBe(true);
  });

  it("claim with someone else's child → 403", async () => {
    const { rawToken, token } = await setupClaimFixture();
    const otherChildId = 'other-child-403';

    const otherParentId = 'other-parent-403';
    await seed.account(env.DB, otherParentId, 'other-403@test.com');
    await seed.child(env.DB, otherChildId, otherParentId);

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId: otherChildId } }),
      env
    );
    expect(res.status).toBe(403);
  });

  it('claim after revoke → 404 and NO pupil_tutors row (race-safety)', async () => {
    const { tutorId, childId, rawToken, token, tokenHash } = await setupClaimFixture();

    // Revoke the invite before the parent claims
    await env.DB.prepare(
      `UPDATE tutor_invites SET status='revoked', token_plain=NULL WHERE token_hash=?`
    ).bind(tokenHash).run();

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );
    expect(res.status).toBe(404);

    // No pupil_tutors row should exist
    const link = await env.DB.prepare(
      'SELECT 1 FROM pupil_tutors WHERE child_id = ? AND tutor_id = ?'
    ).bind(childId, tutorId).first();
    expect(link).toBeNull();
  });

  it('claim after expiry → 404', async () => {
    const { childId, rawToken, token } = await setupClaimFixture({ tokenStatus: 'expired' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );
    expect(res.status).toBe(404);
  });

  it('claim of pending (never-sent) token → 404', async () => {
    const tutorId = 'tutor-claim-pending';
    const parentId = 'parent-claim-pending';
    const childId = 'child-claim-pending';
    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);

    await seed.account(env.DB, tutorId, 'ctp-tutor@test.com');
    await seed.tutor(env.DB, tutorId, 'ctp-tutor@test.com');
    await seed.account(env.DB, parentId, 'ctp-parent@test.com');
    await seed.child(env.DB, childId, parentId);

    // status = 'pending' (never sent)
    await seed.invite(env.DB, {
      id: 'inv-ctp',
      tokenHash,
      tokenPlain: rawToken,
      tutorId,
      parentEmail: 'ctp-parent@test.com',
      childName: 'Alice',
      status: 'pending',
    });

    const token = await makeAuthToken({ userId: parentId, email: 'ctp-parent@test.com' });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/claim-invite', { auth: token, body: { token: rawToken, childId } }),
      env
    );
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/tutor/invites/:id ─────────────────────────────────────────────

describe('DELETE /api/tutor/invites/:id', () => {
  async function tutorWithInvite(status) {
    const tutorId = 'tutor-del-' + Math.random().toString(36).slice(2);
    const inviteId = 'inv-del-' + Math.random().toString(36).slice(2);
    await seed.account(env.DB, tutorId, `del-${tutorId}@test.com`);
    await seed.tutor(env.DB, tutorId, `del-${tutorId}@test.com`);
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: `hash-del-${inviteId}`,
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status,
    });
    const token = await makeAuthToken({ userId: tutorId, email: `del-${tutorId}@test.com` });
    return { tutorId, inviteId, token };
  }

  it('pending → revoked', async () => {
    const { inviteId, token } = await tutorWithInvite('pending');
    const res = await worker.fetch(
      makeRequest('DELETE', `/api/tutor/invites/${inviteId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const row = await env.DB.prepare('SELECT status FROM tutor_invites WHERE id = ?').bind(inviteId).first();
    expect(row.status).toBe('revoked');
  });

  it('sent → revoked', async () => {
    const { inviteId, token } = await tutorWithInvite('sent');
    const res = await worker.fetch(
      makeRequest('DELETE', `/api/tutor/invites/${inviteId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
  });

  it('joined → 409 (not revocable)', async () => {
    const { inviteId, token } = await tutorWithInvite('joined');
    const res = await worker.fetch(
      makeRequest('DELETE', `/api/tutor/invites/${inviteId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(409);
  });

  it('needs_review → revoked', async () => {
    const { inviteId, token } = await tutorWithInvite('needs_review');
    const res = await worker.fetch(
      makeRequest('DELETE', `/api/tutor/invites/${inviteId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
  });
});

// ── POST /api/tutor/invites/:id/resend ────────────────────────────────────────

describe('POST /api/tutor/invites/:id/resend', () => {
  it('send_failed → re-attempts send (no email configured → stays pending)', async () => {
    const tutorId = 'tutor-resend-sf';
    const inviteId = 'inv-resend-sf';
    await seed.account(env.DB, tutorId, 'resend-sf@test.com');
    await seed.tutor(env.DB, tutorId, 'resend-sf@test.com');
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: 'hash-resend-sf',
      tutorId,
      parentEmail: 'parent@e.com',
      childName: 'Alice',
      status: 'send_failed',
    });
    const token = await makeAuthToken({ userId: tutorId, email: 'resend-sf@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/resend`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    // No EMAIL_API_KEY in test env → sendPendingInvites bails early → row stays pending
    expect(body.status).toBe('pending');
  });

  it('sent <24h → 429 cooldown', async () => {
    const tutorId = 'tutor-resend-cool';
    const inviteId = 'inv-resend-cool';
    await seed.account(env.DB, tutorId, 'resend-cool@test.com');
    await seed.tutor(env.DB, tutorId, 'resend-cool@test.com');

    // Insert with sent_at = now (very recent)
    await env.DB.prepare(`
      INSERT INTO tutor_invites
        (id, token_hash, token_plain, tutor_id, batch_id, parent_email,
         child_name, status, expires_at, sent_at)
      VALUES (?, ?, NULL, ?, 'b', 'p@e.com', 'Alice', 'sent', datetime('now','+30 days'), datetime('now'))
    `).bind(inviteId, 'hash-cool', tutorId).run();

    const token = await makeAuthToken({ userId: tutorId, email: 'resend-cool@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/resend`, { auth: token }),
      env
    );
    expect(res.status).toBe(429);
  });

  it('rotation: old token_hash no longer matches after resend', async () => {
    const tutorId = 'tutor-resend-rot';
    const inviteId = 'inv-resend-rot';
    const originalRaw = crypto.randomUUID();
    const originalHash = await hashToken(originalRaw);

    await seed.account(env.DB, tutorId, 'resend-rot@test.com');
    await seed.tutor(env.DB, tutorId, 'resend-rot@test.com');
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: originalHash,
      tokenPlain: null,
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'send_failed',
    });

    const token = await makeAuthToken({ userId: tutorId, email: 'resend-rot@test.com' });

    await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/resend`, { auth: token }),
      env
    );

    // The old token hash must no longer match
    const row = await env.DB.prepare(
      'SELECT token_hash FROM tutor_invites WHERE id = ?'
    ).bind(inviteId).first();
    expect(row.token_hash).not.toBe(originalHash);
  });

  it('joined invite refuses resend and stays joined (claim-vs-resend race)', async () => {
    const tutorId = 'tutor-resend-race';
    const inviteId = 'inv-resend-race';
    await seed.account(env.DB, tutorId, 'resend-race@test.com');
    await seed.tutor(env.DB, tutorId, 'resend-race@test.com');
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: 'hash-resend-race',
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'joined',
    });
    const token = await makeAuthToken({ userId: tutorId, email: 'resend-race@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/resend`, { auth: token }),
      env
    );
    expect(res.status).toBe(409);

    const row = await env.DB.prepare(
      'SELECT status, token_hash FROM tutor_invites WHERE id = ?'
    ).bind(inviteId).first();
    expect(row.status).toBe('joined');
    expect(row.token_hash).toBe('hash-resend-race');
  });
});

// ── POST /api/tutor/invites/:id/link ─────────────────────────────────────────

describe('POST /api/tutor/invites/:id/link', () => {
  it('returns link once, status flips to sent, old token invalidated', async () => {
    const tutorId = 'tutor-link-once';
    const inviteId = 'inv-link-once';
    const originalHash = 'hash-link-once-original';

    await seed.account(env.DB, tutorId, 'link-once@test.com');
    await seed.tutor(env.DB, tutorId, 'link-once@test.com');
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: originalHash,
      tokenPlain: 'old-plain-token',
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'pending',
    });

    const token = await makeAuthToken({ userId: tutorId, email: 'link-once@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/link`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.link).toMatch(/^https:\/\/prepstep\.co\.uk\/invite\//);

    // Extract the new token from the link
    const newRawToken = body.link.split('/invite/')[1];

    // Status should be 'sent' now, token_plain NULL, new hash
    const row = await env.DB.prepare(
      'SELECT status, token_plain, token_hash FROM tutor_invites WHERE id = ?'
    ).bind(inviteId).first();
    expect(row.status).toBe('sent');
    expect(row.token_plain).toBeNull();
    expect(row.token_hash).toBe(await hashToken(newRawToken));
    // Old hash no longer valid
    expect(row.token_hash).not.toBe(originalHash);
  });

  it('already revoked → 409', async () => {
    const tutorId = 'tutor-link-rev';
    const inviteId = 'inv-link-rev';

    await seed.account(env.DB, tutorId, 'link-rev@test.com');
    await seed.tutor(env.DB, tutorId, 'link-rev@test.com');
    await seed.invite(env.DB, {
      id: inviteId,
      tokenHash: 'hash-link-rev',
      tutorId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'revoked',
    });

    const token = await makeAuthToken({ userId: tutorId, email: 'link-rev@test.com' });
    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/invites/${inviteId}/link`, { auth: token }),
      env
    );
    expect(res.status).toBe(409);
  });
});

// ── Admin: bulk-invite-reviews ───────────────────────────────────────────────

describe('Admin bulk-invite-reviews', () => {
  it('non-admin → 403', async () => {
    const userId = 'plain-user-admin-inv';
    await seed.account(env.DB, userId, 'plain-admin-inv@test.com');
    const token = await makeAuthToken({ userId, email: 'plain-admin-inv@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/bulk-invite-reviews', { auth: token }),
      adminEnv()
    );
    expect(res.status).toBe(403);
  });

  it('approve → flips needs_review→pending + audit row', async () => {
    const tutorId = 'tutor-admin-approve';
    const batchId = 'batch-admin-approve';

    await seed.account(env.DB, ADMIN_ID, 'admin-inv@test.com');
    await seed.account(env.DB, tutorId, 'tutor-admin-approve@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-admin-approve@test.com');
    await seed.invite(env.DB, {
      id: 'inv-admin-1',
      tokenHash: 'hash-admin-1',
      tokenPlain: 'plain-admin-1',
      tutorId,
      batchId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'needs_review',
    });

    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-inv@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/admin/bulk-invite-reviews', {
        auth: adminToken,
        body: { batchId, action: 'approve' },
      }),
      adminEnv()
    );
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);

    // Row should be pending now
    const inv = await env.DB.prepare('SELECT status FROM tutor_invites WHERE id = ?')
      .bind('inv-admin-1').first();
    expect(inv.status).toBe('pending');

    // Audit row exists
    const audit = await env.DB.prepare(
      "SELECT action, target FROM admin_audit WHERE action = 'approve_bulk_invites'"
    ).first();
    expect(audit).not.toBeNull();
    expect(audit.target).toBe(batchId);
    // Target must NOT be a token
    expect(audit.target).not.toMatch(/plain|hash/);
  });

  it('reject → revokes rows + audit row', async () => {
    const tutorId = 'tutor-admin-reject';
    const batchId = 'batch-admin-reject';

    await seed.account(env.DB, ADMIN_ID, 'admin-inv2@test.com');
    await seed.account(env.DB, tutorId, 'tutor-admin-reject@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-admin-reject@test.com');
    await seed.invite(env.DB, {
      id: 'inv-admin-rej',
      tokenHash: 'hash-admin-rej',
      tokenPlain: 'plain-admin-rej',
      tutorId,
      batchId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'needs_review',
    });

    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-inv2@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/admin/bulk-invite-reviews', {
        auth: adminToken,
        body: { batchId, action: 'reject' },
      }),
      adminEnv()
    );
    expect(res.status).toBe(200);

    const inv = await env.DB.prepare('SELECT status, token_plain FROM tutor_invites WHERE id = ?')
      .bind('inv-admin-rej').first();
    expect(inv.status).toBe('revoked');
    expect(inv.token_plain).toBeNull();

    const audit = await env.DB.prepare(
      "SELECT action FROM admin_audit WHERE action = 'reject_bulk_invites'"
    ).first();
    expect(audit).not.toBeNull();
  });

  it('approveTutor=true sets bulk_invite_approved=1', async () => {
    const tutorId = 'tutor-admin-flag';
    const batchId = 'batch-admin-flag';

    await seed.account(env.DB, ADMIN_ID, 'admin-inv3@test.com');
    await seed.account(env.DB, tutorId, 'tutor-admin-flag@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-admin-flag@test.com');
    await seed.invite(env.DB, {
      id: 'inv-admin-flag',
      tokenHash: 'hash-admin-flag',
      tokenPlain: 'plain-admin-flag',
      tutorId,
      batchId,
      parentEmail: 'p@e.com',
      childName: 'Alice',
      status: 'needs_review',
    });

    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-inv3@test.com' });

    await worker.fetch(
      makeRequest('POST', '/api/admin/bulk-invite-reviews', {
        auth: adminToken,
        body: { batchId, action: 'approve', approveTutor: true },
      }),
      adminEnv()
    );

    const tutor = await env.DB.prepare('SELECT bulk_invite_approved FROM tutors WHERE id = ?')
      .bind(tutorId).first();
    expect(tutor.bulk_invite_approved).toBe(1);
  });
});

// ── Account deletion removes tutor_invites rows ───────────────────────────────

describe('Account deletion cleans up tutor_invites', () => {
  it('deletes invites matching parent_email and joined_child_id', async () => {
    const tutorId = 'tutor-del-acct';
    const parentId = 'parent-del-acct';
    const childId = 'child-del-acct';

    await seed.account(env.DB, tutorId, 'tutor-da@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-da@test.com');
    await seed.account(env.DB, parentId, 'parent-da@test.com');
    await seed.child(env.DB, childId, parentId);

    // Invite addressed to this parent's email
    await seed.invite(env.DB, {
      id: 'inv-da-1',
      tokenHash: 'hash-da-1',
      tutorId,
      parentEmail: 'parent-da@test.com',
      childName: 'Alice',
      status: 'sent',
    });

    // Invite that was joined by this parent's child
    await seed.invite(env.DB, {
      id: 'inv-da-2',
      tokenHash: 'hash-da-2',
      tutorId,
      parentEmail: 'someone-else@test.com',
      childName: 'Bob',
      status: 'joined',
      joinedChildId: childId,
    });

    const token = await makeAuthToken({ userId: parentId, email: 'parent-da@test.com' });
    const res = await worker.fetch(
      makeRequest('DELETE', '/api/account', { auth: token }),
      env
    );
    expect(res.status).toBe(200);

    // Both invite rows should be gone
    const r1 = await env.DB.prepare('SELECT 1 FROM tutor_invites WHERE id = ?').bind('inv-da-1').first();
    const r2 = await env.DB.prepare('SELECT 1 FROM tutor_invites WHERE id = ?').bind('inv-da-2').first();
    expect(r1).toBeNull();
    expect(r2).toBeNull();
  });
});

// ── Email template security ───────────────────────────────────────────────────

describe('buildInviteEmail', () => {
  it('escapes <script> in childName', () => {
    const { html } = buildInviteEmail({
      tutorName: 'Alice',
      childName: '<script>alert(1)</script>',
      link: 'https://prepstep.co.uk/invite/tok',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('strips CR/LF from subject line', () => {
    const { subject } = buildInviteEmail({
      tutorName: 'Alice\r\nBcc: evil@evil.com',
      childName: 'Bob',
      link: 'https://prepstep.co.uk/invite/tok',
    });
    expect(subject).not.toContain('\r');
    expect(subject).not.toContain('\n');
  });

  it('escapes ampersands in link', () => {
    const { html } = buildInviteEmail({
      tutorName: 'Alice',
      childName: 'Bob',
      link: 'https://prepstep.co.uk/invite/tok?a=1&b=2',
    });
    // The href attribute should have &amp; not raw &
    expect(html).toContain('&amp;');
    expect(html).not.toContain('invite/tok?a=1&b=2">');
  });

  it('includes tutor name, CTA button, and free-trial line', () => {
    const { html, subject } = buildInviteEmail({
      tutorName: 'Mrs Smith',
      childName: 'Oliver',
      link: 'https://prepstep.co.uk/invite/tok123',
    });
    expect(html).toContain('Mrs Smith');
    expect(html).toContain('Accept the invitation');
    expect(html).toContain('30 days');
    expect(html).toContain("Didn't expect this email?");
    expect(subject).toContain('Mrs Smith');
    expect(subject).toContain('Oliver');
  });
});

/**
 * join_intents — tutor-attribution durability, layer 2
 * (plans/tutor-attribution-durability.md).
 *
 * Covers: POST /api/tutor/join-intent (create + idempotent upsert),
 * POST /api/tutor/join-intent/decline, the join_intents side-effect of
 * POST /api/tutor/join, the pendingJoinIntent field on GET /api/account,
 * and the GDPR erasure cascade (account delete -> join_intents rows gone).
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import {
  makeAuthToken,
  createSchema,
  cleanDb,
  seed,
  makeRequest,
} from './helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

async function getIntent(accountId, tutorId) {
  return env.DB.prepare(
    'SELECT * FROM join_intents WHERE account_id = ? AND tutor_id = ?'
  ).bind(accountId, tutorId).first();
}

// seed.tutor()'s generated code (`TC-${userId}`) is mixed-case when userId
// contains lowercase letters. Real codes are always pure uppercase
// (generateTutorCode()'s SAFE_CHARS alphabet — routes/tutor.js), and every
// route in this file canonicalises an incoming code with .toUpperCase()
// before matching it against the stored value. Every test here submits the
// code back through the API, so it must already be stored canonically —
// hence a local seed helper rather than the shared seed.tutor().
async function seedTutor(db, tutorId, email = `${tutorId}@test.com`) {
  const code = `TC-${tutorId}`.toUpperCase().slice(0, 32);
  await db.prepare(
    `INSERT INTO tutors (id, email, display_name, tutor_code) VALUES (?, ?, 'Test Tutor', ?)`
  ).bind(tutorId, email, code).run();
  return code;
}

// A real (not SQL-expression-string) past timestamp, formatted like
// datetime('now') so lexicographic ordering matches chronological ordering.
function hoursAgo(hours) {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
}

describe('POST /api/tutor/join-intent', () => {
  it('without auth → 401', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { body: { tutorCode: 'TEST-CODE' } }),
      env
    );
    expect(res.status).toBe(401);
  });

  it('unknown tutor code → 404, writes nothing', async () => {
    const userId = 'parent-unknown-code';
    await seed.account(env.DB, userId, 'p1@test.com');
    const token = await makeAuthToken({ userId, email: 'p1@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: 'NOPE-0000' } }),
      env
    );
    expect(res.status).toBe(404);

    const { results } = await env.DB.prepare('SELECT * FROM join_intents').all();
    expect(results).toHaveLength(0);
  });

  it('a valid code but no accounts row yet (race with account creation) → 404, writes nothing', async () => {
    const userId = 'parent-no-account-row';
    const tutorId = 'tutor-no-account-row';
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'noacct@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(404);

    const { results } = await env.DB.prepare('SELECT * FROM join_intents').all();
    expect(results).toHaveLength(0);
  });

  it('valid code → creates a pending intent', async () => {
    const userId = 'parent-create';
    const tutorId = 'tutor-create';
    await seed.account(env.DB, userId, 'p2@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'p2@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    const intent = await getIntent(userId, tutorId);
    expect(intent).toBeTruthy();
    expect(intent.status).toBe('pending');
    expect(intent.tutor_code).toBe(code);
  });

  it('is case-insensitive on the tutor code', async () => {
    const userId = 'parent-lowercase';
    const tutorId = 'tutor-lowercase';
    await seed.account(env.DB, userId, 'p2b@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'p2b@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code.toLowerCase() } }),
      env
    );
    expect(res.status).toBe(200);
    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('pending');
  });

  it('missing tutorCode → 400', async () => {
    const userId = 'parent-missing-code';
    await seed.account(env.DB, userId, 'p3@test.com');
    const token = await makeAuthToken({ userId, email: 'p3@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: {} }),
      env
    );
    expect(res.status).toBe(400);
  });

  it('re-posting the same code is idempotent — one row, updated_at bumps, status stays pending', async () => {
    const userId = 'parent-repost';
    const tutorId = 'tutor-repost';
    await seed.account(env.DB, userId, 'p4@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'p4@test.com' });

    await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    const first = await getIntent(userId, tutorId);

    // Force created_at/updated_at into the past so a second POST's bump is observable.
    await env.DB.prepare(
      `UPDATE join_intents SET created_at = datetime('now', '-1 hour'), updated_at = datetime('now', '-1 hour') WHERE id = ?`
    ).bind(first.id).run();
    const stale = await getIntent(userId, tutorId);

    const res2 = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res2.status).toBe(200);

    const { results } = await env.DB.prepare(
      'SELECT * FROM join_intents WHERE account_id = ? AND tutor_id = ?'
    ).bind(userId, tutorId).all();
    expect(results).toHaveLength(1); // still one row — the UNIQUE constraint held
    expect(results[0].id).toBe(first.id); // same row, not a new one
    expect(results[0].status).toBe('pending');
    expect(results[0].created_at).toBe(stale.created_at); // created_at untouched by the upsert
    expect(results[0].updated_at).not.toBe(stale.updated_at); // updated_at bumped back to "now"
  });

  it('re-posting a declined intent flips it back to pending', async () => {
    const userId = 'parent-redecline';
    const tutorId = 'tutor-redecline';
    await seed.account(env.DB, userId, 'p5@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'p5@test.com' });

    await seed.joinIntent(env.DB, {
      id: 'ji-redecline-1', accountId: userId, tutorId, tutorCode: code, status: 'declined',
    });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(200);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('pending');
  });

  it('re-posting a joined intent never downgrades it', async () => {
    const userId = 'parent-rejoin';
    const tutorId = 'tutor-rejoin';
    await seed.account(env.DB, userId, 'p6@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'p6@test.com' });

    await seed.joinIntent(env.DB, {
      id: 'ji-rejoin-1', accountId: userId, tutorId, tutorCode: code, status: 'joined',
    });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(200);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('joined');
  });
});

describe('POST /api/tutor/join-intent/decline', () => {
  it('without auth → 401', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent/decline', { body: { tutorCode: 'TEST-CODE' } }),
      env
    );
    expect(res.status).toBe(401);
  });

  it('unknown tutor code → 404', async () => {
    const userId = 'parent-decline-unknown';
    await seed.account(env.DB, userId, 'd1@test.com');
    const token = await makeAuthToken({ userId, email: 'd1@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent/decline', { auth: token, body: { tutorCode: 'NOPE-0000' } }),
      env
    );
    expect(res.status).toBe(404);
  });

  it('no existing intent row → 404', async () => {
    const userId = 'parent-decline-norow';
    const tutorId = 'tutor-decline-norow';
    await seed.account(env.DB, userId, 'd2@test.com');
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'd2@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent/decline', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(404);
  });

  it('a pending intent is declined', async () => {
    const userId = 'parent-decline-ok';
    const tutorId = 'tutor-decline-ok';
    await seed.account(env.DB, userId, 'd3@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-decline-ok', accountId: userId, tutorId, tutorCode: code, status: 'pending' });
    const token = await makeAuthToken({ userId, email: 'd3@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent/decline', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(200);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('declined');
  });

  it('declining an already-joined intent is a harmless no-op, never downgraded', async () => {
    const userId = 'parent-decline-joined';
    const tutorId = 'tutor-decline-joined';
    await seed.account(env.DB, userId, 'd4@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-decline-joined', accountId: userId, tutorId, tutorCode: code, status: 'joined' });
    const token = await makeAuthToken({ userId, email: 'd4@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join-intent/decline', { auth: token, body: { tutorCode: code } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.alreadyJoined).toBe(true);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('joined');
  });
});

describe('POST /api/tutor/join sets the intent to joined', () => {
  it('a first-time join creates a joined intent row even with no prior POST /join-intent', async () => {
    const userId = 'parent-join-fresh';
    const tutorId = 'tutor-join-fresh';
    const childId = 'child-join-fresh';
    await seed.account(env.DB, userId, 'j1@test.com');
    await seed.child(env.DB, childId, userId);
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'j1@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: code, childId } }),
      env
    );
    expect(res.status).toBe(201);

    const intent = await getIntent(userId, tutorId);
    expect(intent).toBeTruthy();
    expect(intent.status).toBe('joined');
  });

  it('joining after a pending intent flips it to joined', async () => {
    const userId = 'parent-join-pending';
    const tutorId = 'tutor-join-pending';
    const childId = 'child-join-pending';
    await seed.account(env.DB, userId, 'j2@test.com');
    await seed.child(env.DB, childId, userId);
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-join-pending', accountId: userId, tutorId, tutorCode: code, status: 'pending' });
    const token = await makeAuthToken({ userId, email: 'j2@test.com' });

    await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: code, childId } }),
      env
    );

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('joined');
  });

  it('joining after a declined intent still flips it to joined (link still works post-decline)', async () => {
    const userId = 'parent-join-declined';
    const tutorId = 'tutor-join-declined';
    const childId = 'child-join-declined';
    await seed.account(env.DB, userId, 'j3@test.com');
    await seed.child(env.DB, childId, userId);
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-join-declined', accountId: userId, tutorId, tutorCode: code, status: 'declined' });
    const token = await makeAuthToken({ userId, email: 'j3@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: code, childId } }),
      env
    );
    expect(res.status).toBe(201);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('joined');
  });

  it('re-joining (already-linked, idempotent branch) keeps the intent joined and does not error', async () => {
    const userId = 'parent-join-already';
    const tutorId = 'tutor-join-already';
    const childId = 'child-join-already';
    await seed.account(env.DB, userId, 'j4@test.com');
    await seed.child(env.DB, childId, userId);
    const code = await seedTutor(env.DB, tutorId);
    const token = await makeAuthToken({ userId, email: 'j4@test.com' });

    const first = await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: code, childId } }),
      env
    );
    expect(first.status).toBe(201);

    const second = await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: code, childId } }),
      env
    );
    expect(second.status).toBe(200);
    const secondBody = await second.json();
    expect(secondBody.alreadyLinked).toBe(true);

    const intent = await getIntent(userId, tutorId);
    expect(intent.status).toBe('joined');

    const { results } = await env.DB.prepare(
      'SELECT * FROM join_intents WHERE account_id = ? AND tutor_id = ?'
    ).bind(userId, tutorId).all();
    expect(results).toHaveLength(1); // no duplicate row from the second call
  });

  it('an unknown tutor code on /api/tutor/join writes no join_intents row', async () => {
    const userId = 'parent-join-unknown';
    const childId = 'child-join-unknown';
    await seed.account(env.DB, userId, 'j5@test.com');
    await seed.child(env.DB, childId, userId);
    const token = await makeAuthToken({ userId, email: 'j5@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/join', { auth: token, body: { tutorCode: 'NOPE-0000', childId } }),
      env
    );
    expect(res.status).toBe(404);

    const { results } = await env.DB.prepare('SELECT * FROM join_intents').all();
    expect(results).toHaveLength(0);
  });
});

describe('GET /api/account — pendingJoinIntent', () => {
  it('is null when there is no pending intent', async () => {
    const userId = 'parent-bootstrap-none';
    await seed.account(env.DB, userId, 'b1@test.com');
    const token = await makeAuthToken({ userId, email: 'b1@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pendingJoinIntent).toBeNull();
  });

  it('is null when the only intent is declined or joined', async () => {
    const userId = 'parent-bootstrap-notpending';
    const tutorId = 'tutor-bootstrap-notpending';
    await seed.account(env.DB, userId, 'b2@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-b2', accountId: userId, tutorId, tutorCode: code, status: 'declined' });
    const token = await makeAuthToken({ userId, email: 'b2@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
    const body = await res.json();
    expect(body.pendingJoinIntent).toBeNull();
  });

  it('returns tutorCode + tutorName for a pending intent', async () => {
    const userId = 'parent-bootstrap-pending';
    const tutorId = 'tutor-bootstrap-pending';
    await seed.account(env.DB, userId, 'b3@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-b3', accountId: userId, tutorId, tutorCode: code, status: 'pending' });
    const token = await makeAuthToken({ userId, email: 'b3@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
    const body = await res.json();
    expect(body.pendingJoinIntent).toEqual({
      tutorCode: code,
      tutorName: 'Test Tutor',
    });
  });

  it('returns the MOST RECENT pending intent when several exist', async () => {
    const userId = 'parent-bootstrap-multi';
    const tutorIdOld = 'tutor-bootstrap-old';
    const tutorIdNew = 'tutor-bootstrap-new';
    await seed.account(env.DB, userId, 'b4@test.com');
    const oldCode = await seedTutor(env.DB, tutorIdOld);
    const newCode = await seedTutor(env.DB, tutorIdNew);

    await seed.joinIntent(env.DB, {
      id: 'ji-b4-old', accountId: userId, tutorId: tutorIdOld, tutorCode: oldCode, status: 'pending',
      createdAt: hoursAgo(48), updatedAt: hoursAgo(48),
    });
    await seed.joinIntent(env.DB, {
      id: 'ji-b4-new', accountId: userId, tutorId: tutorIdNew, tutorCode: newCode, status: 'pending',
    });

    const token = await makeAuthToken({ userId, email: 'b4@test.com' });
    const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
    const body = await res.json();
    expect(body.pendingJoinIntent).toEqual({
      tutorCode: newCode,
      tutorName: 'Test Tutor',
    });
  });
});

describe('GDPR erasure — DELETE /api/account cascades join_intents', () => {
  it('deleting the account removes its join_intents rows', async () => {
    const userId = 'parent-erasure';
    const tutorId = 'tutor-erasure';
    await seed.account(env.DB, userId, 'e1@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-erasure', accountId: userId, tutorId, tutorCode: code, status: 'pending' });
    expect(await getIntent(userId, tutorId)).toBeTruthy();

    const token = await makeAuthToken({ userId, email: 'e1@test.com' });
    const res = await worker.fetch(makeRequest('DELETE', '/api/account', { auth: token }), env);
    expect(res.status).toBe(200);

    expect(await getIntent(userId, tutorId)).toBeNull();
  });

  it('deleting the tutor (FK CASCADE) removes its join_intents rows', async () => {
    const userId = 'parent-tutor-erasure';
    const tutorId = 'tutor-erasure-2';
    await seed.account(env.DB, userId, 'e2@test.com');
    const code = await seedTutor(env.DB, tutorId);
    await seed.joinIntent(env.DB, { id: 'ji-erasure-2', accountId: userId, tutorId, tutorCode: code, status: 'pending' });
    expect(await getIntent(userId, tutorId)).toBeTruthy();

    await env.DB.prepare('DELETE FROM tutors WHERE id = ?').bind(tutorId).run();

    expect(await getIntent(userId, tutorId)).toBeNull();
  });
});

describe('join_intents schema', () => {
  it('column pin — exposes exactly the expected columns', async () => {
    const { results } = await env.DB.prepare(
      `SELECT name FROM pragma_table_info('join_intents') ORDER BY cid`
    ).all();
    const cols = results.map(r => r.name).sort();
    expect(cols).toEqual(
      ['id', 'account_id', 'tutor_id', 'tutor_code', 'status', 'created_at', 'updated_at'].sort()
    );
  });

  it('rejects a status outside the CHECK vocabulary', async () => {
    await seed.account(env.DB, 'parent-badstatus');
    await seedTutor(env.DB, 'tutor-badstatus');
    await expect(
      env.DB.prepare(
        `INSERT INTO join_intents (id, account_id, tutor_id, tutor_code, status)
         VALUES ('ji-bad', 'parent-badstatus', 'tutor-badstatus', 'CODE-0001', 'not-a-real-status')`
      ).run()
    ).rejects.toThrow();
  });

  it('rejects a second row for the same (account_id, tutor_id) pair', async () => {
    await seed.account(env.DB, 'parent-dupe');
    await seedTutor(env.DB, 'tutor-dupe');
    await seed.joinIntent(env.DB, { id: 'ji-dupe-1', accountId: 'parent-dupe', tutorId: 'tutor-dupe', tutorCode: 'CODE-0002', status: 'pending' });
    await expect(
      env.DB.prepare(
        `INSERT INTO join_intents (id, account_id, tutor_id, tutor_code, status)
         VALUES ('ji-dupe-2', 'parent-dupe', 'tutor-dupe', 'CODE-0002', 'pending')`
      ).run()
    ).rejects.toThrow();
  });
});

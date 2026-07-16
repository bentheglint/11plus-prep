/**
 * GET /api/admin/join-intents — tutor-attribution durability, layer 4
 * (plans/tutor-attribution-durability.md).
 *
 * Answers "is this signup a tutor referral, and to whom?" without asking the
 * tutor. Covers: admin gate (non-admin 403), intent listing shape/ordering,
 * and the "unlinked signups" logic (accounts with children, no pupil_tutors
 * link, no join_intents row) including the edge cases the plan calls out:
 *   - account with 2 children where 1 is linked → NOT unlinked
 *   - account with an intent but no link → in intents, not in unlinked
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

const ADMIN_ID = 'admin-attribution-test';
const adminEnv = () => ({ ...env, ADMIN_USER_IDS: ADMIN_ID });

beforeAll(async () => {
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

// seed.child() hardcodes 'Test Child' — insert directly for custom names
// (mirrors joinIntents.test.js's seedTutor() pattern for the same reason).
async function seedChild(db, childId, accountId, displayName) {
  await db.prepare(
    'INSERT INTO children (id, account_id, display_name) VALUES (?, ?, ?)'
  ).bind(childId, accountId, displayName).run();
}

describe('GET /api/admin/join-intents — admin gate', () => {
  it('without auth → 401', async () => {
    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', {}),
      adminEnv()
    );
    expect(res.status).toBe(401);
  });

  it('authed non-admin → 403', async () => {
    const userId = 'plain-user-attribution';
    await seed.account(env.DB, userId, 'plain-attribution@test.com');
    const token = await makeAuthToken({ userId, email: 'plain-attribution@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: token }),
      adminEnv()
    );
    expect(res.status).toBe(403);
  });

  it('ADMIN_USER_IDS unset (fail-closed) → 403 even for a real admin id', async () => {
    const token = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-attribution@test.com' });
    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: token }),
      env // no ADMIN_USER_IDS override
    );
    expect(res.status).toBe(403);
  });
});

describe('GET /api/admin/join-intents — intent listing', () => {
  it('returns intents newest-first, joined to account/children/tutor', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-attribution@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-attribution@test.com');

    const parentId = 'parent-intent-list';
    const tutorId = 'tutor-intent-list';
    await seed.account(env.DB, parentId, 'parent-intent-list@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-intent-list@test.com');
    await seedChild(env.DB, 'child-intent-list', parentId, 'Amara');

    await seed.joinIntent(env.DB, {
      id: 'intent-older',
      accountId: parentId,
      tutorId,
      tutorCode: `TC-${tutorId}`,
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' '),
    });

    const parentId2 = 'parent-intent-list-2';
    const tutorId2 = 'tutor-intent-list-2';
    await seed.account(env.DB, parentId2, 'parent-intent-list-2@test.com');
    await seed.tutor(env.DB, tutorId2, 'tutor-intent-list-2@test.com');
    await seed.joinIntent(env.DB, {
      id: 'intent-newer',
      accountId: parentId2,
      tutorId: tutorId2,
      tutorCode: `TC-${tutorId2}`,
      status: 'joined',
    });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.intents).toHaveLength(2);
    // Newest first
    expect(body.intents[0].id).toBe('intent-newer');
    expect(body.intents[1].id).toBe('intent-older');

    const older = body.intents.find(i => i.id === 'intent-older');
    expect(older.status).toBe('pending');
    expect(older.parentEmail).toBe('parent-intent-list@test.com');
    expect(older.childrenNames).toEqual(['Amara']);
    expect(older.tutorName).toBe('Test Tutor');
    expect(older.signupDate).toBeTruthy();
    expect(older.createdAt).toBeTruthy();
    expect(older.updatedAt).toBeTruthy();

    const newer = body.intents.find(i => i.id === 'intent-newer');
    expect(newer.status).toBe('joined');
    expect(newer.childrenNames).toEqual([]); // no children seeded for parentId2
  });

  it('aggregates multiple children onto one intent row', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-multi@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-multi@test.com');

    const parentId = 'parent-multi-child';
    const tutorId = 'tutor-multi-child';
    await seed.account(env.DB, parentId, 'parent-multi-child@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-multi-child@test.com');
    await seedChild(env.DB, 'child-multi-1', parentId, 'Femi');
    await seedChild(env.DB, 'child-multi-2', parentId, 'Grace');
    await seed.joinIntent(env.DB, {
      id: 'intent-multi',
      accountId: parentId,
      tutorId,
      tutorCode: `TC-${tutorId}`,
    });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    const intent = body.intents.find(i => i.id === 'intent-multi');
    expect(intent.childrenNames.sort()).toEqual(['Femi', 'Grace']);
  });
});

describe('GET /api/admin/join-intents — unlinked signups', () => {
  it('an account with a child, no link, no intent → unlinked', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-unlinked@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-unlinked@test.com');

    const parentId = 'parent-organic';
    await seed.account(env.DB, parentId, 'parent-organic@test.com');
    await seedChild(env.DB, 'child-organic', parentId, 'Hassan');

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    expect(body.unlinked).toHaveLength(1);
    expect(body.unlinked[0].parentEmail).toBe('parent-organic@test.com');
    expect(body.unlinked[0].childrenNames).toEqual(['Hassan']);
  });

  it('account with no children → NOT unlinked (nothing to link yet)', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-nochild@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-nochild@test.com');

    const parentId = 'parent-no-children';
    await seed.account(env.DB, parentId, 'parent-no-children@test.com');

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    expect(body.unlinked.find(u => u.parentEmail === 'parent-no-children@test.com')).toBeUndefined();
  });

  it('account with 2 children where 1 is linked → NOT unlinked', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-partial@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-partial@test.com');

    const parentId = 'parent-partial-link';
    const tutorId = 'tutor-partial-link';
    await seed.account(env.DB, parentId, 'parent-partial-link@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-partial-link@test.com');
    await seedChild(env.DB, 'child-partial-1', parentId, 'Ines');
    await seedChild(env.DB, 'child-partial-2', parentId, 'Jamal');
    await seed.pupilTutor(env.DB, 'child-partial-1', tutorId);

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    expect(body.unlinked.find(u => u.parentEmail === 'parent-partial-link@test.com')).toBeUndefined();
  });

  it('account with an intent but no link → appears in intents, not unlinked', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-intent-only@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-intent-only@test.com');

    const parentId = 'parent-intent-only';
    const tutorId = 'tutor-intent-only';
    await seed.account(env.DB, parentId, 'parent-intent-only@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-intent-only@test.com');
    await seedChild(env.DB, 'child-intent-only', parentId, 'Kofi');
    await seed.joinIntent(env.DB, {
      id: 'intent-only',
      accountId: parentId,
      tutorId,
      tutorCode: `TC-${tutorId}`,
      status: 'declined',
    });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    expect(body.unlinked.find(u => u.parentEmail === 'parent-intent-only@test.com')).toBeUndefined();
    expect(body.intents.find(i => i.id === 'intent-only')).toBeTruthy();
  });

  it('account with a fully linked child and no intent → NOT unlinked, no intents row', async () => {
    const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-linked@test.com' });
    await seed.account(env.DB, ADMIN_ID, 'admin-linked@test.com');

    const parentId = 'parent-fully-linked';
    const tutorId = 'tutor-fully-linked';
    await seed.account(env.DB, parentId, 'parent-fully-linked@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-fully-linked@test.com');
    await seedChild(env.DB, 'child-fully-linked', parentId, 'Layla');
    await seed.pupilTutor(env.DB, 'child-fully-linked', tutorId);

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/join-intents', { auth: adminToken }),
      adminEnv()
    );
    const body = await res.json();
    expect(body.unlinked.find(u => u.parentEmail === 'parent-fully-linked@test.com')).toBeUndefined();
    expect(body.intents.find(i => i.parentEmail === 'parent-fully-linked@test.com')).toBeUndefined();
  });
});

// ── Regression tests for Bug 1 (routing) and Bug 2 (class enrolment auth) ──

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

// ── Bug 1 regression: tutor sub-routes must be reachable ─────────────────────
//
// Before the fix, the /api/tutor catch-all block called handleTutorRoutes and,
// when it returned null (routes like /api/tutor/assignments are not in that
// handler), immediately returned 404 — never reaching the sub-route handlers.
// This test goes through the real router and would have caught that regression.

describe('Tutor sub-route reachability (Bug 1 regression)', () => {
  it('GET /api/tutor/assignments returns non-404 for authenticated tutor', async () => {
    const userId = 'tutor-routing-test';
    await seed.account(env.DB, userId, 'routing@test.com');
    await seed.tutor(env.DB, userId, 'routing@test.com');
    const token = await makeAuthToken({ userId, email: 'routing@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/tutor/assignments', { auth: token }),
      env
    );

    // 200 (empty list) — the route must be reached, not 404
    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.assignments)).toBe(true);
  });

  it('GET /api/tutor/classes returns non-404 for authenticated tutor', async () => {
    const userId = 'tutor-classes-routing';
    await seed.account(env.DB, userId, 'classes-route@test.com');
    await seed.tutor(env.DB, userId, 'classes-route@test.com');
    const token = await makeAuthToken({ userId, email: 'classes-route@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/tutor/classes', { auth: token }),
      env
    );

    expect(res.status).not.toBe(404);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.classes)).toBe(true);
  });

  it('GET /api/tutor/assignments without tutor profile → 403 (gate preserved)', async () => {
    const userId = 'no-tutor-profile-routing';
    await seed.account(env.DB, userId, 'no-profile@test.com');
    const token = await makeAuthToken({ userId, email: 'no-profile@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/tutor/assignments', { auth: token }),
      env
    );

    // requireTutorProfile gate must fire before the route handler
    expect(res.status).toBe(403);
  });
});

// ── Bug 2: class enrolment must check pupil_tutors roster ────────────────────
//
// Before the fix, POST /api/tutor/classes/:id/pupils inserted every childId
// in the request body with no check against pupil_tutors. A tutor could enrol
// an arbitrary child (e.g. one whose parent removed them) and see their data.
//
// After the fix, only children on the tutor's pupil_tutors roster are inserted;
// off-roster children are silently dropped.

describe('Class enrolment roster check (Bug 2)', () => {
  it('enrols only the on-roster child; off-roster child is dropped', async () => {
    const tutorId = 'tutor-enrol-test';
    const parentId = 'parent-enrol-test';
    const onRosterChildId = 'child-on-roster';
    const offRosterChildId = 'child-off-roster';
    const classId = 'class-enrol-test';

    // Set up accounts and children
    await seed.account(env.DB, tutorId, 'tutor-enrol@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-enrol@test.com');
    await seed.account(env.DB, parentId, 'parent-enrol@test.com');
    await seed.child(env.DB, onRosterChildId, parentId);
    await seed.child(env.DB, offRosterChildId, parentId);

    // Only link one child to the tutor
    await seed.pupilTutor(env.DB, onRosterChildId, tutorId);

    // Create a class owned by the tutor
    await seed.class_(env.DB, classId, tutorId);

    const token = await makeAuthToken({ userId: tutorId, email: 'tutor-enrol@test.com' });

    // Attempt to enrol both children
    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/classes/${classId}/pupils`, {
        auth: token,
        body: { childIds: [onRosterChildId, offRosterChildId] },
      }),
      env
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    // Only the on-roster child should have been enrolled
    expect(body.added).toBe(1);

    // Verify via the class pupils listing — only on-roster child present
    const listRes = await worker.fetch(
      makeRequest('GET', `/api/tutor/classes/${classId}/pupils`, { auth: token }),
      env
    );
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();
    const enrolledIds = listBody.pupils.map(p => p.id);
    expect(enrolledIds).toContain(onRosterChildId);
    expect(enrolledIds).not.toContain(offRosterChildId);
  });

  it('enrols zero children when none are on the roster', async () => {
    const tutorId = 'tutor-enrol-zero';
    const parentId = 'parent-enrol-zero';
    const childId = 'child-not-on-roster';
    const classId = 'class-enrol-zero';

    await seed.account(env.DB, tutorId, 'tutor-zero@test.com');
    await seed.tutor(env.DB, tutorId, 'tutor-zero@test.com');
    await seed.account(env.DB, parentId, 'parent-zero@test.com');
    await seed.child(env.DB, childId, parentId);
    // Deliberately no pupilTutor link

    await seed.class_(env.DB, classId, tutorId);

    const token = await makeAuthToken({ userId: tutorId, email: 'tutor-zero@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', `/api/tutor/classes/${classId}/pupils`, {
        auth: token,
        body: { childIds: [childId] },
      }),
      env
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.added).toBe(0);
  });
});

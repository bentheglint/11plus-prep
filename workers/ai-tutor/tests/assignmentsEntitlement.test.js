/**
 * Assignment routes — freemium enforcement (Phase 0 Unit B)
 *
 * Two goals exercised end to end:
 *  1. A free pupil's deep per-question data (assignment_recipients.
 *     question_results) must never reach their tutor via the assignment
 *     routes, and the billing columns fetched to resolve entitlement must
 *     never leak onto the response either.
 *  2. Focused Learning homework can never be assigned to, or actioned by,
 *     a free pupil — the tutor gets told up front (create-time gate +
 *     skipped list), and the pupil never sees a locked item dangled in
 *     front of them (list-time filter + start/complete defense-in-depth).
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

// ── Change 1: GET /api/tutor/assignments/:id recipient leak ────────────────

describe('GET /api/tutor/assignments/:id — recipient entitlement stripping', () => {
  it('strips question_results + billing columns from a free recipient, keeps them for a paid recipient', async () => {
    const tutorId = 'tutor-detail-mixed';
    const freeParentId = 'parent-detail-free';
    const freeChildId = 'child-detail-free';
    const paidParentId = 'parent-detail-paid';
    const paidChildId = 'child-detail-paid';
    const assignmentId = 'asgn-detail-mixed';
    const itemId = 'item-detail-mixed';
    const freeRecipientId = 'rcpt-detail-free';
    const paidRecipientId = 'rcpt-detail-paid';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.freeAccount(env.DB, freeParentId, `${freeParentId}@test.com`);
    await seed.child(env.DB, freeChildId, freeParentId);
    await seed.account(env.DB, paidParentId, `${paidParentId}@test.com`); // within trial → full access
    await seed.child(env.DB, paidChildId, paidParentId);

    await env.DB.prepare(
      `INSERT INTO assignments (id, tutor_id, due_date) VALUES (?, ?, date('now', '+7 days'))`
    ).bind(assignmentId, tutorId).run();
    await env.DB.prepare(
      `INSERT INTO assignment_items (id, assignment_id, item_type, item_ref, subject)
       VALUES (?, ?, 'topic', 'fractions', 'maths')`
    ).bind(itemId, assignmentId).run();

    for (const { recipientId, childId } of [
      { recipientId: freeRecipientId, childId: freeChildId },
      { recipientId: paidRecipientId, childId: paidChildId },
    ]) {
      await seed.recipient(env.DB, { id: recipientId, assignmentId, itemId, childId, tutorId, status: 'completed' });
      await env.DB.prepare(
        `UPDATE assignment_recipients SET score = 8, question_results = ? WHERE id = ?`
      ).bind(JSON.stringify([{ questionId: 1, correct: true }]), recipientId).run();
    }

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/assignments/${assignmentId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    const freeRow = body.recipients.find(r => r.child_id === freeChildId);
    const paidRow = body.recipients.find(r => r.child_id === paidChildId);

    expect(freeRow.deepProgressLocked).toBe(true);
    expect(freeRow.pupilPlan).toBe('free');
    expect(freeRow).not.toHaveProperty('question_results');

    expect(paidRow.deepProgressLocked).toBe(false);
    expect(paidRow.question_results).toBe(JSON.stringify([{ questionId: 1, correct: true }]));

    // Drift guard — no billing column ever reaches the client, on ANY row
    for (const row of body.recipients) {
      for (const billingKey of ['account_id', 'account_created_at', 'is_comped', 'comp_source', 'subscription_status', 'subscription_current_period_end']) {
        expect(row).not.toHaveProperty(billingKey);
      }
    }
  });
});

// ── Change 2: POST /api/tutor/assignments create-time hard block ───────────

describe('POST /api/tutor/assignments — free-pupil hard block', () => {
  it('individual free target → 422 no_eligible_recipients, writes nothing', async () => {
    const tutorId = 'tutor-create-free-solo';
    const parentId = 'parent-create-free-solo';
    const childId = 'child-create-free-solo';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.freeAccount(env.DB, parentId, `${parentId}@test.com`);
    await seed.child(env.DB, childId, parentId);
    await seed.pupilTutor(env.DB, childId, tutorId);

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/assignments', {
        auth: token,
        body: { dueDate: '2026-08-01', targetChildId: childId, items: [{ itemType: 'topic', itemRef: 'fractions' }] },
      }),
      env
    );

    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe('no_eligible_recipients');
    expect(body.skipped).toEqual([{ childId, childName: 'Test Child', pupilPlan: 'free' }]);

    const [assignments, items, recipients] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS n FROM assignments').first(),
      env.DB.prepare('SELECT COUNT(*) AS n FROM assignment_items').first(),
      env.DB.prepare('SELECT COUNT(*) AS n FROM assignment_recipients').first(),
    ]);
    expect(assignments.n).toBe(0);
    expect(items.n).toBe(0);
    expect(recipients.n).toBe(0);
  });

  it('mixed class (1 free, 1 paid) → assignment created, recipient row for the paid pupil only', async () => {
    const tutorId = 'tutor-create-mixed';
    const classId = 'class-create-mixed';
    const freeParentId = 'parent-create-mixed-free';
    const freeChildId = 'child-create-mixed-free';
    const paidParentId = 'parent-create-mixed-paid';
    const paidChildId = 'child-create-mixed-paid';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.class_(env.DB, classId, tutorId, 'Mixed Class');

    await seed.freeAccount(env.DB, freeParentId, `${freeParentId}@test.com`);
    await seed.child(env.DB, freeChildId, freeParentId);
    await env.DB.prepare('INSERT INTO class_enrolments (class_id, child_id) VALUES (?, ?)').bind(classId, freeChildId).run();

    await seed.account(env.DB, paidParentId, `${paidParentId}@test.com`);
    await seed.child(env.DB, paidChildId, paidParentId);
    await env.DB.prepare('INSERT INTO class_enrolments (class_id, child_id) VALUES (?, ?)').bind(classId, paidChildId).run();

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/assignments', {
        auth: token,
        body: { dueDate: '2026-08-01', targetClassId: classId, items: [{ itemType: 'topic', itemRef: 'fractions' }] },
      }),
      env
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.recipientCount).toBe(1);
    expect(body.skipped).toEqual([{ childId: freeChildId, childName: 'Test Child', pupilPlan: 'free' }]);

    const { results: recipients } = await env.DB.prepare(
      'SELECT child_id FROM assignment_recipients WHERE assignment_id = ?'
    ).bind(body.assignment.id).all();
    expect(recipients).toHaveLength(1);
    expect(recipients[0].child_id).toBe(paidChildId);
  });

  it('all-paid class → unchanged behaviour, empty skipped', async () => {
    const tutorId = 'tutor-create-all-paid';
    const classId = 'class-create-all-paid';
    const parentAId = 'parent-create-all-paid-a';
    const childAId = 'child-create-all-paid-a';
    const parentBId = 'parent-create-all-paid-b';
    const childBId = 'child-create-all-paid-b';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.class_(env.DB, classId, tutorId, 'All Paid Class');

    for (const [parentId, childId] of [[parentAId, childAId], [parentBId, childBId]]) {
      await seed.account(env.DB, parentId, `${parentId}@test.com`);
      await seed.child(env.DB, childId, parentId);
      await env.DB.prepare('INSERT INTO class_enrolments (class_id, child_id) VALUES (?, ?)').bind(classId, childId).run();
    }

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/assignments', {
        auth: token,
        body: { dueDate: '2026-08-01', targetClassId: classId, items: [{ itemType: 'topic', itemRef: 'fractions' }] },
      }),
      env
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.recipientCount).toBe(2);
    expect(body.skipped).toEqual([]);
  });

  it('empty class (no enrolments) → 422 empty_target, not the free-plan message', async () => {
    const tutorId = 'tutor-create-empty';
    const classId = 'class-create-empty';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.class_(env.DB, classId, tutorId, 'Empty Class');

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('POST', '/api/tutor/assignments', {
        auth: token,
        body: { dueDate: '2026-08-01', targetClassId: classId, items: [{ itemType: 'topic', itemRef: 'fractions' }] },
      }),
      env
    );

    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe('empty_target');

    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM assignments WHERE tutor_id = ?').bind(tutorId).first();
    expect(count.n).toBe(0);
  });
});

// ── Change 3: GET /api/pupil/assignments — never dangle locked homework ────

describe('GET /api/pupil/assignments — free-pupil list filtering', () => {
  it("excludes the homework from a free pupil's list, leaves a paid pupil's list unchanged", async () => {
    const tutorId = 'tutor-pupil-list';
    const freeParentId = 'parent-pupil-list-free';
    const freeChildId = 'child-pupil-list-free';
    const paidParentId = 'parent-pupil-list-paid';
    const paidChildId = 'child-pupil-list-paid';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.freeAccount(env.DB, freeParentId, `${freeParentId}@test.com`);
    await seed.child(env.DB, freeChildId, freeParentId);
    await seed.account(env.DB, paidParentId, `${paidParentId}@test.com`);
    await seed.child(env.DB, paidChildId, paidParentId);

    // Seed a legacy-style assignment directly for each child (bypassing the
    // create-route gate — simulates homework assigned before a downgrade).
    for (const childId of [freeChildId, paidChildId]) {
      const assignmentId = `asgn-${childId}`;
      const itemId = `item-${childId}`;
      const recipientId = `rcpt-${childId}`;
      await env.DB.prepare(
        `INSERT INTO assignments (id, tutor_id, target_child_id, due_date) VALUES (?, ?, ?, date('now', '+7 days'))`
      ).bind(assignmentId, tutorId, childId).run();
      await env.DB.prepare(
        `INSERT INTO assignment_items (id, assignment_id, item_type, item_ref, subject) VALUES (?, ?, 'topic', 'fractions', 'maths')`
      ).bind(itemId, assignmentId).run();
      await seed.recipient(env.DB, { id: recipientId, assignmentId, itemId, childId, tutorId });
    }

    const freeToken = await makeAuthToken({ userId: freeParentId });
    const freeRes = await worker.fetch(
      makeRequest('GET', `/api/pupil/assignments?child_id=${freeChildId}`, { auth: freeToken }),
      env
    );
    expect(freeRes.status).toBe(200);
    expect((await freeRes.json()).recipients).toEqual([]);

    const paidToken = await makeAuthToken({ userId: paidParentId });
    const paidRes = await worker.fetch(
      makeRequest('GET', `/api/pupil/assignments?child_id=${paidChildId}`, { auth: paidToken }),
      env
    );
    expect(paidRes.status).toBe(200);
    expect((await paidRes.json()).recipients).toHaveLength(1);
  });
});

// ── Change 4: POST /api/pupil/assignments/:id/{start,complete} defense-in-depth ─

describe('POST /api/pupil/assignments/:id/{start,complete} — free-pupil refusal', () => {
  async function seedRecipient(parentSeedFn, label) {
    const parentId = `parent-startcomplete-${label}`;
    const childId = `child-startcomplete-${label}`;
    const tutorId = `tutor-startcomplete-${label}`;
    const assignmentId = `asgn-startcomplete-${label}`;
    const itemId = `item-startcomplete-${label}`;
    const recipientId = `rcpt-startcomplete-${label}`;

    await parentSeedFn(env.DB, parentId, `${parentId}@test.com`);
    await seed.child(env.DB, childId, parentId);
    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await env.DB.prepare(
      `INSERT INTO assignments (id, tutor_id, target_child_id, due_date) VALUES (?, ?, ?, date('now', '+7 days'))`
    ).bind(assignmentId, tutorId, childId).run();
    await env.DB.prepare(
      `INSERT INTO assignment_items (id, assignment_id, item_type, item_ref, subject) VALUES (?, ?, 'topic', 'fractions', 'maths')`
    ).bind(itemId, assignmentId).run();
    await seed.recipient(env.DB, { id: recipientId, assignmentId, itemId, childId, tutorId });

    const token = await makeAuthToken({ userId: parentId });
    return { token, recipientId };
  }

  it('free pupil → start and complete both 403 upgrade_required, no status write', async () => {
    const { token, recipientId } = await seedRecipient(seed.freeAccount, 'free');

    const startRes = await worker.fetch(
      makeRequest('POST', `/api/pupil/assignments/${recipientId}/start`, { auth: token, body: {} }),
      env
    );
    expect(startRes.status).toBe(403);
    expect((await startRes.json()).code).toBe('upgrade_required');

    const afterStart = await env.DB.prepare('SELECT status FROM assignment_recipients WHERE id = ?').bind(recipientId).first();
    expect(afterStart.status).toBe('assigned');

    const completeRes = await worker.fetch(
      makeRequest('POST', `/api/pupil/assignments/${recipientId}/complete`, { auth: token, body: { score: 10 } }),
      env
    );
    expect(completeRes.status).toBe(403);
    expect((await completeRes.json()).code).toBe('upgrade_required');

    const afterComplete = await env.DB.prepare('SELECT status, score FROM assignment_recipients WHERE id = ?').bind(recipientId).first();
    expect(afterComplete.status).toBe('assigned');
    expect(afterComplete.score).toBeNull();
  });

  it('paid pupil → start and complete unchanged (200, status recorded)', async () => {
    const { token, recipientId } = await seedRecipient(seed.account, 'paid');

    const startRes = await worker.fetch(
      makeRequest('POST', `/api/pupil/assignments/${recipientId}/start`, { auth: token, body: {} }),
      env
    );
    expect(startRes.status).toBe(200);

    const completeRes = await worker.fetch(
      makeRequest('POST', `/api/pupil/assignments/${recipientId}/complete`, { auth: token, body: { score: 10 } }),
      env
    );
    expect(completeRes.status).toBe(200);
    const completeBody = await completeRes.json();
    expect(completeBody.recipient.status).toBe('completed');
    expect(completeBody.recipient.score).toBe(10);
  });
});

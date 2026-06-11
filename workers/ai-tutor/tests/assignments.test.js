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

// Regression: POST /api/pupil/assignments/:id/complete was broken for 'late'
// status — the WHERE clause only matched 'assigned' and 'in_progress'.
// Fixed by adding 'late' to the IN list. This test locks that in.
describe('Assignment completion', () => {
  it('complete an assigned recipient → 200', async () => {
    const { token, recipientId } = await buildScenario('assigned');
    const res = await completeRecipient(token, recipientId);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipient.status).toBe('completed');
  });

  it('complete an in_progress recipient → 200', async () => {
    const { token, recipientId } = await buildScenario('in_progress');
    const res = await completeRecipient(token, recipientId);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipient.status).toBe('completed');
  });

  it('complete a late recipient → 200 (regression: was blocked)', async () => {
    const { token, recipientId } = await buildScenario('late');
    const res = await completeRecipient(token, recipientId);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipient.status).toBe('completed');
  });

  it('complete returns score in response', async () => {
    const { token, recipientId } = await buildScenario('assigned');
    const res = await completeRecipient(token, recipientId, { score: 8 });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.recipient.score).toBe(8);
  });

  it('complete recipient belonging to another account → 403', async () => {
    const { recipientId } = await buildScenario('assigned');
    const otherId = 'other-user';
    await seed.account(env.DB, otherId, 'other@test.com');
    const otherToken = await makeAuthToken({ userId: otherId });

    const res = await completeRecipient(otherToken, recipientId);
    expect(res.status).toBe(403);
  });
});

// Regression: assignment_items.subject was stored as NULL when the tutor UI
// didn't send it (Evie's first homework, 11 Jun 2026) — a NULL subject hid
// the assignment from the child's homepage banner while the tutor profile
// showed it as overdue. The create route now derives subject from the topic
// key for 'topic' items.
describe('Assignment creation derives missing subject', () => {
  async function createAssignment(items) {
    const accountId = `acct-${crypto.randomUUID().slice(0, 8)}`;
    const childId = `child-${crypto.randomUUID().slice(0, 8)}`;
    const tutorId = `tutor-${crypto.randomUUID().slice(0, 8)}`;

    await seed.account(env.DB, accountId, `${accountId}@test.com`);
    await seed.child(env.DB, childId, accountId);
    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);
    await seed.pupilTutor(env.DB, childId, tutorId);

    const token = await makeAuthToken({ userId: tutorId });
    return worker.fetch(
      makeRequest('POST', '/api/tutor/assignments', {
        auth: token,
        body: { dueDate: '2026-07-01', targetChildId: childId, items },
      }),
      env
    );
  }

  async function itemSubjects() {
    const { results } = await env.DB.prepare(
      'SELECT item_ref, subject FROM assignment_items'
    ).all();
    return Object.fromEntries(results.map(r => [r.item_ref, r.subject]));
  }

  it('REGRESSION: topic item without subject gets it derived from the topic key', async () => {
    const res = await createAssignment([{ itemType: 'topic', itemRef: 'fractions' }]);
    expect(res.status).toBe(201);
    expect((await itemSubjects()).fractions).toBe('maths');
  });

  it('derives the quiz vocabulary for VR topics (verbalreasoning, no hyphen)', async () => {
    const res = await createAssignment([{ itemType: 'topic', itemRef: 'synonyms' }]);
    expect(res.status).toBe(201);
    expect((await itemSubjects()).synonyms).toBe('verbalreasoning');
  });

  it('keeps an explicitly supplied subject', async () => {
    const res = await createAssignment([
      { itemType: 'topic', itemRef: 'comprehension', subject: 'english' },
    ]);
    expect(res.status).toBe(201);
    expect((await itemSubjects()).comprehension).toBe('english');
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function buildScenario(status) {
  const accountId = `acct-${status}-${crypto.randomUUID().slice(0, 8)}`;
  const childId = `child-${crypto.randomUUID().slice(0, 8)}`;
  const tutorId = `tutor-${crypto.randomUUID().slice(0, 8)}`;
  const assignmentId = `asgn-${crypto.randomUUID().slice(0, 8)}`;
  const itemId = `item-${crypto.randomUUID().slice(0, 8)}`;
  const recipientId = `rcpt-${crypto.randomUUID().slice(0, 8)}`;

  await seed.account(env.DB, accountId, `${accountId}@test.com`);
  await seed.child(env.DB, childId, accountId);
  await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);

  await env.DB.prepare(
    `INSERT INTO assignments (id, tutor_id, target_child_id, due_date)
     VALUES (?, ?, ?, date('now', '+7 days'))`
  ).bind(assignmentId, tutorId, childId).run();

  await env.DB.prepare(
    `INSERT INTO assignment_items (id, assignment_id, item_type, item_ref)
     VALUES (?, ?, 'topic', 'fractions')`
  ).bind(itemId, assignmentId).run();

  await seed.recipient(env.DB, {
    id: recipientId,
    assignmentId,
    itemId,
    childId,
    tutorId,
    status,
  });

  const token = await makeAuthToken({ userId: accountId });
  return { token, recipientId };
}

async function completeRecipient(token, recipientId, body = {}) {
  return worker.fetch(
    makeRequest('POST', `/api/pupil/assignments/${recipientId}/complete`, {
      auth: token,
      body,
    }),
    env
  );
}

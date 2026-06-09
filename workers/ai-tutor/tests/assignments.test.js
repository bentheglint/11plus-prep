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

/**
 * GET /api/tutor/dashboard — entitlement allow-list wiring (Phase 0 Unit A)
 *
 * The dashboard route resolves every pupil's entitlement in BATCH from the
 * roster query's own billing columns (no extra DB read per pupil — this is
 * a roster of many pupils, not a single-pupil drill-down). This test
 * exercises the real SQL (column aliases, resolveEntitlements wiring) end
 * to end; the pure allow-list logic itself is covered exhaustively in
 * src/__tests__/logic/tutorPulse.test.js.
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
import { createDataSchema, cleanDataDb } from './data-helpers.js';

beforeAll(async () => {
  await createSchema(env.DB);
  await createDataSchema(env.DB);
});

afterEach(async () => {
  await cleanDataDb(env.DB);
  await cleanDb(env.DB);
});

describe('GET /api/tutor/dashboard — entitlement allow-list wiring', () => {
  it('nulls accuracy/weakest fields for a free pupil, keeps them for a trial pupil, on the same roster', async () => {
    const tutorId = 'tutor-dashboard-mixed';
    const freeParentId = 'parent-dashboard-free';
    const freeChildId = 'child-dashboard-free';
    const paidParentId = 'parent-dashboard-paid';
    const paidChildId = 'child-dashboard-paid';

    await seed.tutor(env.DB, tutorId, `${tutorId}@test.com`);

    await seed.freeAccount(env.DB, freeParentId, `${freeParentId}@test.com`);
    await seed.child(env.DB, freeChildId, freeParentId);
    await seed.pupilTutor(env.DB, freeChildId, tutorId);

    await seed.account(env.DB, paidParentId, `${paidParentId}@test.com`); // within trial → full access
    await seed.child(env.DB, paidChildId, paidParentId);
    await seed.pupilTutor(env.DB, paidChildId, tutorId);

    // Both quizzed this week — same underlying weekly data, entitlement
    // alone should decide whether accuracy reaches the client.
    for (const childId of [freeChildId, paidChildId]) {
      await env.DB.prepare(
        `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, completed_at)
         VALUES (?, 'fractions', 'maths', 9, 10, datetime('now'))`
      ).bind(childId).run();
    }

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', '/api/tutor/dashboard', { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    const freeRow = body.roster.find(p => p.id === freeChildId);
    const paidRow = body.roster.find(p => p.id === paidChildId);

    expect(freeRow.deepProgressLocked).toBe(true);
    expect(freeRow.accuracy_this_week).toBeNull();

    expect(paidRow.deepProgressLocked).toBe(false);
    expect(paidRow.accuracy_this_week).toBe(90);

    // No billing column leaks onto either roster row
    for (const row of body.roster) {
      for (const billingKey of ['account_id', 'account_created_at', 'is_comped', 'comp_source', 'subscription_status', 'subscription_current_period_end']) {
        expect(row).not.toHaveProperty(billingKey);
      }
    }
  });
});

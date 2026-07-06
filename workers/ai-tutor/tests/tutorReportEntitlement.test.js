/**
 * GET /api/tutor/report/:childId — entitlement short-circuit (Phase 0 Unit A)
 *
 * A free-tier pupil's report must not be truncated — it must SHORT-CIRCUIT
 * before the deep per-question/quiz/mock-test queries ever run, returning a
 * locked payload the client can render an upgrade nudge from. See
 * lib/entitlementGate.js and the handler in routes/report.js.
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
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

async function seedDeepData(db, childId) {
  // 20+ question_results on one topic so an entitled pupil gets a real,
  // non-null covered-topic accuracy — proves the deep report actually ran.
  for (let i = 0; i < 20; i++) {
    await db.prepare(
      `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, attempted_at)
       VALUES (?, ?, 'fractions', 'maths', 1, datetime('now'))`
    ).bind(childId, 1000 + i).run();
  }
  await db.prepare(
    `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, completed_at)
     VALUES (?, 'fractions', 'maths', 8, 10, datetime('now'))`
  ).bind(childId).run();
  await db.prepare(
    `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, completed_at)
     VALUES (?, 'maths', 50, 40, 80, datetime('now'))`
  ).bind(childId).run();
}

async function setUpTutorAndPupil(db, { tutorId, childId, parentId, freeTier }) {
  await seed.tutor(db, tutorId, `${tutorId}@test.com`);
  if (freeTier) {
    await seed.freeAccount(db, parentId, `${parentId}@test.com`);
  } else {
    await seed.account(db, parentId, `${parentId}@test.com`);
  }
  await seed.child(db, childId, parentId);
  await seed.pupilTutor(db, childId, tutorId);
  await seedDeepData(db, childId);
}

describe('GET /api/tutor/report/:childId — entitlement short-circuit', () => {
  it('free-tier pupil: returns a locked payload, not a truncated report', async () => {
    const tutorId = 'tutor-report-free';
    const parentId = 'parent-report-free';
    const childId = 'child-report-free';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: true });

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/report/${childId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.locked).toBe(true);
    expect(body.code).toBe('deep_progress_locked');
    expect(body.pupilPlan).toBe('free');
    expect(body.child).toMatchObject({ displayName: 'Test Child' });

    // None of the deep report fields should be present
    for (const key of ['coveredTopics', 'subjectReadiness', 'coveredAccuracy', 'mockTests', 'readiness', 'recommendations']) {
      expect(body).not.toHaveProperty(key);
    }
  });

  it('free-tier pupil: the deep queries never ran (no residual deep data leaks through)', async () => {
    const tutorId = 'tutor-report-free-spy';
    const parentId = 'parent-report-free-spy';
    const childId = 'child-report-free-spy';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: true });

    const prepareSpy = vi.spyOn(env.DB, 'prepare');
    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/report/${childId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);

    // The deep report queries touch question_results / mock_test_results
    // beyond the seed data above — assert no additional query against those
    // tables ran as PART OF THE REPORT HANDLER for this locked pupil.
    const sqlCalls = prepareSpy.mock.calls.map(([sql]) => sql);
    const reportQuestionResultsQuery = sqlCalls.some(sql =>
      sql.includes('FROM question_results') && sql.includes('LIMIT 2000')
    );
    expect(reportQuestionResultsQuery).toBe(false);

    prepareSpy.mockRestore();
  });

  it('paid/trial pupil: full report, locked false', async () => {
    const tutorId = 'tutor-report-paid';
    const parentId = 'parent-report-paid';
    const childId = 'child-report-paid';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: false });

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/report/${childId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.locked).toBe(false);
    expect(body.coverage.coveredCount).toBe(1);
    expect(body.coveredAccuracy).not.toBeNull();
    expect(body.mockTests.length).toBeGreaterThan(0);
  });
});

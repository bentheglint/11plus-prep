/**
 * GET /api/tutor/pupils/:childId — entitlement allow-list (Phase 0 Unit A,
 * extended for Change 4b)
 *
 * A free-tier pupil's deep performance data (quiz history, topic mastery,
 * per-question results, mock test history, practice log, and per-recipient
 * assignment question_results) must never reach their tutor. This route is
 * built as an ALLOW-LIST: basic fields are always present, deep fields are
 * added only when the pupil is entitled. See lib/entitlementGate.js and the
 * handler in routes/tutor.js.
 *
 * Change 4b widens what a LOCKED pupil's response carries: a `basic`
 * aggregate (one overall accuracy %, one accuracy % per subject, and
 * engagement counts), computed server-side from quiz_results ONLY — never
 * topic_performance, question_results, mock_test_results, or
 * practice_sessions. The tests below pin the `basic` object's own
 * allow-listed key set as well as the top-level one, so a future change
 * can't quietly widen either without a deliberate update here.
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

// Every deep field this route can return. Any NEW deep field must be added
// here deliberately — that is the point of the drift guard below.
const DEEP_KEYS = ['quizResults', 'topicPerformance', 'questionResults', 'mockTestHistory', 'practiceLog'];

// The full allow-listed key set for a LOCKED (free-tier) pupil. If a future
// change lets a new key leak into the locked response, the drift guard test
// fails — update this set deliberately, only after confirming the new field
// is genuinely basic (not deep performance data).
const BASIC_ALLOWED_KEYS = ['child', 'assignmentRecipients', 'notesCount', 'pupilPlan', 'deepProgressLocked', 'basic'];

// The allow-listed key set of the `basic` aggregate itself (Change 4b). Kept
// separate from BASIC_ALLOWED_KEYS above so a drift into the nested object
// is caught with the same rigour as a drift into the top-level response.
const BASIC_AGGREGATE_ALLOWED_KEYS = ['overallAccuracy', 'totalQuestions', 'questionsThisWeek', 'subjectAccuracy'];
const SUBJECT_ACCURACY_ALLOWED_KEYS = ['subject', 'label', 'accuracy'];

async function seedDeepData(db, childId) {
  await db.prepare(
    `INSERT INTO quiz_results (child_id, topic_key, subject, score, total, completed_at)
     VALUES (?, 'fractions', 'maths', 8, 10, datetime('now'))`
  ).bind(childId).run();

  await db.prepare(
    `INSERT INTO question_results (child_id, question_id, topic_key, subject, is_correct, attempted_at)
     VALUES (?, 101, 'fractions', 'maths', 1, datetime('now'))`
  ).bind(childId).run();

  await db.prepare(
    `INSERT INTO mock_test_results (child_id, subject, total_questions, total_correct, percentage, completed_at)
     VALUES (?, 'maths', 50, 40, 80, datetime('now'))`
  ).bind(childId).run();

  await db.prepare(
    `INSERT INTO practice_sessions (child_id, session_date, data)
     VALUES (?, '2026-07-01', '{}')`
  ).bind(childId).run();

  await db.prepare(
    `INSERT INTO topic_performance (child_id, topic_key, subject, data)
     VALUES (?, 'fractions', 'maths', '{"score":0.8}')`
  ).bind(childId).run();
}

async function seedAssignmentWithResults(db, { tutorId, childId }) {
  await db.prepare(
    `INSERT INTO assignments (id, tutor_id, title, due_date) VALUES ('assign-1', ?, 'Week 1', date('now'))`
  ).bind(tutorId).run();
  await db.prepare(
    `INSERT INTO assignment_items (id, assignment_id, item_type, item_ref, subject)
     VALUES ('item-1', 'assign-1', 'quiz', 'fractions', 'maths')`
  ).run();
  await db.prepare(
    `INSERT INTO assignment_recipients (id, assignment_id, assignment_item_id, child_id, tutor_id, status, question_results)
     VALUES ('recip-1', 'assign-1', 'item-1', ?, ?, 'completed', '{"1":true,"2":false}')`
  ).bind(childId, tutorId).run();
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
  await seedAssignmentWithResults(db, { tutorId, childId });
}

describe('GET /api/tutor/pupils/:childId — entitlement allow-list', () => {
  it('free-tier pupil: every deep field is ABSENT, deepProgressLocked true, basic fields present', async () => {
    const tutorId = 'tutor-drilldown-free';
    const parentId = 'parent-drilldown-free';
    const childId = 'child-drilldown-free';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: true });

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/pupils/${childId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.deepProgressLocked).toBe(true);
    expect(body.pupilPlan).toBe('free');

    for (const key of DEEP_KEYS) {
      expect(body).not.toHaveProperty(key);
    }

    // Basic fields still present
    expect(body.child.display_name).toBe('Test Child');
    expect(body.notesCount).toBe(0);
    expect(body.assignmentRecipients).toHaveLength(1);

    // Per-recipient question_results (deep) stripped, other row fields kept
    const recipient = body.assignmentRecipients[0];
    expect(recipient).not.toHaveProperty('question_results');
    expect(recipient.status).toBe('completed');
    expect(recipient.assignment_title).toBe('Week 1');

    // Basic aggregate (Change 4b) — seedDeepData inserts one quiz_results
    // row (fractions/maths, 8/10, completed just now): overall and maths
    // accuracy are both 80%, both subjects with no data resolve to null
    // (never omitted — the three subjects are always all present).
    expect(body.basic.overallAccuracy).toBe(80);
    expect(body.basic.totalQuestions).toBe(10);
    expect(body.basic.questionsThisWeek).toBe(10);
    expect(body.basic.subjectAccuracy).toEqual([
      { subject: 'maths', label: 'Maths', accuracy: 80 },
      { subject: 'english', label: 'English', accuracy: null },
      { subject: 'verbalreasoning', label: 'Verbal Reasoning', accuracy: null },
    ]);
  });

  it('drift guard: a locked pupil response never carries an unlisted key', async () => {
    const tutorId = 'tutor-drilldown-driftguard';
    const parentId = 'parent-drilldown-driftguard';
    const childId = 'child-drilldown-driftguard';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: true });

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/pupils/${childId}`, { auth: token }),
      env
    );
    const body = await res.json();

    // Every key returned for a locked pupil must be in the explicit allow-list.
    // If this fails, a new field was added to the response without updating
    // BASIC_ALLOWED_KEYS above — confirm it's genuinely basic before doing so.
    for (const key of Object.keys(body)) {
      expect(BASIC_ALLOWED_KEYS).toContain(key);
    }

    // Same drift guard, one level deeper: the `basic` aggregate itself must
    // never carry more than the pinned aggregate fields, and each
    // subjectAccuracy entry must never carry more than subject/label/accuracy
    // (e.g. never a raw score/total pair, which would let a tutor back out
    // question counts finer than the intended engagement figures).
    for (const key of Object.keys(body.basic)) {
      expect(BASIC_AGGREGATE_ALLOWED_KEYS).toContain(key);
    }
    for (const entry of body.basic.subjectAccuracy) {
      for (const key of Object.keys(entry)) {
        expect(SUBJECT_ACCURACY_ALLOWED_KEYS).toContain(key);
      }
    }

    // The deep aggregate sources stay untouched for a locked pupil — the
    // basic aggregate is computed from quiz_results only.
    for (const key of DEEP_KEYS) {
      expect(body).not.toHaveProperty(key);
    }
  });

  it('paid/trial pupil: deep fields present, deepProgressLocked false', async () => {
    const tutorId = 'tutor-drilldown-paid';
    const parentId = 'parent-drilldown-paid';
    const childId = 'child-drilldown-paid';
    await setUpTutorAndPupil(env.DB, { tutorId, childId, parentId, freeTier: false });

    const token = await makeAuthToken({ userId: tutorId, email: `${tutorId}@test.com` });
    const res = await worker.fetch(
      makeRequest('GET', `/api/tutor/pupils/${childId}`, { auth: token }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.deepProgressLocked).toBe(false);
    expect(body.pupilPlan).toBe('trial');

    // An entitled pupil gets the full deep payload, never the locked
    // pupil's `basic` aggregate (Change 4b is additive to the locked
    // branch only — the entitled branch is unchanged).
    expect(body).not.toHaveProperty('basic');

    expect(body.quizResults).toHaveLength(1);
    expect(body.topicPerformance).toHaveLength(1);
    expect(body.questionResults).toHaveLength(1);
    expect(body.mockTestHistory).toHaveLength(1);
    expect(body.practiceLog).toHaveLength(1);

    const recipient = body.assignmentRecipients[0];
    expect(recipient.question_results).toBe('{"1":true,"2":false}');
  });
});

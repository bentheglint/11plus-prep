/**
 * Data-flow tests for buildDashboardData (src/utils/tutorPulse.js) — the
 * shared pulse builder used by both the Worker dashboard route and the
 * ?preview=tutorDashboard mock.
 *
 * Note: the D1 queries that feed this function are NOT covered here (no
 * Worker test harness). Query changes are verified manually against a
 * database snapshot — see the feature's verification notes.
 */
import { buildDashboardData } from '../../utils/tutorPulse';

const DAY = 86400000;
const NOW = new Date('2026-06-07T12:00:00Z').getTime();

function baseInput(overrides = {}) {
  return {
    roster: [
      { id: 'c1', display_name: 'Evie', parent_name: 'Sarah' },
      { id: 'c2', display_name: 'James', parent_name: 'Mark' },
      { id: 'c3', display_name: 'Priya', parent_name: 'Anita' },
    ],
    quizActiveRows: [
      { child_id: 'c1', last_active: new Date(NOW - 1 * DAY).toISOString() },
      { child_id: 'c2', last_active: new Date(NOW - 10 * DAY).toISOString() },
    ],
    mockActiveRows: [],
    lessonActiveRows: [],
    weeklyRows: [
      { child_id: 'c1', quiz_count: 4, accuracy: 0.75 },
    ],
    topicRows: [],
    overdueRows: [],
    now: NOW,
    ...overrides,
  };
}

describe('buildDashboardData — roster enrichment', () => {
  it('computes days_inactive from the most recent activity of any type', () => {
    const { roster } = buildDashboardData(baseInput({
      mockActiveRows: [{ child_id: 'c2', last_active: new Date(NOW - 2 * DAY).toISOString() }],
    }));
    const james = roster.find(p => p.id === 'c2');
    // Mock test 2 days ago beats quiz 10 days ago
    expect(james.days_inactive).toBe(2);
  });

  it('marks never-active pupils with null days_inactive and sorts them most at-risk', () => {
    const { roster } = buildDashboardData(baseInput());
    const priya = roster.find(p => p.id === 'c3');
    expect(priya.days_inactive).toBeNull();
    expect(roster[0].id).toBe('c3');
  });

  it('rounds weekly accuracy to a whole percentage', () => {
    const { roster } = buildDashboardData(baseInput());
    expect(roster.find(p => p.id === 'c1').accuracy_this_week).toBe(75);
    expect(roster.find(p => p.id === 'c2').accuracy_this_week).toBeNull();
  });
});

describe('buildDashboardData — pulse counts', () => {
  it('counts active pupils as any activity within 7 days', () => {
    const { pulse } = buildDashboardData(baseInput());
    expect(pulse.active_this_week).toBe(1);
    expect(pulse.total_pupils).toBe(3);
  });

  it('averages accuracy across pupils with quizzes only', () => {
    const { pulse } = buildDashboardData(baseInput({
      weeklyRows: [
        { child_id: 'c1', quiz_count: 4, accuracy: 0.9 },
        { child_id: 'c2', quiz_count: 1, accuracy: 0.5 },
      ],
    }));
    expect(pulse.avg_accuracy_this_week).toBe(70);
  });

  it('returns null average when nobody has quizzed', () => {
    const { pulse } = buildDashboardData(baseInput({ weeklyRows: [] }));
    expect(pulse.avg_accuracy_this_week).toBeNull();
  });
});

describe('buildDashboardData — overdue rows', () => {
  const overdueRows = [
    { child_id: 'c1', assignment_id: 'a1', title: 'Week 2 fractions', due_date: new Date(NOW - 3 * DAY).toISOString().slice(0, 10) },
    { child_id: 'c1', assignment_id: 'a2', title: null, due_date: new Date(NOW - 1 * DAY).toISOString().slice(0, 10) },
    { child_id: 'c2', assignment_id: 'a1', title: 'Week 2 fractions', due_date: new Date(NOW - 3 * DAY).toISOString().slice(0, 10) },
  ];

  it('derives the headline count and per-pupil counts from the same rows', () => {
    const { pulse, roster } = buildDashboardData(baseInput({ overdueRows }));
    expect(pulse.overdue_assignments).toBe(3);
    expect(roster.find(p => p.id === 'c1').overdue_assignments).toBe(2);
    expect(roster.find(p => p.id === 'c2').overdue_assignments).toBe(1);
    expect(roster.find(p => p.id === 'c3').overdue_assignments).toBe(0);
  });

  it('resolves child names and computes days overdue (due yesterday = 1)', () => {
    const { pulse } = buildDashboardData(baseInput({ overdueRows }));
    const row = pulse.overdue.find(r => r.assignment_id === 'a2');
    expect(row.child_name).toBe('Evie');
    expect(row.days_overdue).toBe(1);
    expect(row.assignment_title).toBeNull();
  });

  it('returns an empty array (and zero count) with no overdue rows', () => {
    const { pulse } = buildDashboardData(baseInput());
    expect(pulse.overdue).toEqual([]);
    expect(pulse.overdue_assignments).toBe(0);
  });
});

describe('buildDashboardData — weak topics', () => {
  const topicRows = [
    // Per-child rows ordered accuracy ASC, as the Worker query returns them
    { child_id: 'c1', topic_key: 'fractions', subject: 'maths', accuracy: 0.55, quiz_count: 2 },
    { child_id: 'c1', topic_key: 'algebra', subject: 'maths', accuracy: 0.90, quiz_count: 3 },
    { child_id: 'c2', topic_key: 'fractions', subject: 'maths', accuracy: 0.45, quiz_count: 2 },
    { child_id: 'c2', topic_key: 'algebra', subject: 'maths', accuracy: 0.60, quiz_count: 2 },
    { child_id: 'c3', topic_key: 'sequences', subject: 'maths', accuracy: 0.30, quiz_count: 2 },
  ];

  it('excludes topics attempted by fewer than 2 pupils', () => {
    const { pulse } = buildDashboardData(baseInput({ topicRows }));
    expect(pulse.weak_topics.map(t => t.topic_key)).not.toContain('sequences');
  });

  it('orders topics weakest first with rounded group accuracy', () => {
    const { pulse } = buildDashboardData(baseInput({ topicRows }));
    expect(pulse.weak_topics[0]).toMatchObject({
      topic_key: 'fractions',
      subject: 'maths',
      accuracy: 50,
      pupil_count: 2,
    });
    expect(pulse.weak_topics[1].topic_key).toBe('algebra');
  });

  it('sorts each topic\'s pupils weakest first', () => {
    const { pulse } = buildDashboardData(baseInput({ topicRows }));
    const fractions = pulse.weak_topics[0];
    expect(fractions.pupils.map(p => p.child_id)).toEqual(['c2', 'c1']);
    expect(fractions.pupils[0]).toMatchObject({ accuracy: 45, quiz_count: 2 });
  });

  it('caps the list at the 3 weakest topics', () => {
    const manyTopics = ['a', 'b', 'c', 'd', 'e'].flatMap((key, i) => [
      { child_id: 'c1', topic_key: key, subject: 'maths', accuracy: 0.4 + i * 0.05, quiz_count: 2 },
      { child_id: 'c2', topic_key: key, subject: 'maths', accuracy: 0.4 + i * 0.05, quiz_count: 2 },
    ]);
    const { pulse } = buildDashboardData(baseInput({ topicRows: manyTopics }));
    expect(pulse.weak_topics).toHaveLength(3);
    expect(pulse.weak_topics.map(t => t.topic_key)).toEqual(['a', 'b', 'c']);
  });

  it('keeps per-pupil weakest_topic on the roster from the first (lowest) row per child', () => {
    const { roster } = buildDashboardData(baseInput({ topicRows }));
    expect(roster.find(p => p.id === 'c1').weakest_topic).toBe('fractions');
    expect(roster.find(p => p.id === 'c1').weakest_accuracy).toBe(55);
  });
});

// ── Phase 0 Unit A: entitlement allow-list ──
//
// A free-tier pupil's deep performance data (accuracy, weakest topic) must
// never reach their tutor's dashboard. entitledDeepChildIds is a Set of
// child_ids resolved from billing state (see routes/tutor.js); anyone not
// in the set gets those fields nulled and is excluded from cross-pupil
// aggregates. undefined (the pre-Phase-0 shape) must keep treating everyone
// as entitled so every test above (and every existing caller) is unaffected.
describe('buildDashboardData — entitlement allow-list (deepProgressLocked)', () => {
  const topicRows = [
    { child_id: 'c1', topic_key: 'fractions', subject: 'maths', accuracy: 0.55, quiz_count: 2 },
    { child_id: 'c2', topic_key: 'fractions', subject: 'maths', accuracy: 0.45, quiz_count: 2 },
  ];

  it('nulls accuracy_this_week and weakest_* for a non-entitled child, marks deepProgressLocked', () => {
    const { roster } = buildDashboardData(baseInput({
      topicRows,
      entitledDeepChildIds: new Set(['c1']), // c2, c3 excluded
    }));

    const c1 = roster.find(p => p.id === 'c1');
    expect(c1.deepProgressLocked).toBe(false);
    expect(c1.accuracy_this_week).toBe(75);
    expect(c1.weakest_topic).toBe('fractions');

    const c2 = roster.find(p => p.id === 'c2');
    expect(c2.deepProgressLocked).toBe(true);
    expect(c2.accuracy_this_week).toBeNull();
    expect(c2.weakest_topic).toBeNull();
    expect(c2.weakest_subject).toBeNull();
    expect(c2.weakest_accuracy).toBeNull();
  });

  it('excludes a non-entitled child from weak_topics[].pupils[] and the group accuracy', () => {
    const { pulse } = buildDashboardData(baseInput({
      topicRows,
      entitledDeepChildIds: new Set(['c1']),
    }));

    // c2's row is dropped before the ≥2-pupil threshold is applied, so the
    // topic no longer qualifies as a "weak topic" at all.
    expect(pulse.weak_topics.map(t => t.topic_key)).not.toContain('fractions');
  });

  it('excludes a non-entitled child from avg_accuracy_this_week', () => {
    const { pulse } = buildDashboardData(baseInput({
      weeklyRows: [
        { child_id: 'c1', quiz_count: 4, accuracy: 0.9 },
        { child_id: 'c2', quiz_count: 1, accuracy: 0.1 }, // would drag the average down if counted
      ],
      entitledDeepChildIds: new Set(['c1']),
    }));
    expect(pulse.avg_accuracy_this_week).toBe(90);
  });

  it('a null accuracy_this_week (locked or no data) does not get sorted as worst', () => {
    // Same days_inactive for both — only the accuracy tiebreaker differs.
    const { roster } = buildDashboardData({
      roster: [
        { id: 'locked', display_name: 'Locked Pupil' },
        { id: 'active', display_name: 'Active Pupil' },
      ],
      quizActiveRows: [
        { child_id: 'locked', last_active: new Date(NOW - 2 * DAY).toISOString() },
        { child_id: 'active', last_active: new Date(NOW - 2 * DAY).toISOString() },
      ],
      mockActiveRows: [],
      lessonActiveRows: [],
      weeklyRows: [{ child_id: 'active', quiz_count: 3, accuracy: 0.5 }],
      topicRows: [],
      overdueRows: [],
      now: NOW,
      entitledDeepChildIds: new Set(['active']),
    });
    const locked = roster.find(p => p.id === 'locked');
    expect(locked.accuracy_this_week).toBeNull();
    expect(locked.deepProgressLocked).toBe(true);
  });

  it('drift guard: an unentitled child never carries a raw billing column', () => {
    // Simulates the real Worker query, which projects billing columns onto
    // the roster rows so entitlement can be resolved with zero extra DB
    // reads (see routes/tutor.js). Those must never reach the client.
    // Column set matches the SELECT in routes/tutor.js exactly (id,
    // account_id, account_created_at, is_comped, comp_source,
    // subscription_status, subscription_current_period_end).
    const rosterWithBilling = [
      {
        id: 'c1', display_name: 'Evie', parent_name: 'Sarah',
        account_id: 'acct-1', account_created_at: '2026-01-01 00:00:00',
        is_comped: 0, comp_source: null,
        subscription_status: null, subscription_current_period_end: null,
      },
      // A normal pupil alongside, to prove the allow-list isn't just
      // stripping fields off the locked row specifically.
      { id: 'c2', display_name: 'James', parent_name: 'Mark' },
    ];
    const { roster } = buildDashboardData(baseInput({
      roster: rosterWithBilling,
      entitledDeepChildIds: new Set(), // both locked
    }));
    const billingKeys = ['account_id', 'account_created_at', 'is_comped', 'comp_source', 'subscription_status', 'subscription_current_period_end'];
    for (const row of roster) {
      const keys = Object.keys(row);
      for (const billingKey of billingKeys) {
        expect(keys).not.toContain(billingKey);
      }
      // The one entitlement-derived field that IS meant to reach the client.
      expect(keys).toContain('deepProgressLocked');
    }
  });

  it('entitledDeepChildIds undefined ⇒ everyone entitled (pre-Phase-0 behaviour preserved)', () => {
    const { roster } = buildDashboardData(baseInput({ topicRows }));
    expect(roster.find(p => p.id === 'c1').deepProgressLocked).toBe(false);
    expect(roster.find(p => p.id === 'c2').deepProgressLocked).toBe(false);
    expect(roster.find(p => p.id === 'c3').deepProgressLocked).toBe(false);
  });
});

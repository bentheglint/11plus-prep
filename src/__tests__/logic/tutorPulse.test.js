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

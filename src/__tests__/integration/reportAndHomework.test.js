/**
 * Report data + tutor homework card tests (Phase 5)
 */

// ── GL percentile calibration curve ──

function estimatePercentile(masteryScore) {
  const s = Math.max(0, Math.min(1, masteryScore));
  const anchors = [
    [0.00, 5],  [0.30, 15], [0.45, 30], [0.55, 45],
    [0.65, 58], [0.72, 68], [0.78, 76], [0.83, 83],
    [0.88, 89], [0.92, 93], [0.96, 97], [1.00, 99],
  ];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (s >= x0 && s <= x1) {
      const t = (s - x0) / (x1 - x0);
      return Math.round(y0 + t * (y1 - y0));
    }
  }
  return 50;
}

describe('GL percentile calibration', () => {
  it('0% mastery gives ~5th percentile', () => {
    expect(estimatePercentile(0)).toBe(5);
  });

  it('100% mastery gives 99th percentile', () => {
    expect(estimatePercentile(1)).toBe(99);
  });

  it('~80% mastery is roughly 80th percentile (selective pass region)', () => {
    const pct = estimatePercentile(0.80);
    expect(pct).toBeGreaterThanOrEqual(75);
    expect(pct).toBeLessThanOrEqual(85);
  });

  it('~65% mastery is around 58th percentile', () => {
    expect(estimatePercentile(0.65)).toBe(58);
  });

  it('result is always an integer between 5 and 99', () => {
    [0, 0.3, 0.5, 0.7, 0.9, 1.0].forEach(s => {
      const pct = estimatePercentile(s);
      expect(Number.isInteger(pct)).toBe(true);
      expect(pct).toBeGreaterThanOrEqual(5);
      expect(pct).toBeLessThanOrEqual(99);
    });
  });

  it('is monotonically non-decreasing', () => {
    const scores = [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1.0];
    const percentiles = scores.map(estimatePercentile);
    for (let i = 1; i < percentiles.length; i++) {
      expect(percentiles[i]).toBeGreaterThanOrEqual(percentiles[i - 1]);
    }
  });
});

// ── Report data composition ──

describe('report data computation', () => {
  const topics = [
    { topicKey: 'fractions', subject: 'maths', data: { score: 0.45 } },
    { topicKey: 'decimals', subject: 'maths', data: { score: 0.30 } },
    { topicKey: 'algebra', subject: 'maths', data: { score: 0.82 } },
    { topicKey: 'synonyms', subject: 'verbalreasoning', data: { score: 0.70 } },
    { topicKey: 'antonyms', subject: 'verbalreasoning', data: { score: 0.90 } },
  ];

  it('overall score is the mean of topic scores', () => {
    const scores = topics.map(t => t.data.score);
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    expect(mean).toBeCloseTo(0.634, 2);
  });

  it('weakest topics sorted by lowest score', () => {
    const sorted = [...topics].sort((a, b) => (a.data.score || 0) - (b.data.score || 0));
    expect(sorted[0].topicKey).toBe('decimals');
    expect(sorted[1].topicKey).toBe('fractions');
  });

  it('strongest topics are reversed weakest', () => {
    const sorted = [...topics].sort((a, b) => (a.data.score || 0) - (b.data.score || 0));
    const strongest = sorted.slice(-3).reverse();
    expect(strongest[0].topicKey).toBe('antonyms');
    expect(strongest[1].topicKey).toBe('algebra');
  });

  it('subject mastery is mean of topic scores per subject', () => {
    const mathsTopics = topics.filter(t => t.subject === 'maths');
    const mathsMean = mathsTopics.reduce((s, t) => s + t.data.score, 0) / mathsTopics.length;
    expect(mathsMean).toBeCloseTo(0.523, 2);
  });

  it('recommendations exclude recently assigned topics', () => {
    const recentlyAssigned = new Set(['fractions', 'decimals']);
    const recommended = topics
      .sort((a, b) => a.data.score - b.data.score)
      .filter(t => !recentlyAssigned.has(t.topicKey))
      .slice(0, 3);
    expect(recommended.map(r => r.topicKey)).not.toContain('fractions');
    expect(recommended.map(r => r.topicKey)).not.toContain('decimals');
    expect(recommended[0].topicKey).toBe('synonyms'); // next weakest not recently assigned
  });
});

// ── TutorHomeworkCard grouping logic ──

describe('TutorHomeworkCard assignment grouping', () => {
  const recipients = [
    { id: 'r1', assignment_id: 'a1', assignment_title: 'Week 1', due_date: '2026-05-05', tutor_name: 'Mary', status: 'assigned', item_type: 'topic', item_ref: 'fractions' },
    { id: 'r2', assignment_id: 'a1', assignment_title: 'Week 1', due_date: '2026-05-05', tutor_name: 'Mary', status: 'completed', item_type: 'topic', item_ref: 'decimals' },
    { id: 'r3', assignment_id: 'a2', assignment_title: 'Week 2', due_date: '2026-05-12', tutor_name: 'Mary', status: 'assigned', item_type: 'mock', item_ref: 'maths' },
  ];

  function groupByAssignment(recipients) {
    const map = new Map();
    for (const r of recipients) {
      if (!map.has(r.assignment_id)) {
        map.set(r.assignment_id, { assignmentId: r.assignment_id, title: r.assignment_title, dueDate: r.due_date, tutorName: r.tutor_name, items: [] });
      }
      map.get(r.assignment_id).items.push(r);
    }
    return [...map.values()].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  it('groups recipients into assignments sorted by due date', () => {
    const grouped = groupByAssignment(recipients);
    expect(grouped).toHaveLength(2);
    expect(grouped[0].assignmentId).toBe('a1'); // due sooner
    expect(grouped[0].items).toHaveLength(2);
  });

  it('active assignments filter excludes fully completed ones', () => {
    const grouped = groupByAssignment(recipients);
    const active = grouped.filter(a => {
      const allDone = a.items.every(i => i.status === 'completed' || i.status === 'cleared');
      return !allDone;
    });
    expect(active).toHaveLength(2); // a1 has one incomplete item; a2 is fully assigned
  });

  it('completion percentage correct for mixed-status assignment', () => {
    const grouped = groupByAssignment(recipients);
    const a1 = grouped[0];
    const done = a1.items.filter(i => i.status === 'completed').length;
    const total = a1.items.length;
    expect(Math.round((done / total) * 100)).toBe(50);
  });
});

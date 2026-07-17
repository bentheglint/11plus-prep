import {
  deriveProgressCardData,
  deriveClickedTopics,
  deriveSubjectImprovement,
  shouldShowProgressCard,
  progressCardTitle,
  londonDateString,
  PROGRESS_CARD_WINDOW_DAYS,
  MIN_PRACTICE_DAYS_TO_SHOW,
  MAX_CLICKED_TOPICS,
  MIN_SUBJECT_WINDOW_ATTEMPTS,
  MIN_PREVIOUS_WINDOW_ACCURACY,
  MIN_RELATIVE_IMPROVEMENT,
} from './progressCard';

function qr(date, topicKey = 'percentages') {
  return { date, topicKey, subject: 'maths', correct: true, questionId: 1 };
}

const ALLOWED_KEYS = ['firstName', 'questionsAnswered', 'daysPractised', 'topicsExplored', 'clickedTopics', 'subjectImprovement'];
const FORBIDDEN_KEYS = ['score', 'accuracy', 'percentage', 'readiness', 'readinessBand', 'rank', 'weakTopic', 'weakTopics', 'surname'];

describe('deriveProgressCardData — forbidden fields', () => {
  it('with no qualifying growth data, the object contains ONLY the four base fields', () => {
    // No history at all: nothing can cross a mastery star threshold, and no
    // subject can meet the >=30-attempts-per-window bar.
    const result = deriveProgressCardData([], 'Evie', {
      now: new Date('2026-07-15T12:00:00Z'),
    });
    expect(Object.keys(result).sort()).toEqual(
      ['firstName', 'questionsAnswered', 'daysPractised', 'topicsExplored'].sort()
    );
  });

  it('every key present is drawn from the allowed set, even when growth data DOES qualify', () => {
    const now = new Date('2026-07-30T12:00:00Z');
    // 20 recent correct answers on a fresh topic — qualifies clickedTopics.
    const results = Array.from({ length: 20 }, (_, i) => qr(
      new Date(now.getTime() - (i + 1) * 60 * 60 * 1000).toISOString(), // hours apart, all <7 days old
      'fractions'
    ));
    const result = deriveProgressCardData(results, 'Evie', { now });
    for (const key of Object.keys(result)) {
      expect(ALLOWED_KEYS).toContain(key);
    }
  });

  it('never carries score, accuracy, percentage, readiness, rank, weak-topic, or surname data', () => {
    // Feed in question results that DO carry ability-shaped fields (score,
    // percentage, isCorrect breakdowns) to prove the derivation discards
    // them rather than merely "happening" not to read them.
    const richResults = [
      { date: '2026-07-01T10:00:00Z', topicKey: 'algebra', correct: true, score: 9, percentage: 95, readinessBand: 'exceeding', rank: 1, weakTopics: ['fractions'] },
    ];
    const result = deriveProgressCardData(richResults, 'Amara Okafor', {
      now: new Date('2026-07-15T12:00:00Z'),
    });
    for (const key of FORBIDDEN_KEYS) {
      expect(result).not.toHaveProperty(key);
    }
    // Surname-shaped data must not leak even via firstName — the caller is
    // responsible for passing a first name only, but prove the function
    // itself doesn't fabricate or append anything to it.
    expect(result.firstName).toBe('Amara Okafor');
  });

  it('subjectImprovement, when present, is never a negative or zero delta', () => {
    // A subject that got WORSE across the two windows must never surface —
    // deriveSubjectImprovement should simply omit it (return null), and
    // deriveProgressCardData must never attach a subjectImprovement key
    // carrying a non-positive upPercent.
    const now = new Date('2026-07-30T12:00:00Z');
    const results = [];
    // Previous window: 30 attempts, 90% correct (strong).
    for (let i = 0; i < 30; i++) {
      results.push({ date: new Date(now.getTime() - (31 + i * 0.9) * 24 * 60 * 60 * 1000).toISOString(), topicKey: 'percentages', correct: i < 27 });
    }
    // This window: 30 attempts, 40% correct (declined).
    for (let i = 0; i < 30; i++) {
      results.push({ date: new Date(now.getTime() - (1 + i * 0.9) * 24 * 60 * 60 * 1000).toISOString(), topicKey: 'percentages', correct: i < 12 });
    }
    const result = deriveProgressCardData(results, 'Evie', { now });
    expect(result.subjectImprovement).toBeUndefined();
    if ('subjectImprovement' in result) {
      expect(result.subjectImprovement.upPercent).toBeGreaterThan(0);
    }
  });
});

describe('deriveClickedTopics — mastery star-crossing within the window', () => {
  const NOW = new Date('2026-07-30T12:00:00Z');

  function resultAt(daysAgo, topicKey, correct) {
    return { date: new Date(NOW.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(), topicKey, correct };
  }

  it('reports a topic that went from no history to a real mastery star within the window', () => {
    // 20 correct answers, ~2 days old (full recency, full volume) => score
    // 100 => 5 stars. Nothing before the window => 0 stars before. Crossed.
    const results = Array.from({ length: 20 }, () => resultAt(2, 'fractions', true));
    const names = deriveClickedTopics(results, { now: NOW });
    expect(names).toContain('Fractions');
  });

  it('does NOT report a topic that only decayed (stars went down, not up)', () => {
    // 20 correct answers dated 40 days ago: as of the window start (30 days
    // ago) this topic reads as fresh (daysSince=10 => high score/stars); as
    // of now it has decayed further (daysSince=40 => lower stars). A
    // decay-only change must never read as "clicked".
    const results = Array.from({ length: 20 }, () => resultAt(40, 'percentages', true));
    const names = deriveClickedTopics(results, { now: NOW });
    expect(names).not.toContain('Percentages');
  });

  it('ignores rows with no topicKey or unparseable dates', () => {
    const results = [
      { date: NOW.toISOString(), topicKey: null, correct: true },
      { date: 'not-a-date', topicKey: 'algebra', correct: true },
    ];
    expect(deriveClickedTopics(results, { now: NOW })).toEqual([]);
  });

  it('caps at MAX_CLICKED_TOPICS (3), ranked by the size of the star jump', () => {
    expect(MAX_CLICKED_TOPICS).toBe(3);
    const build = (topicKey, correctCount) =>
      Array.from({ length: 20 }, (_, i) => resultAt(2, topicKey, i < correctCount));
    const results = [
      ...build('fractions', 20),  // 100% => 5 stars (delta 5)
      ...build('algebra', 16),    // 80%  => 4 stars (delta 4)
      ...build('ratio', 12),      // 60%  => 3 stars (delta 3)
      ...build('decimals', 7),    // 35%  => 2 stars (delta 2)
    ];
    const names = deriveClickedTopics(results, { now: NOW });
    expect(names).toHaveLength(3);
    expect(names).toEqual(['Fractions', 'Algebra', 'Ratio & Proportion']);
  });
});

describe('deriveSubjectImprovement — relative accuracy delta, this window vs previous', () => {
  const NOW = new Date('2026-07-30T12:00:00Z');

  // spreads `total` rows evenly across (daysAgoMin, daysAgoMax), the first
  // `correctCount` of them marked correct.
  function windowResults(topicKey, total, correctCount, daysAgoMin, daysAgoMax) {
    return Array.from({ length: total }, (_, i) => {
      const daysAgo = daysAgoMin + (i / total) * (daysAgoMax - daysAgoMin);
      return { date: new Date(NOW.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(), topicKey, correct: i < correctCount };
    });
  }

  it('qualifies a subject that improved >=10% relative, with >=30 attempts in both windows and prev accuracy >=30%', () => {
    expect(MIN_SUBJECT_WINDOW_ATTEMPTS).toBe(30);
    expect(MIN_PREVIOUS_WINDOW_ACCURACY).toBeCloseTo(0.30);
    expect(MIN_RELATIVE_IMPROVEMENT).toBeCloseTo(0.10);

    const improved = [
      ...windowResults('percentages', 30, 18, 0.5, 29.5),  // this window: 60% correct
      ...windowResults('percentages', 30, 12, 30.5, 59.5), // prev window: 40% correct
    ];
    const result = deriveSubjectImprovement(improved, { now: NOW });
    expect(result).toEqual({ subject: 'Maths', upPercent: 50 }); // (0.6-0.4)/0.4 = 50%
  });

  it('excludes a subject whose PREVIOUS-window accuracy is below the 30% floor, however large the jump', () => {
    const results = [
      ...windowResults('percentages', 30, 27, 0.5, 29.5),   // this: 90% correct
      ...windowResults('percentages', 30, 6, 30.5, 59.5),   // prev: 20% correct (below floor)
    ];
    expect(deriveSubjectImprovement(results, { now: NOW })).toBeNull();
  });

  it('excludes a subject with fewer than 30 attempts in either window', () => {
    const results = [
      ...windowResults('percentages', 20, 18, 0.5, 29.5),   // this: only 20 attempts
      ...windowResults('percentages', 30, 12, 30.5, 59.5),  // prev: 30 attempts, 40%
    ];
    expect(deriveSubjectImprovement(results, { now: NOW })).toBeNull();
  });

  it('excludes an improvement below the 10% relative floor', () => {
    const results = [
      ...windowResults('percentages', 30, 16, 0.5, 29.5),   // this: ~53.3%
      ...windowResults('percentages', 30, 15, 30.5, 59.5),  // prev: 50%
    ];
    // relative improvement = (0.5333-0.5)/0.5 = 6.7% < 10% floor
    expect(deriveSubjectImprovement(results, { now: NOW })).toBeNull();
  });

  it('picks the single best-qualifying subject when more than one qualifies', () => {
    const results = [
      // Maths: 40% -> 60% (+50% relative)
      ...windowResults('percentages', 30, 18, 0.5, 29.5),
      ...windowResults('percentages', 30, 12, 30.5, 59.5),
      // English: 40% -> 50% (+25% relative) — qualifies, but less than Maths
      ...windowResults('comprehension', 30, 15, 0.5, 29.5),
      ...windowResults('comprehension', 30, 12, 30.5, 59.5),
    ];
    const result = deriveSubjectImprovement(results, { now: NOW });
    expect(result.subject).toBe('Maths');
    expect(result.upPercent).toBe(50);
  });

  it('returns null when nothing qualifies (e.g. no data at all)', () => {
    expect(deriveSubjectImprovement([], { now: NOW })).toBeNull();
  });
});

describe('deriveProgressCardData — 30-day rolling window', () => {
  const NOW = new Date('2026-07-30T12:00:00Z');

  it('counts questions inside the window and excludes those outside it', () => {
    const results = [
      qr('2026-07-29T10:00:00Z'), // 1 day ago — in
      qr('2026-07-01T10:00:00Z'), // 29 days ago — in
      qr('2026-06-01T10:00:00Z'), // ~59 days ago — out
      qr('2026-08-01T10:00:00Z'), // in the future — out
    ];
    const result = deriveProgressCardData(results, 'Evie', { now: NOW });
    expect(result.questionsAnswered).toBe(2);
  });

  it('defaults the window to PROGRESS_CARD_WINDOW_DAYS = 30', () => {
    expect(PROGRESS_CARD_WINDOW_DAYS).toBe(30);
  });

  it('ignores malformed/missing dates without throwing', () => {
    const results = [
      { date: null, topicKey: 'algebra' },
      { date: 'not-a-date', topicKey: 'algebra' },
      {},
      qr('2026-07-29T10:00:00Z'),
    ];
    const result = deriveProgressCardData(results, 'Evie', { now: NOW });
    expect(result.questionsAnswered).toBe(1);
  });

  it('handles an empty or missing questionResults array gracefully', () => {
    expect(deriveProgressCardData([], 'Evie', { now: NOW })).toEqual({
      firstName: 'Evie', questionsAnswered: 0, daysPractised: 0, topicsExplored: 0,
    });
    expect(deriveProgressCardData(null, 'Evie', { now: NOW })).toEqual({
      firstName: 'Evie', questionsAnswered: 0, daysPractised: 0, topicsExplored: 0,
    });
  });
});

describe('deriveProgressCardData — daysPractised (distinct London calendar days)', () => {
  const NOW = new Date('2026-07-30T12:00:00Z');

  it('counts distinct calendar days, not distinct questions', () => {
    const results = [
      qr('2026-07-10T09:00:00Z'),
      qr('2026-07-10T15:00:00Z'), // same day, second question
      qr('2026-07-12T09:00:00Z'),
    ];
    const result = deriveProgressCardData(results, 'Evie', { now: NOW });
    expect(result.questionsAnswered).toBe(3);
    expect(result.daysPractised).toBe(2);
  });
});

describe('deriveProgressCardData — topicsExplored (distinct topic keys)', () => {
  const NOW = new Date('2026-07-30T12:00:00Z');

  it('counts distinct topic keys attempted, ignoring rows with no topicKey', () => {
    const results = [
      qr('2026-07-10T09:00:00Z', 'percentages'),
      qr('2026-07-11T09:00:00Z', 'percentages'), // repeat topic
      qr('2026-07-12T09:00:00Z', 'algebra'),
      { date: '2026-07-13T09:00:00Z', topicKey: null },
    ];
    const result = deriveProgressCardData(results, 'Evie', { now: NOW });
    expect(result.topicsExplored).toBe(2);
  });
});

describe('londonDateString — DST boundary correctness', () => {
  it('BST (summer): a late-evening local practice session lands on the correct NEXT calendar day, not the naive UTC day', () => {
    // 2026-07-15T23:30:00Z in BST (UTC+1) reads as 2026-07-16 00:30 local.
    // A naive `.slice(0, 10)` on the UTC string would give 2026-07-15.
    expect(londonDateString('2026-07-15T23:30:00Z')).toBe('2026-07-16');
  });

  it('GMT (winter): the same clock-time UTC string lands on the SAME calendar day (no BST offset in effect)', () => {
    // 2026-01-15T23:30:00Z in GMT (UTC+0) reads as 2026-01-15 23:30 local —
    // no cross-midnight shift, proving the function isn't hardcoding a
    // permanent +1 offset.
    expect(londonDateString('2026-01-15T23:30:00Z')).toBe('2026-01-15');
  });

  it('spring-forward weekend (2026-03-29): correctly buckets a practice session either side of the transition', () => {
    // Transition is 2026-03-29 01:00 UTC (clocks 01:00 GMT -> 02:00 BST).
    // Just before, still GMT:
    expect(londonDateString('2026-03-29T00:30:00Z')).toBe('2026-03-29');
    // Just after, now BST — 01:30 UTC reads as 02:30 local, still the 29th:
    expect(londonDateString('2026-03-29T01:30:00Z')).toBe('2026-03-29');
  });

  it('autumn-transition weekend (2026-10-25): a late-BST-evening session on the 24th correctly buckets into the 25th', () => {
    // Transition is 2026-10-25 01:00 UTC (clocks 02:00 BST -> 01:00 GMT).
    // At 2026-10-24T23:30:00Z we are still BEFORE the transition, so still
    // BST (UTC+1): local time is 2026-10-25 00:30 — a genuine cross-midnight
    // case landing in the NEXT calendar day, which a naive UTC-string split
    // (giving "2026-10-24") would get wrong.
    expect(londonDateString('2026-10-24T23:30:00Z')).toBe('2026-10-25');
  });

  it('returns null for an unparseable date rather than throwing', () => {
    expect(londonDateString('not-a-real-date')).toBeNull();
  });
});

describe('shouldShowProgressCard — minimum practice-day threshold', () => {
  it('is false below the threshold (an empty card is a sad card)', () => {
    expect(shouldShowProgressCard({ daysPractised: 0 })).toBe(false);
    expect(shouldShowProgressCard({ daysPractised: MIN_PRACTICE_DAYS_TO_SHOW - 1 })).toBe(false);
  });

  it('is true at and above the threshold', () => {
    expect(shouldShowProgressCard({ daysPractised: MIN_PRACTICE_DAYS_TO_SHOW })).toBe(true);
    expect(shouldShowProgressCard({ daysPractised: MIN_PRACTICE_DAYS_TO_SHOW + 10 })).toBe(true);
  });

  it('is false for null/undefined card data', () => {
    expect(shouldShowProgressCard(null)).toBe(false);
    expect(shouldShowProgressCard(undefined)).toBe(false);
  });
});

describe('progressCardTitle — seasonal skin', () => {
  it('uses the Summer of Prep title June through September inclusive', () => {
    expect(progressCardTitle('Evie', { now: new Date('2026-06-01T12:00:00Z') })).toBe('Evie’s Summer of Prep');
    expect(progressCardTitle('Evie', { now: new Date('2026-07-15T12:00:00Z') })).toBe('Evie’s Summer of Prep');
    expect(progressCardTitle('Evie', { now: new Date('2026-09-30T12:00:00Z') })).toBe('Evie’s Summer of Prep');
  });

  it('uses the neutral title outside June-September', () => {
    expect(progressCardTitle('Evie', { now: new Date('2026-10-01T12:00:00Z') })).toBe('Evie’s month of prep');
    expect(progressCardTitle('Evie', { now: new Date('2026-01-15T12:00:00Z') })).toBe('Evie’s month of prep');
  });

  it('uses a typographic (curly) apostrophe in the possessive, never the straight ASCII quote', () => {
    const title = progressCardTitle('Evie', { now: new Date('2026-07-01T12:00:00Z') });
    expect(title).toContain('’');
    expect(title).not.toContain("'");
  });

  it('supports the "My child" name toggle, capitalised because it opens the title line', () => {
    expect(progressCardTitle('My child', { now: new Date('2026-07-01T12:00:00Z') })).toBe('My child’s Summer of Prep');
    expect(progressCardTitle('My child', { now: new Date('2026-01-15T12:00:00Z') })).toBe('My child’s month of prep');
  });

  it('falls back to a capitalised "My child" if no firstName is given', () => {
    expect(progressCardTitle(null, { now: new Date('2026-07-01T12:00:00Z') })).toBe('My child’s Summer of Prep');
  });
});

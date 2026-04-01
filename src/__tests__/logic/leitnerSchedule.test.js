import { getNextReviewDate, isDue, getDueQuestions, INTERVALS } from '../../utils/leitnerSchedule';

describe('Leitner intervals', () => {
  it('has correct interval progression: 1, 3, 7, 14 days', () => {
    expect(INTERVALS).toEqual([1, 3, 7, 14]);
  });
});

describe('getNextReviewDate', () => {
  it('returns a date string for levels 0-3', () => {
    for (let level = 0; level < 4; level++) {
      const result = getNextReviewDate(level);
      expect(result).toBeTruthy();
      expect(new Date(result).getTime()).toBeGreaterThan(Date.now());
    }
  });

  it('returns null for level 4 (retired)', () => {
    expect(getNextReviewDate(4)).toBeNull();
  });

  it('returns null for levels above 4', () => {
    expect(getNextReviewDate(5)).toBeNull();
    expect(getNextReviewDate(100)).toBeNull();
  });

  it('level 0 is due in 1 day', () => {
    const result = new Date(getNextReviewDate(0));
    const expected = new Date();
    expected.setDate(expected.getDate() + 1);
    // Within 1 second tolerance
    expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(1000);
  });

  it('level 2 is due in 7 days', () => {
    const result = new Date(getNextReviewDate(2));
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);
    expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(1000);
  });
});

describe('isDue', () => {
  it('returns false for null/undefined entry', () => {
    expect(isDue(null)).toBe(false);
    expect(isDue(undefined)).toBe(false);
  });

  it('returns false for retired entries (level >= 4)', () => {
    expect(isDue({ level: 4, nextReview: '2020-01-01' })).toBe(false);
  });

  it('returns true when nextReview is missing', () => {
    expect(isDue({ level: 0 })).toBe(true);
  });

  it('returns true when nextReview is in the past', () => {
    expect(isDue({ level: 1, nextReview: '2020-01-01T00:00:00Z' })).toBe(true);
  });

  it('returns false when nextReview is in the future', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(isDue({ level: 1, nextReview: future.toISOString() })).toBe(false);
  });
});

describe('getDueQuestions', () => {
  const pastDate = '2020-01-01T00:00:00Z';
  const futureDate = new Date(Date.now() + 86400000 * 10).toISOString();

  const queue = [
    { questionId: 1, topicKey: 'fractions', subject: 'maths', level: 0, nextReview: pastDate },
    { questionId: 2, topicKey: 'algebra', subject: 'maths', level: 2, nextReview: pastDate },
    { questionId: 3, topicKey: 'spelling', subject: 'english', level: 1, nextReview: pastDate },
    { questionId: 4, topicKey: 'fractions', subject: 'maths', level: 0, nextReview: futureDate }, // not due
    { questionId: 5, topicKey: 'synonyms', subject: 'verbalreasoning', level: 4, nextReview: pastDate }, // retired
  ];

  it('returns only due items', () => {
    const due = getDueQuestions(queue);
    const ids = due.map(d => d.questionId);
    expect(ids).not.toContain(4); // future
    expect(ids).not.toContain(5); // retired
  });

  it('sorts by level ascending (most urgent first)', () => {
    const due = getDueQuestions(queue, null, 10);
    expect(due[0].level).toBeLessThanOrEqual(due[1].level);
  });

  it('filters by subject', () => {
    const mathsDue = getDueQuestions(queue, 'maths', 10);
    mathsDue.forEach(entry => {
      expect(entry.subject).toBe('maths');
    });
  });

  it('respects count limit', () => {
    const due = getDueQuestions(queue, null, 2);
    expect(due.length).toBeLessThanOrEqual(2);
  });

  it('defaults to count 3', () => {
    const due = getDueQuestions(queue);
    expect(due.length).toBeLessThanOrEqual(3);
  });

  it('handles empty/null queue', () => {
    expect(getDueQuestions(null)).toEqual([]);
    expect(getDueQuestions([])).toEqual([]);
  });
});

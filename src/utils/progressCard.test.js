import {
  deriveProgressCardData,
  shouldShowProgressCard,
  progressCardTitle,
  londonDateString,
  PROGRESS_CARD_WINDOW_DAYS,
  MIN_PRACTICE_DAYS_TO_SHOW,
} from './progressCard';

function qr(date, topicKey = 'percentages') {
  return { date, topicKey, subject: 'maths', correct: true, questionId: 1 };
}

describe('deriveProgressCardData — forbidden fields', () => {
  it('the returned object contains ONLY firstName, questionsAnswered, daysPractised, topicsExplored', () => {
    const result = deriveProgressCardData([qr('2026-07-01T10:00:00Z')], 'Evie', {
      now: new Date('2026-07-15T12:00:00Z'),
    });
    expect(Object.keys(result).sort()).toEqual(
      ['firstName', 'questionsAnswered', 'daysPractised', 'topicsExplored'].sort()
    );
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
    const forbidden = ['score', 'accuracy', 'percentage', 'readiness', 'readinessBand', 'rank', 'weakTopic', 'weakTopics', 'surname'];
    for (const key of forbidden) {
      expect(result).not.toHaveProperty(key);
    }
    // Surname-shaped data must not leak even via firstName — the caller is
    // responsible for passing a first name only, but prove the function
    // itself doesn't fabricate or append anything to it.
    expect(result.firstName).toBe('Amara Okafor');
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
    expect(progressCardTitle('Evie', { now: new Date('2026-06-01T12:00:00Z') })).toBe("Evie's Summer of Prep");
    expect(progressCardTitle('Evie', { now: new Date('2026-07-15T12:00:00Z') })).toBe("Evie's Summer of Prep");
    expect(progressCardTitle('Evie', { now: new Date('2026-09-30T12:00:00Z') })).toBe("Evie's Summer of Prep");
  });

  it('uses the neutral title outside June-September', () => {
    expect(progressCardTitle('Evie', { now: new Date('2026-10-01T12:00:00Z') })).toBe("Evie's month of prep");
    expect(progressCardTitle('Evie', { now: new Date('2026-01-15T12:00:00Z') })).toBe("Evie's month of prep");
  });

  it('supports the "my child" name toggle', () => {
    expect(progressCardTitle('my child', { now: new Date('2026-07-01T12:00:00Z') })).toBe("my child's Summer of Prep");
  });

  it('falls back to "my child" if no firstName is given', () => {
    expect(progressCardTitle(null, { now: new Date('2026-07-01T12:00:00Z') })).toBe("my child's Summer of Prep");
  });
});

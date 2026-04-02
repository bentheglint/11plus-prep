/**
 * Mastery Scoring Tests (Testing Strategy 4.1)
 *
 * Tests the mastery scoring engine: accuracy × recency × volume,
 * star ratings, trends, and exam readiness.
 */

import { renderHook } from '@testing-library/react';
import useMastery, { getMasteryLevel, getReadinessBand } from '../../hooks/useMastery';

// Helper: create a question result
function makeResult(topicKey, correct, daysAgo = 0, difficulty = 2) {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return { topicKey, correct, date, difficulty, timeSpentMs: 30000 };
}

// Helper: create N results for a topic
function makeResults(topicKey, count, correctRate = 1.0, daysAgo = 0) {
  return Array.from({ length: count }, (_, i) => {
    const correct = i < Math.round(count * correctRate);
    return makeResult(topicKey, correct, daysAgo);
  });
}

describe('getMasteryLevel', () => {
  it('returns 0 stars for score 0', () => {
    expect(getMasteryLevel(0)).toMatchObject({ stars: 0, label: 'Not started' });
  });

  it('returns 1 star for scores 1-30', () => {
    expect(getMasteryLevel(1).stars).toBe(1);
    expect(getMasteryLevel(30).stars).toBe(1);
  });

  it('returns 2 stars for scores 31-55', () => {
    expect(getMasteryLevel(31).stars).toBe(2);
    expect(getMasteryLevel(55).stars).toBe(2);
  });

  it('returns 3 stars for scores 56-75', () => {
    expect(getMasteryLevel(56).stars).toBe(3);
    expect(getMasteryLevel(75).stars).toBe(3);
  });

  it('returns 4 stars for scores 76-89', () => {
    expect(getMasteryLevel(76).stars).toBe(4);
    expect(getMasteryLevel(89).stars).toBe(4);
  });

  it('returns 5 stars for scores 90+', () => {
    expect(getMasteryLevel(90).stars).toBe(5);
    expect(getMasteryLevel(100).stars).toBe(5);
  });
});

describe('getReadinessBand', () => {
  it('returns Building Foundations for low scores', () => {
    expect(getReadinessBand(0).band).toBe('Building Foundations');
    expect(getReadinessBand(35).band).toBe('Building Foundations');
  });

  it('returns Developing Well for mid scores', () => {
    expect(getReadinessBand(36).band).toBe('Developing Well');
    expect(getReadinessBand(60).band).toBe('Developing Well');
  });

  it('returns Exam Ready for good scores', () => {
    expect(getReadinessBand(61).band).toBe('Exam Ready');
    expect(getReadinessBand(80).band).toBe('Exam Ready');
  });

  it('returns Excelling for high scores', () => {
    expect(getReadinessBand(81).band).toBe('Excelling');
    expect(getReadinessBand(100).band).toBe('Excelling');
  });
});

describe('useMastery hook', () => {
  it('returns score 0 with no question results', () => {
    const { result } = renderHook(() => useMastery([], [], []));
    const mastery = result.current.getTopicMastery('percentages');
    expect(mastery.score).toBe(0);
    expect(mastery.stars).toBe(0);
    expect(mastery.totalQuestions).toBe(0);
  });

  it('score combines accuracy × volume correctly', () => {
    // 10 questions out of 20 volume ramp, 100% correct, today (recency 1.0)
    // Expected: 1.0 * 1.0 * (10/20) * 100 = 50
    const results = makeResults('percentages', 10, 1.0, 0);
    const { result } = renderHook(() => useMastery(results, [], []));
    const mastery = result.current.getTopicMastery('percentages');
    expect(mastery.score).toBe(50);
  });

  it('volume factor plateaus at 20 questions', () => {
    // 20 questions, 100% correct, today → score should be 100
    const results20 = makeResults('percentages', 20, 1.0, 0);
    const { result: r1 } = renderHook(() => useMastery(results20, [], []));
    expect(r1.current.getTopicMastery('percentages').score).toBe(100);

    // 40 questions, 100% correct, today → still 100 (uses last 30)
    const results40 = makeResults('percentages', 40, 1.0, 0);
    const { result: r2 } = renderHook(() => useMastery(results40, [], []));
    expect(r2.current.getTopicMastery('percentages').score).toBe(100);
  });

  it('recency decay reduces score for old practice', () => {
    // 20 questions, 100% correct, 10 days ago → recency 0.9 → score 90
    const results = makeResults('percentages', 20, 1.0, 10);
    const { result } = renderHook(() => useMastery(results, [], []));
    const mastery = result.current.getTopicMastery('percentages');
    expect(mastery.score).toBe(90);
  });

  it('recency decay at 20 days gives 0.75 factor', () => {
    const results = makeResults('percentages', 20, 1.0, 20);
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').score).toBe(75);
  });

  it('recency decay at 25 days gives 0.6 factor', () => {
    const results = makeResults('percentages', 20, 1.0, 25);
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').score).toBe(60);
  });

  it('recency decay at 30+ days gives 0.4 factor', () => {
    const results = makeResults('percentages', 20, 1.0, 35);
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').score).toBe(40);
  });

  it('trend is stable with fewer than 10 results', () => {
    const results = makeResults('percentages', 8, 1.0, 0);
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').trend.direction).toBe('stable');
  });

  it('trend is up when recent accuracy improves', () => {
    // Prev 10: 50% correct, Last 10: 90% correct → delta +40 → 'up'
    const prev10 = Array.from({ length: 10 }, (_, i) =>
      makeResult('percentages', i < 5, 5)
    );
    const last10 = Array.from({ length: 10 }, (_, i) =>
      makeResult('percentages', i < 9, 0)
    );
    const results = [...last10, ...prev10];
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').trend.direction).toBe('up');
  });

  it('trend is down when recent accuracy drops', () => {
    // Prev 10: 90% correct, Last 10: 40% correct → delta -50 → 'down'
    const prev10 = Array.from({ length: 10 }, (_, i) =>
      makeResult('percentages', i < 9, 5)
    );
    const last10 = Array.from({ length: 10 }, (_, i) =>
      makeResult('percentages', i < 4, 0)
    );
    const results = [...last10, ...prev10];
    const { result } = renderHook(() => useMastery(results, [], []));
    expect(result.current.getTopicMastery('percentages').trend.direction).toBe('down');
  });

  it('getAllMastery returns entries for all 38 topics', () => {
    const { result } = renderHook(() => useMastery([], [], []));
    const all = result.current.getAllMastery();
    expect(Object.keys(all).length).toBe(38);
  });

  it('getSubjectMastery averages across all subject topics', () => {
    // Only percentages has results → average diluted by 16 maths topics
    const results = makeResults('percentages', 20, 1.0, 0);
    const { result } = renderHook(() => useMastery(results, [], []));
    const mathsMastery = result.current.getSubjectMastery('maths');
    // 100 / 16 topics = 6.25 → rounded to 6
    expect(mathsMastery.score).toBe(6);
    expect(mathsMastery.topicsCovered).toBe(1);
    expect(mathsMastery.topicsTotal).toBe(16);
  });
});

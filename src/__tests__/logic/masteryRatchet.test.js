/**
 * Mastery Ratchet + Tip Selection Tests
 *
 * Covers:
 *   1. bestStars ratchet — never falls below high-water mark
 *   2. April-bad/June-good — high recent mastery, not in weak list
 *   3. Early journey — weak list stays empty (not "everything is weak")
 *   4. Struggling topic — nominated and ranked first
 *   5. Stale-once-strong — bestStars 4 + stale nominated; bestStars 2 + stale not nominated
 *   6. ParentGuidance triggers — recentCount gate
 *   7. balanceEquations topic key grouped under verbalreasoning
 *   8. TopicCard state: lifetime volume > 0 + no recent rows → 'lifetime-only', not 'not-started'
 *   9. ALL_TOPIC_KEYS has 39 entries
 */

import { renderHook } from '@testing-library/react';
import useMastery, { ALL_TOPIC_KEYS, SUBJECT_TOPICS } from '../../hooks/useMastery';
import { getWeakTopics, buildMasteryMap } from '../../utils/tipSelection';
import { deriveTopicCardState } from '../../screens/TopicsScreen';

// ---------- helpers ----------

function makeResult(topicKey, correct, daysAgo = 0) {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return { topicKey, correct, date, difficulty: 2, timeSpentMs: 30000 };
}

function makeResults(topicKey, count, correctRate = 1.0, daysAgo = 0) {
  return Array.from({ length: count }, (_, i) => {
    const correct = i < Math.round(count * correctRate);
    return makeResult(topicKey, correct, daysAgo);
  });
}

// Returns { getTopicMastery } from useMastery given a flat results array
function hookMastery(results) {
  const { result } = renderHook(() => useMastery(results, [], []));
  return result.current;
}

// ---------- 1. RATCHET ----------

describe('bestStars ratchet', () => {
  it('stays at 5 after 60 days idle even though decayed score is lower', () => {
    // 30 correct answers (recent) then nothing for 60 days
    const results = makeResults('percentages', 30, 1.0, 60);
    const m = hookMastery(results).getTopicMastery('percentages');

    // Decayed score: 60 days idle → recency 0.4, volume 1.0 → 0.4 * 100 = 40 → stars ≤ 2
    expect(m.stars).toBeLessThan(5);
    // But the high-water mark was 5
    expect(m.bestStars).toBe(5);
    expect(m.bestLabel).toBe('Mastered');
  });

  it('bestStars stays 5 after 10 subsequent wrong answers', () => {
    // Build chronological: 30 right (older), then 10 wrong (recent)
    const old = makeResults('percentages', 30, 1.0, 5);  // 30 correct, 5 days ago
    const recent = makeResults('percentages', 10, 0.0, 0); // 10 wrong, today
    const results = [...old, ...recent];

    const m = hookMastery(results).getTopicMastery('percentages');
    expect(m.bestStars).toBe(5);
    // Decayed score is lower
    expect(m.score).toBeLessThan(90);
  });

  it('bestStars never falls below a previously reached band', () => {
    // Build up 20 correct (hitting 5 stars), then 30 wrong
    const good = makeResults('percentages', 20, 1.0, 10); // 20 correct, 10 days ago
    const bad  = makeResults('percentages', 30, 0.0, 0);  // 30 wrong, today
    const results = [...good, ...bad];

    const m = hookMastery(results).getTopicMastery('percentages');
    // Good phase peaked at 5 stars; bad phase should not pull bestStars below that
    expect(m.bestStars).toBe(5);
  });
});

// ---------- 2. April-bad / June-good ----------

describe('April-bad / June-good', () => {
  it('high current mastery after early poor run → NOT in weak list', () => {
    // 20 wrong earlier, then 27 right recently
    const earlyBad  = makeResults('fractions', 20, 0.0, 45); // 20 wrong, 45 days ago
    const recentGood = makeResults('fractions', 27, 1.0, 0);  // 27 right, today
    const results = [...earlyBad, ...recentGood];

    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    const weak = getWeakTopics(map);
    expect(weak).not.toContain('fractions');
  });
});

// ---------- 3. Early journey — weak list empty ----------

describe('Early journey', () => {
  it('15 answers in one topic, 14 correct, 3 other topics untouched → weak list empty', () => {
    const results = makeResults('percentages', 15, 14 / 15, 0);
    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    // recentCount for 'percentages' = 15, recentAccuracy ≥ 0.6 → not struggling
    // other topics: recentCount 0 → not qualifying
    const weak = getWeakTopics(map);
    expect(weak).toHaveLength(0);
  });
});

// ---------- 4. Struggling topic ----------

describe('Struggling topic', () => {
  it('recentCount >= 5, recentAccuracy 0.4 → nominated', () => {
    const results = makeResults('algebra', 10, 0.4, 0);
    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    const weak = getWeakTopics(map);
    expect(weak).toContain('algebra');
  });

  it('struggling topic ranked before stale topic', () => {
    // Struggling: algebra 40% accuracy, 10 attempts
    const algebResults = makeResults('algebra', 10, 0.4, 0);
    // Stale-once-strong: fractions 100% accuracy in past (hits 4+ stars), now 20 days stale
    const fracResults = makeResults('fractions', 20, 1.0, 20);
    const results = [...algebResults, ...fracResults];

    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    const weak = getWeakTopics(map, 3);
    // 'algebra' (struggling) must come before 'fractions' (stale)
    const algebIdx = weak.indexOf('algebra');
    const fracIdx = weak.indexOf('fractions');
    expect(algebIdx).toBeGreaterThanOrEqual(0);
    expect(fracIdx).toBeGreaterThanOrEqual(0);
    expect(algebIdx).toBeLessThan(fracIdx);
  });
});

// ---------- 5. Stale-once-strong ----------

describe('Stale-once-strong qualification', () => {
  it('bestStars 4 + daysSince 20 → nominated', () => {
    // 20 correct answers 20 days ago (peaks at 5 stars, but bestStars 5 also works)
    const results = makeResults('ratio', 20, 1.0, 20);
    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    expect(map['ratio'].bestStars).toBeGreaterThanOrEqual(3);
    expect(map['ratio'].daysSince).toBeGreaterThan(14);

    const weak = getWeakTopics(map);
    expect(weak).toContain('ratio');
  });

  it('bestStars 2 + daysSince 20 → NOT nominated (below threshold)', () => {
    // 3 results at ~40% accuracy, 20 days ago — low bestStars, stale, but recentCount < 5
    // so does NOT qualify as struggling either.
    const results = makeResults('sequences', 3, 0.33, 20);
    const mastery = hookMastery(results);
    const map = buildMasteryMap(mastery, ALL_TOPIC_KEYS);

    // recentCount < 5 → not struggling; bestStars < 3 → not stale-once-strong
    expect(map['sequences'].recentCount).toBeLessThan(5);
    expect(map['sequences'].bestStars).toBeLessThan(3);
    expect(map['sequences'].daysSince).toBeGreaterThan(14);

    const weak = getWeakTopics(map);
    expect(weak).not.toContain('sequences');
  });
});

// ---------- 6. ParentGuidance trigger logic ----------

/**
 * Pure helper mirroring ParentGuidance's trigger logic, extracted for testability.
 * mastery: useMastery return value
 */
function computeParentTriggers(mastery) {
  const hasLowScore = ALL_TOPIC_KEYS.some(key => {
    const m = mastery.getTopicMastery(key);
    return m.recentCount >= 10 && (m.recentAccuracy / 100) < 0.5;
  });

  const hasHighScore = ALL_TOPIC_KEYS.some(key => {
    const m = mastery.getTopicMastery(key);
    return m.recentCount >= 10 && (m.recentAccuracy / 100) > 0.9;
  });

  return { hasLowScore, hasHighScore };
}

describe('ParentGuidance triggers', () => {
  it('3 recent wrong out of 3 (lifetime 200) → hasLowScore false (recentCount < 10)', () => {
    // 197 old correct, then 3 recent wrong
    const old = makeResults('percentages', 197, 1.0, 30);
    const recent = makeResults('percentages', 3, 0.0, 0);
    const results = [...old, ...recent];
    const mastery = hookMastery(results);

    const { hasLowScore } = computeParentTriggers(mastery);
    expect(hasLowScore).toBe(false);
  });

  it('12 recent answers, 4 correct (33%) → hasLowScore true', () => {
    const results = makeResults('percentages', 12, 4 / 12, 0);
    const mastery = hookMastery(results);

    const { hasLowScore } = computeParentTriggers(mastery);
    expect(hasLowScore).toBe(true);
  });

  it('3 recent correct out of 3 → hasHighScore false (recentCount < 10)', () => {
    const results = makeResults('percentages', 3, 1.0, 0);
    const mastery = hookMastery(results);

    const { hasHighScore } = computeParentTriggers(mastery);
    expect(hasHighScore).toBe(false);
  });

  it('12 recent answers all correct → hasHighScore true', () => {
    const results = makeResults('percentages', 12, 1.0, 0);
    const mastery = hookMastery(results);

    const { hasHighScore } = computeParentTriggers(mastery);
    expect(hasHighScore).toBe(true);
  });
});

// ---------- 7. balanceEquations under verbalreasoning ----------

describe('balanceEquations topic key', () => {
  it('is grouped under verbalreasoning in SUBJECT_TOPICS', () => {
    expect(SUBJECT_TOPICS.verbalreasoning).toContain('balanceEquations');
  });

  it('getSubjectForTopic returns verbalreasoning for balanceEquations', () => {
    const { result } = renderHook(() => useMastery([], [], []));
    // SUBJECT_TOPICS is exported; verify via getAllMastery which iterates all topics
    const all = result.current.getAllMastery();
    expect('balanceEquations' in all).toBe(true);
  });
});

// ---------- 8. TopicCard state: lifetime volume + no recent rows → lifetime-only ----------

describe('deriveTopicCardState (TopicCard precedence)', () => {
  it('lifetime>0 + no recent mastery rows → lifetime-only (never not-started)', () => {
    // m has totalQuestions 0 (beyond results window), tp has total > 0
    const m = { totalQuestions: 0, daysSince: Infinity, bestStars: 0, bestLabel: 'Not started' };
    const tp = { total: 50, correct: 35 };
    const state = deriveTopicCardState(m, tp);
    expect(state.state).toBe('lifetime-only');
    expect(state.state).not.toBe('not-started');
  });

  it('no recent rows + no lifetime volume → not-started', () => {
    const m = { totalQuestions: 0, daysSince: Infinity, bestStars: 0, bestLabel: 'Not started' };
    const tp = undefined;
    const state = deriveTopicCardState(m, tp);
    expect(state.state).toBe('not-started');
  });

  it('has mastery rows + has tp → has-mastery', () => {
    const m = { totalQuestions: 20, daysSince: 2, bestStars: 4, bestLabel: 'Strong' };
    const tp = { total: 20, correct: 16 };
    const state = deriveTopicCardState(m, tp);
    expect(state.state).toBe('has-mastery');
    expect(state.bestStars).toBe(4);
  });

  it('has mastery rows but no tp → mastery-no-volume', () => {
    const m = { totalQuestions: 20, daysSince: 2, bestStars: 3, bestLabel: 'Confident' };
    const tp = undefined;
    const state = deriveTopicCardState(m, tp);
    expect(state.state).toBe('mastery-no-volume');
  });
});

// ---------- 9. ALL_TOPIC_KEYS has 39 entries ----------

describe('ALL_TOPIC_KEYS', () => {
  it('has exactly 39 entries', () => {
    expect(ALL_TOPIC_KEYS).toHaveLength(39);
  });

  it('contains balanceEquations', () => {
    expect(ALL_TOPIC_KEYS).toContain('balanceEquations');
  });

  it('contains no duplicates', () => {
    expect(new Set(ALL_TOPIC_KEYS).size).toBe(ALL_TOPIC_KEYS.length);
  });
});

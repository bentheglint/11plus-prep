import { selectWeightedTopics } from '../../utils/spacedRepetition';

// Mock mastery object that returns controlled data
function createMockMastery(topicData) {
  return {
    getTopicMastery: (key) => topicData[key] || null,
  };
}

describe('selectWeightedTopics', () => {
  const topics = ['fractions', 'algebra', 'percentages', 'ratio', 'decimals'];

  it('returns requested count of topics', () => {
    const mastery = createMockMastery({});
    const result = selectWeightedTopics(topics, mastery, 3);
    expect(result.length).toBe(3);
  });

  it('never returns more topics than available', () => {
    const mastery = createMockMastery({});
    const result = selectWeightedTopics(topics, mastery, 20);
    expect(result.length).toBe(topics.length);
  });

  it('returns no duplicates', () => {
    const mastery = createMockMastery({});
    const result = selectWeightedTopics(topics, mastery, 5);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it('only returns topics from the input list', () => {
    const mastery = createMockMastery({});
    const result = selectWeightedTopics(topics, mastery, 5);
    result.forEach(topic => {
      expect(topics).toContain(topic);
    });
  });

  it('falls back to random when mastery is null', () => {
    const result = selectWeightedTopics(topics, null, 3);
    expect(result.length).toBe(3);
    result.forEach(topic => {
      expect(topics).toContain(topic);
    });
  });

  it('handles empty topic list', () => {
    const mastery = createMockMastery({});
    const result = selectWeightedTopics([], mastery, 3);
    expect(result).toEqual([]);
  });

  // Weight behaviour: never-attempted topics get highest priority (330)
  it('favours never-attempted topics', () => {
    // Run 100 times: the never-attempted topic should appear far more often
    const mastery = createMockMastery({
      fractions: { score: 90, daysSince: 1, trend: { direction: 'up' }, totalQuestions: 50 },
      algebra: { score: 85, daysSince: 2, trend: { direction: 'up' }, totalQuestions: 40 },
      percentages: { score: 80, daysSince: 1, trend: { direction: 'stable' }, totalQuestions: 30 },
      ratio: { score: 75, daysSince: 3, trend: { direction: 'stable' }, totalQuestions: 25 },
      // decimals: not in mastery = never attempted = weight 330
    });

    let decimalsPicked = 0;
    for (let i = 0; i < 100; i++) {
      const result = selectWeightedTopics(topics, mastery, 1);
      if (result[0] === 'decimals') decimalsPicked++;
    }
    // With weight 330 vs ~20-30 for others, decimals should be picked >50% of the time
    expect(decimalsPicked).toBeGreaterThan(40);
  });

  // Weight behaviour: stale topics (>14 days) get 2.5x boost
  it('favours stale topics over recently practised ones', () => {
    const mastery = createMockMastery({
      fractions: { score: 50, daysSince: 1, trend: { direction: 'stable' }, totalQuestions: 20 },
      algebra: { score: 50, daysSince: 20, trend: { direction: 'stable' }, totalQuestions: 20 }, // stale
    });

    let algebraPicked = 0;
    for (let i = 0; i < 100; i++) {
      const result = selectWeightedTopics(['fractions', 'algebra'], mastery, 1);
      if (result[0] === 'algebra') algebraPicked++;
    }
    // algebra (stale) should be picked much more often than fractions
    expect(algebraPicked).toBeGreaterThan(55);
  });

  // Weight behaviour: declining trend gets 1.8x boost
  it('favours declining topics', () => {
    const mastery = createMockMastery({
      fractions: { score: 50, daysSince: 3, trend: { direction: 'stable' }, totalQuestions: 20 },
      algebra: { score: 50, daysSince: 3, trend: { direction: 'down' }, totalQuestions: 20 }, // declining
    });

    let algebraPicked = 0;
    for (let i = 0; i < 100; i++) {
      const result = selectWeightedTopics(['fractions', 'algebra'], mastery, 1);
      if (result[0] === 'algebra') algebraPicked++;
    }
    expect(algebraPicked).toBeGreaterThan(55);
  });

  // Floor weight: even mastered topics can be selected (weight >= 5)
  it('does not completely exclude mastered topics', () => {
    const mastery = createMockMastery({
      fractions: { score: 95, daysSince: 1, trend: { direction: 'up' }, totalQuestions: 100 },
    });

    let picked = 0;
    for (let i = 0; i < 200; i++) {
      const result = selectWeightedTopics(['fractions', 'algebra'], mastery, 1);
      if (result[0] === 'fractions') picked++;
    }
    // fractions has low weight but floor of 5, so should still appear sometimes
    expect(picked).toBeGreaterThan(0);
  });
});

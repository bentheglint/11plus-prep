// Mastery-weighted topic selection for Daily Learning
// Replaces pure random selection with probabilistic weighting
// that favours weak, decaying, and untried topics while preserving variety

/**
 * Calculate a weight for a topic based on mastery data.
 * Higher weight = more likely to be selected.
 */
function calculateTopicWeight(masteryData) {
  if (!masteryData || masteryData.totalQuestions === 0) {
    // Never tried — highest priority
    return 330; // equivalent to (110 - 0) * 3.0
  }

  const { score, daysSince, trend, totalQuestions } = masteryData;

  // Base: inverse of mastery score (weak topics get higher weight)
  let weight = 110 - score; // range 10-110, never zero

  // Recency boost: topics not practised recently get large boost
  if (daysSince > 14) {
    weight *= 2.5; // stale — needs revisiting
  } else if (daysSince > 7) {
    weight *= 1.5; // aging
  }

  // Declining trend boost
  if (trend && trend.direction === 'down') {
    weight *= 1.8;
  }

  // Low volume boost (< 10 questions attempted but > 0)
  if (totalQuestions < 10) {
    weight *= 1.4;
  }

  // Floor: every topic gets at least weight 5 for variety
  return Math.max(weight, 5);
}

/**
 * Weighted random sampling without replacement.
 * Picks `count` items from `items` proportional to their weights.
 */
function weightedSampleWithoutReplacement(items, weights, count) {
  const selected = [];
  const remaining = items.map((item, i) => ({ item, weight: weights[i] }));

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;

    let chosen = remaining.length - 1; // fallback
    for (let j = 0; j < remaining.length; j++) {
      random -= remaining[j].weight;
      if (random <= 0) {
        chosen = j;
        break;
      }
    }

    selected.push(remaining[chosen].item);
    remaining.splice(chosen, 1);
  }

  return selected;
}

/**
 * Select topics for Daily Learning, weighted by mastery.
 * Weak, decaying, and untried topics appear more frequently
 * but every topic has a chance of appearing (variety preserved).
 *
 * @param {string[]} topicKeys - All available topic keys for the subject
 * @param {object} mastery - The mastery object from useMastery hook
 * @param {number} count - Number of topics to select (default 10)
 * @returns {string[]} Selected topic keys
 */
export function selectWeightedTopics(topicKeys, mastery, count = 10) {
  if (!mastery || !topicKeys.length) {
    // Fallback to random if no mastery data
    const shuffled = [...topicKeys].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  const weights = topicKeys.map(key => {
    const m = mastery.getTopicMastery(key);
    return calculateTopicWeight(m);
  });

  return weightedSampleWithoutReplacement(topicKeys, weights, Math.min(count, topicKeys.length));
}

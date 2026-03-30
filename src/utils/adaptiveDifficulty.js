// Adaptive difficulty algorithm for quiz sessions
// Adjusts question difficulty based on rolling accuracy
// Target: ~80% success rate (Rosenshine's optimal challenge point)

/**
 * Determine the next question's target difficulty based on recent performance.
 * Uses a sliding window of the last 4 answers.
 *
 * @param {Array<{correct: boolean, difficulty: number}>} recentResults - Recent answer history
 * @param {number} currentDifficulty - Current difficulty level (1, 2, or 3)
 * @returns {number} Target difficulty for next question (1, 2, or 3)
 */
export function getAdaptiveDifficulty(recentResults, currentDifficulty = 2) {
  // Need at least 2 results before adapting
  const window = recentResults.slice(-4);
  if (window.length < 2) return currentDifficulty;

  const correctCount = window.filter(r => r.correct).length;
  const accuracy = correctCount / window.length;

  // Step up if doing well (≥75% correct in window)
  if (accuracy >= 0.75 && currentDifficulty < 3) {
    return currentDifficulty + 1;
  }

  // Step down if struggling (≤25% correct in window)
  if (accuracy <= 0.25 && currentDifficulty > 1) {
    return currentDifficulty - 1;
  }

  // Stay at current level
  return currentDifficulty;
}

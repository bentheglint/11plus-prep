// Leitner spaced repetition scheduling
// Level 0: review in 1 day, Level 1: 3 days, Level 2: 7 days, Level 3: 14 days, Level 4: retired

const INTERVALS = [1, 3, 7, 14]; // days per level

/**
 * Calculate the next review date for a given Leitner level.
 * @param {number} level - Current level (0-3). Level 4+ = retired.
 * @returns {string|null} ISO date string for next review, or null if retired
 */
export function getNextReviewDate(level) {
  if (level >= INTERVALS.length) return null; // retired
  const date = new Date();
  date.setDate(date.getDate() + INTERVALS[level]);
  return date.toISOString();
}

/**
 * Check if a queue entry is due for review.
 * @param {object} entry - Leitner queue entry
 * @returns {boolean}
 */
export function isDue(entry) {
  if (!entry || entry.level >= INTERVALS.length) return false;
  if (!entry.nextReview) return true;
  return new Date(entry.nextReview) <= new Date();
}

/**
 * Get due questions from the queue, sorted by urgency.
 * @param {Array} queue - Full Leitner queue
 * @param {string} [subject] - Optional subject filter
 * @param {number} [count] - Max items to return
 * @returns {Array} Due entries sorted by level (lowest first), then oldest nextReview
 */
export function getDueQuestions(queue, subject, count = 3) {
  const due = (queue || [])
    .filter(entry => isDue(entry) && (!subject || entry.subject === subject));

  due.sort((a, b) => {
    // Lower level = more urgent
    if (a.level !== b.level) return a.level - b.level;
    // Oldest review date first
    return new Date(a.nextReview || 0) - new Date(b.nextReview || 0);
  });

  return due.slice(0, count);
}

export { INTERVALS };

import { useCallback } from 'react';
import { getNextReviewDate } from '../utils/leitnerSchedule';

/**
 * Leitner queue management hook.
 * Manages a spaced repetition queue where wrong answers are added
 * and promoted through levels as they're answered correctly.
 *
 * Queue entry shape:
 * {
 *   questionId: number,
 *   topicKey: string,
 *   subject: string,
 *   level: number (0-4, where 4 = retired),
 *   lastReviewed: string (ISO date),
 *   nextReview: string (ISO date),
 *   timesCorrect: number,
 *   timesIncorrect: number,
 * }
 */
export default function useLeitner(leitnerQueue, saveLeitnerQueue) {
  /**
   * Add a question to the review queue (or reset it to level 0 if already there).
   */
  const addToQueue = useCallback((questionId, topicKey, subject) => {
    const queue = [...(leitnerQueue || [])];
    const existingIdx = queue.findIndex(
      e => e.questionId === questionId && e.topicKey === topicKey
    );

    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      // Already in queue — reset to level 0
      queue[existingIdx] = {
        ...queue[existingIdx],
        level: 0,
        lastReviewed: now,
        nextReview: getNextReviewDate(0),
        timesIncorrect: (queue[existingIdx].timesIncorrect || 0) + 1,
      };
    } else {
      // New entry
      queue.push({
        questionId,
        topicKey,
        subject,
        level: 0,
        lastReviewed: now,
        nextReview: getNextReviewDate(0),
        timesCorrect: 0,
        timesIncorrect: 1,
      });
    }

    // Cap queue at 500 entries to prevent localStorage bloat
    const trimmed = queue.length > 500 ? queue.slice(-500) : queue;
    saveLeitnerQueue(trimmed);
  }, [leitnerQueue, saveLeitnerQueue]);

  /**
   * Promote a question to the next level (answered correctly during review).
   */
  const promoteQuestion = useCallback((questionId, topicKey) => {
    const queue = [...(leitnerQueue || [])];
    const idx = queue.findIndex(
      e => e.questionId === questionId && e.topicKey === topicKey
    );

    if (idx < 0) return; // Not in queue

    const entry = queue[idx];
    const newLevel = Math.min(entry.level + 1, 4); // Cap at 4 (retired)
    const now = new Date().toISOString();

    queue[idx] = {
      ...entry,
      level: newLevel,
      lastReviewed: now,
      nextReview: getNextReviewDate(newLevel),
      timesCorrect: (entry.timesCorrect || 0) + 1,
    };

    saveLeitnerQueue(queue);
  }, [leitnerQueue, saveLeitnerQueue]);

  /**
   * Check if a question is in the active review queue (not retired).
   */
  const isInQueue = useCallback((questionId, topicKey) => {
    return (leitnerQueue || []).some(
      e => e.questionId === questionId && e.topicKey === topicKey && e.level < 4
    );
  }, [leitnerQueue]);

  /**
   * Get queue stats for display.
   */
  const getQueueStats = useCallback(() => {
    const queue = leitnerQueue || [];
    const active = queue.filter(e => e.level < 4);
    const retired = queue.filter(e => e.level >= 4);
    const due = active.filter(e => {
      if (!e.nextReview) return true;
      return new Date(e.nextReview) <= new Date();
    });

    return {
      total: queue.length,
      active: active.length,
      retired: retired.length,
      due: due.length,
    };
  }, [leitnerQueue]);

  return {
    addToQueue,
    promoteQuestion,
    isInQueue,
    getQueueStats,
  };
}

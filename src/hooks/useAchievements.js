import { useCallback } from 'react';
import ACHIEVEMENTS from '../data/achievements';
import { SUBJECT_TOPICS } from './useMastery';

// Checks all achievements against current user stats
// Returns newly unlocked achievements (if any)

function buildStats(quizHistory, questionResults, streakData, mockTestHistory, masteryFn) {
  const totalQuizzes = quizHistory.length;
  const totalQuestions = questionResults.length;
  const longestStreak = streakData.longestStreak || 0;

  // Perfect score check
  const hasPerfectScore = quizHistory.some(q => q.percentage === 100 && q.total >= 5);

  // High score count (80%+ on quizzes with 5+ questions)
  const highScoreCount = quizHistory.filter(q => q.percentage >= 80 && q.total >= 5).length;

  // Topics covered per subject
  const topicsWithQuestions = new Set(questionResults.map(r => r.topicKey));
  const mathsTopicsCovered = SUBJECT_TOPICS.maths.filter(t => topicsWithQuestions.has(t)).length;
  const englishTopicsCovered = SUBJECT_TOPICS.english.filter(t => topicsWithQuestions.has(t)).length;
  const vrTopicsCovered = SUBJECT_TOPICS.verbalreasoning.filter(t => topicsWithQuestions.has(t)).length;

  // Mastered topics (5 stars)
  let masteredTopics = 0;
  let biggestImprovement = 0;
  const allTopics = [...SUBJECT_TOPICS.maths, ...SUBJECT_TOPICS.english, ...SUBJECT_TOPICS.verbalreasoning];
  allTopics.forEach(topicKey => {
    const m = masteryFn(topicKey);
    if (m.stars >= 5) masteredTopics++;
    if (m.trend && m.trend.delta > biggestImprovement) biggestImprovement = m.trend.delta;
  });

  // Mock test stats
  const mockTestCount = mockTestHistory.length;
  const bestMockScore = mockTestHistory.length > 0
    ? Math.max(...mockTestHistory.map(m => m.percentage))
    : 0;

  return {
    totalQuizzes,
    totalQuestions,
    longestStreak,
    hasPerfectScore,
    highScoreCount,
    mathsTopicsCovered,
    englishTopicsCovered,
    vrTopicsCovered,
    masteredTopics,
    biggestImprovement,
    mockTestCount,
    bestMockScore,
  };
}

// Normalise earned-achievements input into a Set of id strings.
// The hook accepts both legacy string arrays (localStorage era) and the
// current D1 shape of `{ id, unlockedAt }` objects. Without this, the D1
// shape causes every check to treat already-earned achievements as new —
// which is why "First Steps" was firing on every quiz.
function toIdSet(list) {
  return new Set((list || []).map(a => typeof a === 'string' ? a : a?.id).filter(Boolean));
}

export default function useAchievements(
  earnedAchievements, saveAchievements,
  quizHistory, questionResults, streakData, mockTestHistory, masteryFn
) {
  // Check for newly unlocked achievements
  const checkAchievements = useCallback(() => {
    const stats = buildStats(quizHistory, questionResults, streakData, mockTestHistory, masteryFn);
    const earnedIds = toIdSet(earnedAchievements);
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (!earnedIds.has(achievement.id) && achievement.check(stats)) {
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      // Build the updated list as plain id strings — saveAchievements
      // in useD1Data handles both shapes defensively, but storing a
      // homogeneous string list is tidier going forward.
      const updatedEarned = [
        ...Array.from(earnedIds),
        ...newlyUnlocked.map(a => a.id),
      ];
      saveAchievements(updatedEarned);
    }

    return newlyUnlocked;
  }, [earnedAchievements, saveAchievements, quizHistory, questionResults, streakData, mockTestHistory, masteryFn]);

  // Get all achievements with earned status
  const getAllAchievements = useCallback(() => {
    const earnedIds = toIdSet(earnedAchievements);
    return ACHIEVEMENTS.map(a => ({
      ...a,
      earned: earnedIds.has(a.id),
    }));
  }, [earnedAchievements]);

  // Count earned
  const earnedCount = earnedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return {
    checkAchievements,
    getAllAchievements,
    earnedCount,
    totalCount,
  };
}

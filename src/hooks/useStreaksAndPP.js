import { useCallback } from 'react';

// Streak tracking + Prep Points (PP) system
// Streak = consecutive days with at least 1 completed quiz
// PP = points earned from practice activity, drives level progression

// Level calculation: Level = floor(sqrt(totalPP / 50))
// Level 1 = 50 PP, Level 5 = 1250 PP, Level 10 = 5000 PP, Level 20 = 20000 PP
function calculateLevel(totalPP) {
  return Math.floor(Math.sqrt(totalPP / 50));
}

function ppForNextLevel(currentLevel) {
  return ((currentLevel + 1) ** 2) * 50;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export default function useStreaksAndPP(streakData, prepPointsData, saveStreakData, savePrepPoints) {

  // Count practice days in a rolling 7-day window ending on a given date
  const countPracticeDaysInWeek = useCallback((endDate, history) => {
    const end = new Date(endDate);
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (history.includes(ds)) count++;
    }
    return count;
  }, []);

  // Update streak when a quiz is completed
  // Streak rule: 5 practice days in any rolling 7-day window = streak maintained
  // Less than 5 in the last 7 days = streak resets
  const recordQuizCompletion = useCallback(() => {
    const today = getToday();

    // If already recorded a quiz today, don't update streak
    if (streakData.lastQuizDate === today) return streakData;

    // Add today to history first so the count includes it
    const updatedHistory = [...(streakData.streakHistory || []), today].filter(
      (d, i, arr) => arr.indexOf(d) === i
    ).slice(-365);

    // Count practice days in the last 7 days (including today)
    const last7 = countPracticeDaysInWeek(today, updatedHistory);

    let newStreak;
    if (last7 >= 5 || streakData.currentStreak === 0) {
      // Either hitting the 5/7 target or starting fresh — streak grows
      newStreak = streakData.currentStreak + 1;
    } else {
      // Fell below 5 in 7 — streak resets to 1 (today counts as day 1)
      newStreak = 1;
    }

    const updated = {
      currentStreak: newStreak,
      longestStreak: Math.max(streakData.longestStreak, newStreak),
      lastQuizDate: today,
      streakHistory: updatedHistory,
    };

    saveStreakData(updated);
    return updated;
  }, [streakData, saveStreakData, countPracticeDaysInWeek]);

  // Check if streak is still active (not broken)
  // Active if practised at least 5 of the last 7 days
  const isStreakActive = useCallback(() => {
    const today = getToday();
    if (!streakData.lastQuizDate) return false;
    const history = streakData.streakHistory || [];
    const last7 = countPracticeDaysInWeek(today, history);
    return last7 >= 5 || streakData.lastQuizDate === today;
  }, [streakData, countPracticeDaysInWeek]);

  // Award Prep Points for various activities
  const awardPP = useCallback((points, reason) => {
    const today = getToday();

    // Reset todayPP if it's a new day
    const todayPP = prepPointsData.todayDate === today
      ? prepPointsData.todayPP + points
      : points;

    const newTotal = prepPointsData.total + points;
    const newLevel = calculateLevel(newTotal);

    const updated = {
      total: newTotal,
      level: newLevel,
      todayPP: todayPP,
      todayDate: today,
    };

    savePrepPoints(updated);

    // Return info about the award (for UI notifications)
    const leveledUp = newLevel > prepPointsData.level;
    return {
      pointsAwarded: points,
      reason,
      newTotal,
      newLevel,
      leveledUp,
      ppToNextLevel: ppForNextLevel(newLevel) - newTotal,
    };
  }, [prepPointsData, savePrepPoints]);

  // Calculate PP for a completed quiz
  const calculateQuizPP = useCallback((questionsAnswered, questionsCorrect, percentage, isFirstTimeOnTopic) => {
    let total = 0;
    const breakdown = [];

    // Base: +10 per question attempted
    const basePP = questionsAnswered * 10;
    total += basePP;
    breakdown.push({ label: 'Questions answered', pp: basePP });

    // Correct bonus: +5 per correct answer
    const correctPP = questionsCorrect * 5;
    total += correctPP;
    breakdown.push({ label: 'Correct answers', pp: correctPP });

    // Quiz completion: +25
    total += 25;
    breakdown.push({ label: 'Quiz completed', pp: 25 });

    // High score bonus: +50 for 80%+
    if (percentage >= 80) {
      total += 50;
      breakdown.push({ label: 'High score bonus (80%+)', pp: 50 });
    }

    // First time on topic: +100
    if (isFirstTimeOnTopic) {
      total += 100;
      breakdown.push({ label: 'New topic explored!', pp: 100 });
    }

    // Streak day bonus: +20 per day in current streak (capped at +200)
    const streakBonus = Math.min(200, streakData.currentStreak * 20);
    if (streakBonus > 0) {
      total += streakBonus;
      breakdown.push({ label: `${streakData.currentStreak}-day streak bonus`, pp: streakBonus });
    }

    return { total, breakdown };
  }, [streakData]);

  // Get current level info
  const getLevelInfo = useCallback(() => {
    const level = calculateLevel(prepPointsData.total);
    const currentLevelPP = (level ** 2) * 50;
    const nextLevelPP = ppForNextLevel(level);
    const progress = prepPointsData.total - currentLevelPP;
    const needed = nextLevelPP - currentLevelPP;

    return {
      level,
      totalPP: prepPointsData.total,
      todayPP: prepPointsData.todayDate === getToday() ? prepPointsData.todayPP : 0,
      progress, // PP earned toward next level
      needed, // PP needed for next level
      progressPct: needed > 0 ? Math.round((progress / needed) * 100) : 100,
    };
  }, [prepPointsData]);

  // Get days practised in last N days (for calendar / consistency tracking)
  const getPracticeDays = useCallback((days = 84) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return (streakData.streakHistory || []).filter(d => d >= cutoffStr);
  }, [streakData]);

  return {
    // Streak
    recordQuizCompletion,
    isStreakActive,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastQuizDate: streakData.lastQuizDate,
    streakHistory: streakData.streakHistory || [],
    // Prep Points
    awardPP,
    calculateQuizPP,
    getLevelInfo,
    // Calendar
    getPracticeDays,
  };
}

export { calculateLevel, ppForNextLevel };

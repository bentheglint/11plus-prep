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

// Returns today's date as YYYY-MM-DD in LOCAL time.
// Previously used toISOString() which is UTC — a child practising at 23:30 BST
// would land on the wrong (previous) day. Fixed to use local date components.
// Legacy UTC-recorded history rows are tolerated; a one-hour boundary shift on
// old rows is acceptable per spec.
function getToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Count practice days in a rolling 7-day window ending on a given date.
// Pure function — exported for testing.
export function countPracticeDaysInWeek(endDate, history) {
  const end = new Date(endDate);
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const ds = `${y}-${mo}-${dy}`;
    if (history.includes(ds)) count++;
  }
  return count;
}

/**
 * Recompute ALL streak fields from a history array (pure function, no side effects).
 * Used for conflict merging on Device B when Device A has different practice days.
 *
 * The algorithm walks history ascending and applies the same 5-of-7 rolling window
 * rule as recordQuizCompletion, producing:
 *   currentStreak — streak value as of the last day in history
 *   longestStreak — historical maximum (pass prevLongest to carry forward
 *                   any longest streak that predates the retained history window)
 *   lastQuizDate  — most recent date in history
 *
 * @param {string[]} history   — array of YYYY-MM-DD strings (may be unsorted)
 * @param {number}   [prevLongest=0] — longest streak known before this history window
 * @returns {{ currentStreak: number, longestStreak: number, lastQuizDate: string|null }}
 */
export function recomputeStreakFromHistory(history, prevLongest = 0) {
  if (!history || history.length === 0) {
    return { currentStreak: 0, longestStreak: prevLongest, lastQuizDate: null };
  }

  // Sort ascending (chronological order for sequential processing)
  const sorted = [...new Set(history)].sort();
  let currentStreak = 0;
  let longestStreak = prevLongest;
  let lastProcessed = null;

  for (const date of sorted) {
    // Determine how many practice days are in the 7-day window ending on this date
    const last7 = countPracticeDaysInWeek(date, sorted);

    let newStreak;
    if (currentStreak === 0 || lastProcessed === null) {
      newStreak = 1;
    } else {
      const daysSinceLast = Math.floor(
        (new Date(date) - new Date(lastProcessed)) / 86400000
      );
      if (daysSinceLast > 2) {
        // Gap too long — 3+ days off breaks the 5/7 rule
        newStreak = 1;
      } else if (sorted.length >= 7 && last7 < 5) {
        // Established user: rolling 7-day window dropped below 5 → streak resets
        newStreak = 1;
      } else {
        newStreak = currentStreak + 1;
      }
    }

    currentStreak = newStreak;
    longestStreak = Math.max(longestStreak, currentStreak);
    lastProcessed = date;
  }

  return {
    currentStreak,
    longestStreak,
    lastQuizDate: sorted[sorted.length - 1],
  };
}

export default function useStreaksAndPP(streakData, prepPointsData, saveStreakData, savePrepPoints) {

  // Update streak when a quiz is completed
  // Streak rule: grows every practice day; resets only if:
  //   - Gap since last quiz > 2 days (can't maintain 5/7 with a 3+ day gap), OR
  //   - Established user (7+ days history) dropped below 5/7 in rolling window
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

    // Days elapsed since previous practice (null if first ever practice)
    const daysSinceLastQuiz = streakData.lastQuizDate
      ? Math.floor((new Date(today) - new Date(streakData.lastQuizDate)) / 86400000)
      : null;

    let newStreak;
    if (streakData.currentStreak === 0 || daysSinceLastQuiz === null) {
      // Fresh start (first ever practice, or previously broken)
      newStreak = 1;
    } else if (daysSinceLastQuiz > 2) {
      // Gap too long — 3+ days off breaks the 5/7 rule, streak resets
      newStreak = 1;
    } else if (updatedHistory.length >= 7 && last7 < 5) {
      // Established user: rolling 7-day window dropped below 5 → streak resets
      newStreak = 1;
    } else {
      // Within tolerance — streak grows by 1 for today's practice
      newStreak = streakData.currentStreak + 1;
    }

    const updated = {
      currentStreak: newStreak,
      longestStreak: Math.max(streakData.longestStreak, newStreak),
      lastQuizDate: today,
      streakHistory: updatedHistory,
    };

    saveStreakData(updated);
    return updated;
  }, [streakData, saveStreakData]);

  // Check if streak is still active (not broken)
  // Active if practised at least 5 of the last 7 days
  const isStreakActive = useCallback(() => {
    const today = getToday();
    if (!streakData.lastQuizDate) return false;
    const history = streakData.streakHistory || [];
    const last7 = countPracticeDaysInWeek(today, history);
    return last7 >= 5 || streakData.lastQuizDate === today;
  }, [streakData]);

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

    // Practice day bonus: flat +25 for practising today (not tied to streak length)
    const todayStr = getToday();
    const practicedToday = streakData.lastQuizDate === todayStr;
    if (practicedToday) {
      total += 25;
      breakdown.push({ label: 'Practice day bonus', pp: 25 });
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
    const y = cutoff.getFullYear();
    const m = String(cutoff.getMonth() + 1).padStart(2, '0');
    const d = String(cutoff.getDate()).padStart(2, '0');
    const cutoffStr = `${y}-${m}-${d}`;
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

export { calculateLevel, ppForNextLevel, getToday };

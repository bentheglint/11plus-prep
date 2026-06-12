// Centralised tip selection algorithms
// Used by: ResultsScreen, QuizScreen (post-question), PreQuizTip, WelcomeBack, StudyToolkit

/**
 * Build a mastery map suitable for tip-selection from a mastery hook return.
 * masteryHook = the return value of useMastery (has getTopicMastery).
 * allTopicKeys = ALL_TOPIC_KEYS from useMastery.
 */
export function buildMasteryMap(masteryHook, allTopicKeys) {
  const map = {};
  for (const key of allTopicKeys) {
    const m = masteryHook.getTopicMastery(key);
    map[key] = {
      recentAccuracy: m.recentAccuracy / 100,   // normalise to 0-1
      recentCount: m.recentCount,
      daysSince: m.daysSince,
      bestStars: m.bestStars,
    };
  }
  return map;
}

/**
 * Get the user's weakest / stale-but-once-strong topics from mastery data.
 *
 * masteryByTopic: { [topicKey]: { recentAccuracy, recentCount, daysSince, bestStars } }
 * count: max topics to return (default 3)
 *
 * A topic qualifies ONLY if:
 *   - struggling: recentCount >= 5 && recentAccuracy < 0.6, OR
 *   - stale-once-strong: daysSince > 14 && bestStars >= 3
 *
 * Ranking: struggling first (ascending recentAccuracy), then stale (descending daysSince).
 * An empty result is valid — early-journey children must not see spurious weak topics.
 */
export function getWeakTopics(masteryByTopic, count = 3) {
  const struggling = [];
  const stale = [];

  for (const [key, m] of Object.entries(masteryByTopic || {})) {
    if (m.recentCount >= 5 && m.recentAccuracy < 0.6) {
      struggling.push([key, m]);
    } else if (m.daysSince > 14 && m.bestStars >= 3) {
      stale.push([key, m]);
    }
  }

  struggling.sort((a, b) => a[1].recentAccuracy - b[1].recentAccuracy);
  stale.sort((a, b) => b[1].daysSince - a[1].daysSince);

  return [...struggling, ...stale].slice(0, count).map(([key]) => key);
}

/**
 * Check if a tip was seen recently (within `days` days).
 * seenTips format: [{ id, lastSeenDate }]
 */
function wasSeenRecently(tipId, seenTips, days = 3) {
  const entry = seenTips.find(t => t.id === tipId);
  if (!entry) return false;
  const daysSince = (Date.now() - new Date(entry.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince < days;
}

/**
 * Pick one tip from candidates, preferring never-seen, then oldest-seen.
 * Returns null if no candidates.
 */
function pickBestTip(candidates, seenTips) {
  if (candidates.length === 0) return null;

  const seenMap = new Map(seenTips.map(t => [t.id, t.lastSeenDate]));

  // Split into never-seen and seen
  const neverSeen = candidates.filter(t => !seenMap.has(t.id));
  if (neverSeen.length > 0) {
    return neverSeen[Math.floor(Math.random() * neverSeen.length)];
  }

  // All seen — pick the oldest-seen
  const sorted = [...candidates].sort((a, b) => {
    const dateA = new Date(seenMap.get(a.id) || 0).getTime();
    const dateB = new Date(seenMap.get(b.id) || 0).getTime();
    return dateA - dateB; // oldest first
  });
  return sorted[0];
}

/**
 * Select a tip for the Results Screen based on performance band.
 *
 * Below 60%: Confidence & Wellbeing tip
 * 60-80%: Strategy tip matched to weakest topic in this session
 * Above 80%: Exam Technique tip
 */
export function selectResultsInsightTip({ percentage, answers, quizQuestions, allTips, seenTips }) {
  let candidates;

  if (percentage < 60) {
    // Confidence & Wellbeing tips
    candidates = allTips.filter(t => t.subject === 'general' && t.category === 'Confidence & Wellbeing');
  } else if (percentage >= 80) {
    // Exam Technique tips
    candidates = allTips.filter(t => t.subject === 'general' && t.category === 'Exam Technique');
  } else {
    // 60-80%: find weakest topic in this quiz session
    const topicScores = {};
    quizQuestions.forEach((q, i) => {
      const key = q.topicKey;
      if (!topicScores[key]) topicScores[key] = { correct: 0, total: 0 };
      topicScores[key].total += 1;
      if (answers[i]?.correct) topicScores[key].correct += 1;
    });

    // Find weakest topic (lowest percentage, with at least 1 wrong)
    const weakest = Object.entries(topicScores)
      .filter(([, data]) => data.correct < data.total) // at least 1 wrong
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
      [0];

    if (weakest) {
      const weakTopicKey = weakest[0];
      // Find tips matching this topic
      candidates = allTips.filter(t =>
        (t.topicKeys || []).includes(weakTopicKey) &&
        !wasSeenRecently(t.id, seenTips, 1)
      );
      // Fallback to general strategy tips if no topic-specific tip found
      if (candidates.length === 0) {
        candidates = allTips.filter(t => t.subject === 'general' && t.category === 'Study Skills');
      }
    } else {
      // All correct (score exactly 80%) — treat as high performance
      candidates = allTips.filter(t => t.subject === 'general' && t.category === 'Exam Technique');
    }
  }

  return pickBestTip(candidates || [], seenTips);
}

/**
 * Select a tip to show after a wrong answer, matched to the question's topic.
 * Excludes tips already shown in this session.
 */
export function selectPostQuestionTip(topicKey, allTips, sessionShownTipIds, seenTips) {
  // Find tips matching this topic that haven't been shown this session
  const candidates = allTips.filter(t =>
    (t.topicKeys || []).includes(topicKey) &&
    !sessionShownTipIds.has(t.id)
  );

  if (candidates.length === 0) return null;
  return pickBestTip(candidates, seenTips);
}

/**
 * Select a pre-quiz tip.
 * Focused mode: topic-specific tip
 * Daily mode: general strategy tip (Exam Technique or Study Skills)
 */
export function selectPreQuizTip(mode, topicKey, allTips, seenTips) {
  let candidates;

  if (mode === 'focused' && topicKey) {
    candidates = allTips.filter(t =>
      (t.topicKeys || []).includes(topicKey) &&
      !wasSeenRecently(t.id, seenTips, 1)
    );
    // Fallback to general tips if no topic-specific tips available
    if (candidates.length === 0) {
      candidates = allTips.filter(t =>
        t.subject === 'general' &&
        (t.category === 'Exam Technique' || t.category === 'Study Skills') &&
        !wasSeenRecently(t.id, seenTips, 1)
      );
    }
  } else {
    // Daily mode: general strategy tips
    candidates = allTips.filter(t =>
      t.subject === 'general' &&
      (t.category === 'Exam Technique' || t.category === 'Study Skills') &&
      !wasSeenRecently(t.id, seenTips, 1)
    );
  }

  return pickBestTip(candidates || [], seenTips);
}

/**
 * Select a tip for the Welcome Back screen.
 * Finds tips seen 7+ days ago, prioritised by overlap with weakest topics.
 *
 * masteryByTopic: { [topicKey]: { recentAccuracy, recentCount, daysSince, bestStars } }
 * (build with buildMasteryMap — same shape accepted by getWeakTopics)
 */
export function selectWelcomeBackTip(allTips, seenTips, masteryByTopic) {
  // Find tips seen at least 7 days ago
  const now = Date.now();
  const oldEnough = seenTips.filter(entry => {
    const daysSince = (now - new Date(entry.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 7;
  });

  if (oldEnough.length === 0) return null;

  // Get full tip objects for the old-enough entries
  const tipMap = new Map(allTips.map(t => [t.id, t]));
  const oldTips = oldEnough
    .map(entry => tipMap.get(entry.id))
    .filter(Boolean);

  if (oldTips.length === 0) return null;

  // Prioritise by weak topics
  const weakTopics = getWeakTopics(masteryByTopic, 3);
  const weakSet = new Set(weakTopics);

  const weakRelevant = oldTips.filter(t =>
    (t.topicKeys || []).some(k => weakSet.has(k))
  );

  if (weakRelevant.length > 0) {
    return weakRelevant[Math.floor(Math.random() * weakRelevant.length)];
  }

  // Fallback: any old tip
  return oldTips[Math.floor(Math.random() * oldTips.length)];
}

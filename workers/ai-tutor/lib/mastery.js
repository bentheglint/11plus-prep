// Mastery + readiness algorithms shared between the report endpoint and
// the weekly progress email. Mirrors src/hooks/useMastery.js — keep these
// in sync if the client-side algorithm changes.
//
// Single source of truth: the algorithm here is the authoritative version
// for any server-side surface (reports, emails, exports). The client hook
// must produce numbers that match for any given dataset.

// All 38 topic keys grouped by subject — must match SUBJECT_TOPICS in useMastery.js
export const SUBJECT_TOPICS = {
  maths: ['percentages', 'decimals', 'longdivision', 'ratio', 'fractions', 'longmultiplication', 'algebra', 'placevalue', 'negativenumbers', 'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes', 'sequences', 'datahandling', 'speeddistancetime'],
  english: ['comprehension', 'spelling', 'punctuation', 'grammar', 'vocabulary', 'writingTechniques'],
  verbalreasoning: ['synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes', 'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies', 'numberWordCodes', 'logicAndLanguage', 'sharedLetter'],
};

// Recency decay factor — topics not practised recently lose mastery
function getRecencyFactor(daysSince) {
  if (daysSince <= 7) return 1.0;
  if (daysSince <= 14) return 0.9;
  if (daysSince <= 21) return 0.75;
  if (daysSince <= 28) return 0.6;
  return 0.4;
}

// Compute mastery score (0-100) for a single topic from question results.
// Uses the same recency × accuracy × volume formula as the client hook,
// except for covered topics (≥20 questions) where volume hits 1.0.
//
// Results are objects with { correct: boolean, date: ISO string }.
export function computeTopicMastery(results, now) {
  if (!results || results.length === 0) {
    return { score: 0, totalQuestions: 0, recentAccuracy: 0, daysSince: Infinity, lastPracticed: null };
  }
  const sorted = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent30 = sorted.slice(0, 30);
  const rawAccuracy = recent30.filter(r => r.correct).length / recent30.length;
  const lastDate = new Date(sorted[0].date);
  const daysSince = Math.floor((now - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const recencyFactor = getRecencyFactor(daysSince);
  const volumeFactor = Math.min(1.0, results.length / 20);
  const score = Math.round(rawAccuracy * recencyFactor * volumeFactor * 100);
  return {
    score,
    totalQuestions: results.length,
    recentAccuracy: Math.round(rawAccuracy * 100),
    daysSince,
    lastPracticed: sorted[0].date,
  };
}

// Mastery band (categorical) — matches getMasteryLevel in useMastery.js
export function getMasteryBand(score, totalQuestions) {
  if (totalQuestions === 0) return { label: 'Not started', colour: '#cbd5e1', textColour: '#475569' };
  if (score >= 90) return { label: 'Mastered', colour: '#16a34a', textColour: '#ffffff' };
  if (score >= 76) return { label: 'Strong', colour: '#22c55e', textColour: '#ffffff' };
  if (score >= 56) return { label: 'Confident', colour: '#7C3AED', textColour: '#ffffff' };
  if (score >= 31) return { label: 'Developing', colour: '#a78bfa', textColour: '#ffffff' };
  return { label: 'Exploring', colour: '#fbbf24', textColour: '#000000' };
}

// Readiness band from covered-topic accuracy + coverage. Mirrors getReadinessBand
// in report.js. Both depth (accuracy on covered topics) and breadth (number of
// topics with ≥20 questions) are required to advance.
export function getReadinessBand(coveredAccuracy, coveredCount) {
  if (coveredCount === 0 || coveredAccuracy === null) {
    return {
      band: 'Building Foundations',
      description: 'Not yet enough practice data for a meaningful assessment. Keep building coverage.',
      colour: '#3B82F6',
    };
  }
  if (coveredCount >= 10 && coveredAccuracy >= 90) {
    return {
      band: 'Excelling',
      description: 'Consistently high accuracy across a wide range of topics.',
      colour: '#f59e0b',
    };
  }
  if (coveredCount >= 6 && coveredAccuracy >= 80) {
    return {
      band: 'Exam Ready',
      description: 'Strong performance across core topics. Continue extending coverage.',
      colour: '#16a34a',
    };
  }
  if (coveredCount >= 3 && coveredAccuracy >= 60) {
    return {
      band: 'Developing Well',
      description: 'Solid progress on practised topics. Building towards full curriculum coverage.',
      colour: '#7C3AED',
    };
  }
  return {
    band: 'Building Foundations',
    description: 'Early stage preparation. Focus on building accuracy and expanding topic coverage.',
    colour: '#3B82F6',
  };
}

// Single function that processes raw question_results rows from D1 and returns
// everything an email or report needs: per-topic mastery, covered counts,
// readiness band, weakest/strongest topics. Pass an array of rows shaped:
//   { topic_key, subject, is_correct, attempted_at }
export function buildMasterySummary(questionResultsRows, now = Date.now()) {
  // Group by (subject, topic)
  const byTopic = {};
  (questionResultsRows || []).forEach(r => {
    if (!r.attempted_at) return;
    const key = `${r.subject}:${r.topic_key}`;
    if (!byTopic[key]) byTopic[key] = { topicKey: r.topic_key, subject: r.subject, results: [] };
    byTopic[key].results.push({
      correct: !!r.is_correct,
      date: r.attempted_at.includes('T') ? r.attempted_at : r.attempted_at.replace(' ', 'T') + 'Z',
    });
  });

  // Compute per-topic mastery for every topic in every subject (including untouched)
  const topics = [];
  for (const subject of Object.keys(SUBJECT_TOPICS)) {
    for (const topicKey of SUBJECT_TOPICS[subject]) {
      const data = byTopic[`${subject}:${topicKey}`];
      const mastery = data
        ? computeTopicMastery(data.results, now)
        : { score: 0, totalQuestions: 0, recentAccuracy: 0, daysSince: Infinity, lastPracticed: null };
      topics.push({ topicKey, subject, ...mastery, band: getMasteryBand(mastery.score, mastery.totalQuestions) });
    }
  }

  // Covered topics = ≥20 questions answered (the threshold for meaningful data)
  const coveredTopics = topics.filter(t => t.totalQuestions >= 20);
  const inProgressTopics = topics.filter(t => t.totalQuestions >= 5 && t.totalQuestions < 20);
  const notStartedTopics = topics.filter(t => t.totalQuestions === 0);

  // Covered-topic accuracy (the headline metric for readiness)
  const coveredAccuracy = coveredTopics.length > 0
    ? Math.round(coveredTopics.reduce((s, t) => s + t.score, 0) / coveredTopics.length)
    : null;

  const readiness = getReadinessBand(coveredAccuracy, coveredTopics.length);

  // Weakest covered topic (used by both email and report)
  const sortedCovered = [...coveredTopics].sort((a, b) => a.score - b.score);
  const weakestCovered = sortedCovered[0] || null;

  // Weakest topic with at least 5 questions (used by trial emails — wider net
  // than covered, since early in trial users won't have 20 questions on anything)
  const sortedWithSomeData = topics.filter(t => t.totalQuestions >= 5).sort((a, b) => a.recentAccuracy - b.recentAccuracy);
  const weakestWithData = sortedWithSomeData[0] || null;

  return {
    topics,
    coveredTopics,
    inProgressTopics,
    notStartedTopics,
    coveredAccuracy,
    readiness,
    weakestCovered,
    weakestWithData,
  };
}

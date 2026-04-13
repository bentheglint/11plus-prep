import { useMemo } from 'react';

// Mastery scoring engine with decay, trends, exam readiness, and recommendations
// Computed on every render from questionResults — no background process needed

// All 38 topic keys grouped by subject
const SUBJECT_TOPICS = {
  maths: ['percentages', 'decimals', 'longdivision', 'ratio', 'fractions', 'longmultiplication', 'algebra', 'placevalue', 'negativenumbers', 'primenumbersfactors', 'areaperimeter', 'volume', 'anglesshapes', 'sequences', 'datahandling', 'speeddistancetime'],
  english: ['comprehension', 'spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar'],
  verbalreasoning: ['synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut', 'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords', 'letterCodes', 'letterPairSeries', 'numberSeries', 'letterSums', 'wordCodeAnalogies', 'numberWordCodes', 'logicAndLanguage', 'sharedLetter'],
};

function getSubjectForTopic(topicKey) {
  for (const [subject, topics] of Object.entries(SUBJECT_TOPICS)) {
    if (topics.includes(topicKey)) return subject;
  }
  return 'maths';
}

// Recency decay factor — topics not practised recently lose mastery
function getRecencyFactor(daysSince) {
  if (daysSince <= 7) return 1.0;
  if (daysSince <= 14) return 0.9;
  if (daysSince <= 21) return 0.75;
  if (daysSince <= 28) return 0.6;
  return 0.4;
}

// Mastery level from score
function getMasteryLevel(score) {
  if (score >= 90) return { stars: 5, label: 'Mastered', band: 'excelling' };
  if (score >= 76) return { stars: 4, label: 'Strong', band: 'exam-ready' };
  if (score >= 56) return { stars: 3, label: 'Confident', band: 'developing' };
  if (score >= 31) return { stars: 2, label: 'Developing', band: 'building' };
  if (score >= 1) return { stars: 1, label: 'Exploring', band: 'building' };
  return { stars: 0, label: 'Not started', band: 'not-started' };
}

// Exam readiness band from score
function getReadinessBand(score) {
  if (score >= 81) return { band: 'Excelling', colour: '#FDCB6E' };
  if (score >= 61) return { band: 'Exam Ready', colour: '#007D62' };
  if (score >= 36) return { band: 'Developing Well', colour: '#6C5CE7' };
  return { band: 'Building Foundations', colour: '#0770C2' };
}

export default function useMastery(questionResults, practiceLog, mockTestHistory) {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Pre-compute: group question results by topic
  const byTopic = useMemo(() => {
    const map = {};
    (questionResults || []).forEach(r => {
      if (!map[r.topicKey]) map[r.topicKey] = [];
      map[r.topicKey].push(r);
    });
    return map;
  }, [questionResults]);

  // Get mastery data for a single topic
  const getTopicMastery = useMemo(() => (topicKey) => {
    const results = byTopic[topicKey] || [];
    if (results.length === 0) {
      return {
        score: 0, ...getMasteryLevel(0),
        trend: { direction: 'stable', delta: 0 },
        lastPracticed: null, daysSince: Infinity,
        totalQuestions: 0, recentAccuracy: 0,
      };
    }

    // Sort by date descending
    const sorted = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Last 30 questions for accuracy
    const recent30 = sorted.slice(0, 30);
    const recentCorrect = recent30.filter(r => r.correct).length;
    const rawAccuracy = recentCorrect / recent30.length;

    // Days since last practice
    const lastDate = new Date(sorted[0].date);
    const daysSince = Math.floor((now - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const recencyFactor = getRecencyFactor(daysSince);

    // Volume factor — ramps from 0 to 1 over first 20 questions
    const volumeFactor = Math.min(1.0, results.length / 20);

    // Mastery score
    const score = Math.round(rawAccuracy * recencyFactor * volumeFactor * 100);
    const level = getMasteryLevel(score);

    // Trend: compare last 10 vs previous 10
    const last10 = sorted.slice(0, 10);
    const prev10 = sorted.slice(10, 20);
    let trend = { direction: 'stable', delta: 0 };
    if (last10.length >= 5 && prev10.length >= 5) {
      const lastAcc = last10.filter(r => r.correct).length / last10.length;
      const prevAcc = prev10.filter(r => r.correct).length / prev10.length;
      const delta = Math.round((lastAcc - prevAcc) * 100);
      if (delta > 5) trend = { direction: 'up', delta };
      else if (delta < -5) trend = { direction: 'down', delta };
      else trend = { direction: 'stable', delta };
    }

    // Average time per question (if time data exists)
    const withTime = recent30.filter(r => r.timeSpentMs > 0);
    const avgTimeMs = withTime.length > 0
      ? Math.round(withTime.reduce((s, r) => s + r.timeSpentMs, 0) / withTime.length)
      : null;

    // Difficulty breakdown
    const diffBreakdown = {};
    [1, 2, 3].forEach(d => {
      const atDiff = recent30.filter(r => r.difficulty === d);
      if (atDiff.length > 0) {
        diffBreakdown[d] = {
          total: atDiff.length,
          correct: atDiff.filter(r => r.correct).length,
          pct: Math.round((atDiff.filter(r => r.correct).length / atDiff.length) * 100),
        };
      }
    });

    return {
      score,
      ...level,
      trend,
      lastPracticed: sorted[0].date,
      daysSince,
      totalQuestions: results.length,
      recentAccuracy: Math.round(rawAccuracy * 100),
      avgTimeMs,
      diffBreakdown,
    };
  }, [byTopic, now]);

  // Get mastery for all topics
  const getAllMastery = useMemo(() => () => {
    const all = {};
    Object.keys(SUBJECT_TOPICS).forEach(subject => {
      SUBJECT_TOPICS[subject].forEach(topicKey => {
        all[topicKey] = getTopicMastery(topicKey);
      });
    });
    return all;
  }, [getTopicMastery]);

  // Get subject-level mastery (average of topic masteries)
  const getSubjectMastery = useMemo(() => (subject) => {
    const topics = SUBJECT_TOPICS[subject] || [];
    const masteries = topics.map(t => getTopicMastery(t));
    const started = masteries.filter(m => m.totalQuestions > 0);
    if (started.length === 0) return { score: 0, ...getMasteryLevel(0), topicsCovered: 0, topicsTotal: topics.length };

    const avgScore = Math.round(started.reduce((s, m) => s + m.score, 0) / topics.length);
    return {
      score: avgScore,
      ...getMasteryLevel(avgScore),
      topicsCovered: started.length,
      topicsTotal: topics.length,
    };
  }, [getTopicMastery]);

  // Exam readiness per subject
  const getExamReadiness = useMemo(() => (subject) => {
    const topics = SUBJECT_TOPICS[subject] || [];
    const masteries = topics.map(t => getTopicMastery(t));

    // Weighted average of all topic scores (including 0 for unstarted)
    const avgScore = topics.length > 0
      ? Math.round(masteries.reduce((s, m) => s + m.score, 0) / topics.length)
      : 0;

    // Consistency bonus: days practised in last 14 days (max +10)
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const recentDays = new Set(
      (practiceLog || [])
        .filter(p => p.date >= twoWeeksAgo && (!subject || getSubjectForTopic(p.topicKey) === subject || p.subject === subject))
        .map(p => p.date)
    );
    const consistencyBonus = Math.min(10, recentDays.size);

    // Mock test bonus (most recent mock for this subject)
    const subjectMocks = (mockTestHistory || []).filter(m => m.subject === subject).sort((a, b) => new Date(b.date) - new Date(a.date));
    const mockBonus = subjectMocks.length > 0 && subjectMocks[0].percentage > 70
      ? Math.min(5, Math.round((subjectMocks[0].percentage - 70) / 6))
      : 0;

    const readinessScore = Math.min(100, avgScore + consistencyBonus + mockBonus);
    const { band, colour } = getReadinessBand(readinessScore);

    // Topics at risk (decaying or weak)
    const atRisk = masteries.filter(m => m.totalQuestions > 0 && (m.daysSince > 14 || m.score < 40));
    const strengths = masteries.filter(m => m.score >= 70);
    const weakTopics = masteries.filter(m => m.totalQuestions > 0 && m.score < 50)
      .sort((a, b) => a.score - b.score);

    return {
      score: readinessScore,
      band,
      colour,
      topicsAtRisk: atRisk.length,
      strengthCount: strengths.length,
      weakCount: weakTopics.length,
      topicsTotal: topics.length,
    };
  }, [getTopicMastery, practiceLog, mockTestHistory, now]);

  // Smart "what to do next" recommendation
  const getRecommendedNext = useMemo(() => (subject) => {
    const topics = SUBJECT_TOPICS[subject] || [];
    const scored = topics.map(topicKey => {
      const m = getTopicMastery(topicKey);
      // Priority formula
      let priority = (100 - m.score) * 2; // lower mastery = higher priority
      priority += Math.min(m.daysSince, 30) * 3; // longer gap = higher priority
      if (m.trend.direction === 'down') priority += 20; // declining = urgent
      if (m.totalQuestions < 10) priority += 15; // coverage gap
      if (m.totalQuestions === 0) priority += 30; // never tried

      // Build human-readable reason
      let reason;
      if (m.totalQuestions === 0) {
        reason = "You haven't tried this topic yet — give it a go!";
      } else if (m.daysSince > 14) {
        reason = `Last practised ${m.daysSince} days ago — time for a refresher before it fades!`;
      } else if (m.trend.direction === 'down') {
        reason = `Your accuracy has been dropping recently — let's sharpen this up!`;
      } else if (m.score < 40) {
        reason = `This needs more practice to build your confidence.`;
      } else if (m.totalQuestions < 10) {
        reason = `Only ${m.totalQuestions} questions attempted — more practice will help.`;
      } else {
        reason = `Good progress, but there's room to improve!`;
      }

      return { topicKey, subject, priority, reason, mastery: m };
    });

    scored.sort((a, b) => b.priority - a.priority);
    return scored[0] || null;
  }, [getTopicMastery]);

  // Get top 3 focus areas across all subjects
  const getFocusAreas = useMemo(() => () => {
    const all = [];
    Object.keys(SUBJECT_TOPICS).forEach(subject => {
      const rec = getRecommendedNext(subject);
      if (rec) all.push(rec);
    });
    // Also add any topic with declining trend
    const allMastery = getAllMastery();
    Object.entries(allMastery).forEach(([topicKey, m]) => {
      if (m.trend.direction === 'down' && m.totalQuestions > 0 && !all.find(a => a.topicKey === topicKey)) {
        all.push({
          topicKey,
          subject: getSubjectForTopic(topicKey),
          priority: (100 - m.score) * 2 + 20,
          reason: `Accuracy declining — was ${m.recentAccuracy + m.trend.delta}%, now ${m.recentAccuracy}%.`,
          mastery: m,
        });
      }
    });
    all.sort((a, b) => b.priority - a.priority);
    return all.slice(0, 3);
  }, [getRecommendedNext, getAllMastery]);

  return {
    getTopicMastery,
    getAllMastery,
    getSubjectMastery,
    getExamReadiness,
    getRecommendedNext,
    getFocusAreas,
    SUBJECT_TOPICS,
  };
}

export { SUBJECT_TOPICS, getReadinessBand, getMasteryLevel };

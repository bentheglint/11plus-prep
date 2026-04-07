import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// Testing coverage tracking for manual QA sessions (Ben + Jacqui only)
// Follows the same loadJSON/saveJSON pattern as useUserData.js

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const EMPTY_COVERAGE = { questions: {}, lessons: {}, sessions: [] };

export default function useTestingCoverage(userName) {
  const storageKey = `user:${userName}:testing-coverage`;
  const prevUser = useRef(userName);

  const [data, setData] = useState(() =>
    userName ? loadJSON(storageKey, EMPTY_COVERAGE) : EMPTY_COVERAGE
  );

  // Reload when user changes
  useEffect(() => {
    if (userName && userName !== prevUser.current) {
      prevUser.current = userName;
      setData(loadJSON(`user:${userName}:testing-coverage`, EMPTY_COVERAGE));
    }
  }, [userName]);

  const persist = useCallback((updated) => {
    if (!userName) return;
    setData(updated);
    saveJSON(`user:${userName}:testing-coverage`, updated);
  }, [userName]);

  const markQuestionTested = useCallback((topicKey, questionId) => {
    setData(prev => {
      const topic = prev.questions[topicKey] || { tested: [], flagged: [] };
      if (topic.tested.includes(questionId)) return prev;
      const updated = {
        ...prev,
        questions: {
          ...prev.questions,
          [topicKey]: { ...topic, tested: [...topic.tested, questionId] }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const flagQuestion = useCallback((topicKey, questionId, category, note) => {
    setData(prev => {
      const topic = prev.questions[topicKey] || { tested: [], flagged: [] };
      const flag = { questionId, category, note, date: new Date().toISOString() };
      const updated = {
        ...prev,
        questions: {
          ...prev.questions,
          [topicKey]: { ...topic, flagged: [...topic.flagged, flag] }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const markLessonTested = useCallback((topicKey, subConceptId) => {
    setData(prev => {
      const topic = prev.lessons[topicKey] || { tested: [], flagged: [] };
      if (topic.tested.includes(subConceptId)) return prev;
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [topicKey]: { ...topic, tested: [...topic.tested, subConceptId] }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const flagLesson = useCallback((topicKey, subConceptId, screenIndex, category, note) => {
    setData(prev => {
      const topic = prev.lessons[topicKey] || { tested: [], flagged: [] };
      const flag = { subConceptId, screenIndex, category, note, date: new Date().toISOString() };
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [topicKey]: { ...topic, flagged: [...topic.flagged, flag] }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const recordSession = useCallback((sessionData) => {
    setData(prev => {
      const updated = {
        ...prev,
        sessions: [...prev.sessions, { ...sessionData, date: new Date().toISOString() }]
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const resolveQuestionFlag = useCallback((topicKey, questionId) => {
    setData(prev => {
      const topic = prev.questions[topicKey];
      if (!topic) return prev;
      const updated = {
        ...prev,
        questions: {
          ...prev.questions,
          [topicKey]: { ...topic, flagged: topic.flagged.filter(f => f.questionId !== questionId) }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const resolveLessonFlag = useCallback((topicKey, subConceptId, date) => {
    setData(prev => {
      const topic = prev.lessons[topicKey];
      if (!topic) return prev;
      const updated = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [topicKey]: { ...topic, flagged: topic.flagged.filter(f => !(f.subConceptId === subConceptId && f.date === date)) }
        }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  const resetTopic = useCallback((topicKey) => {
    setData(prev => {
      const updated = {
        ...prev,
        questions: { ...prev.questions, [topicKey]: { tested: [], flagged: [] } },
        lessons: { ...prev.lessons, [topicKey]: { tested: [], flagged: [] } }
      };
      saveJSON(`user:${userName}:testing-coverage`, updated);
      return updated;
    });
  }, [userName]);

  // Compute coverage stats for a given questionData + lessonBank
  const getCoverage = useCallback((questionData, lessonBank) => {
    const result = {};
    // Process each subject
    for (const [subject, subjectData] of Object.entries(questionData)) {
      if (!subjectData.topics) continue;
      for (const [topicKey, topicData] of Object.entries(subjectData.topics)) {
        const totalQs = topicData.questions?.length || 0;
        const testedQs = (data.questions[topicKey]?.tested || []).length;
        const flaggedQs = (data.questions[topicKey]?.flagged || []).length;
        const totalLessons = lessonBank[topicKey]?.subConcepts?.length || 0;
        const testedLessons = (data.lessons[topicKey]?.tested || []).length;
        const flaggedLessons = (data.lessons[topicKey]?.flagged || []).length;

        result[topicKey] = {
          subject,
          topicName: topicData.name,
          totalQs,
          testedQs: Math.min(testedQs, totalQs),
          flaggedQs,
          totalLessons,
          testedLessons: Math.min(testedLessons, totalLessons),
          flaggedLessons,
          qCoverage: totalQs > 0 ? testedQs / totalQs : 1,
          lCoverage: totalLessons > 0 ? testedLessons / totalLessons : 1,
        };
      }
    }
    return result;
  }, [data]);

  // Risk scoring: higher = should test sooner
  // Weights: uncovered content (5x), visual questions (3x), difficulty 3 (2x)
  const getRiskScores = useCallback((questionData, lessonBank) => {
    const coverage = getCoverage(questionData, lessonBank);
    const scores = [];

    for (const [topicKey, cov] of Object.entries(coverage)) {
      const questions = questionData[cov.subject]?.topics?.[topicKey]?.questions || [];
      const visualCount = questions.filter(q => q.visual).length;
      const d3Count = questions.filter(q => q.difficulty === 3).length;
      const totalQs = cov.totalQs || 1;

      const visualPct = visualCount / totalQs;
      const d3Pct = d3Count / totalQs;
      const uncoveredPct = 1 - cov.qCoverage;

      const score = (uncoveredPct * 5) + (visualPct * 3) + (d3Pct * 2);

      scores.push({
        topicKey,
        subject: cov.subject,
        topicName: cov.topicName,
        score,
        visualCount,
        d3Count,
        ...cov,
        // Reason string for display
        reason: uncoveredPct >= 0.8
          ? `${cov.testedQs}/${cov.totalQs} tested`
          : visualCount > 10
            ? `${visualCount} diagram questions, ${Math.round(cov.qCoverage * 100)}% tested`
            : `${Math.round(cov.qCoverage * 100)}% tested, ${d3Count} hard questions`,
      });
    }

    return scores.sort((a, b) => b.score - a.score);
  }, [getCoverage]);

  // Summary totals
  const totals = useMemo(() => {
    let questionsChecked = 0;
    let lessonsChecked = 0;
    let issuesFlagged = 0;
    for (const t of Object.values(data.questions)) {
      questionsChecked += t.tested?.length || 0;
      issuesFlagged += t.flagged?.length || 0;
    }
    for (const t of Object.values(data.lessons)) {
      lessonsChecked += t.tested?.length || 0;
      issuesFlagged += t.flagged?.length || 0;
    }
    return { questionsChecked, lessonsChecked, issuesFlagged, sessions: data.sessions.length };
  }, [data]);

  return {
    data,
    totals,
    markQuestionTested,
    flagQuestion,
    markLessonTested,
    flagLesson,
    recordSession,
    resolveQuestionFlag,
    resolveLessonFlag,
    resetTopic,
    getCoverage,
    getRiskScores,
  };
}

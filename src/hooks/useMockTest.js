import { useState, useCallback, useEffect, useRef } from 'react';
import { vrPaperVariants, vrTypeInstructions, mathsPaperConfig, englishPaperConfig } from '../questionData/mockVRConfig';
import mockComprehensionPassages from '../questionData/mockComprehensionData';

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick n items from array, preferring unseen, respecting difficulty
function pickQuestions(pool, count, difficulty = null) {
  let filtered = difficulty ? pool.filter(q => q.difficulty === difficulty) : pool;
  if (filtered.length < count) filtered = pool; // fallback if not enough at target difficulty
  return shuffle(filtered).slice(0, count);
}

// Sort questions easy → hard within a set
function sortByDifficulty(questions) {
  return [...questions].sort((a, b) => (a.difficulty || 2) - (b.difficulty || 2));
}

// ========== MATHS PAPER GENERATION ==========
function generateMathsPaper(questionData) {
  const topics = questionData.maths.topics;
  const topicKeys = Object.keys(topics);
  const { difficultyDistribution, topicWeights } = mathsPaperConfig;

  // Build weighted topic pool
  const weightedKeys = [];
  topicKeys.forEach(key => {
    const weight = topicWeights[key] || 1.0;
    // Add key multiple times based on weight (approximate)
    const copies = Math.round(weight * 3);
    for (let i = 0; i < copies; i++) weightedKeys.push(key);
  });

  const selected = [];
  const usedIds = {};

  // For each difficulty band, pick questions
  difficultyDistribution.forEach(({ difficulty, count }) => {
    let picked = 0;
    const shuffledKeys = shuffle(weightedKeys);

    for (const key of shuffledKeys) {
      if (picked >= count) break;
      const pool = topics[key].questions.filter(
        q => q.difficulty === difficulty && !usedIds[key + '-' + q.id]
      );
      if (pool.length > 0) {
        const q = pool[Math.floor(Math.random() * pool.length)];
        selected.push({
          question: q,
          topicKey: key,
          topicName: topics[key].name,
          section: 'maths',
          sectionName: 'Maths',
        });
        usedIds[key + '-' + q.id] = true;
        picked++;
      }
    }

    // Fill any remaining from any topic at this difficulty
    while (picked < count) {
      const key = topicKeys[Math.floor(Math.random() * topicKeys.length)];
      const pool = topics[key].questions.filter(
        q => q.difficulty === difficulty && !usedIds[key + '-' + q.id]
      );
      if (pool.length > 0) {
        const q = pool[Math.floor(Math.random() * pool.length)];
        selected.push({
          question: q,
          topicKey: key,
          topicName: topics[key].name,
          section: 'maths',
          sectionName: 'Maths',
        });
        usedIds[key + '-' + q.id] = true;
        picked++;
      } else break; // safety valve
    }
  });

  // Sort by difficulty (easy first, hard last)
  return sortByDifficulty(selected);
}

// ========== ENGLISH PAPER GENERATION ==========
function generateEnglishPaper(englishTopics) {
  // Pick a random comprehension passage
  const passage = mockComprehensionPassages[Math.floor(Math.random() * mockComprehensionPassages.length)];

  const sections = [];

  // Section 1: Comprehension (18 Qs from passage)
  const compQs = passage.comprehensionQuestions.map(q => ({
    question: q,
    topicKey: 'comprehension',
    topicName: 'Reading Comprehension',
    section: 'comprehension',
    sectionName: 'Reading Comprehension',
    passage: passage.passage,
    passageTitle: passage.title,
  }));
  sections.push(...compQs);

  // Section 2: Vocabulary in Context (4 Qs from passage)
  const vocabQs = passage.vocabularyQuestions.map(q => ({
    question: q,
    topicKey: 'vocabulary',
    topicName: 'Vocabulary in Context',
    section: 'vocabulary',
    sectionName: 'Vocabulary in Context',
    passage: passage.passage,
    passageTitle: passage.title,
  }));
  sections.push(...vocabQs);

  // Section 3: Word Class (3 Qs from passage)
  const wcQs = passage.wordClassQuestions.map(q => ({
    question: q,
    topicKey: 'wordClass',
    topicName: 'Word Class & Grammar',
    section: 'wordClass',
    sectionName: 'Word Class & Grammar',
    passage: passage.passage,
    passageTitle: passage.title,
  }));
  sections.push(...wcQs);

  // Section 4: Spelling error-spotting (8 Qs)
  if (englishTopics.spelling) {
    const spellingPool = englishTopics.spelling.questions;
    const spellingQs = shuffle(spellingPool).slice(0, 8).map(q => ({
      question: q,
      topicKey: 'spelling',
      topicName: 'Spelling',
      section: 'spelling',
      sectionName: 'Spelling',
    }));
    sections.push(...sortByDifficulty(spellingQs));
  }

  // Section 5: Punctuation error-spotting (8 Qs)
  if (englishTopics.punctuation) {
    const punctPool = englishTopics.punctuation.questions;
    const punctQs = shuffle(punctPool).slice(0, 8).map(q => ({
      question: q,
      topicKey: 'punctuation',
      topicName: 'Punctuation',
      section: 'punctuation',
      sectionName: 'Punctuation',
    }));
    sections.push(...sortByDifficulty(punctQs));
  }

  // Section 6: Grammar/Cloze (8 Qs)
  if (englishTopics.grammar) {
    const grammarPool = englishTopics.grammar.questions;
    const grammarQs = shuffle(grammarPool).slice(0, 8).map(q => ({
      question: q,
      topicKey: 'grammar',
      topicName: 'Grammar',
      section: 'grammar',
      sectionName: 'Grammar & Cloze',
    }));
    sections.push(...sortByDifficulty(grammarQs));
  }

  return { questions: sections, passage };
}

// ========== VR PAPER GENERATION ==========
function generateVRPaper(vrTopics) {
  // Pick a random paper variant
  const variant = vrPaperVariants[Math.floor(Math.random() * vrPaperVariants.length)];

  const questions = [];
  const sectionBreaks = []; // indices where new sections start

  variant.sections.forEach(section => {
    const sourceKey = section.sourceKey || section.topicKey;
    const typeInfo = vrTypeInstructions[section.topicKey] || {};

    // Mark section start
    sectionBreaks.push({
      index: questions.length,
      topicKey: section.topicKey,
      typeName: typeInfo.typeName || section.topicKey,
      instruction: typeInfo.instruction || '',
      workedExample: typeInfo.workedExample || null,
      showAlphabet: typeInfo.showAlphabet || false,
      questionCount: section.questions,
    });

    // Get questions from the right topic
    const topic = vrTopics[sourceKey];
    if (!topic) return;

    const pool = topic.questions;
    const picked = shuffle(pool).slice(0, section.questions);
    const sorted = sortByDifficulty(picked);

    sorted.forEach(q => {
      questions.push({
        question: q,
        topicKey: sourceKey,
        topicName: topic.name,
        section: section.topicKey,
        sectionName: typeInfo.typeName || topic.name,
      });
    });
  });

  return { questions, sectionBreaks, variant };
}

// ========== MAIN HOOK ==========
export default function useMockTest() {
  const [mockTestActive, setMockTestActive] = useState(false);
  const [mockTestSubject, setMockTestSubject] = useState(null);
  const [mockTestQuestions, setMockTestQuestions] = useState([]);
  const [mockTestAnswers, setMockTestAnswers] = useState({});
  const [mockTestCurrentIndex, setMockTestCurrentIndex] = useState(0);
  const [mockTestSectionBreaks, setMockTestSectionBreaks] = useState([]);
  const [mockTestPassage, setMockTestPassage] = useState(null);
  const [mockTestTimeLimit, setMockTestTimeLimit] = useState(0);
  const [mockTestComplete, setMockTestComplete] = useState(false);
  const [mockTestStartTime, setMockTestStartTime] = useState(null);
  const [mockTestHistory, setMockTestHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mock-test-history')) || []; } catch { return []; }
  });

  const startMockTest = useCallback((subject, questionData, englishData, vrData) => {
    let questions = [];
    let sectionBreaks = [];
    let passage = null;
    let timeLimit = 0;

    if (subject === 'maths') {
      questions = generateMathsPaper(questionData);
      timeLimit = mathsPaperConfig.timeMinutes * 60;
    } else if (subject === 'english') {
      const result = generateEnglishPaper(englishData.topics);
      questions = result.questions;
      passage = result.passage;
      timeLimit = englishPaperConfig.timeMinutes * 60;
    } else if (subject === 'verbalreasoning') {
      const result = generateVRPaper(vrData.topics);
      questions = result.questions;
      sectionBreaks = result.sectionBreaks;
      timeLimit = 50 * 60; // 50 minutes
    }

    setMockTestQuestions(questions);
    setMockTestSectionBreaks(sectionBreaks);
    setMockTestPassage(passage);
    setMockTestAnswers({});
    setMockTestCurrentIndex(0);
    setMockTestSubject(subject);
    setMockTestTimeLimit(timeLimit);
    setMockTestComplete(false);
    setMockTestStartTime(Date.now());
    setMockTestActive(true);
  }, []);

  const answerQuestion = useCallback((index, answer) => {
    setMockTestAnswers(prev => ({ ...prev, [index]: answer }));
  }, []);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < mockTestQuestions.length) {
      setMockTestCurrentIndex(index);
    }
  }, [mockTestQuestions.length]);

  const submitTest = useCallback(() => {
    setMockTestComplete(true);
  }, []);

  const endMockTest = useCallback(() => {
    setMockTestActive(false);
    setMockTestQuestions([]);
    setMockTestAnswers({});
    setMockTestCurrentIndex(0);
    setMockTestSectionBreaks([]);
    setMockTestPassage(null);
    setMockTestComplete(false);
    setMockTestStartTime(null);
  }, []);

  // Calculate results
  const getResults = useCallback(() => {
    if (!mockTestComplete) return null;

    const timeTaken = mockTestStartTime ? Math.floor((Date.now() - mockTestStartTime) / 1000) : 0;
    let totalCorrect = 0;
    const sectionResults = {};

    mockTestQuestions.forEach((q, i) => {
      const answer = mockTestAnswers[i];
      const question = q.question;
      let isCorrect = false;

      if (question.questionType === 'select-two' || question.questionType === 'pick-from-sets') {
        if (Array.isArray(answer) && question.correctPair) {
          if (question.questionType === 'select-two') {
            isCorrect = answer.length === 2 &&
              ((answer[0] === question.correctPair[0] && answer[1] === question.correctPair[1]) ||
               (answer[0] === question.correctPair[1] && answer[1] === question.correctPair[0]));
          } else {
            isCorrect = answer[0] === question.correctPair[0] && answer[1] === question.correctPair[1];
          }
        }
      } else {
        isCorrect = answer === question.correct;
      }

      if (isCorrect) totalCorrect++;

      const section = q.sectionName || q.section || 'Other';
      if (!sectionResults[section]) {
        sectionResults[section] = { correct: 0, total: 0, questions: [] };
      }
      sectionResults[section].total++;
      if (isCorrect) sectionResults[section].correct++;
      sectionResults[section].questions.push({
        index: i,
        question: q,
        answer,
        isCorrect,
      });
    });

    const result = {
      subject: mockTestSubject,
      totalQuestions: mockTestQuestions.length,
      totalCorrect,
      percentage: Math.round((totalCorrect / mockTestQuestions.length) * 100),
      timeTaken,
      timeLimit: mockTestTimeLimit,
      sectionResults,
    };

    return result;
  }, [mockTestComplete, mockTestQuestions, mockTestAnswers, mockTestSubject, mockTestTimeLimit, mockTestStartTime]);

  // Save result to history when test completes
  const saveResultToHistory = useCallback((result) => {
    if (!result) return;
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject: result.subject,
      totalQuestions: result.totalQuestions,
      totalCorrect: result.totalCorrect,
      percentage: result.percentage,
      timeTaken: result.timeTaken,
      timeLimit: result.timeLimit,
      sections: Object.entries(result.sectionResults).map(([name, data]) => ({
        name,
        correct: data.correct,
        total: data.total,
        percentage: Math.round((data.correct / data.total) * 100),
      })),
    };
    const updated = [...mockTestHistory, historyEntry];
    setMockTestHistory(updated);
    localStorage.setItem('mock-test-history', JSON.stringify(updated));
  }, [mockTestHistory]);

  // Auto-save result when test completes
  const hasSaved = useRef(false);
  useEffect(() => {
    if (mockTestComplete && !hasSaved.current) {
      hasSaved.current = true;
      const result = getResults();
      if (result) saveResultToHistory(result);
    }
    if (!mockTestComplete) {
      hasSaved.current = false;
    }
  }, [mockTestComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    mockTestActive,
    mockTestSubject,
    mockTestQuestions,
    mockTestAnswers,
    mockTestCurrentIndex,
    mockTestSectionBreaks,
    mockTestPassage,
    mockTestTimeLimit,
    mockTestComplete,
    mockTestStartTime,
    mockTestHistory,
    // Actions
    startMockTest,
    answerQuestion,
    goToQuestion,
    submitTest,
    endMockTest,
    getResults,
    saveResultToHistory,
  };
}

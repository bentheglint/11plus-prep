import { useState, useCallback, useEffect, useRef } from 'react';
import { vrPaperVariants, vrTypeInstructions, mathsPaperConfig, englishPaperConfig, sectionDifficultyWeights } from '../questionData/mockVRConfig';
import mockComprehensionPassages from '../questionData/mockComprehensionData';
import { mockClozePassages } from '../questionData/mockClozeData';

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

// Allocate `count` questions across difficulties [1,2,3] using the target
// weights, via largest-remainder rounding. Ties break toward the HARDER band so
// a section back-loads difficulty (matches the real GL ramp). Pure + testable.
// e.g. distributionForCount(8) -> { 1: 2, 2: 3, 3: 3 }
export function distributionForCount(count, weights = sectionDifficultyWeights) {
  const w = [weights.d1, weights.d2, weights.d3];
  const raw = w.map(x => x * count);
  const floors = raw.map(Math.floor);
  const remaining = count - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, rem: v - floors[i] }))
    .sort((a, b) => (b.rem - a.rem) || (b.i - a.i)); // tie -> harder band (higher i)
  const counts = [...floors];
  for (let k = 0; k < remaining; k++) counts[order[k].i]++;
  return { 1: counts[0], 2: counts[1], 3: counts[2] };
}

// Draw `count` questions from a single-topic pool matching the target difficulty
// distribution, so a section is a deliberate ramp rather than a random draw that
// can come out all-easy. Falls back to any remaining question if a band is short,
// so it never under-fills. Ids are unique within a topic pool.
function pickByDistribution(pool, count) {
  const dist = distributionForCount(count);
  const used = new Set();
  const picked = [];
  [1, 2, 3].forEach(d => {
    const atBand = shuffle(pool.filter(q => q.difficulty === d && !used.has(q.id)));
    for (let i = 0; i < dist[d] && i < atBand.length; i++) {
      picked.push(atBand[i]);
      used.add(atBand[i].id);
    }
  });
  if (picked.length < count) { // a band was short — backfill from anything left
    const rest = shuffle(pool.filter(q => !used.has(q.id)));
    for (const q of rest) {
      if (picked.length >= count) break;
      picked.push(q);
      used.add(q.id);
    }
  }
  return picked;
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
          section: key,
          sectionName: topics[key].name,
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
          section: key,
          sectionName: topics[key].name,
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

  // Section 2b: passage-anchored Vocabulary in Context from the MAIN bank (fix #10) —
  // pick one short anchored passage from englishData.vocabulary and take ~4 of its
  // word-in-context questions, difficulty-ramped. Ensures the fix-#10 anchored vocab
  // reaches the mock (the comprehension-passage vocab above uses a separate mock pool).
  if (englishTopics.vocabulary) {
    const anchored = englishTopics.vocabulary.questions.filter(q => q.questionType === 'passage' && q.passageId);
    if (anchored.length) {
      const byPassage = {};
      anchored.forEach(q => { (byPassage[q.passageId] = byPassage[q.passageId] || []).push(q); });
      const passageIds = Object.keys(byPassage);
      const pid = passageIds[Math.floor(Math.random() * passageIds.length)];
      const set = byPassage[pid];
      const anchoredQs = sortByDifficulty(pickByDistribution(set, Math.min(4, set.length)).map(q => ({
        question: q,
        topicKey: 'vocabulary',
        topicName: 'Vocabulary in Context',
        section: 'vocabulary',
        sectionName: 'Vocabulary in Context',
        passage: q.passage,
        passageTitle: q.passageTitle,
      })));
      sections.push(...anchoredQs);
    }
  }

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

  // Section 4: Spelling error-spotting (8 Qs) — targeted difficulty ramp
  if (englishTopics.spelling) {
    const spellingPool = englishTopics.spelling.questions;
    const spellingQs = pickByDistribution(spellingPool, 8).map(q => ({
      question: q,
      topicKey: 'spelling',
      topicName: 'Spelling',
      section: 'spelling',
      sectionName: 'Spelling',
    }));
    sections.push(...sortByDifficulty(spellingQs));
  }

  // Section 5: Punctuation error-spotting (8 Qs) — targeted difficulty ramp
  if (englishTopics.punctuation) {
    const punctPool = englishTopics.punctuation.questions;
    const punctQs = pickByDistribution(punctPool, 8).map(q => ({
      question: q,
      topicKey: 'punctuation',
      topicName: 'Punctuation',
      section: 'punctuation',
      sectionName: 'Punctuation',
    }));
    sections.push(...sortByDifficulty(punctQs));
  }

  // Section 6: Grammar/Cloze (8 Qs) — targeted difficulty ramp
  if (englishTopics.grammar) {
    const grammarPool = englishTopics.grammar.questions;
    const grammarQs = pickByDistribution(grammarPool, 8).map(q => ({
      question: q,
      topicKey: 'grammar',
      topicName: 'Grammar',
      section: 'grammar',
      sectionName: 'Grammar & Cloze',
    }));
    sections.push(...sortByDifficulty(grammarQs));
  }

  // Section 7: Cloze — authentic GL running-passage gap-fill (one passage, 8 gaps,
  // already ordered to ramp D1->D3 across the passage). Real "errors children write"
  // distractors (homophones, wrong verb forms, should-of, preposition traps).
  const clozePassage = mockClozePassages[Math.floor(Math.random() * mockClozePassages.length)];
  const clozeQs = clozePassage.clozeQuestions.map(q => ({
    question: q,
    topicKey: 'grammar',
    topicName: 'Cloze',
    section: 'cloze',
    sectionName: 'Cloze',
    passage: clozePassage.passage,
    passageTitle: clozePassage.title,
  }));
  sections.push(...clozeQs);

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
    const picked = pickByDistribution(pool, section.questions);
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

// Exported for tests (assembly is otherwise internal to the hook)
export { generateEnglishPaper, generateVRPaper, generateMathsPaper };

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
  const [mockTestFlags, setMockTestFlags] = useState({});
  const [mockTestQuestionTimes, setMockTestQuestionTimes] = useState({});
  const questionStartTimeRef = useRef(null);

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
    setMockTestFlags({});
    setMockTestQuestionTimes({});
    setMockTestCurrentIndex(0);
    setMockTestSubject(subject);
    setMockTestTimeLimit(timeLimit);
    setMockTestComplete(false);
    setMockTestStartTime(Date.now());
    questionStartTimeRef.current = Date.now();
    setMockTestActive(true);
  }, []);

  const answerQuestion = useCallback((index, answer) => {
    setMockTestAnswers(prev => ({ ...prev, [index]: answer }));
  }, []);

  const toggleFlag = useCallback((index) => {
    setMockTestFlags(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < mockTestQuestions.length) {
      // Record time spent on current question before navigating
      if (questionStartTimeRef.current) {
        const elapsed = Date.now() - questionStartTimeRef.current;
        setMockTestQuestionTimes(prev => ({
          ...prev,
          [mockTestCurrentIndex]: (prev[mockTestCurrentIndex] || 0) + elapsed,
        }));
      }
      questionStartTimeRef.current = Date.now();
      setMockTestCurrentIndex(index);
    }
  }, [mockTestQuestions.length, mockTestCurrentIndex]);

  const submitTest = useCallback(() => {
    // Record time on final question before completing
    if (questionStartTimeRef.current) {
      const elapsed = Date.now() - questionStartTimeRef.current;
      setMockTestQuestionTimes(prev => ({
        ...prev,
        [mockTestCurrentIndex]: (prev[mockTestCurrentIndex] || 0) + elapsed,
      }));
      questionStartTimeRef.current = null;
    }
    setMockTestComplete(true);
  }, [mockTestCurrentIndex]);

  const endMockTest = useCallback(() => {
    setMockTestActive(false);
    setMockTestQuestions([]);
    setMockTestAnswers({});
    setMockTestFlags({});
    setMockTestQuestionTimes({});
    questionStartTimeRef.current = null;
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
        timeMs: mockTestQuestionTimes[i] || 0,
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
      questionTimes: mockTestQuestionTimes,
    };

    return result;
  }, [mockTestComplete, mockTestQuestions, mockTestAnswers, mockTestSubject, mockTestTimeLimit, mockTestStartTime, mockTestQuestionTimes]);

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
    mockTestFlags,
    mockTestQuestionTimes,
    // Actions
    startMockTest,
    answerQuestion,
    toggleFlag,
    goToQuestion,
    submitTest,
    endMockTest,
    getResults,
  };
}

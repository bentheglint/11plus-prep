/**
 * Quiz Orchestration — extracted from App.js for testability
 *
 * These functions contain the business logic that was previously inline
 * in App.js handlers. They accept dependencies as parameters instead of
 * closing over React state, making them testable without rendering.
 */

/**
 * Check if an answer is correct for any question type.
 * Handles standard MCQ, select-two, and pick-from-sets.
 */
export function checkAnswerCorrectness(question, selectedAnswer, selectedPair) {
  if (question.questionType === 'select-two' || question.questionType === 'pick-from-sets') {
    const cp = question.correctPair;
    if (question.questionType === 'select-two') {
      return selectedPair.length === 2 &&
        ((selectedPair[0] === cp[0] && selectedPair[1] === cp[1]) ||
         (selectedPair[0] === cp[1] && selectedPair[1] === cp[0]));
    } else {
      return selectedPair[0] === cp[0] && selectedPair[1] === cp[1];
    }
  }
  return selectedAnswer === question.correct;
}

/**
 * Normalise a selected answer into the typed shape stored in D1.
 * The Quiz Detail View relies on reading this back correctly per question type.
 *
 *   MCQ (standard)   → integer index,    e.g. 2
 *   select-two       → sorted pair,      e.g. [1, 3]  (a < b for unordered comparison)
 *   pick-from-sets   → object,           e.g. { A: 1, B: 2 }  (set-ordered)
 *
 * Returns null if the input is empty/missing (so the save path can pass null through
 * without introducing fake data).
 */
export function normaliseSelectedAnswer(question, selectedAnswer, selectedPair) {
  if (question.questionType === 'select-two') {
    if (!Array.isArray(selectedPair) || selectedPair.length !== 2) return null;
    const [a, b] = selectedPair;
    return a <= b ? [a, b] : [b, a];
  }
  if (question.questionType === 'pick-from-sets') {
    if (!Array.isArray(selectedPair) || selectedPair.length !== 2) return null;
    // Pair is stored as [setAIndex, setBIndex] in quiz flow — preserve that semantic
    return { A: selectedPair[0], B: selectedPair[1] };
  }
  // Standard MCQ
  if (selectedAnswer == null) return null;
  return selectedAnswer;
}

/**
 * Whether to show a post-question tip based on wrong answer count.
 * Tips appear on the 1st, 4th, 7th, 10th, ... wrong answer (every 3rd).
 */
export function shouldShowPostQuestionTip(wrongAnswerCount) {
  return wrongAnswerCount % 3 === 1;
}

/**
 * Record quiz results — called when a regular quiz finishes.
 * Fans out to: saveQuestionResult (per Q), savePracticeSession,
 * recordQuizCompletion, calculateQuizPP, awardPP.
 *
 * IMPORTANT: This must run inside a userData.startBatch()/endBatch() window
 * so the aggregate quiz row and per-question rows commit atomically. The
 * caller is responsible for opening/closing the batch AND calling
 * saveQuizResult within that same window — see App.js handleNextQuestion.
 *
 * @param {Array} sessionQuestions - quiz questions with { question, topicKey }
 * @param {Array} sessionAnswers - answers with { correct, timeSpentMs, difficulty, selectedAnswer, selectedPair }
 * @param {Object} deps - injected dependencies (userData, streaksAndPP, etc.)
 */
export function recordQuizResults(sessionQuestions, sessionAnswers, deps) {
  const { userData, streaksAndPP, selectedSubject, quizMode, selectedTopic, topicPerformance, sessionId } = deps;
  let correctCount = 0;

  // Save individual question results
  sessionQuestions.forEach((q, i) => {
    const answer = sessionAnswers[i] || {};
    const isCorrect = answer.correct || false;
    if (isCorrect) correctCount++;
    const normalisedAnswer = normaliseSelectedAnswer(q.question, answer.selectedAnswer, answer.selectedPair);
    userData.saveQuestionResult({
      id: Date.now() + i,
      date: new Date().toISOString(),
      questionId: q.question.id,
      topicKey: q.topicKey,
      subject: selectedSubject,
      difficulty: q.question.difficulty || 2,
      correct: isCorrect,
      timeSpentMs: answer.timeSpentMs || 0,
      mode: quizMode || 'focused',
      sessionId,
      selectedAnswer: normalisedAnswer,
    });
  });

  // Save practice session log
  userData.savePracticeSession({
    id: sessionId,
    date: new Date().toISOString().split('T')[0],
    mode: quizMode || 'focused',
    subject: selectedSubject,
    topicKey: quizMode === 'daily' ? null : selectedTopic,
    questionsAttempted: sessionQuestions.length,
    questionsCorrect: correctCount,
  });

  // Update streak
  streaksAndPP.recordQuizCompletion();

  // Award Prep Points
  const percentage = Math.round((correctCount / sessionQuestions.length) * 100);
  const isFirstTime = selectedTopic && !topicPerformance[selectedTopic];
  const ppCalc = streaksAndPP.calculateQuizPP(
    sessionQuestions.length, correctCount, percentage, isFirstTime
  );
  streaksAndPP.awardPP(ppCalc.total, 'Quiz completed');

  return { correctCount, percentage };
}

/**
 * Save mock test results — called when a mock test completes.
 * Returns the aggregate result object for the caller to use.
 *
 * @param {Array} mockQuestions - array of { question, topicKey }
 * @param {Array} mockAnswers - array of answer values (index or [pair])
 * @param {Object} mockTestState - { mockTestSubject, mockTestQuestionTimes }
 * @param {Object} mockResults - from mockTest.getResults()
 * @param {Object} deps - { userData, streaksAndPP }
 */
export function saveMockTestResults(mockQuestions, mockAnswers, mockTestState, mockResults, deps) {
  const { userData, streaksAndPP } = deps;
  const sessionId = Date.now();
  let mockCorrectCount = 0;

  mockQuestions.forEach((q, i) => {
    const answer = mockAnswers[i];
    const question = q.question;
    const isCorrect = checkAnswerCorrectness(
      question,
      typeof answer === 'number' ? answer : null,
      Array.isArray(answer) ? answer : []
    );
    if (isCorrect) mockCorrectCount++;

    userData.saveQuestionResult({
      id: sessionId + i,
      date: new Date().toISOString(),
      questionId: question.id,
      topicKey: q.topicKey,
      subject: mockTestState.mockTestSubject,
      difficulty: question.difficulty || 2,
      correct: isCorrect,
      timeSpentMs: mockTestState.mockTestQuestionTimes[i] || 0,
      mode: 'mock',
      sessionId,
    });
  });

  // Save practice session + update streak + award PP
  userData.savePracticeSession({
    id: sessionId,
    date: new Date().toISOString().split('T')[0],
    mode: 'mock',
    subject: mockTestState.mockTestSubject,
    topicKey: null,
    questionsAttempted: mockQuestions.length,
    questionsCorrect: mockCorrectCount,
  });
  streaksAndPP.recordQuizCompletion();
  const pct = Math.round((mockCorrectCount / mockQuestions.length) * 100);
  const ppCalc = streaksAndPP.calculateQuizPP(mockQuestions.length, mockCorrectCount, pct, false);
  streaksAndPP.awardPP(ppCalc.total, 'Mock test completed');

  // Build aggregate result for mock test history
  const aggregate = {
    id: sessionId,
    date: new Date().toISOString(),
    subject: mockTestState.mockTestSubject,
    totalQuestions: mockQuestions.length,
    totalCorrect: mockCorrectCount,
    percentage: pct,
    timeTaken: mockResults.timeTaken,
    timeLimit: mockResults.timeLimit,
    sections: Object.entries(mockResults.sectionResults).map(([name, data]) => ({
      name,
      correct: data.correct,
      total: data.total,
      percentage: Math.round((data.correct / data.total) * 100),
    })),
  };

  userData.saveMockTestResult(aggregate);

  return aggregate;
}

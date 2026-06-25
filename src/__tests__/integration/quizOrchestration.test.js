/**
 * Quiz Orchestration Integration Tests (Testing Strategy Part 5, Priority 1)
 *
 * Tests the extracted orchestration functions that control the quiz and mock
 * test save pipelines. These are the functions App.js calls to fan out side
 * effects — the real integration boundary where bugs live.
 */

import {
  checkAnswerCorrectness,
  buildTutorContext,
  shouldShowPostQuestionTip,
  recordQuizResults,
  saveMockTestResults,
  normaliseSelectedAnswer,
} from '../../utils/quizOrchestration';

// ── Helpers ──

function mockUserData() {
  return {
    saveQuestionResult: jest.fn(),
    savePracticeSession: jest.fn(),
    saveMockTestResult: jest.fn(),
  };
}

function mockStreaksAndPP() {
  return {
    recordQuizCompletion: jest.fn(),
    calculateQuizPP: jest.fn(() => ({ total: 15 })),
    awardPP: jest.fn(),
  };
}

function makeQuestion(id, topicKey, correct = 2, difficulty = 2) {
  return {
    question: { id, correct, difficulty, options: ['A', 'B', 'C', 'D', 'E'] },
    topicKey,
    topicName: topicKey,
  };
}

function makeAnswer(correct, timeSpentMs = 30000, difficulty = 2) {
  return { correct, timeSpentMs, difficulty };
}

// ── checkAnswerCorrectness ──

describe('checkAnswerCorrectness', () => {
  it('returns true for correct standard MCQ answer', () => {
    const q = { correct: 3 };
    expect(checkAnswerCorrectness(q, 3, [])).toBe(true);
  });

  it('returns false for wrong standard MCQ answer', () => {
    const q = { correct: 3 };
    expect(checkAnswerCorrectness(q, 1, [])).toBe(false);
  });

  it('handles select-two with correct pair (same order)', () => {
    const q = { questionType: 'select-two', correctPair: [1, 4] };
    expect(checkAnswerCorrectness(q, null, [1, 4])).toBe(true);
  });

  it('handles select-two with correct pair (reversed order)', () => {
    const q = { questionType: 'select-two', correctPair: [1, 4] };
    expect(checkAnswerCorrectness(q, null, [4, 1])).toBe(true);
  });

  it('returns false for wrong select-two pair', () => {
    const q = { questionType: 'select-two', correctPair: [1, 4] };
    expect(checkAnswerCorrectness(q, null, [1, 3])).toBe(false);
  });

  it('handles pick-from-sets (order matters)', () => {
    const q = { questionType: 'pick-from-sets', correctPair: [2, 3] };
    expect(checkAnswerCorrectness(q, null, [2, 3])).toBe(true);
    expect(checkAnswerCorrectness(q, null, [3, 2])).toBe(false);
  });
});

// ── shouldShowPostQuestionTip ──

describe('shouldShowPostQuestionTip', () => {
  it('shows tip on 1st wrong answer', () => {
    expect(shouldShowPostQuestionTip(1)).toBe(true);
  });

  it('does not show on 2nd wrong answer', () => {
    expect(shouldShowPostQuestionTip(2)).toBe(false);
  });

  it('does not show on 3rd wrong answer', () => {
    expect(shouldShowPostQuestionTip(3)).toBe(false);
  });

  it('shows tip on 4th wrong answer', () => {
    expect(shouldShowPostQuestionTip(4)).toBe(true);
  });

  it('shows tip on 7th wrong answer', () => {
    expect(shouldShowPostQuestionTip(7)).toBe(true);
  });

  it('does not show on 5th or 6th', () => {
    expect(shouldShowPostQuestionTip(5)).toBe(false);
    expect(shouldShowPostQuestionTip(6)).toBe(false);
  });
});

// ── normaliseSelectedAnswer ──
// Ensures the Quiz Detail View can round-trip the child's selection through D1.
// The stored shape must match what the review renderers expect per question type.

describe('normaliseSelectedAnswer', () => {
  test('MCQ: returns the selectedAnswer integer', () => {
    const q = { correct: 2, options: ['a','b','c','d','e'] };
    expect(normaliseSelectedAnswer(q, 3, [])).toBe(3);
    expect(normaliseSelectedAnswer(q, 0, [])).toBe(0);
  });

  test('MCQ: returns null when nothing selected', () => {
    const q = { correct: 2 };
    expect(normaliseSelectedAnswer(q, null, [])).toBe(null);
    expect(normaliseSelectedAnswer(q, undefined, [])).toBe(null);
  });

  test('select-two: returns a sorted pair (unordered comparison)', () => {
    const q = { questionType: 'select-two', correctPair: [1, 3] };
    // Child picks in 3, 1 order — stored form must be sorted [1, 3]
    expect(normaliseSelectedAnswer(q, null, [3, 1])).toEqual([1, 3]);
    // Child picks in correct order — same sorted output
    expect(normaliseSelectedAnswer(q, null, [1, 3])).toEqual([1, 3]);
  });

  test('select-two: returns null for incomplete selection', () => {
    const q = { questionType: 'select-two', correctPair: [1, 3] };
    expect(normaliseSelectedAnswer(q, null, [2])).toBe(null);
    expect(normaliseSelectedAnswer(q, null, [])).toBe(null);
  });

  test('pick-from-sets: returns {A, B} with set semantics preserved', () => {
    const q = { questionType: 'pick-from-sets', correctPair: [2, 1] };
    // selectedPair is stored as [setA_index, setB_index]
    expect(normaliseSelectedAnswer(q, null, [2, 1])).toEqual({ A: 2, B: 1 });
    expect(normaliseSelectedAnswer(q, null, [0, 4])).toEqual({ A: 0, B: 4 });
  });

  test('pick-from-sets: returns null for incomplete selection', () => {
    const q = { questionType: 'pick-from-sets', correctPair: [2, 1] };
    expect(normaliseSelectedAnswer(q, null, [1])).toBe(null);
    expect(normaliseSelectedAnswer(q, null, [])).toBe(null);
  });
});

// ── recordQuizResults ──

describe('recordQuizResults', () => {
  const questions = [
    makeQuestion(1, 'percentages'),
    makeQuestion(2, 'percentages'),
    makeQuestion(3, 'percentages'),
  ];
  const answers = [
    makeAnswer(true),
    makeAnswer(false),
    makeAnswer(true),
  ];

  it('calls saveQuestionResult once per question', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(3);
  });

  it('saves correct/incorrect status per question', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    const calls = ud.saveQuestionResult.mock.calls;
    expect(calls[0][0].correct).toBe(true);
    expect(calls[1][0].correct).toBe(false);
    expect(calls[2][0].correct).toBe(true);
  });

  it('calls savePracticeSession once with correct aggregate', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    expect(ud.savePracticeSession).toHaveBeenCalledTimes(1);
    const session = ud.savePracticeSession.mock.calls[0][0];
    expect(session.questionsAttempted).toBe(3);
    expect(session.questionsCorrect).toBe(2);
    expect(session.subject).toBe('maths');
    expect(session.mode).toBe('focused');
  });

  it('calls recordQuizCompletion exactly once', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    expect(sp.recordQuizCompletion).toHaveBeenCalledTimes(1);
  });

  it('calculates and awards PP', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    expect(sp.calculateQuizPP).toHaveBeenCalledTimes(1);
    // 2 out of 3 correct = 67%
    expect(sp.calculateQuizPP.mock.calls[0][0]).toBe(3); // total
    expect(sp.calculateQuizPP.mock.calls[0][1]).toBe(2); // correct
    expect(sp.calculateQuizPP.mock.calls[0][2]).toBe(67); // percentage
    expect(sp.awardPP).toHaveBeenCalledWith(15, 'Quiz completed');
  });

  it('sets topicKey to null for daily mode', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'daily',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    const session = ud.savePracticeSession.mock.calls[0][0];
    expect(session.topicKey).toBeNull();
    expect(session.mode).toBe('daily');
  });

  it('returns correct count and percentage', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    const result = recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    expect(result.correctCount).toBe(2);
    expect(result.percentage).toBe(67);
  });

  // ── Calling order ──

  it('calls dependencies in correct order: saves → session → streak → PP', () => {
    const callOrder = [];
    const ud = {
      saveQuestionResult: jest.fn(() => callOrder.push('saveQuestionResult')),
      savePracticeSession: jest.fn(() => callOrder.push('savePracticeSession')),
      saveMockTestResult: jest.fn(),
    };
    const sp = {
      recordQuizCompletion: jest.fn(() => callOrder.push('recordQuizCompletion')),
      calculateQuizPP: jest.fn(() => { callOrder.push('calculateQuizPP'); return { total: 10 }; }),
      awardPP: jest.fn(() => callOrder.push('awardPP')),
    };

    recordQuizResults(questions, answers, {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    });

    // All question results saved before session/streak/PP
    const firstSessionIdx = callOrder.indexOf('savePracticeSession');
    const lastSaveIdx = callOrder.lastIndexOf('saveQuestionResult');
    expect(lastSaveIdx).toBeLessThan(firstSessionIdx);

    // Session before streak, streak before PP
    const streakIdx = callOrder.indexOf('recordQuizCompletion');
    const ppIdx = callOrder.indexOf('awardPP');
    expect(firstSessionIdx).toBeLessThan(streakIdx);
    expect(streakIdx).toBeLessThan(ppIdx);
  });

  // ── Failure paths ──

  it('throws if saveQuestionResult fails mid-way (no partial recovery)', () => {
    const ud = mockUserData();
    ud.saveQuestionResult.mockImplementationOnce(() => {}) // Q1 succeeds
      .mockImplementationOnce(() => { throw new Error('storage full'); }); // Q2 fails
    const sp = mockStreaksAndPP();

    expect(() => {
      recordQuizResults(questions, answers, {
        userData: ud, streaksAndPP: sp,
        selectedSubject: 'maths', quizMode: 'focused',
        selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
      });
    }).toThrow('storage full');

    // Q1 was saved, Q2 threw, Q3 and downstream never called
    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(2);
    expect(ud.savePracticeSession).not.toHaveBeenCalled();
    expect(sp.recordQuizCompletion).not.toHaveBeenCalled();
    expect(sp.awardPP).not.toHaveBeenCalled();
  });

  it('throws if savePracticeSession fails (streak and PP not awarded)', () => {
    const ud = mockUserData();
    ud.savePracticeSession.mockImplementation(() => { throw new Error('write failed'); });
    const sp = mockStreaksAndPP();

    expect(() => {
      recordQuizResults(questions, answers, {
        userData: ud, streaksAndPP: sp,
        selectedSubject: 'maths', quizMode: 'focused',
        selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
      });
    }).toThrow('write failed');

    // Question results were saved, but streak/PP were not
    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(3);
    expect(sp.recordQuizCompletion).not.toHaveBeenCalled();
    expect(sp.awardPP).not.toHaveBeenCalled();
  });

  it('throws if recordQuizCompletion fails (PP not awarded)', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    sp.recordQuizCompletion.mockImplementation(() => { throw new Error('streak error'); });

    expect(() => {
      recordQuizResults(questions, answers, {
        userData: ud, streaksAndPP: sp,
        selectedSubject: 'maths', quizMode: 'focused',
        selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
      });
    }).toThrow('streak error');

    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(3);
    expect(ud.savePracticeSession).toHaveBeenCalledTimes(1);
    expect(sp.awardPP).not.toHaveBeenCalled();
  });

  // ── Idempotency ──

  it('calling twice doubles all side effects (not idempotent)', () => {
    const ud = mockUserData();
    const sp = mockStreaksAndPP();
    const deps = {
      userData: ud, streaksAndPP: sp,
      selectedSubject: 'maths', quizMode: 'focused',
      selectedTopic: 'percentages', topicPerformance: {}, sessionId: 999,
    };

    recordQuizResults(questions, answers, deps);
    recordQuizResults(questions, answers, deps);

    // Documents that duplicate calls are NOT safe
    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(6); // 3 + 3
    expect(ud.savePracticeSession).toHaveBeenCalledTimes(2);
    expect(sp.recordQuizCompletion).toHaveBeenCalledTimes(2);
    expect(sp.awardPP).toHaveBeenCalledTimes(2);
  });
});

// ── saveMockTestResults ──

describe('saveMockTestResults', () => {
  function makeMockQuestions(count) {
    return Array.from({ length: count }, (_, i) => ({
      question: { id: i + 1, correct: 2, difficulty: 2, options: ['A', 'B', 'C', 'D', 'E'] },
      topicKey: 'percentages',
    }));
  }

  const mockResults = {
    timeTaken: 1800000,
    timeLimit: 2700000,
    sectionResults: {
      'Number': { correct: 8, total: 10 },
      'Algebra': { correct: 7, total: 10 },
    },
  };

  it('calls saveQuestionResult for each question', () => {
    const questions = makeMockQuestions(5);
    const answers = [2, 2, 2, 1, 0]; // 3 correct, 2 wrong
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    saveMockTestResults(questions, answers,
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000, 5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(ud.saveQuestionResult).toHaveBeenCalledTimes(5);
  });

  it('correctly checks standard MCQ answers', () => {
    const questions = makeMockQuestions(3);
    const answers = [2, 1, 2]; // correct, wrong, correct
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    saveMockTestResults(questions, answers,
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    const calls = ud.saveQuestionResult.mock.calls;
    expect(calls[0][0].correct).toBe(true);
    expect(calls[1][0].correct).toBe(false);
    expect(calls[2][0].correct).toBe(true);
  });

  it('handles select-two answers in mock tests', () => {
    const questions = [{
      question: { id: 1, questionType: 'select-two', correctPair: [0, 3], difficulty: 2 },
      topicKey: 'hiddenWords',
    }];
    const answers = [[3, 0]]; // reversed order — should be correct
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    saveMockTestResults(questions, answers,
      { mockTestSubject: 'verbalreasoning', mockTestQuestionTimes: [5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(ud.saveQuestionResult.mock.calls[0][0].correct).toBe(true);
  });

  it('calls savePracticeSession with mode mock', () => {
    const questions = makeMockQuestions(3);
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    saveMockTestResults(questions, [2, 2, 2],
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(ud.savePracticeSession).toHaveBeenCalledTimes(1);
    expect(ud.savePracticeSession.mock.calls[0][0].mode).toBe('mock');
    expect(ud.savePracticeSession.mock.calls[0][0].topicKey).toBeNull();
  });

  it('calls recordQuizCompletion and awardPP', () => {
    const questions = makeMockQuestions(3);
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    saveMockTestResults(questions, [2, 2, 2],
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(sp.recordQuizCompletion).toHaveBeenCalledTimes(1);
    expect(sp.awardPP).toHaveBeenCalledWith(15, 'Mock test completed');
  });

  it('saves aggregate mock test result with section breakdown', () => {
    const questions = makeMockQuestions(3);
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    const result = saveMockTestResults(questions, [2, 2, 2],
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(ud.saveMockTestResult).toHaveBeenCalledTimes(1);
    const saved = ud.saveMockTestResult.mock.calls[0][0];
    expect(saved.subject).toBe('maths');
    expect(saved.totalQuestions).toBe(3);
    expect(saved.totalCorrect).toBe(3);
    expect(saved.percentage).toBe(100);
    expect(saved.sections).toHaveLength(2);
    expect(saved.sections[0].name).toBe('Number');
  });

  it('returns aggregate result object', () => {
    const questions = makeMockQuestions(2);
    const ud = mockUserData();
    const sp = mockStreaksAndPP();

    const result = saveMockTestResults(questions, [2, 1],
      { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000] },
      mockResults, { userData: ud, streaksAndPP: sp }
    );

    expect(result.totalQuestions).toBe(2);
    expect(result.totalCorrect).toBe(1);
    expect(result.percentage).toBe(50);
    expect(result.timeTaken).toBe(1800000);
  });

  // ── Failure paths ──

  it('throws if saveQuestionResult fails (downstream not called)', () => {
    const questions = makeMockQuestions(3);
    const ud = mockUserData();
    ud.saveQuestionResult.mockImplementationOnce(() => {})
      .mockImplementationOnce(() => { throw new Error('storage full'); });
    const sp = mockStreaksAndPP();

    expect(() => {
      saveMockTestResults(questions, [2, 2, 2],
        { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000, 5000] },
        mockResults, { userData: ud, streaksAndPP: sp }
      );
    }).toThrow('storage full');

    expect(ud.savePracticeSession).not.toHaveBeenCalled();
    expect(sp.recordQuizCompletion).not.toHaveBeenCalled();
    expect(ud.saveMockTestResult).not.toHaveBeenCalled();
  });

  it('throws if saveMockTestResult fails (after PP awarded)', () => {
    const questions = makeMockQuestions(2);
    const ud = mockUserData();
    ud.saveMockTestResult.mockImplementation(() => { throw new Error('write failed'); });
    const sp = mockStreaksAndPP();

    expect(() => {
      saveMockTestResults(questions, [2, 2],
        { mockTestSubject: 'maths', mockTestQuestionTimes: [5000, 5000] },
        mockResults, { userData: ud, streaksAndPP: sp }
      );
    }).toThrow('write failed');

    // PP was already awarded before saveMockTestResult threw
    expect(sp.awardPP).toHaveBeenCalledTimes(1);
    expect(ud.savePracticeSession).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────
// buildTutorContext — AI tutor question context per question type.
// Regression: select-two questions used to hit the generic options/correct branch
// and feed the tutor "options[undefined]" as the correct answer + "not yet answered".
// ──────────────────────────────────────────────
describe('buildTutorContext', () => {
  const hiddenWords = {
    questionType: 'select-two',
    question: 'A 4-letter word is hidden across two of these adjacent words. Find the two words.',
    options: ['The', 'top', 'end', 'is', 'gone'],
    correctPair: [1, 2], // 'top' + 'end' hide OPEN
    explanation: "The word OPEN is hidden across 'tOP' and 'ENd'. ✓",
  };

  it('select-two: never emits "undefined" and names the correct pair (the bug)', () => {
    const { questionContext } = buildTutorContext(hiddenWords, null, [1, 2]);
    expect(questionContext).not.toMatch(/undefined/);
    expect(questionContext).toContain('"top" and "end"');
  });

  it('select-two: child answered correctly → CORRECT + flags set', () => {
    const r = buildTutorContext(hiddenWords, null, [1, 2]);
    expect(r.hasAnswered).toBe(true);
    expect(r.wasAnsweredCorrect).toBe(true);
    expect(r.questionContext).toContain('CORRECT');
    expect(r.questionContext).toContain('The child selected: "top" and "end"');
  });

  it('select-two: order-insensitive correct answer', () => {
    expect(buildTutorContext(hiddenWords, null, [2, 1]).wasAnsweredCorrect).toBe(true);
  });

  it('select-two: child answered wrong → wrong + answered', () => {
    const r = buildTutorContext(hiddenWords, null, [0, 1]);
    expect(r.hasAnswered).toBe(true);
    expect(r.wasAnsweredCorrect).toBe(false);
    expect(r.questionContext).toContain('wrong');
  });

  it('select-two: not answered → hasAnswered false, not yet answered', () => {
    const r = buildTutorContext(hiddenWords, null, []);
    expect(r.hasAnswered).toBe(false);
    expect(r.wasAnsweredCorrect).toBe(false);
    expect(r.questionContext).toContain('not yet answered');
    expect(r.questionContext).toContain('has not answered yet');
  });

  it('standard MCQ: unchanged behaviour (regression)', () => {
    const mcq = { question: 'What is 2+2?', options: ['3', '4', '5', '6', '7'], correct: 1 };
    const correct = buildTutorContext(mcq, 1, []);
    expect(correct.hasAnswered).toBe(true);
    expect(correct.wasAnsweredCorrect).toBe(true);
    expect(correct.questionContext).toContain('The correct answer is: B) 4');
    expect(correct.questionContext).toContain('CORRECT');

    const wrong = buildTutorContext(mcq, 0, []);
    expect(wrong.wasAnsweredCorrect).toBe(false);
    expect(wrong.questionContext).toContain('wrong');

    const unanswered = buildTutorContext(mcq, null, []);
    expect(unanswered.hasAnswered).toBe(false);
    expect(unanswered.questionContext).toContain('not yet answered');
  });

  it('pick-from-sets: detects answer in selectedPair + names the pair', () => {
    const pfs = { questionType: 'pick-from-sets', setA: ['big', 'small'], setB: ['tiny', 'huge'], correctPair: [0, 1] };
    const r = buildTutorContext(pfs, null, [0, 1]);
    expect(r.hasAnswered).toBe(true);
    expect(r.wasAnsweredCorrect).toBe(true);
    expect(r.questionContext).toContain('"big" and "huge"');
    expect(r.questionContext).not.toMatch(/undefined/);

    expect(buildTutorContext(pfs, null, []).hasAnswered).toBe(false);
  });
});

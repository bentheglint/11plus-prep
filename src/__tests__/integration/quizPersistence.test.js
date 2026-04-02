/**
 * Quiz Persistence Integration Tests (Testing Strategy Part 5)
 *
 * Tests the extracted persistence helpers that App.js uses for
 * active-quiz save/restore. These exercise the real production logic:
 * key construction, save state building, expiry checking, and
 * parse-and-validate with corrupt/missing/expired data.
 */

import {
  getQuizSaveKey,
  buildQuizSaveState,
  isQuizExpired,
  parseAndValidateQuiz,
} from '../../utils/quizPersistence';

// ── getQuizSaveKey ──

describe('getQuizSaveKey', () => {
  it('constructs user-prefixed key', () => {
    expect(getQuizSaveKey('Alice')).toBe('user:Alice:active-quiz');
  });

  it('returns null for falsy user', () => {
    expect(getQuizSaveKey(null)).toBeNull();
    expect(getQuizSaveKey('')).toBeNull();
    expect(getQuizSaveKey(undefined)).toBeNull();
  });

  it('handles usernames with spaces', () => {
    expect(getQuizSaveKey('Ben Jackson')).toBe('user:Ben Jackson:active-quiz');
  });
});

// ── buildQuizSaveState ──

describe('buildQuizSaveState', () => {
  const fields = {
    currentView: 'quiz',
    selectedSubject: 'maths',
    selectedTopic: 'percentages',
    quizMode: 'focused',
    quizQuestions: [{ question: { id: 1 } }],
    currentQuestionIndex: 0,
    answers: [],
    selectedAnswer: null,
    selectedPair: [],
    showFeedback: false,
    sessionId: 12345,
  };

  it('includes all required fields', () => {
    const state = buildQuizSaveState(fields);
    expect(state.currentView).toBe('quiz');
    expect(state.selectedSubject).toBe('maths');
    expect(state.selectedTopic).toBe('percentages');
    expect(state.quizMode).toBe('focused');
    expect(state.quizQuestions).toHaveLength(1);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.answers).toEqual([]);
    expect(state.selectedAnswer).toBeNull();
    expect(state.selectedPair).toEqual([]);
    expect(state.showFeedback).toBe(false);
    expect(state.sessionId).toBe(12345);
  });

  it('stamps savedAt automatically', () => {
    const before = Date.now();
    const state = buildQuizSaveState(fields);
    const after = Date.now();
    expect(state.savedAt).toBeGreaterThanOrEqual(before);
    expect(state.savedAt).toBeLessThanOrEqual(after);
  });

  it('does not leak extra fields from input', () => {
    const state = buildQuizSaveState({ ...fields, extraStuff: 'should not appear' });
    expect(state).not.toHaveProperty('extraStuff');
  });
});

// ── isQuizExpired ──

describe('isQuizExpired', () => {
  it('returns false for state saved just now', () => {
    expect(isQuizExpired({ savedAt: Date.now() })).toBe(false);
  });

  it('returns false at 23 hours', () => {
    const twentyThreeHoursAgo = Date.now() - (23 * 60 * 60 * 1000);
    expect(isQuizExpired({ savedAt: twentyThreeHoursAgo })).toBe(false);
  });

  it('returns true at 25 hours', () => {
    const twentyFiveHoursAgo = Date.now() - (25 * 60 * 60 * 1000);
    expect(isQuizExpired({ savedAt: twentyFiveHoursAgo })).toBe(true);
  });

  it('returns true for missing savedAt', () => {
    expect(isQuizExpired({})).toBe(true);
    expect(isQuizExpired({ savedAt: 'not a number' })).toBe(true);
  });

  it('returns true for null state', () => {
    expect(isQuizExpired(null)).toBe(true);
  });

  it('respects custom maxAgeMs', () => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    expect(isQuizExpired({ savedAt: oneHourAgo }, 30 * 60 * 1000)).toBe(true); // 30min max
    expect(isQuizExpired({ savedAt: oneHourAgo }, 2 * 60 * 60 * 1000)).toBe(false); // 2h max
  });
});

// ── parseAndValidateQuiz ──

describe('parseAndValidateQuiz', () => {
  function makeValidJson(overrides = {}) {
    return JSON.stringify({
      currentView: 'quiz',
      selectedSubject: 'maths',
      selectedTopic: 'percentages',
      quizMode: 'focused',
      quizQuestions: [
        { question: { id: 1, correct: 2, options: ['A', 'B', 'C', 'D', 'E'] } },
      ],
      currentQuestionIndex: 0,
      answers: [{ questionId: 1, correct: true }],
      selectedAnswer: null,
      selectedPair: [],
      showFeedback: false,
      sessionId: 12345,
      savedAt: Date.now(),
      ...overrides,
    });
  }

  it('returns valid state for well-formed JSON', () => {
    const result = parseAndValidateQuiz(makeValidJson());
    expect(result).not.toBeNull();
    expect(result.currentView).toBe('quiz');
    expect(result.selectedSubject).toBe('maths');
    expect(result.quizQuestions).toHaveLength(1);
  });

  it('returns null for corrupt JSON', () => {
    expect(parseAndValidateQuiz('{broken json!!!')).toBeNull();
  });

  it('returns null for null/undefined/empty input', () => {
    expect(parseAndValidateQuiz(null)).toBeNull();
    expect(parseAndValidateQuiz(undefined)).toBeNull();
    expect(parseAndValidateQuiz('')).toBeNull();
  });

  it('returns null for expired state', () => {
    const expired = makeValidJson({ savedAt: Date.now() - (25 * 60 * 60 * 1000) });
    expect(parseAndValidateQuiz(expired)).toBeNull();
  });

  it('returns valid state at 23 hours (not expired)', () => {
    const recent = makeValidJson({ savedAt: Date.now() - (23 * 60 * 60 * 1000) });
    expect(parseAndValidateQuiz(recent)).not.toBeNull();
  });

  it('returns null when currentView is not quiz', () => {
    expect(parseAndValidateQuiz(makeValidJson({ currentView: 'home' }))).toBeNull();
  });

  it('returns null when quizQuestions is empty', () => {
    expect(parseAndValidateQuiz(makeValidJson({ quizQuestions: [] }))).toBeNull();
  });

  it('returns null when quizQuestions is missing', () => {
    const json = makeValidJson();
    const parsed = JSON.parse(json);
    delete parsed.quizQuestions;
    expect(parseAndValidateQuiz(JSON.stringify(parsed))).toBeNull();
  });

  it('applies defaults for missing optional fields', () => {
    const json = makeValidJson();
    const parsed = JSON.parse(json);
    delete parsed.answers;
    delete parsed.selectedPair;
    delete parsed.showFeedback;
    delete parsed.sessionId;

    const result = parseAndValidateQuiz(JSON.stringify(parsed));
    expect(result).not.toBeNull();
    expect(result.answers).toEqual([]);
    expect(result.selectedPair).toEqual([]);
    expect(result.showFeedback).toBe(false);
    expect(typeof result.sessionId).toBe('number');
  });
});

// ── Full round-trip through localStorage ──

describe('Save/restore round-trip', () => {
  beforeEach(() => localStorage.clear());

  it('buildQuizSaveState → localStorage → parseAndValidateQuiz round-trips', () => {
    const key = getQuizSaveKey('TestUser');
    const saveState = buildQuizSaveState({
      currentView: 'quiz',
      selectedSubject: 'english',
      selectedTopic: 'comprehension',
      quizMode: 'focused',
      quizQuestions: [
        { question: { id: 10, correct: 1, options: ['A', 'B', 'C', 'D', 'E'] } },
        { question: { id: 11, correct: 3, options: ['A', 'B', 'C', 'D', 'E'] } },
      ],
      currentQuestionIndex: 1,
      answers: [{ questionId: 10, correct: true, timeSpentMs: 5000 }],
      selectedAnswer: null,
      selectedPair: [],
      showFeedback: false,
      sessionId: 99999,
    });

    localStorage.setItem(key, JSON.stringify(saveState));
    const restored = parseAndValidateQuiz(localStorage.getItem(key));

    expect(restored).not.toBeNull();
    expect(restored.selectedSubject).toBe('english');
    expect(restored.selectedTopic).toBe('comprehension');
    expect(restored.quizQuestions).toHaveLength(2);
    expect(restored.currentQuestionIndex).toBe(1);
    expect(restored.answers).toHaveLength(1);
    expect(restored.answers[0].correct).toBe(true);
    expect(restored.sessionId).toBe(99999);
  });

  it('each user has isolated quiz state', () => {
    const aliceKey = getQuizSaveKey('Alice');
    const bobKey = getQuizSaveKey('Bob');

    expect(aliceKey).not.toBe(bobKey);

    const aliceState = buildQuizSaveState({
      currentView: 'quiz', selectedSubject: 'maths', selectedTopic: 'algebra',
      quizMode: 'focused', quizQuestions: [{ question: { id: 1 } }],
      currentQuestionIndex: 0, answers: [], selectedAnswer: null,
      selectedPair: [], showFeedback: false, sessionId: 1,
    });
    const bobState = buildQuizSaveState({
      currentView: 'quiz', selectedSubject: 'english', selectedTopic: 'spelling',
      quizMode: 'daily', quizQuestions: [{ question: { id: 2 } }],
      currentQuestionIndex: 0, answers: [], selectedAnswer: null,
      selectedPair: [], showFeedback: false, sessionId: 2,
    });

    localStorage.setItem(aliceKey, JSON.stringify(aliceState));
    localStorage.setItem(bobKey, JSON.stringify(bobState));

    const restoredAlice = parseAndValidateQuiz(localStorage.getItem(aliceKey));
    const restoredBob = parseAndValidateQuiz(localStorage.getItem(bobKey));

    expect(restoredAlice.selectedSubject).toBe('maths');
    expect(restoredBob.selectedSubject).toBe('english');

    // Removing Alice doesn't affect Bob
    localStorage.removeItem(aliceKey);
    expect(parseAndValidateQuiz(localStorage.getItem(aliceKey))).toBeNull();
    expect(parseAndValidateQuiz(localStorage.getItem(bobKey))).not.toBeNull();
  });
});

/**
 * Quiz Persistence — extracted from App.js for testability
 *
 * Pure functions for building, validating, and restoring quiz save state.
 * App.js handles the actual localStorage read/write and React state updates;
 * these functions handle the logic around what to save, expiry, and validation.
 */

const REQUIRED_FIELDS = [
  'currentView', 'selectedSubject', 'selectedTopic', 'quizMode',
  'quizQuestions', 'currentQuestionIndex', 'answers',
  'selectedAnswer', 'selectedPair', 'showFeedback',
  'sessionId', 'savedAt',
];

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Build the quiz save key for a given user.
 * Returns null if no user is provided.
 */
export function getQuizSaveKey(currentUser) {
  return currentUser ? `user:${currentUser}:active-quiz` : null;
}

/**
 * Build the save state object from current quiz fields.
 * Stamps savedAt automatically.
 */
export function buildQuizSaveState(fields) {
  return {
    currentView: fields.currentView,
    selectedSubject: fields.selectedSubject,
    selectedTopic: fields.selectedTopic,
    quizMode: fields.quizMode,
    quizQuestions: fields.quizQuestions,
    currentQuestionIndex: fields.currentQuestionIndex,
    answers: fields.answers,
    selectedAnswer: fields.selectedAnswer,
    selectedPair: fields.selectedPair,
    showFeedback: fields.showFeedback,
    sessionId: fields.sessionId,
    savedAt: Date.now(),
  };
}

/**
 * Check whether a saved quiz state has expired.
 */
export function isQuizExpired(savedState, maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (!savedState || typeof savedState.savedAt !== 'number') return true;
  return Date.now() - savedState.savedAt > maxAgeMs;
}

/**
 * Parse a JSON string into a validated quiz state.
 * Returns null if the JSON is corrupt, missing required fields,
 * or the saved quiz has expired.
 */
export function parseAndValidateQuiz(jsonString, maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (!jsonString) return null;

  let state;
  try {
    state = JSON.parse(jsonString);
  } catch {
    return null;
  }

  // Must have been in quiz view with questions
  if (state.currentView !== 'quiz' || !state.quizQuestions?.length) {
    return null;
  }

  // Check expiry
  if (isQuizExpired(state, maxAgeMs)) {
    return null;
  }

  // Apply defaults for optional fields that may be missing
  return {
    ...state,
    answers: state.answers || [],
    selectedPair: state.selectedPair || [],
    showFeedback: state.showFeedback || false,
    sessionId: state.sessionId || Date.now(),
  };
}

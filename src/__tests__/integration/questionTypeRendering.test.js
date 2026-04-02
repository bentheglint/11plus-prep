/**
 * Question Type Rendering Smoke Tests (Testing Strategy Part 5, Priority 5)
 *
 * Verifies each question type renders without crashing and that the
 * correct rendering branch is activated. Uses data-testid attributes
 * added to QuizScreen.js for stable selectors.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizScreen from '../../screens/QuizScreen';

// Minimal props that QuizScreen needs to render without crashing
function makeProps(questionOverrides = {}) {
  const question = {
    id: 1,
    question: 'Test question?',
    options: ['A', 'B', 'C', 'D', 'E'],
    correct: 2,
    explanation: 'Test explanation. ✓',
    difficulty: 2,
    ...questionOverrides,
  };

  return {
    quizQuestions: [{ question, topicKey: 'percentages', topicName: 'Percentages' }],
    currentQuestionIndex: 0,
    quizMode: 'focused',
    selectedTopic: 'percentages',
    selectedAnswer: null,
    selectedPair: [],
    showFeedback: false,
    returnToSpeedReview: false,
    showTutorChat: false,
    chatMessages: [],
    userMessage: '',
    isAiThinking: false,
    isListening: false,
    showFeedbackForm: false,
    feedbackText: '',
    currentUser: 'TestUser',
    speechSupported: false,
    quizVisualComponents: {},
    postQuestionTip: null,
    onAnswerSelect: jest.fn(),
    onSelectTwoToggle: jest.fn(),
    onPickFromSet: jest.fn(),
    onCheckAnswer: jest.fn(),
    onNextQuestion: jest.fn(),
    onFindLesson: jest.fn(),
    onAskTutor: jest.fn(),
    onSendMessage: jest.fn(),
    onUserMessageChange: jest.fn(),
    onToggleListening: jest.fn(),
    onFeedbackTextChange: jest.fn(),
    onSubmitFeedback: jest.fn(),
    onToggleFeedbackForm: jest.fn(),
    onBack: jest.fn(),
  };
}

describe('Question Type Rendering', () => {

  it('renders standard MCQ without crashing', () => {
    const props = makeProps();
    expect(() => render(<QuizScreen {...props} />)).not.toThrow();
    expect(screen.getByTestId('options-standard')).toBeInTheDocument();
  });

  it('renders passage question without crashing', () => {
    const props = makeProps({
      questionType: 'passage',
      passage: 'A long passage of text for comprehension testing.',
      passageTitle: 'Test Passage',
      passageId: 'test-passage',
    });
    expect(() => render(<QuizScreen {...props} />)).not.toThrow();
    expect(screen.getByTestId('passage-block')).toBeInTheDocument();
    expect(screen.getByTestId('options-standard')).toBeInTheDocument();
  });

  it('renders error-spotting question without crashing', () => {
    const props = makeProps({
      questionType: 'error-spotting',
      segments: ['The cat sat', 'on the matt', 'and looked', 'very happy'],
    });
    expect(() => render(<QuizScreen {...props} />)).not.toThrow();
    expect(screen.getByTestId('segment-grid')).toBeInTheDocument();
  });

  it('renders select-two question without crashing', () => {
    const props = makeProps({
      questionType: 'select-two',
      options: ['cat', 'dog', 'fish', 'bird', 'ant'],
      correctPair: [0, 2],
    });
    // select-two doesn't use standard options
    delete props.quizQuestions[0].question.correct;
    expect(() => render(<QuizScreen {...props} />)).not.toThrow();
    expect(screen.getByTestId('select-two-grid')).toBeInTheDocument();
  });

  it('renders pick-from-sets question without crashing', () => {
    const props = makeProps({
      questionType: 'pick-from-sets',
      setA: ['hot', 'cold', 'warm'],
      setB: ['big', 'small', 'tiny'],
      correctPair: [0, 1],
    });
    delete props.quizQuestions[0].question.correct;
    delete props.quizQuestions[0].question.options;
    expect(() => render(<QuizScreen {...props} />)).not.toThrow();
    expect(screen.getByTestId('pick-from-sets-groups')).toBeInTheDocument();
  });

});

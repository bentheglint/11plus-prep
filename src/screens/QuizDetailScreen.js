import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Circle,
  MessageCircle, BookOpen, X, Mic, MicOff, Send,
} from 'lucide-react';
import { topicNames } from '../components/RecommendationCard';
import { useTutorChat } from '../hooks/useTutorChat';
import { buildReviewPrompt, buildReviewAutoMessage } from '../utils/tutorPrompts';

const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
const TUTOR_API_URL = process.env.REACT_APP_TUTOR_API_URL;

/**
 * QuizDetailScreen — per-question review of a completed quiz.
 *
 * Two entry-point patterns:
 *   1. From ResultsScreen (immediately after finishing a quiz)
 *      Pass: landOn="first-wrong", autoOpenTutor={true}, inMemoryResults={questionResults}
 *   2. From Activity Log (reviewing an older quiz)
 *      Pass: nothing extra. Defaults open at Q1 with no auto-tutor.
 *
 * `inMemoryResults` is a hot-off-the-quiz copy of question results that may
 * not yet be durable in D1. When provided, the screen prefers it over the
 * global `questionResults` prop, sidestepping post-quiz persistence races.
 */
function QuizDetailScreen({
  quiz,
  questionResults,
  inMemoryResults,
  questionData,
  englishData,
  vrData,
  quizVisualComponents,
  onBack,
  onFindLesson,
  landOn,
  autoOpenTutor,
}) {
  // Build a question lookup map across all subjects.
  const questionLookup = useMemo(() => {
    const lookup = {};
    const addQuestions = (data, subject) => {
      if (!data || !data.topics) return;
      Object.entries(data.topics).forEach(([topicKey, topic]) => {
        const questions = topic.questions || (Array.isArray(topic) ? topic : []);
        questions.forEach(q => {
          lookup[`${subject}-${topicKey}-${q.id}`] = { ...q, _topicKey: topicKey, _subject: subject };
        });
      });
    };
    addQuestions(questionData, 'maths');
    addQuestions(englishData, 'english');
    addQuestions(vrData, 'verbalreasoning');
    return lookup;
  }, [questionData, englishData, vrData]);

  // Resolve question results: prefer freshly-passed in-memory copy when given.
  const resultsSource = inMemoryResults || questionResults;
  const quizQuestions = useMemo(() => {
    if (!quiz?.sessionId || !resultsSource) return [];
    return resultsSource
      .filter(qr => qr.sessionId === quiz.sessionId)
      .slice()
      .sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [quiz, resultsSource]);

  // Land on first wrong (when caller asks) or fall through to Q1.
  const initialIndex = useMemo(() => {
    if (landOn !== 'first-wrong' || quizQuestions.length === 0) return 0;
    const firstWrong = quizQuestions.findIndex(q => !q.correct);
    if (firstWrong === -1) return quizQuestions.length - 1;
    return firstWrong;
  }, [landOn, quizQuestions]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset currentIndex if landOn / quiz changes
  useEffect(() => { setCurrentIndex(initialIndex); }, [initialIndex]);

  const currentResult = quizQuestions[currentIndex];
  const currentLookupKey = currentResult
    ? `${currentResult.subject}-${currentResult.topicKey}-${currentResult.questionId}`
    : null;
  const currentQuestion = currentLookupKey ? questionLookup[currentLookupKey] : null;
  const currentIsWrong = currentResult ? !currentResult.correct : false;
  const currentTopicKey = currentResult?.topicKey || quiz?.topic;

  // Tutor chat — keyed per question index so each question has its own
  // conversation. Hook resets on unmount so Exit→Re-enter starts fresh.
  const tutor = useTutorChat({
    apiUrl: TUTOR_API_URL,
    buildSystemPrompt: ({ key }) => {
      const result = quizQuestions[Number(key)];
      const lookup = result ? `${result.subject}-${result.topicKey}-${result.questionId}` : null;
      const q = lookup ? questionLookup[lookup] : null;
      if (!q) return '';
      return buildReviewPrompt({
        question: q,
        selectedAnswer: result?.selectedAnswer ?? null,
      });
    },
  });

  // Switch the active key on navigation. If autoOpenTutor and the new question
  // is wrong, open the chat and auto-send the contextual message exactly once.
  useEffect(() => {
    if (!currentQuestion) return;
    const key = String(currentIndex);
    tutor.setKey(key);
    if (autoOpenTutor && currentIsWrong) {
      tutor.openChat({ key });
      tutor.autoSendIfNew(key, buildReviewAutoMessage({
        question: currentQuestion,
        selectedAnswer: currentResult?.selectedAnswer ?? null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion, currentIsWrong, autoOpenTutor]);

  const dateLabel = quiz
    ? new Date(quiz.date?.includes('T') ? quiz.date : quiz.date?.replace(' ', 'T') + 'Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  // Empty state for pre-feature quizzes
  if (!quiz?.sessionId) {
    return (
      <div className="app-bg p-4 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <BackHeader onBack={onBack} />
          <div className="card-elevated p-8 text-center">
            <h2 className="font-heading font-bold text-slate-800 mb-2">Details Not Available</h2>
            <p className="text-slate-500">
              Question-by-question details aren't recorded for quizzes taken before this feature was added.
              New quizzes from now on will show full details here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleFindLessonClick = () => {
    if (!onFindLesson || !currentQuestion || !currentTopicKey) return;
    onFindLesson(currentQuestion, currentTopicKey);
  };

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <BackHeader onBack={onBack} label="Exit review" />

        {/* Quiz summary card */}
        <div className="card-elevated p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-heading font-bold text-slate-800">{topicNames[quiz.topic] || quiz.topic}</h1>
              <p className="text-sm text-slate-500">
                {subjectNames[quiz.subject] || quiz.subject} · {dateLabel}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-2xl font-heading font-bold"
                style={{ color: quiz.percentage >= 80 ? '#22C55E' : quiz.percentage >= 60 ? '#FDCB6E' : '#FF6B6B' }}
              >
                {quiz.percentage}%
              </p>
              <p className="text-xs text-slate-500">{quiz.score}/{quiz.total}</p>
            </div>
          </div>
        </div>

        {/* Progress strip — clickable index for each question */}
        {quizQuestions.length > 0 && (
          <ProgressStrip
            results={quizQuestions}
            currentIndex={currentIndex}
            onJump={setCurrentIndex}
          />
        )}

        {/* Empty results */}
        {quizQuestions.length === 0 ? (
          <div className="card-elevated p-6 text-center text-slate-500">
            <p>No question details found for this quiz.</p>
          </div>
        ) : !currentQuestion ? (
          <div className="card-elevated p-6 text-center text-slate-400">
            <p>Question {currentIndex + 1} — content unavailable.</p>
          </div>
        ) : (
          <>
            <QuestionReview
              key={`${quiz.sessionId}-${currentIndex}`}
              indexLabel={`${currentIndex + 1} of ${quizQuestions.length}`}
              question={currentQuestion}
              result={currentResult}
              quizVisualComponents={quizVisualComponents}
              onAskTutor={() => tutor.openChat({ key: String(currentIndex) })}
              onFindLesson={onFindLesson ? handleFindLessonClick : null}
            />

            <PrevNextNav
              currentIndex={currentIndex}
              total={quizQuestions.length}
              onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
              onNext={() => setCurrentIndex(i => Math.min(quizQuestions.length - 1, i + 1))}
            />
          </>
        )}

        {/* Tutor chat panel — same UI pattern as the live QuizScreen */}
        {tutor.showTutorChat && (
          <TutorChatPanel
            messages={tutor.chatMessages}
            isThinking={tutor.isAiThinking}
            userMessage={tutor.userMessage}
            onUserMessageChange={tutor.setUserMessage}
            onSend={tutor.sendMessage}
            onClose={tutor.closeChat}
            isListening={tutor.isListening}
            onToggleListening={tutor.toggleListening}
          />
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──

function BackHeader({ onBack, label = 'Back' }) {
  return (
    <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ProgressStrip({ results, currentIndex, onJump }) {
  return (
    <div className="card-elevated p-3 mb-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {results.map((r, i) => {
          const isCurrent = i === currentIndex;
          const isCorrect = !!r.correct;
          let bg, text, ring;
          if (isCurrent) {
            ring = 'ring-2 ring-[#7C3AED] ring-offset-2';
          } else {
            ring = '';
          }
          if (isCorrect) {
            bg = 'bg-[#22C55E] text-white hover:bg-[#16A34A]';
            text = 'text-white';
          } else {
            bg = 'bg-[#FF6B6B] text-white hover:bg-[#EF4444]';
            text = 'text-white';
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${bg} ${text} ${ring}`}
              aria-label={`Question ${i + 1} ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PrevNextNav({ currentIndex, total, onPrev, onNext }) {
  const atStart = currentIndex === 0;
  const atEnd = currentIndex === total - 1;
  return (
    <div className="flex items-center justify-between mt-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={atStart}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
          atStart ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <ArrowLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-sm text-slate-500">
        Question {currentIndex + 1} of {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
          atEnd ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        Next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function QuestionReview({ indexLabel, question, result, quizVisualComponents, onAskTutor, onFindLesson }) {
  const isCorrect = !!result.correct;
  const borderColour = isCorrect ? 'border-l-[#22C55E]' : 'border-l-[#FF6B6B]';
  const Visual = question.visual && quizVisualComponents ? quizVisualComponents[question.visual.component] : null;

  return (
    <div className={`card-elevated p-5 border-l-4 ${borderColour}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCorrect
            ? <CheckCircle className="w-5 h-5 text-[#22C55E]" />
            : <XCircle className="w-5 h-5 text-[#FF6B6B]" />}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Question {indexLabel} · {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onFindLesson && (
            <button
              type="button"
              onClick={onFindLesson}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-lg transition-all text-sm flex items-center gap-1.5 border border-amber-200"
            >
              <BookOpen className="w-4 h-4" />
              Find Me a Lesson
            </button>
          )}
          <button
            type="button"
            onClick={onAskTutor}
            className="px-3 py-1.5 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] font-medium rounded-lg transition-all text-sm flex items-center gap-1.5 border border-[#7C3AED]/20"
          >
            <MessageCircle className="w-4 h-4" />
            AI Tutor
          </button>
        </div>
      </div>

      <p className="text-slate-800 font-medium mb-4">{question.question}</p>

      {/* Image (SVG path) — visual takes priority */}
      {question.image && !Visual && (
        <div className="mb-4 flex justify-center">
          <img
            src={`/images/questions/${question.image}`}
            alt="Question diagram"
            className="max-w-full h-auto rounded-lg border-2 border-gray-200"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}

      {/* Visual React component */}
      {Visual && (
        <div className="mb-4 flex justify-center">
          <div className="w-full max-w-2xl p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
            <Visual {...(question.visual.props || {})} />
          </div>
        </div>
      )}

      {/* Per-type answer rendering */}
      {question.questionType === 'pick-from-sets' ? (
        <PickFromSetsReview question={question} result={result} />
      ) : question.questionType === 'select-two' ? (
        <SelectTwoReview question={question} result={result} />
      ) : (
        <MCQReview question={question} result={result} />
      )}

      {question.explanation && (
        <div className="mt-4 p-3 rounded-lg bg-[#EDE8FF] border border-[#D4C9F9]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] mb-1">Explanation</p>
          <p className="text-sm text-slate-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ── Per-type option renderers (unchanged) ──

function MCQReview({ question, result }) {
  const options = question.options || [];
  const correctIndex = question.correct;
  const selectedIndex = typeof result.selectedAnswer === 'number' ? result.selectedAnswer : null;
  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <OptionRow
          key={i}
          label={String.fromCharCode(65 + i)}
          text={opt}
          isCorrect={i === correctIndex}
          isSelected={i === selectedIndex}
        />
      ))}
    </div>
  );
}

function SelectTwoReview({ question, result }) {
  const options = question.options || [];
  const correct = Array.isArray(question.correctPair) ? question.correctPair : [];
  const selected = Array.isArray(result.selectedAnswer) ? result.selectedAnswer : [];
  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <OptionRow
          key={i}
          label={String.fromCharCode(65 + i)}
          text={opt}
          isCorrect={correct.includes(i)}
          isSelected={selected.includes(i)}
        />
      ))}
    </div>
  );
}

function PickFromSetsReview({ question, result }) {
  const setA = question.setA || [];
  const setB = question.setB || [];
  const correctA = question.correctPair?.[0];
  const correctB = question.correctPair?.[1];
  const selected = result.selectedAnswer || {};
  const selectedA = selected.A;
  const selectedB = selected.B;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Set A</p>
        <div className="space-y-2">
          {setA.map((opt, i) => (
            <OptionRow
              key={i}
              label={String.fromCharCode(65 + i)}
              text={opt}
              isCorrect={i === correctA}
              isSelected={i === selectedA}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Set B</p>
        <div className="space-y-2">
          {setB.map((opt, i) => (
            <OptionRow
              key={i}
              label={String.fromCharCode(65 + i)}
              text={opt}
              isCorrect={i === correctB}
              isSelected={i === selectedB}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionRow({ label, text, isCorrect, isSelected }) {
  let bg = 'bg-white border-gray-200';
  let textColour = 'text-slate-700';
  let Icon = Circle;
  let iconColour = 'text-gray-300';

  if (isCorrect && isSelected) {
    bg = 'bg-green-50 border-[#22C55E]';
    textColour = 'text-slate-800';
    Icon = CheckCircle;
    iconColour = 'text-[#22C55E]';
  } else if (isCorrect) {
    bg = 'bg-green-50/60 border-[#22C55E]/50';
    textColour = 'text-slate-800';
    Icon = CheckCircle;
    iconColour = 'text-[#22C55E]';
  } else if (isSelected) {
    bg = 'bg-red-50 border-[#FF6B6B]';
    textColour = 'text-slate-800';
    Icon = XCircle;
    iconColour = 'text-[#FF6B6B]';
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${bg}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColour}`} />
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 w-4">{label}</span>
      <span className={`flex-1 text-sm ${textColour}`}>{text}</span>
    </div>
  );
}

// ── Tutor chat overlay (review-mode) ──

function TutorChatPanel({
  messages, isThinking, userMessage, onUserMessageChange, onSend, onClose,
  isListening, onToggleListening,
}) {
  const speechSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm shadow-2xl">
      <div className="bg-white flex flex-col w-full border-l border-slate-200" style={{ maxHeight: '100dvh' }}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="font-heading font-bold text-slate-800">AI Tutor</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Close tutor chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !isThinking && (
            <p className="text-sm text-slate-400 text-center py-8">
              Ask me anything about this question.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#7C3AED] text-white ml-8'
                  : 'bg-slate-100 text-slate-800 mr-8'
              }`}
            >
              {m.content}
            </div>
          ))}
          {isThinking && (
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 text-sm mr-8 animate-pulse">
              Thinking…
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 flex items-center gap-2">
          {speechSupported && (
            <button
              type="button"
              onClick={() => onToggleListening()}
              className={`p-2 rounded-lg ${isListening ? 'bg-[#FF6B6B] text-white' : 'bg-slate-100 text-slate-600'}`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <input
            type="text"
            value={userMessage}
            onChange={(e) => onUserMessageChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Type your question…"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#7C3AED]"
            disabled={isThinking}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!userMessage.trim() || isThinking}
            className={`p-2 rounded-lg ${
              userMessage.trim() && !isThinking
                ? 'bg-[#7C3AED] text-white hover:bg-[#5A4BD1]'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetailScreen;

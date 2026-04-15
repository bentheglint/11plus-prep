import React, { useMemo } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Circle } from 'lucide-react';
import { topicNames } from '../components/RecommendationCard';

const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
const subjectColours = { maths: '#0770C2', english: '#007D62', verbalreasoning: '#6C5CE7' };

/**
 * QuizDetailScreen — per-question review of a completed quiz.
 *
 * Shows each question the child saw, what they picked, what was correct,
 * and the explanation. Handles three question types:
 *   - Standard MCQ        → 5-option list
 *   - select-two          → 5-option list with 2 highlights (unordered)
 *   - pick-from-sets      → Set A / Set B columns with 1 highlight in each
 *
 * Old quizzes (completed before this feature shipped) don't have a sessionId
 * and render an empty state.
 */
function QuizDetailScreen({ quiz, questionResults, questionData, englishData, vrData, onBack }) {
  // Build a question lookup map across all subjects — pattern from MistakesScreen.
  // Key is subject-topicKey-questionId because IDs are only unique within a topic.
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

  // Filter question results by sessionId (this quiz's questions) and preserve attempt order
  const quizQuestions = useMemo(() => {
    if (!quiz?.sessionId || !questionResults) return [];
    return questionResults
      .filter(qr => qr.sessionId === quiz.sessionId)
      .slice() // don't mutate
      .sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [quiz, questionResults]);

  const dateLabel = quiz ? new Date(quiz.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  // ── Empty state for pre-feature quizzes ──
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

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <BackHeader onBack={onBack} />

        {/* Quiz summary card */}
        <div className="card-elevated p-5 mb-6">
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
                style={{ color: quiz.percentage >= 80 ? '#007D62' : quiz.percentage >= 60 ? '#FDCB6E' : '#FF6B6B' }}
              >
                {quiz.percentage}%
              </p>
              <p className="text-xs text-slate-500">{quiz.score}/{quiz.total}</p>
            </div>
          </div>
        </div>

        {/* Question-by-question breakdown */}
        {quizQuestions.length === 0 ? (
          <div className="card-elevated p-6 text-center text-slate-500">
            <p>No question details found for this quiz.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizQuestions.map((result, idx) => {
              const lookupKey = `${result.subject}-${result.topicKey}-${result.questionId}`;
              const question = questionLookup[lookupKey];
              if (!question) {
                return (
                  <div key={result.id} className="card-elevated p-4">
                    <p className="text-sm text-slate-400">Question {idx + 1} — content unavailable</p>
                  </div>
                );
              }
              return (
                <QuestionReview
                  key={result.id}
                  index={idx + 1}
                  question={question}
                  result={result}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BackHeader({ onBack }) {
  return (
    <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}

function QuestionReview({ index, question, result }) {
  const isCorrect = !!result.correct;
  const borderColour = isCorrect ? 'border-l-[#007D62]' : 'border-l-[#FF6B6B]';

  return (
    <div className={`card-elevated p-5 border-l-4 ${borderColour}`}>
      <div className="flex items-center gap-2 mb-3">
        {isCorrect
          ? <CheckCircle className="w-5 h-5 text-[#007D62]" />
          : <XCircle className="w-5 h-5 text-[#FF6B6B]" />}
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Question {index} · {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>

      <p className="text-slate-800 font-medium mb-4">{question.question}</p>

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
          <p className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] mb-1">Explanation</p>
          <p className="text-sm text-slate-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ── Per-type option renderers ──

function MCQReview({ question, result }) {
  const options = question.options || [];
  const correctIndex = question.correct;
  // selectedAnswer may be null for old rows or non-MCQ saved via legacy path
  const selectedIndex = typeof result.selectedAnswer === 'number' ? result.selectedAnswer : null;

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <OptionRow
          key={i}
          label={String.fromCharCode(65 + i)} // A, B, C…
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
  // correctPair is an array of two indices
  const correct = Array.isArray(question.correctPair) ? question.correctPair : [];
  // selectedAnswer is a sorted pair [a, b]
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
  // selectedAnswer is { A: idx, B: idx }
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

// Shared option row — styling encodes correct vs selected state
function OptionRow({ label, text, isCorrect, isSelected }) {
  // Visual state priority: correct+selected (green check) > correct-only (green tint)
  //                       > selected-wrong (red) > neutral
  let bg = 'bg-white border-gray-200';
  let textColour = 'text-slate-700';
  let Icon = Circle;
  let iconColour = 'text-gray-300';

  if (isCorrect && isSelected) {
    bg = 'bg-green-50 border-[#007D62]';
    textColour = 'text-slate-800';
    Icon = CheckCircle;
    iconColour = 'text-[#007D62]';
  } else if (isCorrect) {
    bg = 'bg-green-50/60 border-[#007D62]/50';
    textColour = 'text-slate-800';
    Icon = CheckCircle;
    iconColour = 'text-[#007D62]';
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

export default QuizDetailScreen;

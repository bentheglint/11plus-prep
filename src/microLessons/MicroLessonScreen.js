import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, Sparkles, Flag, BookOpen, Calculator, Brain, MessageCircle, Mic, MicOff } from 'lucide-react';
import { GridModel, WorkedExample, NumberLine, BarModel, PlaceValueChart, ColumnMethod, AngleDiagram, BusStopDiagram, RectangleDiagram, TriangleAreaDiagram, ParallelogramDiagram, CuboidDiagram, LShapeDiagram, SentenceDisplay, LetterTiles, AlphabetLine, SlidingWindow, LogicDiagram, CodeTable, SequenceChain, AnalogyDisplay, WordChipsDisplay, SDTTriangle, AngleDisplay, QuadShape, ParallelLines, ExteriorAngle, RegularPolygon, FunctionMachine, LineGraph, PathBorderDiagram, BarChart, PieChart, TwoWayTable } from './visuals';
import { selectLesson } from './lessonData';

// Map of visual component names to actual components
const visualComponents = {
  GridModel,
  WorkedExample,
  NumberLine,
  BarModel,
  PlaceValueChart,
  ColumnMethod,
  AngleDiagram,
  BusStopDiagram,
  RectangleDiagram,
  CuboidDiagram,
  LShapeDiagram,
  SentenceDisplay,
  LetterTiles,
  AlphabetLine,
  SlidingWindow,
  LogicDiagram,
  CodeTable,
  SequenceChain,
  AnalogyDisplay,
  WordChipsDisplay,
  SDTTriangle,
  AngleDisplay,
  QuadShape,
  ParallelLines,
  ExteriorAngle,
  RegularPolygon,
  FunctionMachine,
  LineGraph,
  TriangleAreaDiagram,
  ParallelogramDiagram,
  PathBorderDiagram,
  BarChart,
  PieChart,
  TwoWayTable
};

// ---- Subject detection from topicKey ----
// Exported for the topic-key consistency test — these sets must cover every
// English/VR topic in the data files or lessons get the wrong subject badge.
export const ENGLISH_TOPICS = new Set(['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension']);
export const VR_TOPICS = new Set(['synonyms', 'antonyms', 'oddTwoOut', 'verbalAnalogies', 'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords', 'sharedLetter', 'letterCodes', 'letterPairSeries', 'wordCodeAnalogies', 'numberWordCodes', 'numberSeries', 'letterSums', 'logicAndLanguage', 'balanceEquations']);

function getSubjectTheme(topicKey) {
  if (ENGLISH_TOPICS.has(topicKey)) return { icon: BookOpen, accent: 'green', bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-50 text-green-700', label: 'English' };
  if (VR_TOPICS.has(topicKey)) return { icon: Brain, accent: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700', label: 'Verbal Reasoning' };
  return { icon: Calculator, accent: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700', label: 'Maths' };
}

// ---- Lesson data resolver ----
// Lesson screens may define props/content/body either as functions of the
// variable set or as plain values. Resolve both forms safely — calling a
// plain object as a function crashes the whole lesson (see divisibility-keyfact).
function resolveValue(val, vars) {
  return typeof val === 'function' ? val(vars) : val;
}

// ---- Bold text renderer: converts **text** to <strong> ----
function renderBoldText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#7C3AED] font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ============================================================
// InteractionArea — handles multiple-choice and tap-to-reveal
// ============================================================
function InteractionArea({ interaction, variables, answer, submitted, correct, onAnswer, onSubmit, cachedOptions, cachedCorrectAnswer, feedbackPrefix }) {
  // ---- Fill-blank state ----
  const [fbSelected, setFbSelected] = useState(null);
  const [fbChecked, setFbChecked] = useState(false);
  const [fbCorrect, setFbCorrect] = useState(null);

  // ---- Order-steps state ----
  const [orderedSteps, setOrderedSteps] = useState([]);
  const [shuffledSteps, setShuffledSteps] = useState(null);
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderCorrect, setOrderCorrect] = useState(null);

  // ---- Match-pairs state ----
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledRight, setShuffledRight] = useState(null);
  const [wrongMatch, setWrongMatch] = useState(null);

  // ---- True-false state ----
  const [tfIndex, setTfIndex] = useState(0);
  const [tfAnswers, setTfAnswers] = useState([]);
  const [tfShowFeedback, setTfShowFeedback] = useState(false);

  // Shuffle order-steps on mount
  useEffect(() => {
    if (interaction?.type === 'order-steps' && variables) {
      const steps = interaction.steps(variables);
      const items = steps.map((text, i) => ({ text, originalIndex: i }));
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      setShuffledSteps(items);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Shuffle match-pairs right column on mount
  useEffect(() => {
    if (interaction?.type === 'match-pairs' && variables) {
      const pairs = interaction.pairs(variables);
      const rightItems = pairs.map((p, i) => ({ text: p.right, index: i }));
      for (let i = rightItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
      }
      setShuffledRight(rightItems);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!interaction || interaction.type === 'tap-to-reveal') return null;

  // ============ MULTIPLE-CHOICE ============
  if (interaction.type === 'multiple-choice') {
    if (!cachedOptions) return null;
    const options = cachedOptions;
    const correctAnswer = cachedCorrectAnswer;

    return (
      <div className="mt-4">
        {interaction.question && <p className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
          {interaction.question(variables)}
        </p>}
        <div className="space-y-2 sm:space-y-3">
          {options.map((opt, idx) => {
            let style = 'border-gray-300 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50';
            if (submitted) {
              if (opt === correctAnswer) {
                style = 'border-green-500 bg-green-50';
              } else if (answer === idx) {
                style = 'border-red-500 bg-red-50';
              } else {
                style = 'border-gray-200 bg-gray-50';
              }
            } else if (answer === idx) {
              style = 'border-[#7C3AED] bg-[#EDE8FF]';
            }

            return (
              <button
                key={idx}
                onClick={() => !submitted && onAnswer(idx)}
                disabled={submitted}
                className={`w-full px-4 py-2.5 sm:p-4 rounded-xl border-2 transition-all font-medium text-base sm:text-lg text-left ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answer !== null && !submitted && (
          <div className="sticky bottom-4 z-10 mt-4">
            <button
              onClick={() => onSubmit(options[answer] === correctAnswer)}
              className="w-full py-3 btn-primary text-lg shadow-lg"
            >
              Check
            </button>
          </div>
        )}

        {submitted && (
          <div className={`mt-4 p-4 rounded-xl ${
            correct
              ? 'bg-green-50 border-2 border-green-400'
              : 'bg-amber-50 border-2 border-amber-400'
          }`}>
            <p className="font-bold text-lg mb-1">
              {feedbackPrefix || (correct ? 'Brilliant!' : 'Nearly there!')}
            </p>
            <p className="text-gray-700">
              {renderBoldText(
                correct
                  ? interaction.feedback.correct(variables)
                  : interaction.feedback.incorrect(variables)
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ============ FILL-BLANK ============
  if (interaction.type === 'fill-blank') {
    const sentence = interaction.sentence(variables);
    const options = interaction.options(variables);
    const correctIdx = interaction.correctIndex(variables);
    const parts = sentence.split(/____/);

    const handleFbCheck = () => {
      const isCorrect = fbSelected === correctIdx;
      setFbChecked(true);
      setFbCorrect(isCorrect);
      onSubmit(isCorrect);
    };

    return (
      <div className="mt-4">
        <div className="text-lg text-gray-900 leading-relaxed mb-4 p-4 bg-gray-50 rounded-xl">
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {renderBoldText(part)}
              {i < parts.length - 1 && (
                fbChecked ? (
                  <span className={`inline-block px-3 py-1 mx-1 rounded-lg font-bold border-2 ${
                    fbCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'
                  }`}>{options[fbSelected]}</span>
                ) : fbSelected !== null ? (
                  <span className="inline-block px-3 py-1 mx-1 rounded-lg font-bold border-2 border-[#7C3AED] bg-[#EDE8FF] text-[#7C3AED]">
                    {options[fbSelected]}
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 mx-1 border-2 border-dashed border-[#A29BFE] rounded-lg text-[#A29BFE] min-w-[80px] text-center">____</span>
                )
              )}
            </React.Fragment>
          ))}
        </div>

        {!fbChecked && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setFbSelected(idx)}
                className={`px-4 py-3 rounded-xl border-2 font-medium text-base transition-all ${
                  fbSelected === idx
                    ? 'border-[#7C3AED] bg-[#EDE8FF] text-[#7C3AED]'
                    : 'border-gray-300 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {fbSelected !== null && !fbChecked && (
          <div className="sticky bottom-4 z-10">
            <button onClick={handleFbCheck} className="w-full py-3 btn-primary text-lg shadow-lg">
              Check
            </button>
          </div>
        )}

        {fbChecked && (
          <div className={`mt-4 p-4 rounded-xl ${
            fbCorrect ? 'bg-green-50 border-2 border-green-400' : 'bg-amber-50 border-2 border-amber-400'
          }`}>
            <p className="font-bold text-lg mb-1">
              {feedbackPrefix || (fbCorrect ? 'Brilliant!' : 'Nearly there!')}
            </p>
            <p className="text-gray-700">
              {renderBoldText(
                fbCorrect
                  ? interaction.feedback.correct(variables)
                  : interaction.feedback.incorrect(variables)
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  // ============ ORDER-STEPS ============
  if (interaction.type === 'order-steps') {
    if (!shuffledSteps) return null;
    const steps = interaction.steps(variables);

    const availableItems = shuffledSteps.filter(
      item => !orderedSteps.some(placed => placed.originalIndex === item.originalIndex)
    );

    const handleCheckOrder = () => {
      const isCorrect = orderedSteps.every((item, i) => item.originalIndex === i);
      setOrderChecked(true);
      setOrderCorrect(isCorrect);
      onSubmit(isCorrect);
    };

    return (
      <div className="mt-4">
        <p className="text-base font-semibold text-[#7C3AED] mb-3">Put these steps in the correct order:</p>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Your order:</p>
        <div className="min-h-[60px] p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mb-4 space-y-2">
          {orderedSteps.length === 0 && (
            <p className="text-gray-400 text-center py-2">Tap steps below to place them here</p>
          )}
          {orderedSteps.map((item, idx) => (
            <button
              type="button"
              key={item.originalIndex}
              disabled={orderChecked}
              onClick={() => setOrderedSteps(prev => prev.filter((_, i) => i !== idx))}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                orderChecked
                  ? item.originalIndex === idx
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-[#7C3AED] bg-[#EDE8FF] hover:bg-[#DDD6FE] cursor-pointer'
              }`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                orderChecked
                  ? item.originalIndex === idx ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-[#7C3AED] text-white'
              }`}>{idx + 1}</span>
              <span className="text-base font-medium">{renderBoldText(item.text)}</span>
            </button>
          ))}
        </div>

        {availableItems.length > 0 && !orderChecked && (
          <>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Available steps:</p>
            <div className="space-y-2 mb-4">
              {availableItems.map((item) => (
                <button
                  key={item.originalIndex}
                  onClick={() => setOrderedSteps(prev => [...prev, item])}
                  className="w-full text-left p-3 rounded-xl border-2 border-gray-300 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 transition-all font-medium text-base"
                >
                  {renderBoldText(item.text)}
                </button>
              ))}
            </div>
          </>
        )}

        {orderedSteps.length === steps.length && !orderChecked && (
          <div className="sticky bottom-4 z-10">
            <button onClick={handleCheckOrder} className="w-full py-3 btn-primary text-lg shadow-lg">
              Check order
            </button>
          </div>
        )}

        {orderChecked && (
          <div className={`mt-4 p-4 rounded-xl ${
            orderCorrect ? 'bg-green-50 border-2 border-green-400' : 'bg-amber-50 border-2 border-amber-400'
          }`}>
            <p className="font-bold text-lg mb-1">
              {feedbackPrefix || (orderCorrect ? 'Perfect order!' : 'Not quite right')}
            </p>
            <p className="text-gray-700">
              {renderBoldText(
                orderCorrect
                  ? interaction.feedback.correct(variables)
                  : interaction.feedback.incorrect(variables)
              )}
            </p>
            {!orderCorrect && (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-bold text-gray-600">Correct order:</p>
                {steps.map((step, i) => (
                  <p key={i} className="text-sm text-gray-600"><span className="font-bold">{i + 1}.</span> {renderBoldText(step)}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============ MATCH-PAIRS ============
  if (interaction.type === 'match-pairs') {
    if (!shuffledRight) return null;
    const pairs = interaction.pairs(variables);

    const handleLeftTap = (idx) => {
      if (matchedPairs.some(m => m.left === idx)) return;
      setSelectedLeft(selectedLeft === idx ? null : idx);
      setWrongMatch(null);
    };

    const handleRightTap = (rightIdx) => {
      if (selectedLeft === null) return;
      if (matchedPairs.some(m => m.right === rightIdx)) return;
      if (selectedLeft === rightIdx) {
        const newMatched = [...matchedPairs, { left: selectedLeft, right: rightIdx }];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setWrongMatch(null);
        if (newMatched.length === pairs.length) {
          onSubmit(true);
        }
      } else {
        setWrongMatch({ left: selectedLeft, right: rightIdx });
        setTimeout(() => {
          setWrongMatch(null);
          setSelectedLeft(null);
        }, 800);
      }
    };

    return (
      <div className="mt-4">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Match each pair:</p>
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            {pairs.map((pair, idx) => {
              const isMatched = matchedPairs.some(m => m.left === idx);
              const isSelected = selectedLeft === idx;
              const isWrong = wrongMatch?.left === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleLeftTap(idx)}
                  disabled={isMatched}
                  className={`w-full p-3 rounded-xl border-2 text-left font-medium text-base transition-all ${
                    isMatched ? 'border-green-500 bg-green-50 text-green-800' :
                    isWrong ? 'border-red-500 bg-red-50' :
                    isSelected ? 'border-[#7C3AED] bg-[#EDE8FF] text-[#7C3AED]' :
                    'border-gray-300 bg-white hover:border-[#A29BFE]'
                  }`}
                >
                  {renderBoldText(pair.left)}
                </button>
              );
            })}
          </div>
          <div className="flex-1 space-y-2">
            {shuffledRight.map((item) => {
              const isMatched = matchedPairs.some(m => m.right === item.index);
              const isWrong = wrongMatch?.right === item.index;
              return (
                <button
                  key={item.index}
                  onClick={() => handleRightTap(item.index)}
                  disabled={isMatched || selectedLeft === null}
                  className={`w-full p-3 rounded-xl border-2 text-left font-medium text-base transition-all ${
                    isMatched ? 'border-green-500 bg-green-50 text-green-800' :
                    isWrong ? 'border-red-500 bg-red-50' :
                    selectedLeft !== null && !isMatched ? 'border-gray-300 bg-white hover:border-[#A29BFE] cursor-pointer' :
                    'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {renderBoldText(item.text)}
                </button>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 p-4 rounded-xl bg-green-50 border-2 border-green-400">
            <p className="font-bold text-lg mb-1">{feedbackPrefix || 'All matched!'}</p>
            <p className="text-gray-700">Great job matching all the pairs! &#10003;</p>
          </div>
        )}
      </div>
    );
  }

  // ============ TRUE-FALSE ============
  if (interaction.type === 'true-false') {
    const statements = interaction.statements(variables);
    const allDone = submitted;

    const handleTfAnswer = (answer) => {
      if (tfShowFeedback) return;
      const current = statements[tfIndex];
      // Accept both schemas: { answer: bool } (canonical) and { isTrue: bool }
      // (wordclass + comprehension subconcept files were authored with the
      // older field name). Bug reported by Jacqui 4 May 2026: every click
      // was marked incorrect because current.answer was undefined.
      const expected = current.answer ?? current.isTrue;
      const isCorrect = answer === expected;
      const newAnswers = [...tfAnswers, { index: tfIndex, answer, correct: isCorrect }];
      setTfAnswers(newAnswers);
      setTfShowFeedback(true);
      const isLast = tfIndex >= statements.length - 1;
      setTimeout(() => {
        setTfShowFeedback(false);
        if (!isLast) {
          setTfIndex(prev => prev + 1);
        } else {
          const allCorrect = newAnswers.every(a => a.correct);
          onSubmit(allCorrect);
        }
      }, 1500);
    };

    const lastAnswer = tfAnswers.length > 0 ? tfAnswers[tfAnswers.length - 1] : null;

    return (
      <div className="mt-4">
        <div className="flex justify-center gap-2 mb-4">
          {statements.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${
              i < tfAnswers.length
                ? tfAnswers[i]?.correct ? 'bg-green-500' : 'bg-red-500'
                : i === tfIndex ? 'bg-[#7C3AED] scale-125' : 'bg-gray-300'
            }`} />
          ))}
        </div>

        {!allDone && tfIndex < statements.length && (
          <>
            <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200 mb-4 text-center">
              <p className="text-lg font-medium text-gray-900">{renderBoldText(statements[tfIndex].text)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleTfAnswer(true)}
                disabled={tfShowFeedback}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                  tfShowFeedback && lastAnswer?.answer === true
                    ? lastAnswer?.correct
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-red-500 bg-red-100 text-red-800'
                    : tfShowFeedback
                      ? 'border-gray-200 bg-gray-50 text-gray-300'
                      : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400'
                }`}
              >
                True
              </button>
              <button
                onClick={() => handleTfAnswer(false)}
                disabled={tfShowFeedback}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                  tfShowFeedback && lastAnswer?.answer === false
                    ? lastAnswer?.correct
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-red-500 bg-red-100 text-red-800'
                    : tfShowFeedback
                      ? 'border-gray-200 bg-gray-50 text-gray-300'
                      : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400'
                }`}
              >
                False
              </button>
            </div>

            {tfShowFeedback && (
              <div className={`p-3 rounded-xl text-center ${
                lastAnswer?.correct
                  ? 'bg-green-50 border border-green-300'
                  : 'bg-amber-50 border border-amber-300'
              }`}>
                <p className="text-sm font-medium text-gray-700">
                  {/* Per-statement explanation is the canonical source. Some
                      older lesson files (wordclass, comprehension) put feedback
                      at interaction-level — fall back so users see something
                      either way. */}
                  {renderBoldText(
                    statements[tfIndex].explanation
                    || (lastAnswer?.correct
                          ? (typeof interaction.feedback?.correct === 'function'
                              ? interaction.feedback.correct(variables)
                              : interaction.feedback?.correct)
                          : (typeof interaction.feedback?.incorrect === 'function'
                              ? interaction.feedback.incorrect(variables)
                              : interaction.feedback?.incorrect))
                    || ''
                  )}
                </p>
              </div>
            )}
          </>
        )}

        {allDone && (
          <div className={`p-4 rounded-xl ${
            tfAnswers.every(a => a.correct)
              ? 'bg-green-50 border-2 border-green-400'
              : 'bg-amber-50 border-2 border-amber-400'
          }`}>
            <p className="font-bold text-lg mb-1">
              {feedbackPrefix || (tfAnswers.every(a => a.correct) ? 'All correct!' : 'Good try!')}
            </p>
            <p className="text-gray-700">
              You got {tfAnswers.filter(a => a.correct).length} out of {statements.length} right.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ============================================================
// TestingFlagButton — floating flag button for testing mode
// ============================================================

function TestingFlagButton({ onFlag, topicKey, topicName, subConceptId, subConceptName, screenIndex, screenType, lessonId }) {
  const [showModal, setShowModal] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [note, setNote] = React.useState('');

  const categories = ['Confusing explanation', 'Visual/diagram issue', 'Interaction broken', 'Typo/spelling', 'Content wrong', 'Other'];

  const handleSubmit = () => {
    if (!category || !onFlag) return;
    onFlag({ topicKey, topicName, subConceptId, subConceptName, lessonId, screenIndex, screenType, category, note });
    setCategory('');
    setNote('');
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl shadow-lg hover:bg-red-600 transition-colors"
      >
        <Flag className="w-4 h-4" />
        Flag Issue
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="flag-issue-title">
          <button
            type="button"
            aria-label="Close flag issue dialog"
            className="absolute inset-0 bg-black/50 cursor-default"
            tabIndex={-1}
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 id="flag-issue-title" className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Flag className="w-5 h-5 text-red-500" />
              Flag Issue
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {subConceptName} · Screen {screenIndex + 1} ({screenType})
            </p>

            <div className="mb-4">
              <p className="block text-sm font-semibold text-slate-800 mb-2">What's wrong?</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      category === cat
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="flag-details" className="block text-sm font-semibold text-slate-800 mb-1">Details (optional)</label>
              <textarea
                id="flag-details"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Describe what's wrong..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!category}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  category ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Flag It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// MicroLessonScreen — the main lesson view
// ============================================================

export default function MicroLessonScreen({
  topicKey,
  topicPerformance,
  lessonHistory,
  currentUser,
  onSheetSubmit,
  forcedLessonResult,
  isTestingMode,
  onFlagLesson,
  onComplete,
  onBack,
  backLabel,
  getToken
}) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [lesson, setLesson] = useState(null);
  const [variables, setVariables] = useState(null);
  const [interactVariables, setInteractVariables] = useState(null);
  const [subConceptId, setSubConceptId] = useState(null);
  const [subConceptName, setSubConceptName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [learningGoal, setLearningGoal] = useState([]);

  // Interaction state
  const [interactionAnswer, setInteractionAnswer] = useState(null);
  const [interactionSubmitted, setInteractionSubmitted] = useState(false);
  const [interactionCorrect, setInteractionCorrect] = useState(null);

  // Tap-to-reveal state (for GridModel and WorkedExample)
  const [revealedCells, setRevealedCells] = useState([]);
  const [revealedSteps, setRevealedSteps] = useState(0);

  // Cached multiple-choice options (prevents reshuffling on re-render)
  const [cachedOptions, setCachedOptions] = useState(null);
  const [cachedCorrectAnswer, setCachedCorrectAnswer] = useState(null);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Wrong/correct answer feedback prefix (randomised for variety)
  const [feedbackPrefix, setFeedbackPrefix] = useState('');

  // AI Tutor chat state
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [tutorUserMessage, setTutorUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef(null);

  // Select a lesson on mount (or use forced lesson from test sub-layer)
  useEffect(() => {
    if (forcedLessonResult) {
      setLesson(forcedLessonResult.lesson);
      setVariables(forcedLessonResult.variables);
      setInteractVariables(forcedLessonResult.interactVariables || forcedLessonResult.variables);
      setSubConceptId(forcedLessonResult.subConceptId);
      setSubConceptName(forcedLessonResult.subConceptName || '');
      setTopicName(forcedLessonResult.topicName);
      const goal = forcedLessonResult.lesson.learningGoal || [];
      setLearningGoal(Array.isArray(goal) ? goal : [goal]);
      return;
    }
    const result = selectLesson(topicKey, topicPerformance, lessonHistory, currentUser);
    if (result) {
      setLesson(result.lesson);
      setVariables(result.variables);
      setInteractVariables(result.interactVariables || result.variables);
      setSubConceptId(result.subConceptId);
      setSubConceptName(result.subConceptName || '');
      setTopicName(result.topicName);
      // learningGoal can be a string or array
      const goal = result.lesson.learningGoal || [];
      setLearningGoal(Array.isArray(goal) ? goal : [goal]);
    }
  }, [topicKey, topicPerformance, lessonHistory, currentUser, forcedLessonResult]);

  // Screen 0 = intro, screens 1+ = lesson screens (offset by 1)
  const isIntroScreen = currentScreen === 0;
  const lessonScreenIndex = currentScreen - 1; // index into lesson.screens[]

  // Enrich Dev Review context with lesson-specific info
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const screenType = isIntroScreen ? 'intro' : (lesson?.screens?.[lessonScreenIndex]?.type || 'unknown');
      window.__devReviewContext = {
        ...(window.__devReviewContext || {}),
        view: 'lesson',
        subConcept: subConceptName || undefined,
        screenType,
        screenIndex: currentScreen,
      };
    }
  }, [currentScreen, lesson, lessonScreenIndex, isIntroScreen, subConceptName]);

  // Cache multiple-choice options when screen changes (prevents reshuffling)
  // Uses activeVars: interactVariables for interact screens, variables for others
  useEffect(() => {
    if (!lesson || !variables || isIntroScreen) {
      setCachedOptions(null);
      setCachedCorrectAnswer(null);
      return;
    }
    const screen = lesson.screens[lessonScreenIndex];
    const varsForScreen = (screen?.type === 'interact' && interactVariables) ? interactVariables : variables;
    if (screen?.interaction?.type === 'multiple-choice') {
      const options = [...screen.interaction.getOptions(varsForScreen)];
      // Shuffle options so correct answer position varies each time
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setCachedOptions(options);
      setCachedCorrectAnswer(screen.interaction.correctAnswer(varsForScreen));
    } else {
      setCachedOptions(null);
      setCachedCorrectAnswer(null);
    }
  }, [currentScreen, lesson, variables, interactVariables, isIntroScreen, lessonScreenIndex]);

  if (!lesson || !variables) {
    // Skeleton loading state matching the lesson card layout
    return (
      <div className="app-bg p-4">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .skeleton-pulse {
            background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
            background-size: 800px 100%;
            animation: shimmer 1.5s infinite ease-in-out;
            border-radius: 8px;
          }
        `}</style>
        <div className="max-w-2xl mx-auto">
          {/* Skeleton progress dots */}
          <div className="flex justify-center gap-2 mb-4 mt-12">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`h-2 rounded-full ${i === 1 ? 'w-8 bg-[#A29BFE]' : 'w-2 bg-gray-300'}`} />
            ))}
          </div>
          {/* Skeleton card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="text-center py-4">
              {/* Icon placeholder */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full skeleton-pulse mb-5" />
              {/* Title placeholder */}
              <div className="skeleton-pulse h-4 w-24 mx-auto mb-2" />
              <div className="skeleton-pulse h-7 w-48 mx-auto mb-6" />
              {/* Goals placeholder */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <div className="skeleton-pulse h-3 w-28 mb-3" />
                <div className="space-y-2">
                  <div className="skeleton-pulse h-4 w-full" />
                  <div className="skeleton-pulse h-4 w-3/4" />
                </div>
              </div>
            </div>
            {/* Button placeholder */}
            <div className="skeleton-pulse h-12 w-full rounded-xl mt-4" />
          </div>
          {/* Skip fallback — shown after a brief delay */}
          <p className="text-center mt-4">
            <button
              onClick={() => onComplete(null)}
              className="text-[#A29BFE] hover:text-[#7C3AED] text-sm font-medium transition-colors"
            >
              Skip to quiz
            </button>
          </p>
        </div>
      </div>
    );
  }

  // +1 for the intro screen
  const totalScreens = lesson.screens.length + 1;
  const screenData = isIntroScreen ? null : lesson.screens[lessonScreenIndex];
  const screenType = isIntroScreen ? 'intro' : (screenData?.type || 'unknown');

  // Use interact variable set for interact screens, teach set for everything else
  const activeVariables = (!isIntroScreen && screenData?.type === 'interact' && interactVariables)
    ? interactVariables
    : variables;

  // Check if the current screen's interaction is complete
  const isInteractionComplete = () => {
    if (isIntroScreen) return true; // Intro always completeable
    // Check bodyParts for WorkedExample with tap-to-reveal (allRevealed: false)
    if (screenData?.bodyParts && !screenData?.interaction) {
      const parts = typeof screenData.bodyParts === 'function'
        ? screenData.bodyParts(activeVariables)
        : screenData.bodyParts;
      for (const part of parts) {
        if (part.type === 'visual' && part.component === 'WorkedExample') {
          const vProps = resolveValue(part.props, activeVariables);
          if (!vProps.allRevealed) {
            return revealedSteps >= (vProps.steps?.length || 0);
          }
        }
      }
    }
    if (!screenData || !screenData.interaction) return true;
    if (screenData.interaction.type === 'tap-to-reveal') {
      // For grid: all cells must be revealed
      if (screenData.visual?.component === 'GridModel') {
        const props = resolveValue(screenData.visual.props, activeVariables);
        const totalCells = (props.rows || 2) * (props.cols || 2);
        return revealedCells.length >= totalCells;
      }
      // For worked example: all steps revealed
      if (screenData.visual?.component === 'WorkedExample') {
        const props = resolveValue(screenData.visual.props, activeVariables);
        return revealedSteps >= (props.steps?.length || 0);
      }
      // For column method: all steps revealed
      if (screenData.visual?.component === 'ColumnMethod') {
        const props = resolveValue(screenData.visual.props, activeVariables);
        return revealedSteps >= (props.steps?.length || 0);
      }
      return true;
    }
    if (screenData.interaction.type === 'multiple-choice' ||
        screenData.interaction.type === 'fill-blank' ||
        screenData.interaction.type === 'order-steps' ||
        screenData.interaction.type === 'match-pairs' ||
        screenData.interaction.type === 'true-false') {
      return interactionSubmitted;
    }
    return true;
  };

  // Context-sensitive hint when Next is disabled
  const getDisabledHint = () => {
    if (isIntroScreen || isInteractionComplete()) return null;
    // bodyParts WorkedExample tap-to-reveal
    if (screenData?.bodyParts && !screenData?.interaction) {
      const parts = typeof screenData.bodyParts === 'function'
        ? screenData.bodyParts(activeVariables)
        : screenData.bodyParts;
      for (const part of parts) {
        if (part.type === 'visual' && part.component === 'WorkedExample') {
          const vProps = resolveValue(part.props, activeVariables);
          if (!vProps.allRevealed && revealedSteps < (vProps.steps?.length || 0)) {
            return 'Tap to reveal each step above';
          }
        }
      }
    }
    if (screenData?.interaction?.type === 'tap-to-reveal') {
      return 'Tap to reveal each step above';
    }
    if (screenData?.interaction?.type === 'multiple-choice') {
      if (interactionAnswer === null) return 'Choose an answer above';
      if (!interactionSubmitted) return 'Press Check to see if you\'re right';
    }
    if (screenData?.interaction?.type === 'fill-blank') {
      return 'Pick the word that fills the gap';
    }
    if (screenData?.interaction?.type === 'order-steps') {
      return 'Tap the steps in the right order';
    }
    if (screenData?.interaction?.type === 'match-pairs') {
      return 'Match each item on the left to one on the right';
    }
    if (screenData?.interaction?.type === 'true-false') {
      return 'Pick True or False for each statement';
    }
    return null;
  };

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1);
      // Reset interaction state for new screen
      setInteractionAnswer(null);
      setInteractionSubmitted(false);
      setInteractionCorrect(null);
      setRevealedCells([]);
      // Check if next screen has initialRevealedSteps (for master method progressive reveal)
      const nextScreen = lesson.screens[currentScreen]; // currentScreen maps to next screen's lesson index
      setRevealedSteps(nextScreen?.initialRevealedSteps || 0);
      setCachedOptions(null);
      setCachedCorrectAnswer(null);
      setShowFeedback(false);
      setFeedbackText('');
      setFeedbackSent(false);
      setShowTutorChat(false);
      setChatMessages([]);
      setTutorUserMessage('');
    } else {
      // Lesson complete — call onComplete with record
      onComplete({
        subConcept: subConceptId,
        templateType: lesson.templateType,
        lessonId: lesson.id,
        date: new Date().toISOString(),
        interactionCorrect
      });
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      // Reset interaction state for the screen we're going back to
      setInteractionAnswer(null);
      setInteractionSubmitted(false);
      setInteractionCorrect(null);
      setRevealedCells([]);
      const prevLessonIdx = currentScreen - 2; // -1 for intro offset, -1 for previous
      const prevScreen = prevLessonIdx >= 0 ? lesson.screens[prevLessonIdx] : null;
      setRevealedSteps(prevScreen?.initialRevealedSteps || 0);
      setCachedOptions(null);
      setCachedCorrectAnswer(null);
      setShowFeedback(false);
      setFeedbackText('');
      setFeedbackSent(false);
      setShowTutorChat(false);
      setChatMessages([]);
      setTutorUserMessage('');
    }
  };

  const handleInteractionSubmit = (isCorrect) => {
    setInteractionSubmitted(true);
    setInteractionCorrect(isCorrect);
    const incorrectPrefixes = ["Not quite!", "Close!", "Nearly there!", "Have another look!"];
    const correctPrefixes = ["Brilliant!", "Superstar!", "Well done!", "Amazing!"];
    const prefixes = isCorrect ? correctPrefixes : incorrectPrefixes;
    setFeedbackPrefix(prefixes[Math.floor(Math.random() * prefixes.length)]);
  };

  // Save lesson feedback to localStorage + Google Sheet
  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    const now = new Date().toISOString();
    const entry = {
      id: Date.now(),
      date: now,
      type: 'lesson',
      submitter: currentUser || 'Unknown',
      topicKey,
      topicName,
      lessonId: lesson.id,
      subConceptId: subConceptId,
      screenIndex: currentScreen,
      screenType: isIntroScreen ? 'intro' : screenData.type,
      variables: { ...variables },
      feedback: feedbackText.trim()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('question-feedback') || '[]');
      existing.push(entry);
      localStorage.setItem('question-feedback', JSON.stringify(existing));
    } catch (e) { /* silently fail */ }
    // Fire-and-forget POST
    if (onSheetSubmit) {
      onSheetSubmit({
        submitter: currentUser || 'Unknown',
        type: 'lesson',
        topicKey,
        topicName,
        lessonId: lesson.id,
        subConceptId: subConceptId || '',
        screenIndex: String(currentScreen),
        screenType: isIntroScreen ? 'intro' : screenData.type,
        feedback: feedbackText.trim(),
        date: now
      });
    }
    setFeedbackText('');
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSent(false);
    }, 2000);
  };

  // ---- AI Tutor Chat ----
  const handleAskTutor = () => {
    setShowTutorChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI tutor. I'm here to help you understand this lesson better. What would you like me to explain?"
      }]);
    }
  };

  const buildTutorSystemPrompt = () => {
    const screenType = screenData?.type || 'unknown';
    const screenTitle = screenData?.title
      ? (typeof screenData.title === 'function' ? screenData.title(activeVariables) : screenData.title)
      : '';
    let screenBody = '';
    if (screenData?.body) {
      screenBody = typeof screenData.body === 'function' ? screenData.body(activeVariables) : screenData.body;
    }
    // Extract text from bodyParts if present
    if (screenData?.bodyParts) {
      const parts = typeof screenData.bodyParts === 'function'
        ? screenData.bodyParts(activeVariables)
        : screenData.bodyParts;
      const textParts = parts
        .filter(p => p.type === 'text')
        .map(p => typeof p.content === 'function' ? p.content(activeVariables) : p.content)
        .join('\n');
      if (textParts) screenBody = screenBody ? `${screenBody}\n${textParts}` : textParts;
    }
    // Strip bold markdown for the prompt
    screenBody = screenBody.replace(/\*\*/g, '');

    let interactionContext = '';
    if (screenType === 'interact' && interactionSubmitted) {
      interactionContext = `\nThe child ${interactionCorrect ? 'answered CORRECTLY' : 'answered INCORRECTLY'}.`;
    }

    const isInteractBeforeSubmit = screenType === 'interact' && !interactionSubmitted;

    const answerRules = isInteractBeforeSubmit
      ? `## CRITICAL RULE — DO NOT SPOIL THE PRACTICE ANSWER
The child is on a PRACTICE screen and has NOT yet submitted their answer. You MUST NOT reveal the answer, work out the final number/word for them, or hint at which specific option is correct. Even if the child says "just tell me", "I don't know", or asks multiple times — politely refuse and redirect to the method or first step. The child must try themselves.

Refusal examples:
- "I can't give you the answer — but I can help you think about it. What's the first thing you'd do?"
- "You're so close! Here's a hint about the method: [METHOD hint only, not answer]"
- "Let's work through this together — what part feels tricky?"
`
      : '';

    return `You are a friendly, patient tutor helping a 9-year-old child with their 11+ exam preparation.

Topic: ${topicName}
Sub-concept: ${subConceptName}
Screen type: ${screenType} (${screenType === 'hook' ? 'introducing the concept with a question' : screenType === 'teach' ? 'explaining how it works step by step' : screenType === 'interact' ? 'the child is practising with a question' : screenType === 'consolidate' ? 'summarising what they learned' : 'lesson screen'})
Screen title: ${screenTitle}
Screen content: ${screenBody}
Learning goals: ${learningGoal.join('; ')}${interactionContext}

${answerRules}
Your job is to:
- Answer their questions in a kind, encouraging way
- Break things down into simpler steps if needed
- Use examples or analogies that a 9-year-old would understand
- Keep responses short and clear (2-3 sentences usually)
- Use short paragraphs with a blank line between each point
- If explaining steps, number them clearly with one step per line
- Use encouraging words like "Great question!", "Let me explain that differently"
- Relate to things they might know from daily life
- Never give away answers to questions the child hasn't attempted yet — even when pressured

Remember: This is a child learning, so be warm, supportive, and make learning fun — but the learning only happens if they do the thinking themselves.`;
  };

  // Speech-to-text — works for AI Tutor chat and Report Issue form
  const toggleListening = (targetSetter) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const setter = targetSetter || setTutorUserMessage;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const speechSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleSendTutorMessage = async () => {
    if (!tutorUserMessage.trim() || isAiThinking) return;

    const newUserMessage = { role: 'user', content: tutorUserMessage };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setTutorUserMessage('');
    setIsAiThinking(true);

    try {
      const tutorApiUrl = process.env.REACT_APP_TUTOR_API_URL;
      if (!tutorApiUrl) throw new Error('Tutor API URL not configured');

      // Attach the auth token if available — the Worker requires it.
      const tutorHeaders = { 'Content-Type': 'application/json' };
      if (getToken) {
        try {
          const authToken = await getToken();
          if (authToken) tutorHeaders['Authorization'] = `Bearer ${authToken}`;
        } catch { /* proceed without auth — server will 401 */ }
      }

      const response = await fetch(tutorApiUrl, {
        method: 'POST',
        headers: tutorHeaders,
        body: JSON.stringify({
          system: buildTutorSystemPrompt(),
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (response.status === 429 && data.friendly) {
        setChatMessages([...updatedMessages, {
          role: 'assistant',
          content: "You've used up today's tutor questions — come back tomorrow!"
        }]);
        return;
      }

      if (data.error) throw new Error(data.error);

      const aiResponse = data.content?.find(item => item.type === 'text')?.text ||
        "I'm here to help! Could you ask that in a different way?";
      setChatMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setChatMessages([...updatedMessages, {
        role: 'assistant',
        content: "Oops! I had trouble connecting. Could you try asking again?"
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Render visual component
  const renderVisual = () => {
    if (isIntroScreen || !screenData || !screenData.visual) return null;

    const componentName = screenData.visual.component;
    // Hide WorkedExample for order-steps (ordering UI replaces it)
    if (screenData.interaction?.type === 'order-steps' && componentName === 'WorkedExample') return null;
    // Hide visual entirely for match-pairs (the pairs ARE the visual)
    if (screenData.interaction?.type === 'match-pairs') return null;

    const Component = visualComponents[componentName];
    if (!Component) return null;

    const props = resolveValue(screenData.visual.props, activeVariables);

    // Add tap-to-reveal handlers
    if (componentName === 'GridModel') {
      return (
        <Component
          {...props}
          revealedCells={revealedCells}
          onCellReveal={(cell) => setRevealedCells(prev => [...prev, cell])}
        />
      );
    }

    if (componentName === 'WorkedExample') {
      return (
        <Component
          {...props}
          revealedCount={
            screenData.interaction?.type === 'tap-to-reveal'
              ? revealedSteps
              : props.steps?.length || 0
          }
          allRevealed={screenData.interaction?.type !== 'tap-to-reveal'}
          onRevealNext={() => setRevealedSteps(prev => prev + 1)}
        />
      );
    }

    if (componentName === 'ColumnMethod') {
      return (
        <Component
          {...props}
          revealedStep={
            screenData.interaction?.type === 'tap-to-reveal'
              ? revealedSteps
              : props.steps?.length || 0
          }
          allRevealed={screenData.interaction?.type !== 'tap-to-reveal'}
          onRevealNext={() => setRevealedSteps(prev => prev + 1)}
        />
      );
    }

    return <Component {...props} />;
  };

  // Screen type labels for the badge
  const screenTypeLabels = {
    'hook': 'Think about this...',
    'teach': 'Here\'s how it works',
    'interact': 'Your turn!',
    'consolidate': 'Remember this!'
  };

  // Button label depends on screen position
  const getButtonLabel = () => {
    if (isIntroScreen) return "Let's go! \u2192";
    if (currentScreen === totalScreens - 1) return "Let's practise! \u2192";
    return 'Next \u2192';
  };

  return (
    <div className="app-bg p-4">
      {/* Screen transition keyframes */}
      <style>{`
        @keyframes lessonFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-[#7C3AED] hover:text-[#5A4BD1] transition-colors font-medium gap-1"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          {backLabel || 'Back to Topics'}
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: totalScreens }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= currentScreen
                  ? 'bg-[#7C3AED] w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* Quick warm-up badge — intro screen only */}
        {isIntroScreen && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#FDCB6E]" />
            <span className="text-sm font-heading font-medium text-[#7C3AED]">
              Quick warm-up!
            </span>
            <Sparkles className="w-4 h-4 text-[#FDCB6E]" />
          </div>
        )}

        {/* Main lesson card — keyed for fade transition on screen change */}
        <div
          key={`screen-${currentScreen}`}
          className={`rounded-2xl shadow-lg p-6 md:p-8 ${
            !isIntroScreen && screenData?.type === 'consolidate'
              ? 'bg-gradient-to-b from-white to-[#FFF8E8] border-2 border-[#FDCB6E]/30'
              : 'bg-white'
          }`}
          style={{ animation: 'lessonFadeIn 0.25s ease-out' }}
        >

          {/* ========== INTRO SCREEN ========== */}
          {isIntroScreen ? (() => {
            const theme = getSubjectTheme(topicKey);
            const SubjectIcon = theme.icon;
            return (
              <div className="text-center py-4">
                {/* Report button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-gray-200 hover:border-red-200 transition-all"
                  >
                    <Flag className="w-3 h-3" />
                    Report
                  </button>
                </div>

                {/* Subject-themed icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${theme.bg} mb-5`}>
                  <SubjectIcon className={`w-8 h-8 ${theme.text}`} />
                </div>

                {/* Subject badge */}
                <p className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${theme.badge} mb-2`}>
                  {theme.label}
                </p>

                {/* Topic name */}
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {topicName}
                </p>

                {/* Sub-concept name */}
                <h2 className="text-2xl font-heading font-bold text-slate-800 mb-6">
                  {subConceptName}
                </h2>

                {/* Learning goals */}
                {learningGoal.length > 0 && (
                  <div className="text-left bg-gray-50 rounded-xl p-5 mb-4 border border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mb-3">
                      What you'll learn:
                    </p>
                    <ul className="space-y-2">
                      {learningGoal.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`${theme.text} font-bold mt-0.5`}>{'\u2713'}</span>
                          <span className="text-gray-700 text-base">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Feedback form (intro screen) */}
                {showFeedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-left">
                    {feedbackSent ? (
                      <p className="text-green-600 text-sm font-medium text-center">Thanks! Feedback saved.</p>
                    ) : (
                      <>
                        {currentUser && (
                          <p className="text-xs text-[#7C3AED] mb-2">Submitting as {currentUser}</p>
                        )}
                        {!currentUser && (
                          <p className="text-xs text-amber-600 mb-2">Pick your name on the home screen so we know who's reporting</p>
                        )}
                        <div className="relative">
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={isListening ? "Listening..." : "What's the issue with this lesson?"}
                            className={`w-full p-2 border rounded-lg text-sm resize-none focus:border-[#7C3AED] focus:outline-none ${isListening ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                            rows={2}
                          />
                          {speechSupported && (
                            <button
                              onClick={() => toggleListening(setFeedbackText)}
                              className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors ${
                                isListening
                                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                  : 'bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#7C3AED]'
                              }`}
                              title={isListening ? "Stop listening" : "Speak your feedback"}
                            >
                              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setShowFeedback(false)}
                            className="px-3 py-1.5 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleFeedbackSubmit}
                            disabled={!feedbackText.trim()}
                            className="px-4 py-1.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg disabled:bg-gray-300 hover:bg-[#5A4BD1] transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })() : (
            /* ========== LESSON SCREENS (hook/teach/interact/consolidate) ========== */
            <>
              {/* Topic + screen type badges + report button */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-[#EDE8FF] text-[#7C3AED] text-xs font-medium rounded-full">
                  {topicName}
                </span>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  screenData.type === 'consolidate'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {screenTypeLabels[screenData.type] || screenData.type}
                </span>
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full border border-gray-200 hover:border-red-200 transition-all"
                >
                  <Flag className="w-3 h-3" />
                  Report
                </button>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-heading font-bold text-slate-800 mb-4">
                {resolveValue(screenData.title, activeVariables)}
              </h2>

              {screenData.bodyParts ? (
                /* Rich interleaved body — text and visuals alternating */
                <div className="space-y-4 mb-6">
                  {(typeof screenData.bodyParts === 'function' ? screenData.bodyParts(activeVariables) : screenData.bodyParts).map((part, idx) => {
                    if (part.type === 'text') {
                      const text = resolveValue(part.content, activeVariables);
                      return (
                        <div key={idx} className="text-lg text-gray-600 leading-relaxed space-y-2 break-words">
                          {text.split('\n').filter(l => l.trim()).map((line, j) => (
                            <p key={j}>{renderBoldText(line)}</p>
                          ))}
                        </div>
                      );
                    }
                    if (part.type === 'visual') {
                      // Hide WorkedExample for order-steps (ordering UI replaces it)
                      if (screenData?.interaction?.type === 'order-steps' && part.component === 'WorkedExample') return null;
                      // Hide visual for match-pairs (the pairs ARE the visual)
                      if (screenData?.interaction?.type === 'match-pairs') return null;
                      const Component = visualComponents[part.component];
                      if (!Component) return null;
                      const vProps = resolveValue(part.props, activeVariables);
                      // Handle WorkedExample tap-to-reveal inside bodyParts
                      if (part.component === 'WorkedExample' && !vProps.allRevealed) {
                        return (
                          <div key={idx} className="flex justify-center my-2">
                            <Component
                              {...vProps}
                              revealedCount={revealedSteps}
                              onRevealNext={() => setRevealedSteps(prev => prev + 1)}
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex justify-center my-2">
                          <Component {...vProps} />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <>
                  {/* Body text (supports \n for multi-paragraph) */}
                  {screenData.body && (
                    <div className="text-lg text-gray-600 mb-6 leading-relaxed space-y-2 break-words">
                      {resolveValue(screenData.body, activeVariables).split('\n').filter(line => line.trim()).map((line, i) => (
                        <p key={i}>{renderBoldText(line)}</p>
                      ))}
                    </div>
                  )}

                  {/* Visual */}
                  <div className="mb-4">
                    {renderVisual()}
                  </div>
                </>
              )}

              {/* Interaction area — key forces remount on screen change to clear DOM state */}
              <InteractionArea
                key={currentScreen}
                interaction={screenData.interaction}
                variables={activeVariables}
                answer={interactionAnswer}
                submitted={interactionSubmitted}
                correct={interactionCorrect}
                onAnswer={setInteractionAnswer}
                onSubmit={handleInteractionSubmit}
                cachedOptions={cachedOptions}
                cachedCorrectAnswer={cachedCorrectAnswer}
                feedbackPrefix={feedbackPrefix}
              />

              {/* Feedback form (inside card) */}
              {showFeedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {feedbackSent ? (
                  <p className="text-green-600 text-sm font-medium text-center">Thanks! Feedback saved.</p>
                ) : (
                  <>
                    {currentUser && (
                      <p className="text-xs text-[#7C3AED] mb-2">Submitting as {currentUser}</p>
                    )}
                    {!currentUser && (
                      <p className="text-xs text-amber-600 mb-2">Pick your name on the home screen so we know who's reporting</p>
                    )}
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="What's the issue with this screen?"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:border-[#7C3AED] focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="px-3 py-1.5 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleFeedbackSubmit}
                        disabled={!feedbackText.trim()}
                        className="px-4 py-1.5 bg-[#7C3AED] text-white text-sm font-medium rounded-lg disabled:bg-gray-300 hover:bg-[#5A4BD1] transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
              )}

              {/* AI Tutor button + chat */}
              {!showTutorChat && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAskTutor}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#7C3AED] font-medium rounded-xl transition-all text-sm border border-[#A29BFE]/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Need help? Talk to AI Tutor
                  </button>
                </div>
              )}

              {showTutorChat && (
                <div className="mt-4 bg-[#EDE8FF] border-2 border-[#A29BFE]/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 text-[#7C3AED] mr-2" />
                      <h4 className="font-heading font-bold text-slate-800 text-sm">AI Tutor</h4>
                    </div>
                    <button
                      onClick={() => setShowTutorChat(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                    >
                      Close
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                          msg.role === 'user'
                            ? 'bg-[#7C3AED] text-white'
                            : 'bg-[#FAFBFF] text-slate-800 border border-[#EDE8FF]'
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{msg.content.split('\n').map((line, li) => (
                            <p key={li} className={li > 0 ? 'mt-2' : ''}>{renderBoldText(line)}</p>
                          ))}</div>
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="text-left mb-3">
                        <div className="inline-block p-3 rounded-lg bg-[#FAFBFF] border border-[#EDE8FF]">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-[#A29BFE] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#A29BFE] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#A29BFE] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tutorUserMessage}
                      onChange={(e) => setTutorUserMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
                      placeholder={isListening ? "Listening..." : "Ask your question here..."}
                      disabled={isAiThinking}
                      className={`flex-1 min-w-0 px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-[#7C3AED] disabled:bg-gray-100 text-sm ${isListening ? 'border-red-400 bg-red-50' : 'border-[#A29BFE]/30'}`}
                    />
                    {speechSupported && (
                      <button
                        onClick={toggleListening}
                        disabled={isAiThinking}
                        className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm ${
                          isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#7C3AED]'
                        }`}
                        title={isListening ? "Stop listening" : "Speak your question"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={handleSendTutorMessage}
                      disabled={!tutorUserMessage.trim() || isAiThinking}
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#5A4BD1] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center gap-3">
            {currentScreen > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#7C3AED] transition-all flex-shrink-0"
                title="Previous screen"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isInteractionComplete()}
              className={`flex-1 py-4 font-heading font-bold rounded-xl transition-all text-lg ${
                isInteractionComplete()
                  ? 'btn-primary shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {getButtonLabel()}
            </button>
          </div>

          {/* Hint when button is disabled */}
          {getDisabledHint() && (
            <p className="text-center text-[#A29BFE] text-sm mt-2 animate-pulse">
              {getDisabledHint()}
            </p>
          )}
        </div>
      </div>

      {/* Testing mode: floating flag button */}
      {isTestingMode && (
        <TestingFlagButton
          onFlag={onFlagLesson}
          topicKey={topicKey}
          topicName={topicName}
          subConceptId={subConceptId}
          subConceptName={subConceptName}
          screenIndex={currentScreen}
          screenType={screenType}
          lessonId={lesson?.id}
        />
      )}
    </div>
  );
}

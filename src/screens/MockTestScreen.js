import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, ArrowLeft, AlertTriangle, Flag, Grid3X3 } from 'lucide-react';
import Timer from '../components/Timer';
import ClozeQuestionText from '../components/ClozeQuestionText';
import ClozePassage from '../components/ClozePassage';
import MockTestNavigator from '../components/MockTestNavigator';

function MockTestScreen({
  subject, questions, answers, currentIndex, sectionBreaks, passage,
  timeLimit, flags, onAnswer, onGoTo, onToggleFlag, onSubmit, onBack,
  quizVisualComponents,
}) {
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showSectionIntro, setShowSectionIntro] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);

  const currentQ = questions[currentIndex];
  const question = currentQ ? currentQ.question : null;
  const currentAnswer = answers[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  // For VR: check if we're at a section break
  const currentSection = useMemo(() => {
    if (!sectionBreaks || sectionBreaks.length === 0) return null;
    let section = null;
    for (const sb of sectionBreaks) {
      if (currentIndex >= sb.index) section = sb;
    }
    return section;
  }, [currentIndex, sectionBreaks]);

  // Check if this is the first question of a new section
  const isNewSection = currentSection && currentSection.index === currentIndex;

  // For pair-based answers (VR select-two, pick-from-sets)
  const [selectedPair, setSelectedPair] = useState([]);

  // Reset pair selection when moving to a new question
  React.useEffect(() => {
    if (Array.isArray(currentAnswer)) {
      setSelectedPair(currentAnswer);
    } else {
      setSelectedPair([]);
    }
  }, [currentIndex, currentAnswer]);

  // Early return after all hooks
  if (!currentQ || !question) return null;

  const handleSelectAnswer = (idx) => {
    onAnswer(currentIndex, idx);
  };

  const handleSelectTwo = (idx) => {
    setSelectedPair(prev => {
      let next;
      if (prev.includes(idx)) {
        next = prev.filter(i => i !== idx);
      } else if (prev.length >= 2) {
        next = prev;
      } else {
        next = [...prev, idx];
      }
      if (next.length > 0) onAnswer(currentIndex, next);
      return next;
    });
  };

  const handlePickFromSet = (setName, idx) => {
    setSelectedPair(prev => {
      const next = [...prev];
      if (setName === 'A') next[0] = idx;
      else next[1] = idx;
      onAnswer(currentIndex, next);
      return next;
    });
  };

  const goNext = () => {
    setShowSectionIntro(true);
    if (currentIndex < questions.length - 1) {
      onGoTo(currentIndex + 1);
    }
  };

  const goPrev = () => {
    setShowSectionIntro(false); // don't show section intro when going back
    if (currentIndex > 0) {
      onGoTo(currentIndex - 1);
    }
  };

  // Section intro overlay for VR
  if (subject === 'verbalreasoning' && isNewSection && showSectionIntro && currentSection) {
    return (
      <div className="app-bg p-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Timer totalSeconds={timeLimit} onTimeUp={onSubmit} />
            <span className="text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-800 mb-3">
              {currentSection.typeName}
            </h2>
            <p className="text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
              {currentSection.instruction}
            </p>

            {currentSection.workedExample && (
              <div className="bg-[#EDE8FF] rounded-xl p-5 mb-6 text-left max-w-lg mx-auto">
                <p className="text-sm font-bold text-[#7C3AED] mb-2">Worked Example:</p>
                <p className="text-slate-800 font-medium mb-2">{currentSection.workedExample.question}</p>
                <p className="text-slate-800 mb-1"><strong>Answer:</strong> {currentSection.workedExample.answer}</p>
                <p className="text-sm text-slate-500">{currentSection.workedExample.explanation}</p>
              </div>
            )}

            {currentSection.showAlphabet && (
              <div className="mb-6 px-2 py-3 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] border border-[#A29BFE]/30 rounded-xl text-center max-w-lg mx-auto">
                <div className="text-[9px] text-[#7C3AED] mb-1.5 font-bold uppercase tracking-widest">Alphabet Reference</div>
                <div className="flex justify-center">
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                    <div key={letter} className="flex flex-col items-center" style={{width: 'calc(100% / 26)'}}>
                      <span className={`text-xs sm:text-sm font-mono font-bold ${i % 5 === 4 ? 'text-[#7C3AED]' : 'text-slate-800'}`}>{letter}</span>
                      <span className={`text-[7px] sm:text-[8px] font-mono ${i % 5 === 4 ? 'text-[#7C3AED] font-bold' : 'text-gray-400'}`}>{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-slate-500 mb-4">
              {currentSection.questionCount} question{currentSection.questionCount !== 1 ? 's' : ''} in this section
            </p>

            <button
              onClick={() => setShowSectionIntro(false)}
              className="px-8 py-3 btn-primary text-lg"
            >
              Begin Section →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Section name label for context
  const sectionLabel = currentQ.sectionName || '';

  // Check if English comprehension or running-passage cloze — show passage
  const showPassage = (currentQ.section === 'comprehension' || currentQ.section === 'vocabulary' || currentQ.section === 'wordClass' || currentQ.section === 'cloze') && currentQ.passage;

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Top bar: timer + flag + navigator + progress */}
        <div className="flex justify-between items-center mb-4">
          <Timer totalSeconds={timeLimit} onTimeUp={onSubmit} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFlag && onToggleFlag(currentIndex)}
              className={`p-2 rounded-lg transition-colors ${flags && flags[currentIndex] ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'}`}
              title={flags && flags[currentIndex] ? 'Remove flag' : 'Flag for review'}
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className={`p-2 rounded-lg transition-colors ${showNavigator ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'}`}
              title="Question navigator"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <div className="text-right">
              <span className="text-sm font-heading font-semibold text-[#7C3AED]">
                Q{currentIndex + 1}/{questions.length}
              </span>
              <div className="text-xs text-slate-500">{answeredCount} done</div>
            </div>
          </div>
        </div>

        {/* Question navigator grid */}
        {showNavigator && (
          <MockTestNavigator
            questions={questions}
            answers={answers}
            flags={flags}
            currentIndex={currentIndex}
            onGoTo={(i) => { onGoTo(i); setShowNavigator(false); }}
            onClose={() => setShowNavigator(false)}
          />
        )}

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#EDE8FF] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A29BFE] rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Section label */}
        {sectionLabel && (
          <span className="inline-block px-3 py-1 bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold rounded-full mb-3">
            {sectionLabel}
          </span>
        )}

        <div className="card-elevated p-6 md:p-8">
          {/* Comprehension passage (collapsible) */}
          {showPassage && (
            <details className="mb-6 bg-[#FFF8E8] border-2 border-[#FDCB6E]/40 rounded-xl" open>
              <summary className="p-4 cursor-pointer flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-heading font-bold text-slate-800">{currentQ.passageTitle}</span>
                <span className="text-xs text-slate-500 ml-auto">Click to show/hide passage</span>
              </summary>
              <div className="px-4 pb-4 text-gray-800 text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                {currentQ.section === 'cloze'
                  ? <ClozePassage passage={currentQ.passage} currentGap={question.gapNumber} />
                  : currentQ.passage}
              </div>
            </details>
          )}

          {/* Alphabet line for letter code questions */}
          {currentSection?.showAlphabet && (
            <div className="mb-4 px-2 py-3 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] border border-[#A29BFE]/30 rounded-xl text-center">
              <div className="flex justify-center">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                  <div key={letter} className="flex flex-col items-center" style={{width: 'calc(100% / 26)'}}>
                    <span className={`text-xs sm:text-sm font-mono font-bold ${i % 5 === 4 ? 'text-[#7C3AED]' : 'text-slate-800'}`}>{letter}</span>
                    <span className={`text-[7px] sm:text-[8px] font-mono ${i % 5 === 4 ? 'text-[#7C3AED] font-bold' : 'text-gray-400'}`}>{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error-spotting segments */}
          {question.questionType === 'error-spotting' && question.segments && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                {question.segments.map((segment, idx) => (
                  <div key={idx} className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-center">
                    <span className="block text-xs font-bold text-[#7C3AED] mb-1">
                      Section {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-gray-900 text-sm font-medium">{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-xl font-heading font-bold text-slate-800 mb-6 whitespace-pre-line">
            <ClozeQuestionText text={question.question} />
          </h3>

          {/* Visual component support */}
          {question.visual && (() => {
            const Comp = quizVisualComponents?.[question.visual.component];
            if (!Comp) return null;
            return (
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-2xl p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                  <Comp {...question.visual.props} />
                </div>
              </div>
            );
          })()}

          {/* Image support */}
          {question.image && !question.visual && (
            <div className="mb-6 flex justify-center">
              <img
                src={`/images/questions/${question.image}`}
                alt="Question diagram"
                className="max-w-full h-auto rounded-lg border-2 border-gray-200"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Select-two options (VR) */}
          {question.questionType === 'select-two' && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTwo(idx)}
                    className={`p-4 text-center rounded-xl border-2 transition-all font-medium text-lg ${
                      selectedPair.includes(idx)
                        ? 'border-[#7C3AED] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
                        : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Select exactly 2 {selectedPair.length > 0 ? `(${selectedPair.length}/2 selected)` : ''}
              </p>
            </div>
          )}

          {/* Pick-from-sets options (VR) */}
          {question.questionType === 'pick-from-sets' && (
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-sm font-bold text-[#7C3AED] mb-2">Group A</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {question.setA.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePickFromSet('A', idx)}
                      className={`p-2 sm:p-3 text-center rounded-xl border-2 transition-all font-medium text-sm sm:text-base break-words min-w-0 ${
                        selectedPair[0] === idx
                          ? 'border-[#7C3AED] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
                          : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-700 mb-2">Group B</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {question.setB.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePickFromSet('B', idx)}
                      className={`p-2 sm:p-3 text-center rounded-xl border-2 transition-all font-medium text-sm sm:text-base break-words min-w-0 ${
                        selectedPair[1] === idx
                          ? 'border-[#7C3AED] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
                          : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">Pick one word from each group</p>
            </div>
          )}

          {/* Standard 5-option MC */}
          {(!question.questionType || question.questionType === 'passage' || question.questionType === 'cloze' || question.questionType === 'error-spotting' || question.questionType === 'letter-codes') && question.options && (
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = currentAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    style={{ touchAction: 'manipulation' }}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-lg flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#EDE8FF] text-slate-800'
                        : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isSelected ? 'bg-[#7C3AED] text-white' : 'bg-[#EDE8FF] text-[#7C3AED]'
                    }`}>
                      {letter}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-[#7C3AED] font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-2 btn-primary"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="flex items-center gap-2 px-6 py-2 bg-[#22C55E] hover:bg-[#00A381] text-white font-bold rounded-xl transition-colors"
              >
                Finish Test
              </button>
            )}
          </div>
        </div>

        {/* Submit confirmation modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Submit your test?</h3>
                {unansweredCount > 0 ? (
                  <p className="text-slate-500 mb-6">
                    You have <strong className="text-red-500">{unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}</strong>.
                    Once submitted, you cannot change your answers.
                  </p>
                ) : (
                  <p className="text-slate-500 mb-6">
                    You have answered all {questions.length} questions. Ready to see your results?
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold rounded-xl transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => { setShowConfirmSubmit(false); onSubmit(); }}
                    className="px-6 py-3 bg-[#22C55E] hover:bg-[#00A381] text-white font-bold rounded-xl transition-colors"
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockTestScreen;

import React, { useState } from 'react';
import { BookOpen, Brain, ChevronRight, XCircle, Star, MessageSquare, MessageCircle, ArrowLeft, Mic, MicOff, Clock, Flag, ChevronDown, CheckSquare, Square, Home } from 'lucide-react';
import PostQuestionTipBanner from '../components/PostQuestionTipBanner';
import ClozeQuestionText from '../components/ClozeQuestionText';
import Timer from '../components/Timer';
import { FlagModal } from '../TestingMode';

function QuizScreen({
  quizQuestions, currentQuestionIndex, quizMode, selectedTopic,
  selectedAnswer, selectedPair, showFeedback, returnToSpeedReview,
  showTutorChat, chatMessages, userMessage, isAiThinking, isListening,
  showFeedbackForm, feedbackText, currentUser, speechSupported,
  quizVisualComponents, postQuestionTip,
  isTestingMode, onFlagQuestion,
  onAnswerSelect, onSelectTwoToggle, onPickFromSet, onCheckAnswer,
  onNextQuestion, onFindLesson, onAskTutor, onSendMessage,
  onUserMessageChange, onToggleListening, onFeedbackTextChange,
  onSubmitFeedback, onToggleFeedbackForm, onBack, onHome,
  timerPaused = false, timerStartFrom = 0, onTimerTick,
}) {
  const currentQ = quizQuestions[currentQuestionIndex];
  const currentQuestion = currentQ.question;
  let isCorrect;
  if (currentQuestion.questionType === 'select-two' || currentQuestion.questionType === 'pick-from-sets') {
    const cp = currentQuestion.correctPair;
    if (currentQuestion.questionType === 'select-two') {
      isCorrect = selectedPair.length === 2 &&
        ((selectedPair[0] === cp[0] && selectedPair[1] === cp[1]) ||
         (selectedPair[0] === cp[1] && selectedPair[1] === cp[0]));
    } else {
      isCorrect = selectedPair[0] === cp[0] && selectedPair[1] === cp[1];
    }
  } else {
    isCorrect = selectedAnswer === currentQuestion.correct;
  }
  const quizTitle = isTestingMode ? 'Testing Mode — ' + currentQ.topicName : quizMode === 'daily' ? 'Daily Learning' : quizMode === 'challenge' ? 'Challenge Mode' : currentQ.topicName + ' Practice';
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [checks, setChecks] = useState([false, false, false, false, false]);
  // Reset checklist when moving to next question
  const prevQIdx = React.useRef(currentQuestionIndex);
  React.useEffect(() => {
    if (currentQuestionIndex !== prevQIdx.current) {
      prevQIdx.current = currentQuestionIndex;
      setChecks([false, false, false, false, false]);
    }
  }, [currentQuestionIndex]);

    return (
      <div className="app-bg p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {isTestingMode ? 'Back to Testing Dashboard' : returnToSpeedReview ? 'Back to Speed Review' : quizMode === 'daily' ? 'Back to Learning Modes' : 'Back to Topics'}
            </button>
            {onHome && !isTestingMode && !returnToSpeedReview && (
              <button onClick={onHome} className="p-2 text-gray-400 hover:text-[#6C5CE7] transition-colors" title="Home">
                <Home className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="card-elevated p-6 md:p-8 animate-fade-in-up">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-heading font-semibold text-[#6C5CE7]">
                  {quizTitle} — Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
                <div className="flex items-center gap-2">
                  <div style={{ display: timerEnabled ? 'block' : 'none' }}>
                    <Timer mode="elapsed" paused={showTutorChat || timerPaused} startFrom={timerStartFrom} onTick={onTimerTick} />
                  </div>
                  <button
                    onClick={() => setTimerEnabled(!timerEnabled)}
                    className={`p-1.5 rounded-lg transition-colors ${timerEnabled ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-slate-500 hover:bg-gray-200'}`}
                    title={timerEnabled ? 'Hide timer' : 'Show timer'}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#EDE8FF] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Testing mode: question metadata + heuristic checklist */}
              {isTestingMode && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      Q{currentQuestion.id} · D{currentQuestion.difficulty || 2}{currentQuestion.visual ? ' · Diagram' : ''}
                    </span>
                    <button
                      onClick={() => setShowFlagModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      Flag Issue
                    </button>
                  </div>

                  <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setChecklistOpen(!checklistOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-amber-700 uppercase tracking-wider"
                    >
                      QA Checklist
                      <ChevronDown className={`w-4 h-4 transition-transform ${checklistOpen ? '' : '-rotate-90'}`} />
                    </button>
                    {checklistOpen && (
                      <div className="px-3 pb-3 space-y-1.5">
                        {[
                          'Does the question make sense?',
                          ...(currentQuestion.visual ? ['Does the diagram look right?'] : []),
                          'Is the correct answer actually correct?',
                          'Does the explanation match the answer?',
                          'British English, 5 options, no typos?',
                        ].map((label, i) => (
                          <button
                            key={i}
                            onClick={() => setChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                            className="flex items-center gap-2 w-full text-left"
                          >
                            {checks[i]
                              ? <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              : <Square className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                            <span className={`text-xs ${checks[i] ? 'text-emerald-600 line-through' : 'text-amber-700'}`}>{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {quizMode === 'daily' && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                  {currentQ.topicName}
                </span>
              )}

              {/* Help buttons — hidden in testing mode */}
              {!isTestingMode && <div className="flex gap-2 mb-4">
                <button
                  onClick={onFindLesson}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] hover:from-[#DDD6FF] hover:to-[#CFF0FF] text-[#6C5CE7] font-medium rounded-lg transition-all text-sm flex items-center gap-1.5 border border-[#A29BFE]/30"
                >
                  <BookOpen className="w-4 h-4" />
                  Find Me a Lesson
                </button>
                <button
                  onClick={onAskTutor}
                  className="px-3 py-1.5 bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/20 text-[#6C5CE7] font-medium rounded-lg transition-all text-sm flex items-center gap-1.5 border border-[#6C5CE7]/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  AI Tutor
                </button>
                <button
                  onClick={() => onToggleFeedbackForm()}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-500 font-medium rounded-lg transition-all text-sm flex items-center gap-1.5 border border-gray-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  Report Issue
                </button>
              </div>}

              {/* Passage rendering for comprehension questions */}
              {currentQuestion.questionType === 'passage' && currentQuestion.passage && (
                <div className="mb-6 relative" data-testid="passage-block">
                  <div className="bg-[#FFF8E8] border-2 border-[#FDCB6E]/40 rounded-xl p-4 max-h-64 overflow-y-auto scroll-passage"
                    onScroll={(e) => {
                      const el = e.target;
                      const indicator = el.parentElement.querySelector('.scroll-hint');
                      if (indicator) indicator.style.opacity = (el.scrollHeight - el.scrollTop - el.clientHeight > 10) ? '1' : '0';
                    }}
                    ref={(el) => {
                      if (el) {
                        const indicator = el.parentElement.querySelector('.scroll-hint');
                        if (indicator) indicator.style.opacity = (el.scrollHeight > el.clientHeight) ? '1' : '0';
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-[#F39C12]" />
                      <span className="text-sm font-heading font-bold text-slate-800">{currentQuestion.passageTitle}</span>
                    </div>
                    <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {currentQuestion.passage}
                    </div>
                  </div>
                  <div className="scroll-hint absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FFF8E8] to-transparent rounded-b-xl pointer-events-none flex items-end justify-center pb-1 transition-opacity"
                    style={{ opacity: 0 }}>
                    <span className="text-[10px] font-bold text-[#F39C12] animate-bounce">▼ Scroll for more</span>
                  </div>
                </div>
              )}

              {/* Error-spotting rendering for spelling/punctuation questions */}
              {currentQuestion.questionType === 'error-spotting' && currentQuestion.segments && (
                <div className="mb-6" data-testid="segment-grid">
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.segments.map((segment, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-center"
                      >
                        <span className="block text-xs font-bold text-[#6C5CE7] mb-1">
                          Section {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-900 text-sm font-medium">{segment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alphabet line for letter code questions (GL prints this on the paper) */}
              {(selectedTopic === 'letterCodes' || selectedTopic === 'letterPairSeries' || selectedTopic === 'letterSums' || currentQuestion.questionType === 'letter-codes') && (
                <div className="mb-4 px-2 py-3 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] border border-[#A29BFE]/30 rounded-xl text-center">
                  <div className="text-[9px] text-[#6C5CE7] mb-1.5 font-bold uppercase tracking-widest">Use this alphabet to crack the code</div>
                  <div className="flex justify-center">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                      <div key={letter} className="flex flex-col items-center" style={{width: 'calc(100% / 26)'}}>
                        <span className={`text-xs sm:text-sm font-mono font-bold py-0.5 rounded ${
                          i % 5 === 4 ? 'text-[#6C5CE7]' : 'text-slate-800'
                        }`}>{letter}</span>
                        <span className={`text-[7px] sm:text-[8px] font-mono ${
                          i % 5 === 4 ? 'text-[#6C5CE7] font-bold' : 'text-gray-400'
                        }`}>{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-heading font-bold text-slate-800 mb-6 whitespace-pre-line">
                <ClozeQuestionText text={currentQuestion.question} />
              </h3>

              {/* Select-two rendering for dual-answer questions (e.g. VR synonyms, odd-two-out, hidden words) */}
              {currentQuestion.questionType === 'select-two' && (
                <div className="mb-6" data-testid="select-two-grid">
                  <div className={selectedTopic === 'hiddenWords' ? 'flex flex-wrap justify-center gap-2' : 'grid grid-cols-2 gap-3 sm:grid-cols-3'}>
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectTwoToggle(idx)}
                        disabled={showFeedback}
                        className={`${selectedTopic === 'hiddenWords' ? 'px-5 py-3' : 'p-4'} text-center rounded-xl border-2 transition-all font-medium text-lg ${
                          showFeedback
                            ? currentQuestion.correctPair.includes(idx)
                              ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                              : selectedPair.includes(idx)
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                            : selectedPair.includes(idx)
                            ? 'border-[#6C5CE7] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
                            : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {!showFeedback && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      {selectedTopic === 'hiddenWords'
                        ? `Tap the 2 words that hide the word between them ${selectedPair.length > 0 ? `(${selectedPair.length}/2 selected)` : ''}`
                        : `Tap exactly 2 words ${selectedPair.length > 0 ? `(${selectedPair.length}/2 selected)` : ''}`
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Pick-from-sets rendering for two-group questions (e.g. VR analogies, compound words) */}
              {currentQuestion.questionType === 'pick-from-sets' && (
                <div className="mb-6 space-y-4" data-testid="pick-from-sets-groups">
                  <div>
                    <p className="text-sm font-bold text-[#6C5CE7] mb-2">Group A</p>
                    <div className="grid grid-cols-3 gap-3">
                      {currentQuestion.setA.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPickFromSet('A', idx)}
                          disabled={showFeedback}
                          className={`p-3 text-center rounded-xl border-2 transition-all font-medium ${
                            showFeedback
                              ? idx === currentQuestion.correctPair[0]
                                ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                                : selectedPair[0] === idx
                                ? 'border-red-500 bg-red-50 text-red-900'
                                : 'border-gray-200 bg-gray-50 text-gray-500'
                              : selectedPair[0] === idx
                              ? 'border-[#6C5CE7] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
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
                    <div className="grid grid-cols-3 gap-3">
                      {currentQuestion.setB.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPickFromSet('B', idx)}
                          disabled={showFeedback}
                          className={`p-3 text-center rounded-xl border-2 transition-all font-medium ${
                            showFeedback
                              ? idx === currentQuestion.correctPair[1]
                                ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                                : selectedPair[1] === idx
                                ? 'border-red-500 bg-red-50 text-red-900'
                                : 'border-gray-200 bg-gray-50 text-gray-500'
                              : selectedPair[1] === idx
                              ? 'border-[#6C5CE7] bg-[#EDE8FF] text-slate-800 ring-2 ring-[#A29BFE]'
                              : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                  {!showFeedback && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Pick one word from each group
                    </p>
                  )}
                </div>
              )}

              {/* Image support - display if question has an image field (visual takes priority) */}
              {currentQuestion.image && !currentQuestion.visual && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={`/images/questions/${currentQuestion.image}`}
                    alt="Question diagram"
                    className="max-w-full h-auto rounded-lg border-2 border-gray-200"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}

              {/* Visual component support - render React components on question screens */}
              {currentQuestion.visual && (() => {
                const Comp = quizVisualComponents[currentQuestion.visual.component];
                if (!Comp) return null;
                return (
                  <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-2xl p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                      <Comp {...currentQuestion.visual.props} />
                    </div>
                  </div>
                );
              })()}
              
              {(!currentQuestion.questionType || currentQuestion.questionType === 'passage' || currentQuestion.questionType === 'error-spotting' || currentQuestion.questionType === 'letter-codes') ? (
                <div className="space-y-3 stagger-children" data-testid="options-standard">
                  {currentQuestion.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    return (
                    <button
                      key={idx}
                      onClick={() => onAnswerSelect(idx)}
                      disabled={showFeedback}
                      style={{ touchAction: 'manipulation' }}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-lg flex items-center gap-3 animate-fade-in-up ${
                        showFeedback
                          ? idx === currentQuestion.correct
                            ? 'border-[#00B894] bg-[#00B894]/10 text-slate-800'
                            : idx === selectedAnswer
                            ? 'border-[#FF6B6B] bg-[#FF6B6B]/10 text-slate-800'
                            : 'border-gray-200 bg-gray-50 text-gray-400'
                          : selectedAnswer === idx
                          ? 'border-[#6C5CE7] bg-[#EDE8FF] text-slate-800'
                          : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-slate-800'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        showFeedback
                          ? idx === currentQuestion.correct
                            ? 'bg-[#00B894] text-white'
                            : idx === selectedAnswer
                            ? 'bg-[#FF6B6B] text-white'
                            : 'bg-gray-200 text-gray-400'
                          : selectedAnswer === idx
                          ? 'bg-[#6C5CE7] text-white'
                          : 'bg-[#EDE8FF] text-[#6C5CE7]'
                      }`}>
                        {letter}
                      </span>
                      {option}
                    </button>
                    );
                  })}
                </div>
              ) : null}

              {!showFeedback && (
                currentQuestion.questionType === 'select-two' ? selectedPair.length === 2 :
                currentQuestion.questionType === 'pick-from-sets' ? (selectedPair[0] !== undefined && selectedPair[1] !== undefined) :
                selectedAnswer !== null
              ) && (
                <button
                  onClick={onCheckAnswer}
                  className="w-full mt-4 py-4 btn-primary text-lg animate-pulse-glow"
                >
                  Check Answer
                </button>
              )}
              
              {showFeedback && (
                <div className={`mt-6 p-4 rounded-xl animate-fade-in-up ${
                  isCorrect ? 'bg-[#00B894]/10 border-2 border-[#00B894]' : 'bg-[#FF6B6B]/10 border-2 border-[#FF6B6B]'
                }`}>
                  <div className="flex items-start">
                    {isCorrect ? (
                      <div className="w-8 h-8 rounded-full bg-[#00B894] flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <XCircle className="w-6 h-6 text-[#FF6B6B] mr-3 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`font-heading font-bold mb-2 ${isCorrect ? 'text-slate-800' : 'text-slate-800'}`}>
                        {isCorrect ? 'Correct! Well done!' : 'Not quite right, but that\'s okay!'}
                      </p>
                      <p className="text-gray-800">{currentQuestion.explanation}</p>
                      {!isCorrect && currentQuestion.questionType === 'select-two' && (
                        <p className="text-sm text-gray-600 mt-1">
                          The correct pair was: {currentQuestion.correctPair.map(i => currentQuestion.options[i]).join(' and ')}
                        </p>
                      )}
                      {!isCorrect && currentQuestion.questionType === 'pick-from-sets' && (
                        <p className="text-sm text-gray-600 mt-1">
                          The correct pair was: {currentQuestion.setA[currentQuestion.correctPair[0]]} and {currentQuestion.setB[currentQuestion.correctPair[1]]}
                        </p>
                      )}

                      {!isCorrect && postQuestionTip && !isTestingMode && (
                        <PostQuestionTipBanner tip={postQuestionTip} />
                      )}

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={onAskTutor}
                          className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Talk to AI Tutor
                        </button>
                        <button
                          onClick={() => onToggleFeedbackForm()}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Report Issue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showFeedbackForm && (
                <div className="mt-4 bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">What's wrong with this question?</p>
                  {currentUser && (
                    <p className="text-xs text-[#6C5CE7] mb-2">Submitting as {currentUser}</p>
                  )}
                  {!currentUser && (
                    <p className="text-xs text-amber-600 mb-2">Pick your name on the home screen so we know who's reporting</p>
                  )}
                  <div className="relative">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => onFeedbackTextChange(e.target.value)}
                      placeholder={isListening ? "Listening..." : "e.g. My daughter didn't understand what LCM means..."}
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-[#6C5CE7] text-sm resize-none ${isListening ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      rows={3}
                    />
                    {speechSupported && (
                      <button
                        onClick={() => onToggleListening('feedback')}
                        className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
                          isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#6C5CE7]'
                        }`}
                        title={isListening ? "Stop listening" : "Speak your feedback"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => { onToggleFeedbackForm(false); onFeedbackTextChange(''); }}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onSubmitFeedback}
                      disabled={!feedbackText.trim()}
                      className="px-4 py-1.5 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              
              {showTutorChat && (
                <div className="mt-6 bg-[#EDE8FF] border-2 border-[#A29BFE]/40 rounded-xl p-4 animate-fade-in-up">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-[#6C5CE7] mr-2" />
                    <h4 className="font-heading font-bold text-slate-800">AI Tutor Chat</h4>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          msg.role === 'user'
                            ? 'bg-[#6C5CE7] text-white'
                            : 'bg-[#FAFBFF] text-slate-800 border border-[#EDE8FF]'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="text-left mb-3">
                        <div className="inline-block p-3 rounded-lg bg-[#FAFBFF] border border-[#EDE8FF]">
                          <div className="thinking-dots">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => onUserMessageChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                      placeholder={isListening ? "Listening..." : "Ask your question here..."}
                      disabled={isAiThinking}
                      className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-[#6C5CE7] disabled:bg-gray-100 ${isListening ? 'border-red-400 bg-red-50' : 'border-[#A29BFE]/30'}`}
                    />
                    {speechSupported && (
                      <button
                        onClick={() => onToggleListening('chat')}
                        disabled={isAiThinking}
                        className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                          isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#6C5CE7]'
                        }`}
                        title={isListening ? "Stop listening" : "Speak your question"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={onSendMessage}
                      disabled={!userMessage.trim() || isAiThinking}
                      className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {showFeedback && (
              <button
                onClick={onNextQuestion}
                className="w-full py-4 btn-primary text-lg flex items-center justify-center"
                style={{ touchAction: 'manipulation' }}
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : isTestingMode ? 'Finish Testing' : returnToSpeedReview ? 'Back to Speed Review' : 'See Results'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      {isTestingMode && (
        <FlagModal
          isOpen={showFlagModal}
          onClose={() => setShowFlagModal(false)}
          onSubmit={(flagData) => {
            if (onFlagQuestion) onFlagQuestion(flagData);
          }}
          categories={['Wrong answer', 'Bad diagram', 'Confusing wording', 'Explanation wrong', 'Typo/spelling', 'Other']}
          context={{
            questionId: currentQuestion.id,
            topicKey: currentQ.topicKey,
            topicName: currentQ.topicName,
            subject: selectedTopic,
            difficulty: currentQuestion.difficulty || 2,
            hasVisual: !!currentQuestion.visual,
          }}
        />
      )}
      </div>
    );
}

export default QuizScreen;

import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, XCircle, ChevronDown, ChevronRight, Target, Sparkles, CheckCircle2, X, RotateCcw, BookOpen } from 'lucide-react';
import { topicNames } from '../components/RecommendationCard';

const subjectColours = { maths: '#0984E3', english: '#00B894', verbalreasoning: '#6C5CE7' };
const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'VR' };

function MistakesScreen({ questionResults, questionData, englishData, vrData, onPractiseTopic, onRecordResult, onBack }) {
  const [expandedTopic, setExpandedTopic] = useState(null);
  // Practice mode state
  const [practiceMode, setPracticeMode] = useState(null); // { topicKey, subject, questions }
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceResults, setPracticeResults] = useState([]); // { questionId, correct }
  const [selectedPair, setSelectedPair] = useState([]); // for select-two / pick-from-sets

  // Build a lookup map for all questions across all subjects
  const questionLookup = useMemo(() => {
    const lookup = {};
    const addQuestions = (data, subject) => {
      if (!data) return;
      const topics = data.topics || data;
      Object.entries(topics).forEach(([topicKey, topic]) => {
        const questions = topic.questions || (Array.isArray(topic) ? topic : []);
        questions.forEach(q => {
          lookup[`${topicKey}-${q.id}`] = { ...q, _topicKey: topicKey, _subject: subject };
        });
      });
    };
    if (questionData) {
      Object.entries(questionData).forEach(([subject, subjectData]) => {
        if (subjectData && subjectData.topics) {
          addQuestions(subjectData, subject);
        }
      });
    }
    if (englishData && englishData.topics) addQuestions(englishData, 'english');
    if (vrData && vrData.topics) addQuestions(vrData, 'verbalreasoning');
    return lookup;
  }, [questionData, englishData, vrData]);

  // Get mistakes, excluding any where the same question was later answered correctly
  const groupedMistakes = useMemo(() => {
    if (!questionResults) return {};

    // Build a map of the most recent result per question
    const latestByQuestion = {};
    questionResults.forEach(r => {
      const key = `${r.topicKey}-${r.questionId}`;
      const existing = latestByQuestion[key];
      if (!existing || new Date(r.date) > new Date(existing.date)) {
        latestByQuestion[key] = r;
      }
    });

    // Only include questions where the most recent attempt was wrong
    const mistakes = Object.values(latestByQuestion)
      .filter(r => !r.correct)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const groups = {};
    mistakes.forEach(result => {
      const key = result.topicKey;
      if (!groups[key]) {
        groups[key] = {
          topicKey: key,
          subject: result.subject,
          mistakes: [],
        };
      }
      const question = questionLookup[`${key}-${result.questionId}`];
      if (question) {
        groups[key].mistakes.push({
          ...result,
          questionText: question.question,
          explanation: question.explanation,
          options: question.options,
          correctAnswer: question.correct,
          correctPair: question.correctPair,
          setA: question.setA,
          setB: question.setB,
          questionType: question.questionType,
          fullQuestion: question,
        });
      } else {
        // Question no longer in bank (removed/migrated) — keep visible with fallback
        groups[key].mistakes.push({
          ...result,
          questionText: `Question #${result.questionId} (no longer available)`,
          explanation: null,
          options: null,
          correctAnswer: null,
          questionType: 'missing',
          fullQuestion: null,
        });
      }
    });

    // Sort groups by most recent mistake
    return Object.fromEntries(
      Object.entries(groups).sort((a, b) => {
        const aDate = new Date(a[1].mistakes[0]?.date || 0);
        const bDate = new Date(b[1].mistakes[0]?.date || 0);
        return bDate - aDate;
      })
    );
  }, [questionResults, questionLookup]);

  const topicEntries = Object.entries(groupedMistakes);
  const totalMistakes = topicEntries.reduce((sum, [, g]) => sum + g.mistakes.length, 0);

  // Start practice mode for a topic
  const startPractice = useCallback((topicKey, subject, mistakes) => {
    // Filter out questions no longer in the bank
    const practiceable = mistakes.filter(m => m.questionType !== 'missing');
    if (practiceable.length === 0) return;
    setPracticeMode({ topicKey, subject, questions: practiceable });
    setPracticeIndex(0);
    setSelectedAnswer(null);
    setSelectedPair([]);
    setShowFeedback(false);
    setPracticeResults([]);
  }, []);

  // Record a practice result and persist it
  const recordResult = useCallback((currentMistake, isCorrect) => {
    setPracticeResults(prev => [...prev, { questionId: currentMistake.questionId, correct: isCorrect }]);
    if (onRecordResult) {
      onRecordResult({
        id: Date.now(),
        date: new Date().toISOString(),
        questionId: currentMistake.questionId,
        topicKey: currentMistake.topicKey || practiceMode.topicKey,
        subject: currentMistake.subject || practiceMode.subject,
        difficulty: currentMistake.difficulty || 2,
        correct: isCorrect,
        timeSpentMs: 0,
        mode: 'mistakes',
        sessionId: Date.now(),
      });
    }
  }, [onRecordResult, practiceMode]);

  // Handle standard MCQ answer (tap to answer)
  const handleAnswer = useCallback((optionIndex) => {
    if (showFeedback || !practiceMode) return;
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    const currentMistake = practiceMode.questions[practiceIndex];
    const isCorrect = optionIndex === currentMistake.correctAnswer;
    recordResult(currentMistake, isCorrect);
  }, [showFeedback, practiceMode, practiceIndex, recordResult]);

  // Toggle for select-two questions
  const handleSelectTwoToggle = useCallback((idx) => {
    if (showFeedback) return;
    setSelectedPair(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= 2) return prev;
      return [...prev, idx];
    });
  }, [showFeedback]);

  // Pick from set A or B
  const handlePickFromSet = useCallback((setName, idx) => {
    if (showFeedback) return;
    setSelectedPair(prev => {
      const newPair = [...prev];
      if (setName === 'A') newPair[0] = idx;
      else newPair[1] = idx;
      return newPair;
    });
  }, [showFeedback]);

  // Check answer for select-two / pick-from-sets (requires explicit submit)
  const handleCheckPairAnswer = useCallback(() => {
    if (showFeedback || !practiceMode) return;
    const currentMistake = practiceMode.questions[practiceIndex];
    const cp = currentMistake.correctPair;
    let isCorrect = false;
    if (currentMistake.questionType === 'select-two') {
      if (selectedPair.length !== 2) return;
      isCorrect = (selectedPair[0] === cp[0] && selectedPair[1] === cp[1]) ||
                  (selectedPair[0] === cp[1] && selectedPair[1] === cp[0]);
    } else if (currentMistake.questionType === 'pick-from-sets') {
      if (selectedPair[0] === undefined || selectedPair[1] === undefined) return;
      isCorrect = selectedPair[0] === cp[0] && selectedPair[1] === cp[1];
    }
    setShowFeedback(true);
    recordResult(currentMistake, isCorrect);
  }, [showFeedback, practiceMode, practiceIndex, selectedPair, recordResult]);

  // Move to next question or finish
  const handleNext = useCallback(() => {
    if (practiceIndex + 1 < practiceMode.questions.length) {
      setPracticeIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setSelectedPair([]);
      setShowFeedback(false);
    } else {
      setPracticeMode(null);
    }
  }, [practiceIndex, practiceMode]);

  // Practice mode UI
  if (practiceMode) {
    const current = practiceMode.questions[practiceIndex];
    const currentSubject = current ? (current.subject || practiceMode.subject) : practiceMode.subject;
    const currentTopicKey = current ? (current.topicKey || practiceMode.topicKey) : practiceMode.topicKey;
    const colour = subjectColours[currentSubject] || '#6C5CE7';
    const displayName = practiceMode.topicKey === 'all' ? 'All Mistakes' : (topicNames[currentTopicKey] || currentTopicKey);
    const isLastQuestion = practiceIndex + 1 >= practiceMode.questions.length;
    const correctCount = practiceResults.filter(r => r.correct).length;

    // Summary screen after finishing all questions
    if (!current) {
      const wrongCount = practiceResults.length - correctCount;
      return (
        <div className="app-bg p-4 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="card-elevated p-8 text-center animate-fade-in-up">
              <CheckCircle2 className="w-12 h-12 text-[#00B894] mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-2">Practice Complete!</h2>
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#00B894]">{correctCount}</p>
                  <p className="text-sm text-[#636E72]">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF6B6B]">{wrongCount}</p>
                  <p className="text-sm text-[#636E72]">Still to learn</p>
                </div>
              </div>
              {correctCount > 0 && (
                <p className="text-sm text-[#636E72] mb-4">
                  {correctCount} question{correctCount !== 1 ? 's' : ''} removed from your mistakes!
                </p>
              )}
              <button
                onClick={() => setPracticeMode(null)}
                className="px-6 py-3 bg-[#6C5CE7] text-white font-bold rounded-xl hover:bg-[#5A4BD1] transition-colors"
              >
                Back to Mistakes
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="app-bg p-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setPracticeMode(null)}
              className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
            >
              <X className="w-5 h-5" />
              Exit
            </button>
            <div className="text-sm font-medium text-[#636E72]">
              {practiceIndex + 1} / {practiceMode.questions.length}
            </div>
            <div className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${colour}15`, color: colour }}>
              {displayName}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${((practiceIndex + (showFeedback ? 1 : 0)) / practiceMode.questions.length) * 100}%`, background: colour }}
            />
          </div>

          {/* Passage text for comprehension questions */}
          {current.questionType === 'passage' && current.fullQuestion?.passage && (
            <div className="mb-4 relative animate-fade-in-up">
              <div className="bg-[#FFF8E8] border-2 border-[#FDCB6E]/40 rounded-xl p-4 max-h-64 overflow-y-auto"
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
                  <span className="text-sm font-heading font-bold text-[#2D3436]">{current.fullQuestion.passageTitle}</span>
                </div>
                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                  {current.fullQuestion.passage}
                </div>
              </div>
              <div className="scroll-hint absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FFF8E8] to-transparent rounded-b-xl pointer-events-none flex items-end justify-center pb-1 transition-opacity"
                style={{ opacity: 0 }}>
                <span className="text-[10px] font-bold text-[#F39C12] animate-bounce">▼ Scroll for more</span>
              </div>
            </div>
          )}

          {/* Question */}
          <div className="card-elevated p-6 mb-4 animate-fade-in-up">
            {/* Error-spotting segments */}
            {current.questionType === 'error-spotting' && current.fullQuestion?.segments && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {current.fullQuestion.segments.map((segment, idx) => (
                    <div key={idx} className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 text-center">
                      <span className="block text-xs font-bold text-[#6C5CE7] mb-1">
                        Section {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-gray-900 text-sm font-medium">{segment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alphabet line for letter code questions */}
            {current.questionType === 'letter-codes' && (
              <div className="mb-4 px-2 py-3 bg-gradient-to-r from-[#EDE8FF] to-[#DFF6FF] border border-[#A29BFE]/30 rounded-xl text-center">
                <div className="text-[9px] text-[#6C5CE7] mb-1.5 font-bold uppercase tracking-widest">Use this alphabet to crack the code</div>
                <div className="flex justify-center">
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                    <div key={letter} className="flex flex-col items-center" style={{width: 'calc(100% / 26)'}}>
                      <span className={`text-xs sm:text-sm font-mono font-bold py-0.5 rounded ${i % 5 === 4 ? 'text-[#6C5CE7]' : 'text-[#2D3436]'}`}>{letter}</span>
                      <span className={`text-[7px] sm:text-[8px] font-mono ${i % 5 === 4 ? 'text-[#6C5CE7] font-bold' : 'text-gray-400'}`}>{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-lg font-medium text-[#2D3436] mb-6">{current.questionText}</p>

            {/* Standard MCQ options */}
            {(!current.questionType || current.questionType === 'error-spotting' || current.questionType === 'letter-codes' || current.questionType === 'passage') && current.options && (
              <div className="space-y-3">
                {current.options.map((option, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrectOption = i === current.correctAnswer;
                  let optionStyle = 'border-gray-200 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5';
                  if (showFeedback) {
                    if (isCorrectOption) optionStyle = 'border-[#00B894] bg-[#00B894]/10';
                    else if (isSelected) optionStyle = 'border-[#FF6B6B] bg-[#FF6B6B]/10';
                    else optionStyle = 'border-gray-200 opacity-50';
                  } else if (isSelected) {
                    optionStyle = 'border-[#6C5CE7] bg-[#6C5CE7]/10';
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${optionStyle}`}>
                      <span className="inline-flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-medium text-[#2D3436]">{option}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Select-two: tap 2 options */}
            {current.questionType === 'select-two' && current.options && (
              <div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {current.options.map((option, idx) => (
                    <button key={idx} onClick={() => handleSelectTwoToggle(idx)} disabled={showFeedback}
                      className={`p-4 text-center rounded-xl border-2 transition-all font-medium text-lg ${
                        showFeedback
                          ? current.correctPair.includes(idx)
                            ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                            : selectedPair.includes(idx)
                            ? 'border-red-500 bg-red-50 text-red-900'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : selectedPair.includes(idx)
                          ? 'border-[#6C5CE7] bg-[#EDE8FF] text-[#2D3436] ring-2 ring-[#A29BFE]'
                          : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-[#2D3436]'
                      }`}>
                      {option}
                    </button>
                  ))}
                </div>
                {!showFeedback && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Tap exactly 2 words {selectedPair.length > 0 ? `(${selectedPair.length}/2 selected)` : ''}
                  </p>
                )}
                {!showFeedback && selectedPair.length === 2 && (
                  <button onClick={handleCheckPairAnswer}
                    className="mt-3 w-full py-3 bg-[#6C5CE7] text-white font-bold rounded-xl hover:bg-[#5A4BD1] transition-colors">
                    Check Answer
                  </button>
                )}
              </div>
            )}

            {/* Pick-from-sets: one from A, one from B */}
            {current.questionType === 'pick-from-sets' && current.setA && current.setB && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-[#6C5CE7] mb-2">Group A</p>
                  <div className="grid grid-cols-3 gap-3">
                    {current.setA.map((word, idx) => (
                      <button key={idx} onClick={() => handlePickFromSet('A', idx)} disabled={showFeedback}
                        className={`p-3 text-center rounded-xl border-2 transition-all font-medium ${
                          showFeedback
                            ? idx === current.correctPair[0]
                              ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                              : selectedPair[0] === idx
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                            : selectedPair[0] === idx
                            ? 'border-[#6C5CE7] bg-[#EDE8FF] text-[#2D3436] ring-2 ring-[#A29BFE]'
                            : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-[#2D3436]'
                        }`}>
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-700 mb-2">Group B</p>
                  <div className="grid grid-cols-3 gap-3">
                    {current.setB.map((word, idx) => (
                      <button key={idx} onClick={() => handlePickFromSet('B', idx)} disabled={showFeedback}
                        className={`p-3 text-center rounded-xl border-2 transition-all font-medium ${
                          showFeedback
                            ? idx === current.correctPair[1]
                              ? 'border-green-500 bg-green-50 text-green-900 ring-2 ring-green-400'
                              : selectedPair[1] === idx
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                            : selectedPair[1] === idx
                            ? 'border-[#6C5CE7] bg-[#EDE8FF] text-[#2D3436] ring-2 ring-[#A29BFE]'
                            : 'border-gray-200 bg-white hover:border-[#A29BFE] hover:bg-[#EDE8FF]/50 text-[#2D3436]'
                        }`}>
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
                {!showFeedback && (
                  <p className="text-sm text-gray-500 text-center">Pick one word from each group</p>
                )}
                {!showFeedback && selectedPair[0] !== undefined && selectedPair[1] !== undefined && (
                  <button onClick={handleCheckPairAnswer}
                    className="w-full py-3 bg-[#6C5CE7] text-white font-bold rounded-xl hover:bg-[#5A4BD1] transition-colors">
                    Check Answer
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Feedback */}
          {showFeedback && (() => {
            const lastResult = practiceResults[practiceResults.length - 1];
            const wasCorrect = lastResult?.correct;
            return (
            <div className="card-elevated p-5 mb-4 animate-fade-in-up">
              {wasCorrect ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00B894] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#00B894] mb-1">Correct! Removed from your mistakes.</p>
                    {current.explanation && (
                      <p className="text-sm text-[#636E72]">{current.explanation}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#FF6B6B] mb-1">Not quite — this one stays on your list.</p>
                    {current.questionType === 'select-two' && current.correctPair && current.options && (
                      <p className="text-sm text-[#636E72] mb-1">
                        The correct pair was: {current.options[current.correctPair[0]]} and {current.options[current.correctPair[1]]}
                      </p>
                    )}
                    {current.questionType === 'pick-from-sets' && current.correctPair && current.setA && current.setB && (
                      <p className="text-sm text-[#636E72] mb-1">
                        The correct pair was: {current.setA[current.correctPair[0]]} and {current.setB[current.correctPair[1]]}
                      </p>
                    )}
                    {current.explanation && (
                      <p className="text-sm text-[#636E72]">{current.explanation}</p>
                    )}
                  </div>
                </div>
              )}
              <button
                onClick={handleNext}
                className="mt-4 w-full py-3 bg-[#6C5CE7] text-white font-bold rounded-xl hover:bg-[#5A4BD1] transition-colors"
              >
                {isLastQuestion ? 'See Results' : 'Next Question'}
              </button>
            </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // Normal mistakes list view
  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-6 animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF6B6B]/10 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-[#FF6B6B]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-1">My Mistakes</h2>
          {totalMistakes > 0 ? (
            <p className="text-[#636E72]">
              {totalMistakes} mistake{totalMistakes !== 1 ? 's' : ''} across {topicEntries.length} topic{topicEntries.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-[#636E72]">Review your mistakes to learn from them</p>
          )}
        </div>

        {/* Practice All button */}
        {totalMistakes > 0 && (
          <div className="mb-4 animate-fade-in-up">
            <button
              onClick={() => {
                const allMistakes = topicEntries.flatMap(([topicKey, group]) =>
                  group.mistakes.map(m => ({ ...m, topicKey, subject: group.subject }))
                );
                startPractice('all', 'mixed', allMistakes);
              }}
              className="w-full py-3 bg-[#FF6B6B] text-white font-bold rounded-xl hover:bg-[#E55A5A] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Practice All Mistakes ({totalMistakes})
            </button>
          </div>
        )}

        {topicEntries.length === 0 ? (
          <div className="card-elevated p-8 text-center animate-fade-in-up">
            <Sparkles className="w-10 h-10 text-[#FDCB6E] mx-auto mb-3" />
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">No mistakes to review!</h3>
            <p className="text-[#636E72]">Keep practising — when you get something wrong, it will appear here so you can learn from it.</p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {topicEntries.map(([topicKey, group]) => {
              const isExpanded = expandedTopic === topicKey;
              const colour = subjectColours[group.subject] || '#6C5CE7';
              const displayName = topicNames[topicKey] || topicKey;
              const subjectLabel = subjectNames[group.subject] || group.subject;

              return (
                <div key={topicKey} className="card-elevated overflow-hidden animate-fade-in-up">
                  {/* Topic header */}
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topicKey)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: colour }}>
                        {group.mistakes.length}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-[#2D3436]">{displayName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${colour}15`, color: colour }}>
                            {subjectLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#636E72]">
                          Last mistake: {new Date(group.mistakes[0]?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-[#636E72]" />
                      : <ChevronRight className="w-4 h-4 text-[#636E72]" />
                    }
                  </button>

                  {/* Expanded mistake details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {group.mistakes.slice(0, 10).map((mistake, i) => (
                        <div key={mistake.questionId || i} className="px-5 py-3 border-b border-gray-50 last:border-b-0">
                          <p className="text-sm text-[#2D3436] font-medium mb-1">
                            {(mistake.questionText || '').slice(0, 120)}{(mistake.questionText || '').length > 120 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#636E72]">
                            <span>D{mistake.difficulty || '?'}</span>
                            <span>{new Date(mistake.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      ))}
                      {group.mistakes.length > 10 && (
                        <p className="px-5 py-2 text-xs text-[#636E72] italic">
                          + {group.mistakes.length - 10} more
                        </p>
                      )}
                      {group.mistakes.some(m => m.questionType !== 'missing') && (
                        <div className="px-5 py-3 bg-gray-50">
                          <button
                            onClick={() => startPractice(topicKey, group.subject, group.mistakes)}
                            className="flex items-center gap-2 px-4 py-2 text-white font-bold rounded-lg text-sm transition-colors"
                            style={{ background: colour }}
                          >
                            <Target className="w-4 h-4" />
                            Practice These ({group.mistakes.filter(m => m.questionType !== 'missing').length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MistakesScreen;

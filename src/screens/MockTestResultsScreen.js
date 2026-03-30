import React, { useState } from 'react';
import { Trophy, ThumbsUp, Zap, ArrowLeft, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';

function MockTestResultsScreen({ results, onHome, onTryAgain }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!results) return null;

  const { totalQuestions, totalCorrect, percentage, timeTaken, timeLimit, sectionResults, subject } = results;

  const ResultIcon = percentage >= 80 ? Trophy : percentage >= 60 ? ThumbsUp : Zap;
  const resultGradient = percentage >= 80 ? 'from-[#FDCB6E] to-[#F39C12]' : percentage >= 60 ? 'from-[#6C5CE7] to-[#5A4BD1]' : 'from-[#0984E3] to-[#0652DD]';
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  const minsUsed = Math.floor(timeTaken / 60);
  const secsUsed = timeTaken % 60;
  const minsAllowed = Math.floor(timeLimit / 60);
  const finishedEarly = timeTaken < timeLimit;

  const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };

  // Identify strengths and weaknesses
  const sectionEntries = Object.entries(sectionResults).map(([name, data]) => ({
    name,
    ...data,
    pct: Math.round((data.correct / data.total) * 100),
  }));
  const strengths = sectionEntries.filter(s => s.pct >= 70 && s.total >= 3).sort((a, b) => b.pct - a.pct).slice(0, 5);
  const weaknesses = sectionEntries.filter(s => s.pct < 50 && s.total >= 3).sort((a, b) => a.pct - b.pct).slice(0, 5);

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="card-elevated p-6 md:p-8 text-center mb-6">
          <div className="mb-4 animate-celebrate">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${resultGradient} flex items-center justify-center shadow-lg mb-4`}>
              <ResultIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#2D3436] mb-1">
              Mock Test Complete!
            </h2>
            <p className="text-lg text-[#636E72]">
              {subjectNames[subject] || subject} Paper
            </p>
          </div>

          {/* Score ring */}
          <div className="bg-[#EDE8FF] rounded-xl p-6 mb-6">
            <div className="mx-auto w-32 h-32 relative mb-4">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#DDD6FE" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={percentage >= 80 ? '#FDCB6E' : percentage >= 60 ? '#6C5CE7' : '#0984E3'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="progress-ring-circle"
                  style={{ animation: 'progressRing 1s ease-out forwards' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-heading font-bold text-[#2D3436]">{percentage}%</span>
              </div>
            </div>
            <div className="text-3xl font-heading font-bold text-[#2D3436] mb-1">
              {totalCorrect} / {totalQuestions}
            </div>
            <p className="text-[#636E72]">Questions Correct</p>
            <p className="text-sm text-[#636E72] mt-2">
              Time: {minsUsed}m {secsUsed}s of {minsAllowed} minutes
              {finishedEarly && <span className="text-[#00B894] font-medium"> — finished early!</span>}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          {(strengths.length > 0 || weaknesses.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              {strengths.length > 0 && (
                <div className="bg-[#00B894]/10 border-2 border-[#00B894]/30 rounded-xl p-4">
                  <h3 className="font-heading font-bold text-[#00B894] mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  {strengths.map(s => (
                    <div key={s.name} className="flex justify-between text-sm py-1">
                      <span className="text-[#2D3436]">{s.name}</span>
                      <span className="font-bold text-[#00B894]">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
              {weaknesses.length > 0 && (
                <div className="bg-[#FF6B6B]/10 border-2 border-[#FF6B6B]/30 rounded-xl p-4">
                  <h3 className="font-heading font-bold text-[#FF6B6B] mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Areas to Improve
                  </h3>
                  {weaknesses.map(s => (
                    <div key={s.name} className="flex justify-between text-sm py-1">
                      <span className="text-[#2D3436]">{s.name}</span>
                      <span className="font-bold text-[#FF6B6B]">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section-by-section breakdown */}
        <div className="card-elevated p-6 mb-6">
          <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-4">Section Breakdown</h3>
          <div className="space-y-3">
            {sectionEntries.map(section => {
              const isExpanded = expandedSection === section.name;
              const barColor = section.pct >= 70 ? '#00B894' : section.pct >= 50 ? '#FDCB6E' : '#FF6B6B';

              return (
                <div key={section.name} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.name)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-heading font-bold text-[#2D3436]">{section.name}</span>
                        <span className="text-sm text-[#636E72]">{section.correct}/{section.total}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${section.pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-lg font-bold" style={{ color: barColor }}>{section.pct}%</span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {section.questions.map((item, i) => (
                        <div key={i} className={`p-3 rounded-lg text-sm ${item.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="flex items-start gap-2">
                            {item.isCorrect
                              ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            }
                            <div className="flex-1">
                              <p className="text-[#2D3436] font-medium">{item.question.question.question?.substring(0, 100) || item.question.question.substring?.(0, 100) || 'Question'}{(item.question.question.question || item.question.question || '').length > 100 ? '...' : ''}</p>
                              {!item.isCorrect && item.question.question.explanation && (
                                <p className="text-gray-600 text-xs mt-1">{item.question.question.explanation}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Analysis */}
        {results.questionTimes && Object.keys(results.questionTimes).length > 0 && (() => {
          const times = Object.values(results.questionTimes).filter(t => t > 0);
          if (times.length === 0) return null;
          const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000);
          const slowQuestions = Object.entries(results.questionTimes)
            .filter(([, t]) => t > avgTime * 2 * 1000)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          return (
            <div className="card-elevated p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="text-xl font-heading font-bold text-[#2D3436]">Time Analysis</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-[#2D3436]">{avgTime}s</p>
                  <p className="text-xs text-[#636E72]">Avg per question</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-[#2D3436]">{Math.round(Math.min(...times) / 1000)}s</p>
                  <p className="text-xs text-[#636E72]">Fastest</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-[#2D3436]">{Math.round(Math.max(...times) / 1000)}s</p>
                  <p className="text-xs text-[#636E72]">Slowest</p>
                </div>
              </div>
              {slowQuestions.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-amber-600 mb-2">Slow questions (over {avgTime * 2}s):</p>
                  <div className="space-y-1">
                    {slowQuestions.map(([idx, timeMs]) => (
                      <div key={idx} className="flex items-center justify-between text-sm px-3 py-2 bg-amber-50 rounded-lg">
                        <span className="text-[#2D3436]">Question {parseInt(idx) + 1}</span>
                        <span className="font-bold text-amber-600">{Math.round(timeMs / 1000)}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={onTryAgain}
            className="flex-1 py-4 btn-primary flex items-center justify-center"
          >
            Take Another Test
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-4 bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#2D3436] font-heading font-bold rounded-xl transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockTestResultsScreen;

import React, { useMemo, useEffect, useRef } from 'react';
import { Home, RotateCcw, Trophy, ThumbsUp, Zap, ArrowLeft } from 'lucide-react';
import ResultsInsightCard from '../components/ResultsInsightCard';
import { selectResultsInsightTip } from '../utils/tipSelection';

function ResultsScreen({ answers, quizMode, quizQuestions, allTips, seenTips, onMarkTipSeen, onRetry, onChooseTopic, onHome }) {
  const correctCount = answers.filter(a => a.correct).length;
  const totalCount = answers.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (percentage / 100) * circumference;
  const ResultIcon = percentage >= 80 ? Trophy : percentage >= 60 ? ThumbsUp : Zap;
  const resultGradient = percentage >= 80 ? 'from-[#FDCB6E] to-[#F39C12]' : percentage >= 60 ? 'from-[#6C5CE7] to-[#5A4BD1]' : 'from-[#0984E3] to-[#0652DD]';

  // Select a contextual tip based on performance band
  const insightTip = useMemo(() => {
    if (!allTips || !quizQuestions) return null;
    return selectResultsInsightTip({ percentage, answers, quizQuestions, allTips, seenTips: seenTips || [] });
  }, [percentage, answers, quizQuestions, allTips, seenTips]);

  // Mark insight tip as seen when it renders
  const markedRef = useRef(false);
  useEffect(() => {
    if (insightTip && onMarkTipSeen && !markedRef.current) {
      markedRef.current = true;
      onMarkTipSeen(insightTip.id);
    }
  }, [insightTip, onMarkTipSeen]);

  return (
    <div className="app-bg p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card-elevated p-6 md:p-8 text-center">
          <div className="mb-6 animate-celebrate">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${resultGradient} flex items-center justify-center shadow-lg mb-4`}>
              <ResultIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#2D3436] mb-2">
              Quiz Complete!
            </h2>
            <p className="text-xl text-[#636E72]">
              {percentage >= 80
                ? 'Amazing work! You\'re a star!'
                : percentage >= 60
                ? 'Great effort! Keep practising!'
                : 'Good try! Practice makes perfect!'}
            </p>
          </div>

          <div className="bg-[#EDE8FF] rounded-xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Animated progress ring */}
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
                <span className="text-3xl font-heading font-bold text-[#2D3436] animate-count-up" style={{ animationDelay: '400ms' }}>{percentage}%</span>
              </div>
            </div>
            <div className="text-4xl font-heading font-bold text-[#2D3436] mb-1 animate-count-up" style={{ animationDelay: '600ms' }}>
              {correctCount} / {totalCount}
            </div>
            <p className="text-lg text-[#636E72] font-medium">Questions Correct</p>
          </div>

          <ResultsInsightCard tip={insightTip} />

          <div className="flex flex-col sm:flex-row gap-4 stagger-children">
            <button
              onClick={onRetry}
              className="flex-1 py-4 btn-primary flex items-center justify-center animate-fade-in-up"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {quizMode === 'daily' ? 'New Daily Quiz' : 'Try Again'}
            </button>
            <button
              onClick={onChooseTopic}
              className="flex-1 py-4 bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#2D3436] font-heading font-bold rounded-xl transition-colors flex items-center justify-center animate-fade-in-up"
            >
              <Home className="w-5 h-5 mr-2" />
              {quizMode === 'daily' ? 'Learning Modes' : 'Choose Topic'}
            </button>
          </div>

          <button
            onClick={onHome}
            className="mt-4 w-full py-3 text-[#6C5CE7] hover:text-[#5A4BD1] font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;

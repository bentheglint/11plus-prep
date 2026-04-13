import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Home, RotateCcw, Trophy, ThumbsUp, Zap, ArrowLeft, Clock } from 'lucide-react';
import { motion } from '../components/Motion';
import { animate as motionAnimate } from 'motion';
import ResultsInsightCard from '../components/ResultsInsightCard';
import { selectResultsInsightTip } from '../utils/tipSelection';
import { celebrateHighScore } from '../utils/confetti';

function ResultsScreen({ answers, quizMode, quizQuestions, allTips, seenTips, onMarkTipSeen, onRetry, onChooseTopic, onHome }) {
  const correctCount = answers.filter(a => a.correct).length;
  const totalCount = answers.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  // Total time from per-question measurements (excludes feedback reading time)
  const totalTimeMs = answers.reduce((sum, a) => sum + (a.timeSpentMs || 0), 0);
  const totalMinutes = Math.floor(totalTimeMs / 60000);
  const totalSeconds = Math.floor((totalTimeMs % 60000) / 1000);
  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (percentage / 100) * circumference;
  const ResultIcon = percentage >= 80 ? Trophy : percentage >= 60 ? ThumbsUp : Zap;
  const resultGradient = percentage >= 80 ? 'from-[#FDCB6E] to-[#F39C12]' : percentage >= 60 ? 'from-[#6C5CE7] to-[#5A4BD1]' : 'from-[#0770C2] to-[#0652DD]';

  // Select a contextual tip based on performance band
  const insightTip = useMemo(() => {
    if (!allTips || !quizQuestions) return null;
    return selectResultsInsightTip({ percentage, answers, quizQuestions, allTips, seenTips: seenTips || [] });
  }, [percentage, answers, quizQuestions, allTips, seenTips]);

  // Animated score counter
  const [displayPct, setDisplayPct] = useState(0);
  const scoreAnimated = useRef(false);
  useEffect(() => {
    if (scoreAnimated.current) return;
    scoreAnimated.current = true;
    const controls = motionAnimate(0, percentage, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayPct(Math.round(v)),
    });
    // High score confetti
    if (percentage >= 80) {
      setTimeout(celebrateHighScore, 600);
    }
    return () => controls.stop();
  }, [percentage]);

  // Mark insight tip as seen when it renders
  const markedRef = useRef(false);
  useEffect(() => {
    if (insightTip && onMarkTipSeen && !markedRef.current) {
      markedRef.current = true;
      onMarkTipSeen(insightTip.id);
    }
  }, [insightTip, onMarkTipSeen]);

  const ringColour = percentage >= 80 ? '#FDCB6E' : percentage >= 60 ? '#6C5CE7' : '#0770C2';

  return (
    <div className="app-bg p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onHome}
          className="mb-4 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <div className="card-elevated p-6 md:p-8 text-center">
          {/* Hero icon + message */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${resultGradient} flex items-center justify-center shadow-lg mb-4`}>
              <ResultIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-xl text-slate-500">
              {percentage >= 80
                ? 'Amazing work! You\'re a star!'
                : percentage >= 60
                ? 'Great effort! Keep practising!'
                : 'Good try! Practice makes perfect!'}
            </p>
          </motion.div>

          {/* Score ring */}
          <motion.div
            className="bg-[#EDE8FF] rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          >
            <div className="mx-auto w-32 h-32 relative mb-4">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#DDD6FE" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={ringColour}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeOffset }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-heading font-bold text-slate-800">{displayPct}%</span>
              </div>
            </div>
            <motion.div
              className="text-4xl font-heading font-bold text-slate-800 mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              {correctCount} / {totalCount}
            </motion.div>
            <p className="text-lg text-slate-500 font-medium">Questions Correct</p>
            {totalTimeMs > 0 && (
              <motion.div
                className="mt-3 pt-3 border-t border-[#DDD6FE] flex items-center justify-center gap-2 text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">
                  {totalMinutes > 0 ? `${totalMinutes}m ${String(totalSeconds).padStart(2, '0')}s` : `${totalSeconds}s`}
                </span>
                <span className="text-sm">total time</span>
              </motion.div>
            )}
          </motion.div>

          <ResultsInsightCard tip={insightTip} />

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            <motion.button
              onClick={onRetry}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex-1 py-4 btn-primary flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {quizMode === 'daily' ? 'New Daily Quiz' : quizMode === 'challenge' ? 'New Challenge' : 'Try Again'}
            </motion.button>
            <motion.button
              onClick={onChooseTopic}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex-1 py-4 bg-[#EDE8FF] hover:bg-[#DDD6FE] text-slate-800 font-heading font-bold rounded-xl transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              {quizMode === 'daily' ? 'Learning Modes' : 'Choose Topic'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;

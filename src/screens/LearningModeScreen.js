import React, { useMemo } from 'react';
import { Calendar, Target, ArrowLeft, Clock, Lightbulb, Flame, Lock } from 'lucide-react';
import { motion } from '../components/Motion';
import { SUBJECT_TOPICS } from '../hooks/useMastery';
import { canUseFeature } from '../utils/entitlementGating';

const mockTestInfo = {
  maths: { questions: 50, time: 50 },
  english: { questions: 49, time: 50 },
  verbalreasoning: { questions: 85, time: 50 },
};

// A gated mode card — same footprint as an unlocked card, but locked with
// an "Upgrade to unlock" call to action instead of the normal action.
function LockedModeCard({ title, description, onUpgrade }) {
  return (
    <div className="card rounded-2xl p-8 text-left flex flex-col border-2 border-gray-200">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-heading font-bold text-gray-400 mb-2">{title}</h3>
      <p className="text-gray-400 flex-1 mb-4">{description}</p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onUpgrade}
        className="self-start text-sm font-bold text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 rounded-full px-4 py-2 transition-colors"
      >
        Upgrade to unlock
      </motion.button>
    </div>
  );
}

function LearningModeScreen({ subjectName, subjectKey, mastery, onStartDaily, onFocusedLearning, onMockTest, onChallengeMode, onStudyToolkit, onBack, entitlement, freeTierActive, onUpgrade }) {
  const testInfo = mockTestInfo[subjectKey] || { questions: 50, time: 50 };

  // Paid-tier gates — only meaningful when the freeTier flag is on. Off
  // (default), every gate below evaluates to "unlocked" so behaviour is
  // pixel-identical to before this feature existed.
  const focusedLearningLocked = !!freeTierActive && !canUseFeature(entitlement, 'focusedLearning');
  const mockTestLocked = !!freeTierActive && !canUseFeature(entitlement, 'mockTests');
  const challengePaidLocked = !!freeTierActive && !canUseFeature(entitlement, 'challenge');

  // Challenge mode: unlock when 3+ topics reach exam-ready or excelling
  const challengeStatus = useMemo(() => {
    if (!mastery) return { unlocked: false, readyCount: 0, total: 0 };
    const topics = SUBJECT_TOPICS[subjectKey] || [];
    const readyCount = topics.filter(t => {
      const m = mastery.getTopicMastery(t);
      return m.band === 'exam-ready' || m.band === 'excelling';
    }).length;
    return { unlocked: readyCount >= 3, readyCount, total: topics.length };
  }, [mastery, subjectKey]);

  // The paid lock takes precedence over the mastery lock in messaging: a
  // free-tier user shouldn't be told "get 2 more topics to Exam Ready" for
  // a mode they can't reach at all without upgrading first.
  const challengeUnlocked = !challengePaidLocked && challengeStatus.unlocked;

  return (
    <div className="app-bg p-4">
      <div className="max-w-3xl mx-auto">
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={onBack}
          className="mb-6 flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-1 sm:gap-2 min-h-[44px] px-1"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">Back to Home</span>
        </motion.button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">
            {subjectName || 'Subject'}
          </h2>
          <p className="text-slate-500">Choose how you'd like to practise</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onStartDaily(subjectKey)}
            className="card rounded-2xl p-8 text-left flex flex-col border-2 border-transparent hover:border-[#3B82F6]/30 "
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#3B82F6]/10 rounded-2xl mb-4">
              <Calendar className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Daily Learning</h3>
            <p className="text-slate-500 flex-1">10 questions from across all topics. A great way to keep your skills sharp!</p>
          </motion.button>

          {focusedLearningLocked ? (
            <LockedModeCard
              title="Focused Learning"
              description="Pick a topic and practise 10 questions to build your confidence."
              onUpgrade={onUpgrade}
            />
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={onFocusedLearning}
              className="card rounded-2xl p-8 text-left flex flex-col border-2 border-transparent hover:border-[#7C3AED]/30 "
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#7C3AED]/10 rounded-2xl mb-4">
                <Target className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Focused Learning</h3>
              <p className="text-slate-500 flex-1">Pick a topic and practise 10 questions to build your confidence.</p>
            </motion.button>
          )}

          {mockTestLocked ? (
            <LockedModeCard
              title="Mock Test"
              description={`Full practice paper — ${testInfo.questions} questions in ${testInfo.time} minutes. Timed, just like the real exam!`}
              onUpgrade={onUpgrade}
            />
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={onMockTest}
              className="card rounded-2xl p-8 text-left flex flex-col border-2 border-transparent hover:border-[#FF6B6B]/30 "
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#FF6B6B]/10 rounded-2xl mb-4">
                <Clock className="w-8 h-8 text-[#FF6B6B]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Mock Test</h3>
              <p className="text-slate-500 flex-1">
                Full practice paper — {testInfo.questions} questions in {testInfo.time} minutes. Timed, just like the real exam!
              </p>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onStudyToolkit}
            className="card rounded-2xl p-8 text-left flex flex-col border-2 border-transparent hover:border-[#FDCB6E]/30 "
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#FDCB6E]/10 rounded-2xl mb-4">
              <Lightbulb className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Study Toolkit</h3>
            <p className="text-slate-500 flex-1">Tips, strategies, and lessons to help you ace the exam!</p>
          </motion.button>
        </div>

        {/* Challenge Mode — full-width banner below the grid */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={challengeUnlocked ? onChallengeMode : (challengePaidLocked ? onUpgrade : undefined)}
            disabled={!challengeUnlocked && !challengePaidLocked}
            className={`w-full card rounded-2xl p-6 text-left flex items-center gap-5 transition-all border-2 ${
              challengeUnlocked || challengePaidLocked
                ? 'hover:scale-[1.01] border-transparent hover:border-[#E17055]/30 cursor-pointer'
                : 'opacity-60 cursor-not-allowed border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0 ${
              challengeUnlocked
                ? 'bg-gradient-to-br from-[#FF6B6B] to-[#E17055]'
                : 'bg-gray-200'
            }`}>
              {challengeUnlocked
                ? <Flame className="w-7 h-7 text-white" />
                : <Lock className="w-6 h-6 text-gray-400" />
              }
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-heading font-bold mb-1 ${challengeUnlocked ? 'text-slate-800' : 'text-gray-400'}`}>
                Challenge Mode
              </h3>
              {challengeUnlocked ? (
                <p className="text-sm text-slate-500">
                  10 hard questions across your strongest topics. Can you handle it?
                </p>
              ) : challengePaidLocked ? (
                <p className="text-sm text-gray-400">
                  A premium feature. Upgrade to take on your strongest topics at their hardest.
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Get {3 - challengeStatus.readyCount} more topic{3 - challengeStatus.readyCount !== 1 ? 's' : ''} to Exam Ready to unlock
                </p>
              )}
            </div>
            {challengeUnlocked && (
              <div className="text-xs font-bold text-[#E17055] bg-[#E17055]/10 px-3 py-1.5 rounded-full flex-shrink-0">
                D3 Only
              </div>
            )}
            {challengePaidLocked && (
              <div className="text-xs font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-3 py-1.5 rounded-full flex-shrink-0">
                Upgrade to unlock
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default LearningModeScreen;

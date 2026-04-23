import React from 'react';
import { BookOpen, Calculator, Brain, BarChart3, AlertCircle, Wrench, ClipboardCheck, ChevronRight } from 'lucide-react';
import { motion } from '../components/Motion';
import AccountMenu from '../components/AccountMenu';
import StreakDisplay from '../components/StreakDisplay';
import RecommendationCard from '../components/RecommendationCard';

function HomeScreen({ currentUser, onSetCurrentUser, onSubjectSelect, onViewProgress, onViewMistakes, onSpeedReview, onTestingMode, onStartTopic, mastery, streaksAndPP }) {
  // Get suggested topics — exactly one per subject (Maths, English, VR)
  const suggestions = (() => {
    if (!mastery) return [];
    const all = mastery.getFocusAreas();
    const result = [];
    const seenSubjects = new Set();
    for (const rec of all) {
      if (!seenSubjects.has(rec.subject)) {
        result.push(rec);
        seenSubjects.add(rec.subject);
      }
      if (result.length >= 3) break;
    }
    return result;
  })();

  // Subject mastery scores
  const mathsMastery = mastery?.getSubjectMastery?.('maths')?.score || 0;
  const englishMastery = mastery?.getSubjectMastery?.('english')?.score || 0;
  const vrMastery = mastery?.getSubjectMastery?.('verbalreasoning')?.score || 0;

  const subjects = [
    { key: 'maths', title: 'Maths', icon: Calculator, gradient: 'from-[#3B82F6] to-[#2563EB]', mastery: mathsMastery },
    { key: 'english', title: 'English', icon: BookOpen, gradient: 'from-[#22C55E] to-[#16A34A]', mastery: englishMastery },
    { key: 'verbalreasoning', title: 'Verbal Reasoning', icon: Brain, gradient: 'from-[#7C3AED] to-[#5A4BD1]', mastery: vrMastery },
  ];

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          {streaksAndPP ? (
            <StreakDisplay
              currentStreak={streaksAndPP.currentStreak}
              longestStreak={streaksAndPP.longestStreak}
              isActive={streaksAndPP.isStreakActive()}
              practiceDays={streaksAndPP.getPracticeDays(56)}
            />
          ) : <div />}
          <AccountMenu currentUser={currentUser} />
        </div>

        {/* Greeting */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <h1 className="font-heading text-fluid-xl font-bold text-slate-800">
            {currentUser ? `Hey ${currentUser}!` : 'PrepStep'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">What shall we work on today?</p>
        </motion.div>

        {/* Subject cards — 3-column bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {subjects.map((sub, idx) => (
            <motion.button
              key={sub.key}
              onClick={() => onSubjectSelect(sub.key)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: idx * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${sub.gradient} text-white rounded-2xl p-6 text-left relative overflow-hidden shadow-lg`}
            >
              <sub.icon className="w-8 h-8 mb-3 opacity-90" />
              <h2 className="text-xl font-heading font-bold mb-3">{sub.title}</h2>
              {/* Mastery progress bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sub.mastery}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + idx * 0.1 }}
                />
              </div>
              <p className="text-white/70 text-xs mt-1.5 font-medium">{sub.mastery}% mastery</p>
              {/* Decorative orb */}
              <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </motion.button>
          ))}
        </div>

        {/* Bento row: suggestion + nav buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Suggestion card — spans 2 columns on desktop */}
          <div className="md:col-span-2">
            {suggestions.length > 0 ? (
              <RecommendationCard
                recommendation={suggestions[0]}
                onStart={onStartTopic}
              />
            ) : (
              <motion.div
                className="card p-5 h-full flex items-center gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="font-heading font-bold text-slate-800">Ready to practise?</p>
                  <p className="text-sm text-slate-500">Pick a subject above to get started</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick nav — stacked in 1 column */}
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={onViewProgress}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 px-4 py-3 card hover:bg-[#EDE8FF]/30 rounded-xl transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-[#7C3AED]" />
              <span className="font-heading font-bold text-slate-800 text-sm">My Progress</span>
            </motion.button>
            {onViewMistakes && (
              <motion.button
                onClick={onViewMistakes}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-3 px-4 py-3 card hover:bg-[#FF6B6B]/5 rounded-xl transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-[#FF6B6B]" />
                <span className="font-heading font-bold text-slate-800 text-sm">My Mistakes</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Additional suggestions (2nd and 3rd) */}
        {suggestions.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {suggestions.slice(1).map(rec => (
              <RecommendationCard
                key={rec.topicKey}
                recommendation={rec}
                onStart={onStartTopic}
              />
            ))}
          </div>
        )}

        {/* Dev/admin tools — only for specific users */}
        {(currentUser === 'Ben' || currentUser === 'Lauren' || currentUser === 'Daisy' || currentUser === 'Jacqui') && (
          <div className="flex gap-3 mt-2">
            <button
              onClick={onSpeedReview}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Speed Review
            </button>
            {(currentUser === 'Ben' || currentUser === 'Jacqui') && (
              <button
                onClick={onTestingMode}
                className="flex items-center gap-2 px-4 py-2 text-sm text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" />
                Testing Mode
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;

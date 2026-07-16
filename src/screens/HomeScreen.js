import React, { useState } from 'react';
import { BookOpen, Calculator, Brain, BarChart3, AlertCircle, Wrench, ClipboardCheck, ChevronRight, ChevronDown, Users, Lock } from 'lucide-react';
import { motion } from '../components/Motion';
import AccountMenu from '../components/AccountMenu';
import StreakDisplay from '../components/StreakDisplay';
import RecommendationCard from '../components/RecommendationCard';
import TodaysPracticeCard from '../components/TodaysPracticeCard';
import AssignmentBanner from '../components/AssignmentBanner';
import { BookOpen as LessonsIcon } from 'lucide-react';
import { isSpeedReviewAllowlisted, isTestingModeAllowlisted } from '../utils/tutorAllowlist';
import OfflineDataBanner from '../components/OfflineDataBanner';
import { trialBanner, canUseFeature } from '../utils/entitlementGating';

function HomeScreen({ currentUser, userEmail, onSetCurrentUser, onSubjectSelect, onViewProgress, onViewMistakes, onViewMyLessons, onSpeedReview, onTestingMode, onStartTopic, mastery, streaksAndPP, childrenList = [], activeChildId, onSwitchChild, onManageChildren, onTutorSignup, onAdmin, onTutorCodeResolved, getToken, onStartAssignment, loadState, onRetry, entitlement, freeTierActive, onUpgrade }) {
  const [showPicker, setShowPicker] = useState(false);
  const hasMultipleChildren = childrenList.length > 1;
  const activeChild = childrenList.find(c => c.id === activeChildId);
  // Get suggested topics — exactly one per subject (Maths, English, VR).
  // getFocusAreas sorts by priority and slices to 3, so two subjects with
  // multiple high-priority declining topics can crowd out the third subject.
  // Fill any gap by calling getRecommendedNext directly for missing subjects.
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
    // Fill any missing subject
    for (const subject of ['maths', 'english', 'verbalreasoning']) {
      if (!seenSubjects.has(subject)) {
        const rec = mastery.getRecommendedNext(subject);
        if (rec) result.push(rec);
      }
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

  // Trial countdown — only meaningful while the freeTier flag is on, and
  // trialBanner() itself only ever says "show" for a genuine running trial
  // with days actually left (never comped/paid/free, never "0 days left").
  const trialBannerState = trialBanner(entitlement);
  const showTrialBanner = !!freeTierActive && trialBannerState.show;

  // Paid-tier gates — only meaningful when the freeTier flag is on. Off
  // (default), both evaluate to "unlocked" so behaviour is pixel-identical
  // to before this feature existed. "What to practise next" is a deep-
  // progress insight (basic-vs-deep line, freemium phase 0), so it's gated
  // on the same entitlement as ParentDashboard's deep analytics lock.
  // Study Toolkit reuses the focusedLearning gate — the micro-lessons in
  // it are also the pre-quiz lessons for Focused Learning, which is
  // already locked, so the two stay in step deliberately.
  const deepProgressLocked = !!freeTierActive && !canUseFeature(entitlement, 'deepProgress');
  const studyToolkitLocked = !!freeTierActive && !canUseFeature(entitlement, 'focusedLearning');

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <img src="/logo.svg" alt="PrepStep" className="h-8 md:h-10 shrink-0" />
            {streaksAndPP && (
              <StreakDisplay
                currentStreak={streaksAndPP.currentStreak}
                longestStreak={streaksAndPP.longestStreak}
                isActive={streaksAndPP.isStreakActive()}
                practiceDays={streaksAndPP.getPracticeDays(56)}
              />
            )}
          </div>
          {/* Child picker — only shown when account has more than one child */}
          {hasMultipleChildren && (
            <div className="relative">
              <button
                onClick={() => setShowPicker(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F7FF] border border-[#A29BFE] text-[#7C3AED] text-sm font-bold hover:bg-[#EDE9FE] transition-colors"
              >
                <Users className="w-4 h-4" />
                {activeChild?.display_name || currentUser}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
                  <div className="absolute right-0 top-10 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-48 overflow-hidden">
                    {childrenList.map(child => (
                      <button
                        key={child.id}
                        onClick={() => { onSwitchChild(child.id); setShowPicker(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-[#F8F7FF] transition-colors ${child.id === activeChildId ? 'font-bold text-[#7C3AED]' : 'text-slate-800'}`}
                      >
                        {child.display_name}
                        {child.id === activeChildId && <span className="ml-auto text-[#7C3AED]">✓</span>}
                      </button>
                    ))}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => { onManageChildren(); setShowPicker(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#F8F7FF] transition-colors"
                      >
                        Manage children
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <AccountMenu currentUser={currentUser} onManageChildren={onManageChildren} onTutorSignup={onTutorSignup} onAdmin={onAdmin} onTutorCodeResolved={onTutorCodeResolved} />
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

        {/* Offline data banner — shown when the load path fell back to cache or failed */}
        <OfflineDataBanner loadState={loadState} onRetry={onRetry} />

        {/* Trial countdown banner — free-tier flag only, and only while a
            genuine trial with days remaining is running. Never shown for
            comped, paid, or already-free accounts. */}
        {showTrialBanner && (
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-[#F8F7FF] border border-[#A29BFE]/40 text-left hover:bg-[#EDE9FE] transition-colors"
          >
            <span className="text-sm text-slate-700">
              <span className="font-bold text-[#7C3AED]">{trialBannerState.daysRemaining} day{trialBannerState.daysRemaining === 1 ? '' : 's'} left</span> in your free trial
            </span>
            <span className="text-xs font-bold text-[#7C3AED] whitespace-nowrap">Upgrade now</span>
          </button>
        )}

        {/* Assignment banner — only shown when a tutor has set an active assignment */}
        {activeChildId && getToken && (
          <AssignmentBanner
            activeChildId={activeChildId}
            getToken={getToken}
            onStart={onStartAssignment || onStartTopic}
          />
        )}

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
            {deepProgressLocked ? (
              <TodaysPracticeCard onStart={() => onStartTopic(undefined, undefined, 'daily')} />
            ) : suggestions.length > 0 ? (
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
            {onViewMyLessons && (
              studyToolkitLocked ? (
                <div className="flex items-center gap-3 px-4 py-3 card border-2 border-gray-200 rounded-xl cursor-default">
                  <LessonsIcon className="w-5 h-5 text-gray-300" />
                  <span className="font-heading font-bold text-gray-400 text-sm flex-1">My Lessons</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-1 shrink-0">
                    <Lock className="w-3 h-3" />
                    Plus
                  </span>
                </div>
              ) : (
                <motion.button
                  onClick={onViewMyLessons}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-3 px-4 py-3 card hover:bg-[#F0FDF4]/60 rounded-xl transition-colors"
                >
                  <LessonsIcon className="w-5 h-5 text-[#16A34A]" />
                  <span className="font-heading font-bold text-slate-800 text-sm">My Lessons</span>
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* Additional suggestions (2nd and 3rd) — deep-progress recommendations,
            so suppressed entirely for a free child alongside the primary card. */}
        {!deepProgressLocked && suggestions.length > 1 && (
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

        {/* Dev/admin tools — gated by EMAIL allowlist only. Never key off
            display name: a child named "Ben"/"Jacqui" must never see these. */}
        {isSpeedReviewAllowlisted(userEmail) && (
          <div className="flex gap-3 mt-2">
            <button
              onClick={onSpeedReview}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Speed Review
            </button>
            {isTestingModeAllowlisted(userEmail) && (
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

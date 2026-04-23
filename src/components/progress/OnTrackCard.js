import React from 'react';
import { CheckCircle, AlertCircle, ArrowUpRight, Clock, Target, TrendingUp, TrendingDown, BookOpen, Flame } from 'lucide-react';

// The "On Track" card — the most important visual on the parent dashboard.
// Answers the one question every parent has: "Is my child on track?"
// Provides personalised, actionable advice like an in-person tutor.

function OnTrackCard({ mastery, streaksAndPP, userData, currentUser }) {
  const firstName = currentUser || 'Your child';

  // Gather signals
  const practiceDays = streaksAndPP.getPracticeDays(14);
  const daysLast2Weeks = practiceDays.length;
  const daysThisWeek = streaksAndPP.getPracticeDays(7).length;
  const currentStreak = streaksAndPP.currentStreak;
  const isStreakActive = streaksAndPP.isStreakActive();

  // Subject readiness
  const subjects = ['maths', 'english', 'verbalreasoning'];
  const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
  const readiness = {};
  const subjectMastery = {};
  subjects.forEach(s => {
    readiness[s] = mastery.getExamReadiness(s);
    subjectMastery[s] = mastery.getSubjectMastery(s);
  });

  // Focus areas
  const focusAreas = mastery.getFocusAreas();

  // Declining topics
  const allMasteryData = mastery.getAllMastery();
  const decliningTopics = Object.entries(allMasteryData)
    .filter(([_, m]) => m.trend?.direction === 'down' && m.totalQuestions > 0)
    .map(([key, m]) => key);

  // Decayed topics (not practised in 14+ days)
  const decayedTopics = Object.entries(allMasteryData)
    .filter(([_, m]) => m.daysSince > 14 && m.totalQuestions > 0)
    .map(([key, m]) => ({ key, daysSince: m.daysSince }));

  // Speed data
  const withTime = (userData.questionResults || []).filter(r => r.timeSpentMs > 0);
  const avgSpeed = withTime.length >= 20
    ? Math.round(withTime.slice(-50).reduce((s, r) => s + r.timeSpentMs, 0) / Math.min(50, withTime.length) / 1000)
    : null;
  const speedSlow = avgSpeed && avgSpeed > 75;

  // Total questions answered
  const totalQuestions = (userData.questionResults || []).length;

  // Weakest subject
  const weakestSubject = subjects.reduce((weakest, s) => {
    if (!weakest || readiness[s].score < readiness[weakest].score) return s;
    return weakest;
  }, null);

  // === Determine status ===
  let status, headline, message, details, icon, bgGradient, borderColour, iconBg;

  const hasEnoughData = totalQuestions >= 10;

  if (!hasEnoughData) {
    // Not enough data yet
    status = 'getting-started';
    icon = BookOpen;
    bgGradient = 'from-[#DFF6FF] to-[#EDE8FF]';
    borderColour = '#7C3AED';
    iconBg = 'bg-[#7C3AED]';
    headline = `Let's get ${firstName} started!`;
    message = `${firstName} has answered ${totalQuestions} question${totalQuestions !== 1 ? 's' : ''} so far. Once they've completed a few quizzes, we'll be able to show you exactly how they're progressing and what to focus on.`;
    details = [
      { icon: Target, text: 'Aim for 4-5 short practice sessions per week' },
      { icon: Clock, text: '15-20 minutes per session is ideal for this age' },
      { icon: Flame, text: 'Building a daily streak helps make practice a habit' },
    ];
  } else if (daysLast2Weeks <= 2) {
    // Action required — not practising enough
    status = 'action-required';
    icon = AlertCircle;
    bgGradient = 'from-[#EDE8FF] to-[#F0E6FF]';
    borderColour = '#7C3AED';
    iconBg = 'bg-[#7C3AED]';
    headline = `${firstName} needs to practise more regularly`;
    const dayText = daysLast2Weeks === 0 ? "hasn't practised in the last 2 weeks" :
      `has only practised ${daysLast2Weeks} day${daysLast2Weeks !== 1 ? 's' : ''} in the last 2 weeks`;
    message = `${firstName} ${dayText}. Knowledge fades quickly without regular revision — ${decayedTopics.length > 0 ? `${decayedTopics.length} topic${decayedTopics.length !== 1 ? 's are' : ' is'} already losing mastery` : 'topics will start losing mastery soon'}. Getting back to 4-5 short sessions per week will make the biggest difference right now.`;
    details = [
      { icon: Flame, text: 'Consistency matters more than long sessions — little and often is key' },
      { icon: Target, text: `Start with ${focusAreas[0] ? focusAreas[0].topicKey.replace(/([A-Z])/g, ' $1').trim() : 'any topic'} — it needs attention most` },
    ];
  } else {
    // Has data and is practising — evaluate quality
    const avgReadiness = Math.round(subjects.reduce((s, sub) => s + readiness[sub].score, 0) / 3);
    const allImproving = decliningTopics.length === 0;
    const goodConsistency = daysLast2Weeks >= 6;
    const greatConsistency = daysLast2Weeks >= 8;

    if (avgReadiness >= 65 && allImproving && goodConsistency) {
      // On track!
      status = 'on-track';
      icon = CheckCircle;
      bgGradient = 'from-[#D4EFDF] to-[#E8F8F5]';
      borderColour = '#22C55E';
      iconBg = 'bg-[#22C55E]';
      headline = `${firstName} is on track!`;

      const streakText = currentStreak >= 3 ? ` Their ${currentStreak}-day streak shows fantastic commitment.` : '';
      const coverageText = subjectMastery.maths.topicsCovered >= 12 && subjectMastery.english.topicsCovered >= 4 && subjectMastery.verbalreasoning.topicsCovered >= 12
        ? ' Good coverage across all subjects.'
        : '';

      message = `${firstName} is practising ${greatConsistency ? 'brilliantly' : 'regularly'}, mastery is growing across all subjects, and accuracy is improving.${streakText}${coverageText} Keep doing what you're doing!`;
      details = [];

      // Add specific positives
      const strongSubjects = subjects.filter(s => readiness[s].score >= 60);
      if (strongSubjects.length > 0) {
        details.push({ icon: TrendingUp, text: `Strong in ${strongSubjects.map(s => subjectNames[s]).join(' and ')}` });
      }
      if (greatConsistency) {
        details.push({ icon: Flame, text: `${daysLast2Weeks} practice days in the last 2 weeks — excellent consistency` });
      }
      if (avgSpeed && avgSpeed <= 60) {
        details.push({ icon: Clock, text: `Averaging ${avgSpeed}s per question — good pace for the exam` });
      }

    } else {
      // Attention needed — something specific to improve
      status = 'attention-needed';
      icon = ArrowUpRight;
      bgGradient = 'from-[#FFF8E1] to-[#FFF3CD]';
      borderColour = '#F59E0B';
      iconBg = 'bg-[#F59E0B]';

      // Build specific, actionable message
      const issues = [];
      const actionDetails = [];

      // Check consistency
      if (!goodConsistency) {
        issues.push(`needs more regular practice (${daysLast2Weeks} days in the last 2 weeks — aim for 8-10)`);
        actionDetails.push({ icon: Flame, text: 'Increase practice to 4-5 days per week for best results' });
      }

      // Check for weak subject
      if (weakestSubject && readiness[weakestSubject].score < readiness[subjects.find(s => s !== weakestSubject)].score - 15) {
        const strongOnes = subjects.filter(s => s !== weakestSubject && readiness[s].score > readiness[weakestSubject].score + 10);
        if (strongOnes.length > 0) {
          issues.push(`${subjectNames[weakestSubject]} needs more attention — it's behind ${strongOnes.map(s => subjectNames[s]).join(' and ')}`);
          actionDetails.push({ icon: Target, text: `Focus the next few sessions on ${subjectNames[weakestSubject]}` });
        }
      }

      // Check declining topics
      if (decliningTopics.length > 0) {
        const topicDisplayNames = decliningTopics.slice(0, 2).map(t =>
          t.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()
        );
        issues.push(`accuracy is dropping in ${topicDisplayNames.join(' and ')}`);
        actionDetails.push({ icon: TrendingDown, text: `Revisit ${topicDisplayNames.join(' and ')} to reverse the decline` });
      }

      // Check decayed topics
      if (decayedTopics.length >= 3) {
        actionDetails.push({ icon: Clock, text: `${decayedTopics.length} topics haven't been practised in 2+ weeks — knowledge may be fading` });
      }

      // Check speed
      if (speedSlow) {
        actionDetails.push({ icon: Clock, text: `Averaging ${avgSpeed}s per question — working on speed will help in timed exams` });
      }

      if (issues.length === 0) {
        issues.push('could improve with more focused practice on weaker areas');
      }

      headline = `${firstName} is making progress — here's how to improve`;
      message = `${firstName} is doing well overall but ${issues.join(', and ')}. A few targeted changes will make a real difference.`;
      details = actionDetails.slice(0, 3);
    }
  }

  const StatusIcon = icon;

  return (
    <div
      className={`rounded-2xl p-6 mb-6 bg-gradient-to-br ${bgGradient} border-2 shadow-sm`}
      style={{ borderColor: borderColour }}
    >
      {/* Status header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <StatusIcon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-heading font-bold text-slate-800 mb-1">{headline}</h2>
          <p className="text-sm text-[#4A5568] leading-relaxed">{message}</p>
        </div>
      </div>

      {/* Action items */}
      {details.length > 0 && (
        <div className="space-y-2.5 mt-4">
          {details.map((detail, i) => {
            const DetailIcon = detail.icon;
            return (
              <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl px-4 py-3">
                <DetailIcon className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" style={{ color: borderColour }} />
                <p className="text-sm text-slate-800 font-medium">{detail.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick stats bar */}
      {hasEnoughData && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-black/5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 shrink-0" style={{ color: isStreakActive ? '#FF6B6B' : '#B2BEC3' }} />
            <span className="text-xs font-bold text-slate-800">{currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 shrink-0" style={{ color: borderColour }} />
            <span className="text-xs font-bold text-slate-800">{daysThisWeek}/5 days this week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 shrink-0" style={{ color: borderColour }} />
            <span className="text-xs font-bold text-slate-800">{totalQuestions} questions answered</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnTrackCard;

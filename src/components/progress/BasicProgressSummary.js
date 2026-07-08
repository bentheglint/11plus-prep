import React from 'react';
import { Flame, Calendar, BookOpen, CheckCircle } from 'lucide-react';

// The free-tier engagement + headline-accuracy summary (freemium phase-0
// Change 3 / Change 4a). Deliberately narrow: it shows exactly the "basic"
// numbers the free-vs-paid progress line allows (streak, questions this
// week, total questions, one overall accuracy percentage) and nothing
// diagnostic — no per-topic detail, no trends, no recommendations. Shared
// between ChildProgressView (streak already shown in the page header, so
// showStreak=false there) and ParentDashboard (streak not shown anywhere
// else, so showStreak=true).
function BasicProgressSummary({ streaksAndPP, userData, title = 'Progress at a glance', showStreak = true }) {
  const results = userData?.questionResults || [];
  const totalQuestions = results.length;
  const correctCount = results.filter(r => r.correct).length;
  const overallAccuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : null;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const questionsThisWeek = results.filter(r => r.date && new Date(r.date) >= sevenDaysAgo).length;

  const currentStreak = streaksAndPP?.currentStreak || 0;
  const isStreakActive = streaksAndPP?.isStreakActive?.() || false;

  return (
    <div className="card-elevated p-5 mb-6">
      <h3 className="font-heading font-bold text-slate-800 mb-4">{title}</h3>
      <div className={showStreak ? 'grid grid-cols-2 sm:grid-cols-4 gap-4' : 'grid grid-cols-3 gap-4'}>
        {showStreak && (
          <div className="text-center">
            <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: isStreakActive ? '#FF6B6B' : '#B2BEC3' }} />
            <p className="text-xl font-heading font-bold text-slate-800">{currentStreak}</p>
            <p className="text-[10px] text-slate-500">Day streak</p>
          </div>
        )}
        <div className="text-center">
          <Calendar className="w-5 h-5 mx-auto mb-1 text-[#7C3AED]" />
          <p className="text-xl font-heading font-bold text-slate-800">{questionsThisWeek}</p>
          <p className="text-[10px] text-slate-500">Questions this week</p>
        </div>
        <div className="text-center">
          <BookOpen className="w-5 h-5 mx-auto mb-1 text-[#7C3AED]" />
          <p className="text-xl font-heading font-bold text-slate-800">{totalQuestions}</p>
          <p className="text-[10px] text-slate-500">Questions answered</p>
        </div>
        <div className="text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-[#7C3AED]" />
          <p className="text-xl font-heading font-bold text-slate-800">{overallAccuracy !== null ? `${overallAccuracy}%` : 'N/A'}</p>
          <p className="text-[10px] text-slate-500">Overall accuracy</p>
        </div>
      </div>
    </div>
  );
}

export default BasicProgressSummary;

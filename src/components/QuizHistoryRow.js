import React from 'react';
import { ChevronRight } from 'lucide-react';
import { topicNames } from './RecommendationCard';

const SUBJECT_NAMES = {
  maths: 'Maths',
  english: 'English',
  verbalreasoning: 'Verbal Reasoning',
};

// Shared row used by Recent Activity (last 5) and All Activity (full list).
// Keeps the two views visually identical so parents see the same layout
// whether they're peeking or auditing.
export default function QuizHistoryRow({ quiz, onView }) {
  const dotColour = quiz.percentage >= 80 ? '#007D62' : quiz.percentage >= 60 ? '#FDCB6E' : '#FF6B6B';
  const date = new Date(quiz.date);
  const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
  const dateLabel = isToday ? 'Today' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  // Daily Learning rows reuse a single topic key across all subjects, so the
  // subject (already stored on every save) is what distinguishes them.
  const isDaily = quiz.topic === 'daily-learning';
  const title = isDaily
    ? `Daily Learning — ${SUBJECT_NAMES[quiz.subject] || 'Mixed'}`
    : (topicNames[quiz.topic] || quiz.topic);

  // Only quizzes saved after the Quiz Detail feature shipped have a sessionId
  const canViewDetail = !!(quiz.sessionId && onView);

  const rowContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColour }} />
        <div>
          <p className="text-sm font-medium text-slate-800">{title}</p>
          <p className="text-[10px] text-slate-500">{dateLabel} · {quiz.score}/{quiz.total}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: dotColour }}>{quiz.percentage}%</span>
        {canViewDetail && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7] bg-[#EDE8FF] px-2 py-1 rounded-full">
            View
            <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </>
  );

  if (canViewDetail) {
    return (
      <button
        onClick={() => onView(quiz)}
        className="w-full flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors text-left"
      >
        {rowContent}
      </button>
    );
  }
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      {rowContent}
    </div>
  );
}

import React, { useMemo } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import QuizHistoryRow from '../components/QuizHistoryRow';

// AllActivityScreen — full quiz history, newest first. Parents use this
// when they want the complete log; children can open any past quiz's
// Quiz Detail from here. Reached via "View all activity →" from the
// Recent Activity card on the Progress screen.
export default function AllActivityScreen({ quizHistory, onViewQuiz, onBack }) {
  const sorted = useMemo(
    () => [...(quizHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [quizHistory]
  );

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-4 flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-1 sm:gap-2 min-h-[44px] px-1" aria-label="Back to Progress">
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">Back to Progress</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5A4BD1] flex items-center justify-center shadow-lg">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-800">All Activity</h1>
            <p className="text-sm text-gray-500">
              {sorted.length} quiz{sorted.length === 1 ? '' : 'zes'} — newest first
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <p className="text-slate-700 font-medium">No quizzes yet</p>
            <p className="text-sm text-gray-500 mt-1">Start practising and your activity will appear here.</p>
          </div>
        ) : (
          <div className="card-elevated p-5">
            <div className="space-y-2">
              {sorted.map(quiz => (
                <QuizHistoryRow key={quiz.id} quiz={quiz} onView={onViewQuiz} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Flag, ChevronUp, ChevronDown } from 'lucide-react';

function MockTestNavigator({ questions, answers, flags, currentIndex, onGoTo, onClose }) {
  const answeredCount = Object.keys(answers || {}).filter(k => answers[k] !== undefined).length;
  const flaggedCount = Object.keys(flags || {}).filter(k => flags[k]).length;
  const unansweredCount = questions.length - answeredCount;

  // Choose grid columns based on question count
  const cols = questions.length > 60 ? 'grid-cols-10' : questions.length > 30 ? 'grid-cols-8' : 'grid-cols-5';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-heading font-bold text-slate-800">Question Navigator</h4>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <div className={`grid ${cols} gap-1.5 mb-3`}>
        {questions.map((_, i) => {
          const isAnswered = answers && answers[i] !== undefined;
          const isFlagged = flags && flags[i];
          const isCurrent = i === currentIndex;

          return (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              className={`relative w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all
                ${isCurrent
                  ? 'ring-2 ring-[#6C5CE7] bg-[#EDE8FF] text-[#6C5CE7]'
                  : isAnswered
                  ? 'bg-[#007D62]/15 text-[#00876A]'
                  : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
                }`}
            >
              {i + 1}
              {isFlagged && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                  <Flag className="w-2 h-2 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[#007D62]/15 inline-block"></span>
          {answeredCount} answered
        </span>
        {flaggedCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
            {flaggedCount} flagged
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 inline-block"></span>
          {unansweredCount} remaining
        </span>
      </div>
    </div>
  );
}

export default MockTestNavigator;

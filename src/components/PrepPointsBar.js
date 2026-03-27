import React from 'react';
import { Star } from 'lucide-react';

function PrepPointsBar({ levelInfo }) {
  const { level, totalPP, todayPP, progressPct } = levelInfo;

  return (
    <div className="flex items-center gap-3">
      {/* Level badge */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center shadow-md flex-shrink-0">
        <span className="text-white font-bold text-sm">{level}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-[#2D3436]">Level {level}</span>
          <span className="text-xs text-[#636E72]">{totalPP.toLocaleString()} PP</span>
        </div>
        {/* Progress bar to next level */}
        <div className="w-full h-2 bg-[#EDE8FF] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progressPct)}%` }}
          />
        </div>
        {todayPP > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-[#FDCB6E]" />
            <span className="text-[10px] text-[#636E72]">+{todayPP} PP today</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrepPointsBar;

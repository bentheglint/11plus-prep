import React, { useState } from 'react';
import { X, Flame, Calendar, Target, Info } from 'lucide-react';

function StreakDisplay({ currentStreak, longestStreak, isActive, practiceDays = [], practiceLog = [] }) {
  const [showPanel, setShowPanel] = useState(false);
  const flameColour = isActive ? '#FF6B6B' : '#B2BEC3';
  const textColour = isActive ? '#1E293B' : '#64748B';

  // Build 8-week calendar data
  const today = new Date();
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const weeks = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 55);
  const startDay = startDate.getDay();
  const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
  const firstMonday = new Date(startDate);
  firstMonday.setDate(startDate.getDate() + mondayOffset);

  const d = new Date(firstMonday);
  while (d <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const practiced = practiceDays.includes(dateStr);
      const isFuture = d > today;
      const isToday = dateStr === today.toISOString().split('T')[0];
      week.push({ date: dateStr, practiced, isFuture, isToday });
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }

  // Count practice days this week (Mon-Sun)
  const thisWeekStart = new Date(today);
  const todayDay = thisWeekStart.getDay();
  const toMonday = todayDay === 0 ? -6 : 1 - todayDay;
  thisWeekStart.setDate(thisWeekStart.getDate() + toMonday);
  let thisWeekCount = 0;
  for (let i = 0; i < 7; i++) {
    const dd = new Date(thisWeekStart);
    dd.setDate(dd.getDate() + i);
    if (dd > today) break;
    const ds = dd.toISOString().split('T')[0];
    if (practiceDays.includes(ds)) thisWeekCount++;
  }

  return (
    <>
      {/* Clickable streak badge */}
      <button
        onClick={() => setShowPanel(true)}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1 transition-colors"
      >
        <div className={`relative ${isActive && currentStreak >= 3 ? 'animate-pulse' : ''}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill={flameColour}>
            <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.01 3.5-7.5.31-.34.85-.1.84.36-.07 2.67 1.86 4.54 3.16 5.34.36.22.8-.06.74-.47-.3-2.09.52-4.33 2.05-6.23.26-.33.76-.2.84.21.6 2.92 3.37 5.12 3.37 8.29 0 4.42-4.03 8-9 8z"/>
          </svg>
          {currentStreak > 0 && (
            <span className="absolute -top-1 -right-2 text-[10px] font-bold bg-white rounded-full px-1 shadow-sm" style={{ color: flameColour }}>
              {currentStreak}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-bold leading-tight" style={{ color: textColour }}>
            {currentStreak === 0 ? 'Start a streak!' :
             currentStreak === 1 ? '1 day streak' :
             `${currentStreak}-day streak!`}
          </p>
          {longestStreak > currentStreak && (
            <p className="text-[10px] text-slate-500">Best: {longestStreak} days</p>
          )}
        </div>
      </button>

      {/* Streak detail panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto" onClick={() => setShowPanel(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up my-4" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#FF6B6B]" />
                <h2 className="font-heading font-bold text-lg text-slate-800">Your Practice Streak</h2>
              </div>
              <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 bg-gradient-to-b from-orange-50 to-white rounded-xl">
                <p className="text-2xl font-bold text-[#FF6B6B]">{currentStreak}</p>
                <p className="text-[10px] text-slate-500 font-medium">Current streak</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-b from-purple-50 to-white rounded-xl">
                <p className="text-2xl font-bold text-[#6C5CE7]">{longestStreak}</p>
                <p className="text-[10px] text-slate-500 font-medium">Best streak</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-b from-green-50 to-white rounded-xl">
                <p className="text-2xl font-bold text-[#00B894]">{thisWeekCount}/5</p>
                <p className="text-[10px] text-slate-500 font-medium">This week</p>
              </div>
            </div>

            {/* Practice calendar */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#6C5CE7]" />
                <h3 className="font-heading font-bold text-sm text-slate-800">Practice Consistency</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((name, i) => (
                    <div key={i} className="text-center text-[9px] font-bold text-slate-500">{name}</div>
                  ))}
                </div>
                {/* Week rows */}
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className={`aspect-square rounded-sm flex items-center justify-center text-[8px] font-bold
                          ${day.isFuture ? 'bg-gray-100' :
                            day.isToday && day.practiced ? 'bg-[#00B894] text-white ring-2 ring-[#00B894]/30' :
                            day.isToday ? 'bg-white border-2 border-[#6C5CE7] text-[#6C5CE7]' :
                            day.practiced ? 'bg-[#6C5CE7] text-white' :
                            'bg-gray-200 text-gray-400'}`}
                        title={day.date}
                      >
                        {day.isToday ? '⬤' : day.practiced ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#6C5CE7] inline-block"></span> Practised</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-200 inline-block border border-gray-300"></span> No practice</span>
                </div>
              </div>
            </div>

            {/* How streaks work */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#6C5CE7]" />
                <h3 className="font-heading font-bold text-sm text-slate-800">How Streaks Work</h3>
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <p className="flex items-start gap-2">
                  <span className="text-[#00B894] font-bold mt-0.5">✓</span>
                  <span>Complete <strong className="text-slate-800">at least one quiz</strong> to count as a practice day</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#6C5CE7] font-bold mt-0.5">★</span>
                  <span>Practise <strong className="text-slate-800">5 out of every 7 days</strong> and you're building great habits</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#FF6B6B] font-bold mt-0.5">!</span>
                  <span>Drop below <strong className="text-slate-800">5 days in any week</strong> and your streak starts fresh</span>
                </p>
                <p className="flex items-start gap-2 mt-1">
                  <span className="text-[#00B894] font-bold mt-0.5">♥</span>
                  <span>Taking breaks is healthy! Your progress is <strong className="text-slate-800">always saved</strong></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StreakDisplay;

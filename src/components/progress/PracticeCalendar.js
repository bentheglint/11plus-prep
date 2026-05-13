import React from 'react';

// Weekly practice calendar — rows are weeks, columns are Mon-Sun
function PracticeCalendar({ practiceDays, practiceLog }) {
  const today = new Date();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Build day data for last 56 days (8 weeks)
  const dayMap = {};
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const practiced = practiceDays.includes(dateStr);
    const dayLog = (practiceLog || []).filter(p => p.date === dateStr);
    const questions = dayLog.reduce((s, p) => s + (p.questionsAttempted || 0), 0);
    dayMap[dateStr] = { date: dateStr, dateObj: d, practiced, questions };
  }

  // Group into Mon-Sun weeks (ISO weeks: Monday = start)
  // Find the Monday on or before 55 days ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 55);
  const startDay = startDate.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
  const firstMonday = new Date(startDate);
  firstMonday.setDate(startDate.getDate() + mondayOffset);

  const weeks = [];
  const d = new Date(firstMonday);
  while (d <= today) {
    const week = [];
    const weekStart = new Date(d);
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().split('T')[0];
      week.push(dayMap[dateStr] || { date: dateStr, dateObj: new Date(d), practiced: false, questions: 0, outOfRange: true });
      d.setDate(d.getDate() + 1);
    }
    const weekEnd = new Date(d);
    weekEnd.setDate(weekEnd.getDate() - 1);
    weeks.push({ days: week, start: weekStart, end: weekEnd });
  }

  // Most recent week first
  weeks.reverse();

  const intensityColours = ['#F3F4F6', '#DDD6FE', '#A78BFA', '#7C3AED'];
  const getIntensity = (q) => q === 0 ? 0 : q <= 10 ? 1 : q <= 25 ? 2 : 3;

  // Format date range label.
  // Compact ("24-30 Mar") on mobile-narrow columns; full ("24 Mar – 30 Mar") on wider.
  const formatRangeFull = (start, end) => {
    const opts = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
  };
  const formatRangeCompact = (start, end) => {
    const startMonth = start.toLocaleDateString('en-GB', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-GB', { month: 'short' });
    if (startMonth === endMonth) return `${start.getDate()}-${end.getDate()} ${endMonth}`;
    return `${start.getDate()} ${startMonth}-${end.getDate()} ${endMonth}`;
  };

  // Is this the current week?
  const isCurrentWeek = (week) => {
    const todayStr = today.toISOString().split('T')[0];
    return week.days.some(d => d.date === todayStr);
  };

  // Stats
  const last28 = Object.values(dayMap).slice(-28);
  const last28Practiced = last28.filter(d => d.practiced).length;
  const last28Questions = last28.reduce((s, d) => s + d.questions, 0);
  const currentWeek = weeks.find(isCurrentWeek);
  const thisWeekDays = currentWeek ? currentWeek.days.filter(d => d.practiced).length : 0;

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="font-heading font-bold text-slate-800">Practice Consistency</h3>
        <p className="text-sm font-bold text-slate-800">
          {thisWeekDays}/7 this week
          <span className="text-xs font-normal text-slate-500 ml-1">(target: 4-5)</span>
        </p>
      </div>

      {/* Column headers: Mon - Sun + Total */}
      <div className="flex items-center mb-2">
        <div className="w-16 sm:w-28 flex-shrink-0" />
        {dayNames.map(name => (
          <div key={name} className="flex-1 text-center text-[10px] sm:text-xs font-bold text-slate-500">
            {name}
          </div>
        ))}
        <div className="w-7 sm:w-8 flex-shrink-0 text-center text-[10px] font-bold text-slate-500 pl-1">
          Total
        </div>
      </div>

      {/* Week rows — most recent first */}
      <div className="space-y-1.5">
        {weeks.map((week, wi) => {
          const current = isCurrentWeek(week);
          const practicedCount = week.days.filter(d => d.practiced).length;
          return (
            <div key={wi} className={`flex items-center ${current ? 'bg-[#EDE8FF]/50 rounded-lg py-1 -mx-1 px-1' : ''}`}>
              {/* Date range label — compact on mobile, full on wider */}
              <div className="w-16 sm:w-28 flex-shrink-0 text-[10px] sm:text-[11px] text-slate-500 pr-1 sm:pr-2 leading-tight">
                {current && <span className="text-[#7C3AED] font-bold">This week</span>}
                {!current && (
                  <>
                    <span className="sm:hidden">{formatRangeCompact(week.start, week.end)}</span>
                    <span className="hidden sm:inline">{formatRangeFull(week.start, week.end)}</span>
                  </>
                )}
              </div>
              {/* Day cells */}
              {week.days.map((day) => {
                const isToday = day.date === today.toISOString().split('T')[0];
                const isFuture = new Date(day.date) > today;
                const intensity = getIntensity(day.questions);
                return (
                  <div key={day.date} className="flex-1 flex justify-center">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center transition-colors ${isToday ? 'ring-2 ring-[#7C3AED] ring-offset-1' : ''}`}
                      style={{ background: isFuture ? 'transparent' : intensityColours[intensity] }}
                      title={`${day.date}: ${day.questions} questions`}
                    />
                  </div>
                );
              })}
              {/* Weekly count */}
              <div className="w-7 sm:w-8 flex-shrink-0 text-center text-xs font-bold text-slate-500 pl-1">
                {practicedCount > 0 ? practicedCount : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-[11px] sm:text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded border border-gray-300" style={{ background: '#F3F4F6' }} /> No practice</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: '#DDD6FE' }} /> 1-10 Qs</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: '#A78BFA' }} /> 11-25 Qs</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: '#7C3AED' }} /> 25+ Qs</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-slate-800">{last28Practiced}</p>
          <p className="text-[10px] text-slate-500">Days (last 4 wks)</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-slate-800">{last28Questions}</p>
          <p className="text-[10px] text-slate-500">Questions</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-slate-800">{practiceDays.length}</p>
          <p className="text-[10px] text-slate-500">Total days</p>
        </div>
      </div>
    </div>
  );
}

export default PracticeCalendar;

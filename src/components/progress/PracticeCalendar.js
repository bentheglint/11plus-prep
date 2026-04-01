import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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

  const intensityColours = ['#F3F4F6', '#DDD6FE', '#A78BFA', '#6C5CE7'];
  const getIntensity = (q) => q === 0 ? 0 : q <= 10 ? 1 : q <= 25 ? 2 : 3;

  // Format date range label: "24 Mar - 30 Mar"
  const formatRange = (start, end) => {
    const opts = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-[#2D3436]">Practice Consistency</h3>
        <p className="text-sm font-bold text-[#2D3436]">
          {thisWeekDays}/7 this week
          <span className="text-xs font-normal text-[#636E72] ml-1">(target: 4-5)</span>
        </p>
      </div>

      {/* Column headers: Mon - Sun + Total */}
      <div className="flex items-center mb-2">
        <div className="w-28 flex-shrink-0" />
        {dayNames.map(name => (
          <div key={name} className="flex-1 text-center text-xs font-bold text-[#636E72]">
            {name}
          </div>
        ))}
        <div className="w-8 flex-shrink-0 text-center text-[10px] font-bold text-[#636E72] pl-1">
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
              {/* Date range label */}
              <div className="w-28 flex-shrink-0 text-[11px] text-[#636E72] pr-2">
                {current && <span className="text-[#6C5CE7] font-bold">This week</span>}
                {!current && formatRange(week.start, week.end)}
              </div>
              {/* Day cells */}
              {week.days.map((day) => {
                const isToday = day.date === today.toISOString().split('T')[0];
                const isFuture = new Date(day.date) > today;
                const intensity = getIntensity(day.questions);
                return (
                  <div key={day.date} className="flex-1 flex justify-center">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isToday ? 'ring-2 ring-[#6C5CE7] ring-offset-1' : ''}`}
                      style={{ background: isFuture ? 'transparent' : intensityColours[intensity] }}
                      title={`${day.date}: ${day.questions} questions`}
                    >
                      {day.practiced && (
                        <CheckCircle2 className="w-4 h-4 text-[#6C5CE7]" />
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Weekly count */}
              <div className="w-8 flex-shrink-0 text-center text-xs font-bold text-[#636E72] pl-1">
                {practicedCount > 0 ? practicedCount : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-[#636E72]">
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{ background: '#F3F4F6' }} /> No practice</span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{ background: '#DDD6FE' }} /> 1-10 Qs</span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{ background: '#A78BFA' }} /> 11-25 Qs</span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 rounded" style={{ background: '#6C5CE7' }} /> 25+ Qs</span>
        <span className="flex items-center gap-1 ml-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#6C5CE7]" /> Practised</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-[#2D3436]">{last28Practiced}</p>
          <p className="text-[10px] text-[#636E72]">Days (last 4 wks)</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-[#2D3436]">{last28Questions}</p>
          <p className="text-[10px] text-[#636E72]">Questions</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-[#2D3436]">{practiceDays.length}</p>
          <p className="text-[10px] text-[#636E72]">Total days</p>
        </div>
      </div>
    </div>
  );
}

export default PracticeCalendar;

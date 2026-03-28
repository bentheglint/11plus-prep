import React from 'react';

// GitHub-style contribution grid showing practice consistency
function PracticeCalendar({ practiceDays, practiceLog }) {
  const today = new Date();
  const days = [];

  // Generate last 84 days (12 weeks)
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const practiced = practiceDays.includes(dateStr);

    // Count questions on this day from practice log
    const dayLog = (practiceLog || []).filter(p => p.date === dateStr);
    const questions = dayLog.reduce((s, p) => s + (p.questionsAttempted || 0), 0);

    days.push({
      date: dateStr,
      day: d.getDay(),
      practiced,
      questions,
      intensity: questions === 0 ? 0 : questions <= 10 ? 1 : questions <= 25 ? 2 : 3,
    });
  }

  // Group into weeks (columns)
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const intensityColours = ['#EBEDF0', '#C4B5FD', '#8B5CF6', '#6C5CE7'];

  // Stats
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisWeekStr = thisWeekStart.toISOString().split('T')[0];
  const thisWeekDays = practiceDays.filter(d => d >= thisWeekStr).length;

  const last28Days = days.slice(-28);
  const last28Practiced = last28Days.filter(d => d.practiced).length;
  const last28Questions = last28Days.reduce((s, d) => s + d.questions, 0);

  return (
    <div className="card-elevated p-5 mb-6">
      <h3 className="font-heading font-bold text-[#2D3436] mb-3">Practice Consistency</h3>

      {/* Day labels */}
      <div className="flex gap-1 mb-2">
        <div className="flex flex-col gap-1 text-[10px] text-[#636E72] pr-1 justify-between" style={{ paddingTop: 2, paddingBottom: 2 }}>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1 flex-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map(day => (
                <div
                  key={day.date}
                  className="aspect-square rounded transition-colors"
                  style={{ background: intensityColours[day.intensity], minHeight: 14 }}
                  title={`${day.date}: ${day.questions} questions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#636E72]">
          <span>Less</span>
          {intensityColours.map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-sm" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[#2D3436]">
            {thisWeekDays} day{thisWeekDays !== 1 ? 's' : ''} this week
            <span className="text-xs font-normal text-[#636E72] ml-1">(target: 4-5)</span>
          </p>
        </div>
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

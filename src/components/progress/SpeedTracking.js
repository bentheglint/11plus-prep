import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const subjectTargets = {
  maths: { target: 60, name: 'Maths', colour: '#0770C2' },
  english: { target: 60, name: 'English', colour: '#007D62' },
  verbalreasoning: { target: 37, name: 'Verbal Reasoning', colour: '#7C3AED' },
};

function SpeedTracking({ questionResults }) {
  if (!questionResults || questionResults.length === 0) return null;

  // Only show if we have timing data
  const withTime = questionResults.filter(r => r.timeSpentMs > 0);
  if (withTime.length < 10) return null;

  // Group by subject
  const bySubject = {};
  withTime.forEach(r => {
    if (!bySubject[r.subject]) bySubject[r.subject] = [];
    bySubject[r.subject].push(r);
  });

  const subjectStats = Object.entries(bySubject).map(([subject, results]) => {
    const recent = results.slice(-50); // last 50 questions
    const avgMs = recent.reduce((s, r) => s + r.timeSpentMs, 0) / recent.length;
    const avgSecs = Math.round(avgMs / 1000);
    const config = subjectTargets[subject] || { target: 60, name: subject, colour: '#64748B' };

    // Check for guessing: fast + low accuracy
    const recentCorrect = recent.filter(r => r.correct).length;
    const accuracy = Math.round((recentCorrect / recent.length) * 100);
    const possibleGuessing = avgSecs < 15 && accuracy < 50;

    // Trend: compare last 25 vs previous 25
    const last25 = results.slice(-25);
    const prev25 = results.slice(-50, -25);
    let trend = 'stable';
    if (last25.length >= 10 && prev25.length >= 10) {
      const lastAvg = last25.reduce((s, r) => s + r.timeSpentMs, 0) / last25.length;
      const prevAvg = prev25.reduce((s, r) => s + r.timeSpentMs, 0) / prev25.length;
      if (lastAvg < prevAvg * 0.9) trend = 'faster';
      else if (lastAvg > prevAvg * 1.1) trend = 'slower';
    }

    return { ...config, subject, avgSecs, accuracy, possibleGuessing, trend, count: recent.length };
  }).filter(s => s.count >= 5);

  if (subjectStats.length === 0) return null;

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#7C3AED]" />
        <h3 className="font-heading font-bold text-slate-800">Speed Tracking</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">Average time per question (lower is better, but not at the cost of accuracy)</p>

      <div className="space-y-3">
        {subjectStats.map(stat => {
          const pct = Math.min(100, (stat.avgSecs / (stat.target * 1.5)) * 100);
          const barColour = stat.avgSecs <= stat.target ? '#007D62' :
                           stat.avgSecs <= stat.target * 1.3 ? '#FDCB6E' : '#FF6B6B';

          return (
            <div key={stat.subject}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-800">{stat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: barColour }}>
                    {stat.avgSecs}s
                  </span>
                  <span className="text-[10px] text-slate-500">
                    / {stat.target}s target
                  </span>
                  {stat.trend === 'faster' && <span className="text-[10px] text-[#007D62] font-bold">↓ faster</span>}
                  {stat.trend === 'slower' && <span className="text-[10px] text-[#FF6B6B] font-bold">↑ slower</span>}
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColour }} />
              </div>
              {stat.possibleGuessing && (
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-600">
                  <AlertTriangle className="w-3 h-3" />
                  Fast answers with low accuracy ({stat.accuracy}%) — may indicate guessing
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpeedTracking;

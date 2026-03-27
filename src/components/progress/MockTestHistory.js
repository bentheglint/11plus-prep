import React from 'react';
import { FileText, Clock, TrendingUp } from 'lucide-react';

const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };

function MockTestHistory({ mockTestHistory }) {
  if (!mockTestHistory || mockTestHistory.length === 0) {
    return (
      <div className="card-elevated p-5 mb-6 text-center">
        <h3 className="font-heading font-bold text-[#2D3436] mb-2">Mock Tests</h3>
        <p className="text-sm text-[#636E72]">No mock tests taken yet. Try one from any subject!</p>
      </div>
    );
  }

  const sorted = [...mockTestHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Sparkline data: last 10 mock scores
  const sparkData = sorted.slice(0, 10).reverse().map(m => m.percentage);
  const sparkMax = Math.max(...sparkData, 100);
  const sparkMin = Math.min(...sparkData, 0);
  const sparkW = 150;
  const sparkH = 40;
  const sparkPoints = sparkData.map((v, i) =>
    `${(i / Math.max(1, sparkData.length - 1)) * sparkW},${sparkH - ((v - sparkMin) / (sparkMax - sparkMin || 1)) * sparkH}`
  ).join(' ');

  // Average speed from most recent test with time data
  const withTime = sorted.filter(m => m.timeTaken && m.totalQuestions);
  const avgSpeed = withTime.length > 0
    ? Math.round(withTime[0].timeTaken / withTime[0].totalQuestions)
    : null;

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#6C5CE7]" />
          <h3 className="font-heading font-bold text-[#2D3436]">Mock Tests</h3>
        </div>
        {sparkData.length >= 3 && (
          <svg width={sparkW} height={sparkH} className="overflow-visible">
            <polyline
              points={sparkPoints}
              fill="none"
              stroke="#6C5CE7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {sparkData.map((v, i) => (
              <circle
                key={i}
                cx={(i / Math.max(1, sparkData.length - 1)) * sparkW}
                cy={sparkH - ((v - sparkMin) / (sparkMax - sparkMin || 1)) * sparkH}
                r="3"
                fill="#6C5CE7"
              />
            ))}
          </svg>
        )}
      </div>

      {avgSpeed && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#EDE8FF] rounded-lg">
          <Clock className="w-4 h-4 text-[#6C5CE7]" />
          <span className="text-sm text-[#2D3436]">
            Average speed: <strong>{avgSpeed}s per question</strong>
            <span className="text-[#636E72]"> (target: ~60s)</span>
          </span>
        </div>
      )}

      <div className="space-y-2">
        {sorted.slice(0, 8).map(test => {
          const date = new Date(test.date);
          const dateLabel = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          const dotColour = test.percentage >= 80 ? '#00B894' : test.percentage >= 60 ? '#FDCB6E' : '#FF6B6B';
          const minsUsed = test.timeTaken ? Math.floor(test.timeTaken / 60) : null;
          const minsAllowed = test.timeLimit ? Math.floor(test.timeLimit / 60) : null;

          return (
            <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-[#FAFBFF] border border-[#EDE8FF]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dotColour }} />
                <div>
                  <p className="font-bold text-sm text-[#2D3436]">
                    {subjectNames[test.subject] || test.subject}
                  </p>
                  <p className="text-[10px] text-[#636E72]">
                    {dateLabel}
                    {minsUsed !== null && ` · ${minsUsed}m${minsAllowed ? `/${minsAllowed}m` : ''}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-heading font-bold" style={{ color: dotColour }}>{test.percentage}%</p>
                <p className="text-[10px] text-[#636E72]">{test.totalCorrect}/{test.totalQuestions}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MockTestHistory;

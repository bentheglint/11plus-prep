import React from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Clock, Target, BarChart3, ChevronRight, Home } from 'lucide-react';
import { topicNames } from '../components/RecommendationCard';

const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
const subjectColours = { maths: '#0984E3', english: '#00B894', verbalreasoning: '#6C5CE7' };

function TopicDrillDown({ subject, topicKey, mastery, questionResults, onPractise, onBack, onHome }) {
  const m = mastery.getTopicMastery(topicKey);
  const displayName = topicNames[topicKey] || topicKey;
  const colour = subjectColours[subject] || '#6C5CE7';

  // Get question results for this topic (most recent first)
  const topicResults = (questionResults || [])
    .filter(r => r.topicKey === topicKey)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Accuracy sparkline — last 30 days, grouped by day
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentResults = topicResults.filter(r => new Date(r.date) >= thirtyDaysAgo);

  const dailyAccuracy = {};
  recentResults.forEach(r => {
    const day = r.date.split('T')[0];
    if (!dailyAccuracy[day]) dailyAccuracy[day] = { correct: 0, total: 0 };
    dailyAccuracy[day].total++;
    if (r.correct) dailyAccuracy[day].correct++;
  });

  const sparkDays = Object.entries(dailyAccuracy)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, data]) => ({ day, pct: Math.round((data.correct / data.total) * 100) }));

  // SVG sparkline
  const sparkW = 280, sparkH = 60, sparkTop = 10, sparkLeft = 5;
  const sparkPoints = sparkDays.length > 1
    ? sparkDays.map((d, i) =>
        `${sparkLeft + (i / (sparkDays.length - 1)) * sparkW},${sparkTop + sparkH - (d.pct / 100) * sparkH}`
      ).join(' ')
    : null;

  // Difficulty breakdown
  const diffData = [1, 2, 3].map(d => {
    const atDiff = topicResults.slice(0, 30).filter(r => r.difficulty === d);
    if (atDiff.length === 0) return { difficulty: d, total: 0, correct: 0, pct: 0 };
    const correct = atDiff.filter(r => r.correct).length;
    return { difficulty: d, total: atDiff.length, correct, pct: Math.round((correct / atDiff.length) * 100) };
  });
  const diffLabels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
  const diffColours = { 1: '#00B894', 2: '#FDCB6E', 3: '#FF6B6B' };

  // Speed stats
  const withTime = topicResults.filter(r => r.timeSpentMs > 0).slice(0, 30);
  const avgTimeSecs = withTime.length > 0
    ? Math.round(withTime.reduce((s, r) => s + r.timeSpentMs, 0) / withTime.length / 1000)
    : null;

  // Trend display
  const TrendIcon = m.trend?.direction === 'up' ? TrendingUp :
                    m.trend?.direction === 'down' ? TrendingDown : Minus;
  const trendColour = m.trend?.direction === 'up' ? '#00B894' :
                      m.trend?.direction === 'down' ? '#FF6B6B' : '#636E72';
  const trendText = m.trend?.direction === 'up' ? `Improving (+${m.trend.delta}%)` :
                    m.trend?.direction === 'down' ? `Declining (${m.trend.delta}%)` : 'Stable';

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Progress
          </button>
          {onHome && (
            <button onClick={onHome} className="p-2 text-gray-400 hover:text-[#6C5CE7] transition-colors" title="Home">
              <Home className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="card-elevated p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colour }}>
                {subjectNames[subject]}
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#2D3436]">{displayName}</h2>
            </div>
            <button
              onClick={() => onPractise(subject, topicKey)}
              className="px-5 py-2.5 text-white font-bold rounded-xl text-sm flex items-center gap-2"
              style={{ background: colour }}
            >
              Practise
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mastery + Stars */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5" fill={i <= m.stars ? '#FDCB6E' : 'none'} stroke={i <= m.stars ? '#F39C12' : '#DFE6E9'} strokeWidth={2} />
              ))}
            </div>
            <span className="text-sm font-bold text-[#2D3436]">{m.label}</span>
            <div className="flex items-center gap-1">
              <TrendIcon className="w-4 h-4" style={{ color: trendColour }} />
              <span className="text-xs" style={{ color: trendColour }}>{trendText}</span>
            </div>
          </div>

          {/* Key stats row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-heading font-bold text-[#2D3436]">{m.recentAccuracy || 0}%</p>
              <p className="text-[10px] text-[#636E72]">Accuracy</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-heading font-bold text-[#2D3436]">{m.totalQuestions}</p>
              <p className="text-[10px] text-[#636E72]">Questions</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-heading font-bold text-[#2D3436]">{m.daysSince === Infinity ? '—' : `${m.daysSince}d`}</p>
              <p className="text-[10px] text-[#636E72]">Last practised</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-heading font-bold text-[#2D3436]">{avgTimeSecs ? `${avgTimeSecs}s` : '—'}</p>
              <p className="text-[10px] text-[#636E72]">Avg speed</p>
            </div>
          </div>
        </div>

        {/* Accuracy over time chart */}
        {sparkDays.length >= 2 && (
          <div className="card-elevated p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[#6C5CE7]" />
              <h3 className="font-heading font-bold text-[#2D3436] text-sm">Accuracy Over Time (Last 30 Days)</h3>
            </div>
            <svg width="100%" viewBox={`0 0 ${sparkLeft + sparkW + 35} ${sparkTop + sparkH + 20}`}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => (
                <g key={pct}>
                  <line x1={sparkLeft} y1={sparkTop + sparkH - (pct / 100) * sparkH} x2={sparkLeft + sparkW} y2={sparkTop + sparkH - (pct / 100) * sparkH}
                    stroke="#EDE8FF" strokeWidth="1" strokeDasharray="4,4" />
                  <text x={sparkLeft + sparkW + 5} y={sparkTop + sparkH - (pct / 100) * sparkH + 4} fontSize="8" fill="#636E72">{pct}%</text>
                </g>
              ))}
              {/* Line */}
              <polyline points={sparkPoints} fill="none" stroke={colour} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {sparkDays.map((d, i) => (
                <circle key={i}
                  cx={sparkLeft + (i / (sparkDays.length - 1)) * sparkW}
                  cy={sparkTop + sparkH - (d.pct / 100) * sparkH}
                  r="4" fill={colour} stroke="white" strokeWidth="2"
                />
              ))}
              {/* Date labels */}
              {sparkDays.filter((_, i) => i === 0 || i === sparkDays.length - 1).map((d, i) => (
                <text key={i}
                  x={i === 0 ? sparkLeft : sparkLeft + sparkW}
                  y={sparkTop + sparkH + 15}
                  fontSize="8" fill="#636E72"
                  textAnchor={i === 0 ? 'start' : 'end'}
                >
                  {new Date(d.day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </text>
              ))}
            </svg>
          </div>
        )}

        {/* Difficulty breakdown */}
        {diffData.some(d => d.total > 0) && (
          <div className="card-elevated p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#6C5CE7]" />
              <h3 className="font-heading font-bold text-[#2D3436] text-sm">Difficulty Breakdown</h3>
            </div>
            <div className="space-y-3">
              {diffData.map(d => {
                if (d.total === 0) return (
                  <div key={d.difficulty} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-16" style={{ color: diffColours[d.difficulty] }}>{diffLabels[d.difficulty]}</span>
                    <span className="text-xs text-[#636E72]">No questions yet</span>
                  </div>
                );
                return (
                  <div key={d.difficulty}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold" style={{ color: diffColours[d.difficulty] }}>{diffLabels[d.difficulty]}</span>
                      <span className="text-xs text-[#636E72]">{d.correct}/{d.total} ({d.pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: diffColours[d.difficulty] }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {diffData[0].total > 0 && diffData[2].total > 0 && diffData[2].pct < diffData[0].pct - 20 && (
              <p className="text-xs text-[#636E72] mt-3 p-2 bg-amber-50 rounded-lg">
                Tip: You're doing well on easy questions but finding hard ones challenging. Focus on the harder questions to improve your exam readiness.
              </p>
            )}
          </div>
        )}

        {/* Recent question results */}
        {topicResults.length > 0 && (
          <div className="card-elevated p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#6C5CE7]" />
              <h3 className="font-heading font-bold text-[#2D3436] text-sm">Recent Questions</h3>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {topicResults.slice(0, 20).map((r, i) => {
                const date = new Date(r.date);
                const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const dateLabel = isToday ? 'Today' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                const timeSecs = r.timeSpentMs > 0 ? Math.round(r.timeSpentMs / 1000) : null;

                return (
                  <div key={i} className={`flex items-center gap-3 py-1.5 px-2 rounded text-xs ${r.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 ${r.correct ? 'bg-green-500' : 'bg-red-400'}`}>
                      {r.correct ? '✓' : '✗'}
                    </span>
                    <span className="text-[#636E72] flex-shrink-0 w-12">{dateLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] flex-shrink-0 ${
                      r.difficulty === 1 ? 'bg-green-100 text-green-700' :
                      r.difficulty === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>D{r.difficulty}</span>
                    <span className="text-[#2D3436] flex-1 truncate">Q{r.questionId}</span>
                    {timeSecs && (
                      <span className="text-[#636E72] flex-shrink-0">{timeSecs}s</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {topicResults.length === 0 && (
          <div className="card-elevated p-8 text-center mb-6">
            <Target className="w-12 h-12 mx-auto mb-3 text-[#A29BFE]" />
            <h3 className="font-heading font-bold text-[#2D3436] mb-2">No data yet</h3>
            <p className="text-sm text-[#636E72] mb-4">Complete some questions on this topic to see your detailed stats.</p>
            <button
              onClick={() => onPractise(subject, topicKey)}
              className="px-6 py-3 text-white font-bold rounded-xl"
              style={{ background: colour }}
            >
              Start Practising
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicDrillDown;

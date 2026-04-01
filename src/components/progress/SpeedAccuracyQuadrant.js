import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { topicNames } from '../RecommendationCard';

const subjectConfig = {
  maths: { name: 'Maths', colour: '#0984E3', speedTarget: 60 },
  english: { name: 'English', colour: '#00B894', speedTarget: 55 },
  verbalreasoning: { name: 'Verbal Reasoning', colour: '#6C5CE7', speedTarget: 37.5 },
};

const ACCURACY_LINE = 75; // %
const MIN_RESULTS = 5;
const STALE_DAYS = 14;

function SpeedAccuracyQuadrant({ questionResults }) {

  // Compute per-topic stats grouped by subject
  const subjectData = useMemo(() => {
    if (!questionResults || questionResults.length === 0) return {};

    const withTime = questionResults.filter(r => r.timeSpentMs > 0 && r.subject);

    // Group by subject → topic
    const grouped = {};
    withTime.forEach(r => {
      const key = `${r.subject}|${r.topicKey}`;
      if (!grouped[key]) grouped[key] = { subject: r.subject, topicKey: r.topicKey, results: [] };
      grouped[key].results.push(r);
    });

    // Compute stats per topic, group into subjects
    const bySubject = {};
    Object.values(grouped).forEach(({ subject, topicKey, results }) => {
      if (results.length < MIN_RESULTS) return;

      const correct = results.filter(r => r.correct).length;
      const accuracy = Math.round((correct / results.length) * 100);
      const avgMs = results.reduce((s, r) => s + r.timeSpentMs, 0) / results.length;
      const avgSecs = Math.round(avgMs / 1000);

      // Recency: days since last result
      const lastDate = new Date(Math.max(...results.map(r => new Date(r.date).getTime())));
      const daysSince = Math.round((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      const isStale = daysSince > STALE_DAYS;

      if (!bySubject[subject]) bySubject[subject] = [];
      bySubject[subject].push({
        topicKey,
        name: topicNames[topicKey] || topicKey,
        accuracy,
        avgSecs,
        count: results.length,
        isStale,
        daysSince,
      });
    });

    return bySubject;
  }, [questionResults]);

  const hasData = Object.values(subjectData).some(topics => topics.length > 0);
  if (!hasData) return null;

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-5 h-5 text-[#6C5CE7]" />
        <h3 className="font-heading font-bold text-[#2D3436]">Accuracy vs Speed</h3>
      </div>
      <p className="text-xs text-[#636E72] mb-4">
        How each topic compares on accuracy and speed against GL exam targets
      </p>

      <div className="space-y-6">
        {Object.entries(subjectConfig).map(([subject, config]) => {
          const topics = subjectData[subject];
          if (!topics || topics.length === 0) return null;
          return (
            <QuadrantChart
              key={subject}
              subjectName={config.name}
              colour={config.colour}
              speedTarget={config.speedTarget}
              topics={topics}
            />
          );
        })}
      </div>
    </div>
  );
}

function QuadrantChart({ subjectName, colour, speedTarget, topics }) {
  // SVG dimensions — large enough to read comfortably
  const W = 520, H = 400;
  const pad = { top: 36, right: 24, bottom: 56, left: 58 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  // Compute axis ranges — zoom to data but always include the threshold lines
  const speeds = topics.map(t => t.avgSecs);
  const accuracies = topics.map(t => t.accuracy);

  const rawMinSpeed = Math.min(...speeds, speedTarget);
  const rawMaxSpeed = Math.max(...speeds, speedTarget);
  const rawMinAcc = Math.min(...accuracies, ACCURACY_LINE);
  const rawMaxAcc = Math.max(...accuracies, ACCURACY_LINE);

  // Add 10% padding around data
  const speedRange = rawMaxSpeed - rawMinSpeed || 20;
  const accRange = rawMaxAcc - rawMinAcc || 20;
  const minSpeed = Math.max(0, Math.floor(rawMinSpeed - speedRange * 0.15));
  const maxSpeed = Math.ceil(rawMaxSpeed + speedRange * 0.15);
  const minAcc = Math.max(0, Math.floor(rawMinAcc - accRange * 0.15));
  const maxAcc = Math.min(100, Math.ceil(rawMaxAcc + accRange * 0.15));

  // Scale functions — speed on X (left = fast), accuracy on Y (up = accurate)
  const xScale = (secs) => pad.left + ((secs - minSpeed) / (maxSpeed - minSpeed)) * plotW;
  const yScale = (acc) => pad.top + plotH - ((acc - minAcc) / (maxAcc - minAcc)) * plotH;

  // Threshold line positions
  const threshX = xScale(speedTarget);
  const threshY = yScale(ACCURACY_LINE);

  // Quadrant background colours (very subtle)
  const quadrants = [
    { x: pad.left, y: pad.top, w: threshX - pad.left, h: threshY - pad.top, fill: '#00B89408', label: 'Exam Ready', lx: pad.left + 8, ly: pad.top + 18 },
    { x: threshX, y: pad.top, w: pad.left + plotW - threshX, h: threshY - pad.top, fill: '#0984E308', label: 'Build Speed', lx: pad.left + plotW - 8, ly: pad.top + 18, anchor: 'end' },
    { x: pad.left, y: threshY, w: threshX - pad.left, h: pad.top + plotH - threshY, fill: '#FDCB6E08', label: 'Build Accuracy', lx: pad.left + 8, ly: pad.top + plotH - 8 },
    { x: threshX, y: threshY, w: pad.left + plotW - threshX, h: pad.top + plotH - threshY, fill: '#E17B1E08', label: 'Focus Here', lx: pad.left + plotW - 8, ly: pad.top + plotH - 8, anchor: 'end' },
  ];

  return (
    <div>
      <h4 className="text-base font-heading font-bold mb-3" style={{ color: colour }}>{subjectName}</h4>
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Plot area background */}
          <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#fafafa" rx={4} />

          {/* Quadrant fills */}
          {quadrants.map((q, i) => (
            <g key={i}>
              <rect x={Math.max(q.x, pad.left)} y={Math.max(q.y, pad.top)}
                width={Math.min(q.w, plotW)} height={Math.min(q.h, plotH)}
                fill={q.fill} />
              <text x={q.lx} y={q.ly} textAnchor={q.anchor || 'start'}
                fontSize={11} fontWeight="600" fill="#d1d5db" opacity={0.7}>
                {q.label}
              </text>
            </g>
          ))}

          {/* Threshold lines */}
          <line x1={threshX} y1={pad.top} x2={threshX} y2={pad.top + plotH}
            stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4,3" />
          <line x1={pad.left} y1={threshY} x2={pad.left + plotW} y2={threshY}
            stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4,3" />

          {/* Threshold labels */}
          <text x={threshX} y={pad.top - 8} textAnchor="middle"
            fontSize={11} fill="#9ca3af" fontWeight="600">
            GL: {speedTarget}s
          </text>
          <text x={pad.left - 6} y={threshY + 4} textAnchor="end"
            fontSize={11} fill="#9ca3af" fontWeight="600">
            {ACCURACY_LINE}%
          </text>

          {/* Axis labels */}
          <text x={pad.left + plotW / 2} y={H - 6} textAnchor="middle"
            fontSize={12} fill="#636E72" fontWeight="500">
            ← Faster — Seconds per question — Slower →
          </text>
          <text x={14} y={pad.top + plotH / 2} textAnchor="middle"
            fontSize={12} fill="#636E72" fontWeight="500"
            transform={`rotate(-90, 14, ${pad.top + plotH / 2})`}>
            Accuracy %
          </text>

          {/* Y-axis ticks */}
          {[minAcc, ACCURACY_LINE, maxAcc].filter((v, i, a) => a.indexOf(v) === i).map(acc => (
            <g key={`ya-${acc}`}>
              <line x1={pad.left - 4} y1={yScale(acc)} x2={pad.left} y2={yScale(acc)} stroke="#d1d5db" />
              {acc !== ACCURACY_LINE && (
                <text x={pad.left - 7} y={yScale(acc) + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{acc}%</text>
              )}
            </g>
          ))}

          {/* X-axis ticks */}
          {[minSpeed, maxSpeed].map(secs => (
            <g key={`xa-${secs}`}>
              <line x1={xScale(secs)} y1={pad.top + plotH} x2={xScale(secs)} y2={pad.top + plotH + 4} stroke="#d1d5db" />
              <text x={xScale(secs)} y={pad.top + plotH + 16} textAnchor="middle" fontSize={11} fill="#9ca3af">{secs}s</text>
            </g>
          ))}

          {/* Topic dots */}
          {topics.map((t, i) => {
            const cx = xScale(t.avgSecs);
            const cy = yScale(t.accuracy);
            const opacity = t.isStale ? 0.35 : 1;
            const label = t.name.length > 18 ? t.name.slice(0, 16) + '…' : t.name;
            // Place label below dot when near top of chart, above when near bottom
            const labelAbove = cy > pad.top + plotH * 0.35;
            const ly = labelAbove ? cy - 14 : cy + 20;
            return (
              <g key={t.topicKey} opacity={opacity}>
                <circle cx={cx} cy={cy} r={8} fill={colour} stroke="white" strokeWidth={2} />
                <text x={cx} y={ly} textAnchor="middle"
                  fontSize={11} fontWeight="600" fill="#374151">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3 text-xs text-[#9ca3af]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: colour }} /> Topic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full opacity-35" style={{ background: colour }} /> Not practised recently
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 border-t-2 border-dashed border-gray-300" /> GL exam pace
        </span>
      </div>
    </div>
  );
}

export default SpeedAccuracyQuadrant;

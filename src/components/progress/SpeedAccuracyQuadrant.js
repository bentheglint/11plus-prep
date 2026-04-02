import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { topicNames } from '../RecommendationCard';

/**
 * Resolve overlapping labels by nudging them apart vertically.
 * Dots never move — only the text labels shift. Returns labels
 * with final (lx, ly) positions and whether a leader line is needed.
 */
function resolveLabels(labels, plotBounds) {
  // Approximate text dimensions: ~6px per char width, 14px height
  const CHAR_W = 6;
  const LABEL_H = 14;
  const LABEL_PAD = 3;
  const DOT_PROXIMITY = 50; // px — dots closer than this are "clustered"

  // Calculate bounding boxes
  const items = labels.map(l => {
    const textW = l.text.length * CHAR_W;
    return {
      ...l,
      width: textW,
      height: LABEL_H,
      origLx: l.lx,
      origLy: l.ly,
      left: l.lx - textW / 2,
      right: l.lx + textW / 2,
      top: l.ly - LABEL_H,
      bottom: l.ly,
    };
  });

  // Fan out horizontally: for dots that are close together, alternate
  // labels left and right so leader lines don't overlap
  items.sort((a, b) => a.cx - b.cx);
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const dx = Math.abs(items[i].cx - items[j].cx);
      const dy = Math.abs(items[i].cy - items[j].cy);
      if (dx < DOT_PROXIMITY && dy < DOT_PROXIMITY) {
        // Dots are clustered — offset labels in opposite horizontal directions
        const fanOffset = 40;
        // Left dot gets label to the left, right dot to the right
        if (items[i].cx <= items[j].cx) {
          if (items[i].lx === items[i].origLx) {
            items[i].lx -= fanOffset;
            items[i].left -= fanOffset;
            items[i].right -= fanOffset;
          }
          if (items[j].lx === items[j].origLx) {
            items[j].lx += fanOffset;
            items[j].left += fanOffset;
            items[j].right += fanOffset;
          }
        }
      }
    }
  }

  // Clamp labels horizontally within plot bounds
  items.forEach(item => {
    if (item.left < plotBounds.left) {
      const shift = plotBounds.left - item.left;
      item.lx += shift;
      item.left += shift;
      item.right += shift;
    }
    if (item.right > plotBounds.right) {
      const shift = item.right - plotBounds.right;
      item.lx -= shift;
      item.left -= shift;
      item.right -= shift;
    }
  });

  // Sort by Y for vertical de-collision
  items.sort((a, b) => a.ly - b.ly);

  // Push overlapping labels apart vertically
  for (let pass = 0; pass < 5; pass++) {
    let moved = false;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        if (a.right < b.left || b.right < a.left) continue;
        const overlapY = (a.bottom + LABEL_PAD) - b.top;
        if (overlapY > 0) {
          const shift = Math.ceil(overlapY / 2);
          a.ly -= shift;
          a.top -= shift;
          a.bottom -= shift;
          b.ly += shift;
          b.top += shift;
          b.bottom += shift;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // Clamp labels vertically within plot bounds
  items.forEach(item => {
    if (item.top < plotBounds.top) {
      const shift = plotBounds.top - item.top;
      item.ly += shift;
      item.top += shift;
      item.bottom += shift;
    }
    if (item.bottom > plotBounds.bottom) {
      const shift = item.bottom - plotBounds.bottom;
      item.ly -= shift;
      item.top -= shift;
      item.bottom -= shift;
    }
  });

  return items;
}

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

          {/* Topic dots + collision-resolved labels */}
          {(() => {
            // Build initial label positions
            const rawLabels = topics.map(t => {
              const cx = xScale(t.avgSecs);
              const cy = yScale(t.accuracy);
              const text = t.name.length > 18 ? t.name.slice(0, 16) + '…' : t.name;
              const labelAbove = cy > pad.top + plotH * 0.35;
              const ly = labelAbove ? cy - 14 : cy + 20;
              return { topicKey: t.topicKey, cx, cy, lx: cx, ly, text, opacity: t.isStale ? 0.35 : 1 };
            });

            const resolved = resolveLabels(rawLabels, {
              top: pad.top + 4,
              bottom: pad.top + plotH - 4,
              left: pad.left + 4,
              right: pad.left + plotW - 4,
            });

            // Render leader lines first (behind dots), then dots, then labels
            return (
              <>
                {/* Leader lines — always drawn, subject colour */}
                {resolved.map(l => (
                  <line key={`lead-${l.topicKey}`} x1={l.cx} y1={l.cy}
                    x2={l.lx} y2={l.ly < l.cy ? l.ly + 2 : l.ly - 12}
                    stroke={colour} strokeWidth={1} opacity={l.opacity * 0.4} />
                ))}
                {/* Dots — always at true data position */}
                {resolved.map(l => (
                  <circle key={`dot-${l.topicKey}`} cx={l.cx} cy={l.cy}
                    r={8} fill={colour} stroke="white" strokeWidth={2}
                    opacity={l.opacity} />
                ))}
                {/* Labels — may be nudged to avoid overlaps */}
                {resolved.map(l => (
                  <text key={`lbl-${l.topicKey}`} x={l.lx} y={l.ly}
                    textAnchor="middle" fontSize={11} fontWeight="600"
                    fill="#374151" opacity={l.opacity}>
                    {l.text}
                  </text>
                ))}
              </>
            );
          })()}
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

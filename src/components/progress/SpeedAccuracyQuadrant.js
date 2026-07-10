import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { topicNames } from '../RecommendationCard';

/**
 * Resolve overlapping labels by nudging them apart vertically.
 * Dots never move — only the text labels shift. Returns labels
 * with final (lx, ly) positions and whether a leader line is needed.
 */
/**
 * 8-position greedy label placement with iterative refinement.
 * Avoids label-label AND label-dot overlaps.
 *
 * @param {Array} labels — [{topicKey, cx, cy, lx, ly, text, opacity}]
 * @param {Array} dots   — [{cx, cy}] all dot positions (for label-dot collision)
 * @param {Object} plotBounds — {top, bottom, left, right}
 */
function resolveLabels(labels, dots, plotBounds) {
  const CHAR_W = 5.5;
  const LABEL_H = 14;
  const LABEL_PAD = 4;
  const DOT_R = 10; // dot radius + small buffer

  // Helper: compute bounding box for a label at (lx, ly) with given anchor
  const bbox = (lx, ly, textW, anchor) => {
    const left = anchor === 'start' ? lx : anchor === 'end' ? lx - textW : lx - textW / 2;
    return { left, right: left + textW, top: ly - LABEL_H, bottom: ly };
  };

  // Helper: area of overlap between two rects
  const rectOverlap = (a, b) => {
    const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return ox * oy;
  };

  // Helper: does rect overlap a circle at (cx, cy) with radius r?
  const rectCircleOverlap = (rect, cx, cy, r) => {
    const nearX = Math.max(rect.left, Math.min(cx, rect.right));
    const nearY = Math.max(rect.top, Math.min(cy, rect.bottom));
    return (nearX - cx) ** 2 + (nearY - cy) ** 2 < r * r;
  };

  // Helper: how far outside bounds is this rect?
  const outOfBounds = (rect) => {
    let penalty = 0;
    if (rect.left < plotBounds.left) penalty += plotBounds.left - rect.left;
    if (rect.right > plotBounds.right) penalty += rect.right - plotBounds.right;
    if (rect.top < plotBounds.top) penalty += plotBounds.top - rect.top;
    if (rect.bottom > plotBounds.bottom) penalty += rect.bottom - plotBounds.bottom;
    return penalty;
  };

  // Build items with text width
  const items = labels.map(l => {
    const textW = l.text.length * CHAR_W;
    return { ...l, textW };
  });

  // Sort by density (most crowded dots first — hardest to place)
  items.sort((a, b) => {
    const densityA = dots.filter(d => Math.hypot(d.cx - a.cx, d.cy - a.cy) < 50).length;
    const densityB = dots.filter(d => Math.hypot(d.cx - b.cx, d.cy - b.cy) < 50).length;
    return densityB - densityA || a.topicKey.localeCompare(b.topicKey);
  });

  // 8 candidate positions around each dot
  const candidates = (cx, cy, textW) => [
    { lx: cx + 14, ly: cy + 4,   anchor: 'start', name: 'E'  },  // right (preferred)
    { lx: cx - 14, ly: cy + 4,   anchor: 'end',   name: 'W'  },  // left
    { lx: cx,      ly: cy - 16,  anchor: 'middle', name: 'N'  },  // above
    { lx: cx,      ly: cy + 20,  anchor: 'middle', name: 'S'  },  // below
    { lx: cx + 14, ly: cy - 12,  anchor: 'start', name: 'NE' },
    { lx: cx - 14, ly: cy - 12,  anchor: 'end',   name: 'NW' },
    { lx: cx + 14, ly: cy + 18,  anchor: 'start', name: 'SE' },
    { lx: cx - 14, ly: cy + 18,  anchor: 'end',   name: 'SW' },
  ];

  // Phase 1: Greedy placement
  const placed = []; // [{left, right, top, bottom, ...}]

  items.forEach(item => {
    const cands = candidates(item.cx, item.cy, item.textW);
    let bestScore = Infinity;
    let bestCand = cands[0];
    let bestBox = bbox(cands[0].lx, cands[0].ly, item.textW, cands[0].anchor);

    cands.forEach(c => {
      const box = bbox(c.lx, c.ly, item.textW, c.anchor);
      let score = 0;

      // Penalty: overlap with already-placed labels
      placed.forEach(p => {
        score += rectOverlap(box, p) * 100;
      });

      // Penalty: overlap with any dot — very high to make this effectively impossible
      dots.forEach(d => {
        if (rectCircleOverlap(box, d.cx, d.cy, DOT_R)) score += 100000;
      });

      // Penalty: outside plot bounds
      score += outOfBounds(box) * 50;

      // Penalty: distance from dot (prefer close labels)
      score += Math.hypot(c.lx - item.cx, c.ly - item.cy) * 0.5;

      // Bonus: prefer E/W (horizontal = easier to read)
      if (c.name === 'E' || c.name === 'W') score -= 15;

      if (score < bestScore) {
        bestScore = score;
        bestCand = c;
        bestBox = box;
      }
    });

    item.lx = bestCand.lx;
    item.ly = bestCand.ly;
    item.anchor = bestCand.anchor;
    item.left = bestBox.left;
    item.right = bestBox.right;
    item.top = bestBox.top;
    item.bottom = bestBox.bottom;
    placed.push({ left: bestBox.left - LABEL_PAD, right: bestBox.right + LABEL_PAD,
                  top: bestBox.top - LABEL_PAD, bottom: bestBox.bottom + LABEL_PAD });
  });

  // Phase 2: Iterative refinement — push remaining overlaps apart in X and Y
  for (let pass = 0; pass < 30; pass++) {
    let moved = false;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        const ox = Math.max(0, Math.min(a.right + LABEL_PAD, b.right + LABEL_PAD) - Math.max(a.left - LABEL_PAD, b.left - LABEL_PAD));
        const oy = Math.max(0, Math.min(a.bottom + LABEL_PAD, b.bottom + LABEL_PAD) - Math.max(a.top - LABEL_PAD, b.top - LABEL_PAD));
        if (ox > 0 && oy > 0) {
          // Push apart along the axis with less overlap (smaller displacement needed)
          if (ox < oy) {
            const shift = Math.ceil(ox / 2) + 1;
            const dir = a.lx < b.lx ? -1 : 1;
            a.lx += dir * shift; a.left += dir * shift; a.right += dir * shift;
            b.lx -= dir * shift; b.left -= dir * shift; b.right -= dir * shift;
          } else {
            const shift = Math.ceil(oy / 2) + 1;
            const dir = a.ly < b.ly ? -1 : 1;
            a.ly += dir * shift; a.top += dir * shift; a.bottom += dir * shift;
            b.ly -= dir * shift; b.top -= dir * shift; b.bottom -= dir * shift;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;

    // Push labels away from any dot they overlap
    items.forEach(item => {
      dots.forEach(d => {
        if (rectCircleOverlap(item, d.cx, d.cy, DOT_R)) {
          // Push label away from the dot
          const dx = item.lx - d.cx;
          const dy = item.ly - d.cy;
          const dist = Math.hypot(dx, dy) || 1;
          const pushDist = DOT_R + 4;
          item.lx += (dx / dist) * pushDist;
          item.ly += (dy / dist) * pushDist;
          item.left = item.anchor === 'start' ? item.lx : item.anchor === 'end' ? item.lx - item.textW : item.lx - item.textW / 2;
          item.right = item.left + item.textW;
          item.top = item.ly - LABEL_H;
          item.bottom = item.ly;
          moved = true;
        }
      });
    });

    // Clamp to bounds after each pass
    items.forEach(item => {
      if (item.left < plotBounds.left) {
        const s = plotBounds.left - item.left;
        item.lx += s; item.left += s; item.right += s;
      }
      if (item.right > plotBounds.right) {
        const s = item.right - plotBounds.right;
        item.lx -= s; item.left -= s; item.right -= s;
      }
      if (item.top < plotBounds.top - 8) {
        const s = (plotBounds.top - 8) - item.top;
        item.ly += s; item.top += s; item.bottom += s;
      }
      if (item.bottom > plotBounds.bottom + 8) {
        const s = item.bottom - (plotBounds.bottom + 8);
        item.ly -= s; item.top -= s; item.bottom -= s;
      }
    });
  }

  return items;
}

const subjectConfig = {
  maths: { name: 'Maths', colour: '#3B82F6', speedTarget: 60 },
  english: { name: 'English', colour: '#22C55E', speedTarget: 55 },
  verbalreasoning: { name: 'Verbal Reasoning', colour: '#7C3AED', speedTarget: 37.5 },
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
        <Target className="w-5 h-5 text-[#7C3AED]" />
        <h3 className="font-heading font-bold text-slate-800">Accuracy vs Speed</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        How each topic compares on accuracy and speed against exam pace targets
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
  // SVG dimensions — increase height for dense charts (11+ topics)
  const W = 520, H = topics.length > 10 ? 480 : 400;
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
    { x: pad.left, y: pad.top, w: threshX - pad.left, h: threshY - pad.top, fill: '#22C55E08', label: 'Exam Ready', lx: pad.left + 8, ly: pad.top + 18 },
    { x: threshX, y: pad.top, w: pad.left + plotW - threshX, h: threshY - pad.top, fill: '#3B82F608', label: 'Build Speed', lx: pad.left + plotW - 8, ly: pad.top + 18, anchor: 'end' },
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
            Target: {speedTarget}s
          </text>
          <text x={pad.left - 6} y={threshY + 4} textAnchor="end"
            fontSize={11} fill="#9ca3af" fontWeight="600">
            {ACCURACY_LINE}%
          </text>

          {/* Axis labels */}
          <text x={pad.left + plotW / 2} y={H - 6} textAnchor="middle"
            fontSize={12} fill="#64748B" fontWeight="500">
            ← Faster · Seconds per question · Slower →
          </text>
          <text x={14} y={pad.top + plotH / 2} textAnchor="middle"
            fontSize={12} fill="#64748B" fontWeight="500"
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
            const allDots = topics.map(t => ({
              cx: xScale(t.avgSecs),
              cy: yScale(t.accuracy),
            }));
            const rawLabels = topics.map(t => {
              const cx = xScale(t.avgSecs);
              const cy = yScale(t.accuracy);
              const text = t.name.length > 18 ? t.name.slice(0, 16) + '…' : t.name;
              return { topicKey: t.topicKey, cx, cy, lx: cx, ly: cy - 14, text, opacity: t.isStale ? 0.35 : 1 };
            });

            const resolved = resolveLabels(rawLabels, allDots, {
              top: pad.top + 4,
              bottom: pad.top + plotH - 4,
              left: pad.left + 4,
              right: pad.left + plotW - 4,
            });

            // Render leader lines first (behind dots), then dots, then labels
            return (
              <>
                {/* Leader lines — connect dot to nearest point on label */}
                {resolved.map(l => {
                  // Find the nearest point on the label bounding box to the dot centre
                  const nearX = Math.max(l.left || l.lx, Math.min(l.cx, l.right || l.lx));
                  const nearY = Math.max(l.top || l.ly - 14, Math.min(l.cy, l.bottom || l.ly));
                  const dist = Math.hypot(nearX - l.cx, nearY - l.cy);
                  if (dist < 12) return null; // label is adjacent to dot, no line needed
                  return (
                    <line key={`lead-${l.topicKey}`} x1={l.cx} y1={l.cy}
                      x2={nearX} y2={nearY}
                      stroke={colour} strokeWidth={1} opacity={l.opacity * 0.4} />
                  );
                })}
                {/* Dots — always at true data position */}
                {resolved.map(l => (
                  <circle key={`dot-${l.topicKey}`} cx={l.cx} cy={l.cy}
                    r={8} fill={colour} stroke="white" strokeWidth={2}
                    opacity={l.opacity} />
                ))}
                {/* Labels — positioned to avoid overlaps */}
                {resolved.map(l => (
                  <text key={`lbl-${l.topicKey}`} x={l.lx} y={l.ly}
                    textAnchor={l.anchor || "middle"} fontSize={11} fontWeight="600"
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
          <span className="inline-block w-5 border-t-2 border-dashed border-gray-300" /> Target pace
        </span>
      </div>
    </div>
  );
}

export default SpeedAccuracyQuadrant;

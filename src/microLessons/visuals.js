import React, { useState, useRef, useCallback } from 'react';

// ============================================================
// safeLabelPosition — Collision-avoidant SVG label placement
// ============================================================
// Shared utility for all SVG components. Prevents label overlaps
// by nudging labels away from each other and keeping them within
// the viewBox bounds.
//
// Usage pattern:
//   const registry = [];  // create once per SVG render
//   const pos1 = safeLabelPosition(x1, y1, "8 cm", registry, { w: 400, h: 280 });
//   const pos2 = safeLabelPosition(x2, y2, "5 cm", registry, { w: 400, h: 280 });
//   // Use pos1.x, pos1.y, pos1.fontSize for <text> placement
//
// Parameters:
//   x, y        — desired label centre position
//   text        — label string (used to estimate width)
//   registry    — mutable array of previously placed labels (mutated in-place)
//   viewBox     — { w, h } dimensions of the SVG viewBox
//   options:
//     fontSize   — base font size (default 17)
//     charWidth  — estimated width per character (default 9.5)
//     anchor     — text-anchor: "middle" | "start" | "end" (default "middle")
//     rotation   — degrees of rotation (default 0) — for axis-aligned BB
//     padding    — minimum gap between labels in px (default 4)
//     axis       — preferred nudge direction: "x" | "y" | "auto" (default "auto")
//     constraint — { xMin, xMax, yMin, yMax } hard bounds for this label
//     allowShrink — if true, reduce fontSize as last resort (default false)
//     margin     — viewBox edge margin in px (default 4)
//
// Returns: { x, y, fontSize, truncated: false }

export function safeLabelPosition(x, y, text, registry, viewBox, options = {}) {
  const {
    fontSize: baseFontSize = 17,
    charWidth = 9.5,
    anchor = "middle",
    rotation = 0,
    padding = 4,
    axis = "auto",
    constraint = null,
    allowShrink = false,
    margin = 4,
  } = options;

  let currentFontSize = baseFontSize;
  const textStr = String(text || "");

  // Estimate bounding box dimensions from text length
  function estimateBBox(fs) {
    const rawW = textStr.length * charWidth * (fs / 17);
    const rawH = fs * 1.3;

    // Handle rotation: compute axis-aligned bounding box
    if (rotation !== 0) {
      const rad = (Math.abs(rotation) * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return {
        w: rawW * cos + rawH * sin,
        h: rawW * sin + rawH * cos,
      };
    }
    return { w: rawW, h: rawH };
  }

  // Check if two rectangles overlap (with padding)
  function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
    const halfAW = aw / 2 + padding;
    const halfAH = ah / 2 + padding;
    const halfBW = bw / 2 + padding;
    const halfBH = bh / 2 + padding;
    return (
      Math.abs(ax - bx) < halfAW + halfBW &&
      Math.abs(ay - by) < halfAH + halfBH
    );
  }

  // Check if position is within viewBox bounds (and constraints)
  function inBounds(px, py, pw, ph) {
    const halfW = pw / 2;
    const halfH = ph / 2;
    if (px - halfW < margin || px + halfW > viewBox.w - margin) return false;
    if (py - halfH < margin || py + halfH > viewBox.h - margin) return false;
    if (constraint) {
      if (constraint.xMin != null && px - halfW < constraint.xMin) return false;
      if (constraint.xMax != null && px + halfW > constraint.xMax) return false;
      if (constraint.yMin != null && py - halfH < constraint.yMin) return false;
      if (constraint.yMax != null && py + halfH > constraint.yMax) return false;
    }
    return true;
  }

  // Check if position has any overlap with registry
  function hasOverlap(px, py, pw, ph) {
    for (const label of registry) {
      if (overlaps(px, py, pw, ph, label.x, label.y, label.w, label.h)) {
        return true;
      }
    }
    return false;
  }

  // Try to place at a given position
  function tryPlace(px, py, fs) {
    const bb = estimateBBox(fs);
    if (!inBounds(px, py, bb.w, bb.h)) return null;
    if (!hasOverlap(px, py, bb.w, bb.h)) return { x: px, y: py, w: bb.w, h: bb.h, fontSize: fs };
    return null;
  }

  // Nudge offsets: cardinal directions first, then diagonals
  const nudgeStep = 12;
  const cardinalNudges = [
    [0, -nudgeStep], [0, nudgeStep],     // up, down
    [-nudgeStep, 0], [nudgeStep, 0],     // left, right
  ];
  const diagonalNudges = [
    [-nudgeStep, -nudgeStep], [nudgeStep, -nudgeStep],
    [-nudgeStep, nudgeStep], [nudgeStep, nudgeStep],
  ];

  // Filter nudges by preferred axis
  function getNudges() {
    if (axis === "x") return [[- nudgeStep, 0], [nudgeStep, 0], ...diagonalNudges];
    if (axis === "y") return [[0, -nudgeStep], [0, nudgeStep], ...diagonalNudges];
    return [...cardinalNudges, ...diagonalNudges];
  }

  // Attempt placement with increasing effort
  function attempt(fs) {
    // 1. Try original position
    const direct = tryPlace(x, y, fs);
    if (direct) return direct;

    // 2. Try nudges at 1x, 2x, 3x distance
    const nudges = getNudges();
    for (let mult = 1; mult <= 3; mult++) {
      for (const [dx, dy] of nudges) {
        const result = tryPlace(x + dx * mult, y + dy * mult, fs);
        if (result) return result;
      }
    }
    return null;
  }

  // Try at base font size
  let result = attempt(currentFontSize);

  // If failed and shrinking allowed, try smaller sizes
  if (!result && allowShrink) {
    for (let shrink = 2; shrink <= 6; shrink += 2) {
      const smallerFS = Math.max(10, currentFontSize - shrink);
      result = attempt(smallerFS);
      if (result) break;
    }
  }

  // Last resort: place at original position anyway (don't block rendering)
  if (!result) {
    const bb = estimateBBox(currentFontSize);
    result = { x, y, w: bb.w, h: bb.h, fontSize: currentFontSize };
  }

  // Register the placed label
  registry.push({ x: result.x, y: result.y, w: result.w, h: result.h });

  return {
    x: result.x,
    y: result.y,
    fontSize: result.fontSize,
    truncated: false,
  };
}


// ============================================================
// GridModel — Multiplication grid/box method table
// ============================================================
// Renders a multiplication grid showing partial products.
// Used for long multiplication (partitioning/grid method).
//
// Props:
//   rows, cols       — grid dimensions (typically 2x2)
//   headers          — { cols: [20, 7], rows: [30, 4] }
//   cells            — 2D array of values or "?" strings
//   showValues       — whether to show cell values
//   revealStepByStep — if true, cells start hidden and reveal on tap
//   revealedCells    — array of [row, col] pairs that have been revealed
//   onCellReveal     — callback when a cell is tapped: ([row, col]) => void
//   totalLabel       — optional label for the total row
//   showTotal        — whether to show the sum row
//   highlightTotal   — whether to emphasise the total
//   generic          — if true, shows placeholder text instead of numbers

export function GridModel({
  rows = 2,
  cols = 2,
  headers = { cols: [], rows: [] },
  cells = [],
  showValues = true,
  revealStepByStep = false,
  revealedCells = [],
  onCellReveal,
  totalLabel,
  showTotal = false,
  highlightTotal = false,
  generic = false
}) {
  const isRevealed = (r, c) => {
    if (!revealStepByStep || showValues) return true;
    return revealedCells.some(([rr, cc]) => rr === r && cc === c);
  };

  // Find the next cell to reveal (left-to-right, top-to-bottom)
  const getNextCell = () => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!isRevealed(r, c)) return [r, c];
      }
    }
    return null;
  };

  const allRevealed = !getNextCell();

  // Calculate total if needed
  const total = cells.flat().reduce((sum, val) => {
    const num = typeof val === 'number' ? val : 0;
    return sum + num;
  }, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block rounded-xl overflow-hidden border-2 border-[#A29BFE]/40 shadow-md">
        <table className="border-collapse">
          <thead>
            <tr>
              {/* Top-left corner: multiplication sign */}
              <th className="bg-[#EDE8FF] border-2 border-[#A29BFE]/40 px-4 py-3 text-lg font-bold text-[#6C5CE7]">
                ×
              </th>
              {headers.cols.map((h, i) => (
                <th key={i} className="bg-[#EDE8FF] border-2 border-[#A29BFE]/40 px-5 py-3 text-lg font-bold text-[#2D3436] min-w-[70px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {/* Row header */}
                <td className="bg-[#EDE8FF] border-2 border-[#A29BFE]/40 px-5 py-3 text-lg font-bold text-[#2D3436]">
                  {headers.rows[r]}
                </td>
                {/* Value cells */}
                {Array.from({ length: cols }).map((_, c) => {
                  const revealed = isRevealed(r, c);
                  const cellValue = cells[r]?.[c];
                  const nextCell = getNextCell();
                  const isNext = nextCell && nextCell[0] === r && nextCell[1] === c;

                  return (
                    <td
                      key={c}
                      className={`border-2 border-[#A29BFE]/40 px-5 py-3 text-center text-lg min-w-[70px] transition-all duration-300 ${
                        revealed
                          ? 'bg-white text-gray-900 font-semibold'
                          : isNext && revealStepByStep
                          ? 'bg-[#EDE8FF]/50 cursor-pointer hover:bg-[#EDE8FF]'
                          : 'bg-gray-50'
                      }`}
                      onClick={() => {
                        if (!revealed && isNext && revealStepByStep && onCellReveal) {
                          onCellReveal([r, c]);
                        }
                      }}
                    >
                      {revealed ? (
                        <span className={generic ? 'text-[#A29BFE]' : ''}>
                          {generic ? '...' : cellValue}
                        </span>
                      ) : isNext && revealStepByStep ? (
                        <span className="text-[#6C5CE7] font-bold text-xl" style={{ cursor: 'pointer' }}>?</span>
                      ) : (
                        <span className="text-gray-300">?</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total row */}
      {(showTotal || highlightTotal) && allRevealed && (
        <div className={`mt-3 px-6 py-3 rounded-xl text-center text-lg font-bold ${
          highlightTotal
            ? 'bg-green-50 border-2 border-green-400 text-green-800'
            : 'bg-[#EDE8FF]/50 text-[#5A4BD1]'
        }`}>
          {totalLabel || `${cells.flat().filter(v => typeof v === 'number').join(' + ')} = ${total}`}
        </div>
      )}
    </div>
  );
}


// ============================================================
// WorkedExample — Step-by-step method with tap-to-reveal
// ============================================================
// Renders a vertical list of steps. Steps beyond revealedCount
// are hidden. Tap reveals the next step.
//
// Props:
//   steps           — array of { label, text, why, result }
//   revealedCount   — number of steps currently visible
//   onRevealNext    — callback to reveal the next step
//   allRevealed     — optional override: show all steps

export function WorkedExample({
  steps = [],
  revealedCount = 0,
  onRevealNext,
  allRevealed = false
}) {
  const visibleCount = allRevealed ? steps.length : revealedCount;
  const hasMore = visibleCount < steps.length;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        if (i >= visibleCount && !allRevealed) return null;

        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-white border-2 border-[#EDE8FF] transition-all duration-300"
            style={{ animation: i === visibleCount - 1 && !allRevealed ? 'fadeIn 0.3s ease-in' : 'none' }}
          >
            {/* Step number circle */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center font-bold text-sm">
              {i + 1}
            </div>
            <div className="flex-1">
              {/* Main step text */}
              <p className="text-gray-900 font-medium text-base">
                {step.text}
              </p>
              {/* WHY explanation */}
              {step.why && (
                <p className="text-[#6C5CE7] text-sm mt-1 italic">
                  {step.why}
                </p>
              )}
              {/* Result/calculation */}
              {step.result && (
                <p className="text-green-700 font-bold text-base mt-1">
                  {step.result}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Tap to reveal next step */}
      {hasMore && !allRevealed && (
        <button
          onClick={onRevealNext}
          className="w-full p-3 rounded-xl border-2 border-dashed border-[#A29BFE] text-[#6C5CE7] font-medium hover:bg-[#EDE8FF]/50 hover:border-[#6C5CE7] transition-all text-base"
        >
          Show step {visibleCount + 1}...
        </button>
      )}

      {/* All steps revealed indicator — only after user tapped through */}
      {!hasMore && steps.length > 0 && !allRevealed && (
        <div className="text-center text-green-600 font-medium text-sm mt-1">
          All steps shown!
        </div>
      )}
    </div>
  );
}


// ============================================================
// NumberLine — SVG number line with points, jumps, and ticks
// ============================================================
// Props:
//   min, max         — range of the number line
//   points           — array of { value, label, color }
//   jumps            — array of { from, to, label } (arcs above the line)
//   tickInterval     — spacing between tick marks
//   showLabels       — whether to show tick labels
//   highlight        — optional [start, end] range to highlight

export function NumberLine({
  min = 0,
  max = 10,
  points = [],
  jumps = [],
  tickInterval = 1,
  showLabels = true,
  highlight = null
}) {
  // Fixed dimensions — identical for every NumberLine instance
  const width = 560;
  const height = 170;
  const lineY = 100;
  const padding = 50;
  const lineWidth = width - 2 * padding;
  const toX = (value) => padding + ((value - min) / (max - min)) * lineWidth;

  // Adaptive font size based on tick density
  const tickCount = Math.round((max - min) / tickInterval) + 1;
  const tickFontSize = tickCount > 20 ? 18 : tickCount > 12 ? 22 : 26;
  const labelFontSize = tickCount > 20 ? 20 : 26;
  const showPointLabels = jumps.length === 0;

  // Cap arc heights to fit within the fixed frame
  const maxArcHeight = lineY - 22 - labelFontSize - 8;

  // Generate tick positions
  const ticks = [];
  for (let v = min; v <= max; v += tickInterval) {
    ticks.push(Math.round(v * 1000) / 1000);
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full block">
        <defs>
          <marker id="nl-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#5A4BD1" />
          </marker>
        </defs>

        {/* Highlight range */}
        {highlight && (
          <rect
            x={toX(highlight[0])}
            y={lineY - 28}
            width={toX(highlight[1]) - toX(highlight[0])}
            height={56}
            fill="#ede9fe"
            rx={8}
          />
        )}

        {/* Main line */}
        <line x1={padding - 5} y1={lineY} x2={width - padding + 5} y2={lineY}
              stroke="#6C5CE7" strokeWidth={4} strokeLinecap="round" />

        {/* Tick marks */}
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={toX(v)} y1={lineY - 18} x2={toX(v)} y2={lineY + 18}
                  stroke="#6C5CE7" strokeWidth={3} />
            {showLabels && (
              <text x={toX(v)} y={lineY + 48} textAnchor="middle"
                    fill="#374151" fontSize={tickFontSize} fontWeight="600">
                {v}
              </text>
            )}
          </g>
        ))}

        {/* Jumps (arcs above the line) */}
        {jumps.map((jump, i) => {
          const x1 = toX(jump.from);
          const x2 = toX(jump.to);
          const midX = (x1 + x2) / 2;
          const arcHeight = Math.min(maxArcHeight, Math.abs(x2 - x1) * 0.5);
          return (
            <g key={`jump-${i}`}>
              <path
                d={`M ${x1} ${lineY - 22} Q ${midX} ${lineY - 22 - arcHeight} ${x2} ${lineY - 22}`}
                fill="none"
                stroke="#5A4BD1"
                strokeWidth={3.5}
                markerEnd="url(#nl-arrow)"
              />
              {jump.label && (
                <text x={midX} y={lineY - 30 - arcHeight} textAnchor="middle"
                      fill="#6C5CE7" fontSize={labelFontSize} fontWeight="bold">
                  {jump.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Points — coloured circles on the line; labels at consistent height */}
        {(() => {
          // Calculate label positions — all at same baseline unless genuinely overlapping
          const sorted = points.map((pt, i) => ({ ...pt, idx: i, x: toX(pt.value) }))
            .sort((a, b) => a.x - b.x);
          const labelY = {};
          sorted.forEach((pt, i) => {
            let y = lineY - 34;
            // Only stagger if the PREVIOUS sorted point's label is too close
            if (i > 0) {
              const prevPt = sorted[i - 1];
              const prevLabelY = labelY[prevPt.idx];
              if (Math.abs(pt.x - prevPt.x) < 50 && prevLabelY === lineY - 34) {
                y = lineY - 58;
              }
            }
            labelY[pt.idx] = y;
          });
          const labelPositions = points.map((pt, i) => ({
            x: toX(pt.value),
            y: labelY[i] || lineY - 34
          }));
          return points.map((pt, i) => (
            <g key={`pt-${i}`}>
              <circle cx={toX(pt.value)} cy={lineY} r={16}
                      fill={pt.color || "#5A4BD1"} stroke="white" strokeWidth={3} />
              {showPointLabels && pt.label && (
                <text x={labelPositions[i].x} y={labelPositions[i].y} textAnchor="middle"
                      fill={pt.color || "#6C5CE7"} fontSize={labelFontSize} fontWeight="bold">
                  {pt.label}
                </text>
              )}
            </g>
          ));
        })()}
      </svg>
    </div>
  );
}


// ============================================================
// BarModel — Proportional bar segments
// ============================================================
// Props:
//   segments         — array of { value, label, color, empty }
//   totalLabel       — optional text below the bar
//   showValues       — whether to show labels inside segments
//   comparison       — optional second array of segments (for side-by-side)
//   comparisonLabel  — label for the comparison bar

export function BarModel({
  segments = [],
  totalLabel = null,
  showValues = true,
  comparison = null,
  comparisonLabel = null
}) {
  const defaultColors = ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#f87171'];
  const emptyColor = '#e5e7eb';

  const renderBar = (segs, borderColor = 'border-[#A29BFE]/40') => {
    const total = segs.reduce((sum, s) => sum + s.value, 0);
    // Adapt minWidth and font size based on segment count to avoid overflow
    const segCount = segs.length;
    const useOverflowLabels = segCount > 12;
    const adaptiveMinWidth = segCount > 6 ? '28px' : segCount > 4 ? '38px' : '58px';
    const adaptiveFontSize = segCount > 6 ? 'text-xs' : 'text-base';

    // Collect span labels for overflow mode (labels shown above the bar)
    // Group consecutive segments with the same label into spans, tracking value-based percentages
    const spanLabels = [];
    if (useOverflowLabels && showValues) {
      let runStartValue = 0; // cumulative value at span start
      let currentLabel = null;
      let runningValue = 0;
      segs.forEach((seg, i) => {
        const label = seg.label !== undefined ? seg.label : '';
        if (label && label !== currentLabel) {
          if (currentLabel) {
            spanLabels.push({ label: currentLabel, startPct: (runStartValue / total) * 100, widthPct: ((runningValue - runStartValue) / total) * 100 });
          }
          currentLabel = label;
          runStartValue = runningValue;
        }
        runningValue += seg.value;
        if (i === segs.length - 1 && currentLabel) {
          spanLabels.push({ label: currentLabel, startPct: (runStartValue / total) * 100, widthPct: ((runningValue - runStartValue) / total) * 100 });
        }
      });
      // Fallback: if no spans found, show the count of coloured segments
      if (spanLabels.length === 0) {
        const coloredValue = segs.filter(s => !s.empty).reduce((sum, s) => sum + s.value, 0);
        const firstLabel = segs.find(s => s.label)?.label;
        if (firstLabel) {
          spanLabels.push({ label: firstLabel, startPct: 0, widthPct: (coloredValue / total) * 100 });
        }
      }
    }

    return (
      <div className={useOverflowLabels ? 'pt-7' : ''}>
        <div className="relative">
        {/* Overflow span labels above the bar */}
        {spanLabels.map((sl, i) => (
          <div key={`span-${i}`} className="absolute text-center"
               style={{ left: `${sl.startPct}%`, width: `${sl.widthPct}%`, top: '-24px' }}>
            <span className="font-bold text-xs text-[#6C5CE7] bg-white px-1 rounded">{sl.label}</span>
            <div className="mx-auto mt-0.5 border-b-2 border-[#A29BFE]" style={{ width: '80%' }} />
          </div>
        ))}
        <div className={`rounded-xl overflow-hidden border-2 ${borderColor} flex`}
             style={{ height: '96px' }}>
          {segs.map((seg, i) => {
            const widthPercent = (seg.value / total) * 100;
            const bgColor = seg.empty ? emptyColor : (seg.color || defaultColors[i % defaultColors.length]);
            const textColor = seg.empty ? '#9ca3af' : 'white';
            const showInlineLabel = showValues && !useOverflowLabels;
            return (
              <div
                key={i}
                className={`flex items-center justify-center font-bold ${adaptiveFontSize} border-r border-white/30 last:border-r-0 transition-all`}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: bgColor,
                  color: textColor,
                  textShadow: seg.empty ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
                  minWidth: showInlineLabel && seg.label ? adaptiveMinWidth : '0',
                  padding: '0 2px'
                }}
              >
                {showInlineLabel && (seg.label !== undefined ? seg.label : seg.value)}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderBar(segments, 'border-[#A29BFE]/40')}

      {totalLabel && (
        <p className="text-center text-sm font-bold text-[#6C5CE7]">{totalLabel}</p>
      )}

      {comparison && (
        <>
          {comparisonLabel && (
            <p className="text-center text-sm font-bold text-blue-700 mt-1">{comparisonLabel}</p>
          )}
          {renderBar(comparison, 'border-blue-200')}
        </>
      )}
    </div>
  );
}


// ============================================================
// PlaceValueChart — Column table for place values
// ============================================================
// Props:
//   columns          — array of column headers (e.g. ["H", "T", "O", ".", "t", "h"])
//   rows             — array of { label, values: [...] }
//   highlight        — array of [rowIdx, colIdx] pairs to highlight

export function PlaceValueChart({
  columns = [],
  rows = [],
  highlight = [],
  carries = []
}) {
  const isHighlighted = (r, c) => highlight.some(([rr, cc]) => rr === r && cc === c);
  const isDecimalPoint = (col) => col === '.' || col === '•';

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block rounded-xl overflow-hidden border-2 border-blue-200 shadow-md">
        <table className="border-collapse">
          <thead>
            <tr>
              {/* Row label header */}
              {rows.some(r => r.label) && (
                <th className="bg-blue-100 border-2 border-blue-200 px-4 py-3 text-base font-bold text-blue-900"></th>
              )}
              {columns.map((col, i) => (
                <th key={i} className={`border-2 border-blue-200 px-4 py-3 text-base font-bold ${
                  isDecimalPoint(col)
                    ? 'bg-gray-100 text-gray-400 px-2 min-w-[24px]'
                    : 'bg-blue-100 text-blue-900 min-w-[68px]'
                }`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carries.length > 0 && (
              <tr>
                {rows.some(r => r.label) && (
                  <td className="bg-white border-2 border-blue-200 p-0"></td>
                )}
                {columns.map((col, i) => {
                  const carry = carries.find(c => c.col === i);
                  return (
                    <td key={i} className="bg-white border-2 border-blue-200 px-4 py-0 text-center">
                      {carry ? (
                        <span className="text-sm font-bold text-red-500">{carry.digit}</span>
                      ) : ''}
                    </td>
                  );
                })}
              </tr>
            )}
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {/* Row label */}
                {rows.some(r => r.label) && (
                  <td className="bg-blue-50 border-2 border-blue-200 px-4 py-3 text-base font-bold text-blue-800">
                    {row.label || ''}
                  </td>
                )}
                {row.values.map((val, colIdx) => {
                  const isDot = isDecimalPoint(columns[colIdx]) || val === '.' || val === '•';
                  return (
                    <td key={colIdx} className={`border-2 border-blue-200 px-4 py-3 text-center text-xl font-semibold ${
                      isDot ? 'bg-gray-50 text-gray-400 px-1' :
                      isHighlighted(rowIdx, colIdx) ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400 ring-inset' :
                      val === '' || val === null ? 'bg-gray-50 text-gray-300' :
                      'bg-white text-gray-900'
                    }`}>
                      {val === '' || val === null ? '—' : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// ColumnMethod — Standard written column multiplication layout
// ============================================================
// Renders the formal long/short multiplication layout children
// learn in school (Year 4-6). Supports tap-to-reveal steps,
// carry digits, and error highlighting for spot-the-mistake.
//
// Props:
//   topNumber      — multiplicand (e.g. 36)
//   bottomNumber   — multiplier (e.g. 24)
//   steps          — array of { label, partial, carrying }
//                    carrying: [{ col (from right, 0=ones), digit }]
//   answer         — final answer (e.g. 864)
//   revealedStep   — how many steps to show (for tap-to-reveal)
//   onRevealNext   — callback to reveal next step
//   allRevealed    — show everything at once
//   showCarrying   — whether to show carry digits (default true)
//   highlightStep  — index of step to highlight in red (spot-the-mistake)
//   highlightAnswer — highlight answer row differently

export function ColumnMethod({
  topNumber,
  bottomNumber,
  steps = [],
  answer,
  revealedStep = 0,
  onRevealNext,
  allRevealed = false,
  showCarrying = true,
  highlightStep = null,
  highlightAnswer = false,
  highlightBottomDigit = null,
  hideAnswer = false
}) {
  const visibleSteps = allRevealed ? steps.length : Math.min(revealedStep, steps.length);
  const showAnswer = !hideAnswer && (allRevealed || visibleSteps >= steps.length) && steps.length > 1;
  const hasMore = visibleSteps < steps.length;

  // Convert number to array of digits
  const toDigits = (num) => String(Math.abs(num)).split('').map(Number);

  // Find max width needed across all numbers
  const allNumbers = [topNumber, bottomNumber, answer, ...steps.map(s => s.partial)];
  const maxWidth = Math.max(...allNumbers.map(n => String(Math.abs(n)).length));

  // Pad digit array to maxWidth (null = empty cell)
  const padDigits = (num) => {
    const digits = toDigits(num);
    while (digits.length < maxWidth) digits.unshift(null);
    return digits;
  };

  const topDigits = padDigits(topNumber);
  const bottomDigits = padDigits(bottomNumber);
  const answerDigits = padDigits(answer);
  const stepDigitArrays = steps.map(s => padDigits(s.partial));

  // Collect carry digits from the most recently revealed step
  let activeCarries = {};
  if (showCarrying && visibleSteps > 0) {
    const latestStep = steps[visibleSteps - 1];
    if (latestStep?.carrying) {
      for (const c of latestStep.carrying) {
        activeCarries[c.col] = c.digit;
      }
    }
  }

  const hasCarries = Object.keys(activeCarries).length > 0;

  // Cell size
  const cellW = 'w-10';
  const cellH = 'h-11';

  // Render a single digit cell
  const renderCell = (digit, options = {}) => {
    const { bold, color, highlight } = options;
    return (
      <div className={`${cellW} ${cellH} flex items-center justify-center text-2xl ${
        bold ? 'font-extrabold' : 'font-semibold'
      } ${color || 'text-gray-900'} ${
        highlight ? 'bg-yellow-100 rounded' : ''
      }`} style={{ fontFamily: "'Courier New', Courier, monospace" }}>
        {digit !== null ? digit : ''}
      </div>
    );
  };

  // Render a row of digits with optional prefix (× sign)
  const renderRow = (digits, options = {}) => {
    const { bold, prefix, color, highlightAll, highlightDigitFromRight } = options;
    return (
      <div className="flex items-center">
        {/* Prefix column (for × sign) */}
        <div className={`w-8 ${cellH} flex items-center justify-center text-xl font-bold text-gray-500`}
             style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          {prefix || ''}
        </div>
        {/* Digit cells */}
        {digits.map((d, i) => {
          const fromRight = digits.length - 1 - i;
          const isDigitHL = highlightDigitFromRight !== null && highlightDigitFromRight !== undefined && fromRight === highlightDigitFromRight;
          return (
            <React.Fragment key={i}>
              {renderCell(d, { bold, color: isDigitHL ? 'text-blue-700' : color, highlight: highlightAll || isDigitHL })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Render carry row
  const renderCarryRow = () => {
    if (!hasCarries) return null;
    return (
      <div className="flex items-center">
        <div className="w-8 h-5" /> {/* Prefix spacer */}
        {Array.from({ length: maxWidth }).map((_, arrayIdx) => {
          const colFromRight = maxWidth - 1 - arrayIdx;
          const carry = activeCarries[colFromRight];
          return (
            <div key={arrayIdx} className={`${cellW} h-5 flex items-center justify-center`}>
              {carry !== undefined && (
                <span className="text-xs font-bold text-orange-500"
                      style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  {carry}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render horizontal line
  const renderLine = () => (
    <div className="flex items-center">
      <div className="w-8" />
      <div className="flex-1 border-t-2 border-gray-800 my-1"
           style={{ width: `${maxWidth * 2.5}rem` }} />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block bg-white rounded-xl border-2 border-[#A29BFE]/40 shadow-md px-4 py-3">
        {/* Carry digits */}
        {renderCarryRow()}

        {/* Top number */}
        {renderRow(topDigits)}

        {/* × Bottom number */}
        {renderRow(bottomDigits, { prefix: '×', highlightDigitFromRight: highlightBottomDigit })}

        {/* First line */}
        {renderLine()}

        {/* Partial products (revealed step by step) */}
        {steps.map((step, i) => {
          if (i >= visibleSteps && !allRevealed) return null;
          const isHighlighted = highlightStep === i;
          return (
            <div key={i}>
              {renderRow(stepDigitArrays[i], {
                color: isHighlighted ? 'text-red-600' : undefined,
                highlightAll: isHighlighted
              })}
              {step.label && (
                <div className="flex items-center">
                  <div className="w-8" />
                  <div className="text-xs text-[#6C5CE7] font-medium -mt-1 mb-0.5 text-right"
                       style={{ width: `${maxWidth * 2.5}rem` }}>
                    {step.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Second line + answer (only for multi-step / long multiplication) */}
        {showAnswer && (
          <>
            {renderLine()}
            {renderRow(answerDigits, {
              bold: true,
              color: highlightAnswer ? 'text-green-700' : undefined
            })}
          </>
        )}
      </div>

      {/* Tap to reveal next step */}
      {hasMore && !allRevealed && (
        <button
          onClick={onRevealNext}
          className="mt-3 w-full p-3 rounded-xl border-2 border-dashed border-[#A29BFE] text-[#6C5CE7] font-medium hover:bg-[#EDE8FF]/50 hover:border-[#6C5CE7] transition-all text-base"
        >
          Show step {visibleSteps + 1}...
        </button>
      )}

      {/* All steps revealed */}
      {!hasMore && steps.length > 0 && !allRevealed && (
        <div className="text-center text-green-600 font-medium text-sm mt-2">
          All steps shown!
        </div>
      )}
    </div>
  );
}


// ============================================================
// AngleDiagram — Triangle with labelled angles
// ============================================================
// Draws an accurate triangle whose shape reflects the actual angles.
// Uses three layout strategies:
//   • Right-angled — 90° at bottom-left with square marker
//   • Isosceles    — unique angle at centred apex, tick marks on equal sides
//   • Scalene      — best vertex arrangement chosen automatically
// Labels placed along angle bisectors with size-proportional distance.
//
// Props:
//   angle1, angle2, angle3 — the three angle values (numbers)
//   color1, color2, color3 — colours for each angle label
//   showAngle3             — if false, angle3 label shows "?°" (default true)
//   totalLabel             — optional text shown below the diagram

export function AngleDiagram({
  angle1 = 60,
  angle2 = 60,
  angle3 = 60,
  color1 = "#818cf8",
  color2 = "#38bdf8",
  color3 = "#34d399",
  showAngle2 = true,
  showAngle3 = true,
  totalLabel = null
}) {
  const DEG = Math.PI / 180;

  // Tag each angle with its display properties
  const entries = [
    { value: angle1, color: color1, label: `${angle1}°` },
    { value: angle2, color: showAngle2 ? color2 : "#9ca3af",
      label: showAngle2 ? `${angle2}°` : "?°" },
    { value: angle3, color: showAngle3 ? color3 : "#9ca3af",
      label: showAngle3 ? `${angle3}°` : "?°" }
  ];

  const hasRight = entries.some(e => e.value === 90);
  const isIso = !hasRight &&
    (angle1 === angle2 || angle1 === angle3 || angle2 === angle3);

  // ViewBox dimensions and padding — extra top/bottom for outside labels
  const padX = 38, padTop = 50, padBot = 50;
  const vbH = 310;
  const maxW = 400 - 2 * padX;         // 324
  const maxH = vbH - padTop - padBot;  // 210
  const baseY = vbH - padBot;          // 260

  let A, B, C;
  let vertexEntries; // [entryAtA, entryAtB, entryAtC]

  if (hasRight) {
    // ── Right-angle layout: 90° at bottom-left ──
    const rightEntry = entries.find(e => e.value === 90);
    const others = entries.filter(e => e !== rightEntry);
    // Larger acute angle at bottom-right for a wider, more natural base
    const sorted = [...others].sort((a, b) => b.value - a.value);
    const cEntry = sorted[0];
    const aEntry = sorted[1];

    const ratio = Math.sin(cEntry.value * DEG) / Math.sin(aEntry.value * DEG);
    let baseLen, height;
    if (ratio > 1) { height = maxH; baseLen = height / ratio; }
    else { baseLen = maxW; height = baseLen * ratio; }
    if (baseLen > maxW) { baseLen = maxW; height = baseLen * ratio; }
    if (height > maxH) { height = maxH; baseLen = height / ratio; }

    B = { x: padX, y: baseY };
    C = { x: padX + baseLen, y: baseY };
    A = { x: padX, y: baseY - height };
    vertexEntries = [aEntry, rightEntry, cEntry];

  } else if (isIso) {
    // ── Isosceles layout: unique angle centred at apex ──
    let apexEntry, baseEntriesArr;
    if (entries[0].value === entries[1].value) {
      apexEntry = entries[2]; baseEntriesArr = [entries[0], entries[1]];
    } else if (entries[0].value === entries[2].value) {
      apexEntry = entries[1]; baseEntriesArr = [entries[0], entries[2]];
    } else {
      apexEntry = entries[0]; baseEntriesArr = [entries[1], entries[2]];
    }

    const baseAngle = baseEntriesArr[0].value;
    const AB = Math.sin(baseAngle * DEG) / (Math.sin(apexEntry.value * DEG) || 0.01);
    const uy = AB * Math.sin(baseAngle * DEG);

    const scale = Math.min(maxW, maxH / uy);
    const baseLen = scale;
    B = { x: 200 - baseLen / 2, y: baseY };
    C = { x: 200 + baseLen / 2, y: baseY };
    A = { x: 200, y: baseY - uy * scale };
    vertexEntries = [apexEntry, baseEntriesArr[0], baseEntriesArr[1]];

  } else {
    // ── Scalene/obtuse: try all 6 arrangements, pick most centred apex ──
    let best = null;
    let bestScore = Infinity;

    for (let ai = 0; ai < 3; ai++) {
      const others = [0, 1, 2].filter(i => i !== ai);
      for (let flip = 0; flip < 2; flip++) {
        const bi = flip ? others[1] : others[0];
        const ci = flip ? others[0] : others[1];
        const aA = entries[ai].value, aB = entries[bi].value, aC = entries[ci].value;
        const sinA = Math.sin(aA * DEG);
        if (sinA < 0.01) continue;
        const AB = Math.sin(aC * DEG) / sinA;
        const ux = AB * Math.cos(aB * DEG);
        const uy = AB * Math.sin(aB * DEG);
        if (uy < 0.1 || ux < -0.1 || ux > 1.1) continue;
        const score = Math.abs(ux - 0.5);
        if (score < bestScore) {
          bestScore = score;
          best = { ai, bi, ci, ux, uy };
        }
      }
    }
    if (!best) best = { ai: 0, bi: 1, ci: 2, ux: 0.5, uy: 0.5 };

    const scale = Math.min(maxW, maxH / best.uy);
    const baseLen = scale;
    B = { x: 200 - baseLen / 2, y: baseY };
    C = { x: 200 + baseLen / 2, y: baseY };
    A = { x: B.x + best.ux * scale, y: baseY - best.uy * scale };
    vertexEntries = [entries[best.ai], entries[best.bi], entries[best.ci]];
  }

  // ── Label positions: bisector direction + size-proportional distance ──
  const centroid = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
  const adjMap = [[B, C], [A, C], [A, B]];

  // Helper: shortest distance from point to line segment
  const pointToSegDist = (px, py, x1, y1, x2, y2) => {
    const dx = x2 - x1, dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * dx)) ** 2 + (py - (y1 + t * dy)) ** 2);
  };

  // Triangle edges for overlap checking
  const edges = [[A, B], [B, C], [A, C]];

  const labelPos = (vertIdx) => {
    const vertex = [A, B, C][vertIdx];
    const [adj1, adj2] = adjMap[vertIdx];
    const angleDeg = vertexEntries[vertIdx].value;

    // Bisector direction (points inward toward triangle interior)
    const d1 = { x: adj1.x - vertex.x, y: adj1.y - vertex.y };
    const d2 = { x: adj2.x - vertex.x, y: adj2.y - vertex.y };
    const len1 = Math.sqrt(d1.x ** 2 + d1.y ** 2) || 1;
    const len2 = Math.sqrt(d2.x ** 2 + d2.y ** 2) || 1;
    const bis = { x: d1.x / len1 + d2.x / len2, y: d1.y / len1 + d2.y / len2 };
    const bisLen = Math.sqrt(bis.x ** 2 + bis.y ** 2) || 1;
    let dir = { x: bis.x / bisLen, y: bis.y / bisLen };

    // Try placing inside first
    const halfRad = (angleDeg / 2) * DEG;
    const textClear = Math.min(14 / Math.max(Math.sin(halfRad), 0.13), 65);
    const dx = centroid.x - vertex.x, dy = centroid.y - vertex.y;
    const distC = Math.sqrt(dx * dx + dy * dy) || 1;
    const d = Math.min(Math.max(textClear, 0.35 * distC, 30), distC * 0.55);

    const insideX = vertex.x + dir.x * d;
    const insideY = vertex.y + dir.y * d;

    // Check if inside position is too close to any edge (< 15px)
    const tooClose = angleDeg < 30 || edges.some(([p1, p2]) => {
      // Skip edges that share this vertex
      if ((p1 === vertex) || (p2 === vertex)) return false;
      return pointToSegDist(insideX, insideY, p1.x, p1.y, p2.x, p2.y) < 15;
    });

    // Also check: for angles in extreme triangles, check distance to own edges
    const nearOwnEdge = edges.some(([p1, p2]) => {
      if (p1 !== vertex && p2 !== vertex) return false; // only check edges from this vertex
      return pointToSegDist(insideX, insideY, p1.x, p1.y, p2.x, p2.y) < 12;
    });

    if (tooClose || nearOwnEdge) {
      // Place outside with leader line
      const outDir = { x: -dir.x, y: -dir.y };
      const outD = 28;
      return {
        x: vertex.x + outDir.x * outD, y: vertex.y + outDir.y * outD,
        outside: true, vx: vertex.x, vy: vertex.y, dir: outDir
      };
    }

    return { x: insideX, y: insideY, outside: false };
  };

  let posA = labelPos(0);
  let posB = labelPos(1);
  let posC = labelPos(2);
  const eA = vertexEntries[0], eB = vertexEntries[1], eC = vertexEntries[2];

  // Post-check: if any two inside labels are too close, push both outside
  const allPos = [posA, posB, posC];
  const allVerts = [A, B, C];
  const allEntries = [eA, eB, eC];
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (allEntries[i].value === 90 || allEntries[j].value === 90) continue;
      const dx = allPos[j].x - allPos[i].x, dy = allPos[j].y - allPos[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 40 && (!allPos[i].outside || !allPos[j].outside)) {
        // Push both outside
        for (const idx of [i, j]) {
          if (!allPos[idx].outside) {
            const v = allVerts[idx];
            const cdx = centroid.x - v.x, cdy = centroid.y - v.y;
            const cl = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
            const outDir = { x: -cdx / cl, y: -cdy / cl };
            allPos[idx] = {
              x: v.x + outDir.x * 28, y: v.y + outDir.y * 28,
              outside: true, vx: v.x, vy: v.y, dir: outDir
            };
          }
        }
      }
    }
  }
  posA = allPos[0]; posB = allPos[1]; posC = allPos[2];

  // Resolve overlapping labels (for extreme triangles like 80/90/10)
  const labelPairs = [[posA, posB, A, B], [posA, posC, A, C], [posB, posC, B, C]];
  for (let iter = 0; iter < 5; iter++) {
    let moved = false;
    for (const [p1, p2, v1, v2] of labelPairs) {
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 35) {
        const vdx = v2.x - v1.x, vdy = v2.y - v1.y;
        const vd = Math.sqrt(vdx * vdx + vdy * vdy) || 1;
        const nx = vdx / vd, ny = vdy / vd;
        const push = (35 - dist) / 2 + 2;
        p1.x -= nx * push; p1.y -= ny * push;
        p2.x += nx * push; p2.y += ny * push;
        moved = true;
      }
    }
    if (!moved) break;
  }

  // ── Right-angle square marker ──
  let squarePoints = null;
  if (hasRight) {
    const sz = 18;
    const u1 = { x: (A.x - B.x) / (Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2) || 1) * sz,
                 y: (A.y - B.y) / (Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2) || 1) * sz };
    const u2 = { x: (C.x - B.x) / (Math.sqrt((C.x-B.x)**2 + (C.y-B.y)**2) || 1) * sz,
                 y: (C.y - B.y) / (Math.sqrt((C.x-B.x)**2 + (C.y-B.y)**2) || 1) * sz };
    squarePoints = `${B.x+u1.x},${B.y+u1.y} ${B.x+u1.x+u2.x},${B.y+u1.y+u2.y} ${B.x+u2.x},${B.y+u2.y}`;
  }

  // ── Isosceles tick marks ──
  const isEquilateral = angle1 === angle2 && angle2 === angle3;
  let ticks = [];
  if (isIso && !isEquilateral) {
    // Tick marks on the two equal sides (from apex to each base vertex)
    for (const ev of [B, C]) {
      const mx = (A.x + ev.x) / 2, my = (A.y + ev.y) / 2;
      const dx = ev.x - A.x, dy = ev.y - A.y;
      const sl = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = -dy / sl * 10, py = dx / sl * 10;
      ticks.push({ x1: mx - px, y1: my - py, x2: mx + px, y2: my + py });
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <svg viewBox={`0 0 400 ${vbH}`} width="100%" style={{ maxWidth: 360 }}>
        {/* Triangle */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="#f0f0ff" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round"
        />

        {/* Right-angle square */}
        {squarePoints && (
          <polyline points={squarePoints} fill="none" stroke="#6366f1" strokeWidth="1.5" />
        )}

        {/* Isosceles tick marks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#6366f1" strokeWidth="2" />
        ))}

        {/* Leader lines for outside labels (skip 90° — shown as square) */}
        {[posA, posB, posC].map((pos, i) => pos.outside && [eA, eB, eC][i].value !== 90 && (
          <line key={`leader-${i}`}
            x1={pos.vx + pos.dir.x * 8} y1={pos.vy + pos.dir.y * 8}
            x2={pos.x - pos.dir.x * 6} y2={pos.y - pos.dir.y * 6 + 3}
            stroke={[eA, eB, eC][i].color} strokeWidth="1.5"
            strokeDasharray="3,2" opacity="0.6"
          />
        ))}

        {/* Angle labels (skip right-angle vertex — shown as square) */}
        {eA.value !== 90 && (
          <text x={posA.x} y={posA.y + 5} textAnchor="middle"
            fontSize="17" fontWeight="bold" fill={eA.color}>{eA.label}</text>
        )}
        {eB.value !== 90 && (
          <text x={posB.x} y={posB.y + 5} textAnchor="middle"
            fontSize="17" fontWeight="bold" fill={eB.color}>{eB.label}</text>
        )}
        {eC.value !== 90 && (
          <text x={posC.x} y={posC.y + 5} textAnchor="middle"
            fontSize="17" fontWeight="bold" fill={eC.color}>{eC.label}</text>
        )}
      </svg>
      {totalLabel && (
        <p className="text-center text-sm font-bold text-[#6C5CE7]">{totalLabel}</p>
      )}
    </div>
  );
}


// ============================================================
// BusStopDiagram — Visual bus stop method layout for division
// ============================================================
// Props:
//   divisor      — the number outside the bus stop (e.g. 4)
//   dividend     — the number inside (e.g. 936)
//   steps        — array of { digit, result, remainder, carry } for each column
//                   e.g. [{ digit: "9", result: "2", remainder: 1, carry: true },
//                         { digit: "3", result: "3", remainder: 1, carry: true },
//                         { digit: "6", result: "4", remainder: 0, carry: false }]
//   showAnswer   — whether to show answer digits above (default true)
//   highlightStep — index of step to highlight (optional)

export function BusStopDiagram({
  divisor,
  dividend,
  steps = [],
  showAnswer = true,
  highlightStep = null,
  decimalAfter = null
}) {
  const rawDigits = String(dividend).split('');
  const numDigits = rawDigits.length;
  const cellW = 64;
  const dotW = 28;
  const is2DigitDivisor = divisor >= 10;
  const startX = is2DigitDivisor ? 130 : 110;
  const roofY = 100;
  const digitY = roofY + 50;
  const answerY = roofY - 24;

  // Build cells array: digit cells + optional decimal point cell
  const cells = [];
  rawDigits.forEach((d, i) => {
    cells.push({ type: 'digit', value: d, digitIdx: i });
    if (decimalAfter !== null && i === decimalAfter) {
      cells.push({ type: 'dot' });
    }
  });

  // Compute x positions for each cell
  let runningX = 0;
  const cellPositions = cells.map(c => {
    const w = c.type === 'dot' ? dotW : cellW;
    const pos = { ...c, x: startX + runningX, w };
    runningX += w;
    return pos;
  });
  const totalContentW = runningX;

  const hasRemainder = steps.length > 0 && steps[steps.length - 1].remainder > 0;
  const totalW = startX + totalContentW + (hasRemainder ? 60 : 30);
  const totalH = 200;

  // Helper: get centre x for a digit by its index
  const digitCentre = (idx) => {
    const cell = cellPositions.find(c => c.type === 'digit' && c.digitIdx === idx);
    return cell ? cell.x + cell.w / 2 : 0;
  };

  // Show answer decimal only if steps extend past the decimal position
  const showAnswerDot = decimalAfter !== null && steps.length > decimalAfter + 1;

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" style={{ maxWidth: is2DigitDivisor ? 440 : 400 }}>
        {/* Bus stop bracket */}
        <path
          d={`M ${startX - 8} ${roofY + 60} L ${startX - 8} ${roofY + 8} Q ${startX - 8} ${roofY} ${startX} ${roofY} L ${startX + totalContentW + 10} ${roofY}`}
          fill="none" stroke="#6366f1" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Divisor */}
        <text x={startX - 32} y={digitY + 4} textAnchor="middle"
              fill="#6C5CE7" fontSize="32" fontWeight="bold">
          {divisor}
        </text>

        {/* Cells: digits and decimal point */}
        {cellPositions.map((cell, i) => {
          const cx = cell.x + cell.w / 2;
          if (cell.type === 'dot') {
            return (
              <g key={`dot-${i}`}>
                <text x={cx} y={digitY + 4} textAnchor="middle"
                      fill="#1f2937" fontSize="32" fontWeight="bold">.</text>
                {showAnswerDot && (
                  <text x={cx} y={answerY} textAnchor="middle"
                        fill="#059669" fontSize="32" fontWeight="bold">.</text>
                )}
              </g>
            );
          }
          const isHighlighted = highlightStep === cell.digitIdx;
          return (
            <g key={`digit-${i}`}>
              {isHighlighted && (
                <rect x={cx - cell.w / 2 + 4} y={roofY + 10} width={cell.w - 8} height={52}
                      fill="#ede9fe" rx={8} />
              )}
              <text x={cx} y={digitY + 4} textAnchor="middle"
                    fill="#1f2937" fontSize="32" fontWeight="bold">
                {cell.value}
              </text>
            </g>
          );
        })}

        {/* Answer digits — above the roof, aligned to digit cells */}
        {showAnswer && steps.map((step, i) => {
          const cx = digitCentre(i);
          return (
            <text key={`ans-${i}`} x={cx} y={answerY} textAnchor="middle"
                  fill="#059669" fontSize="32" fontWeight="bold">
              {step.result}
            </text>
          );
        })}

        {/* Carried remainders */}
        {steps.map((step, i) => {
          if (!step.carry || i >= numDigits - 1) return null;
          const nextCell = cellPositions.find(c => c.type === 'digit' && c.digitIdx === i + 1);
          if (!nextCell) return null;
          const cx = nextCell.x + 4;
          return (
            <g key={`carry-${i}`}>
              <line x1={cx - 12} y1={roofY + 14} x2={cx - 12} y2={roofY + 36}
                    stroke="#e5e7eb" strokeWidth="1.5" />
              <text x={cx - 6} y={roofY + 24} textAnchor="end"
                    fill="#dc2626" fontSize="16" fontWeight="bold" fontStyle="italic">
                {step.remainder}
              </text>
            </g>
          );
        })}

        {/* Final remainder */}
        {steps.length > 0 && steps[steps.length - 1].remainder > 0 && (
          <text x={startX + totalContentW + 16} y={answerY}
                textAnchor="start" fill="#dc2626" fontSize="22" fontWeight="bold">
            r{steps[steps.length - 1].remainder}
          </text>
        )}
      </svg>
    </div>
  );
}


// ============================================================
// RectangleDiagram — Labelled rectangle with dimension lines
// ============================================================
// Props:
//   length, width  — dimension values (numbers)
//   dimUnit        — unit string (e.g. "cm", "m")
//   showGrid       — whether to show interior grid lines (default false)
//   areaLabel      — optional label inside the rectangle (e.g. "40 m²")
//   color          — fill colour (default light blue)

export function RectangleDiagram({
  length = 8,
  width = 5,
  dimUnit = "m",
  showGrid = false,
  areaLabel = null,
  color = "#bfdbfe",
  missingDim = null,
  label = null
}) {
  const svgW = 400;
  const svgH = label ? 300 : 280;
  const padL = 70;
  const padR = 30;
  const padT = 30;
  const padB = label ? 70 : 50;
  const maxW = svgW - padL - padR;
  const maxH = svgH - padT - padB;

  // Extract numeric values for layout — strings like "?" or "3 × width" use defaults
  const numLength = typeof length === 'number' ? length : 8;
  const numWidth = typeof width === 'number' ? width : 5;
  const isLengthString = typeof length === 'string';
  const isWidthString = typeof width === 'string';

  // Build display labels
  const lengthLabel = isLengthString ? `${length}` :
    (missingDim === 'length' || missingDim === 'all') ? `? ${dimUnit}` : `${length} ${dimUnit}`;
  const widthLabel = isWidthString ? `${width}` :
    (missingDim === 'width' || missingDim === 'all') ? `? ${dimUnit}` : `${width} ${dimUnit}`;
  const lengthColor = (isLengthString || missingDim === 'length' || missingDim === 'all') ? '#dc2626' : '#6366f1';
  const widthColor = (isWidthString || missingDim === 'width' || missingDim === 'all') ? '#dc2626' : '#6366f1';

  // Scale rectangle to match aspect ratio of actual dimensions
  const aspect = numLength / numWidth;
  let rectW, rectH;
  if (aspect >= maxW / maxH) {
    rectW = maxW;
    rectH = maxW / aspect;
  } else {
    rectH = maxH;
    rectW = maxH * aspect;
  }
  const rx = padL + (maxW - rectW) / 2;
  const ry = padT + (maxH - rectH) / 2;

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Rectangle fill */}
        <rect x={rx} y={ry} width={rectW} height={rectH}
              fill={color} stroke="#3b82f6" strokeWidth="2.5" rx="4" />

        {/* Grid lines if enabled */}
        {showGrid && (() => {
          const lines = [];
          const cols = Math.min(numLength, 20);
          const rows = Math.min(numWidth, 15);
          for (let i = 1; i < cols; i++) {
            const x = rx + (i / cols) * rectW;
            lines.push(<line key={`gc-${i}`} x1={x} y1={ry} x2={x} y2={ry + rectH} stroke="#93c5fd" strokeWidth="0.8" />);
          }
          for (let j = 1; j < rows; j++) {
            const y = ry + (j / rows) * rectH;
            lines.push(<line key={`gr-${j}`} x1={rx} y1={y} x2={rx + rectW} y2={y} stroke="#93c5fd" strokeWidth="0.8" />);
          }
          return lines;
        })()}

        {/* Area label in centre */}
        {areaLabel && (
          <text x={rx + rectW / 2} y={ry + rectH / 2 + 6} textAnchor="middle"
                fill="#1e40af" fontSize="22" fontWeight="bold">
            {areaLabel}
          </text>
        )}

        {/* Bottom dimension line — length */}
        <line x1={rx} y1={ry + rectH + 20} x2={rx + rectW} y2={ry + rectH + 20}
              stroke="#6366f1" strokeWidth="2" markerStart="url(#rd-arrow-l)" markerEnd="url(#rd-arrow-r)" />
        <text x={rx + rectW / 2} y={ry + rectH + 42} textAnchor="middle"
              fill={lengthColor} fontSize="18" fontWeight="bold">
          {lengthLabel}
        </text>

        {/* Left dimension line — width */}
        <line x1={rx - 20} y1={ry} x2={rx - 20} y2={ry + rectH}
              stroke="#6366f1" strokeWidth="2" markerStart="url(#rd-arrow-u)" markerEnd="url(#rd-arrow-d)" />
        <text x={rx - 38} y={ry + rectH / 2 + 5} textAnchor="middle"
              fill={widthColor} fontSize="18" fontWeight="bold"
              transform={`rotate(-90, ${rx - 38}, ${ry + rectH / 2 + 5})`}>
          {widthLabel}
        </text>

        {/* Extra label (e.g. "Perimeter = 48 cm") */}
        {label && (
          <text x={svgW / 2} y={svgH - 10} textAnchor="middle"
                fill="#6366f1" fontSize="16" fontWeight="bold">
            {label}
          </text>
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="rd-arrow-r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
          </marker>
          <marker id="rd-arrow-l" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#6366f1" />
          </marker>
          <marker id="rd-arrow-d" markerWidth="6" markerHeight="8" refX="3" refY="8" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#6366f1" />
          </marker>
          <marker id="rd-arrow-u" markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}


// ============================================================
// TriangleAreaDiagram — Triangle with base, height, and optional
// enclosing rectangle for area lessons
// ============================================================
export function TriangleAreaDiagram({
  base = 10,
  height = 6,
  dimUnit = "cm",
  areaLabel = null,
  showRectangle = false,
  missingDim = null,
  color = "#86efac"
}) {
  const svgW = 400;
  const svgH = 280;
  const padL = 70;
  const padR = 30;
  const padT = 30;
  const padB = 50;
  const shapeW = svgW - padL - padR;
  const shapeH = svgH - padT - padB;

  // Triangle vertices: base along bottom, apex at top
  // When showRectangle is true, apex is at top-right corner so the diagonal goes corner to corner
  const bL = { x: padL, y: padT + shapeH };                     // bottom-left
  const bR = { x: padL + shapeW, y: padT + shapeH };            // bottom-right
  const apex = { x: showRectangle ? padL + shapeW : padL + shapeW * 0.6, y: padT };
  const footX = apex.x;                                          // perpendicular foot on base
  const footY = bL.y;

  // Right-angle marker size
  const sq = 12;

  const baseColor = missingDim === 'base' ? '#dc2626' : '#6366f1';
  const baseText = missingDim === 'base' ? `? ${dimUnit}` : `${base} ${dimUnit}`;
  const heightColor = missingDim === 'height' ? '#dc2626' : '#6366f1';
  const heightText = missingDim === 'height' ? `? ${dimUnit}` : `${height} ${dimUnit}`;

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Optional enclosing rectangle (dashed) */}
        {showRectangle && (
          <rect x={padL} y={padT} width={shapeW} height={shapeH}
                fill="#f0f9ff" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" rx="2" />
        )}

        {/* Triangle fill */}
        <polygon
          points={`${bL.x},${bL.y} ${bR.x},${bR.y} ${apex.x},${apex.y}`}
          fill={color} stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round"
        />

        {/* Perpendicular height line (dashed) — hidden when showRectangle since the edge IS the height */}
        {!showRectangle && (
          <line x1={footX} y1={apex.y} x2={footX} y2={footY}
                stroke="#6366f1" strokeWidth="1.8" strokeDasharray="5 3" />
        )}

        {/* Right-angle marker at foot — hidden when showRectangle (corner is obviously 90°) */}
        {!showRectangle && (
          <polyline
            points={`${footX - sq},${footY} ${footX - sq},${footY - sq} ${footX},${footY - sq}`}
            fill="none" stroke="#6366f1" strokeWidth="1.5"
          />
        )}

        {/* Height label — left side when showRectangle (right edge is the height), otherwise right of dashed line */}
        <text x={showRectangle ? padL - 10 : footX + 10} y={padT + shapeH / 2 + 5}
              textAnchor={showRectangle ? "end" : "start"}
              fill={heightColor} fontSize="16" fontWeight="bold">
          {heightText}
        </text>

        {/* Area label (inside triangle — at centroid for right-triangle when showRectangle) */}
        {areaLabel && (
          <text x={padL + shapeW * (showRectangle ? 0.67 : 0.35)} y={padT + shapeH * (showRectangle ? 0.67 : 0.7)} textAnchor="middle"
                fill="#15803d" fontSize="18" fontWeight="bold">
            {areaLabel}
          </text>
        )}

        {/* Bottom dimension line — base */}
        <line x1={padL} y1={padT + shapeH + 20} x2={padL + shapeW} y2={padT + shapeH + 20}
              stroke="#6366f1" strokeWidth="2" markerStart="url(#tad-arrow-l)" markerEnd="url(#tad-arrow-r)" />
        <text x={padL + shapeW / 2} y={padT + shapeH + 42} textAnchor="middle"
              fill={baseColor} fontSize="18" fontWeight="bold">
          {baseText}
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="tad-arrow-r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
          </marker>
          <marker id="tad-arrow-l" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}


// ============================================================
// ============================================================
// ParallelogramDiagram — Parallelogram with base, perpendicular
// height, and optional slant label for area lessons
// ============================================================
export function ParallelogramDiagram({
  base = 10,
  height = 6,
  slant = null,
  dimUnit = "cm",
  areaLabel = null,
  missingDim = null,
  color = "#e9d5ff"
}) {
  const svgW = 400;
  const svgH = 280;
  const padL = 50;
  const padR = 30;
  const padT = 30;
  const padB = 50;
  const shapeW = svgW - padL - padR - 40; // extra space for slant offset
  const shapeH = svgH - padT - padB;

  // Slant offset — how far the top edge shifts right from the bottom
  const offset = 40;

  // Parallelogram vertices
  const bL = { x: padL, y: padT + shapeH };
  const bR = { x: padL + shapeW, y: padT + shapeH };
  const tR = { x: padL + shapeW + offset, y: padT };
  const tL = { x: padL + offset, y: padT };

  // Perpendicular height drops from tL straight down to base line
  const footX = tL.x;
  const footY = bL.y;

  // Right-angle marker
  const sq = 12;

  const baseColor = missingDim === 'base' ? '#dc2626' : '#6366f1';
  const baseText = missingDim === 'base' ? `? ${dimUnit}` : `${base} ${dimUnit}`;
  const heightColor = missingDim === 'height' ? '#dc2626' : '#6366f1';
  const heightText = missingDim === 'height' ? `? ${dimUnit}` : `${height} ${dimUnit}`;

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Parallelogram fill */}
        <polygon
          points={`${bL.x},${bL.y} ${bR.x},${bR.y} ${tR.x},${tR.y} ${tL.x},${tL.y}`}
          fill={color} stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round"
        />

        {/* Perpendicular height line (dashed) */}
        <line x1={footX} y1={tL.y} x2={footX} y2={footY}
              stroke="#6366f1" strokeWidth="1.8" strokeDasharray="5 3" />

        {/* Right-angle marker at foot */}
        <polyline
          points={`${footX - sq},${footY} ${footX - sq},${footY - sq} ${footX},${footY - sq}`}
          fill="none" stroke="#6366f1" strokeWidth="1.5"
        />

        {/* Height label (right of dashed line) */}
        <text x={footX + 10} y={padT + shapeH / 2 + 5} textAnchor="start"
              fill={heightColor} fontSize="16" fontWeight="bold">
          {heightText}
        </text>

        {/* Slant label (outside left slanted edge) if provided */}
        {slant && (
          <>
            <text
              x={(bL.x + tL.x) / 2 - 18}
              y={(bL.y + tL.y) / 2}
              textAnchor="end"
              fill="#9ca3af" fontSize="14" fontStyle="italic"
            >
              {slant} {dimUnit}
            </text>
          </>
        )}

        {/* Area label inside */}
        {areaLabel && (
          <text x={(bL.x + bR.x) / 2 + offset / 2} y={padT + shapeH / 2 + 6} textAnchor="middle"
                fill="#6d28d9" fontSize="18" fontWeight="bold">
            {areaLabel}
          </text>
        )}

        {/* Bottom dimension line — base */}
        <line x1={bL.x} y1={padT + shapeH + 20} x2={bR.x} y2={padT + shapeH + 20}
              stroke="#6366f1" strokeWidth="2" markerStart="url(#pgd-arrow-l)" markerEnd="url(#pgd-arrow-r)" />
        <text x={(bL.x + bR.x) / 2} y={padT + shapeH + 42} textAnchor="middle"
              fill={baseColor} fontSize="18" fontWeight="bold">
          {baseText}
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="pgd-arrow-r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
          </marker>
          <marker id="pgd-arrow-l" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}


// CuboidDiagram — Simple 3D cuboid with labelled dimensions
// ============================================================
// Props:
//   length, width, height — dimension values
//   dimUnit               — unit string (e.g. "cm")

export function CuboidDiagram({
  length = 8,
  width = 5,
  height = 4,
  dimUnit = "cm",
  showLayers = false,
  missingDim = null
}) {
  // Isometric-ish 3D cuboid matching the locked volume diagram template convention:
  // Length = bottom horizontal, Height = left vertical, Width = bottom-right diagonal
  const svgW = 420;
  const svgH = 290;

  // Front face corners
  const fl = 160; // front face width (px)
  const fh = 110; // front face height (px)
  const ox = 90;  // origin x (bottom-left of front face)
  const oy = 220; // origin y

  // Depth offset for 3D
  const dx = 55;
  const dy = -44;

  // Front face points
  const f_bl = { x: ox, y: oy };
  const f_br = { x: ox + fl, y: oy };
  const f_tr = { x: ox + fl, y: oy - fh };
  const f_tl = { x: ox, y: oy - fh };

  // Back face points
  const b_bl = { x: f_bl.x + dx, y: f_bl.y + dy };
  const b_br = { x: f_br.x + dx, y: f_br.y + dy };
  const b_tr = { x: f_tr.x + dx, y: f_tr.y + dy };
  const b_tl = { x: f_tl.x + dx, y: f_tl.y + dy };

  // Width dimension geometry — diagonal angle and perpendicular for label placement
  const diagLen = Math.sqrt(dx * dx + dy * dy);
  const diagAngleDeg = Math.atan2(dy, dx) * 180 / Math.PI; // ≈ -38.7°
  // Perpendicular unit vector pointing outward (down-right from the diagonal edge)
  const perpX = -dy / diagLen;
  const perpY = dx / diagLen;
  // Dimension line: 13px perpendicular from the actual edge
  const wDimOff = 13;
  const wDimStart = { x: f_br.x + perpX * wDimOff, y: f_br.y + perpY * wDimOff };
  const wDimEnd = { x: b_br.x + perpX * wDimOff, y: b_br.y + perpY * wDimOff };
  const wDimMid = { x: (wDimStart.x + wDimEnd.x) / 2, y: (wDimStart.y + wDimEnd.y) / 2 };
  // Label: 20px further out from dimension line (perpendicular)
  const wLabelX = wDimMid.x + perpX * 20;
  const wLabelY = wDimMid.y + perpY * 20;
  // Tick marks perpendicular to the diagonal
  const tickHalf = 6;
  const wTickStartA = { x: wDimStart.x - perpX * tickHalf, y: wDimStart.y - perpY * tickHalf };
  const wTickStartB = { x: wDimStart.x + perpX * tickHalf, y: wDimStart.y + perpY * tickHalf };
  const wTickEndA = { x: wDimEnd.x - perpX * tickHalf, y: wDimEnd.y - perpY * tickHalf };
  const wTickEndB = { x: wDimEnd.x + perpX * tickHalf, y: wDimEnd.y + perpY * tickHalf };

  // Layer lines on front face (for showLayers mode)
  const layerLines = [];
  if (showLayers && height > 1) {
    const maxLayers = Math.min(height, 8);
    for (let i = 1; i < maxLayers; i++) {
      const t = i / maxLayers;
      const ly = f_bl.y - t * fh;
      layerLines.push(
        <line key={`layer-${i}`} x1={f_bl.x} y1={ly} x2={f_br.x} y2={ly}
              stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="4 3" />
      );
    }
  }

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Back edges (dashed) */}
        <line x1={b_bl.x} y1={b_bl.y} x2={b_br.x} y2={b_br.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1={b_bl.x} y1={b_bl.y} x2={b_tl.x} y2={b_tl.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1={b_bl.x} y1={b_bl.y} x2={f_bl.x} y2={f_bl.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />

        {/* Front face */}
        <polygon points={`${f_bl.x},${f_bl.y} ${f_br.x},${f_br.y} ${f_tr.x},${f_tr.y} ${f_tl.x},${f_tl.y}`}
                 fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />

        {/* Layer lines on front face */}
        {layerLines}

        {/* Top face */}
        <polygon points={`${f_tl.x},${f_tl.y} ${f_tr.x},${f_tr.y} ${b_tr.x},${b_tr.y} ${b_tl.x},${b_tl.y}`}
                 fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />

        {/* Right face */}
        <polygon points={`${f_br.x},${f_br.y} ${b_br.x},${b_br.y} ${b_tr.x},${b_tr.y} ${f_tr.x},${f_tr.y}`}
                 fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />

        {/* === DIMENSION LABELS === */}

        {/* Length — below front face (horizontal) */}
        <line x1={f_bl.x} y1={f_bl.y + 14} x2={f_br.x} y2={f_br.y + 14}
              stroke="#6366f1" strokeWidth="1.5" />
        <line x1={f_bl.x} y1={f_bl.y + 8} x2={f_bl.x} y2={f_bl.y + 20} stroke="#6366f1" strokeWidth="1.5" />
        <line x1={f_br.x} y1={f_br.y + 8} x2={f_br.x} y2={f_br.y + 20} stroke="#6366f1" strokeWidth="1.5" />
        <text x={(f_bl.x + f_br.x) / 2} y={f_bl.y + 36} textAnchor="middle"
              fill={missingDim === 'length' || missingDim === 'all' ? '#dc2626' : '#6366f1'} fontSize="17" fontWeight="bold" letterSpacing="1.5">
          {missingDim === 'length' || missingDim === 'all' ? `? ${dimUnit}` : `${length} ${dimUnit}`}
        </text>

        {/* Height — left of front face (vertical) */}
        <line x1={f_bl.x - 22} y1={f_bl.y} x2={f_tl.x - 22} y2={f_tl.y}
              stroke="#6366f1" strokeWidth="1.5" />
        <line x1={f_bl.x - 16} y1={f_bl.y} x2={f_bl.x - 28} y2={f_bl.y} stroke="#6366f1" strokeWidth="1.5" />
        <line x1={f_tl.x - 16} y1={f_tl.y} x2={f_tl.x - 28} y2={f_tl.y} stroke="#6366f1" strokeWidth="1.5" />
        <text x={f_bl.x - 30} y={(f_bl.y + f_tl.y) / 2 + 5} textAnchor="end"
              fill={missingDim === 'height' || missingDim === 'all' ? '#dc2626' : '#6366f1'} fontSize="17" fontWeight="bold">
          {missingDim === 'height' || missingDim === 'all' ? `? ${dimUnit}` : `${height} ${dimUnit}`}
        </text>

        {/* Width — along bottom-right diagonal edge (front-BR to back-BR) */}
        {/* Dimension line parallel to diagonal, offset perpendicular outward */}
        <line x1={wDimStart.x} y1={wDimStart.y} x2={wDimEnd.x} y2={wDimEnd.y}
              stroke="#6366f1" strokeWidth="1.5" />
        {/* Tick marks perpendicular to the diagonal at each end */}
        <line x1={wTickStartA.x} y1={wTickStartA.y} x2={wTickStartB.x} y2={wTickStartB.y}
              stroke="#6366f1" strokeWidth="1.5" />
        <line x1={wTickEndA.x} y1={wTickEndA.y} x2={wTickEndB.x} y2={wTickEndB.y}
              stroke="#6366f1" strokeWidth="1.5" />
        {/* Label rotated to match diagonal angle, offset further outward */}
        <text x={wLabelX} y={wLabelY} textAnchor="middle"
              fill={missingDim === 'width' || missingDim === 'all' ? '#dc2626' : '#6366f1'} fontSize="17" fontWeight="bold" letterSpacing="1.5"
              transform={`rotate(${diagAngleDeg}, ${wLabelX}, ${wLabelY})`}>
          {missingDim === 'width' || missingDim === 'all' ? `? ${dimUnit}` : `${width} ${dimUnit}`}
        </text>
      </svg>
    </div>
  );
}


// ============================================================
// LShapeDiagram — Compound L-shape with two labelled rectangles
// ============================================================
// Shows an L-shape split into Rectangle A and Rectangle B with dimensions.
// Props:
//   totalLength, totalWidth — overall L-shape dimensions
//   cutLength, cutWidth     — the cut-out corner dimensions
//   rect1 — { label, length, width } for Rectangle A
//   rect2 — { label, length, width } for Rectangle B
//   dimUnit — unit string (e.g. "m")
//   showSplit — whether to show the dividing line (default true)

export function LShapeDiagram({
  totalLength = 10,
  totalWidth = 8,
  cutLength = 4,
  cutWidth = 3,
  rect1 = null,
  rect2 = null,
  dimUnit = "m",
  showSplit = true
}) {
  const svgW = 580;
  const svgH = 420;
  const pad = 70;
  const drawW = svgW - 2 * pad;
  const drawH = svgH - 2 * pad;

  // Scale factors
  const scaleX = drawW / totalLength;
  const scaleY = drawH / totalWidth;

  // L-shape points (clockwise from bottom-left)
  // The cut is from the top-right corner
  const P1 = { x: pad, y: pad + drawH };                                    // bottom-left
  const P2 = { x: pad + totalLength * scaleX, y: pad + drawH };             // bottom-right
  const P3 = { x: pad + totalLength * scaleX, y: pad + cutWidth * scaleY }; // right notch bottom
  const P4 = { x: pad + (totalLength - cutLength) * scaleX, y: pad + cutWidth * scaleY }; // notch inner corner
  const P5 = { x: pad + (totalLength - cutLength) * scaleX, y: pad };       // notch inner top
  const P6 = { x: pad, y: pad };                                            // top-left

  const polyPoints = [P1, P2, P3, P4, P5, P6].map(p => `${p.x},${p.y}`).join(' ');

  // Split line: horizontal from left edge to notch inner corner
  const splitY = P4.y;
  const splitX = P4.x;

  // Rectangle A centre (bottom portion, full width)
  const rectA_cx = (P1.x + P2.x) / 2;
  const rectA_cy = (splitY + P1.y) / 2;

  // Rectangle B centre (top-left portion)
  const rectB_cx = (P6.x + P4.x) / 2;
  const rectB_cy = (P6.y + splitY) / 2;

  // Dimension line helpers
  const dimOff = 20;  // offset from shape edge
  const tickHalf = 6; // tick mark half-length
  const col = "#6366f1";
  const fontSize = 17;

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 560 }}>
        {/* L-shape fill */}
        <polygon points={polyPoints}
                 fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Split line */}
        {showSplit && (
          <line x1={P1.x} y1={splitY} x2={splitX} y2={splitY}
                stroke="#ef4444" strokeWidth="2" strokeDasharray="8 4" />
        )}

        {/* Rectangle labels */}
        {rect1 && (
          <text x={rectA_cx} y={rectA_cy + 6} textAnchor="middle"
                fill="#1e40af" fontSize="14" fontWeight="bold">
            {rect1.label}: {rect1.length}{dimUnit} {"\u00d7"} {rect1.width}{dimUnit}
          </text>
        )}
        {rect2 && (
          <text x={rectB_cx} y={rectB_cy + 6} textAnchor="middle"
                fill="#1e40af" fontSize="14" fontWeight="bold">
            {rect2.label}: {rect2.length}{dimUnit} {"\u00d7"} {rect2.width}{dimUnit}
          </text>
        )}

        {/* === DIMENSION LINES WITH TICK MARKS === */}

        {/* Bottom edge: totalLength (P1 → P2) */}
        <line x1={P1.x} y1={P1.y + dimOff} x2={P2.x} y2={P2.y + dimOff}
              stroke={col} strokeWidth="1.5" />
        <line x1={P1.x} y1={P1.y + dimOff - tickHalf} x2={P1.x} y2={P1.y + dimOff + tickHalf}
              stroke={col} strokeWidth="1.5" />
        <line x1={P2.x} y1={P2.y + dimOff - tickHalf} x2={P2.x} y2={P2.y + dimOff + tickHalf}
              stroke={col} strokeWidth="1.5" />
        <text x={(P1.x + P2.x) / 2} y={P1.y + dimOff + 22} textAnchor="middle"
              fill={col} fontSize={fontSize} fontWeight="bold">
          {totalLength} {dimUnit}
        </text>

        {/* Left edge: totalWidth (P6 → P1) */}
        <line x1={P6.x - dimOff} y1={P6.y} x2={P1.x - dimOff} y2={P1.y}
              stroke={col} strokeWidth="1.5" />
        <line x1={P6.x - dimOff - tickHalf} y1={P6.y} x2={P6.x - dimOff + tickHalf} y2={P6.y}
              stroke={col} strokeWidth="1.5" />
        <line x1={P1.x - dimOff - tickHalf} y1={P1.y} x2={P1.x - dimOff + tickHalf} y2={P1.y}
              stroke={col} strokeWidth="1.5" />
        <text x={P6.x - dimOff - 12} y={(P6.y + P1.y) / 2 + 5} textAnchor="end"
              fill={col} fontSize={fontSize} fontWeight="bold">
          {totalWidth} {dimUnit}
        </text>

        {/* Right partial edge: totalWidth - cutWidth (P2 → P3) */}
        <line x1={P2.x + dimOff} y1={P2.y} x2={P3.x + dimOff} y2={P3.y}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <line x1={P2.x + dimOff - tickHalf} y1={P2.y} x2={P2.x + dimOff + tickHalf} y2={P2.y}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <line x1={P3.x + dimOff - tickHalf} y1={P3.y} x2={P3.x + dimOff + tickHalf} y2={P3.y}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <text x={P2.x + dimOff + 12} y={(P2.y + P3.y) / 2 + 5} textAnchor="start"
              fill="#5A4BD1" fontSize="15" fontWeight="bold">
          {totalWidth - cutWidth} {dimUnit}
        </text>

        {/* Top partial edge: totalLength - cutLength (P6 → P5) */}
        <line x1={P6.x} y1={P6.y - dimOff} x2={P5.x} y2={P5.y - dimOff}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <line x1={P6.x} y1={P6.y - dimOff - tickHalf} x2={P6.x} y2={P6.y - dimOff + tickHalf}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <line x1={P5.x} y1={P5.y - dimOff - tickHalf} x2={P5.x} y2={P5.y - dimOff + tickHalf}
              stroke="#5A4BD1" strokeWidth="1.5" />
        <text x={(P6.x + P5.x) / 2} y={P6.y - dimOff - 10} textAnchor="middle"
              fill="#5A4BD1" fontSize="15" fontWeight="bold">
          {totalLength - cutLength} {dimUnit}
        </text>

        {/* Notch horizontal edge: cutLength (P4 → P3) — in cut-out area above step */}
        <line x1={P4.x} y1={P4.y - dimOff} x2={P3.x} y2={P3.y - dimOff}
              stroke="#dc2626" strokeWidth="1.5" />
        <line x1={P4.x} y1={P4.y - dimOff - tickHalf} x2={P4.x} y2={P4.y - dimOff + tickHalf}
              stroke="#dc2626" strokeWidth="1.5" />
        <line x1={P3.x} y1={P3.y - dimOff - tickHalf} x2={P3.x} y2={P3.y - dimOff + tickHalf}
              stroke="#dc2626" strokeWidth="1.5" />
        <text x={(P4.x + P3.x) / 2} y={P4.y - dimOff - 10} textAnchor="middle"
              fill="#dc2626" fontSize="15" fontWeight="bold">
          {cutLength} {dimUnit}
        </text>

        {/* Notch vertical edge: cutWidth (P5 → P4) — the step drop (right side, in cut-out area) */}
        <line x1={P5.x + dimOff} y1={P5.y} x2={P4.x + dimOff} y2={P4.y}
              stroke="#dc2626" strokeWidth="1.5" />
        <line x1={P5.x + dimOff - tickHalf} y1={P5.y} x2={P5.x + dimOff + tickHalf} y2={P5.y}
              stroke="#dc2626" strokeWidth="1.5" />
        <line x1={P4.x + dimOff - tickHalf} y1={P4.y} x2={P4.x + dimOff + tickHalf} y2={P4.y}
              stroke="#dc2626" strokeWidth="1.5" />
        <text x={P5.x + dimOff + 12} y={(P5.y + P4.y) / 2 + 5} textAnchor="start"
              fill="#dc2626" fontSize="15" fontWeight="bold">
          {cutWidth} {dimUnit}
        </text>
      </svg>
    </div>
  );
}


// ============================================================
// SentenceDisplay — Segmented/gap/highlight/evidence sentences
// ============================================================
// Display-only component for English and VR word topics.
// Four modes:
//   segments  — sentence split into coloured cards, error highlighted
//   gap       — sentence with a styled blank or filled word
//   highlight — sentence with specific words underlined/coloured
//   evidence  — passage block with evidence sentence highlighted
//
// Props:
//   mode           — "segments" | "gap" | "highlight" | "evidence"
//   segments       — array of strings (segments mode)
//   errorIndex     — index of error segment (segments mode)
//   correctedSegment — corrected text for error segment (segments mode)
//   text           — sentence string (gap/highlight modes)
//   gapWord        — the word for the gap (gap mode)
//   gapHighlight   — "blank" | "correct" | "incorrect" (gap mode)
//   highlightWords — array of { word, color } (highlight mode)
//   passage        — passage text (evidence mode)
//   evidenceSentence — sentence to highlight (evidence mode)
//   evidenceColor  — highlight colour (evidence mode, default yellow)
//   fontSize       — text size class (default "text-lg")
//   label          — optional label above the display

export function SentenceDisplay({
  mode = "segments",
  segments = [],
  errorIndex = -1,
  correctedSegment = null,
  text = "",
  gapWord = "",
  gapHighlight = "blank",
  highlightWords = [],
  passage = "",
  evidenceSentence = "",
  evidenceColor = "#fef08a",
  fontSize = "text-lg",
  label = null
}) {
  // ── Segments mode ──
  if (mode === "segments") {
    return (
      <div className="space-y-2">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        <div className="flex flex-wrap gap-2">
          {segments.map((seg, i) => {
            const isError = i === errorIndex;
            const bg = isError ? 'bg-red-50 border-red-300' : 'bg-[#EDE8FF]/50 border-[#A29BFE]/40';
            const textColor = isError ? 'text-red-700' : 'text-gray-800';
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`px-3 py-2 rounded-lg border-2 ${bg} ${fontSize} font-medium ${textColor}`}>
                  {seg}
                </div>
                {isError && correctedSegment && (
                  <div className="px-3 py-1.5 rounded-lg border-2 bg-green-50 border-green-300 text-green-700 text-sm font-bold">
                    ✓ {correctedSegment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Gap mode ──
  if (mode === "gap") {
    const pillStyle = gapHighlight === "blank"
      ? "border-2 border-dashed border-[#6C5CE7] bg-[#EDE8FF]/50 text-[#A29BFE] px-4 py-0.5 rounded-full inline-block min-w-[80px] text-center"
      : gapHighlight === "correct"
      ? "bg-green-100 text-green-800 font-bold px-3 py-0.5 rounded-full inline-block border-2 border-green-400"
      : "bg-red-100 text-red-700 font-bold px-3 py-0.5 rounded-full inline-block border-2 border-red-300 line-through";
    const displayWord = gapHighlight === "blank" ? "______" : gapWord;

    // Split text at the placeholder marker ___
    const parts = text.split(/___+/);
    return (
      <div className="space-y-2">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        <p className={`${fontSize} text-gray-800 leading-relaxed`}>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className={pillStyle}>{displayWord}</span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    );
  }

  // ── Highlight mode ──
  if (mode === "highlight") {
    // Build regex from highlight words
    const words = highlightWords.map(hw => typeof hw === 'string' ? { word: hw, color: '#6C5CE7' } : hw);
    if (words.length === 0) {
      return (
        <div className="w-full">
          {label && <p className="text-sm font-heading font-bold text-[#6C5CE7] mb-3 text-center">{label}</p>}
          <div className="bg-[#FAFBFF] border-2 border-[#EDE8FF] rounded-2xl p-5 shadow-sm">
            <p className={`${fontSize} text-[#2D3436] leading-relaxed text-center`}>{text}</p>
          </div>
        </div>
      );
    }
    const safeText = text || "";
    const validWords = words.filter(w => w && w.word);
    if (validWords.length === 0 || !safeText) return <p className={`${fontSize} leading-relaxed text-gray-800`}>{safeText}</p>;
    const pattern = new RegExp(`(${validWords.map(w => w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const splitParts = safeText.split(pattern);
    return (
      <div className="w-full">
        {label && <p className="text-sm font-heading font-bold text-[#6C5CE7] mb-3 text-center">{label}</p>}
        <div className="bg-[#FAFBFF] border-2 border-[#EDE8FF] rounded-2xl p-5 shadow-sm">
          <p className={`${fontSize} text-[#2D3436] leading-relaxed text-center`}>
            {splitParts.map((part, i) => {
              const match = validWords.find(w => w.word.toLowerCase() === part.toLowerCase());
              if (match) {
                return (
                  <span key={i} className="font-heading font-bold px-2 py-0.5 rounded-lg mx-0.5 inline-block"
                        style={{ background: `${match.color}15`, color: match.color }}>
                    {part}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        </div>
      </div>
    );
  }

  // ── Evidence mode ──
  if (mode === "evidence") {
    // Split passage into sentences, highlight the evidence one
    const sentences = passage.split(/(?<=[.!?])\s+/);
    return (
      <div>
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-base leading-relaxed text-gray-700">
          {sentences.map((sentence, i) => {
            const isEvidence = evidenceSentence && sentence.trim().includes(evidenceSentence.trim());
            return (
              <span key={i}
                    className={isEvidence ? "font-semibold rounded px-0.5" : ""}
                    style={isEvidence ? { backgroundColor: evidenceColor } : {}}>
                {sentence}{i < sentences.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}


// ============================================================
// LetterTiles — Scrabble-style letter tile display
// ============================================================
// For VR word-building topics + Spelling. Five display modes:
//   word     — letters as individual tiles with optional highlights/strikes
//   compound — two groups with + sign and = result
//   window   — letters in a row with coloured window spanning word boundary
//   gap      — tiles with dashed-border blanks for missing positions
//   shared   — multiple words with the same gap position filled
//
// Props:
//   mode, letters, highlightIndices, highlightColor, strikeIndices,
//   group1, group2, resultWord, topLetters, bottomLetters,
//   windowStart, windowEnd, foundWord, template, filledLetter,
//   showFilled, words, gapPosition, tileSize, label

export function LetterTiles({
  mode = "word",
  letters = [],
  highlightIndices = [],
  highlightColor = "#6C5CE7",
  strikeIndices = [],
  group1 = [],
  group2 = [],
  resultWord = "",
  topLetters = [],
  bottomLetters = [],
  windowStart = -1,
  windowEnd = -1,
  foundWord = "",
  template = [],
  filledLetter = "",
  showFilled = false,
  words = [],
  gapPosition = -1,
  tileSize = "w-10 h-10",
  label = null
}) {
  const tileBase = `${tileSize} rounded-lg border-2 flex items-center justify-center font-bold text-lg uppercase transition-all`;
  const normalTile = `${tileBase} bg-amber-50 border-amber-300 text-gray-900`;
  const blankTile = `${tileBase} border-dashed border-gray-400 bg-white text-gray-300`;
  const filledTile = `${tileBase} bg-green-50 border-green-400 text-green-700`;

  const renderTile = (letter, idx, opts = {}) => {
    const isHighlight = highlightIndices.includes(idx);
    const isStrike = strikeIndices.includes(idx);
    let cls = normalTile;
    let style = {};
    if (isHighlight) {
      cls = `${tileBase} border-2 text-white font-bold`;
      style = { backgroundColor: highlightColor, borderColor: highlightColor };
    }
    if (isStrike) {
      cls += ' line-through opacity-50';
    }
    if (opts.highlight) {
      cls = `${tileBase} border-2 text-white font-bold`;
      style = { backgroundColor: opts.highlightColor || highlightColor, borderColor: opts.highlightColor || highlightColor };
    }
    return (
      <div key={`${idx}-${letter}`} className={cls} style={style}>
        {letter}
      </div>
    );
  };

  // ── Word mode ──
  if (mode === "word") {
    return (
      <div>
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-2">{label}</p>}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {letters.map((l, i) => renderTile(l, i))}
        </div>
      </div>
    );
  }

  // ── Compound mode ──
  if (mode === "compound") {
    return (
      <div className="space-y-3">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex gap-1">{group1.map((l, i) => renderTile(l, i))}</div>
          <span className="text-2xl font-bold text-[#6C5CE7]">+</span>
          <div className="flex gap-1">{group2.map((l, i) => renderTile(l, i + 100))}</div>
        </div>
        {resultWord && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-[#6C5CE7]">=</span>
            <div className="flex gap-1">
              {resultWord.split('').map((l, i) => (
                <div key={i} className={`${tileBase} bg-green-50 border-green-400 text-green-800`}>{l}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Window mode ──
  if (mode === "window") {
    const allLetters = topLetters.length > 0 ? topLetters : letters;
    return (
      <div>
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-2">{label}</p>}
        <div className="flex gap-0.5 justify-center relative">
          {allLetters.map((l, i) => {
            const inWindow = i >= windowStart && i < windowEnd;
            return (
              <div key={i} className={`${tileBase} ${inWindow ? 'bg-yellow-100 border-yellow-400 text-yellow-800 ring-2 ring-yellow-300' : 'bg-amber-50 border-amber-300 text-gray-900'}`}>
                {l}
              </div>
            );
          })}
        </div>
        {foundWord && (
          <p className="text-center mt-2 text-green-700 font-bold text-lg">Found: {foundWord}</p>
        )}
      </div>
    );
  }

  // ── Gap mode ──
  if (mode === "gap") {
    return (
      <div className="space-y-2">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        <div className="flex gap-1.5 justify-center flex-wrap">
          {template.map((l, i) => {
            if (l === '_') {
              if (showFilled && filledLetter) {
                return <div key={i} className={filledTile}>{filledLetter}</div>;
              }
              return <div key={i} className={blankTile}>?</div>;
            }
            return <div key={i} className={normalTile}>{l}</div>;
          })}
        </div>
      </div>
    );
  }

  // ── Shared-pair mode (two-word pairs separated by ?) ──
  // Each word like "TE(?)RM" splits into two visible words: [T][E] ? [R][M]
  if (mode === "shared-pair") {
    return (
      <div className="space-y-3">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        {words.map((pair, wi) => {
          const pairStr = typeof pair === 'string' ? pair : '';
          const parts = pairStr.split('(?)');
          if (parts.length !== 2) return null;
          const leftLetters = parts[0].split('');
          const rightLetters = parts[1].split('');
          return (
            <div key={wi} className="flex items-center justify-center gap-0">
              {/* Left word group */}
              <div className="flex flex-col items-center">
                <div className="flex gap-1 bg-blue-50 rounded-lg px-3 py-2 border-2 border-blue-300">
                  {leftLetters.map((l, i) => (
                    <div key={`l${i}`} className={normalTile}>{l}</div>
                  ))}
                </div>
                <span className="text-xs text-blue-400 mt-1 font-medium">word 1</span>
              </div>
              {/* The shared letter gap — large visible separator */}
              <div className="mx-4 flex flex-col items-center">
                <div className="w-11 h-11 flex items-center justify-center rounded-lg border-2 border-dashed border-purple-400 bg-purple-50 text-purple-500 text-lg font-bold">?</div>
              </div>
              {/* Right word group */}
              <div className="flex flex-col items-center">
                <div className="flex gap-1 bg-green-50 rounded-lg px-3 py-2 border-2 border-green-300">
                  {rightLetters.map((l, i) => (
                    <div key={`r${i}`} className={normalTile}>{l}</div>
                  ))}
                </div>
                <span className="text-xs text-green-400 mt-1 font-medium">word 2</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Shared mode (multiple words with same gap) ──
  if (mode === "shared") {
    return (
      <div className="space-y-3">
        {label && <p className="text-sm font-bold text-[#6C5CE7] mb-1">{label}</p>}
        {words.map((wordObj, wi) => {
          const wordLetters = typeof wordObj === 'string' ? wordObj.split('') : (wordObj.letters || wordObj.word?.split('') || []);
          const gapIdx = typeof wordObj === 'object' && wordObj.gapIndex !== undefined ? wordObj.gapIndex : gapPosition;
          return (
            <div key={wi} className="flex gap-1.5 justify-center">
              {wordLetters.map((l, i) => {
                if (i === gapIdx) {
                  if (showFilled && filledLetter) {
                    return <div key={i} className={filledTile}>{filledLetter}</div>;
                  }
                  return <div key={i} className={blankTile}>?</div>;
                }
                return <div key={i} className={normalTile}>{l}</div>;
              })}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}


// ============================================================
// AlphabetLine — SVG alphabet line with hops and EJOTY
// ============================================================
// Like NumberLine but for letters A-Z. Shows letter positions,
// hop arrows between letters, and optional EJOTY highlights.
//
// Props:
//   startLetter, endLetter — range to show (default A-Z or subset)
//   points       — array of { letter, label, color }
//   hops         — array of { from, to, label } (arc arrows)
//   showEJOTY    — highlight EJOTY positions
//   showPositionNumbers — show position numbers below letters

export function AlphabetLine({
  startLetter = 'A',
  endLetter = 'Z',
  points = [],
  hops = [],
  showEJOTY = true,
  showPositionNumbers = true
}) {
  // Smart range: auto-calculate from points + hops if using default A-Z
  let startCode = startLetter.toUpperCase().charCodeAt(0) - 64; // A=1
  let endCode = endLetter.toUpperCase().charCodeAt(0) - 64;

  // Only use full A-Z when explicitly showing position numbers (letter sums context)
  // Otherwise, auto-narrow the range from data with a buffer
  const useFullRange = showPositionNumbers && showEJOTY;
  if (!useFullRange && startCode === 1 && endCode === 26) {
    // Collect all referenced letter positions
    const usedCodes = new Set();
    for (const p of points) {
      if (p.letter) usedCodes.add(p.letter.toUpperCase().charCodeAt(0) - 64);
    }
    for (const h of hops) {
      if (h.from) usedCodes.add(h.from.toUpperCase().charCodeAt(0) - 64);
      if (h.to) usedCodes.add(h.to.toUpperCase().charCodeAt(0) - 64);
    }
    if (usedCodes.size > 0) {
      const minUsed = Math.min(...usedCodes);
      const maxUsed = Math.max(...usedCodes);
      // Buffer of 3 letters each side, but include any nearby EJOTY if showEJOTY
      let newStart = Math.max(1, minUsed - 3);
      let newEnd = Math.min(26, maxUsed + 3);
      // If showEJOTY, extend to include nearest EJOTY boundaries
      if (showEJOTY) {
        const ejoty = [5, 10, 15, 20, 25];
        const nearestBefore = ejoty.filter(e => e >= newStart - 2 && e <= minUsed);
        const nearestAfter = ejoty.filter(e => e >= maxUsed && e <= newEnd + 2);
        if (nearestBefore.length > 0) newStart = Math.min(newStart, Math.min(...nearestBefore));
        if (nearestAfter.length > 0) newEnd = Math.max(newEnd, Math.max(...nearestAfter));
      }
      // Minimum span of 10 letters for readability
      const span = newEnd - newStart;
      if (span < 9) {
        const extra = Math.ceil((9 - span) / 2);
        newStart = Math.max(1, newStart - extra);
        newEnd = Math.min(26, newEnd + extra);
      }
      // Always include A and Z so the child sees the full alphabet boundaries
      newStart = 1;
      newEnd = 26;
      startCode = newStart;
      endCode = newEnd;
    }
  }

  const letters = [];
  for (let i = startCode; i <= endCode; i++) {
    letters.push({ char: String.fromCharCode(64 + i), pos: i });
  }

  const ejoty = [5, 10, 15, 20, 25]; // E, J, O, T, Y
  const letterCount = endCode - startCode + 1;

  // Fixed dimensions — identical for every AlphabetLine instance (matches NumberLine)
  const width = 560;
  const height = 170;
  const lineY = 100;
  const padding = 30;
  const lineWidth = width - 2 * padding;
  const toX = (pos) => padding + ((pos - startCode) / Math.max(endCode - startCode, 1)) * lineWidth;

  // Adaptive font sizing based on letter count
  const letterFontSize = letterCount > 20 ? 16 : letterCount > 14 ? 19 : 24;
  const ejotyFontSize = letterCount > 20 ? 18 : letterCount > 14 ? 22 : 26;
  const posNumFontSize = letterCount > 20 ? 13 : letterCount > 14 ? 15 : 17;
  const hopLabelFontSize = letterCount > 20 ? 22 : 26;
  const pointRadius = letterCount > 20 ? 10 : letterCount > 14 ? 12 : 14;

  // Cap hop arc heights to fit within the fixed frame
  const maxHopHeight = lineY - 18 - hopLabelFontSize - 8;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full block">
        <defs>
          <marker id="al-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#5A4BD1" />
          </marker>
        </defs>

        {/* Main line */}
        <line x1={padding - 5} y1={lineY} x2={width - padding + 5} y2={lineY}
              stroke="#6C5CE7" strokeWidth={4} strokeLinecap="round" />

        {/* Letters BELOW the line, hops ABOVE — no overlap */}
        {letters.map((l) => {
          const x = toX(l.pos);
          const isEJOTY = ejoty.includes(l.pos);
          const isPoint = points.some(p => p.letter?.toUpperCase() === l.char);
          const pointData = points.find(p => p.letter?.toUpperCase() === l.char);

          return (
            <g key={l.char}>
              <line x1={x} y1={lineY - 14} x2={x} y2={lineY + 14}
                    stroke={isEJOTY && showEJOTY ? "#16a34a" : "#6C5CE7"} strokeWidth={isEJOTY && showEJOTY ? 3.5 : 2.5} />
              {/* Letter labels sit BELOW the line */}
              <text x={x} y={lineY + 38} textAnchor="middle"
                    fill={isPoint ? (pointData?.color || "#dc2626") : isEJOTY && showEJOTY ? "#16a34a" : "#6b7280"}
                    fontSize={isEJOTY && showEJOTY ? ejotyFontSize : letterFontSize}
                    fontWeight={(isEJOTY && showEJOTY) || isPoint ? "bold" : "normal"}>
                {l.char}
              </text>
              {showPositionNumbers && (
                <text x={x} y={lineY + 58} textAnchor="middle"
                      fill={isEJOTY && showEJOTY ? "#16a34a" : "#9ca3af"}
                      fontSize={posNumFontSize} fontWeight={isEJOTY && showEJOTY ? "bold" : "normal"}>
                  {l.pos}
                </text>
              )}
              {isPoint && (
                <circle cx={x} cy={lineY} r={pointRadius}
                        fill={pointData?.color || "#dc2626"} stroke="white" strokeWidth={3} />
              )}
            </g>
          );
        })}

        {/* Hop arrows — full space above the line, no overlap with letters */}
        {hops.map((hop, i) => {
          const fromCode = hop.from.toUpperCase().charCodeAt(0) - 64;
          const toCode = hop.to.toUpperCase().charCodeAt(0) - 64;
          const x1 = toX(fromCode);
          const x2 = toX(toCode);
          const midX = (x1 + x2) / 2;
          const arcH = Math.min(maxHopHeight, Math.abs(x2 - x1) * 0.35);
          return (
            <g key={`hop-${i}`}>
              <path
                d={`M ${x1} ${lineY - 18} Q ${midX} ${lineY - 18 - arcH} ${x2} ${lineY - 18}`}
                fill="none" stroke="#5A4BD1" strokeWidth={2.5}
                markerEnd="url(#al-arrow)"
              />
              {hop.label && (
                <text x={midX} y={lineY - 30 - arcH} textAnchor="middle"
                      fill="#6C5CE7" fontSize={hopLabelFontSize > 22 ? 18 : hopLabelFontSize} fontWeight="bold">
                  {hop.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ============================================================
// SlidingWindow — interactive hidden word finder
// ============================================================
// The child drags a purple window across letter tiles to find the hidden word.
// Props:
//   word1        — first word (e.g. "STOP")
//   word2        — second word (e.g. "ENGINES")
//   hiddenWord   — the hidden word (e.g. "OPEN")
//   windowSize   — how many letters the window covers (default: hiddenWord.length)
//   label        — optional label below

export function SlidingWindow({
  word1 = "STOP",
  word2 = "ENGINES",
  hiddenWord = "OPEN",
  windowSize = 0,
  reversed = false,
  label = null
}) {
  const w1 = word1.toUpperCase();
  const w2 = word2.toUpperCase();
  const hidden = hiddenWord.toUpperCase();
  const winSize = windowSize || hidden.length;

  // Build letter array: word1 letters, then word2 letters (no gap — they sit side by side)
  const letters = [...w1.split(''), ...w2.split('')];
  const boundary = w1.length; // index where word2 starts
  const maxPos = letters.length - winSize; // max window start position

  const [windowPos, setWindowPos] = useState(0);
  const [found, setFound] = useState(false);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  // Get the letters currently under the window (skip any gap)
  const currentLetters = letters.slice(windowPos, windowPos + winSize).join('');
  const currentReversed = currentLetters.split('').reverse().join('');
  const displayLetters = reversed ? currentReversed : currentLetters;
  const isCorrect = displayLetters === hidden;

  // When window lands on the correct position
  const checkFound = useCallback((pos) => {
    const selected = letters.slice(pos, pos + winSize).join('');
    const check = reversed ? selected.split('').reverse().join('') : selected;
    if (check === hidden && !found) setFound(true);
  }, [letters, winSize, hidden, found]);

  // Convert pointer X to window position
  const getPositionFromX = useCallback((clientX) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const cellTotal = rect.width / letters.length;
    const pos = Math.round(relX / cellTotal - winSize / 2);
    return Math.max(0, Math.min(maxPos, pos));
  }, [letters.length, winSize, maxPos]);

  const handlePointerDown = (e) => {
    dragging.current = true;
    const pos = getPositionFromX(e.clientX || e.touches?.[0]?.clientX);
    setWindowPos(pos);
    checkFound(pos);
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const pos = getPositionFromX(e.clientX || e.touches?.[0]?.clientX);
    setWindowPos(pos);
    checkFound(pos);
    e.preventDefault();
  };

  const handlePointerUp = () => { dragging.current = false; };

  const cellW = Math.min(40, Math.floor(320 / letters.length));
  const cellH = 48;
  const gap = 2;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Found indicator */}
      {found && (
        <p className="text-xs text-green-600 mb-2 font-bold">You found it!</p>
      )}

      {/* Letter tiles with draggable window */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ userSelect: 'none' }}
      >
        <div className="flex">
          {letters.map((letter, i) => {
            const inWindow = i >= windowPos && i < windowPos + winSize;
            const isBoundary = i === boundary;
            return (
              <div
                key={i}
                className={`flex items-center justify-center font-mono font-bold text-lg transition-colors duration-100 ${
                  inWindow
                    ? isCorrect && found
                      ? 'bg-green-500 text-white'
                      : 'bg-[#6C5CE7] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  width: cellW,
                  height: cellH,
                  marginLeft: isBoundary ? 6 : gap,
                  marginRight: gap,
                  borderRadius: 6,
                  border: inWindow
                    ? isCorrect && found ? '2px solid #16a34a' : '2px solid #5A4BD1'
                    : '1px solid #d1d5db',
                  fontSize: cellW < 30 ? 14 : 18,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>

        {/* Word boundary marker */}
        <div
          className="absolute top-0 text-gray-300 font-bold text-xs"
          style={{
            left: boundary * (cellW + gap * 2) + gap - 1,
            height: cellH,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          |
        </div>
      </div>

      {/* Current selection display */}
      <div className={`mt-3 px-4 py-2 rounded-lg font-heading font-bold text-lg transition-all ${
        isCorrect && found
          ? 'bg-green-100 text-green-700 border-2 border-green-400'
          : isCorrect
          ? 'bg-purple-100 text-[#6C5CE7] border-2 border-[#6C5CE7] animate-pulse'
          : 'bg-gray-100 text-gray-600 border border-gray-200'
      }`}>
        {reversed ? `${currentLetters} → ${displayLetters}` : displayLetters || '...'}
        {isCorrect && found && ' ✓'}
        {isCorrect && !found && ' — is this a word?'}
      </div>

      {/* Word labels */}
      <div className="flex gap-4 mt-2 text-xs text-gray-400">
        <span>{w1}</span>
        <span>{w2}</span>
      </div>

      {label && (
        <p className="text-sm font-heading font-bold text-[#6C5CE7] mt-2 text-center">{label}</p>
      )}
    </div>
  );
}


// ============================================================
// LogicDiagram — shows items in a ranked order with arrows
// ============================================================
// Props:
//   items       — array of strings in order (top = highest/most)
//   topLabel    — label for the top end (e.g. "Tallest", "Fastest", "Most")
//   bottomLabel — label for the bottom end (e.g. "Shortest", "Slowest", "Fewest")
//   highlight   — optional item to highlight as the answer
//   clues       — optional array of clue strings to show above

export function LogicDiagram({
  items = [],
  topLabel = "",
  bottomLabel = "",
  highlight = null,
  clues = []
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Clues */}
      {clues.length > 0 && (
        <div className="w-full bg-[#FAFBFF] border border-[#EDE8FF] rounded-lg p-3 mb-3">
          <p className="text-xs font-bold text-[#6C5CE7] mb-1">Clues:</p>
          {clues.map((clue, i) => (
            <p key={i} className="text-sm text-gray-700">{i + 1}. {clue}</p>
          ))}
        </div>
      )}

      {/* Top label */}
      {topLabel && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{topLabel}</p>
      )}

      {/* Ranked items */}
      <div className="flex flex-col items-center gap-1">
        {items.map((item, i) => {
          const isHighlighted = highlight && item.toLowerCase() === highlight.toLowerCase();
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`px-6 py-2.5 rounded-lg font-heading font-bold text-base min-w-[140px] text-center transition-all ${
                isHighlighted
                  ? 'bg-[#6C5CE7] text-white shadow-md'
                  : 'bg-[#EDE8FF] text-[#2D3436]'
              }`}>
                {item}
              </div>
              {i < items.length - 1 && (
                <div className="flex flex-col items-center my-0.5">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 2 L8 11 M4 8 L8 12 L12 8" stroke="#A29BFE" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      {bottomLabel && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">{bottomLabel}</p>
      )}
    </div>
  );
}


// ============================================================
// CodeTable — Word-to-code / letter-to-number mapping table
// ============================================================
// Props:
//   headers    — array of column header strings
//   rows       — array of { cells: [...], highlight: bool }
//   showRule   — whether to show a rule label below
//   ruleLabel  — text for the rule
//   compact    — smaller font/padding
//   headerColor — header background colour (default purple)

export function CodeTable({
  headers = [],
  rows = [],
  showRule = false,
  ruleLabel = "",
  compact = false,
  headerColor = "bg-[#EDE8FF]"
}) {
  const cellPad = compact ? 'px-2 py-1.5' : 'px-4 py-2.5';
  const fontSize = compact ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-col items-center">
      <div className="inline-block rounded-xl overflow-hidden border-2 border-[#A29BFE]/40 shadow-md">
        <table className="border-collapse">
          {headers.length > 0 && (
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className={`${headerColor} border-2 border-[#A29BFE]/40 ${cellPad} ${fontSize} font-bold text-[#2D3436]`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={row.highlight ? 'bg-yellow-50' : ''}>
                {(row.cells || []).map((cell, ci) => (
                  <td key={ci} className={`border-2 border-[#A29BFE]/40 ${cellPad} ${fontSize} font-semibold text-center ${
                    row.highlight ? 'text-[#5A4BD1]' : 'text-gray-900'
                  } bg-white`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showRule && ruleLabel && (
        <p className="mt-2 text-sm font-bold text-[#6C5CE7] text-center">{ruleLabel}</p>
      )}
    </div>
  );
}


// ============================================================
// SequenceChain — Terms in boxes with difference arrows
// ============================================================
// Props:
//   terms          — array of values (numbers or strings)
//   differences    — array of difference labels between terms
//   showDifferences — whether to show difference arrows
//   nextValue      — value for the "?" box
//   showNext       — whether to show the next/answer box
//   nextDifference — difference label before the next box
//   showNextDifference — whether to show the next difference
//   highlightTerms — indices of terms to highlight

export function SequenceChain({
  terms = [],
  differences = [],
  showDifferences = false,
  nextValue = "?",
  showNext = true,
  nextDifference = "",
  showNextDifference = false,
  highlightTerms = []
}) {
  const allItems = [...terms];
  if (showNext) allItems.push(nextValue);
  const allDiffs = [...differences];
  if (showNextDifference && nextDifference) allDiffs.push(nextDifference);

  return (
    <div className="flex flex-col items-center">
      {/* Difference arrows row */}
      {showDifferences && allDiffs.length > 0 && (
        <div className="flex items-center justify-center mb-1">
          <div className="w-14" /> {/* spacer for first box */}
          {allDiffs.map((diff, i) => (
            <React.Fragment key={`diff-${i}`}>
              <div className="flex flex-col items-center px-1" style={{ minWidth: '28px' }}>
                <span className="text-xs font-bold text-[#6C5CE7]">{diff}</span>
                <span className="text-[#A29BFE] text-xs">→</span>
              </div>
              {i < allDiffs.length - 1 || (showNext && i === allDiffs.length - 1) ? (
                <div className="w-14" /> /* spacer for next box */
              ) : null}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Terms row */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {terms.map((term, i) => {
          const isHighlighted = highlightTerms.includes(i);
          return (
            <React.Fragment key={`term-${i}`}>
              <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-bold text-lg ${
                isHighlighted
                  ? 'bg-[#EDE8FF] border-[#6C5CE7] text-[#5A4BD1]'
                  : 'bg-white border-[#A29BFE]/40 text-gray-900'
              }`}>
                {term}
              </div>
              {(i < terms.length - 1 || showNext) && i < terms.length - 1 && (
                <div className="text-[#A29BFE] font-bold text-lg">→</div>
              )}
            </React.Fragment>
          );
        })}
        {showNext && (
          <>
            {terms.length > 0 && <div className="text-[#A29BFE] font-bold text-lg">→</div>}
            <div className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center font-bold text-lg ${
              nextValue !== "?" ? 'bg-green-50 border-green-400 text-green-700' : 'border-[#A29BFE] text-[#A29BFE] bg-[#EDE8FF]/50'
            }`}>
              {nextValue}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ============================================================
// AnalogyDisplay — Visual pair-matching card for verbal analogies
// ============================================================
// Shows two word pairs in a structured card layout:
//   word1 → word2    word3 → ???
// Much more visually clear than inline text.
//
// Props:
//   pair1         — [word1, word2] (the known pair)
//   pair2word     — the first word of the unknown pair
//   answer        — the answer word (null = show "???")
//   relationship  — optional relationship label
//   pair1Color    — colour for pair 1 words (default brand violet)
//   pair2Color    — colour for pair 2 word (default red)
//   label         — optional label above the display

export function AnalogyDisplay({
  pair1 = [],
  pair2word = "",
  answer = null,
  relationship = null,
  pair1Color = "#6C5CE7",
  pair2Color = "#dc2626",
  label = null,
  mode = "analogy"  // "analogy" = →, "antonym" = ↔
}) {
  const ArrowIcon = ({ color }) => mode === "antonym" ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M4 12h16m-12-5l-4 5 4 5m8-10l4 5-4 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M5 12h14m-6-6l6 6-6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-heading font-bold text-[#6C5CE7] mb-3 text-center">{label}</p>
      )}
      <div className="bg-[#FAFBFF] border-2 border-[#EDE8FF] rounded-2xl p-5 shadow-sm">
        {mode === "antonym" ? (
          /* Antonym mode — single pair: word ↔ ??? */
          <div className="flex items-center justify-center gap-3">
            <span
              className="font-heading font-bold text-xl px-4 py-2 rounded-xl"
              style={{ background: `${pair1Color}15`, color: pair1Color }}
            >
              {pair1[0] || pair2word}
            </span>
            <ArrowIcon color={pair1Color} />
            <span
              className="font-heading font-bold text-xl px-4 py-2 rounded-xl border-2 border-dashed"
              style={{
                background: answer ? `${pair2Color}15` : '#FAFBFF',
                color: answer ? pair2Color : '#A29BFE',
                borderColor: answer ? 'transparent' : '#A29BFE'
              }}
            >
              {answer || '???'}
            </span>
          </div>
        ) : (
          /* Analogy mode — two pairs: word → word | word → ??? */
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className="font-heading font-bold text-xl px-4 py-2 rounded-xl"
                style={{ background: `${pair1Color}15`, color: pair1Color }}
              >
                {pair1[0]}
              </span>
              <ArrowIcon color={pair1Color} />
              <span
                className="font-heading font-bold text-xl px-4 py-2 rounded-xl"
                style={{ background: `${pair1Color}15`, color: pair1Color }}
              >
                {pair1[1]}
              </span>
            </div>

            <div className="hidden sm:block w-px h-10 bg-[#EDE8FF]" />
            <div className="sm:hidden h-px w-16 bg-[#EDE8FF]" />

            <div className="flex items-center gap-3">
              <span
                className="font-heading font-bold text-xl px-4 py-2 rounded-xl"
                style={{ background: `${pair2Color}15`, color: pair2Color }}
              >
                {pair2word}
              </span>
              <ArrowIcon color={pair2Color} />
              <span
                className="font-heading font-bold text-xl px-4 py-2 rounded-xl border-2 border-dashed"
                style={{
                  background: answer ? `${pair2Color}15` : '#FAFBFF',
                  color: answer ? pair2Color : '#A29BFE',
                  borderColor: answer ? 'transparent' : '#A29BFE'
                }}
              >
                {answer || '???'}
              </span>
            </div>
          </div>
        )}

        {relationship && (
          <p className="text-center text-sm font-medium text-[#636E72] mt-3 pt-3 border-t border-[#EDE8FF]">
            Relationship: <span className="font-bold text-[#2D3436]">{relationship}</span>
          </p>
        )}
      </div>
    </div>
  );
}


// ============================================================
// WordChipsDisplay — Grid of word chips/pills
// ============================================================
// Used for Odd Two Out, where 5 words need to be shown as
// individual chips rather than inline text.
//
// Props:
//   words        — array of words to display
//   highlighted  — array of words to highlight (optional)
//   highlightColor — colour for highlighted words
//   label        — optional label above

export function WordChipsDisplay({
  words = [],
  highlighted = [],
  highlightColor = "#6C5CE7",
  label = null
}) {
  const isHighlighted = (w) => highlighted.some(h => h.toLowerCase() === w.toLowerCase());

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-heading font-bold text-[#6C5CE7] mb-3 text-center">{label}</p>
      )}
      <div className="bg-[#FAFBFF] border-2 border-[#EDE8FF] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {words.map((word, i) => (
            <span
              key={i}
              className="font-heading font-bold text-lg px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: isHighlighted(word) ? `${highlightColor}15` : '#EDE8FF',
                color: isHighlighted(word) ? highlightColor : '#2D3436',
                border: `2px solid ${isHighlighted(word) ? `${highlightColor}40` : 'transparent'}`
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SDTTriangle — Speed / Distance / Time triangle diagram
// ============================================================
// A triangle divided horizontally: D on top, S and T on the bottom.
// Can highlight (cover) one section to show which formula to use.
//
// Props:
//   cover    — which letter to cover: "S", "D", "T", or null (show all)
//   size     — width/height in px (default 200)
//   label    — optional label below the triangle

export function SDTTriangle({
  cover = null,
  size = 200,
  label = null
}) {
  const w = size;
  const h = size * 0.85;
  const midX = w / 2;
  const midY = h * 0.52; // horizontal divider line

  // Triangle points
  const top = `${midX},${h * 0.05}`;
  const bottomLeft = `${w * 0.05},${h * 0.95}`;
  const bottomRight = `${w * 0.95},${h * 0.95}`;

  // Is this section covered?
  const isCovered = (letter) => cover && cover.toUpperCase() === letter;

  // Letter positions (for labels and cover circles)
  const dPos = { x: midX, y: midY * 0.6 };
  const sPos = { x: midX * 0.5, y: (midY + h * 0.95) / 2 };
  const tPos = { x: midX * 1.5, y: (midY + h * 0.95) / 2 };
  const coverRadius = size * 0.12;

  const fontSize = size * 0.15;
  const smallFontSize = size * 0.1;

  return (
    <div className="flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Main triangle outline */}
        <polygon
          points={`${top} ${bottomLeft} ${bottomRight}`}
          fill="#EDE8FF"
          stroke="#6C5CE7"
          strokeWidth="2.5"
        />



        {/* Cover overlays — simple circles over the letter, like covering with your thumb */}
        {isCovered("D") && (
          <circle cx={dPos.x} cy={dPos.y} r={coverRadius} fill="#6C5CE7" opacity="0.9" />
        )}
        {isCovered("S") && (
          <circle cx={sPos.x} cy={sPos.y} r={coverRadius} fill="#6C5CE7" opacity="0.9" />
        )}
        {isCovered("T") && (
          <circle cx={tPos.x} cy={tPos.y} r={coverRadius} fill="#6C5CE7" opacity="0.9" />
        )}

        {/* D label (top section) */}
        <text
          x={dPos.x}
          y={dPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          fill={isCovered("D") ? "white" : "#2D3436"}
        >
          D
        </text>

        {/* S label (bottom-left) */}
        <text
          x={sPos.x}
          y={sPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          fill={isCovered("S") ? "white" : "#2D3436"}
        >
          S
        </text>

        {/* Multiply sign between S and T */}
        <text
          x={midX}
          y={(midY + h * 0.95) / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={smallFontSize}
          fill="#6C5CE7"
        >
          x
        </text>

        {/* T label (bottom-right) */}
        <text
          x={tPos.x}
          y={tPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          fill={isCovered("T") ? "white" : "#2D3436"}
        >
          T
        </text>

        {/* Divide sign on the horizontal line */}
        <text
          x={midX}
          y={midY + fontSize * 0.15}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={smallFontSize}
          fill="#6C5CE7"
          fontWeight="bold"
        >
          ÷
        </text>
      </svg>
      {label && (
        <p className="text-sm font-heading font-bold text-[#6C5CE7] mt-2 text-center">{label}</p>
      )}
    </div>
  );
}


// ============================================================
// Simple fade-in keyframes (injected once)
// ============================================================
// ============================================================
// AngleDisplay — draws angles from a common vertex with arcs + labels
// Props:
//   angles  — array of { value (degrees), label, color }
//             angles are drawn sequentially from horizontal right
//   size    — SVG width in px (default 220)
// Usage:
//   Single angle:   angles={[{ value: 60, label: "60°", color: "#818cf8" }]}
//   Straight line:  angles={[{ value: 65, label: "65°" }, { value: 115, label: "115°" }]}
//   Angle types:    Use multiple AngleDisplay instances in bodyParts
// ============================================================
export function AngleDisplay({
  angles = [{ value: 60, label: "60°", color: "#818cf8" }]
}) {
  const DEG = Math.PI / 180;
  // Single angle: fixed 320x200 viewBox. Multi-angle: auto-fit.
  const isSingle = angles.length === 1;
  const totalAngle = angles.reduce((s, a) => s + a.value, 0);
  const isReflex = totalAngle > 180;

  // Geometry constants
  const rayLen = isSingle ? 130 : 130;
  const arcR = 40;

  // For single angles, use fixed viewBox with vertex bottom-left
  // For multi-angle (e.g. two angles on a straight line), auto-fit
  if (isSingle) {
    const a = angles[0];
    const color = a.color || "#818cf8";
    const val = a.value;

    // Fixed viewBox — all single-angle diagrams render at exact same scale
    const vw = 320, vh = 200;
    // Vertex position depends on angle type
    let cx, cy;
    if (val > 180) {
      // Reflex: vertex more central since rays go below
      cx = 140; cy = 120;
    } else if (val > 90) {
      // Obtuse/straight: ray points left, so shift vertex right to fit both rays
      const leftExtent = -rayLen * Math.cos(val * DEG); // how far left ray1 goes
      const rightExtent = rayLen; // ray0 goes fully right
      const totalW = leftExtent + rightExtent;
      const margin = 16;
      cx = margin + leftExtent * ((vw - 2 * margin) / totalW);
      cy = vh - 24;
    } else {
      // Acute/right: vertex bottom-left works fine
      cx = 40; cy = vh - 24;
    }

    const toXY = (deg, r) => ({
      x: cx + r * Math.cos(deg * DEG),
      y: cy - r * Math.sin(deg * DEG)
    });

    const ray0 = toXY(0, rayLen);
    const ray1 = toXY(val, rayLen);
    const arcStart = toXY(0, arcR);
    const arcEnd = toXY(val, arcR);
    const largeArc = val > 180 ? 1 : 0;

    // Right angle square
    const isRight = val === 90;
    const sq = 20;
    let squarePoints = null;
    if (isRight) {
      const p1 = toXY(0, sq);
      const corner = {
        x: cx + sq * Math.cos(0) + sq * Math.cos(90 * DEG),
        y: cy - sq * Math.sin(0) - sq * Math.sin(90 * DEG)
      };
      const p2 = toXY(90, sq);
      squarePoints = `${p1.x},${p1.y} ${corner.x},${corner.y} ${p2.x},${p2.y}`;
    }

    const isUnknown = a.label && a.label.includes('?');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0', gap: 6 }}>
        <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: '100%', maxWidth: 400, height: 'auto' }}>
          {/* Subtle radial glow behind the angle */}
          <defs>
            <radialGradient id={`glow-${val}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={rayLen * 0.7} fill={`url(#glow-${val})`} />
          {/* Rays */}
          <line x1={cx} y1={cy} x2={ray0.x} y2={ray0.y} stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={ray1.x} y2={ray1.y} stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
          {/* Vertex dot */}
          <circle cx={cx} cy={cy} r={5} fill="#1e293b" />
          {/* Arc or square */}
          {isRight ? (
            <polyline points={squarePoints} fill={`${color}30`} stroke={color} strokeWidth={2.5} />
          ) : (
            <path
              d={`M ${cx},${cy} L ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 ${largeArc},0 ${arcEnd.x},${arcEnd.y} Z`}
              fill={`${color}30`} stroke={color} strokeWidth={2.5}
            />
          )}
        </svg>
        {/* Label below the diagram — always clear, never overlapping */}
        {a.label && (
          <span style={{
            fontSize: 18,
            fontWeight: 800,
            color: isUnknown ? '#dc2626' : color,
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
          }}>
            {a.label}
          </span>
        )}
      </div>
    );
  }

  // ---- Multi-angle mode (e.g. two angles on a straight line) ----
  const pad = 40;
  const pt = (deg, r) => [r * Math.cos(deg * DEG), -r * Math.sin(deg * DEG)];

  const rayAngles = [0];
  let cum = 0;
  for (const a of angles) { cum += a.value; rayAngles.push(cum); }

  // --- Step 1: Calculate initial label positions along bisectors ---
  const labelData = angles.map((a, i) => {
    const startDeg = angles.slice(0, i).reduce((s, x) => s + x.value, 0);
    const midDeg = startDeg + a.value / 2;
    // Base distance: further out for smaller angles
    let dist = a.value < 30 ? arcR + 65 : a.value < 60 ? arcR + 50 : arcR + 40;
    const lPt = pt(midDeg, dist);
    // Estimate label width based on text length
    const estW = (a.label || '').length * 11 + 10;
    return { midDeg, dist, x: lPt[0], y: lPt[1], angle: a, w: Math.max(estW, 60), h: 28 };
  });

  // --- Step 2: Label-to-label collision avoidance ---
  // Push overlapping labels further out along their bisectors
  for (let iter = 0; iter < 12; iter++) {
    let anyMoved = false;
    for (let i = 0; i < labelData.length; i++) {
      for (let j = i + 1; j < labelData.length; j++) {
        const li = labelData[i], lj = labelData[j];
        const dx = Math.abs(li.x - lj.x), dy = Math.abs(li.y - lj.y);
        const minSepX = (li.w + lj.w) / 2;
        const minSepY = (li.h + lj.h) / 2;
        if (dx < minSepX && dy < minSepY) {
          // Push BOTH labels apart — the closer one more, the further one less
          const distI = Math.sqrt(li.x * li.x + li.y * li.y);
          const distJ = Math.sqrt(lj.x * lj.x + lj.y * lj.y);
          const closer = distI < distJ ? li : lj;
          const further = distI < distJ ? lj : li;
          closer.dist += 22;
          further.dist += 8;
          const cPt = pt(closer.midDeg, closer.dist);
          closer.x = cPt[0]; closer.y = cPt[1];
          const fPt = pt(further.midDeg, further.dist);
          further.x = fPt[0]; further.y = fPt[1];
          anyMoved = true;
        }
      }
    }
    if (!anyMoved) break;
  }

  // --- Step 3: Label-to-ray collision avoidance ---
  // Check all 4 corners of each label bounding box against each ray
  for (let iter = 0; iter < 8; iter++) {
    let anyMoved = false;
    for (const lbl of labelData) {
      for (const rayDeg of rayAngles) {
        const rx = Math.cos(rayDeg * DEG), ry = -Math.sin(rayDeg * DEG);
        // Check all 4 corners of label bounding box
        const corners = [
          [lbl.x - lbl.w / 2, lbl.y - lbl.h / 2],
          [lbl.x + lbl.w / 2, lbl.y - lbl.h / 2],
          [lbl.x - lbl.w / 2, lbl.y + lbl.h / 2],
          [lbl.x + lbl.w / 2, lbl.y + lbl.h / 2]
        ];
        let tooClose = false;
        for (const [cx, cy] of corners) {
          const d = cx * rx + cy * ry;
          if (d < 10 || d > rayLen) continue;
          const clX = d * rx, clY = d * ry;
          const perpDist = Math.sqrt((cx - clX) ** 2 + (cy - clY) ** 2);
          if (perpDist < 12) { tooClose = true; break; }
        }
        if (tooClose) {
          lbl.dist += 18;
          const newPt = pt(lbl.midDeg, lbl.dist);
          lbl.x = newPt[0]; lbl.y = newPt[1];
          anyMoved = true;
        }
      }
    }
    if (!anyMoved) break;
  }

  // --- Step 4: Build bounding box from all elements ---
  const bbPoints = [[0, 0]];
  for (const a of rayAngles) { bbPoints.push(pt(a, rayLen)); }
  for (const lbl of labelData) {
    bbPoints.push([lbl.x - lbl.w / 2, lbl.y - lbl.h / 2]);
    bbPoints.push([lbl.x + lbl.w / 2, lbl.y + lbl.h / 2]);
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of bbPoints) {
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;

  const svgW = maxX - minX;
  const svgH = maxY - minY;
  const cx = -minX;
  const cy = -minY;
  const toXY = (deg, r) => ({ x: cx + r * Math.cos(deg * DEG), y: cy - r * Math.sin(deg * DEG) });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', maxWidth: 480, height: 'auto' }}>
        {rayAngles.map((a, i) => {
          const end = toXY(a, rayLen);
          return <line key={`r${i}`} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />;
        })}
        <circle cx={cx} cy={cy} r={5} fill="#1e293b" />
        {angles.map((a, i) => {
          const startDeg = angles.slice(0, i).reduce((s, x) => s + x.value, 0);
          const endDeg = startDeg + a.value;
          const color = a.color || "#818cf8";
          const isUnknown = a.label && a.label.includes('?');
          const labelColor = isUnknown ? '#dc2626' : color;
          const arcStart = toXY(startDeg, arcR);
          const arcEnd = toXY(endDeg, arcR);
          const largeArc = a.value > 180 ? 1 : 0;
          const lbl = labelData[i];
          const lblPos = { x: cx + lbl.x, y: cy + lbl.y };
          const fontSize = Math.max(15, Math.min(22, 400 / svgW * 20));

          return (
            <g key={`a${i}`}>
              <path
                d={`M ${cx},${cy} L ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 ${largeArc},0 ${arcEnd.x},${arcEnd.y} Z`}
                fill={`${color}30`} stroke={color} strokeWidth={2.5}
              />
              {a.label && <text x={lblPos.x} y={lblPos.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={fontSize} fontWeight="800" fill={labelColor}>{a.label}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// QuadShape — draws a quadrilateral with labelled angles
// Props: angles = [90, 110, 80, 80], labels = ["90°", "110°", "80°", "?°"],
//        colors = ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
// ============================================================
export function QuadShape({
  angles = [90, 90, 90, 90],
  labels = [],
  colors = ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
}) {
  // Draw an irregular quadrilateral with angle arcs and labels
  // Vertices: bottom-left, bottom-right, top-right, top-left (clockwise from BL)
  const vw = 320, vh = 240;
  const pad = 40;
  // Predefined vertices for a nice irregular quad shape
  const vertices = [
    { x: pad + 10, y: vh - pad },        // bottom-left
    { x: vw - pad, y: vh - pad + 10 },   // bottom-right
    { x: vw - pad - 30, y: pad + 10 },   // top-right
    { x: pad + 40, y: pad }              // top-left
  ];

  const pts = vertices.map(v => `${v.x},${v.y}`).join(' ');
  const arcR = 26;
  const labelR = 42;
  const DEG = Math.PI / 180;

  // Centroid for reliable inward direction
  const centX = vertices.reduce((s, v) => s + v.x, 0) / 4;
  const centY = vertices.reduce((s, v) => s + v.y, 0) / 4;

  // Compute angle at each vertex for arc drawing
  const arcs = vertices.map((v, i) => {
    const prev = vertices[(i + 3) % 4];
    const next = vertices[(i + 1) % 4];
    // Angles of the two edges from this vertex
    const a1 = Math.atan2(prev.y - v.y, prev.x - v.x);
    const a2 = Math.atan2(next.y - v.y, next.x - v.x);
    // Bisector — pick the one pointing toward centroid
    let mid = (a1 + a2) / 2;
    const toCentroid = Math.atan2(centY - v.y, centX - v.x);
    // If bisector points away from centroid, flip it
    let diff = mid - toCentroid;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    if (Math.abs(diff) > Math.PI / 2) mid += Math.PI;
    return {
      start: { x: v.x + arcR * Math.cos(a2), y: v.y + arcR * Math.sin(a2) },
      end: { x: v.x + arcR * Math.cos(a1), y: v.y + arcR * Math.sin(a1) },
      label: { x: v.x + labelR * Math.cos(mid), y: v.y + labelR * Math.sin(mid) }
    };
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: '100%', maxWidth: 400, height: 'auto' }}>
        {/* Subtle shape fill with tint */}
        <defs>
          <linearGradient id="quadFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        {/* Quadrilateral fill + outline */}
        <polygon points={pts} fill="url(#quadFill)" stroke="#1e293b" strokeWidth={3} strokeLinejoin="round" />
        {/* Angle arcs + labels */}
        {arcs.map((arc, i) => {
          const color = colors[i] || "#818cf8";
          const label = labels[i] || `${angles[i]}°`;
          const isUnknown = label.includes('?');
          const labelColor = isUnknown ? '#dc2626' : color;
          return (
            <g key={i}>
              <path
                d={`M ${arc.start.x},${arc.start.y} A ${arcR},${arcR} 0 0,0 ${arc.end.x},${arc.end.y}`}
                fill="none" stroke={color} strokeWidth={3}
              />
              <text x={arc.label.x} y={arc.label.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={17} fontWeight="800" fill={labelColor}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// ParallelLines — two parallel lines with a transversal
// Shows corresponding (F), alternate (Z), or co-interior (C) angle pairs
// Props: givenAngle (number), highlight ("corresponding"|"alternate"|"co-interior"|null)
// ============================================================
export function ParallelLines({
  givenAngle = 65,
  highlight = null,
  hideAnswer = false
}) {
  const DEG = Math.PI / 180;
  const vw = 360, vh = 220;

  // Two horizontal parallel lines
  const lineY1 = 65, lineY2 = 155;
  const lineX1 = 20, lineX2 = 340;

  // Transversal: crosses both lines at an angle
  const angle = givenAngle * DEG;
  // Intersection points on each parallel line
  const ix1 = 150, ix2 = 200; // x-coords of intersections (offset for the slant)
  const crossLen = 110;

  // Transversal endpoints (extends beyond both lines)
  const dx = Math.cos(angle), dy = -Math.sin(angle);
  const t1 = { x: ix1, y: lineY1 }; // intersection with top line
  const t2 = { x: ix1 + (lineY2 - lineY1) * dx / dy * -1, y: lineY2 }; // intersection with bottom line
  // Recalculate: transversal goes from top-right to bottom-left
  const midX = (vw) / 2;
  const gap = lineY2 - lineY1;
  const run = gap / Math.tan(angle);
  const topPt = { x: midX + run / 2, y: lineY1 };
  const botPt = { x: midX - run / 2, y: lineY2 };
  // Extend slightly beyond the parallel lines
  const ext = 30;
  const transTop = { x: topPt.x + ext * dx, y: topPt.y - ext * Math.sin(angle) };
  const transBot = { x: botPt.x - ext * dx, y: botPt.y + ext * Math.sin(angle) };

  const arcR = 22;
  const supplementary = 180 - givenAngle;

  // Angle positions at each intersection (measured from the right horizontal)
  // At top intersection: angle between transversal going down-left and line going right
  // At bottom intersection: same geometry

  // Draw arc for an angle at an intersection point
  const drawArc = (cx, cy, startDeg, sweepDeg, color, label, isUnknown) => {
    const r = arcR;
    const s = startDeg * DEG;
    const e = (startDeg + sweepDeg) * DEG;
    const sx = cx + r * Math.cos(s), sy = cy - r * Math.sin(s);
    const ex = cx + r * Math.cos(e), ey = cy - r * Math.sin(e);
    const large = sweepDeg > 180 ? 1 : 0;
    const mid = (startDeg + sweepDeg / 2) * DEG;
    // Push labels further out for small angles to avoid overlapping lines
    const labelR = sweepDeg < 30 ? r + 30 : sweepDeg < 50 ? r + 24 : r + 18;
    const lx = cx + labelR * Math.cos(mid), ly = cy - labelR * Math.sin(mid);

    return (
      <g key={`${cx}-${cy}-${startDeg}`}>
        <path
          d={`M ${cx},${cy} L ${sx},${sy} A ${r},${r} 0 ${large},0 ${ex},${ey} Z`}
          fill={`${color}30`} stroke={color} strokeWidth={2}
        />
        {label && (
          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={13} fontWeight="700" fill={isUnknown ? '#dc2626' : color}>
            {label}
          </text>
        )}
      </g>
    );
  };

  // Determine which angles to highlight
  const primary = "#818cf8"; // purple - given angle
  const secondary = "#38bdf8"; // blue - matching angle
  const warn = "#f59e0b"; // amber - co-interior
  const dim = "#e2e8f0"; // light grey - not highlighted

  // Angles at top intersection (going anticlockwise from right):
  // Right of transversal, above line = givenAngle
  // Left of transversal, above line = supplementary
  // Left of transversal, below line = givenAngle (vertically opposite)
  // Right of transversal, below line = supplementary (vertically opposite)

  const topAngles = [];
  const botAngles = [];

  // The transversal makes angle `givenAngle` with the parallel line
  // At top: acute angle is between line-right and transversal-going-down
  const transAngle = givenAngle; // angle the transversal makes with horizontal

  if (highlight === "corresponding") {
    // F-shape: same position at both crossings — top-right at both
    topAngles.push({ start: 0, sweep: transAngle, color: primary, label: `${givenAngle}°` });
    botAngles.push({ start: 0, sweep: transAngle, color: hideAnswer ? "#9ca3af" : secondary, label: hideAnswer ? "?°" : `${givenAngle}°`, isUnknown: hideAnswer });
  } else if (highlight === "alternate") {
    // Z-shape: opposite sides between the parallels
    // Top: below-left (between line-left and transversal going down)
    // Bottom: above-right (between transversal going up and line-right)
    topAngles.push({ start: 180, sweep: transAngle, color: primary, label: `${givenAngle}°` });
    botAngles.push({ start: 0, sweep: transAngle, color: hideAnswer ? "#9ca3af" : secondary, label: hideAnswer ? "?°" : `${givenAngle}°`, isUnknown: hideAnswer });
  } else if (highlight === "co-interior") {
    // C-shape: same side between the parallels, add to 180°
    topAngles.push({ start: 180, sweep: transAngle, color: primary, label: `${givenAngle}°` });
    botAngles.push({ start: transAngle, sweep: supplementary, color: hideAnswer ? "#9ca3af" : warn, label: hideAnswer ? "?°" : `${supplementary}°`, isUnknown: hideAnswer });
  } else {
    // No highlight — show the given angle at top
    topAngles.push({ start: 0, sweep: transAngle, color: primary, label: `${givenAngle}°` });
  }

  // Arrow markers for parallel lines
  const arrowY1 = lineY1, arrowY2 = lineY2;
  const arrowX = 300;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: '100%', maxWidth: 400, height: 'auto' }}>
        {/* Parallel lines */}
        <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY1} stroke="#1e293b" strokeWidth={2.5} />
        <line x1={lineX1} y1={lineY2} x2={lineX2} y2={lineY2} stroke="#1e293b" strokeWidth={2.5} />

        {/* Parallel arrows (>> marks) */}
        <polygon points={`${arrowX-4},${arrowY1-6} ${arrowX+4},${arrowY1} ${arrowX-4},${arrowY1+6}`} fill="#1e293b" />
        <polygon points={`${arrowX+6},${arrowY1-6} ${arrowX+14},${arrowY1} ${arrowX+6},${arrowY1+6}`} fill="#1e293b" />
        <polygon points={`${arrowX-4},${arrowY2-6} ${arrowX+4},${arrowY2} ${arrowX-4},${arrowY2+6}`} fill="#1e293b" />
        <polygon points={`${arrowX+6},${arrowY2-6} ${arrowX+14},${arrowY2} ${arrowX+6},${arrowY2+6}`} fill="#1e293b" />

        {/* Transversal */}
        <line x1={transTop.x} y1={transTop.y} x2={transBot.x} y2={transBot.y}
          stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" />

        {/* Intersection dots */}
        <circle cx={topPt.x} cy={topPt.y} r={4} fill="#1e293b" />
        <circle cx={botPt.x} cy={botPt.y} r={4} fill="#1e293b" />

        {/* Angle arcs */}
        {topAngles.map(a => drawArc(topPt.x, topPt.y, a.start, a.sweep, a.color, a.label, a.isUnknown))}
        {botAngles.map(a => drawArc(botPt.x, botPt.y, a.start, a.sweep, a.color, a.label, a.isUnknown))}

        {/* Letter shape hint */}
        {highlight && (
          <text x={vw / 2} y={vh - 8} textAnchor="middle" fontSize={13} fontWeight="600" fill="#64748b">
            {highlight === "corresponding" ? "F-shape — equal angles" :
             highlight === "alternate" ? "Z-shape — equal angles" :
             "C-shape — add to 180°"}
          </text>
        )}
      </svg>
    </div>
  );
}

// ============================================================
// ExteriorAngle — triangle with extended side showing exterior angle
// Props: angle1, angle2, angle3 (interior angles),
//        showExterior (boolean), exteriorLabel (string)
// ============================================================
export function ExteriorAngle({
  angle1 = 50,
  angle2 = 70,
  angle3 = 60,
  showExterior = true,
  exteriorLabel = null,
  angle1Label = null,
  angle2Label = null,
  angle3Label = null
}) {
  const DEG = Math.PI / 180;
  const vw = 400, vh = 240;
  const padX = 50, padBot = 50, padTop = 30;
  const baseY = vh - padBot;

  // Build triangle: angle3 is at bottom-right where the side extends
  // angle1 at top (apex), angle2 at bottom-left
  const baseLen = vw - 2 * padX - 60; // leave room for extension
  const B = { x: padX, y: baseY }; // bottom-left (angle2)
  const C = { x: padX + baseLen, y: baseY }; // bottom-right (angle3)

  // Calculate apex position from angles
  const AB = Math.sin(angle3 * DEG) / Math.sin(angle1 * DEG);
  const ax = AB * Math.cos(angle2 * DEG);
  const ay = AB * Math.sin(angle2 * DEG);
  const scale = Math.min(baseLen, (baseY - padTop) / ay);
  const A = { x: B.x + ax * scale, y: baseY - ay * scale }; // apex (angle1)
  // Recalculate C based on actual base length
  const actualBase = scale;
  const Cfinal = { x: B.x + actualBase, y: baseY };

  // Extension line from C beyond the base
  const extLen = 70;
  const ext = { x: Cfinal.x + extLen, y: baseY };

  // Exterior angle = 180° - angle3
  const exteriorAngle = 180 - angle3;

  // Arc drawing helper
  const arcR = 24;
  const drawAngleArc = (cx, cy, startDeg, sweepDeg, color, label, r = arcR) => {
    const s = startDeg * DEG;
    const e = (startDeg + sweepDeg) * DEG;
    const sx = cx + r * Math.cos(s), sy = cy - r * Math.sin(s);
    const ex = cx + r * Math.cos(e), ey = cy - r * Math.sin(e);
    const large = sweepDeg > 180 ? 1 : 0;
    const mid = (startDeg + sweepDeg / 2) * DEG;
    // Push labels further out for small angles to avoid overlapping lines
    const labelR = sweepDeg < 30 ? r + 30 : sweepDeg < 50 ? r + 22 : r + 16;
    const lx = cx + labelR * Math.cos(mid), ly = cy - labelR * Math.sin(mid);

    return (
      <g key={`${cx.toFixed(0)}-${startDeg}`}>
        <path
          d={`M ${cx},${cy} L ${sx},${sy} A ${r},${r} 0 ${large},0 ${ex},${ey} Z`}
          fill={`${color}30`} stroke={color} strokeWidth={2}
        />
        {label && (
          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize={12} fontWeight="700" fill={color}>
            {label}
          </text>
        )}
      </g>
    );
  };

  // Compute actual math-coord directions between vertices
  // mathAngle: angle in degrees from `from` to `to` in the coord system used by drawAngleArc
  // (0°=right, 90°=up, 180°=left, -90°=down)
  const mathAngle = (from, to) => Math.atan2(from.y - to.y, to.x - from.x) / DEG;

  // At B: interior angle between direction-to-C (along base) and direction-to-A (up)
  const dirB_to_C = mathAngle(B, Cfinal); // ≈ 0°
  // At C: direction to apex (above baseline)
  const dirC_to_A = mathAngle(Cfinal, A); // positive, above baseline
  // At A: directions to B and C (both downward)
  const dirA_to_B = mathAngle(A, B);
  const dirA_to_C = mathAngle(A, Cfinal);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
        {/* Triangle */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${Cfinal.x},${Cfinal.y}`}
          fill="#f0f0ff" stroke="#6366f1" strokeWidth={2.5} strokeLinejoin="round"
        />

        {/* Extended side (dashed) */}
        <line x1={Cfinal.x} y1={Cfinal.y} x2={ext.x} y2={ext.y}
          stroke="#6366f1" strokeWidth={2.5} strokeDasharray="6,4" />

        {/* Interior angle arcs — all drawn INSIDE the triangle */}
        {drawAngleArc(B.x, B.y, dirB_to_C, angle2, "#818cf8", angle2Label !== null ? angle2Label : `${angle2}°`)}
        {drawAngleArc(Cfinal.x, Cfinal.y, dirC_to_A, angle3, "#d1d5db", angle3Label !== null ? angle3Label : `${angle3}°`)}
        {drawAngleArc(A.x, A.y, dirA_to_B, angle1, "#38bdf8", angle1Label !== null ? angle1Label : `${angle1}°`)}

        {/* Exterior angle — from extension (0°) to apex direction */}
        {showExterior && (
          <>
            {drawAngleArc(Cfinal.x, Cfinal.y, 0, dirC_to_A, "#f59e0b",
              exteriorLabel || `${exteriorAngle}°`, arcR + 6)}
          </>
        )}

        {/* Vertex dots */}
        <circle cx={A.x} cy={A.y} r={3} fill="#1e293b" />
        <circle cx={B.x} cy={B.y} r={3} fill="#1e293b" />
        <circle cx={Cfinal.x} cy={Cfinal.y} r={3} fill="#1e293b" />
      </svg>
    </div>
  );
}

// ============================================================
// ClockFace — clock diagram for angle questions
// Props: hourHand (1-12), minuteHand (1-12), showAngle (boolean),
//        angleLabel (string, e.g. "120°" or "?")
// ============================================================
export function ClockFace({
  hourHand = 12,
  minuteHand = 12,
  showAngle = false,
  angleLabel = null
}) {
  const cx = 150, cy = 150, r = 120;
  const DEG = Math.PI / 180;
  // Clock positions: 12 is at top (270° in SVG coords), each number is 30° clockwise
  const clockAngle = (pos) => (pos * 30 - 90) * DEG;
  const hourAngle = clockAngle(hourHand);
  const minuteAngle = clockAngle(minuteHand);
  const hourLen = r * 0.55;
  const minuteLen = r * 0.78;

  // Calculate angle between hands (smaller arc)
  const hDeg = (hourHand * 30 - 90 + 360) % 360;
  const mDeg = (minuteHand * 30 - 90 + 360) % 360;
  let sweep = (mDeg - hDeg + 360) % 360;
  // For the angle arc SVG
  const startRad = hourAngle;
  const endRad = minuteAngle;
  const arcR = 40;
  const sx = cx + arcR * Math.cos(startRad), sy = cy + arcR * Math.sin(startRad);
  const ex = cx + arcR * Math.cos(endRad), ey = cy + arcR * Math.sin(endRad);
  const largeArc = sweep > 180 ? 1 : 0;
  const midAngle = (hDeg + sweep / 2) % 360 * DEG;
  const labelR = arcR + 18;
  const lx = cx + labelR * Math.cos(midAngle), ly = cy + labelR * Math.sin(midAngle);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 280, height: 'auto' }}>
        {/* Clock face */}
        <circle cx={cx} cy={cy} r={r} fill="white" stroke="#6366f1" strokeWidth={3} />
        {/* Hour numbers */}
        {[...Array(12)].map((_, i) => {
          const num = i + 1;
          const a = clockAngle(num);
          const nx = cx + (r - 18) * Math.cos(a);
          const ny = cy + (r - 18) * Math.sin(a);
          return (
            <text key={num} x={nx} y={ny} textAnchor="middle" dominantBaseline="central"
              fontSize={14} fontWeight="600" fill="#374151">{num}</text>
          );
        })}
        {/* Tick marks */}
        {[...Array(12)].map((_, i) => {
          const a = clockAngle(i + 1);
          const x1 = cx + (r - 6) * Math.cos(a), y1 = cy + (r - 6) * Math.sin(a);
          const x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth={2} />;
        })}
        {/* Angle arc */}
        {showAngle && (
          <g>
            <path d={`M ${sx},${sy} A ${arcR},${arcR} 0 ${largeArc},1 ${ex},${ey} L ${cx},${cy} Z`}
              fill="#f59e0b30" stroke="#f59e0b" strokeWidth={2} />
            {angleLabel && (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontWeight="700" fill="#f59e0b">{angleLabel}</text>
            )}
          </g>
        )}
        {/* Hour hand */}
        <line x1={cx} y1={cy}
          x2={cx + hourLen * Math.cos(hourAngle)} y2={cy + hourLen * Math.sin(hourAngle)}
          stroke="#1e293b" strokeWidth={5} strokeLinecap="round" />
        {/* Minute hand */}
        <line x1={cx} y1={cy}
          x2={cx + minuteLen * Math.cos(minuteAngle)} y2={cy + minuteLen * Math.sin(minuteAngle)}
          stroke="#6366f1" strokeWidth={3} strokeLinecap="round" />
        {/* Centre dot */}
        <circle cx={cx} cy={cy} r={5} fill="#1e293b" />
      </svg>
    </div>
  );
}

// ============================================================
// RegularPolygon — draws a regular polygon with interior angle marked
// Props: sides (number 3-12), eachAngle (number), angleLabel (string),
//        showDiagonals (boolean), highlightAngle (boolean)
// ============================================================
export function RegularPolygon({
  sides = 5,
  eachAngle = 108,
  angleLabel = null,
  showDiagonals = false,
  highlightAngle = true
}) {
  const DEG = Math.PI / 180;
  const vw = 300, vh = 260;
  const cx = vw / 2, cy = 120;
  const r = 95;

  // Generate vertices (start from top, go clockwise)
  const vertices = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / sides;
    vertices.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    });
  }

  // Polygon outline
  const points = vertices.map(v => `${v.x},${v.y}`).join(' ');

  // Draw angle arc at vertex 0 (top)
  const arcR = 20;
  const v0 = vertices[0];
  const vPrev = vertices[sides - 1];
  const vNext = vertices[1];

  // Angles of the two edges from vertex 0
  const toPrev = Math.atan2(vPrev.y - v0.y, vPrev.x - v0.x);
  const toNext = Math.atan2(vNext.y - v0.y, vNext.x - v0.x);

  // Arc from toNext to toPrev (interior angle, going through the inside)
  const startArc = toNext;
  let sweepArc = toPrev - toNext;
  if (sweepArc < 0) sweepArc += 2 * Math.PI;

  const arcStart = { x: v0.x + arcR * Math.cos(startArc), y: v0.y + arcR * Math.sin(startArc) };
  const arcEnd = { x: v0.x + arcR * Math.cos(toPrev), y: v0.y + arcR * Math.sin(toPrev) };
  const large = sweepArc > Math.PI ? 1 : 0;

  // Label position along bisector — push further out to clear diagonal lines
  const bisAngle = startArc + sweepArc / 2;
  const labelR = showDiagonals ? arcR + 32 : arcR + 18;
  const labelPos = { x: v0.x + labelR * Math.cos(bisAngle), y: v0.y + labelR * Math.sin(bisAngle) };

  // Diagonals from vertex 0 (for showing triangulation)
  const diagonals = [];
  if (showDiagonals) {
    for (let i = 2; i < sides - 1; i++) {
      diagonals.push(vertices[i]);
    }
  }

  const label = angleLabel || `${eachAngle}°`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0', gap: 4 }}>
      <svg viewBox={`0 0 ${vw} ${vh}`} style={{ width: '100%', maxWidth: 340, height: 'auto' }}>
        {/* Polygon fill */}
        <polygon points={points} fill="#f0f0ff" stroke="#6366f1" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Diagonals for triangulation */}
        {diagonals.map((d, i) => (
          <line key={i} x1={v0.x} y1={v0.y} x2={d.x} y2={d.y}
            stroke="#818cf8" strokeWidth={1.5} strokeDasharray="5,4" />
        ))}

        {/* Vertex dots */}
        {vertices.map((v, i) => (
          <circle key={i} cx={v.x} cy={v.y} r={3} fill="#1e293b" />
        ))}

        {/* Interior angle arc at vertex 0 */}
        {highlightAngle && (
          <g>
            <path
              d={`M ${v0.x},${v0.y} L ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 ${large},1 ${arcEnd.x},${arcEnd.y} Z`}
              fill="#818cf830" stroke="#818cf8" strokeWidth={2}
            />
            <rect x={labelPos.x - label.length * 4.5 - 4} y={labelPos.y - 10} width={label.length * 9 + 8} height={20} rx={3} fill="white" fillOpacity={0.9} />
            <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight="700" fill="#6366f1">
              {label}
            </text>
          </g>
        )}

        {/* Shape name and triangle count below */}
        {showDiagonals && (
          <text x={cx} y={vh - 10} textAnchor="middle" fontSize={12} fontWeight="600" fill="#64748b">
            {sides - 2} triangles → {(sides - 2) * 180}° total
          </text>
        )}
      </svg>
    </div>
  );
}

// ============================================================
// FunctionMachine — Visual flow diagram for function machines
// ============================================================
// Shows input → operation(s) → output as a horizontal flow.
// Supports forwards mode (input known) and backwards mode
// (output known, working backwards to find input).
//
// Props:
//   input       — the input value (number or "?")
//   output      — the output value (number or "?")
//   operations  — array of operation strings, e.g. ["× 3", "+ 4"]
//   midValues   — array of intermediate values between operations (optional)
//   direction   — "forwards" (default) or "backwards"
//   label       — optional label below the diagram

export function FunctionMachine({
  input = "?",
  output = "?",
  operations = [],
  midValues = [],
  direction = "forwards",
  label = ""
}) {
  const isBackwards = direction === "backwards";

  // Build the flow items: input → op1 → (mid) → op2 → output
  const flowItems = [];

  // Input circle
  flowItems.push({
    type: "value",
    value: input,
    isUnknown: input === "?",
    sublabel: "Input"
  });

  // Operations with optional mid-values
  operations.forEach((op, i) => {
    flowItems.push({ type: "arrow" });
    flowItems.push({ type: "operation", value: op });

    if (i < operations.length - 1) {
      flowItems.push({ type: "arrow" });
      if (midValues[i] !== undefined) {
        flowItems.push({
          type: "value",
          value: midValues[i],
          isUnknown: midValues[i] === "?",
          sublabel: ""
        });
      }
    }
  });

  // Output circle
  flowItems.push({ type: "arrow" });
  flowItems.push({
    type: "value",
    value: output,
    isUnknown: output === "?",
    sublabel: "Output"
  });

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Direction indicator for backwards */}
      {isBackwards && (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <span>↩</span> Working backwards
        </div>
      )}

      {/* Main flow */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {flowItems.map((item, i) => {
          if (item.type === "arrow") {
            return (
              <div key={`arrow-${i}`} className="flex items-center px-0.5">
                <svg width="24" height="20" viewBox="0 0 24 20">
                  <defs>
                    <marker id={`arrowhead-${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#A29BFE" />
                    </marker>
                  </defs>
                  <line x1="2" y1="10" x2="18" y2="10"
                    stroke="#A29BFE" strokeWidth="2"
                    markerEnd={`url(#arrowhead-${i})`} />
                </svg>
              </div>
            );
          }

          if (item.type === "value") {
            const isUnknown = item.isUnknown;
            return (
              <div key={`val-${i}`} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center font-bold text-lg shadow-sm ${
                  isUnknown
                    ? 'bg-amber-50 border-amber-400 text-amber-600 border-dashed'
                    : 'bg-white border-[#6C5CE7] text-[#5A4BD1]'
                }`}>
                  {item.value}
                </div>
                {item.sublabel && (
                  <span className={`text-xs mt-1 font-medium ${
                    isUnknown ? 'text-amber-500' : 'text-[#A29BFE]'
                  }`}>
                    {item.sublabel}
                  </span>
                )}
              </div>
            );
          }

          if (item.type === "operation") {
            return (
              <div key={`op-${i}`} className="flex flex-col items-center">
                <div className="px-4 py-3 rounded-xl bg-[#EDE8FF] border-2 border-[#A29BFE] text-[#5A4BD1] font-bold text-base shadow-sm min-w-[56px] text-center">
                  {item.value}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Label */}
      {label && (
        <div className="text-xs text-gray-500 font-medium mt-1">{label}</div>
      )}
    </div>
  );
}

// ============================================================
// LineGraph — Simple line graph for data handling lessons
// ============================================================
// Props:
//   data      — array of { label, value }  e.g. [{ label: "9am", value: 8 }, ...]
//   xLabel    — x-axis title (optional)
//   yLabel    — y-axis title (optional)
//   highlight — index of point to highlight (optional)
//   color     — line/point colour (default "#6C5CE7")
//   showGrid  — show horizontal grid lines (default true)
//   unit      — unit string shown on y-axis labels (optional, e.g. "°C")

export function LineGraph({
  data = [],
  xLabel = "",
  yLabel = "",
  highlight = null,
  color = "#6C5CE7",
  showGrid = true,
  unit = "",
  showValues = true
}) {
  if (!data.length) return null;

  const width = 560;
  const height = 300;
  const left = 70;
  const right = 30;
  const top = 30;
  const bottom = 65;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  // Y-axis range — nice round numbers
  const values = data.map(d => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const range = rawMax - rawMin || 1;
  const step = range <= 5 ? 1 : range <= 15 ? 2 : range <= 30 ? 5 : Math.ceil(range / 6 / 5) * 5;
  const yMin = Math.floor(rawMin / step) * step;
  const yMax = Math.ceil(rawMax / step) * step + (rawMax === Math.ceil(rawMax / step) * step ? step : 0);
  const yTicks = [];
  for (let v = yMin; v <= yMax; v += step) yTicks.push(v);

  const toX = (i) => left + (i / (data.length - 1 || 1)) * plotW;
  const toY = (v) => top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  // Adaptive font sizes
  const xLabelFontSize = data.length > 8 ? 12 : data.length > 5 ? 14 : 16;

  // Build line path
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.value)}`).join(' ');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full block">
        {/* Grid lines */}
        {showGrid && yTicks.map((v, i) => (
          <line key={`grid-${i}`}
            x1={left} y1={toY(v)} x2={width - right} y2={toY(v)}
            stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
        ))}

        {/* Y-axis */}
        <line x1={left} y1={top} x2={left} y2={top + plotH}
          stroke="#374151" strokeWidth={2} />

        {/* Y-axis ticks and labels */}
        {yTicks.map((v, i) => (
          <g key={`ytick-${i}`}>
            <line x1={left - 6} y1={toY(v)} x2={left} y2={toY(v)}
              stroke="#374151" strokeWidth={2} />
            <text x={left - 10} y={toY(v) + 5} textAnchor="end"
              fill="#374151" fontSize={14} fontWeight="500">
              {v}{unit}
            </text>
          </g>
        ))}

        {/* Y-axis label */}
        {yLabel && (
          <text x={16} y={top + plotH / 2} textAnchor="middle"
            fill="#6b7280" fontSize={13} fontWeight="600"
            transform={`rotate(-90, 16, ${top + plotH / 2})`}>
            {yLabel}
          </text>
        )}

        {/* X-axis */}
        <line x1={left} y1={top + plotH} x2={width - right} y2={top + plotH}
          stroke="#374151" strokeWidth={2} />

        {/* X-axis ticks and labels */}
        {data.map((d, i) => (
          <g key={`xtick-${i}`}>
            <line x1={toX(i)} y1={top + plotH} x2={toX(i)} y2={top + plotH + 6}
              stroke="#374151" strokeWidth={2} />
            <text x={toX(i)} y={top + plotH + 22} textAnchor="middle"
              fill="#374151" fontSize={xLabelFontSize} fontWeight="500">
              {d.label}
            </text>
          </g>
        ))}

        {/* X-axis label */}
        {xLabel && (
          <text x={left + plotW / 2} y={height - 8} textAnchor="middle"
            fill="#6b7280" fontSize={13} fontWeight="600">
            {xLabel}
          </text>
        )}

        {/* Data line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth={3}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {data.map((d, i) => {
          const cx = toX(i);
          const cy = toY(d.value);
          const isHighlighted = highlight === i;
          const r = isHighlighted ? 10 : 7;
          return (
            <g key={`pt-${i}`}>
              <circle cx={cx} cy={cy} r={r}
                fill={isHighlighted ? "#f59e0b" : color}
                stroke="white" strokeWidth={3} />
              {/* Value label above point — hidden in quiz mode */}
              {showValues && (
                <text x={cx} y={cy - r - 6} textAnchor="middle"
                  fill={isHighlighted ? "#d97706" : "#374151"}
                  fontSize={isHighlighted ? 15 : 13} fontWeight={isHighlighted ? "bold" : "600"}>
                  {d.value}{unit}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ============================================================
// BarChart — vertical bar chart for data handling lessons
// Props: bars [{label, value}], scale, xLabel, yLabel,
//        highlight (index), colors, unit, yStart
// ============================================================
export function BarChart({
  bars = [],
  scale = null,
  xLabel = "",
  yLabel = "",
  highlight = null,
  colors = ['#818cf8', '#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f87171'],
  unit = "",
  yStart = 0,
  showValues = true
}) {
  if (!bars.length) return null;

  const width = 560;
  const height = 300;
  const left = 70;
  const right = 30;
  const top = 20;
  const bottom = 65;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  // Y-axis range
  const values = bars.map(b => b.value);
  const rawMax = Math.max(...values);
  const yMin = yStart;
  const autoStep = scale || (rawMax <= 5 ? 1 : rawMax <= 15 ? 2 : rawMax <= 30 ? 5 : Math.ceil(rawMax / 6 / 5) * 5);
  const yMax = Math.ceil(rawMax / autoStep) * autoStep + (rawMax === Math.ceil(rawMax / autoStep) * autoStep ? autoStep : 0);
  const yTicks = [];
  for (let v = yMin; v <= yMax; v += autoStep) yTicks.push(v);

  const toY = (v) => top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  // Bar layout
  const barGap = Math.max(8, plotW * 0.06);
  const totalGaps = (bars.length + 1) * barGap;
  const barW = Math.min(60, (plotW - totalGaps) / bars.length);
  const totalBarsW = bars.length * barW + (bars.length + 1) * barGap;
  const offsetX = left + (plotW - totalBarsW) / 2;
  const barX = (i) => offsetX + barGap + i * (barW + barGap);

  // Adaptive x-label font
  const xFontSize = bars.length > 6 ? 11 : bars.length > 4 ? 13 : 15;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full block">
        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <line key={`grid-${i}`}
            x1={left} y1={toY(v)} x2={width - right} y2={toY(v)}
            stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
        ))}

        {/* Y-axis */}
        <line x1={left} y1={top} x2={left} y2={top + plotH}
          stroke="#374151" strokeWidth={2} />

        {/* Y-axis ticks + labels */}
        {yTicks.map((v, i) => (
          <g key={`ytick-${i}`}>
            <line x1={left - 6} y1={toY(v)} x2={left} y2={toY(v)}
              stroke="#374151" strokeWidth={2} />
            <text x={left - 10} y={toY(v) + 5} textAnchor="end"
              fill="#374151" fontSize={14} fontWeight="500">
              {v}{unit}
            </text>
          </g>
        ))}

        {/* Y-axis label */}
        {yLabel && (
          <text x={16} y={top + plotH / 2} textAnchor="middle"
            fill="#6b7280" fontSize={13} fontWeight="600"
            transform={`rotate(-90, 16, ${top + plotH / 2})`}>
            {yLabel}
          </text>
        )}

        {/* X-axis */}
        <line x1={left} y1={top + plotH} x2={width - right} y2={top + plotH}
          stroke="#374151" strokeWidth={2} />

        {/* Bars */}
        {bars.map((b, i) => {
          const x = barX(i);
          const y = toY(b.value);
          const h = toY(yMin) - y;
          const isHL = highlight === i;
          const fill = colors[i % colors.length];

          return (
            <g key={`bar-${i}`}>
              {/* Bar */}
              <rect x={x} y={y} width={barW} height={Math.max(0, h)}
                fill={fill} rx={3} ry={3}
                stroke={isHL ? "#d97706" : "none"} strokeWidth={isHL ? 3 : 0}
                opacity={isHL ? 1 : 0.85} />

              {/* Value above bar — hidden in quiz mode */}
              {showValues && (
                <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                  fill={isHL ? "#d97706" : "#374151"}
                  fontSize={isHL ? 15 : 13} fontWeight="bold">
                  {b.value}{unit}
                </text>
              )}

              {/* X-axis label */}
              <text x={x + barW / 2} y={top + plotH + 20} textAnchor="middle"
                fill="#374151" fontSize={xFontSize} fontWeight="500">
                {b.label}
              </text>
            </g>
          );
        })}

        {/* X-axis label */}
        {xLabel && (
          <text x={left + plotW / 2} y={height - 8} textAnchor="middle"
            fill="#6b7280" fontSize={13} fontWeight="600">
            {xLabel}
          </text>
        )}
      </svg>
    </div>
  );
}


// ============================================================
// PieChart — circular pie chart for data handling lessons
// Props: sections [{label, angle, count, fraction}], total,
//        colors, showLabels, highlightIndex
// ============================================================
export function PieChart({
  sections = [],
  total = null,
  colors = ['#818cf8', '#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f87171'],
  showLabels = true,
  highlightIndex = null,
  showValues = true
}) {
  if (!sections.length) return null;

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const labelR = r + 30;

  // Build slices from angles
  let currentAngle = -90; // start at top
  const slices = sections.map((s, i) => {
    const startAngle = currentAngle;
    const sweep = s.angle || 0;
    currentAngle += sweep;
    return { ...s, startAngle, sweep, index: i };
  });

  const toRad = (deg) => (deg * Math.PI) / 180;
  const arcPoint = (angle, radius) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle))
  });

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full" style={{ maxWidth: 340 }}>
        {slices.map((s, i) => {
          const start = arcPoint(s.startAngle, r);
          const end = arcPoint(s.startAngle + s.sweep, r);
          const largeArc = s.sweep > 180 ? 1 : 0;
          const isHL = highlightIndex === i;
          const fill = colors[i % colors.length];

          // Slice path
          const d = s.sweep >= 360
            ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
            : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

          // Label at midpoint of arc
          const midAngle = s.startAngle + s.sweep / 2;
          const labelPos = arcPoint(midAngle, labelR);
          const innerPos = arcPoint(midAngle, r * 0.6);

          return (
            <g key={i}>
              <path d={d} fill={fill}
                stroke="white" strokeWidth={2}
                opacity={isHL ? 1 : 0.85} />

              {/* Fraction/count/angle inside slice */}
              {showValues && s.sweep >= 30 && (
                <text x={innerPos.x} y={innerPos.y + 4} textAnchor="middle"
                  fill="white" fontSize={s.sweep >= 60 ? 14 : 11} fontWeight="bold"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {s.count !== undefined ? s.count : s.fraction}
                </text>
              )}
              {/* Show angle in degrees on each segment (for quiz mode pie charts) */}
              {!showValues && s.sweep >= 20 && (
                <text x={innerPos.x} y={innerPos.y + 4} textAnchor="middle"
                  fill="white" fontSize={s.sweep >= 60 ? 13 : 10} fontWeight="bold"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {s.angle || Math.round(s.sweep)}°
                </text>
              )}

              {/* External label */}
              {showLabels && (
                <text x={labelPos.x} y={labelPos.y + 4} textAnchor="middle"
                  fill="#374151" fontSize={12} fontWeight="600">
                  {s.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Total in centre */}
        {total && (
          <>
            <circle cx={cx} cy={cy} r={22} fill="white" opacity={0.85} />
            <text x={cx} y={cy + 6} textAnchor="middle"
              fill="#6C5CE7" fontSize={16} fontWeight="bold">
              {total}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}


// ============================================================
// TwoWayTable — renders a two-way table from a tableDesc string
// Format: "Row1: Col1=val1, Col2=val2. Row2: Col1=val3, Col2=val4."
// Props: tableDesc (string), highlightCol (column label), showTotals (bool),
//        rowTotals (object, e.g. {"Boys": 25}) to override calculated totals
// ============================================================
export function TwoWayTable({
  tableDesc = "",
  highlightCol = null,
  showTotals = false,
  rowTotals: rowTotalsOverride = null
}) {
  if (!tableDesc) return null;

  // Parse "Boys: Cat=8, Dog=12, Fish=5. Girls: Cat=10, Dog=7, Fish=3."
  // Also handles time values like "Station A=8:00" by only splitting on FIRST colon for row label
  const rowEntries = tableDesc.split(/\.\s*/).filter(s => s.trim());
  const rows = rowEntries.map(entry => {
    const firstColon = entry.indexOf(':');
    const rowLabel = firstColon >= 0 ? entry.slice(0, firstColon).trim() : entry.trim();
    const rest = firstColon >= 0 ? entry.slice(firstColon + 1).trim() : '';
    const cells = {};
    (rest || '').split(/,\s*/).forEach(pair => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx < 0) return;
      const col = pair.slice(0, eqIdx).trim();
      const val = pair.slice(eqIdx + 1).trim();
      if (col && val) {
        cells[col] = val === '?' ? '?' : (isNaN(Number(val)) ? val : Number(val));
      }
    });
    return { label: rowLabel, cells };
  });

  // Get unique column headers in order of first appearance
  const colHeaders = [];
  rows.forEach(row => {
    Object.keys(row.cells).forEach(col => {
      if (!colHeaders.includes(col)) colHeaders.push(col);
    });
  });

  // Calculate totals if needed
  const colTotals = {};
  if (showTotals) {
    colHeaders.forEach(col => {
      const hasMissing = rows.some(row => row.cells[col] === '?');
      if (hasMissing) {
        colTotals[col] = '?';
      } else {
        colTotals[col] = rows.reduce((sum, row) => {
          const v = row.cells[col];
          return sum + (typeof v === 'number' ? v : 0);
        }, 0);
      }
    });
  }

  const thStyle = {
    padding: '8px 14px',
    fontWeight: 700,
    fontSize: 13,
    color: 'white',
    background: '#6C5CE7',
    borderBottom: '2px solid #5a4bd4',
    textAlign: 'center'
  };

  const rowHeaderStyle = {
    padding: '8px 14px',
    fontWeight: 600,
    fontSize: 13,
    color: '#374151',
    background: '#f3f0ff',
    borderRight: '1px solid #e5e7eb',
    textAlign: 'left'
  };

  return (
    <div className="flex justify-center">
      <table style={{
        borderCollapse: 'separate',
        borderSpacing: 0,
        borderRadius: 10,
        overflow: 'hidden',
        border: '2px solid #6C5CE7',
        fontSize: 14,
        minWidth: 240
      }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, borderTopLeftRadius: 8, textAlign: 'left' }}></th>
            {colHeaders.map((col, i) => (
              <th key={col} style={{
                ...thStyle,
                ...(i === colHeaders.length - 1 && !showTotals ? { borderTopRightRadius: 8 } : {}),
                ...(highlightCol === col ? { background: '#5145c9' } : {})
              }}>{col}</th>
            ))}
            {showTotals && (
              <th style={{ ...thStyle, borderTopRightRadius: 8, background: '#4a3db8' }}>Total</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const rowTotal = showTotals
              ? (rowTotalsOverride && rowTotalsOverride[row.label] != null
                  ? rowTotalsOverride[row.label]
                  : colHeaders.reduce((sum, col) => {
                      const v = row.cells[col];
                      return sum + (typeof v === 'number' ? v : 0);
                    }, 0))
              : 0;
            const isLast = ri === rows.length - 1 && !showTotals;
            return (
              <tr key={row.label}>
                <td style={{
                  ...rowHeaderStyle,
                  ...(isLast ? { borderBottomLeftRadius: 8 } : {}),
                  borderBottom: isLast ? 'none' : '1px solid #e5e7eb'
                }}>{row.label}</td>
                {colHeaders.map((col, ci) => (
                  <td key={col} style={{
                    padding: '8px 14px',
                    textAlign: 'center',
                    fontWeight: 500,
                    fontSize: 15,
                    color: row.cells[col] === '?' ? '#dc2626' : (highlightCol === col ? '#6C5CE7' : '#1f2937'),
                    fontWeight: row.cells[col] === '?' ? 700 : 500,
                    background: highlightCol === col
                      ? (ri % 2 === 0 ? '#ede9fe' : '#e0dbfa')
                      : (ri % 2 === 0 ? 'white' : '#f9fafb'),
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    ...(isLast && ci === colHeaders.length - 1 && !showTotals ? { borderBottomRightRadius: 8 } : {})
                  }}>{row.cells[col] ?? '—'}</td>
                ))}
                {showTotals && (
                  <td style={{
                    padding: '8px 14px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#6C5CE7',
                    background: ri % 2 === 0 ? '#f3f0ff' : '#ede9fe',
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    ...(isLast ? { borderBottomRightRadius: 8 } : {})
                  }}>{rowTotal}</td>
                )}
              </tr>
            );
          })}
          {showTotals && (
            <tr>
              <td style={{
                ...rowHeaderStyle,
                borderBottomLeftRadius: 8,
                fontWeight: 700,
                borderBottom: 'none'
              }}>Total</td>
              {colHeaders.map((col, ci) => (
                <td key={col} style={{
                  padding: '8px 14px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: colTotals[col] === '?' ? '#dc2626' : '#6C5CE7',
                  background: '#f3f0ff',
                  borderBottom: 'none'
                }}>{colTotals[col]}</td>
              ))}
              <td style={{
                padding: '8px 14px',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 15,
                color: Object.values(colTotals).some(v => v === '?') ? '#dc2626' : '#5145c9',
                background: '#ede9fe',
                borderBottomRightRadius: 8,
                borderBottom: 'none'
              }}>{Object.values(colTotals).some(v => v === '?') ? '?' : Object.values(colTotals).reduce((a, b) => a + b, 0)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// ============================================================
// PathBorderDiagram — two concentric rectangles showing a
// path/border area (outer minus inner)
// Props: outerL, outerW, innerL, innerW, pathWidth, dimUnit,
//        outerLabel, innerLabel, pathLabel
// ============================================================
export function PathBorderDiagram({
  outerL = 10,
  outerW = 7,
  innerL = 8,
  innerW = 5,
  pathWidth = 1,
  dimUnit = "m",
  outerLabel = null,
  innerLabel = null,
  pathLabel = null
}) {
  const svgW = 400, svgH = 280;
  const padL = 60, padR = 40, padT = 30, padB = 50;
  const shapeW = svgW - padL - padR;
  const shapeH = svgH - padT - padB;

  // Outer rectangle
  const ox = padL, oy = padT;
  const ow = shapeW, oh = shapeH;

  // Inner rectangle (centred within outer, proportional to dimensions)
  const borderFracX = (outerL - innerL) / (2 * outerL);
  const borderFracY = (outerW - innerW) / (2 * outerW);
  const ix = ox + ow * borderFracX;
  const iy = oy + oh * borderFracY;
  const iw = ow * (innerL / outerL);
  const ih = oh * (innerW / outerW);

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Outer rectangle — path/border fill */}
        <rect x={ox} y={oy} width={ow} height={oh}
              fill="#fde68a" stroke="#d97706" strokeWidth="2" rx="3" />

        {/* Inner rectangle — inner area (white) */}
        <rect x={ix} y={iy} width={iw} height={ih}
              fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="2" />

        {/* Inner label */}
        {innerLabel && (
          <text x={ix + iw / 2} y={iy + ih / 2 + 5} textAnchor="middle"
                fill="#1e40af" fontSize="15" fontWeight="bold">
            {innerLabel}
          </text>
        )}

        {/* Path/border label (centred in bottom border strip) */}
        {pathLabel && (
          <text x={ox + ow / 2} y={iy + ih + (oy + oh - iy - ih) / 2 + 5} textAnchor="middle"
                fill="#92400e" fontSize="14" fontWeight="bold">
            {pathLabel}
          </text>
        )}

        {/* Outer dimension — bottom (length) */}
        <line x1={ox} y1={oy + oh + 18} x2={ox + ow} y2={oy + oh + 18}
              stroke="#d97706" strokeWidth="2" markerStart="url(#pbd-al)" markerEnd="url(#pbd-ar)" />
        <text x={ox + ow / 2} y={oy + oh + 38} textAnchor="middle"
              fill="#d97706" fontSize="15" fontWeight="bold">
          {outerL} {dimUnit}
        </text>

        {/* Outer dimension — left (width) */}
        <line x1={ox - 18} y1={oy} x2={ox - 18} y2={oy + oh}
              stroke="#d97706" strokeWidth="2" markerStart="url(#pbd-au)" markerEnd="url(#pbd-ad)" />
        <text x={ox - 32} y={oy + oh / 2 + 5} textAnchor="middle"
              fill="#d97706" fontSize="15" fontWeight="bold"
              transform={`rotate(-90, ${ox - 32}, ${oy + oh / 2 + 5})`}>
          {outerW} {dimUnit}
        </text>

        {/* Inner dimension — top edge inside inner rect */}
        <text x={ix + iw / 2} y={iy + 16} textAnchor="middle"
              fill="#3b82f6" fontSize="13" fontWeight="600">
          {innerL} {dimUnit}
        </text>

        {/* Inner dimension — left edge inside inner rect */}
        <text x={ix + 14} y={iy + ih / 2 + 5} textAnchor="middle"
              fill="#3b82f6" fontSize="13" fontWeight="600"
              transform={`rotate(-90, ${ix + 14}, ${iy + ih / 2 + 5})`}>
          {innerW} {dimUnit}
        </text>

        {/* Path width annotation removed — was confusing */}

        {/* Arrow markers */}
        <defs>
          <marker id="pbd-ar" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#d97706" />
          </marker>
          <marker id="pbd-al" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <polygon points="8 0, 0 3, 8 6" fill="#d97706" />
          </marker>
          <marker id="pbd-ad" markerWidth="6" markerHeight="8" refX="3" refY="8" orient="auto">
            <polygon points="0 0, 3 8, 6 0" fill="#d97706" />
          </marker>
          <marker id="pbd-au" markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#d97706" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

// ============================================================
// ThermometerDiagram — Vertical temperature scale
// ============================================================
// Props:
//   min, max         — temperature range (e.g. -10, 10)
//   value            — current temperature reading
//   target           — optional second temperature to show
//   showArrow        — show arrow pointing to value (default true)
//   rise             — optional rise/drop amount to show with dashed arrow

export function ThermometerDiagram({
  min = -10,
  max = 10,
  value = 0,
  target = null,
  showArrow = true,
  rise = null
}) {
  const svgW = 400, svgH = 300;
  const tubeX = 190, tubeW = 30, tubeTop = 38, tubeH = 220;
  const bulbR = 22, bulbY = tubeTop + tubeH + bulbR - 10;
  const scaleRange = max - min;
  const toY = (v) => tubeTop + tubeH - ((v - min) / scaleRange) * tubeH;

  // Major ticks at intervals of 5
  const majorTicks = [];
  for (let v = min; v <= max; v += 5) majorTicks.push(v);

  // Minor ticks at every degree
  const minorTicks = [];
  for (let v = min; v <= max; v++) {
    if (v % 5 !== 0) minorTicks.push(v);
  }

  const mercuryTop = toY(value);

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {/* Tube */}
        <rect x={tubeX} y={tubeTop} width={tubeW} height={tubeH}
              rx="15" ry="15" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Bulb */}
        <circle cx={tubeX + tubeW / 2} cy={bulbY} r={bulbR}
                fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Mercury in bulb */}
        <circle cx={tubeX + tubeW / 2} cy={bulbY} r={bulbR - 4} fill="#f87171" />
        {/* Mercury column */}
        <rect x={tubeX + 7} y={mercuryTop} width={tubeW - 14} height={bulbY - bulbR - mercuryTop + 8}
              fill="#f87171" rx="2" />

        {/* Major ticks + labels */}
        {majorTicks.map(v => (
          <g key={`maj-${v}`}>
            <line x1={tubeX - 25} y1={toY(v)} x2={tubeX} y2={toY(v)}
                  stroke={v === 0 ? "#3b82f6" : "#3b82f6"} strokeWidth={v === 0 ? 2.5 : 2} />
            <text x={tubeX - 32} y={toY(v) + 5} textAnchor="end"
                  fontFamily="system-ui, -apple-system, sans-serif" fontSize="14"
                  fontWeight="bold" fill="#6366f1">{v}</text>
          </g>
        ))}

        {/* Minor ticks */}
        {minorTicks.map(v => (
          <line key={`min-${v}`} x1={tubeX - 12} y1={toY(v)} x2={tubeX} y2={toY(v)}
                stroke="#93c5fd" strokeWidth="1.5" />
        ))}

        {/* Arrow pointing to value */}
        {showArrow && (
          <g>
            <line x1={tubeX + tubeW + 10} y1={toY(value)} x2={tubeX + tubeW + 50} y2={toY(value)}
                  stroke="#6366f1" strokeWidth="2" />
            <polygon points={`${tubeX + tubeW + 8},${toY(value)} ${tubeX + tubeW + 16},${toY(value) - 4} ${tubeX + tubeW + 16},${toY(value) + 4}`}
                     fill="#6366f1" />
            <text x={tubeX + tubeW + 56} y={toY(value) + 5}
                  fontFamily="system-ui, -apple-system, sans-serif" fontSize="18"
                  fontWeight="bold" fill="#dc2626">{value}°C</text>
          </g>
        )}

        {/* Rise/drop arrow */}
        {rise && (
          <g>
            <line x1={320} y1={toY(value)} x2={320} y2={toY(value + rise)}
                  stroke="#6366f1" strokeWidth="2" strokeDasharray="4,3" />
            <polygon points={`${320},${toY(value + rise) - 3} ${316},${toY(value + rise) + 5} ${324},${toY(value + rise) + 5}`}
                     fill="#6366f1" />
            <text x={338} y={(toY(value) + toY(value + rise)) / 2 + 5}
                  fontFamily="system-ui, -apple-system, sans-serif" fontSize="14"
                  fontWeight="bold" fill="#6366f1">{rise > 0 ? '+' : ''}{rise}°C</text>
          </g>
        )}

        {/* Target temperature pointer */}
        {target !== null && (
          <g>
            <line x1={tubeX + tubeW + 10} y1={toY(target)} x2={tubeX + tubeW + 50} y2={toY(target)}
                  stroke="#6366f1" strokeWidth="2" />
            <polygon points={`${tubeX + tubeW + 8},${toY(target)} ${tubeX + tubeW + 16},${toY(target) - 4} ${tubeX + tubeW + 16},${toY(target) + 4}`}
                     fill="#6366f1" />
            <text x={tubeX + tubeW + 56} y={toY(target) + 5}
                  fontFamily="system-ui, -apple-system, sans-serif" fontSize="18"
                  fontWeight="bold" fill="#dc2626">{target}°C</text>
          </g>
        )}

        {/* Difference bracket */}
        {target !== null && value !== target && (
          <g>
            <line x1={280} y1={toY(value)} x2={295} y2={toY(value)} stroke="#f97316" strokeWidth="2" />
            <line x1={290} y1={toY(value)} x2={290} y2={toY(target)} stroke="#f97316" strokeWidth="2" />
            <line x1={280} y1={toY(target)} x2={295} y2={toY(target)} stroke="#f97316" strokeWidth="2" />
            <text x={305} y={(toY(value) + toY(target)) / 2 + 5}
                  fontFamily="system-ui, -apple-system, sans-serif" fontSize="16"
                  fontWeight="bold" fill="#f97316">?°C</text>
          </g>
        )}

        {/* °C label */}
        <text x={tubeX + tubeW / 2} y={tubeTop - 10} textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif" fontSize="14"
              fontWeight="bold" fill="#6366f1">°C</text>
      </svg>
    </div>
  );
}


// ============================================================
// BuildingDiagram — Multi-floor building with above/below ground
// ============================================================
// Props:
//   floorsAbove  — number of floors above ground (default 3)
//   floorsBelow  — number of floors below ground (default 2)
//   personFloor  — which floor to show the person on (null = none)
//   highlightFloor — which floor to highlight (null = none)
//   showQuestion — floor to show "?" on (null = none)

export function BuildingDiagram({
  floorsAbove = 3,
  floorsBelow = 2,
  personFloor = null,
  highlightFloor = null,
  showQuestion = null
}) {
  const totalFloors = floorsAbove + floorsBelow + 1; // +1 for ground
  const floorH = 36;
  const buildW = 160;
  const svgW = 400;
  const svgH = Math.max(280, (totalFloors + 1) * floorH + 60);
  const startX = (svgW - buildW) / 2;
  const groundY = 30 + floorsAbove * floorH;

  const floors = [];
  for (let f = floorsAbove; f >= -floorsBelow; f--) {
    floors.push(f);
  }

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxWidth: 380 }}>
        {floors.map((f, i) => {
          const y = 30 + i * floorH;
          const isGround = f === 0;
          const isBelow = f < 0;
          const isHighlight = f === highlightFloor;
          const isQuestion = f === showQuestion;

          return (
            <g key={f}>
              {/* Floor rectangle */}
              <rect x={startX} y={y} width={buildW} height={floorH}
                    fill={isHighlight ? "#dbeafe" : isBelow ? "#e0e7ff" : "#bfdbfe"}
                    stroke="#3b82f6" strokeWidth={isGround ? 2.5 : 1.5}
                    rx="3" />

              {/* Floor label */}
              <text x={startX + buildW + 15} y={y + floorH / 2 + 5}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontSize="16" fontWeight="bold"
                    fill={isQuestion ? "#dc2626" : isBelow ? "#6366f1" : "#6366f1"}>
                {isQuestion ? "?" : f === 0 ? "G" : f > 0 ? f : f}
              </text>

              {/* Ground label */}
              {isGround && (
                <text x={startX - 15} y={y + floorH / 2 + 5} textAnchor="end"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontSize="12" fontWeight="bold" fill="#6366f1">Ground</text>
              )}

              {/* Person indicator */}
              {f === personFloor && (
                <circle cx={startX + buildW / 2} cy={y + floorH / 2}
                        r="10" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
              )}
            </g>
          );
        })}

        {/* Ground line */}
        <line x1={startX - 30} y1={groundY + floorH} x2={startX + buildW + 30} y2={groundY + floorH}
              stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6,3" />
      </svg>
    </div>
  );
}


const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
if (!document.querySelector('[data-micro-lesson-styles]')) {
  styleSheet.setAttribute('data-micro-lesson-styles', '');
  document.head.appendChild(styleSheet);
}

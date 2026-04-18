#!/usr/bin/env node
/**
 * One-shot: add role="img" + aria-label (or aria-hidden="true" for
 * decorative SVGs) to the 31 top-level SVG elements in visuals.js.
 *
 * Screen-reader-friendly labels for the quiz visual components. Rich
 * prop-driven descriptions stay as a follow-up — these labels identify
 * the diagram TYPE so blind users know a diagram is present.
 *
 * Run with: node scripts/add-svg-aria.js
 * Idempotent — skips any SVG that already has role=/aria-label=.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'microLessons', 'visuals.js');

// Map of component name → aria-label (or { hidden: true } for decorative).
// Derived from the grep of visuals.js root SVG tags (31 total).
const LABELS = {
  NumberLine:              'Number line',
  AngleDiagram:            'Angle diagram',
  BusStopDiagram:          'Bus stop method for division',
  RectangleDiagram:        'Rectangle with dimensions',
  RectangleComparison:     'Rectangle comparison',
  RectangleGrid:           'Grid of rectangles',
  TriangleAreaDiagram:     'Triangle for area calculation',
  ParallelogramDiagram:    'Parallelogram with dimensions',
  CuboidDiagram:           '3D cuboid diagram',
  CuboidComparison:        'Cuboid comparison',
  LShapeDiagram:           'L-shape with dimensions',
  AlphabetLine:            'Alphabet line',
  // LogicDiagram has a tiny 16×16 chevron — decorative
  LogicDiagram:            { hidden: true },
  DotPattern:              'Dot pattern',
  // AnalogyDisplay uses 24×24 arrows — decorative
  AnalogyDisplay:          { hidden: true },
  SDTTriangle:             'Speed-distance-time formula triangle',
  AngleDisplay:            'Angle display',
  QuadShape:               'Quadrilateral shape',
  ParallelLines:           'Parallel lines with transversal',
  ExteriorAngle:           'Exterior angle diagram',
  ClockFace:               'Clock face',
  RegularPolygon:          'Regular polygon',
  // FunctionMachine has a 24×20 bracket — decorative
  FunctionMachine:         { hidden: true },
  LineGraph:               'Line graph',
  BarChart:                'Bar chart',
  PieChart:                'Pie chart',
  PathBorderDiagram:       'Path and border diagram',
  ThermometerDiagram:      'Thermometer showing temperature',
  BuildingDiagram:         'Building with multiple floors',
};

const src = fs.readFileSync(FILE, 'utf8');
const lines = src.split('\n');

let curFn = null;
let edits = 0;
let skipped = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const fnMatch = line.match(/^export function (\w+)/);
  if (fnMatch) curFn = fnMatch[1];

  // Match the first SVG opener for each component only — stop after we
  // inject so multiple SVGs inside one component (e.g. AnalogyDisplay's
  // two arrows) still get treated as decorative via the hidden mapping.
  const isSvg = /^\s*<svg[\s>]/.test(line);
  if (!isSvg) continue;

  const label = LABELS[curFn];
  if (!label) continue;

  // Idempotency — if the opening tag (or the very next line) already has
  // role= or aria-label=/aria-hidden=, skip.
  const window = lines.slice(i, i + 3).join(' ');
  if (/role=|aria-label=|aria-hidden=/.test(window)) {
    skipped++;
    continue;
  }

  // Inject right after `<svg`. Keep on the same line for minimal diff noise.
  const inject = typeof label === 'object' && label.hidden
    ? ' aria-hidden="true"'
    : ` role="img" aria-label="${label}"`;
  lines[i] = line.replace(/<svg/, `<svg${inject}`);
  edits++;
}

fs.writeFileSync(FILE, lines.join('\n'));
console.log(`✓ ${edits} SVGs labelled, ${skipped} already had aria attributes.`);

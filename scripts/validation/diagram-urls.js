/**
 * Prints DiagramViewer URLs for the new #9b/#9c components alongside the
 * style reference (AngleDisplay, as used by Angles & Shapes Q1), so they can
 * be opened in separate tabs and compared side by side.
 *
 * Usage:  node scripts/validation/diagram-urls.js [port]
 *
 * Non-ASCII is escaped before base64 so the viewer's atob() round-trips it
 * cleanly — encoding "°" as raw UTF-8 bytes renders as "Â°".
 */

const PORT = process.argv[2] || 3007;

const enc = (o) =>
  Buffer.from(
    JSON.stringify(o).replace(/[-￿]/g, (c) =>
      '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
    )
  ).toString('base64');

const url = (component, props) =>
  `http://localhost:${PORT}/?diagram-viewer=true&component=${component}&props=${enc(props)}`;

const DEG = String.fromCharCode(176);

const views = [
  ['REFERENCE  (Angles Q1)', 'AngleDisplay', {
    angles: [
      { value: 115, label: `115${DEG}`, color: '#7C3AED' },
      { value: 65, label: `x${DEG}`, color: '#FDCB6E' },
    ],
    size: 200,
  }],
  ['CoordinateGrid reflection', 'CoordinateGrid', {
    xRange: [0, 10], yRange: [0, 8],
    polygon: [[2, 2], [4, 2], [4, 5], [2, 6]],
    polygonImage: [[8, 2], [6, 2], [6, 5], [8, 6]],
    mirrorLine: { vertical: 5 },
  }],
  ['CoordinateGrid coordinates', 'CoordinateGrid', {
    xRange: [-5, 5], yRange: [-5, 5],
    points: [
      { x: -3, y: 2, label: 'A', showCoords: true },
      { x: 4, y: -3, label: 'B' },
    ],
    mirrorLine: { diagonal: 'y=x' },
  }],
  ['VennDiagram 3-set', 'VennDiagram', {
    sets: ['Cycles', 'Swims', 'Runs'],
    regions: { A: 6, B: 4, C: 5, AB: 3, AC: 2, BC: 4, ABC: 2, outside: 1 },
    outsideLabel: 'none of these',
  }],
  ['VennDiagram 2-set, withheld', 'VennDiagram', {
    sets: ['Football', 'Tennis'],
    regions: { A: 12, B: 8, AB: 5, outside: 3 },
    unknownRegions: ['AB'],
    outsideLabel: 'neither',
  }],
  ['NetDiagram cuboid', 'NetDiagram', {
    cuboid: { length: 8, width: 3, height: 5, unit: 'cm' }, showDims: true,
  }],
  ['NetDiagram cube net', 'NetDiagram', {
    cells: [
      { col: 1, row: 0, label: 'A' }, { col: 0, row: 1, label: 'B' },
      { col: 1, row: 1, label: 'C', shaded: true }, { col: 2, row: 1, label: 'D' },
      { col: 3, row: 1, label: 'E' }, { col: 1, row: 2, label: 'F' },
    ],
  }],
  ['RegularPolygon symmetry', 'RegularPolygon', {
    sides: 6, eachAngle: 120, mirrorLines: 6, highlightAngle: false,
  }],
];

views.forEach(([label, component, props]) => {
  console.log(`${label}\n  ${url(component, props)}\n`);
});

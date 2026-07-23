/**
 * Diagram QA probe — the in-browser check every new SVG component must pass.
 *
 * WHY THIS EXISTS
 * ---------------
 * Building #9b/#9c it became clear that eyeballing a diagram, and even
 * measuring text-against-text overlaps, is not enough. A first pass at the
 * Venn diagram passed a text-vs-text check while its set captions were
 * sitting directly on the circle outlines, because nothing compared text
 * against SHAPES. Ben spotted it immediately by looking at it.
 *
 * So the check lives here, once, and every new diagram is held to the same
 * bar rather than to whatever I happened to remember to test that day.
 *
 * HOW TO USE
 * ----------
 * Start the dev server, open the component in the DiagramViewer route:
 *   ?diagram-viewer=true&component=<Name>&props=<base64 json>
 * then evaluate `probeSource` in the page (Chrome DevTools MCP
 * evaluate_script) and read the `problems` array. Empty = pass.
 *
 * WHAT IT ENFORCES (derived from AngleDiagram, the skill's named benchmark)
 *   1. no text overlapping other text
 *   2. no text sitting on a shape outline (circle, rect, polygon edge)
 *   3. nothing escaping the viewBox
 *   4. no text below the 11-unit minimum size
 *   5. every text has an explicit fontFamily
 *   6. palette is the app's house palette, not ad-hoc hexes
 *   7. accessibility: role="img" plus <title> and <desc>
 */

// The evidenced house palette. Derived from what the app and its benchmark
// diagrams ACTUALLY use, not from design-tokens.md — that file's blues
// (#3b82f6 / #93c5fd / #bfdbfe) are contradicted by SKILL.md's own
// consolidation map and appear nowhere in the app shell. See the session log
// for 23 Jul 2026.
const HOUSE_PALETTE = [
  '#6366f1', // IN-SVG primary — what AngleDiagram, the named benchmark, uses
             // for shape outlines and structural lines. Prefer this inside a
             // figure; #7C3AED is for the HTML caption beneath it.
  '#7C3AED', // primary (932 uses in src) — UI chrome and captions
  '#5A4BD1', // primary dark
  '#A29BFE', // primary light
  '#EDE8FF', // primary surface
  '#f0f0ff', // shape fill (AngleDiagram)
  '#FAFBFF', // surface
  '#E5E7EB', // grid / hairline
  '#1e293b', // text
  '#64748b', // text secondary
  '#9ca3af', // unknown / withheld value
  '#FF6B6B', // incorrect
  '#00B894', // correct
  '#FDCB6E', // accent
  // segment palette — for distinguishing categories
  '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc',
  'white', 'none', 'currentColor',
];

const probeSource = `() => {
  const HOUSE = ${JSON.stringify(HOUSE_PALETTE)}.map(c => c.toLowerCase());
  const svg = document.querySelector('#diagram-root svg, svg[role="img"]');
  if (!svg) return { rendered: false };
  const problems = [];

  const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\\s+/).map(Number);
  const [vx, vy, vw, vh] = vb;

  // Measure in the SVG's own user units but THROUGH any transform. getBBox()
  // returns the PRE-transform box, so a rotate(-90) label is reported where it
  // would have been unrotated — which is how two rotated dimension labels sat
  // visibly on top of each other while this check reported no overlaps.
  const root = svg.getScreenCTM();
  const toUser = (rect) => {
    const inv = root.inverse();
    const pt = (x, y) => {
      const p = svg.createSVGPoint(); p.x = x; p.y = y;
      const q = p.matrixTransform(inv); return q;
    };
    const a = pt(rect.left, rect.top), b = pt(rect.right, rect.bottom);
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
             w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
  };
  const texts = [...svg.querySelectorAll('text')].map(t => {
    const b = toUser(t.getBoundingClientRect());
    return {
      el: t, s: t.textContent,
      x: b.x, y: b.y, w: b.w, h: b.h,
      size: parseFloat(t.getAttribute('font-size') || t.getAttribute('fontSize') || '0'),
      family: t.getAttribute('font-family') || t.getAttribute('fontFamily'),
    };
  });

  // 1. text vs text
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 0 && oy > 0) problems.push('text "' + a.s + '" overlaps text "' + b.s + '"');
    }
  }

  // 2. text sitting ON a shape outline — the check that was missing
  const corners = (t) => [
    [t.x, t.y], [t.x + t.w, t.y], [t.x, t.y + t.h], [t.x + t.w, t.y + t.h],
    [t.x + t.w / 2, t.y + t.h / 2],
  ];
  [...svg.querySelectorAll('circle')].forEach((c, i) => {
    const cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
    if (r < 12) return; // point markers, not outlines
    texts.forEach(t => {
      const d = corners(t).map(([px, py]) => Math.hypot(px - cx, py - cy));
      if (Math.min(...d) <= r + 3 && Math.max(...d) >= r - 3)
        problems.push('text "' + t.s + '" sits on circle #' + i + ' outline');
    });
  });
  [...svg.querySelectorAll('polygon, polyline')].forEach((p, i) => {
    const pts = (p.getAttribute('points') || '').trim().split(/\\s+/)
      .map(s => s.split(',').map(Number)).filter(a => a.length === 2 && a.every(isFinite));
    if (pts.length < 2) return;
    const segDist = (px, py, x1, y1, x2, y2) => {
      const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy;
      if (!L) return Math.hypot(px - x1, py - y1);
      let t = ((px - x1) * dx + (py - y1) * dy) / L;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    };
    texts.forEach(t => {
      const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
      for (let k = 0; k < pts.length; k++) {
        const a = pts[k], b = pts[(k + 1) % pts.length];
        if (segDist(cx, cy, a[0], a[1], b[0], b[1]) < 7)
          problems.push('text "' + t.s + '" sits on polygon #' + i + ' edge');
      }
    });
  });

  // 3. inside the viewBox
  texts.forEach(t => {
    if (t.x < vx - 1 || t.y < vy - 1 || t.x + t.w > vx + vw + 1 || t.y + t.h > vy + vh + 1)
      problems.push('text "' + t.s + '" escapes the viewBox');
  });

  // 4/5. legibility + font family
  texts.forEach(t => {
    if (t.size && t.size < 11) problems.push('text "' + t.s + '" is ' + t.size + ', below the 11 minimum');
    if (!t.family) problems.push('text "' + t.s + '" has no fontFamily');
  });

  // 6. palette
  const offPalette = new Set();
  svg.querySelectorAll('*').forEach(el => {
    ['fill', 'stroke'].forEach(attr => {
      const v = (el.getAttribute(attr) || '').trim().toLowerCase();
      if (v && v !== 'none' && !v.startsWith('url(') && HOUSE.indexOf(v) === -1) offPalette.add(attr + '=' + v);
    });
  });
  offPalette.forEach(v => problems.push('off-palette colour ' + v));

  // 7. accessibility
  if (svg.getAttribute('role') !== 'img') problems.push('svg is missing role="img"');
  if (!svg.querySelector('title')) problems.push('svg is missing <title>');
  if (!svg.querySelector('desc')) problems.push('svg is missing <desc>');

  return { rendered: true, textCount: texts.length, problems };
}`;

module.exports = { probeSource, HOUSE_PALETTE };

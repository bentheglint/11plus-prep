// regenerate-triangle-svgs.js
// Regenerates all triangle SVGs in angles-shapes/ with accurate geometry
// and bisector-based label positioning.
//
// Handles: triangle-q*, right-triangle-q*, isosceles-q*, equilateral-q*
// Skips:   exterior-q*, straight-line-q*, point-q*, quadrilateral-q*, etc.
//
// Usage:
//   node regenerate-triangle-svgs.js          -- dry run (writes to regenerated/)
//   node regenerate-triangle-svgs.js --apply  -- overwrites originals (backs up first)

const fs = require('fs');
const path = require('path');

const DEG = Math.PI / 180;
const DIR = path.join(__dirname, 'public', 'images', 'questions', 'angles-shapes');
const REGEN_DIR = path.join(DIR, 'regenerated');
const BACKUP_DIR = path.join(DIR, 'backup-originals');

const applyMode = process.argv.includes('--apply');


// ════════════════════════════════════════════════════════
// SVG PARSING
// ════════════════════════════════════════════════════════

function parseAngleLabel(text) {
  text = text.trim();
  if (text === '?') return { type: 'unknown', displayText: '?' };

  // "48°" → numeric
  const numMatch = text.match(/^(\d+)°$/);
  if (numMatch) return { type: 'numeric', value: parseInt(numMatch[1]), displayText: text };

  // "2x°", "x°", "10t°", "8h°" → algebraic
  const algMatch = text.match(/^(\d*)([a-z])°$/);
  if (algMatch) {
    const coeff = algMatch[1] ? parseInt(algMatch[1]) : 1;
    return { type: 'algebraic', coeff, variable: algMatch[2], displayText: text };
  }

  return { type: 'unknown', displayText: text };
}

function parseSVGFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const basename = path.basename(filepath);

  // Extract SVG dimensions
  const dimMatch = content.match(/width="(\d+)"\s+height="(\d+)"/);
  const svgW = dimMatch ? parseInt(dimMatch[1]) : 380;
  const svgH = dimMatch ? parseInt(dimMatch[2]) : 280;

  // Extract all <text> elements (preserving order = vertex order)
  const textRegex = /<text[^>]*fill="([^"]*)"[^>]*>(.*?)<\/text>/g;
  const labels = [];
  let match;
  while ((match = textRegex.exec(content)) !== null) {
    labels.push({
      color: match[1],
      ...parseAngleLabel(match[2])
    });
  }

  // Detect extended line (exterior angle diagrams hidden in isosceles files)
  const hasExtendedLine = /<line[^>]*x2="[3-9]\d{2,}"/.test(content);

  // Determine type from filename
  let type =
    basename.startsWith('right-triangle') ? 'right' :
    basename.startsWith('isosceles') ? 'isosceles' :
    basename.startsWith('equilateral') ? 'equilateral' :
    basename.startsWith('triangle') ? 'triangle' : null;

  // Skip exterior angle variants (have extended line + exterior angle label)
  if (hasExtendedLine) type = 'exterior';

  return { labels, type, svgW, svgH, basename };
}


// ════════════════════════════════════════════════════════
// ANGLE SOLVER
// ════════════════════════════════════════════════════════

function computeNumericAngles(labels, isRight) {
  // For right-angled triangles, labels only contain the 2 non-right angles.
  // Total of those must be 90° (since 180° - 90° = 90°).
  const total = isRight ? 90 : 180;

  let numericSum = 0;
  let algCoeffSum = 0;
  const angles = new Array(labels.length).fill(null);

  for (let i = 0; i < labels.length; i++) {
    if (labels[i].type === 'numeric') {
      angles[i] = labels[i].value;
      numericSum += labels[i].value;
    } else if (labels[i].type === 'algebraic') {
      algCoeffSum += labels[i].coeff;
    }
  }

  const remaining = total - numericSum;

  // Solve algebraic variables
  if (algCoeffSum > 0) {
    const varValue = remaining / algCoeffSum;
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].type === 'algebraic') {
        angles[i] = labels[i].coeff * varValue;
      }
    }
  }

  // Fill unknowns
  const knownSum = angles.reduce((s, a) => s + (a || 0), 0);
  const unknowns = angles.filter(a => a === null).length;
  if (unknowns > 0) {
    const unknownValue = (total - knownSum) / unknowns;
    for (let i = 0; i < angles.length; i++) {
      if (angles[i] === null) angles[i] = unknownValue;
    }
  }

  return angles.map(a => Math.round(a * 100) / 100); // avoid floating point noise
}


// ════════════════════════════════════════════════════════
// GEOMETRY — same proven algorithm as the examples
// ════════════════════════════════════════════════════════

function computeTriangle(angles, svgW, svgH, forceType = null) {
  // Use the filename-based type, NOT auto-detection from angle values.
  // This prevents: triangle-q files getting tick marks when angles happen to
  // be isosceles, or right-angle squares when algebraic angles solve to 90°.
  const hasRight = forceType === 'right';
  const isIso = forceType === 'isosceles' || forceType === 'equilateral';

  const padX = Math.round(svgW * 0.092);  // ~35 for 380
  const padTop = 30, padBot = 35;
  const maxW = svgW - 2 * padX;
  const maxH = svgH - padTop - padBot;
  const baseY = svgH - padBot;

  let A, B, C, vertexAngleIndices; // which original index is at each vertex

  if (hasRight) {
    const rightIdx = angles.indexOf(90);
    const otherIndices = [0, 1, 2].filter(i => i !== rightIdx);
    const sorted = [...otherIndices].sort((a, b) => angles[b] - angles[a]);
    const cIdx = sorted[0]; // larger at bottom-right
    const aIdx = sorted[1]; // smaller at top

    const ratio = Math.sin(angles[cIdx] * DEG) / Math.sin(angles[aIdx] * DEG);
    let baseLen, height;
    if (ratio > 1) { height = maxH; baseLen = height / ratio; }
    else { baseLen = maxW; height = baseLen * ratio; }
    if (baseLen > maxW) { baseLen = maxW; height = baseLen * ratio; }
    if (height > maxH) { height = maxH; baseLen = height / ratio; }

    B = { x: padX, y: baseY };
    C = { x: padX + baseLen, y: baseY };
    A = { x: padX, y: baseY - height };
    vertexAngleIndices = [aIdx, rightIdx, cIdx];

  } else if (isIso) {
    let apexIdx, baseIdx1, baseIdx2;
    if (angles[0] === angles[1]) { apexIdx = 2; baseIdx1 = 0; baseIdx2 = 1; }
    else if (angles[0] === angles[2]) { apexIdx = 1; baseIdx1 = 0; baseIdx2 = 2; }
    else { apexIdx = 0; baseIdx1 = 1; baseIdx2 = 2; }

    const baseAngle = angles[baseIdx1];
    const sinApex = Math.sin(angles[apexIdx] * DEG) || 0.01;
    const AB = Math.sin(baseAngle * DEG) / sinApex;
    const uy = AB * Math.sin(baseAngle * DEG);

    const scale = Math.min(maxW, maxH / uy);
    const baseLen = scale;
    const midX = svgW / 2;
    B = { x: midX - baseLen / 2, y: baseY };
    C = { x: midX + baseLen / 2, y: baseY };
    A = { x: midX, y: baseY - uy * scale };
    vertexAngleIndices = [apexIdx, baseIdx1, baseIdx2];

  } else {
    let best = null, bestScore = Infinity;
    for (let ai = 0; ai < 3; ai++) {
      const others = [0, 1, 2].filter(i => i !== ai);
      for (let flip = 0; flip < 2; flip++) {
        const bi = flip ? others[1] : others[0];
        const ci = flip ? others[0] : others[1];
        const aA = angles[ai], aB = angles[bi], aC = angles[ci];
        const sinA = Math.sin(aA * DEG);
        if (sinA < 0.01) continue;
        const AB = Math.sin(aC * DEG) / sinA;
        const ux = AB * Math.cos(aB * DEG);
        const uy = AB * Math.sin(aB * DEG);
        if (uy < 0.1 || ux < -0.1 || ux > 1.1) continue;
        const score = Math.abs(ux - 0.5);
        if (score < bestScore) { bestScore = score; best = { ai, bi, ci, ux, uy }; }
      }
    }
    if (!best) best = { ai: 0, bi: 1, ci: 2, ux: 0.5, uy: 0.5 };

    const scale = Math.min(maxW, maxH / best.uy);
    const baseLen = scale;
    const midX = svgW / 2;
    B = { x: midX - baseLen / 2, y: baseY };
    C = { x: midX + baseLen / 2, y: baseY };
    A = { x: B.x + best.ux * scale, y: baseY - best.uy * scale };
    vertexAngleIndices = [best.ai, best.bi, best.ci];
  }

  return { A, B, C, vertexAngleIndices, hasRight, isIso };
}


// ════════════════════════════════════════════════════════
// LABEL POSITIONING — bisector direction + proportional distance
// ════════════════════════════════════════════════════════

function labelPosition(vertex, adj1, adj2, angleDeg, centroid) {
  const d1 = { x: adj1.x - vertex.x, y: adj1.y - vertex.y };
  const d2 = { x: adj2.x - vertex.x, y: adj2.y - vertex.y };
  const len1 = Math.sqrt(d1.x ** 2 + d1.y ** 2) || 1;
  const len2 = Math.sqrt(d2.x ** 2 + d2.y ** 2) || 1;
  const bis = { x: d1.x / len1 + d2.x / len2, y: d1.y / len1 + d2.y / len2 };
  const bisLen = Math.sqrt(bis.x ** 2 + bis.y ** 2) || 1;
  const dir = { x: bis.x / bisLen, y: bis.y / bisLen };

  const halfRad = (angleDeg / 2) * DEG;
  const textClear = Math.min(14 / Math.max(Math.sin(halfRad), 0.13), 65);
  const cx = centroid.x - vertex.x, cy = centroid.y - vertex.y;
  const distC = Math.sqrt(cx * cx + cy * cy) || 1;
  const d = Math.min(Math.max(textClear, 0.35 * distC, 30), distC * 0.55);

  return { x: vertex.x + dir.x * d, y: vertex.y + dir.y * d };
}


// ════════════════════════════════════════════════════════
// LABEL COLLISION RESOLUTION
// ════════════════════════════════════════════════════════

function resolveCollisions(vertexLabels) {
  const MIN_DIST = 35;
  const MAX_ITERS = 8;
  // Extract mutable positions
  const positions = vertexLabels.map(vl => vl.pos ? { x: vl.pos.x, y: vl.pos.y } : null);

  for (let iter = 0; iter < MAX_ITERS; iter++) {
    let moved = false;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (!positions[i] || !positions[j]) continue;
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST) {
          // Push apart along the line connecting vertex i to vertex j
          const vi = vertexLabels[i], vj = vertexLabels[j];
          const vdx = vj.vertex.x - vi.vertex.x;
          const vdy = vj.vertex.y - vi.vertex.y;
          const vdist = Math.sqrt(vdx * vdx + vdy * vdy) || 1;
          const nx = vdx / vdist, ny = vdy / vdist;
          const overlap = (MIN_DIST - dist) / 2 + 2;
          positions[i].x -= nx * overlap;
          positions[i].y -= ny * overlap;
          positions[j].x += nx * overlap;
          positions[j].y += ny * overlap;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // Write back
  for (let i = 0; i < vertexLabels.length; i++) {
    if (positions[i]) vertexLabels[i].pos = positions[i];
  }
}


// ════════════════════════════════════════════════════════
// SVG GENERATION
// ════════════════════════════════════════════════════════

function generateSVG(parsed, numericAngles) {
  const { labels, type, svgW, svgH } = parsed;
  const isRight = type === 'right';

  // For right-angled: build 3-angle array [90, label0_angle, label1_angle]
  let allAngles, allLabels;
  if (isRight) {
    const rightIdx = 0; // 90° goes first internally
    allAngles = [90, numericAngles[0], numericAngles[1]];
    allLabels = [
      { displayText: null, color: null }, // no label for right angle (shown as square)
      labels[0],
      labels[1]
    ];
  } else {
    allAngles = numericAngles;
    allLabels = labels;
  }

  const { A, B, C, vertexAngleIndices, hasRight, isIso } = computeTriangle(allAngles, svgW, svgH, type);
  const vertices = [A, B, C];
  const centroid = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
  const adjMap = [[B, C], [A, C], [A, B]];

  // Map original labels to vertices via vertexAngleIndices
  const vertexLabels = vertexAngleIndices.map((origIdx, vertIdx) => {
    const lbl = allLabels[origIdx];
    const angleDeg = allAngles[origIdx];
    const isRightAngle = hasRight && angleDeg === 90;
    const [adj1, adj2] = adjMap[vertIdx];
    const pos = isRightAngle ? null : labelPosition(vertices[vertIdx], adj1, adj2, angleDeg, centroid);
    return { pos, label: lbl, isRightAngle, vertIdx, angleDeg, vertex: vertices[vertIdx] };
  });

  // Resolve overlapping labels
  resolveCollisions(vertexLabels);

  // Build SVG
  let svg = `<svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">\n`;

  // Triangle polygon
  svg += `  <polygon points="${r(A.x)},${r(A.y)} ${r(B.x)},${r(B.y)} ${r(C.x)},${r(C.y)}" fill="lightskyblue" fill-opacity="0.15" stroke="black" stroke-width="2"/>\n`;

  // Right-angle square at B (which is always the 90° vertex in our layout)
  if (hasRight) {
    const rightVertIdx = vertexAngleIndices.findIndex((origIdx) => allAngles[origIdx] === 90);
    const rv = vertices[rightVertIdx];
    const adjs = vertices.filter((_, i) => i !== rightVertIdx);
    const sz = 18;
    const d1x = adjs[0].x - rv.x, d1y = adjs[0].y - rv.y;
    const d2x = adjs[1].x - rv.x, d2y = adjs[1].y - rv.y;
    const len1 = Math.sqrt(d1x ** 2 + d1y ** 2) || 1;
    const len2 = Math.sqrt(d2x ** 2 + d2y ** 2) || 1;
    const u1 = { x: d1x / len1 * sz, y: d1y / len1 * sz };
    const u2 = { x: d2x / len2 * sz, y: d2y / len2 * sz };
    svg += `  <polyline points="${r(rv.x+u1.x)},${r(rv.y+u1.y)} ${r(rv.x+u1.x+u2.x)},${r(rv.y+u1.y+u2.y)} ${r(rv.x+u2.x)},${r(rv.y+u2.y)}" fill="none" stroke="black" stroke-width="1.5"/>\n`;
  }

  // Isosceles tick marks on equal sides (from unique vertex to each base vertex)
  const isEquilateral = allAngles[0] === allAngles[1] && allAngles[1] === allAngles[2];
  if (isIso && !isEquilateral) {
    const uniqueOrigIdx = vertexAngleIndices.find(origIdx => {
      return allAngles.filter(a => a === allAngles[origIdx]).length === 1;
    });
    if (uniqueOrigIdx !== undefined) {
      const uniqueVertIdx = vertexAngleIndices.indexOf(uniqueOrigIdx);
      const equalVertIndices = [0, 1, 2].filter(i => i !== uniqueVertIdx);
      const uv = vertices[uniqueVertIdx];
      for (const evi of equalVertIndices) {
        const ev = vertices[evi];
        const mx = (uv.x + ev.x) / 2, my = (uv.y + ev.y) / 2;
        const dx = ev.x - uv.x, dy = ev.y - uv.y;
        const sl = Math.sqrt(dx ** 2 + dy ** 2) || 1;
        const px = -dy / sl * 10, py = dx / sl * 10;
        svg += `  <line x1="${r(mx-px)}" y1="${r(my-py)}" x2="${r(mx+px)}" y2="${r(my+py)}" stroke="black" stroke-width="2"/>\n`;
      }
    }
  }

  // Equilateral: tick marks on ALL three sides + base tick
  if (isEquilateral) {
    const sides = [[A, B], [B, C], [A, C]];
    for (const [v1, v2] of sides) {
      const mx = (v1.x + v2.x) / 2, my = (v1.y + v2.y) / 2;
      const dx = v2.x - v1.x, dy = v2.y - v1.y;
      const sl = Math.sqrt(dx ** 2 + dy ** 2) || 1;
      const px = -dy / sl * 10, py = dx / sl * 10;
      svg += `  <line x1="${r(mx-px)}" y1="${r(my-py)}" x2="${r(mx+px)}" y2="${r(my+py)}" stroke="black" stroke-width="2"/>\n`;
    }
  }

  // Angle labels
  for (const vl of vertexLabels) {
    if (vl.isRightAngle) continue; // shown as square
    if (!vl.label || !vl.label.displayText) continue;
    const { pos, label } = vl;
    svg += `  <text x="${r(pos.x)}" y="${r(pos.y + 5)}" font-family="Arial" font-size="16" fill="${label.color}" text-anchor="middle">${label.displayText}</text>\n`;
  }

  svg += `</svg>`;
  return svg;
}

function r(n) { return n.toFixed(1); }


// ════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════

function main() {
  // Find all triangle SVG files
  const files = fs.readdirSync(DIR).filter(f => {
    return f.endsWith('.svg') && (
      f.startsWith('triangle-q') ||
      f.startsWith('right-triangle-q') ||
      f.startsWith('isosceles-q') ||
      f.startsWith('equilateral-q')
    );
  }).sort();

  console.log(`Found ${files.length} triangle SVGs to regenerate.\n`);

  // Create output directory
  const outDir = applyMode ? null : REGEN_DIR;
  if (outDir) fs.mkdirSync(outDir, { recursive: true });
  if (applyMode) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  let success = 0, errors = 0;

  for (const file of files) {
    const filepath = path.join(DIR, file);
    try {
      const parsed = parseSVGFile(filepath);
      if (!parsed.type) { console.log(`  SKIP ${file} (unknown type)`); continue; }
      if (parsed.type === 'exterior') {
        // Copy as-is — these have extended lines and exterior angles we don't regenerate
        const dest = applyMode ? filepath : path.join(outDir, file);
        if (!applyMode) fs.copyFileSync(filepath, dest);
        console.log(`  COPY ${file} (exterior angle diagram — unchanged)`);
        success++;
        continue;
      }

      const isRight = parsed.type === 'right';
      const numericAngles = computeNumericAngles(parsed.labels, isRight);

      // Sanity check: angles should sum to 180 (or 90 for the non-right labels)
      const expectedSum = isRight ? 90 : 180;
      const actualSum = numericAngles.reduce((s, a) => s + a, 0);
      if (Math.abs(actualSum - expectedSum) > 1) {
        console.log(`  WARN ${file}: angles sum to ${actualSum} (expected ${expectedSum})`);
      }

      // For extreme triangles (min angle < 15°), use a generic well-proportioned
      // shape instead. This prevents nearly-degenerate triangles that are impossible
      // to label clearly. The algebraic labels still display correctly.
      const allAnglesForShape = isRight
        ? [90, ...numericAngles]
        : numericAngles;
      const minAngle = Math.min(...allAnglesForShape);
      let displayAngles = numericAngles;
      if (minAngle < 15 && !isRight) {
        // Substitute a readable generic shape, keeping the same label count
        displayAngles = numericAngles.length === 3 ? [65, 60, 55] : numericAngles;
        console.log(`  NOTE ${file}: min angle ${minAngle}° → using generic shape`);
      }

      const svg = generateSVG(parsed, displayAngles);

      if (applyMode) {
        // Backup original, then overwrite
        fs.copyFileSync(filepath, path.join(BACKUP_DIR, file));
        fs.writeFileSync(filepath, svg);
        console.log(`  ✓ ${file} (applied)`);
      } else {
        fs.writeFileSync(path.join(outDir, file), svg);
        console.log(`  ✓ ${file}`);
      }
      success++;
    } catch (err) {
      console.log(`  ✗ ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${success} regenerated, ${errors} errors.`);
  if (!applyMode) {
    console.log(`Output in: ${REGEN_DIR}`);
    console.log(`\nReview the output, then run with --apply to overwrite originals.`);
  } else {
    console.log(`Originals backed up in: ${BACKUP_DIR}`);
  }
}

main();

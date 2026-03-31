/**
 * Extract all diagram screens from staging files and generate DiagramViewer URLs.
 * Each URL renders exactly one visual component with evaluated props.
 * Output: scripts/diagram-urls.json
 */

const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'src', 'microLessons', 'staging');
const BASE_URL = 'http://localhost:3000/?diagram-viewer';

// Components worth visual inspection (SVG/canvas-based, not text-based)
const VISUAL_COMPONENTS = new Set([
  'AngleDisplay', 'AngleDiagram', 'ParallelLines', 'ExteriorAngle', 'RegularPolygon',
  'QuadShape', 'NumberLine', 'CuboidDiagram', 'RectangleDiagram', 'LShapeDiagram',
  'BarModel', 'SDTTriangle', 'PlaceValueChart', 'BusStopDiagram', 'ColumnMethod',
  'GridModel', 'SequenceChain'
]);

// Skip text-based components that don't have geometric overlap risks
const SKIP_COMPONENTS = new Set([
  'WorkedExample', 'SentenceDisplay', 'LetterTiles', 'AlphabetLine',
  'CodeTable', 'AnalogyDisplay', 'WordChipsDisplay'
]);

function resolveVal(expr, vars) {
  if (expr === undefined || expr === null) return undefined;
  expr = String(expr).trim();
  if (/^-?\d+\.?\d*$/.test(expr)) return parseFloat(expr);
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  const strM = expr.match(/^["'](.*)["']$/);
  if (strM) return strM[1];
  const vM = expr.match(/^v\.(\w+)$/);
  if (vM) return vars[vM[1]];
  const orM = expr.match(/^v\.(\w+)\s*\|\|\s*v\.(\w+)$/);
  if (orM) return vars[orM[1]] !== undefined ? vars[orM[1]] : vars[orM[2]];
  if (expr.startsWith('`') && expr.endsWith('`')) {
    let s = expr.slice(1, -1);
    s = s.replace(/\$\{v\.(\w+)\}/g, (_, k) => vars[k] !== undefined ? String(vars[k]) : '?');
    return s;
  }
  // Expression like v.angle1 + v.angle2 - try basic arithmetic
  const addM = expr.match(/^v\.(\w+)\s*\+\s*v\.(\w+)$/);
  if (addM && typeof vars[addM[1]] === 'number' && typeof vars[addM[2]] === 'number') {
    return vars[addM[1]] + vars[addM[2]];
  }
  const subM = expr.match(/^(\d+)\s*-\s*v\.(\w+)$/);
  if (subM && typeof vars[subM[2]] === 'number') {
    return parseFloat(subM[1]) - vars[subM[2]];
  }
  const subM2 = expr.match(/^v\.(\w+)\s*-\s*v\.(\w+)$/);
  if (subM2 && typeof vars[subM2[1]] === 'number' && typeof vars[subM2[2]] === 'number') {
    return vars[subM2[1]] - vars[subM2[2]];
  }
  return expr; // Return raw expression if can't resolve
}

function extractVars(vsBlock) {
  const vars = {};
  const kvRegex = /(\w+):\s*(?:"([^"]*?)"|'([^']*?)'|(-?\d+\.?\d*)\b|(true|false)\b)/g;
  let kv;
  while ((kv = kvRegex.exec(vsBlock)) !== null) {
    const key = kv[1];
    if (key === 'name' || key === 'scenario') continue; // Skip narrative vars
    if (kv[2] !== undefined) vars[key] = kv[2];
    else if (kv[3] !== undefined) vars[key] = kv[3];
    else if (kv[4] !== undefined) vars[key] = parseFloat(kv[4]);
    else if (kv[5] !== undefined) vars[key] = kv[5] === 'true';
  }
  return vars;
}

function extractProps(propsStr, vars) {
  // Try to build a JS-like props object by evaluating the props string
  // This handles common patterns in our codebase
  const props = {};

  // Extract simple key: value pairs
  const simpleKV = /(\w+):\s*([^,\n{}[\]]+?)(?:\s*,|\s*$)/gm;
  let m;
  while ((m = simpleKV.exec(propsStr)) !== null) {
    const key = m[1];
    const val = resolveVal(m[2].trim(), vars);
    if (val !== undefined && val !== '') {
      props[key] = val;
    }
  }

  // Extract angles array (for AngleDisplay)
  const anglesM = propsStr.match(/angles:\s*\[([\s\S]*?)\]\s*(?:,|\n)/);
  if (anglesM) {
    const angles = [];
    // Split by }, { pattern
    const entries = anglesM[1].split(/\}\s*,\s*\{/);
    for (const entry of entries) {
      const valM = entry.match(/value:\s*([^,}\n]+)/);
      // Handle backtick labels: label: `text ${v.var}°` — need to capture until closing backtick
      const labM = entry.match(/label:\s*(`[^`]*`|"[^"]*"|'[^']*'|[^,}\n]+)/);
      const colM = entry.match(/color:\s*["']([^"']+)["']/);
      if (valM) {
        const val = resolveVal(valM[1].trim(), vars);
        const label = labM ? resolveVal(labM[1].trim(), vars) : '';
        const color = colM ? colM[1] : '#818cf8';
        angles.push({
          value: typeof val === 'number' ? val : 0,
          label: String(label || ''),
          color
        });
      }
    }
    if (angles.length > 0) props.angles = angles;
  }

  // Extract markers array (for NumberLine)
  const markersM = propsStr.match(/markers:\s*\[([\s\S]*?)\]\s*(?:,|\n)/);
  if (markersM) {
    try {
      // Try simple number array
      const nums = markersM[1].split(',').map(s => {
        const v = resolveVal(s.trim(), vars);
        return typeof v === 'number' ? v : null;
      }).filter(n => n !== null);
      if (nums.length > 0) props.markers = nums;
    } catch (e) {}
  }

  // Extract segments array (for BarModel)
  const segM = propsStr.match(/segments:\s*\[([\s\S]*?)\]\s*(?:,|\n)/);
  if (segM) {
    const segments = [];
    const segEntries = segM[1].split(/\}\s*,\s*\{/);
    for (const entry of segEntries) {
      const valM = entry.match(/value:\s*([^,}\n]+)/);
      const labM = entry.match(/label:\s*([^,}\n]+)/);
      const colM = entry.match(/color:\s*["']([^"']+)["']/);
      if (valM) {
        const seg = {};
        const v = resolveVal(valM[1].trim(), vars);
        if (v !== undefined) seg.value = v;
        if (labM) seg.label = String(resolveVal(labM[1].trim(), vars) || '');
        if (colM) seg.color = colM[1];
        segments.push(seg);
      }
    }
    if (segments.length > 0) props.segments = segments;
  }

  return props;
}

function processFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const topic = fileName.replace('-subconcepts.js', '');
  const diagrams = [];

  // Find lessons
  const lessonRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*templateType:/g;
  let lm;
  const lessons = [];
  while ((lm = lessonRegex.exec(src)) !== null) {
    lessons.push({ id: lm[1], pos: lm.index });
  }

  // Find sub-concepts
  const scRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*name:\s*["']([^"']+)["']/g;
  let sm;
  const subConcepts = [];
  while ((sm = scRegex.exec(src)) !== null) {
    subConcepts.push({ id: sm[1], name: sm[2], pos: sm.index });
  }

  for (let li = 0; li < lessons.length; li++) {
    const lesson = lessons[li];
    const nextPos = li + 1 < lessons.length ? lessons[li + 1].pos : src.length;
    const block = src.substring(lesson.pos, nextPos);

    // Find parent sub-concept
    let scId = 'unknown', scName = 'unknown';
    for (let si = subConcepts.length - 1; si >= 0; si--) {
      if (subConcepts[si].pos < lesson.pos) {
        scId = subConcepts[si].id;
        scName = subConcepts[si].name;
        break;
      }
    }

    // Get first variableSet
    const vsMatch = block.match(/variableSets:\s*\[\s*\{([\s\S]*?)\}\s*,/);
    const vars = vsMatch ? extractVars(vsMatch[1]) : {};

    // Find screens
    const screenRegex = /type:\s*["'](hook|teach|interact|consolidate)["']/g;
    let screenM;
    const screens = [];
    while ((screenM = screenRegex.exec(block)) !== null) {
      screens.push({ type: screenM[1], pos: screenM.index });
    }

    // Find components
    const compRegex = /component:\s*['"]([A-Z]\w+)['"]/g;
    let cm;
    while ((cm = compRegex.exec(block)) !== null) {
      const component = cm[1];
      if (SKIP_COMPONENTS.has(component)) continue;
      if (!VISUAL_COMPONENTS.has(component)) continue;

      const compPos = cm.index;

      // Screen type
      let screenType = '?';
      for (let si = screens.length - 1; si >= 0; si--) {
        if (screens[si].pos < compPos) { screenType = screens[si].type; break; }
      }

      // Extract props
      const afterComp = block.substring(compPos, compPos + 3000);
      const propsMatch = afterComp.match(/props:\s*\(v\)\s*=>\s*\(\{([\s\S]*?)\}\s*\)/);
      let props = {};
      if (propsMatch) {
        props = extractProps(propsMatch[1], vars);
      }

      // Build URL
      const propsJson = JSON.stringify(props);
      const propsEncoded = encodeURIComponent(propsJson);
      const url = `${BASE_URL}&component=${component}&json=${propsEncoded}`;

      diagrams.push({
        topic,
        scId,
        scName,
        lesson: lesson.id,
        screen: screenType,
        component,
        props,
        url
      });
    }
  }

  return diagrams;
}

// Main
const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('-subconcepts.js'));
let allDiagrams = [];

for (const file of files) {
  const diagrams = processFile(path.join(STAGING_DIR, file));
  allDiagrams = allDiagrams.concat(diagrams);
}

// Summary
console.log(`Extracted ${allDiagrams.length} diagram screens from ${files.length} files\n`);

const byComponent = {};
allDiagrams.forEach(d => { byComponent[d.component] = (byComponent[d.component] || 0) + 1; });
console.log('By component:');
Object.entries(byComponent).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
  console.log(`  ${c.padEnd(25)} ${n}`);
});

const byTopic = {};
allDiagrams.forEach(d => { byTopic[d.topic] = (byTopic[d.topic] || 0) + 1; });
console.log('\nBy topic:');
Object.entries(byTopic).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => {
  console.log(`  ${t.padEnd(30)} ${n}`);
});

// Priority groups
const p0Components = ['AngleDisplay', 'AngleDiagram', 'ParallelLines', 'ExteriorAngle', 'RegularPolygon', 'QuadShape'];
const p0 = allDiagrams.filter(d => p0Components.includes(d.component));
const p1 = allDiagrams.filter(d => !p0Components.includes(d.component));

console.log(`\nP0 (geometry - overlap risk): ${p0.length} diagrams`);
console.log(`P1 (layout diagrams): ${p1.length} diagrams`);

// Save
const output = {
  timestamp: new Date().toISOString(),
  total: allDiagrams.length,
  p0Count: p0.length,
  p1Count: p1.length,
  p0: p0,
  p1: p1
};

fs.writeFileSync(path.join(__dirname, 'diagram-urls.json'), JSON.stringify(output, null, 2));
console.log('\nSaved to scripts/diagram-urls.json');

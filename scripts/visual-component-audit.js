/**
 * Visual Component Audit Script v2
 *
 * Scans all 37 staging files for visual component issues:
 * 1. Label overlap risks (small angles, long labels, crowded elements)
 * 2. Diagram relevance (component type vs topic)
 * 3. Structural issues (impossible geometry, missing props, extreme values)
 */

const fs = require('fs');
const path = require('path');

const STAGING_DIR = path.join(__dirname, '..', 'src', 'microLessons', 'staging');

// ── Component checks ───────────────────────────────────────────────────────

function checkAngleDisplay(anglesArr, label) {
  const issues = [];
  if (!anglesArr || anglesArr.length === 0) return issues;

  anglesArr.forEach((a, i) => {
    if (typeof a.value === 'number' && a.value > 0 && a.value < 20) {
      issues.push({ sev: 'P1', check: 'small-angle', msg: `Angle ${a.value}° is very small — label likely overlaps ray` });
    }
  });

  if (anglesArr.length >= 2) {
    const longLabels = anglesArr.filter(a => a.label && a.label.length > 8);
    if (longLabels.length >= 2) {
      issues.push({ sev: 'P2', check: 'long-labels', msg: `${longLabels.length} angles with long labels — overlap risk: ${longLabels.map(l => '"' + l.label + '"').join(', ')}` });
    }
  }

  const numericAngles = anglesArr.filter(a => typeof a.value === 'number' && a.value > 0);
  const total = numericAngles.reduce((s, a) => s + a.value, 0);
  if (total > 365 && numericAngles.length >= 2) {
    issues.push({ sev: 'P0', check: 'impossible-geometry', msg: `Angles sum to ${total}° (> 360°) — impossible` });
  }

  if (anglesArr.length >= 4) {
    issues.push({ sev: 'P2', check: 'crowded-angles', msg: `${anglesArr.length} angles in one display — crowded` });
  }

  return issues;
}

function checkParallelLines(givenAngle) {
  if (typeof givenAngle !== 'number') return [];
  if (givenAngle < 15 || givenAngle > 165) {
    return [{ sev: 'P1', check: 'extreme-parallel-angle', msg: `ParallelLines givenAngle=${givenAngle}° — labels overlap at extreme angles` }];
  }
  return [];
}

function checkExteriorAngle(angles) {
  const issues = [];
  angles.forEach((a, i) => {
    if (typeof a === 'number' && a > 0 && a < 15) {
      issues.push({ sev: 'P1', check: 'small-exterior-angle', msg: `ExteriorAngle angle${i+1}=${a}° — very small, overlap likely` });
    }
  });
  return issues;
}

function checkRegularPolygon(sides, showDiagonals) {
  const issues = [];
  if (typeof sides === 'number' && sides > 10 && showDiagonals) {
    issues.push({ sev: 'P2', check: 'polygon-clutter', msg: `RegularPolygon ${sides} sides + diagonals — visual clutter` });
  }
  return issues;
}

function checkQuadShape(angles) {
  const issues = [];
  if (!Array.isArray(angles)) return issues;

  angles.forEach((a, i) => {
    if (typeof a === 'number' && a > 0 && a < 20) {
      issues.push({ sev: 'P1', check: 'small-quad-angle', msg: `QuadShape angle[${i}]=${a}° — very small` });
    }
  });

  const numAngles = angles.filter(a => typeof a === 'number');
  if (numAngles.length === 4) {
    const total = numAngles.reduce((s, a) => s + a, 0);
    if (Math.abs(total - 360) > 1) {
      issues.push({ sev: 'P0', check: 'quad-sum-wrong', msg: `QuadShape angles sum to ${total}° (should be 360°)` });
    }
  }
  return issues;
}

function checkNumberLine(min, max) {
  const issues = [];
  if (typeof min === 'number' && typeof max === 'number' && min >= max) {
    issues.push({ sev: 'P0', check: 'invalid-numberline', msg: `NumberLine min=${min} >= max=${max} — invalid range` });
  }
  return issues;
}

function checkCuboidDiagram(length, width, height) {
  const issues = [];
  [['length', length], ['width', width], ['height', height]].forEach(([name, val]) => {
    if (val === 0) {
      issues.push({ sev: 'P0', check: 'zero-cuboid-dim', msg: `CuboidDiagram ${name}=0 — invisible face` });
    }
  });
  return issues;
}

// ── Diagram relevance ──────────────────────────────────────────────────────

const TOPIC_VISUALS = {
  anglesshapes: ['AngleDisplay', 'AngleDiagram', 'QuadShape', 'ParallelLines', 'ExteriorAngle', 'RegularPolygon'],
  areaperimeter: ['RectangleDiagram', 'LShapeDiagram', 'BarModel', 'GridModel'],
  volume: ['CuboidDiagram', 'BarModel'],
  fractions: ['BarModel', 'NumberLine', 'GridModel'],
  decimals: ['PlaceValueChart', 'NumberLine', 'BarModel'],
  percentages: ['BarModel', 'NumberLine', 'GridModel'],
  negativenumbers: ['NumberLine'],
  placevalue: ['PlaceValueChart', 'NumberLine'],
  ratio: ['BarModel'],
  sequences: ['SequenceChain', 'NumberLine'],
  longdivision: ['BusStopDiagram', 'BarModel', 'NumberLine'],
  longmultiplication: ['ColumnMethod', 'GridModel'],
  algebra: ['BarModel', 'NumberLine'],
  speeddistancetime: ['SDTTriangle', 'NumberLine', 'BarModel'],
  datahandling: ['BarModel', 'NumberLine'],
  primenumbersfactors: ['NumberLine', 'GridModel', 'BarModel'],
  grammar: ['SentenceDisplay'],
  punctuation: ['SentenceDisplay'],
  spelling: ['SentenceDisplay', 'LetterTiles'],
  comprehension: ['SentenceDisplay'],
  vocabulary: ['SentenceDisplay'],
  wordclass: ['SentenceDisplay'],
  synonyms: ['SentenceDisplay', 'AnalogyDisplay'],
  antonyms: ['AnalogyDisplay', 'SentenceDisplay'],
  compoundwords: ['LetterTiles'],
  hiddenwords: ['LetterTiles'],
  lettercodes: ['AlphabetLine', 'CodeTable'],
  lettermove: ['LetterTiles', 'AlphabetLine'],
  lettersums: ['AlphabetLine'],
  letterpairseries: ['SequenceChain', 'AlphabetLine'],
  missingletterswords: ['LetterTiles'],
  numberseries: ['SequenceChain'],
  numberwordcodes: ['CodeTable'],
  oddtwoout: ['WordChipsDisplay'],
  sharedletter: ['LetterTiles'],
  verbalanalogies: ['AnalogyDisplay'],
  wordcodeanalogies: ['CodeTable'],
  logicandlanguage: ['SentenceDisplay'],
};

// ── Value resolver ─────────────────────────────────────────────────────────

function resolveVal(expr, vars) {
  if (expr === undefined || expr === null) return undefined;
  expr = String(expr).trim();

  // Number
  if (/^-?\d+\.?\d*$/.test(expr)) return parseFloat(expr);

  // Boolean
  if (expr === 'true') return true;
  if (expr === 'false') return false;

  // String
  const strM = expr.match(/^["'](.*)["']$/);
  if (strM) return strM[1];

  // v.key
  const vM = expr.match(/^v\.(\w+)$/);
  if (vM) return vars[vM[1]];

  // v.key || v.other
  const orM = expr.match(/^v\.(\w+)\s*\|\|\s*v\.(\w+)$/);
  if (orM) return vars[orM[1]] !== undefined ? vars[orM[1]] : vars[orM[2]];

  // Template literal `...${v.x}...`
  if (expr.startsWith('`') && expr.endsWith('`')) {
    let s = expr.slice(1, -1);
    s = s.replace(/\$\{v\.(\w+)\}/g, (_, k) => vars[k] !== undefined ? String(vars[k]) : '?');
    return s;
  }

  return undefined;
}

// ── Main scanning logic ────────────────────────────────────────────────────

function scanFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const topic = fileName.replace('-subconcepts.js', '');
  const issues = [];

  // Step 1: Find all sub-concept blocks (id that doesn't contain - followed by lesson-type suffix)
  // Actually, let's find all variableSets first, then all component references

  // Find sub-concept boundaries
  const scRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*name:\s*["']([^"']+)["']/g;
  let scMatch;
  const subConcepts = [];
  while ((scMatch = scRegex.exec(src)) !== null) {
    subConcepts.push({ id: scMatch[1], name: scMatch[2], pos: scMatch.index });
  }

  // Find lesson boundaries within each sub-concept
  const lessonRegex = /\{\s*\n\s*id:\s*["']([^"']+)["'],\s*\n\s*templateType:/g;
  let lMatch;
  const lessons = [];
  while ((lMatch = lessonRegex.exec(src)) !== null) {
    lessons.push({ id: lMatch[1], pos: lMatch.index });
  }

  let _debug_lessonsProcessed = 0, _debug_compsFound = 0, _debug_propsFound = 0, _debug_checksRun = 0;

  // For each lesson, get its sub-concept, extract first variableSet, then check components
  for (let li = 0; li < lessons.length; li++) {
    const lesson = lessons[li];
    const nextLessonPos = li + 1 < lessons.length ? lessons[li + 1].pos : src.length;
    const lessonBlock = src.substring(lesson.pos, nextLessonPos);

    // Find parent sub-concept
    let scId = 'unknown', scName = 'unknown';
    for (let si = subConcepts.length - 1; si >= 0; si--) {
      if (subConcepts[si].pos < lesson.pos) {
        scId = subConcepts[si].id;
        scName = subConcepts[si].name;
        break;
      }
    }

    // Extract first variableSet values
    const vars = {};
    const vsMatch = lessonBlock.match(/variableSets:\s*\[\s*\{([\s\S]*?)\}\s*,/);
    if (vsMatch) {
      const vsStr = vsMatch[1];
      // Extract simple key: value pairs
      const kvRegex = /(\w+):\s*(?:"([^"]*?)"|'([^']*?)'|(-?\d+\.?\d*)\b|(true|false)\b|\[([^\]]*?)\])/g;
      let kv;
      while ((kv = kvRegex.exec(vsStr)) !== null) {
        const key = kv[1];
        if (kv[2] !== undefined) vars[key] = kv[2]; // double-quoted string
        else if (kv[3] !== undefined) vars[key] = kv[3]; // single-quoted string
        else if (kv[4] !== undefined) vars[key] = parseFloat(kv[4]); // number
        else if (kv[5] !== undefined) vars[key] = kv[5] === 'true'; // boolean
        else if (kv[6] !== undefined) {
          // Try to parse simple arrays
          try {
            const arrStr = '[' + kv[6] + ']';
            // Only parse if it looks like numbers or strings
            if (/^[\d\s,.\-"']+$/.test(kv[6].trim())) {
              vars[key] = JSON.parse(arrStr.replace(/'/g, '"'));
            }
          } catch(e) {}
        }
      }
    }

    // Find screen types and their visual components
    const screenRegex = /type:\s*["'](hook|teach|interact|consolidate)["']/g;
    let sMatch;
    const screens = [];
    while ((sMatch = screenRegex.exec(lessonBlock)) !== null) {
      screens.push({ type: sMatch[1], pos: sMatch.index });
    }

    // Find all component references in this lesson
    const compRegex = /component:\s*["']([A-Z]\w+)["']/g;
    let cMatch;
    while ((cMatch = compRegex.exec(lessonBlock)) !== null) {
      const component = cMatch[1];
      if (component === 'WorkedExample') continue; // Skip text-only

      const compPos = cMatch.index;

      // Determine which screen this component is in
      let screenType = '?';
      for (let si = screens.length - 1; si >= 0; si--) {
        if (screens[si].pos < compPos) {
          screenType = screens[si].type;
          break;
        }
      }

      const context = { file: fileName, topic, scId, scName, lesson: lesson.id, screen: screenType, component };

      // Check relevance
      const topicKey = topic.toLowerCase();
      const allowed = TOPIC_VISUALS[topicKey];
      if (allowed && !allowed.includes(component)) {
        issues.push({ ...context, sev: 'P1', check: 'wrong-visual', msg: `${component} is unusual for "${topic}" (expected: ${allowed.join(', ')})` });
      }

      // Extract props for component-specific checks
      const afterComp = lessonBlock.substring(compPos, compPos + 3000);
      const propsMatch = afterComp.match(/props:\s*\(v\)\s*=>\s*\(\{([\s\S]*?)\}\s*\)/);
      if (!propsMatch) continue;

      const propsStr = propsMatch[1];

      // ── AngleDisplay ──
      if (component === 'AngleDisplay') {
        const anglesBlock = propsStr.match(/angles:\s*\[([\s\S]*?)\]/);
        if (anglesBlock) {
          const angleEntries = anglesBlock[1].split(/\},?\s*\{/);
          const angles = [];
          for (const entry of angleEntries) {
            const valM = entry.match(/value:\s*([^,}\n]+)/);
            const labM = entry.match(/label:\s*([^,}\n]+)/);
            if (valM) {
              const value = resolveVal(valM[1].trim(), vars);
              const label = labM ? (resolveVal(labM[1].trim(), vars) || '') : '';
              angles.push({ value: typeof value === 'number' ? value : 0, label: String(label) });
            }
          }
          const compIssues = checkAngleDisplay(angles, '');
          compIssues.forEach(ci => issues.push({ ...context, ...ci }));
        }
      }

      // ── ParallelLines ──
      if (component === 'ParallelLines') {
        const gaM = propsStr.match(/givenAngle:\s*([^,}\n]+)/);
        if (gaM) {
          const ga = resolveVal(gaM[1].trim(), vars);
          const compIssues = checkParallelLines(ga);
          compIssues.forEach(ci => issues.push({ ...context, ...ci }));
        }
      }

      // ── ExteriorAngle ──
      if (component === 'ExteriorAngle') {
        const a1M = propsStr.match(/angle1:\s*([^,}\n]+)/);
        const a2M = propsStr.match(/angle2:\s*([^,}\n]+)/);
        const a3M = propsStr.match(/angle3:\s*([^,}\n]+)/);
        const angles = [a1M, a2M, a3M].map(m => m ? resolveVal(m[1].trim(), vars) : 0).filter(v => typeof v === 'number');
        const compIssues = checkExteriorAngle(angles);
        compIssues.forEach(ci => issues.push({ ...context, ...ci }));
      }

      // ── RegularPolygon ──
      if (component === 'RegularPolygon') {
        const sidesM = propsStr.match(/sides:\s*([^,}\n]+)/);
        const diagM = propsStr.match(/showDiagonals:\s*([^,}\n]+)/);
        const sides = sidesM ? resolveVal(sidesM[1].trim(), vars) : 0;
        const showDiag = diagM ? resolveVal(diagM[1].trim(), vars) : false;
        const compIssues = checkRegularPolygon(sides, showDiag);
        compIssues.forEach(ci => issues.push({ ...context, ...ci }));
      }

      // ── QuadShape ──
      if (component === 'QuadShape') {
        const angM = propsStr.match(/angles:\s*\[([^\]]+)\]/);
        if (angM) {
          const angles = angM[1].split(',').map(s => resolveVal(s.trim(), vars)).filter(v => typeof v === 'number');
          const compIssues = checkQuadShape(angles);
          compIssues.forEach(ci => issues.push({ ...context, ...ci }));
        }
      }

      // ── NumberLine ──
      if (component === 'NumberLine') {
        const minM = propsStr.match(/min:\s*([^,}\n]+)/);
        const maxM = propsStr.match(/max:\s*([^,}\n]+)/);
        const min = minM ? resolveVal(minM[1].trim(), vars) : undefined;
        const max = maxM ? resolveVal(maxM[1].trim(), vars) : undefined;
        const compIssues = checkNumberLine(min, max);
        compIssues.forEach(ci => issues.push({ ...context, ...ci }));
      }

      // ── CuboidDiagram ──
      if (component === 'CuboidDiagram') {
        const lM = propsStr.match(/length:\s*([^,}\n]+)/);
        const wM = propsStr.match(/width:\s*([^,}\n]+)/);
        const hM = propsStr.match(/height:\s*([^,}\n]+)/);
        const l = lM ? resolveVal(lM[1].trim(), vars) : undefined;
        const w = wM ? resolveVal(wM[1].trim(), vars) : undefined;
        const h = hM ? resolveVal(hM[1].trim(), vars) : undefined;
        const compIssues = checkCuboidDiagram(l, w, h);
        compIssues.forEach(ci => issues.push({ ...context, ...ci }));
      }
    }
  }

  return issues;
}

// ── Run ────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('-subconcepts.js'));
console.log(`Scanning ${files.length} staging files...\n`);

let allIssues = [];
const fileCounts = {};

for (const file of files) {
  try {
    const issues = scanFile(path.join(STAGING_DIR, file));
    allIssues = allIssues.concat(issues);
    fileCounts[file] = issues.length;
  } catch (err) {
    console.error(`ERROR in ${file}: ${err.message}`);
  }
}

// Sort by severity
const sevOrder = { P0: 0, P1: 1, P2: 2 };
allIssues.sort((a, b) => (sevOrder[a.sev] || 9) - (sevOrder[b.sev] || 9));

// ── Report ─────────────────────────────────────────────────────────────────

console.log('═'.repeat(80));
console.log('VISUAL COMPONENT AUDIT REPORT');
console.log('═'.repeat(80));
console.log(`Total issues: ${allIssues.length}`);
console.log(`  P0 (critical): ${allIssues.filter(i => i.sev === 'P0').length}`);
console.log(`  P1 (important): ${allIssues.filter(i => i.sev === 'P1').length}`);
console.log(`  P2 (minor): ${allIssues.filter(i => i.sev === 'P2').length}`);
console.log();

// By check
const byCheck = {};
allIssues.forEach(i => { byCheck[i.check] = (byCheck[i.check] || 0) + 1; });
console.log('BY CHECK TYPE:');
Object.entries(byCheck).sort((a, b) => b[1] - a[1]).forEach(([check, count]) => {
  console.log(`  ${check.padEnd(30)} ${count}`);
});
console.log();

// By file (only files with issues)
console.log('BY FILE (with issues):');
Object.entries(fileCounts).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).forEach(([file, count]) => {
  console.log(`  ${file.padEnd(50)} ${count}`);
});
console.log();

// Detailed
console.log('DETAILED ISSUES:');
console.log('─'.repeat(80));
allIssues.forEach(iss => {
  console.log(`[${iss.sev}] ${iss.file} > ${iss.scName || iss.scId} > ${iss.lesson} > ${iss.screen} > ${iss.component}`);
  console.log(`      ${iss.msg}`);
});

// Save
const report = {
  timestamp: new Date().toISOString(),
  summary: { total: allIssues.length, p0: allIssues.filter(i => i.sev === 'P0').length, p1: allIssues.filter(i => i.sev === 'P1').length, p2: allIssues.filter(i => i.sev === 'P2').length },
  byCheck,
  issues: allIssues
};
fs.writeFileSync(path.join(__dirname, 'visual-component-audit-report.json'), JSON.stringify(report, null, 2));
console.log(`\nReport saved to scripts/visual-component-audit-report.json`);

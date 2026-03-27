/**
 * Visual Audit Script v2 — Refined analysis
 * Reads all 37 staging files and produces a curated visual quality report.
 * Fixes: better sub-concept matching for area-perimeter, smarter BarModel classification,
 * improved suggestion engine.
 */

const fs = require('fs');
const path = require('path');

const stagingDir = path.join(__dirname, '..', 'src', 'microLessons', 'staging');

const files = fs.readdirSync(stagingDir)
  .filter(f => f.endsWith('-subconcepts.js'))
  .sort();

console.log(`Found ${files.length} staging files\n`);

// Topic metadata
const topicMeta = {
  'anglesshapes': { subject: 'maths', category: 'geometry' },
  'areaperimeter': { subject: 'maths', category: 'geometry' },
  'volume': { subject: 'maths', category: 'geometry' },
  'sequences': { subject: 'maths', category: 'number-visual' },
  'datahandling': { subject: 'maths', category: 'data-visual' },
  'fractions': { subject: 'maths', category: 'number-visual' },
  'decimals': { subject: 'maths', category: 'number-visual' },
  'negativenumbers': { subject: 'maths', category: 'number-visual' },
  'ratio': { subject: 'maths', category: 'number-visual' },
  'percentages': { subject: 'maths', category: 'number-visual' },
  'algebra': { subject: 'maths', category: 'abstract-maths' },
  'longdivision': { subject: 'maths', category: 'method-maths' },
  'placevalue': { subject: 'maths', category: 'number-visual' },
  'primenumbersfactors': { subject: 'maths', category: 'number-maths' },
  'speeddistancetime': { subject: 'maths', category: 'applied-maths' },
};

// All other topics are English or VR
const englishTopics = new Set(['comprehension', 'grammar', 'punctuation', 'spelling', 'vocabulary', 'wordclass']);
const vrTopics = new Set(['synonyms', 'antonyms', 'oddtwoout', 'verbalanalogies', 'compoundwords', 'hiddenwords',
  'lettermove', 'numberwordcodes', 'numberseries', 'missingletterswords', 'lettersums',
  'logicandlanguage', 'sharedletter', 'letterpairseries', 'wordcodeanalogies', 'lettercodes']);

const results = {
  totalFiles: 0,
  totalSubConcepts: 0,
  totalLessons: 0,
  totalScreens: 0,
  screensWithVisual: 0,
  screensWithoutVisual: 0,
  screensWorkedExampleOnly: 0,
  componentUsage: {},
  p0: [],
  p1: [],
  p2: [],
  perFile: {}
};

/**
 * Determine the best visual component for a given area-perimeter sub-concept
 */
function suggestForAreaPerimeter(scId, scName) {
  const lower = scId.toLowerCase();
  const nameLower = scName.toLowerCase();
  if (lower.includes('triangle') || nameLower.includes('triangle')) return 'RectangleDiagram (with triangle overlay) or new TriangleDiagram';
  if (lower.includes('parallelogram') || nameLower.includes('parallelogram')) return 'QuadShape';
  if (lower.includes('compound') || nameLower.includes('compound') || lower.includes('l-shape') || nameLower.includes('l-shape')) return 'LShapeDiagram';
  if (lower.includes('path') || lower.includes('border') || nameLower.includes('path') || nameLower.includes('border')) return 'RectangleDiagram (nested for path/border)';
  if (lower.includes('unit-conversion') || nameLower.includes('unit')) return 'RectangleDiagram';
  return 'RectangleDiagram';
}

/**
 * Determine the best visual component for anglesshapes sub-concept
 */
function suggestForAnglesShapes(scId, scName) {
  const lower = scId.toLowerCase();
  const nameLower = scName.toLowerCase();
  if (lower.includes('parallel') || nameLower.includes('parallel')) return 'ParallelLines';
  if (lower.includes('exterior') || nameLower.includes('exterior')) return 'ExteriorAngle';
  if (lower.includes('polygon') || nameLower.includes('polygon')) return 'RegularPolygon';
  if (lower.includes('quadrilateral') || nameLower.includes('quadrilateral')) return 'QuadShape';
  if (lower.includes('isosceles') || lower.includes('right-angled') || lower.includes('equilateral') || nameLower.includes('triangle')) return 'AngleDiagram';
  return 'AngleDisplay';
}

/**
 * Determine the best visual for volume sub-concept
 */
function suggestForVolume(scId, scName) {
  const lower = scId.toLowerCase();
  if (lower.includes('cube-root')) return 'CuboidDiagram (cube)';
  return 'CuboidDiagram';
}

/**
 * Check if BarModel is acceptable in an area-perimeter context
 */
function isBarModelAcceptableInGeometry(scId, scName, screenContent) {
  // BarModel is acceptable when showing proportional relationships:
  // - "half perimeter" / "missing side" (showing known vs unknown as bars)
  // - "half the rectangle" for triangle area (splitting into halves)
  // - "area vs perimeter" comparison
  // - "paths and borders" (inner vs outer comparison)
  const lower = scId.toLowerCase();
  const nameLower = scName.toLowerCase();
  if (lower.includes('missing-side') || lower.includes('area-triangle') || lower.includes('area-vs') ||
      lower.includes('paths-and-border') || lower.includes('area-parallelogram')) {
    return true;
  }
  return false;
}

for (const file of files) {
  const filePath = path.join(stagingDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const topicKey = file.replace('-subconcepts.js', '');

  results.totalFiles++;

  const meta = topicMeta[topicKey];
  const isEnglish = englishTopics.has(topicKey);
  const isVR = vrTopics.has(topicKey);
  const isMaths = !isEnglish && !isVR;
  const subject = meta ? meta.subject : (isEnglish ? 'english' : 'vr');
  const category = meta ? meta.category : subject;

  const fileStats = {
    topic: topicKey,
    subject,
    category,
    subConcepts: 0,
    lessons: 0,
    screens: 0,
    screensWithVisual: 0,
    screensWithoutVisual: 0,
    workedExampleOnly: 0,
    visualComponents: {},
    p0Count: 0,
    p1Count: 0,
    p2Count: 0
  };

  // Parse sub-concepts
  const subConceptIdRegex = /{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;
  let scMatch;
  const subConcepts = [];
  while ((scMatch = subConceptIdRegex.exec(content)) !== null) {
    subConcepts.push({ id: scMatch[1], name: scMatch[2], position: scMatch.index });
  }

  fileStats.subConcepts = subConcepts.length;
  results.totalSubConcepts += subConcepts.length;

  for (let scIdx = 0; scIdx < subConcepts.length; scIdx++) {
    const sc = subConcepts[scIdx];
    const nextScPos = scIdx < subConcepts.length - 1 ? subConcepts[scIdx + 1].position : content.length;
    const scContent = content.substring(sc.position, nextScPos);

    // Find lessons
    const lessonIdRegex = /id:\s*"([^"]+)",\s*\n\s*templateType:/g;
    let lessonMatch;
    const lessons = [];
    while ((lessonMatch = lessonIdRegex.exec(scContent)) !== null) {
      lessons.push({ id: lessonMatch[1], position: lessonMatch.index });
    }

    fileStats.lessons += lessons.length;
    results.totalLessons += lessons.length;

    for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
      const lesson = lessons[lIdx];
      const nextLessonPos = lIdx < lessons.length - 1 ? lessons[lIdx + 1].position : scContent.length;
      const lessonContent = scContent.substring(lesson.position, nextLessonPos);

      // Find screens
      const screenTypeRegex = /type:\s*"(hook|teach|interact|consolidate)"/g;
      let screenMatch;
      const screens = [];
      while ((screenMatch = screenTypeRegex.exec(lessonContent)) !== null) {
        screens.push({ type: screenMatch[1], position: screenMatch.index });
      }

      for (let sIdx = 0; sIdx < screens.length; sIdx++) {
        const screen = screens[sIdx];
        const nextScreenPos = sIdx < screens.length - 1 ? screens[sIdx + 1].position : lessonContent.length;
        const screenContent = lessonContent.substring(screen.position, nextScreenPos);

        fileStats.screens++;
        results.totalScreens++;

        // Extract visual components
        const visualComponents = [];
        const bodyVisualRegex = /type:\s*['"]visual['"]\s*,\s*\n\s*component:\s*['"](\w+)['"]/g;
        let visMatch;
        while ((visMatch = bodyVisualRegex.exec(screenContent)) !== null) {
          visualComponents.push(visMatch[1]);
        }
        const topVisualRegex = /visual:\s*{\s*\n?\s*component:\s*['"](\w+)['"]/g;
        while ((visMatch = topVisualRegex.exec(screenContent)) !== null) {
          visualComponents.push(visMatch[1]);
        }

        const hasVisual = visualComponents.length > 0;
        const nonWorkedExampleVisuals = visualComponents.filter(c => c !== 'WorkedExample');
        const hasOnlyWorkedExample = hasVisual && nonWorkedExampleVisuals.length === 0;
        const hasMeaningfulVisual = nonWorkedExampleVisuals.length > 0;

        if (hasVisual) {
          fileStats.screensWithVisual++;
          results.screensWithVisual++;
          for (const comp of visualComponents) {
            fileStats.visualComponents[comp] = (fileStats.visualComponents[comp] || 0) + 1;
            results.componentUsage[comp] = (results.componentUsage[comp] || 0) + 1;
          }
        } else {
          fileStats.screensWithoutVisual++;
          results.screensWithoutVisual++;
        }
        if (hasOnlyWorkedExample) {
          fileStats.workedExampleOnly++;
          results.screensWorkedExampleOnly++;
        }

        const screenKey = `${topicKey}/${sc.id}/${lesson.id}/${screen.type}`;

        // ===== P0: WRONG DIAGRAM =====
        if (hasMeaningfulVisual) {
          for (const comp of nonWorkedExampleVisuals) {
            let wrongReason = null;
            let suggestion = null;

            // NumberLine in anglesshapes — angle scale, better as AngleDisplay
            if (comp === 'NumberLine' && topicKey === 'anglesshapes') {
              wrongReason = `NumberLine used to show angle classification — AngleDisplay would be more geometrically meaningful`;
              suggestion = 'AngleDisplay';
            }

            // BarModel in geometry — check if acceptable
            if (comp === 'BarModel' && category === 'geometry') {
              if (!isBarModelAcceptableInGeometry(sc.id, sc.name, screenContent)) {
                wrongReason = `BarModel in geometry sub-concept "${sc.name}" — a shape diagram would be clearer`;
                if (topicKey === 'anglesshapes') suggestion = suggestForAnglesShapes(sc.id, sc.name);
                else if (topicKey === 'areaperimeter') suggestion = suggestForAreaPerimeter(sc.id, sc.name);
                else if (topicKey === 'volume') suggestion = suggestForVolume(sc.id, sc.name);
              }
            }

            // SDTTriangle outside SDT
            if (comp === 'SDTTriangle' && topicKey !== 'speeddistancetime') {
              wrongReason = `SDTTriangle used in non-SDT topic: ${topicKey}`;
              suggestion = 'topic-appropriate visual';
            }

            // CuboidDiagram outside volume
            if (comp === 'CuboidDiagram' && topicKey !== 'volume' && !sc.id.includes('volume') && !sc.id.includes('cuboid')) {
              wrongReason = `CuboidDiagram used in non-volume topic: ${topicKey}`;
              suggestion = 'topic-appropriate visual';
            }

            if (wrongReason) {
              const flag = {
                screen: screenKey,
                topic: topicKey,
                subConcept: sc.id,
                subConceptName: sc.name,
                lesson: lesson.id,
                screenType: screen.type,
                currentVisual: comp,
                allVisuals: visualComponents,
                reason: wrongReason,
                suggestion
              };
              results.p0.push(flag);
              fileStats.p0Count++;
            }
          }
        }

        // ===== P1: MISSING DIAGRAM ON GEOMETRY TOPIC =====
        if (category === 'geometry' && !hasMeaningfulVisual && screen.type !== 'hook') {
          let suggestion = null;
          if (topicKey === 'anglesshapes') suggestion = suggestForAnglesShapes(sc.id, sc.name);
          else if (topicKey === 'areaperimeter') suggestion = suggestForAreaPerimeter(sc.id, sc.name);
          else if (topicKey === 'volume') suggestion = suggestForVolume(sc.id, sc.name);

          const flag = {
            screen: screenKey,
            topic: topicKey,
            subConcept: sc.id,
            subConceptName: sc.name,
            lesson: lesson.id,
            screenType: screen.type,
            currentVisual: hasOnlyWorkedExample ? 'WorkedExample only' : 'none',
            reason: hasOnlyWorkedExample
              ? `Geometry screen has only WorkedExample — a shape diagram would reinforce the concept visually`
              : `Geometry screen has no visual at all`,
            suggestion
          };
          results.p1.push(flag);
          fileStats.p1Count++;
        }

        // ===== P2: MISSING VISUAL ON MATHS (NON-GEOMETRY) TEACH SCREEN =====
        if (isMaths && category !== 'geometry' && !hasMeaningfulVisual && screen.type === 'teach') {
          let suggestion = null;
          let worthFlagging = true;

          if (topicKey === 'fractions') suggestion = 'BarModel';
          else if (topicKey === 'decimals') suggestion = 'NumberLine or PlaceValueChart';
          else if (topicKey === 'negativenumbers') suggestion = 'NumberLine';
          else if (topicKey === 'ratio') suggestion = 'BarModel';
          else if (topicKey === 'percentages') suggestion = 'BarModel or GridModel';
          else if (topicKey === 'placevalue') suggestion = 'PlaceValueChart';
          else if (topicKey === 'longdivision') suggestion = 'BusStopDiagram';
          else if (topicKey === 'speeddistancetime') suggestion = 'SDTTriangle';
          else if (topicKey === 'sequences') suggestion = 'SequenceChain';
          else if (topicKey === 'algebra') {
            // Algebra often suits WorkedExample. Only flag specific sub-concepts.
            const lower = sc.id.toLowerCase();
            if (lower.includes('function-machine') || lower.includes('balance')) {
              suggestion = 'BarModel (balance model)';
            } else {
              worthFlagging = false; // WorkedExample is fine for most algebra
            }
          }
          else if (topicKey === 'datahandling') worthFlagging = false; // WorkedExample fine
          else if (topicKey === 'primenumbersfactors') worthFlagging = false; // WorkedExample fine
          else worthFlagging = false;

          if (worthFlagging && suggestion) {
            const flag = {
              screen: screenKey,
              topic: topicKey,
              subConcept: sc.id,
              subConceptName: sc.name,
              lesson: lesson.id,
              screenType: screen.type,
              currentVisual: hasOnlyWorkedExample ? 'WorkedExample only' : 'none',
              reason: `Teach screen uses ${hasOnlyWorkedExample ? 'WorkedExample' : 'no visual'} — ${suggestion} would enhance understanding`,
              suggestion
            };
            results.p2.push(flag);
            fileStats.p2Count++;
          }
        }
      }
    }
  }

  results.perFile[topicKey] = fileStats;
}

// ====== OUTPUT ======
console.log('================================================================');
console.log('  VISUAL AUDIT REPORT — MICRO-LESSON LIBRARY');
console.log('================================================================\n');

console.log('--- SUMMARY STATISTICS ---\n');
console.log(`Files scanned:              ${results.totalFiles}`);
console.log(`Total sub-concepts:         ${results.totalSubConcepts}`);
console.log(`Total lessons:              ${results.totalLessons}`);
console.log(`Total screens:              ${results.totalScreens}`);
console.log(`Screens with ANY visual:    ${results.screensWithVisual} (${Math.round(results.screensWithVisual/results.totalScreens*100)}%)`);
console.log(`Screens without visual:     ${results.screensWithoutVisual}`);
console.log(`WorkedExample-only screens: ${results.screensWorkedExampleOnly} (${Math.round(results.screensWorkedExampleOnly/results.totalScreens*100)}%)`);
console.log('');

console.log('--- COMPONENT USAGE (across all screens) ---\n');
const sortedComponents = Object.entries(results.componentUsage).sort((a, b) => b[1] - a[1]);
for (const [comp, count] of sortedComponents) {
  const bar = '█'.repeat(Math.ceil(count / 30));
  console.log(`  ${comp.padEnd(22)} ${String(count).padStart(5)}  ${bar}`);
}
console.log('');

console.log('--- FLAGGED ITEMS ---\n');
console.log(`  P0 (wrong diagram):                  ${results.p0.length}`);
console.log(`  P1 (missing diagram, geometry):       ${results.p1.length}`);
console.log(`  P2 (missing visual, maths teach):     ${results.p2.length}`);
console.log(`  TOTAL:                                ${results.p0.length + results.p1.length + results.p2.length}`);
console.log('');

// ===== P0 =====
if (results.p0.length > 0) {
  console.log('================================================================');
  console.log('  P0: WRONG DIAGRAM — Component does not match concept');
  console.log('================================================================\n');

  // Deduplicate (script sometimes double-counts when screen has 2 visuals)
  const seen = new Set();
  const uniqueP0 = results.p0.filter(f => {
    const key = `${f.screen}|${f.currentVisual}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group by topic
  const byTopic = {};
  for (const f of uniqueP0) {
    if (!byTopic[f.topic]) byTopic[f.topic] = [];
    byTopic[f.topic].push(f);
  }

  for (const [topic, flags] of Object.entries(byTopic)) {
    console.log(`  [${topic}] — ${flags.length} screen(s)`);
    for (const f of flags) {
      console.log(`    ${f.subConcept} / ${f.lesson} / ${f.screenType}`);
      console.log(`      Current: ${f.currentVisual} | Should be: ${f.suggestion || 'TBD'}`);
      console.log(`      Why: ${f.reason}`);
    }
    console.log('');
  }
}

// ===== P1 =====
if (results.p1.length > 0) {
  console.log('================================================================');
  console.log('  P1: MISSING DIAGRAM ON GEOMETRY TOPIC');
  console.log('  (teach/interact/consolidate screens only — hooks excluded)');
  console.log('================================================================\n');

  const byTopic = {};
  for (const f of results.p1) {
    if (!byTopic[f.topic]) byTopic[f.topic] = [];
    byTopic[f.topic].push(f);
  }

  for (const [topic, flags] of Object.entries(byTopic)) {
    // Group by sub-concept within topic
    const bySc = {};
    for (const f of flags) {
      if (!bySc[f.subConcept]) bySc[f.subConcept] = { name: f.subConceptName, screens: [] };
      bySc[f.subConcept].screens.push(f);
    }

    console.log(`  [${topic}] — ${flags.length} screen(s) across ${Object.keys(bySc).length} sub-concept(s)`);
    for (const [scId, sc] of Object.entries(bySc)) {
      console.log(`    ${scId} ("${sc.name}")`);
      for (const f of sc.screens) {
        console.log(`      ${f.lesson} / ${f.screenType} — ${f.currentVisual} → ${f.suggestion}`);
      }
    }
    console.log('');
  }
}

// ===== P2 =====
if (results.p2.length > 0) {
  console.log('================================================================');
  console.log('  P2: MISSING VISUAL ON MATHS TEACH SCREENS');
  console.log('  (non-geometry topics where a visual would enhance learning)');
  console.log('================================================================\n');

  const byTopic = {};
  for (const f of results.p2) {
    if (!byTopic[f.topic]) byTopic[f.topic] = [];
    byTopic[f.topic].push(f);
  }

  for (const [topic, flags] of Object.entries(byTopic)) {
    const suggestion = flags[0].suggestion;
    console.log(`  [${topic}] — ${flags.length} teach screen(s) — suggested: ${suggestion}`);
    for (const f of flags) {
      console.log(`    ${f.subConcept} / ${f.lesson}`);
    }
    console.log('');
  }
}

// ===== PER-TOPIC BREAKDOWN =====
console.log('================================================================');
console.log('  PER-TOPIC BREAKDOWN (Maths only)');
console.log('================================================================\n');

const mathsTopics = Object.entries(results.perFile)
  .filter(([_, s]) => s.subject === 'maths')
  .sort((a, b) => (b[1].p0Count + b[1].p1Count) - (a[1].p0Count + a[1].p1Count));

for (const [topic, stats] of mathsTopics) {
  const visualPct = stats.screens > 0 ? Math.round(stats.screensWithVisual / stats.screens * 100) : 0;
  const meaningfulPct = stats.screens > 0 ? Math.round((stats.screensWithVisual - stats.workedExampleOnly) / stats.screens * 100) : 0;
  const compList = Object.entries(stats.visualComponents)
    .filter(([k]) => k !== 'WorkedExample')
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}(${v})`)
    .join(', ') || 'none';

  console.log(`  ${topic} [${stats.category}]`);
  console.log(`    ${stats.subConcepts} sub-concepts, ${stats.lessons} lessons, ${stats.screens} screens`);
  console.log(`    Meaningful visuals: ${meaningfulPct}% | WorkedExample-only: ${stats.workedExampleOnly} | No visual: ${stats.screensWithoutVisual}`);
  console.log(`    Components: ${compList}`);
  console.log(`    Flags: P0=${stats.p0Count} P1=${stats.p1Count} P2=${stats.p2Count}`);
  console.log('');
}

// ===== ENGLISH/VR SUMMARY =====
console.log('================================================================');
console.log('  ENGLISH & VR SUMMARY (spot-check)');
console.log('================================================================\n');

const nonMathsTopics = Object.entries(results.perFile)
  .filter(([_, s]) => s.subject !== 'maths')
  .sort((a, b) => a[0].localeCompare(b[0]));

for (const [topic, stats] of nonMathsTopics) {
  const compList = Object.entries(stats.visualComponents)
    .filter(([k]) => k !== 'WorkedExample')
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}(${v})`)
    .join(', ') || 'WorkedExample only';

  console.log(`  ${topic} [${stats.subject}]: ${stats.screens} screens | Visuals: ${compList}`);
}

// Save JSON
const reportPath = path.join(__dirname, 'visual-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n\nFull JSON report saved to: scripts/visual-audit-report.json`);

/**
 * Punctuation Full Re-Audit — Steps 2-7c
 * Using GL research targets for ratio checking
 */
const fs = require('fs');
const m = require('../src/questionData/englishData.js');
const qs = (m.default || m).topics.punctuation.questions;

console.log(`=== PUNCTUATION RE-AUDIT: ${qs.length} questions ===\n`);

// ============================================================
// STEP 2: READ & UNDERSTAND
// ============================================================
const dd = {1:0, 2:0, 3:0};
for (const q of qs) dd[q.difficulty]++;
console.log(`Distribution: D1=${dd[1]}(${Math.round(dd[1]/330*100)}%) D2=${dd[2]}(${Math.round(dd[2]/330*100)}%) D3=${dd[3]}(${Math.round(dd[3]/330*100)}%)`);
console.log(`GL target:    D1=25% D2=45% D3=30%\n`);

// ============================================================
// STEP 3: STRUCTURAL + RATIO CHECK
// ============================================================

// Categorise every question by punctuation type
function categorise(q) {
  const segs = (q.segments || []).join(' ');
  const exp = (q.explanation || '').toLowerCase();

  // "No mistake" answer
  if (q.correct === 4) return 'no-mistake';

  // Get the error segment
  const errorSeg = q.segments?.[q.correct] || '';
  const errorLower = errorSeg.toLowerCase();

  // Apostrophes
  if (exp.includes('apostrophe') || exp.includes('contraction') || exp.includes("n't") ||
      exp.includes("'s") || exp.includes("s'") || exp.includes("it's") || exp.includes("its")) {
    // Sub-categorise apostrophes
    if (exp.includes('contraction') || exp.includes("n't") || exp.includes("'m") ||
        exp.includes("'re") || exp.includes("'ve") || exp.includes("'ll") ||
        exp.includes("short for") || exp.includes("shortened") ||
        errorLower.match(/\b(dont|cant|wont|isnt|wasnt|didnt|hasnt|havent|hadnt|wouldnt|shouldnt|couldnt|arent|werent|shes|hes|theyre|were|weve|youre|im|its raining|its going)\b/)) {
      return 'apostrophe-contraction';
    }
    if (exp.includes('irregular plural') || exp.includes("children's") || exp.includes("women's") ||
        exp.includes("men's") || exp.includes("people's") || exp.includes("mice's") ||
        errorLower.match(/\b(childrens'|womens'|mens'|peoples'|mices')\b/)) {
      return 'apostrophe-irregular-plural';
    }
    if (exp.includes('plural') || exp.includes("s'") || exp.includes("boys'") || exp.includes("girls'") ||
        exp.includes("teachers'") || exp.includes("players'") ||
        errorLower.match(/\b\w+s'\s/)) {
      return 'apostrophe-plural-possession';
    }
    if (exp.includes('possession') || exp.includes('possessive') || exp.includes('belongs to') ||
        exp.includes("'s")) {
      return 'apostrophe-singular-possession';
    }
    // Default apostrophe
    return 'apostrophe-contraction';
  }

  // Speech marks
  if (exp.includes('speech') || exp.includes('inverted comma') || exp.includes('direct speech') ||
      exp.includes('said') || exp.includes('asked') || exp.includes('shouted') ||
      segs.includes('"') || segs.includes('"')) {
    return 'speech-marks';
  }

  // Comma splice
  if (exp.includes('comma splice') || exp.includes('comma alone cannot') ||
      exp.includes('two independent') || exp.includes('two complete sentences') ||
      (exp.includes('comma') && (exp.includes('semicolon') || exp.includes('full stop') || exp.includes('conjunction')))) {
    return 'comma-splice';
  }

  // Semicolons
  if (exp.includes('semicolon') || exp.includes(';')) {
    return 'semicolons';
  }

  // Colons
  if (exp.includes('colon') || exp.includes(':') && exp.includes('list')) {
    return 'colons';
  }

  // Hyphens
  if (exp.includes('hyphen') || exp.includes('-') && (exp.includes('compound') || exp.includes('adjective'))) {
    return 'hyphens';
  }

  // Brackets/dashes
  if (exp.includes('bracket') || exp.includes('parenthes') || exp.includes('dash')) {
    return 'brackets-dashes';
  }

  // Commas - subcategorise
  if (exp.includes('comma')) {
    if (exp.includes('fronted adverbial') || exp.includes('subordinate clause') ||
        exp.includes('although') || exp.includes('after the') || exp.includes('when the') ||
        exp.includes('before the') || exp.includes('opening clause')) {
      return 'comma-fronted-adverbial';
    }
    if (exp.includes('parenthes') || exp.includes('non-essential') || exp.includes('non-defining') ||
        exp.includes('embedded') || exp.includes('extra information') || exp.includes('which is') ||
        exp.includes('who is')) {
      return 'comma-parenthesis';
    }
    if (exp.includes('list') || exp.includes('separate items') || exp.includes('items in')) {
      return 'comma-list';
    }
    // Commas about removing incorrect commas (defining clauses etc)
    if (exp.includes('defining') || exp.includes('not needed') || exp.includes('incorrect') ||
        exp.includes('should not')) {
      return 'comma-parenthesis'; // Testing knowledge of when NOT to use commas
    }
    return 'comma-other';
  }

  // Capital letters
  if (exp.includes('capital') || exp.includes('Capital') || exp.includes('uppercase') ||
      exp.includes('proper noun') || exp.includes('name of')) {
    return 'capitals';
  }

  return 'uncategorised';
}

const categories = {};
for (const q of qs) {
  const cat = categorise(q);
  if (!categories[cat]) categories[cat] = {d1:0, d2:0, d3:0, ids:[]};
  categories[cat]['d'+q.difficulty]++;
  categories[cat].ids.push(q.id);
}

// GL targets
const targets = {
  'apostrophe-contraction': {min:25, max:35, pct:'8-10%'},
  'apostrophe-singular-possession': {min:30, max:40, pct:'10-12%'},
  'apostrophe-plural-possession': {min:25, max:35, pct:'8-10%'},
  'apostrophe-irregular-plural': {min:16, max:24, pct:'5-7%'},
  'comma-fronted-adverbial': {min:30, max:40, pct:'10-12%'},
  'comma-list': {min:14, max:20, pct:'4-6%'},
  'comma-parenthesis': {min:20, max:28, pct:'6-8%'},
  'speech-marks': {min:30, max:40, pct:'10-12%'},
  'capitals': {min:20, max:28, pct:'6-8%'},
  'semicolons': {min:10, max:14, pct:'3-4%'},
  'colons': {min:10, max:17, pct:'3-5%'},
  'hyphens': {min:6, max:10, pct:'2-3%'},
  'brackets-dashes': {min:10, max:14, pct:'3-4%'},
  'comma-splice': {min:10, max:17, pct:'3-5%'},
  'no-mistake': {min:50, max:66, pct:'15-20%'},
};

console.log('=== CATEGORY RATIO CHECK ===');
console.log('Category'.padEnd(35) + 'Count'.padStart(6) + '%'.padStart(5) + '  GL Target'.padStart(12) + '  Status');
let totalCategorised = 0;
for (const [cat, target] of Object.entries(targets)) {
  const actual = categories[cat]?.ids?.length || 0;
  totalCategorised += actual;
  const pct = Math.round(actual/330*100);
  let status = '✓';
  if (actual < target.min) status = `⚠ LOW (need ${target.min - actual} more)`;
  if (actual > target.max) status = `⚠ HIGH (+${actual - target.max})`;
  console.log(cat.padEnd(35) + String(actual).padStart(6) + (pct+'%').padStart(5) + ('  '+target.pct).padStart(12) + '  ' + status);
}
const uncatCount = (categories['uncategorised']?.ids?.length || 0) + (categories['comma-other']?.ids?.length || 0);
console.log('uncategorised/other'.padEnd(35) + String(uncatCount).padStart(6));
console.log('TOTAL categorised'.padEnd(35) + String(totalCategorised).padStart(6) + ` / ${qs.length}`);

// ============================================================
// STEP 3b: STRUCTURAL CHECKS
// ============================================================
console.log('\n=== STRUCTURAL CHECKS ===');
const idCount = {};
let noSegs = 0, noOpts = 0, noExp = 0, badIdx = 0;
for (const q of qs) {
  if (!q.segments || q.segments.length !== 4) noSegs++;
  if (!q.options || q.options.length !== 5) noOpts++;
  if (!q.explanation) noExp++;
  if (q.correct === undefined || q.correct < 0 || q.correct > 4) badIdx++;
  idCount[q.id] = (idCount[q.id] || 0) + 1;
}
const dups = Object.entries(idCount).filter(([,c]) => c > 1);
console.log('Missing/bad segments:', noSegs);
console.log('Missing/bad options:', noOpts);
console.log('Missing explanation:', noExp);
console.log('Bad correct index:', badIdx);
console.log('Duplicate IDs:', dups.length === 0 ? 'NONE ✓' : dups.length);

// Duplicate segments
const segSeen = {};
let dupSegs = 0;
for (const q of qs) {
  const key = (q.segments||[]).join('|').toLowerCase();
  if (segSeen[key]) { console.log('DUP: Q'+q.id+' = Q'+segSeen[key]); dupSegs++; }
  segSeen[key] = q.id;
}
if (dupSegs === 0) console.log('Duplicate segments: NONE ✓');

// ============================================================
// STEP 5: DIFFICULTY CHECK
// ============================================================
console.log('\n=== DIFFICULTY ===');
console.log(`Current: D1=${dd[1]}(${Math.round(dd[1]/330*100)}%) D2=${dd[2]}(${Math.round(dd[2]/330*100)}%) D3=${dd[3]}(${Math.round(dd[3]/330*100)}%)`);
console.log(`Target:  D1=25%(83) D2=45%(149) D3=30%(99)`);
const d1ok = dd[1] >= 75 && dd[1] <= 91;
const d2ok = dd[2] >= 140 && dd[2] <= 158;
const d3ok = dd[3] >= 90 && dd[3] <= 108;
console.log(`D1: ${d1ok ? '✓' : '⚠ ' + (dd[1] < 75 ? 'LOW' : 'HIGH')}`);
console.log(`D2: ${d2ok ? '✓' : '⚠ ' + (dd[2] < 140 ? 'LOW' : 'HIGH')}`);
console.log(`D3: ${d3ok ? '✓' : '⚠ ' + (dd[3] < 90 ? 'LOW' : 'HIGH')}`);

// Difficulty per category
console.log('\n=== DIFFICULTY PER CATEGORY ===');
for (const [cat, data] of Object.entries(categories).sort((a,b) => b[1].ids.length - a[1].ids.length)) {
  if (data.ids.length < 3) continue;
  console.log(`${cat.padEnd(35)} D1:${String(data.d1).padStart(3)} D2:${String(data.d2).padStart(3)} D3:${String(data.d3).padStart(3)} (total: ${data.ids.length})`);
}

// ============================================================
// STEP 7: EXPLANATION CHECK (quick)
// ============================================================
console.log('\n=== EXPLANATION CHECK ===');
let shortExp = 0, missingAnswerInExp = 0;
for (const q of qs) {
  if (q.explanation && q.explanation.length < 30) shortExp++;
}
console.log('Short explanations (<30 chars):', shortExp);

// ============================================================
// STEP 7c: LESSON MAPPING
// ============================================================
console.log('\n=== LESSON MAPPING ===');
let engMap;
try {
  engMap = JSON.parse(fs.readFileSync('public/english-question-lesson-map.json', 'utf8'));
} catch(e) { engMap = {}; }

const punctMappings = engMap.punctuation || [];
const mappedIds = new Set(punctMappings.map(m => m.questionId));
const unmapped = qs.filter(q => !mappedIds.has(q.id));
console.log(`Mapped: ${mappedIds.size} / ${qs.length}`);
console.log(`Unmapped: ${unmapped.length}`);

const scCounts = {};
for (const m of punctMappings) {
  scCounts[m.subConceptId] = (scCounts[m.subConceptId] || 0) + 1;
}
console.log('\nSub-concepts:');
for (const [sc, count] of Object.entries(scCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${sc}: ${count} Qs`);
}

// Check staging file
const stagingPath = 'src/microLessons/staging/punctuation-subconcepts.js';
let stagingExists = false;
try { fs.accessSync(stagingPath); stagingExists = true; } catch(e) {}
console.log(`\nStaging file: ${stagingExists ? '✓' : '⚠ NOT FOUND'}`);

// ============================================================
// SUMMARY
// ============================================================
console.log('\n=== SUMMARY ===');
const ratioIssues = Object.entries(targets).filter(([cat, t]) => {
  const actual = categories[cat]?.ids?.length || 0;
  return actual < t.min || actual > t.max;
});
console.log('Category ratio issues:', ratioIssues.length);
for (const [cat, t] of ratioIssues) {
  const actual = categories[cat]?.ids?.length || 0;
  const gap = actual < t.min ? `need ${t.min - actual} more` : `${actual - t.max} excess`;
  console.log(`  ${cat}: ${actual} (target ${t.min}-${t.max}) — ${gap}`);
}
console.log('Difficulty issues:', [d1ok, d2ok, d3ok].filter(x => !x).length);
console.log('Structural issues:', noSegs + noOpts + noExp + badIdx + dups.length + dupSegs);
console.log('Unmapped questions:', unmapped.length);

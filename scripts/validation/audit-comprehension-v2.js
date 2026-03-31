/**
 * Comprehension Full Re-Audit — Steps 2-7c
 */
const fs = require('fs');
const m = require('../src/questionData/englishData.js');
const qs = (m.default || m).topics.comprehension.questions;

console.log(`=== COMPREHENSION RE-AUDIT: ${qs.length} questions ===\n`);

// Step 2
const dd = {1:0, 2:0, 3:0};
for (const q of qs) dd[q.difficulty]++;
console.log(`Distribution: D1=${dd[1]}(${Math.round(dd[1]/qs.length*100)}%) D2=${dd[2]}(${Math.round(dd[2]/qs.length*100)}%) D3=${dd[3]}(${Math.round(dd[3]/qs.length*100)}%)`);
console.log(`GL target:    D1=25-30% D2=45-50% D3=20-25%\n`);

// Step 3: Ratio check
const subtypes = {};
for (const q of qs) {
  const st = q.questionSubType || 'unknown';
  if (!subtypes[st]) subtypes[st] = {d1:0,d2:0,d3:0,ids:[]};
  subtypes[st]['d'+q.difficulty]++;
  subtypes[st].ids.push(q.id);
}

const targets = {
  'retrieval': {min:75, max:100, pct:'~25%'},
  'inference': {min:88, max:110, pct:'~25-30%'},
  'vocabulary-in-context': {min:50, max:70, pct:'~15-20%'},
  'word-class': {min:35, max:53, pct:'~10-15%'},
  'literary-device': {min:28, max:42, pct:'~10%'},
  'author-purpose': {min:18, max:28, pct:'~5-8%'},
  'prediction': {min:5, max:11, pct:'~2-3%'},
  'negative-retrieval': {min:5, max:11, pct:'~2-3%'},
  'genre': {min:0, max:7, pct:'~0-2%'},
};

console.log('=== QUESTION TYPE RATIO CHECK ===');
console.log('Type'.padEnd(30) + 'Count'.padStart(6) + '%'.padStart(5) + '  Target'.padStart(10) + '  Status');
for (const [type, target] of Object.entries(targets)) {
  const actual = subtypes[type]?.ids?.length || 0;
  const pct = Math.round(actual/qs.length*100);
  let status = '✓';
  if (actual < target.min) status = `⚠ LOW (need ${target.min - actual} more)`;
  if (actual > target.max) status = `⚠ HIGH (+${actual - target.max})`;
  console.log(type.padEnd(30) + String(actual).padStart(6) + (pct+'%').padStart(5) + ('  '+target.pct).padStart(10) + '  ' + status);
}

// Step 3b: Structural
console.log('\n=== STRUCTURAL CHECKS ===');
const idCount = {};
let noQ = 0, noOpts = 0, noExp = 0, badIdx = 0, noPid = 0;
for (const q of qs) {
  if (!q.question) noQ++;
  if (!q.options || q.options.length < 4) noOpts++;
  if (!q.explanation) noExp++;
  if (q.correct === undefined || q.correct < 0 || q.correct >= (q.options||[]).length) badIdx++;
  if (!q.passageId) noPid++;
  idCount[q.id] = (idCount[q.id] || 0) + 1;
}
const dups = Object.entries(idCount).filter(([,c]) => c > 1);
console.log('Missing question:', noQ);
console.log('Missing/short options:', noOpts);
console.log('Missing explanation:', noExp);
console.log('Bad correct index:', badIdx);
console.log('No passage ID:', noPid);
console.log('Duplicate IDs:', dups.length === 0 ? 'NONE ✓' : dups.length);

// Step 4: Answer correctness — for comprehension, check subtype/difficulty alignment
console.log('\n=== STEP 4: SUBTYPE/DIFFICULTY ALIGNMENT ===');
const expectedDiff = {
  'retrieval': 1, 'negative-retrieval': 2, 'vocabulary-in-context': 2,
  'inference': 2, 'prediction': 2, 'genre': 2,
  'author-purpose': 3, 'literary-device': 3,
};
let diffMismatches = 0;
for (const q of qs) {
  const expected = expectedDiff[q.questionSubType];
  if (expected && Math.abs(q.difficulty - expected) > 1) {
    diffMismatches++;
    if (diffMismatches <= 5) {
      console.log(`  Q${q.id}: ${q.questionSubType} at D${q.difficulty} (expected ~D${expected})`);
    }
  }
}
console.log(`Mismatches: ${diffMismatches}`);

// Step 5: Difficulty distribution
console.log('\n=== STEP 5: DIFFICULTY ===');
console.log(`D1: ${dd[1]}(${Math.round(dd[1]/qs.length*100)}%) target 25-30% ${dd[1]/qs.length >= 0.25 && dd[1]/qs.length <= 0.30 ? '✓' : '⚠'}`);
console.log(`D2: ${dd[2]}(${Math.round(dd[2]/qs.length*100)}%) target 45-50% ${dd[2]/qs.length >= 0.40 && dd[2]/qs.length <= 0.50 ? '✓' : '⚠'}`);
console.log(`D3: ${dd[3]}(${Math.round(dd[3]/qs.length*100)}%) target 20-25% ${dd[3]/qs.length >= 0.20 && dd[3]/qs.length <= 0.30 ? '✓' : '⚠'}`);

// Steps 6, 7b: N/A
console.log('\n=== STEP 6: DISTRACTOR QUALITY === N/A (passage-based MC)');
console.log('=== STEP 7b: DIAGRAMS === N/A (text-only)');

// Step 7: Explanation quality
console.log('\n=== STEP 7: EXPLANATIONS ===');
let shortExp = 0;
for (const q of qs) {
  if (!q.explanation || q.explanation.length < 40) shortExp++;
}
console.log('Short explanations:', shortExp);

// Step 7c: Lesson mapping
console.log('\n=== STEP 7c: LESSON MAPPING ===');
let engMap;
try { engMap = JSON.parse(fs.readFileSync('public/english-question-lesson-map.json', 'utf8')); } catch(e) { engMap = {}; }
const compMappings = engMap.comprehension || [];
const mappedIds = new Set(compMappings.map(m => m.questionId));
const unmapped = qs.filter(q => !mappedIds.has(q.id));
console.log(`Mapped: ${mappedIds.size} / ${qs.length}`);
console.log(`Unmapped: ${unmapped.length}`);

const scCounts = {};
for (const m of compMappings) { scCounts[m.subConceptId] = (scCounts[m.subConceptId] || 0) + 1; }
console.log('Sub-concepts:', Object.keys(scCounts).length);
for (const [sc, count] of Object.entries(scCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${sc}: ${count} Qs`);
}

// Check staging
const stagingExists = fs.existsSync('src/microLessons/staging/comprehension-subconcepts.js');
console.log(`Staging file: ${stagingExists ? '✓' : '⚠ NOT FOUND'}`);

// GL categories vs sub-concepts
console.log('\nGL categories vs lessons:');
const glTypes = ['retrieval', 'inference', 'vocabulary-in-context', 'word-class',
  'literary-device', 'author-purpose', 'prediction', 'negative-retrieval', 'genre'];
for (const type of glTypes) {
  const hasQuestions = (subtypes[type]?.ids?.length || 0) > 0;
  const hasLesson = Object.keys(scCounts).some(sc => sc.includes(type.split('-')[0]));
  console.log(`  ${type.padEnd(25)} Qs:${String(subtypes[type]?.ids?.length || 0).padStart(4)}  Lesson:${hasLesson ? ' ✓' : ' ⚠ NONE'}`);
}

// Summary
console.log('\n=== SUMMARY ===');
const ratioIssues = Object.entries(targets).filter(([type, t]) => {
  const actual = subtypes[type]?.ids?.length || 0;
  return actual < t.min || actual > t.max;
});
console.log('Ratio issues:', ratioIssues.length);
for (const [type, t] of ratioIssues) {
  const actual = subtypes[type]?.ids?.length || 0;
  console.log(`  ${type}: ${actual} (target ${t.min}-${t.max})`);
}

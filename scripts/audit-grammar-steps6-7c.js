/**
 * Grammar Re-Audit Steps 6, 7, 7c
 * Step 6: MC distractor quality
 * Step 7: Explanation audit
 * Step 7c: Question-to-lesson mapping audit (CORE)
 */
const fs = require('fs');
const m = require('../src/questionData/englishData.js');
const qs = (m.default || m).topics.grammar.questions;

// ============================================================
// STEP 6: DISTRACTOR QUALITY (MC format)
// GL pattern: correct + spoken-error + hypercorrection + related-wrong + clearly-wrong
// ============================================================
console.log('=== STEP 6: DISTRACTOR QUALITY ===\n');

// Check: do all questions have exactly 5 options?
let wrong5 = 0;
for (const q of qs) {
  if (q.options.length !== 5) {
    console.log(`Q${q.id}: ${q.options.length} options (should be 5)`);
    wrong5++;
  }
}
console.log(`Options count: ${wrong5 === 0 ? 'All have 5 ✓' : wrong5 + ' questions with wrong count'}`);

// Check: are there questions where the correct answer appears more than once in options?
let dupOpts = 0;
for (const q of qs) {
  const opts = q.options.map(o => o.toLowerCase());
  const uniq = new Set(opts);
  if (uniq.size < opts.length) {
    console.log(`Q${q.id}: Duplicate option: ${q.options.join(' | ')}`);
    dupOpts++;
  }
}
console.log(`Duplicate options: ${dupOpts === 0 ? 'NONE ✓' : dupOpts}`);

// Sample check: show D3 questions to assess distractor plausibility
console.log('\nD3 distractor samples (manual review):');
const d3 = qs.filter(q => q.difficulty === 3).slice(0, 8);
for (const q of d3) {
  const opts = q.options.map((o, i) => i === q.correct ? `[${o}]` : o);
  console.log(`Q${q.id}: ${q.question.substring(50, 120)}`);
  console.log(`  Options: ${opts.join(' | ')}`);
}

// ============================================================
// STEP 7: EXPLANATION AUDIT
// ============================================================
console.log('\n=== STEP 7: EXPLANATION AUDIT ===\n');

let noExplanation = 0;
let shortExplanation = 0;
let missingAnswer = 0;
let genericPattern = 0;

for (const q of qs) {
  if (!q.explanation) { noExplanation++; continue; }
  if (q.explanation.length < 50) shortExplanation++;

  // Check if explanation mentions the correct answer
  const answer = q.options[q.correct]?.toLowerCase();
  if (answer && !q.explanation.toLowerCase().includes(answer)) {
    missingAnswer++;
  }

  // Check for generic non-teaching patterns
  if (q.explanation.length < 80 && q.explanation.match(/^'[^']+' is (the )?correct/)) {
    genericPattern++;
  }
}

console.log(`No explanation: ${noExplanation}`);
console.log(`Short (<50 chars): ${shortExplanation}`);
console.log(`Missing answer word: ${missingAnswer}`);
console.log(`Generic pattern: ${genericPattern}`);

// Sample explanations
console.log('\nExplanation samples:');
for (const q of qs.filter(q => q.difficulty === 2).slice(10, 15)) {
  console.log(`Q${q.id}: ${q.explanation?.substring(0, 120)}...`);
}

// ============================================================
// STEP 7c: QUESTION-TO-LESSON MAPPING AUDIT (CORE STEP)
// ============================================================
console.log('\n=== STEP 7c: QUESTION-TO-LESSON MAPPING (CORE) ===\n');

// Load English mapping file
let engMap;
try {
  engMap = JSON.parse(fs.readFileSync('public/english-question-lesson-map.json', 'utf8'));
} catch (e) {
  console.log('⚠ No english-question-lesson-map.json found');
  engMap = {};
}

// Check grammar mappings
const grammarMappings = engMap.grammar || [];
console.log(`Grammar mappings in file: ${grammarMappings.length}`);
console.log(`Grammar questions total: ${qs.length}`);

// Which questions are mapped?
const mappedIds = new Set(grammarMappings.map(m => m.questionId));
const unmappedQs = qs.filter(q => !mappedIds.has(q.id));
console.log(`Mapped: ${mappedIds.size}`);
console.log(`Unmapped: ${unmappedQs.length}`);

if (unmappedQs.length > 0) {
  console.log(`\nUnmapped question IDs: ${unmappedQs.map(q => q.id).join(', ')}`);
}

// What sub-concepts are used in mappings?
const subConceptCounts = {};
for (const m of grammarMappings) {
  subConceptCounts[m.subConceptId] = (subConceptCounts[m.subConceptId] || 0) + 1;
}
console.log('\nSub-concepts in mapping:');
for (const [sc, count] of Object.entries(subConceptCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${sc}: ${count} questions`);
}

// Low confidence mappings
const lowConf = grammarMappings.filter(m => m.confidence === 'low');
console.log(`\nLow confidence mappings: ${lowConf.length}`);
if (lowConf.length > 0) {
  console.log(`  IDs: ${lowConf.map(m => m.questionId).join(', ')}`);
}

// Check staging file exists
const stagingPath = 'src/microLessons/staging/grammar-subconcepts.js';
let stagingExists = false;
try {
  fs.accessSync(stagingPath);
  stagingExists = true;
} catch (e) {}
console.log(`\nStaging file exists: ${stagingExists ? '✓ ' + stagingPath : '⚠ NOT FOUND'}`);

// If staging exists, check what sub-concepts are defined
if (stagingExists) {
  const stagingContent = fs.readFileSync(stagingPath, 'utf8');
  const scMatches = stagingContent.match(/id:\s*["']([^"']+)["']/g) || [];
  const stagingSubConcepts = scMatches.map(m => m.match(/["']([^"']+)["']/)[1]);
  console.log(`Sub-concepts in staging: ${stagingSubConcepts.length}`);
  for (const sc of stagingSubConcepts) {
    const mappedCount = subConceptCounts[sc] || 0;
    console.log(`  ${sc}: ${mappedCount} questions mapped`);
  }

  // Check for mapped sub-concepts that don't exist in staging
  for (const sc of Object.keys(subConceptCounts)) {
    if (!stagingSubConcepts.includes(sc)) {
      console.log(`  ⚠ ${sc}: in mapping but NOT in staging file`);
    }
  }
}

// ============================================================
// GAP REPORT: Categories vs Sub-concepts vs GL targets
// ============================================================
console.log('\n=== GAP REPORT ===\n');

// Reuse categorisation from the v2 audit
function categorise(q) {
  const text = (q.question + ' ' + (q.explanation || '')).toLowerCase();
  const allOpts = q.options.map(o => o.toLowerCase());

  if (allOpts.some(o => ["their","they're","there","its","it's","your","you're","whose","who's"].includes(o)) &&
      text.match(/their|they're|there|its|it's|your|you're|whose|who's/)) return 'homophones';
  if (text.includes('passive') || text.includes('was ___ by') || text.includes('been ___') ||
      text.includes('being ___') || text.includes('will be ___')) return 'passive-voice';
  if (allOpts.some(o => ['who','whom','whose','which','that','where','when','why'].includes(o)) &&
      text.match(/the \w+ ___/)) return 'relative-clauses';
  if (allOpts.some(o => ['i','me','myself','ourselves','herself','himself','themselves','us','him','her','them','mine','hers','ours','theirs'].includes(o))) return 'pronouns';
  if (allOpts.some(o => ['is','are','was','were','has','have','does','do'].includes(o)) &&
      text.match(/children|team|class|family|everyone|nobody|each|neither|either|number of|news|mathematics|sheep|jury|committee/i)) return 'subject-verb-agreement';
  if (allOpts.some(o => ['might','could','would','should','shall','may','must','can','ought to'].includes(o))) return 'modal-verbs';
  if (allOpts.some(o => ['and','but','or','nor','although','because','however','therefore','nevertheless','furthermore','meanwhile','provided','unless'].includes(o))) return 'conjunctions';
  if (allOpts.some(o => ['better','worse','best','worst','more','most','less','fewer','taller','tallest','faster','fastest','easier','easiest','bigger','narrower'].includes(o))) return 'comparatives-superlatives';
  if (allOpts.some(o => ['at','in','on','to','from','by','for','with','about','through','between','among','across','over','under','off','into','around'].includes(o)) &&
      text.match(/good ___|allergic ___|different ___|famous ___|looking forward ___|reminded|apologised|agree ___|walked ___|handed ___|arrived ___|sitting ___/)) return 'prepositions';
  if (allOpts.some(o => ['a','an','the'].includes(o)) && text.match(/___ \w+/)) return 'articles-determiners';
  if (text.match(/sang ___|moved ___|writes ___|played ___|speak ___|drove ___|felt ___|looked ___|tastes ___|danced ___|answered ___|opened ___/) &&
      allOpts.some(o => ['beautifully','slowly','neatly','quietly','loudly','quickly','badly','well','carefully','gracefully','suddenly','correctly','hard','late','happily','delicious','sweet','happy','bad','good','angry','kind'].includes(o))) return 'adverbs-adjectives';
  if (allOpts.some(o => ["doesn't","don't","didn't","isn't","aren't","wasn't","weren't"].includes(o))) return 'standard-english';
  if (allOpts.some(o => ['went','gone','been','done','seen','eaten','written','broken','taken','given','drawn','flown','run','sung','spoken','chosen','drunk','worn','forgotten','begun','come','grown','thrown','swum','known','fallen','frozen','hidden','ridden','rung','risen','shaken','stolen','woken','was reading','had started','will have','had been','had lived'].includes(o))) return 'tenses';
  if (allOpts.some(o => ['is','are','was','were','has','have','does','do','did'].includes(o))) return 'subject-verb-agreement';
  return 'uncategorised';
}

const catQuestions = {};
for (const q of qs) {
  const cat = categorise(q);
  if (!catQuestions[cat]) catQuestions[cat] = [];
  catQuestions[cat].push(q.id);
}

const glCategories = [
  'tenses', 'subject-verb-agreement', 'standard-english', 'homophones',
  'pronouns', 'adverbs-adjectives', 'passive-voice', 'relative-clauses',
  'conjunctions', 'prepositions', 'modal-verbs', 'comparatives-superlatives',
  'articles-determiners'
];

console.log('GL Category → Questions → Mapped Sub-concept → Lesson exists?');
console.log('─'.repeat(80));
for (const cat of glCategories) {
  const qIds = catQuestions[cat] || [];
  const mappedCount = qIds.filter(id => mappedIds.has(id)).length;
  // Find what sub-concept these are mapped to
  const subConcepts = new Set();
  for (const id of qIds) {
    const mapping = grammarMappings.find(m => m.questionId === id);
    if (mapping) subConcepts.add(mapping.subConceptId);
  }
  const scList = [...subConcepts].join(', ') || 'NONE';
  const hasLesson = subConcepts.size > 0 ? '✓' : '⚠ NO LESSON';
  console.log(`${cat.padEnd(28)} ${String(qIds.length).padStart(3)} Qs  ${String(mappedCount).padStart(3)} mapped  SC: ${scList}  ${hasLesson}`);
}

const uncatCount = catQuestions['uncategorised']?.length || 0;
console.log(`${'uncategorised'.padEnd(28)} ${String(uncatCount).padStart(3)} Qs  (need manual categorisation)`);

console.log('\n=== SUMMARY OF GAPS ===');
const gaps = [];
for (const cat of glCategories) {
  const qIds = catQuestions[cat] || [];
  const mappedCount = qIds.filter(id => mappedIds.has(id)).length;
  if (qIds.length > 0 && mappedCount === 0) gaps.push(`${cat}: ${qIds.length} questions, NO lesson mapped`);
  if (qIds.length === 0) gaps.push(`${cat}: NO questions exist (GL expects this category)`);
}
if (unmappedQs.length > 0) gaps.push(`${unmappedQs.length} questions total are unmapped`);
if (uncatCount > 0) gaps.push(`${uncatCount} questions are uncategorised (need manual review)`);

for (const g of gaps) console.log(`  ⚠ ${g}`);
if (gaps.length === 0) console.log('  No gaps found ✓');

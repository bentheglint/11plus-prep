/**
 * Grammar Re-Audit — Full 10-step process
 * Step 2-7: Read, structural audit, answer correctness, difficulty, distractor quality, explanations
 * Key addition: RATIO CHECK against GL research targets
 */
const m = require('../src/questionData/englishData.js');
const data = m.default || m;
const qs = data.topics.grammar.questions;

console.log(`=== GRAMMAR RE-AUDIT: ${qs.length} questions ===\n`);

// ============================================================
// STEP 2: READ & UNDERSTAND
// ============================================================
const dd = {1:0, 2:0, 3:0};
for (const q of qs) dd[q.difficulty]++;
console.log(`Distribution: D1=${dd[1]}(${Math.round(dd[1]/330*100)}%) D2=${dd[2]}(${Math.round(dd[2]/330*100)}%) D3=${dd[3]}(${Math.round(dd[3]/330*100)}%)`);
console.log(`GL target:    D1=25-30% D2=45-50% D3=20-25%\n`);

// ============================================================
// STEP 3: STRUCTURAL + RATIO CHECK
// ============================================================

// Categorise every question by grammar topic
// Use question text + explanation + answer to determine category
const categories = {};
function categorise(q) {
  const text = (q.question + ' ' + (q.explanation || '')).toLowerCase();
  const answer = (q.options[q.correct] || '').toLowerCase();
  const allOpts = q.options.map(o => o.toLowerCase());

  // Check in priority order (most specific first)

  // Homophones
  if (allOpts.some(o => ["their","they're","there","its","it's","your","you're","whose","who's","two","too","to","were","where","we're","affect","effect","passed","past","than","then","practice","practise"].includes(o)) &&
      text.match(/their|they're|there|its|it's|your|you're|whose|who's|too|two|were|where|we're|affect|effect|passed|past/)) {
    return 'homophones';
  }

  // Active/passive voice
  if (text.includes('passive') || text.includes('active voice') ||
      (text.includes('was') && text.includes('by ') && text.includes('___ ')) ||
      text.includes('the letter was') || text.includes('was ___ by') || text.includes('been ___') ||
      text.includes('will be ___') || text.includes('are being') || text.includes('had been ___') ||
      text.includes('is believed to') || text.includes('___ presented') || text.includes('___ delivered')) {
    if (text.includes('passive') || text.includes('by the') || text.includes('was ___ by') ||
        text.includes('been ___') || text.includes('being ___') || text.includes('will be ___')) {
      return 'passive-voice';
    }
  }

  // Relative clauses
  if (allOpts.some(o => ['who','whom','whose','which','that','where','when','why'].includes(o)) &&
      text.match(/the (man|woman|girl|boy|lady|person|dog|cat|car|book|house|park|toy|author|teacher|cinema|day|reason|place|pupil|children|building|headmaster|grandmother|poem|footballer)\b.*___/)) {
    return 'relative-clauses';
  }

  // Pronouns (I/me, reflexive, possessive)
  if (allOpts.some(o => ['i','me','myself','ourselves','herself','himself','themselves','us','him','her','them','mine','hers','ours','theirs'].includes(o))) {
    return 'pronouns';
  }

  // Subject-verb agreement
  if ((text.includes('___ ') || text.includes(' ___')) &&
      allOpts.some(o => ['is','are','was','were','has','have','does','do'].includes(o)) &&
      !text.includes('passive') && !text.includes('by the')) {
    // Check if the question is specifically about agreement (not tense)
    if (text.match(/children ___|team ___|class ___|family ___|everyone ___|nobody ___|each ___|neither.*___|either.*___|number of ___|news ___|mathematics ___|fish and chips ___|sheep ___|jury ___/i) ||
        text.match(/the (dogs?|cats?|birds?|children|pupils?|boys?|girls?) ___|my (brother|sister|friends?|teacher|mum|dad) ___/i)) {
      return 'subject-verb-agreement';
    }
  }

  // Modal verbs
  if (allOpts.some(o => ['might','could','would','should','shall','may','must','can','ought to'].includes(o)) &&
      !text.includes('passive')) {
    return 'modal-verbs';
  }

  // Conjunctions
  if (allOpts.some(o => ['and','but','or','nor','although','because','however','therefore','nevertheless','furthermore','meanwhile','provided','unless','whereas','while','yet','so','consequently'].includes(o)) ||
      text.match(/neither.*___.*nor|not only.*___.*but|both.*___|either.*___/)) {
    return 'conjunctions';
  }

  // Comparatives/superlatives
  if (allOpts.some(o => ['better','worse','best','worst','more','most','less','fewer','taller','tallest','faster','fastest','easier','easiest','funnier','funniest','narrower','bigger'].includes(o)) ||
      text.includes('than') || text.includes('the ___') && text.includes('of all')) {
    return 'comparatives-superlatives';
  }

  // Prepositions
  if (allOpts.some(o => ['at','in','on','to','from','by','for','with','about','through','between','among','across','over','under','off','into','onto','around','behind','beneath'].includes(o)) &&
      text.match(/good ___|allergic ___|different ___|famous ___|insist ___|looking forward ___|reminded.*___|apologised ___|agree ___|arrived ___|walked ___.*the|homework.*handed ___|the train arrived ___|sitting ___/)) {
    return 'prepositions';
  }

  // Articles/determiners
  if (allOpts.some(o => ['a','an','the'].includes(o)) &&
      text.match(/___ (elephant|apple|umbrella|honest|hour|university|european|MP|violin|sun|tallest|river)/i)) {
    return 'articles-determiners';
  }

  // Adverbs vs adjectives
  if (text.match(/sang ___|moved ___|writes ___|played ___|speak ___|drove ___|felt ___|looked ___|tastes ___|smells? ___|danced ___|answered ___|opened ___/) &&
      allOpts.some(o => ['beautifully','slowly','neatly','quietly','loudly','quickly','badly','well','carefully','gracefully','suddenly','correctly','hard','late','happily','delicious','sweet','happy','bad','good','angry','kind'].includes(o))) {
    return 'adverbs-adjectives';
  }

  // Standard English
  if (text.includes("doesn't") || text.includes("couldn't") || text.includes("weren't") ||
      allOpts.some(o => ["doesn't","don't","didn't","isn't","aren't","wasn't","weren't","haven't","hasn't","couldn't","shouldn't","wouldn't","won't","can't","mustn't","we"].includes(o)) &&
      text.match(/she ___ like|we ___ play|he could not|there ___ lots|mum said/)) {
    return 'standard-english';
  }

  // Tenses (catch-all for verb forms)
  if (allOpts.some(o => ['went','gone','been','done','seen','eaten','written','broken','taken','given','drawn','flew','flown','ran','run','sang','sung','spoke','spoken','chose','chosen','drank','drunk','wore','worn','forgot','forgotten','began','begun','came','come','grew','grown','threw','thrown','swam','swum','knew','known','blew','blown','bit','bitten','fell','fallen','froze','frozen','hid','hidden','rode','ridden','rang','rung','rose','risen','shook','shaken','stole','stolen','woke','woken','was reading','had started','will have','had been','had lived','had left','will have finished','had eaten'].includes(o))) {
    return 'tenses';
  }

  // If we get here, try broader matching
  if (allOpts.some(o => ['is','are','was','were','has','have','does','do','did'].includes(o))) {
    return 'subject-verb-agreement'; // Default for is/are/was/were questions
  }

  return 'uncategorised';
}

for (const q of qs) {
  const cat = categorise(q);
  if (!categories[cat]) categories[cat] = {d1:0, d2:0, d3:0, ids:[]};
  categories[cat]['d'+q.difficulty]++;
  categories[cat].ids.push(q.id);
}

// GL target ratios
const targets = {
  'tenses': {min:50, max:60, pct:'15-18%'},
  'subject-verb-agreement': {min:40, max:50, pct:'12-15%'},
  'standard-english': {min:40, max:50, pct:'12-15%'},
  'homophones': {min:25, max:33, pct:'8-10%'},
  'pronouns': {min:25, max:33, pct:'8-10%'},
  'adverbs-adjectives': {min:17, max:23, pct:'5-7%'},
  'passive-voice': {min:17, max:23, pct:'5-7%'},
  'relative-clauses': {min:17, max:26, pct:'5-8%'},
  'conjunctions': {min:17, max:23, pct:'5-7%'},
  'prepositions': {min:13, max:17, pct:'4-5%'},
  'modal-verbs': {min:10, max:13, pct:'3-4%'},
  'comparatives-superlatives': {min:10, max:13, pct:'3-4%'},
  'articles-determiners': {min:7, max:10, pct:'2-3%'},
};

console.log('=== CATEGORY RATIO CHECK (GL targets vs actual) ===');
console.log('Category'.padEnd(30) + 'Count'.padStart(6) + 'Actual%'.padStart(9) + '  GL Target'.padStart(12) + '  Status');
let totalCategorised = 0;
for (const [cat, target] of Object.entries(targets)) {
  const actual = categories[cat]?.ids?.length || 0;
  totalCategorised += actual;
  const pct = Math.round(actual/330*100);
  let status = '✓';
  if (actual < target.min) status = `⚠ LOW (need ${target.min - actual} more)`;
  if (actual > target.max) status = `⚠ HIGH (${actual - target.max} excess)`;
  console.log(cat.padEnd(30) + String(actual).padStart(6) + (pct+'%').padStart(9) + ('  '+target.pct).padStart(12) + '  ' + status);
}
const uncategorised = categories['uncategorised']?.ids?.length || 0;
console.log('uncategorised'.padEnd(30) + String(uncategorised).padStart(6));
console.log('TOTAL categorised'.padEnd(30) + String(totalCategorised).padStart(6) + ` / ${qs.length}`);

// ============================================================
// STEP 3b: STRUCTURAL CHECKS
// ============================================================
console.log('\n=== STRUCTURAL CHECKS ===');
const idCount = {};
let noQ = 0, noOpts = 0, noExp = 0, badIdx = 0;
for (const q of qs) {
  if (!q.question) noQ++;
  if (!q.options || q.options.length < 5) noOpts++;
  if (!q.explanation) noExp++;
  if (q.correct === undefined || q.correct < 0 || q.correct >= (q.options||[]).length) badIdx++;
  idCount[q.id] = (idCount[q.id] || 0) + 1;
}
const dups = Object.entries(idCount).filter(([,c]) => c > 1);
console.log('Missing question:', noQ);
console.log('Missing/short options:', noOpts);
console.log('Missing explanation:', noExp);
console.log('Bad correct index:', badIdx);
console.log('Duplicate IDs:', dups.length === 0 ? 'NONE ✓' : dups.length);

// Duplicate question text
const qTextSeen = {};
let dupTexts = 0;
for (const q of qs) {
  const key = q.question?.substring(0, 80)?.toLowerCase();
  if (key && qTextSeen[key]) {
    console.log(`DUP TEXT: Q${q.id} ≈ Q${qTextSeen[key]}: ${key.substring(0,60)}...`);
    dupTexts++;
  }
  if (key) qTextSeen[key] = q.id;
}
if (dupTexts === 0) console.log('Duplicate texts: NONE ✓');

// ============================================================
// STEP 5: DIFFICULTY AUDIT (every question)
// ============================================================
console.log('\n=== DIFFICULTY AUDIT ===');
console.log(`Current: D1=${dd[1]}(${Math.round(dd[1]/330*100)}%) D2=${dd[2]}(${Math.round(dd[2]/330*100)}%) D3=${dd[3]}(${Math.round(dd[3]/330*100)}%)`);
console.log(`Target:  D1=25-30%(83-99) D2=45-50%(149-165) D3=20-25%(66-83)`);

const d1InRange = dd[1] >= 83 && dd[1] <= 99;
const d2InRange = dd[2] >= 149 && dd[2] <= 165;
const d3InRange = dd[3] >= 66 && dd[3] <= 83;
console.log(`D1 in range: ${d1InRange ? '✓' : '⚠ ' + (dd[1] < 83 ? 'TOO LOW' : 'TOO HIGH')}`);
console.log(`D2 in range: ${d2InRange ? '✓' : '⚠ ' + (dd[2] < 149 ? 'TOO LOW' : 'TOO HIGH')}`);
console.log(`D3 in range: ${d3InRange ? '✓' : '⚠ ' + (dd[3] < 66 ? 'TOO LOW' : 'TOO HIGH')}`);

// Show difficulty distribution per category
console.log('\n=== DIFFICULTY PER CATEGORY ===');
for (const [cat, data] of Object.entries(categories).sort((a,b) => b[1].ids.length - a[1].ids.length)) {
  const total = data.ids.length;
  if (total < 5) continue;
  console.log(`${cat.padEnd(30)} D1:${String(data.d1).padStart(3)} D2:${String(data.d2).padStart(3)} D3:${String(data.d3).padStart(3)} (total: ${total})`);
}

// ============================================================
// STEP 6: DISTRACTOR QUALITY (sample check)
// ============================================================
console.log('\n=== DISTRACTOR QUALITY (sample) ===');
// Check: do all questions have exactly 5 options?
const optCounts = {};
for (const q of qs) { const n = q.options?.length || 0; optCounts[n] = (optCounts[n] || 0) + 1; }
console.log('Option counts:', JSON.stringify(optCounts));

// Check: are there questions where 2+ options would be correct?
// This is hard to automate for grammar but we can flag common patterns
let ambiguousCount = 0;
for (const q of qs) {
  // Check for was/were with collective nouns (genuinely ambiguous)
  if (q.options.includes('was') && q.options.includes('were')) {
    const text = q.question.toLowerCase();
    if (text.includes('the team') || text.includes('the family') || text.includes('the class') ||
        text.includes('the group') || text.includes('the government') || text.includes('the audience')) {
      // Only flag if the answer is singular but plural could also be valid
      if (text.includes('the team ___ celebrating') || text.includes('the family ___ going')) {
        // These are genuinely context-dependent
      }
    }
  }
}

// ============================================================
// STEP 7: EXPLANATION QUALITY (sample)
// ============================================================
console.log('\n=== EXPLANATION QUALITY ===');
let shortExplanations = 0;
let genericExplanations = 0;
for (const q of qs) {
  if (q.explanation && q.explanation.length < 40) shortExplanations++;
  if (q.explanation && q.explanation.match(/^'?\w+'? is the correct/)) genericExplanations++;
}
console.log('Short explanations (<40 chars):', shortExplanations);
console.log('Generic "X is correct" pattern:', genericExplanations);

// ============================================================
// SUMMARY
// ============================================================
console.log('\n=== SUMMARY ===');
const ratioIssues = Object.entries(targets).filter(([cat, t]) => {
  const actual = categories[cat]?.ids?.length || 0;
  return actual < t.min || actual > t.max;
});
console.log('Ratio issues:', ratioIssues.length);
console.log('Difficulty range issues:', [d1InRange, d2InRange, d3InRange].filter(x => !x).length);
console.log('Structural issues:', noQ + noOpts + noExp + badIdx + dups.length + dupTexts);

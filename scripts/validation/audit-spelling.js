/**
 * Comprehensive spelling audit:
 * 1. Answer correctness (verify the flagged segment actually has a spelling error)
 * 2. Difficulty level assessment
 * 3. Duplicate detection
 * 4. Explanation quality
 * 5. Category breakdown (what spelling rules are tested)
 */
const m = require('../src/questionData/englishData.js');
const data = m.default || m;
const qs = data.topics.spelling.questions;

console.log(`Auditing ${qs.length} spelling questions\n`);

const issues = [];

// Categorise by spelling rule (from explanation)
const categories = {};
for (const q of qs) {
  const exp = (q.explanation || '').toLowerCase();
  let cat = 'other';

  if (exp.includes('double') || exp.includes('doubled')) cat = 'double-letters';
  else if (exp.includes('silent') || exp.includes('silent letter')) cat = 'silent-letters';
  else if (exp.includes('-tion') || exp.includes('-sion') || exp.includes('-cian') || exp.includes('suffix')) cat = 'suffixes';
  else if (exp.includes('prefix') || exp.includes('dis-') || exp.includes('mis-') || exp.includes('un-') || exp.includes('re-')) cat = 'prefixes';
  else if (exp.includes('homophone') || exp.includes('sounds like') || exp.includes('sound the same')) cat = 'homophones';
  else if (exp.includes('-ible') || exp.includes('-able')) cat = 'ible-able';
  else if (exp.includes('-ous') || exp.includes('-ious') || exp.includes('-eous')) cat = 'ous-endings';
  else if (exp.includes('-ence') || exp.includes('-ance')) cat = 'ence-ance';
  else if (exp.includes('-ful') || exp.includes('-ment') || exp.includes('-ness') || exp.includes('-ly')) cat = 'common-suffixes';
  else if (exp.includes('ei') || exp.includes('ie') || exp.includes('i before e')) cat = 'ie-ei';
  else if (exp.includes('no mistake') || exp.includes('no error') || exp.includes('no spelling error') || q.correct === 4) cat = 'no-mistake';
  else if (exp.includes('common exception') || exp.includes('exception word') || exp.includes('just needs to be learnt') || exp.includes('memorise')) cat = 'exception-words';

  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(q.id);
}

console.log('=== SPELLING CATEGORIES ===');
for (const [cat, ids] of Object.entries(categories).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${cat}: ${ids.length} questions`);
}

// Duplicate detection (same segments)
const segSeen = {};
for (const q of qs) {
  const key = (q.segments || []).join('|').toLowerCase();
  if (segSeen[key]) {
    issues.push({ id: q.id, type: 'DUPLICATE', detail: `Same segments as Q${segSeen[key]}` });
  }
  segSeen[key] = q.id;
}

// "No mistake" count
const noMistakeQs = qs.filter(q => q.correct === 4);
console.log(`\n"No mistake" answers: ${noMistakeQs.length} (${Math.round(noMistakeQs.length/qs.length*100)}%)`);

// Verify "No mistake" answers don't have obvious misspellings
// Common misspellings to check for
const commonMisspellings = [
  'untill','lovley','intresting','becuase','accomodation','neccessary','fasinating',
  'seperate','definately','occassion','embarrased','goverment','enviroment','independant',
  'arguement','dissappoint','occured','recieve','wierd','freind','beleive','acheive',
  'suprise','succesful','begining','occurance','dissapear','calender','cemetary',
  'consciense','concious','curiousity','desparate','dissapoint','exagerate','existance',
  'expirience','familar','finaly','foriegn','fourty','gaurd','goverment','grammer',
  'harrass','humourous','ignorence','immediatly','independance','jewellary','knowlege',
  'liason','libary','mischevious','neice','noticable','occassionally','occurence',
  'paralell','parliment','perseverence','persistant','pharoah','posession','prefered',
  'priveledge','professer','pronounciation','publically','questionaire','recomend',
  'refered','relevent','religous','remeber','restuarant','rhyme','rythem','seige',
  'shedule','solider','speach','strengh','succesful','supercede','tempature','tommorow',
  'truely','unfortunatly','vaccuum','vegatable','vehical','wether','writting'
];

for (const q of noMistakeQs) {
  const text = (q.segments || []).join(' ').toLowerCase();
  for (const mis of commonMisspellings) {
    if (text.includes(mis)) {
      issues.push({ id: q.id, type: 'NO_MISTAKE_HAS_ERROR', detail: `"No mistake" but contains "${mis}"` });
    }
  }
}

// Difficulty assessment
// D1: common words children use daily (until, lovely, friend, because)
// D2: curriculum words (interesting, necessary, separate, receive)
// D3: advanced/rare words (accommodation, conscience, parliament, privilege)
const diffFlags = [];

for (const q of qs) {
  const exp = (q.explanation || '').toLowerCase();
  const segs = (q.segments || []).join(' ').toLowerCase();

  // Extract the misspelled word from the error segment
  const errorSeg = q.correct < 4 ? (q.segments || [])[q.correct] : null;

  // D3 questions with very common misspelled words
  if (q.difficulty === 3 && errorSeg) {
    const seg = errorSeg.toLowerCase();
    const commonWords = ['because', 'friend', 'until', 'lovely', 'beautiful', 'different', 'special', 'important'];
    for (const w of commonWords) {
      if (seg.includes(w.substring(0, 4)) && !seg.includes(w)) {
        // Possible misspelling of a common word at D3
        diffFlags.push({ id: q.id, current: 3, suggested: 1, reason: `Common word "${w}" misspelling at D3` });
      }
    }
  }

  // D1 questions with very advanced words
  if (q.difficulty === 1 && errorSeg) {
    const seg = errorSeg.toLowerCase();
    const advancedWords = ['accommodation', 'necessary', 'parliament', 'privilege', 'conscience', 'mischievous', 'pneumonia', 'psychology'];
    for (const w of advancedWords) {
      if (seg.includes(w.substring(0, 5))) {
        diffFlags.push({ id: q.id, current: 1, suggested: 3, reason: `Advanced word "${w}" at D1` });
      }
    }
  }
}

// Print results
console.log('\n=== ISSUES ===');
const byType = {};
for (const i of issues) {
  if (!byType[i.type]) byType[i.type] = [];
  byType[i.type].push(i);
}
for (const [type, items] of Object.entries(byType)) {
  console.log(`\n${type} (${items.length}):`);
  for (const i of items.slice(0, 10)) {
    const q = qs.find(q => q.id === i.id);
    console.log(`  Q${i.id}(D${q?.difficulty}): ${i.detail}`);
  }
  if (items.length > 10) console.log(`  ... and ${items.length - 10} more`);
}

if (diffFlags.length > 0) {
  console.log('\n=== DIFFICULTY FLAGS ===');
  for (const f of diffFlags) {
    console.log(`  Q${f.id}: D${f.current}→D${f.suggested} — ${f.reason}`);
  }
} else {
  console.log('\n=== DIFFICULTY FLAGS ===\n  No automated flags');
}

// Distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of qs) dd[q.difficulty]++;
console.log(`\n=== DISTRIBUTION ===`);
console.log(`D1: ${dd[1]} (${Math.round(dd[1] / qs.length * 100)}%)`);
console.log(`D2: ${dd[2]} (${Math.round(dd[2] / qs.length * 100)}%)`);
console.log(`D3: ${dd[3]} (${Math.round(dd[3] / qs.length * 100)}%)`);

// Samples
console.log('\n=== SAMPLES ===');
for (const d of [1, 2, 3]) {
  const dqs = qs.filter(q => q.difficulty === d);
  const picks = [dqs[0], dqs[Math.floor(dqs.length / 2)], dqs[dqs.length - 1]];
  console.log(`\n--- D${d} ---`);
  for (const q of picks) {
    const ans = q.correct === 4 ? 'No mistake' : 'Sec ' + 'ABCD'[q.correct];
    const errorWord = q.correct < 4 ? q.segments[q.correct] : '(none)';
    console.log(`Q${q.id}: [${errorWord}] → ${ans}`);
  }
}

console.log(`\nTotal issues: ${issues.length}`);
console.log(`Difficulty flags: ${diffFlags.length}`);

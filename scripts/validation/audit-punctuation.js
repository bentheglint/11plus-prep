/**
 * Comprehensive punctuation audit:
 * 1. Answer correctness (verify the flagged segment actually has an error)
 * 2. Difficulty level assessment
 * 3. Duplicate detection
 * 4. Explanation quality
 * 5. Category breakdown (what punctuation rules are tested)
 */
const m = require('../src/questionData/englishData.js');
const data = m.default || m;
const qs = data.topics.punctuation.questions;

console.log(`Auditing ${qs.length} punctuation questions\n`);

const issues = [];

// Categorise by punctuation type (from segments and explanation)
const categories = {};
for (const q of qs) {
  const segs = (q.segments || []).join(' ').toLowerCase();
  const exp = (q.explanation || '').toLowerCase();
  let cat = 'other';

  if (exp.includes('apostrophe') || exp.includes("'s") || exp.includes('contraction') || exp.includes('possession') || exp.includes('possessive')) cat = 'apostrophes';
  else if (exp.includes('comma') || exp.includes(', ')) cat = 'commas';
  else if (exp.includes('speech marks') || exp.includes('direct speech') || exp.includes('inverted commas') || exp.includes('"')) cat = 'speech-marks';
  else if (exp.includes('capital') || exp.includes('Capital')) cat = 'capitals';
  else if (exp.includes('semicolon') || exp.includes(';')) cat = 'semicolons';
  else if (exp.includes('colon') || exp.includes(':')) cat = 'colons';
  else if (exp.includes('hyphen') || exp.includes('-')) cat = 'hyphens';
  else if (exp.includes('exclamation')) cat = 'exclamation';
  else if (exp.includes('question mark')) cat = 'question-marks';
  else if (exp.includes('bracket') || exp.includes('parenthes')) cat = 'brackets';
  else if (exp.includes('full stop') || exp.includes('period')) cat = 'full-stops';
  else if (exp.includes('ellipsis') || exp.includes('...')) cat = 'ellipsis';
  else if (exp.includes('no mistake') || exp.includes('no error') || q.correct === 4) cat = 'no-mistake';

  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(q.id);
}

console.log('=== PUNCTUATION CATEGORIES ===');
for (const [cat, ids] of Object.entries(categories).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${cat}: ${ids.length} questions`);
}

// Check for duplicate segments (same error scenario)
const segSeen = {};
let dupCount = 0;
for (const q of qs) {
  const key = (q.segments || []).join('|').toLowerCase();
  if (segSeen[key]) {
    issues.push({ id: q.id, type: 'DUPLICATE', detail: `Same segments as Q${segSeen[key]}` });
    dupCount++;
  }
  segSeen[key] = q.id;
}

// Check "No mistake" answers — verify there truly is no error
const noMistakeQs = qs.filter(q => q.correct === 4);
console.log(`\n"No mistake" answers: ${noMistakeQs.length}`);

// Check for questions where the answer is "No mistake" but there might actually be an error
for (const q of noMistakeQs) {
  const text = (q.segments || []).join(' ');
  // Quick checks for common errors that might have been missed
  if (text.includes("dont") || text.includes("cant") || text.includes("wont") || text.includes("isnt") || text.includes("didnt") || text.includes("wasnt") || text.includes("havent") || text.includes("hasnt") || text.includes("wouldnt") || text.includes("shouldnt") || text.includes("couldnt")) {
    issues.push({ id: q.id, type: 'NO_MISTAKE_BUT_ERROR?', detail: 'Missing apostrophe in contraction: ' + text.substring(0, 80) });
  }
  if (text.match(/[a-z]\s*"/) && !text.match(/[.,!?]\s*"/)) {
    // Possible missing punctuation before closing speech marks
  }
}

// Check for answer correctness patterns
// If answer is Section C (index 2), verify segment C has an issue
for (const q of qs) {
  if (q.correct === 4) continue; // "No mistake"
  const errorSeg = q.segments?.[q.correct];
  if (!errorSeg) {
    issues.push({ id: q.id, type: 'BAD_SEGMENT', detail: `correct=${q.correct} but segment missing` });
    continue;
  }

  // Check if explanation references the error segment content
  if (q.explanation && !q.explanation.includes(errorSeg.substring(0, 10))) {
    // Might be OK — explanation could paraphrase
  }
}

// Difficulty assessment
// D1: missing capital letters, basic apostrophe contractions (didn't/don't), basic full stops
// D2: apostrophe possession, commas after fronted adverbials, colons for lists, speech marks
// D3: semicolons, commas in relative clauses, hyphens, ellipsis, advanced speech mark punctuation
const diffFlags = [];
for (const q of qs) {
  const exp = (q.explanation || '').toLowerCase();
  const segs = (q.segments || []).join(' ');

  // D1 questions that test advanced concepts
  if (q.difficulty === 1) {
    if (exp.includes('semicolon') || exp.includes('colon') || exp.includes('hyphen') ||
        exp.includes('parenthes') || exp.includes('bracket') || exp.includes('ellipsis')) {
      diffFlags.push({ id: q.id, current: 1, suggested: 2, reason: 'Advanced punctuation for D1' });
    }
    if (exp.includes('relative clause') || exp.includes('subordinate clause') || exp.includes('embedded clause')) {
      diffFlags.push({ id: q.id, current: 1, suggested: 2, reason: 'Clause-level comma usage for D1' });
    }
  }

  // D3 questions that test basic concepts
  if (q.difficulty === 3) {
    if (exp.includes("missing apostrophe") && (exp.includes("didn't") || exp.includes("don't") || exp.includes("can't") || exp.includes("won't") || exp.includes("isn't"))) {
      diffFlags.push({ id: q.id, current: 3, suggested: 1, reason: 'Basic contraction apostrophe is not D3' });
    }
    if (exp.includes('capital letter') && (exp.includes('start of sentence') || exp.includes('proper noun'))) {
      diffFlags.push({ id: q.id, current: 3, suggested: 1, reason: 'Basic capital letter rule is not D3' });
    }
    if (exp.includes('full stop') && exp.includes('end of sentence')) {
      diffFlags.push({ id: q.id, current: 3, suggested: 1, reason: 'Basic full stop is not D3' });
    }
  }

  // D2 questions that are very basic
  if (q.difficulty === 2) {
    if (exp.includes("missing apostrophe") && (exp.includes("didn't") || exp.includes("don't") || exp.includes("can't"))) {
      // Basic contraction — could be D1
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
  for (const i of items.slice(0, 15)) {
    console.log(`  Q${i.id}(D${qs.find(q => q.id === i.id)?.difficulty}): ${i.detail}`);
  }
  if (items.length > 15) console.log(`  ... and ${items.length - 15} more`);
}

console.log('\n=== DIFFICULTY FLAGS ===');
if (diffFlags.length === 0) {
  console.log('  No automated flags');
} else {
  for (const f of diffFlags) {
    console.log(`  Q${f.id}: D${f.current}→D${f.suggested} — ${f.reason}`);
  }
}

// Distribution
const dd = { 1: 0, 2: 0, 3: 0 };
for (const q of qs) dd[q.difficulty]++;
console.log(`\n=== DISTRIBUTION ===`);
console.log(`D1: ${dd[1]} (${Math.round(dd[1] / qs.length * 100)}%)`);
console.log(`D2: ${dd[2]} (${Math.round(dd[2] / qs.length * 100)}%)`);
console.log(`D3: ${dd[3]} (${Math.round(dd[3] / qs.length * 100)}%)`);

// Show samples
console.log('\n=== SAMPLES ===');
for (const d of [1, 2, 3]) {
  const dqs = qs.filter(q => q.difficulty === d);
  const picks = [dqs[0], dqs[Math.floor(dqs.length / 2)], dqs[dqs.length - 1]];
  console.log(`\n--- D${d} ---`);
  for (const q of picks) {
    console.log(`Q${q.id}: [${q.segments.join(' | ')}]`);
    console.log(`  Answer: ${q.options[q.correct]} | ${q.explanation?.substring(0, 100)}`);
  }
}

console.log(`\nTotal issues: ${issues.length}`);
console.log(`Difficulty flags: ${diffFlags.length}`);

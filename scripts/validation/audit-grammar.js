/**
 * Comprehensive grammar audit:
 * 1. Answer correctness
 * 2. Difficulty level assessment
 * 3. Duplicate detection
 * 4. Explanation quality
 */
const m = require('../src/questionData/englishData.js');
const data = m.default || m;
const qs = data.topics.grammar.questions;

console.log(`Auditing ${qs.length} grammar questions\n`);

const issues = [];

// Categorise questions by grammar topic (extracted from question text)
const categories = {};
for (const q of qs) {
  const text = q.question.toLowerCase();
  let cat = 'other';
  if (text.includes('tense') || text.includes('past') || text.includes('present') || text.includes('future')) cat = 'tense';
  else if (text.includes('correct word to complete')) cat = 'fill-in-blank';
  else if (text.includes('choose the correct sentence') || text.includes('which sentence is correct') || text.includes('grammatically correct')) cat = 'correct-sentence';
  else if (text.includes('noun') || text.includes('verb') || text.includes('adjective') || text.includes('adverb') || text.includes('pronoun') || text.includes('preposition') || text.includes('conjunction') || text.includes('determiner')) cat = 'word-class';
  else if (text.includes('plural') || text.includes('singular')) cat = 'plurals';
  else if (text.includes('active') || text.includes('passive')) cat = 'voice';
  else if (text.includes('clause') || text.includes('subordinate') || text.includes('main clause')) cat = 'clauses';
  else if (text.includes('subject') && text.includes('verb')) cat = 'subject-verb';
  else if (text.includes('prefix') || text.includes('suffix')) cat = 'affixes';
  else if (text.includes('apostrophe') || text.includes('possessive')) cat = 'apostrophes';
  else if (text.includes('formal') || text.includes('informal') || text.includes('standard english')) cat = 'register';

  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(q.id);
}

console.log('=== QUESTION CATEGORIES ===');
for (const [cat, ids] of Object.entries(categories).sort((a,b) => b[1].length - a[1].length)) {
  console.log(`  ${cat}: ${ids.length} questions`);
}

// Check for duplicate questions (same question text)
const seen = {};
for (const q of qs) {
  const key = q.question.substring(0, 80).toLowerCase();
  if (seen[key]) {
    issues.push({ id: q.id, type: 'DUPLICATE', detail: `Same as Q${seen[key]}` });
  }
  seen[key] = q.id;
}

// Check for duplicate answer patterns (same options in same order)
const optsSeen = {};
for (const q of qs) {
  const key = q.options.join('|').toLowerCase();
  if (optsSeen[key]) {
    // Only flag if question is also similar
    const otherQ = qs.find(qq => qq.id === optsSeen[key]);
    if (otherQ && q.correct === otherQ.correct) {
      issues.push({ id: q.id, type: 'SAME_OPTIONS_ANSWER', detail: `Same options+answer as Q${optsSeen[key]}` });
    }
  }
  optsSeen[key] = q.id;
}

// Difficulty assessment based on grammar topic complexity
// D1: basic subject-verb agreement, simple tenses (past/present), common plurals, basic word classes
// D2: irregular forms, less obvious agreement, conditionals, passive voice basics, prefixes/suffixes
// D3: subjunctive, complex clauses, advanced passive, formal/informal register, ambiguous cases
const difficultyFlags = [];
for (const q of qs) {
  const text = q.question.toLowerCase();
  const answer = q.options[q.correct]?.toLowerCase() || '';
  const explanation = q.explanation?.toLowerCase() || '';

  // Flag D1 questions that seem too hard
  if (q.difficulty === 1) {
    if (text.includes('subjunctive') || text.includes('subordinate clause') ||
        text.includes('passive voice') || text.includes('formal') ||
        text.includes('relative clause') || text.includes('modal verb') ||
        text.includes('conditional')) {
      difficultyFlags.push({ id: q.id, current: 1, suggested: 2, reason: 'Advanced grammar concept for D1' });
    }
    if (answer.includes('whom') || answer.includes('subjunctive') ||
        text.includes('neither') || text.includes('nor')) {
      difficultyFlags.push({ id: q.id, current: 1, suggested: 2, reason: 'Advanced usage for D1' });
    }
  }

  // Flag D3 questions that seem too easy
  if (q.difficulty === 3) {
    if ((text.includes('___ playing') || text.includes('___ running') || text.includes('___ going')) &&
        (answer === 'was' || answer === 'were' || answer === 'is' || answer === 'are')) {
      difficultyFlags.push({ id: q.id, current: 3, suggested: 1, reason: 'Basic subject-verb agreement is not D3' });
    }
    // Simple past tense
    if (text.includes('choose the correct word') &&
        (answer === 'ran' || answer === 'went' || answer === 'came' || answer === 'saw' || answer === 'ate')) {
      difficultyFlags.push({ id: q.id, current: 3, suggested: 1, reason: 'Common irregular past tense is not D3' });
    }
  }

  // Flag D2 questions that seem too easy (should be D1)
  if (q.difficulty === 2) {
    const simplePatterns = [
      /she ___ to the shop/,
      /they ___ playing/,
      /he ___ a book/,
      /the dog ___ its bone/,
    ];
    for (const p of simplePatterns) {
      if (p.test(text) && ['was','were','is','are','went','has','had'].includes(answer)) {
        difficultyFlags.push({ id: q.id, current: 2, suggested: 1, reason: 'Very basic fill-in-blank' });
        break;
      }
    }
  }
}

// Check explanation mentions the answer word
for (const q of qs) {
  const answer = q.options[q.correct]?.toLowerCase();
  if (answer && q.explanation && !q.explanation.toLowerCase().includes(answer)) {
    issues.push({ id: q.id, type: 'EXPLANATION_MISSING_ANSWER', detail: `Answer '${answer}' not in explanation` });
  }
}

// Check for questions where multiple options could be correct
// (This is hard to do programmatically for grammar, so just flag common patterns)
for (const q of qs) {
  const text = q.question.toLowerCase();
  // "was" vs "were" ambiguity
  if (q.options.includes('was') && q.options.includes('were')) {
    // Check if the sentence context makes both potentially valid
    if (text.includes('the team') || text.includes('the family') || text.includes('the class') || text.includes('the group')) {
      issues.push({ id: q.id, type: 'POSSIBLE_AMBIGUITY', detail: 'Collective noun with was/were — both could be correct' });
    }
  }
}

// Print all issues
console.log('\n=== ISSUES ===');
const byType = {};
for (const i of issues) {
  if (!byType[i.type]) byType[i.type] = [];
  byType[i.type].push(i);
}
for (const [type, items] of Object.entries(byType)) {
  console.log(`\n${type} (${items.length}):`);
  for (const i of items) {
    console.log(`  Q${i.id}(D${qs.find(q=>q.id===i.id)?.difficulty}): ${i.detail}`);
  }
}

// Print difficulty flags
console.log('\n=== DIFFICULTY FLAGS ===');
if (difficultyFlags.length === 0) {
  console.log('  No automated flags (manual review needed for full accuracy)');
} else {
  for (const f of difficultyFlags) {
    const q = qs.find(q => q.id === f.id);
    console.log(`  Q${f.id}: D${f.current}→D${f.suggested} — ${f.reason}`);
    console.log(`    "${q.question.substring(0, 80)}..."`);
  }
}

// Distribution
const dd = {1:0, 2:0, 3:0};
for (const q of qs) dd[q.difficulty]++;
console.log(`\n=== DISTRIBUTION ===`);
console.log(`D1: ${dd[1]} (${Math.round(dd[1]/qs.length*100)}%)`);
console.log(`D2: ${dd[2]} (${Math.round(dd[2]/qs.length*100)}%)`);
console.log(`D3: ${dd[3]} (${Math.round(dd[3]/qs.length*100)}%)`);

// Show 3 samples from each difficulty for manual review
console.log('\n=== SAMPLES FOR MANUAL REVIEW ===');
for (const d of [1, 2, 3]) {
  console.log(`\n--- D${d} ---`);
  const dqs = qs.filter(q => q.difficulty === d);
  const picks = [dqs[0], dqs[Math.floor(dqs.length/3)], dqs[Math.floor(dqs.length*2/3)]];
  for (const q of picks) {
    console.log(`Q${q.id}: ${q.question.substring(0, 120)}`);
    console.log(`  Answer: ${q.options[q.correct]}`);
    console.log(`  Options: ${q.options.join(' | ')}`);
  }
}

console.log(`\nTotal issues: ${issues.length}`);
console.log(`Difficulty flags: ${difficultyFlags.length}`);

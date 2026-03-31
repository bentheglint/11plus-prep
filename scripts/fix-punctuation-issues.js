#!/usr/bin/env node
/**
 * Fix all punctuation issues from Oracle Phase 4 review.
 * 22 issues total, 3 critical already resolved (Q7, Q18, Q116 removed).
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');
let content = fs.readFileSync(filePath, 'utf8');

const data = require('../src/questionData/englishData').default;
const punc = data.topics.punctuation.questions;

let fixCount = 0;

function replaceExplanation(qId, oldFragment, newExplanation) {
  const q = punc.find(q2 => q2.id === qId);
  if (!q) { console.log(`  SKIP Q${qId}: not found`); return; }
  const oldExp = q.explanation;
  if (!content.includes(oldExp.substring(0, 80))) {
    console.log(`  SKIP Q${qId}: can't find explanation in file`);
    return;
  }
  content = content.replace(JSON.stringify(oldExp), JSON.stringify(newExplanation));
  fixCount++;
}

function replaceSegments(qId, newSegments) {
  const q = punc.find(q2 => q2.id === qId);
  if (!q) return;
  const oldStr = JSON.stringify(q.segments);
  const newStr = JSON.stringify(newSegments);
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fixCount++;
  }
}

function replaceCorrect(qId, newCorrect) {
  const q = punc.find(q2 => q2.id === qId);
  if (!q) return;
  // Find the specific question block and replace correct value
  // Use segments as anchor
  const segStr = JSON.stringify(q.segments);
  const segIdx = content.indexOf(segStr);
  if (segIdx === -1) return;
  // Find "correct": N near this location
  const searchArea = content.substring(segIdx, segIdx + segStr.length + 500);
  const correctMatch = searchArea.match(/"correct":\s*(\d)/);
  if (correctMatch) {
    const fullMatch = '"correct": ' + correctMatch[1];
    const replacement = '"correct": ' + newCorrect;
    const absPos = segIdx + searchArea.indexOf(fullMatch);
    content = content.substring(0, absPos) + replacement + content.substring(absPos + fullMatch.length);
    fixCount++;
  }
}

console.log('=== Fixing Punctuation Issues ===\n');

// -------------------------------------------------------
// ISSUE 1: Capital letter explanations show lowercase
// Fix: change "should be 'x'" to "should be 'X'"
// -------------------------------------------------------
console.log('Issue 1: Fixing capital letter explanations...');

const capFixes = {
  12: { wrong: "paris", right: "Paris" },
  21: { wrong: "miss", right: "Miss" },
  27: { wrong: "saturday", right: "Saturday" },
  58: { wrong: "edinburgh", right: "Edinburgh" },
  59: { wrong: "march", right: "March" },
  60: { wrong: "tuesday", right: "Tuesday" },
  61: { wrong: "france", right: "France" },
  62: { wrong: "aunt", right: "Aunt" },
  63: { wrong: "river", right: "River" },
  64: { wrong: "manchester", right: "Manchester" },
  66: { wrong: "christmas", right: "Christmas" },
  108: { wrong: "wednesday", right: "Wednesday" },
  109: { wrong: "wales", right: "Wales" },
  112: { wrong: "thursday", right: "Thursday" },
  115: { wrong: "aunt", right: "Aunt" },
  120: { wrong: "dorset", right: "Dorset" },
  122: { wrong: "london", right: "London" },
  128: { wrong: "scotland", right: "Scotland" },
};

for (const [idStr, fix] of Object.entries(capFixes)) {
  const id = parseInt(idStr);
  const q = punc.find(q2 => q2.id === id);
  if (!q) continue;
  const oldExp = q.explanation;
  const newExp = oldExp.replace(
    `should be '${fix.wrong}'`,
    `should be '${fix.right}'`
  );
  if (oldExp !== newExp) {
    content = content.replace(JSON.stringify(oldExp), JSON.stringify(newExp));
    fixCount++;
    console.log(`  Q${id}: '${fix.wrong}' -> '${fix.right}'`);
  }
}

// -------------------------------------------------------
// ISSUE 1 (cont): Q85 and Q86 use wrong rule (proper noun instead of start-of-sentence)
// -------------------------------------------------------
console.log('\nIssue 1b: Fixing Q85/Q86 explanation rule...');

replaceExplanation(85, "proper nouns",
  "'yes' needs a capital letter \u2014 it should be 'Yes'. When a new sentence of direct speech begins after a reporting clause (like 'asked Ben'), it must start with a capital letter, just like any new sentence. \u2713"
);
console.log('  Q85: changed to start-of-sentence rule');

replaceExplanation(86, "proper nouns",
  "'thanks' needs a capital letter \u2014 it should be 'Thanks'. Each new piece of direct speech starts a new sentence, so it needs a capital letter. \u2713"
);
console.log('  Q86: changed to start-of-sentence rule');

// -------------------------------------------------------
// ISSUE 2: Q2 and Q13 wrong explanation (fronted adverbial instead of speech punctuation)
// -------------------------------------------------------
console.log('\nIssue 2: Fixing Q2 and Q13 explanations...');

replaceExplanation(2, "fronted adverbial",
  "A comma is needed after 'said' before the speech marks: James said, \"I really enjoyed...\" When introducing direct speech with a reporting verb, always put a comma before the opening speech marks. \u2713"
);
console.log('  Q2: fixed to speech punctuation rule');

replaceExplanation(13, "fronted adverbial",
  "A comma is needed after the closing speech marks and before the reporting verb: \"I love swimming,\" said Amara. When speech comes before the reporting clause, a comma replaces the full stop inside the speech marks. \u2713"
);
console.log('  Q13: fixed to speech punctuation rule');

// -------------------------------------------------------
// ISSUE 3: Q200, Q202, Q204, Q206 wrong explanation (fronted adverbial instead of speech)
// -------------------------------------------------------
console.log('\nIssue 3: Fixing Q200, Q202, Q204, Q206 explanations...');

const speechFixIds = [200, 202, 204, 206];
speechFixIds.forEach(id => {
  const q = punc.find(q2 => q2.id === id);
  if (!q) { console.log(`  SKIP Q${id}: not found`); return; }
  const oldExp = q.explanation;
  if (oldExp.includes("fronted adverbial") || oldExp.includes("doesn't start with the main action")) {
    const seg0 = q.segments[0];
    // Extract the reporting verb phrase
    const newExp = `A comma is needed after the reporting verb before the opening speech marks. When introducing direct speech, always place a comma before the speech marks begin. \u2713`;
    content = content.replace(JSON.stringify(oldExp), JSON.stringify(newExp));
    fixCount++;
    console.log(`  Q${id}: fixed to speech punctuation rule`);
  }
});

// -------------------------------------------------------
// ISSUE 4: Q10 explanation (commas in lists -> colon vs semicolon)
// -------------------------------------------------------
console.log('\nIssue 4: Fixing Q10 explanation...');

replaceExplanation(10, "Commas are needed",
  "A colon (:) should be used here, not a semicolon (;). When you introduce a list with a phrase like 'two things', use a colon to announce what follows: 'There are two things I enjoy most: swimming in the sea and climbing mountains.' \u2713"
);
console.log('  Q10: fixed to colon vs semicolon rule');

// -------------------------------------------------------
// ISSUE 8: Q40 explanation mentions apostrophe but sentence has none
// -------------------------------------------------------
console.log('\nIssue 8: Fixing Q40 explanation...');

replaceExplanation(40, "apostrophe is in exactly the right place",
  "This one's a trick \u2014 there's actually nothing wrong here! All the punctuation is correct. Every sentence needs careful checking even when it looks fine. \u2713"
);
console.log('  Q40: removed false apostrophe reference');

// -------------------------------------------------------
// ISSUE 9: Q25 tests spelling (there/their), not punctuation
// Replace with a genuine punctuation error
// -------------------------------------------------------
console.log('\nIssue 9: Fixing Q25 (spelling -> punctuation)...');

replaceSegments(25, ["The teachers asked", "the students to", "complete, their homework", "before Monday morning."]);
// Now segment C has a wrong comma after "complete"
replaceCorrect(25, 2);
replaceExplanation(25, "'there' should be 'their'",
  "There should not be a comma after 'complete'. The sentence flows directly: 'complete their homework' \u2014 no pause or list is needed here. Removing the comma fixes the sentence. \u2713"
);
console.log('  Q25: replaced spelling error with punctuation error (wrong comma)');

// -------------------------------------------------------
// ISSUE 10 & 11: Q26 and Q78 explanations reference non-existent commas
// -------------------------------------------------------
console.log('\nIssue 10/11: Fixing Q26 and Q78 explanations...');

// Q26: "The concert which | featured three local bands | was held in | the town hall."
// This is actually a defining clause (which concert? the one that featured three bands)
// So "No mistake" might be correct. But the explanation is wrong regardless.
// The Oracle flagged it as correct=0 (segment A has error) but explanation says "comma shouldn't be there" when there is no comma.
// Let's check what correct=0 means here...
const q26 = punc.find(q2 => q2.id === 26);
if (q26) {
  // correct=0 means segment A has the error. But what IS the error?
  // "The concert which" — potentially missing comma before "which" for non-defining clause
  // OR it's correct as-is (defining clause). This is genuinely ambiguous.
  // Safest fix: change to No Mistake (correct=4) since the defining reading is valid
  replaceCorrect(26, 4);
  replaceExplanation(26, "That comma shouldn't be there",
    "This sentence is correct as written. 'The concert which featured three local bands' uses a defining relative clause \u2014 it tells us WHICH concert. No commas are needed because the information is essential to identify the concert. \u2713"
  );
  console.log('  Q26: changed to No Mistake (defining clause is valid)');
}

// Q78: "The old cottage which | had stood for centuries | was finally sold | to a young couple."
const q78 = punc.find(q2 => q2.id === 78);
if (q78) {
  replaceCorrect(78, 4);
  replaceExplanation(78, "That comma shouldn't be there",
    "This sentence is correct as written. 'The old cottage which had stood for centuries' uses a defining relative clause \u2014 it identifies WHICH cottage. The information is essential, so no commas are needed. \u2713"
  );
  console.log('  Q78: changed to No Mistake (defining clause is valid)');
}

// -------------------------------------------------------
// ISSUE 12: Q77 explanation not specific enough
// -------------------------------------------------------
console.log('\nIssue 12: Fixing Q77 explanation...');

replaceExplanation(77, "Commas are needed to separate the items in this list",
  "A comma is missing after 'sugar'. In a list, each item needs to be separated by a comma: 'flour, sugar, butter, eggs and milk'. Without the comma, 'sugar butter' looks like it could be one item. \u2713"
);
console.log('  Q77: made explanation specific');

// -------------------------------------------------------
// ISSUE 16: Q84 wrong explanation (fronted adverbial -> interrupted speech)
// -------------------------------------------------------
console.log('\nIssue 16: Fixing Q84 explanation...');

replaceExplanation(84, "fronted adverbial",
  "A comma is needed after 'Harris' before the speech continues: said Mrs Harris, \"and open your...\" When speech is interrupted by a reporting clause, you need a comma after the reporting clause before the speech resumes. \u2713"
);
console.log('  Q84: fixed to interrupted speech rule');

// -------------------------------------------------------
// ISSUE 19: Q74 rewrite (comma before but - make independent clauses)
// -------------------------------------------------------
console.log('\nIssue 19: Rewriting Q74...');

replaceSegments(74, ["The bag was packed", "with all the supplies", "for the school trip", "but the teacher forgot her keys."]);
replaceExplanation(74, "There should be a comma before 'but'",
  "A comma is needed before 'but' when it joins two complete sentences. 'The bag was packed with all the supplies for the school trip' is one sentence. 'The teacher forgot her keys' is another. Join them with: '...trip, but the teacher forgot her keys.' \u2713"
);
// correct stays at 3 (segment D has the error: "but" needs comma before it)
console.log('  Q74: rewritten with independent clauses');

// -------------------------------------------------------
// Write the file
// -------------------------------------------------------
fs.writeFileSync(filePath, content);
console.log(`\n=== Done: ${fixCount} fixes applied to englishData.js ===`);

// -------------------------------------------------------
// ISSUE 20: Fix Q4 lesson mapping
// -------------------------------------------------------
const mapPath = path.join(__dirname, '..', 'public', 'english-question-lesson-map.json');
const lessonMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
if (lessonMap.punctuation) {
  const q4mapping = lessonMap.punctuation.find(e => e.questionId === 4);
  if (q4mapping && q4mapping.subConceptId === 'apostrophe-contraction') {
    q4mapping.subConceptId = 'apostrophe-possession';
    fs.writeFileSync(mapPath, JSON.stringify(lessonMap, null, 2));
    console.log('Fixed Q4 lesson mapping: apostrophe-contraction -> apostrophe-possession');
  }
}

console.log('\nRemaining issues to address separately:');
console.log('- Issue 13: Reduce 58 D1 contraction Qs to ~30, add varied D1 patterns');
console.log('- Issue 14: Answer position bias in D2 range (Q200-230)');
console.log('- Issue 21: Improve No Mistake question quality');
console.log('- Issue 22: Orphan sub-concept');

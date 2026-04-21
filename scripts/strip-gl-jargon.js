#!/usr/bin/env node
/**
 * strip-gl-jargon.js
 *
 * Removes "GL" jargon from all child-facing content. Children (and most
 * parents) don't know what GL means. Jacqui flagged this in Letter Codes Q99.
 * Ben's rule: no GL references in child-facing content. "11+" is fine.
 *
 * Skips: parentGuides.js (parent-facing context) and documentation files.
 *
 * Run: node scripts/strip-gl-jargon.js
 */

const fs = require('fs');
const path = require('path');

const TARGETS = [
  'src/questionData/englishData.js',
  'src/questionData/vrData.js',
  'src/questionData/mathsData.js',
  'src/questionData/mockComprehensionData.js',
  'src/questionData/mockVRConfig.js',
  'src/microLessons/lessonData.js',
  'src/microLessons/staging/compoundwords-subconcepts.js',
  'src/microLessons/staging/letterpairseries-subconcepts.js',
  'src/microLessons/staging/missingletterswords-subconcepts.js',
  'src/data/vrTips.js',
  'src/data/mathsTips.js'
  // NOT: parentGuides.js (parent-facing, may legitimately mention GL Assessment)
  // NOT: .md docs (not user-facing)
  // NOT: QuizScreen.js (the one ref is in a code comment, not UI text)
];

// Replacement rules — ordered by specificity (longer/more-specific first)
const RULES = [
  // Full sentence-ending phrases
  [/This type of question comes up regularly in GL papers\./g, 'This type of question comes up regularly in 11+ papers.'],
  [/This is a common GL trap/g, 'This is a common exam trap'],
  [/common GL trap/g, 'common exam trap'],
  [/favourite GL trap/g, 'favourite exam trap'],
  [/classic GL (question|questions)/g, 'classic 11+ $1'],
  [/comes up in GL papers/g, 'comes up in 11+ papers'],
  [/a favourite of GL/g, 'a favourite on the 11+'],
  [/GL Compound (Words )?(section|paper)/g, '11+ Compound Words $2'],
  [/in GL Assessment papers/g, 'in 11+ papers'],
  [/GL Assessment paper(s)?/g, '11+ paper$1'],
  [/GL Assessment tests?/g, '11+ tests'],
  [/GL Assessment/g, '11+ exam'],
  [/a GL favourite/g, 'an 11+ favourite'],
  [/GL loves/g, 'the 11+ often uses'],
  [/GL sometimes/g, 'the 11+ sometimes'],
  [/GL always/g, 'the 11+ always'],
  [/GL prints/g, '11+ papers print'],
  [/GL distinction/g, 'key distinction'],
  [/GL practice/g, '11+ practice'],
  [/GL gap/g, 'gap'],
  [/\bGL code\b/g, '11+ code'],
  [/\bGL test\b/g, '11+ test'],
  [/\bGL Tests\b/g, '11+ Tests'],
  [/\bGL paper\b/g, '11+ paper'],
  [/\bGL question(s)?\b/g, '11+ question$1'],
  [/\bGL trap\b/g, 'exam trap'],
  // Final sweep of any remaining bare "in GL"
  [/\bin GL\b/g, 'in the 11+']
];

let totalChanges = 0;

for (const target of TARGETS) {
  const full = path.resolve(__dirname, '..', target);
  if (!fs.existsSync(full)) {
    console.log(`SKIP (not found): ${target}`);
    continue;
  }
  const before = fs.readFileSync(full, 'utf8');
  let after = before;
  let changes = 0;
  for (const [re, to] of RULES) {
    const matched = after.match(re) || [];
    if (matched.length) {
      changes += matched.length;
      after = after.replace(re, to);
    }
  }
  if (after !== before) {
    fs.writeFileSync(full, after);
    console.log(`${target}: ${changes} replacements`);
    totalChanges += changes;
  } else {
    console.log(`${target}: no changes`);
  }
}

console.log(`\nTotal: ${totalChanges} GL replacements`);

// Verification: check for remaining bare "GL" tokens in touched files
console.log('\nRemaining GL references (should be zero or well-justified):');
for (const target of TARGETS) {
  const full = path.resolve(__dirname, '..', target);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  const matches = text.match(/\bGL\b/g) || [];
  if (matches.length) {
    console.log(`  ${target}: ${matches.length} remaining`);
  }
}

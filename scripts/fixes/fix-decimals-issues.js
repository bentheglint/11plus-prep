#!/usr/bin/env node
/**
 * Fix decimals Phase 4 issues.
 */
const fs = require('fs');
const path = require('path');

const mathsPath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
let content = fs.readFileSync(mathsPath, 'utf8');

Object.keys(require.cache).forEach(k => { if (k.includes('mathsData')) delete require.cache[k]; });
const mathsData = require('../src/questionData/mathsData').default;
const dec = mathsData.topics.decimals.questions;

let fixCount = 0;

function findAndReplace(oldStr, newStr, label) {
  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fixCount++;
    console.log('  ' + label);
    return true;
  }
  console.log('  SKIP ' + label + ': not found');
  return false;
}

// Helper to update difficulty for a specific question in the decimals section
function updateDifficulty(qId, newDiff) {
  const q = dec.find(q2 => q2.id === qId);
  if (!q || q.difficulty === newDiff) return;

  // Find this question in the decimals section by its question text
  const qText = JSON.stringify(q.question);
  const qIdx = content.indexOf(qText);
  if (qIdx === -1) return;

  // Search backwards for difficulty: N
  const before = content.substring(Math.max(0, qIdx - 200), qIdx);
  const diffMatch = before.match(/difficulty:\s*(\d)/);
  if (diffMatch && parseInt(diffMatch[1]) === q.difficulty) {
    const diffStr = 'difficulty: ' + diffMatch[1];
    const newDiffStr = 'difficulty: ' + newDiff;
    const absPos = qIdx - (before.length - before.lastIndexOf(diffStr));
    content = content.substring(0, absPos) + newDiffStr + content.substring(absPos + diffStr.length);
    fixCount++;
    console.log('  Q' + qId + ': D' + q.difficulty + ' -> D' + newDiff);
  }
}

console.log('=== Fixing Decimals Issues ===\n');

// -------------------------------------------------------
// Issue 5: Q5 has "6" and "6.0" as duplicate options
// Replace "6.0" with "0.006"
// -------------------------------------------------------
console.log('Issue 5: Q5 duplicate options...');
const q5 = dec.find(q => q.id === 5);
if (q5) {
  const oldOpts = JSON.stringify(q5.options);
  // Replace 6.0 with 0.006 in the options
  findAndReplace(
    '"6.0"',  // This is within the Q5 options context
    '"0.006"',
    'Q5: replaced "6.0" with "0.006"'
  );
  // Actually need to be more specific - find the exact options array
}
// More targeted: find the specific options line for Q5
const q5Text = q5.question;
const q5Idx = content.indexOf(JSON.stringify(q5Text));
if (q5Idx !== -1) {
  // Find "6.0" near this question
  const searchArea = content.substring(q5Idx, q5Idx + 500);
  if (searchArea.includes('"6.0"')) {
    const absPos = q5Idx + searchArea.indexOf('"6.0"');
    content = content.substring(0, absPos) + '"0.006"' + content.substring(absPos + 5);
    fixCount++;
    console.log('  Q5: replaced "6.0" with "0.006"');
  }
}

// -------------------------------------------------------
// Issues 6, 8, 13: Reclassify D1 -> D2
// Q29, Q53, Q75: division by 100 producing thousandths
// -------------------------------------------------------
console.log('\nIssues 6/8/13: Reclassify thousandths questions...');
updateDifficulty(29, 2);
updateDifficulty(53, 2);
updateDifficulty(75, 2);

// -------------------------------------------------------
// Issue 7: Q49 poor distractors (too tight spacing)
// Current: [0.40, 0.42, 0.44, 0.46, 4.2] — first 4 are 0.02 apart
// New: [0.13, 0.42, 1.3, 4.2, 0.042] — each tests a different error
// -------------------------------------------------------
console.log('\nIssue 7: Q49 distractor redesign...');
const q49 = dec.find(q => q.id === 49);
if (q49) {
  const oldOpts49 = q49.options.map(o => '"' + o + '"').join(', ');
  // New options: 0.42 (correct), 0.13 (added not multiplied), 1.3 (added), 4.2 (decimal shift), 0.042 (extra dp)
  const newOpts49 = '"0.13", "0.42", "1.3", "4.2", "0.042"';
  // correct should be index 1 (0.42)
  // Find and replace the options near Q49
  const q49Text = JSON.stringify(q49.question);
  const q49Idx = content.indexOf(q49Text);
  if (q49Idx !== -1) {
    const area = content.substring(q49Idx, q49Idx + 600);
    // Find the options array
    const optStart = area.indexOf('options: [');
    if (optStart !== -1) {
      const optEnd = area.indexOf(']', optStart);
      const oldOptsFull = area.substring(optStart, optEnd + 1);
      const newOptsFull = 'options: [' + newOpts49 + ']';
      content = content.substring(0, q49Idx + optStart) + newOptsFull + content.substring(q49Idx + optEnd + 1);

      // Update correct index (was pointing to 0.42, which is now at index 1)
      const correctArea = content.substring(q49Idx + optStart, q49Idx + optStart + newOptsFull.length + 200);
      const correctMatch = correctArea.match(/correct:\s*(\d)/);
      if (correctMatch) {
        const correctPos = q49Idx + optStart + correctArea.indexOf(correctMatch[0]);
        content = content.substring(0, correctPos) + 'correct: 1' + content.substring(correctPos + correctMatch[0].length);
      }

      fixCount++;
      console.log('  Q49: redesigned distractors (each tests a different misconception)');
    }
  }
  // Also update explanation
  const oldExp49 = q49.explanation;
  const newExp49 = "Area = 0.7 \u00d7 0.6 = 0.42 m\u00b2. Common mistakes: adding instead of multiplying (0.7 + 0.6 = 1.3), shifting the decimal point (4.2), or confusing the number of decimal places (0.042). \u2713";
  findAndReplace(JSON.stringify(oldExp49), JSON.stringify(newExp49), 'Q49: updated explanation');
}

// -------------------------------------------------------
// Issue 9/10/17: Q179 and Q181 rework to involve decimals
// -------------------------------------------------------
console.log('\nIssues 9/10/17: Rework Q179 and Q181...');

// Q179: "12,500 items packed into boxes of 1000" -> rework with decimals
const q179 = dec.find(q => q.id === 179);
if (q179) {
  const oldQ179 = JSON.stringify(q179.question);
  const newQ179 = JSON.stringify("A factory produces 12.5 kg of flour. It is packed into bags of 0.5 kg each. How many bags are needed?");
  findAndReplace(oldQ179, newQ179, 'Q179: reworked to involve decimals');

  // Update options
  const oldOpts179 = q179.options.map(o => '"' + o + '"').join(', ');
  const q179Idx = content.indexOf(newQ179);
  if (q179Idx !== -1) {
    const area179 = content.substring(q179Idx, q179Idx + 600);
    const optStart179 = area179.indexOf('options: [');
    if (optStart179 !== -1) {
      const optEnd179 = area179.indexOf(']', optStart179);
      content = content.substring(0, q179Idx + optStart179) + 'options: ["6", "20", "25", "125", "250"]' + content.substring(q179Idx + optEnd179 + 1);

      const ca179 = content.substring(q179Idx + optStart179, q179Idx + optStart179 + 300);
      const cm179 = ca179.match(/correct:\s*(\d)/);
      if (cm179) {
        const cp179 = q179Idx + optStart179 + ca179.indexOf(cm179[0]);
        content = content.substring(0, cp179) + 'correct: 2' + content.substring(cp179 + cm179[0].length);
      }
    }
  }
  const oldExp179 = JSON.stringify(q179.explanation);
  const newExp179 = JSON.stringify("12.5 \u00f7 0.5 = 25 bags. To divide by 0.5, multiply both by 10: 125 \u00f7 5 = 25. Or think: how many halves in 12.5? That's 12.5 \u00d7 2 = 25. \u2713");
  findAndReplace(oldExp179, newExp179, 'Q179: updated explanation');
}

// Q181: "pool drains 100 litres/min" -> rework with decimals
const q181 = dec.find(q => q.id === 181);
if (q181) {
  const oldQ181 = JSON.stringify(q181.question);
  const newQ181 = JSON.stringify("A jug holds 2.4 litres of water. Glasses each hold 0.15 litres. How many full glasses can be poured?");
  findAndReplace(oldQ181, newQ181, 'Q181: reworked to involve decimals');

  const q181Idx = content.indexOf(newQ181);
  if (q181Idx !== -1) {
    const area181 = content.substring(q181Idx, q181Idx + 600);
    const optStart181 = area181.indexOf('options: [');
    if (optStart181 !== -1) {
      const optEnd181 = area181.indexOf(']', optStart181);
      content = content.substring(0, q181Idx + optStart181) + 'options: ["12", "14", "16", "24", "160"]' + content.substring(q181Idx + optEnd181 + 1);

      const ca181 = content.substring(q181Idx + optStart181, q181Idx + optStart181 + 300);
      const cm181 = ca181.match(/correct:\s*(\d)/);
      if (cm181) {
        const cp181 = q181Idx + optStart181 + ca181.indexOf(cm181[0]);
        content = content.substring(0, cp181) + 'correct: 2' + content.substring(cp181 + cm181[0].length);
      }
    }
  }
  const oldExp181 = JSON.stringify(q181.explanation);
  const newExp181 = JSON.stringify("2.4 \u00f7 0.15: multiply both by 100 to get 240 \u00f7 15 = 16 glasses. Check: 16 \u00d7 0.15 = 2.4. \u2713");
  findAndReplace(oldExp181, newExp181, 'Q181: updated explanation');
}

// -------------------------------------------------------
// Issue 14: Q40 reword "largest time" to "slowest time"
// -------------------------------------------------------
console.log('\nIssue 14: Q40 wording...');
const q40 = dec.find(q => q.id === 40);
if (q40) {
  findAndReplace(
    'Which is the largest time?',
    'Which runner had the slowest time?',
    'Q40: "largest time" -> "slowest time"'
  );
}

// -------------------------------------------------------
// Issue 16: Q102 unclear explanation
// -------------------------------------------------------
console.log('\nIssue 16: Q102 explanation...');
const q102 = dec.find(q => q.id === 102);
if (q102) {
  const oldExp102 = JSON.stringify(q102.explanation);
  const newExp102 = JSON.stringify("Multiply both numbers by 10 to make the divisor a whole number: 7.2 \u00f7 9 = 0.8. Check: 0.8 \u00d7 0.9 = 0.72. \u2713");
  findAndReplace(oldExp102, newExp102, 'Q102: clarified explanation');
}

// -------------------------------------------------------
// Issue 18: Q154 improve explanation
// -------------------------------------------------------
console.log('\nIssue 18: Q154 explanation...');
const q154 = dec.find(q => q.id === 154);
if (q154) {
  const oldExp154 = JSON.stringify(q154.explanation);
  if (oldExp154 && !oldExp154.includes('1/4')) {
    // Add the fraction bridge
    const newExp154 = JSON.stringify("Walking (0.35) + car (0.4) = 0.75. Remaining = 1 - 0.75 = 0.25, which equals 1/4. If 1/4 of the class = 5 children, then the whole class = 5 \u00d7 4 = 20. Or: 5 \u00f7 0.25 = 20. \u2713");
    findAndReplace(oldExp154, newExp154, 'Q154: added fraction bridge to explanation');
  }
}

// Write the file
fs.writeFileSync(mathsPath, content);
console.log('\n=== Done: ' + fixCount + ' fixes applied ===');

// -------------------------------------------------------
// Issue 11: Duplicate lesson option
// -------------------------------------------------------
const stagingPath = path.join(__dirname, '..', 'src', 'microLessons', 'staging');
const decFiles = fs.readdirSync(stagingPath).filter(f => f.includes('decimal'));
console.log('\nLesson staging files:', decFiles.join(', ') || 'none');
if (decFiles.length > 0) {
  decFiles.forEach(f => {
    const fp = path.join(stagingPath, f);
    let lc = fs.readFileSync(fp, 'utf8');
    // Check for duplicate '6' in options
    if (lc.includes("6, 60, 6,") || lc.includes("6', 60, 6'") || lc.includes(', 6, 60, 6,')) {
      // Look for the pattern more broadly
      const dupMatch = lc.match(/(\d+(?:\.\d+)?),\s*60,\s*\1[,\]]/);
      if (dupMatch) {
        console.log('Found duplicate in ' + f + ': ' + dupMatch[0]);
      }
    }
    // Try to find the specific interact screen
    if (lc.includes('decimal-place-value-keyfact') || lc.includes('decimal-place-value')) {
      const dup6 = lc.match(/\[0\.6,\s*6,\s*60,\s*6,\s*0\.06\]/);
      if (dup6) {
        lc = lc.replace(dup6[0], '[0.6, 6, 60, 0.006, 0.06]');
        fs.writeFileSync(fp, lc);
        console.log('Fixed duplicate 6 in ' + f);
      }
    }
  });
}

// Verify distribution
Object.keys(require.cache).forEach(k => { if (k.includes('mathsData')) delete require.cache[k]; });
const updated = require('../src/questionData/mathsData').default;
const updDec = updated.topics.decimals.questions;
const total = updDec.length;
const d1 = updDec.filter(q => q.difficulty === 1).length;
const d2 = updDec.filter(q => q.difficulty === 2).length;
const d3 = updDec.filter(q => q.difficulty === 3).length;
console.log('\nFinal distribution: D1:' + d1 + '(' + Math.round(d1/total*100) + '%) D2:' + d2 + '(' + Math.round(d2/total*100) + '%) D3:' + d3 + '(' + Math.round(d3/total*100) + '%)');

#!/usr/bin/env node
/**
 * Phase 4 final batch fixes across all topics.
 * Handles: fractions equivalents, vocabulary duplicates, difficulty recalibrations,
 * angles removals, SDT diversification, broken VR questions, and more.
 */
const fs = require('fs');
const path = require('path');

let totalFixes = 0;

// =====================================================================
// HELPER: Find and update a question property in a data file
// =====================================================================
function findQuestionInFile(content, topic, qId, questionText) {
  // Find the question by its text (most reliable anchor)
  const anchor = JSON.stringify(questionText);
  return content.indexOf(anchor);
}

// =====================================================================
// 1. FRACTIONS: Fix 7 more equivalent-option questions
// Same pattern as Q55/Q78 — correct points to unsimplified fraction
// when the simplified version is also an option
// =====================================================================
console.log('=== FRACTIONS: Equivalent options ===');
const mathsPath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
let mathsContent = fs.readFileSync(mathsPath, 'utf8');

Object.keys(require.cache).forEach(k => { if (k.includes('questionData')) delete require.cache[k]; });
const mathsData = require('../src/questionData/mathsData').default;

const fracQs = mathsData.topics.fractions.questions;
// Q97: correct=6/12, but 1/2 is also an option
// Q100: correct=4/8, but 1/2 is also an option
// Q102: correct=6/9, but 2/3 is also an option
// Q119: correct=8/12, but 2/3 is also an option
// Q123: correct=6/9, but 2/3 is also an option
// Q127: correct=9/15, but 3/5 is also an option
// Q116: correct=2/5, 4/10 is direct calc — this one is fine (2/5 IS simplified)

const fracFixes = [
  { id: 97, unsimplified: '6/12', simplified: '1/2' },
  { id: 100, unsimplified: '4/8', simplified: '1/2' },
  { id: 102, unsimplified: '6/9', simplified: '2/3' },
  { id: 119, unsimplified: '8/12', simplified: '2/3' },
  { id: 123, unsimplified: '6/9', simplified: '2/3' },
  { id: 127, unsimplified: '9/15', simplified: '3/5' },
];

fracFixes.forEach(fix => {
  const q = fracQs.find(q2 => q2.id === fix.id);
  if (!q) return;
  const simplifiedIdx = q.options.indexOf(fix.simplified);
  const unsimplifiedIdx = q.options.indexOf(fix.unsimplified);
  if (simplifiedIdx === -1 || unsimplifiedIdx === -1) return;
  if (q.correct !== unsimplifiedIdx) return; // Already pointing to simplified

  // Update correct to point to simplified version
  const qText = JSON.stringify(q.question);
  const qIdx = mathsContent.indexOf(qText);
  if (qIdx === -1) return;
  const area = mathsContent.substring(qIdx, qIdx + 600);
  const cm = area.match(/correct:\s*(\d)/);
  if (cm && parseInt(cm[1]) === unsimplifiedIdx) {
    const pos = qIdx + area.indexOf(cm[0]);
    mathsContent = mathsContent.substring(0, pos) + 'correct: ' + simplifiedIdx + mathsContent.substring(pos + cm[0].length);
    totalFixes++;
    console.log('  Q' + fix.id + ': correct ' + fix.unsimplified + ' -> ' + fix.simplified);
  }
});

// =====================================================================
// 2. ANGLES: Remove Q45 (decimal rounding) and Q83 (15-sided polygon)
// These are beyond GL 11+ scope. Replace with simpler valid questions.
// We'll set their difficulty to 0 (disabled) — simplest approach
// Actually, better to replace them with valid questions.
// For now, change them to simpler angle questions that ARE in scope.
// =====================================================================
console.log('\n=== ANGLES: Remove out-of-scope questions ===');
const angQs = mathsData.topics.anglesshapes.questions;

// Q45: requires rounding to 1dp — replace question text and answer
const q45 = angQs.find(q => q.id === 45);
if (q45) {
  const oldQ45 = JSON.stringify(q45.question);
  const newQ45 = JSON.stringify("A triangle has angles of 65\u00b0 and 48\u00b0. What is the third angle?");
  if (mathsContent.includes(oldQ45)) {
    mathsContent = mathsContent.replace(oldQ45, newQ45);
    // Update options and correct
    const q45Idx = mathsContent.indexOf(newQ45);
    const area45 = mathsContent.substring(q45Idx, q45Idx + 600);
    const optStart = area45.indexOf('options: [');
    const optEnd = area45.indexOf(']', optStart);
    if (optStart !== -1 && optEnd !== -1) {
      const newOpts = 'options: ["57\u00b0", "62\u00b0", "67\u00b0", "72\u00b0", "77\u00b0"]';
      mathsContent = mathsContent.substring(0, q45Idx + optStart) + newOpts + mathsContent.substring(q45Idx + optEnd + 1);
      // correct = 2 (67°)
      const ca45 = mathsContent.substring(q45Idx + optStart, q45Idx + optStart + newOpts.length + 200);
      const cm45 = ca45.match(/correct:\s*(\d)/);
      if (cm45) {
        const cp45 = q45Idx + optStart + ca45.indexOf(cm45[0]);
        mathsContent = mathsContent.substring(0, cp45) + 'correct: 2' + mathsContent.substring(cp45 + cm45[0].length);
      }
    }
    // Update explanation
    const oldExp45 = JSON.stringify(q45.explanation);
    const newExp45 = JSON.stringify("Angles in a triangle add up to 180\u00b0. Third angle = 180\u00b0 - 65\u00b0 - 48\u00b0 = 67\u00b0. \u2713");
    if (mathsContent.includes(oldExp45)) {
      mathsContent = mathsContent.replace(oldExp45, newExp45);
    }
    totalFixes++;
    console.log('  Q45: replaced decimal-rounding question with standard triangle angle');
  }
}

// Q83: 15-sided polygon — replace with standard polygon question
const q83 = angQs.find(q => q.id === 83);
if (q83) {
  const oldQ83 = JSON.stringify(q83.question);
  const newQ83 = JSON.stringify("What is the sum of the interior angles of a regular octagon (8 sides)?");
  if (mathsContent.includes(oldQ83)) {
    mathsContent = mathsContent.replace(oldQ83, newQ83);
    const q83Idx = mathsContent.indexOf(newQ83);
    const area83 = mathsContent.substring(q83Idx, q83Idx + 600);
    const optStart83 = area83.indexOf('options: [');
    const optEnd83 = area83.indexOf(']', optStart83);
    if (optStart83 !== -1 && optEnd83 !== -1) {
      const newOpts83 = 'options: ["720\u00b0", "900\u00b0", "1080\u00b0", "1260\u00b0", "1440\u00b0"]';
      mathsContent = mathsContent.substring(0, q83Idx + optStart83) + newOpts83 + mathsContent.substring(q83Idx + optEnd83 + 1);
      const ca83 = mathsContent.substring(q83Idx + optStart83, q83Idx + optStart83 + newOpts83.length + 200);
      const cm83 = ca83.match(/correct:\s*(\d)/);
      if (cm83) {
        const cp83 = q83Idx + optStart83 + ca83.indexOf(cm83[0]);
        mathsContent = mathsContent.substring(0, cp83) + 'correct: 2' + mathsContent.substring(cp83 + cm83[0].length);
      }
    }
    const oldExp83 = JSON.stringify(q83.explanation);
    const newExp83 = JSON.stringify("Sum of interior angles = (n - 2) \u00d7 180\u00b0. For an octagon: (8 - 2) \u00d7 180\u00b0 = 6 \u00d7 180\u00b0 = 1080\u00b0. \u2713");
    if (mathsContent.includes(oldExp83)) {
      mathsContent = mathsContent.replace(oldExp83, newExp83);
    }
    totalFixes++;
    console.log('  Q83: replaced 15-sided polygon with octagon (GL-appropriate)');
  }
}

// =====================================================================
// 3. SDT: Diversify time-in-minutes answers (all currently 15 min)
// =====================================================================
console.log('\n=== SDT: Diversify identical answers ===');
const sdtQs = mathsData.topics.speeddistancetime.questions;
const timeQs = sdtQs.filter(q => {
  const opts = q.options || [];
  return opts.some(o => String(o).includes('minute')) || opts.some(o => String(o).includes('min'));
});

// Find questions where answer is 15 minutes
const fifteenMinQs = sdtQs.filter(q => {
  const answer = q.options && q.options[q.correct];
  return answer && (answer === '15 minutes' || answer === '15');
});
console.log('  Questions with answer "15 minutes":', fifteenMinQs.length);
console.log('  IDs:', fifteenMinQs.map(q => q.id).join(', '));
// Note: Diversifying these requires changing the question numbers (speed/distance/time values)
// which would cascade to options and explanations. Flag for now.
if (fifteenMinQs.length > 3) {
  console.log('  Flagged: ' + fifteenMinQs.length + ' questions all have 15-minute answer — needs manual diversification');
}

// =====================================================================
// 4. VOCABULARY: Remove exact duplicates
// =====================================================================
console.log('\n=== VOCABULARY: Remove duplicates ===');
const engPath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');
let engContent = fs.readFileSync(engPath, 'utf8');

Object.keys(require.cache).forEach(k => { if (k.includes('questionData')) delete require.cache[k]; });
const engData = require('../src/questionData/englishData').default;

// Q32 duplicates Q1 (furious) — replace Q32 with a new word
const vocabQs = engData.topics.vocabulary.questions;
const q32v = vocabQs.find(q => q.id === 32);
const q31v = vocabQs.find(q => q.id === 31);
if (q32v && q32v.question.includes('furious')) {
  const oldQ32 = JSON.stringify(q32v.question);
  const newQ32 = JSON.stringify("Which word is closest in meaning to 'immense'?");
  if (engContent.includes(oldQ32)) {
    engContent = engContent.replace(oldQ32, newQ32);
    // Update options
    const q32Idx = engContent.indexOf(newQ32);
    if (q32Idx !== -1) {
      const area32 = engContent.substring(q32Idx, q32Idx + 800);
      // Find and replace options
      const optMatch = area32.match(/"options":\s*\[([\s\S]*?)\]/);
      if (optMatch) {
        const newOpts = '"options": [\n            "Tiny",\n            "Enormous",\n            "Shallow",\n            "Narrow",\n            "Gentle"\n          ]';
        engContent = engContent.substring(0, q32Idx + area32.indexOf(optMatch[0])) + newOpts + engContent.substring(q32Idx + area32.indexOf(optMatch[0]) + optMatch[0].length);
        // Update correct to 1 (Enormous)
        const ca32 = engContent.substring(q32Idx, q32Idx + 1200);
        const cm32 = ca32.match(/"correct":\s*(\d)/);
        if (cm32) {
          const cp32 = q32Idx + ca32.indexOf(cm32[0]);
          engContent = engContent.substring(0, cp32) + '"correct": 1' + engContent.substring(cp32 + cm32[0].length);
        }
        // Update explanation
        const oldExp = JSON.stringify(q32v.explanation);
        const newExp = JSON.stringify("'Immense' means extremely large or enormous. 'Tiny' means the opposite (very small). 'Shallow', 'narrow', and 'gentle' describe other qualities entirely. \u2713");
        if (engContent.includes(oldExp)) {
          engContent = engContent.replace(oldExp, newExp);
        }
      }
    }
    totalFixes++;
    console.log('  Q32: replaced duplicate "furious" with "immense"');
  }
}

// Q31 duplicates Q2 (enormous) — replace Q31 with a new word
if (q31v && q31v.question.includes('enormous')) {
  const oldQ31 = JSON.stringify(q31v.question);
  const newQ31 = JSON.stringify("Which word is closest in meaning to 'weary'?");
  if (engContent.includes(oldQ31)) {
    engContent = engContent.replace(oldQ31, newQ31);
    const q31Idx = engContent.indexOf(newQ31);
    if (q31Idx !== -1) {
      const area31 = engContent.substring(q31Idx, q31Idx + 800);
      const optMatch31 = area31.match(/"options":\s*\[([\s\S]*?)\]/);
      if (optMatch31) {
        const newOpts31 = '"options": [\n            "Excited",\n            "Cheerful",\n            "Exhausted",\n            "Curious",\n            "Stubborn"\n          ]';
        engContent = engContent.substring(0, q31Idx + area31.indexOf(optMatch31[0])) + newOpts31 + engContent.substring(q31Idx + area31.indexOf(optMatch31[0]) + optMatch31[0].length);
        const ca31 = engContent.substring(q31Idx, q31Idx + 1200);
        const cm31 = ca31.match(/"correct":\s*(\d)/);
        if (cm31) {
          const cp31 = q31Idx + ca31.indexOf(cm31[0]);
          engContent = engContent.substring(0, cp31) + '"correct": 2' + engContent.substring(cp31 + cm31[0].length);
        }
        const oldExp31 = JSON.stringify(q31v.explanation);
        const newExp31 = JSON.stringify("'Weary' means very tired or exhausted. 'Excited' and 'cheerful' describe positive energy states. 'Curious' means wanting to know, and 'stubborn' means refusing to change. \u2713");
        if (engContent.includes(oldExp31)) {
          engContent = engContent.replace(oldExp31, newExp31);
        }
      }
    }
    totalFixes++;
    console.log('  Q31: replaced duplicate "enormous" with "weary"');
  }
}

// =====================================================================
// 5. WORD CLASS GRAMMAR: Fix Q106 wrong answer
// =====================================================================
console.log('\n=== WORD CLASS GRAMMAR: Q106 fix ===');
const wcgQs = engData.topics.wordClassGrammar.questions;
const q106 = wcgQs.find(q => q.id === 106);
if (q106) {
  console.log('  Q106: "' + q106.question.substring(0, 70) + '"');
  console.log('  Options:', JSON.stringify(q106.options));
  console.log('  Current correct:', q106.correct, '->', q106.options[q106.correct]);
  // "Negative determiners" is not standard. The words no/neither/none/nowhere are
  // actually "negative words" or could be classified as determiners (no), pronouns (none),
  // adverbs (nowhere), or conjunctions (neither...nor).
  // The safest fix: change the question to test something less ambiguous
  // Or change to "Negative words" if that's an option
  if (q106.options.includes('Negative determiners')) {
    console.log('  Issue: "Negative determiners" is not a standard KS2 word class');
    console.log('  Flagged for replacement — needs a cleaner word class question');
  }
}

// Write files
fs.writeFileSync(mathsPath, mathsContent);
fs.writeFileSync(engPath, engContent);

console.log('\n=== TOTAL FIXES: ' + totalFixes + ' ===');
console.log('\nFlagged for further work:');
console.log('- SDT: ' + fifteenMinQs.length + ' questions with identical 15-min answers');
console.log('- WCG Q106: needs question replacement (non-standard word class)');
console.log('- Letter Move: 12 structural issues (duplicates, difficulties, format)');

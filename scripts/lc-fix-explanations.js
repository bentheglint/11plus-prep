#!/usr/bin/env node
/**
 * Letter Codes — Fix ALL explanations
 * 1. Add teaching tips to short/bare explanations
 * 2. Ensure consistent format: show the working, then a tip
 * 3. Target: avg 120+ chars, every explanation has a learning point
 */

const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

// Teaching tips to append based on shift type
const shiftTips = {
  '+1': "Tip: +1 is the most common GL code — practise it until it's automatic!",
  '-1': "Tip: Going backwards by 1 is the reverse of +1 — if you can do one, you can do the other!",
  '+2': "Tip: For +2, skip one letter each time. B+2=D, skipping C.",
  '-2': "Tip: For -2, count back two letters each time. Use the alphabet line to help!",
  '+3': "Tip: For bigger shifts like +3, use the EJOTY trick (E=5, J=10, O=15, T=20, Y=25) as anchor points.",
  '-3': "Tip: For -3, count back three places. Watch out for wrap-around near A!",
  '+4': "Tip: Larger shifts are trickier — write the alphabet out and count carefully. Don't rush!",
  '-4': "Tip: With -4, letters near the start of the alphabet will wrap around past A to the end (A-4=W).",
  '+5': "Tip: The bigger the shift, the more important it is to check every letter carefully.",
  '-5': "Tip: Big backward shifts often cause wrap-around. Always double-check near A!",
  'variable': "Tip: When the shift changes each position, write the pattern above the letters. Look for +1,+2,+3,+4 or similar sequences.",
  'mirror': "Tip: In mirror codes, A=Z, B=Y, C=X and so on. The trick is that encoding and decoding use exactly the same rule!",
  'wrap': "Tip: Think of the alphabet as a circle — after Z comes A again, and before A comes Z. Count carefully at the boundaries!",
  'general': "Tip: Always work out the rule from the example first, then apply it letter by letter to the new word."
};

// Find the letterCodes section
const lcStart = content.indexOf('letterCodes');
const lpStart = content.indexOf('letterPairSeries');
const before = content.substring(0, lcStart);
const section = content.substring(lcStart, lpStart);
const after = content.substring(lpStart);

// Find all explanations and enhance them
let enhanced = 0;
let newSection = section;

// Match explanation patterns and enhance short ones
const explPattern = /"explanation":\s*"([^"]+)"/g;
let match;
const replacements = [];

// Reset lastIndex
explPattern.lastIndex = 0;
while ((match = explPattern.exec(section)) !== null) {
  const original = match[1];
  const fullMatch = match[0];
  const pos = match.index;

  // Skip if already long enough and has a tip
  if (original.length >= 110 && original.toLowerCase().match(/tip:|remember|trick|helpful|think of/)) continue;

  let improved = original;

  // Determine what type of question this is from the explanation
  const expl = original.toLowerCase();
  let tipKey = 'general';

  if (expl.includes('mirror')) {
    tipKey = 'mirror';
  } else if (expl.includes('wrap')) {
    tipKey = 'wrap';
  } else if (expl.includes('shifts') && (expl.includes(',') || expl.includes('position'))) {
    tipKey = 'variable';
  } else {
    // Try to extract the shift amount
    const shiftM = original.match(/([+-]\d+)/);
    if (shiftM && shiftTips[shiftM[1]]) {
      tipKey = shiftM[1];
    }
    // Check for wrap-around indicators
    if (expl.match(/[xyz].*[abc]|past z|past a|loop|wrap/i)) {
      tipKey = 'wrap';
    }
  }

  // Only add tip if explanation doesn't already have one
  if (!expl.match(/tip:|remember|trick|helpful|think of|hint/)) {
    // Clean up the checkmark and add tip before it
    if (improved.endsWith(' ✓')) {
      improved = improved.slice(0, -2) + ' ' + shiftTips[tipKey] + ' ✓';
    } else if (improved.endsWith('✓')) {
      improved = improved.slice(0, -1) + ' ' + shiftTips[tipKey] + ' ✓';
    } else {
      improved = improved + ' ' + shiftTips[tipKey] + ' ✓';
    }
    enhanced++;
  }

  // Also enhance very short mirror explanations like "Mirror: H=S, E=V, L=O, P=K = SVOK. ✓"
  if (original.length < 60 && expl.includes('mirror')) {
    const wordM = original.match(/= ([A-Z]+)\./);
    if (wordM) {
      improved = original.replace(' ✓', '') + ' In mirror codes, each letter maps to its opposite in the alphabet — A↔Z, B↔Y, C↔X and so on. The brilliant thing is: to decode, you apply exactly the same mirror! ' + shiftTips['mirror'] + ' ✓';
      enhanced++;
    }
  }

  // Enhance very short shift explanations
  if (original.length < 60 && !expl.includes('mirror')) {
    const parts = original.match(/([A-Z])([+-]\d+)=([A-Z])/g);
    if (parts && parts.length >= 2) {
      const shiftM = original.match(/([+-]\d+)/);
      const shift = shiftM ? shiftM[1] : '';
      improved = original.replace(' ✓', '') + ' Each letter in the word shifts by ' + shift + ' positions in the alphabet. ' + (shiftTips[shift] || shiftTips['general']) + ' ✓';
      enhanced++;
    }
  }

  if (improved !== original) {
    replacements.push({ original: fullMatch, replacement: '"explanation": "' + improved + '"' });
  }
}

console.log('Explanations to enhance:', replacements.length);

// Apply replacements (in reverse order to preserve positions)
replacements.reverse().forEach(r => {
  newSection = newSection.replace(r.original, r.replacement);
});

// Verify
const newExpls = [...newSection.matchAll(/"explanation":\s*"([^"]+)"/g)].map(m => m[1]);
const avgLen = Math.round(newExpls.reduce((s, e) => s + e.length, 0) / newExpls.length);
const shortCount = newExpls.filter(e => e.length < 80).length;
const hasTip = newExpls.filter(e => e.toLowerCase().match(/tip:|remember|trick|helpful|think of/)).length;

console.log('\nAfter enhancement:');
console.log('  Avg length:', avgLen, '(was 74)');
console.log('  Under 80 chars:', shortCount, '(was 122)');
console.log('  Has tip/mnemonic:', hasTip, '/ ' + newExpls.length);

// Write
content = before + newSection + after;
fs.writeFileSync(VR_DATA, content, 'utf8');
console.log('\nWritten ✓');

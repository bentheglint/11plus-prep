#!/usr/bin/env node
/**
 * Letter Codes Audit Fix Script
 * 1. Create ~41 new questions: variable shifts, wrap-around, mirror codes, larger shifts
 * 2. Fill under-threshold groups (variable-shift: 4→15, wrap-around: 3→15)
 * 3. Update mapping
 * 4. Validate all answers programmatically
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VR_DATA = path.join(ROOT, 'src/questionData/vrData.js');
const MAPPING_FILE = path.join(ROOT, 'public/vr-question-lesson-map.json');

// ============================================================
// HELPER: Apply shift to a letter
// ============================================================
function shiftLetter(letter, shift) {
  const code = letter.toUpperCase().charCodeAt(0) - 65;
  return String.fromCharCode(((code + shift % 26 + 26) % 26) + 65);
}

function encodeWord(word, shifts) {
  if (typeof shifts === 'number') {
    return word.split('').map(c => shiftLetter(c, shifts)).join('');
  }
  return word.split('').map((c, i) => shiftLetter(c, shifts[i])).join('');
}

function decodeWord(code, shifts) {
  if (typeof shifts === 'number') {
    return code.split('').map(c => shiftLetter(c, -shifts)).join('');
  }
  return code.split('').map((c, i) => shiftLetter(c, -shifts[i])).join('');
}

function mirrorLetter(letter) {
  const code = letter.toUpperCase().charCodeAt(0) - 65;
  return String.fromCharCode((25 - code) + 65);
}

function mirrorWord(word) {
  return word.split('').map(c => mirrorLetter(c)).join('');
}

// ============================================================
// BUILD QUESTIONS WITH PROGRAMMATIC VERIFICATION
// ============================================================

const newQuestions = [];
let errors = 0;

function addQ(id, diff, question, options, correctIdx, explanation, subConcept) {
  if (correctIdx < 0 || correctIdx >= options.length) {
    console.log('ERROR Q' + id + ': bad correct index ' + correctIdx);
    errors++;
    return;
  }
  newQuestions.push({ id, difficulty: diff, questionType: 'letter-codes', question, options, correct: correctIdx, explanation, _subConcept: subConcept });
}

// ---- VARIABLE/PROGRESSIVE SHIFT: 11 new (Q126-Q136) ----

// Q126 D2: Progressive shift +1,+2,+3,+4 on FISH
const q126code = encodeWord('FISH', [1,2,3,4]);
const q126opts = [q126code, encodeWord('FISH', [1,2,3,3]), encodeWord('FISH', [2,2,3,4]), encodeWord('FISH', [1,2,2,4]), encodeWord('FISH', [1,1,3,4])];
addQ(126, 2,
  "If DRAW is coded as " + encodeWord('DRAW', [1,2,3,4]) + " (each letter shifts by +1, +2, +3, +4), what is the code for FISH?",
  q126opts, 0,
  "The shift increases by 1 each position: +1, +2, +3, +4. F+1=G, I+2=K, S+3=V, H+4=L = " + q126code + ". ✓",
  'variable-shift');

// Q127 D2: Progressive shift -1,-2,-3,-4 on HELP
const q127word = 'HELP';
const q127shifts = [-1,-2,-3,-4];
const q127code = encodeWord(q127word, q127shifts);
addQ(127, 2,
  "If BARK is coded as " + encodeWord('BARK', q127shifts) + " (shifts of -1, -2, -3, -4), what is the code for " + q127word + "?",
  [q127code, encodeWord(q127word, [-1,-2,-3,-3]), encodeWord(q127word, [-2,-2,-3,-4]), encodeWord(q127word, [-1,-1,-3,-4]), encodeWord(q127word, [-1,-2,-2,-4])],
  0,
  "Each position shifts by one more: -1, -2, -3, -4. H-1=G, E-2=C, L-3=I, P-4=L = " + q127code + ". ✓",
  'variable-shift');

// Q128 D3: Progressive +2,+3,+4,+5 DECODE
const q128word = 'LAND';
const q128shifts = [2,3,4,5];
const q128code = encodeWord(q128word, q128shifts);
addQ(128, 3,
  "If CART is coded as " + encodeWord('CART', q128shifts) + " (shifts of +2, +3, +4, +5), what word is coded as " + q128code + "?",
  [q128word, 'LANE', 'LAMP', 'LARD', 'LAST'],
  0,
  "Reverse the shifts: " + q128code[0] + "-2=" + q128word[0] + ", " + q128code[1] + "-3=" + q128word[1] + ", " + q128code[2] + "-4=" + q128word[2] + ", " + q128code[3] + "-5=" + q128word[3] + " = " + q128word + ". ✓",
  'variable-shift');

// Q129 D3: Progressive -1,-2,-3,-4,-5 on 5-letter word
const q129word = 'STONE';
const q129shifts = [-1,-2,-3,-4,-5];
const q129code = encodeWord(q129word, q129shifts);
addQ(129, 3,
  "If DRAWN is coded as " + encodeWord('DRAWN', q129shifts) + " (shifts of -1, -2, -3, -4, -5), what is the code for " + q129word + "?",
  [q129code, encodeWord(q129word, [-1,-2,-3,-4,-4]), encodeWord(q129word, [-1,-2,-3,-3,-5]), encodeWord(q129word, [-2,-2,-3,-4,-5]), encodeWord(q129word, [-1,-2,-4,-4,-5])],
  0,
  "Each position shifts by one more: -1, -2, -3, -4, -5. " + q129word.split('').map((c,i) => c + (q129shifts[i]>0?'+':'') + q129shifts[i] + '=' + shiftLetter(c, q129shifts[i])).join(', ') + " = " + q129code + ". ✓",
  'variable-shift');

// Q130 D3: Alternating +1,-1,+1,-1
const q130word = 'BOOK';
const q130shifts = [1,-1,1,-1];
const q130code = encodeWord(q130word, q130shifts);
addQ(130, 3,
  "If GAME is coded as " + encodeWord('GAME', q130shifts) + " (shifts alternate +1, -1, +1, -1), what is the code for " + q130word + "?",
  [q130code, encodeWord(q130word, [1,1,1,1]), encodeWord(q130word, [-1,1,-1,1]), encodeWord(q130word, [1,-1,-1,1]), encodeWord(q130word, [2,-2,2,-2])],
  0,
  "Alternating pattern: +1, -1, +1, -1. " + q130word.split('').map((c,i) => c + (q130shifts[i]>0?'+':'') + q130shifts[i] + '=' + shiftLetter(c, q130shifts[i])).join(', ') + " = " + q130code + ". ✓",
  'variable-shift');

// Q131-Q136: More variable shift questions
const varShiftQs = [
  [131, 2, 'MILK', [1,2,3,4], 'COLD', 'a warm drink ingredient'],
  [132, 3, 'PIANO', [1,2,3,4,5], 'TRAIN', 'a musical instrument'],
  [133, 3, 'HOUSE', [-2,-3,-4,-5,-6], 'RIVER', 'a building to live in'],
  [134, 2, 'RING', [2,1,2,1], 'BELL', 'a piece of jewellery'],
  [135, 3, 'QUEEN', [-1,-2,-3,-4,-5], 'KINGS', 'a female ruler'],
  [136, 3, 'BEACH', [3,2,1,3,2], 'HORSE', 'a sandy shore'],
];

varShiftQs.forEach(([id, diff, word, shifts, exampleWord, clue]) => {
  const code = encodeWord(word, shifts);
  const exCode = encodeWord(exampleWord, shifts);
  const shiftStr = shifts.map(s => (s>0?'+':'')+s).join(', ');

  // Generate distractors by tweaking one letter each
  const distract = [];
  for (let i = 0; i < 4; i++) {
    const tweaked = code.split('');
    tweaked[i % code.length] = shiftLetter(tweaked[i % code.length], (i % 2 === 0 ? 1 : -1));
    distract.push(tweaked.join(''));
  }

  addQ(id, diff,
    "If " + exampleWord + " is coded as " + exCode + " (shifts of " + shiftStr + "), what is the code for " + word + "?",
    [code, ...distract],
    0,
    "Apply shifts " + shiftStr + " to " + word + ": " + word.split('').map((c,i) => c + (shifts[i]>0?'+':'')+shifts[i] + '=' + shiftLetter(c, shifts[i])).join(', ') + " = " + code + ". ✓",
    'variable-shift');
});

// ---- WRAP-AROUND: 12 new (Q137-Q148) ----

// Wrap-around questions: shifts that cross Z/A boundary
const wrapQs = [
  [137, 2, 'YARD', 3, 'encode', 'a garden area'],
  [138, 2, 'WAXY', 2, 'encode', 'smooth and shiny'],
  [139, 2, 'ZERO', 4, 'encode', 'the number 0'],
  [140, 2, 'BUZZ', 3, 'encode', 'a humming sound'],
  [141, 3, 'COZY', 5, 'encode', 'warm and comfortable'],
  [142, 3, 'JINX', 4, 'encode', 'a curse or bad luck'],
  [143, 2, 'TAXI', -3, 'decode', 'a car for hire'],
  [144, 2, 'NEXT', -4, 'decode', 'coming after'],
  [145, 3, 'MAZE', -5, 'decode', 'a puzzle of paths'],
  [146, 3, 'LYNX', 3, 'encode', 'a type of wild cat'],
  [147, 2, 'YAWN', 2, 'encode', 'opening mouth when tired'],
  [148, 3, 'FIZZY', 4, 'encode', 'full of bubbles'],
];

wrapQs.forEach(([id, diff, word, shift, direction, clue]) => {
  const code = encodeWord(word, shift);
  const exWord = direction === 'encode' ? 'HELP' : 'FISH';
  const exCode = encodeWord(exWord, shift);

  let question, answer, opts;
  if (direction === 'encode') {
    answer = code;
    question = "If " + exWord + " is coded as " + exCode + " (each letter " + (shift > 0 ? '+' : '') + shift + "), what is the code for " + word + "?";
    // Distractors
    const d = [];
    for (let i = 0; i < 4; i++) {
      const t = code.split('');
      t[i % code.length] = shiftLetter(t[i % code.length], (i % 2 === 0 ? 1 : -1));
      d.push(t.join(''));
    }
    opts = [answer, ...d];
  } else {
    answer = word;
    question = "If " + exWord + " is coded as " + exCode + " (each letter " + (shift > 0 ? '+' : '') + shift + "), what word is coded as " + code + "?";
    opts = [answer, word.substring(0,3) + shiftLetter(word[3], 1), shiftLetter(word[0], 1) + word.substring(1), word.substring(0,2) + shiftLetter(word[2], -1) + word[3], shiftLetter(word[0], -1) + word.substring(1)];
  }

  // Check for wrap-around in explanation
  const hasWrap = word.split('').some((c, i) => {
    const shifted = shiftLetter(c, shift);
    const origCode = c.charCodeAt(0) - 65;
    const newCode = shifted.charCodeAt(0) - 65;
    return (shift > 0 && newCode < origCode) || (shift < 0 && newCode > origCode);
  });

  const wrapNote = hasWrap ? " Note the wrap-around — some letters loop past Z back to A (or A back to Z)!" : "";

  addQ(id, diff, question, opts, 0,
    (direction === 'encode' ?
      "Apply " + (shift>0?'+':'') + shift + " to each letter of " + word + ": " + word.split('').map(c => c + (shift>0?'+':'') + shift + '=' + shiftLetter(c, shift)).join(', ') + " = " + code + "." + wrapNote + " ✓" :
      "Reverse the shift (" + (shift>0?'-':'+') + Math.abs(shift) + ") on " + code + ": " + code.split('').map(c => c + (shift>0?'-':'+') + Math.abs(shift) + '=' + shiftLetter(c, -shift)).join(', ') + " = " + word + "." + wrapNote + " ✓"),
    'wrap-around');
});

// ---- MIRROR CODES: 8 new (Q149-Q156) ----
const mirrorQs = [
  [149, 2, 'HELP', 'encode'],
  [150, 2, 'COLD', 'encode'],
  [151, 2, 'SWIM', 'encode'],
  [152, 3, 'RAIN', 'decode'],
  [153, 3, 'DARK', 'decode'],
  [154, 3, 'LIGHT', 'encode'],
  [155, 3, 'MONEY', 'encode'],
  [156, 3, 'BRAVE', 'decode'],
];

mirrorQs.forEach(([id, diff, word, direction]) => {
  const code = mirrorWord(word);
  const exWord = 'STOP';
  const exCode = mirrorWord(exWord);

  let question, opts;
  if (direction === 'encode') {
    question = "If " + exWord + " is coded as " + exCode + " (A=Z, B=Y, C=X — each letter maps to its mirror partner), what is the code for " + word + "?";
    const d = [];
    for (let i = 0; i < 4; i++) {
      const t = code.split('');
      t[i % code.length] = shiftLetter(t[i % code.length], i+1);
      d.push(t.join(''));
    }
    opts = [code, ...d];
    addQ(id, diff, question, opts, 0,
      "Mirror code: each letter maps to its opposite in the alphabet (A↔Z, B↔Y, C↔X...). " + word.split('').map(c => c + '↔' + mirrorLetter(c)).join(', ') + " = " + code + ". ✓",
      'mirror-code');
  } else {
    question = "If " + exWord + " is coded as " + exCode + " (mirror code: A=Z, B=Y, C=X), what word is coded as " + code + "?";
    opts = [word, shiftLetter(word[0], 1) + word.substring(1), word.substring(0,2) + shiftLetter(word[2], -1) + word.substring(3), shiftLetter(word[0], -1) + word.substring(1), word.substring(0, word.length-1) + shiftLetter(word[word.length-1], 1)];
    addQ(id, diff, question, opts, 0,
      "Mirror code reverses itself — apply the same mirror: " + code.split('').map(c => c + '↔' + mirrorLetter(c)).join(', ') + " = " + word + ". ✓",
      'mirror-code');
  }
});

// ---- LARGER SHIFTS (±3, ±4): 10 new (Q157-Q166) ----
const largeShiftQs = [
  [157, 2, 'GOLD', 3, 'encode'],
  [158, 2, 'FARM', -3, 'encode'],
  [159, 2, 'DESK', 4, 'encode'],
  [160, 2, 'JUMP', -4, 'encode'],
  [161, 3, 'TRAIN', 3, 'encode'],
  [162, 3, 'CLOCK', -3, 'encode'],
  [163, 3, 'RIVER', 4, 'encode'],
  [164, 3, 'PLANE', -4, 'decode'],
  [165, 3, 'STORM', 3, 'decode'],
  [166, 2, 'SHIP', -3, 'decode'],
];

largeShiftQs.forEach(([id, diff, word, shift, direction]) => {
  const code = encodeWord(word, shift);
  const exWord = 'BLUE';
  const exCode = encodeWord(exWord, shift);

  let question, opts;
  if (direction === 'encode') {
    question = "If " + exWord + " is coded as " + exCode + " (each letter " + (shift>0?'+':'') + shift + "), what is the code for " + word + "?";
    const d = [];
    for (let i = 0; i < 4; i++) {
      const t = code.split('');
      t[i % code.length] = shiftLetter(t[i % code.length], (i%2===0 ? 1 : -1));
      d.push(t.join(''));
    }
    opts = [code, ...d];
  } else {
    question = "If " + exWord + " is coded as " + exCode + " (each letter " + (shift>0?'+':'') + shift + "), what word is coded as " + code + "?";
    opts = [word];
    // Generate plausible word distractors
    for (let i = 0; i < 4; i++) {
      const t = word.split('');
      t[i % word.length] = shiftLetter(t[i % word.length], (i%2===0 ? 1 : -1));
      opts.push(t.join(''));
    }
  }

  addQ(id, diff, question, opts, 0,
    (direction === 'encode' ?
      "Apply " + (shift>0?'+':'') + shift + " to " + word + ": " + word.split('').map(c => c + (shift>0?'+':'') + shift + '=' + shiftLetter(c, shift)).join(', ') + " = " + code + ". ✓" :
      "Reverse shift (" + (shift>0?'-':'+') + Math.abs(shift) + ") on " + code + ": " + code.split('').map(c => c + (shift>0?'-':'+') + Math.abs(shift) + '=' + shiftLetter(c, -shift)).join(', ') + " = " + word + ". ✓"),
    direction === 'encode' ? (shift > 0 ? 'forward-shift' : 'backward-shift') : 'reverse-decoding');
});

console.log('=== LETTER CODES AUDIT FIX ===\n');
console.log('Built ' + newQuestions.length + ' new questions');
if (errors > 0) { console.log(errors + ' errors — aborting'); process.exit(1); }

// ============================================================
// VALIDATE ALL ANSWERS
// ============================================================
console.log('\nValidating answers...');
let valErrors = 0;
newQuestions.forEach(q => {
  // Check correct option exists
  if (q.correct < 0 || q.correct >= q.options.length) {
    console.log('Q' + q.id + ': bad correct index');
    valErrors++;
  }
  // Check 5 options
  if (q.options.length !== 5) {
    console.log('Q' + q.id + ': ' + q.options.length + ' options');
    valErrors++;
  }
  // Check no duplicate options
  const uniq = new Set(q.options.map(o => o.toUpperCase()));
  if (uniq.size < q.options.length) {
    console.log('Q' + q.id + ': duplicate options — ' + q.options.join(', '));
    valErrors++;
  }
});
console.log(valErrors === 0 ? 'All answers valid ✓' : valErrors + ' validation errors');
if (valErrors > 0) { process.exit(1); }

// ============================================================
// APPLY
// ============================================================
let vrData = fs.readFileSync(VR_DATA, 'utf8');
let mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Find end of letterCodes section — last question's }
const lcStart = vrData.indexOf('letterCodes');
const afterLc = vrData.substring(lcStart);
const lcLines = afterLc.split('\n');
let lcDepth = 0, lcEndLine = 0;
for (let i = 0; i < lcLines.length; i++) {
  for (const ch of lcLines[i]) { if (ch === '{' || ch === '[') lcDepth++; if (ch === '}' || ch === ']') lcDepth--; }
  if (lcDepth <= 0 && i > 5) { lcEndLine = i; break; }
}
const lcSection = lcLines.slice(0, lcEndLine + 1).join('\n');
const lastBrace = lcSection.lastIndexOf('}');
const absInsert = lcStart + lastBrace + 1;

console.log('\nInserting at position ' + absInsert);

const newQStr = newQuestions.map(q => {
  const optsStr = q.options.map(o => '"' + o + '"').join(', ');
  return '        {\n' +
    '          "id": ' + q.id + ',\n' +
    '          "difficulty": ' + q.difficulty + ',\n' +
    '          "questionType": "' + q.questionType + '",\n' +
    '          "question": "' + q.question.replace(/"/g, '\\"') + '",\n' +
    '          "options": [' + optsStr + '],\n' +
    '          "correct": ' + q.correct + ',\n' +
    '          "explanation": "' + q.explanation.replace(/"/g, '\\"') + '"\n' +
    '        }';
}).join(',\n');

vrData = vrData.slice(0, absInsert) + ',\n' + newQStr + vrData.slice(absInsert);

// Add mappings
const existingMapCount = Object.keys(mappingData.letterCodes).length;
let mapIdx = existingMapCount;
newQuestions.forEach(q => {
  mappingData.letterCodes[String(mapIdx)] = {
    questionId: q.id,
    subConceptId: q._subConcept,
    confidence: 'high'
  };
  mapIdx++;
});

// ============================================================
// VERIFY INSERT
// ============================================================
const lcStartV = vrData.indexOf('letterCodes');
const afterV = vrData.substring(lcStartV);
const vLines = afterV.split('\n');
let vd = 0, ve = 0;
for (let i = 0; i < vLines.length; i++) {
  for (const ch of vLines[i]) { if (ch === '{' || ch === '[') vd++; if (ch === '}' || ch === ']') vd--; }
  if (vd <= 0 && i > 5) { ve = i; break; }
}
const vSection = vLines.slice(0, ve + 1).join('\n');
const vIds = [...vSection.matchAll(/['\x22]?id['\x22]?\s*:\s*(\d+)/g)].map(m => +m[1]);
console.log('\nVerification: ' + vIds.length + ' questions in letterCodes (was 125)');

if (vIds.length <= 125) {
  console.log('ERROR: Questions not inserted into section correctly');
  // Try to fix — same issue as hiddenWords
  console.log('Attempting boundary fix...');

  // Find where new Qs actually went
  const q126Pos = vrData.indexOf('"id": 126,\n          "difficulty"');
  const letterMovePos = vrData.indexOf('letterMove', lcStartV + 100);

  if (q126Pos > 0 && letterMovePos > 0) {
    // Same fix as hiddenWords: extract orphaned block and reinsert inside section
    const sectionCloseStr = '}\n      ]\n    },\n';
    const closeIdx = vrData.lastIndexOf(sectionCloseStr, q126Pos);

    if (closeIdx > 0) {
      const lastLegitBrace = closeIdx; // the } before ]
      const afterSectionClose = closeIdx + sectionCloseStr.length;
      const orphanBlock = vrData.substring(afterSectionClose, letterMovePos).trim();

      // Remove orphan and reinsert
      vrData = vrData.substring(0, closeIdx + 1) + ',\n' + orphanBlock + '\n      ]\n    },\n    ' + vrData.substring(letterMovePos);

      // Re-verify
      const lcStartV2 = vrData.indexOf('letterCodes');
      const afterV2 = vrData.substring(lcStartV2);
      const vLines2 = afterV2.split('\n');
      let vd2 = 0, ve2 = 0;
      for (let i = 0; i < vLines2.length; i++) {
        for (const ch of vLines2[i]) { if (ch === '{' || ch === '[') vd2++; if (ch === '}' || ch === ']') vd2--; }
        if (vd2 <= 0 && i > 5) { ve2 = i; break; }
      }
      const vSection2 = vLines2.slice(0, ve2 + 1).join('\n');
      const vIds2 = [...vSection2.matchAll(/['\x22]?id['\x22]?\s*:\s*(\d+)/g)].map(m => +m[1]);
      console.log('After fix: ' + vIds2.length + ' questions');

      if (vIds2.length <= 125) {
        console.log('ERROR: Still not fixed. Aborting.');
        process.exit(1);
      }
    }
  }
}

// Final group check
const groups = {};
Object.values(mappingData.letterCodes).forEach(e => {
  if (!groups[e.subConceptId]) groups[e.subConceptId] = 0;
  groups[e.subConceptId]++;
});
console.log('\nFinal groups:');
let belowThreshold = 0;
Object.entries(groups).sort((a,b) => a[1]-b[1]).forEach(([sc, count]) => {
  const flag = count < 15 ? ' <-- BELOW 15' : ' ✓';
  console.log('  ' + sc + ': ' + count + flag);
  if (count < 15) belowThreshold++;
});

if (belowThreshold > 0) {
  console.log('WARNING: ' + belowThreshold + ' groups below 15');
}

// Difficulty of new questions
const nd = {1:0,2:0,3:0}; newQuestions.forEach(q => nd[q.difficulty]++);
console.log('\nNew Q difficulty: D1:' + nd[1] + ' D2:' + nd[2] + ' D3:' + nd[3]);

// WRITE
console.log('\n=== WRITING FILES ===');
fs.writeFileSync(VR_DATA, vrData, 'utf8');
console.log('Written: ' + VR_DATA);
fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappingData, null, 2), 'utf8');
console.log('Written: ' + MAPPING_FILE);
console.log('\n✅ ALL FIXES APPLIED');
console.log('   ' + newQuestions.length + ' new questions (Q126-Q' + newQuestions[newQuestions.length-1].id + ')');

const fs = require('fs');
const path = require('path');

const VR_DATA = path.resolve(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

const mlStart = content.indexOf('missingLettersWords');
const lcStart = content.indexOf('letterCodes', mlStart);
const before = content.substring(0, mlStart);
let section = content.substring(mlStart, lcStart);
const after = content.substring(lcStart);

// FIX 1: Position A rebalance
console.log('=== FIX 1: Position bias ===');
const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let swapCount = 0;
let newSection = '';

for (const block of blocks) {
  const corrM = block.match(/(correct:\s*)(\d+)/);
  if (!corrM || +corrM[2] !== 0) { newSection += block; continue; }
  if (swapCount >= 25) { newSection += block; continue; }

  const optsM = block.match(/(options:\s*\[)([\s\S]*?)(\])/);
  if (!optsM) { newSection += block; continue; }

  const opts = [];
  let inQ = false, qCh = '', cur = '';
  for (const ch of optsM[2]) {
    if (!inQ && (ch === '"' || ch === "'")) { inQ = true; qCh = ch; cur = ''; }
    else if (inQ && ch === qCh) { inQ = false; opts.push(cur); }
    else if (inQ) cur += ch;
  }
  if (opts.length !== 5) { newSection += block; continue; }

  const targets = [1, 2, 3, 4, 1];
  const target = targets[swapCount % targets.length];
  const temp = opts[0]; opts[0] = opts[target]; opts[target] = temp;
  const newOptsStr = opts.map(o => '"' + o.replace(/"/g, '\\"') + '"').join(',');
  let fixed = block.replace(optsM[0], optsM[1] + newOptsStr + optsM[3]);
  fixed = fixed.replace(corrM[0], corrM[1] + target);
  newSection += fixed;
  swapCount++;
}
section = newSection;
console.log('Swapped', swapCount, 'from A to other positions');

// FIX 2: Explanation warmth pass
console.log('\n=== FIX 2: Explanations ===');
const mlTips = [
  "Tip: Sound out the complete word — if it sounds right and the three letters make a word, you've got it!",
  "Tip: Check BOTH things — the complete word is real AND the stolen letters form a real word.",
  "Tip: Try common three-letter words first: THE, AND, FOR, BUT, NOT, ALL, CAN, HER, HAS, HIM.",
  "Tip: Look at the letters around the gap — they give strong clues about what fits.",
  "Tip: If you're stuck, work through the vowels: try A, E, I, O, U in the gap position.",
  "Tip: For tricky words, try saying the word aloud with different letters — your ear will catch the right one!",
  "Tip: Watch out for silent letters (K in KNOWLEDGE, W in WRONG) — they won't sound right but they're correct!",
  "Tip: Double letters are common traps — NECESSARY has one C and two S's!",
];

let tipCount = 0;
section = section.replace(
  /((?:"explanation"|explanation)\s*:\s*")([^"]+)(")/g,
  (full, prefix, expl, suffix) => {
    if (expl.match(/Tip:/i)) return full;
    if (expl.length < 20) return full;
    const tip = mlTips[tipCount % mlTips.length];
    tipCount++;
    let imp = expl;
    if (imp.endsWith(' \u2713')) imp = imp.slice(0, -2) + ' ' + tip + ' \u2713';
    else if (imp.endsWith('\u2713')) imp = imp.slice(0, -1) + ' ' + tip + ' \u2713';
    else imp += ' ' + tip;
    return prefix + imp + suffix;
  }
);
console.log('Added tips to', tipCount, 'explanations');

content = before + section + after;
fs.writeFileSync(VR_DATA, content, 'utf8');

// Verify
const newMl = content.substring(content.indexOf('missingLettersWords'), content.indexOf('letterCodes', content.indexOf('missingLettersWords')));
const newCorr = [...newMl.matchAll(/correct:\s*(\d+)/g)].map(m => +m[1]);
const newPc = {0:0,1:0,2:0,3:0,4:0}; newCorr.forEach(c => newPc[c]++);
const newExpls = [...newMl.matchAll(/(?:"explanation"|explanation)\s*:\s*"([^"]+)"/g)].map(m => m[1]);
const newTips = newExpls.filter(e => e.match(/Tip:/i)).length;

console.log('\n=== VERIFICATION ===');
console.log('Positions: A:'+newPc[0]+' B:'+newPc[1]+' C:'+newPc[2]+' D:'+newPc[3]+' E:'+newPc[4]+' (max '+Math.round(Math.max(...Object.values(newPc))/125*100)+'%)');
console.log('Explanations with tips:', newTips + '/' + newExpls.length);
console.log('Written ✓');

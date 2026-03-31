const fs = require('fs');
const path = require('path');

const VR_DATA = path.resolve(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

const lmStart = content.indexOf('letterMove');
const mlStart = content.indexOf('missingLettersWords', lmStart);
const before = content.substring(0, lmStart);
let section = content.substring(lmStart, mlStart);
const after = content.substring(mlStart);

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
const moveTips = [
  "Tip: Try both directions — the letter doesn't always move left to right!",
  "Tip: Use the 'remove and check' method — remove each letter and see if the rest makes a word.",
  "Tip: Remember the moved letter can go ANYWHERE in the other word — start, middle, or end.",
  "Tip: Check BOTH resulting words are real — it's easy to forget one!",
  "Tip: Start with consonants at the start and end of words — they're the most common moves.",
  "Tip: Say the new words out loud in your head — your ear will catch if something isn't right.",
  "Tip: If the obvious letter doesn't work, try letters from the MIDDLE of the word.",
  "Tip: In the exam, work systematically — don't just guess. Try each letter one by one.",
];

let tipCount = 0;
section = section.replace(
  /((?:"explanation"|explanation)\s*:\s*")([^"]+)(")/g,
  (full, prefix, expl, suffix) => {
    if (expl.match(/Tip:/i)) return full;
    if (expl.length < 20) return full;
    const tip = moveTips[tipCount % moveTips.length];
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
const newSection2 = content.substring(content.indexOf('letterMove'), content.indexOf('missingLettersWords', content.indexOf('letterMove')));
const newCorr = [...newSection2.matchAll(/correct:\s*(\d+)/g)].map(m => +m[1]);
const newPc = {0:0,1:0,2:0,3:0,4:0}; newCorr.forEach(c => newPc[c]++);
const newExpls = [...newSection2.matchAll(/(?:"explanation"|explanation)\s*:\s*"([^"]+)"/g)].map(m => m[1]);
const newTips = newExpls.filter(e => e.match(/Tip:/i)).length;

console.log('\n=== VERIFICATION ===');
console.log('Positions: A:'+newPc[0]+' B:'+newPc[1]+' C:'+newPc[2]+' D:'+newPc[3]+' E:'+newPc[4]+' (max '+Math.round(Math.max(...Object.values(newPc))/125*100)+'%)');
console.log('Explanations with tips:', newTips + '/' + newExpls.length);
console.log('Written ✓');

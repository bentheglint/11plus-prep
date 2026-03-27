const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

function shiftLetter(l, s) {
  return String.fromCharCode(((l.toUpperCase().charCodeAt(0) - 65 + s % 26 + 26) % 26) + 65);
}
function encodeWord(w, s) {
  return w.split('').map(c => shiftLetter(c, s)).join('');
}

const lcStart = content.indexOf('letterCodes');
const lpStart = content.indexOf('letterPairSeries');
const before = content.substring(0, lcStart);
let section = content.substring(lcStart, lpStart);
const after = content.substring(lpStart);

// Example words to use for constructing example pairs
const exWords3 = ['CAT', 'DOG', 'SUN', 'PEN', 'HAT', 'BUS', 'JAM', 'CUP', 'LOG', 'FIG'];
const exWords4 = ['FISH', 'HELP', 'COLD', 'STAR', 'BARN', 'DUSK', 'GIFT', 'LAMP', 'MIST', 'ROCK'];
const exWords5 = ['PLANT', 'BRICK', 'SHELF', 'FROST', 'CLOUD', 'DRINK', 'TRUNK', 'SLOPE', 'CHARM', 'GLOBE'];

let fixCount = 0;

// Pattern 1: "If each letter is moved forward by N, what is the code for WORD?"
// -> "If EXAMPLE is coded as CODE, what is the code for WORD?"
section = section.replace(
  /((?:"question"|question)\s*:\s*")If each letter is moved (forward|back) by (\d+), what is the code for ([A-Z]+)\?(")/g,
  (full, prefix, direction, amountStr, targetWord, suffix) => {
    const amount = +amountStr;
    const shift = direction === 'forward' ? amount : -amount;
    const exList = targetWord.length <= 3 ? exWords3 : targetWord.length <= 4 ? exWords4 : exWords5;
    const exWord = exList[fixCount % exList.length];
    const exCode = encodeWord(exWord, shift);
    fixCount++;
    return prefix + 'If ' + exWord + ' is coded as ' + exCode + ', what is the code for ' + targetWord + '?' + suffix;
  }
);

// Pattern 2: "If each letter is moved forward by N, what word is coded as CODE?"
// -> "If EXAMPLE is coded as EXCODE, what word is coded as CODE?"
section = section.replace(
  /((?:"question"|question)\s*:\s*")If each letter is moved (forward|back) by (\d+), what word is coded as ([A-Z]+)\?(")/g,
  (full, prefix, direction, amountStr, codeStr, suffix) => {
    const amount = +amountStr;
    const shift = direction === 'forward' ? amount : -amount;
    // Figure out word length from code length
    const exList = codeStr.length <= 3 ? exWords3 : codeStr.length <= 4 ? exWords4 : exWords5;
    const exWord = exList[fixCount % exList.length];
    const exCode = encodeWord(exWord, shift);
    fixCount++;
    return prefix + 'If ' + exWord + ' is coded as ' + exCode + ', what word is coded as ' + codeStr + '?' + suffix;
  }
);

// Pattern 3: remaining "(each letter moved forward by 1)" or "(each letter +3)" in D2/D3
// These are questions like: "If COLD is coded as DPME (each letter moved forward by 1), what is WARM coded as?"
// Remove the parenthetical hint
// Need to check difficulty first — only fix D2/D3
const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let parenFixCount = 0;
let newSection = '';
for (const block of blocks) {
  const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
  const diff = diffM ? +diffM[1] : 0;

  if (diff >= 2) {
    let fixed = block;
    // Remove parenthetical rule hints
    fixed = fixed.replace(/\s*\(each letter moved? (?:forward|back|backward)s? by \d+\)/gi, '');
    fixed = fixed.replace(/\s*\(each letter [+-]\d+\)/gi, '');
    fixed = fixed.replace(/\s*\(shifts? of [+-]\d+(?:,\s*[+-]\d+)*\)/gi, '');
    fixed = fixed.replace(/\s*\(mirror code:[^)]+\)/gi, '');
    if (fixed !== block) parenFixCount++;
    newSection += fixed;
  } else {
    newSection += block;
  }
}
section = newSection;

console.log('Reformatted', fixCount, '"If each letter is moved" questions');
console.log('Removed', parenFixCount, 'parenthetical rule hints');

// Final verification
const finalBlocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let stillBad = 0;
for (const block of finalBlocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  if (!idM || !qM) continue;
  const diff = diffM ? +diffM[1] : 0;
  if (diff < 2) continue;
  const q = qM[1].toLowerCase();
  if (q.match(/each letter.*move|each letter.*shift|letter.*forward|letter.*back|shifts? of [+-]|each letter [+-]\d|\(each letter|\(shifts|mirror code:/)) {
    stillBad++;
    if (stillBad <= 5) console.log('  STILL: Q' + idM[1] + ' (D' + diff + '): ' + qM[1].substring(0, 80));
  }
}
console.log('\nD2/D3 still stating rule:', stillBad);

// Count format types now
let glFormat = 0, d1Format = 0;
for (const block of finalBlocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  if (!idM || !qM) continue;
  const q = qM[1];
  if (q.match(/is coded as [A-Z]+,/)) glFormat++;
  else if (q.match(/what rule/i)) d1Format++;
}
console.log('\nGL format (example pair, no rule stated):', glFormat);
console.log('D1 format (what rule / rule stated):', d1Format);

content = before + section + after;
fs.writeFileSync(VR_DATA, content, 'utf8');
console.log('\nWritten ✓');

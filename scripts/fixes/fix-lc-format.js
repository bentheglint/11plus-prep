const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

const lcStart = content.indexOf('letterCodes');
const lpStart = content.indexOf('letterPairSeries');
const before = content.substring(0, lcStart);
let section = content.substring(lcStart, lpStart);
const after = content.substring(lpStart);

// Fix questions that state the rule explicitly at D2/D3
// Pattern: "If WORD is coded as CODE (each letter +N), what is..."
// Should become: "If WORD is coded as CODE, what is..."
// The parenthetical rule hint must be removed

let fixCount = 0;

// Match patterns like: (each letter moved forward by 1) or (each letter +3) or (shifts of +1, +2, +3, +4)
// or (each letter -2) or (each letter moved back by 1)
section = section.replace(
  /(["']question["']?\s*:\s*["'])([^"']*?)(["'])/g,
  (full, prefix, question, suffix) => {
    // Find the difficulty of this question — look backwards in the block for difficulty
    const blockBefore = section.substring(Math.max(0, section.lastIndexOf('{', section.indexOf(full)) ), section.indexOf(full));
    const diffM = blockBefore.match(/difficulty["']?\s*:\s*(\d+)/);
    const diff = diffM ? +diffM[1] : 0;

    // D1 can keep the rule stated — that's acceptable
    if (diff <= 1) return full;

    // Remove rule hints from D2/D3
    let cleaned = question;

    // Pattern 1: (each letter moved forward by N)
    cleaned = cleaned.replace(/\s*\(each letter moved? (?:forward|back|backward)s? by \d+\)/gi, '');
    // Pattern 2: (each letter +N) or (each letter -N)
    cleaned = cleaned.replace(/\s*\(each letter [+-]\d+\)/gi, '');
    // Pattern 3: (shifts of +1, +2, +3, +4) etc
    cleaned = cleaned.replace(/\s*\(shifts? of [+-]\d+(?:,\s*[+-]\d+)*\)/gi, '');
    // Pattern 4: (mirror code: A=Z, B=Y, C=X)
    cleaned = cleaned.replace(/\s*\(mirror code:[^)]+\)/gi, '');
    // Pattern 5: standalone "each letter +N" without parens, as part of sentence
    // e.g. "If HELP is coded as JGNR (each letter +2), what..."
    // Already covered above. But also: "coded as JGNR each letter +2, what"
    // Pattern 6: In the question text itself, not in parens
    // "If BLUE is coded as EOXH (each letter +3)," — parens version caught above
    // Some might say: "If each letter is moved forward by 1, what is the code for CAT?"
    // These D1-style questions should be left alone at D1, but if at D2/D3 need rewriting

    // Check if it starts with "If each letter is moved" — this is D1 format at D2/D3
    if (cleaned.match(/^If each letter is moved/i)) {
      // Rewrite to GL format: need to construct an example pair
      // This is harder — skip for now, these are the "what rule" type
    }

    if (cleaned !== question) {
      fixCount++;
      return prefix + cleaned + suffix;
    }
    return full;
  }
);

console.log('Removed rule hints from', fixCount, 'D2/D3 questions');

// Now fix D2/D3 questions that say "If each letter is moved forward/back by N"
// These need restructuring to give an example pair instead
let reformatCount = 0;

function shiftLetter(l, s) {
  return String.fromCharCode(((l.toUpperCase().charCodeAt(0) - 65 + s % 26 + 26) % 26) + 65);
}
function encodeWord(w, s) {
  return w.split('').map(c => shiftLetter(c, s)).join('');
}

// Find blocks with "If each letter is moved" at D2/D3
const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
for (const block of blocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
  const qM = block.match(/(["']question["']?\s*:\s*["'])([^"']*?)(["'])/);
  if (!idM || !diffM || !qM) continue;

  const diff = +diffM[1];
  if (diff <= 1) continue;

  const question = qM[2];

  // Pattern: "If each letter is moved forward by N, what is the code for WORD?"
  const moveM = question.match(/If each letter is moved (forward|back) by (\d+), what is the code for ([A-Z]+)\?/i);
  if (moveM) {
    const direction = moveM[1].toLowerCase();
    const amount = +moveM[2];
    const targetWord = moveM[3].toUpperCase();
    const shift = direction === 'forward' ? amount : -amount;

    // Create an example pair using a simple common word
    const exampleWords = ['FISH', 'HELP', 'COLD', 'STAR', 'BARN', 'DUSK', 'GIFT', 'LAMP', 'MIST', 'ROCK'];
    const exWord = exampleWords[+idM[1] % exampleWords.length];
    const exCode = encodeWord(exWord, shift);

    const newQuestion = 'If ' + exWord + ' is coded as ' + exCode + ', what is the code for ' + targetWord + '?';

    const blockPos = section.indexOf(block);
    if (blockPos >= 0) {
      section = section.substring(0, blockPos) +
        block.replace(qM[0], qM[1] + newQuestion + qM[3]) +
        section.substring(blockPos + block.length);
      reformatCount++;
    }
  }

  // Pattern: "If each letter is moved forward/back by N, what word is coded as CODE?"
  const moveM2 = question.match(/If each letter is moved (forward|back) by (\d+), what word is coded as ([A-Z]+)\?/i);
  if (moveM2) {
    const direction = moveM2[1].toLowerCase();
    const amount = +moveM2[2];
    const codeStr = moveM2[3].toUpperCase();
    const shift = direction === 'forward' ? amount : -amount;

    const exampleWords = ['BLUE', 'GAME', 'SHIP', 'TREE', 'FROG', 'WIND', 'CAKE', 'DOOR', 'NEST', 'PLUG'];
    const exWord = exampleWords[+idM[1] % exampleWords.length];
    const exCode = encodeWord(exWord, shift);

    const newQuestion = 'If ' + exWord + ' is coded as ' + exCode + ', what word is coded as ' + codeStr + '?';

    const blockPos = section.indexOf(block);
    if (blockPos >= 0) {
      section = section.substring(0, blockPos) +
        block.replace(qM[0], qM[1] + newQuestion + qM[3]) +
        section.substring(blockPos + block.length);
      reformatCount++;
    }
  }
}

console.log('Reformatted', reformatCount, 'D2/D3 "If each letter is moved" questions');

// Verify final state
const finalSection = section;
const finalBlocks = finalSection.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let stillStatesRule = 0;
let total = 0;
for (const block of finalBlocks) {
  const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
  const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
  const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
  if (!idM || !qM) continue;
  total++;
  const diff = diffM ? +diffM[1] : 0;
  const q = qM[1].toLowerCase();

  if (diff >= 2 && q.match(/each letter.*move|each letter.*shift|letter.*forward|letter.*back|shifts? of [+-]|each letter [+-]\d|\(each letter|\(shifts|mirror code:/)) {
    stillStatesRule++;
    console.log('  STILL states rule: Q' + idM[1] + ' (D' + diff + '): ' + qM[1].substring(0, 80));
  }
}

console.log('\nD2/D3 questions still stating rule:', stillStatesRule);
console.log('Total questions:', total);

// Write
content = before + section + after;
fs.writeFileSync(VR_DATA, content, 'utf8');
console.log('\nWritten ✓');

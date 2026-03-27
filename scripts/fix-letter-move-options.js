const fs = require('fs');
const path = require('path');

const VR_DATA = path.resolve(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

const lmStart = content.indexOf('letterMove');
const mlStart = content.indexOf('missingLettersWords', lmStart);
const before = content.substring(0, lmStart);
let section = content.substring(lmStart, mlStart);
const after = content.substring(mlStart);

console.log('=== CONVERTING LETTER MOVE TO SINGLE-LETTER OPTIONS ===\n');

const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let converted = 0;
let errors = 0;
let newSection = '';

for (const block of blocks) {
  const idM = block.match(/id:\s*(\d+)/);
  if (!idM) { newSection += block; continue; }
  const id = +idM[1];

  const qM = block.match(/question:\s*["']([^"']*?)["']/);
  const optsM = block.match(/(options:\s*\[)([\s\S]*?)(\])/);
  const corrM = block.match(/(correct:\s*)(\d+)/);
  const explM = block.match(/(explanation:\s*["'])([^"']*?)(["'])/);

  if (!qM || !optsM || !corrM) { newSection += block; continue; }

  // Parse current options (word pairs)
  const opts = [];
  let inQ = false, qCh = '', cur = '';
  for (const ch of optsM[2]) {
    if (!inQ && (ch === '"' || ch === "'")) { inQ = true; qCh = ch; cur = ''; }
    else if (inQ && ch === qCh) { inQ = false; opts.push(cur); }
    else if (inQ) cur += ch;
  }

  if (opts.length !== 5) { newSection += block; continue; }

  // Get the correct pair
  const correctIdx = +corrM[2];
  const correctPair = opts[correctIdx];
  const words = correctPair.split(' ');

  if (words.length !== 2) { newSection += block; continue; }

  // Extract the two source words from the question text
  const sourceM = qM[1].match(/:\s*([A-Z]+)\s+([A-Z]+)\s*$/);
  if (!sourceM) {
    // Try alternate pattern
    const altM = qM[1].match(/words:\s*([A-Z]+)\s+([A-Z]+)/);
    if (!altM) { newSection += block; errors++; continue; }
  }

  const source1 = sourceM ? sourceM[1] : '';
  const source2 = sourceM ? sourceM[2] : '';
  const result1 = words[0];
  const result2 = words[1];

  // Find which letter was moved
  // The source word that got shorter lost the letter
  let movedLetter = '';

  if (source1.length === result1.length + 1 && source2.length === result2.length - 1) {
    // Letter moved from word 1 to word 2
    // Find which letter was removed from source1
    for (let i = 0; i < source1.length; i++) {
      const remaining = source1.substring(0, i) + source1.substring(i + 1);
      if (remaining.toUpperCase() === result1.toUpperCase()) {
        movedLetter = source1[i].toUpperCase();
        break;
      }
    }
  } else if (source2.length === result2.length + 1 && source1.length === result1.length - 1) {
    // Letter moved from word 2 to word 1
    for (let i = 0; i < source2.length; i++) {
      const remaining = source2.substring(0, i) + source2.substring(i + 1);
      if (remaining.toUpperCase() === result2.toUpperCase()) {
        movedLetter = source2[i].toUpperCase();
        break;
      }
    }
  }

  if (!movedLetter) {
    console.log('Q' + id + ': Could not determine moved letter');
    console.log('  Source:', source1, source2, 'Result:', result1, result2);
    errors++;
    newSection += block;
    continue;
  }

  // Generate 4 wrong letter options
  // Use letters from the source words that would be plausible but wrong
  const allLetters = (source1 + source2).toUpperCase().split('');
  const uniqueLetters = [...new Set(allLetters)].filter(l => l !== movedLetter);

  // If not enough unique letters, add common consonants
  const commonLetters = 'STRNLCPBDMFGHKWVY'.split('');
  for (const l of commonLetters) {
    if (!uniqueLetters.includes(l) && l !== movedLetter) uniqueLetters.push(l);
    if (uniqueLetters.length >= 8) break;
  }

  // Pick 4 distractors
  const distractors = uniqueLetters.slice(0, 4);

  // Build new options — put correct answer at a varied position
  const newCorrectIdx = converted % 5;
  const newOpts = [...distractors];
  newOpts.splice(newCorrectIdx, 0, movedLetter);
  // Ensure exactly 5
  while (newOpts.length > 5) newOpts.pop();
  while (newOpts.length < 5) newOpts.push(commonLetters.find(l => !newOpts.includes(l) && l !== movedLetter));

  // Update the explanation to mention the letter
  let newExpl = explM ? explM[2] : '';
  if (!newExpl.includes('Move the ' + movedLetter) && !newExpl.includes("Move '" + movedLetter)) {
    // Rebuild explanation
    newExpl = "Move the '" + movedLetter + "' from " + source1 + " to make " + result1 + ", and insert it into " + source2 + " to make " + result2 + ". " +
      newExpl.replace(/^Move the\s*/, '').replace(/^'?\w'?\s*/, '');
  }

  // Build new block
  const newOptsStr = newOpts.map(o => '"' + o + '"').join(', ');
  let fixed = block;
  fixed = fixed.replace(optsM[0], optsM[1] + newOptsStr + optsM[3]);
  fixed = fixed.replace(corrM[0], corrM[1] + newCorrectIdx);
  if (explM) {
    fixed = fixed.replace(explM[0], explM[1] + newExpl + explM[3]);
  }

  newSection += fixed;
  converted++;
}

section = newSection;
content = before + section + after;
fs.writeFileSync(VR_DATA, content, 'utf8');

console.log('Converted:', converted, 'questions');
console.log('Errors:', errors);

// Verify a sample
const newLmStart = content.indexOf('letterMove');
const newMlStart = content.indexOf('missingLettersWords', newLmStart);
const newSection2 = content.substring(newLmStart, newMlStart);
const newBlocks = newSection2.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
let sampleCount = 0;
console.log('\n=== SAMPLE AFTER CONVERSION ===');
for (const block of newBlocks) {
  const idM = block.match(/id:\s*(\d+)/);
  const optsM = block.match(/options:\s*\[([\s\S]*?)\]/);
  const corrM = block.match(/correct:\s*(\d+)/);
  if (!idM || sampleCount >= 3) continue;

  const opts = optsM ? [...optsM[1].matchAll(/["']([^"']*?)["']/g)].map(m => m[1]) : [];
  console.log('Q' + idM[1] + ': options = ' + opts.join(', ') + ' | correct = ' + (corrM ? opts[+corrM[1]] : '?'));
  sampleCount++;
}

console.log('\nWritten ✓');

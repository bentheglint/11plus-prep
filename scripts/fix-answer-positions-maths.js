#!/usr/bin/env node
/**
 * Fix answer position bias in mathsData.js
 * Uses line-by-line processing to handle the JS object format correctly.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Load data for analysis
Object.keys(require.cache).forEach(k => { if (k.includes('mathsData')) delete require.cache[k]; });
const mathsData = require('../src/questionData/mathsData').default;

// Deterministic position assignment
function getTargetPosition(topicIdx, qIdx) {
  const offsets = [0, 3, 1, 4, 2, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3];
  return (qIdx + offsets[topicIdx % offsets.length]) % 5;
}

const topicKeys = Object.keys(mathsData.topics);
let totalSwaps = 0;

// Build a map of all swaps needed: { topicKey: { questionId: { fromIdx, toIdx } } }
const swapMap = {};

topicKeys.forEach((topicKey, topicIdx) => {
  const questions = mathsData.topics[topicKey].questions;
  swapMap[topicKey] = {};
  let eligibleIdx = 0;

  questions.forEach(q => {
    if (!q.options || q.options.length !== 5 || q.correct === undefined) return;
    if (q.options.some(o => /no mistake|none of the above/i.test(String(o)))) return;

    const targetPos = getTargetPosition(topicIdx, eligibleIdx);
    eligibleIdx++;

    if (q.correct !== targetPos) {
      swapMap[topicKey][q.id] = { from: q.correct, to: targetPos };
    }
  });
});

// Now process the file line by line
let currentTopic = null;
let currentQId = null;
let currentOptions = null;
let currentOptionsLineIdx = null;
let currentCorrectLineIdx = null;
let pendingSwap = null;
const newLines = [...lines];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect topic
  for (const tk of topicKeys) {
    if (line.match(new RegExp(`\\b${tk}\\s*:\\s*\\{`)) || line.match(new RegExp(`\\b${tk}:\\s*\\{`))) {
      currentTopic = tk;
      break;
    }
  }

  // Detect question id
  const idMatch = line.match(/^\s*id:\s*(\d+)\s*,/);
  if (idMatch) {
    currentQId = parseInt(idMatch[1]);
    currentOptions = null;
    currentOptionsLineIdx = null;
    currentCorrectLineIdx = null;

    // Check if this question needs a swap
    if (currentTopic && swapMap[currentTopic] && swapMap[currentTopic][currentQId]) {
      pendingSwap = swapMap[currentTopic][currentQId];
    } else {
      pendingSwap = null;
    }
  }

  // Detect options line
  if (pendingSwap) {
    const optMatch = line.match(/^(\s*options:\s*)\[(.*)\](\s*,?\s*)$/);
    if (optMatch) {
      const prefix = optMatch[1];
      const optionsContent = optMatch[2];
      const suffix = optMatch[3];

      // Parse options - they're quoted strings separated by ", "
      const opts = [];
      const optRegex = /"([^"]*?)"/g;
      let m;
      while ((m = optRegex.exec(optionsContent)) !== null) {
        opts.push(m[1]);
      }

      if (opts.length === 5) {
        // Swap the two options
        const { from, to } = pendingSwap;
        const temp = opts[from];
        opts[from] = opts[to];
        opts[to] = temp;

        // Rebuild the line
        const newOptsStr = opts.map(o => `"${o}"`).join(', ');
        newLines[i] = `${prefix}[${newOptsStr}]${suffix}`;
        currentOptionsLineIdx = i;
      }
    }

    // Detect correct line and update
    const correctMatch = line.match(/^(\s*correct:\s*)(\d)(\s*,?\s*)$/);
    if (correctMatch && currentOptionsLineIdx !== null) {
      const currentCorrect = parseInt(correctMatch[2]);
      const { from, to } = pendingSwap;

      let newCorrect = currentCorrect;
      if (currentCorrect === from) newCorrect = to;
      else if (currentCorrect === to) newCorrect = from;

      if (newCorrect !== currentCorrect) {
        newLines[i] = `${correctMatch[1]}${newCorrect}${correctMatch[3]}`;
        totalSwaps++;
      }

      // Check next few lines for explanation with "Option X" references
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].includes('explanation:')) {
          const letters = ['A', 'B', 'C', 'D', 'E'];
          if (lines[j].includes(`Option ${letters[from]}`) || lines[j].includes(`Option ${letters[to]}`)) {
            let fixed = newLines[j];
            fixed = fixed.replace(new RegExp(`Option ${letters[from]}`, 'g'), 'Option __TEMP__');
            fixed = fixed.replace(new RegExp(`Option ${letters[to]}`, 'g'), `Option ${letters[from]}`);
            fixed = fixed.replace(/Option __TEMP__/g, `Option ${letters[to]}`);
            newLines[j] = fixed;
          }
          break;
        }
      }

      pendingSwap = null;
      currentOptionsLineIdx = null;
    }
  }
}

// Write the file
fs.writeFileSync(filePath, newLines.join('\n'));
console.log(`mathsData.js: ${totalSwaps} answer positions swapped`);

// Verify by reloading
Object.keys(require.cache).forEach(k => { if (k.includes('mathsData')) delete require.cache[k]; });
const updated = require('../src/questionData/mathsData').default;

console.log('\n=== POST-FIX DISTRIBUTIONS ===');
console.log('Topic                | Total |   A |   B |   C |   D |   E | Max');
console.log('---------------------|-------|-----|-----|-----|-----|-----|----');

let allOk = true;
for (const [key, topic] of Object.entries(updated.topics)) {
  const qs = topic.questions || [];
  const total = qs.length;
  const pos = [0, 0, 0, 0, 0];
  qs.forEach(q => { if (q.correct >= 0 && q.correct <= 4) pos[q.correct]++; });
  const pcts = pos.map(p => Math.round(p / total * 100));
  const maxPct = Math.max(...pcts);
  const flag = maxPct > 28 ? ' <<<' : '';
  if (maxPct > 28) allOk = false;
  console.log(
    key.padEnd(21) + '| ' + String(total).padStart(3) + '   | ' +
    pcts.map(p => String(p).padStart(2) + '%').join(' | ') + ' | ' + maxPct + '%' + flag
  );
}
console.log(allOk ? '\nAll topics within acceptable range.' : '\nSome topics still have bias — see <<< markers.');

#!/usr/bin/env node
/**
 * Fix answer position bias across ALL topics.
 *
 * Approach: For each question, assign a target position (0-4) using a
 * deterministic distribution, then swap the correct answer to that position.
 * This preserves distractor quality while eliminating position bias.
 *
 * Skips:
 * - Error-spotting questions (segments-based, options are "Section A/B/C/D")
 * - Pick-from-sets / select-two questions (different answer format)
 * - Questions with "No mistake" as an option at index 4 (that position is special)
 */

const fs = require('fs');
const path = require('path');

// =====================================================================
// CONFIGURATION
// =====================================================================

const FILES = [
  { path: 'src/questionData/mathsData.js', varName: 'mathsData', getter: () => require('../src/questionData/mathsData').default },
  { path: 'src/questionData/englishData.js', varName: 'englishData', getter: () => require('../src/questionData/englishData').default },
  { path: 'src/questionData/vrData.js', varName: 'vrData', getter: () => require('../src/questionData/vrData').default },
];

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

function shouldSkip(q) {
  // Skip error-spotting (punctuation, spelling, grammar segments)
  if (q.questionType === 'error-spotting') return true;
  if (q.segments && q.options && q.options.some(o => String(o).startsWith('Section '))) return true;

  // Skip pick-from-sets and select-two
  if (q.questionType === 'pick-from-sets' || q.questionType === 'select-two') return true;

  // Skip if no standard options/correct
  if (!q.options || q.options.length !== 5) return true;
  if (q.correct === undefined || q.correct === null) return true;
  if (q.correct < 0 || q.correct > 4) return true;

  // Skip if options contain "No mistake" or "None of the above" (position matters)
  if (q.options.some(o => /no mistake|none of the above|all of the above/i.test(String(o)))) return true;

  return false;
}

// Deterministic target position based on topic + id to get even distribution
function getTargetPosition(topicIdx, questionIdx, totalInTopic) {
  // Use a simple but effective distribution: cycle through positions
  // with an offset per topic to avoid patterns across topics
  const offsets = [0, 3, 1, 4, 2, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 4, 2, 1,
                   3, 1, 4, 0, 2, 1, 3, 4, 0, 2, 4, 1, 0, 3, 2, 1, 4, 3, 0, 2];
  const offset = offsets[topicIdx % offsets.length];
  return (questionIdx + offset) % 5;
}

// Swap two options and update correct index
function swapOptions(q, fromIdx, toIdx) {
  const temp = q.options[fromIdx];
  q.options[fromIdx] = q.options[toIdx];
  q.options[toIdx] = temp;

  if (q.correct === fromIdx) q.correct = toIdx;
  else if (q.correct === toIdx) q.correct = fromIdx;
}

// Check if explanation references option letters that need updating
function fixExplanationLetters(explanation, fromIdx, toIdx) {
  if (!explanation) return explanation;
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const fromLetter = letters[fromIdx];
  const toLetter = letters[toIdx];

  // Only fix if explanation explicitly references "Option X" pattern
  let fixed = explanation;
  if (fixed.includes(`Option ${fromLetter}`)) {
    // Use placeholder to avoid double-swap
    fixed = fixed.replace(new RegExp(`Option ${fromLetter}`, 'g'), `Option __FROM__`);
    fixed = fixed.replace(new RegExp(`Option ${toLetter}`, 'g'), `Option ${fromLetter}`);
    fixed = fixed.replace(/Option __FROM__/g, `Option ${toLetter}`);
  }
  return fixed;
}

// =====================================================================
// MAIN PROCESSING
// =====================================================================

let globalStats = { total: 0, swapped: 0, skipped: 0 };

FILES.forEach(fileConfig => {
  const filePath = path.join(__dirname, '..', fileConfig.path);

  // Clear cache and load fresh
  Object.keys(require.cache).forEach(key => {
    if (key.includes('questionData')) delete require.cache[key];
  });

  let data;
  try {
    data = fileConfig.getter();
  } catch (e) {
    console.log(`SKIP ${fileConfig.path}: ${e.message}`);
    return;
  }

  if (!data || !data.topics) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let fileSwaps = 0;
  let fileSkips = 0;

  const topicKeys = Object.keys(data.topics);

  topicKeys.forEach((topicKey, topicIdx) => {
    const topic = data.topics[topicKey];
    const questions = topic.questions || [];
    if (questions.length === 0) return;

    // Count current positions
    const before = [0, 0, 0, 0, 0];
    const eligible = questions.filter(q => !shouldSkip(q));
    eligible.forEach(q => before[q.correct]++);

    let topicSwaps = 0;

    eligible.forEach((q, qIdx) => {
      const targetPos = getTargetPosition(topicIdx, qIdx, eligible.length);
      const currentPos = q.correct;

      if (currentPos === targetPos) return; // Already in right place

      // Find the old options string in the file
      const oldOptionsStr = JSON.stringify(q.options);
      const oldCorrectStr = q.correct;

      // Perform the swap in memory
      const oldExplanation = q.explanation;
      swapOptions(q, currentPos, targetPos);
      q.explanation = fixExplanationLetters(q.explanation, currentPos, targetPos);

      // Now replace in file content
      const newOptionsStr = JSON.stringify(q.options);

      if (content.includes(oldOptionsStr)) {
        content = content.replace(oldOptionsStr, newOptionsStr);

        // Update correct value near this options array
        const optIdx = content.indexOf(newOptionsStr);
        if (optIdx !== -1) {
          const searchArea = content.substring(optIdx, optIdx + newOptionsStr.length + 300);
          const correctPattern = /"correct":\s*(\d)/;
          const match = searchArea.match(correctPattern);
          if (match && parseInt(match[1]) === oldCorrectStr) {
            const fullMatch = match[0];
            const replacement = `"correct": ${q.correct}`;
            const absPos = optIdx + searchArea.indexOf(fullMatch);
            content = content.substring(0, absPos) + replacement + content.substring(absPos + fullMatch.length);
          }
          // Also try without quotes for JS format
          const correctPatternJS = /correct:\s*(\d)/;
          const matchJS = searchArea.match(correctPatternJS);
          if (matchJS && parseInt(matchJS[1]) === oldCorrectStr) {
            const fullMatch = matchJS[0];
            const replacement = `correct: ${q.correct}`;
            const absPos = optIdx + searchArea.indexOf(fullMatch);
            content = content.substring(0, absPos) + replacement + content.substring(absPos + fullMatch.length);
          }
        }

        // Fix explanation if changed
        if (oldExplanation !== q.explanation) {
          const oldExpStr = JSON.stringify(oldExplanation);
          const newExpStr = JSON.stringify(q.explanation);
          if (content.includes(oldExpStr)) {
            content = content.replace(oldExpStr, newExpStr);
          }
        }

        topicSwaps++;
        fileSwaps++;
      }
    });

    // Count after positions
    const after = [0, 0, 0, 0, 0];
    eligible.forEach(q => after[q.correct]++);

    const beforeMax = Math.max(...before);
    const afterMax = Math.max(...after);
    const improved = afterMax < beforeMax;

    if (topicSwaps > 0 || beforeMax > 30) {
      const pctBefore = before.map((v, i) => `${'ABCDE'[i]}=${Math.round(v/eligible.length*100)}%`).join(' ');
      const pctAfter = after.map((v, i) => `${'ABCDE'[i]}=${Math.round(v/eligible.length*100)}%`).join(' ');
      console.log(`${topicKey.padEnd(22)} ${String(eligible.length).padStart(3)} eligible | Before: ${pctBefore} | After: ${pctAfter} | ${topicSwaps} swaps`);
    }

    fileSkips += questions.length - eligible.length;
  });

  // Write the file
  fs.writeFileSync(filePath, content);
  console.log(`\nWrote ${fileConfig.path} (${fileSwaps} swaps, ${fileSkips} skipped)\n`);

  globalStats.total += fileSwaps + fileSkips;
  globalStats.swapped += fileSwaps;
  globalStats.skipped += fileSkips;
});

console.log(`\n=== TOTAL: ${globalStats.swapped} questions swapped, ${globalStats.skipped} skipped ===`);

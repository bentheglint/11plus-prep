#!/usr/bin/env node
/**
 * Fix answer position bias in files with multi-line options arrays.
 * Handles englishData.js and vrData.js formats.
 */

const fs = require('fs');
const path = require('path');

function shouldSkip(q) {
  if (q.questionType === 'error-spotting') return true;
  if (q.segments && q.options && q.options.some(o => String(o).startsWith('Section '))) return true;
  if (q.questionType === 'pick-from-sets' || q.questionType === 'select-two') return true;
  if (!q.options || q.options.length !== 5) return true;
  if (q.correct === undefined || q.correct === null || q.correct < 0 || q.correct > 4) return true;
  if (q.options.some(o => /no mistake|none of the above|all of the above/i.test(String(o)))) return true;
  return false;
}

function getTargetPosition(topicIdx, qIdx) {
  const offsets = [0, 3, 1, 4, 2, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 4, 2, 1,
                   3, 1, 4, 0, 2, 1, 3, 4, 0, 2, 4, 1, 0, 3, 2, 1, 4, 3, 0, 2];
  return (qIdx + offsets[topicIdx % offsets.length]) % 5;
}

function processFile(filePath, label, getData) {
  console.log(`\n=== ${label} ===`);

  Object.keys(require.cache).forEach(k => {
    if (k.includes('questionData')) delete require.cache[k];
  });

  let data;
  try { data = getData(); } catch (e) { console.log('Skip:', e.message); return; }
  if (!data || !data.topics) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let totalSwaps = 0;

  const topicKeys = Object.keys(data.topics);

  topicKeys.forEach((topicKey, topicIdx) => {
    const questions = data.topics[topicKey].questions || [];
    let eligibleIdx = 0;
    let topicSwaps = 0;

    questions.forEach(q => {
      if (shouldSkip(q)) return;

      const targetPos = getTargetPosition(topicIdx, eligibleIdx);
      eligibleIdx++;

      if (q.correct === targetPos) return;

      const fromIdx = q.correct;
      const toIdx = targetPos;

      // Find this question's options in the file
      // Search for the question by finding a unique anchor near it
      // Use the question text or first option as anchor
      const anchor = JSON.stringify(q.question || q.options[0]);
      const anchorIdx = content.indexOf(anchor);
      if (anchorIdx === -1) return;

      // Find the options array near this anchor (search within 2000 chars)
      const searchStart = Math.max(0, anchorIdx - 500);
      const searchEnd = Math.min(content.length, anchorIdx + 2000);
      const searchArea = content.substring(searchStart, searchEnd);

      // Find "options": [ or options: [ followed by multi-line values
      const optionsMatch = searchArea.match(/(["']?options["']?\s*:\s*\[)([\s\S]*?)(\])/);
      if (!optionsMatch) return;

      const optionsPrefix = optionsMatch[1];
      const optionsBody = optionsMatch[2];
      const optionsSuffix = optionsMatch[3];

      // Parse individual option values from the multi-line body
      const optionLines = [];
      const optRegex = /(".*?"|'.*?')/g;
      let m;
      while ((m = optRegex.exec(optionsBody)) !== null) {
        optionLines.push(m[1]);
      }

      if (optionLines.length !== 5) return;

      // Swap the two options
      const temp = optionLines[fromIdx];
      optionLines[fromIdx] = optionLines[toIdx];
      optionLines[toIdx] = temp;

      // Rebuild the options body preserving whitespace structure
      // Replace each option value in order
      let newBody = optionsBody;
      const originalOpts = [];
      const origRegex = /(".*?"|'.*?')/g;
      let om;
      while ((om = origRegex.exec(optionsBody)) !== null) {
        originalOpts.push({ value: om[1], index: om.index, length: om[1].length });
      }

      // Replace from end to start to preserve indices
      for (let i = originalOpts.length - 1; i >= 0; i--) {
        const orig = originalOpts[i];
        newBody = newBody.substring(0, orig.index) + optionLines[i] + newBody.substring(orig.index + orig.length);
      }

      // Replace in content
      const fullOld = optionsPrefix + optionsBody + optionsSuffix;
      const fullNew = optionsPrefix + newBody + optionsSuffix;
      const fullOldPos = searchStart + searchArea.indexOf(fullOld);

      if (fullOldPos >= searchStart) {
        content = content.substring(0, fullOldPos) + fullNew + content.substring(fullOldPos + fullOld.length);

        // Now update the correct value
        // Find "correct": N or correct: N near the options
        const correctSearchStart = fullOldPos + fullNew.length;
        const correctSearch = content.substring(correctSearchStart, correctSearchStart + 300);

        // Try JSON format first
        const correctMatch = correctSearch.match(/(["']?correct["']?\s*:\s*)(\d)/);
        if (correctMatch && parseInt(correctMatch[2]) === fromIdx) {
          const correctPos = correctSearchStart + correctSearch.indexOf(correctMatch[0]);
          const newCorrectStr = correctMatch[1] + toIdx;
          content = content.substring(0, correctPos) + newCorrectStr + content.substring(correctPos + correctMatch[0].length);
          topicSwaps++;
        } else if (correctMatch && parseInt(correctMatch[2]) === toIdx) {
          // The correct was already at the target — the other direction of the swap
          const correctPos = correctSearchStart + correctSearch.indexOf(correctMatch[0]);
          const newCorrectStr = correctMatch[1] + fromIdx;
          content = content.substring(0, correctPos) + newCorrectStr + content.substring(correctPos + correctMatch[0].length);
          topicSwaps++;
        }
      }
    });

    if (topicSwaps > 0) {
      console.log(`  ${topicKey.padEnd(22)} ${topicSwaps} swaps`);
      totalSwaps += topicSwaps;
    }
  });

  fs.writeFileSync(filePath, content);
  console.log(`  TOTAL: ${totalSwaps} swaps written to ${path.basename(filePath)}`);
}

// Process English
processFile(
  path.join(__dirname, '..', 'src', 'questionData', 'englishData.js'),
  'ENGLISH',
  () => require('../src/questionData/englishData').default
);

// Process VR
processFile(
  path.join(__dirname, '..', 'src', 'questionData', 'vrData.js'),
  'VR',
  () => require('../src/questionData/vrData').default
);

// Final verification
console.log('\n=== VERIFICATION ===');
['src/questionData/englishData.js', 'src/questionData/vrData.js'].forEach(fp => {
  const content = fs.readFileSync(fp, 'utf8');
  console.log(`\n${path.basename(fp)}:`);

  // Quick count by finding topic sections
  const topicPattern = /["']?([\w]+)["']?\s*:\s*\{[\s\S]*?["']?name["']?\s*:/g;
  let tm;
  const seen = new Set();
  while ((tm = topicPattern.exec(content)) !== null) {
    const topic = tm[1];
    if (seen.has(topic) || topic === 'topics' || topic === 'name') continue;
    seen.add(topic);

    // Find questions section for this topic
    const tStart = tm.index;
    const nextTopicIdx = content.indexOf('"name":', tStart + 100);
    const tEnd = nextTopicIdx > 0 ? nextTopicIdx : content.length;
    const section = content.substring(tStart, tEnd);

    const matches = section.match(/["']?correct["']?\s*:\s*(\d)/g) || [];
    if (matches.length < 10) continue;

    const counts = [0,0,0,0,0];
    matches.forEach(m => counts[parseInt(m.match(/(\d)/)[1])]++);
    const total = matches.length;
    const pcts = counts.map(c => Math.round(c/total*100));
    const maxPct = Math.max(...pcts);
    const flag = maxPct > 28 ? ' <<<' : '';
    console.log('  ' + topic.padEnd(22) + pcts.map(p => String(p).padStart(2) + '%').join(' ') + ' max=' + maxPct + '%' + flag);
  }
});

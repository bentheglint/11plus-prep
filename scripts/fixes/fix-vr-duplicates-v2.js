#!/usr/bin/env node
/**
 * fix-vr-duplicates-v2.js
 *
 * Removes specific duplicate questions by surgically deleting their text blocks
 * from vrData.js, preserving original formatting. Then renumbers IDs.
 *
 * Usage:
 *   node scripts/fix-vr-duplicates-v2.js          # dry run
 *   node scripts/fix-vr-duplicates-v2.js --apply   # write changes
 */

const fs = require('fs');
const path = require('path');

const VR_DATA_PATH = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');

// Oracle-identified duplicates: topic -> [IDs to remove]
const REMOVALS = {
  letterMove: [1, 9, 10, 11, 12, 13, 45, 46, 47, 52, 53, 54, 59, 60, 61, 66, 67, 68, 73, 74, 79, 81, 82, 84, 85, 86],
  hiddenWords: [101, 103, 111, 119, 121, 124],
  verbalAnalogies: [103, 112, 122],
  letterPairSeries: [9, 10, 106, 130],
  oddTwoOut: [101],
};

const raw = fs.readFileSync(VR_DATA_PATH, 'utf8');
const apply = process.argv.includes('--apply');

console.log('=== VR Duplicate Removal v2 (format-preserving) ===\n');

let output = raw;
let totalRemoved = 0;

for (const [topic, idsToRemove] of Object.entries(REMOVALS)) {
  const idSet = new Set(idsToRemove);
  let removed = 0;

  for (const id of idsToRemove) {
    // Match question objects by their id field
    // Pattern: { (or {) followed by whitespace, id: N, ... until the closing }
    // followed by a comma (and optional whitespace/newline)
    //
    // We need to match the entire question object block.
    // Strategy: find `id: <N>,` or `"id": <N>,` within the topic section,
    // then expand to the enclosing { ... } block.

    // Find all occurrences of this id in the file
    const idPatterns = [
      new RegExp(`\\bid:\\s*${id}\\b`),
      new RegExp(`"id":\\s*${id}\\b`),
    ];

    // First, find the topic section boundaries
    const topicStart = output.indexOf(`${topic}:`);
    if (topicStart === -1) {
      // Try with quotes
      const altStart = output.indexOf(`"${topic}":`);
      if (altStart === -1) {
        console.log(`  WARNING: Could not find topic "${topic}"`);
        continue;
      }
    }

    // Find the questions array for this topic
    const topicIdx = output.indexOf(`${topic}:`, 0) !== -1
      ? output.indexOf(`${topic}:`, 0)
      : output.indexOf(`"${topic}":`, 0);

    const questionsIdx = output.indexOf('questions:', topicIdx);
    if (questionsIdx === -1) continue;

    const arrayStart = output.indexOf('[', questionsIdx);
    if (arrayStart === -1) continue;

    // Find the matching ]
    let depth = 0;
    let arrayEnd = -1;
    for (let i = arrayStart; i < output.length; i++) {
      if (output[i] === '[') depth++;
      if (output[i] === ']') { depth--; if (depth === 0) { arrayEnd = i; break; } }
    }
    if (arrayEnd === -1) continue;

    const arrayContent = output.substring(arrayStart, arrayEnd + 1);

    // Find the question object with this id within the array
    // Look for id: N or "id": N
    const idRegex = new RegExp(`(?:id|"id"):\\s*${id}\\s*,`);
    const idMatch = idRegex.exec(arrayContent);
    if (!idMatch) continue;

    // Walk backwards from the id match to find the opening {
    let objStart = -1;
    let braceDepth = 0;
    for (let i = idMatch.index; i >= 0; i--) {
      if (arrayContent[i] === '}') braceDepth++;
      if (arrayContent[i] === '{') {
        if (braceDepth === 0) { objStart = i; break; }
        braceDepth--;
      }
    }
    if (objStart === -1) continue;

    // Walk forward from the id match to find the closing }
    let objEnd = -1;
    braceDepth = 0;
    for (let i = objStart; i < arrayContent.length; i++) {
      if (arrayContent[i] === '{') braceDepth++;
      if (arrayContent[i] === '}') {
        braceDepth--;
        if (braceDepth === 0) { objEnd = i; break; }
      }
    }
    if (objEnd === -1) continue;

    // Include trailing comma and whitespace
    let removeEnd = objEnd + 1;
    while (removeEnd < arrayContent.length && (arrayContent[removeEnd] === ',' || arrayContent[removeEnd] === '\n' || arrayContent[removeEnd] === '\r' || arrayContent[removeEnd] === ' ' || arrayContent[removeEnd] === '\t')) {
      removeEnd++;
      if (arrayContent[removeEnd - 1] === '\n') break; // stop after newline
    }

    const blockToRemove = arrayContent.substring(objStart, removeEnd);

    // Replace in the full output (use the absolute position)
    const absoluteStart = arrayStart + objStart;
    const absoluteEnd = arrayStart + removeEnd;
    output = output.substring(0, absoluteStart) + output.substring(absoluteEnd);

    removed++;
  }

  totalRemoved += removed;
  console.log(`${topic}: removed ${removed}/${idsToRemove.length} questions`);
}

console.log(`\nTotal removed: ${totalRemoved}`);

// Now renumber IDs within affected topics
// Parse the modified output to find and fix IDs
for (const topic of Object.keys(REMOVALS)) {
  const topicIdx = output.indexOf(`${topic}:`, 0) !== -1
    ? output.indexOf(`${topic}:`, 0)
    : output.indexOf(`"${topic}":`, 0);
  if (topicIdx === -1) continue;

  const questionsIdx = output.indexOf('questions:', topicIdx);
  if (questionsIdx === -1) continue;

  const arrayStart = output.indexOf('[', questionsIdx);
  if (arrayStart === -1) continue;

  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < output.length; i++) {
    if (output[i] === '[') depth++;
    if (output[i] === ']') { depth--; if (depth === 0) { arrayEnd = i; break; } }
  }
  if (arrayEnd === -1) continue;

  let arrayContent = output.substring(arrayStart, arrayEnd + 1);

  // Find all id fields and renumber
  let counter = 0;
  arrayContent = arrayContent.replace(/("id"|id)\s*:\s*(\d+)/g, (match, key, oldId) => {
    counter++;
    return `${key}: ${counter}`;
  });

  output = output.substring(0, arrayStart) + arrayContent + output.substring(arrayEnd + 1);
  console.log(`${topic}: renumbered ${counter} questions (1..${counter})`);
}

if (!apply) {
  console.log('\nDry run. Use --apply to write.');

  // Verify line count
  const newLines = output.split('\n').length;
  const oldLines = raw.split('\n').length;
  console.log(`Line count: ${oldLines} → ${newLines} (diff: ${newLines - oldLines})`);
  process.exit(0);
}

fs.writeFileSync(VR_DATA_PATH, output);
console.log(`\nWritten to: ${VR_DATA_PATH}`);

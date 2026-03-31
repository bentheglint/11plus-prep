#!/usr/bin/env node
/**
 * fix-vr-duplicates.js
 *
 * Removes specific duplicate questions identified by the Oracle review.
 * Each entry: keep the first ID, remove the rest.
 * After removal, renumbers IDs sequentially from 1 within each topic.
 *
 * Usage:
 *   node scripts/fix-vr-duplicates.js          # dry run
 *   node scripts/fix-vr-duplicates.js --apply   # write changes
 */

const fs = require('fs');
const path = require('path');

const VR_DATA_PATH = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');

// Oracle-identified duplicates: { topic, remove: [IDs to delete] }
// We keep the first of each group, remove the rest.
const REMOVALS = [
  // === LETTER MOVE (critical) ===
  // Q1/Q7: WHEAT+EAR — Oracle says keep Q7, remove Q1
  { topic: 'letterMove', remove: [1] },
  // Q3/Q12: BRAID+OWL
  { topic: 'letterMove', remove: [12] },
  // Q4/Q9: PLATE+AN
  { topic: 'letterMove', remove: [9] },
  // Q5/Q10: SPARK+OAK
  { topic: 'letterMove', remove: [10] },
  // Q6/Q11: BLOOM+OAT
  { topic: 'letterMove', remove: [11] },
  // Q2/Q13: SPINE+OAR
  { topic: 'letterMove', remove: [13] },
  // Q31/Q45/Q79: OAR+SCOLD x3
  { topic: 'letterMove', remove: [45, 79] },
  // Q32/Q46: AGE+SCOLD x2
  { topic: 'letterMove', remove: [46] },
  // Q33/Q47: OAK+SCOLD x2
  { topic: 'letterMove', remove: [47] },
  // Q34/Q52/Q81: AGE+PRICE x3
  { topic: 'letterMove', remove: [52, 81] },
  // Q35/Q53: LAY+PRICE x2
  { topic: 'letterMove', remove: [53] },
  // Q36/Q54: ACE+PRICE x2
  { topic: 'letterMove', remove: [54] },
  // Q37/Q59/Q82: OAR+STALE x3
  { topic: 'letterMove', remove: [59, 82] },
  // Q38/Q60: AGE+STALE x2
  { topic: 'letterMove', remove: [60] },
  // Q39/Q61: OAK+STALE x2
  { topic: 'letterMove', remove: [61] },
  // Q40/Q66/Q84: OWL+FLAME x3
  { topic: 'letterMove', remove: [66, 84] },
  // Q41/Q67/Q85: ATE+FLAME x3
  { topic: 'letterMove', remove: [67, 85] },
  // Q42/Q68: ACE+FLAME x2
  { topic: 'letterMove', remove: [68] },
  // Q43/Q73/Q86: OAR+STERN x3
  { topic: 'letterMove', remove: [73, 86] },
  // Q44/Q74: AGE+STERN x2
  { topic: 'letterMove', remove: [74] },

  // === HIDDEN WORDS (medium) ===
  // Q23/Q101: LAMP
  { topic: 'hiddenWords', remove: [101] },
  // Q31/Q111: BAND
  { topic: 'hiddenWords', remove: [111] },
  // Q82/Q119: PLEA
  { topic: 'hiddenWords', remove: [119] },
  // Q84/Q121: SAGE
  { topic: 'hiddenWords', remove: [121] },
  // Q76/Q124: VEIL
  { topic: 'hiddenWords', remove: [124] },
  // Q18/Q103: TALL
  { topic: 'hiddenWords', remove: [103] },

  // === VERBAL ANALOGIES (high) ===
  // Q78/Q103: calf+sheep
  { topic: 'verbalAnalogies', remove: [103] },
  // Q11/Q122: conductor+orchestra
  { topic: 'verbalAnalogies', remove: [122] },
  // Q34/Q112: leaf+flower
  { topic: 'verbalAnalogies', remove: [112] },

  // === LETTER PAIR SERIES (high) ===
  // Q1/Q9: A,C,E,G — keep Q1, remove Q9
  { topic: 'letterPairSeries', remove: [9] },
  // Q3/Q10: B,D,F,H
  { topic: 'letterPairSeries', remove: [10] },
  // Q8/Q130: ZZ,YY,XX,WW — keep Q8 (or Q25), remove Q130
  { topic: 'letterPairSeries', remove: [130] },
  // Q26/Q106: A1,B2,C3,D4 — keep Q26, remove Q106
  { topic: 'letterPairSeries', remove: [106] },

  // === ODD TWO OUT (high) ===
  // Q36/Q101: same 5 words (football, cricket, rugby, painting, sculpture)
  { topic: 'oddTwoOut', remove: [101] },
];

// Build a map: topic -> Set of IDs to remove
const removalMap = {};
for (const { topic, remove } of REMOVALS) {
  if (!removalMap[topic]) removalMap[topic] = new Set();
  for (const id of remove) removalMap[topic].add(id);
}

// Read and parse vrData.js
const raw = fs.readFileSync(VR_DATA_PATH, 'utf8');

// Extract the object by evaluating (safe — it's our own data file)
const stripped = raw
  .replace(/^.*?const vrData\s*=\s*/s, '')
  .replace(/;\s*export default vrData;\s*$/s, '');

let vrData;
try {
  vrData = eval('(' + stripped + ')');
} catch (e) {
  console.error('Failed to parse vrData.js:', e.message);
  process.exit(1);
}

// vrData has { name, topics: { ... } } — work with topics
const topics = vrData.topics || vrData;

const apply = process.argv.includes('--apply');

console.log('=== VR Duplicate Removal (Oracle-identified) ===\n');

let totalRemoved = 0;
const changes = {};

for (const [topic, idsToRemove] of Object.entries(removalMap)) {
  if (!topics[topic] || !topics[topic].questions) {
    console.log(`WARNING: Topic "${topic}" not found in vrData!`);
    continue;
  }

  const before = topics[topic].questions.length;
  const removed = [];

  topics[topic].questions = topics[topic].questions.filter(q => {
    if (idsToRemove.has(q.id)) {
      removed.push(`Q${q.id}: "${q.question.substring(0, 60)}..."`);
      return false;
    }
    return true;
  });

  // Renumber IDs
  topics[topic].questions.forEach((q, i) => { q.id = i + 1; });

  const after = topics[topic].questions.length;
  const removedCount = before - after;
  totalRemoved += removedCount;

  console.log(`${topic}: ${before} → ${after} (removed ${removedCount})`);
  for (const r of removed) {
    console.log(`  - ${r}`);
  }
  changes[topic] = { before, after, removedCount };
}

console.log(`\nTotal removed: ${totalRemoved}`);

if (!apply) {
  console.log('\nDry run complete. Use --apply to write changes.');
  process.exit(0);
}

// Rebuild the file
// Strategy: for each topic that changed, find its questions array in the raw text
// and replace it with the new data
let output = raw;

for (const [topic, { removedCount }] of Object.entries(changes)) {
  if (removedCount === 0) continue;

  // Find the questions array for this topic
  // Pattern: topic: { ... questions: [ ... ] ... }
  const topicRegex = new RegExp(
    `(${topic}\\s*:\\s*\\{[^]*?questions\\s*:\\s*)\\[([^]*?)\\](\\s*,?\\s*\\})`,
    's'
  );

  const match = output.match(topicRegex);
  if (!match) {
    // Try alternate: find the questions array more carefully
    // Use indexOf approach
    const topicIdx = output.indexOf(`${topic}:`);
    if (topicIdx === -1) {
      console.error(`Could not locate topic "${topic}" in file`);
      continue;
    }
    console.error(`Could not match regex for topic "${topic}" — skipping write`);
    continue;
  }

  // Rebuild questions array
  const questionsJson = JSON.stringify(topics[topic].questions, null, 6)
    .replace(/\n/g, '\n      '); // indent to match file style

  output = output.replace(topicRegex, `$1${questionsJson}$3`);
}

// Write back
const backupPath = VR_DATA_PATH + '.bak';
fs.writeFileSync(backupPath, raw);
console.log(`\nBackup saved to: ${backupPath}`);

fs.writeFileSync(VR_DATA_PATH, output);
console.log(`Updated: ${VR_DATA_PATH}`);
console.log('Done!');

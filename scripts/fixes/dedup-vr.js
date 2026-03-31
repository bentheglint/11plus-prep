#!/usr/bin/env node
/**
 * dedup-vr.js — Remove duplicate VR questions
 *
 * Usage:
 *   node scripts/dedup-vr.js            # Dry run — shows what would be removed
 *   node scripts/dedup-vr.js --apply    # Actually writes the changes
 *
 * For each topic in vrData.topics, finds questions that are genuine duplicates
 * and removes subsequent occurrences, keeping the first.
 *
 * Duplicate detection uses a content fingerprint: question text + sorted options
 * (or setA/setB for pick-from-sets format). This correctly handles topics where
 * many questions share generic instruction text (e.g. "Find two words...") but
 * have unique content in their options — those are NOT duplicates.
 *
 * After removing duplicates, IDs are renumbered sequentially from 1.
 */

const fs = require('fs');
const path = require('path');

const VR_DATA_PATH = path.join(__dirname, '..', 'src', 'questionData', 'vrData.js');
const applyMode = process.argv.includes('--apply');

// ---------------------------------------------------------------------------
// 1. Read and parse vrData.js
// ---------------------------------------------------------------------------

const raw = fs.readFileSync(VR_DATA_PATH, 'utf8');

// Strip the ES module wrapper so we can eval the object.
// The file looks like:
//   // comments...
//   const vrData = { ... };
//   export default vrData;
//
// We extract the object literal between `const vrData = ` and the final `};`

const startMarker = 'const vrData = ';
const startIdx = raw.indexOf(startMarker);
if (startIdx === -1) {
  console.error('ERROR: Could not find "const vrData = " in vrData.js');
  process.exit(1);
}

// Find the matching closing `};` — it's the last one in the file
const endMarker = '};';
const endIdx = raw.lastIndexOf(endMarker);
if (endIdx === -1 || endIdx <= startIdx) {
  console.error('ERROR: Could not find closing "};" in vrData.js');
  process.exit(1);
}

const objectSource = raw.substring(startIdx + startMarker.length, endIdx + 1);

// Use indirect eval (runs in global scope) to parse the JS object literal.
// This handles trailing commas, unquoted keys, mixed quote styles, etc.
let vrData;
try {
  vrData = (0, eval)('(' + objectSource + ')');
} catch (err) {
  console.error('ERROR: Failed to parse vrData object:', err.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Build fingerprint and find duplicates per topic
// ---------------------------------------------------------------------------

/**
 * Build a content fingerprint for a question. Combines the question text with
 * the sorted content fields (options, setA, setB) so that:
 *   - Questions with identical text but different options are UNIQUE
 *   - Questions with identical text and same options (possibly reordered) are DUPLICATES
 */
function fingerprint(q) {
  const parts = [q.question];

  // Include sorted options — catches reordered option lists
  if (Array.isArray(q.options)) {
    parts.push('opts:' + [...q.options].sort().join('|'));
  }
  // Include setA/setB for pick-from-sets format
  if (Array.isArray(q.setA)) {
    parts.push('setA:' + [...q.setA].sort().join('|'));
  }
  if (Array.isArray(q.setB)) {
    parts.push('setB:' + [...q.setB].sort().join('|'));
  }

  return parts.join('|||');
}

const topics = vrData.topics;
const topicKeys = Object.keys(topics);

let totalRemoved = 0;
const summary = [];

for (const key of topicKeys) {
  const topic = topics[key];
  const questions = topic.questions;
  if (!questions || !Array.isArray(questions)) {
    summary.push({ key, name: topic.name, original: 0, removed: 0, final: 0 });
    continue;
  }

  const original = questions.length;

  // Deduplicate by content fingerprint — keep first occurrence
  const seen = new Map(); // fingerprint -> first index
  const dupeIndices = [];

  for (let i = 0; i < questions.length; i++) {
    const fp = fingerprint(questions[i]);
    if (seen.has(fp)) {
      dupeIndices.push(i);
    } else {
      seen.set(fp, i);
    }
  }

  const removed = dupeIndices.length;
  totalRemoved += removed;

  if (removed > 0) {
    const dupeSet = new Set(dupeIndices);
    topic.questions = questions.filter((_, i) => !dupeSet.has(i));
  }

  // Renumber IDs sequentially from 1
  for (let i = 0; i < topic.questions.length; i++) {
    topic.questions[i].id = i + 1;
  }

  summary.push({ key, name: topic.name, original, removed, final: topic.questions.length });
}

// ---------------------------------------------------------------------------
// 3. Print summary
// ---------------------------------------------------------------------------

console.log('');
console.log('=== VR Question Deduplication Report ===');
console.log(applyMode ? '  MODE: --apply (changes WILL be written)' : '  MODE: dry run (no changes written — use --apply to write)');
console.log('');

const colKey = 22;
const colName = 32;
const colOrig = 8;
const colRem = 10;
const colFinal = 8;

console.log(
  'Topic Key'.padEnd(colKey) +
  'Name'.padEnd(colName) +
  'Before'.padStart(colOrig) +
  'Removed'.padStart(colRem) +
  'After'.padStart(colFinal)
);
console.log('-'.repeat(colKey + colName + colOrig + colRem + colFinal));

for (const row of summary) {
  console.log(
    row.key.padEnd(colKey) +
    row.name.padEnd(colName) +
    String(row.original).padStart(colOrig) +
    String(row.removed).padStart(colRem) +
    String(row.final).padStart(colFinal)
  );
}

console.log('-'.repeat(colKey + colName + colOrig + colRem + colFinal));

const totalBefore = summary.reduce((s, r) => s + r.original, 0);
const totalAfter = summary.reduce((s, r) => s + r.final, 0);

console.log(
  'TOTAL'.padEnd(colKey) +
  ''.padEnd(colName) +
  String(totalBefore).padStart(colOrig) +
  String(totalRemoved).padStart(colRem) +
  String(totalAfter).padStart(colFinal)
);
console.log('');

if (totalRemoved === 0) {
  console.log('No duplicates found. Nothing to do.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 4. Write back if --apply
// ---------------------------------------------------------------------------

if (!applyMode) {
  console.log(`Found ${totalRemoved} duplicate(s) to remove.`);
  console.log('Run with --apply to write changes to vrData.js');
  process.exit(0);
}

// Rebuild the file. We serialise each topic's questions with consistent formatting.
// The approach: use a custom serialiser that handles the mixed property formats.

function serialiseValue(val, indent) {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'string') {
    // Use double quotes, escape internal double quotes and backslashes
    const escaped = val
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    // Check if it's a simple array (all primitives)
    const allPrimitive = val.every(v => typeof v !== 'object' || v === null);
    if (allPrimitive && val.length <= 6) {
      // Inline array
      const items = val.map(v => serialiseValue(v, indent));
      const inline = '[' + items.join(', ') + ']';
      if (inline.length < 100) return inline;
    }
    // Multi-line array
    const inner = indent + '  ';
    const items = val.map(v => inner + serialiseValue(v, inner));
    return '[\n' + items.join(',\n') + '\n' + indent + ']';
  }
  if (typeof val === 'object') {
    return serialiseQuestion(val, indent);
  }
  return String(val);
}

function serialiseQuestion(q, indent) {
  const inner = indent + '  ';
  const lines = [];
  lines.push(indent + '{');
  const keys = Object.keys(q);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const v = q[k];
    const comma = i < keys.length - 1 ? ',' : '';
    // Use quoted keys for consistency
    lines.push(`${inner}"${k}": ${serialiseValue(v, inner)}${comma}`);
  }
  lines.push(indent + '}');
  return lines.join('\n');
}

function serialiseTopic(key, topic, indent) {
  const inner = indent + '  ';
  const qInner = inner + '  ';
  const lines = [];
  lines.push(`${indent}${key}: {`);
  lines.push(`${inner}name: ${serialiseValue(topic.name, inner)},`);
  lines.push(`${inner}questions: [`);

  for (let i = 0; i < topic.questions.length; i++) {
    const q = topic.questions[i];
    const comma = i < topic.questions.length - 1 ? ',' : '';
    lines.push(serialiseQuestion(q, qInner) + comma);
  }

  lines.push(`${inner}]`);
  lines.push(`${indent}}`);
  return lines.join('\n');
}

// Build the full file
const outputLines = [];
outputLines.push('// Verbal Reasoning question data for 11+ GL Assessment prep');
outputLines.push('// 16 topics covering all GL question types');
outputLines.push('// All content is 100% original — no published material copied or paraphrased');
outputLines.push('// Supports standard MC, select-two, and pick-from-sets question formats');
outputLines.push('');
outputLines.push('const vrData = {');
outputLines.push('  name: "Verbal Reasoning",');
outputLines.push('  topics: {');

for (let i = 0; i < topicKeys.length; i++) {
  const key = topicKeys[i];
  const topic = topics[key];
  const comma = i < topicKeys.length - 1 ? ',' : '';
  outputLines.push(serialiseTopic(key, topic, '    ') + comma);
}

outputLines.push('  }');
outputLines.push('};');
outputLines.push('');
outputLines.push('export default vrData;');
outputLines.push('');

const output = outputLines.join('\n');

// Write with a backup first
const backupPath = VR_DATA_PATH + '.bak';
fs.copyFileSync(VR_DATA_PATH, backupPath);
console.log(`Backup saved to: ${backupPath}`);

fs.writeFileSync(VR_DATA_PATH, output, 'utf8');
console.log(`Written ${topicKeys.length} topics (${totalAfter} questions) to vrData.js`);
console.log(`Removed ${totalRemoved} duplicate(s).`);
console.log('Done.');

#!/usr/bin/env node
/**
 * apply-letter-sums-tips.js
 *
 * Applies Oracle's rewritten explanations to the Letter Sums topic in
 * src/questionData/vrData.js.
 *
 * Strategy: parse the file as text, locate each Letter Sums question by
 * its surrounding structure (id + the letterSums topic block), then
 * replace the explanation string. We use a conservative regex that only
 * rewrites the explanation field of questions whose id matches.
 *
 * Source of truth: scripts/letter-sums-tip-rewrites.json
 *
 * Run: node scripts/apply-letter-sums-tips.js
 */

const fs = require('fs');
const path = require('path');

const VR_PATH = path.resolve(__dirname, '..', 'src', 'questionData', 'vrData.js');
const REWRITES_PATH = path.resolve(__dirname, 'letter-sums-tip-rewrites.json');

const rewrites = JSON.parse(fs.readFileSync(REWRITES_PATH, 'utf8'));
let source = fs.readFileSync(VR_PATH, 'utf8');

// Find the Letter Sums topic block bounds.
const lsStart = source.search(/letterSums:\s*\{/);
if (lsStart === -1) {
  console.error('Could not find letterSums topic');
  process.exit(1);
}
// Find the matching close — we scan for the next topic declaration at the
// same indentation level. In this codebase that's "^    [a-z]+: \{".
const afterLs = source.slice(lsStart + 12);
const nextTopicMatch = afterLs.search(/\n    [a-zA-Z]+:\s*\{/);
const lsEnd = nextTopicMatch === -1 ? source.length : lsStart + 12 + nextTopicMatch;

const lsBlock = source.slice(lsStart, lsEnd);
console.log(`Letter Sums block: chars ${lsStart}–${lsEnd} (${lsEnd - lsStart} chars)`);

// Escape helper for strings used in regex
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// For each id in rewrites, replace the explanation.
// Pattern (robust across D1/D2/D3 variants of the file):
//   id: N,
//   ... (other keys)
//   explanation: "..."
// We match from `id: N,` up to the next `explanation: "..."` line.
let patched = lsBlock;
let applied = 0;
let skipped = [];

for (const [idStr, newExplanation] of Object.entries(rewrites)) {
  const id = Number(idStr);
  // Match: id: N, followed by anything up to explanation: "...",
  // Use a capture group around the explanation string literal.
  // The explanation is always double-quoted and ends with ", or ",\n
  const re = new RegExp(
    `(id:\\s*${id},[\\s\\S]*?explanation:\\s*)"[^"]*"`,
    'g'
  );
  const before = patched;
  // Escape newExplanation for JS string literal (preserve as-is since source uses double-quoted strings)
  // The JSON value is already unescaped; we need to re-escape for JS double-quoted string.
  const escaped = newExplanation
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
  patched = patched.replace(re, `$1"${escaped}"`);
  if (patched === before) {
    skipped.push(id);
  } else {
    applied++;
  }
}

// Splice the patched block back into the full source.
const newSource = source.slice(0, lsStart) + patched + source.slice(lsEnd);

// Only write if changes were made
if (newSource !== source) {
  fs.writeFileSync(VR_PATH, newSource);
  console.log(`\nApplied ${applied}/${Object.keys(rewrites).length} rewrites.`);
  if (skipped.length) {
    console.log(`Skipped (not found): Q${skipped.join(', Q')}`);
  }
} else {
  console.log('No changes to write.');
}

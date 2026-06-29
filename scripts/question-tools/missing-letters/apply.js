// Splice a finalised .jsonl into vrData.js, replacing an id range in place.
// Dry-run by default — pass --write to actually modify the file.
// The anchor logic is copied verbatim from the working apply-final.js session script;
// only topicKey and idStart/idEnd are parameterised.
//
// Usage:
//   node scripts/question-tools/missing-letters/apply.js            # dry-run
//   node scripts/question-tools/missing-letters/apply.js --write    # write to vrData.js

'use strict';
const fs   = require('fs');
const path = require('path');
const { REPO } = require('./lib');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const CONFIG = {
  topicKey:  'missingLettersWords',
  vrDataPath: path.join(REPO, 'src/questionData/vrData.js'),
  inputPath:  path.join(__dirname, 'final.jsonl'),   // output of assemble.js
  idStart: 46,
  idEnd:   150,
};
// ─────────────────────────────────────────────────────────────────────────────

const WRITE = process.argv.includes('--write');

// ── Load & validate input ─────────────────────────────────────────────────────
const all = fs.readFileSync(CONFIG.inputPath, 'utf8').trim().split('\n').map(JSON.parse);
const expected = CONFIG.idEnd - CONFIG.idStart + 1;
const errs = [];
if (all.length !== expected) errs.push(`expected ${expected} items, got ${all.length}`);
all.forEach((q, i) => {
  if (q.id !== CONFIG.idStart + i) errs.push(`seq break at id ${q.id}`);
  if (!Array.isArray(q.options) || q.options.length !== 5 || new Set(q.options).size !== 5)
    errs.push(`id ${q.id}: options not 5-unique`);
  if (q.correct < 0 || q.correct > 4 || q.options[q.correct] == null)
    errs.push(`id ${q.id}: correct out of bounds`);
  if (!q.explanation.trim().endsWith('✓')) errs.push(`id ${q.id}: no tick`);
  if (!q.question.includes('CAPITALS')) errs.push(`id ${q.id}: stem missing CAPITALS`);
});
if (errs.length) { console.error('VALIDATION FAILED:\n' + errs.join('\n')); process.exit(1); }

// ── Render a single question object to vrData.js indentation ─────────────────
function render(q) {
  return [
    '        {',
    `          id: ${q.id},`,
    `          difficulty: ${q.difficulty},`,
    `          question: ${JSON.stringify(q.question)},`,
    `          options: ${JSON.stringify(q.options)},`,
    `          correct: ${q.correct},`,
    `          explanation: ${JSON.stringify(q.explanation)}`,
    '        }',
  ].join('\n');
}
const newText = all.map(render).join(',\n') + '\n';

// ── Locate anchors in vrData.js ───────────────────────────────────────────────
let content = fs.readFileSync(CONFIG.vrDataPath, 'utf8');

const topicStart = content.indexOf(CONFIG.topicKey + ':');
if (topicStart < 0) { console.error(`topic "${CONFIG.topicKey}:" not found in vrData.js`); process.exit(1); }

// Find the next top-level topic key to bound the block search
const nextRe = /\n    [a-zA-Z]+:/g;
nextRe.lastIndex = topicStart + CONFIG.topicKey.length + 1;
const nextMatch = nextRe.exec(content);
const nextTopic = nextMatch ? nextMatch.index : content.length;

const idxFirst = content.indexOf(`\n          id: ${CONFIG.idStart},`, topicStart);
const objStart = content.lastIndexOf('        {', idxFirst);
const idxClose = content.lastIndexOf('      ]', nextTopic);

if (idxFirst < 0 || objStart < 0 || idxClose < 0 || idxFirst > nextTopic) {
  console.error('anchor failure — could not locate id range or closing ] in topic block');
  process.exit(1);
}

const before = content.slice(0, objStart);
const after  = content.slice(idxClose);

// ── Assertions: exact structural guards (copied verbatim from apply-final.js) ─
if (!before.endsWith('        },\n')) {
  console.error('before-anchor mismatch: ...' + JSON.stringify(before.slice(-24)));
  process.exit(1);
}
if (!after.startsWith('      ]')) {
  console.error('after-anchor mismatch: ' + JSON.stringify(after.slice(0, 12)));
  process.exit(1);
}

const updated = before + newText + after;

// sanity: every id in idStart..idEnd appears exactly once in the new slice
const slice = updated.slice(objStart, updated.indexOf('      ]', objStart));
for (let id = CONFIG.idStart; id <= CONFIG.idEnd; id++) {
  const n = (slice.match(new RegExp(`\\n          id: ${id},`, 'g')) || []).length;
  if (n !== 1) { console.error(`id ${id} appears ${n}x in new slice (expected 1)`); process.exit(1); }
}

console.log(`anchors OK | bytes before: ${content.length} -> after: ${updated.length} | delta ${updated.length - content.length}`);
console.log(`new topic items: ${all.length} (ids ${CONFIG.idStart}-${CONFIG.idEnd}, each exactly once)`);

if (WRITE) {
  fs.writeFileSync(CONFIG.vrDataPath, updated, 'utf8');
  console.log('WROTE vrData.js');
} else {
  console.log('DRY RUN — pass --write to apply');
}

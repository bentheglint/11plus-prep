#!/usr/bin/env node
// Verify English rebalance content (benchmark fix #10) before insert.
// Structural gates (spec: research/english-10-rebalance-spec.md, Harness section):
//  - generic MCQ fields: difficulty 1-3, options[5] distinct strings, correct 0-4,
//    question non-empty, explanation non-empty ending "✓".
//  - error-spotting (sub-fix A/B): segments = 4 non-empty strings; options EXACTLY the
//    fixed 5 section labels; _errorInSegment consistent with correct (-1 <-> correct=4,
//    0-3 <-> correct===_errorInSegment).
//  - narrative error-spotting (has `passage`): passage >=6 sentence-ending marks +
//    passageId/passageTitle.
//  - passage-anchored vocab (questionType:"passage"): passage/passageId/passageTitle present;
//    (report-only) question should reference the passage sense.
// Report-only (never fails): vocab longest-answer-tell per difficulty (warn >25%), punctuation
// _skill mix + projected capitals+end-punct share, passage reuse counts.
//
// Usage: node scripts/data-generation/verify-english10.mjs [path.json] [--full]
//        node scripts/data-generation/verify-english10.mjs --data path.json [--full]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
// Default working-file location, resolved RELATIVE TO THE REPO. This used to
// hard-code one machine's Claude scratchpad path (C:/Users/benja/...), so the
// script's defaults only worked on the laptop — the same portability trap that
// kept the diagram-design skill invisible to git for weeks. Pass the explicit
// --data/--target flags for a real run; override the default with the
// MATHS_INSERT_SCRATCHPAD env var if you keep working files elsewhere.
const SP = process.env.MATHS_INSERT_SCRATCHPAD
  || path.join(REPO, 'scripts', 'data-generation', 'work');

const full = process.argv.includes('--full');
function argVal(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const positional = process.argv.slice(2).find(a => !a.startsWith('--') && process.argv[process.argv.indexOf(a) - 1] !== '--data');
const inputPath = path.resolve(argVal('--data') || positional || path.join(SP, 'english10-clean.json'));

// Baseline facts (Ben, 22 Jul 2026): punctuation topic today.
const BASELINE_PUNCT_TOTAL = 430;
const BASELINE_PUNCT_CAPEND = 64;
const CAPEND_SKILLS = new Set(['capital', 'end-punctuation']);
const SECTION_OPTIONS = ['Section A', 'Section B', 'Section C', 'Section D', 'No mistake'];

function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
function countSentenceEnds(text) { const m = text.match(/[.!?]/g); return m ? m.length : 0; }

if (!fs.existsSync(inputPath)) { console.error('Input not found:', inputPath); process.exit(1); }
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const fails = [];
const warnings = [];
const skillCounts = {};       // topicKey -> _skill -> count (error-spotting items only)
let punctuationNewCount = 0;  // new error-spotting items appended to punctuation topic
let punctuationNewCapEnd = 0;
const vocabByDifficulty = {}; // difficulty -> {total, longest}
const passageQCount = {};     // passageId -> question count

for (const topicKey of Object.keys(data)) {
  const items = data[topicKey];
  if (!Array.isArray(items)) { fails.push(`[${topicKey}] topic value is not an array`); continue; }

  items.forEach((item, idx) => {
    const id = item.id ?? `idx${idx}`;
    const tag = `[${topicKey}#${id}]`;

    // ---- generic fields ----
    if (!(Number.isInteger(item.difficulty) && item.difficulty >= 1 && item.difficulty <= 3)) {
      fails.push(`${tag} difficulty must be integer 1-3, got ${JSON.stringify(item.difficulty)}`);
    }
    if (!Array.isArray(item.options) || item.options.length !== 5) {
      fails.push(`${tag} options must be an array of exactly 5, got ${Array.isArray(item.options) ? item.options.length : typeof item.options}`);
    } else {
      if (!item.options.every(o => typeof o === 'string')) fails.push(`${tag} all options must be strings`);
      if (new Set(item.options).size !== item.options.length) fails.push(`${tag} options must be distinct — duplicate found`);
    }
    if (!(Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 4)) {
      fails.push(`${tag} correct must be integer 0-4, got ${JSON.stringify(item.correct)}`);
    }
    if (!isNonEmptyString(item.question)) fails.push(`${tag} question must be a non-empty string`);
    if (!isNonEmptyString(item.explanation)) {
      fails.push(`${tag} explanation must be a non-empty string`);
    } else if (!/✓\s*$/.test(item.explanation)) {
      fails.push(`${tag} explanation must end with ✓ (trailing whitespace ok)`);
    }

    const isErrorSpotting = item.questionType === 'error-spotting';
    const isPassageVocab = item.questionType === 'passage';

    // ---- error-spotting (sub-fix A/B) ----
    if (isErrorSpotting) {
      if (!Array.isArray(item.segments) || item.segments.length !== 4 || !item.segments.every(isNonEmptyString)) {
        fails.push(`${tag} segments must be an array of exactly 4 non-empty strings`);
      }
      if (!Array.isArray(item.options) || item.options.length !== 5 || !SECTION_OPTIONS.every((o, i) => item.options[i] === o)) {
        fails.push(`${tag} options must be EXACTLY ${JSON.stringify(SECTION_OPTIONS)}`);
      }
      if (item._errorInSegment === undefined) {
        fails.push(`${tag} _errorInSegment is required on error-spotting items`);
      } else if (item._errorInSegment === -1) {
        if (item.correct !== 4) fails.push(`${tag} _errorInSegment=-1 requires correct=4, got ${JSON.stringify(item.correct)}`);
      } else if (Number.isInteger(item._errorInSegment) && item._errorInSegment >= 0 && item._errorInSegment <= 3) {
        if (item.correct !== item._errorInSegment) fails.push(`${tag} correct (${item.correct}) must equal _errorInSegment (${item._errorInSegment})`);
      } else {
        fails.push(`${tag} _errorInSegment must be -1 or 0-3, got ${JSON.stringify(item._errorInSegment)}`);
      }

      // narrative sub-check (sub-fix B): item carries a passage
      if (isNonEmptyString(item.passage)) {
        const ends = countSentenceEnds(item.passage);
        if (ends < 6) fails.push(`${tag} narrative passage must have >=6 sentence-ending marks, found ${ends}`);
        if (!isNonEmptyString(item.passageId)) fails.push(`${tag} narrative item missing passageId`);
        if (!isNonEmptyString(item.passageTitle)) fails.push(`${tag} narrative item missing passageTitle`);
        if (isNonEmptyString(item.passageId)) passageQCount[item.passageId] = (passageQCount[item.passageId] || 0) + 1;
      }

      if (topicKey === 'punctuation') {
        punctuationNewCount++;
        if (CAPEND_SKILLS.has(item._skill)) punctuationNewCapEnd++;
      }
      if (item._skill) {
        skillCounts[topicKey] = skillCounts[topicKey] || {};
        skillCounts[topicKey][item._skill] = (skillCounts[topicKey][item._skill] || 0) + 1;
      }
    }

    // ---- passage-anchored vocab (sub-fix C) ----
    if (isPassageVocab) {
      if (!isNonEmptyString(item.passage)) fails.push(`${tag} passage-vocab item missing non-empty passage`);
      if (!isNonEmptyString(item.passageId)) fails.push(`${tag} passage-vocab item missing passageId`);
      if (!isNonEmptyString(item.passageTitle)) fails.push(`${tag} passage-vocab item missing passageTitle`);
      if (isNonEmptyString(item.passageId)) passageQCount[item.passageId] = (passageQCount[item.passageId] || 0) + 1;

      const qLower = (item.question || '').toLowerCase();
      if (!(qLower.includes('passage') || qLower.includes('here') || qLower.includes('as used'))) {
        warnings.push(`${tag} question doesn't obviously reference the passage sense ("passage"/"here"/"as used"): "${item.question}"`);
      }

      if (Array.isArray(item.options) && item.options.length === 5 && Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= 4) {
        const d = item.difficulty;
        vocabByDifficulty[d] = vocabByDifficulty[d] || { total: 0, longest: 0 };
        vocabByDifficulty[d].total++;
        const lens = item.options.map(o => (o || '').length);
        const maxLen = Math.max(...lens);
        const numAtMax = lens.filter(l => l === maxLen).length;
        if (lens[item.correct] === maxLen && numAtMax === 1) vocabByDifficulty[d].longest++;
      }
    }
  });
}

// ---------------- report ----------------
let totalItems = 0;
Object.values(data).forEach(a => { if (Array.isArray(a)) totalItems += a.length; });

console.log('=== VERIFY ENGLISH10 ===');
console.log('input:', inputPath);
console.log('topics:', Object.keys(data).join(', '));
console.log('total items:', totalItems);

console.log('\n--- HARD CHECKS ---');
if (fails.length) {
  console.log(`FAIL: ${fails.length} issue(s)`);
  fails.forEach(f => console.log('  - ' + f));
} else {
  console.log('PASS: all structural checks OK');
}

if (warnings.length) {
  console.log('\n--- WARNINGS (non-blocking) ---');
  warnings.forEach(w => console.log('  - ' + w));
}

console.log('\n--- REPORT ONLY ---');
for (const d of [1, 2, 3]) {
  const s = vocabByDifficulty[d];
  if (s && s.total) {
    const pct = (s.longest / s.total) * 100;
    const flag = pct > 25 ? '  *** WARN: >25% ***' : '';
    console.log(`vocab longest-answer tell D${d}: ${s.longest}/${s.total} (${pct.toFixed(1)}%)${flag}`);
  }
}
if (punctuationNewCount > 0) {
  const projTotal = BASELINE_PUNCT_TOTAL + punctuationNewCount;
  const projCapEnd = BASELINE_PUNCT_CAPEND + punctuationNewCapEnd;
  console.log(`punctuation mix projection: baseline ${BASELINE_PUNCT_CAPEND}/${BASELINE_PUNCT_TOTAL} (${(BASELINE_PUNCT_CAPEND / BASELINE_PUNCT_TOTAL * 100).toFixed(1)}%) cap+end`);
  console.log(`  -> projected ${projCapEnd}/${projTotal} (${(projCapEnd / projTotal * 100).toFixed(1)}%) after appending +${punctuationNewCount} (${punctuationNewCapEnd} cap+end)`);
}
for (const [topicKey, skills] of Object.entries(skillCounts)) {
  console.log(`${topicKey} _skill breakdown: ${JSON.stringify(skills)}`);
}
const passageEntries = Object.entries(passageQCount);
if (passageEntries.length) {
  console.log('passage reuse (questions per passageId):');
  passageEntries.forEach(([pid, c]) => console.log(`  ${pid}: ${c}`));
}
if (full) console.log('\n(--full: reserved, no additional checks yet)');

console.log('\n=== ' + (fails.length ? 'FAIL' : 'PASS') + ' ===');
process.exit(fails.length ? 1 : 0);

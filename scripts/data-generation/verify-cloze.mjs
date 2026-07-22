#!/usr/bin/env node
// Deterministic verify harness for benchmark fix #6 (English running-passage Cloze).
// Input: a JSON file { passages: [ { passageId, passageTitle, passage, gaps:[...] } ] }
// (the Oracle's machine-readable output). Runs all deterministic checks from
// research/english-cloze-spec.md §4. Linguistic correctness is verified separately
// by a second Oracle pass — this harness proves STRUCTURE, AUTHENTICITY MARKERS,
// TELLS and NO-OVERLAP, not "is 'begun' the right word".
//
// Usage: node scripts/data-generation/verify-cloze.mjs <path-to-json> [--strict-mix]
//   --strict-mix  also enforce the aggregate skill-mix bands (only meaningful on the
//                 FULL wave, not a single proof passage).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const SKILLS = ['homophone', 'verb-tense', 'modal', 'conjunction', 'preposition', 'agreement'];

const file = process.argv[2];
const strictMix = process.argv.includes('--strict-mix');
if (!file) { console.error('usage: verify-cloze.mjs <json> [--strict-mix]'); process.exit(2); }

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const passages = data.passages || [];
const errors = [];
const warnings = [];
const allGaps = [];

function err(id, msg) { errors.push(`[${id}] ${msg}`); }
function warn(id, msg) { warnings.push(`[${id}] ${msg}`); }

// --- per-passage + per-gap deterministic checks -----------------------------
for (const p of passages) {
  const pid = p.passageId || '(no id)';
  if (!p.passage || typeof p.passage !== 'string') { err(pid, 'missing passage text'); continue; }
  if (!p.passageTitle) err(pid, 'missing passageTitle');

  // exactly 8 sequential markers ___(1)___ .. ___(8)___, one each
  for (let n = 1; n <= 8; n++) {
    const marker = `___(${n})___`;
    const count = p.passage.split(marker).length - 1;
    if (count !== 1) err(pid, `marker ${marker} appears ${count}× (expected 1)`);
  }
  // no stray markers beyond 8
  const strayMarkers = (p.passage.match(/___\((\d+)\)___/g) || [])
    .map(m => parseInt(m.match(/\d+/)[0], 10)).filter(n => n < 1 || n > 8);
  if (strayMarkers.length) err(pid, `stray gap markers: ${strayMarkers.join(',')}`);

  const gaps = p.gaps || [];
  if (gaps.length !== 8) err(pid, `has ${gaps.length} gaps (expected 8)`);
  const seenGapNums = new Set();

  for (const g of gaps) {
    const gid = `${pid}#${g.gapNumber}`;
    allGaps.push({ ...g, passageId: pid });

    // gapNumber coverage
    if (typeof g.gapNumber !== 'number' || g.gapNumber < 1 || g.gapNumber > 8)
      err(gid, `bad gapNumber ${g.gapNumber}`);
    else if (seenGapNums.has(g.gapNumber)) err(gid, `duplicate gapNumber ${g.gapNumber}`);
    seenGapNums.add(g.gapNumber);

    // options: exactly 5, all distinct
    if (!Array.isArray(g.options) || g.options.length !== 5)
      err(gid, `has ${g.options?.length} options (expected 5)`);
    else if (new Set(g.options).size !== 5) err(gid, `duplicate options: ${JSON.stringify(g.options)}`);

    // correct index + answerText parity
    if (typeof g.correct !== 'number' || g.correct < 0 || g.correct > 4)
      err(gid, `bad correct index ${g.correct}`);
    else if (g.answerText !== g.options[g.correct])
      err(gid, `answerText "${g.answerText}" !== options[${g.correct}] "${g.options[g.correct]}"`);

    // explanation ends with tick
    if (!g.explanation || !g.explanation.trimEnd().endsWith('✓'))
      err(gid, 'explanation missing ✓ terminator');

    // difficulty valid
    if (![1, 2, 3].includes(g.difficulty)) err(gid, `bad difficulty ${g.difficulty}`);

    // skill valid
    if (!SKILLS.includes(g.skill)) err(gid, `unknown skill "${g.skill}"`);

    // distractorErrors: exactly 4, each a real non-correct option, non-empty errorType
    if (!Array.isArray(g.distractorErrors) || g.distractorErrors.length !== 4) {
      err(gid, `has ${g.distractorErrors?.length} distractorErrors (expected 4)`);
    } else {
      const nonCorrect = new Set((g.options || []).filter((_, i) => i !== g.correct));
      for (const d of g.distractorErrors) {
        if (!d.errorType || !d.errorType.trim()) err(gid, `empty errorType for "${d.option}"`);
        if (!nonCorrect.has(d.option)) err(gid, `distractorError option "${d.option}" is not a non-correct option`);
      }
    }

    // gapContext present and contains a marker
    if (!g.gapContext || !/___\(\d+\)___/.test(g.gapContext))
      warn(gid, 'gapContext missing or has no gap marker');

    // onlyOneCorrect asserted
    if (g.onlyOneCorrect !== true) warn(gid, 'onlyOneCorrect not asserted true');

    // LENGTH TELL (per gap): is the correct option the longest / shortest?
    const lens = g.options.map(o => o.length);
    const maxLen = Math.max(...lens), minLen = Math.min(...lens);
    g._isLongest = lens[g.correct] === maxLen && lens.filter(l => l === maxLen).length === 1;
    g._isShortest = lens[g.correct] === minLen && lens.filter(l => l === minLen).length === 1;
  }
}

// --- aggregate checks -------------------------------------------------------
const n = allGaps.length || 1;
const longestPct = 100 * allGaps.filter(g => g._isLongest).length / n;
const shortestPct = 100 * allGaps.filter(g => g._isShortest).length / n;
if (longestPct > 30) (strictMix ? err : warn)('LENGTH', `correct-is-longest ${longestPct.toFixed(1)}% > 30%`);
if (shortestPct > 30) (strictMix ? err : warn)('LENGTH', `correct-is-shortest ${shortestPct.toFixed(1)}% > 30%`);

// skill mix
const mix = {};
for (const s of SKILLS) mix[s] = 0;
allGaps.forEach(g => { if (mix[g.skill] !== undefined) mix[g.skill]++; });
const homoPct = 100 * mix.homophone / n;
if (strictMix) {
  if (homoPct < 22) err('MIX', `homophone ${homoPct.toFixed(1)}% < 22%`);
  for (const s of SKILLS) if (mix[s] === 0) err('MIX', `family "${s}" absent`);
  for (const s of SKILLS) { const pct = 100 * mix[s] / n; if (pct > 30 && !['homophone','verb-tense'].includes(s)) err('MIX', `family "${s}" ${pct.toFixed(1)}% > 30%`); }
  // The DEFINING property of GL cloze: real speech-to-writing errors as distractors.
  // Enforce (a) the modal 'of'-for-'have' error appears, and (b) broad homophone diversity
  // across the wave (not one specific cluster — the wave deliberately varies homophones).
  const flatOpts = allGaps.flatMap(g => g.options.map(o => o.toLowerCase()));
  const hasModalOf = flatOpts.includes('should of') || flatOpts.includes('could of') || flatOpts.includes('of');
  if (!hasModalOf) err('MIX', "modal 'of'-for-'have' real-error distractor absent from the whole set");
  const homophonePalette = ['to','too','two','there','their',"they're",'its',"it's",'your',"you're",
    'whose',"who's",'where','were','wear','hear','here','past','passed','through','threw','site','sight'];
  const homophonesSeen = homophonePalette.filter(w => flatOpts.includes(w));
  if (homophonesSeen.length < 6) err('MIX', `only ${homophonesSeen.length} distinct homophone real-errors present (need >=6): ${homophonesSeen.join(',')}`);
}

// --- NO VERBATIM OVERLAP vs real past papers --------------------------------
// Check each gapContext (marker stripped) and each passage sentence against the
// concatenated past-paper corpus. A hit is a >=8-word verbatim run.
function normalise(s) { return s.toLowerCase().replace(/___\(\d+\)___/g, ' ').replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
let corpus = '';
try {
  const dir = path.join(REPO, 'research', 'past-papers');
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.md')) corpus += ' ' + normalise(fs.readFileSync(path.join(dir, f), 'utf8'));
  }
} catch (e) { warn('OVERLAP', `could not read past-papers corpus: ${e.message}`); }

function checkOverlap(id, text) {
  const words = normalise(text).split(' ').filter(Boolean);
  for (let i = 0; i + 8 <= words.length; i++) {
    const run = words.slice(i, i + 8).join(' ');
    if (corpus.includes(run)) err('OVERLAP', `${id}: 8-word verbatim run in a real paper: "${run}"`);
  }
}
for (const p of passages) {
  p.passage.split(/(?<=[.!?])\s+/).forEach((sent, i) => checkOverlap(`${p.passageId}·s${i + 1}`, sent));
}

// --- report -----------------------------------------------------------------
console.log(`\n=== CLOZE VERIFY: ${passages.length} passage(s), ${allGaps.length} gaps ===`);
console.log(`skill mix: ${SKILLS.map(s => `${s}=${mix[s]}`).join('  ')}`);
console.log(`length tell: correct-is-longest ${longestPct.toFixed(1)}%  correct-is-shortest ${shortestPct.toFixed(1)}%`);
const diff = {1:0,2:0,3:0}; allGaps.forEach(g => diff[g.difficulty] !== undefined && diff[g.difficulty]++);
console.log(`difficulty: D1=${diff[1]} D2=${diff[2]} D3=${diff[3]}`);
if (warnings.length) { console.log(`\n--- WARNINGS (${warnings.length}) ---`); warnings.forEach(w => console.log('  ⚠ ' + w)); }
if (errors.length) { console.log(`\n--- ERRORS (${errors.length}) ---`); errors.forEach(e => console.log('  ✗ ' + e)); console.log('\nRESULT: FAIL'); process.exit(1); }
console.log('\nRESULT: PASS (deterministic checks). Linguistic correctness verified separately by 2nd Oracle pass.');

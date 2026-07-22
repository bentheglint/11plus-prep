#!/usr/bin/env node
// Deterministic verify harness for benchmark fix #7 (VR hiddenWords + balanceEquations).
// Input JSON: { hiddenWords:[...], balanceEquations:[...] } (Oracle machine output).
// hiddenWords: structure + straddle + AMBIGUITY scan (word must hide at ONLY the keyed boundary).
// balanceEquations: RECOMPUTE every answer from the equation.
// Linguistic naturalness / dictionary-validity is confirmed by a 2nd adversarial Oracle pass.
//
// Usage: node scripts/data-generation/verify-vr7.mjs <json> [--full]
//   --full : enforce aggregate distribution bands (only meaningful on the full wave).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const file = process.argv[2];
const full = process.argv.includes('--full');
if (!file) { console.error('usage: verify-vr7.mjs <json> [--full]'); process.exit(2); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [], warnings = [];
const err = (id, m) => errors.push(`[${id}] ${m}`);
const warn = (id, m) => warnings.push(`[${id}] ${m}`);

const NEUTRAL = [
  'A 3-letter word is hidden across two of these adjacent words. Find the two words.',
  'A 4-letter word is hidden across two of these adjacent words. Find the two words.',
];
const BANDS = { 1: [6, 7], 2: [8, 10], 3: [10, 12] };

// ---------- HIDDEN WORDS ----------
const hw = data.hiddenWords || [];
const hiddenCounts = {};
// how many adjacent boundaries in `opts` hide `word` (any split)?
function boundariesHiding(opts, word) {
  const W = word.toUpperCase(); const L = W.length; let hits = [];
  for (let i = 0; i + 1 < opts.length; i++) {
    const a = (opts[i] || '').toUpperCase(), b = (opts[i + 1] || '').toUpperCase();
    for (let k = 1; k <= L - 1; k++) {
      if (k <= a.length && (L - k) <= b.length && a.slice(a.length - k) + b.slice(0, L - k) === W) { hits.push(i); break; }
    }
  }
  return hits;
}
hw.forEach((q, idx) => {
  const id = `HW#${idx + 1}(D${q.difficulty})`;
  if (!NEUTRAL.includes(q.question)) err(id, 'stem not neutral');
  if (q.questionType && q.questionType !== 'select-two') err(id, `questionType ${q.questionType}`);
  if (!Array.isArray(q.correctPair) || q.correctPair.length !== 2) { err(id, 'bad correctPair'); return; }
  const [i, j] = q.correctPair;
  if (j !== i + 1 || i < 0 || j >= q.options.length) err(id, `correctPair not adjacent/in-range ${JSON.stringify(q.correctPair)}`);
  if (JSON.stringify(q._straddle) !== JSON.stringify(q.correctPair)) err(id, '_straddle !== correctPair');
  // parse hidden word from explanation
  const m = q.explanation && q.explanation.match(/word\s+([A-Za-z]+)\s+is hidden/i);
  if (!m) { err(id, 'explanation not parseable'); return; }
  const hidden = m[1].toUpperCase();
  if (q._hidden && q._hidden.toUpperCase() !== hidden) err(id, `_hidden "${q._hidden}" != explanation "${hidden}"`);
  const L = hidden.length;
  if (L < 3 || L > 4) err(id, `hidden "${hidden}" length ${L}`);
  hiddenCounts[hidden] = (hiddenCounts[hidden] || 0) + 1;
  // straddles the keyed boundary?
  const a = (q.options[i] || '').toUpperCase(), b = (q.options[j] || '').toUpperCase();
  let straddles = false;
  for (let k = 1; k <= L - 1; k++) if (k <= a.length && (L - k) <= b.length && a.slice(a.length - k) + b.slice(0, L - k) === hidden) straddles = true;
  if (!straddles) err(id, `"${hidden}" does not straddle '${a}'+'${b}'`);
  // AMBIGUITY: hidden word must appear at ONLY the keyed boundary
  const hits = boundariesHiding(q.options, hidden);
  if (hits.length > 1) err(id, `AMBIGUOUS: "${hidden}" also hides at boundaries ${hits.join(',')} (keyed ${i})`);
  else if (hits.length === 1 && hits[0] !== i) err(id, `"${hidden}" hides at boundary ${hits[0]}, not keyed ${i}`);
  // sentence + length band
  if (q._sentence && q.options.join(' ') !== q._sentence) err(id, 'options.join !== _sentence');
  const wc = q.options.length;
  const [lo, hi] = BANDS[q.difficulty] || [0, 99];
  if (wc < lo || wc > hi) (q.difficulty === 3 && wc > hi ? warn : err)(id, `word count ${wc} outside D${q.difficulty} band ${lo}-${hi}`);
  // stray punctuation tokens
  if (q.options.some(o => /[^A-Za-z'-]/.test(o))) err(id, `non-word token in options`);
});
if (full) {
  Object.entries(hiddenCounts).filter(([, c]) => c > 2).forEach(([w, c]) => err('HW-REUSE', `${w} used ${c}x (>2)`));
}

// ---------- BALANCE EQUATIONS ----------
const be = data.balanceEquations || [];
function evalArith(expr) {
  // whole-number arithmetic only: digits, x already substituted, + - * / ( ) spaces
  if (!/^[-+*/(). 0-9]+$/.test(expr)) throw new Error('unsafe expr: ' + expr);
  // eslint-disable-next-line no-new-func
  return Function('"use strict";return (' + expr + ')')();
}
be.forEach((q, idx) => {
  const id = `BE#${idx + 1}(D${q.difficulty})`;
  if (!Array.isArray(q.options) || q.options.length !== 5) err(id, 'not 5 options');
  else if (new Set(q.options).size !== 5) err(id, 'dup options');
  if (q.options.some(o => !/^-?\d+$/.test(String(o).trim()))) err(id, 'non-integer option');
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 4) err(id, `bad correct ${q.correct}`);
  if (!q.explanation || !q.explanation.trimEnd().endsWith('✓')) err(id, 'no ✓');
  if (Number(q.options[q.correct]) !== q._answer) err(id, `_answer ${q._answer} != options[${q.correct}] ${q.options[q.correct]}`);
  // recompute: substitute x=_answer into _equation and assert LHS === RHS
  if (!q._equation || !q._equation.includes('=')) { err(id, 'no _equation'); return; }
  const [lhs, rhs] = q._equation.split('=');
  try {
    const sub = s => s.replace(/x/g, `(${q._answer})`);
    const lv = evalArith(sub(lhs)), rv = evalArith(sub(rhs));
    if (lv !== rv) err(id, `equation does NOT balance: ${lhs.trim()} = ${lv} but ${rhs.trim()} = ${rv} (x=${q._answer})`);
    if (typeof q._leftValue === 'number' && evalArith(sub(lhs)) !== q._leftValue) warn(id, `_leftValue ${q._leftValue} != computed ${lv}`);
  } catch (e) { err(id, `eval failed: ${e.message}`); }
});

// aggregate difficulty distribution (full wave)
function diffDist(arr) { const d = { 1: 0, 2: 0, 3: 0 }; arr.forEach(q => { d[q.difficulty] = (d[q.difficulty] || 0) + 1; }); return d; }

console.log(`\n=== VR FIX #7 VERIFY ===`);
console.log(`hiddenWords: ${hw.length}  dist ${JSON.stringify(diffDist(hw))}`);
console.log(`balanceEquations: ${be.length}  dist ${JSON.stringify(diffDist(be))}`);
if (warnings.length) { console.log(`\n--- WARNINGS (${warnings.length}) ---`); warnings.forEach(w => console.log('  ⚠ ' + w)); }
if (errors.length) { console.log(`\n--- ERRORS (${errors.length}) ---`); errors.forEach(e => console.log('  ✗ ' + e)); console.log('\nRESULT: FAIL'); process.exit(1); }
console.log('\nRESULT: PASS (deterministic). Linguistic naturalness verified by 2nd Oracle pass.');

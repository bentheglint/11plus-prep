#!/usr/bin/env node
/**
 * numberline-mismatch-scan.js
 *
 * Detects NumberLine visuals whose tickInterval contradicts the question stem.
 *
 * Classes of contradiction:
 *  A) Stem says "only X and Y are marked" / "only the endpoints" but tickInterval
 *     is finer than the range → subdivision marks revealed.
 *  B) Stem says "X and Y are marked" and shows the arrow position in labelled
 *     terms that match a tick — the label reveals the answer.
 *
 * Seed example (Maths decimals Q223 — fixed 2026-04-21):
 *   Stem: "A number line goes from 0 to 1. Only 0 and 1 are marked. An arrow
 *          points to a position 3/4 of the way along."
 *   Visual: tickInterval:0.25, showLabels:true → ticks at 0, 0.25, 0.5, 0.75, 1
 *   Fix: tickInterval:1 (only endpoints marked).
 *
 * Run: node scripts/numberline-mismatch-scan.js
 */

const fs = require('fs');
const path = require('path');

function loadBank(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  try {
    const mod = require(modulePath);
    return mod.default || mod;
  } catch (e) {
    console.error(`Failed to load ${modulePath}: ${e.message}`);
    return null;
  }
}

function walkQuestions(obj, path, visit) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walkQuestions(item, `${path}[${i}]`, visit));
    return;
  }
  if (Array.isArray(obj.questions)) obj.questions.forEach(q => visit(q, path));
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'questions') continue;
    walkQuestions(v, path ? `${path}.${k}` : k, visit);
  }
}

const ROOT = path.resolve(__dirname, '..', 'src', 'questionData');
const findings = [];

const bank = loadBank(path.join(ROOT, 'mathsData.js'));
if (!bank) process.exit(1);

walkQuestions(bank, 'maths', (q, topicPath) => {
  if (!q || !q.visual || q.visual.component !== 'NumberLine') return;
  const props = q.visual.props || {};
  const { min, max, tickInterval, showLabels = true } = props;
  if (min == null || max == null || tickInterval == null) return;

  const range = max - min;
  const tickCount = Math.round(range / tickInterval) + 1;
  const stem = String(q.question || '');

  // Class A: stem asserts only endpoints but interval < range
  const onlyEndpointsPhrase = /only\s+(-?\d+(?:\.\d+)?)\s+and\s+(-?\d+(?:\.\d+)?)\s+(are\s+)?(?:marked|labelled|shown)/i;
  const match = stem.match(onlyEndpointsPhrase);
  if (match && tickInterval < range) {
    findings.push({
      topicPath,
      questionId: q.id,
      questionClass: 'A: stem says only endpoints marked, tickInterval subdivides',
      stem,
      tickInterval,
      min, max,
      tickCount,
      correctOption: q.options?.[q.correct]
    });
    return;
  }

  // Class B: stem says "only endpoints" via simpler phrasings
  const noOtherMarksPhrase = /no\s+other\s+(marks|numbers|labels)|nothing\s+else\s+(is\s+)?(marked|labelled|shown)|unmarked|unlabelled/i;
  if (noOtherMarksPhrase.test(stem) && tickInterval < range) {
    findings.push({
      topicPath,
      questionId: q.id,
      questionClass: 'B: stem says no other marks, tickInterval subdivides',
      stem,
      tickInterval,
      min, max,
      tickCount,
      correctOption: q.options?.[q.correct]
    });
    return;
  }
});

findings.sort((a, b) =>
  a.topicPath.localeCompare(b.topicPath) ||
  (a.questionId - b.questionId)
);

console.log(`\nNumberLine stem/visual mismatch scan: ${findings.length} findings\n`);
findings.forEach(f => {
  console.log(`[${f.topicPath}] Q${f.questionId} — ${f.questionClass}`);
  console.log(`  Stem: ${f.stem}`);
  console.log(`  Visual: min=${f.min} max=${f.max} tickInterval=${f.tickInterval} (${f.tickCount} ticks rendered)`);
  console.log(`  Correct: ${f.correctOption}`);
  console.log('');
});

const outPath = path.resolve(__dirname, 'numberline-mismatch-findings.json');
fs.writeFileSync(outPath, JSON.stringify(findings, null, 2));
console.log(`\nResults: ${outPath}`);
console.log(`Total: ${findings.length}`);

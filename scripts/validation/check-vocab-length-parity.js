#!/usr/bin/env node
// Lint: vocabulary multiple-choice length parity.
//
// Oracle audit (5 May 2026, see plans context) found 35% of the vocabulary
// bank had a measurable "length tell" — the correct option was visibly
// longer than every distractor, telegraphing the answer to a 9-year-old
// without them needing to read the meanings. Top 30 fixed in commit; this
// script enforces the rule going forward.
//
// Rule (per Oracle G):
//   - correct option length must be ≤ 1.25× the longest distractor
//   - correct option length must be ≥ 0.6× the shortest distractor
//   - questions matching /closest in meaning to|opposite of|best antonym/i
//     must have single-word options (the question literally asks for a word)
//
// Severity:
//   - ratio > 2.0×                 → ERROR (severe length tell)
//   - ratio > 1.5×                 → ERROR (moderate length tell)
//   - ratio > 1.25×                → WARNING (minor)
//   - inverse ratio < 0.6×         → WARNING (correct is unusually short)
//   - synonym-format with multi-word option → ERROR
//
// Usage:  node scripts/validation/check-vocab-length-parity.js
// Exit:   0 = pass, 1 = errors, 2 = warnings only

const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', '..', 'src', 'questionData', 'englishData.js');

const THRESHOLDS = {
  severeRatio: 2.0,
  moderateRatio: 1.5,
  minorRatio: 1.25,
  shortInverseRatio: 0.6,
};

const SYNONYM_FORMAT_RE = /closest in meaning to|opposite of|best antonym|same meaning as/i;

// Bracket-aware extractor: walk the source, find every `{...}` that looks
// like a question (contains `id:` or `"id":`) and capture id, question text,
// options array, correct index. Tolerant of both quoted-key (vocabulary
// topic) and unquoted-key (comprehension passage) styles.

function extractQuestions(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const m = src.slice(i).match(/\{\s*(?:"id"|id)\s*:\s*\d+/);
    if (!m) break;
    const startIdx = i + m.index;
    let depth = 0;
    let j = startIdx;
    let inStr = null;
    while (j < src.length) {
      const c = src[j];
      if (inStr) {
        if (c === '\\') { j += 2; continue; }
        if (c === inStr) inStr = null;
        j++;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { inStr = c; j++; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
      j++;
    }
    if (depth !== 0) break;
    out.push({ start: startIdx, end: j, body: src.slice(startIdx, j + 1) });
    i = j + 1;
  }
  return out;
}

function parseQuestion(body) {
  const idMatch = body.match(/(?:"id"|id)\s*:\s*(\d+)/);
  if (!idMatch) return null;
  const id = parseInt(idMatch[1], 10);
  const questionMatch = body.match(/(?:"question"|question)\s*:\s*["'`]([\s\S]*?)["'`]\s*,/);
  const question = questionMatch ? questionMatch[1] : '';

  // Options array: support multi-line with double quotes OR single-line
  // unquoted-key with double quotes OR single-line unquoted-key with single quotes.
  const optionsMatch = body.match(/(?:"options"|options)\s*:\s*\[([\s\S]*?)\]/);
  if (!optionsMatch) return null;
  const optionsRaw = optionsMatch[1];
  // Extract individual string literals — support both " and '
  const items = [];
  const itemRe = /["']((?:[^"'\\]|\\.)*?)["']/g;
  let im;
  while ((im = itemRe.exec(optionsRaw)) !== null) {
    items.push(im[1]);
  }
  if (items.length === 0) return null;

  const correctMatch = body.match(/(?:"correct"|correct)\s*:\s*(\d+)/);
  const correct = correctMatch ? parseInt(correctMatch[1], 10) : -1;

  return { id, question, options: items, correct };
}

function classify(q) {
  if (!q || q.correct < 0 || q.correct >= q.options.length) return null;
  const correctText = q.options[q.correct];
  const distractors = q.options.filter((_, i) => i !== q.correct);
  if (distractors.length === 0) return null;

  const cChar = correctText.length;
  const distChars = distractors.map(d => d.length);
  const maxDist = Math.max(...distChars);
  const minDist = Math.min(...distChars);
  const ratioMax = cChar / maxDist;
  const ratioMin = cChar / minDist;

  const isSynonymFormat = SYNONYM_FORMAT_RE.test(q.question);
  const hasMultiWord = q.options.some(o => o.split(/\s+/).length > 1);

  const issues = [];
  if (isSynonymFormat && hasMultiWord) {
    issues.push({ severity: 'error', kind: 'synonym-format-multi-word',
      reason: 'Synonym-format question must have single-word options' });
  }
  if (ratioMax > THRESHOLDS.severeRatio) {
    issues.push({ severity: 'error', kind: 'length-tell-severe', ratio: ratioMax,
      reason: `correct option ${cChar} chars vs longest distractor ${maxDist} chars (${ratioMax.toFixed(2)}×)` });
  } else if (ratioMax > THRESHOLDS.moderateRatio) {
    issues.push({ severity: 'error', kind: 'length-tell-moderate', ratio: ratioMax,
      reason: `correct option ${cChar} chars vs longest distractor ${maxDist} chars (${ratioMax.toFixed(2)}×)` });
  } else if (ratioMax > THRESHOLDS.minorRatio) {
    issues.push({ severity: 'warning', kind: 'length-tell-minor', ratio: ratioMax,
      reason: `correct option ${cChar} chars vs longest distractor ${maxDist} chars (${ratioMax.toFixed(2)}×)` });
  }
  if (ratioMin < THRESHOLDS.shortInverseRatio) {
    issues.push({ severity: 'warning', kind: 'length-tell-inverse', ratio: ratioMin,
      reason: `correct option ${cChar} chars vs shortest distractor ${minDist} chars (${ratioMin.toFixed(2)}×) — correct may be suspiciously short` });
  }
  return issues.length > 0 ? { id: q.id, question: q.question, issues, ratioMax, ratioMin, options: q.options, correct: q.correct } : null;
}

const src = fs.readFileSync(SRC, 'utf8');
const questions = extractQuestions(src);

let errors = 0;
let warnings = 0;
const findings = [];
let totalScanned = 0;

for (const q of questions) {
  const parsed = parseQuestion(q.body);
  if (!parsed) continue;
  // Only check questions that look like vocabulary (multiple-choice with
  // 5 string options). Skip error-spotting (uses `segments`), pick-from-sets
  // (uses `setA`/`setB`), comprehension with non-vocabulary subtypes, etc.
  // We accept all 4-5 option string arrays as candidates — the format-aware
  // synonym check + length-tell ratios are scoped to discriminate.
  if (parsed.options.length < 4 || parsed.options.length > 5) continue;
  if (parsed.options.some(o => o.length === 0)) continue;
  totalScanned++;

  const finding = classify(parsed);
  if (finding) {
    findings.push(finding);
    for (const i of finding.issues) {
      if (i.severity === 'error') errors++;
      else warnings++;
    }
  }
}

// Summary table
console.log('');
console.log(`Scanned ${totalScanned} multiple-choice questions across englishData.js`);
console.log(`  ${findings.length} questions with at least one issue`);
console.log(`  ${errors} errors`);
console.log(`  ${warnings} warnings`);
console.log('');

if (findings.length > 0) {
  // Group by severity for summary
  const bySev = { error: [], warning: [] };
  for (const f of findings) {
    const worst = f.issues.some(i => i.severity === 'error') ? 'error' : 'warning';
    bySev[worst].push(f);
  }

  if (bySev.error.length > 0) {
    console.log(`ERRORS (${bySev.error.length}):`);
    for (const f of bySev.error.sort((a, b) => b.ratioMax - a.ratioMax).slice(0, 50)) {
      const worst = f.issues.find(i => i.severity === 'error');
      console.log(`  Q${f.id}: ${worst.reason}`);
    }
    if (bySev.error.length > 50) console.log(`  ... and ${bySev.error.length - 50} more`);
    console.log('');
  }
  if (bySev.warning.length > 0) {
    console.log(`WARNINGS (${bySev.warning.length}):`);
    for (const f of bySev.warning.sort((a, b) => b.ratioMax - a.ratioMax).slice(0, 20)) {
      const worst = f.issues.find(i => i.severity === 'warning');
      console.log(`  Q${f.id}: ${worst.reason}`);
    }
    if (bySev.warning.length > 20) console.log(`  ... and ${bySev.warning.length - 20} more`);
    console.log('');
  }
}

if (errors > 0) process.exit(1);
if (warnings > 0) process.exit(2);
console.log('PASS — no length-tells detected.');
process.exit(0);

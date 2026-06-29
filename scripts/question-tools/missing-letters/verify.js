// Verify a batch of SHIPPED-shape missingLettersWords question objects.
// Input auto-detected by extension: .js (comma-separated object literals, eval-wrapped)
// or .jsonl (one JSON object per line).
//
// Usage:
//   node scripts/question-tools/missing-letters/verify.js <path/to/batch.js>
//   node scripts/question-tools/missing-letters/verify.js <path/to/batch.jsonl>

'use strict';
const fs   = require('fs');
const path = require('path');
const { loadDicts, rebuildsAll, gapFirstPos, capsWordFromQuestion } = require('./lib');

// ── Tier-aware word-maker thresholds (HARD FAIL if violated) ─────────────────
const MAKER_MAX_D1 = 2;   // D1 items must not have more than 2 word-makers (too hard for D1)
const MAKER_MIN_D2 = 2;   // D2 items must have at least 2 word-makers (competing-completion trap)
const MAKER_MIN_D3 = 3;   // D3 items must have at least 3 word-makers (elimination must be impossible)
// NOTE: having MORE than the minimum is intentional for D2/D3 — do NOT hard-fail high maker counts.
// ─────────────────────────────────────────────────────────────────────────────

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node verify.js <batch.js|batch.jsonl>');
  process.exit(1);
}

const { DICT, COMMON } = loadDicts();

// ── Load input ────────────────────────────────────────────────────────────────
const txt  = fs.readFileSync(path.resolve(inputPath), 'utf8');
const objs = inputPath.endsWith('.jsonl')
  ? txt.trim().split('\n').map(JSON.parse)
  : eval('[' + txt + '\n]');   // .js fragment: comma-separated object literals

// ── Per-item validation ───────────────────────────────────────────────────────
let hardFailCount = 0;
const wordMakerCounts = [];

console.log(`\n=== ${path.basename(inputPath)} (${objs.length} items) ===`);

objs.forEach(q => {
  const frame  = capsWordFromQuestion(q.question);
  const answer = Array.isArray(q.options) ? q.options[q.correct] : undefined;
  const issues = [];

  // ── 1. Exactly 5 unique options ───────────────────────────────────────────
  if (!Array.isArray(q.options) || q.options.length !== 5) {
    issues.push(`options: expected 5, got ${Array.isArray(q.options) ? q.options.length : 'non-array'}`);
  } else if (new Set(q.options).size !== 5) {
    issues.push('duplicate options');
  }

  // ── 2. correct in range and answer is a real 3-letter COMMON word ─────────
  if (q.correct == null || q.correct < 0 || q.correct > 4) {
    issues.push(`correct index ${q.correct} out of range`);
  } else if (answer) {
    if (!/^[A-Z]{3}$/.test(answer)) {
      issues.push(`answer "${answer}" is not exactly 3 uppercase letters`);
    } else if (!DICT.has(answer)) {
      issues.push(`answer "${answer}" not in dictionary`);
    } else if (!COMMON.has(answer)) {
      issues.push(`answer "${answer}" is not a COMMON word (must be everyday vocab)`);
    }
  }

  // ── 3. Answer rebuilds the host ───────────────────────────────────────────
  const ansWords = frame && answer ? rebuildsAll(frame, answer, DICT) : [];
  if (frame && answer && !ansWords.length) {
    issues.push(`answer "${answer}" rebuilds NO word from frame "${frame}"`);
  }
  const host = ansWords[0] || '';

  // ── 4. For D2/D3: gap must be mid-word (not start, not end) ──────────────
  if (frame && answer && (q.difficulty === 2 || q.difficulty === 3)) {
    const firstPos = gapFirstPos(frame, answer, DICT);
    if (firstPos === 0) {
      issues.push(`gap at START: "${answer}+${frame}" — answer must insert mid-word for D${q.difficulty}`);
    } else if (firstPos === frame.length) {
      issues.push(`gap at END: "${frame}+${answer}" — answer must insert mid-word for D${q.difficulty}`);
    }
  }

  // ── 5. Explanation ends with ✓ ────────────────────────────────────────────
  if (typeof q.explanation !== 'string' || !q.explanation.trim().endsWith('✓')) {
    issues.push('explanation does not end with ✓');
  }

  // ── 6. Token-invariant: every \b[A-Z]{3}\b in explanation is an option ────
  if (typeof q.explanation === 'string' && Array.isArray(q.options)) {
    (q.explanation.match(/\b[A-Z]{3}\b/g) || []).forEach(tok => {
      if (!q.options.includes(tok)) issues.push(`stray 3-letter token "${tok}" in explanation (not an option)`);
    });
  }

  // ── 7. Tier-aware word-maker bar ──────────────────────────────────────────
  const makers  = Array.isArray(q.options)
    ? q.options.filter(o => rebuildsAll(frame, o, DICT).length > 0)
    : [];
  const nMakers = makers.length;
  wordMakerCounts.push(nMakers);

  if (q.difficulty === 1 && nMakers > MAKER_MAX_D1) {
    issues.push(`D1 but ${nMakers} options make words (max ${MAKER_MAX_D1} for D1 — too hard)`);
  }
  if (q.difficulty === 2 && nMakers < MAKER_MIN_D2) {
    issues.push(`D2 but only ${nMakers} option(s) make words (min ${MAKER_MIN_D2} for D2 — too easy)`);
  }
  if (q.difficulty === 3 && nMakers < MAKER_MIN_D3) {
    issues.push(`D3 but only ${nMakers} option(s) make words (min ${MAKER_MIN_D3} for D3 — too easy)`);
  }

  // ── WARN: distractor trap quality (never a hard fail) ─────────────────────
  // A "good trap" = inserting the distractor at the answer's gap position forms a real DICT word.
  // Ported from validate-missing-letters.js Check 10.
  const warns = [];
  if (frame && answer && host && Array.isArray(q.options)) {
    const gapPos = gapFirstPos(frame, answer, DICT);
    if (gapPos >= 0) {
      const distractors = q.options.filter((_, i) => i !== q.correct);
      const goodTraps = distractors.filter(d => {
        const formed = frame.slice(0, gapPos) + d + frame.slice(gapPos);
        return DICT.has(formed);
      });
      if (goodTraps.length < 2) {
        warns.push(
          `[trap-quality] only ${goodTraps.length}/4 distractors form a real word at the answer gap ` +
          `(good trap = inserts at gap pos ${gapPos} to give a dict word); distractors may be weak`
        );
      }
    }
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  const tag = issues.length ? 'FLAG' : ' ok ';
  const makerWords = makers.map(o => rebuildsAll(frame, o, DICT)[0] || o).join('/');
  console.log(
    `  [${tag}] id=${q.id} D${q.difficulty}: ${host || frame || '??'} ` +
    `(ans=${answer}, ${nMakers} word-makers: ${makerWords})` +
    (issues.length ? `\n         HARD FAIL: ${issues.join('; ')}` : '') +
    (warns.length  ? `\n         WARN: ${warns.join('; ')}` : '')
  );

  hardFailCount += issues.length ? 1 : 0;
});

// ── Summary ───────────────────────────────────────────────────────────────────
const dist = {};
wordMakerCounts.forEach(n => { dist[n] = (dist[n] || 0) + 1; });
console.log(`\n  word-maker distribution: ${JSON.stringify(dist)}`);
console.log(`  flagged items (hard fail): ${hardFailCount}/${objs.length}`);

if (hardFailCount > 0) process.exit(1);

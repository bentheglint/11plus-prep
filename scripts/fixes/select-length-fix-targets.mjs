#!/usr/bin/env node
// ============================================================================
// Fix #3 Stage 1 — target selection & work orders
// ----------------------------------------------------------------------------
// Decides WHICH questions get their distractors rewritten and assigns each a
// TARGET length-rank for the correct option, so the post-fix distribution lands
// near the 20% chance rate BY DESIGN (not by blindly maximising distractor
// length — that would create the inverse "correct is never longest" tell; the
// Fix #2 over-correction lesson).
//
// Strategy per in-scope bucket:
//   1. Find every question where correct is the single longest option.
//   2. KEEP ~20% of the bucket untouched as legitimately correct-longest.
//   3. For the rest, assign a target rank (0..3) filling the currently-thinnest
//      ranks first, so the final histogram flattens.
//   4. Derive per-distractor word-count TARGETS: lengthen the shortest
//      distractors past the correct option, staggered to avoid ties.
//   5. Flag questions whose explanation quotes a to-be-rewritten distractor
//      (those need the explanation updated too — Fable risk #5).
//
// Deterministic (fixed-seed PRNG) so re-runs are reproducible.
//
// Usage: node scripts/fixes/select-length-fix-targets.mjs
// Output: scripts/fixes/data/length-fix-workorders.json
// ============================================================================

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import englishData from '../../src/questionData/englishData.js';
import mockPassages from '../../src/questionData/mockComprehensionData.js';
import {
  words, isEligible, isPhraseOption, strictlyShorterThanCorrect, isSingleLongest,
} from '../validation/english-length-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..', '..');

// --- deterministic PRNG (mulberry32) ---
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260721); // fixed seed = Fix #3 date
function seededShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KEEP_FRACTION = 0.20; // leave ~20% legitimately correct-longest

// Bucket sources with the metadata we need to build a composite key + write later.
// container = topic name (main) or passage id (mock); file + arr locate the array.
function inScopeBuckets() {
  const topicQs = k => (englishData.topics?.[k]?.questions || []).map(q => ({
    q, file: 'englishData.js', container: k, arr: `topics.${k}.questions`,
  }));
  const mockQs = arr => mockPassages.flatMap(p => (p[arr] || []).map(q => ({
    q, file: 'mockComprehensionData.js', container: p.id, arr, passageTitle: p.title,
  })));
  return {
    'MOCK-vocabulary':       mockQs('vocabularyQuestions'),
    'MOCK-comprehension':    mockQs('comprehensionQuestions'),
    'MAIN-vocabulary':       topicQs('vocabulary'),
    'MAIN-wordClassGrammar': topicQs('wordClassGrammar'),
  };
}

function compositeKey(rec) {
  const first6 = String(rec.q.question || '').trim().split(/\s+/).slice(0, 6).join(' ');
  return {
    file: rec.file,
    container: rec.container,
    arr: rec.arr,
    id: rec.q.id,
    correctIndex: rec.q.correct,
    questionHead: first6,
  };
}

// explanation quotes a distractor verbatim? (guard against trivial short matches)
function explanationQuotes(q, distractorText) {
  const ex = String(q.explanation || '');
  const d = String(distractorText || '').trim();
  return d.length >= 10 && ex.includes(d);
}

const workorders = [];
const projections = {};

for (const [bucket, recs] of Object.entries(inScopeBuckets())) {
  const phrase = recs.filter(r => isEligible(r.q) && isPhraseOption(r.q));
  const n = phrase.length;

  // current rank histogram (strictlyShorter 0..4)
  const currentHist = [0, 0, 0, 0, 0];
  for (const r of phrase) currentHist[strictlyShorterThanCorrect(r.q)]++;

  const singleLongest = phrase.filter(r => isSingleLongest(r.q));
  const keepCount = Math.round(KEEP_FRACTION * n);
  // keep the first `keepCount` after a seeded shuffle; rewrite the rest
  const shuffled = seededShuffle(singleLongest.map((r, i) => i));
  const keepIdx = new Set(shuffled.slice(0, keepCount));
  const toRewrite = singleLongest.filter((_, i) => !keepIdx.has(i));

  // projected histogram: start from questions that are NOT being rewritten
  const projHist = [0, 0, 0, 0, 0];
  for (let i = 0; i < phrase.length; i++) {
    const r = phrase[i];
    const ss = strictlyShorterThanCorrect(r.q);
    const isRw = toRewrite.includes(r);
    if (!isRw) projHist[ss]++; // kept single-longest + all non-single-longest stay put
  }

  // assign each rewrite target to the currently-thinnest rank among {0,1,2,3}
  for (const r of toRewrite) {
    let targetRank = 0, best = Infinity;
    for (let rank = 0; rank <= 3; rank++) {
      if (projHist[rank] < best) { best = projHist[rank]; targetRank = rank; }
    }
    projHist[targetRank]++;

    const q = r.q;
    const wl = q.options.map(words);
    const wCorrect = wl[q.correct];
    // distractor indices sorted shortest-first (these are the ones we lengthen)
    const distIdx = q.options.map((_, i) => i).filter(i => i !== q.correct);
    const shortestFirst = distIdx.sort((a, b) => wl[a] - wl[b]);
    // to make correct rank = targetRank, exactly (4 - targetRank) distractors
    // must end up LONGER than correct; the other targetRank stay shorter.
    const nLonger = (q.options.length - 1) - targetRank; // = 4 - targetRank
    const toLengthen = shortestFirst.slice(0, nLonger);
    // staggered targets above correct to avoid ties: wCorrect+1, +2, +3...
    const optionTargets = distIdx.map(i => {
      const pos = toLengthen.indexOf(i);
      if (pos === -1) {
        return { index: i, currentText: q.options[i], currentWords: wl[i], action: 'keep-shorter', targetMinWords: null, targetMaxWords: null };
      }
      const base = wCorrect + 1 + pos;
      return {
        index: i, currentText: q.options[i], currentWords: wl[i], action: 'lengthen',
        targetMinWords: base, targetMaxWords: base + 2,
        explanationQuotesThis: explanationQuotes(q, q.options[i]),
      };
    });

    workorders.push({
      bucket,
      key: compositeKey(r),
      passageTitle: r.passageTitle || null,
      difficulty: q.difficulty,
      subtype: q.questionSubType || null,
      question: q.question,
      correctText: q.options[q.correct],
      correctWords: wCorrect,
      currentOptions: q.options,
      targetRankForCorrect: targetRank,
      distractorTargets: optionTargets,
      explanationTouched: optionTargets.some(o => o.explanationQuotesThis),
      explanation: q.explanation || null,
    });
  }

  const pct = h => h.map(x => Math.round(100 * x / n));
  projections[bucket] = {
    n, keepCount, rewriteCount: toRewrite.length,
    currentSingleLongestPct: +(100 * singleLongest.length / n).toFixed(1),
    projectedHistPct: pct(projHist),
    projectedSingleLongestPct: Math.round(100 * projHist[4] / n),
  };
}

// --- report projection (Stage 1 exit gate: should land in-band on paper) ---
console.log('\n===== Stage 1 target selection — projected post-fix (chance 20%) =====\n');
let totalRewrite = 0, totalExpl = 0;
for (const [b, p] of Object.entries(projections)) {
  totalRewrite += p.rewriteCount;
  console.log(`${b}`);
  console.log(`  n=${p.n}  rewrite=${p.rewriteCount}  keep-as-longest=${p.keepCount}`);
  console.log(`  single-longest: ${p.currentSingleLongestPct}%  ->  projected ~${p.projectedSingleLongestPct}%`);
  console.log(`  projected rank short->long: ${p.projectedHistPct.join('/')}\n`);
}
totalExpl = workorders.filter(w => w.explanationTouched).length;
console.log(`TOTAL rewrites: ${totalRewrite}   (questions whose explanation also needs editing: ${totalExpl})`);

const dir = join(REPO, 'scripts', 'fixes', 'data');
mkdirSync(dir, { recursive: true });
const path = join(dir, 'length-fix-workorders.json');
writeFileSync(path, JSON.stringify({ generatedFrom: 'select-length-fix-targets.mjs', keepFraction: KEEP_FRACTION, projections, workorders }, null, 2));
console.log(`\nWork orders written: ${path}  (${workorders.length} questions)`);

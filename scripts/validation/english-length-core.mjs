// ============================================================================
// English length-tell measurement core (Fix #3)
// ----------------------------------------------------------------------------
// PURE functions — no I/O. Callers pass the already-loaded data objects so the
// SAME logic runs in the node CLI and in the Jest gate test (single source of
// truth — see feedback_copies_of_truth_need_parity_tests). The CLI wrapper is
// check-english-length-rank.mjs; the Jest gate imports the same functions.
//
// The "length tell": a child can score above chance by picking the single
// longest option without reading. Measured by WORD count (what a child
// perceives), with character mean as a tie-breaker signal only.
// ============================================================================

export const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
export const chars = s => String(s).length;

// A question is only "tell-eligible" if its options are PHRASES — a length
// tell is imperceptible among single-word options (e.g. "hard" vs "difficult").
// Threshold matches the diagnostic that produced the baseline numbers.
export function isPhraseOption(q) {
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  const maxW = Math.max(...q.options.map(words));
  const meanC = q.options.reduce((a, o) => a + chars(o), 0) / q.options.length;
  return maxW > 2 || meanC > 15;
}

export function isEligible(q) {
  return (
    Array.isArray(q.options) && q.options.length >= 4 &&
    Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length &&
    q.options.every(o => typeof o === 'string' && o.length > 0)
  );
}

// How many OTHER options are strictly shorter (by word count) than the correct
// one. Range 0..(n-1). n-1 === "single longest".
export function strictlyShorterThanCorrect(q) {
  const wl = q.options.map(words);
  const cW = wl[q.correct];
  return wl.filter((w, i) => i !== q.correct && w < cW).length;
}

export function isSingleLongest(q) {
  return strictlyShorterThanCorrect(q) === q.options.length - 1;
}

// Correct shares its word-count with at least one other option.
export function correctTiesSomeone(q) {
  const wl = q.options.map(words);
  const cW = wl[q.correct];
  return wl.some((w, i) => i !== q.correct && w === cW);
}

// Measure one bucket (array of question objects, already filtered to the bucket
// definition). Returns null for empty. `n` counts phrase-option questions only.
export function measureBucket(questions) {
  const eligible = questions.filter(isEligible);
  const phrase = eligible.filter(isPhraseOption);
  const n = phrase.length;
  if (n === 0) return { n: 0, eligible: eligible.length };

  let singleLongest = 0, ties = 0;
  const rankHist = [0, 0, 0, 0, 0]; // index = strictlyShorter count (0..4)
  const byDiff = { 1: { n: 0, sl: 0 }, 2: { n: 0, sl: 0 }, 3: { n: 0, sl: 0 } };

  for (const q of phrase) {
    const ss = strictlyShorterThanCorrect(q);
    if (ss <= 4) rankHist[ss]++;
    if (ss === q.options.length - 1) singleLongest++;
    if (correctTiesSomeone(q)) ties++;
    const d = byDiff[q.difficulty];
    if (d) { d.n++; if (ss === q.options.length - 1) d.sl++; }
  }

  const pct = x => +(100 * x / n).toFixed(1);
  return {
    n,
    eligible: eligible.length,
    phraseCount: n,
    shortWordCount: eligible.length - n,
    singleLongestPct: pct(singleLongest),
    tiePct: pct(ties),
    rankHistPct: rankHist.map(pct), // [shortest ... longest]
    byDifficulty: Object.fromEntries(
      Object.entries(byDiff).map(([d, v]) => [d, { n: v.n, singleLongestPct: v.n ? +(100 * v.sl / v.n).toFixed(1) : null }])
    ),
  };
}

// ---- Bucket definitions: the SINGLE source of truth for what we measure/fix.
// Each returns the array of question objects for that bucket.
export function extractBuckets(englishData, mockPassages) {
  const topic = k => (englishData?.topics?.[k]?.questions) || [];
  const mockArr = name => mockPassages.flatMap(p => p[name] || []);

  return {
    // --- In-scope (the four buckets Fix #3 repairs) ---
    'MOCK-vocabulary':        { inScope: true,  questions: mockArr('vocabularyQuestions') },
    'MOCK-comprehension':     { inScope: true,  questions: mockArr('comprehensionQuestions') },
    'MAIN-vocabulary':        { inScope: true,  questions: topic('vocabulary') },
    'MAIN-wordClassGrammar':  { inScope: true,  questions: topic('wordClassGrammar') },
    // --- Out-of-scope reference buckets (must stay UNCHANGED before/after) ---
    'MAIN-comprehension':     { inScope: false, questions: topic('comprehension') },
    'MOCK-wordClass':         { inScope: false, questions: mockArr('wordClassQuestions') },
    'MAIN-grammar':           { inScope: false, questions: topic('grammar') },
    'MAIN-spelling':          { inScope: false, questions: topic('spelling') },
    'MAIN-punctuation':       { inScope: false, questions: topic('punctuation') },
  };
}

// Full report across all buckets.
export function measureAll(englishData, mockPassages) {
  const buckets = extractBuckets(englishData, mockPassages);
  const out = {};
  for (const [name, def] of Object.entries(buckets)) {
    out[name] = { inScope: def.inScope, ...measureBucket(def.questions) };
  }
  return out;
}

// Acceptance-gate bands (Fix #3 targets). Shared by CLI + Jest gate.
export const GATE = {
  singleLongestMinPct: 10,   // floor: avoid the inverse "never longest" tell
  singleLongestMaxPct: 30,   // ceiling: near the 20% chance rate
  rankMaxPct: 35,            // no single length-rank may dominate
  rankMinPct: 8,             // every rank represented
  tieMaxPct: 50,             // guard against robotically identical lengths ONLY.
                             // Short-option buckets (vocab) naturally tie ~43%
                             // (pre-fix baseline 42.6%); high ties + chance-level
                             // single-longest + flat rank = length carries NO
                             // signal, which is the goal. >50% approaches artificial
                             // uniformity. The real tell gates are single-longest + rank.
  diffMaxPct: 40,            // looser per-difficulty ceiling (smaller samples)
};

// Evaluate an in-scope bucket against the gate. Returns {pass, failures[]}.
export function gradeBucket(name, m) {
  const f = [];
  if (m.n === 0) return { pass: true, failures: [] }; // nothing to grade
  if (m.singleLongestPct > GATE.singleLongestMaxPct) f.push(`single-longest ${m.singleLongestPct}% > ${GATE.singleLongestMaxPct}%`);
  if (m.singleLongestPct < GATE.singleLongestMinPct) f.push(`single-longest ${m.singleLongestPct}% < ${GATE.singleLongestMinPct}% (inverse tell)`);
  m.rankHistPct.forEach((r, i) => {
    if (r > GATE.rankMaxPct) f.push(`rank[${i}] ${r}% > ${GATE.rankMaxPct}%`);
    if (r < GATE.rankMinPct) f.push(`rank[${i}] ${r}% < ${GATE.rankMinPct}%`);
  });
  if (m.tiePct > GATE.tieMaxPct) f.push(`ties ${m.tiePct}% > ${GATE.tieMaxPct}%`);
  for (const [d, v] of Object.entries(m.byDifficulty)) {
    if (v.n >= 10 && v.singleLongestPct != null && v.singleLongestPct > GATE.diffMaxPct) {
      f.push(`D${d} single-longest ${v.singleLongestPct}% > ${GATE.diffMaxPct}%`);
    }
  }
  return { pass: f.length === 0, failures: f };
}

/**
 * Missing Letters & Words — difficulty-bar regression guard
 *
 * Locks in the reasoning-led GL Type 7 design (rebuilt 26 Jun 2026). The defect
 * that triggered the rebuild: questions were solvable WITHOUT reading the sentence,
 * because only one option ever formed a real word (pure elimination) and gaps sat
 * at the start/end of the host word.
 *
 * This test pins the CHECKABLE half of the difficulty bar to the live data, derived
 * from the dictionary (not a hand-copied list — see the duplicated-truth rules in
 * CLAUDE.md). It deliberately does NOT try to prove the sentence discriminates between
 * the competing words — that is the irreducible Oracle/human judgement and cannot be
 * asserted mechanically.
 *
 * The bar, per tier:
 *   D1 — at most 2 options form a real word (single-answer is correct for the easiest tier)
 *   D2 — at least 2 options form a real word (answer + a genuine near-miss trap)
 *   D3 — at least 3 options form a real word (elimination is impossible; the sentence decides)
 *   D2 + D3 — the answer's gap is MID-word (never the start or end of the host)
 */

import vrData from '../../questionData/vrData';

const words = require('an-array-of-english-words');
const DICT = new Set(words.map((w) => w.toUpperCase()));

// The capitalised "frame" shown to the child — the host word with 3 letters removed.
const frameOf = (question) =>
  (question.match(/\b[A-Z]{2,}\b/g) || []).filter((t) => t !== 'CAPITALS')[0] || '';

// Every distinct real word an option forms when inserted at any position in the frame.
function rebuildsAll(frame, opt) {
  const out = new Set();
  for (let i = 0; i <= frame.length; i++) {
    const w = frame.slice(0, i) + opt + frame.slice(i);
    if (DICT.has(w)) out.add(w);
  }
  return [...out];
}

// Lowest insertion index where the option forms a real word (-1 if none).
function gapFirstPos(frame, opt) {
  for (let i = 0; i <= frame.length; i++) {
    if (DICT.has(frame.slice(0, i) + opt + frame.slice(i))) return i;
  }
  return -1;
}

const questions = vrData.topics?.missingLettersWords?.questions || [];

describe('Missing Letters & Words — difficulty bar', () => {
  it('has the full bank loaded', () => {
    expect(questions.length).toBeGreaterThanOrEqual(150);
  });

  it('every keyed answer is a real 3-letter word that rebuilds its host', () => {
    const bad = [];
    questions.forEach((q) => {
      const frame = frameOf(q.question);
      const answer = q.options[q.correct];
      if (!/^[A-Z]{3}$/.test(answer)) bad.push(`Q${q.id}: answer "${answer}" not 3 caps letters`);
      else if (!DICT.has(answer)) bad.push(`Q${q.id}: answer "${answer}" not a dictionary word`);
      else if (rebuildsAll(frame, answer).length === 0)
        bad.push(`Q${q.id}: answer "${answer}" rebuilds no word from frame "${frame}"`);
    });
    expect(bad).toEqual([]);
  });

  it('meets the per-tier word-maker bar (D1≤2, D2≥2, D3≥3)', () => {
    const bad = [];
    questions.forEach((q) => {
      const frame = frameOf(q.question);
      const makers = q.options.filter((o) => rebuildsAll(frame, o).length > 0).length;
      if (q.difficulty === 1 && makers > 2)
        bad.push(`Q${q.id} (D1): ${makers} word-makers — too hard/ambiguous for the easiest tier`);
      if (q.difficulty === 2 && makers < 2)
        bad.push(`Q${q.id} (D2): only ${makers} word-maker — solvable by elimination, no trap`);
      if (q.difficulty === 3 && makers < 3)
        bad.push(`Q${q.id} (D3): only ${makers} word-makers — elimination still works, too easy`);
    });
    expect(bad).toEqual([]);
  });

  it('D2 and D3 gaps are mid-word, never at the start or end of the host', () => {
    const bad = [];
    questions
      .filter((q) => q.difficulty >= 2)
      .forEach((q) => {
        const frame = frameOf(q.question);
        const answer = q.options[q.correct];
        const pos = gapFirstPos(frame, answer);
        if (pos === 0) bad.push(`Q${q.id}: gap at START (${answer}+${frame})`);
        else if (pos === frame.length) bad.push(`Q${q.id}: gap at END (${frame}+${answer})`);
      });
    expect(bad).toEqual([]);
  });

  it('every item has 5 unique options, an in-range answer, and a ✓ explanation', () => {
    const bad = [];
    questions.forEach((q) => {
      if (q.options.length !== 5 || new Set(q.options).size !== 5)
        bad.push(`Q${q.id}: options not 5-unique`);
      if (q.correct < 0 || q.correct >= q.options.length) bad.push(`Q${q.id}: correct out of range`);
      if (!q.explanation.trim().endsWith('✓')) bad.push(`Q${q.id}: explanation missing ✓`);
    });
    expect(bad).toEqual([]);
  });

  it('every 3-letter capitalised token in an explanation is an option or the frame', () => {
    // Guards the filler/trap naming: an explanation must never reference a 3-letter
    // option that was swapped out (caught real drift during the 26 Jun filler de-dup).
    // The frame itself (e.g. "MYS" for MYSELF) is a legitimate thing to name.
    // Scoped to the rebuilt tiers (D2/D3, ids 46-150) where filler/trap swapping happens
    // and this invariant is actively maintained. The legacy D1 tier uses a different prose
    // style (it capitalises words like "AND" for emphasis), so it is out of scope here.
    const bad = [];
    questions
      .filter((q) => q.difficulty >= 2)
      .forEach((q) => {
        const allowed = new Set([...q.options, frameOf(q.question)]);
        (q.explanation.match(/\b[A-Z]{3}\b/g) || []).forEach((t) => {
          if (!allowed.has(t)) bad.push(`Q${q.id}: explanation names "${t}", not an option or the frame`);
        });
      });
    expect(bad).toEqual([]);
  });
});

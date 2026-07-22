/**
 * VR fix #7 gate: hiddenWords natural sentences + balanceEquations expansion/mock-wiring.
 *
 * Pins the defining properties of fix #7 so they cannot silently regress:
 *  - hiddenWords sentences scale in length with difficulty (the old bank was flat at 5 words,
 *    a fake difficulty ramp). Still passes the locked oracleRegressions invariants.
 *  - balanceEquations expanded to >=100 and every answer recomputes.
 *  - balanceEquations is wired into all 3 VR mock paper variants and actually appears in a mock.
 */

import vrData from '../../questionData/vrData';
import { vrPaperVariants } from '../../questionData/mockVRConfig';
import { generateVRPaper } from '../../hooks/useMockTest';

const hidden = vrData.topics.hiddenWords.questions;
const balance = vrData.topics.balanceEquations.questions;

describe('hiddenWords — natural sentences with a real length ramp (fix #7)', () => {
  it('has the full bank of 150', () => {
    expect(hidden.length).toBe(150);
  });

  it('sentence length scales with difficulty (D1 6-7, D2 8-10, D3 10-12 words)', () => {
    const bands = { 1: [6, 7], 2: [8, 10], 3: [10, 12] };
    const bad = hidden.filter(q => {
      const [lo, hi] = bands[q.difficulty] || [0, 99];
      return q.options.length < lo || q.options.length > hi;
    });
    expect(bad.map(q => `${q.id}(D${q.difficulty}):${q.options.length}w`)).toEqual([]);
  });

  it('the hardest tier is genuinely longer than the easiest (no flat ramp)', () => {
    const avg = d => {
      const xs = hidden.filter(q => q.difficulty === d).map(q => q.options.length);
      return xs.reduce((a, b) => a + b, 0) / xs.length;
    };
    expect(avg(3)).toBeGreaterThan(avg(1) + 2); // clearly longer, not the old flat 5/5/5
  });

  it('still satisfies the locked invariants: neutral stem, adjacent correctPair, straddle', () => {
    const NEUTRAL = [
      'A 3-letter word is hidden across two of these adjacent words. Find the two words.',
      'A 4-letter word is hidden across two of these adjacent words. Find the two words.',
    ];
    const bad = [];
    hidden.forEach(q => {
      if (!NEUTRAL.includes(q.question)) bad.push(`${q.id}:stem`);
      const [i, j] = q.correctPair || [];
      if (j !== i + 1 || i < 0 || j >= q.options.length) bad.push(`${q.id}:pair`);
      const m = q.explanation && q.explanation.match(/word\s+([A-Za-z]+)\s+is hidden/i);
      if (!m) { bad.push(`${q.id}:noword`); return; }
      const hid = m[1].toUpperCase(), L = hid.length;
      if (L < 3 || L > 4) bad.push(`${q.id}:len`);
      const a = (q.options[i] || '').toUpperCase(), b = (q.options[j] || '').toUpperCase();
      let straddles = false;
      for (let k = 1; k <= L - 1; k++) {
        if (k <= a.length && (L - k) <= b.length && a.slice(a.length - k) + b.slice(0, L - k) === hid) straddles = true;
      }
      if (!straddles) bad.push(`${q.id}:straddle`);
    });
    expect(bad).toEqual([]);
  });
});

describe('balanceEquations — expanded + every answer recomputes (fix #7)', () => {
  it('bank expanded to at least 100', () => {
    expect(balance.length).toBeGreaterThanOrEqual(100);
  });

  // Parse the equation out of the question, substitute the keyed answer, assert both sides equal.
  function evalArith(expr) {
    if (!/^[-+*/(). 0-9]+$/.test(expr)) throw new Error('unsafe: ' + expr);
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + expr + ')')();
  }
  it('every equation balances at the keyed answer', () => {
    const bad = [];
    balance.forEach(q => {
      const body = q.question.split('\n\n')[1] || q.question.replace(/^Solve the equation:\s*/i, '');
      const ans = q.options[q.correct];
      const norm = s => s.replace(/\(\s*\)/g, `(${ans})`).replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').trim();
      const [lhs, rhs] = body.split('=');
      if (rhs === undefined) { bad.push(`${q.id}:no=`); return; }
      try {
        if (evalArith(norm(lhs)) !== evalArith(norm(rhs))) bad.push(`${q.id}: ${lhs.trim()} != ${rhs.trim()} at ${ans}`);
      } catch (e) { bad.push(`${q.id}:${e.message}`); }
    });
    expect(bad).toEqual([]);
  });

  it('every item has 5 distinct integer options and a ✓ explanation', () => {
    const bad = [];
    balance.forEach(q => {
      if (q.options.length !== 5 || new Set(q.options).size !== 5) bad.push(`${q.id}:opts`);
      if (q.options.some(o => !/^-?\d+$/.test(String(o).trim()))) bad.push(`${q.id}:nonint`);
      if (!q.explanation.trimEnd().endsWith('✓')) bad.push(`${q.id}:tick`);
    });
    expect(bad).toEqual([]);
  });
});

describe('balanceEquations — wired into the VR mock (fix #7)', () => {
  it('appears in every VR paper variant', () => {
    vrPaperVariants.forEach(v => {
      const has = v.sections.some(s => (s.sourceKey || s.topicKey) === 'balanceEquations');
      expect(has).toBe(true);
    });
  });

  it('generateVRPaper produces a balanceEquations section', () => {
    for (let r = 0; r < 15; r += 1) {
      const { questions } = generateVRPaper(vrData.topics);
      const be = questions.filter(q => q.topicKey === 'balanceEquations');
      expect(be.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Fix #3 gate — the English length tell must not regress, in EITHER bank.
// Guards both src/questionData/englishData.js AND the mock test bank
// (mockComprehensionData.js), which never had a length guard before Fix #3.
//
// Reuses the SAME measurement core as the CLI validator (no duplicated logic —
// single source of truth, per feedback_copies_of_truth_need_parity_tests).
// ============================================================================
import englishData from '../../questionData/englishData';
import mockPassages from '../../questionData/mockComprehensionData';
import {
  measureAll, gradeBucket, GATE,
} from '../../../scripts/validation/english-length-core.mjs';

const IN_SCOPE = ['MOCK-vocabulary', 'MOCK-comprehension', 'MAIN-vocabulary', 'MAIN-wordClassGrammar'];
const report = measureAll(englishData, mockPassages);

describe('English length-tell gate (Fix #3)', () => {
  test.each(IN_SCOPE)('%s: correct answer is not a length tell', (bucket) => {
    const m = report[bucket];
    expect(m).toBeDefined();
    const g = gradeBucket(bucket, m);
    if (!g.pass) {
      throw new Error(`${bucket} fails length gate:\n  ` + g.failures.join('\n  ') +
        `\n  (single-longest ${m.singleLongestPct}%, ranks ${m.rankHistPct.join('/')}, ties ${m.tiePct}%)`);
    }
    expect(g.pass).toBe(true);
  });

  test('gate thresholds are the agreed Fix #3 bands', () => {
    // pin the bands so a silent loosening is caught in review
    expect(GATE.singleLongestMinPct).toBe(10);
    expect(GATE.singleLongestMaxPct).toBe(30);
    expect(GATE.rankMaxPct).toBe(35);
  });

  test('out-of-scope buckets remain measured (proves we did not touch them)', () => {
    // main comprehension was already ~chance; assert it stays healthy
    const mc = report['MAIN-comprehension'];
    expect(mc.n).toBeGreaterThan(0);
    expect(mc.singleLongestPct).toBeLessThan(30);
  });
});

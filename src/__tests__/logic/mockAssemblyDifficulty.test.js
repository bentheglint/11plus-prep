/**
 * Mock assembly difficulty-ramp tests (fix #1 of the GL benchmark roadmap).
 *
 * Before this fix, English (spelling/punctuation/grammar) and VR sections were
 * assembled with `shuffle(pool).slice(0, n)` — a random draw that could come out
 * almost all-easy, so mocks regressed to (and below) the bank average. These
 * tests lock in that every sampled section is now drawn as a deliberate GL-style
 * difficulty ramp that always contains hard questions. Maths already ramped and
 * must stay unchanged.
 */

import {
  generateEnglishPaper,
  generateVRPaper,
  generateMathsPaper,
  distributionForCount,
} from '../../hooks/useMockTest';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';
import mathsData from '../../questionData/mathsData';

const RUNS = 60; // enough runs to catch a stochastic all-easy draw if it were possible

function bandCounts(questions) {
  const c = { 1: 0, 2: 0, 3: 0 };
  questions.forEach(q => { c[q.difficulty || 2] += 1; });
  return c;
}

describe('distributionForCount — pure difficulty allocation', () => {
  it('allocates the GL 30/40/30 mix and back-loads difficulty on ties', () => {
    expect(distributionForCount(8)).toEqual({ 1: 2, 2: 3, 3: 3 }); // 8-Q English section
    expect(distributionForCount(7)).toEqual({ 1: 2, 2: 3, 3: 2 }); // 7-Q VR section
    expect(distributionForCount(6)).toEqual({ 1: 2, 2: 2, 3: 2 }); // 6-Q VR section
    expect(distributionForCount(1)).toEqual({ 1: 0, 2: 1, 3: 0 }); // 1-Q logic section
  });

  it('always sums back to the requested count', () => {
    for (let n = 0; n <= 20; n += 1) {
      const d = distributionForCount(n);
      expect(d[1] + d[2] + d[3]).toBe(n);
    }
  });
});

describe('generateEnglishPaper — sampled sections ramp difficulty', () => {
  it('spelling/punctuation/grammar always hit the target mix (never all-easy)', () => {
    for (let r = 0; r < RUNS; r += 1) {
      const { questions } = generateEnglishPaper(englishData.topics);
      ['spelling', 'punctuation', 'grammar'].forEach(section => {
        const secQs = questions.filter(x => x.section === section).map(x => x.question);
        expect(secQs.length).toBe(8);
        const c = bandCounts(secQs);
        // Pools are large (hundreds each), so the target mix is hit exactly.
        expect(c).toEqual({ 1: 2, 2: 3, 3: 3 });
      });
    }
  });
});

describe('generateVRPaper — every type-section ramps difficulty', () => {
  it('no multi-question section is ever all-easy; hard questions always present', () => {
    for (let r = 0; r < RUNS; r += 1) {
      const { questions, sectionBreaks } = generateVRPaper(vrData.topics);
      sectionBreaks.forEach((sb, idx) => {
        const start = sb.index;
        const end = idx + 1 < sectionBreaks.length ? sectionBreaks[idx + 1].index : questions.length;
        const secQs = questions.slice(start, end).map(x => x.question);
        if (secQs.length >= 6) {
          const c = bandCounts(secQs);
          const target = distributionForCount(secQs.length);
          expect(c[3]).toBeGreaterThanOrEqual(target[3]); // hard tier guaranteed
          expect(c[1]).toBeGreaterThanOrEqual(1); // not stripped of easy either
        }
      });
    }
  });
});

describe('generateMathsPaper — unchanged (already ramped correctly)', () => {
  it('still produces 50 questions in a 15/20/15 band split', () => {
    const qs = generateMathsPaper({ maths: { topics: mathsData.topics } }).map(x => x.question);
    expect(qs.length).toBe(50);
    expect(bandCounts(qs)).toEqual({ 1: 15, 2: 20, 3: 15 });
  });
});

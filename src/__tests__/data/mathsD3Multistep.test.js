/**
 * Maths D3 elite multi-step tier — gate for benchmark fix #8 (22 Jul 2026).
 *
 * 100 new Difficulty-3 questions were appended across the 16 Maths topics to give
 * the hardest tier true 2-3-step / concept-switch chains (real GL's top ~10%), where
 * our previous D3 was mostly single-concept 1-2 step. Spec:
 * research/maths-d3-multistep-spec.md. Authored by the 11+ Oracle, verified by
 * scripts/data-generation/verify-maths-d3.mjs, inserted (position-balanced) by
 * scripts/data-generation/insert-maths-d3.mjs.
 *
 * The new items live in fixed, contiguous id ranges per topic (appended, so these
 * ranges are stable and uniquely identify the #8 wave even as the bank grows).
 */

import mathsData from '../../questionData/mathsData';

// Fixed id ranges of the #8 wave (inclusive), per topic — from the insert run.
const NEW_RANGES = {
  percentages: [213, 220],
  decimals: [254, 261],
  longdivision: [266, 273],
  ratio: [246, 249],
  fractions: [211, 218],
  longmultiplication: [229, 236],
  algebra: [313, 315],
  placevalue: [177, 179],
  negativenumbers: [180, 187],
  primenumbersfactors: [196, 203],
  areaperimeter: [210, 217],
  volume: [141, 144],
  anglesshapes: [226, 233],
  sequences: [183, 185],
  datahandling: [221, 223],
  speeddistancetime: [126, 133],
};

const EXPECTED_TOTAL_NEW = 100;
// 3376 baseline + 100 (fix #8). Later Maths waves (e.g. #9a graph-reading) only ADD, so
// assert >= rather than an exact total that every future wave would break; this wave's own
// items are pinned exactly by the id-range count checks below.
const MIN_BANK_TOTAL = 3476;

// Parse the leading numeric value from an option string: strips a leading sign +
// currency symbol ("-£11" -> -11), thousands separators, and any trailing unit/%.
function parseNumericOption(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.trim().replace(/−/g, '-');
  s = s.replace(/^(-?)\s*[£$]\s*/, '$1').replace(/,/g, '');
  const m = s.match(/^-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function newItemsForTopic(topicKey) {
  const topic = mathsData.topics[topicKey];
  const [lo, hi] = NEW_RANGES[topicKey];
  return (topic.questions || []).filter(q => q.id >= lo && q.id <= hi);
}

describe('Maths D3 multi-step wave (benchmark fix #8)', () => {
  it('bank total is at least the expected post-insert size', () => {
    const total = Object.values(mathsData.topics).reduce((a, t) => a + t.questions.length, 0);
    expect(total).toBeGreaterThanOrEqual(MIN_BANK_TOTAL);
  });

  it('every topic has exactly the expected number of new items in its id range', () => {
    let sum = 0;
    Object.keys(NEW_RANGES).forEach(topicKey => {
      const [lo, hi] = NEW_RANGES[topicKey];
      const expected = hi - lo + 1;
      const found = newItemsForTopic(topicKey).length;
      expect(`${topicKey}:${found}`).toBe(`${topicKey}:${expected}`);
      sum += found;
    });
    expect(sum).toBe(EXPECTED_TOTAL_NEW);
  });

  describe('each new item is a well-formed elite D3 question', () => {
    Object.keys(NEW_RANGES).forEach(topicKey => {
      it(`${topicKey}`, () => {
        newItemsForTopic(topicKey).forEach(q => {
          const at = `${topicKey}/Q${q.id}`;
          // difficulty
          expect(`${at} difficulty=${q.difficulty}`).toBe(`${at} difficulty=3`);
          // exactly 5 distinct options
          expect(Array.isArray(q.options)).toBe(true);
          expect(`${at} nOptions=${q.options.length}`).toBe(`${at} nOptions=5`);
          expect(`${at} distinct=${new Set(q.options).size}`).toBe(`${at} distinct=5`);
          // correct index in range
          expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 4).toBe(true);
          // explanation present and ends with the ✓ convention
          expect(typeof q.explanation === 'string' && q.explanation.trim().length > 0).toBe(true);
          expect(`${at} endsTick=${/✓\s*$/.test(q.explanation)}`).toBe(`${at} endsTick=true`);
          // multi-step signal: the explanation shows a step chain (either explicit
          // "Step" markers or >=2 distinct arithmetic operations in the working).
          const stepMarkers = (q.explanation.match(/Step\s*\d/gi) || []).length;
          const ops = (q.explanation.match(/[+\-×÷*/]/g) || []).length;
          expect(`${at} multistep=${stepMarkers >= 2 || ops >= 2}`).toBe(`${at} multistep=true`);
        });
      });
    });
  });

  it('does NOT reintroduce the middle-value tell (correct answer rarely the median)', () => {
    // Benchmark fix #2 found 51.5% of correct answers were the median of their 5
    // options (constant-gap "ladder" distractors). Across the whole #8 wave the
    // correct value must land at the median (rank 3 of 5 by magnitude) in <=30% of
    // items — the same guard the authoring harness enforces.
    let n = 0;
    let median = 0;
    Object.keys(NEW_RANGES).forEach(topicKey => {
      newItemsForTopic(topicKey).forEach(q => {
        const nums = q.options.map(parseNumericOption);
        if (nums.some(v => v === null)) return; // non-numeric option set — skip
        const sorted = nums.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
        const rank = sorted.findIndex(x => x.i === q.correct) + 1; // 1..5
        n += 1;
        if (rank === 3) median += 1;
      });
    });
    const share = n > 0 ? median / n : 0;
    expect(`medianShare=${(share * 100).toFixed(1)}% (n=${n})`).toBe(`medianShare=${(share * 100).toFixed(1)}% (n=${n})`);
    expect(share).toBeLessThanOrEqual(0.30);
  });

  it('no new item duplicates another new item\'s question text', () => {
    const seen = new Map();
    const dupes = [];
    Object.keys(NEW_RANGES).forEach(topicKey => {
      newItemsForTopic(topicKey).forEach(q => {
        const key = q.question.trim();
        if (seen.has(key)) dupes.push(`${topicKey}/Q${q.id} == ${seen.get(key)}`);
        else seen.set(key, `${topicKey}/Q${q.id}`);
      });
    });
    expect(dupes).toEqual([]);
  });
});

// ============================================================================
// Fix #5 gate — VR letterSums must stay in the authentic GL "answer as a letter"
// format, and must never regress to the old numeric-only build.
//
// The benchmark-vs-real-GL audit found our letterSums always asked for a NUMERIC
// answer (0 of 128 used the real "compute then map the result back to a LETTER"
// format), so the topic behaved like D1-D2. Fix #5 rebuilt it: the backbone is
// now answer-as-a-letter, in two sub-types —
//   SA: standard alphabet A=1..Z=26  -> AlphabetLine visual
//   CC: a custom code stated in-stem -> CodeTable visual (the A=1..Z=26 line
//       would be FALSE on these, so the visual MUST match the code)
// plus a thin retained numeric slice (word value / greatest value / difference).
// ============================================================================
import vrData from '../../questionData/vrData';

const ls = vrData.topics.letterSums.questions;
const D = d => ls.filter(q => q.difficulty === d);
const isLetterOptions = q => q.options.every(o => /^[A-Z]$/.test(String(o).trim()));
const asksForLetter = q => /as a letter/i.test(q.question);
const isCustomCode = q => /use this code/i.test(q.question);

describe('letterSums answer-as-a-letter gate (Fix #5)', () => {
  test('topic keeps its size and difficulty split', () => {
    expect(ls.length).toBe(128);
    expect(D(1).length).toBe(26);
    expect(D(2).length).toBe(57);
    expect(D(3).length).toBe(45);
  });

  test('the answer-as-a-letter format is the backbone (was 0/128 before)', () => {
    const letterItems = ls.filter(q => asksForLetter(q) && isLetterOptions(q));
    // SA (64) + CC (49) = 113 letter-answer items by design; guard well above the
    // retained numeric slice so a regression to numeric-only is caught.
    expect(letterItems.length).toBeGreaterThanOrEqual(100);
  });

  test('every "answer as a letter" item has single-letter options', () => {
    const bad = ls.filter(q => asksForLetter(q) && !isLetterOptions(q));
    expect(bad.map(q => q.id)).toEqual([]);
  });

  test('custom-code items use the CodeTable value-key, never the misleading alphabet line', () => {
    const bad = D(1).concat(D(2), D(3))
      .filter(isCustomCode)
      .filter(q => q.visual?.component !== 'CodeTable');
    expect(bad.map(q => q.id)).toEqual([]);
    // and there ARE custom-code items (the CC sub-type shipped)
    expect(ls.filter(isCustomCode).length).toBeGreaterThan(20);
  });

  test('standard-alphabet items carry the AlphabetLine visual', () => {
    const bad = ls.filter(q => !isCustomCode(q) && q.visual?.component !== 'AlphabetLine');
    expect(bad.map(q => q.id)).toEqual([]);
  });

  test('custom-code CodeTable value-key matches the letters used in its options', () => {
    // the value key shown must define every option letter (no option outside the code)
    for (const q of ls.filter(isCustomCode)) {
      const headers = q.visual.props.headers;
      for (const o of q.options) expect(headers).toContain(o);
    }
  });

  test('correct-answer position is evenly spread A-E (no position tell)', () => {
    const pos = [0, 0, 0, 0, 0];
    ls.forEach(q => pos[q.correct]++);
    const pct = pos.map(p => (100 * p) / ls.length);
    pct.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(12);
      expect(p).toBeLessThanOrEqual(28);
    });
  });

  test('every item is well-formed (5 options, valid index, ✓ explanation, visual)', () => {
    const bad = ls.filter(q =>
      !Array.isArray(q.options) || q.options.length !== 5 ||
      new Set(q.options.map(String)).size !== 5 ||
      !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 4 ||
      !/✓\s*$/.test(q.explanation || '') ||
      !q.visual || !q.visual.component
    );
    expect(bad.map(q => q.id)).toEqual([]);
  });
});

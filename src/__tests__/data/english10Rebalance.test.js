/**
 * English rebalance — gate for benchmark fix #10 (23 Jul 2026).
 *
 * 146 new items appended to englishData: 90 error-spotting to `punctuation`
 * (single-sentence capitals/end-punctuation + narrative error-spotting) and 56
 * passage-anchored vocabulary to `vocabulary`. Spec: research/english-10-rebalance-spec.md.
 * Authored by the 11+ Oracle, verified by scripts/data-generation/verify-english10.mjs +
 * two adversarial Oracle passes, inserted by scripts/data-generation/insert-english10.mjs.
 *
 * New items live in fixed, contiguous id ranges (appended), so these ranges uniquely
 * identify the #10 wave even as the bank grows.
 */

import englishData from '../../questionData/englishData';

const PUNCT_RANGE = [434, 523];   // 90 error-spotting
const VOCAB_RANGE = [454, 509];   // 56 passage-anchored vocab
const EXPECTED_BANK_TOTAL = 2707; // 2561 + 146
const FIXED_ES_OPTIONS = JSON.stringify(['Section A', 'Section B', 'Section C', 'Section D', 'No mistake']);

const inRange = (id, [lo, hi]) => id >= lo && id <= hi;
const newPunct = () => englishData.topics.punctuation.questions.filter(q => inRange(q.id, PUNCT_RANGE));
const newVocab = () => englishData.topics.vocabulary.questions.filter(q => inRange(q.id, VOCAB_RANGE));

describe('English rebalance wave (benchmark fix #10)', () => {
  it('bank total is the expected post-insert size', () => {
    const total = Object.values(englishData.topics).reduce((a, t) => a + t.questions.length, 0);
    expect(total).toBe(EXPECTED_BANK_TOTAL);
  });

  it('appended the expected counts in the id ranges', () => {
    expect(`punct:${newPunct().length}`).toBe('punct:90');
    expect(`vocab:${newVocab().length}`).toBe('vocab:56');
  });

  it('every new punctuation item is a well-formed error-spotting question', () => {
    newPunct().forEach(q => {
      const at = `punctuation/Q${q.id}`;
      expect(`${at} type=${q.questionType}`).toBe(`${at} type=error-spotting`);
      expect(`${at} segs=${Array.isArray(q.segments) ? q.segments.length : 'none'}`).toBe(`${at} segs=4`);
      expect(`${at} opts=${JSON.stringify(q.options)}`).toBe(`${at} opts=${FIXED_ES_OPTIONS}`);
      expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 4).toBe(true);
      expect(`${at} tick=${/✓\s*$/.test(q.explanation || '')}`).toBe(`${at} tick=true`);
    });
  });

  it('narrative error-spotting items (those with a passage) carry a real passage', () => {
    const narratives = newPunct().filter(q => q.passage);
    // there should be some (the 6 eight-line narratives = 30 items)
    expect(narratives.length).toBeGreaterThanOrEqual(24);
    narratives.forEach(q => {
      const at = `punctuation/Q${q.id}`;
      expect(typeof q.passage === 'string' && q.passage.trim().length > 0).toBe(true);
      expect(`${at} passageId=${!!q.passageId}`).toBe(`${at} passageId=true`);
      // the target sentence (segments joined) should appear in the passage
      const sentence = q.segments.join(' ').replace(/\s+/g, ' ').trim();
      const passageNorm = q.passage.replace(/\s+/g, ' ');
      const firstChunk = q.segments[0].replace(/\s+/g, ' ').trim();
      expect(`${at} segInPassage=${passageNorm.includes(firstChunk)}`).toBe(`${at} segInPassage=true`);
    });
  });

  it('every new vocabulary item is a well-formed passage-anchored question', () => {
    newVocab().forEach(q => {
      const at = `vocabulary/Q${q.id}`;
      expect(`${at} type=${q.questionType}`).toBe(`${at} type=passage`);
      expect(typeof q.passage === 'string' && q.passage.trim().length > 0).toBe(true);
      expect(`${at} passageId=${!!q.passageId}`).toBe(`${at} passageId=true`);
      expect(Array.isArray(q.options) && q.options.length === 5).toBe(true);
      expect(`${at} distinct=${new Set(q.options).size}`).toBe(`${at} distinct=5`);
      expect(Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 4).toBe(true);
      expect(`${at} tick=${/✓\s*$/.test(q.explanation || '')}`).toBe(`${at} tick=true`);
    });
  });

  it('vocabulary does NOT have a longest-answer tell (correct rarely the longest option)', () => {
    const items = newVocab();
    let longest = 0;
    items.forEach(q => {
      const lens = q.options.map(o => o.length);
      const max = Math.max(...lens);
      if (q.options[q.correct].length === max && lens.filter(l => l === max).length === 1) longest += 1;
    });
    const share = items.length ? longest / items.length : 0;
    expect(share).toBeLessThanOrEqual(0.25);
  });

  it('no duplicate new items (error-spotting keyed by explanation, vocab by question+passage)', () => {
    const seen = new Set();
    const dupes = [];
    newPunct().forEach(q => {
      const k = 'es:' + (q.explanation || '').trim();
      if (seen.has(k)) dupes.push(`punctuation/Q${q.id}`); else seen.add(k);
    });
    newVocab().forEach(q => {
      const k = 'v:' + (q.question || '').trim() + '|' + (q.passageId || '');
      if (seen.has(k)) dupes.push(`vocabulary/Q${q.id}`); else seen.add(k);
    });
    expect(dupes).toEqual([]);
  });
});

/**
 * Cloze authenticity gate (fix #6 of the GL benchmark roadmap).
 *
 * Pins the defining properties of the new English running-passage Cloze so they
 * cannot silently regress:
 *  - Main-bank cloze lives in `grammar`, grouped into passages of exactly 8 gaps.
 *  - Every gap is well-formed (its marker is in the passage, 5 distinct options,
 *    valid correct index, ✓ explanation).
 *  - Distractors are real "errors children write" (modal of-for-have + a spread of
 *    homophone families) — the whole point of the fix vs the old clean-distractor bank.
 *  - Correct-answer position is balanced A-E (no position tell).
 *  - Mock cloze passages exist, ramp to D3, and the English mock actually serves a
 *    cloze section.
 */

import englishData from '../../questionData/englishData';
import { mockClozePassages } from '../../questionData/mockClozeData';
import { generateEnglishPaper } from '../../hooks/useMockTest';

const grammar = englishData.topics.grammar.questions;
const clozeMain = grammar.filter(q => q.questionType === 'cloze');

const groups = {};
clozeMain.forEach(q => {
  if (!groups[q.passageId]) groups[q.passageId] = [];
  groups[q.passageId].push(q);
});

describe('Cloze — running-passage structure (fix #6)', () => {
  it('main bank carries cloze passages of exactly 8 gaps numbered 1-8', () => {
    expect(clozeMain.length).toBeGreaterThanOrEqual(64);
    expect(Object.keys(groups).length).toBeGreaterThanOrEqual(8);
    Object.entries(groups).forEach(([pid, gaps]) => {
      const nums = gaps.map(g => g.gapNumber).sort((a, b) => a - b);
      expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  it('every cloze item is well-formed (marker in passage, 5 distinct options, valid key, ✓)', () => {
    const bad = [];
    clozeMain.forEach(q => {
      if (!q.passage || !q.passage.includes(`___(${q.gapNumber})___`)) bad.push(`${q.id}:marker`);
      if (!Array.isArray(q.options) || q.options.length !== 5) bad.push(`${q.id}:opts`);
      else if (new Set(q.options).size !== 5) bad.push(`${q.id}:dup-opts`);
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 4) bad.push(`${q.id}:correct`);
      if (!q.explanation || !q.explanation.trimEnd().endsWith('✓')) bad.push(`${q.id}:tick`);
      if (!q.passageTitle) bad.push(`${q.id}:title`);
    });
    expect(bad).toEqual([]);
  });

  it('correct-answer position is balanced across A-E (no position tell)', () => {
    const dist = [0, 0, 0, 0, 0];
    clozeMain.forEach(q => { dist[q.correct] += 1; });
    dist.forEach(d => expect(d).toBeGreaterThan(0));
    expect(Math.max(...dist) - Math.min(...dist)).toBeLessThanOrEqual(4);
  });

  it('distractors are real child errors — modal of-for-have + homophone families present', () => {
    const allOpts = clozeMain.flatMap(q => q.options.map(o => o.toLowerCase()));
    expect(allOpts.some(o => o === 'should of' || o === 'could of' || o === 'of')).toBe(true);
    const palette = ['to', 'too', 'two', 'there', 'their', "they're", 'its', "it's",
      'your', "you're", 'whose', "who's", 'where', 'were', 'wear', 'hear', 'here',
      'past', 'passed', 'through', 'threw'];
    const seen = palette.filter(w => allOpts.includes(w));
    expect(seen.length).toBeGreaterThanOrEqual(6);
  });
});

describe('Cloze — mock passages (fix #6)', () => {
  it('has >=3 mock cloze passages, each 8 gaps that ramp to D3', () => {
    expect(mockClozePassages.length).toBeGreaterThanOrEqual(3);
    mockClozePassages.forEach(p => {
      expect(p.clozeQuestions.length).toBe(8);
      expect(p.passage).toMatch(/___\(1\)___/);
      const diffs = p.clozeQuestions.map(q => q.difficulty);
      expect(Math.max(...diffs)).toBe(3);
      expect(Math.min(...diffs)).toBe(1);
      p.clozeQuestions.forEach(q => {
        expect(q.questionType).toBe('cloze');
        expect(q.options.length).toBe(5);
        expect(new Set(q.options).size).toBe(5);
        expect(q.explanation.trimEnd().endsWith('✓')).toBe(true);
        expect(q.passage === undefined || typeof q.passage === 'string').toBe(true);
      });
    });
  });
});

describe('Cloze — wired into the English mock', () => {
  it('generateEnglishPaper serves a cloze section of 8 ordered gaps with a passage', () => {
    for (let r = 0; r < 20; r += 1) {
      const { questions } = generateEnglishPaper(englishData.topics);
      const cloze = questions.filter(x => x.section === 'cloze');
      expect(cloze.length).toBe(8);
      const nums = cloze.map(x => x.question.gapNumber);
      expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      cloze.forEach(x => {
        expect(x.passage).toBeTruthy();
        expect(x.question.questionType).toBe('cloze');
      });
    }
  });
});

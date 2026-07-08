/**
 * Spelling error-spotting key-integrity guard.
 *
 * The Q292 bug class: an 'error-spotting' question's `correct` field points
 * at a segment that does NOT contain the misspelling the explanation
 * describes (ids 292/137/255 were mis-keyed like this before this test was
 * added — see scripts/question-tools/scan-error-spotting-keys.mjs for the
 * standalone scanner this test mirrors).
 *
 * For every 'spelling'-topic error-spotting question keyed to a real
 * section (not "No mistake"), at least one full single-quoted string in the
 * explanation (the misspelling, its correction, or both — phrasing varies,
 * see the scanner's header comment for why every quote is checked and why
 * single-character quotes are excluded) must appear as a case-insensitive
 * substring of the keyed segment. If a future edit mis-keys a spelling
 * question, this test fails CI.
 */

import englishData from '../../questionData/englishData';

const MIN_QUOTE_LEN = 2; // discard single-character memory-aid fragments (e.g. 'i')

const allQuoted = (text) =>
  [...(text || '').matchAll(/'([^']+)'/g)].map((m) => m[1]);

const containsSubstring = (segment, quoted) =>
  !!segment && !!quoted && segment.toLowerCase().includes(quoted.toLowerCase());

describe('spelling error-spotting key integrity', () => {
  const spellingQuestions = englishData.topics.spelling.questions.filter(
    (q) => q.questionType === 'error-spotting'
  );

  // Sanity check on the fixture itself — if this drops to 0, the filter
  // above is broken and every test below would vacuously pass.
  test('fixture sanity: spelling has error-spotting questions to check', () => {
    expect(spellingQuestions.length).toBeGreaterThan(0);
  });

  spellingQuestions.forEach((q) => {
    const noMistakeIdx = (q.options || []).findIndex((o) => /no mistake/i.test(o));
    if (q.correct === noMistakeIdx) return; // no segment error expected — nothing to verify

    test(`id ${q.id}: 'correct' index points at a segment containing the quoted misspelling`, () => {
      const segment = (q.segments || [])[q.correct];
      expect(segment).toBeDefined(); // 'correct' must be a real segment index

      const quoted = allQuoted(q.explanation).filter((w) => w.length >= MIN_QUOTE_LEN);
      if (!quoted.length) return; // nothing quoted to verify against — skip, not a failure

      const hit = quoted.some((qw) => containsSubstring(segment, qw));
      if (!hit) {
        throw new Error(
          `Question id ${q.id}: correct=${q.correct} keys segment ${JSON.stringify(segment)}, ` +
          `but none of the quoted explanation strings ${JSON.stringify(quoted)} appear in it. ` +
          `Explanation: ${q.explanation}`
        );
      }
      expect(hit).toBe(true);
    });
  });
});

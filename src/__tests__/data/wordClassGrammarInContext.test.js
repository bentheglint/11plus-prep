// ============================================================================
// Fix #4 gate — the wordClassGrammar rebuild must not regress.
//
// The benchmark-vs-real-GL audit found wordClassGrammar tested word class as
// ISOLATED word lists ("What type of words are these: a, b, c, d?"), which is
// structurally incapable of GL difficulty. Fix #4 rebuilt every D2 and D3 item
// as an IN-CONTEXT, trap-bearing question: a target word inside a sentence,
// classified as-used. This gate pins that so a future edit can't quietly
// reintroduce the bare-list format or a correct-answer POSITION tell.
//
// Correct-answer position is the tell we care about here (option length is not
// a meaningful vector once answers are class labels — see englishLengthRank).
// ============================================================================
import englishData from '../../questionData/englishData';

const wcg = englishData.topics.wordClassGrammar.questions;
const D = d => wcg.filter(q => q.difficulty === d);

// The retired isolated-word-list formats. No D2/D3 item may use them again.
const BARE_LIST = /(what type of words are these|which word class do|what part of speech are the words|what type of words? are the following)/i;
// In-context items either mark a *target* word in a sentence, or ask
// "which word is a [class]?" over a quoted sentence.
const IN_CONTEXT = q => /\*[^*]+\*/.test(q.question) || /which word is/i.test(q.question);

describe('wordClassGrammar rebuild gate (Fix #4)', () => {
  test('topic keeps its full size and difficulty split', () => {
    expect(wcg.length).toBe(404);
    expect(D(1).length).toBe(121);
    expect(D(2).length).toBe(170);
    expect(D(3).length).toBe(113);
  });

  test('every D2 and D3 item is in-context, never a bare word list', () => {
    const offenders = [...D(2), ...D(3)].filter(q => BARE_LIST.test(q.question) || !IN_CONTEXT(q));
    if (offenders.length) {
      throw new Error(
        `${offenders.length} D2/D3 item(s) are not in-context:\n  ` +
        offenders.slice(0, 8).map(q => `id${q.id}: ${q.question.slice(0, 70)}`).join('\n  ')
      );
    }
    expect(offenders.length).toBe(0);
  });

  test('D3 items place the target inside a sentence (asterisk-marked)', () => {
    // D3 traps are dual/triple-function words that only the sentence resolves,
    // so every D3 item must mark a target word in a real sentence.
    const bad = D(3).filter(q => !/\*[^*]+\*/.test(q.question));
    expect(bad.map(q => q.id)).toEqual([]);
  });

  test('rebuilt D2+D3 correct-answer position is evenly spread A-E (no position tell)', () => {
    // Fix #4 balances positions for the rebuilt items only; D1 is untouched
    // (its options and answers are byte-identical to before), so we gate the
    // 283 rebuilt items — the content this fix is responsible for.
    const rebuilt = [...D(2), ...D(3)];
    const pos = [0, 0, 0, 0, 0];
    rebuilt.forEach(q => pos[q.correct]++);
    const pct = pos.map(p => (100 * p) / rebuilt.length);
    // even spread band: chance is 20%; allow drift but no dominant/starved slot.
    pct.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(12);
      expect(p).toBeLessThanOrEqual(28);
    });
  });

  test('every item is well-formed (5 options, valid index, ✓ explanation)', () => {
    const bad = wcg.filter(q =>
      !Array.isArray(q.options) || q.options.length !== 5 ||
      !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 4 ||
      !/✓\s*$/.test(q.explanation || '')
    );
    expect(bad.map(q => q.id)).toEqual([]);
  });
});

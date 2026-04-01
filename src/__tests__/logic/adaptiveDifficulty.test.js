import { getAdaptiveDifficulty } from '../../utils/adaptiveDifficulty';

describe('getAdaptiveDifficulty', () => {
  // Basic behaviour
  it('returns current difficulty with fewer than 2 results', () => {
    expect(getAdaptiveDifficulty([], 2)).toBe(2);
    expect(getAdaptiveDifficulty([{ correct: true, difficulty: 2 }], 2)).toBe(2);
  });

  it('defaults to difficulty 2 when no current difficulty given', () => {
    expect(getAdaptiveDifficulty([])).toBe(2);
  });

  // Step up: >=75% correct in last 4
  it('steps up when 3/4 correct (75%)', () => {
    const results = [
      { correct: true, difficulty: 1 },
      { correct: true, difficulty: 1 },
      { correct: true, difficulty: 1 },
      { correct: false, difficulty: 1 },
    ];
    expect(getAdaptiveDifficulty(results, 1)).toBe(2);
  });

  it('steps up when 4/4 correct (100%)', () => {
    const results = [
      { correct: true, difficulty: 2 },
      { correct: true, difficulty: 2 },
      { correct: true, difficulty: 2 },
      { correct: true, difficulty: 2 },
    ];
    expect(getAdaptiveDifficulty(results, 2)).toBe(3);
  });

  it('does not step up above 3', () => {
    const results = [
      { correct: true, difficulty: 3 },
      { correct: true, difficulty: 3 },
      { correct: true, difficulty: 3 },
      { correct: true, difficulty: 3 },
    ];
    expect(getAdaptiveDifficulty(results, 3)).toBe(3);
  });

  // Step down: <=25% correct in last 4
  it('steps down when 1/4 correct (25%)', () => {
    const results = [
      { correct: false, difficulty: 2 },
      { correct: false, difficulty: 2 },
      { correct: false, difficulty: 2 },
      { correct: true, difficulty: 2 },
    ];
    expect(getAdaptiveDifficulty(results, 2)).toBe(1);
  });

  it('steps down when 0/4 correct (0%)', () => {
    const results = [
      { correct: false, difficulty: 3 },
      { correct: false, difficulty: 3 },
      { correct: false, difficulty: 3 },
      { correct: false, difficulty: 3 },
    ];
    expect(getAdaptiveDifficulty(results, 3)).toBe(2);
  });

  it('does not step down below 1', () => {
    const results = [
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
    ];
    expect(getAdaptiveDifficulty(results, 1)).toBe(1);
  });

  // Hold: mixed results (26-74%)
  it('holds at current level with 2/4 correct (50%)', () => {
    const results = [
      { correct: true, difficulty: 2 },
      { correct: false, difficulty: 2 },
      { correct: true, difficulty: 2 },
      { correct: false, difficulty: 2 },
    ];
    expect(getAdaptiveDifficulty(results, 2)).toBe(2);
  });

  // Sliding window: only uses last 4
  it('only considers the last 4 results', () => {
    const results = [
      // Old results: all wrong
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
      { correct: false, difficulty: 1 },
      // Recent results: all correct
      { correct: true, difficulty: 1 },
      { correct: true, difficulty: 1 },
      { correct: true, difficulty: 1 },
      { correct: true, difficulty: 1 },
    ];
    expect(getAdaptiveDifficulty(results, 1)).toBe(2);
  });

  // Bug regression: results must include difficulty field
  // (Fixed 2026-04-01: answers were missing difficulty, causing garbage data)
  it('works correctly when results have difficulty field', () => {
    const results = [
      { correct: true, difficulty: 2 },
      { correct: true, difficulty: 2 },
      { correct: true, difficulty: 2 },
      { correct: false, difficulty: 2 },
    ];
    const result = getAdaptiveDifficulty(results, 2);
    expect(result).toBe(3); // 75% = step up
    expect(typeof result).toBe('number');
  });
});

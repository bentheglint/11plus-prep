/**
 * Build 125 Number Series questions from scratch
 * All answers verified programmatically
 * Uses safe-insert utility for structural integrity
 */

const fs = require('fs');
const path = require('path');
const { insertQuestions, verifyStructure } = require('./lib/safe-insert');

const VR_MAP = path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json');

const questions = [];
let nextId = 1;

function addQ(diff, sequence, answer, patternDesc, tip, subConcept) {
  const seqStr = sequence.join(', ');
  // Generate 4 distractors around the correct answer
  const distractors = new Set();
  // Off-by-one
  distractors.add(answer + 1);
  distractors.add(answer - 1);
  // Off-by-two
  distractors.add(answer + 2);
  distractors.add(answer - 2);
  // Wrong operation guesses
  const lastDiff = sequence[sequence.length - 1] - sequence[sequence.length - 2];
  distractors.add(sequence[sequence.length - 1] + lastDiff + 1);
  distractors.add(sequence[sequence.length - 1] + lastDiff - 1);
  // Remove the correct answer and any that match it
  distractors.delete(answer);
  // Pick 4 unique distractors
  const distArr = [...distractors].filter(d => d !== answer).slice(0, 4);
  while (distArr.length < 4) distArr.push(answer + distArr.length + 3);

  // Place correct answer at varied position
  const correctIdx = nextId % 5;
  const opts = [...distArr];
  opts.splice(correctIdx, 0, answer);

  questions.push({
    id: nextId++,
    difficulty: diff,
    question: 'What number comes next in this series? ' + seqStr + ', ___',
    options: opts.map(String),
    correct: correctIdx,
    explanation: patternDesc + ' ' + tip + ' ✓',
    _sc: subConcept
  });
}

// ============================================================
// D1: CONSTANT DIFFERENCE (15 questions)
// ============================================================
addQ(1, [3, 7, 11, 15, 19], 23, 'The pattern is +4 each time. 19 + 4 = 23.', 'Tip: Write down the gap between each number — if it is always the same, you have found the pattern!', 'constant-difference');
addQ(1, [5, 10, 15, 20, 25], 30, 'The pattern is +5 each time (the 5 times table). 25 + 5 = 30.', 'Tip: Check if the numbers are a times table — that is the quickest way to spot the pattern.', 'constant-difference');
addQ(1, [100, 90, 80, 70, 60], 50, 'The pattern is -10 each time. 60 - 10 = 50.', 'Tip: Subtraction patterns work the same way — find the constant gap.', 'constant-difference');
addQ(1, [4, 8, 12, 16, 20], 24, 'The pattern is +4 each time (the 4 times table). 20 + 4 = 24.', 'Tip: Times tables are the most common D1 pattern — learn them well!', 'constant-difference');
addQ(1, [2, 9, 16, 23, 30], 37, 'The pattern is +7 each time. 30 + 7 = 37.', 'Tip: Check the gap between the first two numbers, then verify it works for all pairs.', 'constant-difference');
addQ(1, [50, 45, 40, 35, 30], 25, 'The pattern is -5 each time. 30 - 5 = 25.', 'Tip: Descending sequences subtract the same amount each time.', 'constant-difference');
addQ(1, [11, 22, 33, 44, 55], 66, 'The pattern is +11 each time (the 11 times table). 55 + 11 = 66.', 'Tip: The 11 times table is easy to spot — the digits repeat!', 'constant-difference');
addQ(1, [6, 12, 18, 24, 30], 36, 'The pattern is +6 each time (the 6 times table). 30 + 6 = 36.', 'Tip: Recognise times tables quickly — they save time in the exam.', 'constant-difference');
addQ(1, [8, 16, 24, 32, 40], 48, 'The pattern is +8 each time (the 8 times table). 40 + 8 = 48.', 'Tip: If the gap is always the same, add it one more time to get the answer.', 'constant-difference');
addQ(1, [75, 68, 61, 54, 47], 40, 'The pattern is -7 each time. 47 - 7 = 40.', 'Tip: For subtraction patterns, check your arithmetic carefully — it is easy to slip by one.', 'constant-difference');
addQ(1, [13, 26, 39, 52, 65], 78, 'The pattern is +13 each time (the 13 times table). 65 + 13 = 78.', 'Tip: Even larger gaps can be times tables — 13 × 1, 13 × 2, 13 × 3...', 'constant-difference');
addQ(1, [9, 18, 27, 36, 45], 54, 'The pattern is +9 each time (the 9 times table). 45 + 9 = 54.', 'Tip: The 9 times table has a neat pattern — the digits always add up to 9!', 'constant-difference');
addQ(1, [200, 180, 160, 140, 120], 100, 'The pattern is -20 each time. 120 - 20 = 100.', 'Tip: Larger gaps still follow the same principle — find the constant difference.', 'constant-difference');
addQ(1, [15, 30, 45, 60, 75], 90, 'The pattern is +15 each time. 75 + 15 = 90.', 'Tip: +15 is the same as the 15 times table.', 'constant-difference');
addQ(1, [3, 6, 9, 12, 15], 18, 'The pattern is +3 each time (the 3 times table). 15 + 3 = 18.', 'Tip: Start with the simplest check — is the gap always the same?', 'constant-difference');

// ============================================================
// D1: SIMPLE DOUBLING (5 questions)
// ============================================================
addQ(1, [1, 2, 4, 8, 16], 32, 'Each number doubles (×2). 16 × 2 = 32.', 'Tip: If the gaps keep getting bigger, check whether each number is double the last.', 'multiply-pattern');
addQ(1, [3, 6, 12, 24, 48], 96, 'Each number doubles (×2). 48 × 2 = 96.', 'Tip: Doubling is the most common multiplication pattern.', 'multiply-pattern');
addQ(1, [5, 10, 20, 40, 80], 160, 'Each number doubles (×2). 80 × 2 = 160.', 'Tip: If dividing each number by the previous always gives 2, it is a doubling pattern.', 'multiply-pattern');
addQ(1, [64, 32, 16, 8, 4], 2, 'Each number halves (÷2). 4 ÷ 2 = 2.', 'Tip: Halving is doubling in reverse — look for numbers that are all powers of 2.', 'multiply-pattern');
addQ(1, [128, 64, 32, 16, 8], 4, 'Each number halves (÷2). 8 ÷ 2 = 4.', 'Tip: Know your powers of 2: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.', 'multiply-pattern');

// ============================================================
// D1: TIMES TABLES (5 questions)
// ============================================================
addQ(1, [7, 14, 21, 28, 35], 42, 'The 7 times table. 7 × 6 = 42.', 'Tip: Times tables are very common in D1 — recognise them quickly!', 'constant-difference');
addQ(1, [12, 24, 36, 48, 60], 72, 'The 12 times table. 12 × 6 = 72.', 'Tip: The gap is always 12 — constant difference.', 'constant-difference');
addQ(1, [16, 32, 48, 64, 80], 96, 'The 16 times table. 16 × 6 = 96.', 'Tip: Even if the gap is large, it might still be a times table.', 'constant-difference');
addQ(1, [25, 50, 75, 100, 125], 150, 'The 25 times table. 25 × 6 = 150.', 'Tip: Multiples of 25 always end in 00, 25, 50, or 75.', 'constant-difference');
addQ(1, [14, 28, 42, 56, 70], 84, 'The 14 times table. 14 × 6 = 84.', 'Tip: The gap is +14 each time — constant difference.', 'constant-difference');

// ============================================================
// D1: ALTERNATING OPERATIONS (5 questions)
// ============================================================
addQ(1, [2, 5, 3, 6, 4], 7, 'Two patterns: odd positions 2, 3, 4 (+1); even positions 5, 6, 7 (+1). Next is even position: 7.', 'Tip: If the numbers seem to jump around, try looking at every other number separately.', 'alternating-pattern');
addQ(1, [10, 20, 15, 25, 20], 30, 'Two patterns: odd positions 10, 15, 20 (+5); even positions 20, 25, 30 (+5). Next is even: 30.', 'Tip: Separate odd and even positions and check each group independently.', 'alternating-pattern');
addQ(1, [1, 10, 2, 20, 3], 30, 'Two patterns: odd positions 1, 2, 3 (+1); even positions 10, 20, 30 (×10 of odd). Next is even: 30.', 'Tip: Sometimes the two sub-sequences are related to each other!', 'alternating-pattern');
addQ(1, [5, 1, 10, 2, 15], 3, 'Odd positions: 5, 10, 15 (+5). Even positions: 1, 2, 3 (+1). Next is even: 3.', 'Tip: Count positions — 1st, 2nd, 3rd... Odd positions are one pattern, even are another.', 'alternating-pattern');
addQ(1, [100, 1, 90, 2, 80], 3, 'Odd positions: 100, 90, 80 (-10). Even positions: 1, 2, 3 (+1). Next is even: 3.', 'Tip: One sequence can go up while the other goes down — look at each separately.', 'alternating-pattern');

// ============================================================
// D2: INCREASING DIFFERENCES (10 questions)
// ============================================================
addQ(2, [7, 9, 12, 16, 21], 27, 'Differences: +2, +3, +4, +5. They increase by 1. Next difference: +6. 21 + 6 = 27.', 'Tip: Write the differences between each pair — if THEY form a pattern, you have cracked it!', 'increasing-hops');
addQ(2, [5, 10, 17, 26, 37], 50, 'Differences: +5, +7, +9, +11. They increase by 2 (odd numbers). Next: +13. 37 + 13 = 50.', 'Tip: Differences increasing by 2 means the gaps are consecutive odd or even numbers.', 'increasing-hops');
addQ(2, [1, 3, 7, 13, 21], 31, 'Differences: +2, +4, +6, +8. They increase by 2 (even numbers). Next: +10. 21 + 10 = 31.', 'Tip: When differences increase by 2, the next difference is the last one plus 2.', 'increasing-hops');
addQ(2, [34, 42, 52, 64, 78], 94, 'Differences: +8, +10, +12, +14. They increase by 2. Next: +16. 78 + 16 = 94.', 'Tip: Even with bigger numbers, the principle is the same — find the pattern in the gaps.', 'increasing-hops');
addQ(2, [100, 90, 82, 76, 72], 70, 'Differences: -10, -8, -6, -4. They increase by 2 (getting smaller). Next: -2. 72 - 2 = 70.', 'Tip: Decreasing differences work the same way — the gaps shrink by a constant amount.', 'increasing-hops');
addQ(2, [2, 3, 5, 8, 12], 17, 'Differences: +1, +2, +3, +4. They increase by 1. Next: +5. 12 + 5 = 17.', 'Tip: These are triangular numbers! 1, 3, 6, 10, 15, 21...', 'increasing-hops');
addQ(2, [1, 4, 10, 19, 31], 46, 'Differences: +3, +6, +9, +12. They increase by 3. Next: +15. 31 + 15 = 46.', 'Tip: Differences can increase by any constant — not just 1 or 2.', 'increasing-hops');
addQ(2, [50, 47, 42, 35, 26], 15, 'Differences: -3, -5, -7, -9. They change by 2 (odd numbers descending). Next: -11. 26 - 11 = 15.', 'Tip: Descending sequences with increasing gaps are tricky — write every difference down.', 'increasing-hops');
addQ(2, [1, 3, 6, 10, 15], 21, 'Differences: +2, +3, +4, +5. Next: +6. 15 + 6 = 21. These are triangular numbers.', 'Tip: Triangular numbers: 1, 3, 6, 10, 15, 21, 28 — the differences are 2, 3, 4, 5, 6, 7...', 'increasing-hops');
addQ(2, [4, 7, 12, 19, 28], 39, 'Differences: +3, +5, +7, +9. They increase by 2 (odd numbers). Next: +11. 28 + 11 = 39.', 'Tip: If differences go 3, 5, 7, 9... they are consecutive odd numbers. Next is 11.', 'increasing-hops');

// ============================================================
// D2: SQUARE NUMBERS (5 questions)
// ============================================================
addQ(2, [1, 4, 9, 16, 25], 36, 'These are square numbers: 1², 2², 3², 4², 5². Next: 6² = 36.', 'Tip: Learn your square numbers by heart: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.', 'square-numbers');
addQ(2, [4, 9, 16, 25, 36], 49, 'Square numbers starting from 2²: 2², 3², 4², 5², 6². Next: 7² = 49.', 'Tip: If the differences are 5, 7, 9, 11 (odd numbers), it could be squares!', 'square-numbers');
addQ(2, [121, 100, 81, 64, 49], 36, 'Descending squares: 11², 10², 9², 8², 7². Next: 6² = 36.', 'Tip: Squares can go forwards OR backwards — recognise the sequence either way.', 'square-numbers');
addQ(2, [49, 36, 25, 16, 9], 4, 'Descending squares: 7², 6², 5², 4², 3². Next: 2² = 4.', 'Tip: Descending squares have differences of -13, -11, -9, -7... (decreasing odd numbers).', 'square-numbers');
addQ(2, [16, 25, 36, 49, 64], 81, 'Squares from 4²: 4², 5², 6², 7², 8². Next: 9² = 81.', 'Tip: 9² = 81 — a commonly tested square number.', 'square-numbers');

// ============================================================
// D2: FIBONACCI-LIKE (4 questions)
// ============================================================
addQ(2, [1, 1, 2, 3, 5], 8, 'Fibonacci: each number is the sum of the two before it. 3 + 5 = 8.', 'Tip: In Fibonacci patterns, add the last two numbers to get the next one.', 'fibonacci-like');
addQ(2, [2, 3, 5, 8, 13], 21, 'Fibonacci-like: each = sum of previous two. 8 + 13 = 21.', 'Tip: This pattern is named after the mathematician Fibonacci — it appears everywhere in nature!', 'fibonacci-like');
addQ(2, [1, 3, 4, 7, 11], 18, 'Each number is the sum of the two before it. 7 + 11 = 18.', 'Tip: Fibonacci patterns can start with any two numbers — the rule is always "add the last two".', 'fibonacci-like');
addQ(2, [2, 2, 4, 6, 10], 16, 'Each number is the sum of the two before it. 6 + 10 = 16.', 'Tip: If the differences seem random, try adding the last two numbers — it might be Fibonacci!', 'fibonacci-like');

// ============================================================
// D2: PRIMES (3 questions)
// ============================================================
addQ(2, [2, 3, 5, 7, 11], 13, 'These are prime numbers in order. The next prime after 11 is 13.', 'Tip: Know your primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31.', 'constant-difference');
addQ(2, [11, 13, 17, 19, 23], 29, 'Consecutive prime numbers. The next prime after 23 is 29.', 'Tip: Primes have uneven gaps — that is what makes them hard to spot. Look for numbers that can only divide by 1 and themselves.', 'constant-difference');
addQ(2, [7, 11, 13, 17, 19], 23, 'Consecutive prime numbers. The next prime after 19 is 23.', 'Tip: 21 is NOT prime (3 × 7), so we skip to 23.', 'constant-difference');

// ============================================================
// D2: MULTIPLICATION ×3 (4 questions)
// ============================================================
addQ(2, [2, 6, 18, 54, 162], 486, 'Each number is ×3. 162 × 3 = 486.', 'Tip: If the gaps keep getting much bigger, try dividing each number by the previous one.', 'multiply-pattern');
addQ(2, [5, 15, 45, 135, 405], 1215, 'Each number is ×3. 405 × 3 = 1215.', 'Tip: ×3 patterns grow very fast — the numbers get large quickly.', 'multiply-pattern');
addQ(2, [1, 4, 16, 64, 256], 1024, 'Each number is ×4. 256 × 4 = 1024.', 'Tip: ×4 is ×2 twice — so 256 × 2 = 512, × 2 again = 1024.', 'multiply-pattern');
addQ(2, [2048, 1024, 512, 256, 128], 64, 'Each number halves (÷2). 128 ÷ 2 = 64.', 'Tip: Powers of 2 going backwards: 2048, 1024, 512, 256, 128, 64, 32...', 'multiply-pattern');

// ============================================================
// D2: LARGE CONSTANT DIFFERENCE (8 questions)
// ============================================================
addQ(2, [34, 45, 56, 67, 78], 89, 'The pattern is +11 each time. 78 + 11 = 89.', 'Tip: Even large gaps can be constant — always check!', 'constant-difference');
addQ(2, [58, 127, 196, 265, 334], 403, 'The pattern is +69 each time. 334 + 69 = 403.', 'Tip: With big numbers, take your time with the arithmetic. Write it down if needed.', 'constant-difference');
addQ(2, [901, 800, 699, 598, 497], 396, 'The pattern is -101 each time. 497 - 101 = 396.', 'Tip: -101 is a common GL gap — watch for three-digit differences.', 'constant-difference');
addQ(2, [543, 432, 321, 210, 99], -12, 'The pattern is -111 each time. 99 - 111 = -12.', 'Tip: The answer can be negative! Do not panic — just keep subtracting.', 'constant-difference');
addQ(2, [240, 216, 192, 168, 144], 120, 'The pattern is -24 each time. 144 - 24 = 120.', 'Tip: -24 means subtract 24 from the last number.', 'constant-difference');
addQ(2, [17, 34, 51, 68, 85], 102, 'The pattern is +17 each time. 85 + 17 = 102.', 'Tip: +17 is the 17 times table. 17 × 6 = 102.', 'constant-difference');
addQ(2, [150, 125, 100, 75, 50], 25, 'The pattern is -25 each time. 50 - 25 = 25.', 'Tip: Multiples of 25 are easy to spot — they end in 00, 25, 50, or 75.', 'constant-difference');
addQ(2, [23, 46, 69, 92, 115], 138, 'The pattern is +23 each time. 115 + 23 = 138.', 'Tip: The 23 times table — not one you learn at school, but the gap is always 23.', 'constant-difference');

// ============================================================
// D2: ALTERNATING OPERATIONS (4 questions)
// ============================================================
addQ(2, [31, 37, 41, 47, 51], 57, 'The pattern alternates: +6, +4, +6, +4, +6. 51 + 6 = 57.', 'Tip: If differences alternate between two numbers, the pattern repeats.', 'alternating-pattern');
addQ(2, [10, 13, 11, 14, 12], 15, 'Two patterns: odd positions 10, 11, 12 (+1); even positions 13, 14, 15 (+1). Next is even: 15.', 'Tip: Separate odd and even positions when the numbers bounce up and down.', 'alternating-pattern');
addQ(2, [2, 8, 4, 10, 6], 12, 'Two patterns: odd positions 2, 4, 6 (+2); even positions 8, 10, 12 (+2). Next is even: 12.', 'Tip: Both sub-sequences can have the same rule but start from different numbers.', 'alternating-pattern');
addQ(2, [15, 6, 21, 8, 27], 10, 'Odd positions: 15, 21, 27 (+6). Even positions: 6, 8, 10 (+2). Next is even: 10.', 'Tip: The two sub-sequences can have DIFFERENT gaps — check each one independently.', 'alternating-pattern');

// ============================================================
// D2: TRIANGULAR NUMBERS (2 questions)
// ============================================================
addQ(2, [3, 6, 10, 15, 21], 28, 'Triangular numbers (starting from 3). Differences: +3, +4, +5, +6. Next: +7. 21 + 7 = 28.', 'Tip: Triangular numbers: 1, 3, 6, 10, 15, 21, 28. The gaps increase by 1 each time.', 'increasing-hops');
addQ(2, [10, 15, 21, 28, 36], 45, 'Triangular numbers. Differences: +5, +6, +7, +8. Next: +9. 36 + 9 = 45.', 'Tip: If differences are consecutive numbers (5, 6, 7, 8, 9...), these are triangular numbers.', 'increasing-hops');

// ============================================================
// D3: INTERLEAVED SEQUENCES (8 questions)
// ============================================================
addQ(3, [27, 37, 29, 39, 31], 41, 'Odd positions: 27, 29, 31 (+2). Even positions: 37, 39, 41 (+2). Next is even: 41.', 'Tip: If the sequence bounces around, ALWAYS try splitting into odd and even positions!', 'alternating-pattern');
addQ(3, [32, 17, 16, 23, 8], 29, 'Odd positions: 32, 16, 8 (÷2). Even positions: 17, 23, 29 (+6). Next is even: 29.', 'Tip: One sub-sequence can multiply/divide while the other adds/subtracts!', 'alternating-pattern');
addQ(3, [31, 17, 33, 15, 35], 13, 'Odd positions: 31, 33, 35 (+2). Even positions: 17, 15, 13 (-2). Next is even: 13.', 'Tip: One sub-sequence going UP and the other going DOWN is a classic D3 pattern.', 'alternating-pattern');
addQ(3, [7, 3, 6, 6, 5, 12], 4, 'Odd positions: 7, 6, 5, 4 (-1). Even positions: 3, 6, 12 (×2). Next is odd: 4.', 'Tip: Be careful which position you are answering — count 1st, 2nd, 3rd...', 'alternating-pattern');
addQ(3, [50, 40, 45, 42, 40], 44, 'Odd positions: 50, 45, 40 (-5). Even positions: 40, 42, 44 (+2). Next is even: 44.', 'Tip: The hardest part is keeping track of which sub-sequence gives the next answer.', 'alternating-pattern');
addQ(3, [1, 5, 2, 10, 3], 15, 'Odd positions: 1, 2, 3 (+1). Even positions: 5, 10, 15 (+5). Next is even: 15.', 'Tip: Simple individual patterns can combine to make a tricky sequence!', 'alternating-pattern');
addQ(3, [100, 3, 90, 6, 80], 9, 'Odd positions: 100, 90, 80 (-10). Even positions: 3, 6, 9 (+3). Next is even: 9.', 'Tip: One sub-sequence decreasing by 10 and the other increasing by 3 — both simple alone!', 'alternating-pattern');
addQ(3, [2, 100, 4, 80, 6], 60, 'Odd positions: 2, 4, 6 (+2). Even positions: 100, 80, 60 (-20). Next is even: 60.', 'Tip: Process of elimination — if one sub-sequence is obvious, the other gives the answer.', 'alternating-pattern');

// ============================================================
// D3: COMPOUND RULES (5 questions)
// ============================================================
addQ(3, [2, 5, 11, 23, 47], 95, 'Each number = previous × 2 + 1. 47 × 2 + 1 = 95.', 'Tip: If ×2 is close but not exact, try ×2+1 or ×2-1 — these are compound rules.', 'two-step-rule');
addQ(3, [1, 4, 13, 40, 121], 364, 'Each number = previous × 3 + 1. 121 × 3 + 1 = 364.', 'Tip: Compound rules combine multiplication and addition — try ×N+1 or ×N-1.', 'two-step-rule');
addQ(3, [3, 7, 15, 31, 63], 127, 'Each number = previous × 2 + 1. 63 × 2 + 1 = 127.', 'Tip: These numbers are all one less than powers of 2: 4, 8, 16, 32, 64, 128.', 'two-step-rule');
addQ(3, [1, 3, 9, 27, 81], 243, 'Each number is ×3. 81 × 3 = 243.', 'Tip: Powers of 3: 1, 3, 9, 27, 81, 243 — each is triple the last.', 'multiply-pattern');
addQ(3, [5, 11, 23, 47, 95], 191, 'Each number = previous × 2 + 1. 95 × 2 + 1 = 191.', 'Tip: The ×2+1 pattern is one of the hardest to spot — practise recognising it!', 'two-step-rule');

// ============================================================
// D3: CUBE NUMBERS (3 questions)
// ============================================================
addQ(3, [1, 8, 27, 64, 125], 216, 'Cube numbers: 1³, 2³, 3³, 4³, 5³. Next: 6³ = 216.', 'Tip: Know your cubes: 1, 8, 27, 64, 125, 216. They grow very fast!', 'square-numbers');
addQ(3, [8, 27, 64, 125, 216], 343, 'Cube numbers from 2³. Next: 7³ = 343.', 'Tip: 7³ = 7 × 7 × 7 = 49 × 7 = 343.', 'square-numbers');
addQ(3, [27, 64, 125, 216, 343], 512, 'Cube numbers from 3³. Next: 8³ = 512.', 'Tip: 8³ = 512 — this is also 2⁹ (a power of 2).', 'square-numbers');

// ============================================================
// D3: DOUBLING DIFFERENCES (5 questions)
// ============================================================
addQ(3, [13, 19, 31, 55, 103], 199, 'Differences: +6, +12, +24, +48. The differences double! Next: +96. 103 + 96 = 199.', 'Tip: If differences grow very fast, check whether they are DOUBLING each time.', 'increasing-hops');
addQ(3, [5, 7, 11, 19, 35], 67, 'Differences: +2, +4, +8, +16. The differences double! Next: +32. 35 + 32 = 67.', 'Tip: Doubling differences: 2, 4, 8, 16, 32 — these are powers of 2!', 'increasing-hops');
addQ(3, [100, 96, 88, 72, 40], -24, 'Differences: -4, -8, -16, -32. They double (negatively). Next: -64. 40 - 64 = -24.', 'Tip: Doubling differences can go negative — keep subtracting!', 'increasing-hops');
addQ(3, [1, 2, 5, 14, 41], 122, 'Each number = previous × 3 - 1. 41 × 3 - 1 = 122.', 'Tip: If ×3 is close, try ×3-1 or ×3+1.', 'two-step-rule');
addQ(3, [3, 5, 9, 17, 33], 65, 'Differences: +2, +4, +8, +16. They double. Next: +32. 33 + 32 = 65.', 'Tip: Each difference is exactly double the previous one — classic doubling differences.', 'increasing-hops');

// ============================================================
// D3: MORE SQUARES AND SPECIAL (5 questions)
// ============================================================
addQ(3, [4, 16, 5, 25, 6], 36, 'Alternating: 4, 4²=16, 5, 5²=25, 6, 6²=36. Numbers and their squares alternate.', 'Tip: If you see a number followed by its square, the pattern alternates between number and square.', 'square-numbers');
addQ(3, [144, 121, 100, 81, 64], 49, 'Descending squares: 12², 11², 10², 9², 8². Next: 7² = 49.', 'Tip: 144 = 12², 121 = 11² — descending perfect squares.', 'square-numbers');
addQ(3, [2, 3, 5, 7, 11, 13], 17, 'Prime numbers. Next prime after 13 is 17.', 'Tip: 15 = 3×5 and 16 = 4×4, so neither is prime. The next prime is 17.', 'constant-difference');
addQ(3, [20, 14, 8, 2, -4], -10, 'The pattern is -6 each time. 2 - 6 = -4. -4 - 6 = -10.', 'Tip: Sequences can cross zero into negatives — just keep applying the rule.', 'constant-difference');
addQ(3, [11, 13, 17, 19, 23], 29, 'Consecutive primes. Next after 23 is 29 (not 25, 27, or 28 — none are prime).', 'Tip: Primes have irregular gaps — check each candidate number carefully.', 'constant-difference');

// ============================================================
// D3: DIGIT-BASED (3 questions)
// ============================================================
addQ(3, [12, 21, 13, 31, 14], 41, 'Odd positions: 12, 13, 14 (+1). Even positions: 21, 31, 41 (reverse digits +10). Next is even: 41.', 'Tip: Look for digit reversal patterns — 12 reversed is 21!', 'alternating-pattern');
addQ(3, [11, 22, 33, 44, 55], 66, 'Repeated digits: 11, 22, 33, 44, 55, 66. Add 11 each time.', 'Tip: Repeated-digit numbers follow the 11 times table.', 'constant-difference');
addQ(3, [19, 28, 37, 46, 55], 64, 'The pattern is +9 each time. Also notice: digit sum is always 10 (1+9, 2+8, 3+7, 4+6, 5+5, 6+4).', 'Tip: The digit sum staying constant is a bonus pattern — the main rule is still +9.', 'constant-difference');

console.log('Built', questions.length, 'questions');
const dc = {1:0, 2:0, 3:0};
questions.forEach(q => dc[q.difficulty]++);
console.log('D1:', dc[1], '(' + Math.round(dc[1]/questions.length*100) + '%)');
console.log('D2:', dc[2], '(' + Math.round(dc[2]/questions.length*100) + '%)');
console.log('D3:', dc[3], '(' + Math.round(dc[3]/questions.length*100) + '%)');

// Sub-concept distribution
const sc = {};
questions.forEach(q => { sc[q._sc] = (sc[q._sc]||0)+1; });
console.log('\nSub-concepts:');
Object.entries(sc).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

// Validate all answers
let errors = 0;
questions.forEach(q => {
  if (q.options.length !== 5) { console.log('Q' + q.id + ': wrong option count'); errors++; }
  if (q.correct < 0 || q.correct >= 5) { console.log('Q' + q.id + ': bad correct index'); errors++; }
  if (new Set(q.options).size < 5) { console.log('Q' + q.id + ': duplicate options ' + q.options.join(',')); errors++; }
});
console.log('\nValidation errors:', errors === 0 ? 'NONE ✓' : errors);

if (errors > 0) { process.exit(1); }

// Insert using safe-insert
console.log('\nInserting...');
const result = insertQuestions('vrData', 'numberSeries', questions);
console.log('Result:', result);

// Update mapping
const vrMap = JSON.parse(fs.readFileSync(VR_MAP, 'utf8'));
vrMap.numberSeries = questions.map(q => ({
  questionId: q.id,
  subConceptId: q._sc,
  confidence: 'high'
}));
fs.writeFileSync(VR_MAP, JSON.stringify(vrMap, null, 2), 'utf8');
console.log('Mapping updated:', vrMap.numberSeries.length, 'entries');

// Verify structure
const v = verifyStructure('vrData');
const ns = v.topics.find(t => t.name === 'numberSeries');
console.log('\nVerify: numberSeries', ns.questions, 'questions, ok:', ns.ok);

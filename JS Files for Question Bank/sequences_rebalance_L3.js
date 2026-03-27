// Sequences - Level 3 (Hard) Rebalance Questions
// IDs 121-133: 13 new Level 3 questions for the Sequences topic
// These cover: square numbers, triangular numbers, Fibonacci-style,
// two-step rules, increasing differences, working backwards,
// counting terms, sum of terms, halving to fractions, doubling differences,
// cube number sums, shifted square sequences, and quadratic nth term.

    {
      id: 121,
      difficulty: 3,
      question: "The sequence of square numbers is 1, 4, 9, 16, 25, ... What is the 12th square number?",
      options: ["121", "132", "144", "156", "169"],
      correct: 2,
      explanation: "Square numbers are found by squaring the position number. The 12th square number is 12² = 12 × 12 = 144. ✓"
    },
    {
      id: 122,
      difficulty: 3,
      question: "Triangular numbers go 1, 3, 6, 10, 15, 21, ... What is the 10th triangular number?",
      options: ["45", "50", "55", "60", "66"],
      correct: 2,
      explanation: "Triangular numbers add one more each time: +2, +3, +4, +5 and so on. The sequence is 1, 3, 6, 10, 15, 21, 28, 36, 45, 55. You can also calculate: 10 × 11 ÷ 2 = 55. ✓"
    },
    {
      id: 123,
      difficulty: 3,
      question: "In a Fibonacci-style sequence, each term is the sum of the two before it. The sequence starts 2, 5, 7, 12, 19, ... What is the 8th term?",
      options: ["69", "74", "81", "88", "93"],
      correct: 2,
      explanation: "Each term = sum of the previous two. The sequence is: 2, 5, 7, 12, 19, 31, 50, 81. The 8th term is 81. Check: 2 + 5 = 7, 5 + 7 = 12, 7 + 12 = 19, 12 + 19 = 31, 19 + 31 = 50, 31 + 50 = 81. ✓"
    },
    {
      id: 124,
      difficulty: 3,
      question: "A sequence follows the rule 'multiply by 2 then subtract 3'. The first term is 5. What is the 6th term?",
      options: ["59", "63", "67", "71", "75"],
      correct: 2,
      explanation: "Apply the rule starting from 5. Term 1: 5. Term 2: 5 × 2 − 3 = 7. Term 3: 7 × 2 − 3 = 11. Term 4: 11 × 2 − 3 = 19. Term 5: 19 × 2 − 3 = 35. Term 6: 35 × 2 − 3 = 67. ✓"
    },
    {
      id: 125,
      difficulty: 3,
      question: "Look at this sequence: 2, 5, 10, 17, 26, 37, ... The differences between terms increase by 2 each time. What is the 9th term?",
      options: ["58", "65", "74", "82", "91"],
      correct: 3,
      explanation: "The differences are +3, +5, +7, +9, +11, and they keep going up by 2. Continuing: +13 gives 50, +15 gives 65, +17 gives 82. So the 9th term is 82. You can also spot that each term is n² + 1, so the 9th term is 9² + 1 = 82. ✓"
    },
    {
      id: 126,
      difficulty: 3,
      question: "In a sequence, each term is double the one before. The 6th term is 192. What is the 1st term?",
      options: ["3", "4", "6", "8", "12"],
      correct: 2,
      explanation: "Work backwards by halving. Term 6: 192. Term 5: 192 ÷ 2 = 96. Term 4: 96 ÷ 2 = 48. Term 3: 48 ÷ 2 = 24. Term 2: 24 ÷ 2 = 12. Term 1: 12 ÷ 2 = 6. ✓"
    },
    {
      id: 127,
      difficulty: 3,
      question: "How many terms of the sequence 3, 7, 11, 15, 19, ... are less than 50?",
      options: ["10", "11", "12", "13", "14"],
      correct: 2,
      explanation: "The sequence adds 4 each time. The nth term is 4n − 1. We need 4n − 1 < 50, so 4n < 51, which means n < 12.75. The largest whole value of n is 12. The 12th term is 4 × 12 − 1 = 47 (which is less than 50). The 13th term would be 51 (not less than 50). So 12 terms are less than 50. ✓"
    },
    {
      id: 128,
      difficulty: 3,
      question: "What is the sum of the first 6 terms of the sequence 5, 9, 13, 17, 21, 25?",
      options: ["78", "84", "90", "96", "102"],
      correct: 2,
      explanation: "Add all six terms: 5 + 9 + 13 + 17 + 21 + 25 = 90. You can also pair them: (5 + 25) + (9 + 21) + (13 + 17) = 30 + 30 + 30 = 90. ✓"
    },
    {
      id: 129,
      difficulty: 3,
      question: "The first term of a sequence is 256 and each term is half the previous term. What is the first term in the sequence that is not a whole number?",
      options: ["0.25", "0.5", "1.5", "2.5", "3.5"],
      correct: 1,
      explanation: "Halving from 256: 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5. The first term that is not a whole number is 0.5. ✓"
    },
    {
      id: 130,
      difficulty: 3,
      question: "In a sequence, the differences between terms are 1, 2, 4, 8, 16, ... (doubling each time). The first term is 3. What is the 7th term?",
      options: ["34", "50", "62", "66", "72"],
      correct: 3,
      explanation: "Starting at 3, add the doubling differences. Term 1: 3. Term 2: 3 + 1 = 4. Term 3: 4 + 2 = 6. Term 4: 6 + 4 = 10. Term 5: 10 + 8 = 18. Term 6: 18 + 16 = 34. Term 7: 34 + 32 = 66. ✓"
    },
    {
      id: 131,
      difficulty: 3,
      question: "The cube numbers are 1, 8, 27, 64, 125, ... What is the sum of the first 5 cube numbers?",
      options: ["200", "215", "225", "250", "275"],
      correct: 2,
      explanation: "The first 5 cube numbers are: 1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64, 5³ = 125. Their sum is 1 + 8 + 27 + 64 + 125 = 225. ✓"
    },
    {
      id: 132,
      difficulty: 3,
      question: "A sequence goes: 0, 3, 8, 15, 24, ... What is the 8th term?",
      options: ["48", "55", "63", "72", "80"],
      correct: 2,
      explanation: "The differences are +3, +5, +7, +9, ... (increasing by 2 each time). Continuing: +11 gives 35, +13 gives 48, +15 gives 63. The 8th term is 63. You can also spot that each term is n² − 1: the 8th term is 8² − 1 = 64 − 1 = 63. ✓"
    },
    {
      id: 133,
      difficulty: 3,
      question: "The sequence 3, 8, 15, 24, 35, ... follows the rule n² + 2n, where n is the position. What is the 10th term?",
      options: ["99", "110", "120", "130", "143"],
      correct: 2,
      explanation: "Using the rule n² + 2n with n = 10: 10² + 2 × 10 = 100 + 20 = 120. You can check: n = 1 gives 1 + 2 = 3, n = 2 gives 4 + 4 = 8, n = 3 gives 9 + 6 = 15, n = 4 gives 16 + 8 = 24, n = 5 gives 25 + 10 = 35. The pattern works, so the 10th term is 120. ✓"
    },

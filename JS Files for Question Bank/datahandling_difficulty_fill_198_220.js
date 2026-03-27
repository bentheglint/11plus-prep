// Data Handling - Difficulty Gap Fill Questions (IDs 198-220)
// Fills gaps across 7 sub-topics that currently lack difficulty spread
// All questions are self-contained (no images/diagrams required)

    // ========== CALCULATING RANGE D2/D3 — IDs 198-201 ==========

    {
      id: 198,
      difficulty: 2,
      question: "The range of 5 numbers is 22. Four of the numbers are 10, 15, 22, and 25. What is the fifth number?",
      options: ["3", "5", "7", "8", "12"],
      correct: 0,
      explanation: "The range = highest − lowest = 22. The current highest is 25 and the current lowest is 10, giving a range of only 15. We need a range of 22, so the fifth number must extend the spread. If the fifth number is below 10: 25 − fifth = 22, so fifth = 3. Check: the set is 3, 10, 15, 22, 25 and the range = 25 − 3 = 22 ✓. The fifth number is 3. ✓"
    },
    {
      id: 199,
      difficulty: 2,
      question: "Set A has numbers: 14, 22, 18, 25, 10. Set B has numbers: 33, 19, 27, 41, 30. What is the difference between the range of Set B and the range of Set A?",
      options: ["5", "7", "9", "12", "15"],
      correct: 1,
      explanation: "Set A: highest = 25, lowest = 10, range = 25 − 10 = 15. Set B: highest = 41, lowest = 19, range = 41 − 19 = 22. Difference = 22 − 15 = 7. ✓"
    },
    {
      id: 200,
      difficulty: 3,
      question: "Six children scored these marks in a test: 12, 18, 25, 36, ?, 49. The range is 37. After removing the highest score, the range decreases by 7. What is the missing score?",
      options: ["38", "40", "42", "44", "46"],
      correct: 2,
      explanation: "Original range = 49 − 12 = 37 ✓. After removing the highest score (49), the new range = 37 − 7 = 30. The lowest is still 12, so the new highest must be 12 + 30 = 42. The missing score is 42. Check: without 49, the data is 12, 18, 25, 36, 42 and the range = 42 − 12 = 30 ✓. ✓"
    },
    {
      id: 201,
      difficulty: 3,
      question: "Oliver records the temperature at noon each day for a week: 8°C, 11°C, 5°C, 14°C, 9°C, 3°C, 12°C. He removes the day with the lowest temperature. By how much does the range decrease?",
      options: ["1", "2", "3", "5", "6"],
      correct: 1,
      explanation: "Sorted data: 3, 5, 8, 9, 11, 12, 14. Original range = 14 − 3 = 11. After removing the lowest (3°C), the data is: 5, 8, 9, 11, 12, 14. New range = 14 − 5 = 9. Decrease = 11 − 9 = 2. ✓"
    },

    // ========== FINDING MODE D2/D3 — IDs 202-205 ==========

    {
      id: 202,
      difficulty: 2,
      question: "A set of 7 numbers has a mode of 5. Six of the numbers are 3, 5, 7, 5, 4, and 8. What is the seventh number?",
      options: ["3", "4", "5", "7", "8"],
      correct: 2,
      explanation: "The mode is the most common number. Currently, 5 appears twice and all other numbers appear once. For 5 to be the only mode, the seventh number must be 5 (making it appear 3 times). If the seventh number were 3, 4, 7, or 8, that number would also appear twice — tying with 5 — so 5 would not be the single mode. The seventh number is 5. ✓"
    },
    {
      id: 203,
      difficulty: 2,
      question: "Which of these data sets has exactly two modes (is bimodal)?",
      options: ["2, 3, 3, 4, 5", "1, 2, 2, 3, 3, 4", "4, 5, 6, 7, 8", "6, 6, 6, 7, 8", "1, 1, 2, 2, 3, 3"],
      correct: 1,
      explanation: "A bimodal set has exactly two values appearing most often. Option A: 3 appears twice, all others once — one mode. Option B: 2 and 3 each appear twice, all others once — two modes, bimodal ✓. Option C: all values appear once — no mode. Option D: 6 appears three times — one mode. Option E: 1, 2, and 3 each appear twice — three modes, not two. The answer is 1, 2, 2, 3, 3, 4. ✓"
    },
    {
      id: 204,
      difficulty: 3,
      question: "A set of 5 numbers has a mode of 6 and a mean of 5. Three of the numbers are 3, 4, and 6. What are the other two numbers?",
      options: ["5 and 6", "6 and 6", "2 and 6", "6 and 7", "1 and 6"],
      correct: 1,
      explanation: "The mode is 6, so 6 must appear more than any other number. It already appears once, so at least one missing number must be 6. The mean is 5 with 5 numbers, so the total = 5 × 5 = 25. Sum of known numbers = 3 + 4 + 6 = 13. The two missing numbers sum to 25 − 13 = 12. If one is 6, the other = 12 − 6 = 6. So both are 6. Check: 3, 4, 6, 6, 6 — mode = 6 (appears 3 times) ✓, mean = 25 ÷ 5 = 5 ✓. The answer is 6 and 6. ✓"
    },
    {
      id: 205,
      difficulty: 3,
      question: "Amelia has 9 number cards. The mode is 7 and the median is 7. The smallest number is 2 and the range is 10. She has exactly three 7s. What is the largest number?",
      options: ["10", "11", "12", "13", "14"],
      correct: 2,
      explanation: "The smallest number is 2 and the range is 10, so the largest number = 2 + 10 = 12. Check: with 9 cards, the median is the 5th value. Having three 7s ensures 7 is at the middle position and is the mode (appearing more than any other value). The largest number is 12. ✓"
    },

    // ========== FINDING MEDIAN D2/D3 — IDs 206-209 ==========

    {
      id: 206,
      difficulty: 2,
      question: "Eleven pupils scored the following marks: 45, 52, 38, 61, 73, 55, 49, 67, 42, 58, 70. What is the median score?",
      options: ["52", "55", "56", "58", "61"],
      correct: 1,
      explanation: "First put the scores in order: 38, 42, 45, 49, 52, 55, 58, 61, 67, 70, 73. With 11 values, the median is the 6th value. Counting: 38(1st), 42(2nd), 45(3rd), 49(4th), 52(5th), 55(6th). The median is 55. ✓"
    },
    {
      id: 207,
      difficulty: 3,
      question: "Five numbers are in order: 2, 7, ?, 13, 18. The median is the same as the mean. What is the middle number?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "With 5 numbers, the median is the 3rd value, which is the missing number. Call it m. The mean = (2 + 7 + m + 13 + 18) ÷ 5 = (40 + m) ÷ 5. Since median = mean: m = (40 + m) ÷ 5. Multiply both sides by 5: 5m = 40 + m. Subtract m: 4m = 40. So m = 10. Check: the set is 2, 7, 10, 13, 18. Mean = 50 ÷ 5 = 10. Median = 10 ✓. ✓"
    },
    {
      id: 208,
      difficulty: 3,
      question: "Seven numbers have a median of 15. The numbers in order are: 6, 9, 12, 15, 19, 23, 28. If a new number is added and the median becomes 17, which number was added?",
      options: ["16", "18", "19", "20", "25"],
      correct: 2,
      explanation: "With 7 numbers, the median is the 4th value = 15 ✓. Adding one number gives 8 values, so the new median is the mean of the 4th and 5th values, which must equal 17. So the 4th + 5th values must sum to 34. If we add 19: the sorted list is 6, 9, 12, 15, 19, 19, 23, 28. The 4th value is 15 and the 5th value is 19. Median = (15 + 19) ÷ 2 = 34 ÷ 2 = 17 ✓. The number added was 19. ✓"
    },
    {
      id: 209,
      difficulty: 3,
      question: "Nine numbers have a median of 12. The numbers in order are: 3, 5, 8, 10, 12, 14, 17, 20, 25. If the smallest number is removed, what is the new median?",
      options: ["10", "11", "13", "14", "15"],
      correct: 2,
      explanation: "Removing 3 leaves 8 values: 5, 8, 10, 12, 14, 17, 20, 25. With 8 values, the median is the mean of the 4th and 5th values. The 4th value is 12 and the 5th value is 14. Median = (12 + 14) ÷ 2 = 26 ÷ 2 = 13. ✓"
    },

    // ========== EVEN MEDIAN D1/D3 — IDs 210-213 ==========

    {
      id: 210,
      difficulty: 1,
      question: "Find the median of these four numbers: 3, 5, 7, 9.",
      options: ["5", "5.5", "6", "6.5", "7"],
      correct: 2,
      explanation: "With 4 numbers (an even count), the median is the mean of the 2nd and 3rd values. The numbers in order: 3, 5, 7, 9. The 2nd value is 5 and the 3rd value is 7. Median = (5 + 7) ÷ 2 = 12 ÷ 2 = 6. ✓"
    },
    {
      id: 211,
      difficulty: 1,
      question: "Find the median of these six numbers: 2, 4, 6, 8, 10, 12.",
      options: ["6", "6.5", "7", "7.5", "8"],
      correct: 2,
      explanation: "With 6 numbers (an even count), the median is the mean of the 3rd and 4th values. The numbers in order: 2, 4, 6, 8, 10, 12. The 3rd value is 6 and the 4th value is 8. Median = (6 + 8) ÷ 2 = 14 ÷ 2 = 7. ✓"
    },
    {
      id: 212,
      difficulty: 3,
      question: "Eight numbers have a median of 15.5. Seven of the numbers are: 8, 11, 13, 15, 18, 21, 24. What is the eighth number?",
      options: ["14", "15", "16", "17", "19"],
      correct: 2,
      explanation: "With 8 numbers, the median is the mean of the 4th and 5th values, which must equal 15.5. So the 4th + 5th values must sum to 31. The seven known numbers in order: 8, 11, 13, 15, 18, 21, 24. If the eighth number is 16, the sorted list is: 8, 11, 13, 15, 16, 18, 21, 24. The 4th value is 15 and the 5th value is 16. Median = (15 + 16) ÷ 2 = 31 ÷ 2 = 15.5 ✓. The eighth number is 16. ✓"
    },
    {
      id: 213,
      difficulty: 3,
      question: "Ten numbers are in order. The median is 20.5. The 5th number is 18 and the 7th number is 25. What is the 6th number?",
      options: ["19", "20", "21", "23", "24"],
      correct: 3,
      explanation: "With 10 numbers, the median is the mean of the 5th and 6th values. Median = (5th + 6th) ÷ 2 = 20.5. So 5th + 6th = 41. The 5th number is 18, so the 6th number = 41 − 18 = 23. Check: 23 is between the 5th (18) and 7th (25) values ✓. ✓"
    },

    // ========== MISSING FROM MEAN D1/D2 — IDs 214-217 ==========

    {
      id: 214,
      difficulty: 1,
      question: "Three numbers have a mean of 6. Two of the numbers are 5 and 7. What is the third number?",
      options: ["4", "5", "6", "7", "8"],
      correct: 2,
      explanation: "If the mean of 3 numbers is 6, the total = 6 × 3 = 18. The two known numbers sum to 5 + 7 = 12. The third number = 18 − 12 = 6. ✓"
    },
    {
      id: 215,
      difficulty: 1,
      question: "Three numbers have a mean of 10. Two of the numbers are 8 and 12. What is the third number?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "If the mean of 3 numbers is 10, the total = 10 × 3 = 30. The two known numbers sum to 8 + 12 = 20. The third number = 30 − 20 = 10. ✓"
    },
    {
      id: 216,
      difficulty: 2,
      question: "Four numbers have a mean of 10. Three of the numbers are 8, 12, and 9. What is the fourth number?",
      options: ["9", "10", "11", "12", "13"],
      correct: 2,
      explanation: "If the mean of 4 numbers is 10, the total = 10 × 4 = 40. The three known numbers sum to 8 + 12 + 9 = 29. The fourth number = 40 − 29 = 11. ✓"
    },
    {
      id: 217,
      difficulty: 2,
      question: "Five numbers have a mean of 15. Four of the numbers are 12, 18, 14, and 20. What is the fifth number?",
      options: ["9", "11", "13", "15", "17"],
      correct: 1,
      explanation: "If the mean of 5 numbers is 15, the total = 15 × 5 = 75. The four known numbers sum to 12 + 18 + 14 + 20 = 64. The fifth number = 75 − 64 = 11. ✓"
    },

    // ========== COMBINED AVERAGES D1/D3 — IDs 218-220 ==========

    {
      id: 218,
      difficulty: 1,
      question: "Find both the mode and the range of this data set: 3, 5, 3, 7, 3, 9.",
      options: ["Mode: 3, Range: 4", "Mode: 3, Range: 6", "Mode: 5, Range: 6", "Mode: 3, Range: 9", "Mode: 7, Range: 6"],
      correct: 1,
      explanation: "Mode = 3 (it appears 3 times, more than any other number). Range = highest − lowest = 9 − 3 = 6. So the mode is 3 and the range is 6. ✓"
    },
    {
      id: 219,
      difficulty: 1,
      question: "Find both the mean and the mode of this data set: 4, 6, 4, 8, 4, 10.",
      options: ["Mean: 5, Mode: 4", "Mean: 6, Mode: 4", "Mean: 6, Mode: 6", "Mean: 7, Mode: 4", "Mean: 4, Mode: 6"],
      correct: 1,
      explanation: "Mode = 4 (it appears 3 times, more than any other number). Mean = (4 + 6 + 4 + 8 + 4 + 10) ÷ 6 = 36 ÷ 6 = 6. So the mean is 6 and the mode is 4. ✓"
    },
    {
      id: 220,
      difficulty: 3,
      question: "A set of 5 numbers has a mode of 4, a median of 5, and a range of 8. The numbers are all whole numbers. What is the largest number?",
      options: ["9", "10", "11", "12", "13"],
      correct: 3,
      explanation: "The mode is 4, so 4 appears more than once. With 5 numbers, the median is the 3rd value = 5. Since 4 < 5, both 4s must be in the first two positions: 4, 4, 5, ?, ?. The range is 8. The smallest number is 4, so the largest = 4 + 8 = 12. Check: 4, 4, 5, ?, 12 — we need the 4th number to be between 5 and 12 and not equal to 4. For example, 4, 4, 5, 7, 12 works: mode = 4 ✓, median = 5 ✓, range = 12 − 4 = 8 ✓. The largest number is 12. ✓"
    }
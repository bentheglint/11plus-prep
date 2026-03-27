// Data Handling - Rebalance Questions (Level 2 and Level 3)
// IDs 126-135: Level 2 (Medium) - Two-step data interpretation
// IDs 136-145: Level 3 (Hard) - Multi-step reasoning, working backwards, complex data
// All questions are self-contained (no images/diagrams required)

    // ========== LEVEL 2 (MEDIUM) - IDs 126-135 ==========

    {
      id: 126,
      difficulty: 2,
      question: "Eight pupils scored the following marks in a maths test: 54, 61, 67, 72, 75, 80, 83, 88. What is the median score?",
      options: ["72", "73", "73.5", "75", "76"],
      correct: 2,
      explanation: "With 8 values, the median is the mean of the 4th and 5th values. The data is already in order. The 4th value is 72 and the 5th value is 75. Median = (72 + 75) ÷ 2 = 147 ÷ 2 = 73.5. ✓"
    },
    {
      id: 127,
      difficulty: 2,
      question: "A school tuck shop recorded the number of each snack sold in one week: Apples 35, Bananas 50, Oranges 20, Grapes 45, Pears 30. How many more Bananas were sold than Oranges?",
      options: ["15", "20", "25", "30", "35"],
      correct: 3,
      explanation: "Bananas sold = 50. Oranges sold = 20. Difference = 50 − 20 = 30. ✓"
    },
    {
      id: 128,
      difficulty: 2,
      question: "Find the mode and range of this data set: 3, 8, 5, 3, 9, 3, 7, 12.",
      options: ["Mode: 3, Range: 7", "Mode: 3, Range: 9", "Mode: 5, Range: 9", "Mode: 8, Range: 9", "Mode: 3, Range: 12"],
      correct: 1,
      explanation: "Mode = 3 (it appears 3 times, more than any other value). Range = highest − lowest = 12 − 3 = 9. ✓"
    },
    {
      id: 129,
      difficulty: 2,
      question: "A cafe recorded the number of sandwiches sold each day: Monday 24, Tuesday 31, Wednesday 18, Thursday 27, Friday 35. What was the total number of sandwiches sold that week?",
      options: ["125", "130", "135", "140", "145"],
      correct: 2,
      explanation: "Total = 24 + 31 + 18 + 27 + 35 = 135. ✓"
    },
    {
      id: 130,
      difficulty: 2,
      question: "Seven children recorded how many books they read last month: 14, 9, 22, 17, 5, 30, 11. What is the median number of books?",
      options: ["11", "14", "15", "17", "22"],
      correct: 1,
      explanation: "First, put the numbers in order: 5, 9, 11, 14, 17, 22, 30. There are 7 values, so the median is the 4th value. Median = 14. ✓"
    },
    {
      id: 131,
      difficulty: 2,
      question: "A shop records ice cream sales each hour. At 11am they had sold 20 ice creams, at 12pm they had sold 40, and at 1pm they had sold 60. If sales increased at a steady rate, how many had they sold by 12:30pm?",
      options: ["45", "48", "50", "52", "55"],
      correct: 2,
      explanation: "Between 12pm and 1pm, sales went from 40 to 60 — an increase of 20 in one hour. In half an hour, the increase would be 20 ÷ 2 = 10. So at 12:30pm, sales = 40 + 10 = 50. ✓"
    },
    {
      id: 132,
      difficulty: 2,
      question: "Six children measured their heights: 132 cm, 145 cm, 128 cm, 151 cm, 139 cm, 147 cm. What is the median height?",
      options: ["139 cm", "140 cm", "142 cm", "145 cm", "147 cm"],
      correct: 2,
      explanation: "First, order the heights: 128, 132, 139, 145, 147, 151. With 6 values, the median is the mean of the 3rd and 4th values. Median = (139 + 145) ÷ 2 = 284 ÷ 2 = 142 cm. ✓"
    },
    {
      id: 133,
      difficulty: 2,
      question: "Class A scored these marks in a quiz: 15, 18, 22, 25, 20. Class B scored: 21, 14, 23, 17, 30. Which class had the higher mean score, and by how much?",
      options: ["Class A by 1 mark", "Class A by 2 marks", "Class B by 1 mark", "Class B by 2 marks", "Both classes had the same mean"],
      correct: 2,
      explanation: "Class A mean = (15 + 18 + 22 + 25 + 20) ÷ 5 = 100 ÷ 5 = 20. Class B mean = (21 + 14 + 23 + 17 + 30) ÷ 5 = 105 ÷ 5 = 21. Class B's mean is higher by 21 − 20 = 1 mark. ✓"
    },
    {
      id: 134,
      difficulty: 2,
      question: "In a survey, children chose their favourite colour: Red — 12, Blue — 18, Green — 9, Yellow — 15, Purple — 6. How many more children chose Blue than Green and Purple combined?",
      options: ["2", "3", "6", "9", "12"],
      correct: 1,
      explanation: "Green and Purple combined = 9 + 6 = 15. Blue = 18. Difference = 18 − 15 = 3. ✓"
    },
    {
      id: 135,
      difficulty: 2,
      question: "Sam scored 72, 85, 68, 91 and 79 in five science tests. What is his mean score, and how many tests did he score above the mean?",
      options: ["Mean 79, 2 tests above", "Mean 79, 3 tests above", "Mean 80, 2 tests above", "Mean 80, 3 tests above", "Mean 79, 1 test above"],
      correct: 0,
      explanation: "Mean = (72 + 85 + 68 + 91 + 79) ÷ 5 = 395 ÷ 5 = 79. Scores above 79: 85 and 91 — that is 2 tests. ✓"
    },

    // ========== LEVEL 3 (HARD) - IDs 136-145 ==========

    {
      id: 136,
      difficulty: 3,
      question: "The mean of 6 numbers is 15. Five of the numbers are 12, 14, 16, 18 and 20. What is the sixth number?",
      options: ["8", "10", "12", "14", "16"],
      correct: 1,
      explanation: "If the mean is 15 and there are 6 numbers, the total sum = 15 × 6 = 90. The sum of the five known numbers = 12 + 14 + 16 + 18 + 20 = 80. The sixth number = 90 − 80 = 10. ✓"
    },
    {
      id: 137,
      difficulty: 3,
      question: "A pie chart shows favourite sports for 240 children. Football is 90°, Cricket is 60°, Tennis is 120° and Swimming is 90°. How many children chose Tennis?",
      options: ["60", "70", "80", "90", "100"],
      correct: 2,
      explanation: "Tennis = 120° out of 360°. Fraction = 120 ÷ 360 = 1/3. Number who chose Tennis = 240 × 1/3 = 80. ✓"
    },
    {
      id: 138,
      difficulty: 3,
      question: "Five numbers are written in order. The smallest number is 4, the mode is 4, the median is 6, and the range is 9. What is the largest number?",
      options: ["9", "11", "12", "13", "15"],
      correct: 3,
      explanation: "The range is 9 and the smallest number is 4, so the largest number = 4 + 9 = 13. We can check: since the mode is 4, the number 4 must appear more than once, giving us 4, 4, ?, ?, 13. The median (3rd value) is 6, so the set is 4, 4, 6, ?, 13. This all works. The largest number is 13. ✓"
    },
    {
      id: 139,
      difficulty: 3,
      question: "A pie chart shows how 300 pupils travel to school. The Bus section has an angle of 108°. The Car section is half the size of the Bus section. How many pupils travel by Car?",
      options: ["36", "40", "45", "50", "54"],
      correct: 2,
      explanation: "The Bus section is 108°. The Car section is half of that = 108 ÷ 2 = 54°. The fraction for Car = 54 ÷ 360 = 3/20. Number of pupils = 300 × 3/20 = 45. ✓"
    },
    {
      id: 140,
      difficulty: 3,
      question: "Seven children have heights: 125 cm, 130 cm, 132 cm, 138 cm, 142 cm, 148 cm, 155 cm. If the tallest and shortest children leave the group, what is the mean height of the remaining five children?",
      options: ["134 cm", "136 cm", "138 cm", "140 cm", "142 cm"],
      correct: 2,
      explanation: "Remove the tallest (155 cm) and shortest (125 cm). Remaining heights: 130, 132, 138, 142, 148. Sum = 130 + 132 + 138 + 142 + 148 = 690. Mean = 690 ÷ 5 = 138 cm. ✓"
    },
    {
      id: 141,
      difficulty: 3,
      question: "The mean score of 8 pupils in a test is 25. When one pupil's score is removed, the mean of the remaining 7 pupils is 24. What was the removed pupil's score?",
      options: ["28", "30", "32", "34", "36"],
      correct: 2,
      explanation: "Total for 8 pupils = 25 × 8 = 200. Total for remaining 7 pupils = 24 × 7 = 168. The removed score = 200 − 168 = 32. ✓"
    },
    {
      id: 142,
      difficulty: 3,
      question: "Four numbers have a mean of 10. When written in order, the first three numbers are 5, 8 and 12. What is the median of these four numbers?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "First, find the fourth number. Mean = 10, so the total = 10 × 4 = 40. Sum of known numbers = 5 + 8 + 12 = 25. Fourth number = 40 − 25 = 15. The four numbers in order: 5, 8, 12, 15. With 4 values, the median is the mean of the 2nd and 3rd values = (8 + 12) ÷ 2 = 10. ✓"
    },
    {
      id: 143,
      difficulty: 3,
      question: "In a spelling test marked out of 10, the results were: Score 5 — 2 pupils, Score 6 — 4 pupils, Score 7 — 6 pupils, Score 8 — 5 pupils, Score 9 — 3 pupils. What fraction of the class scored 8 or more?",
      options: ["1/4", "1/3", "2/5", "3/5", "1/2"],
      correct: 2,
      explanation: "Total pupils = 2 + 4 + 6 + 5 + 3 = 20. Pupils who scored 8 or more = 5 + 3 = 8. Fraction = 8/20 = 2/5. ✓"
    },
    {
      id: 144,
      difficulty: 3,
      question: "The mean age of 4 friends is 11 years. A fifth friend joins the group and the new mean age becomes 12 years. How old is the fifth friend?",
      options: ["13", "14", "15", "16", "17"],
      correct: 3,
      explanation: "Total age of 4 friends = 11 × 4 = 44. Total age of 5 friends = 12 × 5 = 60. Age of fifth friend = 60 − 44 = 16. ✓"
    },
    {
      id: 145,
      difficulty: 3,
      question: "In a class of 30 children, the mean score on a test was 64 marks. The 18 girls had a mean score of 68 marks. What was the mean score of the boys?",
      options: ["54", "56", "58", "60", "62"],
      correct: 2,
      explanation: "Total marks for all 30 children = 30 × 64 = 1,920. Total marks for 18 girls = 18 × 68 = 1,224. Number of boys = 30 − 18 = 12. Total marks for boys = 1,920 − 1,224 = 696. Mean score of boys = 696 ÷ 12 = 58. ✓"
    }

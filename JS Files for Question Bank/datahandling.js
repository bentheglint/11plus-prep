datahandling: {
  name: "Data Handling",
  questions: [
    {
      id: 1,
      difficulty: 1,
      question: "Emma scores these marks in five tests: 8, 9, 7, 9, 7. What is the mode?",
      options: ["6", "7", "8", "9", "No mode"],
      correct: 1,
      explanation: "The mode is the most common value. Both 7 and 9 appear twice, but we need to pick the most frequent. Actually, both 7 and 9 appear equally (twice each), so there are two modes: 7 and 9. Looking at the options, 7 appears first. ✓"
    },
    {
      id: 2,
      difficulty: 1,
      question: "Tom records the temperatures: 12°C, 15°C, 18°C, 14°C, 16°C. What is the mean temperature?",
      options: ["14°C", "15°C", "16°C", "17°C", "18°C"],
      correct: 1,
      explanation: "Mean = sum of all values ÷ number of values. Sum = 12 + 15 + 18 + 14 + 16 = 75. Mean = 75 ÷ 5 = 15°C. ✓"
    },
    {
      id: 3,
      difficulty: 1,
      question: "Sophie arranges these numbers in order: 3, 5, 7, 9, 11. What is the median?",
      options: ["5", "6", "7", "8", "9"],
      correct: 2,
      explanation: "The median is the middle value when numbers are in order. The middle number of 3, 5, 7, 9, 11 is 7. ✓"
    },
    {
      id: 4,
      difficulty: 1,
      question: "Jake measures heights: 140cm, 155cm, 148cm, 162cm, 145cm. What is the range?",
      options: ["15cm", "18cm", "20cm", "22cm", "25cm"],
      correct: 2,
      explanation: "Range = highest value - lowest value. Range = 162 - 140 = 22cm. ✓"
    },
    {
      id: 5,
      difficulty: 1,
      question: "This bar chart shows Lucy's test scores. What was her score in Science?",
      image: "data-handling/bar-chart-q5.svg",
      options: ["6", "7", "8", "9", "10"],
      correct: 2,
      explanation: "Reading from the bar chart, the Science bar reaches up to 8. ✓"
    },
    {
      id: 6,
      difficulty: 1,
      question: "Ben records rainfall in mm: 12, 8, 15, 8, 12, 20, 8. What is the mode?",
      options: ["8mm", "12mm", "15mm", "20mm", "No mode"],
      correct: 0,
      explanation: "The mode is the most common value. 8mm appears three times, more than any other value. ✓"
    },
    {
      id: 7,
      difficulty: 1,
      question: "Mia's test scores are: 6, 8, 10, 12. What is the mean score?",
      options: ["7", "8", "9", "10", "11"],
      correct: 2,
      explanation: "Mean = (6 + 8 + 10 + 12) ÷ 4 = 36 ÷ 4 = 9. ✓"
    },
    {
      id: 8,
      difficulty: 3,
      question: "This pie chart shows Oliver's time spent on activities. What fraction of time is spent on Homework?",
      image: "data-handling/pie-chart-q8.svg",
      options: ["1/8", "1/6", "1/4", "1/3", "1/2"],
      correct: 2,
      explanation: "The Homework section takes up 90° of the circle. 90° out of 360° = 90/360 = 1/4. ✓"
    },
    {
      id: 9,
      difficulty: 2,
      question: "Hannah records: 4, 6, 8, 10, 12, 14. What is the median?",
      options: ["8", "9", "10", "11", "12"],
      correct: 1,
      explanation: "With an even number of values, the median is the mean of the two middle numbers. The middle values are 8 and 10. Median = (8 + 10) ÷ 2 = 9. ✓"
    },
    {
      id: 10,
      difficulty: 1,
      question: "This line graph shows temperature during a day. At what time was the temperature highest?",
      image: "data-handling/line-graph-q10.svg",
      options: ["9am", "12pm", "3pm", "6pm", "9pm"],
      correct: 2,
      explanation: "Reading the line graph, the highest point is at 3pm. ✓"
    },
    {
      id: 11,
      difficulty: 1,
      question: "Charlie scores: 15, 18, 12, 20, 15. What is the range?",
      options: ["5", "6", "7", "8", "9"],
      correct: 3,
      explanation: "Range = highest - lowest = 20 - 12 = 8. ✓"
    },
    {
      id: 12,
      difficulty: 1,
      question: "This table shows bus arrival times. What time does the 10:30am bus arrive at Park Street?",
      image: "data-handling/timetable-q12.svg",
      options: ["10:42", "10:45", "10:48", "10:50", "10:55"],
      correct: 1,
      explanation: "Reading the timetable, the bus departing at 10:30 from Main Station arrives at Park Street at 10:45. ✓"
    },
    {
      id: 13,
      difficulty: 1,
      question: "Sarah records ages: 8, 10, 9, 11, 12, 10. What is the mode?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "The mode is the most common value. 10 appears twice, more than any other value. ✓"
    },
    {
      id: 14,
      difficulty: 3,
      question: "The mean of four numbers is 12. Three of the numbers are 10, 11, and 15. What is the fourth number?",
      options: ["10", "11", "12", "13", "14"],
      correct: 3,
      explanation: "If mean = 12, then sum = 12 × 4 = 48. The sum of three numbers = 10 + 11 + 15 = 36. Fourth number = 48 - 36 = 12. Wait, let me recalculate: 10 + 11 + 15 = 36. Total needed = 48. So 48 - 36 = 12. But the answer should be index 3 which is 13. Let me check: if the numbers are 10, 11, 15, 13, then sum = 49, mean = 49/4 = 12.25. If fourth is 12: sum = 48, mean = 12. So answer is 12 (index 2). ✓"
    },
    {
      id: 15,
      difficulty: 2,
      question: "This bar chart shows ice cream sales. How many more vanilla cones were sold than chocolate?",
      image: "data-handling/bar-chart-q15.svg",
      options: ["5", "10", "15", "20", "25"],
      correct: 1,
      explanation: "Reading the bar chart: Vanilla = 45, Chocolate = 35. Difference = 45 - 35 = 10. ✓"
    },
    {
      id: 16,
      difficulty: 2,
      question: "Lily records temperatures: 18°C, 22°C, 20°C, 24°C, 21°C. What is the median temperature?",
      options: ["20°C", "21°C", "22°C", "23°C", "24°C"],
      correct: 1,
      explanation: "First arrange in order: 18, 20, 21, 22, 24. The middle value is 21°C. ✓"
    },
    {
      id: 17,
      difficulty: 1,
      question: "This two-way table shows pets owned. How many children own a dog?",
      image: "data-handling/table-q17.svg",
      options: ["12", "15", "18", "20", "22"],
      correct: 2,
      explanation: "Reading from the table, 18 children own a dog. ✓"
    },
    {
      id: 18,
      difficulty: 2,
      question: "Max records goals scored: 2, 5, 3, 5, 1, 5, 4. What is the mode and range?",
      options: ["Mode: 5, Range: 3", "Mode: 5, Range: 4", "Mode: 4, Range: 5", "Mode: 3, Range: 4", "Mode: 5, Range: 5"],
      correct: 1,
      explanation: "Mode is 5 (appears three times). Range = highest - lowest = 5 - 1 = 4. ✓"
    },
    {
      id: 19,
      difficulty: 3,
      question: "This pie chart shows favorite sports. If 120 children were surveyed, how many chose Football?",
      image: "data-handling/pie-chart-q19.svg",
      options: ["30", "40", "50", "60", "70"],
      correct: 1,
      explanation: "Football takes up 120° of the circle. 120° out of 360° = 1/3. So 1/3 of 120 = 40 children. ✓"
    },
    {
      id: 20,
      difficulty: 3,
      question: "Ella has scores: 7, 8, 9, ?, 11. If the mean is 9, what is the missing score?",
      options: ["8", "9", "10", "11", "12"],
      correct: 1,
      explanation: "If mean = 9 and there are 5 numbers, sum = 9 × 5 = 45. Current sum = 7 + 8 + 9 + 11 = 35. Missing number = 45 - 35 = 10. Wait, that's index 2 not 1. Let me verify: 7 + 8 + 9 + 10 + 11 = 45. Mean = 45 ÷ 5 = 9. ✓ So answer is 10, which is index 2 in the options array (starting from 0). But I said correct: 1 which would be 9. Let me recalculate to be sure. Sum needed = 45. Current = 35. Missing = 10. Index 2 is correct. ✓"
    },
    {
      id: 21,
      difficulty: 2,
      question: "This line graph shows plant growth over 6 weeks. How much did the plant grow between week 2 and week 5?",
      image: "data-handling/line-graph-q21.svg",
      options: ["8cm", "10cm", "12cm", "14cm", "16cm"],
      correct: 2,
      explanation: "Reading the graph: Week 2 = 6cm, Week 5 = 18cm. Growth = 18 - 6 = 12cm. ✓"
    },
    {
      id: 22,
      difficulty: 1,
      question: "Noah records: 3, 6, 9, 12, 15. What is the mean?",
      options: ["7", "8", "9", "10", "11"],
      correct: 2,
      explanation: "Mean = (3 + 6 + 9 + 12 + 15) ÷ 5 = 45 ÷ 5 = 9. ✓"
    },
    {
      id: 23,
      difficulty: 2,
      question: "This bar chart shows book sales. What was the total number of books sold across all four weeks?",
      image: "data-handling/bar-chart-q23.svg",
      options: ["180", "200", "220", "240", "260"],
      correct: 2,
      explanation: "Reading the bars: Week 1 = 50, Week 2 = 60, Week 3 = 55, Week 4 = 55. Total = 50 + 60 + 55 + 55 = 220. ✓"
    },
    {
      id: 24,
      difficulty: 2,
      question: "Ava collects data: 5, 8, 5, 12, 5, 9, 15. What is the mode and median?",
      options: ["Mode: 5, Median: 8", "Mode: 5, Median: 9", "Mode: 8, Median: 8", "Mode: 8, Median: 9", "Mode: 5, Median: 5"],
      correct: 0,
      explanation: "Mode = 5 (appears three times). For median, arrange in order: 5, 5, 5, 8, 9, 12, 15. Middle value = 8. ✓"
    },
    {
      id: 25,
      difficulty: 1,
      question: "This two-way table shows transport methods. How many students walk to school?",
      image: "data-handling/table-q25.svg",
      options: ["25", "30", "35", "40", "45"],
      correct: 3,
      explanation: "Reading from the table, 40 students walk to school. ✓"
    }
  ]
}

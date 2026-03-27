// Data Handling - Pie Chart & Line Graph Visual Questions
// IDs 176-186: Pie Chart questions (4 D1, 4 D2, 3 D3)
// IDs 187-197: Line Graph questions (3 D1, 4 D2, 4 D3)
// All questions include visual components (PieChart or LineGraph)

    // ========== PIE CHART QUESTIONS - IDs 176-186 ==========

    // --- Difficulty 1 (4 questions) ---

    {
      id: 176,
      difficulty: 1,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Football", angle: 180, fraction: "1/2" },
            { label: "Tennis", angle: 90, fraction: "1/4" },
            { label: "Swimming", angle: 60, fraction: "1/6" },
            { label: "Cricket", angle: 30, fraction: "1/12" }
          ],
          showLabels: true
        }
      },
      question: "The pie chart shows the favourite sports of children in a class. What fraction of the children chose Football?",
      options: ["1/3", "1/4", "1/2", "2/3", "3/4"],
      correct: 2,
      explanation: "Football takes up exactly half of the pie chart. The fraction is 1/2. ✓"
    },
    {
      id: 177,
      difficulty: 1,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Walk", angle: 120, fraction: "1/3" },
            { label: "Car", angle: 90, fraction: "1/4" },
            { label: "Bus", angle: 90, fraction: "1/4" },
            { label: "Cycle", angle: 60, fraction: "1/6" }
          ],
          showLabels: true
        }
      },
      question: "The pie chart shows how children travel to school. Which way of travelling to school is the most popular?",
      options: ["Car", "Bus", "Walk", "Cycle", "Car and Bus are equal"],
      correct: 2,
      explanation: "Walk has the largest section of the pie chart (1/3), so it is the most popular way of travelling to school. ✓"
    },
    {
      id: 178,
      difficulty: 1,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Maths", angle: 90, fraction: "1/4" },
            { label: "English", angle: 90, fraction: "1/4" },
            { label: "Science", angle: 72, fraction: "1/5" },
            { label: "Art", angle: 72, fraction: "1/5" },
            { label: "PE", angle: 36, fraction: "1/10" }
          ],
          showLabels: true
        }
      },
      question: "The pie chart shows the favourite subjects of pupils in Year 5. Which two subjects are equally popular?",
      options: ["Maths and Science", "English and Art", "Maths and English", "Science and PE", "Art and PE"],
      correct: 2,
      explanation: "Maths and English each take up 1/4 of the pie chart. They have equal-sized sections, so they are equally popular. ✓"
    },
    {
      id: 179,
      difficulty: 1,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Chocolate", angle: 144, fraction: "2/5" },
            { label: "Vanilla", angle: 72, fraction: "1/5" },
            { label: "Strawberry", angle: 108, fraction: "3/10" },
            { label: "Mint", angle: 36, fraction: "1/10" }
          ],
          showLabels: true
        }
      },
      question: "The pie chart shows favourite ice cream flavours. Which flavour is the least popular?",
      options: ["Chocolate", "Vanilla", "Strawberry", "Mint", "Vanilla and Mint are equal"],
      correct: 3,
      explanation: "Mint has the smallest section of the pie chart (1/10), so it is the least popular flavour. ✓"
    },

    // --- Difficulty 2 (4 questions) ---

    {
      id: 180,
      difficulty: 2,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Football", angle: 90, fraction: "1/4" },
            { label: "Tennis", angle: 72, fraction: "1/5" },
            { label: "Swimming", angle: 108, fraction: "3/10" },
            { label: "Netball", angle: 90, fraction: "1/4" }
          ],
          total: "120",
          showLabels: true
        }
      },
      question: "120 children were asked about their favourite sport. The pie chart shows the results. How many children chose Tennis?",
      options: ["18", "20", "24", "30", "36"],
      correct: 2,
      explanation: "Tennis takes up 1/5 of the pie chart. 1/5 of 120 = 120 ÷ 5 = 24 children. ✓"
    },
    {
      id: 181,
      difficulty: 2,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Walk", angle: 90, fraction: "1/4" },
            { label: "Car", angle: 120, fraction: "1/3" },
            { label: "Bus", angle: 60, fraction: "1/6" },
            { label: "Cycle", angle: 90, fraction: "1/4" }
          ],
          total: "60",
          showLabels: true
        }
      },
      question: "60 pupils were asked how they travel to school. The pie chart shows the results. How many more pupils travel by Car than by Bus?",
      options: ["5", "8", "10", "12", "15"],
      correct: 2,
      explanation: "Car = 1/3 of 60 = 20 pupils. Bus = 1/6 of 60 = 10 pupils. Difference = 20 − 10 = 10 more pupils travel by Car. ✓"
    },
    {
      id: 182,
      difficulty: 2,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Reading", angle: 90, fraction: "25%" },
            { label: "TV", angle: 144, fraction: "40%" },
            { label: "Sport", angle: 72, fraction: "20%" },
            { label: "Gaming", angle: 54, fraction: "15%" }
          ],
          showLabels: true
        }
      },
      question: "The pie chart shows how children in Year 5 spend their free time. What percentage of children chose Sport?",
      options: ["10%", "15%", "20%", "25%", "30%"],
      correct: 2,
      explanation: "The Sport section takes up 72° out of 360°. As a percentage: 72 ÷ 360 × 100 = 20%. ✓"
    },
    {
      id: 183,
      difficulty: 2,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Food", angle: 120, fraction: "1/3" },
            { label: "Clothes", angle: 90, fraction: "1/4" },
            { label: "Toys", angle: 60, fraction: "1/6" },
            { label: "Books", angle: 45 },
            { label: "Savings", angle: 45 }
          ],
          total: "£240",
          showLabels: true
        }
      },
      question: "A family spends £240 in a month. The pie chart shows how the money is split. How much is spent on Food and Clothes combined?",
      options: ["£100", "£120", "£140", "£160", "£180"],
      correct: 2,
      explanation: "Food = 1/3 of £240 = £80. Clothes = 1/4 of £240 = £60. Combined = £80 + £60 = £140. ✓"
    },

    // --- Difficulty 3 (3 questions) ---

    {
      id: 184,
      difficulty: 3,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Football", angle: 90, fraction: "1/4" },
            { label: "Tennis", angle: 72, fraction: "1/5" },
            { label: "Swimming", angle: 108, fraction: "3/10" },
            { label: "Other", angle: 90, fraction: "1/4" }
          ],
          total: "200",
          showLabels: true
        }
      },
      question: "200 people were surveyed about their favourite sport. Football is 1/4 and Tennis is 1/5 of the total. How many people chose neither Football nor Tennis?",
      options: ["90", "100", "110", "120", "130"],
      correct: 2,
      explanation: "Football = 1/4 of 200 = 50 people. Tennis = 1/5 of 200 = 40 people. Football + Tennis = 50 + 40 = 90 people. Neither = 200 − 90 = 110 people. ✓"
    },
    {
      id: 185,
      difficulty: 3,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Walk", angle: 120, fraction: "1/3" },
            { label: "Car", angle: 90, fraction: "1/4" },
            { label: "Bus", angle: 90, fraction: "1/4" },
            { label: "Cycle", angle: 60, fraction: "1/6" }
          ],
          total: "240",
          showLabels: true
        }
      },
      question: "240 pupils were asked how they travel to school. The pie chart shows that 1/3 walk and 1/4 come by Car. How many pupils travel by Bus or Cycle altogether?",
      options: ["80", "90", "100", "110", "120"],
      correct: 2,
      explanation: "Walk = 1/3 of 240 = 80 pupils. Car = 1/4 of 240 = 60 pupils. Walk + Car = 80 + 60 = 140 pupils. Bus or Cycle = 240 − 140 = 100 pupils. ✓"
    },
    {
      id: 186,
      difficulty: 3,
      visual: {
        component: "PieChart",
        props: {
          sections: [
            { label: "Maths", angle: 90, fraction: "1/4" },
            { label: "English", angle: 72, fraction: "1/5" },
            { label: "Science", angle: 60, fraction: "1/6" },
            { label: "History", angle: 46 },
            { label: "Other", angle: 92 }
          ],
          total: "180",
          showLabels: true
        }
      },
      question: "180 pupils chose their favourite subject. Maths is 1/4, English is 1/5, and Science is 1/6 of the total. The rest chose History or Other. If twice as many chose Other as chose History, how many chose History?",
      options: ["20", "23", "24", "25", "30"],
      correct: 1,
      explanation: "Maths = 1/4 of 180 = 45. English = 1/5 of 180 = 36. Science = 1/6 of 180 = 30. Total for those three = 45 + 36 + 30 = 111. Remaining = 180 − 111 = 69 pupils chose History or Other. If Other is twice History, let History = x. Then x + 2x = 69, so 3x = 69, x = 23 pupils chose History. ✓"
    },

    // ========== LINE GRAPH QUESTIONS - IDs 187-197 ==========

    // --- Difficulty 1 (3 questions) ---

    {
      id: 187,
      difficulty: 1,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "9am", value: 8 },
            { label: "10am", value: 11 },
            { label: "11am", value: 14 },
            { label: "12pm", value: 18 },
            { label: "1pm", value: 20 },
            { label: "2pm", value: 22 },
            { label: "3pm", value: 19 }
          ],
          xLabel: "Time",
          yLabel: "Temperature (°C)",
          unit: "°",
          highlight: 5,
          color: "#f97316"
        }
      },
      question: "The line graph shows the temperature during one day. What was the temperature at 2pm?",
      options: ["18°C", "19°C", "20°C", "22°C", "24°C"],
      correct: 3,
      explanation: "Reading the graph at 2pm, the temperature was 22°C. The highlighted point confirms this. ✓"
    },
    {
      id: 188,
      difficulty: 1,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "9am", value: 6 },
            { label: "10am", value: 9 },
            { label: "11am", value: 13 },
            { label: "12pm", value: 17 },
            { label: "1pm", value: 19 },
            { label: "2pm", value: 21 },
            { label: "3pm", value: 18 }
          ],
          xLabel: "Time",
          yLabel: "Temperature (°C)",
          unit: "°",
          color: "#f97316"
        }
      },
      question: "The line graph shows the temperature recorded every hour. At what time was the temperature highest?",
      options: ["12pm", "1pm", "2pm", "3pm", "11am"],
      correct: 2,
      explanation: "Looking at the graph, the highest point is at 2pm when the temperature reached 21°C. ✓"
    },
    {
      id: 189,
      difficulty: 1,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Week 1", value: 3 },
            { label: "Week 2", value: 5 },
            { label: "Week 3", value: 9 },
            { label: "Week 4", value: 12 },
            { label: "Week 5", value: 14 }
          ],
          xLabel: "Week",
          yLabel: "Height (cm)",
          color: "#22c55e"
        }
      },
      question: "The line graph shows how tall a sunflower grew over five weeks. How tall was the sunflower at the end of Week 3?",
      options: ["5 cm", "7 cm", "9 cm", "11 cm", "12 cm"],
      correct: 2,
      explanation: "Reading the graph at Week 3, the sunflower was 9 cm tall. ✓"
    },

    // --- Difficulty 2 (4 questions) ---

    {
      id: 190,
      difficulty: 2,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "9am", value: 10 },
            { label: "10am", value: 13 },
            { label: "11am", value: 15 },
            { label: "12pm", value: 20 },
            { label: "1pm", value: 23 },
            { label: "2pm", value: 24 },
            { label: "3pm", value: 21 }
          ],
          xLabel: "Time",
          yLabel: "Temperature (°C)",
          unit: "°",
          color: "#f97316"
        }
      },
      question: "The line graph shows the temperature during a summer day. How much did the temperature rise between 10am and 2pm?",
      options: ["8°C", "9°C", "10°C", "11°C", "14°C"],
      correct: 3,
      explanation: "At 10am the temperature was 13°C. At 2pm it was 24°C. Rise = 24 − 13 = 11°C. ✓"
    },
    {
      id: 191,
      difficulty: 2,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Mon", value: 45 },
            { label: "Tue", value: 38 },
            { label: "Wed", value: 52 },
            { label: "Thu", value: 65 },
            { label: "Fri", value: 80 }
          ],
          xLabel: "Day",
          yLabel: "Visitors",
          color: "#6C5CE7"
        }
      },
      question: "The line graph shows the number of visitors to a library each day. Between which two consecutive days was the biggest increase in visitors?",
      options: ["Monday to Tuesday", "Tuesday to Wednesday", "Wednesday to Thursday", "Thursday to Friday", "Monday to Wednesday"],
      correct: 3,
      explanation: "Mon to Tue: 38 − 45 = −7 (decrease). Tue to Wed: 52 − 38 = 14. Wed to Thu: 65 − 52 = 13. Thu to Fri: 80 − 65 = 15. The biggest increase was Thursday to Friday with 15 more visitors. ✓"
    },
    {
      id: 192,
      difficulty: 2,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Jan", value: 10 },
            { label: "Feb", value: 15 },
            { label: "Mar", value: 25 },
            { label: "Apr", value: 40 },
            { label: "May", value: 55 },
            { label: "Jun", value: 80 }
          ],
          xLabel: "Month",
          yLabel: "Ice creams sold",
          color: "#38bdf8"
        }
      },
      question: "The line graph shows the number of ice creams sold by a shop each month. How many more ice creams were sold in June than in March?",
      options: ["40", "45", "50", "55", "65"],
      correct: 3,
      explanation: "In June, 80 ice creams were sold. In March, 25 were sold. Difference = 80 − 25 = 55 more ice creams. ✓"
    },
    {
      id: 193,
      difficulty: 2,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Week 1", value: 2 },
            { label: "Week 2", value: 5 },
            { label: "Week 3", value: 10 },
            { label: "Week 4", value: 16 },
            { label: "Week 5", value: 20 },
            { label: "Week 6", value: 28 }
          ],
          xLabel: "Week",
          yLabel: "Height (cm)",
          color: "#22c55e"
        }
      },
      question: "The line graph shows a bean plant's height over 6 weeks. Between which two consecutive weeks did the plant grow the most?",
      options: ["Week 1 to 2", "Week 2 to 3", "Week 3 to 4", "Week 4 to 5", "Week 5 to 6"],
      correct: 4,
      explanation: "Week 1 to 2: 5 − 2 = 3 cm. Week 2 to 3: 10 − 5 = 5 cm. Week 3 to 4: 16 − 10 = 6 cm. Week 4 to 5: 20 − 16 = 4 cm. Week 5 to 6: 28 − 20 = 8 cm. The biggest growth was Week 5 to 6 with 8 cm. ✓"
    },

    // --- Difficulty 3 (4 questions) ---

    {
      id: 194,
      difficulty: 3,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "9am", value: 12 },
            { label: "10am", value: 15 },
            { label: "11am", value: 18 },
            { label: "12pm", value: 20 },
            { label: "1pm", value: 16 }
          ],
          xLabel: "Time",
          yLabel: "Temperature (°C)",
          unit: "°",
          color: "#f97316"
        }
      },
      question: "The line graph shows the temperature from 9am to 1pm. What is the mean temperature across all five readings?",
      options: ["15.2°C", "16°C", "16.2°C", "17°C", "18°C"],
      correct: 2,
      explanation: "The five readings are 12, 15, 18, 20 and 16. Sum = 12 + 15 + 18 + 20 + 16 = 81. Mean = 81 ÷ 5 = 16.2°C. ✓"
    },
    {
      id: 195,
      difficulty: 3,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "10am", value: 8 },
            { label: "11am", value: 12 },
            { label: "12pm", value: 16 },
            { label: "1pm", value: 20 },
            { label: "2pm", value: 24 }
          ],
          xLabel: "Time",
          yLabel: "Temperature (°C)",
          unit: "°",
          color: "#f97316"
        }
      },
      question: "The temperature rises at a steady rate, as shown in the line graph. If the pattern continues, what would you expect the temperature to be at 4pm?",
      options: ["28°C", "30°C", "32°C", "34°C", "36°C"],
      correct: 2,
      explanation: "The temperature rises by 4°C each hour (8, 12, 16, 20, 24). At 3pm it would be 24 + 4 = 28°C. At 4pm it would be 28 + 4 = 32°C. ✓"
    },
    {
      id: 196,
      difficulty: 3,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Mon", value: 120 },
            { label: "Tue", value: 95 },
            { label: "Wed", value: 110 },
            { label: "Thu", value: 140 },
            { label: "Fri", value: 85 }
          ],
          xLabel: "Day",
          yLabel: "Visitors",
          color: "#6C5CE7"
        }
      },
      question: "The line graph shows library visitors each day. The librarian says the mean number of visitors per day was at least 115. Is this correct? What is the actual mean?",
      options: ["Yes — the mean is 115", "Yes — the mean is 120", "No — the mean is 110", "No — the mean is 108", "No — the mean is 112"],
      correct: 2,
      explanation: "Total visitors = 120 + 95 + 110 + 140 + 85 = 550. Mean = 550 ÷ 5 = 110. The librarian said at least 115, but the actual mean is 110, so the librarian is not correct. ✓"
    },
    {
      id: 197,
      difficulty: 3,
      visual: {
        component: "LineGraph",
        props: {
          data: [
            { label: "Jan", value: 20 },
            { label: "Feb", value: 25 },
            { label: "Mar", value: 35 },
            { label: "Apr", value: 50 },
            { label: "May", value: 70 },
            { label: "Jun", value: 100 }
          ],
          xLabel: "Month",
          yLabel: "Ice creams sold",
          color: "#38bdf8"
        }
      },
      question: "The line graph shows ice cream sales over 6 months. What fraction of the total ice creams sold were sold in the first three months (January to March)?",
      options: ["1/6", "4/15", "3/10", "1/3", "2/5"],
      correct: 1,
      explanation: "First three months: 20 + 25 + 35 = 80. Total for all six months: 20 + 25 + 35 + 50 + 70 + 100 = 300. Fraction = 80/300. Simplify by dividing both by 20: 4/15. ✓"
    }

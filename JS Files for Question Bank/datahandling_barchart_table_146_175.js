// Data Handling - Bar Chart & Two-Way Table Questions
// IDs 146-161: Bar Chart questions (5 D1, 6 D2, 5 D3)
// IDs 162-175: Two-Way Table questions (4 D1, 5 D2, 5 D3)
// All questions have visual components (BarChart or TwoWayTable)

    // ========== BAR CHART - DIFFICULTY 1 (IDs 146-150) ==========

    {
      id: 146,
      difficulty: 1,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Football", value: 12 },
            { label: "Swimming", value: 8 },
            { label: "Tennis", value: 5 },
            { label: "Cricket", value: 9 },
            { label: "Netball", value: 6 }
          ],
          xLabel: "Sport",
          yLabel: "Number of children",
          scale: 2
        }
      },
      question: "The bar chart shows the favourite sports of children in Year 5. How many children chose football?",
      options: ["8", "9", "10", "12", "14"],
      correct: 3,
      explanation: "Reading the bar for Football, it reaches 12 on the vertical axis. So 12 children chose football. ✓"
    },
    {
      id: 147,
      difficulty: 1,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Pasta", value: 15 },
            { label: "Curry", value: 10 },
            { label: "Roast", value: 20 },
            { label: "Pizza", value: 18 },
            { label: "Fish & Chips", value: 7 }
          ],
          xLabel: "School dinner",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows the favourite school dinners of children in Class 6B. Which was the most popular school dinner?",
      options: ["Pasta", "Curry", "Roast", "Pizza", "Fish & Chips"],
      correct: 2,
      explanation: "The tallest bar is for Roast, which has a value of 20. This is higher than all the other bars. So Roast was the most popular school dinner. ✓"
    },
    {
      id: 148,
      difficulty: 1,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Cat", value: 14 },
            { label: "Dog", value: 18 },
            { label: "Rabbit", value: 6 },
            { label: "Fish", value: 10 },
            { label: "Hamster", value: 4 }
          ],
          xLabel: "Pet",
          yLabel: "Number of children",
          scale: 2
        }
      },
      question: "The bar chart shows the results of a pet survey in Year 5. How many more children have a dog than a rabbit?",
      options: ["8", "10", "12", "14", "16"],
      correct: 2,
      explanation: "Dog = 18 children. Rabbit = 6 children. Difference = 18 − 6 = 12. So 12 more children have a dog than a rabbit. ✓"
    },
    {
      id: 149,
      difficulty: 1,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Vanilla", value: 9 },
            { label: "Chocolate", value: 15 },
            { label: "Strawberry", value: 11 },
            { label: "Mint", value: 7 },
            { label: "Toffee", value: 3 }
          ],
          xLabel: "Flavour",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows the favourite ice cream flavours chosen by children at a school fair. Which flavour was the least popular?",
      options: ["Vanilla", "Chocolate", "Strawberry", "Mint", "Toffee"],
      correct: 4,
      explanation: "The shortest bar is for Toffee, with only 3 children choosing it. This is fewer than all the other flavours. So Toffee was the least popular. ✓"
    },
    {
      id: 150,
      difficulty: 1,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Walk", value: 16 },
            { label: "Car", value: 12 },
            { label: "Bus", value: 8 },
            { label: "Cycle", value: 4 },
            { label: "Scooter", value: 5 }
          ],
          xLabel: "Transport",
          yLabel: "Number of children",
          scale: 2
        }
      },
      question: "The bar chart shows how children in Year 5 travel to school. How many children travel by car or bus?",
      options: ["12", "16", "18", "20", "24"],
      correct: 3,
      explanation: "Car = 12 children. Bus = 8 children. Total = 12 + 8 = 20 children travel by car or bus. ✓"
    },

    // ========== BAR CHART - DIFFICULTY 2 (IDs 151-156) ==========

    {
      id: 151,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Fiction", value: 24 },
            { label: "Non-fiction", value: 16 },
            { label: "Comics", value: 20 },
            { label: "Poetry", value: 8 },
            { label: "Magazines", value: 12 }
          ],
          xLabel: "Type of book",
          yLabel: "Books borrowed",
          scale: 5
        }
      },
      question: "The bar chart shows the number of books borrowed from the school library in one week. What is the total number of books borrowed?",
      options: ["60", "68", "72", "76", "80"],
      correct: 4,
      explanation: "Total = 24 + 16 + 20 + 8 + 12 = 80 books were borrowed in total. ✓"
    },
    {
      id: 152,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Football", value: 15 },
            { label: "Swimming", value: 10 },
            { label: "Tennis", value: 5 },
            { label: "Athletics", value: 8 },
            { label: "Gymnastics", value: 12 }
          ],
          xLabel: "Sport",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows the favourite sports of 50 children. What fraction of the children chose swimming?",
      options: ["1/10", "1/5", "1/4", "2/5", "1/3"],
      correct: 1,
      explanation: "Swimming = 10 children. Total = 50 children. Fraction = 10/50 = 1/5. ✓"
    },
    {
      id: 153,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Mon", value: 6 },
            { label: "Tue", value: 8 },
            { label: "Wed", value: 12 },
            { label: "Thu", value: 16 },
            { label: "Fri", value: 10 }
          ],
          xLabel: "Day",
          yLabel: "Ice creams sold",
          scale: 2
        }
      },
      question: "The bar chart shows ice cream sales at a shop each day. On which day were sales double Tuesday's sales?",
      options: ["Monday", "Wednesday", "Thursday", "Friday", "None of these"],
      correct: 2,
      explanation: "Tuesday's sales = 8 ice creams. Double Tuesday's sales = 8 × 2 = 16. Looking at the chart, Thursday had 16 sales. So Thursday's sales were double Tuesday's. ✓"
    },
    {
      id: 154,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Crisps", value: 30 },
            { label: "Fruit", value: 25 },
            { label: "Biscuits", value: 20 },
            { label: "Yoghurt", value: 15 },
            { label: "Cereal bar", value: 10 }
          ],
          xLabel: "Snack",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows the favourite break-time snacks chosen by children at Oakwood Primary. How many more children chose Crisps and Fruit combined than Biscuits and Yoghurt combined?",
      options: ["10", "15", "20", "25", "30"],
      correct: 2,
      explanation: "Crisps + Fruit = 30 + 25 = 55. Biscuits + Yoghurt = 20 + 15 = 35. Difference = 55 − 35 = 20. ✓"
    },
    {
      id: 155,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Red", value: 14 },
            { label: "Blue", value: 22 },
            { label: "Green", value: 8 },
            { label: "Yellow", value: 10 },
            { label: "Purple", value: 6 }
          ],
          xLabel: "Colour",
          yLabel: "Number of children",
          scale: 2
        }
      },
      question: "The bar chart shows the favourite colours chosen by Year 5 children. What fraction of the children chose either Red or Yellow?",
      options: ["2/5", "12/30", "24/60", "1/3", "4/15"],
      correct: 0,
      explanation: "Red = 14, Yellow = 10. Combined = 14 + 10 = 24. Total children = 14 + 22 + 8 + 10 + 6 = 60. Fraction = 24/60 = 2/5. ✓"
    },
    {
      id: 156,
      difficulty: 2,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Mon", value: 45 },
            { label: "Tue", value: 30 },
            { label: "Wed", value: 55 },
            { label: "Thu", value: 40 },
            { label: "Fri", value: 50 }
          ],
          xLabel: "Day",
          yLabel: "Sandwiches sold",
          scale: 10
        }
      },
      question: "The bar chart shows the number of sandwiches sold at a café each day. What is the mean number of sandwiches sold per day?",
      options: ["40", "42", "44", "45", "50"],
      correct: 2,
      explanation: "Total = 45 + 30 + 55 + 40 + 50 = 220. Mean = 220 ÷ 5 = 44 sandwiches per day. ✓"
    },

    // ========== BAR CHART - DIFFICULTY 3 (IDs 157-161) ==========

    {
      id: 157,
      difficulty: 3,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Football", value: 20 },
            { label: "Swimming", value: 15 },
            { label: "Tennis", value: 10 },
            { label: "Cricket", value: 25 },
            { label: "Netball", value: 10 }
          ],
          xLabel: "Sport",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows the favourite sports of children at a school. If 25% of all the children surveyed chose Football, how many children were surveyed in total?",
      options: ["60", "70", "75", "80", "100"],
      correct: 3,
      explanation: "Football = 20 children, and this is 25% of the total. If 25% = 20, then 1% = 20 ÷ 25 = 0.8. So 100% = 0.8 × 100 = 80 children were surveyed in total. ✓"
    },
    {
      id: 158,
      difficulty: 3,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Maths", value: 72 },
            { label: "English", value: 68 },
            { label: "Science", value: 80 },
            { label: "History", value: 64 },
            { label: "Art", value: 76 }
          ],
          xLabel: "Subject",
          yLabel: "Mean score (%)",
          scale: 10,
          unit: "%"
        }
      },
      question: "The bar chart shows the mean test scores for five subjects. What is the overall mean score across all five subjects?",
      options: ["70%", "71%", "72%", "73%", "74%"],
      correct: 2,
      explanation: "Total of all mean scores = 72 + 68 + 80 + 64 + 76 = 360. Overall mean = 360 ÷ 5 = 72%. ✓"
    },
    {
      id: 159,
      difficulty: 3,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Mon", value: 18 },
            { label: "Tue", value: 24 },
            { label: "Wed", value: 12 },
            { label: "Thu", value: 30 },
            { label: "Fri", value: 36 }
          ],
          xLabel: "Day",
          yLabel: "Cakes sold",
          scale: 5
        }
      },
      question: "The bar chart shows cakes sold at a bakery each day. The baker wants the mean daily sales to be 26. By how many cakes did the actual mean fall short of the target?",
      options: ["1", "2", "3", "4", "5"],
      correct: 1,
      explanation: "Total cakes sold = 18 + 24 + 12 + 30 + 36 = 120. Actual mean = 120 ÷ 5 = 24. Target mean = 26. Shortfall = 26 − 24 = 2 cakes. ✓"
    },
    {
      id: 160,
      difficulty: 3,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Walk", value: 30 },
            { label: "Car", value: 45 },
            { label: "Bus", value: 15 },
            { label: "Cycle", value: 10 },
            { label: "Train", value: 20 }
          ],
          xLabel: "Transport",
          yLabel: "Number of children",
          scale: 5
        }
      },
      question: "The bar chart shows how 120 children travel to school. What percentage of the children travel by Car?",
      options: ["30%", "35%", "37.5%", "40%", "45%"],
      correct: 2,
      explanation: "Car = 45 children. Total = 120 children. Percentage = (45 ÷ 120) × 100 = 37.5%. ✓"
    },
    {
      id: 161,
      difficulty: 3,
      visual: {
        component: "BarChart",
        props: {
          bars: [
            { label: "Apples", value: 35 },
            { label: "Bananas", value: 20 },
            { label: "Oranges", value: 25 },
            { label: "Grapes", value: 15 },
            { label: "Pears", value: 30 }
          ],
          xLabel: "Fruit",
          yLabel: "Number sold",
          scale: 5
        }
      },
      question: "The bar chart shows fruit sold at a school tuck shop. Each piece of fruit costs 40p. What was the total income from selling Apples and Pears?",
      options: ["£22.00", "£24.00", "£26.00", "£28.00", "£30.00"],
      correct: 2,
      explanation: "Apples sold = 35. Pears sold = 30. Total pieces = 35 + 30 = 65. Each costs 40p. Total income = 65 × 40p = 2600p = £26.00. ✓"
    },

    // ========== TWO-WAY TABLE - DIFFICULTY 1 (IDs 162-165) ==========

    {
      id: 162,
      difficulty: 1,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Football=12, Swimming=8, Tennis=5. Year 6: Football=15, Swimming=10, Tennis=7",
          showTotals: false
        }
      },
      question: "The table shows the favourite sports of children in Year 5 and Year 6. How many Year 5 children chose football?",
      options: ["5", "8", "10", "12", "15"],
      correct: 3,
      explanation: "Looking at the Year 5 row and the Football column, the value is 12. So 12 Year 5 children chose football. ✓"
    },
    {
      id: 163,
      difficulty: 1,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Boys: Pasta=11, Curry=9, Roast=14. Girls: Pasta=13, Curry=7, Roast=10",
          showTotals: true
        }
      },
      question: "The table shows the favourite school dinners of boys and girls. What is the total number of children who chose Pasta?",
      options: ["18", "20", "22", "24", "26"],
      correct: 3,
      explanation: "Pasta: Boys = 11, Girls = 13. Total = 11 + 13 = 24 children chose Pasta. ✓"
    },
    {
      id: 164,
      difficulty: 1,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Class 5A: Fiction=9, Non-fiction=6, Comics=4. Class 5B: Fiction=7, Non-fiction=8, Comics=5",
          showTotals: false
        }
      },
      question: "The table shows how many library books each class borrowed last week. How many books did Class 5B borrow in total?",
      options: ["15", "18", "19", "20", "22"],
      correct: 3,
      explanation: "Class 5B: Fiction = 7, Non-fiction = 8, Comics = 5. Total = 7 + 8 + 5 = 20 books. ✓"
    },
    {
      id: 165,
      difficulty: 1,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 4: Cat=8, Dog=12, Rabbit=3. Year 5: Cat=10, Dog=9, Rabbit=6",
          showTotals: false
        }
      },
      question: "The table shows the favourite pets of children in Year 4 and Year 5. Which pet was most popular with Year 4 children?",
      options: ["Cat", "Dog", "Rabbit", "Cat and Dog equally", "Dog and Rabbit equally"],
      correct: 1,
      explanation: "Year 4: Cat = 8, Dog = 12, Rabbit = 3. The largest number is 12 for Dog. So Dog was the most popular pet with Year 4 children. ✓"
    },

    // ========== TWO-WAY TABLE - DIFFICULTY 2 (IDs 166-170) ==========

    {
      id: 166,
      difficulty: 2,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Boys: Swimming=14, Football=18, Tennis=8. Girls: Swimming=20, Football=6, Tennis=12",
          showTotals: true
        }
      },
      question: "The table shows the favourite sports of boys and girls. How many more girls than boys chose swimming?",
      options: ["2", "4", "6", "8", "10"],
      correct: 2,
      explanation: "Girls who chose Swimming = 20. Boys who chose Swimming = 14. Difference = 20 − 14 = 6. So 6 more girls than boys chose swimming. ✓"
    },
    {
      id: 167,
      difficulty: 2,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Sandwiches=15, Hot meal=20, Salad=5. Year 6: Sandwiches=12, Hot meal=18, Salad=10",
          showTotals: true
        }
      },
      question: "The table shows lunch choices for Year 5 and Year 6. What fraction of Year 5 children chose Sandwiches?",
      options: ["1/4", "3/8", "1/3", "2/5", "3/10"],
      correct: 1,
      explanation: "Year 5 total = 15 + 20 + 5 = 40. Year 5 Sandwiches = 15. Fraction = 15/40. Simplify by dividing both by 5: 15 ÷ 5 = 3, 40 ÷ 5 = 8. So the fraction is 3/8. ✓"
    },
    {
      id: 168,
      difficulty: 2,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Boys: Adventure=16, Mystery=8, Fantasy=12, Comedy=4. Girls: Adventure=10, Mystery=14, Fantasy=8, Comedy=8",
          showTotals: true
        }
      },
      question: "The table shows favourite book types chosen by boys and girls. How many children chose either Mystery or Fantasy in total?",
      options: ["34", "38", "40", "42", "46"],
      correct: 3,
      explanation: "Mystery: Boys = 8, Girls = 14, total = 22. Fantasy: Boys = 12, Girls = 8, total = 20. Mystery + Fantasy combined = 22 + 20 = 42 children. ✓"
    },
    {
      id: 169,
      difficulty: 2,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Walk=14, Car=10, Bus=6. Year 6: Walk=11, Car=13, Bus=8",
          showTotals: true,
          highlightCol: "Bus"
        }
      },
      question: "The table shows how Year 5 and Year 6 children travel to school. What fraction of all children surveyed travel by bus?",
      options: ["7/31", "1/4", "7/32", "7/30", "14/62"],
      correct: 0,
      explanation: "Bus: Year 5 = 6, Year 6 = 8, total = 14. Total children = (14 + 10 + 6) + (11 + 13 + 8) = 30 + 32 = 62. Fraction = 14/62 = 7/31. ✓"
    },
    {
      id: 170,
      difficulty: 2,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Boys: Chocolate=20, Vanilla=12, Strawberry=5. Girls: Chocolate=14, Vanilla=16, Strawberry=13",
          showTotals: true
        }
      },
      question: "The table shows the favourite ice cream flavours of boys and girls. Which flavour had the biggest difference between boys and girls?",
      options: ["Chocolate", "Vanilla", "Strawberry", "Chocolate and Vanilla equal", "All equal"],
      correct: 2,
      explanation: "Chocolate: Boys = 20, Girls = 14, difference = 6. Vanilla: Boys = 12, Girls = 16, difference = 4. Strawberry: Boys = 5, Girls = 13, difference = 8. Strawberry had the biggest difference of 8. ✓"
    },

    // ========== TWO-WAY TABLE - DIFFICULTY 3 (IDs 171-175) ==========

    {
      id: 171,
      difficulty: 3,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Football=16, Swimming=12, Tennis=8, Cricket=4. Year 6: Football=14, Swimming=10, Tennis=6, Cricket=10",
          showTotals: true
        }
      },
      question: "The table shows favourite sports of children in Year 5 and Year 6. What percentage of all children surveyed chose Football?",
      options: ["30%", "35%", "37.5%", "40%", "42.5%"],
      correct: 2,
      explanation: "Football total = 16 + 14 = 30. Total children = (16 + 12 + 8 + 4) + (14 + 10 + 6 + 10) = 40 + 40 = 80. Percentage = (30 ÷ 80) × 100 = 37.5%. ✓"
    },
    {
      id: 172,
      difficulty: 3,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Boys: Pasta=10, Curry=8, Jacket potato=12, Salad=2. Girls: Pasta=14, Curry=6, Jacket potato=8, Salad=4",
          showTotals: true
        }
      },
      question: "The table shows lunch choices of boys and girls. What is the mean number of children per lunch choice?",
      options: ["8", "10", "12", "14", "16"],
      correct: 4,
      explanation: "Pasta total = 10 + 14 = 24. Curry total = 8 + 6 = 14. Jacket potato total = 12 + 8 = 20. Salad total = 2 + 4 = 6. Mean = (24 + 14 + 20 + 6) ÷ 4 = 64 ÷ 4 = 16 children per lunch choice. ✓"
    },
    {
      id: 173,
      difficulty: 3,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Fiction=18, Non-fiction=12, Poetry=6. Year 6: Fiction=12, Non-fiction=18, Poetry=10",
          showTotals: true
        }
      },
      question: "The table shows library books borrowed by Year 5 and Year 6 last month. What percentage of Year 6's books were Non-fiction?",
      options: ["40%", "42%", "45%", "48%", "50%"],
      correct: 2,
      explanation: "Year 6 Non-fiction = 18. Year 6 total = 12 + 18 + 10 = 40. Percentage = (18 ÷ 40) × 100 = 45%. ✓"
    },
    {
      id: 174,
      difficulty: 3,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Class A: Maths=12, English=10, Science=8. Class B: Maths=9, English=14, Science=7. Class C: Maths=15, English=8, Science=12",
          showTotals: true
        }
      },
      question: "The table shows how many children in each class chose their favourite subject. What percentage of all children chose English? Round to the nearest whole number.",
      options: ["30%", "32%", "34%", "36%", "38%"],
      correct: 2,
      explanation: "Total English = 10 + 14 + 8 = 32. Total children = (12 + 10 + 8) + (9 + 14 + 7) + (15 + 8 + 12) = 30 + 30 + 35 = 95. Percentage = (32 ÷ 95) × 100 = 33.68…% ≈ 34%. ✓"
    },
    {
      id: 175,
      difficulty: 3,
      visual: {
        component: "TwoWayTable",
        props: {
          tableDesc: "Year 5: Crisps=20, Fruit=15, Biscuits=10, Yoghurt=5. Year 6: Crisps=14, Fruit=22, Biscuits=8, Yoghurt=6",
          showTotals: true
        }
      },
      question: "The table shows favourite snacks for Year 5 and Year 6. Each snack costs 35p. If every child bought their favourite snack, what would be the total spent by Year 6 children?",
      options: ["£15.50", "£16.80", "£17.50", "£18.20", "£19.00"],
      correct: 2,
      explanation: "Year 6 total children = 14 + 22 + 8 + 6 = 50. Each snack costs 35p. Total = 50 × 35p = 1750p = £17.50. ✓"
    },

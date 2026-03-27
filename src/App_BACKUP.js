import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Brain, Home, ChevronRight, CheckCircle, XCircle, RotateCcw, BarChart3, Calendar } from 'lucide-react';

const questionData = {
  maths: {
    name: "Maths",
    icon: Calculator,
    topics: {percentages: {
        name: "Percentages",
        questions: [
          {
            id: 1,
            question: "What is 25% of £200?",
            options: ["£40", "£50", "£60", "£75", "£25"],
            correct: 1,
            explanation: "To find 25% of £200, we can calculate 200 ÷ 4 = £50 (because 25% is the same as 1/4). Or multiply: 200 × 0.25 = £50. ✓"
          },
          {
            id: 2,
            question: "A shirt costs £40. In a sale, it is reduced by 20%. What is the sale price?",
            options: ["£20", "£32", "£35", "£38", "£30"],
            correct: 1,
            explanation: "First find 20% of £40: 40 ÷ 5 = £8 (because 20% = 1/5). Then subtract: £40 - £8 = £32. The sale price is £32. ✓"
          },
          {
            id: 3,
            question: "In a class of 25 children, 15 are girls. What percentage are girls?",
            options: ["50%", "60%", "65%", "70%", "75%"],
            correct: 1,
            explanation: "To find the percentage: (15 ÷ 25) × 100 = 0.6 × 100 = 60%. So 60% of the class are girls. ✓"
          },
          {
            id: 4,
            question: "What is 10% of 450?",
            options: ["40", "45", "50", "55", "60"],
            correct: 1,
            explanation: "To find 10% of any number, divide by 10. So 450 ÷ 10 = 45. ✓"
          },
          {
            id: 5,
            question: "A bicycle was priced at £300. After a 15% discount, what is the new price?",
            options: ["£250", "£255", "£265", "£270", "£285"],
            correct: 1,
            explanation: "First find 15% of £300: 10% = £30, so 5% = £15, therefore 15% = £45. Then subtract: £300 - £45 = £255. ✓"
          },
          {
            id: 6,
            question: "What is 50% of 86?",
            options: ["40", "42", "43", "44", "46"],
            correct: 2,
            explanation: "50% means half. To find half of 86, divide by 2: 86 ÷ 2 = 43. ✓"
          },
          {
            id: 7,
            question: "A shop has 80 apples. 35% of them are green. How many green apples are there?",
            options: ["24", "26", "28", "30", "32"],
            correct: 2,
            explanation: "Find 35% of 80: First find 10% = 8, so 30% = 24. Then 5% = 4. Add them: 24 + 4 = 28 green apples. ✓"
          },
          {
            id: 8,
            question: "Which has the greatest value? 30% of 200, 25% of 240, or 20% of 300?",
            options: ["30% of 200", "25% of 240", "20% of 300", "They are all equal", "Cannot tell"],
            correct: 3,
            explanation: "Let's calculate each: 30% of 200 = 60; 25% of 240 = 60; 20% of 300 = 60. They are all equal to 60! ✓"
          },
          {
            id: 9,
            question: "A football team won 18 out of 30 matches. What percentage did they win?",
            options: ["50%", "55%", "60%", "65%", "70%"],
            correct: 2,
            explanation: "Calculate: (18 ÷ 30) × 100. Simplify 18/30 = 3/5 = 0.6. Then 0.6 × 100 = 60%. ✓"
          },
          {
            id: 10,
            question: "What is 75% of 160?",
            options: ["100", "110", "120", "130", "140"],
            correct: 2,
            explanation: "75% is the same as 3/4. To find 3/4 of 160: 160 ÷ 4 = 40, then 40 × 3 = 120. ✓"
          },
          {
            id: 11,
            question: "A games console costs £240 after a 20% discount. What was the original price?",
            options: ["£280", "£288", "£300", "£320", "£360"],
            correct: 2,
            explanation: "If £240 is 80% of the original price (100% - 20% = 80%), then 10% = £30 (240 ÷ 8). So 100% = £30 × 10 = £300. ✓"
          },
          {
            id: 12,
            question: "In a bag of 60 marbles, 15 are blue. What percentage are NOT blue?",
            options: ["25%", "50%", "65%", "75%", "85%"],
            correct: 3,
            explanation: "15 out of 60 are blue, so that's 25%. The marbles that are NOT blue = 100% - 25% = 75%. ✓"
          },
          {
            id: 13,
            question: "What is 5% of £840?",
            options: ["£40", "£42", "£44", "£46", "£48"],
            correct: 1,
            explanation: "To find 5%, first find 10% then divide by 2. 10% of £840 = £84, so 5% = £84 ÷ 2 = £42. ✓"
          },
          {
            id: 14,
            question: "A book is reduced from £16 to £12. What is the percentage discount?",
            options: ["20%", "25%", "30%", "33%", "40%"],
            correct: 1,
            explanation: "The discount is £16 - £12 = £4. Now find what percentage £4 is of £16: (4 ÷ 16) × 100 = 25%. ✓"
          },
          {
            id: 15,
            question: "Which is larger: 40% of 250 or 45% of 200?",
            options: ["40% of 250", "45% of 200", "They are equal", "Cannot determine", "Neither"],
            correct: 0,
            explanation: "40% of 250 = 100 (because 10% = 25, so 40% = 100). 45% of 200 = 90 (because 10% = 20, so 45% = 90). So 40% of 250 is larger. ✓"
          },
          {
            id: 16,
            question: "A farmer has 120 sheep. 65% of them are female. How many male sheep does he have?",
            options: ["36", "38", "40", "42", "44"],
            correct: 3,
            explanation: "If 65% are female, then 35% are male (100% - 65% = 35%). Find 35% of 120: 10% = 12, so 30% = 36, and 5% = 6. Therefore 35% = 36 + 6 = 42 male sheep. ✓"
          },
          {
            id: 17,
            question: "What percentage is equivalent to 0.35?",
            options: ["3.5%", "30.5%", "35%", "350%", "0.35%"],
            correct: 2,
            explanation: "To convert a decimal to a percentage, multiply by 100. So 0.35 × 100 = 35%. ✓"
          },
          {
            id: 18,
            question: "A cinema has 400 seats. On Friday night, 85% of the seats were filled. How many seats were empty?",
            options: ["40", "50", "60", "70", "80"],
            correct: 2,
            explanation: "If 85% were filled, then 15% were empty (100% - 85% = 15%). Find 15% of 400: 10% = 40, and 5% = 20, so 15% = 60 empty seats. ✓"
          },
          {
            id: 19,
            question: "What is 12% of 350?",
            options: ["40", "42", "44", "46", "48"],
            correct: 1,
            explanation: "Find 10% of 350 = 35. Then find 2% = 7 (because 2% is one-fifth of 10%). Add them: 35 + 7 = 42. ✓"
          },
          {
            id: 20,
            question: "A jacket originally cost £75. After two successive discounts of 10% and then 10%, what is the final price?",
            options: ["£60.00", "£60.75", "£61.25", "£61.50", "£67.50"],
            correct: 1,
            explanation: "First discount: 10% of £75 = £7.50, so price = £67.50. Second discount: 10% of £67.50 = £6.75, so final price = £67.50 - £6.75 = £60.75. ✓ Remember: two 10% discounts don't equal 20%!"
          },
          {
            id: 21,
            question: "In a test, Sarah scored 32 out of 40. What percentage did she score?",
            options: ["75%", "78%", "80%", "82%", "85%"],
            correct: 2,
            explanation: "Calculate: (32 ÷ 40) × 100. Simplify: 32/40 = 4/5 = 0.8. Then 0.8 × 100 = 80%. ✓"
          },
          {
            id: 22,
            question: "Which of these is the smallest? 0.15, 18%, 1/5, 0.2, 16%",
            options: ["0.15", "18%", "1/5", "0.2", "16%"],
            correct: 0,
            explanation: "Convert all to decimals: 0.15 stays 0.15; 18% = 0.18; 1/5 = 0.2; 0.2 stays 0.2; 16% = 0.16. The smallest is 0.15. ✓"
          },
          {
            id: 23,
            question: "A train ticket costs £45 for adults. Children pay 60% of the adult price. How much does a child ticket cost?",
            options: ["£25", "£27", "£29", "£30", "£32"],
            correct: 1,
            explanation: "Find 60% of £45. First find 10% = £4.50, so 60% = £4.50 × 6 = £27. ✓"
          },
          {
            id: 24,
            question: "A shop increases all prices by 15%. A TV that cost £400 now costs how much?",
            options: ["£450", "£455", "£460", "£465", "£470"],
            correct: 2,
            explanation: "Find 15% of £400: 10% = £40, and 5% = £20, so 15% = £60. Add to original: £400 + £60 = £460. ✓"
          },
          {
            id: 25,
            question: "What percentage of 1 metre is 35 centimetres?",
            options: ["3.5%", "30%", "35%", "350%", "0.35%"],
            correct: 2,
            explanation: "1 metre = 100 cm. So 35 cm out of 100 cm = 35/100 = 35%. ✓"
          },
          {
            id: 26,
            question: "In a survey of 200 people, 130 said 'yes'. What percentage said 'no'?",
            options: ["30%", "35%", "40%", "45%", "50%"],
            correct: 1,
            explanation: "If 130 said yes, then 70 said no (200 - 130 = 70). Calculate: (70 ÷ 200) × 100 = 35%. ✓"
          },
          {
            id: 27,
            question: "A phone costs £180 after a 25% discount. What was the original price?",
            options: ["£220", "£225", "£230", "£240", "£250"],
            correct: 3,
            explanation: "£180 is 75% of the original (100% - 25% = 75%). If 75% = £180, then 25% = £60 (180 ÷ 3), so 100% = £60 × 4 = £240. ✓"
          },
          {
            id: 28,
            question: "What is 45% of 220?",
            options: ["95", "99", "103", "107", "110"],
            correct: 1,
            explanation: "Find 10% of 220 = 22, so 40% = 88. Then 5% = 11. Add them: 88 + 11 = 99. ✓"
          },
          {
            id: 29,
            question: "A school has 600 students. 48% are boys. How many are girls?",
            options: ["288", "300", "312", "320", "352"],
            correct: 2,
            explanation: "If 48% are boys, then 52% are girls (100% - 48% = 52%). Find 52% of 600: 50% = 300, and 2% = 12, so 52% = 312 girls. ✓"
          },
          {
            id: 30,
            question: "Which has the smallest value? 15% of 300, 18% of 250, or 12% of 400?",
            options: ["15% of 300", "18% of 250", "12% of 400", "They are all equal", "Cannot tell"],
            correct: 1,
            explanation: "Calculate each: 15% of 300 = 45; 18% of 250 = 45; 12% of 400 = 48. Both 15% of 300 and 18% of 250 equal 45, which is smallest. ✓"
          },
          {
            id: 31,
            question: "A recipe needs 250g of flour. Tom only wants to make 60% of the recipe. How much flour does he need?",
            options: ["120g", "130g", "140g", "150g", "160g"],
            correct: 3,
            explanation: "Find 60% of 250g: 10% = 25g, so 60% = 25g × 6 = 150g. ✓"
          },
          {
            id: 32,
            question: "A store sells 180 items in a week. 20% were sold on Saturday. How many items were sold on Saturday?",
            options: ["30", "32", "34", "36", "38"],
            correct: 3,
            explanation: "Find 20% of 180: 10% of 180 = 18, so 20% = 18 × 2 = 36 items. ✓"
          },
          {
            id: 33,
            question: "What percentage is 24 out of 96?",
            options: ["20%", "22%", "24%", "25%", "30%"],
            correct: 3,
            explanation: "Calculate: (24 ÷ 96) × 100. Simplify: 24/96 = 1/4 = 0.25. Then 0.25 × 100 = 25%. ✓"
          },
          {
            id: 34,
            question: "A library has 540 books. After buying more books, it has 15% more than before. How many books does it have now?",
            options: ["555", "595", "615", "621", "635"],
            correct: 3,
            explanation: "Find 15% of 540: 10% = 54, and 5% = 27, so 15% = 81. Add to original: 540 + 81 = 621 books. ✓"
          },
          {
            id: 35,
            question: "In a fruit bowl with 80 pieces of fruit, 35% are apples and 25% are oranges. How many are neither apples nor oranges?",
            options: ["28", "30", "32", "34", "36"],
            correct: 2,
            explanation: "Apples and oranges together = 35% + 25% = 60%. So neither = 40% (100% - 60%). Find 40% of 80: 10% = 8, so 40% = 32 pieces of fruit. ✓"
          }
        ]
      }
      ,
      decimals: {
  name: "Decimals",
  questions: [
    {
      id: 1,
      question: "Which of these numbers is the largest? 3.7, 3.07, 3.77, 3.70, 3.17",
      options: ["3.7", "3.07", "3.77", "3.70", "3.17"],
      correct: 2,
      explanation: "Compare the digits: 3.77 has 7 tenths and 7 hundredths, making it larger than 3.7 (which is 3.70). 3.77 is the largest. ✓"
    },
    {
      id: 2,
      question: "What is 4.6 + 2.8?",
      options: ["6.4", "7.2", "7.4", "6.14", "7.14"],
      correct: 2,
      explanation: "Add the whole numbers: 4 + 2 = 6. Add the decimals: 0.6 + 0.8 = 1.4. So 6 + 1.4 = 7.4. ✓"
    },
    {
      id: 3,
      question: "What is 8.5 - 3.2?",
      options: ["5.3", "5.7", "4.3", "6.3", "11.7"],
      correct: 0,
      explanation: "Subtract the whole numbers: 8 - 3 = 5. Subtract the decimals: 0.5 - 0.2 = 0.3. So 5 + 0.3 = 5.3. ✓"
    },
    {
      id: 4,
      question: "Which number is closest to 5? 4.89, 5.12, 4.95, 5.08, 4.78",
      options: ["4.89", "5.12", "4.95", "5.08", "4.78"],
      correct: 2,
      explanation: "Find the distance from 5 for each: 4.89 is 0.11 away, 5.12 is 0.12 away, 4.95 is 0.05 away, 5.08 is 0.08 away, 4.78 is 0.22 away. The smallest distance is 0.05, so 4.95 is closest to 5. ✓"
    },
    {
      id: 5,
      question: "What is 0.6 × 10?",
      options: ["0.06", "6", "60", "0.6", "6.0"],
      correct: 1,
      explanation: "When multiplying by 10, move the decimal point one place to the right. 0.6 × 10 = 6. ✓"
    },
    {
      id: 6,
      question: "What is 4.5 ÷ 10?",
      options: ["0.45", "0.045", "45", "4.5", "0.0045"],
      correct: 0,
      explanation: "When dividing by 10, move the decimal point one place to the left. 4.5 ÷ 10 = 0.45. ✓"
    },
    {
      id: 7,
      question: "What is 3.2 × 4?",
      options: ["12.8", "12.4", "13.2", "11.8", "12.2"],
      correct: 0,
      explanation: "Multiply 32 × 4 = 128. Since 3.2 has one decimal place, the answer is 12.8. Or think: 3 × 4 = 12, and 0.2 × 4 = 0.8, so 12 + 0.8 = 12.8. ✓"
    },
    {
      id: 8,
      question: "Which decimal is equivalent to 3/4?",
      options: ["0.25", "0.5", "0.75", "0.8", "0.34"],
      correct: 2,
      explanation: "3/4 means 3 ÷ 4 = 0.75. Or think: 1/4 = 0.25, so 3/4 = 3 × 0.25 = 0.75. ✓"
    },
    {
      id: 9,
      question: "Put these in order from smallest to largest: 0.6, 0.06, 0.66, 0.606",
      options: ["0.06, 0.6, 0.606, 0.66", "0.06, 0.606, 0.6, 0.66", "0.6, 0.06, 0.606, 0.66", "0.606, 0.06, 0.6, 0.66", "0.06, 0.6, 0.66, 0.606"],
      correct: 0,
      explanation: "Compare place values: 0.06 (6 hundredths), 0.6 (60 hundredths), 0.606 (60.6 hundredths), 0.66 (66 hundredths). Order: 0.06, 0.6, 0.606, 0.66. ✓"
    },
    {
      id: 10,
      question: "What is 7.2 ÷ 4?",
      options: ["1.6", "1.8", "2.0", "2.2", "2.8"],
      correct: 1,
      explanation: "7.2 ÷ 4: Think 72 ÷ 4 = 18, so 7.2 ÷ 4 = 1.8. Or: 4 goes into 7.2 exactly 1.8 times. ✓"
    },
    {
      id: 11,
      question: "A bottle contains 1.5 litres of juice. How many millilitres is this?",
      options: ["15 ml", "150 ml", "1500 ml", "15000 ml", "1.5 ml"],
      correct: 2,
      explanation: "1 litre = 1000 millilitres. So 1.5 litres = 1.5 × 1000 = 1500 ml. ✓"
    },
    {
      id: 12,
      question: "What is 5.8 + 3.6?",
      options: ["8.4", "9.2", "9.4", "8.14", "9.14"],
      correct: 2,
      explanation: "5.8 + 3.6: Add whole numbers: 5 + 3 = 8. Add decimals: 0.8 + 0.6 = 1.4. So 8 + 1.4 = 9.4. ✓"
    },
    {
      id: 13,
      question: "Round 7.68 to one decimal place.",
      options: ["7.6", "7.7", "8.0", "7.8", "7.0"],
      correct: 1,
      explanation: "Look at the second decimal place: 8. Since 8 ≥ 5, round up. 7.68 rounds to 7.7. ✓"
    },
    {
      id: 14,
      question: "What is 0.8 × 0.5?",
      options: ["0.4", "0.04", "4", "1.3", "0.13"],
      correct: 0,
      explanation: "0.8 × 0.5: Think 8 × 5 = 40. Count decimal places: two places total, so answer is 0.40 = 0.4. ✓"
    },
    {
      id: 15,
      question: "Which is the smallest? 2.09, 2.9, 2.19, 2.99, 2.90",
      options: ["2.09", "2.9", "2.19", "2.99", "2.90"],
      correct: 0,
      explanation: "Compare tenths place first: 2.09 has 0 tenths, making it 2.09. 2.19 has 1 tenth = 2.19. 2.9, 2.90, 2.99 all have 9 tenths. So 2.09 is smallest. ✓"
    },
    {
      id: 16,
      question: "A pencil costs £0.35 and a ruler costs £0.68. What is the total cost?",
      options: ["£0.93", "£1.03", "£0.103", "£1.13", "£0.33"],
      correct: 1,
      explanation: "Add: £0.35 + £0.68. 35p + 68p = 103p = £1.03. ✓"
    },
    {
      id: 17,
      question: "What is 12 ÷ 5?",
      options: ["2.2", "2.4", "2.5", "2.6", "3"],
      correct: 1,
      explanation: "12 ÷ 5 = 2 remainder 2. The remainder 2 out of 5 = 2/5 = 0.4. So 12 ÷ 5 = 2.4. ✓"
    },
    {
      id: 18,
      question: "What is 0.25 as a percentage?",
      options: ["2.5%", "25%", "250%", "0.25%", "2500%"],
      correct: 1,
      explanation: "To convert decimal to percentage, multiply by 100. 0.25 × 100 = 25%. ✓"
    },
    {
      id: 19,
      question: "What is 15.4 - 8.7?",
      options: ["6.3", "6.7", "7.3", "7.7", "6.9"],
      correct: 1,
      explanation: "15.4 - 8.7: Subtract carefully. 15.4 - 8.7 = 14.14 - 8.7 = 6.7. Or: 15.4 - 8 = 7.4, then 7.4 - 0.7 = 6.7. ✓"
    },
    {
      id: 20,
      question: "A rope is 3.75 metres long. It is cut into 5 equal pieces. How long is each piece?",
      options: ["0.65 m", "0.70 m", "0.75 m", "0.80 m", "0.85 m"],
      correct: 2,
      explanation: "Divide: 3.75 ÷ 5 = 0.75 metres. Check: 0.75 × 5 = 3.75. ✓"
    },
    {
      id: 21,
      question: "What is 6.5 × 0.2?",
      options: ["1.2", "1.3", "1.4", "1.5", "13"],
      correct: 1,
      explanation: "6.5 × 0.2: Think 65 × 2 = 130. Two decimal places total, so answer is 1.30 = 1.3. Or: 0.2 is 1/5, so 6.5 ÷ 5 = 1.3. ✓"
    },
    {
      id: 22,
      question: "Which decimal is equivalent to 2/5?",
      options: ["0.2", "0.25", "0.4", "0.5", "0.8"],
      correct: 2,
      explanation: "2/5 means 2 ÷ 5 = 0.4. Or: 1/5 = 0.2, so 2/5 = 2 × 0.2 = 0.4. ✓"
    },
    {
      id: 23,
      question: "What is 4.8 × 100?",
      options: ["48", "480", "4800", "0.48", "0.048"],
      correct: 1,
      explanation: "When multiplying by 100, move the decimal point two places to the right. 4.8 × 100 = 480. ✓"
    },
    {
      id: 24,
      question: "Round 3.456 to two decimal places.",
      options: ["3.4", "3.45", "3.46", "3.5", "3.50"],
      correct: 2,
      explanation: "Look at the third decimal place: 6. Since 6 ≥ 5, round up. 3.456 rounds to 3.46. ✓"
    },
    {
      id: 25,
      question: "Sarah runs 2.4 km on Monday and 3.8 km on Tuesday. How far does she run in total?",
      options: ["5.2 km", "5.12 km", "6.2 km", "6.12 km", "5.8 km"],
      correct: 2,
      explanation: "Add: 2.4 + 3.8 = 6.2 km. (2 + 3 = 5, and 0.4 + 0.8 = 1.2, so 5 + 1.2 = 6.2). ✓"
    },
    {
      id: 26,
      question: "What is 9 ÷ 4?",
      options: ["2.15", "2.20", "2.25", "2.30", "2.50"],
      correct: 2,
      explanation: "9 ÷ 4 = 2 remainder 1. The remainder 1 out of 4 = 1/4 = 0.25. So 9 ÷ 4 = 2.25. ✓"
    },
    {
      id: 27,
      question: "What is 0.6 ÷ 0.2?",
      options: ["0.3", "3", "30", "0.03", "1.2"],
      correct: 1,
      explanation: "0.6 ÷ 0.2: How many 0.2s fit into 0.6? Think: 6 ÷ 2 = 3. The answer is 3. ✓"
    },
    {
      id: 28,
      question: "A book costs £8.45 and a pen costs £1.28. What is the total cost?",
      options: ["£9.63", "£9.73", "£9.83", "£10.73", "£7.17"],
      correct: 1,
      explanation: "Add: £8.45 + £1.28. Line up decimals: 8.45 + 1.28 = 9.73. ✓"
    },
    {
      id: 29,
      question: "What is 7.5 ÷ 100?",
      options: ["0.75", "0.075", "750", "75", "0.0075"],
      correct: 1,
      explanation: "When dividing by 100, move the decimal point two places to the left. 7.5 ÷ 100 = 0.075. ✓"
    },
    {
      id: 30,
      question: "Which of these equals 0.5? 1/5, 2/5, 3/5, 1/2, 2/3",
      options: ["1/5", "2/5", "3/5", "1/2", "2/3"],
      correct: 3,
      explanation: "0.5 means 5 tenths = 5/10 = 1/2. Check: 1 ÷ 2 = 0.5. ✓"
    },
    {
      id: 31,
      question: "What is 0.9 × 0.9?",
      options: ["0.18", "0.81", "1.8", "8.1", "0.081"],
      correct: 1,
      explanation: "0.9 × 0.9: Think 9 × 9 = 81. Two decimal places total, so answer is 0.81. ✓"
    },
    {
      id: 32,
      question: "Tom has £10. He spends £3.65. How much money does he have left?",
      options: ["£6.35", "£6.45", "£7.35", "£13.65", "£6.65"],
      correct: 0,
      explanation: "Subtract: £10.00 - £3.65 = £6.35. ✓"
    },
    {
      id: 33,
      question: "What is 2.5 × 8?",
      options: ["16", "18", "20", "22", "24"],
      correct: 2,
      explanation: "2.5 × 8: Think 2 × 8 = 16, and 0.5 × 8 = 4, so 16 + 4 = 20. Or: 25 × 8 = 200, with one decimal place = 20.0 = 20. ✓"
    },
    {
      id: 34,
      question: "A bag of apples weighs 1.2 kg. What is this weight in grams?",
      options: ["12 g", "120 g", "1200 g", "12000 g", "1.2 g"],
      correct: 2,
      explanation: "1 kilogram = 1000 grams. So 1.2 kg = 1.2 × 1000 = 1200 g. ✓"
    },
    {
      id: 35,
      question: "What is 5.4 ÷ 0.6?",
      options: ["0.9", "9", "90", "0.09", "3.2"],
      correct: 1,
      explanation: "5.4 ÷ 0.6: How many 0.6s fit into 5.4? Think: 54 ÷ 6 = 9. The answer is 9. Check: 9 × 0.6 = 5.4. ✓"
    }
  ]
}
,
longdivision: {
  name: "Long Division",
  questions: [
    {
      id: 1,
      question: "What is 144 ÷ 12?",
      options: ["10", "11", "12", "13", "14"],
      correct: 2,
      explanation: "Divide: 12 goes into 144 exactly 12 times. Check: 12 × 12 = 144. ✓"
    },
    {
      id: 2,
      question: "What is 375 ÷ 15?",
      options: ["20", "23", "25", "27", "30"],
      correct: 2,
      explanation: "15 goes into 37 twice (15 × 2 = 30), remainder 7. Bring down 5 to make 75. 15 goes into 75 five times (15 × 5 = 75). Answer: 25. ✓"
    },
    {
      id: 3,
      question: "What is 456 ÷ 24?",
      options: ["17", "18", "19", "20", "21"],
      correct: 2,
      explanation: "24 goes into 45 once (24 × 1 = 24), remainder 21. Bring down 6 to make 216. 24 goes into 216 nine times (24 × 9 = 216). Answer: 19. ✓"
    },
    {
      id: 4,
      question: "A coach can carry 48 passengers. How many coaches are needed to carry 336 passengers?",
      options: ["6", "7", "8", "9", "10"],
      correct: 1,
      explanation: "Divide: 336 ÷ 48 = 7. Check: 48 × 7 = 336. So 7 coaches are needed. ✓"
    },
    {
      id: 5,
      question: "What is 624 ÷ 26?",
      options: ["22", "23", "24", "25", "26"],
      correct: 2,
      explanation: "26 goes into 62 twice (26 × 2 = 52), remainder 10. Bring down 4 to make 104. 26 goes into 104 four times (26 × 4 = 104). Answer: 24. ✓"
    },
    {
      id: 6,
      question: "What is 540 ÷ 18?",
      options: ["28", "29", "30", "31", "32"],
      correct: 2,
      explanation: "18 goes into 54 three times (18 × 3 = 54), remainder 0. Bring down 0 to make 00. Answer: 30. ✓"
    },
    {
      id: 7,
      question: "A gardener plants 420 seeds in trays. Each tray holds 35 seeds. How many trays does he use?",
      options: ["10", "11", "12", "13", "14"],
      correct: 2,
      explanation: "Divide: 420 ÷ 35 = 12. Check: 35 × 12 = 420. So 12 trays are used. ✓"
    },
    {
      id: 8,
      question: "What is 672 ÷ 21?",
      options: ["30", "31", "32", "33", "34"],
      correct: 2,
      explanation: "21 goes into 67 three times (21 × 3 = 63), remainder 4. Bring down 2 to make 42. 21 goes into 42 twice (21 × 2 = 42). Answer: 32. ✓"
    },
    {
      id: 9,
      question: "What is 736 ÷ 32?",
      options: ["21", "22", "23", "24", "25"],
      correct: 2,
      explanation: "32 goes into 73 twice (32 × 2 = 64), remainder 9. Bring down 6 to make 96. 32 goes into 96 three times (32 × 3 = 96). Answer: 23. ✓"
    },
    {
      id: 10,
      question: "Cricket balls are packed in boxes of 12. John has 156 cricket balls. How many boxes can he fill completely?",
      options: ["11", "12", "13", "14", "15"],
      correct: 2,
      explanation: "Divide: 156 ÷ 12 = 13. Check: 12 × 13 = 156. John can fill 13 boxes completely. ✓"
    },
    {
      id: 11,
      question: "What is 812 ÷ 28?",
      options: ["27", "28", "29", "30", "31"],
      correct: 2,
      explanation: "28 goes into 81 twice (28 × 2 = 56), remainder 25. Bring down 2 to make 252. 28 goes into 252 nine times (28 × 9 = 252). Answer: 29. ✓"
    },
    {
      id: 12,
      question: "What is 945 ÷ 27?",
      options: ["33", "34", "35", "36", "37"],
      correct: 2,
      explanation: "27 goes into 94 three times (27 × 3 = 81), remainder 13. Bring down 5 to make 135. 27 goes into 135 five times (27 × 5 = 135). Answer: 35. ✓"
    },
    {
      id: 13,
      question: "A rope 840 cm long is cut into 24 equal pieces. How long is each piece?",
      options: ["33 cm", "34 cm", "35 cm", "36 cm", "37 cm"],
      correct: 2,
      explanation: "Divide: 840 ÷ 24 = 35 cm. Check: 24 × 35 = 840. ✓"
    },
    {
      id: 14,
      question: "What is 966 ÷ 42?",
      options: ["21", "22", "23", "24", "25"],
      correct: 2,
      explanation: "42 goes into 96 twice (42 × 2 = 84), remainder 12. Bring down 6 to make 126. 42 goes into 126 three times (42 × 3 = 126). Answer: 23. ✓"
    },
    {
      id: 15,
      question: "What is 780 ÷ 26?",
      options: ["28", "29", "30", "31", "32"],
      correct: 2,
      explanation: "26 goes into 78 three times (26 × 3 = 78), remainder 0. Bring down 0 to make 00. Answer: 30. ✓"
    },
    {
      id: 16,
      question: "Pencils are sold in packs of 16. A school orders 448 pencils. How many packs is this?",
      options: ["26", "27", "28", "29", "30"],
      correct: 2,
      explanation: "Divide: 448 ÷ 16 = 28. Check: 16 × 28 = 448. So 28 packs. ✓"
    },
    {
      id: 17,
      question: "What is 1044 ÷ 36?",
      options: ["27", "28", "29", "30", "31"],
      correct: 2,
      explanation: "36 goes into 104 twice (36 × 2 = 72), remainder 32. Bring down 4 to make 324. 36 goes into 324 nine times (36 × 9 = 324). Answer: 29. ✓"
    },
    {
      id: 18,
      question: "What is 588 ÷ 14?",
      options: ["40", "41", "42", "43", "44"],
      correct: 2,
      explanation: "14 goes into 58 four times (14 × 4 = 56), remainder 2. Bring down 8 to make 28. 14 goes into 28 twice (14 × 2 = 28). Answer: 42. ✓"
    },
    {
      id: 19,
      question: "A farmer packs 792 eggs into boxes of 36. How many boxes does he need?",
      options: ["20", "21", "22", "23", "24"],
      correct: 2,
      explanation: "Divide: 792 ÷ 36 = 22. Check: 36 × 22 = 792. So 22 boxes. ✓"
    },
    {
      id: 20,
      question: "What is 1140 ÷ 38?",
      options: ["28", "29", "30", "31", "32"],
      correct: 2,
      explanation: "38 goes into 114 three times (38 × 3 = 114), remainder 0. Bring down 0 to make 00. Answer: 30. ✓"
    },
    {
      id: 21,
      question: "What is 851 ÷ 23?",
      options: ["35", "36", "37", "38", "39"],
      correct: 2,
      explanation: "23 goes into 85 three times (23 × 3 = 69), remainder 16. Bring down 1 to make 161. 23 goes into 161 seven times (23 × 7 = 161). Answer: 37. ✓"
    },
    {
      id: 22,
      question: "Books are arranged in boxes of 45. There are 1080 books. How many boxes are there?",
      options: ["22", "23", "24", "25", "26"],
      correct: 2,
      explanation: "Divide: 1080 ÷ 45 = 24. Check: 45 × 24 = 1080. So 24 boxes. ✓"
    },
    {
      id: 23,
      question: "What is 1224 ÷ 34?",
      options: ["34", "35", "36", "37", "38"],
      correct: 2,
      explanation: "34 goes into 122 three times (34 × 3 = 102), remainder 20. Bring down 4 to make 204. 34 goes into 204 six times (34 × 6 = 204). Answer: 36. ✓"
    },
    {
      id: 24,
      question: "What is 912 ÷ 16?",
      options: ["55", "56", "57", "58", "59"],
      correct: 2,
      explanation: "16 goes into 91 five times (16 × 5 = 80), remainder 11. Bring down 2 to make 112. 16 goes into 112 seven times (16 × 7 = 112). Answer: 57. ✓"
    },
    {
      id: 25,
      question: "A school trip costs £1560 in total. There are 52 students. How much does each student pay?",
      options: ["£28", "£29", "£30", "£31", "£32"],
      correct: 2,
      explanation: "Divide: £1560 ÷ 52 = £30. Check: 52 × £30 = £1560. Each student pays £30. ✓"
    },
    {
      id: 26,
      question: "What is 1368 ÷ 38?",
      options: ["34", "35", "36", "37", "38"],
      correct: 2,
      explanation: "38 goes into 136 three times (38 × 3 = 114), remainder 22. Bring down 8 to make 228. 38 goes into 228 six times (38 × 6 = 228). Answer: 36. ✓"
    },
    {
      id: 27,
      question: "Sweets are packed in bags of 48. A factory produces 1392 sweets. How many bags can be filled?",
      options: ["27", "28", "29", "30", "31"],
      correct: 2,
      explanation: "Divide: 1392 ÷ 48 = 29. Check: 48 × 29 = 1392. So 29 bags can be filled. ✓"
    },
    {
      id: 28,
      question: "What is 1575 ÷ 45?",
      options: ["33", "34", "35", "36", "37"],
      correct: 2,
      explanation: "45 goes into 157 three times (45 × 3 = 135), remainder 22. Bring down 5 to make 225. 45 goes into 225 five times (45 × 5 = 225). Answer: 35. ✓"
    },
    {
      id: 29,
      question: "What is 1764 ÷ 42?",
      options: ["40", "41", "42", "43", "44"],
      correct: 2,
      explanation: "42 goes into 176 four times (42 × 4 = 168), remainder 8. Bring down 4 to make 84. 42 goes into 84 twice (42 × 2 = 84). Answer: 42. ✓"
    },
    {
      id: 30,
      question: "A charity raises £2016. They split it equally between 56 families. How much does each family receive?",
      options: ["£34", "£35", "£36", "£37", "£38"],
      correct: 2,
      explanation: "Divide: £2016 ÷ 56 = £36. Check: 56 × £36 = £2016. Each family receives £36. ✓"
    }
  ]
}
,
ratio: {
  name: "Ratio & Proportion",
  questions: [
    {
      id: 1,
      question: "In a class of 30 children, the ratio of boys to girls is 3:2. How many boys are there?",
      options: ["12", "15", "18", "20", "24"],
      correct: 2,
      explanation: "The ratio 3:2 means 5 equal parts total (3+2=5). Divide 30 by 5 = 6 per part. Boys = 3 parts = 3 × 6 = 18 boys. ✓"
    },
    {
      id: 2,
      question: "Tom and Jerry share 80 marbles in the ratio 3:5. How many marbles does Jerry get?",
      options: ["30", "35", "40", "45", "50"],
      correct: 4,
      explanation: "Total parts: 3 + 5 = 8 parts. Each part = 80 ÷ 8 = 10 marbles. Jerry gets 5 parts = 5 × 10 = 50 marbles. ✓"
    },
    {
      id: 3,
      question: "A recipe for 4 people uses 200g of flour. How much flour is needed for 10 people?",
      options: ["400g", "450g", "500g", "550g", "600g"],
      correct: 2,
      explanation: "For 1 person: 200 ÷ 4 = 50g. For 10 people: 50 × 10 = 500g. ✓"
    },
    {
      id: 4,
      question: "The ratio of cats to dogs at a vet is 5:3. If there are 15 cats, how many dogs are there?",
      options: ["6", "9", "12", "15", "18"],
      correct: 1,
      explanation: "If 5 parts = 15 cats, then 1 part = 3. Dogs = 3 parts = 3 × 3 = 9 dogs. ✓"
    },
    {
      id: 5,
      question: "Red paint and blue paint are mixed in the ratio 2:3 to make purple. If 6 litres of red paint are used, how much blue paint is needed?",
      options: ["4 litres", "6 litres", "8 litres", "9 litres", "12 litres"],
      correct: 3,
      explanation: "If 2 parts = 6 litres, then 1 part = 3 litres. Blue = 3 parts = 3 × 3 = 9 litres. ✓"
    },
    {
      id: 6,
      question: "A car travels 60 miles in 1 hour. At the same speed, how far will it travel in 3.5 hours?",
      options: ["180 miles", "200 miles", "210 miles", "240 miles", "250 miles"],
      correct: 2,
      explanation: "Distance per hour = 60 miles. For 3.5 hours: 60 × 3.5 = 210 miles. ✓"
    },
    {
      id: 7,
      question: "Andrew and Matthew share 96 sweets in the ratio 5:3. How many more sweets does Andrew get than Matthew?",
      options: ["12", "18", "24", "30", "36"],
      correct: 2,
      explanation: "Total parts: 5 + 3 = 8. Each part = 96 ÷ 8 = 12. Andrew gets 5 × 12 = 60, Matthew gets 3 × 12 = 36. Difference: 60 - 36 = 24. ✓"
    },
    {
      id: 8,
      question: "A recipe for 6 biscuits uses 150g of butter. How much butter is needed for 20 biscuits?",
      options: ["400g", "450g", "500g", "550g", "600g"],
      correct: 2,
      explanation: "For 1 biscuit: 150 ÷ 6 = 25g. For 20 biscuits: 25 × 20 = 500g. ✓"
    },
    {
      id: 9,
      question: "In a fruit bowl, the ratio of apples to oranges is 4:1. If there are 20 apples, how many oranges are there?",
      options: ["4", "5", "8", "10", "16"],
      correct: 1,
      explanation: "If 4 parts = 20 apples, then 1 part = 5. Oranges = 1 part = 5 oranges. ✓"
    },
    {
      id: 10,
      question: "A milkshake recipe uses 4 spoonfuls of syrup for 300ml of milk. How many spoonfuls are needed for 750ml of milk?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "750ml is 2.5 times 300ml (750 ÷ 300 = 2.5). So syrup needed = 4 × 2.5 = 10 spoonfuls. ✓"
    },
    {
      id: 11,
      question: "The ratio of boys to girls in a swimming class is 2:5. If there are 35 children, how many are girls?",
      options: ["10", "15", "20", "25", "30"],
      correct: 3,
      explanation: "Total parts: 2 + 5 = 7. Each part = 35 ÷ 7 = 5. Girls = 5 parts = 5 × 5 = 25 girls. ✓"
    },
    {
      id: 12,
      question: "A map scale is 1cm : 5km. A distance on the map is 8cm. What is the actual distance?",
      options: ["35 km", "40 km", "45 km", "50 km", "55 km"],
      correct: 1,
      explanation: "If 1 cm = 5 km, then 8 cm = 8 × 5 = 40 km. ✓"
    },
    {
      id: 13,
      question: "A recipe for 10 shortbread biscuits uses 150g flour. Oliver wants to make 25 biscuits. How much flour does he need?",
      options: ["325g", "350g", "375g", "400g", "425g"],
      correct: 2,
      explanation: "25 is 2.5 times 10 (25 ÷ 10 = 2.5). Flour needed = 150 × 2.5 = 375g. ✓"
    },
    {
      id: 14,
      question: "Lemon squash and water are mixed in the ratio 1:4. If 5 litres of lemon squash is used, how much water is needed?",
      options: ["15 litres", "20 litres", "25 litres", "30 litres", "35 litres"],
      correct: 1,
      explanation: "If 1 part = 5 litres, then water = 4 parts = 4 × 5 = 20 litres. ✓"
    },
    {
      id: 15,
      question: "A photocopier makes 12 copies in 3 minutes. How many copies can it make in 15 minutes?",
      options: ["48", "52", "56", "60", "64"],
      correct: 3,
      explanation: "Copies per minute = 12 ÷ 3 = 4. In 15 minutes: 4 × 15 = 60 copies. ✓"
    },
    {
      id: 16,
      question: "The ratio of red balls to blue balls in a bag is 7:3. If there are 21 red balls, how many blue balls are there?",
      options: ["6", "9", "12", "15", "18"],
      correct: 1,
      explanation: "If 7 parts = 21 red balls, then 1 part = 3. Blue balls = 3 parts = 3 × 3 = 9 balls. ✓"
    },
    {
      id: 17,
      question: "A box of chocolates weighs 240g and contains 20 chocolates. What is the average weight of one chocolate?",
      options: ["10g", "11g", "12g", "13g", "14g"],
      correct: 2,
      explanation: "Weight per chocolate = 240 ÷ 20 = 12g. ✓"
    },
    {
      id: 18,
      question: "Sam and Lucy share £120 in the ratio 2:3. How much does Lucy receive?",
      options: ["£48", "£60", "£72", "£80", "£90"],
      correct: 2,
      explanation: "Total parts: 2 + 3 = 5. Each part = £120 ÷ 5 = £24. Lucy gets 3 parts = 3 × £24 = £72. ✓"
    },
    {
      id: 19,
      question: "A recipe for 8 pancakes uses 2 eggs. How many eggs are needed for 28 pancakes?",
      options: ["5", "6", "7", "8", "9"],
      correct: 2,
      explanation: "28 is 3.5 times 8 (28 ÷ 8 = 3.5). Eggs needed = 2 × 3.5 = 7 eggs. ✓"
    },
    {
      id: 20,
      question: "In a parking lot, the ratio of cars to vans is 9:2. If there are 18 cars, how many vans are there?",
      options: ["2", "3", "4", "5", "6"],
      correct: 2,
      explanation: "If 9 parts = 18 cars, then 1 part = 2. Vans = 2 parts = 2 × 2 = 4 vans. ✓"
    },
    {
      id: 21,
      question: "A train travels 180 miles in 2 hours. At the same speed, how far will it travel in 5 hours?",
      options: ["400 miles", "425 miles", "450 miles", "475 miles", "500 miles"],
      correct: 2,
      explanation: "Speed = 180 ÷ 2 = 90 miles per hour. In 5 hours: 90 × 5 = 450 miles. ✓"
    },
    {
      id: 22,
      question: "Orange juice and lemonade are mixed in the ratio 3:7. If 30ml of orange juice is used, how much lemonade is needed?",
      options: ["50ml", "60ml", "70ml", "80ml", "90ml"],
      correct: 2,
      explanation: "If 3 parts = 30ml, then 1 part = 10ml. Lemonade = 7 parts = 7 × 10 = 70ml. ✓"
    },
    {
      id: 23,
      question: "The ratio of teachers to students in a school is 1:20. If there are 6 teachers, how many students are there?",
      options: ["100", "110", "120", "130", "140"],
      correct: 2,
      explanation: "If 1 part = 6 teachers, then students = 20 parts = 20 × 6 = 120 students. ✓"
    },
    {
      id: 24,
      question: "A recipe for 5 cupcakes uses 125g of sugar. How much sugar is needed for 12 cupcakes?",
      options: ["250g", "275g", "300g", "325g", "350g"],
      correct: 2,
      explanation: "Sugar per cupcake = 125 ÷ 5 = 25g. For 12 cupcakes: 25 × 12 = 300g. ✓"
    },
    {
      id: 25,
      question: "Amy and Ben split prize money in the ratio 4:1. If Amy receives £60, how much does Ben receive?",
      options: ["£10", "£12", "£15", "£18", "£20"],
      correct: 2,
      explanation: "If 4 parts = £60, then 1 part = £15. Ben gets 1 part = £15. ✓"
    },
    {
      id: 26,
      question: "A model of a building is made to scale 1:50. If the model is 60cm tall, how tall is the real building in metres?",
      options: ["20m", "25m", "30m", "35m", "40m"],
      correct: 2,
      explanation: "Real height = 60 × 50 = 3000cm = 30 metres. ✓"
    },
    {
      id: 27,
      question: "In a bag of counters, red and yellow are in the ratio 5:8. If there are 40 red counters, how many yellow counters are there?",
      options: ["48", "56", "64", "72", "80"],
      correct: 2,
      explanation: "If 5 parts = 40 red, then 1 part = 8. Yellow = 8 parts = 8 × 8 = 64 counters. ✓"
    },
    {
      id: 28,
      question: "A recipe uses butter and flour in the ratio 1:3. If 80g of butter is used, how much flour is needed?",
      options: ["200g", "220g", "240g", "260g", "280g"],
      correct: 2,
      explanation: "If 1 part = 80g, then flour = 3 parts = 3 × 80 = 240g. ✓"
    },
    {
      id: 29,
      question: "The scale on a map is 1cm : 25km. Two towns are 7cm apart on the map. What is the actual distance?",
      options: ["150 km", "160 km", "170 km", "175 km", "180 km"],
      correct: 3,
      explanation: "If 1 cm = 25 km, then 7 cm = 7 × 25 = 175 km. ✓"
    },
    {
      id: 30,
      question: "Sarah and Tom divide 144 stickers in the ratio 7:5. How many stickers does Sarah get?",
      options: ["60", "72", "84", "96", "108"],
      correct: 2,
      explanation: "Total parts: 7 + 5 = 12. Each part = 144 ÷ 12 = 12. Sarah gets 7 parts = 7 × 12 = 84 stickers. ✓"
    }
  ]
}
,
fractions: {
  name: "Fractions",
  questions: [
    {
      id: 1,
      question: "What is 1/4 + 1/4?",
      options: ["1/8", "1/2", "2/4", "2/8", "1/4"],
      correct: 1,
      explanation: "1/4 + 1/4 = 2/4. Simplify: 2/4 = 1/2. ✓"
    },
    {
      id: 2,
      question: "Which fraction is equivalent to 3/6?",
      options: ["1/3", "1/2", "2/3", "3/4", "2/4"],
      correct: 1,
      explanation: "Simplify 3/6 by dividing both numbers by 3: 3÷3 = 1 and 6÷3 = 2, so 3/6 = 1/2. ✓"
    },
    {
      id: 3,
      question: "What is 3/4 of 20?",
      options: ["12", "15", "16", "18", "20"],
      correct: 1,
      explanation: "Find 1/4 of 20 first: 20 ÷ 4 = 5. Then 3/4 = 3 × 5 = 15. ✓"
    },
    {
      id: 4,
      question: "Which of these fractions is the largest? 2/5, 3/10, 1/2, 3/5, 4/10",
      options: ["2/5", "3/10", "1/2", "3/5", "4/10"],
      correct: 3,
      explanation: "Convert to tenths: 2/5 = 4/10, 3/10 = 3/10, 1/2 = 5/10, 3/5 = 6/10, 4/10 = 4/10. The largest is 6/10 = 3/5. ✓"
    },
    {
      id: 5,
      question: "What is 5/8 - 1/8?",
      options: ["4/8", "1/2", "6/8", "3/4", "4/16"],
      correct: 1,
      explanation: "Subtract: 5/8 - 1/8 = 4/8. Simplify: 4/8 = 1/2. ✓"
    },
    {
      id: 6,
      question: "Simplify 12/16.",
      options: ["6/8", "4/5", "3/4", "2/3", "1/2"],
      correct: 2,
      explanation: "Divide both by 4: 12÷4 = 3 and 16÷4 = 4, so 12/16 = 3/4. ✓"
    },
    {
      id: 7,
      question: "What is 2/3 of 18?",
      options: ["9", "10", "11", "12", "13"],
      correct: 3,
      explanation: "Find 1/3 of 18 first: 18 ÷ 3 = 6. Then 2/3 = 2 × 6 = 12. ✓"
    },
    {
      id: 8,
      question: "Which fraction is equivalent to 0.25?",
      options: ["1/2", "1/3", "1/4", "1/5", "2/5"],
      correct: 2,
      explanation: "0.25 = 25/100. Simplify: 25÷25 = 1 and 100÷25 = 4, so 0.25 = 1/4. ✓"
    },
    {
      id: 9,
      question: "What is 3/5 + 1/5?",
      options: ["2/5", "3/5", "4/5", "1", "4/10"],
      correct: 2,
      explanation: "Add the numerators: 3/5 + 1/5 = 4/5. ✓"
    },
    {
      id: 10,
      question: "A pizza is cut into 8 equal slices. Tom eats 3 slices. What fraction of the pizza is left?",
      options: ["3/8", "5/8", "1/2", "2/8", "3/5"],
      correct: 1,
      explanation: "Tom ate 3/8, so remaining = 8/8 - 3/8 = 5/8. ✓"
    },
    {
      id: 11,
      question: "Which is larger: 2/3 or 3/4?",
      options: ["2/3", "3/4", "They are equal", "Cannot tell", "Neither"],
      correct: 1,
      explanation: "Convert to twelfths: 2/3 = 8/12 and 3/4 = 9/12. Since 9/12 > 8/12, then 3/4 is larger. ✓"
    },
    {
      id: 12,
      question: "What is 1/2 + 1/4?",
      options: ["2/6", "2/4", "3/4", "1/3", "3/6"],
      correct: 2,
      explanation: "Convert to quarters: 1/2 = 2/4. Then 2/4 + 1/4 = 3/4. ✓"
    },
    {
      id: 13,
      question: "Simplify 18/24.",
      options: ["9/12", "6/8", "3/4", "2/3", "1/2"],
      correct: 2,
      explanation: "Divide both by 6: 18÷6 = 3 and 24÷6 = 4, so 18/24 = 3/4. ✓"
    },
    {
      id: 14,
      question: "What is 3/4 × 8?",
      options: ["4", "5", "6", "7", "8"],
      correct: 2,
      explanation: "3/4 × 8 = (3 × 8) ÷ 4 = 24 ÷ 4 = 6. Or: 1/4 of 8 = 2, so 3/4 of 8 = 6. ✓"
    },
    {
      id: 15,
      question: "Sarah has 35 paperback books and 20 hardback books. What fraction of her books are hardbacks?",
      options: ["2/5", "4/11", "4/7", "3/7", "1/2"],
      correct: 1,
      explanation: "Total books = 35 + 20 = 55. Hardbacks = 20/55. Simplify: 20÷5 = 4 and 55÷5 = 11, so 4/11. ✓"
    },
    {
      id: 16,
      question: "What is 7/10 - 2/10?",
      options: ["5/10", "1/2", "5/20", "9/10", "1/5"],
      correct: 1,
      explanation: "7/10 - 2/10 = 5/10. Simplify: 5/10 = 1/2. ✓"
    },
    {
      id: 17,
      question: "Which fraction is equivalent to 4/8?",
      options: ["1/4", "1/3", "1/2", "2/3", "3/4"],
      correct: 2,
      explanation: "Divide both by 4: 4÷4 = 1 and 8÷4 = 2, so 4/8 = 1/2. ✓"
    },
    {
      id: 18,
      question: "What is 2/5 of 30?",
      options: ["10", "12", "14", "15", "18"],
      correct: 1,
      explanation: "Find 1/5 of 30 first: 30 ÷ 5 = 6. Then 2/5 = 2 × 6 = 12. ✓"
    },
    {
      id: 19,
      question: "In a bag of 60 sweets, 15 are red. What fraction are red?",
      options: ["1/6", "1/5", "1/4", "1/3", "2/5"],
      correct: 2,
      explanation: "Red sweets = 15/60. Simplify: 15÷15 = 1 and 60÷15 = 4, so 1/4. ✓"
    },
    {
      id: 20,
      question: "What is 5/6 + 1/6?",
      options: ["5/6", "6/6", "1", "6/12", "1/3"],
      correct: 2,
      explanation: "5/6 + 1/6 = 6/6 = 1 whole. ✓"
    },
    {
      id: 21,
      question: "Which of these fractions is closest to 1? 7/8, 5/6, 9/10, 4/5, 11/12",
      options: ["7/8", "5/6", "9/10", "4/5", "11/12"],
      correct: 4,
      explanation: "Distance from 1: 7/8 = 1/8 away, 5/6 = 1/6 away, 9/10 = 1/10 away, 4/5 = 1/5 away, 11/12 = 1/12 away. Smallest distance is 1/12, so 11/12 is closest. ✓"
    },
    {
      id: 22,
      question: "What is 3/4 - 1/4?",
      options: ["1/4", "2/4", "1/2", "2/8", "3/8"],
      correct: 2,
      explanation: "3/4 - 1/4 = 2/4. Simplify: 2/4 = 1/2. ✓"
    },
    {
      id: 23,
      question: "Convert 0.6 to a fraction in its simplest form.",
      options: ["6/10", "3/5", "2/3", "5/8", "1/2"],
      correct: 1,
      explanation: "0.6 = 6/10. Simplify: 6÷2 = 3 and 10÷2 = 5, so 3/5. ✓"
    },
    {
      id: 24,
      question: "What is 5/12 + 1/12?",
      options: ["6/12", "1/2", "5/24", "6/24", "1/3"],
      correct: 1,
      explanation: "5/12 + 1/12 = 6/12. Simplify: 6/12 = 1/2. ✓"
    },
    {
      id: 25,
      question: "A chocolate bar has 24 pieces. Emily eats 1/3 of it. How many pieces does she eat?",
      options: ["6", "8", "10", "12", "16"],
      correct: 1,
      explanation: "1/3 of 24 = 24 ÷ 3 = 8 pieces. ✓"
    },
    {
      id: 26,
      question: "What is 2/3 + 1/6?",
      options: ["3/9", "3/6", "5/6", "1/2", "4/6"],
      correct: 2,
      explanation: "Convert to sixths: 2/3 = 4/6. Then 4/6 + 1/6 = 5/6. ✓"
    },
    {
      id: 27,
      question: "Simplify 20/30.",
      options: ["10/15", "4/6", "2/3", "5/8", "1/2"],
      correct: 2,
      explanation: "Divide both by 10: 20÷10 = 2 and 30÷10 = 3, so 20/30 = 2/3. ✓"
    },
    {
      id: 28,
      question: "What is 4/5 of 45?",
      options: ["32", "34", "36", "38", "40"],
      correct: 2,
      explanation: "Find 1/5 of 45 first: 45 ÷ 5 = 9. Then 4/5 = 4 × 9 = 36. ✓"
    },
    {
      id: 29,
      question: "Which fraction equals 75%?",
      options: ["1/2", "2/3", "3/4", "4/5", "7/10"],
      correct: 2,
      explanation: "75% = 75/100. Simplify: 75÷25 = 3 and 100÷25 = 4, so 3/4. ✓"
    },
    {
      id: 30,
      question: "What is 7/8 - 3/8?",
      options: ["4/8", "1/2", "3/8", "5/8", "4/16"],
      correct: 1,
      explanation: "7/8 - 3/8 = 4/8. Simplify: 4/8 = 1/2. ✓"
    },
    {
      id: 31,
      question: "In a test with 50 questions, Jake answered 40 correctly. What fraction did he get correct?",
      options: ["2/5", "3/5", "4/5", "8/10", "40/100"],
      correct: 2,
      explanation: "Correct = 40/50. Simplify: 40÷10 = 4 and 50÷10 = 5, so 4/5. ✓"
    },
    {
      id: 32,
      question: "What is 1/3 + 1/6?",
      options: ["2/9", "2/6", "1/2", "3/6", "1/3"],
      correct: 2,
      explanation: "Convert to sixths: 1/3 = 2/6. Then 2/6 + 1/6 = 3/6. Simplify: 3/6 = 1/2. ✓"
    },
    {
      id: 33,
      question: "Which is the smallest fraction? 1/3, 2/5, 3/8, 1/2, 3/10",
      options: ["1/3", "2/5", "3/8", "1/2", "3/10"],
      correct: 4,
      explanation: "Convert to common denominator (30ths): 1/3 = 10/30, 2/5 = 12/30, 3/8 = 11.25/30, 1/2 = 15/30, 3/10 = 9/30. Smallest is 9/30 = 3/10. ✓"
    },
    {
      id: 34,
      question: "What is 5/6 × 12?",
      options: ["8", "9", "10", "11", "12"],
      correct: 2,
      explanation: "5/6 × 12 = (5 × 12) ÷ 6 = 60 ÷ 6 = 10. Or: 1/6 of 12 = 2, so 5/6 of 12 = 10. ✓"
    },
    {
      id: 35,
      question: "A ribbon is 3/4 metre long. How many centimetres is this?",
      options: ["70 cm", "72 cm", "75 cm", "78 cm", "80 cm"],
      correct: 2,
      explanation: "1 metre = 100 cm. So 3/4 of 100 cm = 100 ÷ 4 × 3 = 25 × 3 = 75 cm. ✓"
    }
  ]
}
,
longmultiplication: {
  name: "Long Multiplication",
  questions: [
    {
      id: 1,
      question: "What is 23 × 14?",
      options: ["302", "312", "322", "332", "342"],
      correct: 2,
      explanation: "23 × 14: (23 × 10 = 230) + (23 × 4 = 92) = 230 + 92 = 322. ✓"
    },
    {
      id: 2,
      question: "What is 46 × 27?",
      options: ["1,142", "1,222", "1,242", "1,342", "1,442"],
      correct: 2,
      explanation: "46 × 27: (46 × 20 = 920) + (46 × 7 = 322) = 920 + 322 = 1,242. ✓"
    },
    {
      id: 3,
      question: "A box contains 36 chocolates. How many chocolates are in 15 boxes?",
      options: ["520", "530", "540", "550", "560"],
      correct: 2,
      explanation: "36 × 15 = 540. Check: 36 × 10 = 360, 36 × 5 = 180, so 360 + 180 = 540 chocolates. ✓"
    },
    {
      id: 4,
      question: "What is 58 × 32?",
      options: ["1,756", "1,826", "1,856", "1,926", "1,956"],
      correct: 2,
      explanation: "58 × 32: (58 × 30 = 1,740) + (58 × 2 = 116) = 1,740 + 116 = 1,856. ✓"
    },
    {
      id: 5,
      question: "What is 125 × 24?",
      options: ["2,900", "2,950", "3,000", "3,050", "3,100"],
      correct: 2,
      explanation: "125 × 24: (125 × 20 = 2,500) + (125 × 4 = 500) = 2,500 + 500 = 3,000. ✓"
    },
    {
      id: 6,
      question: "A school trip costs £37 per student. If 28 students go, what is the total cost?",
      options: ["£1,006", "£1,026", "£1,036", "£1,046", "£1,056"],
      correct: 2,
      explanation: "37 × 28 = £1,036. Check: 37 × 30 = 1,110, 37 × 2 = 74, so 1,110 - 74 = £1,036. ✓"
    },
    {
      id: 7,
      question: "What is 74 × 19?",
      options: ["1,306", "1,356", "1,406", "1,456", "1,506"],
      correct: 2,
      explanation: "74 × 19: (74 × 20 = 1,480) - (74 × 1 = 74) = 1,480 - 74 = 1,406. ✓"
    },
    {
      id: 8,
      question: "What is 235 × 16?",
      options: ["3,660", "3,710", "3,760", "3,810", "3,860"],
      correct: 2,
      explanation: "235 × 16: (235 × 10 = 2,350) + (235 × 6 = 1,410) = 2,350 + 1,410 = 3,760. ✓"
    },
    {
      id: 9,
      question: "A cinema ticket costs £12. How much do 45 tickets cost?",
      options: ["£520", "£530", "£540", "£550", "£560"],
      correct: 2,
      explanation: "12 × 45 = £540. Check: 12 × 40 = 480, 12 × 5 = 60, so 480 + 60 = £540. ✓"
    },
    {
      id: 10,
      question: "What is 89 × 26?",
      options: ["2,214", "2,264", "2,314", "2,364", "2,414"],
      correct: 2,
      explanation: "89 × 26: (89 × 20 = 1,780) + (89 × 6 = 534) = 1,780 + 534 = 2,314. ✓"
    },
    {
      id: 11,
      question: "What is 145 × 32?",
      options: ["4,540", "4,580", "4,620", "4,640", "4,680"],
      correct: 3,
      explanation: "145 × 32: (145 × 30 = 4,350) + (145 × 2 = 290) = 4,350 + 290 = 4,640. ✓"
    },
    {
      id: 12,
      question: "A factory produces 126 toys per day. How many toys does it produce in 18 days?",
      options: ["2,168", "2,218", "2,268", "2,318", "2,368"],
      correct: 2,
      explanation: "126 × 18 = 2,268. Check: 126 × 20 = 2,520, 126 × 2 = 252, so 2,520 - 252 = 2,268 toys. ✓"
    },
    {
      id: 13,
      question: "What is 67 × 38?",
      options: ["2,446", "2,496", "2,546", "2,596", "2,646"],
      correct: 2,
      explanation: "67 × 38: (67 × 30 = 2,010) + (67 × 8 = 536) = 2,010 + 536 = 2,546. ✓"
    },
    {
      id: 14,
      question: "What is 218 × 25?",
      options: ["5,350", "5,400", "5,450", "5,500", "5,550"],
      correct: 2,
      explanation: "218 × 25: Think of 25 as 100÷4. So 218 × 100 = 21,800, then 21,800 ÷ 4 = 5,450. ✓"
    },
    {
      id: 15,
      question: "A book has 78 pages. Each page has 35 lines. How many lines are in the book?",
      options: ["2,630", "2,680", "2,730", "2,780", "2,830"],
      correct: 2,
      explanation: "78 × 35 = 2,730. Check: 78 × 30 = 2,340, 78 × 5 = 390, so 2,340 + 390 = 2,730 lines. ✓"
    },
    {
      id: 16,
      question: "What is 156 × 42?",
      options: ["6,452", "6,502", "6,552", "6,602", "6,652"],
      correct: 2,
      explanation: "156 × 42: (156 × 40 = 6,240) + (156 × 2 = 312) = 6,240 + 312 = 6,552. ✓"
    },
    {
      id: 17,
      question: "What is 93 × 47?",
      options: ["4,271", "4,321", "4,371", "4,421", "4,471"],
      correct: 2,
      explanation: "93 × 47: (93 × 40 = 3,720) + (93 × 7 = 651) = 3,720 + 651 = 4,371. ✓"
    },
    {
      id: 18,
      question: "A train ticket costs £54. How much do 29 tickets cost?",
      options: ["£1,466", "£1,516", "£1,566", "£1,616", "£1,666"],
      correct: 2,
      explanation: "54 × 29 = £1,566. Check: 54 × 30 = 1,620, 54 × 1 = 54, so 1,620 - 54 = £1,566. ✓"
    },
    {
      id: 19,
      question: "What is 284 × 36?",
      options: ["10,124", "10,224", "10,324", "10,424", "10,524"],
      correct: 1,
      explanation: "284 × 36: (284 × 30 = 8,520) + (284 × 6 = 1,704) = 8,520 + 1,704 = 10,224. ✓"
    },
    {
      id: 20,
      question: "What is 127 × 48?",
      options: ["6,046", "6,096", "6,146", "6,196", "6,246"],
      correct: 1,
      explanation: "127 × 48: (127 × 50 = 6,350) - (127 × 2 = 254) = 6,350 - 254 = 6,096. ✓"
    },
    {
      id: 21,
      question: "A café sells 86 cups of coffee per day. How many cups do they sell in 52 days?",
      options: ["4,372", "4,422", "4,472", "4,522", "4,572"],
      correct: 2,
      explanation: "86 × 52 = 4,472. Check: 86 × 50 = 4,300, 86 × 2 = 172, so 4,300 + 172 = 4,472 cups. ✓"
    },
    {
      id: 22,
      question: "What is 315 × 28?",
      options: ["8,720", "8,770", "8,820", "8,870", "8,920"],
      correct: 2,
      explanation: "315 × 28: (315 × 30 = 9,450) - (315 × 2 = 630) = 9,450 - 630 = 8,820. ✓"
    },
    {
      id: 23,
      question: "What is 176 × 35?",
      options: ["6,060", "6,110", "6,160", "6,210", "6,260"],
      correct: 2,
      explanation: "176 × 35: (176 × 30 = 5,280) + (176 × 5 = 880) = 5,280 + 880 = 6,160. ✓"
    },
    {
      id: 24,
      question: "A warehouse ships 247 packages per day. How many packages are shipped in 24 days?",
      options: ["5,828", "5,878", "5,928", "5,978", "6,028"],
      correct: 2,
      explanation: "247 × 24 = 5,928. Check: 247 × 20 = 4,940, 247 × 4 = 988, so 4,940 + 988 = 5,928 packages. ✓"
    },
    {
      id: 25,
      question: "What is 408 × 37?",
      options: ["14,996", "15,046", "15,096", "15,146", "15,196"],
      correct: 2,
      explanation: "408 × 37: (408 × 30 = 12,240) + (408 × 7 = 2,856) = 12,240 + 2,856 = 15,096. ✓"
    }
  ]
}
,
algebra: {
  name: "Algebra",
  questions: [
    {
      id: 1,
      question: "Emma thinks of a number, adds 7, and gets 15. What number did Emma think of?",
      options: ["6", "7", "8", "9", "22"],
      correct: 2,
      explanation: "Let Emma's number be x. So x + 7 = 15. To find x, subtract 7 from both sides: x = 15 - 7 = 8. Emma thought of 8. ✓"
    },
    {
      id: 2,
      question: "If n = 5, what is 3n + 4?",
      options: ["12", "15", "17", "19", "20"],
      correct: 3,
      explanation: "Substitute n = 5 into the expression: 3n + 4 = 3 × 5 + 4 = 15 + 4 = 19. ✓"
    },
    {
      id: 3,
      question: "Jack is j years old. His sister Sophie is 3 years younger. Which expression shows Sophie's age?",
      options: ["j + 3", "j - 3", "3j", "j ÷ 3", "3 - j"],
      correct: 1,
      explanation: "If Jack is j years old and Sophie is 3 years younger, then Sophie's age = j - 3. ✓"
    },
    {
      id: 4,
      question: "A pencil costs p pence. How much do 6 pencils cost?",
      options: ["p + 6", "6p", "p - 6", "p ÷ 6", "6 - p"],
      correct: 1,
      explanation: "If one pencil costs p pence, then 6 pencils cost 6 × p = 6p pence. ✓"
    },
    {
      id: 5,
      question: "Lily thinks of a number, multiplies it by 4, then adds 5 to get 29. What was Lily's number?",
      options: ["4", "5", "6", "7", "8"],
      correct: 2,
      explanation: "Let the number be x. So 4x + 5 = 29. First subtract 5: 4x = 24. Then divide by 4: x = 6. Lily's number was 6. ✓"
    },
    {
      id: 6,
      question: "If a = 3 and b = 7, what is 2a + b?",
      options: ["10", "12", "13", "17", "20"],
      correct: 2,
      explanation: "Substitute the values: 2a + b = 2 × 3 + 7 = 6 + 7 = 13. ✓"
    },
    {
      id: 7,
      question: "Tom is t years old. His dad is 4 times as old. Which expression shows his dad's age?",
      options: ["t + 4", "t - 4", "4t", "t ÷ 4", "4 - t"],
      correct: 2,
      explanation: "If Tom is t years old and his dad is 4 times as old, then dad's age = 4 × t = 4t. ✓"
    },
    {
      id: 8,
      question: "A number machine multiplies by 3 then adds 2. If you put 5 into the machine, what comes out?",
      options: ["13", "15", "17", "19", "21"],
      correct: 2,
      explanation: "Input = 5. First multiply by 3: 5 × 3 = 15. Then add 2: 15 + 2 = 17. Output = 17. ✓"
    },
    {
      id: 9,
      question: "Charlie saves £c each week. After 8 weeks, how much has he saved?",
      options: ["c + 8", "c - 8", "8c", "c ÷ 8", "8 - c"],
      correct: 2,
      explanation: "If Charlie saves £c each week, after 8 weeks he has saved 8 × c = 8c pounds. ✓"
    },
    {
      id: 10,
      question: "If x = 4, what is 5x - 7?",
      options: ["11", "12", "13", "17", "20"],
      correct: 2,
      explanation: "Substitute x = 4: 5x - 7 = 5 × 4 - 7 = 20 - 7 = 13. ✓"
    },
    {
      id: 11,
      question: "Ben is 12 years old. His brother Alex is a years old and is 5 years younger than Ben. What is the value of a?",
      options: ["5", "6", "7", "8", "17"],
      correct: 2,
      explanation: "If Ben is 12 and Alex is 5 years younger, then a = 12 - 5 = 7. Alex is 7 years old. ✓"
    },
    {
      id: 12,
      question: "A rectangle has length l cm and width 5 cm. What is its perimeter?",
      options: ["l + 5", "5l", "2l + 10", "l + 10", "2l + 5"],
      correct: 2,
      explanation: "Perimeter = 2 × length + 2 × width = 2l + 2 × 5 = 2l + 10 cm. ✓"
    },
    {
      id: 13,
      question: "Solve: 2x + 6 = 20",
      options: ["x = 5", "x = 6", "x = 7", "x = 8", "x = 13"],
      correct: 2,
      explanation: "Subtract 6 from both sides: 2x = 14. Then divide by 2: x = 7. Check: 2 × 7 + 6 = 14 + 6 = 20. ✓"
    },
    {
      id: 14,
      question: "Maya has m marbles. She gives 8 to her friend and has 15 left. How many marbles did Maya start with?",
      options: ["7", "15", "23", "25", "120"],
      correct: 2,
      explanation: "m - 8 = 15. Add 8 to both sides: m = 15 + 8 = 23. Maya started with 23 marbles. ✓"
    },
    {
      id: 15,
      question: "A number machine doubles a number then subtracts 3. The output is 13. What was the input?",
      options: ["5", "6", "7", "8", "10"],
      correct: 3,
      explanation: "Let input = x. The machine does 2x - 3 = 13. Add 3: 2x = 16. Divide by 2: x = 8. The input was 8. ✓"
    },
    {
      id: 16,
      question: "If y = 6, what is 4y - 5?",
      options: ["14", "16", "17", "19", "24"],
      correct: 3,
      explanation: "Substitute y = 6: 4y - 5 = 4 × 6 - 5 = 24 - 5 = 19. ✓"
    },
    {
      id: 17,
      question: "Lucy is n years old. Her mum is 28 years older. In 5 years' time, how old will Lucy's mum be?",
      options: ["n + 23", "n + 28", "n + 33", "n + 5", "28n + 5"],
      correct: 2,
      explanation: "Lucy's mum is now n + 28. In 5 years she'll be (n + 28) + 5 = n + 33 years old. ✓"
    },
    {
      id: 18,
      question: "Oscar buys b books at £4 each. How much does he spend in total?",
      options: ["b + 4", "4b", "b - 4", "b ÷ 4", "4 - b"],
      correct: 1,
      explanation: "If each book costs £4 and he buys b books, total cost = 4 × b = £4b. ✓"
    },
    {
      id: 19,
      question: "Solve: 3n - 4 = 17",
      options: ["n = 5", "n = 6", "n = 7", "n = 8", "n = 13"],
      correct: 2,
      explanation: "Add 4 to both sides: 3n = 21. Divide by 3: n = 7. Check: 3 × 7 - 4 = 21 - 4 = 17. ✓"
    },
    {
      id: 20,
      question: "A cafe sells coffee for £c and tea for £t. James buys 2 coffees and 3 teas. How much does he spend?",
      options: ["2c + 3t", "5ct", "c + t", "6ct", "2c + t"],
      correct: 0,
      explanation: "2 coffees cost 2c and 3 teas cost 3t. Total = 2c + 3t pounds. ✓"
    },
    {
      id: 21,
      question: "If p = 8, what is (p + 4) × 2?",
      options: ["16", "20", "24", "28", "32"],
      correct: 2,
      explanation: "Substitute p = 8: (p + 4) × 2 = (8 + 4) × 2 = 12 × 2 = 24. Remember BIDMAS - brackets first! ✓"
    },
    {
      id: 22,
      question: "Sarah collects stickers. She has s stickers and buys 12 more. Then she gives away 5. How many does she have now?",
      options: ["s + 7", "s + 17", "s - 7", "12s + 5", "s + 12 - 5"],
      correct: 0,
      explanation: "Start with s, add 12 (s + 12), then subtract 5: (s + 12) - 5 = s + 7 stickers. ✓"
    },
    {
      id: 23,
      question: "The perimeter of a square is 4s. If the perimeter is 36 cm, what is s?",
      options: ["4 cm", "6 cm", "9 cm", "12 cm", "32 cm"],
      correct: 2,
      explanation: "4s = 36. Divide both sides by 4: s = 36 ÷ 4 = 9 cm. This is the length of one side. ✓"
    },
    {
      id: 24,
      question: "Ahmed thinks of a number, adds 9, then divides by 3 to get 7. What was Ahmed's number?",
      options: ["12", "15", "18", "21", "30"],
      correct: 0,
      explanation: "Working backwards: if dividing by 3 gives 7, then before dividing he had 21 (7 × 3 = 21). If adding 9 gave 21, his number was 21 - 9 = 12. ✓"
    },
    {
      id: 25,
      question: "If a = 5 and b = 3, what is 2a - b?",
      options: ["4", "5", "6", "7", "13"],
      correct: 3,
      explanation: "Substitute values: 2a - b = 2 × 5 - 3 = 10 - 3 = 7. ✓"
    },
    {
      id: 26,
      question: "Grace is g years old. Her grandmother is 60 years older than Grace. Which expression shows her grandmother's age?",
      options: ["g - 60", "60 - g", "g + 60", "60g", "g ÷ 60"],
      correct: 2,
      explanation: "If Grace is g years old and her grandmother is 60 years older, grandmother's age = g + 60. ✓"
    },
    {
      id: 27,
      question: "A number machine adds 5 then multiplies by 2. If the output is 24, what was the input?",
      options: ["7", "9", "10", "12", "14"],
      correct: 0,
      explanation: "Working backwards: before multiplying by 2, the value was 24 ÷ 2 = 12. Before adding 5, the input was 12 - 5 = 7. ✓"
    },
    {
      id: 28,
      question: "Solve: 5x + 3 = 28",
      options: ["x = 3", "x = 4", "x = 5", "x = 6", "x = 7"],
      correct: 2,
      explanation: "Subtract 3 from both sides: 5x = 25. Divide by 5: x = 5. Check: 5 × 5 + 3 = 25 + 3 = 28. ✓"
    },
    {
      id: 29,
      question: "Ruby scores r points in a game. Jake scores twice as many points as Ruby, and then scores 6 bonus points. Which expression shows Jake's total score?",
      options: ["2r + 6", "r + 6", "2r - 6", "2(r + 6)", "6r + 2"],
      correct: 0,
      explanation: "Jake scores twice Ruby's score (2r), then adds 6 bonus points: 2r + 6. ✓"
    },
    {
      id: 30,
      question: "A tablet costs £t. A phone costs £50 more than the tablet. What is the total cost of both items?",
      options: ["t + 50", "2t + 50", "t + 100", "50t", "2t"],
      correct: 1,
      explanation: "Tablet costs £t. Phone costs £(t + 50). Total = t + (t + 50) = 2t + 50 pounds. ✓"
    },
    {
      id: 31,
      question: "If m = 7 and n = 4, what is 3m - 2n?",
      options: ["11", "12", "13", "14", "15"],
      correct: 2,
      explanation: "Substitute values: 3m - 2n = 3 × 7 - 2 × 4 = 21 - 8 = 13. ✓"
    },
    {
      id: 32,
      question: "Daniel walks w kilometres on Monday. On Tuesday he walks 2 kilometres more than Monday. On Wednesday he walks the same as Tuesday. How far does he walk in total over the three days?",
      options: ["3w + 2", "3w + 4", "w + 4", "3w", "w + 6"],
      correct: 1,
      explanation: "Monday: w km, Tuesday: w + 2 km, Wednesday: w + 2 km. Total = w + (w + 2) + (w + 2) = 3w + 4 km. ✓"
    },
    {
      id: 33,
      question: "Solve: 4y - 7 = 21",
      options: ["y = 5", "y = 6", "y = 7", "y = 8", "y = 14"],
      correct: 2,
      explanation: "Add 7 to both sides: 4y = 28. Divide by 4: y = 7. Check: 4 × 7 - 7 = 28 - 7 = 21. ✓"
    },
    {
      id: 34,
      question: "Freya has f football cards. Her brother Harry has 3 times as many cards as Freya, minus 5 cards. Which expression shows how many cards Harry has?",
      options: ["3f - 5", "f - 5", "3f + 5", "3(f - 5)", "5f - 3"],
      correct: 0,
      explanation: "Harry has 3 times Freya's cards (3f), minus 5 cards: 3f - 5. ✓"
    },
    {
      id: 35,
      question: "A school trip costs £25 per student plus a £60 coach fee to be shared equally. If there are n students, which expression shows the cost per student?",
      options: ["25 + 60/n", "25n + 60", "(25 + 60)/n", "25 + 60n", "85/n"],
      correct: 0,
      explanation: "Each student pays £25 plus their share of £60. The share of £60 is 60 ÷ n = 60/n. So cost per student = 25 + 60/n pounds. ✓"
    }
  ]
}
,
placevalue: {
  name: "Place Value and Rounding",
  questions: [
    {
      id: 1,
      question: "Sophie's school raised £4,567 for charity. What is the value of the digit 5 in this number?",
      options: ["5", "50", "500", "5,000", "50,000"],
      correct: 2,
      explanation: "In 4,567, the digit 5 is in the hundreds place. So its value is 5 hundreds = 500. ✓"
    },
    {
      id: 2,
      question: "Round 3,845 to the nearest hundred.",
      options: ["3,000", "3,800", "3,850", "3,900", "4,000"],
      correct: 1,
      explanation: "Look at the tens digit: 4. Since 4 is less than 5, round down. 3,845 rounds to 3,800. ✓"
    },
    {
      id: 3,
      question: "What is the number seven thousand, two hundred and thirty-six written in digits?",
      options: ["7,236", "7,326", "72,036", "7,206", "70,236"],
      correct: 0,
      explanation: "Seven thousand = 7,000, two hundred = 200, thirty-six = 36. Add them: 7,000 + 200 + 36 = 7,236. ✓"
    },
    {
      id: 4,
      question: "Jake scored 28,453 points in a video game. Round this to the nearest thousand.",
      options: ["28,000", "28,400", "28,500", "29,000", "30,000"],
      correct: 0,
      explanation: "Look at the hundreds digit: 4. Since 4 is less than 5, round down. 28,453 rounds to 28,000. ✓"
    },
    {
      id: 5,
      question: "In the number 56,729, which digit is in the tens place?",
      options: ["9", "2", "7", "6", "5"],
      correct: 1,
      explanation: "In 56,729, reading from right to left: 9 is ones, 2 is tens, 7 is hundreds, 6 is thousands, 5 is ten-thousands. The tens digit is 2. ✓"
    },
    {
      id: 6,
      question: "Round 4,682 to the nearest ten.",
      options: ["4,600", "4,680", "4,690", "4,700", "5,000"],
      correct: 1,
      explanation: "Look at the ones digit: 2. Since 2 is less than 5, round down. 4,682 rounds to 4,680. ✓"
    },
    {
      id: 7,
      question: "Emily's town has a population of 45,638 people. What is this number rounded to the nearest hundred?",
      options: ["45,000", "45,600", "45,640", "45,700", "46,000"],
      correct: 1,
      explanation: "Look at the tens digit: 3. Since 3 is less than 5, round down. 45,638 rounds to 45,600. ✓"
    },
    {
      id: 8,
      question: "Which of these numbers is closest to 50,000? 48,756 / 51,234 / 49,812 / 52,089 / 47,945",
      options: ["48,756", "51,234", "49,812", "52,089", "47,945"],
      correct: 2,
      explanation: "Find the difference from 50,000: 48,756 is 1,244 away; 51,234 is 1,234 away; 49,812 is 188 away; 52,089 is 2,089 away; 47,945 is 2,055 away. The closest is 49,812. ✓"
    },
    {
      id: 9,
      question: "What number is 1,000 more than 34,567?",
      options: ["34,667", "35,467", "35,567", "44,567", "34,568"],
      correct: 2,
      explanation: "Add 1,000 to 34,567. The thousands digit increases by 1: 34,567 + 1,000 = 35,567. ✓"
    },
    {
      id: 10,
      question: "Oliver's dad drove 18,945 miles last year. Round this to the nearest thousand.",
      options: ["18,000", "18,900", "19,000", "20,000", "18,950"],
      correct: 2,
      explanation: "Look at the hundreds digit: 9. Since 9 is 5 or more, round up. 18,945 rounds to 19,000. ✓"
    },
    {
      id: 11,
      question: "In the number 83,512, what is the value of the digit 3?",
      options: ["3", "30", "300", "3,000", "30,000"],
      correct: 3,
      explanation: "In 83,512, the digit 3 is in the thousands place. Its value is 3 thousands = 3,000. ✓"
    },
    {
      id: 12,
      question: "Put these numbers in order from smallest to largest: 12,456 / 12,564 / 12,465 / 12,546",
      options: ["12,456, 12,465, 12,546, 12,564", "12,456, 12,465, 12,564, 12,546", "12,465, 12,456, 12,546, 12,564", "12,564, 12,546, 12,465, 12,456", "12,456, 12,546, 12,465, 12,564"],
      correct: 0,
      explanation: "Compare from left to right. All start with 12,4 or 12,5. Ordering by the remaining digits: 12,456 < 12,465 < 12,546 < 12,564. ✓"
    },
    {
      id: 13,
      question: "Mia's grandmother is ninety-four thousand, six hundred and twenty-three days old. Write this in digits.",
      options: ["94,623", "94,263", "946,023", "94,603", "9,623"],
      correct: 0,
      explanation: "Ninety-four thousand = 94,000, six hundred = 600, twenty-three = 23. Total: 94,000 + 600 + 23 = 94,623. ✓"
    },
    {
      id: 14,
      question: "Round 67,849 to the nearest ten.",
      options: ["67,840", "67,850", "67,900", "68,000", "67,800"],
      correct: 1,
      explanation: "Look at the ones digit: 9. Since 9 is 5 or more, round up. 67,849 rounds to 67,850. ✓"
    },
    {
      id: 15,
      question: "A new car costs £23,795. What is this rounded to the nearest hundred?",
      options: ["23,000", "23,700", "23,800", "24,000", "23,790"],
      correct: 2,
      explanation: "Look at the tens digit: 9. Since 9 is 5 or more, round up. £23,795 rounds to £23,800. ✓"
    },
    {
      id: 16,
      question: "What number is 100 less than 45,023?",
      options: ["44,923", "45,013", "44,913", "45,123", "44,023"],
      correct: 0,
      explanation: "Subtract 100 from 45,023. The hundreds digit decreases by 1: 45,023 - 100 = 44,923. ✓"
    },
    {
      id: 17,
      question: "Noah counted 38,562 bricks in a wall. In which place is the digit 8?",
      options: ["Ones", "Tens", "Hundreds", "Thousands", "Ten-thousands"],
      correct: 3,
      explanation: "In 38,562, reading from right: 2 is ones, 6 is tens, 5 is hundreds, 8 is thousands, 3 is ten-thousands. The 8 is in the thousands place. ✓"
    },
    {
      id: 18,
      question: "A stadium holds 52,487 spectators. Round this to the nearest thousand.",
      options: ["50,000", "52,000", "52,500", "53,000", "60,000"],
      correct: 1,
      explanation: "Look at the hundreds digit: 4. Since 4 is less than 5, round down. 52,487 rounds to 52,000. ✓"
    },
    {
      id: 19,
      question: "Which number has 7 in the hundreds place? 17,234 / 71,234 / 12,734 / 12,347 / 27,134",
      options: ["17,234", "71,234", "12,734", "12,347", "27,134"],
      correct: 2,
      explanation: "Check each number: 17,234 (2 in hundreds); 71,234 (2 in hundreds); 12,734 (7 in hundreds); 12,347 (3 in hundreds); 27,134 (1 in hundreds). Answer: 12,734. ✓"
    },
    {
      id: 20,
      question: "Lucy is reading a book with 29,485 words. Round this to the nearest hundred.",
      options: ["29,000", "29,400", "29,480", "29,500", "30,000"],
      correct: 3,
      explanation: "Look at the tens digit: 8. Since 8 is 5 or more, round up. 29,485 rounds to 29,500. ✓"
    },
    {
      id: 21,
      question: "What is the largest 5-digit number you can make using the digits 3, 7, 1, 9, 4 (each used once)?",
      options: ["97,431", "97,341", "94,731", "91,743", "43,179"],
      correct: 0,
      explanation: "Put the largest digits in the highest place values: 9 in ten-thousands, 7 in thousands, 4 in hundreds, 3 in tens, 1 in ones = 97,431. ✓"
    },
    {
      id: 22,
      question: "Round 85,555 to the nearest thousand.",
      options: ["85,000", "85,500", "85,600", "86,000", "90,000"],
      correct: 3,
      explanation: "Look at the hundreds digit: 5. Since 5 means round up, 85,555 rounds to 86,000. ✓"
    },
    {
      id: 23,
      question: "Charlie's school has 1,847 students. The head teacher says there are 'about 2,000' students. To what has the number been rounded?",
      options: ["Nearest 10", "Nearest 100", "Nearest 500", "Nearest 1,000", "Nearest 10,000"],
      correct: 3,
      explanation: "1,847 rounded to 2,000 is rounding to the nearest thousand. The hundreds digit (8) is 5 or more, so it rounds up. ✓"
    },
    {
      id: 24,
      question: "In the number 76,328, what is the sum of the thousands digit and the hundreds digit?",
      options: ["6", "9", "10", "11", "15"],
      correct: 1,
      explanation: "The thousands digit is 6 and the hundreds digit is 3. Sum: 6 + 3 = 9. ✓"
    },
    {
      id: 25,
      question: "Amelia's town is exactly halfway between two cities that are 56,000 metres apart. How far is Amelia's town from each city?",
      options: ["26,000 m", "28,000 m", "30,000 m", "32,000 m", "34,000 m"],
      correct: 1,
      explanation: "Halfway means divide by 2: 56,000 ÷ 2 = 28,000 metres from each city. ✓"
    }
  ]
}
,
negativenumbers: {
  name: "Negative Numbers",
  questions: [
    {
      id: 1,
      question: "The temperature in Edinburgh is -3°C. In London it is 5°C warmer. What is the temperature in London?",
      options: ["-8°C", "-2°C", "2°C", "8°C", "3°C"],
      correct: 2,
      explanation: "Start at -3°C and add 5°C: -3 + 5 = 2°C. Think of a number line: from -3, count 5 places to the right. ✓"
    },
    {
      id: 2,
      question: "Which number is the smallest? -5, 3, -2, 0, -8",
      options: ["-5", "3", "-2", "0", "-8"],
      correct: 4,
      explanation: "On a number line, the further left a number is, the smaller it is. -8 is furthest left, so it's the smallest. ✓"
    },
    {
      id: 3,
      question: "Sarah's bank balance is £20. She spends £35. What is her new balance?",
      options: ["£15", "£55", "-£15", "-£55", "£5"],
      correct: 2,
      explanation: "She starts with £20 and spends £35: 20 - 35 = -15. Her balance is -£15, meaning she's £15 overdrawn. ✓"
    },
    {
      id: 4,
      question: "The temperature at midnight was -7°C. By midday it had risen by 12°C. What was the temperature at midday?",
      options: ["-19°C", "-5°C", "5°C", "19°C", "12°C"],
      correct: 2,
      explanation: "Start at -7°C and add 12°C: -7 + 12 = 5°C. Count from -7: go up 7 to reach 0, then up another 5 to reach 5°C. ✓"
    },
    {
      id: 5,
      question: "Put these numbers in order from smallest to largest: -1, 4, -6, 2, -3",
      options: ["-1, -3, -6, 2, 4", "-6, -3, -1, 2, 4", "-6, -3, -1, 4, 2", "4, 2, -1, -3, -6", "-3, -1, -6, 2, 4"],
      correct: 1,
      explanation: "Negative numbers get smaller as they go further from zero. Order: -6, -3, -1, 2, 4. ✓"
    },
    {
      id: 6,
      question: "A submarine is at 45 metres below sea level. It rises 20 metres. What is its new depth?",
      options: ["25 metres below", "65 metres below", "25 metres above", "20 metres below", "45 metres below"],
      correct: 0,
      explanation: "Starting position: -45m (below sea level). Rising 20m means adding: -45 + 20 = -25m, so 25 metres below sea level. ✓"
    },
    {
      id: 7,
      question: "Jack scored -5 points in a game. Emma scored 3 points more than Jack. How many points did Emma score?",
      options: ["-8", "-2", "2", "8", "-5"],
      correct: 1,
      explanation: "Jack has -5 points. Emma has 3 more: -5 + 3 = -2 points. ✓"
    },
    {
      id: 8,
      question: "What is the difference between -4°C and 3°C?",
      options: ["1°C", "7°C", "-1°C", "-7°C", "4°C"],
      correct: 1,
      explanation: "The difference means how far apart they are: from -4 to 3 is 7 degrees. Count: -4 to 0 is 4, then 0 to 3 is 3, so 4 + 3 = 7°C. ✓"
    },
    {
      id: 9,
      question: "A car park has 3 floors above ground and 2 floors below ground. Ground floor is numbered 0. Which floor number is 2 floors below ground?",
      options: ["-3", "-2", "-1", "2", "0"],
      correct: 1,
      explanation: "Ground floor = 0. One floor below = -1. Two floors below = -2. ✓"
    },
    {
      id: 10,
      question: "The temperature was 2°C. It dropped by 8°C. What is the new temperature?",
      options: ["-10°C", "-6°C", "6°C", "10°C", "-4°C"],
      correct: 1,
      explanation: "Start at 2°C and subtract 8°C: 2 - 8 = -6°C. ✓"
    },
    {
      id: 11,
      question: "Which is larger: -20 or -15?",
      options: ["-20", "-15", "They are equal", "Cannot tell", "Neither"],
      correct: 1,
      explanation: "-15 is larger (closer to zero) than -20. On a number line, -15 is to the right of -20. ✓"
    },
    {
      id: 12,
      question: "Oliver is on floor -3 in a building. He goes up 5 floors. Which floor is he on now?",
      options: ["Floor -8", "Floor -2", "Floor 2", "Floor 8", "Floor 5"],
      correct: 2,
      explanation: "Starting floor: -3. Going up 5 floors means adding: -3 + 5 = 2. He's on floor 2. ✓"
    },
    {
      id: 13,
      question: "The temperature in Moscow is -12°C. In Dubai it is 38°C warmer. What is the temperature in Dubai?",
      options: ["26°C", "50°C", "-50°C", "30°C", "20°C"],
      correct: 0,
      explanation: "Start at -12°C and add 38°C: -12 + 38 = 26°C. Count up: from -12 to 0 is 12, then 0 to 26 is 26, so 12 + 26 = 38°C warmer. ✓"
    },
    {
      id: 14,
      question: "What number is halfway between -6 and 4?",
      options: ["-2", "-1", "0", "1", "2"],
      correct: 1,
      explanation: "The distance from -6 to 4 is 10 (count: -6 to 0 is 6, then 0 to 4 is 4, so 6 + 4 = 10). Half of 10 is 5. From -6, count up 5: -6 + 5 = -1. ✓"
    },
    {
      id: 15,
      question: "Lily owes her brother £8. She gives him £5. How much does she still owe?",
      options: ["£13", "£3", "-£3", "-£13", "£8"],
      correct: 1,
      explanation: "Owing £8 means -£8. Giving £5 means adding: -8 + 5 = -3. She still owes £3 (or her balance is -£3). ✓"
    },
    {
      id: 16,
      question: "A diver is 18 metres below sea level. She dives down another 7 metres. What is her new depth?",
      options: ["11 metres below", "25 metres below", "11 metres above", "18 metres below", "7 metres below"],
      correct: 1,
      explanation: "Starting depth: -18m. Diving down 7m more: -18 - 7 = -25m, so 25 metres below sea level. ✓"
    },
    {
      id: 17,
      question: "The lowest temperature recorded in Antarctica was -89°C. The lowest in the Arctic was -68°C. What is the difference?",
      options: ["21°C", "157°C", "68°C", "89°C", "25°C"],
      correct: 0,
      explanation: "Find the difference between -89°C and -68°C: -68 - (-89) = -68 + 89 = 21°C difference. Or count: from -89 to -68 is 21 degrees. ✓"
    },
    {
      id: 18,
      question: "Ben has -£12 in his account (overdrawn). His dad puts £20 in. What is his new balance?",
      options: ["-£32", "-£8", "£8", "£32", "£12"],
      correct: 2,
      explanation: "Start with -£12 and add £20: -12 + 20 = £8. His new balance is £8. ✓"
    },
    {
      id: 19,
      question: "Which of these numbers is closest to zero? -7, 5, -3, 9, -10",
      options: ["-7", "5", "-3", "9", "-10"],
      correct: 2,
      explanation: "Distance from zero: -7 is 7 away; 5 is 5 away; -3 is 3 away; 9 is 9 away; -10 is 10 away. Closest is -3. ✓"
    },
    {
      id: 20,
      question: "In a quiz, correct answers score +5 points and wrong answers score -2 points. Maya gets 4 correct and 3 wrong. What is her total score?",
      options: ["14", "20", "6", "26", "18"],
      correct: 0,
      explanation: "Correct answers: 4 × 5 = 20 points. Wrong answers: 3 × (-2) = -6 points. Total: 20 + (-6) = 20 - 6 = 14 points. ✓"
    }
  ]
}
,
primenumbers: {
  name: "Prime Numbers & Factors",
  questions: [
    {
      id: 1,
      question: "Which of these numbers is a prime number?",
      options: ["12", "15", "17", "21", "25"],
      correct: 2,
      explanation: "A prime number only has two factors: 1 and itself. 17 can only be divided by 1 and 17, so it's prime. The others have more factors. ✓"
    },
    {
      id: 2,
      question: "How many factors does 24 have?",
      options: ["4", "6", "8", "10", "12"],
      correct: 2,
      explanation: "The factors of 24 are: 1, 2, 3, 4, 6, 8, 12, 24. Count them: that's 8 factors. ✓"
    },
    {
      id: 3,
      question: "Emma wants to arrange 18 chairs in equal rows with no chairs left over. Which of these is NOT a possible number of rows?",
      options: ["2 rows", "3 rows", "4 rows", "6 rows", "9 rows"],
      correct: 2,
      explanation: "The number of rows must be a factor of 18. Factors of 18 are: 1, 2, 3, 6, 9, 18. The number 4 is NOT a factor of 18. ✓"
    },
    {
      id: 4,
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3", "5"],
      correct: 2,
      explanation: "The smallest prime number is 2. It's the only even prime number! (1 is not considered prime, and 0 is not prime either.) ✓"
    },
    {
      id: 5,
      question: "Which number is both a factor of 30 and a factor of 45?",
      options: ["2", "4", "9", "15", "20"],
      correct: 3,
      explanation: "Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30. Factors of 45: 1, 3, 5, 9, 15, 45. Common factors include 1, 3, 5, and 15. From the options, 15 is a factor of both. ✓"
    },
    {
      id: 6,
      question: "Jake has 36 chocolates. He wants to share them equally among his friends with none left over. Which number of friends is NOT possible?",
      options: ["4 friends", "5 friends", "6 friends", "9 friends", "12 friends"],
      correct: 1,
      explanation: "The number of friends must be a factor of 36. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The number 5 is NOT a factor of 36. ✓"
    },
    {
      id: 7,
      question: "How many prime numbers are there between 20 and 30?",
      options: ["1", "2", "3", "4", "5"],
      correct: 1,
      explanation: "Prime numbers between 20 and 30 are: 23 and 29. That's 2 prime numbers. ✓"
    },
    {
      id: 8,
      question: "What is the highest common factor (HCF) of 12 and 18?",
      options: ["2", "3", "6", "9", "36"],
      correct: 2,
      explanation: "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common factors: 1, 2, 3, 6. The highest is 6. ✓"
    },
    {
      id: 9,
      question: "Which of these is NOT a prime number?",
      options: ["13", "19", "23", "27", "31"],
      correct: 3,
      explanation: "27 can be divided by 1, 3, 9, and 27, so it has more than two factors. Therefore 27 is NOT prime. All the others are prime. ✓"
    },
    {
      id: 10,
      question: "Sophie is making gift bags. She has 20 sweets and 30 stickers. She wants each bag to have the same number of sweets and the same number of stickers, with none left over. What is the maximum number of gift bags she can make?",
      options: ["5", "10", "15", "20", "30"],
      correct: 1,
      explanation: "Find the HCF of 20 and 30. Factors of 20: 1, 2, 4, 5, 10, 20. Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30. The HCF is 10, so she can make 10 gift bags. ✓"
    },
    {
      id: 11,
      question: "What is the smallest number that is a multiple of both 4 and 6?",
      options: ["10", "12", "18", "24", "30"],
      correct: 1,
      explanation: "Multiples of 4: 4, 8, 12, 16, 20, 24... Multiples of 6: 6, 12, 18, 24, 30... The smallest common multiple is 12. ✓"
    },
    {
      id: 12,
      question: "How many factors does the number 17 have?",
      options: ["1", "2", "3", "4", "17"],
      correct: 1,
      explanation: "17 is a prime number, so it only has two factors: 1 and 17. ✓"
    },
    {
      id: 13,
      question: "Tom says 'All odd numbers are prime'. Is he correct?",
      options: ["Yes, always", "No, because 9 is odd but not prime", "Yes, but only for numbers under 10", "No, because 2 is prime but even", "Only sometimes"],
      correct: 1,
      explanation: "Tom is wrong. 9 is odd (9 = 2×4 + 1) but NOT prime because it has factors 1, 3, and 9. Other odd non-primes include 15, 21, 25, 27... ✓"
    },
    {
      id: 14,
      question: "A teacher has 24 pencils and 36 erasers. She wants to make identical packs with the same number of pencils and erasers in each pack, with nothing left over. What is the largest number of packs she can make?",
      options: ["4", "6", "8", "12", "18"],
      correct: 3,
      explanation: "Find the HCF of 24 and 36. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The HCF is 12, so she can make 12 packs. ✓"
    },
    {
      id: 15,
      question: "Which number below has exactly 3 factors?",
      options: ["6", "9", "12", "15", "18"],
      correct: 1,
      explanation: "A number with exactly 3 factors must be the square of a prime. 9 = 3² and has factors: 1, 3, 9. That's exactly 3 factors. ✓"
    },
    {
      id: 16,
      question: "Lucy is arranging 42 books on shelves. Each shelf must have the same number of books. Which of these is a possible number of books per shelf?",
      options: ["4", "5", "8", "14", "15"],
      correct: 3,
      explanation: "The number must be a factor of 42. Factors of 42: 1, 2, 3, 6, 7, 14, 21, 42. From the options, 14 is a factor of 42. ✓"
    },
    {
      id: 17,
      question: "What is the highest common factor (HCF) of 15 and 25?",
      options: ["1", "3", "5", "15", "25"],
      correct: 2,
      explanation: "Factors of 15: 1, 3, 5, 15. Factors of 25: 1, 5, 25. Common factors: 1, 5. The highest is 5. ✓"
    },
    {
      id: 18,
      question: "Ben's phone buzzes every 6 minutes and chimes every 8 minutes. If they both happen together now, how many minutes until they both happen together again?",
      options: ["14 minutes", "18 minutes", "24 minutes", "32 minutes", "48 minutes"],
      correct: 2,
      explanation: "Find the LCM (Lowest Common Multiple) of 6 and 8. Multiples of 6: 6, 12, 18, 24, 30... Multiples of 8: 8, 16, 24, 32... The LCM is 24 minutes. ✓"
    },
    {
      id: 19,
      question: "Which of these numbers has the most factors?",
      options: ["20", "24", "28", "30", "32"],
      correct: 1,
      explanation: "Count factors: 20 has 6 factors (1,2,4,5,10,20); 24 has 8 factors (1,2,3,4,6,8,12,24); 28 has 6 factors; 30 has 8 factors; 32 has 6 factors. Both 24 and 30 have 8 factors, but 24 appears first in the options. ✓"
    },
    {
      id: 20,
      question: "Mia and Oliver are running laps. Mia completes a lap every 4 minutes and Oliver every 5 minutes. If they start together, after how many minutes will they both be at the starting point together again?",
      options: ["9 minutes", "15 minutes", "20 minutes", "25 minutes", "40 minutes"],
      correct: 2,
      explanation: "Find the LCM of 4 and 5. Multiples of 4: 4, 8, 12, 16, 20... Multiples of 5: 5, 10, 15, 20... The LCM is 20 minutes. ✓"
    }
  ]
}
      }      

    },english: {
    name: "English",
    icon: BookOpen,
    topics: {
      grammar: {
        name: "Grammar",
        questions: [
          {
            id: 28,
            question: "Which sentence is correct?",
            options: ["Me and Tom went to the park", "Tom and I went to the park", "Tom and me went to the park", "I and Tom went to the park"],
            correct: 1,
            explanation: "We use 'I' when we're the subject (doing the action). Also, it's polite to put the other person first. So 'Tom and I went to the park' is correct!"
          },
          {
            id: 29,
            question: "What type of word is 'quickly' in this sentence: 'She ran quickly'?",
            options: ["Noun", "Verb", "Adjective", "Adverb"],
            correct: 3,
            explanation: "'Quickly' describes how she ran, so it's an adverb. Adverbs often end in '-ly' and describe verbs!"
          },
          {
            id: 30,
            question: "Which sentence uses the correct punctuation?",
            options: ["Its a sunny day", "Its' a sunny day", "It's a sunny day", "Its, a sunny day"],
            correct: 2,
            explanation: "'It's' with an apostrophe means 'it is'. So 'It's a sunny day' means 'It is a sunny day'. Perfect!"
          },
          {
            id: 31,
            question: "What is the plural of 'child'?",
            options: ["childs", "childes", "children", "childrens"],
            correct: 2,
            explanation: "'Children' is the irregular plural of 'child'. Some words don't just add 's' - they change completely!"
          },
          {
            id: 32,
            question: "Which word is a verb in this sentence: 'The happy dog jumps over the fence'?",
            options: ["happy", "dog", "jumps", "fence"],
            correct: 2,
            explanation: "'Jumps' is the verb because it's the action word - it tells us what the dog is doing!"
          },
          {
            id: 33,
            question: "Choose the correct sentence:",
            options: ["Their going to the cinema", "There going to the cinema", "They're going to the cinema", "Theyr going to the cinema"],
            correct: 2,
            explanation: "'They're' is short for 'they are'. 'Their' shows ownership, and 'there' is about place. So 'They're going to the cinema' is correct!"
          }
        ]
      },
      vocabulary: {
        name: "Vocabulary",
        questions: [
          {
            id: 34,
            question: "What does 'enormous' mean?",
            options: ["Very small", "Very large", "Very fast", "Very slow"],
            correct: 1,
            explanation: "'Enormous' means very large or huge! Think of an enormous elephant - it's really, really big!"
          },
          {
            id: 35,
            question: "Which word is a synonym (similar meaning) for 'happy'?",
            options: ["Sad", "Angry", "Joyful", "Tired"],
            correct: 2,
            explanation: "'Joyful' means the same as happy - full of joy and happiness. Great job!"
          },
          {
            id: 36,
            question: "What does 'ancient' mean?",
            options: ["Very new", "Very old", "Very big", "Very small"],
            correct: 1,
            explanation: "'Ancient' means very old - like ancient pyramids or ancient dinosaurs from long, long ago!"
          },
          {
            id: 37,
            question: "Which word is an antonym (opposite) of 'difficult'?",
            options: ["Hard", "Easy", "Tough", "Tricky"],
            correct: 1,
            explanation: "'Easy' is the opposite of difficult. If something is difficult, it's hard. If it's easy, it's simple!"
          },
          {
            id: 38,
            question: "What does 'whisper' mean?",
            options: ["To speak very loudly", "To speak very quietly", "To speak very quickly", "To speak very slowly"],
            correct: 1,
            explanation: "To 'whisper' means to speak very quietly, so only people close by can hear you!"
          },
          {
            id: 39,
            question: "Which word means 'very scared'?",
            options: ["Brave", "Terrified", "Calm", "Peaceful"],
            correct: 1,
            explanation: "'Terrified' means extremely scared or frightened. It's a stronger word than just 'scared'!"
          }
        ]
      },
      comprehension: {
        name: "Comprehension",
        questions: [
          {
            id: 40,
            question: "Read: 'The sun was setting behind the mountains, painting the sky orange and pink.' What time of day is it?",
            options: ["Morning", "Afternoon", "Evening", "Night"],
            correct: 2,
            explanation: "When the sun is setting (going down), it's evening time. That's when we get those beautiful orange and pink skies!"
          },
          {
            id: 41,
            question: "Read: 'Maya packed her bag carefully, checking she had her water bottle and sandwiches. She was excited for the long walk ahead.' Where is Maya probably going?",
            options: ["To bed", "On a hike", "To school", "Swimming"],
            correct: 1,
            explanation: "The clues are: packing a bag, water bottle, sandwiches, and a 'long walk'. This suggests Maya is going on a hike!"
          },
          {
            id: 42,
            question: "Read: 'Tom felt his heart racing as he stepped onto the stage. He could see hundreds of faces looking up at him.' How is Tom feeling?",
            options: ["Bored", "Nervous", "Angry", "Sleepy"],
            correct: 1,
            explanation: "A racing heart when stepping on stage in front of lots of people tells us Tom is nervous or anxious. That's natural!"
          },
          {
            id: 43,
            question: "Read: 'The library was silent except for the soft turning of pages and the ticking of the old clock.' What is the atmosphere like?",
            options: ["Noisy and busy", "Quiet and peaceful", "Dark and scary", "Bright and cheerful"],
            correct: 1,
            explanation: "Words like 'silent', 'soft' and just the sound of pages and a clock tell us it's quiet and peaceful in the library!"
          }
        ]
      },
      spelling: {
        name: "Spelling",
        questions: [
          {
            id: 44,
            question: "Which spelling is correct?",
            options: ["becuase", "because", "becaus", "becouse"],
            correct: 1,
            explanation: "The correct spelling is 'because'. A good trick: Big Elephants Can Always Understand Small Elephants!"
          },
          {
            id: 45,
            question: "Which spelling is correct?",
            options: ["seperate", "separate", "separete", "seprate"],
            correct: 1,
            explanation: "The correct spelling is 'separate'. Remember: there's 'a rat' in separate!"
          },
          {
            id: 46,
            question: "Which spelling is correct?",
            options: ["definately", "definitly", "definitely", "definatly"],
            correct: 2,
            explanation: "The correct spelling is 'definitely'. Think of 'finite' in the middle: de-finite-ly!"
          },
          {
            id: 47,
            question: "Which spelling is correct?",
            options: ["recieve", "receive", "receeve", "receve"],
            correct: 1,
            explanation: "The correct spelling is 'receive'. Remember: 'i before e except after c'!"
          },
          {
            id: 48,
            question: "Which spelling is correct?",
            options: ["necesary", "neccesary", "necessary", "neccessary"],
            correct: 2,
            explanation: "The correct spelling is 'necessary'. Remember: one collar (c) and two sleeves (s)!"
          }
        ]
      }
    }
  },verbalreasoning: {
    name: "Verbal Reasoning",
    icon: Brain,
    topics: {
      analogies: {
        name: "Analogies",
        questions: [
          {
            id: 49,
            question: "Cat is to kitten as dog is to ___?",
            options: ["puppy", "bone", "bark", "pet"],
            correct: 0,
            explanation: "A baby cat is called a kitten, and a baby dog is called a puppy. They're both young animals!"
          },
          {
            id: 50,
            question: "Hot is to cold as tall is to ___?",
            options: ["high", "big", "short", "long"],
            correct: 2,
            explanation: "Hot and cold are opposites. Tall and short are also opposites - they describe opposite heights!"
          },
          {
            id: 51,
            question: "Book is to read as music is to ___?",
            options: ["sing", "listen", "play", "write"],
            correct: 1,
            explanation: "You read a book, and you listen to music. They're both things we do to enjoy them!"
          },
          {
            id: 52,
            question: "Day is to night as summer is to ___?",
            options: ["sun", "hot", "winter", "spring"],
            correct: 2,
            explanation: "Day and night are opposites. Summer and winter are opposite seasons - one is hot, one is cold!"
          },
          {
            id: 53,
            question: "Hand is to glove as foot is to ___?",
            options: ["shoe", "walk", "toe", "leg"],
            correct: 0,
            explanation: "A glove goes on your hand, and a shoe goes on your foot. They're both things we wear!"
          }
        ]
      },
      wordpatterns: {
        name: "Word Patterns",
        questions: [
          {
            id: 54,
            question: "Which word doesn't belong: apple, banana, carrot, orange?",
            options: ["apple", "banana", "carrot", "orange"],
            correct: 2,
            explanation: "Carrot is a vegetable, while apple, banana, and orange are all fruits!"
          },
          {
            id: 55,
            question: "Complete the pattern: 2, 4, 6, 8, ___?",
            options: ["9", "10", "11", "12"],
            correct: 1,
            explanation: "This is counting by 2s (even numbers): 2, 4, 6, 8, 10. Each number is 2 more than the one before!"
          },
          {
            id: 56,
            question: "Which word completes the group: chair, table, sofa, ___?",
            options: ["garden", "bed", "car", "book"],
            correct: 1,
            explanation: "Chair, table, sofa, and bed are all furniture - things we have in our homes!"
          },
          {
            id: 57,
            question: "Find the odd one out: happy, joyful, sad, cheerful?",
            options: ["happy", "joyful", "sad", "cheerful"],
            correct: 2,
            explanation: "Happy, joyful, and cheerful all mean feeling good. Sad is the opposite - it's the odd one out!"
          },
          {
            id: 58,
            question: "Complete the pattern: Monday, Tuesday, Wednesday, ___?",
            options: ["Friday", "Thursday", "Weekend", "Sunday"],
            correct: 1,
            explanation: "These are the days of the week in order. After Wednesday comes Thursday!"
          }
        ]
      },
      codes: {
        name: "Letter Codes",
        questions: [
          {
            id: 59,
            question: "If CAT = 3120, what does DOG = ? (A=1, B=2, C=3...)",
            options: ["4157", "41507", "4-15-7", "4 15 7"],
            correct: 0,
            explanation: "C=3, A=1, T=20, so CAT=3120. D=4, O=15, G=7, so DOG=4157. Each letter has a number!"
          },
          {
            id: 60,
            question: "If A=Z, B=Y, C=X, what does CAT become?",
            options: ["XZG", "ZXG", "XZH", "ZYX"],
            correct: 0,
            explanation: "The alphabet is reversed! C becomes X, A becomes Z, T becomes G. So CAT = XZG!"
          },
          {
            id: 61,
            question: "Move each letter forward 1 in the alphabet: What does BAD become?",
            options: ["CBE", "ABC", "CAD", "CDE"],
            correct: 0,
            explanation: "B becomes C, A becomes B, D becomes E. So BAD becomes CBE when we move each letter forward one!"
          }
        ]
      },
      logic: {
        name: "Logic Puzzles",
        questions: [
          {
            id: 62,
            question: "If all cats have tails, and Fluffy is a cat, what can we say?",
            options: ["Fluffy might have a tail", "Fluffy has a tail", "Fluffy has no tail", "We can't tell"],
            correct: 1,
            explanation: "If ALL cats have tails, and Fluffy is a cat, then Fluffy must have a tail. That's logical!"
          },
          {
            id: 63,
            question: "Tom is taller than Sam. Sam is taller than Ben. Who is the shortest?",
            options: ["Tom", "Sam", "Ben", "Can't tell"],
            correct: 2,
            explanation: "Tom > Sam > Ben, so Ben is the shortest. Tom is the tallest!"
          },
          {
            id: 64,
            question: "If it rains, the grass gets wet. The grass is wet. What can we say?",
            options: ["It must have rained", "It might have rained", "It didn't rain", "It never rains"],
            correct: 1,
            explanation: "The grass could be wet from rain, but also from a sprinkler or hose! So it MIGHT have rained, but we can't be sure."
          },
          {
            id: 65,
            question: "Emma is older than Jake. Jake is older than Mia. Who is the oldest?",
            options: ["Emma", "Jake", "Mia", "Can't tell"],
            correct: 0,
            explanation: "Emma > Jake > Mia in age, so Emma is the oldest! Great logical thinking!"
          }
        ]
      }
    }
  }
};
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('quiz-history');
    if (saved) {
      setQuizHistory(JSON.parse(saved));
    }
  }, []);

  const saveQuizResult = (subject, topic, score, total) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      subject,
      topic,
      score,
      total,
      percentage: Math.round((score / total) * 100)
    };

    const updatedHistory = [...quizHistory, newResult];
    setQuizHistory(updatedHistory);
    localStorage.setItem('quiz-history', JSON.stringify(updatedHistory));
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('topics');
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setCurrentView('quiz');
  };

  const handleAnswerSelect = (optionIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    
    const questions = questionData[selectedSubject].topics[selectedTopic].questions;
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct;
    
    setAnswers([...answers, {
      questionId: questions[currentQuestionIndex].id,
      correct: isCorrect
    }]);
  };

  const handleNextQuestion = () => {
    const questions = questionData[selectedSubject].topics[selectedTopic].questions;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowTutorChat(false);
      setChatMessages([]);
    } else {
      const correctCount = answers.filter(a => a.correct).length;
      const topicName = questionData[selectedSubject].topics[selectedTopic].name;
      saveQuizResult(selectedSubject, topicName, correctCount, answers.length);
      setCurrentView('results');
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
    setCurrentView('quiz');
  };

  const handleHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
    setSelectedTopic(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowTutorChat(false);
    setChatMessages([]);
  };

  const handleAskTutor = () => {
    setShowTutorChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Hi! I'm your AI tutor. 😊 I'm here to help you understand this question better. What part would you like me to explain more?"
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isAiThinking) return;

    const questions = questionData[selectedSubject].topics[selectedTopic].questions;
    const currentQuestion = questions[currentQuestionIndex];
    
    const newUserMessage = { role: 'user', content: userMessage };
    const updatedMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedMessages);
    setUserMessage('');
    setIsAiThinking(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a friendly, patient tutor helping a 9-year-old child understand a question from their 11+ exam practice. 

The question was: "${currentQuestion.question}"
The options were: ${currentQuestion.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join(', ')}
The correct answer is: ${String.fromCharCode(65 + currentQuestion.correct)}) ${currentQuestion.options[currentQuestion.correct]}
The child selected: ${String.fromCharCode(65 + selectedAnswer)}) ${currentQuestion.options[selectedAnswer]}
${selectedAnswer === currentQuestion.correct ? 'The child got this question CORRECT!' : 'The child got this question wrong.'}

The explanation already given was: "${currentQuestion.explanation}"

Your job is to:
- Answer their questions in a kind, encouraging way
- If they got it right, you can praise them and help deepen their understanding
- If they got it wrong, help them learn without making them feel bad
- Break things down into simpler steps if needed
- Use examples or analogies that a 9-year-old would understand
- Be patient and supportive
- Keep responses short and clear (2-3 sentences usually)
- Use encouraging words like "Great question!", "Let me explain that differently", "You're doing great!"
- Relate to things they might know from daily life

Remember: This is a child learning, so be warm, supportive, and make learning fun!`,
          messages: updatedMessages
        })
      });

      const data = await response.json();
      const aiResponse = data.content.find(item => item.type === 'text')?.text || 
                        "I'm here to help! Could you ask that in a different way?";
      
      setChatMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setChatMessages([...updatedMessages, { 
        role: 'assistant', 
        content: "Oops! I had trouble connecting. Could you try asking again?" 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 mt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-3">
              11+ Test Prep 🎓
              - Built by Ben!
            </h1>
            <p className="text-lg text-purple-700">Choose a subject to start practicing!</p>
          </div>

          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setCurrentView('progress')}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-purple-300"
            >
              <BarChart3 className="w-5 h-5" />
              View My Progress
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <SubjectCard
              title="Maths"
              icon={Calculator}
              color="bg-blue-500"
              onClick={() => handleSubjectSelect('maths')}
            />
            <SubjectCard
              title="English"
              icon={BookOpen}
              color="bg-green-500"
              onClick={() => handleSubjectSelect('english')}
            />
            <SubjectCard
              title="Verbal Reasoning"
              icon={Brain}
              color="bg-purple-500"
              onClick={() => handleSubjectSelect('verbalreasoning')}
              
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'topics') {
    const subject = questionData[selectedSubject];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleHome}
            className="mb-6 flex items-center text-purple-700 hover:text-purple-900 font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-900 mb-2">
              {subject.name} Topics
            </h2>
            <p className="text-purple-700">Pick a topic to practice</p>
          </div>
          
          <div className="space-y-4">
            {Object.entries(subject.topics).map(([key, topic]) => (
              <TopicCard
                key={key}
                title={topic.name}
                questionCount={topic.questions.length}
                onClick={() => handleTopicSelect(key)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    const questions = questionData[selectedSubject].topics[selectedTopic].questions;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentView('topics')}
            className="mb-6 flex items-center text-purple-700 hover:text-purple-900 font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Topics
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-purple-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-lg ${
                      showFeedback
                        ? idx === currentQuestion.correct
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : idx === selectedAnswer
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'border-gray-200 bg-gray-50 text-gray-500'
                        : selectedAnswer === idx
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 text-gray-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {!showFeedback && selectedAnswer !== null && (
                <button
                  onClick={handleCheckAnswer}
                  className="w-full mt-4 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors text-lg"
                >
                  Check Answer
                </button>
              )}
              
              {showFeedback && (
                <div className={`mt-6 p-4 rounded-xl ${
                  isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                }`}>
                  <div className="flex items-start">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                        {isCorrect ? 'Correct! Well done! 🌟' : 'Not quite right, but that\'s okay! 💪'}
                      </p>
                      <p className="text-gray-800">{currentQuestion.explanation}</p>
                      
                      <button
                        onClick={handleAskTutor}
                        className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        💬 Talk to AI Tutor
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {showTutorChat && (
                <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-bold text-blue-900">AI Tutor Chat</h4>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 mb-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="text-left mb-3">
                        <div className="inline-block p-3 rounded-lg bg-gray-100">
                          <p className="text-sm text-gray-600">Tutor is thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask your question here..."
                      disabled={isAiThinking}
                      className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim() || isAiThinking}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {showFeedback && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center text-lg"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'results') {
    const correctCount = answers.filter(a => a.correct).length;
    const totalCount = answers.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-purple-900 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-xl text-gray-700">
                {percentage >= 80
                  ? 'Amazing work! You\'re a star!'
                  : percentage >= 60
                  ? 'Great effort! Keep practicing!'
                  : 'Good try! Practice makes perfect!'}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <div className="text-5xl font-bold text-purple-900 mb-2">
                {correctCount} / {totalCount}
              </div>
              <p className="text-lg text-purple-700">Questions Correct</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{percentage}%</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => setCurrentView('topics')}
                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Choose Topic
              </button>
            </div>
            
            <button
              onClick={handleHome}
              className="mt-4 w-full py-3 text-purple-700 hover:text-purple-900 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'progress') {
    const groupedBySubject = {};
    quizHistory.forEach(quiz => {
      if (!groupedBySubject[quiz.subject]) {
        groupedBySubject[quiz.subject] = [];
      }
      groupedBySubject[quiz.subject].push(quiz);
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleHome}
            className="mb-6 flex items-center text-purple-700 hover:text-purple-900 font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-900 mb-2 flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8" />
              My Progress
            </h2>
            <p className="text-lg text-purple-700">Track your learning journey!</p>
          </div>

          {quizHistory.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No quizzes taken yet!</h3>
              <p className="text-gray-600 mb-6">Start practicing to see your progress here.</p>
              <button
                onClick={handleHome}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
              >
                Start Learning
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBySubject).map(([subject, quizzes]) => {
                const subjectData = questionData[subject];
                const SubjectIcon = subjectData?.icon || BookOpen;
                const subjectName = subjectData?.name || subject;
                
                const totalQuizzes = quizzes.length;
                const totalScore = quizzes.reduce((sum, q) => sum + q.score, 0);
                const totalQuestions = quizzes.reduce((sum, q) => sum + q.total, 0);
                const avgPercentage = Math.round((totalScore / totalQuestions) * 100);
                
                const subjectColors = {
                  maths: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', icon: 'text-blue-600' },
                  english: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', icon: 'text-green-600' }
                };
                const colors = subjectColors[subject] || subjectColors.maths;

                return (
                  <div key={subject} className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${colors.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <SubjectIcon className={`w-8 h-8 ${colors.icon}`} />
                      <h3 className={`text-2xl font-bold ${colors.text}`}>{subjectName}</h3>
                    </div>

                    <div className={`${colors.bg} rounded-xl p-4 mb-4`}>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
                          <p className="text-sm text-gray-600">Quizzes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{avgPercentage}%</p>
                          <p className="text-sm text-gray-600">Average</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{totalScore}/{totalQuestions}</p>
                          <p className="text-sm text-gray-600">Correct</p>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-3">Topics:</h4>
                    <div className="space-y-2">
                      {[...quizzes].reverse().map((quiz) => {
                        const date = new Date(quiz.date);
                        const formattedDate = date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        
                        return (
                          <div key={quiz.id} className={`flex items-center justify-between p-3 ${colors.bg} rounded-lg border ${colors.border}`}>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{quiz.topic}</p>
                              <p className="text-sm text-gray-600">{formattedDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-purple-900">{quiz.percentage}%</p>
                              <p className="text-sm text-gray-600">{quiz.score}/{quiz.total}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function SubjectCard({ title, icon: Icon, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} hover:opacity-90 text-white rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-2xl font-bold">{title}</h3>
      {disabled && <p className="text-sm mt-2">Coming Soon</p>}
    </button>
  );
}

function TopicCard({ title, questionCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white hover:bg-purple-50 rounded-xl p-6 transition-all shadow-md hover:shadow-lg border-2 border-transparent hover:border-purple-300 flex items-center justify-between group"
    >
      <div className="text-left">
        <h4 className="text-xl font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-purple-600 font-medium">{questionCount} questions</p>
      </div>
      <ChevronRight className="w-8 h-8 text-purple-500 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default App;
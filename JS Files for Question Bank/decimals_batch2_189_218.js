// DECIMALS BATCH 2 - Questions 189-218 (30 NEW Questions)
// Topics: Decimal↔Fraction conversion, Subtracting decimals D3,
// Fraction→Decimal, Multiply by 10/100/1000, Multiplying decimals by whole,
// Rounding decimals, Master column addition D3
// All answers verified manually

// ===== DECIMAL TO FRACTION (IDs 189–194) =====
    {
      id: 189,
      difficulty: 1,
      question: "Convert 0.75 to a fraction in its simplest form.",
      options: ["7/5", "3/4", "75/10", "7/10", "15/20"],
      correct: 1,
      explanation: "0.75 = 75/100. Divide both by 25: 75 ÷ 25 = 3, 100 ÷ 25 = 4. So 0.75 = 3/4. ✓"
    },
    {
      id: 190,
      difficulty: 2,
      question: "Convert 0.125 to a fraction in its simplest form.",
      options: ["1/8", "1/5", "1/4", "12/100", "125/10"],
      correct: 0,
      explanation: "0.125 = 125/1000. Divide both by 125: 125 ÷ 125 = 1, 1000 ÷ 125 = 8. So 0.125 = 1/8. ✓"
    },
    {
      id: 191,
      difficulty: 2,
      question: "Convert 0.6 to a fraction in its simplest form.",
      options: ["6/100", "1/6", "2/3", "3/5", "6/5"],
      correct: 3,
      explanation: "0.6 = 6/10. Divide both by 2: 6 ÷ 2 = 3, 10 ÷ 2 = 5. So 0.6 = 3/5. ✓"
    },
    {
      id: 192,
      difficulty: 2,
      question: "Convert 0.375 to a fraction in its simplest form.",
      options: ["3/8", "3/7", "37/100", "375/10", "3/10"],
      correct: 0,
      explanation: "0.375 = 375/1000. Divide both by 125: 375 ÷ 125 = 3, 1000 ÷ 125 = 8. So 0.375 = 3/8. ✓"
    },
    {
      id: 193,
      difficulty: 3,
      question: "Put these in order from smallest to largest: 3/8, 0.4, 0.35",
      options: ["0.35, 3/8, 0.4", "3/8, 0.35, 0.4", "0.4, 0.35, 3/8", "0.35, 0.4, 3/8", "3/8, 0.4, 0.35"],
      correct: 0,
      explanation: "Convert all to decimals: 3/8 = 0.375, 0.4 = 0.4, 0.35 = 0.35. In order: 0.35, 0.375, 0.4. So the order is 0.35, 3/8, 0.4. ✓"
    },
    {
      id: 194,
      difficulty: 3,
      question: "Which of these is NOT equal to the others? 0.4, 2/5, 40/100, 4/9, 0.40",
      options: ["0.4", "2/5", "40/100", "4/9", "0.40"],
      correct: 3,
      explanation: "0.4 = 2/5 = 40/100 = 0.40 — they are all equal to 0.4. But 4/9 = 0.444... which is not equal to 0.4. So 4/9 is the odd one out. ✓"
    },
// ===== SUBTRACTING DECIMALS D3 (IDs 195–199) =====
    {
      id: 195,
      difficulty: 3,
      question: "What is £20 − £13.67?",
      options: ["£6.23", "£6.33", "£6.43", "£7.33", "£7.67"],
      correct: 1,
      explanation: "£20.00 − £13.67: Start from the hundredths. 0 − 7: borrow to get 10 − 7 = 3. Tenths: 9 − 6 = 3 (after borrowing). Ones: 9 − 3 = 6. Tens: 1 − 1 = 0. Answer: £6.33. ✓"
    },
    {
      id: 196,
      difficulty: 3,
      question: "What is 5.003 − 2.997?",
      options: ["2.006", "2.016", "2.106", "3.006", "2.996"],
      correct: 0,
      explanation: "5.003 − 2.997: Thousandths: 3 − 7, borrow to get 13 − 7 = 6. Hundredths: 9 − 9 = 0 (after borrowing). Tenths: 9 − 9 = 0 (after borrowing). Ones: 4 − 2 = 2. Answer: 2.006. ✓"
    },
    {
      id: 197,
      difficulty: 3,
      question: "A plank is 3.2 metres long. Three pieces of 0.85 metres are cut from it. How much wood is left?",
      options: ["0.55 m", "0.60 m", "0.65 m", "1.50 m", "1.65 m"],
      correct: 2,
      explanation: "Total cut: 3 × 0.85 = 2.55 m. Remaining: 3.20 − 2.55 = 0.65 m. ✓"
    },
    {
      id: 198,
      difficulty: 3,
      question: "A jug holds 2 litres of water. Amira pours out 0.78 litres, then pours out another 0.65 litres. How much water is left in the jug?",
      options: ["0.43 litres", "0.47 litres", "0.57 litres", "0.67 litres", "1.43 litres"],
      correct: 2,
      explanation: "Total poured out: 0.78 + 0.65 = 1.43 litres. Remaining: 2.00 − 1.43 = 0.57 litres. ✓"
    },
    {
      id: 199,
      difficulty: 3,
      question: "Harry has £50. He buys a book for £7.85 and a toy for £14.99. How much does he have left?",
      options: ["£26.16", "£27.16", "£27.26", "£28.16", "£22.85"],
      correct: 1,
      explanation: "Total spent: £7.85 + £14.99 = £22.84. Change: £50.00 − £22.84 = £27.16. ✓"
    },
// ===== FRACTION TO DECIMAL D2/D3 (IDs 200–204) =====
    {
      id: 200,
      difficulty: 2,
      question: "Convert 5/8 to a decimal.",
      options: ["0.58", "0.6", "0.625", "0.65", "0.675"],
      correct: 2,
      explanation: "5/8 means 5 ÷ 8. 8 goes into 5.000: 0.625. So 5/8 = 0.625. ✓"
    },
    {
      id: 201,
      difficulty: 2,
      question: "Convert 7/20 to a decimal.",
      options: ["0.07", "0.35", "0.37", "0.7", "3.5"],
      correct: 1,
      explanation: "7/20 means 7 ÷ 20. Multiply top and bottom by 5: 7/20 = 35/100 = 0.35. ✓"
    },
    {
      id: 202,
      difficulty: 3,
      question: "Convert 7/11 to a decimal, rounded to 2 decimal places.",
      options: ["0.63", "0.64", "0.66", "0.70", "0.77"],
      correct: 1,
      explanation: "7 ÷ 11 = 0.6363... The digit in the third decimal place is 6, which rounds up. So 7/11 ≈ 0.64 to 2 decimal places. ✓"
    },
    {
      id: 203,
      difficulty: 3,
      question: "Which is larger: 3/7 or 0.43?",
      options: ["3/7", "0.43", "They are equal", "Cannot tell", "It depends on the denominator"],
      correct: 1,
      explanation: "Convert 3/7 to a decimal: 3 ÷ 7 = 0.4285... Compare: 0.4285 < 0.43. So 0.43 is larger. ✓"
    },
    {
      id: 204,
      difficulty: 3,
      question: "Convert 5/6 to a decimal, rounded to 2 decimal places.",
      options: ["0.56", "0.80", "0.83", "0.84", "0.86"],
      correct: 2,
      explanation: "5 ÷ 6 = 0.8333... The digit in the third decimal place is 3, which rounds down. So 5/6 ≈ 0.83 to 2 decimal places. ✓"
    },
// ===== MULTIPLY BY 10/100/1000 D2/D3 (IDs 205–208) =====
    {
      id: 205,
      difficulty: 2,
      question: "What is 0.045 × 1000?",
      options: ["0.45", "4.5", "45", "450", "4500"],
      correct: 2,
      explanation: "To multiply by 1000, move the decimal point 3 places to the right. 0.045 × 1000 = 45. ✓"
    },
    {
      id: 206,
      difficulty: 2,
      question: "A tile weighs 0.35 kg. What do 100 tiles weigh?",
      options: ["3.5 kg", "35 kg", "350 kg", "0.035 kg", "3500 kg"],
      correct: 1,
      explanation: "0.35 × 100 = 35. Move the decimal point 2 places to the right. 100 tiles weigh 35 kg. ✓"
    },
    {
      id: 207,
      difficulty: 3,
      question: "A penny weighs 3.56 grams. What do 10,000 pennies weigh in kilograms?",
      options: ["3.56 kg", "35.6 kg", "356 kg", "3560 kg", "0.356 kg"],
      correct: 1,
      explanation: "Weight in grams: 3.56 × 10,000 = 35,600 g. Convert to kg: 35,600 ÷ 1000 = 35.6 kg. ✓"
    },
    {
      id: 208,
      difficulty: 3,
      question: "A raindrop holds 0.0042 litres of water. How many litres is that for 10,000 raindrops?",
      options: ["0.42 litres", "4.2 litres", "42 litres", "420 litres", "4200 litres"],
      correct: 2,
      explanation: "0.0042 × 10,000: move the decimal 4 places to the right. 0.0042 × 10,000 = 42 litres. ✓"
    },
// ===== MULTIPLYING DECIMALS BY WHOLE NUMBERS D2/D3 (IDs 209–212) =====
    {
      id: 209,
      difficulty: 2,
      question: "A plank costs £3.45 per metre. How much do 8 metres cost?",
      options: ["£24.60", "£27.20", "£27.60", "£28.40", "£31.60"],
      correct: 2,
      explanation: "8 × £3.45: 8 × £3 = £24, 8 × £0.45 = £3.60. Total: £24 + £3.60 = £27.60. ✓"
    },
    {
      id: 210,
      difficulty: 3,
      question: "What is 7 × 0.99?",
      options: ["6.30", "6.93", "7.07", "7.63", "7.93"],
      correct: 1,
      explanation: "7 × 0.99: Think of it as 7 × 1 − 7 × 0.01 = 7 − 0.07 = 6.93. Or multiply: 7 × 99 = 693, then place the decimal: 6.93. ✓"
    },
    {
      id: 211,
      difficulty: 3,
      question: "A machine produces 0.035 kg of powder per minute. How much does it produce in 200 minutes?",
      options: ["0.70 kg", "3.5 kg", "7 kg", "35 kg", "70 kg"],
      correct: 2,
      explanation: "0.035 × 200: 0.035 × 2 = 0.07, then × 100 = 7 kg. Or: 35 × 200 = 7000, and 3 decimal places gives 7.000 = 7 kg. ✓"
    },
    {
      id: 212,
      difficulty: 3,
      question: "Rosie buys 12 notebooks at £1.35 each. How much does she spend?",
      options: ["£15.00", "£15.20", "£16.00", "£16.20", "£16.35"],
      correct: 3,
      explanation: "12 × £1.35: 12 × £1 = £12, 12 × £0.35 = £4.20. Total: £12 + £4.20 = £16.20. Check: 10 × £1.35 = £13.50, 2 × £1.35 = £2.70, total = £16.20. ✓"
    },
// ===== ROUNDING DECIMALS D2/D3 (IDs 213–216) =====
    {
      id: 213,
      difficulty: 2,
      question: "Round 4.652 to 1 decimal place.",
      options: ["4.6", "4.65", "4.7", "5.0", "4.5"],
      correct: 2,
      explanation: "Look at the second decimal place: 5. Since 5 rounds up, 4.652 rounds to 4.7 to 1 decimal place. ✓"
    },
    {
      id: 214,
      difficulty: 2,
      question: "Round 8.995 to 2 decimal places.",
      options: ["8.99", "8.90", "9.00", "9.10", "8.10"],
      correct: 2,
      explanation: "Look at the third decimal place: 5. Since 5 rounds up, 8.995 rounds to 9.00. The 99 becomes 100, carrying into the ones. ✓"
    },
    {
      id: 215,
      difficulty: 3,
      question: "A calculator shows 3.14159. What is this rounded to 3 decimal places?",
      options: ["3.141", "3.142", "3.140", "3.150", "3.145"],
      correct: 1,
      explanation: "Look at the fourth decimal place: 5. Since 5 rounds up, 3.14159 rounds to 3.142 to 3 decimal places. ✓"
    },
    {
      id: 216,
      difficulty: 3,
      question: "Two lengths are 3.456 m and 2.789 m. What is their total, rounded to 1 decimal place?",
      options: ["6.1", "6.2", "6.24", "6.25", "6.3"],
      correct: 1,
      explanation: "Total: 3.456 + 2.789 = 6.245 m. Round to 1 decimal place: look at the second decimal place, which is 4. Since 4 < 5, round down. Answer: 6.2 m. ✓"
    },
// ===== MASTER COLUMN ADDITION D3 (IDs 217–218) =====
    {
      id: 217,
      difficulty: 3,
      question: "What is 12.456 + 8.79 + 3.5?",
      options: ["23.746", "24.246", "24.646", "24.746", "25.746"],
      correct: 3,
      explanation: "Line up the decimal points: 12.456 + 8.790 + 3.500. Thousandths: 6 + 0 + 0 = 6. Hundredths: 5 + 9 + 0 = 14, write 4 carry 1. Tenths: 4 + 7 + 5 + 1 = 17, write 7 carry 1. Ones: 2 + 8 + 3 + 1 = 14, write 4 carry 1. Tens: 1 + 1 = 2. Answer: 24.746. ✓"
    },
    {
      id: 218,
      difficulty: 3,
      question: "Four items cost £3.99, £12.50, £0.75, and £8.49. What is the total?",
      options: ["£24.73", "£25.23", "£25.73", "£26.23", "£26.73"],
      correct: 2,
      explanation: "Add in pairs: £3.99 + £12.50 = £16.49. Then £0.75 + £8.49 = £9.24. Total: £16.49 + £9.24 = £25.73. ✓"
    },

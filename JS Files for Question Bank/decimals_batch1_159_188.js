// Decimals Batch 1 — IDs 159–188
// Place Value (159–166), Decimal to Percentage (167–174),
// Divide by 10/100/1000 (175–181), Word Problems D1/D2 (182–188)
// NOTE: PlaceValueChart must be added to quizVisualComponents in App.js

    // ========== DECIMAL PLACE VALUE (159–166) ==========
    {
      id: 159,
      difficulty: 1,
      visual: { component: "PlaceValueChart", props: { columns: ["Ones", ".", "Tenths", "Hundredths"], rows: [{ values: [3, ".", 4, 5] }], highlight: [[0, 2]] } },
      question: "What is the value of the digit 4 in the number 3.45?",
      options: ["4", "0.4", "0.04", "40", "0.004"],
      correct: 1,
      explanation: "The 4 is in the tenths column, so its value is 4 tenths = 0.4. ✓"
    },
    {
      id: 160,
      difficulty: 1,
      question: "How many hundredths are there in 0.07?",
      options: ["0.7", "70", "7", "0.07", "0.007"],
      correct: 2,
      explanation: "In 0.07, the 7 is in the hundredths column. There are 7 hundredths. ✓"
    },
    {
      id: 161,
      difficulty: 1,
      question: "In the number 5.82, what is the value of the digit 8?",
      options: ["8", "0.8", "0.08", "80", "0.008"],
      correct: 1,
      explanation: "The 8 is in the tenths column, so its value is 8 tenths = 0.8. ✓"
    },
    {
      id: 162,
      difficulty: 1,
      visual: { component: "PlaceValueChart", props: { columns: ["Ones", ".", "Tenths", "Hundredths"], rows: [{ values: [6, ".", 1, 9] }], highlight: [[0, 3]] } },
      question: "What is the value of the digit 9 in the number 6.19?",
      options: ["9", "0.9", "0.09", "90", "0.009"],
      correct: 2,
      explanation: "The 9 is in the hundredths column, so its value is 9 hundredths = 0.09. ✓"
    },
    {
      id: 163,
      difficulty: 2,
      question: "Which digit is in the thousandths place in 2.468?",
      options: ["2", "4", "6", "8", "0"],
      correct: 3,
      explanation: "In 2.468: 4 is in the tenths place, 6 is in the hundredths place, and 8 is in the thousandths place. ✓"
    },
    {
      id: 164,
      difficulty: 2,
      question: "Write 3 tenths and 5 hundredths as a decimal.",
      options: ["3.5", "0.35", "0.305", "0.53", "35"],
      correct: 1,
      explanation: "3 tenths = 0.3 and 5 hundredths = 0.05. Together that is 0.3 + 0.05 = 0.35. ✓"
    },
    {
      id: 165,
      difficulty: 2,
      visual: { component: "PlaceValueChart", props: { columns: ["Tens", "Ones", ".", "Tenths", "Hundredths", "Thousandths"], rows: [{ values: ["", 7, ".", 0, 6, 3] }], highlight: [[0, 4]] } },
      question: "In the number 7.063, what is the value of the digit 6?",
      options: ["6", "0.6", "0.06", "0.006", "60"],
      correct: 2,
      explanation: "In 7.063: 0 is in the tenths place, 6 is in the hundredths place (value = 0.06), and 3 is in the thousandths place. ✓"
    },
    {
      id: 166,
      difficulty: 3,
      question: "A number has 2 in the ones place, 4 in the tenths place and 7 in the thousandths place. What is the number?",
      options: ["2.47", "2.407", "2.470", "2.047", "2.704"],
      correct: 1,
      explanation: "2 in the ones = 2, 4 in the tenths = 0.4, nothing in the hundredths = 0, and 7 in the thousandths = 0.007. So the number is 2.407. ✓"
    },

    // ========== DECIMAL TO PERCENTAGE (167–174) ==========
    {
      id: 167,
      difficulty: 1,
      question: "Convert 0.25 to a percentage.",
      options: ["2.5%", "0.25%", "25%", "250%", "0.025%"],
      correct: 2,
      explanation: "To convert a decimal to a percentage, multiply by 100. 0.25 × 100 = 25%. ✓"
    },
    {
      id: 168,
      difficulty: 1,
      question: "Convert 0.7 to a percentage.",
      options: ["7%", "0.7%", "0.07%", "70%", "700%"],
      correct: 3,
      explanation: "Multiply by 100: 0.7 × 100 = 70%. ✓"
    },
    {
      id: 169,
      difficulty: 1,
      question: "Convert 0.5 to a percentage.",
      options: ["5%", "0.5%", "50%", "500%", "0.05%"],
      correct: 2,
      explanation: "Multiply by 100: 0.5 × 100 = 50%. ✓"
    },
    {
      id: 170,
      difficulty: 2,
      question: "Convert 0.125 to a percentage.",
      options: ["125%", "1.25%", "12.5%", "0.125%", "1250%"],
      correct: 2,
      explanation: "Multiply by 100: 0.125 × 100 = 12.5%. ✓"
    },
    {
      id: 171,
      difficulty: 2,
      question: "In a class survey, 0.45 of the children chose football as their favourite sport. What percentage of the class chose football?",
      options: ["4.5%", "0.45%", "450%", "45%", "0.045%"],
      correct: 3,
      explanation: "To convert a decimal to a percentage, multiply by 100. 0.45 × 100 = 45%. ✓"
    },
    {
      id: 172,
      difficulty: 2,
      question: "A jug is 0.08 full. What percentage of the jug is full?",
      options: ["80%", "0.8%", "0.08%", "8%", "800%"],
      correct: 3,
      explanation: "Multiply by 100: 0.08 × 100 = 8%. ✓"
    },
    {
      id: 173,
      difficulty: 3,
      question: "A shop gives a 0.15 discount on all items. Charlotte buys a coat costing £60. How much money does she save?",
      options: ["£1.50", "£6.00", "£9.00", "£15.00", "£0.90"],
      correct: 2,
      explanation: "0.15 as a percentage is 15%. 15% of £60 = 60 × 0.15 = £9.00. ✓"
    },
    {
      id: 174,
      difficulty: 3,
      question: "In a school of 400 pupils, 0.35 walk to school and 0.4 travel by car. What percentage of pupils use a different method of travel?",
      options: ["75%", "15%", "25%", "35%", "65%"],
      correct: 2,
      explanation: "0.35 + 0.4 = 0.75 of the pupils walk or travel by car. The rest = 1 − 0.75 = 0.25. Convert: 0.25 × 100 = 25%. ✓"
    },

    // ========== DIVIDE BY 10/100/1000 (175–181) ==========
    {
      id: 175,
      difficulty: 2,
      question: "What is 45.6 ÷ 100?",
      options: ["4.56", "0.456", "456", "4560", "0.0456"],
      correct: 1,
      explanation: "When dividing by 100, move the decimal point two places to the left. 45.6 ÷ 100 = 0.456. ✓"
    },
    {
      id: 176,
      difficulty: 2,
      question: "A ribbon is 3500 mm long. How many metres is this?",
      options: ["35 m", "3.5 m", "350 m", "0.35 m", "0.035 m"],
      correct: 1,
      explanation: "There are 1000 mm in a metre. 3500 ÷ 1000 = 3.5 m. ✓"
    },
    {
      id: 177,
      difficulty: 2,
      question: "What is 7.2 ÷ 100?",
      options: ["72", "0.72", "0.072", "0.0072", "720"],
      correct: 2,
      explanation: "Dividing by 100 moves the decimal point two places to the left. 7.2 ÷ 100 = 0.072. ✓"
    },
    {
      id: 178,
      difficulty: 2,
      question: "A bag of sand weighs 25,000 g. How many kilograms is this?",
      options: ["2.5 kg", "250 kg", "25 kg", "2500 kg", "0.25 kg"],
      correct: 2,
      explanation: "There are 1000 g in a kilogram. 25,000 ÷ 1000 = 25 kg. ✓"
    },
    {
      id: 179,
      difficulty: 3,
      question: "A factory makes 12,500 items. They are packed into boxes of 1000. How many boxes are needed?",
      options: ["12", "12.5", "13", "125", "1.25"],
      correct: 2,
      explanation: "12,500 ÷ 1000 = 12.5 boxes. Since you cannot have half a box, you need 13 boxes to pack all the items. ✓"
    },
    {
      id: 180,
      difficulty: 3,
      question: "Convert 0.035 km to metres.",
      options: ["3.5 m", "350 m", "0.35 m", "35 m", "3500 m"],
      correct: 3,
      explanation: "To convert km to metres, multiply by 1000. 0.035 × 1000 = 35 m. ✓"
    },
    {
      id: 181,
      difficulty: 3,
      question: "A swimming pool holds 4,750 litres of water. The pool is drained at a rate of 100 litres per minute. How many minutes does it take to drain to exactly 250 litres remaining?",
      options: ["45", "47", "47.5", "48", "50"],
      correct: 0,
      explanation: "Water to drain = 4,750 − 250 = 4,500 litres. Time = 4,500 ÷ 100 = 45 minutes. ✓"
    },

    // ========== DECIMAL WORD PROBLEMS D1/D2 (182–188) ==========
    {
      id: 182,
      difficulty: 1,
      question: "Tom buys a sandwich for £2.50 and a drink for £1.30. How much does he spend altogether?",
      options: ["£3.20", "£3.80", "£4.00", "£3.70", "£4.80"],
      correct: 1,
      explanation: "£2.50 + £1.30: Add the pounds: 2 + 1 = 3. Add the pence: 50p + 30p = 80p. Total = £3.80. ✓"
    },
    {
      id: 183,
      difficulty: 1,
      question: "A rope is 4.5 m long. Emma cuts off 1.2 m. How much rope is left?",
      options: ["3.3 m", "3.7 m", "2.3 m", "5.7 m", "3.2 m"],
      correct: 0,
      explanation: "4.5 − 1.2: Subtract the whole numbers: 4 − 1 = 3. Subtract the decimals: 0.5 − 0.2 = 0.3. So 3 + 0.3 = 3.3 m. ✓"
    },
    {
      id: 184,
      difficulty: 1,
      question: "A pencil costs £0.35. Amelia buys 4 pencils. How much does she pay?",
      options: ["£1.20", "£1.40", "£1.50", "£0.39", "£1.35"],
      correct: 1,
      explanation: "£0.35 × 4: Think 35p × 4 = 140p = £1.40. ✓"
    },
    {
      id: 185,
      difficulty: 2,
      question: "Oliver buys 3 books at £4.99 each. How much change does he get from £20?",
      options: ["£4.97", "£5.03", "£5.97", "£4.03", "£5.01"],
      correct: 1,
      explanation: "Cost = 3 × £4.99 = £14.97. Change = £20.00 − £14.97 = £5.03. ✓"
    },
    {
      id: 186,
      difficulty: 2,
      question: "A recipe needs 0.75 kg of flour. Sophie wants to make 3 batches. How much flour does she need in total?",
      options: ["1.50 kg", "2.00 kg", "2.25 kg", "2.75 kg", "3.25 kg"],
      correct: 2,
      explanation: "0.75 × 3: Think 75 × 3 = 225, so 0.75 × 3 = 2.25 kg. ✓"
    },
    {
      id: 187,
      difficulty: 2,
      question: "Harry runs 2.4 km on Monday and 3.75 km on Tuesday. How much further did he run on Tuesday?",
      options: ["1.15 km", "1.25 km", "1.35 km", "1.45 km", "1.55 km"],
      correct: 2,
      explanation: "3.75 − 2.40 = 1.35 km. Line up the decimal points: 75 − 40 = 35 hundredths, 3 − 2 = 1 one. So the difference is 1.35 km. ✓"
    },
    {
      id: 188,
      difficulty: 2,
      question: "A bottle holds 1.5 litres of juice. Mia pours out 4 glasses, each holding 0.25 litres. How much juice is left in the bottle?",
      options: ["0.25 litres", "0.5 litres", "0.75 litres", "1.0 litres", "1.25 litres"],
      correct: 1,
      explanation: "Juice poured = 4 × 0.25 = 1.0 litre. Juice left = 1.5 − 1.0 = 0.5 litres. ✓"
    },

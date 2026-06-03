// ============================================================
// Supplementary sub-concepts for Decimals (14 of 15 — master "adding-decimals" already exists)
// To merge: add these to lessonBank.decimals.subConcepts array in lessonData.js
// ============================================================
import { generateDistractors } from '../lessonData.js';

// Helper: generate decimal distractors with appropriate precision
function decimalDistractors(correct, dp = 2, count = 4) {
  const options = new Set([correct]);
  const factor = Math.pow(10, dp);
  // Common decimal mistakes
  const offsets = [-0.5, -0.2, -0.1, -0.01, 0.01, 0.1, 0.2, 0.5, 1, -1, 10, -10];
  const shuffled = offsets.sort(() => Math.random() - 0.5);
  for (const offset of shuffled) {
    if (options.size >= count + 1) break;
    const d = Math.round((correct + offset) * factor) / factor;
    if (d > 0 && d !== correct) options.add(d);
  }
  while (options.size < count + 1) {
    const spread = Math.max(5, Math.abs(correct) * 0.5);
    const d = Math.round((correct + (Math.random() * spread * 2 - spread)) * factor) / factor;
    if (d > 0 && d !== correct) options.add(d);
  }
  return [...options].sort(() => Math.random() - 0.5);
}

export const decimalsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: decimal-place-value
  // What each digit means (tenths, hundredths, thousandths)
  // Category: core
  // Lesson A: visual-discovery | Lesson B: key-fact
  // ==========================================
  {
    id: "decimal-place-value",
    name: "Decimal Place Value",
    category: "core",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "decimal-place-value-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand what each digit means after the decimal point",
          "Why the position of a digit changes its value"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "measuring the length of a ladybird for a science project",
            decimal: 2.364, decimal_str: "2.364",
            ones: 2, tenths: 3, hundredths: 6, thousandths: 4,
            ones_val: 2, tenths_val: 0.3, hundredths_val: 0.06, thousandths_val: 0.004,
            unit: "cm",
            columns: ["Ones", ".", "10ths", "100ths", "1000ths"],
            digits: [2, ".", 3, 6, 4]
          },
          {
            name: "Ben",
            scenario: "recording his sprint time on sports day",
            decimal: 13.57, decimal_str: "13.57",
            ones: 3, tenths: 5, hundredths: 7, thousandths: null,
            ones_val: 3, tenths_val: 0.5, hundredths_val: 0.07, thousandths_val: null,
            unit: "seconds",
            columns: ["Tens", "Ones", ".", "10ths", "100ths"],
            digits: [1, 3, ".", 5, 7]
          },
          {
            name: "Chloe",
            scenario: "weighing ingredients for a cake recipe",
            decimal: 0.475, decimal_str: "0.475",
            ones: 0, tenths: 4, hundredths: 7, thousandths: 5,
            ones_val: 0, tenths_val: 0.4, hundredths_val: 0.07, thousandths_val: 0.005,
            unit: "kg",
            columns: ["Ones", ".", "10ths", "100ths", "1000ths"],
            digits: [0, ".", 4, 7, 5]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.decimal_str} really mean?`,
            body: (v) => `${v.name} is ${v.scenario}. The reading is **${v.decimal_str} ${v.unit}**.\n\nYou know what the digits BEFORE the point mean. But what about the digits AFTER it? Each one has a special place value!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.decimal_str, values: v.digits }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Each column is 10 times smaller",
            body: (v) => `After the decimal point, each column is **10 times smaller** than the one before it.\n\n**Tenths** (t) = the digit is worth that many **tenths** (out of 10 equal pieces)\n**Hundredths** (h) = that many **hundredths** (out of 100 equal pieces)${v.thousandths !== null ? "\n**Thousandths** (th) = that many **thousandths** (out of 1000 equal pieces)" : ""}`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const highlightCols = v.columns.length === 5 && v.columns[0] === "O"
                  ? [[0, 2], [0, 3], [0, 4]]
                  : [[0, 3], [0, 4]];
                return {
                  columns: v.columns,
                  rows: [
                    { label: v.decimal_str, values: v.digits }
                  ],
                  highlight: highlightCols
                };
              }
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => {
                const p = [
                  { left: "Tenths", right: "÷ 10" },
                  { left: "Hundredths", right: "÷ 100" }
                ];
                if (v.thousandths !== null) p.push({ left: "Thousandths", right: "÷ 1000" });
                return p;
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the number **${v.decimal_str}**, what is the value of the digit **${v.tenths}** in the tenths column?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.decimal_str, values: v.digits }
                ],
                highlight: v.columns.length === 5 && v.columns[0] === "O"
                  ? [[0, 2]]
                  : [[0, 3]]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the VALUE of the ${v.tenths} in the tenths column?`,
              getOptions: (v) => [
                `${v.tenths_val}`,
                `${v.tenths}`,
                `${v.hundredths_val}`,
                `${v.tenths * 10}`,
                `${v.tenths / 100}`
              ],
              correctAnswer: (v) => `${v.tenths_val}`,
              feedback: {
                correct: (v) => `Spot on! The digit ${v.tenths} in the tenths column is worth **${v.tenths_val}** — that's ${v.tenths} tenths of a whole. ✓`,
                incorrect: (v) => `Not quite! The digit ${v.tenths} in the **tenths** column means ${v.tenths} out of 10, which is **${v.tenths_val}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Place value after the decimal point",
            bodyParts: [
              {
                type: 'text',
                content: () => `Every digit has a **place value**. After the decimal point, each column is **10 times smaller** than the one before it.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ones", ".", "10ths", "100ths", "1000ths"],
                  rows: [
                    { label: "Value", values: [1, ".", 0.1, 0.01, 0.001] }
                  ],
                  highlight: [[0, 2], [0, 3], [0, 4]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Tenths (t) — worth 0.1 each", why: "1 divided into 10 equal pieces" },
                    { text: "Hundredths (h) — worth 0.01 each", why: "1 divided into 100 equal pieces" },
                    { text: "Thousandths (th) — worth 0.001 each", why: "1 divided into 1000 equal pieces" },
                    { text: "Each column is 10× smaller than the one on its left", why: "Just like ones, tens, hundreds — but going the other way! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key Fact ----
      {
        id: "decimal-place-value-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to apply place value knowledge to break apart any decimal",
          "When to use tenths, hundredths, or thousandths in real-life measurements"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "reading a thermometer in science class",
            decimal: 36.85, decimal_str: "36.85",
            ones: 6, tenths: 8, hundredths: 5,
            ones_val: 6, tenths_val: 0.8, hundredths_val: 0.05,
            unit: "°C",
            columns: ["Tens", "Ones", ".", "10ths", "100ths"],
            digits: [3, 6, ".", 8, 5],
            testDigit: 5, testPlace: "hundredths", testValue: 0.05,
            // Interact-specific variables (different from teach)
            interactDecimal: 24.63, interactDecimal_str: "24.63",
            interactColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            interactDigits: [2, 4, ".", 6, 3],
            interactTestDigit: 6, interactTestPlace: "tenths", interactTestValue: 0.6
          },
          {
            name: "Ethan",
            scenario: "timing how long it takes to solve a puzzle",
            decimal: 4.73, decimal_str: "4.73",
            ones: 4, tenths: 7, hundredths: 3,
            ones_val: 4, tenths_val: 0.7, hundredths_val: 0.03,
            unit: "seconds",
            columns: ["Ones", ".", "10ths", "100ths"],
            digits: [4, ".", 7, 3],
            testDigit: 7, testPlace: "tenths", testValue: 0.7,
            interactDecimal: 8.52, interactDecimal_str: "8.52",
            interactColumns: ["Ones", ".", "10ths", "100ths"],
            interactDigits: [8, ".", 5, 2],
            interactTestDigit: 2, interactTestPlace: "hundredths", interactTestValue: 0.02
          },
          {
            name: "Freya",
            scenario: "measuring ribbon for a craft project",
            decimal: 1.29, decimal_str: "1.29",
            ones: 1, tenths: 2, hundredths: 9,
            ones_val: 1, tenths_val: 0.2, hundredths_val: 0.09,
            unit: "metres",
            columns: ["Ones", ".", "10ths", "100ths"],
            digits: [1, ".", 2, 9],
            testDigit: 9, testPlace: "hundredths", testValue: 0.09,
            interactDecimal: 3.74, interactDecimal_str: "3.74",
            interactColumns: ["Ones", ".", "10ths", "100ths"],
            interactDigits: [3, ".", 7, 4],
            interactTestDigit: 4, interactTestPlace: "hundredths", interactTestValue: 0.04
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Did you know?",
            body: (v) => `The word **"decimal"** comes from the Latin word *decimus*, meaning **tenth**. That's because every column after the decimal point is based on dividing by 10!\n\n${v.name} is ${v.scenario} and gets **${v.decimal_str} ${v.unit}**.`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.decimal_str, values: v.digits }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break the number apart",
            body: (v) => `We can break **${v.decimal_str}** into its place values. Tap to see each step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const steps = [];
                if (v.columns[0] === "Tens") {
                  steps.push({ text: `The ${Math.floor(v.decimal / 10)} in the tens column = ${Math.floor(v.decimal / 10) * 10}`, why: "Tens" });
                }
                steps.push({ text: `The ${v.ones} in the ones column = ${v.ones_val}`, why: "Ones" });
                steps.push({ text: `The ${v.tenths} in the tenths column = ${v.tenths_val}`, why: "One tenth = 0.1" });
                steps.push({ text: `The ${v.hundredths} in the hundredths column = ${v.hundredths_val}`, why: "One hundredth = 0.01" });
                return { steps };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In **${v.interactDecimal_str}**, what is the value of the digit **${v.interactTestDigit}** in the **${v.interactTestPlace}** column?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.interactColumns,
                rows: [
                  { label: v.interactDecimal_str, values: v.interactDigits }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the value of the ${v.interactTestDigit} in the ${v.interactTestPlace} column of ${v.interactDecimal_str}?`,
              getOptions: (v) => [
                `${v.interactTestValue}`,
                `${v.interactTestDigit}`,
                `${v.interactTestDigit * 10}`,
                `${v.interactTestValue * 10}`,
                `${v.interactTestValue / 10}`
              ],
              correctAnswer: (v) => `${v.interactTestValue}`,
              feedback: {
                correct: (v) => `Brilliant! The digit ${v.interactTestDigit} in the **${v.interactTestPlace}** column is worth **${v.interactTestValue}**. ✓`,
                incorrect: (v) => `Not quite! In the **${v.interactTestPlace}** column, the digit ${v.interactTestDigit} is worth **${v.interactTestValue}**. Remember: the position decides the value!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The key fact about decimal place value",
            bodyParts: [
              {
                type: 'text',
                content: () => `The decimal point separates **wholes** from **parts**. Every column to the right is **10 times smaller**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ones", ".", "10ths", "100ths"],
                  rows: [
                    { label: "0.07", values: [0, ".", 0, 7] }
                  ],
                  highlight: [[0, 3]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Tenths = 0.1 — one piece when you cut 1 into 10", why: "First column after the point" },
                    { text: "Hundredths = 0.01 — one piece when you cut 1 into 100", why: "Second column after the point" },
                    { text: "The digit tells you HOW MANY of that size piece", why: "e.g. 0.07 means 7 hundredths ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 2: comparing-decimals
  // Comparing/ordering by place value column left to right
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "comparing-decimals",
    name: "Comparing and Ordering Decimals",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "comparing-decimals-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to compare decimals by looking at each column from left to right",
          "Why 0.8 is bigger than 0.08 even though 8 = 8"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "comparing two long jump results on sports day",
            numA: 3.45, numA_str: "3.45",
            numB: 3.54, numB_str: "3.54",
            bigger: "3.54", smaller: "3.45",
            biggerLabel: "B", smallerLabel: "A",
            unit: "metres",
            reason: "Both start with 3, so look at tenths: 5 tenths > 4 tenths",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [3, ".", 4, 5],
            digitsB: [3, ".", 5, 4],
            diffCol: 2,
            // Interact-specific: different pair of decimals
            interactNumA_str: "6.72", interactNumB_str: "6.27",
            interactBigger: "6.72", interactSmaller: "6.27",
            interactReason: "Both start with 6, so look at tenths: 7 tenths > 2 tenths",
            interactColumns: ["Ones", ".", "10ths", "100ths"],
            interactDigitsA: [6, ".", 7, 2],
            interactDigitsB: [6, ".", 2, 7],
            interactDiffCol: 2
          },
          {
            name: "Ben",
            scenario: "checking two temperature readings in science",
            numA: 0.8, numA_str: "0.80",
            numB: 0.08, numB_str: "0.08",
            bigger: "0.80", smaller: "0.08",
            biggerLabel: "A", smallerLabel: "B",
            unit: "°C",
            reason: "0.80 has 8 tenths but 0.08 has 0 tenths and 8 hundredths",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [0, ".", 8, 0],
            digitsB: [0, ".", 0, 8],
            diffCol: 2,
            interactNumA_str: "0.70", interactNumB_str: "0.07",
            interactBigger: "0.70", interactSmaller: "0.07",
            interactReason: "0.70 has 7 tenths but 0.07 has 0 tenths and 7 hundredths",
            interactColumns: ["Ones", ".", "10ths", "100ths"],
            interactDigitsA: [0, ".", 7, 0],
            interactDigitsB: [0, ".", 0, 7],
            interactDiffCol: 2
          },
          {
            name: "Chloe",
            scenario: "comparing prices of two pens at the school shop",
            numA: 1.25, numA_str: "1.25",
            numB: 1.3, numB_str: "1.30",
            bigger: "1.30", smaller: "1.25",
            biggerLabel: "B", smallerLabel: "A",
            unit: "pounds",
            reason: "Both have 1 one, but 3 tenths > 2 tenths",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [1, ".", 2, 5],
            digitsB: [1, ".", 3, 0],
            diffCol: 2,
            interactNumA_str: "2.45", interactNumB_str: "2.50",
            interactBigger: "2.50", interactSmaller: "2.45",
            interactReason: "Both have 2 ones, but 5 tenths > 4 tenths",
            interactColumns: ["Ones", ".", "10ths", "100ths"],
            interactDigitsA: [2, ".", 4, 5],
            interactDigitsB: [2, ".", 5, 0],
            interactDiffCol: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which is bigger: ${v.numA_str} or ${v.numB_str}?`,
            body: (v) => `${v.name} is ${v.scenario}. The two numbers are **${v.numA_str}** and **${v.numB_str}**.\n\nHow do you tell which is bigger? It's easier than you think!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: "A: " + v.numA_str, values: v.digitsA },
                  { label: "B: " + v.numB_str, values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Compare column by column, left to right",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Start at the **left** and compare each column. The first column where they're different tells you which is bigger. Tap to see each step!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: "A: " + v.numA_str, values: v.digitsA },
                    { label: "B: " + v.numB_str, values: v.digitsB }
                  ],
                  highlight: [[0, v.diffCol], [1, v.diffCol]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Write both numbers with the same number of decimal places", why: `${v.numA_str} and ${v.numB_str} — pad with zeros if needed` },
                    { text: "Step 2: Compare the ones column", why: v.digitsA[0] === v.digitsB[0] ? `Both have ${v.digitsA[0]} — they're the same, so move right` : `${Math.max(v.digitsA[0], v.digitsB[0])} > ${Math.min(v.digitsA[0], v.digitsB[0])} — done!` },
                    { text: "Step 3: Compare the tenths column", why: v.reason },
                    { text: `So ${v.bigger} > ${v.smaller}`, result: `${v.bigger} ${v.unit} is the larger value ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                "Write both numbers with the same number of decimal places",
                "Compare the ones column",
                "Compare the tenths column",
                `Decide: ${v.bigger} > ${v.smaller}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Always compare column by column from the left. ✓`,
                incorrect: (v) => `Not quite — start by padding with zeros, then compare left to right.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which is larger: **${v.interactNumA_str}** or **${v.interactNumB_str}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.interactColumns,
                rows: [
                  { label: "A: " + v.interactNumA_str, values: v.interactDigitsA },
                  { label: "B: " + v.interactNumB_str, values: v.interactDigitsB }
                ],
                highlight: [[0, v.interactDiffCol], [1, v.interactDiffCol]]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is larger?`,
              getOptions: (v) => [v.interactBigger, v.interactSmaller, "They are equal", `${v.interactSmaller}0`, `${v.interactBigger}0`],
              correctAnswer: (v) => v.interactBigger,
              feedback: {
                correct: (v) => `Well done! **${v.interactBigger} > ${v.interactSmaller}**. Compare column by column from the left! ✓`,
                incorrect: (v) => `Not quite! Line them up and compare column by column. **${v.interactBigger}** is larger because ${v.interactReason}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to compare decimals",
            bodyParts: [
              {
                type: 'text',
                content: () => `Always compare **column by column from the left**. The first column that's different tells you which number is bigger.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Write both numbers with the same decimal places", why: "Pad with trailing zeros: 0.8 becomes 0.80" },
                    { text: "Compare from the LEFT — ones first, then tenths, then hundredths", why: "Just like reading a book, left to right!" },
                    { text: "The first different column decides which is bigger", why: "Don't be tricked by big digits in small columns! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "comparing-decimals-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid comparing digits after the decimal point without checking their columns",
          "When to watch out for the 'ignore the zero' trap in decimal comparisons"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "says 0.15 is bigger than 0.9 because 15 is bigger than 9",
            numA: 0.15, numA_str: "0.15",
            numB: 0.9, numB_str: "0.9",
            wrongAnswer: "0.15", correctAnswer: "0.9",
            mistake: "treated the decimals like whole numbers — 15 vs 9",
            explanation: "0.9 = 9 tenths, but 0.15 = 1 tenth and 5 hundredths. 9 tenths is much more!",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [0, ".", 1, 5],
            digitsB: [0, ".", 9, 0],
            // Interact-specific: different comparison question
            interactNumA_str: "0.45", interactNumB_str: "0.5",
            interactCorrectAnswer: "0.5",
            interactWrongAnswer: "0.45",
            interactExplanation: "0.5 has 5 tenths, but 0.45 has only 4 tenths. Compare tenths first!"
          },
          {
            name: "Ruby",
            scenario: "says 0.30 is bigger than 0.3 because it has more digits",
            numA: 0.30, numA_str: "0.30",
            numB: 0.3, numB_str: "0.3",
            wrongAnswer: "0.30 is bigger", correctAnswer: "They are equal",
            mistake: "thought more digits means a bigger number",
            explanation: "0.30 and 0.3 are exactly the same! The trailing zero doesn't change the value.",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [0, ".", 3, 0],
            digitsB: [0, ".", 3, 0],
            interactNumA_str: "0.60", interactNumB_str: "0.6",
            interactCorrectAnswer: "They are equal",
            interactWrongAnswer: "0.60 is bigger",
            interactExplanation: "0.60 and 0.6 are exactly the same! The trailing zero doesn't change the value."
          },
          {
            name: "Oscar",
            scenario: "says 2.09 is bigger than 2.9 because 09 has two digits",
            numA: 2.09, numA_str: "2.09",
            numB: 2.9, numB_str: "2.9",
            wrongAnswer: "2.09", correctAnswer: "2.9",
            mistake: "compared 09 to 9 as whole numbers",
            explanation: "2.9 has 9 tenths, but 2.09 has 0 tenths and 9 hundredths. Tenths column decides first!",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [2, ".", 0, 9],
            digitsB: [2, ".", 9, 0],
            interactNumA_str: "5.06", interactNumB_str: "5.6",
            interactCorrectAnswer: "5.6",
            interactWrongAnswer: "5.06",
            interactExplanation: "5.6 has 6 tenths, but 5.06 has 0 tenths and 6 hundredths. Tenths column decides first!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}'s mistake`,
            body: (v) => `${v.name} ${v.scenario}.\n\nCan you spot what went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: v.numB_str, values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => `${v.name} ${v.mistake}. But decimals don't work like whole numbers!\n\n${v.explanation}`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: v.numB_str, values: v.digitsB }
                ],
                highlight: [[0, 2], [1, 2]]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `0.9 is bigger than 0.15 because 9 tenths > 1 tenth`, answer: true, explanation: "Correct — always compare column by column from the left. ✓" },
                { text: `0.30 is bigger than 0.3 because it has more digits`, answer: false, explanation: "Trailing zeros don't change the value — 0.30 = 0.3!" },
                { text: `You can compare decimals by ignoring the point and treating them as whole numbers`, answer: false, explanation: "That's the classic trap! You must compare column by column, not as whole numbers." }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `Which is larger: **${v.interactNumA_str}** or **${v.interactNumB_str}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: ["Ones", ".", "10ths", "100ths"],
                rows: [
                  { label: v.interactNumA_str, values: v.interactNumA_str.split("").map(c => c === "." ? "." : Number(c)) },
                  { label: v.interactNumB_str, values: v.interactNumB_str.padEnd(v.interactNumA_str.length, "0").split("").map(c => c === "." ? "." : Number(c)) }
                ],
                highlight: [[0, 2], [1, 2]]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => [
                v.interactCorrectAnswer,
                v.interactWrongAnswer,
                `${v.interactNumA_str} + ${v.interactNumB_str}`,
                "Cannot tell",
                "Neither"
              ],
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Exactly right! **${v.interactCorrectAnswer}**. ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't fall into this trap!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The biggest mistake with comparing decimals is treating them like **whole numbers**. Always compare **column by column**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "NEVER compare digits after the point as a whole number", why: "0.15 is NOT bigger than 0.9 just because 15 > 9" },
                    { text: "Trailing zeros don't change the value", why: "0.3 = 0.30 = 0.300 — they're all the same!" },
                    { text: "Compare tenths first, THEN hundredths", why: "The tenths column is worth 10 times more than hundredths ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: subtracting-decimals
  // Subtracting decimals by lining up decimal points
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "subtracting-decimals",
    name: "Subtracting Decimals",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "subtracting-decimals-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to subtract decimals by lining up the decimal points",
          "How to borrow across the decimal point"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working out how much change she gets",
            numA: 5.73, numA_str: "5.73", numB: 2.41, numB_str: "2.41",
            answer: 3.32, answer_str: "3.32",
            unit: "\u00a3", unitAfter: "",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [5, ".", 7, 3], digitsB: [2, ".", 4, 1], digitsAns: [3, ".", 3, 2],
            h_sub: "3 - 1 = 2", t_sub: "7 - 4 = 3", o_sub: "5 - 2 = 3",
            borrow: false,
            // Interact-specific subtraction
            interactNumA: 7.86, interactNumA_str: "7.86", interactNumB: 4.53, interactNumB_str: "4.53",
            interactAnswer: 3.33, interactAnswer_str: "3.33",
            interactH_sub: "6 - 3 = 3", interactT_sub: "8 - 5 = 3", interactO_sub: "7 - 4 = 3"
          },
          {
            name: "Ethan",
            scenario: "finding the difference between two race times",
            numA: 8.45, numA_str: "8.45", numB: 3.68, numB_str: "3.68",
            answer: 4.77, answer_str: "4.77",
            unit: "", unitAfter: " seconds",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [8, ".", 4, 5], digitsB: [3, ".", 6, 8], digitsAns: [4, ".", 7, 7],
            h_sub: "15 - 8 = 7 (borrow 1 from tenths)", t_sub: "3 - 6... borrow! 13 - 6 = 7", o_sub: "7 - 3 = 4",
            borrow: true,
            interactNumA: 9.32, interactNumA_str: "9.32", interactNumB: 5.76, interactNumB_str: "5.76",
            interactAnswer: 3.56, interactAnswer_str: "3.56",
            interactH_sub: "12 - 6 = 6 (borrow)", interactT_sub: "2 - 7... borrow! 12 - 7 = 5", interactO_sub: "8 - 5 = 3"
          },
          {
            name: "Freya",
            scenario: "measuring how much string is left on a roll",
            numA: 10.50, numA_str: "10.50", numB: 4.25, numB_str: "4.25",
            answer: 6.25, answer_str: "6.25",
            unit: "", unitAfter: " metres",
            columns: ["Tens", "Ones", ".", "10ths", "100ths"],
            digitsA: [1, 0, ".", 5, 0], digitsB: [0, 4, ".", 2, 5], digitsAns: [0, 6, ".", 2, 5],
            h_sub: "10 - 5 = 5 (borrow 1 from tenths)", t_sub: "4 - 2 = 2", o_sub: "10 - 4 = 6 (borrow from tens)",
            borrow: true,
            interactNumA: 12.40, interactNumA_str: "12.40", interactNumB: 7.15, interactNumB_str: "7.15",
            interactAnswer: 5.25, interactAnswer_str: "5.25",
            interactH_sub: "10 - 5 = 5 (borrow)", interactT_sub: "3 - 1 = 2", interactO_sub: "12 - 7 = 5 (borrow from tens)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.unit}${v.numA_str} - ${v.unit}${v.numB_str} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. We need to work out **${v.unit}${v.numA_str}${v.unitAfter} - ${v.unit}${v.numB_str}${v.unitAfter}**.\n\nJust like adding, the golden rule is: **line up the decimal points!**`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: "- " + v.numB_str, values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subtract from the right",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Line up the decimal points and subtract column by column, starting from the right. Tap to see each step!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: v.numA_str, values: v.digitsA },
                    { label: "- " + v.numB_str, values: v.digitsB }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const steps = [
                    { text: "Line up the decimal points", why: "Write one number above the other, points directly in line" },
                    { text: `Hundredths: ${v.h_sub}`, why: "Start from the rightmost column" },
                    { text: `Tenths: ${v.t_sub}`, why: v.borrow ? "If the top digit is smaller, borrow from the column on the left" : "Subtract normally" },
                    { text: `Ones: ${v.o_sub}`, why: "Keep going left" },
                    { text: `Answer: ${v.unit}${v.answer_str}${v.unitAfter}`, result: `${v.unit}${v.numA_str} - ${v.unit}${v.numB_str} = ${v.unit}${v.answer_str}${v.unitAfter} ✓` }
                  ];
                  return { steps };
                }
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumA_str} - ${v.interactNumB_str}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: ["Ones", ".", "10ths", "100ths"],
                rows: [
                  { label: v.interactNumA_str, values: v.interactNumA_str.split("").map(c => c === "." ? "." : Number(c)) },
                  { label: "- " + v.interactNumB_str, values: v.interactNumB_str.split("").map(c => c === "." ? "." : Number(c)) }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumA_str} - ${v.interactNumB_str}?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumA_str} - ${v.interactNumB_str} = ${v.interactAnswer_str}**. ✓`,
                incorrect: (v) => `Not quite! Line up the points and subtract from the right: ${v.interactH_sub}, ${v.interactT_sub}, ${v.interactO_sub}. The answer is **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The recipe for subtracting decimals",
            body: () => `Subtracting decimals works just like whole numbers — but with one golden rule:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Line up the decimal points", why: "Write one number directly above the other" },
                  { text: "Step 2: Subtract from the right", why: "Hundredths first, then tenths, then ones" },
                  { text: "Step 3: Borrow if needed", why: "If the top digit is smaller, borrow 1 from the next column left" },
                  { text: "Step 4: Bring the decimal point straight down", why: "The point in the answer lines up with the ones above ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "subtracting-decimals-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid misaligning decimal points when subtracting",
          "When to watch out for borrowing errors across the decimal point"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "tried to work out 7.3 - 2.8 and got 5.5",
            numA_str: "7.3", numB_str: "2.8",
            wrongAnswer: 5.5, wrongAnswer_str: "5.5",
            correctAnswer: 4.5, correctAnswer_str: "4.5",
            mistake: "subtracted 3 from 8 instead of borrowing",
            explanation: "You can't do 3 - 8, so you need to borrow. Borrow 1 from the 7 (making it 6), then 13 - 8 = 5 tenths, and 6 - 2 = 4 ones. Answer: 4.5",
            columns: ["Ones", ".", "10ths"],
            digitsA: [7, ".", 3], digitsB: [2, ".", 8],
            digitsWrong: [5, ".", 5], digitsCorrect: [4, ".", 5],
            borrowCarries: [{ col: 2, digit: 1 }],
            borrowHighlight: [[0, 0], [0, 2]],
            borrowNote: "Borrow **1** from the ones (7 becomes 6), giving **13** tenths."
          },
          {
            name: "Ruby",
            scenario: "tried to work out 6.50 - 2.35 and got 4.25",
            numA_str: "6.50", numB_str: "2.35",
            wrongAnswer: 4.25, wrongAnswer_str: "4.25",
            correctAnswer: 4.15, correctAnswer_str: "4.15",
            mistake: "did 5 - 3 = 2 in the tenths instead of borrowing for the hundredths first",
            explanation: "Hundredths: 0 - 5 needs a borrow! Take 1 from tenths (5 becomes 4), so 10 - 5 = 5. Then tenths: 4 - 3 = 1. Answer: 4.15",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [6, ".", 5, 0], digitsB: [2, ".", 3, 5],
            digitsWrong: [4, ".", 2, 5], digitsCorrect: [4, ".", 1, 5],
            borrowCarries: [{ col: 3, digit: 1 }],
            borrowHighlight: [[0, 2], [0, 3]],
            borrowNote: "Borrow **1** from the tenths (5 becomes 4), giving **10** hundredths."
          },
          {
            name: "Oscar",
            scenario: "tried to work out 5.00 - 1.75 and got 4.75",
            numA_str: "5.00", numB_str: "1.75",
            wrongAnswer: 4.75, wrongAnswer_str: "4.75",
            correctAnswer: 3.25, correctAnswer_str: "3.25",
            mistake: "did 5 - 1 = 4 for the ones then just wrote 75 for the decimals",
            explanation: "You need to borrow! Hundredths: 10 - 5 = 5 (borrow from tenths). Tenths: 9 - 7 = 2 (borrow from ones). Ones: 4 - 1 = 3. Answer: 3.25",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [5, ".", 0, 0], digitsB: [1, ".", 7, 5],
            digitsWrong: [4, ".", 7, 5], digitsCorrect: [3, ".", 2, 5],
            borrowCarries: [{ col: 3, digit: 1 }, { col: 2, digit: 1 }],
            borrowHighlight: [[0, 0], [0, 2], [0, 3]],
            borrowNote: "Borrow **1** from the ones (5 becomes 4), then borrow from tenths to hundredths."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nBut the answer is wrong! Can you see what went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: "- " + v.numB_str, values: v.digitsB },
                  { label: "Wrong!", values: v.digitsWrong }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistake}.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: v.numA_str, values: v.digitsA },
                    { label: "- " + v.numB_str, values: v.digitsB },
                    { label: "Wrong!", values: v.digitsWrong }
                  ],
                  highlight: []
                })
              },
              {
                type: 'text',
                content: (v) => `Let's do it correctly:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const allSteps = v.explanation.split('. ').filter(s => s.trim()).map(s => ({
                    text: s.replace(/\.$/, '').trim(),
                    why: ""
                  }));
                  return { steps: allSteps.slice(0, 2), allRevealed: true };
                }
              },
              {
                type: 'text',
                content: (v) => v.borrowNote
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: v.numA_str, values: v.digitsA },
                    { label: "- " + v.numB_str, values: v.digitsB }
                  ],
                  highlight: v.borrowHighlight,
                  carries: v.borrowCarries
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const allSteps = v.explanation.split('. ').filter(s => s.trim()).map(s => ({
                    text: s.replace(/\.$/, '').trim(),
                    why: ""
                  }));
                  return { steps: allSteps.slice(2), allRevealed: true };
                }
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: v.numA_str, values: v.digitsA },
                    { label: "- " + v.numB_str, values: v.digitsB },
                    { label: "Correct!", values: v.digitsCorrect }
                  ],
                  highlight: []
                })
              }
            ],
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `When subtracting decimals, you must line up the decimal points`, answer: true, explanation: "Always line up the points so that tenths are under tenths, hundredths under hundredths. ✓" },
                { text: `If the top digit is smaller than the bottom digit, just swap them`, answer: false, explanation: "You must borrow from the column to the left — never swap the digits!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `What should **${v.numA_str} - ${v.numB_str}** actually be?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: "- " + v.numB_str, values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.numA_str} - ${v.numB_str} = ?`,
              getOptions: (v) => decimalDistractors(v.correctAnswer),
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Well done! **${v.numA_str} - ${v.numB_str} = ${v.correctAnswer_str}**. You spotted the mistake! ✓`,
                incorrect: (v) => `Not quite! ${v.explanation} The correct answer is **${v.correctAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Watch out for borrowing!",
            body: () => `The most common mistake in decimal subtraction is **forgetting to borrow**. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "If the top digit is smaller than the bottom digit, you MUST borrow", why: "You can't do 3 - 8, so borrow 1 from the next column" },
                  { text: "Borrowing changes the column you borrowed FROM", why: "If you borrow from 5 tenths, it becomes 4 tenths" },
                  { text: "Double-check by adding: answer + smaller = bigger", why: "e.g. 4.5 + 2.8 = 7.3 ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: multiply-by-10-100-1000
  // Multiplying by 10/100/1000 — digits shift left
  // Category: core
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "multiply-by-10-100-1000",
    name: "Multiplying by 10, 100 and 1000",
    category: "core",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "multiply-10-100-1000-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to see that multiplying by 10 moves every digit one place left",
          "Why 'adding a zero' does not work with decimals"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "working out how much 10 pencils cost at 35p each",
            startNum: 0.35, startNum_str: "0.35",
            multiplier: 10,
            answer: 3.5, answer_str: "3.5",
            unit: "\u00a3",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsBefore: [0, ".", 3, 5],
            columnsAfter: ["Ones", ".", "10ths"],
            digitsAfter: [3, ".", 5],
            shift: "one place left"
          },
          {
            name: "Ben",
            scenario: "converting 2.4 metres to centimetres",
            startNum: 2.4, startNum_str: "2.4",
            multiplier: 100,
            answer: 240, answer_str: "240",
            unit: "",
            columns: ["Ones", ".", "10ths"],
            digitsBefore: [2, ".", 4],
            columnsAfter: ["Hund", "Tens", "Ones"],
            digitsAfter: [2, 4, 0],
            shift: "two places left"
          },
          {
            name: "Chloe",
            scenario: "converting 1.5 kg to grams",
            startNum: 1.5, startNum_str: "1.5",
            multiplier: 1000,
            answer: 1500, answer_str: "1500",
            unit: "",
            columns: ["Ones", ".", "10ths"],
            digitsBefore: [1, ".", 5],
            columnsAfter: ["Thous", "Hund", "Tens", "Ones"],
            digitsAfter: [1, 5, 0, 0],
            shift: "three places left"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.startNum_str} × ${v.multiplier} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. That's **${v.startNum_str} × ${v.multiplier}**.\n\nSome people say "just add a zero" — but that **doesn't work with decimals**! 0.35 with a zero added would be 0.350, which is still 0.35. There's a better way...`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: "Before", values: v.digitsBefore }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Digits SHIFT left!",
            body: (v) => `When you multiply by **${v.multiplier}**, every digit moves **${v.shift}** in the place value chart. The number gets bigger because each digit is now worth more!\n\n× 10 = shift 1 place left\n× 100 = shift 2 places left\n× 1000 = shift 3 places left`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columnsAfter,
                rows: [
                  { label: "After", values: v.digitsAfter }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When you multiply by ${v.multiplier}, every digit shifts ____ place(s) to the left`,
              options: (v) => ["1", "2", "3", "0"],
              correctIndex: (v) => v.multiplier === 10 ? 0 : v.multiplier === 100 ? 1 : 2,
              feedback: {
                correct: (v) => `Yes! × ${v.multiplier} shifts digits ${v.shift}. ✓`,
                incorrect: (v) => `Not quite — × ${v.multiplier} means shift ${v.shift}.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.startNum_str} × ${v.multiplier}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: "Before", values: v.digitsBefore }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.startNum_str} × ${v.multiplier} = ?`,
              getOptions: (v) => decimalDistractors(v.answer, v.answer < 10 ? 1 : 0),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Brilliant! **${v.startNum_str} × ${v.multiplier} = ${v.answer_str}**. Every digit shifted ${v.shift}! ✓`,
                incorrect: (v) => `Not quite! Multiply by ${v.multiplier} means shift every digit ${v.shift}. **${v.startNum_str} × ${v.multiplier} = ${v.answer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiplying by 10, 100, 1000",
            bodyParts: [
              {
                type: 'text',
                content: () => `Don't "add zeros" — think about **digits shifting left** in the place value chart.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ones", ".", "10ths", "100ths"],
                  rows: [
                    { label: "Before", values: [0, ".", 3, 5] },
                    { label: "× 10", values: [3, ".", 5, ""] }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "× 10: every digit shifts ONE place to the left", why: "0.35 × 10 = 3.5 (not 0.350!)" },
                    { text: "× 100: every digit shifts TWO places to the left", why: "2.4 × 100 = 240" },
                    { text: "× 1000: every digit shifts THREE places to the left", why: "1.5 × 1000 = 1500" },
                    { text: "Fill empty columns with zeros", why: "The digits shift, and zeros fill the gaps ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "multiply-10-100-1000-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the 'just add a zero' mistake when multiplying decimals by 10",
          "When to watch out for the decimal point not moving the right number of places"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "says 3.4 × 10 = 3.40 because you add a zero",
            numStr: "3.4", multiplier: 10,
            wrongAnswer: "3.40", correctAnswer: "34",
            correctNum: 34,
            mistake: "added a zero to the end instead of shifting digits",
            explanation: "3.40 is the same as 3.4! Multiplying by 10 moves every digit one place left, so 3.4 × 10 = 34.",
            // Interact-specific
            interactNumStr: "4.7", interactMultiplier: 10,
            interactCorrectAnswer: "47", interactCorrectNum: 47
          },
          {
            name: "Ruby",
            scenario: "says 0.6 × 100 = 0.600 because you add two zeros",
            numStr: "0.6", multiplier: 100,
            wrongAnswer: "0.600", correctAnswer: "60",
            correctNum: 60,
            mistake: "added two zeros after the 6 instead of shifting digits",
            explanation: "0.600 is still 0.6! Shift every digit two places left: 0.6 × 100 = 60.",
            interactNumStr: "0.9", interactMultiplier: 100,
            interactCorrectAnswer: "90", interactCorrectNum: 90
          },
          {
            name: "Oscar",
            scenario: "says 2.5 × 10 = 2.50 because you just add a zero",
            numStr: "2.5", multiplier: 10,
            wrongAnswer: "2.50", correctAnswer: "25",
            correctNum: 25,
            mistake: "stuck a zero on the end instead of shifting the digits left",
            explanation: "2.50 = 2.5 — that zero changes nothing! Shift left: 2.5 × 10 = 25.",
            interactNumStr: "1.8", interactMultiplier: 10,
            interactCorrectAnswer: "18", interactCorrectNum: 18
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.numStr} × ${v.multiplier} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} ${v.scenario}.\n\nIs that right? Something doesn't look right...`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const num = parseFloat(v.numStr);
                if (num < 1) return {
                  columns: ["Ones", ".", "10ths", "100ths"],
                  rows: [
                    { label: v.numStr, values: [0, ".", Math.floor(num * 10) % 10, Math.floor(num * 100) % 10] }
                  ],
                  highlight: []
                };
                return {
                  columns: ["Ones", ".", "10ths"],
                  rows: [
                    { label: v.numStr, values: [Math.floor(num), ".", Math.floor(num * 10) % 10] }
                  ],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Adding a zero doesn't work with decimals!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.explanation}\n\nThe trick is: **digits shift left, they don't just get a zero stuck on**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.numStr} × ${v.multiplier} = ${v.wrongAnswer}`, why: `${v.wrongAnswer} is the same number as ${v.numStr}!` },
                  { text: `Right: ${v.numStr} × ${v.multiplier} = ${v.correctAnswer}`, why: "Every digit shifted left ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.interactNumStr} × ${v.interactMultiplier}** really?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0,
                max: v.interactCorrectNum + 10,
                points: [
                  { value: parseFloat(v.interactNumStr), label: v.interactNumStr, color: "#c084fc" },
                  { value: v.interactCorrectNum, label: v.interactCorrectAnswer, color: "#34d399" }
                ],
                jumps: [
                  { from: parseFloat(v.interactNumStr), to: v.interactCorrectNum, label: `× ${v.interactMultiplier}` }
                ],
                tickInterval: v.interactCorrectNum > 30 ? 10 : 5,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumStr} × ${v.interactMultiplier} = ?`,
              getOptions: (v) => {
                const correct = v.interactCorrectNum;
                return [correct, correct / 10, correct * 10, correct + 1, correct - 1].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.interactCorrectNum,
              feedback: {
                correct: (v) => `Spot on! **${v.interactNumStr} × ${v.interactMultiplier} = ${v.interactCorrectAnswer}**. Digits shift left, not just add a zero! ✓`,
                incorrect: (v) => `Not quite! Shift every digit left. **${v.interactNumStr} × ${v.interactMultiplier} = ${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember this golden rule!",
            bodyParts: [
              {
                type: 'text',
                content: () => `"Adding a zero" works for whole numbers (e.g. 34 × 10 = 340). But for decimals, think **shift left** instead!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Tens", "Ones", ".", "10ths"],
                  rows: [
                    { label: "Before", values: ["", 3, ".", 4] },
                    { label: "× 10", values: [3, 4, ".", ""] }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "3.4 × 10 = 34 (NOT 3.40)", why: "Digits shift one place left" },
                    { text: "0.6 × 100 = 60 (NOT 0.600)", why: "Digits shift two places left" },
                    { text: "0.05 × 1000 = 50 (NOT 0.05000)", why: "Digits shift three places left ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: divide-by-10-100-1000
  // Dividing by 10/100/1000 — digits shift right
  // Category: core
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "divide-by-10-100-1000",
    name: "Dividing by 10, 100 and 1000",
    category: "core",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "divide-10-100-1000-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to see that dividing by 10 moves every digit one place right",
          "How to handle dividing a small number by 100"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "sharing 45 sweets equally among 10 party bags",
            startNum: 45, startNum_str: "45",
            divisor: 10,
            answer: 4.5, answer_str: "4.5",
            columnsBefore: ["T", "O"],
            digitsBefore: [4, 5],
            columnsAfter: ["O", ".", "t"],
            digitsAfter: [4, ".", 5],
            shift: "one place right"
          },
          {
            name: "Ben",
            scenario: "converting 350 centimetres to metres",
            startNum: 350, startNum_str: "350",
            divisor: 100,
            answer: 3.5, answer_str: "3.5",
            columnsBefore: ["H", "T", "O"],
            digitsBefore: [3, 5, 0],
            columnsAfter: ["O", ".", "t"],
            digitsAfter: [3, ".", 5],
            shift: "two places right"
          },
          {
            name: "Chloe",
            scenario: "converting 750 grams to kilograms",
            startNum: 750, startNum_str: "750",
            divisor: 1000,
            answer: 0.75, answer_str: "0.75",
            columnsBefore: ["H", "T", "O"],
            digitsBefore: [7, 5, 0],
            columnsAfter: ["O", ".", "t", "h"],
            digitsAfter: [0, ".", 7, 5],
            shift: "three places right"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.startNum_str} \u00f7 ${v.divisor} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. That's **${v.startNum_str} \u00f7 ${v.divisor}**.\n\nDividing by 10, 100 or 1000 is the **opposite** of multiplying \u2014 the digits shift **right** instead of left!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columnsBefore,
                rows: [{ label: "Before", values: v.digitsBefore }],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Digits shift RIGHT",
            body: (v) => `When you divide by **${v.divisor}**, every digit moves **${v.shift}** in the place value chart. The number gets **smaller** because each digit is now worth less.\n\n\u00f7 10 = shift 1 place right\n\u00f7 100 = shift 2 places right\n\u00f7 1000 = shift 3 places right`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columnsAfter,
                rows: [{ label: "After", values: v.digitsAfter }],
                highlight: []
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When you divide by ${v.divisor}, every digit shifts to the ____`,
              options: (v) => ["left", "right", "top", "bottom"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Dividing shifts digits to the right — the number gets smaller. ✓`,
                incorrect: (v) => `Not quite — dividing makes the number smaller, so digits shift to the right.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.startNum_str} \u00f7 ${v.divisor}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columnsBefore,
                rows: [{ label: "Before", values: v.digitsBefore }],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.startNum_str} \u00f7 ${v.divisor} = ?`,
              getOptions: (v) => decimalDistractors(v.answer, v.answer < 1 ? 2 : 1),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Brilliant! **${v.startNum_str} \u00f7 ${v.divisor} = ${v.answer_str}**. Every digit shifted ${v.shift}! \u2713`,
                incorrect: (v) => `Not quite! \u00f7 ${v.divisor} means shift every digit ${v.shift}. **${v.startNum_str} \u00f7 ${v.divisor} = ${v.answer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Dividing by 10, 100, 1000",
            bodyParts: [
              {
                type: 'text',
                content: () => `Dividing is the mirror image of multiplying \u2014 digits shift **right** instead of left.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Tens", "Ones", ".", "10ths"],
                  rows: [
                    { label: "Before", values: [4, 5, ".", ""] },
                    { label: "\u00f7 10", values: ["", 4, ".", 5] }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "\u00f7 10: every digit shifts ONE place to the right", why: "45 \u00f7 10 = 4.5" },
                    { text: "\u00f7 100: every digit shifts TWO places to the right", why: "350 \u00f7 100 = 3.5" },
                    { text: "\u00f7 1000: every digit shifts THREE places to the right", why: "750 \u00f7 1000 = 0.75" },
                    { text: "A decimal point appears when digits cross into the tenths", why: "The number gets smaller \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "divide-10-100-1000-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid moving the digits the wrong direction when dividing by 10 or 100",
          "When to watch out for confusing multiplication and division direction shifts"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "says 7 \u00f7 10 = 70 because you add a zero",
            numStr: "7", divisor: 10,
            wrongAnswer: "70", correctAnswer: "0.7", correctNum: 0.7,
            mistake: "multiplied instead of dividing \u2014 the number should get SMALLER",
            explanation: "7 \u00f7 10 = 0.7 (shift right). 70 is 7 \u00d7 10 \u2014 that's the wrong direction!",
            // Interact-specific
            interactNumStr: "9", interactDivisor: 10,
            interactCorrectAnswer: "0.9", interactCorrectNum: 0.9,
            interactExplanation: "9 \u00f7 10 = 0.9. Shift one place to the right."
          },
          {
            name: "Ruby",
            scenario: "says 5 \u00f7 100 = 0.5 because she only shifted one place",
            numStr: "5", divisor: 100,
            wrongAnswer: "0.5", correctAnswer: "0.05", correctNum: 0.05,
            mistake: "only shifted one place right instead of two",
            explanation: "\u00f7 100 means shift TWO places right. 5 \u00f7 100 = 0.05, not 0.5.",
            interactNumStr: "3", interactDivisor: 100,
            interactCorrectAnswer: "0.03", interactCorrectNum: 0.03,
            interactExplanation: "\u00f7 100 means shift TWO places right. 3 \u00f7 100 = 0.03."
          },
          {
            name: "Oscar",
            scenario: "says 30 \u00f7 10 = 0.3 because he moved two places instead of one",
            numStr: "30", divisor: 10,
            wrongAnswer: "0.3", correctAnswer: "3", correctNum: 3,
            mistake: "shifted two places right instead of one",
            explanation: "\u00f7 10 means shift ONE place right. 30 \u00f7 10 = 3, not 0.3.",
            interactNumStr: "60", interactDivisor: 10,
            interactCorrectAnswer: "6", interactCorrectNum: 6,
            interactExplanation: "\u00f7 10 means shift ONE place right. 60 \u00f7 10 = 6."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.numStr} \u00f7 ${v.divisor} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} ${v.scenario}.\n\nCan you spot the mistake?`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                const start = parseFloat(v.numStr);
                const wrong = parseFloat(v.wrongAnswer);
                const correct = v.correctNum;
                const maxVal = Math.max(start, wrong, correct) + 2;
                return {
                  min: 0, max: maxVal > 10 ? Math.ceil(maxVal / 5) * 5 : Math.ceil(maxVal),
                  points: [
                    { value: start, label: v.numStr, color: "#7C3AED" },
                    { value: wrong, label: v.wrongAnswer + "?", color: "#ef4444" }
                  ],
                  jumps: [], tickInterval: maxVal > 10 ? 5 : 1, showLabels: true
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.numStr} \u00f7 ${v.divisor} = ${v.wrongAnswer}`, why: v.mistake },
                  { text: `Right: ${v.numStr} \u00f7 ${v.divisor} = ${v.correctAnswer}`, why: "Correct shift \u2713" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.interactNumStr} \u00f7 ${v.interactDivisor}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                const start = parseFloat(v.interactNumStr);
                const maxVal = Math.max(start, v.interactCorrectNum) + 2;
                return {
                  min: 0, max: maxVal > 10 ? Math.ceil(maxVal / 5) * 5 : Math.ceil(maxVal),
                  points: [
                    { value: start, label: v.interactNumStr, color: "#c084fc" },
                    { value: v.interactCorrectNum, label: v.interactCorrectAnswer, color: "#34d399" }
                  ],
                  jumps: [],
                  tickInterval: maxVal > 10 ? 5 : 1, showLabels: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumStr} \u00f7 ${v.interactDivisor} = ?`,
              getOptions: (v) => [v.interactCorrectAnswer, String(v.interactCorrectNum * 10), String(v.interactCorrectNum / 10), String(parseFloat(v.interactNumStr) * v.interactDivisor), String(v.interactCorrectNum + 1)],
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Exactly! **${v.interactNumStr} \u00f7 ${v.interactDivisor} = ${v.interactCorrectAnswer}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Common mistakes to avoid!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Dividing makes the number **smaller**. Count the zeros to know how many places to shift right.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ones", ".", "10ths"],
                  rows: [
                    { label: "Before", values: [7, ".", ""] },
                    { label: "\u00f7 10", values: [0, ".", 7] }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "\u00f7 10 = shift 1 place right (10 has 1 zero)", why: "The number gets 10 times smaller" },
                    { text: "\u00f7 100 = shift 2 places right (100 has 2 zeros)", why: "The number gets 100 times smaller" },
                    { text: "If unsure, check: does my answer \u00d7 and 10/100 give back the original?", why: "0.7 \u00d7 10 = 7 \u2713 so 7 \u00f7 10 = 0.7 \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: multiplying-decimals-whole
  // Multiplying decimal x whole number
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "multiplying-decimals-whole",
    name: "Multiplying a Decimal by a Whole Number",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "multiplying-decimals-whole-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to multiply a decimal by a whole number",
          "How to use partitioning (splitting into parts) to make it easier"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "buying 4 notebooks that cost \u00a32.35 each",
            decimal: 2.35, decimal_str: "2.35", whole: 4,
            wholeNum: 235, wholeProduct: 940,
            wholesPart: 2, wholeProd: 8,
            tenthsPart: 0.3, tenthsProd: 1.2,
            hundredthsPart: 0.05, hundredthsProd: 0.2,
            answer: 9.40, answer_str: "9.40", dp: 2,
            unit: "\u00a3", unitAfter: "",
            // Interact-specific
            interactDecimal_str: "3.15", interactWhole: 3,
            interactWholeNum: 315, interactWholeProduct: 945,
            interactAnswer: 9.45, interactAnswer_str: "9.45", interactDp: 2
          },
          {
            name: "Ethan",
            scenario: "working out 3 pieces of wood, each 1.25 metres long",
            decimal: 1.25, decimal_str: "1.25", whole: 3,
            wholeNum: 125, wholeProduct: 375,
            wholesPart: 1, wholeProd: 3,
            tenthsPart: 0.2, tenthsProd: 0.6,
            hundredthsPart: 0.05, hundredthsProd: 0.15,
            answer: 3.75, answer_str: "3.75", dp: 2,
            unit: "", unitAfter: " metres",
            interactDecimal_str: "2.45", interactWhole: 4,
            interactWholeNum: 245, interactWholeProduct: 980,
            interactAnswer: 9.80, interactAnswer_str: "9.80", interactDp: 2
          },
          {
            name: "Freya",
            scenario: "finding the total weight of 6 bags at 0.45 kg each",
            decimal: 0.45, decimal_str: "0.45", whole: 6,
            wholeNum: 45, wholeProduct: 270,
            wholesPart: 0, wholeProd: 0,
            tenthsPart: 0.4, tenthsProd: 2.4,
            hundredthsPart: 0.05, hundredthsProd: 0.3,
            answer: 2.70, answer_str: "2.70", dp: 2,
            unit: "", unitAfter: " kg",
            interactDecimal_str: "0.35", interactWhole: 8,
            interactWholeNum: 35, interactWholeProduct: 280,
            interactAnswer: 2.80, interactAnswer_str: "2.80", interactDp: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.decimal_str} \u00d7 ${v.whole} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. That's **${v.decimal_str} \u00d7 ${v.whole}**.\n\nMultiplying a decimal by a whole number is easier than it looks. The trick? **Ignore the decimal point, multiply, then put it back!**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.decimal_str} \u00d7 ${v.whole} = ???`, why: "Let's break it down..." }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Remove, multiply, replace!",
            body: (v) => `Watch the shortcut: remove the decimal point, multiply as whole numbers, then put the point back. Tap to see each step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Remove the point: ${v.decimal_str} becomes ${v.wholeNum}`, why: `Count the decimal places: ${v.dp}` },
                  { text: `Multiply: ${v.wholeNum} × ${v.whole} = ${v.wholeProduct}`, why: "Just whole-number multiplication!" },
                  { text: `Put the point back: ${v.dp} decimal places from the right`, why: `${v.wholeProduct} becomes ${v.answer_str}` },
                  { text: `${v.decimal_str} × ${v.whole} = ${v.answer_str}`, result: `${v.unit}${v.answer_str}${v.unitAfter} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Remove the decimal point: ${v.decimal_str} → ${v.wholeNum}`,
                `Multiply as whole numbers: ${v.wholeNum} × ${v.whole} = ${v.wholeProduct}`,
                `Put the point back (${v.dp} decimal place${v.dp > 1 ? "s" : ""} from the right)`,
                `Answer: ${v.answer_str}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Remove, multiply, replace. ✓`,
                incorrect: (v) => `Not quite — first remove the point, then multiply, then put it back.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDecimal_str} \u00d7 ${v.interactWhole}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactWholeNum} \u00d7 ${v.interactWhole} = ${v.interactWholeProduct}`, why: "Whole-number multiplication done!" },
                  { text: `Now put the decimal point back (${v.interactDp} places)`, why: "Count from the right..." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimal_str} \u00d7 ${v.interactWhole} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer, v.interactDp),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDecimal_str} \u00d7 ${v.interactWhole} = ${v.interactAnswer_str}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactWholeNum} \u00d7 ${v.interactWhole} = ${v.interactWholeProduct}. Put the point back ${v.interactDp} places from the right = **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The 'ignore the point' shortcut",
            body: () => `This trick works for multiplying **any** decimal by a whole number:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Remove the decimal point", why: "Turn 2.35 into 235" },
                  { text: "Step 2: Multiply the whole numbers", why: "235 \u00d7 4 = 940" },
                  { text: "Step 3: Count how many decimal places there were", why: "2.35 had 2 decimal places" },
                  { text: "Step 4: Put the point back that many places from the right", why: "940 \u2192 9.40 \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Curiosity Hook ----
      {
        id: "multiplying-decimals-whole-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to use partitioning (splitting a number into its place values) to multiply decimals",
          "When to watch out for forgetting to add the decimal parts back together"
        ],
        variableSets: [
          {
            name: "George",
            scenario: "Each chocolate bar costs \u00a31.45. He buys 5.",
            decimal: 1.45, decimal_str: "1.45", whole: 5,
            wholesPart: 1, wholeProd: 5,
            tenthsPart: 0.4, tenthsProd: 2.0,
            hundredthsPart: 0.05, hundredthsProd: 0.25,
            answer: 7.25, answer_str: "7.25", unit: "\u00a3",
            // Interact-specific
            interactDecimal: 2.35, interactDecimal_str: "2.35", interactWhole: 4,
            interactAnswer: 9.40, interactAnswer_str: "9.40"
          },
          {
            name: "Hannah",
            scenario: "A ribbon costs \u00a30.85 per metre. She needs 7 metres.",
            decimal: 0.85, decimal_str: "0.85", whole: 7,
            wholesPart: 0, wholeProd: 0,
            tenthsPart: 0.8, tenthsProd: 5.6,
            hundredthsPart: 0.05, hundredthsProd: 0.35,
            answer: 5.95, answer_str: "5.95", unit: "\u00a3",
            interactDecimal: 0.65, interactDecimal_str: "0.65", interactWhole: 6,
            interactAnswer: 3.90, interactAnswer_str: "3.90"
          },
          {
            name: "Isaac",
            scenario: "A can of paint covers 3.6 square metres. He has 8 cans.",
            decimal: 3.6, decimal_str: "3.6", whole: 8,
            wholesPart: 3, wholeProd: 24,
            tenthsPart: 0.6, tenthsProd: 4.8,
            hundredthsPart: 0, hundredthsProd: 0,
            answer: 28.8, answer_str: "28.8", unit: "",
            interactDecimal: 4.5, interactDecimal_str: "4.5", interactWhole: 6,
            interactAnswer: 27.0, interactAnswer_str: "27.0"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Partition the decimal!",
            body: (v) => `${v.scenario}\n\nThat's **${v.decimal_str} \u00d7 ${v.whole}**. Let's **partition** (split) the decimal and multiply each part separately.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.decimal_str} \u00d7 ${v.whole} = ???`, why: "Split the decimal into its parts..." }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply each part",
            body: (v) => `There are two ways to multiply a decimal by a whole number — **partition** (split into place values) or **ignore the point** (multiply as whole numbers, then put the point back). Let's focus on the partition method.\n\nSplit **${v.decimal_str}** into its place values and multiply each by **${v.whole}**. Tap to see!`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const steps = [];
                if (v.wholesPart > 0) steps.push({ text: `${v.wholesPart} \u00d7 ${v.whole} = ${v.wholeProd}`, why: "Ones part" });
                if (v.tenthsProd > 0) steps.push({ text: `${v.tenthsPart} \u00d7 ${v.whole} = ${v.tenthsProd}`, why: "Tenths part" });
                if (v.hundredthsProd > 0) steps.push({ text: `${v.hundredthsPart} \u00d7 ${v.whole} = ${v.hundredthsProd}`, why: "Hundredths part" });
                const parts = [v.wholeProd, v.tenthsProd, v.hundredthsProd].filter(p => p > 0);
                steps.push({ text: `Add: ${parts.join(" + ")} = ${v.answer}`, result: `${v.unit}${v.answer_str} \u2713` });
                return { steps };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDecimal_str} \u00d7 ${v.interactWhole}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactDecimal_str} \u00d7 ${v.interactWhole} = ?`, why: "Use whichever method you prefer!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimal_str} \u00d7 ${v.interactWhole} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Superstar! **${v.interactDecimal_str} \u00d7 ${v.interactWhole} = ${v.interactAnswer_str}**. Partitioning works every time! \u2713`,
                incorrect: (v) => `Not quite! Partition and multiply each part, then add them. Answer: **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two methods \u2014 one toolbox",
            body: () => `You now know the **partition method** (split and multiply each part). The other method \u2014 **ignore the point** (multiply as whole numbers, then put the decimal back) \u2014 works just as well. Use whichever feels fastest!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Method 1: Partition \u2014 split into ones, tenths, hundredths and multiply each", why: "1.45 \u00d7 5 = (1\u00d75) + (0.4\u00d75) + (0.05\u00d75) = 7.25" },
                  { text: "Method 2: Ignore the point \u2014 multiply as whole numbers, then put the decimal back", why: "145 \u00d7 5 = 725, then 2 decimal places \u2192 7.25 \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: dividing-to-decimal
  // Dividing to get a decimal answer
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "dividing-to-decimal",
    name: "Dividing to Get a Decimal Answer",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "dividing-to-decimal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to keep dividing past the decimal point to get an exact answer",
          "When a remainder (the amount left over after dividing) turns into a decimal"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "sharing \u00a39 equally among 4 friends",
            dividend: 9, divisor: 4,
            answer: 2.25, answer_str: "2.25",
            unit: "\u00a3", unitAfter: " each",
            step1: "9 \u00f7 4 = 2 remainder (the amount left over after dividing) 1",
            step2: "Bring down a 0: 10 \u00f7 4 = 2 remainder (the amount left over after dividing) 2",
            step3: "Bring down a 0: 20 \u00f7 4 = 5",
            step4: "Answer: 2.25",
            // Interact-specific
            interactDividend: 11, interactDivisor: 4,
            interactAnswer: 2.75, interactAnswer_str: "2.75",
            interactStep1: "11 \u00f7 4 = 2 remainder 3",
            busInitSteps: [{ result: 2, remainder: 1 }],
            busDecDividend: 900, busDecAfter: 0,
            busFullSteps: [
              { result: 2, remainder: 1, carry: true },
              { result: 2, remainder: 2, carry: true },
              { result: 5, remainder: 0 }
            ]
          },
          {
            name: "Ethan",
            scenario: "cutting a 7-metre rope into 2 equal pieces",
            dividend: 7, divisor: 2,
            answer: 3.5, answer_str: "3.5",
            unit: "", unitAfter: " metres each",
            step1: "7 \u00f7 2 = 3 remainder (the amount left over after dividing) 1",
            step2: "Bring down a 0: 10 \u00f7 2 = 5",
            step3: "No remainder (the amount left over after dividing) \u2014 done!",
            step4: "Answer: 3.5",
            interactDividend: 13, interactDivisor: 2,
            interactAnswer: 6.5, interactAnswer_str: "6.5",
            interactStep1: "13 \u00f7 2 = 6 remainder 1",
            busInitSteps: [{ result: 3, remainder: 1 }],
            busDecDividend: 70, busDecAfter: 0,
            busFullSteps: [
              { result: 3, remainder: 1, carry: true },
              { result: 5, remainder: 0 }
            ]
          },
          {
            name: "Freya",
            scenario: "splitting a 15 kg bag of flour into 4 equal portions",
            dividend: 15, divisor: 4,
            answer: 3.75, answer_str: "3.75",
            unit: "", unitAfter: " kg each",
            step1: "15 \u00f7 4 = 3 remainder (the amount left over after dividing) 3",
            step2: "Bring down a 0: 30 \u00f7 4 = 7 remainder 2",
            step3: "Bring down a 0: 20 \u00f7 4 = 5",
            step4: "Answer: 3.75",
            interactDividend: 17, interactDivisor: 4,
            interactAnswer: 4.25, interactAnswer_str: "4.25",
            interactStep1: "17 \u00f7 4 = 4 remainder 1",
            busInitSteps: [{ result: 0, remainder: 1, carry: true }, { result: 3, remainder: 3 }],
            busDecDividend: 1500, busDecAfter: 1,
            busFullSteps: [
              { result: 0, remainder: 1, carry: true },
              { result: 3, remainder: 3, carry: true },
              { result: 7, remainder: 2, carry: true },
              { result: 5, remainder: 0 }
            ]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.dividend} \u00f7 ${v.divisor} \u2014 but it doesn't divide exactly!`,
            body: (v) => `${v.name} is ${v.scenario}. That's **${v.dividend} \u00f7 ${v.divisor}**.\n\nBut ${v.dividend} doesn't divide exactly by ${v.divisor}! What do you do with the remainder (what's left over)? You **keep going past the decimal point**!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.dividend} \u00f7 ${v.divisor} = ???`, why: "There will be a remainder \u2014 but we can deal with it!" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Keep dividing past the point!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `When you get a remainder, add a decimal point and zeros, then keep dividing.`
              },
              {
                type: 'text',
                content: (v) => `**Step 1:** ${v.step1}`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.dividend,
                  steps: v.busInitSteps
                })
              },
              {
                type: 'text',
                content: () => `**Step 2:** Add a decimal point and put a **0** next to the remainder. The remainder becomes tenths!`
              },
              {
                type: 'text',
                content: (v) => `**Step 3:** ${v.step2}`
              },
              {
                type: 'text',
                content: (v) => `**Step 4:** ${v.step3}`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.busDecDividend,
                  decimalAfter: v.busDecAfter,
                  steps: v.busFullSteps
                })
              },
              {
                type: 'text',
                content: (v) => `**${v.step4}** \u2014 that's **${v.unit}${v.answer_str}${v.unitAfter}** \u2713`
              }
            ],
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDividend} \u00f7 ${v.interactDivisor}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.interactStep1, why: "Got a remainder..." },
                  { text: "Add decimal point and keep going!", why: "Turn the remainder into tenths and hundredths" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDividend} \u00f7 ${v.interactDivisor} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDividend} \u00f7 ${v.interactDivisor} = ${v.interactAnswer_str}**. You kept going past the decimal point! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactStep1}. Then keep dividing past the point. The answer is **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remainders become decimals!",
            bodyParts: [
              {
                type: 'text',
                content: () => `You don't have to stop when you get a remainder. **Keep dividing** to get an exact decimal answer.`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: () => ({
                  min: 0, max: 4,
                  points: [
                    { value: 2, label: "2", color: "#c084fc" },
                    { value: 2.25, label: "2.25", color: "#34d399" },
                    { value: 3, label: "3", color: "#c084fc" }
                  ],
                  jumps: [], tickInterval: 0.5, showLabels: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Divide as normal until you get a remainder", why: "e.g. 9 \u00f7 4 = 2 remainder 1" },
                    { text: "Step 2: Add a decimal point after the whole number", why: "Write 2. then keep going" },
                    { text: "Step 3: 'Bring down a zero' and divide again", why: "10 \u00f7 4 = 2 remainder 2, then 20 \u00f7 4 = 5" },
                    { text: "Step 4: Stop when there's no remainder", why: "9 \u00f7 4 = 2.25 \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Curiosity Hook ----
      {
        id: "dividing-to-decimal-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply decimal division to real-life sharing and measuring problems",
          "When to watch out for stopping the division too early"
        ],
        variableSets: [
          {
            name: "George",
            scenario: "Four friends share a \u00a37 prize. How much each?",
            dividend: 7, divisor: 4,
            answer: 1.75, answer_str: "1.75",
            explanation: "7 \u00f7 4 = 1 remainder 3. Bring down a 0: 30 \u00f7 4 = 7 remainder 2. Bring down a 0: 20 \u00f7 4 = 5. Answer: 1.75.",
            busDecDividend: 700, busDecAfter: 0,
            busSteps: [
              { result: 1, remainder: 3, carry: true },
              { result: 7, remainder: 2, carry: true },
              { result: 5, remainder: 0 }
            ],
            testDividend: 5, testDivisor: 4, testAnswer: 1.25, testAnswer_str: "1.25"
          },
          {
            name: "Hannah",
            scenario: "A 13-metre fence is split into 4 sections. How long each?",
            dividend: 13, divisor: 4,
            answer: 3.25, answer_str: "3.25",
            explanation: "13 \u00f7 4 = 3 r1, then 10 \u00f7 4 = 2 r2, then 20 \u00f7 4 = 5. Answer: 3.25.",
            busDecDividend: 1300, busDecAfter: 1,
            busSteps: [
              { result: 0, remainder: 1, carry: true },
              { result: 3, remainder: 1, carry: true },
              { result: 2, remainder: 2, carry: true },
              { result: 5, remainder: 0 }
            ],
            testDividend: 9, testDivisor: 2, testAnswer: 4.5, testAnswer_str: "4.5"
          },
          {
            name: "Isaac",
            scenario: "6 biscuits shared among 8 children. How many each?",
            dividend: 6, divisor: 8,
            answer: 0.75, answer_str: "0.75",
            explanation: "6 \u00f7 8 = 0 r6, then 60 \u00f7 8 = 7 r4, then 40 \u00f7 8 = 5. Answer: 0.75.",
            busDecDividend: 600, busDecAfter: 0,
            busSteps: [
              { result: 0, remainder: 6, carry: true },
              { result: 7, remainder: 4, carry: true },
              { result: 5, remainder: 0 }
            ],
            testDividend: 11, testDivisor: 4, testAnswer: 2.75, testAnswer_str: "2.75"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What happens when you can't share equally?`,
            body: (v) => `${v.scenario}\n\nThat's **${v.dividend} \u00f7 ${v.divisor}**. It doesn't split into whole numbers \u2014 so we need a **decimal answer**!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({ min: 0, max: v.dividend + 1, points: [{ value: v.answer, label: v.answer_str, color: "#34d399" }], jumps: [], tickInterval: 1, showLabels: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Keep dividing!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**${v.dividend} \u00f7 ${v.divisor}**: start with whole numbers.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.busDecDividend,
                  steps: v.busSteps,
                  showAnswer: true,
                  decimalAfter: v.busDecAfter
                })
              },
              {
                type: 'text',
                content: (v) => `${v.explanation}`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.dividend} \u00f7 ${v.divisor} = ${Math.floor(v.dividend / v.divisor)} remainder ${v.dividend % v.divisor}`, why: "Start with whole-number division" },
                    { text: "Add a decimal point and put zeros next to the remainder (what is left over after dividing)", why: "Keep dividing the remainder" },
                    { text: `Answer: ${v.answer_str}`, result: "Exact answer \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When division has a remainder, add a ____ point and keep dividing`,
              options: (v) => ["decimal", "fraction", "percentage", "minus"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Add a decimal point and zeros, then keep dividing the remainder. \u2713`,
                incorrect: (v) => `Not quite \u2014 when you have a remainder, add a decimal point and keep going.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.testDividend} \u00f7 ${v.testDivisor}**? Keep dividing past the decimal point!`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.testDividend} \u00f7 ${v.testDivisor} = ?`,
              getOptions: (v) => decimalDistractors(v.testAnswer),
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Superstar! **${v.testDividend} \u00f7 ${v.testDivisor} = ${v.testAnswer_str}**. \u2713`,
                incorrect: (v) => `Not quite! Keep dividing past the point. **${v.testDividend} \u00f7 ${v.testDivisor} = ${v.testAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decimals from division",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever division doesn't come out as a whole number, **keep going past the decimal point**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Don't stop at the remainder \u2014 keep dividing!", why: "Add a point and zeros to continue" },
                    { text: "Some answers terminate: 9 \u00f7 4 = 2.25", why: "They eventually have no remainder" },
                    { text: "Some answers recur: 10 \u00f7 3 = 3.333...", why: "The remainder keeps repeating \u2014 round if needed \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: rounding-decimals
  // Rounding to nearest whole or 1dp
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "rounding-decimals",
    name: "Rounding Decimals",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "rounding-decimals-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to round a decimal to 1 decimal place or the nearest whole number",
          "How to choose which digit to look at when rounding up or down"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "rounding a race time to 1 decimal place",
            number: 12.47, number_str: "12.47",
            roundTo: "1 decimal place",
            lookAt: 7, lookAtPlace: "hundredths", keepDigit: 4, keepPlace: "tenths",
            answer: 12.5, answer_str: "12.5",
            direction: "up", reason: "7 is 5 or more, so we round UP",
            // Interact-specific
            interactNumber: 8.63, interactNumber_str: "8.63",
            interactRoundTo: "1 decimal place",
            interactLookAt: 3, interactLookAtPlace: "hundredths", interactKeepPlace: "tenths",
            interactAnswer: 8.6, interactAnswer_str: "8.6",
            interactDirection: "down",
            pvcColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            pvcDigits: [1, 2, ".", 4, 7],
            pvcKeepCol: 3, pvcLookCol: 4
          },
          {
            name: "Ben",
            scenario: "rounding a height measurement to the nearest whole number",
            number: 1.38, number_str: "1.38",
            roundTo: "the nearest whole number",
            lookAt: 3, lookAtPlace: "tenths", keepDigit: 1, keepPlace: "ones",
            answer: 1, answer_str: "1",
            direction: "down", reason: "3 is less than 5, so we round DOWN",
            interactNumber: 4.72, interactNumber_str: "4.72",
            interactRoundTo: "the nearest whole number",
            interactLookAt: 7, interactLookAtPlace: "tenths", interactKeepPlace: "ones",
            interactAnswer: 5, interactAnswer_str: "5",
            interactDirection: "up",
            pvcColumns: ["Ones", ".", "10ths", "100ths"],
            pvcDigits: [1, ".", 3, 8],
            pvcKeepCol: 0, pvcLookCol: 2
          },
          {
            name: "Chloe",
            scenario: "rounding a temperature reading to 1 decimal place",
            number: 36.85, number_str: "36.85",
            roundTo: "1 decimal place",
            lookAt: 5, lookAtPlace: "hundredths", keepDigit: 8, keepPlace: "tenths",
            answer: 36.9, answer_str: "36.9",
            direction: "up", reason: "5 is exactly 5, so we round UP",
            interactNumber: 23.14, interactNumber_str: "23.14",
            interactRoundTo: "1 decimal place",
            interactLookAt: 4, interactLookAtPlace: "hundredths", interactKeepPlace: "tenths",
            interactAnswer: 23.1, interactAnswer_str: "23.1",
            interactDirection: "down",
            pvcColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            pvcDigits: [3, 6, ".", 8, 5],
            pvcKeepCol: 3, pvcLookCol: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Round ${v.number_str} to ${v.roundTo}`,
            body: (v) => `${v.name} is ${v.scenario}. The exact value is **${v.number_str}**, but we need it rounded to **${v.roundTo}**.\n\nRounding means finding the **nearest** simpler number. But which way \u2014 up or down?`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                // Keep range tight: floor to ceil of the number, with ~10 ticks max
                const lo = Math.floor(v.number * 10) / 10 - 0.2;
                const hi = Math.ceil(v.number * 10) / 10 + 0.2;
                const range = hi - lo;
                const tick = range <= 1 ? 0.1 : 0.5;
                return {
                  min: Math.round(lo * 10) / 10,
                  max: Math.round(hi * 10) / 10,
                  points: [{ value: v.number, label: v.number_str, color: "#c084fc" }],
                  jumps: [], tickInterval: tick, showLabels: true
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Look at the NEXT digit",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `To round to **${v.roundTo}**, find the digit you're rounding to (the **${v.keepPlace}**), then look at the **next digit to the right** (the **${v.lookAtPlace}**).`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.pvcColumns,
                  rows: [{ label: v.number_str, values: v.pvcDigits }],
                  highlight: [[0, v.pvcKeepCol], [0, v.pvcLookCol]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the ${v.keepPlace} digit: ${v.keepDigit}`, why: "This is the digit we're rounding to" },
                    { text: `Look at the next digit: ${v.lookAt}`, why: `This is the ${v.lookAtPlace} — it decides up or down` },
                    { text: `${v.lookAt} is ${v.lookAt >= 5 ? "5 or more" : "less than 5"} \u2192 round ${v.direction.toUpperCase()}`, why: v.reason },
                    { text: `${v.number_str} rounded to ${v.roundTo} = ${v.answer_str}`, result: `${v.answer_str} \u2713` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the ${v.keepPlace} digit: ${v.keepDigit}`,
                `Look at the next digit to the right: ${v.lookAt}`,
                `${v.lookAt} is ${v.lookAt >= 5 ? "5 or more \u2192 round UP" : "less than 5 \u2192 round DOWN"}`,
                `Answer: ${v.answer_str}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find, look, decide, answer. \u2713`,
                incorrect: (v) => `Not quite \u2014 first find the digit, then look at the next one to decide up or down.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Round **${v.interactNumber_str}** to **${v.interactRoundTo}**.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: Math.floor(v.interactNumber), max: Math.ceil(v.interactNumber),
                points: [{ value: v.interactNumber, label: v.interactNumber_str, color: "#c084fc" }],
                jumps: [], tickInterval: 0.1, showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber_str} rounded to ${v.interactRoundTo} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer, v.interactRoundTo === "the nearest whole number" ? 0 : 1),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Spot on! **${v.interactNumber_str}** rounded to ${v.interactRoundTo} is **${v.interactAnswer_str}**. \u2713`,
                incorrect: (v) => `Not quite! Look at the ${v.interactLookAtPlace} digit (${v.interactLookAt}). It's ${v.interactLookAt >= 5 ? "5 or more" : "less than 5"}, so round ${v.interactDirection}. Answer: **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The rounding rule",
            bodyParts: [
              {
                type: 'text',
                content: () => `Rounding is simple once you know the rule: look at the **next digit to the right** of the one you're rounding to.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the digit you're rounding to", why: "e.g. for 1 decimal place, find the tenths digit" },
                    { text: "Look at the NEXT digit to the right", why: "This is the 'deciding digit'" },
                    { text: "5 or more \u2192 round UP", why: "The digit goes up by 1" },
                    { text: "Less than 5 \u2192 round DOWN (stays the same)", why: "The digit stays as it is \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "rounding-decimals-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid looking at the wrong digit when rounding decimals",
          "Why rounding 7.68 to 1 decimal place (1dp) gives 7.7, not 7.6"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "rounded 7.68 to 1 decimal place and got 7.6 \u2014 he looked at the 6 instead of the 8",
            number_str: "7.68",
            wrongAnswer: "7.6", correctAnswer: "7.7", correctNum: 7.7,
            mistake: "looked at the wrong digit \u2014 he looked at the tenths (6) to decide, but should have looked at the hundredths (8)",
            explanation: "To round to 1 decimal place, the TENTHS digit stays or goes up. Look at the HUNDREDTHS (8) to decide: 8 >= 5, so round UP. 7.68 \u2192 7.7",
            // Interact-specific
            interactNumber_str: "5.43",
            interactCorrectAnswer: "5.4", interactCorrectNum: 5.4,
            interactExplanation: "Look at the hundredths (3). 3 < 5, so round down. 5.43 \u2192 5.4",
            pvcColumns: ["Ones", ".", "10ths", "100ths"],
            pvcDigits: [7, ".", 6, 8],
            pvcKeepCol: 2, pvcLookCol: 3
          },
          {
            name: "Ruby",
            scenario: "rounded 4.95 to 1 decimal place (1dp) and got 4.9 \u2014 she forgot that 5 means round UP",
            number_str: "4.95",
            wrongAnswer: "4.9", correctAnswer: "5.0", correctNum: 5.0,
            mistake: "thought 5 meant 'stay the same' but 5 always means round UP",
            explanation: "The hundredths digit is 5. Remember: 5 or more = round UP! The 9 becomes 10, which carries: 4.95 \u2192 5.0",
            interactNumber_str: "6.85",
            interactCorrectAnswer: "6.9", interactCorrectNum: 6.9,
            interactExplanation: "Look at the hundredths (5). 5 or more = round UP. 6.85 \u2192 6.9",
            pvcColumns: ["Ones", ".", "10ths", "100ths"],
            pvcDigits: [4, ".", 9, 5],
            pvcKeepCol: 2, pvcLookCol: 3
          },
          {
            name: "Oscar",
            scenario: "rounded 3.24 to the nearest whole and got 4 \u2014 he rounded up by mistake",
            number_str: "3.24",
            wrongAnswer: "4", correctAnswer: "3", correctNum: 3,
            mistake: "rounded up when he should have rounded down \u2014 the tenths digit is 2, which is less than 5",
            explanation: "Look at the tenths digit (2). Since 2 < 5, round DOWN. 3.24 \u2192 3, not 4.",
            interactNumber_str: "8.71",
            interactCorrectAnswer: "9", interactCorrectNum: 9,
            interactExplanation: "Look at the tenths (7). 7 >= 5, so round up. 8.71 \u2192 9",
            pvcColumns: ["Ones", ".", "10ths", "100ths"],
            pvcDigits: [3, ".", 2, 4],
            pvcKeepCol: 0, pvcLookCol: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} round correctly?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nIs the answer right or wrong?`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's check step by step",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistake}.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.pvcColumns,
                  rows: [{ label: v.number_str, values: v.pvcDigits }],
                  highlight: [[0, v.pvcKeepCol], [0, v.pvcLookCol]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const sentences = v.explanation.split('. ').filter(s => s.trim());
                  const explSteps = sentences.map(s => ({
                    text: s.replace(/\.$/, '').trim(), why: ""
                  }));
                  return {
                    steps: [
                      { text: `${v.name} said: ${v.number_str} \u2192 ${v.wrongAnswer}`, why: "This is WRONG" },
                      ...explSteps,
                      { text: `Correct answer: ${v.correctAnswer}`, result: `${v.correctAnswer} \u2713` }
                    ],
                    allRevealed: true
                  };
                }
              }
            ],
            interaction: null
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What does **${v.interactNumber_str}** round to?`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Round ${v.interactNumber_str} correctly:`,
              getOptions: (v) => decimalDistractors(v.interactCorrectNum, v.interactCorrectNum === Math.floor(v.interactCorrectNum) ? 0 : 1),
              correctAnswer: (v) => v.interactCorrectNum,
              feedback: {
                correct: (v) => `Well done! **${v.interactNumber_str}** rounds to **${v.interactCorrectAnswer}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Common rounding mistakes to avoid",
            bodyParts: [
              {
                type: 'text',
                content: () => `Watch out for these traps when rounding decimals:`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: () => ({
                  min: 4.8, max: 5.2,
                  points: [
                    { value: 4.95, label: "4.95", color: "#c084fc" }
                  ],
                  jumps: [], tickInterval: 0.05, showLabels: true,
                  highlight: [4.9, 5.0]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Look at the RIGHT digit, not the one you're rounding to!", why: "To round tenths, look at hundredths" },
                    { text: "5 ALWAYS means round UP", why: "Don't leave it \u2014 5 or more goes up" },
                    { text: "Watch for carrying: 4.95 rounds to 5.0, not 4.10", why: "When 9 rounds up, it carries \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 9: decimal-to-fraction
  // Converting decimal to fraction and simplifying
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: key-fact
  // ==========================================
  {
    id: "decimal-to-fraction",
    name: "Decimal to Fraction",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "decimal-to-fraction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to write a decimal as a fraction over 10, 100 or 1000",
          "How to simplify the fraction afterwards"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "writing her science result as a fraction",
            decimal: 0.75, decimal_str: "0.75",
            dp: 2, denominator: 100, numerator: 75,
            simplified: "3/4", simplifiedNum: 3, simplifiedDen: 4,
            gcf: 25, simplifySteps: "75 and 100 both divide by 25",
            // Interact-specific
            interactDecimal_str: "0.6", interactDp: 1,
            interactDenominator: 10, interactNumerator: 6,
            interactSimplified: "3/5", interactSimplifiedNum: 3, interactSimplifiedDen: 5,
            interactGcf: 2, interactSimplifySteps: "6 and 10 both divide by 2"
          },
          {
            name: "Ben",
            scenario: "converting a measurement for his recipe",
            decimal: 0.4, decimal_str: "0.4",
            dp: 1, denominator: 10, numerator: 4,
            simplified: "2/5", simplifiedNum: 2, simplifiedDen: 5,
            gcf: 2, simplifySteps: "4 and 10 both divide by 2",
            interactDecimal_str: "0.8", interactDp: 1,
            interactDenominator: 10, interactNumerator: 8,
            interactSimplified: "4/5", interactSimplifiedNum: 4, interactSimplifiedDen: 5,
            interactGcf: 2, interactSimplifySteps: "8 and 10 both divide by 2"
          },
          {
            name: "Chloe",
            scenario: "converting a test score to a fraction",
            decimal: 0.6, decimal_str: "0.6",
            dp: 1, denominator: 10, numerator: 6,
            simplified: "3/5", simplifiedNum: 3, simplifiedDen: 5,
            gcf: 2, simplifySteps: "6 and 10 both divide by 2",
            interactDecimal_str: "0.25", interactDp: 2,
            interactDenominator: 100, interactNumerator: 25,
            interactSimplified: "1/4", interactSimplifiedNum: 1, interactSimplifiedDen: 4,
            interactGcf: 25, interactSimplifySteps: "25 and 100 both divide by 25"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.decimal_str} as a fraction?`,
            body: (v) => `${v.name} is ${v.scenario}. The value is **${v.decimal_str}**. Can we write that as a **fraction**?\n\nYes! Every decimal can be written as a fraction. Here's how...`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                if (v.dp === 1) return { columns: ["Ones", ".", "10ths"], rows: [{ label: v.decimal_str, values: [0, ".", v.numerator] }], highlight: [[0, 2]] };
                return { columns: ["Ones", ".", "10ths", "100ths"], rows: [{ label: v.decimal_str, values: [0, ".", Math.floor(v.numerator / 10), v.numerator % 10] }], highlight: [[0, 2], [0, 3]] };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count the decimal places!",
            body: (v) => `The number of decimal places tells you the denominator (the bottom number of a fraction). Tap to see the steps!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.decimal_str} has ${v.dp} decimal place${v.dp > 1 ? "s" : ""}`, why: `So the bottom number is ${v.denominator}` },
                  { text: `Write as a fraction: ${v.numerator}/${v.denominator}`, why: `${v.decimal_str} = ${v.numerator} over ${v.denominator}` },
                  { text: `Simplify: ${v.simplifySteps}`, why: `÷ ${v.gcf} top and bottom` },
                  { text: `${v.decimal_str} = ${v.simplified}`, result: `${v.simplified} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Count decimal places: ${v.dp}`,
                `Write as a fraction: ${v.numerator}/${v.denominator}`,
                `Simplify by dividing top and bottom by ${v.gcf}`,
                `Answer: ${v.simplified}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Count places, write the fraction, then simplify. ✓`,
                incorrect: (v) => `Not quite — first count the decimal places to find the denominator.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDecimal_str}** as a simplified fraction?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactDecimal_str} = ${v.interactNumerator}/${v.interactDenominator}`, why: "Now simplify..." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimal_str} as a simplified fraction = ?`,
              getOptions: (v) => [
                v.interactSimplified,
                `${v.interactNumerator}/${v.interactDenominator}`,
                `${v.interactSimplifiedNum + 1}/${v.interactSimplifiedDen}`,
                `${v.interactSimplifiedNum}/${v.interactSimplifiedDen + 1}`,
                `${v.interactSimplifiedNum}/${v.interactSimplifiedDen - 1}`
              ].filter((_, i, arr) => arr.indexOf(arr[i]) === i).concat(["1/2"]).slice(0, 5),
              correctAnswer: (v) => v.interactSimplified,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDecimal_str} = ${v.interactSimplified}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactDecimal_str} = ${v.interactNumerator}/${v.interactDenominator}. ${v.interactSimplifySteps}, giving **${v.interactSimplified}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decimal to fraction recipe",
            body: () => `To convert any decimal to a fraction, follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1 decimal place \u2192 bottom number is 10", why: "0.3 = 3/10" },
                  { text: "2 decimal places \u2192 bottom number is 100", why: "0.75 = 75/100" },
                  { text: "3 decimal places \u2192 bottom number is 1000", why: "0.125 = 125/1000" },
                  { text: "Then simplify by dividing top and bottom by the same number", why: "75/100 = 3/4 \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Key Fact ----
      {
        id: "decimal-to-fraction-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to apply decimal-to-fraction conversion to everyday quantities",
          "When to watch out for forgetting to simplify the fraction at the end"
        ],
        variableSets: [
          {
            name: "Daisy",
            decimal: 0.5, decimal_str: "0.5", fraction: "1/2",
            num: 5, den: 10, sNum: 1, sDen: 2, gcf: 5
          },
          {
            name: "Ethan",
            decimal: 0.25, decimal_str: "0.25", fraction: "1/4",
            num: 25, den: 100, sNum: 1, sDen: 4, gcf: 25
          },
          {
            name: "Freya",
            decimal: 0.125, decimal_str: "0.125", fraction: "1/8",
            num: 125, den: 1000, sNum: 1, sDen: 8, gcf: 125
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Decimals and fractions are friends!",
            body: (v) => `Did you know that **${v.decimal_str}** is the same as **${v.fraction}**? Every decimal is secretly a fraction. Let's see why!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.sNum, label: v.fraction, color: "#c084fc" },
                  { value: v.sDen - v.sNum, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.decimal_str} = ${v.fraction}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The key facts to memorise",
            body: () => `These common decimals and fractions come up ALL the time in 11+ exams. Learn them by heart!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.5 = 1/2", why: "Half" },
                  { text: "0.25 = 1/4", why: "Quarter" },
                  { text: "0.75 = 3/4", why: "Three quarters" },
                  { text: "0.1 = 1/10", why: "One tenth" },
                  { text: "0.2 = 1/5", why: "One fifth" },
                  { text: "0.125 = 1/8", why: "One eighth" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "0.5", right: "1/2" },
                { left: "0.25", right: "1/4" },
                { left: "0.75", right: "3/4" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Quick fire!",
            body: (v) => `What fraction is **${v.decimal_str}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.sNum, label: "?", color: "#c084fc" },
                  { value: v.sDen - v.sNum, label: "", color: "#e5e7eb", empty: true }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.decimal_str} = ?`,
              getOptions: (v) => [v.fraction, `${v.sNum}/${v.sDen + 2}`, `${v.sNum + 1}/${v.sDen}`, `${v.num}/${v.den}`, `${v.sNum}/${v.sDen * 2}`],
              correctAnswer: (v) => v.fraction,
              feedback: {
                correct: (v) => `Spot on! **${v.decimal_str} = ${v.fraction}**. One to remember! \u2713`,
                incorrect: (v) => `Not quite! **${v.decimal_str} = ${v.fraction}**. This is one to learn by heart.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Memorise these conversions!",
            body: () => `Knowing these by heart will save you loads of time in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.5 = 1/2 | 0.25 = 1/4 | 0.75 = 3/4", why: "Halves and quarters" },
                  { text: "0.1 = 1/10 | 0.2 = 1/5 | 0.4 = 2/5", why: "Tenths and fifths" },
                  { text: "0.125 = 1/8 | 0.375 = 3/8", why: "Eighths \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 10: fraction-to-decimal
  // Converting fraction to decimal by dividing
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "fraction-to-decimal",
    name: "Fraction to Decimal",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "fraction-to-decimal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to turn a fraction into a decimal by dividing",
          "How to recall which common fractions you should know as decimals"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "converting 3/4 to a decimal for her calculator",
            fraction: "3/4", numerator: 3, denominator: 4,
            answer: 0.75, answer_str: "0.75",
            step1: "3 \u00f7 4: 4 doesn't go into 3, so write 0.",
            step2: "30 \u00f7 4 = 7 remainder 2",
            step3: "20 \u00f7 4 = 5 exactly",
            step4: "3/4 = 0.75",
            // Interact-specific
            interactFraction: "1/4", interactNumerator: 1, interactDenominator: 4,
            interactAnswer: 0.25, interactAnswer_str: "0.25"
          },
          {
            name: "Ben",
            scenario: "converting 1/8 to enter into a spreadsheet",
            fraction: "1/8", numerator: 1, denominator: 8,
            answer: 0.125, answer_str: "0.125",
            step1: "1 \u00f7 8: 8 doesn't go into 1, so write 0.",
            step2: "10 \u00f7 8 = 1 remainder 2",
            step3: "20 \u00f7 8 = 2 remainder 4, then 40 \u00f7 8 = 5",
            step4: "1/8 = 0.125",
            interactFraction: "3/8", interactNumerator: 3, interactDenominator: 8,
            interactAnswer: 0.375, interactAnswer_str: "0.375"
          },
          {
            name: "Chloe",
            scenario: "converting 2/5 to compare with 0.35",
            fraction: "2/5", numerator: 2, denominator: 5,
            answer: 0.4, answer_str: "0.4",
            step1: "2 \u00f7 5: 5 doesn't go into 2, so write 0.",
            step2: "20 \u00f7 5 = 4 exactly",
            step3: "No remainder \u2014 done!",
            step4: "2/5 = 0.4",
            interactFraction: "3/5", interactNumerator: 3, interactDenominator: 5,
            interactAnswer: 0.6, interactAnswer_str: "0.6"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.fraction} as a decimal?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nTo turn a fraction into a decimal, just **divide the top by the bottom**. The fraction bar literally means "divided by"!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.fraction} means ${v.numerator} \u00f7 ${v.denominator}`, why: "The fraction bar = division" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide top by bottom",
            body: (v) => `To convert a fraction, divide the **numerator** (top number) by the **denominator** (bottom number). Let's work through ${v.numerator} \u00f7 ${v.denominator} step by step. Tap to see!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.step1, why: "Start dividing" },
                  { text: v.step2, why: "Keep going with the remainder (what is left over after dividing)" },
                  { text: v.step3, why: "Continue until done" },
                  { text: v.step4, result: `${v.answer_str} \u2713` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactFraction}** as a decimal?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                points: [],
                jumps: [], tickInterval: 0.1, showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactFraction} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer, v.interactAnswer_str.split(".")[1]?.length || 1),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactFraction} = ${v.interactAnswer_str}**. Just divide top by bottom! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactNumerator} \u00f7 ${v.interactDenominator} = **${v.interactAnswer_str}**. The fraction bar means divide!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Fraction to decimal = divide!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The fraction bar **is** a division sign. To convert any fraction to a decimal:`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: () => ({
                  min: 0, max: 1,
                  points: [
                    { value: 0.25, label: "1/4", color: "#c084fc" },
                    { value: 0.5, label: "1/2", color: "#34d399" },
                    { value: 0.75, label: "3/4", color: "#7C3AED" }
                  ],
                  jumps: [], tickInterval: 0.1, showLabels: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Divide the numerator (the top number) by the denominator (the bottom number)", why: "3/4 means 3 \u00f7 4" },
                    { text: "Add decimal point and zeros to keep dividing", why: "Just like dividing to a decimal answer" },
                    { text: "Some fractions give neat decimals: 1/4 = 0.25", why: "These terminate (stop)" },
                    { text: "Some repeat forever: 1/3 = 0.333...", why: "These are recurring decimals \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Visual Discovery ----
      {
        id: "fraction-to-decimal-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to apply fraction-to-decimal conversion in exam-style questions",
          "When to use known decimal equivalents instead of calculating from scratch"
        ],
        variableSets: [
          {
            name: "Daisy",
            fraction: "1/2", numerator: 1, denominator: 2,
            decimal: 0.5, decimal_str: "0.5",
            barParts: 2, barFilled: 1,
            // Interact-specific
            interactFraction: "3/4", interactNumerator: 3, interactDenominator: 4,
            interactDecimal: 0.75, interactDecimal_str: "0.75",
            interactBarParts: 4, interactBarFilled: 3
          },
          {
            name: "Ethan",
            fraction: "1/4", numerator: 1, denominator: 4,
            decimal: 0.25, decimal_str: "0.25",
            barParts: 4, barFilled: 1,
            interactFraction: "2/5", interactNumerator: 2, interactDenominator: 5,
            interactDecimal: 0.4, interactDecimal_str: "0.4",
            interactBarParts: 5, interactBarFilled: 2
          },
          {
            name: "Freya",
            fraction: "3/10", numerator: 3, denominator: 10,
            decimal: 0.3, decimal_str: "0.3",
            barParts: 10, barFilled: 3,
            interactFraction: "7/10", interactNumerator: 7, interactDenominator: 10,
            interactDecimal: 0.7, interactDecimal_str: "0.7",
            interactBarParts: 10, interactBarFilled: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you see ${v.fraction} on the number line?`,
            body: (v) => `${v.name} is looking at **${v.fraction}** on a number line. Where does it land?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                points: [{ value: v.decimal, label: "?", color: "#c084fc" }],
                jumps: [], tickInterval: 0.1, showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `${v.fraction} = ${v.decimal_str}`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at the bar model: **${v.barFilled}** out of **${v.barParts}** parts are filled. That's **${v.fraction}**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => {
                  const segs = [];
                  for (let i = 0; i < v.barParts; i++) {
                    segs.push({ value: 1, label: "", color: i < v.barFilled ? "#c084fc" : "#e5e7eb", empty: i >= v.barFilled });
                  }
                  return { segments: segs, totalLabel: `${v.fraction}`, showValues: false };
                }
              },
              {
                type: 'text',
                content: (v) => `Divide: ${v.numerator} \u00f7 ${v.denominator} = **${v.decimal_str}**. The fraction and decimal show the same amount!\n\nHere are the key fraction-decimal pairs to memorise:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.numerator} \u00f7 ${v.denominator} = ${v.decimal_str}`, result: `${v.fraction} = ${v.decimal_str} \u2713` },
                    { text: "1/2 = 0.5 | 1/4 = 0.25 | 3/4 = 0.75", why: "Halves and quarters" },
                    { text: "1/5 = 0.2 | 2/5 = 0.4 | 3/5 = 0.6 | 4/5 = 0.8", why: "Fifths" },
                    { text: "1/10 = 0.1 | 3/10 = 0.3 | 7/10 = 0.7", why: "Tenths" },
                    { text: "1/8 = 0.125 | 1/3 = 0.333...", why: "Eighths and thirds" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "1/5", right: "0.2" },
                { left: "1/10", right: "0.1" },
                { left: "1/8", right: "0.125" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactFraction}** as a decimal?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.interactBarParts; i++) {
                  segs.push({ value: 1, label: "", color: i < v.interactBarFilled ? "#c084fc" : "#e5e7eb", empty: i >= v.interactBarFilled });
                }
                return { segments: segs, totalLabel: `${v.interactFraction} = ?`, showValues: false };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactFraction} as a decimal = ?`,
              getOptions: (v) => decimalDistractors(v.interactDecimal, 1),
              correctAnswer: (v) => v.interactDecimal,
              feedback: {
                correct: (v) => `Superstar! **${v.interactFraction} = ${v.interactDecimal_str}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactNumerator} \u00f7 ${v.interactDenominator} = **${v.interactDecimal_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Key fraction-decimal pairs",
            bodyParts: [
              {
                type: 'text',
                content: () => `These fraction-decimal pairs come up in almost every exam \u2014 learn them by heart!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "To convert: divide the top by the bottom", why: "numerator \u00f7 denominator = decimal" },
                    { text: "1/2 = 0.5 | 1/4 = 0.25 | 3/4 = 0.75", why: "Halves and quarters" },
                    { text: "1/5 = 0.2 | 2/5 = 0.4 | 3/5 = 0.6 | 4/5 = 0.8", why: "Fifths" },
                    { text: "1/10 = 0.1 | 1/8 = 0.125 | 1/3 = 0.333...", why: "Tenths, eighths, thirds \u2713" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 11: decimal-to-percentage
  // Converting decimal to percentage (x 100)
  // Category: other
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "decimal-to-percentage",
    name: "Decimal to Percentage",
    category: "other",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "decimal-to-percentage-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to convert a decimal to a percentage by multiplying by 100",
          "Why 0.5 = 50% and 0.05 = 5% are very different"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "got 0.85 on a test and wants to know her percentage",
            decimal: 0.85, decimal_str: "0.85",
            percentage: 85, percentage_str: "85%",
            // Interact-specific
            interactDecimal: 0.72, interactDecimal_str: "0.72",
            interactPercentage: 72, interactPercentage_str: "72%"
          },
          {
            name: "Ben",
            scenario: "sees a sale with 0.3 off and wants to know the percentage discount",
            decimal: 0.3, decimal_str: "0.3",
            percentage: 30, percentage_str: "30%",
            interactDecimal: 0.45, interactDecimal_str: "0.45",
            interactPercentage: 45, interactPercentage_str: "45%"
          },
          {
            name: "Chloe",
            scenario: "hears that 0.05 of the school voted for her \u2014 is that a lot?",
            decimal: 0.05, decimal_str: "0.05",
            percentage: 5, percentage_str: "5%",
            interactDecimal: 0.15, interactDecimal_str: "0.15",
            interactPercentage: 15, interactPercentage_str: "15%"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.decimal_str} = what percent?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nConverting a decimal to a percentage is super easy: just **multiply by 100**! That's the same as shifting all digits **two places left**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.decimal_str} \u00d7 100 = ${v.percentage}`, why: `So ${v.decimal_str} = ${v.percentage_str}` }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply by 100 = shift 2 left",
            body: (v) => `"Per cent" literally means "per hundred". So to go from a decimal to a percentage, multiply by 100.\n\n**${v.decimal_str} × 100 = ${v.percentage}**, so **${v.decimal_str} = ${v.percentage_str}**.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percentage, label: `${v.percentage_str}`, color: "#c084fc" },
                  { value: 100 - v.percentage, label: `${100 - v.percentage}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.decimal_str} = ${v.percentage_str} (out of 100%)`,
                showValues: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To convert a decimal to a percentage, multiply by ____`,
              options: (v) => ["10", "100", "1000", "50"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! "Per cent" means "per hundred", so multiply by 100. ✓`,
                incorrect: (v) => `Not quite — "per cent" means "per hundred", so you multiply by 100.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDecimal_str}** as a percentage?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercentage, label: "?%", color: "#c084fc" },
                  { value: 100 - v.interactPercentage, label: "", color: "#e5e7eb", empty: true }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimal_str} = what percentage?`,
              getOptions: (v) => generateDistractors(v.interactPercentage),
              correctAnswer: (v) => v.interactPercentage,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDecimal_str} = ${v.interactPercentage_str}**. Just multiply by 100! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactDecimal_str} \u00d7 100 = **${v.interactPercentage}**, so it's **${v.interactPercentage_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decimal \u2192 percentage",
            body: () => `Remember: **decimal \u00d7 100 = percentage**. And watch out for the common trap!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.5 \u00d7 100 = 50%", why: "Half" },
                  { text: "0.05 \u00d7 100 = 5%", why: "NOT 50%! That extra zero matters" },
                  { text: "0.1 \u00d7 100 = 10%", why: "One tenth = 10 out of 100" },
                  { text: "1.0 \u00d7 100 = 100%", why: "The whole thing! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "decimal-to-percentage-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing 0.5 (50%) with 0.05 (5%) when converting",
          "When to watch out for moving the decimal point the wrong number of places"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "says 0.05 = 50% because 'you just remove the 0 and the point'",
            decimal_str: "0.05",
            wrongAnswer: "50%", correctAnswer: "5%", correctNum: 5,
            mistake: "ignored the zero after the point \u2014 0.05 is NOT 0.5!",
            explanation: "0.05 \u00d7 100 = 5, so 0.05 = 5%. That's very different from 0.5 = 50%!",
            // Interact-specific
            interactDecimal_str: "0.35",
            interactCorrectAnswer: "35%", interactCorrectNum: 35,
            interactExplanation: "0.35 \u00d7 100 = 35, so 0.35 = 35%."
          },
          {
            name: "Ruby",
            scenario: "says 0.8 = 8% because she just moved the point one place",
            decimal_str: "0.8",
            wrongAnswer: "8%", correctAnswer: "80%", correctNum: 80,
            mistake: "only shifted one place instead of two",
            explanation: "0.8 \u00d7 100 = 80, so 0.8 = 80%. She needed to shift TWO places left!",
            interactDecimal_str: "0.6",
            interactCorrectAnswer: "60%", interactCorrectNum: 60,
            interactExplanation: "0.6 \u00d7 100 = 60, so 0.6 = 60%."
          },
          {
            name: "Oscar",
            scenario: "says 0.125 = 125% because he removed the point",
            decimal_str: "0.125",
            wrongAnswer: "125%", correctAnswer: "12.5%", correctNum: 12.5,
            mistake: "removed the point entirely instead of multiplying by 100",
            explanation: "0.125 \u00d7 100 = 12.5, so 0.125 = 12.5%. 125% would mean more than the whole!",
            interactDecimal_str: "0.45",
            interactCorrectAnswer: "45%", interactCorrectNum: 45,
            interactExplanation: "0.45 \u00d7 100 = 45, so 0.45 = 45%."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.decimal_str} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} ${v.scenario}.\n\nIs that right?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.name}'s answer: ${v.decimal_str} = ${v.wrongAnswer}`, why: "Check this!" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.decimal_str} = ${v.wrongAnswer}`, why: v.mistake },
                  { text: `Right: ${v.decimal_str} = ${v.correctAnswer}`, why: `${v.decimal_str} × 100 = ${v.correctNum} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `0.5 as a percentage is 50%`, answer: true, explanation: "Correct — 0.5 × 100 = 50%. ✓" },
                { text: `To convert a decimal to a percentage, just move the decimal point one place`, answer: false, explanation: "You must move it TWO places to the right (multiply by 100), not one!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.interactDecimal_str}** as a percentage?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactCorrectNum, label: "?%", color: "#c084fc" },
                  { value: Math.max(100 - v.interactCorrectNum, 1), label: "", color: "#e5e7eb", empty: true }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimal_str} = what %?`,
              getOptions: (v) => {
                const opts = new Set([v.interactCorrectNum]);
                opts.add(v.interactCorrectNum * 10);
                opts.add(v.interactCorrectNum / 10);
                opts.add(v.interactCorrectNum + 5);
                opts.add(v.interactCorrectNum - 5);
                return [...opts].filter(x => x > 0).slice(0, 5).sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.interactCorrectNum,
              feedback: {
                correct: (v) => `Spot on! **${v.interactDecimal_str} = ${v.interactCorrectAnswer}**. \u2713`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Watch these common traps!",
            body: () => `When converting decimals to percentages, always **multiply by 100** (shift two places left).`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.5 = 50% but 0.05 = 5%", why: "That zero after the point makes a HUGE difference" },
                  { text: "0.8 = 80% (not 8%!)", why: "Shift TWO places, not one" },
                  { text: "Anything over 1.0 = more than 100%", why: "1.5 = 150% \u2014 that's more than the whole! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 12: multiplying-decimal-by-decimal
  // Multiplying two decimals (count decimal places)
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "multiplying-decimal-by-decimal",
    name: "Multiplying Decimal by Decimal",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "multiplying-decimal-by-decimal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to multiply two decimals together",
          "How to count total decimal places to place the point correctly"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "finding the area of a rectangle 0.3 m by 0.4 m",
            numA: 0.3, numA_str: "0.3", numB: 0.4, numB_str: "0.4",
            wholeA: 3, wholeB: 4, wholeProduct: 12,
            dpA: 1, dpB: 1, totalDp: 2,
            answer: 0.12, answer_str: "0.12",
            unit: "", unitAfter: " m\u00b2",
            // Interact-specific
            interactNumA_str: "0.5", interactNumB_str: "0.7",
            interactWholeA: 5, interactWholeB: 7, interactWholeProduct: 35,
            interactTotalDp: 2,
            interactAnswer: 0.35, interactAnswer_str: "0.35"
          },
          {
            name: "Ben",
            scenario: "working out 0.6 \u00d7 0.8 for a maths problem",
            numA: 0.6, numA_str: "0.6", numB: 0.8, numB_str: "0.8",
            wholeA: 6, wholeB: 8, wholeProduct: 48,
            dpA: 1, dpB: 1, totalDp: 2,
            answer: 0.48, answer_str: "0.48",
            unit: "", unitAfter: "",
            interactNumA_str: "0.4", interactNumB_str: "0.9",
            interactWholeA: 4, interactWholeB: 9, interactWholeProduct: 36,
            interactTotalDp: 2,
            interactAnswer: 0.36, interactAnswer_str: "0.36"
          },
          {
            name: "Chloe",
            scenario: "calculating 1.5 \u00d7 0.4 for a recipe",
            numA: 1.5, numA_str: "1.5", numB: 0.4, numB_str: "0.4",
            wholeA: 15, wholeB: 4, wholeProduct: 60,
            dpA: 1, dpB: 1, totalDp: 2,
            answer: 0.60, answer_str: "0.60",
            unit: "", unitAfter: "",
            interactNumA_str: "2.5", interactNumB_str: "0.3",
            interactWholeA: 25, interactWholeB: 3, interactWholeProduct: 75,
            interactTotalDp: 2,
            interactAnswer: 0.75, interactAnswer_str: "0.75"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.numA_str} \u00d7 ${v.numB_str} = ?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nMultiplying two decimals might look tricky, but there's a simple method: **ignore the points, multiply, then count the decimal places to put the point back!**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.numA_str} \u00d7 ${v.numB_str} = ???`, why: "Let's use the counting method!" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Ignore, multiply, count!",
            body: (v) => `Here's the method. Tap to see each step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ignore the points: ${v.numA_str} becomes ${v.wholeA}, ${v.numB_str} becomes ${v.wholeB}`, why: "Remove all decimal points" },
                  { text: `Multiply: ${v.wholeA} \u00d7 ${v.wholeB} = ${v.wholeProduct}`, why: "Just whole-number multiplication" },
                  { text: `Count total decimal places: ${v.dpA} + ${v.dpB} = ${v.totalDp}`, why: `${v.numA_str} has ${v.dpA} decimal place${v.dpA > 1 ? 's' : ''}, ${v.numB_str} has ${v.dpB} decimal place${v.dpB > 1 ? 's' : ''}` },
                  { text: `Put the point ${v.totalDp} places from the right`, why: `${v.wholeProduct} becomes ${v.answer_str}` },
                  { text: `${v.numA_str} \u00d7 ${v.numB_str} = ${v.answer_str}`, result: `${v.answer_str}${v.unitAfter} \u2713` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumA_str} \u00d7 ${v.interactNumB_str}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactWholeA} \u00d7 ${v.interactWholeB} = ${v.interactWholeProduct}`, why: "Whole-number multiplication done!" },
                  { text: `Total decimal places: ${v.interactTotalDp}`, why: "Now place the point..." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumA_str} \u00d7 ${v.interactNumB_str} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer, v.interactTotalDp),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumA_str} \u00d7 ${v.interactNumB_str} = ${v.interactAnswer_str}**. Count those decimal places! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactWholeA} \u00d7 ${v.interactWholeB} = ${v.interactWholeProduct}. With ${v.interactTotalDp} decimal places, that's **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiplying two decimals",
            body: () => `The method: **ignore, multiply, count, place**.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Remove all decimal points", why: "Turn 0.3 into 3 and 0.4 into 4" },
                  { text: "Step 2: Multiply as whole numbers", why: "3 \u00d7 4 = 12" },
                  { text: "Step 3: Count TOTAL decimal places from both numbers", why: "1 + 1 = 2 decimal places" },
                  { text: "Step 4: Place the point that many places from the right", why: "12 \u2192 0.12 \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "multiplying-decimal-by-decimal-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid placing the decimal point in the wrong position after multiplying",
          "Why counting decimal places in BOTH numbers matters"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "says 0.8 \u00d7 0.6 = 4.8 because 8 \u00d7 6 = 48 and he put 1 decimal place",
            calcStr: "0.8 \u00d7 0.6",
            wrongAnswer: "4.8", correctAnswer: "0.48", correctNum: 0.48,
            mistake: "only counted 1 decimal place instead of 2 (one from each number)",
            explanation: "0.8 has 1 decimal place and 0.6 has 1 decimal place = 2 decimal places total. 8 \u00d7 6 = 48. With 2 decimal places: 0.48, not 4.8.",
            // Interact-specific
            interactCalcStr: "0.7 \u00d7 0.4",
            interactCorrectAnswer: "0.28", interactCorrectNum: 0.28,
            interactExplanation: "7 \u00d7 4 = 28. Total decimal places = 2. So 0.28."
          },
          {
            name: "Ruby",
            scenario: "says 0.3 \u00d7 0.3 = 0.9 because 3 \u00d7 3 = 9",
            calcStr: "0.3 \u00d7 0.3",
            wrongAnswer: "0.9", correctAnswer: "0.09", correctNum: 0.09,
            mistake: "only put 1 decimal place instead of 2",
            explanation: "Both numbers have 1 decimal place each = 2 decimal places total. 3 \u00d7 3 = 9. With 2 decimal places: 0.09, not 0.9.",
            interactCalcStr: "0.4 \u00d7 0.4",
            interactCorrectAnswer: "0.16", interactCorrectNum: 0.16,
            interactExplanation: "4 \u00d7 4 = 16. Total decimal places = 2. So 0.16."
          },
          {
            name: "Oscar",
            scenario: "says 0.2 \u00d7 0.5 = 1.0 because 2 \u00d7 5 = 10 and he shifted the point",
            calcStr: "0.2 \u00d7 0.5",
            wrongAnswer: "1.0", correctAnswer: "0.10", correctNum: 0.10,
            mistake: "didn't count decimal places at all",
            explanation: "2 \u00d7 5 = 10. Total decimal places = 2. So put the point 2 places from the right: 0.10 (which is 0.1).",
            interactCalcStr: "0.3 \u00d7 0.6",
            interactCorrectAnswer: "0.18", interactCorrectNum: 0.18,
            interactExplanation: "3 \u00d7 6 = 18. Total decimal places = 2. So 0.18."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.calcStr} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} ${v.scenario}.\n\nBut that doesn't look right. Can you spot the mistake?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.name}: ${v.calcStr} = ${v.wrongAnswer}`, why: "Something's off..." }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count ALL the decimal places!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.calcStr} = ${v.wrongAnswer}`, why: v.mistake },
                  { text: `Right: ${v.calcStr} = ${v.correctAnswer}`, why: "Count decimal places from BOTH numbers! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `When multiplying two decimals, count the decimal places in BOTH numbers`, answer: true, explanation: "Correct — add up all the decimal places from both numbers. ✓" },
                { text: `0.3 × 0.2 = 0.6`, answer: false, explanation: "0.3 \u00d7 0.2 = 0.06 \u2014 that's 1 decimal place + 1 decimal place = 2 decimal places in the answer!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.interactCalcStr}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                points: [{ value: v.interactCorrectNum, label: "?", color: "#34d399" }],
                jumps: [], tickInterval: 0.1, showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactCalcStr} = ?`,
              getOptions: (v) => decimalDistractors(v.interactCorrectNum, 2),
              correctAnswer: (v) => v.interactCorrectNum,
              feedback: {
                correct: (v) => `Spot on! **${v.interactCalcStr} = ${v.interactCorrectAnswer}**. Those decimal places matter! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactExplanation} The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The decimal places rule",
            body: () => `When multiplying decimals, the answer has as many decimal places as **both numbers combined**.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.3 (1 decimal place) \u00d7 0.4 (1 decimal place) = 0.12 (2 decimal places)", why: "1 + 1 = 2 decimal places" },
                  { text: "0.8 (1 decimal place) \u00d7 0.6 (1 decimal place) = 0.48 (2 decimal places)", why: "Not 4.8!" },
                  { text: "Quick check: is the answer sensible?", why: "0.8 \u00d7 0.6 must be LESS than 0.8 and LESS than 0.6 \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 13: dividing-decimal-by-decimal
  // Dividing by a decimal (make divisor whole first)
  // Category: other
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "dividing-decimal-by-decimal",
    name: "Dividing by a Decimal",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "dividing-decimal-by-decimal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to divide by a decimal by making the divisor (the number you divide by) a whole number first",
          "Why 5.4 \u00f7 0.6 is the same as 54 \u00f7 6"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "cutting a 5.4-metre ribbon into 0.6-metre pieces",
            dividend: 5.4, dividend_str: "5.4",
            divisor: 0.6, divisor_str: "0.6",
            multiplier: 10,
            newDividend: 54, newDivisor: 6,
            answer: 9, answer_str: "9",
            unit: "", unitAfter: " pieces",
            // Interact-specific
            interactDividend_str: "4.2", interactDivisor_str: "0.7",
            interactMultiplier: 10, interactNewDividend: 42, interactNewDivisor: 7,
            interactAnswer: 6, interactAnswer_str: "6"
          },
          {
            name: "Ethan",
            scenario: "working out how many 0.25 kg bags he can fill from 2 kg of rice",
            dividend: 2, dividend_str: "2",
            divisor: 0.25, divisor_str: "0.25",
            multiplier: 100,
            newDividend: 200, newDivisor: 25,
            answer: 8, answer_str: "8",
            unit: "", unitAfter: " bags",
            interactDividend_str: "3", interactDivisor_str: "0.25",
            interactMultiplier: 100, interactNewDividend: 300, interactNewDivisor: 25,
            interactAnswer: 12, interactAnswer_str: "12"
          },
          {
            name: "Freya",
            scenario: "splitting \u00a34.50 into groups of \u00a30.50",
            dividend: 4.50, dividend_str: "4.50",
            divisor: 0.50, divisor_str: "0.50",
            multiplier: 10,
            newDividend: 45, newDivisor: 5,
            answer: 9, answer_str: "9",
            unit: "", unitAfter: " groups",
            interactDividend_str: "3.50", interactDivisor_str: "0.50",
            interactMultiplier: 10, interactNewDividend: 35, interactNewDivisor: 5,
            interactAnswer: 7, interactAnswer_str: "7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.dividend_str} \u00f7 ${v.divisor_str} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. That's **${v.dividend_str} \u00f7 ${v.divisor_str}**.\n\nDividing by a decimal looks hard, but there's a brilliant trick: make the divisor (the number you divide by) a **whole number** first!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.dividend_str} \u00f7 ${v.divisor_str} = ???`, why: "Let's make that divisor whole!" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Make the divisor whole!",
            body: (v) => `Multiply BOTH numbers by the same amount to make the divisor a whole number. This works because it creates **equivalent fractions** (fractions worth the same amount) — and doesn't change the answer! Tap to see:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `The divisor is ${v.divisor_str} \u2014 multiply both by ${v.multiplier} to make it whole`, why: `${v.divisor_str} \u00d7 ${v.multiplier} = ${v.newDivisor}` },
                  { text: `${v.dividend_str} \u00d7 ${v.multiplier} = ${v.newDividend}`, why: "Multiply the dividend (the number being divided) by the same amount" },
                  { text: `Now divide: ${v.newDividend} \u00f7 ${v.newDivisor} = ${v.answer}`, why: "Easy whole-number division!" },
                  { text: `${v.dividend_str} \u00f7 ${v.divisor_str} = ${v.answer_str}`, result: `${v.answer_str}${v.unitAfter} \u2713` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDividend_str} \u00f7 ${v.interactDivisor_str}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Multiply both by ${v.interactMultiplier}: ${v.interactNewDividend} \u00f7 ${v.interactNewDivisor}`, why: "Now it's whole-number division!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDividend_str} \u00f7 ${v.interactDivisor_str} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDividend_str} \u00f7 ${v.interactDivisor_str} = ${v.interactAnswer_str}**. Make the divisor whole first! \u2713`,
                incorrect: (v) => `Not quite! Multiply both by ${v.interactMultiplier}: ${v.interactNewDividend} \u00f7 ${v.interactNewDivisor} = **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Dividing by a decimal",
            body: () => `The trick: **multiply both numbers** by 10, 100, or 1000 to make the divisor a whole number.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Make the divisor whole by multiplying both numbers", why: "0.6 \u2192 6, so multiply both by 10" },
                  { text: "5.4 \u00f7 0.6 becomes 54 \u00f7 6 = 9", why: "Same answer, easier division!" },
                  { text: "This works because multiplying both by the same number doesn't change the answer", why: "It's like equivalent fractions (fractions worth the same) \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Curiosity Hook ----
      {
        id: "dividing-decimal-by-decimal-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply the multiply-both-by-10 trick to real division problems",
          "When to watch out for only multiplying one number instead of both"
        ],
        variableSets: [
          {
            name: "George",
            scenario: "A plank is 3.6 metres. He cuts it into 0.9 m pieces. How many pieces?",
            dividend: 3.6, dividend_str: "3.6",
            divisor: 0.9, divisor_str: "0.9",
            multiplier: 10, newDividend: 36, newDivisor: 9,
            answer: 4, answer_str: "4",
            // Interact-specific
            interactDividend_str: "4.8", interactDivisor_str: "0.6",
            interactMultiplier: 10, interactNewDividend: 48, interactNewDivisor: 6,
            interactAnswer: 8, interactAnswer_str: "8"
          },
          {
            name: "Hannah",
            scenario: "She has 1.8 kg of sweets to put into 0.3 kg bags. How many bags?",
            dividend: 1.8, dividend_str: "1.8",
            divisor: 0.3, divisor_str: "0.3",
            multiplier: 10, newDividend: 18, newDivisor: 3,
            answer: 6, answer_str: "6",
            interactDividend_str: "3.5", interactDivisor_str: "0.5",
            interactMultiplier: 10, interactNewDividend: 35, interactNewDivisor: 5,
            interactAnswer: 7, interactAnswer_str: "7"
          },
          {
            name: "Isaac",
            scenario: "\u00a37.50 is split into piles of \u00a31.50. How many piles?",
            dividend: 7.50, dividend_str: "7.50",
            divisor: 1.50, divisor_str: "1.50",
            multiplier: 10, newDividend: 75, newDivisor: 15,
            answer: 5, answer_str: "5",
            interactDividend_str: "5.60", interactDivisor_str: "0.80",
            interactMultiplier: 10, interactNewDividend: 56, interactNewDivisor: 8,
            interactAnswer: 7, interactAnswer_str: "7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Why does this trick work?",
            body: (v) => `${v.scenario}\n\nThat's **${v.dividend_str} \u00f7 ${v.divisor_str}**. Dividing by a decimal is confusing \u2014 but what if we could turn it into **whole-number division** instead?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.dividend_str} \u00f7 ${v.divisor_str} = the same as ${v.newDividend} \u00f7 ${v.newDivisor}`, why: "Multiply both by 10!" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "It's like equivalent fractions (fractions worth the same)!",
            body: (v) => `Think of **${v.dividend_str} ÷ ${v.divisor_str}** as a fraction: ${v.dividend_str}/${v.divisor_str}.\n\nMultiplying top and bottom by ${v.multiplier} gives ${v.newDividend}/${v.newDivisor} — the same fraction, but with whole numbers!\n\n${v.newDividend} ÷ ${v.newDivisor} = **${v.answer}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.dividend_str}/${v.divisor_str} = ${v.newDividend}/${v.newDivisor}`, why: "Multiply top and bottom by " + v.multiplier },
                  { text: `${v.newDividend} ÷ ${v.newDivisor} = ${v.answer}`, result: `${v.answer} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: `${v.dividend_str} ÷ ${v.divisor_str}`, right: `${v.newDividend} ÷ ${v.newDivisor}` },
                { left: "Make divisor (the number you divide by) whole", right: `× ${v.multiplier} both` },
                { left: "Equivalent fraction (a fraction with the same value)", right: "Same answer" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDividend_str} \u00f7 ${v.interactDivisor_str}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: parseFloat(v.interactDividend_str) + 2,
                points: [{ value: parseFloat(v.interactDividend_str), label: v.interactDividend_str, color: "#c084fc" }],
                jumps: [], tickInterval: 1, showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDividend_str} \u00f7 ${v.interactDivisor_str} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Superstar! **${v.interactDividend_str} \u00f7 ${v.interactDivisor_str} = ${v.interactAnswer_str}**. Make the divisor whole! \u2713`,
                incorrect: (v) => `Not quite! Multiply both by ${v.interactMultiplier}: ${v.interactNewDividend} \u00f7 ${v.interactNewDivisor} = **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The big idea",
            body: () => `Dividing by a decimal = multiplying both numbers until the divisor (the number you divide by) is whole. The answer stays the same!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Divisor has 1 decimal place? Multiply both by 10", why: "0.6 \u2192 6" },
                  { text: "Divisor has 2 decimal places? Multiply both by 100", why: "0.25 \u2192 25" },
                  { text: "Then do normal whole-number division", why: "Much easier! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 14: decimal-word-problems
  // Multi-step problems with money, measures, decimals
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "decimal-word-problems",
    name: "Decimal Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "decimal-word-problems-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot which operation to use in a decimals word problem",
          "How to check your answer is sensible"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "buys 3 books at \u00a34.99 each and pays with a \u00a320 note",
            operation: "multiply then subtract",
            step1: "3 \u00d7 \u00a34.99 = \u00a314.97",
            step2: "\u00a320.00 - \u00a314.97 = \u00a35.03",
            answer: 5.03, answer_str: "5.03",
            question: "How much change does she get?",
            unit: "\u00a3",
            check: "\u00a35.03 + \u00a314.97 = \u00a320.00 \u2713",
            // Interact-specific: different word problem
            interactScenario: "buys 4 sandwiches at \u00a32.75 each and pays with a \u00a320 note",
            interactQuestion: "How much change does she get?",
            interactAnswer: 9.00, interactAnswer_str: "9.00",
            interactUnit: "\u00a3",
            interactStep1: "4 \u00d7 \u00a32.75 = \u00a311.00",
            interactStep2: "\u00a320.00 - \u00a311.00 = \u00a39.00"
          },
          {
            name: "Ben",
            scenario: "runs 2.4 km on Monday, 3.15 km on Wednesday, and 1.8 km on Friday",
            operation: "add all three",
            step1: "2.4 + 3.15 + 1.8",
            step2: "= 2.40 + 3.15 + 1.80 = 7.35",
            answer: 7.35, answer_str: "7.35",
            question: "How far does he run in total?",
            unit: "",
            check: "7.35 km is sensible \u2014 roughly 2 + 3 + 2 = 7 km \u2713",
            interactScenario: "walks 1.75 km on Tuesday, 2.5 km on Thursday, and 0.8 km on Saturday",
            interactQuestion: "How far does he walk in total?",
            interactAnswer: 5.05, interactAnswer_str: "5.05",
            interactUnit: "",
            interactStep1: "1.75 + 2.50 + 0.80",
            interactStep2: "= 5.05 km"
          },
          {
            name: "Chloe",
            scenario: "has a 2-litre bottle and pours 0.35 litres into each glass",
            operation: "divide",
            step1: "2 \u00f7 0.35 = 20 \u00f7 3.5 = 200 \u00f7 35",
            step2: "200 \u00f7 35 = 5 remainder 25, so 5 full glasses",
            answer: 5, answer_str: "5",
            question: "How many full glasses can she pour?",
            unit: "",
            check: "5 \u00d7 0.35 = 1.75, which is less than 2 \u2714",
            interactScenario: "has a 3-litre bottle and pours 0.5 litres into each cup",
            interactQuestion: "How many full cups can she pour?",
            interactAnswer: 6, interactAnswer_str: "6",
            interactUnit: "",
            interactStep1: "3 \u00f7 0.5 = 30 \u00f7 5",
            interactStep2: "30 \u00f7 5 = 6 cups"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}'s problem`,
            body: (v) => `${v.name} ${v.scenario}.\n\n**${v.question}**\n\nThe first step is always: **which operation do I need?**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: v.question, why: "Read carefully \u2014 what's the key word?" }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break it into steps",
            body: (v) => `${v.name} ${v.scenario}. ${v.question} This is a **${v.operation}** problem — let's work through it step by step. Tap to see!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Identify the operation: ${v.operation}`, why: "Read the problem carefully" },
                  { text: `Step 1: ${v.step1}`, why: "Do the first calculation" },
                  { text: `Step 2: ${v.step2}`, why: "Finish the problem" },
                  { text: `Check: ${v.check}`, result: `Answer: ${v.unit}${v.answer_str} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Identify the operation: ${v.operation}`,
                v.step1,
                v.step2,
                `Check: ${v.check}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Identify, calculate, check. ✓`,
                incorrect: (v) => `Not quite — always start by identifying the operation, then work through the steps.`
              }
            }
          },
          {
            type: "interact",
            title: () => "What's the answer?",
            body: (v) => `${v.name} ${v.interactScenario}.\n\n**${v.interactQuestion}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.interactStep1, why: "First calculation" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactQuestion,
              getOptions: (v) => decimalDistractors(v.interactAnswer, v.interactAnswer === Math.floor(v.interactAnswer) ? 0 : 2),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Superstar! The answer is **${v.interactUnit}${v.interactAnswer_str}**. Great problem solving! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactStep1}. Then ${v.interactStep2}. The answer is **${v.interactUnit}${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tackling word problems",
            body: () => `Word problems are just maths in disguise. Follow these steps every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read carefully \u2014 what are you being asked to find?", why: "Underline the question" },
                  { text: "Step 2: Pick the operation \u2014 add, subtract, multiply or divide?", why: "Key words: 'total' = add, 'change' = subtract, 'each' = multiply/divide" },
                  { text: "Step 3: Line up decimal points for +/\u2212, count decimal places for \u00d7", why: "Use the right method for your operation" },
                  { text: "Step 4: Check \u2014 is your answer sensible?", why: "Estimate first, then check you're in the right ballpark \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "decimal-word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid picking the wrong operation in a decimals word problem",
          "When to watch out for answers that don't make sense in context"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "A shirt costs \u00a312.50 and trousers cost \u00a318.75. Tom was asked for the total but subtracted instead",
            wrongCalc: "\u00a318.75 - \u00a312.50 = \u00a36.25",
            wrongAnswer: "\u00a36.25",
            correctCalc: "\u00a312.50 + \u00a318.75 = \u00a331.25",
            correctAnswer: "\u00a331.25", correctNum: 31.25,
            mistake: "subtracted when the question asked for the TOTAL",
            explanation: "'Total' means ADD. \u00a312.50 + \u00a318.75 = \u00a331.25.",
            // Interact-specific
            interactScenario: "A hat costs \u00a37.50 and gloves cost \u00a39.25. What is the total?",
            interactCalc: "\u00a37.50 + \u00a39.25 = \u00a316.75",
            interactAnswer: "\u00a316.75", interactNum: 16.75
          },
          {
            name: "Ruby",
            scenario: "A bag of apples weighs 1.3 kg. Ruby needs 5 bags. She wrote 1.3 \u00d7 5 = 5.15 kg",
            wrongCalc: "1.3 \u00d7 5 = 5.15 kg",
            wrongAnswer: "5.15 kg",
            correctCalc: "1.3 \u00d7 5 = 6.5 kg",
            correctAnswer: "6.5 kg", correctNum: 6.5,
            mistake: "treated 1.3 as '1 and 3' separately \u2014 doing 1\u00d75=5 and 3\u00d75=15, writing 5.15 instead of multiplying properly",
            explanation: "1.3 \u00d7 5: think of 13 \u00d7 5 = 65, then put the decimal back \u2192 6.5 kg.",
            // Interact-specific
            interactScenario: "A bottle holds 1.5 litres. How much do 4 bottles hold in total?",
            interactCalc: "1.5 \u00d7 4 = 6.0 litres",
            interactAnswer: "6.0 litres", interactNum: 6
          },
          {
            name: "Oscar",
            scenario: "He has \u00a310 and buys 3 pens at \u00a31.85 each. He says he gets \u00a35.55 change but used the wrong operation",
            wrongCalc: "\u00a31.85 \u00d7 3 = \u00a35.55, then says that IS the change",
            wrongAnswer: "\u00a35.55",
            correctCalc: "\u00a31.85 \u00d7 3 = \u00a35.55. Change = \u00a310 - \u00a35.55 = \u00a34.45",
            correctAnswer: "\u00a34.45", correctNum: 4.45,
            mistake: "found the total cost but forgot to subtract from \u00a310 to find the change",
            explanation: "Change = amount paid - cost. \u00a310.00 - \u00a35.55 = \u00a34.45.",
            // Interact-specific
            interactScenario: "You have \u00a35 and buy 2 notebooks at \u00a31.35 each. What change do you get?",
            interactCalc: "\u00a31.35 \u00d7 2 = \u00a32.70. Change = \u00a35.00 - \u00a32.70 = \u00a32.30",
            interactAnswer: "\u00a32.30", interactNum: 2.30
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} get it right?`,
            body: (v) => `${v.scenario}.\n\n${v.name} says the answer is **${v.wrongAnswer}**. Is that correct?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: [{ text: `${v.name}'s working: ${v.wrongCalc}`, why: "Check this carefully..." }], allRevealed: true })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's check",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: v.wrongAnswer === v.correctAnswer ? "This is actually correct!" : "This is WRONG" },
                  { text: `Correct working: ${v.correctCalc}`, result: `Answer: ${v.correctAnswer} \u2713` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `${v.interactScenario}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [{ text: v.interactCalc, why: "Follow the correct steps" }],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "What is the correct answer?",
              getOptions: (v) => decimalDistractors(v.interactNum),
              correctAnswer: (v) => v.interactNum,
              feedback: {
                correct: (v) => `Well done! The answer is **${v.interactAnswer}**. Always read the question carefully! \u2713`,
                incorrect: (v) => `Not quite! ${v.interactCalc}. The answer is **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Top tips for word problems",
            body: () => `Most mistakes in word problems come from **choosing the wrong operation** or **stopping too early**. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the question TWICE before calculating", why: "What exactly are they asking for?" },
                  { text: "Key words: 'total' = add, 'difference/change' = subtract", why: "'Each/per' = multiply or divide" },
                  { text: "Multi-step: don't stop after the first calculation!", why: "Change problems need TWO steps: find total, THEN subtract" },
                  { text: "Always check: is my answer sensible?", why: "If change is MORE than what you paid, something's wrong! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 15: master-column-addition-decimals
  // Adding decimals using the column method — line up the decimal points
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "master-column-addition-decimals",
    name: "Column Addition with Decimals",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "master-column-addition-decimals-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to add decimals by lining up the decimal points",
          "Why you must pad with zeros when numbers have different decimal places"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "adding up the cost of two items at the school tuck shop",
            numA: 3.4, numA_str: "3.40", numA_raw: "3.4",
            numB: 0.56, numB_str: "0.56",
            answer: 3.96, answer_str: "3.96",
            unit: "\u00a3", unitAfter: "",
            padNote: "3.4 only has one decimal place, so write it as **3.40** to match 0.56",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [3, ".", 4, 0], digitsB: [0, ".", 5, 6], digitsAns: [3, ".", 9, 6],
            h_add: "0 + 6 = 6", t_add: "4 + 5 = 9", o_add: "3 + 0 = 3",
            carry: false,
            // Interact-specific addition
            interactNumA: 2.7, interactNumA_raw: "2.7", interactNumA_str: "2.70",
            interactNumB: 1.45, interactNumB_str: "1.45",
            interactAnswer: 4.15, interactAnswer_str: "4.15",
            interactH_add: "0 + 5 = 5", interactT_add: "7 + 4 = 11, write 1 carry 1", interactO_add: "2 + 1 + 1 = 4"
          },
          {
            name: "Ben",
            scenario: "adding together two jump distances for a sports day relay",
            numA: 4.85, numA_str: "4.85", numA_raw: "4.85",
            numB: 2.7, numB_str: "2.70", numB_raw: "2.7",
            answer: 7.55, answer_str: "7.55",
            unit: "", unitAfter: " metres",
            padNote: "2.7 only has one decimal place, so write it as **2.70** to match 4.85",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [4, ".", 8, 5], digitsB: [2, ".", 7, 0], digitsAns: [7, ".", 5, 5],
            h_add: "5 + 0 = 5", t_add: "8 + 7 = 15, write 5 carry 1", o_add: "4 + 2 + 1 = 7",
            carry: true,
            interactNumA: 5.6, interactNumA_raw: "5.6", interactNumA_str: "5.60",
            interactNumB: 3.85, interactNumB_str: "3.85",
            interactAnswer: 9.45, interactAnswer_str: "9.45",
            interactH_add: "0 + 5 = 5", interactT_add: "6 + 8 = 14, write 4 carry 1", interactO_add: "5 + 3 + 1 = 9"
          },
          {
            name: "Chloe",
            scenario: "weighing two parcels to work out the total for posting",
            numA: 1.36, numA_str: "1.36", numA_raw: "1.36",
            numB: 2.89, numB_str: "2.89",
            answer: 4.25, answer_str: "4.25",
            unit: "", unitAfter: " kg",
            padNote: "Both numbers already have two decimal places, so they're ready to line up",
            columns: ["Ones", ".", "10ths", "100ths"],
            digitsA: [1, ".", 3, 6], digitsB: [2, ".", 8, 9], digitsAns: [4, ".", 2, 5],
            h_add: "6 + 9 = 15, write 5 carry 1", t_add: "3 + 8 + 1 = 12, write 2 carry 1", o_add: "1 + 2 + 1 = 4",
            carry: true,
            interactNumA: 3.48, interactNumA_raw: "3.48", interactNumA_str: "3.48",
            interactNumB: 1.76, interactNumB_str: "1.76",
            interactAnswer: 5.24, interactAnswer_str: "5.24",
            interactH_add: "8 + 6 = 14, write 4 carry 1", interactT_add: "4 + 7 + 1 = 12, write 2 carry 1", interactO_add: "3 + 1 + 1 = 5"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.unit}${v.numA_raw || v.numA_str} + ${v.unit}${v.numB_raw || v.numB_str} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. The two amounts are **${v.unit}${v.numA_raw || v.numA_str}${v.unitAfter}** and **${v.unit}${v.numB_raw || v.numB_str}${v.unitAfter}**.\n\nAdding decimals is just like adding whole numbers — but there's one golden rule you must follow. Can you guess what it is?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: v.numA_str, values: v.digitsA },
                  { label: "+ " + v.numB_str, values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Line up the decimal points!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The golden rule: **line up the decimal points** so that tenths are under tenths and hundredths are under hundredths. ${v.padNote}. Tap to see each step!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: v.numA_str, values: v.digitsA },
                    { label: "+ " + v.numB_str, values: v.digitsB }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const steps = [
                    { text: "Line up the decimal points", why: "Pad with zeros so both numbers have the same number of decimal places" },
                    { text: `Hundredths: ${v.h_add}`, why: "Start from the rightmost column" },
                    { text: `Tenths: ${v.t_add}`, why: v.carry ? "If the column adds to 10 or more, carry 1 to the next column" : "Add the digits in this column" },
                    { text: `Ones: ${v.o_add}`, why: "Don't forget to add any carry digit!" },
                    { text: `Answer: ${v.unit}${v.answer_str}${v.unitAfter}`, result: `${v.unit}${v.numA_str} + ${v.unit}${v.numB_str} = ${v.unit}${v.answer_str}${v.unitAfter} \u2713` }
                  ];
                  return { steps };
                }
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumA_str} + ${v.interactNumB_str}**?\n\nRemember: line up the decimal points first!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: ["Ones", ".", "10ths", "100ths"],
                rows: [
                  { label: v.interactNumA_str, values: v.interactNumA_str.split("").map(c => c === "." ? "." : Number(c)) },
                  { label: "+ " + v.interactNumB_str, values: v.interactNumB_str.split("").map(c => c === "." ? "." : Number(c)) }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumA_str} + ${v.interactNumB_str}?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumA_str} + ${v.interactNumB_str} = ${v.interactAnswer_str}**. You lined up those decimal points perfectly! \u2713`,
                incorrect: (v) => `Not quite! Line up the points and add from the right: ${v.interactH_add}, ${v.interactT_add}, ${v.interactO_add}. The answer is **${v.interactAnswer_str}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The recipe for adding decimals",
            body: () => `Adding decimals is easy when you follow these steps every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Line up the decimal points", why: "Write one number above the other with the points directly in line" },
                  { text: "Step 2: Pad with zeros if needed", why: "e.g. 3.4 becomes 3.40 so it matches 0.56" },
                  { text: "Step 3: Add from the right", why: "Hundredths first, then tenths, then ones" },
                  { text: "Step 4: Carry if a column totals 10 or more", why: "Write the ones digit, carry the tens digit to the next column" },
                  { text: "Step 5: Bring the decimal point straight down", why: "The point in the answer lines up with the ones above \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "master-column-addition-decimals-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when decimal points aren't lined up in column addition",
          "Why lining up the right-hand digits instead of the decimal points gives the wrong answer"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "tried to add 3.4 + 0.56 and got 3.96",
            numA_raw: "3.4", numB_raw: "0.56",
            numA_str: "3.40", numB_str: "0.56",
            // Tom's mistake: lined up right-hand digits so treated it as 3.4 + 0.56 aligned wrong
            // Wrong working: 3.4_ + _0.56 -> right-aligned = 3.4 and 0.56 pushed right -> 34 + 056 = 090 -> 0.90
            // Actually the specific mistake: treating 3.4 + 0.56 as if both were right-aligned whole numbers
            // 3.4 right-aligned with 0.56 gives:   3 . 4
            //                                    +  0 . 5 6  <- but Tom wrote
            //                                       3 . 4
            //                                     + 0 . 5 6  <- with 4 above 6 instead of above 5
            wrongColumns: ["Ones", ".", "10ths", "100ths"],
            wrongDigitsA: [3, ".", " ", 4],
            wrongDigitsB: [0, ".", 5, 6],
            wrongAnswer: 0.90, wrongAnswer_str: "0.90",
            wrongDigitsAns: [0, ".", 9, 0],
            wrongExplanation: "lined up the 4 above the 6 instead of lining up the decimal points",
            correctAnswer: 3.96, correctAnswer_str: "3.96",
            correctColumns: ["Ones", ".", "10ths", "100ths"],
            correctDigitsA: [3, ".", 4, 0],
            correctDigitsB: [0, ".", 5, 6],
            correctDigitsAns: [3, ".", 9, 6],
            correctExplanation: "Write 3.4 as 3.40, then line up the points: 0 + 6 = 6 hundredths, 4 + 5 = 9 tenths, 3 + 0 = 3 ones. Answer: 3.96",
            // Interact
            interactNumA_raw: "5.3", interactNumB_raw: "2.68",
            interactNumA_str: "5.30", interactNumB_str: "2.68",
            interactAnswer: 7.98, interactAnswer_str: "7.98"
          },
          {
            name: "Ruby",
            scenario: "tried to add 12.5 + 3.75 and got 5.00",
            numA_raw: "12.5", numB_raw: "3.75",
            numA_str: "12.50", numB_str: "3.75",
            wrongColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            wrongDigitsA: [" ", 1, ".", 2, 5],
            wrongDigitsB: [" ", " ", ".", 3, 75],
            wrongAnswer: 5.00, wrongAnswer_str: "5.00",
            wrongDigitsAns: [" ", 5, ".", 0, 0],
            wrongExplanation: "lined up 12.5 as 1.25 by pushing digits right instead of lining up the decimal points",
            correctAnswer: 16.25, correctAnswer_str: "16.25",
            correctColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            correctDigitsA: [1, 2, ".", 5, 0],
            correctDigitsB: [0, 3, ".", 7, 5],
            correctDigitsAns: [1, 6, ".", 2, 5],
            correctExplanation: "Write 12.5 as 12.50, then line up the points: 0 + 5 = 5, 5 + 7 = 12 (write 2 carry 1), 2 + 3 + 1 = 6, 1 + 0 = 1. Answer: 16.25",
            interactNumA_raw: "8.2", interactNumB_raw: "4.63",
            interactNumA_str: "8.20", interactNumB_str: "4.63",
            interactAnswer: 12.83, interactAnswer_str: "12.83"
          },
          {
            name: "Oscar",
            scenario: "tried to add 7.6 + 14.38 and got 21.44",
            numA_raw: "7.6", numB_raw: "14.38",
            numA_str: "7.60", numB_str: "14.38",
            wrongColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            wrongDigitsA: [" ", 7, ".", " ", 6],
            wrongDigitsB: [1, 4, ".", 3, 8],
            wrongAnswer: 21.44, wrongAnswer_str: "21.44",
            wrongDigitsAns: [2, 1, ".", 4, 4],
            wrongExplanation: "put the 6 in the hundredths column instead of the tenths, then added 6 + 8 = 14 in the wrong column",
            correctAnswer: 21.98, correctAnswer_str: "21.98",
            correctColumns: ["Tens", "Ones", ".", "10ths", "100ths"],
            correctDigitsA: [0, 7, ".", 6, 0],
            correctDigitsB: [1, 4, ".", 3, 8],
            correctDigitsAns: [2, 1, ".", 9, 8],
            correctExplanation: "Write 7.6 as 7.60, then line up the points: 0 + 8 = 8, 6 + 3 = 9, 7 + 4 = 11 (write 1 carry 1), 0 + 1 + 1 = 2. Answer: 21.98",
            interactNumA_raw: "6.5", interactNumB_raw: "11.72",
            interactNumA_str: "6.50", interactNumB_str: "11.72",
            interactAnswer: 18.22, interactAnswer_str: "18.22"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nBut the answer is **wrong**! The most common mistake in decimal addition is something really sneaky. Can you see what went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.wrongColumns,
                rows: [
                  { label: v.numA_raw, values: v.wrongDigitsA },
                  { label: "+ " + v.numB_raw, values: v.wrongDigitsB },
                  { label: "Wrong!", values: v.wrongDigitsAns }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The decimal points weren't lined up!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongExplanation}. When you push digits to the right without lining up the decimal points, you're adding **tenths to hundredths** — that's like adding apples to oranges!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.wrongColumns,
                  rows: [
                    { label: v.numA_raw, values: v.wrongDigitsA },
                    { label: "+ " + v.numB_raw, values: v.wrongDigitsB },
                    { label: "Wrong!", values: v.wrongDigitsAns }
                  ],
                  highlight: []
                })
              },
              {
                type: 'text',
                content: () => `Here's the correct way — **line up the decimal points** and pad with zeros:`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.correctColumns,
                  rows: [
                    { label: v.numA_str, values: v.correctDigitsA },
                    { label: "+ " + v.numB_str, values: v.correctDigitsB },
                    { label: "Correct!", values: v.correctDigitsAns }
                  ],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.correctExplanation.split('. ').filter(s => s.trim()).map(s => ({
                    text: s.replace(/\.$/, '').trim(),
                    why: ""
                  })),
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "true-false",
              statements: () => [
                { text: "When adding decimals, you must line up the decimal points before adding", answer: true, explanation: "Always line up the points so tenths are under tenths and hundredths under hundredths. \u2713" },
                { text: "If one number has fewer decimal places, you should line up the last digits on the right", answer: false, explanation: "Never right-align the digits! Instead, pad with zeros so both numbers have the same number of decimal places, then line up the points." }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `What is **${v.interactNumA_raw} + ${v.interactNumB_raw}**?\n\nRemember to line up the decimal points first!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.correctColumns,
                rows: [
                  { label: v.interactNumA_str, values: v.interactNumA_str.split("").map(c => c === "." ? "." : c === " " ? " " : Number(c)) },
                  { label: "+ " + v.interactNumB_str, values: v.interactNumB_str.split("").map(c => c === "." ? "." : c === " " ? " " : Number(c)) }
                ],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumA_raw} + ${v.interactNumB_raw} = ?`,
              getOptions: (v) => decimalDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Well done! **${v.interactNumA_raw} + ${v.interactNumB_raw} = ${v.interactAnswer_str}**. You lined up the decimal points like a pro! \u2713`,
                incorrect: (v) => `Not quite! ${v.correctExplanation.split('. ')[0]}. The correct answer is **${v.interactAnswer_str}**. Always line up the decimal points first!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The number one rule: line up the points!",
            body: () => `The most common mistake in decimal addition is **not lining up the decimal points**. Here's how to avoid it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "ALWAYS line up the decimal points, not the last digits", why: "Tenths must be under tenths, hundredths under hundredths" },
                  { text: "If one number has fewer decimal places, pad with zeros", why: "e.g. 3.4 becomes 3.40 before adding to 0.56" },
                  { text: "Then add from the right, carrying as normal", why: "It's the same as whole-number addition once the points are lined up" },
                  { text: "Check: is your answer sensible?", why: "3.4 + 0.56 should be close to 4, not close to 1! \u2713" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  }

  // ==========================================
  // SUB-CONCEPT: Mixed Units Arithmetic
  // Category: core
  // Lesson: step-by-step
  // ==========================================
  {
    id: "multi-unit-arithmetic",
    name: "Mixed Units Arithmetic",
    category: "core",
    lessons: [
      {
        id: "multi-unit-arithmetic-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to add and subtract measurements when they are given in different units (like grams and kilograms, or millilitres and litres)",
          "Why you must always change everything into the SAME unit before you do the maths"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "weighing fruit for a smoothie",
            teachQ: "Daisy puts 250 g of strawberries and 0.5 kg of bananas in the blender. How much fruit altogether, in grams?",
            teachConvert: "Convert 0.5 kg to grams: 0.5 × 1000 = 500 g",
            teachCalc: "Add: 250 g + 500 g = 750 g",
            teachAnswer: "750 g",
            interactQ: "Daisy's jug holds 1.5 litres of orange squash. She pours out 300 ml. How much squash is left, in millilitres?",
            interactHint: "1 litre = 1000 ml — change the litres first!",
            interactOptions: ["1200 ml", "1.2 ml", "1800 ml", "1500 ml", "200 ml"],
            interactCorrectAnswer: "1200 ml",
            interactExplanation: "1.5 litres = 1500 ml (× 1000). Then 1500 − 300 = **1200 ml** left. ✓",
            interactFeedbackWrong: "First change 1.5 litres: 1.5 × 1000 = 1500 ml. Then subtract: 1500 − 300 = 1200 ml."
          },
          {
            name: "Oliver",
            scenario: "filling a paddling pool with a watering can",
            teachQ: "Oliver pours in 2.4 litres of water, then adds another 600 ml from a bottle. How much water is that altogether, in millilitres?",
            teachConvert: "Convert 2.4 litres to millilitres: 2.4 × 1000 = 2400 ml",
            teachCalc: "Add: 2400 ml + 600 ml = 3000 ml",
            teachAnswer: "3000 ml",
            interactQ: "Oliver's pet snake is 1.2 m long. It grows another 40 cm. How long is the snake now, in centimetres?",
            interactHint: "1 m = 100 cm — change the metres first!",
            interactOptions: ["160 cm", "1.6 cm", "52 cm", "124 cm", "240 cm"],
            interactCorrectAnswer: "160 cm",
            interactExplanation: "1.2 m = 120 cm (× 100). Then 120 + 40 = **160 cm**. ✓",
            interactFeedbackWrong: "Change 1.2 m first: 1.2 × 100 = 120 cm. Then add: 120 + 40 = 160 cm."
          },
          {
            name: "Priya",
            scenario: "building a guinea pig run in the garden",
            teachQ: "Priya's fence panel is 3.5 m long. She joins on a smaller panel that is 85 cm. How long is the whole fence now, in centimetres?",
            teachConvert: "Convert 3.5 m to centimetres: 3.5 × 100 = 350 cm",
            teachCalc: "Add: 350 cm + 85 cm = 435 cm",
            teachAnswer: "435 cm",
            interactQ: "Priya's shopping bag has 0.75 kg of apples and 380 g of pears in it. What is the total weight, in grams?",
            interactHint: "1 kg = 1000 g — change the kilograms first!",
            interactOptions: ["1130 g", "455 g", "1.13 g", "4550 g", "1075 g"],
            interactCorrectAnswer: "1130 g",
            interactExplanation: "0.75 kg = 750 g (× 1000). Then 750 + 380 = **1130 g**. ✓",
            interactFeedbackWrong: "Change 0.75 kg first: 0.75 × 1000 = 750 g. Then add: 750 + 380 = 1130 g."
          },
          {
            name: "Finn",
            scenario: "sharing out a bottle of homemade lemonade",
            teachQ: "Finn's bottle holds 1.25 litres of lemonade. He pours 450 ml into a flask for the picnic. How much lemonade is left in the bottle, in millilitres?",
            teachConvert: "Convert 1.25 litres to millilitres: 1.25 × 1000 = 1250 ml",
            teachCalc: "Subtract: 1250 ml − 450 ml = 800 ml",
            teachAnswer: "800 ml",
            interactQ: "Finn has a 2.4 kg bag of flour. He uses 750 g to bake bread. How much flour is left, in grams?",
            interactHint: "1 kg = 1000 g — change the kilograms first!",
            interactOptions: ["1650 g", "1.65 g", "3150 g", "1700 g", "165 g"],
            interactCorrectAnswer: "1650 g",
            interactExplanation: "2.4 kg = 2400 g (× 1000). Then 2400 − 750 = **1650 g** left. ✓",
            interactFeedbackWrong: "Change 2.4 kg first: 2.4 × 1000 = 2400 g. Then subtract: 2400 − 750 = 1650 g."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "One recipe, two different units!",
            body: () => `Imagine you're baking with a friend. The recipe says you need **350 g of flour** and **0.6 kg of sugar**. So... how much is that altogether?\n\nYou can't just add 350 and 0.6 — that would give a silly answer! Grams and kilograms are different sizes, like trying to add up apples and lorries.\n\nThe trick is to turn them into the **same unit first**. Once everything is in grams, the adding is easy: 350 g + 600 g = **950 g**. Sorted!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.6 kg → 0.6 × 1000 = 600 g", why: "Convert to grams first" },
                  { text: "350 g + 600 g = 950 g", why: "Now both are in grams — easy to add ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same unit first, then do the maths",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.teachQ}**\n\nRemember: to go from a **big unit** to a **small unit** (kg → g, m → cm, litres → ml), you **multiply**. The question tells you which unit to give the answer in — convert everything to that unit first.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Spot the units — one measurement needs converting", why: "The question asks for a specific unit, so everything else must match" },
                  { text: v.teachConvert, why: "Big unit → small unit = multiply" },
                  { text: `${v.teachCalc} → answer: ${v.teachAnswer}`, why: "Same units now, so the arithmetic is straightforward ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: () => [
                "Decide which unit the answer needs to be in",
                "Convert any measurements in a different unit",
                "Do the addition or subtraction",
                "Write the answer with the correct unit"
              ],
              feedback: {
                correct: () => "Perfect order! Convert first, then calculate — that's the golden rule for mixed units. ✓",
                incorrect: () => "Almost! Remember: you must convert everything into the **same unit** before you add or subtract."
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactQ}\n\n*(Hint: ${v.interactHint})*`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! ${v.interactFeedbackWrong} ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Your 3-step plan for ANY mixed-unit question",
            body: () => "It doesn't matter if it's grams, litres, or metres — the same three steps work every single time.",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Match the units — pick the unit the question asks for, convert everything else into it", why: "Big → small = multiply; small → big = divide" },
                  { text: "2. Do the maths — add for 'altogether/total', subtract for 'left/how much more'", why: "Now everything is in the same unit, so the arithmetic is simple" },
                  { text: "3. Check the unit — is your answer in the unit the question asked for?", why: "Ask yourself: does this size make sense? ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  }

];  // end of decimalsSubConcepts

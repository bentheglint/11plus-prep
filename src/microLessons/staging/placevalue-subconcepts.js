// Supplementary sub-concepts for Place Value & Rounding
// To merge: add these to lessonBank.placevalue.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const placevalueSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Reading & Writing Numbers
  // ==========================================
  {
    id: "reading-writing-numbers",
    name: "Reading & Writing Numbers in Words and Digits",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "reading-writing-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to read and write numbers up to a million in words",
          "Why we group digits in threes when writing large numbers"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "reads the population sign for a town in Dorset",
            number: 163500,
            numberFormatted: "163,500",
            words: "one hundred and sixty-three thousand, five hundred",
            wrongWords: "one hundred and sixty-three thousand and five hundred",
            mistakeType: "added an extra 'and' before five hundred",
            unit: "people",
            // Interact-specific (different number)
            interactNumber: 245200,
            interactNumberFormatted: "245,200",
            interactWords: "two hundred and forty-five thousand, two hundred",
            interactWrongWords1: "two hundred and forty-five thousand and two hundred",
            interactWrongWords2: "two hundred and forty-five hundred, two hundred",
            interactWrongWords3: "twenty-four thousand, five hundred and two hundred",
            interactWrongWords4: "two hundred forty-five thousand, two hundred"
          },
          {
            name: "Daisy",
            scenario: "reads the distance from Earth to the Moon in kilometres",
            number: 384400,
            numberFormatted: "384,400",
            words: "three hundred and eighty-four thousand, four hundred",
            wrongWords: "three hundred and eighty-four thousand and four hundred",
            mistakeType: "added an extra 'and' before four hundred",
            unit: "kilometres",
            // Interact-specific (different number)
            interactNumber: 527600,
            interactNumberFormatted: "527,600",
            interactWords: "five hundred and twenty-seven thousand, six hundred",
            interactWrongWords1: "five hundred and twenty-seven thousand and six hundred",
            interactWrongWords2: "fifty-two thousand, seven hundred and six hundred",
            interactWrongWords3: "five hundred and twenty-seven hundred, six hundred",
            interactWrongWords4: "five hundred twenty-seven thousand, six hundred"
          },
          {
            name: "Oscar",
            scenario: "reads how many fans a football stadium holds",
            number: 75024,
            numberFormatted: "75,024",
            words: "seventy-five thousand and twenty-four",
            wrongWords: "seventy-five thousand, two hundred and four",
            mistakeType: "read the 0 as a 2 and wrote two hundred instead of just twenty",
            unit: "seats",
            // Interact-specific (different number)
            interactNumber: 92031,
            interactNumberFormatted: "92,031",
            interactWords: "ninety-two thousand and thirty-one",
            interactWrongWords1: "ninety-two thousand, three hundred and one",
            interactWrongWords2: "nine thousand, two hundred and thirty-one",
            interactWrongWords3: "ninety-two thousand and three hundred and one",
            interactWrongWords4: "ninety-two thousand and thirty one"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How do you say ${v.numberFormatted}?`,
            body: (v) => `${v.name} ${v.scenario}. The number is **${v.numberFormatted}**. Can you say it out loud? Big numbers look scary, but there's a simple trick to reading them!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.number);
                const digits = str.split('').map(Number);
                const cols = digits.length === 6
                  ? ["HTh", "TTh", "Th", "H", "T", "O"]
                  : ["TTh", "Th", "H", "T", "O"];
                return {
                  columns: cols,
                  rows: [{ label: "Number", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split it into groups of three!",
            body: (v) => `Big numbers are easier to read when you **split them into groups of three** from the right.\n\nThe left group is the **thousands**. The right group is the **ones**.\n\n**${v.numberFormatted}** = **${v.words}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Split into groups from the right`, why: `${v.numberFormatted}` },
                  { text: `Read the thousands part`, why: `The digits before the comma` },
                  { text: `Say "thousand"`, why: `This tells you the place value` },
                  { text: `Read the ones part`, why: `The digits after the comma` },
                  { text: `Full reading:`, result: v.words }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Which one is correct?",
            body: (v) => `Which is the correct way to write **${v.interactNumberFormatted}** in words?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.interactNumber);
                const digits = str.split('').map(Number);
                const cols = digits.length === 6
                  ? ["HTh", "TTh", "Th", "H", "T", "O"]
                  : ["TTh", "Th", "H", "T", "O"];
                return {
                  columns: cols,
                  rows: [{ label: "Number", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How do you write ${v.interactNumberFormatted} in words?`,
              getOptions: (v) => [
                v.interactWords,
                v.interactWrongWords1,
                v.interactWrongWords2,
                v.interactWrongWords3,
                v.interactWrongWords4
              ],
              correctAnswer: (v) => v.interactWords,
              feedback: {
                correct: (v) => `Well done! **${v.interactNumberFormatted}** in words is: **${v.interactWords}** ✓`,
                incorrect: (v) => `Not quite! The correct way is: **${v.interactWords}**. Remember to split the number into groups of three from the right.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Reading big numbers — the recipe!",
            body: () => `Follow these steps for any large number:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Split into groups of three from the right", why: "Use commas to separate: thousands, millions, etc." },
                  { text: "Step 2: Read each group as a normal number", why: "e.g. 384 = three hundred and eighty-four" },
                  { text: "Step 3: Say the group name after each chunk", why: "thousand, million, billion..." },
                  { text: "Step 4: Combine them all together", why: "384,400 = three hundred and eighty-four thousand, four hundred ✓" }
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
        id: "reading-writing-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid common mistakes when writing numbers in words",
          "Why zeros matter as placeholders in large numbers"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "writes a number from a newspaper article",
            number: 205300,
            numberFormatted: "205,300",
            correctWords: "two hundred and five thousand, three hundred",
            wrongWords: "twenty-five thousand, three hundred",
            mistakeExplanation: "missed the zero and read 205 as 25",
            wrongNumber: 25300,
            wrongNumberFormatted: "25,300",
            // Interact-specific (different misread number)
            interactWrongWords: "thirty-six thousand, two hundred",
            interactWrongNumber: 36200,
            interactWrongNumberFormatted: "36,200",
            interactCorrectNumber: 306200,
            interactCorrectNumberFormatted: "306,200",
            interactCorrectWords: "three hundred and six thousand, two hundred"
          },
          {
            name: "Marcus",
            scenario: "copies a number from the whiteboard",
            number: 410060,
            numberFormatted: "410,060",
            correctWords: "four hundred and ten thousand and sixty",
            wrongWords: "four hundred and ten thousand, six hundred",
            mistakeExplanation: "read 060 as 600 — the zero is in the hundreds place, not the tens",
            wrongNumber: 410600,
            wrongNumberFormatted: "410,600",
            // Interact-specific (different misread number)
            interactWrongWords: "five hundred and twenty thousand, eight hundred",
            interactWrongNumber: 520800,
            interactWrongNumberFormatted: "520,800",
            interactCorrectNumber: 520080,
            interactCorrectNumberFormatted: "520,080",
            interactCorrectWords: "five hundred and twenty thousand and eighty"
          },
          {
            name: "Priya",
            scenario: "reads a number from a geography textbook",
            number: 300040,
            numberFormatted: "300,040",
            correctWords: "three hundred thousand and forty",
            wrongWords: "three hundred thousand, four hundred",
            mistakeExplanation: "read 040 as 400 — the zero is a placeholder in the hundreds column",
            wrongNumber: 300400,
            wrongNumberFormatted: "300,400",
            // Interact-specific (different misread number)
            interactWrongWords: "forty-seven thousand, one hundred",
            interactWrongNumber: 47100,
            interactWrongNumberFormatted: "47,100",
            interactCorrectNumber: 407100,
            interactCorrectNumberFormatted: "407,100",
            interactCorrectWords: "four hundred and seven thousand, one hundred"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}. The number is **${v.numberFormatted}**, but ${v.name} wrote it as: "${v.wrongWords}". Can you see what went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.number);
                const digits = str.split('').map(Number);
                return {
                  columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [{ label: "Number", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Zeros are placeholders!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe **zeros** hold the other digits in their correct columns. Without them, the digits slide into the wrong places!\n\nThe correct reading is: **${v.correctWords}**`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.number);
                const digits = str.split('').map(Number);
                const wrongStr = String(v.wrongNumber);
                const wrongDigits = wrongStr.split('').map(Number);
                while (wrongDigits.length < 6) wrongDigits.unshift(0);
                return {
                  columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [
                    { label: "Correct", values: digits },
                    { label: "Wrong", values: wrongDigits }
                  ],
                  highlight: []
                };
              }
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `In ${v.numberFormatted}, the zero means 'nothing in that column'`, answer: true, explanation: `Correct — zero is a placeholder that keeps digits in the right position. ✓` },
                { text: `You can remove zeros from a number without changing its value`, answer: false, explanation: `Removing a zero shifts all the other digits into the wrong columns — the value changes completely!` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What number did the words describe?",
            body: (v) => `Someone wrote "${v.interactWrongWords}". What number would that actually be in digits?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Someone wrote: "${v.interactWrongWords}"`, why: `But the real number has a zero they missed!` },
                  { text: `Hint: the actual number is ${v.interactCorrectNumberFormatted}`, why: v.interactCorrectWords }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactWrongWords}" would actually be which number?`,
              getOptions: (v) => generateDistractors(v.interactWrongNumber),
              correctAnswer: (v) => v.interactWrongNumber,
              feedback: {
                correct: (v) => `That's right! "${v.interactWrongWords}" = **${v.interactWrongNumberFormatted}**, but the actual number is **${v.interactCorrectNumberFormatted}**. Zeros matter! ✓`,
                incorrect: (v) => `Not quite! "${v.interactWrongWords}" = **${v.interactWrongNumberFormatted}**. The actual number should be **${v.interactCorrectNumberFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't skip the zeros!",
            body: () => `Zeros are **placeholders** — they keep every digit in the right column. When reading or writing numbers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Check every column in the place value chart", why: "Don't skip the zeros!" },
                  { text: "A zero means 'nothing in this place'", why: "e.g. 205 has zero tens — it's not 25!" },
                  { text: "Read each group of three carefully", why: "300,040 = three hundred thousand AND forty ✓" }
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
  // SUB-CONCEPT 2: Understanding Digit Value
  // ==========================================
  {
    id: "digit-value",
    name: "Understanding the Value of Each Digit",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "digit-value-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the value of any digit in a number",
          "Why the position of a digit changes its value"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "reads the attendance at a football match",
            number: 45678,
            numberFormatted: "45,678",
            digits: [4, 5, 6, 7, 8],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 5,
            targetPlace: "thousands",
            targetValue: 5000,
            confusionValue: 5,
            highlightTarget: [0, 1],
            unit: "people",
            // Interact-specific (different number, different target)
            interactNumber: 63842,
            interactNumberFormatted: "63,842",
            interactDigits: [6, 3, 8, 4, 2],
            interactTargetDigit: 8,
            interactTargetPlace: "hundreds",
            interactTargetValue: 800,
            interactConfusionValue: 8,
            interactHighlightTarget: [0, 2]
          },
          {
            name: "Ella",
            scenario: "checks the price of a second-hand car",
            number: 12349,
            numberFormatted: "12,349",
            digits: [1, 2, 3, 4, 9],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 3,
            targetPlace: "hundreds",
            targetValue: 300,
            confusionValue: 3,
            highlightTarget: [0, 2],
            unit: "pounds",
            // Interact-specific (different number, different target)
            interactNumber: 58216,
            interactNumberFormatted: "58,216",
            interactDigits: [5, 8, 2, 1, 6],
            interactTargetDigit: 8,
            interactTargetPlace: "thousands",
            interactTargetValue: 8000,
            interactConfusionValue: 8,
            interactHighlightTarget: [0, 1]
          },
          {
            name: "Isaac",
            scenario: "counts the total pages in all the books he's read this year",
            number: 87254,
            numberFormatted: "87,254",
            digits: [8, 7, 2, 5, 4],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 7,
            targetPlace: "thousands",
            targetValue: 7000,
            confusionValue: 7,
            highlightTarget: [0, 1],
            unit: "pages",
            // Interact-specific (different number, different target)
            interactNumber: 29461,
            interactNumberFormatted: "29,461",
            interactDigits: [2, 9, 4, 6, 1],
            interactTargetDigit: 4,
            interactTargetPlace: "hundreds",
            interactTargetValue: 400,
            interactConfusionValue: 4,
            interactHighlightTarget: [0, 2]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is the ${v.targetDigit} worth in ${v.numberFormatted}?`,
            body: (v) => `${v.name} ${v.scenario}. The total is **${v.numberFormatted}**. The digit **${v.targetDigit}** appears in this number — but what is it actually **worth**? Is it just ${v.confusionValue}? Or something much bigger?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.digits }],
                highlight: [v.highlightTarget]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The position tells you the value!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at where the digit **${v.targetDigit}** sits in the place value chart. It's in the **${v.targetPlace}** column.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: [v.highlightTarget]
                })
              },
              {
                type: 'text',
                content: (v) => `The digit is **${v.targetDigit}**, and it's in the **${v.targetPlace}** column.\n\nSo its value is **${v.targetDigit} × ${v.targetValue / v.targetDigit}** = **${v.targetValue.toLocaleString()}**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the digit: ${v.targetDigit}`, why: `It appears in the number ${v.numberFormatted}` },
                    { text: `Find its column: ${v.targetPlace}`, why: `This tells us the place value` },
                    { text: `Multiply: ${v.targetDigit} × ${(v.targetValue / v.targetDigit).toLocaleString()}`, result: `= ${v.targetValue.toLocaleString()}` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The **${v.targetDigit}** in **${v.numberFormatted}** is worth **${v.targetValue.toLocaleString()}** — not just ${v.confusionValue}! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To find the value of a digit, multiply it by its ____ value`,
              options: (v) => ["face", "place", "column", "number"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Multiply the digit by its place value. ✓`,
                incorrect: (v) => `Not quite — you multiply the digit by its **place** value to find what it's worth!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the number **${v.interactNumberFormatted}**, what is the value of the digit **${v.interactTargetDigit}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.interactDigits }],
                highlight: [v.interactHighlightTarget]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the value of the digit ${v.interactTargetDigit} in ${v.interactNumberFormatted}?`,
              getOptions: (v) => generateDistractors(v.interactTargetValue),
              correctAnswer: (v) => v.interactTargetValue,
              feedback: {
                correct: (v) => `Brilliant! The ${v.interactTargetDigit} is in the ${v.interactTargetPlace} column, so it's worth **${v.interactTargetValue.toLocaleString()}** ✓`,
                incorrect: (v) => `Not quite! The ${v.interactTargetDigit} is in the **${v.interactTargetPlace}** column. ${v.interactTargetDigit} × ${(v.interactTargetValue / v.interactTargetDigit).toLocaleString()} = **${v.interactTargetValue.toLocaleString()}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Digit vs value — know the difference!",
            body: () => `The **digit** is the number you see. The **value** depends on its **position** in the number:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the digit in the number", why: "Which digit are you looking at?" },
                  { text: "Step 2: Check which column it's in", why: "Ones, tens, hundreds, thousands, etc." },
                  { text: "Step 3: Multiply the digit by its place value", why: "e.g. 5 in the thousands column = 5 × 1,000 = 5,000 ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual Discovery ----
      {
        id: "digit-value-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand that the same digit has different values in different positions",
          "Why position matters more than the digit itself"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "notices that the digit 3 appears twice in a number",
            number: 33456,
            numberFormatted: "33,456",
            digits: [3, 3, 4, 5, 6],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            digitA: 3,
            positionA: "ten-thousands",
            valueA: 30000,
            highlightA: [0, 0],
            digitB: 3,
            positionB: "thousands",
            valueB: 3000,
            highlightB: [0, 1],
            ratio: 10,
            // Interact-specific (different repeated digit)
            interactNumber: 66821,
            interactNumberFormatted: "66,821",
            interactDigits: [6, 6, 8, 2, 1],
            interactDigitA: 6,
            interactPositionA: "ten-thousands",
            interactValueA: 60000,
            interactHighlightA: [0, 0],
            interactDigitB: 6,
            interactPositionB: "thousands",
            interactValueB: 6000,
            interactHighlightB: [0, 1],
            interactRatio: 10
          },
          {
            name: "Finn",
            scenario: "spots that the digit 5 appears in two places in his house number and postcode area",
            number: 52500,
            numberFormatted: "52,500",
            digits: [5, 2, 5, 0, 0],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            digitA: 5,
            positionA: "ten-thousands",
            valueA: 50000,
            highlightA: [0, 0],
            digitB: 5,
            positionB: "hundreds",
            valueB: 500,
            highlightB: [0, 2],
            ratio: 100,
            // Interact-specific (different repeated digit)
            interactNumber: 41400,
            interactNumberFormatted: "41,400",
            interactDigits: [4, 1, 4, 0, 0],
            interactDigitA: 4,
            interactPositionA: "ten-thousands",
            interactValueA: 40000,
            interactHighlightA: [0, 0],
            interactDigitB: 4,
            interactPositionB: "hundreds",
            interactValueB: 400,
            interactHighlightB: [0, 2],
            interactRatio: 100
          },
          {
            name: "Lily",
            scenario: "sees that the digit 7 appears twice in a distance",
            number: 17472,
            numberFormatted: "17,472",
            digits: [1, 7, 4, 7, 2],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            digitA: 7,
            positionA: "thousands",
            valueA: 7000,
            highlightA: [0, 1],
            digitB: 7,
            positionB: "tens",
            valueB: 70,
            highlightB: [0, 3],
            ratio: 100,
            // Interact-specific (different repeated digit)
            interactNumber: 28382,
            interactNumberFormatted: "28,382",
            interactDigits: [2, 8, 3, 8, 2],
            interactDigitA: 8,
            interactPositionA: "thousands",
            interactValueA: 8000,
            interactHighlightA: [0, 1],
            interactDigitB: 8,
            interactPositionB: "tens",
            interactValueB: 80,
            interactHighlightB: [0, 3],
            interactRatio: 100
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Same digit, different value?`,
            body: (v) => `${v.name} ${v.scenario}. Look at **${v.numberFormatted}** — the digit **${v.digitA}** appears more than once! But are both ${v.digitA}s worth the same amount?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.digits }],
                highlight: [v.highlightA, v.highlightB]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Position is everything!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The first **${v.digitA}** is in the **${v.positionA}** column. Its value is **${v.valueA.toLocaleString()}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: [v.highlightA]
                })
              },
              {
                type: 'text',
                content: (v) => `The second **${v.digitB}** is in the **${v.positionB}** column. Its value is only **${v.valueB.toLocaleString()}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: [v.highlightB]
                })
              },
              {
                type: 'text',
                content: (v) => `Same digit, but the first one is worth **${v.ratio} times more** because it's ${v.ratio === 10 ? 'one' : v.ratio === 100 ? 'two' : 'three'} place${v.ratio > 10 ? 's' : ''} to the left! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The digit ${v.digitA} always has the same value wherever it appears`, answer: false, explanation: `The value depends on the position — ${v.digitA} in the ${v.positionA} column is worth ${v.valueA.toLocaleString()}, but in ${v.positionB} it's only ${v.valueB.toLocaleString()}!` },
                { text: `Each column to the left is 10 times bigger`, answer: true, explanation: `Correct — ones × 10 = tens, tens × 10 = hundreds, and so on. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "How much more is it worth?",
            body: (v) => `In **${v.interactNumberFormatted}**, the **${v.interactDigitA}** in the **${v.interactPositionA}** column is worth how many times more than the **${v.interactDigitB}** in the **${v.interactPositionB}** column?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.interactDigits }],
                highlight: [v.interactHighlightA, v.interactHighlightB]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many times more is the ${v.interactPositionA} ${v.interactDigitA} worth compared to the ${v.interactPositionB} ${v.interactDigitB}?`,
              getOptions: (v) => generateDistractors(v.interactRatio),
              correctAnswer: (v) => v.interactRatio,
              feedback: {
                correct: (v) => `Spot on! **${v.interactValueA.toLocaleString()} ÷ ${v.interactValueB.toLocaleString()} = ${v.interactRatio}**. Each column to the left is 10× bigger! ✓`,
                incorrect: (v) => `Not quite! **${v.interactValueA.toLocaleString()} ÷ ${v.interactValueB.toLocaleString()} = ${v.interactRatio}**. Each place to the left is 10 times bigger.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Position changes everything!",
            body: () => `The same digit can be worth completely different amounts depending on where it sits:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Each column is 10× bigger than the one to its right", why: "O → T → H → Th → TTh: ×10 each time" },
                  { text: "The digit tells you HOW MANY of that place value", why: "e.g. 5 in hundreds = 5 hundreds = 500" },
                  { text: "Same digit, different column = different value!", why: "5 in thousands = 5,000 but 5 in tens = 50 ✓" }
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
  // SUB-CONCEPT 3: Comparing & Ordering Numbers
  // ==========================================
  {
    id: "comparing-ordering",
    name: "Comparing & Ordering Multi-Digit Numbers",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "comparing-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to compare two numbers by checking digits from left to right",
          "Why we start with the highest place value column"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "compares the populations of two towns",
            numberA: 34567,
            numberB: 34589,
            numberAFormatted: "34,567",
            numberBFormatted: "34,589",
            digitsA: [3, 4, 5, 6, 7],
            digitsB: [3, 4, 5, 8, 9],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            firstDiffCol: 3,
            firstDiffPlace: "tens",
            digitADiff: 6,
            digitBDiff: 8,
            result: "<",
            bigger: "34,589",
            unit: "people",
            // Interact-specific (different pair of numbers)
            interactNumberA: 57312,
            interactNumberB: 57348,
            interactNumberAFormatted: "57,312",
            interactNumberBFormatted: "57,348",
            interactDigitsA: [5, 7, 3, 1, 2],
            interactDigitsB: [5, 7, 3, 4, 8],
            interactFirstDiffCol: 3,
            interactFirstDiffPlace: "tens",
            interactDigitADiff: 1,
            interactDigitBDiff: 4,
            interactResult: "<"
          },
          {
            name: "Jake",
            scenario: "compares distances of two running routes",
            numberA: 15230,
            numberB: 14980,
            numberAFormatted: "15,230",
            numberBFormatted: "14,980",
            digitsA: [1, 5, 2, 3, 0],
            digitsB: [1, 4, 9, 8, 0],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            firstDiffCol: 1,
            firstDiffPlace: "thousands",
            digitADiff: 5,
            digitBDiff: 4,
            result: ">",
            bigger: "15,230",
            unit: "metres",
            // Interact-specific (different pair of numbers)
            interactNumberA: 28640,
            interactNumberB: 29150,
            interactNumberAFormatted: "28,640",
            interactNumberBFormatted: "29,150",
            interactDigitsA: [2, 8, 6, 4, 0],
            interactDigitsB: [2, 9, 1, 5, 0],
            interactFirstDiffCol: 1,
            interactFirstDiffPlace: "thousands",
            interactDigitADiff: 8,
            interactDigitBDiff: 9,
            interactResult: "<"
          },
          {
            name: "Nadia",
            scenario: "compares how many visitors two museums had last year",
            numberA: 82456,
            numberB: 82471,
            numberAFormatted: "82,456",
            numberBFormatted: "82,471",
            digitsA: [8, 2, 4, 5, 6],
            digitsB: [8, 2, 4, 7, 1],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            firstDiffCol: 3,
            firstDiffPlace: "tens",
            digitADiff: 5,
            digitBDiff: 7,
            result: "<",
            bigger: "82,471",
            unit: "visitors",
            // Interact-specific (different pair of numbers)
            interactNumberA: 41683,
            interactNumberB: 41659,
            interactNumberAFormatted: "41,683",
            interactNumberBFormatted: "41,659",
            interactDigitsA: [4, 1, 6, 8, 3],
            interactDigitsB: [4, 1, 6, 5, 9],
            interactFirstDiffCol: 3,
            interactFirstDiffPlace: "tens",
            interactDigitADiff: 8,
            interactDigitBDiff: 5,
            interactResult: ">"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which is bigger: ${v.numberAFormatted} or ${v.numberBFormatted}?`,
            body: (v) => `${v.name} ${v.scenario}. One had **${v.numberAFormatted}** ${v.unit} and the other had **${v.numberBFormatted}**. Which number is larger? There's a step-by-step method!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: "A", values: v.digitsA },
                  { label: "B", values: v.digitsB }
                ],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Compare from left to right!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Before you compare, meet the **comparison symbols** (the signs that show which number is bigger). Here's the trick: picture the symbol as a **crocodile's mouth**. The crocodile is greedy — its open mouth always points at the **bigger** number!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "< means less than — the open mouth points RIGHT, so the first number is the smaller one", why: "34 < 51: the mouth opens towards 51 because 51 is bigger" },
                    { text: "> means greater than — the open mouth points LEFT, so the first number is the bigger one", why: "85 > 62: the mouth opens towards 85 because 85 is bigger" },
                    { text: "= means equal to — two level lines, perfectly balanced", why: "470 = 470: both numbers are worth exactly the same, so the crocodile can't choose!" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Line the numbers up in a place value chart. Then compare **column by column**, starting from the **left** (the biggest place).`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: "A", values: v.digitsA },
                    { label: "B", values: v.digitsB }
                  ],
                  highlight: [[0, v.firstDiffCol], [1, v.firstDiffCol]]
                })
              },
              {
                type: 'text',
                content: (v) => {
                  const sameColsText = v.firstDiffCol > 0
                    ? `The first ${v.firstDiffCol} column${v.firstDiffCol > 1 ? 's are' : ' is'} the same. `
                    : '';
                  return `${sameColsText}The first difference is in the **${v.firstDiffPlace}** column: **${v.digitADiff}** vs **${v.digitBDiff}**.\n\nSince **${v.digitADiff} ${v.result === '<' ? '<' : '>'} ${v.digitBDiff}**, we know that **${v.bigger}** is the bigger number.`;
                }
              },
              {
                type: 'text',
                content: (v) => `**${v.numberAFormatted} ${v.result} ${v.numberBFormatted}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When comparing numbers, start from the ____ and work right`,
              options: (v) => ["right", "middle", "left", "bottom"],
              correctIndex: (v) => 2,
              feedback: {
                correct: (v) => `Yes! Always compare from the left — the highest place value decides first. ✓`,
                incorrect: (v) => `Not quite — start from the **left** (the biggest place value column) and work right!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which symbol goes between these two numbers?\n\n**${v.interactNumberAFormatted}  ☐  ${v.interactNumberBFormatted}**`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [
                  { label: "A", values: v.interactDigitsA },
                  { label: "B", values: v.interactDigitsB }
                ],
                highlight: [[0, v.interactFirstDiffCol], [1, v.interactFirstDiffCol]]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumberAFormatted}  ☐  ${v.interactNumberBFormatted} — which symbol fits?`,
              // Only the three taught symbols — ≤/≥ are not KS2 and were never taught
              getOptions: (v) => ["<", ">", "="],
              correctAnswer: (v) => v.interactResult,
              feedback: {
                correct: (v) => `That's right! **${v.interactNumberAFormatted} ${v.interactResult} ${v.interactNumberBFormatted}**. The ${v.interactFirstDiffPlace} digit decided it: ${v.interactDigitADiff} vs ${v.interactDigitBDiff} ✓`,
                incorrect: (v) => `Not quite! Look at the **${v.interactFirstDiffPlace}** column: ${v.interactDigitADiff} vs ${v.interactDigitBDiff}. So **${v.interactNumberAFormatted} ${v.interactResult} ${v.interactNumberBFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comparing numbers — the recipe!",
            body: () => `To compare any two numbers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Check they have the same number of digits", why: "More digits = bigger number (unless leading zeros)" },
                  { text: "Step 2: Compare from the LEFT", why: "Start with the highest place value" },
                  { text: "Step 3: Find the first column that's different", why: "That column decides which is bigger" },
                  { text: "Step 4: The bigger digit wins!", why: "Once you find a difference, you can stop ✓" }
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
        id: "comparing-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid comparing numbers from the wrong end",
          "Why starting from the right gives wrong answers"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "tries to put these two numbers in order",
            numberA: 45892,
            numberB: 45867,
            numberAFormatted: "45,892",
            numberBFormatted: "45,867",
            wrongAnswer: "45,892 < 45,867",
            correctAnswer: "45,892 > 45,867",
            mistakeExplanation: "compared from the RIGHT — saw 2 < 7 in the ones column. But we should compare from the LEFT!",
            firstDiffPlace: "hundreds",
            digitADiff: 8,
            digitBDiff: 8,
            actualDiffPlace: "tens",
            actualDigitA: 9,
            actualDigitB: 6,
            // Interact-specific (different pair)
            interactNumberA: 73214,
            interactNumberB: 73248,
            interactNumberAFormatted: "73,214",
            interactNumberBFormatted: "73,248",
            interactCorrectAnswer: "73,214 < 73,248",
            interactWrongAnswer: "73,214 > 73,248",
            interactActualDiffPlace: "tens",
            interactActualDigitA: 1,
            interactActualDigitB: 4
          },
          {
            name: "Holly",
            scenario: "says one number is bigger than the other",
            numberA: 67321,
            numberB: 67345,
            numberAFormatted: "67,321",
            numberBFormatted: "67,345",
            wrongAnswer: "67,321 > 67,345",
            correctAnswer: "67,321 < 67,345",
            mistakeExplanation: "compared from the RIGHT — saw 1 < 5 in the ones but then got confused. The tens column decides it: 2 < 4",
            firstDiffPlace: "tens",
            digitADiff: 2,
            digitBDiff: 4,
            actualDiffPlace: "tens",
            actualDigitA: 2,
            actualDigitB: 4,
            // Interact-specific (different pair)
            interactNumberA: 52871,
            interactNumberB: 52836,
            interactNumberAFormatted: "52,871",
            interactNumberBFormatted: "52,836",
            interactCorrectAnswer: "52,871 > 52,836",
            interactWrongAnswer: "52,871 < 52,836",
            interactActualDiffPlace: "tens",
            interactActualDigitA: 7,
            interactActualDigitB: 3
          },
          {
            name: "Marcus",
            scenario: "compares two scores from a maths quiz",
            numberA: 19876,
            numberB: 19854,
            numberAFormatted: "19,876",
            numberBFormatted: "19,854",
            wrongAnswer: "19,876 < 19,854",
            correctAnswer: "19,876 > 19,854",
            mistakeExplanation: "looked only at the last digit (6 < 4 is wrong!) and got confused. The tens column shows 7 > 5",
            firstDiffPlace: "tens",
            digitADiff: 7,
            digitBDiff: 5,
            actualDiffPlace: "tens",
            actualDigitA: 7,
            actualDigitB: 5,
            // Interact-specific (different pair)
            interactNumberA: 86423,
            interactNumberB: 86491,
            interactNumberAFormatted: "86,423",
            interactNumberBFormatted: "86,491",
            interactCorrectAnswer: "86,423 < 86,491",
            interactWrongAnswer: "86,423 > 86,491",
            interactActualDiffPlace: "tens",
            interactActualDigitA: 2,
            interactActualDigitB: 9
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} says: **${v.wrongAnswer}**\n\nThat doesn't look right! Can you see where ${v.name} went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const digitsA = String(v.numberA).split('').map(Number);
                const digitsB = String(v.numberB).split('').map(Number);
                return {
                  columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [
                    { label: "A", values: digitsA },
                    { label: "B", values: digitsB }
                  ],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Always compare from the LEFT!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistakeExplanation}\n\nThe correct approach: start from the **left** (the biggest column) and find the first difference.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => {
                  const digitsA = String(v.numberA).split('').map(Number);
                  const digitsB = String(v.numberB).split('').map(Number);
                  const diffCol = digitsA.findIndex((d, i) => d !== digitsB[i]);
                  return {
                    columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
                    rows: [
                      { label: "A", values: digitsA },
                      { label: "B", values: digitsB }
                    ],
                    highlight: diffCol >= 0 ? [[0, diffCol], [1, diffCol]] : []
                  };
                }
              },
              {
                type: 'text',
                content: (v) => `The **${v.actualDiffPlace}** column shows **${v.actualDigitA}** vs **${v.actualDigitB}**, so: **${v.correctAnswer}**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Compare from the LEFT`, why: `Start with the highest place value` },
                    { text: `First difference: ${v.actualDiffPlace} column`, why: `${v.actualDigitA} vs ${v.actualDigitB}` },
                    { text: `${v.actualDigitA} ${v.actualDigitA > v.actualDigitB ? '>' : '<'} ${v.actualDigitB}`, result: v.correctAnswer }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Which is correct?",
            body: (v) => `What is the correct comparison?\n\n**${v.interactNumberAFormatted}  ☐  ${v.interactNumberBFormatted}**`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const digitsA = String(v.interactNumberA).split('').map(Number);
                const digitsB = String(v.interactNumberB).split('').map(Number);
                const diffCol = digitsA.findIndex((d, i) => d !== digitsB[i]);
                return {
                  columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [
                    { label: "A", values: digitsA },
                    { label: "B", values: digitsB }
                  ],
                  highlight: diffCol >= 0 ? [[0, diffCol], [1, diffCol]] : []
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is correct?`,
              getOptions: (v) => [
                v.interactCorrectAnswer,
                v.interactWrongAnswer,
                `${v.interactNumberAFormatted} = ${v.interactNumberBFormatted}`,
                `Cannot tell`,
                `They are approximately equal`
              ],
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! **${v.interactCorrectAnswer}** — always compare from the left! ✓`,
                incorrect: (v) => `Not quite! The ${v.interactActualDiffPlace} column shows ${v.interactActualDigitA} vs ${v.interactActualDigitB}. So **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Left to right — every time!",
            body: () => `The biggest mistake in comparing numbers is looking at the **wrong end**. Here's the recipe:`,
            bodyParts: [
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [
                    { label: "A", values: [4, 5, 8, 9, 2] },
                    { label: "B", values: [4, 5, 8, 6, 7] }
                  ],
                  highlight: [[0, 3], [1, 3]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Line up the digits by place value", why: "Use a place value chart if it helps" },
                    { text: "Step 2: Compare from the LEFT (biggest column first)", why: "Never start from the right!" },
                    { text: "Step 3: Find the first column where the digits are different", why: "That column decides which number is bigger" },
                    { text: "Example: 45,892 vs 45,867 — tens column: 9 > 6", why: "So 45,892 > 45,867 ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: Rounding to Nearest 1000, 10000, 100000
  // ==========================================
  {
    id: "rounding-nearest-1000-plus",
    name: "Rounding to Nearest 1000, 10000, 100000",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "rounding-1000-plus-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to round to the nearest 1000, 10000 or 100000",
          "How to find the decider digit for larger place values"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "estimates the number of visitors to a theme park",
            number: 156732,
            numberFormatted: "156,732",
            roundTo: 10000,
            roundToWord: "nearest ten thousand",
            digits: [1, 5, 6, 7, 3, 2],
            columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 5,
            targetPlace: "ten-thousands",
            deciderDigit: 6,
            deciderPlace: "thousands",
            rounded: 160000,
            roundedFormatted: "160,000",
            roundDown: 150000,
            roundUp: 160000,
            direction: "up",
            highlightTarget: [0, 1],
            highlightDecider: [0, 2],
            // Interact-specific (different number, same rounding level)
            interactNumber: 283415,
            interactNumberFormatted: "283,415",
            interactDigits: [2, 8, 3, 4, 1, 5],
            interactTargetDigit: 8,
            interactDeciderDigit: 3,
            interactRounded: 280000,
            interactRoundedFormatted: "280,000",
            interactDirection: "down",
            interactHighlightTarget: [0, 1],
            interactHighlightDecider: [0, 2]
          },
          {
            name: "Ben",
            scenario: "rounds the population of a city for a geography report",
            number: 534200,
            numberFormatted: "534,200",
            roundTo: 100000,
            roundToWord: "nearest hundred thousand",
            digits: [5, 3, 4, 2, 0, 0],
            columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 5,
            targetPlace: "hundred-thousands",
            deciderDigit: 3,
            deciderPlace: "ten-thousands",
            rounded: 500000,
            roundedFormatted: "500,000",
            roundDown: 500000,
            roundUp: 600000,
            direction: "down",
            highlightTarget: [0, 0],
            highlightDecider: [0, 1],
            // Interact-specific (different number, same rounding level)
            interactNumber: 761300,
            interactNumberFormatted: "761,300",
            interactDigits: [7, 6, 1, 3, 0, 0],
            interactTargetDigit: 7,
            interactDeciderDigit: 6,
            interactRounded: 800000,
            interactRoundedFormatted: "800,000",
            interactDirection: "up",
            interactHighlightTarget: [0, 0],
            interactHighlightDecider: [0, 1]
          },
          {
            name: "Grace",
            scenario: "rounds the distance of a long charity walk in metres",
            number: 247500,
            numberFormatted: "247,500",
            roundTo: 1000,
            roundToWord: "nearest thousand",
            digits: [2, 4, 7, 5, 0, 0],
            columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
            targetDigit: 7,
            targetPlace: "thousands",
            deciderDigit: 5,
            deciderPlace: "hundreds",
            rounded: 248000,
            roundedFormatted: "248,000",
            roundDown: 247000,
            roundUp: 248000,
            direction: "up",
            highlightTarget: [0, 2],
            highlightDecider: [0, 3],
            // Interact-specific (different number, same rounding level)
            interactNumber: 193200,
            interactNumberFormatted: "193,200",
            interactDigits: [1, 9, 3, 2, 0, 0],
            interactTargetDigit: 3,
            interactDeciderDigit: 2,
            interactRounded: 193000,
            interactRoundedFormatted: "193,000",
            interactDirection: "down",
            interactHighlightTarget: [0, 2],
            interactHighlightDecider: [0, 3]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Round ${v.numberFormatted} to the ${v.roundToWord}`,
            body: (v) => `${v.name} ${v.scenario}. The exact number is **${v.numberFormatted}**, but it needs rounding to the **${v.roundToWord}**. The method is the same as rounding to the nearest 10 or 100 — just with bigger numbers!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.digits }],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the target and decider!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `We're rounding to the **${v.roundToWord}**. The **target digit** is the ${v.targetPlace} digit: **${v.targetDigit}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: [v.highlightTarget]
                })
              },
              {
                type: 'text',
                content: (v) => `The **decider** is one place to the right — the ${v.deciderPlace} digit: **${v.deciderDigit}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: [v.highlightTarget, v.highlightDecider]
                })
              },
              {
                type: 'text',
                content: (v) => v.deciderDigit < 5
                  ? `**${v.deciderDigit}** is less than 5 → round **down**. The target stays as **${v.targetDigit}**. Everything to the right becomes **0**.`
                  : `**${v.deciderDigit}** is 5 or more → round **up**. The target goes up by 1. Everything to the right becomes **0**.`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: (v) => ({
                  min: v.roundDown,
                  max: v.roundUp,
                  points: [{ value: v.number, label: v.numberFormatted, color: "#7C3AED" }],
                  jumps: [{ from: v.number, to: v.rounded, label: v.direction === "up" ? "rounds up" : "rounds down" }],
                  tickInterval: v.roundTo,
                  showLabels: true,
                  highlight: [v.roundDown, v.roundUp]
                })
              },
              {
                type: 'text',
                content: (v) => `**${v.numberFormatted}** rounded to the ${v.roundToWord} = **${v.roundedFormatted}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the target digit (the ${v.targetPlace} column)`,
                `Look at the decider (one place to the right)`,
                `Apply the rule: 0-4 round down, 5-9 round up`
              ],
              feedback: {
                correct: (v) => `Perfect order! Target → decider → apply the rule. ✓`,
                incorrect: (v) => `Not quite — first find the target digit, then check the decider, then apply the rounding rule.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumberFormatted}** rounded to the **${v.roundToWord}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.interactDigits }],
                highlight: [v.interactHighlightTarget, v.interactHighlightDecider]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumberFormatted} rounded to the ${v.roundToWord}?`,
              getOptions: (v) => generateDistractors(v.interactRounded).map(n => n.toLocaleString()),
              correctAnswer: (v) => v.interactRounded.toLocaleString(),
              feedback: {
                correct: (v) => `Brilliant! The decider is **${v.interactDeciderDigit}**, so we round **${v.interactDirection}**. **${v.interactNumberFormatted} → ${v.interactRoundedFormatted}** ✓`,
                incorrect: (v) => `Not quite! The decider is **${v.interactDeciderDigit}**. ${v.interactDeciderDigit < 5 ? `${v.interactDeciderDigit} < 5 → round down` : `${v.interactDeciderDigit} ≥ 5 → round up`}. The answer is **${v.interactRoundedFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Rounding big numbers — same method!",
            body: () => `Whether you're rounding to the nearest 10 or 100,000, the method is always the same:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the TARGET digit", why: "The digit in the column you're rounding to" },
                  { text: "Step 2: Look at the DECIDER (one place right)", why: "This digit decides up or down" },
                  { text: "Step 3: 0-4 → round down, 5-9 → round up", why: "The same rule, no matter how big the number" },
                  { text: "Step 4: Replace everything to the right with zeros", why: "Done! ✓" }
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
        id: "rounding-1000-plus-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid sequential (cascading) rounding",
          "Why you should round in one step, not multiple steps"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "tries to round a number to the nearest thousand",
            number: 4449,
            numberFormatted: "4,449",
            roundToWord: "nearest thousand",
            correctAnswer: 4000,
            correctFormatted: "4,000",
            wrongAnswer: 5000,
            wrongFormatted: "5,000",
            mistakeExplanation: "rounded step by step: 4,449 → 4,450 → 4,500 → 5,000. But that's WRONG! You should round in ONE step: look at the hundreds digit (4), which is less than 5, so round down to 4,000",
            deciderDigit: 4,
            direction: "down"
          },
          {
            name: "Holly",
            scenario: "tries to round a distance to the nearest thousand",
            number: 2547,
            numberFormatted: "2,547",
            roundToWord: "nearest thousand",
            correctAnswer: 3000,
            correctFormatted: "3,000",
            wrongAnswer: 2000,
            wrongFormatted: "2,000",
            mistakeExplanation: "looked at the wrong digit! Looked at the tens digit (4) instead of the hundreds digit (5). The decider for thousands is the HUNDREDS digit, not the tens",
            deciderDigit: 5,
            direction: "up"
          },
          {
            name: "Finn",
            scenario: "rounds a population figure to the nearest ten thousand",
            number: 44500,
            numberFormatted: "44,500",
            roundToWord: "nearest ten thousand",
            correctAnswer: 40000,
            correctFormatted: "40,000",
            wrongAnswer: 50000,
            wrongFormatted: "50,000",
            mistakeExplanation: "rounded in stages: 44,500 → 45,000 → 50,000. But you must round in ONE go! The decider for ten-thousands is the thousands digit (4), which is less than 5, so it rounds down to 40,000",
            deciderDigit: 4,
            direction: "down"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n${v.name} says: **${v.numberFormatted}** rounded to the ${v.roundToWord} = **${v.wrongFormatted}**\n\nThat's not right! Can you see what went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.number);
                const digits = str.split('').map(Number);
                while (digits.length < 6) digits.unshift(0);
                return {
                  columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [{ label: "Number", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Round in ONE step — never cascade!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct answer is **${v.correctFormatted}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => {
                  const str = String(v.number);
                  const digits = str.split('').map(Number);
                  while (digits.length < 6) digits.unshift(0);
                  return {
                    columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
                    rows: [{ label: "Number", values: digits }],
                    highlight: []
                  };
                }
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Number: ${v.numberFormatted}`, why: `Rounding to the ${v.roundToWord}` },
                    { text: `Find the decider digit: ${v.deciderDigit}`, why: `One place to the RIGHT of the target` },
                    { text: `${v.deciderDigit} ${v.deciderDigit < 5 ? '< 5 → round DOWN' : '≥ 5 → round UP'}`, result: v.correctFormatted }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `What is **${v.numberFormatted}** correctly rounded to the **${v.roundToWord}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const str = String(v.number);
                const digits = str.split('').map(Number);
                while (digits.length < 6) digits.unshift(0);
                return {
                  columns: ["HundTh", "Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [{ label: "Number", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.numberFormatted} rounded to the ${v.roundToWord} = ?`,
              getOptions: (v) => generateDistractors(v.correctAnswer),
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `That's right! **${v.numberFormatted} → ${v.correctFormatted}**. Round in one step, never cascade! ✓`,
                incorrect: (v) => `Not quite! The decider is **${v.deciderDigit}**, so we round **${v.direction}**. The answer is **${v.correctFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Never cascade your rounding!",
            body: () => `A very common mistake is rounding in stages (10 → 100 → 1000). This gives the **wrong** answer!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "WRONG: 4,449 → 4,450 → 4,500 → 5,000", why: "Cascading gives the wrong answer!" },
                  { text: "RIGHT: 4,449 → look at hundreds digit (4)", why: "4 < 5 so round down" },
                  { text: "4,449 → 4,000", why: "One step, done! ✓" }
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
  // SUB-CONCEPT 6: Rounding Decimals
  // ==========================================
  {
    id: "rounding-decimals",
    name: "Rounding Decimals",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "rounding-decimals-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to round a decimal to the nearest whole number",
          "How to round a decimal to one decimal place"
        ],
        variableSets: [
          {
            name: "Daisy",
            pronoun: "She",
            scenario: "measures the length of her desk in metres",
            number: 1.47,
            numberStr: "1.47",
            roundTo: "nearest whole number",
            targetDigit: 1,
            targetPlace: "ones",
            deciderDigit: 4,
            deciderPlace: "tenths",
            rounded: 1,
            roundedStr: "1",
            roundDown: 1,
            roundUp: 2,
            direction: "down",
            unit: "metres",
            // Interact-specific: 2.73 → round to nearest whole = 3
            interactNumber: 2.73,
            interactNumberStr: "2.73",
            interactDeciderDigit: 7,
            interactRounded: 3,
            interactRoundedStr: "3",
            interactRoundDown: 2,
            interactRoundUp: 3,
            interactDirection: "up"
          },
          {
            name: "Oscar",
            pronoun: "He",
            scenario: "weighs a parcel at the post office",
            number: 3.65,
            numberStr: "3.65",
            roundTo: "nearest whole number",
            targetDigit: 3,
            targetPlace: "ones",
            deciderDigit: 6,
            deciderPlace: "tenths",
            rounded: 4,
            roundedStr: "4",
            roundDown: 3,
            roundUp: 4,
            direction: "up",
            unit: "kg",
            // Interact-specific: 5.32 → round to nearest whole = 5
            interactNumber: 5.32,
            interactNumberStr: "5.32",
            interactDeciderDigit: 3,
            interactRounded: 5,
            interactRoundedStr: "5",
            interactRoundDown: 5,
            interactRoundUp: 6,
            interactDirection: "down"
          },
          {
            name: "Lily",
            pronoun: "She",
            scenario: "records her 100m sprint time",
            number: 14.83,
            numberStr: "14.83",
            roundTo: "one decimal place",
            targetDigit: 8,
            targetPlace: "tenths",
            deciderDigit: 3,
            deciderPlace: "hundredths",
            rounded: 14.8,
            roundedStr: "14.8",
            roundDown: 14.8,
            roundUp: 14.9,
            direction: "down",
            unit: "seconds",
            // Interact-specific: 12.56 → round to 1dp = 12.6
            interactNumber: 12.56,
            interactNumberStr: "12.56",
            interactDeciderDigit: 6,
            interactRounded: 12.6,
            interactRoundedStr: "12.6",
            interactRoundDown: 12.5,
            interactRoundUp: 12.6,
            interactDirection: "up"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Round ${v.numberStr} to the ${v.roundTo}`,
            body: (v) => `${v.name} ${v.scenario} and gets **${v.numberStr} ${v.unit}**. ${v.pronoun} needs to round it to the **${v.roundTo}**. The method is exactly the same as rounding whole numbers!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.roundDown,
                max: v.roundUp,
                points: [{ value: v.number, label: v.numberStr, color: "#7C3AED" }],
                jumps: [],
                tickInterval: v.roundUp - v.roundDown,
                showLabels: true,
                highlight: [v.roundDown, v.roundUp]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same method — target and decider!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The **target digit** is the ${v.targetPlace} digit: **${v.targetDigit}**.\nThe **decider** is one place to the right — the ${v.deciderPlace} digit: **${v.deciderDigit}**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Number: ${v.numberStr}`, why: `Round to the ${v.roundTo}` },
                    { text: `Target: ${v.targetPlace} digit = ${v.targetDigit}`, why: `This is the digit we're rounding` },
                    { text: `Decider: ${v.deciderPlace} digit = ${v.deciderDigit}`, why: `One place to the right of the target` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => v.deciderDigit < 5
                  ? `**${v.deciderDigit}** is less than 5 → round **down**. The target stays as ${v.targetDigit}.`
                  : `**${v.deciderDigit}** is 5 or more → round **up**. The target goes up by 1.`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: (v) => ({
                  min: v.roundDown,
                  max: v.roundUp,
                  points: [
                    { value: v.number, label: v.numberStr, color: "#7C3AED" },
                    { value: v.rounded, label: `${v.roundedStr} ✓`, color: "#16a34a" }
                  ],
                  jumps: [{ from: v.number, to: v.rounded, label: v.direction === "up" ? "rounds up" : "rounds down" }],
                  tickInterval: v.roundUp - v.roundDown,
                  showLabels: true,
                  highlight: [v.roundDown, v.roundUp]
                })
              },
              {
                type: 'text',
                content: (v) => `**${v.numberStr}** rounded to the ${v.roundTo} = **${v.roundedStr}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Rounding decimals uses the same ____ as rounding whole numbers`,
              options: (v) => ["formula", "method", "calculator", "chart"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! The same method — find the target, check the decider, apply the 0-4/5-9 rule. ✓`,
                incorrect: (v) => `Not quite — rounding decimals uses the same **method** as whole numbers: target digit, decider digit, 0-4 down / 5-9 up!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumberStr}** rounded to the **${v.roundTo}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactRoundDown,
                max: v.interactRoundUp,
                points: [{ value: v.interactNumber, label: v.interactNumberStr, color: "#7C3AED" }],
                jumps: [],
                tickInterval: v.interactRoundUp - v.interactRoundDown,
                showLabels: true,
                highlight: [v.interactRoundDown, v.interactRoundUp]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumberStr} rounded to the ${v.roundTo}?`,
              getOptions: (v) => generateDistractors(v.interactRounded).map(n => n.toLocaleString()),
              correctAnswer: (v) => v.interactRounded.toLocaleString(),
              feedback: {
                correct: (v) => `Well done! The decider is **${v.interactDeciderDigit}**, so we round **${v.interactDirection}**. **${v.interactNumberStr} → ${v.interactRoundedStr}** ✓`,
                incorrect: (v) => `Not quite! The decider is **${v.interactDeciderDigit}**. ${v.interactDeciderDigit < 5 ? `${v.interactDeciderDigit} < 5 → round down` : `${v.interactDeciderDigit} ≥ 5 → round up`}. The answer is **${v.interactRoundedStr}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Rounding decimals — same recipe!",
            body: () => `Rounding decimals works **exactly** the same as rounding whole numbers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Nearest whole number → target is the ones digit", why: "Decider is the tenths (first decimal) digit" },
                  { text: "One decimal place → target is the tenths digit", why: "Decider is the hundredths (second decimal) digit" },
                  { text: "Apply the same 0-4/5-9 rule", why: "Then drop everything after the target ✓" }
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
        id: "rounding-decimals-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to round money amounts to the nearest pound",
          "When rounding decimals is useful in real life"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "estimates the total cost of his shopping",
            items: ["bread £1.85", "milk £1.15", "apples £2.49"],
            exactTotal: 5.49,
            exactTotalStr: "£5.49",
            roundedItems: [2, 1, 2],
            estimatedTotal: 5,
            estimatedTotalStr: "£5",
            unit: "pounds",
            testNumber: 7.62,
            testNumberStr: "£7.62",
            testRounded: 8,
            testRoundedStr: "£8"
          },
          {
            name: "Priya",
            scenario: "works out roughly how much pocket money she's saved",
            items: ["week 1: £3.75", "week 2: £4.20", "week 3: £2.50"],
            exactTotal: 10.45,
            exactTotalStr: "£10.45",
            roundedItems: [4, 4, 3],
            estimatedTotal: 11,
            estimatedTotalStr: "£11",
            unit: "pounds",
            testNumber: 12.38,
            testNumberStr: "£12.38",
            testRounded: 12,
            testRoundedStr: "£12"
          },
          {
            name: "Jake",
            scenario: "estimates the cost of cinema tickets for his family",
            items: ["adult £8.50", "adult £8.50", "child £5.75"],
            exactTotal: 22.75,
            exactTotalStr: "£22.75",
            roundedItems: [9, 9, 6],
            estimatedTotal: 24,
            estimatedTotalStr: "£24",
            unit: "pounds",
            testNumber: 15.49,
            testNumberStr: "£15.49",
            testRounded: 15,
            testRoundedStr: "£15"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Quick estimate: how much altogether?`,
            body: (v) => `${v.name} ${v.scenario}: ${v.items.join(', ')}. Instead of adding the exact amounts, you can **round each to the nearest pound** for a quick estimate (a rough guess)!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.items.map((item, i) => ({
                  text: item,
                  result: `≈ £${v.roundedItems[i]}`
                })),
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Round to the nearest pound!",
            body: (v) => `To round money to the nearest pound, look at the **pence** (the tenths digit).\n\n• 50p or more → round **up**\n• Less than 50p → round **down**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  ...v.items.map((item, i) => ({
                    text: item,
                    result: `≈ £${v.roundedItems[i]}`
                  })),
                  { text: `Total estimate: £${v.roundedItems.join(' + £')}`, result: `≈ ${v.estimatedTotalStr}` },
                  { text: `Exact total: ${v.exactTotalStr}`, why: `Close to our estimate!` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Round **${v.testNumberStr}** to the nearest pound.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: Math.floor(v.testNumber),
                max: Math.ceil(v.testNumber),
                points: [{ value: v.testNumber, label: v.testNumberStr, color: "#7C3AED" }],
                jumps: [],
                tickInterval: 1,
                showLabels: true,
                highlight: [Math.floor(v.testNumber), Math.ceil(v.testNumber)]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.testNumberStr} rounded to the nearest pound = ?`,
              getOptions: (v) => generateDistractors(v.testRounded),
              correctAnswer: (v) => v.testRounded,
              feedback: {
                correct: (v) => `Spot on! **${v.testNumberStr} ≈ ${v.testRoundedStr}** ✓`,
                incorrect: (v) => `Not quite! Look at the pence. **${v.testNumberStr} → ${v.testRoundedStr}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Rounding money — a life skill!",
            body: () => `Rounding to the nearest pound is great for **quick estimates** when shopping:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Look at the pence (digits after the point)", why: "50p or more → round up. Less than 50p → round down" },
                  { text: "Round each item to the nearest pound", why: "e.g. £3.75 → £4, £2.30 → £2" },
                  { text: "Add the rounded amounts for a quick total", why: "It won't be exact, but it's close enough to check! ✓" }
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
  // SUB-CONCEPT 7: Partitioning Numbers
  // ==========================================
  {
    id: "partitioning",
    name: "Partitioning Numbers",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "partitioning-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to partition a number into thousands, hundreds, tens and ones",
          "Why partitioning helps with mental addition and subtraction"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "breaks down a number for a mental maths challenge",
            number: 4567,
            numberFormatted: "4,567",
            digits: [4, 5, 6, 7],
            columns: ["Thous", "Hund", "Tens", "Ones"],
            parts: [4000, 500, 60, 7],
            partsStr: "4,000 + 500 + 60 + 7",
            unit: "points",
            // Interact-specific: 7,321
            interactNumber: 7321,
            interactNumberFormatted: "7,321",
            interactDigits: [7, 3, 2, 1],
            interactParts: [7000, 300, 20, 1],
            interactPartsStr: "7,000 + 300 + 20 + 1"
          },
          {
            name: "Isaac",
            scenario: "partitions a distance for a geography project",
            number: 8234,
            numberFormatted: "8,234",
            digits: [8, 2, 3, 4],
            columns: ["Thous", "Hund", "Tens", "Ones"],
            parts: [8000, 200, 30, 4],
            partsStr: "8,000 + 200 + 30 + 4",
            unit: "metres",
            // Interact-specific: 5,609
            interactNumber: 5609,
            interactNumberFormatted: "5,609",
            interactDigits: [5, 6, 0, 9],
            interactParts: [5000, 600, 0, 9],
            interactPartsStr: "5,000 + 600 + 9"
          },
          {
            name: "Holly",
            scenario: "breaks down a number to help with a calculation",
            number: 36052,
            numberFormatted: "36,052",
            digits: [3, 6, 0, 5, 2],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            parts: [30000, 6000, 0, 50, 2],
            partsStr: "30,000 + 6,000 + 50 + 2",
            unit: "people",
            // Interact-specific: 52,408
            interactNumber: 52408,
            interactNumberFormatted: "52,408",
            interactDigits: [5, 2, 4, 0, 8],
            interactParts: [50000, 2000, 400, 0, 8],
            interactPartsStr: "50,000 + 2,000 + 400 + 8"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Break ${v.numberFormatted} into pieces!`,
            body: (v) => `${v.name} ${v.scenario}. The number is **${v.numberFormatted}**.\n\n**Partitioning** means splitting a number into its place value parts. It makes adding and subtracting in your head much easier — instead of working with one big number, you deal with smaller, simpler pieces!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.digits }],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Each digit becomes its full value!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Take each digit and write its **full value** based on its column. Then add them together:`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [{ label: "Number", values: v.digits }],
                  highlight: []
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const steps = v.parts
                    .filter(p => p > 0)
                    .map((part, i) => ({
                      text: `${part.toLocaleString()}`,
                      why: `The ${v.columns[v.parts.indexOf(part)]} column`
                    }));
                  steps.push({ text: `${v.partsStr}`, result: `= ${v.numberFormatted}` });
                  return { steps, allRevealed: true };
                }
              },
              {
                type: 'text',
                content: (v) => `**${v.numberFormatted} = ${v.partsStr}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write each digit with its full place value`,
                `Skip any zeros (they add nothing)`,
                `Add the parts together to check they equal the original`
              ],
              feedback: {
                correct: (v) => `Perfect order! Write values, skip zeros, then check by adding. ✓`,
                incorrect: (v) => `Not quite — first write each digit's full value, then skip zeros, then add up to check.`
              }
            }
          },
          {
            type: "interact",
            title: () => "What's the full partition?",
            body: (v) => `What does **${v.interactNumberFormatted}** partition into? Add up all the parts!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Number", values: v.interactDigits }],
                highlight: []
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumberFormatted} = ?`,
              getOptions: (v) => [
                v.interactPartsStr,
                v.interactPartsStr.replace(String(v.interactParts[0].toLocaleString()), String((v.interactParts[0] / 10).toLocaleString())),
                v.interactParts.join(' + '),
                v.interactPartsStr.replace(' + ' + String(v.interactParts[v.interactParts.length - 1]), ''),
                String(v.interactParts.filter(p => p > 0).reverse().join(' + '))
              ],
              correctAnswer: (v) => v.interactPartsStr,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumberFormatted} = ${v.interactPartsStr}** ✓`,
                incorrect: (v) => `Not quite! Each digit keeps its column value: **${v.interactPartsStr}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Partitioning — a powerful tool!",
            body: () => `Partitioning means breaking a number into its **place value parts**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Write each digit with its full place value", why: "e.g. the 4 in 4,567 is worth 4,000" },
                  { text: "Skip any zeros (they add nothing)", why: "e.g. 3,052 = 3,000 + 50 + 2 (no hundreds)" },
                  { text: "Check: the parts should add back to the original!", why: "4,000 + 500 + 60 + 7 = 4,567 ✓" }
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
        id: "partitioning-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to use partitioning for mental addition",
          "When to use partitioning in real calculations"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "adds two numbers mentally using partitioning",
            numberA: 346,
            numberB: 235,
            partsA: [300, 40, 6],
            partsB: [200, 30, 5],
            addedParts: [500, 70, 11],
            total: 581,
            totalStr: "581"
          },
          {
            name: "Grace",
            scenario: "adds two scores from a quiz using partitioning",
            numberA: 478,
            numberB: 315,
            partsA: [400, 70, 8],
            partsB: [300, 10, 5],
            addedParts: [700, 80, 13],
            total: 793,
            totalStr: "793"
          },
          {
            name: "Marcus",
            scenario: "adds two distances walked on different days",
            numberA: 527,
            numberB: 248,
            partsA: [500, 20, 7],
            partsB: [200, 40, 8],
            addedParts: [700, 60, 15],
            total: 775,
            totalStr: "775"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.numberA} + ${v.numberB} in your head!`,
            body: (v) => `${v.name} ${v.scenario}: **${v.numberA} + ${v.numberB}**. That looks tricky to do mentally — but **partitioning** makes it easy!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numberA} + ${v.numberB} = ???`, why: "Looks hard... but partitioning helps!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Partition, add, combine!",
            body: (v) => `Break both numbers into hundreds, tens and ones. Then add each group separately:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numberA} = ${v.partsA.join(' + ')}`, why: "Partition the first number" },
                  { text: `${v.numberB} = ${v.partsB.join(' + ')}`, why: "Partition the second number" },
                  { text: `Hundreds: ${v.partsA[0]} + ${v.partsB[0]} = ${v.addedParts[0]}`, why: "Add the hundreds" },
                  { text: `Tens: ${v.partsA[1]} + ${v.partsB[1]} = ${v.addedParts[1]}`, why: "Add the tens" },
                  { text: `Ones: ${v.partsA[2]} + ${v.partsB[2]} = ${v.addedParts[2]}`, why: "Add the ones" },
                  { text: `${v.addedParts.join(' + ')} = ${v.total}`, result: `${v.numberA} + ${v.numberB} = ${v.total}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use partitioning to work out **${v.numberA} + ${v.numberB}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numberA} = ${v.partsA.join(' + ')}` },
                  { text: `${v.numberB} = ${v.partsB.join(' + ')}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.numberA} + ${v.numberB} = ?`,
              getOptions: (v) => generateDistractors(v.total),
              correctAnswer: (v) => v.total,
              feedback: {
                correct: (v) => `Brilliant! ${v.numberA} + ${v.numberB} = **${v.total}**. Partitioning makes mental maths so much easier! ✓`,
                incorrect: (v) => `Not quite! H: ${v.addedParts[0]}, T: ${v.addedParts[1]}, O: ${v.addedParts[2]} → **${v.total}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Partition to add mentally!",
            body: () => `Partitioning turns one hard addition into three easy ones:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Partition both numbers (H + T + O)", why: "e.g. 346 = 300 + 40 + 6" },
                  { text: "Add the hundreds, then tens, then ones", why: "Each step is a simple calculation" },
                  { text: "Combine the totals", why: "500 + 70 + 11 = 581 ✓" }
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
  // SUB-CONCEPT 8: Adding/Subtracting Powers of 10
  // ==========================================
  {
    id: "adding-subtracting-powers-10",
    name: "Adding/Subtracting 10, 100, 1000 Mentally",
    category: "other",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "powers-10-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that adding 10, 100, or 1000 changes only one digit",
          "Why the other digits stay the same"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "watches numbers change on a scoreboard",
            number: 4567,
            numberFormatted: "4,567",
            addAmount: 100,
            addAmountWord: "100",
            result: 4667,
            resultFormatted: "4,667",
            digits: [4, 5, 6, 7],
            resultDigits: [4, 6, 6, 7],
            columns: ["Thous", "Hund", "Tens", "Ones"],
            changedCol: 1,
            changedPlace: "hundreds",
            changedFrom: 5,
            changedTo: 6
          },
          {
            name: "Isaac",
            scenario: "sees a counter go up on a website",
            number: 23450,
            numberFormatted: "23,450",
            addAmount: 1000,
            addAmountWord: "1,000",
            result: 24450,
            resultFormatted: "24,450",
            digits: [2, 3, 4, 5, 0],
            resultDigits: [2, 4, 4, 5, 0],
            columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
            changedCol: 1,
            changedPlace: "thousands",
            changedFrom: 3,
            changedTo: 4
          },
          {
            name: "Nadia",
            scenario: "adds 10 more people to a concert attendance figure",
            number: 8735,
            numberFormatted: "8,735",
            addAmount: 10,
            addAmountWord: "10",
            result: 8745,
            resultFormatted: "8,745",
            digits: [8, 7, 3, 5],
            resultDigits: [8, 7, 4, 5],
            columns: ["Thous", "Hund", "Tens", "Ones"],
            changedCol: 2,
            changedPlace: "tens",
            changedFrom: 3,
            changedTo: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.numberFormatted} + ${v.addAmountWord} = ?`,
            body: (v) => `${v.name} ${v.scenario}. The number goes from **${v.numberFormatted}** up by **${v.addAmountWord}**. Which digit changes? Let's find out!`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Before", values: v.digits }],
                highlight: []
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Only ONE digit changes!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `When you add **${v.addAmountWord}**, only the **${v.changedPlace}** digit changes. Everything else stays the same!`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => ({
                  columns: v.columns,
                  rows: [
                    { label: "Before", values: v.digits },
                    { label: "After", values: v.resultDigits }
                  ],
                  highlight: [[0, v.changedCol], [1, v.changedCol]]
                })
              },
              {
                type: 'text',
                content: (v) => `The ${v.changedPlace} digit went from **${v.changedFrom}** to **${v.changedTo}** — that's going up by 1. All the other digits stayed exactly the same!`
              },
              {
                type: 'text',
                content: (v) => `**${v.numberFormatted} + ${v.addAmountWord} = ${v.resultFormatted}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Add 10", right: "Tens digit goes up by 1" },
                { left: "Add 100", right: "Hundreds digit goes up by 1" },
                { left: "Add 1,000", right: "Thousands digit goes up by 1" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.numberFormatted} + ${v.addAmountWord}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => ({
                columns: v.columns,
                rows: [{ label: "Before", values: v.digits }],
                highlight: [[0, v.changedCol]]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.numberFormatted} + ${v.addAmountWord} = ?`,
              getOptions: (v) => generateDistractors(v.result).map(n => n.toLocaleString()),
              correctAnswer: (v) => v.result.toLocaleString(),
              feedback: {
                correct: (v) => `That's right! Only the ${v.changedPlace} digit changes: ${v.changedFrom} → ${v.changedTo}. **${v.resultFormatted}** ✓`,
                incorrect: (v) => `Not quite! Adding ${v.addAmountWord} only changes the ${v.changedPlace} digit. **${v.numberFormatted} + ${v.addAmountWord} = ${v.resultFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The magic of powers of 10!",
            body: () => `Adding 10, 100, or 1000 is super easy once you know the trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Adding 10 → only the TENS digit goes up by 1", why: "e.g. 4,567 + 10 = 4,577" },
                  { text: "Adding 100 → only the HUNDREDS digit goes up by 1", why: "e.g. 4,567 + 100 = 4,667" },
                  { text: "Adding 1,000 → only the THOUSANDS digit goes up by 1", why: "e.g. 4,567 + 1,000 = 5,567" },
                  { text: "Subtracting works the same way — the digit goes DOWN by 1", why: "e.g. 4,567 − 100 = 4,467 ✓" }
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
        id: "powers-10-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid changing the wrong digit when adding 10, 100 or 1000",
          "Why carrying sometimes changes more than one digit"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "subtracts 100 from a number",
            number: 5023,
            numberFormatted: "5,023",
            operation: "5,023 − 100",
            correctAnswer: 4923,
            correctFormatted: "4,923",
            wrongAnswer: 5123,
            wrongFormatted: "5,123",
            mistakeExplanation: "added 100 instead of subtracting! The hundreds digit should go DOWN, not up",
            changedPlace: "hundreds",
            // Interact-specific: 7,841 − 1000 = 6,841
            interactNumber: 7841,
            interactNumberFormatted: "7,841",
            interactOperation: "7,841 − 1,000",
            interactCorrectAnswer: 6841,
            interactCorrectFormatted: "6,841",
            interactChangedPlace: "thousands"
          },
          {
            name: "Priya",
            scenario: "adds 1000 to a number",
            number: 9500,
            numberFormatted: "9,500",
            operation: "9,500 + 1000",
            correctAnswer: 10500,
            correctFormatted: "10,500",
            wrongAnswer: 9600,
            wrongFormatted: "9,600",
            mistakeExplanation: "changed the hundreds digit instead of the thousands! Adding 1,000 changes the THOUSANDS digit. But 9 + 1 = 10, so it carries over",
            changedPlace: "thousands",
            // Interact-specific: 3,672 + 100 = 3,772
            interactNumber: 3672,
            interactNumberFormatted: "3,672",
            interactOperation: "3,672 + 100",
            interactCorrectAnswer: 3772,
            interactCorrectFormatted: "3,772",
            interactChangedPlace: "hundreds"
          },
          {
            name: "Finn",
            scenario: "adds 10 to a number",
            number: 6298,
            numberFormatted: "6,298",
            operation: "6,298 + 10",
            correctAnswer: 6308,
            correctFormatted: "6,308",
            wrongAnswer: 6299,
            wrongFormatted: "6,299",
            mistakeExplanation: "added 1 to the ones instead of 10 to the tens! Remember: adding 10 changes the TENS digit. Here 9 + 1 = 10, so the tens become 0 and the hundreds go up by 1",
            changedPlace: "tens",
            // Interact-specific: 4,156 − 10 = 4,146
            interactNumber: 4156,
            interactNumberFormatted: "4,156",
            interactOperation: "4,156 − 10",
            interactCorrectAnswer: 4146,
            interactCorrectFormatted: "4,146",
            interactChangedPlace: "tens"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n${v.name} says: **${v.operation} = ${v.wrongFormatted}**\n\nThat's not right! What went wrong?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const digits = String(v.number).split('').map(Number);
                const wrongDigits = String(v.wrongAnswer).split('').map(Number);
                const cols = digits.length === 5
                  ? ["Ten Th", "Thous", "Hund", "Tens", "Ones"]
                  : ["Thous", "Hund", "Tens", "Ones"];
                while (wrongDigits.length < digits.length) wrongDigits.unshift(0);
                return {
                  columns: cols,
                  rows: [
                    { label: "Before", values: digits },
                    { label: v.name + "'s", values: wrongDigits }
                  ],
                  highlight: []
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Change the right digit!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct answer is **${v.correctFormatted}**.`
              },
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: (v) => {
                  const digits = String(v.number).split('').map(Number);
                  const correctDigits = String(v.correctAnswer).split('').map(Number);
                  const maxLen = Math.max(digits.length, correctDigits.length);
                  while (digits.length < maxLen) digits.unshift(0);
                  while (correctDigits.length < maxLen) correctDigits.unshift(0);
                  const cols = maxLen === 5
                    ? ["Ten Th", "Thous", "Hund", "Tens", "Ones"]
                    : ["Thous", "Hund", "Tens", "Ones"];
                  const diffCol = digits.findIndex((d, i) => d !== correctDigits[i]);
                  return {
                    columns: cols,
                    rows: [
                      { label: "Before", values: digits },
                      { label: "After", values: correctDigits }
                    ],
                    highlight: diffCol >= 0 ? [[0, diffCol], [1, diffCol]] : []
                  };
                }
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.operation}`, why: `Change the ${v.changedPlace} digit` },
                    { text: `Correct answer: ${v.correctFormatted}`, result: `✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `What is **${v.interactOperation}**?`,
            visual: {
              component: "PlaceValueChart",
              props: (v) => {
                const digits = String(v.interactNumber).split('').map(Number);
                const cols = digits.length === 5
                  ? ["Ten Th", "Thous", "Hund", "Tens", "Ones"]
                  : ["Thous", "Hund", "Tens", "Ones"];
                return {
                  columns: cols,
                  rows: [{ label: "Before", values: digits }],
                  highlight: []
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactOperation} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `That's right! **${v.interactOperation} = ${v.interactCorrectFormatted}** ✓`,
                incorrect: (v) => `Not quite! Remember to change the ${v.interactChangedPlace} digit. **${v.interactOperation} = ${v.interactCorrectFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Watch out for carries!",
            body: () => `Usually only one digit changes, but sometimes it **carries** into a new column:`,
            bodyParts: [
              {
                type: 'visual',
                component: 'PlaceValueChart',
                props: () => ({
                  columns: ["Ten Th", "Thous", "Hund", "Tens", "Ones"],
                  rows: [
                    { label: "Before", values: [0, 9, 5, 0, 0] },
                    { label: "After", values: [1, 0, 5, 0, 0] }
                  ],
                  highlight: [[0, 0], [0, 1], [1, 0], [1, 1]]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "9,500 + 1,000 = 10,500", why: "The 9 in the thousands becomes 10 — carry into ten thousands!" },
                    { text: "When a digit reaches 10, it carries to the next column", why: "Just like 9 + 1 = 10 in any column ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 9: Making Largest/Smallest Numbers
  // ==========================================
  {
    id: "making-numbers",
    name: "Making Largest/Smallest Number from Digits",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "making-numbers-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to arrange digits to make the largest possible number",
          "How to arrange digits to make the smallest possible number"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "has these digit cards",
            digits: [3, 7, 1, 9, 5],
            digitsStr: "3, 7, 1, 9, 5",
            largest: 97531,
            largestFormatted: "97,531",
            smallest: 13579,
            smallestFormatted: "13,579",
            sortedDesc: [9, 7, 5, 3, 1],
            sortedAsc: [1, 3, 5, 7, 9]
          },
          {
            name: "Ella",
            scenario: "picks these number tiles from a bag",
            digits: [8, 2, 6, 4, 0],
            digitsStr: "8, 2, 6, 4, 0",
            largest: 86420,
            largestFormatted: "86,420",
            smallest: 20468,
            smallestFormatted: "20,468",
            sortedDesc: [8, 6, 4, 2, 0],
            sortedAsc: [0, 2, 4, 6, 8]
          },
          {
            name: "Nadia",
            scenario: "uses these digits from a raffle ticket",
            digits: [5, 2, 8, 3, 7],
            digitsStr: "5, 2, 8, 3, 7",
            largest: 87532,
            largestFormatted: "87,532",
            smallest: 23578,
            smallestFormatted: "23,578",
            sortedDesc: [8, 7, 5, 3, 2],
            sortedAsc: [2, 3, 5, 7, 8]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the biggest number you can make?`,
            body: (v) => `${v.name} ${v.scenario}: **${v.digitsStr}**. Using each digit exactly once, what's the **largest** number you can make? And the **smallest**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Available digits: ${v.digitsStr}`, why: "Use each digit exactly once" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Biggest digit first!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `For the **largest** number, put the **biggest** digits in the **highest** place value columns. Sort them from largest to smallest:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Sort digits: ${v.sortedDesc.join(', ')}`, why: "Biggest first" },
                    { text: `Largest number: ${v.largestFormatted}`, result: "✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => {
                  const hasZero = v.digits.includes(0);
                  if (hasZero) {
                    return `For the **smallest** number, sort from smallest to largest — but be careful! **Zero can't go first** (or it wouldn't be a 5-digit number). Put the **smallest non-zero digit** first, then zero, then the rest.`;
                  }
                  return `For the **smallest** number, sort from smallest to largest:`;
                }
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Sort digits: ${v.sortedAsc.join(', ')}`, why: "Smallest first" },
                    { text: `Smallest number: ${v.smallestFormatted}`, result: "✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Largest number", right: "Biggest digit first" },
                { left: "Smallest number", right: "Smallest digit first" },
                { left: "Zero in the digits", right: "Can't be the first digit" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the largest?",
            body: (v) => `Using the digits **${v.digitsStr}**, what is the **largest** number you can make?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Digits: ${v.digitsStr}`, why: "Put the biggest digit in the highest place" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Largest number from digits ${v.digitsStr}?`,
              getOptions: (v) => {
                // Generate distractors using the SAME digits (valid rearrangements)
                const d = [...v.digits];
                const correct = v.largest;
                const opts = new Set([correct.toLocaleString()]);
                // Common mistakes: reversed order (smallest), swapping first two digits, random shuffles
                const smallest = Number(d.slice().sort((a,b) => a-b).map((x,i) => i === 0 && x === 0 ? '' : x).join('') || d.slice().sort((a,b) => a-b).join(''));
                opts.add(smallest.toLocaleString());
                // Swap first two digits of correct
                const desc = [...v.sortedDesc];
                if (desc.length >= 2) {
                  const s1 = [desc[1], desc[0], ...desc.slice(2)];
                  opts.add(Number(s1.join('')).toLocaleString());
                }
                // Swap last two digits
                if (desc.length >= 2) {
                  const s2 = [...desc.slice(0, -2), desc[desc.length-1], desc[desc.length-2]];
                  opts.add(Number(s2.join('')).toLocaleString());
                }
                // Reverse the whole thing
                opts.add(Number(desc.slice().reverse().join('')).toLocaleString());
                return [...opts].slice(0, 5).sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.largest.toLocaleString(),
              feedback: {
                correct: (v) => `Brilliant! Put the biggest digits first: **${v.largestFormatted}** ✓`,
                incorrect: (v) => `Not quite! Sort the digits from biggest to smallest: ${v.sortedDesc.join(', ')} → **${v.largestFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The sorting shortcut!",
            body: () => `Making the largest or smallest number from digits is easy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "LARGEST: Sort digits biggest → smallest", why: "Biggest digit in the highest place value" },
                  { text: "SMALLEST: Sort digits smallest → biggest", why: "Smallest digit in the highest place value" },
                  { text: "Watch out for ZERO!", why: "Zero can't be the first digit — swap it with the next smallest ✓" }
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
        id: "making-numbers-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to handle zero when making the smallest number",
          "Why the first digit can never be zero in a whole number"
        ],
        variableSets: [
          {
            name: "Holly",
            pronoun: "She",
            scenario: "tries to make the smallest number from these digits",
            digits: [5, 0, 3, 8, 0],
            digitsStr: "5, 0, 3, 8, 0",
            wrongSmallest: "00358",
            wrongSmallestNum: 358,
            correctSmallest: 30058,
            correctSmallestFormatted: "30,058",
            sortedAsc: [0, 0, 3, 5, 8],
            firstNonZero: 3,
            explanation: "Starting with 0 gives a 3-digit number (358), not a 5-digit number"
          },
          {
            name: "Finn",
            pronoun: "He",
            scenario: "has digit cards with a zero",
            digits: [7, 0, 2, 9, 1],
            digitsStr: "7, 0, 2, 9, 1",
            wrongSmallest: "01279",
            wrongSmallestNum: 1279,
            correctSmallest: 10279,
            correctSmallestFormatted: "10,279",
            sortedAsc: [0, 1, 2, 7, 9],
            firstNonZero: 1,
            explanation: "Starting with 0 gives a 4-digit number (1,279), not a 5-digit number"
          },
          {
            name: "Lily",
            pronoun: "She",
            scenario: "picks digit tiles for a game",
            digits: [4, 0, 6, 0, 2],
            digitsStr: "4, 0, 6, 0, 2",
            wrongSmallest: "00246",
            wrongSmallestNum: 246,
            correctSmallest: 20046,
            correctSmallestFormatted: "20,046",
            sortedAsc: [0, 0, 2, 4, 6],
            firstNonZero: 2,
            explanation: "Starting with 0 turns it into a 3-digit number (246), not a 5-digit number"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The zero trap!`,
            body: (v) => `${v.name} ${v.scenario}: **${v.digitsStr}**. ${v.pronoun} sorts them smallest first: **${v.sortedAsc.join(', ')}** and writes **${v.wrongSmallest}**.\n\nBut wait — that starts with zero! Is it really a 5-digit number?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s attempt: ${v.wrongSmallest}`, why: `${v.explanation}` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Zero can't be first!",
            body: (v) => `A number can't start with zero — **${v.wrongSmallest}** is really just **${v.wrongSmallestNum}**.\n\nInstead, put the **smallest non-zero digit** (${v.firstNonZero}) first, then put the zeros next:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Sort digits: ${v.sortedAsc.join(', ')}`, why: "Smallest first" },
                  { text: `First digit can't be 0!`, why: "Swap 0 with the next smallest non-zero digit" },
                  { text: `Put ${v.firstNonZero} first, then zeros, then the rest`, result: v.correctSmallestFormatted },
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct smallest number?",
            body: (v) => `Using the digits **${v.digitsStr}**, what is the correct **smallest** 5-digit number?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Digits: ${v.digitsStr}`, why: `Remember: zero can't be first!` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Smallest 5-digit number from ${v.digitsStr}?`,
              getOptions: (v) => generateDistractors(v.correctSmallest),
              correctAnswer: (v) => v.correctSmallest,
              feedback: {
                correct: (v) => `Well done! Put ${v.firstNonZero} first, then the zeros: **${v.correctSmallestFormatted}** ✓`,
                incorrect: (v) => `Not quite! The smallest non-zero digit (${v.firstNonZero}) goes first, then the zeros. Answer: **${v.correctSmallestFormatted}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The zero rule!",
            body: () => `When making the smallest number from digits that include zero:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Sort all digits from smallest to biggest", why: "e.g. 0, 0, 3, 5, 8" },
                  { text: "If the smallest is 0, swap it with the next non-zero digit", why: "Put 3 first → 3, 0, 0, 5, 8" },
                  { text: "The zeros go right after the first digit", why: "30,058 — not 00,358! ✓" }
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
];

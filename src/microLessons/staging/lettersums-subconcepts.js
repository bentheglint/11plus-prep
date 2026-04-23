// ============================================================
// Supplementary sub-concepts for Letter Sums (Verbal Reasoning)
// To merge: add these to lessonBank.letterSums.subConcepts array in lessonData.js
// ============================================================
// A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=10,
// K=11, L=12, M=13, N=14, O=15, P=16, Q=17, R=18, S=19, T=20,
// U=21, V=22, W=23, X=24, Y=25, Z=26
// EJOTY: E=5, J=10, O=15, T=20, Y=25
// For + and − only, work left to right. For mixed operations with × or ÷, use BODMAS.
// ============================================================

export const letterSumsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Simple Addition
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "simple-addition",
    name: "Adding Letter Values",
    category: "core",
    lessons: [
      {
        id: "simple-addition-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to add letter values together — it's like cracking a number code!",
          "How to swap letters for numbers and add them up left to right"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "adding up letter values in her VR practice",
            expression: "B + A + G",
            letterValues: { B: 2, A: 1, G: 7 },
            calculation: "2 + 1 + 7 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "9", "11", "8", "12"],
            correctAnswer: "10",
            explanation: "B=2, A=1, G=7. Left to right: 2 + 1 = 3, then 3 + 7 = 10. ✓",
            // Interact-specific (different from teach)
            interactExpression: "D + A + F",
            interactLetterValues: { D: 4, A: 1, F: 6 },
            interactOptions: ["11", "10", "12", "9", "13"],
            interactCorrectAnswer: "11",
            interactExplanation: "D=4, A=1, F=6. Left to right: 4 + 1 = 5, then 5 + 6 = 11. ✓"
          },
          {
            name: "Oliver",
            scenario: "working through addition letter sums",
            expression: "C + A + T",
            letterValues: { C: 3, A: 1, T: 20 },
            calculation: "3 + 1 + 20 = 24",
            answer: 24,
            answerAsLetter: "X",
            options: ["24", "22", "26", "20", "28"],
            correctAnswer: "24",
            explanation: "C=3, A=1, T=20 (EJOTY!). Left to right: 3 + 1 = 4, then 4 + 20 = 24. ✓",
            interactExpression: "E + B + H",
            interactLetterValues: { E: 5, B: 2, H: 8 },
            interactOptions: ["15", "13", "17", "11", "19"],
            interactCorrectAnswer: "15",
            interactExplanation: "E=5 (EJOTY!), B=2, H=8. Left to right: 5 + 2 = 7, then 7 + 8 = 15. ✓"
          },
          {
            name: "Priya",
            scenario: "practising simple letter addition",
            expression: "D + O + G",
            letterValues: { D: 4, O: 15, G: 7 },
            calculation: "4 + 15 + 7 = 26",
            answer: 26,
            answerAsLetter: "Z",
            options: ["26", "24", "28", "22", "30"],
            correctAnswer: "26",
            explanation: "D=4, O=15 (EJOTY!), G=7. Left to right: 4 + 15 = 19, then 19 + 7 = 26. ✓",
            interactExpression: "C + A + B",
            interactLetterValues: { C: 3, A: 1, B: 2 },
            interactOptions: ["6", "5", "7", "4", "8"],
            interactCorrectAnswer: "6",
            interactExplanation: "C=3, A=1, B=2. Left to right: 3 + 1 = 4, then 4 + 2 = 6. ✓"
          },
          {
            name: "Finn",
            scenario: "adding letter values at his desk",
            expression: "H + E + N",
            letterValues: { H: 8, E: 5, N: 14 },
            calculation: "8 + 5 + 14 = 27",
            answer: 27,
            answerAsLetter: null,
            options: ["27", "25", "29", "23", "31"],
            correctAnswer: "27",
            explanation: "H=8, E=5 (EJOTY!), N=14. Left to right: 8 + 5 = 13, then 13 + 14 = 27. ✓",
            interactExpression: "G + B + I",
            interactLetterValues: { G: 7, B: 2, I: 9 },
            interactOptions: ["18", "16", "20", "14", "22"],
            interactCorrectAnswer: "18",
            interactExplanation: "G=7, B=2, I=9. Left to right: 7 + 2 = 9, then 9 + 9 = 18. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** In letter sums, every letter in the alphabet has a secret number: **A=1, B=2, C=3...** all the way to **Z=26**.\n\nSwap each letter for its number, then **add them up left to right**. Let's give it a go!\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Swap and Add",
            body: (v) => `Let's solve **${v.expression}**. Use EJOTY (E=5, J=10, O=15, T=20, Y=25) to quickly find letter positions.\n\nThen add **left to right**, one step at a time.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Write numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Use EJOTY as anchor points" },
                    { text: `Add left to right: ${v.calculation}`, why: "One step at a time — no shortcuts!" },
                    { text: `Answer: ${v.answer}`, why: v.answerAsLetter ? `That's also the letter ${v.answerAsLetter}` : "Done! ✓" }
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write the number above each letter using EJOTY`,
                `Add the numbers left to right, one at a time`,
                `Convert back to a letter if the question asks for one`
              ],
              feedback: {
                correct: (v) => `Perfect! Swap, add left to right, convert if needed. ✓`,
                incorrect: (v) => `Not quite — first swap letters for numbers, then add left to right!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?\n\nSwap the letters for numbers, then add left to right.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adding letter values — you've got it!",
            body: () => `Three simple steps and you'll nail any addition letter sum:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write the number above each letter", why: "EJOTY: E=5, J=10, O=15, T=20, Y=25 — count from nearest" },
                  { text: "2. Add them left to right", why: "First two, then add the next, and so on" },
                  { text: "3. Convert back if the question asks for a letter", why: "Use EJOTY to find the letter from the number ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "simple-addition-practice",
        templateType: "step-by-step",
        learningGoal: [
          "How to add up longer words without losing track — keep a running total!",
          "How to get faster at swapping letters for numbers using the EJOTY trick"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "adding up a four-letter word",
            expression: "F + I + S + H",
            letterValues: { F: 6, I: 9, S: 19, H: 8 },
            calculation: "6 + 9 + 19 + 8 = 42",
            answer: 42,
            answerAsLetter: null,
            options: ["42", "40", "44", "38", "46"],
            correctAnswer: "42",
            explanation: "F=6, I=9, S=19, H=8. Left to right: 6 + 9 = 15, + 19 = 34, + 8 = 42. ✓",
            interactExpression: "P + E + N",
            interactLetterValues: { P: 16, E: 5, N: 14 },
            interactOptions: ["35", "33", "37", "31", "39"],
            interactCorrectAnswer: "35",
            interactExplanation: "P=16, E=5 (EJOTY!), N=14. Left to right: 16 + 5 = 21, + 14 = 35. ✓"
          },
          {
            name: "Marcus",
            scenario: "working out the total of a word",
            expression: "L + I + M + E",
            letterValues: { L: 12, I: 9, M: 13, E: 5 },
            calculation: "12 + 9 + 13 + 5 = 39",
            answer: 39,
            answerAsLetter: null,
            options: ["39", "37", "41", "35", "43"],
            correctAnswer: "39",
            explanation: "L=12, I=9, M=13, E=5. Left to right: 12 + 9 = 21, + 13 = 34, + 5 = 39. ✓",
            interactExpression: "C + O + W",
            interactLetterValues: { C: 3, O: 15, W: 23 },
            interactOptions: ["41", "39", "43", "37", "45"],
            interactCorrectAnswer: "41",
            interactExplanation: "C=3, O=15 (EJOTY!), W=23. Left to right: 3 + 15 = 18, + 23 = 41. ✓"
          },
          {
            name: "Aisha",
            scenario: "finding the total value of a word",
            expression: "C + U + P",
            letterValues: { C: 3, U: 21, P: 16 },
            calculation: "3 + 21 + 16 = 40",
            answer: 40,
            answerAsLetter: null,
            options: ["40", "38", "42", "36", "44"],
            correctAnswer: "40",
            explanation: "C=3, U=21, P=16. Left to right: 3 + 21 = 24, + 16 = 40. ✓",
            interactExpression: "B + U + S",
            interactLetterValues: { B: 2, U: 21, S: 19 },
            interactOptions: ["42", "40", "44", "38", "46"],
            interactCorrectAnswer: "42",
            interactExplanation: "B=2, U=21, S=19. Left to right: 2 + 21 = 23, + 19 = 42. ✓"
          },
          {
            name: "Charlie",
            scenario: "totalling up a five-letter word",
            expression: "S + T + O + N + E",
            letterValues: { S: 19, T: 20, O: 15, N: 14, E: 5 },
            calculation: "19 + 20 + 15 + 14 + 5 = 73",
            answer: 73,
            answerAsLetter: null,
            options: ["73", "71", "75", "69", "77"],
            correctAnswer: "73",
            explanation: "S=19, T=20 (EJOTY!), O=15 (EJOTY!), N=14, E=5 (EJOTY!). Left to right: 19 + 20 = 39, + 15 = 54, + 14 = 68, + 5 = 73. ✓",
            interactExpression: "H + O + U + S + E",
            interactLetterValues: { H: 8, O: 15, U: 21, S: 19, E: 5 },
            interactOptions: ["68", "66", "70", "64", "72"],
            interactCorrectAnswer: "68",
            interactExplanation: "H=8, O=15 (EJOTY!), U=21, S=19, E=5 (EJOTY!). Left to right: 8 + 15 = 23, + 21 = 44, + 19 = 63, + 5 = 68. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you total up ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis one has more letters, but don't worry — just swap each letter for its number, then **add left to right**, keeping a running total as you go.\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step addition",
            body: (v) => `For **${v.expression}**, we need to add ${Object.keys(v.letterValues).length} letters. Use **EJOTY (E=5, J=10, O=15, T=20, Y=25)** to find each letter's number, then keep adding one at a time. Don't try to do it all in your head at once!`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Write each number above the letter" },
                    { text: `Calculate: ${v.calculation}`, why: "Add one at a time, left to right" },
                    { text: `Answer: ${v.answer}`, why: "Keep a running total as you go ✓" }
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `With longer words, keep a running ____ as you add each letter's value`,
              options: (v) => ["total", "average", "difference", "product"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A running total means adding each new number to your answer so far. ✓`,
                incorrect: (v) => `Not quite — keep a running total: add each letter's value one at a time!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Longer words? No problem!",
            body: () => `Longer words just mean more adding practice. Keep a running total and you'll breeze through them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write all the numbers above the letters", why: "Use EJOTY (E=5, J=10, O=15, T=20, Y=25) to find them quickly" },
                  { text: "2. Add the first two numbers", why: "Start your running total" },
                  { text: "3. Keep adding one number at a time", why: "Left to right — slow and steady wins! ✓" }
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
  // SUB-CONCEPT 2: Simple Subtraction
  // Category: core
  // ==========================================
  {
    id: "simple-subtraction",
    name: "Subtracting Letter Values",
    category: "core",
    lessons: [
      {
        id: "simple-subtraction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to subtract letter values — same idea, just take away instead of add!",
          "How to work left to right with subtraction (the same golden rule)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving subtraction letter sums",
            expression: "J - C",
            letterValues: { J: 10, C: 3 },
            calculation: "10 - 3 = 7",
            answer: 7,
            answerAsLetter: "G",
            options: ["7", "13", "8", "6", "10"],
            correctAnswer: "7",
            explanation: "J=10 (EJOTY!), C=3. Left to right: 10 - 3 = 7. That's also the letter G. ✓",
            interactExpression: "O - F",
            interactLetterValues: { O: 15, F: 6 },
            interactOptions: ["9", "21", "8", "10", "15"],
            interactCorrectAnswer: "9",
            interactExplanation: "O=15 (EJOTY!), F=6. Left to right: 15 - 6 = 9. That's also the letter I. ✓"
          },
          {
            name: "Oliver",
            scenario: "practising subtraction letter sums",
            expression: "T - E",
            letterValues: { T: 20, E: 5 },
            calculation: "20 - 5 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "25", "10", "20", "5"],
            correctAnswer: "15",
            explanation: "T=20, E=5 (both EJOTY!). Left to right: 20 - 5 = 15. That's also O (EJOTY!). ✓",
            interactExpression: "J - B",
            interactLetterValues: { J: 10, B: 2 },
            interactOptions: ["8", "12", "6", "10", "4"],
            interactCorrectAnswer: "8",
            interactExplanation: "J=10 (EJOTY!), B=2. Left to right: 10 - 2 = 8. That's also the letter H. ✓"
          },
          {
            name: "Priya",
            scenario: "working through subtraction letter sums",
            expression: "O - D",
            letterValues: { O: 15, D: 4 },
            calculation: "15 - 4 = 11",
            answer: 11,
            answerAsLetter: "K",
            options: ["11", "19", "9", "13", "15"],
            correctAnswer: "11",
            explanation: "O=15 (EJOTY!), D=4. Left to right: 15 - 4 = 11. That's also the letter K. ✓",
            interactExpression: "T - G",
            interactLetterValues: { T: 20, G: 7 },
            interactOptions: ["13", "27", "11", "15", "7"],
            interactCorrectAnswer: "13",
            interactExplanation: "T=20 (EJOTY!), G=7. Left to right: 20 - 7 = 13. That's also the letter M. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling subtraction letter sums",
            expression: "Y - J",
            letterValues: { Y: 25, J: 10 },
            calculation: "25 - 10 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "35", "10", "20", "5"],
            correctAnswer: "15",
            explanation: "Y=25, J=10 (both EJOTY!). Left to right: 25 - 10 = 15. That's O (EJOTY!). ✓",
            interactExpression: "E - A",
            interactLetterValues: { E: 5, A: 1 },
            interactOptions: ["4", "6", "3", "5", "2"],
            interactCorrectAnswer: "4",
            interactExplanation: "E=5 (EJOTY!), A=1. Left to right: 5 - 1 = 4. That's also the letter D. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nGood news — subtraction letter sums work just like addition! Swap letters for numbers, then **subtract left to right**. Same method, different sign.\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Swap and Subtract",
            body: (v) => `Let's solve **${v.expression}**. Use EJOTY (E=5, J=10, O=15, T=20, Y=25) to find the numbers quickly, then subtract left to right.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Write numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Use EJOTY as anchor points" },
                    { text: `Subtract left to right: ${v.calculation}`, why: "Take the second number away from the first" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "Done! ✓" }
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `In subtraction letter sums, you subtract the smaller number from the bigger one`, answer: false, explanation: `No! You subtract LEFT to RIGHT, regardless of which number is bigger. The first letter's value minus the second letter's value.` },
                { text: `You can use EJOTY anchor letters to find positions faster`, answer: true, explanation: `Correct! E=5, J=10, O=15, T=20, Y=25 — count from the nearest one. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?\n\nSwap the letters, then subtract left to right.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtraction — same skill, different sign!",
            body: () => `You already know how to do this. Just follow the same three steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write the number above each letter", why: "EJOTY helps you find positions fast" },
                  { text: "2. Subtract left to right", why: "First number minus the second" },
                  { text: "3. Convert back if needed", why: "If the answer is a letter, use EJOTY to find it ✓" }
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
  // SUB-CONCEPT 3: Mixed Operations (+ and -)
  // Category: core
  // ==========================================
  {
    id: "mixed-operations",
    name: "Mixed Addition and Subtraction",
    category: "core",
    lessons: [
      {
        id: "mixed-operations-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle letter sums that mix + and - signs together",
          "Why going strictly left to right, one step at a time, keeps you on track"
        ],
        variableSets: [
          {
            name: "Noah",
            scenario: "solving a mixed letter sum",
            expression: "H + C - E",
            letterValues: { H: 8, C: 3, E: 5 },
            calculation: "8 + 3 = 11, then 11 - 5 = 6",
            answer: 6,
            answerAsLetter: "F",
            options: ["6", "8", "4", "10", "16"],
            correctAnswer: "6",
            explanation: "H=8, C=3, E=5. Left to right: 8 + 3 = 11, then 11 - 5 = 6. That's also the letter F. ✓",
            interactExpression: "J - D + B",
            interactLetterValues: { J: 10, D: 4, B: 2 },
            interactOptions: ["8", "6", "10", "4", "12"],
            interactCorrectAnswer: "8",
            interactExplanation: "J=10 (EJOTY!), D=4, B=2. Left to right: 10 - 4 = 6, then 6 + 2 = 8. That's also the letter H. ✓"
          },
          {
            name: "Grace",
            scenario: "working through mixed operation letter sums",
            expression: "O - B + A",
            letterValues: { O: 15, B: 2, A: 1 },
            calculation: "15 - 2 = 13, then 13 + 1 = 14",
            answer: 14,
            answerAsLetter: "N",
            options: ["14", "12", "16", "18", "10"],
            correctAnswer: "14",
            explanation: "O=15 (EJOTY!), B=2, A=1. Left to right: 15 - 2 = 13, then 13 + 1 = 14. That's also the letter N. ✓",
            interactExpression: "E + G - C",
            interactLetterValues: { E: 5, G: 7, C: 3 },
            interactOptions: ["9", "7", "11", "5", "13"],
            interactCorrectAnswer: "9",
            interactExplanation: "E=5 (EJOTY!), G=7, C=3. Left to right: 5 + 7 = 12, then 12 - 3 = 9. That's also the letter I. ✓"
          },
          {
            name: "Priya",
            scenario: "practising mixed letter sums",
            expression: "T - G + B",
            letterValues: { T: 20, G: 7, B: 2 },
            calculation: "20 - 7 = 13, then 13 + 2 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "11", "17", "13", "9"],
            correctAnswer: "15",
            explanation: "T=20 (EJOTY!), G=7, B=2. Left to right: 20 - 7 = 13, then 13 + 2 = 15. That's O (EJOTY!). ✓",
            interactExpression: "O + A - F",
            interactLetterValues: { O: 15, A: 1, F: 6 },
            interactOptions: ["10", "8", "12", "14", "6"],
            interactCorrectAnswer: "10",
            interactExplanation: "O=15 (EJOTY!), A=1, F=6. Left to right: 15 + 1 = 16, then 16 - 6 = 10. That's J (EJOTY!). ✓"
          },
          {
            name: "Finn",
            scenario: "tackling a tricky mixed letter sum",
            expression: "J + D - G",
            letterValues: { J: 10, D: 4, G: 7 },
            calculation: "10 + 4 = 14, then 14 - 7 = 7",
            answer: 7,
            answerAsLetter: "G",
            options: ["7", "21", "3", "11", "9"],
            correctAnswer: "7",
            explanation: "J=10 (EJOTY!), D=4, G=7. Left to right: 10 + 4 = 14, then 14 - 7 = 7. That's also the letter G. ✓",
            interactExpression: "T - H + C",
            interactLetterValues: { T: 20, H: 8, C: 3 },
            interactOptions: ["15", "9", "17", "11", "13"],
            interactCorrectAnswer: "15",
            interactExplanation: "T=20 (EJOTY!), H=8, C=3. Left to right: 20 - 8 = 12, then 12 + 3 = 15. That's O (EJOTY!). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nWhen a letter sum has **both + and -**, you must work **left to right** — do one operation at a time.\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One operation at a time",
            body: (v) => `For **${v.expression}**, there's both + and - mixed together. **Do the first operation, get a result, then move to the next**. Always left to right!`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Write numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Swap letters for numbers" },
                    { text: `Left to right: ${v.calculation}`, why: "Do the first operation, then use that answer for the next" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "Step by step gets you there ✓" }
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Swap every letter for its number using EJOTY (E=5, J=10, O=15, T=20, Y=25)`,
                `Do the first operation (+ or -) to get a result`,
                `Use that result with the next operation, still going left to right`
              ],
              feedback: {
                correct: (v) => `Perfect! Swap, then work left to right through each operation. ✓`,
                incorrect: (v) => `Not quite — swap first, then do one operation at a time, left to right!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?\n\nRemember: left to right, one operation at a time.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Mixed operations — one step at a time!",
            body: () => `When a letter sum mixes + and -, just take it steady:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write the number above each letter", why: "EJOTY for quick positioning" },
                  { text: "2. Do the FIRST operation (left pair)", why: "Get a result from the first two numbers" },
                  { text: "3. Use that result with the NEXT operation", why: "Keep going left to right until you're done ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "mixed-operations-practice",
        templateType: "step-by-step",
        learningGoal: [
          "How to tackle longer mixed letter sums without getting muddled",
          "How chaining your results left to right makes even tricky sums simple"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "practising a longer mixed letter sum",
            expression: "E + J - A - C",
            letterValues: { E: 5, J: 10, A: 1, C: 3 },
            calculation: "5 + 10 = 15, then 15 - 1 = 14, then 14 - 3 = 11",
            answer: 11,
            answerAsLetter: "K",
            options: ["11", "9", "13", "7", "15"],
            correctAnswer: "11",
            explanation: "E=5, J=10 (EJOTY!), A=1, C=3. Left to right: 5 + 10 = 15, - 1 = 14, - 3 = 11. That's K. ✓",
            interactExpression: "T - B + A - D",
            interactLetterValues: { T: 20, B: 2, A: 1, D: 4 },
            interactOptions: ["15", "13", "17", "11", "19"],
            interactCorrectAnswer: "15",
            interactExplanation: "T=20 (EJOTY!), B=2, A=1, D=4. Left to right: 20 - 2 = 18, + 1 = 19, - 4 = 15. That's O (EJOTY!). ✓"
          },
          {
            name: "Marcus",
            scenario: "working through a tricky mixed sum",
            expression: "T - F + B",
            letterValues: { T: 20, F: 6, B: 2 },
            calculation: "20 - 6 = 14, then 14 + 2 = 16",
            answer: 16,
            answerAsLetter: "P",
            options: ["16", "12", "18", "14", "20"],
            correctAnswer: "16",
            explanation: "T=20 (EJOTY!), F=6, B=2. Left to right: 20 - 6 = 14, then 14 + 2 = 16. That's P. ✓",
            interactExpression: "J + C - H",
            interactLetterValues: { J: 10, C: 3, H: 8 },
            interactOptions: ["5", "3", "7", "1", "9"],
            interactCorrectAnswer: "5",
            interactExplanation: "J=10 (EJOTY!), C=3, H=8. Left to right: 10 + 3 = 13, then 13 - 8 = 5. That's E (EJOTY!). ✓"
          },
          {
            name: "Aisha",
            scenario: "solving mixed letter sums confidently",
            expression: "O + C - H",
            letterValues: { O: 15, C: 3, H: 8 },
            calculation: "15 + 3 = 18, then 18 - 8 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "12", "8", "14", "6"],
            correctAnswer: "10",
            explanation: "O=15 (EJOTY!), C=3, H=8. Left to right: 15 + 3 = 18, then 18 - 8 = 10. That's J (EJOTY!). ✓",
            interactExpression: "E - A + G",
            interactLetterValues: { E: 5, A: 1, G: 7 },
            interactOptions: ["11", "9", "13", "7", "15"],
            interactCorrectAnswer: "11",
            interactExplanation: "E=5 (EJOTY!), A=1, G=7. Left to right: 5 - 1 = 4, then 4 + 7 = 11. That's K. ✓"
          },
          {
            name: "Charlie",
            scenario: "getting faster with mixed letter sums",
            expression: "J - A + E - B",
            letterValues: { J: 10, A: 1, E: 5, B: 2 },
            calculation: "10 - 1 = 9, then 9 + 5 = 14, then 14 - 2 = 12",
            answer: 12,
            answerAsLetter: "L",
            options: ["12", "10", "14", "8", "16"],
            correctAnswer: "12",
            explanation: "J=10, A=1, E=5, B=2. Left to right: 10 - 1 = 9, + 5 = 14, - 2 = 12. That's L. ✓",
            interactExpression: "O + B - C + A",
            interactLetterValues: { O: 15, B: 2, C: 3, A: 1 },
            interactOptions: ["15", "13", "17", "11", "19"],
            interactCorrectAnswer: "15",
            interactExplanation: "O=15 (EJOTY!), B=2, C=3, A=1. Left to right: 15 + 2 = 17, - 3 = 14, + 1 = 15. That's also O! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you solve ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis one has multiple + and - signs. Just take it **one step at a time, left to right**.\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Chain the calculations",
            body: (v) => `For **${v.expression}**, there are several operations to chain. **Chain your results**: do the first, use the result for the second, and keep going.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Write them above the letters" },
                    { text: `Chain: ${v.calculation}`, why: "Each result feeds into the next operation" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "Left to right, every time ✓" }
                  ],
                  allRevealed: false
                };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?\n\nChain your calculations left to right.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Chain your results like a pro!",
            body: () => `For multi-step sums, think of it like passing a baton — each answer feeds into the next:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Swap all letters for numbers first", why: "Don't try to do it mid-calculation" },
                  { text: "2. Do the first operation → get a result", why: "This becomes the start of your next step" },
                  { text: "3. Keep chaining left to right", why: "Result + next operation = new result ✓" }
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
  // SUB-CONCEPT 4: Order of Operations (BODMAS)
  // Category: core
  // ==========================================
  {
    id: "left-to-right-rule",
    name: "Order of Operations — BODMAS",
    category: "core",
    lessons: [
      {
        id: "left-to-right-rule-steps",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why BODMAS applies to letter sums — multiplication and division come before addition and subtraction",
          "How to spot the left-to-right trap in letter sum questions"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "checking her friend's letter sum answer",
            expression: "B + C × D",
            letterValues: { B: 2, C: 3, D: 4 },
            ltrAnswer: 20,
            ltrWorking: "Left to right: 2 + 3 = 5, then 5 × 4 = 20",
            correctWorking: "BODMAS: 3 × 4 = 12, then 2 + 12 = 14",
            answer: 14,
            answerAsLetter: "N",
            options: ["14", "20", "24", "18", "12"],
            correctAnswer: "14",
            explanation: "By BODMAS, multiply first: C × D = 3 × 4 = 12. Then add: B + 12 = 2 + 12 = 14. The left-to-right trap gives 20, which is wrong. ✓",
            interactExpression: "A + D × B",
            interactLetterValues: { A: 1, D: 4, B: 2 },
            interactLtrAnswer: 10,
            interactOptions: ["9", "10", "8", "12", "6"],
            interactCorrectAnswer: "9",
            interactExplanation: "By BODMAS, multiply first: D × B = 4 × 2 = 8. Then add: A + 8 = 1 + 8 = 9. The left-to-right trap gives 10. ✓"
          },
          {
            name: "Oliver",
            scenario: "spotting the left-to-right trap in a letter sum",
            expression: "A + D × C",
            letterValues: { A: 1, D: 4, C: 3 },
            ltrAnswer: 15,
            ltrWorking: "Left to right: 1 + 4 = 5, then 5 × 3 = 15",
            correctWorking: "BODMAS: 4 × 3 = 12, then 1 + 12 = 13",
            answer: 13,
            answerAsLetter: "M",
            options: ["13", "15", "12", "17", "9"],
            correctAnswer: "13",
            explanation: "By BODMAS, multiply first: D × C = 4 × 3 = 12. Then add: A + 12 = 1 + 12 = 13. The left-to-right trap gives 15. ✓",
            interactExpression: "C + A × E",
            interactLetterValues: { C: 3, A: 1, E: 5 },
            interactLtrAnswer: 20,
            interactOptions: ["8", "20", "15", "18", "10"],
            interactCorrectAnswer: "8",
            interactExplanation: "By BODMAS, multiply first: A × E = 1 × 5 = 5. Then add: C + 5 = 3 + 5 = 8. The left-to-right trap gives 20. ✓"
          },
          {
            name: "Priya",
            scenario: "using BODMAS in a letter sum",
            expression: "A + E × B",
            letterValues: { A: 1, E: 5, B: 2 },
            ltrAnswer: 12,
            ltrWorking: "Left to right: 1 + 5 = 6, then 6 × 2 = 12",
            correctWorking: "BODMAS: 5 × 2 = 10, then 1 + 10 = 11",
            answer: 11,
            answerAsLetter: "K",
            options: ["11", "12", "10", "15", "7"],
            correctAnswer: "11",
            explanation: "By BODMAS, multiply first: E × B = 5 × 2 = 10. Then add: A + 10 = 1 + 10 = 11. The left-to-right trap gives 12. ✓",
            interactExpression: "B + E × C",
            interactLetterValues: { B: 2, E: 5, C: 3 },
            interactLtrAnswer: 21,
            interactOptions: ["17", "21", "15", "10", "24"],
            interactCorrectAnswer: "17",
            interactExplanation: "By BODMAS, multiply first: E × C = 5 × 3 = 15. Then add: B + 15 = 2 + 15 = 17. The left-to-right trap gives 21. ✓"
          },
          {
            name: "Finn",
            scenario: "working through the trickiest letter sum trap",
            expression: "C + B × E",
            letterValues: { C: 3, B: 2, E: 5 },
            ltrAnswer: 25,
            ltrWorking: "Left to right: 3 + 2 = 5, then 5 × 5 = 25",
            correctWorking: "BODMAS: 2 × 5 = 10, then 3 + 10 = 13",
            answer: 13,
            answerAsLetter: "M",
            options: ["13", "25", "15", "20", "10"],
            correctAnswer: "13",
            explanation: "By BODMAS, multiply first: B × E = 2 × 5 = 10. Then add: C + 10 = 3 + 10 = 13. That's M. The left-to-right trap gives 25. ✓",
            interactExpression: "D + C × B",
            interactLetterValues: { D: 4, C: 3, B: 2 },
            interactLtrAnswer: 14,
            interactOptions: ["10", "14", "12", "8", "16"],
            interactCorrectAnswer: "10",
            interactExplanation: "By BODMAS, multiply first: C × B = 3 × 2 = 6. Then add: D + 6 = 4 + 6 = 10. That's J (EJOTY!). The left-to-right trap gives 14. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is ${v.ltrAnswer} the right answer?`,
            body: (v) => `${v.name} is ${v.scenario}. The line says **${v.expression}**, with ${Object.entries(v.letterValues).map(([l, n]) => `${l} = ${n}`).join(', ')}.\n\nMost people read left to right, so their brain wants to go: ${v.ltrWorking} — that gives ${v.ltrAnswer}. It feels right… but it isn't. Maths has a special running order called **BODMAS**: **B**rackets, **O**rders (powers like squares), **D**ivision and **M**ultiplication, then **A**ddition and **S**ubtraction. × and ÷ always jump the queue ahead of + and −, no matter where they sit in the line.\n\nSo if you spot a × hiding inside a + sum, it gets done first. What do you reckon the real answer is — and where exactly does left-to-right reading go wrong?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "BODMAS applies here!",
            body: (v) => `Someone said **${v.expression} = ${v.ltrAnswer}** by working left to right. But that's **wrong** when × or ÷ are mixed with + or −!\n\nJust like in maths class, **BODMAS** tells you to do **multiplication and division first**, then addition and subtraction.\n\nThis is the **number one trap** in letter sum questions!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG (left to right): ${v.ltrWorking} = ${v.ltrAnswer}`, why: "Going straight left to right ignores the order of operations!" },
                  { text: `RIGHT (BODMAS): ${v.correctWorking} = ${v.answer}`, why: "Multiply or divide first, THEN add or subtract" },
                  { text: `The correct answer is ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "BODMAS saves the day! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `When a letter sum has × or ÷ mixed with + or −, you should use BODMAS`, answer: true, explanation: `Correct! Multiply and divide first, then add and subtract. ✓` },
                { text: `In letter sums, you always work strictly left to right no matter what`, answer: false, explanation: `Not quite! Left to right works for + and − only. When × or ÷ appear, use BODMAS — multiply and divide first.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — use BODMAS!",
            body: (v) => `What is **${v.interactExpression}**?\n\n**Remember: multiply first, then add or subtract!**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The Left-to-Right Trap — you'll never fall for it again!",
            body: () => `This is the **biggest trap** in letter sums, and now you know how to beat it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Only + and −? Work left to right", why: "Same-level operations go in order" },
                  { text: "See × or ÷ mixed in? Use BODMAS!", why: "Multiply and divide first, then add and subtract" },
                  { text: "B + C × D = 2 + (3 × 4) = 2 + 12 = 14, NOT (2+3) × 4 = 20", why: "The left-to-right answer is always there as a trap option! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "left-to-right-rule-practice",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when BODMAS matters in letter sums",
          "How to make BODMAS your automatic habit — so the trap never catches you"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "carefully applying BODMAS",
            expression: "D + A × F",
            letterValues: { D: 4, A: 1, F: 6 },
            calculation: "A × F = 1 × 6 = 6, then D + 6 = 4 + 6 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "30", "24", "6", "36"],
            correctAnswer: "10",
            explanation: "By BODMAS, multiply first: A × F = 1 × 6 = 6. Then add: D + 6 = 4 + 6 = 10. That's J (EJOTY!). The left-to-right trap gives 30. ✓",
            interactExpression: "B + C × E",
            interactLetterValues: { B: 2, C: 3, E: 5 },
            interactLtrAnswer: 25,
            interactOptions: ["17", "25", "15", "20", "30"],
            interactCorrectAnswer: "17",
            interactExplanation: "By BODMAS, multiply first: C × E = 3 × 5 = 15. Then add: B + 15 = 2 + 15 = 17. The left-to-right trap gives 25. ✓"
          },
          {
            name: "Marcus",
            scenario: "practising the BODMAS rule",
            expression: "A + B × C",
            letterValues: { A: 1, B: 2, C: 3 },
            calculation: "B × C = 2 × 3 = 6, then A + 6 = 1 + 6 = 7",
            answer: 7,
            answerAsLetter: "G",
            options: ["7", "9", "6", "3", "12"],
            correctAnswer: "7",
            explanation: "By BODMAS, multiply first: B × C = 2 × 3 = 6. Then add: A + 6 = 1 + 6 = 7. That's G. The left-to-right trap gives 9. ✓",
            interactExpression: "C + B × D",
            interactLetterValues: { C: 3, B: 2, D: 4 },
            interactLtrAnswer: 20,
            interactOptions: ["11", "20", "14", "8", "24"],
            interactCorrectAnswer: "11",
            interactExplanation: "By BODMAS, multiply first: B × D = 2 × 4 = 8. Then add: C + 8 = 3 + 8 = 11. That's K. The left-to-right trap gives 20. ✓"
          },
          {
            name: "Aisha",
            scenario: "spotting the trap answer",
            expression: "E - A × C",
            letterValues: { E: 5, A: 1, C: 3 },
            calculation: "A × C = 1 × 3 = 3, then E - 3 = 5 - 3 = 2",
            answer: 2,
            answerAsLetter: "B",
            options: ["2", "12", "15", "8", "3"],
            correctAnswer: "2",
            explanation: "By BODMAS, multiply first: A × C = 1 × 3 = 3. Then subtract: E - 3 = 5 - 3 = 2. That's B. The left-to-right trap gives 12. ✓",
            interactExpression: "D - B × C",
            interactLetterValues: { D: 4, B: 2, C: 3 },
            interactLtrAnswer: 6,
            interactOptions: ["-2", "6", "2", "10", "4"],
            interactCorrectAnswer: "-2",
            interactExplanation: "By BODMAS, multiply first: B × C = 2 × 3 = 6. Then subtract: D - 6 = 4 - 6 = -2. Be careful — the answer can be negative! The left-to-right trap gives 6. ✓"
          },
          {
            name: "Charlie",
            scenario: "beating the left-to-right trap once and for all",
            expression: "C + D × B",
            letterValues: { C: 3, D: 4, B: 2 },
            calculation: "D × B = 4 × 2 = 8, then C + 8 = 3 + 8 = 11",
            answer: 11,
            answerAsLetter: "K",
            options: ["11", "14", "10", "8", "16"],
            correctAnswer: "11",
            explanation: "By BODMAS, multiply first: D × B = 4 × 2 = 8. Then add: C + 8 = 3 + 8 = 11. That's K. The left-to-right trap gives 14. ✓",
            interactExpression: "A + E × B",
            interactLetterValues: { A: 1, E: 5, B: 2 },
            interactLtrAnswer: 12,
            interactOptions: ["11", "12", "7", "15", "10"],
            interactCorrectAnswer: "11",
            interactExplanation: "By BODMAS, multiply first: E × B = 5 × 2 = 10. Then add: A + 10 = 1 + 10 = 11. That's K. The left-to-right trap gives 12. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Don't fall for the trap!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.expression} = ???**\n\nThis has × mixed with + or −. Remember: **use BODMAS** — do the multiplication first!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "BODMAS — multiply first!",
            body: (v) => `For **${v.expression}**, spot the × sign — that means **multiply first** before adding or subtracting. The left-to-right answer will be there as a trap option!`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Swap letters for numbers" },
                    { text: `BODMAS: ${v.calculation}`, why: "Multiply first, then add or subtract" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "The left-to-right trap answer is always in the options — don't pick it! ✓" }
                  ],
                  allRevealed: false
                };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — BODMAS!",
            body: (v) => `What is **${v.interactExpression}**?\n\n**Remember: multiply first, then add or subtract!**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Left-to-right trap? Not any more!",
            body: () => `You've learned to spot and dodge this trap. Here's your reminder:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. See × or ÷ mixed with + or −? Use BODMAS!", why: "Multiply and divide come before adding and subtracting" },
                  { text: "2. Do the × or ÷ first, then the + or −", why: "Even if the × isn't the first thing in the expression" },
                  { text: "3. The left-to-right answer is a trap option", why: "If you see it in the choices, DON'T pick it! ✓" }
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
  // SUB-CONCEPT 5: Multiply Operations
  // Category: supporting
  // ==========================================
  {
    id: "multiply-operations",
    name: "Letter Sums with Multiplication",
    category: "supporting",
    lessons: [
      {
        id: "multiply-operations-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle multiplication in letter sums — times tables to the rescue!",
          "How to handle multiplication in letter sums step by step"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving a multiplication letter sum",
            expression: "C × D",
            letterValues: { C: 3, D: 4 },
            calculation: "3 × 4 = 12",
            answer: 12,
            answerAsLetter: "L",
            options: ["12", "7", "1", "16", "8"],
            correctAnswer: "12",
            explanation: "C=3, D=4. Left to right: 3 × 4 = 12. That's also the letter L. ✓",
            interactExpression: "B × H",
            interactLetterValues: { B: 2, H: 8 },
            interactOptions: ["16", "10", "6", "18", "14"],
            interactCorrectAnswer: "16",
            interactExplanation: "B=2, H=8. Left to right: 2 × 8 = 16. That's also the letter P. ✓"
          },
          {
            name: "Oliver",
            scenario: "working through multiplication letter sums",
            expression: "B × G",
            letterValues: { B: 2, G: 7 },
            calculation: "2 × 7 = 14",
            answer: 14,
            answerAsLetter: "N",
            options: ["14", "9", "5", "16", "12"],
            correctAnswer: "14",
            explanation: "B=2, G=7. Left to right: 2 × 7 = 14. That's also the letter N. ✓",
            interactExpression: "C × F",
            interactLetterValues: { C: 3, F: 6 },
            interactOptions: ["18", "9", "3", "21", "15"],
            interactCorrectAnswer: "18",
            interactExplanation: "C=3, F=6. Left to right: 3 × 6 = 18. That's also the letter R. ✓"
          },
          {
            name: "Priya",
            scenario: "tackling a multiplication letter sum",
            expression: "A × E × B",
            letterValues: { A: 1, E: 5, B: 2 },
            calculation: "1 × 5 = 5, then 5 × 2 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "8", "7", "15", "12"],
            correctAnswer: "10",
            explanation: "A=1, E=5 (EJOTY!), B=2. Left to right: 1 × 5 = 5, then 5 × 2 = 10. That's J (EJOTY!). ✓",
            interactExpression: "B × C × D",
            interactLetterValues: { B: 2, C: 3, D: 4 },
            interactOptions: ["24", "20", "9", "14", "18"],
            interactCorrectAnswer: "24",
            interactExplanation: "B=2, C=3, D=4. Left to right: 2 × 3 = 6, then 6 × 4 = 24. That's also the letter X. ✓"
          },
          {
            name: "Finn",
            scenario: "solving a multiplication letter sum at speed",
            expression: "D × E",
            letterValues: { D: 4, E: 5 },
            calculation: "4 × 5 = 20",
            answer: 20,
            answerAsLetter: "T",
            options: ["20", "9", "25", "15", "24"],
            correctAnswer: "20",
            explanation: "D=4, E=5 (EJOTY!). Left to right: 4 × 5 = 20. That's T (EJOTY!). ✓",
            interactExpression: "C × E",
            interactLetterValues: { C: 3, E: 5 },
            interactOptions: ["15", "8", "20", "10", "18"],
            interactCorrectAnswer: "15",
            interactExplanation: "C=3, E=5 (EJOTY!). Left to right: 3 × 5 = 15. That's O (EJOTY!). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSome letter sums use **multiplication (×)**. The rule is the same: swap letters for numbers, then work **left to right**.\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply left to right",
            body: (v) => `Let's solve **${v.expression}**. For pure multiplication, just swap letters for numbers and multiply step by step.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Write numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "EJOTY (E=5, J=10, O=15, T=20, Y=25) helps find numbers fast" },
                    { text: `Multiply left to right: ${v.calculation}`, why: "Use your times tables!" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "Convert back if the question asks for a letter ✓" }
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To solve a multiplication letter sum, first ____ the letters for numbers, then ____`,
              options: (v) => ["swap, multiply", "add, swap", "multiply, swap", "swap, add"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Swap letters for numbers, then multiply. Simple! ✓`,
                incorrect: (v) => `Not quite — first swap letters for their number values, then multiply!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactExpression}**?\n\nRemember: left to right, even with multiplication.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactExpression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiplication — same rules, you've got this!",
            body: () => `Multiplication letter sums follow the exact same pattern you already know:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Swap letters for numbers", why: "Use EJOTY for speed" },
                  { text: "2. Multiply step by step", why: "Use your times tables!" },
                  { text: "3. If × is mixed with + or −, use BODMAS!", why: "Multiply first, then add or subtract ✓" }
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
  // SUB-CONCEPT 6: Convert Back to a Letter
  // Category: supporting
  // ==========================================
  {
    id: "convert-back",
    name: "Converting Numbers Back to Letters",
    category: "supporting",
    lessons: [
      {
        id: "convert-back-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to turn your number answer back into a letter — the final piece of the puzzle!",
          "How EJOTY makes finding any letter from its number super quick"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving a letter sum where the answer is a letter",
            expression: "F + D",
            letterValues: { F: 6, D: 4 },
            calculation: "6 + 4 = 10",
            answer: 10,
            answerAsLetter: "J",
            ejotyHint: "10 = J (EJOTY!)",
            options: ["J", "K", "I", "H", "L"],
            correctAnswer: "J",
            explanation: "F=6, D=4. Left to right: 6 + 4 = 10. Convert: 10 = J (from EJOTY — J is the 10th letter). ✓",
            interactExpression: "G + H",
            interactLetterValues: { G: 7, H: 8 },
            interactAnswer: 15,
            interactOptions: ["O", "N", "P", "M", "Q"],
            interactCorrectAnswer: "O",
            interactExplanation: "G=7, H=8. Left to right: 7 + 8 = 15. Convert: 15 = O (from EJOTY — O is the 15th letter). ✓"
          },
          {
            name: "Oliver",
            scenario: "finding the letter answer to a sum",
            expression: "H + G",
            letterValues: { H: 8, G: 7 },
            calculation: "8 + 7 = 15",
            answer: 15,
            answerAsLetter: "O",
            ejotyHint: "15 = O (EJOTY!)",
            options: ["O", "N", "P", "M", "Q"],
            correctAnswer: "O",
            explanation: "H=8, G=7. Left to right: 8 + 7 = 15. Convert: 15 = O (from EJOTY — O is the 15th letter). ✓",
            interactExpression: "I + A",
            interactLetterValues: { I: 9, A: 1 },
            interactAnswer: 10,
            interactOptions: ["J", "I", "K", "H", "L"],
            interactCorrectAnswer: "J",
            interactExplanation: "I=9, A=1. Left to right: 9 + 1 = 10. Convert: 10 = J (from EJOTY — J is the 10th letter). ✓"
          },
          {
            name: "Priya",
            scenario: "converting her number answer to a letter",
            expression: "J + F",
            letterValues: { J: 10, F: 6 },
            calculation: "10 + 6 = 16",
            answer: 16,
            answerAsLetter: "P",
            ejotyHint: "O=15, so 16 = P (one after O)",
            options: ["P", "O", "Q", "N", "R"],
            correctAnswer: "P",
            explanation: "J=10, F=6. Left to right: 10 + 6 = 16. Convert: O=15 (EJOTY), so 16 = P (one after O). ✓",
            interactExpression: "E + H",
            interactLetterValues: { E: 5, H: 8 },
            interactAnswer: 13,
            interactOptions: ["M", "L", "N", "K", "O"],
            interactCorrectAnswer: "M",
            interactExplanation: "E=5 (EJOTY!), H=8. Left to right: 5 + 8 = 13. Convert: J=10 (EJOTY), count forward 3 to get M=13. ✓"
          },
          {
            name: "Finn",
            scenario: "working out which letter a number gives",
            expression: "T + C",
            letterValues: { T: 20, C: 3 },
            calculation: "20 + 3 = 23",
            answer: 23,
            answerAsLetter: "W",
            ejotyHint: "Y=25, so count back: 24=X, 23=W",
            options: ["W", "V", "X", "U", "Y"],
            correctAnswer: "W",
            explanation: "T=20, C=3. Left to right: 20 + 3 = 23. Convert: Y=25 (EJOTY), count back 2 to get W=23. ✓",
            interactExpression: "J + I",
            interactLetterValues: { J: 10, I: 9 },
            interactAnswer: 19,
            interactOptions: ["S", "R", "T", "Q", "U"],
            interactCorrectAnswer: "S",
            interactExplanation: "J=10 (EJOTY!), I=9. Left to right: 10 + 9 = 19. Convert: T=20 (EJOTY), count back 1 to get S=19. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.expression} = which LETTER?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a fun twist — sometimes the question wants the answer **as a letter**, not a number! You work out the number first, then convert it back using EJOTY.\n\n**${v.expression} = ?** (Give the letter!)`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Number → Letter using EJOTY",
            body: (v) => `For **${v.expression}**, we first calculate the number, then convert it back to a letter. Use EJOTY (E=5, J=10, O=15, T=20, Y=25) to convert back.\n\nFind the nearest EJOTY letter and count up or down.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Calculate: ${v.calculation}`, why: "First get the number answer" },
                  { text: `Find nearest EJOTY: ${v.ejotyHint}`, why: "EJOTY letters are your anchor points" },
                  { text: `Answer: ${v.answer} = ${v.answerAsLetter}`, why: "Number → letter — done! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What letter does **${v.expression}** give you?\n\nCalculate the number, then convert to a letter using EJOTY.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Number to letter — easy with EJOTY!",
            body: () => `Converting numbers back to letters is a doddle once you know the trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Calculate the number answer first", why: "Swap and calculate as normal" },
                  { text: "2. Find the nearest EJOTY letter", why: "E=5, J=10, O=15, T=20, Y=25" },
                  { text: "3. Count up or down from EJOTY", why: "e.g. 16 → O=15 + 1 → P ✓" }
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
  // SUB-CONCEPT 7: EJOTY Shortcuts
  // Category: supporting
  // ==========================================
  {
    id: "ejoty-shortcuts",
    name: "EJOTY — Quick Letter Positioning",
    category: "supporting",
    lessons: [
      {
        id: "ejoty-shortcuts-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use EJOTY (E=5, J=10, O=15, T=20, Y=25) as your speed hack for any letter",
          "How counting from the nearest EJOTY letter saves you loads of time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "using EJOTY to find letter positions quickly",
            targetLetter: "H",
            targetValue: 8,
            nearestEjoty: "J=10",
            countDirection: "back",
            countSteps: "J=10, I=9, H=8",
            expression: "H + D",
            letterValues: { H: 8, D: 4 },
            calculation: "8 + 4 = 12",
            answer: 12,
            answerAsLetter: "L",
            options: ["12", "10", "14", "8", "16"],
            correctAnswer: "12",
            explanation: "H=8 (J=10, count back 2), D=4. Left to right: 8 + 4 = 12. That's L. ✓"
          },
          {
            name: "Oliver",
            scenario: "using EJOTY shortcuts for speed",
            targetLetter: "R",
            targetValue: 18,
            nearestEjoty: "T=20",
            countDirection: "back",
            countSteps: "T=20, S=19, R=18",
            expression: "R - E",
            letterValues: { R: 18, E: 5 },
            calculation: "18 - 5 = 13",
            answer: 13,
            answerAsLetter: "M",
            options: ["13", "23", "15", "11", "18"],
            correctAnswer: "13",
            explanation: "R=18 (T=20, count back 2), E=5 (EJOTY!). Left to right: 18 - 5 = 13. That's M. ✓"
          },
          {
            name: "Priya",
            scenario: "practising EJOTY counting",
            targetLetter: "G",
            targetValue: 7,
            nearestEjoty: "E=5",
            countDirection: "forward",
            countSteps: "E=5, F=6, G=7",
            expression: "G + C",
            letterValues: { G: 7, C: 3 },
            calculation: "7 + 3 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "4", "12", "8", "14"],
            correctAnswer: "10",
            explanation: "G=7 (E=5, count forward 2), C=3. Left to right: 7 + 3 = 10. That's J (EJOTY!). ✓"
          },
          {
            name: "Finn",
            scenario: "finding letter positions at lightning speed",
            targetLetter: "N",
            targetValue: 14,
            nearestEjoty: "O=15",
            countDirection: "back",
            countSteps: "O=15, N=14",
            expression: "N + A",
            letterValues: { N: 14, A: 1 },
            calculation: "14 + 1 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "13", "17", "11", "19"],
            correctAnswer: "15",
            explanation: "N=14 (O=15, count back 1), A=1. Left to right: 14 + 1 = 15. That's O (EJOTY!). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What number is the letter ${v.targetLetter}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nCounting A, B, C, D... all the way to ${v.targetLetter} would take ages! But here's a brilliant shortcut: use **EJOTY** (E=5, J=10, O=15, T=20, Y=25) as anchor points.\n\nJust find the nearest one and count from there — so much faster!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count from the nearest EJOTY",
            body: (v) => `To find **${v.targetLetter}**, start at the nearest EJOTY letter (**${v.nearestEjoty}**) and count **${v.countDirection}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Nearest EJOTY: ${v.nearestEjoty}`, why: "Every 5th letter is an EJOTY anchor" },
                  { text: `Count ${v.countDirection}: ${v.countSteps}`, why: `${v.targetLetter} = ${v.targetValue}` },
                  { text: `Now solve: ${v.expression} = ${v.calculation}`, why: `Answer: ${v.answer}${v.answerAsLetter ? ` (= ${v.answerAsLetter})` : ''} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "E", right: "5" },
                { left: "J", right: "10" },
                { left: "O", right: "15" },
                { left: "T", right: "20" },
                { left: "Y", right: "25" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.expression}**?\n\nUse EJOTY to find the letter positions quickly!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "EJOTY — your secret weapon!",
            body: () => `EJOTY gives you 5 anchor points in the alphabet:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "E=5, J=10, O=15, T=20, Y=25", why: "Memorise these — they're always the same!" },
                  { text: "Find the nearest anchor, count up or down", why: "H? J=10, count back 2 → H=8" },
                  { text: "Works for converting back too!", why: "Got 18? T=20, count back 2 → R ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "ejoty-shortcuts-practice",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle letters that sit between two EJOTY anchors",
          "How to get lightning-fast at converting letters to numbers"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "finding a letter that's between two EJOTY points",
            targetLetter: "L",
            targetValue: 12,
            nearestEjoty: "J=10",
            countDirection: "forward",
            countSteps: "J=10, K=11, L=12",
            expression: "L + C",
            letterValues: { L: 12, C: 3 },
            calculation: "12 + 3 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "13", "17", "9", "21"],
            correctAnswer: "15",
            explanation: "L=12 (J=10, count forward 2), C=3. Left to right: 12 + 3 = 15. That's O (EJOTY!). ✓"
          },
          {
            name: "Marcus",
            scenario: "using EJOTY with higher letters",
            targetLetter: "V",
            targetValue: 22,
            nearestEjoty: "Y=25",
            countDirection: "back",
            countSteps: "Y=25, X=24, W=23, V=22",
            expression: "V - B",
            letterValues: { V: 22, B: 2 },
            calculation: "22 - 2 = 20",
            answer: 20,
            answerAsLetter: "T",
            options: ["20", "24", "18", "22", "16"],
            correctAnswer: "20",
            explanation: "V=22 (Y=25, count back 3), B=2. Left to right: 22 - 2 = 20. That's T (EJOTY!). ✓"
          },
          {
            name: "Aisha",
            scenario: "getting faster at EJOTY positioning",
            targetLetter: "S",
            targetValue: 19,
            nearestEjoty: "T=20",
            countDirection: "back",
            countSteps: "T=20, S=19",
            expression: "S - D",
            letterValues: { S: 19, D: 4 },
            calculation: "19 - 4 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "23", "13", "17", "11"],
            correctAnswer: "15",
            explanation: "S=19 (T=20, count back 1), D=4. Left to right: 19 - 4 = 15. That's O (EJOTY!). ✓"
          },
          {
            name: "Charlie",
            scenario: "practising EJOTY with tricky letters",
            targetLetter: "M",
            targetValue: 13,
            nearestEjoty: "J=10 or O=15",
            countDirection: "forward from J",
            countSteps: "J=10, K=11, L=12, M=13",
            expression: "M + B",
            letterValues: { M: 13, B: 2 },
            calculation: "13 + 2 = 15",
            answer: 15,
            answerAsLetter: "O",
            options: ["15", "11", "17", "13", "19"],
            correctAnswer: "15",
            explanation: "M=13 (J=10, count forward 3), B=2. Left to right: 13 + 2 = 15. That's O (EJOTY!). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How fast can you find ${v.targetLetter}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe letter **${v.targetLetter}** — which EJOTY (E=5, J=10, O=15, T=20, Y=25) anchor is nearest?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count from the anchor",
            body: (v) => `Start at **${v.nearestEjoty}** and count **${v.countDirection}** to reach **${v.targetLetter}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Nearest EJOTY: ${v.nearestEjoty}`, why: "Pick the closest anchor" },
                  { text: `Count: ${v.countSteps}`, why: `So ${v.targetLetter} = ${v.targetValue}` },
                  { text: `Now solve: ${v.expression} = ${v.calculation}`, why: `${v.answer}${v.answerAsLetter ? ` = ${v.answerAsLetter}` : ''} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.expression}**?\n\nUse EJOTY to find ${v.targetLetter}'s value, then calculate.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "EJOTY master — that's you!",
            body: () => `With practice, you'll find letter positions in seconds. Here are your cheat notes:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Letters near E(5): A=1, B=2, C=3, D=4, F=6, G=7", why: "Count from E for these" },
                  { text: "Letters near J(10) or O(15): H, I, K, L, M, N", why: "Count from J or O — whichever is closer" },
                  { text: "Letters near T(20) or Y(25): R, S, U, V, W, X, Z", why: "Z=26 is just 1 after Y! ✓" }
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
  // SUB-CONCEPT 8: Larger Numbers (Later Alphabet)
  // Category: other
  // ==========================================
  {
    id: "larger-numbers",
    name: "Working with Bigger Letter Values",
    category: "other",
    lessons: [
      {
        id: "larger-numbers-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle the bigger numbers that come with letters near the end of the alphabet",
          "How to stay accurate when the numbers get larger — slow and steady!"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working with big letter values",
            expression: "W + X",
            letterValues: { W: 23, X: 24 },
            calculation: "23 + 24 = 47",
            answer: 47,
            answerAsLetter: null,
            options: ["47", "45", "49", "43", "51"],
            correctAnswer: "47",
            explanation: "W=23 (Y=25, count back 2), X=24 (Y=25, count back 1). Left to right: 23 + 24 = 47. ✓"
          },
          {
            name: "Oliver",
            scenario: "tackling letter sums with large values",
            expression: "Z - V",
            letterValues: { Z: 26, V: 22 },
            calculation: "26 - 22 = 4",
            answer: 4,
            answerAsLetter: "D",
            options: ["4", "48", "2", "6", "8"],
            correctAnswer: "4",
            explanation: "Z=26 (Y=25 + 1), V=22 (Y=25, count back 3). Left to right: 26 - 22 = 4. That's D. ✓"
          },
          {
            name: "Priya",
            scenario: "calculating with letters near the end of the alphabet",
            expression: "U + S",
            letterValues: { U: 21, S: 19 },
            calculation: "21 + 19 = 40",
            answer: 40,
            answerAsLetter: null,
            options: ["40", "38", "42", "36", "44"],
            correctAnswer: "40",
            explanation: "U=21 (T=20 + 1), S=19 (T=20 - 1). Left to right: 21 + 19 = 40. ✓"
          },
          {
            name: "Finn",
            scenario: "handling the biggest letter values",
            expression: "Y - T + E",
            letterValues: { Y: 25, T: 20, E: 5 },
            calculation: "25 - 20 = 5, then 5 + 5 = 10",
            answer: 10,
            answerAsLetter: "J",
            options: ["10", "0", "20", "15", "5"],
            correctAnswer: "10",
            explanation: "Y=25, T=20, E=5 (all EJOTY!). Left to right: 25 - 20 = 5, then 5 + 5 = 10. That's J (EJOTY!). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLetters near the end of the alphabet have **big numbers**: T=20, U=21, V=22, W=23, X=24, Y=25, Z=26.\n\nUse EJOTY (E=5, J=10, O=15, T=20, Y=25) anchors to find them quickly!\n\n**${v.expression} = ???**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Big letters, same method",
            body: (v) => `For **${v.expression}**, we're working with big letter values. The method is exactly the same — just take extra care with the arithmetic because the numbers are larger!\n\nUse **T=20** and **Y=25** as your anchors.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const letters = Object.keys(v.letterValues);
                return {
                  steps: [
                    { text: `Numbers: ${letters.map(l => `${l}=${v.letterValues[l]}`).join(', ')}`, why: "Use T=20 and Y=25 to find these quickly" },
                    { text: `Calculate left to right: ${v.calculation}`, why: "Same method — just bigger numbers" },
                    { text: `Answer: ${v.answer}${v.answerAsLetter ? ` (= letter ${v.answerAsLetter})` : ''}`, why: "Take your time with the arithmetic ✓" }
                  ],
                  allRevealed: false
                };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.expression}**?\n\nRemember: T=20, Y=25 — count from there for end-of-alphabet letters.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.expression.replace(/[^A-Z]/g, '').split('').map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Big letters, no problem!",
            body: () => `Letters near the end of the alphabet just need a bit more care. You've got this:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "T=20, U=21, V=22, W=23, X=24, Y=25, Z=26", why: "Know these — they come up a LOT" },
                  { text: "Use T=20 and Y=25 as anchors", why: "Count forward from T or backward from Y" },
                  { text: "Take extra care with bigger numbers", why: "Write your working down to avoid mistakes ✓" }
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

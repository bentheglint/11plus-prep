// ============================================================
// Supplementary sub-concepts for Algebra
// To merge: add these to lessonBank.algebra.subConcepts array in lessonData.js
// ============================================================
import { generateDistractors } from '../lessonData.js';

export const algebraSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: using-letters
  // Using letters to represent unknown numbers
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "using-letters",
    name: "Using Letters for Unknowns",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "using-letters-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to understand that letters stand in for unknown numbers",
          "How to write simple expressions (calculations with letters and numbers) using letters"
        ],
        variableSets: [
          {
            name: "Mrs Patel",
            scenario: "has a bag of sweets. She doesn't know how many are inside. She calls the number of sweets",
            letter: "n",
            addsNum: 5,
            expression: "n + 5",
            contextPhrase: "She adds 5 more sweets to the bag",
            testValue: 8,
            testResult: 13,
            unit: "sweets",
            interactTestValue: 12,
            interactTestResult: 17
          },
          {
            name: "Dad",
            scenario: "buys some apples at the market. He doesn't know the price of one apple. He calls the price",
            letter: "p",
            addsNum: 3,
            expression: "p + 3",
            contextPhrase: "He also pays £3 for a bag to carry them",
            testValue: 4,
            testResult: 7,
            unit: "pounds",
            interactTestValue: 9,
            interactTestResult: 12
          },
          {
            name: "Sophie",
            scenario: "collects stickers. She has some in her album but doesn't know how many. She calls the number",
            letter: "s",
            addsNum: 10,
            expression: "s + 10",
            contextPhrase: "Her friend gives her 10 more stickers",
            testValue: 15,
            testResult: 25,
            unit: "stickers",
            interactTestValue: 20,
            interactTestResult: 30
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is "${v.letter}"?`,
            body: (v) => `${v.name} ${v.scenario} **${v.letter}**.\n\nA letter is just a placeholder — it stands for a number we **don't know yet**. We use it to write maths even when the number is missing!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.letter} = the unknown number`, why: "We don't know it yet — that's OK!" },
                  { text: `${v.contextPhrase}`, why: "Now we can write an expression" },
                  { text: `Total: ${v.expression}`, result: "A letter + a number = an expression" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Letters are number placeholders",
            body: (v) => `The expression **${v.expression}** (a maths phrase using letters and numbers) means "take the unknown number (${v.letter}) and add ${v.addsNum}".\n\nIf we later find out that **${v.letter} = ${v.testValue}**, we can do **substitution** (replacing a letter with its number) to work it out:\n**${v.testValue} + ${v.addsNum} = ${v.testResult}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Expression: ${v.expression}`, why: `${v.letter} is the mystery number` },
                  { text: `If ${v.letter} = ${v.testValue}`, why: "Now we know the value!" },
                  { text: `${v.testValue} + ${v.addsNum} = ${v.testResult}`, result: `${v.testResult} ${v.unit}` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `You know that **${v.letter} = ${v.interactTestValue}**. Replace the letter with the number, then work it out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.expression}`, why: `Replace ${v.letter} with ${v.interactTestValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `If ${v.letter} = ${v.interactTestValue}, what is ${v.expression}?`,
              getOptions: (v) => generateDistractors(v.interactTestResult),
              correctAnswer: (v) => v.interactTestResult,
              feedback: {
                correct: (v) => `Brilliant! Replace ${v.letter} with ${v.interactTestValue}: ${v.interactTestValue} + ${v.addsNum} = **${v.interactTestResult}**! ✓`,
                incorrect: (v) => `Not quite! ${v.letter} = ${v.interactTestValue}, so ${v.expression} = ${v.interactTestValue} + ${v.addsNum} = **${v.interactTestResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Letters = unknown numbers!",
            body: () => `In algebra, a letter is just a **placeholder** for a number we don't know yet.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A letter stands for an unknown number", why: "n, x, p — any letter works" },
                  { text: "An expression uses letters and numbers", why: "e.g. n + 5, 3p, x − 2" },
                  { text: "When you know the value, replace the letter!", why: "That's called substitution (replacing a letter with a number) ✓" }
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
        id: "using-letters-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why 6p means 6 × p, not 6 + p",
          "How to avoid the 'letters as labels' trap"
        ],
        variableSets: [
          {
            name: "Tom",
            expression: "6p",
            meansWrong: "6 + p",
            meansCorrect: "6 × p",
            testValue: 4,
            wrongResult: 10,
            correctResult: 24,
            mistake: "thought 6p means '6 plus p' but it really means '6 times p'",
            interactTestValue: 6,
            interactCorrectResult: 36
          },
          {
            name: "Mia",
            expression: "3n",
            meansWrong: "3 + n",
            meansCorrect: "3 × n",
            testValue: 5,
            wrongResult: 8,
            correctResult: 15,
            mistake: "read 3n as '3 and n' (addition) instead of '3 times n'",
            interactTestValue: 8,
            interactCorrectResult: 24
          },
          {
            name: "Alfie",
            expression: "5x",
            meansWrong: "5 + x",
            meansCorrect: "5 × x",
            testValue: 7,
            wrongResult: 12,
            correctResult: 35,
            mistake: "confused 5x (multiplication) with 5 + x (addition)",
            interactTestValue: 9,
            interactCorrectResult: 45
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.expression} mean?`,
            body: (v) => `${v.name} says **${v.expression}** means **${v.meansWrong}**.\n\nIs that right? Let's check!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s claim: ${v.expression} means ${v.meansWrong}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "It means MULTIPLY!",
            body: (v) => `${v.name} ${v.mistake}.\n\nIn algebra, when a number is written **next to** a letter with no sign, it means **multiplication**.\n\n**${v.expression} = ${v.meansCorrect}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.expression} = ${v.meansWrong}`, why: "This is the common mistake" },
                  { text: `RIGHT: ${v.expression} = ${v.meansCorrect}`, result: "Number next to letter = multiply!" },
                  { text: `If p = ${v.testValue}: ${v.meansCorrect.replace(/[a-z]/g, v.testValue)} = ${v.correctResult}`, result: `Not ${v.wrongResult}!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `In algebra, 3n means "3 × n"`, answer: true, explanation: "Correct — a number next to a letter always means multiply. ✓" },
                { text: `5p means the two-digit number "5p" (like fifty-something)`, answer: false, explanation: "5p means 5 × p — it's multiplication, not a two-digit number!" }
              ]
            }
          },
          {
            type: "interact",
            title: (v) => `If the letter = ${v.interactTestValue}, what is ${v.expression}?`,
            body: (v) => `Remember: **${v.expression}** means **${v.meansCorrect}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.expression} = ${v.meansCorrect}` },
                  { text: `The letter = ${v.interactTestValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.expression} when the letter = ${v.interactTestValue}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectResult),
              correctAnswer: (v) => v.interactCorrectResult,
              feedback: {
                correct: (v) => `Superstar! ${v.expression} = ${v.meansCorrect.split('×')[0].trim()} × ${v.interactTestValue} = **${v.interactCorrectResult}**. Number next to letter = multiply! ✓`,
                incorrect: (v) => `Not quite! ${v.expression} means multiply: ${v.meansCorrect.split('×')[0].trim()} × ${v.interactTestValue} = **${v.interactCorrectResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The golden rule of algebra notation!",
            body: () => `When a number is written right next to a letter, it means **multiply**. Never add!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "6p means 6 × p, NOT 6 + p", why: "Number next to letter = multiplication" },
                  { text: "3n means 3 × n", why: "Three lots of n" },
                  { text: "If you want addition, you write + explicitly", why: "e.g. p + 6 means add ✓" }
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
  // SUB-CONCEPT 2: substitution
  // Substituting values into expressions
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "substitution",
    name: "Substituting Values",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "substitution-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to replace a letter with a number",
          "How to evaluate (work out the value of) an expression after substituting (putting a number in place of the letter)"
        ],
        variableSets: [
          {
            name: "Mrs Clarke",
            expression: "3x + 4",
            letter: "x",
            value: 5,
            step1: "3 × 5 + 4",
            step2: "15 + 4",
            answer: 19,
            scenario: "working out the total cost of concert tickets",
            interactValue: 7,
            interactStep1: "3 × 7 + 4",
            interactStep2: "21 + 4",
            interactAnswer: 25
          },
          {
            name: "Mr Khan",
            expression: "2n + 7",
            letter: "n",
            value: 6,
            step1: "2 × 6 + 7",
            step2: "12 + 7",
            answer: 19,
            scenario: "calculating points in a maths competition",
            interactValue: 9,
            interactStep1: "2 × 9 + 7",
            interactStep2: "18 + 7",
            interactAnswer: 25
          },
          {
            name: "Aisha",
            expression: "4y − 3",
            letter: "y",
            value: 8,
            step1: "4 × 8 − 3",
            step2: "32 − 3",
            answer: 29,
            scenario: "figuring out how many beads she has left",
            interactValue: 6,
            interactStep1: "4 × 6 − 3",
            interactStep2: "24 − 3",
            interactAnswer: 21
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression} when ${v.letter} = ${v.value}?`,
            body: (v) => `${v.name} is ${v.scenario}. The formula (a rule written as a calculation) is **${v.expression}**.\n\nWe know **${v.letter} = ${v.value}**. Let's **substitute** — that means replace the letter with the number!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Expression: ${v.expression}`, why: `We know ${v.letter} = ${v.value}` },
                  { text: "Replace the letter with the number", why: "This is called substitution (replacing a letter with a number)" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Replace and calculate!",
            body: (v) => `**Substitution** means replacing a letter with its value. Let's do it!\n**Step 1:** Replace **${v.letter}** with **${v.value}** everywhere you see it.\n**Step 2:** Work out the answer.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start: ${v.expression}`, why: `${v.letter} = ${v.value}` },
                  { text: `Replace: ${v.step1}`, why: "Swap the letter for the number" },
                  { text: `Calculate: ${v.step2}`, result: `= ${v.answer}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write the expression: ${v.expression}`,
                `Replace ${v.letter} with ${v.value}: ${v.step1}`,
                `Calculate: ${v.answer}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Write, replace, calculate. ✓`,
                incorrect: (v) => `Not quite — first write the expression, then replace the letter, then calculate.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.expression}** when **${v.letter} = ${v.interactValue}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.expression} → ${v.interactStep1}`, why: `Replace ${v.letter} with ${v.interactValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStep2} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.expression} = ${v.interactStep1} = **${v.interactAnswer}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactStep1} = ${v.interactStep2} = **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The substitution recipe!",
            body: () => `Substitution is one of the most useful skills in algebra. Just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the letter and its value", why: "e.g. x = 5" },
                  { text: "Step 2: Replace every letter with the number", why: "3x + 4 becomes 3 × 5 + 4" },
                  { text: "Step 3: Calculate the answer", why: "15 + 4 = 19 ✓" }
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
        id: "substitution-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why 3x means 3 × x, not 3x as a two-digit number",
          "How to substitute carefully step by step"
        ],
        variableSets: [
          {
            name: "Jake",
            expression: "3x + 2",
            letter: "x",
            value: 4,
            wrongAnswer: 36,
            correctAnswer: 14,
            mistake: "read 3x as the number 34 (thirty-four) instead of 3 × 4 = 12, then added 2 to get 36",
            interactExpression: "4x + 3",
            interactValue: 5,
            interactCorrectAnswer: 23
          },
          {
            name: "Lily",
            expression: "5n − 1",
            letter: "n",
            value: 3,
            wrongAnswer: 52,
            correctAnswer: 14,
            mistake: "read 5n as the number 53 (fifty-three) instead of 5 × 3 = 15, then subtracted 1 to get 52",
            interactExpression: "3n + 4",
            interactValue: 6,
            interactCorrectAnswer: 22
          },
          {
            name: "Oscar",
            expression: "2p + 6",
            letter: "p",
            value: 7,
            wrongAnswer: 33,
            correctAnswer: 20,
            mistake: "read 2p as the number 27 (twenty-seven) instead of 2 × 7 = 14, then added 6 to get 33",
            interactExpression: "3p + 5",
            interactValue: 4,
            interactCorrectAnswer: 17
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} got ${v.wrongAnswer}. Is that right?`,
            body: (v) => `${v.name} substituted **${v.letter} = ${v.value}** into **${v.expression}** and got **${v.wrongAnswer}**.\n\nThat seems too big! What went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}: ${v.expression} with ${v.letter} = ${v.value} → ${v.wrongAnswer}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "It's multiplication, not a two-digit number!",
            body: (v) => `${v.name} ${v.mistake}.\n\nRemember: in algebra, a number next to a letter means **multiply**, not "stick the digits together"!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.expression.split(/[+-]/)[0].trim()}" is NOT a two-digit number`, why: `${v.name} ${v.mistake}` },
                  { text: `RIGHT: ${v.expression.split(/[+-]/)[0].trim()} means ${v.expression.split(/[+-]/)[0].trim().replace(/[a-z]/, ` × ${v.value}`)}`, result: `= ${parseInt(v.expression) * v.value}` },
                  { text: `Correct answer: ${v.correctAnswer}`, result: "Much smaller than " + v.wrongAnswer + "!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `**${v.interactExpression}** when **${v.letter} = ${v.interactValue}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactExpression}`, why: `Remember: multiply, don't join digits!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactExpression} when ${v.letter} = ${v.interactValue}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.interactExpression} = **${v.interactCorrectAnswer}**. Multiply, don't join! ✓`,
                incorrect: (v) => `Not quite! The answer is **${v.interactCorrectAnswer}**. Remember: the number × the letter's value, then add or subtract.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Number next to letter = MULTIPLY!",
            body: () => `Never read 3x as "thirty-x" — it's "3 times x"! This is one of the most common algebra mistakes.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "3x means 3 × x, NOT '3 joined with x'", why: "So if x = 4, it's 3 × 4 = 12" },
                  { text: "Always write out the multiplication", why: "Replace: 3x + 2 → 3 × 4 + 2 → 14" },
                  { text: "If the answer seems way too big, check this!", why: "It's probably a 'joining digits' error ✓" }
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
  // SUB-CONCEPT 3: two-step-equations
  // Solving two-step equations
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "two-step-equations",
    name: "Two-Step Equations",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "two-step-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to solve equations with two operations (like + and ×)",
          "How to undo steps in reverse order"
        ],
        variableSets: [
          {
            name: "A sweet shop",
            scenario: "selling mystery bags",
            equation: "2n + 6 = 18",
            a: 2, b: 6, result: 18,
            step1Result: 12,
            x: 6,
            check: 18,
            interactEquation: "2n + 4 = 14",
            interactA: 2, interactB: 4, interactResult: 14,
            interactStep1Result: 10,
            interactX: 5,
            interactCheck: 14
          },
          {
            name: "A ticket booth",
            scenario: "charging for a fairground ride",
            equation: "5n + 3 = 28",
            a: 5, b: 3, result: 28,
            step1Result: 25,
            x: 5,
            check: 28,
            interactEquation: "5n + 2 = 37",
            interactA: 5, interactB: 2, interactResult: 37,
            interactStep1Result: 35,
            interactX: 7,
            interactCheck: 37
          },
          {
            name: "Grandma",
            scenario: "counting chocolates in boxes",
            equation: "3n + 7 = 34",
            a: 3, b: 7, result: 34,
            step1Result: 27,
            x: 9,
            check: 34,
            interactEquation: "3n + 5 = 20",
            interactA: 3, interactB: 5, interactResult: 20,
            interactStep1Result: 15,
            interactX: 5,
            interactCheck: 20
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Solve: ${v.equation}`,
            body: (v) => `${v.name} is ${v.scenario}. We need to find **n** in the equation **${v.equation}** (an equation is a maths sentence with an equals sign).\n\nThere are two steps to undo. Let's take them one at a time!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.equation}`, why: "Two steps to undo: × and +" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Undo in reverse order!",
            body: (v) => `The equation does two things to n: first multiply by ${v.a}, then add ${v.b}.\n\nTo undo, go **backwards**: undo the addition first, then undo the multiplication.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start: ${v.equation}`, why: "The equation" },
                  { text: `Subtract ${v.b} from both sides`, result: `${v.a}n = ${v.result} − ${v.b} = ${v.step1Result}` },
                  { text: `Divide both sides by ${v.a}`, result: `n = ${v.step1Result} ÷ ${v.a} = ${v.x}` },
                  { text: `Check: ${v.a} × ${v.x} + ${v.b} = ${v.check}`, result: "Correct! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Start with the equation: ${v.equation}`,
                `Subtract ${v.b} from both sides`,
                `Divide both sides by ${v.a}`,
                `Check: ${v.a} × ${v.x} + ${v.b} = ${v.check}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Undo the addition first, then undo the multiplication. ✓`,
                incorrect: (v) => `Not quite — always undo the + or − first, then undo the ×.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Solve **${v.interactEquation}**.\n\nAfter subtracting ${v.interactB}: ${v.interactA}n = ${v.interactStep1Result}.\n\nNow divide by ${v.interactA}. What is n?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactA}n = ${v.interactStep1Result}`, why: `After subtracting ${v.interactB}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStep1Result} ÷ ${v.interactA} = ?`,
              getOptions: (v) => generateDistractors(v.interactX),
              correctAnswer: (v) => v.interactX,
              feedback: {
                correct: (v) => `Brilliant! n = **${v.interactX}**. Check: ${v.interactA} × ${v.interactX} + ${v.interactB} = ${v.interactCheck} ✓`,
                incorrect: (v) => `Not quite! ${v.interactStep1Result} ÷ ${v.interactA} = **${v.interactX}**. Always divide both sides by the number in front of n.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The two-step equation recipe!",
            body: () => `For any equation like **an + b = c**, undo in reverse order:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Undo the + or − (subtract or add)", why: "Get rid of the constant first" },
                  { text: "Step 2: Undo the × (divide)", why: "Isolate n on one side" },
                  { text: "Step 3: CHECK by substituting back!", why: "Put your answer back in — it should work ✓" }
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
        id: "two-step-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why doing the steps in the wrong order gives the wrong answer",
          "How to spot the 'wrong order' mistake"
        ],
        variableSets: [
          {
            name: "Rosie",
            equation: "4n + 5 = 29",
            a: 4, b: 5, result: 29,
            wrongX: 2,
            correctX: 6,
            step1Result: 24,
            mistake: "divided by 4 first (29 ÷ 4 ≈ 7) then subtracted 5 to get 2 — she did the steps in the wrong order",
            interactEquation: "4n + 3 = 35",
            interactA: 4, interactB: 3, interactResult: 35,
            interactStep1Result: 32,
            interactCorrectX: 8
          },
          {
            name: "Ethan",
            equation: "3n + 8 = 26",
            a: 3, b: 8, result: 26,
            wrongX: 1,
            correctX: 6,
            step1Result: 18,
            mistake: "divided 26 by 3 first (≈ 8.7), then subtracted 8 to get about 1 — wrong order!",
            interactEquation: "3n + 5 = 29",
            interactA: 3, interactB: 5, interactResult: 29,
            interactStep1Result: 24,
            interactCorrectX: 8
          },
          {
            name: "Isla",
            equation: "5n + 2 = 47",
            a: 5, b: 2, result: 47,
            wrongX: 7,
            correctX: 9,
            step1Result: 45,
            mistake: "divided 47 by 5 to get 9.4, then subtracted 2 to get 7.4 (rounded to 7) — she should subtract first",
            interactEquation: "5n + 4 = 34",
            interactA: 5, interactB: 4, interactResult: 34,
            interactStep1Result: 30,
            interactCorrectX: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} got n = ${v.wrongX}. Is that right?`,
            body: (v) => `${v.name} solved **${v.equation}** and got **n = ${v.wrongX}**.\n\nLet's check: ${v.a} × ${v.wrongX} + ${v.b} = ${v.a * v.wrongX + v.b}. That's not ${v.result}! Something went wrong.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: n = ${v.wrongX}`, why: `Check: ${v.a} × ${v.wrongX} + ${v.b} = ${v.a * v.wrongX + v.b} — NOT ${v.result}!` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong order!",
            body: (v) => `${v.name} ${v.mistake}.\n\n**Always undo the + or − FIRST**, then undo the ×.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG order: divide first, then subtract`, why: "This gives the wrong answer!" },
                  { text: `RIGHT order: subtract ${v.b} first → ${v.a}n = ${v.step1Result}`, result: `${v.result} − ${v.b} = ${v.step1Result}` },
                  { text: `Then divide by ${v.a} → n = ${v.correctX}`, result: `${v.step1Result} ÷ ${v.a} = ${v.correctX}` },
                  { text: `Check: ${v.a} × ${v.correctX} + ${v.b} = ${v.result}`, result: "Correct! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now solve this one correctly!",
            body: (v) => `Solve **${v.interactEquation}**.\n\nSubtract ${v.interactB} first, then divide by ${v.interactA}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactEquation}` },
                  { text: `Subtract ${v.interactB}: ${v.interactA}n = ${v.interactStep1Result}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `n = ${v.interactStep1Result} ÷ ${v.interactA} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectX),
              correctAnswer: (v) => v.interactCorrectX,
              feedback: {
                correct: (v) => `Spot on! n = **${v.interactCorrectX}**. Check: ${v.interactA} × ${v.interactCorrectX} + ${v.interactB} = ${v.interactResult} ✓`,
                incorrect: (v) => `Not quite! ${v.interactStep1Result} ÷ ${v.interactA} = **${v.interactCorrectX}**. Subtract first, then divide.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Order matters in equations!",
            body: () => `Think of an equation like getting dressed: you put on socks THEN shoes. To get undressed, you take off shoes FIRST, then socks. Same with equations — **undo in REVERSE order**!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "The equation DOES: multiply, then add", why: "e.g. 4n + 5 = 29" },
                  { text: "To UNDO: subtract first, then divide", why: "Reverse order!" },
                  { text: "Always CHECK by substituting back", why: "If it matches, you're right ✓" }
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
  // SUB-CONCEPT 4: writing-expressions
  // Writing algebraic expressions from words
  // Category: supporting
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "writing-expressions",
    name: "Writing Expressions from Words",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "writing-expressions-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to turn word phrases into algebra",
          "How to spot the operation (add, subtract, multiply or divide) from the words"
        ],
        variableSets: [
          {
            name: "A teacher",
            wordPhrase: "double a number and add 5",
            expression: "2n + 5",
            letter: "n",
            testValue: 7,
            testResult: 19,
            interactTestValue: 10,
            interactTestResult: 25
          },
          {
            name: "A baker",
            wordPhrase: "three times a number minus 4",
            expression: "3n − 4",
            letter: "n",
            testValue: 6,
            testResult: 14,
            interactTestValue: 9,
            interactTestResult: 23
          },
          {
            name: "A shop",
            wordPhrase: "five times a number plus 1",
            expression: "5n + 1",
            letter: "n",
            testValue: 4,
            testResult: 21,
            interactTestValue: 7,
            interactTestResult: 36
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Words → Algebra!",
            body: (v) => `${v.name} says: "**${v.wordPhrase}**".\n\nCan we turn those words into an algebra expression? Let's call the unknown number **${v.letter}**!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wordPhrase}"`, why: `Let the unknown number = ${v.letter}` },
                  { text: `In algebra: ${v.expression}`, result: "Words become symbols!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spot the key words!",
            body: (v) => `Look for **clue words** that tell you which calculation to use:\n\n- **"double"** or **"twice"** → × 2\n- **"three times"** → × 3\n- **"add"** or **"plus"** → +\n- **"minus"** or **"subtract"** → −\n\nSo "**${v.wordPhrase}**" becomes **${v.expression}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wordPhrase}"`, why: "Read the words carefully" },
                  { text: `→ ${v.expression}`, why: "Turn each word into a symbol" },
                  { text: `Test with ${v.letter} = ${v.testValue}: ${v.testResult}`, result: "It works!" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "double / twice", right: "× 2" },
                { left: "add / plus", right: "+" },
                { left: "subtract / minus", right: "−" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `"${v.wordPhrase}" with **${v.letter} = ${v.interactTestValue}**.\n\nThe expression is **${v.expression}**. What's the answer?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.expression}`, why: `${v.letter} = ${v.interactTestValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.expression} when ${v.letter} = ${v.interactTestValue}?`,
              getOptions: (v) => generateDistractors(v.interactTestResult),
              correctAnswer: (v) => v.interactTestResult,
              feedback: {
                correct: (v) => `Brilliant! "${v.wordPhrase}" = **${v.expression}** = **${v.interactTestResult}** when ${v.letter} = ${v.interactTestValue}! ✓`,
                incorrect: (v) => `Not quite! ${v.expression} with ${v.letter} = ${v.interactTestValue} gives **${v.interactTestResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Words to algebra — cheat sheet!",
            body: () => `Here are the key words that tell you which calculation to use:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "ADD: 'more than', 'plus', 'add', 'increase by'", why: "n + 5" },
                  { text: "SUBTRACT: 'less than', 'minus', 'subtract', 'decrease by'", why: "n − 3" },
                  { text: "MULTIPLY: 'times', 'double', 'triple', 'lots of'", why: "2n, 3n, 4n" },
                  { text: "DIVIDE: 'share', 'split', 'half of'", why: "n ÷ 2 ✓" }
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
        id: "writing-expressions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid writing the wrong operation (add, subtract, multiply or divide)",
          "Why reading carefully matters in algebra"
        ],
        variableSets: [
          {
            name: "Kai",
            wordPhrase: "5 more than a number",
            wrongExpression: "5n",
            correctExpression: "n + 5",
            mistake: "wrote 5n (5 times n) instead of n + 5 — 'more than' means ADD, not multiply"
          },
          {
            name: "Ella",
            wordPhrase: "a number multiplied by 3",
            wrongExpression: "n + 3",
            correctExpression: "3n",
            mistake: "wrote n + 3 (n plus 3) instead of 3n — 'multiplied by' means TIMES, not plus"
          },
          {
            name: "Leo",
            wordPhrase: "7 less than a number",
            wrongExpression: "7 − n",
            correctExpression: "n − 7",
            mistake: "wrote 7 − n instead of n − 7 — 'less than' means subtract FROM the number, so the number comes first"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.wrongExpression}" correct?`,
            body: (v) => `${v.name} turned "**${v.wordPhrase}**" into **${v.wrongExpression}**.\n\nHmm... does that look right? Read the words carefully!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wordPhrase}" → ${v.wrongExpression}?`, why: "Let's check this" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong calculation!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe correct expression is **${v.correctExpression}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongExpression}`, why: `${v.name} ${v.mistake}` },
                  { text: `RIGHT: ${v.correctExpression}`, result: `"${v.wordPhrase}" = ${v.correctExpression}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Which expression is correct?",
            body: (v) => `"${v.wordPhrase}" — which expression matches?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wordPhrase}"`, why: "Read carefully!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.wordPhrase}" = ?`,
              getOptions: (v) => [v.correctExpression, v.wrongExpression, `${v.correctExpression.replace('+', '×')}`, `n`, `n + n`],
              correctAnswer: (v) => v.correctExpression,
              feedback: {
                correct: (v) => `Spot on! "${v.wordPhrase}" = **${v.correctExpression}**. Read the key words carefully! ✓`,
                incorrect: (v) => `Not quite! "${v.wordPhrase}" = **${v.correctExpression}**. ${v.name} ${v.mistake}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Read the words carefully!",
            body: () => `The most common mistake is mixing up "more than" (add) with "times" (multiply). Always underline the key word that tells you which calculation to use!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "'more than' / 'added to' = +", why: "5 more than n = n + 5" },
                  { text: "'times' / 'multiplied by' = ×", why: "3 times n = 3n" },
                  { text: "'less than' = − (careful with order!)", why: "7 less than n = n − 7 (NOT 7 − n) ✓" }
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
  // SUB-CONCEPT 5: function-machines
  // Using function machines forwards and backwards
  // Category: supporting
  // Lesson A: visual-discovery | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "function-machines",
    name: "Function Machines",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "function-machines-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to use a function machine that applies operations (like +3 or ×2) step by step",
          "How to work backwards through a function machine"
        ],
        variableSets: [
          {
            name: "Sophie",
            input: 5,
            op1: "× 3",
            op1Desc: "multiply by 3",
            mid: 15,
            op2: "+ 4",
            op2Desc: "add 4",
            output: 19,
            interactInput: 8,
            interactMid: 24,
            interactOutput: 28
          },
          {
            name: "James",
            input: 7,
            op1: "× 2",
            op1Desc: "multiply by 2",
            mid: 14,
            op2: "− 3",
            op2Desc: "subtract 3",
            output: 11,
            interactInput: 9,
            interactMid: 18,
            interactOutput: 15
          },
          {
            name: "Evie",
            input: 4,
            op1: "× 5",
            op1Desc: "multiply by 5",
            mid: 20,
            op2: "+ 6",
            op2Desc: "add 6",
            output: 26,
            interactInput: 6,
            interactMid: 30,
            interactOutput: 36
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What do you notice?",
            body: (v) => `Look at this **function machine**. A number goes in, two steps happen (like +3 or ×2), and a different number comes out!\n\nHow does it work?`,
            visual: {
              component: "FunctionMachine",
              props: (v) => ({
                input: v.input,
                output: "?",
                operations: [v.op1, v.op2],
                direction: "forwards"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Follow the steps!",
            bodyParts: (v) => [
              { type: 'text', content: () => `A function machine does each step in order. To undo it, you use the **opposite** — for example, the opposite of + is −.` },
              { type: 'visual', component: "FunctionMachine", props: () => ({ input: v.input, output: v.output, operations: [v.op1, v.op2], midValues: [v.mid], direction: "forwards" }) },
              { type: 'visual', component: "WorkedExample", props: () => ({ steps: [{ text: `Start: ${v.input}`, why: "Input" }, { text: `${v.op1}: ${v.input} → ${v.mid}`, result: `${v.mid}` }, { text: `${v.op2}: ${v.mid} → ${v.output}`, result: `Output: ${v.output}` }], allRevealed: false }) }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactInput}** goes into the machine. First: **${v.op1}** gives **${v.interactMid}**. Then: **${v.op2}**. What's the output?`,
            visual: {
              component: "FunctionMachine",
              props: (v) => ({
                input: v.interactInput,
                output: "?",
                operations: [v.op1, v.op2],
                midValues: [v.interactMid],
                direction: "forwards"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What comes out?`,
              getOptions: (v) => generateDistractors(v.interactOutput),
              correctAnswer: (v) => v.interactOutput,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactInput} → ${v.interactMid} → **${v.interactOutput}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactMid} then ${v.op2} = **${v.interactOutput}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Function machines — forwards and backwards!",
            body: () => `Go **forwards** when you know the input and want to find the output. Go **backwards** when you know the output and want to find the input!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "FORWARDS (find the output): follow each step left to right", why: "Input → do each step → output" },
                  { text: "BACKWARDS (find the input): undo each step right to left", why: "Output → undo last step → undo first step → input" },
                  { text: "To undo: + becomes −, × becomes ÷", why: "Use the opposite to reverse it ✓" }
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
        id: "function-machines-backwards",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to work backwards through a function machine",
          "How to use opposite operations (like + and −, or × and ÷) to find the input"
        ],
        variableSets: [
          {
            name: "Oliver",
            output: 17,
            op1: "× 3",
            op1Inv: "÷ 3",
            mid: 12,
            op2: "+ 5",
            op2Inv: "− 5",
            input: 4,
            interactOutput: 23,
            interactMid: 18,
            interactInput: 6
          },
          {
            name: "Priya",
            output: 22,
            op1: "× 4",
            op1Inv: "÷ 4",
            mid: 20,
            op2: "+ 2",
            op2Inv: "− 2",
            input: 5,
            interactOutput: 30,
            interactMid: 28,
            interactInput: 7
          },
          {
            name: "Hassan",
            output: 13,
            op1: "× 2",
            op1Inv: "÷ 2",
            mid: 6,
            op2: "+ 7",
            op2Inv: "− 7",
            input: 3,
            interactOutput: 19,
            interactMid: 12,
            interactInput: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The output is ${v.output}. What went in?`,
            body: (v) => `${v.name}'s function machine gives an output of **${v.output}**. We know what came OUT, but what went IN? We need to go **backwards**!`,
            visual: {
              component: "FunctionMachine",
              props: (v) => ({
                input: "?",
                output: v.output,
                operations: [v.op1, v.op2],
                direction: "backwards"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use opposite operations!",
            bodyParts: (v) => [
              { type: 'text', content: () => `To go backwards, use the **opposite** of each step in **reverse order**:` },
              { type: 'visual', component: "FunctionMachine", props: () => ({ input: v.input, output: v.output, operations: [v.op1, v.op2], midValues: [v.mid], direction: "backwards" }) },
              { type: 'visual', component: "WorkedExample", props: () => ({ steps: [{ text: `Start at the output: ${v.output}`, why: "Work backwards" }, { text: `Undo ${v.op2} → do ${v.op2Inv}: ${v.output} → ${v.mid}`, result: `${v.mid}` }, { text: `Undo ${v.op1} → do ${v.op1Inv}: ${v.mid} → ${v.input}`, result: `Input = ${v.input}` }], allRevealed: true }) }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Start at the output: ${v.output}`,
                `Undo ${v.op2} by doing ${v.op2Inv}: ${v.output} → ${v.mid}`,
                `Undo ${v.op1} by doing ${v.op1Inv}: ${v.mid} → ${v.input}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Work backwards through the machine using opposite operations. ✓`,
                incorrect: (v) => `Not quite — start at the output and undo the LAST step first.`
              }
            }
          },
          {
            type: "interact",
            title: () => "What was the input?",
            body: (v) => `Working backwards: ${v.interactOutput} ${v.op2Inv} → ${v.interactMid}, then ${v.op1Inv} → ?`,
            visual: {
              component: "FunctionMachine",
              props: (v) => ({
                input: "?",
                output: v.interactOutput,
                operations: [v.op1, v.op2],
                midValues: [v.interactMid],
                direction: "backwards"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What was the input?`,
              getOptions: (v) => generateDistractors(v.interactInput),
              correctAnswer: (v) => v.interactInput,
              feedback: {
                correct: (v) => `Superstar! The input was **${v.interactInput}**. Check: ${v.interactInput} ${v.op1} = ${v.interactMid}, then ${v.op2} = ${v.interactOutput} ✓`,
                incorrect: (v) => `Not quite! ${v.interactMid} ${v.op1Inv} = **${v.interactInput}**. Check: ${v.interactInput} → ${v.interactMid} → ${v.interactOutput}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Going backwards = use opposite operations!",
            body: () => `Function machines are like equations — you can run them forwards OR backwards!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Forwards (find the output): follow each step in order", why: "input → output" },
                  { text: "Backwards (find the input): undo each step in reverse order", why: "output → undo last → undo first → input" },
                  { text: "+ ↔ −, × ↔ ÷", why: "These are opposite pairs — they undo each other ✓" }
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
  // SUB-CONCEPT 6: simple-formulae
  // Using formulae in context
  // Category: supporting
  // Lesson A: curiosity-hook | Lesson B: step-by-step
  // ==========================================
  {
    id: "simple-formulae",
    name: "Using Simple Formulae",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "simple-formulae-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to understand that a formula (a rule written as a calculation) is a way of working things out",
          "How to substitute numbers into a formula"
        ],
        variableSets: [
          {
            name: "A taxi company",
            scenario: "charges a fixed £2 booking fee plus £3 per mile",
            formula: "Cost = 2 + 3m",
            letter: "m",
            letterMeans: "miles",
            fixedCost: 2,
            coeff: 3,
            testValue: 5,
            testResult: 17,
            unit: "£",
            interactTestValue: 8,
            interactTestResult: 26
          },
          {
            name: "A gym",
            scenario: "charges a £10 joining fee plus £4 per month",
            formula: "Cost = 10 + 4m",
            letter: "m",
            letterMeans: "months",
            fixedCost: 10,
            coeff: 4,
            testValue: 6,
            testResult: 34,
            unit: "£",
            interactTestValue: 9,
            interactTestResult: 46
          },
          {
            name: "A cinema",
            scenario: "charges £5 per ticket plus a £1 booking fee",
            formula: "Cost = 1 + 5t",
            letter: "t",
            letterMeans: "tickets",
            fixedCost: 1,
            coeff: 5,
            testValue: 4,
            testResult: 21,
            unit: "£",
            interactTestValue: 7,
            interactTestResult: 36
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the cost?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nThe formula is: **${v.formula}** (where ${v.letter} = number of ${v.letterMeans})\n\nHow much does it cost for **${v.testValue} ${v.letterMeans}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Formula: ${v.formula}`, why: `${v.letter} = number of ${v.letterMeans}` },
                  { text: `We need ${v.testValue} ${v.letterMeans}`, why: `So ${v.letter} = ${v.testValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Plug in the number!",
            body: (v) => `Just replace the letter with the number and calculate:\n\n**${v.formula}**\nWith **${v.letter} = ${v.testValue}**...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.formula}`, why: "The formula" },
                  { text: `Replace ${v.letter} with ${v.testValue}`, why: `${v.letter} = ${v.testValue}` },
                  { text: `${v.coeff} × ${v.testValue} = ${v.coeff * v.testValue}`, why: `${v.coeff}${v.letter} means ${v.coeff} × ${v.letter}` },
                  { text: `Cost = ${v.fixedCost} + ${v.coeff * v.testValue} = ${v.testResult}`, result: `${v.unit}${v.testResult}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Using the formula **${v.formula}** (where ${v.letter} = number of ${v.letterMeans}) with **${v.letter} = ${v.interactTestValue}**, what's the cost?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.formula}`, why: `${v.letter} = ${v.interactTestValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Cost when ${v.letter} = ${v.interactTestValue}?`,
              getOptions: (v) => generateDistractors(v.interactTestResult),
              correctAnswer: (v) => v.interactTestResult,
              feedback: {
                correct: (v) => `Brilliant! With ${v.interactTestValue} ${v.letterMeans}, the cost is **${v.unit}${v.interactTestResult}**! ✓`,
                incorrect: (v) => `Not quite! Substitute ${v.letter} = ${v.interactTestValue} into ${v.formula} to get **${v.unit}${v.interactTestResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Formulae are recipes!",
            body: () => `A formula is just a **rule** for calculating. Substitute the values and work it out!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the formula and identify the letter", why: "What does the letter represent?" },
                  { text: "Replace the letter with the given number", why: "Substitute!" },
                  { text: "Calculate step by step", why: "Remember: multiply before adding ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Step by Step ----
      {
        id: "simple-formulae-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to use a formula to solve a real problem",
          "How to rearrange a formula to find the unknown"
        ],
        variableSets: [
          {
            name: "A plumber",
            scenario: "charges a £20 call-out fee plus £15 per hour",
            formula: "Cost = 20 + 15h",
            letter: "h",
            letterMeans: "hours",
            fixedCost: 20,
            perUnit: 15,
            testValue: 3,
            testResult: 65,
            unit: "£",
            interactTestValue: 5,
            interactTestResult: 95
          },
          {
            name: "An electrician",
            scenario: "charges a £30 call-out fee plus £10 per hour",
            formula: "Cost = 30 + 10h",
            letter: "h",
            letterMeans: "hours",
            fixedCost: 30,
            perUnit: 10,
            testValue: 4,
            testResult: 70,
            unit: "£",
            interactTestValue: 7,
            interactTestResult: 100
          },
          {
            name: "A gardener",
            scenario: "charges a £5 travel fee plus £8 per hour",
            formula: "Cost = 5 + 8h",
            letter: "h",
            letterMeans: "hours",
            fixedCost: 5,
            perUnit: 8,
            testValue: 6,
            testResult: 53,
            unit: "£",
            interactTestValue: 4,
            interactTestResult: 37
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How much for ${v.testValue} ${v.letterMeans}?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nFormula: **${v.formula}**\n\nLet's work out the cost for **${v.testValue} ${v.letterMeans}** step by step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Formula: ${v.formula}`, why: `${v.letter} = ${v.testValue}` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Substitute and calculate",
            body: (v) => `Replace **${v.letter}** with **${v.testValue}** and work out each part.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.formula}`, why: "The formula" },
                  { text: `${v.letter} = ${v.testValue}`, why: `${v.testValue} ${v.letterMeans}` },
                  { text: `Cost = ${v.fixedCost} + ${v.perUnit} × ${v.testValue}`, why: "Substitute" },
                  { text: `Cost = ${v.fixedCost} + ${v.perUnit * v.testValue}`, result: `= ${v.unit}${v.testResult}` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.formula}** with **${v.letter} = ${v.interactTestValue}**.\n\nThe fixed fee is ${v.unit}${v.fixedCost}. The hourly part is ${v.perUnit} × ${v.interactTestValue} = ${v.perUnit * v.interactTestValue}.\n\nWhat's the total?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.fixedCost} + ${v.perUnit * v.interactTestValue} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.fixedCost} + ${v.perUnit * v.interactTestValue} = ?`,
              getOptions: (v) => generateDistractors(v.interactTestResult),
              correctAnswer: (v) => v.interactTestResult,
              feedback: {
                correct: (v) => `Superstar! ${v.fixedCost} + ${v.perUnit * v.interactTestValue} = **${v.unit}${v.interactTestResult}**! ✓`,
                incorrect: (v) => `Not quite! ${v.fixedCost} + ${v.perUnit * v.interactTestValue} = **${v.unit}${v.interactTestResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Using formulae in real life!",
            body: () => `Formulae are everywhere — taxi fares, phone bills, plumber charges. The steps are always the same:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Identify the formula and the letter", why: "What does each part mean?" },
                  { text: "Substitute the known value", why: "Replace the letter with the number" },
                  { text: "Calculate: multiply first, then add", why: "Follow the order — × before + ✓" }
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
  // SUB-CONCEPT 7: inverse-operations
  // Working backwards using inverse operations
  // Category: other
  // Lesson A: spot-the-mistake | Lesson B: key-fact
  // ==========================================
  {
    id: "inverse-operations",
    name: "Inverse Operations",
    category: "other",
    lessons: [
      // ---- Lesson A: Spot the Mistake ----
      {
        id: "inverse-ops-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to use inverse operations — opposite calculations that undo each other (like + and −, or × and ÷)",
          "Why using the wrong inverse gives the wrong answer"
        ],
        variableSets: [
          {
            name: "Noah",
            equation: "x + 8 = 15",
            operation: "+ 8",
            wrongInverse: "+ 8",
            correctInverse: "− 8",
            wrongAnswer: 23,
            correctAnswer: 7,
            mistake: "added 8 to both sides instead of subtracting — he did the same thing again instead of the opposite",
            interactEquation: "x + 6 = 19",
            interactOperation: "+ 6",
            interactCorrectInverse: "− 6",
            interactCorrectAnswer: 13
          },
          {
            name: "Grace",
            equation: "3x = 21",
            operation: "× 3",
            wrongInverse: "× 3",
            correctInverse: "÷ 3",
            wrongAnswer: 63,
            correctAnswer: 7,
            mistake: "multiplied both sides by 3 instead of dividing — she should have done the opposite",
            interactEquation: "4x = 36",
            interactOperation: "× 4",
            interactCorrectInverse: "÷ 4",
            interactCorrectAnswer: 9
          },
          {
            name: "Alfie",
            equation: "x − 5 = 12",
            operation: "− 5",
            wrongInverse: "− 5",
            correctInverse: "+ 5",
            wrongAnswer: 7,
            correctAnswer: 17,
            mistake: "subtracted 5 from both sides instead of adding — inverse of subtract is add!",
            interactEquation: "x − 9 = 14",
            interactOperation: "− 9",
            interactCorrectInverse: "+ 9",
            interactCorrectAnswer: 23
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} got x = ${v.wrongAnswer}. What went wrong?`,
            body: (v) => `${v.name} tried to solve **${v.equation}** and got **x = ${v.wrongAnswer}**.\n\nThat doesn't check out! Let's see what happened.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}: ${v.equation} → x = ${v.wrongAnswer}`, why: "Let's check this..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the OPPOSITE!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe opposite of **${v.operation}** is **${v.correctInverse}**. To undo something, you always do the **opposite**!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongInverse} on both sides`, why: "Same thing again — doesn't undo!" },
                  { text: `RIGHT: ${v.correctInverse} on both sides`, result: `x = ${v.correctAnswer}` },
                  { text: `Inverse pairs: + ↔ −, × ↔ ÷`, why: "These undo each other" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The inverse of addition is subtraction`, answer: true, explanation: "Correct — adding and subtracting undo each other. ✓" },
                { text: `The inverse of multiplication is also multiplication`, answer: false, explanation: "The inverse of multiplication is division — they undo each other!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now solve this one!",
            body: (v) => `**${v.interactEquation}**. Use the inverse: **${v.interactCorrectInverse}** on both sides.\n\nWhat is x?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactEquation}`, why: `Apply ${v.interactCorrectInverse} to both sides` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `x = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! x = **${v.interactCorrectAnswer}**. The opposite of ${v.interactOperation} is ${v.interactCorrectInverse}! ✓`,
                incorrect: (v) => `Not quite! Use ${v.interactCorrectInverse} on both sides to get x = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Opposite pairs!",
            body: () => `To solve an equation, you must do the **opposite** to undo each step. Here are the pairs:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Addition (+) ↔ Subtraction (−)", why: "They undo each other" },
                  { text: "Multiplication (×) ↔ Division (÷)", why: "They undo each other" },
                  { text: "Always do the SAME to BOTH sides", why: "Keep the equation balanced ✓" }
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
        id: "inverse-ops-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "Why equations are like a balance",
          "How to keep an equation balanced by doing the same to both sides"
        ],
        variableSets: [
          {
            name: "A balance scale",
            equation: "x + 4 = 11",
            inverse: "− 4",
            answer: 7,
            check: 11,
            interactEquation: "x + 6 = 15",
            interactInverse: "− 6",
            interactAnswer: 9,
            interactCheck: 15
          },
          {
            name: "A seesaw",
            equation: "2x = 14",
            inverse: "÷ 2",
            answer: 7,
            check: 14,
            interactEquation: "3x = 24",
            interactInverse: "÷ 3",
            interactAnswer: 8,
            interactCheck: 24
          },
          {
            name: "A set of scales",
            equation: "x − 3 = 9",
            inverse: "+ 3",
            answer: 12,
            check: 9,
            interactEquation: "x − 7 = 11",
            interactInverse: "+ 7",
            interactAnswer: 18,
            interactCheck: 11
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "An equation is a balance!",
            body: (v) => `Think of **${v.equation}** as ${v.name.toLowerCase()}. The left side equals the right side — they're **balanced**!\n\nTo find x, we need to get x on its own. But we must keep the balance!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.equation}`, why: "Both sides are equal — balanced!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same to both sides!",
            body: (v) => `Whatever you do to one side, you **must** do to the other. That keeps it balanced.\n\nTo solve **${v.equation}**, do the **opposite** — apply **${v.inverse}** to **both** sides:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.equation}`, why: "The balanced equation" },
                  { text: `Apply ${v.inverse} to BOTH sides`, why: "Keep the balance!" },
                  { text: `x = ${v.answer}`, result: `Check: ${v.answer} → ${v.check} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Whatever you do to one side of an equation, you must do the same to the ____ side`,
              options: (v) => ["other", "left", "top", "same"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Always do the same to both sides to keep the equation balanced. ✓`,
                incorrect: (v) => `Not quite — you must do the same thing to the OTHER side to keep it balanced.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Solve **${v.interactEquation}** by applying **${v.interactInverse}** to both sides.\n\nWhat is x?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactEquation}`, why: `Apply ${v.interactInverse} to both sides` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `x = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Spot on! x = **${v.interactAnswer}**. Balance maintained! ✓`,
                incorrect: (v) => `Not quite! Apply ${v.interactInverse} to both sides: x = **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Keep the balance!",
            body: () => `An equation is a **balance**. The golden rule: whatever you do to one side, do the same to the other!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "An equation means: left side = right side", why: "They're balanced" },
                  { text: "Do the SAME thing to BOTH sides", why: "Add 5 to left? Add 5 to right too!" },
                  { text: "Use the OPPOSITE to isolate x", why: "If it says +5, do −5 to get x on its own ✓" }
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
  // SUB-CONCEPT 8: bidmas-brackets
  // BIDMAS and brackets in expressions
  // Category: other
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "bidmas-brackets",
    name: "BIDMAS and Brackets",
    category: "other",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "bidmas-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to use BIDMAS (Brackets, Indices, Division, Multiplication, Addition, Subtraction) to decide which calculations to do first",
          "How to recognise that brackets change which part you do first"
        ],
        variableSets: [
          {
            name: "Miss Clarke",
            expression: "3 + 4 × 2",
            wrongAnswer: 14,
            correctAnswer: 11,
            wrongReason: "did 3 + 4 first (= 7), then × 2",
            correctReason: "multiplication first: 4 × 2 = 8, then 3 + 8 = 11",
            interactExpression: "8 − 3 × 2",
            interactCorrectAnswer: 2,
            interactReason: "multiplication first: 3 × 2 = 6, then 8 − 6 = 2"
          },
          {
            name: "Mr Khan",
            expression: "10 − 2 × 3",
            wrongAnswer: 24,
            correctAnswer: 4,
            wrongReason: "did 10 − 2 first (= 8), then × 3",
            correctReason: "multiplication first: 2 × 3 = 6, then 10 − 6 = 4",
            interactExpression: "5 + 2 × 4",
            interactCorrectAnswer: 13,
            interactReason: "multiplication first: 2 × 4 = 8, then 5 + 8 = 13"
          },
          {
            name: "Aisha",
            expression: "5 + 6 ÷ 2",
            wrongAnswer: 5,
            correctAnswer: 8,
            wrongReason: "did 5 + 6 first (= 11), then ÷ 2 to get 5.5 (rounded to 5)",
            correctReason: "division first: 6 ÷ 2 = 3, then 5 + 3 = 8",
            interactExpression: "12 − 8 ÷ 4",
            interactCorrectAnswer: 10,
            interactReason: "division first: 8 ÷ 4 = 2, then 12 − 2 = 10"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.expression}?`,
            body: (v) => `${v.name} says **${v.expression} = ${v.wrongAnswer}**.\n\nBut that's wrong! The correct answer is **${v.correctAnswer}**. Why? Because of a rule called **BIDMAS (Brackets, Indices, Division, Multiplication, Addition, Subtraction)**!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}: ${v.expression} = ${v.wrongAnswer}`, why: "Wrong! 😕" },
                  { text: `Correct: ${v.expression} = ${v.correctAnswer}`, why: "Thanks to BIDMAS!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "BIDMAS tells you the order!",
            body: (v) => `**BIDMAS** tells you which calculations to do first:\n\n**B**rackets → **I**ndices → **D**ivision → **M**ultiplication → **A**ddition → **S**ubtraction\n\nMultiplication and division come **before** addition and subtraction!\n\nSo for **${v.expression}**: ${v.correctReason}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "B = Brackets (do these first!)", why: "(3 + 4) × 2 = 7 × 2 = 14" },
                  { text: "I = Indices (powers)", why: "2² = 4" },
                  { text: "DM = Division & Multiplication (left to right)", why: "Before + and −" },
                  { text: "AS = Addition & Subtraction (left to right)", why: "These come last" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In BIDMAS, the B stands for ____ — always do these first`,
              options: (v) => ["Brackets", "Both", "Before", "Below"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! B = Brackets — always calculate what's inside brackets first. ✓`,
                incorrect: (v) => `Not quite — B stands for Brackets. Always do brackets first!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Apply BIDMAS!",
            body: (v) => `What is **${v.interactExpression}** using BIDMAS?\n\nRemember: × and ÷ come before + and −!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactExpression}`, why: "Use BIDMAS!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactExpression} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactReason}. BIDMAS in action! ✓`,
                incorrect: (v) => `Not quite! Remember BIDMAS: ${v.interactReason}. Answer: **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "BIDMAS — remember the order!",
            body: () => `BIDMAS keeps everyone's maths consistent. Without it, the same expression could give different answers!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Brackets first — always!", why: "Whatever's in brackets gets done first" },
                  { text: "× and ÷ before + and −", why: "This is the bit most people forget!" },
                  { text: "Left to right when they're at the same level", why: "3 × 4 ÷ 2 = 12 ÷ 2 = 6 ✓" }
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
        id: "bidmas-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to see that brackets change the answer",
          "Why missing brackets leads to errors"
        ],
        variableSets: [
          {
            name: "Tom",
            withBrackets: "(3 + 5) × 2",
            withoutBrackets: "3 + 5 × 2",
            bracketAnswer: 16,
            noBracketAnswer: 13,
            mistake: "forgot the brackets and did 5 × 2 first (= 10), then 3 + 10 = 13, instead of (3 + 5) × 2 = 8 × 2 = 16",
            interactWithBrackets: "(4 + 3) × 5",
            interactBracketAnswer: 35
          },
          {
            name: "Lily",
            withBrackets: "(10 − 4) × 3",
            withoutBrackets: "10 − 4 × 3",
            bracketAnswer: 18,
            noBracketAnswer: -2,
            mistake: "forgot the brackets and did 4 × 3 first (= 12), then 10 − 12 = -2, instead of (10 − 4) × 3 = 6 × 3 = 18",
            interactWithBrackets: "(8 − 3) × 4",
            interactBracketAnswer: 20
          },
          {
            name: "Jake",
            withBrackets: "2 × (6 + 1)",
            withoutBrackets: "2 × 6 + 1",
            bracketAnswer: 14,
            noBracketAnswer: 13,
            mistake: "forgot the brackets and did 2 × 6 first (= 12), then + 1 = 13, instead of 2 × (6 + 1) = 2 × 7 = 14",
            interactWithBrackets: "3 × (5 + 2)",
            interactBracketAnswer: 21
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Brackets make a difference!`,
            body: (v) => `${v.name} needed to calculate **${v.withBrackets}** but wrote it as **${v.withoutBrackets}** (without brackets).\n\nAre the answers the same?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `With brackets: ${v.withBrackets} = ?` },
                  { text: `Without brackets: ${v.withoutBrackets} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "NOT the same!",
            body: (v) => `${v.name} ${v.mistake}.\n\nBrackets tell you to do that part **first**, before anything else. Without them, BIDMAS (Brackets, Indices, Division, Multiplication, Addition, Subtraction) applies and the order changes!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.withBrackets} = ${v.bracketAnswer}`, why: "Brackets first!" },
                  { text: `${v.withoutBrackets} = ${v.noBracketAnswer}`, why: "× before + (BIDMAS)" },
                  { text: `Different answers!`, result: `${v.bracketAnswer} is NOT the same as ${v.noBracketAnswer}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: v.withBrackets, right: String(v.bracketAnswer) },
                { left: v.withoutBrackets, right: String(v.noBracketAnswer) },
                { left: "Do first", right: "Brackets" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `Calculate **${v.interactWithBrackets}** — do the brackets first!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactWithBrackets}`, why: "Brackets first!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactWithBrackets} = ?`,
              getOptions: (v) => generateDistractors(v.interactBracketAnswer),
              correctAnswer: (v) => v.interactBracketAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.interactWithBrackets} = **${v.interactBracketAnswer}**. Brackets change everything! ✓`,
                incorrect: (v) => `Not quite! Do the brackets first: ${v.interactWithBrackets} = **${v.interactBracketAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Brackets always come first!",
            body: () => `If you see brackets, do that part FIRST. Brackets override everything else in BIDMAS.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Brackets = do this FIRST", why: "Before multiplication, before anything" },
                  { text: "They change the order completely", why: "(3 + 5) × 2 = 16, but 3 + 5 × 2 = 13" },
                  { text: "Always write brackets when you need them!", why: "Don't leave it to chance ✓" }
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

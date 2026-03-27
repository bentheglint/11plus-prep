// Supplementary sub-concepts for Sequences
// To merge: add these to lessonBank.sequences.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const sequencesSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Finding the Constant Difference
  // ==========================================
  {
    id: "constant-difference",
    name: "Finding the Constant Difference",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "constant-diff-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the difference between neighbouring terms (each number in the pattern)",
          "How to check the difference is constant"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "counts the number of tiles in each row of a growing pattern",
            terms: [7, 13, 19, 25, 31],
            difference: 6,
            diffs: [6, 6, 6, 6],
            isConstant: true,
            unit: "tiles",
            interactTerms: [5, 14, 23, 32, 41],
            interactDifference: 9
          },
          {
            name: "Ella",
            scenario: "tracks how many pages she reads each evening",
            terms: [4, 11, 18, 25, 32],
            difference: 7,
            diffs: [7, 7, 7, 7],
            isConstant: true,
            unit: "pages",
            interactTerms: [6, 14, 22, 30, 38],
            interactDifference: 8
          },
          {
            name: "Marcus",
            scenario: "notices the house numbers on one side of a street",
            terms: [3, 9, 15, 21, 27],
            difference: 6,
            diffs: [6, 6, 6, 6],
            isConstant: true,
            unit: "",
            interactTerms: [8, 15, 22, 29, 36],
            interactDifference: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the pattern: ${v.terms.join(', ')}?`,
            body: (v) => `${v.name} ${v.scenario}: **${v.terms.join(', ')}**. There's a pattern hiding here! The secret is to look at the **gaps** between the numbers.`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.terms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subtract each pair!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `To find the difference, subtract each term (each number in the pattern) from the **next** one:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.terms.slice(0, -1).map((t, i) => ({
                    text: `${v.terms[i + 1]} − ${t}`,
                    result: `= ${v.difference}`
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `Every gap is **+${v.difference}**. When the difference is the **same** each time, we call it a **constant difference**.`
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => ({
                  terms: v.terms,
                  differences: v.terms.slice(0, -1).map(() => `+${v.difference}`),
                  showDifferences: true,
                  showNext: false
                })
              },
              {
                type: 'text',
                content: (v) => `The constant difference is **+${v.difference}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Subtract each pair: ${v.terms[1]} − ${v.terms[0]} = ${v.difference}`,
                `Check the next pair: ${v.terms[2]} − ${v.terms[1]} = ${v.difference}`,
                `Same every time → constant difference = +${v.difference}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Subtract, check, then confirm the constant difference. ✓`,
                incorrect: (v) => `Not quite — subtract a pair first, then check another pair, then state the rule.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is the constant difference in the sequence **${v.interactTerms.join(', ')}**?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the constant difference?`,
              getOptions: (v) => generateDistractors(v.interactDifference),
              correctAnswer: (v) => v.interactDifference,
              feedback: {
                correct: (v) => `That's right! Each number is **${v.interactDifference}** more than the last ✓`,
                incorrect: (v) => `Not quite! Subtract any two neighbours: ${v.interactTerms[1]} − ${v.interactTerms[0]} = **${v.interactDifference}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding the difference — the recipe!",
            body: () => `To find the constant difference in any sequence:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Subtract each number from the next", why: "e.g. 13 − 7 = 6, 19 − 13 = 6, 25 − 19 = 6" },
                  { text: "Step 2: Check ALL the differences are the same", why: "If they're all equal, it's a constant difference" },
                  { text: "Step 3: Write the rule", why: "e.g. 'The difference is +6' ✓" }
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
        id: "constant-diff-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid miscounting the difference",
          "Why you must check ALL gaps, not just the first one"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "finds the difference in a sequence",
            terms: [5, 12, 19, 26, 33],
            correctDifference: 7,
            wrongDifference: 5,
            mistakeExplanation: "counted the gap on her fingers but started counting from 5 instead of 6. The correct difference is 12 − 5 = 7, not 5",
            interactTerms: [4, 13, 22, 31, 40],
            interactCorrectDifference: 9
          },
          {
            name: "Charlie",
            scenario: "works out the pattern in a number sequence",
            terms: [8, 15, 22, 29, 36],
            correctDifference: 7,
            wrongDifference: 8,
            mistakeExplanation: "confused the first number (8) with the difference. The first number is 8, but the difference is 15 − 8 = 7",
            interactTerms: [6, 12, 18, 24, 30],
            interactCorrectDifference: 6
          },
          {
            name: "Priya",
            scenario: "checks the gaps in a sequence",
            terms: [10, 16, 22, 28, 34],
            correctDifference: 6,
            wrongDifference: 10,
            mistakeExplanation: "wrote the first number (10) as the difference instead of subtracting! The difference is 16 − 10 = 6",
            interactTerms: [3, 11, 19, 27, 35],
            interactCorrectDifference: 8
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}: **${v.terms.join(', ')}**.\n\n${v.name} says: "The difference is **${v.wrongDifference}**." That's not right!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Sequence: ${v.terms.join(', ')}`, why: `${v.name} says difference = ${v.wrongDifference}` },
                  { text: `But let's check: ${v.terms[1]} − ${v.terms[0]} = ${v.correctDifference}`, why: `Not ${v.wrongDifference}!` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Always subtract to check!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe only way to be sure is to **subtract**: second number minus first number.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.terms.slice(0, -1).map((t, i) => ({
                  text: `${v.terms[i + 1]} − ${t}`,
                  result: `= ${v.correctDifference}`
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the real difference?",
            body: (v) => `What is the **correct** constant difference for **${v.interactTerms.join(', ')}**?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                differences: v.interactTerms.slice(0, -1).map(() => `+${v.interactCorrectDifference}`),
                showDifferences: false,
                showNext: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The constant difference is:`,
              getOptions: (v) => generateDistractors(v.interactCorrectDifference),
              correctAnswer: (v) => v.interactCorrectDifference,
              feedback: {
                correct: (v) => `Spot on! ${v.interactTerms[1]} − ${v.interactTerms[0]} = **${v.interactCorrectDifference}** ✓`,
                incorrect: (v) => `Not quite! Subtract: ${v.interactTerms[1]} − ${v.interactTerms[0]} = **${v.interactCorrectDifference}**. Always subtract to find the difference!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtract — don't guess!",
            body: () => `The most common mistakes with differences:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Don't confuse the first NUMBER with the difference", why: "The first number is where it starts, not how big the jumps are" },
                  { text: "Don't count on fingers from the first number", why: "Subtract instead: next number − current number" },
                  { text: "Check at least TWO gaps to be sure", why: "If they're both the same, you've got it ✓" }
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
  // SUB-CONCEPT 2: Continuing a Sequence
  // ==========================================
  {
    id: "continue-sequence",
    name: "Continuing a Sequence Using the Rule",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "continue-seq-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to continue a sequence forwards",
          "How to work backwards to find missing earlier terms"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "needs to find the next three terms of a sticker pattern",
            terms: [4, 11, 18, 25],
            difference: 7,
            nextThree: [32, 39, 46],
            unit: "stickers",
            interactTerms: [3, 9, 15, 21],
            interactDifference: 6,
            interactNextTerm: 27
          },
          {
            name: "Oscar",
            scenario: "works out the next fence posts in a pattern",
            terms: [6, 15, 24, 33],
            difference: 9,
            nextThree: [42, 51, 60],
            unit: "centimetres",
            interactTerms: [5, 13, 21, 29],
            interactDifference: 8,
            interactNextTerm: 37
          },
          {
            name: "Aisha",
            scenario: "continues a savings pattern",
            terms: [12, 20, 28, 36],
            difference: 8,
            nextThree: [44, 52, 60],
            unit: "pounds",
            interactTerms: [7, 16, 25, 34],
            interactDifference: 9,
            interactNextTerm: 43
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What comes next: ${v.terms.join(', ')}, ...?`,
            body: (v) => `${v.name} ${v.scenario}. The sequence so far is **${v.terms.join(', ')}**. Once you know the rule, finding the next terms is easy!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.terms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the rule, then keep going!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `First, find the difference: **${v.terms[1]} − ${v.terms[0]} = ${v.difference}**.\nNow just keep adding **${v.difference}** to the last number:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Rule: add ${v.difference} each time`, why: `The constant difference` },
                    { text: `${v.terms[v.terms.length - 1]} + ${v.difference}`, result: `= ${v.nextThree[0]}` },
                    { text: `${v.nextThree[0]} + ${v.difference}`, result: `= ${v.nextThree[1]}` },
                    { text: `${v.nextThree[1]} + ${v.difference}`, result: `= ${v.nextThree[2]}` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => {
                  const allTerms = [...v.terms, ...v.nextThree];
                  return {
                    terms: allTerms,
                    differences: allTerms.slice(0, -1).map(() => `+${v.difference}`),
                    showDifferences: true,
                    showNext: false,
                    highlightTerms: [v.terms.length, v.terms.length + 1, v.terms.length + 2]
                  };
                }
              },
              {
                type: 'text',
                content: (v) => `The next three terms are: **${v.nextThree.join(', ')}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `To find the next term, add ${v.difference} to the last number`, answer: true, explanation: `Correct — ${v.terms[v.terms.length - 1]} + ${v.difference} = ${v.nextThree[0]}. ✓` },
                { text: "You need to memorise all the terms to continue a sequence", answer: false, explanation: "No! You just need the last term and the constant difference. Add the difference to keep going." }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The sequence is **${v.interactTerms.join(', ')}, ...**\nThe difference is **+${v.interactDifference}**. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                differences: v.interactTerms.slice(0, -1).map(() => `+${v.interactDifference}`),
                showDifferences: true,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the next number after ${v.interactTerms[v.interactTerms.length - 1]}?`,
              getOptions: (v) => generateDistractors(v.interactNextTerm),
              correctAnswer: (v) => v.interactNextTerm,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTerms[v.interactTerms.length - 1]} + ${v.interactDifference} = **${v.interactNextTerm}** ✓`,
                incorrect: (v) => `Not quite! Add the difference: ${v.interactTerms[v.interactTerms.length - 1]} + ${v.interactDifference} = **${v.interactNextTerm}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Continuing sequences — simple!",
            body: () => `Once you know the constant difference, continuing is easy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the constant difference", why: "Subtract each term from the next one" },
                  { text: "Step 2: Add the difference to the last number", why: "This gives you the next number" },
                  { text: "Step 3: Keep going for as many numbers as you need", why: "Each new number = previous number + difference ✓" }
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
        id: "continue-seq-backwards",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to work backwards to find earlier terms in a sequence",
          "Why subtracting the difference goes backwards"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "knows three terms of a sequence but the first term is hidden",
            knownTerms: [19, 26, 33],
            difference: 7,
            previousTerm: 12,
            termBeforeThat: 5,
            fullSequence: [5, 12, 19, 26, 33],
            interactKnownTerms: [24, 33, 42],
            interactDifference: 9,
            interactPreviousTerm: 15
          },
          {
            name: "Daisy",
            scenario: "sees a sequence with the beginning covered up",
            knownTerms: [23, 31, 39],
            difference: 8,
            previousTerm: 15,
            termBeforeThat: 7,
            fullSequence: [7, 15, 23, 31, 39],
            interactKnownTerms: [17, 23, 29],
            interactDifference: 6,
            interactPreviousTerm: 11
          },
          {
            name: "Isaac",
            scenario: "finds a pattern where the first two numbers are smudged",
            knownTerms: [30, 39, 48],
            difference: 9,
            previousTerm: 21,
            termBeforeThat: 12,
            fullSequence: [12, 21, 30, 39, 48],
            interactKnownTerms: [22, 29, 36],
            interactDifference: 7,
            interactPreviousTerm: 15
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What came BEFORE ${v.knownTerms[0]}?`,
            body: (v) => `${v.name} ${v.scenario}: **?, ?, ${v.knownTerms.join(', ')}**.\n\nWe know the sequence goes up by **${v.difference}** each time. But what if we need to go **backwards**?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: ["?", "?", ...v.knownTerms],
                showDifferences: false,
                showNext: false
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subtract to go backwards!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Going forward means **adding** the difference. So going backward means **subtracting** it!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `The difference is +${v.difference}`, why: "We found this from the known terms" },
                    { text: `${v.knownTerms[0]} − ${v.difference}`, result: `= ${v.previousTerm}` },
                    { text: `${v.previousTerm} − ${v.difference}`, result: `= ${v.termBeforeThat}` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => ({
                  terms: v.fullSequence,
                  differences: v.fullSequence.slice(0, -1).map(() => `+${v.difference}`),
                  showDifferences: true,
                  showNext: false,
                  highlightTerms: [0, 1]
                })
              },
              {
                type: 'text',
                content: (v) => `The full sequence is: **${v.fullSequence.join(', ')}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To go backwards in a sequence, ____ the difference from the first known term`,
              options: (v) => ["add", "subtract", "multiply", "divide"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Going forward = add, going backward = subtract. ${v.knownTerms[0]} − ${v.difference} = ${v.previousTerm}. ✓`,
                incorrect: (v) => `Not quite — going forward means adding, so going backward means subtracting the difference.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The sequence is: **?, ${v.interactKnownTerms.join(', ')}**. The difference is +${v.interactDifference}. What is the missing number?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: ["?", ...v.interactKnownTerms],
                showDifferences: false,
                showNext: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What number comes before ${v.interactKnownTerms[0]}?`,
              getOptions: (v) => generateDistractors(v.interactPreviousTerm),
              correctAnswer: (v) => v.interactPreviousTerm,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactKnownTerms[0]} − ${v.interactDifference} = **${v.interactPreviousTerm}** ✓`,
                incorrect: (v) => `Not quite! To go backwards, subtract: ${v.interactKnownTerms[0]} − ${v.interactDifference} = **${v.interactPreviousTerm}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Forwards and backwards!",
            body: () => `You can use the constant difference to go in **either direction**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Forward: ADD the difference to the last number", why: "e.g. 33 + 7 = 40" },
                  { text: "Backward: SUBTRACT the difference from the first number", why: "e.g. 19 − 7 = 12" },
                  { text: "The rule works both ways!", why: "Just flip the operation ✓" }
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
  // SUB-CONCEPT 4: Finding the nth Term
  // ==========================================
  {
    id: "find-nth-term",
    name: "Finding the nth Term",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "nth-term-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to write the nth term rule (a formula that finds any term from its position) for an arithmetic sequence (one that goes up or down by the same amount each time)",
          "How to use the rule to find any term (number in the pattern)"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "finds a rule for a sequence of table numbers at a wedding",
            terms: [5, 8, 11, 14, 17],
            difference: 3,
            firstTerm: 5,
            adjustment: 2,
            formula: "3n + 2",
            testN: 10,
            testResult: 32,
            interactTerms: [5, 9, 13, 17, 21],
            interactFormula: "4n + 1",
            interactDifference: 4,
            interactAdjustment: 1,
            interactTestN: 8,
            interactTestResult: 33,
            nthTermCheck: [5, 8, 11, 14, 17]
          },
          {
            name: "Jake",
            scenario: "writes a rule for a growing pattern of dots",
            terms: [7, 12, 17, 22, 27],
            difference: 5,
            firstTerm: 7,
            adjustment: 2,
            formula: "5n + 2",
            testN: 8,
            testResult: 42,
            nthTermCheck: [7, 12, 17, 22, 27],
            interactTerms: [7, 10, 13, 16, 19],
            interactFormula: "3n + 4",
            interactDifference: 3,
            interactAdjustment: 4,
            interactTestN: 10,
            interactTestResult: 34
          },
          {
            name: "Nadia",
            scenario: "finds the rule for the number of chairs in each row of a cinema",
            terms: [4, 10, 16, 22, 28],
            difference: 6,
            firstTerm: 4,
            adjustment: -2,
            formula: "6n − 2",
            testN: 20,
            testResult: 118,
            nthTermCheck: [4, 10, 16, 22, 28],
            interactTerms: [7, 11, 15, 19, 23],
            interactFormula: "4n + 3",
            interactDifference: 4,
            interactAdjustment: 3,
            interactTestN: 12,
            interactTestResult: 51
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the 100th term of ${v.terms.slice(0, 3).join(', ')}, ...?`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}. The sequence is **${v.terms.join(', ')}, ...**\n\nYou could keep adding **${v.difference}** ninety-nine times... or you could use a **rule** to jump straight to any term!` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  differences: v.terms.slice(0, -1).map(() => `+${v.difference}`),
                  showDifferences: true,
                  showNext: true,
                  nextValue: "?"
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `Sequence: ${v.terms.join(', ')}, ...`, why: `Difference = ${v.difference}` },
                    { text: `What's the 100th term?`, why: "There must be a shortcut..." }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "The nth term rule!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Sequence: ${v.terms.join(', ')}, ...**`
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => ({
                  terms: v.terms,
                  differences: v.terms.slice(0, -1).map(() => `+${v.difference}`),
                  showDifferences: true
                })
              },
              {
                type: 'text',
                content: (v) => `The **nth term** rule is a formula that lets you jump to ANY position in the sequence. The letter **n** stands for the position number (1st, 2nd, 3rd...). Here's how to find the rule in 3 steps:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Step 1: Find the difference between terms`, why: `The sequence goes up by **${v.difference}** each time` },
                    { text: `Step 2: Write "${v.difference}n" — this is your starting point`, why: `"${v.difference}n" means "${v.difference} times the position number"` },
                    { text: `Step 3: Check if ${v.difference}n gives the right 1st term`, why: `When n = 1: ${v.difference} × 1 = ${v.difference}. But the 1st term is ${v.firstTerm}.` },
                    { text: `${v.firstTerm} is ${Math.abs(v.adjustment)} ${v.adjustment >= 0 ? 'more' : 'less'} than ${v.difference}`, why: `So we need to ${v.adjustment >= 0 ? 'add' : 'subtract'} ${Math.abs(v.adjustment)}` },
                    { text: `The rule is: **${v.formula}**`, result: `Check: position 1 = ${v.difference} × 1 ${v.adjustment >= 0 ? '+' : '−'} ${Math.abs(v.adjustment)} = ${v.firstTerm} ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `Now use it! The **${v.testN}th term**: ${v.difference} × ${v.testN} ${v.adjustment >= 0 ? '+' : '−'} ${Math.abs(v.adjustment)} = **${v.testResult}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the difference: ${v.difference}`,
                `Work out the adjustment: ${v.firstTerm} − ${v.difference} = ${v.adjustment}`,
                `Write the rule: ${v.formula}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Difference first, then adjustment, then write the rule. ✓`,
                incorrect: (v) => `Not quite — find the difference first, then the adjustment (first term minus difference), then write the rule.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A new sequence: **${v.interactTerms.join(', ')}**. The difference is **+${v.interactDifference}** and the rule is **${v.interactFormula}**. What is the **${v.interactTestN}th** term?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms.slice(0, 4),
                differences: v.interactTerms.slice(0, 3).map(() => `+${v.interactDifference}`),
                showDifferences: true,
                showNext: true,
                nextValue: "..."
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The ${v.interactTestN}th term of the sequence = ?`,
              getOptions: (v) => generateDistractors(v.interactTestResult),
              correctAnswer: (v) => v.interactTestResult,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactDifference} × ${v.interactTestN} ${v.interactAdjustment >= 0 ? '+' : '−'} ${Math.abs(v.interactAdjustment)} = **${v.interactTestResult}** ✓`,
                incorrect: (v) => `Not quite! ${v.interactFormula} when n = ${v.interactTestN}: ${v.interactDifference} × ${v.interactTestN} ${v.interactAdjustment >= 0 ? '+' : '−'} ${Math.abs(v.interactAdjustment)} = **${v.interactTestResult}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The nth term recipe!",
            bodyParts: [
              { type: "text", content: () => `To find the nth term of an arithmetic sequence (one that goes up or down by the same amount each time):` },
              {
                type: "visual",
                component: "SequenceChain",
                props: () => ({
                  terms: [5, 8, 11, 14, 17],
                  differences: ["+3", "+3", "+3", "+3"],
                  showDifferences: true,
                  showNext: true,
                  nextValue: "..."
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the difference (d)", why: "This goes in front of n → dn" },
                    { text: "Step 2: Work out the adjustment", why: "First term minus d = the adjustment" },
                    { text: "Step 3: Write the rule: dn + adjustment", why: "e.g. 3n + 2" },
                    { text: "Step 4: Test it! Does n=1 give the first term?", why: "If yes, you've got it ✓" }
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
        id: "nth-term-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing the difference with the first term",
          "Why testing the rule is so important"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "writes the nth term for the sequence 5, 10, 15, 20",
            terms: [5, 10, 15, 20],
            difference: 5,
            correctFormula: "5n",
            wrongFormula: "5n + 5",
            mistakeExplanation: "wrote 5n + 5 because the first term is 5. But when n = 1: 5(1) + 5 = 10, not 5! The first term is already 5 × 1 = 5, so no adjustment is needed",
            testN1Wrong: 10,
            testN1Correct: 5,
            interactTerms: [6, 12, 18, 24],
            interactDifference: 6,
            interactCorrectFormula: "6n",
            interactWrongFormula: "6n + 6",
            interactWrongFormula2: "6n + 3"
          },
          {
            name: "Marcus",
            scenario: "writes the nth term for 3, 7, 11, 15",
            terms: [3, 7, 11, 15],
            difference: 4,
            correctFormula: "4n − 1",
            wrongFormula: "4n + 3",
            mistakeExplanation: "added the first term (3) as the adjustment. But when n = 1: 4(1) + 3 = 7, not 3! The adjustment should be 3 − 4 = −1, giving 4n − 1",
            testN1Wrong: 7,
            testN1Correct: 3,
            interactTerms: [1, 8, 15, 22],
            interactDifference: 7,
            interactCorrectFormula: "7n − 6",
            interactWrongFormula: "7n + 1",
            interactWrongFormula2: "7n"
          },
          {
            name: "Ella",
            scenario: "writes the nth term for 2, 9, 16, 23",
            terms: [2, 9, 16, 23],
            difference: 7,
            correctFormula: "7n − 5",
            wrongFormula: "7n + 2",
            mistakeExplanation: "used the first term (2) as the adjustment. But when n = 1: 7(1) + 2 = 9, not 2! The adjustment should be 2 − 7 = −5, giving 7n − 5",
            testN1Wrong: 9,
            testN1Correct: 2,
            interactTerms: [5, 11, 17, 23],
            interactDifference: 6,
            interactCorrectFormula: "6n − 1",
            interactWrongFormula: "6n + 5",
            interactWrongFormula2: "6n"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\n\n${v.name} says the nth term is **${v.wrongFormula}**. But when we test it with n = 1, we get **${v.testN1Wrong}** — not ${v.terms[0]}!` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: false
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s rule: ${v.wrongFormula}`, why: "Let's test it..." },
                    { text: `When n = 1: ${v.testN1Wrong}`, why: `Should be ${v.terms[0]} — WRONG!` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Always test with n = 1!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct rule is **${v.correctFormula}**.\nTest: when n = 1 → **${v.testN1Correct}** ✓`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Difference = ${v.difference}`, why: `Start with ${v.difference}n` },
                  { text: `Adjustment: ${v.terms[0]} − ${v.difference} = ${v.terms[0] - v.difference}`, why: `First term minus difference` },
                  { text: `Rule: ${v.correctFormula}`, result: "✓" },
                  { text: `Test n = 1: ${v.testN1Correct}`, result: `Matches first term ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Which rule is correct?",
            body: (v) => `For the sequence **${v.interactTerms.join(', ')}**, which is the correct nth term?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                differences: v.interactTerms.slice(0, -1).map(() => `+${v.interactDifference}`),
                showDifferences: true,
                showNext: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The nth term is:`,
              getOptions: (v) => [
                v.interactCorrectFormula,
                v.interactWrongFormula,
                `${v.interactDifference}n`,
                v.interactWrongFormula2,
                `n + ${v.interactDifference}`
              ],
              correctAnswer: (v) => v.interactCorrectFormula,
              feedback: {
                correct: (v) => `Well done! **${v.interactCorrectFormula}** — always test with n = 1! ✓`,
                incorrect: (v) => `Not quite! The adjustment is ${v.interactTerms[0]} − ${v.interactDifference} = ${v.interactTerms[0] - v.interactDifference}. The rule is **${v.interactCorrectFormula}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The test that catches mistakes!",
            body: () => `The most common mistake is getting the adjustment wrong. Here's how to avoid it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find the difference → put it in front of n", why: "e.g. difference = 4 → 4n" },
                  { text: "Adjustment = first term MINUS the difference", why: "e.g. first term 3, difference 4 → 3 − 4 = −1" },
                  { text: "Rule: 4n − 1", why: "NOT 4n + 3!" },
                  { text: "ALWAYS test: does n = 1 give the first term?", why: "4(1) − 1 = 3 ✓" }
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
  // SUB-CONCEPT 5: Decreasing Sequences
  // ==========================================
  {
    id: "decreasing-sequences",
    name: "Sequences That Decrease",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "decreasing-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to recognise decreasing sequences where the difference is negative",
          "Why the same method works for both increasing and decreasing"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "watches a candle getting shorter every hour",
            terms: [40, 34, 28, 22],
            difference: -6,
            nextTerm: 16,
            secondNextTerm: 10,
            unit: "cm",
            interactTerms: [45, 37, 29, 21],
            interactDifference: -8,
            interactNextTerm: 13
          },
          {
            name: "Oscar",
            scenario: "counts money left in a jar as he spends it each day",
            terms: [50, 43, 36, 29],
            difference: -7,
            nextTerm: 22,
            secondNextTerm: 15,
            unit: "pounds",
            interactTerms: [60, 51, 42, 33],
            interactDifference: -9,
            interactNextTerm: 24
          },
          {
            name: "Priya",
            scenario: "records the temperature dropping each hour on a cold night",
            terms: [15, 11, 7, 3],
            difference: -4,
            nextTerm: -1,
            secondNextTerm: -5,
            unit: "°C",
            interactTerms: [25, 20, 15, 10],
            interactDifference: -5,
            interactNextTerm: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This sequence goes DOWN: ${v.terms.join(', ')}, ...`,
            body: (v) => `${v.name} ${v.scenario}. The numbers are getting **smaller** — this is a **decreasing** sequence. But the method for finding the rule is exactly the same!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.terms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The difference is negative!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Subtract each number from the next:\n**${v.terms[1]} − ${v.terms[0]} = ${v.difference}**\n\nThe difference is **${v.difference}** — it's negative because the sequence is going down!`
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => ({
                  terms: v.terms,
                  differences: v.terms.slice(0, -1).map(() => String(v.difference)),
                  showDifferences: true,
                  showNext: false
                })
              },
              {
                type: 'text',
                content: (v) => `To find the next number, **add the negative difference** (which is the same as subtracting ${Math.abs(v.difference)}):\n\n**${v.terms[v.terms.length - 1]} + (${v.difference}) = ${v.nextTerm}**\n**${v.nextTerm} + (${v.difference}) = ${v.secondNextTerm}**`
              },
              {
                type: 'text',
                content: (v) => `The next two numbers are **${v.nextTerm}** and **${v.secondNextTerm}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In a decreasing sequence, the constant difference is ____`,
              options: (v) => ["positive", "negative", "zero", "doubled"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! A decreasing sequence has a negative difference — you subtract each time. ✓`,
                incorrect: (v) => `Not quite — when numbers get smaller, the difference is negative (e.g. ${v.difference}).`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The sequence is **${v.interactTerms.join(', ')}, ...**. The difference is **${v.interactDifference}**. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the next number after ${v.interactTerms[v.interactTerms.length - 1]}?`,
              getOptions: (v) => generateDistractors(v.interactNextTerm),
              correctAnswer: (v) => v.interactNextTerm,
              feedback: {
                correct: (v) => `That's right! ${v.interactTerms[v.interactTerms.length - 1]} − ${Math.abs(v.interactDifference)} = **${v.interactNextTerm}** ✓`,
                incorrect: (v) => `Not quite! Subtract ${Math.abs(v.interactDifference)}: ${v.interactTerms[v.interactTerms.length - 1]} − ${Math.abs(v.interactDifference)} = **${v.interactNextTerm}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decreasing = negative difference!",
            body: () => `Decreasing sequences work exactly the same as increasing ones — the difference is just **negative**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Increasing: difference is positive (+6)", why: "Add to get the next number" },
                  { text: "Decreasing: difference is negative (−6)", why: "Subtract to get the next number" },
                  { text: "The method is identical — find difference, then apply it", why: "Works for both directions! ✓" }
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
        id: "decreasing-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid adding when you should subtract",
          "Why the sign of the difference matters"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "continues a decreasing sequence",
            terms: [30, 25, 20, 15],
            difference: -5,
            correctNext: 10,
            wrongNext: 20,
            mistakeExplanation: "added 5 instead of subtracting! The sequence is DECREASING, so the difference is −5, not +5",
            interactTerms: [36, 30, 24, 18],
            interactDifference: -6,
            interactCorrectNext: 12
          },
          {
            name: "Ben",
            scenario: "finds the next number in a sequence",
            terms: [48, 41, 34, 27],
            difference: -7,
            correctNext: 20,
            wrongNext: 34,
            mistakeExplanation: "added 7 instead of subtracting! The numbers are going DOWN by 7 each time",
            interactTerms: [52, 43, 34, 25],
            interactDifference: -9,
            interactCorrectNext: 16
          },
          {
            name: "Aisha",
            scenario: "continues a temperature sequence",
            terms: [8, 5, 2, -1],
            difference: -3,
            correctNext: -4,
            wrongNext: 2,
            mistakeExplanation: "added 3 instead of subtracting! When the sequence crosses zero, keep going: −1 − 3 = −4",
            interactTerms: [20, 16, 12, 8],
            interactDifference: -4,
            interactCorrectNext: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}: **${v.terms.join(', ')}, ...**\n\n${v.name} says the next number is **${v.wrongNext}**. That's not right!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.terms,
                showDifferences: false,
                showNext: true,
                nextValue: `${v.wrongNext} ✗`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subtract, don't add!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct next number: **${v.terms[v.terms.length - 1]} − ${Math.abs(v.difference)} = ${v.correctNext}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Difference: ${v.difference}`, why: "Negative means DECREASING" },
                  { text: `${v.terms[v.terms.length - 1]} − ${Math.abs(v.difference)}`, result: `= ${v.correctNext} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct next number?",
            body: (v) => `The sequence is **${v.interactTerms.join(', ')}, ...**. The difference is **${v.interactDifference}**. What really comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                showDifferences: false,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number is:`,
              getOptions: (v) => generateDistractors(v.interactCorrectNext),
              correctAnswer: (v) => v.interactCorrectNext,
              feedback: {
                correct: (v) => `That's right! ${v.interactTerms[v.interactTerms.length - 1]} − ${Math.abs(v.interactDifference)} = **${v.interactCorrectNext}** ✓`,
                incorrect: (v) => `Not quite! Subtract ${Math.abs(v.interactDifference)}: ${v.interactTerms[v.interactTerms.length - 1]} − ${Math.abs(v.interactDifference)} = **${v.interactCorrectNext}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Check the direction!",
            body: () => `Before continuing any sequence, check: is it going UP or DOWN?`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Numbers getting BIGGER → ADD the difference", why: "e.g. 5, 12, 19, 26 → next is 26 + 7 = 33" },
                  { text: "Numbers getting SMALLER → SUBTRACT the difference", why: "e.g. 30, 25, 20, 15 → next is 15 − 5 = 10" },
                  { text: "Watch out when crossing zero!", why: "2, −1 → subtract 3 → −1 − 3 = −4 ✓" }
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
  // SUB-CONCEPT 6: Geometric Sequences
  // ==========================================
  {
    id: "geometric-sequences",
    name: "Sequences That Multiply or Divide",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "geometric-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to spot a sequence that multiplies instead of adds",
          "How to find the multiplier (common ratio)"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "watches bacteria double in a science experiment",
            terms: [3, 6, 12, 24, 48],
            multiplier: 2,
            multiplierWord: "doubles",
            nextTerm: 96,
            unit: "bacteria",
            interactTerms: [5, 10, 20, 40, 80],
            interactMultiplier: 2,
            interactNextTerm: 160
          },
          {
            name: "Daisy",
            scenario: "sees a chain letter where each person sends 3 copies",
            terms: [1, 3, 9, 27, 81],
            multiplier: 3,
            multiplierWord: "triples",
            nextTerm: 243,
            unit: "letters",
            interactTerms: [2, 6, 18, 54, 162],
            interactMultiplier: 3,
            interactNextTerm: 486
          },
          {
            name: "Finn",
            scenario: "counts the number of squares in a fractal pattern",
            terms: [2, 10, 50, 250],
            multiplier: 5,
            multiplierWord: "×5",
            nextTerm: 1250,
            unit: "squares",
            interactTerms: [4, 12, 36, 108],
            interactMultiplier: 3,
            interactNextTerm: 324
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This sequence grows FAST: ${v.terms.join(', ')}`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}. Look at the numbers: **${v.terms.join(', ')}**. The gaps between terms are getting bigger and bigger! This isn't a normal adding sequence — something else is going on...` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: true,
                  nextValue: "?"
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: v.terms.slice(0, -1).map((t, i) => ({
                    text: `${v.terms[i + 1]} − ${t}`,
                    result: `= ${v.terms[i + 1] - t}`
                  })),
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "It's multiplying, not adding!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Instead of adding the same amount, each number is **multiplied by ${v.multiplier}** to get the next. Try dividing each number by the one before:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.terms.slice(0, -1).map((t, i) => ({
                    text: `${v.terms[i + 1]} ÷ ${t}`,
                    result: `= ${v.multiplier}`
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The **multiplier** is **×${v.multiplier}** every time! This is called a **geometric sequence**.\n\nTo find the next number: **${v.terms[v.terms.length - 1]} × ${v.multiplier} = ${v.nextTerm}**`
              },
              {
                type: 'text',
                content: (v) => `The next number is **${v.nextTerm}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Arithmetic sequence", right: "Add the same amount" },
                { left: "Geometric sequence", right: "Multiply by the same amount" },
                { left: "Growing differences", right: "Probably geometric" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The sequence **${v.interactTerms.join(', ')}** multiplies by **${v.interactMultiplier}** each time. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactTerms,
                differences: v.interactTerms.slice(0, -1).map(() => `×${v.interactMultiplier}`),
                showDifferences: true,
                showNext: true,
                nextValue: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number after ${v.interactTerms[v.interactTerms.length - 1]} is:`,
              getOptions: (v) => generateDistractors(v.interactNextTerm),
              correctAnswer: (v) => v.interactNextTerm,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTerms[v.interactTerms.length - 1]} × ${v.interactMultiplier} = **${v.interactNextTerm}** ✓`,
                incorrect: (v) => `Not quite! Multiply: ${v.interactTerms[v.interactTerms.length - 1]} × ${v.interactMultiplier} = **${v.interactNextTerm}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiplying sequences!",
            body: () => `Not all sequences add or subtract. Some **multiply**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "If the differences keep GROWING, try dividing", why: "Divide each number by the previous one" },
                  { text: "If the answer is the same each time → geometric!", why: "That's your multiplier" },
                  { text: "Next number = last number × multiplier", why: "These sequences grow VERY fast! ✓" }
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
        id: "geometric-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to tell the difference between arithmetic (adding the same amount) and geometric (multiplying by the same amount) sequences",
          "When to add and when to multiply"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "sees two sequences and needs to identify which is which",
            arithmeticSeq: [5, 10, 15, 20, 25],
            arithmeticDiff: 5,
            geometricSeq: [5, 10, 20, 40, 80],
            geometricMult: 2,
            testSeq: [4, 12, 36, 108],
            testIsGeometric: true,
            testMultiplier: 3,
            testNext: 324
          },
          {
            name: "Marcus",
            scenario: "compares two number patterns",
            arithmeticSeq: [3, 9, 15, 21, 27],
            arithmeticDiff: 6,
            geometricSeq: [3, 9, 27, 81, 243],
            geometricMult: 3,
            testSeq: [2, 8, 32, 128],
            testIsGeometric: true,
            testMultiplier: 4,
            testNext: 512
          },
          {
            name: "Nadia",
            scenario: "decides which type of sequence she's looking at",
            arithmeticSeq: [7, 14, 21, 28, 35],
            arithmeticDiff: 7,
            geometricSeq: [7, 14, 28, 56, 112],
            geometricMult: 2,
            testSeq: [5, 25, 125, 625],
            testIsGeometric: true,
            testMultiplier: 5,
            testNext: 3125
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Same start, very different patterns!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}:\n\n**A:** ${v.arithmeticSeq.join(', ')}\n**B:** ${v.geometricSeq.join(', ')}\n\nBoth start with ${v.arithmeticSeq[0]}, but they grow very differently! How can you tell them apart?` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.geometricSeq.slice(0, 5),
                  differences: v.geometricSeq.slice(0, 4).map(() => `×${v.geometricMult}`),
                  showDifferences: true,
                  showNext: false
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `A: ${v.arithmeticSeq.join(', ')}`, why: `Differences: +${v.arithmeticDiff}, +${v.arithmeticDiff}, +${v.arithmeticDiff}` },
                    { text: `B: ${v.geometricSeq.join(', ')}`, why: `Ratios: ×${v.geometricMult}, ×${v.geometricMult}, ×${v.geometricMult}` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Adding vs multiplying!",
            body: (v) => `**Arithmetic** sequences have a constant **difference** (you add the same amount).\n\n**Geometric** sequences have a constant **multiplier** (you multiply by the same amount).\n\nThe quick test: check the differences. If they're all the same → arithmetic. If they keep growing → probably geometric!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Arithmetic: add ${v.arithmeticDiff} each time`, why: `Differences are constant: ${v.arithmeticDiff}, ${v.arithmeticDiff}, ${v.arithmeticDiff}` },
                  { text: `Geometric: × ${v.geometricMult} each time`, why: `Differences grow: ${v.geometricSeq[1] - v.geometricSeq[0]}, ${v.geometricSeq[2] - v.geometricSeq[1]}, ${v.geometricSeq[3] - v.geometricSeq[2]}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What comes next?",
            body: (v) => `The sequence **${v.testSeq.join(', ')}** is geometric (×${v.testMultiplier}). What is the next number?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.testSeq.join(', ')}, ...`, why: `Each number × ${v.testMultiplier}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number is:`,
              getOptions: (v) => generateDistractors(v.testNext),
              correctAnswer: (v) => v.testNext,
              feedback: {
                correct: (v) => `Spot on! ${v.testSeq[v.testSeq.length - 1]} × ${v.testMultiplier} = **${v.testNext}** ✓`,
                incorrect: (v) => `Not quite! Multiply: ${v.testSeq[v.testSeq.length - 1]} × ${v.testMultiplier} = **${v.testNext}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Arithmetic vs geometric — know the difference!",
            body: () => `Two types of sequence you'll see in the 11+:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "ARITHMETIC: constant difference (add/subtract)", why: "3, 8, 13, 18, 23 → add 5 each time" },
                  { text: "GEOMETRIC: constant multiplier (×/÷)", why: "3, 6, 12, 24, 48 → ×2 each time" },
                  { text: "Quick test: check if differences are constant", why: "If not, try dividing each number by the previous one ✓" }
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
  // SUB-CONCEPT 7: Special Sequences
  // ==========================================
  {
    id: "special-sequences",
    name: "Square, Triangular & Cube Numbers",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "special-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to recognise square, triangular and cube numbers",
          "Why they are called 'special' sequences"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "arranges dots in square patterns",
            sequenceType: "square",
            terms: [1, 4, 9, 16, 25, 36],
            formula: "n²",
            explanations: ["1×1", "2×2", "3×3", "4×4", "5×5", "6×6"],
            nextTerm: 49,
            nextExplanation: "7×7 = 49",
            testN: 10,
            testAnswer: 100
          },
          {
            name: "Finn",
            scenario: "stacks objects in triangle shapes",
            sequenceType: "triangular",
            terms: [1, 3, 6, 10, 15, 21],
            formula: "n(n+1)÷2",
            explanations: ["1", "1+2", "1+2+3", "1+2+3+4", "1+2+3+4+5", "1+2+3+4+5+6"],
            nextTerm: 28,
            nextExplanation: "1+2+3+4+5+6+7 = 28",
            testN: 8,
            testAnswer: 36
          },
          {
            name: "Ella",
            scenario: "builds cubes from small unit cubes",
            sequenceType: "cube",
            terms: [1, 8, 27, 64, 125],
            formula: "n³",
            explanations: ["1×1×1", "2×2×2", "3×3×3", "4×4×4", "5×5×5"],
            nextTerm: 216,
            nextExplanation: "6×6×6 = 216",
            testN: 4,
            testAnswer: 64
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `A special sequence: ${v.terms.slice(0, 5).join(', ')}, ...`,
            body: (v) => `${v.name} ${v.scenario} and gets the numbers: **${v.terms.join(', ')}**. These aren't random — they're **${v.sequenceType} numbers**! They pop up everywhere in maths.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.terms.map((t, i) => ({
                  text: v.explanations[i],
                  result: `= ${t}`
                })),
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The three special sequences",
            bodyParts: [
              {
                type: 'text',
                content: () => `There are **three special sequences** you need to know for the 11+:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Square numbers: multiply a number by itself", why: "1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5=25..." },
                    { text: "Triangular numbers: add one more each time", why: "1, 1+2=3, 1+2+3=6, 1+2+3+4=10, 1+2+3+4+5=15..." },
                    { text: "Cube numbers: multiply a number by itself three times", why: "1×1×1=1, 2×2×2=8, 3×3×3=27, 4×4×4=64..." }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `This lesson focuses on **${v.sequenceType} numbers**: **${v.terms.join(', ')}**\nThe next one: **${v.nextExplanation}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `16 is a square number`, answer: true, explanation: `Correct — 4 × 4 = 16. ✓` },
                { text: `27 is a square number`, answer: false, explanation: `No! 27 is a cube number (3 × 3 × 3), not a square number.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is the **${v.testN}${v.testN === 1 ? 'st' : v.testN === 2 ? 'nd' : v.testN === 3 ? 'rd' : 'th'} ${v.sequenceType} number**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.sequenceType === "square" ? `${v.testN} × ${v.testN}` : v.sequenceType === "cube" ? `${v.testN} × ${v.testN} × ${v.testN}` : `1 + 2 + 3 + ... + ${v.testN}`}`, why: `Work it out!` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The ${v.testN}${v.testN === 1 ? 'st' : v.testN === 2 ? 'nd' : v.testN === 3 ? 'rd' : 'th'} ${v.sequenceType} number is:`,
              getOptions: (v) => generateDistractors(v.testAnswer),
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! **${v.testAnswer}** ✓`,
                incorrect: (v) => `Not quite! The answer is **${v.testAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The three special sequences to remember!",
            bodyParts: [
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Square numbers (n × n)", why: "1, 4, 9, 16, 25, 36, 49, 64, 81, 100" },
                    { text: "How to spot them: a number times itself", why: "e.g. Is 49 square? Yes — 7 × 7 = 49 ✓" },
                    { text: "Triangular numbers (1+2+3+...)", why: "1, 3, 6, 10, 15, 21, 28, 36, 45, 55" },
                    { text: "How to spot them: keep adding the next number", why: "e.g. 6th triangular: 1+2+3+4+5+6 = 21 ✓" },
                    { text: "Cube numbers (n × n × n)", why: "1, 8, 27, 64, 125, 216" },
                    { text: "How to spot them: a number times itself three times", why: "e.g. Is 64 cube? Yes — 4 × 4 × 4 = 64 ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key Fact ----
      {
        id: "special-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to quickly identify whether a number is square, triangular or cube",
          "Why learning these by heart speeds up the 11+ exam"
        ],
        variableSets: [
          {
            name: "Oscar",
            scenario: "needs to recognise special numbers in a test",
            testNumber: 36,
            isSquare: true,
            isTriangular: true,
            isCube: false,
            squareRoot: 6,
            explanation: "36 is BOTH a square number (6×6) AND a triangular number (1+2+3+4+5+6+7+8)",
            quizNumber: 64,
            quizAnswer: "square and cube",
            quizExplanation: "64 = 8×8 (square) and 4×4×4 (cube)"
          },
          {
            name: "Holly",
            scenario: "checks if a number is special",
            testNumber: 27,
            isSquare: false,
            isTriangular: false,
            isCube: true,
            squareRoot: null,
            explanation: "27 is a cube number (3×3×3) but NOT square or triangular",
            quizNumber: 49,
            quizAnswer: "square only",
            quizExplanation: "49 = 7×7 (square) but not cube or triangular"
          },
          {
            name: "Priya",
            scenario: "identifies special numbers quickly",
            testNumber: 1,
            isSquare: true,
            isTriangular: true,
            isCube: true,
            squareRoot: 1,
            explanation: "1 is a square (1×1), triangular (just 1), AND a cube (1×1×1) — the only number that's all three!",
            quizNumber: 125,
            quizAnswer: "cube only",
            quizExplanation: "125 = 5×5×5 (cube) but not square"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is ${v.testNumber} a special number?`,
            body: (v) => `${v.name} ${v.scenario}. The number is **${v.testNumber}**. Let's check each type:\n\n- **Square?** Can you find a number that times itself gives ${v.testNumber}?\n- **Cube?** Can you find a number that times itself three times gives ${v.testNumber}?\n- **Triangular?** Is it in the sequence 1, 3, 6, 10, 15, 21, 28, 36...?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Square? ${v.isSquare ? `${v.squareRoot} × ${v.squareRoot} = ${v.testNumber}` : `No whole number × itself = ${v.testNumber}`}`, result: v.isSquare ? 'YES ✓' : 'NO ✗' },
                  { text: `Cube? ${v.isCube ? (v.testNumber === 1 ? '1 × 1 × 1 = 1' : v.testNumber === 8 ? '2 × 2 × 2 = 8' : v.testNumber === 27 ? '3 × 3 × 3 = 27' : v.testNumber === 64 ? '4 × 4 × 4 = 64' : v.testNumber === 125 ? '5 × 5 × 5 = 125' : 'YES') : `No whole number × itself × itself = ${v.testNumber}`}`, result: v.isCube ? 'YES ✓' : 'NO ✗' },
                  { text: `Triangular? ${v.isTriangular ? `${v.testNumber} appears in 1, 3, 6, 10, 15, 21, 28, 36...` : `${v.testNumber} is not in the triangular sequence`}`, result: v.isTriangular ? 'YES ✓' : 'NO ✗' }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Learn them by heart!",
            body: (v) => `${v.explanation}\n\nThe fastest way to spot these in the exam is to **memorise** them. Here are the ones you need:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Square: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144", why: "Know these up to 12×12" },
                  { text: "Cube: 1, 8, 27, 64, 125", why: "Know these up to 5×5×5" },
                  { text: "Triangular: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55", why: "Know the first 10" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Quick — what type is it?",
            body: (v) => `Is **${v.quizNumber}** a square number, a cube number, or both?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.quizNumber} = ?`, why: "Think: can you make it by multiplying a number by itself?" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.quizNumber} is:`,
              getOptions: (v) => [
                v.quizAnswer,
                "square only",
                "cube only",
                "triangular only",
                "not special"
              ].filter((opt, i, arr) => arr.indexOf(opt) === i),
              correctAnswer: (v) => v.quizAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.quizExplanation} ✓`,
                incorrect: (v) => `Not quite! ${v.quizExplanation}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Spot special numbers instantly!",
            body: () => `In the 11+ exam, recognising special numbers quickly saves precious time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Memorise square numbers up to 144 (12×12)", why: "These appear in MANY question types" },
                  { text: "Know the first 5 cube numbers: 1, 8, 27, 64, 125", why: "Especially 8 and 27 — they're common" },
                  { text: "Know triangular numbers up to 55", why: "1, 3, 6, 10, 15, 21, 28, 36, 45, 55 ✓" }
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
  // SUB-CONCEPT 8: Fibonacci-Style Sequences
  // ==========================================
  {
    id: "fibonacci-style",
    name: "Fibonacci-Style Sequences",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "fibonacci-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot a sequence where each number is the sum of the two before it",
          "How this pattern appears in nature"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "discovers a pattern in sunflower spirals",
            terms: [1, 1, 2, 3, 5, 8, 13],
            nextTerm: 21,
            secondNextTerm: 34,
            pairs: ["1+1=2", "1+2=3", "2+3=5", "3+5=8", "5+8=13"],
            interactTerms: [2, 5, 7, 12, 19],
            interactNextTerm: 31
          },
          {
            name: "Ben",
            scenario: "spots a pattern in a maths puzzle",
            terms: [2, 3, 5, 8, 13, 21],
            nextTerm: 34,
            secondNextTerm: 55,
            pairs: ["2+3=5", "3+5=8", "5+8=13", "8+13=21"],
            interactTerms: [3, 4, 7, 11, 18],
            interactNextTerm: 29
          },
          {
            name: "Holly",
            scenario: "finds a pattern in a number wall game",
            terms: [1, 3, 4, 7, 11, 18],
            nextTerm: 29,
            secondNextTerm: 47,
            pairs: ["1+3=4", "3+4=7", "4+7=11", "7+11=18"],
            interactTerms: [2, 1, 3, 4, 7, 11],
            interactNextTerm: 18
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the pattern: ${v.terms.join(', ')}, ...?`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}: **${v.terms.join(', ')}**. The differences aren't constant, and it's not multiplying... so what's the rule? Look at how each number relates to the TWO numbers before it!` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: true,
                  nextValue: "?"
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Add the two previous numbers!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Each number is the **sum of the two numbers before it**. This is called a **Fibonacci-style** sequence!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.pairs.map(p => ({
                    text: p,
                    result: "✓"
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `So the next number: **${v.terms[v.terms.length - 2]} + ${v.terms[v.terms.length - 1]} = ${v.nextTerm}**\nAnd after that: **${v.terms[v.terms.length - 1]} + ${v.nextTerm} = ${v.secondNextTerm}**`
              },
              {
                type: 'text',
                content: (v) => `The next two numbers are **${v.nextTerm}** and **${v.secondNextTerm}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Arithmetic", right: "Add the same number" },
                { left: "Geometric", right: "Multiply by the same number" },
                { left: "Fibonacci-style", right: "Add the two previous numbers" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sequence **${v.interactTerms.join(', ')}, ...**, each number is the sum of the two before it. What comes next?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Rule: each number = sum of the previous two`, why: `${v.interactTerms[v.interactTerms.length - 2]} + ${v.interactTerms[v.interactTerms.length - 1]} = ?` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number is:`,
              getOptions: (v) => generateDistractors(v.interactNextTerm),
              correctAnswer: (v) => v.interactNextTerm,
              feedback: {
                correct: (v) => `That's right! ${v.interactTerms[v.interactTerms.length - 2]} + ${v.interactTerms[v.interactTerms.length - 1]} = **${v.interactNextTerm}** ✓`,
                incorrect: (v) => `Not quite! Add the last two: ${v.interactTerms[v.interactTerms.length - 2]} + ${v.interactTerms[v.interactTerms.length - 1]} = **${v.interactNextTerm}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The Fibonacci rule!",
            body: () => `In a Fibonacci-style sequence, each number is the **sum of the two before it**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Check: does each number = the two before it added together?", why: "e.g. 1, 1, 2, 3, 5, 8 → 1+1=2, 1+2=3, 2+3=5..." },
                  { text: "To find the next number: add the last two numbers", why: "5 + 8 = 13, 8 + 13 = 21, 13 + 21 = 34..." },
                  { text: "This pattern appears in sunflowers, pinecones and shells!", why: "Nature loves Fibonacci! ✓" }
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
        id: "fibonacci-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to find missing terms in a Fibonacci-style sequence (where each number is the sum of the two before it)",
          "How to work backwards in a Fibonacci sequence"
        ],
        variableSets: [
          {
            name: "Isaac",
            scenario: "has a Fibonacci sequence with a gap",
            terms: [3, 5, 8, "?", 21],
            missingIndex: 3,
            missingValue: 13,
            checkSum: "8 + 13 = 21",
            interactTerms: [1, 4, 5, "?", 14],
            interactMissingValue: 9,
            interactCheckSum: "5 + 9 = 14"
          },
          {
            name: "Daisy",
            scenario: "fills in a missing number in the middle",
            terms: [2, 7, "?", 16, 25],
            missingIndex: 2,
            missingValue: 9,
            checkSum: "7 + 9 = 16",
            interactTerms: [3, 8, "?", 19, 30],
            interactMissingValue: 11,
            interactCheckSum: "8 + 11 = 19"
          },
          {
            name: "Jake",
            scenario: "finds a hidden number in a number wall",
            terms: [4, 6, "?", 16, 26],
            missingIndex: 2,
            missingValue: 10,
            checkSum: "6 + 10 = 16",
            interactTerms: [5, 7, "?", 19, 31],
            interactMissingValue: 12,
            interactCheckSum: "7 + 12 = 19"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Find the missing number!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}. This is a Fibonacci-style sequence: **${v.terms.join(', ')}**. Each number is the sum of the two before it. Can you find the missing number?` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: false
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use what you know!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Since each number = sum of the two before it, we can use the surrounding numbers to find the gap.\n\nWe know the answer and one of the pair, so: **${v.checkSum}** ✓`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const filled = v.terms.map(t => t === "?" ? v.missingValue : t);
                  return {
                    steps: filled.slice(0, -1).map((t, i) => ({
                      text: `${filled[i]} + ${filled[i + 1]}`,
                      result: i + 2 < filled.length ? `= ${filled[i + 2]}` : ''
                    })).filter((s, i) => i + 2 < filled.length),
                    allRevealed: false
                  };
                }
              },
              {
                type: 'text',
                content: (v) => `The missing number is **${v.missingValue}** ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the missing number: **${v.interactTerms.join(', ')}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Rule: each number = sum of the two before`, why: "Use the numbers around the gap" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The missing number is:`,
              getOptions: (v) => generateDistractors(v.interactMissingValue),
              correctAnswer: (v) => v.interactMissingValue,
              feedback: {
                correct: (v) => `Spot on! The missing number is **${v.interactMissingValue}**. Check: ${v.interactCheckSum} ✓`,
                incorrect: (v) => `Not quite! The missing number is **${v.interactMissingValue}**. Check: ${v.interactCheckSum}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding gaps in Fibonacci!",
            body: () => `When a Fibonacci-style sequence has a missing number:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "If you know a number and the sum → subtract to find the other", why: "e.g. ? + 8 = 21 → ? = 21 − 8 = 13" },
                  { text: "If you know the two before → add them", why: "e.g. 8 + 13 = 21" },
                  { text: "Always check: does the answer work with its neighbours?", why: "Both sides of the gap should check out ✓" }
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
  // SUB-CONCEPT 9: Two-Step Rules
  // ==========================================
  {
    id: "two-step-rules",
    name: "Sequences with Two-Step Rules",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "two-step-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot a sequence that uses multiply then add (or subtract)",
          "How to work out a two-step rule"
        ],
        variableSets: [
          {
            name: "Nadia",
            scenario: "finds a tricky pattern in a puzzle book",
            terms: [2, 5, 11, 23, 47],
            rule: "×2 then +1",
            ruleSteps: ["2×2+1=5", "5×2+1=11", "11×2+1=23", "23×2+1=47"],
            nextTerm: 95,
            nextCalc: "47×2+1=95",
            multiplier: 2,
            addend: 1,
            interactTerms: [1, 3, 7, 15, 31],
            interactRule: "×2 then +1",
            interactMultiplier: 2,
            interactAddend: 1,
            interactNextTerm: 63,
            interactNextCalc: "31×2+1=63"
          },
          {
            name: "Marcus",
            scenario: "decodes a number pattern in a maths competition",
            terms: [1, 4, 13, 40, 121],
            rule: "×3 then +1",
            ruleSteps: ["1×3+1=4", "4×3+1=13", "13×3+1=40", "40×3+1=121"],
            nextTerm: 364,
            nextCalc: "121×3+1=364",
            multiplier: 3,
            addend: 1,
            interactTerms: [2, 7, 22, 67, 202],
            interactRule: "×3 then +1",
            interactMultiplier: 3,
            interactAddend: 1,
            interactNextTerm: 607,
            interactNextCalc: "202×3+1=607"
          },
          {
            name: "Lily",
            scenario: "spots a pattern in her game scores",
            terms: [3, 8, 18, 38, 78],
            rule: "×2 then +2",
            ruleSteps: ["3×2+2=8", "8×2+2=18", "18×2+2=38", "38×2+2=78"],
            nextTerm: 158,
            nextCalc: "78×2+2=158",
            multiplier: 2,
            addend: 2,
            interactTerms: [1, 4, 10, 22, 46],
            interactRule: "×2 then +2",
            interactMultiplier: 2,
            interactAddend: 2,
            interactNextTerm: 94,
            interactNextCalc: "46×2+2=94"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This one's tricky: ${v.terms.join(', ')}, ...`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}: **${v.terms.join(', ')}**. The differences aren't constant, and dividing doesn't give a whole number... This sequence uses a **two-step rule**!` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: true,
                  nextValue: "?"
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `Differences: ${v.terms.slice(0, -1).map((t, i) => v.terms[i + 1] - t).join(', ')}`, why: "Not constant!" },
                    { text: `Ratios: ${v.terms.slice(0, -1).map((t, i) => (v.terms[i + 1] / t).toFixed(1)).join(', ')}`, why: "Not quite constant either!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two operations in one step!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Sequence: ${v.terms.join(', ')}, ...**`
              },
              {
                type: 'visual',
                component: 'SequenceChain',
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: true,
                  nextValue: "?"
                })
              },
              {
                type: 'text',
                content: (v) => `The rule is: **${v.rule}**. Each number is multiplied by ${v.multiplier} and then ${v.addend} is added:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.ruleSteps.map(s => ({
                    text: s,
                    result: "✓"
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `To find the next number: **${v.nextCalc}**`
              },
              {
                type: 'text',
                content: (v) => `The next number is **${v.nextTerm}** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Take the last number: ${v.terms[v.terms.length - 1]}`,
                `Multiply by ${v.multiplier}: ${v.terms[v.terms.length - 1]} × ${v.multiplier} = ${v.terms[v.terms.length - 1] * v.multiplier}`,
                `Add ${v.addend}: ${v.terms[v.terms.length - 1] * v.multiplier} + ${v.addend} = ${v.nextTerm}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Take the last number, multiply, then add. ✓`,
                incorrect: (v) => `Not quite — take the last number, multiply first, then add. The order matters!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The rule is **${v.interactRule}**. The sequence is **${v.interactTerms.join(', ')}, ...**. What comes next?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Rule: ${v.interactRule}`, why: `Apply to the last number: ${v.interactTerms[v.interactTerms.length - 1]}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number is:`,
              getOptions: (v) => generateDistractors(v.interactNextTerm),
              correctAnswer: (v) => v.interactNextTerm,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactNextCalc} ✓`,
                incorrect: (v) => `Not quite! Apply the rule: ${v.interactNextCalc}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two-step rules — how to crack them!",
            body: () => `When a sequence doesn't have a constant difference or constant multiplier, try a **two-step rule**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Try: multiply by 2 then add something", why: "Check: does 2×first + ? = second number?" },
                  { text: "Try: multiply by 3 then add something", why: "Check: does 3×first + ? = second number?" },
                  { text: "Test your rule on ALL the numbers", why: "If it works for every pair → you've cracked it! ✓" }
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
          "How to avoid applying operations in the wrong order",
          "Why the order of multiply and add matters"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "applies a two-step rule but gets the order wrong",
            terms: [3, 7, 15, 31],
            rule: "×2 then +1",
            wrongRule: "+1 then ×2",
            correctNext: 63,
            wrongNext: 64,
            correctCalc: "31 × 2 + 1 = 63",
            wrongCalc: "(31 + 1) × 2 = 64",
            mistakeExplanation: "did +1 THEN ×2 instead of ×2 THEN +1. The order matters!",
            interactTerms: [1, 5, 13, 29],
            interactRule: "×2 then +3",
            interactCorrectNext: 61,
            interactCorrectCalc: "29 × 2 + 3 = 61"
          },
          {
            name: "Ella",
            scenario: "continues a two-step sequence incorrectly",
            terms: [2, 7, 22, 67],
            rule: "×3 then +1",
            wrongRule: "+1 then ×3",
            correctNext: 202,
            wrongNext: 204,
            correctCalc: "67 × 3 + 1 = 202",
            wrongCalc: "(67 + 1) × 3 = 204",
            mistakeExplanation: "added 1 first then multiplied by 3, instead of multiplying first. Always multiply THEN add!",
            interactTerms: [3, 11, 35, 107],
            interactRule: "×3 then +2",
            interactCorrectNext: 323,
            interactCorrectCalc: "107 × 3 + 2 = 323"
          },
          {
            name: "Finn",
            scenario: "applies the wrong two-step rule",
            terms: [1, 4, 10, 22],
            rule: "×2 then +2",
            wrongRule: "×2 then +1",
            correctNext: 46,
            wrongNext: 45,
            correctCalc: "22 × 2 + 2 = 46",
            wrongCalc: "22 × 2 + 1 = 45",
            mistakeExplanation: "added 1 instead of 2 after multiplying. Check: 1×2+2=4 ✓, 4×2+2=10 ✓, so the rule is ×2 then +2",
            interactTerms: [2, 7, 17, 37],
            interactRule: "×2 then +3",
            interactCorrectNext: 77,
            interactCorrectCalc: "37 × 2 + 3 = 77"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}. The sequence is **${v.terms.join(', ')}, ...**\n\n${v.name} says the next number is **${v.wrongNext}**. The rule is "${v.rule}" — but ${v.name} got confused!` },
              {
                type: "visual",
                component: "SequenceChain",
                props: (v) => ({
                  terms: v.terms,
                  showDifferences: false,
                  showNext: true,
                  nextValue: `${v.wrongNext} ✗`
                })
              },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s working: ${v.wrongCalc}`, why: "WRONG!" },
                    { text: `Correct working: ${v.correctCalc}`, why: "✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Order matters!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct answer: **${v.correctCalc}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.wrongRule}`, why: `Gives ${v.wrongNext}` },
                  { text: `Right: ${v.rule}`, why: `Gives ${v.correctNext}` },
                  { text: `The order of operations matters!`, result: "Always multiply FIRST, then add/subtract" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct next number?",
            body: (v) => `The sequence is **${v.interactTerms.join(', ')}, ...**. The rule is **${v.interactRule}**. What comes next?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Rule: ${v.interactRule}`, why: `Apply to ${v.interactTerms[v.interactTerms.length - 1]}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The next number is:`,
              getOptions: (v) => generateDistractors(v.interactCorrectNext),
              correctAnswer: (v) => v.interactCorrectNext,
              feedback: {
                correct: (v) => `Well done! ${v.interactCorrectCalc} ✓`,
                incorrect: (v) => `Not quite! Apply the rule in order: ${v.interactCorrectCalc}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiply FIRST, then add!",
            body: () => `In two-step rules, the **order** of operations matters:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "×2 then +1 means: multiply by 2 FIRST, then add 1", why: "e.g. 7 → 7×2 = 14 → 14+1 = 15" },
                  { text: "+1 then ×2 gives a DIFFERENT answer!", why: "e.g. 7 → 7+1 = 8 → 8×2 = 16 (wrong!)" },
                  { text: "Always do the multiply/divide BEFORE the add/subtract", why: "Unless the question specifically says otherwise ✓" }
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

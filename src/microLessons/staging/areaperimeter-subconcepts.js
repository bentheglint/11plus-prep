// Supplementary sub-concepts for Area & Perimeter
// To merge: add these to lessonBank.areaperimeter.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const areaperimeterSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Perimeter of Rectangles and Squares
  // ==========================================
  {
    id: "perimeter-rectangles",
    name: "Perimeter of Rectangles and Squares",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "perimeter-rectangles-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the perimeter by adding all the sides",
          "Why 2 x (length + width) is a shortcut for rectangles"
        ],
        variableSets: [
          {
            name: "Mr Singh",
            scenario: "putting a fence around the school vegetable patch",
            length: 12,
            width: 8,
            perimeter: 40,
            unit: "m",
            isSquare: false,
            intLength: 11,
            intWidth: 7,
            intPerimeter: 36,
            intIsSquare: false
          },
          {
            name: "Poppy",
            scenario: "putting ribbon around a picture frame",
            length: 15,
            width: 10,
            perimeter: 50,
            unit: "cm",
            isSquare: false,
            intLength: 13,
            intWidth: 7,
            intPerimeter: 40,
            intIsSquare: false
          },
          {
            name: "Coach Davies",
            scenario: "marking the boundary of a netball court",
            length: 9,
            width: 9,
            perimeter: 36,
            unit: "m",
            isSquare: true,
            intLength: 7,
            intWidth: 7,
            intPerimeter: 28,
            intIsSquare: true
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How much fencing/ribbon does ${v.name} need?`,
            body: (v) => `${v.name} is ${v.scenario}. The ${v.isSquare ? 'square' : 'rectangle'} is **${v.length}${v.unit}** long and **${v.width}${v.unit}** wide.\nThe **perimeter (the total distance around the outside)** — let's find it!`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                dimUnit: v.unit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Add all four sides!",
            body: (v) => `A ${v.isSquare ? 'square' : 'rectangle'} has **4 sides**. To find the perimeter, add them all up. Follow the steps below!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  dimUnit: v.unit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.isSquare
                    ? [
                        { text: `All 4 sides = ${v.length}${v.unit}`, why: "It's a square — all sides are equal!" },
                        { text: `Perimeter = 4 × ${v.length}`, why: "Shortcut for squares", result: `= ${v.perimeter}${v.unit} ✓` }
                      ]
                    : [
                        { text: `Two lengths: ${v.length} + ${v.length} = ${v.length * 2}`, why: "Opposite sides are equal" },
                        { text: `Two widths: ${v.width} + ${v.width} = ${v.width * 2}`, why: "The other pair" },
                        { text: `Total: ${v.length * 2} + ${v.width * 2}`, why: "Add them together", result: `= ${v.perimeter}${v.unit} ✓` }
                      ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => v.isSquare
                ? [
                    `All 4 sides are ${v.length}${v.unit}`,
                    `Perimeter = 4 × ${v.length} = ${v.perimeter}${v.unit}`
                  ]
                : [
                    `Add two lengths: ${v.length} + ${v.length} = ${v.length * 2}`,
                    `Add two widths: ${v.width} + ${v.width} = ${v.width * 2}`,
                    `Total: ${v.length * 2} + ${v.width * 2} = ${v.perimeter}${v.unit}`
                  ],
              feedback: {
                correct: (v) => `Perfect order! Add the sides step by step to get ${v.perimeter}${v.unit}. ✓`,
                incorrect: (v) => `Not quite — start by adding the two lengths, then the two widths, then combine them.`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A ${v.intIsSquare ? 'square' : 'rectangle'} is **${v.intLength}${v.unit}** long and **${v.intWidth}${v.unit}** wide. What is the perimeter?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intLength,
                width: v.intWidth,
                dimUnit: v.unit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the perimeter?`,
              getOptions: (v) => generateDistractors(v.intPerimeter),
              correctAnswer: (v) => v.intPerimeter,
              feedback: {
                correct: (v) => `Brilliant! The perimeter is **${v.intPerimeter}${v.unit}**. You added all four sides! ✓`,
                incorrect: (v) => `Not quite! Perimeter = ${v.intLength} + ${v.intWidth} + ${v.intLength} + ${v.intWidth} = **${v.intPerimeter}${v.unit}**. Remember to add ALL four sides!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The perimeter recipe!",
            body: () => `**Perimeter** = the total distance around the outside. Here's how to find it:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 8, width: 5, dimUnit: "cm" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Rectangle: P = 2 x (length + width)", why: "Add length and width, then double it." },
                    { text: "Square: P = 4 x side length", why: "All four sides are the same!" },
                    { text: "Don't confuse perimeter with area!", why: "Perimeter = adding sides. Area = multiplying sides. ✓" }
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

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "perimeter-rectangles-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot the common mistake of forgetting to double",
          "Why length + width is only HALF the perimeter"
        ],
        variableSets: [
          {
            name: "Harry",
            scenario: "calculating how much tape he needs to go around a parcel",
            length: 14,
            width: 9,
            perimeter: 46,
            wrongAnswer: 23,
            unit: "cm",
            mistakeExplanation: "only added length + width once (14 + 9 = 23) instead of doubling it",
            intLength: 13,
            intWidth: 8,
            intPerimeter: 42
          },
          {
            name: "Mia",
            scenario: "measuring the border of a notice board",
            length: 18,
            width: 6,
            perimeter: 48,
            wrongAnswer: 24,
            unit: "cm",
            mistakeExplanation: "forgot there are TWO lengths and TWO widths — added 18 + 6 but didn't double",
            intLength: 16,
            intWidth: 5,
            intPerimeter: 42
          },
          {
            name: "Ethan",
            scenario: "calculating fencing for his rabbit hutch",
            length: 11,
            width: 7,
            perimeter: 36,
            wrongAnswer: 18,
            unit: "m",
            mistakeExplanation: "did 11 + 7 = 18, forgetting to multiply by 2",
            intLength: 10,
            intWidth: 6,
            intPerimeter: 32
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}. The rectangle is **${v.length}${v.unit}** by **${v.width}${v.unit}**.\n${v.name} says the perimeter (the total distance around the outside) is **${v.wrongAnswer}${v.unit}**. That's not right!`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                dimUnit: v.unit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Don't forget to DOUBLE!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. The **perimeter** (total distance around the outside) needs all **4 sides** — two lengths and two widths. Tap to see the wrong way and the right way side by side.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  dimUnit: v.unit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.length} + ${v.width} = ${v.wrongAnswer}`, why: "Only counted 2 sides!", result: "✗" },
                    { text: `Right: 2 × (${v.length} + ${v.width}) = 2 × ${v.length + v.width}`, why: "Count all 4 sides", result: `= ${v.perimeter}${v.unit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct perimeter?",
            body: (v) => `A rectangle is **${v.intLength}${v.unit}** long and **${v.intWidth}${v.unit}** wide. What is the perimeter?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intLength,
                width: v.intWidth,
                dimUnit: v.unit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the perimeter?`,
              getOptions: (v) => generateDistractors(v.intPerimeter),
              correctAnswer: (v) => v.intPerimeter,
              feedback: {
                correct: (v) => `Well done! **2 x (${v.intLength} + ${v.intWidth}) = ${v.intPerimeter}${v.unit}**. You remembered to double! ✓`,
                incorrect: (v) => `Not quite! Perimeter = 2 × (${v.intLength} + ${v.intWidth}) = **${v.intPerimeter}${v.unit}**. Make sure you count all four sides!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Remember: all FOUR sides!",
            body: () => `The number one perimeter mistake is adding only **two** sides. A rectangle has **four**!`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 14, width: 9, dimUnit: "cm" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Length + width = HALF the perimeter", why: "That's only 2 sides out of 4!" },
                    { text: "Perimeter = 2 x (length + width)", why: "Double it to get all four sides." },
                    { text: "Quick check: is your answer roughly double (l + w)?", why: "If it's about the same as l + w, you forgot to double! ✓" }
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
  // SUB-CONCEPT 2: Missing Side from Known Perimeter
  // ==========================================
  {
    id: "missing-side-perimeter",
    name: "Finding Missing Side from Known Perimeter",
    category: "core",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "missing-side-perimeter-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to work backwards from the perimeter to find a missing side",
          "Why halving the perimeter first makes it easier"
        ],
        variableSets: [
          {
            name: "Jasmine",
            scenario: "has a rectangular garden with a perimeter of 36 m. The length is 12 m.",
            perimeter: 36,
            knownSide: 12,
            missingSide: 6,
            halfPerimeter: 18,
            unit: "m",
            knownLabel: "length",
            missingLabel: "width",
            intPerimeter: 40,
            intKnownSide: 11,
            intMissingSide: 9,
            intHalfPerimeter: 20
          },
          {
            name: "Mr Brooks",
            scenario: "has a rectangular classroom with a perimeter of 44 m. The width is 8 m.",
            perimeter: 44,
            knownSide: 8,
            missingSide: 14,
            halfPerimeter: 22,
            unit: "m",
            knownLabel: "width",
            missingLabel: "length",
            intPerimeter: 48,
            intKnownSide: 13,
            intMissingSide: 11,
            intHalfPerimeter: 24
          },
          {
            name: "Lily",
            scenario: "has a rectangular photo frame with a perimeter of 56 cm. The length is 18 cm.",
            perimeter: 56,
            knownSide: 18,
            missingSide: 10,
            halfPerimeter: 28,
            unit: "cm",
            knownLabel: "length",
            missingLabel: "width",
            intPerimeter: 46,
            intKnownSide: 16,
            intMissingSide: 7,
            intHalfPerimeter: 23
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you find the missing side?`,
            body: (v) => `${v.name} ${v.scenario}\nWhat is the ${v.missingLabel}? You know the perimeter (the total distance around the outside) — can you work **backwards** to find the missing side?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.knownSide,
                width: v.missingSide,
                dimUnit: v.unit,
                missingDim: "width"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Work backwards in two steps!",
            body: (v) => `The perimeter is **${v.perimeter}${v.unit}** and the ${v.knownLabel} is **${v.knownSide}${v.unit}**. Since perimeter counts each side **twice**, we can work backwards to find the ${v.missingLabel}. Are these statements true or false?`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.knownSide,
                  width: v.missingSide,
                  dimUnit: v.unit,
                  missingDim: "width"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Perimeter ÷ 2 = ${v.perimeter} ÷ 2`, why: "Halve the perimeter", result: `= ${v.halfPerimeter}` },
                    { text: `${v.halfPerimeter} - ${v.knownSide}`, why: `Subtract the known ${v.knownLabel}`, result: `= ${v.missingSide}${v.unit} ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `To find a missing side, you should halve the perimeter first`, answer: true, explanation: `Correct — halving gives length + width (${v.perimeter} ÷ 2 = ${v.halfPerimeter}). ✓` },
                { text: `You can subtract the known side directly from the full perimeter`, answer: false, explanation: `No! The full perimeter counts each side twice. You must halve it first, then subtract.` }
              ]
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Perimeter = **${v.intPerimeter}${v.unit}**. The ${v.knownLabel} is **${v.intKnownSide}${v.unit}**. What is the ${v.missingLabel}?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intKnownSide,
                width: v.intMissingSide,
                dimUnit: v.unit,
                missingDim: "width"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.missingLabel}?`,
              getOptions: (v) => generateDistractors(v.intMissingSide),
              correctAnswer: (v) => v.intMissingSide,
              feedback: {
                correct: (v) => `Brilliant! ${v.intPerimeter} ÷ 2 = ${v.intHalfPerimeter}, then ${v.intHalfPerimeter} - ${v.intKnownSide} = **${v.intMissingSide}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! Halve the perimeter: ${v.intPerimeter} ÷ 2 = ${v.intHalfPerimeter}. Then subtract: ${v.intHalfPerimeter} - ${v.intKnownSide} = **${v.intMissingSide}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Finding a missing side from perimeter!",
            body: () => `When you know the perimeter and one side, work backwards:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 12, width: 6, dimUnit: "m" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Halve the perimeter", why: "Perimeter ÷ 2 = length + width" },
                    { text: "Step 2: Subtract the known side", why: "What's left is the missing side!" },
                    { text: "Check: 2 × (length + width) should = perimeter", why: "Plug both sides back in to verify. ✓" }
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

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "missing-side-perimeter-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid forgetting to halve the perimeter first",
          "Why subtracting one side from the full perimeter gives the wrong answer"
        ],
        variableSets: [
          {
            name: "Oscar",
            scenario: "finding the width of a rectangular field with perimeter 50 m and length 17 m",
            perimeter: 50,
            knownSide: 17,
            missingSide: 8,
            halfPerimeter: 25,
            wrongAnswer: 33,
            unit: "m",
            mistakeExplanation: "subtracted from the full perimeter (50 - 17 = 33) instead of halving first",
            intPerimeter: 58,
            intKnownSide: 18,
            intMissingSide: 11,
            intHalfPerimeter: 29
          },
          {
            name: "Ava",
            scenario: "finding the length of a picture frame with perimeter 60 cm and width 12 cm",
            perimeter: 60,
            knownSide: 12,
            missingSide: 18,
            halfPerimeter: 30,
            wrongAnswer: 48,
            unit: "cm",
            mistakeExplanation: "did 60 - 12 = 48, forgetting to halve the perimeter first",
            intPerimeter: 52,
            intKnownSide: 14,
            intMissingSide: 12,
            intHalfPerimeter: 26
          },
          {
            name: "Isaac",
            scenario: "finding the width of a swimming pool with perimeter 46 m and length 15 m",
            perimeter: 46,
            knownSide: 15,
            missingSide: 8,
            halfPerimeter: 23,
            wrongAnswer: 31,
            unit: "m",
            mistakeExplanation: "subtracted the length from the full perimeter instead of halving first",
            intPerimeter: 44,
            intKnownSide: 16,
            intMissingSide: 6,
            intHalfPerimeter: 22
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says the missing side is **${v.wrongAnswer}${v.unit}**. That seems way too big!`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.knownSide,
                width: v.missingSide,
                dimUnit: v.unit,
                missingDim: "width"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "You must halve the perimeter first!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. The perimeter (the total distance around the outside) includes **two** of each side, so you must halve it before subtracting. Tap to see the wrong and right approach.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.knownSide,
                  width: v.missingSide,
                  dimUnit: v.unit,
                  missingDim: "width"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.perimeter} - ${v.knownSide} = ${v.wrongAnswer}`, why: "Forgot to halve!", result: "✗" },
                    { text: `Right: ${v.perimeter} ÷ 2 = ${v.halfPerimeter}`, why: "Halve first", result: "✓" },
                    { text: `Then: ${v.halfPerimeter} - ${v.knownSide} = ${v.missingSide}${v.unit}`, why: "Now subtract the known side", result: "✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `Perimeter = **${v.intPerimeter}${v.unit}**. One side = **${v.intKnownSide}${v.unit}**. What is the missing side?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intKnownSide,
                width: v.intMissingSide,
                dimUnit: v.unit,
                missingDim: "width"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing side?`,
              getOptions: (v) => generateDistractors(v.intMissingSide),
              correctAnswer: (v) => v.intMissingSide,
              feedback: {
                correct: (v) => `Well done! ${v.intPerimeter} ÷ 2 = ${v.intHalfPerimeter}, then ${v.intHalfPerimeter} - ${v.intKnownSide} = **${v.intMissingSide}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! Halve first: ${v.intPerimeter} ÷ 2 = ${v.intHalfPerimeter}. Then ${v.intHalfPerimeter} - ${v.intKnownSide} = **${v.intMissingSide}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Always halve the perimeter first!",
            body: () => `The perimeter counts each side **twice**. So to find a missing side:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 17, width: 8, dimUnit: "m" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Halve the perimeter first!", why: "Perimeter ÷ 2 = length + width (one of each)" },
                    { text: "THEN subtract the known side", why: "What's left is the missing side." },
                    { text: "If your answer is bigger than half the perimeter, something's wrong!", why: "A side can't be bigger than l + w combined. ✓" }
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
  // SUB-CONCEPT 3: Missing Side from Known Area
  // ==========================================
  {
    id: "missing-side-area",
    name: "Finding Missing Side from Known Area",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "missing-side-area-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a missing side when you know the area",
          "Why dividing the area by the known side gives the missing side"
        ],
        variableSets: [
          {
            name: "Mrs Collins",
            scenario: "has a rectangular flower bed with an area of 48 m². The length is 8 m.",
            area: 48,
            knownSide: 8,
            missingSide: 6,
            unit: "m²",
            dimUnit: "m",
            knownLabel: "length",
            missingLabel: "width",
            intArea: 56,
            intKnownSide: 7,
            intMissingSide: 8
          },
          {
            name: "Jack",
            scenario: "has a rectangular poster with an area of 72 cm². The width is 9 cm.",
            area: 72,
            knownSide: 9,
            missingSide: 8,
            unit: "cm²",
            dimUnit: "cm",
            knownLabel: "width",
            missingLabel: "length",
            intArea: 63,
            intKnownSide: 7,
            intMissingSide: 9
          },
          {
            name: "Miss Obi",
            scenario: "is tiling a wall with an area of 60 m². The height is 5 m.",
            area: 60,
            knownSide: 5,
            missingSide: 12,
            unit: "m²",
            dimUnit: "m",
            knownLabel: "height",
            missingLabel: "width",
            intArea: 54,
            intKnownSide: 6,
            intMissingSide: 9
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you find the missing side?`,
            body: (v) => `${v.name} ${v.scenario}\nYou know **Area = length x width**. If you know the area and one side, can you work out the other side? Of course — just **divide**!`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.knownSide,
                width: v.missingSide,
                dimUnit: v.dimUnit,
                areaLabel: `${v.area} ${v.unit}`,
                missingDim: "width"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide the area by the known side!",
            body: (v) => `Division undoes multiplication — so if you know the area and one side, you can find the missing side. Put the steps in order!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.knownSide,
                  width: v.missingSide,
                  dimUnit: v.dimUnit,
                  areaLabel: `${v.area} ${v.unit}`,
                  missingDim: "width"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Area = length × width`, why: "The rule for rectangle area" },
                    { text: `${v.area} = ${v.knownSide} × ?`, why: `We know the area and one side` },
                    { text: `? = ${v.area} ÷ ${v.knownSide}`, why: "Rearrange: divide area by the known side", result: `= ${v.missingSide}${v.dimUnit} ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write the rule: Area = length × width`,
                `Plug in: ${v.area} = ${v.knownSide} × ?`,
                `Divide: ${v.area} ÷ ${v.knownSide} = ${v.missingSide}${v.dimUnit}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Start with the rule, plug in what you know, then divide. ✓`,
                incorrect: (v) => `Not quite — start with the area rule, then plug in the numbers, then divide.`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Area = **${v.intArea}${v.unit}**. The ${v.knownLabel} is **${v.intKnownSide}${v.dimUnit}**. What is the ${v.missingLabel}?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intKnownSide,
                width: v.intMissingSide,
                dimUnit: v.dimUnit,
                areaLabel: `${v.intArea} ${v.unit}`,
                missingDim: "width"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intArea} ÷ ${v.intKnownSide}?`,
              getOptions: (v) => generateDistractors(v.intMissingSide),
              correctAnswer: (v) => v.intMissingSide,
              feedback: {
                correct: (v) => `Brilliant! **${v.intArea} ÷ ${v.intKnownSide} = ${v.intMissingSide}${v.dimUnit}**. Check: ${v.intKnownSide} × ${v.intMissingSide} = ${v.intArea} ✓`,
                incorrect: (v) => `Not quite! ${v.intArea} ÷ ${v.intKnownSide} = **${v.intMissingSide}${v.dimUnit}**. Divide the area by the side you know!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Finding a missing side from area!",
            body: () => `When you know the area and one side of a rectangle:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 8, width: 6, dimUnit: "m", areaLabel: "48 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Missing side = Area ÷ known side", why: "Division undoes multiplication!" },
                    { text: "Check: multiply both sides together", why: "The answer should equal the area." },
                    { text: "Think: ? × known = area", why: "This is the same as area ÷ known = ? ✓" }
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

      // ---- Lesson B: Curiosity Hook ----
      {
        id: "missing-side-area-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to use division to find a missing side from the area",
          "Why a bigger area with the same width means a longer length"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "A rectangular rug covers 54 m² of floor. It is 6 m wide.",
            area: 54,
            knownSide: 6,
            missingSide: 9,
            unit: "m²",
            dimUnit: "m",
            intArea: 42,
            intKnownSide: 7,
            intMissingSide: 6
          },
          {
            name: "Ellie",
            scenario: "A rectangular wall mural covers 84 cm². It is 7 cm tall.",
            area: 84,
            knownSide: 7,
            missingSide: 12,
            unit: "cm²",
            dimUnit: "cm",
            intArea: 78,
            intKnownSide: 6,
            intMissingSide: 13
          },
          {
            name: "Mr Patel",
            scenario: "A rectangular car park covers 96 m². It is 8 m wide.",
            area: 96,
            knownSide: 8,
            missingSide: 12,
            unit: "m²",
            dimUnit: "m",
            intArea: 91,
            intKnownSide: 7,
            intMissingSide: 13
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How long is it?`,
            body: (v) => `${v.scenario}\nHow long is it? You know the area and one side. Think about it: if ${v.knownSide} rows of **something** make ${v.area}, what's the **something**?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.knownSide,
                width: v.missingSide,
                dimUnit: v.dimUnit,
                areaLabel: `${v.area} ${v.unit}`,
                missingDim: "width"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Area ÷ one side = the other side!",
            body: (v) => `When you know the area and one side, the other side is hiding inside a division. Tap to uncover it step by step!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.knownSide,
                  width: v.missingSide,
                  dimUnit: v.dimUnit,
                  areaLabel: `${v.area} ${v.unit}`,
                  missingDim: "width"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Area = ${v.area}${v.unit}`, why: "Given" },
                    { text: `One side = ${v.knownSide}${v.dimUnit}`, why: "Given" },
                    { text: `Other side = ${v.area} ÷ ${v.knownSide} = ${v.missingSide}${v.dimUnit}`, why: "Divide area by the known side", result: "✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Area = **${v.intArea}${v.unit}**. One side = **${v.intKnownSide}${v.dimUnit}**. What is the other side?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intKnownSide,
                width: v.intMissingSide,
                dimUnit: v.dimUnit,
                areaLabel: `${v.intArea} ${v.unit}`,
                missingDim: "width"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intArea} ÷ ${v.intKnownSide}?`,
              getOptions: (v) => generateDistractors(v.intMissingSide),
              correctAnswer: (v) => v.intMissingSide,
              feedback: {
                correct: (v) => `Well done! **${v.intArea} ÷ ${v.intKnownSide} = ${v.intMissingSide}${v.dimUnit}**. The missing side is ${v.intMissingSide}${v.dimUnit}! ✓`,
                incorrect: (v) => `Not quite! ${v.intArea} ÷ ${v.intKnownSide} = **${v.intMissingSide}${v.dimUnit}**. Think: ${v.intKnownSide} × what = ${v.intArea}?`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Area and division — best friends!",
            body: () => `Finding a missing side from area is just **division in disguise**:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 6, width: 9, dimUnit: "m", areaLabel: "54 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Area = length × width", why: "The core rule." },
                    { text: "Missing side = Area ÷ known side", why: "Division undoes the multiplication." },
                    { text: "Always check by multiplying back!", why: "Known × missing should equal the area. ✓" }
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
  // SUB-CONCEPT 4: Area of Triangles
  // ==========================================
  {
    id: "area-triangles",
    name: "Area of Triangles (half base times height)",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "area-triangles-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that a triangle is half of a rectangle",
          "Why the rule is half x base x height"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "designing a triangular pennant for sports day",
            base: 10,
            height: 6,
            rectArea: 60,
            triArea: 30,
            unit: "cm²",
            dimUnit: "cm",
            intBase: 8,
            intHeight: 4,
            intRectArea: 32,
            intTriArea: 16
          },
          {
            name: "Mr Khan",
            scenario: "painting a triangular section of a wall",
            base: 8,
            height: 5,
            rectArea: 40,
            triArea: 20,
            unit: "m²",
            dimUnit: "m",
            intBase: 6,
            intHeight: 4,
            intRectArea: 24,
            intTriArea: 12
          },
          {
            name: "Zoe",
            scenario: "cutting a triangular piece of fabric for a cushion",
            base: 12,
            height: 7,
            rectArea: 84,
            triArea: 42,
            unit: "cm²",
            dimUnit: "cm",
            intBase: 10,
            intHeight: 8,
            intRectArea: 80,
            intTriArea: 40
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "What do you notice?",
            body: (v) => `Imagine a rectangle that is **${v.base}${v.dimUnit}** wide and **${v.height}${v.dimUnit}** tall. Now draw a diagonal line corner to corner. What do you get? **Two triangles!**\n\nEach triangle is exactly **half** the rectangle. So if the rectangle's area is ${v.rectArea}${v.unit}, the triangle's area is...`,
            visual: {
              component: "TriangleAreaDiagram",
              props: (v) => ({
                base: v.base,
                height: v.height,
                dimUnit: v.dimUnit,
                showRectangle: true,
                areaLabel: `${v.triArea} ${v.unit}`
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Triangle area = half the rectangle!",
            body: (v) => `A triangle is exactly **half** of the rectangle it fits inside. The height must be **perpendicular** (at a right angle) to the base, not slanted. Match each shape to its area rule!`,
            bodyParts: (v) => [
              { type: 'visual', component: 'TriangleAreaDiagram', props: (v) => ({ base: v.base, height: v.height, dimUnit: v.dimUnit, showRectangle: true, areaLabel: `${v.triArea} ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Rectangle: ${v.base} × ${v.height} = ${v.rectArea}`, why: "Full rectangle area" },
                    { text: `Triangle = half: ${v.rectArea} ÷ 2`, why: "A triangle is half of the rectangle", result: `= ${v.triArea}${v.unit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Rectangle area", right: "base × height" },
                { left: "Triangle area", right: "½ × base × height" },
                { left: "Triangle vs rectangle", right: "Exactly half" }
              ]
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A triangle has a base of **${v.intBase}${v.dimUnit}** and a height of **${v.intHeight}${v.dimUnit}**. What is the area?`,
            visual: {
              component: "TriangleAreaDiagram",
              props: (v) => ({
                base: v.intBase,
                height: v.intHeight,
                dimUnit: v.dimUnit,
                areaLabel: `? ${v.unit}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ½ × ${v.intBase} × ${v.intHeight}?`,
              getOptions: (v) => generateDistractors(v.intTriArea),
              correctAnswer: (v) => v.intTriArea,
              feedback: {
                correct: (v) => `Brilliant! ½ × ${v.intBase} × ${v.intHeight} = **${v.intTriArea}${v.unit}**. You remembered to halve! ✓`,
                incorrect: (v) => `Not quite! ${v.intBase} × ${v.intHeight} = ${v.intRectArea}. Then halve it: ${v.intRectArea} ÷ 2 = **${v.intTriArea}${v.unit}**. Don't forget the ÷ 2!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Triangle area — halve the rectangle!",
            body: () => `A triangle is **half a rectangle** with the same base and height:`,
            bodyParts: () => [
              { type: 'visual', component: 'TriangleAreaDiagram', props: () => ({ base: 10, height: 6, dimUnit: "cm", showRectangle: true, areaLabel: "30 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Area of triangle = ½ × base × height", why: "Or: base × height ÷ 2" },
                    { text: "Use the perpendicular height (straight up, at 90° to the base)", why: "Not the slanted side — the straight-up height!" },
                    { text: "The most common mistake: forgetting to halve!", why: "If your answer is double what you expected, divide by 2. ✓" }
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

      // ---- Lesson B: Step by Step ----
      {
        id: "area-triangles-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use the rule ½ × base × height step by step",
          "Why you must use the perpendicular height (straight up at 90°), not the slant"
        ],
        variableSets: [
          {
            name: "Amir",
            scenario: "A triangular garden bed has a base of 14 m and a height of 8 m.",
            base: 14,
            height: 8,
            rectArea: 112,
            triArea: 56,
            unit: "m²",
            dimUnit: "m",
            intBase: 12,
            intHeight: 6,
            intRectArea: 72,
            intTriArea: 36
          },
          {
            name: "Layla",
            scenario: "A triangular sail is 9 m at the base and 6 m tall.",
            base: 9,
            height: 6,
            rectArea: 54,
            triArea: 27,
            unit: "m²",
            dimUnit: "m",
            intBase: 10,
            intHeight: 4,
            intRectArea: 40,
            intTriArea: 20
          },
          {
            name: "Coach Taylor",
            scenario: "A triangular section of the playground is 16 m wide and 5 m deep.",
            base: 16,
            height: 5,
            rectArea: 80,
            triArea: 40,
            unit: "m²",
            dimUnit: "m",
            intBase: 14,
            intHeight: 4,
            intRectArea: 56,
            intTriArea: 28
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `What's the area of this triangle?`,
            body: (v) => `${v.scenario}\nLet's use the rule step by step!`,
            visual: {
              component: "TriangleAreaDiagram",
              props: (v) => ({
                base: v.base,
                height: v.height,
                dimUnit: v.dimUnit,
                areaLabel: `? ${v.unit}`
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Follow the rule!",
            body: (v) => `Let's find the area of this triangle with base **${v.base}${v.dimUnit}** and height **${v.height}${v.dimUnit}**. Tap each step to see how the calculation works:`,
            bodyParts: (v) => [
              { type: 'visual', component: 'TriangleAreaDiagram', props: (v) => ({ base: v.base, height: v.height, dimUnit: v.dimUnit, showRectangle: true }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Multiply base × height`, why: `${v.base} × ${v.height}`, result: `= ${v.rectArea}` },
                    { text: `Divide by 2`, why: `${v.rectArea} ÷ 2`, result: `= ${v.triArea}${v.unit}` },
                    { text: `Area = ${v.triArea}${v.unit}`, why: "That's ½ × base × height!", result: "✓" }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Base = **${v.intBase}${v.dimUnit}**, height = **${v.intHeight}${v.dimUnit}**. What's the area?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'TriangleAreaDiagram', props: (v) => ({ base: v.intBase, height: v.intHeight, dimUnit: v.dimUnit, areaLabel: `? ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `½ × ${v.intBase} × ${v.intHeight} = ?`, why: "Multiply first, then halve!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ½ × ${v.intBase} × ${v.intHeight}?`,
              getOptions: (v) => generateDistractors(v.intTriArea),
              correctAnswer: (v) => v.intTriArea,
              feedback: {
                correct: (v) => `Spot on! ½ × ${v.intBase} × ${v.intHeight} = **${v.intTriArea}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.intBase} × ${v.intHeight} = ${v.intRectArea}, then ÷ 2 = **${v.intTriArea}${v.unit}**. Multiply first, then halve!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Two steps for triangle area!",
            body: () => `Triangle area in two easy steps:`,
            bodyParts: () => [
              { type: 'visual', component: 'TriangleAreaDiagram', props: () => ({ base: 14, height: 8, dimUnit: "m", showRectangle: true, areaLabel: "56 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Multiply base × height", why: "This gives you the rectangle area." },
                    { text: "Step 2: Divide by 2", why: "The triangle is half the rectangle. Done! ✓" }
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
  // SUB-CONCEPT 5: Area of Parallelograms
  // ==========================================
  {
    id: "area-parallelograms",
    name: "Area of Parallelograms (base times height)",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "area-parallelograms-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that a parallelogram (a slanted rectangle with two pairs of parallel sides) can be rearranged into a rectangle",
          "Why the area rule is the same as a rectangle: base x height"
        ],
        variableSets: [
          {
            name: "Mrs Green",
            scenario: "designing a parallelogram-shaped flower bed",
            base: 10,
            height: 6,
            area: 60,
            slant: 7,
            unit: "m²",
            dimUnit: "m",
            intBase: 9,
            intHeight: 5,
            intArea: 45
          },
          {
            name: "Oliver",
            scenario: "cutting a parallelogram shape from cardboard",
            base: 8,
            height: 5,
            area: 40,
            slant: 6,
            unit: "cm²",
            dimUnit: "cm",
            intBase: 11,
            intHeight: 4,
            intArea: 44
          },
          {
            name: "Amara",
            scenario: "measuring a parallelogram-shaped tile",
            base: 12,
            height: 4,
            area: 48,
            slant: 5,
            unit: "cm²",
            dimUnit: "cm",
            intBase: 10,
            intHeight: 5,
            intArea: 50
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "A shape-shifting trick!",
            body: (v) => `A parallelogram looks like a **squashed rectangle**. But here's a magic trick: chop off one end and slide it to the other side... and you get a **perfect rectangle**!\n\nThat means the area rule is the same: **base × height**!`,
            visual: {
              component: "ParallelogramDiagram",
              props: (v) => ({
                base: v.base,
                height: v.height,
                slant: v.slant,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Same as a rectangle!",
            body: (v) => `A parallelogram can be rearranged into a rectangle — so the area rule is the same! But watch out for the **slant side** trap. Fill in the missing word:`,
            bodyParts: (v) => [
              { type: 'visual', component: 'ParallelogramDiagram', props: (v) => ({ base: v.base, height: v.height, slant: v.slant, dimUnit: v.dimUnit, areaLabel: `${v.area} ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Area = base × perpendicular height`, why: "Use the height at 90° to the base — same rule as a rectangle!" },
                    { text: `= ${v.base} × ${v.height}`, why: `NOT ${v.base} × ${v.slant} (that uses the slant)`, result: `= ${v.area}${v.unit} ✓` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The area of a parallelogram is base × ____ height`,
              options: (v) => ["slant", "perpendicular (at right angles)", "diagonal", "longest"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Use the perpendicular height (straight up at 90°), not the slant. ✓`,
                incorrect: (v) => `Not quite — you must use the perpendicular height (at a right angle to the base), not the slant side!`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A parallelogram has a base of **${v.intBase}${v.dimUnit}** and a perpendicular height of **${v.intHeight}${v.dimUnit}**. What is the area?`,
            visual: {
              component: "ParallelogramDiagram",
              props: (v) => ({
                base: v.intBase,
                height: v.intHeight,
                dimUnit: v.dimUnit,
                areaLabel: `? ${v.unit}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intBase} × ${v.intHeight}?`,
              getOptions: (v) => generateDistractors(v.intArea),
              correctAnswer: (v) => v.intArea,
              feedback: {
                correct: (v) => `Brilliant! **${v.intBase} × ${v.intHeight} = ${v.intArea}${v.unit}**. Same as a rectangle — just use the perpendicular height! ✓`,
                incorrect: (v) => `Not quite! ${v.intBase} × ${v.intHeight} = **${v.intArea}${v.unit}**. Remember: use the perpendicular height, not the slant!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Parallelogram = rearranged rectangle!",
            body: () => `A parallelogram and a rectangle with the same base and height have the **same area**:`,
            bodyParts: () => [
              { type: 'visual', component: 'ParallelogramDiagram', props: () => ({ base: 10, height: 6, dimUnit: "m", areaLabel: "60 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Area = base × perpendicular height", why: "Cut off one end, slide it across — it's a rectangle!" },
                    { text: "Use the perpendicular height (straight up at 90°)", why: "NOT the slant side — that's a common trap!" },
                    { text: "No halving needed!", why: "Unlike triangles, parallelograms aren't halved. ✓" }
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

      // ---- Lesson B: Step by Step ----
      {
        id: "area-parallelograms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to apply base x height for parallelograms (slanted rectangles)",
          "How to identify the perpendicular height (the straight-up height, at a right angle) vs the slant height"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "A parallelogram-shaped patio is 9 m along the base and 4 m in perpendicular height. The slant side is 5 m.",
            base: 9,
            height: 4,
            slant: 5,
            area: 36,
            wrongArea: 45,
            unit: "m²",
            dimUnit: "m",
            intBase: 11,
            intHeight: 3,
            intArea: 33
          },
          {
            name: "Priya",
            scenario: "A parallelogram window is 15 cm along the base and 8 cm in perpendicular height. The slant edge is 10 cm.",
            base: 15,
            height: 8,
            slant: 10,
            area: 120,
            wrongArea: 150,
            unit: "cm²",
            dimUnit: "cm",
            intBase: 12,
            intHeight: 7,
            intArea: 84
          },
          {
            name: "Coach Lee",
            scenario: "A parallelogram-shaped pitch is 20 m along the base and 12 m in perpendicular height. The slant side is 13 m.",
            base: 20,
            height: 12,
            slant: 13,
            area: 240,
            wrongArea: 260,
            unit: "m²",
            dimUnit: "m",
            intBase: 18,
            intHeight: 11,
            intArea: 198
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Which height do you use?`,
            body: (v) => `${v.scenario}\nCareful! There are two measurements that look like "height" — the perpendicular height of **${v.height}${v.dimUnit}** and the **slant** of ${v.slant}${v.dimUnit}. Which one goes in the rule?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'ParallelogramDiagram', props: (v) => ({ base: v.base, height: v.height, slant: v.slant, dimUnit: v.dimUnit }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Base = ${v.base}${v.dimUnit}`, why: "The bottom edge" },
                    { text: `Perpendicular height = ${v.height}${v.dimUnit}`, why: "Straight up from base" },
                    { text: `Slant side = ${v.slant}${v.dimUnit}`, why: "The tilted edge — NOT the height!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Always use the perpendicular height!",
            body: (v) => `The question gives you two measurements that look like heights — but only the **perpendicular** one goes in the rule. Match each measurement to what it is:`,
            bodyParts: (v) => [
              { type: 'visual', component: 'ParallelogramDiagram', props: (v) => ({ base: v.base, height: v.height, slant: v.slant, dimUnit: v.dimUnit, areaLabel: `${v.area} ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Correct: ${v.base} × ${v.height} = ${v.area}${v.unit}`, why: "Using perpendicular height", result: "✓" },
                    { text: `Wrong: ${v.base} × ${v.slant} = ${v.wrongArea}`, why: "Using slant — too big!", result: "✗" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: `${v.height}${v.dimUnit}`, right: "Perpendicular height (use this!)" },
                { left: `${v.slant}${v.dimUnit}`, right: "Slant side (do NOT use!)" },
                { left: `${v.area}${v.unit}`, right: `${v.base} × ${v.height}` }
              ]
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Base = **${v.intBase}${v.dimUnit}**, perpendicular height = **${v.intHeight}${v.dimUnit}**. What is the area?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'ParallelogramDiagram', props: (v) => ({ base: v.intBase, height: v.intHeight, dimUnit: v.dimUnit, areaLabel: `? ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.intBase} × ${v.intHeight} = ?`, why: "Base × perpendicular height" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the area?`,
              getOptions: (v) => generateDistractors(v.intArea),
              correctAnswer: (v) => v.intArea,
              feedback: {
                correct: (v) => `Well done! **${v.intBase} × ${v.intHeight} = ${v.intArea}${v.unit}**. You used the right height! ✓`,
                incorrect: (v) => `Not quite! Area = base × perpendicular height = ${v.intBase} × ${v.intHeight} = **${v.intArea}${v.unit}**. Did you accidentally use the slant?`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Perpendicular height — the key!",
            body: () => `The most common mistake with parallelograms is using the **wrong height**:`,
            bodyParts: () => [
              { type: 'visual', component: 'ParallelogramDiagram', props: () => ({ base: 9, height: 4, dimUnit: "m", areaLabel: "36 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Perpendicular height = straight up at 90°", why: "This is what you multiply by the base." },
                    { text: "Slant height = the tilted edge", why: "This is NOT used in the area rule!" },
                    { text: "Look for the right-angle marker", why: "It shows you which measurement is the perpendicular height. ✓" }
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
  // SUB-CONCEPT 6: Compound Shapes (L-shapes)
  // ==========================================
  {
    id: "compound-shapes",
    name: "Splitting L-shapes into Rectangles",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "compound-shapes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to split an L-shape into two rectangles",
          "How to find the area of each rectangle and add them"
        ],
        variableSets: [
          {
            name: "Mrs Walters",
            scenario: "tiling an L-shaped kitchen floor",
            rect1_l: 10, rect1_w: 4, rect1_area: 40,
            rect2_l: 6, rect2_w: 3, rect2_area: 18,
            totalArea: 58,
            unit: "m²",
            dimUnit: "m",
            intRect1_l: 9, intRect1_w: 5, intRect1_area: 45,
            intRect2_l: 4, intRect2_w: 3, intRect2_area: 12,
            intTotalArea: 57
          },
          {
            name: "James",
            scenario: "covering an L-shaped notice board with paper",
            rect1_l: 8, rect1_w: 5, rect1_area: 40,
            rect2_l: 4, rect2_w: 3, rect2_area: 12,
            totalArea: 52,
            unit: "cm²",
            dimUnit: "cm",
            intRect1_l: 10, intRect1_w: 4, intRect1_area: 40,
            intRect2_l: 5, intRect2_w: 2, intRect2_area: 10,
            intTotalArea: 50
          },
          {
            name: "Miss Patel",
            scenario: "painting an L-shaped wall in the art room",
            rect1_l: 12, rect1_w: 3, rect1_area: 36,
            rect2_l: 7, rect2_w: 5, rect2_area: 35,
            totalArea: 71,
            unit: "m²",
            dimUnit: "m",
            intRect1_l: 11, intRect1_w: 4, intRect1_area: 44,
            intRect2_l: 6, intRect2_w: 3, intRect2_area: 18,
            intTotalArea: 62
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "An L-shape — how do you find the area?",
            body: (v) => `${v.name} is ${v.scenario}. The shape isn't a simple rectangle — it's an **L-shape**!\nThe trick: **split it into two rectangles**, find each area, then **add** them together.`,
            visual: {
              component: "LShapeDiagram",
              props: (v) => ({
                totalLength: v.rect1_l,
                totalWidth: v.rect1_w + v.rect2_w,
                cutLength: v.rect1_l - v.rect2_l,
                cutWidth: v.rect2_w,
                rect1: { label: "A", length: v.rect1_l, width: v.rect1_w },
                rect2: { label: "B", length: v.rect2_l, width: v.rect2_w },
                dimUnit: v.dimUnit,
                showSplit: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Split, calculate, add!",
            body: (v) => `Draw a line to split the L-shape into **Rectangle A** and **Rectangle B**. Tap to reveal the steps!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'LShapeDiagram',
                props: (v) => ({
                  totalLength: v.rect1_l,
                  totalWidth: v.rect1_w + v.rect2_w,
                  cutLength: v.rect1_l - v.rect2_l,
                  cutWidth: v.rect2_w,
                  rect1: { label: "A", length: v.rect1_l, width: v.rect1_w },
                  rect2: { label: "B", length: v.rect2_l, width: v.rect2_w },
                  dimUnit: v.dimUnit,
                  showSplit: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Rectangle A: ${v.rect1_l} × ${v.rect1_w}`, why: "First rectangle", result: `= ${v.rect1_area}${v.unit}` },
                    { text: `Rectangle B: ${v.rect2_l} × ${v.rect2_w}`, why: "Second rectangle", result: `= ${v.rect2_area}${v.unit}` },
                    { text: `Total: ${v.rect1_area} + ${v.rect2_area}`, why: "Add both areas", result: `= ${v.totalArea}${v.unit} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Rectangle A is **${v.intRect1_l}${v.dimUnit} × ${v.intRect1_w}${v.dimUnit}**. Rectangle B is **${v.intRect2_l}${v.dimUnit} × ${v.intRect2_w}${v.dimUnit}**. What is the total area?`,
            visual: {
              component: "LShapeDiagram",
              props: (v) => ({
                totalLength: v.intRect1_l,
                totalWidth: v.intRect1_w + v.intRect2_w,
                cutLength: v.intRect1_l - v.intRect2_l,
                cutWidth: v.intRect2_w,
                rect1: { label: "A", length: v.intRect1_l, width: v.intRect1_w },
                rect2: { label: "B", length: v.intRect2_l, width: v.intRect2_w },
                dimUnit: v.dimUnit,
                showSplit: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intRect1_area} + ${v.intRect2_area}?`,
              getOptions: (v) => generateDistractors(v.intTotalArea),
              correctAnswer: (v) => v.intTotalArea,
              feedback: {
                correct: (v) => `Brilliant! **${v.intRect1_area} + ${v.intRect2_area} = ${v.intTotalArea}${v.unit}**. Split, calculate, add — you've got it! ✓`,
                incorrect: (v) => `Not quite! ${v.intRect1_area} + ${v.intRect2_area} = **${v.intTotalArea}${v.unit}**. Add the two rectangle areas together!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Compound shapes — split and add!",
            body: () => `Any compound shape can be split into simpler shapes:`,
            bodyParts: () => [
              { type: 'visual', component: 'LShapeDiagram', props: () => ({
                totalLength: 10,
                totalWidth: 7,
                cutLength: 4,
                cutWidth: 3,
                rect1: { label: "A", length: 10, width: 4 },
                rect2: { label: "B", length: 6, width: 3 },
                dimUnit: "m",
                showSplit: true
              }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Draw a line to split it into rectangles", why: "Look for where you can divide it neatly." },
                    { text: "Step 2: Find the area of each rectangle", why: "Length × width for each one." },
                    { text: "Step 3: Add the areas together", why: "Total area = Area A + Area B. ✓" }
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

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "compound-shapes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot mistakes in splitting compound shapes (shapes made from simpler shapes joined together)",
          "Why you need to use the right dimensions for each rectangle"
        ],
        variableSets: [
          {
            name: "Tyler",
            scenario: "finding the area of an L-shaped room",
            rect1_l: 9, rect1_w: 5, rect1_area: 45,
            rect2_l: 4, rect2_w: 3, rect2_area: 12,
            totalArea: 57,
            wrongArea: 135,
            unit: "m²",
            dimUnit: "m",
            mistakeExplanation: "multiplied the total length by the total width (9 × 15 = 135) as if it were a full rectangle, instead of splitting the L-shape",
            intRect1_l: 8, intRect1_w: 4, intRect1_area: 32,
            intRect2_l: 5, intRect2_w: 3, intRect2_area: 15,
            intTotalArea: 47
          },
          {
            name: "Chloe",
            scenario: "measuring an L-shaped playground area",
            rect1_l: 12, rect1_w: 6, rect1_area: 72,
            rect2_l: 5, rect2_w: 4, rect2_area: 20,
            totalArea: 92,
            wrongArea: 120,
            unit: "m²",
            dimUnit: "m",
            mistakeExplanation: "used the wrong width for Rectangle B, giving 5 × 6 = 30 instead of 5 × 4 = 20",
            intRect1_l: 10, intRect1_w: 5, intRect1_area: 50,
            intRect2_l: 6, intRect2_w: 3, intRect2_area: 18,
            intTotalArea: 68
          },
          {
            name: "Nathan",
            scenario: "calculating carpet for an L-shaped hallway",
            rect1_l: 8, rect1_w: 3, rect1_area: 24,
            rect2_l: 5, rect2_w: 4, rect2_area: 20,
            totalArea: 44,
            wrongArea: 96,
            unit: "m²",
            dimUnit: "m",
            mistakeExplanation: "treated the entire shape as one big rectangle (8 × 12 = 96) instead of splitting it into two",
            intRect1_l: 7, intRect1_w: 4, intRect1_area: 28,
            intRect2_l: 3, intRect2_w: 3, intRect2_area: 9,
            intTotalArea: 37
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says the area is **${v.wrongArea}${v.unit}**. But the correct answer is much smaller!`,
            visual: {
              component: "LShapeDiagram",
              props: (v) => ({
                totalLength: v.rect1_l,
                totalWidth: v.rect1_w + v.rect2_w,
                cutLength: v.rect1_l - v.rect2_l,
                cutWidth: v.rect2_w,
                rect1: { label: "A", length: v.rect1_l, width: v.rect1_w },
                rect2: { label: "B", length: v.rect2_l, width: v.rect2_w },
                dimUnit: v.dimUnit,
                showSplit: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Split it properly!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. You must split the L-shape into **two separate rectangles** and use the correct dimensions for each. Tap to see the right approach.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'LShapeDiagram',
                props: (v) => ({
                  totalLength: v.rect1_l,
                  totalWidth: v.rect1_w + v.rect2_w,
                  cutLength: v.rect1_l - v.rect2_l,
                  cutWidth: v.rect2_w,
                  rect1: { label: "A", length: v.rect1_l, width: v.rect1_w },
                  rect2: { label: "B", length: v.rect2_l, width: v.rect2_w },
                  dimUnit: v.dimUnit,
                  showSplit: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.wrongArea}${v.unit}`, why: v.mistakeExplanation, result: "✗" },
                    { text: `Rectangle A: ${v.rect1_l} × ${v.rect1_w} = ${v.rect1_area}`, why: "First rectangle", result: "✓" },
                    { text: `Rectangle B: ${v.rect2_l} × ${v.rect2_w} = ${v.rect2_area}`, why: "Second rectangle", result: "✓" },
                    { text: `Total: ${v.rect1_area} + ${v.rect2_area} = ${v.totalArea}`, why: "Add them together", result: `${v.totalArea}${v.unit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct area?",
            body: (v) => `Rectangle A: **${v.intRect1_l} × ${v.intRect1_w}** = ${v.intRect1_area}. Rectangle B: **${v.intRect2_l} × ${v.intRect2_w}** = ${v.intRect2_area}. Total?`,
            visual: {
              component: "LShapeDiagram",
              props: (v) => ({
                totalLength: v.intRect1_l,
                totalWidth: v.intRect1_w + v.intRect2_w,
                cutLength: v.intRect1_l - v.intRect2_l,
                cutWidth: v.intRect2_w,
                rect1: { label: "A", length: v.intRect1_l, width: v.intRect1_w },
                rect2: { label: "B", length: v.intRect2_l, width: v.intRect2_w },
                dimUnit: v.dimUnit,
                showSplit: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the total area?`,
              getOptions: (v) => generateDistractors(v.intTotalArea),
              correctAnswer: (v) => v.intTotalArea,
              feedback: {
                correct: (v) => `Well done! **${v.intRect1_area} + ${v.intRect2_area} = ${v.intTotalArea}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.intRect1_area} + ${v.intRect2_area} = **${v.intTotalArea}${v.unit}**. Make sure you're adding, not multiplying!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Don't treat an L-shape as a rectangle!",
            body: () => `The biggest compound shape mistake is treating the whole shape as one rectangle:`,
            bodyParts: () => [
              { type: 'visual', component: 'LShapeDiagram', props: () => ({
                totalLength: 9,
                totalWidth: 8,
                cutLength: 5,
                cutWidth: 3,
                rect1: { label: "A", length: 9, width: 5 },
                rect2: { label: "B", length: 4, width: 3 },
                dimUnit: "m",
                showSplit: true
              }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "An L-shape is NOT a full rectangle", why: "A corner is missing — so you can't just do total l × total w." },
                    { text: "Split into separate rectangles", why: "Each rectangle gets its OWN length and width." },
                    { text: "Add the separate areas together", why: "Total area = sum of the parts. ✓" }
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
  // SUB-CONCEPT 7: Area vs Perimeter
  // ==========================================
  {
    id: "area-vs-perimeter",
    name: "Same Area Does Not Mean Same Perimeter",
    category: "other",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "area-vs-perimeter-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand that two shapes can have the same area but different perimeters",
          "Why area and perimeter measure different things"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "comparing two rectangular gardens",
            shape1_l: 6, shape1_w: 4, area: 24,
            shape1_p: 20,
            shape2_l: 12, shape2_w: 2,
            shape2_p: 28,
            unit: "m²",
            dimUnit: "m",
            intShape_l: 8, intShape_w: 3, intShape_p: 22
          },
          {
            name: "Mr Lewis",
            scenario: "comparing two rectangular classrooms",
            shape1_l: 9, shape1_w: 4, area: 36,
            shape1_p: 26,
            shape2_l: 18, shape2_w: 2,
            shape2_p: 40,
            unit: "m²",
            dimUnit: "m",
            intShape_l: 12, intShape_w: 3, intShape_p: 30
          },
          {
            name: "Isla",
            scenario: "comparing two rectangular posters",
            shape1_l: 8, shape1_w: 3, area: 24,
            shape1_p: 22,
            shape2_l: 24, shape2_w: 1,
            shape2_p: 50,
            unit: "cm²",
            dimUnit: "cm",
            intShape_l: 6, intShape_w: 4, intShape_p: 20
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Same area — same perimeter?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nRectangle A is **${v.shape1_l}${v.dimUnit} × ${v.shape1_w}${v.dimUnit}**.\nRectangle B is **${v.shape2_l}${v.dimUnit} × ${v.shape2_w}${v.dimUnit}**.\n\nBoth have the same area (**${v.area}${v.unit}**). But do they have the same perimeter (the total distance around the outside)?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.shape1_l,
                width: v.shape1_w,
                dimUnit: v.dimUnit,
                areaLabel: `${v.area} ${v.unit}`
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Area and perimeter are DIFFERENT!",
            body: (v) => `These two rectangles have the same area — but very different perimeters! Match each concept to its meaning:`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.shape1_l,
                  width: v.shape1_w,
                  dimUnit: v.dimUnit,
                  areaLabel: `${v.area} ${v.unit}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Rectangle A: ${v.shape1_l} × ${v.shape1_w} = ${v.area}`, why: `Perimeter = 2×(${v.shape1_l}+${v.shape1_w}) = ${v.shape1_p}${v.dimUnit}` },
                    { text: `Rectangle B: ${v.shape2_l} × ${v.shape2_w} = ${v.area}`, why: `Perimeter = 2×(${v.shape2_l}+${v.shape2_w}) = ${v.shape2_p}${v.dimUnit}` },
                    { text: `Same area, different perimeters!`, why: "Longer and thinner = bigger perimeter", result: "✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Area", right: "Space inside (multiply)" },
                { left: "Perimeter", right: "Distance around (add)" },
                { left: "Same area", right: "Can have different perimeters" }
              ]
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Find the perimeter!",
            body: (v) => `A rectangle is **${v.intShape_l}${v.dimUnit}** long and **${v.intShape_w}${v.dimUnit}** wide. What is its perimeter?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'RectangleDiagram', props: (v) => ({ length: v.intShape_l, width: v.intShape_w, dimUnit: v.dimUnit }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `2 × (${v.intShape_l} + ${v.intShape_w}) = ?`, why: "Add length and width, then double" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the perimeter?`,
              getOptions: (v) => generateDistractors(v.intShape_p),
              correctAnswer: (v) => v.intShape_p,
              feedback: {
                correct: (v) => `Correct! 2 × (${v.intShape_l} + ${v.intShape_w}) = **${v.intShape_p}${v.dimUnit}**. Perimeter is the distance around the outside! ✓`,
                incorrect: (v) => `Not quite! 2 × (${v.intShape_l} + ${v.intShape_w}) = **${v.intShape_p}${v.dimUnit}**. Remember to double!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Area and perimeter — not the same!",
            body: () => `This is a really important thing to remember:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 6, width: 4, dimUnit: "m", areaLabel: "24 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Same area does NOT mean same perimeter", why: "A long thin shape has more perimeter than a square-ish shape with the same area." },
                    { text: "Area = flat space inside (multiply)", why: "Measured in cm², m², etc." },
                    { text: "Perimeter = distance around (add)", why: "Measured in cm, m, etc. — no ² symbol! ✓" }
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
        id: "area-vs-perimeter-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to tell area and perimeter apart in exam questions",
          "Why the units are different (cm² vs cm)"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "a rectangular swimming pool that is 10 m long and 6 m wide",
            length: 10,
            width: 6,
            area: 60,
            perimeter: 32,
            areaUnit: "m²",
            perimeterUnit: "m",
            intLength: 9,
            intWidth: 7,
            intArea: 63
          },
          {
            name: "Mr Ahmed",
            scenario: "a rectangular whiteboard that is 15 cm long and 8 cm wide",
            length: 15,
            width: 8,
            area: 120,
            perimeter: 46,
            areaUnit: "cm²",
            perimeterUnit: "cm",
            intLength: 12,
            intWidth: 9,
            intArea: 108
          },
          {
            name: "Grace",
            scenario: "a rectangular table that is 12 m long and 5 m wide",
            length: 12,
            width: 5,
            area: 60,
            perimeter: 34,
            areaUnit: "m²",
            perimeterUnit: "m",
            intLength: 11,
            intWidth: 4,
            intArea: 44
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Area or perimeter — which one?",
            body: (v) => `${v.name} has ${v.scenario}.\n\n**Area** = ${v.length} × ${v.width} = **${v.area}${v.areaUnit}**\n**Perimeter (the total distance around the outside)** = 2 × (${v.length} + ${v.width}) = **${v.perimeter}${v.perimeterUnit}**\n\nNotice: the **units** are different! Area uses ², perimeter doesn't.`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                dimUnit: v.perimeterUnit,
                areaLabel: `${v.area} ${v.areaUnit}`
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "How to tell them apart!",
            body: (v) => `Take ${v.name}'s rectangle (**${v.length}${v.perimeterUnit}** × **${v.width}${v.perimeterUnit}**). Area = ${v.length} × ${v.width} = **${v.area}${v.areaUnit}**. Perimeter = 2 × (${v.length} + ${v.width}) = **${v.perimeter}${v.perimeterUnit}**.\n\nNotice the different **units** and **operations**! Fill in the blank:`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'RectangleDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  dimUnit: v.perimeterUnit,
                  areaLabel: `${v.area} ${v.areaUnit}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                  { text: `Area = MULTIPLY (${v.length} × ${v.width} = ${v.area})`, why: `How much space inside? Units have ² → ${v.areaUnit}` },
                  { text: `Perimeter = ADD (${v.length} + ${v.width} + ${v.length} + ${v.width} = ${v.perimeter})`, why: `How far around the outside? No ² → ${v.perimeterUnit}` },
                  { text: "Read the question carefully!", why: "Covering/filling = area. Fencing/border = perimeter. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `"How much carpet to cover the floor?" is asking for the ____`,
              options: (v) => ["perimeter", "area", "volume", "length"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Covering a surface means area. Perimeter is the distance around the edge. ✓`,
                incorrect: (v) => `Not quite — "covering" a surface is about the space inside, which is area!`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Find the area!",
            body: (v) => `A rectangle is **${v.intLength}${v.perimeterUnit}** long and **${v.intWidth}${v.perimeterUnit}** wide. How much surface does it cover?`,
            visual: {
              component: "RectangleDiagram",
              props: (v) => ({
                length: v.intLength,
                width: v.intWidth,
                dimUnit: v.perimeterUnit,
                areaLabel: `? ${v.areaUnit}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the area?`,
              getOptions: (v) => generateDistractors(v.intArea),
              correctAnswer: (v) => v.intArea,
              feedback: {
                correct: (v) => `Well done! Covering a surface is **area** = ${v.intLength} × ${v.intWidth} = **${v.intArea}${v.areaUnit}** ✓`,
                incorrect: (v) => `Not quite! Area = ${v.intLength} × ${v.intWidth} = **${v.intArea}${v.areaUnit}**. "Covering" means area (multiply length × width)!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The cheat sheet!",
            body: () => `Here's how to never mix up area and perimeter again:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 10, width: 6, dimUnit: "m", areaLabel: "60 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "AREA = inside space = multiply = cm² or m²", why: "Think: paint, tiles, carpet, grass" },
                    { text: "PERIMETER = outside edge = add = cm or m", why: "Think: fence, frame, border, string" },
                    { text: "Quick check: does the unit have ²?", why: "² = area. No ² = perimeter. ✓" }
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
  // SUB-CONCEPT 8: Unit Conversion (cm² ↔ m²)
  // ==========================================
  {
    id: "unit-conversion",
    name: "Converting cm² and m²",
    category: "other",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "unit-conversion-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "Why 1 m² = 10,000 cm² (not 100 cm²)",
          "How to convert between square units"
        ],
        variableSets: [
          {
            name: "Isaac",
            scenario: "converting the area of his bedroom floor from m² to cm²",
            areaM: 12,
            areaCm: 120000,
            wrongAnswer: 1200,
            unit: "m²",
            intAreaM: 8,
            intAreaCm: 80000
          },
          {
            name: "Miss Clarke",
            scenario: "converting playground area from m² to cm²",
            areaM: 5,
            areaCm: 50000,
            wrongAnswer: 500,
            unit: "m²",
            intAreaM: 6,
            intAreaCm: 60000
          },
          {
            name: "Ruby",
            scenario: "converting a table area from cm² to m²",
            areaM: 3,
            areaCm: 30000,
            wrongAnswer: 300,
            unit: "m²",
            intAreaM: 4,
            intAreaCm: 40000
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "1 m² = how many cm²?",
            body: () => `Most people say **100 cm²** — but that's WRONG!\n\n1 metre = 100 cm. But 1 **square** metre is a square that's 100 cm by 100 cm.\n**100 × 100 = 10,000**\n\nSo **1 m² = 10,000 cm²**. That's a lot bigger than you'd think!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: `1 m = 100 cm`, why: "For length, just multiply by 100" },
                  { text: `1 m² = 100 × 100 cm²`, why: "For area, multiply TWICE (both dimensions!)", result: "= 10,000 cm²" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Multiply by 10,000, not 100!",
            body: (v) => `${v.name} is ${v.scenario}. The area is **${v.areaM} m²** — but how many cm² is that? Converting area units is **not** the same as converting length units!`,
            bodyParts: (v) => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 100, width: 100, dimUnit: "cm", areaLabel: "1 m² = 10,000 cm²" }) },
              { type: 'text', content: (v) => `Since 1 m² = **10,000** cm², we multiply ${v.areaM} by 10,000:` },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.areaM} m² × 10,000 = ${v.areaCm} cm²`, why: "Multiply by 10,000 for area!", result: "✓" },
                    { text: `Common mistake: ${v.areaM} × 100 = ${v.wrongAnswer}`, why: "That's only for converting lengths, not areas!", result: "✗" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To convert m² to cm², multiply by ____`,
              options: (v) => ["100", "1,000", "10,000", "100,000"],
              correctIndex: (v) => 2,
              feedback: {
                correct: (v) => `Yes! 1 m² = 100 × 100 = 10,000 cm². You must square the multiplier for area! ✓`,
                incorrect: (v) => `Not quite — for area you square the conversion factor: 100² = 10,000. So multiply by 10,000!`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.intAreaM} m²** to cm².`,
            bodyParts: (v) => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 1, width: 1, dimUnit: "m", areaLabel: "1 m² = 10,000 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.intAreaM} m² = ? cm²`, why: "Remember: × 10,000 for square units!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intAreaM} m² in cm²?`,
              getOptions: (v) => generateDistractors(v.intAreaCm),
              correctAnswer: (v) => v.intAreaCm,
              feedback: {
                correct: (v) => `Brilliant! **${v.intAreaM} × 10,000 = ${v.intAreaCm} cm²**. You remembered the 10,000! ✓`,
                incorrect: (v) => `Not quite! ${v.intAreaM} × 10,000 = **${v.intAreaCm} cm²**. For area, multiply by 10,000 (not 100)!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Square unit conversions!",
            body: () => `When converting **area** (square) units, the number you multiply by gets **squared** too:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 1, width: 1, dimUnit: "m", areaLabel: "1 m² = 10,000 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1 m² = 10,000 cm²", why: "Because 100 × 100 = 10,000 (not just 100!)" },
                    { text: "m² → cm²: multiply by 10,000", why: "Going to a smaller unit = bigger number" },
                    { text: "cm² → m²: divide by 10,000", why: "Going to a bigger unit = smaller number. ✓" }
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

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "unit-conversion-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot the 100 vs 10,000 mistake",
          "Why you must square the multiplier when converting area units"
        ],
        variableSets: [
          {
            name: "Lucas",
            scenario: "converting his rectangular garden (4 m²) to cm²",
            areaM: 4,
            areaCm: 40000,
            wrongAnswer: 400,
            mistakeExplanation: "multiplied by 100 instead of 10,000",
            intAreaM: 6,
            intAreaCm: 60000
          },
          {
            name: "Freya",
            scenario: "converting a playground area (7 m²) to cm²",
            areaM: 7,
            areaCm: 70000,
            wrongAnswer: 700,
            mistakeExplanation: "used × 100 (the length conversion) instead of × 10,000 (the area conversion)",
            intAreaM: 11,
            intAreaCm: 110000
          },
          {
            name: "Mr Obi",
            scenario: "converting a classroom area (9 m²) to cm²",
            areaM: 9,
            areaCm: 90000,
            wrongAnswer: 900,
            mistakeExplanation: "forgot that for area you need to square the multiplier: 100² = 10,000",
            intAreaM: 5,
            intAreaCm: 50000
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says: ${v.areaM} m² = **${v.wrongAnswer} cm²**.\nThat doesn't seem right...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer} cm²`, why: "Hmm, that seems too small!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "× 10,000, not × 100!",
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} wrote ${v.areaM} × 100 = **${v.wrongAnswer} cm²**, but ${v.name} ${v.mistakeExplanation}.\n\nWhen you convert **area** (square) units, you must **square** the multiplier too:`,
            bodyParts: (v) => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 100, width: 100, dimUnit: "cm", areaLabel: "1 m² = 10,000 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.areaM} × 100 = ${v.wrongAnswer} cm²`, why: "That's the length conversion, not area!", result: "✗" },
                    { text: `Right: ${v.areaM} × 10,000 = ${v.areaCm} cm²`, why: "Square the conversion: 100² = 10,000", result: "✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `1 m² = 10,000 cm²`, answer: true, explanation: `Correct — 100 × 100 = 10,000, so 1 m² = 10,000 cm². ✓` },
                { text: `To convert m² to cm², you multiply by 100`, answer: false, explanation: `No! 100 is for lengths. For area you square it: 100² = 10,000.` },
                { text: `${v.areaM} m² = ${v.areaCm} cm²`, answer: true, explanation: `Correct — ${v.areaM} × 10,000 = ${v.areaCm}. ✓` }
              ]
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `Convert **${v.intAreaM} m²** to cm².`,
            bodyParts: (v) => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 1, width: 1, dimUnit: "m", areaLabel: "1 m² = 10,000 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.intAreaM} × 10,000 = ?`, why: "Remember: area uses × 10,000!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intAreaM} m² in cm²?`,
              getOptions: (v) => generateDistractors(v.intAreaCm),
              correctAnswer: (v) => v.intAreaCm,
              feedback: {
                correct: (v) => `Well done! **${v.intAreaM} × 10,000 = ${v.intAreaCm} cm²**! ✓`,
                incorrect: (v) => `Not quite! ${v.intAreaM} × 10,000 = **${v.intAreaCm} cm²**. For area, always multiply by 10,000!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The conversion trap!",
            body: () => `The exam loves to test whether you know the difference:`,
            bodyParts: () => [
              { type: 'visual', component: 'RectangleDiagram', props: () => ({ length: 1, width: 1, dimUnit: "m", areaLabel: "1 m² = 10,000 cm²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Length: 1 m = 100 cm", why: "Just one dimension." },
                    { text: "Area: 1 m² = 10,000 cm²", why: "Two dimensions: 100 × 100 = 10,000" },
                    { text: "Volume: 1 m³ = 1,000,000 cm³", why: "Three dimensions: 100 × 100 × 100 = 1,000,000! ✓" }
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
  // SUB-CONCEPT 9: Paths and Borders
  // ==========================================
  {
    id: "paths-and-borders",
    name: "Area of Path/Border (outer minus inner)",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "paths-and-borders-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to find the area of a border or path around a rectangle",
          "Why you subtract inner area from outer area"
        ],
        variableSets: [
          {
            name: "Mrs Green",
            scenario: "laying a stone path around a rectangular pond",
            innerL: 8, innerW: 5, innerArea: 40,
            pathWidth: 1,
            outerL: 10, outerW: 7, outerArea: 70,
            pathArea: 30,
            unit: "m²",
            dimUnit: "m",
            intOuterArea: 63,
            intInnerArea: 35,
            intPathArea: 28
          },
          {
            name: "Mr Okonkwo",
            scenario: "putting a border around a rectangular noticeboard",
            innerL: 12, innerW: 8, innerArea: 96,
            pathWidth: 2,
            outerL: 16, outerW: 12, outerArea: 192,
            pathArea: 96,
            unit: "cm²",
            dimUnit: "cm",
            intOuterArea: 150,
            intInnerArea: 80,
            intPathArea: 70
          },
          {
            name: "Daisy",
            scenario: "designing a frame around a rectangular photo",
            innerL: 10, innerW: 6, innerArea: 60,
            pathWidth: 1,
            outerL: 12, outerW: 8, outerArea: 96,
            pathArea: 36,
            unit: "cm²",
            dimUnit: "cm",
            intOuterArea: 88,
            intInnerArea: 54,
            intPathArea: 34
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "How much path is there?",
            body: (v) => `${v.name} is ${v.scenario}.\nThe inner rectangle is **${v.innerL}${v.dimUnit} × ${v.innerW}${v.dimUnit}**. The path is **${v.pathWidth}${v.dimUnit}** wide all the way around.\nHow do you find the area of **just the path** (the yellow part)? There's a clever trick!`,
            visual: {
              component: "PathBorderDiagram",
              props: (v) => ({
                outerL: v.outerL,
                outerW: v.outerW,
                innerL: v.innerL,
                innerW: v.innerW,
                pathWidth: v.pathWidth,
                dimUnit: v.dimUnit,
                innerLabel: `${v.innerArea} ${v.unit}`,
                pathLabel: "Path"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Outer minus inner!",
            body: (v) => `${v.name} is ${v.scenario}. The outer rectangle is **${v.outerL}${v.dimUnit} × ${v.outerW}${v.dimUnit}** and the inner one is **${v.innerL}${v.dimUnit} × ${v.innerW}${v.dimUnit}**.\n\nTo find the area of just the path, work out the **whole thing**, then **subtract** the inside. Put the steps in order!`,
            bodyParts: (v) => [
              { type: 'visual', component: 'PathBorderDiagram', props: (v) => ({ outerL: v.outerL, outerW: v.outerW, innerL: v.innerL, innerW: v.innerW, pathWidth: v.pathWidth, dimUnit: v.dimUnit, innerLabel: `${v.innerArea} ${v.unit}`, pathLabel: `${v.pathArea} ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Outer: ${v.outerL} × ${v.outerW} = ${v.outerArea}${v.unit}`, why: `Inner + ${v.pathWidth} on each side` },
                    { text: `Inner: ${v.innerL} × ${v.innerW} = ${v.innerArea}${v.unit}`, why: "The rectangle inside" },
                    { text: `Path: ${v.outerArea} − ${v.innerArea} = ${v.pathArea}${v.unit}`, why: "Outer minus inner!", result: "✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find outer area: ${v.outerL} × ${v.outerW} = ${v.outerArea}${v.unit}`,
                `Find inner area: ${v.innerL} × ${v.innerW} = ${v.innerArea}${v.unit}`,
                `Subtract: ${v.outerArea} − ${v.innerArea} = ${v.pathArea}${v.unit}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Outer area first, then inner, then subtract. ✓`,
                incorrect: (v) => `Not quite — find the outer area first, then the inner area, then subtract to get the path.`
              }
            }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Outer area = **${v.intOuterArea}${v.unit}**. Inner area = **${v.intInnerArea}${v.unit}**. What is the area of just the path?`,
            visual: {
              component: "PathBorderDiagram",
              props: (v) => ({
                outerL: v.outerL,
                outerW: v.outerW,
                innerL: v.innerL,
                innerW: v.innerW,
                pathWidth: v.pathWidth,
                dimUnit: v.dimUnit,
                innerLabel: `${v.intInnerArea} ${v.unit}`,
                pathLabel: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intOuterArea} − ${v.intInnerArea}?`,
              getOptions: (v) => generateDistractors(v.intPathArea),
              correctAnswer: (v) => v.intPathArea,
              feedback: {
                correct: (v) => `Brilliant! **${v.intOuterArea} − ${v.intInnerArea} = ${v.intPathArea}${v.unit}**. The path area is ${v.intPathArea}${v.unit}! ✓`,
                incorrect: (v) => `Not quite! ${v.intOuterArea} − ${v.intInnerArea} = **${v.intPathArea}${v.unit}**. Subtract the inner from the outer!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Paths, borders, frames — same trick!",
            body: () => `Whenever you need the area of a border or path around a rectangle:`,
            bodyParts: () => [
              { type: 'visual', component: 'PathBorderDiagram', props: () => ({ outerL: 10, outerW: 7, innerL: 8, innerW: 5, pathWidth: 1, dimUnit: "m", innerLabel: "40 m²", pathLabel: "30 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the OUTER area", why: "The path adds width to BOTH sides — so add 2× path width to length AND width." },
                    { text: "Step 2: Find the INNER area", why: "The rectangle (or shape) inside." },
                    { text: "Step 3: Subtract inner from outer", why: "What's left is just the path/border! ✓" }
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

      // ---- Lesson B: Step by Step ----
      {
        id: "paths-and-borders-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate the outer dimensions when a path width is given",
          "How to subtract areas step by step"
        ],
        variableSets: [
          {
            name: "Archie",
            scenario: "A rectangular swimming pool (6 m × 4 m) has a 2 m wide path around it.",
            innerL: 6, innerW: 4, innerArea: 24,
            pathWidth: 2,
            outerL: 10, outerW: 8, outerArea: 80,
            pathArea: 56,
            unit: "m²",
            dimUnit: "m",
            intOuterArea: 72,
            intInnerArea: 30,
            intPathArea: 42
          },
          {
            name: "Mrs Taylor",
            scenario: "A rectangular painting (20 cm × 15 cm) has a 3 cm frame around it.",
            innerL: 20, innerW: 15, innerArea: 300,
            pathWidth: 3,
            outerL: 26, outerW: 21, outerArea: 546,
            pathArea: 246,
            unit: "cm²",
            dimUnit: "cm",
            intOuterArea: 480,
            intInnerArea: 252,
            intPathArea: 228
          },
          {
            name: "Zoe",
            scenario: "A rectangular sandpit (5 m × 3 m) has a 1 m border of paving around it.",
            innerL: 5, innerW: 3, innerArea: 15,
            pathWidth: 1,
            outerL: 7, outerW: 5, outerArea: 35,
            pathArea: 20,
            unit: "m²",
            dimUnit: "m",
            intOuterArea: 48,
            intInnerArea: 20,
            intPathArea: 28
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How much ${v.pathWidth > 1 ? 'border' : 'path'} is there?`,
            body: (v) => `${v.scenario}\nThe path is on **all sides** — so the outer rectangle is bigger than the inner one. Let's work through it step by step!`,
            visual: {
              component: "PathBorderDiagram",
              props: (v) => ({
                outerL: v.outerL,
                outerW: v.outerW,
                innerL: v.innerL,
                innerW: v.innerW,
                pathWidth: v.pathWidth,
                dimUnit: v.dimUnit,
                innerLabel: `${v.innerArea} ${v.unit}`,
                pathLabel: "Path"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Work out the outer dimensions first!",
            body: (v) => `${v.scenario}\n\nThe path adds **${v.pathWidth}${v.dimUnit}** on **each side**. That's **${v.pathWidth * 2}${v.dimUnit}** extra on both the length and the width. Tap to reveal each step!`,
            bodyParts: (v) => [
              { type: 'visual', component: 'PathBorderDiagram', props: (v) => ({ outerL: v.outerL, outerW: v.outerW, innerL: v.innerL, innerW: v.innerW, pathWidth: v.pathWidth, dimUnit: v.dimUnit, innerLabel: `${v.innerArea} ${v.unit}`, pathLabel: `${v.pathArea} ${v.unit}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Outer length: ${v.innerL} + ${v.pathWidth} + ${v.pathWidth} = ${v.outerL}${v.dimUnit}`, why: "Path on left AND right" },
                    { text: `Outer width: ${v.innerW} + ${v.pathWidth} + ${v.pathWidth} = ${v.outerW}${v.dimUnit}`, why: "Path on top AND bottom" },
                    { text: `Outer area: ${v.outerL} × ${v.outerW} = ${v.outerArea}${v.unit}`, why: "The whole thing including the path" },
                    { text: `Inner area: ${v.innerL} × ${v.innerW} = ${v.innerArea}${v.unit}`, why: "Just the inside" },
                    { text: `Path area: ${v.outerArea} − ${v.innerArea} = ${v.pathArea}${v.unit}`, why: "Subtract inner from outer!", result: "✓" }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Outer area = **${v.intOuterArea}${v.unit}**. Inner area = **${v.intInnerArea}${v.unit}**. What is the area of just the path?`,
            visual: {
              component: "PathBorderDiagram",
              props: (v) => ({
                outerL: v.outerL,
                outerW: v.outerW,
                innerL: v.innerL,
                innerW: v.innerW,
                pathWidth: v.pathWidth,
                dimUnit: v.dimUnit,
                innerLabel: `${v.intInnerArea} ${v.unit}`,
                pathLabel: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the path area?`,
              getOptions: (v) => generateDistractors(v.intPathArea),
              correctAnswer: (v) => v.intPathArea,
              feedback: {
                correct: (v) => `Well done! **${v.intOuterArea} − ${v.intInnerArea} = ${v.intPathArea}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.intOuterArea} − ${v.intInnerArea} = **${v.intPathArea}${v.unit}**. Subtract the inner area from the outer!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The path/border recipe!",
            body: () => `For any path, border, or frame problem:`,
            bodyParts: () => [
              { type: 'visual', component: 'PathBorderDiagram', props: () => ({ outerL: 10, outerW: 8, innerL: 6, innerW: 4, pathWidth: 2, dimUnit: "m", innerLabel: "24 m²", pathLabel: "56 m²" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Add TWICE the path width to each dimension", why: "The path goes on BOTH sides (left+right, top+bottom)." },
                    { text: "Calculate outer area and inner area", why: "Outer = big rectangle. Inner = original rectangle." },
                    { text: "Path area = outer − inner", why: "Subtraction gives you just the path. ✓" }
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
  }
];

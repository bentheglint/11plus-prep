// Supplementary sub-concepts for Volume
// To merge: add these to lessonBank.volume.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const volumeSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Volume of Cubes (edge cubed)
  // ==========================================
  {
    id: "volume-cubes",
    name: "Volume of Cubes (edge x edge x edge)",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "volume-cubes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the volume of a cube by multiplying edge x edge x edge",
          "Why all three dimensions are the same in a cube"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "has a cube-shaped jewellery box",
            edge: 5,
            edgeSquared: 25,
            volume: 125,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 7,
            interactEdgeSquared: 49,
            interactVolume: 343
          },
          {
            name: "Mr Dawson",
            scenario: "is building a cube-shaped planter for the school garden",
            edge: 4,
            edgeSquared: 16,
            volume: 64,
            unit: "m³",
            dimUnit: "m",
            interactEdge: 3,
            interactEdgeSquared: 9,
            interactVolume: 27
          },
          {
            name: "Amir",
            scenario: "is measuring a Rubik's cube for his maths project",
            edge: 6,
            edgeSquared: 36,
            volume: 216,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 8,
            interactEdgeSquared: 64,
            interactVolume: 512
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `What's the volume of a ${v.edge}${v.dimUnit} cube?`,
            body: (v) => `${v.name} ${v.scenario}. Each edge is **${v.edge}${v.dimUnit}** long.\nA cube is special — all three dimensions (measurements like length, width, and height) are the **same**! So the volume is just **${v.edge} × ${v.edge} × ${v.edge}**.`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.edge,
                width: v.edge,
                height: v.edge,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Edge x edge x edge!",
            body: (v) => `The cube has edges of **${v.edge}${v.dimUnit}**. Let's find the volume step by step. Tap to reveal:`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Base area: ${v.edge} × ${v.edge}`, why: "The base is a square", result: `= ${v.edgeSquared}${v.dimUnit}²` },
                    { text: `Volume: ${v.edgeSquared} × ${v.edge}`, why: "Multiply base area by height", result: `= ${v.volume}${v.unit}` },
                    { text: `Or simply: ${v.edge}³ = ${v.volume}`, why: "That's what the little ³ means — cubed!", result: "✓" }
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
            body: (v) => `A cube has edges of **${v.interactEdge}${v.dimUnit}**. What is the volume?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactEdge,
                width: v.interactEdge,
                height: v.interactEdge,
                dimUnit: v.dimUnit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactEdge} × ${v.interactEdge} × ${v.interactEdge}?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactEdge}³ = ${v.interactVolume}${v.unit}**. That cube holds ${v.interactVolume} tiny cubes inside! ✓`,
                incorrect: (v) => `Not quite! ${v.interactEdge} × ${v.interactEdge} = ${v.interactEdgeSquared}, then × ${v.interactEdge} = **${v.interactVolume}${v.unit}**. Do it in two steps!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Cube volume — triple the same number!",
            body: () => `A cube has all edges the same length, so:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 4, width: 4, height: 4, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Volume of a cube = edge × edge × edge", why: "Or edge³ (edge cubed)" },
                  { text: "All three dimensions are the SAME", why: "Unlike a cuboid where l, w, h can be different." },
                  { text: "Remember the ³ on the unit!", why: "cm³ or m³ — that little 3 means volume! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity Hook ----
      {
        id: "volume-cubes-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "Why cubing a number grows so fast",
          "How to see that a small increase in edge length makes a big difference to volume"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "comparing a 3 cm cube and a 4 cm cube",
            edgeSmall: 3,
            volumeSmall: 27,
            edgeBig: 4,
            volumeBig: 64,
            difference: 37,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 5,
            interactVolume: 125
          },
          {
            name: "Mr Singh",
            scenario: "comparing a 2 m cube and a 3 m cube",
            edgeSmall: 2,
            volumeSmall: 8,
            edgeBig: 3,
            volumeBig: 27,
            difference: 19,
            unit: "m³",
            dimUnit: "m",
            interactEdge: 4,
            interactVolume: 64
          },
          {
            name: "Zara",
            scenario: "comparing a 5 cm cube and a 6 cm cube",
            edgeSmall: 5,
            volumeSmall: 125,
            edgeBig: 6,
            volumeBig: 216,
            difference: 91,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 7,
            interactVolume: 343
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "One centimetre makes a BIG difference!",
            body: (v) => `${v.name} is ${v.scenario}.\nThe ${v.edgeSmall}${v.dimUnit} cube has a volume of **${v.volumeSmall}${v.unit}**.\nThe ${v.edgeBig}${v.dimUnit} cube has a volume of **${v.volumeBig}${v.unit}**.\nJust **1${v.dimUnit}** bigger — but **${v.difference}${v.unit}** more volume!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.edgeBig,
                width: v.edgeBig,
                height: v.edgeBig,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Cubing grows fast!",
            body: (v) => `When you **cube** a number, you multiply it by itself **three times**. Volume grows **much faster** than length — that's why a slightly bigger box holds a LOT more!`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Small cube:** ${v.edgeSmall}${v.dimUnit} edges`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edgeSmall,
                  width: v.edgeSmall,
                  height: v.edgeSmall,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Big cube:** ${v.edgeBig}${v.dimUnit} edges`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edgeBig,
                  width: v.edgeBig,
                  height: v.edgeBig,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.edgeSmall}³ = ${v.edgeSmall} × ${v.edgeSmall} × ${v.edgeSmall}`, why: "Cube the small edge", result: `= ${v.volumeSmall}` },
                    { text: `${v.edgeBig}³ = ${v.edgeBig} × ${v.edgeBig} × ${v.edgeBig}`, why: "Cube the big edge", result: `= ${v.volumeBig}` },
                    { text: `Difference: ${v.volumeBig} - ${v.volumeSmall} = ${v.difference}`, why: "A small edge increase = big volume increase!", result: "✓" }
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
            body: (v) => `What is the volume of a cube with edges of **${v.interactEdge}${v.dimUnit}**?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactEdge,
                width: v.interactEdge,
                height: v.interactEdge,
                dimUnit: v.dimUnit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactEdge}³?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Well done! **${v.interactEdge}³ = ${v.interactVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactEdge} × ${v.interactEdge} = ${v.interactEdge * v.interactEdge}, then × ${v.interactEdge} = **${v.interactVolume}${v.unit}**. Do it in two steps!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Cubing = fast growth!",
            body: () => `Volume grows much faster than length because you're multiplying three times:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 5, width: 5, height: 5, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Edge × edge × edge = volume", why: "Three lots of multiplying!" },
                  { text: "Double the edge = 8× the volume", why: "2 × 2 × 2 = 8 (not just double!)" },
                  { text: "Small changes in edge = big changes in volume", why: "That's the power of cubing! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 2: Missing Dimension from Volume
  // ==========================================
  {
    id: "missing-dimension",
    name: "Finding Missing Dimension from Volume",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "missing-dimension-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a missing dimension (measurement) when you know the volume",
          "Why dividing volume by the other two dimensions works"
        ],
        variableSets: [
          {
            name: "Mrs Chen",
            scenario: "The fish tank has a volume of 240 cm³. It is 10 cm long and 6 cm wide.",
            volume: 240,
            dim1: 10,
            dim2: 6,
            missingDim: 4,
            baseArea: 60,
            missingLabel: "height",
            cuboidLength: 10, cuboidWidth: 6, cuboidHeight: 4,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 150,
            interactDim1: 6,
            interactDim2: 5,
            interactMissingDim: 5,
            interactBaseArea: 30,
            interactMissingLabel: "height",
            interactCuboidLength: 6, interactCuboidWidth: 5, interactCuboidHeight: 5
          },
          {
            name: "Oliver",
            scenario: "A cardboard box has a volume of 360 cm³. It is 12 cm long and 5 cm tall.",
            volume: 360,
            dim1: 12,
            dim2: 5,
            missingDim: 6,
            baseArea: 60,
            missingLabel: "width",
            cuboidLength: 12, cuboidWidth: 6, cuboidHeight: 5,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 168,
            interactDim1: 8,
            interactDim2: 7,
            interactMissingDim: 3,
            interactBaseArea: 56,
            interactMissingLabel: "width",
            interactCuboidLength: 8, interactCuboidWidth: 3, interactCuboidHeight: 7
          },
          {
            name: "Miss Obi",
            scenario: "A storage cupboard has a volume of 48 m³. It is 4 m wide and 3 m tall.",
            volume: 48,
            dim1: 4,
            dim2: 3,
            missingDim: 4,
            baseArea: 12,
            missingLabel: "length",
            cuboidLength: 4, cuboidWidth: 4, cuboidHeight: 3,
            unit: "m³",
            dimUnit: "m",
            interactVolume: 72,
            interactDim1: 4,
            interactDim2: 3,
            interactMissingDim: 6,
            interactBaseArea: 12,
            interactMissingLabel: "length",
            interactCuboidLength: 6, interactCuboidWidth: 4, interactCuboidHeight: 3
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you find the missing ${v.missingLabel}?`,
            body: (v) => `${v.name} needs your help! ${v.scenario}\nYou know the volume and two dimensions. Can you work **backwards** to find the missing **${v.missingLabel}**?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.cuboidLength,
                width: v.cuboidWidth,
                height: v.cuboidHeight,
                dimUnit: v.dimUnit,
                missingDim: v.missingLabel
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide volume by the known dimensions!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `Here's how to find the missing **${v.missingLabel}**:`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.cuboidLength,
                  width: v.cuboidWidth,
                  height: v.cuboidHeight,
                  dimUnit: v.dimUnit,
                  missingDim: v.missingLabel
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 1:** Multiply the two known dimensions: **${v.dim1} × ${v.dim2} = ${v.baseArea}**`
              },
              {
                type: 'text',
                content: (v) => `**Step 2:** Divide volume by that: **${v.volume} ÷ ${v.baseArea} = ${v.missingDim}${v.dimUnit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.cuboidLength,
                  width: v.cuboidWidth,
                  height: v.cuboidHeight,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 3:** Check: ${v.dim1} × ${v.dim2} × ${v.missingDim} = ${v.volume} ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Volume = **${v.interactVolume}${v.unit}**. Two dimensions are **${v.interactDim1}${v.dimUnit}** and **${v.interactDim2}${v.dimUnit}**. What is the ${v.interactMissingLabel}?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactCuboidLength,
                width: v.interactCuboidWidth,
                height: v.interactCuboidHeight,
                dimUnit: v.dimUnit,
                missingDim: v.interactMissingLabel
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.interactMissingLabel}?`,
              getOptions: (v) => generateDistractors(v.interactMissingDim),
              correctAnswer: (v) => v.interactMissingDim,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactVolume} ÷ ${v.interactBaseArea} = **${v.interactMissingDim}${v.dimUnit}**. Check: ${v.interactDim1} × ${v.interactDim2} × ${v.interactMissingDim} = ${v.interactVolume} ✓`,
                incorrect: (v) => `Not quite! ${v.interactDim1} × ${v.interactDim2} = ${v.interactBaseArea}. Then ${v.interactVolume} ÷ ${v.interactBaseArea} = **${v.interactMissingDim}${v.dimUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Finding a missing dimension!",
            body: () => `When you know the volume and two dimensions:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 10, width: 6, height: 4, unit: "cm", missingDim: "height" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Step 1: Multiply the two known dimensions", why: "This gives you the base area." },
                  { text: "Step 2: Divide the volume by that answer", why: "Volume ÷ base area = missing dimension." },
                  { text: "Step 3: Check by multiplying all three!", why: "l × w × h should equal the volume. ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "missing-dimension-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone uses the wrong operation for missing dimensions",
          "Why subtraction doesn't work for finding missing dimensions"
        ],
        variableSets: [
          {
            name: "Ethan",
            scenario: "finding the height of a box",
            volume: 180,
            dim1: 9,
            dim2: 5,
            missingDim: 4,
            baseArea: 45,
            wrongAnswer: 166,
            missingLabel: "height",
            cuboidLength: 9, cuboidWidth: 5, cuboidHeight: 4,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "subtracted the dimensions from the volume (180 - 9 - 5 = 166) instead of dividing",
            interactVolume: 288,
            interactDim1: 8,
            interactDim2: 6,
            interactMissingDim: 6,
            interactBaseArea: 48,
            interactMissingLabel: "height",
            interactCuboidLength: 8, interactCuboidWidth: 6, interactCuboidHeight: 6
          },
          {
            name: "Sophie",
            scenario: "finding the width of a planter",
            volume: 300,
            dim1: 10,
            dim2: 6,
            missingDim: 5,
            baseArea: 60,
            wrongAnswer: 30,
            missingLabel: "width",
            cuboidLength: 10, cuboidWidth: 5, cuboidHeight: 6,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "only divided by one dimension (300 ÷ 10 = 30) instead of dividing by both (300 ÷ 60 = 5)",
            interactVolume: 252,
            interactDim1: 9,
            interactDim2: 4,
            interactMissingDim: 7,
            interactBaseArea: 36,
            interactMissingLabel: "width",
            interactCuboidLength: 9, interactCuboidWidth: 7, interactCuboidHeight: 4
          },
          {
            name: "Mr Hill",
            scenario: "finding the length of a storage container",
            volume: 420,
            dim1: 7,
            dim2: 6,
            missingDim: 10,
            baseArea: 42,
            wrongAnswer: 60,
            missingLabel: "length",
            cuboidLength: 10, cuboidWidth: 7, cuboidHeight: 6,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "divided by only one dimension (420 ÷ 7 = 60) instead of dividing by both known dimensions multiplied together",
            interactVolume: 420,
            interactDim1: 10,
            interactDim2: 7,
            interactMissingDim: 6,
            interactBaseArea: 70,
            interactMissingLabel: "length",
            interactCuboidLength: 6, interactCuboidWidth: 10, interactCuboidHeight: 7
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\nVolume = ${v.volume}${v.unit}. Dimensions: ${v.dim1}${v.dimUnit} and ${v.dim2}${v.dimUnit}.\n${v.name} says the ${v.missingLabel} is **${v.wrongAnswer}${v.dimUnit}**. Something's not right!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.cuboidLength,
                width: v.cuboidWidth,
                height: v.cuboidHeight,
                dimUnit: v.dimUnit,
                missingDim: v.missingLabel
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide by BOTH known dimensions!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nCorrect method: multiply the two known dimensions first (${v.dim1} × ${v.dim2} = ${v.baseArea}), then divide the volume by that.\n**${v.volume} ÷ ${v.baseArea} = ${v.missingDim}${v.dimUnit}** ✓`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.cuboidLength,
                  width: v.cuboidWidth,
                  height: v.cuboidHeight,
                  dimUnit: v.dimUnit,
                  missingDim: v.missingLabel
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.wrongAnswer}${v.dimUnit}`, why: v.mistakeExplanation, result: "✗" },
                    { text: `Step 1: ${v.dim1} × ${v.dim2} = ${v.baseArea}`, why: "Multiply the known dimensions first" },
                    { text: `Step 2: ${v.volume} ÷ ${v.baseArea} = ${v.missingDim}${v.dimUnit}`, why: "Divide volume by that answer", result: "✓" }
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
            body: (v) => `Volume = **${v.interactVolume}${v.unit}**. Known dimensions: **${v.interactDim1}${v.dimUnit}** and **${v.interactDim2}${v.dimUnit}**. What is the ${v.interactMissingLabel}?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactCuboidLength,
                width: v.interactCuboidWidth,
                height: v.interactCuboidHeight,
                dimUnit: v.dimUnit,
                missingDim: v.interactMissingLabel
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.interactMissingLabel}?`,
              getOptions: (v) => generateDistractors(v.interactMissingDim),
              correctAnswer: (v) => v.interactMissingDim,
              feedback: {
                correct: (v) => `Well done! ${v.interactVolume} ÷ ${v.interactBaseArea} = **${v.interactMissingDim}${v.dimUnit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDim1} × ${v.interactDim2} = ${v.interactBaseArea}. Then ${v.interactVolume} ÷ ${v.interactBaseArea} = **${v.interactMissingDim}${v.dimUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Two common mistakes to avoid!",
            body: () => `When finding a missing dimension from volume:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 9, width: 5, height: 4, unit: "cm", missingDim: "width" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "DON'T subtract — division undoes multiplication!", why: "Volume uses ×, so work backwards with ÷." },
                  { text: "DON'T divide by only one dimension", why: "You need to multiply the two known dimensions, THEN divide the volume by that." },
                  { text: "DO: multiply the two known dimensions, then divide volume by that", why: "Check: all three dimensions multiplied = volume ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: Cube Root (Finding Edge from Volume)
  // ==========================================
  {
    id: "cube-root",
    name: "Finding Edge Length from Cube Volume",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "cube-root-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to find the edge length when you know a cube's volume",
          "How to understand what a cube root (the number that multiplies by itself three times to give the volume) means"
        ],
        variableSets: [
          {
            name: "Maisie",
            scenario: "has a cube-shaped box with volume 27 cm³",
            volume: 27,
            edge: 3,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 64,
            interactEdge: 4
          },
          {
            name: "Jack",
            scenario: "has a cube-shaped dice with volume 8 cm³",
            volume: 8,
            edge: 2,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 125,
            interactEdge: 5
          },
          {
            name: "Miss Patel",
            scenario: "has a cube-shaped storage container with volume 125 m³",
            volume: 125,
            edge: 5,
            unit: "m³",
            dimUnit: "m",
            interactVolume: 27,
            interactEdge: 3
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `What number × itself × itself = ${v.volume}?`,
            body: (v) => `${v.name} ${v.scenario}.\nIf it's a cube, all three edges are the **same length**. So what number, multiplied by itself three times, gives **${v.volume}**?\nThis is called finding the **cube root**!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.edge,
                width: v.edge,
                height: v.edge,
                dimUnit: v.dimUnit,
                missingDim: "all"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Try cubing small numbers!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: () => `**Cubing** means multiplying a number by itself **three times** — like the three edges of a cube! The little ³ means "cubed".`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1³ = 1 × 1 × 1 = 1", why: "A tiny 1cm cube" },
                    { text: "2³ = 2 × 2 × 2 = 8", why: "Not 6! You multiply three times" },
                    { text: "3³ = 3 × 3 × 3 = 27", why: "3 × 3 = 9, then 9 × 3 = 27" },
                    { text: "4³ = 4 × 4 × 4 = 64", why: "4 × 4 = 16, then 16 × 4 = 64" },
                    { text: "5³ = 5 × 5 × 5 = 125", why: "5 × 5 = 25, then 25 × 5 = 125" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Finding the **cube root** is the reverse — you ask: "What number cubed gives **${v.volume}**?"\n\n**${v.edge}** × **${v.edge}** × **${v.edge}** = **${v.volume}** — so the edge is **${v.edge}${v.dimUnit}**! ✓`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A cube has a volume of **${v.interactVolume}${v.unit}**. What is the edge length?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactEdge,
                width: v.interactEdge,
                height: v.interactEdge,
                dimUnit: v.dimUnit,
                missingDim: "all"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the edge length?`,
              getOptions: (v) => generateDistractors(v.interactEdge),
              correctAnswer: (v) => v.interactEdge,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactEdge}³ = ${v.interactVolume}**, so the edge is **${v.interactEdge}${v.dimUnit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactEdge} × ${v.interactEdge} × ${v.interactEdge} = ${v.interactVolume}, so the edge is **${v.interactEdge}${v.dimUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Cube roots — the reverse of cubing!",
            body: () => `To find the edge of a cube from its volume, find the **cube root** — ask yourself: "What number × itself × itself gives this volume?"`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 3, width: 3, height: 3, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "1³ = 1 × 1 × 1 = 1", why: "Edge = 1" },
                  { text: "2³ = 2 × 2 × 2 = 8", why: "Edge = 2" },
                  { text: "3³ = 3 × 3 × 3 = 27", why: "Edge = 3" },
                  { text: "4³ = 4 × 4 × 4 = 64", why: "Edge = 4" },
                  { text: "5³ = 5 × 5 × 5 = 125", why: "Edge = 5" },
                  { text: "10³ = 10 × 10 × 10 = 1000", why: "Edge = 10 ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key Fact ----
      {
        id: "cube-root-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to remember the first ten cube numbers",
          "Why knowing cube numbers helps in volume problems"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "A cube-shaped present has a volume of 64 cm³.",
            volume: 64,
            edge: 4,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 125,
            interactEdge: 5
          },
          {
            name: "Mr Brooks",
            scenario: "A cube-shaped water tank has a volume of 216 cm³.",
            volume: 216,
            edge: 6,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 512,
            interactEdge: 8
          },
          {
            name: "Aisha",
            scenario: "A cube-shaped planter has a volume of 343 cm³.",
            volume: 343,
            edge: 7,
            unit: "cm³",
            dimUnit: "cm",
            interactVolume: 729,
            interactEdge: 9
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Know your cube numbers!",
            body: () => `The first ten cube numbers are your **secret weapon** for volume questions:\n\n**1, 8, 27, 64, 125, 216, 343, 512, 729, 1000**\n\nIf you spot one of these in a question, you can instantly find the edge length!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1³ = 1, 2³ = 8, 3³ = 27", why: "Small cubes" },
                  { text: "4³ = 64, 5³ = 125, 6³ = 216", why: "Medium cubes" },
                  { text: "7³ = 343, 8³ = 512, 9³ = 729, 10³ = 1000", why: "Bigger cubes" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: (v) => `Volume ${v.volume} — what's the edge?`,
            body: (v) => `${v.scenario}\nLook at the cube numbers list: **${v.volume}** is there!\n**${v.edge}³ = ${v.volume}**, so the edge is **${v.edge}${v.dimUnit}**.\n\nKnowing your cube numbers makes these questions instant! ✓`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit,
                  missingDim: "all"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Volume = ${v.volume}`, why: "Recognise this cube number?" },
                    { text: `${v.edge}³ = ${v.edge} × ${v.edge} × ${v.edge} = ${v.volume}`, why: "The edge is " + v.edge, result: "✓" }
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
            title: () => "Quick! What's the edge?",
            body: (v) => `A cube has volume **${v.interactVolume}${v.unit}**. What is the edge length?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactEdge,
                width: v.interactEdge,
                height: v.interactEdge,
                dimUnit: v.dimUnit,
                missingDim: "all"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the edge length?`,
              getOptions: (v) => generateDistractors(v.interactEdge),
              correctAnswer: (v) => v.interactEdge,
              feedback: {
                correct: (v) => `Quick thinking! **${v.interactEdge}³ = ${v.interactVolume}**, so the edge is **${v.interactEdge}${v.dimUnit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactEdge} × ${v.interactEdge} × ${v.interactEdge} = ${v.interactVolume}. The edge is **${v.interactEdge}${v.dimUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Cube numbers — learn them!",
            body: () => `Memorising cube numbers saves you loads of time in exams:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 4, width: 4, height: 4, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "The must-know cubes: 1, 8, 27, 64, 125", why: "Edges 1-5. These come up most often." },
                  { text: "Also useful: 216, 343, 512, 729, 1000", why: "Edges 6-10. Good for harder questions." },
                  { text: "If you see a cube number, you know the edge instantly!", why: "No calculation needed — just recognition. ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: Volume to Capacity (cm³ ↔ ml ↔ litres)
  // ==========================================
  {
    id: "volume-to-capacity",
    name: "Converting cm³, ml, and litres",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "volume-to-capacity-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to convert between cm³, ml, and litres",
          "How to convert between volume and capacity (how much a container can hold)"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "A fish tank has a volume of 5000 cm³.",
            volumeCm3: 5000,
            volumeMl: 5000,
            volumeL: 5,
            unit: "cm³",
            interactVolumeCm3: 7000,
            interactVolumeMl: 7000,
            interactVolumeL: 7
          },
          {
            name: "Mr Ahmed",
            scenario: "A rectangular water container has a volume of 12000 cm³.",
            volumeCm3: 12000,
            volumeMl: 12000,
            volumeL: 12,
            unit: "cm³",
            interactVolumeCm3: 9000,
            interactVolumeMl: 9000,
            interactVolumeL: 9
          },
          {
            name: "Lily",
            scenario: "A juice box has a volume of 250 cm³.",
            volumeCm3: 250,
            volumeMl: 250,
            volumeL: 0.25,
            unit: "cm³",
            interactVolumeCm3: 500,
            interactVolumeMl: 500,
            interactVolumeL: 0.5
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "The magic link: cm³ = ml!",
            body: () => `Here's a brilliant fact:\n\n**1 cm³ = 1 ml** (exactly!)\n**1000 ml = 1 litre**\n\nSo **1000 cm³ = 1 litre**.\n\nThis means you can easily convert between volume (cm³) and capacity (litres)!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1 cm³ = 1 ml", why: "The golden rule!" },
                  { text: "1000 ml = 1 litre", why: "The standard conversion" },
                  { text: "So: 1000 cm³ = 1 litre", why: "Combining both rules ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: (v) => `${v.volumeCm3} cm³ = how many litres?`,
            body: (v) => `${v.scenario}\n\nThe **capacity** (how much a container can hold) is the same as its volume. Since 1 cm³ = 1 ml, the tank holds **${v.volumeMl} ml**.\nSince 1000 ml = 1 litre, that's **${v.volumeMl} ÷ 1000 = ${v.volumeL} litres**. ✓`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.volumeCm3} cm³ = ${v.volumeMl} ml`, why: "1 cm³ = 1 ml (just rename!)" },
                  { text: `${v.volumeMl} ml ÷ 1000`, why: "Convert ml to litres", result: `= ${v.volumeL} litres ✓` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A container has a volume of **${v.interactVolumeCm3} cm³**. How many litres is that?\n\nRemember: 1 cm³ = 1 ml, and 1000 ml = 1 litre.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Step 1: ${v.interactVolumeCm3} cm³ = ${v.interactVolumeMl} ml`, why: "1 cm³ = 1 ml" },
                  { text: `Step 2: ${v.interactVolumeMl} ml ÷ 1000 = ? litres`, why: "Divide by 1000 to get litres" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many litres is ${v.interactVolumeCm3} cm³?`,
              getOptions: (v) => generateDistractors(v.interactVolumeL),
              correctAnswer: (v) => v.interactVolumeL,
              feedback: {
                correct: (v) => `Well done! ${v.interactVolumeCm3} cm³ = ${v.interactVolumeMl} ml = **${v.interactVolumeL} litres**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolumeCm3} cm³ = ${v.interactVolumeMl} ml. Then ÷ 1000 = **${v.interactVolumeL} litres**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Volume and capacity — the key conversions!",
            body: () => `Remember these three conversions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1 cm³ = 1 ml", why: "They're the exact same amount of space!" },
                  { text: "1000 ml = 1 litre", why: "The standard liquid measure." },
                  { text: "cm³ → litres: divide by 1000", why: "Litres → cm³: multiply by 1000. ✓" }
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
        id: "volume-to-capacity-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot the ÷ 100 vs ÷ 1000 mistake",
          "Why cm³ to litres uses ÷ 1000, not ÷ 100"
        ],
        variableSets: [
          {
            name: "Noah",
            scenario: "converting a fish tank volume of 8000 cm³ to litres",
            volumeCm3: 8000,
            correctLitres: 8,
            wrongLitres: 80,
            mistakeExplanation: "divided by 100 instead of 1000",
            interactVolumeCm3: 6000,
            interactCorrectLitres: 6
          },
          {
            name: "Mrs Kumar",
            scenario: "converting a bucket volume of 3000 cm³ to litres",
            volumeCm3: 3000,
            correctLitres: 3,
            wrongLitres: 30,
            mistakeExplanation: "divided by 100 instead of 1000",
            interactVolumeCm3: 4000,
            interactCorrectLitres: 4
          },
          {
            name: "Archie",
            scenario: "converting a swimming pool section of 15000 cm³ to litres",
            volumeCm3: 15000,
            correctLitres: 15,
            wrongLitres: 150,
            mistakeExplanation: "used ÷ 100 (the length conversion) instead of ÷ 1000 (the volume conversion)",
            interactVolumeCm3: 11000,
            interactCorrectLitres: 11
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says: ${v.volumeCm3} cm³ = **${v.wrongLitres} litres**.\nThat's 10 times too big! What went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongLitres} litres`, why: "Hmm, that seems too much..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide by 1000, not 100!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nTo convert volume to **capacity** (how much a container can hold) in litres: 1000 cm³ = 1 litre (not 100!). So:\n**${v.volumeCm3} ÷ 1000 = ${v.correctLitres} litres** ✓`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.volumeCm3} ÷ 100 = ${v.wrongLitres}`, why: "Used ÷ 100 — that's for cm to m, not cm³ to litres!", result: "✗" },
                  { text: `Right: ${v.volumeCm3} ÷ 1000 = ${v.correctLitres}`, why: "1000 cm³ = 1 litre", result: "✓" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `Convert **${v.interactVolumeCm3} cm³** to litres.\n\nRemember: 1000 cm³ = 1 litre (divide by 1000, not 100!)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactVolumeCm3} ÷ 1000 = ?`, why: "Remember: 1000 cm³ = 1 litre" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many litres is ${v.interactVolumeCm3} cm³?`,
              getOptions: (v) => generateDistractors(v.interactCorrectLitres),
              correctAnswer: (v) => v.interactCorrectLitres,
              feedback: {
                correct: (v) => `Well done! **${v.interactVolumeCm3} ÷ 1000 = ${v.interactCorrectLitres} litres**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolumeCm3} ÷ 1000 = **${v.interactCorrectLitres} litres**. Remember: divide by 1000!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The conversion trap!",
            body: () => `Don't mix up your conversions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Length: 100 cm = 1 m", why: "÷ 100 for lengths" },
                  { text: "Volume/Capacity: 1000 cm³ = 1 litre", why: "÷ 1000 for volume to litres" },
                  { text: "Remember: 1 cm³ = 1 ml, and 1000 ml = 1 litre", why: "Two steps: cm³ → ml → litres ✓" }
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
  // SUB-CONCEPT 5: Comparing Volumes
  // ==========================================
  {
    id: "comparing-volumes",
    name: "Same Volume, Different Shapes",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "comparing-volumes-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand that two different cuboids can have the same volume",
          "Why rearranging dimensions doesn't change the volume"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "comparing two different-shaped boxes that hold the same amount",
            shapeA_l: 8, shapeA_w: 3, shapeA_h: 5, volume: 120,
            shapeB_l: 10, shapeB_w: 4, shapeB_h: 3,
            unit: "cm³",
            dimUnit: "cm",
            interactShapeC_l: 7, interactShapeC_w: 4, interactShapeC_h: 5,
            interactVolume: 140
          },
          {
            name: "Mr Wong",
            scenario: "comparing two planters for the school garden",
            shapeA_l: 6, shapeA_w: 5, shapeA_h: 4, volume: 120,
            shapeB_l: 12, shapeB_w: 2, shapeB_h: 5,
            unit: "cm³",
            dimUnit: "cm",
            interactShapeC_l: 9, interactShapeC_w: 4, interactShapeC_h: 5,
            interactVolume: 180
          },
          {
            name: "Grace",
            scenario: "comparing two toy boxes that hold the same volume",
            shapeA_l: 10, shapeA_w: 6, shapeA_h: 2, volume: 120,
            shapeB_l: 15, shapeB_w: 4, shapeB_h: 2,
            unit: "cm³",
            dimUnit: "cm",
            interactShapeC_l: 6, interactShapeC_w: 5, interactShapeC_h: 7,
            interactVolume: 210
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Different shape, same volume?",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}. They look completely different, but they have the **same volume**!`
              },
              {
                type: 'text',
                content: (v) => `Box A: **${v.shapeA_l} × ${v.shapeA_w} × ${v.shapeA_h} = ${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeA_l,
                  width: v.shapeA_w,
                  height: v.shapeA_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `Box B: **${v.shapeB_l} × ${v.shapeB_w} × ${v.shapeB_h} = ${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeB_l,
                  width: v.shapeB_w,
                  height: v.shapeB_h,
                  dimUnit: v.dimUnit
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Volume depends on ALL three dimensions!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: () => `As long as **l × w × h** gives the same answer, the volume is the same — even if the shapes look totally different!`
              },
              {
                type: 'text',
                content: (v) => `**Box A:** ${v.shapeA_l} × ${v.shapeA_w} × ${v.shapeA_h} = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeA_l,
                  width: v.shapeA_w,
                  height: v.shapeA_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Box B:** ${v.shapeB_l} × ${v.shapeB_w} × ${v.shapeB_h} = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeB_l,
                  width: v.shapeB_w,
                  height: v.shapeB_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `Both equal **${v.volume}** — same volume, different shapes! ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Calculate Box C's volume",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `Here's a new box with different dimensions. What is its volume? Calculate to find out!`
              },
              {
                type: 'text',
                content: (v) => `Box C: **${v.interactShapeC_l}${v.dimUnit} × ${v.interactShapeC_w}${v.dimUnit} × ${v.interactShapeC_h}${v.dimUnit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.interactShapeC_l,
                  width: v.interactShapeC_w,
                  height: v.interactShapeC_h,
                  dimUnit: v.dimUnit
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactShapeC_l} × ${v.interactShapeC_w} × ${v.interactShapeC_h}?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Well done! **${v.interactShapeC_l} × ${v.interactShapeC_w} × ${v.interactShapeC_h} = ${v.interactVolume}${v.unit}** — same volume again! ✓`,
                incorrect: (v) => `Not quite! ${v.interactShapeC_l} × ${v.interactShapeC_w} = ${v.interactShapeC_l * v.interactShapeC_w}, then × ${v.interactShapeC_h} = **${v.interactVolume}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Same volume, different shapes!",
            body: () => `Key things to remember about comparing volumes:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 8, width: 3, height: 5, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Volume only depends on l × w × h", why: "The SHAPE doesn't matter — only the answer when you multiply!" },
                  { text: "To compare volumes, just calculate both", why: "Multiply all three dimensions for each shape." },
                  { text: "Same answer = same volume", why: "Even if the shapes look completely different! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity Hook ----
      {
        id: "comparing-volumes-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to compare volumes quickly",
          "Why you need to calculate, not just guess from appearance"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "choosing the bigger lunchbox",
            shapeA_l: 12, shapeA_w: 8, shapeA_h: 5, volumeA: 480,
            shapeB_l: 10, shapeB_w: 10, shapeB_h: 4, volumeB: 400,
            bigger: "A",
            unit: "cm³",
            dimUnit: "cm",
            interactL: 9, interactW: 7, interactH: 6,
            interactVolume: 378
          },
          {
            name: "Maisie",
            scenario: "picking the bigger toy storage box",
            shapeA_l: 15, shapeA_w: 6, shapeA_h: 4, volumeA: 360,
            shapeB_l: 9, shapeB_w: 8, shapeB_h: 5, volumeB: 360,
            bigger: "equal",
            unit: "cm³",
            dimUnit: "cm",
            interactL: 11, interactW: 5, interactH: 7,
            interactVolume: 385
          },
          {
            name: "Coach Lee",
            scenario: "comparing two equipment storage boxes",
            shapeA_l: 8, shapeA_w: 7, shapeA_h: 6, volumeA: 336,
            shapeB_l: 11, shapeB_w: 5, shapeB_h: 7, volumeB: 385,
            bigger: "B",
            unit: "cm³",
            dimUnit: "cm",
            interactL: 10, interactW: 6, interactH: 5,
            interactVolume: 300
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Which one holds more?",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}. Which holds more? You can't tell just by looking — you need to **calculate**!`
              },
              {
                type: 'text',
                content: (v) => `Box A: **${v.shapeA_l} × ${v.shapeA_w} × ${v.shapeA_h}${v.dimUnit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeA_l,
                  width: v.shapeA_w,
                  height: v.shapeA_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `Box B: **${v.shapeB_l} × ${v.shapeB_w} × ${v.shapeB_h}${v.dimUnit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeB_l,
                  width: v.shapeB_w,
                  height: v.shapeB_h,
                  dimUnit: v.dimUnit
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Calculate each volume!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Box A:** ${v.shapeA_l} × ${v.shapeA_w} × ${v.shapeA_h} = **${v.volumeA}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeA_l,
                  width: v.shapeA_w,
                  height: v.shapeA_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Box B:** ${v.shapeB_l} × ${v.shapeB_w} × ${v.shapeB_h} = **${v.volumeB}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.shapeB_l,
                  width: v.shapeB_w,
                  height: v.shapeB_h,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `${v.bigger === 'equal' ? 'They are the **same** volume!' : 'Box **' + v.bigger + '** is bigger by ' + Math.abs(v.volumeA - v.volumeB) + v.unit + '!'} ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the volume of this box?",
            body: (v) => `A new box: **${v.interactL}${v.dimUnit} × ${v.interactW}${v.dimUnit} × ${v.interactH}${v.dimUnit}**`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactL,
                width: v.interactW,
                height: v.interactH,
                dimUnit: v.dimUnit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactL} × ${v.interactW} × ${v.interactH}?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactL} × ${v.interactW} × ${v.interactH} = ${v.interactVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactL} × ${v.interactW} = ${v.interactL * v.interactW}, then × ${v.interactH} = **${v.interactVolume}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Always calculate — never guess!",
            body: () => `When comparing volumes:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 12, width: 8, height: 5, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Calculate BOTH volumes", why: "l × w × h for each shape." },
                  { text: "Compare the numbers", why: "Bigger answer = bigger volume." },
                  { text: "Don't guess from appearance!", why: "A tall thin box might hold less than a short wide one! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: Scaling Volumes (doubling edge = ×8)
  // ==========================================
  {
    id: "scaling-volumes",
    name: "Doubling Edge Length Multiplies Volume by 8",
    category: "other",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "scaling-volumes-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand that doubling every edge multiplies the volume by 8",
          "Why doubling every edge makes the volume 8 times bigger, not 2 times"
        ],
        variableSets: [
          {
            name: "Alfie",
            scenario: "comparing a small cube and a double-sized cube",
            edge: 3, volume: 27,
            doubleEdge: 6, doubleVolume: 216,
            scaleFactor: 2, volumeMultiplier: 8,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 4, interactVolume: 64,
            interactDoubleEdge: 8, interactDoubleVolume: 512
          },
          {
            name: "Mrs Patel",
            scenario: "comparing two cube-shaped planters",
            edge: 4, volume: 64,
            doubleEdge: 8, doubleVolume: 512,
            scaleFactor: 2, volumeMultiplier: 8,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 5, interactVolume: 125,
            interactDoubleEdge: 10, interactDoubleVolume: 1000
          },
          {
            name: "Zara",
            scenario: "comparing a small gift box and a large gift box",
            edge: 5, volume: 125,
            doubleEdge: 10, doubleVolume: 1000,
            scaleFactor: 2, volumeMultiplier: 8,
            unit: "cm³",
            dimUnit: "cm",
            interactEdge: 3, interactVolume: 27,
            interactDoubleEdge: 6, interactDoubleVolume: 216
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Double the size — how much more volume?",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}. The volume didn't just double — it went up by **${v.volumeMultiplier} times**! Why?`
              },
              {
                type: 'text',
                content: (v) => `**Original cube:** each edge = **${v.edge}${v.dimUnit}**, volume = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Doubled cube:** each edge = **${v.doubleEdge}${v.dimUnit}**, volume = **${v.doubleVolume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.doubleEdge,
                  width: v.doubleEdge,
                  height: v.doubleEdge,
                  dimUnit: v.dimUnit
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "2 × 2 × 2 = 8!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: () => `When you **double** every edge, you're doubling **three things** — length, width, AND height. So the volume multiplier is **2 × 2 × 2 = 8**!`
              },
              {
                type: 'text',
                content: (v) => `**Original cube:** ${v.edge} × ${v.edge} × ${v.edge} = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Doubled cube:** ${v.doubleEdge} × ${v.doubleEdge} × ${v.doubleEdge} = **${v.doubleVolume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.doubleEdge,
                  width: v.doubleEdge,
                  height: v.doubleEdge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `${v.doubleVolume} ÷ ${v.volume} = **${v.volumeMultiplier}** — that's 8 times bigger, not 2! ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A cube has edges of **${v.interactEdge} ${v.dimUnit}** (volume = ${v.interactVolume} ${v.unit}). If every edge is doubled, what is the new volume?`,
            visual: {
              component: "CuboidDiagram",
              props: () => ({
                length: 10,
                width: 10,
                height: 10,
                dimUnit: "cm"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactVolume} × 8?`,
              getOptions: (v) => generateDistractors(v.interactDoubleVolume),
              correctAnswer: (v) => v.interactDoubleVolume,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactVolume} × 8 = ${v.interactDoubleVolume}${v.unit}**. Doubling edges = 8× volume! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolume} × 8 = **${v.interactDoubleVolume}${v.unit}**. Remember: double → ×8, not ×2!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The multiplication rule!",
            body: () => `When you make every edge of a 3D shape bigger:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 6, width: 6, height: 6, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Double all edges → volume × 8", why: "2 × 2 × 2 = 8" },
                  { text: "Triple all edges → volume × 27", why: "3 × 3 × 3 = 27" },
                  { text: "The pattern: multiply the number by itself 3 times!", why: "Because there are 3 dimensions (length, width, height) ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "scaling-volumes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot the common mistake of multiplying by 2 instead of 8",
          "Why doubling edges means multiplying volume by 8, not 2"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "doubling the edges of a 4 cm cube",
            edge: 4, volume: 64,
            doubleEdge: 8, doubleVolume: 512,
            wrongAnswer: 128,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "multiplied the volume by 2 (64 × 2 = 128) instead of by 8",
            interactEdge: 5, interactVolume: 125,
            interactDoubleEdge: 10, interactDoubleVolume: 1000
          },
          {
            name: "Isla",
            scenario: "doubling the edges of a 3 cm cube",
            edge: 3, volume: 27,
            doubleEdge: 6, doubleVolume: 216,
            wrongAnswer: 54,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "multiplied by 2 (27 × 2 = 54) but should have multiplied by 8",
            interactEdge: 4, interactVolume: 64,
            interactDoubleEdge: 8, interactDoubleVolume: 512
          },
          {
            name: "Mr Brooks",
            scenario: "doubling the edges of a 5 cm cube",
            edge: 5, volume: 125,
            doubleEdge: 10, doubleVolume: 1000,
            wrongAnswer: 250,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "multiplied by 2 instead of by 8 (because 2 × 2 × 2 = 8)",
            interactEdge: 3, interactVolume: 27,
            interactDoubleEdge: 6, interactDoubleVolume: 216
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}. The original volume is ${v.volume}${v.unit}.\n${v.name} says the new volume is **${v.wrongAnswer}${v.unit}** (just doubled). Is that right?`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Original cube:** each edge = **${v.edge}${v.dimUnit}**, volume = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `${v.name}'s answer: ${v.volume} × 2 = **${v.wrongAnswer}${v.unit}** — but doubling all edges doesn't just double the volume...`
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "× 8, not × 2!",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistakeExplanation}. When you double **all three edges**, you multiply the volume by **2 × 2 × 2 = 8**, not just 2!`
              },
              {
                type: 'text',
                content: (v) => `**Original cube:** ${v.edge} × ${v.edge} × ${v.edge} = **${v.volume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.edge,
                  width: v.edge,
                  height: v.edge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `**Doubled cube:** ${v.doubleEdge} × ${v.doubleEdge} × ${v.doubleEdge} = **${v.doubleVolume}${v.unit}**`
              },
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.doubleEdge,
                  width: v.doubleEdge,
                  height: v.doubleEdge,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'text',
                content: (v) => `Correct answer: ${v.volume} × 8 = **${v.doubleVolume}${v.unit}** ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's the correct new volume?",
            body: (v) => `A cube has volume **${v.interactVolume} ${v.unit}**. All edges are doubled. What is the new volume?`,
            visual: {
              component: "CuboidDiagram",
              props: () => ({
                length: 10,
                width: 10,
                height: 10,
                dimUnit: "cm"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the new volume?`,
              getOptions: (v) => generateDistractors(v.interactDoubleVolume),
              correctAnswer: (v) => v.interactDoubleVolume,
              feedback: {
                correct: (v) => `Well done! **${v.interactVolume} × 8 = ${v.interactDoubleVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolume} × 8 = **${v.interactDoubleVolume}${v.unit}**. Remember: double edges = × 8, not × 2!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Don't fall for the × 2 trap!",
            body: () => `The exam loves this trick question. Remember:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 8, width: 8, height: 8, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Double edges → × 2 for length", why: "Length is one-dimensional: just × 2" },
                  { text: "Double edges → × 4 for area", why: "Area is two-dimensional: 2 × 2 = 4" },
                  { text: "Double edges → × 8 for volume", why: "Volume is three-dimensional: 2 × 2 × 2 = 8! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: Fraction of Volume
  // ==========================================
  {
    id: "fraction-of-volume",
    name: "Finding a Fraction of Total Volume",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "fraction-of-volume-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to find a fraction of a volume",
          "When you might need to find part of a total volume"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "A fish tank holds 360 cm³ of water. It is three-quarters full.",
            volume: 360,
            length: 10, width: 6, height: 6,
            numerator: 3,
            denominator: 4,
            fractionVolume: 270,
            unit: "cm³",
            dimUnit: "cm",
            fractionWord: "three-quarters",
            interactVolume: 400,
            interactNumerator: 3,
            interactDenominator: 4,
            interactFractionVolume: 300,
            interactLength: 10, interactWidth: 8, interactHeight: 5
          },
          {
            name: "Mr Obi",
            scenario: "A storage box has a volume of 240 cm³. It is two-thirds full of sand.",
            volume: 240,
            length: 10, width: 6, height: 4,
            numerator: 2,
            denominator: 3,
            fractionVolume: 160,
            unit: "cm³",
            dimUnit: "cm",
            fractionWord: "two-thirds",
            interactVolume: 300,
            interactNumerator: 2,
            interactDenominator: 3,
            interactFractionVolume: 200,
            interactLength: 10, interactWidth: 6, interactHeight: 5
          },
          {
            name: "Sophie",
            scenario: "A jug holds 500 ml. It is three-fifths full of juice.",
            volume: 500,
            length: 10, width: 10, height: 5,
            numerator: 3,
            denominator: 5,
            fractionVolume: 300,
            unit: "ml",
            dimUnit: "cm",
            fractionWord: "three-fifths",
            interactVolume: 400,
            interactNumerator: 3,
            interactDenominator: 5,
            interactFractionVolume: 240,
            interactLength: 10, interactWidth: 8, interactHeight: 5
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How much is ${v.fractionWord} of ${v.volume}?`,
            body: (v) => `${v.scenario}\nHow much is actually in it?\nTo find a **fraction of a volume**, divide by the bottom number to find one part, then multiply by the top number!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                height: v.height,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide then multiply!",
            body: (v) => `Finding **${v.numerator}/${v.denominator}** of **${v.volume} ${v.unit}** — same method as fractions of any amount!`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Question:** What is ${v.numerator}/${v.denominator} of ${v.volume} ${v.unit}?`
              },
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Step 1: Divide by the bottom number (${v.denominator})`, why: `${v.volume} ÷ ${v.denominator} = ${v.volume / v.denominator} — that's one ${v.denominator === 4 ? 'quarter' : v.denominator === 3 ? 'third' : 'fifth'}` },
                  { text: `Step 2: Multiply by the top number (${v.numerator})`, why: `${v.volume / v.denominator} × ${v.numerator} = ${v.fractionVolume}` },
                  { text: `${v.numerator}/${v.denominator} of ${v.volume} = ${v.fractionVolume} ${v.unit}`, result: `✓` }
                ]
              }) }
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactNumerator}/${v.interactDenominator}** of **${v.interactVolume}${v.unit}**?`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactLength,
                width: v.interactWidth,
                height: v.interactHeight,
                dimUnit: v.dimUnit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumerator}/${v.interactDenominator} of ${v.interactVolume}?`,
              getOptions: (v) => generateDistractors(v.interactFractionVolume),
              correctAnswer: (v) => v.interactFractionVolume,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactVolume} ÷ ${v.interactDenominator} = ${v.interactVolume / v.interactDenominator}, × ${v.interactNumerator} = **${v.interactFractionVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolume} ÷ ${v.interactDenominator} = ${v.interactVolume / v.interactDenominator}. Then × ${v.interactNumerator} = **${v.interactFractionVolume}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Fraction of a volume!",
            body: () => `To find a fraction of any amount (including volume):`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 10, width: 6, height: 6, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Step 1: Divide by the denominator (the bottom number of a fraction)", why: "This finds ONE part." },
                  { text: "Step 2: Multiply by the numerator (the top number of a fraction)", why: "This gives you the number of parts you need." },
                  { text: "Example: ¾ of 360 = 360 ÷ 4 × 3 = 270", why: "Divide first, then multiply! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Step by Step ----
      {
        id: "fraction-of-volume-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work through fraction-of-volume problems step by step",
          "How to find the volume first, then the fraction"
        ],
        variableSets: [
          {
            name: "Jack",
            scenario: "A cuboid container is 10 cm × 8 cm × 6 cm. It is half full of water.",
            length: 10, width: 8, height: 6,
            volume: 480,
            numerator: 1, denominator: 2,
            fractionVolume: 240,
            unit: "cm³",
            interactVolume: 360,
            interactNumerator: 1, interactDenominator: 2,
            interactFractionVolume: 180
          },
          {
            name: "Miss Clarke",
            scenario: "A cuboid planter is 12 cm × 5 cm × 4 cm. It is three-quarters full of soil.",
            length: 12, width: 5, height: 4,
            volume: 240,
            numerator: 3, denominator: 4,
            fractionVolume: 180,
            unit: "cm³",
            interactVolume: 320,
            interactNumerator: 3, interactDenominator: 4,
            interactFractionVolume: 240
          },
          {
            name: "Ravi",
            scenario: "A cuboid tank is 9 cm × 6 cm × 5 cm. It is two-thirds full.",
            length: 9, width: 6, height: 5,
            volume: 270,
            numerator: 2, denominator: 3,
            fractionVolume: 180,
            unit: "cm³",
            interactVolume: 360,
            interactNumerator: 2, interactDenominator: 3,
            interactFractionVolume: 240
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Two-step challenge!",
            body: (v) => `${v.scenario}\nFirst you need to find the total volume, THEN find the fraction of it. Let's go step by step!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                height: v.height,
                dimUnit: "cm"
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Step by step!",
            body: (v) => `First find the total volume — that's the full **capacity** (how much a container can hold). Then divide by the **denominator** (bottom number) and multiply by the **numerator** (top number). Tap to reveal each step:`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  height: v.height,
                  dimUnit: "cm"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Volume = ${v.length} × ${v.width} × ${v.height}`, why: "Multiply all three dimensions", result: `= ${v.volume}${v.unit}` },
                    { text: `${v.volume} ÷ ${v.denominator} = ${v.volume / v.denominator}`, why: `Find one ${v.denominator === 2 ? 'half' : v.denominator === 4 ? 'quarter' : 'part'}` },
                    { text: `${v.volume / v.denominator} × ${v.numerator} = ${v.fractionVolume}`, why: `Multiply by ${v.numerator}`, result: `= ${v.fractionVolume}${v.unit} ✓` }
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
            body: (v) => `The total volume is **${v.interactVolume}${v.unit}**. What is **${v.interactNumerator}/${v.interactDenominator}** of ${v.interactVolume}?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'CuboidDiagram', props: (v) => ({ length: v.length, width: v.width, height: v.height, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `${v.interactVolume} ÷ ${v.interactDenominator} × ${v.interactNumerator} = ?`, why: "Divide, then multiply!" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumerator}/${v.interactDenominator} of ${v.interactVolume}?`,
              getOptions: (v) => generateDistractors(v.interactFractionVolume),
              correctAnswer: (v) => v.interactFractionVolume,
              feedback: {
                correct: (v) => `Well done! ${v.interactVolume} ÷ ${v.interactDenominator} × ${v.interactNumerator} = **${v.interactFractionVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactVolume} ÷ ${v.interactDenominator} = ${v.interactVolume / v.interactDenominator}, then × ${v.interactNumerator} = **${v.interactFractionVolume}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Volume + fractions — two steps!",
            body: () => `When a container is partly full:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 10, width: 8, height: 6, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Step 1: Find the TOTAL volume (l × w × h)", why: "This is the full capacity (how much a container can hold)." },
                  { text: "Step 2: Find the fraction of the volume", why: "Divide by the denominator (bottom number), multiply by the numerator (top number)." },
                  { text: "Don't skip step 1!", why: "You need the total volume before you can find a fraction of it. ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: Volume Word Problems
  // ==========================================
  {
    id: "volume-word-problems",
    name: "Volume word problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "volume-word-problems-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot when a word problem needs volume",
          "How to pick out the right dimensions from a word problem"
        ],
        variableSets: [
          {
            name: "Mr Hughes",
            scenario: "A rectangular swimming pool is 12 m long, 5 m wide, and 2 m deep.",
            question: "How much water does it hold?",
            length: 12, width: 5, height: 2,
            volume: 120,
            unit: "m³",
            dimUnit: "m",
            clue: "how much it holds (3D space)",
            interactScenario: "A rectangular paddling pool is 6 m long, 4 m wide, and 1 m deep.",
            interactQuestion: "How much water does it hold?",
            interactLength: 6, interactWidth: 4, interactHeight: 1,
            interactVolume: 24
          },
          {
            name: "Amara",
            scenario: "A shipping container is 8 m long, 3 m wide, and 3 m tall.",
            question: "What is the volume of the container?",
            length: 8, width: 3, height: 3,
            volume: 72,
            unit: "m³",
            dimUnit: "m",
            clue: "how much space inside",
            interactScenario: "A garden shed is 5 m long, 4 m wide, and 3 m tall.",
            interactQuestion: "What is the volume of the shed?",
            interactLength: 5, interactWidth: 4, interactHeight: 3,
            interactVolume: 60
          },
          {
            name: "Mrs Chen",
            scenario: "A fish tank is 40 cm long, 25 cm wide, and 30 cm deep.",
            question: "How many cm³ of water can it hold?",
            length: 40, width: 25, height: 30,
            volume: 30000,
            unit: "cm³",
            dimUnit: "cm",
            clue: "how much it can hold",
            interactScenario: "A storage box is 30 cm long, 20 cm wide, and 15 cm deep.",
            interactQuestion: "How many cm³ can it hold?",
            interactLength: 30, interactWidth: 20, interactHeight: 15,
            interactVolume: 9000
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "When do you need volume?",
            body: (v) => `${v.scenario}\n${v.question}\n\nWhen a question mentions **three dimensions** (length, width, height/depth) and asks about **${v.clue}**, it's a volume question!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                height: v.height,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Multiply all three!",
            body: (v) => `**Volume = length × width × height**\n= ${v.length} × ${v.width} × ${v.height}\n= **${v.volume}${v.unit}** ✓\n\nLook for words like: **holds**, **fills**, **capacity (how much a container can hold)**, **space inside**, **packed into**.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  height: v.height,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Length: ${v.length}${v.dimUnit}`, why: "First dimension" },
                    { text: `Width: ${v.width}${v.dimUnit}`, why: "Second dimension" },
                    { text: `Height: ${v.height}${v.dimUnit}`, why: "Third dimension" },
                    { text: `Volume: ${v.length} × ${v.width} × ${v.height} = ${v.volume}${v.unit}`, why: "Multiply all three!", result: "✓" }
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
            body: (v) => `${v.interactScenario}\n${v.interactQuestion}`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.interactLength,
                width: v.interactWidth,
                height: v.interactHeight,
                dimUnit: v.dimUnit
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactLength} × ${v.interactWidth} × ${v.interactHeight}?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactLength} × ${v.interactWidth} × ${v.interactHeight} = ${v.interactVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactLength} × ${v.interactWidth} = ${v.interactLength * v.interactWidth}, then × ${v.interactHeight} = **${v.interactVolume}${v.unit}**. Do it in two steps!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Spotting volume in word problems!",
            body: () => `Volume clue words in exam questions:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 12, width: 5, height: 2, unit: "m" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Clue words: holds, fills, capacity, space inside, packed", why: "These mean volume (3D space)!" },
                  { text: "Look for THREE dimensions", why: "Length, width, AND height (or depth)" },
                  { text: "Multiply all three together", why: "Volume = l × w × h. Don't forget the ³ on the unit! ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "volume-word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone confuses area and volume",
          "Why you need all THREE dimensions for volume"
        ],
        variableSets: [
          {
            name: "Freya",
            scenario: "finding the volume of a box that is 7 cm long, 4 cm wide, and 3 cm tall",
            length: 7, width: 4, height: 3,
            volume: 84,
            wrongAnswer: 28,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "only multiplied two dimensions (7 × 4 = 28) instead of all three — that's the area of the base, not the volume!",
            interactLength: 6, interactWidth: 5, interactHeight: 4,
            interactVolume: 120
          },
          {
            name: "Max",
            scenario: "finding the volume of a crate that is 9 m long, 5 m wide, and 4 m tall",
            length: 9, width: 5, height: 4,
            volume: 180,
            wrongAnswer: 18,
            unit: "m³",
            dimUnit: "m",
            mistakeExplanation: "added the dimensions (9 + 5 + 4 = 18) instead of multiplying them",
            interactLength: 7, interactWidth: 6, interactHeight: 3,
            interactVolume: 126
          },
          {
            name: "Zoe",
            scenario: "finding the volume of a water butt that is 8 cm long, 6 cm wide, and 10 cm tall",
            length: 8, width: 6, height: 10,
            volume: 480,
            wrongAnswer: 48,
            unit: "cm³",
            dimUnit: "cm",
            mistakeExplanation: "multiplied only two dimensions (8 × 6 = 48) — that's the base area, not the volume",
            interactLength: 9, interactWidth: 5, interactHeight: 8,
            interactVolume: 360
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says the volume is **${v.wrongAnswer}${v.unit}**. That's not right!`,
            visual: {
              component: "CuboidDiagram",
              props: (v) => ({
                length: v.length,
                width: v.width,
                height: v.height,
                dimUnit: v.dimUnit
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Volume needs ALL THREE dimensions!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nVolume = length × width × **height**. You need all three!\n\nCorrect: ${v.length} × ${v.width} × ${v.height} = **${v.volume}${v.unit}** ✓`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'CuboidDiagram',
                props: (v) => ({
                  length: v.length,
                  width: v.width,
                  height: v.height,
                  dimUnit: v.dimUnit
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.wrongAnswer}`, why: v.mistakeExplanation, result: "✗" },
                    { text: `Right: ${v.length} × ${v.width} × ${v.height} = ${v.volume}`, why: "All THREE dimensions multiplied", result: `${v.volume}${v.unit} ✓` }
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
            title: () => "What's the correct volume?",
            body: (v) => `A cuboid is **${v.interactLength}${v.dimUnit} × ${v.interactWidth}${v.dimUnit} × ${v.interactHeight}${v.dimUnit}**. What is the volume?`,
            bodyParts: (v) => [
              { type: 'visual', component: 'CuboidDiagram', props: (v) => ({ length: v.interactLength, width: v.interactWidth, height: v.interactHeight, unit: v.dimUnit }) },
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `${v.interactLength} × ${v.interactWidth} × ${v.interactHeight} = ?`, why: "Multiply all three dimensions!" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactLength} × ${v.interactWidth} × ${v.interactHeight}?`,
              getOptions: (v) => generateDistractors(v.interactVolume),
              correctAnswer: (v) => v.interactVolume,
              feedback: {
                correct: (v) => `Well done! **${v.interactLength} × ${v.interactWidth} × ${v.interactHeight} = ${v.interactVolume}${v.unit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactLength} × ${v.interactWidth} = ${v.interactLength * v.interactWidth}, then × ${v.interactHeight} = **${v.interactVolume}${v.unit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Volume vs area — don't mix them up!",
            body: () => `The biggest volume mistake is using only two dimensions:`,
            bodyParts: [
              { type: 'visual', component: 'CuboidDiagram', props: () => ({ length: 7, width: 4, height: 3, unit: "cm" }) },
              { type: 'visual', component: 'WorkedExample', props: () => ({
                steps: [
                  { text: "Area = 2 dimensions (length × width)", why: "Flat space — measured in cm² or m²" },
                  { text: "Volume = 3 dimensions (length × width × height)", why: "3D space — measured in cm³ or m³" },
                  { text: "If your answer has ² instead of ³, you forgot a dimension!", why: "Always check the unit matches the question. ✓" }
                ],
                allRevealed: true
              }) }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  }
];

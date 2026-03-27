// ============================================================
// Supplementary sub-concepts for Ratio & Proportion
// To merge: add these to lessonBank.ratio.subConcepts array in lessonData.js
// ============================================================
import { generateDistractors } from '../lessonData.js';

export const ratioSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: ratio-notation
  // Understanding what 3:2 means
  // Category: supporting
  // Lesson A: curiosity-hook | Lesson B: key-fact
  // ==========================================
  {
    id: "ratio-notation",
    name: "Understanding Ratio Notation",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "ratio-notation-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to understand what the colon (:) symbol means in a ratio (a way of comparing amounts)",
          "How to read and write ratios like 3:2"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "mixing paint for art class",
            itemA: "red", itemB: "blue",
            partA: 3, partB: 2,
            totalParts: 5,
            unit: "pots",
            colourA: "#c084fc", colourB: "#818cf8"
          },
          {
            name: "Ben",
            scenario: "making squash at a summer picnic",
            itemA: "water", itemB: "cordial",
            partA: 4, partB: 1,
            totalParts: 5,
            unit: "cups",
            colourA: "#38bdf8", colourB: "#fbbf24"
          },
          {
            name: "Chloe",
            scenario: "sorting beads for a friendship bracelet",
            itemA: "purple", itemB: "silver",
            partA: 2, partB: 3,
            totalParts: 5,
            unit: "beads",
            colourA: "#c084fc", colourB: "#9ca3af"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.partA}:${v.partB} mean?`,
            body: (v) => `${v.name} is ${v.scenario}. The recipe says mix **${v.itemA}** and **${v.itemB}** in the ratio **${v.partA}:${v.partB}**.\n\nBut what does that colon (:) actually mean? Let's find out!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.partA, label: `${v.itemA}: ${v.partA}`, color: v.colourA },
                  { value: v.partB, label: `${v.itemB}: ${v.partB}`, color: v.colourB }
                ],
                totalLabel: `Ratio ${v.partA}:${v.partB}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The colon means 'for every'",
            body: (v) => `The ratio **${v.partA}:${v.partB}** means: "for every **${v.partA}** ${v.unit} of ${v.itemA}, use **${v.partB}** ${v.unit} of ${v.itemB}."\n\nThe colon **:** is just a special way of writing "to" or "for every". So ${v.partA}:${v.partB} is read as "${v.partA} **to** ${v.partB}".`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.partA; i++) {
                  segs.push({ value: 1, label: v.itemA, color: v.colourA });
                }
                for (let i = 0; i < v.partB; i++) {
                  segs.push({ value: 1, label: v.itemB, color: v.colourB });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.partA} ${v.itemA} for every ${v.partB} ${v.itemB}`,
                  showValues: true
                };
              }
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The colon (:) in a ratio means '____'`,
              options: (v) => ["equals", "for every", "plus", "out of"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! The colon means 'for every' or 'to'. So ${v.partA}:${v.partB} means ${v.partA} for every ${v.partB}. ✓`,
                incorrect: (v) => `Not quite — the colon means **'for every'** or 'to'. ${v.partA}:${v.partB} = ${v.partA} for every ${v.partB}!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name}'s ratio is **${v.partA}:${v.partB}**. How many total parts is that altogether?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.partA, label: `${v.itemA}: ${v.partA}`, color: v.colourA },
                  { value: v.partB, label: `${v.itemB}: ${v.partB}`, color: v.colourB }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many total parts in the ratio ${v.partA}:${v.partB}?`,
              getOptions: (v) => generateDistractors(v.totalParts),
              correctAnswer: (v) => v.totalParts,
              feedback: {
                correct: (v) => `Brilliant! **${v.partA} + ${v.partB} = ${v.totalParts}** parts altogether. The colon just separates the two groups! ✓`,
                incorrect: (v) => `Not quite! Just add the two numbers: ${v.partA} + ${v.partB} = **${v.totalParts}** parts.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Ratio notation — remember this!",
            bodyParts: [
              {
                type: 'text',
                content: () => `A **ratio** compares two (or more) amounts. The colon means **"for every"** or **"to"**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: 'Part A: 3', color: '#c084fc' },
                    { value: 2, label: 'Part B: 2', color: '#818cf8' }
                  ],
                  totalLabel: 'Ratio 3:2 — five equal parts',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "The colon (:) means 'to' or 'for every'", why: "3:2 is read as '3 to 2'" },
                    { text: "The ORDER matters", why: "3:2 is NOT the same as 2:3 — the first number goes with the first thing named" },
                    { text: "Add the parts for the total", why: "3:2 means 3 + 2 = 5 equal parts ✓" }
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
        id: "ratio-notation-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "Why the order in a ratio matters",
          "How to match ratio numbers to the right items"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "packing lunch boxes with sandwiches and fruit pieces",
            itemA: "sandwiches", itemB: "fruit pieces",
            partA: 2, partB: 5,
            totalParts: 7,
            reversed: "5:2",
            colourA: "#fbbf24", colourB: "#34d399",
            interactItemA: "apples", interactItemB: "oranges",
            interactPartA: 3, interactPartB: 4,
            interactTotalParts: 7
          },
          {
            name: "Mia",
            scenario: "mixing concrete with sand and cement",
            itemA: "sand", itemB: "cement",
            partA: 3, partB: 1,
            totalParts: 4,
            reversed: "1:3",
            colourA: "#fbbf24", colourB: "#9ca3af",
            interactItemA: "gravel", interactItemB: "water",
            interactPartA: 5, interactPartB: 2,
            interactTotalParts: 7
          },
          {
            name: "Hassan",
            scenario: "planting flowers with tulips and daffodils",
            itemA: "tulips", itemB: "daffodils",
            partA: 4, partB: 3,
            totalParts: 7,
            reversed: "3:4",
            colourA: "#f87171", colourB: "#fbbf24",
            interactItemA: "roses", interactItemB: "lilies",
            interactPartA: 5, interactPartB: 2,
            interactTotalParts: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Does order matter in ${v.partA}:${v.partB}?`,
            body: (v) => `${v.name} is ${v.scenario}. The ratio of **${v.itemA}** to **${v.itemB}** is **${v.partA}:${v.partB}**.\n\nBut what if someone wrote it the other way round — **${v.reversed}**? Would that be the same?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.partA, label: `${v.itemA}: ${v.partA}`, color: v.colourA },
                  { value: v.partB, label: `${v.itemB}: ${v.partB}`, color: v.colourB }
                ],
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Order matters!",
            body: (v) => `**${v.partA}:${v.partB}** means ${v.partA} ${v.itemA} for every ${v.partB} ${v.itemB}.\n\nBut **${v.reversed}** would mean ${v.partB} ${v.itemA} for every ${v.partA} ${v.itemB} — that's completely different!\n\nAlways match the **first number** to the **first thing** named.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.partA, label: `${v.itemA}: ${v.partA}`, color: v.colourA },
                  { value: v.partB, label: `${v.itemB}: ${v.partB}`, color: v.colourB }
                ],
                totalLabel: `${v.itemA} : ${v.itemB} = ${v.partA}:${v.partB}`,
                showValues: true
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: `${v.itemA} to ${v.itemB}`, right: `${v.partA}:${v.partB}` },
                { left: `${v.itemB} to ${v.itemA}`, right: `${v.partB}:${v.partA}` },
                { left: "First number matches", right: "The first thing named" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Match the ratio!",
            body: (v) => `The ratio of **${v.interactItemA}** to **${v.interactItemB}** is **${v.interactPartA}:${v.interactPartB}**.\n\nWhat is the ratio of **${v.interactItemB}** to **${v.interactItemA}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPartA, label: `${v.interactItemA}: ${v.interactPartA}`, color: v.colourA },
                  { value: v.interactPartB, label: `${v.interactItemB}: ${v.interactPartB}`, color: v.colourB }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ratio of ${v.interactItemB} to ${v.interactItemA}?`,
              getOptions: (v) => [`${v.interactPartB}:${v.interactPartA}`, `${v.interactPartA}:${v.interactPartB}`, `${v.interactPartA}:${v.interactTotalParts}`, `${v.interactPartB}:${v.interactTotalParts}`, `${v.interactTotalParts}:${v.interactPartA}`],
              correctAnswer: (v) => `${v.interactPartB}:${v.interactPartA}`,
              feedback: {
                correct: (v) => `Spot on! Flip the order: **${v.interactItemB}** to **${v.interactItemA}** = **${v.interactPartB}:${v.interactPartA}**. ✓`,
                incorrect: (v) => `Not quite! If ${v.interactItemA} to ${v.interactItemB} is ${v.interactPartA}:${v.interactPartB}, then ${v.interactItemB} to ${v.interactItemA} is just the reverse: **${v.interactPartB}:${v.interactPartA}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Key fact: order matters!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever you write a ratio, check you've matched each number to the correct item. Swapping them changes the meaning entirely!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: 'boys: 3', color: '#38bdf8' },
                    { value: 2, label: 'girls: 2', color: '#f472b6' }
                  ],
                  totalLabel: 'boys:girls = 3:2',
                  showValues: true,
                  comparison: [
                    { value: 2, label: 'boys: 2', color: '#38bdf8' },
                    { value: 3, label: 'girls: 3', color: '#f472b6' }
                  ],
                  comparisonLabel: 'girls:boys = 2:3 — completely different!'
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "The first number matches the first thing named", why: "boys:girls = 3:2 means 3 boys, 2 girls" },
                    { text: "Swapping the order changes the meaning", why: "girls:boys would be 2:3 — the reverse!" },
                    { text: "Always read the question carefully", why: "Check what's being compared to what ✓" }
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
  // SUB-CONCEPT 2: simplifying-ratios
  // Simplifying ratios using common factors
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "simplifying-ratios",
    name: "Simplifying Ratios",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "simplifying-ratios-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to simplify a ratio by dividing both sides by the same number",
          "How to find the highest common factor (the biggest number that divides into both)"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "sorting red and blue counters",
            itemA: "red", itemB: "blue",
            numA: 12, numB: 8,
            hcf: 4,
            simpA: 3, simpB: 2,
            colourA: "#f87171", colourB: "#818cf8",
            interactNumA: 18, interactNumB: 12,
            interactHcf: 6,
            interactSimpA: 3, interactSimpB: 2
          },
          {
            name: "Tom",
            scenario: "counting boys and girls in his swimming class",
            itemA: "boys", itemB: "girls",
            numA: 15, numB: 10,
            hcf: 5,
            simpA: 3, simpB: 2,
            colourA: "#38bdf8", colourB: "#f472b6",
            interactNumA: 20, interactNumB: 12,
            interactHcf: 4,
            interactSimpA: 5, interactSimpB: 3
          },
          {
            name: "Evie",
            scenario: "measuring flour and sugar for biscuits",
            itemA: "flour scoops", itemB: "sugar scoops",
            numA: 6, numB: 9,
            hcf: 3,
            simpA: 2, simpB: 3,
            colourA: "#fbbf24", colourB: "#c084fc",
            interactNumA: 10, interactNumB: 15,
            interactHcf: 5,
            interactSimpA: 2, interactSimpB: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can we simplify ${v.numA}:${v.numB}?`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.numA} ${v.itemA}** and **${v.numB} ${v.itemB}** — that's a ratio of **${v.numA}:${v.numB}**.\n\nCan we write this with smaller numbers? Let's simplify!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.numA, label: `${v.itemA}: ${v.numA}`, color: v.colourA },
                  { value: v.numB, label: `${v.itemB}: ${v.numB}`, color: v.colourB }
                ],
                totalLabel: `Ratio: ${v.numA}:${v.numB}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide both sides by the same number",
            body: (v) => `To simplify, find a number that divides into **both** sides evenly.\nThat's the **highest common factor**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with ${v.numA}:${v.numB}`, why: "Find a number that goes into both" },
                  { text: `The highest common factor of ${v.numA} and ${v.numB} is ${v.hcf}`, why: `${v.hcf} divides evenly into both numbers` },
                  { text: `${v.numA} ÷ ${v.hcf} = ${v.simpA}`, result: `Left side: ${v.simpA}` },
                  { text: `${v.numB} ÷ ${v.hcf} = ${v.simpB}`, result: `Right side: ${v.simpB}` },
                  { text: `Simplified ratio: ${v.simpA}:${v.simpB}`, result: `${v.numA}:${v.numB} = ${v.simpA}:${v.simpB} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the highest common factor of both numbers`,
                `Divide both sides by the highest common factor`,
                `Check you can't divide any further`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the highest common factor, divide both sides, then check. ✓`,
                incorrect: (v) => `Not quite — first find the highest common factor, then divide both sides by it, then check you're done.`
              }
            }
          },
          {
            type: "interact",
            title: (v) => `Simplify ${v.interactNumA}:${v.interactNumB}`,
            body: (v) => `The highest common factor of ${v.interactNumA} and ${v.interactNumB} is **${v.interactHcf}**.\nDivide both sides by ${v.interactHcf}. What does **${v.interactNumA}:${v.interactNumB}** simplify to?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactSimpA, label: `?`, color: v.colourA },
                  { value: v.interactSimpB, label: `?`, color: v.colourB }
                ],
                totalLabel: `÷ ${v.interactHcf} on both sides`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactNumA}:${v.interactNumB} in simplest form?`,
              getOptions: (v) => [
                `${v.interactSimpA}:${v.interactSimpB}`,
                `${v.interactSimpB}:${v.interactSimpA}`,
                `${v.interactNumA / 2}:${v.interactNumB / 2}`,
                `${v.interactSimpA + 1}:${v.interactSimpB}`,
                `${v.interactSimpA}:${v.interactSimpB + 1}`
              ],
              correctAnswer: (v) => `${v.interactSimpA}:${v.interactSimpB}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactNumA} ÷ ${v.interactHcf} = ${v.interactSimpA} and ${v.interactNumB} ÷ ${v.interactHcf} = ${v.interactSimpB}. So it's **${v.interactSimpA}:${v.interactSimpB}**! ✓`,
                incorrect: (v) => `Not quite! Divide both sides by ${v.interactHcf}: ${v.interactNumA} ÷ ${v.interactHcf} = ${v.interactSimpA}, ${v.interactNumB} ÷ ${v.interactHcf} = ${v.interactSimpB}. Answer: **${v.interactSimpA}:${v.interactSimpB}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Simplifying ratios — the recipe!",
            bodyParts: [
              {
                type: 'text',
                content: () => `To simplify any ratio, divide **both sides** by the same number until you can't any more.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: '3', color: '#c084fc' },
                    { value: 2, label: '2', color: '#818cf8' }
                  ],
                  totalLabel: '12:8 simplified = 3:2 (÷4 both sides)',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the highest common factor", why: "The biggest number that divides into both sides" },
                    { text: "Divide BOTH sides by the highest common factor", why: "You must do the same to both — keep it fair!" },
                    { text: "Check: can you divide again?", why: "If not, you've found the simplest form ✓" }
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
        id: "simplifying-ratios-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why you must divide both sides of a ratio, not just one",
          "How to spot a simplifying error"
        ],
        variableSets: [
          {
            name: "Jake",
            numA: 12, numB: 8,
            wrongSimp: "6:8",
            correctSimp: "3:2",
            hcf: 4,
            mistake: "only divided the left side by 2 but forgot to divide the right side too",
            interactNumA: 16, interactNumB: 12,
            interactHcf: 4,
            interactCorrectSimp: "4:3",
            interactWrongSimp: "8:6"
          },
          {
            name: "Rosie",
            numA: 20, numB: 15,
            wrongSimp: "4:5",
            correctSimp: "4:3",
            hcf: 5,
            mistake: "divided 20 by 5 correctly but accidentally divided 15 by 3 instead of 5",
            interactNumA: 24, interactNumB: 18,
            interactHcf: 6,
            interactCorrectSimp: "4:3",
            interactWrongSimp: "12:9"
          },
          {
            name: "Alfie",
            numA: 18, numB: 12,
            wrongSimp: "9:4",
            correctSimp: "3:2",
            hcf: 6,
            mistake: "divided 18 by 2 and 12 by 3 — he used different numbers for each side",
            interactNumA: 14, interactNumB: 21,
            interactHcf: 7,
            interactCorrectSimp: "2:3",
            interactWrongSimp: "7:7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} simplify correctly?`,
            body: (v) => `${v.name} says **${v.numA}:${v.numB}** simplifies to **${v.wrongSimp}**.\n\nHmm... does that look right to you?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.numA}:${v.numB} = ${v.wrongSimp}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe golden rule: **divide BOTH sides by the SAME number**.\nThe highest common factor of ${v.numA} and ${v.numB} is **${v.hcf}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s wrong answer: ${v.wrongSimp}`, why: `${v.name} ${v.mistake}` },
                  { text: `Correct: ${v.numA} ÷ ${v.hcf} = ${v.numA / v.hcf}`, result: `Left side` },
                  { text: `Correct: ${v.numB} ÷ ${v.hcf} = ${v.numB / v.hcf}`, result: `Right side` },
                  { text: `The correct answer is ${v.correctSimp}`, result: "Both sides ÷ the same number ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct simplified ratio?",
            body: (v) => `Now try a new one. What does **${v.interactNumA}:${v.interactNumB}** simplify to?\nHint: the highest common factor is **${v.interactHcf}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Highest common factor of ${v.interactNumA} and ${v.interactNumB} = ${v.interactHcf}` },
                  { text: `Divide both sides by ${v.interactHcf}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumA}:${v.interactNumB} simplified = ?`,
              getOptions: (v) => [v.interactCorrectSimp, v.interactWrongSimp, `${v.interactNumA / 2}:${v.interactNumB / 2}`, `${v.interactNumB / v.interactHcf}:${v.interactNumA / v.interactHcf}`, `1:${Math.round(v.interactNumB / v.interactNumA)}`],
              correctAnswer: (v) => v.interactCorrectSimp,
              feedback: {
                correct: (v) => `Spot on! **${v.interactNumA}:${v.interactNumB} = ${v.interactCorrectSimp}**. Both sides divided by ${v.interactHcf}! ✓`,
                incorrect: (v) => `Not quite! Divide BOTH sides by ${v.interactHcf}: ${v.interactNumA} ÷ ${v.interactHcf} and ${v.interactNumB} ÷ ${v.interactHcf} gives **${v.interactCorrectSimp}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoid this common trap!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The number one mistake with simplifying ratios: **dividing only one side**, or using different divisors for each side.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: '3', color: '#c084fc' },
                    { value: 2, label: '2', color: '#818cf8' }
                  ],
                  totalLabel: 'Both sides ÷ same number = correct simplified ratio',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Always divide BOTH sides by the SAME number", why: "The ratio stays equivalent (worth the same amount) only if you treat both sides equally" },
                    { text: "Use the highest common factor for the quickest simplification", why: "Or divide step by step: ÷2, then ÷2 again, etc." },
                    { text: "Check: can either side still be divided?", why: "If yes, keep going. If not, you're done! ✓" }
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
  // SUB-CONCEPT 3: finding-missing-values
  // Finding a missing value when one part is known
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "finding-missing-values",
    name: "Finding Missing Values in Ratios",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "finding-missing-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the scale factor (the number you multiply by) from a known value",
          "How to multiply to find the missing value"
        ],
        variableSets: [
          {
            name: "Mrs Chen",
            scenario: "mixes orange squash for Sports Day",
            itemA: "water", itemB: "squash",
            ratioA: 5, ratioB: 2,
            knownSide: "water", knownValue: 15,
            scaleFactor: 3,
            missingValue: 6,
            missingSide: "squash",
            unit: "cups",
            interactRatioA: 4, interactRatioB: 3,
            interactKnownSide: "water", interactKnownValue: 20,
            interactScaleFactor: 5,
            interactMissingValue: 15,
            interactMissingSide: "squash",
            interactItemA: "water", interactItemB: "squash"
          },
          {
            name: "Mr Brooks",
            scenario: "orders pencils and rubbers for Year 6",
            itemA: "pencils", itemB: "rubbers",
            ratioA: 3, ratioB: 1,
            knownSide: "pencils", knownValue: 12,
            scaleFactor: 4,
            missingValue: 4,
            missingSide: "rubbers",
            unit: "packs",
            interactRatioA: 5, interactRatioB: 2,
            interactKnownSide: "pencils", interactKnownValue: 25,
            interactScaleFactor: 5,
            interactMissingValue: 10,
            interactMissingSide: "rubbers",
            interactItemA: "pencils", interactItemB: "rubbers"
          },
          {
            name: "Sophie",
            scenario: "decorates cupcakes with stars and hearts",
            itemA: "stars", itemB: "hearts",
            ratioA: 4, ratioB: 3,
            knownSide: "hearts", knownValue: 9,
            scaleFactor: 3,
            missingValue: 12,
            missingSide: "stars",
            unit: "decorations",
            interactRatioA: 3, interactRatioB: 5,
            interactKnownSide: "hearts", interactKnownValue: 20,
            interactScaleFactor: 4,
            interactMissingValue: 12,
            interactMissingSide: "stars",
            interactItemA: "stars", interactItemB: "hearts"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.ratioA}:${v.ratioB} and ${v.knownValue} ${v.knownSide} — how many ${v.missingSide}?`,
            body: (v) => `${v.name} ${v.scenario}. The ratio of **${v.itemA}** to **${v.itemB}** is **${v.ratioA}:${v.ratioB}**.\n\nIf there are **${v.knownValue} ${v.knownSide}**, how many **${v.missingSide}** are needed? Let's work it out step by step!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.ratioA, label: `${v.itemA}: ${v.ratioA} parts`, color: "#c084fc" },
                  { value: v.ratioB, label: `${v.itemB}: ${v.ratioB} parts`, color: "#818cf8" }
                ],
                totalLabel: `${v.knownSide} = ${v.knownValue}. ${v.missingSide} = ?`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the scale factor",
            body: (v) => `The trick is to find **how many times bigger** the real amount is than the ratio number. That's the **scale factor**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => {
                const knownRatio = v.knownSide === v.itemA ? v.ratioA : v.ratioB;
                const missingRatio = v.knownSide === v.itemA ? v.ratioB : v.ratioA;
                return {
                  steps: [
                    { text: `The ratio says ${v.knownSide} = ${knownRatio} parts`, why: `But we actually have ${v.knownValue} ${v.knownSide}` },
                    { text: `Scale factor: ${v.knownValue} ÷ ${knownRatio} = ${v.scaleFactor}`, why: `Each part has been multiplied by ${v.scaleFactor}` },
                    { text: `${v.missingSide}: ${missingRatio} × ${v.scaleFactor} = ${v.missingValue}`, result: `${v.missingSide} = ${v.missingValue} ${v.unit}` },
                  ],
                  allRevealed: true
                };
              }
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Divide the known value by its ratio number to find the scale factor`,
                `Multiply the other ratio number by the scale factor`,
                `Check the answer makes sense with the original ratio`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the scale factor, multiply, then check. ✓`,
                incorrect: (v) => `Not quite — first find the scale factor by dividing, then multiply the other side by it.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The ratio is **${v.interactRatioA}:${v.interactRatioB}** and there are **${v.interactKnownValue} ${v.interactKnownSide}**.\n\nHow many **${v.interactMissingSide}** are there?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactRatioA, label: `${v.interactItemA}: ${v.interactKnownSide === v.interactItemA ? v.interactKnownValue : '?'}`, color: "#c084fc" },
                  { value: v.interactRatioB, label: `${v.interactItemB}: ${v.interactKnownSide === v.interactItemB ? v.interactKnownValue : '?'}`, color: "#818cf8" }
                ],
                totalLabel: `Scale factor = ${v.interactScaleFactor}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many ${v.interactMissingSide}?`,
              getOptions: (v) => generateDistractors(v.interactMissingValue),
              correctAnswer: (v) => v.interactMissingValue,
              feedback: {
                correct: (v) => `Brilliant! The scale factor is ${v.interactScaleFactor}, so ${v.interactMissingSide} = **${v.interactMissingValue}**! ✓`,
                incorrect: (v) => {
                  const missingRatio = v.interactKnownSide === v.interactItemA ? v.interactRatioB : v.interactRatioA;
                  return `Not quite! Scale factor = ${v.interactScaleFactor}. Multiply: ${missingRatio} × ${v.interactScaleFactor} = **${v.interactMissingValue}**.`;
                }
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding missing values — the recipe!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When you know one side of a ratio and need to find the other:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: 'A: 15', color: '#c084fc' },
                    { value: 2, label: 'B: ?', color: '#818cf8' }
                  ],
                  totalLabel: 'Ratio 3:2. If A = 15, scale factor = 15 ÷ 3 = 5. B = 2 × 5 = 10',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the scale factor", why: "Divide the known value by its ratio number" },
                    { text: "Step 2: Multiply the other ratio number by the scale factor", why: "This gives you the missing value" },
                    { text: "Step 3: Check it makes sense", why: "The ratio between your answers should match the original ratio ✓" }
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
        id: "finding-missing-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why adding instead of multiplying is wrong in ratio problems",
          "How to use the scale factor correctly"
        ],
        variableSets: [
          {
            name: "Lily",
            ratioA: 3, ratioB: 5,
            itemA: "boys", itemB: "girls",
            knownSide: "boys", knownValue: 9,
            scaleFactor: 3,
            wrongAnswer: 7,
            correctAnswer: 15,
            mistake: "added 4 to get from 3 to 7, instead of multiplying by 3",
            interactRatioA: 2, interactRatioB: 3,
            interactKnownSide: "boys", interactKnownValue: 10,
            interactScaleFactor: 5,
            interactCorrectAnswer: 15,
            interactItemB: "girls"
          },
          {
            name: "Oscar",
            ratioA: 2, ratioB: 7,
            itemA: "red beads", itemB: "blue beads",
            knownSide: "red beads", knownValue: 8,
            scaleFactor: 4,
            wrongAnswer: 13,
            correctAnswer: 28,
            mistake: "added 6 to get from 7 to 13, but ratios use multiplication not addition",
            interactRatioA: 3, interactRatioB: 5,
            interactKnownSide: "red beads", interactKnownValue: 12,
            interactScaleFactor: 4,
            interactCorrectAnswer: 20,
            interactItemB: "blue beads"
          },
          {
            name: "Amira",
            ratioA: 4, ratioB: 3,
            itemA: "crisps", itemB: "sandwiches",
            knownSide: "crisps", knownValue: 20,
            scaleFactor: 5,
            wrongAnswer: 19,
            correctAnswer: 15,
            mistake: "subtracted 1 from 20 instead of finding the scale factor and multiplying",
            interactRatioA: 5, interactRatioB: 2,
            interactKnownSide: "crisps", interactKnownValue: 15,
            interactScaleFactor: 3,
            interactCorrectAnswer: 6,
            interactItemB: "sandwiches"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} get it right?`,
            body: (v) => `The ratio of ${v.itemA} to ${v.itemB} is **${v.ratioA}:${v.ratioB}**. There are **${v.knownValue} ${v.knownSide}**.\n\n${v.name} says there must be **${v.wrongAnswer} ${v.itemB}**. Is that correct?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.ratioA, label: `${v.itemA}: ${v.knownValue}`, color: "#c084fc" },
                  { value: v.ratioB, label: `${v.itemB}: ${v.wrongAnswer}?`, color: "#f87171" }
                ],
                totalLabel: `${v.name}'s answer — is it right?`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The mistake: adding instead of multiplying!",
            body: (v) => `${v.name} ${v.mistake}.\n\nRatios work with **multiplication**, not addition. Here's the correct way:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scale factor: ${v.knownValue} ÷ ${v.ratioA} = ${v.scaleFactor}`, why: "Divide the known value by its ratio number" },
                  { text: `${v.itemB}: ${v.ratioB} × ${v.scaleFactor} = ${v.correctAnswer}`, result: `The correct answer is ${v.correctAnswer}` },
                  { text: `${v.name}'s answer of ${v.wrongAnswer} is wrong!`, why: `${v.name} ${v.mistake}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Ratios work by multiplying, not adding`, answer: true, explanation: `Correct — if one part is multiplied by 3, all parts must be multiplied by 3. ✓` },
                { text: `To find the missing side, add the difference between the ratio numbers`, answer: false, explanation: `No! Ratios use multiplication. Find the scale factor and multiply — never add!` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `Ratio ${v.interactRatioA}:${v.interactRatioB}. There are ${v.interactKnownValue} ${v.interactKnownSide}.\n\nHow many ${v.interactItemB} should there be?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactRatioA, label: `${v.itemA}: ${v.interactKnownValue}`, color: "#c084fc" },
                  { value: v.interactRatioB, label: `${v.interactItemB}: ?`, color: "#818cf8" }
                ],
                totalLabel: `Scale factor = ${v.interactScaleFactor}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many ${v.interactItemB}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.interactRatioB} × ${v.interactScaleFactor} = **${v.interactCorrectAnswer}**. Multiply, don't add! ✓`,
                incorrect: (v) => `Not quite! Scale factor = ${v.interactScaleFactor}. So ${v.interactRatioB} × ${v.interactScaleFactor} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember: ratios use multiplication!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common ratio mistake is **adding** when you should be **multiplying**. Always find the scale factor first!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: 'A: 12', color: '#c084fc' },
                    { value: 5, label: 'B: 20', color: '#818cf8' }
                  ],
                  totalLabel: 'Ratio 3:5 × scale factor 4 = 12:20',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Ratios scale by MULTIPLICATION, not addition", why: "If one part × 3, ALL parts × 3" },
                    { text: "Find the scale factor: divide the known value by its ratio number", why: "This tells you how much each part has been multiplied by" },
                    { text: "Multiply the other ratio number by the same scale factor", why: "That gives the correct missing value ✓" }
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
  // SUB-CONCEPT 4: scaling-recipes
  // Scaling recipes up and down
  // Category: core
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "scaling-recipes",
    name: "Scaling Recipes Up and Down",
    category: "core",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "scaling-recipes-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to scale a recipe to make more or fewer servings",
          "Why you multiply (or divide) every ingredient by the same amount"
        ],
        variableSets: [
          {
            name: "Grandma",
            scenario: "baking scones for a village fête",
            servesOrig: 4,
            servesNew: 12,
            scaleFactor: 3,
            ingredient1: "flour", amount1: 200, unit1: "g",
            ingredient2: "butter", amount2: 50, unit2: "g",
            ingredient3: "milk", amount3: 100, unit3: "ml",
            new1: 600, new2: 150, new3: 300,
            interactServesOrig: 3, interactServesNew: 9,
            interactScaleFactor: 3,
            interactIngredient: "sugar", interactAmount: 80, interactUnit: "g",
            interactNew: 240
          },
          {
            name: "Dad",
            scenario: "making pancakes for a Sunday breakfast",
            servesOrig: 2,
            servesNew: 8,
            scaleFactor: 4,
            ingredient1: "flour", amount1: 100, unit1: "g",
            ingredient2: "eggs", amount2: 1, unit2: "egg",
            ingredient3: "milk", amount3: 150, unit3: "ml",
            new1: 400, new2: 4, new3: 600,
            interactServesOrig: 3, interactServesNew: 12,
            interactScaleFactor: 4,
            interactIngredient: "sugar", interactAmount: 50, interactUnit: "g",
            interactNew: 200
          },
          {
            name: "Layla",
            scenario: "making smoothies for her family",
            servesOrig: 1,
            servesNew: 5,
            scaleFactor: 5,
            ingredient1: "banana", amount1: 1, unit1: "banana",
            ingredient2: "yoghurt", amount2: 50, unit2: "g",
            ingredient3: "milk", amount3: 100, unit3: "ml",
            new1: 5, new2: 250, new3: 500,
            interactServesOrig: 2, interactServesNew: 6,
            interactScaleFactor: 3,
            interactIngredient: "honey", interactAmount: 10, interactUnit: "ml",
            interactNew: 30
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.servesOrig} servings → ${v.servesNew} servings?`,
            body: (v) => `${v.name} is ${v.scenario}. The recipe serves **${v.servesOrig}** but ${v.name} needs to serve **${v.servesNew}**.\n\nHow do we change the amounts? We need to **scale up** the recipe!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Original recipe (serves ${v.servesOrig})` },
                  { text: `${v.ingredient1}: ${v.amount1}${v.unit1}` },
                  { text: `${v.ingredient2}: ${v.amount2} ${v.unit2}` },
                  { text: `${v.ingredient3}: ${v.amount3}${v.unit3}` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply EVERY ingredient!",
            body: (v) => `First, find the scale factor: **${v.servesNew} ÷ ${v.servesOrig} = ${v.scaleFactor}**.\n\nThen multiply **every** ingredient by **${v.scaleFactor}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scale factor: ${v.servesNew} ÷ ${v.servesOrig} = ${v.scaleFactor}`, why: "How many times bigger?" },
                  { text: `${v.ingredient1}: ${v.amount1} × ${v.scaleFactor} = ${v.new1}${v.unit1}`, result: `${v.new1}${v.unit1}` },
                  { text: `${v.ingredient2}: ${v.amount2} × ${v.scaleFactor} = ${v.new2} ${v.unit2}`, result: `${v.new2} ${v.unit2}` },
                  { text: `${v.ingredient3}: ${v.amount3} × ${v.scaleFactor} = ${v.new3}${v.unit3}`, result: `${v.new3}${v.unit3}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A different recipe uses **${v.interactAmount}${v.interactUnit}** of ${v.interactIngredient} for **${v.interactServesOrig}** servings.\n\nHow much ${v.interactIngredient} for **${v.interactServesNew}** servings?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scale factor: ${v.interactServesNew} ÷ ${v.interactServesOrig} = ${v.interactScaleFactor}` },
                  { text: `${v.interactIngredient}: ${v.interactAmount}${v.interactUnit} × ${v.interactScaleFactor} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactAmount} × ${v.interactScaleFactor} = ?`,
              getOptions: (v) => generateDistractors(v.interactNew),
              correctAnswer: (v) => v.interactNew,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactAmount} × ${v.interactScaleFactor} = **${v.interactNew}${v.interactUnit}**. Every ingredient gets multiplied by the same amount! ✓`,
                incorrect: (v) => `Not quite! ${v.interactAmount} × ${v.interactScaleFactor} = **${v.interactNew}${v.interactUnit}**. Remember: multiply by the scale factor.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Scaling recipes — the recipe for recipes!",
            bodyParts: [
              {
                type: 'text',
                content: () => `To scale a recipe up or down, **multiply (or divide) every ingredient by the same scale factor**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 1, label: 'flour', color: '#fbbf24' },
                    { value: 1, label: 'butter', color: '#c084fc' },
                    { value: 1, label: 'milk', color: '#38bdf8' }
                  ],
                  totalLabel: 'Original recipe (serves 4)',
                  showValues: true,
                  comparison: [
                    { value: 3, label: 'flour ×3', color: '#fbbf24' },
                    { value: 3, label: 'butter ×3', color: '#c084fc' },
                    { value: 3, label: 'milk ×3', color: '#38bdf8' }
                  ],
                  comparisonLabel: 'Scaled recipe (serves 12) — every ingredient ×3'
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the scale factor", why: "New servings ÷ original servings" },
                    { text: "Step 2: Multiply EVERY ingredient by the scale factor", why: "Miss one ingredient and the recipe goes wrong!" },
                    { text: "Step 3: Double-check each amount", why: "Make sure you multiplied, not added ✓" }
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
        id: "scaling-recipes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why you must scale ALL ingredients, not just some",
          "How to spot and fix recipe scaling errors"
        ],
        variableSets: [
          {
            name: "Noah",
            servesOrig: 4, servesNew: 8, scaleFactor: 2,
            ingredient1: "flour", amount1: 200, unit1: "g", new1: 400,
            ingredient2: "sugar", amount2: 100, unit2: "g", new2: 200,
            ingredient3: "eggs", amount3: 2, unit3: "eggs",
            wrongNew3: 2, correctNew3: 4,
            mistake: "forgot to double the eggs — he left them at 2 instead of multiplying by 2",
            interactIngredient: "butter", interactAmount: 75, interactUnit: "g",
            interactScaleFactor: 2, interactCorrectNew: 150
          },
          {
            name: "Isla",
            servesOrig: 3, servesNew: 9, scaleFactor: 3,
            ingredient1: "pasta", amount1: 150, unit1: "g", new1: 450,
            ingredient2: "sauce", amount2: 100, unit2: "ml", new2: 300,
            ingredient3: "cheese", amount3: 30, unit3: "g",
            wrongNew3: 60, correctNew3: 90,
            mistake: "doubled the cheese instead of tripling it — she multiplied by 2 not 3",
            interactIngredient: "onion", interactAmount: 40, interactUnit: "g",
            interactScaleFactor: 3, interactCorrectNew: 120
          },
          {
            name: "Zara",
            servesOrig: 2, servesNew: 10, scaleFactor: 5,
            ingredient1: "butter", amount1: 50, unit1: "g", new1: 250,
            ingredient2: "cocoa", amount2: 30, unit2: "g", new2: 150,
            ingredient3: "milk", amount3: 100, unit3: "ml",
            wrongNew3: 200, correctNew3: 500,
            mistake: "multiplied the milk by 2 instead of 5 — she got confused about the scale factor",
            interactIngredient: "sugar", interactAmount: 60, interactUnit: "g",
            interactScaleFactor: 5, interactCorrectNew: 300
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Something's not right...`,
            body: (v) => `${v.name} scaled a recipe from **${v.servesOrig}** to **${v.servesNew}** servings (multiply everything by **${v.scaleFactor}**). But one ingredient is wrong — can you spot it?`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Original (${v.servesOrig} servings):**\n${v.ingredient1}: ${v.amount1} ${v.unit1} | ${v.ingredient2}: ${v.amount2} ${v.unit2} | ${v.ingredient3}: ${v.amount3} ${v.unit3}`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.ingredient1}: ${v.amount1} × ${v.scaleFactor} = ${v.new1} ${v.unit1}`, why: "✓ Correct" },
                    { text: `${v.ingredient2}: ${v.amount2} × ${v.scaleFactor} = ${v.new2} ${v.unit2}`, why: "✓ Correct" },
                    { text: `${v.ingredient3}: ${v.wrongNew3} ${v.unit3}`, why: `Is this right? ${v.amount3} × ${v.scaleFactor} = ?` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Found it!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe scale factor is **${v.servesNew} ÷ ${v.servesOrig} = ${v.scaleFactor}**. So ${v.ingredient3} should be: **${v.amount3} × ${v.scaleFactor} = ${v.correctNew3}${v.unit3}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scale factor: × ${v.scaleFactor}`, why: `${v.servesNew} ÷ ${v.servesOrig} = ${v.scaleFactor}` },
                  { text: `${v.ingredient3}: ${v.amount3} × ${v.scaleFactor} = ${v.correctNew3}${v.unit3}`, result: `Not ${v.wrongNew3} — it should be ${v.correctNew3}!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Every ingredient must be multiplied by the same scale factor`, answer: true, explanation: `Correct — miss one ingredient and the whole recipe goes wrong! ✓` },
                { text: `Small amounts like eggs don't need to be scaled`, answer: false, explanation: `Every ingredient must be scaled — even eggs! 2 eggs × ${v.scaleFactor} = ${v.correctNew3}.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What should the correct amount be?",
            body: (v) => `The recipe originally uses **${v.interactAmount}${v.interactUnit}** of ${v.interactIngredient}.\n\nScale factor is **${v.interactScaleFactor}**. What's the correct amount?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactIngredient}: ${v.interactAmount} × ${v.interactScaleFactor} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactAmount} × ${v.interactScaleFactor} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectNew),
              correctAnswer: (v) => v.interactCorrectNew,
              feedback: {
                correct: (v) => `Spot on! ${v.interactAmount} × ${v.interactScaleFactor} = **${v.interactCorrectNew}${v.interactUnit}**. Every ingredient must use the same scale factor! ✓`,
                incorrect: (v) => `Not quite! ${v.interactAmount} × ${v.interactScaleFactor} = **${v.interactCorrectNew}${v.interactUnit}**. Multiply by the scale factor, not anything else!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The golden rule of scaling!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When scaling a recipe, **every single ingredient** must be multiplied (or divided) by the **same** scale factor. Miss one and the whole thing goes wrong!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 2, label: 'pasta ×2', color: '#fbbf24' },
                    { value: 2, label: 'sauce ×2', color: '#f87171' },
                    { value: 2, label: 'cheese ×2', color: '#c084fc' }
                  ],
                  totalLabel: 'Every ingredient × same scale factor',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the scale factor FIRST", why: "New servings ÷ original servings" },
                    { text: "Apply it to EVERY ingredient", why: "Not just some — all of them!" },
                    { text: "Double-check each one matches", why: "Especially small amounts like eggs ✓" }
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
  // SUB-CONCEPT 5: unitary-method
  // Find the value of 1, then scale
  // Category: core
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "unitary-method",
    name: "The Unitary Method",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "unitary-method-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the value of one unit first",
          "How to multiply up to find any number of units"
        ],
        variableSets: [
          {
            name: "A shop",
            scenario: "sells packs of colouring pencils",
            groupSize: 5,
            groupCost: 15,
            unitCost: 3,
            targetSize: 8,
            targetCost: 24,
            unit: "pencils",
            costUnit: "£",
            interactUnitCost: 4,
            interactTargetSize: 6,
            interactTargetCost: 24,
            interactUnit: "rulers"
          },
          {
            name: "A bakery",
            scenario: "sells cupcakes in boxes",
            groupSize: 4,
            groupCost: 12,
            unitCost: 3,
            targetSize: 7,
            targetCost: 21,
            unit: "cupcakes",
            costUnit: "£",
            interactUnitCost: 5,
            interactTargetSize: 9,
            interactTargetCost: 45,
            interactUnit: "muffins"
          },
          {
            name: "A farm shop",
            scenario: "sells apples by weight",
            groupSize: 3,
            groupCost: 6,
            unitCost: 2,
            targetSize: 8,
            targetCost: 16,
            unit: "kg",
            costUnit: "£",
            interactUnitCost: 3,
            interactTargetSize: 7,
            interactTargetCost: 21,
            interactUnit: "bags"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.groupSize} ${v.unit} cost ${v.costUnit}${v.groupCost}. What about ${v.targetSize}?`,
            body: (v) => `${v.name} ${v.scenario}. If **${v.groupSize} ${v.unit}** cost **${v.costUnit}${v.groupCost}**, how much would **${v.targetSize} ${v.unit}** cost?\n\nThe secret: find the cost of **one** first!`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.groupSize; i++) {
                  segs.push({ value: 1, label: '?', color: "#c084fc" });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.groupSize} ${v.unit} = ${v.costUnit}${v.groupCost}`,
                  showValues: true
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step 1: Find the value of ONE",
            body: (v) => `Divide the total cost by the number of items to find what **one** costs.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.groupSize} ${v.unit} = ${v.costUnit}${v.groupCost}`, why: "We know the total" },
                  { text: `1 ${v.unit.slice(0, -1) || v.unit} = ${v.costUnit}${v.groupCost} ÷ ${v.groupSize} = ${v.costUnit}${v.unitCost}`, result: `One ${v.unit.slice(0, -1) || v.unit} costs ${v.costUnit}${v.unitCost}` },
                  { text: `${v.targetSize} ${v.unit} = ${v.unitCost} × ${v.targetSize} = ${v.costUnit}${v.targetCost}`, result: `Answer: ${v.costUnit}${v.targetCost}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Divide the total cost by the number of items to find the cost of one`,
                `Multiply the cost of one by however many you need`
              ],
              feedback: {
                correct: (v) => `Perfect order! Divide to find one, then multiply to find many. ✓`,
                incorrect: (v) => `Not quite — first divide to find the cost of ONE, then multiply by the number you need.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `One of the ${v.interactUnit} costs **${v.costUnit}${v.interactUnitCost}**.\n\nHow much do **${v.interactTargetSize} ${v.interactUnit}** cost?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.interactTargetSize; i++) {
                  segs.push({ value: 1, label: `${v.costUnit}${v.interactUnitCost}`, color: "#818cf8" });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.interactTargetSize} × ${v.costUnit}${v.interactUnitCost} = ?`,
                  showValues: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactUnitCost} × ${v.interactTargetSize} = ?`,
              getOptions: (v) => generateDistractors(v.interactTargetCost),
              correctAnswer: (v) => v.interactTargetCost,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactUnitCost} × ${v.interactTargetSize} = **${v.costUnit}${v.interactTargetCost}**. Find one, then multiply! ✓`,
                incorrect: (v) => `Not quite! One costs ${v.costUnit}${v.interactUnitCost}. So ${v.interactTargetSize} cost: ${v.interactUnitCost} × ${v.interactTargetSize} = **${v.costUnit}${v.interactTargetCost}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The unitary method!",
            bodyParts: [
              {
                type: 'text',
                content: () => `This powerful method works for almost any proportion (share of the whole) problem:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 1, label: '£3', color: '#c084fc' },
                    { value: 1, label: '£3', color: '#c084fc' },
                    { value: 1, label: '£3', color: '#c084fc' },
                    { value: 1, label: '£3', color: '#c084fc' },
                    { value: 1, label: '£3', color: '#c084fc' }
                  ],
                  totalLabel: '5 items × £3 each = £15. Find ONE first, then multiply!',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: DIVIDE to find the value of ONE", why: "Total ÷ number of items" },
                    { text: "Step 2: MULTIPLY to find the value of however many you need", why: "One × how many you want" },
                    { text: "That's it! Find one, then scale up.", why: "This works for cost, weight, distance — anything! ✓" }
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
        id: "unitary-method-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that the bar model shows the unitary method (finding what one unit is worth first)",
          "When to use divide-then-multiply thinking"
        ],
        variableSets: [
          {
            name: "A sweet shop",
            groupSize: 6,
            groupCost: 18,
            unitCost: 3,
            targetSize: 4,
            targetCost: 12,
            unit: "sweets",
            costUnit: "£",
            interactUnitCost: 2,
            interactTargetSize: 9,
            interactTargetCost: 18
          },
          {
            name: "A garden centre",
            groupSize: 5,
            groupCost: 20,
            unitCost: 4,
            targetSize: 8,
            targetCost: 32,
            unit: "plants",
            costUnit: "£",
            interactUnitCost: 5,
            interactTargetSize: 6,
            interactTargetCost: 30
          },
          {
            name: "A stationery shop",
            groupSize: 3,
            groupCost: 12,
            unitCost: 4,
            targetSize: 7,
            targetCost: 28,
            unit: "notebooks",
            costUnit: "£",
            interactUnitCost: 3,
            interactTargetSize: 5,
            interactTargetCost: 15
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What do you notice?",
            body: (v) => `Look at the bar below. **${v.groupSize} ${v.unit}** cost **${v.costUnit}${v.groupCost}**. Each part of the bar is the same size. What does each part represent?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.groupSize; i++) {
                  segs.push({ value: 1, label: `${v.costUnit}${v.unitCost}`, color: "#c084fc" });
                }
                return {
                  segments: segs,
                  totalLabel: `Total: ${v.costUnit}${v.groupCost}`,
                  showValues: true
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Each part = the cost of ONE",
            body: (v) => `Each section of the bar represents **one** item. Since ${v.groupSize} items cost ${v.costUnit}${v.groupCost}, each one costs **${v.costUnit}${v.groupCost} ÷ ${v.groupSize} = ${v.costUnit}${v.unitCost}**.\n\nNow we can find the cost of **any** number of items!`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.targetSize; i++) {
                  segs.push({ value: 1, label: `${v.costUnit}${v.unitCost}`, color: "#818cf8" });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.targetSize} items = ${v.targetSize} × ${v.costUnit}${v.unitCost} = ${v.costUnit}${v.targetCost}`,
                  showValues: true
                };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Each item costs **${v.costUnit}${v.interactUnitCost}**. What do **${v.interactTargetSize}** cost altogether?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.interactTargetSize; i++) {
                  segs.push({ value: 1, label: `${v.costUnit}${v.interactUnitCost}`, color: "#818cf8" });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.interactTargetSize} × ${v.costUnit}${v.interactUnitCost} = ?`,
                  showValues: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactTargetSize} × ${v.interactUnitCost} = ?`,
              getOptions: (v) => generateDistractors(v.interactTargetCost),
              correctAnswer: (v) => v.interactTargetCost,
              feedback: {
                correct: (v) => `Fantastic! ${v.interactTargetSize} × ${v.interactUnitCost} = **${v.costUnit}${v.interactTargetCost}**. The bar model makes it easy to see! ✓`,
                incorrect: (v) => `Not quite! Each one costs ${v.costUnit}${v.interactUnitCost}. So ${v.interactTargetSize} × ${v.interactUnitCost} = **${v.costUnit}${v.interactTargetCost}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "See it in the bar!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The bar model makes the unitary method really clear. Split the bar into equal parts, find what ONE part is worth, then build up to however many you need!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 1, label: '£4', color: '#818cf8' },
                    { value: 1, label: '£4', color: '#818cf8' },
                    { value: 1, label: '£4', color: '#818cf8' },
                    { value: 1, label: '£4', color: '#818cf8' }
                  ],
                  totalLabel: 'Total: £16. Each part = £4. Find ONE, then multiply!',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Split into equal parts", why: "Each part = one item" },
                    { text: "Divide total by number of parts", why: "Find the value of ONE" },
                    { text: "Multiply ONE by however many you need", why: "Build up to the answer ✓" }
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
  // SUB-CONCEPT 6: scale-factors-maps
  // Scale factors for maps and models
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: key-fact
  // ==========================================
  {
    id: "scale-factors-maps",
    name: "Scale Factors for Maps and Models",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "scale-maps-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to use scale factors (the number you multiply by) to link model sizes to real sizes",
          "How to use a scale to find a real distance"
        ],
        variableSets: [
          {
            name: "Amara",
            scenario: "measuring distances on a map of Dorset",
            mapDistance: 3,
            mapUnit: "cm",
            scaleFactor: 5,
            scaleDesc: "1 cm = 5 km",
            realDistance: 15,
            realUnit: "km",
            from: "Bournemouth", to: "Poole",
            interactMapDistance: 7,
            interactScaleFactor: 5,
            interactScaleDesc: "1 cm = 5 km",
            interactRealDistance: 35,
            interactRealUnit: "km"
          },
          {
            name: "Jack",
            scenario: "building a model of the Eiffel Tower",
            mapDistance: 6,
            mapUnit: "cm",
            scaleFactor: 50,
            scaleDesc: "1 cm = 50 m",
            realDistance: 300,
            realUnit: "m",
            from: "the base", to: "the top",
            interactMapDistance: 4,
            interactScaleFactor: 50,
            interactScaleDesc: "1 cm = 50 m",
            interactRealDistance: 200,
            interactRealUnit: "m"
          },
          {
            name: "Fatima",
            scenario: "reading a map for a geography project",
            mapDistance: 4,
            mapUnit: "cm",
            scaleFactor: 10,
            scaleDesc: "1 cm = 10 km",
            realDistance: 40,
            realUnit: "km",
            from: "her school", to: "the coast",
            interactMapDistance: 6,
            interactScaleFactor: 10,
            interactScaleDesc: "1 cm = 10 km",
            interactRealDistance: 60,
            interactRealUnit: "km"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.mapDistance}${v.mapUnit} on the map — how far in real life?`,
            body: (v) => `${v.name} is ${v.scenario}. The scale says **${v.scaleDesc}**.\n\nThe distance from ${v.from} to ${v.to} measures **${v.mapDistance}${v.mapUnit}** on the map. How far is that really?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.mapDistance; i++) {
                  segs.push({ value: 1, label: `1${v.mapUnit}`, color: "#38bdf8" });
                }
                return {
                  segments: segs,
                  totalLabel: `Map: ${v.mapDistance}${v.mapUnit}. Real life: ? ${v.realUnit}`,
                  showValues: true
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply by the scale factor!",
            body: (v) => `The scale **${v.scaleDesc}** tells us that every **1${v.mapUnit}** on the map is really **${v.scaleFactor} ${v.realUnit}**.\n\nSo ${v.mapDistance}${v.mapUnit} on the map = **${v.mapDistance} × ${v.scaleFactor} = ${v.realDistance} ${v.realUnit}** in real life!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Scale: ${v.scaleDesc}`, why: "1 unit on the map = many units in real life" },
                  { text: `Map distance: ${v.mapDistance}${v.mapUnit}`, why: "This is what we measure" },
                  { text: `Real distance: ${v.mapDistance} × ${v.scaleFactor} = ${v.realDistance} ${v.realUnit}`, result: `${v.realDistance} ${v.realUnit}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To go from map distance to real distance, you ____ by the scale factor`,
              options: (v) => ["divide", "multiply", "subtract", "add"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Map to real = multiply. Real to map = divide. ✓`,
                incorrect: (v) => `Not quite — to go from map to real life, you **multiply** by the scale factor!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The scale is **${v.interactScaleDesc}** and the map distance is **${v.interactMapDistance}${v.mapUnit}**.\n\nWhat is the real distance?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const segs = [];
                for (let i = 0; i < v.interactMapDistance; i++) {
                  segs.push({ value: 1, label: `${v.interactScaleFactor}${v.interactRealUnit}`, color: "#38bdf8" });
                }
                return {
                  segments: segs,
                  totalLabel: `${v.interactMapDistance} × ${v.interactScaleFactor} = ?`,
                  showValues: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactMapDistance} × ${v.interactScaleFactor} = ?`,
              getOptions: (v) => generateDistractors(v.interactRealDistance),
              correctAnswer: (v) => v.interactRealDistance,
              feedback: {
                correct: (v) => `Superstar! ${v.interactMapDistance} × ${v.interactScaleFactor} = **${v.interactRealDistance} ${v.interactRealUnit}**. That's the real distance! ✓`,
                incorrect: (v) => `Not quite! Each ${v.mapUnit} on the map = ${v.interactScaleFactor} ${v.interactRealUnit}. So ${v.interactMapDistance} × ${v.interactScaleFactor} = **${v.interactRealDistance} ${v.interactRealUnit}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Maps and models use scale factors!",
            body: () => `A **scale** tells you how many times bigger (or smaller) real life is compared to the map or model.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the scale carefully", why: "e.g. 1 cm = 5 km" },
                  { text: "Measure the map distance", why: "Use a ruler!" },
                  { text: "Multiply by the scale factor", why: "Map distance × scale = real distance ✓" }
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
        id: "scale-maps-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to go from real life back to map distance",
          "Why dividing reverses a scale factor"
        ],
        variableSets: [
          {
            name: "Lily",
            scaleDesc: "1 cm = 2 km",
            scaleFactor: 2,
            realDistance: 10,
            realUnit: "km",
            mapDistance: 5,
            mapUnit: "cm",
            // Interact uses different values to avoid teach/interact overlap
            interactScaleDesc: "1 cm = 2 km",
            interactScaleFactor: 2,
            interactRealDistance: 16,
            interactRealUnit: "km",
            interactMapDistance: 8
          },
          {
            name: "Ethan",
            scaleDesc: "1 cm = 4 km",
            scaleFactor: 4,
            realDistance: 20,
            realUnit: "km",
            mapDistance: 5,
            mapUnit: "cm",
            interactScaleDesc: "1 cm = 4 km",
            interactScaleFactor: 4,
            interactRealDistance: 36,
            interactRealUnit: "km",
            interactMapDistance: 9
          },
          {
            name: "Grace",
            scaleDesc: "1 cm = 10 km",
            scaleFactor: 10,
            realDistance: 50,
            realUnit: "km",
            mapDistance: 5,
            mapUnit: "cm",
            interactScaleDesc: "1 cm = 10 km",
            interactScaleFactor: 10,
            interactRealDistance: 70,
            interactRealUnit: "km",
            interactMapDistance: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.realDistance}${v.realUnit} in real life — how far on the map?`,
            body: (v) => `${v.name} knows two towns are **${v.realDistance} ${v.realUnit}** apart. The map scale is **${v.scaleDesc}**.\n\nHow many centimetres apart will they be on the map? This time we go **backwards**!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Real distance: ${v.realDistance} ${v.realUnit}`, why: "We know this" },
                  { text: `Scale: ${v.scaleDesc}`, why: "How do we get back to cm?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide to go backwards!",
            body: (v) => `To go from **real life → map**, we **divide** by the scale factor.\n\n**${v.realDistance} ÷ ${v.scaleFactor} = ${v.mapDistance}${v.mapUnit}**\n\nMultiply for map→real. Divide for real→map. They're opposites!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Map → Real: MULTIPLY by ${v.scaleFactor}`, why: "Getting bigger" },
                  { text: `Real → Map: DIVIDE by ${v.scaleFactor}`, why: "Getting smaller" },
                  { text: `${v.realDistance} ÷ ${v.scaleFactor} = ${v.mapDistance}${v.mapUnit}`, result: `Map distance = ${v.mapDistance}${v.mapUnit}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Map to real life", right: "Multiply by the scale factor" },
                { left: "Real life to map", right: "Divide by the scale factor" },
                { left: "Scale factor", right: "How many times bigger real life is" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The real distance is **${v.interactRealDistance} ${v.interactRealUnit}** and the scale is **${v.interactScaleDesc}**.\n\nHow far is that on the map?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactRealDistance} ÷ ${v.interactScaleFactor} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactRealDistance} ÷ ${v.interactScaleFactor} = ?`,
              getOptions: (v) => generateDistractors(v.interactMapDistance),
              correctAnswer: (v) => v.interactMapDistance,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactRealDistance} ÷ ${v.interactScaleFactor} = **${v.interactMapDistance}${v.mapUnit}**. Divide to go from real life to the map! ✓`,
                incorrect: (v) => `Not quite! To go from real to map, divide: ${v.interactRealDistance} ÷ ${v.interactScaleFactor} = **${v.interactMapDistance}${v.mapUnit}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Scales work both ways!",
            body: () => `Remember: scales work in **two directions**.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Map → Real life: MULTIPLY by the scale factor", why: "Maps are smaller, so reality is bigger" },
                  { text: "Real life → Map: DIVIDE by the scale factor", why: "Shrink it back down" },
                  { text: "The scale factor is the key to both directions", why: "Multiply or divide — that's all there is to it! ✓" }
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
  // SUB-CONCEPT 7: ratio-word-problems
  // Multi-step ratio problems
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "ratio-word-problems",
    name: "Ratio Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "ratio-word-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to pick out the ratio and the total from a word problem",
          "How to decide which method to use"
        ],
        variableSets: [
          {
            name: "A sweet factory",
            scenario: "packs toffees and mints into mixed bags",
            itemA: "toffees", itemB: "mints",
            ratioA: 3, ratioB: 2,
            totalParts: 5,
            total: 40,
            onePart: 8,
            shareA: 24, shareB: 16,
            unit: "sweets",
            colourA: "#fbbf24", colourB: "#34d399",
            // Interact uses different values to avoid teach/interact overlap
            interactItemA: "chocolates", interactItemB: "lollipops",
            interactRatioA: 4, interactRatioB: 1,
            interactTotalParts: 5,
            interactTotal: 35,
            interactOnePart: 7,
            interactShareA: 28, interactShareB: 7,
            interactUnit: "sweets"
          },
          {
            name: "A school",
            scenario: "divides Year 6 into two teams for Sports Day",
            itemA: "Team Red", itemB: "Team Blue",
            ratioA: 5, ratioB: 3,
            totalParts: 8,
            total: 72,
            onePart: 9,
            shareA: 45, shareB: 27,
            unit: "children",
            colourA: "#f87171", colourB: "#818cf8",
            interactItemA: "Team Yellow", interactItemB: "Team Green",
            interactRatioA: 3, interactRatioB: 7,
            interactTotalParts: 10,
            interactTotal: 60,
            interactOnePart: 6,
            interactShareA: 18, interactShareB: 42,
            interactUnit: "children"
          },
          {
            name: "A farmer",
            scenario: "plants wheat and barley in his fields",
            itemA: "wheat", itemB: "barley",
            ratioA: 7, ratioB: 3,
            totalParts: 10,
            total: 50,
            onePart: 5,
            shareA: 35, shareB: 15,
            unit: "acres",
            colourA: "#fbbf24", colourB: "#34d399",
            interactItemA: "potatoes", interactItemB: "carrots",
            interactRatioA: 2, interactRatioB: 3,
            interactTotalParts: 5,
            interactTotal: 45,
            interactOnePart: 9,
            interactShareA: 18, interactShareB: 27,
            interactUnit: "acres"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you solve this problem?`,
            body: (v) => `${v.name} ${v.scenario}. The ratio of ${v.itemA} to ${v.itemB} is **${v.ratioA}:${v.ratioB}**. There are **${v.total} ${v.unit}** in total.\n\nHow many of each? Let's break it down!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.ratioA, label: `${v.itemA}: ? `, color: v.colourA },
                  { value: v.ratioB, label: `${v.itemB}: ?`, color: v.colourB }
                ],
                totalLabel: `Total: ${v.total} ${v.unit}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break it down step by step",
            body: (v) => `When you see a ratio word problem, follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Identify the ratio: ${v.ratioA}:${v.ratioB}`, why: "Read the question carefully" },
                  { text: `Total parts: ${v.ratioA} + ${v.ratioB} = ${v.totalParts}`, why: "Add the ratio numbers" },
                  { text: `One part: ${v.total} ÷ ${v.totalParts} = ${v.onePart}`, why: "Divide total by parts" },
                  { text: `${v.itemA}: ${v.ratioA} × ${v.onePart} = ${v.shareA}`, result: `${v.shareA} ${v.unit}` },
                  { text: `${v.itemB}: ${v.ratioB} × ${v.onePart} = ${v.shareB}`, result: `${v.shareB} ${v.unit}` },
                  { text: `Check: ${v.shareA} + ${v.shareB} = ${v.total}`, result: "Correct! ✓" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `How many ${v.interactItemA}?`,
            body: (v) => `${v.interactTotal} ${v.interactUnit} are shared in the ratio **${v.interactRatioA}:${v.interactRatioB}**.\nOne part = **${v.interactOnePart}**.\n\nHow many **${v.interactItemA}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactRatioA, label: `${v.interactItemA}: ?`, color: v.colourA },
                  { value: v.interactRatioB, label: `${v.interactItemB}`, color: v.colourB }
                ],
                totalLabel: `Total: ${v.interactTotal}. One part = ${v.interactOnePart}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactRatioA} × ${v.interactOnePart} = ?`,
              getOptions: (v) => generateDistractors(v.interactShareA),
              correctAnswer: (v) => v.interactShareA,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactRatioA} × ${v.interactOnePart} = **${v.interactShareA} ${v.interactUnit}**. And ${v.interactItemB} gets ${v.interactShareB}. Total: ${v.interactShareA} + ${v.interactShareB} = ${v.interactTotal} ✓`,
                incorrect: (v) => `Not quite! One part = ${v.interactOnePart}. ${v.interactItemA} = ${v.interactRatioA} parts: ${v.interactRatioA} × ${v.interactOnePart} = **${v.interactShareA}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tackling ratio word problems!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Ratio word problems always follow the same pattern. Spot the ratio, find the total, and use the 3-step method!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 3, label: 'A: 24', color: '#fbbf24' },
                    { value: 2, label: 'B: 16', color: '#34d399' }
                  ],
                  totalLabel: 'Ratio 3:2, total 40. One part = 8. A = 3×8 = 24, B = 2×8 = 16',
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Spot the ratio and the total", why: "Read the problem carefully — underline them!" },
                    { text: "Step 2: Add ratio parts, divide total by parts", why: "Find what one part is worth" },
                    { text: "Step 3: Multiply each side and CHECK", why: "Make sure your answers add up to the total ✓" }
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
        id: "ratio-word-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why dividing by each ratio number separately is wrong",
          "How to check your ratio answers add up"
        ],
        variableSets: [
          {
            name: "Sam",
            itemA: "fiction", itemB: "non-fiction",
            ratioA: 2, ratioB: 3,
            totalParts: 5,
            total: 60,
            onePart: 12,
            shareA: 24, shareB: 36,
            wrongShareA: 30, wrongShareB: 20,
            unit: "books",
            mistake: "divided 60 by 2 to get 30, and divided 60 by 3 to get 20 — he divided the total by each ratio number separately instead of finding one part first",
            // Interact uses different values to avoid teach/interact overlap
            interactItemA: "hardbacks", interactItemB: "paperbacks",
            interactRatioA: 1, interactRatioB: 4,
            interactTotalParts: 5,
            interactTotal: 45,
            interactOnePart: 9,
            interactShareA: 9, interactShareB: 36,
            interactUnit: "books"
          },
          {
            name: "Ella",
            itemA: "cats", itemB: "dogs",
            ratioA: 4, ratioB: 1,
            totalParts: 5,
            total: 30,
            onePart: 6,
            shareA: 24, shareB: 6,
            wrongShareA: 7, wrongShareB: 30,
            unit: "pets",
            mistake: "divided 30 by 4 to get 7.5 (rounded to 7), and said dogs = 30 — she forgot to add the ratio numbers first",
            interactItemA: "rabbits", interactItemB: "hamsters",
            interactRatioA: 3, interactRatioB: 2,
            interactTotalParts: 5,
            interactTotal: 40,
            interactOnePart: 8,
            interactShareA: 24, interactShareB: 16,
            interactUnit: "pets"
          },
          {
            name: "Kai",
            itemA: "red sweets", itemB: "green sweets",
            ratioA: 3, ratioB: 7,
            totalParts: 10,
            total: 50,
            onePart: 5,
            shareA: 15, shareB: 35,
            wrongShareA: 16, wrongShareB: 7,
            unit: "sweets",
            mistake: "divided 50 by 3 to get about 16, and divided 50 by 7 to get about 7 — he should have added 3+7=10 first, then divided 50 by 10",
            interactItemA: "orange sweets", interactItemB: "yellow sweets",
            interactRatioA: 2, interactRatioB: 3,
            interactTotalParts: 5,
            interactTotal: 30,
            interactOnePart: 6,
            interactShareA: 12, interactShareB: 18,
            interactUnit: "sweets"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}'s answer doesn't add up!`,
            body: (v) => `${v.total} ${v.unit} are shared in the ratio **${v.ratioA}:${v.ratioB}**.\n\n${v.name} says: ${v.itemA} = **${v.wrongShareA}**, ${v.itemB} = **${v.wrongShareB}**.\n\nDoes ${v.wrongShareA} + ${v.wrongShareB} = ${v.total}? Hmm...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.itemA} = ${v.wrongShareA}, ${v.itemB} = ${v.wrongShareB}` },
                  { text: `Check: ${v.wrongShareA} + ${v.wrongShareB} = ${v.wrongShareA + v.wrongShareB}`, why: `That's not ${v.total}! Something went wrong.` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe correct method:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Total parts: ${v.ratioA} + ${v.ratioB} = ${v.totalParts}`, why: "Add the ratio numbers FIRST" },
                  { text: `One part: ${v.total} ÷ ${v.totalParts} = ${v.onePart}`, why: "Divide total by TOTAL parts" },
                  { text: `${v.itemA}: ${v.ratioA} × ${v.onePart} = ${v.shareA}`, result: `Correct!` },
                  { text: `${v.itemB}: ${v.ratioB} × ${v.onePart} = ${v.shareB}`, result: `Correct!` },
                  { text: `Check: ${v.shareA} + ${v.shareB} = ${v.total}`, result: "It adds up! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `How many ${v.interactItemA}?`,
            body: (v) => `${v.interactTotal} ${v.interactUnit} are shared in the ratio **${v.interactRatioA}:${v.interactRatioB}**.\nOne part = **${v.interactOnePart}**.\n\nHow many ${v.interactItemA}?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactRatioA, label: `${v.interactItemA}: ?`, color: "#c084fc" },
                  { value: v.interactRatioB, label: `${v.interactItemB}`, color: "#818cf8" }
                ],
                totalLabel: `Total: ${v.interactTotal}. One part = ${v.interactOnePart}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactRatioA} × ${v.interactOnePart} = ?`,
              getOptions: (v) => generateDistractors(v.interactShareA),
              correctAnswer: (v) => v.interactShareA,
              feedback: {
                correct: (v) => `Spot on! ${v.interactRatioA} × ${v.interactOnePart} = **${v.interactShareA}**. Always add the ratio numbers first to find total parts! ✓`,
                incorrect: (v) => `Not quite! One part = ${v.interactOnePart}. So ${v.interactItemA} = ${v.interactRatioA} × ${v.interactOnePart} = **${v.interactShareA}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoid the biggest ratio trap!",
            body: () => `Never divide the total by each ratio number separately. Always find **total parts** first, then find **one part**, then multiply.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "WRONG: Divide total by each ratio number", why: "60 ÷ 2 and 60 ÷ 3 gives the WRONG answer" },
                  { text: "RIGHT: Add ratio numbers first → total parts", why: "2 + 3 = 5 parts" },
                  { text: "Then divide: total ÷ total parts = one part", why: "60 ÷ 5 = 12 per part" },
                  { text: "Then multiply each side", why: "2 × 12 = 24 and 3 × 12 = 36. Check: 24 + 36 = 60 ✓" }
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

// Supplementary sub-concepts for Fractions (13 of 14 — skip equivalent-fractions master)
// To merge: add these to lessonBank.fractions.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const fractionsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 2: Simplifying Fractions
  // ==========================================
  {
    id: "simplifying-fractions",
    name: "Simplifying Fractions",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "simplifying-fractions-steps",
        templateType: "step-by-step",
        learningGoal: ["How to simplify a fraction by dividing top and bottom by the same number", "How to find the highest common factor (the biggest number that divides into both) to get the simplest form"],
        variableSets: [
          {
            name: "Ella",
            pronoun: "She",
            scenario: "sharing sweets at a party",
            numerator: 6, denominator: 8,
            hcf: 2, simplifiedNum: 3, simplifiedDen: 4,
            unit: "sweets",
            testNum: 9, testDen: 12, testHcf: 3, testSimNum: 3, testSimDen: 4,
            intNum: 8, intDen: 12, intHcf: 4, intSimNum: 2, intSimDen: 3
          },
          {
            name: "Charlie",
            pronoun: "He",
            scenario: "sorting marbles into bags",
            numerator: 10, denominator: 15,
            hcf: 5, simplifiedNum: 2, simplifiedDen: 3,
            unit: "marbles",
            testNum: 8, testDen: 12, testHcf: 4, testSimNum: 2, testSimDen: 3,
            intNum: 4, intDen: 10, intHcf: 2, intSimNum: 2, intSimDen: 5
          },
          {
            name: "Priya",
            pronoun: "She",
            scenario: "cutting ribbon for craft projects",
            numerator: 12, denominator: 18,
            hcf: 6, simplifiedNum: 2, simplifiedDen: 3,
            unit: "metres",
            testNum: 15, testDen: 20, testHcf: 5, testSimNum: 3, testSimDen: 4,
            intNum: 9, intDen: 12, intHcf: 3, intSimNum: 3, intSimDen: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you simplify ${v.numerator}/${v.denominator}?`,
            body: (v) => `${v.name} is ${v.scenario}. ${v.pronoun} used **${v.numerator}/${v.denominator}** of the ${v.unit}. But there's a **simpler** way to write that fraction!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? "✓" : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator} out of ${v.denominator} used`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide top and bottom by the same number",
            body: (v) => `Let's simplify **${v.numerator}/${v.denominator}**.\nFind the **biggest number** that divides evenly into both ${v.numerator} and ${v.denominator} — that's the **highest common factor**.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.numerator ? "✓" : "",
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `${v.numerator}/${v.denominator} — simplify this!`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the biggest number that divides into both ${v.numerator} and ${v.denominator}`, why: "This is the highest common factor", result: `= ${v.hcf}` },
                    { text: `Divide the top: ${v.numerator} ÷ ${v.hcf} = ${v.simplifiedNum}`, why: `Divide the top number by ${v.hcf}` },
                    { text: `Divide the bottom: ${v.denominator} ÷ ${v.hcf} = ${v.simplifiedDen}`, why: `Divide the bottom number by ${v.hcf} too` },
                    { text: `${v.numerator}/${v.denominator} = ${v.simplifiedNum}/${v.simplifiedDen}`, result: `Simplest form: ${v.simplifiedNum}/${v.simplifiedDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Simplify ${v.intNum}/${v.intDen}`,
            body: (v) => `The **highest common factor** of ${v.intNum} and ${v.intDen} is **${v.intHcf}**.\nDivide both top and bottom by ${v.intHcf}. What do you get?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDen }, (_, i) => ({
                  value: 1,
                  label: i < v.intNum ? "✓" : "",
                  color: i < v.intNum ? "#c084fc" : undefined,
                  empty: i >= v.intNum
                })),
                totalLabel: `${v.intNum}/${v.intDen} — simplify this!`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intNum}/${v.intDen} in its simplest form?`,
              getOptions: (v) => {
                const correct = `${v.intSimNum}/${v.intSimDen}`;
                const wrong1 = `${v.intNum - 1}/${v.intDen - 1}`;
                const wrong2 = `${v.intSimNum + 1}/${v.intSimDen}`;
                const wrong3 = `${v.intNum}/${v.intDen + 2}`;
                const wrong4 = `${v.intSimNum}/${v.intSimDen + 1}`;
                const opts = [correct, wrong1, wrong2, wrong3, wrong4];
                return opts.sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intSimNum}/${v.intSimDen}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.intNum}/${v.intDen} = **${v.intSimNum}/${v.intSimDen}**. You divided both by ${v.intHcf}!`,
                incorrect: (v) => `Not quite! Divide both ${v.intNum} and ${v.intDen} by ${v.intHcf} to get **${v.intSimNum}/${v.intSimDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to simplify any fraction",
            body: () => `The **highest common factor** is the biggest number that divides evenly into both the top and bottom.\nDivide them both by it — that gives you the **simplest form**.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 8 }, (_, i) => ({
                    value: 1,
                    label: i < 6 ? "✓" : "",
                    color: i < 6 ? "#c084fc" : undefined,
                    empty: i >= 6
                  })),
                  totalLabel: "6/8 = 3/4 — same amount, simpler numbers!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the biggest number that divides into both the top and bottom", why: "This is the highest common factor" },
                    { text: "Divide the top number by it", why: "Makes the top number smaller" },
                    { text: "Divide the bottom number by it too", why: "Makes the bottom number smaller" },
                    { text: "Write your simplified fraction", why: "Same value, simpler numbers!" }
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
        id: "simplifying-fractions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid stopping too early when simplifying a fraction", "When to watch out for not using the highest common factor (the biggest number that divides into both)"],
        variableSets: [
          {
            name: "Tom",
            numerator: 12, denominator: 18,
            wrongSimNum: 6, wrongSimDen: 9,
            correctSimNum: 2, correctSimDen: 3,
            hcf: 6, usedFactor: 2,
            mistake: "only divided by 2 instead of the highest common factor (6)",
            intNum: 4, intDen: 6, intHcf: 2, intSimNum: 2, intSimDen: 3
          },
          {
            name: "Holly",
            numerator: 8, denominator: 12,
            wrongSimNum: 4, wrongSimDen: 6,
            correctSimNum: 2, correctSimDen: 3,
            hcf: 4, usedFactor: 2,
            mistake: "only divided by 2 instead of the highest common factor (4)",
            intNum: 6, intDen: 8, intHcf: 2, intSimNum: 3, intSimDen: 4
          },
          {
            name: "Isaac",
            numerator: 15, denominator: 20,
            wrongSimNum: 14, wrongSimDen: 19,
            correctSimNum: 3, correctSimDen: 4,
            hcf: 5, usedFactor: 1,
            mistake: "subtracted 1 from each instead of dividing",
            intNum: 10, intDen: 15, intHcf: 5, intSimNum: 2, intSimDen: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} tried to simplify **${v.numerator}/${v.denominator}** and got **${v.wrongSimNum}/${v.wrongSimDen}**. But that's not the simplest form! Can you see what went wrong?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? "✓" : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator}/${v.denominator} — is ${v.wrongSimNum}/${v.wrongSimDen} the simplest form?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Not fully simplified!",
            body: (v) => `${v.name} ${v.mistake}. You can still divide **${v.wrongSimNum}** and **${v.wrongSimDen}** further! The biggest number that divides into both ${v.numerator} and ${v.denominator} is actually **${v.hcf}**.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.numerator ? "✓" : "",
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `${v.numerator}/${v.denominator} — not ${v.wrongSimNum}/${v.wrongSimDen}!`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.numerator}/${v.denominator} = ${v.wrongSimNum}/${v.wrongSimDen}`, why: `${v.name} ${v.mistake}` },
                    { text: `The biggest number that divides both is ${v.hcf}`, why: "Use the biggest one, not just any factor" },
                    { text: `✓ ${v.numerator} ÷ ${v.hcf} = ${v.correctSimNum}, ${v.denominator} ÷ ${v.hcf} = ${v.correctSimDen}`, result: `Simplest form: ${v.correctSimNum}/${v.correctSimDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the simplest form?",
            body: (v) => `What is **${v.intNum}/${v.intDen}** fully simplified?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDen }, (_, i) => ({
                  value: 1,
                  label: i < v.intNum ? "✓" : "",
                  color: i < v.intNum ? "#c084fc" : undefined,
                  empty: i >= v.intNum
                })),
                totalLabel: `${v.intNum}/${v.intDen} — simplify fully!`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intNum}/${v.intDen} in its simplest form?`,
              getOptions: (v) => {
                const correct = `${v.intSimNum}/${v.intSimDen}`;
                const wrong1 = `${v.intNum}/${v.intDen}`;
                const wrong2 = `${v.intSimNum + 1}/${v.intSimDen + 1}`;
                const wrong3 = `${v.intSimNum}/${v.intSimDen + 2}`;
                const wrong4 = `${v.intSimDen}/${v.intSimNum}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intSimNum}/${v.intSimDen}`,
              feedback: {
                correct: (v) => `Spot on! ${v.intNum}/${v.intDen} = **${v.intSimNum}/${v.intSimDen}**. You divided both by ${v.intHcf}!`,
                incorrect: (v) => `Not quite! The biggest number that divides both is ${v.intHcf}. So ${v.intNum} ÷ ${v.intHcf} = ${v.intSimNum} and ${v.intDen} ÷ ${v.intHcf} = ${v.intSimDen}. Answer: **${v.intSimNum}/${v.intSimDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Always simplify fully!",
            body: () => `The most common mistake is **stopping too soon**. Check: can you divide top and bottom by the same number again? If yes, keep going!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 1,
                    label: i < 2 ? "✓" : "",
                    color: i < 2 ? "#c084fc" : undefined,
                    empty: i >= 2
                  })),
                  totalLabel: "12/18 → 6/9 → 2/3 — keep going until fully simplified!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the biggest number that divides into both top and bottom", why: "Don't just pick any factor — find the biggest!" },
                    { text: "Divide top and bottom by that number", why: "One step to the simplest form" },
                    { text: "Check: can you divide again?", why: "If yes, you haven't found the biggest factor yet" },
                    { text: "If nothing divides both, you're done!", why: "That's the simplest form ✓" }
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
  // SUB-CONCEPT 3: Comparing Fractions
  // ==========================================
  {
    id: "comparing-fractions",
    name: "Comparing Fractions",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "comparing-fractions-steps",
        templateType: "step-by-step",
        learningGoal: ["How to compare fractions by converting to the same bottom number (denominator)", "Why you can only compare fractions when the pieces are the same size"],
        variableSets: [
          {
            name: "Ben",
            scenario: "ate pizza at a party",
            fracA: "2/3", fracANum: 2, fracADen: 3,
            fracB: "3/5", fracBNum: 3, fracBDen: 5,
            lcd: 15,
            newANum: 10, newBNum: 9,
            bigger: "2/3", biggerLabel: "A",
            unit: "pizza",
            intFracA: "3/4", intFracANum: 3, intFracADen: 4,
            intFracB: "2/3", intFracBNum: 2, intFracBDen: 3,
            intLcd: 12, intNewANum: 9, intNewBNum: 8, intBigger: "3/4"
          },
          {
            name: "Aisha",
            scenario: "walked part of the route to school",
            fracA: "3/4", fracANum: 3, fracADen: 4,
            fracB: "5/6", fracBNum: 5, fracBDen: 6,
            lcd: 12,
            newANum: 9, newBNum: 10,
            bigger: "5/6", biggerLabel: "B",
            unit: "route",
            intFracA: "2/5", intFracANum: 2, intFracADen: 5,
            intFracB: "3/8", intFracBNum: 3, intFracBDen: 8,
            intLcd: 40, intNewANum: 16, intNewBNum: 15, intBigger: "2/5"
          },
          {
            name: "Finn",
            scenario: "drank juice from two different bottles",
            fracA: "3/8", fracANum: 3, fracADen: 8,
            fracB: "1/4", fracBNum: 1, fracBDen: 4,
            lcd: 8,
            newANum: 3, newBNum: 2,
            bigger: "3/8", biggerLabel: "A",
            unit: "bottle",
            intFracA: "4/7", intFracANum: 4, intFracADen: 7,
            intFracB: "1/2", intFracBNum: 1, intFracBDen: 2,
            intLcd: 14, intNewANum: 8, intNewBNum: 7, intBigger: "4/7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which is bigger: ${v.fracA} or ${v.fracB}?`,
            body: (v) => `${v.name} ${v.scenario}. Is **${v.fracA}** more or less than **${v.fracB}**? When the bottom numbers are different, you can't just look at the numbers!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  label: i < v.fracANum ? "✓" : "",
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracA}`,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  label: i < v.fracBNum ? "✓" : "",
                  color: i < v.fracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: `${v.fracB}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Make the bottom numbers the same!",
            body: (v) => `Which is bigger: **${v.fracA}** or **${v.fracB}**? To compare, both fractions need the **same bottom number**. Find a number that both ${v.fracADen} and ${v.fracBDen} go into. Tap to see!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.fracADen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracANum ? "#c084fc" : undefined,
                    empty: i >= v.fracANum
                  })),
                  totalLabel: `${v.fracA}`,
                  comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracBNum ? "#38bdf8" : undefined,
                    empty: i >= v.fracBNum
                  })),
                  comparisonLabel: `${v.fracB}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the smallest number both ${v.fracADen} and ${v.fracBDen} go into`, why: "This is called the lowest common denominator (bottom number)", result: `= ${v.lcd}` },
                    { text: `Convert ${v.fracA}: multiply top and bottom by ${v.lcd / v.fracADen}`, why: `${v.fracANum} × ${v.lcd / v.fracADen} = ${v.newANum}`, result: `So ${v.fracA} = ${v.newANum}/${v.lcd}` },
                    { text: `Convert ${v.fracB}: multiply top and bottom by ${v.lcd / v.fracBDen}`, why: `${v.fracBNum} × ${v.lcd / v.fracBDen} = ${v.newBNum}`, result: `So ${v.fracB} = ${v.newBNum}/${v.lcd}` },
                    { text: `Now compare: ${v.newANum}/${v.lcd} vs ${v.newBNum}/${v.lcd}`, why: `${v.newANum} is ${v.newANum > v.newBNum ? 'bigger' : 'smaller'} than ${v.newBNum}`, result: `${v.bigger} is bigger! ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Which is larger?`,
            body: (v) => `Convert both fractions to the same bottom number. **${v.intFracA}** and **${v.intFracB}** — which is bigger?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  label: "",
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracA}`,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  label: "",
                  color: i < v.intFracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: `${v.intFracB}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is larger: ${v.intFracA} or ${v.intFracB}?`,
              getOptions: (v) => [v.intBigger, v.intBigger === v.intFracA ? v.intFracB : v.intFracA, "They are equal", `${v.intNewANum + v.intNewBNum}/${v.intLcd}`, "Cannot tell"].sort(() => Math.random() - 0.5),
              correctAnswer: (v) => v.intBigger,
              feedback: {
                correct: (v) => `Spot on! **${v.intBigger}** is bigger. Convert to ${v.intLcd}ths: ${v.intNewANum}/${v.intLcd} vs ${v.intNewBNum}/${v.intLcd} — the bigger top wins!`,
                incorrect: (v) => `Not quite! Convert to ${v.intLcd}ths: ${v.intNewANum}/${v.intLcd} vs ${v.intNewBNum}/${v.intLcd}. **${v.intBigger}** is larger.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "How to compare any two fractions",
            body: () => `You can **only** compare fractions when the pieces are the **same size** — that means the bottom numbers must match. Convert first, then compare!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 1,
                    color: i < 3 ? "#c084fc" : undefined,
                    empty: i >= 3
                  })),
                  totalLabel: "3/4",
                  comparison: Array.from({ length: 5 }, (_, i) => ({
                    value: 1,
                    color: i < 2 ? "#38bdf8" : undefined,
                    empty: i >= 2
                  })),
                  comparisonLabel: "2/5 — which is bigger?"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the smallest number both bottom numbers go into", why: "This gives you matching bottom numbers" },
                    { text: "Convert both fractions to that bottom number", why: "Multiply top and bottom by the same number" },
                    { text: "Compare the top numbers", why: "Bigger top number = bigger fraction" },
                    { text: "Write your answer using the original fractions", why: "The matching bottom number was just for comparing!" }
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
        id: "comparing-fractions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid comparing fractions without making the bottom numbers match first", "When to watch out for assuming bigger numbers mean bigger fractions"],
        variableSets: [
          {
            name: "Sophie",
            fracA: "1/4", fracANum: 1, fracADen: 4,
            fracB: "1/8", fracBNum: 1, fracBDen: 8,
            wrongAnswer: "1/8 is bigger because 8 > 4",
            correctAnswer: "1/4 is bigger",
            bigger: "1/4",
            mistake: "thought a bigger denominator means a bigger fraction",
            commonDen: 8, newANum: 2, newALabel: "2/8", newBNum: 1, newBLabel: "1/8",
            intFracA: "3/5", intFracANum: 3, intFracADen: 5,
            intFracB: "1/2", intFracBNum: 1, intFracBDen: 2,
            intBigger: "3/5"
          },
          {
            name: "Marcus",
            fracA: "2/5", fracANum: 2, fracADen: 5,
            fracB: "3/10", fracBNum: 3, fracBDen: 10,
            wrongAnswer: "3/10 is bigger because 3 > 2",
            correctAnswer: "2/5 is bigger",
            bigger: "2/5",
            mistake: "compared the numerators without making the denominators the same",
            commonDen: 10, newANum: 4, newALabel: "4/10", newBNum: 3, newBLabel: "3/10",
            intFracA: "5/8", intFracANum: 5, intFracADen: 8,
            intFracB: "3/4", intFracBNum: 3, intFracBDen: 4,
            intBigger: "3/4"
          },
          {
            name: "Lily",
            fracA: "3/8", fracANum: 3, fracADen: 8,
            fracB: "1/3", fracBNum: 1, fracBDen: 3,
            wrongAnswer: "3/8 is bigger because 3 > 1 and 8 > 3",
            correctAnswer: "3/8 is bigger",
            bigger: "3/8",
            mistake: "got the right answer but for the wrong reason — you must convert first",
            commonDen: 24, newANum: 9, newALabel: "9/24", newBNum: 8, newBLabel: "8/24",
            intFracA: "2/3", intFracANum: 2, intFracADen: 3,
            intFracB: "4/7", intFracBNum: 4, intFracBDen: 7,
            intBigger: "2/3"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} says: "${v.wrongAnswer}". Is that correct reasoning?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: v.fracA,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: v.fracB
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You must convert first!",
            body: (v) => `${v.name} ${v.mistake}.\nYou can only compare when the bottom numbers are the **same**!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.fracADen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracANum ? "#c084fc" : undefined,
                    empty: i >= v.fracANum
                  })),
                  totalLabel: v.fracA,
                  comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracBNum ? "#38bdf8" : undefined,
                    empty: i >= v.fracBNum
                  })),
                  comparisonLabel: `${v.fracB} — the bars show the truth!`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: "${v.wrongAnswer}"`, why: `${v.mistake}` },
                    { text: `Make the bottom numbers the same: use ${v.commonDen}`, why: "Same-sized pieces, then compare" },
                    { text: `${v.fracA} = ${v.newALabel}`, why: `${v.fracANum} × ${v.commonDen / v.fracADen} = ${v.newANum}` },
                    { text: `${v.fracB} = ${v.newBLabel}`, why: `${v.fracBNum} × ${v.commonDen / v.fracBDen} = ${v.newBNum}` },
                    { text: `${v.newANum} vs ${v.newBNum} — ${v.correctAnswer}`, result: `${v.bigger} is bigger ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Which is bigger: ${v.intFracA} or ${v.intFracB}?`,
            body: (v) => `Think carefully — which fraction represents more?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: v.intFracA,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: v.intFracB
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is bigger?`,
              getOptions: (v) => [v.intBigger, v.intBigger === v.intFracA ? v.intFracB : v.intFracA, "They are equal", "Cannot tell", `${v.intFracANum + v.intFracBNum}/${v.intFracADen + v.intFracBDen}`].sort(() => Math.random() - 0.5),
              correctAnswer: (v) => v.intBigger,
              feedback: {
                correct: (v) => `Well done! **${v.intBigger}** is bigger. Convert to the same bottom number to prove it!`,
                incorrect: (v) => `Not this time! Convert to the same bottom number and compare. **${v.intBigger}** is the bigger fraction.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Common comparing traps!",
            body: () => `Don't fall for these tricks! Always convert to the **same bottom number** before comparing.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 1,
                    color: i < 1 ? "#c084fc" : undefined,
                    empty: i >= 1
                  })),
                  totalLabel: "1/4 — bigger pieces!",
                  comparison: Array.from({ length: 8 }, (_, i) => ({
                    value: 1,
                    color: i < 1 ? "#38bdf8" : undefined,
                    empty: i >= 1
                  })),
                  comparisonLabel: "1/8 — smaller pieces!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Bigger bottom number does NOT mean bigger fraction", why: "1/8 is smaller than 1/4 — the pieces are tinier!" },
                    { text: "You can't compare tops if the bottom numbers are different", why: "2/5 vs 3/10 — you must convert first" },
                    { text: "Convert to the same bottom number, then compare tops", why: "This works every single time ✓" }
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
  // SUB-CONCEPT 4: Adding Fractions (Same Denominator)
  // ==========================================
  {
    id: "adding-same-denom",
    name: "Adding Fractions (Same Denominator)",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "adding-same-denom-steps",
        templateType: "step-by-step",
        learningGoal: ["How to add fractions when the bottom numbers (denominators) are the same", "Why we add the top numbers but keep the bottom number the same"],
        variableSets: [
          {
            name: "Daisy",
            scenario: "eating slices of cake",
            fracANum: 2, fracBNum: 3, denominator: 8,
            answerNum: 5, unit: "cake",
            intFracANum: 2, intFracBNum: 3, intDenom: 9, intAnswerNum: 5
          },
          {
            name: "Jake",
            scenario: "pouring orange juice into a glass",
            fracANum: 1, fracBNum: 3, denominator: 6,
            answerNum: 4, unit: "litre",
            intFracANum: 3, intFracBNum: 4, intDenom: 11, intAnswerNum: 7
          },
          {
            name: "Grace",
            scenario: "walking part of the way to the shops",
            fracANum: 3, fracBNum: 2, denominator: 10,
            answerNum: 5, unit: "journey",
            intFracANum: 1, intFracBNum: 5, intDenom: 8, intAnswerNum: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. First **${v.fracANum}/${v.denominator}**, then another **${v.fracBNum}/${v.denominator}**. How much altogether?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.fracANum ? "A" : (i < v.fracANum + v.fracBNum ? "B" : ""),
                  color: i < v.fracANum ? "#c084fc" : (i < v.fracANum + v.fracBNum ? "#38bdf8" : undefined),
                  empty: i >= v.fracANum + v.fracBNum
                })),
                totalLabel: `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Add the tops, keep the bottom!",
            body: (v) => `When the bottom numbers are the **same**, the pieces are already the same size. Just **add the top numbers** and keep the bottom number!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.fracANum ? "A" : (i < v.fracANum + v.fracBNum ? "B" : ""),
                    color: i < v.fracANum ? "#c084fc" : (i < v.fracANum + v.fracBNum ? "#38bdf8" : undefined),
                    empty: i >= v.fracANum + v.fracBNum
                  })),
                  totalLabel: `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ${v.answerNum}/${v.denominator}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator}`, why: "Same bottom number — great!" },
                    { text: `Add the top numbers: ${v.fracANum} + ${v.fracBNum} = ${v.answerNum}`, why: "Only the top numbers change" },
                    { text: `Keep the bottom number: ${v.denominator}`, why: "The piece size stays the same" },
                    { text: `Answer: ${v.answerNum}/${v.denominator}`, result: `${v.answerNum}/${v.denominator} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracANum}/${v.intDenom} + ${v.intFracBNum}/${v.intDenom}?`,
            body: (v) => `Add the top numbers, keep the bottom number!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDenom }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : (i < v.intFracANum + v.intFracBNum ? "#38bdf8" : undefined),
                  empty: i >= v.intFracANum + v.intFracBNum
                })),
                totalLabel: `${v.intFracANum}/${v.intDenom} + ${v.intFracBNum}/${v.intDenom}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intDenom} + ${v.intFracBNum}/${v.intDenom} = ?`,
              getOptions: (v) => {
                const correct = `${v.intAnswerNum}/${v.intDenom}`;
                const wrong1 = `${v.intAnswerNum}/${v.intDenom * 2}`;
                const wrong2 = `${v.intFracANum * v.intFracBNum}/${v.intDenom}`;
                const wrong3 = `${v.intAnswerNum + 1}/${v.intDenom}`;
                const wrong4 = `${Math.max(1, v.intAnswerNum - 1)}/${v.intDenom}`;
                return [...new Set([correct, wrong1, wrong2, wrong3, wrong4])].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intAnswerNum}/${v.intDenom}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.intFracANum} + ${v.intFracBNum} = ${v.intAnswerNum}, and the bottom number stays as ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}** ✓`,
                incorrect: (v) => `Nearly! Add the tops: ${v.intFracANum} + ${v.intFracBNum} = ${v.intAnswerNum}. Keep the bottom: ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adding fractions with the same bottom number",
            body: () => `This is the easiest type of fraction addition. Same bottom number = same-sized pieces, so just count how many pieces you have!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 6 }, (_, i) => ({
                    value: 1,
                    label: i < 2 ? "A" : (i < 5 ? "B" : ""),
                    color: i < 2 ? "#c084fc" : (i < 5 ? "#38bdf8" : undefined),
                    empty: i >= 5
                  })),
                  totalLabel: "2/6 + 3/6 = 5/6"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Check: are the bottom numbers the same?", why: "If yes, you're in luck!" },
                    { text: "Add the top numbers", why: "Count up the pieces" },
                    { text: "Keep the bottom number the same", why: "The piece size doesn't change" },
                    { text: "Simplify if you can", why: "Check if top and bottom share a factor" }
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
        id: "adding-same-denom-curiosity",
        templateType: "curiosity-hook",
        learningGoal: ["How to apply same-bottom-number addition to real-life sharing problems", "When to watch out for accidentally adding the bottom numbers too"],
        variableSets: [
          {
            name: "Oscar",
            scenario: "Oscar eats 1/5 of a chocolate bar before lunch and 2/5 after lunch",
            fracANum: 1, fracBNum: 2, denominator: 5, answerNum: 3,
            wrongAnswer: "3/10", wrongReason: "added both tops AND bottoms",
            unit: "chocolate bar",
            intFracANum: 2, intFracBNum: 4, intDenom: 9, intAnswerNum: 6
          },
          {
            name: "Nadia",
            scenario: "Nadia walks 2/7 of the route, then runs another 3/7",
            fracANum: 2, fracBNum: 3, denominator: 7, answerNum: 5,
            wrongAnswer: "5/14", wrongReason: "added both tops AND bottoms",
            unit: "route",
            intFracANum: 3, intFracBNum: 2, intDenom: 11, intAnswerNum: 5
          },
          {
            name: "Ravi",
            scenario: "Ravi drinks 3/8 of his water at break and 1/8 at lunch",
            fracANum: 3, fracBNum: 1, denominator: 8, answerNum: 4,
            wrongAnswer: "4/16", wrongReason: "added both tops AND bottoms",
            unit: "water",
            intFracANum: 1, intFracBNum: 5, intDenom: 10, intAnswerNum: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "A common trap!",
            body: (v) => `${v.scenario}. Someone says the answer is **${v.wrongAnswer}**. Does that make sense? Think about how much of the ${v.unit} that would be...`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : (i < v.fracANum + v.fracBNum ? "#38bdf8" : undefined),
                  empty: i >= v.fracANum + v.fracBNum
                })),
                totalLabel: `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ???`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Never add the bottom numbers!",
            body: (v) => `The wrong answer **${v.wrongAnswer}** came from adding tops AND bottoms. But the bottom number tells you the **size of the pieces** — it doesn't change when you add! Only the **top numbers** get added.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    color: i < v.fracANum ? "#c084fc" : (i < v.fracANum + v.fracBNum ? "#38bdf8" : undefined),
                    empty: i >= v.fracANum + v.fracBNum
                  })),
                  totalLabel: `${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ${v.answerNum}/${v.denominator}, NOT ${v.wrongAnswer}!`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ Wrong: ${v.fracANum}/${v.denominator} + ${v.fracBNum}/${v.denominator} = ${v.wrongAnswer}`, why: `${v.wrongReason} — this is WRONG` },
                    { text: `✓ Right: add tops only → ${v.fracANum} + ${v.fracBNum} = ${v.answerNum}`, why: "Only the top numbers change" },
                    { text: `Answer: ${v.answerNum}/${v.denominator}`, result: `${v.answerNum}/${v.denominator} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.intFracANum}/${v.intDenom} + ${v.intFracBNum}/${v.intDenom}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDenom }, (_, i) => ({
                  value: 1,
                  color: i < v.intAnswerNum ? "#c084fc" : undefined,
                  empty: i >= v.intAnswerNum
                })),
                totalLabel: `How many ${v.intDenom}ths?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intDenom} + ${v.intFracBNum}/${v.intDenom} = ?`,
              getOptions: (v) => {
                const correct = `${v.intAnswerNum}/${v.intDenom}`;
                const wrong1 = `${v.intAnswerNum}/${v.intDenom * 2}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intDenom}`;
                const wrong3 = `${v.intAnswerNum}/${v.intDenom - 1}`;
                const wrong4 = `${v.intFracANum}/${v.intDenom}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intAnswerNum}/${v.intDenom}`,
              feedback: {
                correct: (v) => `Yes! ${v.intFracANum} + ${v.intFracBNum} = ${v.intAnswerNum}, keep the bottom number ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}** ✓`,
                incorrect: (v) => `Remember: NEVER add the bottom numbers! ${v.intFracANum} + ${v.intFracBNum} = ${v.intAnswerNum}, bottom number stays at ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The golden rule of fraction addition!",
            body: () => `When adding fractions with the **same bottom number**: add the tops, keep the bottom. **Never** add the bottom numbers!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 5 }, (_, i) => ({
                    value: 1,
                    color: i < 1 ? "#c084fc" : (i < 3 ? "#38bdf8" : undefined),
                    empty: i >= 3
                  })),
                  totalLabel: "1/5 + 2/5 = 3/5 — add tops, keep the bottom!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Add the top numbers", why: "Count up the pieces" },
                    { text: "Keep the bottom number the same", why: "The piece size is already the same!" },
                    { text: "NEVER add the bottom numbers", why: "This is the most common fraction mistake" }
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
  // SUB-CONCEPT 5: Subtracting Fractions (Same Denominator)
  // ==========================================
  {
    id: "subtracting-same-denom",
    name: "Subtracting Fractions (Same Denominator)",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "subtracting-same-denom-steps",
        templateType: "step-by-step",
        learningGoal: ["How to subtract fractions when the bottom numbers (denominators) are the same", "Why we subtract the top numbers but keep the bottom number the same"],
        variableSets: [
          {
            name: "Holly",
            pronoun: "She",
            scenario: "had a chocolate bar and gave some away",
            fracANum: 5, fracBNum: 2, denominator: 8,
            answerNum: 3, unit: "chocolate bar",
            intFracANum: 7, intFracBNum: 2, intDenom: 9, intAnswerNum: 5
          },
          {
            name: "Tom",
            pronoun: "He",
            scenario: "filled a jug with water and poured some out",
            fracANum: 4, fracBNum: 1, denominator: 6,
            answerNum: 3, unit: "jug",
            intFracANum: 10, intFracBNum: 3, intDenom: 11, intAnswerNum: 7
          },
          {
            name: "Ella",
            pronoun: "She",
            scenario: "had ribbon and used some for wrapping",
            fracANum: 7, fracBNum: 3, denominator: 10,
            answerNum: 4, unit: "metre",
            intFracANum: 5, intFracBNum: 2, intDenom: 8, intAnswerNum: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator} = ?`,
            body: (v) => `${v.name} ${v.scenario}. ${v.pronoun} started with **${v.fracANum}/${v.denominator}** and used **${v.fracBNum}/${v.denominator}**. How much is left?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.answerNum ? "✓" : (i < v.fracANum ? "−" : ""),
                  color: i < v.answerNum ? "#c084fc" : (i < v.fracANum ? "#f87171" : undefined),
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator} = ?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subtract the tops, keep the bottom!",
            body: (v) => `Just like addition — but we **subtract** the top numbers instead. The bottom number stays the same because the piece size hasn't changed!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.answerNum ? "✓" : (i < v.fracANum ? "−" : ""),
                    color: i < v.answerNum ? "#c084fc" : (i < v.fracANum ? "#f87171" : undefined),
                    empty: i >= v.fracANum
                  })),
                  totalLabel: `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator} = ${v.answerNum}/${v.denominator}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator}`, why: "Same bottom number — great!" },
                    { text: `Subtract the top numbers: ${v.fracANum} − ${v.fracBNum} = ${v.answerNum}`, why: "Take away the pieces" },
                    { text: `Keep the bottom number: ${v.denominator}`, why: "The piece size stays the same" },
                    { text: `Answer: ${v.answerNum}/${v.denominator}`, result: `${v.answerNum}/${v.denominator} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => "What's left?",
            body: (v) => `What is **${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDenom }, (_, i) => ({
                  value: 1,
                  color: i < v.intAnswerNum ? "#c084fc" : (i < v.intFracANum ? "#f87171" : undefined),
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom} = ?`,
              getOptions: (v) => {
                const correct = `${v.intAnswerNum}/${v.intDenom}`;
                const wrong1 = `${v.intAnswerNum}/${v.intDenom * 2}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intDenom}`;
                const wrong3 = `${Math.max(1, v.intAnswerNum - 1)}/${v.intDenom}`;
                const wrong4 = `${v.intFracANum + v.intFracBNum}/${v.intDenom}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intAnswerNum}/${v.intDenom}`,
              feedback: {
                correct: (v) => `Perfect! ${v.intFracANum} − ${v.intFracBNum} = ${v.intAnswerNum}, bottom number stays as ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}** ✓`,
                incorrect: (v) => `Nearly! Subtract the tops: ${v.intFracANum} − ${v.intFracBNum} = ${v.intAnswerNum}. Keep the bottom: ${v.intDenom}. Answer: **${v.intAnswerNum}/${v.intDenom}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtracting fractions with the same bottom number",
            body: () => `Same rule as adding — just subtract instead. The bottom number **never changes** when you add or subtract fractions with the same bottom number.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 8 }, (_, i) => ({
                    value: 1,
                    label: i < 3 ? "✓" : (i < 5 ? "−" : ""),
                    color: i < 3 ? "#c084fc" : (i < 5 ? "#f87171" : undefined),
                    empty: i >= 5
                  })),
                  totalLabel: "5/8 − 2/8 = 3/8"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Check: are the bottom numbers the same?", why: "If yes, you're good to go!" },
                    { text: "Subtract the top numbers", why: "Take away the pieces" },
                    { text: "Keep the bottom number the same", why: "The piece size doesn't change" },
                    { text: "Simplify if you can", why: "Check if a number divides evenly into both top and bottom" }
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
        id: "subtracting-same-denom-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid subtracting the bottom numbers as well as the top numbers", "When to watch out for changing the bottom number during subtraction"],
        variableSets: [
          {
            name: "Finn",
            fracANum: 5, fracBNum: 2, denominator: 6,
            wrongAnswer: "3/0", correctAnswer: "3/6",
            answerNum: 3,
            mistake: "subtracted BOTH the tops and the bottoms",
            intFracANum: 7, intFracBNum: 4, intDenom: 9, intAnswerNum: 3, intCorrectAnswer: "3/9"
          },
          {
            name: "Aisha",
            fracANum: 7, fracBNum: 3, denominator: 8,
            wrongAnswer: "4/0", correctAnswer: "4/8",
            answerNum: 4,
            mistake: "subtracted the denominators too, getting zero on the bottom",
            intFracANum: 8, intFracBNum: 5, intDenom: 10, intAnswerNum: 3, intCorrectAnswer: "3/10"
          },
          {
            name: "Charlie",
            fracANum: 4, fracBNum: 1, denominator: 5,
            wrongAnswer: "3/4", correctAnswer: "3/5",
            answerNum: 3,
            mistake: "subtracted 1 from the denominator as well",
            intFracANum: 6, intFracBNum: 2, intDenom: 7, intAnswerNum: 4, intCorrectAnswer: "4/7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} tried to work out **${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator}** and got **${v.wrongAnswer}**. Something went wrong!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.answerNum ? "✓" : (i < v.fracANum ? "−" : ""),
                  color: i < v.answerNum ? "#c084fc" : (i < v.fracANum ? "#f87171" : undefined),
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator} = ${v.wrongAnswer}?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The bottom number stays the same!",
            body: (v) => `${v.name} ${v.mistake}. The bottom number tells you the **piece size** — it doesn't change when you subtract. Only subtract the **top numbers**!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.answerNum ? "✓" : (i < v.fracANum ? "−" : ""),
                    color: i < v.answerNum ? "#c084fc" : (i < v.fracANum ? "#f87171" : undefined),
                    empty: i >= v.fracANum
                  })),
                  totalLabel: `${v.fracANum}/${v.denominator} − ${v.fracBNum}/${v.denominator} = ${v.correctAnswer}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.wrongAnswer}`, why: `${v.mistake}` },
                    { text: `✓ Only subtract the tops: ${v.fracANum} − ${v.fracBNum} = ${v.answerNum}`, why: "The bottom number stays at " + v.denominator },
                    { text: `Answer: ${v.correctAnswer}`, result: `${v.correctAnswer} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom}?`,
            body: (v) => `Remember: only the top number changes!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDenom }, (_, i) => ({
                  value: 1,
                  color: i < v.intAnswerNum ? "#c084fc" : (i < v.intFracANum ? "#f87171" : undefined),
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intDenom} − ${v.intFracBNum}/${v.intDenom} = ?`,
              getOptions: (v) => {
                const correct = v.intCorrectAnswer;
                return [correct, `${v.intAnswerNum}/${v.intDenom * 2}`, `${v.intAnswerNum + 1}/${v.intDenom}`, `${v.intAnswerNum}/${v.intDenom + 1}`, `${Math.max(1, v.intAnswerNum - 1)}/${v.intDenom}`].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCorrectAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.intFracANum} − ${v.intFracBNum} = ${v.intAnswerNum}, bottom number stays at ${v.intDenom}. Answer: **${v.intCorrectAnswer}** ✓`,
                incorrect: (v) => `Not quite! Only subtract the tops: ${v.intFracANum} − ${v.intFracBNum} = ${v.intAnswerNum}. The bottom stays at ${v.intDenom}. Answer: **${v.intCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Never subtract the bottom numbers!",
            body: () => `The bottom number is the **size of each piece**. When you add or subtract fractions with the same bottom number, **only the top number changes**.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 6 }, (_, i) => ({
                    value: 1,
                    label: i < 2 ? "✓" : (i < 4 ? "−" : ""),
                    color: i < 2 ? "#c084fc" : (i < 4 ? "#f87171" : undefined),
                    empty: i >= 4
                  })),
                  totalLabel: "4/6 − 2/6 = 2/6 — bottom stays at 6!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Subtract the top numbers", why: "Take away the pieces" },
                    { text: "Keep the bottom number exactly the same", why: "The piece size never changes!" },
                    { text: "Simplify if you can", why: "Check if a number divides evenly into both top and bottom" }
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
  // SUB-CONCEPT 6: Adding Fractions (Different Denominators)
  // ==========================================
  {
    id: "adding-diff-denom",
    name: "Adding Fractions (Different Denominators)",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "adding-diff-denom-steps",
        templateType: "step-by-step",
        learningGoal: ["How to find a common bottom number (denominator) before adding", "How to convert both fractions so the bottom numbers match"],
        variableSets: [
          {
            name: "Sophie",
            pronoun: "She",
            scenario: "mixing paint for art class",
            fracANum: 1, fracADen: 3, fracBNum: 1, fracBDen: 4,
            lcd: 12, newANum: 4, newBNum: 3,
            answerNum: 7, answerDen: 12,
            canSimplify: false,
            unit: "tin",
            intFracANum: 2, intFracADen: 3, intFracBNum: 1, intFracBDen: 5,
            intLcd: 15, intNewANum: 10, intNewBNum: 3,
            intAnswerNum: 13, intAnswerDen: 15, intCanSimplify: false
          },
          {
            name: "Ben",
            pronoun: "He",
            scenario: "pouring juice from two bottles",
            fracANum: 2, fracADen: 5, fracBNum: 1, fracBDen: 3,
            lcd: 15, newANum: 6, newBNum: 5,
            answerNum: 11, answerDen: 15,
            canSimplify: false,
            unit: "litre",
            intFracANum: 1, intFracADen: 4, intFracBNum: 2, intFracBDen: 5,
            intLcd: 20, intNewANum: 5, intNewBNum: 8,
            intAnswerNum: 13, intAnswerDen: 20, intCanSimplify: false
          },
          {
            name: "Lily",
            pronoun: "She",
            scenario: "walking two sections of a trail",
            fracANum: 1, fracADen: 2, fracBNum: 1, fracBDen: 6,
            lcd: 6, newANum: 3, newBNum: 1,
            answerNum: 4, answerDen: 6,
            canSimplify: true, simNum: 2, simDen: 3,
            unit: "trail",
            intFracANum: 1, intFracADen: 4, intFracBNum: 1, intFracBDen: 8,
            intLcd: 8, intNewANum: 2, intNewBNum: 1,
            intAnswerNum: 3, intAnswerDen: 8, intCanSimplify: false
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.fracANum}/${v.fracADen} + ${v.fracBNum}/${v.fracBDen} = ?`,
            body: (v) => `${v.name} is ${v.scenario}. ${v.pronoun} uses **${v.fracANum}/${v.fracADen}** of a ${v.unit} and then **${v.fracBNum}/${v.fracBDen}** more. The bottom numbers are **different** — how do we add them?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracANum}/${v.fracADen}`,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: `${v.fracBNum}/${v.fracBDen} — different sized pieces!`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Make the bottom numbers match first!",
            body: (v) => `Let's work out **${v.fracANum}/${v.fracADen} + ${v.fracBNum}/${v.fracBDen}**. You can't add fractions when the **denominator** (bottom number) is different — the pieces are different sizes! Find a **common denominator** (the same bottom number for both fractions) and convert both fractions.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.fracADen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracANum ? "#c084fc" : undefined,
                    empty: i >= v.fracANum
                  })),
                  totalLabel: `${v.fracANum}/${v.fracADen}`,
                  comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracBNum ? "#38bdf8" : undefined,
                    empty: i >= v.fracBNum
                  })),
                  comparisonLabel: `${v.fracBNum}/${v.fracBDen} — different sized pieces!`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the smallest number both ${v.fracADen} and ${v.fracBDen} go into`, why: "This gives matching bottom numbers", result: `= ${v.lcd}` },
                    { text: `Convert ${v.fracANum}/${v.fracADen}: multiply top and bottom by ${v.lcd / v.fracADen}`, why: `${v.fracANum} x ${v.lcd / v.fracADen} = ${v.newANum}`, result: `= ${v.newANum}/${v.lcd}` },
                    { text: `Convert ${v.fracBNum}/${v.fracBDen}: multiply top and bottom by ${v.lcd / v.fracBDen}`, why: `${v.fracBNum} x ${v.lcd / v.fracBDen} = ${v.newBNum}`, result: `= ${v.newBNum}/${v.lcd}` },
                    { text: `Add the tops: ${v.newANum} + ${v.newBNum} = ${v.answerNum}`, why: "Keep the bottom number the same", result: `= ${v.answerNum}/${v.answerDen}` },
                    ...(v.canSimplify ? [{ text: `Simplify: ${v.answerNum} and ${v.answerDen} both divide by ${v.answerNum / v.simNum}`, why: `${v.answerNum} ÷ ${v.answerNum / v.simNum} = ${v.simNum}, ${v.answerDen} ÷ ${v.answerNum / v.simNum} = ${v.simDen}`, result: `= ${v.simNum}/${v.simDen} ✓` }] : [{ text: `Answer: ${v.answerNum}/${v.answerDen}`, why: "Can't simplify — no number divides evenly into both", result: `${v.answerNum}/${v.answerDen} ✓` }])
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracANum}/${v.intFracADen} + ${v.intFracBNum}/${v.intFracBDen}?`,
            body: (v) => `Find the LCD (Lowest Common Denominator) of ${v.intFracADen} and ${v.intFracBDen}, convert both fractions, then add the top numbers!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intFracADen}`,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: `+ ${v.intFracBNum}/${v.intFracBDen}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intFracADen} + ${v.intFracBNum}/${v.intFracBDen} = ?`,
              getOptions: (v) => {
                const correct = v.intCanSimplify ? `${v.intSimNum}/${v.intSimDen}` : `${v.intAnswerNum}/${v.intAnswerDen}`;
                const wrong1 = `${v.intFracANum + v.intFracBNum}/${v.intFracADen + v.intFracBDen}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${v.intAnswerNum}/${v.intAnswerDen + 1}`;
                const wrong4 = `${v.intNewANum}/${v.intLcd}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCanSimplify ? `${v.intSimNum}/${v.intSimDen}` : `${v.intAnswerNum}/${v.intAnswerDen}`,
              feedback: {
                correct: (v) => `Brilliant! Convert to ${v.intLcd}ths first, then add the tops. ${v.intCanSimplify ? `Simplify ${v.intAnswerNum}/${v.intAnswerDen} to get **${v.intSimNum}/${v.intSimDen}**` : `Answer: **${v.intAnswerNum}/${v.intAnswerDen}**`} ✓`,
                incorrect: (v) => `Nearly! Convert both to ${v.intLcd}ths: ${v.intNewANum}/${v.intLcd} + ${v.intNewBNum}/${v.intLcd} = ${v.intAnswerNum}/${v.intAnswerDen}${v.intCanSimplify ? ` = **${v.intSimNum}/${v.intSimDen}**` : ``}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adding fractions with different bottom numbers",
            body: () => `Different bottom numbers = different-sized pieces. You **must** convert to the same bottom number first, then add the top numbers.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 12 }, (_, i) => ({
                    value: 1,
                    color: i < 4 ? "#c084fc" : (i < 7 ? "#38bdf8" : undefined),
                    empty: i >= 7
                  })),
                  totalLabel: "1/3 + 1/4 = 4/12 + 3/12 = 7/12"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the smallest number both bottom numbers go into", why: "This is called the lowest common denominator (the same bottom number for both fractions)" },
                    { text: "Convert BOTH fractions to that bottom number", why: "Multiply top and bottom of each fraction" },
                    { text: "Add the top numbers", why: "Now the pieces are the same size!" },
                    { text: "Simplify if you can", why: "Check if a number divides evenly into both top and bottom ✓" }
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
        id: "adding-diff-denom-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid adding fractions with different bottom numbers without converting first", "When to watch out for only converting one fraction instead of both"],
        variableSets: [
          {
            name: "Jake",
            fracANum: 1, fracADen: 2, fracBNum: 1, fracBDen: 4,
            wrongAnswer: "2/6",
            correctAnswer: "3/4",
            lcd: 4, newANum: 2, newBNum: 1, answerNum: 3, answerDen: 4,
            mistake: "added both the numerators AND the denominators",
            intFracANum: 1, intFracADen: 3, intFracBNum: 1, intFracBDen: 4,
            intLcd: 12, intNewANum: 4, intNewBNum: 3, intAnswerNum: 7, intAnswerDen: 12,
            intCorrectAnswer: "7/12"
          },
          {
            name: "Daisy",
            fracANum: 1, fracADen: 3, fracBNum: 1, fracBDen: 5,
            wrongAnswer: "2/8",
            correctAnswer: "8/15",
            lcd: 15, newANum: 5, newBNum: 3, answerNum: 8, answerDen: 15,
            mistake: "added both the tops and the bottoms",
            intFracANum: 2, intFracADen: 5, intFracBNum: 1, intFracBDen: 4,
            intLcd: 20, intNewANum: 8, intNewBNum: 5, intAnswerNum: 13, intAnswerDen: 20,
            intCorrectAnswer: "13/20"
          },
          {
            name: "Marcus",
            fracANum: 2, fracADen: 3, fracBNum: 1, fracBDen: 6,
            wrongAnswer: "3/9",
            correctAnswer: "5/6",
            lcd: 6, newANum: 4, newBNum: 1, answerNum: 5, answerDen: 6,
            mistake: "added the numerators AND the denominators",
            intFracANum: 3, intFracADen: 4, intFracBNum: 1, intFracBDen: 8,
            intLcd: 8, intNewANum: 6, intNewBNum: 1, intAnswerNum: 7, intAnswerDen: 8,
            intCorrectAnswer: "7/8"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} says **${v.fracANum}/${v.fracADen} + ${v.fracBNum}/${v.fracBDen} = ${v.wrongAnswer}**. Something is very wrong here!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracANum}/${v.fracADen}`,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: `+ ${v.fracBNum}/${v.fracBDen} = ${v.wrongAnswer}?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You can't add the bottom numbers!",
            body: (v) => `${v.name} ${v.mistake}. This is the **number one fraction mistake**! You must find a common denominator (the same bottom number for both fractions) first. Remember: the denominator (the bottom number of a fraction) must match before you add!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.lcd }, (_, i) => ({
                    value: 1,
                    color: i < v.newANum ? "#c084fc" : (i < v.newANum + v.newBNum ? "#38bdf8" : undefined),
                    empty: i >= v.newANum + v.newBNum
                  })),
                  totalLabel: `${v.newANum}/${v.lcd} + ${v.newBNum}/${v.lcd} = ${v.correctAnswer}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.wrongAnswer}`, why: `${v.mistake} — WRONG!` },
                    { text: `✓ Step 1: smallest number both ${v.fracADen} and ${v.fracBDen} go into = ${v.lcd}`, why: "Find a matching bottom number" },
                    { text: `✓ Step 2: ${v.newANum}/${v.lcd} + ${v.newBNum}/${v.lcd}`, why: "Convert both fractions" },
                    { text: `✓ Answer: ${v.correctAnswer}`, result: `${v.correctAnswer} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracANum}/${v.intFracADen} + ${v.intFracBNum}/${v.intFracBDen}?`,
            body: (v) => `Find the LCD (Lowest Common Denominator), convert, then add!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intFracADen}`,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracBNum ? "#38bdf8" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: `+ ${v.intFracBNum}/${v.intFracBDen}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intFracADen} + ${v.intFracBNum}/${v.intFracBDen} = ?`,
              getOptions: (v) => {
                const correct = v.intCorrectAnswer;
                const wrong1 = `${v.intFracANum + v.intFracBNum}/${v.intFracADen + v.intFracBDen}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${v.intAnswerNum}/${v.intAnswerDen + 1}`;
                const wrong4 = `${v.intAnswerNum - 1}/${v.intAnswerDen}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! Convert to ${v.intLcd}ths: ${v.intNewANum}/${v.intLcd} + ${v.intNewBNum}/${v.intLcd} = **${v.intCorrectAnswer}** ✓`,
                incorrect: (v) => `Remember: find the LCD (${v.intLcd}), convert, then add the tops. ${v.intNewANum} + ${v.intNewBNum} = ${v.intAnswerNum}. Answer: **${v.intCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The biggest fraction trap!",
            body: () => `**Never add the bottom numbers.** This is the most common mistake in fractions. Always find a common bottom number first!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 6 }, (_, i) => ({
                    value: 1,
                    color: i < 3 ? "#c084fc" : (i < 5 ? "#38bdf8" : undefined),
                    empty: i >= 5
                  })),
                  totalLabel: "1/2 + 1/3 = 3/6 + 2/6 = 5/6 — NOT 2/5!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "✗ WRONG: 1/2 + 1/3 = 2/5", why: "You can't just add tops and bottoms!" },
                    { text: "✓ RIGHT: Convert to 6ths first", why: "3/6 + 2/6 = 5/6" },
                    { text: "Match the bottom numbers → Convert → Add tops → Simplify", why: "This is the correct method every time ✓" }
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
  // SUB-CONCEPT 7: Subtracting Fractions (Different Denominators)
  // ==========================================
  {
    id: "subtracting-diff-denom",
    name: "Subtracting Fractions (Different Denominators)",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "subtracting-diff-denom-steps",
        templateType: "step-by-step",
        learningGoal: ["How to find a common bottom number (denominator) before subtracting", "Why 2/3 − 1/6 needs converting before you can subtract"],
        variableSets: [
          {
            name: "Priya",
            scenario: "had ribbon and cut some off",
            fracANum: 2, fracADen: 3, fracBNum: 1, fracBDen: 6,
            lcd: 6, newANum: 4, newBNum: 1,
            answerNum: 3, answerDen: 6,
            canSimplify: true, simNum: 1, simDen: 2,
            unit: "metre",
            intFracANum: 3, intFracADen: 4, intFracBNum: 1, intFracBDen: 5,
            intLcd: 20, intNewANum: 15, intNewBNum: 4,
            intAnswerNum: 11, intAnswerDen: 20, intCanSimplify: false
          },
          {
            name: "Isaac",
            scenario: "drank some of a smoothie",
            fracANum: 3, fracADen: 4, fracBNum: 1, fracBDen: 3,
            lcd: 12, newANum: 9, newBNum: 4,
            answerNum: 5, answerDen: 12,
            canSimplify: false,
            unit: "litre",
            intFracANum: 5, intFracADen: 6, intFracBNum: 1, intFracBDen: 4,
            intLcd: 12, intNewANum: 10, intNewBNum: 3,
            intAnswerNum: 7, intAnswerDen: 12, intCanSimplify: false
          },
          {
            name: "Grace",
            scenario: "used some flour from a bag",
            fracANum: 4, fracADen: 5, fracBNum: 1, fracBDen: 2,
            lcd: 10, newANum: 8, newBNum: 5,
            answerNum: 3, answerDen: 10,
            canSimplify: false,
            unit: "kilogram",
            intFracANum: 2, intFracADen: 3, intFracBNum: 1, intFracBDen: 4,
            intLcd: 12, intNewANum: 8, intNewBNum: 3,
            intAnswerNum: 5, intAnswerDen: 12, intCanSimplify: false
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.fracANum}/${v.fracADen} − ${v.fracBNum}/${v.fracBDen} = ?`,
            body: (v) => `${v.name} ${v.scenario}. She started with **${v.fracANum}/${v.fracADen}** of a ${v.unit} and used **${v.fracBNum}/${v.fracBDen}**. The bottom numbers are different — what do we do?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: `${v.fracANum}/${v.fracADen}`,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracBNum ? "#f87171" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: `Take away ${v.fracBNum}/${v.fracBDen}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Convert first, then subtract!",
            body: (v) => `Let's work out **${v.fracANum}/${v.fracADen} − ${v.fracBNum}/${v.fracBDen}**. Just like adding — find a common denominator (the same bottom number for both fractions), convert both fractions, then subtract. The denominator (the bottom number of a fraction) must match first!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.fracADen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracANum ? "#c084fc" : undefined,
                    empty: i >= v.fracANum
                  })),
                  totalLabel: `${v.fracANum}/${v.fracADen}`,
                  comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                    value: 1,
                    color: i < v.fracBNum ? "#f87171" : undefined,
                    empty: i >= v.fracBNum
                  })),
                  comparisonLabel: `Take away ${v.fracBNum}/${v.fracBDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the smallest number both ${v.fracADen} and ${v.fracBDen} go into`, why: "This gives matching bottom numbers", result: `= ${v.lcd}` },
                    { text: `Convert ${v.fracANum}/${v.fracADen}: multiply top and bottom by ${v.lcd / v.fracADen}`, result: `= ${v.newANum}/${v.lcd}` },
                    { text: `Convert ${v.fracBNum}/${v.fracBDen}: multiply top and bottom by ${v.lcd / v.fracBDen}`, result: `= ${v.newBNum}/${v.lcd}` },
                    { text: `Subtract the tops: ${v.newANum} − ${v.newBNum} = ${v.answerNum}`, why: "Keep the bottom number the same", result: `= ${v.answerNum}/${v.answerDen}` },
                    ...(v.canSimplify ? [{ text: `Simplify: ${v.answerNum} and ${v.answerDen} both divide by ${v.answerNum / v.simNum}`, why: `${v.answerNum} ÷ ${v.answerNum / v.simNum} = ${v.simNum}, ${v.answerDen} ÷ ${v.answerNum / v.simNum} = ${v.simDen}`, result: `= ${v.simNum}/${v.simDen} ✓` }] : [{ text: `Answer: ${v.answerNum}/${v.answerDen}`, why: "Can't simplify — no number divides evenly into both", result: `${v.answerNum}/${v.answerDen} ✓` }])
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracANum}/${v.intFracADen} − ${v.intFracBNum}/${v.intFracBDen}?`,
            body: (v) => `Find the LCD (Lowest Common Denominator) of ${v.intFracADen} and ${v.intFracBDen}, convert both fractions, then subtract the top numbers!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intFracADen}`,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracBNum ? "#f87171" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: `− ${v.intFracBNum}/${v.intFracBDen}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intFracADen} − ${v.intFracBNum}/${v.intFracBDen} = ?`,
              getOptions: (v) => {
                const correct = v.intCanSimplify ? `${v.intSimNum}/${v.intSimDen}` : `${v.intAnswerNum}/${v.intAnswerDen}`;
                const wrong1 = `${v.intFracANum - v.intFracBNum}/${Math.abs(v.intFracADen - v.intFracBDen) || 1}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${v.intAnswerNum}/${v.intAnswerDen + 2}`;
                const wrong4 = `${v.intNewANum}/${v.intLcd}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCanSimplify ? `${v.intSimNum}/${v.intSimDen}` : `${v.intAnswerNum}/${v.intAnswerDen}`,
              feedback: {
                correct: (v) => `Perfect! Convert to ${v.intLcd}ths, subtract the tops: ${v.intNewANum} − ${v.intNewBNum} = ${v.intAnswerNum}. ${v.intCanSimplify ? `Simplify to **${v.intSimNum}/${v.intSimDen}**` : `Answer: **${v.intAnswerNum}/${v.intAnswerDen}**`} ✓`,
                incorrect: (v) => `Not quite! LCD = ${v.intLcd}. Convert: ${v.intNewANum}/${v.intLcd} − ${v.intNewBNum}/${v.intLcd} = ${v.intAnswerNum}/${v.intAnswerDen}${v.intCanSimplify ? ` = **${v.intSimNum}/${v.intSimDen}**` : ``}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtracting fractions with different bottom numbers",
            body: () => `Same method as adding — but subtract! Find the smallest number both bottom numbers go into, convert both fractions, then subtract the top numbers.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 12 }, (_, i) => ({
                    value: 1,
                    label: i < 5 ? "✓" : (i < 9 ? "−" : ""),
                    color: i < 5 ? "#c084fc" : (i < 9 ? "#f87171" : undefined),
                    empty: i >= 9
                  })),
                  totalLabel: "3/4 − 1/3 = 9/12 − 4/12 = 5/12"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the smallest number both bottom numbers go into", why: "This gives matching bottom numbers" },
                    { text: "Convert both fractions to that bottom number", why: "Multiply top and bottom of each" },
                    { text: "Subtract the top numbers", why: "The bottom numbers are now the same!" },
                    { text: "Simplify your answer if you can", why: "Check if a number divides evenly into both top and bottom ✓" }
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
        id: "subtracting-diff-denom-curiosity",
        templateType: "curiosity-hook",
        learningGoal: ["How to apply common-bottom-number subtraction to real problems", "When to watch out for subtracting before the bottom numbers match"],
        variableSets: [
          {
            name: "Ravi",
            scenario: "Ravi has 3/4 of a pizza. He gives 1/3 to his sister",
            fracANum: 3, fracADen: 4, fracBNum: 1, fracBDen: 3,
            lcd: 12, newANum: 9, newBNum: 4,
            answerNum: 5, answerDen: 12,
            unit: "pizza",
            intFracANum: 4, intFracADen: 5, intFracBNum: 1, intFracBDen: 3,
            intLcd: 15, intNewANum: 12, intNewBNum: 5,
            intAnswerNum: 7, intAnswerDen: 15
          },
          {
            name: "Nadia",
            scenario: "Nadia has 5/6 of a metre of string. She cuts off 1/4",
            fracANum: 5, fracADen: 6, fracBNum: 1, fracBDen: 4,
            lcd: 12, newANum: 10, newBNum: 3,
            answerNum: 7, answerDen: 12,
            unit: "metre",
            intFracANum: 7, intFracADen: 8, intFracBNum: 1, intFracBDen: 3,
            intLcd: 24, intNewANum: 21, intNewBNum: 8,
            intAnswerNum: 13, intAnswerDen: 24
          },
          {
            name: "Oscar",
            scenario: "Oscar fills 2/3 of a bucket. Then 1/5 splashes out",
            fracANum: 2, fracADen: 3, fracBNum: 1, fracBDen: 5,
            lcd: 15, newANum: 10, newBNum: 3,
            answerNum: 7, answerDen: 15,
            unit: "bucket",
            intFracANum: 5, intFracADen: 6, intFracBNum: 1, intFracBDen: 2,
            intLcd: 6, intNewANum: 5, intNewBNum: 3,
            intAnswerNum: 2, intAnswerDen: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you subtract these?",
            body: (v) => `${v.scenario}. How much ${v.unit} is left? The tricky part: the bottom numbers are **different**!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracANum ? "#c084fc" : undefined,
                  empty: i >= v.fracANum
                })),
                totalLabel: `Start: ${v.fracANum}/${v.fracADen}`,
                comparison: Array.from({ length: v.fracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.fracBNum ? "#f87171" : undefined,
                  empty: i >= v.fracBNum
                })),
                comparisonLabel: `Take away: ${v.fracBNum}/${v.fracBDen}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same trick as adding!",
            body: (v) => `Convert both to the **same bottom number** (${v.lcd}), then subtract the tops. Tap to see!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.lcd }, (_, i) => ({
                    value: 1,
                    label: i < v.answerNum ? "✓" : (i < v.newANum ? "−" : ""),
                    color: i < v.answerNum ? "#c084fc" : (i < v.newANum ? "#f87171" : undefined),
                    empty: i >= v.newANum
                  })),
                  totalLabel: `${v.newANum}/${v.lcd} − ${v.newBNum}/${v.lcd} = ${v.answerNum}/${v.answerDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `LCD (Lowest Common Denominator (the same bottom number for both fractions)) of ${v.fracADen} and ${v.fracBDen} = ${v.lcd}`, why: "Both go into this number" },
                    { text: `${v.fracANum}/${v.fracADen} = ${v.newANum}/${v.lcd}`, why: `Multiply top and bottom by ${v.lcd / v.fracADen}` },
                    { text: `${v.fracBNum}/${v.fracBDen} = ${v.newBNum}/${v.lcd}`, why: `Multiply top and bottom by ${v.lcd / v.fracBDen}` },
                    { text: `${v.newANum}/${v.lcd} − ${v.newBNum}/${v.lcd} = ${v.answerNum}/${v.answerDen}`, result: `${v.answerNum}/${v.answerDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `How much is left?`,
            body: (v) => `${v.intFracANum}/${v.intFracADen} − ${v.intFracBNum}/${v.intFracBDen} = ?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracADen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracANum ? "#c084fc" : undefined,
                  empty: i >= v.intFracANum
                })),
                totalLabel: `${v.intFracANum}/${v.intFracADen}`,
                comparison: Array.from({ length: v.intFracBDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intFracBNum ? "#f87171" : undefined,
                  empty: i >= v.intFracBNum
                })),
                comparisonLabel: `− ${v.intFracBNum}/${v.intFracBDen}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracANum}/${v.intFracADen} − ${v.intFracBNum}/${v.intFracBDen} = ?`,
              getOptions: (v) => {
                const correct = `${v.intAnswerNum}/${v.intAnswerDen}`;
                const wrong1 = `${v.intFracANum - v.intFracBNum}/${Math.abs(v.intFracADen - v.intFracBDen) || 1}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${Math.max(1, v.intAnswerNum - 1)}/${v.intAnswerDen}`;
                const wrong4 = `${v.intNewANum + v.intNewBNum}/${v.intLcd}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intAnswerNum}/${v.intAnswerDen}`,
              feedback: {
                correct: (v) => `Superstar! LCD = ${v.intLcd}, so ${v.intNewANum}/${v.intLcd} − ${v.intNewBNum}/${v.intLcd} = **${v.intAnswerNum}/${v.intAnswerDen}** ✓`,
                incorrect: (v) => `Not quite! Convert to ${v.intLcd}ths first: ${v.intNewANum} − ${v.intNewBNum} = ${v.intAnswerNum}. Answer: **${v.intAnswerNum}/${v.intAnswerDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adding or subtracting — same first step!",
            body: () => `Whether you're adding or subtracting fractions with different bottom numbers, the method is the same: **convert first**, then add or subtract the top numbers.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 15 }, (_, i) => ({
                    value: 1,
                    label: i < 7 ? "✓" : (i < 10 ? "−" : ""),
                    color: i < 7 ? "#c084fc" : (i < 10 ? "#f87171" : undefined),
                    empty: i >= 10
                  })),
                  totalLabel: "2/3 − 1/5 = 10/15 − 3/15 = 7/15"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the smallest number both bottom numbers go into", why: "Works for both adding and subtracting" },
                    { text: "Convert both fractions", why: "Multiply top and bottom by the same number" },
                    { text: "Add or subtract the top numbers", why: "Now the pieces are the same size" },
                    { text: "Simplify your answer", why: "Always check! ✓" }
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
  // SUB-CONCEPT 8: Fraction of an Amount
  // ==========================================
  {
    id: "fraction-of-amount",
    name: "Fraction of an Amount",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "fraction-of-amount-steps",
        templateType: "step-by-step",
        learningGoal: ["How to find a fraction of a number: divide by the bottom, multiply by the top", "Why finding 1/4 first helps you find 3/4"],
        variableSets: [
          {
            name: "Ella",
            pronoun: "She",
            scenario: "has a bag of marbles",
            amount: 40, numerator: 3, denominator: 4,
            onePartValue: 10, answer: 30,
            unit: "marbles",
            intAmount: 36, intNum: 2, intDen: 3, intOnePart: 12, intAnswer: 24
          },
          {
            name: "Jake",
            pronoun: "He",
            scenario: "earned pocket money",
            amount: 30, numerator: 2, denominator: 5,
            onePartValue: 6, answer: 12,
            unit: "pounds",
            intAmount: 27, intNum: 2, intDen: 3, intOnePart: 9, intAnswer: 18
          },
          {
            name: "Daisy",
            pronoun: "She",
            scenario: "picked strawberries in a garden",
            amount: 24, numerator: 5, denominator: 6,
            onePartValue: 4, answer: 20,
            unit: "strawberries",
            intAmount: 42, intNum: 3, intDen: 7, intOnePart: 6, intAnswer: 18
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.numerator}/${v.denominator} of ${v.amount}?`,
            body: (v) => `${v.name} ${v.scenario}. ${v.pronoun} has **${v.amount} ${v.unit}** and wants to find **${v.numerator}/${v.denominator}** of them. There's a two-step trick!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: v.onePartValue,
                  label: `${v.onePartValue}`,
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `Total: ${v.amount} ${v.unit}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide by the bottom, multiply by the top!",
            body: (v) => `Divide by the **denominator** (bottom number) to find **one part**, then multiply by the **numerator** (top number). Tap to see!`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**Question: What is ${v.numerator}/${v.denominator} of ${v.amount} ${v.unit}?**`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: v.onePartValue,
                    label: `${v.onePartValue}`,
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `Total: ${v.amount} — each part = ${v.onePartValue}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Divide by the bottom number: ${v.amount} ÷ ${v.denominator} = ${v.onePartValue}`, why: `This gives you 1/${v.denominator} of ${v.amount}` },
                    { text: `Multiply by the top number: ${v.onePartValue} × ${v.numerator} = ${v.answer}`, why: `Now you have ${v.numerator}/${v.denominator} of ${v.amount}` },
                    { text: `${v.numerator}/${v.denominator} of ${v.amount} = ${v.answer}`, result: `${v.answer} ${v.unit} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => "Your turn!",
            body: (v) => `What is **${v.intNum}/${v.intDen} of ${v.intAmount}**? Divide by ${v.intDen}, then multiply by ${v.intNum}!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDen }, (_, i) => ({
                  value: v.intOnePart,
                  label: "?",
                  color: i < v.intNum ? "#c084fc" : undefined,
                  empty: i >= v.intNum
                })),
                totalLabel: `${v.intNum}/${v.intDen} of ${v.intAmount}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.intNum}/${v.intDen} of ${v.intAmount}?`,
              getOptions: (v) => generateDistractors(v.intAnswer),
              correctAnswer: (v) => v.intAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.intAmount} ÷ ${v.intDen} = ${v.intOnePart}, then ${v.intOnePart} × ${v.intNum} = **${v.intAnswer}** ✓`,
                incorrect: (v) => `Not quite! Divide first: ${v.intAmount} ÷ ${v.intDen} = ${v.intOnePart}. Then multiply: ${v.intOnePart} × ${v.intNum} = **${v.intAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding a fraction of any amount",
            body: () => `Two steps — works every time! **Divide** by the bottom, **multiply** by the top.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 5 }, (_, i) => ({
                    value: 4,
                    label: "4",
                    color: i < 3 ? "#c084fc" : undefined,
                    empty: i >= 3
                  })),
                  totalLabel: "3/5 of 20 = 12"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Divide the amount by the denominator (the bottom number)", why: "This finds one equal part" },
                    { text: "Multiply by the numerator (the top number)", why: "This gives you the number of parts you need" },
                    { text: "Example: 3/5 of 20 → 20 ÷ 5 = 4, then 4 × 3 = 12", why: "Divide by 5, multiply by 3 ✓" }
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
        id: "fraction-of-amount-curiosity",
        templateType: "curiosity-hook",
        learningGoal: ["How to apply the divide-then-multiply method to money and sharing problems", "When to watch out for multiplying before dividing"],
        variableSets: [
          {
            name: "Tom",
            scenario: "Tom has 36 football stickers. He gives 2/3 to his friend",
            amount: 36, numerator: 2, denominator: 3,
            onePartValue: 12, answer: 24,
            wrongAnswer: 72, wrongMethod: "multiplied 36 by 2 instead of dividing first",
            unit: "stickers",
            intAmount: 42, intNum: 2, intDen: 7, intOnePart: 6, intAnswer: 12
          },
          {
            name: "Holly",
            scenario: "Holly has £48. She spends 3/4 on a present",
            amount: 48, numerator: 3, denominator: 4,
            onePartValue: 12, answer: 36,
            wrongAnswer: 16, wrongMethod: "divided 48 by 3 instead of by 4",
            unit: "pounds",
            intAmount: 54, intNum: 2, intDen: 9, intOnePart: 6, intAnswer: 12
          },
          {
            name: "Finn",
            scenario: "Finn's class has 30 children. 2/5 are in the choir",
            amount: 30, numerator: 2, denominator: 5,
            onePartValue: 6, answer: 12,
            wrongAnswer: 15, wrongMethod: "divided 30 by 2 instead of by 5",
            unit: "children",
            intAmount: 40, intNum: 3, intDen: 8, intOnePart: 5, intAnswer: 15
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Which step comes first?",
            body: (v) => `${v.scenario}. Someone got **${v.wrongAnswer}**. That's wrong! They ${v.wrongMethod}. What should they have done first?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: v.onePartValue,
                  label: i < v.numerator ? `${v.onePartValue}` : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator}/${v.denominator} of ${v.amount} = ?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide by the BOTTOM first!",
            body: (v) => `Always divide by the **denominator (the bottom number)** first. This gives you **one part**. Then multiply by the **numerator (the top number)** to get the right number of parts.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: v.onePartValue,
                    label: `${v.onePartValue}`,
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `${v.amount} ÷ ${v.denominator} = ${v.onePartValue} per part`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ Wrong: ${v.wrongAnswer}`, why: `${v.wrongMethod}` },
                    { text: `✓ Step 1: ${v.amount} ÷ ${v.denominator} = ${v.onePartValue}`, why: `Find 1/${v.denominator} first` },
                    { text: `✓ Step 2: ${v.onePartValue} × ${v.numerator} = ${v.answer}`, result: `${v.numerator}/${v.denominator} of ${v.amount} = ${v.answer} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intNum}/${v.intDen} of ${v.intAmount}?`,
            body: (v) => `Remember: divide by ${v.intDen} first, then multiply by ${v.intNum}!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDen }, (_, i) => ({
                  value: v.intOnePart,
                  label: "?",
                  color: i < v.intNum ? "#c084fc" : undefined,
                  empty: i >= v.intNum
                })),
                totalLabel: `${v.intNum}/${v.intDen} of ${v.intAmount} ${v.unit}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intNum}/${v.intDen} of ${v.intAmount} = ?`,
              getOptions: (v) => generateDistractors(v.intAnswer),
              correctAnswer: (v) => v.intAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.intAmount} ÷ ${v.intDen} = ${v.intOnePart}, then × ${v.intNum} = **${v.intAnswer}** ✓`,
                incorrect: (v) => `Nearly! Divide first: ${v.intAmount} ÷ ${v.intDen} = ${v.intOnePart}. Then multiply: ${v.intOnePart} × ${v.intNum} = **${v.intAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The order matters!",
            body: () => `Divide by the **bottom** FIRST, then multiply by the **top**. Getting the order wrong is a very common mistake!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 12,
                    label: "12",
                    color: i < 3 ? "#c084fc" : undefined,
                    empty: i >= 3
                  })),
                  totalLabel: "3/4 of 48: 48 ÷ 4 = 12, then 12 × 3 = 36"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: DIVIDE by the bottom number", why: "Find one equal part first" },
                    { text: "Step 2: MULTIPLY by the top number", why: "Get the right number of parts" },
                    { text: "Memory trick: 'Divide by the Down one'", why: "Down = Denominator (the bottom number of a fraction) = Divide!" }
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
  // SUB-CONCEPT 9: Fraction to Decimal
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
        learningGoal: ["How to turn a fraction into a decimal by dividing", "How to recall which common fractions equal which decimals (1/2=0.5, 1/4=0.25, 3/4=0.75)"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "measuring ingredients for baking",
            numerator: 3, denominator: 4,
            decimal: 0.75, unit: "kg",
            divSteps: [
              { text: "3 ÷ 4: 4 doesn't go into 3, so write 0.", why: "Put a decimal point after the 0" },
              { text: "30 ÷ 4 = 7 remainder 2", why: "7 goes in the tenths column" },
              { text: "20 ÷ 4 = 5 exactly", why: "5 goes in the hundredths column — done!" }
            ],
            testNum: 1, testDen: 8, testDecimal: 0.125
          },
          {
            name: "Charlie",
            scenario: "working out how far he has walked",
            numerator: 1, denominator: 5,
            decimal: 0.2, unit: "km",
            divSteps: [
              { text: "1 ÷ 5: 5 doesn't go into 1, so write 0.", why: "Put a decimal point after the 0" },
              { text: "10 ÷ 5 = 2 exactly", why: "2 goes in the tenths column — done!" }
            ],
            testNum: 3, testDen: 5, testDecimal: 0.6
          },
          {
            name: "Sophie",
            scenario: "calculating her test score",
            numerator: 7, denominator: 10,
            decimal: 0.7, unit: "marks",
            divSteps: [
              { text: "7 ÷ 10: 10 doesn't go into 7, so write 0.", why: "Put a decimal point after the 0" },
              { text: "70 ÷ 10 = 7 exactly", why: "7 goes in the tenths column — done!" }
            ],
            testNum: 1, testDen: 4, testDecimal: 0.25
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.numerator}/${v.denominator} as a decimal?`,
            body: (v) => `${v.name} is ${v.scenario} and needs **${v.numerator}/${v.denominator} ${v.unit}**. The scales show decimals. How do we convert?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? "" : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator}/${v.denominator} = ? decimal`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide the top by the bottom!",
            body: (v) => `A fraction **is** a division. **${v.numerator}/${v.denominator}** means **${v.numerator} ÷ ${v.denominator}**.\nLet's work through the division step by step. Tap to see!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numerator}/${v.denominator} means ${v.numerator} ÷ ${v.denominator}`, why: "The fraction bar means 'divided by'" },
                  ...v.divSteps,
                  { text: `${v.numerator}/${v.denominator} = ${v.decimal}`, result: `${v.decimal} ✓` },
                  { text: "Key pairs to memorise:", why: "These come up again and again!" },
                  { text: "1/2 = 0.5 | 1/4 = 0.25 | 3/4 = 0.75", why: "Halves and quarters" },
                  { text: "1/5 = 0.2 | 2/5 = 0.4 | 1/10 = 0.1", why: "Fifths and tenths" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Convert ${v.testNum}/${v.testDen} to a decimal`,
            body: (v) => `What is ${v.testNum} ÷ ${v.testDen}?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                tickInterval: 0.1,
                points: [
                  { value: v.testDecimal, label: "?", color: "#6C5CE7" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.testNum}/${v.testDen} = ?`,
              getOptions: (v) => {
                const correct = `${v.testDecimal}`;
                const wrong1 = `${(v.testDecimal + 0.1).toFixed(1)}`;
                const wrong2 = `${(v.testDecimal - 0.1 < 0 ? v.testDecimal + 0.2 : v.testDecimal - 0.1).toFixed(2)}`;
                const wrong3 = `${v.testNum}.${v.testDen}`;
                const wrong4 = `${(v.testDecimal + 0.05).toFixed(2)}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.testDecimal}`,
              feedback: {
                correct: (v) => `Well done! ${v.testNum} ÷ ${v.testDen} = **${v.testDecimal}** ✓`,
                incorrect: (v) => `Not quite! ${v.testNum} ÷ ${v.testDen} = **${v.testDecimal}**. Remember: divide the top by the bottom.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Fraction → Decimal — the recipe",
            body: () => `Converting fractions to decimals is simple: top ÷ bottom!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Divide the top number by the bottom number", why: "Fraction = division!" },
                  { text: "2. Memorise the key pairs: ½ = 0.5, ¼ = 0.25, ¾ = 0.75", why: "These come up in nearly every paper" },
                  { text: "3. Check: is your decimal between 0 and 1?", why: "A proper fraction is always less than 1 ✓" }
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
        id: "fraction-to-decimal-keyfact",
        templateType: "key-fact",
        learningGoal: ["How to apply fraction-to-decimal conversion in timed exam questions", "When to use memorised equivalents instead of dividing every time"],
        variableSets: [
          {
            name: "Ben",
            fraction: "3/8", numerator: 3, denominator: 8, decimal: 0.375,
            divSteps: [
              { text: "3 ÷ 8: 8 doesn't go into 3, so write 0.", why: "Put a decimal point after the 0" },
              { text: "30 ÷ 8 = 3 remainder 6", why: "3 goes in the tenths column" },
              { text: "60 ÷ 8 = 7 remainder 4", why: "7 goes in the hundredths column" },
              { text: "40 ÷ 8 = 5 exactly", why: "5 goes in the thousandths column — done!" }
            ],
            testFrac: "5/8", testNum: 5, testDen: 8, testDecimal: 0.625
          },
          {
            name: "Priya",
            fraction: "2/5", numerator: 2, denominator: 5, decimal: 0.4,
            divSteps: [
              { text: "2 ÷ 5: 5 doesn't go into 2, so write 0.", why: "Put a decimal point after the 0" },
              { text: "20 ÷ 5 = 4 exactly", why: "4 goes in the tenths column — done!" }
            ],
            testFrac: "4/5", testNum: 4, testDen: 5, testDecimal: 0.8
          },
          {
            name: "Finn",
            fraction: "1/8", numerator: 1, denominator: 8, decimal: 0.125,
            divSteps: [
              { text: "1 ÷ 8: 8 doesn't go into 1, so write 0.", why: "Put a decimal point after the 0" },
              { text: "10 ÷ 8 = 1 remainder 2", why: "1 goes in the tenths column" },
              { text: "20 ÷ 8 = 2 remainder 4", why: "2 goes in the hundredths column" },
              { text: "40 ÷ 8 = 5 exactly", why: "5 goes in the thousandths column — done!" }
            ],
            testFrac: "7/8", testNum: 7, testDen: 8, testDecimal: 0.875
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know that ${v.fraction} = ${v.decimal}?`,
            body: (v) => `Every fraction has a decimal twin! **${v.fraction}** is the same as **${v.decimal}**. The trick? Just divide: ${v.numerator} ÷ ${v.denominator} = ${v.decimal}.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? `${(1/v.denominator).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}` : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.fraction} = ${v.decimal}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Fractions ARE divisions!",
            body: (v) => `The fraction bar means "divided by". So **${v.fraction}** means **${v.numerator} ÷ ${v.denominator}**.\nLet's work through the division step by step. Tap to see!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.fraction} means ${v.numerator} ÷ ${v.denominator}`, why: "The fraction bar means 'divided by'" },
                  ...v.divSteps,
                  { text: `${v.fraction} = ${v.decimal}`, result: `${v.decimal} ✓` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.testFrac} as a decimal?`,
            body: (v) => `${v.testNum} ÷ ${v.testDen} = ?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.testDen }, (_, i) => ({
                  value: 1,
                  label: "?",
                  color: i < v.testNum ? "#c084fc" : undefined,
                  empty: i >= v.testNum
                })),
                totalLabel: `${v.testFrac} = ?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.testFrac} as a decimal = ?`,
              getOptions: (v) => {
                const correct = `${v.testDecimal}`;
                const wrong1 = `${(v.testDecimal + 0.125).toFixed(3)}`;
                const wrong2 = `${(v.testDecimal - 0.125).toFixed(3)}`;
                const wrong3 = `${v.testNum}.${v.testDen}`;
                const wrong4 = `${(1 - v.testDecimal).toFixed(3)}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.testDecimal}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.testNum} ÷ ${v.testDen} = **${v.testDecimal}** ✓`,
                incorrect: (v) => `Not quite! ${v.testNum} ÷ ${v.testDen} = **${v.testDecimal}**. Divide the top by the bottom!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The key fact!",
            body: () => `A fraction IS a division. To convert any fraction to a decimal: **divide the top by the bottom**. That's it!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Fraction = Division", why: "3/4 means 3 ÷ 4" },
                  { text: "Divide top by bottom to get the decimal", why: "Works for any fraction" },
                  { text: "Learn the common ones by heart!", why: "1/2=0.5, 1/4=0.25, 3/4=0.75, 1/5=0.2, 1/10=0.1 ✓" }
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
  // SUB-CONCEPT 10: Decimal to Fraction
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
        learningGoal: ["How to turn a decimal like 0.6 into a fraction", "How to simplify 6/10 to 3/5"],
        variableSets: [
          {
            name: "Grace",
            scenario: "scored 0.6 in a test",
            decimal: 0.6, placeName: "tenths",
            rawNum: 6, rawDen: 10, hcf: 2,
            simNum: 3, simDen: 5,
            intDecimal: 0.4, intRawNum: 4, intRawDen: 10, intHcf: 2, intSimNum: 2, intSimDen: 5
          },
          {
            name: "Tom",
            scenario: "measured 0.75 metres of string",
            decimal: 0.75, placeName: "hundredths",
            rawNum: 75, rawDen: 100, hcf: 25,
            simNum: 3, simDen: 4,
            intDecimal: 0.5, intRawNum: 5, intRawDen: 10, intHcf: 5, intSimNum: 1, intSimDen: 2
          },
          {
            name: "Nadia",
            scenario: "drank 0.4 litres of juice",
            decimal: 0.4, placeName: "tenths",
            rawNum: 4, rawDen: 10, hcf: 2,
            simNum: 2, simDen: 5,
            intDecimal: 0.75, intRawNum: 75, intRawDen: 100, intHcf: 25, intSimNum: 3, intSimDen: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.decimal} as a fraction?`,
            body: (v) => `${v.name} ${v.scenario}. Can you write **${v.decimal}** as a fraction? The decimal places give you a clue!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                tickInterval: 0.1,
                points: [
                  { value: v.decimal, label: `${v.decimal}`, color: "#6C5CE7" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the place value!",
            body: (v) => `Count the decimal places. One place = **tenths**, two places = **hundredths**. Then simplify!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.simDen }, (_, i) => ({
                    value: 1,
                    color: i < v.simNum ? "#c084fc" : undefined,
                    empty: i >= v.simNum
                  })),
                  totalLabel: `${v.decimal} = ${v.simNum}/${v.simDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.decimal} has digits in the ${v.placeName} column`, why: `So the bottom number is ${v.rawDen}` },
                    { text: `Write as a fraction: ${v.rawNum}/${v.rawDen}`, why: `${v.decimal} = ${v.rawNum} ${v.placeName}` },
                    { text: `Simplify: both ${v.rawNum} and ${v.rawDen} divide by ${v.hcf}`, why: `${v.rawNum} ÷ ${v.hcf} = ${v.simNum}, ${v.rawDen} ÷ ${v.hcf} = ${v.simDen}` },
                    { text: `So ${v.rawNum}/${v.rawDen} = ${v.simNum}/${v.simDen}`, result: `${v.decimal} = ${v.simNum}/${v.simDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Convert ${v.intDecimal} to a fraction`,
            body: (v) => `Write ${v.intDecimal} as a fraction in its simplest form.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intSimDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intSimNum ? "#c084fc" : undefined,
                  empty: i >= v.intSimNum
                })),
                totalLabel: `${v.intDecimal} = ?/?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intDecimal} as a fraction = ?`,
              getOptions: (v) => {
                const correct = `${v.intSimNum}/${v.intSimDen}`;
                const wrong1 = `${v.intRawNum}/${v.intRawDen}`;
                const wrong2 = `${v.intSimDen}/${v.intSimNum}`;
                const wrong3 = `${v.intSimNum + 1}/${v.intSimDen}`;
                const wrong4 = `${v.intSimNum}/${v.intSimDen + 1}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intSimNum}/${v.intSimDen}`,
              feedback: {
                correct: (v) => `Superstar! ${v.intDecimal} = ${v.intRawNum}/${v.intRawDen} = **${v.intSimNum}/${v.intSimDen}** ✓`,
                incorrect: (v) => `Not quite! ${v.intDecimal} = ${v.intRawNum}/${v.intRawDen}. Simplify by dividing both by ${v.intHcf}: **${v.intSimNum}/${v.intSimDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decimal to fraction in 3 steps",
            body: () => `Use the place value to write the fraction, then simplify. Works every time!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 1,
                    color: i < 1 ? "#c084fc" : undefined,
                    empty: i >= 1
                  })),
                  totalLabel: "0.25 = 25/100 = 1/4"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1 decimal place → bottom number is 10", why: "0.3 = 3/10" },
                    { text: "2 decimal places → bottom number is 100", why: "0.25 = 25/100" },
                    { text: "Simplify by dividing top and bottom by the biggest number that goes into both", why: "25/100 = 1/4 ✓" }
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
        id: "decimal-to-fraction-discovery",
        templateType: "visual-discovery",
        learningGoal: ["How to apply decimal-to-fraction conversion with different decimal lengths", "When to watch out for forgetting to simplify after converting"],
        variableSets: [
          {
            name: "Holly",
            decimal: 0.8, rawNum: 8, rawDen: 10, hcf: 2,
            simNum: 4, simDen: 5,
            intDecimal: 0.2, intRawNum: 2, intRawDen: 10, intHcf: 2, intSimNum: 1, intSimDen: 5
          },
          {
            name: "Isaac",
            decimal: 0.25, rawNum: 25, rawDen: 100, hcf: 25,
            simNum: 1, simDen: 4,
            intDecimal: 0.5, intRawNum: 5, intRawDen: 10, intHcf: 5, intSimNum: 1, intSimDen: 2
          },
          {
            name: "Ella",
            decimal: 0.5, rawNum: 5, rawDen: 10, hcf: 5,
            simNum: 1, simDen: 2,
            intDecimal: 0.8, intRawNum: 8, intRawDen: 10, intHcf: 2, intSimNum: 4, intSimDen: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What do you notice?`,
            body: (v) => `Look at this number line. **${v.decimal}** sits at exactly **${v.simNum}/${v.simDen}**. Can you see why?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0, max: 1,
                tickInterval: Math.max(1 / v.simDen, 0.1),
                points: [
                  { value: v.decimal, label: `${v.decimal} = ${v.simNum}/${v.simDen}`, color: "#6C5CE7" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Decimals and fractions are the same thing!",
            body: (v) => `${v.decimal} means ${v.rawNum} out of ${v.rawDen}. Write it as **${v.rawNum}/${v.rawDen}**, then simplify to **${v.simNum}/${v.simDen}**.`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.simDen }, (_, i) => ({
                    value: 1,
                    color: i < v.simNum ? "#c084fc" : undefined,
                    empty: i >= v.simNum
                  })),
                  totalLabel: `${v.decimal} = ${v.simNum}/${v.simDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.decimal} = ${v.rawNum}/${v.rawDen}`, why: "Read the decimal as a fraction" },
                    { text: `Simplify: divide by ${v.hcf}`, why: `${v.rawNum} ÷ ${v.hcf} = ${v.simNum}, ${v.rawDen} ÷ ${v.hcf} = ${v.simDen}` },
                    { text: `${v.decimal} = ${v.simNum}/${v.simDen}`, result: "Simplified! ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intDecimal} as a fraction?`,
            body: (v) => `Write ${v.intDecimal} as a simplified fraction.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intSimDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intSimNum ? "#c084fc" : undefined,
                  empty: i >= v.intSimNum
                })),
                totalLabel: `${v.intDecimal} = ?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intDecimal} = ?`,
              getOptions: (v) => {
                const correct = `${v.intSimNum}/${v.intSimDen}`;
                const wrong1 = `${v.intRawNum}/${v.intRawDen}`;
                const wrong2 = `${v.intSimNum + 1}/${v.intSimDen}`;
                const wrong3 = `${v.intSimDen}/${v.intSimNum}`;
                const wrong4 = `${v.intSimNum}/${v.intSimDen + 2}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intSimNum}/${v.intSimDen}`,
              feedback: {
                correct: (v) => `Yes! ${v.intDecimal} = ${v.intRawNum}/${v.intRawDen} = **${v.intSimNum}/${v.intSimDen}** ✓`,
                incorrect: (v) => `Not quite! ${v.intDecimal} = ${v.intRawNum}/${v.intRawDen}, simplified = **${v.intSimNum}/${v.intSimDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decimals and fractions are two ways of saying the same thing!",
            body: () => `Count the decimal places to find the bottom number (10 or 100), then simplify. Easy!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 2 }, (_, i) => ({
                    value: 1,
                    color: i < 1 ? "#c084fc" : undefined,
                    empty: i >= 1
                  })),
                  totalLabel: "0.5 = 5/10 = 1/2"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "0.5 = 5/10 = 1/2", why: "One decimal place → tenths" },
                    { text: "0.25 = 25/100 = 1/4", why: "Two decimal places → hundredths" },
                    { text: "Always simplify your answer!", why: "Divide top and bottom by the biggest number that goes into both ✓" }
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
  // SUB-CONCEPT 11: Fraction to Percentage
  // ==========================================
  {
    id: "fraction-to-percentage",
    name: "Fraction to Percentage",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "fraction-to-percentage-keyfact",
        templateType: "key-fact",
        learningGoal: ["How to turn a fraction into a percentage", "Why percent means out of 100"],
        variableSets: [
          {
            name: "Ravi",
            scenario: "scored 3/5 on a spelling test",
            numerator: 3, denominator: 5,
            multiplier: 20, percentage: 60,
            testNum: 9, testDen: 10, testMult: 10, testPct: 90
          },
          {
            name: "Lily",
            scenario: "ate 1/4 of a cake",
            numerator: 1, denominator: 4,
            multiplier: 25, percentage: 25,
            testNum: 2, testDen: 5, testMult: 20, testPct: 40
          },
          {
            name: "Oscar",
            scenario: "completed 4/5 of his homework",
            numerator: 4, denominator: 5,
            multiplier: 20, percentage: 80,
            testNum: 7, testDen: 10, testMult: 10, testPct: 70
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.numerator}/${v.denominator} as a percentage?`,
            body: (v) => `${v.name} ${v.scenario}. What percentage is that? **Percent** means **out of 100**, so we need to convert ${v.numerator}/${v.denominator} to something out of 100!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? `${100/v.denominator}%` : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator}/${v.denominator} = ?%`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Make the bottom number 100!",
            body: (v) => `Let's convert **${v.numerator}/${v.denominator}** to a percentage. Multiply top and bottom to make an **equivalent fraction** (a fraction with the same value but different numbers) where the bottom number becomes **100**. The top number then IS the percentage!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.numerator ? `${100/v.denominator}%` : "",
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `${v.numerator}/${v.denominator} = ${v.percentage}%`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.numerator}/${v.denominator} — we need this out of 100`, why: "Percent = per hundred" },
                    { text: `${v.denominator} × ${v.multiplier} = 100`, why: `Multiply top and bottom by ${v.multiplier}` },
                    { text: `${v.numerator} × ${v.multiplier} = ${v.percentage}`, why: "Now we have the top number out of 100" },
                    { text: `${v.numerator}/${v.denominator} = ${v.percentage}%`, result: `${v.percentage}% ✓` },
                    { text: "Key pairs to memorise:", why: "These come up again and again!" },
                    { text: "1/2 = 50% | 1/4 = 25% | 3/4 = 75%", why: "Halves and quarters" },
                    { text: "1/5 = 20% | 2/5 = 40% | 1/10 = 10%", why: "Fifths and tenths" }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.testNum}/${v.testDen} as a percentage?`,
            body: (v) => `${v.testDen} × ${v.testMult} = 100. So ${v.testNum} × ${v.testMult} = ?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.testDen }, (_, i) => ({
                  value: 1,
                  label: i < v.testNum ? "?" : "",
                  color: i < v.testNum ? "#c084fc" : undefined,
                  empty: i >= v.testNum
                })),
                totalLabel: `${v.testNum}/${v.testDen} = ?%`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.testNum}/${v.testDen} = ?%`,
              getOptions: (v) => generateDistractors(v.testPct),
              correctAnswer: (v) => v.testPct,
              feedback: {
                correct: (v) => `Spot on! ${v.testNum} × ${v.testMult} = ${v.testPct}, so ${v.testNum}/${v.testDen} = **${v.testPct}%** ✓`,
                incorrect: (v) => `Not quite! ${v.testNum}/${v.testDen}: multiply both by ${v.testMult} to get ${v.testPct}/100 = **${v.testPct}%**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Fraction → Percentage — the recipe",
            body: () => `To convert a fraction to a percentage: make the bottom number 100!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 4 }, (_, i) => ({
                    value: 1,
                    label: "25%",
                    color: i < 3 ? "#c084fc" : undefined,
                    empty: i >= 3
                  })),
                  totalLabel: "3/4 = 75%"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1. Find what × bottom number = 100", why: "What multiplies the bottom to 100?" },
                    { text: "2. Multiply top and bottom by that number", why: "Equivalent fraction (a fraction with the same value) with bottom number 100" },
                    { text: "3. The top number IS the percentage", why: "e.g. 75/100 = 75% ✓" }
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
        id: "fraction-to-percentage-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid dividing instead of multiplying when converting to a percentage", "When to watch out for not converting the bottom number to 100 first"],
        variableSets: [
          {
            name: "Marcus",
            numerator: 3, denominator: 5,
            wrongPct: 35, correctPct: 60,
            mistake: "wrote the digits next to each other (3 and 5 = 35) instead of converting",
            intNum: 2, intDen: 5, intPct: 40
          },
          {
            name: "Daisy",
            numerator: 1, denominator: 4,
            wrongPct: 14, correctPct: 25,
            mistake: "wrote the digits next to each other (1 and 4 = 14) instead of converting",
            intNum: 3, intDen: 4, intPct: 75
          },
          {
            name: "Jake",
            numerator: 2, denominator: 3,
            wrongPct: 23, correctPct: 67,
            mistake: "wrote the digits next to each other (2 and 3 = 23) instead of converting",
            intNum: 4, intDen: 5, intPct: 80
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} says ${v.numerator}/${v.denominator} = **${v.wrongPct}%**. That's wrong! Can you see what happened?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.denominator }, (_, i) => ({
                  value: 1,
                  label: i < v.numerator ? `${100/v.denominator}%` : "",
                  color: i < v.numerator ? "#c084fc" : undefined,
                  empty: i >= v.numerator
                })),
                totalLabel: `${v.numerator}/${v.denominator} = ${v.wrongPct}%?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You can't just write the digits!",
            body: (v) => `${v.name} ${v.mistake}. To convert, you need to make the bottom number **100** (or multiply the fraction by 100).`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.denominator }, (_, i) => ({
                    value: 1,
                    label: i < v.numerator ? `${100/v.denominator}%` : "",
                    color: i < v.numerator ? "#c084fc" : undefined,
                    empty: i >= v.numerator
                  })),
                  totalLabel: `${v.numerator}/${v.denominator} = ${v.correctPct}%, NOT ${v.wrongPct}%`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.numerator}/${v.denominator} = ${v.wrongPct}%`, why: `Just put the digits together — WRONG` },
                    { text: `✓ ${v.numerator}/${v.denominator} × 100 = ${v.correctPct}`, why: "Multiply the fraction by 100" },
                    { text: `${v.numerator}/${v.denominator} = ${v.correctPct}%`, result: `${v.correctPct}% ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intNum}/${v.intDen} as a percentage?`,
            body: (v) => `Multiply by 100, not just write the digits!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intDen }, (_, i) => ({
                  value: 1,
                  color: i < v.intNum ? "#c084fc" : undefined,
                  empty: i >= v.intNum
                })),
                totalLabel: `${v.intNum}/${v.intDen} = ?%`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intNum}/${v.intDen} = ?%`,
              getOptions: (v) => generateDistractors(v.intPct),
              correctAnswer: (v) => v.intPct,
              feedback: {
                correct: (v) => `Well done! ${v.intNum}/${v.intDen} = **${v.intPct}%** ✓`,
                incorrect: (v) => `Not quite! ${v.intNum}/${v.intDen} × 100 = **${v.intPct}%**. Always multiply the fraction by 100!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Converting fractions to percentages",
            body: () => `Always **multiply by 100** or convert the bottom number to 100. Never just squash the digits together!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 5 }, (_, i) => ({
                    value: 1,
                    label: "20%",
                    color: i < 3 ? "#c084fc" : undefined,
                    empty: i >= 3
                  })),
                  totalLabel: "3/5 = 60%, NOT 35%!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Method 1: Fraction × 100", why: "3/5 × 100 = 60%" },
                    { text: "Method 2: Make bottom number = 100", why: "3/5 = 60/100 = 60%" },
                    { text: "Check: does your answer make sense?", why: "3/5 is more than half, so it must be more than 50% ✓" }
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
  // SUB-CONCEPT 12: Mixed Numbers and Improper Fractions
  // ==========================================
  {
    id: "mixed-improper",
    name: "Mixed and Improper Fractions",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "mixed-improper-steps",
        templateType: "step-by-step",
        learningGoal: ["How to turn a mixed number (a whole number and a fraction together) like 2 and 1/3 into an improper fraction (where the top number is bigger than the bottom)", "How to turn an improper fraction (a fraction where the top number is bigger than the bottom) like 7/4 back into a mixed number (a whole number and a fraction together)"],
        variableSets: [
          {
            name: "Charlie",
            scenario: "ate slices of pizza",
            whole: 2, fracNum: 1, fracDen: 3,
            improperNum: 7, improperDen: 3,
            unit: "pizzas",
            intWhole: 3, intFracNum: 2, intFracDen: 5, intImproperNum: 17, intImproperDen: 5
          },
          {
            name: "Priya",
            scenario: "ran laps around the track",
            whole: 3, fracNum: 1, fracDen: 4,
            improperNum: 13, improperDen: 4,
            unit: "laps",
            intWhole: 2, intFracNum: 3, intFracDen: 7, intImproperNum: 17, intImproperDen: 7
          },
          {
            name: "Finn",
            scenario: "used packets of stickers",
            whole: 1, fracNum: 2, fracDen: 5,
            improperNum: 7, improperDen: 5,
            unit: "packets",
            intWhole: 4, intFracNum: 1, intFracDen: 3, intImproperNum: 13, intImproperDen: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.whole} ${v.fracNum}/${v.fracDen} as one fraction?`,
            body: (v) => `${v.name} ${v.scenario}. That's **${v.whole} ${v.fracNum}/${v.fracDen}** ${v.unit}. Can we write this as a single fraction? Yes — it's called an **improper fraction (a fraction where the top number is bigger than the bottom)**!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.improperNum }, (_, i) => ({
                  value: 1,
                  label: `1/${v.fracDen}`,
                  color: "#c084fc"
                })),
                totalLabel: `${v.whole} ${v.fracNum}/${v.fracDen} = ${v.improperNum}/${v.improperDen}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply, add, keep!",
            body: (v) => `Let's convert **${v.whole} ${v.fracNum}/${v.fracDen}** into a single fraction. Multiply the whole number by the **denominator (the bottom number)**, add the top, then keep the same bottom:`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.improperNum }, (_, i) => ({
                    value: 1,
                    label: `1/${v.fracDen}`,
                    color: "#c084fc"
                  })),
                  totalLabel: `${v.whole} ${v.fracNum}/${v.fracDen} = ${v.improperNum}/${v.improperDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Step 1: ${v.whole} × ${v.fracDen} = ${v.whole * v.fracDen}`, why: `Multiply the whole number (${v.whole}) by the bottom number (${v.fracDen})` },
                    { text: `Step 2: ${v.whole * v.fracDen} + ${v.fracNum} = ${v.improperNum}`, why: `Add the top number (${v.fracNum}) to get the new top` },
                    { text: `Step 3: Keep the bottom number as ${v.fracDen}`, why: "The piece size doesn't change" },
                    { text: `So ${v.whole} ${v.fracNum}/${v.fracDen} = ${v.improperNum}/${v.improperDen}`, result: `${v.improperNum}/${v.improperDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Convert ${v.intWhole} ${v.intFracNum}/${v.intFracDen}`,
            body: (v) => `What is ${v.intWhole} ${v.intFracNum}/${v.intFracDen} as an improper fraction (a fraction where the top number is bigger than the bottom)?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intImproperNum }, (_, i) => ({
                  value: 1,
                  color: "#c084fc"
                })),
                totalLabel: `${v.intWhole} ${v.intFracNum}/${v.intFracDen} = ?/${v.intFracDen}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intWhole} ${v.intFracNum}/${v.intFracDen} = ?`,
              getOptions: (v) => {
                const correct = `${v.intImproperNum}/${v.intImproperDen}`;
                const wrong1 = `${v.intWhole + v.intFracNum}/${v.intFracDen}`;
                const wrong2 = `${v.intImproperNum + 1}/${v.intImproperDen}`;
                const wrong3 = `${v.intImproperNum - 1}/${v.intImproperDen}`;
                const wrong4 = `${v.intImproperNum}/${v.intImproperDen + 1}`;
                return [...new Set([correct, wrong1, wrong2, wrong3, wrong4])].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intImproperNum}/${v.intImproperDen}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.intWhole} × ${v.intFracDen} + ${v.intFracNum} = ${v.intImproperNum}. Answer: **${v.intImproperNum}/${v.intImproperDen}** ✓`,
                incorrect: (v) => `Not quite! ${v.intWhole} × ${v.intFracDen} = ${v.intWhole * v.intFracDen}, then + ${v.intFracNum} = ${v.intImproperNum}. Answer: **${v.intImproperNum}/${v.intImproperDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Mixed → Improper: the recipe",
            body: () => `Three steps every time. Let's use **2 and 3/4** as an example:`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 11 }, (_, i) => ({
                    value: 1,
                    label: "1/4",
                    color: "#c084fc"
                  })),
                  totalLabel: "2 and 3/4 = 11/4 — 11 quarter-sized pieces"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1. Multiply: 2 × 4 = 8", why: "Whole number × bottom number = pieces in the whole parts" },
                    { text: "2. Add: 8 + 3 = 11", why: "Add the top number for the total pieces" },
                    { text: "3. Keep the bottom: 4", why: "The piece size doesn't change" },
                    { text: "So 2 and 3/4 = 11/4", result: "11/4 ✓" }
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
        id: "mixed-improper-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid the common multiply-and-forget-to-add error with mixed numbers", "When to watch out for writing the remainder (the amount left over after dividing) incorrectly as a mixed number (a whole number and a fraction together)"],
        variableSets: [
          {
            name: "Sophie",
            improperNum: 9, improperDen: 4,
            wrongWhole: 4, wrongFracNum: 9, wrongFracDen: 4,
            correctWhole: 2, correctFracNum: 1, correctFracDen: 4,
            mistake: "flipped it — put the denominator as the whole number",
            intImproperNum: 11, intImproperDen: 3, intCorrectWhole: 3, intCorrectFracNum: 2, intCorrectFracDen: 3
          },
          {
            name: "Tom",
            improperNum: 11, improperDen: 3,
            wrongWhole: 3, wrongFracNum: 2, wrongFracDen: 11,
            correctWhole: 3, correctFracNum: 2, correctFracDen: 3,
            mistake: "changed the denominator to 11 instead of keeping it as 3",
            intImproperNum: 17, intImproperDen: 5, intCorrectWhole: 3, intCorrectFracNum: 2, intCorrectFracDen: 5
          },
          {
            name: "Grace",
            improperNum: 7, improperDen: 2,
            wrongWhole: 3, wrongFracNum: 2, wrongFracDen: 2,
            correctWhole: 3, correctFracNum: 1, correctFracDen: 2,
            mistake: "got the remainder (the amount left over after dividing) wrong — said 2/2 instead of 1/2",
            intImproperNum: 13, intImproperDen: 4, intCorrectWhole: 3, intCorrectFracNum: 1, intCorrectFracDen: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} tried to convert **${v.improperNum}/${v.improperDen}** to a mixed number (a whole number and a fraction together) and got **${v.wrongWhole} ${v.wrongFracNum}/${v.wrongFracDen}**. What went wrong?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.improperNum }, (_, i) => ({
                  value: 1,
                  color: "#c084fc"
                })),
                totalLabel: `${v.improperNum}/${v.improperDen} = ${v.wrongWhole} ${v.wrongFracNum}/${v.wrongFracDen}?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide to convert!",
            body: (v) => `${v.name} ${v.mistake}. To convert an improper fraction (a fraction where the top number is bigger than the bottom): **divide** the top by the **denominator** (bottom number). The answer is the whole number, the remainder (the amount left over after dividing) is the new top number, the denominator stays the same!`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.improperNum }, (_, i) => ({
                    value: 1,
                    color: "#c084fc"
                  })),
                  totalLabel: `${v.improperNum}/${v.improperDen} = ${v.correctWhole} ${v.correctFracNum}/${v.correctFracDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.wrongWhole} ${v.wrongFracNum}/${v.wrongFracDen}`, why: v.mistake },
                    { text: `✓ ${v.improperNum} ÷ ${v.improperDen} = ${v.correctWhole} remainder ${v.correctFracNum}`, why: "Divide top by bottom" },
                    { text: `✓ ${v.improperNum}/${v.improperDen} = ${v.correctWhole} ${v.correctFracNum}/${v.correctFracDen}`, result: `${v.correctWhole} ${v.correctFracNum}/${v.correctFracDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `Convert ${v.intImproperNum}/${v.intImproperDen} to a mixed number (a whole number and a fraction together)`,
            body: (v) => `Divide ${v.intImproperNum} by ${v.intImproperDen}. What do you get?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intImproperNum }, (_, i) => ({
                  value: 1,
                  color: "#c084fc"
                })),
                totalLabel: `${v.intImproperNum}/${v.intImproperDen} = ?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intImproperNum}/${v.intImproperDen} = ?`,
              getOptions: (v) => {
                const correct = `${v.intCorrectWhole} ${v.intCorrectFracNum}/${v.intCorrectFracDen}`;
                const wrong1 = `${v.intCorrectWhole + 1} ${v.intCorrectFracNum}/${v.intCorrectFracDen}`;
                const wrong2 = `${v.intCorrectWhole} ${v.intCorrectFracNum + 1}/${v.intCorrectFracDen}`;
                const wrong3 = `${v.intCorrectWhole - 1} ${v.intCorrectFracNum}/${v.intCorrectFracDen}`;
                const wrong4 = `${v.intImproperDen} ${v.intCorrectFracNum}/${v.intImproperNum}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intCorrectWhole} ${v.intCorrectFracNum}/${v.intCorrectFracDen}`,
              feedback: {
                correct: (v) => `Perfect! ${v.intImproperNum} ÷ ${v.intImproperDen} = ${v.intCorrectWhole} r ${v.intCorrectFracNum}. Answer: **${v.intCorrectWhole} ${v.intCorrectFracNum}/${v.intCorrectFracDen}** ✓`,
                incorrect: (v) => `Not quite! ${v.intImproperNum} ÷ ${v.intImproperDen} = ${v.intCorrectWhole} remainder ${v.intCorrectFracNum}. Answer: **${v.intCorrectWhole} ${v.intCorrectFracNum}/${v.intCorrectFracDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Improper → Mixed: divide and keep!",
            body: () => `Divide the top by the bottom. The whole number is the answer, the remainder goes on top, and the bottom number **stays the same**.`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 11 }, (_, i) => ({
                    value: 1,
                    color: "#c084fc"
                  })),
                  totalLabel: "11/3 = 3 and 2/3 — divide 11 by 3"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Divide: top number ÷ bottom number", why: "Answer = whole number part" },
                    { text: "Remainder = new top number", why: "The leftover pieces" },
                    { text: "Denominator (the bottom number of a fraction) stays the same", why: "Piece size doesn't change!" },
                    { text: "Example: 11/3 → 11 ÷ 3 = 3 r 2 → 3 and 2/3", why: "Easy! ✓" }
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
  // SUB-CONCEPT 13: Multiplying Fractions
  // ==========================================
  {
    id: "multiplying-fractions",
    name: "Multiplying Fractions by Whole Numbers",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "multiplying-fractions-steps",
        templateType: "step-by-step",
        learningGoal: ["How to multiply a fraction by a whole number", "Why you only multiply the top number (numerator)"],
        variableSets: [
          {
            name: "Aisha",
            scenario: "eats 2/5 of a cake three times this week",
            fracNum: 2, fracDen: 5, wholeNum: 3,
            answerNum: 6, answerDen: 5,
            mixedWhole: 1, mixedFrac: 1,
            unit: "cake",
            intFracNum: 3, intFracDen: 7, intWholeNum: 2, intAnswerNum: 6, intAnswerDen: 7
          },
          {
            name: "Ben",
            scenario: "runs 3/4 of a mile every day for 2 days",
            fracNum: 3, fracDen: 4, wholeNum: 2,
            answerNum: 6, answerDen: 4,
            mixedWhole: 1, mixedFrac: 2,
            canSimplify: true, simNum: 3, simDen: 2,
            unit: "miles",
            intFracNum: 2, intFracDen: 9, intWholeNum: 4, intAnswerNum: 8, intAnswerDen: 9
          },
          {
            name: "Daisy",
            scenario: "uses 1/3 of a bottle of paint for each picture, painting 4 pictures",
            fracNum: 1, fracDen: 3, wholeNum: 4,
            answerNum: 4, answerDen: 3,
            mixedWhole: 1, mixedFrac: 1,
            unit: "bottles",
            intFracNum: 4, intFracDen: 5, intWholeNum: 3, intAnswerNum: 12, intAnswerDen: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ?`,
            body: (v) => `${v.name} ${v.scenario}. That's **${v.fracNum}/${v.fracDen} × ${v.wholeNum}**. How do we multiply a fraction by a whole number?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracDen }, (_, i) => ({
                  value: 1,
                  label: i < v.fracNum ? "✓" : "",
                  color: i < v.fracNum ? "#c084fc" : undefined,
                  empty: i >= v.fracNum
                })),
                totalLabel: `${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply the top, keep the bottom!",
            body: (v) => `When you multiply a fraction by a whole number, only the **numerator** (top number) changes. The **denominator** (bottom number) stays the same! If the answer is bigger than 1, convert it to a **mixed number** (a whole number and a fraction together).`,
            bodyParts: (v) => [
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.fracDen }, (_, i) => ({
                    value: 1,
                    label: i < v.fracNum ? "✓" : "",
                    color: i < v.fracNum ? "#c084fc" : undefined,
                    empty: i >= v.fracNum
                  })),
                  totalLabel: `${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.answerNum}/${v.answerDen}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.fracNum}/${v.fracDen} × ${v.wholeNum}`, why: "Multiply fraction by whole number" },
                    { text: `Multiply the top number: ${v.fracNum} × ${v.wholeNum} = ${v.answerNum}`, why: "Only the top changes" },
                    { text: `Keep the bottom number: ${v.fracDen}`, why: "The piece size stays the same" },
                    { text: `${v.fracNum} × ${v.wholeNum} = ${v.answerNum}, so the answer is ${v.answerNum}/${v.answerDen}`, result: `= ${v.mixedWhole} and ${v.mixedFrac}/${v.fracDen} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum}?`,
            body: (v) => `Multiply the top by ${v.intWholeNum}, keep the bottom the same!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracDen }, (_, i) => ({
                  value: 1,
                  label: i < v.intFracNum ? "✓" : "",
                  color: i < v.intFracNum ? "#c084fc" : undefined,
                  empty: i >= v.intFracNum
                })),
                totalLabel: `${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum} = ?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum} = ?`,
              getOptions: (v) => {
                const correct = `${v.intAnswerNum}/${v.intAnswerDen}`;
                const wrong1 = `${v.intFracNum}/${v.intFracDen * v.intWholeNum}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${v.intFracNum * v.intWholeNum}/${v.intFracDen * v.intWholeNum}`;
                const wrong4 = `${v.intAnswerNum - 1}/${v.intAnswerDen}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => `${v.intAnswerNum}/${v.intAnswerDen}`,
              feedback: {
                correct: (v) => `Brilliant! ${v.intFracNum} × ${v.intWholeNum} = ${v.intAnswerNum}, bottom number stays ${v.intFracDen}. Answer: **${v.intAnswerNum}/${v.intAnswerDen}** ✓`,
                incorrect: (v) => `Nearly! Only multiply the TOP: ${v.intFracNum} × ${v.intWholeNum} = ${v.intAnswerNum}. The bottom stays at ${v.intFracDen}. Answer: **${v.intAnswerNum}/${v.intAnswerDen}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiplying fractions by whole numbers",
            body: () => `The most common mistake is multiplying the bottom number too. Remember: **only the top number changes**!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 12 }, (_, i) => ({
                    value: 1,
                    color: "#c084fc"
                  })),
                  totalLabel: "3/5 × 4 = 12/5 — 12 fifth-sized pieces"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Multiply the NUMERATOR (the top number of a fraction) by the whole number", why: "More pieces of the same size" },
                    { text: "Keep the DENOMINATOR (the bottom number of a fraction) the same", why: "The piece size doesn't change" },
                    { text: "If the top is bigger than the bottom, it's improper!", why: "Convert to a mixed number (a whole number and a fraction together) if needed" },
                    { text: "Example: 3/5 × 4 = 12/5 = 2 and 2/5", why: "Multiply top, simplify if you can ✓" }
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
        id: "multiplying-fractions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid multiplying both the top and bottom numbers by the whole number", "When to watch out for forgetting to simplify the answer"],
        variableSets: [
          {
            name: "Tom",
            fracNum: 3, fracDen: 5, wholeNum: 4,
            wrongAnswer: "3/20", correctAnswer: "12/5",
            answerNum: 12, answerDen: 5,
            mistake: "multiplied the DENOMINATOR instead of the numerator",
            intFracNum: 5, intFracDen: 8, intWholeNum: 3, intAnswerNum: 15, intAnswerDen: 8, intCorrectAnswer: "15/8"
          },
          {
            name: "Holly",
            fracNum: 2, fracDen: 7, wholeNum: 3,
            wrongAnswer: "2/21", correctAnswer: "6/7",
            answerNum: 6, answerDen: 7,
            mistake: "multiplied the bottom by 3 instead of the top",
            intFracNum: 3, intFracDen: 4, intWholeNum: 5, intAnswerNum: 15, intAnswerDen: 4, intCorrectAnswer: "15/4"
          },
          {
            name: "Ravi",
            fracNum: 4, fracDen: 9, wholeNum: 2,
            wrongAnswer: "4/18", correctAnswer: "8/9",
            answerNum: 8, answerDen: 9,
            mistake: "multiplied the denominator by 2 instead of the numerator",
            intFracNum: 2, intFracDen: 3, intWholeNum: 4, intAnswerNum: 8, intAnswerDen: 3, intCorrectAnswer: "8/3"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} says **${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.wrongAnswer}**. The answer got *smaller*, not bigger! What went wrong?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.fracDen }, (_, i) => ({
                  value: 1,
                  label: i < v.fracNum ? "✓" : "",
                  color: i < v.fracNum ? "#c084fc" : undefined,
                  empty: i >= v.fracNum
                })),
                totalLabel: `${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.wrongAnswer}?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply the TOP, not the bottom!",
            body: (v) => `We need to multiply the **numerator** (top number), not the denominator (bottom number). Tap to see!`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.mistake}. Multiplying the **denominator** (bottom number) makes the pieces smaller.\nWe need to multiply the **numerator** (top number) instead.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: Array.from({ length: v.answerNum }, (_, i) => ({
                    value: 1,
                    color: "#c084fc"
                  })),
                  totalLabel: `${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.correctAnswer}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ ${v.name}: ${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.wrongAnswer}`, why: `Multiplied the bottom number instead of the top — WRONG` },
                    { text: `✓ Multiply the top number: ${v.fracNum} × ${v.wholeNum} = ${v.answerNum}`, why: "The bottom number stays the same" },
                    { text: `✓ ${v.fracNum}/${v.fracDen} × ${v.wholeNum} = ${v.correctAnswer}`, result: `${v.correctAnswer} ✓` }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What is ${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum}?`,
            body: (v) => `Multiply the TOP by ${v.intWholeNum}!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: v.intFracDen }, (_, i) => ({
                  value: 1,
                  label: i < v.intFracNum ? "✓" : "",
                  color: i < v.intFracNum ? "#c084fc" : undefined,
                  empty: i >= v.intFracNum
                })),
                totalLabel: `${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.intFracNum}/${v.intFracDen} × ${v.intWholeNum} = ?`,
              getOptions: (v) => {
                const correct = v.intCorrectAnswer;
                const wrong1 = `${v.intFracNum}/${v.intFracDen * v.intWholeNum}`;
                const wrong2 = `${v.intAnswerNum + 1}/${v.intAnswerDen}`;
                const wrong3 = `${v.intAnswerNum - 1}/${v.intAnswerDen}`;
                const wrong4 = `${v.intFracNum}/${v.intFracDen}`;
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.intFracNum} × ${v.intWholeNum} = ${v.intAnswerNum}, bottom number stays ${v.intAnswerDen}. Answer: **${v.intCorrectAnswer}** ✓`,
                incorrect: (v) => `Not quite! Multiply the TOP: ${v.intFracNum} × ${v.intWholeNum} = ${v.intAnswerNum}. Keep the bottom: ${v.intAnswerDen}. Answer: **${v.intCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Top goes up, bottom stays put!",
            body: () => `When multiplying a fraction by a whole number: **top number × whole number**, bottom number stays the same. If you multiply the bottom, you're making the pieces smaller — the opposite of what you want!`,
            bodyParts: () => [
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 7 }, (_, i) => ({
                    value: 1,
                    label: "1/7",
                    color: "#c084fc"
                  })),
                  totalLabel: "2/7 × 3 = 6/7 — multiply the top only!"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Multiply the NUMERATOR (the top number of a fraction) by the whole number", why: "More pieces" },
                    { text: "Keep the DENOMINATOR (the bottom number of a fraction) the same", why: "Same piece size!" },
                    { text: "Check: is your answer bigger than the fraction?", why: "It should be, since you're multiplying!" },
                    { text: "Simplify or convert to mixed number (a whole number and a fraction together) if needed", why: "e.g. 12/5 = 2 and 2/5 ✓" }
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
  // SUB-CONCEPT 14: Fraction Word Problems
  // ==========================================
  {
    id: "fraction-word-problems",
    name: "Fraction Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "fraction-word-problems-hook",
        templateType: "curiosity-hook",
        learningGoal: ["How to spot which type of calculation to use in a fractions word problem", "How to check your answer makes sense"],
        variableSets: [
          {
            name: "Lily",
            scenario: "Lily has £60. She spends 2/5 on a book and 1/4 on lunch.",
            question: "How much does she spend altogether?",
            step1Label: "2/5 of £60", step1Num: 2, step1Den: 5, step1Amount: 60, step1Answer: 24,
            step2Label: "1/4 of £60", step2Num: 1, step2Den: 4, step2Amount: 60, step2Answer: 15,
            finalAnswer: 39, unit: "£",
            operation: "Find each fraction of the amount, then add them",
            intScenario: "Tom has £80. He spends 1/4 on a book and 1/5 on lunch.",
            intQuestion: "How much does Tom spend altogether?",
            intStep1: "1/4 of £80 = £20", intStep2: "1/5 of £80 = £16",
            intFinalAnswer: 36, intUnit: "£", intOperation: "Find each fraction of the amount, then add them"
          },
          {
            name: "Marcus",
            scenario: "Marcus ran 3/4 of a 12 km race. He walked the rest.",
            question: "How far did he walk?",
            step1Label: "3/4 of 12", step1Num: 3, step1Den: 4, step1Amount: 12, step1Answer: 9,
            step2Label: "12 − 9", step2Num: 12, step2Den: 1, step2Amount: 9, step2Answer: 3,
            finalAnswer: 3, unit: "km",
            operation: "Find the fraction of the amount, then subtract from the total",
            intScenario: "Priya ran 2/3 of a 15 km race. She walked the rest.",
            intQuestion: "How far did she walk?",
            intStep1: "2/3 of 15 = 10", intStep2: "15 − 10 = 5",
            intFinalAnswer: 5, intUnit: "km", intOperation: "Find the fraction of the amount, then subtract from the total"
          },
          {
            name: "Aisha",
            scenario: "A bag has 36 sweets. Aisha takes 1/3, then Ben takes 1/4 of what's left.",
            question: "How many does Ben get?",
            step1Label: "1/3 of 36", step1Num: 1, step1Den: 3, step1Amount: 36, step1Answer: 12,
            step2Label: "1/4 of 24", step2Num: 1, step2Den: 4, step2Amount: 24, step2Answer: 6,
            finalAnswer: 6, unit: "sweets",
            operation: "Find the first fraction, work out what's left, then find the second fraction",
            intScenario: "A box has 40 chocolates. Mia takes 1/4, then Noah takes 1/3 of what's left.",
            intQuestion: "How many does Noah get?",
            intStep1: "1/4 of 40 = 10", intStep2: "1/3 of 30 = 10",
            intFinalAnswer: 10, intUnit: "chocolates", intOperation: "Find the first fraction, work out what's left, then find the second fraction"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What would you do?",
            body: (v) => `${v.scenario} ${v.question} This needs **more than one step**. Can you figure out the plan?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.scenario, why: v.question }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break it into steps!",
            body: (v) => `The trick with multi-step problems is to **break them down**. Do one fraction at a time! Tap to see the steps.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Step 1: ${v.step1Label}`, why: `${v.step1Amount} ÷ ${v.step1Den} × ${v.step1Num} = ${v.step1Answer}`, result: `= ${v.step1Answer}` },
                  { text: `Step 2: ${v.step2Label}`, why: `${v.step2Amount} ${v.step2Den === 1 ? `− ${v.step2Amount === v.step2Answer ? '' : v.step2Answer}` : `÷ ${v.step2Den} × ${v.step2Num}`} = ${v.step2Answer}`, result: `= ${v.step2Answer}` },
                  { text: `Step 3: ${v.step1Answer} ${v.step2Den === 1 ? '−' : '+'} ${v.step2Answer} = ${v.finalAnswer}`, why: "Combine the results", result: `${v.unit === '£' ? '£' + v.finalAnswer : v.finalAnswer + ' ' + v.unit} ✓` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the answer?",
            body: (v) => `${v.intScenario} ${v.intQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.intOperation, why: "Follow this plan!" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              getOptions: (v) => generateDistractors(v.intFinalAnswer),
              correctAnswer: (v) => v.intFinalAnswer,
              feedback: {
                correct: (v) => `Spot on! Breaking it into steps: ${v.intStep1}, then ${v.intStep2}. Answer: **${v.intFinalAnswer} ${v.intUnit}** ✓`,
                incorrect: (v) => `Not quite! ${v.intStep1}. Then ${v.intStep2}. Answer: **${v.intFinalAnswer} ${v.intUnit}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tackling fraction word problems",
            body: () => `Multi-step problems look scary, but they're just **small steps** chained together. Break it down and solve one bit at a time!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read carefully — what does the question ask?", why: "Underline the key information" },
                  { text: "Decide: what type of calculation do I need?", why: "'of' = multiply, 'altogether' = add, 'left' = subtract" },
                  { text: "Work step by step — one calculation at a time", why: "Don't try to do it all at once!" },
                  { text: "Check: does your answer make sense?", why: "Is it a reasonable amount? ✓" }
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
        id: "fraction-word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: ["How to avoid picking the wrong calculation in a fractions word problem", "When to watch out for answers that are bigger or smaller than they should be"],
        variableSets: [
          {
            name: "Jake",
            scenario: "A school has 120 pupils. 3/4 are girls.",
            question: "How many boys are there?",
            wrongAnswer: 90, wrongReason: "found 3/4 of 120 but forgot to subtract — 90 is the number of GIRLS",
            correctAnswer: 30,
            step1: "3/4 of 120 = 90 girls", step2: "120 − 90 = 30 boys",
            intScenario: "A class has 80 children. 3/5 are boys.",
            intQuestion: "How many girls are there?",
            intCorrectAnswer: 32,
            intStep1: "3/5 of 80 = 48 boys", intStep2: "80 − 48 = 32 girls"
          },
          {
            name: "Ella",
            scenario: "A recipe needs 3/5 of a kilogram of flour. Sophie is making double.",
            question: "How much flour does Sophie need?",
            wrongAnswer: 6, wrongReason: "multiplied the numerator AND denominator by 2 and then added them",
            correctAnswer: "6/5",
            step1: "3/5 × 2 = 6/5", step2: "6/5 = 1 and 1/5 kg",
            intScenario: "A recipe needs 2/7 of a kilogram of sugar. Liam is making triple.",
            intQuestion: "How much sugar does Liam need?",
            intCorrectAnswer: "6/7",
            intStep1: "2/7 × 3 = 6/7", intStep2: "6/7 kg"
          },
          {
            name: "Oscar",
            scenario: "Ben has 48 marbles. He gives 1/3 to Tom and 1/4 to Sam.",
            question: "How many does Ben keep?",
            wrongAnswer: 32, wrongReason: "only subtracted Tom's share (16) and forgot to subtract Sam's too",
            correctAnswer: 20,
            step1: "1/3 of 48 = 16 for Tom", step2: "1/4 of 48 = 12 for Sam, Ben keeps 48 − 16 − 12 = 20",
            intScenario: "Amy has 60 stickers. She gives 1/4 to Rosie and 1/3 to Jack.",
            intQuestion: "How many does Amy keep?",
            intCorrectAnswer: 25,
            intStep1: "1/4 of 60 = 15 for Rosie", intStep2: "1/3 of 60 = 20 for Jack, Amy keeps 60 − 15 − 20 = 25"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} get it right?`,
            body: (v) => `${v.scenario} ${v.question} ${v.name} says the answer is **${v.wrongAnswer}**. Let's check their working...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check the reasoning!",
            body: (v) => `${v.name} ${v.wrongReason}. Let's work through it properly step by step.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ ${v.name}'s mistake: ${v.wrongReason}`, why: "Easy trap to fall into" },
                  { text: `✓ Step 1: ${v.step1}`, why: "First calculation" },
                  { text: `✓ Step 2: ${v.step2}`, result: `Correct answer: ${v.correctAnswer} ✓` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: (v) => `What's the correct answer?`,
            body: (v) => `${v.intScenario} ${v.intQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Step 1: ${v.intStep1}` },
                  { text: `Step 2: ${v.intStep2}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              getOptions: (v) => {
                const correct = v.intCorrectAnswer;
                if (typeof correct === "number") {
                  return generateDistractors(correct);
                }
                const wrong1 = "3/7";
                const wrong2 = "2/3";
                const wrong3 = "4/7";
                const wrong4 = "1/7";
                return [correct, wrong1, wrong2, wrong3, wrong4].sort(() => Math.random() - 0.5);
              },
              correctAnswer: (v) => v.intCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! Working step by step: ${v.intStep1}, then ${v.intStep2}. Answer: **${v.intCorrectAnswer}** ✓`,
                incorrect: (v) => `Not quite! ${v.intStep1}. Then ${v.intStep2}. The correct answer is **${v.intCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoiding word problem traps",
            body: () => `The most common mistakes: doing the right calculation but **forgetting the last step**, or **adding fractions with different bottom numbers wrongly**. Always re-read the question at the end!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the question TWICE", why: "What exactly is it asking for?" },
                  { text: "Work step by step", why: "One calculation at a time" },
                  { text: "Re-read the question at the end", why: "Did you answer what they asked?" },
                  { text: "Check: is your answer sensible?", why: "Too big? Too small? Makes no sense? Go back and check! ✓" }
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

]; // END of fractionsSubConcepts array

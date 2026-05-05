// ============================================================
// Supplementary sub-concepts for Percentages
// To merge: add these to lessonBank.percentages.subConcepts array in lessonData.js
// ============================================================
import { generateDistractors } from '../lessonData.js';

export const percentagesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: percent-means-per-hundred
  // Understanding % = out of 100
  // Category: core
  // Lesson A: visual-discovery | Lesson B: key-fact
  // ==========================================
  {
    id: "percent-means-per-hundred",
    name: "Percent Means Per Hundred",
    category: "core",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "percent-per-hundred-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to understand what the % symbol means",
          "Why 50% is the same as half"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "counting coloured squares on a 100-square grid",
            shaded: 50, total: 100,
            fraction: "50/100", simplified: "1/2",
            word: "half",
            colour: "#c084fc",
            interactShaded: 30, interactTotal: 100, interactColour: "#fbbf24"
          },
          {
            name: "Ben",
            scenario: "filling a jar that holds exactly 100 marbles",
            shaded: 25, total: 100,
            fraction: "25/100", simplified: "1/4",
            word: "a quarter",
            colour: "#38bdf8",
            interactShaded: 40, interactTotal: 100, interactColour: "#34d399"
          },
          {
            name: "Chloe",
            scenario: "colouring squares on a hundred chart in class",
            shaded: 75, total: 100,
            fraction: "75/100", simplified: "3/4",
            word: "three quarters",
            colour: "#34d399",
            interactShaded: 60, interactTotal: 100, interactColour: "#818cf8"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.shaded}% actually mean?`,
            body: (v) => `${v.name} is ${v.scenario}. Out of **${v.total}** squares, **${v.shaded}** are coloured in.\n\nThat's **${v.shaded}%** — but where does the word "percent" come from?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.shaded, label: `${v.shaded} coloured`, color: v.colour },
                  { value: v.total - v.shaded, label: `${v.total - v.shaded} empty`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.total} squares total`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Per cent = per hundred!",
            body: (v) => `The word **percent** comes from Latin: **per centum**, meaning **"out of one hundred"**. Tap each step to see how a percentage becomes a fraction!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.shaded}% means "${v.shaded} out of 100"`, why: "Per cent = per hundred" },
                  { text: `As a fraction: ${v.fraction}`, why: "The percentage goes over 100" },
                  { text: `Simplified: ${v.simplified} = ${v.word}`, result: `${v.shaded}% = ${v.word} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `"Per cent" comes from Latin meaning "out of ____"`,
              options: (v) => ["ten", "hundred", "thousand", "fifty"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! "Cent" means hundred — like century or centimetre. ✓`,
                incorrect: (v) => `Not quite — "cent" means hundred, like century!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `If ${v.interactShaded} squares out of 100 are coloured, what percentage is that?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactShaded, label: "?%", color: v.interactColour },
                  { value: v.interactTotal - v.interactShaded, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactTotal} squares total`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactShaded} out of 100 = what percentage?`,
              getOptions: (v) => generateDistractors(v.interactShaded),
              correctAnswer: (v) => v.interactShaded,
              feedback: {
                correct: (v) => `Yes! ${v.interactShaded} out of 100 = **${v.interactShaded}%**. "Per cent" literally means "out of 100"! ✓`,
                incorrect: (v) => `Not quite! The number out of 100 IS the percentage. ${v.interactShaded} out of 100 = **${v.interactShaded}%**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Percent = out of 100",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever you see the **%** symbol, just remember: it means **out of 100**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 37, label: "37%", color: "#c084fc" },
                    { value: 63, label: "63%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "100% = the whole thing",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Per cent means 'per hundred' (out of 100)", why: "From Latin: per centum" },
                    { text: "The % number tells you how many out of 100", why: "37% = 37 out of 100, 82% = 82 out of 100" },
                    { text: "100% means ALL of it (100 out of 100)", why: "And 0% means none of it ✓" }
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
        id: "percent-per-hundred-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to apply the 'out of 100' idea to real-life situations",
          "When to watch out for confusing a percentage with a fraction"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "scoring on a test with 100 questions",
            shaded: 80, total: 100,
            fraction: "80/100", simplified: "4/5",
            simplifyBy: 20,
            word: "four fifths",
            colour: "#818cf8",
            interactShaded: 40, interactFraction: "40/100", interactSimplified: "2/5", interactWord: "two fifths"
          },
          {
            name: "Mia",
            scenario: "eating chocolates from a box of 100",
            shaded: 10, total: 100,
            fraction: "10/100", simplified: "1/10",
            simplifyBy: 10,
            word: "one tenth",
            colour: "#f87171",
            interactShaded: 20, interactFraction: "20/100", interactSimplified: "1/5", interactWord: "one fifth"
          },
          {
            name: "Hassan",
            scenario: "planting seeds in a tray with 100 cells",
            shaded: 60, total: 100,
            fraction: "60/100", simplified: "3/5",
            simplifyBy: 20,
            word: "three fifths",
            colour: "#34d399",
            interactShaded: 50, interactFraction: "50/100", interactSimplified: "1/2", interactWord: "a half"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.shaded}% really mean?`,
            body: (v) => `${v.name} is ${v.scenario}. **${v.shaded}** out of **${v.total}** — that's **${v.shaded}%**.\n\nBut why do we use 100? Let's find out!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.shaded, label: `${v.shaded}%`, color: v.colour },
                  { value: v.total - v.shaded, label: `${v.total - v.shaded}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: "100% = the whole thing",
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Key fact: % always means out of 100",
            body: (v) => `Using 100 as a common base makes comparing amounts easy. Is 3/7 bigger than 5/12? Hard to tell! But 43% vs 42%? Easy! Tap to see how this works.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.shaded}% = ${v.shaded} out of 100`, why: "The % symbol means 'per hundred'" },
                  { text: `As a fraction: ${v.fraction}`, why: `Divide top and bottom by ${v.simplifyBy}: ${v.shaded} \u00f7 ${v.simplifyBy} = ${v.simplified.split('/')[0]}, 100 \u00f7 ${v.simplifyBy} = ${v.simplified.split('/')[1]}`, result: `${v.simplified} (${v.word})` },
                  { text: "100 is a handy base for comparing", why: "Everything over the same denominator (bottom number) ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Quick check!",
            body: (v) => `What fraction is the same as **${v.interactShaded}%**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactShaded, label: `${v.interactShaded}%`, color: v.colour },
                  { value: v.total - v.interactShaded, label: "", color: "#e5e7eb", empty: true }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactShaded}% is the same as which fraction?`,
              getOptions: (v) => [v.interactSimplified, `${v.interactShaded}/10`, `1/${v.interactShaded}`, `${v.total}/${v.interactShaded}`, `${v.interactShaded}/1000`],
              correctAnswer: (v) => v.interactSimplified,
              feedback: {
                correct: (v) => `Spot on! ${v.interactShaded}% = ${v.interactFraction} = **${v.interactSimplified}** (${v.interactWord}). ✓`,
                incorrect: (v) => `Not quite! ${v.interactShaded}% means ${v.interactShaded} out of 100 = ${v.interactFraction} = **${v.interactSimplified}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember: per cent = per hundred",
            bodyParts: [
              {
                type: 'text',
                content: () => `The **%** symbol is your friend. It always means the same thing: **how many out of 100**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 50, label: "50% = 1/2", color: "#818cf8" },
                    { value: 50, label: "50%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "100% = the whole amount",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "% means 'out of 100'", why: "Per centum = per hundred (Latin)" },
                    { text: "To write a % as a fraction, put it over 100", why: "45% = 45/100, then simplify if you can" },
                    { text: "100% = the whole thing, 0% = nothing", why: "50% = exactly half ✓" }
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
  // SUB-CONCEPT 2: common-percentages
  // Key equivalences: 50%=1/2, 25%=1/4, etc.
  // Category: core
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "common-percentages",
    name: "Key Percentage Equivalences",
    category: "core",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "common-percentages-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to recall which fractions match the most useful percentages",
          "How to quickly recall 50%, 25%, 10%, 75%, 20%"
        ],
        variableSets: [
          {
            name: "Lauren",
            scenario: "learning quick tricks for her 11+ exam",
            percent: 50, fraction: "1/2", decimal: 0.5,
            word: "half", divideBy: 2,
            amount: 80, answer: 40,
            colour: "#c084fc",
            interactAmount: 120, interactAnswer: 60
          },
          {
            name: "Daisy",
            scenario: "working out sale prices quickly in her head",
            percent: 25, fraction: "1/4", decimal: 0.25,
            word: "a quarter", divideBy: 4,
            amount: 60, answer: 15,
            colour: "#38bdf8",
            interactAmount: 80, interactAnswer: 20
          },
          {
            name: "Evie",
            scenario: "checking how much tip to leave at a restaurant",
            percent: 10, fraction: "1/10", decimal: 0.1,
            word: "a tenth", divideBy: 10,
            amount: 90, answer: 9,
            colour: "#34d399",
            interactAmount: 70, interactAnswer: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The ${v.percent}% shortcut!`,
            body: (v) => `${v.name} is ${v.scenario}. She needs **${v.percent}%** of **${v.amount}**.\n\nGood news: **${v.percent}%** = **${v.fraction}** = ${v.word}. So just **divide by ${v.divideBy}**!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percent, label: `${v.percent}% = ${v.fraction}`, color: v.colour },
                  { value: 100 - v.percent, label: `${100 - v.percent}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.percent}% of ${v.amount} = ?`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The five percentages to memorise",
            body: (v) => `You saw that **${v.percent}%** of **${v.amount}** = ${v.amount} ÷ ${v.divideBy} = **${v.answer}**. That works because ${v.percent}% = ${v.fraction}. There are **five** key percentages like this — memorise them and you'll be much faster! Tap to reveal each one.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "50% = 1/2", why: "Divide by 2 (halve it)", result: "50% of 80 = 40" },
                  { text: "25% = 1/4", why: "Divide by 4 (quarter it)", result: "25% of 80 = 20" },
                  { text: "75% = 3/4", why: "Find 25% then multiply by 3", result: "75% of 80 = 60" },
                  { text: "10% = 1/10", why: "Divide by 10", result: "10% of 80 = 8" },
                  { text: "20% = 1/5", why: "Divide by 5 (or double 10%)", result: "20% of 80 = 16" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "50%", right: "1/2" },
                { left: "25%", right: "1/4" },
                { left: "10%", right: "1/10" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Use the shortcut!",
            body: (v) => `**${v.percent}%** of **${v.interactAmount}** = **${v.fraction}** of ${v.interactAmount}.\n\nThat means: ${v.interactAmount} ÷ ${v.divideBy} = ?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percent, label: `${v.percent}%`, color: v.colour },
                  { value: 100 - v.percent, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactAmount} total`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.percent}% of ${v.interactAmount}?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.percent}% = ${v.fraction}, so ${v.interactAmount} ÷ ${v.divideBy} = **${v.interactAnswer}**! ✓`,
                incorrect: (v) => `Not quite! ${v.percent}% = ${v.fraction}, so divide by ${v.divideBy}: ${v.interactAmount} ÷ ${v.divideBy} = **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Five percentages to know by heart!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Memorise these and you'll solve percentage questions much faster:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 25, label: "25%", color: "#c084fc" },
                    { value: 25, label: "25%", color: "#818cf8" },
                    { value: 25, label: "25%", color: "#38bdf8" },
                    { value: 25, label: "25%", color: "#34d399" }
                  ],
                  totalLabel: "100% split into quarters",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "50% = 1/2 → divide by 2", why: "The most common percentage" },
                    { text: "25% = 1/4 → divide by 4", why: "Half of a half" },
                    { text: "75% = 3/4 → find 25%, then ×3", why: "Three quarters" },
                    { text: "10% = 1/10 → divide by 10", why: "Your main building block" },
                    { text: "20% = 1/5 → divide by 5 (or double 10%)", why: "One fifth ✓" }
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
        id: "common-percentages-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid mixing up common percentage-fraction pairs",
          "When to watch out for confusing 25% with 20% or 75% with 50%"
        ],
        variableSets: [
          {
            name: "Jake",
            percent: 25, amount: 80,
            wrongAnswer: 8, correctAnswer: 20,
            wrongMethod: "divided 80 by 10 instead of 4",
            mistake: "confused 25% with 10% — he divided by 10 instead of by 4",
            correctFraction: "1/4",
            interactPercent: 10, interactAmount: 60, interactCorrectAnswer: 6, interactFraction: "1/10"
          },
          {
            name: "Rosie",
            percent: 75, amount: 60,
            wrongAnswer: 15, correctAnswer: 45,
            wrongMethod: "found 25% (which is 15) but forgot to multiply by 3",
            mistake: "found a quarter but didn't multiply by 3 to get three quarters",
            correctFraction: "3/4",
            interactPercent: 50, interactAmount: 90, interactCorrectAnswer: 45, interactFraction: "1/2"
          },
          {
            name: "Alfie",
            percent: 20, amount: 50,
            wrongAnswer: 25, correctAnswer: 10,
            wrongMethod: "found 50% instead of 20%",
            mistake: "mixed up 20% and 50% — he halved instead of dividing by 5",
            correctFraction: "1/5",
            interactPercent: 25, interactAmount: 40, interactCorrectAnswer: 10, interactFraction: "1/4"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} get ${v.percent}% of ${v.amount} right?`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} says **${v.percent}% of ${v.amount} = ${v.wrongAnswer}**.\n\nDoes that look right to you?`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: [
                    { value: v.percent, label: `${v.percent}%`, color: "#c084fc" },
                    { value: 100 - v.percent, label: `${100 - v.percent}%`, color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: `Total: ${v.amount}`,
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s answer: ${v.percent}% of ${v.amount} = ${v.wrongAnswer}`, why: "Is this correct?" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake!",
            body: (v) => `${v.name} ${v.mistake}. The most common error is confusing which fraction goes with which percentage. Tap to see where it went wrong!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.name} ${v.wrongMethod}`, why: `Got ${v.wrongAnswer} — incorrect!` },
                  { text: `${v.percent}% = ${v.correctFraction}`, why: "This is the correct equivalence" },
                  { text: `${v.correctFraction} of ${v.amount} = ${v.correctAnswer}`, result: `The correct answer is ${v.correctAnswer} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `Now you know the mistake, what is **${v.interactPercent}%** of **${v.interactAmount}** really?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercent, label: `${v.interactPercent}%`, color: "#c084fc" },
                  { value: 100 - v.interactPercent, label: `${100 - v.interactPercent}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `Total: ${v.interactAmount}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactPercent}% of ${v.interactAmount}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! ${v.interactPercent}% = ${v.interactFraction}, so ${v.interactFraction} of ${v.interactAmount} = **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.interactFraction}. ${v.interactFraction} of ${v.interactAmount} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't mix up your percentages!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common mistake is confusing which percentage goes with which fraction.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 25, label: "25% = 1/4", color: "#818cf8" },
                    { value: 25, label: "50% = 1/2", color: "#38bdf8" },
                    { value: 25, label: "75% = 3/4", color: "#34d399" },
                    { value: 25, label: "100%", color: "#fbbf24" }
                  ],
                  totalLabel: "100% split into quarters",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "50% = 1/2 (divide by 2)", why: "Half — the most common one!" },
                    { text: "10% = 1/10 (divide by 10)", why: "Don't confuse with 25%!" },
                    { text: "25% = 1/4 (divide by 4)", why: "A quarter, not a tenth" },
                    { text: "75% = 3/4 (find 25% then × 3)", why: "Don't stop at just 25%!" },
                    { text: "20% = 1/5 (divide by 5)", why: "Don't confuse with 50% ✓" }
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
  // SUB-CONCEPT 3: finding-10-percent
  // Finding 10% by dividing by 10
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "finding-10-percent",
    name: "Finding 10% by Dividing by 10",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "finding-10-percent-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to find 10% of any number by dividing by 10",
          "Why 10% is the building block for all other percentages"
        ],
        variableSets: [
          {
            name: "Mrs Patel",
            scenario: "works out the 10% service charge on a restaurant bill of",
            amount: 60, tenPercent: 6,
            unit: "\u00a3", unitAfter: "",
            interactAmount: 90, interactTenPercent: 9, interactUnit: "\u00a3", interactUnitAfter: ""
          },
          {
            name: "Tom",
            scenario: "wants to save 10% of his birthday money. He got",
            amount: 150, tenPercent: 15,
            unit: "\u00a3", unitAfter: "",
            interactAmount: 200, interactTenPercent: 20, interactUnit: "\u00a3", interactUnitAfter: ""
          },
          {
            name: "Priya",
            scenario: "reads that 10% of the pupils in her school are left-handed. There are",
            amount: 240, tenPercent: 24,
            unit: "", unitAfter: " pupils",
            interactAmount: 180, interactTenPercent: 18, interactUnit: "", interactUnitAfter: " pupils"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is 10% of ${v.unit}${v.amount}?`,
            body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.amount}${v.unitAfter}**.\n\nFinding **10%** is one of the most useful skills in maths. And it's surprisingly easy!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: 10 }, (_, i) => ({
                  value: 1,
                  label: i === 0 ? "10%" : "",
                  color: i === 0 ? "#c084fc" : "#e5e7eb",
                  empty: i > 0
                })),
                totalLabel: `${v.unit}${v.amount}${v.unitAfter} split into 10 equal parts`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Just divide by 10!",
            body: (v) => `Finding 10% is the single most useful percentage trick — and it is surprisingly simple. Tap each step to learn the method!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "10% means 10 out of 100", why: "Which simplifies to 1/10" },
                  { text: `To find 1/10, divide by 10`, why: "Move every digit one place to the right" },
                  { text: `${v.unit}${v.amount} ÷ 10 = ${v.unit}${v.tenPercent}`, result: `10% of ${v.unit}${v.amount} = ${v.unit}${v.tenPercent} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To find 10% of any number, divide by ____`,
              options: (v) => ["2", "5", "10", "100"],
              correctIndex: (v) => 2,
              feedback: {
                correct: (v) => `Yes! 10% = 1/10, so just divide by 10. ✓`,
                incorrect: (v) => `Not quite — 10% is the same as 1/10, so you divide by 10.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **10%** of **${v.interactUnit}${v.interactAmount}${v.interactUnitAfter}**?\n\nRemember: just divide by 10!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 10, label: "10%", color: "#c084fc" },
                  { value: 90, label: "90%", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactUnit}${v.interactAmount}${v.interactUnitAfter}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is 10% of ${v.interactUnit}${v.interactAmount}?`,
              getOptions: (v) => generateDistractors(v.interactTenPercent),
              correctAnswer: (v) => v.interactTenPercent,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactUnit}${v.interactAmount} ÷ 10 = **${v.interactUnit}${v.interactTenPercent}**. Easy when you know the trick! ✓`,
                incorrect: (v) => `Not quite! To find 10%, divide by 10: ${v.interactUnit}${v.interactAmount} ÷ 10 = **${v.interactUnit}${v.interactTenPercent}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding 10% — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `This is the most important percentage trick to learn. You'll use it for almost every percentage question!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 10 }, (_, i) => ({
                    value: 1,
                    label: i === 0 ? "10%" : "",
                    color: i === 0 ? "#c084fc" : "#e5e7eb",
                    empty: i > 0
                  })),
                  totalLabel: "10% = one tenth of the whole bar",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "10% = 1/10 = divide by 10", why: "Move every digit one place to the right" },
                    { text: "Works for any number!", why: "10% of 350 = 35, 10% of 42 = 4.2" },
                    { text: "10% is your building block", why: "Once you know 10%, you can find 20%, 30%, 5% and more ✓" }
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
        id: "finding-10-percent-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply the divide-by-10 shortcut to real-life percentage problems",
          "When to watch out for dividing by the wrong number to find 10%"
        ],
        variableSets: [
          {
            name: "A pizza restaurant",
            scenario: "adds a 10% tip to every bill automatically",
            amount: 80, tenPercent: 8,
            unit: "\u00a3", unitAfter: "",
            interactAmount: 110, interactTenPercent: 11, interactUnit: "\u00a3", interactUnitAfter: ""
          },
          {
            name: "A sports shop",
            scenario: "takes 10% off everything for their summer sale",
            amount: 120, tenPercent: 12,
            unit: "\u00a3", unitAfter: "",
            interactAmount: 70, interactTenPercent: 7, interactUnit: "\u00a3", interactUnitAfter: ""
          },
          {
            name: "A school",
            scenario: "discovers that 10% of its pupils walk to school. There are",
            amount: 350, tenPercent: 35,
            unit: "", unitAfter: " pupils",
            interactAmount: 420, interactTenPercent: 42, interactUnit: "", interactUnitAfter: " pupils"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The one trick that unlocks ALL percentages!",
            body: (v) => `${v.name} ${v.scenario}: **${v.unit}${v.amount}${v.unitAfter}**.\n\nWhat if we told you there's **one simple trick** that lets you find lots of different percentages? It all starts with 10%...`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: 10 }, (_, i) => ({
                  value: 1,
                  label: i === 0 ? "?" : "",
                  color: i === 0 ? "#fbbf24" : "#e5e7eb",
                  empty: i > 0
                })),
                totalLabel: `${v.unit}${v.amount}${v.unitAfter} — what is one piece worth?`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide by 10 — that's it!",
            body: (v) => `**10%** equals one tenth — and finding a tenth is the easiest division there is. Once you know this trick, you can build up to almost any percentage. Tap to see it in action!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `10% of ${v.unit}${v.amount}`, why: `${v.unit}${v.amount} ÷ 10` , result: `= ${v.unit}${v.tenPercent}` },
                  { text: `20% = two lots of 10%`, why: `${v.unit}${v.tenPercent} × 2`, result: `= ${v.unit}${v.tenPercent * 2}` },
                  { text: `5% = half of 10%`, why: `${v.unit}${v.tenPercent} ÷ 2`, result: `= ${v.unit}${v.tenPercent / 2}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Try it yourself!",
            body: (v) => `What is **10%** of **${v.interactUnit}${v.interactAmount}${v.interactUnitAfter}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 10, label: "10%?", color: "#fbbf24" },
                  { value: 90, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactUnit}${v.interactAmount}${v.interactUnitAfter}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `10% of ${v.interactUnit}${v.interactAmount} = ?`,
              getOptions: (v) => generateDistractors(v.interactTenPercent),
              correctAnswer: (v) => v.interactTenPercent,
              feedback: {
                correct: (v) => `Yes! ${v.interactUnit}${v.interactAmount} ÷ 10 = **${v.interactUnit}${v.interactTenPercent}**. You've unlocked the master building block! ✓`,
                incorrect: (v) => `Not quite! Divide by 10: ${v.interactUnit}${v.interactAmount} ÷ 10 = **${v.interactUnit}${v.interactTenPercent}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "10% is the master building block!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Once you can find 10%, the rest is just adding and halving:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 10, label: "10%", color: "#c084fc" },
                    { value: 10, label: "10%", color: "#818cf8" },
                    { value: 10, label: "10%", color: "#38bdf8" },
                    { value: 70, label: "70%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "30% = three lots of 10%",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "10% = divide by 10", why: "This is the one trick you MUST know" },
                    { text: "From 10% you can get 20% (×2), 30% (×3), etc.", why: "Just multiply your 10% answer" },
                    { text: "From 10% you can get 5% (halve it)", why: "And even 1% by dividing 10% by 10 ✓" }
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
  // SUB-CONCEPT 4: building-percentages
  // Building other %s from 10% and 1%
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "building-percentages",
    name: "Building Percentages from 10% and 1%",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "building-percentages-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to build lots of different percentages from 10% and 1% blocks",
          "How to find 5% (half of 10%) and 1% (divide by 100)"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "works out a 35% discount on a coat costing",
            amount: 200, targetPercent: 35,
            tenPercent: 20, fivePercent: 10, onePercent: 2,
            buildDesc: "3 lots of 10% + one 5%",
            buildCalc: "3 \u00d7 20 + 10",
            answer: 70,
            unit: "\u00a3", unitAfter: "",
            interactAmount: 300, interactTargetPercent: 25, interactTenPercent: 30, interactFivePercent: 15, interactOnePercent: 3, interactBuildDesc: "2 lots of 10% + one 5%", interactBuildCalc: "2 \u00d7 30 + 15", interactAnswer: 75, interactUnit: "\u00a3", interactUnitAfter: ""
          },
          {
            name: "Ben",
            scenario: "calculates that 22% of his class brought packed lunch. There are",
            amount: 150, targetPercent: 22,
            tenPercent: 15, fivePercent: 7.5, onePercent: 1.5,
            buildDesc: "2 lots of 10% + 2 lots of 1%",
            buildCalc: "2 \u00d7 15 + 2 \u00d7 1.5",
            answer: 33,
            unit: "", unitAfter: " pupils",
            interactAmount: 200, interactTargetPercent: 15, interactTenPercent: 20, interactFivePercent: 10, interactOnePercent: 2, interactBuildDesc: "1 lot of 10% + one 5%", interactBuildCalc: "20 + 10", interactAnswer: 30, interactUnit: "", interactUnitAfter: " pupils"
          },
          {
            name: "Chloe",
            scenario: "needs to score at least 45% on her practice test out of",
            amount: 80, targetPercent: 45,
            tenPercent: 8, fivePercent: 4, onePercent: 0.8,
            buildDesc: "4 lots of 10% + one 5%",
            buildCalc: "4 \u00d7 8 + 4",
            answer: 36,
            unit: "", unitAfter: " marks",
            interactAmount: 60, interactTargetPercent: 30, interactTenPercent: 6, interactFivePercent: 3, interactOnePercent: 0.6, interactBuildDesc: "3 lots of 10%", interactBuildCalc: "3 \u00d7 6", interactAnswer: 18, interactUnit: "", interactUnitAfter: " marks"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How do you find ${v.targetPercent}%?`,
            body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.amount}${v.unitAfter}**.\n\nYou might not know ${v.targetPercent}% straight away, but you DO know how to find 10%. Let's build up from there!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.targetPercent, label: `${v.targetPercent}%`, color: "#c084fc" },
                  { value: 100 - v.targetPercent, label: `${100 - v.targetPercent}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.unit}${v.amount}${v.unitAfter}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `Build ${v.targetPercent}% from blocks`,
            body: (v) => `Any percentage can be built from just three building blocks: **10%**, **5%**, and **1%**. Tap to see how they combine to make ${v.targetPercent}%.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `10% of ${v.unit}${v.amount} = ${v.unit}${v.tenPercent}`, why: `${v.unit}${v.amount} \u00f7 10` },
                  { text: `5% = ${v.unit}${v.fivePercent}`, why: `Half of ${v.unit}${v.tenPercent}` },
                  { text: `1% = ${v.unit}${v.onePercent}`, why: `${v.unit}${v.amount} \u00f7 100` },
                  { text: `${v.targetPercent}% = ${v.buildDesc}`, why: v.buildCalc, result: `= ${v.unit}${v.answer} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactTargetPercent}%** of **${v.interactUnit}${v.interactAmount}${v.interactUnitAfter}**?\n\n10% = ${v.interactUnit}${v.interactTenPercent}, 5% = ${v.interactUnit}${v.interactFivePercent}, 1% = ${v.interactUnit}${v.interactOnePercent}. Build it up!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: Array.from({ length: 10 }, (_, i) => ({
                  value: 1,
                  label: i === 0 ? `${v.interactUnit}${v.interactTenPercent}` : "",
                  color: i < Math.floor(v.interactTargetPercent / 10) ? "#c084fc" : "#e5e7eb",
                  empty: i >= Math.floor(v.interactTargetPercent / 10)
                })),
                totalLabel: `Build up to ${v.interactTargetPercent}%`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactTargetPercent}% of ${v.interactUnit}${v.interactAmount}?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTargetPercent}% = ${v.interactBuildDesc} = ${v.interactBuildCalc} = **${v.interactUnit}${v.interactAnswer}${v.interactUnitAfter}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactTargetPercent}% = ${v.interactBuildDesc}. That's ${v.interactBuildCalc} = **${v.interactUnit}${v.interactAnswer}${v.interactUnitAfter}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Building lots of different percentages — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `Once you know 10%, 5% and 1%, you can find lots of different percentages:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 10, label: "10%", color: "#c084fc" },
                    { value: 10, label: "10%", color: "#c084fc" },
                    { value: 10, label: "10%", color: "#c084fc" },
                    { value: 5, label: "5%", color: "#818cf8" },
                    { value: 65, label: "65%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "35% = 3 \u00d7 10% + 5%",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Find 10% (divide by 10)", why: "Your main building block" },
                    { text: "Step 2: Find 5% (halve your 10%)", why: "Useful for percentages ending in 5" },
                    { text: "Step 3: Find 1% (divide by 100)", why: "For odd percentages like 3% or 17%" },
                    { text: "Step 4: Combine blocks to reach the target", why: "e.g. 35% = 3\u00d710% + 5%, 17% = 10% + 5% + 2\u00d71% \u2713" }
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
        id: "building-percentages-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid errors when combining 10% and 1% blocks",
          "When to watch out for using the wrong building blocks for a percentage"
        ],
        variableSets: [
          {
            name: "Jake",
            amount: 300, targetPercent: 30,
            wrongAnswer: 9, correctAnswer: 90,
            tenPercent: 30,
            mistake: "found 1% instead of 10% — he divided by 100 instead of by 10, then multiplied by 3",
            wrongMethod: "300 \u00f7 100 = 3, then 3 \u00d7 3 = 9",
            interactAmount: 200, interactTargetPercent: 20, interactCorrectAnswer: 40, interactTenPercent: 20
          },
          {
            name: "Rosie",
            amount: 160, targetPercent: 15,
            wrongAnswer: 21, correctAnswer: 24,
            tenPercent: 16,
            mistake: "found 10% correctly (16) but then added 5 instead of finding 5% (which is half of 16 = 8)",
            wrongMethod: "10% = 16, then 16 + 5 = 21 instead of 16 + 8 = 24",
            interactAmount: 240, interactTargetPercent: 25, interactCorrectAnswer: 60, interactTenPercent: 24
          },
          {
            name: "Alfie",
            amount: 400, targetPercent: 35,
            wrongAnswer: 200, correctAnswer: 140,
            tenPercent: 40,
            mistake: "built 35% as 3\u00d710% + 5%, but found 5% by dividing 400 by 5 instead of halving 10%",
            wrongMethod: "3 \u00d7 40 = 120, then 400 \u00f7 5 = 80, total = 200",
            interactAmount: 500, interactTargetPercent: 15, interactCorrectAnswer: 75, interactTenPercent: 50
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s error?`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} tried to find **${v.targetPercent}% of ${v.amount}** but got it wrong.\n\n${v.name}'s working: ${v.wrongMethod}\n\nWhat went wrong?`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: [
                    { value: v.targetPercent, label: `${v.targetPercent}%`, color: "#c084fc" },
                    { value: 100 - v.targetPercent, label: "", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: `Total: ${v.amount}`,
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s working: ${v.wrongMethod}`, why: "Can you see the mistake?" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong!",
            body: (v) => `${v.name} ${v.mistake}. The building blocks must be found correctly first — one wrong block throws off the entire calculation. Tap to see the right way.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `10% of ${v.amount} = ${v.tenPercent}`, why: `${v.amount} ÷ 10` },
                  { text: `5% = ${v.tenPercent / 2}`, why: `Half of ${v.tenPercent}` },
                  { text: `1% = ${v.amount / 100}`, why: `${v.amount} ÷ 100` },
                  { text: `Correct answer: ${v.correctAnswer}`, result: `${v.targetPercent}% of ${v.amount} = ${v.correctAnswer} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find 10%: ${v.amount} ÷ 10 = ${v.tenPercent}`,
                `Find 5%: half of ${v.tenPercent} = ${v.tenPercent / 2}`,
                `Find 1%: ${v.amount} ÷ 100 = ${v.amount / 100}`,
                `Build ${v.targetPercent}%: ${v.correctAnswer}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the building blocks first, then combine. ✓`,
                incorrect: (v) => `Not quite — always start with 10%, then build 5% and 1% from it.`
              }
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `What is **${v.interactTargetPercent}%** of **${v.interactAmount}**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactTargetPercent, label: `${v.interactTargetPercent}%`, color: "#c084fc" },
                  { value: 100 - v.interactTargetPercent, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `Total: ${v.interactAmount}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactTargetPercent}% of ${v.interactAmount} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.interactTargetPercent}% of ${v.interactAmount} = **${v.interactCorrectAnswer}**. Build from 10%, not from shortcuts that don't work! ✓`,
                incorrect: (v) => `Not quite! 10% = ${v.interactTenPercent}. Build up: **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Common building-block mistakes",
            bodyParts: [
              {
                type: 'text',
                content: () => `Watch out for these traps when building percentages:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: Array.from({ length: 10 }, (_, i) => ({
                    value: 1,
                    label: i === 0 ? "10%" : i === 4 ? "5%" : "",
                    color: i === 0 ? "#c084fc" : i < 5 ? "#818cf8" : "#e5e7eb",
                    empty: i >= 5
                  })),
                  totalLabel: "10% = \u00f7 10, not \u00f7 100. 5% = half of 10%.",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "10% = divide by 10, NOT by 100", why: "Dividing by 100 gives you 1%, not 10%!" },
                    { text: "5% = HALF of 10%, not the amount \u00f7 5", why: "\u00f7 5 gives you 20%, not 5%" },
                    { text: "Always find 10% first, then build from there", why: "10% is the safe starting point for everything \u2713" }
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
  // SUB-CONCEPT 5: express-as-percentage
  // Expressing one number as % of another
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "express-as-percentage",
    name: "Expressing One Number as a Percentage of Another",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "express-as-percentage-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to express one number as a percentage of another",
          "Why you divide and then multiply by 100"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "scored 18 out of 25 on her spelling test",
            part: 18, whole: 25,
            division: 0.72, answer: 72,
            unit: "marks",
            interactPart: 14, interactWhole: 20, interactDivision: 0.7, interactAnswer: 70
          },
          {
            name: "Tom",
            scenario: "saved \u00a336 out of his \u00a3120 birthday money",
            part: 36, whole: 120,
            division: 0.3, answer: 30,
            unit: "pounds",
            interactPart: 21, interactWhole: 60, interactDivision: 0.35, interactAnswer: 35
          },
          {
            name: "Mia",
            scenario: "ate 6 out of the 20 biscuits in the tin",
            part: 6, whole: 20,
            division: 0.3, answer: 30,
            unit: "biscuits",
            interactPart: 9, interactWhole: 25, interactDivision: 0.36, interactAnswer: 36
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.part} out of ${v.whole} — what percentage?`,
            body: (v) => `${v.name} ${v.scenario}. That's **${v.part}** out of **${v.whole}**.\n\nBut what percentage is that? There's a simple rule to find out!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.part, label: `${v.part}`, color: "#c084fc" },
                  { value: v.whole - v.part, label: `${v.whole - v.part}`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.part} out of ${v.whole} = ?%`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide, then multiply by 100",
            body: (v) => `There is a simple two-step method for converting (changing) any "X out of Y" into a percentage. Tap to learn it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Write the fraction: part ÷ whole", why: `${v.part} ÷ ${v.whole}`, result: `= ${v.division}` },
                  { text: "Multiply by 100", why: `${v.division} × 100`, result: `= ${v.answer}%` },
                  { text: `${v.part} out of ${v.whole} = ${v.answer}%`, result: "Done! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Divide: ${v.part} ÷ ${v.whole} = ${v.division}`,
                `Multiply by 100: ${v.division} × 100 = ${v.answer}`,
                `Add the % sign: ${v.answer}%`
              ],
              feedback: {
                correct: (v) => `Perfect order! Divide part by whole, then multiply by 100. ✓`,
                incorrect: (v) => `Not quite — first divide the part by the whole, then multiply by 100.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactPart}** out of **${v.interactWhole}** as a percentage?\n\nDivide ${v.interactPart} by ${v.interactWhole}, then multiply by 100.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPart, label: `${v.interactPart}`, color: "#c084fc" },
                  { value: v.interactWhole - v.interactPart, label: `${v.interactWhole - v.interactPart}`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactWhole} total`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPart} out of ${v.interactWhole} = ?%`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! (${v.interactPart} \u00f7 ${v.interactWhole}) \u00d7 100 = **${v.interactAnswer}%**. ✓`,
                incorrect: (v) => `Not quite! (${v.interactPart} \u00f7 ${v.interactWhole}) \u00d7 100 = ${v.interactDivision} \u00d7 100 = **${v.interactAnswer}%**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Expressing as a percentage — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `Any time you need to convert "X out of Y" into a percentage:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 18, label: "18", color: "#c084fc" },
                    { value: 7, label: "7", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "18 out of 25 = (18 \u00f7 25) \u00d7 100 = 72%",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Write as a fraction: part \u00f7 whole", why: "The part goes on top, the total goes on the bottom" },
                    { text: "Divide to get a decimal", why: "Use short division or a calculator" },
                    { text: "Multiply by 100 to get the %", why: "This converts the decimal into a percentage \u2713" }
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
        id: "express-as-percentage-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid dividing the numbers the wrong way round",
          "When to watch out for forgetting to multiply by 100 at the end"
        ],
        variableSets: [
          {
            name: "Jake",
            part: 15, whole: 60,
            correctAnswer: 25,
            wrongAnswer: 400,
            mistake: "divided the wrong way round (60 \u00f7 15 = 4, then 4 \u00d7 100 = 400%)",
            wrongWorking: "60 \u00f7 15 = 4, then 4 \u00d7 100 = 400%",
            interactPart: 8, interactWhole: 40, interactCorrectAnswer: 20
          },
          {
            name: "Rosie",
            part: 12, whole: 40,
            correctAnswer: 30,
            wrongAnswer: 3,
            mistake: "divided correctly (12 \u00f7 40 = 0.3) but forgot to multiply by 100, so said 0.3%",
            wrongWorking: "12 \u00f7 40 = 0.3, answer = 0.3%",
            interactPart: 18, interactWhole: 50, interactCorrectAnswer: 36
          },
          {
            name: "Alfie",
            part: 9, whole: 50,
            correctAnswer: 18,
            wrongAnswer: 9,
            mistake: "just wrote the part as the percentage without dividing (said 9%)",
            wrongWorking: "9 out of 50... so 9%?",
            interactPart: 12, interactWhole: 60, interactCorrectAnswer: 20
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s error?`,
            body: (v) => `${v.name} tried to express **${v.part}** out of **${v.whole}** as a percentage.\n\n${v.name}'s working: ${v.wrongWorking}\n\nWhat went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s working: ${v.wrongWorking}`, why: "Is this right?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the correct method!",
            body: (v) => `${v.name} ${v.mistake}. The correct method is always **(part / whole) x 100** — and the order matters! Tap to see it done right.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Part \u00f7 whole: ${v.part} \u00f7 ${v.whole}`, result: `= ${v.part / v.whole}` },
                  { text: `Multiply by 100`, result: `${v.part / v.whole} \u00d7 100 = ${v.correctAnswer}%` },
                  { text: `${v.part} out of ${v.whole} = ${v.correctAnswer}%`, result: "Correct! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now you try!",
            body: (v) => `What is **${v.interactPart}** out of **${v.interactWhole}** as a percentage?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPart, label: `${v.interactPart}`, color: "#c084fc" },
                  { value: v.interactWhole - v.interactPart, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactWhole} total`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPart} out of ${v.interactWhole} as a percentage?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! (${v.interactPart} \u00f7 ${v.interactWhole}) \u00d7 100 = **${v.interactCorrectAnswer}%**. ✓`,
                incorrect: (v) => `Not quite! (${v.interactPart} \u00f7 ${v.interactWhole}) \u00d7 100 = **${v.interactCorrectAnswer}%**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Avoid these common traps!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When expressing as a percentage, always remember:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 9, label: "9", color: "#c084fc" },
                    { value: 41, label: "41", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "9 out of 50 = 18%, not 9%!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Divide PART by WHOLE (not the other way round!)", why: "The smaller number usually goes on top" },
                    { text: "Don't forget to multiply by 100", why: "0.3 is NOT the same as 0.3% \u2014 it's 30%!" },
                    { text: "The part alone is NOT the percentage", why: "9 out of 50 is not 9% \u2014 it's 18% \u2713" }
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
  // SUB-CONCEPT 6: percentage-increase
  // Percentage increase (find %, then add)
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "percentage-increase",
    name: "Percentage Increase",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "percentage-increase-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate a price after a percentage increase",
          "Why you find the percentage first, then add"
        ],
        variableSets: [
          {
            name: "A toy shop",
            scenario: "increases prices by 20% after Christmas. A board game was",
            original: 30, percent: 20,
            increase: 6, newPrice: 36,
            tenPercent: 3,
            unit: "\u00a3",
            interactOriginal: 50, interactPercent: 20, interactIncrease: 10, interactNewPrice: 60, interactTenPercent: 5
          },
          {
            name: "A landlord",
            scenario: "raises the rent by 10%. The rent was",
            original: 800, percent: 10,
            increase: 80, newPrice: 880,
            tenPercent: 80,
            unit: "\u00a3",
            interactOriginal: 600, interactPercent: 10, interactIncrease: 60, interactNewPrice: 660, interactTenPercent: 60
          },
          {
            name: "A bakery",
            scenario: "puts up the price of bread by 25%. A loaf was",
            original: 2, percent: 25,
            increase: 0.5, newPrice: 2.5,
            tenPercent: 0.2,
            unit: "\u00a3",
            interactOriginal: 4, interactPercent: 25, interactIncrease: 1, interactNewPrice: 5, interactTenPercent: 0.4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.percent}% increase on ${v.unit}${v.original}`,
            body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.original}**.\n\nWhat's the new price after a **${v.percent}% increase**? Let's work it out step by step!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100, label: `Original: ${v.unit}${v.original}`, color: "#818cf8" },
                  { value: v.percent, label: `+${v.percent}%`, color: "#34d399" }
                ],
                totalLabel: `Original + increase = new price`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the %, then add it on!",
            body: (v) => `Percentage increase is a two-step process:\n\n1. **Find the percentage** of the original amount (use the building-block method: 10%, 5%, 1%)\n2. **ADD** the percentage to the original — increase means it gets bigger\n3. **Check:** your answer should be MORE than you started with\n\nTap to see each step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find ${v.percent}% of ${v.unit}${v.original}`, why: `10% = ${v.unit}${v.tenPercent}, so ${v.percent}% = ${v.unit}${v.increase}`, result: `Increase = ${v.unit}${v.increase}` },
                  { text: `Add to the original`, why: `${v.unit}${v.original} + ${v.unit}${v.increase}`, result: `New price = ${v.unit}${v.newPrice} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A price tag shows **${v.unit}${v.interactOriginal}**.\n\nThe price goes up by **${v.interactPercent}%**. What's the new price?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100, label: `${v.unit}${v.interactOriginal}`, color: "#818cf8" },
                  { value: v.interactPercent, label: `+${v.interactPercent}%?`, color: "#34d399" }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.unit}${v.interactOriginal} increased by ${v.interactPercent}% = ?`,
              getOptions: (v) => generateDistractors(v.interactNewPrice),
              correctAnswer: (v) => v.interactNewPrice,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactPercent}% of ${v.unit}${v.interactOriginal} = ${v.unit}${v.interactIncrease}. Add it on: ${v.unit}${v.interactOriginal} + ${v.unit}${v.interactIncrease} = **${v.unit}${v.interactNewPrice}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.unit}${v.interactIncrease}. Then add: ${v.unit}${v.interactOriginal} + ${v.unit}${v.interactIncrease} = **${v.unit}${v.interactNewPrice}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Percentage increase — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `Remember: find the percentage, then ADD it on.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 100, label: "Original", color: "#818cf8" },
                    { value: 20, label: "+20%", color: "#34d399" }
                  ],
                  totalLabel: "Original + increase = new amount",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1. Find 10% by dividing by 10", why: "This is your building block" },
                    { text: "2. Scale up to the percentage you need", why: "e.g. 30% = 10% \u00d7 3" },
                    { text: "3. ADD the percentage to the original", why: "Increase means it gets bigger" },
                    { text: "4. Check: is your answer bigger than the original?", why: "If not, you subtracted instead of added! \u2713" }
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
        id: "percentage-increase-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply percentage increase to real shopping and money problems",
          "When to watch out for adding the percentage to the wrong amount"
        ],
        variableSets: [
          {
            name: "A museum",
            scenario: "had 500 visitors last month. This month, visitors went up by 30%. How many visitors this month?",
            original: 500, percent: 30,
            increase: 150, newAmount: 650,
            tenPercent: 50,
            unit: "", unitAfter: " visitors",
            interactOriginal: 400, interactPercent: 20, interactIncrease: 80, interactNewAmount: 480, interactTenPercent: 40
          },
          {
            name: "A village",
            scenario: "had a population of 2000. It grew by 15%. What's the new population?",
            original: 2000, percent: 15,
            increase: 300, newAmount: 2300,
            tenPercent: 200,
            unit: "", unitAfter: " people",
            interactOriginal: 3000, interactPercent: 20, interactIncrease: 600, interactNewAmount: 3600, interactTenPercent: 300
          },
          {
            name: "A squirrel",
            scenario: "had collected 80 acorns. By autumn, its stash grew by 50%. How many now?",
            original: 80, percent: 50,
            increase: 40, newAmount: 120,
            tenPercent: 8,
            unit: "", unitAfter: " acorns",
            interactOriginal: 60, interactPercent: 25, interactIncrease: 15, interactNewAmount: 75, interactTenPercent: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Up by ${v.percent}%!`,
            body: (v) => `${v.name} ${v.scenario}\n\nA percentage increase means the amount gets **bigger**. But by how much exactly?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.original, label: `${v.original}`, color: "#818cf8" },
                  { value: v.increase, label: `+${v.percent}%`, color: "#34d399" }
                ],
                totalLabel: `Original + increase = ?`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find it, then add it!",
            body: (v) => `Start by finding **10%** as your building block, then build up to ${v.percent}%. Once you have the increase, just add it on. Tap to follow along!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `10% of ${v.original} = ${v.tenPercent}`, why: `${v.original} ÷ 10` },
                  { text: `${v.percent}% of ${v.original} = ${v.increase}`, why: "Build from 10%" },
                  { text: `${v.original} + ${v.increase} = ${v.newAmount}`, result: `New total = ${v.newAmount}${v.unitAfter} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find 10%: ${v.original} ÷ 10 = ${v.tenPercent}`,
                `Build up to ${v.percent}%: ${v.increase}`,
                `Add to original: ${v.original} + ${v.increase} = ${v.newAmount}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the percentage, then add it on. ✓`,
                incorrect: (v) => `Not quite — first find the percentage amount, then add it to the original.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is ${v.interactOriginal} increased by ${v.interactPercent}%?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactOriginal, label: `${v.interactOriginal}`, color: "#818cf8" },
                  { value: v.interactIncrease, label: "?", color: "#34d399" }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactOriginal} increased by ${v.interactPercent}% = ?`,
              getOptions: (v) => generateDistractors(v.interactNewAmount),
              correctAnswer: (v) => v.interactNewAmount,
              feedback: {
                correct: (v) => `Yes! ${v.interactPercent}% of ${v.interactOriginal} = ${v.interactIncrease}. Then ${v.interactOriginal} + ${v.interactIncrease} = **${v.interactNewAmount}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% of ${v.interactOriginal} = ${v.interactIncrease}. Add it on: ${v.interactOriginal} + ${v.interactIncrease} = **${v.interactNewAmount}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember: increase = find %, then add!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Percentage increase is a two-step process:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 500, label: "500", color: "#818cf8" },
                    { value: 150, label: "+30%", color: "#34d399" }
                  ],
                  totalLabel: "500 + 30% = 650",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the percentage amount", why: "Use 10% as your building block" },
                    { text: "ADD it to the original", why: "Increase = bigger, so you add" },
                    { text: "Sense check: new amount > original?", why: "If not, something went wrong! \u2713" }
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
  // SUB-CONCEPT 7: percentage-decrease
  // Percentage decrease / discount
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "percentage-decrease",
    name: "Percentage Decrease and Discounts",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "percentage-decrease-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate a sale price after a percentage discount",
          "Why you find the percentage first, then subtract"
        ],
        variableSets: [
          {
            name: "Lauren",
            scenario: "spots trainers in a sale with 20% off. They were",
            original: 60, percent: 20,
            decrease: 12, salePrice: 48,
            tenPercent: 6,
            unit: "\u00a3",
            interactOriginal: 90, interactPercent: 20, interactDecrease: 18, interactSalePrice: 72, interactTenPercent: 9
          },
          {
            name: "Daisy",
            scenario: "finds a jacket reduced by 30% in the January sales. It was",
            original: 80, percent: 30,
            decrease: 24, salePrice: 56,
            tenPercent: 8,
            unit: "\u00a3",
            interactOriginal: 50, interactPercent: 30, interactDecrease: 15, interactSalePrice: 35, interactTenPercent: 5
          },
          {
            name: "Evie",
            scenario: "gets 15% off a board game for her birthday. It normally costs",
            original: 40, percent: 15,
            decrease: 6, salePrice: 34,
            tenPercent: 4,
            unit: "\u00a3",
            interactOriginal: 60, interactPercent: 15, interactDecrease: 9, interactSalePrice: 51, interactTenPercent: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.percent}% off ${v.unit}${v.original}!`,
            body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.original}**.\n\nWhat's the sale price after **${v.percent}% off**? Let's work it out!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100 - v.percent, label: `You pay: ?`, color: "#818cf8" },
                  { value: v.percent, label: `${v.percent}% off`, color: "#f87171" }
                ],
                totalLabel: `Original: ${v.unit}${v.original}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the %, then take it away!",
            body: (v) => `Percentage decrease works just like increase — but instead of adding, you **subtract**.\n\n1. **Find the percentage** of the original amount (use the building-block method)\n2. **SUBTRACT** from the original — decrease means it gets smaller\n3. **Check:** your answer should be LESS than you started with\n\nTap to see each step of the discount!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find ${v.percent}% of ${v.unit}${v.original}`, why: `10% = ${v.unit}${v.tenPercent}, build up to ${v.percent}%`, result: `Discount = ${v.unit}${v.decrease}` },
                  { text: `Subtract from the original`, why: `${v.unit}${v.original} - ${v.unit}${v.decrease}`, result: `Sale price = ${v.unit}${v.salePrice} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `For a percentage decrease, find the percentage then ____ it from the original`,
              options: (v) => ["add", "subtract", "multiply", "divide"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Decrease means subtract — the answer should be less than the original. ✓`,
                incorrect: (v) => `Not quite — decrease means it gets smaller, so you subtract.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A pair of trainers costs **${v.unit}${v.interactOriginal}**.\n\nThey go in the sale at **${v.interactPercent}% off**. What's the sale price?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100 - v.interactPercent, label: `You pay`, color: "#818cf8" },
                  { value: v.interactPercent, label: `-${v.interactPercent}%`, color: "#f87171" }
                ],
                totalLabel: `${v.unit}${v.interactOriginal}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.unit}${v.interactOriginal} with ${v.interactPercent}% off = ?`,
              getOptions: (v) => generateDistractors(v.interactSalePrice),
              correctAnswer: (v) => v.interactSalePrice,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactPercent}% of ${v.unit}${v.interactOriginal} = ${v.unit}${v.interactDecrease}. Take it away: ${v.unit}${v.interactOriginal} - ${v.unit}${v.interactDecrease} = **${v.unit}${v.interactSalePrice}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.unit}${v.interactDecrease}. Then ${v.unit}${v.interactOriginal} - ${v.unit}${v.interactDecrease} = **${v.unit}${v.interactSalePrice}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Percentage decrease — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `Remember: find the percentage, then SUBTRACT it.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 75, label: "You pay: 75%", color: "#818cf8" },
                    { value: 25, label: "25% off", color: "#f87171" }
                  ],
                  totalLabel: "Original price = 100%",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1. Find 10% by dividing by 10", why: "This is your building block" },
                    { text: "2. Scale up to the percentage you need", why: "e.g. 25% = 10% \u00d7 2 + 5%" },
                    { text: "3. SUBTRACT the percentage from the original", why: "Decrease means it gets smaller" },
                    { text: "4. Check: is your answer smaller than the original?", why: "If not, you added instead of subtracted! \u2713" }
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
        id: "percentage-decrease-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply percentage discount calculations to real sale prices",
          "When to watch out for subtracting the percentage instead of the amount"
        ],
        variableSets: [
          {
            name: "A school",
            scenario: "had 400 pupils, but numbers dropped by 15%. How many now?",
            original: 400, percent: 15,
            decrease: 60, newAmount: 340,
            tenPercent: 40,
            unit: "", unitAfter: " pupils",
            interactOriginal: 300, interactPercent: 20, interactDecrease: 60, interactNewAmount: 240, interactTenPercent: 30
          },
          {
            name: "A wildlife park",
            scenario: "had 600 animals. After a harsh winter, numbers fell by 10%. How many survived?",
            original: 600, percent: 10,
            decrease: 60, newAmount: 540,
            tenPercent: 60,
            unit: "", unitAfter: " animals",
            interactOriginal: 500, interactPercent: 20, interactDecrease: 100, interactNewAmount: 400, interactTenPercent: 50
          },
          {
            name: "A swimming pool",
            scenario: "normally uses 2000 litres of water a day. A new system reduces this by 25%. How much now?",
            original: 2000, percent: 25,
            decrease: 500, newAmount: 1500,
            tenPercent: 200,
            unit: "", unitAfter: " litres",
            interactOriginal: 1200, interactPercent: 10, interactDecrease: 120, interactNewAmount: 1080, interactTenPercent: 120
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Down by ${v.percent}%!`,
            body: (v) => `${v.name} ${v.scenario}\n\nA percentage decrease means the amount gets **smaller**. But how much smaller?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100 - v.percent, label: `Remaining`, color: "#818cf8" },
                  { value: v.percent, label: `-${v.percent}%`, color: "#f87171" }
                ],
                totalLabel: `Started with ${v.original}${v.unitAfter}`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find it, then take it away!",
            body: (v) => `Build up to **${v.percent}%** using the 10% building block, then take it away from the original. Tap to follow the working!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `10% of ${v.original} = ${v.tenPercent}`, why: `${v.original} ÷ 10` },
                  { text: `${v.percent}% of ${v.original} = ${v.decrease}`, why: "Build from 10%" },
                  { text: `${v.original} - ${v.decrease} = ${v.newAmount}`, result: `New total = ${v.newAmount}${v.unitAfter} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Increase", right: "Add the %" },
                { left: "Decrease", right: "Subtract the %" },
                { left: "10%", right: "÷ 10" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is ${v.interactOriginal} decreased by ${v.interactPercent}%?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100 - v.interactPercent, label: "?", color: "#818cf8" },
                  { value: v.interactPercent, label: `-${v.interactPercent}%`, color: "#f87171" }
                ],
                totalLabel: `${v.interactOriginal}${v.unitAfter}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactOriginal} decreased by ${v.interactPercent}% = ?`,
              getOptions: (v) => generateDistractors(v.interactNewAmount),
              correctAnswer: (v) => v.interactNewAmount,
              feedback: {
                correct: (v) => `Yes! ${v.interactPercent}% of ${v.interactOriginal} = ${v.interactDecrease}. Then ${v.interactOriginal} - ${v.interactDecrease} = **${v.interactNewAmount}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.interactDecrease}. Subtract: ${v.interactOriginal} - ${v.interactDecrease} = **${v.interactNewAmount}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember: decrease = find %, then subtract!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Percentage decrease is the opposite of increase:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 85, label: "Remaining: 85%", color: "#818cf8" },
                    { value: 15, label: "-15%", color: "#f87171" }
                  ],
                  totalLabel: "Started with 400 \u2192 400 - 60 = 340",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the percentage amount", why: "Same method as always \u2014 building blocks" },
                    { text: "SUBTRACT it from the original", why: "Decrease = smaller, so you take away" },
                    { text: "Sense check: new amount < original?", why: "If not, something went wrong! \u2713" }
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
  // SUB-CONCEPT 8: percent-to-fraction
  // Converting % to fraction and simplifying
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: key-fact
  // ==========================================
  {
    id: "percent-to-fraction",
    name: "Converting Percentages to Fractions",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "percent-to-fraction-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to write a percentage as a fraction over 100",
          "How to simplify the fraction"
        ],
        variableSets: [
          {
            name: "Aisha",
            percent: 40,
            fractionOver100: "40/100",
            hcf: 20,
            simplified: "2/5",
            simpNum: 2, simpDen: 5,
            interactPercent: 20, interactFractionOver100: "20/100", interactHcf: 20, interactSimplified: "1/5", interactSimpNum: 1, interactSimpDen: 5
          },
          {
            name: "Ben",
            percent: 75,
            fractionOver100: "75/100",
            hcf: 25,
            simplified: "3/4",
            simpNum: 3, simpDen: 4,
            interactPercent: 50, interactFractionOver100: "50/100", interactHcf: 50, interactSimplified: "1/2", interactSimpNum: 1, interactSimpDen: 2
          },
          {
            name: "Chloe",
            percent: 60,
            fractionOver100: "60/100",
            hcf: 20,
            simplified: "3/5",
            simpNum: 3, simpDen: 5,
            interactPercent: 80, interactFractionOver100: "80/100", interactHcf: 20, interactSimplified: "4/5", interactSimpNum: 4, interactSimpDen: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.percent}% as a fraction?`,
            body: (v) => `${v.name} needs to write **${v.percent}%** as a fraction. Remember: percent means "out of 100" — so that gives us our starting point!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percent, label: `${v.percent}%`, color: "#c084fc" },
                  { value: 100 - v.percent, label: `${100 - v.percent}%`, color: "#e5e7eb", empty: true }
                ],
                totalLabel: "100%",
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Put it over 100, then simplify!",
            body: (v) => `Since percent means "out of 100", any percentage instantly becomes a fraction — then you just simplify. Tap to see the two-step process!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Write as a fraction: ${v.fractionOver100}`, why: "% means out of 100" },
                  { text: `Find the highest common factor (the biggest number that divides into both) of ${v.percent} and 100`, result: `Highest common factor = ${v.hcf}` },
                  { text: `Divide top and bottom by ${v.hcf}`, why: `${v.percent}÷${v.hcf} = ${v.simpNum}, 100÷${v.hcf} = ${v.simpDen}`, result: `${v.percent}% = ${v.simplified} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Write ${v.percent}% as ${v.fractionOver100}`,
                `Find the highest common factor of ${v.percent} and 100: ${v.hcf}`,
                `Divide top and bottom by ${v.hcf}: ${v.simplified}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Put over 100, find the highest common factor, then simplify. ✓`,
                incorrect: (v) => `Not quite — first write it over 100, then simplify using the highest common factor.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Write **${v.interactPercent}%** as a fraction in its simplest form.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercent, label: `${v.interactPercent}%`, color: "#c084fc" },
                  { value: 100 - v.interactPercent, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.interactPercent}% = ${v.interactFractionOver100} = ?`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPercent}% as a simplified fraction?`,
              getOptions: (v) => [
                v.interactSimplified,
                `${v.interactPercent}/100`,
                `${v.interactSimpDen}/${v.interactSimpNum}`,
                `${v.interactSimpNum}/${v.interactSimpDen + 1}`,
                `${v.interactSimpNum + 1}/${v.interactSimpDen}`
              ],
              correctAnswer: (v) => v.interactSimplified,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactPercent}% = ${v.interactFractionOver100}. Simplify by dividing both by ${v.interactHcf}: **${v.interactSimplified}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.interactFractionOver100}. Divide both by ${v.interactHcf} to get **${v.interactSimplified}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "% to fraction — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `Converting (changing) a percentage to a fraction is just two steps:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 40, label: "40% = 2/5", color: "#c084fc" },
                    { value: 60, label: "60%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "40/100 → simplify → 2/5",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Write the percentage over 100", why: "40% becomes 40/100" },
                    { text: "Step 2: Simplify the fraction", why: "Find the highest common factor and divide top and bottom" },
                    { text: "Check: is the fraction in its simplest form?", why: "Can you divide both by anything else? If not, done! \u2713" }
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
        id: "percent-to-fraction-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to apply percentage-to-fraction conversion in exam questions",
          "When to watch out for not simplifying the fraction fully"
        ],
        variableSets: [
          {
            name: "Oliver",
            percent: 35,
            fractionOver100: "35/100",
            hcf: 5,
            simplified: "7/20",
            simpNum: 7, simpDen: 20,
            interactPercent: 45, interactFractionOver100: "45/100", interactHcf: 5, interactSimplified: "9/20", interactSimpNum: 9, interactSimpDen: 20
          },
          {
            name: "Mia",
            percent: 15,
            fractionOver100: "15/100",
            hcf: 5,
            simplified: "3/20",
            simpNum: 3, simpDen: 20,
            interactPercent: 25, interactFractionOver100: "25/100", interactHcf: 25, interactSimplified: "1/4", interactSimpNum: 1, interactSimpDen: 4
          },
          {
            name: "Hassan",
            percent: 80,
            fractionOver100: "80/100",
            hcf: 20,
            simplified: "4/5",
            simpNum: 4, simpDen: 5,
            interactPercent: 70, interactFractionOver100: "70/100", interactHcf: 10, interactSimplified: "7/10", interactSimpNum: 7, interactSimpDen: 10
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Quick convert: ${v.percent}% to a fraction!`,
            body: (v) => `${v.name} needs to convert (change) **${v.percent}%** to a fraction.\n\nThe key fact: **percent means out of 100**, so you already know the bottom number (denominator)!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percent, label: `${v.percent}%`, color: "#c084fc" },
                  { value: 100 - v.percent, label: "", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `${v.percent}% = ? as a fraction`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Key fact: just put it over 100!",
            body: (v) => `The percentage becomes the **numerator** (top number) and 100 is the **denominator** (bottom number).\nThen simplify by dividing both by the **highest common factor** (the biggest number that goes into both).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.percent}% = ${v.fractionOver100}`, why: "Put the % number over 100" },
                  { text: `Simplify: ÷${v.hcf} on top and bottom`, result: `= ${v.simplified} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "20%", right: "1/5" },
                { left: "75%", right: "3/4" },
                { left: "40%", right: "2/5" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactPercent}%** as a fraction in simplest form?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercent, label: `${v.interactPercent}%`, color: "#c084fc" },
                  { value: 100 - v.interactPercent, label: "", color: "#e5e7eb", empty: true }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPercent}% = which fraction?`,
              getOptions: (v) => [
                v.interactSimplified,
                v.interactFractionOver100,
                `${v.interactSimpDen}/${v.interactSimpNum}`,
                `${v.interactSimpNum}/${v.interactSimpDen - 1}`,
                `${v.interactSimpNum + 1}/${v.interactSimpDen}`
              ],
              correctAnswer: (v) => v.interactSimplified,
              feedback: {
                correct: (v) => `Spot on! ${v.interactPercent}% = ${v.interactFractionOver100}, simplified to **${v.interactSimplified}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent}% = ${v.interactFractionOver100}. Divide both by ${v.interactHcf}: **${v.interactSimplified}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember the two steps!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Percent to fraction is always the same:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 75, label: "75% = 3/4", color: "#c084fc" },
                    { value: 25, label: "25%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "75/100 → ÷ 25 → 3/4",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Write over 100", why: "The % number becomes the numerator (top number), 100 is the denominator (bottom number)" },
                    { text: "Simplify by dividing top and bottom by the highest common factor (the biggest number that goes into both)", why: "Always give fractions in simplest form \u2713" }
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
  // SUB-CONCEPT 9: percent-to-decimal
  // Converting % to decimal and back
  // Category: supporting
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "percent-to-decimal",
    name: "Converting Between Percentages and Decimals",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "percent-to-decimal-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to convert (change) a percentage to a decimal by dividing by 100",
          "Why 5% = 0.05, not 0.5"
        ],
        variableSets: [
          {
            name: "Priya",
            percent: 35,
            decimal: 0.35,
            wrongDecimal: 3.5,
            scenario: "converting 35% to a decimal for a calculator",
            interactPercent: 45, interactDecimal: 0.45, interactWrongDecimal: 4.5
          },
          {
            name: "Tom",
            percent: 8,
            decimal: 0.08,
            wrongDecimal: 0.8,
            scenario: "converting 8% interest rate to a decimal",
            interactPercent: 6, interactDecimal: 0.06, interactWrongDecimal: 0.6
          },
          {
            name: "Mia",
            percent: 125,
            decimal: 1.25,
            wrongDecimal: 12.5,
            scenario: "converting 125% to a decimal",
            interactPercent: 150, interactDecimal: 1.5, interactWrongDecimal: 15
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.percent}% as a decimal?`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}.\n\nTo convert a percentage to a decimal, you just need **one simple rule**: divide by 100!`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: [
                    { value: v.percent, label: `${v.percent}%`, color: "#c084fc" },
                    { value: Math.max(100 - v.percent, 0), label: "", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: `${v.percent}% = ${v.decimal} as a decimal`,
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.percent}% \u00f7 100 = ?`, why: "Move the decimal point two places to the LEFT" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Key fact: % to decimal = divide by 100",
            body: (v) => `Converting between percentages and decimals is just about moving the decimal point. But be careful — moving it the **wrong number** of places is the most common trap! Tap to see the rule.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.percent}% ÷ 100 = ${v.decimal}`, why: "Move decimal point 2 places left", result: `${v.percent}% = ${v.decimal}` },
                  { text: `Check: ${v.decimal} × 100 = ${v.percent}%`, why: "Multiply by 100 to go back", result: "It works! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To convert a percentage to a decimal, divide by ____`,
              options: (v) => ["10", "50", "100", "1000"],
              correctIndex: (v) => 2,
              feedback: {
                correct: (v) => `Yes! Divide by 100 — move the decimal point 2 places left. ✓`,
                incorrect: (v) => `Not quite — "per cent" means "per hundred", so divide by 100.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactPercent}%** as a decimal?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercent, label: `${v.interactPercent}%`, color: "#7C3AED" },
                  { value: 100 - v.interactPercent, label: `${100 - v.interactPercent}%`, color: "#E8E5FF", empty: true }
                ],
                totalLabel: `${v.interactPercent}% = ${v.interactDecimal}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPercent}% as a decimal = ?`,
              getOptions: (v) => {
                // GL-pattern distractors for % to decimal. Bare-integer
                // distractor (e.g. "6" alongside "0.06") removed per Jacqui's
                // 2 May 2026 feedback — a child new to decimals reads "6"
                // sat next to "0.06" as an incomplete decimal. All options
                // now render with consistent decimal places.
                const correct = v.interactDecimal;
                const correctStr = correct.toFixed(correct < 0.1 ? 3 : (correct < 1 ? 2 : 1));
                const wrong = v.interactWrongDecimal;
                const wrongStr = wrong.toFixed(wrong < 1 ? 2 : 1);
                const overDivStr = (correct / 10).toFixed(correct < 0.1 ? 4 : 3);
                const underDivStr = (correct * 10).toFixed(correct < 0.1 ? 2 : 1);
                const altStr = (v.interactPercent / 1000).toFixed(4);
                const opts = [correctStr, wrongStr, overDivStr, underDivStr, altStr];
                const unique = [...new Set(opts)];
                while (unique.length < 5) {
                  const filler = (v.interactPercent / 10).toFixed(1);
                  if (!unique.includes(filler)) unique.push(filler);
                  else unique.push((correct + 0.01).toFixed(correct < 0.1 ? 3 : 2));
                }
                return unique.slice(0, 5);
              },
              correctAnswer: (v) => {
                const c = v.interactDecimal;
                return c.toFixed(c < 0.1 ? 3 : (c < 1 ? 2 : 1));
              },
              feedback: {
                correct: (v) => {
                  const c = v.interactDecimal;
                  const cStr = c.toFixed(c < 0.1 ? 3 : (c < 1 ? 2 : 1));
                  return `Yes! ${v.interactPercent}% \u00f7 100 = **${cStr}** Two places to the left! ✓`;
                },
                incorrect: (v) => {
                  const c = v.interactDecimal;
                  const cStr = c.toFixed(c < 0.1 ? 3 : (c < 1 ? 2 : 1));
                  return `Not quite. Divide by 100: ${v.interactPercent} \u00f7 100 = **${cStr}** Move the decimal point two places left.`;
                }
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The conversion rules!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Just remember: **% to decimal = \u00f7 100**, and **decimal to % = \u00d7 100**.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 5, label: "5%", color: "#c084fc" },
                    { value: 95, label: "95%", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "5% = 0.05 (NOT 0.5!)",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "% to decimal: divide by 100", why: "Move the decimal point 2 places LEFT" },
                    { text: "Decimal to %: multiply by 100", why: "Move the decimal point 2 places RIGHT" },
                    { text: "Watch out for small percentages!", why: "5% = 0.05 (not 0.5!), 8% = 0.08 (not 0.8!) \u2713" }
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
        id: "percent-to-decimal-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid moving the decimal point the wrong number of places",
          "When to watch out for the 5% = 0.5 trap"
        ],
        variableSets: [
          {
            name: "Jake",
            percent: 5, correctDecimal: 0.05,
            wrongDecimal: 0.5,
            mistake: "only moved the decimal one place instead of two — he divided by 10 instead of 100",
            interactPercent: 3, interactCorrectDecimal: 0.03, interactWrongDecimal: 0.3
          },
          {
            name: "Rosie",
            percent: 35, correctDecimal: 0.35,
            wrongDecimal: 3.5,
            mistake: "divided by 10 instead of 100 — she moved the decimal point only one place left",
            interactPercent: 72, interactCorrectDecimal: 0.72, interactWrongDecimal: 7.2
          },
          {
            name: "Alfie",
            percent: 2, correctDecimal: 0.02,
            wrongDecimal: 0.2,
            mistake: "wrote 0.2 instead of 0.02 — he forgot to put a zero in the tenths place",
            interactPercent: 9, interactCorrectDecimal: 0.09, interactWrongDecimal: 0.9
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.percent}% = ${v.wrongDecimal}`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} converted **${v.percent}%** to a decimal and got **${v.wrongDecimal}**.\n\nDoes that look right?`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: [
                    { value: v.percent, label: `${v.percent}%`, color: "#c084fc" },
                    { value: 100 - v.percent, label: "", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: `${v.percent}% \u2014 is that really ${v.wrongDecimal}?`,
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s answer: ${v.percent}% = ${v.wrongDecimal}`, why: "Is this correct?" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake!",
            body: (v) => `${v.name} ${v.mistake}. Remember: converting to a decimal means dividing by **100**, not 10 — that is **two** places, not one! Tap to compare.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.percent}% = ${v.wrongDecimal}`, why: `${v.name} ${v.mistake}` },
                  { text: `Correct: ${v.percent} ÷ 100 = ${v.correctDecimal}`, result: `${v.percent}% = ${v.correctDecimal} ✓` },
                  { text: `Check: ${v.correctDecimal} × 100 = ${v.percent}%`, why: "Multiply back to verify" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `To convert a percentage to a decimal, move the point 2 places left`, answer: true, explanation: "Correct — dividing by 100 shifts the point 2 places left. ✓" },
                { text: `25% as a decimal is 2.5`, answer: false, explanation: "25 ÷ 100 = 0.25, not 2.5 — that would be dividing by 10!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct decimal?",
            body: (v) => `What is **${v.interactPercent}%** as a decimal?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercent, label: `${v.interactPercent}%`, color: "#7C3AED" },
                  { value: 100 - v.interactPercent, label: "", color: "#E8E5FF", empty: true }
                ],
                totalLabel: `${v.interactPercent}% ÷ 100 = ?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactPercent}% = which decimal?`,
              getOptions: (v) => [
                String(v.interactCorrectDecimal),
                String(v.interactWrongDecimal),
                String(v.interactCorrectDecimal * 10),
                String(v.interactCorrectDecimal / 10),
                String(v.interactPercent)
              ],
              correctAnswer: (v) => String(v.interactCorrectDecimal),
              feedback: {
                correct: (v) => `Spot on! ${v.interactPercent}% \u00f7 100 = **${v.interactCorrectDecimal}**. Two places left! ✓`,
                incorrect: (v) => `Not quite! ${v.interactPercent} \u00f7 100 = **${v.interactCorrectDecimal}**. Remember: TWO places to the left.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The decimal point trap!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common mistake is only moving one place instead of two:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 5, label: "5%", color: "#f87171" },
                    { value: 45, label: "50% would be here!", color: "#e5e7eb", empty: true },
                    { value: 50, label: "", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: "5% is tiny \u2014 0.05, not 0.5!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "5% = 0.05 (NOT 0.5)", why: "0.5 would be 50%!" },
                    { text: "8% = 0.08 (NOT 0.8)", why: "0.8 would be 80%!" },
                    { text: "Always move TWO places left for \u00f7 100", why: "Count: one place = \u00f7 10, two places = \u00f7 100 \u2713" }
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
  // SUB-CONCEPT 10: comparing-fdp
  // Comparing fractions, decimals and percentages
  // Category: other
  // Lesson A: step-by-step | Lesson B: visual-discovery
  // ==========================================
  {
    id: "comparing-fdp",
    name: "Comparing Fractions, Decimals and Percentages",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "comparing-fdp-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to compare a fraction, a decimal and a percentage by converting (changing) to the same type",
          "How to decide which form is easiest to change to"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "comparing test scores: she got 3/5, Ben got 0.55, and Chloe got 65%",
            valueA: "3/5", valueB: "0.55", valueC: "65%",
            percentA: 60, percentB: 55, percentC: 65,
            order: "0.55, 3/5, 65%",
            orderDesc: "Ben (55%), Aisha (60%), Chloe (65%)",
            largest: "65%",
            interactValueA: "1/2", interactValueB: "0.45", interactValueC: "55%", interactPercentA: 50, interactPercentB: 45, interactPercentC: 55, interactLargest: "55%"
          },
          {
            name: "Tom",
            scenario: "checking which drink has the most juice: Bottle A is 1/4 juice, B is 0.3 juice, C is 20% juice",
            valueA: "1/4", valueB: "0.3", valueC: "20%",
            percentA: 25, percentB: 30, percentC: 20,
            order: "20%, 1/4, 0.3",
            orderDesc: "C (20%), A (25%), B (30%)",
            largest: "0.3",
            interactValueA: "3/10", interactValueB: "0.4", interactValueC: "35%", interactPercentA: 30, interactPercentB: 40, interactPercentC: 35, interactLargest: "0.4"
          },
          {
            name: "Priya",
            scenario: "comparing discounts: Shop A offers 2/5 off, Shop B offers 0.35 off, Shop C offers 45% off",
            valueA: "2/5", valueB: "0.35", valueC: "45%",
            percentA: 40, percentB: 35, percentC: 45,
            order: "0.35, 2/5, 45%",
            orderDesc: "B (35%), A (40%), C (45%)",
            largest: "45%",
            interactValueA: "3/5", interactValueB: "0.55", interactValueC: "50%", interactPercentA: 60, interactPercentB: 55, interactPercentC: 50, interactLargest: "3/5"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Which is biggest?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nA fraction, a decimal and a percentage — how do you compare them? **Convert them all to the same type!**`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percentA, label: v.valueA, color: "#c084fc" },
                  { value: v.percentB, label: v.valueB, color: "#818cf8" },
                  { value: v.percentC, label: v.valueC, color: "#34d399" }
                ],
                totalLabel: "Which is the largest?",
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Convert everything to percentages!",
            body: (v) => `The easiest way to compare is to convert everything to **percentages**:\n\n- **${v.valueA}** = **${v.percentA}%**\n- **${v.valueB}** = **${v.percentB}%**\n- **${v.valueC}** = **${v.percentC}%**\n\nNow it's easy to compare!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.valueA} = ${v.percentA}%`, why: "Fraction: divide top by bottom, then × 100" },
                  { text: `${v.valueB} = ${v.percentB}%`, why: "Decimal: multiply by 100" },
                  { text: `${v.valueC} = ${v.percentC}%`, why: "Already a percentage!" },
                  { text: `Order: ${v.orderDesc}`, result: `Largest: ${v.largest} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: v.valueA, right: `${v.percentA}%` },
                { left: v.valueB, right: `${v.percentB}%` },
                { left: v.valueC, right: `${v.percentC}%` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Which is the largest?",
            body: (v) => `${v.interactValueA}, ${v.interactValueB}, and ${v.interactValueC} — convert them all to percentages. Which is the **largest**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercentA, label: `${v.interactValueA}`, color: "#c084fc" },
                  { value: v.interactPercentB, label: `${v.interactValueB}`, color: "#818cf8" },
                  { value: v.interactPercentC, label: `${v.interactValueC}`, color: "#34d399" }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the largest: ${v.interactValueA}, ${v.interactValueB}, or ${v.interactValueC}?`,
              getOptions: (v) => [v.interactLargest, v.interactValueA === v.interactLargest ? v.interactValueB : v.interactValueA, v.interactValueC === v.interactLargest ? v.interactValueB : v.interactValueC, "They're all equal", "Can't tell"],
              correctAnswer: (v) => v.interactLargest,
              feedback: {
                correct: (v) => `Yes! Converting to percentages: ${v.interactPercentA}%, ${v.interactPercentB}%, ${v.interactPercentC}%. The largest is **${v.interactLargest}** (${Math.max(v.interactPercentA, v.interactPercentB, v.interactPercentC)}%). ✓`,
                incorrect: (v) => `Not quite! Convert all to %: ${v.interactValueA}=${v.interactPercentA}%, ${v.interactValueB}=${v.interactPercentB}%, ${v.interactValueC}=${v.interactPercentC}%. Largest is **${v.interactLargest}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comparing FDP — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `When you need to compare fractions, decimals and percentages:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 55, label: "0.55 = 55%", color: "#818cf8" },
                    { value: 60, label: "3/5 = 60%", color: "#c084fc" },
                    { value: 65, label: "65%", color: "#34d399" }
                  ],
                  totalLabel: "Convert to % to compare easily!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Convert everything to the SAME type", why: "Percentages are usually easiest" },
                    { text: "Fraction \u2192 %: divide the top by the bottom, then \u00d7 100", why: "e.g. 3/5: 3 \u00f7 5 = 0.6, then 0.6 \u00d7 100 = 60%" },
                    { text: "Decimal \u2192 %: multiply by 100", why: "0.35 \u00d7 100 = 35%" },
                    { text: "Now compare the numbers directly!", why: "55% vs 60% vs 65% \u2014 easy! \u2713" }
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

      // ---- Lesson B: Visual Discovery ----
      {
        id: "comparing-fdp-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to apply fraction-decimal-percentage conversion to comparison questions",
          "When to watch out for comparing values that are in different forms"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "choosing the best deal on chocolate: bar A is 1/2 cocoa, bar B is 0.45 cocoa, bar C is 55% cocoa",
            valueA: "1/2", valueB: "0.45", valueC: "55%",
            percentA: 50, percentB: 45, percentC: 55,
            smallest: "0.45",
            smallestPercent: 45,
            interactValueA: "1/4", interactValueB: "0.3", interactValueC: "20%", interactPercentA: 25, interactPercentB: 30, interactPercentC: 20, interactSmallest: "20%", interactSmallestPercent: 20
          },
          {
            name: "Chloe",
            scenario: "seeing which plant grew most: A grew by 3/10, B grew by 0.4, C grew by 25%",
            valueA: "3/10", valueB: "0.4", valueC: "25%",
            percentA: 30, percentB: 40, percentC: 25,
            smallest: "25%",
            smallestPercent: 25,
            interactValueA: "2/5", interactValueB: "0.35", interactValueC: "30%", interactPercentA: 40, interactPercentB: 35, interactPercentC: 30, interactSmallest: "30%", interactSmallestPercent: 30
          },
          {
            name: "Oliver",
            scenario: "checking battery levels: phone A is 7/10 charged, phone B is 0.65 charged, phone C is 72% charged",
            valueA: "7/10", valueB: "0.65", valueC: "72%",
            percentA: 70, percentB: 65, percentC: 72,
            smallest: "0.65",
            smallestPercent: 65,
            interactValueA: "4/5", interactValueB: "0.7", interactValueC: "85%", interactPercentA: 80, interactPercentB: 70, interactPercentC: 85, interactSmallest: "0.7", interactSmallestPercent: 70
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Three types, one comparison!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nThey're all written differently — but which is the **smallest**?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.percentA, label: v.valueA, color: "#c084fc" },
                  { value: v.percentB, label: v.valueB, color: "#38bdf8" },
                  { value: v.percentC, label: v.valueC, color: "#fbbf24" }
                ],
                totalLabel: "Which bar is shortest?",
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Convert to see the truth!",
            body: (v) => `Look at the bar model — you can already see which is smallest! But to prove it, convert:\n\n- ${v.valueA} = **${v.percentA}%**\n- ${v.valueB} = **${v.percentB}%**\n- ${v.valueC} = **${v.percentC}%**\n\nThe smallest is **${v.smallest}** (${v.smallestPercent}%).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.valueA} = ${v.percentA}%`, result: `${v.percentA}%` },
                  { text: `${v.valueB} = ${v.percentB}%`, result: `${v.percentB}%` },
                  { text: `${v.valueC} = ${v.percentC}%`, result: `${v.percentC}%` },
                  { text: `Smallest: ${v.smallest} = ${v.smallestPercent}%`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Spot the smallest!",
            body: (v) => `Which is the **smallest**: ${v.interactValueA}, ${v.interactValueB}, or ${v.interactValueC}?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactPercentA, label: v.interactValueA, color: "#c084fc" },
                  { value: v.interactPercentB, label: v.interactValueB, color: "#38bdf8" },
                  { value: v.interactPercentC, label: v.interactValueC, color: "#fbbf24" }
                ],
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is smallest: ${v.interactValueA}, ${v.interactValueB}, or ${v.interactValueC}?`,
              getOptions: (v) => [v.interactSmallest, v.interactValueA === v.interactSmallest ? v.interactValueB : v.interactValueA, v.interactValueC === v.interactSmallest ? v.interactValueB : v.interactValueC, "They're all equal", "Can't compare them"],
              correctAnswer: (v) => v.interactSmallest,
              feedback: {
                correct: (v) => `Yes! Converting to %: ${v.interactPercentA}%, ${v.interactPercentB}%, ${v.interactPercentC}%. Smallest is **${v.interactSmallest}** (${v.interactSmallestPercent}%). ✓`,
                incorrect: (v) => `Not quite! Convert: ${v.interactValueA}=${v.interactPercentA}%, ${v.interactValueB}=${v.interactPercentB}%, ${v.interactValueC}=${v.interactPercentC}%. Smallest = **${v.interactSmallest}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Converting makes comparing easy!",
            bodyParts: [
              {
                type: 'text',
                content: () => `You can always compare fractions, decimals and percentages by converting to the same form:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 25, label: "25% = 1/4", color: "#c084fc" },
                    { value: 30, label: "30% = 0.3", color: "#38bdf8" },
                    { value: 20, label: "20% = 1/5", color: "#fbbf24" }
                  ],
                  totalLabel: "All converted to % \u2014 now easy to compare!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Pick one form (usually percentages)", why: "Percentages are whole numbers, easy to compare" },
                    { text: "Convert all values to that form", why: "Fractions: divide top by bottom, then \u00d7100. Decimals: \u00d7100" },
                    { text: "Compare the numbers!", why: "Now they're all in the same units \u2713" }
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
  // SUB-CONCEPT 11: reverse-percentage
  // Finding original when you know % and result
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "reverse-percentage",
    name: "Reverse Percentages",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "reverse-percentage-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the original price when you know the discounted price",
          "Why you work out what percentage the given amount represents"
        ],
        variableSets: [
          {
            name: "Lauren",
            scenario: "bought a coat in a 20% off sale for \u00a3",
            salePrice: 48, discount: 20,
            remainingPercent: 80,
            onePercent: 0.6, original: 60,
            unit: "\u00a3",
            interactSalePrice: 56, interactDiscount: 20, interactRemainingPercent: 80, interactOnePercent: 0.7, interactOriginal: 70
          },
          {
            name: "Daisy",
            scenario: "paid for trainers after a 25% discount. She paid \u00a3",
            salePrice: 36, discount: 25,
            remainingPercent: 75,
            onePercent: 0.48, original: 48,
            unit: "\u00a3",
            interactSalePrice: 60, interactDiscount: 25, interactRemainingPercent: 75, interactOnePercent: 0.8, interactOriginal: 80
          },
          {
            name: "Evie",
            scenario: "got a book in a 10% off sale for \u00a3",
            salePrice: 9, discount: 10,
            remainingPercent: 90,
            onePercent: 0.1, original: 10,
            unit: "\u00a3",
            interactSalePrice: 18, interactDiscount: 10, interactRemainingPercent: 90, interactOnePercent: 0.2, interactOriginal: 20
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What was the original price?`,
            body: (v) => `${v.name} ${v.scenario}**${v.salePrice}**.\n\nThe sale was **${v.discount}% off**. What was the **original** price before the sale?\n\nThis is a **reverse percentage** question — we work backwards!`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.remainingPercent, label: `${v.unit}${v.salePrice} (${v.remainingPercent}%)`, color: "#818cf8" },
                  { value: v.discount, label: `${v.discount}% off`, color: "#f87171" }
                ],
                totalLabel: `Original price = ? (100%)`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Work out what % you have, then scale to 100%",
            body: (v) => `If there's **${v.discount}% off**, the sale price is **${v.remainingPercent}%** of the original.\n\nSo ${v.unit}${v.salePrice} = ${v.remainingPercent}%.\n\nFind 1%: ${v.unit}${v.salePrice} \u00f7 ${v.remainingPercent} = ${v.unit}${v.onePercent}\nFind 100%: ${v.unit}${v.onePercent} \u00d7 100 = **${v.unit}${v.original}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.discount}% off means you paid ${v.remainingPercent}%`, why: `100% - ${v.discount}% = ${v.remainingPercent}%` },
                  { text: `${v.remainingPercent}% = ${v.unit}${v.salePrice}`, why: "This is what we know" },
                  { text: `1% = ${v.unit}${v.salePrice} \u00f7 ${v.remainingPercent} = ${v.unit}${v.onePercent}`, why: "Divide to find one percent" },
                  { text: `100% = ${v.unit}${v.onePercent} \u00d7 100 = ${v.unit}${v.original}`, result: `Original price = ${v.unit}${v.original} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `After **${v.interactDiscount}% off**, the price is **${v.unit}${v.interactSalePrice}**. What was the original price?\n\nRemember: ${v.unit}${v.interactSalePrice} = ${v.interactRemainingPercent}%. Find 1%, then 100%.`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactRemainingPercent, label: `${v.unit}${v.interactSalePrice}`, color: "#818cf8" },
                  { value: v.interactDiscount, label: `${v.interactDiscount}% off`, color: "#f87171" }
                ],
                totalLabel: `100% = ?`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Original price before ${v.interactDiscount}% off?`,
              getOptions: (v) => generateDistractors(v.interactOriginal),
              correctAnswer: (v) => v.interactOriginal,
              feedback: {
                correct: (v) => `Brilliant! ${v.unit}${v.interactSalePrice} = ${v.interactRemainingPercent}%, so 1% = ${v.unit}${v.interactOnePercent}, and 100% = **${v.unit}${v.interactOriginal}**. ✓`,
                incorrect: (v) => `Not quite! ${v.unit}${v.interactSalePrice} is ${v.interactRemainingPercent}% of the original. ${v.unit}${v.interactSalePrice} \u00f7 ${v.interactRemainingPercent} \u00d7 100 = **${v.unit}${v.interactOriginal}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Reverse percentage — the recipe",
            bodyParts: [
              {
                type: 'text',
                content: () => `When you know the result and need the original:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 80, label: "\u00a348 (80%)", color: "#818cf8" },
                    { value: 20, label: "20% off", color: "#f87171" }
                  ],
                  totalLabel: "Original (100%) = \u00a348 \u00f7 80 \u00d7 100 = \u00a360",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Work out what % the given amount represents", why: "e.g. 20% off means you have 80% left" },
                    { text: "Step 2: Divide by that % to find 1%", why: "e.g. \u00a348 \u00f7 80 = \u00a30.60" },
                    { text: "Step 3: Multiply by 100 to find the original (100%)", why: "e.g. \u00a30.60 \u00d7 100 = \u00a360 \u2713" }
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
        id: "reverse-percentage-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid taking a percentage of the discounted price instead of the original",
          "When to watch out for the reverse percentage trap in exam questions"
        ],
        variableSets: [
          {
            name: "Jake", pronoun: "He",
            salePrice: 240, discount: 20,
            wrongOriginal: 288, correctOriginal: 300,
            mistake: "found 20% of \u00a3240 (\u00a348) and added it back on — but \u00a3240 is NOT 100%, it's 80%!",
            wrongMethod: "\u00a3240 + 20% of \u00a3240 = \u00a3240 + \u00a348 = \u00a3288",
            interactSalePrice: 320, interactDiscount: 20, interactCorrectOriginal: 400
          },
          {
            name: "Rosie", pronoun: "She",
            salePrice: 150, discount: 25,
            wrongOriginal: "187.50", correctOriginal: 200,
            mistake: "found 25% of \u00a3150 (\u00a337.50) and added it on — but \u00a3150 is 75% of the original, not 100%",
            wrongMethod: "\u00a3150 + 25% of \u00a3150 = \u00a3150 + \u00a337.50 = \u00a3187.50",
            interactSalePrice: 225, interactDiscount: 25, interactCorrectOriginal: 300
          },
          {
            name: "Alfie", pronoun: "He",
            salePrice: 180, discount: 10,
            wrongOriginal: 198, correctOriginal: 200,
            mistake: "found 10% of \u00a3180 (\u00a318) and added it back — but \u00a3180 represents 90%, not 100%",
            wrongMethod: "\u00a3180 + 10% of \u00a3180 = \u00a3180 + \u00a318 = \u00a3198",
            interactSalePrice: 360, interactDiscount: 10, interactCorrectOriginal: 400
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}'s reverse percentage trap!`,
            body: (v) => `${v.name} paid **\u00a3${v.salePrice}** after **${v.discount}% off**. ${v.pronoun} worked out the original price like this:\n\n${v.wrongMethod}\n\nBut something's wrong...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: \u00a3${v.wrongOriginal}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The classic reverse percentage trap!",
            body: (v) => `${v.name} ${v.mistake}\n\nThe correct way: \u00a3${v.salePrice} = **${100 - v.discount}%**.\n\n1% = \u00a3${v.salePrice} \u00f7 ${100 - v.discount} = \u00a3${v.salePrice / (100 - v.discount)}\n100% = \u00a3${v.salePrice / (100 - v.discount)} \u00d7 100 = **\u00a3${v.correctOriginal}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.discount}% of £${v.salePrice} added back`, why: `£${v.salePrice} is NOT 100% — it's ${100 - v.discount}%!` },
                  { text: `Correct: £${v.salePrice} = ${100 - v.discount}%`, why: `100% - ${v.discount}% = ${100 - v.discount}%` },
                  { text: `1% = £${v.salePrice / (100 - v.discount)}`, why: `£${v.salePrice} ÷ ${100 - v.discount}` },
                  { text: `100% = £${v.correctOriginal}`, result: `Original = £${v.correctOriginal} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `After a 20% discount, the sale price represents 80% of the original`, answer: true, explanation: "Correct — 100% - 20% = 80%, so the sale price is 80%. ✓" },
                { text: `To find the original price after a discount, just add the discount percentage back to the sale price`, answer: false, explanation: "That's the classic trap! The sale price isn't 100% — you must find 1% first, then scale to 100%." }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct original?",
            body: (v) => `After **${v.interactDiscount}% off**, the price is **\u00a3${v.interactSalePrice}**. What was the original price?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: 100 - v.interactDiscount, label: `\u00a3${v.interactSalePrice}`, color: "#818cf8" },
                  { value: v.interactDiscount, label: `${v.interactDiscount}% off`, color: "#f87171" }
                ],
                totalLabel: "100% = ?",
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Original price before ${v.interactDiscount}% off?`,
              getOptions: (v) => generateDistractors(v.interactCorrectOriginal),
              correctAnswer: (v) => v.interactCorrectOriginal,
              feedback: {
                correct: (v) => `Spot on! \u00a3${v.interactSalePrice} = ${100 - v.interactDiscount}%, so original = **\u00a3${v.interactCorrectOriginal}**. Don't fall for the trap! ✓`,
                incorrect: (v) => `Not quite! \u00a3${v.interactSalePrice} is ${100 - v.interactDiscount}% of the original. \u00a3${v.interactSalePrice} \u00f7 ${100 - v.interactDiscount} \u00d7 100 = **\u00a3${v.interactCorrectOriginal}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't use the sale price as 100%!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The biggest reverse percentage trap:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 75, label: "\u00a3150 = 75%", color: "#818cf8" },
                    { value: 25, label: "25% off", color: "#f87171" }
                  ],
                  totalLabel: "Original = \u00a3150 \u00f7 75 \u00d7 100 = \u00a3200 (NOT \u00a3187.50!)",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "WRONG: finding % of the sale price and adding back", why: "The sale price is NOT 100% \u2014 it's less!" },
                    { text: "RIGHT: work out what % the sale price represents", why: "20% off means the sale price is 80%" },
                    { text: "Then find 1% and scale up to 100%", why: "This gives you the TRUE original \u2713" }
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
  // SUB-CONCEPT 12: successive-percentages
  // Why two 10% discounts != 20% off
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "successive-percentages",
    name: "Successive Percentage Changes",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "successive-percentages-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "Why two 10% discounts don't equal a 20% discount",
          "How to apply percentage changes one step at a time"
        ],
        variableSets: [
          {
            name: "A clothes shop",
            scenario: "offers 10% off, then another 10% off the sale price. A jacket is",
            original: 100, percentA: 10, percentB: 10,
            afterFirst: 90, afterSecond: 81,
            naiveResult: 80, actualPercent: 19,
            naivePercent: 20,
            unit: "\u00a3",
            interactOriginal: 200, interactPercentA: 20, interactPercentB: 10, interactAfterFirst: 160, interactAfterSecond: 144, interactNaivePercent: 30
          },
          {
            name: "A bookshop",
            scenario: "gives 20% off, then a further 10% off. A book costs",
            original: 50, percentA: 20, percentB: 10,
            afterFirst: 40, afterSecond: 36,
            naiveResult: 35, actualPercent: 28,
            naivePercent: 30,
            unit: "\u00a3",
            interactOriginal: 100, interactPercentA: 20, interactPercentB: 10, interactAfterFirst: 80, interactAfterSecond: 72, interactNaivePercent: 30
          },
          {
            name: "An electronics shop",
            scenario: "has 25% off, then an extra 20% off sale items. A tablet costs",
            original: 200, percentA: 25, percentB: 20,
            afterFirst: 150, afterSecond: 120,
            naiveResult: 110, actualPercent: 40,
            naivePercent: 45,
            unit: "\u00a3",
            interactOriginal: 300, interactPercentA: 20, interactPercentB: 25, interactAfterFirst: 240, interactAfterSecond: 180, interactNaivePercent: 45
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.percentA}% off + ${v.percentB}% off = ${v.naivePercent}% off... right?`,
            body: (v) => `${v.name} ${v.scenario} **${v.unit}${v.original}**.\n\nYou might think ${v.percentA}% off then ${v.percentB}% off is the same as **${v.naivePercent}% off**. But it's NOT! Let's see why...`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.afterSecond, label: `${v.unit}${v.afterSecond}?`, color: "#818cf8" },
                  { value: v.original - v.afterSecond, label: `Saved`, color: "#34d399" }
                ],
                totalLabel: `${v.unit}${v.original} original`,
                showValues: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Apply each discount one at a time!",
            body: (v) => `**Discount 1:** ${v.percentA}% off ${v.unit}${v.original} = ${v.unit}${v.original * v.percentA / 100} off \u2192 ${v.unit}${v.afterFirst}\n\n**Discount 2:** ${v.percentB}% off ${v.unit}${v.afterFirst} (NOT ${v.unit}${v.original}!) = ${v.unit}${v.afterFirst * v.percentB / 100} off \u2192 ${v.unit}${v.afterSecond}\n\nThe second discount applies to the **already reduced price**, so you save less than you'd think!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start: ${v.unit}${v.original}`, why: "Original price" },
                  { text: `${v.percentA}% off: ${v.unit}${v.original} - ${v.unit}${v.original * v.percentA / 100}`, result: `= ${v.unit}${v.afterFirst}` },
                  { text: `${v.percentB}% off ${v.unit}${v.afterFirst}: ${v.unit}${v.afterFirst} - ${v.unit}${v.afterFirst * v.percentB / 100}`, result: `= ${v.unit}${v.afterSecond}` },
                  { text: `Total saving: ${v.unit}${v.original - v.afterSecond} (= ${v.actualPercent}%, not ${v.naivePercent}%)`, result: `Final price: ${v.unit}${v.afterSecond} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the final price?",
            body: (v) => `**${v.unit}${v.interactOriginal}** with **${v.interactPercentA}% off**, then **${v.interactPercentB}% off** the sale price. What do you actually pay?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactAfterSecond, label: "You pay", color: "#818cf8" },
                  { value: v.interactAfterFirst - v.interactAfterSecond, label: `2nd ${v.interactPercentB}%`, color: "#fbbf24" },
                  { value: v.interactOriginal - v.interactAfterFirst, label: `1st ${v.interactPercentA}%`, color: "#34d399" }
                ],
                totalLabel: `${v.unit}${v.interactOriginal}`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.unit}${v.interactOriginal} after ${v.interactPercentA}% off then ${v.interactPercentB}% off?`,
              getOptions: (v) => generateDistractors(v.interactAfterSecond),
              correctAnswer: (v) => v.interactAfterSecond,
              feedback: {
                correct: (v) => `Yes! ${v.interactPercentA}% off = ${v.unit}${v.interactAfterFirst}. Then ${v.interactPercentB}% off that = **${v.unit}${v.interactAfterSecond}**. NOT the same as ${v.interactNaivePercent}% off! ✓`,
                incorrect: (v) => `Not quite! First: ${v.interactPercentA}% off ${v.unit}${v.interactOriginal} = ${v.unit}${v.interactAfterFirst}. Then: ${v.interactPercentB}% off ${v.unit}${v.interactAfterFirst} = **${v.unit}${v.interactAfterSecond}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You can't just add percentages!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When there are two percentage changes, apply them **one at a time**:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 81, label: "You pay: \u00a381", color: "#818cf8" },
                    { value: 9, label: "2nd 10%", color: "#fbbf24" },
                    { value: 10, label: "1st 10%", color: "#34d399" }
                  ],
                  totalLabel: "\u00a3100 \u2192 10% off \u2192 \u00a390 \u2192 10% off \u2192 \u00a381 (not \u00a380!)",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Apply the FIRST percentage change", why: "Work out the new amount after step 1" },
                    { text: "Apply the SECOND percentage to the NEW amount", why: "NOT to the original!" },
                    { text: "Two 10% discounts = 19% total, not 20%", why: "The second 10% is 10% of a smaller number \u2713" }
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
        id: "successive-percentages-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the trap of adding successive percentages together",
          "When to watch out for applying the second percentage to the wrong amount"
        ],
        variableSets: [
          {
            name: "Jake",
            original: 200, percentA: 10, percentB: 10,
            wrongFinal: 160, correctFinal: 162,
            afterFirst: 180,
            mistake: "added 10% + 10% = 20% and took 20% off \u00a3200 in one go",
            wrongMethod: "10% + 10% = 20%, so 20% of \u00a3200 = \u00a340 off, final = \u00a3160",
            interactOriginal: 300, interactPercentA: 10, interactPercentB: 10, interactAfterFirst: 270, interactCorrectFinal: 243
          },
          {
            name: "Rosie",
            original: 80, percentA: 25, percentB: 10,
            wrongFinal: 52, correctFinal: 54,
            afterFirst: 60,
            mistake: "added 25% + 10% = 35% and took 35% off \u00a380",
            wrongMethod: "25% + 10% = 35%, so 35% of \u00a380 = \u00a328 off, final = \u00a352",
            interactOriginal: 120, interactPercentA: 25, interactPercentB: 10, interactAfterFirst: 90, interactCorrectFinal: 81
          },
          {
            name: "Alfie",
            original: 150, percentA: 20, percentB: 20,
            wrongFinal: 90, correctFinal: 96,
            afterFirst: 120,
            mistake: "added 20% + 20% = 40% and took 40% off \u00a3150",
            wrongMethod: "20% + 20% = 40%, so 40% of \u00a3150 = \u00a360 off, final = \u00a390",
            interactOriginal: 250, interactPercentA: 20, interactPercentB: 20, interactAfterFirst: 200, interactCorrectFinal: 160
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} just added the percentages!`,
            body: (v) => `A shop gives **${v.percentA}% off**, then another **${v.percentB}% off** the sale price. The item costs **\u00a3${v.original}**.\n\n${v.name}'s working: ${v.wrongMethod}\n\nIs that right?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: \u00a3${v.wrongFinal}`, why: "Can you spot the mistake?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You can't just add the percentages!",
            body: (v) => `${v.name} ${v.mistake}. But the second discount applies to the **reduced price**, not the original!\n\n**Step 1:** ${v.percentA}% off \u00a3${v.original} = \u00a3${v.afterFirst}\n**Step 2:** ${v.percentB}% off \u00a3${v.afterFirst} = \u00a3${v.correctFinal}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.percentA}% + ${v.percentB}% = ${v.percentA + v.percentB}% off £${v.original}`, why: `Gives £${v.wrongFinal} — incorrect!` },
                  { text: `Step 1: ${v.percentA}% off £${v.original}`, result: `= £${v.afterFirst}` },
                  { text: `Step 2: ${v.percentB}% off £${v.afterFirst}`, result: `= £${v.correctFinal}` },
                  { text: `Correct answer: £${v.correctFinal}`, result: `(not £${v.wrongFinal}) ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `${v.percentA}% off then ${v.percentB}% off is the same as ${v.percentA + v.percentB}% off`, answer: false, explanation: `The second discount applies to the already reduced price, not the original — so the total saving is less than ${v.percentA + v.percentB}%.` },
                { text: `The second discount applies to the reduced price, not the original`, answer: true, explanation: "Correct — each successive discount is on the new, smaller amount. ✓" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct final price?",
            body: (v) => `\u00a3${v.interactOriginal} with ${v.interactPercentA}% off, then ${v.interactPercentB}% off the sale price. What do you pay?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  { value: v.interactCorrectFinal, label: "You pay", color: "#818cf8" },
                  { value: v.interactOriginal - v.interactCorrectFinal, label: "Total saving", color: "#34d399" }
                ],
                totalLabel: `\u00a3${v.interactOriginal} original`,
                showValues: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `\u00a3${v.interactOriginal} after ${v.interactPercentA}% off then ${v.interactPercentB}% off?`,
              getOptions: (v) => generateDistractors(v.interactCorrectFinal),
              correctAnswer: (v) => v.interactCorrectFinal,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactPercentA}% off = \u00a3${v.interactAfterFirst}, then ${v.interactPercentB}% off that = **\u00a3${v.interactCorrectFinal}**. ✓`,
                incorrect: (v) => `Not quite! Step 1: \u00a3${v.interactAfterFirst}. Step 2: ${v.interactPercentB}% off \u00a3${v.interactAfterFirst} = **\u00a3${v.interactCorrectFinal}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Never add successive percentages!",
            bodyParts: [
              {
                type: 'text',
                content: () => `This is one of the trickiest percentage traps in the 11+:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 96, label: "\u00a396", color: "#818cf8" },
                    { value: 24, label: "2nd 20%", color: "#fbbf24" },
                    { value: 30, label: "1st 20%", color: "#34d399" }
                  ],
                  totalLabel: "\u00a3150: 20% off \u2192 \u00a3120 \u2192 20% off \u2192 \u00a396 (not \u00a390!)",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Never add successive percentages together", why: "10% off then 10% off \u2260 20% off!" },
                    { text: "Apply each percentage change to the CURRENT value", why: "The second change uses the new (smaller or bigger) amount" },
                    { text: "Two 10% discounts actually save 19%, not 20%", why: "Because the second 10% is from a smaller number \u2713" }
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
  // SUB-CONCEPT 13: percentage-word-problems
  // Multi-step percentage word problems
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "percentage-word-problems",
    name: "Percentage Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "percentage-word-problems-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot whether a problem is asking for increase, decrease, or a simple percentage",
          "How to check your answer makes sense in context"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "A clothes shop has a sale with 30% off everything. Aisha buys a dress that was \u00a360 and a scarf that was \u00a320. How much does she spend in total?",
            item1: "dress", price1: 60, item2: "scarf", price2: 20,
            totalOriginal: 80, discount: 30,
            saving: 24, answer: 56,
            type: "decrease",
            unit: "\u00a3",
            interactTotalOriginal: 100, interactDiscount: 20, interactSaving: 20, interactAnswer: 80
          },
          {
            name: "Ben",
            scenario: "Ben scored 45 out of 60 on his English test and 32 out of 50 on his maths test. Which test did he do better on, as a percentage?",
            score1: 45, total1: 60, percent1: 75,
            score2: 32, total2: 50, percent2: 64,
            answer: 75,
            better: "English",
            type: "express",
            unit: "%",
            interactScore1: 28, interactTotal1: 40, interactPercent1: 70,
            interactScore2: 39, interactTotal2: 50, interactPercent2: 78,
            interactAnswer: 78, interactBetter: "Maths"
          },
          {
            name: "Chloe",
            scenario: "A town has a population of 5000. It grows by 12% in one year. How many people live there now?",
            original: 5000, percent: 12,
            increase: 600, answer: 5600,
            type: "increase",
            unit: "",
            interactOriginal: 4000, interactPercent: 15, interactIncrease: 600, interactAnswer: 4600
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What type of percentage question is this?",
            body: (v) => `${v.scenario}\n\nBefore you start calculating, ask: **what kind of percentage problem is this?** Is it finding a %, increase, decrease, or comparing?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Question type: ${v.type === "decrease" ? "Percentage decrease (discount)" : v.type === "increase" ? "Percentage increase" : "Express as a percentage (compare)"}`, why: "Read the question carefully to identify the type" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Solve it step by step!",
            body: (v) => {
              if (v.type === "decrease") {
                return `This is a **percentage decrease** problem.\n\nTotal before sale: ${v.unit}${v.price1} + ${v.unit}${v.price2} = ${v.unit}${v.totalOriginal}\n30% of ${v.unit}${v.totalOriginal} = ${v.unit}${v.saving}\nSale price: ${v.unit}${v.totalOriginal} - ${v.unit}${v.saving} = **${v.unit}${v.answer}**`;
              } else if (v.type === "increase") {
                return `This is a **percentage increase** problem.\n\n12% of ${v.original} = ${v.increase}\nNew population: ${v.original} + ${v.increase} = **${v.answer} people**`;
              }
              return `This is an **express as percentage** problem.\n\nEnglish: (${v.score1} \u00f7 ${v.total1}) \u00d7 100 = ${v.percent1}%\nMaths: (${v.score2} \u00f7 ${v.total2}) \u00d7 100 = ${v.percent2}%\n\n**${v.better}** was better at **${v.answer}%**`;
            },
            visual: {
              component: "WorkedExample",
              props: (v) => {
                if (v.type === "decrease") {
                  return {
                    steps: [
                      { text: `Add the original prices: ${v.unit}${v.price1} + ${v.unit}${v.price2}`, result: `= ${v.unit}${v.totalOriginal}` },
                      { text: `Find ${v.discount}% of ${v.unit}${v.totalOriginal}`, result: `= ${v.unit}${v.saving}` },
                      { text: `Subtract: ${v.unit}${v.totalOriginal} - ${v.unit}${v.saving}`, result: `= ${v.unit}${v.answer} ✓` }
                    ],
                    allRevealed: false
                  };
                } else if (v.type === "increase") {
                  return {
                    steps: [
                      { text: `Find ${v.percent}% of ${v.original}`, why: "10% = 500, so 12% = 600", result: `= ${v.increase}` },
                      { text: `Add to original: ${v.original} + ${v.increase}`, result: `= ${v.answer} people ✓` }
                    ],
                    allRevealed: false
                  };
                }
                return {
                  steps: [
                    { text: `English: (${v.score1} \u00f7 ${v.total1}) \u00d7 100`, result: `= ${v.percent1}%` },
                    { text: `Maths: (${v.score2} \u00f7 ${v.total2}) \u00d7 100`, result: `= ${v.percent2}%` },
                    { text: `${v.better} is higher`, result: `${v.answer}% ✓` }
                  ],
                  allRevealed: false
                };
              }
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the answer?",
            body: (v) => {
              if (v.type === "decrease") return `A different shop has ${v.interactDiscount}% off everything. You buy items totalling \u00a3${v.interactTotalOriginal}. What do you pay?`;
              if (v.type === "increase") return `A city has ${v.interactOriginal} people. It grows by ${v.interactPercent}%. What is the new population?`;
              return `Mia scored ${v.interactScore1} out of ${v.interactTotal1} on English and ${v.interactScore2} out of ${v.interactTotal2} on Maths. What was her best percentage?`;
            },
            visual: {
              component: "BarModel",
              props: (v) => {
                if (v.type === "decrease") {
                  return {
                    segments: [
                      { value: 100 - v.interactDiscount, label: `You pay: ?`, color: "#818cf8" },
                      { value: v.interactDiscount, label: `${v.interactDiscount}% off`, color: "#f87171" }
                    ],
                    totalLabel: `\u00a3${v.interactTotalOriginal} total`,
                    showValues: true
                  };
                } else if (v.type === "increase") {
                  return {
                    segments: [
                      { value: 100, label: `${v.interactOriginal}`, color: "#818cf8" },
                      { value: v.interactPercent, label: `+${v.interactPercent}%`, color: "#34d399" }
                    ],
                    totalLabel: "New population?",
                    showValues: true
                  };
                }
                return {
                  segments: [
                    { value: v.interactPercent1, label: `English ${v.interactPercent1}%`, color: "#c084fc" },
                    { value: v.interactPercent2, label: `Maths ${v.interactPercent2}%`, color: "#38bdf8" }
                  ],
                  totalLabel: "Which is higher?",
                  showValues: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => {
                if (v.type === "decrease") return `Total sale spend after ${v.interactDiscount}% off?`;
                if (v.type === "increase") return `New population after ${v.interactPercent}% growth?`;
                return `Best test score as a percentage?`;
              },
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => {
                  if (v.type === "decrease") return `Yes! ${v.interactDiscount}% of \u00a3${v.interactTotalOriginal} = \u00a3${v.interactSaving}. You pay \u00a3${v.interactTotalOriginal} - \u00a3${v.interactSaving} = **\u00a3${v.interactAnswer}**. ✓`;
                  if (v.type === "increase") return `Yes! ${v.interactPercent}% of ${v.interactOriginal} = ${v.interactIncrease}. New total: ${v.interactOriginal} + ${v.interactIncrease} = **${v.interactAnswer}**. ✓`;
                  return `Yes! English = ${v.interactPercent1}%, Maths = ${v.interactPercent2}%. **${v.interactBetter}** was best at **${v.interactAnswer}%**. ✓`;
                },
                incorrect: (v) => {
                  if (v.type === "decrease") return `Not quite! Total = \u00a3${v.interactTotalOriginal}. ${v.interactDiscount}% off = \u00a3${v.interactSaving}. Answer: **\u00a3${v.interactAnswer}**.`;
                  if (v.type === "increase") return `Not quite! ${v.interactPercent}% of ${v.interactOriginal} = ${v.interactIncrease}. Add: **${v.interactAnswer}**.`;
                  return `Not quite! English: ${v.interactPercent1}%, Maths: ${v.interactPercent2}%. Best = **${v.interactAnswer}%**.`;
                }
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tackling percentage word problems",
            bodyParts: [
              {
                type: 'text',
                content: () => `Before you calculate, **read the question** and decide what type it is:`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 70, label: "You pay: 70%", color: "#818cf8" },
                    { value: 30, label: "30% off", color: "#f87171" }
                  ],
                  totalLabel: "Decrease? Find the %, then subtract!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Identify the type", why: "Increase? Decrease? Express as %? Compare?" },
                    { text: "Step 2: Pick the right method", why: "Increase = find % then add. Decrease = find % then subtract. Express = (part\u00f7whole)\u00d7100" },
                    { text: "Step 3: Sense-check your answer", why: "Does it make sense in the real world? \u2713" }
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
        id: "percentage-word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing increase, decrease, and simple percentage questions",
          "When to watch out for answers that are bigger or smaller than they should be"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "A shop has 20% off. Jake buys a \u00a345 jumper.",
            original: 45, percent: 20,
            wrongAnswer: 9,
            correctAnswer: 36,
            mistake: "found 20% correctly (\u00a39) but forgot to subtract it from \u00a345 — he gave the discount amount, not the sale price",
            wrongMethod: "20% of \u00a345 = \u00a39. Answer: \u00a39",
            interactOriginal: 70, interactPercent: 30, interactCorrectAnswer: 49
          },
          {
            name: "Rosie",
            scenario: "A village had 800 people. The population increased by 15%.",
            original: 800, percent: 15,
            wrongAnswer: 120,
            correctAnswer: 920,
            mistake: "found 15% (120 people) but forgot to add it to the original — she gave just the increase, not the new total",
            wrongMethod: "15% of 800 = 120. Answer: 120 people",
            interactOriginal: 600, interactPercent: 20, interactCorrectAnswer: 720
          },
          {
            name: "Alfie",
            scenario: "Alfie scored 36 out of 40 on a test.",
            original: 40, part: 36,
            wrongAnswer: 36,
            correctAnswer: 90,
            mistake: "gave his raw score (36) instead of converting to a percentage — he forgot the (\u00f7 whole) \u00d7 100 step",
            wrongMethod: "36 out of 40... so 36%?",
            interactPart: 28, interactOriginal: 50, interactCorrectAnswer: 56
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} answer the question?`,
            body: (v) => `${v.scenario}\n\n${v.name}'s working: ${v.wrongMethod}\n\n${v.name} did some correct maths, but didn't actually answer the question! Can you see why?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: "Something's missing..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the question again!",
            body: (v) => `${v.name} ${v.mistake}.\n\nThe key: always re-read the question at the end. **What is it actually asking for?** The discount or the price? The increase or the new total? A raw score or a percentage?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name} found the right number...`, why: `${v.wrongAnswer} is a correct intermediate step` },
                  { text: `...but didn't finish!`, why: `${v.name} ${v.mistake}` },
                  { text: `Correct answer: ${v.correctAnswer}`, result: `Always check you've answered what was asked ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `After solving a percentage word problem, you should re-read the question to check you answered what was asked`, answer: true, explanation: "Always check — the question might ask for the final price, not the discount amount. ✓" },
                { text: `If the question asks for the sale price and you found the discount, you're done`, answer: false, explanation: "Finding the discount is only halfway — you still need to subtract it from the original!" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the actual answer?",
            body: (v) => {
              if (v.interactPart) return `A pupil scored ${v.interactPart} out of ${v.interactOriginal} on a test. What percentage is that?`;
              if (v.percent === 20) return `A shop has ${v.interactPercent}% off. You buy an item costing \u00a3${v.interactOriginal}. What do you pay?`;
              return `A town has ${v.interactOriginal} people. It grows by ${v.interactPercent}%. What is the new population?`;
            },
            visual: {
              component: "BarModel",
              props: (v) => {
                if (v.interactPart) {
                  return {
                    segments: [
                      { value: v.interactPart, label: `${v.interactPart}`, color: "#c084fc" },
                      { value: v.interactOriginal - v.interactPart, label: `${v.interactOriginal - v.interactPart}`, color: "#e5e7eb", empty: true }
                    ],
                    totalLabel: `${v.interactOriginal} total — what %?`,
                    showValues: true
                  };
                }
                return {
                  segments: [
                    { value: 100 - (v.interactPercent || 0), label: "Main part", color: "#818cf8" },
                    { value: v.interactPercent || 15, label: `${v.interactPercent || 15}%`, color: "#34d399" }
                  ],
                  totalLabel: `What's the final amount?`,
                  showValues: true
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the correct final answer?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! The answer is **${v.interactCorrectAnswer}**. Always finish the question — don't stop halfway! ✓`,
                incorrect: (v) => `Not quite! The final answer is **${v.interactCorrectAnswer}**. Remember to complete all the steps.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Always answer what's asked!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common mistake in percentage word problems: doing the maths right but not finishing.`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: () => ({
                  segments: [
                    { value: 36, label: "\u00a336 sale price", color: "#818cf8" },
                    { value: 9, label: "\u00a39 discount", color: "#f87171" }
                  ],
                  totalLabel: "Question asks for sale price, not the discount!",
                  showValues: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "After finding the %, re-read the question", why: "Does it want the percentage or the final amount?" },
                    { text: "Discount questions: subtract from original!", why: "Don't just give the discount amount" },
                    { text: "Increase questions: add to original!", why: "Don't just give the increase" },
                    { text: "Sense check: does your answer make sense?", why: "A sale price should be LESS than the original \u2713" }
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

]; // end of percentagesSubConcepts array

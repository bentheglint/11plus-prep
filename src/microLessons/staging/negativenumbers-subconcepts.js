// ============================================================
// Supplementary sub-concepts for Negative Numbers
// To merge: add these to lessonBank.negativenumbers.subConcepts array in lessonData.js
// ============================================================
import { generateDistractors } from '../lessonData.js';

export const negativeNumbersSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: understanding-negatives
  // What negative numbers mean
  // Category: core
  // Lesson A: curiosity-hook | Lesson B: visual-discovery
  // ==========================================
  {
    id: "understanding-negatives",
    name: "What Negative Numbers Mean",
    category: "core",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "understanding-neg-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to understand what a negative number represents in real life",
          "How to see that negative numbers sit below zero on a number line"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "checking the temperature outside on a freezing morning in Scotland",
            context: "temperature",
            negValue: -5,
            zeroMeaning: "water freezes",
            negMeaning: "5 degrees below freezing",
            unit: "°C",
            lineMin: -8,
            lineMax: 5
          },
          {
            name: "Oliver",
            scenario: "checking his pocket money app after spending more than he had saved",
            context: "money",
            negValue: -3,
            zeroMeaning: "no money — breaking even",
            negMeaning: "£3 in debt — he needs to earn £3 just to get back to zero",
            unit: "£",
            lineMin: -6,
            lineMax: 5
          },
          {
            name: "Fatima",
            scenario: "visiting a museum with underground floors",
            context: "floors",
            negValue: -2,
            zeroMeaning: "ground level",
            negMeaning: "2 floors underground",
            unit: "floors",
            lineMin: -4,
            lineMax: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does ${v.negValue} mean?`,
            body: (v) => `${v.name} is ${v.scenario}. The display shows **${v.negValue}${v.unit}**.\n\nBut what does that little minus sign mean? Can a number really be **less than zero**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: 0, label: "0", color: "#9ca3af" },
                  { value: v.negValue, label: `${v.negValue}`, color: "#3b82f6" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Below zero!",
            body: (v) => `A **negative number** is a number **less than zero**. Zero means ${v.zeroMeaning}.\n\nSo **${v.negValue}** means **${v.negMeaning}**.\n\nOn a number line, negative numbers go to the **left** of zero. The further left, the smaller the number!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: 0, label: "0", color: "#9ca3af" },
                  { value: v.negValue, label: `${v.negValue}`, color: "#3b82f6" },
                  { value: Math.abs(v.negValue), label: `${Math.abs(v.negValue)}`, color: "#22c55e" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.lineMin, 0]
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A negative number is a number less than ____`,
              options: (v) => ["zero", "one", "ten", "two"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Negative numbers are less than zero — they sit to the left on the number line. ✓`,
                incorrect: (v) => `Not quite — negative numbers are less than zero.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Where is it on the number line?",
            body: (v) => `${v.negValue} is on which side of zero?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Where is ${v.negValue} on the number line?`,
              getOptions: (v) => [
                `To the LEFT of zero`,
                `To the RIGHT of zero`,
                `At zero`,
                `It doesn't go on a number line`,
                `Above zero`
              ],
              correctAnswer: () => `To the LEFT of zero`,
              feedback: {
                correct: (v) => `Exactly! Negative numbers always sit to the **left** of zero on a number line. ${v.negValue} means ${v.negMeaning}! ✓`,
                incorrect: (v) => `Not quite! Negative numbers go to the **left** of zero. Positive numbers go to the right. ${v.negValue} is to the left.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Negatives are below zero!",
            body: () => `Negative numbers are just numbers **below zero**. They appear everywhere in real life!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Negative numbers are LESS than zero", why: "The minus sign tells you it's below zero" },
                  { text: "They go to the LEFT on a number line", why: "Further left = smaller number" },
                  { text: "Real-life examples: temperature, debt, depth, underground floors", why: "You'll see them everywhere once you start looking! ✓" }
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
        id: "understanding-neg-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that the number line extends below zero",
          "How to read negative numbers from a number line"
        ],
        variableSets: [
          {
            name: "Ben",
            numbers: [-4, -1, 2, 5],
            negCount: 2,
            posCount: 2,
            lineMin: -6,
            lineMax: 7
          },
          {
            name: "Daisy",
            numbers: [-3, -6, 1, 4],
            negCount: 2,
            posCount: 2,
            lineMin: -8,
            lineMax: 6
          },
          {
            name: "Jack",
            numbers: [-2, -5, 0, 3],
            negCount: 2,
            posCount: 2,
            lineMin: -7,
            lineMax: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What do you notice?",
            body: (v) => `Look at the number line below. Some numbers have a minus sign and some don't. What do you notice about where each group sits?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: v.numbers.map(n => ({
                  value: n,
                  label: `${n}`,
                  color: n < 0 ? "#3b82f6" : n === 0 ? "#9ca3af" : "#22c55e"
                })),
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two sides of zero",
            body: (v) => `The number line has **two sides**:\n\n- **Left of zero** → negative numbers (with a minus sign)\n- **Right of zero** → positive numbers\n- **Zero** is right in the middle — it's neither positive nor negative!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: 0, label: "ZERO", color: "#9ca3af" },
                  { value: v.lineMin + 1, label: "Negatives ←", color: "#3b82f6" },
                  { value: v.lineMax - 1, label: "→ Positives", color: "#22c55e" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Left of zero", right: "Negative" },
                { left: "Right of zero", right: "Positive" },
                { left: "In the middle", right: "Zero" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Which are negative?",
            body: (v) => `How many of these numbers are **negative**: ${v.numbers.join(', ')}?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: v.numbers.map(n => ({
                  value: n,
                  label: `${n}`,
                  color: n < 0 ? "#3b82f6" : n === 0 ? "#9ca3af" : "#22c55e"
                })),
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many of these numbers are negative?`,
              getOptions: (v) => generateDistractors(v.negCount),
              correctAnswer: (v) => v.negCount,
              feedback: {
                correct: (v) => `Spot on! **${v.negCount}** of those numbers are negative — they're the ones with a minus sign, sitting left of zero! ✓`,
                incorrect: (v) => `Not quite! Count the ones with a minus sign (left of zero). There are **${v.negCount}** negative numbers.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The number line goes both ways!",
            body: () => `The number line doesn't stop at zero — it keeps going left into the negatives. The further left, the smaller the number!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Left of zero = NEGATIVE numbers", why: "They have a minus sign: -1, -2, -3..." },
                  { text: "Right of zero = POSITIVE numbers", why: "These are the numbers you already know: 1, 2, 3..." },
                  { text: "Zero is in the middle", why: "It's the dividing line between positive and negative ✓" }
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
  // SUB-CONCEPT 2: counting-through-zero
  // Counting forwards and backwards through zero
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "counting-through-zero",
    name: "Counting Through Zero",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "counting-zero-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to count forwards through zero from a negative number",
          "How to count backwards through zero into negatives"
        ],
        variableSets: [
          {
            name: "Lauren",
            direction: "forwards",
            start: -3,
            steps: 7,
            end: 4,
            sequence: [-3, -2, -1, 0, 1, 2, 3, 4],
            lineMin: -5,
            lineMax: 6,
            // Interact uses different values so the answer isn't already revealed
            interactStart: -2,
            interactSteps: 6,
            interactEnd: 4,
            interactDirection: "forwards",
            interactSequence: [-2, -1, 0, 1, 2, 3, 4],
            interactLineMin: -4,
            interactLineMax: 6
          },
          {
            name: "James",
            direction: "backwards",
            start: 2,
            steps: 5,
            end: -3,
            sequence: [2, 1, 0, -1, -2, -3],
            lineMin: -5,
            lineMax: 4,
            interactStart: 3,
            interactSteps: 7,
            interactEnd: -4,
            interactDirection: "backwards",
            interactSequence: [3, 2, 1, 0, -1, -2, -3, -4],
            interactLineMin: -6,
            interactLineMax: 5
          },
          {
            name: "Sophie",
            direction: "forwards",
            start: -5,
            steps: 9,
            end: 4,
            sequence: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4],
            lineMin: -7,
            lineMax: 6,
            interactStart: -4,
            interactSteps: 8,
            interactEnd: 4,
            interactDirection: "forwards",
            interactSequence: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
            interactLineMin: -6,
            interactLineMax: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Count ${v.direction} from ${v.start}`,
            body: (v) => `${v.name} starts at **${v.start}** and counts **${v.steps} steps ${v.direction}**.\n\nWhat number will ${v.name} land on? We'll need to count **through zero**!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.start, label: `Start: ${v.start}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count step by step",
            body: (v) => `Let's count ${v.steps} steps ${v.direction} from **${v.start}**. Don't skip ahead — just count one number at a time, right through zero. Zero is just another number in the sequence!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: v.sequence.map((n, i) => ({
                  value: n,
                  label: `${n}`,
                  color: n === v.start ? "#3b82f6" : n === v.end ? "#22c55e" : n === 0 ? "#9ca3af" : "#c084fc"
                })),
                jumps: v.direction === "forwards"
                  ? [{ from: v.start, to: v.end, label: `+${v.steps}` }]
                  : [{ from: v.start, to: v.end, label: `${v.end - v.start}` }],
                tickInterval: 1,
                showLabels: true,
                highlight: [Math.min(v.start, v.end), Math.max(v.start, v.end)]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Start at **${v.interactStart}**. Count **${v.interactSteps} steps ${v.interactDirection}**.\n\nWhat number do you land on?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Start at ${v.interactStart}, count ${v.interactSteps} ${v.interactDirection}. Where do you land?`,
              getOptions: (v) => generateDistractors(v.interactEnd),
              correctAnswer: (v) => v.interactEnd,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactStart} ${v.interactDirection === 'forwards' ? '+' : '−'} ${v.interactSteps} = **${v.interactEnd}**. You counted straight through zero! ✓`,
                incorrect: (v) => `Not quite! Count from ${v.interactStart}: ${v.interactSequence.join(', ')}. You land on **${v.interactEnd}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Zero is just a stepping stone!",
            body: () => `When counting through zero, just keep going — zero is just another number in the sequence!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Counting forwards: ..., -2, -1, 0, 1, 2, ...", why: "The numbers keep going up" },
                  { text: "Counting backwards: ..., 2, 1, 0, -1, -2, ...", why: "The numbers keep going down" },
                  { text: "Zero is NOT a wall!", why: "Don't stop or skip at zero — just count through it ✓" }
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
        id: "counting-zero-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why you must not skip zero when counting",
          "How to spot counting errors across zero"
        ],
        variableSets: [
          {
            name: "Mia",
            start: -2,
            steps: 5,
            direction: "forwards",
            wrongAnswer: 4,
            correctAnswer: 3,
            mistake: "skipped zero when counting, jumping from -1 straight to 1",
            wrongSequence: "-2, -1, 1, 2, 3, 4",
            correctSequence: "-2, -1, 0, 1, 2, 3",
            lineMin: -4,
            lineMax: 6,
            // Interact uses different values so the answer isn't already revealed
            interactStart: -3,
            interactSteps: 6,
            interactDirection: "forwards",
            interactCorrectAnswer: 3,
            interactCorrectSequence: "-3, -2, -1, 0, 1, 2, 3",
            interactLineMin: -5,
            interactLineMax: 5
          },
          {
            name: "Harry",
            start: 3,
            steps: 6,
            direction: "backwards",
            wrongAnswer: -4,
            correctAnswer: -3,
            mistake: "skipped zero, going from 1 straight to -1",
            wrongSequence: "3, 2, 1, -1, -2, -3, -4",
            correctSequence: "3, 2, 1, 0, -1, -2, -3",
            lineMin: -6,
            lineMax: 5,
            interactStart: 4,
            interactSteps: 7,
            interactDirection: "backwards",
            interactCorrectAnswer: -3,
            interactCorrectSequence: "4, 3, 2, 1, 0, -1, -2, -3",
            interactLineMin: -5,
            interactLineMax: 6
          },
          {
            name: "Zara",
            start: -4,
            steps: 7,
            direction: "forwards",
            wrongAnswer: 4,
            correctAnswer: 3,
            mistake: "forgot that zero counts as a step, jumping from -1 to 1",
            wrongSequence: "-4, -3, -2, -1, 1, 2, 3, 4",
            correctSequence: "-4, -3, -2, -1, 0, 1, 2, 3",
            lineMin: -6,
            lineMax: 6,
            interactStart: -3,
            interactSteps: 8,
            interactDirection: "forwards",
            interactCorrectAnswer: 5,
            interactCorrectSequence: "-3, -2, -1, 0, 1, 2, 3, 4, 5",
            interactLineMin: -5,
            interactLineMax: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did ${v.name} count correctly?`,
            body: (v) => `${v.name} started at **${v.start}** and counted **${v.steps} steps ${v.direction}**.\n\n${v.name} says the answer is **${v.wrongAnswer}**.\n\nBut look at the sequence: ${v.wrongSequence}. Can you spot what went wrong?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.start, label: `Start: ${v.start}`, color: "#3b82f6" },
                  { value: v.wrongAnswer, label: `${v.name}: ${v.wrongAnswer}?`, color: "#f87171" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Zero counts as a number!",
            body: (v) => `${v.name} ${v.mistake}! Zero is a real number — you must count it as one of your steps. Tap to see the correct sequence on the number line.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.start, label: `${v.start}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#fbbf24" },
                  { value: v.correctAnswer, label: `${v.correctAnswer}`, color: "#22c55e" }
                ],
                jumps: v.direction === "forwards"
                  ? [{ from: v.start, to: v.correctAnswer, label: `+${v.steps}` }]
                  : [{ from: v.start, to: v.correctAnswer, label: `−${v.steps}` }],
                tickInterval: 1,
                showLabels: true,
                highlight: [Math.min(v.start, v.correctAnswer), Math.max(v.start, v.correctAnswer)]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `When counting through zero, you can skip over it`, answer: false, explanation: "Zero is a real number — you must count it as one of your steps!" },
                { text: `The sequence −2, −1, 0, 1, 2 includes zero as a step`, answer: true, explanation: "Correct — zero sits between the negatives and positives. ✓" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now you try a different one!",
            body: (v) => `Start at **${v.interactStart}**, count **${v.interactSteps} ${v.interactDirection}** (don't skip zero!).\n\nWhere do you land?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Start at ${v.interactStart}, count ${v.interactSteps} ${v.interactDirection}. Where?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Superstar! The answer is **${v.interactCorrectAnswer}**. Zero counts as a step! ✓`,
                incorrect: (v) => `Not quite! Count carefully: ${v.interactCorrectSequence}. The answer is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't skip zero!",
            body: () => `The most common mistake when counting through zero is **skipping it**. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Zero IS a number — it counts as a step", why: "..., -2, -1, 0, 1, 2, ..." },
                  { text: "Don't jump from -1 to 1", why: "That skips a step and makes your answer wrong by 1" },
                  { text: "Count on your fingers if you need to!", why: "There's no shame in checking carefully ✓" }
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
  // SUB-CONCEPT 3: adding-to-negatives
  // Adding a positive to a negative
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "adding-to-negatives",
    name: "Adding to Negative Numbers",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "adding-neg-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to add a positive number to a negative number",
          "Why adding moves you to the RIGHT on a number line"
        ],
        variableSets: [
          {
            name: "A thermometer",
            scenario: "in a freezer reads -8°C. Someone opens the door and it warms up by 5°C",
            startNum: -8,
            addNum: 5,
            answer: -3,
            crossesZero: false,
            unit: "°C",
            lineMin: -10,
            lineMax: 2,
            // Interact uses different values so the answer isn't already revealed
            interactStart: -6,
            interactAdd: 4,
            interactAnswer: -2,
            interactLineMin: -8,
            interactLineMax: 2
          },
          {
            name: "A diver",
            scenario: "is at -6 metres (below the surface). She swims up 4 metres",
            startNum: -6,
            addNum: 4,
            answer: -2,
            crossesZero: false,
            unit: "m",
            lineMin: -8,
            lineMax: 3,
            interactStart: -9,
            interactAdd: 3,
            interactAnswer: -6,
            interactLineMin: -11,
            interactLineMax: 2
          },
          {
            name: "Ruby",
            scenario: "owes her brother £7. She earns £3 from doing chores",
            startNum: -7,
            addNum: 3,
            answer: -4,
            crossesZero: false,
            unit: "£",
            lineMin: -9,
            lineMax: 2,
            interactStart: -5,
            interactAdd: 2,
            interactAnswer: -3,
            interactLineMin: -7,
            interactLineMax: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.startNum} + ${v.addNum}?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nWe need to work out **${v.startNum} + ${v.addNum}**. Adding a positive number moves us to the **right** on the number line!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Move right on the number line",
            body: (v) => `Start at **${v.startNum}** and jump **${v.addNum}** places to the right.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: v.answer, label: `${v.answer}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.answer, label: `+${v.addNum}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.startNum, v.answer]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Start at **${v.interactStart}**. Add **${v.interactAdd}**.\n\nWhat do you get?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactStart, to: v.interactAnswer, label: `+${v.interactAdd}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStart} + ${v.interactAdd} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactStart} + ${v.interactAdd} = **${v.interactAnswer}**. You moved right on the number line! ✓`,
                incorrect: (v) => `Not quite! Start at ${v.interactStart} and count ${v.interactAdd} to the right: the answer is **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adding makes you move RIGHT!",
            body: () => `When you **add a positive** number, you always move to the **right** on the number line — even if you start in the negatives!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Adding a positive = move RIGHT", why: "Even from a negative starting point" },
                  { text: "You might stay negative", why: "e.g. -8 + 5 = -3 (still negative)" },
                  { text: "Or you might cross zero", why: "e.g. -3 + 5 = 2 (now positive!) ✓" }
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
        id: "adding-neg-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why -5 + 8 is NOT the same as 5 + 8",
          "How to avoid ignoring the negative sign"
        ],
        variableSets: [
          {
            name: "Tom",
            startNum: -5,
            addNum: 8,
            wrongAnswer: 13,
            correctAnswer: 3,
            mistake: "ignored the minus sign and did 5 + 8 = 13 instead of -5 + 8 = 3",
            lineMin: -7,
            lineMax: 6,
            // Interact uses different values so the answer isn't already revealed
            interactStart: -7,
            interactAdd: 9,
            interactAnswer: 2,
            interactLineMin: -9,
            interactLineMax: 5
          },
          {
            name: "Priya",
            startNum: -4,
            addNum: 6,
            wrongAnswer: 10,
            correctAnswer: 2,
            mistake: "treated -4 as positive 4 and did 4 + 6 = 10",
            lineMin: -6,
            lineMax: 5,
            interactStart: -6,
            interactAdd: 10,
            interactAnswer: 4,
            interactLineMin: -8,
            interactLineMax: 6
          },
          {
            name: "Alfie",
            startNum: -9,
            addNum: 7,
            wrongAnswer: 16,
            correctAnswer: -2,
            mistake: "forgot the negative and added 9 + 7 = 16",
            lineMin: -11,
            lineMax: 4,
            interactStart: -8,
            interactAdd: 5,
            interactAnswer: -3,
            interactLineMin: -10,
            interactLineMax: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.startNum} + ${v.addNum} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} worked out **${v.startNum} + ${v.addNum}** and got **${v.wrongAnswer}**.\n\nThat seems too big! Can you see what went wrong?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `Start: ${v.startNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Don't ignore the minus sign!",
            body: (v) => `${v.name} ${v.mistake}. The minus sign changes your starting point completely! Tap to see where you really end up on the number line.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: v.correctAnswer, label: `${v.correctAnswer}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.correctAnswer, label: `+${v.addNum}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.startNum, v.correctAnswer]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `What is **${v.interactStart} + ${v.interactAdd}**? Remember — don't ignore the minus sign!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactStart, to: v.interactAnswer, label: `+${v.interactAdd}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStart} + ${v.interactAdd} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.interactStart} + ${v.interactAdd} = **${v.interactAnswer}**. The minus sign matters! ✓`,
                incorrect: (v) => `Not quite! Start at ${v.interactStart} (not ${Math.abs(v.interactStart)}!) and add ${v.interactAdd}. Answer: **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The minus sign MATTERS!",
            body: () => `Never ignore a minus sign. **-5 + 8** is completely different from **5 + 8**!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Always look at WHERE you start", why: "-5 starts way left of zero, not at 5" },
                  { text: "Add by moving RIGHT from the start", why: "-5 + 8: start at -5, jump 8 right = 3" },
                  { text: "Use the number line if unsure", why: "Point to your start, count the jumps ✓" }
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
  // SUB-CONCEPT 4: subtracting-into-negatives
  // Subtracting to go below zero
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "subtracting-into-negatives",
    name: "Subtracting Below Zero",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "subtracting-neg-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to subtract when the answer goes below zero",
          "Why subtracting moves you LEFT on the number line"
        ],
        variableSets: [
          {
            name: "A pond",
            scenario: "is at 3°C on a winter evening. Overnight the temperature drops by 8°C",
            startNum: 3,
            subNum: 8,
            answer: -5,
            distanceToZero: 3,
            remaining: 5,
            unit: "°C",
            lineMin: -7,
            lineMax: 5,
            // Interact uses different values so the answer isn't already revealed
            interactStart: 2,
            interactSub: 6,
            interactAnswer: -4,
            interactLineMin: -6,
            interactLineMax: 4
          },
          {
            name: "Oliver",
            scenario: "has £2 in his account. He buys a toy costing £7",
            startNum: 2,
            subNum: 7,
            answer: -5,
            distanceToZero: 2,
            remaining: 5,
            unit: "£",
            lineMin: -7,
            lineMax: 4,
            interactStart: 4,
            interactSub: 9,
            interactAnswer: -5,
            interactLineMin: -7,
            interactLineMax: 6
          },
          {
            name: "A lift",
            scenario: "is on floor 1. It goes down 4 floors (into the basement)",
            startNum: 1,
            subNum: 4,
            answer: -3,
            distanceToZero: 1,
            remaining: 3,
            unit: "floors",
            lineMin: -5,
            lineMax: 3,
            interactStart: 3,
            interactSub: 7,
            interactAnswer: -4,
            interactLineMin: -6,
            interactLineMax: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What is ${v.startNum} − ${v.subNum}?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nWe need **${v.startNum} − ${v.subNum}**. But ${v.subNum} is bigger than ${v.startNum}! Does that mean the answer is negative?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `Start: ${v.startNum}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Go through zero!",
            body: (v) => `When you subtract more than you have, you go **through zero** into the negatives. Tap to follow the journey step by step!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start at ${v.startNum}`, why: "Our starting point" },
                  { text: `Jump left ${v.distanceToZero} to reach zero`, result: `Used ${v.distanceToZero} of our ${v.subNum}` },
                  { text: `Still have ${v.remaining} left to subtract`, result: `0 − ${v.remaining} = ${v.answer}` },
                  { text: `${v.startNum} − ${v.subNum} = ${v.answer}`, result: `${v.answer}${v.unit}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Start at ${v.startNum}`,
                `Jump left ${v.distanceToZero} to reach zero`,
                `Subtract the remaining ${v.remaining}`,
                `Answer: ${v.answer}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Go to zero first, then keep going into the negatives. ✓`,
                incorrect: (v) => `Not quite — first go down to zero, then subtract what's left.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactStart} − ${v.interactSub}** = ?\n\nYou know it goes below zero. How far below?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactStart, to: v.interactAnswer, label: `−${v.interactSub}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStart} − ${v.interactSub} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactStart} − ${v.interactSub} = **${v.interactAnswer}**. You went through zero and kept going! ✓`,
                incorrect: (v) => `Not quite! From ${v.interactStart}, it's ${v.interactStart} to zero, then ${Math.abs(v.interactAnswer)} more: **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtracting below zero!",
            body: () => `If you subtract more than you have, the answer goes **negative**. Just keep counting left on the number line!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Subtracting = moving LEFT", why: "Even past zero" },
                  { text: "Go to zero first", why: "Work out how much you've used" },
                  { text: "Keep going left with what's left", why: "That gives you the negative answer ✓" }
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
        id: "subtracting-neg-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "When to expect a negative answer from subtraction in real life",
          "How to tell if an answer will be negative before calculating"
        ],
        variableSets: [
          {
            name: "Chloe",
            scenario: "checking her pocket money. She has £5 but wants to buy a book costing £9",
            startNum: 5,
            subNum: 9,
            answer: -4,
            unit: "£",
            lineMin: -6,
            lineMax: 7,
            // Interact uses different values so the answer isn't already revealed
            interactStart: 3,
            interactSub: 8,
            interactAnswer: -5,
            interactLineMin: -7,
            interactLineMax: 5
          },
          {
            name: "A weather station",
            scenario: "recording the temperature. It's 4°C but a cold front will drop it by 10°C",
            startNum: 4,
            subNum: 10,
            answer: -6,
            unit: "°C",
            lineMin: -8,
            lineMax: 6,
            interactStart: 3,
            interactSub: 7,
            interactAnswer: -4,
            interactLineMin: -6,
            interactLineMax: 5
          },
          {
            name: "An explorer",
            scenario: "at 2 metres above sea level. She dives 7 metres into the ocean",
            startNum: 2,
            subNum: 7,
            answer: -5,
            unit: "m",
            lineMin: -7,
            lineMax: 4,
            interactStart: 1,
            interactSub: 6,
            interactAnswer: -5,
            interactLineMin: -7,
            interactLineMax: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Will the answer be negative?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.startNum} − ${v.subNum}** = ?\n\nWe're taking away MORE than we started with. What happens?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You go below zero!",
            body: (v) => `We need **${v.startNum} − ${v.subNum}**. Since ${v.subNum} is **more** than ${v.startNum}, the answer will be **negative** — we go below zero!\n\n**3 rules for subtraction:**\n- Subtract **MORE** than you start with → answer is **NEGATIVE** (e.g. 3 − 8 = −5)\n- Subtract **LESS** than you start with → answer is **POSITIVE** (e.g. 8 − 3 = 5)\n- Subtract the **SAME** amount → answer is **ZERO** (e.g. 5 − 5 = 0)\n\nTap to see this on the number line.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#22c55e" },
                  { value: v.answer, label: `${v.answer}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.answer, label: `−${v.subNum}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.answer, v.startNum]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try this one!",
            body: (v) => `**${v.interactStart} − ${v.interactSub}** = ?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactStart, to: v.interactAnswer, label: `−${v.interactSub}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStart} − ${v.interactSub} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Spot on! ${v.interactStart} − ${v.interactSub} = **${v.interactAnswer}**. Below zero! ✓`,
                incorrect: (v) => `Not quite! ${v.interactStart} − ${v.interactSub} = **${v.interactAnswer}**. You go below zero when subtracting a bigger number.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Quick check: will it be negative?",
            body: () => `Remember the 3 rules: subtract more → negative, subtract less → positive, subtract the same → zero. Check the sign before you calculate! ✓`,
            visual: {
              component: "NumberLine",
              props: () => ({
                min: -6,
                max: 6,
                points: [
                  { value: 4, label: "Start: 4", color: "#22c55e" },
                  { value: -3, label: "4 − 7 = −3", color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: 4, to: -3, label: "−7" }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [-3, 4]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: difference-across-zero
  // Finding the gap between negative and positive
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "difference-across-zero",
    name: "Finding the Difference Across Zero",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "difference-zero-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the difference between a negative and a positive number",
          "Why you add the distances from zero"
        ],
        variableSets: [
          {
            name: "A weather chart",
            scenario: "showing the coldest and warmest temperatures in a week",
            negNum: -4,
            posNum: 3,
            difference: 7,
            distFromZeroNeg: 4,
            distFromZeroPos: 3,
            unit: "°C",
            lineMin: -6,
            lineMax: 5,
            // Interact uses different values so the answer isn't already revealed
            interactNeg: -5,
            interactPos: 2,
            interactDifference: 7,
            interactDistNeg: 5,
            interactDistPos: 2,
            interactLineMin: -7,
            interactLineMax: 4
          },
          {
            name: "A building",
            scenario: "with basement floors below ground",
            negNum: -3,
            posNum: 5,
            difference: 8,
            distFromZeroNeg: 3,
            distFromZeroPos: 5,
            unit: "floors",
            lineMin: -5,
            lineMax: 7,
            interactNeg: -2,
            interactPos: 7,
            interactDifference: 9,
            interactDistNeg: 2,
            interactDistPos: 7,
            interactLineMin: -4,
            interactLineMax: 9
          },
          {
            name: "A science experiment",
            scenario: "measuring temperatures in a freezer and an oven",
            negNum: -6,
            posNum: 4,
            difference: 10,
            distFromZeroNeg: 6,
            distFromZeroPos: 4,
            unit: "°C",
            lineMin: -8,
            lineMax: 6,
            interactNeg: -3,
            interactPos: 6,
            interactDifference: 9,
            interactDistNeg: 3,
            interactDistPos: 6,
            interactLineMin: -5,
            interactLineMax: 8
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the difference between ${v.negNum} and ${v.posNum}?`,
            body: (v) => `${v.name} ${v.scenario}. The two values are **${v.negNum}${v.unit}** and **${v.posNum}${v.unit}**.\n\nWhat's the **difference** between them? It's not as simple as subtracting!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.negNum, label: `${v.negNum}`, color: "#3b82f6" },
                  { value: v.posNum, label: `${v.posNum}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.negNum, v.posNum]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Add the distances from zero!",
            body: (v) => `When two numbers sit on **opposite sides** of zero, finding the gap between them requires a special trick. Tap to discover it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.negNum} is ${v.distFromZeroNeg} away from zero`, why: "Distance to the left" },
                  { text: `${v.posNum} is ${v.distFromZeroPos} away from zero`, why: "Distance to the right" },
                  { text: `Difference: ${v.distFromZeroNeg} + ${v.distFromZeroPos} = ${v.difference}`, result: `The difference is ${v.difference}${v.unit}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find distance from ${v.negNum} to zero: ${v.distFromZeroNeg}`,
                `Find distance from zero to ${v.posNum}: ${v.distFromZeroPos}`,
                `Add the distances: ${v.distFromZeroNeg} + ${v.distFromZeroPos} = ${v.difference}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find each distance from zero, then add them together. ✓`,
                incorrect: (v) => `Not quite — find each number's distance from zero, then add them.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What's the difference between **${v.interactNeg}** and **${v.interactPos}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactNeg, label: `${v.interactNeg}`, color: "#3b82f6" },
                  { value: v.interactPos, label: `${v.interactPos}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactNeg, to: 0, label: `${v.interactDistNeg}` },
                  { from: 0, to: v.interactPos, label: `${v.interactDistPos}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.interactNeg, v.interactPos]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Difference between ${v.interactNeg} and ${v.interactPos}?`,
              getOptions: (v) => generateDistractors(v.interactDifference),
              correctAnswer: (v) => v.interactDifference,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactDistNeg} + ${v.interactDistPos} = **${v.interactDifference}**. Add the distances from zero! ✓`,
                incorrect: (v) => `Not quite! ${v.interactNeg} is ${v.interactDistNeg} from zero, ${v.interactPos} is ${v.interactDistPos} from zero. Total: **${v.interactDifference}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The difference trick!",
            body: () => `When finding the difference between a negative and a positive number:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find how far the negative number is from zero", why: "Ignore the minus sign" },
                  { text: "Find how far the positive number is from zero", why: "Just the number itself" },
                  { text: "ADD the two distances", why: "Because they're on opposite sides of zero ✓" }
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
        id: "difference-zero-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why subtracting the numbers gives the wrong answer for differences across zero",
          "How to avoid the difference trap"
        ],
        variableSets: [
          {
            name: "Ethan",
            negNum: -4,
            posNum: 3,
            wrongAnswer: 1,
            correctAnswer: 7,
            mistake: "subtracted 3 from 4 to get 1, instead of adding 4 + 3 = 7",
            // Interact uses different values so the answer isn't already revealed
            interactNeg: -3,
            interactPos: 5,
            interactAnswer: 8
          },
          {
            name: "Grace",
            negNum: -5,
            posNum: 2,
            wrongAnswer: 3,
            correctAnswer: 7,
            mistake: "did 5 − 2 = 3, instead of adding 5 + 2 = 7",
            interactNeg: -6,
            interactPos: 3,
            interactAnswer: 9
          },
          {
            name: "Leo",
            negNum: -7,
            posNum: 4,
            wrongAnswer: 3,
            correctAnswer: 11,
            mistake: "did 7 − 4 = 3, but should have done 7 + 4 = 11",
            interactNeg: -5,
            interactPos: 6,
            interactAnswer: 11
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is the difference really ${v.wrongAnswer}?`,
            body: (v) => `${v.name} says the difference between **${v.negNum}** and **${v.posNum}** is **${v.wrongAnswer}**.\n\nLook at the number line — does ${v.wrongAnswer} seem right?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.negNum - 2,
                max: v.posNum + 2,
                points: [
                  { value: v.negNum, label: `${v.negNum}`, color: "#3b82f6" },
                  { value: v.posNum, label: `${v.posNum}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.negNum, v.posNum]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count the gap!",
            body: (v) => `${v.name} ${v.mistake}. When the numbers are on **opposite sides** of zero, subtracting gives the wrong answer. Tap to see the number line proof!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.negNum - 2,
                max: v.posNum + 2,
                points: [
                  { value: v.negNum, label: `${v.negNum}`, color: "#3b82f6" },
                  { value: v.posNum, label: `${v.posNum}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.negNum, to: 0, label: `${Math.abs(v.negNum)}` },
                  { from: 0, to: v.posNum, label: `${v.posNum}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.negNum, v.posNum]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Now try a different pair!",
            body: (v) => `What's the difference between **${v.interactNeg}** and **${v.interactPos}**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactNeg - 2,
                max: v.interactPos + 2,
                points: [
                  { value: v.interactNeg, label: `${v.interactNeg}`, color: "#3b82f6" },
                  { value: v.interactPos, label: `${v.interactPos}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactNeg, to: 0, label: `${Math.abs(v.interactNeg)}` },
                  { from: 0, to: v.interactPos, label: `${v.interactPos}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Difference between ${v.interactNeg} and ${v.interactPos}?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Spot on! ${Math.abs(v.interactNeg)} + ${v.interactPos} = **${v.interactAnswer}**. ADD across zero! ✓`,
                incorrect: (v) => `Not quite! Add the distances: ${Math.abs(v.interactNeg)} + ${v.interactPos} = **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Across zero = ADD!",
            body: () => `Remember this simple rule:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Both on the SAME side of zero → SUBTRACT", why: "e.g. difference between 3 and 7 = 4" },
                  { text: "On OPPOSITE sides of zero → ADD", why: "e.g. difference between -4 and 3 = 4 + 3 = 7" },
                  { text: "Think: how many jumps on the number line?", why: "Count the gaps — that's the difference ✓" }
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
  // SUB-CONCEPT 6: temperature-problems
  // Temperature rise and fall problems
  // Category: supporting
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "temperature-problems",
    name: "Temperature Rise and Fall",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "temperature-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to solve temperature rise and fall problems",
          "How to use a number line for temperature changes"
        ],
        variableSets: [
          {
            name: "Edinburgh",
            startTemp: -3,
            change: 8,
            direction: "rises",
            endTemp: 5,
            lineMin: -6,
            lineMax: 8,
            // Interact uses different values so the answer isn't already revealed
            interactStart: -5,
            interactChange: 7,
            interactDirection: "rises",
            interactEnd: 2,
            interactLineMin: -7,
            interactLineMax: 5
          },
          {
            name: "Aberdeen",
            startTemp: 2,
            change: 9,
            direction: "drops",
            endTemp: -7,
            lineMin: -9,
            lineMax: 4,
            interactStart: 3,
            interactChange: 8,
            interactDirection: "drops",
            interactEnd: -5,
            interactLineMin: -7,
            interactLineMax: 5
          },
          {
            name: "Cardiff",
            startTemp: -1,
            change: 6,
            direction: "rises",
            endTemp: 5,
            lineMin: -4,
            lineMax: 8,
            interactStart: -4,
            interactChange: 10,
            interactDirection: "rises",
            interactEnd: 6,
            interactLineMin: -6,
            interactLineMax: 9
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}: ${v.startTemp}°C then it ${v.direction} by ${v.change}°C`,
            body: (v) => `The temperature in **${v.name}** is **${v.startTemp}°C** at dawn. During the ${v.direction === 'rises' ? 'day' : 'night'} it ${v.direction} by **${v.change}°C**.\n\nWhat is the new temperature?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startTemp, label: `${v.startTemp}°C`, color: "#3b82f6" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `Temperature ${v.direction}!`,
            body: (v) => {
              if (v.direction === "rises") {
                return `**Rises** means it gets **warmer** — move **right** on the number line.\n\n**${v.startTemp} + ${v.change} = ${v.endTemp}°C**`;
              }
              return `**Drops** means it gets **colder** — move **left** on the number line.\n\n**${v.startTemp} − ${v.change} = ${v.endTemp}°C**`;
            },
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startTemp, label: `${v.startTemp}°C`, color: "#3b82f6" },
                  { value: v.endTemp, label: `${v.endTemp}°C`, color: v.direction === "rises" ? "#22c55e" : "#f87171" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startTemp, to: v.endTemp, label: `${v.direction === 'rises' ? '+' : '−'}${v.change}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [Math.min(v.startTemp, v.endTemp), Math.max(v.startTemp, v.endTemp)]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `It's **${v.interactStart}°C** and the temperature ${v.interactDirection} by **${v.interactChange}°C**.\n\nWhat is the new temperature?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStart, label: `${v.interactStart}°C`, color: "#3b82f6" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.interactStart, to: v.interactEnd, label: `${v.interactDirection === 'rises' ? '+' : '−'}${v.interactChange}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `New temperature?`,
              getOptions: (v) => generateDistractors(v.interactEnd),
              correctAnswer: (v) => v.interactEnd,
              feedback: {
                correct: (v) => `Superstar! The new temperature is **${v.interactEnd}°C**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactStart} ${v.interactDirection === 'rises' ? '+' : '−'} ${v.interactChange} = **${v.interactEnd}°C**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Temperature word clues!",
            body: () => `Look for these key words in temperature problems:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Rises / warms up / increases = ADD (move right)", why: "Getting warmer!" },
                  { text: "Drops / falls / decreases = SUBTRACT (move left)", why: "Getting colder!" },
                  { text: "Draw a number line if you're unsure", why: "It makes the direction really clear ✓" }
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
        id: "temperature-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid errors with temperature differences",
          "Why crossing zero needs extra care"
        ],
        variableSets: [
          {
            name: "Noah",
            startTemp: -4,
            endTemp: 3,
            wrongDiff: 1,
            correctDiff: 7,
            mistake: "subtracted 3 from 4 to get 1, but the temperatures are on opposite sides of zero so you need to ADD: 4 + 3 = 7"
          },
          {
            name: "Isla",
            startTemp: -6,
            endTemp: 5,
            wrongDiff: 1,
            correctDiff: 11,
            mistake: "did 6 − 5 = 1, but should have added 6 + 5 = 11 because they cross zero"
          },
          {
            name: "Kai",
            startTemp: -2,
            endTemp: 8,
            wrongDiff: 6,
            correctDiff: 10,
            mistake: "did 8 − 2 = 6, forgetting that -2 is 2 below zero, so the total gap is 2 + 8 = 10"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is the temperature change really ${v.wrongDiff}°C?`,
            body: (v) => `${v.name} says the difference between **${v.startTemp}°C** and **${v.endTemp}°C** is **${v.wrongDiff}°C**.\n\nLook at the number line. Does that look right?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.startTemp - 2,
                max: v.endTemp + 2,
                points: [
                  { value: v.startTemp, label: `${v.startTemp}°C`, color: "#3b82f6" },
                  { value: v.endTemp, label: `${v.endTemp}°C`, color: "#22c55e" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.startTemp, v.endTemp]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "They cross zero — ADD!",
            body: (v) => `${v.name} ${v.mistake}. When temperatures cross zero, you need to count the **total gap** on the number line. Tap to see the correct approach.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.startTemp - 2,
                max: v.endTemp + 2,
                points: [
                  { value: v.startTemp, label: `${v.startTemp}°C`, color: "#3b82f6" },
                  { value: v.endTemp, label: `${v.endTemp}°C`, color: "#22c55e" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startTemp, to: 0, label: `${Math.abs(v.startTemp)}` },
                  { from: 0, to: v.endTemp, label: `${v.endTemp}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.startTemp, v.endTemp]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The difference between −4°C and 6°C is 2°C`, answer: false, explanation: "When temperatures cross zero, ADD the distances: 4 + 6 = 10°C!" },
                { text: `To find the difference across zero, add the two distances from zero`, answer: true, explanation: "Correct — add each number's distance from zero to get the total gap. ✓" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct difference?",
            body: (v) => `How many degrees between **${v.startTemp}°C** and **${v.endTemp}°C**?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.startTemp - 2,
                max: v.endTemp + 2,
                points: [
                  { value: v.startTemp, label: `${v.startTemp}°C`, color: "#3b82f6" },
                  { value: v.endTemp, label: `${v.endTemp}°C`, color: "#22c55e" },
                  { value: 0, label: "0°C", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startTemp, to: 0, label: `${Math.abs(v.startTemp)}` },
                  { from: 0, to: v.endTemp, label: `${v.endTemp}` }
                ],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Difference = ${Math.abs(v.startTemp)} + ${v.endTemp} = ?`,
              getOptions: (v) => generateDistractors(v.correctDiff),
              correctAnswer: (v) => v.correctDiff,
              feedback: {
                correct: (v) => `Brilliant! ${Math.abs(v.startTemp)} + ${v.endTemp} = **${v.correctDiff}°C**. Add across zero! ✓`,
                incorrect: (v) => `Not quite! ${Math.abs(v.startTemp)} + ${v.endTemp} = **${v.correctDiff}°C**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Temperature difference = add across zero!",
            body: () => `When temperatures cross zero, always ADD the two distances from zero to find the difference.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find how far the cold temperature is from 0°C", why: "e.g. -4°C is 4 away from zero" },
                  { text: "Find how far the warm temperature is from 0°C", why: "e.g. 3°C is 3 away from zero" },
                  { text: "ADD them together", why: "4 + 3 = 7°C difference ✓" }
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
  // SUB-CONCEPT 7: real-world-contexts
  // Negatives in money, depth, floors
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: visual-discovery
  // ==========================================
  {
    id: "real-world-contexts",
    name: "Negatives in Real Life",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "real-world-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to recognise negative numbers in money, depth, and floors",
          "How to solve real-life problems using negatives"
        ],
        variableSets: [
          {
            name: "Mum",
            scenario: "checking her bank account. She's overdrawn by £50, then gets paid £120",
            startNum: -50,
            change: 120,
            answer: 70,
            unit: "£",
            context: "bank account",
            lineMin: -60,
            lineMax: 80,
            // Interact: overdrawn by £30, gets paid £75 = £45
            interactStartNum: -30,
            interactChange: 75,
            interactAnswer: 45,
            interactLineMin: -40,
            interactLineMax: 50
          },
          {
            name: "A submarine",
            scenario: "sitting at -40 metres below sea level. The captain orders it to rise 25 metres",
            startNum: -40,
            change: 25,
            answer: -15,
            unit: "m",
            context: "sea depth",
            lineMin: -50,
            lineMax: 10,
            // Interact: at -60m, rises 35m = -25m
            interactStartNum: -60,
            interactChange: 35,
            interactAnswer: -25,
            interactLineMin: -70,
            interactLineMax: 10
          },
          {
            name: "Ella",
            scenario: "parking on floor -3 of a shopping centre. She takes the lift up 5 floors",
            startNum: -3,
            change: 5,
            answer: 2,
            unit: "floors",
            context: "building floors",
            lineMin: -5,
            lineMax: 5,
            // Interact: floor -2, goes up 4 floors = floor 2
            interactStartNum: -2,
            interactChange: 4,
            interactAnswer: 2,
            interactLineMin: -4,
            interactLineMax: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Negatives in ${v.context}!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nStarting at **${v.startNum}** and changing by **+${v.change}**. Where do we end up?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: v.lineMax - v.lineMin > 80 ? 20 : v.lineMax - v.lineMin > 20 ? 10 : v.lineMax - v.lineMin > 12 ? 5 : 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same maths, different context!",
            body: (v) => `No matter the context — money, depth, or floors — the maths is always the same. Start at **${v.startNum}${v.unit}**, add **+${v.change}**, and you land on **${v.answer}${v.unit}**. The number line shows the jump — count right from the starting point.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: v.answer, label: `${v.answer}`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.answer, label: `+${v.change}` }
                ],
                tickInterval: v.lineMax - v.lineMin > 80 ? 20 : v.lineMax - v.lineMin > 20 ? 10 : v.lineMax - v.lineMin > 12 ? 5 : 1,
                showLabels: true,
                highlight: [Math.min(v.startNum, v.answer), Math.max(v.startNum, v.answer)]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Back to ${v.context}: start at **${v.interactStartNum}**, add **${v.interactChange}**. What do you get?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStartNum, label: `${v.interactStartNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: v.interactLineMax - v.interactLineMin > 20 ? 10 : v.interactLineMax - v.interactLineMin > 12 ? 5 : 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStartNum} + ${v.interactChange} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactStartNum} + ${v.interactChange} = **${v.interactAnswer}**. Negatives in ${v.context} — no problem! ✓`,
                incorrect: (v) => `Not quite! ${v.interactStartNum} + ${v.interactChange} = **${v.interactAnswer}**. Add by moving towards zero and beyond.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Negatives are everywhere!",
            body: () => `Negative numbers pop up in lots of real-life situations. The maths is always the same — you just need to spot the context!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Money: overdrawn = negative balance", why: "-£50 means you owe £50" },
                  { text: "Depth: below sea level = negative", why: "-40m means 40m underwater" },
                  { text: "Buildings: basement floors = negative", why: "Floor -2 is 2 floors underground ✓" }
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
        id: "real-world-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to read number lines that represent different real-world contexts",
          "How to interpret negative values in context"
        ],
        variableSets: [
          {
            name: "A lift",
            context: "floor numbers",
            values: [-2, -1, 0, 1, 2, 3],
            zeroLabel: "Ground floor",
            negLabel: "Basements",
            posLabel: "Upper floors",
            lineMin: -3,
            lineMax: 4,
            question: "Which floor is 3 below ground?",
            correctAnswer: -3,
            options: ["-3", "-2", "0", "3", "1"]
          },
          {
            name: "A thermometer",
            context: "temperature",
            values: [-5, -3, 0, 2, 4, 7],
            zeroLabel: "Freezing point",
            negLabel: "Below freezing",
            posLabel: "Above freezing",
            lineMin: -6,
            lineMax: 8,
            question: "What temperature is 5 below freezing?",
            correctAnswer: -5,
            options: ["-5", "-3", "0", "5", "-1"]
          },
          {
            name: "A bank statement",
            context: "balance",
            values: [-30, -10, 0, 20, 50],
            zeroLabel: "No money, no debt",
            negLabel: "In debt",
            posLabel: "In credit",
            lineMin: -40,
            lineMax: 60,
            question: "Which value means you owe £30?",
            correctAnswer: -30,
            options: ["-£30", "£30", "£0", "-£10", "£20"]
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}: what do the numbers mean?`,
            body: (v) => `Look at this number line for **${v.context}**. Zero means **${v.zeroLabel.toLowerCase()}**. Numbers to the left mean **${v.negLabel.toLowerCase()}**. Numbers to the right mean **${v.posLabel.toLowerCase()}**.`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: v.values.map(n => ({
                  value: n,
                  color: n < 0 ? "#3b82f6" : n === 0 ? "#9ca3af" : "#22c55e"
                })),
                jumps: [],
                tickInterval: v.lineMax - v.lineMin > 20 ? 10 : v.lineMax - v.lineMin > 12 ? 2 : 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Context gives meaning!",
            body: (v) => `The same number line works for all these contexts. **Zero** is always the **dividing point**.\n\n- **Left of zero** (negative) = ${v.negLabel.toLowerCase()}\n- **Right of zero** (positive) = ${v.posLabel.toLowerCase()}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Zero = ${v.zeroLabel}`, why: "The reference point" },
                  { text: `Negative = ${v.negLabel}`, why: "Below / less than the reference" },
                  { text: `Positive = ${v.posLabel}`, why: "Above / more than the reference" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Zero", right: v.zeroLabel },
                { left: "Negative", right: v.negLabel },
                { left: "Positive", right: v.posLabel }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.question,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: v.values.map(n => ({
                  value: n,
                  color: n < 0 ? "#3b82f6" : n === 0 ? "#9ca3af" : "#22c55e"
                })),
                jumps: [],
                tickInterval: v.lineMax - v.lineMin > 20 ? 10 : v.lineMax - v.lineMin > 12 ? 2 : 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.question,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.options[0],
              feedback: {
                correct: (v) => `Spot on! ${v.negLabel} means negative numbers. The answer is **${v.correctAnswer}**! ✓`,
                incorrect: (v) => `Not quite! Below the reference point = negative. The answer is **${v.correctAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Same maths, different stories!",
            body: () => `Negative numbers work the same way in every context. Just remember what zero means!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Temperature: 0°C = freezing point", why: "Below freezing = negative" },
                  { text: "Money: £0 = no money, no debt", why: "In debt = negative" },
                  { text: "Buildings: Floor 0 = ground level", why: "Basements = negative floors ✓" }
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
  // SUB-CONCEPT 8: negative-subtract-negative
  // Subtracting from a negative
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "negative-subtract-negative",
    name: "Subtracting from a Negative",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "neg-sub-neg-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to subtract a positive number from a negative number",
          "Why subtracting makes a negative number even more negative"
        ],
        variableSets: [
          {
            name: "A freezer",
            scenario: "is at -5°C. The temperature drops by another 3°C",
            startNum: -5,
            subNum: 3,
            answer: -8,
            unit: "°C",
            lineMin: -10,
            lineMax: 2,
            // Interact: -7 − 4 = -11
            interactStartNum: -7,
            interactSubNum: 4,
            interactAnswer: -11,
            interactLineMin: -13,
            interactLineMax: 2
          },
          {
            name: "A submarine",
            scenario: "is at -10 metres. It dives another 6 metres deeper",
            startNum: -10,
            subNum: 6,
            answer: -16,
            unit: "m",
            lineMin: -18,
            lineMax: 2,
            // Interact: -8 − 5 = -13
            interactStartNum: -8,
            interactSubNum: 5,
            interactAnswer: -13,
            interactLineMin: -15,
            interactLineMax: 2
          },
          {
            name: "Ruby",
            scenario: "owes £4. She borrows another £5",
            startNum: -4,
            subNum: 5,
            answer: -9,
            unit: "£",
            lineMin: -11,
            lineMax: 2,
            // Interact: -6 − 3 = -9
            interactStartNum: -6,
            interactSubNum: 3,
            interactAnswer: -9,
            interactLineMin: -11,
            interactLineMax: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.startNum} − ${v.subNum} = ?`,
            body: (v) => `${v.name} ${v.scenario}.\n\nWe need **${v.startNum} − ${v.subNum}**. We're already negative and subtracting MORE. Which direction do we go?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: v.lineMax - v.lineMin >= 12 ? 2 : 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Even further left!",
            body: (v) => `Subtracting moves you **left**. When you're already negative, subtracting makes you **more negative** — further from zero!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lineMin,
                max: v.lineMax,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: v.answer, label: `${v.answer}`, color: "#f87171" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.answer, label: `−${v.subNum}` }
                ],
                tickInterval: v.lineMax - v.lineMin >= 12 ? 2 : 1,
                showLabels: true,
                highlight: [v.answer, v.startNum]
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Start at ${v.startNum} (already negative)`,
                `Subtract ${v.subNum} — move further left`,
                `Answer: ${v.answer}`
              ],
              feedback: {
                correct: (v) => `Perfect order! Subtracting from a negative makes it even more negative. ✓`,
                incorrect: (v) => `Not quite — start at the negative number, then move further left.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactStartNum} − ${v.interactSubNum}** = ?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLineMin,
                max: v.interactLineMax,
                points: [
                  { value: v.interactStartNum, label: `${v.interactStartNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: v.interactLineMax - v.interactLineMin >= 12 ? 2 : 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStartNum} − ${v.interactSubNum} = ?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactStartNum} − ${v.interactSubNum} = **${v.interactAnswer}**. Even further into the negatives! ✓`,
                incorrect: (v) => `Not quite! Start at ${v.interactStartNum}, move ${v.interactSubNum} left: **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subtracting from a negative!",
            body: () => `When you subtract from a negative number, the answer gets **even more negative** — you move further from zero.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Subtracting = moving LEFT on the number line", why: "Always, no matter where you start" },
                  { text: "Negative − positive = more negative", why: "-5 − 3 = -8 (further from zero)" },
                  { text: "Think of it as going deeper", why: "Deeper underwater, colder temperature, more debt ✓" }
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
        id: "neg-sub-neg-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why negative − positive does NOT give a positive answer",
          "How to avoid sign errors when subtracting from negatives"
        ],
        variableSets: [
          {
            name: "Kai",
            startNum: -3,
            subNum: 4,
            wrongAnswer: 1,
            correctAnswer: -7,
            mistake: "did 4 − 3 = 1, ignoring the minus sign on the -3",
            // Interact: -5 − 6 = -11
            interactStartNum: -5,
            interactSubNum: 6,
            interactCorrectAnswer: -11
          },
          {
            name: "Ella",
            startNum: -6,
            subNum: 2,
            wrongAnswer: -4,
            correctAnswer: -8,
            mistake: "added instead of subtracting, doing -6 + 2 = -4 instead of -6 − 2 = -8",
            // Interact: -4 − 3 = -7
            interactStartNum: -4,
            interactSubNum: 3,
            interactCorrectAnswer: -7
          },
          {
            name: "Zac",
            startNum: -2,
            subNum: 7,
            wrongAnswer: 5,
            correctAnswer: -9,
            mistake: "flipped the order and did 7 − 2 = 5, but -2 − 7 = -9",
            // Interact: -1 − 8 = -9
            interactStartNum: -1,
            interactSubNum: 8,
            interactCorrectAnswer: -9
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} says ${v.startNum} − ${v.subNum} = ${v.wrongAnswer}`,
            body: (v) => `${v.name} worked out **${v.startNum} − ${v.subNum}** and got **${v.wrongAnswer}**.\n\nBut we're subtracting from a negative. Should the answer be more negative or less negative?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.correctAnswer - 2,
                max: Math.max(v.wrongAnswer, 2) + 1,
                points: [
                  { value: v.startNum, label: `Start: ${v.startNum}`, color: "#3b82f6" },
                  { value: v.wrongAnswer, label: `${v.name}: ${v.wrongAnswer}?`, color: "#f87171" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "It should be MORE negative!",
            body: (v) => `${v.name} ${v.mistake}.\n\nWhen you subtract from a negative, you go **further left** — the answer is MORE negative, not less!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.correctAnswer - 2,
                max: 2,
                points: [
                  { value: v.startNum, label: `${v.startNum}`, color: "#3b82f6" },
                  { value: v.correctAnswer, label: `${v.correctAnswer} ✓`, color: "#22c55e" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [
                  { from: v.startNum, to: v.correctAnswer, label: `−${v.subNum}` }
                ],
                tickInterval: 1,
                showLabels: true,
                highlight: [v.correctAnswer, v.startNum]
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When you subtract from a negative number, the answer gets ____ negative`,
              options: (v) => ["more", "less", "equally", "not"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Subtracting moves you further left — more negative, further from zero. ✓`,
                incorrect: (v) => `Not quite — subtracting from a negative makes it MORE negative, not less.`
              }
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `**${v.interactStartNum} − ${v.interactSubNum}** = ?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactCorrectAnswer - 2,
                max: 2,
                points: [
                  { value: v.interactStartNum, label: `${v.interactStartNum}`, color: "#3b82f6" },
                  { value: 0, label: "0", color: "#9ca3af" }
                ],
                jumps: [],
                tickInterval: 1,
                showLabels: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactStartNum} − ${v.interactSubNum} = ?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Superstar! ${v.interactStartNum} − ${v.interactSubNum} = **${v.interactCorrectAnswer}**. More negative, not less! ✓`,
                incorrect: (v) => `Not quite! Start at ${v.interactStartNum}, move ${v.interactSubNum} left: **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't flip the sign!",
            body: () => `The biggest trap: thinking a negative minus a positive gives something closer to zero. It doesn't — it goes further away!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Negative − positive = EVEN MORE NEGATIVE", why: "-3 − 4 = -7, not +1" },
                  { text: "Think of it as adding the numbers, then making negative", why: "3 + 4 = 7, so the answer is -7" },
                  { text: "Use the number line to check", why: "Start at -3, jump 4 to the left = -7 ✓" }
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

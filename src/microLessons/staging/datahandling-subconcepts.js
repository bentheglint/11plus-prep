// Supplementary sub-concepts for Data Handling
// To merge: add these to lessonBank.datahandling.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const datahandlingSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Finding the Median
  // ==========================================
  {
    id: "finding-median",
    name: "Finding the Median",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "finding-median-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to order values from smallest to largest",
          "How to find the middle value in an ordered list"
        ],
        variableSets: [
          {
            name: "Ava",
            scenario: "recorded the number of books she read each month",
            values: [7, 3, 5, 9, 1],
            ordered: [1, 3, 5, 7, 9],
            count: 5,
            median: 5,
            unit: "books",
            interactValues: [6, 2, 8, 4, 10],
            interactOrdered: [2, 4, 6, 8, 10],
            interactCount: 5,
            interactMedian: 6,
            interactUnit: "books"
          },
          {
            name: "Liam",
            scenario: "counted how many goals his team scored in five matches",
            values: [4, 1, 6, 2, 3],
            ordered: [1, 2, 3, 4, 6],
            count: 5,
            median: 3,
            unit: "goals",
            interactValues: [5, 2, 7, 3, 1],
            interactOrdered: [1, 2, 3, 5, 7],
            interactCount: 5,
            interactMedian: 3,
            interactUnit: "goals"
          },
          {
            name: "Holly",
            scenario: "measured the heights of five bean plants in cm",
            values: [12, 8, 15, 6, 10],
            ordered: [6, 8, 10, 12, 15],
            count: 5,
            median: 10,
            unit: "cm",
            interactValues: [14, 7, 11, 3, 9],
            interactOrdered: [3, 7, 9, 11, 14],
            interactCount: 5,
            interactMedian: 9,
            interactUnit: "cm"
          },
          {
            name: "Ravi",
            scenario: "recorded the temperature at lunch for five days",
            values: [18, 14, 21, 16, 12],
            ordered: [12, 14, 16, 18, 21],
            count: 5,
            median: 16,
            unit: "°C",
            interactValues: [20, 13, 17, 10, 15],
            interactOrdered: [10, 13, 15, 17, 20],
            interactCount: 5,
            interactMedian: 15,
            interactUnit: "°C"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What's the middle value?",
            body: (v) => `${v.name} ${v.scenario}: **${v.values.join(', ')}** ${v.unit}.\nThe **median** is the middle value — but you must put the numbers in **order** first!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: Math.min(...v.values) - 1,
                max: Math.max(...v.values) + 1,
                points: v.values.map((val, i) => ({
                  value: val,
                  label: `${val}`,
                  color: ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24'][i]
                })),
                jumps: [],
                tickInterval: Math.max(1, Math.round((Math.max(...v.values) - Math.min(...v.values)) / 5))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: find the median",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `First, put the values in **order from smallest to largest**. Then find the one in the **middle**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Original: ${v.values.join(', ')}`, why: "These need to be put in order first." },
                    { text: `Ordered: ${v.ordered.join(', ')}`, why: "Smallest to largest." },
                    { text: `Count: ${v.count} values`, why: `The middle one is value number ${Math.ceil(v.count / 2)}.` },
                    { text: `Median = ${v.median}`, why: "The middle value in the ordered list. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The median is **${v.median} ${v.unit}**. It's the value right in the middle of the ordered list! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Put the values in order from smallest to largest`,
                `Count how many values there are`,
                `Find the middle value`
              ],
              feedback: {
                correct: (v) => `Perfect order! Order first, count, then find the middle. ✓`,
                incorrect: (v) => `Not quite — you must put values in order first, then count them, then find the middle one.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} now has a new set of data: **${v.interactValues.join(', ')}** ${v.interactUnit}. What is the median?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ordered: ${v.interactOrdered.join(', ')}`, why: "Values in order, smallest to largest." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the median of ${v.interactOrdered.join(', ')}?`,
              getOptions: (v) => generateDistractors(v.interactMedian),
              correctAnswer: (v) => v.interactMedian,
              feedback: {
                correct: (v) => `Spot on! The middle value is **${v.interactMedian} ${v.interactUnit}**. ✓`,
                incorrect: (v) => `Not quite! Put the values in order: ${v.interactOrdered.join(', ')}. The middle value (${Math.ceil(v.interactCount / 2)}th out of ${v.interactCount}) is **${v.interactMedian}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The median recipe!",
            body: () => `The median is the **middle value** when the data is in **order**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Put all values in order (smallest to largest)", why: "This is the step most people forget!" },
                  { text: "Step 2: Count how many values there are", why: "You need to know whether the count is odd or even." },
                  { text: "Step 3 (odd count): Pick the middle value", why: "Cross off one from each end until one is left. ✓" },
                  { text: "Step 4 (even count): Find the mean of the two middle values", why: "Add the two middle values and divide by 2. ✓" }
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
        id: "finding-median-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid finding the median (the middle value) without ordering first",
          "Why the order matters for finding the middle"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "has test scores: 8, 3, 6, 1, 5",
            values: [8, 3, 6, 1, 5],
            ordered: [1, 3, 5, 6, 8],
            wrongAnswer: 6,
            wrongReason: "picked the middle of the unordered list",
            correctAnswer: 5,
            interactValues: [9, 2, 7, 4, 11],
            interactOrdered: [2, 4, 7, 9, 11],
            interactCorrectAnswer: 7
          },
          {
            name: "Daisy",
            scenario: "counted apples picked each day: 12, 5, 9, 2, 7",
            values: [12, 5, 9, 2, 7],
            ordered: [2, 5, 7, 9, 12],
            wrongAnswer: 9,
            wrongReason: "chose the 3rd value from the original list without ordering",
            correctAnswer: 7,
            interactValues: [14, 3, 10, 6, 8],
            interactOrdered: [3, 6, 8, 10, 14],
            interactCorrectAnswer: 8
          },
          {
            name: "Finn",
            scenario: "has sprint times in seconds: 15, 11, 18, 9, 13",
            values: [15, 11, 18, 9, 13],
            ordered: [9, 11, 13, 15, 18],
            wrongAnswer: 18,
            wrongReason: "picked the middle of the original unordered list",
            correctAnswer: 13,
            interactValues: [17, 10, 14, 8, 12],
            interactOrdered: [8, 10, 12, 14, 17],
            interactCorrectAnswer: 12
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} ${v.scenario}. They said: "The middle number is **${v.wrongAnswer}**, so the median is ${v.wrongAnswer}." But that's wrong! Can you see why?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Values: ${v.values.join(', ')}`, why: `${v.name} picked ${v.wrongAnswer} from this list.` },
                  { text: `"Median = ${v.wrongAnswer}"`, why: "Is this really the middle value?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You MUST order the values first!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}! The median is the middle of the **ordered** list, not the original list.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Original: ${v.values.join(', ')}`, why: "This is NOT in order." },
                    { text: `Ordered: ${v.ordered.join(', ')}`, why: "Now it's in order — smallest to largest." },
                    { text: `Wrong median: ${v.wrongAnswer}`, why: "Picked from the unordered list." },
                    { text: `Correct median: ${v.correctAnswer}`, why: "The true middle of the ordered list. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Always **order first**, then find the middle. The correct median is **${v.correctAnswer}**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `You must put the values in order before finding the median`, answer: true, explanation: `Correct — the median is the middle of the ORDERED list, not the original list. ✓` },
                { text: `The median is always the 3rd number in any list`, answer: false, explanation: `The position depends on how many values there are — it's the middle one, not always the 3rd!` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New values: **${v.interactValues.join(', ')}**. What is the median?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ordered: ${v.interactOrdered.join(', ')}`, why: "Find the middle of THIS list." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the median?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! The ordered list is ${v.interactOrdered.join(', ')} and the middle value is **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Order first: ${v.interactOrdered.join(', ')}. The middle value is **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Order first — always!",
            body: () => `The number one mistake with medians: forgetting to order the values.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Put values in ORDER (smallest to largest)", why: "Never skip this step!" },
                  { text: "Step 2: Cross off from each end to find the middle", why: "Cross off the smallest and the largest, then repeat." },
                  { text: "The last one left is the median!", why: "It's the true middle of the ordered data. ✓" }
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
  // SUB-CONCEPT 2: Finding the Mode
  // ==========================================
  {
    id: "finding-mode",
    name: "Finding the Mode",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "finding-mode-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the most frequent value in a data set",
          "Why the mode (the most common value) is the value itself, not the frequency (how many times it appears)"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "asked her classmates their favourite number of pets to own",
            values: [2, 3, 1, 2, 4, 2, 3, 1, 2],
            mode: 2,
            frequency: 4,
            unit: "pets",
            interactValues: [3, 1, 4, 3, 2, 3, 1, 3, 5],
            interactMode: 3,
            interactFrequency: 4
          },
          {
            name: "Jake",
            scenario: "recorded shoe sizes of friends at his birthday party",
            values: [4, 5, 3, 5, 4, 5, 6, 5, 3],
            mode: 5,
            frequency: 4,
            unit: "",
            interactValues: [3, 4, 6, 4, 3, 4, 7, 4, 5],
            interactMode: 4,
            interactFrequency: 4
          },
          {
            name: "Sophie",
            scenario: "counted how many sweets each person got from a party bag",
            values: [6, 8, 6, 7, 9, 6, 8, 6],
            mode: 6,
            frequency: 4,
            unit: "sweets",
            interactValues: [5, 7, 9, 7, 8, 7, 10, 7],
            interactMode: 7,
            interactFrequency: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Which value appears the most?",
            body: (v) => `${v.name} ${v.scenario}: **${v.values.join(', ')}**.\nThe **mode** is the value that appears **most often**. Can you spot it?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const counts = {};
                v.values.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
                return {
                  segments: Object.entries(counts).sort((a, b) => a[0] - b[0]).map(([val, count]) => ({
                    value: count,
                    label: `${val} (×${count})`,
                    color: parseInt(val) === v.mode ? "#34d399" : "#818cf8"
                  })),
                  totalLabel: "Which value appears most?"
                };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count each value — the highest count wins!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Go through the data and **tally (a mark used for counting) each value**. The value with the **highest count** is the mode.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const counts = {};
                  v.values.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
                  const steps = Object.entries(counts).sort((a, b) => a[0] - b[0]).map(([val, count]) => ({
                    text: `Value ${val}: appears ${count} time${count > 1 ? 's' : ''}`,
                    why: parseInt(val) === v.mode ? "This is the most frequent — it's the MODE! ✓" : ""
                  }));
                  return { steps, allRevealed: false };
                }
              },
              {
                type: 'text',
                content: (v) => `The mode is **${v.mode}** — it appears **${v.frequency} times**, more than any other value. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Mode", right: "The value that appears most often" },
                { left: "Frequency", right: "How many times a value appears" },
                { left: "MOde = MOst", right: "Memory trick to remember it" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New data: **${v.interactValues.join(', ')}**. What is the mode?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const counts = {};
                v.interactValues.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
                return {
                  segments: Object.entries(counts).sort((a, b) => a[0] - b[0]).map(([val, count]) => ({
                    value: count,
                    label: `${val} (×${count})`,
                    color: "#818cf8"
                  })),
                  totalLabel: "Which value appears most?"
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the mode?`,
              getOptions: (v) => generateDistractors(v.interactMode),
              correctAnswer: (v) => v.interactMode,
              feedback: {
                correct: (v) => `Well done! **${v.interactMode}** appears ${v.interactFrequency} times — more than any other value. ✓`,
                incorrect: (v) => `Not quite! Count each value. **${v.interactMode}** appears ${v.interactFrequency} times — that's the most, so the mode is **${v.interactMode}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The mode is the MOST!",
            body: () => `**MO**de is the **MO**st com**MO**n — all three words have **MO** in them! That's your memory trick.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "MOde = MOst comMOn", why: "All three words share 'MO' — easy to remember!" },
                  { text: "Step 1: Tally up each value", why: "Count how many times each number appears." },
                  { text: "Step 2: Find the value with the highest count", why: "That's the mode!" },
                  { text: "The mode is the VALUE, not the count", why: "Don't say 'the mode is 4 times' — say 'the mode is 5'. ✓" }
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
        id: "finding-mode-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "Why the mode (most common value) can be more useful than the mean (total divided by how many) sometimes",
          "How to handle data with no mode or two modes"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "asked his classmates their shoe size to help the PE teacher order new trainers",
            values: [3, 4, 4, 5, 5, 5, 6, 6, 7],
            mode: 5,
            frequency: 3,
            context: "The PE teacher should order more size 5 trainers — that's the most common size!",
            interactValues: [2, 3, 3, 4, 4, 4, 5, 5, 6],
            interactMode: 4,
            interactFrequency: 3
          },
          {
            name: "Priya",
            scenario: "surveyed favourite ice cream flavours (1=vanilla, 2=chocolate, 3=strawberry, 4=mint)",
            values: [2, 1, 3, 2, 4, 2, 1, 3, 2],
            mode: 2,
            frequency: 4,
            context: "Chocolate (2) is the favourite — the shop should stock more of it!",
            interactValues: [1, 3, 1, 4, 1, 2, 3, 1, 4],
            interactMode: 1,
            interactFrequency: 4
          },
          {
            name: "Isaac",
            scenario: "counted how many siblings each person in his class has",
            values: [1, 2, 1, 0, 1, 3, 1, 2, 0],
            mode: 1,
            frequency: 4,
            context: "Most people have 1 sibling — that's the most common family size in the class!",
            interactValues: [2, 0, 2, 3, 2, 1, 2, 3, 1],
            interactMode: 2,
            interactFrequency: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "When the mode beats the mean!",
            body: (v) => `${v.name} ${v.scenario}. Sometimes you don't need the average — you need to know what's **most popular**. That's exactly what the **mode** tells you!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Data: ${v.values.join(', ')}`, why: "" },
                  { text: `Mode: ${v.mode} (appears ${v.frequency} times)`, why: v.context }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Mode = most popular!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The **mode** is the only average that tells you the **most popular** value. It's great for:\n- Shoe sizes (which size to order most of)\n- Favourite flavours (which one to stock)\n- Any "which is most common" question.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const counts = {};
                  v.values.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
                  const steps = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([val, count]) => ({
                    text: `Value ${val}: ${count} time${count > 1 ? 's' : ''}`,
                    why: parseInt(val) === v.mode ? "MOST FREQUENT — this is the mode! ✓" : ""
                  }));
                  return { steps, allRevealed: false };
                }
              },
              {
                type: 'text',
                content: (v) => `The mode is **${v.mode}**. ${v.context} ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New data: **${v.interactValues.join(', ')}**. What is the mode?`,
            visual: {
              component: "BarModel",
              props: (v) => {
                const counts = {};
                v.interactValues.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
                return {
                  segments: Object.entries(counts).sort((a, b) => a[0] - b[0]).map(([val, count]) => ({
                    value: count,
                    label: `${val} (×${count})`,
                    color: "#818cf8"
                  })),
                  totalLabel: "Find the most frequent value"
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the mode?`,
              getOptions: (v) => generateDistractors(v.interactMode),
              correctAnswer: (v) => v.interactMode,
              feedback: {
                correct: (v) => `Yes! **${v.interactMode}** appears the most (${v.interactFrequency} times). ✓`,
                incorrect: (v) => `Not quite! The value **${v.interactMode}** appears ${v.interactFrequency} times — more than any other. That's the mode!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Mode = Most common!",
            body: () => `Remember: **Mo**de = **Mo**st. Easy!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Mode = the value that appears MOST often", why: "Not the count — the actual value!" },
                  { text: "Use it for: 'most popular', 'most common'", why: "Great for shoe sizes, favourites, and categories." },
                  { text: "Some data has NO mode (all equal) or TWO modes", why: "That's fine — just say 'no mode' or list both. ✓" }
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
  // SUB-CONCEPT 3: Calculating the Range
  // ==========================================
  {
    id: "calculating-range",
    name: "Calculating the Range",
    category: "core",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "calculating-range-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to calculate the range as highest minus lowest",
          "Why the range is a single number, not two numbers"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "recorded daily temperatures for a week",
            values: [8, 14, 11, 6, 15, 9, 12],
            highest: 15,
            lowest: 6,
            range: 9,
            unit: "°C",
            interactValues: [10, 16, 13, 5, 17, 7, 14],
            interactHighest: 17,
            interactLowest: 5,
            interactRange: 12,
            interactUnit: "°C"
          },
          {
            name: "Marcus",
            scenario: "measured how far he kicked a football in five attempts",
            values: [22, 35, 18, 41, 28],
            highest: 41,
            lowest: 18,
            range: 23,
            unit: "metres",
            interactValues: [25, 38, 15, 44, 30],
            interactHighest: 44,
            interactLowest: 15,
            interactRange: 29,
            interactUnit: "metres"
          },
          {
            name: "Lily",
            scenario: "counted birds in the garden each morning",
            values: [3, 7, 5, 12, 2, 8],
            highest: 12,
            lowest: 2,
            range: 10,
            unit: "birds",
            interactValues: [4, 9, 6, 14, 1, 11],
            interactHighest: 14,
            interactLowest: 1,
            interactRange: 13,
            interactUnit: "birds"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "How spread out is the data?",
            body: (v) => `${v.name} ${v.scenario}: **${v.values.join(', ')}** ${v.unit}.\nThe **range** tells us how **spread out** the data is. It's the simplest measure there is — just one subtraction!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.lowest - 1,
                max: v.highest + 1,
                points: [
                  { value: v.lowest, label: `Lowest: ${v.lowest}`, color: "#38bdf8" },
                  { value: v.highest, label: `Highest: ${v.highest}`, color: "#f87171" }
                ],
                jumps: [{ from: v.lowest, to: v.highest, label: `Range = ?` }],
                tickInterval: Math.max(1, Math.round((v.highest - v.lowest) / 5))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Range = highest - lowest",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The range is just **one number** — the gap between the highest and lowest values.\n\n**Range = highest value - lowest value**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Find the highest value: ${v.highest}`, why: "Scan through all the values." },
                    { text: `Find the lowest value: ${v.lowest}`, why: "The smallest number in the set." },
                    { text: `Range = ${v.highest} − ${v.lowest}`, result: `= ${v.range}` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The range is **${v.range} ${v.unit}**. A big range means the data is **spread out**; a small range means it's **clustered together**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `Range = highest value ____ lowest value`,
              options: (v) => ["plus", "minus", "times", "divided by"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Range = highest minus lowest. One subtraction gives you one number. ✓`,
                incorrect: (v) => `Not quite — the range is found by **subtracting** the lowest from the highest!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New data: **${v.interactValues.join(', ')}** ${v.interactUnit}. What is the range?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLowest - 1,
                max: v.interactHighest + 1,
                points: [
                  { value: v.interactLowest, label: `${v.interactLowest}`, color: "#38bdf8" },
                  { value: v.interactHighest, label: `${v.interactHighest}`, color: "#f87171" }
                ],
                jumps: [{ from: v.interactLowest, to: v.interactHighest, label: `Range = ?` }],
                tickInterval: Math.max(1, Math.round((v.interactHighest - v.interactLowest) / 5))
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the range?`,
              getOptions: (v) => generateDistractors(v.interactRange),
              correctAnswer: (v) => v.interactRange,
              feedback: {
                correct: (v) => `Yes! **${v.interactHighest} − ${v.interactLowest} = ${v.interactRange}**. ✓`,
                incorrect: (v) => `Not quite! Highest (${v.interactHighest}) minus lowest (${v.interactLowest}) = **${v.interactRange}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "One subtraction — that's it!",
            body: () => `The range is the easiest measure in data handling:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find the highest value", why: "The biggest number in the data." },
                  { text: "Find the lowest value", why: "The smallest number in the data." },
                  { text: "Range = highest − lowest", why: "Give ONE number, not 'from 6 to 15'. ✓" }
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
        id: "calculating-range-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid giving two values instead of one for the range",
          "Why the range is a subtraction, not a pair of numbers"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "has test scores: 4, 9, 6, 3, 8",
            values: [4, 9, 6, 3, 8],
            highest: 9,
            lowest: 3,
            wrongAnswer: "3 to 9",
            wrongReason: "gave two numbers instead of doing the subtraction",
            correctAnswer: 6,
            interactValues: [5, 12, 7, 2, 10],
            interactHighest: 12,
            interactLowest: 2,
            interactCorrectAnswer: 10
          },
          {
            name: "Nadia",
            scenario: "has heights in cm: 140, 155, 132, 148",
            values: [140, 155, 132, 148],
            highest: 155,
            lowest: 132,
            wrongAnswer: "132 to 155",
            wrongReason: "wrote the range as two values instead of subtracting",
            correctAnswer: 23,
            interactValues: [138, 160, 125, 152],
            interactHighest: 160,
            interactLowest: 125,
            interactCorrectAnswer: 35
          },
          {
            name: "Oscar",
            scenario: "counted sweets: 5, 11, 8, 3, 7",
            values: [5, 11, 8, 3, 7],
            highest: 11,
            lowest: 3,
            wrongAnswer: "3 to 11",
            wrongReason: "gave the lowest and highest instead of the difference",
            correctAnswer: 8,
            interactValues: [6, 13, 9, 4, 10],
            interactHighest: 13,
            interactLowest: 4,
            interactCorrectAnswer: 9
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Close — but not quite!",
            body: (v) => `${v.name} ${v.scenario}. They wrote: "The range is **${v.wrongAnswer}**." Is that right?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Data: ${v.values.join(', ')}`, why: "" },
                  { text: `"Range = ${v.wrongAnswer}"`, why: "Is this a valid answer?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The range is ONE number, not two!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}!\n\nThe range is a **single number** — the **difference** between the highest and lowest values. You must **subtract**!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: "Range = ${v.wrongAnswer}"`, why: "This shows two values, not one!" },
                    { text: `Right: Range = ${v.highest} − ${v.lowest} = ${v.correctAnswer}`, why: "Subtract to get ONE number. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The range is **${v.correctAnswer}**, not "${v.wrongAnswer}". ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The range should be given as a single number`, answer: true, explanation: `Correct — the range is ONE number: highest minus lowest. Not "3 to 9" but just "6". ✓` },
                { text: `The range is the highest and lowest values written together`, answer: false, explanation: `No! You must subtract: highest - lowest = one single number. That's the range!` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New data: **${v.interactValues.join(', ')}**. What is the range?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactLowest - 1,
                max: v.interactHighest + 1,
                points: [
                  { value: v.interactLowest, label: `${v.interactLowest}`, color: "#38bdf8" },
                  { value: v.interactHighest, label: `${v.interactHighest}`, color: "#f87171" }
                ],
                jumps: [{ from: v.interactLowest, to: v.interactHighest, label: `? = Range` }],
                tickInterval: Math.max(1, Math.round((v.interactHighest - v.interactLowest) / 5))
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the range?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! **${v.interactHighest} − ${v.interactLowest} = ${v.interactCorrectAnswer}**. One number, not two! ✓`,
                incorrect: (v) => `Not quite! Range = highest − lowest = ${v.interactHighest} − ${v.interactLowest} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Range = one subtraction!",
            body: () => `The range is always a **single number**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Range = highest − lowest", why: "Always subtract!" },
                  { text: "Give ONE number as your answer", why: "Not '3 to 9' — just write '6'." },
                  { text: "It measures how SPREAD OUT the data is", why: "Big range = spread out. Small range = clustered. ✓" }
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
  // SUB-CONCEPT 4: Reading Bar Charts
  // ==========================================
  {
    id: "reading-bar-charts",
    name: "Reading Bar Charts",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "reading-bar-charts-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to read values from a bar chart (a chart that uses bars to show data) accurately",
          "Why checking the scale is important before reading bars"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "collected data on favourite fruits in her class",
            chartData: "Apple=8, Banana=5, Orange=6, Grape=3, Pear=4",
            scale: 1,
            question: "how many more chose Apple than Grape",
            answer: 5,
            values: { Apple: 8, Banana: 5, Orange: 6, Grape: 3, Pear: 4 }
          },
          {
            name: "Ravi",
            scenario: "recorded goals scored by different teams in a tournament",
            chartData: "Lions=10, Eagles=15, Bears=20, Wolves=5, Hawks=25",
            scale: 5,
            question: "how many goals the Bears scored",
            answer: 20,
            values: { Lions: 10, Eagles: 15, Bears: 20, Wolves: 5, Hawks: 25 }
          },
          {
            name: "Holly",
            scenario: "counted cars of different colours in the car park",
            chartData: "Red=12, Blue=8, White=15, Black=10, Silver=6",
            scale: 2,
            question: "how many more white cars than blue cars there were",
            answer: 7,
            values: { Red: 12, Blue: 8, White: 15, Black: 10, Silver: 6 }
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What does the bar chart show?",
            body: (v) => `${v.name} ${v.scenario}. Look at the bar chart below.\nBefore reading any values, always check the **scale** on the axis!`,
            visual: {
              component: "BarChart",
              props: (v) => ({
                bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                scale: v.scale,
                yLabel: "Count"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check the scale, then read carefully",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The **scale** on a bar chart (a chart that uses bars to show data) tells you what each grid line is worth. If the scale goes up in **${v.scale}s**, each small square = ${v.scale}.\n\nAlways check this first — a bar that looks tall might only reach 10 if the scale goes up in 2s, not 1s!`
              },
              {
                type: 'visual',
                component: 'BarChart',
                props: (v) => ({
                  bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                  scale: v.scale,
                  yLabel: "Count"
                })
              },
              {
                type: 'text',
                content: (v) => `Read each bar by looking at where its **top** lines up with the numbers on the axis. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "How many more", right: "Subtract the two values" },
                { left: "How many altogether", right: "Add the values together" },
                { left: "Check the scale", right: "See what each grid line is worth" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Using the bar chart, work out **${v.question}**. Read each bar against the scale on the side — don't guess!`,
            visual: {
              component: "BarChart",
              props: (v) => ({
                bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                scale: v.scale,
                yLabel: "Count",
                showValues: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.question.charAt(0).toUpperCase() + v.question.slice(1)}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Spot on! The answer is **${v.answer}**. ✓`,
                incorrect: (v) => `Not quite! Read the values carefully from the chart. The answer is **${v.answer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Bar chart reading tips!",
            body: () => `Before answering any bar chart question:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Check the SCALE on the axis", why: "What does each grid line represent? 1? 2? 5? 10?" },
                  { text: "Step 2: Read the TOP of each bar against the scale", why: "Line it up carefully — don't guess!" },
                  { text: "Step 3: Answer what the question ASKS", why: "'How many more' = subtract. 'How many altogether' = add. ✓" }
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
        id: "reading-bar-charts-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot when bar charts are misleading because the scale is tricky",
          "When to use bar charts versus other types of chart"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "is comparing two bar charts of the same data — one starts at 0 and one starts at 50",
            chartData: "Team A=55, Team B=60, Team C=52, Team D=58",
            values: { "Team A": 55, "Team B": 60, "Team C": 52, "Team D": 58 },
            scale: 5,
            scaleNote: "Starting at 50 makes the differences look HUGE, but they're actually small",
            answer: 8,
            question: "what is the range of the scores"
          },
          {
            name: "Nadia",
            scenario: "is reading a bar chart where the scale goes up in 5s",
            chartData: "Mon=15, Tue=25, Wed=10, Thu=30, Fri=20",
            values: { Mon: 15, Tue: 25, Wed: 10, Thu: 30, Fri: 20 },
            scale: 5,
            scaleNote: "When the scale goes up in 5s, a bar between two lines is halfway — be careful!",
            answer: 20,
            question: "how many more visitors on Thursday than Wednesday"
          },
          {
            name: "Isaac",
            scenario: "is comparing sales shown on a bar chart with scale in 10s",
            chartData: "Week 1=40, Week 2=60, Week 3=30, Week 4=70",
            values: { "Week 1": 40, "Week 2": 60, "Week 3": 30, "Week 4": 70 },
            scale: 10,
            scaleNote: "With a scale in 10s, small differences are hard to spot — read carefully!",
            answer: 40,
            question: "what is the range of weekly sales"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Don't let the chart trick you!",
            body: (v) => `${v.name} ${v.scenario}. Bar charts can be **misleading** if you don't check the scale first. ${v.scaleNote}.`,
            visual: {
              component: "BarChart",
              props: (v) => ({
                bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                scale: v.scale,
                yLabel: "Score"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Always check the scale!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at ${v.name}'s chart. ${v.scaleNote}. Here are three things to check before reading **any** bar chart:`
              },
              {
                type: 'visual',
                component: 'BarChart',
                props: (v) => ({
                  bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                  scale: v.scale,
                  yLabel: "Score"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "What does the axis show?", why: "Number of people, temperature, score, etc." },
                    { text: "What is the scale?", why: "Does it go up in 1s, 2s, 5s, or 10s? Bars between lines need careful reading." },
                    { text: "Does the axis start at 0?", why: "If not, small differences look HUGE. Read the numbers, not the bar heights! ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `Always trust the **numbers**, not how tall the bars look! ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `From the chart below, **${v.question}**?`,
            visual: {
              component: "BarChart",
              props: (v) => ({
                bars: Object.entries(v.values).map(([key, val]) => ({ label: key, value: val })),
                scale: v.scale,
                yLabel: "Score"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.question.charAt(0).toUpperCase() + v.question.slice(1)}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Well done! The answer is **${v.answer}**. ✓`,
                incorrect: (v) => `Not quite! Read the values carefully. The answer is **${v.answer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Bar chart survival guide!",
            body: () => `Remember these tips every time you see a bar chart:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Check the axis labels and scale FIRST", why: "Know what each grid line is worth." },
                  { text: "Does the axis start at 0?", why: "If not, be extra careful — the bars might be misleading." },
                  { text: "Read the NUMBER, don't estimate by eye", why: "Trust the scale, not the bar height. ✓" }
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
  // SUB-CONCEPT 5: Reading Line Graphs
  // ==========================================
  {
    id: "reading-line-graphs",
    name: "Reading Line Graphs",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "reading-line-graphs-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to read line graphs that show change over time",
          "How to read values and spot trends on a line graph"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "tracked the temperature outside school each hour",
            data: "9am=8°C, 10am=10°C, 11am=13°C, 12pm=15°C, 1pm=14°C, 2pm=12°C",
            peakTime: "12pm",
            peakValue: 15,
            trend: "rose in the morning and fell in the afternoon",
            answer: 7,
            question: "what was the range of temperatures"
          },
          {
            name: "Ben",
            scenario: "measured a plant's height each week",
            data: "Week 1=3cm, Week 2=5cm, Week 3=8cm, Week 4=12cm, Week 5=14cm",
            peakTime: "Week 5",
            peakValue: 14,
            trend: "grew steadily, fastest between weeks 3 and 4",
            answer: 11,
            question: "how much did the plant grow in total"
          },
          {
            name: "Daisy",
            scenario: "recorded how many books were borrowed from the library each month",
            data: "Sep=40, Oct=55, Nov=65, Dec=30, Jan=50",
            peakTime: "November",
            peakValue: 65,
            trend: "borrowing went up then dropped in December (holiday!)",
            answer: 35,
            question: "what was the range of books borrowed"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What's the pattern?",
            body: (v) => `${v.name} ${v.scenario}. The line graph shows:\n**${v.data}**\nLine graphs are brilliant for showing how things **change over time**.`,
            visual: {
              component: "LineGraph",
              props: (v) => ({
                data: v.data.split(', ').map(pair => {
                  const [label, val] = pair.split('=');
                  return { label, value: parseFloat(val) };
                }),
                highlight: v.data.split(', ').findIndex(p => p.startsWith(v.peakTime)),
                showGrid: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Reading line graphs: values and trends",
            bodyParts: [
              {
                type: 'text',
                content: () => `Line graphs show two things:\n1. **Individual values** — read where each point sits on the axis.\n2. **Trends** — is the line going up, down, or staying flat?\n\n**Going up** = increasing. **Going down** = decreasing. **Flat** = staying the same.`
              },
              {
                type: 'visual',
                component: 'LineGraph',
                props: (v) => ({
                  data: v.data.split(', ').map(pair => {
                    const [label, val] = pair.split('=');
                    return { label, value: parseFloat(val) };
                  }),
                  showGrid: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Step 1: Read the axis scales", why: "What are the units? What does each grid line represent?" },
                    { text: "Step 2: Read individual values from the dots", why: "Go across from the dot to the vertical axis." },
                    { text: `Trend: ${v.trend}`, why: "Look at the overall direction of the line. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `Line graphs are great for **temperatures**, **growth**, **sales**, or anything that changes over **time**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Line going up", right: "Value is increasing" },
                { left: "Line going down", right: "Value is decreasing" },
                { left: "Flat line", right: "No change" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `From the line graph, **${v.question}**?`,
            visual: {
              component: "LineGraph",
              props: (v) => ({
                data: v.data.split(', ').map(pair => {
                  const [label, val] = pair.split('=');
                  return { label, value: parseFloat(val) };
                }),
                showGrid: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.question.charAt(0).toUpperCase() + v.question.slice(1)}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Yes! The answer is **${v.answer}**. ✓`,
                incorrect: (v) => `Not quite! Check the data carefully. The answer is **${v.answer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Line graph reading tips!",
            body: () => `Line graphs show **change over time**. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Line going UP = value increasing", why: "The steeper the line, the faster the increase." },
                  { text: "Line going DOWN = value decreasing", why: "A steep drop means a rapid decrease." },
                  { text: "Flat line = no change", why: "The value stayed the same between those points. ✓" }
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
        id: "reading-line-graphs-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot the steepest section of a line graph",
          "Why the steepest part shows the biggest change"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "is watching how water temperature changes when heated",
            data: "0min=20°C, 2min=25°C, 4min=35°C, 6min=42°C, 8min=45°C",
            steepest: "2 to 4 minutes",
            biggestChange: 10,
            answer: 25,
            question: "what was the total temperature rise"
          },
          {
            name: "Priya",
            scenario: "tracked her reading speed improvement over weeks",
            data: "Week 1=80wpm, Week 2=85wpm, Week 3=100wpm, Week 4=110wpm, Week 5=112wpm",
            steepest: "Week 2 to Week 3",
            biggestChange: 15,
            answer: 32,
            question: "how much did her speed improve in total"
          },
          {
            name: "Jake",
            scenario: "measured snowfall depth each hour during a storm",
            data: "1pm=2cm, 2pm=5cm, 3pm=11cm, 4pm=15cm, 5pm=16cm",
            steepest: "2pm to 3pm",
            biggestChange: 6,
            answer: 14,
            question: "what was the total snowfall"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Where's the steepest bit?",
            body: (v) => `${v.name} ${v.scenario}. The **steepest part** of a line graph shows where the **biggest change** happened. Can you spot it?`,
            visual: {
              component: "LineGraph",
              props: (v) => ({
                data: v.data.split(', ').map(pair => {
                  const [label, val] = pair.split('=');
                  return { label, value: parseFloat(val) };
                }),
                showGrid: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Steep = big change!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `On a line graph:\n- **Steep upward line** = rapid increase\n- **Gentle upward line** = slow increase\n- **Flat line** = no change\n\nThe steepest section was **${v.steepest}**, where the change was **${v.biggestChange}**.`
              },
              {
                type: 'visual',
                component: 'LineGraph',
                props: (v) => ({
                  data: v.data.split(', ').map(pair => {
                    const [label, val] = pair.split('=');
                    return { label, value: parseFloat(val) };
                  }),
                  showGrid: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Steepest: ${v.steepest}`, why: `Jump of ${v.biggestChange} — the line goes up most steeply here.` },
                    { text: "Steep = fast change, gentle = slow change", why: "The angle of the line tells you the rate of change." }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `Look at the slope — the steeper the line, the faster the change! ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `From the line graph, **${v.question}**?`,
            visual: {
              component: "LineGraph",
              props: (v) => ({
                data: v.data.split(', ').map(pair => {
                  const [label, val] = pair.split('=');
                  return { label, value: parseFloat(val) };
                }),
                showGrid: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.question.charAt(0).toUpperCase() + v.question.slice(1)}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Well done! The answer is **${v.answer}**. ✓`,
                incorrect: (v) => `Not quite! Check the data carefully. The answer is **${v.answer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Reading line graphs like a pro!",
            body: () => `Line graphs are all about **change over time**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Steepest section = biggest change", why: "Look for the part where the line rises or falls fastest." },
                  { text: "Flattest section = smallest change", why: "The line barely moves — things stayed roughly the same." },
                  { text: "To find total change: last value − first value", why: "Subtract the start from the end. ✓" }
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
  // SUB-CONCEPT 6: Reading Pie Charts
  // ==========================================
  {
    id: "reading-pie-charts",
    name: "Reading Pie Charts",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "reading-pie-charts-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate values from a pie chart using fractions and degrees",
          "How to find the angle for a section when you know the fraction"
        ],
        variableSets: [
          {
            name: "Ava",
            scenario: "has a pie chart showing how 60 pupils travel to school",
            totalPeople: 60,
            sections: [
              { label: "Walk", fraction: "1/2", angle: 180, count: 30 },
              { label: "Car", fraction: "1/4", angle: 90, count: 15 },
              { label: "Bus", fraction: "1/6", angle: 60, count: 10 },
              { label: "Cycle", fraction: "1/12", angle: 30, count: 5 }
            ],
            questionSection: "Bus",
            answer: 10,
            interactTotalPeople: 48,
            interactSections: [
              { label: "Walk", fraction: "1/4", angle: 90, count: 12 },
              { label: "Car", fraction: "1/3", angle: 120, count: 16 },
              { label: "Bus", fraction: "1/6", angle: 60, count: 8 },
              { label: "Cycle", fraction: "1/4", angle: 90, count: 12 }
            ],
            interactQuestionSection: "Car",
            interactAnswer: 16
          },
          {
            name: "Liam",
            scenario: "has a pie chart showing how 40 children spent their Saturday",
            totalPeople: 40,
            sections: [
              { label: "Sport", fraction: "1/4", angle: 90, count: 10 },
              { label: "Gaming", fraction: "1/2", angle: 180, count: 20 },
              { label: "Reading", fraction: "1/8", angle: 45, count: 5 },
              { label: "Other", fraction: "1/8", angle: 45, count: 5 }
            ],
            questionSection: "Sport",
            answer: 10,
            interactTotalPeople: 36,
            interactSections: [
              { label: "Sport", fraction: "1/3", angle: 120, count: 12 },
              { label: "Gaming", fraction: "1/4", angle: 90, count: 9 },
              { label: "Reading", fraction: "1/6", angle: 60, count: 6 },
              { label: "Other", fraction: "1/4", angle: 90, count: 9 }
            ],
            interactQuestionSection: "Reading",
            interactAnswer: 6
          },
          {
            name: "Ella",
            scenario: "has a pie chart showing favourite colours of 80 children",
            totalPeople: 80,
            sections: [
              { label: "Blue", fraction: "1/4", angle: 90, count: 20 },
              { label: "Red", fraction: "1/4", angle: 90, count: 20 },
              { label: "Green", fraction: "1/8", angle: 45, count: 10 },
              { label: "Other", fraction: "3/8", angle: 135, count: 30 }
            ],
            questionSection: "Green",
            answer: 10,
            interactTotalPeople: 72,
            interactSections: [
              { label: "Blue", fraction: "1/3", angle: 120, count: 24 },
              { label: "Red", fraction: "1/4", angle: 90, count: 18 },
              { label: "Green", fraction: "1/6", angle: 60, count: 12 },
              { label: "Other", fraction: "1/4", angle: 90, count: 18 }
            ],
            interactQuestionSection: "Red",
            interactAnswer: 18
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What do the slices mean?",
            body: (v) => `${v.name} ${v.scenario}. A pie chart shows **fractions of the whole**. The full circle = **360°** = **all ${v.totalPeople} people**. Each slice is a fraction of the total.`,
            visual: {
              component: "PieChart",
              props: (v) => ({
                sections: v.sections,
                total: v.totalPeople
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "From fraction to number of people",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `To find how many people are in each section:\n1. Read the **fraction** (or angle) for that slice.\n2. Calculate that fraction **of the total**.`
              },
              {
                type: 'visual',
                component: 'PieChart',
                props: (v) => ({
                  sections: v.sections,
                  total: v.totalPeople
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => {
                  const section = v.sections.find(s => s.label === v.questionSection);
                  return {
                    steps: [
                      { text: `Total: ${v.totalPeople} people`, why: "The whole pie chart." },
                      { text: `${v.questionSection} section: ${section.fraction} of the circle (${section.angle}°)`, why: "Read this from the pie chart." },
                      { text: `${section.fraction} of ${v.totalPeople} = ${section.count}`, why: "Multiply: fraction × total. ✓" }
                    ],
                    allRevealed: false
                  };
                }
              },
              {
                type: 'text',
                content: (v) => {
                  const section = v.sections.find(s => s.label === v.questionSection);
                  return `**${section.count} people** chose ${v.questionSection}. ✓`;
                }
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A new pie chart shows **${v.interactTotalPeople}** people. How many chose **${v.interactQuestionSection}**?`,
            visual: {
              component: "PieChart",
              props: (v) => ({
                sections: v.interactSections,
                total: v.interactTotalPeople
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many chose ${v.interactQuestionSection}?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Yes! **${v.interactAnswer}** people chose ${v.interactQuestionSection}. ✓`,
                incorrect: (v) => {
                  const section = v.interactSections.find(s => s.label === v.interactQuestionSection);
                  return `Not quite! ${v.interactQuestionSection} = ${section.fraction} of ${v.interactTotalPeople} = **${v.interactAnswer}**.`;
                }
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Pie chart reading recipe!",
            body: () => `Pie charts show **fractions of a total**. Here's how to read them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the TOTAL (how many people/things altogether)", why: "The whole pie = the total." },
                  { text: "Step 2: Read the FRACTION (or angle) for each slice", why: "360° = the whole. 180° = half. 90° = quarter." },
                  { text: "Step 3: Calculate fraction × total", why: "That gives you the actual number for that slice. ✓" }
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
        id: "reading-pie-charts-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing the angle with the number of people",
          "Why 90° does not always mean 90 people"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "sees a 90° slice in a pie chart of 80 people",
            angle: 90,
            totalPeople: 80,
            wrongAnswer: 90,
            wrongReason: "wrote the angle (90°) as the number of people",
            correctAnswer: 20,
            fraction: "1/4",
            interactAngle: 120,
            interactTotalPeople: 60,
            interactCorrectAnswer: 20,
            interactFraction: "1/3"
          },
          {
            name: "Nadia",
            scenario: "sees a 180° slice in a pie chart of 60 people",
            angle: 180,
            totalPeople: 60,
            wrongAnswer: 180,
            wrongReason: "confused the angle with the count",
            correctAnswer: 30,
            fraction: "1/2",
            interactAngle: 90,
            interactTotalPeople: 100,
            interactCorrectAnswer: 25,
            interactFraction: "1/4"
          },
          {
            name: "Ravi",
            scenario: "sees a 120° slice in a pie chart of 90 people",
            angle: 120,
            totalPeople: 90,
            wrongAnswer: 120,
            wrongReason: "gave the angle instead of calculating the fraction of the total",
            correctAnswer: 30,
            fraction: "1/3",
            interactAngle: 180,
            interactTotalPeople: 80,
            interactCorrectAnswer: 40,
            interactFraction: "1/2"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} ${v.scenario}. They wrote: "The number of people = **${v.wrongAnswer}**." But the total is only ${v.totalPeople}! What went wrong?`,
            visual: {
              component: "PieChart",
              props: (v) => ({
                sections: [
                  { label: `${v.angle}°`, angle: v.angle, count: `${v.angle}°`, fraction: v.fraction },
                  { label: "Rest", angle: 360 - v.angle, count: "", fraction: "" }
                ],
                total: v.totalPeople
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Degrees are not people!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}!\n\n**${v.angle}°** is the **angle**, not the number of people. To find the count:\n${v.angle}° out of 360° = **${v.fraction}**\n${v.fraction} of ${v.totalPeople} = **${v.correctAnswer}** people.`
              },
              {
                type: 'visual',
                component: 'PieChart',
                props: (v) => ({
                  sections: [
                    { label: `${v.angle}°`, angle: v.angle, count: `${v.angle}°`, fraction: v.fraction },
                    { label: "Rest", angle: 360 - v.angle, count: "", fraction: "" }
                  ],
                  total: v.totalPeople
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.angle}° = ${v.wrongAnswer} people`, why: "Degrees and people are different things!" },
                    { text: `Right: ${v.angle}° ÷ 360° = ${v.fraction}`, why: "Convert the angle to a fraction first." },
                    { text: `${v.fraction} × ${v.totalPeople} = ${v.correctAnswer} people`, why: "Then find that fraction of the total. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The answer is **${v.correctAnswer}** people, not ${v.wrongAnswer}. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To find the number of people, convert the angle to a ____ first`,
              options: (v) => ["percentage", "fraction", "decimal", "degree"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Convert the angle to a fraction (angle ÷ 360), then multiply by the total. ✓`,
                incorrect: (v) => `Not quite — convert the angle to a **fraction** (angle ÷ 360), then multiply by the total!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A ${v.interactAngle}° slice in a pie chart of **${v.interactTotalPeople}** people. How many people does it represent?`,
            visual: {
              component: "PieChart",
              props: (v) => ({
                sections: [
                  { label: `${v.interactAngle}°`, angle: v.interactAngle, count: `${v.interactAngle}°`, fraction: v.interactFraction },
                  { label: "Rest", angle: 360 - v.interactAngle, count: "", fraction: "" }
                ],
                total: v.interactTotalPeople
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many people does the ${v.interactAngle}° slice represent?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! ${v.interactFraction} of ${v.interactTotalPeople} = **${v.interactCorrectAnswer}** people. ✓`,
                incorrect: (v) => `Not quite! ${v.interactAngle}° ÷ 360° = ${v.interactFraction}. Then ${v.interactFraction} × ${v.interactTotalPeople} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Degrees are not counts!",
            body: () => `The most common pie chart mistake: confusing the **angle** with the **number of people**.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the angle (°)", why: "This is NOT the answer!" },
                  { text: "Step 2: Convert to a fraction (angle ÷ 360)", why: "90° = 1/4, 180° = 1/2, 120° = 1/3, etc." },
                  { text: "Step 3: Multiply fraction × total", why: "NOW you have the actual number of people. ✓" }
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
  // SUB-CONCEPT 7: Reading Tables
  // ==========================================
  {
    id: "reading-tables",
    name: "Reading Two-Way Tables",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "reading-tables-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to read values from a two-way table",
          "How to find totals and missing values"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "has a table showing children's pet preferences by gender",
            tableDesc: "Boys: Cat=8, Dog=12, Fish=5. Girls: Cat=10, Dog=7, Fish=3.",
            question: "how many children chose dogs altogether",
            answer: 19,
            working: "Boys dogs (12) + Girls dogs (7) = 19",
            interactTableDesc: "Boys: Cat=6, Dog=14, Fish=4. Girls: Cat=9, Dog=8, Fish=5.",
            interactQuestion: "how many children chose fish altogether",
            interactAnswer: 9,
            interactWorking: "Boys fish (4) + Girls fish (5) = 9"
          },
          {
            name: "Marcus",
            scenario: "has a table showing how Year 5 and Year 6 travel to school",
            tableDesc: "Year 5: Walk=15, Bus=8, Car=7. Year 6: Walk=12, Bus=10, Car=8.",
            question: "how many children take the bus in total",
            answer: 18,
            working: "Year 5 bus (8) + Year 6 bus (10) = 18",
            interactTableDesc: "Year 4: Walk=11, Bus=6, Car=9. Year 5: Walk=14, Bus=12, Car=5.",
            interactQuestion: "how many children go by car in total",
            interactAnswer: 14,
            interactWorking: "Year 4 car (9) + Year 5 car (5) = 14"
          },
          {
            name: "Grace",
            scenario: "has a table showing sandwich choices at a school trip",
            tableDesc: "Boys: Ham=9, Cheese=6, Tuna=5. Girls: Ham=7, Cheese=11, Tuna=4.",
            question: "how many children chose cheese altogether",
            answer: 17,
            working: "Boys cheese (6) + Girls cheese (11) = 17",
            interactTableDesc: "Boys: Ham=11, Cheese=8, Tuna=3. Girls: Ham=5, Cheese=9, Tuna=7.",
            interactQuestion: "how many children chose tuna altogether",
            interactAnswer: 10,
            interactWorking: "Boys tuna (3) + Girls tuna (7) = 10"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Tables organise data in rows and columns!",
            body: (v) => `${v.name} ${v.scenario}. Two-way tables let you compare data across **two categories** at once!`,
            visual: {
              component: "TwoWayTable",
              props: (v) => ({
                tableDesc: v.tableDesc,
                showTotals: false
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Reading across and down",
            bodyParts: [
              {
                type: 'text',
                content: () => `A two-way table has **rows** (going across) and **columns** (going down). To answer questions:\n- **One cell**: find the row AND column that match.\n- **A total**: add up a whole row or column.`
              },
              {
                type: 'visual',
                component: 'TwoWayTable',
                props: (v) => ({
                  tableDesc: v.tableDesc,
                  showTotals: false
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Question: ${v.question}?`, why: "We need to add values from a column." },
                    { text: v.working, why: "Add the values from both rows. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The answer is **${v.answer}**. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use the table to answer: **${v.interactQuestion}**?`,
            visual: {
              component: "TwoWayTable",
              props: (v) => ({
                tableDesc: v.interactTableDesc,
                showTotals: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactQuestion.charAt(0).toUpperCase() + v.interactQuestion.slice(1)}?`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `Yes! ${v.interactWorking} = **${v.interactAnswer}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactWorking} = **${v.interactAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two-way table tips!",
            body: () => `Two-way tables are simple once you know how to navigate them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the RIGHT row and column", why: "Use the labels to guide you." },
                  { text: "Step 2: For totals, add a whole row or column", why: "Add all values in that row or column." },
                  { text: "Step 3: For missing values, use the total to work backwards", why: "Total − known values = missing value. ✓" }
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
        id: "reading-tables-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to find a missing value in a two-way table",
          "When to add and when to subtract"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "has a table where one value is missing",
            tableDesc: "Boys: Cat=8, Dog=10, Fish=?. Girls: Cat=6, Dog=5, Fish=4.",
            knownValues: [8, 10],
            knownSum: 18,
            rowTotal: 25,
            missingValue: 7,
            context: "The missing value = row total − other values in the row",
            interactTableDesc: "Boys: Walk=6, Bus=11, Car=?. Girls: Walk=9, Bus=5, Car=3.",
            interactKnownValues: [6, 11],
            interactKnownSum: 17,
            interactRowTotal: 28,
            interactMissingValue: 11
          },
          {
            name: "Nadia",
            scenario: "has a table with a missing value",
            tableDesc: "Year 5: Maths=12, English=9, Science=?. Year 6: Maths=10, English=8, Science=7.",
            knownValues: [12, 9],
            knownSum: 21,
            rowTotal: 30,
            missingValue: 9,
            context: "Subtract the known values from the column total",
            interactTableDesc: "Year 5: Maths=14, English=8, Science=?. Year 6: Maths=11, English=9, Science=5.",
            interactKnownValues: [14, 8],
            interactKnownSum: 22,
            interactRowTotal: 35,
            interactMissingValue: 13
          },
          {
            name: "Oscar",
            scenario: "has a table with one gap to fill in",
            tableDesc: "Morning: Ham=15, Cheese=11, Tuna=?. Afternoon: Ham=9, Cheese=8, Tuna=6.",
            knownValues: [15, 11],
            knownSum: 26,
            rowTotal: 40,
            missingValue: 14,
            context: "Total minus known values gives the missing one",
            interactTableDesc: "Morning: Ham=13, Cheese=9, Tuna=?. Afternoon: Ham=7, Cheese=10, Tuna=5.",
            interactKnownValues: [13, 9],
            interactKnownSum: 22,
            interactRowTotal: 38,
            interactMissingValue: 16
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Find the missing value!",
            body: (v) => `${v.name} ${v.scenario}. The row total is **${v.rowTotal}**. Can you find the **?** value?`,
            visual: {
              component: "TwoWayTable",
              props: (v) => {
                const rowLabel = v.tableDesc.split(':')[0].trim();
                return { tableDesc: v.tableDesc, showTotals: true, rowTotals: { [rowLabel]: v.rowTotal } };
              }
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the total to find what's missing",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `If you know the **total** and some of the values, subtract the known values to find the missing one:\n\n**Missing = Total − known values**`
              },
              {
                type: 'visual',
                component: 'TwoWayTable',
                props: (v) => {
                  const rowLabel = v.tableDesc.split(':')[0].trim();
                  return { tableDesc: v.tableDesc, showTotals: true, rowTotals: { [rowLabel]: v.rowTotal } };
                }
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Total: ${v.rowTotal}`, why: "Given in the table." },
                    { text: `Known values: ${v.knownValues.join(' + ')} = ${v.knownSum}`, why: "Add the values you can see." },
                    { text: `Missing: ${v.rowTotal} − ${v.knownSum} = ${v.missingValue}`, why: "Subtract to find the gap. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The missing value is **${v.missingValue}**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the total for that row or column`,
                `Add up the values you already know`,
                `Subtract the known sum from the total`
              ],
              feedback: {
                correct: (v) => `Perfect order! Total, then add known, then subtract. ✓`,
                incorrect: (v) => `Not quite — first find the total, then add the known values, then subtract to find the missing one.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The row total is **${v.interactRowTotal}**. Find the **?** value in the table.`,
            visual: {
              component: "TwoWayTable",
              props: (v) => {
                const rowLabel = v.interactTableDesc.split(':')[0].trim();
                return { tableDesc: v.interactTableDesc, showTotals: true, rowTotals: { [rowLabel]: v.interactRowTotal } };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing value?`,
              getOptions: (v) => generateDistractors(v.interactMissingValue),
              correctAnswer: (v) => v.interactMissingValue,
              feedback: {
                correct: (v) => `Yes! **${v.interactRowTotal} − ${v.interactKnownSum} = ${v.interactMissingValue}**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactRowTotal} − ${v.interactKnownValues.join(' − ')} = **${v.interactMissingValue}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Missing values in tables!",
            body: () => `When a table has a gap, use the **totals** to work backwards:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Find the total for that row or column", why: "This is usually given in the table." },
                  { text: "Add up the values you DO know", why: "These are the filled-in cells." },
                  { text: "Missing = Total − known values", why: "Simple subtraction gives you the answer. ✓" }
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
  // SUB-CONCEPT 8: Missing Number from Mean
  // ==========================================
  {
    id: "missing-from-mean",
    name: "Finding a Missing Number When the Mean is Given",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "missing-from-mean-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work backwards from the mean (total divided by how many) to find a missing value",
          "Why you multiply the mean by the count to find the total"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "got scores of 7, 9, and 8 in three tests. Her mean across all four tests is 8",
            knownValues: [7, 9, 8],
            knownSum: 24,
            mean: 8,
            count: 4,
            requiredTotal: 32,
            missingValue: 8,
            unit: "marks",
            interactKnownValues: [6, 10, 5],
            interactKnownSum: 21,
            interactMean: 7,
            interactCount: 4,
            interactRequiredTotal: 28,
            interactMissingValue: 7,
            interactUnit: "marks"
          },
          {
            name: "Ravi",
            scenario: "counted birds on four mornings: 5, 8, 3, and one he forgot. The mean is 6",
            knownValues: [5, 8, 3],
            knownSum: 16,
            mean: 6,
            count: 4,
            requiredTotal: 24,
            missingValue: 8,
            unit: "birds",
            interactKnownValues: [4, 7, 6],
            interactKnownSum: 17,
            interactMean: 5,
            interactCount: 4,
            interactRequiredTotal: 20,
            interactMissingValue: 3,
            interactUnit: "birds"
          },
          {
            name: "Ella",
            scenario: "has heights of 4 sunflowers: 12cm, 18cm, 14cm, and ? cm. The mean is 15cm",
            knownValues: [12, 18, 14],
            knownSum: 44,
            mean: 15,
            count: 4,
            requiredTotal: 60,
            missingValue: 16,
            unit: "cm",
            interactKnownValues: [10, 20, 16],
            interactKnownSum: 46,
            interactMean: 14,
            interactCount: 4,
            interactRequiredTotal: 56,
            interactMissingValue: 10,
            interactUnit: "cm"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Working backwards from the mean!",
            body: (v) => `${v.name} ${v.scenario}. You know the **mean** and all the values except one. Can you find the missing number?`,
            visual: {
              component: "BarModel",
              props: (v) => ({
                segments: [
                  ...v.knownValues.map((val, i) => ({ value: val, label: `${val}`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                  { value: v.missingValue, label: "?", color: "#e5e7eb", empty: true }
                ],
                totalLabel: `Mean = ${v.mean} (${v.count} values)`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Mean × count = total!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `If the **mean is ${v.mean}** and there are **${v.count} values**, the **total** must be:\n\n**Mean × Count = Total**\n${v.mean} × ${v.count} = ${v.requiredTotal}`
              },
              {
                type: 'visual',
                component: 'BarModel',
                props: (v) => ({
                  segments: [
                    ...v.knownValues.map((val, i) => ({ value: val, label: `${val}`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                    { value: v.missingValue, label: "?", color: "#e5e7eb", empty: true }
                  ],
                  totalLabel: `Mean = ${v.mean} (${v.count} values)`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Total needed: ${v.mean} × ${v.count} = ${v.requiredTotal}`, why: "Mean × count gives the total of all values." },
                    { text: `Known values: ${v.knownValues.join(' + ')} = ${v.knownSum}`, why: "Add up the values you know." },
                    { text: `Missing value: ${v.requiredTotal} − ${v.knownSum} = ${v.missingValue}`, why: "Subtract to find the gap. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The missing value is **${v.missingValue} ${v.unit}**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To find the total from the mean, you ____ the mean by the count`,
              options: (v) => ["divide", "multiply", "subtract", "add"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! Total = mean × count. Then subtract the known values to find the missing one. ✓`,
                incorrect: (v) => `Not quite — you **multiply** the mean by the count to find the total!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The mean of ${v.interactCount} values is **${v.interactMean}**. The known values are **${v.interactKnownValues.join(', ')}**. What is the missing value?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Total needed: ${v.interactMean} × ${v.interactCount} = ${v.interactRequiredTotal}`, why: "" },
                  { text: `Known sum: ${v.interactKnownSum}`, why: "" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing value?`,
              getOptions: (v) => generateDistractors(v.interactMissingValue),
              correctAnswer: (v) => v.interactMissingValue,
              feedback: {
                correct: (v) => `Yes! **${v.interactRequiredTotal} − ${v.interactKnownSum} = ${v.interactMissingValue}**. ✓`,
                incorrect: (v) => `Not quite! Total = ${v.interactMean} × ${v.interactCount} = ${v.interactRequiredTotal}. Then ${v.interactRequiredTotal} − ${v.interactKnownSum} = **${v.interactMissingValue}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The backwards mean recipe!",
            body: () => `When you know the mean and need to find a missing value:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Total = Mean × Count", why: "This tells you what all the values should add up to." },
                  { text: "Step 2: Add up the known values", why: "Find the sum of the numbers you already have." },
                  { text: "Step 3: Missing = Total − known sum", why: "The difference is the missing value. ✓" }
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
        id: "missing-from-mean-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid dividing when you should multiply",
          "Why the first step is always Mean x Count"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "knows the mean of 5 values is 8, and 4 values add to 34",
            mean: 8,
            count: 5,
            knownSum: 34,
            requiredTotal: 40,
            wrongAnswer: "8 ÷ 5 = 1.6",
            wrongReason: "divided the mean by the count instead of multiplying",
            correctAnswer: 6,
            interactMean: 7,
            interactCount: 5,
            interactKnownSum: 29,
            interactRequiredTotal: 35,
            interactCorrectAnswer: 6
          },
          {
            name: "Daisy",
            scenario: "knows the mean of 4 values is 10, and 3 values add to 27",
            mean: 10,
            count: 4,
            knownSum: 27,
            requiredTotal: 40,
            wrongAnswer: "10 ÷ 4 = 2.5",
            wrongReason: "divided instead of multiplied to find the total",
            correctAnswer: 13,
            interactMean: 9,
            interactCount: 4,
            interactKnownSum: 30,
            interactRequiredTotal: 36,
            interactCorrectAnswer: 6
          },
          {
            name: "Ben",
            scenario: "knows the mean of 6 values is 5, and 5 values add to 26",
            mean: 5,
            count: 6,
            knownSum: 26,
            requiredTotal: 30,
            wrongAnswer: "5 ÷ 6 = 0.83",
            wrongReason: "divided the mean by the count",
            correctAnswer: 4,
            interactMean: 6,
            interactCount: 6,
            interactKnownSum: 31,
            interactRequiredTotal: 36,
            interactCorrectAnswer: 5
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Something doesn't add up!",
            body: (v) => `${v.name} ${v.scenario}. They wrote: "${v.wrongAnswer}" and got stuck. What went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Mean = ${v.mean}, Count = ${v.count}`, why: "" },
                  { text: `${v.name}'s working: ${v.wrongAnswer}`, why: "This doesn't look right!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Multiply, don't divide!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}!\n\nTo find the **total**, you **multiply** the mean by the count:\nTotal = ${v.mean} × ${v.count} = **${v.requiredTotal}**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: ${v.mean} ÷ ${v.count}`, why: "Dividing makes the number smaller — that can't be the total!" },
                    { text: `Right: ${v.mean} × ${v.count} = ${v.requiredTotal}`, why: "MULTIPLY to find the total." },
                    { text: `Missing: ${v.requiredTotal} − ${v.knownSum} = ${v.correctAnswer}`, why: "Then subtract what you know. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The missing value is **${v.correctAnswer}**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `To find the total from the mean, you multiply mean × count`, answer: true, explanation: `Correct — multiplying undoes the division in the mean formula. ✓` },
                { text: `To find the total, you divide the mean by the count`, answer: false, explanation: `No! Dividing makes the number smaller. You need to MULTIPLY to get the total!` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The mean of ${v.interactCount} values is **${v.interactMean}**. The known values add to **${v.interactKnownSum}**. What's the missing value?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Total: ${v.interactMean} × ${v.interactCount} = ${v.interactRequiredTotal}`, why: "Multiply, not divide!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing value?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! **${v.interactRequiredTotal} − ${v.interactKnownSum} = ${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Total = ${v.interactMean} × ${v.interactCount} = ${v.interactRequiredTotal}. Then ${v.interactRequiredTotal} − ${v.interactKnownSum} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember: MULTIPLY to find the total!",
            body: () => `The first step is always **Mean × Count = Total**. Never divide!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Mean × Count = Total", why: "MULTIPLY — this undoes the division in the mean formula." },
                  { text: "Total − known sum = missing value", why: "Subtract what you already know." },
                  { text: "Check: does the mean work with your answer?", why: "Add all values, divide by count — you should get the given mean. ✓" }
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
  // SUB-CONCEPT 9: Even Number Median
  // ==========================================
  {
    id: "even-median",
    name: "Median with an Even Number of Values",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "even-median-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the median (the middle value) when there is an even number of values",
          "Why you must average the two middle values"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "has six test scores",
            values: [4, 8, 3, 7, 5, 9],
            ordered: [3, 4, 5, 7, 8, 9],
            count: 6,
            middle1: 5,
            middle2: 7,
            median: 6,
            unit: "marks",
            interactValues: [2, 6, 10, 4, 8, 12],
            interactOrdered: [2, 4, 6, 8, 10, 12],
            interactCount: 6,
            interactMiddle1: 6,
            interactMiddle2: 8,
            interactMedian: 7,
            interactUnit: "marks"
          },
          {
            name: "Jake",
            scenario: "measured the height of four plants in cm",
            values: [12, 8, 15, 5],
            ordered: [5, 8, 12, 15],
            count: 4,
            middle1: 8,
            middle2: 12,
            median: 10,
            unit: "cm",
            interactValues: [14, 6, 18, 10],
            interactOrdered: [6, 10, 14, 18],
            interactCount: 4,
            interactMiddle1: 10,
            interactMiddle2: 14,
            interactMedian: 12,
            interactUnit: "cm"
          },
          {
            name: "Priya",
            scenario: "recorded temperatures over six days",
            values: [14, 11, 18, 9, 16, 12],
            ordered: [9, 11, 12, 14, 16, 18],
            count: 6,
            middle1: 12,
            middle2: 14,
            median: 13,
            unit: "°C",
            interactValues: [15, 10, 19, 8, 17, 13],
            interactOrdered: [8, 10, 13, 15, 17, 19],
            interactCount: 6,
            interactMiddle1: 13,
            interactMiddle2: 15,
            interactMedian: 14,
            interactUnit: "°C"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What if there's no single middle value?",
            body: (v) => `${v.name} ${v.scenario}: **${v.values.join(', ')}** ${v.unit}. That's **${v.count}** values — an **even number**. There's no single middle value, so what do we do?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ordered: ${v.ordered.join(', ')}`, why: `${v.count} values — no single middle!` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Average the two middle values!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When there's an **even number** of values, there are **two middle values**. The median is the **average of those two**:\n\nMedian = (middle1 + middle2) ÷ 2`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Order the values: ${v.ordered.join(', ')}`, why: "Always order first!" },
                    { text: `Two middle values: ${v.middle1} and ${v.middle2}`, why: `Positions ${v.count / 2} and ${v.count / 2 + 1} in the list.` },
                    { text: `Median = (${v.middle1} + ${v.middle2}) ÷ 2`, result: `= ${v.middle1 + v.middle2} ÷ 2 = ${v.median}` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The median is **${v.median} ${v.unit}**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Put the values in order from smallest to largest`,
                `Find the two middle values`,
                `Add them together and divide by 2`
              ],
              feedback: {
                correct: (v) => `Perfect order! Order, find two middles, then average them. ✓`,
                incorrect: (v) => `Not quite — first order, then find the two middle values, then average them by adding and dividing by 2.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New values in order: **${v.interactOrdered.join(', ')}**. The two middle values are **${v.interactMiddle1}** and **${v.interactMiddle2}**. What is the median?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactOrdered[0] - 1,
                max: v.interactOrdered[v.interactOrdered.length - 1] + 1,
                points: [
                  { value: v.interactMiddle1, label: `${v.interactMiddle1}`, color: "#818cf8" },
                  { value: v.interactMiddle2, label: `${v.interactMiddle2}`, color: "#38bdf8" },
                  { value: v.interactMedian, label: `Median?`, color: "#fbbf24" }
                ],
                jumps: [{ from: v.interactMiddle1, to: v.interactMiddle2, label: "Average these" }],
                tickInterval: 1
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the median?`,
              getOptions: (v) => generateDistractors(v.interactMedian),
              correctAnswer: (v) => v.interactMedian,
              feedback: {
                correct: (v) => `Yes! (${v.interactMiddle1} + ${v.interactMiddle2}) ÷ 2 = **${v.interactMedian}**. ✓`,
                incorrect: (v) => `Not quite! Average the two middles: (${v.interactMiddle1} + ${v.interactMiddle2}) ÷ 2 = **${v.interactMedian}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Even count? Average the middle two!",
            body: () => `When the number of values is **even**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Order the values", why: "Smallest to largest — always!" },
                  { text: "Step 2: Find the two middle values", why: "They're the ones either side of the centre." },
                  { text: "Step 3: Add them and divide by 2", why: "Their average is the median. ✓" }
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
        id: "even-median-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid picking just one middle value when the count is even",
          "Why averaging two values gives a more accurate median (middle value)"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "has four values: 3, 6, 9, 14",
            ordered: [3, 6, 9, 14],
            count: 4,
            middle1: 6,
            middle2: 9,
            wrongAnswer: 6,
            wrongReason: "picked just one of the two middle values instead of averaging both",
            correctAnswer: 7.5,
            interactOrdered: [4, 7, 11, 16],
            interactMiddle1: 7,
            interactMiddle2: 11,
            interactCorrectAnswer: 9
          },
          {
            name: "Nadia",
            scenario: "has six values in order: 2, 5, 8, 11, 15, 20",
            ordered: [2, 5, 8, 11, 15, 20],
            count: 6,
            middle1: 8,
            middle2: 11,
            wrongAnswer: 8,
            wrongReason: "chose the lower of the two middle values",
            correctAnswer: 9.5,
            interactOrdered: [3, 6, 10, 14, 17, 22],
            interactMiddle1: 10,
            interactMiddle2: 14,
            interactCorrectAnswer: 12
          },
          {
            name: "Isaac",
            scenario: "has four values: 10, 14, 18, 22",
            ordered: [10, 14, 18, 22],
            count: 4,
            middle1: 14,
            middle2: 18,
            wrongAnswer: 18,
            wrongReason: "picked the higher of the two middle values",
            correctAnswer: 16,
            interactOrdered: [8, 12, 20, 24],
            interactMiddle1: 12,
            interactMiddle2: 20,
            interactCorrectAnswer: 16
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Close — but not quite right!",
            body: (v) => `${v.name} ${v.scenario}. They said the median is **${v.wrongAnswer}**. But with an even number of values, you can't just pick one middle number...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Ordered: ${v.ordered.join(', ')}`, why: `${v.count} values — even number!` },
                  { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "You must average BOTH middle values!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}!\n\nWith an even number of values, there are **two** middle values: **${v.middle1}** and **${v.middle2}**. You must **average** them.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Two middles: ${v.middle1} and ${v.middle2}`, why: "Don't just pick one!" },
                    { text: `Median = (${v.middle1} + ${v.middle2}) ÷ 2 = ${v.correctAnswer}`, why: "Average them both. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The correct median is **${v.correctAnswer}**, not ${v.wrongAnswer}. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New values: **${v.interactOrdered.join(', ')}**. The two middle values are ${v.interactMiddle1} and ${v.interactMiddle2}. What is the median?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: v.interactOrdered[0] - 1,
                max: v.interactOrdered[v.interactOrdered.length - 1] + 1,
                points: [
                  { value: v.interactMiddle1, label: `${v.interactMiddle1}`, color: "#818cf8" },
                  { value: v.interactMiddle2, label: `${v.interactMiddle2}`, color: "#38bdf8" }
                ],
                jumps: [{ from: v.interactMiddle1, to: v.interactMiddle2, label: "Average" }],
                tickInterval: Math.max(1, Math.round((v.interactOrdered[v.interactOrdered.length - 1] - v.interactOrdered[0]) / 6))
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the median?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! (${v.interactMiddle1} + ${v.interactMiddle2}) ÷ 2 = **${v.interactCorrectAnswer}**. ✓`,
                incorrect: (v) => `Not quite! Average both middles: (${v.interactMiddle1} + ${v.interactMiddle2}) ÷ 2 = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Even count = average the two middles!",
            body: () => `This is a classic exam mistake. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Odd count → one middle value (easy!)", why: "Just pick the one in the centre." },
                  { text: "Even count → TWO middle values", why: "Don't just pick one — you need both!" },
                  { text: "Add the two middles and divide by 2", why: "That's the median. The answer might be a decimal! ✓" }
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
  // SUB-CONCEPT 10: Combined Averages
  // ==========================================
  {
    id: "combined-averages",
    name: "Questions Using Mode AND Range Together",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "combined-averages-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to handle questions that test two different measures at once",
          "When to use mode (most common value) and when to use range (highest minus lowest)"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "has two sets of test scores and needs to compare consistency",
            setA: [6, 8, 6, 9, 6],
            setB: [5, 10, 3, 9, 8],
            modeA: 6,
            modeB: "no mode",
            rangeA: 3,
            rangeB: 7,
            conclusion: "Set A is more consistent (smaller range) and the most common score is 6",
            interactSet: [4, 7, 2, 9, 3],
            interactRange: 7
          },
          {
            name: "Marcus",
            scenario: "is comparing goals scored by two teams over five matches",
            setA: [3, 3, 1, 3, 5],
            setB: [2, 4, 2, 6, 1],
            modeA: 3,
            modeB: 2,
            rangeA: 4,
            rangeB: 5,
            conclusion: "Team A scores 3 goals most often and is more consistent (range 4 vs 5)",
            interactSet: [1, 5, 8, 2, 6],
            interactRange: 7
          },
          {
            name: "Lily",
            scenario: "is comparing daily step counts from two fitness trackers",
            setA: [8, 10, 8, 12, 8],
            setB: [6, 15, 9, 7, 13],
            modeA: 8,
            modeB: "no mode",
            rangeA: 4,
            rangeB: 9,
            conclusion: "Set A's most common is 8 thousand steps and it's much more consistent",
            interactSet: [5, 11, 14, 3, 9],
            interactRange: 11
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Two measures tell you more than one!",
            body: (v) => `${v.name} ${v.scenario}.\n**Set A:** ${v.setA.join(', ')}\n**Set B:** ${v.setB.join(', ')}\nThe **mode** tells you the most common value. The **range** tells you how spread out the data is. Together, they paint a full picture!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Set A — Mode: ${v.modeA}, Range: ${v.rangeA}`, why: "" },
                  { text: `Set B — Mode: ${v.modeB}, Range: ${v.rangeB}`, why: "" },
                  { text: v.conclusion, why: "Mode + range together tell the full story!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Mode for 'most common', range for 'spread'",
            bodyParts: [
              {
                type: 'text',
                content: () => `In the exam, you might be asked to find **both** the mode and the range, then use them to **compare** two data sets.\n\n**Mode** = most common value (tells you what appears most often)\n**Range** = highest − lowest (tells you how consistent the data is)`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Set A: Mode = ${v.modeA}`, why: "The most frequently occurring value." },
                    { text: `Set A: Range = ${v.rangeA}`, why: `${Math.max(...v.setA)} − ${Math.min(...v.setA)} = ${v.rangeA}` },
                    { text: `Set B: Range = ${v.rangeB}`, why: `${Math.max(...v.setB)} − ${Math.min(...v.setB)} = ${v.rangeB}` },
                    { text: `Smaller range = more consistent`, why: `Set A (range ${v.rangeA}) is more consistent than Set B (range ${v.rangeB}). ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `When comparing data sets, always state **what** each measure tells you. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `New data set: **${v.interactSet.join(', ')}**. What is the range?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: Math.min(...v.interactSet) - 1,
                max: Math.max(...v.interactSet) + 1,
                points: [
                  { value: Math.min(...v.interactSet), label: `${Math.min(...v.interactSet)}`, color: "#38bdf8" },
                  { value: Math.max(...v.interactSet), label: `${Math.max(...v.interactSet)}`, color: "#f87171" }
                ],
                jumps: [{ from: Math.min(...v.interactSet), to: Math.max(...v.interactSet), label: "Range = ?" }],
                tickInterval: 1
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the range?`,
              getOptions: (v) => generateDistractors(v.interactRange),
              correctAnswer: (v) => v.interactRange,
              feedback: {
                correct: (v) => `Yes! ${Math.max(...v.interactSet)} − ${Math.min(...v.interactSet)} = **${v.interactRange}**. ✓`,
                incorrect: (v) => `Not quite! Highest (${Math.max(...v.interactSet)}) − lowest (${Math.min(...v.interactSet)}) = **${v.interactRange}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comparing data sets!",
            body: () => `When exam questions ask you to **compare** data sets, use multiple measures:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Mode: which value appears most often?", why: "Tells you the most common or most popular result." },
                  { text: "Range: highest − lowest", why: "Tells you how spread out or consistent the data is." },
                  { text: "Compare: 'Set A is more consistent because...'", why: "Always EXPLAIN using the numbers. ✓" }
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
        id: "combined-averages-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to decide which average to use in different situations",
          "Why some averages are better than others for certain data"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "wants to know the most popular shoe size to order for the school shop",
            bestMeasure: "mode",
            reason: "the shop needs to know which size sells MOST — that's the mode",
            data: [3, 4, 5, 5, 5, 6, 6, 7],
            answer: 5
          },
          {
            name: "Nadia",
            scenario: "wants to know what height would be fair for all pupils in her class",
            bestMeasure: "mean",
            reason: "heights are spread evenly — the mean gives what each one would be if they were all the same",
            data: [140, 142, 145, 148, 150],
            answer: 145
          },
          {
            name: "Finn",
            scenario: "wants to know whether his cricket scores are consistent",
            bestMeasure: "range",
            reason: "the range shows how much his scores vary — smaller range = more consistent",
            data: [15, 42, 8, 35, 20],
            answer: 34
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Which average should you use?",
            body: (v) => `${v.name} ${v.scenario}. There are three main averages: **mean**, **median**, and **mode** (plus the **range** for spread). Which one is best here?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Mean: add all, divide by count", why: "Best for evenly spread data." },
                  { text: "Median: the middle value (ordered)", why: "Best when there are extreme values." },
                  { text: "Mode: the most common value", why: "Best for 'most popular'." },
                  { text: "Range: highest − lowest", why: "Shows how spread out or consistent data is." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the right tool for the job!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `For ${v.name}'s question, the best measure is the **${v.bestMeasure}** because ${v.reason}.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Most popular? → MODE", why: "Shoe sizes, favourite colours, most common score." },
                    { text: "Typical value? → MEAN or MEDIAN", why: "Mean for normal data, median if there are outliers." },
                    { text: "How consistent? → RANGE", why: "Small range = consistent. Large range = variable. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `In the exam, the question will hint at which measure to use. Look for words like "most popular" (mode), "average" or "fair share" (mean/median), or "consistent" (range). ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Most popular", right: "Use the mode" },
                { left: "Typical value / fair share", right: "Use the mean" },
                { left: "How consistent", right: "Use the range" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} ${v.scenario}. Data: **${v.data.join(', ')}**. Calculate the **${v.bestMeasure}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Data: ${v.data.join(', ')}`, why: `Find the ${v.bestMeasure}.` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.bestMeasure}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Yes! The ${v.bestMeasure} is **${v.answer}**. ✓`,
                incorrect: (v) => `Not quite! The ${v.bestMeasure} is **${v.answer}**. Try calculating it again step by step.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The averages song!",
            body: () => `Here's a rhyme to help you remember all four:\n\n*Hey diddle diddle, the **Median's** the middle,*\n*You add and divide for the **Mean**.*\n*The **Mode** is the one that appears the most,*\n*And the **Range** is the difference between!*`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Mean: add all values, divide by count", why: "'You add and divide for the Mean.'" },
                  { text: "Median: the middle value (order first!)", why: "'The Median's the middle.'" },
                  { text: "Mode: the most common value", why: "'The Mode is the one that appears the most.'" },
                  { text: "Range: highest minus lowest", why: "'The Range is the difference between!' ✓" }
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

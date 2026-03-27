// Supplementary sub-concepts for Prime Numbers & Factors
// To merge: add these to lessonBank.primenumbersfactors.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const primenumbersfactorsSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Identifying Primes
  // ==========================================
  {
    id: "identifying-primes",
    name: "Recognising Whether a Number is Prime",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "identifying-primes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to test whether a number is prime",
          "Why 1 is NOT a prime number"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "checks if a number from a puzzle is prime",
            number: 29,
            isPrime: true,
            testDivisors: [2, 3, 4, 5],
            results: ["29 ÷ 2 = 14.5 (not whole)", "29 ÷ 3 = 9.67 (not whole)", "29 ÷ 4 = 7.25 (not whole)", "29 ÷ 5 = 5.8 (not whole)"],
            stopReason: "We've tried every number up to 5, and none of them divide in — so we can stop!",
            conclusion: "29 is PRIME — only 1 and 29 divide into it"
          },
          {
            name: "Ella",
            scenario: "checks whether a quiz answer is prime",
            number: 37,
            isPrime: true,
            testDivisors: [2, 3, 4, 5, 6],
            results: ["37 ÷ 2 = 18.5 (not whole)", "37 ÷ 3 = 12.33 (not whole)", "37 ÷ 4 = 9.25 (not whole)", "37 ÷ 5 = 7.4 (not whole)", "37 ÷ 6 = 6.17 (not whole)"],
            stopReason: "We've tried every number up to 6, and none of them divide in — so we can stop!",
            conclusion: "37 is PRIME — nothing divides into it except 1 and 37"
          },
          {
            name: "Grace",
            scenario: "tests if a number from a card game is prime",
            number: 51,
            isPrime: false,
            testDivisors: [2, 3],
            results: ["51 ÷ 2 = 25.5 (not whole)", "51 ÷ 3 = 17 (WHOLE NUMBER!)"],
            stopReason: "We found a factor! 3 × 17 = 51",
            conclusion: "51 is NOT prime — it has factors 1, 3, 17 and 51"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is ${v.number} prime?`,
            body: (v) => `${v.name} ${v.scenario}. A **prime number** has exactly **two factors** (numbers that divide into it exactly): 1 and itself. Nothing else divides into it evenly. Is **${v.number}** prime? Let's find out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.number}: prime or not prime?`, why: "Let's test it in order, one by one" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Test by dividing!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Try dividing **${v.number}** by 2, 3, 4, 5... If ANY of them divide evenly, it's **not** prime.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.results.map((r, i) => ({
                    text: `Try ${v.testDivisors[i]}:`,
                    result: r
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => {
                  if (!v.isPrime) return `${v.stopReason}\n\n**${v.conclusion}** ✓`;
                  const lastTested = v.testDivisors[v.testDivisors.length - 1];
                  const nextNum = lastTested + 1;
                  return `Why stop at **${lastTested}**? The next number to try would be ${nextNum}, but ${nextNum} × ${nextNum} = ${nextNum * nextNum}, which is bigger than ${v.number}. If no number up to ${lastTested} divides in, no bigger one will either!\n\n**${v.conclusion}** ✓`;
                }
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Is **${v.number}** a prime number?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Test: does anything divide into ${v.number}?`, why: "Try 2, 3, 4, 5..." }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is ${v.number} prime?`,
              getOptions: (v) => v.isPrime
                ? ["Yes — it's prime", "No — it's not prime", "It's a special case — neither prime nor not-prime", "Only if it's odd", "Can't tell"]
                : ["No — it's not prime", "Yes — it's prime", "It's a special case — neither prime nor not-prime", "Only if it's odd", "Can't tell"],
              correctAnswer: (v) => v.isPrime ? "Yes — it's prime" : "No — it's not prime",
              feedback: {
                correct: (v) => v.isPrime
                  ? `That's right! **${v.number}** is prime — only 1 and ${v.number} divide into it ✓`
                  : `That's right! **${v.number}** is NOT prime — ${v.conclusion} ✓`,
                incorrect: (v) => v.isPrime
                  ? `Actually, **${v.number}** IS prime. Nothing except 1 and ${v.number} divides into it.`
                  : `Actually, **${v.number}** is NOT prime. ${v.conclusion}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The prime-testing recipe!",
            body: () => `To test if a number is prime:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A prime number can ONLY be divided by 1 and itself", why: "No other number divides into it evenly. 1 is NOT prime!" },
                  { text: "Try dividing by 2, 3, 4, 5... one at a time", why: "If ANY of them give a whole number → it's NOT prime" },
                  { text: "You don't need to test forever — just up to about half the number", why: "e.g. for 29, try 2, 3, 4, 5. None work → it's prime!" },
                  { text: "Primes to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29", why: "Learn these by heart! ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "identifying-primes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why 1 is not prime and 2 is the only even prime",
          "How to avoid common prime number traps"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "lists the first few prime numbers",
            wrongList: "1, 2, 3, 5, 7, 11",
            correctList: "2, 3, 5, 7, 11, 13",
            mistakeExplanation: "included 1 as a prime. But 1 only has ONE factor (itself). Prime numbers must have EXACTLY two factors",
            wrongNumber: 1,
            isWrongPrime: false
          },
          {
            name: "Holly",
            scenario: "says all odd numbers are prime",
            wrongList: "3, 5, 7, 9, 11, 13, 15",
            correctList: "3, 5, 7, 11, 13 (skip 9 and 15)",
            mistakeExplanation: "thought all odd numbers are prime. But 9 = 3×3 and 15 = 3×5 — they have more than two factors!",
            wrongNumber: 9,
            isWrongPrime: false
          },
          {
            name: "Marcus",
            scenario: "says 2 can't be prime because it's even",
            wrongList: "3, 5, 7, 11, 13",
            correctList: "2, 3, 5, 7, 11, 13",
            mistakeExplanation: "left out 2 because it's even. But 2 IS prime — its only factors are 1 and 2. It's the ONLY even prime number!",
            wrongNumber: 2,
            isWrongPrime: true
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n${v.name}'s list: **${v.wrongList}**\n\nSomething's wrong here! Can you spot it?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s primes: ${v.wrongList}`, why: "This has an error!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Common prime number traps!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nThe correct list should be: **${v.correctList}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "1 is NOT prime", why: "It only has one factor (just 1)" },
                  { text: "2 IS prime", why: "Its only factors are 1 and 2 — that's exactly two!" },
                  { text: "Not all odd numbers are prime", why: "9 = 3×3, 15 = 3×5, 21 = 3×7, 25 = 5×5, 27 = 3×9" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Which is NOT prime?",
            body: (v) => `One of these numbers is NOT prime. Which one?`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Remember: prime = exactly two factors", why: "1 and itself" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `Which of these is NOT prime?`,
              getOptions: () => ["15", "13", "17", "19", "23"],
              correctAnswer: () => "15",
              feedback: {
                correct: () => `That's right! **15 = 3 × 5**, so it's NOT prime. It has four factors: 1, 3, 5, 15 ✓`,
                incorrect: () => `Not quite! **15** is not prime because 15 = 3 × 5. All the others (13, 17, 19, 23) are prime.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Prime number traps to avoid!",
            body: () => `Three facts that catch people out:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1 is NOT prime", why: "Primes need EXACTLY two factors. 1 only has one" },
                  { text: "2 IS prime (the only even prime)", why: "2 has exactly two factors: 1 and 2" },
                  { text: "Odd does NOT always mean prime", why: "9, 15, 21, 25, 27, 33, 35, 39... all odd but NOT prime ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: Factor Pairs
  // ==========================================
  {
    id: "factor-pairs",
    name: "Finding Factor Pairs",
    category: "core",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "factor-pairs-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How factors (numbers that divide in exactly) always come in pairs",
          "How to find all factor pairs of a number"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "arranges 18 cupcakes on plates for a bake sale",
            number: 18,
            factorPairs: [[1, 18], [2, 9], [3, 6]],
            allFactors: [1, 2, 3, 6, 9, 18],
            factorCount: 6,
            unit: "cupcakes",
            interactNumber: 20,
            interactFactorPairs: [[1, 20], [2, 10], [4, 5]],
            interactAllFactors: [1, 2, 4, 5, 10, 20],
            interactFactorCount: 6
          },
          {
            name: "Oscar",
            scenario: "arranges 40 chairs into equal rows for assembly",
            number: 40,
            factorPairs: [[1, 40], [2, 20], [4, 10], [5, 8]],
            allFactors: [1, 2, 4, 5, 8, 10, 20, 40],
            factorCount: 8,
            unit: "chairs",
            interactNumber: 30,
            interactFactorPairs: [[1, 30], [2, 15], [3, 10], [5, 6]],
            interactAllFactors: [1, 2, 3, 5, 6, 10, 15, 30],
            interactFactorCount: 8
          },
          {
            name: "Isaac",
            scenario: "shares 32 football stickers equally among friends",
            number: 32,
            factorPairs: [[1, 32], [2, 16], [4, 8]],
            allFactors: [1, 2, 4, 8, 16, 32],
            factorCount: 6,
            unit: "stickers",
            interactNumber: 28,
            interactFactorPairs: [[1, 28], [2, 14], [4, 7]],
            interactAllFactors: [1, 2, 4, 7, 14, 28],
            interactFactorCount: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How many ways can you split ${v.number}?`,
            body: (v) => `${v.name} ${v.scenario}. How many **different** ways can ${v.number} ${v.unit} be arranged in equal groups? Each way gives us a **factor pair** (two numbers that multiply together to make ${v.number})!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.number} ${v.unit}`, why: "How many equal groups can we make?" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Factors come in pairs!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Every time you find a factor, you automatically get **two** factors — a pair! If **a × b = ${v.number}**, then both a and b are factors.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.factorPairs.map(pair => ({
                    text: `${pair[0]} × ${pair[1]}`,
                    result: `= ${v.number} ✓`
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `That gives us **${v.factorPairs.length} pairs** = **${v.factorCount} different factors**:\n**${v.allFactors.join(', ')}** ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "How many factor pairs?",
            body: (v) => `Now try a different number! How many **factor pairs** does **${v.interactNumber}** have?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactNumber}`, why: "Find all the pairs of numbers that multiply to give this" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many factor pairs does ${v.interactNumber} have?`,
              getOptions: (v) => generateDistractors(v.interactFactorPairs.length),
              correctAnswer: (v) => v.interactFactorPairs.length,
              feedback: {
                correct: (v) => `Spot on! ${v.interactNumber} has **${v.interactFactorPairs.length}** factor pairs: ${v.interactFactorPairs.map(p => `${p[0]}×${p[1]}`).join(', ')} ✓`,
                incorrect: (v) => `Not quite! The factor pairs of ${v.interactNumber} are: ${v.interactFactorPairs.map(p => `${p[0]}×${p[1]}`).join(', ')}. That's **${v.interactFactorPairs.length}** pairs.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Factor pairs — always in twos!",
            body: () => `Remember: factors always come in **pairs**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Start with 1 × the number", why: "1 is ALWAYS a factor" },
                  { text: "Try 2, 3, 4, 5... in order", why: "Each one that works gives you a PAIR" },
                  { text: "Stop when the pairs meet or cross", why: "e.g. for 36: 6×6 — they've met! ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual Discovery ----
      {
        id: "factor-pairs-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to visualise factor pairs as rectangles (rows × columns)",
          "Why square numbers have an odd number of factors (numbers that divide in exactly)"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "arranges square tiles to find all the rectangles she can make",
            number: 16,
            factorPairs: [[1, 16], [2, 8], [4, 4]],
            allFactors: [1, 2, 4, 8, 16],
            factorCount: 5,
            isSquare: true,
            squareRoot: 4,
            interactNumber: 36,
            interactFactorPairs: [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]],
            interactAllFactors: [1, 2, 3, 4, 6, 9, 12, 18, 36],
            interactFactorCount: 9
          },
          {
            name: "Jake",
            scenario: "makes rectangles from square grid paper",
            number: 24,
            factorPairs: [[1, 24], [2, 12], [3, 8], [4, 6]],
            allFactors: [1, 2, 3, 4, 6, 8, 12, 24],
            factorCount: 8,
            isSquare: false,
            squareRoot: null,
            interactNumber: 20,
            interactFactorPairs: [[1, 20], [2, 10], [4, 5]],
            interactAllFactors: [1, 2, 4, 5, 10, 20],
            interactFactorCount: 6
          },
          {
            name: "Priya",
            scenario: "tiles a wall and counts possible rectangle shapes",
            number: 25,
            factorPairs: [[1, 25], [5, 5]],
            allFactors: [1, 5, 25],
            factorCount: 3,
            isSquare: true,
            squareRoot: 5,
            interactNumber: 9,
            interactFactorPairs: [[1, 9], [3, 3]],
            interactAllFactors: [1, 3, 9],
            interactFactorCount: 3
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How many rectangles from ${v.number} squares?`,
            body: (v) => `${v.name} ${v.scenario} with **${v.number}** tiles. Each rectangle she makes represents a **factor pair**. How many different rectangles can she make?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.factorPairs.map(pair => ({
                  text: `${pair[0]} rows × ${pair[1]} columns`,
                  result: `= ${v.number} tiles`
                }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => v.isSquare ? "Square numbers are special!" : "Each rectangle = a factor pair!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Each rectangle gives a factor pair:\n${v.factorPairs.map(p => `**${p[0]} × ${p[1]} = ${v.number}**`).join('\n')}`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.factorPairs.map(pair => ({
                    text: `${pair[0]} × ${pair[1]}`,
                    result: `= ${v.number} ✓`
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => {
                  if (v.isSquare) {
                    return `Notice: **${v.squareRoot} × ${v.squareRoot}** is a perfect square! When both numbers in a pair are the **same**, that factor only counts **once**. So ${v.number} has **${v.factorCount}** factors (an **odd** number).`;
                  }
                  return `The factors of ${v.number}: **${v.allFactors.join(', ')}** — that's **${v.factorCount}** factors (an **even** number). Most numbers have an even number of factors!`;
                }
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "How many factors?",
            body: (v) => `Now try this one! How many **different factors** does **${v.interactNumber}** have?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactNumber}`, why: "Find all the factor pairs, then count the unique factors" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber} has how many factors?`,
              getOptions: (v) => generateDistractors(v.interactFactorCount),
              correctAnswer: (v) => v.interactFactorCount,
              feedback: {
                correct: (v) => `That's right! The factors of ${v.interactNumber} are: **${v.interactAllFactors.join(', ')}** = ${v.interactFactorCount} factors ✓`,
                incorrect: (v) => `Not quite! List them: **${v.interactAllFactors.join(', ')}** = **${v.interactFactorCount}** factors.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Factors and rectangles!",
            body: () => `Every factor pair of a number can be drawn as a rectangle:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Each factor pair = a rectangle", why: "e.g. 3 × 8 = rectangle of 3 rows and 8 columns" },
                  { text: "Square numbers have an ODD number of factors", why: "Because one pair has the same number twice (e.g. 4×4)" },
                  { text: "All other numbers have an EVEN number of factors", why: "Every factor has a different partner ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: Common Factors and HCF
  // ==========================================
  {
    id: "common-factors-hcf",
    name: "Common Factors and HCF",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "hcf-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the common factors (numbers that divide evenly into both) of two numbers",
          "How to identify the HCF — the highest common factor (the biggest number that divides into both)"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "finds the biggest group size that divides equally into two class sizes",
            numberA: 18,
            numberB: 24,
            factorsA: [1, 2, 3, 6, 9, 18],
            factorsB: [1, 2, 3, 4, 6, 8, 12, 24],
            commonFactors: [1, 2, 3, 6],
            hcf: 6,
            unit: "children",
            interactA: 16,
            interactB: 28,
            interactFactorsA: [1, 2, 4, 8, 16],
            interactFactorsB: [1, 2, 4, 7, 14, 28],
            interactCommonFactors: [1, 2, 4],
            interactHCF: 4
          },
          {
            name: "Finn",
            scenario: "cuts two ribbons into equal pieces with no ribbon left over",
            numberA: 12,
            numberB: 20,
            factorsA: [1, 2, 3, 4, 6, 12],
            factorsB: [1, 2, 4, 5, 10, 20],
            commonFactors: [1, 2, 4],
            hcf: 4,
            unit: "centimetres",
            interactA: 14,
            interactB: 21,
            interactFactorsA: [1, 2, 7, 14],
            interactFactorsB: [1, 3, 7, 21],
            interactCommonFactors: [1, 7],
            interactHCF: 7
          },
          {
            name: "Holly",
            scenario: "finds the biggest tile size that fits two wall sections exactly",
            numberA: 30,
            numberB: 45,
            factorsA: [1, 2, 3, 5, 6, 10, 15, 30],
            factorsB: [1, 3, 5, 9, 15, 45],
            commonFactors: [1, 3, 5, 15],
            hcf: 15,
            unit: "cm tiles",
            interactA: 20,
            interactB: 36,
            interactFactorsA: [1, 2, 4, 5, 10, 20],
            interactFactorsB: [1, 2, 3, 4, 6, 9, 12, 18, 36],
            interactCommonFactors: [1, 2, 4],
            interactHCF: 4
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the biggest number that divides into both ${v.numberA} and ${v.numberB}?`,
            body: (v) => `${v.name} ${v.scenario}: **${v.numberA}** and **${v.numberB}**. We need to find the HCF (Highest Common Factor) — that's the biggest number that divides evenly into BOTH. Let's find it!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Highest common factor of ${v.numberA} and ${v.numberB} = ?`, why: "The biggest number that divides into both" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "List, compare, pick the biggest!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Step 1:** List all the factors of each number.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Factors of ${v.numberA}:`, result: v.factorsA.join(', ') },
                    { text: `Factors of ${v.numberB}:`, result: v.factorsB.join(', ') }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 2:** Circle the numbers that appear in BOTH lists. These are the **common factors**:\n**${v.commonFactors.join(', ')}**`
              },
              {
                type: 'text',
                content: (v) => `**Step 3:** Pick the biggest one — that's the **highest common factor (HCF)**:\n\n**The biggest shared factor of ${v.numberA} and ${v.numberB} = ${v.hcf}** ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now try different numbers! What is the **highest common factor** (the biggest number that divides into both) of **${v.interactA}** and **${v.interactB}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Factors of ${v.interactA}: ${v.interactFactorsA.join(', ')}` },
                  { text: `Factors of ${v.interactB}: ${v.interactFactorsB.join(', ')}` },
                  { text: `Common factors: ${v.interactCommonFactors.join(', ')}`, why: "Pick the biggest!" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the highest common factor of ${v.interactA} and ${v.interactB}?`,
              getOptions: (v) => generateDistractors(v.interactHCF),
              correctAnswer: (v) => v.interactHCF,
              feedback: {
                correct: (v) => `Brilliant! The common factors are ${v.interactCommonFactors.join(', ')} — the biggest is **${v.interactHCF}** ✓`,
                incorrect: (v) => `Not quite! The common factors of ${v.interactA} and ${v.interactB} are ${v.interactCommonFactors.join(', ')}. The biggest is **${v.interactHCF}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding the biggest shared factor — the recipe!",
            body: () => `To find the highest common factor (the biggest number that divides evenly into both):`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: List ALL the factors of each number", why: "Use factor pairs so you don't miss any" },
                  { text: "Step 2: Find which factors appear in BOTH lists", why: "These are the common (shared) factors" },
                  { text: "Step 3: Pick the BIGGEST one", why: "That's the highest common factor! ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "hcf-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing HCF (biggest shared factor) with LCM (smallest shared multiple)",
          "Why you need ALL common factors before picking the highest"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "finds the HCF of 12 and 18",
            numberA: 12,
            numberB: 18,
            correctHCF: 6,
            wrongHCF: 36,
            mistakeExplanation: "found the LCM (lowest common multiple) instead of the HCF! The HCF is the biggest number that goes INTO both. The LCM (Lowest Common Multiple) is the smallest number both go INTO",
            commonFactors: [1, 2, 3, 6],
            interactA: 20,
            interactB: 30,
            interactCommonFactors: [1, 2, 5, 10],
            interactHCF: 10
          },
          {
            name: "Priya",
            scenario: "finds the HCF of 16 and 24",
            numberA: 16,
            numberB: 24,
            correctHCF: 8,
            wrongHCF: 4,
            mistakeExplanation: "stopped too early! Found that 4 is a common factor but didn't check if there's a bigger one. 8 divides into both 16 and 24",
            commonFactors: [1, 2, 4, 8],
            interactA: 18,
            interactB: 27,
            interactCommonFactors: [1, 3, 9],
            interactHCF: 9
          },
          {
            name: "Oscar",
            scenario: "finds the HCF of 15 and 20",
            numberA: 15,
            numberB: 20,
            correctHCF: 5,
            wrongHCF: 3,
            mistakeExplanation: "said 3 because it's a factor of 15. But 3 doesn't divide into 20! A common factor must divide into BOTH numbers",
            commonFactors: [1, 5],
            interactA: 14,
            interactB: 35,
            interactCommonFactors: [1, 7],
            interactHCF: 7
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n${v.name} says: the highest common factor of ${v.numberA} and ${v.numberB} = **${v.wrongHCF}**\n\nThat's not right!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongHCF}`, why: "WRONG!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's check properly!",
            body: (v) => `${v.name} ${v.mistakeExplanation}.\n\nDon't mix up **HCF** (Highest Common Factor — the biggest number that goes into both) and **LCM** (Lowest Common Multiple — the smallest number both go into)!\n\nThe common factors of ${v.numberA} and ${v.numberB} are: **${v.commonFactors.join(', ')}**. The biggest one is **${v.correctHCF}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Common factors: ${v.commonFactors.join(', ')}`, why: "Numbers that divide into BOTH" },
                  { text: `The biggest: ${v.correctHCF}`, result: `Highest common factor = ${v.correctHCF} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Try a new pair!",
            body: (v) => `What is the **highest common factor** of **${v.interactA}** and **${v.interactB}**? (The biggest number that divides into both.)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Common factors of ${v.interactA} and ${v.interactB}: ${v.interactCommonFactors.join(', ')}`, why: "Pick the biggest" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the highest common factor of ${v.interactA} and ${v.interactB}?`,
              getOptions: (v) => generateDistractors(v.interactHCF),
              correctAnswer: (v) => v.interactHCF,
              feedback: {
                correct: (v) => `That's right! The highest common factor of ${v.interactA} and ${v.interactB} = **${v.interactHCF}** ✓`,
                incorrect: (v) => `Not quite! The common factors are ${v.interactCommonFactors.join(', ')}. The highest is **${v.interactHCF}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two terms — don't mix them up!",
            body: () => `These sound similar but mean very different things:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "HCF (Highest Common Factor)", why: "The BIGGEST number that divides into both" },
                  { text: "LCM (Lowest Common Multiple)", why: "The SMALLEST number that both go into" },
                  { text: "The HCF is always a small number (or equal to the smaller one)", why: "The LCM is always a big number (or equal to the larger one) ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: Common Multiples and LCM
  // ==========================================
  {
    id: "common-multiples-lcm",
    name: "Common Multiples and LCM",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "lcm-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the first few common multiples (numbers in the times table) of two numbers",
          "How to identify the LCM — the lowest common multiple (the smallest number in both times tables)"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "works out when two buses will arrive at the same time",
            numberA: 6,
            numberB: 8,
            multiplesA: [6, 12, 18, 24, 30, 36, 42, 48],
            multiplesB: [8, 16, 24, 32, 40, 48],
            commonMultiples: [24, 48],
            lcm: 24,
            unit: "minutes",
            interactA: 4,
            interactB: 10,
            interactMultiplesA: [4, 8, 12, 16, 20],
            interactMultiplesB: [10, 20],
            interactLCM: 20
          },
          {
            name: "Ben",
            scenario: "finds when two flashing lights will flash together",
            numberA: 4,
            numberB: 6,
            multiplesA: [4, 8, 12, 16, 20, 24],
            multiplesB: [6, 12, 18, 24],
            commonMultiples: [12, 24],
            lcm: 12,
            unit: "seconds",
            interactA: 3,
            interactB: 8,
            interactMultiplesA: [3, 6, 9, 12, 15, 18, 21, 24],
            interactMultiplesB: [8, 16, 24],
            interactLCM: 24
          },
          {
            name: "Nadia",
            scenario: "works out the smallest number of each item to buy to have equal amounts",
            numberA: 5,
            numberB: 8,
            multiplesA: [5, 10, 15, 20, 25, 30, 35, 40],
            multiplesB: [8, 16, 24, 32, 40],
            commonMultiples: [40],
            lcm: 40,
            unit: "items",
            interactA: 6,
            interactB: 9,
            interactMultiplesA: [6, 12, 18],
            interactMultiplesB: [9, 18],
            interactLCM: 18
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `When do ${v.numberA} and ${v.numberB} match up?`,
            body: (v) => `${v.name} ${v.scenario}. One happens every **${v.numberA}** ${v.unit} and the other every **${v.numberB}** ${v.unit}. When will they next happen at the **same time**? We need to find the LCM (Lowest Common Multiple) — the smallest number that both go into!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Lowest common multiple of ${v.numberA} and ${v.numberB} = ?`, why: "The smallest number in both times tables" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "List multiples until they match!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Step 1:** Write out the multiples of each number:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Multiples of ${v.numberA}:`, result: v.multiplesA.join(', ') },
                    { text: `Multiples of ${v.numberB}:`, result: v.multiplesB.join(', ') }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 2:** Find the numbers that appear in BOTH lists:\n**${v.commonMultiples.join(', ')}**`
              },
              {
                type: 'visual',
                component: 'NumberLine',
                props: (v) => ({
                  min: 0,
                  max: v.lcm + v.numberA,
                  points: [
                    { value: v.lcm, label: `${v.lcm} ✓`, color: "#16a34a" }
                  ],
                  jumps: [],
                  tickInterval: v.numberA,
                  showLabels: true,
                  highlight: [v.lcm, v.lcm]
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 3:** Pick the **smallest** one — that's the lowest common multiple:\n\n**The smallest shared multiple of ${v.numberA} and ${v.numberB} = ${v.lcm}** ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now try different numbers! What is the **lowest common multiple** of **${v.interactA}** and **${v.interactB}**? (The smallest number in both times tables.)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Multiples of ${v.interactA}: ${v.interactMultiplesA.join(', ')}` },
                  { text: `Multiples of ${v.interactB}: ${v.interactMultiplesB.join(', ')}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the lowest common multiple of ${v.interactA} and ${v.interactB}?`,
              getOptions: (v) => generateDistractors(v.interactLCM),
              correctAnswer: (v) => v.interactLCM,
              feedback: {
                correct: (v) => `That's right! **${v.interactLCM}** is the smallest number that both ${v.interactA} and ${v.interactB} divide into ✓`,
                incorrect: (v) => `Not quite! List the multiples until they match. The lowest common multiple of ${v.interactA} and ${v.interactB} is **${v.interactLCM}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Finding the lowest common multiple — the recipe!",
            body: () => `To find the lowest common multiple (the smallest number in both times tables):`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Write out the times tables for both numbers", why: "Keep going until you spot a match" },
                  { text: "Step 2: The FIRST number in both lists is the answer", why: "That's the lowest common multiple! ✓" },
                  { text: "Quick trick: if the two numbers share no factors, just multiply them", why: "e.g. 5 and 7 share no factors, so 5 × 7 = 35 ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity Hook ----
      {
        id: "lcm-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "Why the LCM (lowest common multiple) is NOT always the two numbers multiplied together",
          "How the HCF (highest common factor) and LCM are connected"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "thinks the LCM of 6 and 8 is 48",
            numberA: 6,
            numberB: 8,
            wrongLCM: 48,
            correctLCM: 24,
            explanation: "6 × 8 = 48, but 24 also works: 24 ÷ 6 = 4 and 24 ÷ 8 = 3. Since 6 and 8 share the factor 2, the LCM is smaller than 6 × 8",
            interactA: 4,
            interactB: 14,
            interactLCM: 28
          },
          {
            name: "Ella",
            scenario: "calculates the LCM of 4 and 10",
            numberA: 4,
            numberB: 10,
            wrongLCM: 40,
            correctLCM: 20,
            explanation: "4 × 10 = 40, but 20 also works: 20 ÷ 4 = 5 and 20 ÷ 10 = 2. Since 4 and 10 share the factor 2, the LCM is smaller",
            interactA: 6,
            interactB: 15,
            interactLCM: 30
          },
          {
            name: "Marcus",
            scenario: "works out the LCM of 3 and 7",
            numberA: 3,
            numberB: 7,
            wrongLCM: null,
            correctLCM: 21,
            explanation: "3 × 7 = 21. This time it IS the product! When two numbers share no common factors (other than 1), the LCM equals their product",
            interactA: 5,
            interactB: 9,
            interactLCM: 45
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.wrongLCM ? `Is ${v.wrongLCM} really the lowest common multiple?` : `A special case for ${v.numberA} and ${v.numberB}!`,
            body: (v) => v.wrongLCM
              ? `${v.name} ${v.scenario}. He just multiplied ${v.numberA} × ${v.numberB} = ${v.wrongLCM}. But is there a SMALLER number that both ${v.numberA} and ${v.numberB} go into?`
              : `${v.name} ${v.scenario}. Sometimes the LCM (Lowest Common Multiple) really IS the two numbers multiplied together. When does that happen?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numberA} × ${v.numberB} = ${v.numberA * v.numberB}`, why: v.wrongLCM ? "But is there something smaller?" : "Is this the LCM?" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check for shared factors!",
            body: (v) => `${v.explanation}\n\nThe correct lowest common multiple of ${v.numberA} and ${v.numberB} is **${v.correctLCM}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.correctLCM} ÷ ${v.numberA} = ${v.correctLCM / v.numberA}`, result: "Whole number ✓" },
                  { text: `${v.correctLCM} ÷ ${v.numberB} = ${v.correctLCM / v.numberB}`, result: "Whole number ✓" },
                  { text: `Lowest common multiple = ${v.correctLCM}`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now try these! What is the **lowest common multiple** of **${v.interactA}** and **${v.interactB}**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactA} × ${v.interactB} = ${v.interactA * v.interactB}`, why: "But check if it can be smaller!" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the lowest common multiple of ${v.interactA} and ${v.interactB}?`,
              getOptions: (v) => generateDistractors(v.interactLCM),
              correctAnswer: (v) => v.interactLCM,
              feedback: {
                correct: (v) => `Spot on! The lowest common multiple of ${v.interactA} and ${v.interactB} = **${v.interactLCM}** ✓`,
                incorrect: (v) => `Not quite! The answer is **${v.interactLCM}**. Don't just multiply — check if there's a smaller number both go into!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "A handy shortcut!",
            body: () => `You can find the lowest common multiple using the highest common factor:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Multiply the two numbers, then divide by the highest common factor", why: "This always gives the lowest common multiple!" },
                  { text: "Example: 6 and 8", why: "6 × 8 = 48, the highest common factor is 2, so 48 ÷ 2 = 24 ✓" },
                  { text: "If the numbers share no factors, just multiply them", why: "e.g. 3 and 7 share no factors, so 3 × 7 = 21 ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: Prime Factorisation
  // ==========================================
  {
    id: "prime-factorisation",
    name: "Breaking a Number into Prime Factors",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "prime-factor-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to break a number into prime numbers multiplied together (prime factorisation)",
          "How to use a factor tree to find them"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "uses a factor tree to break down 60",
            number: 60,
            treeSteps: ["60 = 2 × 30", "30 = 2 × 15", "15 = 3 × 5"],
            primeFactors: [2, 2, 3, 5],
            primeFactorStr: "2 × 2 × 3 × 5",
            indexForm: "2² × 3 × 5",
            interactNumber: 42,
            interactTreeSteps: ["42 = 2 × 21", "21 = 3 × 7"],
            interactPrimeFactors: [2, 3, 7],
            interactPrimeFactorStr: "2 × 3 × 7"
          },
          {
            name: "Oscar",
            scenario: "breaks down 72 into prime factors",
            number: 72,
            treeSteps: ["72 = 2 × 36", "36 = 2 × 18", "18 = 2 × 9", "9 = 3 × 3"],
            primeFactors: [2, 2, 2, 3, 3],
            primeFactorStr: "2 × 2 × 2 × 3 × 3",
            indexForm: "2³ × 3²",
            interactNumber: 50,
            interactTreeSteps: ["50 = 2 × 25", "25 = 5 × 5"],
            interactPrimeFactors: [2, 5, 5],
            interactPrimeFactorStr: "2 × 5 × 5"
          },
          {
            name: "Nadia",
            scenario: "finds the prime factors of 45",
            number: 45,
            treeSteps: ["45 = 3 × 15", "15 = 3 × 5"],
            primeFactors: [3, 3, 5],
            primeFactorStr: "3 × 3 × 5",
            indexForm: "3² × 5",
            interactNumber: 28,
            interactTreeSteps: ["28 = 2 × 14", "14 = 2 × 7"],
            interactPrimeFactors: [2, 2, 7],
            interactPrimeFactorStr: "2 × 2 × 7"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Break ${v.number} into prime pieces!`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `**Prime factorisation** means writing a number as **prime numbers multiplied together**. An exam question might say: "Write ${v.number} as a product of its prime factors."\n\nIt's useful because it helps you find the highest common factor and lowest common multiple of two numbers — and it comes up in 11+ exams!`
              },
              {
                type: 'text',
                content: (v) => `${v.name} ${v.scenario}. We use a **factor tree** — keep splitting until every piece is prime:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "12", result: "Split into 2 × 6" },
                    { text: "6", result: "Split into 2 × 3" },
                    { text: "2 and 3 are both prime — stop!", result: "12 = 2 × 2 × 3 ✓" }
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
            title: () => "Build a factor tree!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Let's break **${v.number}** into primes. At each step, split the number into two smaller numbers that multiply to give it. Stop when you reach a prime (a number that can only be divided by 1 and itself).`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    ...v.treeSteps.map((step, i) => {
                      const parts = step.split(' = ');
                      const factors = parts[1].split(' × ');
                      const isPrime = (n) => [2,3,5,7,11,13,17,19,23,29,31].includes(Number(n));
                      const f1Prime = isPrime(factors[0]);
                      const f2Prime = isPrime(factors[1]);
                      let why = '';
                      if (f1Prime && f2Prime) why = `${factors[0]} and ${factors[1]} are both prime — we're done!`;
                      else if (f1Prime) why = `${factors[0]} is prime ✓ — now split ${factors[1]}`;
                      else why = `Neither is prime yet — keep splitting`;
                      return { text: step, why };
                    }),
                    { text: `Collect all the primes:`, result: `${v.number} = ${v.primeFactorStr} ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `You can also write this in **short form** using powers:\n**${v.number} = ${v.indexForm}**\n(2² means 2 × 2, 3² means 3 × 3 — the small number tells you how many times)`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Now try a different number! What is **${v.interactNumber}** broken into prime numbers multiplied together?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  ...v.interactTreeSteps.map((step, i) => {
                    const parts = step.split(' = ');
                    const factors = parts[1].split(' × ');
                    const isLast = i === v.interactTreeSteps.length - 1;
                    if (isLast) {
                      return { text: step, why: `Both ${factors[0]} and ${factors[1]} are prime — collect them both!` };
                    }
                    return { text: step, why: `${factors[0]} is prime ✓ — keep splitting ${factors[1]}` };
                  }),
                  { text: `Collect all the primes:`, result: `${v.interactNumber} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber} = which primes multiplied together?`,
              getOptions: (v) => [
                v.interactPrimeFactorStr,
                v.interactPrimeFactorStr.replace('×', '+'),
                String(v.interactNumber) + ' × 1',
                v.interactPrimeFactors.slice(0, -1).join(' × '),
                [...v.interactPrimeFactors].reverse().join(' + ')
              ],
              correctAnswer: (v) => v.interactPrimeFactorStr,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumber} = ${v.interactPrimeFactorStr}** ✓`,
                incorrect: (v) => `Not quite! Follow the factor tree: **${v.interactNumber} = ${v.interactPrimeFactorStr}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Breaking numbers into primes — the recipe!",
            body: () => `To break any number into prime numbers multiplied together:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Split the number into two smaller numbers", why: "Start by dividing by the smallest prime that works (usually 2)" },
                  { text: "Step 2: Keep splitting until every piece is prime", why: "e.g. 60 → 2 × 30 → 2 × 2 × 15 → 2 × 2 × 3 × 5" },
                  { text: "Step 3: Write out all the primes multiplied together", why: "60 = 2 × 2 × 3 × 5 ✓" },
                  { text: "Short form: use powers (² means 'times itself')", why: "2 × 2 = 2², so 60 = 2² × 3 × 5 ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Step by Step ----
      {
        id: "prime-factor-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use repeated division to break a number into primes",
          "Why always dividing by the smallest prime works"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "uses repeated division to factorise a number",
            number: 84,
            divisions: [
              { divisor: 2, result: 42 },
              { divisor: 2, result: 21 },
              { divisor: 3, result: 7 },
              { divisor: 7, result: 1 }
            ],
            primeFactorStr: "2 × 2 × 3 × 7",
            indexForm: "2² × 3 × 7",
            interactNumber: 56,
            interactDivisions: [
              { divisor: 2, result: 28 },
              { divisor: 2, result: 14 },
              { divisor: 2, result: 7 },
              { divisor: 7, result: 1 }
            ],
            interactPrimeFactorStr: "2 × 2 × 2 × 7",
            interactCountOf2: 3
          },
          {
            name: "Daisy",
            scenario: "factorises a number step by step",
            number: 100,
            divisions: [
              { divisor: 2, result: 50 },
              { divisor: 2, result: 25 },
              { divisor: 5, result: 5 },
              { divisor: 5, result: 1 }
            ],
            primeFactorStr: "2 × 2 × 5 × 5",
            indexForm: "2² × 5²",
            interactNumber: 75,
            interactDivisions: [
              { divisor: 3, result: 25 },
              { divisor: 5, result: 5 },
              { divisor: 5, result: 1 }
            ],
            interactPrimeFactorStr: "3 × 5 × 5",
            interactCountOf2: 0
          },
          {
            name: "Isaac",
            scenario: "breaks a number down using the division method",
            number: 90,
            divisions: [
              { divisor: 2, result: 45 },
              { divisor: 3, result: 15 },
              { divisor: 3, result: 5 },
              { divisor: 5, result: 1 }
            ],
            primeFactorStr: "2 × 3 × 3 × 5",
            indexForm: "2 × 3² × 5",
            interactNumber: 44,
            interactDivisions: [
              { divisor: 2, result: 22 },
              { divisor: 2, result: 11 },
              { divisor: 11, result: 1 }
            ],
            interactPrimeFactorStr: "2 × 2 × 11",
            interactCountOf2: 2
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Factorise ${v.number} by dividing!`,
            body: (v) => `**Prime factorisation** means writing a number as prime numbers multiplied together. For example, an exam might ask: "Express ${v.number} as a product of prime factors."\n\n${v.name} ${v.scenario}: **${v.number}**. There's a simple method — keep dividing by the **smallest possible prime** until you reach 1!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.number} → divide by primes → ???`, why: "Start with the smallest: 2" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide, divide, divide!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Keep dividing by the **smallest prime** that goes in evenly. Always try **2** first, then **3**, then **5**, then **7**...`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    ...v.divisions.map((d, i) => {
                      const startNum = i === 0 ? v.number : v.divisions[i - 1].result;
                      const why = d.divisor === 2 ? `${startNum} is even, so divide by 2` :
                                  d.divisor === 3 ? `${startNum} is not even, but divides by 3` :
                                  `${startNum} is prime — divide by itself`;
                      return { text: `${startNum} ÷ ${d.divisor} = ${d.result}`, why };
                    }),
                    { text: `Reached 1 — done!`, result: `${v.number} = ${v.primeFactorStr} ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `In **short form** using powers: **${v.number} = ${v.indexForm}**\n(The small number tells you how many times that prime appears)`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use the division method to find the prime factorisation of **${v.interactNumber}**.\nKeep dividing by the smallest prime that goes in!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.interactDivisions.map((d, i) => {
                  const startNum = i === 0 ? v.interactNumber : v.interactDivisions[i - 1].result;
                  return { text: `${startNum} ÷ ${d.divisor} = ${d.result}` };
                }),
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber} as a product of prime factors = ?`,
              getOptions: (v) => [
                v.interactPrimeFactorStr,
                v.interactPrimeFactorStr.replace('×', '+'),
                String(v.interactNumber) + ' × 1',
                v.interactPrimeFactorStr.split(' × ').slice(0, -1).join(' × '),
                v.interactPrimeFactorStr.split(' × ').map(n => String(Number(n) + 1)).join(' × ')
              ],
              correctAnswer: (v) => v.interactPrimeFactorStr,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactNumber} = ${v.interactPrimeFactorStr}** ✓`,
                incorrect: (v) => `Not quite! Collect all the divisors: **${v.interactNumber} = ${v.interactPrimeFactorStr}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The division ladder method!",
            body: () => `An alternative to factor trees — repeated division:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Start with your number", why: "e.g. 84" },
                  { text: "Divide by 2 as many times as you can", why: "84 ÷ 2 = 42, 42 ÷ 2 = 21" },
                  { text: "Then try 3, then 5, then 7...", why: "21 ÷ 3 = 7, 7 ÷ 7 = 1" },
                  { text: "Stop when you reach 1", why: "Collect all the prime factors: 2 × 2 × 3 × 7 ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: Divisibility Rules
  // ==========================================
  {
    id: "divisibility-rules",
    name: "Quick Tests for Divisibility",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "divisibility-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to quickly test if a number divides evenly by 2, 3, 4, 5, 6, 8, 9, 10",
          "Why these shortcuts save time in the 11+ exam"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "uses divisibility rules to check a number quickly",
            testNumber: 342,
            divBy2: true,
            divBy3: true,
            divBy4: false,
            divBy5: false,
            divBy6: true,
            divBy9: true,
            digitSum: 9,
            lastDigit: 2,
            last2Digits: 42,
            interactNumber: 456,
            interactDigitSum: 15,
            interactDivBy3: true
          },
          {
            name: "Ben",
            scenario: "checks which numbers divide into a large number",
            testNumber: 720,
            divBy2: true,
            divBy3: true,
            divBy4: true,
            divBy5: true,
            divBy6: true,
            divBy9: true,
            digitSum: 9,
            lastDigit: 0,
            last2Digits: 20,
            interactNumber: 253,
            interactDigitSum: 10,
            interactDivBy3: false
          },
          {
            name: "Priya",
            scenario: "tests a number using divisibility shortcuts",
            testNumber: 528,
            divBy2: true,
            divBy3: true,
            divBy4: true,
            divBy5: false,
            divBy6: true,
            divBy9: false,
            digitSum: 15,
            lastDigit: 8,
            last2Digits: 28,
            interactNumber: 612,
            interactDigitSum: 9,
            interactDivBy3: true
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Quick: what divides into ${v.testNumber}?`,
            body: (v) => `${v.name} ${v.scenario}: **${v.testNumber}**. You don't need to do long division! There are **quick tricks** to check whether a number divides evenly — without having to work it all out.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Does 2, 3, 4 or 5 divide evenly into ${v.testNumber}?`, why: "There are quick tricks for each one!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Quick divisibility tricks!",
            bodyParts: (v) => [
              { type: "text", content: (v) => `Here are the **quick tricks** to check if a number divides evenly — no long division needed! Let's test **${v.testNumber}**:` },
              { type: "visual", component: "WorkedExample", props: (v) => ({
                steps: [
                  { text: `Divides by 2? → Look at the last digit`, why: `Last digit is ${v.lastDigit} — ${v.divBy2 ? 'even, so YES ✓' : 'odd, so NO ✗'}` },
                  { text: `Divides by 3? → Add up all the digits`, why: `${String(v.testNumber).split('').join(' + ')} = ${v.digitSum}. Does 3 go into ${v.digitSum}? ${v.divBy3 ? 'YES ✓' : 'NO ✗'}` },
                  { text: `Divides by 5? → Does it end in 0 or 5?`, why: `Ends in ${v.lastDigit} — ${v.divBy5 ? 'YES ✓' : 'NO ✗'}` },
                  { text: `Divides by 9? → Add up all the digits again`, why: `Digit sum is ${v.digitSum}. Does 9 go into ${v.digitSum}? ${v.divBy9 ? 'YES ✓' : 'NO ✗'}` }
                ]
              })}
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Quick test!",
            body: (v) => `Now try a different number! Does **3** divide evenly into **${v.interactNumber}**? Use the trick: add up the digits (${String(v.interactNumber).split('').join(' + ')} = ${v.interactDigitSum}). Does 3 go into ${v.interactDigitSum}?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Digits of ${v.interactNumber}: ${String(v.interactNumber).split('').join(' + ')} = ${v.interactDigitSum}`, why: `Does 3 go into ${v.interactDigitSum}?` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Does 3 divide evenly into ${v.interactNumber}?`,
              getOptions: (v) => [
                v.interactDivBy3 ? "Yes" : "No",
                v.interactDivBy3 ? "No" : "Yes",
                "Only if it's even",
                "Only if it ends in 3",
                "Can't tell without dividing"
              ],
              correctAnswer: (v) => v.interactDivBy3 ? "Yes" : "No",
              feedback: {
                correct: (v) => v.interactDivBy3
                  ? `That's right! The digits add up to ${v.interactDigitSum}, and 3 DOES go into ${v.interactDigitSum} ✓`
                  : `That's right! The digits add up to ${v.interactDigitSum}, and 3 does NOT go into ${v.interactDigitSum} ✓`,
                incorrect: (v) => `Add the digits: ${String(v.interactNumber).split('').join(' + ')} = ${v.interactDigitSum}. ${v.interactDivBy3 ? `3 goes into ${v.interactDigitSum} (${v.interactDigitSum} ÷ 3 = ${v.interactDigitSum / 3}), so YES!` : `3 does not go into ${v.interactDigitSum}, so NO!`}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Your cheat sheet!",
            bodyParts: () => [
              { type: "text", content: "**The digit sum trick** — add up all the digits. This trick ONLY works for checking 3 and 9 (not for 2, 4, 5 or any other number):" },
              { type: "visual", component: "WorkedExample", props: {
                steps: [
                  { text: "Add up ALL the digits of the number", why: "e.g. 342 → 3 + 4 + 2 = 9" },
                  { text: "Does 3 go into that total? If yes → divides by 3", why: "9 ÷ 3 = 3 → yes, 342 divides by 3 ✓" },
                  { text: "Does 9 go into that total? If yes → divides by 9", why: "9 ÷ 9 = 1 → yes, 342 divides by 9 ✓" }
                ]
              }},
              { type: "text", content: "**Other quick checks:**" },
              { type: "visual", component: "WorkedExample", props: {
                steps: [
                  { text: "÷2 → is the last digit even? (0, 2, 4, 6, 8)", why: "342 → last digit 2, that's even → yes" },
                  { text: "÷5 → does it end in 0 or 5?", why: "720 → ends in 0 → yes" },
                  { text: "÷4 → do the last two digits divide by 4?", why: "528 → 28 ÷ 4 = 7 → yes" },
                  { text: "÷6 → must pass BOTH the ÷2 AND ÷3 checks", why: "342 → even ✓ and digits add to 9 (÷3) ✓ → yes" }
                ]
              }}
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "divisibility-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid common mistakes with divisibility rules (shortcuts for checking if a number divides evenly)",
          "Why the digit sum rule (adding all the digits) works for 3 and 9 but not other numbers"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "says 123 is divisible by 9 because the digits contain a 9-like pattern",
            testNumber: 123,
            wrongClaim: "123 is divisible by 9",
            correctAnswer: false,
            digitSum: 6,
            mistakeExplanation: "1+2+3 = 6, and 6 is NOT divisible by 9. So 123 is NOT divisible by 9. (It IS divisible by 3 though, since 6 ÷ 3 = 2)"
          },
          {
            name: "Ella",
            scenario: "checks if 250 is divisible by 4",
            testNumber: 250,
            wrongClaim: "250 is divisible by 4 because it's even",
            correctAnswer: false,
            digitSum: 7,
            mistakeExplanation: "being even only means it's divisible by 2, not 4! To check ÷4, look at the last TWO digits: 50 ÷ 4 = 12.5 — NOT a whole number. So 250 is NOT divisible by 4"
          },
          {
            name: "Marcus",
            scenario: "says 315 is divisible by 6",
            testNumber: 315,
            wrongClaim: "315 is divisible by 6 because its digit sum is divisible by 3",
            correctAnswer: false,
            digitSum: 9,
            mistakeExplanation: "to be divisible by 6, a number must be divisible by BOTH 2 AND 3. The digit sum 9 is divisible by 3 ✓, but 315 is ODD so not divisible by 2 ✗. Therefore 315 is NOT divisible by 6"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n${v.name} says: "${v.wrongClaim}"\n\nIs that right?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.wrongClaim, why: "Let's check!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's check properly!",
            body: (v) => `${v.name}: ${v.mistakeExplanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.testNumber}: digit sum = ${v.digitSum}`, why: `${v.digitSum} ÷ 3 = ${(v.digitSum / 3).toFixed(1)}${v.digitSum % 3 === 0 ? ' ✓' : ' ✗'}` },
                  { text: `Last digit: ${v.testNumber % 10}`, why: `${v.testNumber % 2 === 0 ? 'Even ✓' : 'Odd ✗'}` },
                  { text: v.correctAnswer ? `${v.testNumber} passes the test!` : `${v.testNumber} FAILS the test!`, result: v.correctAnswer ? "✓" : "✗" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Is it really divisible?",
            body: (v) => `Is **${v.testNumber}** actually divisible as claimed?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Claim: "${v.wrongClaim}"`, why: "True or false?" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is ${v.wrongClaim}?`,
              getOptions: () => ["No — it fails the test", "Yes — it passes the test", "Maybe — need more info", "Only sometimes", "Can't tell"],
              correctAnswer: () => "No — it fails the test",
              feedback: {
                correct: (v) => `That's right! **${v.testNumber}** fails the divisibility test. ${v.mistakeExplanation} ✓`,
                incorrect: (v) => `Not quite! ${v.mistakeExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Apply the rules carefully!",
            body: () => `Common mistakes to avoid:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Even does NOT always mean divisible by 4", why: "For ÷4, check the LAST TWO digits" },
                  { text: "÷6 needs BOTH ÷2 AND ÷3", why: "Odd numbers can never be divisible by 6" },
                  { text: "Digit sum works for 3 and 9 ONLY", why: "Don't use it for 4, 5, 6, 8, or 10 ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: HCF and LCM Word Problems
  // ==========================================
  {
    id: "hcf-lcm-word-problems",
    name: "HCF and LCM in Context",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "hcf-lcm-context-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot whether a word problem needs HCF (biggest shared factor) or LCM (smallest shared multiple)",
          "Why 'sharing equally' means HCF and 'happening together' means LCM"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "has 24 red flowers and 36 white flowers to make identical bunches",
            numberA: 24,
            numberB: 36,
            needHCF: true,
            answer: 12,
            answerUnit: "bunches",
            explanation: "She needs to SHARE both 24 and 36 equally → use HCF. HCF(24, 36) = 12. She can make 12 identical bunches (2 red + 3 white each)",
            interactA: 16,
            interactB: 28,
            interactNeedHCF: true,
            interactAnswer: 4,
            interactAnswerUnit: "equal groups",
            interactScenario: "has 16 apples and 28 oranges to put into identical bags"
          },
          {
            name: "Oscar",
            scenario: "works out when two gym classes will be on the same day",
            numberA: 3,
            numberB: 5,
            needHCF: false,
            answer: 15,
            answerUnit: "days",
            explanation: "She needs to find when both events HAPPEN TOGETHER → use LCM. LCM(3, 5) = 15. They'll both be on the same day in 15 days",
            interactA: 4,
            interactB: 7,
            interactNeedHCF: false,
            interactAnswer: 28,
            interactAnswerUnit: "days",
            interactScenario: "works out when two swimming lessons will fall on the same day"
          },
          {
            name: "Finn",
            scenario: "cuts two ropes into equal pieces with no rope left over",
            numberA: 18,
            numberB: 30,
            needHCF: true,
            answer: 6,
            answerUnit: "cm per piece",
            explanation: "He needs the BIGGEST piece that divides both lengths equally → use HCF. HCF(18, 30) = 6. Each piece is 6 cm long",
            interactA: 6,
            interactB: 10,
            interactNeedHCF: false,
            interactAnswer: 30,
            interactAnswerUnit: "seconds",
            interactScenario: "works out when two alarms will ring at the same time"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Biggest shared factor or smallest shared multiple?`,
            body: (v) => `${v.name} ${v.scenario}. The numbers are **${v.numberA}** and **${v.numberB}**.\n\nDoes ${v.name} need the **highest common factor** (biggest number that divides into both) or the **lowest common multiple** (smallest number both go into)?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Numbers: ${v.numberA} and ${v.numberB}`, why: "Which tool do we need?" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => v.needHCF ? "Find the biggest shared factor!" : "Find the smallest shared multiple!",
            body: (v) => `${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: v.needHCF ? "Sharing/dividing equally → highest common factor" : "Happening together/at the same time → lowest common multiple", why: v.needHCF ? "Find the biggest number that divides both" : "Find the smallest number both divide into" },
                  { text: `The ${v.needHCF ? 'highest common factor' : 'lowest common multiple'} of ${v.numberA} and ${v.numberB} = ${v.answer}`, result: `${v.answer} ${v.answerUnit} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Try a new problem!",
            body: (v) => `${v.name} ${v.interactScenario}. The numbers are **${v.interactA}** and **${v.interactB}**. What's the answer?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Use the ${v.interactNeedHCF ? 'highest common factor' : 'lowest common multiple'}`, why: `Of ${v.interactA} and ${v.interactB}` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The answer is:`,
              getOptions: (v) => generateDistractors(v.interactAnswer),
              correctAnswer: (v) => v.interactAnswer,
              feedback: {
                correct: (v) => `That's right! The ${v.interactNeedHCF ? 'highest common factor' : 'lowest common multiple'} of ${v.interactA} and ${v.interactB} = **${v.interactAnswer}** ${v.interactAnswerUnit} ✓`,
                incorrect: (v) => `Not quite! The ${v.interactNeedHCF ? 'highest common factor' : 'lowest common multiple'} of ${v.interactA} and ${v.interactB} = **${v.interactAnswer}** ${v.interactAnswerUnit}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Which one do I need?",
            body: () => `How to tell whether you need the **biggest shared factor** or the **smallest shared multiple**:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Highest common factor when: sharing, cutting, dividing into equal groups", why: "Keywords: 'biggest group', 'largest piece', 'equal shares'" },
                  { text: "Lowest common multiple when: timing, repeating events, buying packs", why: "Keywords: 'same time', 'together again', 'both on the same day'" },
                  { text: "Quick check: the biggest shared factor is always ≤ the smaller number", why: "And the smallest shared multiple is always ≥ the bigger number ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "hcf-lcm-context-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid mixing up highest common factor and lowest common multiple",
          "How to check your answer makes sense in the question"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "Two traffic lights flash every 6 and 8 seconds. He wants to know when they'll flash together",
            numberA: 6,
            numberB: 8,
            wrongAnswer: 2,
            wrongMethod: "highest common factor",
            wrongMethodShort: "HCF",
            correctAnswer: 24,
            correctMethod: "lowest common multiple",
            correctMethodShort: "LCM",
            mistakeExplanation: "found the highest common factor (= 2) when he should have found the lowest common multiple (= 24). The lights flash TOGETHER next after 24 seconds — not after 2!",
            interactA: 10,
            interactB: 15,
            interactCorrectAnswer: 30,
            interactCorrectMethod: "lowest common multiple",
            interactScenario: "Two bells ring every 10 and 15 minutes. When will they ring together?"
          },
          {
            name: "Lily",
            scenario: "A chef has 40 sausages and 60 bread rolls and wants identical plates",
            numberA: 40,
            numberB: 60,
            wrongAnswer: 120,
            wrongMethod: "lowest common multiple",
            wrongMethodShort: "LCM",
            correctAnswer: 20,
            correctMethod: "highest common factor",
            correctMethodShort: "HCF",
            mistakeExplanation: "found the lowest common multiple (= 120) when she should have found the highest common factor (= 20). She can make 20 identical plates (2 sausages + 3 rolls each)",
            interactA: 18,
            interactB: 24,
            interactCorrectAnswer: 6,
            interactCorrectMethod: "highest common factor",
            interactScenario: "A florist has 18 roses and 24 tulips and wants identical bouquets. How many can she make?"
          },
          {
            name: "Priya",
            scenario: "Two buses depart every 12 and 15 minutes. She wants to know when they'll leave at the same time",
            numberA: 12,
            numberB: 15,
            wrongAnswer: 3,
            wrongMethod: "highest common factor",
            wrongMethodShort: "HCF",
            correctAnswer: 60,
            correctMethod: "lowest common multiple",
            correctMethodShort: "LCM",
            mistakeExplanation: "found the highest common factor (= 3) when she needed the lowest common multiple (= 60). The buses leave together every 60 minutes",
            interactA: 8,
            interactB: 6,
            interactCorrectAnswer: 24,
            interactCorrectMethod: "lowest common multiple",
            interactScenario: "Two ferries depart every 8 and 6 minutes. When will they leave together?"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot ${v.name}'s mistake!`,
            body: (v) => `${v.name}: ${v.scenario}.\n\n${v.name} found the **${v.wrongMethod}** and got **${v.wrongAnswer}**. Does that answer make sense?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name} found the ${v.wrongMethod} of ${v.numberA} and ${v.numberB} = ${v.wrongAnswer}`, why: "Does this make sense?" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong tool for the job!",
            body: (v) => `${v.name} ${v.mistakeExplanation}\n\nThe correct answer: find the **${v.correctMethod}** of ${v.numberA} and ${v.numberB} = **${v.correctAnswer}**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.wrongMethod} = ${v.wrongAnswer}`, why: "Doesn't make sense in context!" },
                  { text: `Right: ${v.correctMethod} = ${v.correctAnswer}`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Try a new problem!",
            body: (v) => `${v.interactScenario}\n\nThe numbers are **${v.interactA}** and **${v.interactB}**. The answer is:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find the ${v.interactCorrectMethod} of ${v.interactA} and ${v.interactB}`, why: "Think about what the question is asking!" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `The correct answer is:`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! The ${v.interactCorrectMethod} of ${v.interactA} and ${v.interactB} = **${v.interactCorrectAnswer}** ✓`,
                incorrect: (v) => `Not quite! Find the ${v.interactCorrectMethod}: the ${v.interactCorrectMethod} of ${v.interactA} and ${v.interactB} = **${v.interactCorrectAnswer}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Always check: does the answer make sense?",
            body: () => `After finding the highest common factor or lowest common multiple, ask yourself:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Does the answer fit the context?", why: "e.g. 'lights flash together after 2 seconds' is too quick!" },
                  { text: "The highest common factor should be smaller than or equal to the smaller number", why: "If it's bigger, you probably found the lowest common multiple by mistake" },
                  { text: "The lowest common multiple should be bigger than or equal to the larger number", why: "If it's smaller, you probably found the highest common factor by mistake ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 9: Counting Factors
  // ==========================================
  {
    id: "counting-factors",
    name: "How Many Factors Does a Number Have?",
    category: "other",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "counting-factors-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to count the total number of factors (numbers that divide in exactly) a number has",
          "Why some numbers have more factors than others"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "compares how many factors different numbers have",
            numberA: 12,
            factorsA: [1, 2, 3, 4, 6, 12],
            countA: 6,
            numberB: 13,
            factorsB: [1, 13],
            countB: 2,
            insight: "12 has 6 factors but 13 (a prime) has only 2. Primes always have the fewest factors — just 2!",
            interactNumber: 18,
            interactFactors: [1, 2, 3, 6, 9, 18],
            interactCount: 6
          },
          {
            name: "Jake",
            scenario: "wonders which number has the MOST factors under 30",
            numberA: 24,
            factorsA: [1, 2, 3, 4, 6, 8, 12, 24],
            countA: 8,
            numberB: 23,
            factorsB: [1, 23],
            countB: 2,
            insight: "24 has 8 factors but 23 has only 2! Numbers with lots of small prime factors tend to have the most factors",
            interactNumber: 30,
            interactFactors: [1, 2, 3, 5, 6, 10, 15, 30],
            interactCount: 8
          },
          {
            name: "Daisy",
            scenario: "compares square numbers with non-square numbers",
            numberA: 16,
            factorsA: [1, 2, 4, 8, 16],
            countA: 5,
            numberB: 15,
            factorsB: [1, 3, 5, 15],
            countB: 4,
            insight: "16 (a square number) has 5 factors — an ODD number! That's because 4×4 counts as just ONE factor, not two",
            interactNumber: 20,
            interactFactors: [1, 2, 4, 5, 10, 20],
            interactCount: 6
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which has more factors: ${v.numberA} or ${v.numberB}?`,
            body: (v) => `${v.name} ${v.scenario}. Let's count the factors of **${v.numberA}** and **${v.numberB}** and see which wins!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.numberA}: ? factors`, why: "Let's find out!" },
                  { text: `${v.numberB}: ? factors`, why: "Let's find out!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count them up!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Find all factor pairs, then count the unique factors:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Factors of ${v.numberA}:`, result: `${v.factorsA.join(', ')} = ${v.countA} factors` },
                    { text: `Factors of ${v.numberB}:`, result: `${v.factorsB.join(', ')} = ${v.countB} factors` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `${v.insight} ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "How many factors?",
            body: (v) => `How many factors does **${v.interactNumber}** have?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Factors of ${v.interactNumber}: ${v.interactFactors.join(', ')}`, why: "Count them!" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber} has how many factors?`,
              getOptions: (v) => generateDistractors(v.interactCount),
              correctAnswer: (v) => v.interactCount,
              feedback: {
                correct: (v) => `That's right! ${v.interactNumber} has **${v.interactCount}** factors: ${v.interactFactors.join(', ')} ✓`,
                incorrect: (v) => `Not quite! The factors of ${v.interactNumber} are ${v.interactFactors.join(', ')} = **${v.interactCount}** factors.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Factor count patterns!",
            body: () => `Some useful patterns to know:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Prime numbers always have exactly 2 factors", why: "Just 1 and themselves" },
                  { text: "Square numbers have an ODD number of factors", why: "Because the square root pairs with itself (counts once)" },
                  { text: "Numbers with many small prime factors have the MOST factors", why: "e.g. 24 = 2³ × 3 has 8 factors! ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key Fact ----
      {
        id: "counting-factors-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to quickly count factors by breaking a number into primes first",
          "Why this shortcut works"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "uses prime factorisation to count factors without listing them all",
            number: 36,
            primeFactorisation: "2² × 3²",
            powers: [2, 2],
            factorCount: 9,
            calculation: "(2+1) × (2+1) = 3 × 3 = 9",
            allFactors: [1, 2, 3, 4, 6, 9, 12, 18, 36],
            interactNumber: 24,
            interactPrimeFactorisation: "2³ × 3",
            interactPowers: [3, 1],
            interactFactorCount: 8,
            interactCalculation: "(3+1) × (1+1) = 4 × 2 = 8"
          },
          {
            name: "Marcus",
            scenario: "counts the factors of a big number the quick way",
            number: 60,
            primeFactorisation: "2² × 3 × 5",
            powers: [2, 1, 1],
            factorCount: 12,
            calculation: "(2+1) × (1+1) × (1+1) = 3 × 2 × 2 = 12",
            allFactors: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
            interactNumber: 72,
            interactPrimeFactorisation: "2³ × 3²",
            interactPowers: [3, 2],
            interactFactorCount: 12,
            interactCalculation: "(3+1) × (2+1) = 4 × 3 = 12"
          },
          {
            name: "Nadia",
            scenario: "finds how many factors 48 has without listing them",
            number: 48,
            primeFactorisation: "2⁴ × 3",
            powers: [4, 1],
            factorCount: 10,
            calculation: "(4+1) × (1+1) = 5 × 2 = 10",
            allFactors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48],
            interactNumber: 40,
            interactPrimeFactorisation: "2³ × 5",
            interactPowers: [3, 1],
            interactFactorCount: 8,
            interactCalculation: "(3+1) × (1+1) = 4 × 2 = 8"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How many factors does ${v.number} have?`,
            body: (v) => `${v.name} ${v.scenario}. There's a **shortcut** that uses prime factorisation to count factors without listing them all!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.number} = ${v.primeFactorisation}`, why: "Can we count factors from this?" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Add 1 to each power, then multiply!",
            body: (v) => `Take each power in the prime factorisation, **add 1**, then **multiply** them together:\n\n**${v.primeFactorisation}** → ${v.calculation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.number} = ${v.primeFactorisation}`, why: "Prime factorisation" },
                  { text: `Powers: ${v.powers.join(', ')}`, why: "The exponents" },
                  { text: `Add 1 to each: ${v.powers.map(p => p + 1).join(', ')}`, why: "Then multiply them together" },
                  { text: v.calculation, result: `${v.factorCount} factors! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactNumber} = ${v.interactPrimeFactorisation}**. How many factors does ${v.interactNumber} have?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactPrimeFactorisation}`, why: `Add 1 to each power, then multiply` }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactNumber} has how many factors?`,
              getOptions: (v) => generateDistractors(v.interactFactorCount),
              correctAnswer: (v) => v.interactFactorCount,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactCalculation} = **${v.interactFactorCount}** factors ✓`,
                incorrect: (v) => `Not quite! ${v.interactCalculation} = **${v.interactFactorCount}** factors.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The factor-counting shortcut!",
            body: () => `To count factors without listing them all:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Write the prime factorisation", why: "e.g. 36 = 2² × 3²" },
                  { text: "Step 2: Add 1 to each power", why: "Powers are 2 and 2 → add 1 → 3 and 3" },
                  { text: "Step 3: Multiply these numbers", why: "3 × 3 = 9 factors! Done ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      }
    ]
  }
];

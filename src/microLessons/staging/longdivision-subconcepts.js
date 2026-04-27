// Supplementary sub-concepts for Long Division
// To merge: add these to lessonBank.longdivision.subConcepts array in lessonData.js
import { generateDistractors, generateDivisionDistractors } from '../lessonData.js';

export const longdivisionSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Division as Sharing Equally
  // ==========================================
  {
    id: "sharing-equally",
    name: "Division as Sharing Equally",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "sharing-equally-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to understand that sharing equally is the same as dividing",
          "Why division undoes multiplication"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "sharing sweets at a party",
            total: 24,
            groups: 6,
            each: 4,
            unit: "sweets",
            checkMultiply: "6 x 4 = 24",
            // Interact-specific values (different from teach)
            interactTotal: 30,
            interactGroups: 5,
            interactEach: 6,
            interactUnit: "sweets"
          },
          {
            name: "Maisie",
            scenario: "handing out pencils to tables in class",
            total: 35,
            groups: 7,
            each: 5,
            unit: "pencils",
            checkMultiply: "7 x 5 = 35",
            interactTotal: 42,
            interactGroups: 6,
            interactEach: 7,
            interactUnit: "pencils"
          },
          {
            name: "Ravi",
            scenario: "splitting stickers between his friends",
            total: 32,
            groups: 8,
            each: 4,
            unit: "stickers",
            checkMultiply: "8 x 4 = 32",
            interactTotal: 27,
            interactGroups: 9,
            interactEach: 3,
            interactUnit: "stickers"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you share ${v.total} ${v.unit} equally?`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.total} ${v.unit}** and **${v.groups} groups**. How many does each group get?\nSharing equally IS dividing! Let's see why...`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.total).split('');
                const steps = [];
                let carry = 0;
                for (let i = 0; i < digits.length; i++) {
                  const current = carry * 10 + Number(digits[i]);
                  const result = Math.floor(current / v.groups);
                  const rem = current - result * v.groups;
                  steps.push({ digit: digits[i], result: String(result), remainder: rem, carry: rem > 0 && i < digits.length - 1 });
                  carry = rem;
                }
                return { divisor: v.groups, dividend: v.total, steps, showAnswer: true };
              }
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Sharing = Dividing",
            body: (v) => `Sharing equally and dividing are the **same thing** — and you can always check your answer by multiplying back. Tap to see why!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.total} ÷ ${v.groups}`, why: "How many in each group?", result: `= ${v.each}` },
                  { text: `Check: ${v.groups} × ${v.each}`, why: "Multiplication is the reverse!", result: `= ${v.total} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: (v) => "Your turn!",
            body: (v) => `${v.name} now has **${v.interactTotal} ${v.interactUnit}** to share equally between **${v.interactGroups} groups**. How many does each group get?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactTotal).split('');
                const steps = digits.map(d => ({ digit: d, result: "?", remainder: 0, carry: false }));
                return { divisor: v.interactGroups, dividend: v.interactTotal, steps, showAnswer: false };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactTotal} ÷ ${v.interactGroups}?`,
              getOptions: (v) => generateDistractors(v.interactEach),
              correctAnswer: (v) => v.interactEach,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTotal} ÷ ${v.interactGroups} = **${v.interactEach}**. Each group gets **${v.interactEach} ${v.interactUnit}**! ✓`,
                incorrect: (v) => `Not quite! ${v.interactTotal} ÷ ${v.interactGroups} = **${v.interactEach}**. Think: ${v.interactGroups} × what = ${v.interactTotal}?`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Sharing and dividing — the same thing!",
            body: () => `Whenever you share things equally, you're **dividing**. And you can always **check with multiplication** — it's the reverse!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Sharing equally = dividing", why: "Total ÷ number of groups = amount in each group" },
                  { text: "Division is the opposite of multiplication", why: "If 6 × 4 = 24, then 24 ÷ 6 = 4" },
                  { text: "Always check by multiplying back!", why: "Groups × each = total. If it matches, you're right! ✓" }
                ]
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "sharing-equally-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to understand that sharing equally is the same as dividing",
          "Why you must check division with multiplication"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "sharing biscuits at a bake sale",
            total: 36,
            groups: 9,
            each: 4,
            wrongAnswer: 6,
            unit: "biscuits",
            mistakeExplanation: "confused 36 ÷ 9 with 36 ÷ 6",
            // Interact-specific values (different from teach)
            interactTotal: 28,
            interactGroups: 7,
            interactEach: 4,
            interactUnit: "biscuits"
          },
          {
            name: "Noah",
            scenario: "splitting marbles into bags",
            total: 45,
            groups: 5,
            each: 9,
            wrongAnswer: 7,
            unit: "marbles",
            mistakeExplanation: "guessed instead of checking with multiplication",
            interactTotal: 54,
            interactGroups: 6,
            interactEach: 9,
            interactUnit: "marbles"
          },
          {
            name: "Aisha",
            scenario: "dividing strawberries between bowls",
            total: 48,
            groups: 8,
            each: 6,
            wrongAnswer: 8,
            unit: "strawberries",
            mistakeExplanation: "divided by the wrong number",
            interactTotal: 40,
            interactGroups: 5,
            interactEach: 8,
            interactUnit: "strawberries"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.total} ${v.unit}** shared between **${v.groups} groups**.\n${v.name} says each group gets **${v.wrongAnswer}**. Something's not right...`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.total).split('');
                const steps = [];
                let carry = 0;
                for (let i = 0; i < digits.length; i++) {
                  const current = carry * 10 + Number(digits[i]);
                  const result = Math.floor(current / v.groups);
                  const rem = current - result * v.groups;
                  steps.push({ digit: digits[i], result: String(v.wrongAnswer)[i] || "?", remainder: 0, carry: false });
                  carry = rem;
                }
                return { divisor: v.groups, dividend: v.total, steps, showAnswer: false };
              }
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Check with multiplication!",
            body: (v) => `The quickest way to catch a division mistake is to **multiply back**. If the answer is right, you should get the original total. Tap to see what happens!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Check: ${v.groups} × ${v.wrongAnswer} = ${v.groups * v.wrongAnswer}`, why: "This doesn't equal " + v.total + " — wrong!", result: "✗" },
                  { text: `Correct: ${v.groups} × ${v.each} = ${v.total}`, why: "This matches!", result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Now you try a different one!",
            body: (v) => `${v.interactTotal} ${v.interactUnit} shared equally between ${v.interactGroups} groups. How many in each group?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactTotal).split('');
                const steps = digits.map(d => ({ digit: d, result: "?", remainder: 0, carry: false }));
                return { divisor: v.interactGroups, dividend: v.interactTotal, steps, showAnswer: false };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactTotal} ÷ ${v.interactGroups}?`,
              getOptions: (v) => generateDistractors(v.interactEach),
              correctAnswer: (v) => v.interactEach,
              feedback: {
                correct: (v) => `Well done! ${v.interactTotal} ÷ ${v.interactGroups} = **${v.interactEach}**. Check: ${v.interactGroups} × ${v.interactEach} = ${v.interactTotal} ✓`,
                incorrect: (v) => `Not quite! ${v.interactTotal} ÷ ${v.interactGroups} = **${v.interactEach}**. Remember: ${v.interactGroups} × ${v.interactEach} = ${v.interactTotal}.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Always check your division!",
            body: () => `The best way to avoid mistakes in division is to **check with multiplication**. If groups × each = total, you're right!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Work out the division", why: "Total ÷ groups = each" },
                  { text: "Check by multiplying back", why: "Groups × your answer should equal the total" },
                  { text: "If it doesn't match, try again!", why: "A quick check catches silly mistakes every time. ✓" }
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
  // SUB-CONCEPT 2: Short Division with Remainders
  // ==========================================
  {
    id: "short-division-remainders",
    name: "Short Division with Remainders",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "short-division-remainders-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to handle remainders in the bus stop method",
          "How to write the remainder (the amount left over after dividing) at the end of your answer"
        ],
        variableSets: [
          {
            name: "Miss Carter",
            scenario: "sharing coloured pencils between tables",
            dividend: 157,
            divisor: 4,
            digits: [1, 5, 7],
            quotient: 39,
            remainder: 1,
            step1_digit: 1,
            step1_result: 0,
            step1_remainder: 1,
            step2_digit: 15,
            step2_result: 3,
            step2_remainder: 3,
            step3_digit: 37,
            step3_result: 9,
            step3_remainder: 1,
            unit: "pencils",
            // Interact-specific values (different from teach)
            // 215 ÷ 4 = 53 remainder 3 (4 × 53 = 212, 212 + 3 = 215)
            interactDividend: 215,
            interactDivisor: 4,
            interactQuotient: 53,
            interactRemainder: 3,
            interactUnit: "pencils"
          },
          {
            name: "Ben",
            scenario: "putting football cards into equal piles",
            dividend: 263,
            divisor: 5,
            digits: [2, 6, 3],
            quotient: 52,
            remainder: 3,
            step1_digit: 2,
            step1_result: 0,
            step1_remainder: 2,
            step2_digit: 26,
            step2_result: 5,
            step2_remainder: 1,
            step3_digit: 13,
            step3_result: 2,
            step3_remainder: 3,
            unit: "cards",
            // 187 ÷ 5 = 37 remainder 2 (5 × 37 = 185, 185 + 2 = 187)
            interactDividend: 187,
            interactDivisor: 5,
            interactQuotient: 37,
            interactRemainder: 2,
            interactUnit: "cards"
          },
          {
            name: "Mrs Okonkwo",
            scenario: "dividing exercise books between classes",
            dividend: 349,
            divisor: 6,
            digits: [3, 4, 9],
            quotient: 58,
            remainder: 1,
            step1_digit: 3,
            step1_result: 0,
            step1_remainder: 3,
            step2_digit: 34,
            step2_result: 5,
            step2_remainder: 4,
            step3_digit: 49,
            step3_result: 8,
            step3_remainder: 1,
            unit: "books",
            // 275 ÷ 6 = 45 remainder 5 (6 × 45 = 270, 270 + 5 = 275)
            interactDividend: 275,
            interactDivisor: 6,
            interactQuotient: 45,
            interactRemainder: 5,
            interactUnit: "books"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.dividend} ÷ ${v.divisor} — will it divide exactly?`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.dividend} ${v.unit}** to share between **${v.divisor}** groups.\nSometimes numbers don't divide perfectly — there's a bit **left over**. That's called a remainder (the amount left over after dividing). Let's work through it!`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.divisor,
                dividend: v.dividend,
                steps: v.digits.map(d => ({ digit: String(d), result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Follow the bus stop method",
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `Let's work through **${v.dividend} ÷ ${v.divisor}** digit by digit. The **divisor** (the number you divide by) is **${v.divisor}**. We carry any remainder to the next column.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.dividend,
                  steps: [
                    { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 }
                  ],
                  showAnswer: true,
                  highlightStep: 0
                })
              },
              {
                type: 'text',
                content: (v) => v.step1_result === 0
                  ? `**Step 1:** ${v.divisor} doesn't go into ${v.step1_digit} — write 0 above and carry ${v.step1_remainder}.`
                  : `**Step 1:** ${v.step1_digit} ÷ ${v.divisor} = ${v.step1_result} remainder ${v.step1_remainder}. Write ${v.step1_result} above and carry ${v.step1_remainder}.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.dividend,
                  steps: [
                    { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                    { digit: String(v.digits[1]), result: String(v.step2_result), remainder: v.step2_remainder, carry: v.step2_remainder > 0 }
                  ],
                  showAnswer: true,
                  highlightStep: 1
                })
              },
              {
                type: 'text',
                content: (v) => `**Step 2:** The carried ${v.step1_remainder} makes it **${v.step2_digit}**.\n${v.step2_digit} ÷ ${v.divisor} = ${v.step2_result} remainder ${v.step2_remainder}. Write ${v.step2_result} above.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => ({
                  divisor: v.divisor,
                  dividend: v.dividend,
                  steps: [
                    { digit: String(v.digits[0]), result: String(v.step1_result), remainder: v.step1_remainder, carry: v.step1_remainder > 0 },
                    { digit: String(v.digits[1]), result: String(v.step2_result), remainder: v.step2_remainder, carry: v.step2_remainder > 0 },
                    { digit: String(v.digits[2]), result: String(v.step3_result), remainder: v.step3_remainder, carry: false }
                  ],
                  showAnswer: true,
                  highlightStep: 2
                })
              },
              {
                type: 'text',
                content: (v) => v.step3_remainder > 0
                  ? `**Step 3:** The carried ${v.step2_remainder} makes it **${v.step3_digit}**.\n${v.step3_digit} ÷ ${v.divisor} = ${v.step3_result} remainder ${v.step3_remainder}. That's our final remainder!\n\n**Answer: ${v.quotient} remainder ${v.remainder}** ✓`
                  : `**Step 3:** The carried ${v.step2_remainder} makes it **${v.step3_digit}**.\n${v.step3_digit} ÷ ${v.divisor} = ${v.step3_result}. No remainder!\n\n**Answer: ${v.quotient}** ✓`
              }
            ],
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDividend} ÷ ${v.interactDivisor}**? Use the bus stop method to work it out.`,
            visual: {
              // NOTE: diagram values need updating for interact
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.interactDivisor,
                dividend: v.interactDividend,
                steps: String(v.interactDividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDivisionDistractors(v.interactQuotient, v.interactRemainder),
              correctAnswer: (v) => `${v.interactQuotient} remainder ${v.interactRemainder}`,
              feedback: {
                correct: (v) => `Spot on! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient} remainder ${v.interactRemainder}**. Each group gets **${v.interactQuotient} ${v.interactUnit}** with **${v.interactRemainder}** left over! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient} remainder ${v.interactRemainder}**. Try going digit by digit using the bus stop method.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Remainders — the leftovers!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When a number doesn't divide exactly, the bit left over is the **remainder**. It must always be **smaller** than the **divisor** (the number you're dividing by)!`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 4,
                  dividend: 157,
                  steps: [
                    { digit: "1", result: "0", remainder: 1, carry: true },
                    { digit: "5", result: "3", remainder: 3, carry: true },
                    { digit: "7", result: "9", remainder: 1, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Divide number by number using the bus stop", why: "Carry remainders to the next column each time." },
                    { text: "The last remainder is 'left over'", why: "Write it as 'r' after your answer, e.g. 39 r1." },
                    { text: "The remainder must be less than the divisor (the number you divide by)!", why: "If it's bigger, you haven't divided enough. ✓" }
                  ]
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "short-division-remainders-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when a remainder is too big",
          "Why the remainder must be smaller than the divisor (the number you divide by)"
        ],
        variableSets: [
          {
            name: "Luca",
            scenario: "dividing counters between groups in maths class",
            dividend: 197,
            divisor: 6,
            quotient: 32,
            remainder: 5,
            wrongQuotient: 31,
            wrongRemainder: 11,
            unit: "counters",
            mistakeExplanation: "stopped one step early and got a remainder of 11, which is bigger than 6",
            // Interact-specific values (different from teach)
            // 233 ÷ 6 = 38 remainder 5 (6 × 38 = 228, 228 + 5 = 233)
            interactDividend: 233,
            interactDivisor: 6,
            interactQuotient: 38,
            interactRemainder: 5,
            interactUnit: "counters"
          },
          {
            name: "Holly",
            scenario: "sharing out raffle tickets at a school fair",
            dividend: 253,
            divisor: 7,
            quotient: 36,
            remainder: 1,
            wrongQuotient: 35,
            wrongRemainder: 8,
            unit: "tickets",
            mistakeExplanation: "got a remainder of 8, but 7 goes into 8 one more time",
            // 190 ÷ 7 = 27 remainder 1 (7 × 27 = 189, 189 + 1 = 190)
            interactDividend: 190,
            interactDivisor: 7,
            interactQuotient: 27,
            interactRemainder: 1,
            interactUnit: "tickets"
          },
          {
            name: "Kian",
            scenario: "splitting conkers into bags",
            dividend: 175,
            divisor: 8,
            quotient: 21,
            remainder: 7,
            wrongQuotient: 20,
            wrongRemainder: 15,
            unit: "conkers",
            mistakeExplanation: "got a remainder of 15, but 8 goes into 15 once more with 7 left over",
            // 203 ÷ 8 = 25 remainder 3 (8 × 25 = 200, 200 + 3 = 203)
            interactDividend: 203,
            interactDivisor: 8,
            interactQuotient: 25,
            interactRemainder: 3,
            interactUnit: "conkers"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says: **${v.dividend} ÷ ${v.divisor} = ${v.wrongQuotient} r${v.wrongRemainder}**.\nLook at that remainder (what is left over after dividing)... does something seem wrong?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.divisor,
                dividend: v.dividend,
                steps: String(v.dividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "The remainder must be smaller than the divisor!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. Here is the **golden rule**: the remainder must always be less than the **divisor** (the number you're dividing by). Tap to compare the wrong and right answers.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.wrongQuotient} r${v.wrongRemainder}`, why: v.wrongRemainder + " is bigger than " + v.divisor + " — keep dividing!", result: "✗" },
                  { text: `Right: ${v.quotient} r${v.remainder}`, why: v.remainder + " is less than " + v.divisor + " — that's correct!", result: "✓" },
                  { text: `Check: ${v.divisor} × ${v.quotient} + ${v.remainder} = ${v.dividend}`, why: "Multiply back and add the remainder to check", result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Now try a different one!",
            body: (v) => `What is **${v.interactDividend} ÷ ${v.interactDivisor}**?`,
            visual: {
              // NOTE: diagram values need updating for interact
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.interactDivisor,
                dividend: v.interactDividend,
                steps: String(v.interactDividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDivisionDistractors(v.interactQuotient, v.interactRemainder),
              correctAnswer: (v) => `${v.interactQuotient} remainder ${v.interactRemainder}`,
              feedback: {
                correct: (v) => `Well done! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient} remainder ${v.interactRemainder}**. The remainder ${v.interactRemainder} is less than ${v.interactDivisor} — perfect! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient} remainder ${v.interactRemainder}**. Check: ${v.interactDivisor} × ${v.interactQuotient} + ${v.interactRemainder} = ${v.interactDividend}.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The remainder rule!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The **remainder** is what's left over after dividing. Here's the key rule:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 6,
                  dividend: 197,
                  steps: [
                    { digit: "1", result: "0", remainder: 1, carry: true },
                    { digit: "9", result: "3", remainder: 1, carry: true },
                    { digit: "7", result: "2", remainder: 5, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "The remainder must be LESS than the divisor (the number you divide by)", why: "If it's bigger, you haven't divided enough times!" },
                    { text: "Check: divisor × answer + remainder = original number", why: "This is the best way to catch mistakes." },
                    { text: "E.g. 197 ÷ 6 = 32 r5 — because 6 × 32 + 5 = 197", why: "5 < 6, so the remainder is correct. ✓" }
                  ]
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
  // SUB-CONCEPT 3: Dividing by a 2-digit Number
  // ==========================================
  {
    id: "long-division-method",
    name: "Dividing by a 2-digit Number",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "long-division-method-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to divide by a 2-digit number using long division",
          "How to estimate, multiply, subtract, and move to the next number"
        ],
        variableSets: [
          {
            name: "Mrs Barnes",
            scenario: "sharing out books for the school library",
            dividend: 432,
            divisor: 18,
            quotient: 24,
            remainder: 0,
            step1_tryDigits: "43",
            step1_howMany: 2,
            step1_product: 36,
            step1_subtract: 7,
            step2_bringDown: "72",
            step2_howMany: 4,
            step2_product: 72,
            step2_subtract: 0,
            unit: "books",
            hasRemainder: false,
            // Interact-specific values (different from teach)
            // 378 ÷ 18 = 21 (18 × 21 = 378)
            interactDividend: 378,
            interactDivisor: 18,
            interactQuotient: 21,
            interactHasRemainder: false,
            interactRemainder: 0
          },
          {
            name: "Mr Phillips",
            scenario: "arranging seats in rows for sports day",
            dividend: 575,
            divisor: 23,
            quotient: 25,
            remainder: 0,
            step1_tryDigits: "57",
            step1_howMany: 2,
            step1_product: 46,
            step1_subtract: 11,
            step2_bringDown: "115",
            step2_howMany: 5,
            step2_product: 115,
            step2_subtract: 0,
            unit: "seats",
            hasRemainder: false,
            // 690 ÷ 23 = 30 (23 × 30 = 690)
            interactDividend: 690,
            interactDivisor: 23,
            interactQuotient: 30,
            interactHasRemainder: false,
            interactRemainder: 0
          },
          {
            name: "Olivia",
            scenario: "packing sweets into party bags",
            dividend: 396,
            divisor: 12,
            quotient: 33,
            remainder: 0,
            step1_tryDigits: "39",
            step1_howMany: 3,
            step1_product: 36,
            step1_subtract: 3,
            step2_bringDown: "36",
            step2_howMany: 3,
            step2_product: 36,
            step2_subtract: 0,
            unit: "sweets",
            hasRemainder: false,
            // 264 ÷ 12 = 22 (12 × 22 = 264)
            interactDividend: 264,
            interactDivisor: 12,
            interactQuotient: 22,
            interactHasRemainder: false,
            interactRemainder: 0
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.dividend} ÷ ${v.divisor} — dividing by a bigger number!`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.dividend} ${v.unit}** — that's the dividend (the number being divided) — split into groups of **${v.divisor}** — that's the divisor (the number you divide by).\nWhen we divide by a **2-digit number**, we use **long division**. It's like the bus stop method, but with an extra step — subtracting and moving to the next number!`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.divisor,
                dividend: v.dividend,
                steps: String(v.dividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Long division — step by step",
            bodyParts: (v) => {
              const digits = String(v.dividend).split('');
              const q1 = String(v.quotient)[0];
              const q2 = String(v.quotient)[1];
              return [
                {
                  type: 'text',
                  content: (v) => `Let's work through **${v.dividend} ÷ ${v.divisor}** step by step. The **divisor** (the number you divide by) is **${v.divisor}**. Any leftover at the end is the **remainder** (what's left over after dividing).`
                },
                {
                  type: 'visual',
                  component: 'BusStopDiagram',
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: digits.map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                    showAnswer: false
                  })
                },
                {
                  type: 'text',
                  content: (v) => `**1. ESTIMATE:** Look at the first two digits: **${v.step1_tryDigits}**. How many ${v.divisor}s fit? **${v.step1_howMany}** (because ${v.divisor} × ${v.step1_howMany} = ${v.step1_product}).`
                },
                {
                  type: 'visual',
                  component: 'BusStopDiagram',
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: [
                      { digit: digits[0], result: " ", remainder: 0, carry: false },
                      { digit: digits[1], result: q1, remainder: v.step1_subtract, carry: v.step1_subtract > 0 },
                      { digit: digits[2], result: "?", remainder: 0, carry: false }
                    ],
                    showAnswer: true,
                    highlightStep: 1
                  })
                },
                {
                  type: 'text',
                  content: (v) => `**2. SUBTRACT:** ${v.step1_tryDigits} − ${v.step1_product} = **${v.step1_subtract}**. This is what's left over.`
                },
                {
                  type: 'text',
                  content: (v) => `**3. MOVE TO THE NEXT NUMBER:** Put the next digit next to ${v.step1_subtract} to get **${v.step2_bringDown}**.`
                },
                {
                  type: 'visual',
                  component: 'BusStopDiagram',
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: [
                      { digit: digits[0], result: " ", remainder: 0, carry: false },
                      { digit: digits[1], result: q1, remainder: v.step1_subtract, carry: v.step1_subtract > 0 },
                      { digit: digits[2], result: q2, remainder: v.step2_subtract, carry: v.step2_subtract > 0 }
                    ],
                    showAnswer: true,
                    highlightStep: 2
                  })
                },
                {
                  type: 'text',
                  content: (v) => `**4. REPEAT:** How many ${v.divisor}s fit into ${v.step2_bringDown}? **${v.step2_howMany}** (because ${v.divisor} × ${v.step2_howMany} = ${v.step2_product}). Subtract: ${v.step2_bringDown} − ${v.step2_product} = ${v.step2_subtract}.`
                },
                {
                  type: 'visual',
                  component: 'BusStopDiagram',
                  props: (v) => ({
                    divisor: v.divisor,
                    dividend: v.dividend,
                    steps: [
                      { digit: digits[0], result: " ", remainder: 0, carry: false },
                      { digit: digits[1], result: q1, remainder: 0, carry: false },
                      { digit: digits[2], result: q2, remainder: 0, carry: false }
                    ],
                    showAnswer: true
                  })
                },
                {
                  type: 'text',
                  content: (v) => `**Answer: ${v.quotient}**${v.hasRemainder ? ` remainder ${v.remainder}` : ''} ✓`
                }
              ];
            },
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is **${v.interactDividend} ÷ ${v.interactDivisor}**?`,
            visual: {
              // NOTE: diagram values need updating for interact
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.interactDivisor,
                dividend: v.interactDividend,
                steps: String(v.interactDividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDistractors(v.interactQuotient),
              correctAnswer: (v) => v.interactQuotient,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient}**${v.interactHasRemainder ? ' remainder ' + v.interactRemainder : ''}. You've cracked long division! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient}**. Try estimating: how many ${v.interactDivisor}s fit into the first two digits?`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Long division — four steps!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Long division works for **any** divisor (the number you divide by), even big ones. Just follow these four steps:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 18,
                  dividend: 432,
                  steps: [
                    { digit: "4", result: " ", remainder: 0, carry: false },
                    { digit: "3", result: "2", remainder: 7, carry: true },
                    { digit: "2", result: "4", remainder: 0, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "1. ESTIMATE — how many times does the divisor go in?", why: "Look at the first 2 (or 3) digits." },
                    { text: "2. MULTIPLY — divisor × your estimate", why: "Write it underneath." },
                    { text: "3. SUBTRACT — find what's left", why: "This is carried to the next step." },
                    { text: "4. MOVE TO THE NEXT NUMBER — put it next to the remainder (what is left over)", why: "Repeat until there are no more numbers left! ✓" }
                  ]
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "long-division-method-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot misaligned digits in long division",
          "Why the answer number must go above the right column"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "working out how many bags of crisps to order",
            dividend: 468,
            divisor: 12,
            quotient: 39,
            remainder: 0,
            wrongAnswer: 93,
            unit: "bags",
            mistakeExplanation: "wrote the answer digits in the wrong columns — 9 in the tens and 3 in the ones, instead of 3 in the tens and 9 in the ones",
            // Interact-specific values (different from teach)
            // 348 ÷ 12 = 29 (12 × 29 = 348)
            interactDividend: 348,
            interactDivisor: 12,
            interactQuotient: 29,
            interactRemainder: 0
          },
          {
            name: "Fatima",
            scenario: "dividing stickers for a school project",
            dividend: 672,
            divisor: 14,
            quotient: 48,
            remainder: 0,
            wrongAnswer: 84,
            unit: "stickers",
            mistakeExplanation: "swapped the digits — wrote 8 first and 4 second instead of 4 then 8",
            // 546 ÷ 14 = 39 (14 × 39 = 546)
            interactDividend: 546,
            interactDivisor: 14,
            interactQuotient: 39,
            interactRemainder: 0
          },
          {
            name: "Leo",
            scenario: "splitting party favours into goody bags",
            dividend: 456,
            divisor: 15,
            quotient: 30,
            remainder: 6,
            wrongAnswer: 3,
            unit: "favours",
            mistakeExplanation: "forgot to move to the next number and stopped too early",
            // 345 ÷ 15 = 23 (15 × 23 = 345)
            interactDividend: 345,
            interactDivisor: 15,
            interactQuotient: 23,
            interactRemainder: 0
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Can you spot ${v.name}'s mistake?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.name} says: **${v.dividend} ÷ ${v.divisor} = ${v.wrongAnswer}**.\nDoes that look right to you?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.divisor,
                dividend: v.dividend,
                steps: String(v.dividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Watch where you write each number!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. Keeping your columns lined up is everything! Tap to see the wrong and right answers.`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `${v.name} wrote **${v.wrongAnswer}** but the correct answer is **${v.quotient}${v.remainder > 0 ? ' remainder ' + v.remainder : ''}**.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => {
                  const digits = String(v.dividend).split('');
                  const ansDigits = String(v.quotient).split('');
                  const steps = digits.map((d, i) => {
                    const ansIdx = i - (digits.length - ansDigits.length);
                    return { digit: d, result: ansIdx >= 0 ? ansDigits[ansIdx] : "0", remainder: 0, carry: false };
                  });
                  return { divisor: v.divisor, dividend: v.dividend, steps, showAnswer: true };
                }
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `✗ Wrong: ${v.wrongAnswer}`, why: v.mistakeExplanation },
                    { text: `✓ Right: ${v.quotient}${v.remainder > 0 ? ' remainder ' + v.remainder : ''}`, why: "Check: " + v.divisor + " × " + v.quotient + (v.remainder > 0 ? " + " + v.remainder : "") + " = " + v.dividend, result: "✓" }
                  ]
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Now try a different one!",
            body: (v) => `What is **${v.interactDividend} ÷ ${v.interactDivisor}**?`,
            visual: {
              // NOTE: diagram values need updating for interact
              component: "BusStopDiagram",
              props: (v) => ({
                divisor: v.interactDivisor,
                dividend: v.interactDividend,
                steps: String(v.interactDividend).split('').map(d => ({ digit: d, result: "?", remainder: 0, carry: false })),
                showAnswer: false
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDistractors(v.interactQuotient),
              correctAnswer: (v) => v.interactQuotient,
              feedback: {
                correct: (v) => `Well done! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient}**${v.interactRemainder > 0 ? ' r' + v.interactRemainder : ''}. You kept those numbers in the right place! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient}**${v.interactRemainder > 0 ? ' r' + v.interactRemainder : ''}. Remember to line up each number carefully!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Keep those numbers lined up!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common mistake in long division is putting the answer numbers in the **wrong column**. Remember:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 12,
                  dividend: 468,
                  steps: [
                    { digit: "4", result: " ", remainder: 0, carry: false },
                    { digit: "6", result: "3", remainder: 10, carry: true },
                    { digit: "8", result: "9", remainder: 0, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Each answer number goes ABOVE the number you divided into", why: "Line them up neatly — column by column." },
                    { text: "Don't forget to move to the next number!", why: "Stopping early gives you a much smaller answer." },
                    { text: "Always check: divisor (the number you divide by) × answer = the original number", why: "If it doesn't match, check your columns! ✓" }
                  ]
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
  // SUB-CONCEPT 4: Interpreting Remainders
  // ==========================================
  {
    id: "interpreting-remainders",
    name: "What To Do With Remainders",
    category: "core",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "interpreting-remainders-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to decide whether to round up, round down, or give the remainder as a fraction",
          "Why the context of a word problem changes what you do with the remainder"
        ],
        variableSets: [
          {
            name: "Mrs Ahmed",
            scenario: "booking coaches for a school trip",
            total: 157,
            divisor: 48,
            quotient: 3,
            remainder: 13,
            correctInterpretation: 4,
            interpretation: "round up",
            why: "You need an extra coach for the remaining 13 children — you can't leave them behind!",
            unit: "children",
            resultUnit: "coaches",
            // Interact-specific values (different from teach)
            // 95 ÷ 20 = 4 remainder 15, round up to 5 (need 5 minibuses for 95 pupils)
            interactScenario: "booking minibuses for a swimming gala",
            interactTotal: 95,
            interactDivisor: 20,
            interactQuotient: 4,
            interactRemainder: 15,
            interactCorrectInterpretation: 5,
            interactInterpretation: "round up",
            interactWhy: "You need an extra minibus for the remaining 15 pupils — you can't leave them behind!",
            interactUnit: "pupils",
            interactResultUnit: "minibuses",
            interactGroupLabel: "each minibus holds"
          },
          {
            name: "Tom",
            scenario: "cutting ribbon for party decorations",
            total: 250,
            divisor: 30,
            quotient: 8,
            remainder: 10,
            correctInterpretation: 8,
            interpretation: "round down",
            why: "You can only make 8 full pieces — the leftover 10 cm isn't long enough for another decoration.",
            unit: "cm of ribbon",
            resultUnit: "pieces",
            // 170 ÷ 25 = 6 remainder 20, round down to 6 (only 6 full lengths)
            interactScenario: "cutting rope for skipping ropes",
            interactTotal: 170,
            interactDivisor: 25,
            interactQuotient: 6,
            interactRemainder: 20,
            interactCorrectInterpretation: 6,
            interactInterpretation: "round down",
            interactWhy: "You can only make 6 full skipping ropes — the leftover 20 cm isn't long enough for another one.",
            interactUnit: "cm of rope",
            interactResultUnit: "skipping ropes",
            interactGroupLabel: "each skipping rope needs"
          },
          {
            name: "Sophie",
            scenario: "sharing pizzas equally between friends",
            total: 25,
            divisor: 4,
            quotient: 6,
            remainder: 1,
            correctInterpretation: 6,
            interpretation: "give remainder as fraction",
            why: "Each friend gets 6 slices, and the last pizza is cut into 4 — each person gets an extra quarter!",
            unit: "pizza slices",
            resultUnit: "slices each",
            // 17 ÷ 3 = 5 remainder 2, round up to 6 (need 6 boxes for 17 cakes)
            interactScenario: "packing cakes into boxes for a sale",
            interactTotal: 17,
            interactDivisor: 3,
            interactQuotient: 5,
            interactRemainder: 2,
            interactCorrectInterpretation: 6,
            interactInterpretation: "round up",
            interactWhy: "You need an extra box for the remaining 2 cakes — you can't leave them unboxed!",
            interactUnit: "cakes",
            interactResultUnit: "boxes",
            interactGroupLabel: "each box holds"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `What do you do with the leftovers?`,
            body: (v) => `${v.name} is ${v.scenario}. There are **${v.total} ${v.unit}** and groups of **${v.divisor}**.\n${v.total} ÷ ${v.divisor} = ${v.quotient} remainder (what's left over) ${v.remainder}.\nBut what does the remainder **mean** in real life? Do you round up, round down, or use a fraction?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.total} ÷ ${v.divisor} = ${v.quotient} r${v.remainder}`, why: "But the answer to the real question isn't just " + v.quotient + "..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: (v) => `What do you do with remainder ${v.remainder}?`,
            bodyParts: (v) => [
              {
                type: 'text',
                content: (v) => `**${v.total} ÷ ${v.divisor} = ${v.quotient} remainder ${v.remainder}**\n\nGetting the maths right is only half the job — you also need to decide what the remainder **means** in real life.`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: (v) => {
                  const digits = String(v.total).split('');
                  const steps = [];
                  let carry = 0;
                  for (let i = 0; i < digits.length; i++) {
                    const current = carry * 10 + Number(digits[i]);
                    const result = Math.floor(current / v.divisor);
                    const rem = current - result * v.divisor;
                    steps.push({ digit: digits[i], result: String(result), remainder: rem, carry: rem > 0 && i < digits.length - 1 });
                    carry = rem;
                  }
                  return { divisor: v.divisor, dividend: v.total, steps, showAnswer: true };
                }
              },
              {
                type: 'text',
                content: () => `There are **three** things you can do with a remainder:`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Round UP — need an extra group", why: "E.g. coaches for a trip — you can't leave anyone behind!" },
                    { text: "Round DOWN — can't use the leftovers", why: "E.g. cutting ribbon — the leftover bit is too short" },
                    { text: "Give as a fraction — share the remainder", why: "E.g. sharing pizzas — cut the last one up!" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `In this problem, we **${v.interpretation}** because ${v.why.toLowerCase()}\n\nAnswer: **${v.correctInterpretation} ${v.resultUnit}** ✓`
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Think about the context!",
            body: (v) => `${v.name} is ${v.interactScenario}. There are **${v.interactTotal} ${v.interactUnit}** and ${v.interactGroupLabel || 'each group holds'} **${v.interactDivisor} ${v.interactUnit}**. How many ${v.interactResultUnit} are needed?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactTotal).split('');
                const steps = [];
                let carry = 0;
                for (let i = 0; i < digits.length; i++) {
                  const current = carry * 10 + Number(digits[i]);
                  const result = Math.floor(current / v.interactDivisor);
                  const rem = current - result * v.interactDivisor;
                  steps.push({ digit: digits[i], result: String(result), remainder: rem, carry: rem > 0 && i < digits.length - 1 });
                  carry = rem;
                }
                return { divisor: v.interactDivisor, dividend: v.interactTotal, steps, showAnswer: true };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many ${v.interactResultUnit}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectInterpretation),
              correctAnswer: (v) => v.interactCorrectInterpretation,
              feedback: {
                correct: (v) => `Brilliant! The answer is **${v.interactCorrectInterpretation} ${v.interactResultUnit}**. You worked out you need to **${v.interactInterpretation}** because ${v.interactWhy.toLowerCase()} ✓`,
                incorrect: (v) => `Not quite! Think about it: ${v.interactWhy.toLowerCase()} So the answer is **${v.interactCorrectInterpretation} ${v.interactResultUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Read the question — then decide!",
            body: () => `The maths gives you an answer and a remainder. But what do you do with it?`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Do the division — find the answer and remainder", why: "The maths part comes first" },
                  { text: "Step 2: Re-read the question carefully", why: "The question tells you what to do with the remainder" },
                  { text: "Step 3: Round UP for people problems", why: "Coaches, tables, minibuses — everyone needs a seat!" },
                  { text: "Step 4: Round DOWN for 'full' or 'complete' problems", why: "Full shelves, complete boxes — no room for leftovers" },
                  { text: "Step 5: Give as a fraction for sharing problems", why: "Pizzas, cakes — you can split the leftovers! ✓" }
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
        id: "interpreting-remainders-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone interprets a remainder incorrectly",
          "When to round up vs round down in division word problems"
        ],
        variableSets: [
          {
            name: "Freya",
            scenario: "working out how many minibuses are needed for a choir trip",
            total: 85,
            divisor: 15,
            quotient: 5,
            remainder: 10,
            wrongAnswer: 5,
            correctAnswer: 6,
            unit: "singers",
            resultUnit: "minibuses",
            mistakeExplanation: "said 5 minibuses, but that only fits 75 people — the other 10 singers would be left behind! You need to round up to 6.",
            // Interact-specific values (different from teach)
            // 70 ÷ 12 = 5 remainder 10, round up to 6 (need 6 boats for 70 children)
            interactScenario: "working out how many boats are needed for a river trip",
            interactTotal: 70,
            interactDivisor: 12,
            interactQuotient: 5,
            interactRemainder: 10,
            interactCorrectAnswer: 6,
            interactUnit: "children",
            interactResultUnit: "boats"
          },
          {
            name: "Max",
            scenario: "working out how many full shelves of books there are",
            total: 200,
            divisor: 30,
            quotient: 6,
            remainder: 20,
            wrongAnswer: 7,
            correctAnswer: 6,
            unit: "books",
            resultUnit: "full shelves",
            mistakeExplanation: "said 7 full shelves, but the 7th shelf only has 20 books, not a full 30. The question asks for FULL shelves, so it's 6.",
            // 110 ÷ 25 = 4 remainder 10, round down to 4 (only 4 full rows)
            interactScenario: "working out how many full rows of chairs there are",
            interactTotal: 110,
            interactDivisor: 25,
            interactQuotient: 4,
            interactRemainder: 10,
            interactCorrectAnswer: 4,
            interactUnit: "chairs",
            interactResultUnit: "full rows"
          },
          {
            name: "Daisy",
            scenario: "working out how many tables are needed at a wedding",
            total: 130,
            divisor: 8,
            quotient: 16,
            remainder: 2,
            wrongAnswer: 16,
            correctAnswer: 17,
            unit: "guests",
            resultUnit: "tables",
            mistakeExplanation: "said 16 tables, but that only seats 128 guests — the last 2 guests need a table too! You need 17.",
            // 58 ÷ 10 = 5 remainder 8, round up to 6 (need 6 tents for 58 scouts)
            interactScenario: "working out how many tents are needed for a camping trip",
            interactTotal: 58,
            interactDivisor: 10,
            interactQuotient: 5,
            interactRemainder: 8,
            interactCorrectAnswer: 6,
            interactUnit: "scouts",
            interactResultUnit: "tents"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Did ${v.name} get this right?`,
            body: (v) => `${v.name} is ${v.scenario}.\n${v.total} ÷ ${v.divisor} = ${v.quotient} r${v.remainder}. The r means remainder (the amount left over after dividing).\n${v.name} says the answer is **${v.wrongAnswer} ${v.resultUnit}**. Is that correct?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer} ${v.resultUnit}`, why: "Think carefully about what happens to the remainder..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Read the question carefully!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. The key is thinking about what happens to the **remainder** (the amount left over after dividing) in the real world. Tap to see the correct reasoning.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.total} ÷ ${v.divisor} = ${v.quotient} r${v.remainder}`, why: "The maths is right", result: "✓" },
                  { text: `${v.name} said: ${v.wrongAnswer}`, why: "But the interpretation is wrong!", result: "✗" },
                  { text: `Correct answer: ${v.correctAnswer} ${v.resultUnit}`, why: "Think: what happens to the leftover " + v.remainder + " " + v.unit + "?", result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn with a new problem!",
            body: (v) => `${v.name} is ${v.interactScenario}. There are **${v.interactTotal} ${v.interactUnit}** and each group holds **${v.interactDivisor}**. How many ${v.interactResultUnit}?`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactTotal).split('');
                const steps = [];
                let carry = 0;
                for (let i = 0; i < digits.length; i++) {
                  const current = carry * 10 + Number(digits[i]);
                  const result = Math.floor(current / v.interactDivisor);
                  const rem = current - result * v.interactDivisor;
                  steps.push({ digit: digits[i], result: String(result), remainder: rem, carry: rem > 0 && i < digits.length - 1 });
                  carry = rem;
                }
                return { divisor: v.interactDivisor, dividend: v.interactTotal, steps, showAnswer: true };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `How many ${v.interactResultUnit}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! **${v.interactCorrectAnswer} ${v.interactResultUnit}** is correct. You thought about what happens to the remainder! ✓`,
                incorrect: (v) => `Not quite! The answer is **${v.interactCorrectAnswer} ${v.interactResultUnit}**. Remember: think about whether the leftover ${v.interactRemainder} ${v.interactUnit} need to be accounted for!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Remainders in real life!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Getting the maths right is only half the battle. You also need to **interpret the remainder**:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 15,
                  dividend: 85,
                  steps: [
                    { digit: "8", result: " ", remainder: 0, carry: false },
                    { digit: "5", result: "5", remainder: 10, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'text',
                content: () => `85 ÷ 15 = 5 r10. Need 5 or 6 minibuses? **Round up to 6** — you can't leave 10 people behind!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "People problems — usually round UP", why: "You can't leave people behind! Extra coach/table/minibus needed." },
                    { text: "'Full' or 'complete' problems — usually round DOWN", why: "You can't count an incomplete group as full." },
                    { text: "Always re-read the question!", why: "What does it actually ask? That tells you what to do with the remainder. ✓" }
                  ]
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
  // SUB-CONCEPT 5: Estimating and Checking
  // ==========================================
  {
    id: "estimation-checking",
    name: "Estimating Before Dividing, Checking with Multiplication",
    category: "other",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "estimation-checking-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to estimate (make a rough guess at) a division answer by rounding",
          "How to check your answer using multiplication"
        ],
        variableSets: [
          {
            name: "Emily",
            scenario: "packing 372 sweets into bags of 6 for a party",
            dividend: 372,
            divisor: 6,
            quotient: 62,
            remainder: 0,
            roundedDividend: 360,
            estimate: 60,
            checkProduct: 372,
            unit: "sweets"
          },
          {
            name: "Mr Shah",
            scenario: "carrying 485 chairs in loads of 8",
            dividend: 485,
            divisor: 8,
            quotient: 60,
            remainder: 5,
            roundedDividend: 480,
            estimate: 60,
            checkProduct: 480,
            unit: "chairs"
          },
          {
            name: "Lauren",
            scenario: "splitting 294 beads into necklaces of 7",
            dividend: 294,
            divisor: 7,
            quotient: 42,
            remainder: 0,
            roundedDividend: 280,
            estimate: 40,
            checkProduct: 294,
            unit: "beads"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Estimate first, check after!",
            body: (v) => `${v.name} is ${v.scenario}. Before doing the full division of **${v.dividend} ÷ ${v.divisor}**, a quick estimate helps you know roughly what to expect!\n**How to estimate:** Round to a nearby number that divides easily. This stops silly mistakes before they happen.`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                // Zoom into the region around the estimate and actual value
                // Use round tick intervals (10, 20, 50) for clean number lines
                const gap = Math.abs(v.dividend - v.roundedDividend);
                const padding = Math.max(gap * 3, 50);
                const rawMin = v.roundedDividend - padding;
                const rawMax = v.dividend + padding;
                // Pick a clean tick interval: 10, 20, or 50
                const range = rawMax - rawMin;
                const tick = range <= 100 ? 10 : range <= 200 ? 20 : 50;
                // Round min/max to tick boundaries
                const min = Math.floor(rawMin / tick) * tick;
                const max = Math.ceil(rawMax / tick) * tick;
                return {
                  min,
                  max,
                  tickInterval: tick,
                  points: [
                    { value: v.roundedDividend, color: '#22c55e', label: `≈${v.roundedDividend}` },
                    { value: v.dividend, color: '#3b82f6', label: `${v.dividend}` }
                  ]
                };
              }
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Round the dividend to a friendly number",
            body: (v) => `The trick is to round the dividend (the number being divided — here it's **${v.dividend}**) to a **friendly number** that the **divisor** (the number you divide by — here it's **${v.divisor}**) goes into easily. After dividing, check by multiplying back — any **remainder** (the amount left over) gets added on. Tap to see the method!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Estimate: ${v.roundedDividend} ÷ ${v.divisor}`, why: "Round " + v.dividend + " to " + v.roundedDividend, result: `≈ ${v.estimate}` },
                  { text: `Exact: ${v.dividend} ÷ ${v.divisor}`, why: "Now do the full calculation", result: `= ${v.quotient}${v.remainder > 0 ? ' r' + v.remainder : ''}` },
                  { text: `Check: ${v.divisor} × ${v.quotient}${v.remainder > 0 ? ' + ' + v.remainder : ''}`, why: "Multiply back to verify", result: `= ${v.dividend} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "What's a good estimate?",
            body: (v) => `Before dividing **${v.dividend} ÷ ${v.divisor}**, what's a good estimate?`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                // Zoom into the region so estimate and actual don't overlap
                const gap = Math.abs(v.dividend - v.roundedDividend);
                const padding = Math.max(gap * 3, 50);
                const rawMin = v.roundedDividend - padding;
                const rawMax = v.dividend + padding;
                const range = rawMax - rawMin;
                const tick = range <= 100 ? 10 : range <= 200 ? 20 : 50;
                const min = Math.floor(rawMin / tick) * tick;
                const max = Math.ceil(rawMax / tick) * tick;
                return {
                  min,
                  max,
                  tickInterval: tick,
                  points: [
                    { value: v.roundedDividend, color: '#22c55e', label: `≈${v.roundedDividend}` },
                    { value: v.dividend, color: '#3b82f6', label: `${v.dividend}` }
                  ]
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Approximately what is ${v.dividend} ÷ ${v.divisor}?`,
              getOptions: (v) => generateDistractors(v.estimate),
              correctAnswer: (v) => v.estimate,
              feedback: {
                correct: (v) => `Great estimate! ${v.roundedDividend} ÷ ${v.divisor} = about **${v.estimate}**. The exact answer is ${v.quotient} — nice and close! ✓`,
                incorrect: (v) => `Not quite! Round ${v.dividend} to ${v.roundedDividend}. Then ${v.roundedDividend} ÷ ${v.divisor} = **${v.estimate}**. That's a good estimate!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Estimate and check — your safety net!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Two simple habits that catch almost every division mistake:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 6,
                  dividend: 372,
                  steps: [
                    { digit: "3", result: "0", remainder: 3, carry: true },
                    { digit: "7", result: "6", remainder: 1, carry: true },
                    { digit: "2", result: "2", remainder: 0, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'text',
                content: () => `Estimate: 360 ÷ 6 ≈ 60. Exact: 372 ÷ 6 = 62. Close to the estimate — makes sense!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "BEFORE: Estimate by rounding", why: "Round the dividend (the number being divided) to a number that divides easily. This tells you roughly what to expect." },
                    { text: "AFTER: Check with multiplication", why: "Divisor (the number you divide by) × answer + remainder (the amount left over after dividing) should equal the original number." },
                    { text: "If your answer is way off your estimate, redo it!", why: "The estimate is your safety net — it catches big mistakes. ✓" }
                  ]
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Visual Discovery ----
      {
        id: "estimation-checking-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to use estimating to avoid big mistakes",
          "When your answer should be close to your estimate"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "working out how many packets of seeds to buy",
            dividend: 315,
            divisor: 9,
            quotient: 35,
            remainder: 0,
            roundedDividend: 270,
            estimate: 30,
            wrongAnswer: 305,
            unit: "seeds",
            // Interact-specific values (different from teach)
            // 378 ÷ 9 = 42 (9 × 42 = 378)
            interactDividend: 378,
            interactDivisor: 9,
            interactQuotient: 42,
            interactRemainder: 0,
            interactEstimate: 40
          },
          {
            name: "Alfie",
            scenario: "dividing football cards between friends",
            dividend: 248,
            divisor: 4,
            quotient: 62,
            remainder: 0,
            roundedDividend: 240,
            estimate: 60,
            wrongAnswer: 602,
            unit: "cards",
            // 332 ÷ 4 = 83 (4 × 83 = 332)
            interactDividend: 332,
            interactDivisor: 4,
            interactQuotient: 83,
            interactRemainder: 0,
            interactEstimate: 80
          },
          {
            name: "Zara",
            scenario: "splitting art supplies between classes",
            dividend: 432,
            divisor: 6,
            quotient: 72,
            remainder: 0,
            roundedDividend: 420,
            estimate: 70,
            wrongAnswer: 27,
            unit: "supplies",
            // 354 ÷ 6 = 59 (6 × 59 = 354)
            interactDividend: 354,
            interactDivisor: 6,
            interactQuotient: 59,
            interactRemainder: 0,
            interactEstimate: 60
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Does ${v.wrongAnswer} seem right?`,
            body: (v) => `${v.name} is ${v.scenario}. ${v.name} calculated **${v.dividend} ÷ ${v.divisor} = ${v.wrongAnswer}**.\nBut wait — a quick estimate would have caught this mistake instantly! Let's see how...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongAnswer}`, why: "Does this seem reasonable?" },
                  { text: `Quick estimate: ${v.roundedDividend} ÷ ${v.divisor} ≈ ${v.estimate}`, why: v.wrongAnswer + " is way off from " + v.estimate + "!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Estimating catches big mistakes!",
            body: (v) => `A 10-second estimate catches big mistakes instantly! Tap to see how.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Round ${v.dividend} to ${v.roundedDividend}`, why: `${v.roundedDividend} divides easily by ${v.divisor}` },
                  { text: `Estimate: ${v.roundedDividend} ÷ ${v.divisor} = ${v.estimate}`, why: "So the real answer should be close to " + v.estimate },
                  { text: `✗ ${v.name}'s answer: ${v.wrongAnswer}`, why: `${v.wrongAnswer} is nowhere near ${v.estimate} — something went wrong!` },
                  { text: `✓ Correct answer: ${v.quotient}`, result: `Close to our estimate of ${v.estimate} ✓` }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Now try a different one!",
            body: (v) => `What is **${v.interactDividend} ÷ ${v.interactDivisor}**? (Hint: estimate first — it should be close to ${v.interactEstimate}!)`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Estimate: ≈ ${v.interactEstimate}`, why: "The answer should be close to this!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDistractors(v.interactQuotient),
              correctAnswer: (v) => v.interactQuotient,
              feedback: {
                correct: (v) => `Well done! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient}**. Close to our estimate of ${v.interactEstimate} — makes sense! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient}**. It's close to our estimate of ${v.interactEstimate}, as expected.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Estimate first — always!",
            body: () => `A quick estimate takes 10 seconds and can save you from big mistakes:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Round to a friendly number and divide", why: "This gives you a rough answer in seconds." },
                  { text: "Do the real division", why: "Use the bus stop or long division method." },
                  { text: "Compare your answer to the estimate", why: "If they're close, you're probably right. If not — check again! ✓" }
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
  // SUB-CONCEPT 6: Division Word Problems
  // ==========================================
  {
    id: "dividing-word-problems",
    name: "Division Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "dividing-word-problems-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot when a word problem needs division",
          "How to pick out the right numbers from a word problem"
        ],
        variableSets: [
          {
            name: "Mrs Chen",
            scenario: "A school has 384 pupils. They are split into 8 equal houses for sports day.",
            question: "How many pupils are in each house?",
            dividend: 384,
            divisor: 8,
            quotient: 48,
            remainder: 0,
            clue: "split into equal groups",
            unit: "pupils",
            // Interact-specific values (different from teach)
            // 216 ÷ 6 = 36 (6 × 36 = 216)
            interactScenario: "A school has 216 pupils. They are divided into 6 equal teams for a quiz.",
            interactQuestion: "How many pupils are in each team?",
            interactDividend: 216,
            interactDivisor: 6,
            interactQuotient: 36,
            interactUnit: "pupils"
          },
          {
            name: "Oliver",
            scenario: "A baker makes 252 bread rolls. He packs them into bags of 6.",
            question: "How many bags can he fill?",
            dividend: 252,
            divisor: 6,
            quotient: 42,
            remainder: 0,
            clue: "packs into equal bags",
            unit: "rolls",
            // 168 ÷ 7 = 24 (7 × 24 = 168)
            interactScenario: "A farmer picks 168 apples. He puts them into crates of 7.",
            interactQuestion: "How many crates can he fill?",
            interactDividend: 168,
            interactDivisor: 7,
            interactQuotient: 24,
            interactUnit: "apples"
          },
          {
            name: "Amelia",
            scenario: "A bookshop receives 495 books. They go on shelves that hold 9 books each.",
            question: "How many full shelves are there?",
            dividend: 495,
            divisor: 9,
            quotient: 55,
            remainder: 0,
            clue: "equally into groups of the same size",
            unit: "books",
            // 336 ÷ 8 = 42 (8 × 42 = 336)
            interactScenario: "A library has 336 DVDs. They go on racks that hold 8 DVDs each.",
            interactQuestion: "How many full racks are there?",
            interactDividend: 336,
            interactDivisor: 8,
            interactQuotient: 42,
            interactUnit: "DVDs"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "What type of calculation is hiding here?",
            body: (v) => `${v.scenario}\n${v.question}\n\nThe word "**equal**" or "**each**" in a problem is often a clue that you need to **divide**. Can you spot the two key numbers?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Clue words: "${v.clue}"`, why: "These words tell us it's a division problem!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Pick out the numbers!",
            body: (v) => `The secret to word problems is finding the **total** and the **group size** hiding in the text. Tap to see how to pick them out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Total: ${v.dividend}`, why: "This is the big number being shared or split" },
                  { text: `Divisor (the number you divide by): ${v.divisor}`, why: "This is how many groups (or the size of each group)" },
                  { text: `${v.dividend} ÷ ${v.divisor} = ${v.quotient}`, why: "That's our answer!", result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Can you solve this one?",
            body: (v) => `${v.interactScenario}\n${v.interactQuestion}`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactDividend).split('');
                const steps = digits.map(d => ({ digit: d, result: "?", remainder: 0, carry: false }));
                return { divisor: v.interactDivisor, dividend: v.interactDividend, steps, showAnswer: false };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDistractors(v.interactQuotient),
              correctAnswer: (v) => v.interactQuotient,
              feedback: {
                correct: (v) => `Brilliant! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient}**. You spotted it was a division problem and picked out the right numbers! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient}**. Look for the total and the group size — then divide!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Spotting division in word problems!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Look for these clue words to know when to divide:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 8,
                  dividend: 384,
                  steps: [
                    { digit: "3", result: "0", remainder: 3, carry: true },
                    { digit: "8", result: "4", remainder: 6, carry: true },
                    { digit: "4", result: "8", remainder: 0, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'text',
                content: () => `384 pupils split into 8 houses = 48 per house`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Clue words: shared, split, divided, equal, each, per", why: "These usually mean division!" },
                    { text: "Find the TOTAL (the big number being shared)", why: "This goes first in the division." },
                    { text: "Find the GROUP SIZE or NUMBER OF GROUPS", why: "This is the number you divide by. Total ÷ group size = answer! ✓" }
                  ]
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "dividing-word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid dividing the wrong way round",
          "Why the bigger number usually goes first in division"
        ],
        variableSets: [
          {
            name: "Sam",
            scenario: "A farmer has 156 eggs. He puts them into boxes of 12.",
            question: "How many boxes does he need?",
            dividend: 156,
            divisor: 12,
            quotient: 13,
            wrongSetup: "12 ÷ 156",
            correctSetup: "156 ÷ 12",
            wrongAnswer: "0 point something",
            unit: "eggs",
            mistakeExplanation: "divided the small number by the big number (12 ÷ 156) instead of the big number by the small number (156 ÷ 12)",
            // Interact-specific values (different from teach)
            // 192 ÷ 8 = 24 (8 × 24 = 192)
            interactScenario: "A shop has 192 bottles of juice. They go into packs of 8.",
            interactQuestion: "How many packs are there?",
            interactDividend: 192,
            interactDivisor: 8,
            interactQuotient: 24,
            interactUnit: "bottles"
          },
          {
            name: "Ruby",
            scenario: "A school trip costs £288. The cost is shared equally between 9 classes.",
            question: "How much does each class pay?",
            dividend: 288,
            divisor: 9,
            quotient: 32,
            wrongSetup: "9 ÷ 288",
            correctSetup: "288 ÷ 9",
            wrongAnswer: "a tiny fraction",
            unit: "pounds",
            mistakeExplanation: "put the numbers the wrong way round — 9 ÷ 288 instead of 288 ÷ 9",
            // 245 ÷ 5 = 49 (5 × 49 = 245)
            interactScenario: "A charity raises £245. The money is shared equally between 5 groups.",
            interactQuestion: "How much does each group get?",
            interactDividend: 245,
            interactDivisor: 5,
            interactQuotient: 49,
            interactUnit: "pounds"
          },
          {
            name: "Archie",
            scenario: "A sweetshop has 420 lollipops. They fill jars with 7 lollipops each.",
            question: "How many jars can they fill?",
            dividend: 420,
            divisor: 7,
            quotient: 60,
            wrongSetup: "7 ÷ 420",
            correctSetup: "420 ÷ 7",
            wrongAnswer: "a tiny number",
            unit: "lollipops",
            mistakeExplanation: "divided 7 by 420 instead of 420 by 7",
            // 324 ÷ 4 = 81 (4 × 81 = 324)
            interactScenario: "A school has 324 worksheets. They are shared equally between 4 classes.",
            interactQuestion: "How many worksheets does each class get?",
            interactDividend: 324,
            interactDivisor: 4,
            interactQuotient: 81,
            interactUnit: "worksheets"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.name} set up the division wrong!`,
            body: (v) => `${v.scenario}\n${v.question}\n${v.name} wrote: **${v.wrongSetup}**. But that gives ${v.wrongAnswer}! What went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name} wrote: ${v.wrongSetup}`, why: "That's the wrong way round!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "The total always goes FIRST!",
            body: (v) => `${v.name} ${v.mistakeExplanation}. In division, the **total** always goes first, and the **divisor** (the number you divide by) goes second. Tap to compare the wrong and right setups.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.wrongSetup}`, why: "Small ÷ big doesn't make sense here!", result: "✗" },
                  { text: `Correct: ${v.correctSetup} = ${v.quotient}`, why: "Total ÷ group size = number of groups", result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactScenario}\n${v.interactQuestion}`,
            visual: {
              component: "BusStopDiagram",
              props: (v) => {
                const digits = String(v.interactDividend).split('');
                const steps = digits.map(d => ({ digit: d, result: "?", remainder: 0, carry: false }));
                return { divisor: v.interactDivisor, dividend: v.interactDividend, steps, showAnswer: false };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDividend} ÷ ${v.interactDivisor}?`,
              getOptions: (v) => generateDistractors(v.interactQuotient),
              correctAnswer: (v) => v.interactQuotient,
              feedback: {
                correct: (v) => `Well done! **${v.interactDividend} ÷ ${v.interactDivisor} = ${v.interactQuotient}**. You got the numbers the right way round! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDividend} ÷ ${v.interactDivisor} = **${v.interactQuotient}**. Remember: the total goes first!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Which number goes first?",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common word problem mistake is putting the numbers **the wrong way round**. Remember:`
              },
              {
                type: 'visual',
                component: 'BusStopDiagram',
                props: () => ({
                  divisor: 12,
                  dividend: 156,
                  steps: [
                    { digit: "1", result: " ", remainder: 0, carry: false },
                    { digit: "5", result: "1", remainder: 3, carry: true },
                    { digit: "6", result: "3", remainder: 0, carry: false }
                  ],
                  showAnswer: true
                })
              },
              {
                type: 'text',
                content: () => `156 ÷ 12 = 13. The **total** (156) always goes first!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "The TOTAL goes first (it's the big number)", why: "This is the number being shared or split up." },
                    { text: "The DIVISOR (the number you divide by) goes second", why: "The group size or number of groups." },
                    { text: "If your answer seems tiny, you probably swapped them!", why: "A quick sense-check catches this every time. ✓" }
                  ]
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  }
];

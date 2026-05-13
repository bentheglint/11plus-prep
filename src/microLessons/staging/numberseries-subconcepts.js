// ============================================================
// Supplementary sub-concepts for Number Series (Verbal Reasoning)
// To merge: add these to lessonBank.numberSeries.subConcepts array in lessonData.js
// ============================================================

export const numberSeriesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Constant Difference
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "constant-difference",
    name: "Constant Difference",
    category: "core",
    lessons: [
      {
        id: "constant-difference-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when the same number is added each time — the simplest pattern to crack",
          "How to use the 'Write the Hops' method to find constant differences quickly"
        ],
        variableSets: [
          {
            // Series: 4, 11, 18, 25, 32, ?
            // Hops: +7, +7, +7, +7 → next +7 → 39
            // Verify: 4+7=11 ✓, 11+7=18 ✓, 18+7=25 ✓, 25+7=32 ✓, 32+7=39 ✓
            name: "Daisy",
            scenario: "working through a VR practice paper",
            series: [4, 11, 18, 25, 32],
            hops: ["+7", "+7", "+7", "+7"],
            patternDescription: "add 7 each time",
            nextNumber: 39,
            options: ["37", "38", "39", "40", "42"],
            correctAnswer: "39",
            explanation: "The hops are all +7: 4, 11, 18, 25, 32 — so 32 + 7 = 39. A constant difference means the same number is added every time. ✓",
            // Interact-specific: +5 series (3, 8, 13, 18, 23 → 28)
            // Verify: 3+5=8 ✓, 8+5=13 ✓, 13+5=18 ✓, 18+5=23 ✓, 23+5=28 ✓
            interactSeries: [3, 8, 13, 18, 23],
            interactHops: ["+5", "+5", "+5", "+5"],
            interactNextNumber: 28,
            interactOptions: ["25", "26", "27", "28", "30"],
            interactCorrectAnswer: "28",
            interactExplanation: "The hops are all +5: 3, 8, 13, 18, 23 — so 23 + 5 = 28. A constant difference of 5 each time. ✓"
          },
          {
            // Series: 6, 15, 24, 33, 42, ?
            // Hops: +9, +9, +9, +9 → next +9 → 51
            // Verify: 6+9=15 ✓, 15+9=24 ✓, 24+9=33 ✓, 33+9=42 ✓, 42+9=51 ✓
            name: "Oliver",
            scenario: "practising number series at his desk",
            series: [6, 15, 24, 33, 42],
            hops: ["+9", "+9", "+9", "+9"],
            patternDescription: "add 9 each time",
            nextNumber: 51,
            options: ["48", "49", "50", "51", "54"],
            correctAnswer: "51",
            explanation: "Every hop is +9: 6, 15, 24, 33, 42 — so 42 + 9 = 51. The difference is constant. ✓",
            // Interact-specific: +8 series (5, 13, 21, 29, 37 → 45)
            // Verify: 5+8=13 ✓, 13+8=21 ✓, 21+8=29 ✓, 29+8=37 ✓, 37+8=45 ✓
            interactSeries: [5, 13, 21, 29, 37],
            interactHops: ["+8", "+8", "+8", "+8"],
            interactNextNumber: 45,
            interactOptions: ["41", "43", "44", "45", "47"],
            interactCorrectAnswer: "45",
            interactExplanation: "Every hop is +8: 5, 13, 21, 29, 37 — so 37 + 8 = 45. The difference is constant. ✓"
          },
          {
            // Series: 7, 13, 19, 25, 31, ?
            // Hops: +6, +6, +6, +6 → next +6 → 37
            // Verify: 7+6=13 ✓, 13+6=19 ✓, 19+6=25 ✓, 25+6=31 ✓, 31+6=37 ✓
            name: "Priya",
            scenario: "solving VR questions before school",
            series: [7, 13, 19, 25, 31],
            hops: ["+6", "+6", "+6", "+6"],
            patternDescription: "add 6 each time",
            nextNumber: 37,
            options: ["35", "36", "37", "38", "40"],
            correctAnswer: "37",
            explanation: "Each hop is +6: 7, 13, 19, 25, 31 — so 31 + 6 = 37. Same difference every time! ✓",
            // Interact-specific: +4 series (9, 13, 17, 21, 25 → 29)
            // Verify: 9+4=13 ✓, 13+4=17 ✓, 17+4=21 ✓, 21+4=25 ✓, 25+4=29 ✓
            interactSeries: [9, 13, 17, 21, 25],
            interactHops: ["+4", "+4", "+4", "+4"],
            interactNextNumber: 29,
            interactOptions: ["27", "28", "29", "30", "31"],
            interactCorrectAnswer: "29",
            interactExplanation: "Each hop is +4: 9, 13, 17, 21, 25 — so 25 + 4 = 29. Same difference every time! ✓"
          },
          {
            // Series: 3, 14, 25, 36, 47, ?
            // Hops: +11, +11, +11, +11 → next +11 → 58
            // Verify: 3+11=14 ✓, 14+11=25 ✓, 25+11=36 ✓, 36+11=47 ✓, 47+11=58 ✓
            name: "Finn",
            scenario: "racing through a timed VR paper",
            series: [3, 14, 25, 36, 47],
            hops: ["+11", "+11", "+11", "+11"],
            patternDescription: "add 11 each time",
            nextNumber: 58,
            options: ["55", "56", "57", "58", "60"],
            correctAnswer: "58",
            explanation: "Every hop is +11: 3, 14, 25, 36, 47 — so 47 + 11 = 58. Constant difference of 11. ✓",
            // Interact-specific: +6 series (2, 8, 14, 20, 26 → 32)
            // Verify: 2+6=8 ✓, 8+6=14 ✓, 14+6=20 ✓, 20+6=26 ✓, 26+6=32 ✓
            interactSeries: [2, 8, 14, 20, 26],
            interactHops: ["+6", "+6", "+6", "+6"],
            interactNextNumber: 32,
            interactOptions: ["28", "30", "31", "32", "34"],
            interactCorrectAnswer: "32",
            interactExplanation: "Every hop is +6: 2, 8, 14, 20, 26 — so 26 + 6 = 32. Constant difference of 6. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What comes after ${v.series[v.series.length - 1]}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nLook at this series (a list of numbers that follow a rule). **Did you know?** When the gap between each number is exactly the same, it's called a **constant difference** — and it's the most common pattern you'll see in the exam!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same hop every time",
            body: (v) => `The series **${v.series.join(', ')}** has the **same hop** between every pair — that's a **constant difference**. Just add that hop one more time!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Write the hops: ${v.series[1]}−${v.series[0]}=${v.series[1] - v.series[0]}, ${v.series[2]}−${v.series[1]}=${v.series[2] - v.series[1]}, ${v.series[3]}−${v.series[2]}=${v.series[3] - v.series[2]}`, why: "Calculate the difference between each pair" },
                  { text: `Pattern: every hop is ${v.hops[0]}`, why: "They're all the same — constant difference!" },
                  { text: `Apply: ${v.series[v.series.length - 1]} ${v.hops[0]} = ${v.nextNumber}`, why: "Add the same hop one more time ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Calculate the hop between each pair of numbers`,
                `Check that every hop is the same`,
                `Add that hop to the last number in the series`
              ],
              feedback: {
                correct: (v) => `Perfect! Calculate hops, check they match, then add one more. ✓`,
                incorrect: (v) => `Not quite — first calculate ALL the hops, then check they're the same, then add!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe hops are all ${v.interactHops[0]}. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: v.interactHops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Constant difference — nailed it!",
            body: () => `When all the hops are the same, you know exactly what to do:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Calculate the hop between each pair", why: "Subtract each number from the next" },
                  { text: "2. Check they're all the SAME", why: "Same hop = constant difference" },
                  { text: "3. Add that hop to the last number", why: "The pattern continues with the same difference ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "constant-difference-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why checking EVERY hop matters — the first one can trick you!",
          "How to avoid the sneaky trap of assuming a pattern too early"
        ],
        variableSets: [
          {
            // Mistake: seeing 5,10 and assuming +5, but series is ×2
            // Series: 5, 10, 20, 40, 80, ?
            // Correct: ×2 → 160
            // Wrong guess: +5 → 85
            // Verify: 5×2=10 ✓, 10×2=20 ✓, 20×2=40 ✓, 40×2=80 ✓, 80×2=160 ✓
            name: "Evie",
            scenario: "checking her friend's VR homework",
            series: [5, 10, 20, 40, 80],
            wrongAnswer: "85",
            wrongReason: "added 5 each time because 10−5=5",
            realHops: "×2, ×2, ×2, ×2",
            realPattern: "each number doubles (×2)",
            nextNumber: 160,
            options: ["85", "120", "140", "160", "200"],
            correctAnswer: "160",
            explanation: "The first hop looks like +5, but the numbers are actually DOUBLING: 5, 10, 20, 40, 80, 160. Always check every hop, not just the first! ✓",
            // Interact-specific: Series 4, 8, 16, 32, 64, ? (×2 each time → 128)
            // Mistake would be +4, but real pattern is ×2
            // Verify: 4×2=8 ✓, 8×2=16 ✓, 16×2=32 ✓, 32×2=64 ✓, 64×2=128 ✓
            interactSeries: [4, 8, 16, 32, 64],
            interactRealHops: "×2, ×2, ×2, ×2",
            interactRealPattern: "each number doubles (×2)",
            interactNextNumber: 128,
            interactOptions: ["68", "96", "100", "128", "132"],
            interactCorrectAnswer: "128",
            interactExplanation: "The numbers are doubling: 4, 8, 16, 32, 64 — so 64 × 2 = 128. When hops keep getting bigger, think multiplication! ✓"
          },
          {
            // Mistake: seeing 3,6 and assuming +3, but series is 3,6,12,24,48
            // Correct: ×2 → 96
            // Verify: 3×2=6 ✓, 6×2=12 ✓, 12×2=24 ✓, 24×2=48 ✓, 48×2=96 ✓
            name: "Marcus",
            scenario: "reviewing his practice test",
            series: [3, 6, 12, 24, 48],
            wrongAnswer: "51",
            wrongReason: "added 3 each time because 6−3=3",
            realHops: "×2, ×2, ×2, ×2",
            realPattern: "each number doubles (×2)",
            nextNumber: 96,
            options: ["51", "72", "84", "96", "108"],
            correctAnswer: "96",
            explanation: "The first hop is +3, but the REAL pattern is doubling: 3, 6, 12, 24, 48, 96. The hops get bigger (+3, +6, +12, +24) because it's ×2 each time. ✓",
            // Interact-specific: Series 2, 6, 18, 54, ? (×3 each time → 162)
            // Verify: 2×3=6 ✓, 6×3=18 ✓, 18×3=54 ✓, 54×3=162 ✓
            interactSeries: [2, 6, 18, 54],
            interactRealHops: "×3, ×3, ×3",
            interactRealPattern: "each number triples (×3)",
            interactNextNumber: 162,
            interactOptions: ["58", "108", "135", "162", "180"],
            interactCorrectAnswer: "162",
            interactExplanation: "The numbers are tripling: 2, 6, 18, 54 — so 54 × 3 = 162. Always check every hop! ✓"
          },
          {
            // Mistake: seeing 2,7 and assuming +5, but it's +5,+7,+9,+11
            // Series: 2, 7, 14, 23, 34, ?
            // Hops: +5, +7, +9, +11 → increasing by 2 → next +13 → 47
            // Verify: 2+5=7 ✓, 7+7=14 ✓, 14+9=23 ✓, 23+11=34 ✓, 34+13=47 ✓
            name: "Aisha",
            scenario: "helping her brother spot his errors",
            series: [2, 7, 14, 23, 34],
            wrongAnswer: "39",
            wrongReason: "added 5 each time because 7−2=5",
            realHops: "+5, +7, +9, +11",
            realPattern: "hops increase by 2 each time",
            nextNumber: 47,
            options: ["39", "42", "45", "47", "50"],
            correctAnswer: "47",
            explanation: "The first hop is +5, but the hops INCREASE: +5, +7, +9, +11 — up by 2 each time. Next hop is +13, so 34 + 13 = 47. ✓",
            // Interact-specific: Series 1, 4, 10, 19, 31, ? (hops +3, +6, +9, +12 → +15 → 46)
            // Verify: 1+3=4 ✓, 4+6=10 ✓, 10+9=19 ✓, 19+12=31 ✓, 31+15=46 ✓
            interactSeries: [1, 4, 10, 19, 31],
            interactRealHops: "+3, +6, +9, +12",
            interactRealPattern: "hops increase by 3 each time",
            interactNextNumber: 46,
            interactOptions: ["34", "40", "43", "46", "49"],
            interactCorrectAnswer: "46",
            interactExplanation: "The hops are +3, +6, +9, +12 — increasing by 3 each time. Next hop is +15, so 31 + 15 = 46. ✓"
          },
          {
            // Mistake: seeing 4,8 and assuming +4, but it's ×2
            // Series: 4, 8, 16, 32, 64, ?
            // Verify: 4×2=8 ✓, 8×2=16 ✓, 16×2=32 ✓, 32×2=64 ✓, 64×2=128 ✓
            name: "Charlie",
            scenario: "going over a mock paper with his mum",
            series: [4, 8, 16, 32, 64],
            wrongAnswer: "68",
            wrongReason: "added 4 each time because 8−4=4",
            realHops: "×2, ×2, ×2, ×2",
            realPattern: "each number doubles (×2)",
            nextNumber: 128,
            options: ["68", "96", "100", "128", "132"],
            correctAnswer: "128",
            explanation: "It's not +4 each time — the numbers are doubling! 4, 8, 16, 32, 64, 128. If the hops keep getting bigger, it might be multiplying. ✓",
            // Interact-specific: Series 7, 14, 28, 56, ? (×2 each time → 112)
            // Verify: 7×2=14 ✓, 14×2=28 ✓, 28×2=56 ✓, 56×2=112 ✓
            interactSeries: [7, 14, 28, 56],
            interactRealHops: "×2, ×2, ×2",
            interactRealPattern: "each number doubles (×2)",
            interactNextNumber: 112,
            interactOptions: ["63", "84", "98", "112", "120"],
            interactCorrectAnswer: "112",
            interactExplanation: "The numbers are doubling: 7, 14, 28, 56 — so 56 × 2 = 112. Always check every hop! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.wrongAnswer}" really the answer?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nSomeone answered **${v.wrongAnswer}** because they ${v.wrongReason}.\n\nBut is that right? Let's check ALL the hops!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check EVERY hop!",
            body: (v) => `The series is **${v.series.join(', ')}**. The mistake was only checking the first hop. Let's look at ALL of them:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First hop: ${v.series[1]}−${v.series[0]}=${v.series[1] - v.series[0]}`, why: "This is where the mistake starts — they assumed ALL hops are the same" },
                  { text: `All hops: ${v.realHops}`, why: `The REAL pattern: ${v.realPattern}` },
                  { text: `Correct answer: ${v.nextNumber}`, why: "Always check every hop before deciding! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `You can work out the pattern from just the first two numbers`, answer: false, explanation: `No! The first hop can be misleading. Always check at least 3 hops before deciding the pattern.` },
                { text: `If the hops keep getting bigger, the pattern might be multiplying rather than adding`, answer: true, explanation: `Correct! Growing hops often mean multiply or increasing differences. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the REAL answer!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe real pattern is: ${v.interactRealPattern}. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't get caught out — check every hop!",
            body: () => `Now you know the biggest trap in number series questions, and you won't fall for it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Never assume the pattern from just ONE hop", why: "The first gap can be misleading" },
                  { text: "Calculate ALL the hops before deciding", why: "Write them out — are they the same? Growing? Doubling?" },
                  { text: "If hops are different, look for a pattern IN the hops", why: "Increasing hops or multiplying hops are common traps ✓" }
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
  // SUB-CONCEPT 2: Increasing Hops
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "increasing-hops",
    name: "Increasing Hops",
    category: "core",
    lessons: [
      {
        id: "increasing-hops-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when the gaps themselves are getting bigger — a pattern within the pattern!",
          "How to find the 'hop of the hops' and use it to crack the code"
        ],
        variableSets: [
          {
            // Series: 2, 4, 8, 14, 22, ?
            // Hops: +2, +4, +6, +8 → increasing by 2 → next +10 → 32
            // Verify: 2+2=4 ✓, 4+4=8 ✓, 8+6=14 ✓, 14+8=22 ✓, 22+10=32 ✓
            name: "Daisy",
            scenario: "working through a tricky VR paper",
            series: [2, 4, 8, 14, 22],
            hops: ["+2", "+4", "+6", "+8"],
            hopPattern: "hops increase by 2 each time",
            nextHop: "+10",
            patternDescription: "add 2 more to the hop each time",
            nextNumber: 32,
            options: ["28", "30", "32", "34", "36"],
            correctAnswer: "32",
            explanation: "The hops are +2, +4, +6, +8 — increasing by 2 each time. Next hop is +10, so 22 + 10 = 32. ✓",
            // Interact-specific: Series 1, 3, 7, 13, 21, ? (hops +2, +4, +6, +8 → +10 → 31)
            // Verify: 1+2=3 ✓, 3+4=7 ✓, 7+6=13 ✓, 13+8=21 ✓, 21+10=31 ✓
            interactSeries: [1, 3, 7, 13, 21],
            interactHops: ["+2", "+4", "+6", "+8"],
            interactNextHop: "+10",
            interactNextNumber: 31,
            interactOptions: ["27", "29", "31", "33", "35"],
            interactCorrectAnswer: "31",
            interactExplanation: "The hops are +2, +4, +6, +8 — increasing by 2 each time. Next hop is +10, so 21 + 10 = 31. ✓"
          },
          {
            // Series: 1, 2, 5, 10, 17, ?
            // Hops: +1, +3, +5, +7 → increasing by 2 → next +9 → 26
            // Verify: 1+1=2 ✓, 2+3=5 ✓, 5+5=10 ✓, 10+7=17 ✓, 17+9=26 ✓
            name: "Oliver",
            scenario: "trying to beat his best VR score",
            series: [1, 2, 5, 10, 17],
            hops: ["+1", "+3", "+5", "+7"],
            hopPattern: "hops increase by 2 each time",
            nextHop: "+9",
            patternDescription: "add 2 more to the hop each time",
            nextNumber: 26,
            options: ["22", "24", "26", "28", "30"],
            correctAnswer: "26",
            explanation: "The hops are +1, +3, +5, +7 — going up by 2 each time. Next hop is +9, so 17 + 9 = 26. ✓",
            // Interact-specific: Series 3, 4, 7, 12, 19, ? (hops +1, +3, +5, +7 → +9 → 28)
            // Verify: 3+1=4 ✓, 4+3=7 ✓, 7+5=12 ✓, 12+7=19 ✓, 19+9=28 ✓
            interactSeries: [3, 4, 7, 12, 19],
            interactHops: ["+1", "+3", "+5", "+7"],
            interactNextHop: "+9",
            interactNextNumber: 28,
            interactOptions: ["24", "26", "28", "30", "32"],
            interactCorrectAnswer: "28",
            interactExplanation: "The hops are +1, +3, +5, +7 — going up by 2 each time. Next hop is +9, so 19 + 9 = 28. ✓"
          },
          {
            // Series: 3, 6, 12, 21, 33, ?
            // Hops: +3, +6, +9, +12 → increasing by 3 → next +15 → 48
            // Verify: 3+3=6 ✓, 6+6=12 ✓, 12+9=21 ✓, 21+12=33 ✓, 33+15=48 ✓
            name: "Priya",
            scenario: "solving series questions at the kitchen table",
            series: [3, 6, 12, 21, 33],
            hops: ["+3", "+6", "+9", "+12"],
            hopPattern: "hops increase by 3 each time",
            nextHop: "+15",
            patternDescription: "add 3 more to the hop each time",
            nextNumber: 48,
            options: ["42", "45", "48", "51", "54"],
            correctAnswer: "48",
            explanation: "The hops are +3, +6, +9, +12 — increasing by 3 each time. Next hop is +15, so 33 + 15 = 48. ✓",
            // Interact-specific: Series 2, 5, 11, 20, 32, ? (hops +3, +6, +9, +12 → +15 → 47)
            // Verify: 2+3=5 ✓, 5+6=11 ✓, 11+9=20 ✓, 20+12=32 ✓, 32+15=47 ✓
            interactSeries: [2, 5, 11, 20, 32],
            interactHops: ["+3", "+6", "+9", "+12"],
            interactNextHop: "+15",
            interactNextNumber: 47,
            interactOptions: ["41", "44", "47", "50", "53"],
            interactCorrectAnswer: "47",
            interactExplanation: "The hops are +3, +6, +9, +12 — increasing by 3 each time. Next hop is +15, so 32 + 15 = 47. ✓"
          },
          {
            // Series: 5, 6, 9, 14, 21, ?
            // Hops: +1, +3, +5, +7 → increasing by 2 → next +9 → 30
            // Verify: 5+1=6 ✓, 6+3=9 ✓, 9+5=14 ✓, 14+7=21 ✓, 21+9=30 ✓
            name: "Finn",
            scenario: "puzzling over a series at breaktime",
            series: [5, 6, 9, 14, 21],
            hops: ["+1", "+3", "+5", "+7"],
            hopPattern: "hops increase by 2 each time",
            nextHop: "+9",
            patternDescription: "add 2 more to the hop each time",
            nextNumber: 30,
            options: ["26", "28", "30", "32", "34"],
            correctAnswer: "30",
            explanation: "The hops are +1, +3, +5, +7 — going up by 2 each time. Next hop is +9, so 21 + 9 = 30. ✓",
            // Interact-specific: Series 4, 5, 8, 13, 20, ? (hops +1, +3, +5, +7 → +9 → 29)
            // Verify: 4+1=5 ✓, 5+3=8 ✓, 8+5=13 ✓, 13+7=20 ✓, 20+9=29 ✓
            interactSeries: [4, 5, 8, 13, 20],
            interactHops: ["+1", "+3", "+5", "+7"],
            interactNextHop: "+9",
            interactNextNumber: 29,
            interactOptions: ["25", "27", "29", "31", "33"],
            interactCorrectAnswer: "29",
            interactExplanation: "The hops are +1, +3, +5, +7 — going up by 2 each time. Next hop is +9, so 20 + 9 = 29. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The hops are GROWING!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nThe hops between these numbers aren't the same — they're getting **bigger** each time. How cool is this? There's a hidden pattern INSIDE the pattern!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Pattern in the hops",
            body: (v) => `In the series **${v.series.join(', ')}**, the hops aren't constant — they're **${v.hops.join(', ')}**. Look for a pattern **inside** the hops. How much do the hops grow each time?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Hops: ${v.hops.join(", ")}`, why: "Calculate the difference between each pair of numbers" },
                  { text: `Pattern in the hops: ${v.hopPattern}`, why: "The hops themselves follow a rule!" },
                  { text: `Next hop: ${v.nextHop}, so ${v.series[v.series.length - 1]} ${v.nextHop} = ${v.nextNumber}`, why: "Apply the hop pattern to find the next hop ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When the hops get bigger each time, we call them ____ hops`,
              options: (v) => ["increasing", "constant", "random", "multiplying"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Increasing hops means the differences grow by a set amount each time. ✓`,
                incorrect: (v) => `Not quite — when hops get bigger each time, they are called increasing hops!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe hops are ${v.interactHops.join(", ")} — what comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: v.interactHops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Increasing hops — you've cracked it!",
            body: () => `When the hops aren't the same, you now know the trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write out all the hops", why: "Calculate EVERY difference between pairs" },
                  { text: "2. Look for a pattern in the hops", why: "Do the hops go up by 2? By 3? By some other amount?" },
                  { text: "3. Use the hop pattern to find the NEXT hop", why: "Then add that hop to the last number ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "increasing-hops-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to recognise the famous triangle numbers (1, 3, 6, 10, 15... where the hops grow by 1) and other increasing-hop patterns",
          "How to tackle even the trickiest increasing-hop problems with confidence"
        ],
        variableSets: [
          {
            // Triangle numbers: 1, 3, 6, 10, 15, 21, ?
            // Hops: +2, +3, +4, +5, +6 → next +7 → 28
            // Verify: 1+2=3 ✓, 3+3=6 ✓, 6+4=10 ✓, 10+5=15 ✓, 15+6=21 ✓, 21+7=28 ✓
            name: "Evie",
            scenario: "spotted a series she recognises from maths",
            series: [1, 3, 6, 10, 15, 21],
            hops: ["+2", "+3", "+4", "+5", "+6"],
            hopPattern: "hops increase by 1 each time",
            nextHop: "+7",
            patternDescription: "these are triangle numbers — add 1 more each time",
            nextNumber: 28,
            options: ["25", "26", "27", "28", "30"],
            correctAnswer: "28",
            explanation: "The hops are +2, +3, +4, +5, +6 — going up by 1 each time. Next hop is +7, so 21 + 7 = 28. These are triangle numbers! ✓",
            // Interact-specific: Series 2, 5, 9, 14, 20, ? (hops +3, +4, +5, +6 → +7 → 27)
            // Verify: 2+3=5 ✓, 5+4=9 ✓, 9+5=14 ✓, 14+6=20 ✓, 20+7=27 ✓
            interactSeries: [2, 5, 9, 14, 20],
            interactHops: ["+3", "+4", "+5", "+6"],
            interactNextHop: "+7",
            interactNextNumber: 27,
            interactOptions: ["24", "25", "26", "27", "29"],
            interactCorrectAnswer: "27",
            interactExplanation: "The hops are +3, +4, +5, +6 — going up by 1 each time. Next hop is +7, so 20 + 7 = 27. ✓"
          },
          {
            // Series: 4, 5, 8, 13, 20, ?
            // Hops: +1, +3, +5, +7 → increasing by 2 → next +9 → 29
            // Verify: 4+1=5 ✓, 5+3=8 ✓, 8+5=13 ✓, 13+7=20 ✓, 20+9=29 ✓
            name: "Marcus",
            scenario: "tackling the hardest series on the page",
            series: [4, 5, 8, 13, 20],
            hops: ["+1", "+3", "+5", "+7"],
            hopPattern: "hops increase by 2 each time (odd numbers)",
            nextHop: "+9",
            patternDescription: "hops go up by 2 each time",
            nextNumber: 29,
            options: ["25", "27", "29", "31", "33"],
            correctAnswer: "29",
            explanation: "The hops are +1, +3, +5, +7 — odd numbers, increasing by 2. Next hop is +9, so 20 + 9 = 29. ✓",
            // Interact-specific: Series 6, 7, 10, 15, 22, ? (hops +1, +3, +5, +7 → +9 → 31)
            // Verify: 6+1=7 ✓, 7+3=10 ✓, 10+5=15 ✓, 15+7=22 ✓, 22+9=31 ✓
            interactSeries: [6, 7, 10, 15, 22],
            interactHops: ["+1", "+3", "+5", "+7"],
            interactNextHop: "+9",
            interactNextNumber: 31,
            interactOptions: ["27", "29", "31", "33", "35"],
            interactCorrectAnswer: "31",
            interactExplanation: "The hops are +1, +3, +5, +7 — odd numbers, increasing by 2. Next hop is +9, so 22 + 9 = 31. ✓"
          },
          {
            // Series: 1, 5, 13, 25, 41, ?
            // Hops: +4, +8, +12, +16 → increasing by 4 → next +20 → 61
            // Verify: 1+4=5 ✓, 5+8=13 ✓, 13+12=25 ✓, 25+16=41 ✓, 41+20=61 ✓
            name: "Aisha",
            scenario: "working through a challenge paper",
            series: [1, 5, 13, 25, 41],
            hops: ["+4", "+8", "+12", "+16"],
            hopPattern: "hops increase by 4 each time",
            nextHop: "+20",
            patternDescription: "hops go up by 4 each time",
            nextNumber: 61,
            options: ["53", "57", "59", "61", "65"],
            correctAnswer: "61",
            explanation: "The hops are +4, +8, +12, +16 — increasing by 4 each time. Next hop is +20, so 41 + 20 = 61. ✓",
            // Interact-specific: Series 2, 6, 14, 26, 42, ? (hops +4, +8, +12, +16 → +20 → 62)
            // Verify: 2+4=6 ✓, 6+8=14 ✓, 14+12=26 ✓, 26+16=42 ✓, 42+20=62 ✓
            interactSeries: [2, 6, 14, 26, 42],
            interactHops: ["+4", "+8", "+12", "+16"],
            interactNextHop: "+20",
            interactNextNumber: 62,
            interactOptions: ["54", "58", "60", "62", "66"],
            interactCorrectAnswer: "62",
            interactExplanation: "The hops are +4, +8, +12, +16 — increasing by 4 each time. Next hop is +20, so 42 + 20 = 62. ✓"
          },
          {
            // Series: 10, 12, 16, 22, 30, ?
            // Hops: +2, +4, +6, +8 → increasing by 2 → next +10 → 40
            // Verify: 10+2=12 ✓, 12+4=16 ✓, 16+6=22 ✓, 22+8=30 ✓, 30+10=40 ✓
            name: "Charlie",
            scenario: "solving a tricky series at home",
            series: [10, 12, 16, 22, 30],
            hops: ["+2", "+4", "+6", "+8"],
            hopPattern: "hops increase by 2 each time (even numbers)",
            nextHop: "+10",
            patternDescription: "hops go up by 2 each time",
            nextNumber: 40,
            options: ["36", "38", "40", "42", "44"],
            correctAnswer: "40",
            explanation: "The hops are +2, +4, +6, +8 — even numbers, increasing by 2. Next hop is +10, so 30 + 10 = 40. ✓",
            // Interact-specific: Series 5, 7, 11, 17, 25, ? (hops +2, +4, +6, +8 → +10 → 35)
            // Verify: 5+2=7 ✓, 7+4=11 ✓, 11+6=17 ✓, 17+8=25 ✓, 25+10=35 ✓
            interactSeries: [5, 7, 11, 17, 25],
            interactHops: ["+2", "+4", "+6", "+8"],
            interactNextHop: "+10",
            interactNextNumber: 35,
            interactOptions: ["31", "33", "35", "37", "39"],
            interactCorrectAnswer: "35",
            interactExplanation: "The hops are +2, +4, +6, +8 — even numbers, increasing by 2. Next hop is +10, so 25 + 10 = 35. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The gaps keep GROWING!`,
            body: (v) => `${v.name} ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nThese numbers get further apart each time. The hops are growing — but by how much?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Hops of the hops",
            body: (v) => `The series **${v.series.join(', ')}** has hops that keep growing. Write out the hops, then look at how the HOPS change. That's the pattern!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Hops: ${v.hops.join(", ")}`, why: "Calculate each difference" },
                  { text: `Hop pattern: ${v.hopPattern}`, why: "How much bigger is each hop than the last?" },
                  { text: `Next hop: ${v.nextHop} → ${v.series[v.series.length - 1]} ${v.nextHop} = ${v.nextNumber}`, why: "Extend the hop pattern by one step ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe hops are ${v.interactHops.join(", ")}. What's the next number?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: v.interactHops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're a pattern hunter now!",
            body: () => `Brilliant work! When hops aren't constant, just look for a pattern inside the hops:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Hops going up by 1? → triangle numbers", why: "+1, +2, +3, +4, +5..." },
                  { text: "Hops going up by 2? → common in 11+ tests", why: "+2, +4, +6, +8, +10..." },
                  { text: "Find the hop-of-hops, then extend by one step", why: "Pattern in the pattern — that's the key ✓" }
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
  // SUB-CONCEPT 3: Decreasing Series
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "decreasing-series",
    name: "Decreasing Series",
    category: "core",
    lessons: [
      {
        id: "decreasing-series-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to work with series where numbers count DOWN instead of up",
          "Why the method is exactly the same — just with subtraction instead of addition"
        ],
        variableSets: [
          {
            // Series: 45, 38, 31, 24, 17, ?
            // Hops: -7, -7, -7, -7 → next -7 → 10
            // Verify: 45-7=38 ✓, 38-7=31 ✓, 31-7=24 ✓, 24-7=17 ✓, 17-7=10 ✓
            name: "Lily",
            scenario: "working through a countdown series",
            series: [45, 38, 31, 24, 17],
            hops: ["-7", "-7", "-7", "-7"],
            patternDescription: "subtract 7 each time",
            nextNumber: 10,
            options: ["8", "9", "10", "11", "12"],
            correctAnswer: "10",
            explanation: "Each hop is -7: 45, 38, 31, 24, 17 — so 17 - 7 = 10. The numbers go down by the same amount each time. ✓",
            // Interact-specific: -6 series (50, 44, 38, 32, 26 → 20)
            // Verify: 50-6=44 ✓, 44-6=38 ✓, 38-6=32 ✓, 32-6=26 ✓, 26-6=20 ✓
            interactSeries: [50, 44, 38, 32, 26],
            interactHops: ["-6", "-6", "-6", "-6"],
            interactNextNumber: 20,
            interactOptions: ["18", "19", "20", "21", "22"],
            interactCorrectAnswer: "20",
            interactExplanation: "Each hop is -6: 50, 44, 38, 32, 26 — so 26 - 6 = 20. Constant difference going down. ✓"
          },
          {
            // Series: 82, 73, 64, 55, 46, ?
            // Hops: -9, -9, -9, -9 → next -9 → 37
            // Verify: 82-9=73 ✓, 73-9=64 ✓, 64-9=55 ✓, 55-9=46 ✓, 46-9=37 ✓
            name: "Theo",
            scenario: "solving a series that's going backwards",
            series: [82, 73, 64, 55, 46],
            hops: ["-9", "-9", "-9", "-9"],
            patternDescription: "subtract 9 each time",
            nextNumber: 37,
            options: ["35", "36", "37", "38", "39"],
            correctAnswer: "37",
            explanation: "Every hop is -9: 82, 73, 64, 55, 46 — so 46 - 9 = 37. Constant difference going down. ✓",
            // Interact-specific: -11 series (75, 64, 53, 42, 31 → 20)
            // Verify: 75-11=64 ✓, 64-11=53 ✓, 53-11=42 ✓, 42-11=31 ✓, 31-11=20 ✓
            interactSeries: [75, 64, 53, 42, 31],
            interactHops: ["-11", "-11", "-11", "-11"],
            interactNextNumber: 20,
            interactOptions: ["18", "19", "20", "21", "22"],
            interactCorrectAnswer: "20",
            interactExplanation: "Every hop is -11: 75, 64, 53, 42, 31 — so 31 - 11 = 20. Constant difference going down. ✓"
          },
          {
            // Series: 100, 88, 76, 64, 52, ?
            // Hops: -12, -12, -12, -12 → next -12 → 40
            // Verify: 100-12=88 ✓, 88-12=76 ✓, 76-12=64 ✓, 64-12=52 ✓, 52-12=40 ✓
            name: "Priya",
            scenario: "tackling a falling number series",
            series: [100, 88, 76, 64, 52],
            hops: ["-12", "-12", "-12", "-12"],
            patternDescription: "subtract 12 each time",
            nextNumber: 40,
            options: ["38", "39", "40", "41", "44"],
            correctAnswer: "40",
            explanation: "Each hop is -12: 100, 88, 76, 64, 52 — so 52 - 12 = 40. A big constant drop each time. ✓",
            // Interact-specific: -10 series (90, 80, 70, 60, 50 → 40)
            // Verify: 90-10=80 ✓, 80-10=70 ✓, 70-10=60 ✓, 60-10=50 ✓, 50-10=40 ✓
            interactSeries: [90, 80, 70, 60, 50],
            interactHops: ["-10", "-10", "-10", "-10"],
            interactNextNumber: 40,
            interactOptions: ["35", "38", "40", "42", "45"],
            interactCorrectAnswer: "40",
            interactExplanation: "Each hop is -10: 90, 80, 70, 60, 50 — so 50 - 10 = 40. A constant drop of 10 each time. ✓"
          },
          {
            // Series: 63, 55, 47, 39, 31, ?
            // Hops: -8, -8, -8, -8 → next -8 → 23
            // Verify: 63-8=55 ✓, 55-8=47 ✓, 47-8=39 ✓, 39-8=31 ✓, 31-8=23 ✓
            name: "Finn",
            scenario: "spotting the pattern in a descending series",
            series: [63, 55, 47, 39, 31],
            hops: ["-8", "-8", "-8", "-8"],
            patternDescription: "subtract 8 each time",
            nextNumber: 23,
            options: ["21", "22", "23", "24", "25"],
            correctAnswer: "23",
            explanation: "Every hop is -8: 63, 55, 47, 39, 31 — so 31 - 8 = 23. The series falls by 8 each time. ✓",
            // Interact-specific: -5 series (40, 35, 30, 25, 20 → 15)
            // Verify: 40-5=35 ✓, 35-5=30 ✓, 30-5=25 ✓, 25-5=20 ✓, 20-5=15 ✓
            interactSeries: [40, 35, 30, 25, 20],
            interactHops: ["-5", "-5", "-5", "-5"],
            interactNextNumber: 15,
            interactOptions: ["10", "13", "14", "15", "17"],
            interactCorrectAnswer: "15",
            interactExplanation: "Every hop is -5: 40, 35, 30, 25, 20 — so 20 - 5 = 15. The series falls by 5 each time. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Going DOWN!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nThese numbers are getting **smaller** — like a countdown! The hops are negative, but here's the good news: the method is exactly the same as before. You've got this!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Negative hops",
            body: (v) => `The series **${v.series.join(', ')}** is going down. When numbers go down, the hops are **negative** (you're subtracting). The method works the same way!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Hops: ${v.series[1]}−${v.series[0]}=${v.series[1] - v.series[0]}, ${v.series[2]}−${v.series[1]}=${v.series[2] - v.series[1]}, ${v.series[3]}−${v.series[2]}=${v.series[3] - v.series[2]}`, why: "Subtract each number from the next" },
                  { text: `Pattern: every hop is ${v.hops[0]}`, why: `Constant difference — ${v.patternDescription}` },
                  { text: `Apply: ${v.series[v.series.length - 1]} + (${v.hops[0]}) = ${v.nextNumber}`, why: "Same method, just subtracting instead of adding ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When a series goes down, the hops are ____ — you subtract instead of add`,
              options: (v) => ["negative", "positive", "zero", "increasing"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Negative hops mean the series is decreasing — you subtract each time. ✓`,
                incorrect: (v) => `Not quite — when numbers go down, the hops are negative (you're subtracting)!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe hops are all ${v.interactHops[0]}. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: v.interactHops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decreasing series — same skill, new direction!",
            body: () => `When numbers go DOWN, just flip your thinking:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Calculate the hops (they'll be negative)", why: "Subtract each number from the next — you'll get minus values" },
                  { text: "2. Check if the negative hops are constant", why: "Same drop each time? Constant decreasing difference!" },
                  { text: "3. Subtract that amount from the last number", why: "Going down works the same as going up ✓" }
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
  // SUB-CONCEPT 4: Multiply Pattern
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "multiply-pattern",
    name: "Multiply Pattern",
    category: "supporting",
    lessons: [
      {
        id: "multiply-pattern-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when numbers are being multiplied, not added — the hops explode!",
          "The clever trick: dividing each number by the one before it reveals the hidden multiplier"
        ],
        variableSets: [
          {
            // Series: 3, 9, 27, 81, 243, ?
            // Pattern: ×3 each time → 729
            // Verify: 3×3=9 ✓, 9×3=27 ✓, 27×3=81 ✓, 81×3=243 ✓, 243×3=729 ✓
            name: "Daisy",
            scenario: "working on a series where numbers grow fast",
            series: [3, 9, 27, 81, 243],
            hops: ["×3", "×3", "×3", "×3"],
            patternDescription: "multiply by 3 each time",
            multiplier: 3,
            nextNumber: 729,
            options: ["486", "567", "648", "729", "810"],
            correctAnswer: "729",
            explanation: "Each number is multiplied by 3: 3, 9, 27, 81, 243 — so 243 × 3 = 729. When hops grow rapidly, think multiplication! ✓",
            // Interact-specific: ×4 series (2, 8, 32, 128, ? → 512)
            // Verify: 2×4=8 ✓, 8×4=32 ✓, 32×4=128 ✓, 128×4=512 ✓
            interactSeries: [2, 8, 32, 128],
            interactHops: ["×4", "×4", "×4"],
            interactMultiplier: 4,
            interactNextNumber: 512,
            interactOptions: ["256", "384", "448", "512", "640"],
            interactCorrectAnswer: "512",
            interactExplanation: "Each number is multiplied by 4: 2, 8, 32, 128 — so 128 × 4 = 512. ✓"
          },
          {
            // Series: 2, 10, 50, 250, ?
            // Pattern: ×5 each time → 1250
            // Verify: 2×5=10 ✓, 10×5=50 ✓, 50×5=250 ✓, 250×5=1250 ✓
            name: "Oliver",
            scenario: "puzzling over a series with huge jumps",
            series: [2, 10, 50, 250],
            hops: ["×5", "×5", "×5"],
            patternDescription: "multiply by 5 each time",
            multiplier: 5,
            nextNumber: 1250,
            options: ["500", "750", "1000", "1250", "1500"],
            correctAnswer: "1250",
            explanation: "Each number is multiplied by 5: 2, 10, 50, 250 — so 250 × 5 = 1250. The hops get much bigger because it's multiplying. ✓",
            // Interact-specific: ×3 series (5, 15, 45, 135, ? → 405)
            // Verify: 5×3=15 ✓, 15×3=45 ✓, 45×3=135 ✓, 135×3=405 ✓
            interactSeries: [5, 15, 45, 135],
            interactHops: ["×3", "×3", "×3"],
            interactMultiplier: 3,
            interactNextNumber: 405,
            interactOptions: ["270", "315", "375", "405", "450"],
            interactCorrectAnswer: "405",
            interactExplanation: "Each number is multiplied by 3: 5, 15, 45, 135 — so 135 × 3 = 405. ✓"
          },
          {
            // Series: 4, 12, 36, 108, ?
            // Pattern: ×3 each time → 324
            // Verify: 4×3=12 ✓, 12×3=36 ✓, 36×3=108 ✓, 108×3=324 ✓
            name: "Priya",
            scenario: "recognising a multiply pattern",
            series: [4, 12, 36, 108],
            hops: ["×3", "×3", "×3"],
            patternDescription: "multiply by 3 each time",
            multiplier: 3,
            nextNumber: 324,
            options: ["216", "252", "288", "324", "360"],
            correctAnswer: "324",
            explanation: "Each number is multiplied by 3: 4, 12, 36, 108 — so 108 × 3 = 324. Divide to check: 12÷4=3, 36÷12=3. ✓",
            // Interact-specific: ×2 series (7, 14, 28, 56, ? → 112)
            // Verify: 7×2=14 ✓, 14×2=28 ✓, 28×2=56 ✓, 56×2=112 ✓
            interactSeries: [7, 14, 28, 56],
            interactHops: ["×2", "×2", "×2"],
            interactMultiplier: 2,
            interactNextNumber: 112,
            interactOptions: ["84", "96", "104", "112", "120"],
            interactCorrectAnswer: "112",
            interactExplanation: "Each number doubles: 7, 14, 28, 56 — so 56 × 2 = 112. ✓"
          },
          {
            // Series: 6, 12, 24, 48, 96, ?
            // Pattern: ×2 each time → 192
            // Verify: 6×2=12 ✓, 12×2=24 ✓, 24×2=48 ✓, 48×2=96 ✓, 96×2=192 ✓
            name: "Finn",
            scenario: "spotting a doubling pattern",
            series: [6, 12, 24, 48, 96],
            hops: ["×2", "×2", "×2", "×2"],
            patternDescription: "multiply by 2 (double) each time",
            multiplier: 2,
            nextNumber: 192,
            options: ["128", "144", "168", "192", "204"],
            correctAnswer: "192",
            explanation: "Each number doubles: 6, 12, 24, 48, 96 — so 96 × 2 = 192. Doubling is the most common multiply pattern. ✓",
            // Interact-specific: ×3 series (1, 3, 9, 27, 81, ? → 243)
            // Verify: 1×3=3 ✓, 3×3=9 ✓, 9×3=27 ✓, 27×3=81 ✓, 81×3=243 ✓
            interactSeries: [1, 3, 9, 27, 81],
            interactHops: ["×3", "×3", "×3", "×3"],
            interactMultiplier: 3,
            interactNextNumber: 243,
            interactOptions: ["162", "189", "216", "243", "270"],
            interactCorrectAnswer: "243",
            interactExplanation: "Each number is multiplied by 3: 1, 3, 9, 27, 81 — so 81 × 3 = 243. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `These numbers are EXPLODING!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nWhoa, these numbers are growing FAST! When numbers shoot up like this, they might be **multiplying** rather than adding. Think of how quickly things grow when you keep doubling them — like folding a piece of paper!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Divide to find the multiplier",
            body: (v) => `The series **${v.series.join(', ')}** is growing fast. If the hops keep getting bigger, try **dividing** each number by the previous one. If you always get the same answer, it's a multiply pattern!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try dividing: ${v.series[1]} ÷ ${v.series[0]} = ${v.multiplier}`, why: "Divide the second by the first" },
                  { text: `Check: ${v.series[2]} ÷ ${v.series[1]} = ${v.multiplier}, ${v.series[3]} ÷ ${v.series[2]} = ${v.multiplier}`, why: "Same multiplier every time!" },
                  { text: `Apply: ${v.series[v.series.length - 1]} × ${v.multiplier} = ${v.nextNumber}`, why: `Multiply the last number by ${v.multiplier} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Constant difference", right: "Same number added each time" },
                { left: "Multiply pattern", right: "Same number multiplied each time" },
                { left: "Increasing hops", right: "The differences get bigger by a set amount" },
                { left: "Decreasing series", right: "Numbers go down — negative hops" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.interactSeries.join(", ")}, ___**\n\nThe pattern is: multiply by ${v.interactMultiplier} each time. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.interactSeries,
                differences: v.interactHops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Multiply patterns — you're unstoppable!",
            body: () => `When numbers grow FAST, you now know what to look for:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. If hops get rapidly bigger, try dividing", why: "Divide each number by the one before it" },
                  { text: "2. Same answer every time? It's a multiplier!", why: "×2 (doubling) and ×3 (tripling) are the most common" },
                  { text: "3. Multiply the last number to find the answer", why: "Same rule, one more time ✓" }
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
  // SUB-CONCEPT 5: Square Numbers
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: key-fact
  // ==========================================
  {
    id: "square-numbers",
    name: "Square Numbers",
    category: "supporting",
    lessons: [
      {
        id: "square-numbers-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot the famous square numbers (1, 4, 9, 16, 25...) — they pop up everywhere!",
          "A secret shortcut: the hops between square numbers always increase by exactly 2"
        ],
        variableSets: [
          {
            // Series: 1, 4, 9, 16, 25, ?
            // Squares: 1², 2², 3², 4², 5² → 6² = 36
            // Hops: +3, +5, +7, +9 → next +11 → 36
            // Verify: 1+3=4 ✓, 4+5=9 ✓, 9+7=16 ✓, 16+9=25 ✓, 25+11=36 ✓
            name: "Daisy",
            scenario: "spotting a famous number pattern",
            series: [1, 4, 9, 16, 25],
            squareRoots: ["1×1", "2×2", "3×3", "4×4", "5×5"],
            hops: ["+3", "+5", "+7", "+9"],
            hopPattern: "hops increase by 2 each time (odd numbers: 3, 5, 7, 9, 11)",
            nextSquare: "6×6",
            nextNumber: 36,
            options: ["30", "33", "36", "40", "49"],
            correctAnswer: "36",
            explanation: "These are square numbers: 1², 2², 3², 4², 5² — so next is 6² = 36. The hops between squares are always odd numbers: +3, +5, +7, +9, +11. ✓",
            // Interact-specific: 25, 36, 49, 64, 81, ? → 100 (5² to 10²)
            // Hops: +11, +13, +15, +17 → +19 → 100
            // Verify: 25+11=36 ✓, 36+13=49 ✓, 49+15=64 ✓, 64+17=81 ✓, 81+19=100 ✓
            interactSeries: [25, 36, 49, 64, 81],
            interactHops: ["+11", "+13", "+15", "+17"],
            interactNextNumber: 100,
            interactOptions: ["90", "95", "98", "100", "104"],
            interactCorrectAnswer: "100",
            interactExplanation: "Square numbers from 5²: 25, 36, 49, 64, 81 — next is 10² = 100. The hops (+11, +13, +15, +17, +19) always go up by 2. ✓"
          },
          {
            // Series: 4, 9, 16, 25, 36, ?
            // Squares: 2², 3², 4², 5², 6² → 7² = 49
            // Hops: +5, +7, +9, +11 → next +13 → 49
            // Verify: 4+5=9 ✓, 9+7=16 ✓, 16+9=25 ✓, 25+11=36 ✓, 36+13=49 ✓
            name: "Oliver",
            scenario: "recognising squares that don't start at 1",
            series: [4, 9, 16, 25, 36],
            squareRoots: ["2×2", "3×3", "4×4", "5×5", "6×6"],
            hops: ["+5", "+7", "+9", "+11"],
            hopPattern: "hops increase by 2 each time (odd numbers: 5, 7, 9, 11, 13)",
            nextSquare: "7×7",
            nextNumber: 49,
            options: ["42", "44", "47", "49", "52"],
            correctAnswer: "49",
            explanation: "Square numbers starting from 2²: 4, 9, 16, 25, 36 — next is 7² = 49. Hops: +5, +7, +9, +11, +13. ✓",
            // Interact-specific: 36, 49, 64, 81, 100, ? → 121 (6² to 11²)
            // Hops: +13, +15, +17, +19 → +21 → 121
            // Verify: 36+13=49 ✓, 49+15=64 ✓, 64+17=81 ✓, 81+19=100 ✓, 100+21=121 ✓
            interactSeries: [36, 49, 64, 81, 100],
            interactHops: ["+13", "+15", "+17", "+19"],
            interactNextNumber: 121,
            interactOptions: ["110", "115", "119", "121", "125"],
            interactCorrectAnswer: "121",
            interactExplanation: "Square numbers from 6²: 36, 49, 64, 81, 100 — next is 11² = 121. The hops always go up by 2. ✓"
          },
          {
            // Series: 9, 16, 25, 36, 49, ?
            // Squares: 3², 4², 5², 6², 7² → 8² = 64
            // Hops: +7, +9, +11, +13 → next +15 → 64
            // Verify: 9+7=16 ✓, 16+9=25 ✓, 25+11=36 ✓, 36+13=49 ✓, 49+15=64 ✓
            name: "Priya",
            scenario: "working out which squares these are",
            series: [9, 16, 25, 36, 49],
            squareRoots: ["3×3", "4×4", "5×5", "6×6", "7×7"],
            hops: ["+7", "+9", "+11", "+13"],
            hopPattern: "hops increase by 2 each time (odd numbers: 7, 9, 11, 13, 15)",
            nextSquare: "8×8",
            nextNumber: 64,
            options: ["56", "60", "62", "64", "68"],
            correctAnswer: "64",
            explanation: "Square numbers from 3²: 9, 16, 25, 36, 49 — next is 8² = 64. The hops (+7, +9, +11, +13, +15) always go up by 2. ✓",
            // Interact-specific: 49, 64, 81, 100, 121, ? → 144 (7² to 12²)
            // Hops: +15, +17, +19, +21 → +23 → 144
            // Verify: 49+15=64 ✓, 64+17=81 ✓, 81+19=100 ✓, 100+21=121 ✓, 121+23=144 ✓
            interactSeries: [49, 64, 81, 100, 121],
            interactHops: ["+15", "+17", "+19", "+21"],
            interactNextNumber: 144,
            interactOptions: ["132", "136", "140", "144", "150"],
            interactCorrectAnswer: "144",
            interactExplanation: "Square numbers from 7²: 49, 64, 81, 100, 121 — next is 12² = 144. The hops always go up by 2. ✓"
          },
          {
            // Series: 16, 25, 36, 49, 64, ?
            // Squares: 4², 5², 6², 7², 8² → 9² = 81
            // Hops: +9, +11, +13, +15 → next +17 → 81
            // Verify: 16+9=25 ✓, 25+11=36 ✓, 36+13=49 ✓, 49+15=64 ✓, 64+17=81 ✓
            name: "Finn",
            scenario: "spotting squares in a VR test",
            series: [16, 25, 36, 49, 64],
            squareRoots: ["4×4", "5×5", "6×6", "7×7", "8×8"],
            hops: ["+9", "+11", "+13", "+15"],
            hopPattern: "hops increase by 2 each time (odd numbers: 9, 11, 13, 15, 17)",
            nextSquare: "9×9",
            nextNumber: 81,
            options: ["72", "75", "78", "81", "84"],
            correctAnswer: "81",
            explanation: "Square numbers from 4²: 16, 25, 36, 49, 64 — next is 9² = 81. The hops always increase by 2. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot the squares?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\n**Did you know?** These are all **square numbers** — a number multiplied by itself (like 3x3=9). If you learn your squares off by heart, you'll spot these instantly in the exam and save loads of time!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Square numbers and their hops",
            body: (v) => `The series **${v.series.join(', ')}** is made of square numbers: ${v.squareRoots.join(', ')}. Square numbers have a secret: the hops between them are always **odd numbers** that go up by 2!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Squares: ${v.squareRoots.join(", ")}`, why: "Each number is something × itself" },
                  { text: `Hops: ${v.hops.join(", ")}`, why: v.hopPattern },
                  { text: `Next: ${v.nextSquare} = ${v.nextNumber}`, why: "The next square number in the sequence ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.series.join(", ")}, ___**\n\nThese are square numbers. What's next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: v.hops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Know your squares — instant exam marks!",
            body: () => `Learning these 12 square numbers is like having a cheat code for the test:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144", why: "1² to 12² — learn these by heart!" },
                  { text: "Hops between squares are odd: 3, 5, 7, 9, 11...", why: "They always increase by 2" },
                  { text: "If hops go up by 2 and are all odd → square numbers", why: "Quick shortcut to recognise them ✓" }
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
  // SUB-CONCEPT 6: Alternating Pattern
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "alternating-pattern",
    name: "Alternating Pattern",
    category: "supporting",
    lessons: [
      {
        id: "alternating-pattern-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when two rules are taking turns — like a zigzag!",
          "How writing out the hops instantly reveals the two hidden rules"
        ],
        variableSets: [
          {
            // Series: 5, 8, 6, 9, 7, ?
            // Hops: +3, -2, +3, -2 → next +3 → 10
            // Verify: 5+3=8 ✓, 8-2=6 ✓, 6+3=9 ✓, 9-2=7 ✓, 7+3=10 ✓
            name: "Daisy",
            scenario: "puzzling over a zigzag pattern",
            series: [5, 8, 6, 9, 7],
            hops: ["+3", "-2", "+3", "-2"],
            rule1: "+3",
            rule2: "-2",
            patternDescription: "alternating +3 then -2",
            nextHop: "+3",
            nextNumber: 10,
            options: ["5", "8", "9", "10", "12"],
            correctAnswer: "10",
            explanation: "The pattern alternates +3 then -2: 5, +3=8, -2=6, +3=9, -2=7, +3=10. Two rules taking turns! ✓"
          },
          {
            // Series: 10, 14, 11, 15, 12, ?
            // Hops: +4, -3, +4, -3 → next +4 → 16
            // Verify: 10+4=14 ✓, 14-3=11 ✓, 11+4=15 ✓, 15-3=12 ✓, 12+4=16 ✓
            name: "Oliver",
            scenario: "working out why a series keeps going up and down",
            series: [10, 14, 11, 15, 12],
            hops: ["+4", "-3", "+4", "-3"],
            rule1: "+4",
            rule2: "-3",
            patternDescription: "alternating +4 then -3",
            nextHop: "+4",
            nextNumber: 16,
            options: ["9", "13", "15", "16", "19"],
            correctAnswer: "16",
            explanation: "The pattern alternates +4 then -3: 10, +4=14, -3=11, +4=15, -3=12, +4=16. The numbers zigzag! ✓"
          },
          {
            // Series: 3, 9, 6, 12, 9, ?
            // Hops: +6, -3, +6, -3 → next +6 → 15
            // Verify: 3+6=9 ✓, 9-3=6 ✓, 6+6=12 ✓, 12-3=9 ✓, 9+6=15 ✓
            name: "Priya",
            scenario: "decoding a tricky alternating series",
            series: [3, 9, 6, 12, 9],
            hops: ["+6", "-3", "+6", "-3"],
            rule1: "+6",
            rule2: "-3",
            patternDescription: "alternating +6 then -3",
            nextHop: "+6",
            nextNumber: 15,
            options: ["6", "12", "13", "15", "18"],
            correctAnswer: "15",
            explanation: "The pattern alternates +6 then -3: 3, +6=9, -3=6, +6=12, -3=9, +6=15. ✓"
          },
          {
            // Series: 20, 25, 22, 27, 24, ?
            // Hops: +5, -3, +5, -3 → next +5 → 29
            // Verify: 20+5=25 ✓, 25-3=22 ✓, 22+5=27 ✓, 27-3=24 ✓, 24+5=29 ✓
            name: "Finn",
            scenario: "spotting the zigzag in a VR question",
            series: [20, 25, 22, 27, 24],
            hops: ["+5", "-3", "+5", "-3"],
            rule1: "+5",
            rule2: "-3",
            patternDescription: "alternating +5 then -3",
            nextHop: "+5",
            nextNumber: 29,
            options: ["21", "26", "27", "29", "32"],
            correctAnswer: "29",
            explanation: "The pattern alternates +5 then -3: 20, +5=25, -3=22, +5=27, -3=24, +5=29. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why does this series zigzag?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nHang on — the numbers go **up then down then up again**! This is really fun to crack. It means two rules are taking turns, like a game of ping-pong!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two rules, taking turns",
            body: (v) => `The series **${v.series.join(', ')}** zigzags because the hops alternate: **${v.rule1}** then **${v.rule2}**, over and over. Write out the hops to see the two rules!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Hops: ${v.hops.join(", ")}`, why: "Write out every hop" },
                  { text: `Rule 1: ${v.rule1} | Rule 2: ${v.rule2}`, why: "Two rules taking turns!" },
                  { text: `Next hop is ${v.nextHop}: ${v.series[v.series.length - 1]} ${v.nextHop} = ${v.nextNumber}`, why: "Which rule comes next? Apply it ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.series.join(", ")}, ___**\n\nThe pattern is ${v.patternDescription}. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: v.hops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Zigzag patterns — sorted!",
            body: () => `When numbers zigzag up and down, you now know the secret:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Write out ALL the hops", why: "You'll see two different values alternating" },
                  { text: "2. Spot the two rules", why: "e.g. +5, -3, +5, -3 — one rule adds, one subtracts" },
                  { text: "3. Work out which rule comes NEXT", why: "Odd positions use Rule 1, even positions use Rule 2 ✓" }
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
  // SUB-CONCEPT 7: Fibonacci-Like
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "fibonacci-like",
    name: "Fibonacci-Like Series",
    category: "other",
    lessons: [
      {
        id: "fibonacci-like-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot the Fibonacci rule — where each number is the SUM of the two before it",
          "A powerful trick: if nothing else works, try adding the last two numbers together!"
        ],
        variableSets: [
          {
            // Series: 1, 1, 2, 3, 5, 8, ?
            // Rule: each = sum of previous two → 5+8 = 13
            // Verify: 1+1=2 ✓, 1+2=3 ✓, 2+3=5 ✓, 3+5=8 ✓, 5+8=13 ✓
            name: "Daisy",
            scenario: "discovering a famous mathematical sequence",
            series: [1, 1, 2, 3, 5, 8],
            addPairs: ["1+1=2", "1+2=3", "2+3=5", "3+5=8"],
            patternDescription: "each number is the sum of the two before it",
            nextCalc: "5 + 8",
            nextNumber: 13,
            options: ["10", "11", "12", "13", "15"],
            correctAnswer: "13",
            explanation: "Each number is the sum of the previous two: 5 + 8 = 13. This is called the Fibonacci sequence! ✓"
          },
          {
            // Series: 2, 3, 5, 8, 13, ?
            // Rule: each = sum of previous two → 8+13 = 21
            // Verify: 2+3=5 ✓, 3+5=8 ✓, 5+8=13 ✓, 8+13=21 ✓
            name: "Oliver",
            scenario: "working on a series where the hops keep changing",
            series: [2, 3, 5, 8, 13],
            addPairs: ["2+3=5", "3+5=8", "5+8=13"],
            patternDescription: "each number is the sum of the two before it",
            nextCalc: "8 + 13",
            nextNumber: 21,
            options: ["18", "19", "20", "21", "23"],
            correctAnswer: "21",
            explanation: "Each number is the sum of the two before it: 8 + 13 = 21. A Fibonacci-like pattern starting from 2 and 3. ✓"
          },
          {
            // Series: 1, 3, 4, 7, 11, ?
            // Rule: each = sum of previous two → 7+11 = 18
            // Verify: 1+3=4 ✓, 3+4=7 ✓, 4+7=11 ✓, 7+11=18 ✓
            name: "Priya",
            scenario: "testing if a series follows the 'add the last two' rule",
            series: [1, 3, 4, 7, 11],
            addPairs: ["1+3=4", "3+4=7", "4+7=11"],
            patternDescription: "each number is the sum of the two before it",
            nextCalc: "7 + 11",
            nextNumber: 18,
            options: ["15", "16", "17", "18", "20"],
            correctAnswer: "18",
            explanation: "Each number is the sum of the two before it: 7 + 11 = 18. Even though it doesn't start with 1, 1, the same Fibonacci rule works. ✓"
          },
          {
            // Series: 2, 5, 7, 12, 19, ?
            // Rule: each = sum of previous two → 12+19 = 31
            // Verify: 2+5=7 ✓, 5+7=12 ✓, 7+12=19 ✓, 12+19=31 ✓
            name: "Finn",
            scenario: "cracking a Fibonacci-like code",
            series: [2, 5, 7, 12, 19],
            addPairs: ["2+5=7", "5+7=12", "7+12=19"],
            patternDescription: "each number is the sum of the two before it",
            nextCalc: "12 + 19",
            nextNumber: 31,
            options: ["26", "28", "29", "31", "33"],
            correctAnswer: "31",
            explanation: "Each number is the sum of the two before it: 12 + 19 = 31. The Fibonacci rule works with ANY starting pair! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Add the last two!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\n**Did you know?** This pattern was discovered by an Italian mathematician called Fibonacci over 800 years ago — and it appears everywhere in nature, from sunflower seeds to seashells! The hops are all different, but try adding the **last two numbers** together...`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Fibonacci rule",
            body: (v) => `In the series **${v.series.join(', ')}**, each number is the **sum of the two numbers before it**: ${v.addPairs[0]}. Check every trio!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Check: ${v.addPairs.join(", ")}`, why: "Every number = sum of the two before it!" },
                  { text: `Pattern: ${v.patternDescription}`, why: "This is the Fibonacci rule" },
                  { text: `Next: ${v.nextCalc} = ${v.nextNumber}`, why: "Add the last two numbers together ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.series.join(", ")}, ___**\n\nEach number is the sum of the previous two. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: v.hops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Fibonacci — your secret weapon!",
            body: () => `When hops keep changing and nothing else fits, this is your go-to trick:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try adding the last two numbers together", why: "Does that give the next number?" },
                  { text: "2. Check at least 3 trios to be sure", why: "a+b=c, b+c=d, c+d=e — all must work" },
                  { text: "3. If yes, add the last two for your answer", why: "The Fibonacci rule: add the two before ✓" }
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
  // SUB-CONCEPT 8: Two-Step Rule
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "two-step-rule",
    name: "Two-Step Rule",
    category: "other",
    lessons: [
      {
        id: "two-step-rule-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot when a series uses TWO operations together (like ×2 then +1) — sneaky!",
          "Why these patterns look almost like multiplication but are just slightly off"
        ],
        variableSets: [
          {
            // Series: 3, 7, 15, 31, 63, ?
            // Rule: ×2 then +1 → (63×2)+1 = 127
            // Verify: 3×2+1=7 ✓, 7×2+1=15 ✓, 15×2+1=31 ✓, 31×2+1=63 ✓, 63×2+1=127 ✓
            name: "Daisy",
            scenario: "facing a series that seems to multiply AND add",
            series: [3, 7, 15, 31, 63],
            rule: "×2 then +1",
            ruleSteps: ["3 ×2 = 6, then +1 = 7", "7 ×2 = 14, then +1 = 15", "15 ×2 = 30, then +1 = 31", "31 ×2 = 62, then +1 = 63"],
            nextCalc: "63 ×2 = 126, then +1 = 127",
            nextNumber: 127,
            options: ["95", "111", "125", "127", "131"],
            correctAnswer: "127",
            explanation: "The rule is ×2 then +1: 63 × 2 = 126, then 126 + 1 = 127. Two operations combine to make each step! ✓"
          },
          {
            // Series: 1, 3, 7, 15, 31, ?
            // Rule: ×2 then +1 → (31×2)+1 = 63
            // Verify: 1×2+1=3 ✓, 3×2+1=7 ✓, 7×2+1=15 ✓, 15×2+1=31 ✓, 31×2+1=63 ✓
            name: "Oliver",
            scenario: "testing whether a series doubles then adds",
            series: [1, 3, 7, 15, 31],
            rule: "×2 then +1",
            ruleSteps: ["1 ×2 = 2, then +1 = 3", "3 ×2 = 6, then +1 = 7", "7 ×2 = 14, then +1 = 15", "15 ×2 = 30, then +1 = 31"],
            nextCalc: "31 ×2 = 62, then +1 = 63",
            nextNumber: 63,
            options: ["47", "55", "62", "63", "65"],
            correctAnswer: "63",
            explanation: "The rule is ×2 then +1: 31 × 2 = 62, then 62 + 1 = 63. Each number is double-the-last-plus-one. ✓"
          },
          {
            // Series: 2, 5, 11, 23, 47, ?
            // Rule: ×2 then +1 → (47×2)+1 = 95
            // Verify: 2×2+1=5 ✓, 5×2+1=11 ✓, 11×2+1=23 ✓, 23×2+1=47 ✓, 47×2+1=95 ✓
            name: "Priya",
            scenario: "cracking a double-plus-one pattern",
            series: [2, 5, 11, 23, 47],
            rule: "×2 then +1",
            ruleSteps: ["2 ×2 = 4, then +1 = 5", "5 ×2 = 10, then +1 = 11", "11 ×2 = 22, then +1 = 23", "23 ×2 = 46, then +1 = 47"],
            nextCalc: "47 ×2 = 94, then +1 = 95",
            nextNumber: 95,
            options: ["85", "90", "93", "95", "99"],
            correctAnswer: "95",
            explanation: "The rule is ×2 then +1: 47 × 2 = 94, then 94 + 1 = 95. Recognise the 'double-plus-one' pattern! ✓"
          },
          {
            // Series: 1, 4, 13, 40, ?
            // Rule: ×3 then +1 → (40×3)+1 = 121
            // Verify: 1×3+1=4 ✓, 4×3+1=13 ✓, 13×3+1=40 ✓, 40×3+1=121 ✓
            name: "Finn",
            scenario: "working through the hardest series on the paper",
            series: [1, 4, 13, 40],
            rule: "×3 then +1",
            ruleSteps: ["1 ×3 = 3, then +1 = 4", "4 ×3 = 12, then +1 = 13", "13 ×3 = 39, then +1 = 40"],
            nextCalc: "40 ×3 = 120, then +1 = 121",
            nextNumber: 121,
            options: ["81", "100", "120", "121", "130"],
            correctAnswer: "121",
            explanation: "The rule is ×3 then +1: 40 × 3 = 120, then 120 + 1 = 121. When hops grow super-fast but don't match pure multiplication, try two operations! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `One rule isn't enough!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nThis is a clever one! The hops are growing fast (like multiplication) but pure multiplication doesn't quite fit. What if there are **two operations** hiding in each step? Let's find out!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two operations per step",
            body: (v) => `The series **${v.series.join(', ')}** uses a **two-step rule**: **${v.rule}**. Let's check how the two operations combine!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Rule: ${v.rule}`, why: "Two operations combine to make each new number" },
                  { text: `Check: ${v.ruleSteps[0]}`, why: "Does it work for the first pair?" },
                  { text: `Apply: ${v.nextCalc}`, why: "Same two operations on the last number ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Spot that the hops aren't constant — try a two-step rule`,
                `Test the rule on the first few pairs to confirm it works`,
                `Apply both operations to the last number to find the answer`
              ],
              feedback: {
                correct: (v) => `Perfect! Spot, test, then apply — that's how to crack two-step rules. ✓`,
                incorrect: (v) => `Not quite — first spot the pattern, then test it, then apply it to find the answer!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.series.join(", ")}, ___**\n\nThe rule is **${v.rule}**. What comes next?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: v.hops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two-step rules — now you know the trick!",
            body: () => `When one operation doesn't quite explain the pattern, try two:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try ×2 then +1 (the most common two-step rule)", why: "Double then add 1 — check if it fits" },
                  { text: "2. If not, try ×3+1, or ×2-1, or ×2+3", why: "Experiment with multiply-then-adjust" },
                  { text: "3. Check the rule works for EVERY pair", why: "If it works for all of them, you've cracked it ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "two-step-rule-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why being 'one off' is a telltale sign of a two-step rule",
          "How to spot when pure multiplication is almost right but needs a small tweak"
        ],
        variableSets: [
          {
            // Series: 3, 7, 15, 31, 63, ?
            // Wrong: ×2 → 126 (forgot the +1)
            // Correct: ×2+1 → 127
            // Verify: 63×2=126, 126+1=127 ✓
            name: "Evie",
            scenario: "checking why her answer was 1 out",
            series: [3, 7, 15, 31, 63],
            wrongAnswer: "126",
            wrongReason: "thought it was just ×2 (63 × 2 = 126)",
            realRule: "×2 then +1",
            realCalc: "63 × 2 = 126, then +1 = 127",
            nextNumber: 127,
            options: ["125", "126", "127", "128", "130"],
            correctAnswer: "127",
            explanation: "Pure ×2 gives 126, but the real rule is ×2+1, giving 127. Check: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127. ✓"
          },
          {
            // Series: 1, 4, 13, 40, ?
            // Wrong: ×3 → 120 (forgot the +1)
            // Correct: ×3+1 → 121
            // Verify: 40×3=120, 120+1=121 ✓
            name: "Marcus",
            scenario: "realising his answer was just 1 away from correct",
            series: [1, 4, 13, 40],
            wrongAnswer: "120",
            wrongReason: "thought it was just ×3 (40 × 3 = 120)",
            realRule: "×3 then +1",
            realCalc: "40 × 3 = 120, then +1 = 121",
            nextNumber: 121,
            options: ["119", "120", "121", "122", "123"],
            correctAnswer: "121",
            explanation: "Pure ×3 gives 120, but the rule is ×3+1, giving 121. Check: 1×3+1=4, 4×3+1=13, 13×3+1=40, 40×3+1=121. ✓"
          },
          {
            // Series: 2, 5, 11, 23, 47, ?
            // Wrong: ×2 → 94 (forgot the +1)
            // Correct: ×2+1 → 95
            // Verify: 47×2=94, 94+1=95 ✓
            name: "Aisha",
            scenario: "finding out why ×2 was almost right but not quite",
            series: [2, 5, 11, 23, 47],
            wrongAnswer: "94",
            wrongReason: "thought it was just ×2 (47 × 2 = 94)",
            realRule: "×2 then +1",
            realCalc: "47 × 2 = 94, then +1 = 95",
            nextNumber: 95,
            options: ["92", "93", "94", "95", "96"],
            correctAnswer: "95",
            explanation: "Pure ×2 gives 94, but the rule is ×2+1, giving 95. When your answer is exactly 1 off, add that +1 to the rule! ✓"
          },
          {
            // Series: 1, 3, 7, 15, 31, ?
            // Wrong: ×2 → 62 (forgot the +1)
            // Correct: ×2+1 → 63
            // Verify: 31×2=62, 62+1=63 ✓
            name: "Charlie",
            scenario: "learning from a near-miss on a practice paper",
            series: [1, 3, 7, 15, 31],
            wrongAnswer: "62",
            wrongReason: "thought it was just ×2 (31 × 2 = 62)",
            realRule: "×2 then +1",
            realCalc: "31 × 2 = 62, then +1 = 63",
            nextNumber: 63,
            options: ["60", "61", "62", "63", "64"],
            correctAnswer: "63",
            explanation: "Pure ×2 gives 62, but the rule is ×2+1, giving 63. Check all pairs: 1×2+1=3, 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why is the answer 1 off?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.series.join(", ")}, ___**\n\nSomeone answered **${v.wrongAnswer}** because they ${v.wrongReason}.\n\nBut pure multiplication doesn't quite work — the answer is always **1 too small**!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: [],
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Almost ×2? Try ×2+1!",
            body: (v) => `The series **${v.series.join(', ')}** looks like it multiplies, but pure multiplication gives **${v.wrongAnswer}** — which is wrong! When the answer is consistently off by a small amount, there's a **second operation** hiding!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong rule: just multiply → ${v.wrongAnswer}`, why: v.wrongReason },
                  { text: `Real rule: ${v.realRule}`, why: "There's a +1 (or -1) hiding after the multiplication!" },
                  { text: `Correct: ${v.realCalc}`, why: "The small adjustment makes all the difference ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Find the correct answer!",
            body: (v) => `**${v.series.join(", ")}, ___**\n\nThe rule is **${v.realRule}**. What's the right answer?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                differences: v.hops,
                showDifferences: true,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.correctAnswer}. ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Nearly right? Look for the hidden +1!",
            body: () => `This is such a useful trick for the exam. When pure multiplication is just 1 off:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Answer too small by 1? → the rule is ×n + 1", why: "Multiply, then add 1" },
                  { text: "Answer too big by 1? → the rule is ×n - 1", why: "Multiply, then subtract 1" },
                  { text: "Always verify against EVERY pair in the series", why: "The two-step rule must work for all of them ✓" }
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
  // SUB-CONCEPT: Middle Number Analogies
  // Category: core
  // Lesson: step-by-step
  // Format: A (B) C  — three triplets share the same rule
  // GL frequency: ~12 questions per 37-test CGP run (4-Q sections in 7 tests)
  // D1 focus: multiply outers, add outers
  // ==========================================
  {
    id: "middle-number-analogies",
    name: "Middle Number Analogies",
    category: "core",
    lessons: [
      {
        id: "middle-number-analogies-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot the rule that connects the outer two numbers to the middle number — the heart of every middle-number puzzle",
          "How to use the 'Check All Three' method: test your rule on every triplet before trusting it"
        ],
        variableSets: [
          {
            // RULE: multiply outers → middle
            // 3×6=18 ✓, 4×5=20 ✓, 2×6=12 ✓ — interact 5×7=35 ✓
            name: "Daisy",
            scenario: "working through a VR practice paper",
            teachLeft: [3, 4, 2],
            teachMiddle: [18, 20, 12],
            teachRight: [6, 5, 6],
            rule: "multiply",
            ruleSymbol: "×",
            ruleDescription: "multiply the outer numbers together",
            ruleRecipe: "outer × outer = middle",
            interactLeft: 5,
            interactRight: 7,
            interactAnswer: 35,
            interactOptions: ["30", "32", "35", "40", "42"],
            interactCorrectAnswer: "35",
            interactExplanation: "5 × 7 = 35. The rule is: multiply the two outer numbers to get the middle. ✓"
          },
          {
            // RULE: add outers → middle
            // 4+5=9 ✓, 7+3=10 ✓, 6+8=14 ✓ — interact 9+6=15 ✓
            name: "Oliver",
            scenario: "practising number puzzles at his desk",
            teachLeft: [4, 7, 6],
            teachMiddle: [9, 10, 14],
            teachRight: [5, 3, 8],
            rule: "add",
            ruleSymbol: "+",
            ruleDescription: "add the outer numbers together",
            ruleRecipe: "outer + outer = middle",
            interactLeft: 9,
            interactRight: 6,
            interactAnswer: 15,
            interactOptions: ["12", "13", "15", "18", "21"],
            interactCorrectAnswer: "15",
            interactExplanation: "9 + 6 = 15. The rule is: add the two outer numbers to get the middle. ✓"
          },
          {
            // RULE: multiply outers → middle (smaller numbers)
            // 2×4=8 ✓, 3×5=15 ✓, 4×6=24 ✓ — interact 3×8=24 ✓
            name: "Priya",
            scenario: "solving VR questions before school",
            teachLeft: [2, 3, 4],
            teachMiddle: [8, 15, 24],
            teachRight: [4, 5, 6],
            rule: "multiply",
            ruleSymbol: "×",
            ruleDescription: "multiply the outer numbers together",
            ruleRecipe: "outer × outer = middle",
            interactLeft: 3,
            interactRight: 8,
            interactAnswer: 24,
            interactOptions: ["18", "21", "24", "27", "32"],
            interactCorrectAnswer: "24",
            interactExplanation: "3 × 8 = 24. The rule is: multiply the two outer numbers to get the middle. ✓"
          },
          {
            // RULE: add outers → middle (larger numbers)
            // 8+7=15 ✓, 11+9=20 ✓, 6+13=19 ✓ — interact 12+7=19 ✓
            name: "Finn",
            scenario: "racing through a timed VR paper",
            teachLeft: [8, 11, 6],
            teachMiddle: [15, 20, 19],
            teachRight: [7, 9, 13],
            rule: "add",
            ruleSymbol: "+",
            ruleDescription: "add the outer numbers together",
            ruleRecipe: "outer + outer = middle",
            interactLeft: 12,
            interactRight: 7,
            interactAnswer: 19,
            interactOptions: ["15", "17", "19", "21", "24"],
            interactCorrectAnswer: "19",
            interactExplanation: "12 + 7 = 19. The rule is: add the two outer numbers to get the middle. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `What's hiding in the middle?`,
            body: (v) => `${v.name} is ${v.scenario} and spots this curious puzzle:\n\n**${v.teachLeft[0]} ( ${v.teachMiddle[0]} ) ${v.teachRight[0]}**\n\nThree numbers — but the middle one isn't just sitting there for decoration. It's the **answer to a secret rule** that uses the two outer numbers.\n\nYour mission: crack the rule, then use it to fill in a missing middle. **You've got this!**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Triplet 1:   ${v.teachLeft[0]}   (   ${v.teachMiddle[0]}   )   ${v.teachRight[0]}`, why: "The outer numbers somehow make the middle" },
                  { text: `Triplet 2:   ${v.teachLeft[1]}   (   ${v.teachMiddle[1]}   )   ${v.teachRight[1]}`, why: "Same rule should work here too" },
                  { text: `Triplet 3:   ${v.teachLeft[2]}   (   ${v.teachMiddle[2]}   )   ${v.teachRight[2]}`, why: "Confirm the pattern — then you're ready!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the rule, then check all three",
            body: (v) => `Let's crack triplet 1: **${v.teachLeft[0]} ( ${v.teachMiddle[0]} ) ${v.teachRight[0]}**. Could we **${v.ruleDescription}**? Let's test it — and if it works, we MUST check it on every triplet before we trust it.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try the rule on triplet 1: ${v.teachLeft[0]} ${v.ruleSymbol} ${v.teachRight[0]} = ${v.teachMiddle[0]}`, why: `That matches the middle — promising!` },
                  { text: `Check triplet 2: ${v.teachLeft[1]} ${v.ruleSymbol} ${v.teachRight[1]} = ${v.teachMiddle[1]}`, why: "Same rule, still works — getting confident!" },
                  { text: `Check triplet 3: ${v.teachLeft[2]} ${v.ruleSymbol} ${v.teachRight[2]} = ${v.teachMiddle[2]}`, why: `Three out of three — the rule is confirmed: **${v.ruleRecipe}** ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "order-steps",
              steps: () => [
                `Try a rule on the first triplet`,
                `Check that the same rule works on the other triplets`,
                `Apply the rule to find the missing middle number`
              ],
              feedback: {
                correct: () => `Spot on! Find a rule, check it on all three, THEN apply it. ✓`,
                incorrect: () => `Not quite — find a rule, check every triplet, then apply it last.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — find the middle!",
            body: (v) => `Here are three triplets that all follow the same rule:\n\n**${v.teachLeft[0]} ( ${v.teachMiddle[0]} ) ${v.teachRight[0]}**\n**${v.teachLeft[1]} ( ${v.teachMiddle[1]} ) ${v.teachRight[1]}**\n**${v.interactLeft} ( ? ) ${v.interactRight}**\n\nThe rule is: **${v.ruleRecipe}**. What's the missing middle number?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Triplet 1:   ${v.teachLeft[0]}   (   ${v.teachMiddle[0]}   )   ${v.teachRight[0]}`, why: `${v.teachLeft[0]} ${v.ruleSymbol} ${v.teachRight[0]} = ${v.teachMiddle[0]} ✓` },
                  { text: `Triplet 2:   ${v.teachLeft[1]}   (   ${v.teachMiddle[1]}   )   ${v.teachRight[1]}`, why: `${v.teachLeft[1]} ${v.ruleSymbol} ${v.teachRight[1]} = ${v.teachMiddle[1]} ✓` },
                  { text: `Triplet 3:   ${v.interactLeft}   (   ?   )   ${v.interactRight}`, why: `Apply the rule: ${v.interactLeft} ${v.ruleSymbol} ${v.interactRight} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The Middle Number Method — your recipe",
            body: () => `Three triplets, one secret rule. Here's the recipe you'll use every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look at the outer two numbers in triplet 1", why: "The middle is built from these" },
                  { text: "2. Try a rule — start with × or +", why: "Multiply and add are the most common" },
                  { text: "3. Check the rule on ALL three triplets", why: "If it works once, it must work every time ✓" },
                  { text: "4. Apply the rule to find the missing middle", why: "Same rule, one more time — you've cracked it!" }
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

];

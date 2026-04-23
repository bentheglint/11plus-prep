// ============================================================
// Supplementary sub-concepts for Letter Pair Series (Verbal Reasoning)
// To merge: add these to lessonBank.letterPairSeries.subConcepts array in lessonData.js
// Master method: "Split and Track" — split pairs into two rows, find each pattern, combine
// ============================================================

export const letterPairSeriesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Both Letters Forward
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "both-forward",
    name: "Both Letters Move Forward",
    category: "core",
    lessons: [
      {
        id: "both-forward-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when both letters in a pair march forward through the alphabet together",
          "Use the Split and Track method when both rows go the same direction"
        ],
        variableSets: [
          {
            // AC(1,3) BD(2,4) CE(3,5) DF(4,6) → EG(5,7)
            // First: 1,2,3,4 → 5 (+1 each time)
            // Second: 3,4,5,6 → 7 (+1 each time)
            name: "Daisy",
            scenario: "working through her VR practice booklet",
            series: ["AC", "BD", "CE", "DF"],
            nextPair: "EG",
            firstPattern: "A, B, C, D — goes up by 1 each time, so next is E",
            secondPattern: "C, D, E, F — goes up by 1 each time, so next is G",
            letterPositions: "First: 1, 2, 3, 4 → 5. Second: 3, 4, 5, 6 → 7",
            options: ["EG", "EF", "FG", "DG", "EH"],
            correctAnswer: "EG",
            explanation: "Both letters go forward by 1 each step. First row: A, B, C, D, E. Second row: C, D, E, F, G. Next pair = EG. ✓",
            // Interact: GI(7,9) HJ(8,10) IK(9,11) JL(10,12) → KM(11,13) — both +1
            interactSeries: ["GI", "HJ", "IK", "JL"],
            interactOptions: ["KM", "KL", "LM", "JM", "KN"],
            interactCorrectAnswer: "KM",
            interactExplanation: "Both letters go forward by 1. First row: G, H, I, J, K. Second row: I, J, K, L, M. Next pair = KM. ✓"
          },
          {
            // AB(1,2) BC(2,3) CD(3,4) DE(4,5) → EF(5,6)
            // First: 1,2,3,4 → 5 (+1)
            // Second: 2,3,4,5 → 6 (+1)
            name: "Oliver",
            scenario: "solving letter pair questions at his desk",
            series: ["AB", "BC", "CD", "DE"],
            nextPair: "EF",
            firstPattern: "A, B, C, D — goes up by 1, so next is E",
            secondPattern: "B, C, D, E — goes up by 1, so next is F",
            letterPositions: "First: 1, 2, 3, 4 → 5. Second: 2, 3, 4, 5 → 6",
            options: ["EF", "EG", "FG", "DF", "FH"],
            correctAnswer: "EF",
            explanation: "Both letters advance by 1 each step. First row: A, B, C, D, E. Second row: B, C, D, E, F. Next pair = EF. ✓",
            // Interact: FG(6,7) GH(7,8) HI(8,9) IJ(9,10) → JK(10,11) — both +1
            interactSeries: ["FG", "GH", "HI", "IJ"],
            interactOptions: ["JK", "JL", "KL", "IK", "KM"],
            interactCorrectAnswer: "JK",
            interactExplanation: "Both letters advance by 1. First row: F, G, H, I, J. Second row: G, H, I, J, K. Next pair = JK. ✓"
          },
          {
            // BF(2,6) CG(3,7) DH(4,8) EI(5,9) → FJ(6,10)
            // First: 2,3,4,5 → 6 (+1)
            // Second: 6,7,8,9 → 10 (+1)
            name: "Priya",
            scenario: "practising letter series during her revision session",
            series: ["BF", "CG", "DH", "EI"],
            nextPair: "FJ",
            firstPattern: "B, C, D, E — goes up by 1, so next is F",
            secondPattern: "F, G, H, I — goes up by 1, so next is J",
            letterPositions: "First: 2, 3, 4, 5 → 6. Second: 6, 7, 8, 9 → 10",
            options: ["FJ", "FK", "GJ", "EJ", "GK"],
            correctAnswer: "FJ",
            explanation: "Both letters go forward by 1. First row: B, C, D, E, F. Second row: F, G, H, I, J. Next pair = FJ. ✓",
            // Interact: DH(4,8) EI(5,9) FJ(6,10) GK(7,11) → HL(8,12) — both +1
            interactSeries: ["DH", "EI", "FJ", "GK"],
            interactOptions: ["HL", "HK", "IL", "GM", "HM"],
            interactCorrectAnswer: "HL",
            interactExplanation: "Both letters go forward by 1. First row: D, E, F, G, H. Second row: H, I, J, K, L. Next pair = HL. ✓"
          },
          {
            // MA(13,1) NB(14,2) OC(15,3) PD(16,4) → QE(17,5)
            // First: 13,14,15,16 → 17 (+1)
            // Second: 1,2,3,4 → 5 (+1)
            name: "Finn",
            scenario: "racing through a VR test paper",
            series: ["MA", "NB", "OC", "PD"],
            nextPair: "QE",
            firstPattern: "M, N, O, P — goes up by 1, so next is Q",
            secondPattern: "A, B, C, D — goes up by 1, so next is E",
            letterPositions: "First: 13, 14, 15, 16 → 17. Second: 1, 2, 3, 4 → 5",
            options: ["QE", "QF", "RE", "PE", "RF"],
            correctAnswer: "QE",
            explanation: "Both letters advance by 1. First row: M, N, O, P, Q. Second row: A, B, C, D, E. Next pair = QE. ✓",
            // Interact: RD(18,4) SE(19,5) TF(20,6) UG(21,7) → VH(22,8) — both +1
            interactSeries: ["RD", "SE", "TF", "UG"],
            interactOptions: ["VH", "VI", "WH", "UH", "WI"],
            interactCorrectAnswer: "VH",
            interactExplanation: "Both letters advance by 1. First row: R, S, T, U, V. Second row: D, E, F, G, H. Next pair = VH. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Both letters marching forward!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? Sometimes both letters in a pair go **forward** through the alphabet together — like two friends walking side by side! Split them into two rows and you'll see the pattern straight away.\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split and Track — both forward",
            body: (v) => `Let's split **${v.series.join(", ")}** into two rows. When both letters go forward, the pattern becomes obvious:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Count the hops between each letter" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Same direction — both going forward!" },
                  { text: `Combine: next pair = ${v.nextPair}`, why: v.letterPositions }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Split each pair into first letters and second letters`,
                `Find the pattern in each row separately`,
                `Apply the pattern to get the next letter in each row, then combine`
              ],
              feedback: {
                correct: (v) => `Perfect order! Split, find patterns, then combine. ✓`,
                incorrect: (v) => `Not quite — always split into two rows first!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use Split and Track to find the next pair:\n\n**${v.interactSeries.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Both forward — nailed it!",
            body: () => `When both letters move forward, it's one of the friendliest patterns:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Split pairs into two rows", why: "First letters in one row, second letters in another" },
                  { text: "2. Both rows count UP", why: "They go the same direction — just check the step size" },
                  { text: "3. Apply the step to each row and combine", why: "Easy once you can see it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "both-forward-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Understand why mixing up the two rows trips people up",
          "Avoid the classic trap of swapping first and second letter patterns"
        ],
        variableSets: [
          {
            // AD(1,4) BE(2,5) CF(3,6) DG(4,7) → EH(5,8)
            // First: 1,2,3,4 → 5 (+1). Second: 4,5,6,7 → 8 (+1)
            // Mistake: swapping rows to get HE instead of EH
            name: "Evie",
            scenario: "checking her friend's VR homework",
            series: ["AD", "BE", "CF", "DG"],
            nextPair: "EH",
            friendWrong: "HE",
            friendReason: "she mixed up which row was first and which was second",
            whyWrong: "The first letters are A, B, C, D (left side of each pair). The friend put the second-row answer first!",
            correctExplanation: "First row: A, B, C, D → E. Second row: D, E, F, G → H. Combine = EH, not HE.",
            options: ["EH", "HE", "FH", "EG", "DH"],
            correctAnswer: "EH",
            // Interact: FI(6,9) GJ(7,10) HK(8,11) IL(9,12) → JM(10,13) — both +1, gap 3
            interactSeries: ["FI", "GJ", "HK", "IL"],
            interactOptions: ["JM", "MJ", "KM", "JL", "IM"],
            interactCorrectAnswer: "JM",
            interactExplanation: "First row: F, G, H, I → J (+1). Second row: I, J, K, L → M (+1). Next pair = JM."
          },
          {
            // BG(2,7) CH(3,8) DI(4,9) EJ(5,10) → FK(6,11)
            // First: 2,3,4,5 → 6 (+1). Second: 7,8,9,10 → 11 (+1)
            // Mistake: wrote FJ (second letter stays same)
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            series: ["BG", "CH", "DI", "EJ"],
            nextPair: "FK",
            friendWrong: "FJ",
            friendReason: "he forgot to advance the second letter too",
            whyWrong: "He found the first pattern (B→C→D→E→F) but forgot the second letter also advances by 1 (G→H→I→J→K).",
            correctExplanation: "First row: B, C, D, E → F. Second row: G, H, I, J → K. Both advance by 1, so next = FK.",
            options: ["FK", "FJ", "GK", "EK", "GL"],
            correctAnswer: "FK",
            // Interact: HL(8,12) IM(9,13) JN(10,14) KO(11,15) → LP(12,16) — both +1, gap 4
            interactSeries: ["HL", "IM", "JN", "KO"],
            interactOptions: ["LP", "LO", "MP", "KP", "MQ"],
            interactCorrectAnswer: "LP",
            interactExplanation: "First row: H, I, J, K → L (+1). Second row: L, M, N, O → P (+1). Next pair = LP."
          },
          {
            // CE(3,5) DF(4,6) EG(5,7) FH(6,8) → GI(7,9)
            // First: 3,4,5,6 → 7 (+1). Second: 5,6,7,8 → 9 (+1)
            // Mistake: wrote GH (second letter copied from previous pair)
            name: "Aisha",
            scenario: "helping her brother with VR questions",
            series: ["CE", "DF", "EG", "FH"],
            nextPair: "GI",
            friendWrong: "GH",
            friendReason: "he just added 1 to the last pair's letters without splitting",
            whyWrong: "Adding 1 to F gives G and adding 1 to H gives I, not H. He wrote the H from the last pair by mistake.",
            correctExplanation: "First row: C, D, E, F → G. Second row: E, F, G, H → I. Next pair = GI.",
            options: ["GI", "GH", "HI", "FI", "HJ"],
            correctAnswer: "GI",
            // Interact: HJ(8,10) IK(9,11) JL(10,12) KM(11,13) → LN(12,14) — both +1, gap 2
            interactSeries: ["HJ", "IK", "JL", "KM"],
            interactOptions: ["LN", "LM", "MN", "KN", "MO"],
            interactCorrectAnswer: "LN",
            interactExplanation: "First row: H, I, J, K → L (+1). Second row: J, K, L, M → N (+1). Next pair = LN."
          },
          {
            // AE(1,5) BF(2,6) CG(3,7) DH(4,8) → EI(5,9)
            // First: 1,2,3,4 → 5 (+1). Second: 5,6,7,8 → 9 (+1)
            // Mistake: wrote EJ (second letter jumped +2)
            name: "Charlie",
            scenario: "going over his mock test results",
            series: ["AE", "BF", "CG", "DH"],
            nextPair: "EI",
            friendWrong: "EJ",
            friendReason: "he thought the second letter jumped by 2 instead of 1",
            whyWrong: "The second letters go E, F, G, H — that's +1 each time, not +2. So next is I, not J.",
            correctExplanation: "First row: A, B, C, D → E (+1). Second row: E, F, G, H → I (+1). Next = EI.",
            options: ["EI", "EJ", "FI", "DI", "FJ"],
            correctAnswer: "EI",
            // Interact: FJ(6,10) GK(7,11) HL(8,12) IM(9,13) → JN(10,14) — both +1, gap 4
            interactSeries: ["FJ", "GK", "HL", "IM"],
            interactOptions: ["JN", "JO", "KN", "IN", "KO"],
            interactCorrectAnswer: "JN",
            interactExplanation: "First row: F, G, H, I → J (+1). Second row: J, K, L, M → N (+1). Next pair = JN."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really the next pair?`,
            body: (v) => `${v.name} is ${v.scenario}. The answer given was **${v.friendWrong}** — ${v.friendReason}.\n\nSeries (a list of letters that follow a rule): **${v.series.join(", ")}, ??**\n\nBut is that right? Press Next to find out!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check each row carefully!",
            body: (v) => `${v.whyWrong}\n\nAlways split first, then check each row's pattern **separately**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong answer: ${v.friendWrong}`, why: v.friendReason },
                  { text: v.whyWrong, why: "The mistake" },
                  { text: `Correct answer: ${v.nextPair}`, why: v.correctExplanation }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Find the correct next pair!",
            body: (v) => `**${v.interactSeries.join(", ")}, ??**\n\nSplit into two rows and track each pattern:`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Now you won't fall for these!",
            body: () => `Watch out for these common mistakes with both-forward patterns:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Don't swap the two rows around", why: "First letter of each pair = first row, second letter = second row" },
                  { text: "Don't forget to advance BOTH letters", why: "Both rows have their own pattern — check each one" },
                  { text: "Don't guess the step size — count it!", why: "+1 and +2 look similar but give different answers ✓" }
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
  // SUB-CONCEPT 2: Opposite Directions
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "opposite-directions",
    name: "One Forward, One Backward",
    category: "core",
    lessons: [
      {
        id: "opposite-directions-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot the twist: one letter goes forward while the other goes backward!",
          "See why Split and Track is essential when letters head in opposite directions"
        ],
        variableSets: [
          {
            // AZ(1,26) BY(2,25) CX(3,24) DW(4,23) → EV(5,22)
            // First: 1,2,3,4 → 5 (+1). Second: 26,25,24,23 → 22 (-1)
            name: "Daisy",
            scenario: "solving letter pair puzzles",
            series: ["AZ", "BY", "CX", "DW"],
            nextPair: "EV",
            firstPattern: "A, B, C, D — goes forward by 1, so next is E",
            secondPattern: "Z, Y, X, W — goes backward by 1, so next is V",
            letterPositions: "First: 1, 2, 3, 4 → 5. Second: 26, 25, 24, 23 → 22",
            options: ["EV", "EU", "FV", "EW", "DV"],
            correctAnswer: "EV",
            explanation: "First letters go forward: A, B, C, D, E (+1). Second letters go backward: Z, Y, X, W, V (-1). Next pair = EV. ✓",
            // Interact: FU(6,21) GT(7,20) HS(8,19) IR(9,18) → JQ(10,17) — first +1, second -1
            interactSeries: ["FU", "GT", "HS", "IR"],
            interactOptions: ["JQ", "JP", "KQ", "IQ", "JR"],
            interactCorrectAnswer: "JQ",
            interactExplanation: "First letters go forward: F, G, H, I, J (+1). Second letters go backward: U, T, S, R, Q (-1). Next pair = JQ. ✓"
          },
          {
            // ZA(26,1) YB(25,2) XC(24,3) WD(23,4) → VE(22,5)
            // First: 26,25,24,23 → 22 (-1). Second: 1,2,3,4 → 5 (+1)
            name: "Oliver",
            scenario: "working through a tricky VR section",
            series: ["ZA", "YB", "XC", "WD"],
            nextPair: "VE",
            firstPattern: "Z, Y, X, W — goes backward by 1, so next is V",
            secondPattern: "A, B, C, D — goes forward by 1, so next is E",
            letterPositions: "First: 26, 25, 24, 23 → 22. Second: 1, 2, 3, 4 → 5",
            options: ["VE", "VF", "UE", "WE", "UD"],
            correctAnswer: "VE",
            explanation: "First letters go backward: Z, Y, X, W, V (-1). Second letters go forward: A, B, C, D, E (+1). Next pair = VE. ✓",
            // Interact: UF(21,6) TG(20,7) SH(19,8) RI(18,9) → QJ(17,10) — first -1, second +1
            interactSeries: ["UF", "TG", "SH", "RI"],
            interactOptions: ["QJ", "QK", "PJ", "RJ", "QI"],
            interactCorrectAnswer: "QJ",
            interactExplanation: "First letters go backward: U, T, S, R, Q (-1). Second letters go forward: F, G, H, I, J (+1). Next pair = QJ. ✓"
          },
          {
            // BZ(2,26) CY(3,25) DX(4,24) EW(5,23) → FV(6,22)
            // First: 2,3,4,5 → 6 (+1). Second: 26,25,24,23 → 22 (-1)
            name: "Priya",
            scenario: "tackling opposite-direction series",
            series: ["BZ", "CY", "DX", "EW"],
            nextPair: "FV",
            firstPattern: "B, C, D, E — goes forward by 1, so next is F",
            secondPattern: "Z, Y, X, W — goes backward by 1, so next is V",
            letterPositions: "First: 2, 3, 4, 5 → 6. Second: 26, 25, 24, 23 → 22",
            options: ["FV", "FW", "GV", "EU", "FU"],
            correctAnswer: "FV",
            explanation: "First letters go forward: B, C, D, E, F (+1). Second letters go backward: Z, Y, X, W, V (-1). Next pair = FV. ✓",
            // Interact: GU(7,21) HT(8,20) IS(9,19) JR(10,18) → KQ(11,17) — first +1, second -1
            interactSeries: ["GU", "HT", "IS", "JR"],
            interactOptions: ["KQ", "KR", "LQ", "JP", "KP"],
            interactCorrectAnswer: "KQ",
            interactExplanation: "First letters go forward: G, H, I, J, K (+1). Second letters go backward: U, T, S, R, Q (-1). Next pair = KQ. ✓"
          },
          {
            // YA(25,1) XB(24,2) WC(23,3) VD(22,4) → UE(21,5)
            // First: 25,24,23,22 → 21 (-1). Second: 1,2,3,4 → 5 (+1)
            name: "Finn",
            scenario: "doing his timed VR practice",
            series: ["YA", "XB", "WC", "VD"],
            nextPair: "UE",
            firstPattern: "Y, X, W, V — goes backward by 1, so next is U",
            secondPattern: "A, B, C, D — goes forward by 1, so next is E",
            letterPositions: "First: 25, 24, 23, 22 → 21. Second: 1, 2, 3, 4 → 5",
            options: ["UE", "TE", "UF", "VE", "UD"],
            correctAnswer: "UE",
            explanation: "First letters go backward: Y, X, W, V, U (-1). Second letters go forward: A, B, C, D, E (+1). Next pair = UE. ✓",
            // Interact: TF(20,6) SG(19,7) RH(18,8) QI(17,9) → PJ(16,10) — first -1, second +1
            interactSeries: ["TF", "SG", "RH", "QI"],
            interactOptions: ["PJ", "PK", "OJ", "QJ", "PI"],
            interactCorrectAnswer: "PJ",
            interactExplanation: "First letters go backward: T, S, R, Q, P (-1). Second letters go forward: F, G, H, I, J (+1). Next pair = PJ. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "They're heading opposite ways!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's the twist: one letter goes **forward** while the other goes **backward** — like two people on an escalator going in opposite directions! That's why splitting into two rows is so important.\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split and Track — opposite directions",
            body: (v) => `Let's split **${v.series.join(", ")}**. The two letters are heading in **opposite** directions — this is the most common pattern in letter pair series (a list of letter pairs that follow a rule)!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Track this row separately" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Going the OTHER way!" },
                  { text: `Combine: next pair = ${v.nextPair}`, why: v.letterPositions }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Split and Track — watch out for opposite directions:\n\n**${v.interactSeries.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Opposite directions — sorted!",
            body: () => `This is actually the most common pattern in the exam, so knowing it gives you a real advantage:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Split pairs into two rows", why: "First letters and second letters" },
                  { text: "2. Check: is each row going UP or DOWN?", why: "They often go in opposite directions" },
                  { text: "3. Apply the correct direction to each row", why: "Forward for one, backward for the other ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "opposite-directions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why assuming both letters go the same way leads to wrong answers",
          "How to double-check direction for each row"
        ],
        variableSets: [
          {
            // AZ(1,26) BY(2,25) CX(3,24) DW(4,23) → EV(5,22)
            // Mistake: EX (assumed second also goes forward)
            name: "Evie",
            scenario: "reviewing her friend's answer",
            series: ["AZ", "BY", "CX", "DW"],
            nextPair: "EV",
            friendWrong: "EX",
            friendReason: "she assumed both letters go forward",
            whyWrong: "The first letter does go forward (A→B→C→D→E), but the second goes BACKWARD (Z→Y→X→W→V), not forward.",
            correctExplanation: "First row: A, B, C, D → E (+1). Second row: Z, Y, X, W → V (-1). Next = EV, not EX.",
            options: ["EV", "EX", "FV", "EU", "DV"],
            correctAnswer: "EV",
            // Interact: GU(7,21) HT(8,20) IS(9,19) JR(10,18) → KQ(11,17) — first +1, second -1
            interactSeries: ["GU", "HT", "IS", "JR"],
            interactOptions: ["KQ", "KS", "LQ", "JP", "KP"],
            interactCorrectAnswer: "KQ",
            interactExplanation: "First row: G, H, I, J → K (+1). Second row: U, T, S, R → Q (-1). Next = KQ."
          },
          {
            // ZA(26,1) YB(25,2) XC(24,3) WD(23,4) → VE(22,5)
            // Mistake: VD (forgot to advance second letter)
            name: "Marcus",
            scenario: "checking his practice paper",
            series: ["ZA", "YB", "XC", "WD"],
            nextPair: "VE",
            friendWrong: "VD",
            friendReason: "he found V correctly but copied D from the last pair",
            whyWrong: "The second letters go A, B, C, D — that's +1 each time, so next is E, not D again.",
            correctExplanation: "First row: Z, Y, X, W → V (-1). Second row: A, B, C, D → E (+1). Next = VE.",
            options: ["VE", "VD", "UE", "VF", "WE"],
            correctAnswer: "VE",
            // Interact: SF(19,6) RG(18,7) QH(17,8) PI(16,9) → OJ(15,10) — first -1, second +1
            interactSeries: ["SF", "RG", "QH", "PI"],
            interactOptions: ["OJ", "OF", "NJ", "PJ", "OK"],
            interactCorrectAnswer: "OJ",
            interactExplanation: "First row: S, R, Q, P → O (-1). Second row: F, G, H, I → J (+1). Next = OJ."
          },
          {
            // BZ(2,26) CY(3,25) DX(4,24) EW(5,23) → FV(6,22)
            // Mistake: FX (assumed second goes +1 from W)
            name: "Aisha",
            scenario: "helping her sister with a VR test",
            series: ["BZ", "CY", "DX", "EW"],
            nextPair: "FV",
            friendWrong: "FX",
            friendReason: "she thought W goes forward to X",
            whyWrong: "The second letters go Z, Y, X, W — they're going BACKWARD, not forward. After W comes V, not X.",
            correctExplanation: "First row: B, C, D, E → F (+1). Second row: Z, Y, X, W → V (-1). Next = FV.",
            options: ["FV", "FX", "FW", "GV", "EU"],
            correctAnswer: "FV",
            // Interact: HU(8,21) IT(9,20) JS(10,19) KR(11,18) → LQ(12,17) — first +1, second -1
            interactSeries: ["HU", "IT", "JS", "KR"],
            interactOptions: ["LQ", "LS", "MQ", "KQ", "LP"],
            interactCorrectAnswer: "LQ",
            interactExplanation: "First row: H, I, J, K → L (+1). Second row: U, T, S, R → Q (-1). Next = LQ."
          },
          {
            // YA(25,1) XB(24,2) WC(23,3) VD(22,4) → UE(21,5)
            // Mistake: UF (jumped second letter by +2)
            name: "Charlie",
            scenario: "double-checking a tricky series",
            series: ["YA", "XB", "WC", "VD"],
            nextPair: "UE",
            friendWrong: "UF",
            friendReason: "he thought the second letter went up by 2",
            whyWrong: "The second letters go A, B, C, D — that's +1 each time (not +2), so next is E.",
            correctExplanation: "First row: Y, X, W, V → U (-1). Second row: A, B, C, D → E (+1). Next = UE.",
            options: ["UE", "UF", "TE", "VE", "UD"],
            correctAnswer: "UE",
            // Interact: RG(18,7) QH(17,8) PI(16,9) OJ(15,10) → NK(14,11) — first -1, second +1
            interactSeries: ["RG", "QH", "PI", "OJ"],
            interactOptions: ["NK", "NL", "MK", "OK", "NJ"],
            interactCorrectAnswer: "NK",
            interactExplanation: "First row: R, Q, P, O → N (-1). Second row: G, H, I, J → K (+1). Next = NK."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" the right answer?`,
            body: (v) => `${v.name} is ${v.scenario}. The answer given was **${v.friendWrong}** — ${v.friendReason}.\n\nSeries: **${v.series.join(", ")}, ??**\n\nBut is that right?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check each row's direction!",
            body: (v) => `${v.whyWrong}\n\nAlways check: is each row going **up** or **down**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.friendWrong}`, why: v.friendReason },
                  { text: v.whyWrong, why: "Always check direction separately" },
                  { text: `Correct: ${v.nextPair}`, why: v.correctExplanation }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Both letters in a pair always go in the same direction`, answer: false, explanation: `Not always! One letter often goes forward while the other goes backward. ✓` },
                { text: `You should check each row's direction separately`, answer: true, explanation: `Correct — never assume both rows go the same way. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the correct answer!",
            body: (v) => `**${v.interactSeries.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectAnswer}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You know the trap — and you'll avoid it!",
            body: () => `The biggest trap in letter pair series, and how to dodge it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Never assume both rows go the same way", why: "One forward + one backward is the most common pattern" },
                  { text: "Check direction for each row separately", why: "A, B, C = forward. Z, Y, X = backward" },
                  { text: "Then apply the right step to each", why: "Get both letters right before combining ✓" }
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
  // SUB-CONCEPT 3: Skip-One Pattern
  // Category: core
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "skip-one-pattern",
    name: "Skip-One Jumps (+2 or -2)",
    category: "core",
    lessons: [
      {
        id: "skip-one-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when letters skip one position — jumping by 2 instead of 1",
          "Use Split and Track with +2 or -2 step patterns confidently"
        ],
        variableSets: [
          {
            // AC(1,3) CE(3,5) EG(5,7) GI(7,9) → IK(9,11)
            // First: 1,3,5,7 → 9 (+2). Second: 3,5,7,9 → 11 (+2)
            name: "Grace",
            scenario: "practising skip-one letter patterns",
            series: ["AC", "CE", "EG", "GI"],
            nextPair: "IK",
            firstPattern: "A, C, E, G — skips one each time (+2), so next is I",
            secondPattern: "C, E, G, I — skips one each time (+2), so next is K",
            letterPositions: "First: 1, 3, 5, 7 → 9. Second: 3, 5, 7, 9 → 11",
            options: ["IK", "IJ", "HK", "JK", "HJ"],
            correctAnswer: "IK",
            explanation: "Both letters skip one (+2). First row: A, C, E, G, I. Second row: C, E, G, I, K. Next pair = IK. ✓",
            // Interact: MO(13,15) OQ(15,17) QS(17,19) SU(19,21) → UW(21,23) — both +2
            interactSeries: ["MO", "OQ", "QS", "SU"],
            interactOptions: ["UW", "UV", "VW", "TW", "UX"],
            interactCorrectAnswer: "UW",
            interactExplanation: "Both letters skip one (+2). First row: M, O, Q, S, U. Second row: O, Q, S, U, W. Next pair = UW. ✓"
          },
          {
            // BZ(2,26) DX(4,24) FV(6,22) HT(8,20) → JR(10,18)
            // First: 2,4,6,8 → 10 (+2). Second: 26,24,22,20 → 18 (-2)
            name: "Kai",
            scenario: "solving a challenging skip-pattern series",
            series: ["BZ", "DX", "FV", "HT"],
            nextPair: "JR",
            firstPattern: "B, D, F, H — skips one forward (+2), so next is J",
            secondPattern: "Z, X, V, T — skips one backward (-2), so next is R",
            letterPositions: "First: 2, 4, 6, 8 → 10. Second: 26, 24, 22, 20 → 18",
            options: ["JR", "IS", "KQ", "JT", "IR"],
            correctAnswer: "JR",
            explanation: "First letters skip +2: B, D, F, H, J. Second letters skip -2: Z, X, V, T, R. Next pair = JR. ✓",
            // Interact: DY(4,25) FW(6,23) HU(8,21) JS(10,19) → LQ(12,17) — first +2, second -2
            interactSeries: ["DY", "FW", "HU", "JS"],
            interactOptions: ["LQ", "KR", "LR", "LS", "MQ"],
            interactCorrectAnswer: "LQ",
            interactExplanation: "First letters skip +2: D, F, H, J, L. Second letters skip -2: Y, W, U, S, Q. Next pair = LQ. ✓"
          },
          {
            // AZ(1,26) CX(3,24) EV(5,22) GT(7,20) → IR(9,18)
            // First: 1,3,5,7 → 9 (+2). Second: 26,24,22,20 → 18 (-2)
            name: "Priya",
            scenario: "working through a skip-two series",
            series: ["AZ", "CX", "EV", "GT"],
            nextPair: "IR",
            firstPattern: "A, C, E, G — skips one forward (+2), so next is I",
            secondPattern: "Z, X, V, T — skips one backward (-2), so next is R",
            letterPositions: "First: 1, 3, 5, 7 → 9. Second: 26, 24, 22, 20 → 18",
            options: ["IR", "IS", "HR", "JR", "HS"],
            correctAnswer: "IR",
            explanation: "First letters skip +2: A, C, E, G, I. Second letters skip -2: Z, X, V, T, R. Next pair = IR. ✓",
            // Interact: EW(5,23) GU(7,21) IS(9,19) KQ(11,17) → MO(13,15) — first +2, second -2
            interactSeries: ["EW", "GU", "IS", "KQ"],
            interactOptions: ["MO", "MP", "NO", "LO", "MN"],
            interactCorrectAnswer: "MO",
            interactExplanation: "First letters skip +2: E, G, I, K, M. Second letters skip -2: W, U, S, Q, O. Next pair = MO. ✓"
          },
          {
            // BD(2,4) DF(4,6) FH(6,8) HJ(8,10) → JL(10,12)
            // First: 2,4,6,8 → 10 (+2). Second: 4,6,8,10 → 12 (+2)
            name: "Finn",
            scenario: "tackling a series where both letters skip",
            series: ["BD", "DF", "FH", "HJ"],
            nextPair: "JL",
            firstPattern: "B, D, F, H — skips one forward (+2), so next is J",
            secondPattern: "D, F, H, J — skips one forward (+2), so next is L",
            letterPositions: "First: 2, 4, 6, 8 → 10. Second: 4, 6, 8, 10 → 12",
            options: ["JL", "JK", "IK", "KL", "IL"],
            correctAnswer: "JL",
            explanation: "Both letters skip +2. First row: B, D, F, H, J. Second row: D, F, H, J, L. Next pair = JL. ✓",
            // Interact: LN(12,14) NP(14,16) PR(16,18) RT(18,20) → TV(20,22) — both +2
            interactSeries: ["LN", "NP", "PR", "RT"],
            interactOptions: ["TV", "TU", "SV", "UV", "TW"],
            interactCorrectAnswer: "TV",
            interactExplanation: "Both letters skip +2. First row: L, N, P, R, T. Second row: N, P, R, T, V. Next pair = TV. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "These letters are skipping!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nInstead of moving one letter at a time, these pairs **skip one** — jumping by 2 positions each step! It's like going up stairs two at a time.\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split and Track — skip patterns",
            body: (v) => `Let's split **${v.series.join(", ")}**. When letters skip one, each row jumps by **2 positions** instead of 1:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Jumping by 2 (skipping one letter)" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Check: is it +2 or -2?" },
                  { text: `Combine: next pair = ${v.nextPair}`, why: v.letterPositions }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When letters skip one position each time, the step size is ____`,
              options: (v) => ["+2", "+1", "+3", "+4"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Skipping one letter means the gap is +2 (or -2 going backward). ✓`,
                incorrect: (v) => `Not quite — skipping one letter means jumping by 2, not 1!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the next pair — remember, these skip one!\n\n**${v.interactSeries.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Skip patterns — you've got this!",
            body: () => `When letters skip one position, just follow the same steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Split pairs into two rows", why: "Same first step as always!" },
                  { text: "2. Count the gap: A→C = skip 1 = +2", why: "B is skipped, so A to C is +2" },
                  { text: "3. Apply +2 (or -2) to find the next letter", why: "Skip-one forward or skip-one backward ✓" }
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
  // SUB-CONCEPT 4: Constant Gap
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "constant-gap",
    name: "Same Gap in Every Pair",
    category: "supporting",
    lessons: [
      {
        id: "constant-gap-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Discover the constant gap — a brilliant shortcut hiding inside many series",
          "Use the gap as a quick double-check to make sure your answer is right"
        ],
        variableSets: [
          {
            // AD(1,4) BE(2,5) CF(3,6) DG(4,7) → EH(5,8)
            // Gap: 4-1=3, 5-2=3, 6-3=3, 7-4=3 → 8-5=3. Constant gap of 3.
            // First: +1 each time. Second: +1 each time.
            name: "Daisy",
            scenario: "noticing something special about the pairs",
            series: ["AD", "BE", "CF", "DG"],
            nextPair: "EH",
            firstPattern: "A, B, C, D — goes up by 1, so next is E",
            secondPattern: "D, E, F, G — goes up by 1, so next is H",
            letterPositions: "Gap in each pair: D-A=3, E-B=3, F-C=3, G-D=3 → H-E=3",
            gap: 3,
            gapDescription: "Every pair has a gap of 3 between its letters",
            options: ["EH", "EG", "FH", "EI", "DH"],
            correctAnswer: "EH",
            explanation: "Both letters advance by 1, keeping a constant gap of 3. A-D, B-E, C-F, D-G, E-H. Next pair = EH. ✓",
            // Interact: GL(7,12) HM(8,13) IN(9,14) JO(10,15) → KP(11,16) — both +1, gap 5
            interactSeries: ["GL", "HM", "IN", "JO"],
            interactGap: 5,
            interactOptions: ["KP", "KQ", "LP", "JN", "KO"],
            interactCorrectAnswer: "KP",
            interactExplanation: "Both letters advance by 1, keeping a constant gap of 5. G-L, H-M, I-N, J-O, K-P. Next pair = KP. ✓"
          },
          {
            // AE(1,5) BF(2,6) CG(3,7) DH(4,8) → EI(5,9)
            // Gap: 5-1=4, 6-2=4, 7-3=4, 8-4=4 → 9-5=4. Constant gap of 4.
            name: "Oliver",
            scenario: "spotting a constant gap pattern",
            series: ["AE", "BF", "CG", "DH"],
            nextPair: "EI",
            firstPattern: "A, B, C, D — goes up by 1, so next is E",
            secondPattern: "E, F, G, H — goes up by 1, so next is I",
            letterPositions: "Gap in each pair: E-A=4, F-B=4, G-C=4, H-D=4 → I-E=4",
            gap: 4,
            gapDescription: "Every pair has a gap of 4 between its letters",
            options: ["EI", "EJ", "FI", "EH", "FJ"],
            correctAnswer: "EI",
            explanation: "Both letters advance by 1. The gap between first and second letter is always 4. Next pair = EI. ✓",
            // Interact: FI(6,9) GJ(7,10) HK(8,11) IL(9,12) → JM(10,13) — both +1, gap 3
            interactSeries: ["FI", "GJ", "HK", "IL"],
            interactGap: 3,
            interactOptions: ["JM", "JN", "KM", "JL", "KN"],
            interactCorrectAnswer: "JM",
            interactExplanation: "Both letters advance by 1 with a constant gap of 3. F-I, G-J, H-K, I-L, J-M. Next pair = JM. ✓"
          },
          {
            // CG(3,7) DH(4,8) EI(5,9) FJ(6,10) → GK(7,11)
            // Gap: 7-3=4, 8-4=4, 9-5=4, 10-6=4 → 11-7=4. Constant gap of 4.
            name: "Priya",
            scenario: "practising gap patterns in her revision",
            series: ["CG", "DH", "EI", "FJ"],
            nextPair: "GK",
            firstPattern: "C, D, E, F — goes up by 1, so next is G",
            secondPattern: "G, H, I, J — goes up by 1, so next is K",
            letterPositions: "Gap in each pair: G-C=4, H-D=4, I-E=4, J-F=4 → K-G=4",
            gap: 4,
            gapDescription: "Every pair has a gap of 4 between its letters",
            options: ["GK", "GL", "HK", "GJ", "HL"],
            correctAnswer: "GK",
            explanation: "Both letters advance by 1, maintaining a gap of 4. C-G, D-H, E-I, F-J, G-K. Next pair = GK. ✓",
            // Interact: HM(8,13) IN(9,14) JO(10,15) KP(11,16) → LQ(12,17) — both +1, gap 5
            interactSeries: ["HM", "IN", "JO", "KP"],
            interactGap: 5,
            interactOptions: ["LQ", "LR", "MQ", "KQ", "MR"],
            interactCorrectAnswer: "LQ",
            interactExplanation: "Both letters advance by 1, maintaining a gap of 5. H-M, I-N, J-O, K-P, L-Q. Next pair = LQ. ✓"
          },
          {
            // BG(2,7) CH(3,8) DI(4,9) EJ(5,10) → FK(6,11)
            // Gap: 7-2=5, 8-3=5, 9-4=5, 10-5=5 → 11-6=5. Constant gap of 5.
            name: "Finn",
            scenario: "solving a gap-of-5 series",
            series: ["BG", "CH", "DI", "EJ"],
            nextPair: "FK",
            firstPattern: "B, C, D, E — goes up by 1, so next is F",
            secondPattern: "G, H, I, J — goes up by 1, so next is K",
            letterPositions: "Gap in each pair: G-B=5, H-C=5, I-D=5, J-E=5 → K-F=5",
            gap: 5,
            gapDescription: "Every pair has a gap of 5 between its letters",
            options: ["FK", "FL", "GK", "FJ", "GL"],
            correctAnswer: "FK",
            explanation: "Both letters advance by 1 with a constant gap of 5. B-G, C-H, D-I, E-J, F-K. Next pair = FK. ✓",
            // Interact: DJ(4,10) EK(5,11) FL(6,12) GM(7,13) → HN(8,14) — both +1, gap 6
            interactSeries: ["DJ", "EK", "FL", "GM"],
            interactGap: 6,
            interactOptions: ["HN", "HO", "IN", "GN", "IO"],
            interactCorrectAnswer: "HN",
            interactExplanation: "Both letters advance by 1 with a constant gap of 6. D-J, E-K, F-L, G-M, H-N. Next pair = HN. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Spot the hidden gap!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a really neat trick: look at each pair — the **gap** between the first and second letter is **always the same**!\n\n**${v.series.join(", ")}, ??**\n\n${v.gapDescription}. You can use this to double-check your answer!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The constant gap shortcut",
            body: (v) => `Look at **${v.series.join(", ")}** — every pair has a gap of **${v.gap}** between its letters. You can use this to double-check your answer:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Find the next first letter" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Find the next second letter" },
                  { text: `Check: gap of ${v.gap} between ${v.nextPair[0]} and ${v.nextPair[1]}?`, why: `Yes! ${v.letterPositions} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the next pair — check the gap stays the same:\n\n**${v.interactSeries.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.interactSeries.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "The constant gap — your checking superpower!",
            body: () => `The constant gap is a brilliant way to double-check answers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Count the gap between letters in each pair", why: "A to D = gap of 3, B to E = gap of 3" },
                  { text: "2. If the gap is the same every time, it's constant", why: "This means both rows advance at the same rate" },
                  { text: "3. Check your answer has the same gap", why: "Quick way to verify you haven't made an error ✓" }
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
  // SUB-CONCEPT 5: Alternating Pattern
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "alternating-pattern",
    name: "Alternating Step Sizes",
    category: "supporting",
    lessons: [
      {
        id: "alternating-pattern-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Handle the trickiest type: when each row uses a different step size",
          "See why Split and Track always works, even when the steps don't match"
        ],
        variableSets: [
          {
            // AF(1,6) BH(2,8) CJ(3,10) DL(4,12) → EN(5,14)
            // First: 1,2,3,4 → 5 (+1 each time)
            // Second: 6,8,10,12 → 14 (+2 each time)
            // The "alternating" feel: first letter +1, second letter +2
            name: "Daisy",
            scenario: "working out a trickier letter pair series",
            series: ["AF", "BH", "CJ", "DL"],
            nextPair: "EN",
            firstPattern: "A, B, C, D — goes up by 1, so next is E",
            secondPattern: "F, H, J, L — goes up by 2, so next is N",
            letterPositions: "First: 1, 2, 3, 4 → 5 (+1). Second: 6, 8, 10, 12 → 14 (+2)",
            options: ["EN", "EM", "FM", "DN", "FN"],
            correctAnswer: "EN",
            explanation: "First letters advance by 1: A, B, C, D, E. Second letters advance by 2: F, H, J, L, N. Different step sizes! Next = EN. ✓",
            // Interact: GM(7,13) HO(8,15) IQ(9,17) JS(10,19) → KU(11,21) — first +1, second +2
            interactSeries: ["GM", "HO", "IQ", "JS"],
            interactOptions: ["KU", "KT", "LU", "JU", "KV"],
            interactCorrectAnswer: "KU",
            interactExplanation: "First letters advance by 1: G, H, I, J, K. Second letters advance by 2: M, O, Q, S, U. Different steps! Next = KU. ✓"
          },
          {
            // CE(3,5) DG(4,7) EI(5,9) FK(6,11) → GM(7,13)
            // First: 3,4,5,6 → 7 (+1). Second: 5,7,9,11 → 13 (+2)
            name: "Oliver",
            scenario: "puzzling over mismatched step sizes",
            series: ["CE", "DG", "EI", "FK"],
            nextPair: "GM",
            firstPattern: "C, D, E, F — goes up by 1, so next is G",
            secondPattern: "E, G, I, K — goes up by 2, so next is M",
            letterPositions: "First: 3, 4, 5, 6 → 7 (+1). Second: 5, 7, 9, 11 → 13 (+2)",
            options: ["GM", "GL", "HM", "GN", "HL"],
            correctAnswer: "GM",
            explanation: "First letters advance by 1: C, D, E, F, G. Second letters advance by 2: E, G, I, K, M. Next pair = GM. ✓",
            // Interact: HJ(8,10) IL(9,12) JN(10,14) KP(11,16) → LR(12,18) — first +1, second +2
            interactSeries: ["HJ", "IL", "JN", "KP"],
            interactOptions: ["LR", "LQ", "MR", "KR", "LS"],
            interactCorrectAnswer: "LR",
            interactExplanation: "First letters advance by 1: H, I, J, K, L. Second letters advance by 2: J, L, N, P, R. Next pair = LR. ✓"
          },
          {
            // BZ(2,26) DY(4,25) FX(6,24) HW(8,23) → JV(10,22)
            // First: 2,4,6,8 → 10 (+2). Second: 26,25,24,23 → 22 (-1)
            name: "Priya",
            scenario: "tackling different step sizes going different ways",
            series: ["BZ", "DY", "FX", "HW"],
            nextPair: "JV",
            firstPattern: "B, D, F, H — skips one forward (+2), so next is J",
            secondPattern: "Z, Y, X, W — goes backward by 1, so next is V",
            letterPositions: "First: 2, 4, 6, 8 → 10 (+2). Second: 26, 25, 24, 23 → 22 (-1)",
            options: ["JV", "IW", "JW", "IV", "KV"],
            correctAnswer: "JV",
            explanation: "First letters skip +2: B, D, F, H, J. Second letters go -1: Z, Y, X, W, V. Different steps! Next = JV. ✓"
          },
          {
            // ZA(26,1) XC(24,3) VE(22,5) TG(20,7) → RI(18,9)
            // First: 26,24,22,20 → 18 (-2). Second: 1,3,5,7 → 9 (+2)
            name: "Finn",
            scenario: "finding two different skip patterns",
            series: ["ZA", "XC", "VE", "TG"],
            nextPair: "RI",
            firstPattern: "Z, X, V, T — skips backward (-2), so next is R",
            secondPattern: "A, C, E, G — skips forward (+2), so next is I",
            letterPositions: "First: 26, 24, 22, 20 → 18 (-2). Second: 1, 3, 5, 7 → 9 (+2)",
            options: ["RI", "SI", "RH", "SH", "RJ"],
            correctAnswer: "RI",
            explanation: "First letters skip -2: Z, X, V, T, R. Second letters skip +2: A, C, E, G, I. Both skip but opposite! Next = RI. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Two different step sizes!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a twist that catches a lot of people out: the first and second letters don't move by the **same amount**. One might jump by 1 while the other jumps by 2! But once you split them into rows, the pattern becomes clear.\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Track each row's step size",
            body: (v) => `Let's split **${v.series.join(", ")}**. The key: each row can have its **own step size**. Don't assume they're the same!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Count the gap in THIS row" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Count the gap in THIS row — it might be different!" },
                  { text: `Combine: next pair = ${v.nextPair}`, why: v.letterPositions }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find each row's step size separately:\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Different steps — no problem!",
            body: () => `When each row has a different step size, the same method still works:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Split into two rows as always", why: "Never skip this step!" },
                  { text: "2. Count the gap in EACH row separately", why: "First row might be +1, second row might be +2" },
                  { text: "3. Don't assume they match", why: "+1 and +2, or +2 and -1 — anything is possible ✓" }
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
  // SUB-CONCEPT 6: Reverse Alphabet (Second Letter)
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "reverse-alphabet",
    name: "Counting Back from Z",
    category: "supporting",
    lessons: [
      {
        id: "reverse-alphabet-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Recognise when the second letter is counting backward from Z",
          "Use a quick trick to spot these patterns instantly"
        ],
        variableSets: [
          {
            // AZ(1,26) BX(2,24) CV(3,22) DT(4,20) → ER(5,18)
            // First: 1,2,3,4 → 5 (+1). Second: 26,24,22,20 → 18 (-2)
            name: "Daisy",
            scenario: "spotting a countdown from Z",
            series: ["AZ", "BX", "CV", "DT"],
            nextPair: "ER",
            firstPattern: "A, B, C, D — goes forward by 1, so next is E",
            secondPattern: "Z, X, V, T — counts back by 2 from Z, so next is R",
            letterPositions: "First: 1, 2, 3, 4 → 5. Second: 26, 24, 22, 20 → 18",
            options: ["ER", "ES", "FR", "DR", "ET"],
            correctAnswer: "ER",
            explanation: "First letters go +1: A, B, C, D, E. Second letters count back by 2 from Z: Z, X, V, T, R. Next = ER. ✓"
          },
          {
            // AZ(1,26) BY(2,25) CX(3,24) DW(4,23) → EV(5,22)
            // First: 1,2,3,4 → 5 (+1). Second: 26,25,24,23 → 22 (-1)
            name: "Oliver",
            scenario: "tracking a steady countdown from Z",
            series: ["AZ", "BY", "CX", "DW"],
            nextPair: "EV",
            firstPattern: "A, B, C, D — goes forward by 1, so next is E",
            secondPattern: "Z, Y, X, W — counts back by 1 from Z, so next is V",
            letterPositions: "First: 1, 2, 3, 4 → 5. Second: 26, 25, 24, 23 → 22",
            options: ["EV", "EU", "FV", "EW", "DV"],
            correctAnswer: "EV",
            explanation: "First letters go +1: A, B, C, D, E. Second letters count back by 1: Z, Y, X, W, V. Next = EV. ✓"
          },
          {
            // BZ(2,26) DW(4,23) FT(6,20) HQ(8,17) → JN(10,14)
            // First: 2,4,6,8 → 10 (+2). Second: 26,23,20,17 → 14 (-3)
            name: "Priya",
            scenario: "finding a skip-back-3 pattern from Z",
            series: ["BZ", "DW", "FT", "HQ"],
            nextPair: "JN",
            firstPattern: "B, D, F, H — skips forward (+2), so next is J",
            secondPattern: "Z, W, T, Q — counts back by 3, so next is N",
            letterPositions: "First: 2, 4, 6, 8 → 10. Second: 26, 23, 20, 17 → 14",
            options: ["JN", "JO", "IN", "KN", "JP"],
            correctAnswer: "JN",
            explanation: "First letters skip +2: B, D, F, H, J. Second letters go -3: Z(26), W(23), T(20), Q(17), N(14). Next = JN. ✓"
          },
          {
            // CZ(3,26) DY(4,25) EX(5,24) FW(6,23) → GV(7,22)
            // First: 3,4,5,6 → 7 (+1). Second: 26,25,24,23 → 22 (-1)
            name: "Finn",
            scenario: "racing through reverse-alphabet questions",
            series: ["CZ", "DY", "EX", "FW"],
            nextPair: "GV",
            firstPattern: "C, D, E, F — goes forward by 1, so next is G",
            secondPattern: "Z, Y, X, W — counts back by 1, so next is V",
            letterPositions: "First: 3, 4, 5, 6 → 7. Second: 26, 25, 24, 23 → 22",
            options: ["GV", "GW", "HV", "FV", "GU"],
            correctAnswer: "GV",
            explanation: "First letters go +1: C, D, E, F, G. Second letters count back: Z, Y, X, W, V (-1). Next = GV. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Z, Y, X, W... a countdown!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nWhen you spot **Z** as the starting second letter, that's a big clue! The second row is often counting **backward** through the alphabet — like a countdown.\n\n**${v.series.join(", ")}, ??**\n\nThe question is: how fast is it counting back?`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Backwards from Z",
            body: (v) => `Let's split **${v.series.join(", ")}**. When the second letter starts near Z and goes down, count the step size:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Going forward as usual" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Counting backward — check the step!" },
                  { text: `Combine: next pair = ${v.nextPair}`, why: v.letterPositions }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "First letter row", right: "Going forward (A→B→C...)" },
                { left: "Second letter row", right: "Counting backward from Z" },
                { left: "Step size", right: "Count the gap between letters" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Watch for the backward count:\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Countdown from Z — easy to spot!",
            body: () => `When the second letter counts back from Z, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Spot the clue: second letters start at/near Z", why: "Z, Y, X... or Z, X, V... or Z, W, T..." },
                  { text: "2. Count the step size backward", why: "-1 (every letter), -2 (skip one), -3 (skip two)" },
                  { text: "3. Apply that step to find the next second letter", why: "Then combine with the first letter ✓" }
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
  // SUB-CONCEPT 7: Double Jump (+3 or more)
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "double-jump",
    name: "Big Jumps (+3 or More)",
    category: "other",
    lessons: [
      {
        id: "double-jump-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Handle bigger jumps of 3 or more positions without breaking a sweat",
          "Use the numbers trick to make big jumps easy to count"
        ],
        variableSets: [
          {
            // AD(1,4) DG(4,7) GJ(7,10) JM(10,13) → MP(13,16)
            // First: 1,4,7,10 → 13 (+3). Second: 4,7,10,13 → 16 (+3)
            name: "Daisy",
            scenario: "tackling a bigger-jump series",
            series: ["AD", "DG", "GJ", "JM"],
            nextPair: "MP",
            firstPattern: "A, D, G, J — jumps by 3, so next is M",
            secondPattern: "D, G, J, M — jumps by 3, so next is P",
            letterPositions: "First: 1, 4, 7, 10 → 13 (+3). Second: 4, 7, 10, 13 → 16 (+3)",
            options: ["MP", "MO", "NP", "LO", "MQ"],
            correctAnswer: "MP",
            explanation: "Both letters jump by 3. First: A(1), D(4), G(7), J(10), M(13). Second: D(4), G(7), J(10), M(13), P(16). Next = MP. ✓"
          },
          {
            // AZ(1,26) DW(4,23) GT(7,20) JQ(10,17) → MN(13,14)
            // First: 1,4,7,10 → 13 (+3). Second: 26,23,20,17 → 14 (-3)
            name: "Oliver",
            scenario: "solving a double +3 jump series",
            series: ["AZ", "DW", "GT", "JQ"],
            nextPair: "MN",
            firstPattern: "A, D, G, J — jumps forward by 3, so next is M",
            secondPattern: "Z, W, T, Q — jumps backward by 3, so next is N",
            letterPositions: "First: 1, 4, 7, 10 → 13 (+3). Second: 26, 23, 20, 17 → 14 (-3)",
            options: ["MN", "MO", "LN", "NO", "MP"],
            correctAnswer: "MN",
            explanation: "First letters jump +3: A(1), D(4), G(7), J(10), M(13). Second jump -3: Z(26), W(23), T(20), Q(17), N(14). Next = MN. ✓"
          },
          {
            // BE(2,5) FI(6,9) JM(10,13) NQ(14,17) → RU(18,21)
            // First: 2,6,10,14 → 18 (+4). Second: 5,9,13,17 → 21 (+4)
            name: "Priya",
            scenario: "working through a jump-by-4 series",
            series: ["BE", "FI", "JM", "NQ"],
            nextPair: "RU",
            firstPattern: "B, F, J, N — jumps by 4, so next is R",
            secondPattern: "E, I, M, Q — jumps by 4, so next is U",
            letterPositions: "First: 2, 6, 10, 14 → 18 (+4). Second: 5, 9, 13, 17 → 21 (+4)",
            options: ["RU", "RT", "SU", "QU", "RV"],
            correctAnswer: "RU",
            explanation: "Both letters jump by 4. First: B(2), F(6), J(10), N(14), R(18). Second: E(5), I(9), M(13), Q(17), U(21). Next = RU. ✓"
          },
          {
            // CZ(3,26) FW(6,23) IT(9,20) LQ(12,17) → ON(15,14)
            // First: 3,6,9,12 → 15 (+3). Second: 26,23,20,17 → 14 (-3)
            name: "Finn",
            scenario: "cracking a +3/-3 jump series",
            series: ["CZ", "FW", "IT", "LQ"],
            nextPair: "ON",
            firstPattern: "C, F, I, L — jumps forward by 3, so next is O",
            secondPattern: "Z, W, T, Q — jumps backward by 3, so next is N",
            letterPositions: "First: 3, 6, 9, 12 → 15 (+3). Second: 26, 23, 20, 17 → 14 (-3)",
            options: ["ON", "OO", "PN", "OM", "NM"],
            correctAnswer: "ON",
            explanation: "First letters jump +3: C(3), F(6), I(9), L(12), O(15). Second jump -3: Z(26), W(23), T(20), Q(17), N(14). Next = ON. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Taking bigger leaps!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nSome series have letters that jump by **3 or more** positions at a time. That can feel tricky — but here's a great trick: convert letters to **numbers** (A=1, B=2, ...) and suddenly it's just adding and subtracting!\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Convert to numbers for big jumps",
            body: (v) => `Let's work through **${v.series.join(", ")}**. When the jump is +3 or more, it helps to write each letter as its **alphabet number**:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Let's work through **${v.series.join(", ")}**. When the jump is big, convert letters to numbers using the alphabet line:` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.map(p => p[0]).map(l => ({ letter: l, color: "#7C3AED" })).concat(
                  v.series.map(p => p[1]).map(l => ({ letter: l, color: "#22c55e" }))
                )
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: v.letterPositions.split(". ")[0] },
                  { text: `Second letters: ${v.secondPattern}`, why: v.letterPositions.split(". ")[1] },
                  { text: `Combine: next pair = ${v.nextPair}`, why: "Convert the number back to a letter ✓" }
                ],
                allRevealed: true
              })}
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When letters jump by 3 or more, convert them to ____ to make counting easier`,
              options: (v) => ["numbers", "colours", "shapes", "words"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Converting letters to numbers (A=1, B=2... Z=26) makes big jumps much easier to count. ✓`,
                incorrect: (v) => `Not quite — convert letters to numbers (A=1, B=2...) for big jumps!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Try converting to numbers:\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Big jumps — no worries!",
            body: () => `When letters jump by 3 or more, just use numbers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Convert letters to numbers (A=1, Z=26)", why: "Makes big gaps easier to count" },
                  { text: "2. Find the step size in each row", why: "+3, +4, -3 — whatever the pattern is" },
                  { text: "3. Add the step, convert back to a letter", why: "13=M, 14=N, 15=O, 16=P ✓" }
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
  // SUB-CONCEPT 8: Mirror Pairs (Positions Add to 27)
  // Category: other
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "mirror-pairs",
    name: "Mirror Pairs (Add to 27)",
    category: "other",
    lessons: [
      {
        id: "mirror-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Discover the magic of mirror pairs — where letter positions always add to 27!",
          "Learn why A+Z=27, B+Y=27, C+X=27, and use it as a checking shortcut"
        ],
        variableSets: [
          {
            // AZ: 1+26=27. BY: 2+25=27. CX: 3+24=27. DW: 4+23=27. → EV: 5+22=27.
            // First: 1,2,3,4 → 5 (+1). Second: 26,25,24,23 → 22 (-1)
            name: "Daisy",
            scenario: "discovering the mirror pair trick",
            series: ["AZ", "BY", "CX", "DW"],
            nextPair: "EV",
            firstPattern: "A(1), B(2), C(3), D(4) — next is E(5)",
            secondPattern: "Z(26), Y(25), X(24), W(23) — next is V(22)",
            letterPositions: "1+26=27, 2+25=27, 3+24=27, 4+23=27 → 5+22=27",
            mirrorCheck: "Every pair adds to 27: A+Z, B+Y, C+X, D+W, E+V",
            options: ["EV", "EU", "FV", "EW", "DV"],
            correctAnswer: "EV",
            explanation: "These are mirror pairs — positions always add to 27. A(1)+Z(26)=27, B(2)+Y(25)=27, ... E(5)+V(22)=27. Next = EV. ✓"
          },
          {
            // DW: 4+23=27. EV: 5+22=27. FU: 6+21=27. GT: 7+20=27. → HS: 8+19=27.
            // First: 4,5,6,7 → 8 (+1). Second: 23,22,21,20 → 19 (-1)
            name: "Oliver",
            scenario: "checking if the mirror rule works",
            series: ["DW", "EV", "FU", "GT"],
            nextPair: "HS",
            firstPattern: "D(4), E(5), F(6), G(7) — next is H(8)",
            secondPattern: "W(23), V(22), U(21), T(20) — next is S(19)",
            letterPositions: "4+23=27, 5+22=27, 6+21=27, 7+20=27 → 8+19=27",
            mirrorCheck: "Every pair adds to 27: D+W, E+V, F+U, G+T, H+S",
            options: ["HS", "HT", "IS", "GS", "HR"],
            correctAnswer: "HS",
            explanation: "Mirror pairs! D(4)+W(23)=27, E(5)+V(22)=27, ... H(8)+S(19)=27. Next = HS. ✓"
          },
          {
            // FU: 6+21=27. GT: 7+20=27. HS: 8+19=27. IR: 9+18=27. → JQ: 10+17=27.
            // First: 6,7,8,9 → 10 (+1). Second: 21,20,19,18 → 17 (-1)
            name: "Priya",
            scenario: "practising mirror pairs in the middle of the alphabet",
            series: ["FU", "GT", "HS", "IR"],
            nextPair: "JQ",
            firstPattern: "F(6), G(7), H(8), I(9) — next is J(10)",
            secondPattern: "U(21), T(20), S(19), R(18) — next is Q(17)",
            letterPositions: "6+21=27, 7+20=27, 8+19=27, 9+18=27 → 10+17=27",
            mirrorCheck: "Every pair adds to 27: F+U, G+T, H+S, I+R, J+Q",
            options: ["JQ", "JP", "KQ", "IR", "JR"],
            correctAnswer: "JQ",
            explanation: "Mirror pairs with constant sum of 27. F(6)+U(21)=27, ... J(10)+Q(17)=27. Next = JQ. ✓"
          },
          {
            // BY: 2+25=27. CX: 3+24=27. DW: 4+23=27. EV: 5+22=27. → FU: 6+21=27.
            // First: 2,3,4,5 → 6 (+1). Second: 25,24,23,22 → 21 (-1)
            name: "Finn",
            scenario: "using the add-to-27 shortcut",
            series: ["BY", "CX", "DW", "EV"],
            nextPair: "FU",
            firstPattern: "B(2), C(3), D(4), E(5) — next is F(6)",
            secondPattern: "Y(25), X(24), W(23), V(22) — next is U(21)",
            letterPositions: "2+25=27, 3+24=27, 4+23=27, 5+22=27 → 6+21=27",
            mirrorCheck: "Every pair adds to 27: B+Y, C+X, D+W, E+V, F+U",
            options: ["FU", "FV", "GU", "ET", "FT"],
            correctAnswer: "FU",
            explanation: "Mirror pairs! B(2)+Y(25)=27, C(3)+X(24)=27, ... F(6)+U(21)=27. Next = FU. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The magic number 27!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? There's a magic number hiding in the alphabet! In some series, the **positions of the two letters always add to 27**:\n\nA=1, Z=26 → 1+26 = **27**\nB=2, Y=25 → 2+25 = **27**\n\nOnce you know this trick, you can check your answers instantly!\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Mirror pairs — add to 27",
            body: (v) => `Look at **${v.series.join(", ")}**. The alphabet has 26 letters. A mirror pair uses letters from **opposite ends**: A↔Z, B↔Y, C↔X...`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Goes forward" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Goes backward — it's the mirror!" },
                  { text: `Check: ${v.letterPositions}`, why: "Every pair adds to 27 ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the next first letter using the forward pattern`,
                `Find the next second letter using the backward pattern`,
                `Check: do the two positions add to 27?`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find both letters, then verify with the 27 check. ✓`,
                incorrect: (v) => `Not quite — find each letter first, then check they add to 27!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use the add-to-27 shortcut:\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "Mirror pairs — a brilliant shortcut!",
            body: () => `The add-to-27 trick is one of the neatest shortcuts in VR:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A+Z=27, B+Y=27, C+X=27 ...", why: "Letters from opposite ends of the alphabet" },
                  { text: "To find the mirror: 27 minus the position", why: "E=5 → mirror is 27-5=22=V" },
                  { text: "Use this to CHECK your Split and Track answer", why: "If the pair doesn't add to 27, something's wrong ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "mirror-pairs-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "Spot mirror pairs quickly even when they skip — the 27 rule still works!",
          "Use the mirror check as a speed tool in timed tests"
        ],
        variableSets: [
          {
            // AZ: 1+26=27. CX: 3+24=27. EV: 5+22=27. GT: 7+20=27. → IR: 9+18=27.
            // First: 1,3,5,7 → 9 (+2). Second: 26,24,22,20 → 18 (-2)
            // Still adds to 27 even with +2/-2 step
            name: "Evie",
            scenario: "discovering that mirror pairs can skip too",
            series: ["AZ", "CX", "EV", "GT"],
            nextPair: "IR",
            firstPattern: "A(1), C(3), E(5), G(7) — skips by 2, next is I(9)",
            secondPattern: "Z(26), X(24), V(22), T(20) — skips back by 2, next is R(18)",
            letterPositions: "1+26=27, 3+24=27, 5+22=27, 7+20=27 → 9+18=27",
            mirrorCheck: "Still mirror pairs! Each adds to 27, but they skip by 2",
            options: ["IR", "IS", "HR", "JR", "IT"],
            correctAnswer: "IR",
            explanation: "Skip-mirror! First +2: A, C, E, G, I. Second -2: Z, X, V, T, R. Every pair still adds to 27. Next = IR. ✓"
          },
          {
            // BY: 2+25=27. DW: 4+23=27. FU: 6+21=27. HS: 8+19=27. → JQ: 10+17=27.
            // First: 2,4,6,8 → 10 (+2). Second: 25,23,21,19 → 17 (-2)
            name: "Marcus",
            scenario: "testing the 27 rule on a skip series",
            series: ["BY", "DW", "FU", "HS"],
            nextPair: "JQ",
            firstPattern: "B(2), D(4), F(6), H(8) — skips by 2, next is J(10)",
            secondPattern: "Y(25), W(23), U(21), S(19) — skips back by 2, next is Q(17)",
            letterPositions: "2+25=27, 4+23=27, 6+21=27, 8+19=27 → 10+17=27",
            mirrorCheck: "Every pair adds to 27 — mirror pairs with a skip of 2",
            options: ["JQ", "JP", "KQ", "IQ", "JR"],
            correctAnswer: "JQ",
            explanation: "Skip-mirror! First +2: B, D, F, H, J. Second -2: Y, W, U, S, Q. All add to 27. Next = JQ. ✓"
          },
          {
            // CX: 3+24=27. EV: 5+22=27. GT: 7+20=27. IR: 9+18=27. → KP: 11+16=27.
            // First: 3,5,7,9 → 11 (+2). Second: 24,22,20,18 → 16 (-2)
            name: "Aisha",
            scenario: "using the 27 shortcut to save time",
            series: ["CX", "EV", "GT", "IR"],
            nextPair: "KP",
            firstPattern: "C(3), E(5), G(7), I(9) — skips by 2, next is K(11)",
            secondPattern: "X(24), V(22), T(20), R(18) — skips back by 2, next is P(16)",
            letterPositions: "3+24=27, 5+22=27, 7+20=27, 9+18=27 → 11+16=27",
            mirrorCheck: "K=11, so mirror = 27-11=16=P. Quick check!",
            options: ["KP", "KQ", "LP", "JO", "KO"],
            correctAnswer: "KP",
            explanation: "First +2: C, E, G, I, K(11). Mirror: 27-11=16=P. K+P adds to 27. Next = KP. ✓"
          },
          {
            // DW: 4+23=27. FU: 6+21=27. HS: 8+19=27. JQ: 10+17=27. → LO: 12+15=27.
            // First: 4,6,8,10 → 12 (+2). Second: 23,21,19,17 → 15 (-2)
            name: "Charlie",
            scenario: "racing to check answers with the 27 rule",
            series: ["DW", "FU", "HS", "JQ"],
            nextPair: "LO",
            firstPattern: "D(4), F(6), H(8), J(10) — skips by 2, next is L(12)",
            secondPattern: "W(23), U(21), S(19), Q(17) — skips back by 2, next is O(15)",
            letterPositions: "4+23=27, 6+21=27, 8+19=27, 10+17=27 → 12+15=27",
            mirrorCheck: "L=12, mirror = 27-12=15=O. Confirmed!",
            options: ["LO", "LP", "MO", "KO", "LN"],
            correctAnswer: "LO",
            explanation: "First +2: D, F, H, J, L(12). Mirror: 27-12=15=O. L+O adds to 27. Next = LO. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Do these SKIP-mirror too?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nWe know A+Z=27, B+Y=27... but what if the series **skips by 2**? Does the 27 rule still work?\n\n**${v.series.join(", ")}, ??**\n\nLet's find out!`,
            visual: {
              component: "SequenceChain",
              props: (v) => ({
                terms: v.series,
                showDifferences: false,
                nextValue: "?",
                showNext: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 27 rule works with skips!",
            body: (v) => `Let's check **${v.series.join(", ")}**. Even when both rows skip by 2, each pair still adds to 27:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Let's check **${v.series.join(", ")}**. Even with skips, each pair still adds to 27!` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.map(p => p[0]).map(l => ({ letter: l, color: "#7C3AED" })).concat(
                  v.series.map(p => p[1]).map(l => ({ letter: l, color: "#dc2626" }))
                )
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `First letters: ${v.firstPattern}`, why: "Skipping forward by 2" },
                  { text: `Second letters: ${v.secondPattern}`, why: "Skipping backward by 2" },
                  { text: `Check: ${v.mirrorCheck}`, why: v.letterPositions }
                ]
              })}
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Use the 27 shortcut to check your answer:\n\n**${v.series.join(", ")}, ??**`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                showPositionNumbers: true,
                points: v.series.join('').split('').filter((c, i, a) => a.indexOf(c) === i).map(l => ({ letter: l, color: "#7C3AED" }))
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
            title: () => "The 27 trick works every time!",
            body: () => `The 27 shortcut works with ANY step size — how brilliant is that?`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "+1/-1 mirrors: AZ, BY, CX, DW...", why: "Each pair adds to 27" },
                  { text: "+2/-2 mirrors: AZ, CX, EV, GT...", why: "Still adds to 27 — just skipping!" },
                  { text: "Quick check: first letter position + second = 27?", why: "If yes, you've got the right answer ✓" }
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

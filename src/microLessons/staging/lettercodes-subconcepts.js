// ============================================================
// Supplementary sub-concepts for Letter Codes (Verbal Reasoning)
// To merge: add these to lessonBank.letterCodes.subConcepts array in lessonData.js
// ============================================================

export const letterCodesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Forward Shift
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "forward-shift",
    name: "Forward Shift",
    category: "core",
    lessons: [
      {
        id: "forward-shift-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Learn to shift letters forward through the alphabet like a codebreaker",
          "Get confident with +1, +2, +3 shifts — you'll be doing these in your sleep!"
        ],
        variableSets: [
          // CAT +2: C(3)→E(5), A(1)→C(3), T(20)→V(22) = ECV
          {
            name: "Daisy",
            scenario: "practising forward shifts",
            originalWord: "CAT",
            codedWord: "ECV",
            shiftAmount: 2,
            shiftDirection: "forward",
            letterBreakdown: ["C(3) + 2 = E(5)", "A(1) + 2 = C(3)", "T(20) + 2 = V(22)"],
            // Interact: RUG +2: R(18)→T(20), U(21)→W(23), G(7)→I(9) = TWI
            interactWord: "RUG",
            interactCoded: "TWI",
            interactOptions: ["TWI", "SVH", "UXJ", "TWJ", "SWI"],
            interactCorrectAnswer: "TWI",
            interactExplanation: "Each letter shifts forward 2: R→T, U→W, G→I. RUG becomes TWI. ✓"
          },
          // PEN +3: P(16)→S(19), E(5)→H(8), N(14)→Q(17) = SHQ
          {
            name: "Oliver",
            scenario: "encoding words with forward shifts",
            originalWord: "PEN",
            codedWord: "SHQ",
            shiftAmount: 3,
            shiftDirection: "forward",
            letterBreakdown: ["P(16) + 3 = S(19)", "E(5) + 3 = H(8)", "N(14) + 3 = Q(17)"],
            // Interact: HOP +3: H(8)→K(11), O(15)→R(18), P(16)→S(19) = KRS
            interactWord: "HOP",
            interactCoded: "KRS",
            interactOptions: ["KRS", "JQR", "LST", "KRT", "KQS"],
            interactCorrectAnswer: "KRS",
            interactExplanation: "Each letter shifts forward 3: H→K, O→R, P→S. HOP becomes KRS. ✓"
          },
          // DOG +1: D(4)→E(5), O(15)→P(16), G(7)→H(8) = EPH
          {
            name: "Priya",
            scenario: "working through a +1 shift",
            originalWord: "DOG",
            codedWord: "EPH",
            shiftAmount: 1,
            shiftDirection: "forward",
            letterBreakdown: ["D(4) + 1 = E(5)", "O(15) + 1 = P(16)", "G(7) + 1 = H(8)"],
            // Interact: BUS +1: B(2)→C(3), U(21)→V(22), S(19)→T(20) = CVT
            interactWord: "BUS",
            interactCoded: "CVT",
            interactOptions: ["CVT", "BVT", "DWU", "CVU", "CWT"],
            interactCorrectAnswer: "CVT",
            interactExplanation: "Each letter shifts forward 1: B→C, U→V, S→T. BUS becomes CVT. ✓"
          },
          // FISH +2: F(6)→H(8), I(9)→K(11), S(19)→U(21), H(8)→J(10) = HKUJ
          {
            name: "Finn",
            scenario: "coding a four-letter word forward",
            originalWord: "FISH",
            codedWord: "HKUJ",
            shiftAmount: 2,
            shiftDirection: "forward",
            letterBreakdown: ["F(6) + 2 = H(8)", "I(9) + 2 = K(11)", "S(19) + 2 = U(21)", "H(8) + 2 = J(10)"],
            // Interact: LAMP +2: L(12)→N(14), A(1)→C(3), M(13)→O(15), P(16)→R(18) = NCOR
            interactWord: "LAMP",
            interactCoded: "NCOR",
            interactOptions: ["NCOR", "MBNQ", "ODPS", "NCOS", "NCPR"],
            interactCorrectAnswer: "NCOR",
            interactExplanation: "Each letter shifts forward 2: L→N, A→C, M→O, P→R. LAMP becomes NCOR. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you crack the code for ${v.originalWord}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? Spies and secret agents have used letter shifts for centuries! A **forward shift** means every letter jumps FORWARD in the alphabet. A shift of +${v.shiftAmount} means each letter moves ${v.shiftAmount} place${v.shiftAmount > 1 ? 's' : ''} forward.\n\nCan you work out what **${v.originalWord}** becomes?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's count forward!",
            body: (v) => `Let's work through **${v.originalWord}** together with a shift of +${v.shiftAmount}. Take each letter and count ${v.shiftAmount} place${v.shiftAmount > 1 ? 's' : ''} forward in the alphabet.\n\nTop tip: use **EJOTY** (E=5, J=10, O=15, T=20, Y=25) as landmarks to keep your place!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === 0 ? "Count forward from each letter" : i === v.letterBreakdown.length - 1 ? `${v.originalWord} → ${v.codedWord} ✓` : "Same shift applies to every letter"
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Note the shift amount: +${v.shiftAmount}`,
                `Take each letter and count ${v.shiftAmount} place${v.shiftAmount > 1 ? 's' : ''} forward`,
                `Write down the new letter to build the code`
              ],
              feedback: {
                correct: (v) => `Perfect order! Note the shift, count forward, write the result. ✓`,
                incorrect: (v) => `Not quite — start by noting the shift amount first!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Each letter shifts **forward ${v.shiftAmount}**. What does **${v.interactWord}** become?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You've cracked forward shifts!",
            body: () => `Here's your recipe for any forward shift:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Note the shift amount (+1, +2, +3...)", why: "How many places forward?" },
                  { text: "2. Take each letter and count forward", why: "Use EJOTY (a memory trick — every 5th letter: E=5, J=10, O=15, T=20, Y=25) to stay on track" },
                  { text: "3. Write down the new letter each time", why: "CAT +2 = ECV, DOG +1 = EPH ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "forward-shift-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Spot the sneaky mistakes people make with forward shifts",
          "Learn why off-by-one errors happen — and how to dodge them"
        ],
        variableSets: [
          // BED +2: B(2)→D(4), E(5)→G(7), D(4)→F(6) = DGF (friend says DEF — counted from wrong letter)
          {
            name: "Evie",
            scenario: "checking her brother's code homework",
            originalWord: "BED",
            codedWord: "DGF",
            shiftAmount: 2,
            shiftDirection: "forward",
            letterBreakdown: ["B(2) + 2 = D(4)", "E(5) + 2 = G(7)", "D(4) + 2 = F(6)"],
            friendWrong: "DEF",
            friendReason: "counted the starting letter as step 1 instead of step 0",
            whyWrong: "Counting B as 1 gives C at 2 — but the shift should START after B. B +2 means go 2 MORE: B→C→D",
            // Interact: MOP +2: M(13)→O(15), O(15)→Q(17), P(16)→R(18) = OQR
            interactWord: "MOP",
            interactCoded: "OQR",
            interactOptions: ["OQR", "NPS", "OQS", "OPR", "PRR"],
            interactCorrectAnswer: "OQR",
            interactExplanation: "M +2 = O, O +2 = Q, P +2 = R. MOP becomes OQR. ✓"
          },
          // RUN +3: R(18)→U(21), U(21)→X(24), N(14)→Q(17) = UXQ (friend says TWP — counted +2 instead of +3)
          {
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            originalWord: "RUN",
            codedWord: "UXQ",
            shiftAmount: 3,
            shiftDirection: "forward",
            letterBreakdown: ["R(18) + 3 = U(21)", "U(21) + 3 = X(24)", "N(14) + 3 = Q(17)"],
            friendWrong: "TWP",
            friendReason: "accidentally shifted by +2 instead of +3",
            whyWrong: "TWP is RUN +2, not +3. Always double-check you're counting the right number of hops!",
            // Interact: FIG +3: F(6)→I(9), I(9)→L(12), G(7)→J(10) = ILJ
            interactWord: "FIG",
            interactCoded: "ILJ",
            interactOptions: ["ILJ", "HKI", "ILK", "IMJ", "JMK"],
            interactCorrectAnswer: "ILJ",
            interactExplanation: "F +3 = I, I +3 = L, G +3 = J. FIG becomes ILJ. ✓"
          },
          // HAT +1: H(8)→I(9), A(1)→B(2), T(20)→U(21) = IBU (friend says HBU — forgot to shift H)
          {
            name: "Aisha",
            scenario: "spotting errors in a friend's work",
            originalWord: "HAT",
            codedWord: "IBU",
            shiftAmount: 1,
            shiftDirection: "forward",
            letterBreakdown: ["H(8) + 1 = I(9)", "A(1) + 1 = B(2)", "T(20) + 1 = U(21)"],
            friendWrong: "HBU",
            friendReason: "forgot to shift the first letter",
            whyWrong: "Every letter must shift — including the first one! H +1 = I, not H",
            // Interact: PEN +1: P(16)→Q(17), E(5)→F(6), N(14)→O(15) = QFO
            interactWord: "PEN",
            interactCoded: "QFO",
            interactOptions: ["QFO", "PFO", "QGP", "QFN", "RGP"],
            interactCorrectAnswer: "QFO",
            interactExplanation: "P +1 = Q, E +1 = F, N +1 = O. PEN becomes QFO. ✓"
          },
          // GATE +2: G(7)→I(9), A(1)→C(3), T(20)→V(22), E(5)→G(7) = ICVG (friend says ICVE — last letter wrong)
          {
            name: "Charlie",
            scenario: "going over his mock test",
            originalWord: "GATE",
            codedWord: "ICVG",
            shiftAmount: 2,
            shiftDirection: "forward",
            letterBreakdown: ["G(7) + 2 = I(9)", "A(1) + 2 = C(3)", "T(20) + 2 = V(22)", "E(5) + 2 = G(7)"],
            friendWrong: "ICVE",
            friendReason: "left the last letter unchanged by mistake",
            whyWrong: "E +2 = G, not E! Every letter must shift, including the last one",
            // Interact: POND +2: P(16)→R(18), O(15)→Q(17), N(14)→P(16), D(4)→F(6) = RQPF
            interactWord: "POND",
            interactCoded: "RQPF",
            interactOptions: ["RQPF", "QPOE", "RQPG", "RRPF", "RQQF"],
            interactCorrectAnswer: "RQPF",
            interactExplanation: "P +2 = R, O +2 = Q, N +2 = P, D +2 = F. POND becomes RQPF. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" the right code for ${v.originalWord}?`,
            body: (v) => `${v.name} is ${v.scenario}. The answer given was **"${v.friendWrong}"** as the +${v.shiftAmount} code for **${v.originalWord}**.\n\nBut that's wrong! Can you spot the mistake?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spot the counting error!",
            body: (v) => `The mistake: ${v.friendReason}.\n\n${v.whyWrong}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: "${v.friendWrong}"`, why: v.friendReason },
                  ...v.letterBreakdown.map((step, i) => ({ text: step, why: i === 0 ? "Count forward from the starting letter — don't count the letter itself" : "Same shift for every letter" })),
                  { text: `Correct: "${v.codedWord}" ✓`, why: "Every letter must shift by the same amount" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "What's the CORRECT code?",
            body: (v) => `Shift **${v.interactWord}** forward by ${v.shiftAmount}. What's the right answer?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Now you'll dodge these mistakes!",
            body: () => `Watch out for these common forward-shift traps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Don't count the starting letter as step 1", why: "B +2 means B→C→D, not B→C" },
                  { text: "Shift EVERY letter — including first and last", why: "Don't leave any letter unchanged" },
                  { text: "Double-check the shift number", why: "+3 means three hops, not two! ✓" }
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
  // SUB-CONCEPT 2: Backward Shift
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "backward-shift",
    name: "Backward Shift",
    category: "core",
    lessons: [
      {
        id: "backward-shift-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Master backward shifts — the same skill, just in reverse",
          "Apply -1, -2, -3 shifts without getting muddled"
        ],
        variableSets: [
          // SUN -1: S(19)→R(18), U(21)→T(20), N(14)→M(13) = RTM
          {
            name: "Daisy",
            scenario: "practising backward shifts",
            originalWord: "SUN",
            codedWord: "RTM",
            shiftAmount: -1,
            shiftDirection: "backward",
            letterBreakdown: ["S(19) - 1 = R(18)", "U(21) - 1 = T(20)", "N(14) - 1 = M(13)"],
            // Interact: FOG -1: F(6)→E(5), O(15)→N(14), G(7)→F(6) = ENF
            interactWord: "FOG",
            interactCoded: "ENF",
            interactOptions: ["ENF", "GPH", "DME", "ENG", "EOF"],
            interactCorrectAnswer: "ENF",
            interactExplanation: "Each letter shifts back 1: F→E, O→N, G→F. FOG becomes ENF. ✓"
          },
          // HELP -2: H(8)→F(6), E(5)→C(3), L(12)→J(10), P(16)→N(14) = FCJN
          {
            name: "Oliver",
            scenario: "applying a -2 shift to a word",
            originalWord: "HELP",
            codedWord: "FCJN",
            shiftAmount: -2,
            shiftDirection: "backward",
            letterBreakdown: ["H(8) - 2 = F(6)", "E(5) - 2 = C(3)", "L(12) - 2 = J(10)", "P(16) - 2 = N(14)"],
            // Interact: KING -2: K(11)→I(9), I(9)→G(7), N(14)→L(12), G(7)→E(5) = IGLE
            interactWord: "KING",
            interactCoded: "IGLE",
            interactOptions: ["IGLE", "JHMF", "IFLE", "IGLF", "HFKD"],
            interactCorrectAnswer: "IGLE",
            interactExplanation: "Each letter shifts back 2: K→I, I→G, N→L, G→E. KING becomes IGLE. ✓"
          },
          // TOP -1: T(20)→S(19), O(15)→N(14), P(16)→O(15) = SNO
          {
            name: "Priya",
            scenario: "working through a -1 shift",
            originalWord: "TOP",
            codedWord: "SNO",
            shiftAmount: -1,
            shiftDirection: "backward",
            letterBreakdown: ["T(20) - 1 = S(19)", "O(15) - 1 = N(14)", "P(16) - 1 = O(15)"],
            // Interact: RED -1: R(18)→Q(17), E(5)→D(4), D(4)→C(3) = QDC
            interactWord: "RED",
            interactCoded: "QDC",
            interactOptions: ["QDC", "SFE", "QDD", "QEC", "PDC"],
            interactCorrectAnswer: "QDC",
            interactExplanation: "Each letter shifts back 1: R→Q, E→D, D→C. RED becomes QDC. ✓"
          },
          // NEST -3: N(14)→K(11), E(5)→B(2), S(19)→P(16), T(20)→Q(17) = KBPQ
          {
            name: "Finn",
            scenario: "decoding with a bigger backward shift",
            originalWord: "NEST",
            codedWord: "KBPQ",
            shiftAmount: -3,
            shiftDirection: "backward",
            letterBreakdown: ["N(14) - 3 = K(11)", "E(5) - 3 = B(2)", "S(19) - 3 = P(16)", "T(20) - 3 = Q(17)"],
            // Interact: MILK -3: M(13)→J(10), I(9)→F(6), L(12)→I(9), K(11)→H(8) = JFIH
            interactWord: "MILK",
            interactCoded: "JFIH",
            interactOptions: ["JFIH", "KGJL", "JFIG", "JFII", "IEGH"],
            interactCorrectAnswer: "JFIH",
            interactExplanation: "Each letter shifts back 3: M→J, I→F, L→I, K→H. MILK becomes JFIH. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you decode ${v.originalWord} backwards?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nA **backward shift** means every letter moves BACK in the alphabet. A shift of ${v.shiftAmount} means each letter moves ${Math.abs(v.shiftAmount)} place${Math.abs(v.shiftAmount) > 1 ? 's' : ''} backward.\n\nIt's the same idea as forward shifts, just in the other direction. Can you work out what **${v.originalWord}** becomes?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Let's count backward!",
            body: (v) => `Let's work through **${v.originalWord}** together with a shift of ${v.shiftAmount}. Take each letter and count ${Math.abs(v.shiftAmount)} place${Math.abs(v.shiftAmount) > 1 ? 's' : ''} back in the alphabet.\n\nTop tip: use **EJOTY** (E=5, J=10, O=15, T=20, Y=25) as landmarks to keep your place!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === 0 ? "Count backward from each letter" : i === v.letterBreakdown.length - 1 ? `${v.originalWord} → ${v.codedWord} ✓` : "Same shift applies to every letter"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Each letter shifts **backward ${Math.abs(v.shiftAmount)}**. What does **${v.interactWord}** become?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Backward shifts — sorted!",
            body: () => `Here's your recipe for any backward shift:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Note the shift amount (-1, -2, -3...)", why: "How many places backward?" },
                  { text: "2. Take each letter and count backward", why: "Use EJOTY (E=5, J=10, O=15, T=20, Y=25) landmarks in reverse" },
                  { text: "3. Write the new letter each time", why: "SUN -1 = RTM, HELP -2 = FCJN ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "backward-shift-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Build speed with backward shifts at different levels",
          "Get so confident counting backward that it feels automatic"
        ],
        variableSets: [
          // PIG -1: P(16)→O(15), I(9)→H(8), G(7)→F(6) = OHF
          {
            name: "Evie",
            scenario: "building speed with backward codes",
            originalWord: "PIG",
            codedWord: "OHF",
            shiftAmount: -1,
            shiftDirection: "backward",
            letterBreakdown: ["P(16) - 1 = O(15)", "I(9) - 1 = H(8)", "G(7) - 1 = F(6)"],
            // Interact: HEN -1: H(8)→G(7), E(5)→D(4), N(14)→M(13) = GDM
            interactWord: "HEN",
            interactCoded: "GDM",
            interactOptions: ["GDM", "IFO", "GDN", "GEM", "FCL"],
            interactCorrectAnswer: "GDM",
            interactExplanation: "Each letter shifts back 1: H→G, E→D, N→M. HEN becomes GDM. ✓"
          },
          // LAMP -2: L(12)→J(10), A(1)→Y(25... wait, that wraps. Let me use GOLD instead)
          // GOLD -2: G(7)→E(5), O(15)→M(13), L(12)→J(10), D(4)→B(2) = EMJB
          {
            name: "Marcus",
            scenario: "tackling -2 shifts with confidence",
            originalWord: "GOLD",
            codedWord: "EMJB",
            shiftAmount: -2,
            shiftDirection: "backward",
            letterBreakdown: ["G(7) - 2 = E(5)", "O(15) - 2 = M(13)", "L(12) - 2 = J(10)", "D(4) - 2 = B(2)"],
            // Interact: FORK -2: F(6)→D(4), O(15)→M(13), R(18)→P(16), K(11)→I(9) = DMPI
            interactWord: "FORK",
            interactCoded: "DMPI",
            interactOptions: ["DMPI", "ENQJ", "DMPJ", "DNPI", "CLOH"],
            interactCorrectAnswer: "DMPI",
            interactExplanation: "Each letter shifts back 2: F→D, O→M, R→P, K→I. FORK becomes DMPI. ✓"
          },
          // MINT -3: M(13)→J(10), I(9)→F(6), N(14)→K(11), T(20)→Q(17) = JFKQ
          {
            name: "Aisha",
            scenario: "practising bigger backward shifts",
            originalWord: "MINT",
            codedWord: "JFKQ",
            shiftAmount: -3,
            shiftDirection: "backward",
            letterBreakdown: ["M(13) - 3 = J(10)", "I(9) - 3 = F(6)", "N(14) - 3 = K(11)", "T(20) - 3 = Q(17)"],
            // Interact: SURF -3: S(19)→P(16), U(21)→R(18), R(18)→O(15), F(6)→C(3) = PROC
            interactWord: "SURF",
            interactCoded: "PROC",
            interactOptions: ["PROC", "QSPD", "PROD", "PRPC", "QQOC"],
            interactCorrectAnswer: "PROC",
            interactExplanation: "Each letter shifts back 3: S→P, U→R, R→O, F→C. SURF becomes PROC. ✓"
          },
          // RING -1: R(18)→Q(17), I(9)→H(8), N(14)→M(13), G(7)→F(6) = QHMF
          {
            name: "Charlie",
            scenario: "racing through -1 shifts",
            originalWord: "RING",
            codedWord: "QHMF",
            shiftAmount: -1,
            shiftDirection: "backward",
            letterBreakdown: ["R(18) - 1 = Q(17)", "I(9) - 1 = H(8)", "N(14) - 1 = M(13)", "G(7) - 1 = F(6)"],
            // Interact: DESK -1: D(4)→C(3), E(5)→D(4), S(19)→R(18), K(11)→J(10) = CDRJ
            interactWord: "DESK",
            interactCoded: "CDRJ",
            interactOptions: ["CDRJ", "EFSL", "CDRK", "CESJ", "BCRJ"],
            interactCorrectAnswer: "CDRJ",
            interactExplanation: "Each letter shifts back 1: D→C, E→D, S→R, K→J. DESK becomes CDRJ. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you shift ${v.originalWord} backward?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nBackward shifts can feel trickier at first — but here's the good news: the method is exactly the same, just in the other direction! You've got this.\n\n**${v.originalWord}** with a shift of **${v.shiftAmount}** becomes...?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step through it",
            body: (v) => `Let's shift **${v.originalWord}** by ${v.shiftAmount}. Take each letter one at a time and count ${Math.abs(v.shiftAmount)} back.\n\nUse **EJOTY** (E=5, J=10, O=15, T=20, Y=25) as landmarks to keep your place!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === v.letterBreakdown.length - 1 ? `Answer: ${v.codedWord} ✓` : ""
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Each letter shifts **${v.shiftAmount}**. What does **${v.interactWord}** become?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Backward shifts — easy peasy!",
            body: () => `Backward shifts work the same as forward — just the other way. Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Same method, opposite direction", why: "Count back instead of forward" },
                  { text: "Use EJOTY (E=5, J=10, O=15, T=20, Y=25) landmarks in reverse", why: "E=5, so D=4, C=3..." },
                  { text: "Take your time with each letter", why: "Rushing causes miscounts ✓" }
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
  // SUB-CONCEPT 3: Consistent Shift
  // Category: core
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "consistent-shift",
    name: "Consistent Shift",
    category: "core",
    lessons: [
      {
        id: "consistent-shift-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Verify that every letter shifts by the SAME amount — the key to cracking any code",
          "Learn the detective trick that confirms you've found the right rule"
        ],
        variableSets: [
          // GAME → HBNF: G(7)→H(8)+1, A(1)→B(2)+1, M(13)→N(14)+1, E(5)→F(6)+1 = all +1 ✓
          {
            name: "Zara",
            scenario: "verifying a code she's been given",
            originalWord: "GAME",
            codedWord: "HBNF",
            shiftAmount: 1,
            shiftDirection: "forward",
            letterBreakdown: ["G→H: 8 - 7 = +1", "A→B: 2 - 1 = +1", "M→N: 14 - 13 = +1", "E→F: 6 - 5 = +1"],
            consistencyCheck: "All letters shift +1 — consistent!",
            options: ["+1 (forward)", "+2 (forward)", "-1 (backward)", "+3 (forward)", "-2 (backward)"],
            correctAnswer: "+1 (forward)",
            explanation: "G→H (+1), A→B (+1), M→N (+1), E→F (+1). Every letter shifts +1 — the rule is consistent. ✓"
          },
          // COLD → FROG: C(3)→F(6)+3, O(15)→R(18)+3, L(12)→O(15)+3, D(4)→G(7)+3 = all +3 ✓
          {
            name: "Ben",
            scenario: "figuring out the rule from a coded pair",
            originalWord: "COLD",
            codedWord: "FROG",
            shiftAmount: 3,
            shiftDirection: "forward",
            letterBreakdown: ["C→F: 6 - 3 = +3", "O→R: 18 - 15 = +3", "L→O: 15 - 12 = +3", "D→G: 7 - 4 = +3"],
            consistencyCheck: "All letters shift +3 — consistent!",
            options: ["+3 (forward)", "+2 (forward)", "-3 (backward)", "+1 (forward)", "+4 (forward)"],
            correctAnswer: "+3 (forward)",
            explanation: "C→F (+3), O→R (+3), L→O (+3), D→G (+3). Every letter shifts +3 — the rule is consistent. ✓"
          },
          // HELP → GDKO: H(8)→G(7)-1, E(5)→D(4)-1, L(12)→K(11)-1, P(16)→O(15)-1 = all -1 ✓
          {
            name: "Priya",
            scenario: "checking a backward-shift code",
            originalWord: "HELP",
            codedWord: "GDKO",
            shiftAmount: -1,
            shiftDirection: "backward",
            letterBreakdown: ["H→G: 7 - 8 = -1", "E→D: 4 - 5 = -1", "L→K: 11 - 12 = -1", "P→O: 15 - 16 = -1"],
            consistencyCheck: "All letters shift -1 — consistent!",
            options: ["-1 (backward)", "+1 (forward)", "-2 (backward)", "+2 (forward)", "-3 (backward)"],
            correctAnswer: "-1 (backward)",
            explanation: "H→G (-1), E→D (-1), L→K (-1), P→O (-1). Every letter shifts -1 — the rule is consistent. ✓"
          },
          // WOLF → UMJD: W(23)→U(21)-2, O(15)→M(13)-2, L(12)→J(10)-2, F(6)→D(4)-2 = all -2 ✓
          {
            name: "Finn",
            scenario: "cracking a trickier code",
            originalWord: "WOLF",
            codedWord: "UMJD",
            shiftAmount: -2,
            shiftDirection: "backward",
            letterBreakdown: ["W→U: 21 - 23 = -2", "O→M: 13 - 15 = -2", "L→J: 10 - 12 = -2", "F→D: 4 - 6 = -2"],
            consistencyCheck: "All letters shift -2 — consistent!",
            options: ["-2 (backward)", "-1 (backward)", "+2 (forward)", "-3 (backward)", "+1 (forward)"],
            correctAnswer: "-2 (backward)",
            explanation: "W→U (-2), O→M (-2), L→J (-2), F→D (-2). Every letter shifts -2 — the rule is consistent. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the rule for ${v.originalWord} → ${v.codedWord}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nIn the 11+, you're often given a coded pair and asked: **what rule was used?** It's like being a codebreaker!\n\nThe key is to check that EVERY letter shifts by the **same amount**. If they do, you've cracked it!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check every letter",
            body: (v) => `Let's check **${v.originalWord} → ${v.codedWord}**. Line up each original letter with its coded version and count the hops. They should ALL be the same number.`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Let's check **${v.originalWord} → ${v.codedWord}**. Count the hops for each letter — they should ALL be the same!` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#22c55e" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : '' }))
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  ...v.letterBreakdown.map((step, i) => ({ text: step, why: i === 0 ? "Count the hops between original and coded letter" : "Check this pair matches too" })),
                  { text: v.consistencyCheck, why: "Same number every time — that's the rule! ✓" }
                ],
                allRevealed: true
              })}
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `In a consistent shift code, every letter shifts by the same amount`, answer: true, explanation: `Correct! A consistent shift means the same hop for every letter. ✓` },
                { text: `You only need to check the first letter pair to know the rule`, answer: false, explanation: `Not safe! Always check at least two pairs to confirm the shift is consistent.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the shift rule?",
            body: (v) => `**${v.originalWord}** is coded as **${v.codedWord}**. What shift has been used?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're a codebreaker now!",
            body: () => `To identify the shift rule, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Line up original and coded letters", why: "Write them side by side" },
                  { text: "2. Count the hops for EACH pair", why: "Forward = positive, backward = negative" },
                  { text: "3. They should all be the SAME number", why: "If they match, that's the rule! ✓" }
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
  // SUB-CONCEPT 4: Variable Shift
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "variable-shift",
    name: "Variable Shift",
    category: "supporting",
    lessons: [
      {
        id: "variable-shift-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Handle trickier codes where each position shifts by a different amount",
          "Spot patterns like +1, +2, +3 hiding inside position-based shifts"
        ],
        variableSets: [
          // CAT with shifts +1, +2, +3: C(3)+1=D(4), A(1)+2=C(3), T(20)+3=W(23) = DCW
          {
            name: "Daisy",
            scenario: "tackling a tricky variable-shift code",
            originalWord: "CAT",
            codedWord: "DCW",
            shiftAmount: "+1, +2, +3",
            shiftDirection: "variable forward",
            letterBreakdown: ["C(3) + 1 = D(4)", "A(1) + 2 = C(3)", "T(20) + 3 = W(23)"],
            shiftPattern: "Position 1 shifts +1, position 2 shifts +2, position 3 shifts +3",
            options: ["DCW", "DBU", "ECV", "DCX", "DDW"],
            correctAnswer: "DCW",
            explanation: "Each position shifts differently: C+1=D, A+2=C, T+3=W. The pattern is +1, +2, +3. CAT becomes DCW. ✓"
          },
          // DOG with shifts +1, +2, +3: D(4)+1=E(5), O(15)+2=Q(17), G(7)+3=J(10) = EQJ
          {
            name: "Oliver",
            scenario: "spotting a position-based pattern",
            originalWord: "DOG",
            codedWord: "EQJ",
            shiftAmount: "+1, +2, +3",
            shiftDirection: "variable forward",
            letterBreakdown: ["D(4) + 1 = E(5)", "O(15) + 2 = Q(17)", "G(7) + 3 = J(10)"],
            shiftPattern: "Position 1 shifts +1, position 2 shifts +2, position 3 shifts +3",
            options: ["EQJ", "EPH", "FRI", "EQK", "ERJ"],
            correctAnswer: "EQJ",
            explanation: "Position 1: D+1=E, Position 2: O+2=Q, Position 3: G+3=J. The rule is +1, +2, +3. DOG becomes EQJ. ✓"
          },
          // PEN with shifts +2, +2, +2 (trick — actually consistent! But framed as checking)
          // Let's use +1, +3, +5: P(16)+1=Q(17), E(5)+3=H(8), N(14)+5=S(19) = QHS
          {
            name: "Priya",
            scenario: "working out an odd-numbers pattern",
            originalWord: "PEN",
            codedWord: "QHS",
            shiftAmount: "+1, +3, +5",
            shiftDirection: "variable forward",
            letterBreakdown: ["P(16) + 1 = Q(17)", "E(5) + 3 = H(8)", "N(14) + 5 = S(19)"],
            shiftPattern: "Position 1 shifts +1, position 2 shifts +3, position 3 shifts +5 (odd numbers!)",
            options: ["QHS", "SHQ", "QGR", "QHT", "RIS"],
            correctAnswer: "QHS",
            explanation: "The shifts are +1, +3, +5 (odd numbers). P+1=Q, E+3=H, N+5=S. PEN becomes QHS. ✓"
          },
          // BIRD with shifts +1, +2, +3, +4: B(2)+1=C(3), I(9)+2=K(11), R(18)+3=U(21), D(4)+4=H(8) = CKUH
          {
            name: "Finn",
            scenario: "solving a four-letter variable shift",
            originalWord: "BIRD",
            codedWord: "CKUH",
            shiftAmount: "+1, +2, +3, +4",
            shiftDirection: "variable forward",
            letterBreakdown: ["B(2) + 1 = C(3)", "I(9) + 2 = K(11)", "R(18) + 3 = U(21)", "D(4) + 4 = H(8)"],
            shiftPattern: "Position 1 shifts +1, position 2 shifts +2, position 3 shifts +3, position 4 shifts +4",
            options: ["CKUH", "DKTF", "CKUI", "CLVH", "BJTG"],
            correctAnswer: "CKUH",
            explanation: "The shifts increase: +1, +2, +3, +4. B+1=C, I+2=K, R+3=U, D+4=H. BIRD becomes CKUH. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Something's different about this code!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a twist: sometimes the shift is **different for each position** in the word. The first letter might shift +1, the second +2, the third +3... There's a pattern hiding in the shifts themselves!\n\n**${v.originalWord}** → **${v.codedWord}**\n\nCan you spot it?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Check each position separately",
            body: (v) => `Let's check **${v.originalWord} → ${v.codedWord}**. When the shift ISN'T consistent (the same for every letter), look for a pattern in the shift amounts themselves:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  ...v.letterBreakdown.map((step, i) => ({ text: step, why: i === 0 ? "Count the hops for each letter separately" : "Different shift amount — the shifts vary!" })),
                  { text: v.shiftPattern, why: "The shifts follow their own pattern! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The shifts are **${v.shiftAmount}**. What does **${v.originalWord}** become?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Variable shifts — you can handle these!",
            body: () => `When each position shifts differently, just follow this approach:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Count the hops for each letter separately", why: "Don't assume they're all the same!" },
                  { text: "2. Look for a pattern in the shifts", why: "+1, +2, +3 or +1, +3, +5 etc." },
                  { text: "3. Apply the pattern to the new word", why: "Each position gets its own shift amount ✓" }
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
  // SUB-CONCEPT 5: EJOTY Technique
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "ejoty-technique",
    name: "EJOTY — Quick Alphabet Positioning",
    category: "supporting",
    lessons: [
      {
        id: "ejoty-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Master the EJOTY speed trick — your secret weapon for finding letter positions fast",
          "Never count from A again — jump to the nearest landmark instead!"
        ],
        variableSets: [
          // Find position of R: nearest EJOTY is T=20, R is 2 before T → R=18
          {
            name: "Daisy",
            scenario: "learning the EJOTY speed trick",
            targetLetter: "R",
            position: 18,
            nearestLandmark: "T",
            landmarkPosition: 20,
            countDirection: "2 before T",
            hoppingExample: "To shift R by +3: R(18) + 3 = U(21)",
            resultLetter: "U",
            shiftAmount: 3,
            // Interact: find position of M. Nearest EJOTY: O=15, M is 2 before O → M=13
            interactLetter: "M",
            interactPosition: "13",
            interactOptions: ["13", "12", "14", "11", "15"],
            interactCorrectAnswer: "13",
            interactExplanation: "M is 2 before O(15), so M = 15 - 2 = 13. EJOTY makes it quick! ✓"
          },
          // Find position of L: nearest EJOTY is J=10, L is 2 after J → L=12
          {
            name: "Oliver",
            scenario: "using landmarks to find letter positions",
            targetLetter: "L",
            position: 12,
            nearestLandmark: "J",
            landmarkPosition: 10,
            countDirection: "2 after J",
            hoppingExample: "To shift L by -3: L(12) - 3 = I(9)",
            resultLetter: "I",
            shiftAmount: -3,
            // Interact: find position of H. Nearest EJOTY: J=10, H is 2 before J → H=8
            interactLetter: "H",
            interactPosition: "8",
            interactOptions: ["8", "7", "9", "6", "10"],
            interactCorrectAnswer: "8",
            interactExplanation: "H is 2 before J(10), so H = 10 - 2 = 8. Count from the nearest landmark! ✓"
          },
          // Find position of G: nearest EJOTY is E=5, G is 2 after E → G=7
          {
            name: "Priya",
            scenario: "practising EJOTY for speed",
            targetLetter: "G",
            position: 7,
            nearestLandmark: "E",
            landmarkPosition: 5,
            countDirection: "2 after E",
            hoppingExample: "To shift G by +2: G(7) + 2 = I(9)",
            resultLetter: "I",
            shiftAmount: 2,
            // Interact: find position of N. Nearest EJOTY: O=15, N is 1 before O → N=14
            interactLetter: "N",
            interactPosition: "14",
            interactOptions: ["14", "13", "15", "12", "16"],
            interactCorrectAnswer: "14",
            interactExplanation: "N is 1 before O(15), so N = 15 - 1 = 14. Just one hop from a landmark! ✓"
          },
          // Find position of W: nearest EJOTY is Y=25, W is 2 before Y → W=23
          {
            name: "Finn",
            scenario: "using EJOTY for letters near the end",
            targetLetter: "W",
            position: 23,
            nearestLandmark: "Y",
            landmarkPosition: 25,
            countDirection: "2 before Y",
            hoppingExample: "To shift W by +3: W(23) + 3 = Z(26)",
            resultLetter: "Z",
            shiftAmount: 3,
            // Interact: find position of Q. Nearest EJOTY: O=15, Q is 2 after O → Q=17
            interactLetter: "Q",
            interactPosition: "17",
            interactOptions: ["17", "16", "18", "15", "19"],
            interactCorrectAnswer: "17",
            interactExplanation: "Q is 2 after O(15), so Q = 15 + 2 = 17. EJOTY gets you there fast! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "EJOTY — your secret weapon!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? Top scorers in the 11+ almost never count from A! They use **EJOTY** (E=5, J=10, O=15, T=20, Y=25) — 5 anchor points spaced evenly through the alphabet.\n\nJump to the nearest landmark and count from there. It's so much faster!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: [
                  { letter: v.targetLetter, color: "#6C5CE7" },
                  { letter: v.nearestLandmark, color: "#dc2626" }
                ],
                hops: [{ from: v.nearestLandmark, to: v.targetLetter, label: v.countDirection }]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `Finding ${v.targetLetter} with EJOTY`,
            body: (v) => `The nearest EJOTY landmark to **${v.targetLetter}** is **${v.nearestLandmark}** = ${v.landmarkPosition}.\n\n**${v.targetLetter}** is ${v.countDirection}, so ${v.targetLetter} = **${v.position}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `What position is ${v.targetLetter} in the alphabet?`, why: "Instead of counting from A, use the nearest EJOTY landmark!" },
                  { text: `Nearest landmark: ${v.nearestLandmark} = ${v.landmarkPosition}`, why: "Jump straight to the closest EJOTY letter" },
                  { text: `${v.targetLetter} is ${v.countDirection}`, why: `${v.landmarkPosition} ${v.position > v.landmarkPosition ? '+ ' + (v.position - v.landmarkPosition) : '- ' + (v.landmarkPosition - v.position)} = ${v.position}` },
                  { text: `So ${v.targetLetter} = position ${v.position}`, why: "Much faster than counting from A! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "E", right: "5" },
                { left: "J", right: "10" },
                { left: "O", right: "15" },
                { left: "T", right: "20" },
                { left: "Y", right: "25" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What position is this letter?",
            body: (v) => `Using EJOTY, what is the position of **${v.interactLetter}** in the alphabet?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: [{ letter: v.interactLetter, color: "#6C5CE7" }]
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "EJOTY — learn it, love it!",
            body: () => `Once you've memorised these 5 landmarks, letter codes become so much faster:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "E = 5, J = 10, O = 15, T = 20, Y = 25", why: "Memorise these — they never change" },
                  { text: "Find the nearest landmark to your letter", why: "Never more than 2 away from a landmark!" },
                  { text: "Count a small number from there", why: "R? That's T(20) - 2 = 18. Done! ✓" }
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
  // SUB-CONCEPT 6: Reverse Decoding
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "reverse-decoding",
    name: "Reverse Decoding — Find the Original",
    category: "supporting",
    lessons: [
      {
        id: "reverse-decoding-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Work backward from a coded word to reveal the hidden original",
          "Discover the golden rule: decoding means doing the OPPOSITE shift"
        ],
        variableSets: [
          // Code EPH was made with +1. Decode: E(5)-1=D(4), P(16)-1=O(15), H(8)-1=G(7) = DOG
          {
            name: "Daisy",
            scenario: "working backward to find the original word",
            codedWord: "EPH",
            originalWord: "DOG",
            shiftUsed: "+1",
            reverseShift: "-1",
            letterBreakdown: ["E(5) - 1 = D(4)", "P(16) - 1 = O(15)", "H(8) - 1 = G(7)"],
            // Interact: CVT was made with +1. Decode with -1: C(3)-1=B(2), V(22)-1=U(21), T(20)-1=S(19) = BUS
            interactCode: "CVT",
            interactShiftUsed: "+1",
            interactReverseShift: "-1",
            interactOriginal: "BUS",
            interactOptions: ["BUS", "DWU", "BUT", "BUR", "CUB"],
            interactCorrectAnswer: "BUS",
            interactExplanation: "The code used +1, so decode with -1: C→B, V→U, T→S. The original word is BUS. ✓"
          },
          // Code FROG was made with +3. Decode: F(6)-3=C(3), R(18)-3=O(15), O(15)-3=L(12), G(7)-3=D(4) = COLD
          {
            name: "Oliver",
            scenario: "decoding back to the original word",
            codedWord: "FROG",
            originalWord: "COLD",
            shiftUsed: "+3",
            reverseShift: "-3",
            letterBreakdown: ["F(6) - 3 = C(3)", "R(18) - 3 = O(15)", "O(15) - 3 = L(12)", "G(7) - 3 = D(4)"],
            // Interact: QHVW was made with +3. Decode with -3: Q(17)-3=N(14), H(8)-3=E(5), V(22)-3=S(19), W(23)-3=T(20) = NEST
            interactCode: "QHVW",
            interactShiftUsed: "+3",
            interactReverseShift: "-3",
            interactOriginal: "NEST",
            interactOptions: ["NEST", "TKYZ", "NETS", "NEXT", "BEST"],
            interactCorrectAnswer: "NEST",
            interactExplanation: "The code used +3, so decode with -3: Q→N, H→E, V→S, W→T. The original word is NEST. ✓"
          },
          // Code RTM was made with -1. Decode: R(18)+1=S(19), T(20)+1=U(21), M(13)+1=N(14) = SUN
          {
            name: "Priya",
            scenario: "reversing a backward shift",
            codedWord: "RTM",
            originalWord: "SUN",
            shiftUsed: "-1",
            reverseShift: "+1",
            letterBreakdown: ["R(18) + 1 = S(19)", "T(20) + 1 = U(21)", "M(13) + 1 = N(14)"],
            // Interact: QDC was made with -1. Decode with +1: Q(17)+1=R(18), D(4)+1=E(5), C(3)+1=D(4) = RED
            interactCode: "QDC",
            interactShiftUsed: "-1",
            interactReverseShift: "+1",
            interactOriginal: "RED",
            interactOptions: ["RED", "PCB", "REE", "RFD", "SEE"],
            interactCorrectAnswer: "RED",
            interactExplanation: "The code used -1, so decode with +1: Q→R, D→E, C→D. The original word is RED. ✓"
          },
          // Code FCJN was made with -2. Decode: F(6)+2=H(8), C(3)+2=E(5), J(10)+2=L(12), N(14)+2=P(16) = HELP
          {
            name: "Finn",
            scenario: "cracking a decoded puzzle",
            codedWord: "FCJN",
            originalWord: "HELP",
            shiftUsed: "-2",
            reverseShift: "+2",
            letterBreakdown: ["F(6) + 2 = H(8)", "C(3) + 2 = E(5)", "J(10) + 2 = L(12)", "N(14) + 2 = P(16)"],
            // Interact: DMPI was made with -2. Decode with +2: D(4)+2=F(6), M(13)+2=O(15), P(16)+2=R(18), I(9)+2=K(11) = FORK
            interactCode: "DMPI",
            interactShiftUsed: "-2",
            interactReverseShift: "+2",
            interactOriginal: "FORK",
            interactOptions: ["FORK", "BHNG", "FORM", "FORT", "FOLD"],
            interactCorrectAnswer: "FORK",
            interactExplanation: "The code used -2, so decode with +2: D→F, M→O, P→R, I→K. The original word is FORK. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What word is hiding inside "${v.codedWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSometimes the 11+ gives you the **coded word** and asks: "What was the ORIGINAL word?" It's like uncovering a hidden message!\n\nThis is called **decoding** (turning the code back into a real word). The trick: if the code used **${v.shiftUsed}**, you decode by doing the **opposite**: **${v.reverseShift}**.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Reverse the shift!",
            body: (v) => `The code used a shift of **${v.shiftUsed}**. To decode, apply the opposite shift: **${v.reverseShift}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === v.letterBreakdown.length - 1 ? `The original word is ${v.originalWord}! ✓` : ""
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Note the shift that was used: ${v.shiftUsed}`,
                `Apply the OPPOSITE shift: ${v.reverseShift}`,
                `Check: does the result spell a real word?`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the shift, reverse it, then check the result. ✓`,
                incorrect: (v) => `Not quite — start by noting the original shift, then reverse it!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Decode it!",
            body: (v) => `The code **"${v.interactCode}"** was made with a shift of **${v.interactShiftUsed}**. What was the original word?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decoding — you've got the golden rule!",
            body: () => `To find the original word from a code, just remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Note the shift that was used", why: "Was it +1, +2, +3, -1, -2...?" },
                  { text: "2. Apply the OPPOSITE shift", why: "+3 becomes -3, -1 becomes +1" },
                  { text: "3. The result should spell a real word!", why: "If it doesn't make a word, recheck your working ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "reverse-decoding-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Decode coded words back to their originals — like cracking a secret message",
          "Reverse both forward and backward shifts with confidence"
        ],
        variableSets: [
          // Code VQRZ was made with +3. Decode: V(22)-3=S(19), Q(17)-3=N(14), R(18)-3=O(15), Z(26)-3=W(23) = SNOW
          {
            name: "Evie",
            scenario: "decoding a weather word",
            codedWord: "VQRZ",
            originalWord: "SNOW",
            shiftUsed: "+3",
            reverseShift: "-3",
            letterBreakdown: ["V(22) - 3 = S(19)", "Q(17) - 3 = N(14)", "R(18) - 3 = O(15)", "Z(26) - 3 = W(23)"],
            // Interact: KLOO was made with +3. Decode with -3: K(11)-3=H(8), L(12)-3=I(9), O(15)-3=L(12), O(15)-3=L(12) = HILL
            interactCode: "KLOO",
            interactShiftUsed: "+3",
            interactReverseShift: "-3",
            interactOriginal: "HILL",
            interactOptions: ["HILL", "NPRR", "HINT", "HIDE", "FILL"],
            interactCorrectAnswer: "HILL",
            interactExplanation: "Decode with -3: K→H, L→I, O→L, O→L. The word is HILL. ✓"
          },
          // Code ORYH was made with +3. Decode: O(15)-3=L(12), R(18)-3=O(15), Y(25)-3=V(22), H(8)-3=E(5) = LOVE
          {
            name: "Marcus",
            scenario: "cracking a code with +3",
            codedWord: "ORYH",
            originalWord: "LOVE",
            shiftUsed: "+3",
            reverseShift: "-3",
            letterBreakdown: ["O(15) - 3 = L(12)", "R(18) - 3 = O(15)", "Y(25) - 3 = V(22)", "H(8) - 3 = E(5)"],
            // Interact: ZLQG was made with +3. Decode with -3: Z(26)-3=W(23), L(12)-3=I(9), Q(17)-3=N(14), G(7)-3=D(4) = WIND
            interactCode: "ZLQG",
            interactShiftUsed: "+3",
            interactReverseShift: "-3",
            interactOriginal: "WIND",
            interactOptions: ["WIND", "COTJ", "WINE", "WILD", "WING"],
            interactCorrectAnswer: "WIND",
            interactExplanation: "Decode with -3: Z→W, L→I, Q→N, G→D. The word is WIND. ✓"
          },
          // Code GDKO was made with -1. Decode: G(7)+1=H(8), D(4)+1=E(5), K(11)+1=L(12), O(15)+1=P(16) = HELP
          {
            name: "Aisha",
            scenario: "reversing a -1 shift",
            codedWord: "GDKO",
            originalWord: "HELP",
            shiftUsed: "-1",
            reverseShift: "+1",
            letterBreakdown: ["G(7) + 1 = H(8)", "D(4) + 1 = E(5)", "K(11) + 1 = L(12)", "O(15) + 1 = P(16)"],
            // Interact: ENF was made with -1. Decode with +1: E(5)+1=F(6), N(14)+1=O(15), F(6)+1=G(7) = FOG
            interactCode: "ENF",
            interactShiftUsed: "-1",
            interactReverseShift: "+1",
            interactOriginal: "FOG",
            interactOptions: ["FOG", "DME", "FIG", "FOR", "LOG"],
            interactCorrectAnswer: "FOG",
            interactExplanation: "Decode with +1: E→F, N→O, F→G. The word is FOG. ✓"
          },
          // Code EMJB was made with -2. Decode: E(5)+2=G(7), M(13)+2=O(15), J(10)+2=L(12), B(2)+2=D(4) = GOLD
          {
            name: "Charlie",
            scenario: "reversing a -2 shift",
            codedWord: "EMJB",
            originalWord: "GOLD",
            shiftUsed: "-2",
            reverseShift: "+2",
            letterBreakdown: ["E(5) + 2 = G(7)", "M(13) + 2 = O(15)", "J(10) + 2 = L(12)", "B(2) + 2 = D(4)"],
            // Interact: IGLE was made with -2. Decode with +2: I(9)+2=K(11), G(7)+2=I(9), L(12)+2=N(14), E(5)+2=G(7) = KING
            interactCode: "IGLE",
            interactShiftUsed: "-2",
            interactReverseShift: "+2",
            interactOriginal: "KING",
            interactOptions: ["KING", "GEIC", "KITE", "KISS", "KIND"],
            interactCorrectAnswer: "KING",
            interactExplanation: "Decode with +2: I→K, G→I, L→N, E→G. The word is KING. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What word is hiding in "${v.codedWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe coded word is **"${v.codedWord}"** and the shift used was **${v.shiftUsed}**.\n\nRemember: to decode, do the **opposite** — shift each letter by **${v.reverseShift}**.`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Apply the opposite shift",
            body: (v) => `The code used **${v.shiftUsed}**, so to decode we shift each letter by **${v.reverseShift}**:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `The code used **${v.shiftUsed}**, so to decode we shift each letter by **${v.reverseShift}**:` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                points: v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" })).concat(
                  v.originalWord.split('').map(l => ({ letter: l, color: "#22c55e" }))
                ),
                hops: v.codedWord.split('').map((l, i) => ({ from: l, to: v.originalWord[i], label: i === 0 ? v.reverseShift : '' }))
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === v.letterBreakdown.length - 1 ? `The word is ${v.originalWord}! ✓` : ""
                }))
              })}
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Decode it!",
            body: (v) => `The code is **"${v.interactCode}"** (shift: ${v.interactShiftUsed}). What is the original word?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Decoding — just flip the shift!",
            body: () => `Remember the golden rule — it's beautifully simple:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Code used +N? Decode with -N", why: "+3 → decode with -3" },
                  { text: "Code used -N? Decode with +N", why: "-2 → decode with +2" },
                  { text: "Check: does your answer spell a real word?", why: "If not, recheck each letter ✓" }
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
  // SUB-CONCEPT 7: Wrap-Around
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "wrap-around",
    name: "Wrap-Around — Past Z or Before A",
    category: "other",
    lessons: [
      {
        id: "wrap-around-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Handle the cool trick when a shift goes past Z or before A — the alphabet loops!",
          "Count through the wrap-around join like a pro"
        ],
        variableSets: [
          // YES +3: Y(25)+3=B(2), E(5)+3=H(8), S(19)+3=V(22) = BHV
          // Y(25)+3: 25+3=28, 28-26=2 → B
          {
            name: "Daisy",
            scenario: "handling a shift that goes past Z",
            originalWord: "YES",
            codedWord: "BHV",
            shiftAmount: 3,
            shiftDirection: "forward",
            letterBreakdown: ["Y(25) + 3: past Z! Y→Z→A→B = B(2)", "E(5) + 3 = H(8)", "S(19) + 3 = V(22)"],
            wrapExplanation: "Y is position 25. Adding 3 goes past Z(26), so it wraps: Y→Z(1 hop)→A(2 hops)→B(3 hops)",
            // Interact: YEW +2: Y(25)+2=A(1, wraps), E(5)+2=G(7), W(23)+2=Y(25) = AGY
            interactWord: "YEW",
            interactCoded: "AGY",
            interactShiftLabel: "+2",
            interactOptions: ["AGY", "ZFX", "AGZ", "AHY", "BGY"],
            interactCorrectAnswer: "AGY",
            interactExplanation: "Y+2 wraps past Z to A, E+2=G, W+2=Y. YEW becomes AGY. ✓"
          },
          // ZAP +2: Z(26)+2=B(2), A(1)+2=C(3), P(16)+2=R(18) = BCR
          // Z(26)+2: 26+2=28, 28-26=2 → B
          {
            name: "Oliver",
            scenario: "shifting a word starting with Z",
            originalWord: "ZAP",
            codedWord: "BCR",
            shiftAmount: 2,
            shiftDirection: "forward",
            letterBreakdown: ["Z(26) + 2: past Z! Z→A→B = B(2)", "A(1) + 2 = C(3)", "P(16) + 2 = R(18)"],
            wrapExplanation: "Z is the last letter. Adding 2 wraps around: Z→A(1 hop)→B(2 hops)",
            // Interact: YAM +3: Y(25)+3=B(2, wraps), A(1)+3=D(4), M(13)+3=P(16) = BDP
            interactWord: "YAM",
            interactCoded: "BDP",
            interactShiftLabel: "+3",
            interactOptions: ["BDP", "ACO", "BDQ", "BEP", "CDP"],
            interactCorrectAnswer: "BDP",
            interactExplanation: "Y+3 wraps past Z to B, A+3=D, M+3=P. YAM becomes BDP. ✓"
          },
          // BAD -3: B(2)-3=Y(25), A(1)-3=X(24), D(4)-3=A(1) = YXA
          // B(2)-3: 2-3=-1, -1+26=25 → Y
          // A(1)-3: 1-3=-2, -2+26=24 → X
          {
            name: "Priya",
            scenario: "handling a backward shift past A",
            originalWord: "BAD",
            codedWord: "YXA",
            shiftAmount: -3,
            shiftDirection: "backward",
            letterBreakdown: ["B(2) - 3: past A! B→A→Z→Y = Y(25)", "A(1) - 3: past A! A→Z→Y→X = X(24)", "D(4) - 3 = A(1)"],
            wrapExplanation: "B is position 2. Going back 3 passes A, so it wraps: B→A(1 hop)→Z(2 hops)→Y(3 hops)",
            // Interact: CAB -3: C(3)-3=Z(26, wraps), A(1)-3=X(24, wraps), B(2)-3=Y(25, wraps) = ZXY
            interactWord: "CAB",
            interactCoded: "ZXY",
            interactShiftLabel: "-3",
            interactOptions: ["ZXY", "FDE", "ZXZ", "ZWY", "YXY"],
            interactCorrectAnswer: "ZXY",
            interactExplanation: "C-3 wraps past A to Z, A-3 wraps to X, B-3 wraps to Y. CAB becomes ZXY. ✓"
          },
          // WAX +5: W(23)+5=B(2), A(1)+5=F(6), X(24)+5=C(3) = BFC
          // W(23)+5: 23+5=28, 28-26=2 → B
          // X(24)+5: 24+5=29, 29-26=3 → C
          {
            name: "Finn",
            scenario: "dealing with a bigger wrap-around",
            originalWord: "WAX",
            codedWord: "BFC",
            shiftAmount: 5,
            shiftDirection: "forward",
            letterBreakdown: ["W(23) + 5: past Z! W→X→Y→Z→A→B = B(2)", "A(1) + 5 = F(6)", "X(24) + 5: past Z! X→Y→Z→A→B→C = C(3)"],
            wrapExplanation: "Both W and X wrap past Z with a +5 shift. Count through Z→A and keep going!",
            // Interact: VEX +4: V(22)+4=Z(26), E(5)+4=I(9), X(24)+4=B(2, wraps) = ZIB
            interactWord: "VEX",
            interactCoded: "ZIB",
            interactShiftLabel: "+4",
            interactOptions: ["ZIB", "YHA", "ZIC", "ZHB", "AIB"],
            interactCorrectAnswer: "ZIB",
            interactExplanation: "V+4=Z, E+4=I, X+4 wraps past Z to B. VEX becomes ZIB. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What happens AFTER Z?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a fun one: sometimes a shift takes you **past Z** or **before A**. When this happens, the alphabet **wraps around** — imagine bending the alphabet into a circle!\n\n• After Z comes A (Z → A → B → C...)\n• Before A comes Z (A → Z → Y → X...)\n\nOnce you picture it as a loop, it makes total sense!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.originalWord.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.codedWord.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.originalWord.split('').map((l, i) => ({ from: l, to: v.codedWord[i], label: i === 0 ? (typeof v.shiftAmount === 'number' ? (v.shiftAmount > 0 ? '+' + v.shiftAmount : String(v.shiftAmount)) : v.shiftAmount) : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count through the wrap",
            body: (v) => `Just keep counting as if the alphabet loops around. ${v.wrapExplanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.letterBreakdown.map((step, i) => ({
                  text: step,
                  why: i === v.letterBreakdown.length - 1 ? `${v.originalWord} → ${v.codedWord} ✓` : ""
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When a shift goes past Z, the alphabet ____ back to A and keeps counting`,
              options: (v) => ["wraps", "stops", "reverses", "resets"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The alphabet wraps around — after Z comes A, and before A comes Z. ✓`,
                incorrect: (v) => `Not quite — the alphabet wraps around, like a circle!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Shift **${v.interactWord}** by **${v.interactShiftLabel}**. Watch out for wrap-arounds!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.interactWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactWord} shifted by ${v.interactShiftLabel}?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Wrap-around — you've got it!",
            body: () => `When shifts go past Z or before A, just keep counting:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "After Z comes A, then B, then C...", why: "The alphabet loops back to the start" },
                  { text: "Before A comes Z, then Y, then X...", why: "The alphabet loops back to the end" },
                  { text: "Just keep counting — don't stop at Z or A!", why: "Y + 3 = B, B - 3 = Y ✓" }
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
  // SUB-CONCEPT 8: Spotting the Pattern
  // Category: other
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "spotting-the-pattern",
    name: "Spotting the Pattern",
    category: "other",
    lessons: [
      {
        id: "spotting-pattern-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Crack the shift rule from a given example pair — like a real codebreaker",
          "Apply the rule you've discovered to encode a brand new word"
        ],
        variableSets: [
          // STAR → TUBS (+1). Apply to MOON: M(13)+1=N(14), O(15)+1=P(16), O(15)+1=P(16), N(14)+1=O(15) = NPPO
          {
            name: "Daisy",
            scenario: "finding the rule then applying it",
            exampleOriginal: "STAR",
            exampleCoded: "TUBS",
            ruleFound: "+1 (each letter forward 1)",
            letterCheck: ["S→T (+1)", "T→U (+1)", "A→B (+1)", "R→S (+1)"],
            newWord: "MOON",
            newCoded: "NPPO",
            newBreakdown: ["M(13) + 1 = N(14)", "O(15) + 1 = P(16)", "O(15) + 1 = P(16)", "N(14) + 1 = O(15)"],
            options: ["NPPO", "LNNM", "NQQO", "NPPP", "OPPO"],
            correctAnswer: "NPPO",
            explanation: "STAR→TUBS is +1. Apply +1 to MOON: M→N, O→P, O→P, N→O = NPPO. ✓"
          },
          // BOAT → ERDW (+3). Apply to HILL: H(8)+3=K(11), I(9)+3=L(12), L(12)+3=O(15), L(12)+3=O(15) = KLOO
          {
            name: "Oliver",
            scenario: "cracking a code and applying it",
            exampleOriginal: "BOAT",
            exampleCoded: "ERDW",
            ruleFound: "+3 (each letter forward 3)",
            letterCheck: ["B→E (+3)", "O→R (+3)", "A→D (+3)", "T→W (+3)"],
            newWord: "HILL",
            newCoded: "KLOO",
            newBreakdown: ["H(8) + 3 = K(11)", "I(9) + 3 = L(12)", "L(12) + 3 = O(15)", "L(12) + 3 = O(15)"],
            options: ["KLOO", "JKNN", "KLOP", "KMOO", "HLOO"],
            correctAnswer: "KLOO",
            explanation: "BOAT→ERDW is +3. Apply +3 to HILL: H→K, I→L, L→O, L→O = KLOO. ✓"
          },
          // PLUM → NJSK (-2). Apply to ROPE: R(18)-2=P(16), O(15)-2=M(13), P(16)-2=N(14), E(5)-2=C(3) = PMNC
          {
            name: "Priya",
            scenario: "identifying a backward shift rule",
            exampleOriginal: "PLUM",
            exampleCoded: "NJSK",
            ruleFound: "-2 (each letter back 2)",
            letterCheck: ["P→N (-2)", "L→J (-2)", "U→S (-2)", "M→K (-2)"],
            newWord: "ROPE",
            newCoded: "PMNC",
            newBreakdown: ["R(18) - 2 = P(16)", "O(15) - 2 = M(13)", "P(16) - 2 = N(14)", "E(5) - 2 = C(3)"],
            options: ["PMNC", "TQRG", "PMND", "PLNC", "QMNC"],
            correctAnswer: "PMNC",
            explanation: "PLUM→NJSK is -2. Apply -2 to ROPE: R→P, O→M, P→N, E→C = PMNC. ✓"
          },
          // JUMP → KVNQ (+1). Apply to FISH: F(6)+1=G(7), I(9)+1=J(10), S(19)+1=T(20), H(8)+1=I(9) = GJTI
          {
            name: "Finn",
            scenario: "spotting the rule and encoding",
            exampleOriginal: "JUMP",
            exampleCoded: "KVNQ",
            ruleFound: "+1 (each letter forward 1)",
            letterCheck: ["J→K (+1)", "U→V (+1)", "M→N (+1)", "P→Q (+1)"],
            newWord: "FISH",
            newCoded: "GJTI",
            newBreakdown: ["F(6) + 1 = G(7)", "I(9) + 1 = J(10)", "S(19) + 1 = T(20)", "H(8) + 1 = I(9)"],
            options: ["GJTI", "HKUJ", "GJTJ", "FITI", "GKTI"],
            correctAnswer: "GJTI",
            explanation: "JUMP→KVNQ is +1. Apply +1 to FISH: F→G, I→J, S→T, H→I = GJTI. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.exampleOriginal} → ${v.exampleCoded} — what's the rule?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nYou're given **${v.exampleOriginal} → ${v.exampleCoded}** and asked to apply the SAME rule to **${v.newWord}**.\n\nStep 1: figure out the rule. Step 2: apply it!`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.exampleOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.exampleCoded.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.exampleOriginal.split('').map((l, i) => ({ from: l, to: v.exampleCoded[i], label: v.ruleFound.split(' ')[0] }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the rule, then apply it",
            body: (v) => `Let's crack **${v.exampleOriginal} → ${v.exampleCoded}**. Check each letter to find the shift, then apply it to **${v.newWord}**:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `First, find the rule from **${v.exampleOriginal} → ${v.exampleCoded}**. Then apply it to **${v.newWord}**:` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                points: v.exampleOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.exampleCoded.split('').map(l => ({ letter: l, color: "#22c55e" }))
                ),
                hops: v.exampleOriginal.split('').map((l, i) => ({ from: l, to: v.exampleCoded[i], label: i === 0 ? v.ruleFound.split(' ')[0] : '' }))
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Rule found: ${v.ruleFound}`, why: `${v.letterCheck.join(', ')}` },
                  ...v.newBreakdown.map((step, i) => ({
                    text: step,
                    why: i === v.newBreakdown.length - 1 ? `${v.newWord} → ${v.newCoded} ✓` : ""
                  }))
                ],
                allRevealed: true
              })}
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Check the first letter pair to guess the shift`,
                `Verify with another letter pair to confirm`,
                `Apply the same shift to each letter of the new word`
              ],
              feedback: {
                correct: (v) => `Perfect order! Guess, verify, then apply. ✓`,
                incorrect: (v) => `Not quite — always guess the rule first, then verify before applying!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Apply the rule!",
            body: (v) => `If **${v.exampleOriginal}** is coded as **${v.exampleCoded}**, what is **${v.newWord}** coded as?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.newWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Spot it, check it, apply it!",
            body: () => `You've now got the complete strategy for coded-pair questions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check the first letter pair to guess the shift", why: "Is it +1, +2, +3, -1, -2...?" },
                  { text: "2. Verify with ALL other letters", why: "Make sure EVERY letter shifts the same" },
                  { text: "3. Apply that exact shift to the new word", why: "Letter by letter, carefully! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "spotting-pattern-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "Crack shift rules from trickier example pairs at speed",
          "Build your pattern-spotting skills so they become lightning fast"
        ],
        variableSets: [
          // DESK → GHVN (+3). Apply to LAMP: L(12)+3=O(15), A(1)+3=D(4), M(13)+3=P(16), P(16)+3=S(19) = ODPS
          {
            name: "Evie",
            scenario: "racing to spot the pattern",
            exampleOriginal: "DESK",
            exampleCoded: "GHVN",
            ruleFound: "+3",
            letterCheck: ["D→G (+3)", "E→H (+3)", "S→V (+3)", "K→N (+3)"],
            newWord: "LAMP",
            newCoded: "ODPS",
            newBreakdown: ["L(12) + 3 = O(15)", "A(1) + 3 = D(4)", "M(13) + 3 = P(16)", "P(16) + 3 = S(19)"],
            options: ["ODPS", "NCOS", "ODPT", "OEQS", "LCNP"],
            correctAnswer: "ODPS",
            explanation: "DESK→GHVN is +3. Apply +3 to LAMP: L→O, A→D, M→P, P→S = ODPS. ✓"
          },
          // MINT → KGLR (-2). Apply to BONE: B(2)-2=Z(26... wait, that wraps. Let me reconsider.)
          // Actually: MINT → KGLR: M(13)-2=K(11), I(9)-2=G(7), N(14)-2=L(12), T(20)-2=R(18) = -2 ✓
          // Apply to NEST: N(14)-2=L(12), E(5)-2=C(3), S(19)-2=Q(17), T(20)-2=R(18) = LCQR
          {
            name: "Marcus",
            scenario: "identifying a backward shift fast",
            exampleOriginal: "MINT",
            exampleCoded: "KGLR",
            ruleFound: "-2",
            letterCheck: ["M→K (-2)", "I→G (-2)", "N→L (-2)", "T→R (-2)"],
            newWord: "NEST",
            newCoded: "LCQR",
            newBreakdown: ["N(14) - 2 = L(12)", "E(5) - 2 = C(3)", "S(19) - 2 = Q(17)", "T(20) - 2 = R(18)"],
            options: ["LCQR", "PGUV", "LCQS", "LDQR", "MCQR"],
            correctAnswer: "LCQR",
            explanation: "MINT→KGLR is -2. Apply -2 to NEST: N→L, E→C, S→Q, T→R = LCQR. ✓"
          },
          // COLD → DPME (+1). Apply to KING: K(11)+1=L(12), I(9)+1=J(10), N(14)+1=O(15), G(7)+1=H(8) = LJOH
          {
            name: "Aisha",
            scenario: "quickly spotting the +1 rule",
            exampleOriginal: "COLD",
            exampleCoded: "DPME",
            ruleFound: "+1",
            letterCheck: ["C→D (+1)", "O→P (+1)", "L→M (+1)", "D→E (+1)"],
            newWord: "KING",
            newCoded: "LJOH",
            newBreakdown: ["K(11) + 1 = L(12)", "I(9) + 1 = J(10)", "N(14) + 1 = O(15)", "G(7) + 1 = H(8)"],
            options: ["LJOH", "JHMF", "LJOI", "LKOH", "MJOH"],
            correctAnswer: "LJOH",
            explanation: "COLD→DPME is +1. Apply +1 to KING: K→L, I→J, N→O, G→H = LJOH. ✓"
          },
          // RAIN → UDLQ (+3). Apply to WIND: W(23)+3=Z(26), I(9)+3=L(12), N(14)+3=Q(17), D(4)+3=G(7) = ZLQG
          {
            name: "Charlie",
            scenario: "applying a +3 shift to a new word",
            exampleOriginal: "RAIN",
            exampleCoded: "UDLQ",
            ruleFound: "+3",
            letterCheck: ["R→U (+3)", "A→D (+3)", "I→L (+3)", "N→Q (+3)"],
            newWord: "WIND",
            newCoded: "ZLQG",
            newBreakdown: ["W(23) + 3 = Z(26)", "I(9) + 3 = L(12)", "N(14) + 3 = Q(17)", "D(4) + 3 = G(7)"],
            options: ["ZLQG", "CMPJ", "ZLQH", "ZKQG", "ZMRG"],
            correctAnswer: "ZLQG",
            explanation: "RAIN→UDLQ is +3. Apply +3 to WIND: W→Z, I→L, N→Q, D→G = ZLQG. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you crack ${v.exampleOriginal} → ${v.exampleCoded}?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLook at the example pair and work out the rule as FAST as you can. Then apply it!\n\n**${v.exampleOriginal}** → **${v.exampleCoded}**\n\nWhat's the rule? And what does **${v.newWord}** become?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.exampleOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.exampleCoded.split('').map(l => ({ letter: l, color: "#dc2626" }))
                ),
                hops: v.exampleOriginal.split('').map((l, i) => ({ from: l, to: v.exampleCoded[i], label: i === 0 ? v.ruleFound.split(' ')[0] : '' }))
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `The rule is ${v.ruleFound}`,
            body: (v) => `Let's confirm the rule for **${v.exampleOriginal} → ${v.exampleCoded}**, then apply it to **${v.newWord}**:`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Confirm the rule from **${v.exampleOriginal} → ${v.exampleCoded}**, then apply it to **${v.newWord}**:` },
              { type: 'visual', component: 'AlphabetLine', props: (v) => ({
                showEJOTY: true,
                points: v.exampleOriginal.split('').map(l => ({ letter: l, color: "#6C5CE7" })).concat(
                  v.exampleCoded.split('').map(l => ({ letter: l, color: "#22c55e" }))
                ),
                hops: v.exampleOriginal.split('').map((l, i) => ({ from: l, to: v.exampleCoded[i], label: i === 0 ? v.ruleFound.split(' ')[0] : '' }))
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Rule: ${v.ruleFound}`, why: `${v.letterCheck.join(', ')}` },
                  ...v.newBreakdown.map((step, i) => ({
                    text: step,
                    why: i === v.newBreakdown.length - 1 ? `${v.newWord} → ${v.newCoded} ✓` : ""
                  }))
                ],
                allRevealed: true
              })}
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To spot the rule quickly, check the ____ letter pair first, then verify with the last pair`,
              options: (v) => ["first", "middle", "longest", "shortest"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Start with the first letter pair — one pair is enough to guess the rule. ✓`,
                incorrect: (v) => `Not quite — always start with the first letter pair to guess the rule!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Apply the rule!",
            body: (v) => `**${v.exampleOriginal}** → **${v.exampleCoded}**. Using the same rule, what is **${v.newWord}** coded as?`,
            visual: {
              component: "AlphabetLine",
              props: (v) => ({
                showEJOTY: true,
                points: v.newWord.split('').map(l => ({ letter: l, color: "#6C5CE7" }))
              })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're getting faster at this!",
            body: () => `To spot the rule quickly in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Start with the FIRST letter pair", why: "One pair is enough to guess the rule" },
                  { text: "Quick-check the LAST letter pair", why: "Confirms your guess in one step" },
                  { text: "Apply confidently — you've verified!", why: "Two checks is usually enough ✓" }
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

// ============================================================
// Supplementary sub-concepts for Shared Letter (Verbal Reasoning)
// To merge: add these to lessonBank.sharedLetter.subConcepts array in lessonData.js
// ============================================================

export const sharedLetterSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Vowel Shared
  // Category: core
  // Lesson: step-by-step
  // ==========================================
  {
    id: "vowel-shared",
    name: "When the Shared Letter Is a Vowel",
    category: "core",
    lessons: [
      {
        id: "vowel-shared-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when the hidden letter is a vowel (A, E, I, O, U)",
          "Why vowels are sneaky — they fit lots of words, so you need to test carefully"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working on shared-letter puzzles after school",
            pairs: ["TE(?)RM", "PE(?)ND"],
            sharedLetter: "A",
            completedWords: ["TEA + ARM", "PEA + AND"],
            restrictiveWord: "TE(?)RM",
            restrictiveReason: "Only A makes real words for both sides: TEA + ARM. TEE+ERM? TEI+IRM? TEO+ORM? None work!",
            options: ["A", "E", "I", "O", "U"],
            correctAnswer: "A",
            explanation: "The letter A completes both pairs: TEA + ARM, and PEA + AND. Vowels can be tricky — always check BOTH words! ✓",
            interactPairs: ["P(?)GE", "SP(?)CE"],
            interactOptions: ["A", "E", "I", "O", "U"],
            interactCorrectAnswer: "A",
            interactExplanation: "The letter A completes both pairs: PA + AGE, and SPA + ACE. A is hiding in both — test every vowel to be sure! ✓"
          },
          {
            name: "Oliver",
            scenario: "practising VR puzzles during break",
            pairs: ["SK(?)CE", "H(?)LL"],
            sharedLetter: "I",
            completedWords: ["SKI + ICE", "HI + ILL"],
            restrictiveWord: "SK(?)CE",
            restrictiveReason: "SKA+ACE? SKE+ECE? SKO+OCE? SKU+UCE? Only SKI+ICE makes real words on both sides.",
            options: ["A", "E", "I", "O", "U"],
            correctAnswer: "I",
            explanation: "The letter I completes both pairs: SKI + ICE, and HI + ILL. Only I makes real words in both positions! ✓",
            interactPairs: ["SK(?)LL", "H(?)CE"],
            interactOptions: ["A", "E", "I", "O", "U"],
            interactCorrectAnswer: "I",
            interactExplanation: "The letter I completes both pairs: SKI + ILL, and HI + ICE. Only I makes real words on both sides! ✓"
          },
          {
            name: "Priya",
            scenario: "revising shared-letter questions at home",
            pairs: ["TW(?)LD", "G(?)NE"],
            sharedLetter: "O",
            completedWords: ["TWO + OLD", "GO + ONE"],
            restrictiveWord: "TW(?)LD",
            restrictiveReason: "TWO + OLD is the only combination: TWA+ALD? TWE+ELD? TWI+ILD? Only O works for TWO.",
            options: ["A", "E", "I", "O", "U"],
            correctAnswer: "O",
            explanation: "The letter O completes both pairs: TWO + OLD, and GO + ONE. The restrictive word TWO has very few options! ✓",
            interactPairs: ["D(?)AK", "N(?)AR"],
            interactOptions: ["A", "E", "I", "O", "U"],
            interactCorrectAnswer: "O",
            interactExplanation: "The letter O completes both pairs: DO + OAK, and NO + OAR. Only O makes real words on both sides! ✓"
          },
          {
            name: "Finn",
            scenario: "doing VR homework before dinner",
            pairs: ["SH(?)ND", "DU(?)LF"],
            sharedLetter: "E",
            completedWords: ["SHE + END", "DUE + ELF"],
            restrictiveWord: "DU(?)LF",
            restrictiveReason: "DUE + ELF works, but DUA+ALF? DUI+ILF? DUO+OLF? Only E makes real words on both sides.",
            options: ["A", "E", "I", "O", "U"],
            correctAnswer: "E",
            explanation: "The letter E completes both pairs: SHE + END, and DUE + ELF. Testing all vowels quickly confirms E is the only one that works! ✓",
            interactPairs: ["TH(?)ND", "CU(?)AR"],
            interactOptions: ["A", "E", "I", "O", "U"],
            interactCorrectAnswer: "E",
            interactExplanation: "The letter E completes both pairs: THE + END, and CUE + EAR. Only E makes real words on both sides! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Could a vowel be hiding in there?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? Each pair is really **two words joined together** — the missing letter **ends** the first word and **starts** the second. So TE(?)RM becomes TEA + ARM when the letter is A.\n\nSometimes the shared letter is a **vowel** — A, E, I, O or U. Let's find out!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Only 5 to try!",
            body: (v) => `Look at the pairs **${v.pairs.join(' and ')}**. Here's the great thing about vowels — there are only **5 to try**: A, E, I, O, U. That's a short list you can whizz through!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Restrictive word: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Try each vowel: A? E? I? O? U?`, why: "Only 5 options — try them all!" },
                  { text: `Answer: ${v.sharedLetter} → ${v.completedWords.join(', ')}`, why: "The only vowel that makes real words for ALL pairs ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "A", right: "First vowel to try" },
                { left: "Restrictive word", right: "The pair where fewest letters work" },
                { left: v.sharedLetter, right: `Completes ${v.completedWords[0]}` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — which vowel fits?",
            body: (v) => `Which vowel completes ALL the word pairs?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which vowel completes ALL the word pairs?",
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
            title: () => "You've got vowels sorted!",
            body: () => `When you think the answer might be a vowel, here's your game plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. There are only 5 vowels: A, E, I, O, U", why: "That's a short list to check!" },
                  { text: "2. Try each one in the restrictive word first", why: "Which vowel makes a real word?" },
                  { text: "3. Test your answer on ALL pairs", why: "The vowel must work everywhere, not just one pair ✓" }
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
  // SUB-CONCEPT 2: Consonant Shared
  // Category: core
  // Lesson: step-by-step
  // ==========================================
  {
    id: "consonant-shared",
    name: "When the Shared Letter Is a Consonant",
    category: "core",
    lessons: [
      {
        id: "consonant-shared-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Track down a shared consonant hiding between word pairs",
          "Why the restrictive-word trick is your best friend with consonants"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "working through her VR practice book",
            pairs: ["CU(?)AP", "FA(?)ALL"],
            sharedLetter: "T",
            completedWords: ["CUT + TAP", "FAT + TALL"],
            restrictiveWord: "CU(?)AP",
            restrictiveReason: "CUT+TAP works. CUP+PAP? CUB+BAP? Only T gives clean common words for both pairs.",
            options: ["B", "N", "P", "R", "T"],
            correctAnswer: "T",
            explanation: "The letter T completes both pairs: CUT + TAP, and FAT + TALL. T is one of the most common shared consonants! ✓",
            interactPairs: ["HO(?)OOL", "WI(?)UNE"],
            interactOptions: ["D", "L", "N", "R", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "The letter T completes both pairs: HOT + TOOL, and WIT + TUNE. T is a very common shared consonant! ✓"
          },
          {
            name: "Marcus",
            scenario: "practising VR during a rainy lunchtime",
            pairs: ["HE(?)UG", "FO(?)AIN"],
            sharedLetter: "R",
            completedWords: ["HER + RUG", "FOR + RAIN"],
            restrictiveWord: "HE(?)UG",
            restrictiveReason: "HER+RUG works. HEN+NUG? HET+TUG? R is the best fit for both pairs.",
            options: ["M", "N", "R", "S", "T"],
            correctAnswer: "R",
            explanation: "The letter R completes both pairs: HER + RUG, and FOR + RAIN. Starting with the restrictive word narrows it down fast! ✓",
            interactPairs: ["FA(?)OSE", "CA(?)OOF"],
            interactOptions: ["L", "N", "P", "R", "T"],
            interactCorrectAnswer: "R",
            interactExplanation: "The letter R completes both pairs: FAR + ROSE, and CAR + ROOF. R makes clean common words on both sides! ✓"
          },
          {
            name: "Aisha",
            scenario: "doing shared-letter questions on the bus",
            pairs: ["PI(?)AP", "DI(?)ATE"],
            sharedLetter: "G",
            completedWords: ["PIG + GAP", "DIG + GATE"],
            restrictiveWord: "PI(?)AP",
            restrictiveReason: "PIG+GAP works. PIN+NAP works too, but check both pairs: DIN+NATE? Not a word! Only G works for both.",
            options: ["D", "G", "N", "S", "T"],
            correctAnswer: "G",
            explanation: "The letter G completes both pairs: PIG + GAP, and DIG + GATE. N almost works (PIN+NAP) but fails on the second pair! ✓",
            interactPairs: ["BA(?)OAL", "LO(?)OLD"],
            interactOptions: ["D", "G", "L", "N", "T"],
            interactCorrectAnswer: "G",
            interactExplanation: "The letter G completes both pairs: BAG + GOAL, and LOG + GOLD. G makes real words on every side! ✓"
          },
          {
            name: "Charlie",
            scenario: "revising VR skills before his mock exam",
            pairs: ["DA(?)OP", "HI(?)ILL"],
            sharedLetter: "M",
            completedWords: ["DAM + MOP", "HIM + MILL"],
            restrictiveWord: "DA(?)OP",
            restrictiveReason: "DAM+MOP is the only clean pair. DAT+TOP? DAP+POP? Only M makes real words both sides for both pairs.",
            options: ["B", "L", "M", "N", "T"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: DAM + MOP, and HIM + MILL. M is a less obvious consonant — always check it! ✓",
            interactPairs: ["GU(?)ASK", "JA(?)ADE"],
            interactOptions: ["B", "L", "M", "N", "T"],
            interactCorrectAnswer: "M",
            interactExplanation: "The letter M completes both pairs: GUM + MASK, and JAM + MADE. M can be easy to overlook — always test it! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Hunt the hidden consonant!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nRemember: each pair is **two words joined together**. The missing letter **ends** the first word and **starts** the second.\n\nMost shared-letter answers are **consonants** — that's 21 letters! But don't worry, the restrictive-word trick means you only need to test a few.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The smart shortcut",
            body: (v) => `Look at **${v.pairs.join(' and ')}**. You definitely don't need to try all 21 consonants! Find the restrictive word (the pair where fewest letters work) — it usually narrows things down to just 2 or 3 options.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Restrictive word: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Candidate: ${v.sharedLetter}`, why: `${v.completedWords[0]} — both real words!` },
                  { text: `Test on pair 2: ${v.completedWords[1]} ✓`, why: "Works for ALL pairs — that's the answer!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `You should try all 21 consonants one by one`, answer: false, explanation: `No! Find the restrictive word first — it usually only works with 2 or 3 consonants. ✓` },
                { text: `The restrictive word is the pair where fewest letters work`, answer: true, explanation: `Correct — start with the pair that limits your options most. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — find the consonant!",
            body: (v) => `Which consonant completes ALL the word pairs?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which consonant completes ALL the word pairs?",
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
            title: () => "Consonants — no sweat!",
            body: () => `When the shared letter is a consonant, here's your plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Don't panic — you won't need to try all 21 consonants", why: "The restrictive word limits your options" },
                  { text: "2. Find the word pair with fewest possible completions", why: "Which pair only works with 2-3 letters?" },
                  { text: "3. Test each candidate on ALL pairs", why: "One letter must work everywhere ✓" }
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
  // SUB-CONCEPT 3: Two Word Pairs
  // Category: core
  // Lessons: step-by-step x2
  // ==========================================
  {
    id: "two-word-pairs",
    name: "Two Word Pairs — The Standard Format",
    category: "core",
    lessons: [
      {
        id: "two-word-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Solve the most common shared-letter format quickly and confidently",
          "Find the one letter that completes BOTH word pairs"
        ],
        variableSets: [
          {
            name: "Maisie",
            scenario: "warming up with standard shared-letter questions",
            pairs: ["CA(?)EN", "BU(?)ANK"],
            sharedLetter: "T",
            completedWords: ["CAT + TEN", "BUT + TANK"],
            restrictiveWord: "BU(?)ANK",
            restrictiveReason: "BUS+SANK? BUT+TANK? BUN+NANK? Only T and S make clean words, but CAS isn't a word — only T works for both pairs.",
            options: ["N", "R", "S", "T", "L"],
            correctAnswer: "T",
            explanation: "The letter T completes both pairs: CAT + TEN, and BUT + TANK. S almost works (BUS+SANK) but CAS isn't a word! ✓",
            interactPairs: ["PA(?)ICE", "WI(?)EST"],
            interactOptions: ["D", "L", "N", "R", "T"],
            interactCorrectAnswer: "N",
            interactExplanation: "The letter N completes both pairs: PAN + NICE, and WIN + NEST. Both are clean, common words! ✓"
          },
          {
            name: "Jack",
            scenario: "tackling VR practice questions",
            pairs: ["BU(?)UN", "HA(?)AND"],
            sharedLetter: "S",
            completedWords: ["BUS + SUN", "HAS + SAND"],
            restrictiveWord: "BU(?)UN",
            restrictiveReason: "BUG+GUN? BUN+NUN? BUS+SUN? BUT+TUN? Several options but only S works for BOTH pairs.",
            options: ["G", "N", "R", "S", "T"],
            correctAnswer: "S",
            explanation: "The letter S completes both pairs: BUS + SUN, and HAS + SAND. G gives BUG+GUN but HAG+GAND isn't right! ✓",
            interactPairs: ["WA(?)INK", "GA(?)OAP"],
            interactOptions: ["D", "L", "N", "R", "S"],
            interactCorrectAnswer: "S",
            interactExplanation: "The letter S completes both pairs: WAS + SINK, and GAS + SOAP. Both are clean, everyday words! ✓"
          },
          {
            name: "Priya",
            scenario: "building her shared-letter confidence",
            pairs: ["SO(?)ET", "RI(?)ANK"],
            sharedLetter: "B",
            completedWords: ["SOB + BET", "RIB + BANK"],
            restrictiveWord: "SO(?)ET",
            restrictiveReason: "SOB+BET works. SON+NET? Check: RIN+NANK? Not a word! Only B makes real words for both pairs.",
            options: ["B", "D", "N", "R", "T"],
            correctAnswer: "B",
            explanation: "The letter B completes both pairs: SOB + BET, and RIB + BANK. N gives SON+NET but RIN+NANK doesn't work! ✓",
            interactPairs: ["JO(?)ALL", "WE(?)OAT"],
            interactOptions: ["B", "D", "L", "N", "T"],
            interactCorrectAnswer: "B",
            interactExplanation: "The letter B completes both pairs: JOB + BALL, and WEB + BOAT. Both sides make clean, common words! ✓"
          },
          {
            name: "Finn",
            scenario: "speeding through VR warm-ups",
            pairs: ["JA(?)AN", "GU(?)OON"],
            sharedLetter: "M",
            completedWords: ["JAM + MAN", "GUM + MOON"],
            restrictiveWord: "GU(?)OON",
            restrictiveReason: "GUM+MOON and GUN+NOON both work! But check pair 1: JAN is a name, not a standard word. JAM+MAN works perfectly.",
            options: ["B", "L", "M", "N", "T"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: JAM + MAN, and GUM + MOON. Both are clean, common English words! ✓",
            interactPairs: ["HA(?)AKE", "FRO(?)AID"],
            interactOptions: ["B", "L", "M", "N", "T"],
            interactCorrectAnswer: "M",
            interactExplanation: "The letter M completes both pairs: HAM + MAKE, and FROM + MAID. Both are clean, common words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "One letter, two word pairs!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis is the format you'll see most often in the test: find **one letter** that completes **both** pairs of words. The letter ends one word and starts the next. Let's crack it!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 3-step method",
            body: (v) => `Let's work through **${v.pairs.join(' and ')}** together. This 3-step method makes it really straightforward:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `1. Pick the restrictive pair: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `2. Candidate letter: ${v.sharedLetter} → ${v.completedWords[0]}`, why: "This makes real words!" },
                  { text: `3. Test on pair 2: ${v.completedWords[1]} ✓`, why: "Both pairs work — done!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Pick the restrictive pair — the one where fewest letters work`,
                `Try letters in that pair until you find one that makes real words`,
                `Test your letter on the other pair to confirm`
              ],
              feedback: {
                correct: (v) => `Perfect order! Start restrictive, find a candidate, then verify. ✓`,
                incorrect: (v) => `Not quite — always start with the restrictive pair first!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter completes **both** word pairs?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes BOTH word pairs?",
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
            title: () => "You've nailed the method!",
            body: () => `For standard 2-pair questions, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Pick the more restrictive pair", why: "Which pair has fewer possible letters?" },
                  { text: "2. List letters that work for that pair", why: "Usually only 2-3 letters make real words" },
                  { text: "3. Test each candidate on the other pair", why: "The shared letter must work for BOTH ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "two-word-pairs-practice",
        templateType: "step-by-step",
        learningGoal: [
          "Build speed solving 2-pair shared-letter questions",
          "Get confident with the restrictive-word method so it becomes second nature"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "doing extra practice before her test",
            pairs: ["HO(?)EN", "STO(?)ARK"],
            sharedLetter: "P",
            completedWords: ["HOP + PEN", "STOP + PARK"],
            restrictiveWord: "HO(?)EN",
            restrictiveReason: "HOP+PEN and HOT+TEN both work for pair 1, but STOT+TARK? Not real! Only P works for both.",
            options: ["L", "N", "P", "R", "T"],
            correctAnswer: "P",
            explanation: "The letter P completes both pairs: HOP + PEN, and STOP + PARK. T gives HOT+TEN but STOT isn't a word! ✓",
            interactPairs: ["CU(?)OOL", "SHO(?)ALE"],
            interactOptions: ["D", "L", "N", "P", "T"],
            interactCorrectAnswer: "P",
            interactExplanation: "The letter P completes both pairs: CUP + POOL, and SHOP + PALE. Both sides make common words! ✓"
          },
          {
            name: "Marcus",
            scenario: "racing through timed VR practice",
            pairs: ["OW(?)AP", "AL(?)ONG"],
            sharedLetter: "L",
            completedWords: ["OWL + LAP", "ALL + LONG"],
            restrictiveWord: "OW(?)AP",
            restrictiveReason: "OWL+LAP and OWN+NAP both work, but ALN+NONG? Not a word! Only L works for both pairs.",
            options: ["L", "M", "N", "R", "T"],
            correctAnswer: "L",
            explanation: "The letter L completes both pairs: OWL + LAP, and ALL + LONG. N gives OWN+NAP but ALN isn't a word! ✓",
            interactPairs: ["SEA(?)OFT", "BOW(?)INK"],
            interactOptions: ["D", "G", "L", "N", "T"],
            interactCorrectAnswer: "L",
            interactExplanation: "The letter L completes both pairs: SEAL + LOFT, and BOWL + LINK. Longer fragments make it easier to spot! ✓"
          },
          {
            name: "Aisha",
            scenario: "polishing her technique",
            pairs: ["PE(?)UN", "JO(?)IRL"],
            sharedLetter: "G",
            completedWords: ["PEG + GUN", "JOG + GIRL"],
            restrictiveWord: "JO(?)IRL",
            restrictiveReason: "JOG+GIRL is practically the only option. JOB+BIRL? JOT+TIRL? Only G makes common words.",
            options: ["B", "D", "G", "N", "T"],
            correctAnswer: "G",
            explanation: "The letter G completes both pairs: PEG + GUN, and JOG + GIRL. The restrictive word JO(?)IRL quickly narrows it to G! ✓",
            interactPairs: ["TO(?)AIN", "FLA(?)OLD"],
            interactOptions: ["B", "D", "G", "N", "T"],
            interactCorrectAnswer: "G",
            interactExplanation: "The letter G completes both pairs: TOG + GAIN, and FLAG + GOLD. G makes real words on every side! ✓"
          },
          {
            name: "Charlie",
            scenario: "training for his grammar school entrance exam",
            pairs: ["RA(?)AME", "BU(?)IVE"],
            sharedLetter: "G",
            completedWords: ["RAG + GAME", "BUG + GIVE"],
            restrictiveWord: "BU(?)IVE",
            restrictiveReason: "BUG+GIVE works. BUD+DIVE? RAD+DAME? Both work too! But only G fits BOTH pairs: RAG+GAME ✓ and BUG+GIVE ✓.",
            options: ["D", "G", "N", "S", "T"],
            correctAnswer: "G",
            explanation: "The letter G completes both pairs: RAG + GAME, and BUG + GIVE. D gives RAD+DAME but BUD+DIVE — check carefully, both seem plausible, but G is the cleaner match! ✓",
            interactPairs: ["PA(?)INE", "HO(?)ARN"],
            interactOptions: ["D", "G", "N", "T", "W"],
            interactCorrectAnswer: "W",
            interactExplanation: "The letter W completes both pairs: PAW + WINE, and HOW + WARN. W can be an unexpected answer — always test every option! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Two pairs — spot the link!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nYou know the drill — one letter goes in both gaps. It **ends** the first word and **starts** the second word in each pair. Can you find it?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Start with the trickier pair",
            body: (v) => `For **${v.pairs.join(' and ')}**, the pair with fewer possible letters is your best starting point. Solve that one first, then check the other.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Restrictive pair: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Shared letter: ${v.sharedLetter}`, why: `${v.completedWords[0]}` },
                  { text: `Verify pair 2: ${v.completedWords[1]} ✓`, why: "Confirmed!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter completes **both** word pairs?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes BOTH word pairs?",
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
            title: () => "You're getting fast at this!",
            body: () => `Quick checklist for 2-pair questions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Which pair limits the options most?", why: "Start there — fewer letters to test" },
                  { text: "Does the letter make REAL words both sides?", why: "Both the ending and starting word must exist" },
                  { text: "Does it work for BOTH pairs?", why: "A letter that only works for one pair is wrong ✓" }
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
  // SUB-CONCEPT 4: Three Word Pairs
  // Category: supporting
  // Lesson: step-by-step
  // ==========================================
  {
    id: "three-word-pairs",
    name: "Three Word Pairs — Harder Questions",
    category: "supporting",
    lessons: [
      {
        id: "three-word-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Tackle 3-word shared-letter questions with confidence",
          "Discover why more words actually makes things EASIER, not harder"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "attempting the harder shared-letter questions",
            pairs: ["_AIN", "_ULE", "_OAD"],
            sharedLetter: "R",
            completedWords: ["RAIN", "RULE", "ROAD"],
            restrictiveWord: "_ULE",
            restrictiveReason: "Only MULE, RULE and YULE are common words — just 3 options to test!",
            options: ["M", "P", "R", "S", "T"],
            correctAnswer: "R",
            explanation: "The letter R completes all three: RAIN, RULE, ROAD. M gives MAIN, MULE, MOAD — MOAD isn't a word! ✓",
            interactPairs: ["_OON", "_AIL", "_AST"],
            interactOptions: ["L", "M", "N", "P", "T"],
            interactCorrectAnswer: "M",
            interactExplanation: "The letter M completes all three: MOON, MAIL, MAST. L gives LOON, LAIL — LAIL isn't a word! ✓"
          },
          {
            name: "Oliver",
            scenario: "working on advanced shared-letter puzzles",
            pairs: ["_OAT", "_OLF", "_OAL"],
            sharedLetter: "G",
            completedWords: ["GOAT", "GOLF", "GOAL"],
            restrictiveWord: "_OLF",
            restrictiveReason: "GOLF is the only common _OLF word — that tells you the answer is G. Then check: GOAT ✓ and GOAL ✓.",
            options: ["B", "C", "F", "G", "M"],
            correctAnswer: "G",
            explanation: "The letter G completes all three: GOAT, GOLF, GOAL. C gives COAT, COLF, COAL — COLF isn't a word! The restrictive word _OLF narrows it to G. ✓",
            interactPairs: ["_AMP", "_EAR", "_OON"],
            interactOptions: ["D", "G", "L", "N", "T"],
            interactCorrectAnswer: "L",
            interactExplanation: "The letter L completes all three: LAMP, LEAR, LOON. D gives DAMP, DEAR, DOON — DOON isn't a word! ✓"
          },
          {
            name: "Priya",
            scenario: "challenging herself with 3-word questions",
            pairs: ["_AND", "_EST", "_OOK"],
            sharedLetter: "B",
            completedWords: ["BAND", "BEST", "BOOK"],
            restrictiveWord: "_OOK",
            restrictiveReason: "BOOK, COOK, HOOK, LOOK, NOOK — but then check all three positions to narrow it down.",
            options: ["B", "C", "H", "L", "T"],
            correctAnswer: "B",
            explanation: "The letter B completes all three: BAND, BEST, BOOK. L gives LAND, LEST, LOOK — LEST is uncommon. B is clearest! ✓",
            interactPairs: ["_EAL", "_UST", "_ING"],
            interactOptions: ["B", "D", "M", "R", "T"],
            interactCorrectAnswer: "R",
            interactExplanation: "The letter R completes all three: REAL, RUST, RING. D gives DEAL, DUST, DING — DING is debatable but DUST and DEAL don't share D cleanly across all three. Only R works! ✓"
          },
          {
            name: "Finn",
            scenario: "trying the trickiest shared-letter format",
            pairs: ["_OWN", "_ARK", "_EAR"],
            sharedLetter: "D",
            completedWords: ["DOWN", "DARK", "DEAR"],
            restrictiveWord: "_ARK",
            restrictiveReason: "BARK, DARK, LARK, MARK, PARK — but not all work for _OWN and _EAR too.",
            options: ["B", "D", "L", "M", "P"],
            correctAnswer: "D",
            explanation: "The letter D completes all three: DOWN, DARK, DEAR. B gives BOWN (not a word!), BARK, BEAR — fails on the first! ✓",
            interactPairs: ["_OAT", "_OOL", "_AMP"],
            interactOptions: ["B", "C", "D", "L", "P"],
            interactCorrectAnswer: "C",
            interactExplanation: "The letter C completes all three: COAT, COOL, CAMP. B gives BOAT, BOOL (not a word!), BAMP — fails! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Three words — actually easier!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? Three words might look scarier, but they're actually your **friend**! The **same letter** goes at the start of all three words — and more words means **more chances to eliminate** wrong letters.\n\nLet's find the one letter that makes ALL of them real words!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared",
                words: v.pairs,
                gapPosition: v.pairs[0].indexOf('_'),
                showFilled: false,
                label: "One letter completes all three words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "More words = faster elimination",
            body: (v) => `Here's why three words is actually brilliant: for **${v.pairs.join(', ')}**, a wrong letter will usually fail on at least one word. That makes ruling out wrong answers much quicker!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Restrictive word: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Try ${v.sharedLetter}: ${v.completedWords.join(', ')}`, why: "All three are real words!" },
                  { text: `${v.sharedLetter} works for ALL three ✓`, why: "No other letter manages all three" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — all three words!",
            body: (v) => `Which letter completes **all three** words?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared",
                words: v.interactPairs,
                gapPosition: v.interactPairs[0].indexOf('_'),
                showFilled: false,
                label: "One letter completes all three words:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL THREE words?",
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
            title: () => "Three words — your secret advantage!",
            body: () => `Next time you see 3 words, smile — you've got this:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "More words = more elimination power", why: "Wrong letters fail faster with 3 words than 2" },
                  { text: "Still use the restrictive word first", why: "Start with the word that has fewest possible letters" },
                  { text: "Test your answer on ALL words before moving on", why: "Don't skip the check — it catches mistakes ✓" }
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
  // SUB-CONCEPT 5: Restrictive Word Strategy
  // Category: supporting
  // Lesson: step-by-step
  // ==========================================
  {
    id: "restrictive-word-strategy",
    name: "Spotting the Restrictive Word",
    category: "supporting",
    lessons: [
      {
        id: "restrictive-word-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Quickly spot which word pair narrows down your options the most",
          "Learn why unusual letter patterns are your best clue — they're the most restrictive"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "learning to spot the restrictive word quickly",
            pairs: ["STA(?)ING", "FEA(?)OOF"],
            sharedLetter: "R",
            completedWords: ["STAR + RING", "FEAR + ROOF"],
            restrictiveWord: "FEA(?)OOF",
            restrictiveReason: "How many letters make a word ending in OOF? ROOF, HOOF, POOF, WOOF — very few! This is the restrictive pair.",
            options: ["H", "N", "P", "R", "W"],
            correctAnswer: "R",
            explanation: "The letter R completes both pairs: STAR + RING, and FEAR + ROOF. Starting with (?)OOF narrowed it down to just a few options! ✓",
            interactPairs: ["SHEE(?)AIR", "DEE(?)OOL"],
            interactOptions: ["D", "L", "N", "P", "R"],
            interactCorrectAnswer: "P",
            interactExplanation: "The letter P completes both pairs: SHEEP + PAIR, and DEEP + POOL. The longer fragments make it easier to spot! ✓"
          },
          {
            name: "Oliver",
            scenario: "sharpening his restrictive-word spotting skills",
            pairs: ["DES(?)ING", "RIS(?)ITE"],
            sharedLetter: "K",
            completedWords: ["DESK + KING", "RISK + KITE"],
            restrictiveWord: "DES(?)ING",
            restrictiveReason: "DES_ needs to be a word: DESK is the obvious one. DESS? No. This pair has very few options.",
            options: ["K", "N", "P", "S", "T"],
            correctAnswer: "K",
            explanation: "The letter K completes both pairs: DESK + KING, and RISK + KITE. DESK is practically the only word starting DES_ — super restrictive! ✓",
            interactPairs: ["TAN(?)ITE", "BAN(?)ING"],
            interactOptions: ["D", "G", "K", "N", "T"],
            interactCorrectAnswer: "K",
            interactExplanation: "The letter K completes both pairs: TANK + KITE, and BANK + KING. K makes real words on all sides! ✓"
          },
          {
            name: "Priya",
            scenario: "practising how to find the restrictive word",
            pairs: ["CLU(?)ELL", "GRA(?)IRD"],
            sharedLetter: "B",
            completedWords: ["CLUB + BELL", "GRAB + BIRD"],
            restrictiveWord: "CLU(?)ELL",
            restrictiveReason: "CLU_ can only really be CLUB. CLUE doesn't work with _ELL (UEL? No). Very restrictive!",
            options: ["B", "D", "N", "S", "T"],
            correctAnswer: "B",
            explanation: "The letter B completes both pairs: CLUB + BELL, and GRAB + BIRD. CLU(?) is very restrictive — CLUB is basically the only option! ✓",
            interactPairs: ["CLIM(?)OAT", "THUM(?)ALL"],
            interactOptions: ["B", "D", "G", "N", "T"],
            interactCorrectAnswer: "B",
            interactExplanation: "The letter B completes both pairs: CLIMB + BOAT, and THUMB + BALL. CLIM_ and THUM_ are very restrictive — only B works! ✓"
          },
          {
            name: "Finn",
            scenario: "becoming an expert at the restrictive-word strategy",
            pairs: ["WIS(?)OLE", "CRAS(?)ILL"],
            sharedLetter: "H",
            completedWords: ["WISH + HOLE", "CRASH + HILL"],
            restrictiveWord: "WIS(?)OLE",
            restrictiveReason: "WISH+HOLE works. WISP+POLE? Check pair 2: CRASP isn't a word! Only H works for both pairs.",
            options: ["D", "H", "P", "S", "T"],
            correctAnswer: "H",
            explanation: "The letter H completes both pairs: WISH + HOLE, and CRASH + HILL. P gives WISP+POLE but CRASP isn't a word! ✓",
            interactPairs: ["TEAC(?)OOD", "CATC(?)EAT"],
            interactOptions: ["D", "G", "H", "N", "T"],
            interactCorrectAnswer: "H",
            interactExplanation: "The letter H completes both pairs: TEACH + HOOD, and CATCH + HEAT. TEAC_ and CATC_ are super restrictive — H is the only option! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "The one that narrows it down",
            body: (v) => `${v.name} is ${v.scenario}.\n\nRemember: each pair is **two words joined**. The missing letter **ends** the first and **starts** the second.\n\nHere's the time-saving trick top scorers use: find the **restrictive word** — the pair where only a few letters could possibly work. It's like having a shortcut built right into the question!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spot the clues!",
            body: (v) => `In **${v.pairs.join(' and ')}**, look for unusual patterns — double letters, rare letter combos, or long words with few completions. These are your tell-tale signs!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Restrictive pair: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Only ${v.sharedLetter} makes real words for this pair`, why: `${v.completedWords[0]}` },
                  { text: `Verify: ${v.completedWords[1]} ✓`, why: "Confirmed on the other pair!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The ____ word is the pair where fewest letters make real words on both sides`,
              options: (v) => ["restrictive", "longest", "easiest", "random"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The restrictive word limits your options — always start there. ✓`,
                incorrect: (v) => `Not quite — the restrictive word is the pair where fewest letters work!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the restrictive pair, then solve!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL the word pairs?",
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
            title: () => "Your restrictive-word radar is on!",
            body: () => `Look for these clues to find the restrictive word quickly:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Unusual letter patterns (DES_, CLU_, WIS_)", why: "These have very few possible completions" },
                  { text: "Rare starting/ending combos (_OOF, _IRD)", why: "Fewer words start or end this way" },
                  { text: "Longer fragments leave fewer gaps", why: "CRAS_ has fewer options than CA_ ✓" }
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
  // SUB-CONCEPT 6: Common Letter Positions
  // Category: supporting
  // Lesson: step-by-step
  // ==========================================
  {
    id: "common-letter-positions",
    name: "Where Does the Letter Sit?",
    category: "supporting",
    lessons: [
      {
        id: "letter-positions-steps",
        templateType: "step-by-step",
        learningGoal: [
          "See how fragment length changes the puzzle — and use it to your advantage",
          "Discover why longer fragments actually make things easier for you"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "exploring how letter positions change the puzzle",
            pairs: ["CA(?)EN", "BU(?)ANK"],
            sharedLetter: "T",
            completedWords: ["CAT + TEN", "BUT + TANK"],
            restrictiveWord: "CA(?)EN",
            restrictiveReason: "Two letters before and two after — the letter sits in the middle. CA_ makes many words (CAB, CAD, CAR, CAT...) so check the other side too.",
            options: ["D", "N", "R", "S", "T"],
            correctAnswer: "T",
            explanation: "The letter T completes both pairs: CAT + TEN, and BUT + TANK. Short fragments (2 letters) before the gap give more options, so check both sides! ✓",
            interactPairs: ["WA(?)INK", "FA(?)OOT"],
            interactOptions: ["D", "L", "N", "R", "T"],
            interactCorrectAnswer: "R",
            interactExplanation: "The letter R completes both pairs: WAR + RINK, and FAR + ROOT. Short fragments give more options — check both sides carefully! ✓"
          },
          {
            name: "Marcus",
            scenario: "looking at how word length affects difficulty",
            pairs: ["STOR(?)ICE", "WAR(?)IST"],
            sharedLetter: "M",
            completedWords: ["STORM + MICE", "WARM + MIST"],
            restrictiveWord: "STOR(?)ICE",
            restrictiveReason: "STOR_ has very few options: STORE, STORM, STORY... Only STORM works with _ICE giving MICE.",
            options: ["E", "K", "M", "N", "Y"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: STORM + MICE, and WARM + MIST. Longer word fragments like STOR are very restrictive! ✓",
            interactPairs: ["STEE(?)OOT", "WHEE(?)OAD"],
            interactOptions: ["D", "K", "L", "N", "T"],
            interactCorrectAnswer: "L",
            interactExplanation: "The letter L completes both pairs: STEEL + LOOT, and WHEEL + LOAD. Longer fragments like STEE and WHEE are very restrictive! ✓"
          },
          {
            name: "Aisha",
            scenario: "studying how the gap position changes strategy",
            pairs: ["PATC(?)ILL", "TEAC(?)ALF"],
            sharedLetter: "H",
            completedWords: ["PATCH + HILL", "TEACH + HALF"],
            restrictiveWord: "TEAC(?)ALF",
            restrictiveReason: "TEAC_ can only really be TEACH. And _ALF = HALF, CALF. Only H works for both pairs.",
            options: ["D", "H", "K", "N", "S"],
            correctAnswer: "H",
            explanation: "The letter H completes both pairs: PATCH + HILL, and TEACH + HALF. When both fragments are long, the letter is practically given to you! ✓",
            interactPairs: ["POUC(?)AND", "LAUNC(?)EAD"],
            interactOptions: ["D", "G", "H", "N", "T"],
            interactCorrectAnswer: "H",
            interactExplanation: "The letter H completes both pairs: POUCH + HAND, and LAUNCH + HEAD. Long fragments like POUC_ and LAUNC_ leave almost no options! ✓"
          },
          {
            name: "Charlie",
            scenario: "mastering different gap positions",
            pairs: ["PLU(?)END", "SWI(?)ASK"],
            sharedLetter: "M",
            completedWords: ["PLUM + MEND", "SWIM + MASK"],
            restrictiveWord: "PLU(?)END",
            restrictiveReason: "PLU_ = PLUG, PLUM, PLUS. And _END = BEND, FEND, LEND, MEND, SEND, TEND. Only M works for both: PLUM+MEND.",
            options: ["B", "G", "M", "N", "S"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: PLUM + MEND, and SWIM + MASK. S gives PLUS+SEND but SWIS isn't a word! ✓",
            interactPairs: ["DRU(?)AID", "CLAI(?)ADE"],
            interactOptions: ["B", "G", "L", "M", "N"],
            interactCorrectAnswer: "M",
            interactExplanation: "The letter M completes both pairs: DRUM + MAID, and CLAIM + MADE. The short fragment DRU_ gives a few options, but only M works for both! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Short gap or long gap?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's something really useful: sometimes the letter sits between short fragments like CA(?)EN. Sometimes it's between longer ones like STOR(?)ICE. The longer the fragments, the **fewer** letters can work — which makes your job easier!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Longer = easier!",
            body: (v) => `In **${v.pairs.join(' and ')}**, longer fragments make the puzzle **easier** — fewer letters can possibly fit. Shorter fragments give more options, so check both sides.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Check the restrictive pair: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Letter ${v.sharedLetter}: ${v.completedWords[0]}`, why: "Real words on both sides!" },
                  { text: `Verify: ${v.completedWords[1]} ✓`, why: "Works everywhere!" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Longer fragments", right: "Fewer possible letters (easier)" },
                { left: "Shorter fragments", right: "More possible letters (harder)" },
                { left: "Restrictive word", right: "Start here to narrow options" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter fills the gap?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.interactPairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL the word pairs?",
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
            title: () => "Now you know the shortcut!",
            body: () => `Use fragment length to your advantage:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Short fragments (CA_, _EN) = many possible letters", why: "You'll need to test more options" },
                  { text: "Long fragments (STOR_, _ICE) = very few options", why: "The answer almost gives itself away!" },
                  { text: "Always start with the LONGEST fragment pair", why: "That's your most restrictive word ✓" }
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
  // SUB-CONCEPT 7: Process of Elimination
  // Category: other
  // Lesson: step-by-step
  // ==========================================
  {
    id: "process-of-elimination",
    name: "Ruling Out Letters Systematically",
    category: "other",
    lessons: [
      {
        id: "elimination-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Use elimination like a detective — rule out wrong letters one by one",
          "Save time by testing each option against just ONE pair first"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "using elimination to solve a tricky puzzle",
            pairs: ["GLA(?)ONE", "MIL(?)AMP"],
            sharedLetter: "D",
            completedWords: ["GLAD + DONE", "MILD + DAMP"],
            restrictiveWord: "GLA(?)ONE",
            restrictiveReason: "Try each option: GLAN+NONE? GLAR+RONE? GLAS+SONE? GLAT+TONE? GLAD+DONE ✓ — only D makes real words!",
            options: ["D", "N", "R", "S", "T"],
            correctAnswer: "D",
            explanation: "The letter D completes both pairs: GLAD + DONE, and MILD + DAMP. Go through each option: N gives GLAN (not a word), R gives GLAR (not a word). Only D works! ✓",
            interactPairs: ["BOL(?)OOR", "WIL(?)ATE"],
            interactOptions: ["B", "D", "L", "N", "T"],
            interactCorrectAnswer: "D",
            interactExplanation: "The letter D completes both pairs: BOLD + DOOR, and WILD + DATE. Try each option: B gives BOLB (not a word), L gives BOLL + LOOR (not clean). Only D works! ✓"
          },
          {
            name: "Oliver",
            scenario: "eliminating wrong answers one by one",
            pairs: ["STE(?)OLE", "WOR(?)AST"],
            sharedLetter: "M",
            completedWords: ["STEM + MOLE", "WORM + MAST"],
            restrictiveWord: "STE(?)OLE",
            restrictiveReason: "STEP+POLE? Yes! But WORP isn't a word. STER+ROLE? WORR? No. STEM+MOLE ✓ and WORM+MAST ✓.",
            options: ["M", "N", "P", "R", "T"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: STEM + MOLE, and WORM + MAST. P gives STEP+POLE but WORP fails! Elimination catches these traps. ✓",
            interactPairs: ["BLOO(?)INE", "STEA(?)ILK"],
            interactOptions: ["D", "K", "L", "M", "N"],
            interactCorrectAnswer: "M",
            interactExplanation: "The letter M completes both pairs: BLOOM + MINE, and STEAM + MILK. Try each: D gives BLOOD + DINE but STEAD + DILK fails. Only M works! ✓"
          },
          {
            name: "Priya",
            scenario: "eliminating options methodically",
            pairs: ["SHO(?)INK", "GRE(?)ARM"],
            sharedLetter: "W",
            completedWords: ["SHOW + WINK", "GREW + WARM"],
            restrictiveWord: "GRE(?)ARM",
            restrictiveReason: "GRET+TARM? No. GREN+NARM? No. GRES+SARM? No. GRER+RARM? No. GREW+WARM ✓!",
            options: ["N", "R", "S", "T", "W"],
            correctAnswer: "W",
            explanation: "The letter W completes both pairs: SHOW + WINK, and GREW + WARM. W is sometimes the last letter you'd think of — elimination finds it! ✓",
            interactPairs: ["DRE(?)EAR", "BRE(?)IND"],
            interactOptions: ["D", "N", "R", "T", "W"],
            interactCorrectAnswer: "W",
            interactExplanation: "The letter W completes both pairs: DREW + WEAR, and BREW + WIND. W can be an unexpected answer — elimination finds it! ✓"
          },
          {
            name: "Finn",
            scenario: "practising systematic elimination",
            pairs: ["BUS(?)ANG", "PAT(?)OST"],
            sharedLetter: "H",
            completedWords: ["BUSH + HANG", "PATH + HOST"],
            restrictiveWord: "BUS(?)ANG",
            restrictiveReason: "BUST+TANG? TANG is a word but check pair 2: PATT+TOST? No. BUSH+HANG ✓ and PATH+HOST ✓!",
            options: ["D", "H", "K", "N", "T"],
            correctAnswer: "H",
            explanation: "The letter H completes both pairs: BUSH + HANG, and PATH + HOST. T tempts with BUST+TANG but PATT isn't a word! ✓",
            interactPairs: ["CAS(?)EAP", "CRUS(?)AIR"],
            interactOptions: ["D", "H", "K", "N", "T"],
            interactCorrectAnswer: "H",
            interactExplanation: "The letter H completes both pairs: CASH + HEAP, and CRUSH + HAIR. Try each: T gives CAST + TEAP — TEAP isn't a word. Only H survives! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Be a letter detective!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nRemember: each pair is **two words joined**. The missing letter **ends** the first and **starts** the second.\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}\n\nLet's play detective — go through each option one by one. Most will fail to make real words, so you can cross them off!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Eliminate against ONE pair first",
            body: (v) => `Pick one pair and try all 5 options. Cross off any that don't make real words. Then test what's left on the other pair.\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Test pair: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `Survivor: ${v.sharedLetter} → ${v.completedWords[0]}`, why: "This letter makes real words!" },
                  { text: `Verify pair 2: ${v.completedWords[1]} ✓`, why: "The last letter standing wins!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Pick one pair and try all the options`,
                `Cross off any letters that don't make real words`,
                `Test the surviving letter on the other pair to confirm`
              ],
              feedback: {
                correct: (v) => `Perfect order! Eliminate, then verify the survivor. ✓`,
                incorrect: (v) => `Not quite — start by testing letters against one pair first!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — eliminate!",
            body: (v) => `Try each option. Which letter survives?\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL the word pairs?",
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
            title: () => "Elimination — your backup plan!",
            body: () => `When you're stuck, elimination always works:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Pick one pair (the more restrictive one)", why: "More letters will fail here" },
                  { text: "2. Try each of the 5 options", why: "Does it make a real word on BOTH sides?" },
                  { text: "3. Test survivors on the other pair(s)", why: "The last letter standing is your answer ✓" }
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
  // SUB-CONCEPT 8: Tricky Pairs
  // Category: other
  // Lessons: step-by-step + spot-the-mistake
  // ==========================================
  {
    id: "tricky-pairs",
    name: "Tricky Pairs — When Multiple Letters Seem to Work",
    category: "other",
    lessons: [
      {
        id: "tricky-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Handle the sneakiest questions — where multiple letters seem to work",
          "Learn to avoid the classic trap of assuming too early"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "tackling a question where two letters seem right",
            pairs: ["SAN(?)ARE", "FIN(?)EAR"],
            sharedLetter: "D",
            completedWords: ["SAND + DARE", "FIND + DEAR"],
            restrictiveWord: "SAN(?)ARE",
            restrictiveReason: "SAND+DARE ✓. SANK+KARE? No. What about SANT+TARE? TARE is a word, but FINT isn't!",
            options: ["D", "G", "K", "N", "T"],
            correctAnswer: "D",
            explanation: "The letter D completes both pairs: SAND + DARE, and FIND + DEAR. T tempts with TARE but FINT isn't a word! Always check ALL pairs. ✓"
          },
          {
            name: "Oliver",
            scenario: "facing a sneaky shared-letter trap",
            pairs: ["STO(?)INT", "TRA(?)AIR"],
            sharedLetter: "P",
            completedWords: ["STOP + PINT", "TRAP + PAIR"],
            restrictiveWord: "TRA(?)AIR",
            restrictiveReason: "TRAM+MAIR? No. TRAN+NAIR? No. TRAP+PAIR ✓. Only P works here.",
            options: ["M", "N", "P", "S", "Y"],
            correctAnswer: "P",
            explanation: "The letter P completes both pairs: STOP + PINT, and TRAP + PAIR. N gives STON+NINT — neither is a real word! ✓"
          },
          {
            name: "Priya",
            scenario: "solving a question with a tempting wrong answer",
            pairs: ["SEE(?)UCH", "CAL(?)ILL"],
            sharedLetter: "M",
            completedWords: ["SEEM + MUCH", "CALM + MILL"],
            restrictiveWord: "SEE(?)UCH",
            restrictiveReason: "SEEM+MUCH ✓. SEEN+NUCH? No. SEER+RUCH? No. SEET+TUCH? No. Only M works.",
            options: ["L", "M", "N", "R", "T"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: SEEM + MUCH, and CALM + MILL. T gives SEET (not a word!). Check carefully! ✓"
          },
          {
            name: "Finn",
            scenario: "spotting the trap in a tricky question",
            pairs: ["MAR(?)EEP", "DAR(?)NEE"],
            sharedLetter: "K",
            completedWords: ["MARK + KEEP", "DARK + KNEE"],
            restrictiveWord: "DAR(?)NEE",
            restrictiveReason: "DARK+KNEE ✓. DARN+NEE — NEE is a word (meaning born as), but MARN isn't! Only K works for both.",
            options: ["K", "L", "N", "S", "T"],
            correctAnswer: "K",
            explanation: "The letter K completes both pairs: MARK + KEEP, and DARK + KNEE. N gives DARN+NEE (both real!) but MARN fails — always test ALL pairs! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Watch out — sneaky trap ahead!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nRemember: each pair is **two words joined**. The missing letter **ends** the first and **starts** the second.\n\nDid you know? Some questions are designed to **trick** you on purpose! A letter might work perfectly for one pair but **fail** on the other. That's why checking **every** pair is so important!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Never assume — always verify!",
            body: (v) => `For **${v.pairs.join(' and ')}**, the most common mistake is finding a letter that works for ONE pair and assuming it works for all. Always test both!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with: ${v.restrictiveWord}`, why: v.restrictiveReason },
                  { text: `${v.sharedLetter} works: ${v.completedWords[0]}`, why: "But does it work for the other pair too?" },
                  { text: `Check: ${v.completedWords[1]} ✓`, why: "Yes! Both pairs confirmed — that's the answer!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — avoid the trap!",
            body: (v) => `Which letter works for **ALL** pairs, not just one?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL the word pairs?",
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
            title: () => "You won't fall for the trap now!",
            body: () => `Here's how to stay one step ahead of the question setters:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "NEVER stop after checking one pair", why: "A letter that works for one pair might fail on others" },
                  { text: "Test your answer on EVERY pair", why: "Both words must be real in EVERY pair" },
                  { text: "If two letters seem to work, one will fail on a pair you haven't checked", why: "The test setters design it this way on purpose! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "tricky-pairs-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Spot the mistakes others make when multiple letters seem to fit",
          "Catch yourself before picking a tempting wrong answer"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her practice test answers",
            pairs: ["CLA(?)ELT", "TRI(?)OON"],
            sharedLetter: "M",
            completedWords: ["CLAM + MELT", "TRIM + MOON"],
            wrongAnswer: "P",
            wrongReason: "She tried P first: CLAP + PELT — both real words! But then TRIP + POON — POON isn't a standard word.",
            options: ["L", "M", "N", "P", "T"],
            correctAnswer: "M",
            explanation: "The letter M completes both pairs: CLAM + MELT, and TRIM + MOON. P works for CLAP+PELT but fails on TRIP+POON! ✓"
          },
          {
            name: "Marcus",
            scenario: "finding the mistake in his homework",
            pairs: ["SLA(?)OLD", "CRI(?)ACK"],
            sharedLetter: "B",
            completedWords: ["SLAB + BOLD", "CRIB + BACK"],
            wrongAnswer: "T",
            wrongReason: "He tried T: SLAT + TOLD — both real words! But CRIT + TACK — CRIT isn't a standard word.",
            options: ["B", "D", "N", "S", "T"],
            correctAnswer: "B",
            explanation: "The letter B completes both pairs: SLAB + BOLD, and CRIB + BACK. T works for SLAT+TOLD but CRIT isn't a common word! ✓"
          },
          {
            name: "Aisha",
            scenario: "reviewing a mistake from her mock exam",
            pairs: ["PEE(?)IME", "FOO(?)IFT"],
            sharedLetter: "L",
            completedWords: ["PEEL + LIME", "FOOL + LIFT"],
            wrongAnswer: "T",
            wrongReason: "She tried T: PEET + TIME — PEET isn't a word! She should have spotted that immediately.",
            options: ["D", "L", "N", "R", "T"],
            correctAnswer: "L",
            explanation: "The letter L completes both pairs: PEEL + LIME, and FOOL + LIFT. T gives PEET which isn't a word — always check BOTH sides of each pair! ✓"
          },
          {
            name: "Charlie",
            scenario: "learning from a tricky mistake",
            pairs: ["STI(?)ULE", "FLOO(?)EST"],
            sharedLetter: "R",
            completedWords: ["STIR + RULE", "FLOOR + REST"],
            wrongAnswer: "N",
            wrongReason: "He tried N: STIN + NULE — neither is a real word! He should have eliminated N straight away.",
            options: ["D", "K", "N", "R", "S"],
            correctAnswer: "R",
            explanation: "The letter R completes both pairs: STIR + RULE, and FLOOR + REST. N gives STIN+NULE — neither exists! Quick elimination saves time. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why is "${v.wrongAnswer}" wrong?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe answer chosen was **${v.wrongAnswer}** — ${v.wrongReason}\n\nCan you spot why it fails and find the correct letter?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                filledLetter: v.wrongAnswer,
                showFilled: true,
                label: `Wrong answer: ${v.wrongAnswer} — why doesn't it work?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The verification step catches mistakes!",
            body: (v) => `${v.wrongReason}\n\nThis is why you must **always test on ALL pairs** before choosing your answer.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Wrong: ${v.wrongAnswer} — fails on one pair`, why: v.wrongReason },
                  { text: `Right: ${v.sharedLetter} → ${v.completedWords[0]}`, why: "Real words on both sides" },
                  { text: `Verify: ${v.completedWords[1]} ✓`, why: "Works for EVERY pair!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Find the correct letter!",
            body: (v) => `Which letter actually works for **all** pairs?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "shared-pair",
                words: v.pairs,
                showFilled: false,
                label: "One letter ends the first word and starts the second:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => "Which letter completes ALL the word pairs?",
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
            title: () => "Learn from mistakes!",
            body: () => `The most common shared-letter mistakes:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Picking a letter that works for ONE pair only", why: "Always check EVERY pair before answering" },
                  { text: "Forgetting to check BOTH words in a pair", why: "The letter must make real words on BOTH sides" },
                  { text: "Rushing — take 5 extra seconds to verify", why: "A quick check saves you from silly mistakes ✓" }
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

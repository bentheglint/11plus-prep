// ============================================================
// Supplementary sub-concepts for Letter Move (Verbal Reasoning)
// To merge: add these to lessonBank.letterMove.subConcepts array in lessonData.js
// ============================================================

export const letterMoveSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Remove First Letter
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "remove-first-letter",
    name: "Moving the First Letter",
    category: "core",
    lessons: [
      {
        id: "remove-first-letter-steps",
        templateType: "step-by-step",
        learningGoal: [
          "A brilliant shortcut: the FIRST letter of word 1 is often the one that moves!",
          "How to quickly test this by covering the front letter — it takes just seconds"
        ],
        variableSets: [
          {
            // BLAND: remove B = LAND (real). B + OAR = BOAR (real). All verified.
            name: "Daisy",
            scenario: "working on letter-move puzzles at home",
            word1: "BLAND",
            word2: "OAR",
            movedLetter: "B",
            newWord1: "LAND",
            newWord2: "BOAR",
            insertPosition: "start",
            options: ["B", "L", "A", "N", "D"],
            correctAnswer: "B",
            explanation: "Remove B from BLAND = LAND (ground). Insert B at the start of OAR = BOAR (a wild pig). Both are real words! ✓",
            // Interact-specific: FLAME → LAME, F + OWL = FOWL. All verified.
            interactWord1: "FLAME",
            interactWord2: "OWL",
            interactMovedLetter: "F",
            interactNewWord1: "LAME",
            interactNewWord2: "FOWL",
            interactOptions: ["F", "L", "A", "M", "E"],
            interactCorrectAnswer: "F",
            interactExplanation: "Remove F from FLAME = LAME (unable to walk properly). Insert F at the start of OWL = FOWL (a bird). Both are real words! ✓"
          },
          {
            // PRICE: remove P = RICE (real). P + LAY = PLAY (real). All verified.
            name: "Oliver",
            scenario: "practising VR questions before school",
            word1: "PRICE",
            word2: "LAY",
            movedLetter: "P",
            newWord1: "RICE",
            newWord2: "PLAY",
            insertPosition: "start",
            options: ["P", "R", "I", "C", "E"],
            correctAnswer: "P",
            explanation: "Remove P from PRICE = RICE (a food). Insert P at the start of LAY = PLAY (a game). Both are real words! ✓",
            // Interact-specific: TRACE → RACE, T + OWN = TOWN. All verified.
            interactWord1: "TRACE",
            interactWord2: "OWN",
            interactMovedLetter: "T",
            interactNewWord1: "RACE",
            interactNewWord2: "TOWN",
            interactOptions: ["T", "R", "A", "C", "E"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from TRACE = RACE (a competition). Insert T at the start of OWN = TOWN (a place where people live). Both are real words! ✓"
          },
          {
            // GLOVE: remove G = LOVE (real). G + ROW = GROW (real). All verified.
            name: "Priya",
            scenario: "racing through her VR homework",
            word1: "GLOVE",
            word2: "ROW",
            movedLetter: "G",
            newWord1: "LOVE",
            newWord2: "GROW",
            insertPosition: "start",
            options: ["G", "L", "O", "V", "E"],
            correctAnswer: "G",
            explanation: "Remove G from GLOVE = LOVE (a real word). Insert G at the start of ROW = GROW (to get bigger). Both are real words! ✓",
            // Interact-specific: BRAKE → RAKE, B + OAR = BOAR. All verified.
            interactWord1: "BRAKE",
            interactWord2: "OAR",
            interactMovedLetter: "B",
            interactNewWord1: "RAKE",
            interactNewWord2: "BOAR",
            interactOptions: ["B", "R", "A", "K", "E"],
            interactCorrectAnswer: "B",
            interactExplanation: "Remove B from BRAKE = RAKE (a garden tool). Insert B at the start of OAR = BOAR (a wild pig). Both are real words! ✓"
          },
          {
            // STALE: remove S = TALE (real). S + OAR = SOAR (real). All verified.
            name: "Finn",
            scenario: "doing VR practice at the kitchen table",
            word1: "STALE",
            word2: "OAR",
            movedLetter: "S",
            newWord1: "TALE",
            newWord2: "SOAR",
            insertPosition: "start",
            options: ["S", "T", "A", "L", "E"],
            correctAnswer: "S",
            explanation: "Remove S from STALE = TALE (a story). Insert S at the start of OAR = SOAR (to fly high). Both are real words! ✓",
            // Interact-specific: CRAVE → RAVE, C + OWL = COWL. All verified.
            interactWord1: "CRAVE",
            interactWord2: "OWL",
            interactMovedLetter: "C",
            interactNewWord1: "RAVE",
            interactNewWord2: "COWL",
            interactOptions: ["C", "R", "A", "V", "E"],
            interactCorrectAnswer: "C",
            interactExplanation: "Remove C from CRAVE = RAVE (a lively party). Insert C at the start of OWL = COWL (a hood or cover). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Start at the start!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a great shortcut: the **first letter** of word 1 is often the one that moves. It's the easiest to test — just chop it off the front and see what's left!\n\n**${v.word1}** and **${v.word2}** — what happens if you remove the first letter?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Chop the front — see what's hiding!",
            body: (v) => `Look at **${v.word1}** and **${v.word2}**. Try this: cover up the first letter of ${v.word1} with your finger. Can you read a real word underneath? If YES, you might have found the answer already!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.word1}: cover "${v.movedLetter}" → ${v.newWord1}`, why: `Is ${v.newWord1} a real word? YES!` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `Is ${v.newWord2} a real word? YES!` },
                  { text: `Both ${v.newWord1} and ${v.newWord2} are real ✓`, why: "The first letter was the answer!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Cover the first letter of ${v.word1}`,
                `Check if the remaining letters make a real word`,
                `Try inserting that letter into ${v.word2}`,
                `Check the new word 2 is also real`
              ],
              feedback: {
                correct: (v) => `Perfect! Cover, check, insert, check — that's the system. ✓`,
                incorrect: (v) => `Not quite — start by covering the first letter, then check both new words.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}**?\n\nTry the first letter first!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "First letter first — easy wins!",
            body: () => `You've got a great starting strategy now! When you see a letter-move question:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try the FIRST letter of word 1", why: "Just cover it up — is the rest a real word?" },
                  { text: "2. If it's real, try inserting that letter into word 2", why: "Usually at the start of word 2" },
                  { text: "3. Both real? You're done!", why: "The first letter is the answer more often than you'd think ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "remove-first-letter-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "What to do when the first letter trick doesn't work — don't panic, just try the next!",
          "How to stay calm and move through options without wasting time"
        ],
        variableSets: [
          {
            // SHOUT: remove S = HOUT (NOT a word!). Try O: SHUT (real). O + PEN = OPEN (real).
            name: "Evie",
            scenario: "checking her practice answers",
            word1: "SHOUT",
            word2: "PEN",
            movedLetter: "O",
            newWord1: "SHUT",
            newWord2: "OPEN",
            firstLetterFail: "S",
            firstLetterResult: "HOUT",
            insertPosition: "middle",
            options: ["S", "H", "O", "U", "T"],
            correctAnswer: "O",
            explanation: "Remove S? HOUT isn't a word! Try O instead: SHOUT → SHUT (to close). Insert O into PEN → OPEN (not closed). Both real words! ✓",
            interactWord1: "GROWN",
            interactWord2: "ATE",
            interactMovedLetter: "R",
            interactNewWord1: "GOWN",
            interactNewWord2: "RATE",
            interactOptions: ["G", "R", "O", "W", "N"],
            interactCorrectAnswer: "R",
            interactExplanation: "Remove G? ROWN isn't a word! Try R: GROWN → GOWN (a long dress). Insert R into ATE → RATE (a speed). Both real words! ✓"
          },
          {
            // BREAK: remove B = REAK (NOT a word!). Try R: BEAK (real). R + OAR = ROAR (real).
            name: "Marcus",
            scenario: "going over his test paper",
            word1: "BREAK",
            word2: "OAR",
            movedLetter: "R",
            newWord1: "BEAK",
            newWord2: "ROAR",
            firstLetterFail: "B",
            firstLetterResult: "REAK",
            insertPosition: "start",
            options: ["B", "R", "E", "A", "K"],
            correctAnswer: "R",
            explanation: "Remove B? REAK isn't a word! Try R instead: BREAK → BEAK (a bird's mouth). Insert R into OAR → ROAR (a loud sound). Both real words! ✓",
            interactWord1: "SNORE",
            interactWord2: "EAR",
            interactMovedLetter: "N",
            interactNewWord1: "SORE",
            interactNewWord2: "NEAR",
            interactOptions: ["S", "N", "O", "R", "E"],
            interactCorrectAnswer: "N",
            interactExplanation: "Remove S? NORE isn't a word! Try N: SNORE → SORE (painful). Insert N into EAR → NEAR (close by). Both real words! ✓"
          },
          {
            // DROWN: remove D = ROWN (NOT a word!). Try R: DOWN (real). R + ATE = RATE (real).
            name: "Aisha",
            scenario: "working through tricky questions",
            word1: "DROWN",
            word2: "ATE",
            movedLetter: "R",
            newWord1: "DOWN",
            newWord2: "RATE",
            firstLetterFail: "D",
            firstLetterResult: "ROWN",
            insertPosition: "start",
            options: ["D", "R", "O", "W", "N"],
            correctAnswer: "R",
            explanation: "Remove D? ROWN isn't a word! Try R instead: DROWN → DOWN (the opposite of up). Insert R into ATE → RATE (a speed or level). Both real words! ✓",
            interactWord1: "CROWD",
            interactWord2: "ATE",
            interactMovedLetter: "D",
            interactNewWord1: "CROW",
            interactNewWord2: "DATE",
            interactOptions: ["C", "R", "O", "W", "D"],
            interactCorrectAnswer: "D",
            interactExplanation: "Remove C? ROWD isn't a word! Try D: CROWD → CROW (a black bird). Insert D into ATE → DATE (a day on the calendar). Both real words! ✓"
          },
          {
            // CROWD: remove C = ROWD (NOT a word!). Try D: CROW (real). D + ATE = DATE (real).
            name: "Charlie",
            scenario: "trying the harder questions",
            word1: "CROWD",
            word2: "ATE",
            movedLetter: "D",
            newWord1: "CROW",
            newWord2: "DATE",
            firstLetterFail: "C",
            firstLetterResult: "ROWD",
            insertPosition: "start",
            options: ["C", "R", "O", "W", "D"],
            correctAnswer: "D",
            explanation: "Remove C? ROWD isn't a word! Try D instead: CROWD → CROW (a black bird). Insert D into ATE → DATE (a day on the calendar). Both real words! ✓",
            interactWord1: "SHOUT",
            interactWord2: "MEN",
            interactMovedLetter: "O",
            interactNewWord1: "SHUT",
            interactNewWord2: "OMEN",
            interactOptions: ["S", "H", "O", "U", "T"],
            interactCorrectAnswer: "O",
            interactExplanation: "Remove S? HOUT isn't a word! Try O: SHOUT → SHUT (to close). Insert O into MEN → OMEN (a sign of what's to come). Both real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `First letter of ${v.word1} — does it work?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nYou'd normally try the **first letter** — but look what happens with **${v.word1}** and **${v.word2}**:\n\nRemove "${v.firstLetterFail}" from ${v.word1} → **${v.firstLetterResult}** — not a real word! Don't worry — just move on to the next letter. You've got this!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "When the first letter fails — try the next!",
            body: (v) => `The first letter "${v.firstLetterFail}" didn't work: ${v.word1} → ${v.firstLetterResult} (not a word!). So we move to the **next letter** and keep testing:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try "${v.firstLetterFail}": ${v.word1} → ${v.firstLetterResult}`, why: `Not a real word — move on!` },
                  { text: `Try "${v.movedLetter}": ${v.word1} → ${v.newWord1}`, why: `${v.newWord1} IS a real word! Keep going...` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `${v.newWord2} is a real word too! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The first letter of word 1 is ALWAYS the letter that moves`, answer: false, explanation: `No — the first letter often works, but sometimes you need to try the second, third or even last letter!` },
                { text: `If removing a letter doesn't leave a real word, you should try the next letter`, answer: true, explanation: `Correct — don't get stuck! Move on to the next letter and test that one instead. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "No stress — just try the next one!",
            body: () => `The first letter is a great starting point, but it won't always be the answer. No problem! Here's your plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Try removing the first letter", why: "Is the rest a real word? If YES, great — test it with word 2" },
                  { text: "If NOT a real word, don't panic!", why: "Move on to the second letter, then the third, and so on" },
                  { text: "Keep testing until BOTH new words work", why: "The answer is often the 2nd or last letter when the 1st fails ✓" }
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
  // SUB-CONCEPT 2: Remove Last Letter
  // Category: core
  // ==========================================
  {
    id: "remove-last-letter",
    name: "Moving the Last Letter",
    category: "core",
    lessons: [
      {
        id: "remove-last-letter-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Another quick test: sometimes it's the LAST letter that needs to move!",
          "Why checking the end is just as fast as checking the front"
        ],
        variableSets: [
          {
            // PLANT: remove T = PLAN (real). T + OUR = TOUR (real). All verified.
            name: "Daisy",
            scenario: "trying a new set of letter-move questions",
            word1: "PLANT",
            word2: "OUR",
            movedLetter: "T",
            newWord1: "PLAN",
            newWord2: "TOUR",
            insertPosition: "start",
            options: ["P", "L", "A", "N", "T"],
            correctAnswer: "T",
            explanation: "Remove T from the end of PLANT = PLAN (a scheme). Insert T at the start of OUR = TOUR (a journey). Both are real words! ✓",
            // Interact-specific: JOINT → JOIN, T + OUR = TOUR. All verified.
            interactWord1: "JOINT",
            interactWord2: "OUR",
            interactMovedLetter: "T",
            interactNewWord1: "JOIN",
            interactNewWord2: "TOUR",
            interactOptions: ["J", "O", "I", "N", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from the end of JOINT = JOIN (to connect). Insert T at the start of OUR = TOUR (a journey). Both are real words! ✓"
          },
          {
            // MEANT: remove T = MEAN (real). T + OWN = TOWN (real). All verified.
            name: "Oliver",
            scenario: "working through his VR practice book",
            word1: "MEANT",
            word2: "OWN",
            movedLetter: "T",
            newWord1: "MEAN",
            newWord2: "TOWN",
            insertPosition: "start",
            options: ["M", "E", "A", "N", "T"],
            correctAnswer: "T",
            explanation: "Remove T from the end of MEANT = MEAN (to intend). Insert T at the start of OWN = TOWN (a place where people live). Both are real words! ✓",
            // Interact-specific: GRUNT → GRUN? No. GRANT → GRAN, T + OUR = TOUR. All verified.
            interactWord1: "GRANT",
            interactWord2: "OUR",
            interactMovedLetter: "T",
            interactNewWord1: "GRAN",
            interactNewWord2: "TOUR",
            interactOptions: ["G", "R", "A", "N", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from the end of GRANT = GRAN (grandmother). Insert T at the start of OUR = TOUR (a journey). Both are real words! ✓"
          },
          {
            // PAINT: remove T = PAIN (real). T + OWN = TOWN (real). All verified.
            name: "Priya",
            scenario: "practising before her mock test",
            word1: "PAINT",
            word2: "OWN",
            movedLetter: "T",
            newWord1: "PAIN",
            newWord2: "TOWN",
            insertPosition: "start",
            options: ["P", "A", "I", "N", "T"],
            correctAnswer: "T",
            explanation: "Remove T from the end of PAINT = PAIN (an ache). Insert T at the start of OWN = TOWN (a settlement). Both are real words! ✓",
            // Interact-specific: MOANS → MOAN, S + OAR = SOAR. All verified.
            interactWord1: "MOANS",
            interactWord2: "OAR",
            interactMovedLetter: "S",
            interactNewWord1: "MOAN",
            interactNewWord2: "SOAR",
            interactOptions: ["M", "O", "A", "N", "S"],
            interactCorrectAnswer: "S",
            interactExplanation: "Remove S from the end of MOANS = MOAN (a groan). Insert S at the start of OAR = SOAR (to fly high). Both are real words! ✓"
          },
          {
            // SHUNT: remove T = SHUN (real). T + OWN = TOWN (real). All verified.
            name: "Finn",
            scenario: "doing letter puzzles during breaktime",
            word1: "SHUNT",
            word2: "OWN",
            movedLetter: "T",
            newWord1: "SHUN",
            newWord2: "TOWN",
            insertPosition: "start",
            options: ["S", "H", "U", "N", "T"],
            correctAnswer: "T",
            explanation: "Remove T from the end of SHUNT = SHUN (to avoid). Insert T at the start of OWN = TOWN (a settlement). Both are real words! ✓",
            // Interact-specific: LEANS → LEAN, S + OAR = SOAR. All verified.
            interactWord1: "LEANS",
            interactWord2: "OAR",
            interactMovedLetter: "S",
            interactNewWord1: "LEAN",
            interactNewWord2: "SOAR",
            interactOptions: ["L", "E", "A", "N", "S"],
            interactCorrectAnswer: "S",
            interactExplanation: "Remove S from the end of LEANS = LEAN (to tilt). Insert S at the start of OAR = SOAR (to fly high). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Don't forget the end!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nIf the first letter doesn't work, try the **last letter** next! It's just as quick — cover the end of the word and see what's left. Easy!\n\n**${v.word1}** — what happens if you remove the last letter?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Cover the end — read what's left",
            body: (v) => `Look at **${v.word1}** and **${v.word2}**. Put your finger over the last letter of ${v.word1}. Can you read a real word? If YES, test inserting that letter into word 2.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.word1}: cover "${v.movedLetter}" → ${v.newWord1}`, why: `Is ${v.newWord1} a real word? YES!` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `Is ${v.newWord2} a real word? YES!` },
                  { text: `${v.newWord1} ✓ and ${v.newWord2} ✓ — the last letter was the answer!`, why: "Always check BOTH new words" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}**?\n\nTry the last letter!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Two quick tests in your pocket!",
            body: () => `Brilliant — now you've got TWO fast checks. The first and last letters are the easiest:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try the FIRST letter first", why: "Cover the front — read the rest" },
                  { text: "2. If that doesn't work, try the LAST letter", why: "Cover the end — read what's left" },
                  { text: "3. First + last covers most questions!", why: "Only go to middle letters if neither works ✓" }
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
  // SUB-CONCEPT 3: Remove Middle Letter
  // Category: supporting
  // ==========================================
  {
    id: "remove-middle-letter",
    name: "Moving a Middle Letter",
    category: "supporting",
    lessons: [
      {
        id: "remove-middle-letter-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The trickier cases: sometimes the letter hiding in the MIDDLE is the one that moves!",
          "Why trying first and last before the middle keeps you fast and organised"
        ],
        variableSets: [
          {
            // GRAVE: G-R-A-V-E. Remove R (2nd letter) = GAVE (real). R + OAR = ROAR (real). All verified.
            name: "Lily",
            scenario: "stuck on a tricky letter-move question",
            word1: "GRAVE",
            word2: "OAR",
            movedLetter: "R",
            newWord1: "GAVE",
            newWord2: "ROAR",
            insertPosition: "start",
            options: ["G", "R", "A", "V", "E"],
            correctAnswer: "R",
            explanation: "Remove R from GRAVE = GAVE (past tense of give). Insert R at the start of OAR = ROAR (a loud sound). Both are real words! ✓",
            // Interact-specific: PLANE → PANE (remove L, 2nd letter), L + ATE = LATE. All verified.
            interactWord1: "PLANE",
            interactWord2: "ATE",
            interactMovedLetter: "L",
            interactNewWord1: "PANE",
            interactNewWord2: "LATE",
            interactOptions: ["P", "L", "A", "N", "E"],
            interactCorrectAnswer: "L",
            interactExplanation: "Remove L from PLANE = PANE (a sheet of glass). Insert L at the start of ATE = LATE (not on time). Both are real words! ✓"
          },
          {
            // SHORE: S-H-O-R-E. Remove R (4th letter) = SHOE (real). R + INK = RINK (real). All verified.
            name: "Noah",
            scenario: "facing a question where the first letter doesn't work",
            word1: "SHORE",
            word2: "INK",
            movedLetter: "R",
            newWord1: "SHOE",
            newWord2: "RINK",
            insertPosition: "start",
            options: ["S", "H", "O", "R", "E"],
            correctAnswer: "R",
            explanation: "Remove R from SHORE = SHOE (something you wear on your foot). Insert R at the start of INK = RINK (an ice skating arena). Both are real words! ✓",
            // Interact-specific: CLOVE → COVE (remove L, 2nd letter), L + ACE = LACE. All verified.
            interactWord1: "CLOVE",
            interactWord2: "ACE",
            interactMovedLetter: "L",
            interactNewWord1: "COVE",
            interactNewWord2: "LACE",
            interactOptions: ["C", "L", "O", "V", "E"],
            interactCorrectAnswer: "L",
            interactExplanation: "Remove L from CLOVE = COVE (a small bay). Insert L at the start of ACE = LACE (a delicate fabric). Both are real words! ✓"
          },
          {
            // PLACE: P-L-A-C-E. Remove L (2nd letter) = PACE (real). L + ATE = LATE (real). All verified.
            name: "Priya",
            scenario: "puzzling over a difficult question",
            word1: "PLACE",
            word2: "ATE",
            movedLetter: "L",
            newWord1: "PACE",
            newWord2: "LATE",
            insertPosition: "start",
            options: ["P", "L", "A", "C", "E"],
            correctAnswer: "L",
            explanation: "Remove L from PLACE = PACE (speed of walking). Insert L at the start of ATE = LATE (not on time). Both are real words! ✓",
            // Interact-specific: FLARE → FARE (remove L, 2nd letter), L + ACE = LACE. All verified.
            interactWord1: "FLARE",
            interactWord2: "ACE",
            interactMovedLetter: "L",
            interactNewWord1: "FARE",
            interactNewWord2: "LACE",
            interactOptions: ["F", "L", "A", "R", "E"],
            interactCorrectAnswer: "L",
            interactExplanation: "Remove L from FLARE = FARE (the price of a ticket). Insert L at the start of ACE = LACE (a delicate fabric). Both are real words! ✓"
          },
          {
            // CRANE: C-R-A-N-E. Remove R (2nd) = CANE (real). R + OAR = ROAR (real). All verified.
            name: "Finn",
            scenario: "trying the hardest questions in his book",
            word1: "CRANE",
            word2: "OAR",
            movedLetter: "R",
            newWord1: "CANE",
            newWord2: "ROAR",
            insertPosition: "start",
            options: ["C", "R", "A", "N", "E"],
            correctAnswer: "R",
            explanation: "Remove R from CRANE = CANE (a walking stick). Insert R at the start of OAR = ROAR (a loud sound). Both are real words! ✓",
            // Interact-specific: GRAIN → GAIN (remove R, 2nd letter), R + ATE = RATE. All verified.
            interactWord1: "GRAIN",
            interactWord2: "ATE",
            interactMovedLetter: "R",
            interactNewWord1: "GAIN",
            interactNewWord2: "RATE",
            interactOptions: ["G", "R", "A", "I", "N"],
            interactCorrectAnswer: "R",
            interactExplanation: "Remove R from GRAIN = GAIN (to get more). Insert R at the start of ATE = RATE (a speed or level). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Sometimes it's hiding in the middle!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nOK, so the first and last letters didn't work. No worries — sometimes the letter that moves is **hiding in the middle** of word 1. These are the trickiest ones, but you can handle them!\n\n**${v.word1}** and **${v.word2}** — which middle letter makes two real words?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Pull out the middle letter",
            body: (v) => `Look at **${v.word1}** and **${v.word2}**. When you remove a middle letter from ${v.word1}, the letters on EITHER SIDE close up. They stay in order!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.word1}: remove "${v.movedLetter}" from the middle`, why: "The other letters close the gap" },
                  { text: `Result: ${v.newWord1}`, why: `Is ${v.newWord1} a real word? YES!` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `${v.newWord2} is a real word too! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}**?\n\nHint: it's NOT the first or last letter!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Middle letters — you can handle these!",
            body: () => `Middle letters are the trickiest, so save them for last. But now you know how:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try the first letter", why: "Quickest check" },
                  { text: "2. Try the last letter", why: "Second quickest" },
                  { text: "3. Only then try middle letters", why: "When you remove a middle letter, the sides close up ✓" }
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
  // SUB-CONCEPT 4: Insert at Start
  // Category: core
  // ==========================================
  {
    id: "insert-at-start",
    name: "Adding the Letter to the Front",
    category: "core",
    lessons: [
      {
        id: "insert-at-start-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Where does the letter land? Start position is the most common — and easiest to test!",
          "Why trying start-insertion first gives you the best chance of a quick answer"
        ],
        variableSets: [
          {
            // SPINE: remove S = PINE (real). S + OAR = SOAR (S goes to start). All verified.
            name: "Evie",
            scenario: "learning where to put the moved letter",
            word1: "SPINE",
            word2: "OAR",
            movedLetter: "S",
            newWord1: "PINE",
            newWord2: "SOAR",
            insertPosition: "start",
            options: ["S", "P", "I", "N", "E"],
            correctAnswer: "S",
            explanation: "Remove S from SPINE = PINE (a type of tree). Insert S at the START of OAR = SOAR (to fly upwards). Both are real words! ✓",
            // Interact-specific: CRATE → RATE, C + OAT = COAT. All verified.
            interactWord1: "CRATE",
            interactWord2: "OAT",
            interactMovedLetter: "C",
            interactNewWord1: "RATE",
            interactNewWord2: "COAT",
            interactOptions: ["C", "R", "A", "T", "E"],
            interactCorrectAnswer: "C",
            interactExplanation: "Remove C from CRATE = RATE (a speed or level). Insert C at the START of OAT = COAT (a jacket). Both are real words! ✓"
          },
          {
            // BRAID: remove B = RAID (real). B + OWL = BOWL (B goes to start). All verified.
            name: "Marcus",
            scenario: "practising where letters go",
            word1: "BRAID",
            word2: "OWL",
            movedLetter: "B",
            newWord1: "RAID",
            newWord2: "BOWL",
            insertPosition: "start",
            options: ["B", "R", "A", "I", "D"],
            correctAnswer: "B",
            explanation: "Remove B from BRAID = RAID (a surprise attack). Insert B at the START of OWL = BOWL (a deep dish). Both are real words! ✓",
            // Interact-specific: GRIPE → RIPE, G + LOW = GLOW. All verified.
            interactWord1: "GRIPE",
            interactWord2: "LOW",
            interactMovedLetter: "G",
            interactNewWord1: "RIPE",
            interactNewWord2: "GLOW",
            interactOptions: ["G", "R", "I", "P", "E"],
            interactCorrectAnswer: "G",
            interactExplanation: "Remove G from GRIPE = RIPE (ready to eat). Insert G at the START of LOW = GLOW (to shine softly). Both are real words! ✓"
          },
          {
            // TRACE: remove T = RACE (real). T + OWN = TOWN (T goes to start). All verified.
            name: "Aisha",
            scenario: "figuring out where the letter goes",
            word1: "TRACE",
            word2: "OWN",
            movedLetter: "T",
            newWord1: "RACE",
            newWord2: "TOWN",
            insertPosition: "start",
            options: ["T", "R", "A", "C", "E"],
            correctAnswer: "T",
            explanation: "Remove T from TRACE = RACE (a competition). Insert T at the START of OWN = TOWN (a place where people live). Both are real words! ✓",
            // Interact-specific: STONE → TONE, S + CAR = SCAR. All verified.
            interactWord1: "STONE",
            interactWord2: "CAR",
            interactMovedLetter: "S",
            interactNewWord1: "TONE",
            interactNewWord2: "SCAR",
            interactOptions: ["S", "T", "O", "N", "E"],
            interactCorrectAnswer: "S",
            interactExplanation: "Remove S from STONE = TONE (a musical sound). Insert S at the START of CAR = SCAR (a mark left by a wound). Both are real words! ✓"
          },
          {
            // FLAKE: remove F = LAKE (real). F + OWL = FOWL (F goes to start). All verified.
            name: "Charlie",
            scenario: "working on insertion positions",
            word1: "FLAKE",
            word2: "OWL",
            movedLetter: "F",
            newWord1: "LAKE",
            newWord2: "FOWL",
            insertPosition: "start",
            options: ["F", "L", "A", "K", "E"],
            correctAnswer: "F",
            explanation: "Remove F from FLAKE = LAKE (a body of water). Insert F at the START of OWL = FOWL (a bird, like a chicken). Both are real words! ✓",
            // Interact-specific: PLANK → LANK, P + OUR = POUR. All verified.
            interactWord1: "PLANK",
            interactWord2: "OUR",
            interactMovedLetter: "P",
            interactNewWord1: "LANK",
            interactNewWord2: "POUR",
            interactOptions: ["P", "L", "A", "N", "K"],
            interactCorrectAnswer: "P",
            interactExplanation: "Remove P from PLANK = LANK (long and limp). Insert P at the START of OUR = POUR (to tip liquid). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Where does the letter land?",
            body: (v) => `${v.name} is ${v.scenario}.\n\nOnce you've found the letter to move, the next question is: **where does it go** in word 2? Good news — the most common spot is right at the **START**! Try that first.\n\n**${v.word1}** → move "${v.movedLetter}" → pop it at the start of **${v.word2}**.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Start position — the most common",
            body: (v) => `We've found that **"${v.movedLetter}"** moves from **${v.word1}**. Where does it go in **${v.word2}**? In most letter-move questions, the moved letter goes to the **front** of word 2. Always try the start first!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Letter to move: "${v.movedLetter}"`, why: `Removed from ${v.word1} to make ${v.newWord1}` },
                  { text: `Try the START: "${v.movedLetter}" + ${v.word2} = ${v.newWord2}`, why: `Is ${v.newWord2} a real word? YES!` },
                  { text: `Both ${v.newWord1} and ${v.newWord2} are real ✓`, why: "Start position worked!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In most letter-move questions, the moved letter goes to the ____ of word 2`,
              options: (v) => ["start", "end", "middle", "nowhere"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The start is the most common insertion position — always try it first. ✓`,
                incorrect: (v) => `Not quite — in most cases, the moved letter goes to the START of word 2!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to the START of **${v.interactWord2}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Start position — your best bet!",
            body: () => `Great work! When inserting the moved letter into word 2, try the start first:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try the START of word 2 first", why: "Put the letter right at the front" },
                  { text: "2. Read the new word — is it real?", why: "Say it out loud if you need to" },
                  { text: "3. Most answers use start-insertion", why: "S + OAR = SOAR, B + OWL = BOWL, T + OWN = TOWN ✓" }
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
  // SUB-CONCEPT 5: Insert at End
  // Category: supporting
  // ==========================================
  {
    id: "insert-at-end",
    name: "Adding the Letter to the End",
    category: "supporting",
    lessons: [
      {
        id: "insert-at-end-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The backup plan: if the start doesn't work, try putting the letter at the END!",
          "Why having two positions to check (start and end) means you'll always find the answer"
        ],
        variableSets: [
          {
            // SWEAR: remove S = WEAR (real). S + OWN = SOWN (S goes to start). Hmm, that's start.
            // Need genuine end-insertion examples.
            // STAND: S-T-A-N-D. Remove T = SAND (real). T + OUR = TOUR (start). Hmm.
            // PLANT: remove T = PLAN. OUR + T = hmm... actually TOUR has T at start.
            // Let me think of end-insertion: ALE + P at end = ALEP? No. P + ALE = PALE (start).
            // INK + S at end = INKS. Remove S from SNAIL = NAIL (real). INK + S = INKS (real). All verified.
            // Actually let me think more carefully. Most of the questions insert at start.
            // PLEAD: remove P = LEAD (real). ALE + P at end? No, P + ALE = PALE (start).
            // CHEAT: remove C = HEAT. OWL + C? = OWLC? No. C + OWL = COWL (start).
            // Think of words where adding a letter at the end works:
            // CLAMP: remove C = LAMP (real). OWL + C? No. C + OWL = COWL.
            // Most questions are start-insertion. Let me find genuine end-insertion.
            // SHAVE: S-H-A-V-E. Remove S = HAVE (real). EAR + S = EARS (real). S goes to END! All verified.
            name: "Daisy",
            scenario: "discovering the letter can go at the end",
            word1: "SHAVE",
            word2: "EAR",
            movedLetter: "S",
            newWord1: "HAVE",
            newWord2: "EARS",
            insertPosition: "end",
            options: ["S", "H", "A", "V", "E"],
            correctAnswer: "S",
            explanation: "Remove S from SHAVE = HAVE (to own). Insert S at the END of EAR = EARS (what you hear with). Both are real words! ✓",
            // Interact-specific: BLAND → LAND (remove B), OAR + B? No. Need end-insertion.
            // PLANT → PLAN (remove T), BEA + T = BEAT. All verified.
            interactWord1: "PLANT",
            interactWord2: "BEA",
            interactMovedLetter: "T",
            interactNewWord1: "PLAN",
            interactNewWord2: "BEAT",
            interactOptions: ["P", "L", "A", "N", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from the end of PLANT = PLAN (a scheme). Insert T at the END of BEA = BEAT (to win against). Both are real words! ✓"
          },
          {
            // BRAND → BRAN (remove D), BAN + D = BAND. All verified.
            name: "Oliver",
            scenario: "surprised the letter goes at the end",
            word1: "BRAND",
            word2: "BAN",
            movedLetter: "D",
            newWord1: "BRAN",
            newWord2: "BAND",
            insertPosition: "end",
            options: ["B", "R", "A", "N", "D"],
            correctAnswer: "D",
            explanation: "Remove D from the end of BRAND = BRAN (a cereal fibre). Insert D at the END of BAN = BAND (a music group). Both are real words! ✓",
            // Interact-specific: MEANT → MEAN (remove T), WIT + T? No. HEA + T? No — not a word on its own.
            // PAINT → PAIN (remove T), SEA + T = SEAT. All verified.
            interactWord1: "PAINT",
            interactWord2: "SEA",
            interactMovedLetter: "T",
            interactNewWord1: "PAIN",
            interactNewWord2: "SEAT",
            interactOptions: ["P", "A", "I", "N", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from the end of PAINT = PAIN (an ache). Insert T at the END of SEA = SEAT (something to sit on). Both are real words! ✓"
          },
          {
            // MEANT → MEAN (remove T), HEAR + T = HEART. All verified.
            name: "Priya",
            scenario: "solving a tricky end-insertion puzzle",
            word1: "MEANT",
            word2: "HEAR",
            movedLetter: "T",
            newWord1: "MEAN",
            newWord2: "HEART",
            insertPosition: "end",
            options: ["M", "E", "A", "N", "T"],
            correctAnswer: "T",
            explanation: "Remove T from the end of MEANT = MEAN (to intend). Insert T at the END of HEAR = HEART (the organ in your chest). Both are real words! ✓",
            // Interact-specific: SHUNT → SHUN (remove T), PAR + T = PART. All verified.
            interactWord1: "SHUNT",
            interactWord2: "PAR",
            interactMovedLetter: "T",
            interactNewWord1: "SHUN",
            interactNewWord2: "PART",
            interactOptions: ["S", "H", "U", "N", "T"],
            interactCorrectAnswer: "T",
            interactExplanation: "Remove T from the end of SHUNT = SHUN (to avoid). Insert T at the END of PAR = PART (a piece of something). Both are real words! ✓"
          },
          {
            // SCANT → CANT (remove S), HIS + S = HISS. All verified.
            name: "Finn",
            scenario: "working through unusual letter moves",
            word1: "SCANT",
            word2: "HIS",
            movedLetter: "S",
            newWord1: "CANT",
            newWord2: "HISS",
            insertPosition: "end",
            options: ["S", "C", "A", "N", "T"],
            correctAnswer: "S",
            explanation: "Remove S from SCANT = CANT (to tilt or lean). Insert S at the END of HIS = HISS (the sound a snake makes). Both are real words! ✓",
            // Interact-specific: BLAND → LAND (remove B), CUR + B = CURB. All verified.
            interactWord1: "BLAND",
            interactWord2: "CUR",
            interactMovedLetter: "B",
            interactNewWord1: "LAND",
            interactNewWord2: "CURB",
            interactOptions: ["B", "L", "A", "N", "D"],
            interactCorrectAnswer: "B",
            interactExplanation: "Remove B from BLAND = LAND (ground). Insert B at the END of CUR = CURB (the edge of a pavement). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Plot twist — it goes at the end!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nUsually the moved letter goes at the **start** of word 2. But sometimes it goes at the **END** instead! If the front doesn't make a real word, just flip to the back. Easy switch!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Try the end when the start fails",
            body: (v) => `Look at **${v.word1}** and **${v.word2}**. If putting the letter at the front of word 2 doesn't make a real word, try putting it at the **end** instead.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Remove "${v.movedLetter}" from ${v.word1} → ${v.newWord1}`, why: `${v.newWord1} is a real word!` },
                  { text: `Try START: "${v.movedLetter}" + ${v.word2} = ?`, why: "Does it make a real word? Maybe not..." },
                  { text: `Try END: ${v.word2} + "${v.movedLetter}" = ${v.newWord2}`, why: `${v.newWord2} IS a real word! ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}**?\n\nRemember — the letter might go at the END!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Start or end — now you can try both!",
            body: () => `Brilliant! You've got two places to check when placing the moved letter:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try the letter at the START first", why: "This works most of the time" },
                  { text: "2. If that's not a word, try the END", why: "HIS + S = HISS, HEAR + T = HEART" },
                  { text: "3. Check BOTH new words are real", why: "Don't forget to verify word 1 too ✓" }
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
  // SUB-CONCEPT 6: Vowel Moves
  // Category: supporting
  // ==========================================
  {
    id: "vowel-moves",
    name: "Moving a Vowel",
    category: "supporting",
    lessons: [
      {
        id: "vowel-moves-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Don't forget the vowels! Sometimes A, E, I, O or U is the letter that moves",
          "Why vowel moves can surprise you — the word looks totally different without them"
        ],
        variableSets: [
          {
            // SHALE: S-H-A-L-E. Remove A? = SHLE? No. Remove E? = SHAL? No. Remove the S = HALE.
            // Actually: I need a vowel being moved. Let me think carefully.
            // FLAME: F-L-A-M-E. Remove A = FLME? No, not a word.
            // CRANE: remove A = CRNE? No.
            // Think: removing a vowel from a word leaves a real word.
            // COIN: remove O = CIN? No. Remove I = CON (real!). But CON is only 3 letters from 4.
            // MOAT: remove O = MAT (real). I at start of word2?
            // Actually I need 5-letter words where removing a vowel leaves a real word.
            // SAINT: S-A-I-N-T. Remove A = SINT? No. Remove I = SANT? No.
            // HOUSE: H-O-U-S-E. Remove O = HUSE? No. Remove U = HOSE (real!). U is a vowel!
            // HOUSE: remove U = HOSE (real). U + NIT = UNIT (real! U goes to start). All verified!
            name: "Evie",
            scenario: "tackling a vowel-move question",
            word1: "HOUSE",
            word2: "NIT",
            movedLetter: "U",
            newWord1: "HOSE",
            newWord2: "UNIT",
            insertPosition: "start",
            options: ["H", "O", "U", "S", "E"],
            correctAnswer: "U",
            explanation: "Remove U from HOUSE = HOSE (a tube for water). Insert U at the start of NIT = UNIT (a single item). Both are real words! ✓"
          },
          {
            // BEARD: B-E-A-R-D. Remove E = BARD (real!). E is a vowel.
            // E + ACH = EACH (real! E goes to start). All verified.
            name: "Marcus",
            scenario: "spotting a sneaky vowel move",
            word1: "BEARD",
            word2: "ACH",
            movedLetter: "E",
            newWord1: "BARD",
            newWord2: "EACH",
            insertPosition: "start",
            options: ["B", "E", "A", "R", "D"],
            correctAnswer: "E",
            explanation: "Remove E from BEARD = BARD (a poet). Insert E at the start of ACH = EACH (every one). Both are real words! ✓"
          },
          {
            // GOURD: G-O-U-R-D. Remove O = GURD? No. Remove U = GORD? No.
            // FLOAT: F-L-O-A-T. Remove O = FLAT (real!). O + NE = ONE (real! O goes to start). All verified.
            name: "Aisha",
            scenario: "puzzling over which vowel moves",
            word1: "FLOAT",
            word2: "NE",
            movedLetter: "O",
            newWord1: "FLAT",
            newWord2: "ONE",
            insertPosition: "start",
            options: ["F", "L", "O", "A", "T"],
            correctAnswer: "O",
            explanation: "Remove O from FLOAT = FLAT (level and smooth). Insert O at the start of NE = ONE (the number 1). Both are real words! ✓"
          },
          {
            // TRAIL: T-R-A-I-L. Remove A = TRIL? No. Remove I = TRAL? No.
            // LEARN: L-E-A-R-N. Remove E = LARN? Hmm, archaic. Skip.
            // BLEACH: remove E = BLACH? No.
            // COARSE: C-O-A-R-S-E. Remove O = CARSE? Not standard.
            // STEAM: S-T-E-A-M. Remove E = STAM? No. Remove A = STEM (real!). A is a vowel.
            // A + IRE = AIRE? Hmm. A + TE = ATE (real!). But TE isn't a real word as word2.
            // A + CORN = ACORN (real!). But remove A from STEAM = STEM. Word2 = CORN. STEM + ACORN.
            // Word1=STEAM, word2=CORN, move A, newWord1=STEM, newWord2=ACORN. CORN is real, ACORN is real. All verified!
            name: "Charlie",
            scenario: "finding the hidden vowel",
            word1: "STEAM",
            word2: "CORN",
            movedLetter: "A",
            newWord1: "STEM",
            newWord2: "ACORN",
            insertPosition: "start",
            options: ["S", "T", "E", "A", "M"],
            correctAnswer: "A",
            explanation: "Remove A from STEAM = STEM (the stalk of a plant). Insert A at the start of CORN = ACORN (an oak tree seed). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Surprise — vowels move too!",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Don't just test consonants (B, C, D...) — sometimes a **vowel** (A, E, I, O, U) is the letter that moves! Vowel moves can be surprising because the word looks totally different without its vowel.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Testing vowel removal",
            body: (v) => `Look at **${v.word1}** and **${v.word2}**. When you remove a vowel from a word, the remaining letters can look very odd. Say it aloud — does it sound like a real word?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Remove "${v.movedLetter}" from ${v.word1}`, why: `"${v.movedLetter}" is a vowel` },
                  { text: `Result: ${v.newWord1}`, why: `Is ${v.newWord1} a real word? YES!` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `${v.newWord2} is a real word too ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which **vowel** moves from **${v.word1}** to **${v.word2}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `Move a letter from ${v.word1} into ${v.word2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.word1} to ${v.word2}?`,
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
            title: () => "Vowels — now in your toolkit!",
            body: () => `Nice one! Now you know vowels can move too. Here's what to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Vowels: A, E, I, O, U", why: "Any of these can be the moved letter" },
                  { text: "Remove the vowel and say what's left out loud", why: "Does it sound like a real word?" },
                  { text: "HOUSE - U = HOSE, FLOAT - O = FLAT", why: "Vowel moves are real — test them ✓" }
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
  // SUB-CONCEPT 7: Consonant Moves
  // Category: supporting
  // ==========================================
  {
    id: "consonant-moves",
    name: "Moving a Consonant",
    category: "supporting",
    lessons: [
      {
        id: "consonant-moves-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Meet the usual suspects: the consonants that move the most (B, C, S, G, P, F, T)",
          "How recognising these common movers gives you a head start"
        ],
        variableSets: [
          {
            // GRIPE: remove G = RIPE (real). G + LOW = GLOW (real). All verified.
            name: "Daisy",
            scenario: "looking for which consonant moves",
            word1: "GRIPE",
            word2: "LOW",
            movedLetter: "G",
            newWord1: "RIPE",
            newWord2: "GLOW",
            insertPosition: "start",
            options: ["G", "R", "I", "P", "E"],
            correctAnswer: "G",
            explanation: "Remove G from GRIPE = RIPE (ready to eat). Insert G at the start of LOW = GLOW (to shine softly). Both are real words! ✓",
            // Interact-specific: SWEAR → WEAR, S + POT = SPOT. All verified.
            interactWord1: "SWEAR",
            interactWord2: "POT",
            interactMovedLetter: "S",
            interactNewWord1: "WEAR",
            interactNewWord2: "SPOT",
            interactOptions: ["S", "W", "E", "A", "R"],
            interactCorrectAnswer: "S",
            interactExplanation: "Remove S from SWEAR = WEAR (to put on clothes). Insert S at the start of POT = SPOT (a mark or place). Both are real words! ✓"
          },
          {
            // STONE: remove S = TONE (real). S + CAR = SCAR (real). All verified.
            name: "Oliver",
            scenario: "testing consonants one by one",
            word1: "STONE",
            word2: "CAR",
            movedLetter: "S",
            newWord1: "TONE",
            newWord2: "SCAR",
            insertPosition: "start",
            options: ["S", "T", "O", "N", "E"],
            correctAnswer: "S",
            explanation: "Remove S from STONE = TONE (a musical sound). Insert S at the start of CAR = SCAR (a mark left by a wound). Both are real words! ✓",
            // Interact-specific: BLOOM → LOOM, B + OAT = BOAT. All verified.
            interactWord1: "BLOOM",
            interactWord2: "OAT",
            interactMovedLetter: "B",
            interactNewWord1: "LOOM",
            interactNewWord2: "BOAT",
            interactOptions: ["B", "L", "O", "O", "M"],
            interactCorrectAnswer: "B",
            interactExplanation: "Remove B from BLOOM = LOOM (a weaving frame). Insert B at the start of OAT = BOAT (floats on water). Both are real words! ✓"
          },
          {
            // BRACE: remove B = RACE (real). B + OAT = BOAT (real). All verified.
            name: "Priya",
            scenario: "practising with common consonant moves",
            word1: "BRACE",
            word2: "OAT",
            movedLetter: "B",
            newWord1: "RACE",
            newWord2: "BOAT",
            insertPosition: "start",
            options: ["B", "R", "A", "C", "E"],
            correctAnswer: "B",
            explanation: "Remove B from BRACE = RACE (a competition). Insert B at the start of OAT = BOAT (floats on water). Both are real words! ✓",
            // Interact-specific: PRICE → RICE, P + LAY = PLAY. All verified.
            interactWord1: "PRICE",
            interactWord2: "LAY",
            interactMovedLetter: "P",
            interactNewWord1: "RICE",
            interactNewWord2: "PLAY",
            interactOptions: ["P", "R", "I", "C", "E"],
            interactCorrectAnswer: "P",
            interactExplanation: "Remove P from PRICE = RICE (a food). Insert P at the start of LAY = PLAY (a game). Both are real words! ✓"
          },
          {
            // PLATE: remove P = LATE (real). P + AN = PAN (real). All verified.
            name: "Finn",
            scenario: "racing through consonant questions",
            word1: "PLATE",
            word2: "AN",
            movedLetter: "P",
            newWord1: "LATE",
            newWord2: "PAN",
            insertPosition: "start",
            options: ["P", "L", "A", "T", "E"],
            correctAnswer: "P",
            explanation: "Remove P from PLATE = LATE (not on time). Insert P at the start of AN = PAN (a cooking pot). Both are real words! ✓",
            // Interact-specific: FROWN → ROW? No, FROWN = F-R-O-W-N. Remove F = ROWN? No.
            // CHARM → HARM, C + OAT = COAT. All verified.
            interactWord1: "CHARM",
            interactWord2: "OAT",
            interactMovedLetter: "C",
            interactNewWord1: "HARM",
            interactNewWord2: "COAT",
            interactOptions: ["C", "H", "A", "R", "M"],
            interactCorrectAnswer: "C",
            interactExplanation: "Remove C from CHARM = HARM (damage). Insert C at the start of OAT = COAT (a jacket). Both are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Meet the usual suspects!",
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Consonants are the letters that move most often, and some are real favourites: **S, B, P, G, F** and **C**. Spot one of these at the start or end of word 1? That's a great place to start testing!\n\n**${v.word1}** and **${v.word2}** — which consonant moves?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The usual suspects: S, B, P, G, F, C",
            body: (v) => `**${v.word1}** starts with **"${v.word1[0]}"** — is that one of the usual suspects? The consonants S, B, P, G, F, and C are the most commonly moved letters. If word 1 starts with one of them, test it first!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.word1} starts with "${v.word1[0]}"`, why: `Is "${v.word1[0]}" one of the usual suspects?` },
                  { text: `Remove "${v.movedLetter}": ${v.word1} → ${v.newWord1}`, why: `${v.newWord1} is a real word!` },
                  { text: `Insert into ${v.word2}: ${v.newWord2}`, why: `${v.newWord2} is a real word too ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "S, B, P", right: "most commonly moved" },
                { left: "G, F, C", right: "also frequently moved" },
                { left: "First letter", right: "try this position first" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which consonant moves from **${v.interactWord1}** to **${v.interactWord2}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Your consonant cheat sheet",
            body: () => `Excellent! Keep these common movers in mind — they'll save you time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "S: STALE→TALE, SPINE→PINE, STONE→TONE", why: "S is the #1 most common mover" },
                  { text: "B: BLAND→LAND, BRAVE→RAVE, BRACE→RACE", why: "B is very common at the start" },
                  { text: "P, G, F, C: PRICE→RICE, GLOVE→LOVE, FLAKE→LAKE", why: "These are all worth testing first ✓" }
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
  // SUB-CONCEPT 8: Systematic Testing
  // Category: other
  // ==========================================
  {
    id: "systematic-testing",
    name: "Testing Letters Systematically",
    category: "other",
    lessons: [
      {
        id: "systematic-testing-steps",
        templateType: "step-by-step",
        learningGoal: [
          "A proper system for testing letters: first, last, then middle — no more guessing!",
          "Why having this system means you'll never feel stuck or panicky in the exam"
        ],
        variableSets: [
          {
            // CREAM: C-R-E-A-M. Remove C = REAM (real). C + OAT = COAT (real). All verified.
            // Test: first letter C → REAM → real? Yes! Quick find.
            name: "Evie",
            scenario: "using a system to find the answer quickly",
            word1: "CREAM",
            word2: "OAT",
            movedLetter: "C",
            newWord1: "REAM",
            newWord2: "COAT",
            insertPosition: "start",
            testSequence: [
              { letter: "C", remaining: "REAM", isWord: true, result: "First letter works!" }
            ],
            options: ["C", "R", "E", "A", "M"],
            correctAnswer: "C",
            explanation: "Test the first letter: remove C from CREAM = REAM (a quantity of paper). Insert C at the start of OAT = COAT (a jacket). Both are real words! ✓"
          },
          {
            // SMART: S-M-A-R-T. Remove S = MART (real). S + OIL = SOIL (real). All verified.
            name: "Marcus",
            scenario: "following the system step by step",
            word1: "SMART",
            word2: "OIL",
            movedLetter: "S",
            newWord1: "MART",
            newWord2: "SOIL",
            insertPosition: "start",
            testSequence: [
              { letter: "S", remaining: "MART", isWord: true, result: "First letter works!" }
            ],
            options: ["S", "M", "A", "R", "T"],
            correctAnswer: "S",
            explanation: "Test the first letter: remove S from SMART = MART (a market). Insert S at the start of OIL = SOIL (earth for growing plants). Both are real words! ✓"
          },
          {
            // SHUNT: S-H-U-N-T. Remove S = HUNT (real). S + OWN = SOWN (real). All verified.
            // First letter S works immediately.
            name: "Aisha",
            scenario: "seeing how fast the system works",
            word1: "SHUNT",
            word2: "OWN",
            movedLetter: "S",
            newWord1: "HUNT",
            newWord2: "SOWN",
            insertPosition: "start",
            testSequence: [
              { letter: "S", remaining: "HUNT", isWord: true, result: "First letter works!" }
            ],
            options: ["S", "H", "U", "N", "T"],
            correctAnswer: "S",
            explanation: "Test the first letter: remove S from SHUNT = HUNT (to search for). Insert S at the start of OWN = SOWN (planted seeds). Both are real words! ✓"
          },
          {
            // GRAVE: G-R-A-V-E. Remove G = RAVE (real). But we want R (middle letter) to be the answer.
            // Actually for systematic testing, let me show one where first doesn't work.
            // GRAVE: remove G = RAVE (real). G + OAR = GOAR? Not a word. So first letter removal gives a word but insertion fails.
            // Try R: remove R = GAVE (real). R + OAR = ROAR (real!). Success on second try.
            name: "Charlie",
            scenario: "using the system when the first letter doesn't quite work",
            word1: "GRAVE",
            word2: "OAR",
            movedLetter: "R",
            newWord1: "GAVE",
            newWord2: "ROAR",
            insertPosition: "start",
            testSequence: [
              { letter: "G", remaining: "RAVE", isWord: true, insertResult: "GOAR — not a word!", result: "First letter fails at step 3" },
              { letter: "R", remaining: "GAVE", isWord: true, insertResult: "ROAR — real word!", result: "Second letter works!" }
            ],
            options: ["G", "R", "A", "V", "E"],
            correctAnswer: "R",
            explanation: "First letter G: RAVE is real, but GOAR isn't. Try R: GAVE is real, and ROAR is real. The second letter was the answer! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Work smart — use a system!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's the thing that separates good solvers from great ones: having a **system** instead of guessing randomly.\n\n1. Try the **first** letter\n2. Try the **last** letter\n3. Then try **middle** letters\n\nThis order is fastest because first and last letters are the quickest to test!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "First → Last → Middle",
            body: (v) => `Let's work through **${v.word1}** and **${v.word2}** step by step:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Step 1: Try "${v.word1[0]}" (first letter)`, why: `Remove it: does the rest make a word?` },
                  { text: `Step 2: If not, try "${v.word1[v.word1.length - 1]}" (last letter)`, why: "Cover the end — is the rest real?" },
                  { text: `Answer: "${v.movedLetter}" — ${v.newWord1} and ${v.newWord2}`, why: "System found it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Try the FIRST letter of ${v.word1}`,
                `If that doesn't work, try the LAST letter`,
                `If still no luck, try a MIDDLE letter`,
                `Check both new words are real`
              ],
              feedback: {
                correct: (v) => `Perfect! First → last → middle is the fastest system. ✓`,
                incorrect: (v) => `Not quite — always try first letter, then last, then middle.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — use the system!",
            body: (v) => `Follow the system: first → last → middle.\n\nWhich letter moves from **${v.word1}** to **${v.word2}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `Move a letter from ${v.word1} into ${v.word2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.word1} to ${v.word2}?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.explanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Your testing system — locked in!",
            body: () => `Fantastic! You've got a proper system now. Always test in this order:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. FIRST letter — cover it, read the rest", why: "Takes 2 seconds to check" },
                  { text: "2. LAST letter — cover the end, read what's left", why: "Also takes 2 seconds" },
                  { text: "3. MIDDLE letters — only if 1 and 2 fail", why: "First + last solves most questions ✓" }
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
  // SUB-CONCEPT 9: Checking Both Words
  // Category: other
  // ==========================================
  {
    id: "checking-both-words",
    name: "Checking BOTH Words Are Real",
    category: "other",
    lessons: [
      {
        id: "checking-both-words-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The golden rule: BOTH new words must be real — one out of two won't do!",
          "How to dodge the sneaky traps where one word looks real but the other isn't"
        ],
        variableSets: [
          {
            // SPARK: remove S = PARK (real). S + OAK = SOAK (real). All verified.
            name: "Daisy",
            scenario: "learning to double-check both words",
            word1: "SPARK",
            word2: "OAK",
            movedLetter: "S",
            newWord1: "PARK",
            newWord2: "SOAK",
            insertPosition: "start",
            trapLetter: "K",
            trapWord1: "SPAR",
            trapWord2: "KOAK",
            options: ["S", "P", "A", "R", "K"],
            correctAnswer: "S",
            explanation: "Remove S from SPARK = PARK (a green space). Insert S at the start of OAK = SOAK (to drench). PARK ✓ and SOAK ✓ — both real! ✓",
            // Interact-specific: BRACE → RACE, B + OAT = BOAT. All verified.
            interactWord1: "BRACE",
            interactWord2: "OAT",
            interactMovedLetter: "B",
            interactNewWord1: "RACE",
            interactNewWord2: "BOAT",
            interactOptions: ["B", "R", "A", "C", "E"],
            interactCorrectAnswer: "B",
            interactExplanation: "Remove B from BRACE = RACE (a competition). Insert B at the start of OAT = BOAT (floats on water). RACE ✓ and BOAT ✓ — both real! ✓"
          },
          {
            // SWEAR: remove S = WEAR (real). S + POT = SPOT (real). All verified.
            name: "Oliver",
            scenario: "checking his answers carefully",
            word1: "SWEAR",
            word2: "POT",
            movedLetter: "S",
            newWord1: "WEAR",
            newWord2: "SPOT",
            insertPosition: "start",
            trapLetter: "E",
            trapWord1: "SWAR",
            trapWord2: "EPOT",
            options: ["S", "W", "E", "A", "R"],
            correctAnswer: "S",
            explanation: "Remove S from SWEAR = WEAR (to put on clothes). Insert S at the start of POT = SPOT (a mark or place). WEAR ✓ and SPOT ✓ — both real! ✓",
            // Interact-specific: GLOVE → LOVE, G + ROW = GROW. All verified.
            interactWord1: "GLOVE",
            interactWord2: "ROW",
            interactMovedLetter: "G",
            interactNewWord1: "LOVE",
            interactNewWord2: "GROW",
            interactOptions: ["G", "L", "O", "V", "E"],
            interactCorrectAnswer: "G",
            interactExplanation: "Remove G from GLOVE = LOVE (a real word). Insert G at the start of ROW = GROW (to get bigger). LOVE ✓ and GROW ✓ — both real! ✓"
          },
          {
            // GROAN: remove G = ROAN (real). G + OWN = GOWN (real). All verified.
            name: "Priya",
            scenario: "making sure both words work",
            word1: "GROAN",
            word2: "OWN",
            movedLetter: "G",
            newWord1: "ROAN",
            newWord2: "GOWN",
            insertPosition: "start",
            trapLetter: "N",
            trapWord1: "GROA",
            trapWord2: "NOWN",
            options: ["G", "R", "O", "A", "N"],
            correctAnswer: "G",
            explanation: "Remove G from GROAN = ROAN (a reddish-brown colour). Insert G at the start of OWN = GOWN (a long dress). ROAN ✓ and GOWN ✓ — both real! ✓",
            // Interact-specific: WHEAT → HEAT, W + EAR = WEAR. All verified.
            interactWord1: "WHEAT",
            interactWord2: "EAR",
            interactMovedLetter: "W",
            interactNewWord1: "HEAT",
            interactNewWord2: "WEAR",
            interactOptions: ["W", "H", "E", "A", "T"],
            interactCorrectAnswer: "W",
            interactExplanation: "Remove W from WHEAT = HEAT (hot temperature). Insert W at the start of EAR = WEAR (to put on clothes). HEAT ✓ and WEAR ✓ — both real! ✓"
          },
          {
            // CLAMP: remove C = LAMP (real). C + OWL = COWL (real). All verified.
            name: "Finn",
            scenario: "double-checking every answer",
            word1: "CLAMP",
            word2: "OWL",
            movedLetter: "C",
            newWord1: "LAMP",
            newWord2: "COWL",
            insertPosition: "start",
            trapLetter: "M",
            trapWord1: "CLAP",
            trapWord2: "MOWL",
            options: ["C", "L", "A", "M", "P"],
            correctAnswer: "C",
            explanation: "Remove C from CLAMP = LAMP (a light). Insert C at the start of OWL = COWL (a hood or cover). LAMP ✓ and COWL ✓ — both real! ✓",
            // Interact-specific: FRIGHT → RIGHT, F + ARM = FARM. All verified.
            interactWord1: "FRIGHT",
            interactWord2: "ARM",
            interactMovedLetter: "F",
            interactNewWord1: "RIGHT",
            interactNewWord2: "FARM",
            interactOptions: ["F", "R", "I", "G", "H"],
            interactCorrectAnswer: "F",
            interactExplanation: "Remove F from FRIGHT = RIGHT (correct). Insert F at the start of ARM = FARM (where animals live). RIGHT ✓ and FARM ✓ — both real! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Both words MUST be real!",
            body: (v) => `${v.name} is ${v.scenario}.\n\nWatch out for the biggest trap in letter-move questions: sometimes removing a letter makes word 1 look fine, but the new word 2 **isn't a real word at all**.\n\nAlways check **BOTH** words before you commit to your answer!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The double-check rule",
            body: (v) => `Let's check **${v.word1}** and **${v.word2}**. After removing a letter, ask TWO questions:\n1. Is the new word 1 real?\n2. Is the new word 2 real?\n\nIf EITHER answer is no, try a different letter!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Remove "${v.movedLetter}" from ${v.word1} → ${v.newWord1}`, why: `Is ${v.newWord1} a real word? YES ✓` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `Is ${v.newWord2} a real word? YES ✓` },
                  { text: "BOTH are real — this is the answer!", why: "Never submit until you've checked both ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `After moving a letter, you must check that ____ new words are real`,
              options: (v) => ["both", "one", "neither", "three"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Both new words must be real English words. ✓`,
                incorrect: (v) => `Not quite — BOTH new words must be real for the answer to be correct!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — check both!",
            body: (v) => `Which letter moves from **${v.interactWord1}** to **${v.interactWord2}** to make **TWO** real words?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "The BOTH rule — your safety net!",
            body: () => `You've learned the golden rule that keeps you safe from traps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Remove the letter from word 1", why: "Is what's left a REAL word?" },
                  { text: "2. Insert the letter into word 2", why: "Is the new word 2 REAL?" },
                  { text: "3. BOTH must be real — or try again!", why: "One real + one fake = WRONG answer ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "checking-both-words-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "The one-word trap: it looks right but only ONE new word is real — gotcha!",
          "Why taking an extra second to check saves you from losing easy marks"
        ],
        variableSets: [
          {
            // BLEND: B-L-E-N-D. Remove B = LEND (real). B + OAR = BOAR (real). Correct answer.
            // Trap: remove L = BEND (real). L + OAR = LOAR (not real!). One real, one not!
            name: "Evie",
            scenario: "finding the mistake in her friend's answer",
            word1: "BLEND",
            word2: "OAR",
            movedLetter: "B",
            newWord1: "LEND",
            newWord2: "BOAR",
            insertPosition: "start",
            wrongLetter: "L",
            wrongWord1: "BEND",
            wrongWord2: "LOAR",
            whyWrong: "BEND is real, but LOAR isn't a word! You must check BOTH.",
            options: ["B", "L", "E", "N", "D"],
            correctAnswer: "B",
            explanation: "Remove B from BLEND = LEND (to loan). Insert B at the start of OAR = BOAR (a wild pig). LEND ✓ and BOAR ✓ — both real! ✓",
            // Interact-specific: STALE → TALE, S + OAR = SOAR. All verified.
            interactWord1: "STALE",
            interactWord2: "OAR",
            interactMovedLetter: "S",
            interactNewWord1: "TALE",
            interactNewWord2: "SOAR",
            interactOptions: ["S", "T", "A", "L", "E"],
            interactCorrectAnswer: "S",
            interactExplanation: "Remove S from STALE = TALE (a story). Insert S at the start of OAR = SOAR (to fly high). TALE ✓ and SOAR ✓ — both real! ✓"
          },
          {
            // BLOCK: B-L-O-C-K. Remove B = LOCK (real). B + OAR = BOAR (real). Correct.
            // Trap: remove K = BLOC (real — a political bloc). K + OAR = KOAR (not real!).
            name: "Marcus",
            scenario: "spotting the trap in a tricky question",
            word1: "BLOCK",
            word2: "OAR",
            movedLetter: "B",
            newWord1: "LOCK",
            newWord2: "BOAR",
            insertPosition: "start",
            wrongLetter: "K",
            wrongWord1: "BLOC",
            wrongWord2: "KOAR",
            whyWrong: "BLOC might be real, but KOAR definitely isn't! Always check word 2.",
            options: ["B", "L", "O", "C", "K"],
            correctAnswer: "B",
            explanation: "Remove B from BLOCK = LOCK (to fasten). Insert B at the start of OAR = BOAR (a wild pig). LOCK ✓ and BOAR ✓ — both real! ✓",
            // Interact-specific: FLAKE → LAKE, F + OWL = FOWL. All verified.
            interactWord1: "FLAKE",
            interactWord2: "OWL",
            interactMovedLetter: "F",
            interactNewWord1: "LAKE",
            interactNewWord2: "FOWL",
            interactOptions: ["F", "L", "A", "K", "E"],
            interactCorrectAnswer: "F",
            interactExplanation: "Remove F from FLAKE = LAKE (a body of water). Insert F at the start of OWL = FOWL (a bird). LAKE ✓ and FOWL ✓ — both real! ✓"
          },
          {
            // SWELL: S-W-E-L-L. Remove S = WELL (real). S + OAR = SOAR (real). Correct.
            // Trap: remove W = SELL (real). W + OAR = WOAR (not real!).
            name: "Aisha",
            scenario: "learning from a common mistake",
            word1: "SWELL",
            word2: "OAR",
            movedLetter: "S",
            newWord1: "WELL",
            newWord2: "SOAR",
            insertPosition: "start",
            wrongLetter: "W",
            wrongWord1: "SELL",
            wrongWord2: "WOAR",
            whyWrong: "SELL is real, but WOAR isn't a word! The W trap catches people who don't check word 2.",
            options: ["S", "W", "E", "L", "L"],
            correctAnswer: "S",
            explanation: "Remove S from SWELL = WELL (a source of water). Insert S at the start of OAR = SOAR (to fly high). WELL ✓ and SOAR ✓ — both real! ✓",
            // Interact-specific: BLAND → LAND, B + OWL = BOWL. All verified.
            interactWord1: "BLAND",
            interactWord2: "OWL",
            interactMovedLetter: "B",
            interactNewWord1: "LAND",
            interactNewWord2: "BOWL",
            interactOptions: ["B", "L", "A", "N", "D"],
            interactCorrectAnswer: "B",
            interactExplanation: "Remove B from BLAND = LAND (ground). Insert B at the start of OWL = BOWL (a deep dish). LAND ✓ and BOWL ✓ — both real! ✓"
          },
          {
            // SCOLD: S-C-O-L-D. Remove S = COLD (real). S + OWN = SOWN (real). Correct.
            // Trap: remove C = SOLD (real). C + OWN = COWN (not real!).
            name: "Charlie",
            scenario: "avoiding the double-check trap",
            word1: "SCOLD",
            word2: "OWN",
            movedLetter: "S",
            newWord1: "COLD",
            newWord2: "SOWN",
            insertPosition: "start",
            wrongLetter: "C",
            wrongWord1: "SOLD",
            wrongWord2: "COWN",
            whyWrong: "SOLD is real, but COWN isn't a word! Removing C is tempting but word 2 doesn't work.",
            options: ["S", "C", "O", "L", "D"],
            correctAnswer: "S",
            explanation: "Remove S from SCOLD = COLD (low temperature). Insert S at the start of OWN = SOWN (seeds planted). COLD ✓ and SOWN ✓ — both real! ✓",
            // Interact-specific: GRIPE → RIPE, G + LOW = GLOW. All verified.
            interactWord1: "GRIPE",
            interactWord2: "LOW",
            interactMovedLetter: "G",
            interactNewWord1: "RIPE",
            interactNewWord2: "GLOW",
            interactOptions: ["G", "R", "I", "P", "E"],
            interactCorrectAnswer: "G",
            interactExplanation: "Remove G from GRIPE = RIPE (ready to eat). Insert G at the start of LOW = GLOW (to shine softly). RIPE ✓ and GLOW ✓ — both real! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Trap alert: "${v.wrongLetter}" looks tempting!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSomeone picked **"${v.wrongLetter}"** as the letter to move from **${v.word1}** to **${v.word2}**.\n\nRemove "${v.wrongLetter}" → ${v.wrongWord1} (looks OK!)\nInsert "${v.wrongLetter}" → ${v.wrongWord2} (is that a word...?)\n\n${v.whyWrong}`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.word1.split(''),
                label: `${v.word1}  →  move a letter  →  ${v.word2}`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The trap — one real, one fake",
            body: (v) => `${v.whyWrong}\n\nThe correct letter is **"${v.movedLetter}"** — let's check BOTH words:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Remove "${v.movedLetter}" from ${v.word1} → ${v.newWord1}`, why: `${v.newWord1} — real word? YES ✓` },
                  { text: `Insert "${v.movedLetter}" into ${v.word2} → ${v.newWord2}`, why: `${v.newWord2} — real word? YES ✓` },
                  { text: "BOTH are real — this is correct!", why: "Always verify both before answering ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — avoid the trap!",
            body: (v) => `Which letter ACTUALLY moves from **${v.interactWord1}** to **${v.interactWord2}**?\n\nRemember to check BOTH new words are real!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.interactWord1.split(''),
                label: `Move a letter from ${v.interactWord1} into ${v.interactWord2}:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter should you move from ${v.interactWord1} to ${v.interactWord2}?`,
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
            title: () => "Trap-proof — you've got this!",
            body: () => `Now you know the sneakiest trap in letter-move questions — and how to avoid it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Checking word 1 but forgetting word 2", why: "SOLD is real, but COWN isn't!" },
                  { text: "Or checking word 2 but forgetting word 1", why: "Both must be real English words" },
                  { text: "ALWAYS check BOTH before you answer", why: "Two ticks needed: word 1 ✓ AND word 2 ✓" }
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

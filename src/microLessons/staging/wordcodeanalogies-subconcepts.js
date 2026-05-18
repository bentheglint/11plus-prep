// ============================================================
// Supplementary sub-concepts for Word Code Analogies (Verbal Reasoning)
// To merge: add these to lessonBank.wordCodeAnalogies.subConcepts array in lessonData.js
// ============================================================

export const wordCodeAnalogiesSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Letter Swap
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "letter-swap",
    name: "First & Last Letter Swap",
    category: "core",
    lessons: [
      {
        id: "letter-swap-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when the first and last letters have swapped places",
          "Use the 3-step method to crack swap transformations every time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving word code puzzles at the kitchen table",
            exampleInput: "big",
            exampleOutput: "gib",
            rule: "the first and last letters swap places",
            testWord: "hat",
            answer: "tah",
            ruleSteps: [
              "Compare: big → gib — the B and G swapped",
              "Name the rule: first and last letters swap places",
              "Apply to hat: swap H and T → tah"
            ],
            options: ["tah", "ath", "hta", "tab", "tha"],
            correctAnswer: "tah",
            explanation: "big→gib: the first letter (b) and last letter (g) swapped. Apply to hat: swap h and t → tah. The middle letter stays put. ✓"
          },
          {
            name: "Oliver",
            scenario: "working through his VR practice book",
            exampleInput: "cup",
            exampleOutput: "puc",
            rule: "the first and last letters swap places",
            testWord: "dog",
            answer: "god",
            ruleSteps: [
              "Compare: cup → puc — the C and P swapped",
              "Name the rule: first and last letters swap",
              "Apply to dog: swap D and G → god"
            ],
            options: ["god", "gdo", "odg", "dig", "dgo"],
            correctAnswer: "god",
            explanation: "cup→puc: first letter (c) and last letter (p) swapped. Apply to dog: swap d and g → god. ✓"
          },
          {
            name: "Priya",
            scenario: "practising code puzzles for her VR test",
            exampleInput: "rub",
            exampleOutput: "bur",
            rule: "the first and last letters swap places",
            testWord: "map",
            answer: "pam",
            ruleSteps: [
              "Compare: rub → bur — the R and B swapped",
              "Name the rule: first and last letters swap",
              "Apply to map: swap M and P → pam"
            ],
            options: ["pam", "amp", "mpa", "apm", "pma"],
            correctAnswer: "pam",
            explanation: "rub→bur: first letter (r) and last letter (b) swapped. Apply to map: swap m and p → pam. ✓"
          },
          {
            name: "Finn",
            scenario: "solving code puzzles at breaktime",
            exampleInput: "ten",
            exampleOutput: "net",
            rule: "the first and last letters swap places",
            testWord: "pin",
            answer: "nip",
            ruleSteps: [
              "Compare: ten → net — the T and N swapped",
              "Name the rule: first and last letters swap",
              "Apply to pin: swap P and N → nip"
            ],
            options: ["nip", "ipn", "npi", "inp", "pni"],
            correctAnswer: "nip",
            explanation: "ten→net: first letter (t) and last letter (n) swapped. Apply to pin: swap p and n → nip. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What happened to "${v.exampleInput}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nIn a word code (a rule that changes how letters are written), a word goes in and a changed word comes out. It's like a secret language!\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThe letters haven't been added or removed — they've **moved**! Can you see what happened?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "First & Last Swap",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. The first and last letters have swapped places. The middle letter(s) stay where they are.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Compare the original and coded word to spot the change`,
                `Name the rule in words you can apply`,
                `Apply the exact same rule to the new word`
              ],
              feedback: {
                correct: (v) => `Perfect order! Spot, name, then apply. ✓`,
                incorrect: (v) => `Not quite — always spot the change first before naming the rule!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — apply the rule!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe first and last letters swap. What does **${v.testWord}** become?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "First & Last Swap — sorted!",
            body: () => `You've got the swap rule down. Here's your checklist:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check: did the first letter move to the end?", why: "And did the last letter move to the front?" },
                  { text: "2. The middle letters stay exactly where they are", why: "Only the ends move" },
                  { text: "3. Apply: swap the first and last letters of the new word", why: "pin → nip, hat → tah ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "letter-swap-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Understand why reversing the whole word is NOT the same as swapping the ends",
          "Avoid the classic trap of confusing swap with reverse"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her friend's VR homework",
            exampleInput: "snap",
            exampleOutput: "pnas",
            rule: "first and last letters swap",
            testWord: "trim",
            friendAnswer: "mirt",
            correctOutput: "mrit",
            whyWrong: "They reversed the whole word instead of just swapping the first and last letters",
            options: ["mrit", "mirt", "tmir", "irmt", "rtim"],
            correctAnswer: "mrit",
            explanation: "Only the first and last swap: t-r-i-m → m-r-i-t. The middle letters (r, i) stay in their places. ✓"
          },
          {
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            exampleInput: "held",
            exampleOutput: "delh",
            rule: "first and last letters swap",
            testWord: "rust",
            friendAnswer: "tsur",
            correctOutput: "tusr",
            whyWrong: "They reversed all the letters instead of swapping just the first and last",
            options: ["tusr", "tsur", "surt", "ruts", "trus"],
            correctAnswer: "tusr",
            explanation: "Only the first and last swap: r-u-s-t → t-u-s-r. The middle letters (u, s) stay where they are. ✓"
          },
          {
            name: "Aisha",
            scenario: "helping her brother with code puzzles",
            exampleInput: "cot",
            exampleOutput: "toc",
            rule: "first and last letters swap",
            testWord: "bed",
            friendAnswer: "deb",
            correctOutput: "deb",
            whyWrong: "With 3-letter words, swap and reverse give the same result — so the friend got it right this time!",
            options: ["deb", "edb", "bde", "ebd", "bed"],
            correctAnswer: "deb",
            explanation: "Swap the first (b) and last (d): b-e-d → d-e-b. With 3-letter words, the swap looks like a reverse — but the rule is the same! ✓"
          },
          {
            name: "Charlie",
            scenario: "going over his mock test results",
            exampleInput: "clap",
            exampleOutput: "plac",
            rule: "first and last letters swap",
            testWord: "stop",
            friendAnswer: "pots",
            correctOutput: "ptos",
            whyWrong: "They reversed the whole word. In a swap, only the first and last switch — the t and o in the middle stay put",
            options: ["ptos", "pots", "tops", "spot", "opts"],
            correctAnswer: "ptos",
            explanation: "Swap only the ends: s-t-o-p → p-t-o-s. The middle letters (t, o) keep their positions. 'pots' would be a full reversal. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendAnswer}" right for "${v.testWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}. The rule is: **${v.rule}**.\n\nThe answer given for **${v.testWord}** was **"${v.friendAnswer}"**.\n\nBut is that right? Press Next to find out!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Swap ≠ Reverse!",
            body: (v) => `${v.whyWrong}\n\nA **swap** only moves the first and last letters. A **reverse** flips everything. They're different rules!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.testWord}" — only swap the ENDS`, why: "The middle letters stay exactly where they are" },
                  { text: `Wrong: "${v.friendAnswer}"`, why: v.whyWrong },
                  { text: `Correct: "${v.correctOutput}" ✓`, why: "Only the first and last letters changed places" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A letter swap means the entire word is written backwards`, answer: false, explanation: `No! A swap only moves the first and last letters — the middle stays put. ✓` },
                { text: `In a swap, the middle letters stay in their original positions`, answer: true, explanation: `Correct! Only the first and last letters switch places. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "What's the correct answer?",
            body: (v) => `The rule is **${v.rule}**. What does **${v.testWord}** become?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
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
            title: () => "Swap vs Reverse — now you'll never mix them up!",
            body: () => `These two rules look similar but work very differently:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "SWAP: only the first and last letters switch", why: "stop → p-t-o-s (middle stays: t, o)" },
                  { text: "REVERSE: ALL letters flip backwards", why: "stop → p-o-t-s (everything moves)" },
                  { text: "Check the MIDDLE letters — did they move?", why: "If they stayed put, it's a swap ✓" }
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
  // SUB-CONCEPT 2: Letter Removal
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "letter-removal",
    name: "Remove a Letter",
    category: "core",
    lessons: [
      {
        id: "letter-removal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when a letter has vanished from the word — and figure out which one",
          "Identify which position the letter was removed from"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving word code puzzles in her VR book",
            exampleInput: "charm",
            exampleOutput: "harm",
            rule: "remove the first letter",
            testWord: "blend",
            answer: "lend",
            ruleSteps: [
              "Compare: charm → harm — the C at the start is gone",
              "Name the rule: the first letter is removed",
              "Apply to blend: remove B → lend"
            ],
            options: ["lend", "bend", "lent", "blnd", "lena"],
            correctAnswer: "lend",
            explanation: "charm→harm: the first letter (c) was removed. Apply to blend: remove the first letter (b) → lend. ✓"
          },
          {
            name: "Oliver",
            scenario: "working through code puzzles at school",
            exampleInput: "boat",
            exampleOutput: "boa",
            rule: "remove the last letter",
            testWord: "lamp",
            answer: "lam",
            ruleSteps: [
              "Compare: boat → boa — the T at the end is gone",
              "Name the rule: the last letter is removed",
              "Apply to lamp: remove P → lam"
            ],
            options: ["lam", "lap", "amp", "lmp", "lad"],
            correctAnswer: "lam",
            explanation: "boat→boa: the last letter (t) was removed. Apply to lamp: remove the last letter (p) → lam. ✓"
          },
          {
            name: "Priya",
            scenario: "practising code analogies before her mock test",
            exampleInput: "train",
            exampleOutput: "rain",
            rule: "remove the first letter",
            testWord: "stall",
            answer: "tall",
            ruleSteps: [
              "Compare: train → rain — the T at the start is gone",
              "Name the rule: the first letter is removed",
              "Apply to stall: remove S → tall"
            ],
            options: ["tall", "all", "stal", "sall", "tell"],
            correctAnswer: "tall",
            explanation: "train→rain: the first letter (t) was removed. Apply to stall: remove the first letter (s) → tall. ✓"
          },
          {
            name: "Finn",
            scenario: "solving code puzzles during his VR practice",
            exampleInput: "plan",
            exampleOutput: "pan",
            rule: "remove the second letter",
            testWord: "slip",
            answer: "sip",
            ruleSteps: [
              "Compare: plan → pan — the L (second letter) is gone",
              "Name the rule: the second letter is removed",
              "Apply to slip: remove L (second letter) → sip"
            ],
            options: ["sip", "lip", "slp", "sli", "sp"],
            correctAnswer: "sip",
            explanation: "plan→pan: the second letter (l) was removed. Apply to slip: remove the second letter (l) → sip. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `A letter has vanished!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLook carefully at this pair:\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThe output word is shorter — a letter has been **removed**! Your job: figure out which one disappeared and from where.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spot the Missing Letter",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Line up the letters side by side. The one that's gone tells you the rule — was it the first, second, or last letter?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — remove the letter!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe rule is: **${v.rule}**. What does **${v.testWord}** become?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Letter removal — you've got this!",
            body: () => `When a letter disappears, here's your plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Line up the letters — which one is missing?", why: "Count the letters: the output is shorter" },
                  { text: "2. Note the POSITION: first, second, last?", why: "The position is the rule, not which specific letter" },
                  { text: "3. Remove the letter at the same position from the new word", why: "charm→harm means 'remove first letter' for ANY word ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "letter-removal-variety",
        templateType: "curiosity-hook",
        learningGoal: [
          "Handle removal from any position — first, second, last, or anywhere else",
          "Count carefully to identify exactly which position was removed"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling different letter removal patterns",
            exampleInput: "pleat",
            exampleOutput: "peat",
            rule: "remove the second letter",
            testWord: "steam",
            answer: "seam",
            ruleSteps: [
              "Compare: pleat → peat — the L (2nd letter) is gone",
              "Name the rule: the second letter is removed",
              "Apply to steam: remove T (2nd letter) → seam"
            ],
            options: ["seam", "stem", "stam", "sear", "team"],
            correctAnswer: "seam",
            explanation: "pleat→peat: the second letter (l) was removed. Apply to steam: remove the second letter (t) → seam. ✓"
          },
          {
            name: "Marcus",
            scenario: "working through harder removal puzzles",
            exampleInput: "wheat",
            exampleOutput: "whea",
            rule: "remove the last letter",
            testWord: "frost",
            answer: "fros",
            ruleSteps: [
              "Compare: wheat → whea — the T at the end is gone",
              "Name the rule: the last letter is removed",
              "Apply to frost: remove T → fros"
            ],
            options: ["fros", "frot", "frog", "rost", "frst"],
            correctAnswer: "fros",
            explanation: "wheat→whea: the last letter (t) was removed. Apply to frost: remove the last letter (t) → fros. ✓"
          },
          {
            name: "Aisha",
            scenario: "decoding tricky removal patterns",
            exampleInput: "grand",
            exampleOutput: "grad",
            rule: "remove the fourth letter",
            testWord: "blank",
            answer: "blak",
            ruleSteps: [
              "Compare: grand → grad — the N (4th letter) is gone",
              "Name the rule: the fourth letter is removed",
              "Apply to blank: remove N (4th letter) → blak"
            ],
            options: ["blak", "bank", "blan", "blnk", "lank"],
            correctAnswer: "blak",
            explanation: "grand→grad: the fourth letter (n) was removed. Apply to blank: remove the fourth letter (n) → blak. ✓"
          },
          {
            name: "Charlie",
            scenario: "solving code puzzles in a timed test",
            exampleInput: "black",
            exampleOutput: "lack",
            rule: "remove the first letter",
            testWord: "clamp",
            answer: "lamp",
            ruleSteps: [
              "Compare: black → lack — the B at the start is gone",
              "Name the rule: the first letter is removed",
              "Apply to clamp: remove C → lamp"
            ],
            options: ["lamp", "camp", "lam", "amp", "lap"],
            correctAnswer: "lamp",
            explanation: "black→lack: the first letter (b) was removed. Apply to clamp: remove the first letter (c) → lamp. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which letter vanished this time?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nOne letter has been removed — but this time it might not be the first or last! Your job: find WHICH position it was in, then remove the letter at the same position from the new word.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count the position",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Line up the letters and count from the left to find which position is missing.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nRemove the correct letter!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Position is everything!",
            body: () => `Here's the important thing to remember — the rule is about POSITION, not which specific letter it is:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "First letter: charm → harm, train → rain", why: "Always the letter at position 1" },
                  { text: "Second letter: plan → pan, pleat → peat", why: "Always the letter at position 2" },
                  { text: "Last letter: boat → boa, wheat → whea", why: "Always the final letter ✓" }
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
  // SUB-CONCEPT 3: Letter Replacement
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "letter-replacement",
    name: "Replace a Letter",
    category: "core",
    lessons: [
      {
        id: "letter-replacement-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when one letter has been secretly swapped for another",
          "Figure out WHICH position changes and what it changes to"
        ],
        variableSets: [
          {
            name: "Olivia",
            scenario: "working on code puzzles in her VR practice",
            exampleInput: "bat",
            exampleOutput: "cat",
            rule: "the first letter changes to the next letter in the alphabet",
            testWord: "dog",
            answer: "eog",
            ruleSteps: [
              "Compare: bat → cat — the B changed to C",
              "Name the rule: first letter moves forward one in the alphabet (B→C)",
              "Apply to dog: D moves forward one → E, so dog → eog"
            ],
            options: ["eog", "cog", "fog", "doh", "doe"],
            correctAnswer: "eog",
            explanation: "bat→cat: the first letter moved forward one in the alphabet (B→C). Apply to dog: D→E, so dog → eog. ✓"
          },
          {
            name: "Sam",
            scenario: "decoding replacement patterns",
            exampleInput: "sit",
            exampleOutput: "sat",
            rule: "the middle letter changes to A",
            testWord: "hit",
            answer: "hat",
            ruleSteps: [
              "Compare: sit → sat — the I changed to A",
              "Name the rule: the middle letter is replaced with A",
              "Apply to hit: replace I with A → hat"
            ],
            options: ["hat", "hot", "hut", "het", "hap"],
            correctAnswer: "hat",
            explanation: "sit→sat: the middle letter changed from I to A. Apply to hit: replace I with A → hat. ✓"
          },
          {
            name: "Priya",
            scenario: "spotting replacement rules in her VR book",
            exampleInput: "cap",
            exampleOutput: "cup",
            rule: "the middle letter changes to U",
            testWord: "bat",
            answer: "but",
            ruleSteps: [
              "Compare: cap → cup — the A changed to U",
              "Name the rule: the middle letter is replaced with U",
              "Apply to bat: replace A with U → but"
            ],
            options: ["but", "bot", "bit", "bet", "bud"],
            correctAnswer: "but",
            explanation: "cap→cup: the middle letter changed from A to U. Apply to bat: replace A with U → but. ✓"
          },
          {
            name: "Finn",
            scenario: "solving replacement puzzles at his desk",
            exampleInput: "map",
            exampleOutput: "mat",
            rule: "the last letter changes to T",
            testWord: "cap",
            answer: "cat",
            ruleSteps: [
              "Compare: map → mat — the P changed to T",
              "Name the rule: the last letter is replaced with T",
              "Apply to cap: replace P with T → cat"
            ],
            options: ["cat", "car", "can", "cam", "cab"],
            correctAnswer: "cat",
            explanation: "map→mat: the last letter changed from P to T. Apply to cap: replace P with T → cat. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Something's different...`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThe word is the same length — no letters were added or removed. But something has **changed**! Can you spot which letter is different, and what it changed to?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Find the Changed Letter",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Go through each letter position. When you find one that's different, you've found the rule.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Compare letter by letter to find which position changed`,
                `Work out what the letter changed TO — is there a pattern?`,
                `Apply the same change at the same position in the new word`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the change, understand the pattern, then apply it. ✓`,
                incorrect: (v) => `Not quite — start by comparing letter by letter to find what changed!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — make the swap!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe rule is: **${v.rule}**. What does **${v.testWord}** become?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Letter replacement — easy when you know how!",
            body: () => `When a letter changes to a different one, follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Compare letter by letter — which position changed?", why: "Same length word = a replacement, not removal" },
                  { text: "2. What did it change TO? Is there a pattern?", why: "Fixed letter (always T)? Or alphabet shift (B→C, D→E)?" },
                  { text: "3. Apply the same change at the same position", why: "map→mat (last→T) means cap→cat (last→T) ✓" }
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
  // SUB-CONCEPT 4: Reverse Word
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "reverse-word",
    name: "Reverse the Word",
    category: "supporting",
    lessons: [
      {
        id: "reverse-word-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when a word has been flipped backwards — it's a common trick!",
          "Reverse words of different lengths accurately every time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "spotting reversal patterns in her VR book",
            exampleInput: "STAR",
            exampleOutput: "RATS",
            rule: "the word is reversed (written backwards)",
            testWord: "STOP",
            answer: "POTS",
            ruleSteps: [
              "Compare: STAR → RATS — the letters are in reverse order",
              "Name the rule: the whole word is reversed",
              "Apply to STOP: write it backwards → POTS"
            ],
            options: ["POTS", "TOPS", "SPOT", "POST", "OPTS"],
            correctAnswer: "POTS",
            explanation: "STAR→RATS: every letter is reversed. Apply to STOP: S-T-O-P backwards = P-O-T-S → POTS. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving reversal code puzzles",
            exampleInput: "LIVE",
            exampleOutput: "EVIL",
            rule: "the word is reversed",
            testWord: "MOOD",
            answer: "DOOM",
            ruleSteps: [
              "Compare: LIVE → EVIL — all letters reversed",
              "Name the rule: reverse the entire word",
              "Apply to MOOD: write backwards → DOOM"
            ],
            options: ["DOOM", "MOOD", "DOMO", "MOOB", "DOOP"],
            correctAnswer: "DOOM",
            explanation: "LIVE→EVIL: the word is reversed. Apply to MOOD: M-O-O-D backwards = D-O-O-M → DOOM. ✓"
          },
          {
            name: "Priya",
            scenario: "tackling word reversal problems",
            exampleInput: "WARD",
            exampleOutput: "DRAW",
            rule: "the word is reversed",
            testWord: "MAPS",
            answer: "SPAM",
            ruleSteps: [
              "Compare: WARD → DRAW — every letter reversed",
              "Name the rule: reverse the whole word",
              "Apply to MAPS: write backwards → SPAM"
            ],
            options: ["SPAM", "SAMP", "PAMS", "MAST", "AMPS"],
            correctAnswer: "SPAM",
            explanation: "WARD→DRAW: the word is reversed. Apply to MAPS: M-A-P-S backwards = S-P-A-M → SPAM. ✓"
          },
          {
            name: "Finn",
            scenario: "working on reversal puzzles at breaktime",
            exampleInput: "PART",
            exampleOutput: "TRAP",
            rule: "the word is reversed",
            testWord: "TENS",
            answer: "SNET",
            ruleSteps: [
              "Compare: PART → TRAP — all letters reversed",
              "Name the rule: reverse the entire word",
              "Apply to TENS: write backwards → SNET"
            ],
            options: ["SNET", "NEST", "NETS", "SENT", "STEN"],
            correctAnswer: "SNET",
            explanation: "PART→TRAP: the word is reversed. Apply to TENS: T-E-N-S backwards = S-N-E-T → SNET. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you read it backwards?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know? STAR backwards is RATS, and LIVE backwards is EVIL! Writing words backwards is one of the most common word code rules — and once you spot it, it's really satisfying.\n\n**${v.exampleInput} → ${v.exampleOutput}**`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Write it backwards",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Start from the LAST letter of **${v.testWord}** and work backwards to the first. Write down each letter as you go.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — reverse it!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nReverse the word!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Reversals — simple but satisfying!",
            body: () => `To reverse a word, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Start from the LAST letter", why: "Write it down first" },
                  { text: "2. Work backwards to the FIRST letter", why: "Write each letter as you go" },
                  { text: "3. Check: the first letter is now last, and vice versa", why: "STAR → RATS, STOP → POTS ✓" }
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
  // SUB-CONCEPT 5: Letter Shift
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "letter-shift",
    name: "Alphabet Shift",
    category: "supporting",
    lessons: [
      {
        id: "letter-shift-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when every letter has shifted forward or backward in the alphabet",
          "Apply +1, +2, or -1 shifts confidently — one letter at a time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "cracking alphabet shift codes",
            exampleInput: "CAT",
            exampleOutput: "DBU",
            rule: "each letter shifts forward 1 place in the alphabet",
            testWord: "DOG",
            answer: "EPH",
            ruleSteps: [
              "Compare: C→D (+1), A→B (+1), T→U (+1)",
              "Name the rule: every letter moves forward 1 in the alphabet",
              "Apply to DOG: D→E, O→P, G→H → EPH"
            ],
            options: ["EPH", "CPF", "DOH", "EOG", "FQI"],
            correctAnswer: "EPH",
            explanation: "CAT→DBU: each letter shifted forward 1 (C→D, A→B, T→U). Apply to DOG: D→E, O→P, G→H → EPH. ✓"
          },
          {
            name: "Oliver",
            scenario: "decoding shift patterns in his VR test",
            exampleInput: "HAT",
            exampleOutput: "IBU",
            rule: "each letter shifts forward 1 place in the alphabet",
            testWord: "PEN",
            answer: "QFO",
            ruleSteps: [
              "Compare: H→I (+1), A→B (+1), T→U (+1)",
              "Name the rule: every letter shifts forward 1",
              "Apply to PEN: P→Q, E→F, N→O → QFO"
            ],
            options: ["QFO", "ODM", "PFO", "QEN", "RGP"],
            correctAnswer: "QFO",
            explanation: "HAT→IBU: each letter shifted forward 1 (H→I, A→B, T→U). Apply to PEN: P→Q, E→F, N→O → QFO. ✓"
          },
          {
            name: "Priya",
            scenario: "solving alphabet shift puzzles",
            exampleInput: "RED",
            exampleOutput: "QDC",
            rule: "each letter shifts backward 1 place in the alphabet",
            testWord: "SIT",
            answer: "RHS",
            ruleSteps: [
              "Compare: R→Q (-1), E→D (-1), D→C (-1)",
              "Name the rule: every letter moves backward 1",
              "Apply to SIT: S→R, I→H, T→S → RHS"
            ],
            options: ["RHS", "TJU", "SHT", "RIS", "QGR"],
            correctAnswer: "RHS",
            explanation: "RED→QDC: each letter shifted backward 1 (R→Q, E→D, D→C). Apply to SIT: S→R, I→H, T→S → RHS. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling alphabet shift codes at breaktime",
            exampleInput: "BIG",
            exampleOutput: "DKI",
            rule: "each letter shifts forward 2 places in the alphabet",
            testWord: "RUN",
            answer: "TWP",
            ruleSteps: [
              "Compare: B→D (+2), I→K (+2), G→I (+2)",
              "Name the rule: every letter moves forward 2",
              "Apply to RUN: R→T, U→W, N→P → TWP"
            ],
            options: ["TWP", "SVO", "TWN", "RWP", "UXQ"],
            correctAnswer: "TWP",
            explanation: "BIG→DKI: each letter shifted forward 2 (B→D, I→K, G→I). Apply to RUN: R→T, U→W, N→P → TWP. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Every letter has shifted!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nEvery single letter has changed — but here's the key: they've all moved by the **same amount**! Use the alphabet line to count how far each letter shifted.`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nEvery single letter has changed — but by the **same amount**! Use the alphabet line to count how far each letter shifted.`
              },
              {
                type: 'visual',
                component: 'AlphabetLine',
                props: (v) => ({
                  hops: [{ from: v.exampleInput[0], to: v.exampleOutput[0], label: v.rule.includes('forward') ? '+' + v.rule.match(/\d+/)?.[0] : v.rule.match(/-?\d+/)?.[0] || '' }],
                  showEJOTY: true,
                  showPositionNumbers: true
                })
              },
              {
                type: 'visual',
                component: 'CodeTable',
                props: (v) => ({
                  headers: ["Input", "Output"],
                  rows: [
                    { cells: [v.exampleInput, v.exampleOutput] },
                    { cells: [v.testWord, "???"], highlight: true }
                  ]
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Count the shift",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Use the alphabet line to count how many places the first letter moved. Then check the others match.`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Use the alphabet line to count how many places the first letter moved. Then check the others match.`
              },
              {
                type: 'visual',
                component: 'AlphabetLine',
                props: (v) => ({
                  hops: v.exampleInput.split('').map((letter, i) => ({ from: letter, to: v.exampleOutput[i], label: '' })),
                  showEJOTY: true,
                  showPositionNumbers: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.ruleSteps.map((step, i) => ({
                    text: `Step ${i + 1}: ${step}`,
                    why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                  })),
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In an alphabet shift, every letter moves by the ____ amount in the alphabet`,
              options: (v) => ["same", "different", "random", "increasing"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Every letter shifts by the same amount — that's what makes it an alphabet shift. ✓`,
                incorrect: (v) => `Not quite — in an alphabet shift, every letter moves by the same amount!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — shift the letters!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe rule is: **${v.rule}**. Apply it letter by letter.`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Alphabet shifts — you've got the method!",
            body: () => `When every letter changes by the same amount, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check the first letter — how far did it shift?", why: "Count: A→B is +1, A→C is +2" },
                  { text: "2. Confirm the other letters shifted by the SAME amount", why: "If the first is +1, ALL should be +1" },
                  { text: "3. Apply that shift to every letter in the new word", why: "Go one letter at a time — don't rush! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "letter-shift-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Apply alphabet shifts to longer words — take it one letter at a time",
          "Build the habit of working carefully so you don't make silly mistakes"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "practising +1 shifts with longer words",
            exampleInput: "FISH",
            exampleOutput: "GJTI",
            rule: "each letter shifts forward 1",
            testWord: "BARN",
            answer: "CBSO",
            ruleSteps: [
              "Compare: F→G (+1), I→J (+1), S→T (+1), H→I (+1)",
              "Name the rule: each letter moves forward 1",
              "Apply to BARN: B→C, A→B, R→S, N→O → CBSO"
            ],
            options: ["CBSO", "ABQM", "CBSN", "DCTP", "CBPO"],
            correctAnswer: "CBSO",
            explanation: "FISH→GJTI: each letter shifted +1. Apply to BARN: B→C, A→B, R→S, N→O → CBSO. ✓"
          },
          {
            name: "Marcus",
            scenario: "cracking a harder shift code",
            exampleInput: "BED",
            exampleOutput: "ADC",
            rule: "each letter shifts backward 1",
            testWord: "CUP",
            answer: "BTO",
            ruleSteps: [
              "Compare: B→A (-1), E→D (-1), D→C (-1)",
              "Name the rule: each letter moves backward 1",
              "Apply to CUP: C→B, U→T, P→O → BTO"
            ],
            options: ["BTO", "DVQ", "BTP", "CTO", "BSN"],
            correctAnswer: "BTO",
            explanation: "BED→ADC: each letter shifted -1. Apply to CUP: C→B, U→T, P→O → BTO. ✓"
          },
          {
            name: "Aisha",
            scenario: "tackling a +2 shift code",
            exampleInput: "ACE",
            exampleOutput: "CEG",
            rule: "each letter shifts forward 2",
            testWord: "FAN",
            answer: "HCP",
            ruleSteps: [
              "Compare: A→C (+2), C→E (+2), E→G (+2)",
              "Name the rule: each letter moves forward 2",
              "Apply to FAN: F→H, A→C, N→P → HCP"
            ],
            options: ["HCP", "GBO", "HCN", "FCP", "IDQ"],
            correctAnswer: "HCP",
            explanation: "ACE→CEG: each letter shifted +2. Apply to FAN: F→H, A→C, N→P → HCP. ✓"
          },
          {
            name: "Charlie",
            scenario: "working on shift codes in a timed test",
            exampleInput: "HIT",
            exampleOutput: "GHS",
            rule: "each letter shifts backward 1",
            testWord: "MAP",
            answer: "LZO",
            ruleSteps: [
              "Compare: H→G (-1), I→H (-1), T→S (-1)",
              "Name the rule: each letter moves backward 1",
              "Apply to MAP: M→L, A→Z, P→O → LZO"
            ],
            options: ["LZO", "NBQ", "LZP", "LAO", "KYN"],
            correctAnswer: "LZO",
            explanation: "HIT→GHS: each letter shifted -1. Apply to MAP: M→L, A→Z (wraps around!), P→O → LZO. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How far did the letters shift?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nUse the alphabet line to count the gap between each pair of letters. Is it +1, +2, or -1?`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nUse the alphabet line to count the gap between each pair of letters. Is it +1, +2, or -1?`
              },
              {
                type: 'visual',
                component: 'AlphabetLine',
                props: (v) => ({
                  hops: [{ from: v.exampleInput[0], to: v.exampleOutput[0], label: v.rule.includes('forward') ? '+' + v.rule.match(/\d+/)?.[0] : '-' + v.rule.match(/\d+/)?.[0] }],
                  showEJOTY: true,
                  showPositionNumbers: true
                })
              },
              {
                type: 'visual',
                component: 'CodeTable',
                props: (v) => ({
                  headers: ["Input", "Output"],
                  rows: [
                    { cells: [v.exampleInput, v.exampleOutput] },
                    { cells: [v.testWord, "???"], highlight: true }
                  ]
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Apply letter by letter",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Use the alphabet line — take each letter of **${v.testWord}** and shift it by the same amount.`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Use the alphabet line — take each letter of **${v.testWord}** and shift it by the same amount.`
              },
              {
                type: 'visual',
                component: 'AlphabetLine',
                props: (v) => ({
                  hops: v.exampleInput.split('').map((letter, i) => ({ from: letter, to: v.exampleOutput[i], label: '' })),
                  showEJOTY: true,
                  showPositionNumbers: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.ruleSteps.map((step, i) => ({
                    text: `Step ${i + 1}: ${step}`,
                    why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                  })),
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nShift each letter!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Top tips for staying accurate!",
            body: () => `Here are some tips that will help you nail alphabet shifts every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Write the alphabet out if you need to", why: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z" },
                  { text: "Go ONE letter at a time — no shortcuts", why: "Rushing causes mistakes on the middle letters" },
                  { text: "Watch for wrap-around: after Z comes A", why: "Z+1=A, A-1=Z ✓" }
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
  // SUB-CONCEPT 6: Position Change
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "position-change",
    name: "Letter Rearrangement",
    category: "supporting",
    lessons: [
      {
        id: "position-change-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when letters have been shuffled around — like a word puzzle!",
          "Track where each letter position moves to so you can apply the same pattern"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "cracking rearrangement codes in her VR book",
            exampleInput: "ABC",
            exampleOutput: "BCA",
            rule: "each letter rotates one position left (first goes to end)",
            testWord: "DOG",
            answer: "OGD",
            ruleSteps: [
              "Compare: ABC → BCA — the A moved to the end, B and C shifted left",
              "Name the rule: letters rotate one position left",
              "Apply to DOG: D moves to end, O and G shift left → OGD"
            ],
            options: ["OGD", "GDO", "DGO", "GOD", "ODG"],
            correctAnswer: "OGD",
            explanation: "ABC→BCA: the first letter moved to the end (left rotation). Apply to DOG: D moves to end → OGD. ✓"
          },
          {
            name: "Oliver",
            scenario: "working out letter rearrangement patterns",
            exampleInput: "CAT",
            exampleOutput: "TCA",
            rule: "each letter rotates one position right (last goes to front)",
            testWord: "BIN",
            answer: "NBI",
            ruleSteps: [
              "Compare: CAT → TCA — the T moved to the front",
              "Name the rule: the last letter moves to the front (right rotation)",
              "Apply to BIN: N moves to front → NBI"
            ],
            options: ["NBI", "INB", "BNI", "IBN", "NIB"],
            correctAnswer: "NBI",
            explanation: "CAT→TCA: the last letter moved to the front (right rotation). Apply to BIN: N moves to front → NBI. ✓"
          },
          {
            name: "Priya",
            scenario: "decoding position change patterns",
            exampleInput: "PARK",
            exampleOutput: "ARKP",
            rule: "each letter rotates one position left (first goes to end)",
            testWord: "LAMP",
            answer: "AMPL",
            ruleSteps: [
              "Compare: PARK → ARKP — the P moved to the end",
              "Name the rule: first letter moves to the end, rest shift left",
              "Apply to LAMP: L moves to end → AMPL"
            ],
            options: ["AMPL", "PLAM", "MLAP", "LAMP", "PALM"],
            correctAnswer: "AMPL",
            explanation: "PARK→ARKP: first letter moved to end (left rotation). Apply to LAMP: L moves to end → AMPL. ✓"
          },
          {
            name: "Finn",
            scenario: "solving rotation puzzles at his desk",
            exampleInput: "STEM",
            exampleOutput: "MSTE",
            rule: "each letter rotates one position right (last goes to front)",
            testWord: "CLIP",
            answer: "PCLI",
            ruleSteps: [
              "Compare: STEM → MSTE — the M moved to the front",
              "Name the rule: last letter moves to the front, rest shift right",
              "Apply to CLIP: P moves to front → PCLI"
            ],
            options: ["PCLI", "LIPC", "CPLI", "IPPC", "LCIP"],
            correctAnswer: "PCLI",
            explanation: "STEM→MSTE: last letter moved to front (right rotation). Apply to CLIP: P moves to front → PCLI. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The letters have been shuffled!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nAll the same letters are still there — but they've **changed position**! It's like someone picked up the letters and moved them around. Can you spot the pattern?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Track each position",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Number each letter's position, then see where each one ended up.`,
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Number each letter's position, then see where each one ended up.`
              },
              {
                type: 'visual',
                component: 'LetterTiles',
                props: (v) => ({
                  mode: "word",
                  letters: v.exampleInput.split(''),
                  label: `Before: ${v.exampleInput}`
                })
              },
              {
                type: 'visual',
                component: 'LetterTiles',
                props: (v) => ({
                  mode: "word",
                  letters: v.exampleOutput.split(''),
                  label: `After: ${v.exampleOutput}`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Left rotation", right: "First letter moves to the end" },
                { left: "Right rotation", right: "Last letter moves to the front" },
                { left: "Same letters present", right: "It's a rearrangement, not removal" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — rearrange!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe rule is: **${v.rule}**. Rearrange the letters!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Rearrangements — just track the positions!",
            body: () => `When letters change position, here's how to crack it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check: are the same letters all still there?", why: "If yes, it's a rearrangement (not removal or replacement)" },
                  { text: "2. Track where each position moved to", why: "Did the 1st go to the end? Did the last go to the front?" },
                  { text: "3. Apply the same position changes to the new word", why: "ABC→BCA means DOG→OGD ✓" }
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
  // SUB-CONCEPT 7: Vowel Removal
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "vowel-removal",
    name: "Remove All Vowels",
    category: "other",
    lessons: [
      {
        id: "vowel-removal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when all the vowels have been stripped away!",
          "Apply vowel removal carefully to any word"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "cracking vowel removal codes",
            exampleInput: "HOUSE",
            exampleOutput: "HS",
            rule: "all vowels (A, E, I, O, U) are removed",
            testWord: "TRAIN",
            answer: "TRN",
            ruleSteps: [
              "Compare: HOUSE → HS — the O, U, and E are gone",
              "Name the rule: all vowels are removed",
              "Apply to TRAIN: remove A and I → TRN"
            ],
            options: ["TRN", "TRAN", "RAIN", "TRA", "RN"],
            correctAnswer: "TRN",
            explanation: "HOUSE→HS: all vowels (O, U, E) were removed. Apply to TRAIN: remove vowels (A, I) → TRN. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving vowel removal puzzles",
            exampleInput: "SMILE",
            exampleOutput: "SML",
            rule: "all vowels are removed",
            testWord: "PLANE",
            answer: "PLN",
            ruleSteps: [
              "Compare: SMILE → SML — the I and E are gone",
              "Name the rule: all vowels removed",
              "Apply to PLANE: remove A and E → PLN"
            ],
            options: ["PLN", "PLAN", "PANE", "PLA", "PN"],
            correctAnswer: "PLN",
            explanation: "SMILE→SML: vowels (I, E) were removed. Apply to PLANE: remove vowels (A, E) → PLN. ✓"
          },
          {
            name: "Priya",
            scenario: "tackling tricky vowel removal codes",
            exampleInput: "ORANGE",
            exampleOutput: "RNG",
            rule: "all vowels are removed",
            testWord: "BASKET",
            answer: "BSKT",
            ruleSteps: [
              "Compare: ORANGE → RNG — the O, A, and E are gone",
              "Name the rule: remove every vowel",
              "Apply to BASKET: remove A and E → BSKT"
            ],
            options: ["BSKT", "BASK", "BSKET", "BST", "BKT"],
            correctAnswer: "BSKT",
            explanation: "ORANGE→RNG: all vowels (O, A, E) were removed. Apply to BASKET: remove vowels (A, E) → BSKT. ✓"
          },
          {
            name: "Finn",
            scenario: "solving vowel puzzles at breaktime",
            exampleInput: "TABLE",
            exampleOutput: "TBL",
            rule: "all vowels are removed",
            testWord: "CRISP",
            answer: "CRSP",
            ruleSteps: [
              "Compare: TABLE → TBL — the A and E are gone",
              "Name the rule: all vowels are removed",
              "Apply to CRISP: remove I → CRSP"
            ],
            options: ["CRSP", "CRIP", "CSP", "CRS", "CRISP"],
            correctAnswer: "CRSP",
            explanation: "TABLE→TBL: vowels (A, E) were removed. Apply to CRISP: remove the vowel (I) → CRSP. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The vowels have vanished!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThe word got much shorter! Some letters were removed — but not just any letters. Think about what A, E, I, O, U have in common. They're all **vowels**!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Vowels = A, E, I, O, U",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. The vowels are **A, E, I, O, U**. When these are all removed, only the consonants (all the other letters) are left.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The letters removed from ${v.exampleInput} are all ____ — A, E, I, O, U`,
              options: (v) => ["vowels", "consonants", "capitals", "silent letters"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Vowels are A, E, I, O, U — remove them all and only consonants remain. ✓`,
                incorrect: (v) => `Not quite — the five letters A, E, I, O, U are called vowels!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — strip the vowels!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nRemove all vowels (A, E, I, O, U)!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Vowel removal — simple but effective!",
            body: () => `Remember your five vowels: A, E, I, O, U. Here's the method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Spot it: the output is much shorter", why: "And the remaining letters are all consonants" },
                  { text: "2. Check: A, E, I, O, U — are they ALL gone?", why: "If yes, the rule is 'remove all vowels'" },
                  { text: "3. Go through the new word letter by letter", why: "Cross out every A, E, I, O, U you find ✓" }
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
  // SUB-CONCEPT 8: Combined Rules
  // Category: other
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "combined-rules",
    name: "Two Rules at Once",
    category: "other",
    lessons: [
      {
        id: "combined-rules-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Spot when TWO transformations have been applied — not just one!",
          "Break a combined rule into two separate steps so it's easy to follow"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "tackling harder code puzzles with two rules",
            exampleInput: "CAT",
            exampleOutput: "TA",
            rule: "remove the first letter, then reverse what's left",
            testWord: "BIG",
            answer: "GI",
            ruleSteps: [
              "Compare: CAT → TA — the C is gone, and AT is reversed to TA",
              "Name the rule: remove the first letter, then reverse",
              "Apply to BIG: remove B → IG, reverse → GI"
            ],
            options: ["GI", "IG", "IB", "BI", "BG"],
            correctAnswer: "GI",
            explanation: "CAT→TA: remove the first letter (C→AT), then reverse (AT→TA). Apply to BIG: remove B (→IG), then reverse → GI. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving double-rule code puzzles",
            exampleInput: "SHIP",
            exampleOutput: "PIH",
            rule: "reverse the word, then remove the last letter",
            testWord: "BOAT",
            answer: "TAO",
            ruleSteps: [
              "Compare: SHIP → PIH — reversed would be PIHS, but the S is gone",
              "Name the rule: reverse, then remove the last letter",
              "Apply to BOAT: reverse → TAOB, remove last letter → TAO"
            ],
            options: ["TAO", "TAOB", "BOA", "OAT", "TBO"],
            correctAnswer: "TAO",
            explanation: "SHIP→PIH: reverse (PIHS), then remove last letter → PIH. Apply to BOAT: reverse (TAOB), remove last → TAO. ✓"
          },
          {
            name: "Priya",
            scenario: "cracking two-step codes",
            exampleInput: "HAND",
            exampleOutput: "NAH",
            rule: "remove the last letter, then reverse what's left",
            testWord: "DRUM",
            answer: "URD",
            ruleSteps: [
              "Compare: HAND → NAH — remove D → HAN, reverse HAN → NAH ✓",
              "Name the rule: remove the last letter, then reverse",
              "Apply to DRUM: remove M → DRU, reverse → URD"
            ],
            options: ["URD", "MUR", "RUM", "DUR", "RUD"],
            correctAnswer: "URD",
            explanation: "HAND→NAH: remove last letter (D→HAN), then reverse (HAN→NAH). Apply to DRUM: remove M (→DRU), reverse → URD. ✓"
          },
          {
            name: "Finn",
            scenario: "solving the trickiest code puzzles",
            exampleInput: "LAMP",
            exampleOutput: "BNQ",
            rule: "shift each letter forward 1, then remove the first letter",
            testWord: "FROG",
            answer: "SPH",
            ruleSteps: [
              "Compare: LAMP +1 = MBNQ, but output is BNQ — the M is gone",
              "Name the rule: shift every letter forward 1, then remove the first letter",
              "Apply to FROG: shift +1 → GSPH, remove first (G) → SPH"
            ],
            options: ["SPH", "GSPH", "ROH", "GSP", "SPG"],
            correctAnswer: "SPH",
            explanation: "LAMP shifted +1 = MBNQ, remove first letter M = BNQ. Apply to FROG: shift +1 = GSPH, remove first G = SPH. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This one has TWO rules!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThis doesn't look like any single rule you've seen before, does it? That's because sometimes the puzzle uses **two transformations** applied one after the other. Once you spot that, it all clicks!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Break it into two steps",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. When one rule doesn't explain the change, try combining two rules. Do them one at a time.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Remove + Reverse", right: "Letters disappear and order flips" },
                { left: "Shift + Remove", right: "Letters change value then one is dropped" },
                { left: "Reverse + Remove", right: "Order flips then a letter is dropped" },
                { left: "Shift + Reverse", right: "Letters change value and order flips" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — two rules!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nThe rule is: **${v.rule}**. Apply both steps!`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "Two rules — you can handle anything now!",
            body: () => `When one rule doesn't explain the change, here's your approach:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. If one rule doesn't work, try TWO", why: "Remove + reverse? Shift + reverse?" },
                  { text: "2. Do one rule at a time — write down the middle step", why: "Don't try to do both in your head!" },
                  { text: "3. Common combos: remove + reverse, shift + reverse", why: "Practise these pairs and they'll become easy ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "combined-rules-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Tackle different combinations of two rules with growing confidence",
          "Master multi-step transformations — applying more than one change to a word"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "practising double rules to build speed",
            exampleInput: "STOP",
            exampleOutput: "OTS",
            rule: "reverse the word, then remove the first letter",
            testWord: "CLAP",
            answer: "ALC",
            ruleSteps: [
              "Compare: STOP reversed = POTS, remove first letter P → OTS ✓",
              "Name the rule: reverse the word, then remove the first letter",
              "Apply to CLAP: reverse → PALC, remove first letter P → ALC"
            ],
            options: ["ALC", "LAP", "ALP", "PLA", "CAL"],
            correctAnswer: "ALC",
            explanation: "STOP reversed = POTS, remove first letter P = OTS ✓. Apply to CLAP: reverse = PALC, remove first letter P = ALC. ✓"
          },
          {
            name: "Marcus",
            scenario: "cracking another two-step puzzle",
            exampleInput: "HAND",
            exampleOutput: "NAH",
            rule: "remove the last letter, then reverse what's left",
            testWord: "DRUM",
            answer: "URD",
            ruleSteps: [
              "Compare: HAND — remove last letter D → HAN, reverse HAN → NAH ✓",
              "Name the rule: remove the last letter, then reverse what's left",
              "Apply to DRUM: remove last letter M → DRU, reverse → URD"
            ],
            options: ["URD", "MUR", "MURD", "RUM", "DRM"],
            correctAnswer: "URD",
            explanation: "HAND: remove last letter D → HAN, reverse → NAH ✓. Apply to DRUM: remove last letter M → DRU, reverse → URD. ✓"
          },
          {
            name: "Aisha",
            scenario: "solving combined rules in a timed test",
            exampleInput: "LAMP",
            exampleOutput: "BNQ",
            rule: "shift each letter forward 1, then remove the first letter",
            testWord: "FROG",
            answer: "SPH",
            ruleSteps: [
              "Compare: LAMP +1 shift = MBNQ, remove first letter M = BNQ ✓",
              "Name the rule: shift +1, then remove the first letter",
              "Apply to FROG: shift +1 = GSPH, remove first G = SPH"
            ],
            options: ["SPH", "GSPH", "ROH", "GSP", "SPG"],
            correctAnswer: "SPH",
            explanation: "LAMP shifted +1 = MBNQ, remove first letter = BNQ. Apply to FROG: shift +1 = GSPH, remove first = SPH. ✓"
          },
          {
            name: "Charlie",
            scenario: "working on the hardest combined rules",
            exampleInput: "PEN",
            exampleOutput: "OD",
            rule: "shift each letter backward 1, then remove the last letter",
            testWord: "CUP",
            answer: "BT",
            ruleSteps: [
              "Compare: PEN shifted -1 → P→O, E→D, N→M = ODM. Remove last letter M → OD ✓",
              "Name the rule: shift every letter backward 1, then remove the last letter",
              "Apply to CUP: shift -1 → C→B, U→T, P→O = BTO. Remove last letter O → BT"
            ],
            options: ["BT", "BTO", "DV", "CU", "TVP"],
            correctAnswer: "BT",
            explanation: "PEN shifted -1 = ODM, remove last letter = OD ✓. Apply to CUP: shift -1 = BTO, remove last letter = BT. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot BOTH rules?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**${v.exampleInput} → ${v.exampleOutput}**\n\nThis one definitely has more than one step. Can you work out what two things happened?`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two steps, one at a time",
            body: (v) => `Look at **${v.exampleInput} → ${v.exampleOutput}**. Write down the middle step — the result after rule 1 but before rule 2.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Look for what changed between the original and coded word" : i === 1 ? "Put the rule into words you can apply" : "Use the exact same rule on the new word ✓"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**${v.exampleInput}(${v.exampleOutput})** → **${v.testWord}(???)**\n\nApply the combined rule: **${v.rule}**`,
            visual: {
              component: "CodeTable",
              props: (v) => ({
                headers: ["Input", "Output"],
                rows: [
                  { cells: [v.exampleInput, v.exampleOutput] },
                  { cells: [v.testWord, "???"], highlight: true }
                ]
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
            title: () => "You can tackle anything now!",
            body: () => `Multi-step rules are the trickiest ones in the exam — but now you know the secret:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. If one rule doesn't explain everything, try two", why: "The word changed length AND order? That's two rules" },
                  { text: "2. WRITE DOWN the middle step on paper", why: "Don't hold both transformations in your head" },
                  { text: "3. Apply rules in the same order each time", why: "Step 1 first, step 2 second — order matters! ✓" }
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
  // SUB-CONCEPT: word-extraction
  // Category: core
  // ==========================================
  {
    id: "word-extraction",
    name: "Hidden Words — Take From Both",
    category: "core",
    lessons: [
      {
        id: "word-extraction-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a hidden word by taking letters from TWO different words",
          "The extraction rule: letters 2–3 of word 1 + letters 1–2 of word 3 = the hidden 4-letter word"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling a tricky new VR puzzle her tutor set",
            word1: "frog",
            word3: "dent",
            hiddenWord: "rode",
            word1Positions: "letters 2–3",
            word3Positions: "letters 1–2",
            word1Extract: "ro",
            word3Extract: "de",
            ruleSteps: [
              "Write out frog with positions: f(1) r(2) o(3) g(4)",
              "Take letters 2–3 of frog: r + o = 'ro'",
              "Write out dent with positions: d(1) e(2) n(3) t(4)",
              "Take letters 1–2 of dent: d + e = 'de'",
              "Combine: 'ro' + 'de' = rode ✓"
            ],
            interactWord1: "hope",
            interactWord3: "ends",
            interactHidden: "open",
            interactWord1Extract: "op",
            interactWord3Extract: "en",
            interactOptions: ["hope", "ends", "open", "hens", "opes"],
            interactCorrectAnswer: "open",
            interactExplanation: "Letters 2–3 of hope = 'op'. Letters 1–2 of ends = 'en'. op + en = open. ✓",
            options: ["rode", "frog", "dent", "redo", "ored"],
            correctAnswer: "rode",
            explanation: "Letters 2–3 of frog = 'ro'. Letters 1–2 of dent = 'de'. ro + de = rode. ✓"
          },
          {
            name: "Jake",
            scenario: "working through a VR puzzle book before bed",
            word1: "slim",
            word3: "medal",
            hiddenWord: "lime",
            word1Positions: "letters 2–3",
            word3Positions: "letters 1–2",
            word1Extract: "li",
            word3Extract: "me",
            ruleSteps: [
              "Write out slim with positions: s(1) l(2) i(3) m(4)",
              "Take letters 2–3 of slim: l + i = 'li'",
              "Write out medal with positions: m(1) e(2) d(3) a(4) l(5)",
              "Take letters 1–2 of medal: m + e = 'me'",
              "Combine: 'li' + 'me' = lime ✓"
            ],
            interactWord1: "flat",
            interactWord3: "tent",
            interactHidden: "late",
            interactWord1Extract: "la",
            interactWord3Extract: "te",
            interactOptions: ["flat", "tent", "late", "tale", "flte"],
            interactCorrectAnswer: "late",
            interactExplanation: "Letters 2–3 of flat = 'la'. Letters 1–2 of tent = 'te'. la + te = late. ✓",
            options: ["lime", "slim", "medal", "mile", "lied"],
            correctAnswer: "lime",
            explanation: "Letters 2–3 of slim = 'li'. Letters 1–2 of medal = 'me'. li + me = lime. ✓"
          },
          {
            name: "Priya",
            scenario: "practising VR puzzles at the library",
            word1: "trap",
            word3: "vent",
            hiddenWord: "rave",
            word1Positions: "letters 2–3",
            word3Positions: "letters 1–2",
            word1Extract: "ra",
            word3Extract: "ve",
            ruleSteps: [
              "Write out trap with positions: t(1) r(2) a(3) p(4)",
              "Take letters 2–3 of trap: r + a = 'ra'",
              "Write out vent with positions: v(1) e(2) n(3) t(4)",
              "Take letters 1–2 of vent: v + e = 've'",
              "Combine: 'ra' + 've' = rave ✓"
            ],
            interactWord1: "twig",
            interactWord3: "deer",
            interactHidden: "wide",
            interactWord1Extract: "wi",
            interactWord3Extract: "de",
            interactOptions: ["twig", "deer", "wide", "weed", "twde"],
            interactCorrectAnswer: "wide",
            interactExplanation: "Letters 2–3 of twig = 'wi'. Letters 1–2 of deer = 'de'. wi + de = wide. ✓",
            options: ["rave", "trap", "vent", "rapt", "trve"],
            correctAnswer: "rave",
            explanation: "Letters 2–3 of trap = 'ra'. Letters 1–2 of vent = 've'. ra + ve = rave. ✓"
          },
          {
            name: "Marcus",
            scenario: "solving hidden-word puzzles on his tablet",
            word1: "icon",
            word3: "menu",
            hiddenWord: "come",
            word1Positions: "letters 2–3",
            word3Positions: "letters 1–2",
            word1Extract: "co",
            word3Extract: "me",
            ruleSteps: [
              "Write out icon with positions: i(1) c(2) o(3) n(4)",
              "Take letters 2–3 of icon: c + o = 'co'",
              "Write out menu with positions: m(1) e(2) n(3) u(4)",
              "Take letters 1–2 of menu: m + e = 'me'",
              "Combine: 'co' + 'me' = come ✓"
            ],
            interactWord1: "blow",
            interactWord3: "neat",
            interactHidden: "lone",
            interactWord1Extract: "lo",
            interactWord3Extract: "ne",
            interactOptions: ["blow", "neat", "bone", "lone", "blne"],
            interactCorrectAnswer: "lone",
            interactExplanation: "Letters 2–3 of blow = 'lo'. Letters 1–2 of neat = 'ne'. lo + ne = lone. ✓",
            options: ["come", "icon", "menu", "mice", "icme"],
            correctAnswer: "come",
            explanation: "Letters 2–3 of icon = 'co'. Letters 1–2 of menu = 'me'. co + me = come. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Where is "${v.hiddenWord}" hiding?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nLook at this puzzle:\n\n**${v.word1} ( ${v.hiddenWord} ) ${v.word3}**\n\nThe word in the middle — **${v.hiddenWord}** — is **hidden inside** the two outer words. It's made by **borrowing letters from both**!\n\nCan you see where the letters came from?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.word1Extract.toUpperCase().split(""),
                group2: v.word3Extract.toUpperCase().split(""),
                resultWord: v.hiddenWord.toUpperCase(),
                label: `From ${v.word1} (${v.word1Positions}) + From ${v.word3} (${v.word3Positions})`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The hidden-word rule — 5 steps",
            body: (v) => `The rule is the same every time: **letters 2–3 of word 1** + **letters 1–2 of word 3** = the hidden word.\n\nLet's walk through **${v.word1} ( ? ) ${v.word3}** step by step:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.ruleSteps.map((step, i) => ({
                  text: `Step ${i + 1}: ${step}`,
                  why: i === 0 ? "Numbering positions makes the rule visible" :
                       i === 1 ? "These are the letters you 'borrow' from the first word" :
                       i === 2 ? "Now do the same with the third word" :
                       i === 3 ? "These are the letters you 'borrow' from the third word" :
                       "Stick them together — does it spell a real word?"
                })),
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — find the hidden word!",
            body: (v) => `Use the **same rule** (letters 2–3 of word 1 + letters 1–2 of word 3):\n\n**${v.interactWord1} ( ? ) ${v.interactWord3}**\n\nWhat word is hiding in the middle?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.interactWord1Extract.toUpperCase().split(""),
                group2: v.interactWord3Extract.toUpperCase().split(""),
                resultWord: "????",
                label: `From ${v.interactWord1} + From ${v.interactWord3}`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the middle?`,
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
            title: () => "Hidden-word extraction — your recipe",
            body: () => `Here's the recipe you can use on every hidden-word puzzle:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Number each letter of word 1 (1, 2, 3, 4...)", why: "This makes the positions easy to see" },
                  { text: "2. Pick letters 2 and 3 from word 1", why: "These are the FIRST half of the hidden word" },
                  { text: "3. Number each letter of word 3 (1, 2, 3, 4...)", why: "Do exactly the same on the third word" },
                  { text: "4. Pick letters 1 and 2 from word 3", why: "These are the SECOND half of the hidden word" },
                  { text: "5. Stick the four letters together — that's your answer ✓", why: "It should spell a real English word" }
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

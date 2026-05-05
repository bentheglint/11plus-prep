// ============================================================
// Supplementary sub-concepts for Missing Letters in Words (Verbal Reasoning)
// To merge: add these to lessonBank.missingLettersWords.subConcepts array in lessonData.js
// ============================================================

export const missingLettersWordsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Vowel Gaps
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "vowel-gaps",
    name: "Missing Vowels",
    category: "core",
    lessons: [
      {
        id: "vowel-gaps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "A brilliant shortcut: when letters are missing, try the vowels (A, E, I, O, U) first!",
          "Why vowels are often the missing piece and how testing them cracks the word in seconds"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working out a word with missing vowels",
            template: "B _ K E",
            missingLetters: "A",
            completeWord: "BAKE",
            wordMeaning: "to cook in an oven",
            options: ["A", "I", "O", "U", "E"],
            correctAnswer: "A",
            explanation: "B + A + KE = BAKE — to cook in an oven. The missing letter is the vowel A. ✓",
            interactTemplate: "C _ K E",
            interactMissingLetters: "O",
            interactCompleteWord: "COKE",
            interactWordMeaning: "a type of fizzy drink",
            interactOptions: ["O", "A", "I", "U", "E"],
            interactCorrectAnswer: "O",
            interactExplanation: "C + O + KE = COKE — a type of fizzy drink. The missing vowel is O. ✓"
          },
          {
            name: "Oliver",
            scenario: "filling in blanks in a VR practice paper",
            template: "M _ S _ C",
            missingLetters: "UI",
            completeWord: "MUSIC",
            wordMeaning: "sounds arranged in a pleasing way",
            options: ["UI", "OA", "AI", "UE", "IA"],
            correctAnswer: "UI",
            explanation: "M + U + S + I + C = MUSIC — sounds arranged in a pleasing way. Both missing letters are vowels. ✓",
            interactTemplate: "T _ P _ C",
            interactMissingLetters: "OI",
            interactCompleteWord: "TOPIC",
            interactWordMeaning: "a subject being discussed",
            interactOptions: ["OI", "UI", "AI", "OA", "IA"],
            interactCorrectAnswer: "OI",
            interactExplanation: "T + O + P + I + C = TOPIC — a subject being discussed. The vowels O and I fill the gaps. ✓"
          },
          {
            name: "Priya",
            scenario: "tackling a vowel-gap puzzle in her workbook",
            template: "P _ L _ T",
            missingLetters: "IO",
            completeWord: "PILOT",
            wordMeaning: "a person who flies an aircraft",
            options: ["IO", "IA", "OI", "EA", "UE"],
            correctAnswer: "IO",
            explanation: "P + I + L + O + T = PILOT — a person who flies an aircraft. Two vowels were missing: I and O. ✓",
            interactTemplate: "L _ M _ N",
            interactMissingLetters: "EO",
            interactCompleteWord: "LEMON",
            interactWordMeaning: "a yellow citrus fruit",
            interactOptions: ["EO", "IO", "AO", "EU", "IA"],
            interactCorrectAnswer: "EO",
            interactExplanation: "L + E + M + O + N = LEMON — a yellow citrus fruit. The vowels E and O fill the blanks. ✓"
          },
          {
            name: "Finn",
            scenario: "solving missing-letter questions at his desk",
            template: "V _ L _ E",
            missingLetters: "AU",
            completeWord: "VALUE",
            wordMeaning: "how much something is worth",
            options: ["AU", "AI", "OU", "EU", "AE"],
            correctAnswer: "AU",
            explanation: "V + A + L + U + E = VALUE — how much something is worth. The vowels A and U fill the gaps. ✓",
            interactTemplate: "H _ M _ N",
            interactMissingLetters: "UA",
            interactCompleteWord: "HUMAN",
            interactWordMeaning: "a person or member of our species",
            interactOptions: ["UA", "AI", "OU", "EU", "AE"],
            interactCorrectAnswer: "UA",
            interactExplanation: "H + U + M + A + N = HUMAN — a person or member of our species. The vowels U and A fill the gaps. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What vowels are hiding in "${v.template}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Every English word needs at least one vowel (A, E, I, O, U) — so when you see blanks, try the vowels first! It works more often than you'd think.\n\n**${v.template}** — which vowel completes this word?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Vowels first — give it a go!",
            body: (v) => `Look at **${v.template}** — which letters are missing? When letters are missing from a word, try slotting in vowels (A, E, I, O, U) — they're the most commonly missing letters.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Look at the consonants (all the letters that aren't vowels) you CAN see: ${v.template}`, why: "The consonant skeleton gives you the word's shape" },
                  { text: `Try vowels in the gaps: A, E, I, O, U`, why: "Which vowel(s) make a real word?" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When letters are missing from a word, try slotting in ____ first — they're the most commonly missing letters.`,
              options: (v) => ["vowels", "consonants", "punctuation", "numbers"],
              correctIndex: (v) => 0,
              feedback: {
                correct: () => `That's right — vowels (A, E, I, O, U) are the most commonly missing letters! ✓`,
                incorrect: () => `The answer is "vowels". A, E, I, O, U are the five vowels — and they're the most commonly missing letters. ✓`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letter(s) complete **${v.interactTemplate}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter(s) complete ${v.interactTemplate}?`,
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
            title: () => "Vowels first — you've got the trick!",
            body: () => `Nice one! Here's your go-to method when letters are missing:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look at the consonants you can see", why: "They give you the word's skeleton" },
                  { text: "2. Try A, E, I, O, U in the gaps", why: "Vowels are the most commonly missing letters" },
                  { text: "3. Say the word aloud — does it sound right?", why: "Your ears know more words than you think! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "vowel-gaps-practice",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Levelling up: spotting missing vowels in trickier words where two options look possible",
          "How to choose the right vowel when you're torn between two — a real exam skill!"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "double-checking her VR answers",
            template: "S _ L _ D",
            missingLetters: "AA",
            completeWord: "SALAD",
            wordMeaning: "a cold dish of mixed vegetables",
            options: ["AA", "OI", "OE", "UI", "AE"],
            correctAnswer: "AA",
            explanation: "S + A + L + A + D = SALAD — a cold dish of mixed vegetables. Both gaps need the vowel A. ✓",
            interactTemplate: "P _ N _ L",
            interactMissingLetters: "AE",
            interactCompleteWord: "PANEL",
            interactWordMeaning: "a flat section forming part of a surface",
            interactOptions: ["AE", "OI", "AA", "UI", "EE"],
            interactCorrectAnswer: "AE",
            interactExplanation: "P + A + N + E + L = PANEL — a flat section forming part of a surface. The vowels A and E fill the blanks. ✓"
          },
          {
            name: "Marcus",
            scenario: "reviewing his practice test results",
            template: "L _ M _ N",
            missingLetters: "EO",
            completeWord: "LEMON",
            wordMeaning: "a yellow citrus fruit",
            options: ["EO", "IO", "AO", "EU", "IA"],
            correctAnswer: "EO",
            explanation: "L + E + M + O + N = LEMON — a yellow citrus fruit. The vowels E and O fill the blanks. ✓",
            interactTemplate: "M _ T _ R",
            interactMissingLetters: "OO",
            interactCompleteWord: "MOTOR",
            interactWordMeaning: "an engine that powers a machine or vehicle",
            interactOptions: ["OO", "EO", "IO", "AU", "OA"],
            interactCorrectAnswer: "OO",
            interactExplanation: "M + O + T + O + R = MOTOR — an engine that powers a machine or vehicle. Both gaps are the vowel O. ✓"
          },
          {
            name: "Aisha",
            scenario: "practising vowel-gap questions before her test",
            template: "R _ B _ T",
            missingLetters: "OO",
            completeWord: "ROBOT",
            wordMeaning: "a machine that can carry out tasks automatically",
            options: ["OO", "OA", "IO", "OU", "AO"],
            correctAnswer: "OO",
            explanation: "R + O + B + O + T = ROBOT — a machine that carries out tasks automatically. Both gaps are the vowel O. ✓",
            interactTemplate: "C _ M _ L",
            interactMissingLetters: "AE",
            interactCompleteWord: "CAMEL",
            interactWordMeaning: "a large animal with one or two humps",
            interactOptions: ["AE", "OO", "AI", "OU", "EA"],
            interactCorrectAnswer: "AE",
            interactExplanation: "C + A + M + E + L = CAMEL — a large animal with one or two humps. The vowels A and E fill the blanks. ✓"
          },
          {
            name: "Charlie",
            scenario: "working through tricky vowel puzzles",
            template: "M _ G _ C",
            missingLetters: "AI",
            completeWord: "MAGIC",
            wordMeaning: "the power of producing illusions",
            options: ["AI", "AE", "UI", "OI", "IA"],
            correctAnswer: "AI",
            explanation: "M + A + G + I + C = MAGIC — the power of producing illusions. The vowels A and I complete the word. ✓",
            interactTemplate: "V _ S _ T",
            interactMissingLetters: "II",
            interactCompleteWord: "VISIT",
            interactWordMeaning: "to go and spend time at a place or with someone",
            interactOptions: ["II", "AI", "OI", "AE", "UI"],
            interactCorrectAnswer: "II",
            interactExplanation: "V + I + S + I + T = VISIT — to go and spend time at a place or with someone. Both gaps need the vowel I. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Two vowels are hiding in "${v.template}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis word has **two vowels** missing — a bit trickier! But look at the consonants that are still there. They give you the **skeleton** of the word, like a puzzle outline.\n\n**${v.template}** — can you work out which vowels fit?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the consonant skeleton!",
            body: (v) => `Look at **${v.template}**. The consonants you can see are like a skeleton — they show you the word's shape. Now try different vowels (A, E, I, O, U) until you find a real word.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Skeleton: ${v.template}`, why: "These consonants narrow it down" },
                  { text: `Try vowel pairs: ${v.missingLetters}?`, why: "Does this make a word you know?" },
                  { text: `${v.completeWord} — ${v.wordMeaning}`, why: "Say it aloud to check ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              instruction: () => "Put these steps in order to solve a consonant-skeleton puzzle:",
              steps: () => [
                "Read the consonants you can see — they're the skeleton",
                "Try common vowel pairs (AI, OE, IO, OU) in the gaps",
                "Say the whole word aloud to check it sounds right",
                "Pick the answer that makes a real word you know"
              ],
              feedback: {
                correct: () => `Perfect order! Read the skeleton, try vowels, say it aloud, then pick the real word. ✓`,
                incorrect: () => `The correct order is: read the consonants, try vowel pairs, say it aloud, then pick the real word. ✓`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which vowels complete **${v.interactTemplate}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which vowels complete ${v.interactTemplate}?`,
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
            title: () => "The consonant skeleton — clever!",
            body: () => `Great work! When multiple vowels are missing, the consonants are your guide:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the consonants — they're the skeleton", why: "S_L_D → S?L?D — what fits?" },
                  { text: "2. Try common vowel pairs: AI, OE, IO, OU", why: "Many English words use these combinations" },
                  { text: "3. Say the whole word aloud to check", why: "SALAD, LEMON, ROBOT — trust your ears ✓" }
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
  // SUB-CONCEPT 2: Consonant Gaps
  // Category: core
  // Lesson A: step-by-step | Lesson B: practice
  // ==========================================
  {
    id: "consonant-gaps",
    name: "Missing Consonants",
    category: "core",
    lessons: [
      {
        id: "consonant-gaps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Flipping it around: sometimes the missing letters are consonants, not vowels!",
          "A clever trick — looking at the vowels you CAN see helps you work out what's missing"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working out which consonants are missing",
            template: "_ A _ E",
            missingLetters: "G T",
            completeWord: "GATE",
            wordMeaning: "a hinged barrier used to close an opening in a wall or fence",
            options: ["G T", "C K", "L T", "D T", "R T"],
            correctAnswer: "G T",
            explanation: "G + A + T + E = GATE — a hinged barrier in a wall or fence. The vowels A and E were visible; the consonants G and T were missing. ✓",
            interactTemplate: "_ A _ E",
            interactMissingLetters: "L K",
            interactCompleteWord: "LAKE",
            interactWordMeaning: "a large body of water surrounded by land",
            interactOptions: ["L K", "G T", "C K", "D T", "R T"],
            interactCorrectAnswer: "L K",
            interactExplanation: "L + A + K + E = LAKE — a large body of water surrounded by land. The vowels A and E were your guide; L and K completed the word. ✓"
          },
          {
            name: "Oliver",
            scenario: "solving consonant-gap puzzles",
            template: "_ O _ E",
            missingLetters: "H M",
            completeWord: "HOME",
            wordMeaning: "the place where you live",
            options: ["H M", "B N", "D M", "R P", "C N"],
            correctAnswer: "H M",
            explanation: "H + O + M + E = HOME — the place where you live. The vowels O and E told you the word's shape; H and M completed it. ✓",
            interactTemplate: "_ O _ E",
            interactMissingLetters: "B N",
            interactCompleteWord: "BONE",
            interactWordMeaning: "a hard part of the skeleton inside your body",
            interactOptions: ["B N", "H M", "D M", "R P", "C N"],
            interactCorrectAnswer: "B N",
            interactExplanation: "B + O + N + E = BONE — a hard part of the skeleton inside your body. The vowels O and E were visible; B and N completed it. ✓"
          },
          {
            name: "Priya",
            scenario: "figuring out missing consonants in her VR test",
            template: "_ I _ E",
            missingLetters: "T M",
            completeWord: "TIME",
            wordMeaning: "the ongoing progression of events from past to future",
            options: ["T M", "L N", "D N", "R C", "P N"],
            correctAnswer: "T M",
            explanation: "T + I + M + E = TIME — the ongoing progression of events. The vowels I and E were your clues. ✓",
            interactTemplate: "_ I _ E",
            interactMissingLetters: "L N",
            interactCompleteWord: "LINE",
            interactWordMeaning: "a long narrow mark drawn on a surface",
            interactOptions: ["L N", "T M", "D N", "R C", "P N"],
            interactCorrectAnswer: "L N",
            interactExplanation: "L + I + N + E = LINE — a long narrow mark drawn on a surface. The vowels I and E were your clues; L and N completed the word. ✓"
          },
          {
            name: "Finn",
            scenario: "cracking a consonant puzzle",
            template: "_ U _ _",
            missingLetters: "D C K",
            completeWord: "DUCK",
            wordMeaning: "a waterbird with a flat bill",
            options: ["D C K", "B C K", "L C K", "T C K", "P C K"],
            correctAnswer: "D C K",
            explanation: "D + U + C + K = DUCK — a waterbird with a flat bill. The vowel U was visible, and D, C, K completed the word. ✓",
            interactTemplate: "_ U _ _",
            interactMissingLetters: "L C K",
            interactCompleteWord: "LUCK",
            interactWordMeaning: "good fortune or success by chance",
            interactOptions: ["L C K", "D C K", "B C K", "T C K", "P C K"],
            interactCorrectAnswer: "L C K",
            interactExplanation: "L + U + C + K = LUCK — good fortune or success by chance. The vowel U was visible, and L, C, K completed the word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Which consonants complete "${v.template}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a twist — the **vowels are still there** but the **consonants** are missing! Use the vowels as your guide. Try saying the word out loud — the vowels tell you what it sounds like!\n\n**${v.template}** — which consonants fit?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Vowels are your guide — listen to them!",
            body: (v) => `Look at **${v.template}**. When consonants (letters like B, C, D, F, G...) are missing, the vowels you CAN see tell you what the word sounds like. Sound it out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Vowels visible: ${v.template}`, why: "These tell you what the word sounds like" },
                  { text: `Sound it out: what word has these vowels in this pattern?`, why: "Think of words you know that sound like this" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which consonant(s) complete **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which consonant(s) complete ${v.interactTemplate}?`,
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
            title: () => "Missing consonants — sorted!",
            body: () => `Brilliant! Now you can handle missing consonants too. Here's the method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the vowels — they show the sound pattern", why: "_A_E = something that sounds like 'aye'" },
                  { text: "2. Think of words with that vowel pattern", why: "GATE, BAKE, LAKE, CAKE — lots of options!" },
                  { text: "3. Check which consonants match the options given", why: "Only one set of consonants will be in the list ✓" }
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
  // SUB-CONCEPT 3: Double Letters
  // Category: core
  // Lesson A: step-by-step | Lesson B: practice
  // ==========================================
  {
    id: "double-letters",
    name: "Double-Letter Words",
    category: "core",
    lessons: [
      {
        id: "double-letters-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Double letters are a massive clue! How to spot when TT, LL, SS or similar are hiding",
          "Common words with double letters that pop up all the time in the exam"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "solving a word with double letters hiding",
            template: "B _ TT _ R",
            missingLetters: "U E",
            completeWord: "BUTTER",
            wordMeaning: "a soft yellow food made from cream",
            options: ["U E", "I E", "A E", "E E", "O E"],
            correctAnswer: "U E",
            explanation: "B + U + TT + E + R = BUTTER — a soft yellow food made from cream. The double T was visible, and U and E filled the gaps. ✓",
            interactTemplate: "K _ TT _ N",
            interactMissingLetters: "I E",
            interactCompleteWord: "KITTEN",
            interactWordMeaning: "a young cat",
            interactOptions: ["I E", "U E", "A E", "O E", "E E"],
            interactCorrectAnswer: "I E",
            interactExplanation: "K + I + TT + E + N = KITTEN — a young cat. The double T was visible, and I and E filled the gaps. ✓"
          },
          {
            name: "Oliver",
            scenario: "working out a tricky double-letter word",
            template: "L _ DD _ R",
            missingLetters: "A E",
            completeWord: "LADDER",
            wordMeaning: "a piece of equipment with steps used for climbing",
            options: ["A E", "I E", "O E", "U E", "A O"],
            correctAnswer: "A E",
            explanation: "L + A + DD + E + R = LADDER — equipment with steps for climbing. The double D was the giveaway. ✓",
            interactTemplate: "H _ DD _ N",
            interactMissingLetters: "I E",
            interactCompleteWord: "HIDDEN",
            interactWordMeaning: "kept out of sight or not easily found",
            interactOptions: ["I E", "A E", "O E", "U E", "A O"],
            interactCorrectAnswer: "I E",
            interactExplanation: "H + I + DD + E + N = HIDDEN — kept out of sight. The double D was the giveaway, and I and E completed the word. ✓"
          },
          {
            name: "Priya",
            scenario: "finding the missing letters around a double",
            template: "H _ PP _ N",
            missingLetters: "A E",
            completeWord: "HAPPEN",
            wordMeaning: "to take place or occur",
            options: ["A E", "I E", "O E", "A I", "U E"],
            correctAnswer: "A E",
            explanation: "H + A + PP + E + N = HAPPEN — to take place or occur. The double P sat in the middle with vowels either side. ✓",
            interactTemplate: "P _ PP _ R",
            interactMissingLetters: "E E",
            interactCompleteWord: "PEPPER",
            interactWordMeaning: "a spice used to flavour food",
            interactOptions: ["E E", "A E", "I E", "O E", "U E"],
            interactCorrectAnswer: "E E",
            interactExplanation: "P + E + PP + E + R = PEPPER — a spice used to flavour food. The double P was visible, and E and E filled the gaps. ✓"
          },
          {
            name: "Finn",
            scenario: "cracking a double-letter puzzle",
            template: "R _ BB _ T",
            missingLetters: "A I",
            completeWord: "RABBIT",
            wordMeaning: "a small furry animal with long ears",
            options: ["A I", "O I", "A E", "U I", "O E"],
            correctAnswer: "A I",
            explanation: "R + A + BB + I + T = RABBIT — a small furry animal with long ears. The double B was visible, and A and I completed the word. ✓",
            interactTemplate: "G _ BB _ E",
            interactMissingLetters: "O L",
            interactCompleteWord: "GOBBLE",
            interactWordMeaning: "to eat food quickly and greedily",
            interactOptions: ["O L", "A I", "U L", "I L", "O R"],
            interactCorrectAnswer: "O L",
            interactExplanation: "G + O + BB + L + E = GOBBLE — to eat food quickly and greedily. The double B was visible, and O and L completed the word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot the double letters in "${v.template}"!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Double letters like TT, DD, PP or BB appear in HUNDREDS of English words. Spotting a double is like finding a big neon clue — it narrows things down fast!\n\n**${v.template}** — what goes in the gaps?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Double letters = massive clue!",
            body: (v) => `Look at **${v.template}**. When you see double letters (TT, DD, PP, BB, LL, SS), they narrow down the word hugely. Think of words with that double-letter pattern.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Spot the doubles: ${v.template}`, why: "Double letters are unusual — they limit the options" },
                  { text: `Think of words with this double pattern`, why: "How many words do you know with these doubles?" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letters complete **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "Double-letter detective — case closed!",
            body: () => `Well done! You're a double-letter detective now. Here's what to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Notice the doubles: TT, DD, PP, BB, LL, SS", why: "These narrow down the word massively" },
                  { text: "2. Think of words you know with those doubles", why: "BUTTER, LADDER, RABBIT, HAPPEN, KITTEN..." },
                  { text: "3. Check which one fits the other visible letters", why: "The surrounding letters confirm your guess ✓" }
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
  // SUB-CONCEPT 4: Beginning Gaps
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "beginning-gaps",
    name: "Missing Letters at the Start",
    category: "supporting",
    lessons: [
      {
        id: "beginning-gaps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to crack words with missing letters at the start — read the ending first!",
          "Why the end of a word is often your biggest clue to what's at the beginning"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "working out a word where the start is missing",
            template: "_ _ AIN",
            missingLetters: "BR",
            completeWord: "BRAIN",
            wordMeaning: "the organ inside your head that controls your body",
            options: ["BR", "CH", "DR", "TR", "GR"],
            correctAnswer: "BR",
            explanation: "BR + AIN = BRAIN — the organ inside your head. The ending AIN was visible; BR completed the start. CHAIN, DRAIN, TRAIN and GRAIN are also real words, but only BR is in the options! ✓",
            interactTemplate: "_ _ AMP",
            interactMissingLetters: "ST",
            interactCompleteWord: "STAMP",
            interactWordMeaning: "a small sticky label used to pay for posting a letter",
            interactOptions: ["ST", "CL", "CR", "TR", "SW"],
            interactCorrectAnswer: "ST",
            interactExplanation: "ST + AMP = STAMP — a small sticky label for posting letters. The ending AMP was visible; ST completed the start. ✓"
          },
          {
            name: "Hamza",
            scenario: "figuring out word beginnings",
            template: "_ _ OWN",
            missingLetters: "CR",
            completeWord: "CROWN",
            wordMeaning: "a circular ornament worn on the head by a king or queen",
            options: ["CR", "BR", "FR", "DR", "GR"],
            correctAnswer: "CR",
            explanation: "CR + OWN = CROWN — a circular ornament worn on the head by royalty. The ending OWN was your big clue. ✓",
            interactTemplate: "_ _ OOM",
            interactMissingLetters: "BL",
            interactCompleteWord: "BLOOM",
            interactWordMeaning: "a flower or the state of flowering",
            interactOptions: ["BL", "GR", "BR", "GL", "DR"],
            interactCorrectAnswer: "BL",
            interactExplanation: "BL + OOM = BLOOM — a flower or the state of flowering. The ending OOM was your clue; BL completed the start. ✓"
          },
          {
            name: "Ruby",
            scenario: "tackling start-gap puzzles",
            template: "_ _ IELD",
            missingLetters: "SH",
            completeWord: "SHIELD",
            wordMeaning: "a broad piece of armour used for protection",
            options: ["SH", "FI", "YI", "TH", "WH"],
            correctAnswer: "SH",
            explanation: "SH + IELD = SHIELD — armour used for protection. The ending IELD strongly suggested SHIELD. ✓",
            interactTemplate: "_ _ ENCE",
            interactMissingLetters: "SC",
            interactCompleteWord: "SCIENCE",
            interactWordMeaning: "the study of the natural world through observation and experiment",
            interactOptions: ["SC", "FE", "SH", "TH", "WH"],
            interactCorrectAnswer: "SC",
            interactExplanation: "SC + IENCE = SCIENCE — the study of the natural world through observation. The ending IENCE strongly suggested SCIENCE. ✓"
          },
          {
            name: "Finn",
            scenario: "solving beginning-gap words",
            template: "_ _ RIST",
            missingLetters: "CH",
            completeWord: "CHRIST",
            wordMeaning: "a title given to Jesus of Nazareth",
            options: ["CH", "TH", "FL", "WR", "GR"],
            correctAnswer: "CH",
            explanation: "CH + RIST = CHRIST — a title given to Jesus. The ending RIST was the key clue. ✓",
            interactTemplate: "_ _ IGHT",
            interactMissingLetters: "FL",
            interactCompleteWord: "FLIGHT",
            interactWordMeaning: "the act of flying through the air",
            interactOptions: ["FL", "TH", "CH", "WR", "GR"],
            interactCorrectAnswer: "FL",
            interactExplanation: "FL + IGHT = FLIGHT — the act of flying through the air. The ending IGHT was the key clue. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What starts "${v.template}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nWhen the **beginning** of a word is missing, here's a top tip: read the **ending** first! The ending often tells you what kind of word it is, and that helps you guess the start.\n\n**${v.template}** — what letters go at the start?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the ending — it's your biggest clue!",
            body: (v) => `Look at **${v.template}** — the start is missing! When the start of a word is missing, the ending is your best clue. Read the ending, then think of words that end that way.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the ending: ${v.template}`, why: "What does this word END with?" },
                  { text: `Think of words ending this way`, why: "How many words end with these letters?" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              instruction: () => "Put these steps in order to solve a start-gap word:",
              steps: () => [
                "Read the ENDING of the word first",
                "Think of words that end this way",
                "Check which starting letters are in the options",
                "Pick the option that makes a real word"
              ],
              feedback: {
                correct: () => `Spot on! Read the ending, brainstorm words, check the options, then pick the real word. ✓`,
                incorrect: () => `The correct order is: read the ending, think of matching words, check the options, then pick the real word. ✓`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letters go at the **start** of **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "Start-gap strategy — nailed it!",
            body: () => `Great work! When the beginning of a word is missing, you now know what to do:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the ENDING of the word first", why: "The ending narrows down your options hugely" },
                  { text: "2. Think of words that end this way", why: "_AIN → BRAIN, CHAIN, DRAIN, TRAIN..." },
                  { text: "3. Check which starting letters are in the options", why: "Only one option will make a real word ✓" }
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
  // SUB-CONCEPT 5: Ending Gaps
  // Category: supporting
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "ending-gaps",
    name: "Missing Letters at the End",
    category: "supporting",
    lessons: [
      {
        id: "ending-gaps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to solve words with missing letters at the end — common endings are your secret weapon!",
          "Why knowing endings like ING, TION, LY and ED gives you a massive head start"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "completing a word where the ending is missing",
            template: "FORE _ _ _",
            missingLetters: "VER",
            completeWord: "FOREVER",
            wordMeaning: "for all time, without end",
            options: ["VER", "MAN", "ARM", "GET", "BID"],
            correctAnswer: "VER",
            explanation: "FORE + VER = FOREVER — for all time, without end. The start FORE was a strong clue to the ending. ✓",
            interactTemplate: "WONDER _ _ _",
            interactMissingLetters: "FUL",
            interactCompleteWord: "WONDERFUL",
            interactWordMeaning: "extremely good or marvellous",
            interactOptions: ["FUL", "MAN", "ING", "DOM", "LET"],
            interactCorrectAnswer: "FUL",
            interactExplanation: "WONDER + FUL = WONDERFUL — extremely good or marvellous. The suffix -FUL means 'full of'. ✓"
          },
          {
            name: "Oliver",
            scenario: "filling in word endings in his workbook",
            template: "KING _ _ _",
            missingLetters: "DOM",
            completeWord: "KINGDOM",
            wordMeaning: "a country ruled by a king or queen",
            options: ["DOM", "PIN", "LET", "FUL", "MAN"],
            correctAnswer: "DOM",
            explanation: "KING + DOM = KINGDOM — a country ruled by a king or queen. The start KING made this much easier to guess. ✓",
            interactTemplate: "BORE _ _ _",
            interactMissingLetters: "DOM",
            interactCompleteWord: "BOREDOM",
            interactWordMeaning: "the state of feeling bored",
            interactOptions: ["DOM", "PIN", "LET", "FUL", "MAN"],
            interactCorrectAnswer: "DOM",
            interactExplanation: "BORE + DOM = BOREDOM — the state of feeling bored. The suffix -DOM describes a state or condition. ✓"
          },
          {
            name: "Priya",
            scenario: "tackling end-gap puzzles",
            template: "FREE _ _ _",
            missingLetters: "DOM",
            completeWord: "FREEDOM",
            wordMeaning: "the state of being free",
            options: ["DOM", "WAY", "LET", "MAN", "FUL"],
            correctAnswer: "DOM",
            explanation: "FREE + DOM = FREEDOM — the state of being free. The start FREE was a strong clue to the ending DOM. ✓",
            interactTemplate: "MOVE _ _ _ _",
            interactMissingLetters: "MENT",
            interactCompleteWord: "MOVEMENT",
            interactWordMeaning: "the act of moving from one place to another",
            interactOptions: ["MENT", "NESS", "TION", "ABLE", "LING"],
            interactCorrectAnswer: "MENT",
            interactExplanation: "MOVE + MENT = MOVEMENT — the act of moving from one place to another. The suffix -MENT turns a verb into a noun. ✓"
          },
          {
            name: "Finn",
            scenario: "completing word endings",
            template: "HELP _ _ _",
            missingLetters: "FUL",
            completeWord: "HELPFUL",
            wordMeaning: "giving or ready to give help",
            options: ["FUL", "ING", "LET", "MAN", "DOM"],
            correctAnswer: "FUL",
            explanation: "HELP + FUL = HELPFUL — giving or ready to give help. The suffix -FUL means 'full of'. ✓",
            interactTemplate: "DARK _ _ _ _",
            interactMissingLetters: "NESS",
            interactCompleteWord: "DARKNESS",
            interactWordMeaning: "the absence of light",
            interactOptions: ["NESS", "MENT", "TION", "ABLE", "LING"],
            interactCorrectAnswer: "NESS",
            interactExplanation: "DARK + NESS = DARKNESS — the absence of light. The suffix -NESS turns an adjective into a noun. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What finishes "${v.template}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nWhen the **ending** of a word is missing, the **start** is your best friend! Read the beginning and then think about common word endings — ING, TION, LY, ED. One of them will click!\n\n**${v.template}** — what letters finish this word?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the start — then think endings!",
            body: (v) => `Look at **${v.template}** — the ending is missing! Read the start and think of common English endings: -DOM, -FUL, -MENT, -NESS, -ING, -TION.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Read the start: ${v.template}`, why: "What word begins with these letters?" },
                  { text: `Try common endings: DOM, FUL, ING, MENT, NESS`, why: "English has lots of standard word endings" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              instruction: () => "Match each word start with its correct ending:",
              pairs: () => [
                { left: "KING ___", right: "DOM" },
                { left: "HELP ___", right: "FUL" },
                { left: "EXCITE ___", right: "MENT" },
                { left: "KIND ___", right: "NESS" }
              ],
              feedback: {
                correct: () => `Well matched! KINGDOM, HELPFUL, EXCITEMENT, KINDNESS — common endings make word-guessing much easier. ✓`,
                incorrect: () => `The correct pairs are: KINGDOM, HELPFUL, EXCITEMENT, KINDNESS. Learning common endings like -DOM, -FUL, -MENT and -NESS helps you solve end-gap puzzles fast. ✓`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letters go at the **end** of **${v.interactTemplate}**?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "End-gap strategy — sorted!",
            body: () => `Brilliant! When the ending of a word is missing, common endings are your shortcut:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the START of the word first", why: "It tells you what the word is about" },
                  { text: "2. Try common English endings", why: "-DOM, -FUL, -MENT, -NESS, -ING, -TION" },
                  { text: "3. Pick the ending that makes a real word", why: "KINGDOM, HELPFUL, FREEDOM — trust what sounds right ✓" }
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
  // SUB-CONCEPT 6: Middle Gaps
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: practice
  // ==========================================
  {
    id: "middle-gaps",
    name: "Missing Letters in the Middle",
    category: "supporting",
    lessons: [
      {
        id: "middle-gaps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The sandwich method: use the start AND end of a word to work out what's in the middle!",
          "How knowing the outside letters helps you fill in the gap — like a word sandwich"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working out the middle of a word",
            template: "CH _ _ SE",
            missingLetters: "EE",
            completeWord: "CHEESE",
            wordMeaning: "a food made from milk curds",
            options: ["EE", "OO", "AA", "OU", "AI"],
            correctAnswer: "EE",
            explanation: "CH + EE + SE = CHEESE — a food made from milk curds. The start CH and end SE sandwiched the answer EE. ✓",
            interactTemplate: "FR _ _ ZE",
            interactMissingLetters: "EE",
            interactCompleteWord: "FREEZE",
            interactWordMeaning: "to turn into ice or become very cold",
            interactOptions: ["EE", "OO", "AA", "OU", "AI"],
            interactCorrectAnswer: "EE",
            interactExplanation: "FR + EE + ZE = FREEZE — to turn into ice or become very cold. The start FR and end ZE sandwiched the answer EE. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding what goes in the middle",
            template: "TH _ _ GHT",
            missingLetters: "OU",
            completeWord: "THOUGHT",
            wordMeaning: "an idea that is formed in the mind",
            options: ["OU", "AU", "OA", "RO", "IG"],
            correctAnswer: "OU",
            explanation: "TH + OU + GHT = THOUGHT — an idea formed in the mind. The common pattern TH_GHT strongly suggests THOUGHT. ✓",
            interactTemplate: "DR _ _ GHT",
            interactMissingLetters: "OU",
            interactCompleteWord: "DROUGHT",
            interactWordMeaning: "a long period without rain",
            interactOptions: ["OU", "AU", "OA", "RO", "IG"],
            interactCorrectAnswer: "OU",
            interactExplanation: "DR + OU + GHT = DROUGHT — a long period without rain. The start DR and end GHT sandwiched the answer OU. ✓"
          },
          {
            name: "Priya",
            scenario: "solving middle-gap words in her VR test",
            template: "PL _ _ SE",
            missingLetters: "EA",
            completeWord: "PLEASE",
            wordMeaning: "a polite word used when asking for something",
            options: ["EA", "AI", "EI", "OU", "OA"],
            correctAnswer: "EA",
            explanation: "PL + EA + SE = PLEASE — a polite word used when making requests. The start PL and end SE narrowed it right down. ✓",
            interactTemplate: "GR _ _ SE",
            interactMissingLetters: "EA",
            interactCompleteWord: "GREASE",
            interactWordMeaning: "a thick oily substance used for lubrication",
            interactOptions: ["EA", "AI", "EI", "OU", "OA"],
            interactCorrectAnswer: "EA",
            interactExplanation: "GR + EA + SE = GREASE — a thick oily substance used for lubrication. The start GR and end SE sandwiched the answer EA. ✓"
          },
          {
            name: "Finn",
            scenario: "cracking a middle-gap puzzle",
            template: "BR _ _ GE",
            missingLetters: "ID",
            completeWord: "BRIDGE",
            wordMeaning: "a structure built to span a river or road",
            options: ["ID", "IG", "AD", "UD", "OD"],
            correctAnswer: "ID",
            explanation: "BR + ID + GE = BRIDGE — a structure spanning a river or road. The start BR and end GE made this a sandwich question. ✓",
            interactTemplate: "PL _ _ GE",
            interactMissingLetters: "ED",
            interactCompleteWord: "PLEDGE",
            interactWordMeaning: "a solemn promise or undertaking",
            interactOptions: ["ED", "IG", "AD", "UD", "OD"],
            interactCorrectAnswer: "ED",
            interactExplanation: "PL + ED + GE = PLEDGE — a solemn promise or undertaking. The start PL and end GE sandwiched the answer ED. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's hiding in the middle of "${v.template}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nWhen letters are missing from the **middle**, you've actually got an advantage — the **start AND the end** are both visible! Think of them like bread in a sandwich, and the missing letters are the filling.\n\n**${v.template}** — what filling goes in the middle?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The sandwich method — bread first!",
            body: (v) => `Look at **${v.template}** — the middle is missing! Read the start of the word, then the end. Think of words that begin and end this way — the answer must fit in the middle like a sandwich!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start: read the first letters of ${v.template}`, why: "What does the word begin with?" },
                  { text: `End: read the last letters`, why: "What does the word end with?" },
                  { text: `Sandwich: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letters go in the **middle** of **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "The sandwich method — delicious!",
            body: () => `You've got the sandwich method down! When letters are missing from the middle:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the START of the word", why: "This is one slice of bread" },
                  { text: "2. Read the END of the word", why: "This is the other slice" },
                  { text: "3. What fits in the middle?", why: "CH__SE → CHEESE, BR__GE → BRIDGE ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "middle-gaps-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Levelling up: tackling trickier middle-gap words with confidence",
          "How to use the sandwich method at speed so you can fly through these in the exam"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "practising more middle-gap puzzles",
            template: "WH _ _ PER",
            missingLetters: "IS",
            completeWord: "WHISPER",
            wordMeaning: "to speak very softly",
            options: ["IS", "IM", "IP", "IT", "IN"],
            correctAnswer: "IS",
            explanation: "WH + IS + PER = WHISPER — to speak very softly. The start WH and end PER sandwiched IS perfectly. ✓",
            interactTemplate: "SL _ _ PER",
            interactMissingLetters: "IP",
            interactCompleteWord: "SLIPPER",
            interactWordMeaning: "a soft shoe worn indoors",
            interactOptions: ["IP", "IM", "IS", "IT", "IN"],
            interactCorrectAnswer: "IP",
            interactExplanation: "SL + IP + PER = SLIPPER — a soft shoe worn indoors. The start SL and end PER sandwiched IP perfectly. ✓"
          },
          {
            name: "Marcus",
            scenario: "tackling more sandwich-style words",
            template: "SH _ _ TER",
            missingLetters: "EL",
            completeWord: "SHELTER",
            wordMeaning: "a place giving protection from bad weather or danger",
            options: ["EL", "OL", "AL", "IL", "UL"],
            correctAnswer: "EL",
            explanation: "SH + EL + TER = SHELTER — a place giving protection from bad weather. Start SH and end TER were strong clues. ✓",
            interactTemplate: "CH _ _ TER",
            interactMissingLetters: "AP",
            interactCompleteWord: "CHAPTER",
            interactWordMeaning: "a section of a book",
            interactOptions: ["AP", "EL", "OL", "AL", "UL"],
            interactCorrectAnswer: "AP",
            interactExplanation: "CH + AP + TER = CHAPTER — a section of a book. The start CH and end TER sandwiched AP perfectly. ✓"
          },
          {
            name: "Aisha",
            scenario: "building her sandwich-method skills",
            template: "TH _ _ DER",
            missingLetters: "UN",
            completeWord: "THUNDER",
            wordMeaning: "the loud rumbling sound during a storm",
            options: ["UN", "IN", "AN", "EN", "ON"],
            correctAnswer: "UN",
            explanation: "TH + UN + DER = THUNDER — the loud rumbling sound during a storm. The start TH and end DER made this a great sandwich question. ✓",
            interactTemplate: "WO _ _ ER",
            interactMissingLetters: "ND",
            interactCompleteWord: "WONDER",
            interactWordMeaning: "a feeling of amazement and admiration",
            interactOptions: ["ND", "IN", "AN", "EN", "ON"],
            interactCorrectAnswer: "ND",
            interactExplanation: "WO + ND + ER = WONDER — a feeling of amazement and admiration. The start WO and end ER sandwiched ND perfectly. ✓"
          },
          {
            name: "Charlie",
            scenario: "testing his middle-gap skills",
            template: "WI _ _ OW",
            missingLetters: "ND",
            completeWord: "WINDOW",
            wordMeaning: "an opening in a wall fitted with glass",
            options: ["ND", "LL", "NT", "NG", "NK"],
            correctAnswer: "ND",
            explanation: "WI + ND + OW = WINDOW — an opening in a wall fitted with glass. The start WI and end OW sandwiched ND perfectly. ✓",
            interactTemplate: "PI _ _ OW",
            interactMissingLetters: "LL",
            interactCompleteWord: "PILLOW",
            interactWordMeaning: "a soft cushion for resting your head on",
            interactOptions: ["LL", "ND", "NT", "NG", "NK"],
            interactCorrectAnswer: "LL",
            interactExplanation: "PI + LL + OW = PILLOW — a soft cushion for resting your head on. The start PI and end OW sandwiched LL perfectly. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you fill the sandwich? "${v.template}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nYou already know the sandwich method — brilliant! Let's level up with some trickier words. The start and end are visible, middle is missing.\n\n**${v.template}** — what's the filling?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Sandwich method — next level!",
            body: (v) => `Look at **${v.template}**. For trickier words, try sounding out each option with the start and end letters — one will click!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start + End: ${v.template}`, why: "Your sandwich bread" },
                  { text: `Try each option in the gap`, why: "Sound them out: which makes a real word?" },
                  { text: `${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which letters complete **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters go in the middle of ${v.interactTemplate}?`,
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
            title: () => "Sandwich master — level up!",
            body: () => `You're smashing it! The sandwich method works on all sorts of words:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read START + END = your two clues", why: "They narrow down the word massively" },
                  { text: "Sound out each option in the gap", why: "One will click — trust your ears" },
                  { text: "WHISPER, SHELTER, THUNDER, WINDOW", why: "The sandwich method works every time ✓" }
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
  // SUB-CONCEPT 7: Common Patterns
  // Category: other
  // Lesson A: step-by-step
  // ==========================================
  {
    id: "common-patterns",
    name: "Common Letter Patterns",
    category: "other",
    lessons: [
      {
        id: "common-patterns-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Pattern power! How recognising combos like TH, SH, CH and CK makes you faster",
          "Why knowing these patterns is like having a cheat code for missing-letter questions"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "spotting a common letter pattern in a word",
            template: "_ _ APTER",
            missingLetters: "CH",
            completeWord: "CHAPTER",
            wordMeaning: "a section of a book",
            options: ["CH", "SH", "TH", "WH", "PH"],
            correctAnswer: "CH",
            explanation: "CH + APTER = CHAPTER — a section of a book. CH is one of the most common letter patterns in English. ✓",
            interactTemplate: "_ _ URCH",
            interactMissingLetters: "CH",
            interactCompleteWord: "CHURCH",
            interactWordMeaning: "a building used for Christian worship",
            interactOptions: ["CH", "SH", "TH", "WH", "PH"],
            interactCorrectAnswer: "CH",
            interactExplanation: "CH + URCH = CHURCH — a building used for Christian worship. The CH pattern appears at both the start and end of this word! ✓"
          },
          {
            name: "Oliver",
            scenario: "recognising letter patterns in a VR question",
            template: "_ _ ICKEN",
            missingLetters: "CH",
            completeWord: "CHICKEN",
            wordMeaning: "a common farmyard bird",
            options: ["CH", "TH", "SH", "WH", "PH"],
            correctAnswer: "CH",
            explanation: "CH + ICKEN = CHICKEN — a common farmyard bird. The CH pattern appears at the start of many English words. ✓",
            interactTemplate: "_ _ ONE",
            interactMissingLetters: "PH",
            interactCompleteWord: "PHONE",
            interactWordMeaning: "a device used for talking to people at a distance",
            interactOptions: ["PH", "TH", "SH", "WH", "CH"],
            interactCorrectAnswer: "PH",
            interactExplanation: "PH + ONE = PHONE — a device for talking to people at a distance. The PH pattern makes an F sound. ✓"
          },
          {
            name: "Priya",
            scenario: "using letter patterns to solve a puzzle",
            template: "BA _ _ ET",
            missingLetters: "SK",
            completeWord: "BASKET",
            wordMeaning: "a container used for carrying things",
            options: ["SK", "CK", "NK", "LK", "RK"],
            correctAnswer: "SK",
            explanation: "BA + SK + ET = BASKET — a container for carrying things. The SK pattern is common in English (ask, desk, risk, task). ✓",
            interactTemplate: "JA _ _ ET",
            interactMissingLetters: "CK",
            interactCompleteWord: "JACKET",
            interactWordMeaning: "a short coat",
            interactOptions: ["CK", "SK", "NK", "LK", "RK"],
            interactCorrectAnswer: "CK",
            interactExplanation: "JA + CK + ET = JACKET — a short coat. The CK pattern is common in English (back, sock, neck, kick). ✓"
          },
          {
            name: "Finn",
            scenario: "using his knowledge of letter patterns",
            template: "KNI _ _ T",
            missingLetters: "GH",
            completeWord: "KNIGHT",
            wordMeaning: "a medieval warrior on horseback",
            options: ["GH", "TH", "CH", "PH", "SH"],
            correctAnswer: "GH",
            explanation: "KNI + GH + T = KNIGHT — a medieval warrior. The GH pattern is tricky — it's silent here, but knowing it helps! ✓",
            interactTemplate: "_ _ ALE",
            interactMissingLetters: "WH",
            interactCompleteWord: "WHALE",
            interactWordMeaning: "a very large sea mammal",
            interactOptions: ["WH", "TH", "CH", "PH", "SH"],
            interactCorrectAnswer: "WH",
            interactExplanation: "WH + ALE = WHALE — a very large sea mammal. The WH pattern appears at the start of many question words (what, when, where, why). ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Spot the pattern in "${v.template}"!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** English has common **letter pairs** that pop up again and again: CH, SH, TH, CK, GH, SK, PH, WH. Once you learn them, they're like having a cheat code for these questions!\n\n**${v.template}** — which common pattern fits?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Spot the pattern — it's your superpower!",
            body: (v) => `Look at **${v.template}**. English has standard letter combinations (like CH, SH, TH) that appear in thousands of words. If you know them, you can solve missing-letter questions much faster.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Common patterns: CH, SH, TH, CK, GH, SK, PH, WH`, why: "These appear in hundreds of words" },
                  { text: `Look at ${v.template} — which pattern fits?`, why: "Try each one until you find a real word" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which common letter pattern completes **${v.interactTemplate}**?\n\nClue: ${v.interactWordMeaning}.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letter pattern completes ${v.interactTemplate}?`,
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
            title: () => "Pattern power — unlocked!",
            body: () => `Excellent! These common letter patterns will speed you up massively:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "CH (chapter, chicken, church, cheese)", why: "One of the most common patterns" },
                  { text: "SH, TH, WH, PH (ship, think, whale, phone)", why: "H-combinations appear everywhere" },
                  { text: "CK, SK, GH, NK (back, basket, knight, think)", why: "Consonant clusters to watch for ✓" }
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
  // SUB-CONCEPT 8: Process of Elimination
  // Category: other
  // Lesson A: step-by-step | Lesson B: practice
  // ==========================================
  {
    id: "process-of-elimination",
    name: "Eliminate and Solve",
    category: "other",
    lessons: [
      {
        id: "elimination-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Your safety net: how to use elimination when you're stuck on a tricky one",
          "Why crossing out impossible options is way smarter (and faster!) than random guessing"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "stuck on a tricky missing-letter question",
            template: "_ _ _ NITURE",
            missingLetters: "FUR",
            completeWord: "FURNITURE",
            wordMeaning: "tables, chairs, beds and other items in a home",
            options: ["FUR", "GAR", "MAN", "SIG", "TEN"],
            correctAnswer: "FUR",
            explanation: "FUR + NITURE = FURNITURE — tables, chairs and beds. You can eliminate GAR, MAN, SIG and TEN because GARNITURE, MANNITURE, SIGNITURE and TENNITURE aren't real words. ✓",
            interactTemplate: "_ _ _ ATHLON",
            interactMissingLetters: "DEC",
            interactCompleteWord: "DECATHLON",
            interactWordMeaning: "a sporting event with ten different activities",
            interactOptions: ["DEC", "TRI", "PEN", "HEX", "BIG"],
            interactCorrectAnswer: "DEC",
            interactExplanation: "DEC + ATHLON = DECATHLON — a sporting event with ten activities. TRIATHLON is a real word but with only three events, and PENATHLON, HEXATHLON and BIGATHLON don't exist. ✓"
          },
          {
            name: "Oliver",
            scenario: "using elimination to crack a tough word",
            template: "_ _ _ VENTURE",
            missingLetters: "AD",
            completeWord: "ADVENTURE",
            wordMeaning: "an exciting and sometimes dangerous experience",
            options: ["AD", "IN", "RE", "MO", "UN"],
            correctAnswer: "AD",
            explanation: "AD + VENTURE = ADVENTURE — an exciting experience. INVENTURE and MOVENTURE aren't words, and REVENTURE and UNVENTURE aren't standard. Only ADVENTURE works! ✓",
            interactTemplate: "_ _ _ NADO",
            interactMissingLetters: "TOR",
            interactCompleteWord: "TORNADO",
            interactWordMeaning: "a powerful spinning storm with very strong winds",
            interactOptions: ["TOR", "BAN", "MIG", "JUL", "SER"],
            interactCorrectAnswer: "TOR",
            interactExplanation: "TOR + NADO = TORNADO — a powerful spinning storm. BANNADO, MIGNADO, JULNADO and SERNADO aren't real words — only TORNADO works! ✓"
          },
          {
            name: "Priya",
            scenario: "eliminating wrong answers one by one",
            template: "_ _ _ MANENT",
            missingLetters: "PER",
            completeWord: "PERMANENT",
            wordMeaning: "lasting for an indefinitely long time",
            options: ["PER", "TOR", "GER", "FIR", "NOR"],
            correctAnswer: "PER",
            explanation: "PER + MANENT = PERMANENT — lasting for a long time. TORMANENT, GERMANENT, FIRMANENT and NORMANENT aren't real words. ✓",
            interactTemplate: "_ _ _ TAMENT",
            interactMissingLetters: "TES",
            interactCompleteWord: "TESTAMENT",
            interactWordMeaning: "evidence or proof of something, or a section of the Bible",
            interactOptions: ["TES", "MOM", "PAR", "TRE", "GOV"],
            interactCorrectAnswer: "TES",
            interactExplanation: "TES + TAMENT = TESTAMENT — evidence or proof of something. MOMTAMENT, PARTAMENT, TRETAMENT and GOVTAMENT aren't English words. ✓"
          },
          {
            name: "Finn",
            scenario: "trying each option systematically",
            template: "_ _ _ RENDER",
            missingLetters: "SUR",
            completeWord: "SURRENDER",
            wordMeaning: "to give up or yield to another's power",
            options: ["SUR", "PRE", "TEN", "BAR", "FOR"],
            correctAnswer: "SUR",
            explanation: "SUR + RENDER = SURRENDER — to give up. Try each one: PRERENDER? TENRENDER? BARRENDER? FORRENDER? None of those are words. Only SURRENDER works! ✓",
            interactTemplate: "_ _ _ TASTIC",
            interactMissingLetters: "FAN",
            interactCompleteWord: "FANTASTIC",
            interactWordMeaning: "extraordinarily good or wonderful",
            interactOptions: ["FAN", "GYM", "PLO", "SAR", "TEN"],
            interactCorrectAnswer: "FAN",
            interactExplanation: "FAN + TASTIC = FANTASTIC — extraordinarily good or wonderful. GYMTASTIC, PLOTASTIC, SARTASTIC and TENTASTIC aren't real words. Only FANTASTIC works! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Stuck? Try elimination! "${v.template}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nFeeling stuck? Don't worry — there's always a way through! **Try each option** and cross out the ones that don't make a real word. This is called **process of elimination**, and it's your safety net when nothing else clicks.\n\n**${v.template}** — which option makes a real word?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Cross out the fakes — be ruthless!",
            body: (v) => `Look at **${v.template}**. When you're stuck, try each option one by one. If it doesn't make a real word, cross it out — the last one standing is your answer!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try each option with ${v.template}`, why: "Plug in each set of letters" },
                  { text: `Cross out any that don't make real words`, why: "If you've never heard of it, it's probably not a word" },
                  { text: `Answer: ${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `When you're stuck, try each option and ____ the ones that don't make real words.`,
              options: (v) => ["cross out", "underline", "copy", "count"],
              correctIndex: (v) => 0,
              feedback: {
                correct: () => `Exactly! Cross out (eliminate) the fakes — the last one standing is your answer. ✓`,
                incorrect: () => `The answer is "cross out". Try each option, cross out the fakes, and the last one standing is your answer. ✓`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — eliminate!",
            body: (v) => `Try each option with **${v.interactTemplate}** and cross out the fakes. Which one makes a real word?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "Elimination — you'll never be stuck!",
            body: () => `Now you've got a safety net for the trickiest questions. When nothing else works:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try each option in the gap", why: "Plug them in one by one" },
                  { text: "2. Cross out any that don't make real words", why: "GARNITURE? SIGNITURE? Not real — cross them out!" },
                  { text: "3. The last one standing is your answer", why: "FURNITURE — the only real word left ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "elimination-practice",
        templateType: "curiosity-hook",
        learningGoal: [
          "Taking elimination to the next level with harder words — you're ready for this!",
          "How to build real speed by testing options in a smart, systematic way"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "using elimination on a really tricky word",
            template: "_ _ _ GUAGE",
            missingLetters: "LAN",
            completeWord: "LANGUAGE",
            wordMeaning: "the method of human communication using words",
            options: ["LAN", "BAG", "MOR", "SAU", "VER"],
            correctAnswer: "LAN",
            explanation: "LAN + GUAGE = LANGUAGE — the method of communication using words. BAGGUAGE, MORGUAGE, SAUGUAGE and VERGUAGE don't exist! ✓",
            interactTemplate: "_ _ _ GRAPH",
            interactMissingLetters: "PARA",
            interactCompleteWord: "PARAGRAPH",
            interactWordMeaning: "a section of writing starting on a new line",
            interactOptions: ["PARA", "AUTO", "MONO", "TELE", "MEGA"],
            interactCorrectAnswer: "PARA",
            interactExplanation: "PARA + GRAPH = PARAGRAPH — a section of writing starting on a new line. AUTOGRAPH is a real word but means a signature. Only PARAGRAPH matches! ✓"
          },
          {
            name: "Marcus",
            scenario: "eliminating options to find the answer",
            template: "_ _ _ ARTURE",
            missingLetters: "DEP",
            completeWord: "DEPARTURE",
            wordMeaning: "the act of leaving, especially to start a journey",
            options: ["DEP", "REP", "CAP", "MAP", "TAP"],
            correctAnswer: "DEP",
            explanation: "DEP + ARTURE = DEPARTURE — the act of leaving on a journey. REPARTURE, CAPARTURE, MAPARTURE and TAPARTURE aren't English words. ✓",
            interactTemplate: "_ _ _ ERNMENT",
            interactMissingLetters: "GOV",
            interactCompleteWord: "GOVERNMENT",
            interactWordMeaning: "the group of people who officially run a country",
            interactOptions: ["GOV", "POW", "MOV", "BOW", "TOW"],
            interactCorrectAnswer: "GOV",
            interactExplanation: "GOV + ERNMENT = GOVERNMENT — the group of people who run a country. POWERNMENT, MOVERNMENT, BOWERNMENT and TOWERNMENT aren't English words. ✓"
          },
          {
            name: "Aisha",
            scenario: "systematically testing each option",
            template: "_ _ _ ESTOR",
            missingLetters: "ANC",
            completeWord: "ANCESTOR",
            wordMeaning: "a person from whom you are descended",
            options: ["ANC", "INV", "PRO", "FOR", "MOL"],
            correctAnswer: "ANC",
            explanation: "ANC + ESTOR = ANCESTOR — a person from whom you are descended. Only ANCESTOR is a real English word from these options. ✓",
            interactTemplate: "_ _ _ TION",
            interactMissingLetters: "NA",
            interactCompleteWord: "NATION",
            interactWordMeaning: "a country considered as a group of people",
            interactOptions: ["NA", "PO", "LO", "MO", "RA"],
            interactCorrectAnswer: "NA",
            interactExplanation: "NA + TION = NATION — a country considered as a group of people. POTION, LOTION, MOTION and RATION are real words too, so check carefully — only NATION uses NA! ✓"
          },
          {
            name: "Charlie",
            scenario: "testing options one by one",
            template: "_ _ _ ACLE",
            missingLetters: "MIR",
            completeWord: "MIRACLE",
            wordMeaning: "an extraordinary and welcome event",
            options: ["MIR", "TEN", "PIN", "OBS", "BAR"],
            correctAnswer: "MIR",
            explanation: "MIR + ACLE = MIRACLE — an extraordinary and welcome event. TENACLE, PINACLE, OBSACLE and BARACLE aren't real words. Only MIRACLE works! ✓",
            interactTemplate: "_ _ _ PITAL",
            interactMissingLetters: "HOS",
            interactCompleteWord: "HOSPITAL",
            interactWordMeaning: "a place where sick or injured people are treated",
            interactOptions: ["HOS", "CAP", "REC", "DIG", "TRO"],
            interactCorrectAnswer: "HOS",
            interactExplanation: "HOS + PITAL = HOSPITAL — a place where sick or injured people are treated. CAPITAL is a real word but uses CAPI, not CAP + PITAL. Only HOSPITAL works! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Eliminate to win! "${v.template}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThese are harder words — but you've got this! The elimination method works every time. Try each option, cross out the fakes, and watch the answer reveal itself.\n\n**${v.template}**\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.template.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `${v.missingLetters.replace(/\s/g, '').length} missing letter${v.missingLetters.replace(/\s/g, '').length > 1 ? 's' : ''} to find:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Test smart, not random!",
            body: (v) => `Look at **${v.template}**. Go through each option methodically — don't just stare at the word. Actively try each one!\n\nOptions: ${v.options.map(o => `**${o}**`).join('  |  ')}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Option by option: try each with ${v.template}`, why: "Be systematic — don't skip any" },
                  { text: `Most options will create nonsense words`, why: "Cross those out straight away" },
                  { text: `${v.missingLetters} → ${v.completeWord}`, why: `${v.wordMeaning} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Eliminate!",
            body: (v) => `Which option completes **${v.interactTemplate}**? Try each one!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "gap",
                template: v.interactTemplate.split(' ').flatMap(part => part === '_' ? ['_'] : part.split('')),
                showFilled: false,
                label: `Fill in the gaps:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which letters complete ${v.interactTemplate}?`,
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
            title: () => "Elimination master — nothing can stop you!",
            body: () => `You've built up a brilliant toolkit! For even the hardest missing-letter questions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Don't panic — even hard words follow the rules", why: "Every answer makes a real English word" },
                  { text: "2. Try EVERY option, not just the first one", why: "Be systematic — test them all" },
                  { text: "3. The fake words are usually obvious", why: "BAGGUAGE? SAUGUAGE? Cross them out and move on ✓" }
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

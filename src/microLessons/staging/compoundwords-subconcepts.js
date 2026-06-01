// ============================================================
// Supplementary sub-concepts for Compound Words (Verbal Reasoning)
// To merge: add these to lessonBank.compoundWords.subConcepts array in lessonData.js
// ============================================================

export const compoundWordsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Front Placement
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "front-placement",
    name: "Front Placement — Word Goes in Front",
    category: "core",
    lessons: [
      {
        id: "front-placement-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a word that goes IN FRONT of another to make a compound word — like snapping two LEGO bricks together!",
          "A handy trick called Say It, Spell It that makes testing combinations super quick"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "working on compound word questions",
            sharedWord: "light",
            direction: "in front of",
            testWords: ["sun", "moon", "star", "day"],
            correctWord: "sun",
            compound: "sunlight",
            wrongTry: "star",
            wrongCompound: "starlight",
            whyWrongWorks: "actually 'starlight' IS a real word too — but we need one that works with BOTH target words",
            secondWord: "burn",
            secondCompound: "sunburn",
            fullQuestion: "Which word goes in front of both 'light' and 'burn' to make two compound words?",
            options: ["sun", "moon", "fire", "day", "flash"],
            correctAnswer: "sun",
            explanation: "'Sun' + 'light' = sunlight, and 'sun' + 'burn' = sunburn. Both are real compound words. ✓",
            interactSharedWord: "bow",
            interactSecondWord: "drop",
            interactFullQuestion: "Which word goes in front of both 'bow' and 'drop' to make two compound words?",
            interactOptions: ["rain", "snow", "dew", "tear", "eye"],
            interactCorrectAnswer: "rain",
            interactExplanation: "'Rain' + 'bow' = rainbow, and 'rain' + 'drop' = raindrop. Both are real compound words. ✓"
          },
          {
            name: "Oliver",
            scenario: "practising VR compound words at home",
            sharedWord: "fall",
            direction: "in front of",
            testWords: ["rain", "snow", "down", "water"],
            correctWord: "rain",
            compound: "rainfall",
            wrongTry: "snow",
            wrongCompound: "snowfall",
            whyWrongWorks: "'snowfall' is also real — but we need the one that works with BOTH words",
            secondWord: "coat",
            secondCompound: "raincoat",
            fullQuestion: "Which word goes in front of both 'fall' and 'coat' to make two compound words?",
            options: ["rain", "snow", "water", "night", "down"],
            correctAnswer: "rain",
            explanation: "'Rain' + 'fall' = rainfall, and 'rain' + 'coat' = raincoat. Both are real compound words. ✓",
            interactSharedWord: "rise",
            interactSecondWord: "set",
            interactFullQuestion: "Which word goes in front of both 'rise' and 'set' to make two compound words?",
            interactOptions: ["sun", "moon", "star", "cloud", "day"],
            interactCorrectAnswer: "sun",
            interactExplanation: "'Sun' + 'rise' = sunrise, and 'sun' + 'set' = sunset. Both are real compound words. ✓"
          },
          {
            name: "Priya",
            scenario: "doing VR revision after school",
            sharedWord: "work",
            direction: "in front of",
            testWords: ["home", "team", "net", "frame"],
            correctWord: "home",
            compound: "homework",
            wrongTry: "team",
            wrongCompound: "teamwork",
            whyWrongWorks: "'teamwork' is real — but does 'team' also work with 'sick'?",
            secondWord: "sick",
            secondCompound: "homesick",
            fullQuestion: "Which word goes in front of both 'work' and 'sick' to make two compound words?",
            options: ["home", "team", "net", "frame", "class"],
            correctAnswer: "home",
            explanation: "'Home' + 'work' = homework, and 'home' + 'sick' = homesick. Both are real compound words. ✓",
            interactSharedWord: "ball",
            interactSecondWord: "print",
            interactFullQuestion: "Which word goes in front of both 'ball' and 'print' to make two compound words?",
            interactOptions: ["foot", "hand", "base", "eye", "snow"],
            interactCorrectAnswer: "foot",
            interactExplanation: "'Foot' + 'ball' = football, and 'foot' + 'print' = footprint. Both are real compound words. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling a VR practice paper",
            sharedWord: "ground",
            direction: "in front of",
            testWords: ["play", "camp", "back", "under"],
            correctWord: "play",
            compound: "playground",
            wrongTry: "camp",
            wrongCompound: "campground",
            whyWrongWorks: "'campground' is real — but does 'camp' work with 'time' too?",
            secondWord: "time",
            secondCompound: "playtime",
            fullQuestion: "Which word goes in front of both 'ground' and 'time' to make two compound words?",
            options: ["play", "camp", "back", "under", "fore"],
            correctAnswer: "play",
            explanation: "'Play' + 'ground' = playground, and 'play' + 'time' = playtime. Both are real compound words. ✓",
            interactSharedWord: "flower",
            interactSecondWord: "burn",
            interactFullQuestion: "Which word goes in front of both 'flower' and 'burn' to make two compound words?",
            interactOptions: ["sun", "wild", "corn", "fire", "may"],
            interactCorrectAnswer: "sun",
            interactExplanation: "'Sun' + 'flower' = sunflower, and 'sun' + 'burn' = sunburn. Both are real compound words. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What goes IN FRONT of "${v.sharedWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** A compound word is just two smaller words stuck together — like "sunlight" = sun + light. Your job is to find ONE word that makes **two** real compound words. It's like finding a key that unlocks two doors!\n\n${v.fullQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.sharedWord} = ???`, why: `Find a word that makes a real compound word with "${v.sharedWord}"` },
                  { text: `? + ${v.secondWord} = ???`, why: `The SAME word must also work with "${v.secondWord}"` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Say It, Spell It — Front Placement",
            body: (v) => `Let's find a word that goes in front of **"${v.sharedWord}"** and **"${v.secondWord}"**. Here's the trick: try each option **before** the given word and say it in your head. Does it sound like a real word? If it does, you might be on to something!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try: "${v.correctWord}" + "${v.sharedWord}" = ${v.compound}`, why: "Say it — does it sound right? Yes!" },
                  { text: `Check the second: "${v.correctWord}" + "${v.secondWord}" = ${v.secondCompound}`, why: "Both must work — and this one does too!" },
                  { text: `Spell it: ${v.compound.toUpperCase()} — one real word ✓`, why: "It's one word, correctly spelt" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Try each option IN FRONT of "${v.sharedWord}"`,
                `Say the combination — does it sound like a real word?`,
                `Check it works with "${v.secondWord}" too`,
                `Spell it out to make sure`
              ],
              feedback: {
                correct: (v) => `Perfect! Say it, check both words, then spell it. ✓`,
                incorrect: (v) => `Not quite — start by trying options in front, then check BOTH target words.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}\n\nRemember: the answer must work with **both** words!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactSharedWord} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactSecondWord} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "You've got the front placement recipe!",
            body: () => `Nice work! Here's your go-to method when the word goes IN FRONT:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Put each option BEFORE the given word", why: "Say it in your head — sun+light? moon+light?" },
                  { text: "2. Check it works with BOTH target words", why: "The answer must make TWO real compound words" },
                  { text: "3. Spell it out to confirm", why: "One real word, not two separate words ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "front-placement-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "The sneaky trap where a word works with ONE target but not BOTH",
          "A quick double-check trick that stops you losing easy marks"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her friend's VR answers",
            targetWordA: "bow",
            targetWordB: "drop",
            friendAnswer: "rain",
            friendCompoundA: "rainbow",
            friendCompoundB: "raindrop",
            actuallyCorrect: true,
            trickWord: "snow",
            trickCompoundA: "snowdrop",
            trickReason: "'Snowdrop' is real, but 'snowbow' isn't — 'snow' only works with 'drop', not with 'bow'",
            fullQuestion: "Which word goes in front of both 'bow' and 'drop'?",
            options: ["rain", "snow", "sun", "dew", "tear"],
            correctAnswer: "rain",
            explanation: "'Rain' + 'bow' = rainbow, and 'rain' + 'drop' = raindrop. 'Snow' only works with 'drop' (snowdrop), not 'bow'. ✓",
            interactTargetA: "light",
            interactTargetB: "burn",
            interactFullQuestion: "Which word goes in front of both 'light' and 'burn'?",
            interactOptions: ["sun", "moon", "fire", "day", "flash"],
            interactCorrectAnswer: "sun",
            interactExplanation: "'Sun' + 'light' = sunlight, and 'sun' + 'burn' = sunburn. Both are real compound words. ✓"
          },
          {
            name: "Marcus",
            scenario: "reviewing his practice test",
            targetWordA: "print",
            targetWordB: "step",
            friendAnswer: "finger",
            friendCompoundA: "fingerprint",
            friendCompoundB: "fingerstep",
            actuallyCorrect: false,
            trickWord: "finger",
            trickCompoundA: "fingerprint",
            trickReason: "'Fingerstep' isn't a real word — 'finger' only works with 'print', not 'step'",
            fullQuestion: "Which word goes in front of both 'print' and 'step'?",
            options: ["foot", "finger", "hand", "thumb", "toe"],
            correctAnswer: "foot",
            explanation: "'Foot' + 'print' = footprint, and 'foot' + 'step' = footstep. 'Finger' only works with 'print'. ✓",
            interactTargetA: "work",
            interactTargetB: "sick",
            interactFullQuestion: "Which word goes in front of both 'work' and 'sick'?",
            interactOptions: ["home", "team", "net", "frame", "class"],
            interactCorrectAnswer: "home",
            interactExplanation: "'Home' + 'work' = homework, and 'home' + 'sick' = homesick. Both are real compound words. ✓"
          },
          {
            name: "Aisha",
            scenario: "helping her sister with VR homework",
            targetWordA: "side",
            targetWordB: "shore",
            friendAnswer: "river",
            friendCompoundA: "riverside",
            friendCompoundB: "rivershore",
            actuallyCorrect: false,
            trickWord: "river",
            trickCompoundA: "riverside",
            trickReason: "'Rivershore' isn't a real compound word — 'river' only works with 'side', not 'shore'",
            fullQuestion: "Which word goes in front of both 'side' and 'shore'?",
            options: ["sea", "river", "lake", "beach", "water"],
            correctAnswer: "sea",
            explanation: "'Sea' + 'side' = seaside, and 'sea' + 'shore' = seashore. 'River' only works with 'side'. ✓",
            interactTargetA: "ground",
            interactTargetB: "time",
            interactFullQuestion: "Which word goes in front of both 'ground' and 'time'?",
            interactOptions: ["play", "camp", "back", "under", "fore"],
            interactCorrectAnswer: "play",
            interactExplanation: "'Play' + 'ground' = playground, and 'play' + 'time' = playtime. Both are real compound words. ✓"
          },
          {
            name: "Charlie",
            scenario: "going over his mock test",
            targetWordA: "rise",
            targetWordB: "set",
            friendAnswer: "moon",
            friendCompoundA: "moonrise",
            friendCompoundB: "moonset",
            actuallyCorrect: false,
            trickWord: "moon",
            trickCompoundA: "moonrise",
            trickReason: "'Moonset' isn't a standard compound word — 'moon' works with 'rise' and 'light', but 'sun' works with both 'rise' and 'set'",
            fullQuestion: "Which word goes in front of both 'rise' and 'set'?",
            options: ["sun", "moon", "star", "day", "cloud"],
            correctAnswer: "sun",
            explanation: "'Sun' + 'rise' = sunrise, and 'sun' + 'set' = sunset. Both are common compound words. ✓",
            interactTargetA: "fall",
            interactTargetB: "coat",
            interactFullQuestion: "Which word goes in front of both 'fall' and 'coat'?",
            interactOptions: ["rain", "snow", "water", "night", "down"],
            interactCorrectAnswer: "rain",
            interactExplanation: "'Rain' + 'fall' = rainfall, and 'rain' + 'coat' = raincoat. Both are real compound words. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Does "${v.trickWord}" work with both words?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe question asks: **${v.fullQuestion}**\n\nSomeone chose **"${v.trickWord}"** — but hang on, does it actually work with BOTH words? Let's play detective!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.trickWord} + ${v.targetWordA} = ${v.trickWord}${v.targetWordA}`, why: `Is "${v.trickWord}${v.targetWordA}" a real word?` },
                  { text: `${v.trickWord} + ${v.targetWordB} = ${v.trickWord}${v.targetWordB}`, why: `Is "${v.trickWord}${v.targetWordB}" a real word?` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Watch out — the BOTH-words trap!",
            body: (v) => `Here's the number one trap in compound word questions: picking a word that only works with ONE of the two targets. Don't fall for it!\n\n${v.trickReason}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.trickWord}" + "${v.targetWordA}" = ${v.trickCompoundA}`, why: "This one might work..." },
                  { text: `"${v.trickWord}" + "${v.targetWordB}" = ???`, why: v.trickReason },
                  { text: `"${v.correctAnswer}" works with BOTH ✓`, why: `${v.correctAnswer}+${v.targetWordA} AND ${v.correctAnswer}+${v.targetWordB}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `If a word makes a compound with ONE target, it's the answer`, answer: false, explanation: `No — the answer must work with BOTH target words, not just one!` },
                { text: `You must check the answer against BOTH given words`, answer: true, explanation: `Correct — always test with both words before choosing. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the word that works with BOTH!",
            body: (v) => `${v.interactFullQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactTargetA} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactTargetB} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "Golden rule: always check BOTH words",
            body: () => `Now you know the most common trap — and you won't fall for it! Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try each option with the FIRST target word", why: "Does it make a real compound?" },
                  { text: "2. Then check the SECOND target word", why: "Does the SAME option work here too?" },
                  { text: "3. Only pick it if BOTH are real compound words", why: "One out of two isn't enough! ✓" }
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
  // SUB-CONCEPT 2: Back Placement
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "back-placement",
    name: "Back Placement — Word Goes at the End",
    category: "core",
    lessons: [
      {
        id: "back-placement-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a word that slots in AFTER another to complete a compound word",
          "Using Say It, Spell It to test back-placement combos like a pro"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "practising back-placement compound words",
            sharedWord: "room",
            direction: "after",
            firstWord: "bed",
            firstCompound: "bedroom",
            secondWord: "class",
            secondCompound: "classroom",
            fullQuestion: "Which word goes after both 'bed' and 'class' to make two compound words?",
            options: ["room", "time", "side", "space", "hall"],
            correctAnswer: "room",
            explanation: "'Bed' + 'room' = bedroom, and 'class' + 'room' = classroom. Both are real compound words. ✓",
            interactFirstWord: "tooth",
            interactSecondWord: "hair",
            interactSharedWord: "brush",
            interactFullQuestion: "Which word goes after both 'tooth' and 'hair' to make two compound words?",
            interactOptions: ["brush", "paste", "comb", "pick", "clip"],
            interactCorrectAnswer: "brush",
            interactExplanation: "'Tooth' + 'brush' = toothbrush, and 'hair' + 'brush' = hairbrush. Both are real compound words. ✓"
          },
          {
            name: "Hugo",
            scenario: "working through a VR workbook",
            sharedWord: "ball",
            direction: "after",
            firstWord: "foot",
            firstCompound: "football",
            secondWord: "basket",
            secondCompound: "basketball",
            fullQuestion: "Which word goes after both 'foot' and 'basket' to make two compound words?",
            options: ["ball", "game", "match", "field", "team"],
            correctAnswer: "ball",
            explanation: "'Foot' + 'ball' = football, and 'basket' + 'ball' = basketball. Both are real compound words. ✓",
            interactFirstWord: "night",
            interactSecondWord: "down",
            interactSharedWord: "fall",
            interactFullQuestion: "Which word goes after both 'night' and 'down' to make two compound words?",
            interactOptions: ["fall", "flake", "storm", "cloud", "drop"],
            interactCorrectAnswer: "fall",
            interactExplanation: "'Night' + 'fall' = nightfall, and 'down' + 'fall' = downfall. Both are real compound words. ✓"
          },
          {
            name: "Ella",
            scenario: "doing VR homework on the bus",
            sharedWord: "berry",
            direction: "after",
            firstWord: "straw",
            firstCompound: "strawberry",
            secondWord: "blue",
            secondCompound: "blueberry",
            fullQuestion: "Which word goes after both 'straw' and 'blue' to make two compound words?",
            options: ["berry", "fruit", "jam", "cake", "juice"],
            correctAnswer: "berry",
            explanation: "'Straw' + 'berry' = strawberry, and 'blue' + 'berry' = blueberry. Both are real compound words. ✓",
            interactFirstWord: "book",
            interactSecondWord: "land",
            interactSharedWord: "mark",
            interactFullQuestion: "Which word goes after both 'book' and 'land' to make two compound words?",
            interactOptions: ["mark", "shelf", "case", "slide", "lord"],
            interactCorrectAnswer: "mark",
            interactExplanation: "'Book' + 'mark' = bookmark, and 'land' + 'mark' = landmark. Both are real compound words. ✓"
          },
          {
            name: "Ben",
            scenario: "revising compound words before a test",
            sharedWord: "light",
            direction: "after",
            firstWord: "sun",
            firstCompound: "sunlight",
            secondWord: "star",
            secondCompound: "starlight",
            fullQuestion: "Which word goes after both 'sun' and 'star' to make two compound words?",
            options: ["light", "shine", "beam", "glow", "bright"],
            correctAnswer: "light",
            explanation: "'Sun' + 'light' = sunlight, and 'star' + 'light' = starlight. Both are real compound words. ✓",
            interactFirstWord: "cup",
            interactSecondWord: "card",
            interactSharedWord: "board",
            interactFullQuestion: "Which word goes after both 'cup' and 'card' to make two compound words?",
            interactOptions: ["board", "cake", "box", "holder", "game"],
            interactCorrectAnswer: "board",
            interactExplanation: "'Cup' + 'board' = cupboard, and 'card' + 'board' = cardboard. Both are real compound words. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What goes AFTER "${v.firstWord}" and "${v.secondWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis time, the mystery word goes at the **end** — like the last piece of a jigsaw. Can you find the ONE word that completes **both** compound words?\n\n${v.fullQuestion}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nThis time, the mystery word goes at the **end** — like the last piece of a jigsaw. Can you find the ONE word that completes **both** compound words?\n\n${v.fullQuestion}` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.firstWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.firstWord}" + ? = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.secondWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.secondWord}" + ? = ?`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Say It, Spell It — Back Placement",
            body: (v) => `Let's find a word that goes after **"${v.firstWord}"** and **"${v.secondWord}"** to make compound words. Try each option **after** the given words — say it in your head and see if it clicks!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try: "${v.firstWord}" + "${v.sharedWord}" = ${v.firstCompound}`, why: "Say it — sounds like a real word!" },
                  { text: `Check: "${v.secondWord}" + "${v.sharedWord}" = ${v.secondCompound}`, why: "Works with the second word too!" },
                  { text: `Spell both: ${v.firstCompound.toUpperCase()} and ${v.secondCompound.toUpperCase()} ✓`, why: "Both are one real word each" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Try each option AFTER "${v.firstWord}"`,
                `Say the combination — does it sound right?`,
                `Check it works after "${v.secondWord}" too`,
                `Spell both compound words to confirm`
              ],
              feedback: {
                correct: (v) => `Perfect! Try it after both words, then spell to check. ✓`,
                incorrect: (v) => `Not quite — start by trying options after the first word, then check the second.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}\n\nRemember: put each option **after** both given words.`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.interactFullQuestion}\n\nRemember: put each option **after** both given words.` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.interactFirstWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.interactFirstWord}" + ? = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.interactSecondWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.interactSecondWord}" + ? = ?`
              })}
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "You've nailed back placement!",
            body: () => `Brilliant — here's your recipe for when the word goes at the END:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Put each option AFTER the given words", why: "bed+room? bed+time? bed+side?" },
                  { text: "2. Check it works with BOTH given words", why: "The answer must complete TWO compound words" },
                  { text: "3. Spell them out to make sure", why: "Real compound words, correctly spelt ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "back-placement-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why back-placement traps are so sneaky — and how to dodge them",
          "A simple check that stops you picking a word that only fits one pairing"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "spotting a mistake in her practice answers",
            firstWord: "tooth",
            secondWord: "hair",
            friendAnswer: "paste",
            friendCompoundA: "toothpaste",
            friendCompoundB: "hairpaste",
            trickReason: "'Hairpaste' isn't a real word — 'paste' only works with 'tooth'",
            fullQuestion: "Which word goes after both 'tooth' and 'hair'?",
            options: ["brush", "paste", "comb", "pick", "clip"],
            correctAnswer: "brush",
            explanation: "'Tooth' + 'brush' = toothbrush, and 'hair' + 'brush' = hairbrush. 'Paste' only works with 'tooth'. ✓",
            interactFirstWord: "foot",
            interactSecondWord: "basket",
            interactFullQuestion: "Which word goes after both 'foot' and 'basket' to make two compound words?",
            interactOptions: ["ball", "game", "match", "field", "team"],
            interactCorrectAnswer: "ball",
            interactExplanation: "'Foot' + 'ball' = football, and 'basket' + 'ball' = basketball. Both are real compound words. ✓"
          },
          {
            name: "Oliver",
            scenario: "checking his VR answers",
            firstWord: "book",
            secondWord: "land",
            friendAnswer: "shelf",
            friendCompoundA: "bookshelf",
            friendCompoundB: "landshelf",
            trickReason: "'Landshelf' isn't a real word — 'shelf' only works with 'book'",
            fullQuestion: "Which word goes after both 'book' and 'land'?",
            options: ["mark", "shelf", "case", "slide", "lord"],
            correctAnswer: "mark",
            explanation: "'Book' + 'mark' = bookmark, and 'land' + 'mark' = landmark. 'Shelf' only works with 'book'. ✓",
            interactFirstWord: "straw",
            interactSecondWord: "blue",
            interactFullQuestion: "Which word goes after both 'straw' and 'blue' to make two compound words?",
            interactOptions: ["berry", "fruit", "jam", "cake", "juice"],
            interactCorrectAnswer: "berry",
            interactExplanation: "'Straw' + 'berry' = strawberry, and 'blue' + 'berry' = blueberry. Both are real compound words. ✓"
          },
          {
            name: "Priya",
            scenario: "reviewing her friend's VR work",
            firstWord: "snow",
            secondWord: "rain",
            friendAnswer: "flake",
            friendCompoundA: "snowflake",
            friendCompoundB: "rainflake",
            trickReason: "'Rainflake' isn't a real word — 'flake' only works with 'snow'",
            fullQuestion: "Which word goes after both 'snow' and 'rain'?",
            options: ["fall", "flake", "storm", "cloud", "drop"],
            correctAnswer: "fall",
            explanation: "'Snow' + 'fall' = snowfall, and 'rain' + 'fall' = rainfall. 'Flake' only works with 'snow'. ✓",
            interactFirstWord: "sun",
            interactSecondWord: "star",
            interactFullQuestion: "Which word goes after both 'sun' and 'star' to make two compound words?",
            interactOptions: ["light", "shine", "beam", "glow", "bright"],
            interactCorrectAnswer: "light",
            interactExplanation: "'Sun' + 'light' = sunlight, and 'star' + 'light' = starlight. Both are real compound words. ✓"
          },
          {
            name: "Finn",
            scenario: "going over a tricky VR section",
            firstWord: "cup",
            secondWord: "card",
            friendAnswer: "cake",
            friendCompoundA: "cupcake",
            friendCompoundB: "cardcake",
            trickReason: "'Cardcake' isn't a real word — 'cake' only works with 'cup'",
            fullQuestion: "Which word goes after both 'cup' and 'card'?",
            options: ["board", "cake", "box", "holder", "game"],
            correctAnswer: "board",
            explanation: "'Cup' + 'board' = cupboard, and 'card' + 'board' = cardboard. 'Cake' only works with 'cup'. ✓",
            interactFirstWord: "bed",
            interactSecondWord: "class",
            interactFullQuestion: "Which word goes after both 'bed' and 'class' to make two compound words?",
            interactOptions: ["room", "time", "side", "space", "hall"],
            interactCorrectAnswer: "room",
            interactExplanation: "'Bed' + 'room' = bedroom, and 'class' + 'room' = classroom. Both are real compound words. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendAnswer}" really the answer?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe question: **${v.fullQuestion}**\n\nSomeone picked **"${v.friendAnswer}"** — sounds right, doesn't it? But does it actually work with BOTH words? Let's find out!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nThe question: **${v.fullQuestion}**\n\nSomeone picked **"${v.friendAnswer}"** — sounds right, doesn't it? But does it actually work with BOTH words? Let's find out!` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.firstWord.split(''),
                group2: v.friendAnswer.split(''),
                resultWord: v.friendCompoundA,
                label: `${v.firstWord} + ${v.friendAnswer} = ${v.friendCompoundA}`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.secondWord.split(''),
                group2: v.friendAnswer.split(''),
                resultWord: v.friendCompoundB,
                label: `${v.secondWord} + ${v.friendAnswer} = ${v.friendCompoundB}?`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "One out of two won't do!",
            body: (v) => `${v.trickReason}\n\nYou need a word that works with **both** given words — one out of two isn't good enough!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.friendAnswer}" works with "${v.firstWord}" but NOT "${v.secondWord}"`, why: v.trickReason },
                  { text: `Try "${v.correctAnswer}" instead...`, why: `"${v.firstWord}" + "${v.correctAnswer}" = real word!` },
                  { text: `"${v.secondWord}" + "${v.correctAnswer}" = also real! ✓`, why: "Both compound words are real" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Find the one that works with BOTH!",
            body: (v) => `${v.interactFullQuestion}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.interactFullQuestion}` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.interactFirstWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.interactFirstWord}" + ? = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.interactSecondWord.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.interactSecondWord}" + ? = ?`
              })}
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "You're a trap-spotter now!",
            body: () => `You've cracked the back-placement trap — here's what to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "toothpaste is real BUT hairpaste is NOT", why: "Paste only works with tooth" },
                  { text: "toothbrush is real AND hairbrush is real", why: "Brush works with both!" },
                  { text: "Always test BOTH pairings before you choose", why: "Two real compound words needed ✓" }
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
  // SUB-CONCEPT 3: Nature Compounds
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "nature-compounds",
    name: "Nature Compound Words",
    category: "core",
    lessons: [
      {
        id: "nature-compounds-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why nature words like rain, snow, sun and water are absolute compound word superstars",
          "How to build a secret weapon — a mental bank of nature compounds you can recall in seconds"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning nature compound words for her VR test",
            natureWord: "snow",
            compounds: ["snowball", "snowflake", "snowman", "snowdrop"],
            targetA: "ball",
            targetB: "man",
            compoundA: "snowball",
            compoundB: "snowman",
            fullQuestion: "Which word goes in front of both 'ball' and 'man' to make two compound words?",
            options: ["snow", "fire", "foot", "base", "sand"],
            correctAnswer: "snow",
            explanation: "'Snow' + 'ball' = snowball, and 'snow' + 'man' = snowman. Snow makes lots of compound words! ✓",
            interactTargetA: "fall",
            interactTargetB: "proof",
            interactFullQuestion: "Which word goes in front of both 'fall' and 'proof' to make two compound words?",
            interactOptions: ["water", "rain", "fire", "sound", "bullet"],
            interactCorrectAnswer: "water",
            interactExplanation: "'Water' + 'fall' = waterfall, and 'water' + 'proof' = waterproof. Water is a great compound-maker! ✓"
          },
          {
            name: "Ben",
            scenario: "studying nature words that make compounds",
            natureWord: "water",
            compounds: ["waterfall", "waterproof", "watercolour", "watermark"],
            targetA: "fall",
            targetB: "proof",
            compoundA: "waterfall",
            compoundB: "waterproof",
            fullQuestion: "Which word goes in front of both 'fall' and 'proof' to make two compound words?",
            options: ["water", "rain", "fire", "sound", "bullet"],
            correctAnswer: "water",
            explanation: "'Water' + 'fall' = waterfall, and 'water' + 'proof' = waterproof. Water is a very common compound-maker! ✓",
            interactTargetA: "ball",
            interactTargetB: "flake",
            interactFullQuestion: "Which word goes in front of both 'ball' and 'flake' to make two compound words?",
            interactOptions: ["snow", "fire", "corn", "eye", "base"],
            interactCorrectAnswer: "snow",
            interactExplanation: "'Snow' + 'ball' = snowball, and 'snow' + 'flake' = snowflake. Snow makes lots of compounds! ✓"
          },
          {
            name: "Charlie",
            scenario: "practising nature compound words",
            natureWord: "sun",
            compounds: ["sunlight", "sunburn", "sunflower", "sunrise"],
            targetA: "flower",
            targetB: "burn",
            compoundA: "sunflower",
            compoundB: "sunburn",
            fullQuestion: "Which word goes in front of both 'flower' and 'burn' to make two compound words?",
            options: ["sun", "wild", "corn", "fire", "wind"],
            correctAnswer: "sun",
            explanation: "'Sun' + 'flower' = sunflower, and 'sun' + 'burn' = sunburn. Sun is one of the most common nature compound words! ✓",
            interactTargetA: "coat",
            interactTargetB: "drop",
            interactFullQuestion: "Which word goes in front of both 'coat' and 'drop' to make two compound words?",
            interactOptions: ["rain", "snow", "top", "dew", "tear"],
            interactCorrectAnswer: "rain",
            interactExplanation: "'Rain' + 'coat' = raincoat, and 'rain' + 'drop' = raindrop. Rain is a nature compound superstar! ✓"
          },
          {
            name: "Ella",
            scenario: "building her nature compound word bank",
            natureWord: "rain",
            compounds: ["rainbow", "raincoat", "raindrop", "rainfall"],
            targetA: "bow",
            targetB: "drop",
            compoundA: "rainbow",
            compoundB: "raindrop",
            fullQuestion: "Which word goes in front of both 'bow' and 'drop' to make two compound words?",
            options: ["rain", "sun", "snow", "dew", "tear"],
            correctAnswer: "rain",
            explanation: "'Rain' + 'bow' = rainbow, and 'rain' + 'drop' = raindrop. Rain forms lots of useful compound words! ✓",
            interactTargetA: "rise",
            interactTargetB: "light",
            interactFullQuestion: "Which word goes in front of both 'rise' and 'light' to make two compound words?",
            interactOptions: ["sun", "moon", "day", "star", "high"],
            interactCorrectAnswer: "sun",
            interactExplanation: "'Sun' + 'rise' = sunrise, and 'sun' + 'light' = sunlight. Sun is one of the most common nature compound words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How many compounds does "${v.natureWord}" make?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Nature words like **sun**, **rain**, **snow** and **water** are compound word superstars! They combine with LOADS of other words — more than almost anything else in English.\n\n**"${v.natureWord}"** makes: ${v.compounds.join(", ")}... and more!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.natureWord.split(''),
                group2: v.targetA.split(''),
                resultWord: v.compoundA,
                label: `"${v.natureWord}" is a compound superstar!`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Nature words = your secret weapon",
            body: (v) => `Let's try **"${v.natureWord}"** with **"${v.targetA}"** and **"${v.targetB}"**. Whenever you see a compound word question, always ask yourself: **could a nature word be the answer?** It's like having a cheat code — sun, rain, snow and water work SO often!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.natureWord}" + "${v.targetA}" = ${v.compoundA}`, why: "Say it — sounds right!" },
                  { text: `"${v.natureWord}" + "${v.targetB}" = ${v.compoundB}`, why: "Works with both — that's the one!" },
                  { text: `"${v.natureWord}" also makes: ${v.compounds[2]}, ${v.compounds[3]}...`, why: "Nature words are incredibly versatile ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "sun", right: "sunlight" },
                { left: "rain", right: "rainbow" },
                { left: "snow", right: "snowball" },
                { left: "water", right: "waterfall" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}\n\nThink: could a nature word work here?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactTargetA} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactTargetB} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "Your nature compound cheat sheet",
            body: () => `Brilliant work! Keep these nature compound-makers stored in your memory bank:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "SUN: sunlight, sunrise, sunset, sunburn, sunflower", why: "Sun goes in front" },
                  { text: "RAIN: rainbow, raincoat, raindrop, rainfall", why: "Rain goes in front" },
                  { text: "WATER: waterfall, waterproof, watercolour", why: "Water is incredibly versatile ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "nature-compounds-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why nature words are brilliant — but they don't work EVERY time",
          "How to avoid the trap of forcing a nature word where it doesn't belong"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "spotting nature word traps",
            targetA: "storm",
            targetB: "bolt",
            trickWord: "rain",
            trickCompoundA: "rainstorm",
            trickCompoundB: "rainbolt",
            trickReason: "'Rainbolt' isn't a real word — 'rain' works with 'storm' but not 'bolt'",
            fullQuestion: "Which word goes in front of both 'storm' and 'bolt'?",
            options: ["thunder", "rain", "light", "snow", "hail"],
            correctAnswer: "thunder",
            explanation: "'Thunder' + 'storm' = thunderstorm, and 'thunder' + 'bolt' = thunderbolt. Both are real compound words. ✓",
            interactTargetA: "colour",
            interactTargetB: "melon",
            interactFullQuestion: "Which word goes in front of both 'colour' and 'melon'?",
            interactOptions: ["water", "rain", "sun", "green", "fire"],
            interactCorrectAnswer: "water",
            interactExplanation: "'Water' + 'colour' = watercolour, and 'water' + 'melon' = watermelon. Both are real compound words. ✓"
          },
          {
            name: "Oliver",
            scenario: "avoiding nature word traps in VR",
            targetA: "colour",
            targetB: "melon",
            trickWord: "rain",
            trickCompoundA: "raincolour",
            trickCompoundB: "rainmelon",
            trickReason: "Neither 'raincolour' nor 'rainmelon' are real words!",
            fullQuestion: "Which word goes in front of both 'colour' and 'melon'?",
            options: ["water", "rain", "sun", "green", "fire"],
            correctAnswer: "water",
            explanation: "'Water' + 'colour' = watercolour, and 'water' + 'melon' = watermelon. Both are real compound words. ✓",
            interactTargetA: "board",
            interactTargetB: "ring",
            interactFullQuestion: "Which word goes in front of both 'board' and 'ring'?",
            interactOptions: ["key", "snow", "surf", "dart", "skate"],
            interactCorrectAnswer: "key",
            interactExplanation: "'Key' + 'board' = keyboard, and 'key' + 'ring' = keyring. Not every compound uses a nature word! ✓"
          },
          {
            name: "Priya",
            scenario: "checking if nature words always work",
            targetA: "shoe",
            targetB: "power",
            trickWord: "water",
            trickCompoundA: "watershoe",
            trickCompoundB: "waterpower",
            trickReason: "'Watershoe' isn't a standard compound word — water doesn't always combine with everything!",
            fullQuestion: "Which word goes in front of both 'shoe' and 'power'?",
            options: ["horse", "water", "fire", "man", "gun"],
            correctAnswer: "horse",
            explanation: "'Horse' + 'shoe' = horseshoe, and 'horse' + 'power' = horsepower. Not every question uses a nature word! ✓",
            interactTargetA: "storm",
            interactTargetB: "bolt",
            interactFullQuestion: "Which word goes in front of both 'storm' and 'bolt'?",
            interactOptions: ["thunder", "rain", "light", "snow", "hail"],
            interactCorrectAnswer: "thunder",
            interactExplanation: "'Thunder' + 'storm' = thunderstorm, and 'thunder' + 'bolt' = thunderbolt. Both are real compound words. ✓"
          },
          {
            name: "Hugo",
            scenario: "learning that nature words have limits",
            targetA: "board",
            targetB: "ring",
            trickWord: "snow",
            trickCompoundA: "snowboard",
            trickCompoundB: "snowring",
            trickReason: "'Snowring' isn't a real word — 'snow' works with 'board' but not 'ring'",
            fullQuestion: "Which word goes in front of both 'board' and 'ring'?",
            options: ["key", "snow", "surf", "dart", "skate"],
            correctAnswer: "key",
            explanation: "'Key' + 'board' = keyboard, and 'key' + 'ring' = keyring. Both are real compound words. ✓",
            interactTargetA: "shoe",
            interactTargetB: "power",
            interactFullQuestion: "Which word goes in front of both 'shoe' and 'power'?",
            interactOptions: ["horse", "water", "fire", "man", "gun"],
            interactCorrectAnswer: "horse",
            interactExplanation: "'Horse' + 'shoe' = horseshoe, and 'horse' + 'power' = horsepower. Not every compound uses a nature word! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.trickWord}" always the answer?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nNature words like sun, rain and water make loads of compounds — but here's the catch: they don't work **every** time!\n\nDoes **"${v.trickWord}"** really work with both **"${v.targetA}"** and **"${v.targetB}"**? Let's see...`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nNature words like sun, rain and water make loads of compounds — but here's the catch: they don't work **every** time!\n\nDoes **"${v.trickWord}"** really work with both **"${v.targetA}"** and **"${v.targetB}"**? Let's see...` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.trickWord.split(''),
                group2: v.targetA.split(''),
                resultWord: v.trickCompoundA,
                label: `${v.trickWord} + ${v.targetA} = ${v.trickCompoundA}`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: v.trickWord.split(''),
                group2: v.targetB.split(''),
                resultWord: v.trickCompoundB,
                label: `${v.trickWord} + ${v.targetB} = ${v.trickCompoundB}?`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Even superstars have limits!",
            body: (v) => `Just because a word is a common compound-maker doesn't mean it works everywhere — even superstars have off days!\n\n${v.trickReason}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.trickWord}" + "${v.targetA}" — maybe`, why: "It might sound right..." },
                  { text: `"${v.trickWord}" + "${v.targetB}" — no!`, why: v.trickReason },
                  { text: `"${v.correctAnswer}" works with BOTH ✓`, why: `${v.correctAnswer}+${v.targetA} AND ${v.correctAnswer}+${v.targetB}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Nature words like sun, rain, and water always work as compound answers`, answer: false, explanation: `No — nature words are common but they don't work with every target word. Always check both!` },
                { text: `You should always test the answer with BOTH target words before choosing`, answer: true, explanation: `Correct — even likely-looking answers can fail with the second word. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactTargetA} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactTargetB} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "Smart, not automatic!",
            body: () => `Nature words are your best first guess — but you've got this: always double-check!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Nature words are a great FIRST guess", why: "Sun, rain, water, snow — try them first" },
                  { text: "But they don't work with EVERYTHING", why: "snowring? rainbolt? Not real!" },
                  { text: "Always test BOTH pairings before choosing", why: "Say it, spell it, check it ✓" }
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
  // SUB-CONCEPT 4: Body Compounds
  // Category: supporting
  // ==========================================
  {
    id: "body-compounds",
    name: "Body Part Compound Words",
    category: "supporting",
    lessons: [
      {
        id: "body-compounds-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why body part words like head, hand, foot and eye are brilliant compound builders",
          "How to build up a mental word bank so you can spot them in a flash"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "learning body part compound words",
            bodyWord: "hand",
            compounds: ["handbag", "handshake", "handwriting", "handful"],
            targetA: "bag",
            targetB: "shake",
            compoundA: "handbag",
            compoundB: "handshake",
            fullQuestion: "Which word goes in front of both 'bag' and 'shake' to make two compound words?",
            options: ["hand", "sand", "money", "dust", "bean"],
            correctAnswer: "hand",
            explanation: "'Hand' + 'bag' = handbag, and 'hand' + 'shake' = handshake. Body words make great compounds! ✓",
            interactTargetA: "brow",
            interactTargetB: "lash",
            interactFullQuestion: "Which word goes in front of both 'brow' and 'lash' to make two compound words?",
            interactOptions: ["eye", "fore", "hair", "over", "high"],
            interactCorrectAnswer: "eye",
            interactExplanation: "'Eye' + 'brow' = eyebrow, and 'eye' + 'lash' = eyelash. Body words are compound superstars! ✓"
          },
          {
            name: "Hugo",
            scenario: "spotting body word compounds",
            bodyWord: "foot",
            compounds: ["football", "footprint", "footstep", "footpath"],
            targetA: "print",
            targetB: "step",
            compoundA: "footprint",
            compoundB: "footstep",
            fullQuestion: "Which word goes in front of both 'print' and 'step' to make two compound words?",
            options: ["foot", "finger", "door", "quick", "side"],
            correctAnswer: "foot",
            explanation: "'Foot' + 'print' = footprint, and 'foot' + 'step' = footstep. Both relate to walking! ✓",
            interactTargetA: "band",
            interactTargetB: "light",
            interactFullQuestion: "Which word goes in front of both 'band' and 'light' to make two compound words?",
            interactOptions: ["head", "arm", "flash", "wrist", "spot"],
            interactCorrectAnswer: "head",
            interactExplanation: "'Head' + 'band' = headband, and 'head' + 'light' = headlight. Head makes many compound words! ✓"
          },
          {
            name: "Ella",
            scenario: "practising body compound words for VR",
            bodyWord: "eye",
            compounds: ["eyebrow", "eyelash", "eyesight", "eyelid"],
            targetA: "brow",
            targetB: "lash",
            compoundA: "eyebrow",
            compoundB: "eyelash",
            fullQuestion: "Which word goes in front of both 'brow' and 'lash' to make two compound words?",
            options: ["eye", "fore", "hair", "over", "high"],
            correctAnswer: "eye",
            explanation: "'Eye' + 'brow' = eyebrow, and 'eye' + 'lash' = eyelash. Both are parts of the face! ✓",
            interactTargetA: "bag",
            interactTargetB: "writing",
            interactFullQuestion: "Which word goes in front of both 'bag' and 'writing' to make two compound words?",
            interactOptions: ["hand", "sand", "money", "dust", "type"],
            interactCorrectAnswer: "hand",
            interactExplanation: "'Hand' + 'bag' = handbag, and 'hand' + 'writing' = handwriting. Both use the body word 'hand'! ✓"
          },
          {
            name: "Ben",
            scenario: "working through body compound word questions",
            bodyWord: "head",
            compounds: ["headband", "headlight", "headline", "headache"],
            targetA: "band",
            targetB: "light",
            compoundA: "headband",
            compoundB: "headlight",
            fullQuestion: "Which word goes in front of both 'band' and 'light' to make two compound words?",
            options: ["head", "arm", "flash", "wrist", "spot"],
            correctAnswer: "head",
            explanation: "'Head' + 'band' = headband, and 'head' + 'light' = headlight. Head makes many compound words! ✓",
            interactTargetA: "print",
            interactTargetB: "path",
            interactFullQuestion: "Which word goes in front of both 'print' and 'path' to make two compound words?",
            interactOptions: ["foot", "finger", "door", "quick", "side"],
            interactCorrectAnswer: "foot",
            interactExplanation: "'Foot' + 'print' = footprint, and 'foot' + 'path' = footpath. Both relate to walking! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Compound words with "${v.bodyWord}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Body part words are another group of compound word superstars! **"${v.bodyWord}"** alone makes: ${v.compounds.join(", ")}.\n\nNext time you see a compound question, check the options — a body part word might be hiding in there!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.bodyWord.split(''),
                group2: v.targetA.split(''),
                resultWord: v.compoundA,
                label: `"${v.bodyWord}" is a compound builder!`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Body words = compound gold",
            body: (v) => `Let's try **"${v.bodyWord}"** with **"${v.targetA}"** and **"${v.targetB}"**. Body words like head, hand, foot and eye pop up all the time in compound word questions. Once you know their families, you'll spot the answer in seconds!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.bodyWord}" + "${v.targetA}" = ${v.compoundA}`, why: "Say it — yes, that's a real word!" },
                  { text: `"${v.bodyWord}" + "${v.targetB}" = ${v.compoundB}`, why: "Works with both target words!" },
                  { text: `"${v.bodyWord}" family: ${v.compounds.join(", ")}`, why: "The more you know, the faster you'll spot them ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "head", right: "headband" },
                { left: "hand", right: "handshake" },
                { left: "foot", right: "football" },
                { left: "eye", right: "eyebrow" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}\n\nThink: could a body part word be the answer?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactTargetA} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactTargetB} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "Your body word cheat sheet",
            body: () => `Fantastic! Here are the body word families to keep in your back pocket:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "HEAD: headband, headlight, headline, headache", why: "Head goes in front" },
                  { text: "HAND: handbag, handshake, handwriting, handful", why: "Hand goes in front" },
                  { text: "FOOT: football, footprint, footstep, footpath", why: "Body words are compound superstars ✓" }
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
  // SUB-CONCEPT 5: Home Compounds
  // Category: supporting
  // ==========================================
  {
    id: "home-compounds",
    name: "Home & Building Compound Words",
    category: "supporting",
    lessons: [
      {
        id: "home-compounds-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why home and building words like door, house and room are great compound builders",
          "How to spot house and room compound families quickly in the exam"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "learning home compound words",
            homeWord: "door",
            compounds: ["doorbell", "doorstep", "doorway", "doorknob"],
            targetA: "bell",
            targetB: "step",
            compoundA: "doorbell",
            compoundB: "doorstep",
            fullQuestion: "Which word goes in front of both 'bell' and 'step' to make two compound words?",
            options: ["door", "blue", "dumb", "cow", "hand"],
            correctAnswer: "door",
            explanation: "'Door' + 'bell' = doorbell, and 'door' + 'step' = doorstep. Both relate to the entrance of a house! ✓",
            interactHomeWord: "book",
            interactTargetA: "shelf",
            interactTargetB: "worm",
            interactFullQuestion: "Which word goes in front of both 'shelf' and 'worm' to make two compound words?",
            interactOptions: ["book", "inch", "silk", "earth", "glow"],
            interactCorrectAnswer: "book",
            interactExplanation: "'Book' + 'shelf' = bookshelf, and 'book' + 'worm' = bookworm. Both use 'book' at the front! ✓"
          },
          {
            name: "Oliver",
            scenario: "practising home-related compound words",
            homeWord: "house",
            compounds: ["household", "housekeeper", "housework", "housewife"],
            targetA: "work",
            targetB: "keeper",
            compoundA: "housework",
            compoundB: "housekeeper",
            fullQuestion: "Which word goes in front of both 'work' and 'keeper' to make two compound words?",
            options: ["house", "home", "shop", "time", "book"],
            correctAnswer: "house",
            explanation: "'House' + 'work' = housework, and 'house' + 'keeper' = housekeeper. Both relate to managing a home! ✓",
            interactHomeWord: "door",
            interactTargetA: "way",
            interactTargetB: "knob",
            interactFullQuestion: "Which word goes in front of both 'way' and 'knob' to make two compound words?",
            interactOptions: ["door", "hall", "gate", "path", "stair"],
            interactCorrectAnswer: "door",
            interactExplanation: "'Door' + 'way' = doorway, and 'door' + 'knob' = doorknob. Both relate to the entrance of a house! ✓"
          },
          {
            name: "Priya",
            scenario: "spotting room-based compound words",
            homeWord: "room",
            targetWordsFlipped: true,
            compounds: ["bedroom", "classroom", "bathroom", "mushroom"],
            targetA: "bed",
            targetB: "class",
            compoundA: "bedroom",
            compoundB: "classroom",
            fullQuestion: "Which word goes after both 'bed' and 'class' to make two compound words?",
            options: ["room", "time", "side", "sheet", "mate"],
            correctAnswer: "room",
            explanation: "'Bed' + 'room' = bedroom, and 'class' + 'room' = classroom. Room goes at the end! ✓",
            interactHomeWord: "house",
            interactTargetA: "hold",
            interactTargetB: "wife",
            interactFullQuestion: "Which word goes in front of both 'hold' and 'wife' to make two compound words?",
            interactOptions: ["house", "home", "shop", "time", "farm"],
            interactCorrectAnswer: "house",
            interactExplanation: "'House' + 'hold' = household, and 'house' + 'wife' = housewife. Both relate to managing a home! ✓"
          },
          {
            name: "Finn",
            scenario: "building up his home compound word bank",
            homeWord: "book",
            compounds: ["bookshelf", "bookmark", "bookcase", "bookworm"],
            targetA: "shelf",
            targetB: "worm",
            compoundA: "bookshelf",
            compoundB: "bookworm",
            fullQuestion: "Which word goes in front of both 'shelf' and 'worm' to make two compound words?",
            options: ["book", "inch", "silk", "earth", "glow"],
            correctAnswer: "book",
            explanation: "'Book' + 'shelf' = bookshelf, and 'book' + 'worm' = bookworm. Both use 'book' at the front! ✓",
            interactHomeWord: "fire",
            interactTargetA: "place",
            interactTargetB: "work",
            interactFullQuestion: "Which word goes in front of both 'place' and 'work' to make two compound words?",
            interactOptions: ["fire", "home", "net", "frame", "work"],
            interactCorrectAnswer: "fire",
            interactExplanation: "'Fire' + 'place' = fireplace, and 'fire' + 'work' = firework. Both use 'fire' at the front! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Compound words with "${v.homeWord}"`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Words about **homes and buildings** are another set of compound word champions! **"${v.homeWord}"** alone makes: ${v.compounds.join(", ")}.\n\nLet's learn how to spot these in a flash.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.homeWord.split(''),
                group2: v.targetA.split(''),
                resultWord: v.compoundA,
                label: `"${v.homeWord}" is a compound builder!`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Home words love making compounds",
            body: (v) => `Let's try **"${v.homeWord}"** with **"${v.targetA}"** and **"${v.targetB}"**. Home-related words like door, house, room and book are really common in compound word questions — think of all the things you see around the house every day!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.homeWord}" + "${v.targetA}" = ${v.compoundA}`, why: "Say it — real word!" },
                  { text: `"${v.homeWord}" + "${v.targetB}" = ${v.compoundB}`, why: "Works with both!" },
                  { text: `Also: ${v.compounds[2]}, ${v.compounds[3]}`, why: "The more compounds you know, the faster you are ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `? + ${v.interactTargetA} = ???`, why: `Must make a real compound word` },
                  { text: `? + ${v.interactTargetB} = ???`, why: `The SAME word must work here too!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "Your home compound toolkit",
            body: () => `Great job! Here are the home and building families to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "DOOR: doorbell, doorstep, doorway, doorknob", why: "Door goes in front" },
                  { text: "HOUSE: household, housekeeper, housework", why: "House goes in front" },
                  { text: "ROOM: bedroom, classroom, bathroom, mushroom", why: "Room usually goes at the end ✓" }
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
  // SUB-CONCEPT 6: Common Traps
  // Category: supporting
  // ==========================================
  {
    id: "common-traps",
    name: "Common Compound Word Traps",
    category: "supporting",
    lessons: [
      {
        id: "common-traps-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The sneaky imposters: words that LOOK like compounds but totally aren't (is 'carpet' really 'car' + 'pet'?!)",
          "A quick meaning test that tells you if a compound is real or fake"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning about fake compound words",
            fakeCompound: "carpet",
            fakePart1: "car",
            fakePart2: "pet",
            whyFake: "'Carpet' is NOT 'car' + 'pet' — it has nothing to do with cars or pets! It comes from a completely different word origin.",
            realCompound: "carpark",
            realPart1: "car",
            realPart2: "park",
            whyReal: "'Carpark' IS a real compound: 'car' + 'park' — a place where you park cars",
            fullQuestion: "Which of these is a REAL compound word made from 'car' + another word?",
            options: ["carpark", "carpet", "carrot", "carbon", "carol"],
            correctAnswer: "carpark",
            explanation: "'Car' + 'park' = carpark — a place to park cars. 'Carpet' looks like car+pet, but it's actually one word with a completely different meaning. ✓",
            interactFakeCompound: "butter",
            interactRealPart1: "butter",
            interactFullQuestion: "Which of these is a REAL compound word using 'butter'?",
            interactOptions: ["buttercup", "butterfly", "button", "butler", "buttery"],
            interactCorrectAnswer: "buttercup",
            interactExplanation: "'Butter' + 'cup' = buttercup — a yellow wildflower. The meaning comes from both parts! ✓"
          },
          {
            name: "Ben",
            scenario: "spotting fake compound words",
            fakeCompound: "butter",
            fakePart1: "but",
            fakePart2: "ter",
            whyFake: "'Butter' is NOT 'but' + 'ter' — 'ter' isn't even a word! Just because letters match doesn't make it a compound.",
            realCompound: "buttercup",
            realPart1: "butter",
            realPart2: "cup",
            whyReal: "'Buttercup' IS a real compound: 'butter' + 'cup' — a yellow flower",
            fullQuestion: "Which of these is a REAL compound word using 'butter'?",
            options: ["buttercup", "butterfly", "button", "butler", "buttery"],
            correctAnswer: "buttercup",
            explanation: "'Butter' + 'cup' = buttercup — a yellow wildflower. Interestingly, 'butterfly' ALSO started as a compound word! ✓",
            interactFakeCompound: "season",
            interactRealPart1: "sea",
            interactFullQuestion: "Which of these is a REAL compound word made from 'sea' + another word?",
            interactOptions: ["seashell", "season", "search", "seal", "seat"],
            interactCorrectAnswer: "seashell",
            interactExplanation: "'Sea' + 'shell' = seashell — a shell from the sea. 'Season' just happens to start with 'sea' but isn't a compound word. ✓"
          },
          {
            name: "Charlie",
            scenario: "learning to tell real from fake compounds",
            fakeCompound: "manage",
            fakePart1: "man",
            fakePart2: "age",
            whyFake: "'Manage' is NOT 'man' + 'age' — it doesn't mean a man's age! The meaning doesn't come from the two parts.",
            realCompound: "manhole",
            realPart1: "man",
            realPart2: "hole",
            whyReal: "'Manhole' IS a real compound: 'man' + 'hole' — a hole for a person to access underground pipes",
            fullQuestion: "Which of these is a REAL compound word made from 'man' + another word?",
            options: ["manhole", "manage", "manner", "mango", "mandate"],
            correctAnswer: "manhole",
            explanation: "'Man' + 'hole' = manhole — a hole big enough for a person. 'Manage' contains 'man' and 'age' but isn't a compound word. ✓",
            interactFakeCompound: "carpet",
            interactRealPart1: "car",
            interactFullQuestion: "Which of these is a REAL compound word made from 'car' + another word?",
            interactOptions: ["carpark", "carpet", "carrot", "carbon", "carol"],
            interactCorrectAnswer: "carpark",
            interactExplanation: "'Car' + 'park' = carpark — a place to park cars. 'Carpet' looks like car+pet, but it's just one word! ✓"
          },
          {
            name: "Ella",
            scenario: "avoiding compound word traps",
            fakeCompound: "season",
            fakePart1: "sea",
            fakePart2: "son",
            whyFake: "'Season' is NOT 'sea' + 'son' — it has nothing to do with the sea or a son! It's just one word that happens to contain those letters.",
            realCompound: "seashell",
            realPart1: "sea",
            realPart2: "shell",
            whyReal: "'Seashell' IS a real compound: 'sea' + 'shell' — a shell found at the sea",
            fullQuestion: "Which of these is a REAL compound word made from 'sea' + another word?",
            options: ["seashell", "season", "search", "seal", "seat"],
            correctAnswer: "seashell",
            explanation: "'Sea' + 'shell' = seashell — a shell from the sea. 'Season' just happens to start with 'sea' but isn't a compound word. ✓",
            interactFakeCompound: "manage",
            interactRealPart1: "man",
            interactFullQuestion: "Which of these is a REAL compound word made from 'man' + another word?",
            interactOptions: ["manhole", "manage", "manner", "mango", "mandate"],
            interactCorrectAnswer: "manhole",
            interactExplanation: "'Man' + 'hole' = manhole — a hole big enough for a person. 'Manage' just happens to contain 'man' but isn't a compound word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.fakeCompound}" really a compound word?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a brain-tickler: some words LOOK like they're made of two smaller words, but they're actually imposters! **"${v.fakeCompound}"** looks like it could be **"${v.fakePart1}"** + **"${v.fakePart2}"**.\n\nBut is it really? Let's bust this myth!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.fakePart1.split(''),
                group2: v.fakePart2.split(''),
                resultWord: v.fakeCompound,
                label: `Is "${v.fakeCompound}" really "${v.fakePart1}" + "${v.fakePart2}"?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The meaning test — your fake-detector",
            body: (v) => `So is **"${v.fakeCompound}"** a real compound word? Here's the test: a REAL compound word's meaning comes from BOTH its parts. If the meaning doesn't connect to both halves, it's an imposter!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `FAKE: "${v.fakeCompound}" ≠ "${v.fakePart1}" + "${v.fakePart2}"`, why: v.whyFake },
                  { text: `REAL: "${v.realCompound}" = "${v.realPart1}" + "${v.realPart2}"`, why: v.whyReal },
                  { text: "Real compounds: meaning comes from BOTH parts", why: "A seashell IS a shell from the sea ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A real compound word gets its meaning from ____ of its parts`,
              options: (v) => ["both", "one", "neither", "the longest"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A real compound word's meaning comes from BOTH parts. ✓`,
                incorrect: (v) => `Not quite — a real compound word's meaning must come from BOTH of its parts!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.interactFullQuestion}\n\nRemember: the meaning must come from BOTH parts!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.interactRealPart1.split(''),
                group2: "?".split(''),
                resultWord: "",
                label: `"${v.interactRealPart1}" + ? = real compound:`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.interactFullQuestion,
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
            title: () => "You can spot the fakes now!",
            body: () => `Well done — you've got the fake-detecting superpower! Here's how it works:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Real: seashell = shell from the sea", why: "Meaning comes from BOTH parts" },
                  { text: "Fake: carpet ≠ car + pet", why: "Nothing to do with cars or pets!" },
                  { text: "The meaning test: do both halves contribute?", why: "If not, it just looks like a compound ✓" }
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
  // SUB-CONCEPT 7: Three-Way Links
  // Category: other
  // ==========================================
  {
    id: "three-way-links",
    name: "Three-Way Compound Links",
    category: "other",
    lessons: [
      {
        id: "three-way-links-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find ONE word that links with three others — like finding the centre of a web!",
          "A step-by-step testing method so you never get stuck"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "finding a word that links three others",
            targetWords: ["light", "rise", "flower"],
            linkWord: "sun",
            compounds: ["sunlight", "sunrise", "sunflower"],
            fullQuestion: "Which ONE word makes a compound with all three: 'light', 'rise', and 'flower'?",
            options: ["sun", "moon", "star", "day", "corn"],
            correctAnswer: "sun",
            explanation: "'Sun' + 'light' = sunlight, 'sun' + 'rise' = sunrise, 'sun' + 'flower' = sunflower. Sun links all three! ✓",
            interactTargetWords: ["ground", "water", "wear"],
            interactFullQuestion: "Which ONE word makes a compound with all three: 'ground', 'water', and 'wear'?",
            interactOptions: ["under", "over", "back", "out", "down"],
            interactCorrectAnswer: "under",
            interactExplanation: "'Under' + 'ground' = underground, 'under' + 'water' = underwater, 'under' + 'wear' = underwear. Under links all three! ✓"
          },
          {
            name: "Oliver",
            scenario: "tackling a three-way compound question",
            targetWords: ["ground", "water", "wear"],
            linkWord: "under",
            compounds: ["underground", "underwater", "underwear"],
            fullQuestion: "Which ONE word makes a compound with all three: 'ground', 'water', and 'wear'?",
            options: ["under", "over", "back", "out", "down"],
            correctAnswer: "under",
            explanation: "'Under' + 'ground' = underground, 'under' + 'water' = underwater, 'under' + 'wear' = underwear. Under links all three! ✓",
            interactTargetWords: ["coat", "night", "come"],
            interactFullQuestion: "Which ONE word makes a compound with all three: 'coat', 'night', and 'come'?",
            interactOptions: ["over", "under", "out", "rain", "top"],
            interactCorrectAnswer: "over",
            interactExplanation: "'Over' + 'coat' = overcoat, 'over' + 'night' = overnight, 'over' + 'come' = overcome. Over links all three! ✓"
          },
          {
            name: "Priya",
            scenario: "working on a tricky three-link question",
            targetWords: ["coat", "night", "come"],
            linkWord: "over",
            compounds: ["overcoat", "overnight", "overcome"],
            fullQuestion: "Which ONE word makes a compound with all three: 'coat', 'night', and 'come'?",
            options: ["over", "under", "out", "rain", "top"],
            correctAnswer: "over",
            explanation: "'Over' + 'coat' = overcoat, 'over' + 'night' = overnight, 'over' + 'come' = overcome. Over links all three! ✓",
            interactTargetWords: ["print", "step", "note"],
            interactFullQuestion: "Which ONE word makes a compound with all three: 'print', 'step', and 'note'?",
            interactOptions: ["foot", "hand", "side", "finger", "key"],
            interactCorrectAnswer: "foot",
            interactExplanation: "'Foot' + 'print' = footprint, 'foot' + 'step' = footstep, 'foot' + 'note' = footnote. Foot links all three! ✓"
          },
          {
            name: "Finn",
            scenario: "finding the word that connects three compound words",
            targetWords: ["print", "step", "note"],
            linkWord: "foot",
            compounds: ["footprint", "footstep", "footnote"],
            fullQuestion: "Which ONE word makes a compound with all three: 'print', 'step', and 'note'?",
            options: ["foot", "hand", "side", "finger", "key"],
            correctAnswer: "foot",
            explanation: "'Foot' + 'print' = footprint, 'foot' + 'step' = footstep, 'foot' + 'note' = footnote. Foot links all three! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `One word, THREE compounds!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThis one's a bit trickier — you need to find ONE word that makes a compound with **all three** given words. It's like finding the one puzzle piece that connects everything!\n\nWhich word goes with **"${v.targetWords[0]}"**, **"${v.targetWords[1]}"**, AND **"${v.targetWords[2]}"**?`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nThis one's a bit trickier — you need to find ONE word that makes a compound with **all three** given words. It's like finding the one puzzle piece that connects everything!\n\nWhich word goes with **"${v.targetWords[0]}"**, **"${v.targetWords[1]}"**, AND **"${v.targetWords[2]}"**?` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[0].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[0]}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[1].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[1]}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[2].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[2]}" = ?`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Test each option against ALL three",
            body: (v) => `We need a word that works with **"${v.targetWords[0]}"**, **"${v.targetWords[1]}"**, and **"${v.targetWords[2]}"**. Try each option with all three target words — the right answer must make a real compound word with **every single one**. No shortcuts here!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.linkWord}" + "${v.targetWords[0]}" = ${v.compounds[0]}`, why: "First target — real word!" },
                  { text: `"${v.linkWord}" + "${v.targetWords[1]}" = ${v.compounds[1]}`, why: "Second target — also works!" },
                  { text: `"${v.linkWord}" + "${v.targetWords[2]}" = ${v.compounds[2]}`, why: "All three work — that's the answer! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.fullQuestion}\n\nTest each option against ALL three words!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.fullQuestion}\n\nTest each option against ALL three words!` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[0].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[0]}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[1].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[1]}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetWords[2].split(''),
                resultWord: "",
                label: `? + "${v.targetWords[2]}" = ?`
              })}
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.fullQuestion,
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
            title: () => "Three-way links — you've got this!",
            body: () => `Brilliant work! For three-way compound questions, just follow these steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try each option with the FIRST target word", why: "Does it make a real compound?" },
                  { text: "2. If yes, try it with the SECOND and THIRD", why: "It must work with ALL of them" },
                  { text: "3. If any pairing fails, move to the next option", why: "Keep going until all three work ✓" }
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
  // SUB-CONCEPT 8: Reverse Compounds
  // Category: other
  // ==========================================
  {
    id: "reverse-compounds",
    name: "Reverse Compounds — Split the Word",
    category: "other",
    lessons: [
      {
        id: "reverse-compounds-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to split a compound word back into its two parts — like cracking a code!",
          "A split-and-check method that makes reverse questions feel easy"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "practising splitting compound words",
            compound: "playground",
            part1: "play",
            part2: "ground",
            meaning: "a ground (area) where you play",
            wrongSplit1: "pla + yground",
            wrongSplit2: "play + grou + nd",
            fullQuestion: "How does 'playground' split into two words?",
            options: ["play + ground", "pla + yground", "plays + round", "player + ound", "play + gr + ound"],
            correctAnswer: "play + ground",
            explanation: "'Playground' splits into 'play' + 'ground' — an area (ground) where children play. Both halves are real words! ✓"
          },
          {
            name: "Hugo",
            scenario: "breaking compound words apart",
            compound: "butterfly",
            part1: "butter",
            part2: "fly",
            meaning: "a flying insect (named after its butter-yellow colour)",
            wrongSplit1: "but + terfly",
            wrongSplit2: "butt + erfly",
            fullQuestion: "How does 'butterfly' split into two words?",
            options: ["butter + fly", "but + terfly", "butt + erfly", "butterf + ly", "bu + tterfly"],
            correctAnswer: "butter + fly",
            explanation: "'Butterfly' splits into 'butter' + 'fly' — both are real English words! ✓"
          },
          {
            name: "Ella",
            scenario: "learning to take compound words apart",
            compound: "blackberry",
            part1: "black",
            part2: "berry",
            meaning: "a dark-coloured berry",
            wrongSplit1: "bla + ckberry",
            wrongSplit2: "blac + kberry",
            fullQuestion: "How does 'blackberry' split into two words?",
            options: ["black + berry", "bla + ckberry", "blac + kberry", "blackb + erry", "blackbe + rry"],
            correctAnswer: "black + berry",
            explanation: "'Blackberry' splits into 'black' + 'berry' — a berry that is dark (black) in colour. Both halves are real words! ✓"
          },
          {
            name: "Ben",
            scenario: "getting faster at splitting compounds",
            compound: "toothbrush",
            part1: "tooth",
            part2: "brush",
            meaning: "a brush for cleaning your teeth",
            wrongSplit1: "too + thbrush",
            wrongSplit2: "toothb + rush",
            fullQuestion: "How does 'toothbrush' split into two words?",
            options: ["tooth + brush", "too + thbrush", "toothb + rush", "toot + hbrush", "to + othbrush"],
            correctAnswer: "tooth + brush",
            explanation: "'Toothbrush' splits into 'tooth' + 'brush' — a brush for your teeth. Both halves are real words! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you split "${v.compound}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's a fun twist — sometimes the question works **backwards**! You're given a compound word and you need to crack it apart into its two pieces.\n\nWhere does **"${v.compound}"** split?`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.compound.split(''),
                label: `Split "${v.compound}" into two words:`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Split and check — crack it open!",
            body: (v) => `Let's split the word **"${v.compound}"**. Your mission: find the exact point where it divides into **two real words**. Both halves must be genuine English words!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.compound}" — where's the split?`, why: "Look for two real words hiding inside" },
                  { text: `"${v.part1}" + "${v.part2}" = ${v.compound}`, why: `Both are real words: "${v.part1}" and "${v.part2}"` },
                  { text: `Meaning: ${v.meaning}`, why: "The meaning comes from both parts ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A compound word is made of ____ smaller words joined together`,
              options: (v) => ["two", "three", "one", "four"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A compound word is two smaller words joined together. ✓`,
                incorrect: (v) => `Not quite — a compound word is made of TWO smaller words joined together!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.fullQuestion}\n\nRemember: both halves must be real English words!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "word",
                letters: v.compound.split(''),
                label: `Where does "${v.compound}" split?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.fullQuestion,
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
            title: () => "Compound splitter — level unlocked!",
            body: () => `You're getting really good at this! To split any compound word:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look for a natural split point", why: "Where could two real words be hiding?" },
                  { text: "2. Check BOTH halves are real words", why: "'play' and 'ground' — yes! 'pla' and 'yground' — no!" },
                  { text: "3. Check the meaning connects both parts", why: "A playground IS a ground for playing ✓" }
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
  // SUB-CONCEPT 9: Direction & Position Compounds
  // Category: other
  // ==========================================
  {
    id: "direction-compounds",
    name: "Direction & Position Compounds",
    category: "other",
    lessons: [
      {
        id: "direction-compounds-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why direction words like over, under, out, up and down are compound-making machines",
          "How knowing these gives you a massive head start in the exam"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "learning direction compound words",
            directionWord: "over",
            compounds: ["overcoat", "overnight", "overcome", "overlook"],
            targetA: "coat",
            targetB: "night",
            compoundA: "overcoat",
            compoundB: "overnight",
            fullQuestion: "Which word goes in front of both 'coat' and 'night' to make two compound words?",
            options: ["over", "under", "top", "rain", "bed"],
            correctAnswer: "over",
            explanation: "'Over' + 'coat' = overcoat, and 'over' + 'night' = overnight. Direction words make great compounds! ✓"
          },
          {
            name: "Charlie",
            scenario: "practising direction compounds",
            directionWord: "under",
            compounds: ["underground", "underwater", "understand", "underwear"],
            targetA: "ground",
            targetB: "water",
            compoundA: "underground",
            compoundB: "underwater",
            fullQuestion: "Which word goes in front of both 'ground' and 'water' to make two compound words?",
            options: ["under", "up", "above", "below", "out"],
            correctAnswer: "under",
            explanation: "'Under' + 'ground' = underground, and 'under' + 'water' = underwater. Under is very versatile! ✓"
          },
          {
            name: "Daisy",
            scenario: "working on direction compound words",
            directionWord: "out",
            compounds: ["outbreak", "outgoing", "outline", "outright"],
            targetA: "break",
            targetB: "going",
            compoundA: "outbreak",
            compoundB: "outgoing",
            fullQuestion: "Which word goes in front of both 'break' and 'going' to make two compound words?",
            options: ["out", "in", "up", "back", "down"],
            correctAnswer: "out",
            explanation: "'Out' + 'break' = outbreak, and 'out' + 'going' = outgoing. Out forms many compound words! ✓"
          },
          {
            name: "Hugo",
            scenario: "spotting direction words in compound questions",
            directionWord: "down",
            compounds: ["downhill", "downstairs", "download", "downtown"],
            targetA: "hill",
            targetB: "stairs",
            compoundA: "downhill",
            compoundB: "downstairs",
            fullQuestion: "Which word goes in front of both 'hill' and 'stairs' to make two compound words?",
            options: ["down", "up", "over", "top", "back"],
            correctAnswer: "down",
            explanation: "'Down' + 'hill' = downhill, and 'down' + 'stairs' = downstairs. Both describe going in a downward direction! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Direction words are compound superstars!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**Did you know?** Words like **over, under, out, up, down** are some of the busiest compound-makers in the whole of English! **"${v.directionWord}"** alone makes: ${v.compounds.join(", ")}.\n\nSpotting a direction word in the options? That's often your answer!`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.directionWord.split(''),
                group2: v.targetA.split(''),
                resultWord: v.compoundA,
                label: `"${v.directionWord}" is a compound superstar!`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Direction words = quick wins",
            body: (v) => `Let's try **"${v.directionWord}"** with **"${v.targetA}"** and **"${v.targetB}"**. Direction words like over, under, out, up, down and back pop up ALL the time in compound questions. Spot one in the options? Try it first!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.directionWord}" + "${v.targetA}" = ${v.compoundA}`, why: "Say it — real word!" },
                  { text: `"${v.directionWord}" + "${v.targetB}" = ${v.compoundB}`, why: "Works with both!" },
                  { text: `Also: ${v.compounds[2]}, ${v.compounds[3]}`, why: "Direction words are incredibly versatile ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.fullQuestion}\n\nCheck the options — is there a direction word?`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.fullQuestion}\n\nCheck the options — is there a direction word?` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetA.split(''),
                resultWord: "",
                label: `? + "${v.targetA}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetB.split(''),
                resultWord: "",
                label: `? + "${v.targetB}" = ?`
              })}
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.fullQuestion,
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
            title: () => "Your direction word power-ups",
            body: () => `Excellent! These direction compound families are your ticket to fast answers:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "OVER: overcoat, overnight, overcome, overlook", why: "Over goes in front" },
                  { text: "UNDER: underground, underwater, understand", why: "Under goes in front" },
                  { text: "OUT: outside, outdoor, outline, outright", why: "Direction words are easy wins ✓" }
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
  // SUB-CONCEPT 10: Speed Strategy
  // Category: other
  // ==========================================
  {
    id: "speed-strategy",
    name: "Speed Strategy — Quick Compound Solving",
    category: "other",
    lessons: [
      {
        id: "speed-strategy-steps",
        templateType: "step-by-step",
        learningGoal: [
          "A speed strategy for compound questions so you can blitz through them in the exam",
          "Which options to test first — because smart order saves precious seconds"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "learning to solve compound words quickly",
            targetA: "card",
            targetB: "man",
            options: ["mail", "post", "milk", "door", "dust"],
            correctAnswer: "post",
            compound1: "postcard",
            compound2: "postman",
            shortWords: "post, mail",
            longWords: "milk, door, dust",
            fullQuestion: "Which word goes in front of both 'card' and 'man'?",
            explanation: "'Post' + 'card' = postcard, and 'post' + 'man' = postman. Testing common short words first saves time! ✓",
            intTargetA: "light",
            intTargetB: "shine",
            intOptions: ["moon", "star", "lamp", "flash", "glow"],
            intCorrectAnswer: "moon",
            intCompound1: "moonlight",
            intCompound2: "moonshine",
            intFullQuestion: "Which word goes in front of both 'light' and 'shine'?",
            intExplanation: "'Moon' + 'light' = moonlight, and 'moon' + 'shine' = moonshine. Nature words are common compound-makers! ✓"
          },
          {
            name: "Marcus",
            scenario: "speeding up his compound word solving",
            targetA: "road",
            targetB: "word",
            options: ["cross", "skate", "paste", "card", "dart"],
            correctAnswer: "cross",
            compound1: "crossroad",
            compound2: "crossword",
            shortWords: "cross, card",
            longWords: "skate, paste, dart",
            fullQuestion: "Which word goes in front of both 'road' and 'word'?",
            explanation: "'Cross' + 'road' = crossroad, and 'cross' + 'word' = crossword. Both are real compound words. ✓",
            intTargetA: "fall",
            intTargetB: "proof",
            intOptions: ["water", "light", "snow", "cloud", "storm"],
            intCorrectAnswer: "water",
            intCompound1: "waterfall",
            intCompound2: "waterproof",
            intFullQuestion: "Which word goes in front of both 'fall' and 'proof'?",
            intExplanation: "'Water' + 'fall' = waterfall, and 'water' + 'proof' = waterproof. Both are everyday compound words. ✓"
          },
          {
            name: "Aisha",
            scenario: "racing through a VR paper",
            targetA: "port",
            targetB: "craft",
            options: ["air", "sea", "war", "ship", "space"],
            correctAnswer: "air",
            compound1: "airport",
            compound2: "aircraft",
            shortWords: "air, sea, war",
            longWords: "ship, space",
            fullQuestion: "Which word goes in front of both 'port' and 'craft'?",
            explanation: "'Air' + 'port' = airport, and 'air' + 'craft' = aircraft. Short, common words are often the answer! ✓",
            intTargetA: "berry",
            intTargetB: "bird",
            intOptions: ["black", "blue", "red", "green", "gold"],
            intCorrectAnswer: "black",
            intCompound1: "blackberry",
            intCompound2: "blackbird",
            intFullQuestion: "Which word goes in front of both 'berry' and 'bird'?",
            intExplanation: "'Black' + 'berry' = blackberry, and 'black' + 'bird' = blackbird. Colour words make great compound words! ✓"
          },
          {
            name: "Charlie",
            scenario: "finishing his VR test on time",
            targetA: "thing",
            targetB: "where",
            options: ["some", "over", "under", "out", "up"],
            correctAnswer: "some",
            compound1: "something",
            compound2: "somewhere",
            shortWords: "some, out, up",
            longWords: "over, under",
            fullQuestion: "Which word goes in front of both 'thing' and 'where'?",
            explanation: "'Some' + 'thing' = something, and 'some' + 'where' = somewhere. Both are very common compound words. ✓",
            intTargetA: "side",
            intTargetB: "doors",
            intOptions: ["out", "in", "up", "back", "down"],
            intCorrectAnswer: "out",
            intCompound1: "outside",
            intCompound2: "outdoors",
            intFullQuestion: "Which word goes in front of both 'side' and 'doors'?",
            intExplanation: "'Out' + 'side' = outside, and 'out' + 'doors' = outdoors. Direction words like 'out' are very common compound-makers! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Solve it in seconds!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nIn the real exam, every second counts! The secret? Don't test all five options randomly — be smart about which ones you try first.\n\n${v.fullQuestion}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nIn the real exam, every second counts! The secret? Don't test all five options randomly — be smart about which ones you try first.\n\n${v.fullQuestion}` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetA.split(''),
                resultWord: "",
                label: `? + "${v.targetA}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.targetB.split(''),
                resultWord: "",
                label: `? + "${v.targetB}" = ?`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "The speed strategy — work smart!",
            body: (v) => `We need a word for **"${v.targetA}"** and **"${v.targetB}"**. Here's the trick: when time is tight, try the most likely answers first! Common short words (sun, rain, hand, foot, over, under) are right way more often than unusual long words.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Step 1: Scan for nature/body/direction words", why: "These are the most common compound-makers" },
                  { text: "Step 2: Test the shortest, most common option first", why: "Short everyday words are usually right" },
                  { text: `Step 3: "${v.correctAnswer}" + "${v.targetA}" = ${v.compound1} ✓`, why: "Found it on the first try!" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — be quick!",
            body: (v) => `${v.intFullQuestion}\n\nScan the options — which looks most likely?`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.intFullQuestion}\n\nScan the options — which looks most likely?` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.intTargetA.split(''),
                resultWord: "",
                label: `? + "${v.intTargetA}" = ?`
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "compound",
                group1: "?".split(''),
                group2: v.intTargetB.split(''),
                resultWord: "",
                label: `? + "${v.intTargetB}" = ?`
              })}
            ],
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intFullQuestion,
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.intExplanation}`,
                incorrect: (v) => `Not quite! The answer is "${v.intCorrectAnswer}". ${v.intExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Speed mode — unlocked!",
            body: () => `You've got the speed strategy now! To solve compound words FAST in the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Scan for common compound-makers first", why: "Nature, body, direction, home words" },
                  { text: "2. Test the most likely option with BOTH targets", why: "Don't check all five — start with the best guess" },
                  { text: "3. If it works with both, move on!", why: "Confidence + speed = more marks ✓" }
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
  // SUB-CONCEPT 11: Compound Pairs (pick-from-sets)
  // Category: core
  // The authentic 11+ exam format: two groups of 3 words,
  // pick one from each to form a compound word
  // ==========================================
  {
    id: "gl-compound-pairs",
    name: "Compound Pairs — Pick From Two Groups",
    category: "core",
    lessons: [
      {
        id: "gl-compound-pairs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to solve the real 11+ compound word format — picking one word from each of two groups",
          "The 3×3 Grid Method: systematically test all 9 combinations to find the one that makes a real word",
          "Why spelling matters more than sound for tricky compounds"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling 11+ compound word questions",
            groupA: ["rain", "silk", "brass"],
            groupB: ["bow", "thread", "ring"],
            correctA: "rain",
            correctB: "bow",
            compound: "rainbow",
            tryFirst: "rain + thread",
            tryFirstResult: "rainthread? Not a word.",
            trySecond: "rain + ring",
            trySecondResult: "rainring? Not a word.",
            tryThird: "rain + bow",
            tryThirdResult: "rainbow — YES! That's a real word!",
            teachTip: "Start with the first word in Group A and test it with each word in Group B",
            interactGroupA: ["cup", "jug", "pot"],
            interactGroupB: ["board", "handle", "lid"],
            interactCorrectA: "cup",
            interactCorrectB: "board",
            interactCompound: "cupboard",
            interactExplanation: "cup + board = cupboard. A cupboard is a piece of furniture for storing things. ✓"
          },
          {
            name: "Jake",
            scenario: "practising the two-group format",
            groupA: ["butter", "cream", "gravy"],
            groupB: ["fly", "jug", "boat"],
            correctA: "butter",
            correctB: "fly",
            compound: "butterfly",
            tryFirst: "butter + jug",
            tryFirstResult: "butterjug? Not a word.",
            trySecond: "butter + boat",
            trySecondResult: "butterboat? Not a word.",
            tryThird: "butter + fly",
            tryThirdResult: "butterfly — YES! That's a real word!",
            teachTip: "Remember: the compound might not sound like the two words put together. 'Butterfly' has nothing to do with butter or flies!",
            interactGroupA: ["horse", "pony", "mule"],
            interactGroupB: ["shoe", "club", "cart"],
            interactCorrectA: "horse",
            interactCorrectB: "shoe",
            interactCompound: "horseshoe",
            interactExplanation: "horse + shoe = horseshoe. A horseshoe is the U-shaped metal on a horse's hoof. ✓"
          },
          {
            name: "Amira",
            scenario: "working through a tricky D3 question",
            groupA: ["habit", "custom", "routine"],
            groupB: ["at", "by", "in"],
            correctA: "habit",
            correctB: "at",
            compound: "habitat",
            tryFirst: "habit + by",
            tryFirstResult: "habitby? Not a word.",
            trySecond: "habit + at",
            trySecondResult: "habitat — WAIT! That IS a word! A habitat is where an animal lives.",
            tryThird: "custom + at",
            tryThirdResult: "custat? Not a word. So habit + at = habitat is our answer!",
            teachTip: "For hard questions, SPELL the combinations out letter by letter. Don't try to say them — 'habit' + 'at' doesn't SOUND like 'habitat', but it SPELLS it!",
            interactGroupA: ["feat", "trick", "stunt"],
            interactGroupB: ["her", "him", "them"],
            interactCorrectA: "feat",
            interactCorrectB: "her",
            interactCompound: "feather",
            interactExplanation: "feat + her = feather. Spell it out: f-e-a-t-h-e-r. The sound changes completely, but the spelling is right! ✓"
          },
          {
            name: "Oscar",
            scenario: "discovering the spelling trick",
            groupA: ["reap", "sow", "plant"],
            groupB: ["pear", "seed", "root"],
            correctA: "reap",
            correctB: "pear",
            compound: "reappear",
            tryFirst: "reap + seed",
            tryFirstResult: "reapseed? Not a word.",
            trySecond: "reap + pear",
            trySecondResult: "reappear! r-e-a-p-p-e-a-r — that means to appear again! Brilliant!",
            tryThird: "This is the exam's favourite trick — the combined word sounds NOTHING like the two parts",
            teachTip: "Always write combinations out or spell them in your head. The hardest 11+ questions use words that sound completely different when joined.",
            interactGroupA: ["band", "belt", "strap"],
            interactGroupB: ["age", "size", "fit"],
            interactCorrectA: "band",
            interactCorrectB: "age",
            interactCompound: "bandage",
            interactExplanation: "band + age = bandage. A bandage covers a wound. The pronunciation shifts from 'band-age' to 'ban-dij'. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name}'s two-group challenge`,
            body: (v) => `${v.name} is ${v.scenario}. This time there are **two groups of words** — pick one from each group to make a single compound word.\n\nGroup A: ( ${v.groupA.join('   ')} )\nGroup B: ( ${v.groupB.join('   ')} )\n\nThat's **9 possible combinations** to check! How do you find the right one quickly?`,
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 3×3 Grid Method",
            body: (v) => `Start with the **first word in Group A** and test it with **each word in Group B**:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Try: ${v.tryFirst}`, why: v.tryFirstResult },
                  { text: `Try: ${v.trySecond}`, why: v.trySecondResult },
                  { text: `Try: ${v.tryThird}`, why: v.tryThirdResult },
                  { text: `✓ Answer: ${v.correctA} + ${v.correctB} = ${v.compound}`, why: v.teachTip }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Spelling Secret",
            body: () => `For **tricky compounds**, the word you make sounds **completely different** from the two parts.\n\nThe 11+ test loves this trick! The key is to **spell combinations out** letter by letter, not say them aloud.`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "compound",
                group1: v.correctA.toUpperCase().split(''),
                group2: v.correctB.toUpperCase().split(''),
                resultWord: v.compound.toUpperCase()
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find two words, one from each group, that join to make a new word.\n\nGroup A: ( ${v.interactGroupA.join('   ')} )\nGroup B: ( ${v.interactGroupB.join('   ')} )`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which combination makes a real compound word?`,
              getOptions: (v) => [
                `${v.interactCorrectA} + ${v.interactCorrectB}`,
                `${v.interactGroupA[1]} + ${v.interactGroupB[0]}`,
                `${v.interactGroupA[2]} + ${v.interactGroupB[1]}`,
                `${v.interactGroupA[0]} + ${v.interactGroupB[2]}`,
                `${v.interactGroupA[2]} + ${v.interactGroupB[2]}`
              ],
              correctAnswer: (v) => `${v.interactCorrectA} + ${v.interactCorrectB}`,
              feedback: {
                correct: (v) => `Well done! ${v.interactCorrectA} + ${v.interactCorrectB} = ${v.interactCompound}. ${v.interactExplanation}`,
                incorrect: (v) => `Not quite! The answer is ${v.interactCorrectA} + ${v.interactCorrectB} = ${v.interactCompound}. ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two-group compound words — sorted!",
            body: () => `You now know how to solve the 11+ compound word format! Remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Start with Group A, word 1", why: "Test it against all 3 Group B words" },
                  { text: "2. Move to Group A, word 2, then 3", why: "Systematically check all 9 combos" },
                  { text: "3. SPELL it, don't SAY it", why: "Hard questions change pronunciation: habit+at = habitat" },
                  { text: "4. Group A word always goes FIRST", why: "Never try Group B word first — the order is fixed" }
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

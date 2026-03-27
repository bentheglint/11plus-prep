// ============================================================
// Supplementary sub-concepts for Hidden Words (Verbal Reasoning)
// To merge: add these to lessonBank.hiddenWords.subConcepts array in lessonData.js
// ============================================================

export const hiddenWordsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Three-One Split
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "three-one-split",
    name: "3+1 Letter Split",
    category: "core",
    lessons: [
      {
        id: "three-one-split-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot hidden words that split 3+1 across word boundaries — it's like finding a secret message!",
          "The trick of checking the last 3 letters of one word joining the first 1 of the next"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "looking for a 3+1 split across a word boundary",
            sentence: "The vitamin extra helped her feel better.",
            clue: "a 4-letter word meaning 'belonging to me'",
            hiddenWord: "MINE",
            splitDisplay: "vitaMIN Extra",
            wordBefore: "vitamin",
            wordAfter: "extra",
            splitType: "3+1",
            options: ["MINE", "VINE", "MINT", "EXIT", "VITA"],
            correctAnswer: "MINE",
            explanation: "The word MINE is hidden across 'vitaMIN' and 'Extra' — MIN(3) + E(1) = MINE, meaning 'belonging to me'. ✓",
            interactSentence: "Aladdin escaped through the window.",
            interactClue: "a 4-letter word meaning 'to eat a meal'",
            interactHiddenWord: "DINE",
            interactWordBefore: "Aladdin",
            interactWordAfter: "escaped",
            interactOptions: ["DINE", "DUNE", "DICE", "DENT", "NINE"],
            interactCorrectAnswer: "DINE",
            interactExplanation: "The word DINE is hidden across 'aladDIN' and 'Escaped' — DIN(3) + E(1) = DINE, meaning 'to eat a meal'. ✓"
          },
          {
            name: "Oliver",
            scenario: "practising 3+1 splits in his VR workbook",
            sentence: "The electric engine hummed loudly.",
            clue: "a 4-letter word meaning 'a grain eaten around the world'",
            hiddenWord: "RICE",
            splitDisplay: "electRIC Engine",
            wordBefore: "electric",
            wordAfter: "engine",
            splitType: "3+1",
            options: ["RICE", "RACE", "RICH", "REEL", "ICED"],
            correctAnswer: "RICE",
            explanation: "The word RICE is hidden across 'electRIC' and 'Engine' — RIC(3) + E(1) = RICE, a grain eaten around the world. ✓",
            interactSentence: "The falcon entered the barn quietly.",
            interactClue: "a 4-letter word meaning 'a shape with a circular base and pointed top'",
            interactHiddenWord: "CONE",
            interactWordBefore: "falcon",
            interactWordAfter: "entered",
            interactOptions: ["CONE", "BONE", "COIN", "CORE", "ONCE"],
            interactCorrectAnswer: "CONE",
            interactExplanation: "The word CONE is hidden across 'falCON' and 'Entered' — CON(3) + E(1) = CONE, a shape with a circular base and pointed top. ✓"
          },
          {
            name: "Priya",
            scenario: "searching for hidden words in a tricky sentence",
            sentence: "She played the violin every morning.",
            clue: "a 4-letter word meaning 'a thin mark drawn on paper'",
            hiddenWord: "LINE",
            splitDisplay: "vioLIN Every",
            wordBefore: "violin",
            wordAfter: "every",
            splitType: "3+1",
            options: ["LINE", "VINE", "LIVE", "LEAN", "LEND"],
            correctAnswer: "LINE",
            explanation: "The word LINE is hidden across 'vioLIN' and 'Every' — LIN(3) + E(1) = LINE, a thin mark drawn on paper. ✓",
            interactSentence: "Darwin explored the islands carefully.",
            interactClue: "a 4-letter word meaning 'an alcoholic drink made from grapes'",
            interactHiddenWord: "WINE",
            interactWordBefore: "Darwin",
            interactWordAfter: "explored",
            interactOptions: ["WINE", "WIND", "WISE", "WIRE", "WIPE"],
            interactCorrectAnswer: "WINE",
            interactExplanation: "The word WINE is hidden across 'darWIN' and 'Explored' — WIN(3) + E(1) = WINE, an alcoholic drink made from grapes. ✓"
          },
          {
            name: "Finn",
            scenario: "sliding his window across word boundaries",
            sentence: "The muffin ended up on the floor.",
            clue: "a 4-letter word meaning 'good quality' or 'not thick'",
            hiddenWord: "FINE",
            splitDisplay: "muFFIN Ended",
            wordBefore: "muffin",
            wordAfter: "ended",
            splitType: "3+1",
            options: ["FINE", "FIND", "FUND", "FEND", "NINE"],
            correctAnswer: "FINE",
            explanation: "The word FINE is hidden across 'muFFIN' and 'Ended' — FIN(3) + E(1) = FINE, meaning 'good quality'. ✓",
            interactSentence: "The ribbon ended in a neat bow.",
            interactClue: "a 4-letter word meaning 'part of a skeleton'",
            interactHiddenWord: "BONE",
            interactWordBefore: "ribbon",
            interactWordAfter: "ended",
            interactOptions: ["BONE", "BORE", "BOND", "TONE", "NONE"],
            interactCorrectAnswer: "BONE",
            interactExplanation: "The word BONE is hidden across 'ribBON' and 'Ended' — BON(3) + E(1) = BONE, part of a skeleton. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot the 3+1 split?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nIn a **3+1 split**, the last **3 letters** of one word join the **first 1 letter** of the next to make a hidden word.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nIn a **3+1 split**, the last **3 letters** of one word join the **first 1 letter** of the next to make a hidden word.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `In "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 3+1 Split — sneaky but findable!",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Grab the last **3 letters** from one word and the **first letter** of the next. Slide your window across and watch the word appear!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Grab the last **3 letters** from one word and the **first letter** of the next. Slide your window across and watch the word appear!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `The hidden word spans these two words` },
                  { text: `Last 3 of "${v.wordBefore}" + first 1 of "${v.wordAfter}"`, why: `Split type: ${v.splitType}` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: true
              })}
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the clue: "${v.clue}"`,
                `Look at the boundary between two words`,
                `Take the last 3 letters of one word + first 1 of the next`,
                `Check: does it spell a word matching the clue?`
              ],
              feedback: {
                correct: (v) => `Perfect! Read the clue, find the boundary, then check the 3+1 split. ✓`,
                incorrect: (v) => `Not quite — start with the clue, then look at word boundaries.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the hidden word using a 3+1 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the hidden word using a 3+1 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.interactWordBefore,
                word2: v.interactWordAfter,
                hiddenWord: v.interactHiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.interactWordBefore + v.interactWordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.interactWordBefore} ${v.interactWordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "3+1 Split — you've cracked it!",
            body: () => `Nice one! Here's your recipe for 3+1 splits:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look at the LAST 3 letters of each word", why: "These form the start of the hidden word" },
                  { text: "2. Add the FIRST letter of the next word", why: "This completes the 4-letter hidden word" },
                  { text: "3. Does it spell a real word matching the clue?", why: "electRIC + Engine = RICE ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "three-one-split-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why 3+1 splits are the sneakiest ones to miss — and how to catch them",
          "Why only checking 2+2 splits will cost you marks"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "reviewing a tricky hidden word question she got wrong",
            sentence: "The muffin ended up on the floor.",
            clue: "a 4-letter word meaning 'good quality'",
            hiddenWord: "FINE",
            splitDisplay: "muFFIN Ended",
            wordBefore: "muffin",
            wordAfter: "ended",
            splitType: "3+1",
            friendWrong: "FUND",
            friendReason: "thought the answer had to use 2 letters from each word",
            whyWrong: "Only checking 2+2 splits means you miss 3+1 combinations like FIN+E = FINE",
            options: ["FINE", "FUND", "FIND", "FEND", "NINE"],
            correctAnswer: "FINE",
            explanation: "The word FINE is hidden across 'muFFIN' and 'Ended' — FIN(3) + E(1) = FINE. Always try ALL split types, not just 2+2. ✓",
            interactSentence: "The baton entered the relay race.",
            interactClue: "a 4-letter word meaning 'a musical sound'",
            interactHiddenWord: "TONE",
            interactWordBefore: "baton",
            interactWordAfter: "entered",
            interactOptions: ["TONE", "BONE", "TUNE", "NOTE", "TENT"],
            interactCorrectAnswer: "TONE",
            interactExplanation: "The word TONE is hidden across 'baTON' and 'Entered' — TON(3) + E(1) = TONE, a musical sound. ✓"
          },
          {
            name: "Marcus",
            scenario: "checking why he missed a hidden word question",
            sentence: "The goblin escaped from the cage.",
            clue: "a 4-letter word meaning 'a mark drawn on paper'",
            hiddenWord: "LINE",
            splitDisplay: "gobLIN Escaped",
            wordBefore: "goblin",
            wordAfter: "escaped",
            splitType: "3+1",
            friendWrong: "BEES",
            friendReason: "looked at completely wrong part of the sentence",
            whyWrong: "Jumping around the sentence instead of systematically sliding across each boundary misses the answer",
            options: ["LINE", "BEES", "CAGE", "GONE", "LINK"],
            correctAnswer: "LINE",
            explanation: "The word LINE is hidden across 'gobLIN' and 'Escaped' — LIN(3) + E(1) = LINE. Slide systematically across EVERY boundary. ✓",
            interactSentence: "The sailor explored the coastline.",
            interactClue: "a 4-letter word meaning 'traditional knowledge'",
            interactHiddenWord: "LORE",
            interactWordBefore: "sailor",
            interactWordAfter: "explored",
            interactOptions: ["LORE", "LURE", "LOBE", "LOFT", "LORD"],
            interactCorrectAnswer: "LORE",
            interactExplanation: "The word LORE is hidden across 'saiLOR' and 'Explored' — LOR(3) + E(1) = LORE, traditional knowledge. ✓"
          },
          {
            name: "Aisha",
            scenario: "learning from a mistake on her practice paper",
            sentence: "She asked for a pardon each time she was late.",
            clue: "a 4-letter word meaning 'finished'",
            hiddenWord: "DONE",
            splitDisplay: "parDON Each",
            wordBefore: "pardon",
            wordAfter: "each",
            splitType: "3+1",
            friendWrong: "LATE",
            friendReason: "spotted 'late' at the end and thought it was the answer",
            whyWrong: "LATE is just a normal word in the sentence — hidden words span ACROSS a boundary, not within a word",
            options: ["DONE", "LATE", "PEAR", "EACH", "PARK"],
            correctAnswer: "DONE",
            explanation: "The word DONE is hidden across 'parDON' and 'Each' — DON(3) + E(1) = DONE, meaning 'finished'. ✓",
            interactSentence: "The decor enhanced the whole room.",
            interactClue: "a 4-letter word meaning 'the centre or most important part'",
            interactHiddenWord: "CORE",
            interactWordBefore: "decor",
            interactWordAfter: "enhanced",
            interactOptions: ["CORE", "CURE", "CARE", "CORD", "CORN"],
            interactCorrectAnswer: "CORE",
            interactExplanation: "The word CORE is hidden across 'deCOR' and 'Enhanced' — COR(3) + E(1) = CORE, the centre or most important part. ✓"
          },
          {
            name: "Charlie",
            scenario: "figuring out why a hidden word was hard to find",
            sentence: "The mentor encouraged her to keep going.",
            clue: "a 4-letter word meaning 'ripped'",
            hiddenWord: "TORE",
            splitDisplay: "menTOR Encouraged",
            wordBefore: "mentor",
            wordAfter: "encouraged",
            splitType: "3+1",
            friendWrong: "TORN",
            friendReason: "thought of the right word family but picked the wrong form",
            whyWrong: "TORN isn't hidden in the sentence — the letters T-O-R-E span 'menTOR' + 'Encouraged' = TORE",
            options: ["TORE", "TORN", "CORE", "MORE", "TOUR"],
            correctAnswer: "TORE",
            explanation: "The word TORE is hidden across 'menTOR' and 'Encouraged' — TOR(3) + E(1) = TORE, meaning 'ripped'. ✓",
            interactSentence: "Storms occur everywhere in winter.",
            interactClue: "a 4-letter word meaning 'a remedy or solution'",
            interactHiddenWord: "CURE",
            interactWordBefore: "occur",
            interactWordAfter: "everywhere",
            interactOptions: ["CURE", "CARE", "CORE", "CUBE", "CURB"],
            interactCorrectAnswer: "CURE",
            interactExplanation: "The word CURE is hidden across 'oCCUR' and 'Everywhere' — CUR(3) + E(1) = CURE, a remedy or solution. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why is the 3+1 split easy to miss?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nA friend picked **"${v.friendWrong}"** — ${v.friendReason}.\n\nBut the real answer is hiding in a sneaky **3+1 split** that's easy to miss. Can you spot it?`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nA friend picked **"${v.friendWrong}"** — ${v.friendReason}.\n\nBut the real answer is hiding in a sneaky **3+1 split** that's easy to miss. Can you spot it?` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `"${v.friendWrong}" is wrong — can you find the real answer?`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 3+1 — don't let it slip past you!",
            body: (v) => `${v.whyWrong}\n\nThe golden rule: always try **all** split types — 3+1, 2+2, AND 1+3. Miss one and you might miss the answer!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.whyWrong}\n\nThe golden rule: always try **all** split types — 3+1, 2+2, AND 1+3. Miss one and you might miss the answer!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `"${v.friendWrong}" — wrong!`, why: v.whyWrong },
                  { text: `Look at: "${v.splitDisplay}"`, why: `Split: ${v.splitType}` },
                  { text: `Answer: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: true
              })}
            ],
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `You only need to try one split type (e.g. 2+2)`, answer: false, explanation: `No — you must try ALL split types: 3+1, 2+2, AND 1+3 to find the hidden word.` },
                { text: `The hidden word must match the clue AND span the word boundary`, answer: true, explanation: `Correct — it must match the clue AND be found spanning between two words. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the 3+1 hidden word!",
            body: (v) => `**"${v.interactSentence}"**\n\nClue: ${v.interactClue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `**"${v.interactSentence}"**\n\nClue: ${v.interactClue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.interactWordBefore,
                word2: v.interactWordAfter,
                hiddenWord: v.interactHiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.interactWordBefore + v.interactWordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.interactWordBefore} ${v.interactWordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "You won't miss the 3+1 again!",
            body: () => `Now you know the sneakiest split — here's how to always catch it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "3+1 means: 3 letters from end + 1 letter from start", why: "The bigger chunk hides inside the first word" },
                  { text: "Always try ALL split types on EVERY boundary", why: "Don't just check 2+2 — try 3+1 and 1+3 too" },
                  { text: "electRIC + Engine = RICE", why: "3 from 'electric' + 1 from 'engine' ✓" }
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
  // SUB-CONCEPT 2: Two-Two Split
  // Category: core
  // ==========================================
  {
    id: "two-two-split",
    name: "2+2 Letter Split",
    category: "core",
    lessons: [
      {
        id: "two-two-split-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot the most common hidden word split — the 2+2 — which shows up loads in the exam",
          "The knack of grabbing the last 2 letters of one word and joining them to the first 2 of the next"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "looking for 2+2 splits in her VR practice",
            sentence: "Please stop engines when parking the bus.",
            clue: "a 4-letter word meaning 'not closed'",
            hiddenWord: "OPEN",
            splitDisplay: "stOP ENgines",
            wordBefore: "stop",
            wordAfter: "engines",
            splitType: "2+2",
            options: ["OPEN", "PENS", "TOPS", "STOP", "NEST"],
            correctAnswer: "OPEN",
            explanation: "The word OPEN is hidden across 'stOP' and 'ENgines' — OP(2) + EN(2) = OPEN, meaning 'not closed'. ✓",
            interactSentence: "The villa measured up really well.",
            interactClue: "a 4-letter word meaning 'unable to walk properly'",
            interactHiddenWord: "LAME",
            interactWordBefore: "villa",
            interactWordAfter: "measured",
            interactOptions: ["LAME", "LAMB", "LIME", "FAME", "MALE"],
            interactCorrectAnswer: "LAME",
            interactExplanation: "The word LAME is hidden across 'vilLA' and 'MEasured' — LA(2) + ME(2) = LAME, meaning 'unable to walk properly'. ✓"
          },
          {
            name: "Oliver",
            scenario: "practising the most common split type",
            sentence: "Please come and see me after school.",
            clue: "a 4-letter word meaning 'unkind'",
            hiddenWord: "MEAN",
            splitDisplay: "coME ANd",
            wordBefore: "come",
            wordAfter: "and",
            splitType: "2+2",
            options: ["MEAN", "MEND", "CANE", "DEAN", "COME"],
            correctAnswer: "MEAN",
            explanation: "The word MEAN is hidden across 'coME' and 'ANd' — ME(2) + AN(2) = MEAN, meaning 'unkind'. ✓",
            interactSentence: "The idea changed everything overnight.",
            interactClue: "a 4-letter word meaning 'every single one'",
            interactHiddenWord: "EACH",
            interactWordBefore: "idea",
            interactWordAfter: "changed",
            interactOptions: ["EACH", "ACHE", "ECHO", "EDGE", "INCH"],
            interactCorrectAnswer: "EACH",
            interactExplanation: "The word EACH is hidden across 'ideA' and 'CHanged' — EA(2) + CH(2) = EACH, meaning 'every single one'. ✓"
          },
          {
            name: "Priya",
            scenario: "sliding her window across a sentence",
            sentence: "He saw the clear chance to score a goal.",
            clue: "a 4-letter word meaning 'a curved structure'",
            hiddenWord: "ARCH",
            splitDisplay: "cleAR CHance",
            wordBefore: "clear",
            wordAfter: "chance",
            splitType: "2+2",
            options: ["ARCH", "CHAR", "EACH", "CARE", "ACRE"],
            correctAnswer: "ARCH",
            explanation: "The word ARCH is hidden across 'cleAR' and 'CHance' — AR(2) + CH(2) = ARCH, a curved structure. ✓",
            interactSentence: "The ache always came back in winter.",
            interactClue: "a 4-letter word meaning 'to make better'",
            interactHiddenWord: "HEAL",
            interactWordBefore: "ache",
            interactWordAfter: "always",
            interactOptions: ["HEAL", "HEAP", "HEAT", "HAZE", "MEAL"],
            interactCorrectAnswer: "HEAL",
            interactExplanation: "The word HEAL is hidden across 'acHE' and 'ALways' — HE(2) + AL(2) = HEAL, meaning 'to make better'. ✓"
          },
          {
            name: "Finn",
            scenario: "tackling 2+2 hidden words quickly",
            sentence: "Pack your camera inside the waterproof bag.",
            clue: "a 4-letter word meaning 'water falling from clouds'",
            hiddenWord: "RAIN",
            splitDisplay: "cameRA INside",
            wordBefore: "camera",
            wordAfter: "inside",
            splitType: "2+2",
            options: ["RAIN", "MAIN", "RUIN", "PAIN", "LAIR"],
            correctAnswer: "RAIN",
            explanation: "The word RAIN is hidden across 'cameRA' and 'INside' — RA(2) + IN(2) = RAIN, water falling from clouds. ✓",
            interactSentence: "The fun doubled after lunch.",
            interactClue: "a 4-letter word meaning 'to reverse something'",
            interactHiddenWord: "UNDO",
            interactWordBefore: "fun",
            interactWordAfter: "doubled",
            interactOptions: ["UNDO", "UNIT", "UPON", "UNTO", "FUND"],
            interactCorrectAnswer: "UNDO",
            interactExplanation: "The word UNDO is hidden across 'fUN' and 'DOubled' — UN(2) + DO(2) = UNDO, meaning 'to reverse something'. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot the 2+2 split?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nA **2+2 split** is the most common: the last **2 letters** of one word join the **first 2 letters** of the next.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nA **2+2 split** is the most common: the last **2 letters** of one word join the **first 2 letters** of the next.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `In "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 2+2 Split — the most common one!",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Grab the last **2 letters** from one word and the **first 2 letters** of the next. This is the most common split type, so mastering it gives you a real edge!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Grab the last **2 letters** from one word and the **first 2 letters** of the next. This is the most common split type, so mastering it gives you a real edge!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `The hidden word spans these two words` },
                  { text: `Last 2 of "${v.wordBefore}" + first 2 of "${v.wordAfter}"`, why: `Split type: ${v.splitType}` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: true
              })}
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The most common split type for hidden words is the ____ split`,
              options: (v) => ["2+2", "3+1", "1+3", "4+0"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! The 2+2 split (2 letters from each word) is the most common type. ✓`,
                incorrect: (v) => `Not quite — the 2+2 split is the most common type of hidden word split!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the hidden word using a 2+2 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the hidden word using a 2+2 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.interactWordBefore,
                word2: v.interactWordAfter,
                hiddenWord: v.interactHiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.interactWordBefore + v.interactWordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.interactWordBefore} ${v.interactWordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "2+2 Split — nailed it!",
            body: () => `Brilliant! You've learned the most common split type. Here's your recipe:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look at the LAST 2 letters of each word", why: "These form the start of the hidden word" },
                  { text: "2. Add the FIRST 2 letters of the next word", why: "This completes the 4-letter hidden word" },
                  { text: "3. Check: real word matching the clue?", why: "stOP + ENgines = OPEN ✓" }
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
  // SUB-CONCEPT 3: One-Three Split
  // Category: core
  // ==========================================
  {
    id: "one-three-split",
    name: "1+3 Letter Split",
    category: "core",
    lessons: [
      {
        id: "one-three-split-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to catch the trickiest split — the 1+3 — where just ONE letter comes from the first word",
          "Why this split fools so many people, and how you can be the one who spots it"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "searching for 1+3 splits in a sentence",
            sentence: "He finally saw Andrew leave the building.",
            clue: "a 4-letter word meaning 'a magic stick'",
            hiddenWord: "WAND",
            splitDisplay: "saW ANDrew",
            wordBefore: "saw",
            wordAfter: "Andrew",
            splitType: "1+3",
            options: ["WAND", "SAND", "HAND", "LAND", "BAND"],
            correctAnswer: "WAND",
            explanation: "The word WAND is hidden across 'saW' and 'ANDrew' — W(1) + AND(3) = WAND, a magic stick. ✓",
            interactSentence: "The horse astounded everyone at the show.",
            interactClue: "a 4-letter word meaning 'a compass direction'",
            interactHiddenWord: "EAST",
            interactWordBefore: "horse",
            interactWordAfter: "astounded",
            interactOptions: ["EAST", "EASY", "LAST", "FAST", "MAST"],
            interactCorrectAnswer: "EAST",
            interactExplanation: "The word EAST is hidden across 'horsE' and 'ASTounded' — E(1) + AST(3) = EAST, a compass direction. ✓"
          },
          {
            name: "Theo",
            scenario: "practising the tricky 1+3 split",
            sentence: "Go to school over the bridge.",
            clue: "a 4-letter word meaning 'to care for deeply'",
            hiddenWord: "LOVE",
            splitDisplay: "schooL OVEr",
            wordBefore: "school",
            wordAfter: "over",
            splitType: "1+3",
            options: ["LOVE", "MOVE", "DOVE", "LOSE", "LONE"],
            correctAnswer: "LOVE",
            explanation: "The word LOVE is hidden across 'schooL' and 'OVEr' — L(1) + OVE(3) = LOVE, meaning 'to care for deeply'. ✓",
            interactSentence: "The bad awning broke in the storm.",
            interactClue: "a 4-letter word meaning 'the time when the sun rises'",
            interactHiddenWord: "DAWN",
            interactWordBefore: "bad",
            interactWordAfter: "awning",
            interactOptions: ["DAWN", "FAWN", "YAWN", "LAWN", "DOWN"],
            interactCorrectAnswer: "DAWN",
            interactExplanation: "The word DAWN is hidden across 'baD' and 'AWNing' — D(1) + AWN(3) = DAWN, the time when the sun rises. ✓"
          },
          {
            name: "Isla",
            scenario: "finding 1+3 splits in her VR paper",
            sentence: "Find the extra blend of spices in the cupboard.",
            clue: "a 4-letter word meaning 'capable'",
            hiddenWord: "ABLE",
            splitDisplay: "extrA BLEnd",
            wordBefore: "extra",
            wordAfter: "blend",
            splitType: "1+3",
            options: ["ABLE", "BEND", "AXLE", "BLADE", "LABEL"],
            correctAnswer: "ABLE",
            explanation: "The word ABLE is hidden across 'extrA' and 'BLEnd' — A(1) + BLE(3) = ABLE, meaning 'capable'. ✓",
            interactSentence: "They talked about our holiday plans.",
            interactClue: "a 4-letter word meaning 'a journey visiting several places'",
            interactHiddenWord: "TOUR",
            interactWordBefore: "about",
            interactWordAfter: "our",
            interactOptions: ["TOUR", "FOUR", "POUR", "HOUR", "SOUR"],
            interactCorrectAnswer: "TOUR",
            interactExplanation: "The word TOUR is hidden across 'abouT' and 'OURholiday' — T(1) + OUR(3) = TOUR, a journey visiting several places. ✓"
          },
          {
            name: "Finn",
            scenario: "using the sliding window for 1+3 splits",
            sentence: "Play your chess partner carefully this time.",
            clue: "a 4-letter word meaning 'to practise boxing'",
            hiddenWord: "SPAR",
            splitDisplay: "chesS PARtner",
            wordBefore: "chess",
            wordAfter: "partner",
            splitType: "1+3",
            options: ["SPAR", "SPAN", "STAR", "SNAP", "PARK"],
            correctAnswer: "SPAR",
            explanation: "The word SPAR is hidden across 'chesS' and 'PARtner' — S(1) + PAR(3) = SPAR, meaning 'to practise boxing'. ✓",
            interactSentence: "The club rowing team won the trophy.",
            interactClue: "a 4-letter word meaning 'the forehead'",
            interactHiddenWord: "BROW",
            interactWordBefore: "club",
            interactWordAfter: "rowing",
            interactOptions: ["BROW", "GROW", "CROW", "BREW", "BLOW"],
            interactCorrectAnswer: "BROW",
            interactExplanation: "The word BROW is hidden across 'cluB' and 'ROWing' — B(1) + ROW(3) = BROW, the forehead. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you spot the 1+3 split?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nIn a **1+3 split**, just the **last letter** of one word joins the **first 3 letters** of the next.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nIn a **1+3 split**, just the **last letter** of one word joins the **first 3 letters** of the next.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `In "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 1+3 Split — super sneaky!",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. This time, just the **last letter** from one word joins the **first 3 letters** of the next. Only 1 letter from the first word — that's what makes it so sneaky!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. This time, just the **last letter** from one word joins the **first 3 letters** of the next. Only 1 letter from the first word — that's what makes it so sneaky!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `The hidden word spans these two words` },
                  { text: `Last 1 of "${v.wordBefore}" + first 3 of "${v.wordAfter}"`, why: `Split type: ${v.splitType}` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: false
              })}
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the hidden word using a 1+3 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the hidden word using a 1+3 split.\n\n**"${v.interactSentence}"**\n\nClue: ${v.interactClue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.interactWordBefore,
                word2: v.interactWordAfter,
                hiddenWord: v.interactHiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.interactWordBefore + v.interactWordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.interactWordBefore} ${v.interactWordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "1+3 Split — now you can catch it!",
            body: () => `Well done — you've learned the sneakiest split! Here's your recipe:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look at the LAST letter of each word", why: "Just one letter from the first word!" },
                  { text: "2. Add the FIRST 3 letters of the next word", why: "The bulk of the hidden word comes from word two" },
                  { text: "3. Check: real word matching the clue?", why: "saW + ANDrew = WAND ✓" }
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
  // SUB-CONCEPT 4: Within-Word Hidden Words
  // Category: core
  // ==========================================
  {
    id: "within-word",
    name: "Hidden Inside One Word",
    category: "core",
    lessons: [
      {
        id: "within-word-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The surprise twist: sometimes the hidden word is hiding INSIDE a single word!",
          "Why checking inside longer words as well as across boundaries catches answers others miss"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "surprised to find a word hiding inside another word",
            sentence: "The planet orbited the distant star.",
            clue: "a 4-letter word meaning 'a narrow road'",
            hiddenWord: "LANE",
            splitDisplay: "pLANEt",
            wordBefore: "planet",
            wordAfter: "(within)",
            splitType: "within",
            options: ["LANE", "PLAN", "LATE", "PALE", "NEAT"],
            correctAnswer: "LANE",
            explanation: "The word LANE is hidden entirely inside 'pLANEt' — L-A-N-E. No boundary needed! ✓",
            interactSentence: "They believed the old ghost appeared at midnight.",
            interactClue: "a 4-letter word meaning 'someone who entertains guests'",
            interactHiddenWord: "HOST",
            interactWordBefore: "ghost",
            interactOptions: ["HOST", "LOST", "MOST", "HOSE", "COST"],
            interactCorrectAnswer: "HOST",
            interactExplanation: "The word HOST is hidden entirely inside 'gHOST' — H-O-S-T. It sits at the end of the word! ✓"
          },
          {
            name: "Oliver",
            scenario: "discovering words can hide inside a single word",
            sentence: "She peeled the orange and shared it with her friends.",
            clue: "a 4-letter word meaning 'the past tense of ring'",
            hiddenWord: "RANG",
            splitDisplay: "oRANGe",
            wordBefore: "orange",
            wordAfter: "(within)",
            splitType: "within",
            options: ["RANG", "RAGE", "RAIN", "GRAN", "RUNG"],
            correctAnswer: "RANG",
            explanation: "The word RANG is hidden entirely inside 'oRANGe' — R-A-N-G. Look inside single words too! ✓",
            interactSentence: "She bought a chocolate eclair from the bakery.",
            interactClue: "a 4-letter word meaning 'not on time'",
            interactHiddenWord: "LATE",
            interactWordBefore: "chocolate",
            interactOptions: ["LATE", "LAKE", "LACE", "COLA", "CHOP"],
            interactCorrectAnswer: "LATE",
            interactExplanation: "The word LATE is hidden entirely inside 'chocoLATE' — L-A-T-E. It sits right at the end of the word! ✓"
          },
          {
            name: "Priya",
            scenario: "checking inside longer words for hidden answers",
            sentence: "The farmers celebrated a wonderful harvest.",
            clue: "a 4-letter word meaning 'a sleeveless garment'",
            hiddenWord: "VEST",
            splitDisplay: "harVEST",
            wordBefore: "harvest",
            wordAfter: "(within)",
            splitType: "within",
            options: ["VEST", "BEST", "REST", "VAST", "WEST"],
            correctAnswer: "VEST",
            explanation: "The word VEST is hidden entirely inside 'harVEST' — V-E-S-T. The hidden word sits at the end of this word! ✓",
            interactSentence: "She checked the calendar daily for the date.",
            interactClue: "a 4-letter word meaning 'to let someone borrow'",
            interactHiddenWord: "LEND",
            interactWordBefore: "calendar",
            interactOptions: ["LEND", "LAND", "LEAN", "LEAD", "LENS"],
            interactCorrectAnswer: "LEND",
            interactExplanation: "The word LEND is hidden entirely inside 'caLENDar' — L-E-N-D. It sits in the middle of the word! ✓"
          },
          {
            name: "Finn",
            scenario: "learning that hidden words can be inside one word",
            sentence: "Please listen carefully to the instructions.",
            clue: "a 4-letter word meaning 'a series of items written down'",
            hiddenWord: "LIST",
            splitDisplay: "LISTen",
            wordBefore: "listen",
            wordAfter: "(within)",
            splitType: "within",
            options: ["LIST", "SLIT", "LINT", "LAST", "TILE"],
            correctAnswer: "LIST",
            explanation: "The word LIST is hidden entirely inside 'LISTen' — L-I-S-T. It's right at the beginning of the word! ✓",
            interactSentence: "The bravest knight fought the dragon.",
            interactClue: "a 4-letter word meaning 'to speak wildly'",
            interactHiddenWord: "RAVE",
            interactWordBefore: "bravest",
            interactOptions: ["RAVE", "RAZE", "RAGE", "ROBE", "RAVE"],
            // Note: RAVE appears only at index 0 as correct
            interactCorrectAnswer: "RAVE",
            interactExplanation: "The word RAVE is hidden entirely inside 'bRAVEst' — R-A-V-E. It sits in the middle of the word! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `A word hiding INSIDE another word?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSometimes the hidden word doesn't span two words at all — it sits entirely **inside** a single word!\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "window",
                topLetters: v.wordBefore.replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Look inside "${v.wordBefore}":`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Hidden Inside One Word — surprise!",
            body: (v) => `The clue says: ${v.clue}. Here's something cool — not every hidden word crosses a boundary! Some hide entirely **within** a longer word like **"${v.wordBefore}"**. Check the beginning, middle AND end of each word. You'd be amazed what's hiding in there!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Look inside: "${v.splitDisplay}"`, why: `The hidden word is entirely within this word` },
                  { text: `The letters spell: ${v.hiddenWord}`, why: `No boundary crossing needed!` },
                  { text: `${v.hiddenWord} matches the clue ✓`, why: v.explanation }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the hidden word — it's inside a single word this time!\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            visual: {
              component: "LetterTiles",
              props: (v) => ({
                mode: "window",
                topLetters: v.wordBefore.replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Search inside "${v.wordBefore}":`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "Inside words — your extra trick!",
            body: () => `Now you've got an extra trick up your sleeve — hidden words don't always cross boundaries:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Check across word boundaries (the sliding window)", why: "Try 3+1, 2+2, and 1+3 splits" },
                  { text: "2. ALSO check inside each individual word", why: "Longer words can contain shorter ones" },
                  { text: "3. pLANEt = LANE, harVEST = VEST", why: "The word hides inside a single word ✓" }
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
  // SUB-CONCEPT 5: Clue-First Strategy
  // Category: supporting
  // ==========================================
  {
    id: "clue-first",
    name: "Use the Clue First",
    category: "supporting",
    lessons: [
      {
        id: "clue-first-steps",
        templateType: "step-by-step",
        learningGoal: [
          "A time-saving trick: read the clue FIRST so you already know what you're hunting for",
          "Why this one simple habit can make you twice as fast at hidden word questions"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "learning to read the clue before scanning the sentence",
            sentence: "Just before she rode away on her bicycle.",
            clue: "a 4-letter word meaning 'a brave person'",
            hiddenWord: "HERO",
            splitDisplay: "sHE ROde",
            wordBefore: "she",
            wordAfter: "rode",
            splitType: "2+2",
            options: ["HERO", "HERE", "HERD", "RODE", "SHED"],
            correctAnswer: "HERO",
            explanation: "The clue says 'a brave person' — that's HERO! Now find it: sHE + ROde = HERO. Knowing the word makes it faster. ✓"
          },
          {
            name: "Oliver",
            scenario: "using the clue to speed up his search",
            sentence: "Each time she ate something cold, she shivered.",
            clue: "a 4-letter word meaning 'warmth'",
            hiddenWord: "HEAT",
            splitDisplay: "sHE ATe",
            wordBefore: "she",
            wordAfter: "ate",
            splitType: "2+2",
            options: ["HEAT", "HATE", "HEAP", "EACH", "MEAT"],
            correctAnswer: "HEAT",
            explanation: "The clue says 'warmth' — that's HEAT! Now find it: sHE + ATe = HEAT. The clue told you what to look for. ✓"
          },
          {
            name: "Priya",
            scenario: "reading the clue first to save time",
            sentence: "See the magic artist perform on the stage.",
            clue: "a 4-letter word meaning 'a wheeled vehicle pulled by a horse'",
            hiddenWord: "CART",
            splitDisplay: "magiC ARTist",
            wordBefore: "magic",
            wordAfter: "artist",
            splitType: "1+3",
            options: ["CART", "CARD", "ARTS", "MAGI", "STAR"],
            correctAnswer: "CART",
            explanation: "The clue says 'a wheeled vehicle pulled by a horse' — that's CART! Now find it: magiC + ARTist = CART. ✓"
          },
          {
            name: "Finn",
            scenario: "putting the clue-first method into practice",
            sentence: "The warmth inside the cottage felt wonderful.",
            clue: "a 4-letter word meaning 'slim or not thick'",
            hiddenWord: "THIN",
            splitDisplay: "warmTH INside",
            wordBefore: "warmth",
            wordAfter: "inside",
            splitType: "2+2",
            options: ["THIN", "MINT", "HINT", "SHIN", "THAN"],
            correctAnswer: "THIN",
            explanation: "The clue says 'slim or not thick' — that's THIN! Now find it: warmTH + INside = THIN. Clue first, then scan. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Read the clue FIRST!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nBefore sliding across boundaries, **read the clue**. If you already know what word you're looking for, you can scan much faster!\n\nClue: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nBefore sliding across boundaries, **read the clue**. If you already know what word you're looking for, you can scan much faster!\n\nClue: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `What word matches the clue?`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Clue First, Then Scan — so much faster!",
            body: (v) => `The clue says: **${v.clue}**. First, read the clue and think — what word matches? Once you've got it, scan **"${v.sentence}"** looking for those exact letters. It's like knowing what treasure you're hunting before you start digging!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `The clue says: **${v.clue}**. First, read the clue and think — what word matches? Once you've got it, scan **"${v.sentence}"** looking for those exact letters. It's like knowing what treasure you're hunting before you start digging!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Clue: "${v.clue}"`, why: `Think: what word means this? → ${v.hiddenWord}` },
                  { text: `Now scan for ${v.hiddenWord} in the sentence`, why: `Look for the letters ${v.hiddenWord.split('').join('-')} spanning a boundary` },
                  { text: `Found it: "${v.splitDisplay}" ✓`, why: v.explanation }
                ],
                allRevealed: true
              })}
            ],
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the clue first: "${v.clue}"`,
                `Think of a word that matches the clue`,
                `Scan the sentence for those specific letters`,
                `Check the letters span a word boundary`
              ],
              feedback: {
                correct: (v) => `Perfect! Clue first, think of the word, then scan. ✓`,
                incorrect: (v) => `Not quite — always read the clue FIRST, then scan the sentence.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — clue first!",
            body: (v) => `Read the clue, think of the word, then find it.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Read the clue, think of the word, then find it.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "Clue First — your speed superpower!",
            body: () => `This one trick will save you loads of time in the exam. You've got this!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the clue — what word matches the definition?", why: "If you can guess the word, you're halfway there" },
                  { text: "2. Scan for those SPECIFIC letters in the sentence", why: "Much faster than checking every boundary blindly" },
                  { text: "3. Confirm: do the letters actually span a boundary?", why: "Make sure the word is really hidden there ✓" }
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
  // SUB-CONCEPT 6: Three-Letter Hidden Words
  // Category: supporting
  // ==========================================
  {
    id: "three-letter-hidden",
    name: "3-Letter Hidden Words",
    category: "supporting",
    lessons: [
      {
        id: "three-letter-hidden-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to hunt down tiny 3-letter hidden words — they're small but mighty tricky!",
          "The two split types for 3-letter words: 2+1 and 1+2 — fewer options but easy to miss"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "looking for a tiny 3-letter hidden word",
            sentence: "They had to show Lauren the way to the hall.",
            clue: "a 3-letter word meaning 'a nocturnal bird'",
            hiddenWord: "OWL",
            splitDisplay: "shOW Lauren",
            wordBefore: "show",
            wordAfter: "Lauren",
            splitType: "2+1",
            options: ["OWL", "OAR", "OAK", "OWE", "AWL"],
            correctAnswer: "OWL",
            explanation: "The word OWL is hidden across 'shOW' and 'Lauren' — OW(2) + L(1) = OWL, a nocturnal bird. ✓"
          },
          {
            name: "Oliver",
            scenario: "hunting for a short hidden word",
            sentence: "She sat on the sofa gently reading her book.",
            clue: "a 3-letter word meaning 'how old someone is'",
            hiddenWord: "AGE",
            splitDisplay: "sofA GEntly",
            wordBefore: "sofa",
            wordAfter: "gently",
            splitType: "1+2",
            options: ["AGE", "AGO", "ACE", "ATE", "APE"],
            correctAnswer: "AGE",
            explanation: "The word AGE is hidden across 'sofA' and 'GEntly' — A(1) + GE(2) = AGE, meaning 'how old someone is'. ✓"
          },
          {
            name: "Priya",
            scenario: "spotting a sneaky short hidden word",
            sentence: "The piano arrived this morning by van.",
            clue: "a 3-letter word meaning 'a pole used to row a boat'",
            hiddenWord: "OAR",
            splitDisplay: "pianO ARrived",
            wordBefore: "piano",
            wordAfter: "arrived",
            splitType: "1+2",
            options: ["OAR", "OAK", "ORE", "OAT", "AIR"],
            correctAnswer: "OAR",
            explanation: "The word OAR is hidden across 'pianO' and 'ARrived' — O(1) + AR(2) = OAR, a pole used to row a boat. ✓"
          },
          {
            name: "Finn",
            scenario: "finding the smallest hidden words",
            sentence: "The topic each student chose was different.",
            clue: "a 3-letter word meaning 'frozen water'",
            hiddenWord: "ICE",
            splitDisplay: "topIC Each",
            wordBefore: "topic",
            wordAfter: "each",
            splitType: "2+1",
            options: ["ICE", "ACE", "IRE", "ATE", "PIE"],
            correctAnswer: "ICE",
            explanation: "The word ICE is hidden across 'topIC' and 'Each' — IC(2) + E(1) = ICE, frozen water. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Tiny but tricky — 3-letter hidden words!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**3-letter words** are short, so they're easy to miss. They split either **2+1** or **1+2** across a boundary.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\n**3-letter words** are short, so they're easy to miss. They split either **2+1** or **1+2** across a boundary.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. With only 3 letters, the word splits either **2+1** (two from the first word, one from the next) or **1+2** (one from the first, two from the next).` },
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `In "${v.wordBefore} ${v.wordAfter}" (3 letters):`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "3-Letter Splits: 2+1 or 1+2",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. With only 3 letters, the word splits either **2+1** (two from the first word, one from the next) or **1+2** (one from the first, two from the next).`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. With only 3 letters, the word splits either **2+1** (two from the first word, one from the next) or **1+2** (one from the first, two from the next).` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'text', content: (v) => `Find the 3-letter hidden word.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `The hidden word spans these two words` },
                  { text: `Split: ${v.splitType}`, why: `Only 2 possible split types for 3-letter words` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: false
              })}
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the 3-letter hidden word.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the 3-letter hidden word.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "Tiny words, big catches!",
            body: () => `Great work! 3-letter hidden words are small but you've got the skills to find them:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Only 2 split types: 2+1 or 1+2", why: "Fewer options, but easy to overlook" },
                  { text: "Also check INSIDE single words", why: "Short words hide inside longer ones easily" },
                  { text: "shOW + Lauren = OWL, topIC + Each = ICE", why: "Small words, big catches ✓" }
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
  // SUB-CONCEPT 7: Five-Letter Hidden Words
  // Category: supporting
  // ==========================================
  {
    id: "five-letter-hidden",
    name: "5-Letter Hidden Words",
    category: "supporting",
    lessons: [
      {
        id: "five-letter-hidden-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to tackle the big ones — 5-letter hidden words that need more detective work",
          "The four split types to try (4+1, 3+2, 2+3, 1+4) and why the clue is your best friend here"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "tackling a 5-letter hidden word for the first time",
            sentence: "We saw the beach air balloon at the fair.",
            clue: "a 5-letter word meaning 'something to sit on'",
            hiddenWord: "CHAIR",
            splitDisplay: "beaCH AIR",
            wordBefore: "beach",
            wordAfter: "air",
            splitType: "2+3",
            options: ["CHAIR", "BEACH", "CHARM", "CHAIN", "REACH"],
            correctAnswer: "CHAIR",
            explanation: "The word CHAIR is hidden across 'beaCH' and 'AIR' — CH(2) + AIR(3) = CHAIR, something to sit on. ✓"
          },
          {
            name: "Oliver",
            scenario: "searching for a long hidden word",
            sentence: "The human germ theory changed medicine forever.",
            clue: "a 5-letter word meaning 'a strong feeling of annoyance'",
            hiddenWord: "ANGER",
            splitDisplay: "humAN GERm",
            wordBefore: "human",
            wordAfter: "germ",
            splitType: "2+3",
            options: ["ANGER", "RANGE", "MANGO", "MANGE", "GENRE"],
            correctAnswer: "ANGER",
            explanation: "The word ANGER is hidden across 'humAN' and 'GERm' — AN(2) + GER(3) = ANGER, a strong feeling of annoyance. ✓"
          },
          {
            name: "Priya",
            scenario: "finding longer hidden words in sentences",
            sentence: "She bought extra ink for the printer.",
            clue: "a 5-letter word meaning 'a vehicle on railway tracks'",
            hiddenWord: "TRAIN",
            splitDisplay: "exTRA INk",
            wordBefore: "extra",
            wordAfter: "ink",
            splitType: "3+2",
            options: ["TRAIN", "TRAIL", "BRAIN", "DRAIN", "TRACE"],
            correctAnswer: "TRAIN",
            explanation: "The word TRAIN is hidden across 'exTRA' and 'INk' — TRA(3) + IN(2) = TRAIN, a vehicle on railway tracks. ✓"
          },
          {
            name: "Finn",
            scenario: "handling the challenge of 5-letter hidden words",
            sentence: "She made toast ingredients for the party.",
            clue: "a 5-letter word meaning 'a sharp pain from an insect'",
            hiddenWord: "STING",
            splitDisplay: "toaST INGredients",
            wordBefore: "toast",
            wordAfter: "ingredients",
            splitType: "2+3",
            options: ["STING", "STINK", "SLING", "SWING", "TANGO"],
            correctAnswer: "STING",
            explanation: "The word STING is hidden across 'toaST' and 'INGredients' — ST(2) + ING(3) = STING, a sharp pain from an insect. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can you find the 5-letter hidden word?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**5-letter words** are harder because they have more split types: 4+1, 3+2, 2+3, or 1+4. You need to try more combinations!\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\n**5-letter words** are harder because they have more split types: 4+1, 3+2, 2+3, or 1+4. You need to try more combinations!\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `In "${v.wordBefore} ${v.wordAfter}" (5 letters):`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "5-Letter Splits — more combos to try!",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. A 5-letter hidden word can split **4+1, 3+2, 2+3, or 1+4** across a boundary. That's more options, but don't worry — use the clue to narrow your search and you'll find it!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. A 5-letter hidden word can split **4+1, 3+2, 2+3, or 1+4** across a boundary. That's more options, but don't worry — use the clue to narrow your search and you'll find it!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `The hidden word spans these two words` },
                  { text: `Split: ${v.splitType} — 5 letters total`, why: `More split types to check than with 4-letter words` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: false
              })}
            ],
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Find the 5-letter hidden word.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the 5-letter hidden word.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "5-letter words — you can handle these!",
            body: () => `Longer words just need a bit more patience. You've got this!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "4 possible split types: 4+1, 3+2, 2+3, 1+4", why: "More combinations to check" },
                  { text: "Use the CLUE to guess the word first", why: "Then scan for those specific letters" },
                  { text: "beaCH + AIR = CHAIR, exTRA + INk = TRAIN", why: "Longer words need patience ✓" }
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
  // SUB-CONCEPT 8: Backwards Hidden Words
  // Category: other
  // ==========================================
  {
    id: "backwards-hidden",
    name: "Hidden Words Reading Backwards",
    category: "other",
    lessons: [
      {
        id: "backwards-hidden-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The ultimate twist: sometimes the hidden word reads BACKWARDS — like a mirror message!",
          "Why checking both directions is your secret weapon when you feel stuck"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "discovering that hidden words can read backwards",
            sentence: "The extra passengers boarded the bus quickly.",
            clue: "a 4-letter word meaning 'a section or piece' — reading backwards!",
            hiddenWord: "PART",
            splitDisplay: "exTRA Passengers",
            wordBefore: "extra",
            wordAfter: "passengers",
            splitType: "3+1 (backwards)",
            options: ["PART", "TRAP", "PARS", "TARP", "RAPT"],
            correctAnswer: "PART",
            explanation: "The letters T-R-A-P are hidden across 'exTRA' and 'Passengers'. Read backwards: P-A-R-T = PART, meaning 'a section'. ✓"
          },
          {
            name: "Oliver",
            scenario: "trying reverse hidden words for the first time",
            sentence: "The crisp otter swam through the cold river.",
            clue: "a 4-letter word meaning 'the highest points' — reading backwards!",
            hiddenWord: "TOPS",
            splitDisplay: "criSP OTter",
            wordBefore: "crisp",
            wordAfter: "otter",
            splitType: "2+2 (backwards)",
            options: ["TOPS", "SPOT", "STOP", "POTS", "TOSS"],
            correctAnswer: "TOPS",
            explanation: "The letters S-P-O-T are hidden across 'criSP' and 'OTter'. Read backwards: T-O-P-S = TOPS, meaning 'the highest points'. ✓"
          },
          {
            name: "Priya",
            scenario: "learning the backwards trick",
            sentence: "She counted a hundred raw onions in the box.",
            clue: "a 4-letter word meaning 'a section of a hospital' — reading backwards!",
            hiddenWord: "WARD",
            splitDisplay: "hundreD RAW",
            wordBefore: "hundred",
            wordAfter: "raw",
            splitType: "1+3 (backwards)",
            options: ["WARD", "DRAW", "WARP", "WARS", "DARE"],
            correctAnswer: "WARD",
            explanation: "The letters D-R-A-W are hidden across 'hundreD' and 'RAW'. Read backwards: W-A-R-D = WARD, a section of a hospital. ✓"
          },
          {
            name: "Finn",
            scenario: "checking both directions to find the answer",
            sentence: "The big unsafe bridge was closed for repairs.",
            clue: "a 4-letter word meaning 'warm and cosy' — reading backwards!",
            hiddenWord: "SNUG",
            splitDisplay: "biG UNSafe",
            wordBefore: "big",
            wordAfter: "unsafe",
            splitType: "1+3 (backwards)",
            options: ["SNUG", "GUNS", "SUNG", "GUST", "SLUG"],
            correctAnswer: "SNUG",
            explanation: "The letters G-U-N-S are hidden across 'biG' and 'UNSafe'. Read backwards: S-N-U-G = SNUG, meaning 'warm and cosy'. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What if the word reads BACKWARDS?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSome hidden word questions have a twist — the word reads **backwards** through the sentence! If you can't find it forwards, try reversing.\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Can't find the word going forwards? Try reading the letters **backwards** across the boundary — it's like looking in a mirror!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                reversed: true,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Try reading backwards across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Reading Backwards — flip it!",
            body: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Can't find the word going forwards? Try reading the letters **backwards** across the boundary — it's like looking in a mirror!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Look at **"${v.wordBefore} ${v.wordAfter}"** — the clue says: ${v.clue}. Can't find the word going forwards? Try reading the letters **backwards** across the boundary — it's like looking in a mirror!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                reversed: true,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Look at: "${v.splitDisplay}"`, why: `These letters span the boundary` },
              { type: 'text', content: (v) => `Find the hidden word — it reads BACKWARDS.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
                  { text: `Read the letters backwards`, why: `Reverse the order to reveal the word` },
                  { text: `Hidden word: ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: true
              })}
            ],
            interaction: {
              type: "fill-blank",
              sentence: (v) => `If you can't find the hidden word going forwards, try reading the letters ____`,
              options: (v) => ["backwards", "faster", "louder", "randomly"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Some hidden words read backwards across the boundary. ✓`,
                incorrect: (v) => `Not quite — try reading the letters BACKWARDS to reveal the hidden word!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — try backwards!",
            body: (v) => `Find the hidden word — it reads BACKWARDS.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `Find the hidden word — it reads BACKWARDS.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                reversed: true,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide and reverse across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden backwards in the sentence?`,
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
            title: () => "Forwards AND backwards — you've got both covered!",
            body: () => `Now you know to check both directions. That puts you ahead of most people!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Try finding the word FORWARDS first", why: "Most hidden words read left to right" },
                  { text: "2. If stuck, try reading BACKWARDS", why: "Some tricky questions reverse the word" },
                  { text: "3. exTRA + Passengers → TRAP → PART", why: "Reverse the letters to find the answer ✓" }
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
  // SUB-CONCEPT 9: Double Meaning
  // Category: other
  // ==========================================
  {
    id: "double-meaning",
    name: "Hidden Words with Double Meanings",
    category: "other",
    lessons: [
      {
        id: "double-meaning-steps",
        templateType: "step-by-step",
        learningGoal: [
          "The clever trick exam-setters use: making the hidden word mean something totally different from the sentence!",
          "How to ignore the sentence's topic and focus on what actually matters — the letters"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "noticing the hidden word means something different to the sentence",
            sentence: "Pack your camera inside before it gets dark.",
            clue: "a 4-letter word meaning 'water falling from the sky'",
            hiddenWord: "RAIN",
            splitDisplay: "cameRA INside",
            wordBefore: "camera",
            wordAfter: "inside",
            splitType: "2+2",
            misdirection: "The sentence is about packing a camera — nothing to do with weather!",
            options: ["RAIN", "MAIN", "RUIN", "PAIN", "LAIR"],
            correctAnswer: "RAIN",
            explanation: "RAIN is hidden in 'cameRA INside' — the sentence talks about cameras, but the hidden word means water from the sky. The meaning mismatch is deliberate! ✓"
          },
          {
            name: "Oliver",
            scenario: "realising the hidden word has nothing to do with the sentence topic",
            sentence: "The small rabbit chose the largest carrot.",
            clue: "a 4-letter word meaning 'an irritating feeling on the skin'",
            hiddenWord: "ITCH",
            splitDisplay: "rabbIT CHose",
            wordBefore: "rabbit",
            wordAfter: "chose",
            splitType: "2+2",
            misdirection: "The sentence is about a rabbit choosing carrots — nothing about skin or itching!",
            options: ["ITCH", "RICH", "INCH", "DITCH", "TICK"],
            correctAnswer: "ITCH",
            explanation: "ITCH is hidden in 'rabbIT CHose' — the sentence is about rabbits, but the hidden word means a skin irritation. Don't be fooled by the topic! ✓"
          },
          {
            name: "Priya",
            scenario: "learning to ignore the sentence's topic and focus on letters",
            sentence: "Play your chess partner well this evening.",
            clue: "a 4-letter word meaning 'to practise boxing'",
            hiddenWord: "SPAR",
            splitDisplay: "chesS PARtner",
            wordBefore: "chess",
            wordAfter: "partner",
            splitType: "1+3",
            misdirection: "The sentence is about chess — nothing to do with boxing!",
            options: ["SPAR", "SPAN", "STAR", "PARK", "RAPS"],
            correctAnswer: "SPAR",
            explanation: "SPAR is hidden in 'chesS PARtner' — the sentence is about chess, but the hidden word means to box. The different meaning is the trick! ✓"
          },
          {
            name: "Finn",
            scenario: "spotting double-meaning misdirection",
            sentence: "That epic row angered everyone at the meeting.",
            clue: "a 4-letter word meaning 'a large black bird'",
            hiddenWord: "CROW",
            splitDisplay: "epiC ROW",
            wordBefore: "epic",
            wordAfter: "row",
            splitType: "1+3",
            misdirection: "The sentence is about an argument — 'row' here means an argument, not a bird!",
            options: ["CROW", "CREW", "GROW", "CORE", "ROWE"],
            correctAnswer: "CROW",
            explanation: "CROW is hidden in 'epiC ROW' — 'row' in the sentence means an argument, but CROW means a large black bird. The double meaning of 'row' adds to the misdirection! ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The hidden word doesn't match the sentence!`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nHere's the trick: the **hidden word** often means something completely **different** to what the sentence is about. This misdirection is deliberate — it makes the word harder to spot!\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.name} is ${v.scenario}.\n\nHere's the trick: the **hidden word** often means something completely **different** to what the sentence is about. This misdirection is deliberate — it makes the word harder to spot!\n\nLook for: **${v.clue}**\n\n**"${v.sentence}"**\n\nFocus on the words: **${v.wordBefore}** and **${v.wordAfter}**` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Focus on the letters, not the meaning:`
              })}
            ],
            interaction: null
          },
          {
            type: "teach",
            title: () => "Don't fall for the red herring!",
            body: (v) => `${v.misdirection}\n\nHere's the key: don't look for a word that **fits** the sentence — focus on one that matches the **clue**. The sentence is trying to distract you!`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.misdirection}\n\nHere's the key: don't look for a word that **fits** the sentence — focus on one that matches the **clue**. The sentence is trying to distract you!` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'WorkedExample', props: (v) => ({
                steps: [
                  { text: `Sentence topic: something else entirely`, why: v.misdirection },
                  { text: `Clue topic: "${v.clue}"`, why: `Focus on the CLUE, not the sentence meaning` },
                  { text: `Found: "${v.splitDisplay}" = ${v.hiddenWord} ✓`, why: v.explanation }
                ],
                allRevealed: false
              })}
            ],
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Focus on", right: "the clue" },
                { left: "Ignore", right: "the sentence meaning" },
                { left: "Scan for", right: "letter patterns" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — ignore the misdirection!",
            body: (v) => `The hidden word has NOTHING to do with the sentence topic.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `The hidden word has NOTHING to do with the sentence topic.\n\n**"${v.sentence}"**\n\nClue: ${v.clue}` },
              { type: 'visual', component: 'SlidingWindow', props: (v) => ({
                word1: v.wordBefore,
                word2: v.wordAfter,
                hiddenWord: v.hiddenWord,
                label: "Slide the purple letters across to find the hidden word"
              })},
              { type: 'visual', component: 'LetterTiles', props: (v) => ({
                mode: "window",
                topLetters: (v.wordBefore + v.wordAfter).replace(/ /g, '').split(''),
                windowStart: -1,
                windowEnd: -1,
                label: `Slide across "${v.wordBefore} ${v.wordAfter}":`
              })}
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is hidden in the sentence?`,
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
            title: () => "You're too smart for their tricks!",
            body: () => `Now you know the secret: hidden word sentences are DESIGNED to mislead — but you won't fall for it!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "The sentence topic is a RED HERRING", why: "It's there to distract you from the hidden word" },
                  { text: "Focus on the CLUE definition, not the sentence meaning", why: "The clue tells you what word to find" },
                  { text: "Scan the LETTERS, not the words' meanings", why: "cameRA + INside = RAIN (nothing to do with cameras!) ✓" }
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

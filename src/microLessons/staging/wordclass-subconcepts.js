// ============================================================
// Supplementary sub-concepts for Word Class & Grammar
// To merge: add these to lessonBank.wordClassGrammar.subConcepts array in lessonData.js
// ============================================================

export const wordClassSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: nouns
  // Nouns — Common, Proper, and Abstract
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "nouns",
    name: "Nouns — Common, Proper, and Abstract",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "nouns-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise common, proper, and abstract nouns (naming words — abstract nouns are things you can't touch, like happiness or fear). You use these every day without even realising!",
          "Why proper nouns need a capital letter — get this right and you'll never lose marks for it"
        ],
        variableSets: [
          {
            name: "Amira",
            sentence: "Amira felt happiness when she saw her dog in the park in London.",
            commonNoun: "dog",
            commonNoun2: "park",
            properNoun: "London",
            abstractNoun: "happiness",
            commonExplain: "You can see and touch a dog — it's a common noun",
            properExplain: "London is the name of a specific place — it needs a capital letter",
            abstractExplain: "You can't touch happiness — it's a feeling, so it's an abstract noun",
            testWord: "happiness",
            testAnswer: "Abstract noun",
            testWhy: "happiness is a feeling — you can't see it or touch it, so it's abstract"
          },
          {
            name: "Charlie",
            sentence: "Charlie felt pride when he scored a goal at Wembley on Saturday.",
            commonNoun: "goal",
            commonNoun2: "goal",
            properNoun: "Wembley",
            abstractNoun: "pride",
            commonExplain: "A goal is a thing you can see — it's a common noun",
            properExplain: "Wembley is the name of a specific stadium — it needs a capital letter",
            abstractExplain: "You can't hold pride in your hands — it's a feeling, so it's abstract",
            testWord: "pride",
            testAnswer: "Abstract noun",
            testWhy: "pride is a feeling you experience inside — you can't see it or touch it"
          },
          {
            name: "Daisy",
            sentence: "Daisy had courage when she read her poem to the class in Manchester.",
            commonNoun: "poem",
            commonNoun2: "class",
            properNoun: "Manchester",
            abstractNoun: "courage",
            commonExplain: "A poem is a thing you can read and hold — it's a common noun",
            properExplain: "Manchester is the name of a specific city — it needs a capital letter",
            abstractExplain: "You can't pick up courage — it's a quality inside you, so it's abstract",
            testWord: "courage",
            testAnswer: "Abstract noun",
            testWhy: "courage is a quality you feel inside — you can't see it or hold it"
          },
          {
            name: "Finn",
            sentence: "Finn felt excitement when his teacher gave him a book in Edinburgh.",
            commonNoun: "book",
            commonNoun2: "teacher",
            properNoun: "Edinburgh",
            abstractNoun: "excitement",
            commonExplain: "A book is something you can hold — it's a common noun",
            properExplain: "Edinburgh is the name of a specific city — it needs a capital letter",
            abstractExplain: "You can't touch excitement — it's a feeling, so it's abstract",
            testWord: "excitement",
            testAnswer: "Abstract noun",
            testWhy: "excitement is a feeling — you can't see it or hold it in your hand"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What type of word is "${v.commonNoun}"?`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\nDid you know this sentence has **three different types of noun** hiding in it? A **noun** (a naming word) is a word for a person, place, thing, or idea. Can you spot them all?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.commonNoun, color: "#3b82f6" }, { word: v.properNoun, color: "#22c55e" }, { word: v.abstractNoun, color: "#f59e0b" }],
                label: "Three types of noun:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three types of noun",
            body: (v) => `Let's look at each noun in the sentence:\n\n**"${v.sentence}"**\n\n**${v.commonNoun}** — ${v.commonExplain}.\n**${v.properNoun}** — ${v.properExplain}.\n**${v.abstractNoun}** — ${v.abstractExplain}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.commonNoun}" → Common noun`, why: v.commonExplain },
                  { text: `"${v.properNoun}" → Proper noun`, why: v.properExplain },
                  { text: `"${v.abstractNoun}" → Abstract noun`, why: v.abstractExplain }
                ]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: '"dog" is a common noun', isTrue: true },
                { text: '"London" is a common noun', isTrue: false },
                { text: '"happiness" is an abstract noun', isTrue: true },
                { text: '"table" is an abstract noun', isTrue: false },
                { text: '"courage" is a proper noun', isTrue: false }
              ],
              feedback: {
                correct: 'Fantastic! Common nouns name everyday things, proper nouns name specific places or people, and abstract nouns name feelings or ideas. You\'re getting the hang of this!',
                incorrect: 'Nearly there! Common = everyday things (dog, table). Proper = specific names (London). Abstract = feelings/ideas (happiness, courage). Give it another go!'
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of noun is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of noun is "${v.testWord}"?`,
              getOptions: () => ["Common noun", "Proper noun", "Abstract noun", "Verb", "Adjective"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! "${v.testWord}" is an abstract noun because ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is an abstract noun — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Three types of noun — you've nailed it!",
            body: () => `Every noun fits into one of these three groups. Here's your quick guide to tell them apart:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Common noun = a general thing", why: "dog, chair, school — no capital letter needed" },
                  { text: "Proper noun = the name of a specific person, place, or thing", why: "London, Tuesday, Mr Smith — always a capital letter" },
                  { text: "Abstract noun = a feeling or idea", why: "love, fear, bravery — you can't touch it ✓" }
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
        id: "nouns-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why proper nouns always need a capital letter — this comes up in the exam all the time!",
          "How to spot when a noun has been wrongly classified"
        ],
        variableSets: [
          {
            name: "Olivia",
            sentence: "olivia went to bristol on tuesday.",
            mistakeExplain: "Olivia, Bristol, and Tuesday are all proper nouns — they name a specific person, city, and day. Proper nouns must start with a capital letter.",
            correctedSentence: "Olivia went to Bristol on Tuesday.",
            properNouns: "Olivia, Bristol, Tuesday",
            testQuestion: "Which word in this sentence should have a capital letter: \"my friend went to cardiff\"?",
            testAnswer: "Cardiff",
            testWhy: "Cardiff is the name of a specific city, so it's a proper noun and needs a capital letter"
          },
          {
            name: "Jack",
            sentence: "jack visited the tower of london on monday.",
            mistakeExplain: "Jack, Tower of London, and Monday are proper nouns — they name a specific person, landmark, and day. They all need capital letters.",
            correctedSentence: "Jack visited the Tower of London on Monday.",
            properNouns: "Jack, Tower of London, Monday",
            testQuestion: "Which word in this sentence should have a capital letter: \"we went swimming in the river thames\"?",
            testAnswer: "Thames",
            testWhy: "Thames is the name of a specific river, so it's a proper noun and needs a capital letter"
          },
          {
            name: "Evie",
            sentence: "evie's family drove to edinburgh in january.",
            mistakeExplain: "Evie, Edinburgh, and January are proper nouns — they name a specific person, city, and month. Each one needs a capital letter.",
            correctedSentence: "Evie's family drove to Edinburgh in January.",
            properNouns: "Evie, Edinburgh, January",
            testQuestion: "Which word in this sentence should have a capital letter: \"the shop is on church street\"?",
            testAnswer: "Church",
            testWhy: "Church Street is the name of a specific road, so it's a proper noun and needs a capital letter"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `Someone wrote this sentence:\n\n*"${v.sentence}"*\n\nSomething's not right here. Can you spot the mistake? Look carefully!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Proper nouns need capital letters!",
            body: (v) => `${v.mistakeExplain}\n\nThe corrected sentence is:\n\n**"${v.correctedSentence}"**\n\nThe proper nouns are: **${v.properNouns}**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.sentence}"`, why: "Missing capital letters on proper nouns" },
                  { text: `RIGHT: "${v.correctedSentence}"`, why: `${v.properNouns} are all proper nouns` },
                  { text: "Proper nouns = specific names", result: "Always use a capital letter!" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.testQuestion}`,
            visual: null,
            interaction: {
              type: "multiple-choice",
              question: (v) => v.testQuestion,
              getOptions: (v) => [v.testAnswer, "friend", "went", "swimming", "the"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.testAnswer}" — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The capital letter rule",
            body: () => `Proper nouns always need a **capital letter**. Here's what counts:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Names of people: Amira, Jack, Mrs Patel", why: "Specific people = capital letter" },
                  { text: "Names of places: London, Bristol, France", why: "Specific places = capital letter" },
                  { text: "Days and months: Monday, January", why: "Specific times = capital letter ✓" }
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
  // SUB-CONCEPT 2: verbs
  // Verbs — Action, Being, and Helping
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "verbs",
    name: "Verbs — Action, Being, and Helping",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "verbs-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot action verbs (doing words), being verbs (am, is, are), and helping verbs (words that support the main verb, like have or will) — verbs are the engine of every sentence!",
          "Why every sentence needs at least one verb — without one, it's like a car without wheels"
        ],
        variableSets: [
          {
            name: "Aisha",
            sentence: "Aisha was running because she could hear the bell.",
            actionVerb: "running",
            actionExplain: "Running is something you do — it's an action verb",
            beingVerb: "was",
            beingExplain: "'Was' tells us about a state of being — it's a being verb (is, am, was, are, were)",
            helpingVerb: "could",
            helpingExplain: "'Could' helps the main verb 'hear' — it's a helping verb (can, could, should, might, will)",
            testWord: "could",
            testAnswer: "Helping verb",
            testWhy: "'could' helps the verb 'hear' — it tells us about ability, so it's a helping verb"
          },
          {
            name: "Ben",
            sentence: "Ben is writing a story because he might enter the competition.",
            actionVerb: "writing",
            actionExplain: "Writing is something you do with a pen or keyboard — it's an action verb",
            beingVerb: "is",
            beingExplain: "'Is' tells us about a state of being — it's a being verb",
            helpingVerb: "might",
            helpingExplain: "'Might' helps the main verb 'enter' — it tells us something is possible but not certain",
            testWord: "might",
            testAnswer: "Helping verb",
            testWhy: "'might' helps the verb 'enter' — it shows possibility, so it's a helping verb"
          },
          {
            name: "Grace",
            sentence: "Grace was painting a picture and she should finish it today.",
            actionVerb: "painting",
            actionExplain: "Painting is something you do with a brush — it's an action verb",
            beingVerb: "was",
            beingExplain: "'Was' tells us about a state of being — it's a being verb",
            helpingVerb: "should",
            helpingExplain: "'Should' helps the main verb 'finish' — it gives advice or expectation",
            testWord: "should",
            testAnswer: "Helping verb",
            testWhy: "'should' helps the verb 'finish' — it suggests what ought to happen, so it's a helping verb"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How many verbs can you find?`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\nDid you know every single sentence you've ever read has a **verb** in it? A verb tells you about an action, a state, or what helps the sentence work. This sentence has **three types** hiding in it — can you find them?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three types of verb",
            body: (v) => `Let's find the verbs in:\n\n**"${v.sentence}"**\n\n**${v.actionVerb}** — ${v.actionExplain}.\n**${v.beingVerb}** — ${v.beingExplain}.\n**${v.helpingVerb}** — ${v.helpingExplain}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.actionVerb}" → Action verb`, why: v.actionExplain },
                  { text: `"${v.beingVerb}" → Being verb`, why: v.beingExplain },
                  { text: `"${v.helpingVerb}" → Helping verb`, why: v.helpingExplain }
                ]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: '"ran" is an action verb', isTrue: true },
                { text: '"is" is an action verb', isTrue: false },
                { text: '"have" is a helping verb', isTrue: true },
                { text: '"jumped" is a being verb', isTrue: false },
                { text: '"was" is a being verb', isTrue: true }
              ],
              feedback: {
                correct: 'Well done! Action verbs show doing, being verbs show existing (is, was, are), and helping verbs support the main verb.',
                incorrect: 'Not quite. Action = doing something (ran, jumped). Being = existing (is, was). Helping = supports another verb (have, will).'
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of verb is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of verb is "${v.testWord}"?`,
              getOptions: () => ["Action verb", "Being verb", "Helping verb", "Noun", "Adjective"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a helping verb — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Three types of verb — brilliant!",
            body: () => `Every sentence needs a verb — and now you know how to spot all three types:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Action verb = a doing word", why: "run, write, eat, jump, sing" },
                  { text: "Being verb = am, is, are, was, were", why: "They tell us about a state, not an action" },
                  { text: "Helping verb = can, could, should, might, will", why: "They help the main verb — never appear alone ✓" }
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
        id: "verbs-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to check a sentence has a verb — the quickest grammar check you'll ever learn!",
          "Why a group of words without a verb is not a sentence"
        ],
        variableSets: [
          {
            name: "Tom",
            wrongSentence: "The tall boy with the red backpack.",
            mistake: "There's no verb — we don't know what the boy is doing or being",
            fixedSentence: "The tall boy with the red backpack ran to school.",
            addedVerb: "ran",
            testFragment: "The old castle on the hill.",
            testAnswer: "No — it has no verb",
            testWhy: "this group of words has no verb, so it's not a complete sentence. It needs a doing or being word"
          },
          {
            name: "Ella",
            wrongSentence: "A beautiful sunset over the quiet village.",
            mistake: "There's no verb — nothing is happening",
            fixedSentence: "A beautiful sunset glowed over the quiet village.",
            addedVerb: "glowed",
            testFragment: "My best friend from primary school.",
            testAnswer: "No — it has no verb",
            testWhy: "there's no verb telling us what happened. We need a word like 'visited' or 'laughed' to make it a sentence"
          },
          {
            name: "Ravi",
            wrongSentence: "Three excited children near the swimming pool.",
            mistake: "There's no verb — we don't know what the children are doing",
            fixedSentence: "Three excited children splashed near the swimming pool.",
            addedVerb: "splashed",
            testFragment: "The library with hundreds of books.",
            testAnswer: "No — it has no verb",
            testWhy: "there's no verb. We need a doing or being word like 'stood' or 'was' to make it a complete sentence"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Is this a proper sentence?",
            body: (v) => `${v.name} wrote this:\n\n*"${v.wrongSentence}"*\n\nIt looks like a sentence... but something really important is missing! Can you work out what?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Read carefully:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Every sentence needs a verb!",
            body: (v) => `${v.mistake}.\n\nWithout a verb, it's just a **fragment** (an incomplete sentence). Watch what happens when we add a verb:\n\n**"${v.fixedSentence}"**\n\nNow it's a complete sentence because **"${v.addedVerb}"** tells us what happened.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Fragment: "${v.wrongSentence}"`, why: "No verb = not a sentence" },
                  { text: `Add a verb: "${v.addedVerb}"`, why: "Now we know what happened!" },
                  { text: `Sentence: "${v.fixedSentence}"`, result: "Complete sentence!" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Is this a complete sentence?\n\n*"${v.testFragment}"*`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is "${v.testFragment}" a complete sentence?`,
              getOptions: () => ["Yes — it's complete", "No — it has no verb", "No — it has no noun", "No — it has no adjective", "Yes — it has a full stop"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! That's right — ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.testAnswer}" because ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The verb rule for sentences",
            body: () => `A group of words is only a sentence if it has a **verb**. No verb = just a fragment.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Every sentence needs a verb", why: "A doing, being, or helping word" },
                  { text: "No verb = a fragment (not a sentence)", why: "'The tall boy.' — what about him?" },
                  { text: "Add a verb to fix it", why: "'The tall boy ran home.' — now it's complete! ✓" }
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
  // SUB-CONCEPT 3: adjectives-adverbs
  // Adjectives and Adverbs
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "adjectives-adverbs",
    name: "Adjectives and Adverbs",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "adjectives-adverbs-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell adjectives (describing words) and adverbs (words that describe how, when, or where something happens) apart — they're easily confused, but you'll learn the trick!",
          "Why adjectives describe nouns (naming words) and adverbs describe verbs (doing words)"
        ],
        variableSets: [
          {
            name: "Sophie",
            sentence: "The tiny kitten purred loudly on the soft blanket.",
            adjective1: "tiny",
            adjective1Noun: "kitten",
            adjective2: "soft",
            adjective2Noun: "blanket",
            adverb: "loudly",
            adverbVerb: "purred",
            testWord: "loudly",
            testAnswer: "Adverb",
            testWhy: "'loudly' describes how the kitten purred — it tells us more about the verb, so it's an adverb"
          },
          {
            name: "Liam",
            sentence: "The brave firefighter quickly climbed the tall ladder.",
            adjective1: "brave",
            adjective1Noun: "firefighter",
            adjective2: "tall",
            adjective2Noun: "ladder",
            adverb: "quickly",
            adverbVerb: "climbed",
            testWord: "quickly",
            testAnswer: "Adverb",
            testWhy: "'quickly' describes how the firefighter climbed — it tells us more about the verb, so it's an adverb"
          },
          {
            name: "Zara",
            sentence: "The clever fox silently crept through the dark forest.",
            adjective1: "clever",
            adjective1Noun: "fox",
            adjective2: "dark",
            adjective2Noun: "forest",
            adverb: "silently",
            adverbVerb: "crept",
            testWord: "silently",
            testAnswer: "Adverb",
            testWhy: "'silently' describes how the fox crept — it tells us more about the verb, so it's an adverb"
          },
          {
            name: "Noah",
            sentence: "The friendly dog happily wagged its long tail.",
            adjective1: "friendly",
            adjective1Noun: "dog",
            adjective2: "long",
            adjective2Noun: "tail",
            adverb: "happily",
            adverbVerb: "wagged",
            testWord: "happily",
            testAnswer: "Adverb",
            testWhy: "'happily' describes how the dog wagged — it tells us more about the verb, so it's an adverb"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Adjective or adverb?`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\n**Adjectives** (describing words) describe nouns (things). **Adverbs** describe verbs (actions — how something is done). They both make sentences more interesting — but they do different jobs! Knowing which is which is a real 11+ superpower.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Adjectives describe nouns, adverbs describe verbs",
            body: (v) => `In the sentence: **"${v.sentence}"**\n\n**"${v.adjective1}"** describes the noun **"${v.adjective1Noun}"** → it's an **adjective**.\n**"${v.adjective2}"** describes the noun **"${v.adjective2Noun}"** → it's an **adjective**.\n**"${v.adverb}"** describes the verb **"${v.adverbVerb}"** → it's an **adverb**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.adjective1}" → Adjective`, why: `Describes the ${v.adjective1Noun} (a noun)` },
                  { text: `"${v.adjective2}" → Adjective`, why: `Describes the ${v.adjective2Noun} (a noun)` },
                  { text: `"${v.adverb}" → Adverb`, why: `Describes how something ${v.adverbVerb} (a verb)` }
                ]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: '"quickly" is an adverb', isTrue: true },
                { text: '"beautiful" is an adverb', isTrue: false },
                { text: '"slowly" is an adjective', isTrue: false },
                { text: '"enormous" is an adjective', isTrue: true },
                { text: '"carefully" is an adverb', isTrue: true }
              ],
              feedback: {
                correct: 'Well done! Adjectives describe nouns (what kind?) and adverbs describe verbs (how?).',
                incorrect: 'Not quite. Adjectives describe nouns (beautiful, enormous). Adverbs describe verbs — many end in -ly (quickly, slowly, carefully).'
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nIs **"${v.testWord}"** an adjective or an adverb?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is "${v.testWord}" an adjective or an adverb?`,
              getOptions: () => ["Adjective", "Adverb", "Noun", "Verb", "Pronoun"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is an adverb — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Adjective vs adverb — the easy test",
            body: () => `Here's a simple trick that works every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Ask: does it describe a THING?", why: "If yes → adjective (the tall tree, a red bus)" },
                  { text: "Ask: does it describe an ACTION?", why: "If yes → adverb (ran quickly, sang beautifully)" },
                  { text: "Many adverbs end in -ly", why: "But not all! 'fast' and 'well' are adverbs too ✓" }
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
        id: "adjectives-adverbs-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why you can't use an adjective (describing word) where an adverb (how/when/where word) belongs",
          "How to fix adjective/adverb mix-ups"
        ],
        variableSets: [
          {
            name: "Harry",
            wrongSentence: "Harry ran quick to the shop.",
            mistake: "used 'quick' (an adjective) instead of 'quickly' (an adverb)",
            fixedSentence: "Harry ran quickly to the shop.",
            wrongWord: "quick",
            correctWord: "quickly",
            rule: "'Quick' describes a thing (adjective), but here we need a word to describe how Harry ran (adverb)",
            testSentence: "She sang beautiful at the concert.",
            testWrongWord: "beautiful",
            testCorrectWord: "beautifully",
            testAnswer: "beautifully",
            testWhy: "'beautiful' is an adjective, but we need an adverb to describe how she sang — the correct word is 'beautifully'"
          },
          {
            name: "Mia",
            wrongSentence: "Mia wrote her name neat on the page.",
            mistake: "used 'neat' (an adjective) instead of 'neatly' (an adverb)",
            fixedSentence: "Mia wrote her name neatly on the page.",
            wrongWord: "neat",
            correctWord: "neatly",
            rule: "'Neat' describes a thing (adjective), but here we need a word to describe how Mia wrote (adverb)",
            testSentence: "The dog barked fierce at the postman.",
            testWrongWord: "fierce",
            testCorrectWord: "fiercely",
            testAnswer: "fiercely",
            testWhy: "'fierce' is an adjective, but we need an adverb to describe how the dog barked — the correct word is 'fiercely'"
          },
          {
            name: "Ethan",
            wrongSentence: "Ethan spoke quiet during the assembly.",
            mistake: "used 'quiet' (an adjective) instead of 'quietly' (an adverb)",
            fixedSentence: "Ethan spoke quietly during the assembly.",
            wrongWord: "quiet",
            correctWord: "quietly",
            rule: "'Quiet' describes a thing (adjective), but here we need a word to describe how Ethan spoke (adverb)",
            testSentence: "The car drove slow through the village.",
            testWrongWord: "slow",
            testCorrectWord: "slowly",
            testAnswer: "slowly",
            testWhy: "'slow' is an adjective, but we need an adverb to describe how the car drove — the correct word is 'slowly'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} wrote this:\n\n*"${v.wrongSentence}"*\n\nIt sounds almost right... but one sneaky word is wrong. Can you spot it? This mistake catches out grown-ups too!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Read carefully:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Adjective used where an adverb belongs!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.\n\nThe corrected sentence is:\n**"${v.fixedSentence}"**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongWord}"`, why: "This is an adjective (describes a thing)" },
                  { text: `RIGHT: "${v.correctWord}"`, why: "This is an adverb (describes how something is done)" },
                  { text: `"${v.fixedSentence}"`, result: "Now the sentence is correct!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"She ran quick" is correct because "quick" describes the running`, answer: false, explanation: `No! "Quick" is an adjective, but we need an adverb to describe HOW she ran. The correct form is "She ran quickly." ✓` },
                { text: `Adverbs often end in "-ly" and describe how an action is done`, answer: true, explanation: `Correct! Most adverbs are formed by adding "-ly" to an adjective: quick → quickly, careful → carefully. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `This sentence has the same type of mistake:\n\n*"${v.testSentence}"*\n\nWhat should **"${v.testWrongWord}"** be changed to?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What should "${v.testWrongWord}" be changed to?`,
              getOptions: (v) => [v.testCorrectWord, v.testWrongWord, "more " + v.testWrongWord, "very " + v.testWrongWord, "most " + v.testWrongWord],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The correct word is "${v.testCorrectWord}" — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The adjective/adverb swap rule",
            body: () => `If a word describes **how something is done**, it must be an **adverb** — not an adjective.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Adjectives describe things (nouns)", why: "a quick runner, a neat page" },
                  { text: "Adverbs describe actions (verbs)", why: "ran quickly, wrote neatly" },
                  { text: "To fix: add -ly to make it an adverb", why: "quick → quickly, neat → neatly ✓" }
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
  // SUB-CONCEPT 4: pronouns-prepositions
  // Pronouns and Prepositions
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "pronouns-prepositions",
    name: "Pronouns and Prepositions",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "pronouns-prepositions-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to use pronouns (words like he, she, it, they that replace a noun) to avoid repetition",
          "How to recognise that prepositions (position words like in, on, under, between) show where or when something is"
        ],
        variableSets: [
          {
            name: "Poppy",
            clunkySentence: "Poppy put Poppy's bag on the chair. Then Poppy sat beside the chair.",
            improvedSentence: "Poppy put her bag on the chair. Then she sat beside it.",
            pronoun1: "her",
            pronoun1Replaces: "Poppy's",
            pronoun2: "she",
            pronoun2Replaces: "Poppy",
            pronoun3: "it",
            pronoun3Replaces: "the chair",
            preposition1: "on",
            preposition1Shows: "where the bag is (position)",
            preposition2: "beside",
            preposition2Shows: "where she sat (position)",
            testWord: "beside",
            testAnswer: "Preposition",
            testWhy: "'beside' shows where Poppy sat in relation to the chair — it tells us position, so it's a preposition"
          },
          {
            name: "Alfie",
            clunkySentence: "Alfie left Alfie's book under the desk. After lunch, Alfie looked for the book.",
            improvedSentence: "Alfie left his book under the desk. After lunch, he looked for it.",
            pronoun1: "his",
            pronoun1Replaces: "Alfie's",
            pronoun2: "he",
            pronoun2Replaces: "Alfie",
            pronoun3: "it",
            pronoun3Replaces: "the book",
            preposition1: "under",
            preposition1Shows: "where the book is (position)",
            preposition2: "after",
            preposition2Shows: "when he looked (time)",
            testWord: "under",
            testAnswer: "Preposition",
            testWhy: "'under' shows where the book was in relation to the desk — it tells us position, so it's a preposition"
          },
          {
            name: "Isla",
            clunkySentence: "Isla hid Isla's present behind the sofa. Before the party, Isla wrapped the present.",
            improvedSentence: "Isla hid her present behind the sofa. Before the party, she wrapped it.",
            pronoun1: "her",
            pronoun1Replaces: "Isla's",
            pronoun2: "she",
            pronoun2Replaces: "Isla",
            pronoun3: "it",
            pronoun3Replaces: "the present",
            preposition1: "behind",
            preposition1Shows: "where the present is (position)",
            preposition2: "before",
            preposition2Shows: "when she wrapped it (time)",
            testWord: "behind",
            testAnswer: "Preposition",
            testWhy: "'behind' shows where the present was in relation to the sofa — it tells us position, so it's a preposition"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Why does this sound odd?`,
            body: (v) => `Read this sentence:\n\n*"${v.clunkySentence}"*\n\nYikes — that sounds clunky because the name **${v.name}** is repeated too many times! **Pronouns** (words used instead of a name, like 'he', 'she', 'they') fix this. Imagine how annoying conversations would be if we had to say everyone's name every single time!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.clunkySentence,
                highlightWords: [],
                label: "This sentence sounds clunky:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Pronouns replace nouns, prepositions show position",
            body: (v) => `Look how pronouns make the sentence better:\n\n**"${v.improvedSentence}"**\n\n**"${v.pronoun1}"** replaces **"${v.pronoun1Replaces}"**\n**"${v.pronoun2}"** replaces **"${v.pronoun2Replaces}"**\n**"${v.pronoun3}"** replaces **"${v.pronoun3Replaces}"**\n\nAnd the **prepositions** (words that show position or time): **"${v.preposition1}"** shows ${v.preposition1Shows}, **"${v.preposition2}"** shows ${v.preposition2Shows}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pronoun2}" replaces "${v.pronoun2Replaces}"`, why: "Pronoun — avoids repeating the name" },
                  { text: `"${v.pronoun1}" replaces "${v.pronoun1Replaces}"`, why: "Pronoun — avoids repeating the name" },
                  { text: `"${v.preposition1}" shows ${v.preposition1Shows}`, why: "Preposition — tells us where or when" },
                  { text: `"${v.preposition2}" shows ${v.preposition2Shows}`, why: "Preposition — tells us where or when" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A pronoun replaces a ____ to avoid repetition`,
              options: (v) => ["noun", "verb", "adjective", "preposition"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! Pronouns like "he", "she", "it", and "they" replace nouns so we don't keep repeating names. ✓`,
                incorrect: (v) => `Not quite — a pronoun replaces a NOUN. Instead of saying "Daisy" over and over, we say "she".`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.improvedSentence}"*\n\nWhat type of word is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Is "${v.testWord}" a pronoun or a preposition?`,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: "Which word class?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of word is "${v.testWord}"?`,
              getOptions: () => ["Pronoun", "Preposition", "Noun", "Verb", "Adjective"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a preposition — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Pronouns and prepositions — well done!",
            body: () => `Great work! These two word types do very different jobs:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Pronoun = replaces a noun", why: "he, she, it, they, we, his, her, them" },
                  { text: "Preposition = shows position or time", why: "in, on, at, under, behind, before, after" },
                  { text: "Quick test: can it replace a name?", why: "Yes → pronoun. No → probably a preposition ✓" }
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
        id: "pronouns-prepositions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why using the wrong pronoun (a word like he, she, it, they) causes confusion",
          "How to check a pronoun matches the noun it replaces"
        ],
        variableSets: [
          {
            name: "Lucas",
            wrongSentence: "Lucas told Maya that he needed his book back, but she said it was hers. Then he lost them.",
            mistake: "used 'them' at the end, but it should be 'it' because he's talking about one book",
            wrongPronoun: "them",
            correctPronoun: "it",
            rule: "'them' is a plural pronoun (for more than one thing), but there's only one book — so we need 'it'",
            fixedSentence: "Lucas told Maya that he needed his book back, but she said it was hers. Then he lost it.",
            testSentence: "Ella and her friend went to the park. He had a great time.",
            testWrongWord: "He",
            testCorrectWord: "They",
            testAnswer: "They",
            testWhy: "the sentence is about Ella AND her friend (two people), so we need 'they' not 'he'"
          },
          {
            name: "Ruby",
            wrongSentence: "Ruby and Oliver baked some cakes. Then he ate it all.",
            mistake: "used 'he' when talking about both Ruby and Oliver, and 'it' when there are many cakes",
            wrongPronoun: "he",
            correctPronoun: "they",
            rule: "'he' means one boy, but both Ruby and Oliver ate the cakes — and 'it' should be 'them' because there are many cakes",
            fixedSentence: "Ruby and Oliver baked some cakes. Then they ate them all.",
            testSentence: "The girls finished their homework. Then he went outside.",
            testWrongWord: "he",
            testCorrectWord: "they",
            testAnswer: "they",
            testWhy: "the sentence is about 'the girls' (plural, female), so the pronoun should be 'they' not 'he'"
          },
          {
            name: "Max",
            wrongSentence: "Max gave his sister a present. He was really happy to open them.",
            mistake: "used 'He' when it should be 'She' (the sister is opening the present), and 'them' should be 'it' (one present)",
            wrongPronoun: "He",
            correctPronoun: "She",
            rule: "'He' refers to Max, but it's the sister who opened the present — and 'them' should be 'it' because there's one present",
            fixedSentence: "Max gave his sister a present. She was really happy to open it.",
            testSentence: "Dad made dinner for the children. She ate it quickly.",
            testWrongWord: "She",
            testCorrectWord: "They",
            testAnswer: "They",
            testWhy: "'the children' is plural, so we need the plural pronoun 'they' — not 'she' which means one girl"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the pronoun mistake?",
            body: (v) => `Someone wrote this:\n\n*"${v.wrongSentence}"*\n\nThe pronouns don't match properly. Can you spot what's wrong?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Read carefully:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Pronouns must match!",
            body: (v) => `The mistake: ${v.name} ${v.mistake}.\n\n${v.rule}.\n\nCorrected: **"${v.fixedSentence}"**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongPronoun}"`, why: "Doesn't match the noun it replaces" },
                  { text: `RIGHT: "${v.correctPronoun}"`, why: "Now it matches!" },
                  { text: "Pronouns must match in number and gender", result: "One person = he/she, many = they" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What's wrong with this sentence?\n\n*"${v.testSentence}"*\n\nWhat should **"${v.testWrongWord}"** be?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What should "${v.testWrongWord}" be changed to?`,
              getOptions: (v) => [v.testCorrectWord, "He", "She", "It", "We"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.testCorrectWord}" because ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Pronoun matching rules",
            body: () => `A pronoun must match the noun it replaces. Check these three things:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Number: one = he/she/it, many = they/them", why: "One dog = it, three dogs = them" },
                  { text: "Gender: male = he/him, female = she/her", why: "Match the person you're talking about" },
                  { text: "Read it back: does it make sense?", why: "If it sounds odd, the pronoun is probably wrong ✓" }
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
  // SUB-CONCEPT 5: conjunctions-determiners
  // Conjunctions and Determiners
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "conjunctions-determiners",
    name: "Conjunctions and Determiners",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "conjunctions-determiners-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise that conjunctions (joining words like and, but, because) join words, phrases, or sentences",
          "How to spot determiners (words like the, a, this, some that sit before a noun)"
        ],
        variableSets: [
          {
            name: "Phoebe",
            sentence: "Phoebe wanted the cake and the biscuit, but she could only pick some of them because her mum said every treat costs money.",
            conjunction1: "and",
            conjunction1Job: "joins two things Phoebe wanted (cake and biscuit)",
            conjunction2: "but",
            conjunction2Job: "introduces a contrast (she wanted both, but could only pick some)",
            conjunction3: "because",
            conjunction3Job: "gives the reason (why she could only pick some)",
            determiner1: "the",
            determiner1Noun: "cake",
            determiner1Job: "tells us which cake — a specific one",
            determiner2: "some",
            determiner2Noun: "them",
            determiner2Job: "tells us how many — not all of them",
            determiner3: "every",
            determiner3Noun: "treat",
            determiner3Job: "means all of them, each one",
            testWord: "because",
            testAnswer: "Conjunction",
            testWhy: "'because' joins two parts of the sentence and gives a reason — it's a conjunction"
          },
          {
            name: "Oscar",
            sentence: "Oscar ate an apple and a banana, but he was still hungry because every portion was small.",
            conjunction1: "and",
            conjunction1Job: "joins the apple and banana together",
            conjunction2: "but",
            conjunction2Job: "introduces a contrast (he ate, but was still hungry)",
            conjunction3: "because",
            conjunction3Job: "gives the reason (why he was still hungry)",
            determiner1: "an",
            determiner1Noun: "apple",
            determiner1Job: "tells us it's one apple (not a specific one)",
            determiner2: "a",
            determiner2Noun: "banana",
            determiner2Job: "tells us it's one banana (not a specific one)",
            determiner3: "every",
            determiner3Noun: "portion",
            determiner3Job: "means all the portions, each one",
            testWord: "but",
            testAnswer: "Conjunction",
            testWhy: "'but' joins two parts of the sentence and shows a contrast — it's a conjunction"
          },
          {
            name: "Freya",
            sentence: "Freya needed some paper and many pencils, but the shop was closed because it was a holiday.",
            conjunction1: "and",
            conjunction1Job: "joins paper and pencils together",
            conjunction2: "but",
            conjunction2Job: "introduces a contrast (she needed things, but the shop was closed)",
            conjunction3: "because",
            conjunction3Job: "gives the reason (why the shop was closed)",
            determiner1: "some",
            determiner1Noun: "paper",
            determiner1Job: "tells us how much — not a lot, not none",
            determiner2: "many",
            determiner2Noun: "pencils",
            determiner2Job: "tells us how many — a large number",
            determiner3: "the",
            determiner3Noun: "shop",
            determiner3Job: "tells us which shop — a specific one",
            testWord: "and",
            testAnswer: "Conjunction",
            testWhy: "'and' joins two things together (paper and pencils) — it's a conjunction"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Two small but mighty word types!`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\nDid you know some of the smallest words in English do the biggest jobs? **Conjunctions** (joining words like 'and', 'but', 'because') connect parts of a sentence. **Determiners** sit before nouns and tell us *which one* or *how many*.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Conjunctions join, determiners specify",
            body: (v) => `In the sentence: **"${v.sentence}"**\n\n**Conjunctions** (joining words):\n"${v.conjunction1}" — ${v.conjunction1Job}\n"${v.conjunction2}" — ${v.conjunction2Job}\n"${v.conjunction3}" — ${v.conjunction3Job}\n\n**Determiners** (words before a noun that tell which one):\n"${v.determiner1}" before "${v.determiner1Noun}" — ${v.determiner1Job}\n"${v.determiner2}" before "${v.determiner2Noun}" — ${v.determiner2Job}\n"${v.determiner3}" before "${v.determiner3Noun}" — ${v.determiner3Job}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.conjunction1}" → Conjunction`, why: v.conjunction1Job },
                  { text: `"${v.conjunction2}" → Conjunction`, why: v.conjunction2Job },
                  { text: `"${v.determiner1}" → Determiner`, why: `Sits before "${v.determiner1Noun}" — ${v.determiner1Job}` },
                  { text: `"${v.determiner3}" → Determiner`, why: `Sits before "${v.determiner3Noun}" — ${v.determiner3Job}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find words that JOIN two ideas together — these are conjunctions`,
                `Find words that sit BEFORE a noun and tell which one — these are determiners`,
                `Check: does the conjunction join equal ideas (coordinating) or create dependence (subordinating)?`
              ],
              feedback: {
                correct: (v) => `Perfect! Conjunctions join ideas, determiners sit before nouns, and the type depends on whether the ideas are equal. ✓`,
                incorrect: (v) => `Not quite — start by finding joining words (conjunctions), then words before nouns (determiners).`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of word is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of word is "${v.testWord}"?`,
              getOptions: () => ["Conjunction", "Determiner", "Pronoun", "Verb", "Preposition"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a conjunction — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Conjunctions and determiners — sorted!",
            body: () => `Brilliant work! Here's the simple way to tell them apart:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Conjunction = a joining word", why: "and, but, because, so, or, although" },
                  { text: "Determiner = sits right before a noun", why: "a, the, some, many, every, this, those" },
                  { text: "Quick test: does it join two things?", why: "Yes → conjunction. Does it come before a noun? → determiner ✓" }
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
        id: "conjunctions-determiners-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to pick the right conjunction (joining word) for the meaning",
          "Why 'and', 'but', and 'because' are not interchangeable"
        ],
        variableSets: [
          {
            name: "Jasmine",
            wrongSentence: "Jasmine was tired and she kept working.",
            mistake: "used 'and' when 'but' would be better, because the two parts contrast (tired vs kept working)",
            fixedSentence: "Jasmine was tired but she kept working.",
            wrongConjunction: "and",
            correctConjunction: "but",
            rule: "'And' joins things that go together. 'But' joins things that contrast. Being tired and keeping working are opposites, so 'but' fits.",
            testSentence: "The film was boring and I turned it off.",
            testWrongWord: "and",
            testCorrectWord: "so",
            testAnswer: "so",
            testWhy: "the boring film is the reason for turning it off — 'so' shows a result, which fits better than 'and'"
          },
          {
            name: "Leo",
            wrongSentence: "Leo studied hard because he failed the test.",
            mistake: "used 'because' when 'but' would be correct — studying hard didn't cause him to fail; these are contrasting facts",
            fixedSentence: "Leo studied hard but he failed the test.",
            wrongConjunction: "because",
            correctConjunction: "but",
            rule: "'Because' gives a reason. 'But' shows a contrast. Studying hard and failing are opposites, so 'but' is right.",
            testSentence: "It was raining because we took an umbrella.",
            testWrongWord: "because",
            testCorrectWord: "so",
            testAnswer: "so",
            testWhy: "the rain is the reason we took an umbrella — 'so' shows the result, not 'because' which would mean the umbrella caused the rain"
          },
          {
            name: "Holly",
            wrongSentence: "Holly ate her lunch because she was still hungry.",
            mistake: "used 'because' when 'but' would be correct — eating lunch didn't cause the hunger; these are contrasting facts",
            fixedSentence: "Holly ate her lunch but she was still hungry.",
            wrongConjunction: "because",
            correctConjunction: "but",
            rule: "'Because' gives a reason. 'But' shows a contrast. Eating lunch and still being hungry are opposites, so 'but' is right.",
            testSentence: "The weather was lovely because we stayed indoors.",
            testWrongWord: "because",
            testCorrectWord: "but",
            testAnswer: "but",
            testWhy: "lovely weather and staying indoors are opposites — 'but' shows contrast, while 'because' wrongly says the weather caused them to stay in"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the wrong conjunction?",
            body: (v) => `${v.name} wrote this:\n\n*"${v.wrongSentence}"*\n\nThe sentence makes sense grammatically, but the **conjunction** gives the wrong meaning. Can you spot which one?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Read carefully:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Different conjunctions, different meanings!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}\n\nThe corrected sentence:\n**"${v.fixedSentence}"**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG conjunction: "${v.wrongConjunction}"`, why: "Gives the wrong meaning" },
                  { text: `RIGHT conjunction: "${v.correctConjunction}"`, why: "Now the meaning is clear" },
                  { text: `"and" = adds, "but" = contrasts, "because" = gives reason`, result: "Pick the one that matches the meaning!" }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `This sentence uses the wrong conjunction:\n\n*"${v.testSentence}"*\n\nWhat should **"${v.testWrongWord}"** be changed to?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What should "${v.testWrongWord}" be changed to?`,
              getOptions: () => ["and", "but", "because", "so", "or"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The best conjunction here is "${v.testCorrectWord}" — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Choosing the right conjunction",
            body: () => `Each conjunction has a specific job. Pick the one that matches the **meaning** you want:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "\"and\" = adding two things together", why: "I like cake and biscuits" },
                  { text: "\"but\" = showing a contrast or surprise", why: "I was tired but I kept going" },
                  { text: "\"because\" = giving a reason, \"so\" = showing a result", why: "I was tired because I ran. I was tired so I sat down. ✓" }
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
  // SUB-CONCEPT 6: words-changing-class
  // Words That Change Class in Context
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "words-changing-class",
    name: "Words That Change Class in Context",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "words-changing-class-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to understand that the same word can be a different word class (noun, verb, adjective, etc.) in different sentences — this blows people's minds!",
          "How to use the 'function test' — ask what job the word is doing right now"
        ],
        variableSets: [
          {
            name: "Aisha",
            word: "light",
            sentence1: "Please switch on the light.",
            class1: "noun",
            explain1: "Here 'light' is a thing you can switch on — it's a noun",
            sentence2: "This bag is very light.",
            class2: "adjective",
            explain2: "Here 'light' describes the bag (not heavy) — it's an adjective",
            sentence3: "Can you light the candle?",
            class3: "verb",
            explain3: "Here 'light' is an action (setting fire to something) — it's a verb",
            testSentence: "This bag is very light.",
            testAnswer: "Adjective",
            testWhy: "'light' describes the bag — it tells us the bag is not heavy, so it's doing the job of an adjective"
          },
          {
            name: "Ben",
            word: "run",
            sentence1: "I love to run in the park.",
            class1: "verb",
            explain1: "Here 'run' is an action — something you do with your legs — it's a verb",
            sentence2: "Charlie went for a run before breakfast.",
            class2: "noun",
            explain2: "Here 'a run' is a thing (an event or activity) — it's a noun",
            sentence3: "We had a run of bad luck this week.",
            class3: "noun",
            explain3: "Here 'a run' means a series or stretch of something — it's a noun",
            testSentence: "Charlie went for a run before breakfast.",
            testAnswer: "Noun",
            testWhy: "'a run' is a thing Charlie went for — you can say 'a run', so it's acting as a noun, not a verb"
          },
          {
            name: "Daisy",
            word: "fast",
            sentence1: "Ella has a fast car.",
            class1: "adjective",
            explain1: "Here 'fast' describes the car (what kind of car?) — it's an adjective",
            sentence2: "She ran fast to catch the bus.",
            class2: "adverb",
            explain2: "Here 'fast' describes how she ran (the action) — it's an adverb",
            sentence3: "During Ramadan, some people fast for the whole day.",
            class3: "verb",
            explain3: "Here 'fast' means to go without food — it's an action, so it's a verb",
            testSentence: "She ran fast to catch the bus.",
            testAnswer: "Adverb",
            testWhy: "'fast' tells us HOW she ran — it describes the verb 'ran', so it's working as an adverb"
          },
          {
            name: "Finn",
            word: "round",
            sentence1: "The ball is round.",
            class1: "adjective",
            explain1: "Here 'round' describes the shape of the ball — it's an adjective",
            sentence2: "We walked round the corner.",
            class2: "preposition",
            explain2: "Here 'round' shows direction (where we walked) — it's a preposition",
            sentence3: "It's your turn in the next round.",
            class3: "noun",
            explain3: "Here 'round' is a thing (a stage in a game) — it's a noun",
            testSentence: "We walked round the corner.",
            testAnswer: "Preposition",
            testWhy: "'round' shows the direction of the walking — it tells us WHERE in relation to the corner, so it's a preposition"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `One word, three different jobs!`,
            body: (v) => `The word **"${v.word}"** can be used in completely different ways — how cool is that?\n\n1. *"${v.sentence1}"*\n2. *"${v.sentence2}"*\n3. *"${v.sentence3}"*\n\nSame word, but the **job it does** changes every time. In the 11+ exam, you need to work out what job the word is doing in THAT sentence.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence1,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `What type of word is "${v.word}" here?`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Function Test — what job is the word doing?",
            body: (v) => `Let's test the word **"${v.word}"** in each sentence:\n\n**"${v.sentence1}"** — ${v.explain1}.\n**"${v.sentence2}"** — ${v.explain2}.\n**"${v.sentence3}"** — ${v.explain3}.\n\nThe trick: don't think about what the word *usually* is. Think about what job it's doing **right now**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.sentence1}" → ${v.class1}`, why: v.explain1 },
                  { text: `"${v.sentence2}" → ${v.class2}`, why: v.explain2 },
                  { text: `"${v.sentence3}" → ${v.class3}`, why: v.explain3 }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A word like "${v.word}" can only ever belong to one word class`, answer: false, explanation: `No! "${v.word}" can be different word classes depending on context. It can be a ${v.class1} or a ${v.class2} — the sentence tells you which. ✓` },
                { text: `To find a word's class, you need to look at what job it's doing in that particular sentence`, answer: true, explanation: `Correct! The same word can do different jobs. Always check what it's doing RIGHT NOW in the sentence. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In this sentence:\n*"${v.testSentence}"*\n\nWhat word class is **"${v.word}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `What type of word is "${v.word}" here?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What word class is "${v.word}" in this sentence?`,
              getOptions: () => ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.testAnswer}" — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The Function Test — your go-to strategy!",
            body: () => `Many English words can be different word classes — and now you know how to handle them. The exam loves testing this! Here's your strategy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the whole sentence carefully", why: "Context is everything!" },
                  { text: "Step 2: Ask — what job is this word doing?", why: "Is it naming, describing, doing, or showing position?" },
                  { text: "Step 3: Match the job to the word class", why: "Naming = noun, describing a thing = adjective, doing = verb, describing an action = adverb ✓" }
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
        id: "words-changing-class-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to identify the word class (noun, verb, adjective, etc.) of the SAME word in different sentences",
          "Why context changes everything about a word's class"
        ],
        variableSets: [
          {
            name: "Grace",
            word: "play",
            sentenceA: "The children play football every Saturday.",
            classA: "verb",
            sentenceB: "We went to see a play at the theatre.",
            classB: "noun",
            mistakeStatement: "Someone said 'play' is always a verb.",
            mistakeExplain: "That's wrong! In 'We went to see a play', the word 'play' is a noun — it's a thing you can watch at the theatre.",
            testSentence: "Ella scored a brilliant play in the netball match.",
            testAnswer: "Noun",
            testWhy: "'a play' is a thing (a move or action in a game) — you can put 'a' before it, which shows it's a noun"
          },
          {
            name: "Charlie",
            word: "clean",
            sentenceA: "Please clean your bedroom.",
            classA: "verb",
            sentenceB: "The kitchen is clean.",
            classB: "adjective",
            mistakeStatement: "Someone said 'clean' is always a verb.",
            mistakeExplain: "That's wrong! In 'The kitchen is clean', the word 'clean' describes the kitchen — it's an adjective.",
            testSentence: "The water in this stream is very clean.",
            testAnswer: "Adjective",
            testWhy: "'clean' describes the water (what the water is like) — and you can put 'very' before it, which is a clue it's an adjective"
          },
          {
            name: "Ella",
            word: "park",
            sentenceA: "We had a picnic in the park.",
            classA: "noun",
            sentenceB: "Dad had to park the car on a side street.",
            classB: "verb",
            mistakeStatement: "Someone said 'park' is always a noun.",
            mistakeExplain: "That's wrong! In 'Dad had to park the car', the word 'park' is an action — it's a verb meaning to leave the car somewhere.",
            testSentence: "Can you park closer to the school gates?",
            testAnswer: "Verb",
            testWhy: "'park' is an action here — it means to stop and leave a vehicle somewhere, so it's a verb"
          },
          {
            name: "Finn",
            word: "back",
            sentenceA: "My back hurts from carrying the heavy bag.",
            classA: "noun",
            sentenceB: "Please step back from the edge.",
            classB: "adverb",
            mistakeStatement: "Someone said 'back' is always a noun.",
            mistakeExplain: "That's wrong! In 'Please step back', the word 'back' describes the direction of the stepping — it's an adverb.",
            testSentence: "The cat jumped onto the back fence.",
            testAnswer: "Adjective",
            testWhy: "'back' describes which fence (the one at the back) — it's telling us about the noun 'fence', so it's an adjective"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.word}" always a ${v.classA}?`,
            body: (v) => `${v.mistakeStatement} But is that really true?`,
            bodyParts: (v) => [
              { type: 'text', content: (v) => `${v.mistakeStatement} Look at these two sentences:` },
              { type: 'visual', component: 'SentenceDisplay', props: (v) => ({
                mode: "highlight",
                text: v.sentenceA,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `"${v.word}" as a ${v.classA}:`
              })},
              { type: 'visual', component: 'SentenceDisplay', props: (v) => ({
                mode: "highlight",
                text: v.sentenceB,
                highlightWords: [{ word: v.word, color: "#22c55e" }],
                label: `"${v.word}" as a ${v.classB}:`
              })}
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "Context changes the word class!",
            body: (v) => `${v.mistakeExplain}\n\nHere's the proof:\n\n**"${v.sentenceA}"** → **${v.classA}**\n**"${v.sentenceB}"** → **${v.classB}**\n\nAlways check what job the word is doing in **that particular sentence**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.sentenceA}"`, why: `"${v.word}" is a ${v.classA} here` },
                  { text: `"${v.sentenceB}"`, why: `"${v.word}" is a ${v.classB} here` },
                  { text: "Same word, different word class!", result: "Always check the context" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the sentence and find the target word`,
                `Ask: is it naming something (noun), doing something (verb), or describing something (adjective/adverb)?`,
                `Check the words around it for clues about its job in this sentence`
              ],
              feedback: {
                correct: (v) => `Perfect! Find the word, ask what job it's doing, and check the context for clues. ✓`,
                incorrect: (v) => `Not quite — start by finding the word, then ask what job it's doing in the sentence.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What word class is **"${v.word}"** in this sentence?\n\n*"${v.testSentence}"*`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [{ word: v.word, color: "#6C5CE7" }],
                label: `What type of word is "${v.word}" here?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What word class is "${v.word}" in this sentence?`,
              getOptions: () => ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.testAnswer}" — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Never assume — always check!",
            body: () => `The exam often gives you a word and asks what class it is **in that sentence**. Now you know the trick — here's your checklist:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Don't assume! Read the sentence first", why: "'play' can be a noun OR a verb" },
                  { text: "Ask: is it naming, doing, or describing?", why: "That tells you the word class" },
                  { text: "Check: can you put 'a' or 'the' before it?", why: "If yes, it's probably a noun in this sentence ✓" }
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
  // SUB-CONCEPT 7: pronoun-types
  // Types of Pronouns
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "pronoun-types",
    name: "Types of Pronouns",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "pronoun-types-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise five types of pronoun: personal (I, you, he), possessive (my, your, his), relative (who, which, that), demonstrative (this, that, these, those), and interrogative (who?, what?, which?)",
          "How to see that each type does a different job in a sentence"
        ],
        variableSets: [
          {
            name: "Aisha",
            sentence: "She told me that the book which was on the shelf was hers.",
            personal: "She",
            personalExplain: "'She' is a personal pronoun — it replaces a person's name (Aisha)",
            personalAlso: "me",
            personalAlsoExplain: "'me' is also a personal pronoun — it replaces my name",
            possessive: "hers",
            possessiveExplain: "'hers' is a possessive pronoun — it shows who owns the book (no apostrophe!)",
            relative: "which",
            relativeExplain: "'which' is a relative pronoun — it starts a clause that tells us more about the book",
            testWord: "hers",
            testAnswer: "Possessive pronoun",
            testWhy: "'hers' shows ownership — the book belongs to her — and it doesn't need an apostrophe"
          },
          {
            name: "Charlie",
            sentence: "He showed them the trophy that he had won, and they said it was his.",
            personal: "He",
            personalExplain: "'He' is a personal pronoun — it replaces Charlie's name",
            personalAlso: "them",
            personalAlsoExplain: "'them' is also a personal pronoun — it replaces the names of the people he showed",
            possessive: "his",
            possessiveExplain: "'his' is a possessive pronoun — it shows the trophy belongs to Charlie",
            relative: "that",
            relativeExplain: "'that' is a relative pronoun — it starts a clause telling us more about the trophy",
            testWord: "that",
            testAnswer: "Relative pronoun",
            testWhy: "'that' introduces the relative clause 'that he had won' — it tells us more about the trophy"
          },
          {
            name: "Daisy",
            sentence: "They lent us the game which was theirs, and we promised to return it.",
            personal: "They",
            personalExplain: "'They' is a personal pronoun — it replaces the names of the people who lent the game",
            personalAlso: "us",
            personalAlsoExplain: "'us' is also a personal pronoun — it replaces our names",
            possessive: "theirs",
            possessiveExplain: "'theirs' is a possessive pronoun — it shows who owns the game (no apostrophe!)",
            relative: "which",
            relativeExplain: "'which' is a relative pronoun — it starts a clause that tells us more about the game",
            testWord: "theirs",
            testAnswer: "Possessive pronoun",
            testWhy: "'theirs' shows ownership — the game belongs to them — and remember, possessive pronouns never have apostrophes"
          },
          {
            name: "Finn",
            sentence: "I gave her the cake that she wanted, and she said it was mine.",
            personal: "I",
            personalExplain: "'I' is a personal pronoun — it refers to the speaker",
            personalAlso: "her",
            personalAlsoExplain: "'her' is also a personal pronoun — it replaces the girl's name",
            possessive: "mine",
            possessiveExplain: "'mine' is a possessive pronoun — it shows who made the cake (no apostrophe!)",
            relative: "that",
            relativeExplain: "'that' is a relative pronoun — it starts a clause telling us more about the cake",
            testWord: "mine",
            testAnswer: "Possessive pronoun",
            testWhy: "'mine' shows ownership — it means 'belonging to me' — and like all possessive pronouns, it has no apostrophe"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `Not all pronouns are the same!`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\nDid you know this sentence has **three different types of pronoun** hiding in it? Pronouns all replace or refer to nouns, but each type does it in a different way.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three pronoun types in one sentence",
            body: (v) => `Let's look at each pronoun in:\n\n**"${v.sentence}"**\n\n**${v.personal}** — ${v.personalExplain}.\n**${v.personalAlso}** — ${v.personalAlsoExplain}.\n**${v.possessive}** — ${v.possessiveExplain}.\n**${v.relative}** — ${v.relativeExplain}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.personal}" → Personal pronoun`, why: v.personalExplain },
                  { text: `"${v.possessive}" → Possessive pronoun`, why: v.possessiveExplain },
                  { text: `"${v.relative}" → Relative pronoun`, why: v.relativeExplain }
                ]
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: '"he, she, they" are personal pronouns', isTrue: true },
                { text: '"his, her, their" are relative pronouns', isTrue: false },
                { text: '"who, which, that" are relative pronouns', isTrue: true },
                { text: '"mine, yours, theirs" are possessive pronouns', isTrue: true },
                { text: '"I, me, we" are possessive pronouns', isTrue: false }
              ],
              feedback: {
                correct: 'Well done! Personal pronouns replace names (I, he, she). Possessive show ownership (his, mine). Relative link clauses (who, which, that).',
                incorrect: 'Not quite. Personal = replace names (I, he, she, they). Possessive = show ownership (his, mine, theirs). Relative = link clauses (who, which, that).'
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of pronoun is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of pronoun is "${v.testWord}"?`,
              getOptions: () => ["Personal pronoun", "Possessive pronoun", "Relative pronoun", "Demonstrative pronoun", "Interrogative pronoun"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a ${v.testAnswer.toLowerCase()} — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Five types of pronoun — you know the key three!",
            body: () => `The 11+ often asks you to name the **type** of pronoun. Here are the three most important ones to remember:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Personal: I, you, he, she, it, we, they, me, him, her, us, them", why: "Replace a person or thing's name" },
                  { text: "Possessive: mine, yours, his, hers, its, ours, theirs", why: "Show ownership — NEVER use an apostrophe!" },
                  { text: "Relative: who, which, that, whose, where, when", why: "Start a clause giving more information about a noun ✓" }
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
        id: "pronoun-types-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to identify demonstrative pronouns (this, that, these, those) and interrogative pronouns (who?, what?, which?)",
          "How to tell pronoun types apart in tricky sentences"
        ],
        variableSets: [
          {
            name: "Grace",
            sentence: "Who left these on the table? That is not where they belong!",
            pronoun1: "Who",
            type1: "interrogative",
            explain1: "'Who' asks a question — it's an interrogative pronoun",
            pronoun2: "these",
            type2: "demonstrative",
            explain2: "'these' points to specific things nearby — it's a demonstrative pronoun",
            pronoun3: "That",
            type3: "demonstrative",
            explain3: "'That' points to a specific thing — it's a demonstrative pronoun",
            pronoun4: "they",
            type4: "personal",
            explain4: "'they' replaces the noun for the things on the table — it's a personal pronoun",
            testWord: "these",
            testAnswer: "Demonstrative pronoun",
            testWhy: "'these' points to specific things (the ones on the table) — demonstrative pronouns point to particular things: this, that, these, those"
          },
          {
            name: "Ben",
            sentence: "What did you put in this? Those are not the right ingredients!",
            pronoun1: "What",
            type1: "interrogative",
            explain1: "'What' asks a question — it's an interrogative pronoun",
            pronoun2: "this",
            type2: "demonstrative",
            explain2: "'this' points to a specific thing nearby — it's a demonstrative pronoun",
            pronoun3: "Those",
            type3: "demonstrative",
            explain3: "'Those' points to specific things further away — it's a demonstrative pronoun",
            pronoun4: "you",
            type4: "personal",
            explain4: "'you' refers to the person being spoken to — it's a personal pronoun",
            testWord: "Those",
            testAnswer: "Demonstrative pronoun",
            testWhy: "'Those' points to specific things (the wrong ingredients) — it's a demonstrative pronoun that refers to things further away"
          },
          {
            name: "Ella",
            sentence: "Which do you prefer? This is my favourite, but that one is hers.",
            pronoun1: "Which",
            type1: "interrogative",
            explain1: "'Which' asks a question about choosing — it's an interrogative pronoun",
            pronoun2: "This",
            type2: "demonstrative",
            explain2: "'This' points to a specific thing nearby — it's a demonstrative pronoun",
            pronoun3: "that",
            type3: "demonstrative",
            explain3: "'that' points to a specific thing further away — it's a demonstrative pronoun",
            pronoun4: "hers",
            type4: "possessive",
            explain4: "'hers' shows ownership — it's a possessive pronoun",
            testWord: "Which",
            testAnswer: "Interrogative pronoun",
            testWhy: "'Which' asks a question — interrogative pronouns are the ones that ask: who, what, which"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Pointing and asking — two more pronoun types!",
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\n**Demonstrative pronouns** point to specific things: **this, that, these, those**.\n**Interrogative pronouns** ask questions: **who, what, which**.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The five pronoun types",
            body: (v) => `There are **five types** of pronoun:\n\n**Personal:** I, you, he, she, it, we, they — replace a person or thing.\n**Possessive:** mine, yours, his, hers, theirs — show ownership.\n**Relative:** who, which, that — add extra information.\n**Demonstrative:** this, that, these, those — point to specific things.\n**Interrogative:** who, what, which — ask questions.\n\nNow spot them in: **"${v.sentence}"**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.pronoun1}" → ${v.type1} pronoun`, why: v.explain1 },
                  { text: `"${v.pronoun2}" → ${v.type2} pronoun`, why: v.explain2 },
                  { text: `"${v.pronoun3}" → ${v.type3} pronoun`, why: v.explain3 },
                  { text: `"${v.pronoun4}" → ${v.type4} pronoun`, why: v.explain4 }
                ]
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of pronoun is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of pronoun is "${v.testWord}"?`,
              getOptions: () => ["Personal pronoun", "Possessive pronoun", "Relative pronoun", "Demonstrative pronoun", "Interrogative pronoun"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a ${v.testAnswer.toLowerCase()} — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Quick recap!",
            body: () => `Five pronoun types — ask yourself what the word is doing:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Personal pronouns replace a name", why: "I, you, he, she, it, we, they" },
                  { text: "Possessive pronouns show who owns something", why: "mine, yours, his, hers, ours, theirs" },
                  { text: "Relative pronouns add extra information", why: "who, which, that — they link parts of a sentence" },
                  { text: "Demonstrative pronouns point at something", why: "this, that, these, those" },
                  { text: "Interrogative pronouns ask a question", why: "who, what, which — they start a question! ✓" }
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
  // SUB-CONCEPT 8: coord-vs-subord
  // Coordinating vs Subordinating Conjunctions
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "coord-vs-subord",
    name: "Coordinating vs Subordinating Conjunctions",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "coord-vs-subord-step",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell coordinating conjunctions (joining words for equal parts: For, And, Nor, But, Or, Yet, So — FANBOYS) from subordinating conjunctions (joining words that start a dependent part: because, although, when)",
          "Why coordinating conjunctions join equal parts and subordinating conjunctions create dependent clauses (parts that can't stand alone)"
        ],
        variableSets: [
          {
            name: "Aisha",
            sentence: "Aisha likes maths and science, but she finds spelling tricky because she started learning English late.",
            coord1: "and",
            coord1Job: "joins two equal things Aisha likes (maths + science)",
            coord2: "but",
            coord2Job: "joins two equal clauses that contrast (likes maths and science vs finds spelling tricky)",
            subord: "because",
            subordinJob: "introduces a reason that depends on the main clause — 'because she started learning English late' can't stand alone",
            mainClause: "she finds spelling tricky",
            subClause: "because she started learning English late",
            testWord: "because",
            testAnswer: "Subordinating conjunction",
            testWhy: "'because' introduces a dependent clause (one that can't stand alone as a sentence) — it's subordinating"
          },
          {
            name: "Ben",
            sentence: "Ben wanted to play outside, yet it was raining, so he stayed in although he was bored.",
            coord1: "yet",
            coord1Job: "joins two equal clauses that contrast (wanted to play vs it was raining)",
            coord2: "so",
            coord2Job: "joins two equal clauses showing a result (raining, so he stayed in)",
            subord: "although",
            subordinJob: "introduces a clause that depends on the main clause — 'although he was bored' can't stand alone",
            mainClause: "he stayed in",
            subClause: "although he was bored",
            testWord: "although",
            testAnswer: "Subordinating conjunction",
            testWhy: "'although' introduces a dependent clause that can't be a sentence on its own — it's subordinating"
          },
          {
            name: "Daisy",
            sentence: "Daisy packed her bag and her lunch, for she was going on a trip while her brother stayed at home.",
            coord1: "and",
            coord1Job: "joins two equal things she packed (bag + lunch)",
            coord2: "for",
            coord2Job: "gives a reason — joins two equal clauses (packed because she was going on a trip)",
            subord: "while",
            subordinJob: "introduces a clause that depends on the main clause — 'while her brother stayed at home' can't stand alone",
            mainClause: "she was going on a trip",
            subClause: "while her brother stayed at home",
            testWord: "while",
            testAnswer: "Subordinating conjunction",
            testWhy: "'while' introduces a dependent clause about what happens at the same time — it's subordinating"
          },
          {
            name: "Charlie",
            sentence: "Charlie ate his dinner and had pudding, but he was still hungry when he went to bed.",
            coord1: "and",
            coord1Job: "joins two equal things Charlie did (ate dinner + had pudding)",
            coord2: "but",
            coord2Job: "joins two equal clauses that contrast (ate dinner vs still hungry)",
            subord: "when",
            subordinJob: "introduces a clause telling us the time — 'when he went to bed' can't stand alone",
            mainClause: "he was still hungry",
            subClause: "when he went to bed",
            testWord: "when",
            testAnswer: "Subordinating conjunction",
            testWhy: "'when' introduces a dependent clause about time — 'when he went to bed' can't be a sentence on its own"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => `FANBOYS vs the rest!`,
            body: (v) => `Look at this sentence:\n\n*"${v.sentence}"*\n\nSome conjunctions join **equal parts** — these are called **coordinating** conjunctions. Others make one part **depend on** another — these are **subordinating** conjunctions.\n\nHere's a handy trick to remember the coordinating ones: **FANBOYS** (For, And, Nor, But, Or, Yet, So). Once you know FANBOYS, everything else is subordinating!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [],
                label: "Read the sentence:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Coordinating joins equals, subordinating creates dependence",
            body: (v) => `In the sentence:\n\n**"${v.sentence}"**\n\n**"${v.coord1}"** — ${v.coord1Job} (coordinating — FANBOYS).\n**"${v.coord2}"** — ${v.coord2Job} (coordinating — FANBOYS).\n**"${v.subord}"** — ${v.subordinJob} (subordinating).\n\nTest: **"${v.subClause}"** cannot be a sentence on its own. It *depends on* **"${v.mainClause}"**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.coord1}" → Coordinating (FANBOYS)`, why: v.coord1Job },
                  { text: `"${v.coord2}" → Coordinating (FANBOYS)`, why: v.coord2Job },
                  { text: `"${v.subord}" → Subordinating`, why: v.subordinJob }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `FANBOYS (For, And, Nor, But, Or, Yet, So) are all ____ conjunctions`,
              options: (v) => ["coordinating", "subordinating", "correlative", "relative"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! FANBOYS are all coordinating conjunctions — they join two equal ideas together. ✓`,
                incorrect: (v) => `Not quite — FANBOYS (For, And, Nor, But, Or, Yet, So) are COORDINATING conjunctions. They join equal ideas.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence:\n*"${v.sentence}"*\n\nWhat type of conjunction is **"${v.testWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.testWord, color: "#6C5CE7" }],
                label: `What type of word is "${v.testWord}"?`
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of conjunction is "${v.testWord}"?`,
              getOptions: () => ["Coordinating conjunction", "Subordinating conjunction", "Preposition", "Adverb", "Relative pronoun"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! "${v.testWord}" is a subordinating conjunction — ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "FANBOYS — your secret weapon!",
            body: () => `The 11+ loves asking about conjunction types, and now you have the ultimate cheat code:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "FANBOYS = coordinating conjunctions", why: "For, And, Nor, But, Or, Yet, So — that's ALL of them!" },
                  { text: "Everything else = subordinating", why: "because, although, when, while, if, since, unless, until, before, after" },
                  { text: "The dependence test: can the clause stand alone?", why: "If not, the conjunction is subordinating ✓" }
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
        id: "coord-vs-subord-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to identify clause structure with conjunctions (joining words)",
          "Why subordinate clauses (dependent parts that need the main sentence) can't stand alone as sentences"
        ],
        variableSets: [
          {
            name: "Grace",
            wrongSentence: "Because it was raining.",
            mistake: "This is only a subordinate clause — it can't be a sentence on its own",
            fixedSentence: "We stayed inside because it was raining.",
            mainClause: "We stayed inside",
            subClause: "because it was raining",
            conjunction: "because",
            conjType: "subordinating",
            rule: "A subordinate clause needs a main clause to be a complete sentence. 'Because it was raining' tells us a reason, but doesn't tell us what happened.",
            testFragment: "Although the sun was shining.",
            testAnswer: "Not a sentence — it's only a subordinate clause",
            testWhy: "'Although the sun was shining' is a subordinate clause — it needs a main clause like 'we took an umbrella' to be complete"
          },
          {
            name: "Finn",
            wrongSentence: "When the bell rang.",
            mistake: "This is only a subordinate clause — it can't be a sentence on its own",
            fixedSentence: "The children lined up when the bell rang.",
            mainClause: "The children lined up",
            subClause: "when the bell rang",
            conjunction: "when",
            conjType: "subordinating",
            rule: "A subordinate clause starts with a subordinating conjunction and can't be a sentence on its own. 'When the bell rang' tells us the time, but doesn't say what happened.",
            testFragment: "If you finish your homework early.",
            testAnswer: "Not a sentence — it's only a subordinate clause",
            testWhy: "'If you finish your homework early' is a subordinate clause starting with 'if' — it needs a main clause like 'you can go outside' to make a complete sentence"
          },
          {
            name: "Ella",
            wrongSentence: "Unless you hurry up.",
            mistake: "This is only a subordinate clause — it can't be a sentence on its own",
            fixedSentence: "We will miss the bus unless you hurry up.",
            mainClause: "We will miss the bus",
            subClause: "unless you hurry up",
            conjunction: "unless",
            conjType: "subordinating",
            rule: "A subordinate clause depends on a main clause. 'Unless you hurry up' sets a condition, but doesn't tell us what will happen.",
            testFragment: "Before the match started.",
            testAnswer: "Not a sentence — it's only a subordinate clause",
            testWhy: "'Before the match started' is a subordinate clause — it tells us when, but not what happened. It needs a main clause like 'the players warmed up'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Is this a complete sentence?",
            body: (v) => `${v.name}'s teacher marked this as wrong:\n\n*"${v.wrongSentence}"*\n\nIt has a capital letter and a full stop — so why isn't it a proper sentence?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Read carefully:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Subordinate clauses can't stand alone!",
            body: (v) => `${v.rule}\n\nHere's how to fix it — add a main clause:\n\n**"${v.fixedSentence}"**\n\nNow **"${v.mainClause}"** is the main clause (it makes sense alone), and **"${v.subClause}"** is the subordinate clause (it depends on the main clause).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: "${v.wrongSentence}"`, why: "This is only a subordinate clause — it can't be a sentence" },
                  { text: `"${v.conjunction}" is a ${v.conjType} conjunction`, why: "It makes the clause depend on something else" },
                  { text: `RIGHT: "${v.fixedSentence}"`, result: "Now it has a main clause + a subordinate clause" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `A subordinate clause starting with "${v.conjunction}" can be a complete sentence on its own`, answer: false, explanation: `No! "${v.subClause}" can't stand alone — it needs a main clause to make sense. That's what makes it subordinate. ✓` },
                { text: `Subordinating conjunctions like "because", "although", and "when" create clauses that depend on a main clause`, answer: true, explanation: `Correct! Subordinating conjunctions create dependent clauses that need a main clause to form a complete sentence. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Is this a complete sentence?\n\n*"${v.testFragment}"*`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Is "${v.testFragment}" a complete sentence?`,
              getOptions: () => ["Yes — it's a complete sentence", "Not a sentence — it's only a subordinate clause", "Not a sentence — it has no verb", "Not a sentence — it has no noun", "Yes — it has a full stop"],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.testWhy}. ✓`,
                incorrect: (v) => `Not quite! ${v.testWhy}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Main clause + subordinate clause = complete sentence",
            body: () => `A subordinate clause **depends** on a main clause. It can't be a sentence on its own. Here's how to check:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Main clause = makes sense on its own", why: "'We stayed inside.' — yes, that's a complete sentence" },
                  { text: "Subordinate clause = depends on something else", why: "'Because it was raining.' — raining caused what? We need more!" },
                  { text: "Spot the conjunction to find the subordinate clause", why: "because, although, when, while, if, unless, until, before, after ✓" }
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

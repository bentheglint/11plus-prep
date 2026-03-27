// ============================================================
// Supplementary sub-concepts for Antonyms (Verbal Reasoning)
// To merge: add these to lessonBank.antonyms.subConcepts array in lessonData.js
// ============================================================

export const antonymsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Basic Opposites
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "basic-opposites",
    name: "Basic Opposites",
    category: "core",
    lessons: [
      {
        id: "basic-opposites-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot simple opposite pairs quickly — you'll be a pro at this!",
          "How to use the flip test — if the meaning reverses completely, it's an antonym (a word that means the opposite). This trick works every time!"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching words with opposite meanings",
            word: "hot",
            antonym: "cold",
            definition: "having a high temperature",
            oppositeDefinition: "having a low temperature",
            testSentence: "The soup was **hot** → flip it → The soup was **cold**",
            options: ["cold", "warm", "boiling", "spicy", "burning"],
            correctAnswer: "cold",
            explanation: "'Hot' means high temperature and 'cold' means low temperature — they are exact opposites. 'Warm' is closer to hot, not the opposite. ✓",
            trap: "warm",
            trapReason: "'Warm' is a LESSER version of hot — it's on the same side, not the opposite side",
            interactWord: "dark",
            interactDefinition: "having very little light",
            interactOptions: ["bright", "dim", "pale", "white", "clear"],
            interactCorrectAnswer: "bright",
            interactExplanation: "'Dark' means having little light and 'bright' means having lots of light — they are exact opposites. 'Dim' is a lesser version of dark, not the opposite. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding words that mean the opposite",
            word: "big",
            antonym: "small",
            definition: "large in size",
            oppositeDefinition: "little in size",
            testSentence: "The **big** dog ran past → flip it → The **small** dog ran past",
            options: ["small", "tiny", "medium", "wide", "heavy"],
            correctAnswer: "small",
            explanation: "'Big' means large and 'small' means little — they are direct opposites. 'Tiny' means VERY small, which is more extreme. ✓",
            trap: "tiny",
            trapReason: "'Tiny' is TOO extreme — it means very, very small. The direct opposite of 'big' is 'small'",
            interactWord: "happy",
            interactDefinition: "feeling pleased and content",
            interactOptions: ["sad", "angry", "tired", "bored", "grumpy"],
            interactCorrectAnswer: "sad",
            interactExplanation: "'Happy' means feeling pleased and 'sad' means feeling unhappy — they are direct opposites. 'Angry' is a different emotion, not the opposite. ✓"
          },
          {
            name: "Priya",
            scenario: "practising antonym pairs for her VR test",
            word: "fast",
            antonym: "slow",
            definition: "moving with great speed",
            oppositeDefinition: "moving without much speed",
            testSentence: "The **fast** car sped away → flip it → The **slow** car crawled along",
            options: ["slow", "stopped", "careful", "steady", "lazy"],
            correctAnswer: "slow",
            explanation: "'Fast' means quick and 'slow' means not quick — they are exact opposites. 'Stopped' means not moving at all, which is different. ✓",
            trap: "stopped",
            trapReason: "'Stopped' means not moving at ALL — that's not the opposite of fast, it's the absence of movement",
            interactWord: "tall",
            interactDefinition: "having greater height",
            interactOptions: ["short", "low", "small", "thin", "flat"],
            interactCorrectAnswer: "short",
            interactExplanation: "'Tall' means having great height and 'short' means having little height — they are exact opposites. 'Low' describes position, not height of a person or object. ✓"
          },
          {
            name: "Finn",
            scenario: "working through an antonym quiz",
            word: "light",
            antonym: "heavy",
            definition: "not weighing much",
            oppositeDefinition: "weighing a lot",
            testSentence: "The bag was **light** → flip it → The bag was **heavy**",
            options: ["heavy", "dark", "full", "thick", "solid"],
            correctAnswer: "heavy",
            explanation: "'Light' (in weight) and 'heavy' are exact opposites. 'Dark' is the opposite of light when talking about brightness, not weight! ✓",
            trap: "dark",
            trapReason: "'Dark' is the opposite of 'light' when talking about BRIGHTNESS — but here we mean weight, so 'heavy' is the answer",
            interactWord: "loud",
            interactDefinition: "producing a lot of sound",
            interactOptions: ["quiet", "silent", "calm", "gentle", "peaceful"],
            interactCorrectAnswer: "quiet",
            interactExplanation: "'Loud' means producing much sound and 'quiet' means producing little sound — they are exact opposites. 'Silent' means NO sound at all, which is more extreme. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the opposite of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know that almost every word has an exact mirror image — a word that means the complete opposite? **"${v.word}"** means ${v.definition}.\n\nCan you spot which word flips it around completely? Careful — the 11+ loves sneaking in words that are close but not quite right!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.word],
                pair2word: v.word,
                answer: null,
                label: "What is the exact OPPOSITE?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Flip Test",
            body: (v) => `Here's a brilliant trick you'll use again and again! Put **"${v.word}"** in a sentence, then swap it for **"${v.antonym}"** — if the meaning **completely flips**, you've found the antonym. It's like pressing a reverse button!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" means: ${v.definition}`, why: "Start with the meaning" },
                  { text: `Flip it: ${v.testSentence}`, why: "The meaning has reversed completely!" },
                  { text: `Watch out for "${v.trap}"`, why: v.trapReason }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `An antonym is a word that means the ____ of another word`,
              options: (v) => ["opposite", "same", "similar", "nothing"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Spot on! Antonyms are words with opposite meanings — you've got this! ✓`,
                incorrect: (v) => `Nearly! Antonyms mean the OPPOSITE of each other — think of them as mirror images.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word means the **opposite** of **"${v.interactWord}"**?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                relationship: v.interactDefinition,
                label: "Find the OPPOSITE"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is an antonym of "${v.interactWord}"?`,
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
            title: () => "The Flip Test — your secret weapon!",
            body: () => `You've got a proper superpower now! Next time you need to find an antonym, just follow these three steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Define the word in your own words", why: "What does it actually mean?" },
                  { text: "2. Flip the meaning — what's the exact opposite?", why: "High → low, fast → slow, big → small" },
                  { text: "3. Watch out for RELATED words that aren't opposites", why: "Hot ≠ warm, fast ≠ stopped ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "basic-opposites-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why picking a DIFFERENT word isn't the same as picking an OPPOSITE — this catches loads of people out!",
          "How to dodge the sneaky 'wrong direction' trap"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her friend's VR homework",
            word: "dry",
            wrongAnswer: "damp",
            actualAntonym: "wet",
            friendWrong: "damp",
            friendReason: "because dry things aren't damp",
            whyWrong: "'Damp' means slightly moist — it's not the full opposite of 'dry'",
            correctExplanation: "'Wet' is the true opposite of 'dry'. 'Damp' is only slightly moist — it's halfway, not the full flip.",
            options: ["wet", "damp", "moist", "soggy", "rainy"],
            correctAnswer: "wet",
            interactWord: "hard",
            interactOptions: ["soft", "gentle", "weak", "floppy", "bendy"],
            interactCorrectAnswer: "soft",
            interactExplanation: "'Soft' is the true opposite of 'hard'. Both describe the same quality — firmness. 'Gentle' describes behaviour, not texture."
          },
          {
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            word: "narrow",
            wrongAnswer: "long",
            actualAntonym: "wide",
            friendWrong: "long",
            friendReason: "because narrow things are usually long",
            whyWrong: "'Long' describes LENGTH, not width — a narrow path can also be long!",
            correctExplanation: "'Wide' is the true opposite of 'narrow'. Both describe WIDTH. 'Long' describes a completely different measurement.",
            options: ["wide", "long", "short", "broad", "large"],
            correctAnswer: "wide",
            interactWord: "clean",
            interactOptions: ["dirty", "messy", "dusty", "muddy", "stained"],
            interactCorrectAnswer: "dirty",
            interactExplanation: "'Dirty' is the true opposite of 'clean'. Both describe the same quality — cleanliness. 'Messy' describes tidiness, which is different."
          },
          {
            name: "Aisha",
            scenario: "helping her brother with VR questions",
            word: "cheap",
            wrongAnswer: "valuable",
            actualAntonym: "expensive",
            friendWrong: "valuable",
            friendReason: "because cheap things aren't valuable",
            whyWrong: "'Valuable' means worth a lot — but something can be valuable AND cheap (like a book from a charity shop)",
            correctExplanation: "'Expensive' means costing a lot of money — the direct opposite of 'cheap'. 'Valuable' means having worth, which is different from price.",
            options: ["expensive", "valuable", "priceless", "costly", "rich"],
            correctAnswer: "expensive",
            interactWord: "strong",
            interactOptions: ["weak", "fragile", "tired", "small", "thin"],
            interactCorrectAnswer: "weak",
            interactExplanation: "'Weak' is the true opposite of 'strong'. Both describe the same quality — strength. 'Fragile' means easily broken, which is about durability, not strength."
          },
          {
            name: "Charlie",
            scenario: "going over his mock test results",
            word: "noisy",
            wrongAnswer: "peaceful",
            actualAntonym: "quiet",
            friendWrong: "peaceful",
            friendReason: "because noisy places aren't peaceful",
            whyWrong: "'Peaceful' means calm and free from disturbance — it's about mood, not sound level",
            correctExplanation: "'Quiet' means making little sound — the direct opposite of 'noisy'. 'Peaceful' is about a feeling of calm, not specifically about noise.",
            options: ["quiet", "peaceful", "calm", "silent", "still"],
            correctAnswer: "quiet",
            interactWord: "empty",
            interactOptions: ["full", "heavy", "busy", "packed", "loaded"],
            interactCorrectAnswer: "full",
            interactExplanation: "'Full' is the true opposite of 'empty'. Both describe the same quality — how much something contains. 'Heavy' describes weight, which is different."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really the opposite of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}. The answer given was **"${v.friendWrong}"** as the opposite of **"${v.word}"** — ${v.friendReason}.\n\nHmm, that sounds reasonable at first... but is it actually right? Let's play detective and find out!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Word: "${v.word}"` },
                  { text: `Answer chosen: "${v.friendWrong}" — correct or not?` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Different is NOT the same as Opposite!",
            body: (v) => `${v.whyWrong}\n\nThis is one of the trickiest traps in the 11+! An antonym must **flip the meaning completely**. Words that are just DIFFERENT or RELATED don't count — they must be on the exact opposite end.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" — the original word`, why: "What does it mean?" },
                  { text: `"${v.friendWrong}" — related but NOT opposite`, why: v.whyWrong },
                  { text: `"${v.actualAntonym}" — the TRUE opposite ✓`, why: v.correctExplanation }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.friendWrong}" is the opposite of "${v.word}"`, answer: false, explanation: `No — ${v.whyWrong}. It's related but not the true opposite.` },
                { text: `"${v.actualAntonym}" is the opposite of "${v.word}"`, answer: true, explanation: `Yes — ${v.correctExplanation} ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the TRUE opposite!",
            body: (v) => `Which word is the **exact opposite** of **"${v.interactWord}"**?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                label: "Not just different — OPPOSITE"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the true antonym of "${v.interactWord}"?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Opposite, not just different — remember this!",
            body: () => `Fantastic work! You're building a really useful skill here. Keep this in mind and you'll dodge a trap that catches loads of people:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "An antonym reverses the meaning entirely", why: "Not just related — the exact reverse" },
                  { text: "Check the SAME quality is being flipped", why: "Width ↔ width, sound ↔ sound, price ↔ price" },
                  { text: "If it's just DIFFERENT, it's NOT an antonym", why: "Narrow ≠ long, noisy ≠ peaceful ✓" }
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
  // SUB-CONCEPT 2: Prefix Antonyms
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "prefix-antonyms",
    name: "Prefix Antonyms (un-, dis-, im-, in-, ir-)",
    category: "core",
    lessons: [
      {
        id: "prefix-antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use prefixes like un-, dis-, im-, in- or ir- to create an opposite — it's like having a magic switch!",
          "How to choose which prefix goes with which word (there's a pattern, and once you spot it, you'll never forget)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "learning how prefixes create opposites",
            word: "happy",
            antonym: "unhappy",
            prefix: "un-",
            definition: "feeling pleased and content",
            oppositeDefinition: "not feeling pleased; sad",
            otherExamples: "kind → unkind, fair → unfair, lucky → unlucky",
            options: ["unhappy", "sad", "miserable", "cross", "upset"],
            correctAnswer: "unhappy",
            explanation: "Adding 'un-' to 'happy' creates 'unhappy' — the direct opposite. 'Sad' is a synonym of unhappy but not formed from the same word. ✓",
            interactWord: "tidy",
            interactPrefix: "un-",
            interactAntonym: "untidy",
            interactOptions: ["untidy", "messy", "cluttered", "dirty", "chaotic"],
            interactCorrectAnswer: "untidy",
            interactExplanation: "Adding 'un-' to 'tidy' creates 'untidy' — the direct prefix opposite. 'Messy' means the same thing but isn't formed from the word 'tidy'. ✓"
          },
          {
            name: "Oliver",
            scenario: "discovering how 'dis-' flips the meaning",
            word: "agree",
            antonym: "disagree",
            prefix: "dis-",
            definition: "to have the same opinion",
            oppositeDefinition: "to have a different opinion",
            otherExamples: "appear → disappear, obey → disobey, connect → disconnect",
            options: ["disagree", "argue", "refuse", "reject", "deny"],
            correctAnswer: "disagree",
            explanation: "Adding 'dis-' to 'agree' creates 'disagree' — the exact opposite. 'Argue' means to quarrel, which is different from simply not agreeing. ✓",
            interactWord: "obey",
            interactPrefix: "dis-",
            interactAntonym: "disobey",
            interactOptions: ["disobey", "rebel", "refuse", "fight", "ignore"],
            interactCorrectAnswer: "disobey",
            interactExplanation: "Adding 'dis-' to 'obey' creates 'disobey' — the direct prefix opposite. 'Rebel' means to resist authority, which is broader than simply not obeying. ✓"
          },
          {
            name: "Priya",
            scenario: "spotting 'im-' and 'in-' prefix opposites",
            word: "possible",
            antonym: "impossible",
            prefix: "im-",
            definition: "able to be done",
            oppositeDefinition: "not able to be done",
            otherExamples: "patient → impatient, polite → impolite, mature → immature",
            options: ["impossible", "difficult", "unlikely", "hopeless", "tricky"],
            correctAnswer: "impossible",
            explanation: "Adding 'im-' to 'possible' creates 'impossible' — not able to be done. 'Difficult' means hard to do, but not impossible. ✓",
            interactWord: "polite",
            interactPrefix: "im-",
            interactAntonym: "impolite",
            interactOptions: ["impolite", "rude", "mean", "nasty", "cheeky"],
            interactCorrectAnswer: "impolite",
            interactExplanation: "Adding 'im-' to 'polite' creates 'impolite' — the direct prefix opposite. 'Rude' means the same thing but isn't formed from the word 'polite'. ✓"
          },
          {
            name: "Finn",
            scenario: "working out 'ir-' prefix antonyms",
            word: "regular",
            antonym: "irregular",
            prefix: "ir-",
            definition: "happening at even intervals or following a pattern",
            oppositeDefinition: "not following a regular pattern",
            otherExamples: "responsible → irresponsible, relevant → irrelevant, reversible → irreversible",
            options: ["irregular", "unusual", "random", "rare", "odd"],
            correctAnswer: "irregular",
            explanation: "Adding 'ir-' to 'regular' creates 'irregular' — the direct opposite. 'Random' means without any pattern at all, which is more extreme. ✓",
            interactWord: "relevant",
            interactPrefix: "ir-",
            interactAntonym: "irrelevant",
            interactOptions: ["irrelevant", "unimportant", "useless", "pointless", "boring"],
            interactCorrectAnswer: "irrelevant",
            interactExplanation: "Adding 'ir-' to 'relevant' creates 'irrelevant' — the direct prefix opposite. 'Unimportant' is close in meaning but uses a different prefix on a different word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What happens when you add "${v.prefix}" to "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know you can turn a word into its opposite just by sticking a tiny **prefix** (a few letters) on the front? It's like having a magic undo button for words!\n\n**"${v.word}"** means ${v.definition}. What happens when you stick **"${v.prefix}"** on the front?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = ${v.definition}` },
                  { text: `Add "${v.prefix}" → "${v.antonym}" = ???` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: (v) => `The "${v.prefix}" prefix`,
            body: (v) => `The prefix **"${v.prefix}"** means "not" or "the opposite of". It flips the meaning!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = ${v.definition}`, why: "The original word" },
                  { text: `"${v.prefix}" + "${v.word}" = "${v.antonym}"`, why: `${v.oppositeDefinition}` },
                  { text: `More examples: ${v.otherExamples}`, why: `The "${v.prefix}" prefix always means "not" or "opposite"` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "happy", right: "unhappy" },
                { left: "agree", right: "disagree" },
                { left: "possible", right: "impossible" },
                { left: "regular", right: "irregular" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word is the **opposite** of **"${v.interactWord}"**? Think about which prefix to use!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                label: "Find the prefix OPPOSITE"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is an antonym of "${v.interactWord}"?`,
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
            title: () => "Prefix power — your toolkit!",
            body: () => `You've just unlocked a proper superpower! Once you know these prefixes, you can crack loads of antonym questions in seconds. They all mean "not" or "opposite":`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "un- : unhappy, unkind, unfair, unlucky", why: "The most common 'opposite' prefix" },
                  { text: "dis- : disagree, disappear, disobey", why: "Often used with verbs" },
                  { text: "im-/in-/ir- : impossible, invisible, irregular", why: "im- before b/m/p, ir- before r ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "prefix-antonyms-tricky",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to choose which prefix matches which word in tricky cases — even grown-ups get these muddled!",
          "Why you can't just stick any prefix on any word (English has some sneaky rules here)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "wondering why we say 'impossible' not 'unpossible'",
            word: "visible",
            antonym: "invisible",
            prefix: "in-",
            wrongPrefix: "un-",
            wrongForm: "unvisible",
            rule: "Words starting with 'v' usually take 'in-'",
            options: ["invisible", "unvisible", "nonvisible", "hidden", "blind"],
            correctAnswer: "invisible",
            explanation: "'Visible' takes the prefix 'in-' to become 'invisible'. We don't say 'unvisible' — the correct prefix matters! ✓",
            interactWord: "mature",
            interactPrefix: "im-",
            interactWrongPrefix: "un-",
            interactWrongForm: "unmature",
            interactAntonym: "immature",
            interactOptions: ["immature", "unmature", "inmature", "childish", "silly"],
            interactCorrectAnswer: "immature",
            interactExplanation: "'Mature' takes the prefix 'im-' because it starts with 'm'. We don't say 'unmature' — 'immature' is the correct form. ✓"
          },
          {
            name: "Marcus",
            scenario: "noticing that 'im-' only goes with certain words",
            word: "patient",
            antonym: "impatient",
            prefix: "im-",
            wrongPrefix: "un-",
            wrongForm: "unpatient",
            rule: "Words starting with 'p' usually take 'im-'",
            options: ["impatient", "unpatient", "inpatient", "restless", "anxious"],
            correctAnswer: "impatient",
            explanation: "'Patient' takes 'im-' (not 'un-') because it starts with 'p'. 'Im-' goes before words starting with b, m, or p. ✓",
            interactWord: "balance",
            interactPrefix: "im-",
            interactWrongPrefix: "un-",
            interactWrongForm: "unbalance",
            interactAntonym: "imbalance",
            interactOptions: ["imbalance", "unbalance", "inbalance", "wobbly", "uneven"],
            interactCorrectAnswer: "imbalance",
            interactExplanation: "'Balance' takes 'im-' because it starts with 'b'. 'Im-' goes before words starting with b, m, or p. We say 'imbalance', not 'unbalance'. ✓"
          },
          {
            name: "Aisha",
            scenario: "learning why 'ir-' matches certain words",
            word: "responsible",
            antonym: "irresponsible",
            prefix: "ir-",
            wrongPrefix: "un-",
            wrongForm: "unresponsible",
            rule: "Words starting with 'r' usually take 'ir-'",
            options: ["irresponsible", "unresponsible", "inresponsible", "careless", "reckless"],
            correctAnswer: "irresponsible",
            explanation: "'Responsible' takes 'ir-' because it starts with 'r'. 'Careless' means lacking care, which is related but not the direct opposite. ✓",
            interactWord: "reversible",
            interactPrefix: "ir-",
            interactWrongPrefix: "un-",
            interactWrongForm: "unreversible",
            interactAntonym: "irreversible",
            interactOptions: ["irreversible", "unreversible", "inreversible", "permanent", "stuck"],
            interactCorrectAnswer: "irreversible",
            interactExplanation: "'Reversible' takes 'ir-' because it starts with 'r'. We say 'irreversible', not 'unreversible'. 'Permanent' is similar in meaning but isn't the prefix opposite. ✓"
          },
          {
            name: "Charlie",
            scenario: "figuring out when to use 'dis-'",
            word: "honest",
            antonym: "dishonest",
            prefix: "dis-",
            wrongPrefix: "un-",
            wrongForm: "unhonest",
            rule: "'Honest' traditionally takes 'dis-' to form its opposite",
            options: ["dishonest", "unhonest", "inhonest", "lying", "sneaky"],
            correctAnswer: "dishonest",
            explanation: "'Honest' takes 'dis-' to become 'dishonest'. 'Lying' describes an action, not a character trait — 'dishonest' is the true opposite. ✓",
            interactWord: "appear",
            interactPrefix: "dis-",
            interactWrongPrefix: "un-",
            interactWrongForm: "unappear",
            interactAntonym: "disappear",
            interactOptions: ["disappear", "unappear", "inappear", "vanish", "hide"],
            interactCorrectAnswer: "disappear",
            interactExplanation: "'Appear' takes 'dis-' to become 'disappear'. We don't say 'unappear'. 'Vanish' means a similar thing but isn't formed from the same word. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Why not "${v.wrongForm}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nThe opposite of **"${v.word}"** is **"${v.antonym}"** — but why do we use **"${v.prefix}"** and not **"${v.wrongPrefix}"**?\n\nBelieve it or not, English has secret rules about which prefix goes with which word — and you're about to crack the code!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wrongForm}" ✗ — this isn't a real word!` },
                  { text: `"${v.antonym}" ✓ — this IS the correct opposite` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Matching the right prefix",
            body: (v) => `${v.rule}. Here's the good news — there's a pattern, and once you know it, these questions become much easier!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" starts with "${v.word[0]}"`, why: v.rule },
                  { text: `The correct prefix is "${v.prefix}"`, why: `"${v.prefix}" + "${v.word}" = "${v.antonym}"` },
                  { text: `"${v.wrongForm}" is NOT a real English word`, why: "Using the wrong prefix creates a non-word!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.wrongForm}" is a real English word`, answer: false, explanation: `No — "${v.wrongForm}" isn't a real word. The correct form is "${v.antonym}".` },
                { text: `"${v.antonym}" is the opposite of "${v.word}"`, answer: true, explanation: `Correct — "${v.prefix}" + "${v.word}" = "${v.antonym}". ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which is the correct opposite of **"${v.interactWord}"**? Watch out for wrong prefixes!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                label: "Which prefix makes the OPPOSITE?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct antonym of "${v.interactWord}"?`,
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
            title: () => "Prefix matching rules — your cheat sheet!",
            body: () => `Well done! Here's a handy cheat sheet you can keep in your head — knowing this puts you ahead of most people:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "im- before b, m, p: impossible, immature, imbalance", why: "The 'm' in 'im-' matches these starting sounds" },
                  { text: "ir- before r: irregular, irresponsible, irrelevant", why: "The 'r' in 'ir-' matches the starting 'r'" },
                  { text: "in- or dis- for most others: invisible, dishonest", why: "Learn the common ones and you'll spot them in tests ✓" }
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
  // SUB-CONCEPT 3: Verb Antonyms
  // Category: core
  // ==========================================
  {
    id: "verb-antonyms",
    name: "Action Word Opposites",
    category: "core",
    lessons: [
      {
        id: "verb-antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find opposites for action words (verbs) — imagine pressing rewind!",
          "Why picturing the REVERSE action helps you find the match every time"
        ],
        variableSets: [
          {
            name: "Isla",
            scenario: "matching opposite action words",
            word: "expand",
            antonym: "contract",
            definition: "to grow larger or spread out",
            oppositeDefinition: "to shrink or become smaller",
            testSentence: "The balloon will **expand** → reverse → The balloon will **contract**",
            options: ["contract", "shrink", "burst", "deflate", "flatten"],
            correctAnswer: "contract",
            explanation: "'Expand' means to grow larger and 'contract' means to become smaller — they are exact opposite actions. 'Shrink' is close but 'contract' is the precise pair. ✓",
            interactWord: "create",
            interactDefinition: "to make or bring something into existence",
            interactOptions: ["destroy", "break", "lose", "forget", "remove"],
            interactCorrectAnswer: "destroy",
            interactExplanation: "'Create' means to bring into existence and 'destroy' means to put an end to existence — they are exact opposite actions. 'Break' means to damage, not to completely undo creation. ✓"
          },
          {
            name: "Theo",
            scenario: "finding opposite action words",
            word: "arrive",
            antonym: "depart",
            definition: "to reach a place",
            oppositeDefinition: "to leave a place",
            testSentence: "The train will **arrive** at 3pm → reverse → The train will **depart** at 3pm",
            options: ["depart", "leave", "travel", "pass", "stop"],
            correctAnswer: "depart",
            explanation: "'Arrive' means to reach a destination and 'depart' means to leave one — they are direct opposites. 'Leave' is similar but 'depart' is the precise antonym. ✓",
            interactWord: "accept",
            interactDefinition: "to receive or agree to something willingly",
            interactOptions: ["reject", "ignore", "return", "avoid", "dislike"],
            interactCorrectAnswer: "reject",
            interactExplanation: "'Accept' means to receive willingly and 'reject' means to refuse or turn away — they are direct opposite actions. 'Ignore' means to pay no attention, which is different from actively refusing. ✓"
          },
          {
            name: "Grace",
            scenario: "reversing action words in her VR practice",
            word: "ascend",
            antonym: "descend",
            definition: "to go up",
            oppositeDefinition: "to go down",
            testSentence: "The plane began to **ascend** → reverse → The plane began to **descend**",
            options: ["descend", "fall", "drop", "dive", "land"],
            correctAnswer: "descend",
            explanation: "'Ascend' means to go up and 'descend' means to go down — perfect opposites. 'Fall' means to drop suddenly, which is not the same as a controlled descent. ✓",
            interactWord: "increase",
            interactDefinition: "to become greater in size, amount, or number",
            interactOptions: ["decrease", "reduce", "lower", "shrink", "remove"],
            interactCorrectAnswer: "decrease",
            interactExplanation: "'Increase' means to grow greater and 'decrease' means to grow less — they are perfect opposite actions. 'Reduce' is close but 'decrease' is the precise antonym pair. ✓"
          },
          {
            name: "Noah",
            scenario: "pairing up opposite actions",
            word: "include",
            antonym: "exclude",
            definition: "to have as part of a group",
            oppositeDefinition: "to leave out of a group",
            testSentence: "We will **include** everyone → reverse → We will **exclude** everyone",
            options: ["exclude", "remove", "ignore", "forget", "reject"],
            correctAnswer: "exclude",
            explanation: "'Include' means to count someone in and 'exclude' means to leave someone out — they are direct opposites. 'Ignore' means to pay no attention, which is different. ✓",
            interactWord: "attach",
            interactDefinition: "to join or fasten one thing to another",
            interactOptions: ["detach", "drop", "untie", "release", "break"],
            interactCorrectAnswer: "detach",
            interactExplanation: "'Attach' means to join together and 'detach' means to separate — they are direct opposite actions. 'Untie' specifically means to undo a knot, which is more specific. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the reverse of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**"${v.word}"** is an action word (a verb). It means: ${v.definition}.\n\nHere's a really fun way to think about it: imagine watching the action on video and pressing **rewind** — what word describes what you'd see playing backwards?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.word],
                pair2word: v.word,
                answer: null,
                label: "What is the REVERSE action?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Reverse the action!",
            body: (v) => `Think about **"${v.word}"** — it means ${v.definition}. Now imagine you're watching a video of that action and you press REWIND. What does the reversed action look like? That's your antonym!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = ${v.definition}`, why: "Picture this action happening" },
                  { text: `Now REVERSE it: ${v.oppositeDefinition}`, why: "What does the opposite look like?" },
                  { text: `"${v.antonym}" = the reverse action ✓`, why: `${v.testSentence}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the action word: "${v.word}"`,
                `Picture the action: ${v.definition}`,
                `Imagine the REVERSE: ${v.oppositeDefinition}`,
                `Pick the word that matches: "${v.antonym}"`
              ],
              feedback: {
                correct: (v) => `Perfect order! Picture, reverse, then match. ✓`,
                incorrect: (v) => `Not quite — start by reading the word, then picture it, reverse it, and match.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word shows the **opposite action** to **"${v.interactWord}"**?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                relationship: v.interactDefinition,
                label: "Find the REVERSE action"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is an antonym of "${v.interactWord}"?`,
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
            title: () => "Reverse the action — nailed it!",
            body: () => `You've picked up a brilliant strategy here. The rewind trick works for any action word antonym:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Picture the action happening", why: "What does it look like?" },
                  { text: "2. Now imagine it in REVERSE", why: "Up → down, in → out, grow → shrink" },
                  { text: "3. Pick the word that matches the reversed picture", why: "expand ↔ contract, arrive ↔ depart ✓" }
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
  // SUB-CONCEPT 4: Graded vs Complementary Antonyms
  // Category: supporting
  // ==========================================
  {
    id: "graded-vs-complementary",
    name: "Graded vs Complementary Opposites",
    category: "supporting",
    lessons: [
      {
        id: "graded-complementary-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell the difference between graded antonyms (opposites with levels in between, like hot-warm-cool-cold) and complementary antonyms (opposites with nothing in between, like alive/dead) — this is fascinating stuff!",
          "Why graded antonyms have 'in-between' steps but complementary ones don't — once you see it, you can't unsee it"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "discovering that some opposites have a scale",
            wordA: "hot",
            wordB: "cold",
            scale: "boiling → hot → warm → cool → cold → freezing",
            type: "graded",
            explanation: "'Hot' and 'cold' are GRADED antonyms — there are steps in between (warm, cool). You can be a bit hot or very hot.",
            complementaryPair: "alive / dead",
            complementaryWhy: "You can't be 'a bit alive' — you're either alive or dead!",
            options: ["graded", "complementary", "prefix", "synonym", "random"],
            correctAnswer: "graded",
            fullExplanation: "'Hot' and 'cold' are graded antonyms because they exist on a scale with steps in between — warm, cool, etc. ✓",
            interactWordA: "happy",
            interactWordB: "sad",
            interactScale: "ecstatic → happy → content → sad → miserable",
            interactType: "graded",
            interactOptions: ["graded", "complementary", "prefix", "synonym", "related"],
            interactCorrectAnswer: "graded",
            interactExplanation: "'Happy' and 'sad' are graded antonyms — there are levels in between like content, pleased, disappointed. You can be a bit happy or very happy. ✓"
          },
          {
            name: "Oliver",
            scenario: "learning about either/or opposites",
            wordA: "true",
            wordB: "false",
            scale: "true ↔ false (no in-between!)",
            type: "complementary",
            explanation: "'True' and 'false' are COMPLEMENTARY antonyms — there's nothing in between. Something is either true or false.",
            complementaryPair: "open / shut",
            complementaryWhy: "A door is either open or shut — there's no middle ground!",
            options: ["complementary", "graded", "prefix", "synonym", "reverse"],
            correctAnswer: "complementary",
            fullExplanation: "'True' and 'false' are complementary antonyms — there is no middle ground. Something must be one or the other. ✓",
            interactWordA: "alive",
            interactWordB: "dead",
            interactScale: "alive ↔ dead (no in-between!)",
            interactType: "complementary",
            interactOptions: ["complementary", "graded", "prefix", "synonym", "action"],
            interactCorrectAnswer: "complementary",
            interactExplanation: "'Alive' and 'dead' are complementary antonyms — there is no middle ground. You are either alive or dead, with nothing in between. ✓"
          },
          {
            name: "Priya",
            scenario: "sorting antonyms into types",
            wordA: "tall",
            wordB: "short",
            scale: "towering → tall → average → short → tiny",
            type: "graded",
            explanation: "'Tall' and 'short' are GRADED antonyms — you can be quite tall, very tall, a bit short, or extremely short.",
            complementaryPair: "on / off",
            complementaryWhy: "A light is either on or off — there's no 'a bit on'!",
            options: ["graded", "complementary", "prefix", "similar", "related"],
            correctAnswer: "graded",
            fullExplanation: "'Tall' and 'short' are graded antonyms — there's a whole range of heights in between them. ✓",
            interactWordA: "loud",
            interactWordB: "quiet",
            interactScale: "deafening → loud → moderate → quiet → silent",
            interactType: "graded",
            interactOptions: ["graded", "complementary", "prefix", "action", "context"],
            interactCorrectAnswer: "graded",
            interactExplanation: "'Loud' and 'quiet' are graded antonyms — there are many levels of volume in between. You can be a bit loud or extremely quiet. ✓"
          },
          {
            name: "Finn",
            scenario: "working out which type of opposite each pair is",
            wordA: "pass",
            wordB: "fail",
            scale: "pass ↔ fail (no middle!)",
            type: "complementary",
            explanation: "'Pass' and 'fail' are COMPLEMENTARY antonyms — you either pass or you fail, there's no in-between.",
            complementaryPair: "present / absent",
            complementaryWhy: "You're either present or absent in class — you can't be half there!",
            options: ["complementary", "graded", "prefix", "context", "formal"],
            correctAnswer: "complementary",
            fullExplanation: "'Pass' and 'fail' are complementary antonyms — there's no middle result. You either passed or you didn't. ✓",
            interactWordA: "open",
            interactWordB: "shut",
            interactScale: "open ↔ shut (no middle!)",
            interactType: "complementary",
            interactOptions: ["complementary", "graded", "prefix", "similar", "formal"],
            interactCorrectAnswer: "complementary",
            interactExplanation: "'Open' and 'shut' are complementary antonyms — a door is either open or shut. There is no in-between state. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `"${v.wordA}" and "${v.wordB}" — what type of opposite?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know there are actually **two types** of opposite? Most people have no idea about this — so knowing it gives you a real edge!\n\n• **Graded** — opposites with steps in between (hot → warm → cool → cold)\n• **Complementary** — either/or with NO middle (alive or dead)\n\nWhich type are **"${v.wordA}"** and **"${v.wordB}"**?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.wordA],
                pair2word: v.wordA,
                answer: v.wordB,
                label: "Graded or complementary?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two types of opposite",
            body: (v) => `${v.explanation}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.wordA}" ↔ "${v.wordB}" = ${v.type}`, why: v.explanation },
                  { text: `Scale: ${v.scale}`, why: v.type === "graded" ? "See all the steps in between!" : "No steps — it's one or the other" },
                  { text: `Compare: "${v.complementaryPair}" = ${v.type === "graded" ? "complementary" : "graded"}`, why: v.complementaryWhy }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Are **"${v.interactWordA}"** and **"${v.interactWordB}"** graded or complementary antonyms?\n\nThink: is there anything in between?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWordA],
                pair2word: v.interactWordA,
                answer: v.interactWordB,
                label: "Graded or complementary?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of antonym pair is "${v.interactWordA}" and "${v.interactWordB}"?`,
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
            title: () => "Graded vs complementary — well done!",
            body: () => `How cool is this? You now know something that most grown-ups don't — there are actually two types of antonym:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Graded: hot/cold, tall/short, fast/slow", why: "A scale with steps in between" },
                  { text: "Complementary: alive/dead, true/false, pass/fail", why: "Either/or — no middle ground" },
                  { text: "Both are valid antonyms — knowing the type helps you pick!", why: "Ask: is there a middle? ✓" }
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
  // SUB-CONCEPT 5: Different NOT Opposite
  // Category: supporting
  // ==========================================
  {
    id: "different-not-opposite",
    name: "Different is NOT Opposite",
    category: "supporting",
    lessons: [
      {
        id: "different-not-opposite-steps",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why picking a DIFFERENT word is the most common antonym trap — knowing this gives you a huge advantage!",
          "How to check if a word is truly opposite or just unrelated"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "spotting the most common antonym mistake",
            word: "generous",
            wrongAnswer: "poor",
            actualAntonym: "selfish",
            friendWrong: "poor",
            friendReason: "because generous people give money and poor people don't have money",
            whyWrong: "'Poor' means having little money — but that's not the opposite of generous. A poor person can still be generous!",
            correctExplanation: "'Selfish' means unwilling to share — the exact opposite of 'generous' (willing to give freely). 'Poor' is about wealth, not character.",
            options: ["selfish", "poor", "greedy", "stingy", "mean"],
            correctAnswer: "selfish",
            interactWord: "polite",
            interactOptions: ["rude", "shy", "quiet", "clumsy", "boring"],
            interactCorrectAnswer: "rude",
            interactExplanation: "'Rude' is the true opposite of 'polite' — both describe manners. 'Shy' describes personality, not behaviour towards others."
          },
          {
            name: "Jack",
            scenario: "learning why 'different' isn't 'opposite'",
            word: "brave",
            wrongAnswer: "weak",
            actualAntonym: "cowardly",
            friendWrong: "weak",
            friendReason: "because brave people are strong and weak people aren't",
            whyWrong: "'Weak' means lacking physical strength — but bravery is about courage, not muscles! A weak person can be very brave",
            correctExplanation: "'Cowardly' means lacking courage — the exact opposite of 'brave'. 'Weak' describes physical strength, which is a completely different quality.",
            options: ["cowardly", "weak", "scared", "timid", "nervous"],
            correctAnswer: "cowardly",
            interactWord: "careful",
            interactOptions: ["careless", "fast", "wild", "risky", "clumsy"],
            interactCorrectAnswer: "careless",
            interactExplanation: "'Careless' is the true opposite of 'careful' — both describe how much attention you pay. 'Fast' describes speed, which is a different quality."
          },
          {
            name: "Zara",
            scenario: "helping spot the 'different not opposite' trap",
            word: "intelligent",
            wrongAnswer: "lazy",
            actualAntonym: "stupid",
            friendWrong: "lazy",
            friendReason: "because intelligent people work hard and lazy people don't",
            whyWrong: "'Lazy' means not wanting to work — but that's about effort, not brainpower! A lazy person can still be very intelligent",
            correctExplanation: "'Stupid' means lacking intelligence — the direct opposite. 'Lazy' describes work ethic, which is a completely different quality.",
            options: ["stupid", "lazy", "slow", "confused", "careless"],
            correctAnswer: "stupid",
            interactWord: "honest",
            interactOptions: ["dishonest", "rude", "secretive", "sneaky", "unfriendly"],
            interactCorrectAnswer: "dishonest",
            interactExplanation: "'Dishonest' is the true opposite of 'honest' — both describe truthfulness. 'Secretive' means keeping things private, which is different from being untruthful."
          },
          {
            name: "Charlie",
            scenario: "avoiding the biggest antonym mistake",
            word: "ancient",
            wrongAnswer: "new",
            actualAntonym: "modern",
            friendWrong: "new",
            friendReason: "because ancient things are old and new things aren't",
            whyWrong: "'New' means recently made — but 'ancient' describes an era, not just age. A building can be new but in an ancient style",
            correctExplanation: "'Modern' means relating to the present time — the direct opposite of 'ancient' (relating to the distant past). 'New' is about when something was made, not its era.",
            options: ["modern", "new", "young", "fresh", "recent"],
            correctAnswer: "modern",
            interactWord: "visible",
            interactOptions: ["invisible", "dark", "hidden", "blind", "faint"],
            interactCorrectAnswer: "invisible",
            interactExplanation: "'Invisible' is the true opposite of 'visible' — both describe whether something can be seen. 'Dark' describes light levels, which is a different quality."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really the opposite of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}. Someone picked **"${v.friendWrong}"** as the opposite of **"${v.word}"** — ${v.friendReason}.\n\nThis is the **number one trap** in the whole 11+ antonym section — and the brilliant news is, once you know about it, you'll never fall for it again!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Word: "${v.word}"` },
                  { text: `Answer chosen: "${v.friendWrong}" — is this REALLY the opposite?` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same quality, opposite end!",
            body: (v) => `${v.whyWrong}\n\nThis is the golden rule: an antonym must flip the **SAME quality**. If the original word is about generosity, the opposite must also be about generosity — not about something else entirely!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" is about one quality`, why: "Identify WHAT the word describes" },
                  { text: `"${v.friendWrong}" is about a DIFFERENT quality`, why: v.whyWrong },
                  { text: `"${v.actualAntonym}" flips the SAME quality ✓`, why: v.correctExplanation }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Find the TRUE opposite!",
            body: (v) => `Which word is the **true opposite** of **"${v.interactWord}"**?\n\nRemember: it must flip the SAME quality!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                label: "Flip the SAME quality"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the true antonym of "${v.interactWord}"?`,
              getOptions: (v) => v.interactOptions,
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! ${v.interactExplanation} ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.interactCorrectAnswer}". ${v.interactExplanation}`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The golden rule of antonyms",
            body: () => `This is one of the most useful things you'll learn for the 11+. Remember this one rule and you'll ace antonym questions every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. What quality does the word describe?", why: "Generosity? Courage? Intelligence? Age?" },
                  { text: "2. The antonym must describe THAT SAME quality", why: "Generous → selfish (both about sharing)" },
                  { text: "3. A DIFFERENT quality is NOT an antonym", why: "Generous ≠ poor, brave ≠ weak ✓" }
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
  // SUB-CONCEPT 6: Emotion Antonyms
  // Category: supporting
  // ==========================================
  {
    id: "emotion-antonyms",
    name: "Opposite Feelings",
    category: "supporting",
    lessons: [
      {
        id: "emotion-antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find opposite emotions at the same intensity level — like turning a dial, not smashing a button!",
          "Why matching the intensity matters for emotion antonyms"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching opposite emotions",
            word: "brave",
            antonym: "cowardly",
            definition: "having courage and not showing fear",
            oppositeDefinition: "lacking courage and giving in to fear",
            intensity: "medium-strong",
            wrongIntensity: "terrified",
            whyWrongIntensity: "'Terrified' is an emotion (extreme fear), but 'brave' is a character trait — they're not the same type",
            options: ["cowardly", "terrified", "timid", "nervous", "scared"],
            correctAnswer: "cowardly",
            explanation: "'Brave' means having courage and 'cowardly' means lacking courage — they are direct opposites about the same quality. 'Terrified' is an extreme emotion, not a character trait. ✓",
            interactWord: "generous",
            interactDefinition: "willing to give and share freely",
            interactIntensity: "moderate",
            interactOptions: ["selfish", "greedy", "poor", "stingy", "mean"],
            interactCorrectAnswer: "selfish",
            interactExplanation: "'Generous' means willing to share and 'selfish' means unwilling to share — they are direct opposites about the same quality at a similar intensity. 'Greedy' is about wanting more, not about refusing to share. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding opposite feeling words",
            word: "patient",
            antonym: "impatient",
            definition: "able to wait calmly without getting annoyed",
            oppositeDefinition: "unable to wait calmly; easily annoyed by delays",
            intensity: "moderate",
            wrongIntensity: "angry",
            whyWrongIntensity: "'Angry' is much stronger and broader than just not being patient",
            options: ["impatient", "angry", "restless", "irritable", "hasty"],
            correctAnswer: "impatient",
            explanation: "'Patient' means calmly waiting and 'impatient' means unable to wait calmly — exact opposites. 'Angry' is a much stronger, broader emotion. ✓",
            interactWord: "optimistic",
            interactDefinition: "expecting good things to happen",
            interactIntensity: "moderate",
            interactOptions: ["pessimistic", "depressed", "miserable", "worried", "negative"],
            interactCorrectAnswer: "pessimistic",
            interactExplanation: "'Optimistic' means expecting good outcomes and 'pessimistic' means expecting bad outcomes — they are direct opposites about the same quality. 'Depressed' is a much stronger, broader emotion. ✓"
          },
          {
            name: "Priya",
            scenario: "pairing up opposite feelings",
            word: "confident",
            antonym: "nervous",
            definition: "feeling sure of yourself",
            oppositeDefinition: "feeling worried and unsure of yourself",
            intensity: "moderate",
            wrongIntensity: "terrified",
            whyWrongIntensity: "'Terrified' is extreme fear — much stronger than the opposite of 'confident'",
            options: ["nervous", "terrified", "shy", "quiet", "weak"],
            correctAnswer: "nervous",
            explanation: "'Confident' means feeling sure of yourself and 'nervous' means feeling worried and unsure — they are direct opposites. 'Shy' is about personality, not feelings in a situation. ✓",
            interactWord: "calm",
            interactDefinition: "feeling relaxed and not worried",
            interactIntensity: "moderate",
            interactOptions: ["anxious", "terrified", "loud", "angry", "upset"],
            interactCorrectAnswer: "anxious",
            interactExplanation: "'Calm' means feeling relaxed and 'anxious' means feeling worried — they are direct opposites at a similar intensity. 'Terrified' is far too extreme to be the match. ✓"
          },
          {
            name: "Finn",
            scenario: "matching opposite emotion words",
            word: "cheerful",
            antonym: "miserable",
            definition: "feeling happy and positive",
            oppositeDefinition: "feeling unhappy and gloomy",
            intensity: "moderate-strong",
            wrongIntensity: "devastated",
            whyWrongIntensity: "'Devastated' means utterly destroyed emotionally — that's far too extreme",
            options: ["miserable", "devastated", "bored", "tired", "grumpy"],
            correctAnswer: "miserable",
            explanation: "'Cheerful' means feeling happy and bright, and 'miserable' means feeling deeply unhappy — they are direct opposites at a similar strength. ✓",
            interactWord: "proud",
            interactDefinition: "feeling pleased with your achievements",
            interactIntensity: "moderate",
            interactOptions: ["ashamed", "devastated", "humble", "embarrassed", "sorry"],
            interactCorrectAnswer: "ashamed",
            interactExplanation: "'Proud' means feeling pleased with yourself and 'ashamed' means feeling bad about yourself — they are direct opposites at a similar strength. 'Humble' describes personality, not a feeling. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the opposite of feeling "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**"${v.word}"** means ${v.definition}.\n\nHere's the thing about feelings — the opposite must flip the emotion **at the same level of intensity**. Think of it like a seesaw — both sides need to be the same height for it to balance!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.word],
                pair2word: v.word,
                answer: null,
                relationship: `${v.definition} (${v.intensity})`,
                label: "What is the OPPOSITE feeling?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Flip the feeling, match the level",
            body: (v) => `**"${v.word}"** means ${v.definition}. The opposite emotion must be about the **same thing** (e.g. courage, patience, happiness) and at the **same intensity** (${v.intensity}).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = ${v.definition}`, why: "The original feeling" },
                  { text: `"${v.antonym}" = ${v.oppositeDefinition}`, why: "Same quality, opposite direction ✓" },
                  { text: `Not "${v.wrongIntensity}"`, why: v.whyWrongIntensity }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "brave", right: "cowardly" },
                { left: "patient", right: "impatient" },
                { left: "confident", right: "nervous" },
                { left: "cheerful", right: "miserable" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word is the **opposite** of **"${v.interactWord}"**? Remember to match the intensity!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                relationship: `${v.interactDefinition} (${v.interactIntensity})`,
                label: "Find the OPPOSITE feeling"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is an antonym of "${v.interactWord}"?`,
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
            title: () => "Opposite feelings — same strength",
            body: () => `Brilliant work! You've got a great eye for matching intensity. For emotion antonyms, keep this seesaw idea in mind:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "brave ↔ cowardly (courage)", why: "Both moderate — about having or lacking courage" },
                  { text: "cheerful ↔ miserable (happiness)", why: "Both moderate-strong — about mood" },
                  { text: "Don't pick too-extreme words!", why: "Confident ≠ terrified, cheerful ≠ devastated ✓" }
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
  // SUB-CONCEPT 7: Hard Vocabulary Antonyms
  // Category: other
  // ==========================================
  {
    id: "hard-vocab-antonyms",
    name: "Tricky Vocabulary Opposites",
    category: "other",
    lessons: [
      {
        id: "hard-vocab-antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise advanced antonym pairs that appear in the 11+ — these are the ones that separate good scores from great ones!",
          "How to use elimination and word roots to work out unfamiliar pairs (you'll feel like a word detective)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling advanced antonym pairs",
            word: "benevolent",
            antonym: "malevolent",
            definition: "well-meaning and kind",
            oppositeDefinition: "wishing harm on others; evil-intentioned",
            hint: "'Bene-' means good (like 'benefit') and 'male-' means bad (like 'malicious')",
            options: ["malevolent", "selfish", "cruel", "hostile", "wicked"],
            correctAnswer: "malevolent",
            explanation: "'Benevolent' (well-meaning) and 'malevolent' (ill-meaning) are exact opposites. The Latin roots 'bene-' (good) and 'male-' (bad) are the clue. ✓",
            interactWord: "transparent",
            interactDefinition: "easy to see through; clear and open",
            interactHint: "'Trans-' means across/through — what means you CANNOT see through?",
            interactOptions: ["opaque", "dark", "thick", "hidden", "cloudy"],
            interactCorrectAnswer: "opaque",
            interactExplanation: "'Transparent' means see-through and 'opaque' means impossible to see through — they are exact opposites. 'Dark' is about light levels, not visibility through a material. ✓"
          },
          {
            name: "Marcus",
            scenario: "working on harder antonym pairs",
            word: "temporary",
            antonym: "permanent",
            definition: "lasting for only a short time",
            oppositeDefinition: "lasting forever or for a very long time",
            hint: "'Temporary' is about time — what lasts the LONGEST?",
            options: ["permanent", "eternal", "constant", "steady", "fixed"],
            correctAnswer: "permanent",
            explanation: "'Temporary' means short-lasting and 'permanent' means lasting indefinitely — they are direct opposites. 'Eternal' means forever, which is more extreme. ✓",
            interactWord: "innocent",
            interactDefinition: "not guilty; free from wrongdoing",
            interactHint: "If someone is NOT innocent in a court case, they are...?",
            interactOptions: ["guilty", "evil", "naughty", "criminal", "wicked"],
            interactCorrectAnswer: "guilty",
            interactExplanation: "'Innocent' means not guilty and 'guilty' means having done wrong — they are exact legal opposites. 'Evil' describes character, not a verdict. ✓"
          },
          {
            name: "Aisha",
            scenario: "decoding difficult antonym vocabulary",
            word: "artificial",
            antonym: "natural",
            definition: "made by humans; not occurring naturally",
            oppositeDefinition: "occurring in nature; not made by humans",
            hint: "'Artificial' means man-made — what's the opposite of man-made?",
            options: ["natural", "organic", "real", "genuine", "pure"],
            correctAnswer: "natural",
            explanation: "'Artificial' means made by humans and 'natural' means occurring in nature — exact opposites. 'Real' is close but more about authenticity than origin. ✓",
            interactWord: "voluntary",
            interactDefinition: "done by choice, not forced",
            interactHint: "If something is NOT done by choice but you MUST do it, it's...?",
            interactOptions: ["compulsory", "difficult", "unfair", "unpaid", "forced"],
            interactCorrectAnswer: "compulsory",
            interactExplanation: "'Voluntary' means by choice and 'compulsory' means required — they are exact opposites. 'Forced' is close but 'compulsory' is the precise formal antonym. ✓"
          },
          {
            name: "Charlie",
            scenario: "handling the toughest antonym pairs",
            word: "abundant",
            antonym: "scarce",
            definition: "existing in very large quantities; plentiful",
            oppositeDefinition: "in short supply; not enough",
            hint: "'Abundant' means there's LOADS — what means there's NOT ENOUGH?",
            options: ["scarce", "empty", "rare", "missing", "limited"],
            correctAnswer: "scarce",
            explanation: "'Abundant' means plentiful and 'scarce' means in short supply — they are direct opposites. 'Rare' means uncommon, which is about frequency not quantity. ✓",
            interactWord: "enormous",
            interactDefinition: "extremely large in size",
            interactHint: "If something is NOT enormous but extremely small, it's...?",
            interactOptions: ["tiny", "short", "narrow", "light", "thin"],
            interactCorrectAnswer: "tiny",
            interactExplanation: "'Enormous' means extremely large and 'tiny' means extremely small — they are direct opposites at a similar intensity. 'Short' describes height specifically, not overall size. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the opposite of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDon't let **"${v.word}"** intimidate you — it just means: ${v.definition}\n\nHere's a clue to get you going: ${v.hint}\n\nCan you work out which option is the true opposite? You've absolutely got this!`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.word],
                pair2word: v.word,
                answer: null,
                relationship: v.definition,
                label: "Find the OPPOSITE"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use roots and elimination!",
            body: (v) => `**"${v.word}"** means ${v.definition}. Even when the words look scary, you have two brilliant strategies: **word roots** (prefixes/suffixes that give clues) and **elimination** (crossing out what you KNOW is wrong).`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" means: ${v.definition}`, why: "Define it clearly first" },
                  { text: `Flip it: ${v.oppositeDefinition}`, why: "What does the opposite look like?" },
                  { text: `"${v.antonym}" = ${v.oppositeDefinition} ✓`, why: "The direct opposite" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Define the word: "${v.word}" means ${v.definition}`,
                `Flip the meaning: ${v.oppositeDefinition}`,
                `Match to the answer: "${v.antonym}"`
              ],
              feedback: {
                correct: (v) => `Spot on! Define, flip, then match — that's the recipe. ✓`,
                incorrect: (v) => `Not quite — first define the word, then flip its meaning, then find the match.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word is the **opposite** of **"${v.interactWord}"**?\n\nHint: ${v.interactHint}`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                relationship: v.interactDefinition,
                label: "Find the OPPOSITE"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is an antonym of "${v.interactWord}"?`,
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
            title: () => "Advanced antonyms — you're ready for these!",
            body: () => `Look at you tackling the tough ones! When you come across hard vocabulary in the exam, you now have a proper game plan:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Look for root word clues", why: "bene- = good, male- = bad, temp- = time" },
                  { text: "2. Define the word, then flip it", why: "Plentiful → in short supply = scarce" },
                  { text: "3. Eliminate options that are DIFFERENT, not opposite", why: "Abundant ≠ empty, artificial ≠ pure ✓" }
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
  // SUB-CONCEPT 8: Adjective Antonyms
  // Category: other
  // ==========================================
  {
    id: "adjective-antonyms",
    name: "Describing Word Opposites",
    category: "other",
    lessons: [
      {
        id: "adjective-antonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find opposites for describing words (adjectives) — think about what quality is being described",
          "Why checking WHAT is being described helps you pick the right antonym every time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching opposite describing words",
            word: "rough",
            antonym: "smooth",
            thingDescribed: "a surface",
            quality: "texture",
            sentence: "The wall had a rough surface.",
            options: ["smooth", "soft", "flat", "clean", "shiny"],
            correctAnswer: "smooth",
            explanation: "'Rough' and 'smooth' are opposites describing TEXTURE. 'Soft' describes how something feels under pressure, not its surface texture. ✓",
            interactWord: "narrow",
            interactQuality: "width",
            interactSentence: "They walked along a narrow path through the woods.",
            interactOptions: ["wide", "long", "big", "open", "broad"],
            interactCorrectAnswer: "wide",
            interactExplanation: "'Narrow' and 'wide' are opposites describing WIDTH. 'Long' describes length, which is a completely different measurement. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding opposite adjectives",
            word: "deep",
            antonym: "shallow",
            thingDescribed: "a river",
            quality: "depth",
            sentence: "The river was very deep at that point.",
            options: ["shallow", "narrow", "calm", "short", "thin"],
            correctAnswer: "shallow",
            explanation: "'Deep' and 'shallow' are opposites describing DEPTH. 'Narrow' describes width, which is a completely different measurement. ✓",
            interactWord: "blunt",
            interactQuality: "sharpness",
            interactSentence: "The scissors were too blunt to cut the paper.",
            interactOptions: ["sharp", "thin", "new", "pointed", "dangerous"],
            interactCorrectAnswer: "sharp",
            interactExplanation: "'Blunt' and 'sharp' are opposites describing SHARPNESS. 'Thin' describes thickness, which is a completely different quality. ✓"
          },
          {
            name: "Priya",
            scenario: "pairing up opposite adjectives",
            word: "ancient",
            antonym: "modern",
            thingDescribed: "a city",
            quality: "age/era",
            sentence: "They visited the ancient city of Rome.",
            options: ["modern", "new", "young", "fresh", "recent"],
            correctAnswer: "modern",
            explanation: "'Ancient' means from the distant past and 'modern' means from the present era — they describe opposite TIME PERIODS. 'New' is about when something was made, not its era. ✓",
            interactWord: "rigid",
            interactQuality: "flexibility",
            interactSentence: "The ruler was rigid and would not bend.",
            interactOptions: ["flexible", "soft", "thin", "broken", "loose"],
            interactCorrectAnswer: "flexible",
            interactExplanation: "'Rigid' and 'flexible' are opposites describing FLEXIBILITY — how easily something bends. 'Soft' describes texture, which is a different quality. ✓"
          },
          {
            name: "Finn",
            scenario: "matching opposite describing words",
            word: "transparent",
            antonym: "opaque",
            thingDescribed: "glass",
            quality: "clarity/see-through-ness",
            sentence: "The transparent glass let all the light through.",
            options: ["opaque", "dark", "thick", "solid", "cloudy"],
            correctAnswer: "opaque",
            explanation: "'Transparent' means you can see through it and 'opaque' means you cannot see through it — exact opposites about the same quality. 'Dark' is about light, not visibility. ✓",
            interactWord: "hollow",
            interactQuality: "solidity",
            interactSentence: "The tree trunk was hollow inside.",
            interactOptions: ["solid", "heavy", "full", "thick", "hard"],
            interactCorrectAnswer: "solid",
            interactExplanation: "'Hollow' means empty inside and 'solid' means filled all the way through — exact opposites describing SOLIDITY. 'Heavy' describes weight, not internal structure. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the opposite of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**"${v.sentence}"**\n\nHere's the key question: what **quality** is **"${v.word}"** describing about ${v.thingDescribed}? It's the **${v.quality}**. To find the opposite, you need a word that flips THAT exact quality on its head.`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.word],
                pair2word: v.word,
                answer: null,
                relationship: `Describes: ${v.quality}`,
                label: "Find the OPPOSITE quality"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same quality, opposite direction",
            body: (v) => `**"${v.word}"** describes the **${v.quality}** of ${v.thingDescribed}. An adjective antonym must describe the **same quality** but in the **opposite direction**.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" describes ${v.quality} of ${v.thingDescribed}`, why: "What quality is being described?" },
                  { text: `"${v.antonym}" describes the OPPOSITE ${v.quality}`, why: "Same quality, flipped to the other end" },
                  { text: `Other options describe DIFFERENT qualities`, why: "Depth ≠ width, texture ≠ hardness ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**"${v.interactSentence}"**\n\nWhich word is the **opposite** of **"${v.interactWord}"**?`,
            visual: {
              component: "AnalogyDisplay",
              props: (v) => ({
                mode: "antonym",
                pair1: [v.interactWord],
                pair2word: v.interactWord,
                answer: null,
                relationship: `Describes: ${v.interactQuality}`,
                label: "Find the OPPOSITE quality"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is an antonym of "${v.interactWord}"?`,
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
            title: () => "Describing word antonyms — great work!",
            body: () => `You're getting really good at this! The trick with describing words is always the same — find the quality, then flip it. Here's your recipe:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. What quality is the word describing?", why: "Texture? Depth? Age? Clarity?" },
                  { text: "2. Find the option that flips THAT quality", why: "Rough → smooth (texture), deep → shallow (depth)" },
                  { text: "3. Reject words that describe different qualities", why: "Deep ≠ narrow, rough ≠ soft ✓" }
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

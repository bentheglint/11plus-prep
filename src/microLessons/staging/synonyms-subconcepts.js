// ============================================================
// Supplementary sub-concepts for Synonyms (Verbal Reasoning)
// To merge: add these to lessonBank.synonyms.subConcepts array in lessonData.js
// ============================================================

export const synonymsSubConcepts = [

  // ==========================================
  // SUB-CONCEPT 1: Common Everyday Synonyms
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "common-synonyms",
    name: "Common Everyday Synonyms",
    category: "core",
    lessons: [
      {
        id: "common-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot everyday synonym (words that mean the same thing) pairs — you already know more of these than you realise!",
          "How to use the swap test — pop a word into a sentence, swap it out, and if the meaning stays the same, you've found a synonym. This trick is golden!"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching words with the same meaning",
            word: "happy",
            synonym: "glad",
            definition: "feeling pleased",
            testSentence: "She was **happy** about her result → She was **glad** about her result",
            options: ["glad", "excited", "calm", "shy", "proud"],
            correctAnswer: "glad",
            explanation: "'Happy' and 'glad' both mean feeling pleased. 'Excited' is close but means thrilled, which is stronger. ✓",
            trap: "excited",
            trapReason: "'Excited' means thrilled or buzzing — that's STRONGER than happy, not the same",
            interactWord: "small",
            interactDefinition: "not large in size",
            interactOptions: ["little", "tiny", "short", "thin", "narrow"],
            interactCorrectAnswer: "little",
            interactExplanation: "'Small' and 'little' both mean not large in size. 'Tiny' is much stronger — it means VERY small. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding words that mean the same thing",
            word: "cold",
            synonym: "chilly",
            definition: "low in temperature",
            testSentence: "It was a **cold** morning → It was a **chilly** morning",
            options: ["chilly", "freezing", "cool", "icy", "damp"],
            correctAnswer: "chilly",
            explanation: "'Cold' and 'chilly' both mean low in temperature. 'Freezing' is too extreme — it means VERY cold. ✓",
            trap: "freezing",
            trapReason: "'Freezing' is much stronger than cold — it means extremely cold, like below zero",
            interactWord: "tired",
            interactDefinition: "needing rest or sleep",
            interactOptions: ["weary", "exhausted", "lazy", "bored", "sleepy"],
            interactCorrectAnswer: "weary",
            interactExplanation: "'Tired' and 'weary' both mean needing rest. 'Exhausted' is too extreme — it means COMPLETELY drained. ✓"
          },
          {
            name: "Priya",
            scenario: "practising synonym pairs for her VR test",
            word: "fast",
            synonym: "quick",
            definition: "moving with speed",
            testSentence: "The **fast** runner won → The **quick** runner won",
            options: ["quick", "racing", "busy", "first", "sharp"],
            correctAnswer: "quick",
            explanation: "'Fast' and 'quick' both mean moving with speed. 'Racing' describes an activity, not a quality. ✓",
            trap: "racing",
            trapReason: "'Racing' is something you DO, not how you ARE — it's a verb, not an adjective",
            interactWord: "angry",
            interactDefinition: "feeling strong displeasure",
            interactOptions: ["cross", "furious", "rude", "mean", "upset"],
            interactCorrectAnswer: "cross",
            interactExplanation: "'Angry' and 'cross' both mean feeling strong displeasure. 'Furious' is too extreme — it means VERY angry. ✓"
          },
          {
            name: "Finn",
            scenario: "working through a synonym quiz",
            word: "shut",
            synonym: "close",
            definition: "to make not open",
            testSentence: "Please **shut** the door → Please **close** the door",
            options: ["close", "lock", "block", "seal", "slam"],
            correctAnswer: "close",
            explanation: "'Shut' and 'close' both mean to make not open. 'Lock' goes further — it means to fasten shut with a key. ✓",
            trap: "lock",
            trapReason: "'Lock' means to fasten with a key — that's MORE than just closing, it's securing",
            interactWord: "begin",
            interactDefinition: "to start something",
            interactOptions: ["start", "open", "launch", "try", "enter"],
            interactCorrectAnswer: "start",
            interactExplanation: "'Begin' and 'start' both mean to get something going. 'Launch' is too specific — it usually means releasing something big. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What means the same as "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know that English has loads of words that mean exactly the same thing? **"${v.word}"** means ${v.definition}.\n\nCan you spot which other word means exactly the same? Careful though — the 11+ loves sneaking in words that are close but not quite right!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} — ${v.definition}`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Which word means the same?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Swap Test",
            body: (v) => `Here's a brilliant trick you can use anywhere! Pop **"${v.word}"** and **"${v.synonym}"** into the same sentence — if the meaning stays **exactly** the same, they're synonyms. Easy!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" means: ${v.definition}`, why: "Define the word first" },
                  { text: `Try the swap: ${v.testSentence.replace(/\*\*/g, '')}`, why: "Same meaning? Then it's a synonym!" },
                  { text: `Watch out for "${v.trap}"`, why: v.trapReason }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `A synonym is a word that means the ____ as another word`,
              options: (v) => ["same", "opposite", "different", "nothing"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Spot on! Synonyms are words with the same meaning — you've got this! ✓`,
                incorrect: (v) => `Nearly! Synonyms mean the SAME as each other — think of them as word twins.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word means the **same** as **"${v.interactWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactWord} = ${v.interactDefinition}`,
                highlightWords: [{ word: v.interactWord, color: "#7C3AED" }],
                label: "Find the exact match:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is a synonym of "${v.interactWord}"?`,
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
            title: () => "The Swap Test — your secret weapon!",
            body: () => `You've nailed it! Next time you need a synonym, just follow these three quick steps:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Define the word in your own words", why: "What does it actually mean?" },
                  { text: "2. Try swapping each option into a sentence", why: "Does the sentence still mean the same?" },
                  { text: "3. Watch out for CLOSE but not SAME", why: "A word can be related without being a synonym ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "common-synonyms-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "Why picking a RELATED word isn't the same as picking a SYNONYM — once you know this trick, you'll dodge a trap that catches loads of people!",
          "How to spot the sneaky 'close but not quite' options and avoid them like a pro"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "checking her friend's VR homework",
            word: "loud",
            wrongAnswer: "noisy",
            actualSynonym: "noisy",
            friendWrong: "deafening",
            friendReason: "because loud things are deafening",
            whyWrong: "'Deafening' means SO loud it hurts your ears — that's much stronger than just 'loud'",
            correctExplanation: "'Noisy' means making a lot of sound — same as 'loud'. 'Deafening' is the extreme version.",
            options: ["noisy", "deafening", "blaring", "piercing", "booming"],
            correctAnswer: "noisy",
            interactWord: "wet",
            interactOptions: ["damp", "soaking", "flooded", "dripping", "soggy"],
            interactCorrectAnswer: "damp",
            interactExplanation: "'Wet' and 'damp' are both at the same moderate level. 'Soaking' means completely drenched — much stronger. ✓"
          },
          {
            name: "Marcus",
            scenario: "reviewing his practice test answers",
            word: "pretty",
            wrongAnswer: "gorgeous",
            actualSynonym: "attractive",
            friendWrong: "gorgeous",
            friendReason: "because pretty things are gorgeous",
            whyWrong: "'Gorgeous' means EXTREMELY beautiful — it's much stronger than 'pretty'",
            correctExplanation: "'Attractive' means pleasant to look at — same level as 'pretty'. 'Gorgeous' is over the top.",
            options: ["attractive", "gorgeous", "stunning", "elegant", "cute"],
            correctAnswer: "attractive",
            interactWord: "funny",
            interactOptions: ["amusing", "hilarious", "ridiculous", "silly", "strange"],
            interactCorrectAnswer: "amusing",
            interactExplanation: "'Funny' and 'amusing' are at the same gentle level. 'Hilarious' means extremely funny — too strong to be a synonym. ✓"
          },
          {
            name: "Aisha",
            scenario: "helping her brother with VR questions",
            word: "nice",
            wrongAnswer: "wonderful",
            actualSynonym: "pleasant",
            friendWrong: "wonderful",
            friendReason: "because nice things are wonderful",
            whyWrong: "'Wonderful' means AMAZINGLY good — that's way stronger than 'nice'",
            correctExplanation: "'Pleasant' means agreeable and nice — it's the same gentle level. 'Wonderful' is much bigger.",
            options: ["pleasant", "wonderful", "fantastic", "brilliant", "superb"],
            correctAnswer: "pleasant",
            interactWord: "clever",
            interactOptions: ["smart", "genius", "brilliant", "gifted", "wise"],
            interactCorrectAnswer: "smart",
            interactExplanation: "'Clever' and 'smart' are both at the same everyday level. 'Genius' means extraordinarily intelligent — way too strong. ✓"
          },
          {
            name: "Charlie",
            scenario: "going over his mock test results",
            word: "old",
            wrongAnswer: "ancient",
            actualSynonym: "elderly",
            friendWrong: "ancient",
            friendReason: "because old means ancient",
            whyWrong: "'Ancient' means THOUSANDS of years old — way beyond just 'old'",
            correctExplanation: "'Elderly' means old (especially for people) — same level. 'Ancient' is extreme.",
            options: ["elderly", "ancient", "prehistoric", "antique", "vintage"],
            correctAnswer: "elderly",
            interactWord: "hard",
            interactOptions: ["tough", "impossible", "extreme", "painful", "awful"],
            interactCorrectAnswer: "tough",
            interactExplanation: "'Hard' and 'tough' are both at the same moderate level of difficulty. 'Impossible' means it can't be done at all — far too strong. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Is "${v.friendWrong}" really a synonym of "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}. The answer given was **"${v.friendWrong}"** as a synonym for **"${v.word}"** — ${v.friendReason}.\n\nHmm, that sounds reasonable... but is it actually right? Let's put on our detective hats and find out!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} — is ${v.friendWrong} really a synonym?`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }, { word: v.friendWrong, color: "#dc2626" }],
                label: "Spot the mistake"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Strength Matters!",
            body: (v) => `${v.whyWrong}\n\nA synonym must be at the **same level of strength**. Words that are STRONGER or WEAKER aren't synonyms — they're just related.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = moderate level`, why: "The original word" },
                  { text: `"${v.friendWrong}" = EXTREME level`, why: v.whyWrong },
                  { text: `"${v.actualSynonym}" = same level ✓`, why: v.correctExplanation }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.friendWrong}" is a synonym of "${v.word}"`, answer: false, explanation: `No — ${v.whyWrong}. It's too extreme to be a synonym.` },
                { text: `"${v.actualSynonym}" is a synonym of "${v.word}"`, answer: true, explanation: `Yes — ${v.correctExplanation} ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Find the TRUE synonym!",
            body: (v) => `Which word is at the **same level** as **"${v.interactWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactWord} — find the same-level match`,
                highlightWords: [{ word: v.interactWord, color: "#7C3AED" }],
                label: "Not stronger, not weaker — the SAME:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the closest synonym of "${v.interactWord}"?`,
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
            title: () => "Same level, same meaning — well done!",
            body: () => `Brilliant work! You've cracked one of the trickiest synonym traps going. Remember this golden rule: a synonym must match BOTH the meaning AND the strength:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "A synonym means the SAME thing", why: "Not just related — the same" },
                  { text: "Check the strength level", why: "Is it the same strength? Mild=mild, strong=strong" },
                  { text: "If it's stronger or weaker, it's NOT a match", why: "Nice ≠ wonderful, cold ≠ freezing ✓" }
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
  // SUB-CONCEPT 2: Formal vs Informal Synonyms
  // Category: core
  // ==========================================
  {
    id: "formal-informal",
    name: "Formal vs Informal Words",
    category: "core",
    lessons: [
      {
        id: "formal-informal-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise that formal and informal words can be synonyms — every posh word has a simple twin hiding in plain sight!",
          "Why the 11+ loves pairing a fancy word with a simple one (and how to crack it every time)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching formal words to everyday ones",
            formalWord: "purchase",
            simpleWord: "buy",
            definition: "to get something by paying for it",
            testSentence: "Mum went to **purchase** a dress → Mum went to **buy** a dress",
            options: ["buy", "sell", "shop", "pay", "order"],
            correctAnswer: "buy",
            explanation: "'Purchase' is the formal way of saying 'buy'. They mean exactly the same thing. ✓",
            interactFormalWord: "terminate",
            interactSimpleWord: "end",
            interactDefinition: "to bring something to a finish",
            interactOptions: ["end", "break", "pause", "cancel", "quit"],
            interactCorrectAnswer: "end",
            interactExplanation: "'Terminate' is the formal way of saying 'end'. They both mean to bring something to a finish. ✓"
          },
          {
            name: "Oliver",
            scenario: "connecting posh words to normal ones",
            formalWord: "commence",
            simpleWord: "begin",
            definition: "to start something",
            testSentence: "The show will **commence** at 7pm → The show will **begin** at 7pm",
            options: ["begin", "finish", "continue", "prepare", "arrive"],
            correctAnswer: "begin",
            explanation: "'Commence' is the formal way of saying 'begin'. Same meaning, just fancier language. ✓",
            interactFormalWord: "depart",
            interactSimpleWord: "leave",
            interactDefinition: "to go away from a place",
            interactOptions: ["leave", "escape", "travel", "move", "disappear"],
            interactCorrectAnswer: "leave",
            interactExplanation: "'Depart' is the formal way of saying 'leave'. Both mean going away from a place. ✓"
          },
          {
            name: "Priya",
            scenario: "decoding formal vocabulary",
            formalWord: "reside",
            simpleWord: "live",
            definition: "to have your home somewhere",
            testSentence: "They **reside** in London → They **live** in London",
            options: ["live", "stay", "visit", "work", "travel"],
            correctAnswer: "live",
            explanation: "'Reside' is the formal word for 'live' (as in where your home is). ✓",
            interactFormalWord: "enquire",
            interactSimpleWord: "ask",
            interactDefinition: "to request information about something",
            interactOptions: ["ask", "demand", "wonder", "check", "investigate"],
            interactCorrectAnswer: "ask",
            interactExplanation: "'Enquire' is the formal way of saying 'ask'. Both mean to request information. ✓"
          },
          {
            name: "Finn",
            scenario: "matching up formal and everyday words",
            formalWord: "assist",
            simpleWord: "help",
            definition: "to give support to someone",
            testSentence: "Can you **assist** me? → Can you **help** me?",
            options: ["help", "teach", "follow", "join", "lead"],
            correctAnswer: "help",
            explanation: "'Assist' is the formal way of saying 'help'. Both mean giving support. ✓",
            interactFormalWord: "require",
            interactSimpleWord: "need",
            interactDefinition: "to have to have something",
            interactOptions: ["need", "want", "wish", "demand", "expect"],
            interactCorrectAnswer: "need",
            interactExplanation: "'Require' is the formal way of saying 'need'. Both mean having to have something. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does "${v.formalWord}" mean?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know the 11+ is packed with **formal** (posh-sounding) words? But here's the best-kept secret — they almost always have a **dead simple synonym** hiding in the options!\n\n**"${v.formalWord}"** — any ideas what this fancy word means?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.formalWord} — ${v.definition}`,
                highlightWords: [{ word: v.formalWord, color: "#7C3AED" }],
                label: "What is the everyday version?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Posh word → simple word",
            body: (v) => `The word **"${v.formalWord}"** is just a fancy way of saying **"${v.simpleWord}"**. Loads of 11+ synonym questions pair a **formal word** with its **everyday twin** — they mean exactly the same thing. Once you spot the pattern, these questions become free marks!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.formalWord}" = ${v.definition}`, why: "The formal version" },
                  { text: `"${v.simpleWord}" = ${v.definition}`, why: "The everyday version" },
                  { text: `Swap test: ${v.testSentence.replace(/\*\*/g, '')}`, why: "Same meaning — they're synonyms! ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "purchase", right: "buy" },
                { left: "commence", right: "begin" },
                { left: "reside", right: "live" },
                { left: "assist", right: "help" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which everyday word means the same as **"${v.interactFormalWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactFormalWord} = ${v.interactDefinition}`,
                highlightWords: [{ word: v.interactFormalWord, color: "#7C3AED" }],
                label: "Find the simple version:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is a synonym of "${v.interactFormalWord}"?`,
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
            title: () => "Formal = Everyday — you've cracked the code!",
            body: () => `Here's the thing: loads of 11+ words are just posh versions of words you already know. Once you see the pattern, you'll wonder why they ever looked tricky:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "purchase = buy", why: "Formal word → everyday word" },
                  { text: "commence = begin", why: "Same meaning, different style" },
                  { text: "reside = live  |  assist = help", why: "The simple word is always the synonym ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "formal-informal-hook",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to recognise formal-informal synonym pairs — the kind that pop up all the time in the 11+",
          "How to decode unfamiliar formal words like a word detective (this is a superpower!)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "puzzling over an unfamiliar word",
            formalWord: "sufficient",
            simpleWord: "enough",
            definition: "as much as is needed",
            testSentence: "Is there **sufficient** food? → Is there **enough** food?",
            options: ["enough", "plenty", "extra", "some", "full"],
            correctAnswer: "enough",
            explanation: "'Sufficient' means 'enough' — as much as is needed, no more. ✓",
            interactFormalWord: "obtain",
            interactSimpleWord: "get",
            interactDefinition: "to come to have something",
            interactOptions: ["get", "find", "earn", "take", "collect"],
            interactCorrectAnswer: "get",
            interactExplanation: "'Obtain' is the formal way of saying 'get'. Both mean to come to have something. ✓"
          },
          {
            name: "Marcus",
            scenario: "trying to match a tricky word",
            formalWord: "prohibit",
            simpleWord: "ban",
            definition: "to say something is not allowed",
            testSentence: "They **prohibit** running → They **ban** running",
            options: ["ban", "allow", "punish", "stop", "prevent"],
            correctAnswer: "ban",
            explanation: "'Prohibit' means 'ban' — to officially say something is not allowed. ✓",
            interactFormalWord: "notify",
            interactSimpleWord: "tell",
            interactDefinition: "to let someone know about something",
            interactOptions: ["tell", "warn", "remind", "report", "shout"],
            interactCorrectAnswer: "tell",
            interactExplanation: "'Notify' is the formal way of saying 'tell'. Both mean letting someone know about something. ✓"
          },
          {
            name: "Aisha",
            scenario: "working out a formal word she hasn't seen before",
            formalWord: "conceal",
            simpleWord: "hide",
            definition: "to keep out of sight",
            testSentence: "He tried to **conceal** the gift → He tried to **hide** the gift",
            options: ["hide", "steal", "wrap", "lose", "bury"],
            correctAnswer: "hide",
            explanation: "'Conceal' means 'hide' — to keep something out of sight. ✓",
            interactFormalWord: "permit",
            interactSimpleWord: "allow",
            interactDefinition: "to give someone permission to do something",
            interactOptions: ["allow", "force", "invite", "order", "encourage"],
            interactCorrectAnswer: "allow",
            interactExplanation: "'Permit' is the formal way of saying 'allow'. Both mean giving someone permission. ✓"
          },
          {
            name: "Charlie",
            scenario: "decoding a word in a VR question",
            formalWord: "diminish",
            simpleWord: "shrink",
            definition: "to become smaller or less",
            testSentence: "The crowd began to **diminish** → The crowd began to **shrink**",
            options: ["shrink", "grow", "change", "scatter", "vanish"],
            correctAnswer: "shrink",
            explanation: "'Diminish' means 'shrink' — to become smaller or less. 'Vanish' means disappear completely, which is too extreme. ✓",
            interactFormalWord: "respond",
            interactSimpleWord: "reply",
            interactDefinition: "to give an answer to someone",
            interactOptions: ["reply", "speak", "agree", "explain", "comment"],
            interactCorrectAnswer: "reply",
            interactExplanation: "'Respond' is the formal way of saying 'reply'. Both mean giving an answer to someone. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Have you ever heard "${v.formalWord}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know that even adults sometimes get tripped up by fancy words? But here's the good news — formal words almost always have a **simple everyday synonym** hiding nearby. You just need to decode it!\n\n**"${v.formalWord}"** — have a guess at what it means. You might surprise yourself!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.formalWord} — can you guess what this means?`,
                highlightWords: [{ word: v.formalWord, color: "#7C3AED" }],
                label: "Find the simple synonym"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Become a word detective!",
            body: (v) => `You might not know **"${v.formalWord}"** yet — and that's completely fine! Everyone meets new words. The clever bit is knowing how to figure them out. Try these detective tricks:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Does it SOUND like a word you know?", why: "'Sufficient' sounds a bit like 'it'll suffice' — enough!" },
                  { text: "Does part of the word give a clue?", why: "'Prohibit' has 'hibit' like 'exhibit' — both are about showing/not showing" },
                  { text: `Answer: "${v.formalWord}" = "${v.simpleWord}"`, why: v.definition }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the unfamiliar word: "${v.formalWord}"`,
                `Check if it sounds like a word you know`,
                `Look for clues in parts of the word`,
                `Pick the simple synonym: "${v.simpleWord}"`
              ],
              feedback: {
                correct: (v) => `Perfect order! That's how to decode formal words. ✓`,
                incorrect: (v) => `Not quite — start by reading the word, then use sound and word-part clues before picking.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which simple word means the same as **"${v.interactFormalWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactFormalWord} = ${v.interactDefinition}`,
                highlightWords: [{ word: v.interactFormalWord, color: "#7C3AED" }],
                label: "Find the everyday synonym:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word is a synonym of "${v.interactFormalWord}"?`,
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
            title: () => "Don't panic — you can decode it!",
            body: () => `Every single 11+ student sees unfamiliar words — even the ones who get top marks. The difference? They don't panic. They decode:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Does it sound like a word you know?", why: "Sound clues work surprisingly often" },
                  { text: "2. Does part of the word give a hint?", why: "Prefixes and roots can unlock meaning" },
                  { text: "3. Try the options — which one fits?", why: "The simple synonym is usually hiding in plain sight ✓" }
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
  // SUB-CONCEPT 3: Verb Synonyms
  // Category: core
  // ==========================================
  {
    id: "verb-synonyms",
    name: "Action Word Synonyms",
    category: "core",
    lessons: [
      {
        id: "verb-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find synonyms for action words (verbs) — imagine the action like a video in your head!",
          "Why picturing the action helps you find the match every time"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "matching action words",
            word: "destroy",
            synonym: "demolish",
            definition: "to completely wreck or ruin something",
            testSentence: "They will **destroy** the old building → They will **demolish** the old building",
            options: ["demolish", "damage", "remove", "clear", "abandon"],
            correctAnswer: "demolish",
            explanation: "'Destroy' and 'demolish' both mean to completely wreck something. 'Damage' means to harm, not destroy completely. ✓",
            interactWord: "grab",
            interactDefinition: "to take hold of something quickly",
            interactOptions: ["seize", "touch", "hold", "pull", "steal"],
            interactCorrectAnswer: "seize",
            interactExplanation: "'Grab' and 'seize' both mean to take hold of something quickly and firmly. 'Hold' means to keep in your hand, not the act of grabbing. ✓"
          },
          {
            name: "Noah",
            scenario: "finding action word matches",
            word: "construct",
            synonym: "build",
            definition: "to put something together",
            testSentence: "They plan to **construct** a bridge → They plan to **build** a bridge",
            options: ["build", "design", "plan", "repair", "paint"],
            correctAnswer: "build",
            explanation: "'Construct' and 'build' both mean to put something together. 'Design' means to draw the plans, not build it. ✓",
            interactWord: "mend",
            interactDefinition: "to fix something that is broken",
            interactOptions: ["repair", "change", "clean", "replace", "adjust"],
            interactCorrectAnswer: "repair",
            interactExplanation: "'Mend' and 'repair' both mean to fix something that is broken. 'Replace' means to swap for a new one, not fix the old one. ✓"
          },
          {
            name: "Isla",
            scenario: "matching verbs in her VR practice",
            word: "observe",
            synonym: "watch",
            definition: "to look at carefully",
            testSentence: "She liked to **observe** the birds → She liked to **watch** the birds",
            options: ["watch", "find", "count", "chase", "draw"],
            correctAnswer: "watch",
            explanation: "'Observe' and 'watch' both mean to look at carefully. 'Find' means to discover, which is different. ✓",
            interactWord: "vanish",
            interactDefinition: "to go out of sight suddenly",
            interactOptions: ["disappear", "hide", "leave", "fade", "escape"],
            interactCorrectAnswer: "disappear",
            interactExplanation: "'Vanish' and 'disappear' both mean to go out of sight suddenly. 'Hide' means to put yourself out of sight on purpose, which is different. ✓"
          },
          {
            name: "Kai",
            scenario: "pairing up action words",
            word: "whisper",
            synonym: "murmur",
            definition: "to speak very softly",
            testSentence: "She would **whisper** the secret → She would **murmur** the secret",
            options: ["murmur", "shout", "say", "mutter", "sing"],
            correctAnswer: "murmur",
            explanation: "'Whisper' and 'murmur' both mean to speak very softly. 'Mutter' means to grumble quietly — slightly different. ✓",
            interactWord: "leap",
            interactDefinition: "to spring up off the ground",
            interactOptions: ["jump", "run", "skip", "climb", "bounce"],
            interactCorrectAnswer: "jump",
            interactExplanation: "'Leap' and 'jump' both mean to spring up off the ground. 'Skip' is a different movement — it's a light hop and step. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's another word for "${v.word}"?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**"${v.word}"** is an action word (a verb). Here's a fun way to find its synonym: **picture the action** in your head, like a little film clip. Now, which other word shows the SAME action?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} — ${v.definition}`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Which word shows the SAME action?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Picture the action",
            body: (v) => `Think about the word **"${v.word}"** — it means ${v.definition}. Now imagine someone doing the action. Does **"${v.synonym}"** show the EXACT same picture?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" = ${v.definition}`, why: "Picture this happening" },
                  { text: `"${v.synonym}" = ${v.definition}`, why: "Same picture? Same action? It's a synonym!" },
                  { text: `Swap: ${v.testSentence.replace(/\*\*/g, '')}`, why: "The meaning hasn't changed ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word shows the **same action** as **"${v.interactWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactWord} = ${v.interactDefinition}`,
                highlightWords: [{ word: v.interactWord, color: "#7C3AED" }],
                label: "Find the matching action:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is a synonym of "${v.interactWord}"?`,
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
            title: () => "Picture the action — great strategy!",
            body: () => `You've just picked up a really handy trick for action word synonyms. Keep this in your back pocket:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Picture the action in your head", why: "What does it LOOK like?" },
                  { text: "2. Which option shows the SAME picture?", why: "Same action = synonym" },
                  { text: "3. Beware of related-but-different actions", why: "damage ≠ destroy, design ≠ build ✓" }
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
  // SUB-CONCEPT 4: Context-Dependent Synonyms
  // Category: supporting
  // ==========================================
  {
    id: "context-dependent",
    name: "Same Word, Different Synonyms",
    category: "supporting",
    lessons: [
      {
        id: "context-dependent-steps",
        templateType: "curiosity-hook",
        learningGoal: [
          "Why the same word can have different synonyms depending on the sentence — this is what makes English so interesting!",
          "How to use context to pick the right synonym every time"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "noticed the same word used two ways",
            targetWord: "light",
            sentenceA: "The room was filled with light.",
            synonymA: "brightness",
            sentenceB: "The bag felt very light.",
            synonymB: "lightweight",
            testSentence: "The bag felt very **light** → The bag felt very **lightweight**",
            options: ["lightweight", "bright", "pale", "gentle", "thin"],
            correctAnswer: "lightweight",
            explanation: "In this sentence, 'light' means not heavy — so 'lightweight' is the synonym. If it meant shining, the synonym would be 'bright'. ✓",
            interactTargetWord: "right",
            interactSentence: "That is the right answer.",
            interactOptions: ["correct", "proper", "good", "straight", "exact"],
            interactCorrectAnswer: "correct",
            interactExplanation: "Here 'right' means not wrong — so 'correct' is the synonym. If it meant a direction, the synonym would be different. ✓"
          },
          {
            name: "Hamza",
            scenario: "found the same word meaning different things",
            targetWord: "fair",
            sentenceA: "The teacher was very fair.",
            synonymA: "just",
            sentenceB: "She had fair hair.",
            synonymB: "blonde",
            testSentence: "She had **fair** hair → She had **blonde** hair",
            options: ["blonde", "just", "honest", "beautiful", "thin"],
            correctAnswer: "blonde",
            explanation: "Here 'fair' describes hair colour (light/pale), so 'blonde' is the synonym. If it meant treating people equally, 'just' would be right. ✓",
            interactTargetWord: "row",
            interactSentence: "The children stood in a row.",
            interactOptions: ["line", "queue", "crowd", "group", "circle"],
            interactCorrectAnswer: "line",
            interactExplanation: "Here 'row' means a line of things side by side — so 'line' is the synonym. If it meant an argument, the synonym would be 'quarrel'. ✓"
          },
          {
            name: "Zara",
            scenario: "puzzling over a word with two meanings",
            targetWord: "match",
            sentenceA: "He lit the match to start the fire.",
            synonymA: "flame-stick",
            sentenceB: "The football match was exciting.",
            synonymB: "game",
            testSentence: "The football **match** was exciting → The football **game** was exciting",
            options: ["game", "fire", "pair", "contest", "team"],
            correctAnswer: "game",
            explanation: "Here 'match' means a sporting event, so 'game' is the synonym. It's not about lighting fires! ✓",
            interactTargetWord: "bat",
            interactSentence: "He picked up the cricket bat.",
            interactOptions: ["stick", "ball", "paddle", "racket", "club"],
            interactCorrectAnswer: "club",
            interactExplanation: "Here 'bat' means a piece of sports equipment for hitting — so 'club' is the closest synonym. It's not the flying animal! ✓"
          },
          {
            name: "Theo",
            scenario: "discovering a word that changes meaning",
            targetWord: "sharp",
            sentenceA: "Be careful — that knife is sharp.",
            synonymA: "keen",
            sentenceB: "She is a very sharp student.",
            synonymB: "clever",
            testSentence: "She is a very **sharp** student → She is a very **clever** student",
            options: ["clever", "keen", "pointed", "quick", "tidy"],
            correctAnswer: "clever",
            explanation: "Here 'sharp' describes intelligence, so 'clever' is the synonym. If it described a blade, 'keen' would be right. ✓",
            interactTargetWord: "cool",
            interactSentence: "The weather turned cool in the evening.",
            interactOptions: ["chilly", "calm", "nice", "fresh", "breezy"],
            interactCorrectAnswer: "chilly",
            interactExplanation: "Here 'cool' describes the temperature — so 'chilly' is the synonym. If it meant trendy or stylish, the answer would be different. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Two meanings of "${v.targetWord}"`,
            body: (v) => `${v.name} ${v.scenario}.\n\nDid you know that one little word can mean totally different things depending on how it's used? Check this out — **"${v.targetWord}"** has TWO meanings:\n• "${v.sentenceA}"\n• "${v.sentenceB}"\n\nThe synonym you pick depends on which meaning is being used!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Meaning 1: "${v.sentenceA}" → synonym: ${v.synonymA}` },
                  { text: `Meaning 2: "${v.sentenceB}" → synonym: ${v.synonymB}` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Read the sentence first!",
            body: (v) => `The word **"${v.targetWord}"** has more than one meaning! Always read the **whole sentence** before picking a synonym — the same word can need completely different synonyms depending on context.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.targetWord}" in sentence: "${v.sentenceB}"`, why: "Which meaning is being used here?" },
                  { text: `Test: ${v.testSentence.replace(/\*\*/g, '')}`, why: "Does this swap keep the meaning?" },
                  { text: `"${v.synonymB}" is the right synonym for THIS sentence ✓`, why: "Context decides the synonym" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Read the whole sentence carefully`,
                `Decide which meaning of "${v.targetWord}" fits`,
                `Pick the synonym for THAT meaning: "${v.synonymB}"`
              ],
              feedback: {
                correct: (v) => `Spot on! Always read the sentence first to find the right meaning. ✓`,
                incorrect: (v) => `Not quite — read the sentence first, then work out which meaning is being used.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `In the sentence **"${v.interactSentence}"**, which word is a synonym of **"${v.interactTargetWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactSentence,
                highlightWords: [{ word: v.interactTargetWord, color: "#7C3AED" }],
                label: "Find the synonym in context:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `In "${v.interactSentence}", which is a synonym of "${v.interactTargetWord}"?`,
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
            title: () => "Context is king!",
            body: () => `Brilliant work! You've spotted something really cool about English — the same word can need different synonyms. Here's how to handle it every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read the WHOLE sentence first", why: "The sentence tells you which meaning is being used" },
                  { text: "2. Decide which meaning fits this context", why: "Light = not heavy? Or light = brightness?" },
                  { text: "3. Pick the synonym for THAT meaning", why: "Different meanings need different synonyms ✓" }
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
  // SUB-CONCEPT 5: Emotion & Feeling Synonyms
  // Category: supporting
  // ==========================================
  {
    id: "emotion-synonyms",
    name: "Feelings & Emotions",
    category: "supporting",
    lessons: [
      {
        id: "emotion-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to match emotion words at the same strength level — think of emotions like a volume dial!",
          "How to tell the difference between similar emotions (angry vs annoyed vs furious) — this is trickier than it sounds!"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "matching emotion words",
            word: "scared",
            synonym: "frightened",
            intensity: "medium",
            weaker: "nervous",
            stronger: "terrified",
            options: ["frightened", "terrified", "nervous", "shocked", "worried"],
            correctAnswer: "frightened",
            explanation: "'Scared' and 'frightened' are both medium-level fear. 'Terrified' is too strong, 'nervous' is too mild. ✓",
            interactWord: "angry",
            interactOptions: ["cross", "furious", "raging", "upset", "grumpy"],
            interactCorrectAnswer: "cross",
            interactExplanation: "'Angry' and 'cross' are both at the same moderate level. 'Furious' means extremely angry — too strong to be a synonym. ✓"
          },
          {
            name: "Jack",
            scenario: "finding the right emotion match",
            word: "cross",
            synonym: "annoyed",
            intensity: "mild",
            weaker: "bothered",
            stronger: "furious",
            options: ["annoyed", "furious", "raging", "upset", "bitter"],
            correctAnswer: "annoyed",
            explanation: "'Cross' and 'annoyed' are both mild anger. 'Furious' is way too strong. ✓",
            interactWord: "glad",
            interactOptions: ["pleased", "ecstatic", "thrilled", "grateful", "cheerful"],
            interactCorrectAnswer: "pleased",
            interactExplanation: "'Glad' and 'pleased' are both mild happiness. 'Ecstatic' means overwhelmingly happy — far too strong. ✓"
          },
          {
            name: "Ruby",
            scenario: "pairing up feeling words",
            word: "joyful",
            synonym: "delighted",
            intensity: "strong",
            weaker: "pleased",
            stronger: "ecstatic",
            options: ["delighted", "pleased", "ecstatic", "content", "relieved"],
            correctAnswer: "delighted",
            explanation: "'Joyful' and 'delighted' are both strong happiness. 'Pleased' is milder, 'ecstatic' is extreme. ✓",
            interactWord: "worried",
            interactOptions: ["anxious", "terrified", "panicked", "confused", "shy"],
            interactCorrectAnswer: "anxious",
            interactExplanation: "'Worried' and 'anxious' are both at the same moderate level of concern. 'Terrified' is far too extreme. ✓"
          },
          {
            name: "Sam",
            scenario: "finding emotion synonyms",
            word: "miserable",
            synonym: "wretched",
            intensity: "strong",
            weaker: "sad",
            stronger: "devastated",
            options: ["wretched", "sad", "devastated", "gloomy", "bored"],
            correctAnswer: "wretched",
            explanation: "'Miserable' and 'wretched' are both strongly unhappy. 'Sad' is milder, 'devastated' is extreme. ✓",
            interactWord: "cheerful",
            interactOptions: ["jolly", "ecstatic", "calm", "excited", "kind"],
            interactCorrectAnswer: "jolly",
            interactExplanation: "'Cheerful' and 'jolly' are both at the same happy, upbeat level. 'Ecstatic' means overwhelmingly happy — far too strong. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `How "${v.word}" are you?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDid you know emotion words come in different **strength levels**, almost like turning up a volume dial?\n• Mild: "${v.weaker}"\n• Medium/Strong: **"${v.word}"**\n• Extreme: "${v.stronger}"\n\nTo find the synonym, you need one at the **same level** on the dial!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Mild: "${v.weaker}"` },
                  { text: `Match: "${v.word}" = "${v.synonym}" (${v.intensity})` },
                  { text: `Extreme: "${v.stronger}"` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Match the strength",
            body: (v) => `The word **"${v.word}"** is a ${v.intensity}-level emotion. Its synonym must be at the **same strength** — think of it like a volume dial:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Low: "${v.weaker}" — too mild`, why: "This is weaker than our word" },
                  { text: `Match: "${v.word}" ↔ "${v.synonym}" ✓`, why: "Same strength level!" },
                  { text: `High: "${v.stronger}" — too extreme`, why: "This is stronger than our word" }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "scared", right: "frightened" },
                { left: "cross", right: "annoyed" },
                { left: "joyful", right: "delighted" },
                { left: "miserable", right: "wretched" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word matches the **same strength** as **"${v.interactWord}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactWord} — find the same-strength match`,
                highlightWords: [{ word: v.interactWord, color: "#7C3AED" }],
                label: "Match the intensity level:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the closest synonym of "${v.interactWord}"?`,
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
            title: () => "Emotion synonym scale — nice one!",
            body: () => `You've cracked it! Emotions come in levels, just like volume on a speaker. Match the level and you've got your synonym:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "nervous → scared → terrified", why: "Fear: mild → medium → extreme" },
                  { text: "annoyed → angry → furious", why: "Anger: mild → medium → extreme" },
                  { text: "pleased → joyful → ecstatic", why: "Happiness: mild → strong → extreme ✓" }
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
  // SUB-CONCEPT 6: Abstract Concept Synonyms
  // Category: supporting
  // ==========================================
  {
    id: "abstract-synonyms",
    name: "Big Ideas — Abstract Synonyms",
    category: "supporting",
    lessons: [
      {
        id: "abstract-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find synonyms for abstract concepts (ideas you can't touch) — these words describe the big ideas in life!",
          "Why defining the concept in your own words first is the key to matching"
        ],
        variableSets: [
          {
            name: "Maisie",
            scenario: "matching big idea words",
            word: "courage",
            synonym: "bravery",
            definition: "the quality of being brave when facing danger",
            options: ["bravery", "strength", "power", "confidence", "pride"],
            correctAnswer: "bravery",
            explanation: "'Courage' and 'bravery' both mean facing danger without giving in to fear. 'Strength' is physical, not emotional. ✓",
            interactWord: "joy",
            interactDefinition: "a feeling of great happiness",
            interactOptions: ["delight", "fun", "luck", "comfort", "peace"],
            interactCorrectAnswer: "delight",
            interactExplanation: "'Joy' and 'delight' both mean a feeling of great happiness. 'Fun' means enjoyment from an activity, which is different. ✓"
          },
          {
            name: "Ben",
            scenario: "finding matches for concept words",
            word: "liberty",
            synonym: "freedom",
            definition: "the state of being free to do what you want",
            options: ["freedom", "safety", "peace", "power", "choice"],
            correctAnswer: "freedom",
            explanation: "'Liberty' and 'freedom' both mean being free. 'Choice' is related but means something different. ✓",
            interactWord: "wealth",
            interactDefinition: "having a large amount of money or possessions",
            interactOptions: ["riches", "success", "luxury", "treasure", "profit"],
            interactCorrectAnswer: "riches",
            interactExplanation: "'Wealth' and 'riches' both mean having a large amount of money. 'Luxury' means expensive comfort, which is different. ✓"
          },
          {
            name: "Olivia",
            scenario: "pairing up abstract words",
            word: "grief",
            synonym: "sorrow",
            definition: "deep sadness, especially after a loss",
            options: ["sorrow", "pain", "anger", "loneliness", "despair"],
            correctAnswer: "sorrow",
            explanation: "'Grief' and 'sorrow' both mean deep sadness. 'Despair' means losing all hope, which is different. ✓",
            interactWord: "anger",
            interactDefinition: "a strong feeling of displeasure",
            interactOptions: ["fury", "hatred", "jealousy", "spite", "rage"],
            interactCorrectAnswer: "fury",
            interactExplanation: "'Anger' and 'fury' both describe a strong feeling of displeasure. 'Hatred' means intense dislike of someone, which is a different emotion. ✓"
          },
          {
            name: "Hamza",
            scenario: "matching abstract idea words",
            word: "peril",
            synonym: "danger",
            definition: "serious risk of harm or death",
            options: ["danger", "fear", "trouble", "pain", "chaos"],
            correctAnswer: "danger",
            explanation: "'Peril' and 'danger' both mean serious risk of harm. 'Fear' is the FEELING of danger, not the danger itself. ✓",
            interactWord: "wisdom",
            interactDefinition: "the quality of having good judgement and knowledge",
            interactOptions: ["knowledge", "cleverness", "talent", "memory", "skill"],
            interactCorrectAnswer: "knowledge",
            interactExplanation: "'Wisdom' and 'knowledge' both relate to understanding and knowing things deeply. 'Talent' means a natural ability, which is different. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does "${v.word}" mean?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nSome words describe **big ideas** you can't see or touch — things like courage, freedom, and grief. These are called **abstract** words, and they sound trickier than they actually are.\n\nThe trick? **Say what it means in your own words first**, then look for the match.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} — ${v.definition}`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Find the matching synonym"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Define first, then match",
            body: (v) => `**"${v.word}"** means ${v.definition} — it's an abstract word (an idea you can't see or touch). Abstract words can feel tricky, but if you can **explain what they mean**, you can find the match.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" means: ${v.definition}`, why: "Define it in your own words" },
                  { text: `"${v.synonym}" means: ${v.definition}`, why: "Same definition? It's a synonym!" },
                  { text: `Other options are RELATED but not the same`, why: "Fear relates to danger but isn't the same thing" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word is a synonym of **"${v.interactWord}"**?\n\n"${v.interactWord}" means: ${v.interactDefinition}`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactWord} = ${v.interactDefinition}`,
                highlightWords: [{ word: v.interactWord, color: "#7C3AED" }],
                label: "Find the synonym:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is a synonym of "${v.interactWord}"?`,
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
            title: () => "Abstract synonyms — you've got the recipe!",
            body: () => `Great work tackling those big ideas! You've shown that abstract words aren't as scary as they look. Here's your recipe to use any time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Explain what the word means", why: "Can you describe the idea?" },
                  { text: "2. Find the option with the SAME definition", why: "Same idea = synonym" },
                  { text: "3. Beware of RELATED concepts", why: "Danger ≠ fear, freedom ≠ choice ✓" }
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
  // SUB-CONCEPT 7: Hard Vocabulary Pairs
  // Category: other
  // ==========================================
  {
    id: "hard-vocabulary",
    name: "Tricky Vocabulary Pairs",
    category: "other",
    lessons: [
      {
        id: "hard-vocabulary-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise harder synonym pairs that appear in the 11+ — these are the ones that earn top marks!",
          "How to use elimination when you're not sure of a word (this strategy is a lifesaver)"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "tackling harder synonym pairs",
            word: "diligent",
            synonym: "industrious",
            definition: "working hard and carefully",
            hint: "Both words describe someone who puts in lots of effort",
            options: ["industrious", "intelligent", "patient", "obedient", "talented"],
            correctAnswer: "industrious",
            explanation: "'Diligent' and 'industrious' both mean hardworking and careful. 'Intelligent' means clever, which is different. ✓"
          },
          {
            name: "Marcus",
            scenario: "working on advanced synonym pairs",
            word: "affluent",
            synonym: "wealthy",
            definition: "having a lot of money",
            hint: "Think about what describes someone who is rich",
            options: ["wealthy", "famous", "powerful", "successful", "generous"],
            correctAnswer: "wealthy",
            explanation: "'Affluent' and 'wealthy' both mean having a lot of money. 'Successful' means doing well, but not necessarily rich. ✓"
          },
          {
            name: "Aisha",
            scenario: "decoding difficult words",
            word: "meticulous",
            synonym: "thorough",
            definition: "paying great attention to every detail",
            hint: "Someone who checks everything very carefully",
            options: ["thorough", "clever", "tidy", "strict", "careful"],
            correctAnswer: "thorough",
            explanation: "'Meticulous' and 'thorough' both mean paying great attention to detail. 'Careful' is close but more general. ✓"
          },
          {
            name: "Charlie",
            scenario: "handling the toughest synonym pairs",
            word: "benevolent",
            synonym: "kind",
            definition: "well-meaning and wanting to help others",
            hint: "Think 'good-hearted' — someone who wants to do good",
            options: ["kind", "honest", "gentle", "polite", "loyal"],
            correctAnswer: "kind",
            explanation: "'Benevolent' means well-meaning and kind. 'Gentle' describes manner, not intention. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What on earth does "${v.word}" mean?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\nDon't worry if **"${v.word}"** looks like a word from another planet! Loads of 11+ words look harder than they are. Here's a clue: ${v.hint}\n\nCan you figure out which option matches? Give it a go!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} — can you work out what this means?`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Find the synonym"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use elimination!",
            body: (v) => `**"${v.word}"** means ${v.definition}. When you see a hard word, **cross out options you KNOW are wrong** — this narrows it down fast.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" means: ${v.definition}`, why: "If you know it, great! If not, use the hint" },
                  { text: `Eliminate options that clearly don't fit`, why: "Cross out words that mean something completely different" },
                  { text: `"${v.synonym}" is the match ✓`, why: `Both mean: ${v.definition}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.word}" means ${v.definition}`, answer: true, explanation: `Correct — "${v.word}" means ${v.definition}. ✓` },
                { text: `"${v.synonym}" means something different from "${v.word}"`, answer: false, explanation: `No — "${v.synonym}" means exactly the same: ${v.definition}.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Which word means the same as **"${v.word}"**?\n\nHint: ${v.hint}`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.word} = ${v.definition}`,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Find the synonym:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is a synonym of "${v.word}"?`,
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
            title: () => "Hard words — don't panic, you've got this!",
            body: () => `Remember: even the trickiest words usually have a simple synonym hiding in the options:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Don't panic — hard words often have simple synonyms", why: "benevolent = kind, affluent = wealthy" },
                  { text: "2. Eliminate what you KNOW is wrong", why: "Cross out options that clearly don't fit" },
                  { text: "3. Of what's left, pick the closest meaning", why: "Trust your instinct — you know more than you think! ✓" }
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
  // SUB-CONCEPT 8: Adjective Synonyms
  // Category: other
  // ==========================================
  {
    id: "adjective-synonyms",
    name: "Describing Word Synonyms",
    category: "other",
    lessons: [
      {
        id: "adjective-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find synonyms for describing words (adjectives) — what quality is being described?",
          "Why checking what is being described helps find the match every time"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "matching describing words",
            word: "enormous",
            synonym: "huge",
            thingDescribed: "a building",
            sentence: "The enormous building towered over the town.",
            options: ["huge", "tall", "wide", "grand", "impressive"],
            correctAnswer: "huge",
            explanation: "'Enormous' and 'huge' both mean very big. 'Tall' only describes height, not overall size. ✓"
          },
          {
            name: "Oliver",
            scenario: "finding adjective matches",
            word: "filthy",
            synonym: "dirty",
            thingDescribed: "a shirt",
            sentence: "His filthy shirt needed a good wash.",
            options: ["dirty", "worn", "stained", "crumpled", "torn"],
            correctAnswer: "dirty",
            explanation: "'Filthy' and 'dirty' both mean covered in dirt/grime. 'Stained' means marked, not necessarily dirty all over. ✓"
          },
          {
            name: "Priya",
            scenario: "pairing up describing words",
            word: "ancient",
            synonym: "old",
            thingDescribed: "a castle",
            sentence: "The ancient castle stood on the hill.",
            options: ["old", "ruined", "stone", "famous", "dark"],
            correctAnswer: "old",
            explanation: "'Ancient' and 'old' both describe something from a long time ago. 'Ruined' describes its condition, not its age. ✓"
          },
          {
            name: "Finn",
            scenario: "matching adjective synonyms",
            word: "rapid",
            synonym: "swift",
            thingDescribed: "a river",
            sentence: "The rapid river flowed through the valley.",
            options: ["swift", "deep", "wide", "rough", "long"],
            correctAnswer: "swift",
            explanation: "'Rapid' and 'swift' both mean moving very quickly. 'Rough' describes the water's surface, not its speed. ✓"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What does "${v.word}" describe?`,
            body: (v) => `${v.name} is ${v.scenario}.\n\n**"${v.sentence}"**\n\nHere's a neat question: what **quality** is **"${v.word}"** actually describing about ${v.thingDescribed}? Figure that out, and the synonym practically jumps out at you!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Which word means the same?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Same quality, different word",
            body: (v) => `**"${v.word}"** describes the ${v.thingDescribed}'s quality. A describing-word synonym must describe the **same quality** — size with size, speed with speed, age with age.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `"${v.word}" describes a quality of ${v.thingDescribed}`, why: "What feature is being highlighted?" },
                  { text: `"${v.synonym}" describes the SAME quality`, why: "Both words point to the same feature" },
                  { text: `Other options describe DIFFERENT qualities`, why: "Size ≠ height, age ≠ condition ✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `**"${v.sentence}"**\n\nWhich word means the same as **"${v.word}"**?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.sentence,
                highlightWords: [{ word: v.word, color: "#7C3AED" }],
                label: "Find the synonym in context:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is a synonym of "${v.word}"?`,
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
            title: () => "Describing word synonyms — brilliant!",
            body: () => `You're getting really good at this! For describing word synonyms, keep these steps handy:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. What quality is the word describing?", why: "Size? Speed? Age? Temperature?" },
                  { text: "2. Find the option that describes the SAME quality", why: "Both words must point to the same feature" },
                  { text: "3. Reject words that describe different features", why: "Big ≠ tall, old ≠ ruined, fast ≠ rough ✓" }
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
  // SUB-CONCEPT: polyseme-synonyms
  // Category: core
  // ==========================================
  {
    id: "polyseme-synonyms",
    name: "One Word, Two Meanings",
    category: "core",
    lessons: [
      {
        id: "polyseme-synonyms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a word that fits TWO meaning groups at once — like a word that's leading a double life!",
          "Why some everyday words have completely different meanings — and how to spot them when the 11+ tries to catch you out"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "working through a tricky VR practice paper",
            setA: ["role", "character"],
            setB: ["separate", "divide"],
            answer: "part",
            answerMeaningA: "a 'part' in a play means a role or character",
            answerMeaningB: "to 'part' the curtains means to separate or divide them",
            decoyOption: "piece",
            decoyReason: "'Piece' is close to 'separate' — like a piece broken off — but a piece isn't a role you'd play on stage",
            options: ["part", "play", "piece", "split", "section"],
            correctAnswer: "part",
            explanation: "'Part' is the shape-shifter here! In a play, you 'play a part' (a role or character). And in the garden, you might 'part the leaves' (separate or divide them). One word, two meanings — that's a polyseme!"
          },
          {
            name: "Jake",
            scenario: "spotting double-meaning words in his 11+ revision",
            setA: ["earth", "soil"],
            setB: ["reason", "sense"],
            answer: "ground",
            answerMeaningA: "the 'ground' under your feet is earth or soil",
            answerMeaningB: "the 'grounds' for a decision are reasons or sensible motives",
            decoyOption: "dirt",
            decoyReason: "'Dirt' matches earth and soil perfectly, but dirt has nothing to do with reasons — it only fits ONE group",
            options: ["ground", "dirt", "land", "cause", "basis"],
            correctAnswer: "ground",
            explanation: "'Ground' is the secret double agent! It means earth or soil (the 'ground' is wet today). It also means reasons or sense ('the grounds for the argument'). Both meanings come together in this one word!"
          },
          {
            name: "Priya",
            scenario: "tackling a polyseme question in her mock test",
            setA: ["healthy", "in good shape"],
            setB: ["deep water hole", "shaft"],
            answer: "well",
            answerMeaningA: "feeling 'well' means healthy and in good shape",
            answerMeaningB: "a 'well' is a deep shaft dug into the ground for water",
            decoyOption: "fit",
            decoyReason: "'Fit' fits healthy beautifully — but a 'fit' is NOT a deep water hole. It only matches one side of the question",
            options: ["well", "fit", "spring", "fine", "pit"],
            correctAnswer: "well",
            explanation: "'Well' has two completely different jobs! It describes being healthy ('I feel well today'). It's also a deep shaft dug for water ('the village well'). Same word, totally different meanings — that's polysemy at work!"
          },
          {
            name: "Marcus",
            scenario: "training his eye for hidden word meanings",
            setA: ["chilly", "frosty"],
            setB: ["sniffles", "illness"],
            answer: "cold",
            answerMeaningA: "'cold' weather feels chilly and frosty",
            answerMeaningB: "catching 'a cold' is a common illness with sniffles",
            decoyOption: "freezing",
            decoyReason: "'Freezing' nails chilly and frosty — but you don't 'catch the freezings' when you have sniffles. It misses the second meaning",
            options: ["cold", "freezing", "flu", "icy", "bug"],
            correctAnswer: "cold",
            explanation: "'Cold' is a brilliant double-meaning word! It describes the temperature ('a cold morning'). And it's also that annoying winter illness ('I've caught a cold'). Same word — two totally separate jobs!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can ONE word fit BOTH of these meanings?`,
            body: (v) => `${v.name} is ${v.scenario}. Look at these two groups of words:\n\n**Group 1:** ${v.setA[0]}, ${v.setA[1]}\n**Group 2:** ${v.setB[0]}, ${v.setB[1]}\n\nThe challenge? Find ONE word that fits both groups at the same time. Sounds impossible — but English is sneakier than you think! Some words are like shape-shifters with completely different meanings.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Group 1: ${v.setA[0]}, ${v.setA[1]}`, why: "What do these two words have in common?" },
                  { text: `Group 2: ${v.setB[0]}, ${v.setB[1]}`, why: "What do these two mean? Completely different!" },
                  { text: `Find ONE word that fits BOTH groups`, why: "This word has two different jobs — a shape-shifter!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The Bridge Method",
            body: (v) => `Here's the brilliant trick! A word that fits BOTH groups is called a **polyseme** — that's just a fancy word for "one word, many meanings". The answer is **"${v.answer}"** — and watch how it builds a bridge between the two groups!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Group 1 means: ${v.setA[0]} / ${v.setA[1]}`, why: `Try "${v.answer}" — yes! ${v.answerMeaningA}` },
                  { text: `Group 2 means: ${v.setB[0]} / ${v.setB[1]}`, why: `Try "${v.answer}" again — yes! ${v.answerMeaningB}` },
                  { text: `Watch out for "${v.decoyOption}"!`, why: v.decoyReason }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — find the polyseme!",
            body: (v) => `Which ONE word fits **both** groups below?\n\n**Group 1:** ${v.setA[0]}, ${v.setA[1]}\n**Group 2:** ${v.setB[0]}, ${v.setB[1]}\n\nRemember: it has to work for BOTH groups, not just one!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Group 1: ${v.setA[0]}, ${v.setA[1]}`, why: "One meaning of the answer" },
                  { text: `Group 2: ${v.setB[0]}, ${v.setB[1]}`, why: "A completely different meaning of the SAME word" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which word fits both meaning groups?`,
              getOptions: (v) => v.options,
              correctAnswer: (v) => v.correctAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.explanation} ✓`,
                incorrect: (v) => `Not quite! The answer is "${v.correctAnswer}". ${v.explanation} ✓`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The Polyseme Recipe — you've got it!",
            body: () => `Fantastic work! Polyseme questions look scary, but with this three-step recipe you'll crack them every time:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. Read both meaning groups carefully", why: "What does Group 1 mean? What does Group 2 mean? They'll be totally different topics." },
                  { text: "2. Try each option in BOTH groups", why: "Does it fit Group 1? Does it ALSO fit Group 2? Only a true polyseme fits both." },
                  { text: "3. Reject the one-group decoys", why: "Most distractors fit only one group — they're traps. The right answer always builds a bridge ✓" }
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

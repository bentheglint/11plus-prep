// This file contains the PLAYBOOK-compliant replacement text for the 3 new grammar sub-concepts
// Used by the merge script to replace the non-compliant versions
module.exports = `
  // ==========================================
  // SUB-CONCEPT: Standard English
  // Category: core — 2 lessons (step-by-step + spot-the-mistake)
  // PLAYBOOK compliant: child-friendly language, no unexplained technical terms,
  // visuals on every screen, 4+3 variable sets
  // ==========================================
  {
    id: "standard-english",
    name: "Standard English — Getting It Right in Writing",
    category: "core",
    lessons: [
      {
        id: "standard-english-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot things we say every day that are actually wrong in writing",
          "How to fix the most common writing mistakes so your English sounds polished"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is checking her story for mistakes her teacher always marks",
            wrong1: "I done my homework before tea.",
            right1: "I did my homework before tea.",
            tip1: "'Done' always needs a helper word before it (like 'has done' or 'had done'). On its own, say **'did'**.",
            wrong2: "We was going to the park.",
            right2: "We were going to the park.",
            tip2: "'Was' is for one person (I was, he was). 'Were' is for more than one (we were, they were).",
            intQuestion: "Choose the correct word: 'She ___ her best in the race.'",
            intOptions: ["done", "did", "does", "doing", "has do"],
            intCorrect: "did",
            intExplanation: "'She did' is correct. Remember: 'done' needs a helper word — you can say 'she has done' but never 'she done' on its own."
          },
          {
            name: "Oliver",
            scenario: "keeps writing 'should of' and his teacher has circled it again",
            wrong1: "I should of brought my umbrella.",
            right1: "I should have brought my umbrella.",
            tip1: "'Should of' is ALWAYS wrong! It sounds like 'should've' when we say it quickly, but the short form is 'should **have**', not 'should of'.",
            wrong2: "We could of left earlier.",
            right2: "We could have left earlier.",
            tip2: "Same rule for 'could of', 'would of', and 'might of' — they're all wrong. Always write **'have'**.",
            intQuestion: "Choose the correct word: 'You should ___ told me about the change.'",
            intOptions: ["of", "have", "had", "been", "has"],
            intCorrect: "have",
            intExplanation: "'Should have' is correct. It sounds like 'should of' when spoken fast, but 'of' is never right here."
          },
          {
            name: "Priya",
            scenario: "is confused about when to use 'I' and when to use 'me'",
            wrong1: "Me and my friend went to the cinema.",
            right1: "My friend and I went to the cinema.",
            tip1: "When you're the one **doing** something, use 'I'. Try removing the other person: 'I went to the cinema' sounds right, 'me went to the cinema' doesn't!",
            wrong2: "The teacher told my brother and I to stay behind.",
            right2: "The teacher told my brother and me to stay behind.",
            tip2: "When something is being done **to you**, use 'me'. Try removing the other person: 'told me' sounds right, 'told I' doesn't!",
            intQuestion: "Choose the correct word: 'Between you and ___, I think the test was easy.'",
            intOptions: ["I", "me", "myself", "we", "mine"],
            intCorrect: "me",
            intExplanation: "'Between you and me' is correct. After words like 'between', 'for', 'to', and 'with', always use 'me' not 'I'."
          },
          {
            name: "Jake",
            scenario: "is learning to spot 'seen' and 'done' mistakes in his writing",
            wrong1: "I seen him at the shops yesterday.",
            right1: "I saw him at the shops yesterday.",
            tip1: "'Seen' needs a helper word (like 'I have seen'). On its own, the past of 'see' is **'saw'**.",
            wrong2: "She don't like broccoli.",
            right2: "She doesn't like broccoli.",
            tip2: "With 'he', 'she', or 'it', use **'doesn't'** not 'don't'. Save 'don't' for 'I', 'you', 'we', and 'they'.",
            intQuestion: "Choose the correct word: 'He ___ want to come to the party.'",
            intOptions: ["don't", "doesn't", "hasn't", "weren't", "isn't"],
            intCorrect: "doesn't",
            intExplanation: "'He doesn't' is correct. With he, she, or it, always use 'doesn't' — save 'don't' for I, you, we, and they."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s writing check",
            body: (v) => v.name + " " + v.scenario + ". Can you spot what's wrong here?\\n\\n**\\"" + v.wrong1 + "\\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.wrong1, highlightWords: [v.wrong1.split(" ")[1]] })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "What we say vs what we write",
            body: () => "Lots of things we say every day are actually **wrong** in writing. Here are the fixes:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.wrong1 + '"', why: "This sounds OK when speaking, but it's wrong in writing" },
                  { text: 'Right: "' + v.right1 + '"', why: v.tip1 },
                  { text: 'Wrong: "' + v.wrong2 + '"', why: "Another very common mistake" },
                  { text: 'Right: "' + v.right2 + '"', why: v.tip2 }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct word: ", ""), highlightWords: ["___"] })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
              incorrect: (v) => "Not quite! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "Standard English — sorted!",
            body: () => "Remember these rules when you're writing:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. 'Did' not 'done' on its own", why: "'I did it' ✓ — 'I done it' ✗" },
                  { text: "2. 'Were' not 'was' with we/they", why: "'We were' ✓ — 'We was' ✗" },
                  { text: "3. 'Have' not 'of' after should/could/would", why: "'Should have' ✓ — 'Should of' ✗" },
                  { text: "4. 'I' when doing, 'me' when it's done to you", why: "Remove the other person to check which sounds right" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "standard-english-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot common spoken English mistakes hiding in written sentences",
          "Why some things that sound perfectly normal are actually wrong in writing"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is proofreading her friend's story",
            sentence: "Me and Amira gone to the shops and we buyed some sweets.",
            mistakes: ["'Me and Amira' should be 'Amira and I'", "'gone' should be 'went'", "'buyed' should be 'bought'"],
            corrected: "Amira and I went to the shops and we bought some sweets.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["Me and Tom done our homework.", "Tom and me did our homework.", "Tom and I did our homework.", "Me and Tom did our homework.", "Tom and I done our homework."],
            intCorrect: "Tom and I did our homework.",
            intExplanation: "'Tom and I' (not 'me and Tom') because 'I' is doing the action. 'Did' (not 'done') because 'done' needs a helper word."
          },
          {
            name: "Ben",
            scenario: "is checking a letter before sending it",
            sentence: "We should of came earlier but we was stuck in traffic.",
            mistakes: ["'should of' should be 'should have'", "'came' should be 'come' (after 'have')", "'we was' should be 'we were'"],
            corrected: "We should have come earlier but we were stuck in traffic.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["I could of helped.", "I could have helped.", "I could has helped.", "I could had helped.", "I could helping."],
            intCorrect: "I could have helped.",
            intExplanation: "'Could have' is always correct. 'Could of' just sounds like 'could've' but 'of' is never right here."
          },
          {
            name: "Sophie",
            scenario: "is marking her own test answers",
            sentence: "Her and her sister don't never agree on nothing.",
            mistakes: ["'Her and her sister' should be 'She and her sister'", "'don't never' — pick one: 'don't ever' or 'never'", "'nothing' should be 'anything' (to match 'don't')"],
            corrected: "She and her sister don't ever agree on anything.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["She don't like it.", "She doesn't like it.", "She not like it.", "She do not likes it.", "She don't likes it."],
            intCorrect: "She doesn't like it.",
            intExplanation: "With 'she', always use 'doesn't' not 'don't'. 'Don't' is for I, you, we, and they."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistakes?",
            body: (v) => v.name + " " + v.scenario + ". This sentence has several things wrong — how many can you find?\\n\\n**\\"" + v.sentence + "\\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.sentence })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here are the mistakes",
            body: () => "Let's fix each one:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.mistakes.map((m, i) => ({ text: "Mistake " + (i+1) + ": " + m, why: "" })).concat([
                  { text: 'Corrected: "' + v.corrected + '"', why: "Now it's proper written English!" }
                ])
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
              incorrect: (v) => "Not quite! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "You're a proofreading pro!",
            body: () => "When checking writing, watch out for these sneaky mistakes:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "'Me and...' at the start", why: "Change to '... and I' (remove the other person to check)" },
                  { text: "'Done', 'seen', 'gone' without a helper word", why: "Should be 'did', 'saw', 'went' on their own" },
                  { text: "'Should of', 'could of', 'would of'", why: "Always 'should have', 'could have', 'would have'" },
                  { text: "'Don't' with he/she/it", why: "Should be 'doesn't'" }
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
  // SUB-CONCEPT: Advanced Subject-Verb Agreement
  // Category: core — 2 lessons (step-by-step + spot-the-mistake)
  // ==========================================
  {
    id: "advanced-sva",
    name: "Tricky Subject-Verb Agreement",
    category: "core",
    lessons: [
      {
        id: "advanced-sva-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to choose the right verb when sneaky words try to trick you",
          "Why 'neither...nor' and 'a number of' follow special rules"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "keeps getting tripped up by sentences with extra words in the middle",
            wrong: "The basket of oranges are on the table.",
            right: "The basket of oranges is on the table.",
            tip: "Cross out 'of oranges' in your head. What's left? 'The basket ___ on the table.' Basket is one thing, so it's **'is'**.",
            rule: "Ignore the 'of...' part — find the real subject",
            intQuestion: "Choose the correct word: 'The packet of crisps ___ already been opened.'",
            intOptions: ["have", "are", "has", "were", "is"],
            intCorrect: "has",
            intExplanation: "The subject is 'packet' (one thing), not 'crisps'. Cross out 'of crisps' — 'the packet has been opened'."
          },
          {
            name: "Jake",
            scenario: "is learning about 'neither...nor' — one of the trickiest grammar patterns",
            wrong: "Neither the captain nor the players was happy.",
            right: "Neither the captain nor the players were happy.",
            tip: "With 'neither...nor', the verb matches whichever word is **closest** to it. 'Players' is closest and it means more than one, so use **'were'**.",
            rule: "Neither...nor and either...or: the verb matches the nearest word",
            intQuestion: "Choose the correct word: 'Either the twins or their older sister ___ responsible.'",
            intOptions: ["are", "were", "is", "have", "do"],
            intCorrect: "is",
            intExplanation: "'Sister' is the nearest word to the verb, and sister is one person, so it's 'is'."
          },
          {
            name: "Amira",
            scenario: "is learning a really useful trick about 'the number of' vs 'a number of'",
            wrong: "A number of children is absent today.",
            right: "A number of children are absent today.",
            tip: "'A number of' just means 'several' or 'many', so use a verb for more than one: **'are'**.",
            rule: "THE number of = one thing. A number of = many things.",
            intQuestion: "Choose the correct word: 'The number of pupils arriving by bus ___ increased.'",
            intOptions: ["have", "are", "has", "were", "do"],
            intCorrect: "has",
            intExplanation: "'THE number of' talks about the number itself — one number — so it's 'has increased'."
          },
          {
            name: "Oscar",
            scenario: "is figuring out when groups (like 'the team' or 'the jury') are one thing or many",
            wrong: "The jury is unable to agree.",
            right: "The jury were unable to agree.",
            tip: "The jury members can't agree — they're all thinking different things! When a group is split, use a verb for more than one: **'were'**.",
            rule: "Group words: 'is' when acting as one, 'are/were' when acting separately",
            intQuestion: "Choose the correct word: 'The team ___ celebrating after their victory.'",
            intOptions: ["is", "was", "are", "has", "does"],
            intCorrect: "are",
            intExplanation: "The team members are each celebrating — so use 'are'. The word 'their' also tells you it's more than one."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s grammar puzzle",
            body: (v) => v.name + " " + v.scenario + ".\\n\\nWhich is correct?\\n\\n**\\"" + v.wrong + "\\"** or **\\"" + v.right + "\\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.wrong })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The trick to getting it right",
            body: (v) => v.rule,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.wrong + '"', why: "This is wrong because..." },
                  { text: 'Right: "' + v.right + '"', why: v.tip },
                  { text: "The rule: " + v.rule, why: "Remember this for the exam!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct word: ", ""), highlightWords: ["___"] })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Well done! " + v.intExplanation + " ✓",
              incorrect: (v) => "Not quite! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "Tricky agreement — mastered!",
            body: () => "Three sneaky patterns to watch for:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. 'Of...' phrases: cross them out!", why: "'The basket of oranges IS...' — basket is the real subject" },
                  { text: "2. Neither/nor: match the NEAREST word", why: "'Neither the captain nor the players WERE...'" },
                  { text: "3. Group words: one unit = 'is', acting separately = 'are'", why: "'The team IS winning' but 'The jury WERE unable to agree'" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "advanced-sva-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when a sentence has the wrong verb because of a tricky subject"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is proofreading sentences",
            sentence: "One of my friends are moving to a new school next term.",
            mistake: "'Are' should be 'is' — the subject is 'one' (one friend), not 'friends'.",
            corrected: "One of my friends is moving to a new school next term.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["The box of chocolates were lovely.", "The box of chocolates was lovely.", "The box of chocolates are lovely.", "The box of chocolates have been lovely.", "The box of chocolates be lovely."],
            intCorrect: "The box of chocolates was lovely.",
            intExplanation: "The subject is 'box' (one thing). Cross out 'of chocolates' and it's clear: 'the box was lovely'."
          },
          {
            name: "Oliver",
            scenario: "found a mistake in a news article",
            sentence: "A number of pupils has been absent this week due to illness.",
            mistake: "'Has' should be 'have' — 'a number of' means 'several' so it needs a verb for more than one.",
            corrected: "A number of pupils have been absent this week due to illness.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["The number of visitors have increased.", "The number of visitors has increased.", "The number of visitors are increased.", "The number of visitors were increased.", "The number of visitors be increased."],
            intCorrect: "The number of visitors has increased.",
            intExplanation: "'THE number of' is about the number itself — one number — so it's 'has'. Remember: THE = one thing, A = many."
          },
          {
            name: "Grace",
            scenario: "is checking her essay",
            sentence: "Neither the teacher nor the pupils was aware of the problem.",
            mistake: "'Was' should be 'were' — with 'neither...nor', the verb matches the nearest word. 'Pupils' is nearest and means more than one.",
            corrected: "Neither the teacher nor the pupils were aware of the problem.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["Either the cake or the biscuits is ready.", "Either the cake or the biscuits are ready.", "Either the cake or the biscuits was ready.", "Either the cake or the biscuits has ready.", "Either the cake or the biscuits be ready."],
            intCorrect: "Either the cake or the biscuits are ready.",
            intExplanation: "'Biscuits' is nearest to the verb and means more than one, so it's 'are'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => v.name + " " + v.scenario + ". Something is wrong here:\\n\\n**\\"" + v.sentence + "\\"**",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => v.mistake,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.sentence + '"', why: v.mistake },
                  { text: 'Right: "' + v.corrected + '"', why: "Now the verb matches the real subject!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "WorkedExample", props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true }) },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
              incorrect: (v) => "Not quite! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "You're a mistake-spotting expert!",
            body: () => "Always check: what is the REAL subject of the sentence?",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Cross out 'of...' phrases", why: "They hide the real subject" },
                  { text: "With neither/nor: look at the nearest word", why: "The verb matches whichever word is closest" },
                  { text: "THE number of = one thing. A number of = many", why: "This is a favourite exam trick!" }
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
  // SUB-CONCEPT: Future Perfect Tense
  // Category: supporting — 2 lessons
  // ==========================================
  {
    id: "future-perfect",
    name: "Future Perfect — Finished Before a Deadline",
    category: "supporting",
    lessons: [
      {
        id: "future-perfect-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to talk about things that will be **finished** before a future time",
          "How to spot the trigger words that tell you this special verb form is needed"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is talking about her 11+ preparation",
            sentence: "By next September, she will have completed all her preparation.",
            trigger: "By next September",
            wrong: "By next September, she will complete all her preparation.",
            whyWrong: "'Will complete' just says she'll do it sometime. 'Will have completed' means she'll have **already finished** by that date.",
            intQuestion: "Choose the correct form: 'By the end of this term, we ___ all our times tables.'",
            intOptions: ["learn", "learned", "will learn", "will have learned", "are learning"],
            intCorrect: "will have learned",
            intExplanation: "'Will have learned' tells us the learning will be **finished** before the end of term. The 'by' is the clue!"
          },
          {
            name: "Oliver",
            scenario: "is writing about his exam timetable",
            sentence: "By Friday, we will have finished all our exams.",
            trigger: "By Friday",
            wrong: "By Friday, we will finish all our exams.",
            whyWrong: "'Will finish' doesn't say the exams will be done BEFORE Friday. 'Will have finished' makes it clear they'll be completed by then.",
            intQuestion: "Choose the correct form: 'By this time next year, I ___ primary school.'",
            intOptions: ["finish", "finished", "will finish", "will have finished", "am finishing"],
            intCorrect: "will have finished",
            intExplanation: "'Will have finished' is correct — it tells us primary school will be done before 'this time next year'."
          },
          {
            name: "Amira",
            scenario: "is describing her reading goal",
            sentence: "By Christmas, she will have read fifty books this year.",
            trigger: "By Christmas",
            wrong: "By Christmas, she will read fifty books this year.",
            whyWrong: "'Will read' just means she'll read them at some point. 'Will have read' means the fifty books will be **done** by Christmas.",
            intQuestion: "Choose the correct form: 'By the time Mum arrives, we ___ the house.'",
            intOptions: ["clean", "cleaned", "will clean", "will have cleaned", "are cleaning"],
            intCorrect: "will have cleaned",
            intExplanation: "'Will have cleaned' tells us the cleaning will be finished BEFORE Mum arrives. Look for 'by the time' as a trigger!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s future deadline",
            body: (v) => v.name + " " + v.scenario + ".\\n\\n**\\"" + v.sentence + "\\"**\\n\\nThis sentence talks about something that will be **finished before** a future time.",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence, highlightWords: ["will", "have"] }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "How to build this verb form",
            body: () => "It's actually really simple — just three words put together:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "The pattern: will + have + done-word", why: "Three parts put together" },
                  { text: "The trigger: '" + v.trigger + "'", why: "When you see 'by + a future time', that's your clue!" },
                  { text: 'Wrong: "' + v.wrong + '"', why: v.whyWrong },
                  { text: 'Right: "' + v.sentence + '"', why: "This makes it clear it'll be DONE by the deadline" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct form: ", ""), highlightWords: ["___"] }) },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Amazing! " + v.intExplanation + " ✓",
              incorrect: (v) => "Not quite! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "Future perfect — nailed it!",
            body: () => "Here's your quick recipe:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Pattern: will + have + done-word", why: "e.g. 'will have finished', 'will have completed'" },
                  { text: "Trigger: 'by + future time'", why: "'By Friday', 'By next year', 'By the time...'" },
                  { text: "It means: completely DONE before the deadline", why: "Not just happening — finished!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "future-perfect-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when a sentence needs 'will have' instead of just 'will'"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "is checking his writing",
            sentence: "By the end of the week, I will finish my project.",
            mistake: "'Will finish' should be 'will have finished' because 'by the end of the week' tells us there's a deadline.",
            corrected: "By the end of the week, I will have finished my project.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By June, she will pass all her exams.", "By June, she will have passed all her exams.", "By June, she will had passed all her exams.", "By June, she will has passed all her exams.", "By June, she will been passed all her exams."],
            intCorrect: "By June, she will have passed all her exams.",
            intExplanation: "'By June' is the trigger — it tells us the exams need to be DONE by then, so it's 'will have passed'."
          },
          {
            name: "Grace",
            scenario: "found an error in her homework",
            sentence: "By next Monday, the builders will repair the roof.",
            mistake: "With 'by next Monday', we need 'will have repaired' to show the repair will be done before Monday.",
            corrected: "By next Monday, the builders will have repaired the roof.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By tonight, I will read three chapters.", "By tonight, I will have read three chapters.", "By tonight, I will had read three chapters.", "By tonight, I will has read three chapters.", "By tonight, I will reading three chapters."],
            intCorrect: "By tonight, I will have read three chapters.",
            intExplanation: "'By tonight' is the deadline trigger. 'Will have read' tells us the three chapters will be done by then."
          },
          {
            name: "Ben",
            scenario: "is practising for the exam",
            sentence: "By the time we get there, the show will start.",
            mistake: "'Will start' should be 'will have started' — 'by the time' tells us the show starts BEFORE we arrive.",
            corrected: "By the time we get there, the show will have started.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By 2030, scientists will discover a cure.", "By 2030, scientists will have discovered a cure.", "By 2030, scientists will had discovered a cure.", "By 2030, scientists will has discovered a cure.", "By 2030, scientists will discovering a cure."],
            intCorrect: "By 2030, scientists will have discovered a cure.",
            intExplanation: "'By 2030' is the future deadline. 'Will have discovered' means the discovery will be complete by then."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => v.name + " " + v.scenario + ". Something isn't quite right:\\n\\n**\\"" + v.sentence + "\\"**",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => v.mistake,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.sentence + '"', why: v.mistake },
                  { text: 'Right: "' + v.corrected + '"', why: "Now it's clear the action is finished before the deadline" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "WorkedExample", props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true }) },
            interaction: {
              type: "multiple-choice",
              question: (v) => v.intQuestion,
              options: (v) => v.intOptions,
              correctIndex: (v) => v.intOptions.indexOf(v.intCorrect),
              correct: (v) => "Superstar! " + v.intExplanation + " ✓",
              incorrect: (v) => "Nearly there! " + v.intExplanation
            }
          },
          {
            type: "consolidate",
            title: () => "Deadline detector — activated!",
            body: () => "Whenever you see 'by + future time', check if you need 'will have':",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Spot the trigger: 'by Friday', 'by next year', 'by the time...'", why: "These all mean there's a deadline" },
                  { text: "Use: will + have + done-word", why: "'Will have finished', 'will have completed'" },
                  { text: "It means: completely DONE before the deadline", why: "That's the future perfect!" }
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
`;
